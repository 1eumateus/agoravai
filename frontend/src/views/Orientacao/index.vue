<template>
   <main class="flex-grow relative ">
        <section class="mx-auto max-w-5xl p-[14px] flex flex-col gap-[8px]">
            
            <div class="flex flex-col">
                <div class="flex items-center gap-[8px] justify-between">
                    <Texto as="h3">
                        Orientação
                    </Texto>
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
                        <div class="flex items-start justify-between">
                            <Texto as="h4">
                                Co-orientador
                            </Texto>
                            <button 
                                type="button" 
                                class="cursor-pointer py-[8px] px-[10px] border border-gray-300 hover:bg-gray-200 rounded-md"
                                :onClick="()=>{
                                    editandoCoorientador = true; 
                                    coorientador.nome = form.coorientador.nome
                                    coorientador.email = form.coorientador.email
                                    }"
                                v-if="!editandoCoorientador"
                            >
                                <PhPencilSimple :size="18" />
                            </button>
                        </div>
                        <div class="flex flex-col">
                            <div class="flex flex-col" v-if="!editandoCoorientador">
                                <Texto as="body" >
                                    {{ form.coorientador.nome }}
                                </Texto>
                                <Texto as="body">
                                    {{ form.coorientador.email }}
                                </Texto>
                            </div>
                        <div class="flex flex-col gap-1" v-if="!form.coorientador.nome || editandoCoorientador">
                            <div class="">
                                    <Campo 
                                        v-model="coorientador.nome" 
                                        label="Nome" 
                                        id="coorientadorNome" 
                                        type="text"
                                        :opcional="false"
                                        placeholder="ex.: Davi Barroso"
                                        :maxLength="30"
                                    />
                            </div>
                            <Campo 
                                    v-model="coorientador.email" 
                                    label="Email" 
                                    id="coorientadorEmail" 
                                    type="email"
                                    placeholder="ex.: exemplo@exemplo.com"
                                    :opcional="true"
                                    :maxLength="50"
                                />
                                <div class="flex gap-2 justify-end" >
                                    <button 
                                        type="button" 
                                        class="h-11 px-3 text-red-600 border border-gray-300 hover:bg-gray-200 font-bold text-sm rounded-md cursor-pointer"
                                        :onClick="()=>{editandoCoorientador=false}"
                                        v-if="editandoCoorientador"
                                    >
                                        Cancelar
                                    </button>
                                
                                    <button 
                                        type="button" 
                                        class="h-11 px-3 text-white bg-principal hover:bg-principal-opaco font-bold text-sm rounded-md cursor-pointer"
                                        :onClick="salvarOrientador"
                                    >
                                        Salvar
                                    </button>
                                </div>
                            </div>
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
                </section>

                <section class="grid grid-cols-1 gap-[6px] col-span-1 md:col-span-2 lg:col-span-2 ">
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
                                class="cursor-pointer py-[8px] px-[10px] border border-gray-300 hover:bg-gray-200 rounded-md"
                                :onClick="()=>{ editandoProposta= false; propostaParaEditar = form.proposta }"
                                v-else
                            >
                                    <PhX :size="18"  />
                            </button>
                            <button 
                                type="button" 
                                class="cursor-pointer py-[6px] px-[10px] border border-gray-300 hover:bg-gray-200 rounded-md"
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
                                class="p-[8px] border border-principal rounded-md focus:outline-principal" 
                                placeholder="Escreva a sua proposta de trabalho."
                                maxlength="200"
                                rows="4"
                            ></textarea>
                        </div>
                    </section>

                    <section class="grid grid-cols-1 gap-2 border border-secundaria-opaco rounded-md bg-white p-2.5 gap-[8px]">
                        <div class="flex flex-col gap-[8px] w-full ">
                            <Texto as="h4">
                                Informações para defesa
                            </Texto>
                            <div class="flex gap-[8px] ">
                                
                                <Campo 
                                    v-model="form.dataDefesa" 
                                    label="Data de defesa" 
                                    id="dataDefesa" 
                                    type="date"
                                    :opcional="false"
                                />
                                
                                <div class="flex items-end gap-[8px] w-full">
                                    <div class="w-full">
                                        <Campo 
                                            v-model="form.horaDefesa" 
                                            label="Hora da defesa" 
                                            id="horaDefesa" 
                                            type="time"
                                            placeholder="10:30"
                                            :opcional="false"
                                        />
                                    </div>
                                    <button 
                                        type="button" 
                                        @click="salvar"
                                        class="h-11 w-full px-3 text-white bg-principal hover:bg-principal-opaco font-bold text-sm rounded-md cursor-pointer">
                                        Salvar data e hora
                                    </button>
                                </div>
                            </div>
                            <div class="flex items-end gap-2 ">
                                <div class="w-full">
                                    <Campo 
                                        v-model="participanteBanca" 
                                        label="Novo participante da banca" 
                                        id="nome" 
                                        type="text"
                                        :opcional="false"
                                        placeholder="ex.: Davi Barroso"
                                        :maxLength="30"
                                    />
                                </div>
                                <button 
                                    type="button" 
                                    :onClick="editar"
                                    class="h-11 px-3 text-white bg-principal hover:bg-principal-opaco font-bold text-sm rounded-md cursor-pointer">
                                    {{ editandoParticipante !==-1 ? 'Salvar alteração': 'Adicionar'}}
                                </button>
                            </div>
                            <div class="flex flex-col gap-2">
                                <Texto as="body-bold">
                                    Banca
                                </Texto>
                                <div v-if="form.banca.length>0" class=" overflow-auto border">
                                    <div v-for="(participante, index) in form.banca" :key="index" class="even:bg-gray-200 flex items-center justify-between gap-2 p-1"> 
                                        <Texto as="body">
                                            {{ participante }}
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

const participanteBanca = ref('')
const editandoParticipante = ref(-1);

const editandoProposta = ref(false);
const propostaParaEditar = ref('');

const editandoCoorientador = ref(false);

const coorientador = reactive({
    nome: '',
    email: '',
})
const form = reactive({
    _id: false,
    situacao: "",
    aluno: "",
    professor: "",
    proposta: "",
    resposta: "",
    banca: [],
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
    participanteBanca.value = form.banca[index]
    editandoParticipante.value = index;
}

function salvarProposta(){
    editandoProposta.value = false; 
    form.proposta= propostaParaEditar.value; 
    salvar()
}

async function editar(){
    if(!participanteBanca.value.trim()) return;

    if(editandoParticipante.value !== -1){
        form.banca[editandoParticipante.value] = participanteBanca.value
        editandoParticipante.value = -1;
    }else{
        form.banca.push(participanteBanca.value)
    }
    participanteBanca.value = ''
    salvar()
}

function salvarOrientador(){
    form.coorientador.nome = coorientador.nome
    form.coorientador.email = coorientador.email
    editandoCoorientador.value = false;
    salvar()
}

async function salvar(){
    console.log(form)
    await api.put(`/orientacao/editar`, form)
    .then((res)=>{
        popupInfo().success(res?.data?.msg);
    }).catch((e)=>{
        popupInfo().warning(e?.response?.data?.msg || e);
    })
}

onMounted(start);
</script>