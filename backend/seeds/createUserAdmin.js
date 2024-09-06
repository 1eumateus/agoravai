// createUserAdmin.js

import Usuario from "../app/Usuario/Model.js";
import bcrypt from "bcryptjs";

export async function start() {
    let isNew = await Usuario.findOne({ email: 'admin@admin.com' });
    if (!isNew) {
        const novo = new Usuario({
            nome: 'Admin',
            email: 'admin@admin.com',
            tipo: 'admin',
            senha: await bcrypt.hash('123456', 10),
        });
        await novo.save();
    }
}
