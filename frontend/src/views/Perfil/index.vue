<template>
    <EditarPerfil
        :form="form"
        @modal:open="openEditarPerfil = $event"
        @modal:update="start"
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
                <div class="flex gap-2">
                    <button 
                        v-if="form.tipo === 'professor'"
                        type="button" 
                         @click="()=>scrollTo('orientacoes')"
                        class="cursor-pointer flex items-center gap-[4px] px-[12px] py-[8px] border border-principal bg-terciaria text-white hover:bg-terciaria-opaco rounded-md"
                    >   Pedidos de orientação
                    </button>
                    <button 
                        type="button" 
                        :onClick="()=> openEditarPerfil = true" 
                        class="cursor-pointer flex items-center gap-[4px] px-[12px] py-[8px] border border-gray-400 bg-principal text-white hover:bg-principal-opaco rounded-md"
                    >   Editar
                        <PhPencil :size="20" />
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-[8px]">
                <section class="flex flex-col items-center gap-[4px] border rounded-md border-secundaria-opaco p-[10px] bg-white">
                    <img 
                        v-if="form?.imagem?.filename"
                        :src="`${urlApi}/uploads/${form?.imagem?.filename}`" 
                        :alt="form?.imagem?.originalname" 
                        class="h-[180px] w-[180px] rounded-md"
                    />
                    <img 
                        v-else
                        :src="`/Sem_imagem.jpg`" 
                        :alt="'sem imagem'" 
                        class="h-[180px] w-[180px] rounded-md"
                    />
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
                            {{ form.telefone?.length > 8 ? formatMask.tel(form.telefone) : form.telefone }}
                        </Texto>
                    </div>
                    <div class="flex flex-col gap-[8px] w-full text-center justify-end h-full" v-if="form.tipo === 'professor'">
                        <hr class="" />
                        <Texto as="body">
                            Orientando {{ orientacoes.length }} aluno(s)
                        </Texto>
                    </div>
                </section>

                <section class="flex flex-col gap-[8px] border rounded-md border-secundaria-opaco p-[10px] col-span-2 bg-white">
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
                    <hr class="" v-if="form.tipo === 'professor'"/>
                    <div class="flex flex-col gap-[8px]" v-if="form.tipo === 'professor'">
                        <Texto as="body-bold">
                            Trabalhos de conclusão orientados ({{ form.trabalhosFimCurso.length }})
                        </Texto>
                        <div v-for="(trabalho, index) in form.trabalhosFimCurso" :key='index' v-if="form.trabalhosFimCurso.length>0">
                            <Texto as="body">
                              <b>{{ index+1 }}.</b>  {{ trabalho }}
                            </Texto>
                        </div>
                        <Texto as="body" v-else>
                            Sem trabalhos de conclusão orientados.
                        </Texto>
                    </div>
                </section>
            </div>
            <div class="grid grid-cols-1 gap-[8px]" id="orientacoes">
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
                                            :to="`/orientacao/${orientacao._id}`" 
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

const urlApi = import.meta.env.VITE_URL;

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
    imagem: null,
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

function scrollTo(nome){
    const div = document.getElementById(nome);
    if (div) {
        div.scrollIntoView({ behavior: 'smooth' });
    }
}

onMounted(start);
</script>