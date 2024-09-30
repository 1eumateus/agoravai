import Model from "./Model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer'
import axios from "axios";
import { decode } from 'html-entities';
import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;
import fs from 'fs';

function clean (text) {
    if (text.indexOf ('<dd:')) {
        text = text.substring (text.indexOf ('<dd>') + 4);
        text = text.substring (0, text.indexOf ('</dd>'));
    }
    text = text.replaceAll ('\n', '');
    text = text.replaceAll ('\t', '');
    if (text.indexOf ('n&#227;o cadastrad') != -1 || text.indexOf ('n&#227;o informad') != -1) {
        text = '';
    }
    while (text.charAt (0) == ' ') {
        text = text.substring (1);
    }
    while (text.charAt (text.length - 1) == ' ') {
        text = text.substring (0, text.length - 1);
    }
    return text;
}

function filtrarPerfil1 (text) {
    text = text.substring (text.indexOf ('<h4>Perfil Pessoal</h4>'));
    let descricao = text.substring (0, text.indexOf ('</div>'));
    descricao = clean (descricao)
    
    text = text.substring (text.indexOf ('<h4>Forma&#231;&#227;o Acad&#234;mica</h4>'));
    let formacao = text.substring (0, text.indexOf ('</div>'));
    formacao = clean (formacao);
    return {
        'descricao': descricao,
        'formacao': formacao,
        'interesse': '',
        'lattes': '',
    }
}

function filtrarPerfil2 (text) {
    text = text.substring (text.indexOf('<dl>') + 4);
    let descricao = text.substring (0, text.indexOf ('</dl>'));
    descricao = clean (descricao);
    
    text = text.substring (text.indexOf ('<dl>') + 4);
    let formacao = text.substring (0, text.indexOf ('</dl>'));
    formacao = clean (formacao);
    
    text = text.substring (text.indexOf ('<dl>') + 4);
    let interesse = text.substring (0, text.indexOf ('</dl>'));
    interesse = clean (interesse);
    
    text = text.substring (text.indexOf ('<dl>') + 4);
    let lattes = text.substring (0, text.indexOf ('</dl>'));
    if (lattes.indexOf ('n&#227;o informad') != -1)  lattes = '';
    else {
        lattes = lattes.substring (lattes.indexOf ('href') + 6);
        lattes = lattes.substring (0, lattes.indexOf ('"'));
    }

    return {
        'descricao': descricao,
        'formacao': formacao,
        'interesse': interesse,
        'lattes': lattes
    }
}

function filtrar (text) {
    let tipo = text.substring (0, text.indexOf ('<div id="contato">'));
    let dados = null

    if(tipo.indexOf ('<dl>')){
        dados = filtrarPerfil2 (text)
    }else{
        dados = filtrarPerfil1 (text);
    }
    
    let nome = text.substring(text.indexOf('<h3>') + 4, text.indexOf('</h3>'))?.trim();
    let nomePartes = nome.split(' ');
    dados['nome'] = nomePartes[0];
    dados['sobrenome'] = nomePartes?.slice(1)?.join(' ');

    text = text.substring (text.indexOf ('<div id="contato">'));
    
    dados ['telefone'] = text.substring(
        text.indexOf('<dd>', text.indexOf('Telefone/Ramal')) + 4, 
        text.indexOf('</dd>', text.indexOf('Telefone/Ramal')) 
    )?.trim();

    dados ['email'] = text.substring(
        text.indexOf('<dd>', text.indexOf('Endere&#231;o eletr&#244;nico')) + 4, 
        text.indexOf('</dd>', text.indexOf('Endere&#231;o eletr&#244;nico')) 
    )?.trim();
    
    return dados;
}

function formatHtmlTags(str) {
    return decode(str.replace(/<[^>]*>/g, ' '));
}

function formatTel(str) {
    return str.replace(/\D/g, ''); 
}

function formatNome(str) {
    return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase()); 
}

async function siape(req, res){
    try{
        let dados = null
        await axios.get(`https://sigaa.ufpa.br/sigaa/public/docente/portal.jsf?siape=${req.params.codigo}`)
        .then((response)=>{
            let perfil = filtrar (response.data);
            
            if(perfil.nome?.trim() && (perfil.nome?.trim() !== 'Docentes')){
                dados = {
                    nome: formatNome(formatHtmlTags(perfil.nome)),
                    sobrenome: formatNome(formatHtmlTags(perfil.sobrenome)),
                    formacao: formatHtmlTags(perfil.formacao),
                    interesse: formatHtmlTags(perfil.interesse),
                    email: formatHtmlTags(perfil.email),
                    lattes: formatHtmlTags(perfil.lattes),
                    telefone: formatTel(formatHtmlTags(perfil.telefone)),
                    descricao: formatHtmlTags(perfil.descricao)?.substring(0, 200),
                }
            }
        }).catch(()=>{
            return res.status(400).json({ msg: 'Tempo de consulta excedido.'})
        })
        if(!dados){
            return res.status(200).json({ msg: 'Nenhuma informação encontrada.'})
        }
        return res.status(200).json({dados, msg: 'Dados encontradas.'})
    }catch(error){
        return res.status(400).json({msg: 'Erro ao consultar dados do siape.'})
    }
}

async function listar(req, res) {
    try {
        const token = req.headers.authorization;
        const filtro = {ativo: true, verificado: true}
        const {userID, userTipo }= jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
            if (err) return false;
            return {userID: usuario._id, userTipo: usuario.tipo};
        });
        if (!userID) return res.status(400);

        if(userTipo !== 'admin'){
            return res.sendStatus(400);
        }

        const search = req.query.search || false;
        if (search) {
            filtro.$or = [
                { nome: { $regex: search, $options: "i" } },
                { sobrenome: { $regex: search, $options: "i" } }
            ];
        }

        const searchTipo = req.query.searchTipo || false;
        if (searchTipo) {
            filtro.$or = [
                { tipo: { $regex: searchTipo, $options: "i" } },
            ];
        }

        const item = await Model.aggregate([
            { $match: filtro },  
            {
                $project: {    
                    _id: 1,       
                    nome: 1,
                    sobrenome: 1,
                    descricao: 1,
                    tipo: 1,
                    disponibilidade: 1,
                    interesse: 1,
                }
            }
        ]);

        res.status(200).json({ item });
    } catch (error) {
        return res.sendStatus(400);
    }
}

async function listarProfessores(req, res) {
    try {
        const filtro = {ativo: true, verificado: true, tipo: 'professor'}

        const procurar = req.query.procurar || false;
        const procurarDisponibilidade = req.query.procurarDisponibilidade || false;
        const procurarInteresse = req.query.procurarInteresse || false;

        if (procurar) {
            filtro.$or = [
                { nome: { $regex: procurar, $options: "i" } },
                { sobrenome: { $regex: procurar, $options: "i" } }
            ];
        }

        if (procurarDisponibilidade) {
            filtro.disponibilidade = { $regex: procurarDisponibilidade, $options: "i" } 
        }
        if (procurarInteresse) {
            filtro.interesse = { $regex: procurarInteresse, $options: "i" } 
        }

        const item = await Model.aggregate([
            { $match: filtro },  
            {
                $project: {    
                    _id: 1,       
                    nome: 1,
                    sobrenome: 1,
                    descricao: 1,
                    tipo: 1,
                    disponibilidade: 1,
                    interesse: 1,
                    imagem: 1,
                }
            },
            { 
                $sort: { nome: 1 } 
            }
        ]);

        res.status(200).json({ item });
    } catch (error) {
        return res.sendStatus(400);
    }
}

async function criar(req, res) {
    try {
        const tokenUser = req.headers.authorization;

        const { userTipo } = jwt.verify(tokenUser, process.env.JWT_SECRET, (err, usuario) => {
            if (err) return false;
            return { userTipo: usuario.tipo };
        });

        let isNew = await Model.findOne({ ativo: true, verificado:false, email: req.body.email });
        if (isNew) return res.status(400).json({ msg: "Usuário já cadastrado." });

        if(req.body?.senha?.length < 6){
            return res.status(400).json({ msg: "Senha inválida." });
        }
        const hashSenha = await bcrypt.hash(req.body?.senha, 10);

        const novo = new Model({
            ativo: true,
            nome: req.body.nome,
            sobrenome: req.body.sobrenome,
            email: req.body.email,
            descricao: req.body.descricao,
            github: req.body.github,
            linkedin: req.body.linkedin,
            disponibilidade: req.body.disponibilidade,
            telefone: req.body.telefone,
            interesse: req.body.interesse,
            tipo: req.body.tipo,
            solicitacoes: req.body.solicitacoes,
            formacao: req.body.formacao,
            lattes: req.body.lattes,
            senha: hashSenha,
        });

        if(userTipo !== 'admin'){
            const transport = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth:{
                    user: process.env.EMAIL,
                    pass: process.env.SENHA,
                },
                connectionTimeout: 20000
            })

            let err = false;
            await transport.sendMail({
                from: 'SOTCC',
                to: req.body.email,
                subject: 'SOTCC - Email de confirmação',
                html: `<h3>Confirme seu email para entrar no sistema.<h3/><a href='http://localhost:4444/login?user=${novo._id}'>Clique para confirmar email.</a>`,
            })
            .then(()=>err = false)
            .catch(()=> err = true)
            transport.close();
            if(err){
                return res.status(400).json({ msg: "Erro ao enviar email de confirmação." })
            }
        }

        await novo.save();
        res.json({ 
            msg: 'Email de confirmação enviado.' 
        });

    } catch (error) {
        console.log(error)
        return res.status(400).json({ msg: "Erro 400." });
    }
}

async function editar(req, res) {
    try {
        let editar = await Model.findOne({ ativo:true, verificado: true, _id: req.body._id });
       
        if (!editar) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        let hashSenha = '';
        if (req.body.senha !== "") {
            hashSenha = await bcrypt.hash(req.body.senha, 10);
            editar.senha = hashSenha;
        }

        editar.nome = req.body.nome;
        editar.sobrenome = req.body.sobrenome;
        editar.email = req.body.email;
        editar.descricao = req.body.descricao;
        editar.github = req.body.github;
        editar.linkedin = req.body.linkedin;
        editar.disponibilidade = req.body.disponibilidade;
        editar.telefone = req.body.telefone;
        editar.instituicao = req.body.instituicao;
        editar.interesse = req.body.interesse;
        editar.tipo = req.body.tipo;
        editar.orientacoes = req.body.orientacoes;
        editar.formacao = req.body.formacao;
        editar.lattes= req.body.lattes;
        editar.ativo = true;

        await editar.save();
        res.status(200).json({ msg: "Usuário editado com sucesso." });
    } catch (error) {
        return res.status(400);
    }
}

async function adicionarOrientacao(req, res) {
    try {
        let editar = await Model.findOne({ ativo:true, verificado: true, _id: req.body.aluno });

        if (!editar) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }
        editar.orientacoes.push(req.body.orientacao);
        await editar.save();
        res.status(200).json({ msg: "Pedido de orientação enviado. Verifique seu perfil." });
    } catch (error) {
        return res.status(400);
    }
}

async function deletar(req, res) {
    try {
        const usuario = await Model.findOne({ ativo:true, _id: req.params.id });
        if (!usuario) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }
        usuario.ativo = false;
        await usuario.save();
        res.status(200);
    } catch (error) {
        return res.sendStatus(400);
    }
}

async function pegarPorId(req, res) {
    try {
        const token = req.headers.authorization;
        const filtro = { ativo: true, verificado: true, _id: new ObjectId(String(req.params.id)) };

        const { userID, userTipo } = jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
            if (err) return false;
            return { userID: usuario._id, userTipo: usuario.tipo };
        });

        if (!userID) return res.status(400);

        if (userTipo !== 'admin') {
            filtro.tipo = { $nin: ['admin'] };
        }

        const usuario = await Model.aggregate([
            { $match: filtro },  
            {
                $project: {    
                    senha: 0,       
                }
            },
        ]);

        if (!usuario[0]) {
            return res.sendStatus(404); 
        }
        res.json({ usuario: usuario[0] });
    } catch (error) {
        return res.sendStatus(400); 
    }
}

async function adicionarImagem(req, res) {
    try {

        const token = req.headers.authorization;
       
        const { userID }= jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
            if (err) return false;
            return {userID: usuario._id};
        });
        if (!userID) return res.status(400).json({msg: 'Usuário não encontrado.'});

        const file = req.file;
        if (!file) {
            return res.status(400).json({ msg: "Nenhum arquivo enviado." });
        }   

        let editar = await Model.findOne({ ativo:true, verificado: true, _id: userID });
        if (!editar) return res.status(400).json({msg: 'Usuário não encontrado.'});

        if (editar?.imagem?.path) {
            const imagePath = editar?.imagem?.path; 
           
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
        editar.imagem = file;
        await editar.save();
        res.status(200).json();

    } catch (error) {
        return res.status(400).json({ msg: "Erro ao salvar imagem." });
    }
}

export { listar, listarProfessores, siape, adicionarOrientacao, adicionarImagem, criar, deletar, editar, pegarPorId };