import mongoose from "mongoose";
const { Schema, model } = mongoose;

const modelSchema = new Schema({
    nome: {
        type: String,
        required: true
    },
    sobrenome: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    telefone: {
        type: String,
        required: false,
    },
    senha: {
        type: String,
        required: true
    },
    tipo: {
        type: String,
        required: true
    },
});

export default model("Usuario", modelSchema);
