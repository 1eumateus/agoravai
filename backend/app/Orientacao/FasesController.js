import Model from "./Model.js";
import jwt from "jsonwebtoken";
import fs from 'fs';

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

export { visualizarFases, enviarArquivoFase, removerArquivoFase, comentarFase, avaliarFase };
