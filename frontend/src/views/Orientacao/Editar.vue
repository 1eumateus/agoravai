<template>
   <main class="flex-grow relative ">
        <section class="mx-auto max-w-2xl p-[14px] flex flex-col gap-[14px]">

            <Texto as="h3" color="principal">
                Orientação
            </Texto>

            <section class="border border-secundaria-opaco rounded-md bg-white p-[16px] flex flex-col gap-[14px]">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-[14px]">
                    <div class="flex flex-col gap-[2px]">
                        <Texto as="small" color="gray">
                            Orientador
                        </Texto>
                        <Texto as="body-bold">
                            {{ form.professor?.nome }} {{ form.professor?.sobrenome }}
                        </Texto>
                        <Texto as="label" color="gray">
                            {{ form.professor?.email }}
                        </Texto>
                    </div>
                    <div class="flex flex-col gap-[2px]">
                        <Texto as="small" color="gray">
                            Aluno
                        </Texto>
                        <Texto as="body-bold">
                            {{ form.aluno?.nome }} {{ form.aluno?.sobrenome }}
                        </Texto>
                        <Texto as="label" color="gray">
                            {{ form.aluno?.email }}
                        </Texto>
                    </div>
                </div>

                <hr class="border-secundaria" />

                <div class="flex flex-col gap-[6px]">
                    <div class="flex items-center justify-between">
                        <Texto as="h4" color="principal">
                            Proposta do aluno
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
                </div>
            </section>
        </section>
    </main>
</template>

<script setup>
import { PhPencilSimple, PhX } from '@phosphor-icons/vue';

import Texto from '@components/Texto.vue'
import { onMounted, reactive, ref } from "vue";
import api from "@/api.js";
import { formatMask, popupInfo } from '../../stores/util.js';
import { useRouter, useRoute } from "vue-router";

const router = useRouter();

defineProps({
    usuario: {
        type: [Object],
        required: false,
    },
})

const editandoProposta = ref(false);
const propostaParaEditar = ref('');

const form = reactive({
    _id: false,
    situacao: "",
    aluno: "",
    professor: "",
    proposta: "",
    resposta: "",
    presencial: false,
    local: "",
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

function salvarProposta(){
    editandoProposta.value = false;
    form.proposta= propostaParaEditar.value;
    salvar()
}

async function salvar(){
    if (form.link?.trim() && !form.link?.startsWith('https://')) {
        return popupInfo().warning('Informe um link válido.');
    }

    await api.put(`/orientacao/editar`, form)
    .then((res)=>{
        popupInfo().success(res?.data?.msg);
    }).catch((e)=>{
        popupInfo().warning(e?.response?.data?.msg || e);
    })
}

onMounted(start);
</script>
