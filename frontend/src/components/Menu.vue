<template>
    <nav class="flex items-center justify-between px-[80px] h-[60px] border-b border-black gap-[24px]">
       <section class="flex items-center gap-[24px]">
            <label class="text-[40px] font-bold">
                Logo
            </label>
            <router-link to="/" >
                Início
            </router-link>
            <router-link to="/" >
                Meus trabalhos
            </router-link>
        </section>

        <dropdown-menu mode="click" :overlay="false">
            <template #trigger >
              <div class="cursor-pointer"> Configurações </div>
            </template>
            <template #body>
                <div class="relative">
                    <div class="absolute z-40 top-4 right-0 bg-gray-200 rounded-md border border-black flex flex-col text-left">
                        <router-link 
                            to="/perfil" 
                            class="px-[14px] py-[8px] hover:bg-gray-400 w-full rounded-md" >
                            Perfil
                        </router-link>
                        <button 
                            type="button" 
                            @click="logout" 
                            class="px-[14px] py-[8px] hover:bg-gray-400 w-full rounded-md" >
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