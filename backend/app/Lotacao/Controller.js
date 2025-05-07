import {UnidadeModel, SubunidadeModel} from './Model.js'

async function getLotacoes (req, res) {
    let unidades = await UnidadeModel.find ({});
    let subunidades = await SubunidadeModel.find ({});
    res.json ({ unidades: unidades, subunidades: subunidades});
}
    
export { getLotacoes };