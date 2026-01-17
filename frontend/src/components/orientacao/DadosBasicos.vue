<template>
  <section class="grid grid-cols-1 gap-[6px] col-span-1">
    <div class="p-[10px] border rounded-md bg-white">
      <Texto as="h4">Orientador</Texto>
      <Texto as="body">
        {{ professor?.nome }} {{ professor?.sobrenome }}
      </Texto>
      <Texto as="body">{{ professor?.email }}</Texto>
    </div>

    <div class="p-[10px] border rounded-md bg-white">
      <Texto as="h4">Aluno</Texto>
      <Texto as="body">
        {{ aluno?.nome }} {{ aluno?.sobrenome }}
      </Texto>
      <Texto as="body">{{ aluno?.email }}</Texto>
    </div>
  </section>
</template>

<script setup>
import Texto from '@components/Texto.vue'

defineProps({
  aluno: Object,
  professor: Object
})
</script>
