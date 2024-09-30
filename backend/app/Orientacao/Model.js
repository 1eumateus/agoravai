import mongoose from "mongoose";
const { Schema, model } = mongoose;

const modelSchema = new Schema({
    ativo: {
        type: Boolean,
        default: true,
    },
    dataCriacao: {
        type: Date,
        default: Date.now,
    },
    situacao: {
        type: String,
        default: 'pendente',
    },
    tema: {
        type: String,
    },
    link: {
        type: String,
    },
    aluno: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Usuario",
        required: true,
    },
    professor: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Usuario",
        required: true,
    },
    proposta: {
        type: String,
        required: false,
    },
    resposta: {
        type: String,
        required: false,
    },
    banca: [{
        nome: String,
        instituicao: String,
    }],
    coorientador: {
        nome: String,
        instituicao: String,
    },
    dataDefesa:{
        type: Date,
        default: null,
        required: false,
    },
    horaDefesa:{
        type: String,
        default: null,
    }
});

export default model("Orientacao", modelSchema);
