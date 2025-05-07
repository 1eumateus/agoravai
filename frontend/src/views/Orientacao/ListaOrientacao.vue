<template>
    <RespostaOrientacao
        @modal:open="recarregar($event)"
        :orientacao="orientacao"
        :situacao="situacao"
        :usuario="props?.usuario"
        v-if="openRespostaOrientacao"
    />
    <div class="grid grid-cols-1 gap-[8px]">
        <section class="grid grid-cols-1 gap-[6px] border border-secundaria-opaco rounded-md bg-white p-[10px]" >
            <Texto as="h4">
                Orientações
            </Texto>
            <div class="overflow-x-auto">
                <table v-if="orientacoes.length>0" class="min-w-full text-center ">
                    <thead>
                        <tr class="bg-gray-400 font-bold border">
                            <td class="p-2 text-left" v-if="props?.usuario.tipo !== 'professor'">
                                Orientador
                            </td>
                            <td class="p-2 text-left" v-if="props?.usuario.tipo !== 'aluno'">
                                Aluno
                            </td>
                            <td class="p-2">
                                Situação
                            </td>
                            <td class="p-2">
                                Proposta
                            </td>
                            <td class="p-2 " v-if="props?.usuario.tipo !== 'admin'">
                                Resposta do orientador
                            </td>
                            <td class="p-2 min-w-40">
                                Data e hora de defesa
                            </td>
                            <td class="p-2 ">
                                Opções
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(orientacao, index) in orientacoes" :key="index"  class="  even:bg-gray-200" >
                            <td class="p-2 text-left min-w-40" v-if="props?.usuario.tipo !== 'professor'">
                                {{ orientacao?.professor?.nome }} {{ orientacao?.professor?.sobrenome }}
                            </td>
                            <td class="p-2 text-left min-w-40" v-if="props?.usuario.tipo !== 'aluno'">
                                {{ orientacao.aluno.nome }} {{ orientacao.aluno.sobrenome }}
                            </td>
                            <td class="p-2 ">
                                <Texto 
                                    as="body" 
                                    :color="`${orientacao.situacao=='pendente' 
                                        ? 'orange' 
                                        : orientacao.situacao=='confirmado' ? 'green' : 'red'}`"
                                    >
                                    {{ orientacao.situacao }}
                                </Texto>
                            </td>
                            <td class="p-2 text-left min-w-40">
                                {{ orientacao.proposta || ' - ' }}
                            </td>
                            <td class="p-2 text-left min-w-40 " v-if="props?.usuario.tipo !== 'admin'">
                                {{ orientacao.resposta || ' - ' }}
                            </td>
                            <td class="p-2 ">
                                {{ orientacao.dataDefesa ? formatMask.viewDate(orientacao.dataDefesa) : '-'}}
                                {{ orientacao.horaDefesa ? orientacao.horaDefesa : ' : -'}}
                            </td>
                            <td class="p-2 flex flex-col items-center justify-center gap-[8px]">
                                <button 
                                        type="button" 
                                        :onClick="()=> usuario.tipo === 'aluno' ? cancelarPedido(orientacao): responderOrientacao(orientacao, 'negado')" 
                                        class="cursor-pointer w-full flex flex-col items-center gap-[4px] p-[4px] border border-red-400 hover:bg-red-100 rounded-md"
                                        v-if="props.usuario.tipo === 'aluno' || (props.usuario.tipo === 'professor' && orientacao.situacao !== 'negado')"
                                    >  
                                    {{ props.usuario.tipo === 'aluno' ? ' Deletar ' : 'Negar' }}
                                </button>
                                <button 
                                    type="button" 
                                    :onClick="()=> responderOrientacao(orientacao, 'confirmado')" 
                                    v-if="props.usuario.tipo === 'professor' && orientacao.situacao !== 'confirmado'"
                                    class="cursor-pointer flex flex-col items-center gap-[4px] p-[4px] border border-green-400 hover:bg-green-100 rounded-md w-full"
                                >  
                                    Confirmar orientação
                                </button>
                                <router-link 
                                    :to="`/ui/orientacao/${orientacao._id}`" 
                                    class="cursor-pointer flex flex-col justify-center items-center gap-[4px] p-[4px] border border-blue-400 hover:bg-blue-100 rounded-md w-full"
                                    v-if="orientacao.situacao === 'confirmado'"
                                >
                                    Detalhes
                                </router-link>
                            </td>
                        </tr>
                    </tbody>
                </table> 
                <Texto as="body" v-else>
                    Nenhum pedido de orientação.
                </Texto>
            </div>
        </section>
    </div>
</template>

<script setup>
import Texto from '@components/Texto.vue'
import { onMounted, reactive, ref } from "vue";
import api from "@/api.js";
import { popupInfo, formatMask } from '../../stores/util.js';
import RespostaOrientacao from './RespostaOrientacao.vue';

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

async function recarregar (event){
    openRespostaOrientacao.value = event
    await listarOrientacao ()
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