import jwt from "jsonwebtoken";
import Model from "./Model.js";
import Usuario from "../Usuario/Model.js";
import { temCancelamentoPendente, MSG_CANCELAMENTO_PENDENTE } from "./FasesController.js";

const TOKEN_TTL_SEGUNDOS = 3 * 60 * 60; // 3 horas

function assinarTokenJaaS (roomName, { id, name, email, moderator }) {
    const privateKey = (process.env.JAAS_PRIVATE_KEY || '').replace (/\\n/g, '\n');
    const agora = Math.floor (Date.now () / 1000);
    return jwt.sign ({
        aud: 'jitsi',
        iss: 'chat',
        sub: process.env.JAAS_APP_ID,
        room: roomName,
        exp: agora + TOKEN_TTL_SEGUNDOS,
        nbf: agora - 5,
        context: {
            user: { id, name, email, moderator },
            features: {
                livestreaming: false,
                recording: false,
                transcription: false,
                'outbound-call': false,
            },
        },
    }, privateKey, {
        algorithm: 'RS256',
        header: { kid: process.env.JAAS_API_KEY_ID },
    });
}

async function gerarTokenVideochamada (req, res) {
    try {
        const token = req.headers.authorization;
        const {userID, userTipo} = jwt.verify (token, process.env.JWT_SECRET, (err, usuario) => {
            if (err) return false;
            return {userID: usuario._id, userTipo: usuario.tipo};
        });
        if (!userID) return res.status (400);
        const orientacao = await Model.findOne ({ ativo: true, _id: req.params.id });
        if (!orientacao) return res.status (404).json ({ msg: 'Orientação não encontrada.' });
        if (temCancelamentoPendente (orientacao)) return res.status (400).json ({ msg: MSG_CANCELAMENTO_PENDENTE });
        const souAluno = userTipo === 'aluno' && String (orientacao.aluno) === String (userID);
        const souProfessor = userTipo === 'professor' && String (orientacao.professor) === String (userID);
        if (!souAluno && !souProfessor) {
            return res.status (403).json ({ msg: 'Você não faz parte desta orientação.' });
        }
        if (orientacao.situacao !== 'confirmado') {
            return res.status (400).json ({ msg: 'A orientação precisa estar confirmada para iniciar uma videochamada.' });
        }
        if (souAluno && !orientacao.chamadaAoVivo?.ativa) {
            return res.status (400).json ({ msg: 'Aguarde o professor iniciar a videochamada.' });
        }
        const usuario = await Usuario.findOne ({ _id: userID });
        if (!usuario) return res.status (404).json ({ msg: 'Usuário não encontrado.' });
        const roomName = `orientacao-${orientacao._id}`;
        const jaasToken = assinarTokenJaaS (roomName, {
            id: String (usuario._id),
            name: `${usuario.nome} ${usuario.sobrenome || ''}`.trim (),
            email: usuario.email,
            moderator: souProfessor,
        });
        if (souProfessor && !orientacao.chamadaAoVivo?.ativa) {
            orientacao.chamadaAoVivo = { ativa: true, iniciadaEm: new Date () };
            await orientacao.save ();
        }
        res.status (200).json ({ token: jaasToken, roomName, appId: process.env.JAAS_APP_ID });
    } catch (error) {
        console.log (error);
        return res.status (400).json ({ msg: 'Erro ao gerar token de videochamada.' });
    }
}

async function encerrarVideochamada (req, res) {
    try {
        const token = req.headers.authorization;
        const {userID, userTipo} = jwt.verify (token, process.env.JWT_SECRET, (err, usuario) => {
            if (err) return false;
            return {userID: usuario._id, userTipo: usuario.tipo};
        });
        if (!userID) return res.status (400);
        const orientacao = await Model.findOne ({ ativo: true, _id: req.params.id });
        if (!orientacao) return res.status (404).json ({ msg: 'Orientação não encontrada.' });
        const souProfessor = userTipo === 'professor' && String (orientacao.professor) === String (userID);
        if (!souProfessor) {
            return res.status (403).json ({ msg: 'Apenas o professor pode encerrar a videochamada.' });
        }
        orientacao.chamadaAoVivo = { ativa: false, iniciadaEm: orientacao.chamadaAoVivo?.iniciadaEm || null };
        await orientacao.save ();
        res.status (200).json ({ msg: 'Videochamada encerrada.' });
    } catch (error) {
        console.log (error);
        return res.status (400).json ({ msg: 'Erro ao encerrar videochamada.' });
    }
}

async function gerarTokenVideochamadaPublico (req, res) {
    try {
        const inicioDoDia = new Date ();
        inicioDoDia.setHours (0, 0, 0, 0);
        const orientacao = await Model.findOne ({
            ativo: true,
            _id: req.params.id,
            situacao: 'confirmado',
            presencial: { $ne: true },
            dataDefesa: { $gte: inicioDoDia },
        });
        if (!orientacao) return res.status (404).json ({ msg: 'Defesa não encontrada.' });
        const roomName = `orientacao-${orientacao._id}`;
        const jaasToken = assinarTokenJaaS (roomName, {
            id: `visitante-${Date.now ()}`,
            name: 'Visitante',
            email: '',
            moderator: false,
        });
        res.status (200).json ({ token: jaasToken, roomName, appId: process.env.JAAS_APP_ID });
    } catch (error) {
        console.log (error);
        return res.status (400).json ({ msg: 'Erro ao gerar token de videochamada.' });
    }
}

export { gerarTokenVideochamada, encerrarVideochamada, gerarTokenVideochamadaPublico };
