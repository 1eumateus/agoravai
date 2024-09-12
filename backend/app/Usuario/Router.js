import express from "express";
import { listar, listarProfessores, pegarPorId, criar, deletar, editar } from "./Controller.js";

const router = express.Router();

router.get("/", listar);
router.get("/professores", listarProfessores);
router.get("/:id", pegarPorId);
router.post("/criar", criar);
router.delete("/:id", deletar);
router.put("/editar", editar);

export default router;