<template>
    <nav class="flex items-center font-bold justify-between px-[5px] md:px-[80px] lg:px-[80px] h-[60px] border-b-[2px] bg-gray-200 gap-[24px] text-principal" v-if="breadcrumbs">
        <ol role="list" class="flex flex-wrap">
            <li class="flex items-center">
                <router-link to="/" class="hover:opacity-50"  >
                    Início  
                </router-link>
            </li>
            
            <li v-for="(page, index) in breadcrumbs" :key="index" class="flex items-center gap-[8px] ml-[8px]">
                <Texto as="body" color="gray">
                    /
                </Texto>
                <router-link 
                    :to="page.href.replace(':id', route.params.id)" 
                    :class="`hover:opacity-50 ${page.current ? ' text-orange-400':''}`">
                     {{ page.name }}
                </router-link>
            </li>
        </ol>
    </nav>
</template>

<script setup>
import Texto from '@components/Texto.vue'
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const breadcrumbs = computed(() => {
    return route.meta.breadcrumb;
});
</script>
