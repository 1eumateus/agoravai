import mongoose from "mongoose";
const { Schema, model } = mongoose;

const modelSchema = new Schema({
    verificado: {
        type: Boolean,
        default: false,
    },
    dataCriacao: {
        type: Date,
        default: Date.now,
    },
    siape: {
        type: String,
        required: false,
    },
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
    telefone: {
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
        default: 'Universidade Federal do Pará (UFPA)'
    },
    trabalhosFimCurso: [],
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
    imagem:{
        originalname: String,
        path: String,
        filename: String,
        encoding: String,
        destination: String,
        size: Number,
    },
    codigo_recuperacao : {
        type: mongoose.Schema.Types.UUID,
        required: false,
    }
});

export default model("Usuario", modelSchema);
