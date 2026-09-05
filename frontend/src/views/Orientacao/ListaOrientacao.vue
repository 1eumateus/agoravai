<template>
    <RespostaOrientacao
        @modal:open="recarregar($event)"
        :orientacao="orientacao"
        :situacao="situacao"
        :usuario="props?.usuario"
        v-if="openRespostaOrientacao"
    />
    <div class="grid grid-cols-1 gap-[8px]">
        <section class="grid grid-cols-1 gap-[10px] border border-secundaria-opaco rounded-md bg-white p-[14px]" >
            <div class="flex items-center gap-[8px] border-b border-secundaria-opaco pb-[8px]">
                <PhUsersThree :size="22" class="fill-principal" />
                <Texto as="h4" color="principal">
                    Orientações
                </Texto>
            </div>
            <div class="flex flex-col" v-if="props?.usuario?.tipo === 'aluno'">
                <Texto as="body" color="gray" v-if="linhasExibidas.length === 0">
                    Nenhuma solicitação de orientação ainda.
                </Texto>
                <div
                    v-for="item in linhasExibidas"
                    :key="item._id"
                    class="flex items-center gap-[10px] py-[10px] border-b border-secundaria last:border-b-0"
                >
                    <div class="relative flex-shrink-0">
                        <img
                            v-if="item.professor?.imagem?.filename"
                            :src="`${urlApi}/uploads/${item.professor.imagem.filename}`"
                            :alt="item.professor.imagem.originalname"
                            class="h-[44px] w-[44px] object-cover rounded-full border border-secundaria-opaco"
                        />
                        <img
                            v-else
                            :src="`/ui/Sem_imagem.jpg`"
                            :alt="'sem imagem'"
                            class="h-[44px] w-[44px] object-cover rounded-full border border-secundaria-opaco"
                        />
                        <span :class="`absolute -bottom-[2px] -right-[2px] w-[18px] h-[18px] rounded-full flex items-center justify-center border-2 border-white ${situacaoBadgeClass(item.situacao)}`">
                            <PhCheck v-if="item.situacao === 'confirmado'" :size="11" class="fill-white" />
                            <PhClock v-else-if="item.situacao === 'pendente'" :size="11" class="fill-white" />
                            <PhX v-else :size="11" class="fill-white" />
                        </span>
                    </div>
                    <div class="flex-1 min-w-0">
                        <Texto as="body">
                            <b>{{ item.professor?.nome }} {{ item.professor?.sobrenome }}</b> {{ mensagemFeed(item.situacao) }}
                        </Texto>
                        <Texto as="small" color="gray">
                            {{ item.dataCriacao ? formatMask.viewDate(item.dataCriacao) : '' }}
                        </Texto>
                    </div>
                    <div class="flex items-center gap-[6px] flex-shrink-0">
                        <button
                            type="button"
                            :onClick="()=> cancelarPedido(item)"
                            class="cursor-pointer flex items-center gap-[4px] px-[10px] py-[6px] border border-red-300 text-red-600 hover:bg-red-50 rounded-md font-bold text-[13px]"
                            v-if="item.situacao === 'pendente'"
                        >
                            <PhTrash :size="16" />
                            Deletar
                        </button>
                        <router-link
                            :to="`/ui/acompanhamento/${item._id}`"
                            class="cursor-pointer flex items-center gap-[4px] px-[10px] py-[6px] bg-terciaria text-white hover:bg-terciaria-opaco rounded-md font-bold text-[13px]"
                            v-if="item.situacao === 'confirmado'"
                        >
                            <PhChartLineUp :size="16" />
                            Acompanhar
                            <span v-if="item.notificacao" class="w-[8px] h-[8px] rounded-full bg-red-500 border border-white"></span>
                        </router-link>
                        <span
                            v-if="item.situacao === 'confirmado' && item.cancelamento?.solicitadoPor === 'aluno'"
                            class="text-xs font-bold px-[10px] py-[6px] rounded-md bg-orange-100 text-orange-700"
                        >
                            Cancelamento solicitado
                        </span>
                        <button
                            type="button"
                            :onClick="()=> cancelarPedido(item)"
                            class="cursor-pointer flex items-center gap-[4px] px-[10px] py-[6px] border border-red-300 text-red-600 hover:bg-red-50 rounded-md font-bold text-[13px]"
                            v-else-if="item.situacao === 'confirmado'"
                        >
                            <PhX :size="16" />
                            Solicitar cancelamento
                        </button>
                    </div>
                </div>
            </div>
            <div class="overflow-x-auto" v-else>
                <table v-if="linhasExibidas.length>0" class="min-w-full text-sm">
                    <thead>
                        <tr class="bg-secundaria-opaco font-bold border-b border-secundaria-opaco">
                            <td class="p-[10px] text-left" v-if="props?.usuario.tipo !== 'professor'">
                                Orientador
                            </td>
                            <td class="p-[10px] text-left" v-if="props?.usuario.tipo !== 'aluno'">
                                Aluno
                            </td>
                            <td class="p-[10px]">
                                Situação
                            </td>
                            <td class="p-[10px] text-left">
                                Proposta
                            </td>
                            <td class="p-[10px] text-left" v-if="props?.usuario.tipo !== 'admin'">
                                Resposta do orientador
                            </td>
                            <td class="p-[10px] min-w-40">
                                Data e hora de defesa
                            </td>
                            <td class="p-[10px]">
                                Opções
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(orientacao, index) in linhasExibidas" :key="index" class="even:bg-secundaria hover:bg-secundaria-opaco/40 border-b border-secundaria transition-colors" >
                            <td class="p-[10px] text-left min-w-40" v-if="props?.usuario.tipo !== 'professor'">
                                {{ orientacao?.professor?.nome }} {{ orientacao?.professor?.sobrenome }}
                            </td>
                            <td class="p-[10px] text-left min-w-40" v-if="props?.usuario.tipo !== 'aluno'">
                                {{ orientacao.aluno.nome }} {{ orientacao.aluno.sobrenome }}
                            </td>
                            <td class="p-[10px]">
                                <span :class="`text-xs font-bold px-[10px] py-[3px] rounded-full ${situacaoClass(orientacao.situacao)}`">
                                    {{ orientacao.situacao }}
                                </span>
                            </td>
                            <td class="p-[10px] text-left min-w-40">
                                {{ orientacao.proposta || ' - ' }}
                            </td>
                            <td class="p-[10px] text-left min-w-40" v-if="props?.usuario.tipo !== 'admin'">
                                {{ orientacao.resposta || ' - ' }}
                            </td>
                            <td class="p-[10px]">
                                {{ orientacao.dataDefesa ? formatMask.viewDate(orientacao.dataDefesa) : '-'}}
                                {{ orientacao.horaDefesa ? orientacao.horaDefesa : ' : -'}}
                            </td>
                            <td class="p-[10px]">
                                <div class="flex flex-col gap-[6px] min-w-[170px]">
                                    <button
                                            type="button"
                                            :onClick="()=> cancelarPedido(orientacao)"
                                            class="cursor-pointer w-full flex items-center justify-center gap-[6px] px-[10px] py-[6px] border border-red-300 text-red-600 hover:bg-red-50 rounded-md font-bold text-[13px]"
                                            v-if="props.usuario.tipo === 'aluno'"
                                        >
                                        <PhTrash :size="16" />
                                        Deletar
                                    </button>
                                    <button
                                        type="button"
                                        :onClick="()=> responderOrientacao(orientacao, 'confirmado')"
                                        v-if="props.usuario.tipo === 'professor' && orientacao.situacao !== 'confirmado'"
                                        class="cursor-pointer w-full flex items-center justify-center gap-[6px] px-[10px] py-[6px] border border-green-400 text-green-700 hover:bg-green-50 rounded-md font-bold text-[13px]"
                                    >
                                        <PhCheck :size="16" />
                                        Confirmar orientação
                                    </button>
                                    <router-link
                                        :to="`/ui/orientacao/${orientacao._id}`"
                                        class="cursor-pointer w-full flex items-center justify-center gap-[6px] px-[10px] py-[6px] bg-principal text-white hover:bg-principal-opaco rounded-md font-bold text-[13px]"
                                        v-if="orientacao.situacao === 'confirmado' && props.usuario.tipo !== 'aluno'"
                                    >
                                        <PhInfo :size="16" />
                                        Detalhes
                                    </router-link>
                                    <router-link
                                        :to="`/ui/acompanhamento/${orientacao._id}`"
                                        class="cursor-pointer w-full flex items-center justify-center gap-[6px] px-[10px] py-[6px] bg-terciaria text-white hover:bg-terciaria-opaco rounded-md font-bold text-[13px]"
                                        v-if="orientacao.situacao === 'confirmado'"
                                    >
                                        <PhChartLineUp :size="16" />
                                        Acompanhar
                                        <span v-if="orientacao.notificacao" class="w-[8px] h-[8px] rounded-full bg-red-500 border border-white"></span>
                                    </router-link>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <Texto as="body" color="gray" v-else>
                    Nenhum pedido de orientação.
                </Texto>
            </div>
        </section>
    </div>
</template>

<script setup>
import { PhUsersThree, PhTrash, PhCheck, PhInfo, PhChartLineUp, PhClock, PhX } from '@phosphor-icons/vue'
import Texto from '@components/Texto.vue'
import { computed, onMounted, reactive, ref } from "vue";
import api from "@/api.js";
import { popupInfo, formatMask } from '../../stores/util.js';
import RespostaOrientacao from './RespostaOrientacao.vue';

const urlApi = import.meta.env.VITE_URL;

const situacao = ref ("");
const orientacoes = reactive ([]);
const orientacao = reactive ({});
const openRespostaOrientacao = ref (false);

const props = defineProps({
    usuario: {
        type: [Object],
        required: false,
    },
});

const emits = defineEmits(['atualizado']);

function mensagemFeed (situacao) {
    if (situacao === 'pendente') return 'ainda não respondeu sua solicitação de orientação.';
    if (situacao === 'confirmado') return 'confirmou sua orientação! 🎉';
    return 'recusou sua solicitação de orientação.';
}

function situacaoBadgeClass (situacao) {
    if (situacao === 'confirmado') return 'bg-green-500';
    if (situacao === 'pendente') return 'bg-orange-500';
    return 'bg-red-500';
}

const linhasExibidas = computed(() =>
    props.usuario?.tipo === 'professor'
        ? orientacoes.filter((item) => item.situacao === 'pendente')
        : orientacoes
);

function situacaoClass (situacao) {
    if (situacao === 'confirmado') return 'bg-green-100 text-green-700';
    if (situacao === 'pendente') return 'bg-orange-100 text-orange-700';
    return 'bg-red-100 text-red-700';
}

async function recarregar (event){
    openRespostaOrientacao.value = event
    await listarOrientacao ()
    emits ('atualizado')
}

async function listarOrientacao () {
    orientacoes.splice (0, orientacoes.length);
    await api.get (`/orientacao/`)
        .then ((res) => {
            Object.assign (orientacoes, res.data?.item);
        }).catch ((e) => {
            popupInfo ().warning (e?.response?.data?.msg || e);
        })
}

async function cancelarPedido (orientacaoParaCancelar) {
    openRespostaOrientacao.value = true;
    Object.assign(orientacao, orientacaoParaCancelar)
}

async function responderOrientacao (orientacaoParaNegar, novaSituacao) {
    openRespostaOrientacao.value = true;
    situacao.value = novaSituacao;
    Object.assign (orientacao, orientacaoParaNegar)
}

onMounted (listarOrientacao);
</script>
