import Model from "./Model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;
import PDFDocument from 'pdfkit';
import axios from "axios";
import { pipeline } from 'stream';
import fs from 'fs';
import nodemailer from 'nodemailer'

async function listar(req, res) {
    try {
        const token = req.headers.authorization;
       
        const {userID, userTipo }= jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
            if (err) return false;
            return {userID: usuario._id, userTipo: usuario.tipo};
        });
        if (!userID) return res.status(400);

        const filtro = {ativo: true}

        if(userTipo === 'aluno'){
            filtro.aluno = new ObjectId(String(userID));
        }
        if(userTipo === 'professor'){
            filtro.professor = new ObjectId(String(userID));
        }

        const item = await Model.aggregate([
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

        res.status(200).json({ item });
    } catch (error) {
        return res.status(400).json({msg: 'Erro ao buscar solicitações'});
    }
}

async function criar(req, res) {
    try {
        let orientacao = await Model.findOne(
            { ativo: true, aluno: req.body.aluno, professor: req.body.professor });

        if (orientacao) return res.status(400).json({ msg: "Pedido de orientação já realizada." });

        const novo = new Model({
            ativo: true,
            aluno: req.body.aluno,
            professor: req.body.professor,
            proposta: req.body.proposta,
        });

        await novo.save();

        // if(req.body.emailProfessor && req.body.nomeAluno){
        //     const transport = nodemailer.createTransport({
        //         host: 'smtp.gmail.com',
        //         port: 465,
        //         secure: true,
        //         auth:{
        //             user: process.env.EMAIL,
        //             pass: process.env.SENHA,
        //         },
        //         connectionTimeout: 20000
        //     })

        //     let err = false;
        //     await transport.sendMail({
        //         from: 'SOTCC',
        //         to: req.body.emailProfessor,
        //         subject: 'SOTCC - Solicitação de orientação',
        //         html: `<h3>O aluno ${req.body.nomeAluno} deseja ser orientado por você, entre para ver mais detalhes.<h3/><a href='http://localhost:4444/login'>Clique aqui para entrar no sistema.</a>`,
        //     })
        //     .then(()=>err = false)
        //     .catch(()=> err = true)
        //     transport.close();
        //     if(err){
        //         return res.status(400).json({ msg: "Erro ao enviar email de confirmação." })
        //     }
        // }

        res.json({ id: novo._id, msg: 'Pedido de orientação enviado.' });

    } catch (error) {
        return res.status(400).json({ msg: "Erro ao solicitar orientação." });
    }
}

async function editar(req, res) {
    try {
        let editar = await Model.findOne({ ativo:true, _id: req.body._id });
       
        if (!editar) {
            return res.status(404).json({ error: "Orientação não encontrada." });
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

        await editar.save();
        res.status(200).json({ msg: "Orientação editada com sucesso." });
    } catch (error) {
        return res.status(400);
    }
}

async function deletar(req, res) {
    try {
        const deletar = await Model.findOne({ ativo:true, _id: req.params.id });
        if (!deletar) {
            return res.status(404).json({ error: "Orientação não encontrada." });
        }
        deletar.ativo = false;
        await deletar.save();
        res.status(200).json({msg: 'Pedido de orientação deletada.'});
    } catch (error) {
        return res.status(400).json({msg: 'Erro ao deletar orientação.'});
    }
}

async function alterarSituacao(req, res) {
    try {

        const token = req.headers.authorization;
        const {userID, userTipo }= jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
            if (err) return false;
            return {userID: usuario._id, userTipo: usuario.tipo};
        });
        if (!userID) return res.status(400);
        
        const orientacao = await Model.findOne({ ativo:true, _id: req.body.id });
 
        if (!orientacao) {
            return res.status(404).json({ msg: "Orientação não encontrada." });
        }
        
        let msg= ''
        if(userTipo === 'professor'){
            orientacao.situacao = req.body.situacao;
            orientacao.resposta = req.body.resposta;
             msg = 'Resposta enviada.'
        }
        if(userTipo === 'aluno'){
            orientacao.ativo = false;
            msg = 'Pedido de orientação cancelada.'
        }

        await orientacao.save();
        return res.status(200).json({msg: msg});
    } catch (error) {
        return res.status(400).json({msg: 'Erro ao cancelar orientação.'});
    }
}

async function orientacaoPorProfessor(req, res) {
    try {
        const filtro = { ativo: true, professor: req.params.id, situacao: 'confirmado' };
        const count = await Model.countDocuments(filtro);
        res.json(count);
    } catch (error) {
        return res.status(400).json({msg: 'Erro ao procurar dados da orientação.'});
    }
}

async function pegarPorId(req, res) {
    try {
        const filtro = { ativo: true,  _id: new ObjectId(String(req.params.id)) };
        
        const orientacao = await Model.aggregate([
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
        if (!orientacao[0]) {
            return res.status(404).json({ msg: "Orientação não encontrada." });
        }

        res.json({ orientacao: orientacao[0] });
    } catch (error) {
        return res.status(400).json({msg: 'Erro ao procurar dados da orientação.'});
    }
}

async function gerarConvite(req, res) {
    try {
        const form = req.body;

        const doc = new PDFDocument({
            size: 'A4', 
            margin: 20  
        });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=convite.pdf');

        const pathFundo = 'public/fundoCartaz.jpg';
        doc.image(pathFundo, 0, 0, { width: doc.page.width, height: doc.page.height });

        doc.moveDown();
        for (let i = 0; i < 15; i++) {
            doc.moveDown();  // Para espaçamento
        }

        doc.fontSize(16).text('UNIVERSIDADE FEDERAL DO PARÁ', { align: 'center', lineGap: 8 });
        doc.text('CAMPUS UNIVERSITÁRIO DE TUCURUÍ', { align: 'center', lineGap: 8 });
        doc.text('FACULDADE DE ENGENHARIA DE COMPUTAÇÃO', { align: 'center', lineGap: 8 });

        doc.moveDown();
        doc.moveDown();
        doc.fontSize(16).text(`${form.tema}`, { align: 'center' });
        doc.fontSize(16).text(`${form.aluno.nome} ${form.aluno.sobrenome}`, { align: 'center' });

        doc.moveDown();
        doc.moveDown();
        doc.fontSize(16).text(`BANCA EXAMINADORA:`, { align: 'center', lineGap: 4 });
        doc.fontSize(16).text(`${form.professor.nome} ${form.professor.sobrenome} (UFPA/FECOMP)`, { align: 'center' });
        doc.fontSize(16).text(`Orientador`, { align: 'center' });

        doc.moveDown();

        doc.fontSize(16).text(`${form.coorientador.nome} ${form.coorientador.instituicao ? `(${form.coorientador.instituicao})` : ''}`, { align: 'center' });
        doc.fontSize(16).text(`Coorientador`, { align: 'center' });

        form.banca.forEach((membro) => {
            doc.moveDown();
            doc.fontSize(16).text(`${membro.nome} ${membro.instituicao ? `(${membro.instituicao})` : ''}`, { align: 'center' });
            doc.fontSize(16).text(`Examinador`, { align: 'center' });
        });

        doc.moveDown();
        doc.moveDown();
        doc.moveDown();
        
        doc.fontSize(16).text(`DATA E HORA: (${formatarData(form.dataDefesa)} às ${form.horaDefesa})`, { align: 'left' });
        
        if (form.link?.trim()) {
            const qrCodeResponse = await axios.get(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(form.link)}`, { responseType: 'arraybuffer' });
            const qrCodeBuffer = Buffer.from(qrCodeResponse.data, 'binary');
            const qrCodePath = 'temp/qrcode.png';
            fs.writeFileSync(qrCodePath, qrCodeBuffer);

            const qrCodeWidth = 100;
            const qrCodeHeight = 100;

            doc.moveDown();
            doc.fontSize(16).text(`LOCAL VIRTUAL: ${form.link}`, { align: 'left', lineGap: 8 });
            doc.fontSize(16).text(`Acesse também pelo QRCode`, { align: 'left', lineGap: 8 });
            doc.image(qrCodePath, doc.page.width - qrCodeWidth - doc.page.margins.right, doc.y - qrCodeHeight, { width: qrCodeWidth, height: qrCodeHeight });
        }    

        doc.end();

        pipeline(doc, res, (err) => {
            if (err) {
                console.error('Erro ao gerar o PDF:', err);
                return res.status(500).json({ msg: "Erro ao gerar convite." });
            }
            console.log("Cartaz gerado com sucesso.");
        });

    } catch (error) {
        console.error('Erro ao gerar convite:', error);
        return res.status(400).json({ msg: "Erro ao gerar convite." });
    }
}

function formatarData(value) {
    if (!value) return '';
    const data = new Date(value);
    const ano = data.getUTCFullYear();
    const mes = String(data.getUTCMonth() + 1).padStart(2, '0');
    const dia = String(data.getUTCDate()).padStart(2, '0');
    return `${dia}/${mes}/${ano}`;
}

export { listar, criar, deletar, alterarSituacao, editar, pegarPorId, gerarConvite, orientacaoPorProfessor };