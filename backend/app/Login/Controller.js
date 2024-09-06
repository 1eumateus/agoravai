import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Usuario from "../Usuario/Model.js";

async function login(req, res) {
    try {
        const { email, senha } = req.body;
        console.log(req.body)
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

    jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
        if (err) return res.sendStatus(403);
        res.status(200).json({ 
            tipo: usuario.tipo, 
            nome: usuario.nome, 
            email: usuario.email 
        });
    });
}

export { login, getUser };
