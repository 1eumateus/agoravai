import Model from "./Model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;
import PDFDocument from 'pdfkit';
import axios from "axios";
import { pipeline } from 'stream';
import fs from 'fs';
import { sendEmail } from '../shared/Mailer.js';

async function listar (req, res) {
    try {
        const token = req.headers.authorization;
        const {userID, userTipo } = jwt.verify (token, process.env.JWT_SECRET, (err, usuario) => {
            if (err) return false;
            return {userID: usuario._id, userTipo: usuario.tipo};
        });
        if (!userID) return res.status (400);
        const filtro = {ativo: true}
        if (userTipo === 'aluno') {
            filtro.aluno = new ObjectId (String (userID));
        }
        if (userTipo === 'professor'){
            filtro.professor = new ObjectId (String (userID));
        }
        const item = await Model.aggregate ([
            { $match: filtro },  
            {
                $project: {    
                    _id: 1,       
                    professor: 1,
                    aluno: 1,
                    ativo: 1,
                    situacao: 1,
                    proposta: 1,
                    resposta:1,
                    coorientador: 1,
                    dataDefesa: 1,
                    horaDefesa: 1,
                    fases: 1,
                    ultimaVisualizacaoAluno: 1,
                    ultimaVisualizacaoProfessor: 1,
                }
            },
            {
                $lookup: {
                    from: 'usuarios',
                    localField: 'professor',
                    foreignField: '_id',
                    as: 'professor',
                    pipeline: [
                        { $project: { nome: 1, sobrenome: 1, email:1, interesse: 1, _id: 1 } }
                    ]
                },
            },
            {
                $lookup: {
                    from: 'usuarios',
                    localField: 'aluno',
                    foreignField: '_id',
                    as: 'aluno',
                    pipeline: [
                        { $project: { nome: 1, sobrenome: 1, email: 1,  _id: 1 } }
                    ]
                },
            },
            {
                $unwind: {
                    path: '$aluno',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: '$professor',
                    preserveNullAndEmptyArrays: true
                }
            },
        ]);
        item.forEach ((o) => {
            o.notificacao = temNovidade (o, userTipo);
            delete o.fases;
            delete o.ultimaVisualizacaoAluno;
            delete o.ultimaVisualizacaoProfessor;
        });
        res.status (200).json ({ item });
    } catch (error) {
        console.log (error);
        return res.status (400).json ({msg: 'Erro ao buscar solicitações'});
    }
}

function temNovidade (orientacao, userTipo) {
    const desde = userTipo === 'aluno' ? orientacao.ultimaVisualizacaoAluno : orientacao.ultimaVisualizacaoProfessor;
    const dataDesde = desde ? new Date (desde) : new Date (0);
    for (const fase of orientacao.fases || []) {
        if (userTipo === 'professor') {
            for (const arquivo of fase.arquivos || []) {
                if (new Date (arquivo.dataEnvio) > dataDesde) return true;
            }
        }
        for (const comentario of fase.comentarios || []) {
            if (comentario.autor !== userTipo && new Date (comentario.data) > dataDesde) return true;
        }
    }
    return false;
}

async function criar (req, res) {
    try {
        let orientacao = await Model.findOne (
            { ativo: true, aluno: req.body.aluno, professor: req.body.professor });
        if (orientacao) return res.status (400).json ({ msg: "Pedido de orientação já realizada." });
        const novo = new Model ({
            ativo: true,
            aluno: req.body.aluno,
            professor: req.body.professor,
            proposta: req.body.proposta,
        });
        await novo.save ();
        if (req.body.emailProfessor && req.body.nomeAluno){
            let err = sendEmail (
                req.body.emailProfessor,
                'SOTCC - Solicitação de orientação',
                `<h3>O aluno ${req.body.nomeAluno} deseja ser orientado por você, entre para ver mais detalhes.<h3/><a href='${process.env.HOST_ROOT}/ui/login'>Clique aqui para entrar no sistema.</a>`,
            );
            if (err == true){ 
                return res.status (400).json ({ msg: "Erro ao enviar email de confirmação." });
            }
        }
        res.json ({ id: novo._id, msg: 'Pedido de orientação enviado.' });
    } catch (error) {
        console.log (error);
        return res.status (400).json ({ msg: "Erro ao solicitar orientação." });
    }
}

async function editar (req, res) {
    try {
        let editar = await Model.findOne ({ ativo:true, _id: req.body._id });
        if (!editar) {
            return res.status (404).json ({ error: "Orientação não encontrada." });
        }
        editar.aluno = req.body.aluno;
        editar.professor = req.body.professor;
        editar.ativo = req.body.ativo;
        editar.situacao = req.body.situacao;
        editar.proposta = req.body.proposta;
        editar.resposta = req.body.resposta;
        editar.banca = req.body.banca;
        editar.coorientador = req.body.coorientador;
        editar.dataDefesa = req.body.dataDefesa;
        editar.horaDefesa = req.body.horaDefesa;
        editar.tema = req.body.tema;
        editar.link = req.body.link;
        editar.presencial = req.body.presencial;
        editar.local = req.body.local;
        await editar.save ();
        res.status (200).json ({ msg: "Orientação editada com sucesso." });
    } catch (error) {
        console.log (error);
        return res.status (400);
    }
}

async function deletar (req, res) {
    try {
        const deletar = await Model.findOne ({ ativo:true, _id: req.params.id });
        if (!deletar) {
            return res.status (404).json ({ error: "Orientação não encontrada." });
        }
        deletar.ativo = false;
        await deletar.save ();
        res.status (200).json ({msg: 'Pedido de orientação deletada.'});
    } catch (error) {
        console.log (error);
        return res.status(400).json ({msg: 'Erro ao deletar orientação.'});
    }
}

async function alterarSituacao (req, res) {
    try {
        const token = req.headers.authorization;
        const {userID, userTipo} = jwt.verify (token, process.env.JWT_SECRET, (err, usuario) => {
            if (err) return false;
            return {userID: usuario._id, userTipo: usuario.tipo};
        });
        if (!userID) return res.status (400);
        const orientacao = await Model.findOne ({ ativo:true, _id: req.body.id });
        if (!orientacao) {
            return res.status (404).json ({ msg: "Orientação não encontrada." });
        }
        let msg= ''
        if (userTipo === 'professor') {
            orientacao.situacao = req.body.situacao;
            orientacao.resposta = req.body.resposta;
            msg = 'Resposta enviada.'
        }
        if (userTipo === 'aluno') {
            orientacao.ativo = false;
            msg = 'Pedido de orientação cancelada.'
        }
        await orientacao.save ();
        return res.status (200).json ({msg: msg});
    } catch (error) {
        return res.status (400).json ({msg: 'Erro ao cancelar orientação.'});
    }
}

async function orientacaoPorProfessor (req, res) {
    try {
        const filtro = { ativo: true, professor: req.params.id, situacao: 'confirmado' };
        const count = await Model.countDocuments (filtro);
        res.json (count);
    } catch (error) {
        return res.status (400).json ({msg: 'Erro ao procurar dados da orientação.'});
    }
}

async function pegarPorId (req, res) {
    try {
        const filtro = { ativo: true,  _id: new ObjectId (String (req.params.id)) };
        const orientacao = await Model.aggregate ([
            { $match: filtro },  
            {
                $lookup: {
                    from: 'usuarios',
                    localField: 'professor',
                    foreignField: '_id',
                    as: 'professor',
                    pipeline: [
                        { $project: { nome: 1, sobrenome: 1, email:1, interesse: 1, _id: 1 } }
                    ]
                },
            },
            {
                $lookup: {
                    from: 'usuarios',
                    localField: 'aluno',
                    foreignField: '_id',
                    as: 'aluno',
                    pipeline: [
                        { $project: { nome: 1, sobrenome: 1, email: 1,  _id: 1 } }
                    ]
                },
            },
            {
                $unwind: {
                    path: '$aluno',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: '$professor',
                    preserveNullAndEmptyArrays: true
                }
            },
        ]);
        if (!orientacao [0]) {
            return res.status (404).json ({ msg: "Orientação não encontrada." });
        }

        res.json ({ orientacao: orientacao [0] });
    } catch (error) {
        return res.status (400).json ({msg: 'Erro ao procurar dados da orientação.'});
    }
}

async function gerarConvite (req, res) {
    try {
        const form = req.body;
        const doc = new PDFDocument ({
            size: 'A4', 
            margin: 20  
        });
        res.setHeader ('Content-Type', 'application/pdf');
        res.setHeader ('Content-Disposition', 'attachment; filename=convite.pdf');
        const pathFundo = 'public/fundoCartaz.jpg';
        doc.image (pathFundo, 0, 0, { width: doc.page.width, height: doc.page.height });
        doc.moveDown ();
        for (let i = 0; i < 15; i ++) {
            doc.moveDown ();  // Para espaçamento
        }
        doc.fontSize (16).text ('UNIVERSIDADE FEDERAL DO PARÁ', { align: 'center', lineGap: 8 });
        doc.text ('CAMPUS UNIVERSITÁRIO DE TUCURUÍ', { align: 'center', lineGap: 8 });
        doc.text ('FACULDADE DE ENGENHARIA DE COMPUTAÇÃO', { align: 'center', lineGap: 8 });
        doc.moveDown ();
        doc.moveDown ();
        doc.fontSize (16).text (`${form.tema}`, { align: 'center' });
        doc.fontSize (16).text (`${form.aluno.nome} ${form.aluno.sobrenome}`, { align: 'center' });
        doc.moveDown ();
        doc.moveDown ();
        doc.fontSize (16).text (`BANCA EXAMINADORA:`, { align: 'center', lineGap: 4 });
        doc.fontSize (16).text (`${form.professor.nome} ${form.professor.sobrenome} (UFPA/FECOMP)`, { align: 'center' });
        doc.fontSize (16).text (`Orientador`, { align: 'center' });
        if (form.coorientador.nome) {
            doc.moveDown ();
            doc.fontSize (16).text (`${form.coorientador.nome?.trim()} ${form.coorientador.instituicao ? `(${form.coorientador.instituicao})` : ''}`, { align: 'center' });
            doc.fontSize (16).text (`Coorientador`, { align: 'center' });
        }
        form.banca.forEach ((membro) => {
            doc.moveDown ();
            doc.fontSize (16).text (`${membro.nome?.trim()} ${membro.instituicao ? `(${membro.instituicao?.trim()})` : ''}`, { align: 'center' });
            doc.fontSize (16).text (`Examinador`, { align: 'center' });
        });
        doc.moveDown ();
        doc.moveDown ();
        doc.moveDown ();
        doc.fontSize (16).text (`DATA E HORA: (${formatarData(form.dataDefesa)} às ${form.horaDefesa})`, { align: 'left' });
        if (form.presencial && form.local?.trim ()){
            doc.moveDown ();
            doc.fontSize (16).text (`LOCAL: ${form.local}`, { align: 'left', lineGap: 8 });
        }
        if (form.link?.trim () && !form.presencial) {
            const qrCodeResponse = await axios.get (`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(form.link)}`, { responseType: 'arraybuffer' });
            const qrCodeBuffer = Buffer.from (qrCodeResponse.data, 'binary');
            const qrCodePath = 'temp/qrcode.png';
            fs.writeFileSync (qrCodePath, qrCodeBuffer);
            const qrCodeWidth = 100;
            const qrCodeHeight = 100;
            doc.moveDown ();
            doc.fontSize (16).text (`LOCAL VIRTUAL: ${form.link}`, { align: 'left', lineGap: 8 });
            doc.fontSize (16).text (`Acesse também pelo QRCode`, { align: 'left', lineGap: 8 });
            doc.image (qrCodePath, doc.page.width - qrCodeWidth - doc.page.margins.right, doc.y - qrCodeHeight, { width: qrCodeWidth, height: qrCodeHeight });
        }    
        doc.end ();
        pipeline (doc, res, (err) => {
            if (err) {
                console.error ('Erro ao gerar o PDF:', err);
                return res.status (500).json ({ msg: "Erro ao gerar convite." });
            }
            console.log ("Cartaz gerado com sucesso.");
        });
    } catch (error) {
        console.error ('error:', error);
        return res.status (400).json ({ msg: "Erro ao gerar convite." });
    }
}

async function visualizarFases (req, res) {
    try {
        const token = req.headers.authorization;
        const {userID, userTipo} = jwt.verify (token, process.env.JWT_SECRET, (err, usuario) => {
            if (err) return false;
            return {userID: usuario._id, userTipo: usuario.tipo};
        });
        if (!userID) return res.status (400);
        const orientacao = await Model.findOne ({ ativo: true, _id: req.params.id });
        if (!orientacao) return res.status (404).json ({ msg: 'Orientação não encontrada.' });
        if (userTipo === 'aluno' && String (orientacao.aluno) === String (userID)) {
            orientacao.ultimaVisualizacaoAluno = new Date ();
        } else if (userTipo === 'professor' && String (orientacao.professor) === String (userID)) {
            orientacao.ultimaVisualizacaoProfessor = new Date ();
        } else {
            return res.status (403).json ({ msg: 'Você não faz parte desta orientação.' });
        }
        await orientacao.save ();
        res.status (200).json ({});
    } catch (error) {
        console.log (error);
        return res.status (400).json ({});
    }
}

async function enviarArquivoFase (req, res) {
    try {
        const token = req.headers.authorization;
        const {userID, userTipo} = jwt.verify (token, process.env.JWT_SECRET, (err, usuario) => {
            if (err) return false;
            return {userID: usuario._id, userTipo: usuario.tipo};
        });
        if (!userID) return res.status (400);
        const orientacao = await Model.findOne ({ ativo: true, _id: req.params.id });
        if (!orientacao) return res.status (404).json ({ msg: 'Orientação não encontrada.' });
        if (userTipo !== 'aluno' || String (orientacao.aluno) !== String (userID)) {
            return res.status (403).json ({ msg: 'Apenas o aluno desta orientação pode enviar arquivos.' });
        }
        if (orientacao.situacao !== 'confirmado') {
            return res.status (400).json ({ msg: 'Orientação ainda não confirmada.' });
        }
        const faseIndex = Number (req.params.faseIndex);
        const fase = orientacao.fases [faseIndex];
        if (!fase) return res.status (404).json ({ msg: 'Fase não encontrada.' });
        const faseAtualIndex = orientacao.fases.findIndex ((f) => f.situacao !== 'aprovada');
        if (faseAtualIndex !== -1 && faseIndex !== faseAtualIndex) {
            return res.status (400).json ({ msg: 'Você só pode enviar arquivos para a fase atual.' });
        }
        if (!req.file) return res.status (400).json ({ msg: 'Nenhum arquivo enviado.' });
        fase.arquivos.push ({
            originalname: req.file.originalname,
            filename: req.file.filename,
            path: req.file.path,
            size: req.file.size,
        });
        await orientacao.save ();
        res.status (200).json ({ msg: 'Arquivo enviado com sucesso.' });
    } catch (error) {
        console.log (error);
        return res.status (400).json ({ msg: 'Erro ao enviar arquivo.' });
    }
}

async function removerArquivoFase (req, res) {
    try {
        const token = req.headers.authorization;
        const {userID, userTipo} = jwt.verify (token, process.env.JWT_SECRET, (err, usuario) => {
            if (err) return false;
            return {userID: usuario._id, userTipo: usuario.tipo};
        });
        if (!userID) return res.status (400);
        const orientacao = await Model.findOne ({ ativo: true, _id: req.params.id });
        if (!orientacao) return res.status (404).json ({ msg: 'Orientação não encontrada.' });
        if (userTipo !== 'aluno' || String (orientacao.aluno) !== String (userID)) {
            return res.status (403).json ({ msg: 'Apenas o aluno desta orientação pode remover arquivos.' });
        }
        const faseIndex = Number (req.params.faseIndex);
        const fase = orientacao.fases [faseIndex];
        if (!fase) return res.status (404).json ({ msg: 'Fase não encontrada.' });
        if (fase.situacao === 'aprovada') {
            return res.status (400).json ({ msg: 'Fase já aprovada, não é possível remover arquivos.' });
        }
        const arquivo = fase.arquivos.id (req.params.arquivoId);
        if (!arquivo) return res.status (404).json ({ msg: 'Arquivo não encontrado.' });
        if (arquivo.path && fs.existsSync (arquivo.path)) {
            fs.unlinkSync (arquivo.path);
        }
        arquivo.deleteOne ();
        await orientacao.save ();
        res.status (200).json ({ msg: 'Arquivo removido.' });
    } catch (error) {
        console.log (error);
        return res.status (400).json ({ msg: 'Erro ao remover arquivo.' });
    }
}

async function comentarFase (req, res) {
    try {
        const token = req.headers.authorization;
        const {userID, userTipo} = jwt.verify (token, process.env.JWT_SECRET, (err, usuario) => {
            if (err) return false;
            return {userID: usuario._id, userTipo: usuario.tipo};
        });
        if (!userID) return res.status (400);
        const orientacao = await Model.findOne ({ ativo: true, _id: req.params.id });
        if (!orientacao) return res.status (404).json ({ msg: 'Orientação não encontrada.' });
        const dono = userTipo === 'aluno' ? orientacao.aluno : orientacao.professor;
        if (userTipo === 'admin' || String (dono) !== String (userID)) {
            return res.status (403).json ({ msg: 'Você não faz parte desta orientação.' });
        }
        if (!req.body.texto?.trim ()) return res.status (400).json ({ msg: 'Escreva um comentário.' });
        const fase = orientacao.fases [Number (req.params.faseIndex)];
        if (!fase) return res.status (404).json ({ msg: 'Fase não encontrada.' });
        fase.comentarios.push ({ autor: userTipo, texto: req.body.texto.trim () });
        await orientacao.save ();
        res.status (200).json ({ msg: 'Comentário enviado.' });
    } catch (error) {
        console.log (error);
        return res.status (400).json ({ msg: 'Erro ao enviar comentário.' });
    }
}

async function avaliarFase (req, res) {
    try {
        const token = req.headers.authorization;
        const {userID, userTipo} = jwt.verify (token, process.env.JWT_SECRET, (err, usuario) => {
            if (err) return false;
            return {userID: usuario._id, userTipo: usuario.tipo};
        });
        if (!userID) return res.status (400);
        const orientacao = await Model.findOne ({ ativo: true, _id: req.params.id });
        if (!orientacao) return res.status (404).json ({ msg: 'Orientação não encontrada.' });
        if (userTipo !== 'professor' || String (orientacao.professor) !== String (userID)) {
            return res.status (403).json ({ msg: 'Apenas o orientador desta orientação pode aprovar fases.' });
        }
        const faseIndex = Number (req.params.faseIndex);
        const fase = orientacao.fases [faseIndex];
        if (!fase) return res.status (404).json ({ msg: 'Fase não encontrada.' });
        if (fase.arquivos.length === 0) {
            return res.status (400).json ({ msg: 'O aluno ainda não enviou nenhum arquivo nesta fase.' });
        }
        fase.situacao = 'aprovada';
        if (req.body.texto?.trim ()) {
            fase.comentarios.push ({ autor: 'professor', texto: req.body.texto.trim () });
        }
        await orientacao.save ();
        res.status (200).json ({ msg: 'Fase aprovada.' });
    } catch (error) {
        console.log (error);
        return res.status (400).json ({ msg: 'Erro ao aprovar fase.' });
    }
}

function formatarData (value) {
    if (!value) return '';
    const data = new Date (value);
    const ano = data.getUTCFullYear ();
    const mes = String (data.getUTCMonth () + 1).padStart (2, '0');
    const dia = String (data.getUTCDate ()).padStart (2, '0');
    return `${dia}/${mes}/${ano}`;
}

export { listar, criar, deletar, alterarSituacao, editar, pegarPorId, gerarConvite, orientacaoPorProfessor, enviarArquivoFase, removerArquivoFase, comentarFase, avaliarFase, visualizarFases };