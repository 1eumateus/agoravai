import Model from "./Model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;
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
                    dataCriacao: 1,
                    fases: 1,
                    ultimaVisualizacaoAluno: 1,
                    ultimaVisualizacaoProfessor: 1,
                    cancelamento: 1,
                }
            },
            {
                $lookup: {
                    from: 'usuarios',
                    localField: 'professor',
                    foreignField: '_id',
                    as: 'professor',
                    pipeline: [
                        { $project: { nome: 1, sobrenome: 1, email:1, interesse: 1, imagem: 1, _id: 1 } }
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
                        { $project: { nome: 1, sobrenome: 1, email: 1, imagem: 1, _id: 1 } }
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
            const notificacao = novidadeMaisRecente (o, userTipo);
            o.notificacao = !!notificacao;
            o.notificacaoDetalhe = notificacao;
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

function novidadeMaisRecente (orientacao, userTipo) {
    const desde = userTipo === 'aluno' ? orientacao.ultimaVisualizacaoAluno : orientacao.ultimaVisualizacaoProfessor;
    const dataDesde = desde ? new Date (desde) : new Date (0);
    let maisRecente = null;
    for (const fase of orientacao.fases || []) {
        if (userTipo === 'professor') {
            for (const arquivo of fase.arquivos || []) {
                const data = new Date (arquivo.dataEnvio);
                if (data > dataDesde && (!maisRecente || data > maisRecente.data)) {
                    maisRecente = { tipo: 'arquivo', texto: arquivo.originalname, fase: fase.nome, data };
                }
            }
        }
        for (const comentario of fase.comentarios || []) {
            const data = new Date (comentario.data);
            if (comentario.autor !== userTipo && data > dataDesde && (!maisRecente || data > maisRecente.data)) {
                maisRecente = { tipo: 'comentario', texto: comentario.texto, fase: fase.nome, data };
            }
        }
    }
    return maisRecente;
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
            if (req.body.situacao === 'negado' && !req.body.resposta?.trim ()) {
                return res.status (400).json ({ msg: 'Justifique o motivo.' });
            }
            orientacao.situacao = req.body.situacao;
            orientacao.resposta = req.body.resposta;
            msg = 'Resposta enviada.'
        }
        if (userTipo === 'aluno') {
            if (orientacao.situacao === 'confirmado') {
                return res.status (400).json ({ msg: 'Para uma orientação confirmada, solicite o cancelamento.' });
            }
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
                        { $project: { nome: 1, sobrenome: 1, email: 1, imagem: 1, _id: 1 } }
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
        if (!orientacao [0].coorientador) {
            orientacao [0].coorientador = { nome: '', instituicao: '' };
        }

        res.json ({ orientacao: orientacao [0] });
    } catch (error) {
        return res.status (400).json ({msg: 'Erro ao procurar dados da orientação.'});
    }
}

async function listarPublicas (req, res) {
    try {
        const filtro = { ativo: true, situacao: 'confirmado', dataDefesa: { $gte: new Date () } };
        const item = await Model.aggregate ([
            { $match: filtro },
            { $sort: { dataDefesa: 1, horaDefesa: 1 } },
            {
                $lookup: {
                    from: 'usuarios',
                    localField: 'professor',
                    foreignField: '_id',
                    as: 'professor',
                    pipeline: [{ $project: { nome: 1, sobrenome: 1, _id: 0 } }]
                },
            },
            {
                $lookup: {
                    from: 'usuarios',
                    localField: 'aluno',
                    foreignField: '_id',
                    as: 'aluno',
                    pipeline: [{ $project: { nome: 1, sobrenome: 1, _id: 0 } }]
                },
            },
            { $unwind: { path: '$aluno', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$professor', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 0,
                    tema: 1,
                    aluno: 1,
                    professor: 1,
                    banca: 1,
                    coorientador: 1,
                    dataDefesa: 1,
                    horaDefesa: 1,
                    local: 1,
                    presencial: 1,
                    link: 1,
                }
            },
        ]);
        res.status (200).json ({ item });
    } catch (error) {
        console.log (error);
        return res.status (400).json ({ msg: 'Erro ao buscar defesas.' });
    }
}

export { listar, criar, deletar, alterarSituacao, editar, pegarPorId, orientacaoPorProfessor, listarPublicas };
