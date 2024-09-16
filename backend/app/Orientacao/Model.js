import mongoose from "mongoose";
const { Schema, model } = mongoose;

const modelSchema = new Schema({
    ativo: {
        type: Boolean,
        default: true,
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
    },
    resposta: {
        type: String,
    },
});

export default model("Orientacao", modelSchema);
