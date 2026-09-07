import cron from "node-cron";
import Model from "./Model.js";
import { sendEmail } from '../shared/Mailer.js';

const DIAS_ANTECEDENCIA = 3;

function formatarData (value) {
    if (!value) return '';
    const data = new Date (value);
    const ano = data.getUTCFullYear ();
    const mes = String (data.getUTCMonth () + 1).padStart (2, '0');
    const dia = String (data.getUTCDate ()).padStart (2, '0');
    return `${dia}/${mes}/${ano}`;
}

async function verificarPrazos () {
    const agora = new Date ();
    const limite = new Date (agora.getTime () + DIAS_ANTECEDENCIA * 24 * 60 * 60 * 1000);
    const orientacoes = await Model.find ({ ativo: true }).populate ('aluno', 'email');
    for (const orientacao of orientacoes) {
        let mudou = false;
        for (const fase of orientacao.fases) {
            if (fase.situacao === 'aprovada') continue;
            if (!fase.prazo || fase.lembretePrazoEnviado) continue;
            if (fase.prazo < agora || fase.prazo > limite) continue;
            if (!orientacao.aluno?.email) continue;
            sendEmail (
                orientacao.aluno.email,
                'SOTCC - Prazo se aproximando',
                `<h3>O prazo da fase "${fase.nome}" está chegando: ${formatarData (fase.prazo)}.</h3><a href='${process.env.HOST_ROOT}/ui/login'>Clique aqui para entrar no sistema.</a>`,
            );
            fase.lembretePrazoEnviado = true;
            mudou = true;
        }
        if (mudou) await orientacao.save ();
    }
}

function start () {
    cron.schedule ('0 8 * * *', () => {
        verificarPrazos ().catch ((error) => console.log ('Erro ao verificar prazos:', error));
    });
}

export { start };
