<template>

  <Menu v-if="tokenValid" :user="usuario"></Menu>
  <router-view
    :usuario="usuario"
  />
  <Rodape v-if="tokenValid"></Rodape>

</template>

<script setup>
import { checkToken } from "./stores/checkToken";
import Menu from "./components/Menu.vue";
import Rodape from "./components/Rodape.vue";
import { onMounted, ref } from "vue";

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
