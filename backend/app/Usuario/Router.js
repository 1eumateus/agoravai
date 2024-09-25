import express from "express";
import { listar, listarProfessores, siape, adicionarOrientacao, pegarPorId, criar, deletar, editar } from "./Controller.js";

const router = express.Router();

router.get("/", listar);
router.get("/professores", listarProfessores);
router.get("/:id", pegarPorId);
router.post("/criar", criar);
router.delete("/:id", deletar);
router.put("/editar", editar);
router.put("/adicionarOrientacao", adicionarOrientacao);
router.get("/siape/:codigo", siape);

export default router;