import mongoose from "mongoose";
const { Schema, model } = mongoose;

const modelSchema = new Schema({
    ativo: {
        type: Boolean,
        default: true,
    },
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
    celular: {
        type: String,
        required: false,
    },
    formacao: {
        type: String,
        required: false,
    },
    orientacoes: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Orientacao",
    }],
    descricao: {
        type: String,
        required: false,
    },
    disponibilidade: {
        type: String,
        default: 'indisponível',
        required: false,
    },
    instituicao: {
        type: String,
        required: false,
    },
    interesse: {
        type: String,
        required: false,
    },
    github: {
        type: String,
        required: false,
    },
    linkedin: {
        type: String,
        required: false,
    },
    lattes: {
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
