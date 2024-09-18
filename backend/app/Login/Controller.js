import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Usuario from "../Usuario/Model.js";

async function login(req, res) {
    try {
        const { email, senha } = req.body;
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ msg: 'Email incorreto.' });
        }

        const valido = await bcrypt.compare(senha, usuario.senha);
        if (!valido) {
            return res.status(400).json({ msg: 'Senha incorreta.' });
        }

        const token = jwt.sign(
            {
                _id: usuario._id,
                nome: usuario.nome,
                email: usuario.email,
                tipo: usuario.tipo,
            },
            process.env.JWT_SECRET
        );

        res.json({ token });
    } catch (e) {
        console.error(e);
        res.status(400).json({ msg: 'Email e senha incorretos.' });
    }
}

async function getUser(req, res) {
   
    const authHeader = req.headers["authorization"] || req.query.token;
    let token;

    if (authHeader?.split(" ").length > 1) {
        token = authHeader && authHeader?.split(" ")[1];
    } else {
        token = authHeader;
    }
    
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, async(err, usuario) => {
        if (err) return res.sendStatus(403);
        const user = await Usuario.findOne({ _id: usuario._id });
        if(!user?.ativo) return res.sendStatus(404);
        res.status(200).json({ 
            tipo: usuario.tipo, 
            nome: usuario.nome, 
            id: usuario._id 
        });
    });
}

async function confirmarEmail(req, res) {
   
    const token = req.query.confirmandoEmail
    if(!token) return res.sendStatus(400);

    jwt.verify(token, process.env.JWT_SECRET, async(err, usuario) => {
        if (err) return res.sendStatus(403);
        const user = await Usuario.findOne({ email: usuario.email });
        if(!user) return res.sendStatus(400);
        user.ativo = true;
        await user.save()
        res.status(200).json({ 
            tipo: user.tipo, 
            nome: user.nome, 
            id: user._id,
        });
    });
}

export { login, getUser, confirmarEmail };
