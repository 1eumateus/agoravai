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
    banca: [],
    coorientador: {
        nome: String,
        email: String,
    },
    dataDefesa:{
        type: Date,
        default: null,
        required: false,
    },
    horaDefesa:{
        type: String,
        default: '00:00',
    }
});

export default model("Orientacao", modelSchema);
