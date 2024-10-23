<template>
    <nav class="flex items-center justify-between px-[5px] md:px-[80px] lg:px-[80px] border-b-[2px] border-terciaria gap-[24px] bg-principal text-white">
       <section class="flex items-center gap-[24px] ">
            <router-link to="/ui/" class=" hover:text-terciaria hidden md:block lg:block">
                <Texto as="h3" color="white" :cursorPointer="true">
                    SOTCC 
                </Texto>
                <Texto as="h3" color="white" :cursorPointer="true">
                    - Sistema de orientação em TCC
                </Texto>
            </router-link> 

            <router-link to="/ui/" class=" hover:text-terciaria block md:hidden lg:hidden">
                <Texto as="body-bold" color="white" :cursorPointer="true">
                    SOTCC 
                </Texto>
                <Texto as="body-bold" color="white" :cursorPointer="true">
                    - Sistema de orientação em TCC
                </Texto>
            </router-link> 
        </section>
      
            
        <dropdown-menu mode="click" :overlay="false" >
            <template #trigger >
                <div class="cursor-pointer hover:text-terciaria flex items-center gap-[8px]"> 
                    {{user.nome}} 
                    <PhGear :size="28" />
                </div>
            </template>
            <template #body>
                <div class="relative">
                    <div class="absolute z-40 top-4 right-0 bg-principal rounded-md border border-terciaria flex flex-col text-left">
                        <router-link 
                            to="/ui/perfil" 
                            class="px-[14px] py-[8px] hover:text-terciaria w-full rounded-md" >
                            Perfil
                        </router-link>
                        <router-link 
                            to="/ui/usuarios" 
                            class="px-[14px] py-[8px] hover:text-terciaria w-full rounded-md"
                            v-if="user.tipo === 'admin'"
                            >
                            Usuários 
                        </router-link>
                        <button 
                            type="button" 
                            @click="logout" 
                            class="flex px-[14px] py-[8px] hover:text-terciaria w-full rounded-md" >
                            Sair
                        </button>
                    </div>
                </div>
            </template>
        </dropdown-menu>
    </nav>
</template>

<script setup>
import { PhGear } from '@phosphor-icons/vue';
import Texto from '@components/Texto.vue'
import dropdownMenu from 'v-dropdown-menu';
defineProps(["user"]);

async function logout() {
    localStorage.removeItem("token");
    window.location.reload();
}
</script>