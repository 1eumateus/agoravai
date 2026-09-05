import express from "express";
import { listar, pegarPorId, alterarSituacao, criar, deletar, editar, gerarConvite, orientacaoPorProfessor, enviarArquivoFase, removerArquivoFase, comentarFase, avaliarFase, visualizarFases, solicitarCancelamento, responderCancelamento } from "./Controller.js";
import { uploadFase } from "./Multer.js";

const router = express.Router ();

router.post ("/criar", criar);
router.put ("/alterarSituacao", alterarSituacao);
router.put ("/editar", editar);
router.post ("/gerarConvite", gerarConvite);
router.get ("/professor/:id", orientacaoPorProfessor);
router.put ("/:id/visualizar", visualizarFases);
router.post ("/:id/solicitarCancelamento", solicitarCancelamento);
router.put ("/:id/responderCancelamento", responderCancelamento);
router.post ("/:id/fases/:faseIndex/arquivo", uploadFase.single ('arquivo'), enviarArquivoFase);
router.delete ("/:id/fases/:faseIndex/arquivo/:arquivoId", removerArquivoFase);
router.post ("/:id/fases/:faseIndex/comentario", comentarFase);
router.put ("/:id/fases/:faseIndex/avaliar", avaliarFase);
router.get ("/:id", pegarPorId);
router.delete ("/:id", deletar);
router.get ("/", listar);

export default router;