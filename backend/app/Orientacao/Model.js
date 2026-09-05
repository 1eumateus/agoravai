import mongoose from "mongoose";
const { Schema, model } = mongoose;

const arquivoFaseSchema = new Schema ({
    originalname: String,
    filename: String,
    path: String,
    size: Number,
    dataEnvio: {
        type: Date,
        default: Date.now,
    },
});

const comentarioFaseSchema = new Schema ({
    autor: String,
    texto: String,
    data: {
        type: Date,
        default: Date.now,
    },
});

const faseSchema = new Schema ({
    nome: String,
    situacao: {
        type: String,
        default: 'pendente',
    },
    arquivos: [arquivoFaseSchema],
    comentarios: [comentarioFaseSchema],
});

const modelSchema = new Schema ({
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
    local: {
        type: String,
    },
    presencial: {
        type: Boolean,
        default: false,
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
    },
    fases: {
        type: [faseSchema],
        default: () => ([
            { nome: 'Proposta' },
            { nome: 'Desenvolvimento' },
            { nome: 'Pré-defesa' },
            { nome: 'Versão final' },
        ]),
    },
    ultimaVisualizacaoAluno: {
        type: Date,
        default: null,
    },
    ultimaVisualizacaoProfessor: {
        type: Date,
        default: null,
    },
    cancelamento: {
        solicitadoPor: {
            type: String,
            default: null,
        },
        motivo: {
            type: String,
            default: null,
        },
        data: {
            type: Date,
            default: null,
        },
    },
});

export default model ("Orientacao", modelSchema);
