<template>
    <div class="fixed inset-0 z-40 flex items-center justify-center bg-gray-600 bg-opacity-50" v-if="aberto">
        <div class="w-full md:w-[480px] lg:w-[480px] p-[24px] max-h-[220px] overflow-y-auto bg-white rounded-md flex flex-col gap-[24px]">
            <section class="grid grid-cols-1 gap-[4px]">
                <div class="flex items-center justify-between border-b border-gray-300">
                    <Texto as="h4">
                        Cadastrar
                    </Texto>
                    <button
                        type="button"
                        @click="emit ('cancelar')"
                        class="cursor-pointer">
                        <PhX :size="18" class="fill-gray-700 hover:fill-black" />
                    </button>
                </div>
                <Texto as="body">
                    Um email de confirmação será enviado para
                </Texto>
                <Texto as="body" >
                    {{ email }}
                </Texto>
            </section>
            <section class="flex justify-between gap-[24px] border-t border-gray-300 pt-[10px]">
                <button
                    type="button"
                    @click="emit ('cancelar')"
                    class=" font-bold text-[14px] border hover:bg-gray-200 py-[8px] px-[12px] rounded-md cursor-pointer">
                    Cancelar
                </button>
                <button
                    type="button"
                    :onClick="() => emit ('confirmar')"
                    class=" font-bold text-[14px] bg-principal text-white hover:bg-principal-opaco py-[8px] px-[12px] rounded-md cursor-pointer">
                    Confirmar
                </button>
            </section>
        </div>
    </div>
</template>

<script setup>
import { PhX } from '@phosphor-icons/vue';
import Texto from '@components/Texto.vue';

defineProps (['aberto', 'email']);
const emit = defineEmits (['cancelar', 'confirmar']);
</script>
