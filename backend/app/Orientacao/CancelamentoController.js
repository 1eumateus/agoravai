import Model from "./Model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from '../shared/Mailer.js';

// ponytail: "pendente" = tem solicitadoPor mas ainda não tem resposta. Depois
// de respondido, o cancelamento fica no documento só pra exibir o aviso por
// 24h (o front decide sumir; aqui só cuidamos de não travar novas ações).
function cancelamentoPendente (orientacao) {
    // Mongoose instancia o subobjeto "resposta" com os campos em null por
    // padrão (não fica undefined), então checar a data é que diz se já
    // houve resposta de verdade.
    return !!orientacao.cancelamento?.solicitadoPor && !orientacao.cancelamento?.resposta?.data;
}

async function solicitarCancelamento (req, res) {
    try {
        const token = req.headers.authorization;
        const {userID, userTipo} = jwt.verify (token, process.env.JWT_SECRET, (err, usuario) => {
            if (err) return false;
            return {userID: usuario._id, userTipo: usuario.tipo};
        });
        if (!userID) return res.status (400);
        if (!req.body.motivo?.trim ()) {
            return res.status (400).json ({ msg: 'Justifique o motivo do cancelamento.' });
        }
        const orientacao = await Model.findOne ({ ativo: true, situacao: 'confirmado', _id: req.params.id });
        if (!orientacao) {
            return res.status (404).json ({ msg: 'Orientação não encontrada.' });
        }
        const dono = userTipo === 'aluno' ? orientacao.aluno : orientacao.professor;
        if (userTipo === 'admin' || String (dono) !== String (userID)) {
            return res.status (403).json ({ msg: 'Você não faz parte desta orientação.' });
        }
        if (cancelamentoPendente (orientacao)) {
            return res.status (400).json ({ msg: 'Já existe uma solicitação de cancelamento pendente.' });
        }
        const faseAtualIndex = orientacao.fases.findIndex ((f) => f.situacao !== 'aprovada');
        const faseAtual = faseAtualIndex === -1 ? orientacao.fases.length : faseAtualIndex;
        if (faseAtual > 1) {
            return res.status (400).json ({ msg: 'Cancelamento disponível apenas até a fase de Desenvolvimento.' });
        }
        orientacao.cancelamento = {
            solicitadoPor: userTipo,
            motivo: req.body.motivo.trim (),
            data: new Date (),
        };
        await orientacao.save ();
        res.status (200).json ({ msg: 'Solicitação de cancelamento enviada.' });
    } catch (error) {
        console.log (error);
        return res.status (400).json ({ msg: 'Erro ao solicitar cancelamento.' });
    }
}

async function responderCancelamento (req, res) {
    try {
        const token = req.headers.authorization;
        const {userID, userTipo} = jwt.verify (token, process.env.JWT_SECRET, (err, usuario) => {
            if (err) return false;
            return {userID: usuario._id, userTipo: usuario.tipo};
        });
        if (!userID) return res.status (400);
        const orientacao = await Model.findOne ({ ativo: true, _id: req.params.id }).populate ('aluno professor', 'nome email');
        if (!orientacao) {
            return res.status (404).json ({ msg: 'Orientação não encontrada.' });
        }
        if (!cancelamentoPendente (orientacao)) {
            return res.status (400).json ({ msg: 'Não há cancelamento pendente para esta orientação.' });
        }
        const solicitadoPor = orientacao.cancelamento.solicitadoPor;
        const dono = userTipo === 'aluno' ? orientacao.aluno._id : orientacao.professor._id;
        if (userTipo === 'admin' || userTipo === solicitadoPor || String (dono) !== String (userID)) {
            return res.status (403).json ({ msg: 'Você não pode responder a este cancelamento.' });
        }
        const solicitante = solicitadoPor === 'aluno' ? orientacao.aluno : orientacao.professor;
        if (req.body.aceitar) {
            orientacao.cancelamento.resposta = { aceito: true, data: new Date () };
            orientacao.ativo = false;
            orientacao.situacao = 'cancelado';
            await orientacao.save ();
            if (solicitante?.email) {
                sendEmail (
                    solicitante.email,
                    'SOTCC - Cancelamento aceito',
                    `<h3>Sua solicitação de cancelamento foi aceita. A orientação foi encerrada.</h3><a href='${process.env.HOST_ROOT}/ui/login'>Clique aqui para entrar no sistema.</a>`,
                );
            }
            return res.status (200).json ({ msg: 'Cancelamento aceito. A orientação foi encerrada.' });
        }
        if (!req.body.motivo?.trim ()) {
            return res.status (400).json ({ msg: 'Justifique o motivo da recusa.' });
        }
        orientacao.cancelamento.resposta = { aceito: false, motivo: req.body.motivo.trim (), data: new Date () };
        await orientacao.save ();
        if (solicitante?.email) {
            sendEmail (
                solicitante.email,
                'SOTCC - Cancelamento recusado',
                `<h3>Sua solicitação de cancelamento foi recusada.</h3><p>Motivo: ${req.body.motivo.trim ()}</p><a href='${process.env.HOST_ROOT}/ui/login'>Clique aqui para entrar no sistema.</a>`,
            );
        }
        res.status (200).json ({ msg: 'Solicitação de cancelamento recusada.' });
    } catch (error) {
        console.log (error);
        return res.status (400).json ({ msg: 'Erro ao responder ao cancelamento.' });
    }
}

async function retirarCancelamento (req, res) {
    try {
        const token = req.headers.authorization;
        const {userID, userTipo} = jwt.verify (token, process.env.JWT_SECRET, (err, usuario) => {
            if (err) return false;
            return {userID: usuario._id, userTipo: usuario.tipo};
        });
        if (!userID) return res.status (400);
        const orientacao = await Model.findOne ({ ativo: true, _id: req.params.id });
        if (!orientacao) {
            return res.status (404).json ({ msg: 'Orientação não encontrada.' });
        }
        if (!cancelamentoPendente (orientacao)) {
            return res.status (400).json ({ msg: 'Não há cancelamento pendente para esta orientação.' });
        }
        if (userTipo !== orientacao.cancelamento.solicitadoPor) {
            return res.status (403).json ({ msg: 'Apenas quem solicitou pode retirar o pedido de cancelamento.' });
        }
        orientacao.cancelamento = null;
        await orientacao.save ();
        res.status (200).json ({ msg: 'Solicitação de cancelamento retirada.' });
    } catch (error) {
        console.log (error);
        return res.status (400).json ({ msg: 'Erro ao retirar solicitação de cancelamento.' });
    }
}

export { solicitarCancelamento, responderCancelamento, retirarCancelamento };
