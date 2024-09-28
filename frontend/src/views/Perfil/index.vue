<template>
    <EditarPerfil
        :form="form"
        @modal:open="recarregar($event)"
        v-if="openEditarPerfil"
    />
    <RespostaOrientacao
        @modal:open="recarregar($event)"
        :orientacao="orientacao"
        :situacao="situacao"
        :usuario="props?.usuario"
        v-if="openRespostaOrientacao"
    />

   <main class="flex-grow relative ">
        <section class="mx-auto max-w-5xl p-[14px] flex flex-col gap-[8px]">
            <div class="flex items-center gap-[8px] justify-between">
                <div class="flex flex-col">
                    <Texto as="small">
                        {{ form.tipo }}
                    </Texto>
                    <Texto as="h4">
                        {{ form.tipo !=='admin' ? ' Perfil público': 'Perfil privado' }}
                    </Texto>
                </div>
                <button 
                    type="button" 
                    :onClick="()=> openEditarPerfil = true" 
                    class="cursor-pointer flex items-center gap-[4px] px-[12px] py-[8px] border border-gray-400 bg-principal text-white hover:bg-principal-opaco rounded-md"
                >   Editar
                    <PhPencil :size="20" />
                </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-[8px]">
                <section class="flex flex-col items-center gap-[4px] border rounded-md border-secundaria-opaco p-[10px] bg-white">
                    <svg width="180" height="180" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <rect width="80" height="80" fill="url(#pattern0_4_1480)"/>
                        <defs>
                        <pattern id="pattern0_4_1480" patternContentUnits="objectBoundingBox" width="1" height="1">
                        <use xlink:href="#image0_4_1480" transform="scale(0.0125)"/>
                        </pattern>
                        <image id="image0_4_1480" width="80" height="80" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAAAXNSR0IArs4c6QAABrlJREFUeF7tnW1u00gYx2ccJ0IooFRQIYTQEgkb+LTkBNueYMsN4AS0JyCcgHIC4ASUE5CeIHxDqo0CqlBVQDQQB6FgZ1Z/y846rh2Px84kcTxSFGhmxuOfn5d5eWZMyQJTr9drjEajLVVV/2KM3WeM3cIHTaKUut9+opT2x+PxR3xTSj8yxj4SQg5VVX3XbDb7i7oNKvPCPjBFUf5hjO2EIYm2BUAJIR3Hcd7UarWOTKBSABqGsUUpfUwI2WKMNURB8ZajlL4EzDt37hzwlhHNNzeAkDbbtncBTga0KACeZLYrlcphs9mElOaecge4DODClDyb+UrTtHbeBHMFeHR09FBRlCe+I8i7sVnr8yXy9u3br7LWNXFueVTU6/Vu2bb9AjYuj/ok1HGgqupeHmqdWQINw4Cdg9TN3TnkDBbdod2s0igMELbOcZw2YwzedZXTvqZpe6I3IATQU9nXhJD7ohdepnKMsXfVavWBiEqnBgh4juO8XVZHIfpg4GAqlcp2WoipABYVXmC4mBoiN8CiwxOFyAVwXeCJQOQCaBhGtygOg9dGwrEMh8PtVqs1c6YnEaBpmvsF6KrwcgvnS+zizASIoRmlFCOMtU2O4+zdvXt3Pw5ALEDP7nVXcISR98Puq6raiuvexAI0TfM1Jj3zbs2K1tfRNG07qu2RAEvVPY+KUvowatwcCdA0zV7RRhpZJR8jlcFg0Ap75XMADcPApOOTrBcsaPm2pmlPg/c2BXDdOswCD7lvWVYzKIVTAEvbx4V0SgqnAJa2jwtgX9O0jcmwz/+HaZo7jDHM8ZUpmcC2pmkdZJtIoGmaLxhjD5PLljkIIQeapj2YAPSWIs9KNNwEJs7ElcBSfbnBBTPuaJr2xgdYqm9KhoyxfV3X93yA0kYelmWRs7P8rYWiKGRjY4NcvHgxJQqx7IgO03W9SWXaP9u2yfHxsViLOUtdv36dXLhwgTN3tmyWZW1QRE4RQt5mq4qv9GAwIN++fePLLJjr6tWr5NKlS4KlUxfbAUCMe3MPuolqShaAUFF8IMWzkkyAjLFdKrP/JwoQdu3atWsut36/P9OGygSIOERIINRXSlCQKMCgXRuPx+TTp0+xQigTIKJiAVDaipsowEaj4XpYpOFwSL58+bIUAOGJocJnstY9eACqqup6UXR3gqler7s2EH+HFMYlmRLoAjQMg6X2PYIFeADevHmTAOLJyQn5/ft36ivJBIjGLRXAK1eukMuXL7vQIGWfP39O9LphwmsLECq6ubk5xWM0GrmS6KtsrVZzvfHp6SnBb1FpLQFCZW/cuOHauHD68eMH+f79u6vW8Mb4Rl8Q0hllC6UDPDo66uW14SXJYMXZQN/uxZX/+fOnO8YFPD/BPkI6F6zCfbpogEG7l/QAwr9HdaplSiACkBbakY6ye2khfv36darLIxOg25Fe5FAuj5sNm4U86uR9iO5Q7sOHD4/H43Fs9BFvZTz5wjcLmxa0azx1hPPAGwediUyAmISBBEpbjePpSItADJaRDHBL6oRqnOfMCi1YPsmj53ktd0IVFcr0xL9+/XKno2aNZ0VvEhMOcEwy0mRKHxczDOMZIWRXxoWLcg3G2Etd1x+Vy5riT/T/ZU1v3xtW5lZtw6D47WcsCfuHKK1JaIdhGIiLKUN6OcD66ousQYDSVuc42rjsWVz1nQKI/8icnV52QnHt872v//tUfKDMJc5VBRgONg+H+GITdelMYp4upM9xnO179+5NTgCJCjKXttC+glI4O8gcN4QuzZ8/f7qyJllXBWLY9kXaQP+PZbD5+ceaaqONN7yTFrGwAlI4CekNtzV2r9z79+9vVavVcrMhIX3btltBxxGEOHO7K86EIYRgomFtU5zqzrSBQVrrPFPjh/HOkp7EHeteBCvsYSHOiOFVJay46breSsqfCBAVwB5WKpW369K1ieowx4HkArhOENPAOzeZkCSuRZfEtPBSAyyyJIrAEwLoQ1RVtVCHjzmO8yCur5fJC88qXIQuDroqw+HwadIBO5mdSFwF3rGfz1ZwPaXPGGvruv48yfbPTQL9iuFcVFXFiGVV1lQ6tm0/ElFZ7rGwyFOBNOLAimXtL8JRKIrSznrsJ/dYWAQiymBpAJu3lwgkDhDbtyzruaitm5sNjKvY6zNipW+REjk3cNyTCaJSGJqQ+Nc7O1/GkQKAhvMMcPLaYR7tn7sT4W1kt9tt1Ot190UE2F6Wl4p7b3Y4oJR2LMs6zFtNlwZguCEe0L99mN5xUwgvwaswpsJMPEh4TQZeiYHPO7weQzaw8D38B7TS6zIWljY5AAAAAElFTkSuQmCC"/>
                        </defs>
                    </svg>
                    <Texto as="body-bold">
                        {{ form.nome }} {{ form.sobrenome }}
                    </Texto>
                    <Texto as="body">
                        {{ form.instituicao }} 
                    </Texto>
                    <div 
                        v-if="form.tipo === 'professor'"
                        :class="`${disponibilidades.find((item)=> item.value === form?.disponibilidade)?.color} flex justify-center rounded-2xl p-1`">
                        <Texto as="label">
                            Disponibilidade {{ form?.disponibilidade || '-' }} 
                        </Texto>
                    </div>
                    
                    <div class="flex flex-col gap-[8px] w-full">
                        <hr class="" />
                        <div class="flex justify-center gap-[8px]">
                            <a :href="form.linkedin" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                class="text-blue-500 hover:text-blue-800" v-if="form.linkedin">
                                <PhLinkedinLogo :size="24"/>
                            </a>
                            <a :href="form.github" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                class="text-gray-800 hover:text-gray-900" v-if="form.github" >
                                <PhGithubLogo :size="24" />
                            </a>
                            <a :href="form.lattes" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                class="text-gray-800 hover:text-gray-900" v-if="form.lattes">
                                <img src="/curriculoLattes.jpeg" alt="Currículo Lattes" class="h-[24px] w-[24px]" />
                            </a>
                        </div>
                        <Texto as="body">
                            {{ form.email }}
                        </Texto>
                        <Texto as="body">
                            {{ formatMask.tel(form.celular) }}
                        </Texto>
                    </div>
                </section>

                <section class="flex flex-col gap-[8px] border rounded-md border-secundaria-opaco p-[10px] col-span-2 bg-white">
                    <div class="flex flex-col gap-[8px]">
                        <div class="flex flex-col gap-[8px]">
                        <Texto as="body-bold">
                            Descrição
                        </Texto>
                        <Texto as="body">
                            {{ form.descricao || 'Não informado.' }}
                        </Texto>
                    </div>
                    <hr class="" v-if="form.tipo === 'professor'" />
                    <div class="flex flex-col gap-[8px]" 
                        v-if="form.tipo === 'professor'"
                    >
                        <Texto as="body-bold">
                            Formação acadêmica/profissional
                        </Texto>
                        <Texto as="body">
                            {{ form.formacao || 'Não informado.' }}
                        </Texto>
                    </div>
                    <hr class="" v-if="form.tipo === 'professor'"/>
                    <div class="flex flex-col gap-[8px]" v-if="form.tipo === 'professor'">
                        <Texto as="body-bold">
                            Área de interesse
                        </Texto>
                        <Texto as="body">
                            {{ form.interesse || '-' }}
                        </Texto>
                    </div>
                   </div>
                </section>
            </div>
            <div class="grid grid-cols-1 gap-[8px]">
                <Texto as="h4">
                    Orientações
                </Texto>
                <section class="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-[6px] border border-secundaria-opaco rounded-md bg-white p-[10px]" v-for="(orientacao, index) in orientacoes" :key="index" v-if="orientacoes.length>0">
                    <div class="grid grid-cols-1 gap-[4px] col-span-1 md:col-span-3 lg:col-span-3">
                        <div class="flex flex-col" v-if="props.usuario.tipo === 'aluno'">
                            <div class="flex flex-col">
                                <Texto as="body-bold">
                                    Orientador: 
                                </Texto>
                                <Texto as="body">
                                    {{ orientacao?.professor?.nome }} {{ orientacao?.professor?.sobrenome }}
                                </Texto>
                            </div>
                            <div class="flex flex-col">
                                <Texto as="body-bold">
                                    Co-orientador:
                                </Texto>
                                <Texto as="body">
                                    {{ orientacao?.coorientador?.nome }}
                                </Texto>
                            </div>
                            <div class="flex gap-[4px]">
                                <Texto as="body-bold">
                                    Situação:
                                </Texto>
                                <Texto 
                                    as="body" 
                                    :color="`${orientacao.situacao=='pendente' 
                                        ? 'orange' 
                                        : orientacao.situacao=='confirmado' ? 'green' : 'red'}`">
                                     {{ orientacao.situacao }}
                                </Texto>
                            </div>
                        </div>
                        <div class="flex flex-col" v-else>
                            <div class="flex flex-col">
                                <Texto as="body-bold">
                                    Aluno:
                                </Texto>
                                <Texto as="body">
                                    {{ orientacao.aluno.nome }} {{ orientacao.aluno.sobrenome }}
                                </Texto>
                            </div>
                            <div class="flex flex-col">
                                <Texto as="body-bold">
                                    Co-orientador:
                                </Texto>
                                <Texto as="body">
                                    {{ orientacao?.coorientador?.nome }}
                                </Texto>
                            </div>
                            <div class="flex gap-[4px]">
                                <Texto as="body">
                                    Situação:
                                </Texto>
                                <Texto 
                                    as="body" 
                                    :color="`${orientacao.situacao=='pendente' 
                                        ? 'orange' 
                                        : orientacao.situacao=='confirmado' ? 'green' : 'red'}`">
                                     {{ orientacao.situacao }}
                                </Texto>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col gap-[4px] col-span-1 md:col-span-7 lg:col-span-7">
                        <div class="flex gap-1" v-if="orientacao.situacao === 'confirmado'">
                            <Texto as="body-bold">
                                Data de defesa:
                            </Texto>
                            <Texto as="body">
                                {{ formatMask.viewDate(orientacao.dataDefesa) }} {{ orientacao.horaDefesa }}
                            </Texto>
                        </div>
                        <div class="flex flex-col">
                            <Texto as="body-bold">
                                Proposta
                            </Texto>
                            <Texto as="body">
                                {{ orientacao.proposta }}
                            </Texto>
                        </div>
                        <div class="flex flex-col" v-if="orientacao.resposta">
                            <Texto as="body-bold">
                                Resposta do professor
                            </Texto>
                            <Texto as="body">
                                {{ orientacao.resposta }}
                            </Texto>
                        </div>
                    </div>
                    <div class="flex flex-col gap-[8px] items-start md:items-end lg:items-end col-span-1 md:col-span-2 lg:col-span-2">
                        <div class="flex md:flex-col lg:flex-col gap-[8px]">
                            <button 
                                type="button" 
                                :onClick="()=> usuario.tipo === 'aluno' ? cancelarPedido(orientacao): responderOrientacao(orientacao, 'negado')" 
                                class="cursor-pointer flex flex-col items-center gap-[4px] p-[4px] border border-red-400 hover:bg-red-100 rounded-md"
                                v-if="props.usuario.tipo === 'aluno' || (props.usuario.tipo === 'professor' && orientacao.situacao !== 'negado')"
                            >  
                            {{ props.usuario.tipo === 'aluno' ? ' Deletar orientação' : 'Negar orientação' }}
                            </button>
                            <button 
                                type="button" 
                                :onClick="()=> responderOrientacao(orientacao, 'confirmado')" 
                                v-if="props.usuario.tipo === 'professor' && orientacao.situacao !== 'confirmado'"
                                class="cursor-pointer flex flex-col items-center gap-[4px] p-[4px] border border-green-400 hover:bg-green-100 rounded-md"
                            >  
                                Confirmar orientação
                            </button>
                            <router-link 
                                :to="`/orientacao/${orientacao._id}`" 
                                class="cursor-pointer flex flex-col items-center gap-[4px] p-[4px] border border-blue-400 hover:bg-blue-100 rounded-md"
                                v-if="orientacao.situacao === 'confirmado'"
                            >
                               Detalhes
                            </router-link>
                        </div>
                    </div>
                </section>
                <section class="grid grid-cols-1 gap-[8px] border border-secundaria-opaco rounded-md bg-white p-[10px]" v-else>
                       Nenhum pedido de orientação.
                </section>
            </div>
        </section>
    </main>
</template>

<script setup>
import Texto from '@components/Texto.vue'
import { PhLinkedinLogo, PhGithubLogo, PhPencil  } from '@phosphor-icons/vue';
import { onMounted, reactive, ref } from "vue";
import api from "@/api.js";
import EditarPerfil from './EditarPerfil.vue'
import RespostaOrientacao from './RespostaOrientacao.vue'
import { popupInfo, formatMask } from '../../stores/util.js';

const openEditarPerfil = ref(false)
const openRespostaOrientacao = ref(false)
const orientacoes = reactive([])
const orientacao = reactive({})
const situacao = ref('')

const props = defineProps({
    usuario: {
        type: [Object],
        required: false, 
    },
})

const disponibilidades = [
    { value: "", nome: "Não aplicado", color:'bg-blue-200' },
    { value: "indisponível", nome: "Indisponível", color:'bg-red-200' },
    { value: "matutino", nome: "Matutino", color:'bg-blue-200' },
    { value: "vespertino", nome: "Vespertino", color:'bg-blue-200' },
    { value: "noturno", nome: "Noturno", color:'bg-blue-200' },
    { value: "integral", nome: "Integral", color:'bg-blue-200' },
    { value: "flexivel", nome: "Flexível", color:'bg-blue-100' },
];

const emits = defineEmits(['modal:open']);

const form = reactive({
    _id: false,
    nome: "",
    sobrenome: "",
    email: "",
    descricao: "",
    github: "",
    linkedin: "",
    senha: "",
    tipo: null,
    ativo: true,
});

async function start() {
    const idUser = props?.usuario.id;
    await api.get(`/usuario/${idUser}`)
    .then((res)=>{
        Object.assign(form, res.data.usuario)
    }).catch((e)=>{
        popupInfo().warning('Erro ao procurar usuário.');
    })

    listarOrientacao();
}
async function listarOrientacao(){
    orientacoes.splice(0, orientacoes.length);
    await api.get(`/orientacao/`)
    .then((res)=>{
        Object.assign(orientacoes, res.data?.item)
    }).catch((e)=>{
        popupInfo().warning(e?.response?.data?.msg || e);
    })
}

function recarregar(event){
    openEditarPerfil.value = event
    openRespostaOrientacao.value = event
    start()
}

async function cancelarPedido(orientacaoParaCancelar){
    openRespostaOrientacao.value = true;
    Object.assign(orientacao, orientacaoParaCancelar)
}

async function responderOrientacao(orientacaoParaNegar, novaSituacao){
    openRespostaOrientacao.value = true;
    situacao.value = novaSituacao;
    Object.assign(orientacao, orientacaoParaNegar)
}

onMounted(start);
</script>