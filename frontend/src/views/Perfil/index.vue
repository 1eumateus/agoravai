<template>
   <main class="flex-grow relative ">
        <section class="mx-auto max-w-5xl p-[14px] flex flex-col gap-[8px]">
            
            <div class="flex flex-col justify-center pt-[10px]">
                <label class="text-sm font-bold">
                    {{ form.tipo }}
                </label>
                <label class="text-[38px] font-bold">
                    Minhas informações
                </label>
            </div>
            <div class="flex justify-between gap-[8px] border rounded-md p-[8px]">
                <section class="flex items-center gap-[8px]">
                    <svg 
                        class="h-[92px] w-[92px] fill-gray-400"
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 256 256">
                        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM74.08,197.5a64,64,0,0,1,107.84,0,87.83,87.83,0,0,1-107.84,0ZM96,120a32,32,0,1,1,32,32A32,32,0,0,1,96,120Zm97.76,66.41a79.66,79.66,0,0,0-36.06-28.75,48,48,0,1,0-59.4,0,79.66,79.66,0,0,0-36.06,28.75,88,88,0,1,1,131.52,0Z"></path>
                    </svg>
                    <div class="flex flex-col">
                        <label class="text-[16px] font-bold">
                            {{ form.nome }} {{ form.sobrenome }}
                        </label>
                        <label class="text-[16px] ">
                            {{ form.area || 'Sem área de interesse' }}
                        </label>
                        <label class="text-[16px] ">
                            {{ form.disponibilidade || 'Não disponível' }}
                        </label>
                    </div>
                </section>
                <section class="flex flex-col items-end justify-between gap-[8px]">
                    <label class=" font-bold text-[14px] bg-gray-300 hover:bg-gray-400 py-[8px] px-[12px] rounded-md cursor-pointer">
                        Editar
                    </label>
                    <label class="text-[16px] ">
                        {{ form.universidade || 'Sem universidade' }} 
                    </label>
                </section>
                
            </div>

            <div class="flex items-end gap-[8px] border rounded-md p-[8px]">
                <div class="flex flex-col">
                    <label class="text-[16px] font-bold">
                        Descrição:
                    </label>
                    <label class="text-[16px] ">
                       {{ form.descricao || 'Sem descrição.' }}
                    </label>
                </div>
            </div>
        </section>
    </main>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import api from "@/api.js";

const props = defineProps({
    emailUser: {
        type: String,
        required: false, 
    },
    typeUser: {
        type: String,
        required: false, 
    },
})

const form = reactive({
    _id: false,
    nome: "",
    senha: "",
    despesas: [],
    orcamentos: [],
    tipo: null,
    ativo: true,
});

async function start() {
    const emailUser = props?.emailUser;

    await api.get(`/usuario/pegarPorEmail/${emailUser}`)
    .then((res)=>{
        Object.assign(form, res.data.usuario)
    }).catch((e)=>{
        console.log(e)
    })
}

onMounted(start);
</script>