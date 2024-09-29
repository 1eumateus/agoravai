<template>
   <main class="flex-grow relative ">
        <section class="mx-auto max-w-5xl p-[14px] flex flex-col gap-[8px]">
            
            <div class="flex justify-between">
                <div class="flex items-center gap-[8px] justify-between">
                    <Texto as="h3">
                        Orientação
                    </Texto>
                </div>
                <div class="flex justify-end">
                    <button 
                        @click="gerarConvite"
                        type="button" 
                        class="cursor-pointer py-[10px] px-[12px] h-11 border border border-terciaria hover:bg-terciaria hover:text-white rounded-md"
                    >
                            Gerar cartaz de divulgação
                    </button>
                </div>
            </div>
                
            <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-[8px]">
                <section class="grid grid-cols-1 gap-[6px] col-span-1">
                    <div class=" gap-[6px] p-[10px] border border-secundaria-opaco rounded-md bg-white ">
                        <Texto as="h4">
                            Orientador
                        </Texto>
                        <div class="flex flex-col">
                            <Texto as="body">
                                {{ form?.professor?.nome }} {{ form?.professor?.sobrenome }}
                            </Texto>
                            <Texto as="body">
                                {{ form?.professor?.email }}
                            </Texto>
                        </div>
                    </div>
                    
                    <div class=" gap-[6px] p-[10px] border border-secundaria-opaco rounded-md bg-white ">
                        <Texto as="h4">
                            Aluno
                        </Texto>
                        <div class="flex flex-col">
                            <Texto as="body">
                                {{ form.aluno.nome }} {{ form.aluno.sobrenome }}
                            </Texto>
                            <Texto as="body">
                                {{ form.aluno.email }}
                            </Texto>
                        </div>
                    </div>
                    <section class="gap-[6px] flex flex-col border border-secundaria-opaco rounded-md bg-white p-[10px]">
                        <div class="flex items-center justify-between">
                            <Texto as="h4">
                                Proposta
                            </Texto>
                            <div class="flex items-center gap-1">
                                <button 
                                    type="button" 
                                    class="cursor-pointer py-[8px] px-[10px] border border-gray-300 hover:bg-gray-200 rounded-md"
                                    :onClick="()=>editandoProposta = true"
                                    v-if="!editandoProposta"
                                >
                                        <PhPencilSimple :size="18" />
                                </button>
                                <button 
                                    type="button" 
                                    class="cursor-pointer py-[8px] px-[10px] border border-red-600 hover:bg-gray-200 rounded-md"
                                    :onClick="()=>{ editandoProposta= false; propostaParaEditar = form.proposta }"
                                    v-else
                                >
                                        <PhX :size="18" class="fill-red-600"  />
                                </button>
                                <button 
                                    type="button" 
                                    class="cursor-pointer py-[5px] px-[10px] border border-principal hover:bg-gray-200 rounded-md"
                                    :onClick="salvarProposta"
                                    v-if="editandoProposta"
                                >
                                        Salvar alteração
                                </button>
                            </div>
                        </div>
                        <Texto as="body" v-if="!editandoProposta">
                            {{ form.proposta }}
                        </Texto>
                        <div class="flex flex-col gap-[4px]" v-else>
                            <textarea 
                                v-model="propostaParaEditar" 
                                id="propostaParaEditar" 
                                class="p-[8px] border border-terciaria rounded-md focus:outline-principal" 
                                placeholder="Escreva a sua proposta de trabalho."
                                maxlength="200"
                                rows="4"
                            ></textarea>
                        </div>
                    </section>
                </section>

                <section class="grid grid-cols-1 gap-[6px] col-span-1 md:col-span-2 lg:col-span-2 ">
                    <section class="grid grid-cols-1 gap-2 border border-secundaria-opaco rounded-md bg-white p-2.5 gap-[8px]">
                        <div class="flex flex-col gap-[8px] w-full ">
                            <Texto as="h4">
                                Informações para defesa
                            </Texto>
                            <div class="grid grid-cols-12 gap-[8px] items-end">
                                <div class="col-span-5">
                                    <Campo 
                                        v-model="form.coorientador.nome" 
                                        label="Nome do coorientador" 
                                        id="coorientadorNome" 
                                        type="text"
                                        :obrigatorio="true"
                                        placeholder="ex.: Davi Barroso"
                                        :maxLength="30"
                                    />
                                </div>
                                <div class="col-span-5">
                                    <Campo 
                                        v-model="form.coorientador.instituicao" 
                                        label="Instituição" 
                                        id="coorientadorinstituicao" 
                                        type="text"
                                        :obrigatorio="true"
                                        placeholder="ex.: UFPA/FECOMP"
                                        :maxLength="20"
                                    />
                                </div>
                            </div>
                            <div class="grid grid-cols-12 gap-[8px] items-end">
                                <div class="col-span-5">
                                    <Campo 
                                        v-model="form.tema" 
                                        label="Tema" 
                                        id="tema" 
                                        type="text"
                                        :obrigatorio="true"
                                        placeholder="ex.: SOTCC - Sistema de orientação em TCC"
                                    />
                                </div>
                                <div class="col-span-5">
                                    <Campo 
                                        v-model="form.link" 
                                        label="Local virtual (link)" 
                                        id="link" 
                                        type="text"
                                        :obrigatorio="false"
                                        placeholder="ex.: https://meet.google.com/"
                                        :maxLength="200"
                                    />
                                </div>
                            </div>
                            <div class="grid grid-cols-12 gap-[8px] items-end">
                                <div class="col-span-5">
                                    <Campo 
                                        v-model="form.dataDefesa" 
                                        label="Data de defesa" 
                                        id="dataDefesa" 
                                        type="date"
                                        :obrigatorio="true"
                                    />
                                </div>
                                <div class="col-span-5">
                                    <Campo 
                                        v-model="form.horaDefesa" 
                                        label="Hora da defesa" 
                                        id="horaDefesa" 
                                        type="time"
                                        placeholder="10:30"
                                        :obrigatorio="true"
                                    />
                                </div>
                                <div class="col-span-2">
                                    <button 
                                        type="button" 
                                        @click="salvar"
                                        class="h-11 w-full px-3 text-white bg-principal hover:bg-principal-opaco font-bold text-sm rounded-md cursor-pointer">
                                        Salvar
                                    </button>
                                </div>
                            </div>
                            <hr/>
                            <div class="grid grid-cols-12 items-end gap-2 ">
                                <div class="col-span-5">
                                    <Campo 
                                        v-model="participanteBanca.nome" 
                                        label="Novo participante da banca" 
                                        id="nome" 
                                        type="text"
                                        :obrigatorio="false"
                                        placeholder="ex.: Prof. Dr. Davi Barroso"
                                        :maxLength="30"
                                    />
                                </div>
                                <div class="col-span-5">
                                    <Campo 
                                        v-model="participanteBanca.instituicao" 
                                        label="Instituição" 
                                        id="instituicao" 
                                        type="text"
                                        :obrigatorio="false"
                                        placeholder="ex.: UFPA/FECOMP"
                                        :maxLength="20"
                                    />
                                </div>
                                <div class="col-span-2">
                                    <button 
                                        type="button" 
                                        :onClick="editar"
                                        :class="`${editandoParticipante !==-1 ? ' bg-orange-600 ':' bg-principal hover:bg-principal-opaco '} w-full h-11 text-white px-3 font-bold text-sm rounded-md cursor-pointer`">
                                        {{ editandoParticipante !==-1 ? 'Salvar alteração': 'Adicionar'}}
                                    </button>
                                </div>
                            </div>
                            <div class="flex flex-col gap-2">
                                <Texto as="body-bold">
                                    Banca examinadora
                                </Texto>
                                <div v-if="form.banca.length>0" class=" overflow-auto border">
                                    <div v-for="(participante, index) in form.banca" :key="index" class="even:bg-gray-200 flex items-center justify-between gap-2 p-1"> 
                                        <Texto as="body">
                                            {{ participante.nome }}
                                        </Texto>
                                        <Texto as="body">
                                            {{ participante.instituicao }}
                                        </Texto>
                                        <div class="flex items-center gap-2" > 
                                            <button 
                                                type="button" 
                                                class="cursor-pointer py-[10px] px-[12px] h-11 border border-gray-400 hover:bg-gray-300 rounded-md"
                                                :onClick="()=>removerParticipante(index)">
                                                <PhTrash :size="22" />
                                            </button>
                                            <button 
                                                type="button" 
                                                class="cursor-pointer py-[10px] px-[12px] h-11 border border border-gray-400 hover:bg-gray-300 rounded-md"
                                                :onClick="()=>editarParticipante(index)"
                                            >
                                                    <PhPencilSimple :size="22" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <Texto as="label" v-else>
                                    Sem participantes da banca.
                                </Texto>
                            </div>
                        </div>
                    </section>
                </section>
            </div>
        </section>
    </main>
</template>

<script setup>
import { PhTrash, PhPencilSimple, PhX } from '@phosphor-icons/vue';
import Texto from '@components/Texto.vue'
import Campo from '@components/Campo.vue'
import { onMounted, reactive, ref } from "vue";
import api from "@/api.js";
import { formatMask, popupInfo } from '../../stores/util.js';
import { useRouter, useRoute } from "vue-router";

const router = useRouter();

const props = defineProps({
    usuario: {
        type: [Object],
        required: false, 
    },
})

const emits = defineEmits(['modal:open']);

const participanteBanca = reactive({
    nome: '',
    instituicao: '',
})
const editandoParticipante = ref(-1);

const editandoProposta = ref(false);
const propostaParaEditar = ref('');

const form = reactive({
    _id: false,
    situacao: "",
    aluno: "",
    professor: "",
    proposta: "",
    resposta: "",
    tema: "",
    banca: [{
        nome: '',
        instituicao: '',
    }],
    coorientador: {
        nome: '',
        email: '',
    },
    dataDefesa: null,
    ativo: true,
});

async function start() {
    const route = useRoute();
    if (route?.params?.id) {
        form._id = route.params.id;
        await api.get(`/orientacao/${form._id}`)
        .then((res)=>{
            Object.assign(form, res.data.orientacao)
            form.dataDefesa = formatMask.date(form.dataDefesa)
            propostaParaEditar.value = form.proposta
        }).catch((e)=>{
            popupInfo().warning(e.response?.data?.msg || e);
            router.push({name: 'Perfil'})
        })
    }
    if(form.situacao !== 'confirmado'){
        router.push({name: 'Perfil'})
    }
}

function removerParticipante(index){
    form.banca.splice(index, 1);
    salvar()
}

function editarParticipante(index){
    Object.assign(participanteBanca, form.banca[index])
    editandoParticipante.value = index;
}

function salvarProposta(){
    editandoProposta.value = false; 
    form.proposta= propostaParaEditar.value; 
    salvar()
}

async function editar(){
    if(!participanteBanca.nome.trim()) return popupInfo().warning('Informe nome do participante');
    if(!participanteBanca.instituicao.trim()) return popupInfo().warning('Informe instituição do participante');
  
    if(editandoParticipante.value !== -1){
        Object.assign(form.banca[editandoParticipante.value] , participanteBanca)
        editandoParticipante.value = -1;
    }else{
        console.log(participanteBanca)
        form.banca.push({
                nome: participanteBanca.nome, 
                instituicao: participanteBanca.instituicao
        })
    }
    participanteBanca.nome = ''
    participanteBanca.instituicao = ''
    salvar()
}

async function salvar(){
    await api.put(`/orientacao/editar`, form)
    .then((res)=>{
        popupInfo().success(res?.data?.msg);
    }).catch((e)=>{
        popupInfo().warning(e?.response?.data?.msg || e);
    })
}

async function gerarConvite(){

    if(!form.tema.trim()){
        return popupInfo().warning('Informe tema do TCC.');
    }
    if(!form.coorientador.nome.trim()){
        return popupInfo().warning('Informe nome do coorientador.');
    }
    if(!form.coorientador.instituicao.trim()){
        return popupInfo().warning('Informe instituição do coorientador.');
    }
    if(!form.dataDefesa){
        return popupInfo().warning('Informe data de defesa do TCC.');
    }
    if(!form.horaDefesa){
        return popupInfo().warning('Informe hora de defesa do TCC.');
    }

    await api.post(`/orientacao/gerarConvite`, form, {
        responseType: 'blob' 
    })
    .then((res)=>{
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'cartaz de divulgação.pdf'); 
        document.body.appendChild(link);
        link.click();
        link.remove();
        popupInfo().success('Cartaz gerado com sucesso.');
    }).catch((e)=>{
        popupInfo().warning(e?.response?.data?.msg || e);
    })
}

onMounted(start);
</script>