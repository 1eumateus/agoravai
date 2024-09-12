import Model from "./Model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

async function listar(req, res) {
    try {
        const token = req.headers.authorization;
        const filtro = {ativo: true}
        const {userID, userTipo }= jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
            if (err) return false;
            return {userID: usuario._id, userTipo: usuario.tipo};
        });
        if (!userID) return res.status(400);

        if(userTipo === 'aluno'){
            filtro.tipo = {$nin: ['admin', 'aluno']}
        }else if(userTipo === 'professor'){
           return res.status(200).json({item:[]})
        }
        const search = req.query.search || false;
        if (search) {
            filtro.nome = { $regex: search, $options: "i" };
        }

        const item = await Model.aggregate([
            { $match: filtro },  
            {
                $project: {    
                    _id: 1,       
                    nome: 1,
                    sobrenome: 1,
                    descricao: 1,
                    disponibilidade: 1,
                    interesse: 1
                }
            }
        ]);

        res.status(200).json({ item });
    } catch (error) {
        return res.sendStatus(400);
    }
}

async function criar(req, res) {
    try {
        console.log(req.body)
        let isNew = await Model.findOne({ ativo: true, email: req.body.email });
        if (isNew) return res.sendStatus(400).json({ msg: "Usuário já cadastrado." });

        const hashSenha = await bcrypt.hash(req.body.senha, 10);

        const novo = new Model({
            ativo: true,
            nome: req.body.nome,
            sobrenome: req.body.sobrenome,
            email: req.body.email,
            descricao: req.body.descricao,
            github: req.body.github,
            linkedin: req.body.linkedin,
            disponibilidade: req.body.disponibilidade,
            celular: req.body.celular,
            instituicao: req.body.instituicao,
            interesse: req.body.interesse,
            tipo: req.body.tipo,
            solicitacoes: req.body.solicitacoes,
            formacao: req.body.formacao,
            senha: hashSenha,
        });

        await novo.save();

        const token = jwt.sign(
            {
                _id: novo._id,
                ativo: novo.ativo,
                nome: novo.nome,
                email: novo.email,
                tipo: novo.tipo,
            },
            process.env.JWT_SECRET
        );

        res.json({ token });

    } catch (error) {
        return res.status(400).json({ msg: "Erro 400." });;
    }
}

async function editar(req, res) {
    try {
        let editar = await Model.findOne({ ativo:true, _id: req.body._id });
       
        if (!editar) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        let hashSenha = '';
        if (req.body.senha !== "") {
            console.log('senah editada')
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
        editar.celular = req.body.celular;
        editar.instituicao = req.body.instituicao;
        editar.interesse = req.body.interesse;
        editar.tipo = req.body.tipo;
        editar.solicitacoes = req.body.solicitacoes;
        editar.formacao = req.body.formacao;
        editar.ativo = true;
        await editar.save();
        res.status(200).json({ msg: "Usuário editado com sucesso." });
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
        const filtro = { ativo: true, _id: req.params.id };

        const { userID, userTipo } = jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
            if (err) return false;
            return { userID: usuario._id, userTipo: usuario.tipo };
        });

        if (!userID) return res.status(400);

        if (userTipo !== 'admin') {
            filtro.tipo = { $nin: ['admin'] };
        }

        let selectFields = {};
        if (userTipo === 'aluno' || userTipo === 'professor') {
            selectFields = { senha: 0 };
        }

        const usuario = await Model.findOne(filtro).select(selectFields);
        if (!usuario) {
            return res.sendStatus(404); 
        }

        res.json({ usuario: usuario });
    } catch (error) {
        return res.sendStatus(400); 
    }
}


export { listar, criar, deletar, editar, pegarPorId };