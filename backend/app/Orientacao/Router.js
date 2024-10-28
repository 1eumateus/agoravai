import express from "express";
import { listar, pegarPorId, alterarSituacao, criar, deletar, editar, gerarConvite, orientacaoPorProfessor } from "./Controller.js";

const router = express.Router();

router.post("/criar", criar);
router.put("/alterarSituacao", alterarSituacao);
router.put("/editar", editar);
router.post("/gerarConvite", gerarConvite);
router.get("/professor/:id", orientacaoPorProfessor);
router.get("/:id", pegarPorId);
router.delete("/:id", deletar);
router.get("/", listar);

export default router;