<template>
    <main class="flex-grow relative ">
        <section class="grid grid-cols-1 gap-[24px]">
            <Campo 
                v-model="form.senha" 
                label="Senha" 
                id="senha" 
                type="password"
                :obrigatorio="true"
                :maxLength="50"
                placeholder="Mínimo 6 caracteres..."
            /> 
            <Campo 
                v-model="form.confirmacao"
                label="Confirmação" 
                id="confirmcacao" 
                type="password"
                :obrigatorio="true"
                :maxLength="50"
                placeholder="Mínimo 6 caracteres..."
                v-on:keyup.enter="redefinirSenha()"
            /> 
            <button 
            class="text-[16px] font-normal bg-principal hover:bg-principal-opaco text-white rounded-md py-[10px] px-[12px]" 
                @click="redefinirSenha()"
            >
                Redefinir
            </button>
        </section>
    </main>
</template>

<script setup>

import api from "@/api.js";
import { popupInfo } from '../../stores/util.js';
import { onMounted, reactive } from "vue";
import {useRoute } from "vue-router";
import Campo from '@components/Campo.vue'

const route = useRoute ();

const form = reactive ({
    _id: '',
    senha: '',
    confirmacao: '',
})

async function redefinirSenha () {
    if (form.senha === "") {
        popupInfo ().warning ('Informe a senha.');
        return;
    } 
    if (form.senha.length < 6) {
        popupInfo ().warning ('A senha precisa ter no mínimo 6 caracteres.');
        return;
    }
    if (form.confirmacao === "") {
        popupInfo ().warning ('Confirme a senha.');
        return;
    }
    if (form.senha !== form.confirmacao) {
        popupInfo ().warning ('As senhas não coincidem');
        return;
    }
    await api.post ('/usuario/redefinir', form)
        .then ((res) => {
            localStorage.setItem ('token', res.data.token);
            window.location = '/ui';
            popupInfo ().success ("Senha redefinida com sucesso");
        })
        .catch ((e) => {
            popupInfo ().error (e.response?.data?.msg);
        });
}

onMounted (() => {
    if (route?.params?.id) {
        form._id = route.params.id;
    }
});

</script>