<template>
   <main class="flex-grow relative " >
        <section class="mx-auto max-w-7xl p-[14px] flex flex-col gap-[24px]">
            <div class="flex flex-col gap-[4px]">
                <div>
                    <label class="text-[18px]" for="interesse">
                        Pesquisar
                    </label>
                </div>
                <input 
                    v-model="search" 
                    type="text" 
                    id="interesse" 
                    class="p-[8px] border border-black" 
                    placeholder="Pesquise pelo nome do professor"
                    maxlength="50"
                />
           </div>
            <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]">
                <section class="flex items-start flex-col gap-[16px] border rounded-md p-[10px]" v-for="(professor, index) in professores" :key="index">
                    <div class="flex items-center gap-[16px]">
                        <section>
                            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                <rect width="80" height="80" fill="url(#pattern0_4_1480)"/>
                                <defs>
                                <pattern id="pattern0_4_1480" patternContentUnits="objectBoundingBox" width="1" height="1">
                                <use xlink:href="#image0_4_1480" transform="scale(0.0125)"/>
                                </pattern>
                                <image id="image0_4_1480" width="80" height="80" xlink:href="data:image/png;base64,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"/>
                                </defs>
                            </svg>
                        </section>
                        <section class="flex flex-col gap-[4px]">
                            <label class="text-[20px] font-bold">
                                {{ professor.nome }}  {{ professor.sobrenome }}
                            </label>
                            <div class="flex flex-wrap gap-[8px]">
                                <label class="text-[16px] font-bold">
                                    Área:
                                </label>
                                <label class="text-[16px] ">
                                {{ professor.interesse || '-' }}
                                </label>
                            </div>

                            <div class="flex flex-wrap gap-[8px]">
                                <label class="text-[16px] font-bold">
                                    Disponibilidade:
                                </label>
                                <label class="text-[16px] ">
                                    {{ professor.disponibilidade || '-' }}
                                </label>
                            </div>
                        </section>
                    </div>
                    <label class="text-[18px] font-normal">
                        {{ professor.descricao || 'Sem descrição' }}
                    </label>
                    <router-link :to="`/professor/${professor._id}`" class="hidden md:block lg:block">
                        mais informações >
                    </router-link>
                </section>
            </section>
        </section>
    </main>
</template>
<script setup>
import { onMounted, ref, watch } from "vue";
import api from "@/api.js";
import { popupInfo } from '../stores/util.js';

const professores = ref([])
const search = ref('')

async function start() {
    await api.get(`/usuario?search=${search.value}`)
    .then((res)=>{
        professores.value = res.data.item;
        console.log(res.data.item)
    }).catch((e)=>{
        popupInfo().warning('Erro ao pesquisar usuários.');
    })
}

watch(search, () => {
    start();
});

onMounted(start);
</script>