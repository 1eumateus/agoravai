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
                            class="p-[8px] border border-black" 
                            placeholder="Escreva a sua proposta de trabalho."
                            maxlength="80"
                            rows="4"
                        ></textarea>
                    </div>

                </section>
                <section class="flex justify-between gap-[24px] border-t border-gray-300 py-[10px]">
                    <button 
                        type="button" 
                        :onClick="()=> emits('modal:open', false)" 
                        class=" font-bold text-[14px] bg-gray-300 hover:bg-gray-400 py-[8px] px-[12px] rounded-md cursor-pointer">
                        Cancelar
                    </button>
                    <button 
                        type="button" 
                        :onClick="salvar" 
                        class=" font-bold text-[14px] bg-gray-300 hover:bg-gray-400 py-[8px] px-[12px] rounded-md cursor-pointer">
                        solicitar
                    </button>
                </section>

            </main>
    </div>
</template>

<script setup>
import Texto from '@components/Texto.vue'
import { PhX } from '@phosphor-icons/vue';
import { reactive, ref } from "vue";
import api from "@/api.js";

const emits = defineEmits(['modal:open']);
const confirmarSenha = ref('');

const form = reactive({
    aluno: "",
    pendente: true,
    professor: "",
    proposta: "",
});

async function salvar(){

    console.log(form)
}

</script>