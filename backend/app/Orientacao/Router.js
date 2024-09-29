import express from "express";
import { listar, pegarPorId, alterarSituacao, criar, deletar, editar, gerarConvite } from "./Controller.js";

const router = express.Router();

router.get("/", listar);
router.get("/:id", pegarPorId);
router.post("/criar", criar);
router.delete("/:id", deletar);
router.put("/alterarSituacao", alterarSituacao);
router.put("/editar", editar);
router.post("/gerarConvite", gerarConvite);

export default router;