// createUserAdmin.js

import Usuario from "../app/Usuario/Model.js";
import bcrypt from "bcryptjs";

export async function start() {
    let isNew = await Usuario.findOne({ email: process.env.ADMIN_EMAIL });
    if (!isNew) {
        const novo = new Usuario({
            nome: 'Admin',
            email: process.env.ADMIN_EMAIL,
            tipo: 'admin',
            ativo: true,
            verificado: true,
            senha: await bcrypt.hash(process.env.ADMIN_SENHA, 10),
        });
        await novo.save();
    }
}
