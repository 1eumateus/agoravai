<template>
   <main class="flex-grow relative " >
        <section class="mx-auto max-w-7xl p-[14px] flex flex-col gap-[24px]">
            <section class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-[12px] items-center">
                <div class="flex flex-col gap-[4px] col-span-1 md:col-span-3 lg:col-span-4">
                    <div>
                        <Texto as="body" for="pesquisar">
                            Pesquisar
                        </Texto>
                    </div>
                    <input 
                        v-model="procurar" 
                        type="text" 
                        id="pesquisar" 
                        class="p-[8px] border h-11 border-principal rounded-md focus:outline-principal" 
                        placeholder="Pesquise pelo nome do professor"
                        maxlength="50"
                    />
                </div>
                <div class="flex flex-col gap-[4px]">
                    <div>
                        <Texto as="body" for="pesquisar">
                            Disponibilidade
                        </Texto>
                    </div>
                    <select 
                        v-model="procurarDisponibilidade" 
                        class="p-[8px] border border-principal rounded-md h-11 focus:outline-principal " >
                        <option 
                            :value="disponi.value" 
                            v-for="disponi in disponibilidades">
                            {{ disponi.nome }}
                        </option>
                    </select>
                </div>
                <div class="flex flex-col gap-[4px]">
                    <div>
                        <Texto as="body" for="pesquisar">
                            Área
                        </Texto>
                    </div>
                    <select 
                        v-model="procurarInteresse" 
                        class="p-[8px] border border-principal rounded-md h-11 focus:outline-principal" >
                        <option value="" selected>Não aplicado</option>
                        <option 
                            :value="area" 
                            v-for="area in areaProfessores">
                            {{ area?.substring(0, 40) }}...
                        </option>
                    </select>
                </div>
               <div class="flex flex-col h-full justify-end">
                    <button 
                        type="button" 
                        class="text-[16px] font-normal bg-white border border-gray-400 hover:bg-gray-200 rounded-md py-[10px]" 
                        @click="limparFiltro" 
                    >
                        Limpar filtro
                    </button>
                </div>
            </section>
            <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]">
                <section class="flex items-end flex-col gap-[16px] border border-secundaria-opaco rounded-md p-[10px] justify-between bg-white" v-for="(professor, index) in professores" :key="index">
                    <div class="flex items-center gap-[16px]">
                        <section class="h-full flex items-center justify-center bg-gray-100">
                            <img 
                                v-if="professor?.imagem?.filename"
                                :src="`${urlApi}/uploads/${professor?.imagem?.filename}`" 
                                :alt="professor?.imagem?.originalname" 
                                class="h-[80px] min-w-[80px] max-w-[80px] rounded-md"
                            />
                            <img 
                                v-else
                                :src="`/Sem_imagem.jpg`" 
                                :alt="'sem imagem'" 
                                class="h-[80px] min-w-[80px] rounded-md"
                            />
                        </section>
                        <section class="flex flex-col gap-[6px]">
                            <Texto as="body-bold">
                                {{ professor.nome }}  {{ professor.sobrenome }}
                            </Texto>
                            <div class="flex flex-wrap">
                                <div :class="`
                                    ${disponibilidades.find((item)=> item.value === professor.disponibilidade).color} flex justify-center rounded-2xl p-1`" 
                                    v-if="orientacoes.findIndex((item)=> item?.professor?._id === professor._id) === -1">
                                    <Texto as="label">
                                        Disponibilidade {{ professor.disponibilidade || '-' }} 
                                    </Texto>
                                </div>
                                <div class="bg-orange-200 flex justify-center rounded-2xl p-1" v-else>
                                    <Texto as="label" >
                                        {{ 
                                            (orientacoes.find((item)=> item?.professor?._id === professor._id) !== -1 )
                                            ?   (
                                                    orientacoes.find((item)=> item?.professor?._id === professor._id).situacao==='confirmado' 
                                                        ? 'Em orientação'
                                                        :'Orientação solicitada'
                                                ) 
                                            : (professor.disponibilidade || '-') 
                                        }} 
                                    </Texto>
                                </div>
                            </div>
 
                            <div class="flex flex-col">
                                <Texto as="body">
                                    {{
                                        professor.interesse?.length > 90 
                                            ? professor.interesse.substring(0, 90)+' ...'
                                            : (professor.interesse || '-')
                                    }}
                                </Texto>
                            </div>
                        </section>
                    </div>
                    <router-link 
                        :to="`/professor/${professor._id}`" 
                        class="flex items-center gap-[2px] cursor-pointer"
                    >
                        <Texto as="button" color="blue">
                         mais informações 
                        </Texto>
                        <PhCaretRight :size="18" class="fill-blue-700 hover:fill-blue-900" />
                    </router-link>
                </section>
            </section>
        </section>
    </main>
</template>
<script setup>
import { PhCaretRight } from '@phosphor-icons/vue';
import { onMounted, ref, watch, reactive } from "vue";
import api from "@/api.js";
import { popupInfo } from '../stores/util.js';
import Texto from '@components/Texto.vue'

const professores = ref([])
const procurar = ref('')
const procurarDisponibilidade = ref('')
const procurarInteresse = ref('')
const orientacoes = reactive([])
const urlApi = import.meta.env.VITE_URL;
const props = defineProps({
    usuario: {
        type: [Object],
        required: false, 
    },
})

const disponibilidades = [
    { value: "", nome: "Não aplicado", color:'bg-blue-200' },
    { value: "matutino", nome: "Matutino", color:'bg-blue-200' },
    { value: "vespertino", nome: "Vespertino", color:'bg-blue-200' },
    { value: "noturno", nome: "Noturno", color:'bg-blue-200' },
    { value: "integral", nome: "Integral", color:'bg-blue-200' },
    { value: "flexivel", nome: "Flexível", color:'bg-blue-100' },
];

const areaProfessores = reactive([])

async function start() {
    await api.get(`/usuario/professores?procurar=${procurar.value}&&procurarDisponibilidade=${procurarDisponibilidade.value}&&procurarInteresse=${procurarInteresse.value}`)
    .then((res)=>{
        professores.value = res.data.item;
        for(let i=0;i<professores.value?.length;i++){
            const professor = professores.value[i]
            if (professor.interesse) {
                if (!areaProfessores.includes(professor.interesse)) {
                    areaProfessores.push(professor.interesse);
                }
            }
        }
    }).catch((e)=>{
        popupInfo().warning('Erro ao pesquisar usuários.');
    })
    if(props?.usuario.tipo === 'aluno'){
        listarOrientacao()
    }
}

function limparFiltro(){
    procurar.value = '';
    procurarDisponibilidade.value = '';
    procurarInteresse.value = '';
}

async function listarOrientacao(){
    await api.get(`/orientacao/`)
    .then((res)=>{
        Object.assign(orientacoes, res.data?.item)
    }).catch((e)=>{
        popupInfo().warning(e?.response?.data?.msg || e);
    })
}

watch([procurar, procurarDisponibilidade, procurarInteresse], () => {
    start();
});

onMounted(start);
</script>