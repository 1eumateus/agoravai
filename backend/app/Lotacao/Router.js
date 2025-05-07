import express from "express";
import { getLotacoes } from "./Controller.js";

const router = express.Router ();

router.get ("/lotacoes", getLotacoes);

export default router;