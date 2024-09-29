<template>
    <div class="fixed inset-0 z-40 flex items-center justify-center bg-gray-600 bg-opacity-50">
            <main class="w-full md:w-[480px] lg:w-[480px] p-[24px] overflow-y-auto bg-white rounded-md flex flex-col gap-[24px]">
                <section class="grid grid-cols-1 gap-[14px]">
                    <div class="flex items-center justify-between border-b border-gray-300">
                        <Texto as="h3">
                            Solicitar orientação
                        </Texto>
                        <button 
                        type="button" 
                        :onClick="()=> emits('modal:open', false)" 
                        class="cursor-pointer"
                    >
                        <PhX :size="18" class="fill-gray-700 hover:fill-black" />
                    </button>
                       
                    </div>
                    <div class="flex flex-col gap-[4px]">
                        <div class="flex items-center gap-[10px]">
                            <Texto as="body" for="proposta">
                                Proposta
                            </Texto>
                        </div>
                        <textarea 
                            v-model="form.proposta" 
                            id="proposta" 
                            class="p-[8px] border border-principal rounded-md focus:outline-principal" 
                            placeholder="Escreva a sua proposta de trabalho."
                            maxlength="200"
                            rows="4"
                        ></textarea>
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
                        class=" font-bold text-[14px] bg-principal hover:bg-principal-opaco text-white py-[8px] px-[12px] rounded-md cursor-pointer">
                        solicitar
                    </button>
                </section>

            </main>
    </div>
</template>

<script setup>
import Texto from '@components/Texto.vue'
import { PhX } from '@phosphor-icons/vue';
import { reactive } from "vue";
import { popupInfo } from '../../stores/util.js';
import api from "@/api.js";

const props = defineProps({
    aluno: {
        type: String,
        required: true, 
    },
    professor: {
        type: String,
        required: true, 
    },
})

const emits = defineEmits(['modal:open']);

const form = reactive({
    aluno: "",
    professor: "",
    proposta: "",
});

async function solicitar(){
    form.aluno = props?.aluno;
    form.professor = props.professor;
    if(!form.aluno){
        return popupInfo().warning('Aluno inválido.');
    }
    if(!form.professor){
        return popupInfo().warning('Professor inválido.');
    }
    let idOrientacao = '';

    await api.post(`/orientacao/criar`, form)
    .then((res)=>{
        idOrientacao = res.data.id
    }).catch((e)=>{
        popupInfo().warning(e?.response?.data?.msg);
    })

    if(idOrientacao){
        await api.put(`/usuario/adicionarOrientacao`,
         {aluno: form.aluno, orientacao: idOrientacao}
        ).then((res)=>{
            popupInfo().success(res?.data?.msg);
            emits('modal:open', false)
        }).catch((e)=>{
            console.log(e)
            popupInfo().warning(e?.response?.data?.msg);
        })
    }
}

</script>