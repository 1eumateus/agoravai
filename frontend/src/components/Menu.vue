<template>
    <nav class="flex items-center justify-between px-[80px] h-[60px] border-b-[2px] border-terciaria gap-[24px] bg-principal text-white">
       <section class="flex items-center gap-[24px]">
            <label class="text-[40px] font-bold">
                Logo
            </label>
            <router-link to="/" class="hidden md:block lg:block hover:text-terciaria">
                Início
            </router-link>
        </section>

        <dropdown-menu mode="click" :overlay="false" class="hidden md:block lg:block">
            <template #trigger >
              <div class="cursor-pointer hover:text-terciaria"> Configurações </div>
            </template>
            <template #body>
                <div class="relative">
                    <div class="absolute z-40 top-4 right-0 bg-principal rounded-md border border-terciaria flex flex-col text-left">
                        <router-link 
                            to="/perfil" 
                            class="px-[14px] py-[8px] hover:text-terciaria w-full rounded-md" >
                            Perfil
                        </router-link>
                        <router-link 
                            to="/usuarios" 
                            class="px-[14px] py-[8px] hover:text-terciaria w-full rounded-md"
                            v-if="user === 'admin'"
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
import dropdownMenu from 'v-dropdown-menu';
defineProps(["user"]);

async function logout() {
    localStorage.removeItem("token");
    window.location.reload();
}
</script>