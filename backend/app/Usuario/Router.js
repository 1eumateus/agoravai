import express from "express";
import { listar, adicionarImagem, listarProfessores, siape, adicionarOrientacao, pegarPorId, criar, deletar, editar, recuperarSenhaSolicitacao, redefinirSenha} from "./Controller.js";
import { upload } from "./Multer.js";

const router = express.Router();


router.get("/professores", listarProfessores);
router.post("/criar", criar);
router.put("/editar", editar);
router.put("/adicionarOrientacao", adicionarOrientacao);
router.get("/siape/:codigo", siape);
router.post("/imagem/", upload.single("image"), adicionarImagem);
router.post('/recuperar_solicitacao', recuperarSenhaSolicitacao);
router.post('/redefinir', redefinirSenha);
router.delete("/:id", deletar);
router.get("/:id", pegarPorId);
router.get("/", listar);

export default router;