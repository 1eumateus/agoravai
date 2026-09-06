import Model from "./Model.js";
import jwt from "jsonwebtoken";

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
        if (userTipo !== 'aluno' || String (orientacao.aluno) !== String (userID)) {
            return res.status (403).json ({ msg: 'Apenas o aluno desta orientação pode solicitar o cancelamento.' });
        }
        orientacao.cancelamento = {
            solicitadoPor: 'aluno',
            motivo: req.body.motivo.trim (),
            data: new Date (),
        };
        await orientacao.save ();
        res.status (200).json ({ msg: 'Solicitação de cancelamento enviada ao orientador.' });
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
        const orientacao = await Model.findOne ({ ativo: true, _id: req.params.id });
        if (!orientacao) {
            return res.status (404).json ({ msg: 'Orientação não encontrada.' });
        }
        if (userTipo !== 'professor' || String (orientacao.professor) !== String (userID)) {
            return res.status (403).json ({ msg: 'Apenas o orientador desta orientação pode responder ao cancelamento.' });
        }
        if (orientacao.cancelamento?.solicitadoPor !== 'aluno') {
            return res.status (400).json ({ msg: 'Não há cancelamento pendente para esta orientação.' });
        }
        if (req.body.aceitar) {
            orientacao.ativo = false;
            orientacao.cancelamento = null;
            await orientacao.save ();
            return res.status (200).json ({ msg: 'Cancelamento aceito. A orientação foi encerrada.' });
        }
        orientacao.cancelamento = null;
        await orientacao.save ();
        res.status (200).json ({ msg: 'Solicitação de cancelamento recusada.' });
    } catch (error) {
        console.log (error);
        return res.status (400).json ({ msg: 'Erro ao responder ao cancelamento.' });
    }
}

export { solicitarCancelamento, responderCancelamento };
