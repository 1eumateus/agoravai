import express from "express";
import { listar, pegarPorId, negar, criar, deletar, editar } from "./Controller.js";

const router = express.Router();

router.get("/", listar);
router.get("/:id", pegarPorId);
router.post("/criar", criar);
router.delete("/:id", deletar);
router.put("/negar/:id", negar);
router.put("/editar", editar);

export default router;