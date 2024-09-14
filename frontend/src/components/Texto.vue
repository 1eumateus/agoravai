<template>
    <label :class="computedClass" :for="props?.for">
        <slot></slot>
    </label>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    as: {
        type: String,
        required: true
    },
    color: {
        type: String,
        default: '',
        required: false
    },
    for: {
        type: String,
        default: ''
    }
});

const computedClass = computed(() => {
    let colorText = ' flex gap-[4px] ';
    let styleHover = '';
    switch (props?.color) {
        case 'principal':
            styleHover = props.as === 'button' ? ' hover:text-principal-opaco ' : ''
            colorText = ` text-principal ` + styleHover;
            break;
        case 'white':
            styleHover = props.as === 'button' ? ' hover:text-gray-400 ' : ''
            colorText = ` text-white ` + styleHover;
            break;
        case 'gray':
            styleHover = props.as === 'button' ? ' hover:text-gray-700 ' : ''
            colorText = ` text-gray-500 ` + styleHover;
            break;
        case 'blue':
            styleHover = props.as === 'button' ? ' hover:text-blue-900 ' : ''
            colorText = ` text-blue-700 `  + styleHover;
            break;
        case 'red':
            styleHover = props.as === 'button' ? ' hover:text-red-700 ' : ''
            colorText = ` text-red-500 ` + styleHover;
            break;
        case 'orange':
            styleHover = props.as === 'button' ? ' hover:text-orange-700 ' : ''
            colorText = ` text-orange-500 ` + styleHover;
            break;
        case 'green':
            styleHover = props.as === 'button' ? ' hover:text-green-800 ' : ''
            colorText = ` text-green-600 ` + styleHover;
            break;
        default:
            colorText = ` text-black `;
    }

    switch (props.as) {
        case 'h1':
            return `${colorText} font-bold text-[56px] `;
        case 'h2':
            return `${colorText} font-bold text-[42px] `;
        case 'h3':
            return `${colorText} font-bold text-[30px] `;
        case 'h4':
            return `${colorText} font-bold text-[20px] `;
        case 'body-bold':
            return `${colorText}  font-bold text-[16px] `;
        case 'body':
            return `${colorText}  font-normal text-[16px] `;
        case 'button':
            return `${colorText}  font-normal text-[16px] cursor-pointer`;
        case 'small':
            return `${colorText}  font-bold text-[10px] uppercase`;
        default:
            return `${colorText} font-normal text-[16px] `;
    }
});
</script>