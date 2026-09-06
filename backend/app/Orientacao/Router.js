import express from "express";
import { listar, pegarPorId, alterarSituacao, criar, deletar, editar, orientacaoPorProfessor, listarPublicas } from "./Controller.js";
import { visualizarFases, enviarArquivoFase, removerArquivoFase, comentarFase, avaliarFase } from "./FasesController.js";
import { solicitarCancelamento, responderCancelamento } from "./CancelamentoController.js";
import { gerarConvite } from "./ConviteController.js";
import { makeUpload } from "../shared/Multer.js";

const router = express.Router ();

const uploadFase = makeUpload ({
    randomizeFilename: true,
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
    fileFilter: function (req, file, cb) {
        if (file.mimetype === 'application/pdf') {
            cb (null, true);
        } else {
            cb (new Error ('Apenas arquivos PDF são permitidos.'));
        }
    },
});

router.post ("/criar", criar);
router.put ("/alterarSituacao", alterarSituacao);
router.put ("/editar", editar);
router.post ("/gerarConvite", gerarConvite);
router.get ("/professor/:id", orientacaoPorProfessor);
router.get ("/publicas", listarPublicas);
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