<template>
  <main class="flex-grow">
    <section class="mx-auto max-w-5xl p-4 flex flex-col gap-4">
      <Texto as="h3"> Orientação </Texto>

      <section class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-4 border rounded-md bg-white">
          <Texto as="h4">Tema</Texto>
          <Texto as="body">{{ orientacao.tema || "Não informado" }}</Texto>
        </div>

        <div class="p-4 border rounded-md bg-white">
          <Texto as="h4">Situação</Texto>
          <Texto as="body">{{ orientacao.situacao }}</Texto>
        </div>
      </section>

      <div class="flex gap-2">
        <button
          @click="irParaAcompanhamento"
          class="h-11 px-4 bg-principal text-white rounded-md"
        >
          Acompanhar TCC
        </button>

        <button @click="irParaEdicao" class="h-11 px-4 border rounded-md">
          Editar orientação
        </button>
      </div>
    </section>
  </main>
</template>

<script setup>
import Texto from "@components/Texto.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const orientacao = {
  id: "123", // depois vem da API
  tema: "",
  situacao: "confirmado",
};

function irParaAcompanhamento() {
  router.push({
    name: "OrientacaoAcompanhamento",
    params: { id: orientacao.id },
  });
}

function irParaEdicao() {
  router.push({ name: "OrientacaoEditar", params: { id: orientacao.id } });
}
</script>
