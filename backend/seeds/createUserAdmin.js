// createUserAdmin.js

import Usuario from "../app/Usuario/Model.js";
import bcrypt from "bcryptjs";

export async function start() {
    let isNew = await Usuario.findOne({ email: 'organizadortrabalhos@gmail.com' });
    if (!isNew) {
        const novo = new Usuario({
            nome: 'Admin',
            email: 'organizadortrabalhos@gmail.com',
            tipo: 'admin',
            ativo: true,
            verificado: true,
            senha: await bcrypt.hash('123456', 10),
            // senha: await bcrypt.hash('@organizadortrabalhos1', 10),
        });
        await novo.save();
    }
}
