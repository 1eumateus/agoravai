import Model from "./Model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;

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


export { listar, criar, deletar, alterarSituacao, editar, pegarPorId };