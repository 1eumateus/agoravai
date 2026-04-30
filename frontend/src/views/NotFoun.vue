<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <h2 class="text-2xl font-semibold text-gray-700 mb-4">
        Página não encontrada
      </h2>
      <p class="text-gray-600 mb-8">
        Você não tem permissão para acessar esta página ou ela não existe.
      </p>
      <router-link
        to="/ui/"
        class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Voltar para o início
      </router-link>
    </div>
  </div>
</template>

<script setup>
// Componente simples para página 404
</script>
