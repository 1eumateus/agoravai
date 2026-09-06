<template>
    <section class="grid grid-cols-1 gap-[24px]">
        <Campo
            v-model="form.email"
            label="Email"
            id="formemail"
            type="email"
            :obrigatorio="true"
            :maxLength="50"
            placeholder="ex.: exemplo@exemplo.com"
        />
        <div>
            <Campo
                v-model="form.senha"
                label="Senha"
                id="formsenha"
                type="password"
                :obrigatorio="true"
                :maxLength="90"
                placeholder=""
                v-on:keyup.enter="login()"
            />
            <button
                class="text-[14px] hover:underline font-normal text-left hover:cursor-pointer"
                @click="recuperarSenha()"
            >
                Recuperar a senha
            </button>
        </div>
    </section>

    <button
        type="button"
        class="text-[16px] font-normal bg-principal hover:bg-principal-opaco text-white rounded-md py-[10px] px-[12px]"
        @click="login()"
    >
        Entrar
    </button>
</template>

<script setup>
import api from "@/api.js";
import { popupInfo } from '@/stores/util.js';
import { reactive } from "vue";
import Campo from '@components/Campo.vue';
import { useLoaderState } from "@/stores/isLoading.js";

const isLoading = useLoaderState ();

const form = reactive ({
    email: '',
    senha: '',
});

async function login () {
    if (form.email === "") {
        popupInfo ().warning ('Informe email.');
        return;
    }
    if (form.senha === "") {
        popupInfo ().warning ('Informe senha.');
        return;
    }
    if (form.senha.length<6) {
        popupInfo ().warning ('A senha deve ter 6 caracteres no mínimo.');
        return;
    }
    await api.post('/login', form)
        .then ((res) => {
            localStorage.setItem ('token', res.data.token);
            window.location.reload ();
        })
        .catch ((e) => {
            popupInfo ().error (e.response?.data?.msg);
        });
};

async function recuperarSenha () {
    if (form.email === "") {
        popupInfo ().warning ('Informe email.');
        return;
    }
    isLoading.changeStateTrue ();
    await api.post ('/usuario/recuperar_solicitacao', form)
        .then ((res) => {
            popupInfo ().info ('Um email de recuperação da senha foi enviado, verifique sua caixa de spam.');
        })
        .catch ((e) => {
            popupInfo ().error (e.response?.data?.msg);
        })
        .finally (() => {isLoading.changeStateFalse ()});
}
</script>
