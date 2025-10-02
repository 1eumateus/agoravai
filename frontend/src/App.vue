<template>
  
  <Menu v-if="tokenValid" :user="usuario"></Menu>
  <Breadcumbs v-if="tokenValid"></Breadcumbs>
  <router-view :usuario="usuario"/>
  <Rodape v-if="tokenValid"></Rodape>
  <loading v-model:active="isLoading.state" :color="'blue'" :width="100" :height="100" class="mt-12 mb-10 z-30" />

</template>

<script setup>
import { checkToken } from "./stores/checkToken";
import Menu from "./components/Menu.vue";
import Breadcumbs from "./components/Breadcumbs.vue";
import Rodape from "./components/Rodape.vue";
import { onMounted, ref } from "vue";
import { useLoaderState } from "./stores/isLoading";
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
const isLoading = useLoaderState();

const tokenValid = ref(false);
const usuario = ref(null);

function start() {
  verifyToken()
}

async function verifyToken() {
  const res = await checkToken();
  tokenValid.value = res.valid;
  usuario.value = res
}

onMounted(start);
</script>
