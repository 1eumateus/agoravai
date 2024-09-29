<template>
   <main class="flex-grow relative ">
        <section class="mx-auto max-w-5xl p-[14px] grid grid-cols-1 gap-[4px]">
            <div class="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 items-center gap-2">
                <div class="flex flex-col gap-[4px] col-span-1 md:col-span-8 lg:col-span-10">
                    <div>
                        <Texto as="body" for="pesquisar">
                                Pesquisar
                        </Texto>
                    </div>
                    <input 
                        v-model="search" 
                        type="text" 
                        id="pesquisar" 
                        class="p-[8px] w-full border h-11 border-principal rounded-md focus:outline-principal" 
                        placeholder="Pesquise pelo nome do usuário"
                        maxlength="65"
                    />
                </div>
                <div class="flex flex-col gap-[4px] col-span-1 md:col-span-4 lg:col-span-2">
                    <div>
                        <Texto as="body" for="pesquisarTipo">
                            Tipo de usuário
                        </Texto>
                    </div>
                    <select 
                        v-model="searchTipo" 
                        id="pesquisarTipo" 
                        class="p-[8px] w-full border border-principal rounded-md h-11 focus:outline-principal " >
                        <option :value="''" selected>Todos</option>
                        <option :value="'professor'">Professor</option>
                        <option :value="'aluno'"> Aluno</option>
                    </select>
                </div>
            </div>

            <div class="flex justify-between mt-2">
                <Texto as="h3">
                    Usuários cadastrados
                </Texto>
            </div>
            <div class="flex justify-between gap-[8px] border bg-white border-secundaria-opaco rounded-md p-[8px]" 
                v-for="(usuario, index) in usuarios" :key="index">

                <section class="flex items-center gap-[8px]">
                    <svg 
                        class="h-[40px] w-[40px] fill-gray-400"
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 256 256">
                        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM74.08,197.5a64,64,0,0,1,107.84,0,87.83,87.83,0,0,1-107.84,0ZM96,120a32,32,0,1,1,32,32A32,32,0,0,1,96,120Zm97.76,66.41a79.66,79.66,0,0,0-36.06-28.75,48,48,0,1,0-59.4,0,79.66,79.66,0,0,0-36.06,28.75,88,88,0,1,1,131.52,0Z"></path>
                    </svg>
                    <div class="flex flex-col gap-[2px]">
                        <Texto as="body-bold">
                            {{ usuario.nome }} {{ usuario.sobrenome }}
                        </Texto>
                        <Texto as="body">
                            {{ usuario.tipo }} 
                        </Texto>
                    </div>
                </section>
            </div>
        </section>
    </main>
</template>

<script setup>
import Texto from '@components/Texto.vue'
import { onMounted, ref, watch } from "vue";
import api from "@/api.js";
import { popupInfo } from '../../stores/util.js';

const usuarios = ref([])
const search = ref('')
const searchTipo = ref('')

defineProps(["usuario"]);

async function start() {
    await api.get(`/usuario?search=${search.value}&&searchTipo=${searchTipo.value}`)
    .then((res)=>{
        usuarios.value = res.data.item;
    }).catch((e)=>{
        popupInfo().warning('Erro ao pesquisar usuários.');
    })
}

watch(search, () => {
    start();
});

watch(searchTipo, () => {
    start();
});

onMounted(start);
</script>