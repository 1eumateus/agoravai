<template>
    <div class="grid grid-cols-2 gap-[10px]">
        <div class="flex items-center gap-[4px]">
            <Texto as="body" for="pesquisar">
                Campus/Instituto
            </Texto>
            <Texto as="body-bold" for="pesquisar" color="red">
                *
            </Texto>
        </div>
        <div class="flex items-center gap-[4px]">
            <Texto as="body" for="pesquisar">
                Faculdade/Curso
            </Texto>
            <Texto as="body-bold" for="pesquisar" color="red">
                *
            </Texto>
        </div>
        <select
            v-model="lotacaoPrincipal.unidade"
            @change="unidadeChanged($event.target.value)"
            class="p-[8px] h-11 border border-principal focus:outline-principal rounded-md " >
            <option 
                :value="u._id" 
                v-for="u in lotacaoAlternativas.unidades">
                {{ u.unidade }}
            </option>
        </select>
        <select 
            v-model="lotacaoPrincipal.subunidade"
            @change="subunidadeChanged()"
            class="p-[8px] h-11 border border-principal focus:outline-principal rounded-md " >
            <option 
                :value="u._id" 
                v-for="u in lotacaoAlternativas.subunidadesSelected">
                {{ u.subunidade }}
            </option>
        </select>
    </div>
    <div v-if="props.multiplasLotacoes">
        <div class="flex flex-col gap-[4px]" >
            <texto as="h4">
                Outros cursos para (co)orientação
            </texto>
        </div>
        <div class="grid grid-cols-7 gap-[10px]">
            <div class="flex items-center col-span-3 gap-[4px]">
                <Texto as="body" for="pesquisar">
                    Campus/Instituto
                </Texto>
            </div>
            <div class="flex items-center col-span-3 gap-[4px]">
                <Texto as="body" for="pesquisar">
                    Faculdade/Curso
                </Texto>
            </div>
            <div class="flex items-center gap-[4px]"></div>
        </div>
        <div v-for="(unidade, index) in outrasLotacoes.unidadesNomes" :key='index' class="grid grid-cols-7 gap-[10px]">
            <span class=" col-span-3 ">
                {{ unidade }}
            </span>
            <span class=" col-span-3 ">
                {{ outrasLotacoes.subunidadesNomes [index] }}
            </span>
            <button 
                    type="button" 
                    class="text-[16px] w-full font-normal border border-gray-400 hover:bg-gray-200 rounded-md p-[8px] flex gap-1 justify-center " 
                    @click="removeOutraLotacao (index)"
                >
                    -
            </button>
        </div>
        <div class="grid grid-cols-7 gap-[10px]">
            <select
                v-model="addLotacao.unidade"
                @change="outrasUniddadeChanged ($event.target.value)"
                class="p-[8px] h-11 border col-span-3 border-principal focus:outline-principal rounded-md " >
                <option 
                    :value="u._id" 
                    v-for="u in lotacaoAlternativas.unidades">
                    {{ u.unidade }}
                </option>
            </select>
            <select 
                v-model="addLotacao.subunidade"
                class="p-[8px] h-11 border col-span-3 border-principal focus:outline-principal rounded-md " >
                <option 
                    :value="u._id" 
                    v-for="u in lotacaoAlternativas.outrasSubunidadesSelected">
                    {{ u.subunidade }}
                </option>
            </select>
            <div class="flex flex-col gap-[4px]">
                <button 
                    type="button" 
                    class="text-[16px] w-full font-normal border border-gray-400 hover:bg-gray-200 rounded-md p-[8px] flex gap-1 justify-center " 
                    @click="addOutraLotacaoPressed ()"
                >
                    +
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>

import { onMounted, reactive } from "vue";
import Texto from '@components/Texto.vue';
import { popupInfo } from '../../stores/util.js';
import api from "@/api.js";

const props = defineProps ({
    subunidades: {
        type: [Object],
        required: true, 
    },
    unidades: {
        type: [Object],
        required: true, 
    },
    multiplasLotacoes: {
        type: [Boolean],
        default: true
    }
})

const outrasLotacoes = reactive ({
    unidades: [],
    subunidades: [],
    unidadesNomes: [],
    subunidadesNomes: [],
});

const addLotacao = reactive ({
    unidade: '',
    subunidade: '',    
});

const lotacaoPrincipal = reactive ({
    unidade: '',
    subunidade: '',    
});

const lotacaoAlternativas = reactive ({
    unidades: [],
    subunidades: [],
    subunidadesSelected: [],
    outrasSubunidadesSelected: [],
});


function rebuild () {
    props.unidades.splice (0, props.unidades.length);
    props.subunidades.splice (0, props.subunidades.length);
    props.unidades.push (lotacaoPrincipal.unidade);
    props.subunidades.push (lotacaoPrincipal.subunidade);
    for (let i = 0; i < outrasLotacoes.unidades.length; i ++) {
        props.unidades.push (outrasLotacoes.unidades [i]);
        props.subunidades.push (outrasLotacoes.subunidades [i]);
    }
}

function unidadeChanged (id) {
    let selected = [];
    lotacaoAlternativas.subunidades.forEach ((item) => {if (item.unidade_id == id) selected.push (item)});
    Object.assign (lotacaoAlternativas, {subunidadesSelected: selected});
}

function subunidadeChanged () {
    rebuild ();
}

function outrasUniddadeChanged (id) {
    let selected = [];
    lotacaoAlternativas.subunidades.forEach ((item) => {if (item.unidade_id == id) selected.push (item)});
    Object.assign (lotacaoAlternativas, {outrasSubunidadesSelected: selected});
}

function addOutraLotacao (unidade, subunidade) {
    for (let i = 0; i < outrasLotacoes.unidades.length; i++) {
        if (outrasLotacoes.unidades [i] == unidade && outrasLotacoes.subunidades [i] == subunidade) {
            popupInfo ().warning ('A alternativa já existe');
            return;
        }
    }
    let unidadeNome = "";
    let subunidadeNome = "";
    lotacaoAlternativas.unidades.forEach ((item) => {if (item._id == unidade) unidadeNome = item.unidade;})
    lotacaoAlternativas.subunidades.forEach ((item) => {if (item._id == subunidade) subunidadeNome = item.subunidade;})
    outrasLotacoes.unidades.push (unidade);
    outrasLotacoes.subunidades.push (subunidade);
    outrasLotacoes.unidadesNomes.push (unidadeNome);
    outrasLotacoes.subunidadesNomes.push (subunidadeNome);
}

function addOutraLotacaoPressed () {
    if (addLotacao.subunidade == '' || addLotacao.unidade == '') return;
    addOutraLotacao (addLotacao.unidade, addLotacao.subunidade);
    rebuild ();
}

function removeOutraLotacao (index) {
    outrasLotacoes.subunidades.splice (index, 1);
    outrasLotacoes.unidades.splice (index, 1);
    outrasLotacoes.subunidadesNomes.splice (index, 1);
    outrasLotacoes.unidadesNomes.splice (index, 1);
    rebuild ();
}

async function start () {
    await api.get ('/lotacao/lotacoes')
        .then ((res) => {
            Object.assign (lotacaoAlternativas, res.data);
            if (res.data.unidades.length > 0) {
                unidadeChanged (res.data.unidades [0]._id);
                outrasUniddadeChanged (res.data.unidades [0]._id);
            }
            if (props.unidades.length > 0) {
                lotacaoPrincipal.unidade = props.unidades [0];
                lotacaoPrincipal.subunidade = props.subunidades [0];
                for (let i = 1; i < props.unidades.length; i ++) {
                    addOutraLotacao (props.unidades [i], props.subunidades [i]);
                }
            }
        }).catch ((e) => {
            console.log (e);
            popupInfo ().warning ('Erro ao carregar as unidades/subunidades.');
        });
}

onMounted (start);

</script>