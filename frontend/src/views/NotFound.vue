<template>
    <div class="flex-grow">
        <main class="mx-auto max-w-6xl">
            <Card titulo="Página não encontrada">
                <div class="flex items-center justify-center">
                    <PhWarning :size="180" color="#fc9403" weight="light" />
                </div>
            </Card>
        </main>
    </div>
</template>
<script setup>
import { PhWarning } from "@phosphor-icons/vue";
import Card from '@components/Card.vue';
</script>