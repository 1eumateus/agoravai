import express from "express";
import { listar, pegarPorEmail, criar, deletar, editar } from "./Controller.js";

const router = express.Router();

router.get("/", listar);
router.get("/pegarPorEmail/:email", pegarPorEmail);
router.post("/criar", criar);
router.delete("/:id", deletar);
router.put("/:id", editar);

export default router;