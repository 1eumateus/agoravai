<template>
    <ConfirmarCadastroModal
        :aberto="abrirModal"
        :email="registrar.email"
        @cancelar="abrirModal = false"
        @confirmar="register"
    />

    <section class="grid grid-cols-1 ">
        <div class="grid grid-cols-2 gap-[4px] items-end " >
            <Campo
                v-model="registrar.matricula"
                label="SIAPE"
                id="matricula"
                type="text"
                :obrigatorio="true"
                placeholder="ex.: 1234567"
                :maxLength="10"
                v-on:keyup.enter="buscarDados()"
            />
            <div class="grid grid-cols-2 items-end gap-[4px] ">
                <button
                    type="button"
                    class="text-[16px] w-full font-normal border border-gray-400 hover:bg-gray-200 rounded-md p-[8px] flex gap-1 justify-center "
                    @click="buscarDados()"
                >
                    <div class="hidden md:hidden lg:block">
                        Buscar
                    </div>
                    <PhMagnifyingGlass :size="24"/>
                </button>
                <button
                    type="button"
                    class="text-[16px] w-full font-normal border border-gray-400 hover:bg-gray-200 rounded-md p-[8px] flex gap-1 justify-center"
                    @click="limparDados()"
                >
                    <div class="hidden md:hidden lg:block">
                        Limpar
                    </div>
                    <PhEraser :size="24" />
                </button>
            </div>
        </div>
        <div class="grid grid-cols-4 gap-1 mt-2">
            <button
                :class="`${aba === 0 ? ' bg-principal border-terciaria ' : ' bg-gray-300 border-white ' } p-1 min-w-full border rounded-md`"
                @click="irParaAba(0)">
            </button>
            <button
                :class="`${aba === 1 ? ' bg-principal border-terciaria ' : ' bg-gray-300 border-white ' } p-1 min-w-full border rounded-md`"
                @click="irParaAba(1)">
            </button>
            <button
                :class="`${aba === 2 ? ' bg-principal border-terciaria ' : ' bg-gray-300 border-white ' } p-1 min-w-full border rounded-md `"
                @click="irParaAba(2)">
            </button>
            <button
                :class="`${aba === 3 ? ' bg-principal border-terciaria ' : ' bg-gray-300 border-white ' } p-1 min-w-full border rounded-md `"
                @click="irParaAba(3)">
            </button>
        </div>
        <div class="flex flex-col gap-[10px]" v-if="aba===0">
            <div class="flex flex-col gap-[4px] col-span-2">
                <Texto as="h4" >
                    Informações principais
                </Texto>
            </div>
            <div class="grid grid-cols-1 gap-[8px]">
                <Campo
                    v-model="registrar.nome"
                    label="Nome"
                    id="registrarnome"
                    type="text"
                    :obrigatorio="true"
                    placeholder="ex.: Davi Barroso"
                    :maxLength="20"
                />
            </div>
            <Campo
                v-model="registrar.formacao"
                label="Formação acadêmica / profissional"
                id="formacao"
                type="text"
                :maxLength="500"
                :obrigatorio="true"
                placeholder="ex.: Mestrado em Inteligência artificial"
            />
            <Campo
                v-model="registrar.interesse"
                label="Áreas de interesse de ensino e pesquisa"
                id="interesse"
                type="text"
                :maxLength="400"
                :obrigatorio="true"
                placeholder="ex.: Inteligência artificial, desenvolvimento web e automação"
            />
        </div>
        <div class="flex flex-col gap-[10px]" v-if="aba===1">
            <div class="flex flex-col gap-[4px] col-span-2">
                <Texto as="h4" >
                    Lotação
                </Texto>
            </div>
            <Lotacoes
                :subunidades="lotacoes.subunidades"
                :unidades="lotacoes.unidades"
            />
        </div>
        <div class="flex flex-col gap-[10px]" v-if="aba===2">
            <div class="flex flex-col gap-[4px] col-span-2">
                <Texto as="h4" >
                    Informações adicionais
                </Texto>
            </div>
            <div class="flex flex-col gap-[4px]">
                <div class="flex items-center gap-[4px]">
                    <Texto as="body" for="pesquisar">
                        Disponibilidade
                    </Texto>
                    <Texto as="body-bold" for="pesquisar" color="red">
                        *
                    </Texto>
                </div>
                <select
                    v-model="registrar.disponibilidade"
                    class="p-[8px] h-11 border border-principal focus:outline-principal rounded-md " >
                    <option
                        :value="disponi.value"
                        v-for="disponi in disponibilidades">
                        {{ disponi.nome }}
                    </option>
                </select>
            </div>
            <div class="flex flex-col gap-[4px]">
                <div class="flex items-center gap-[10px]">
                    <Texto as="body" for="formdescricao">
                        Descrição
                    </Texto>
                </div>
                <textarea
                    v-model="registrar.descricao"
                    id="formdescricao"
                    class="p-[8px] border border-principal focus:outline-principal rounded-md"
                    placeholder="Descrição com no máximo 200 caracteres."
                    maxlength="200"
                    rows="4"
                >
                </textarea>
            </div>
        </div>
        <div class="flex flex-col gap-[10px]" v-if="aba===3">
            <div class="flex flex-col gap-[4px] col-span-2">
                <Texto as="h4" >
                    Informações de login
                </Texto>
            </div>
            <Campo
                v-model="registrar.email"
                label="Email"
                id="registraremail"
                type="email"
                :maxLength="50"
                :obrigatorio="true"
                placeholder="ex.: exemplo@exemplo.com"
            />
            <Campo
                v-model="registrar.senha"
                label="Senha"
                id="registrarsenha"
                type="password"
                :maxLength="20"
                :obrigatorio="true"
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
        </div>
    </section>

    <div class="flex justify-between">
        <button
            type="button"
            :class="`border flex items-center bg-white hover:bg-gray-200 border-gray-300 text-[16px] font-normal rounded-md py-[6px] px-[12px] text-black`"
            @click="voltarAbaProfessor()"
        >
            <PhCaretLeft :size="20"  />voltar
        </button>
        <button
            type="button"
            :class="`border flex items-center bg-white hover:bg-gray-200 border-gray-300 text-[16px] font-normal rounded-md py-[6px] px-[12px] text-black`"
            @click="proximaAbaProfessor()"
            v-if="aba < 3 "
        >
            próximo <PhCaretRight :size="20"  />
        </button>
        <button
            type="button"
            :class="`border transition-all bg-principal text-white hover:bg-principal-opaco text-[16px] font-normal rounded-md py-[6px] px-[12px] text-black`"
                @click="modalConfirmar"
            v-if="aba === 3"
        >
            Cadastrar
        </button>
    </div>
</template>

<script setup>
import { PhCaretLeft, PhCaretRight, PhEraser, PhMagnifyingGlass } from '@phosphor-icons/vue';
import api from "@/api.js";
import { popupInfo, isValid } from '@/stores/util.js';
import { ref, reactive } from "vue";
import Texto from '@components/Texto.vue';
import Campo from '@components/Campo.vue';
import Lotacoes from '@/views/Perfil/Lotacoes.vue';
import ConfirmarCadastroModal from './ConfirmarCadastroModal.vue';
import { useLoaderState } from "@/stores/isLoading.js";

const isLoading = useLoaderState ();
const emit = defineEmits (['cadastrado']);

const confirmarSenha = ref ('');
const abrirModal = ref (false);
const aba = ref (0);

const disponibilidades = [
    { value: "", nome: "Selecione disponibilidade" },
    { value: "indisponível", nome: "Indisponível" },
    { value: "matutino", nome: "Matutino" },
    { value: "vespertino", nome: "Vespertino" },
    { value: "noturno", nome: "Noturno" },
    { value: "integral", nome: "Integral" },
    { value: "flexivel", nome: "Flexível" },
];

const registrar = reactive ({
    nome: '',
    tipo: 'professor',
    email: '',
    senha: '',
    formacao: '',
    telefone: '',
    descricao: '',
    interesse: '',
    instituicao: '',
    disponibilidade: '',
    lattes: '',
    matricula: '',
    subunidades: [],
    unidades: [],
});

const lotacoes = reactive ({
    subunidades: [],
    unidades: [],
});

function irParaAba (numeroAba) {
    aba.value = numeroAba
}

function proximaAbaProfessor () {
    if (aba.value < 3) {
        aba.value++
    }
}

function voltarAbaProfessor () {
    if (aba.value > 0) {
        aba.value--
    }
}

function modalConfirmar () {
    if (!registrar.nome) {
        popupInfo ().warning ('Informe seu nome.');
        aba.value = 0;
        return;
    }
    if (!registrar.matricula) {
        popupInfo ().warning ('Informe sua matrícula.');
        aba.value = 0;
        return;
    }
    if (!registrar.formacao) {
        popupInfo ().warning ('Informe sua formação.');
        aba.value = 0;
        return;
    }
    if (!registrar.interesse) {
        popupInfo ().warning ('Informe áreas de interesse.');
        aba.value = 0;
        return;
    }
    if (!registrar.disponibilidade) {
        popupInfo ().warning ('Informe sua disponbilidade.');
        aba.value = 1;
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

async function buscarDados () {
    if (!registrar.matricula || registrar.matricula.length < 6) {
        popupInfo ().warning ('Código do SIAPE inválido.');
        return;
    }
    isLoading.changeStateTrue ();
    await api.get (`/usuario/siape/${registrar.matricula}`)
        .then ((res) => {
            if (res?.data?.dados){
                Object.assign (registrar, res.data.dados)
                popupInfo ().success (res.data?.msg);
            } else {
                popupInfo ().warning (res.data?.msg);
            }
        })
        .catch ((e) => {
            popupInfo ().error (e.response?.data?.msg);
        }).finally (() => isLoading.changeStateFalse ())
}

function limparDados () {
    for (let key in registrar) {
        if (key !== 'matricula') registrar [key] = '';
    }
    registrar.tipo = 'professor';
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
