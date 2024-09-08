import Model from "./Model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

async function listar(req, res) {
    try {
        const token = req.headers.authorization;
        const userID = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) return false;
            return decoded.id;
        });
        if (!userID) return res.status(400);
        const item = await Model.find({});
        res.status(200).json({ item });
    } catch (error) {
        return res.sendStatus(400);
    }
}

async function criar(req, res) {
    try {
        console.log(req.body)
        let isNew = await Model.findOne({ email: req.body.email });
        if (isNew) return res.sendStatus(400).json({ msg: "Usuário já cadastrado." });

        const hashSenha = await bcrypt.hash(req.body.senha, 10);

        const novo = new Model({
            nome: req.body.nome,
            sobrenome: req.body.sobrenome,
            email: req.body.email,
            telefone: req.body.telefone,
            tipo: req.body.tipo,
            senha: hashSenha,
        });

        await novo.save();

        const token = jwt.sign(
            {
                _id: novo._id,
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
        let editar = await Model.findOne({ _id: req.body._id });
       
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
        editar.telefone = req.body.telefone;
        editar.instituicao = req.body.instituicao;
        editar.interesse = req.body.interesse;
        editar.tipo = req.body.tipo;
        await editar.save();
        res.status(200).json({ msg: "Usuário editado com sucesso." });
    } catch (error) {
        return res.status(400);
    }
}

async function deletar(req, res) {
    try {
        const query = await Model.deleteOne({ _id: req.params.id });
        if (query.deletedCount == 0) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }
        res.status(200).json({ success: true });
    } catch (error) {
        return res.sendStatus(400);
    }
}

async function pegarPorEmail(req, res) {
    try {
        const usuario = await Model.findOne({ email: req.params.email });
        if(!usuario){   
            return res.sendStatus(404)
        }
        res.json({usuario: usuario});
    } catch (error) {
        return res.sendStatus(400);
    }
}


export { listar, criar, deletar, editar, pegarPorEmail };