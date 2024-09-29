import express from "express";
import { listar, adicionarImagem, listarProfessores, siape, adicionarOrientacao, pegarPorId, criar, deletar, editar } from "./Controller.js";
import { upload } from "./Multer.js";

const router = express.Router();

router.get("/", listar);
router.get("/professores", listarProfessores);
router.get("/:id", pegarPorId);
router.post("/criar", criar);
router.delete("/:id", deletar);
router.put("/editar", editar);
router.put("/adicionarOrientacao", adicionarOrientacao);
router.get("/siape/:codigo", siape);
router.post("/imagem/", upload.single("image"), adicionarImagem);

export default router;