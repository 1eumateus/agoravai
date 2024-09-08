<template>

  <Menu v-if="tokenValid" :user="userType"></Menu>
  <router-view
    :idUser="idUser"
  />
  <Rodape v-if="tokenValid"></Rodape>

</template>

<script setup>
import { checkToken } from "./stores/checkToken";
import Menu from "./components/Menu.vue";
import Rodape from "./components/Rodape.vue";
import { onMounted, ref } from "vue";

const tokenValid = ref(false);
const userType = ref('user');
const idUser = ref('');

function start() {
  verifyToken()
}

async function verifyToken() {
  const res = await checkToken();
  tokenValid.value = res.valid;
  userType.value = res.tipo;
  idUser.value = res.id
}

onMounted(start);
</script>
