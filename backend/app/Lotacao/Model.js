import mongoose from "mongoose";
const { Schema, model } = mongoose;

const unidade = new Schema ({
    unidade: {
        type: String,
        required: true
    },
    cidade: {
        type: String,
        required: true
    },
});

const subunidade = new Schema ({
    subunidade: {
        type: String,
        required: true
    },
    unidade_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Unidade",
        required: true,
    }
});

const UnidadeModel = model ("Unidade", unidade);
const SubunidadeModel = model ("Subunidade", subunidade);

export {UnidadeModel, SubunidadeModel};