<template>
    <div class="flex-grow">
        <main class="mx-auto max-w-7xl">
            <div class="flex items-center justify-center">
                <PhWarning :size="180" color="#fc9403" weight="light" />
            </div>
        </main>
    </div>
</template>
<script setup>
import { PhWarning } from "@phosphor-icons/vue";
</script>