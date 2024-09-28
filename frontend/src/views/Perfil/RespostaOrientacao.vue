<template>
    <div class="fixed inset-0 z-40 flex items-center justify-center bg-gray-600 bg-opacity-50">
        <main class="w-full md:w-[480px] lg:w-[480px] p-[24px] overflow-y-auto bg-white rounded-md flex flex-col gap-[24px]">
            <section class="grid grid-cols-1 gap-[14px]">
                <div class="flex items-center justify-between border-b border-gray-300" v-if="props?.usuario.tipo === 'professor'" >
                    <Texto as="h3" >
                        {{situacao==='confirmado'? 'Confirmar orientação':'Negar orientação'}}
                    </Texto>
                    <button 
                        type="button" 
                        :onClick="()=> emits('modal:open', false)" 
                        class="cursor-pointer"
                    >
                    <PhX :size="18" class="fill-gray-700 hover:fill-black" />
                    </button>
                </div>
                <div class="flex flex-col gap-[4px]" v-if="props?.usuario.tipo === 'professor'">
                    <div class="flex items-center gap-[10px]">
                        <Texto as="body" for="resposta">
                            Resposta {{ props?.user }}
                        </Texto>
                        <Texto as="body" color="gray" for="resposta">
                            Opcional
                        </Texto>
                    </div>
                    <textarea 
                        v-model="form.resposta" 
                        id="resposta" 
                        class="p-[8px] border border-principal rounded-md focus:outline-principal" 
                        placeholder="Escreva uma resposta para orientação."
                        maxlength="200"
                        rows="4"
                    ></textarea>
                </div>
                <div class="flex flex-col items-center text-center w-full gap-1" v-if="props?.usuario.tipo === 'aluno'">
                    <PhWarning :size="80" color="#fc9403" weight="light" />
                    <Texto as="h4" for="resposta" >
                        Tem certeza que deseja deletar a orientação do professor {{ orientacao.professor.nome }}?
                    </Texto>
                </div>
            </section>
            <section class="flex justify-between gap-[24px] border-t border-gray-300 py-[10px]">
                <button 
                    type="button" 
                    :onClick="()=> emits('modal:open', false)" 
                    class=" font-bold text-[14px] border hover:bg-gray-200 py-[8px] px-[12px] rounded-md cursor-pointer">
                    Cancelar
                </button>
                <button 
                    type="button" 
                    :onClick="solicitar" 
                    v-if="props?.usuario.tipo === 'professor'"
                    class=" font-bold text-[14px] bg-principal hover:bg-principal-opaco text-white py-[8px] px-[12px] rounded-md cursor-pointer">
                    {{situacao==='confirmado'? 'Confirmar orientação':'Negar orientação'}}
                </button>
                <button 
                    type="button" 
                    :onClick="cancelarPedido" 
                    v-if="props?.usuario.tipo === 'aluno'"
                    class=" font-bold text-[14px] bg-principal hover:bg-principal-opaco text-white py-[8px] px-[12px] rounded-md cursor-pointer">
                    Deletar
                </button>
            </section>
        </main>
    </div>
</template>

<script setup>
import Texto from '@components/Texto.vue'
import { PhX, PhWarning } from '@phosphor-icons/vue';
import { reactive } from "vue";
import { popupInfo } from '../../stores/util.js';
import api from "@/api.js";

const props = defineProps({
    orientacao: {
        type: Object,
        required: true, 
    },
    situacao: {
        type: String,
        required: true, 
    },
    usuario: {
        type: [Object],
        required: false, 
    },
})

const emits = defineEmits(['modal:open']);

const form = reactive({
    resposta: "",
    id: "",
    situacao: 'negado',
});

async function solicitar(){
    form.id = props?.orientacao._id
    form.situacao = props.situacao;

    await api.put(`/orientacao/alterarSituacao`, form)
    .then((res)=>{
        popupInfo().success(res?.data?.msg);
    }).catch((e)=>{
        popupInfo().warning(e?.response?.data?.msg || e);
    })
    emits('modal:open', false)
}

async function cancelarPedido(){

    const formOrientacao = {
        id: props?.orientacao._id
    }
    await api.put(`/orientacao/alterarSituacao`, formOrientacao)
    .then((res)=>{
        popupInfo().success(res?.data?.msg);
    }).catch((e)=>{
        popupInfo().warning(e?.response?.data?.msg || e);
    }).finally(()=>emits('modal:open', false))
}
</script>