<template>
    <div class="flex flex-col gap-[4px] " >
        <div class="flex items-center gap-[10px]">
            <Texto as="body" :for="props?.id">
                {{ props.label }}
            </Texto>
            <Texto as="body" :for="props?.id" color="gray" for="registrarsobrenome" v-if="props?.opcional">
                Opcional
            </Texto>
       </div>
        <input 
            v-model="valorCampo" 
            :type="props?.type" 
            :name="props?.id" 
            :id="props?.id" 
            autocomplete="off"
            :placeholder="placeholder"
            :maxLength="maxLength" 
            :class="`p-[8px] border h-11 border-principal focus:outline-principal rounded-md `" >
    </div>
</template>

<script setup>
import { computed } from 'vue';
import Texto from '@components/Texto.vue'

const props = defineProps({
    modelValue: {
        type: [String, Number, Object, null],
        required: false
    },
    label: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: 'text'
    },
    maxLength: {
        type: Number,
    },
    id: {
        type: String,
        default: ''
    },
    placeholder: {
        type: String,
        default: ''
    },
    opcional: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['update:modelValue']);

const valorCampo = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit('update:modelValue', value);
    }
});

</script>