<template>
    <ConfirmarCadastroModal
        :aberto="abrirModal"
        :email="registrar.email"
        @cancelar="abrirModal = false"
        @confirmar="register"
    />

    <section class="grid grid-cols-2 gap-[10px]">
        <Campo
            v-model="registrar.nome"
            label="Nome"
            id="registrarnome"
            type="text"
            :obrigatorio="true"
            :maxLength="50"
            placeholder="ex.: Davi Costa Barroso"
        />
        <Campo
            v-model="registrar.matricula"
            label="Matricula"
            id="registrarsobrenome"
            type="text"
            :obrigatorio="false"
            :maxLength="50"
            placeholder="ex.: 202033840046"
        />
        <div class="flex flex-col gap-[4px] col-span-2">
            <Lotacoes
                :subunidades="lotacoes.subunidades"
                :unidades="lotacoes.unidades"
                :multiplasLotacoes="false"
            />
        </div>
        <div class="col-span-2">
            <Campo
                v-model="registrar.email"
                label="Email"
                id="registraremail"
                type="email"
                :obrigatorio="true"
                :maxLength="50"
                placeholder="ex.: exemplo@exemplo.com"
            />
        </div>
        <Campo
            v-model="registrar.senha"
            label="Senha"
            id="registrarsenha"
            type="password"
            :obrigatorio="true"
            :maxLength="20"
            placeholder=""
        />
        <Campo
            v-model="confirmarSenha"
            label="Confirmar senha"
            id="confirmarSenha"
            type="password"
            :maxLength="20"
            :obrigatorio="true"
            placeholder=""
            v-on:keyup.enter="modalConfirmar()"
        />
    </section>

    <button
        type="button"
        class="text-[16px] font-normal bg-principal hover:bg-principal-opaco text-white rounded-md py-[10px] px-[12px]"
        @click="modalConfirmar"
    >
        Cadastrar
    </button>
</template>

<script setup>
import api from "@/api.js";
import { popupInfo, isValid } from '@/stores/util.js';
import { ref, reactive } from "vue";
import Campo from '@components/Campo.vue';
import Lotacoes from '@/views/Perfil/Lotacoes.vue';
import ConfirmarCadastroModal from './ConfirmarCadastroModal.vue';
import { useLoaderState } from "@/stores/isLoading.js";

const isLoading = useLoaderState ();
const emit = defineEmits (['cadastrado']);

const confirmarSenha = ref ('');
const abrirModal = ref (false);

const registrar = reactive ({
    nome: '',
    tipo: 'aluno',
    email: '',
    senha: '',
    matricula: '',
    subunidades: [],
    unidades: [],
});

const lotacoes = reactive ({
    subunidades: [],
    unidades: [],
});

function modalConfirmar () {
    if (!registrar.nome) {
        popupInfo ().warning ('Informe seu nome.');
        return;
    }
    if (!registrar.matricula) {
        popupInfo ().warning ('Informe sua matrícula.');
        return;
    }
    if (!isValid.email (registrar.email)) {
        popupInfo ().warning ('Informe email válido.');
        return;
    }
    if (!registrar.senha) {
        popupInfo ().warning ('Informe sua senha.');
        return;
    }
    if (registrar.senha.length<6) {
        popupInfo ().warning ('A senha deve ter 6 caracteres no mínimo.');
        return;
    }
    if (registrar.senha !== confirmarSenha.value) {
        popupInfo ().warning ('As senhas não coincidem');
        return;
    }
    abrirModal.value = true;
}

async function register () {
    abrirModal.value = false;
    isLoading.changeStateTrue ();
    registrar.subunidades = lotacoes.subunidades;
    registrar.unidades = lotacoes.unidades;
    await api.post ('/usuario/criar', registrar)
        .then ((res) => {
            popupInfo ().info (res?.data?.msg);
            emit ('cadastrado');
        })
        .catch ((e) => {
            popupInfo ().error (e.response?.data?.msg);
        })
        .finally (()=> isLoading.changeStateFalse ());
}
</script>
