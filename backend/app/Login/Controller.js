import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Usuario from "../Usuario/Model.js";

async function login (req, res) {
    try {
        const { email, senha } = req.body;
        const usuario = await Usuario.findOne ({ ativo:true, email});
        if (!usuario?.verificado) {
            return res.status (400).json ({ msg: 'Confirme o seu endereço de email clicando no link  do email enviado na hora do cadstrato'});
        }
        if (!usuario) {
            return res.status (400).json ({ msg: 'Email incorreto.' });
        }
        const valido = await bcrypt.compare (senha, usuario.senha);
        if (!valido) {
            return res.status( 400).json ({ msg: 'Senha incorreta.' });
        }
        const token = jwt.sign (
            {
                _id: usuario._id,
                nome: usuario.nome,
                email: usuario.email,
                tipo: usuario.tipo,
            },
            process.env.JWT_SECRET
        );
        res.json ({ token });
    } catch (e) {
        console.error (e);
        res.status (400).json ({ msg: 'Email e senha incorretos.' });
    }
}

async function getUser (req, res) {
    const token = req.headers ["authorization"] || req.query.token;    
    if (token == null) return res.sendStatus (401);
    jwt.verify (token, process.env.JWT_SECRET, async (err, usuario) => {
        if (err) return res.sendStatus (403);
        const user = await Usuario.findOne ({ _id: usuario._id });
        if (!user?.ativo) return res.sendStatus (404);
        res.status (200).json ({ 
            tipo: usuario.tipo, 
            nome: usuario.nome, 
            id: usuario._id 
        });
    });
}

async function confirmarEmail (req, res) {
    try{
        const idUser = req.query.confirmandoEmail
        if (!idUser) return res.status (404).json ({msg:'ID do usuário não informado.'});
        const user = await Usuario.findOne ({ _id: idUser });
        if (!user) return res.status (404).json ({msg: 'O usuário não existe.'});
        if (user.verificado) return res.status (200).json ({msg: 'O usuário já foi verificado.'});
        user.verificado = true;
        await user.save ();
        res.status (200).json ({msg: 'Usuário verificado com sucesso.'});
    }catch (error) {
        return res.sendStatus (400)
    }
}

export { login, getUser, confirmarEmail};
