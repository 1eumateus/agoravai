<template>
   
    <div class="fixed inset-0 z-40 flex items-center justify-center bg-gray-600 bg-opacity-50" v-if="abrirModal">
            <div class="w-full md:w-[480px] lg:w-[480px] p-[24px] max-h-[220px] overflow-y-auto bg-white rounded-md flex flex-col gap-[24px]">
                <section class="grid grid-cols-1 gap-[4px]">
                    <div class="flex items-center justify-between border-b border-gray-300">
                        <Texto as="h4">
                            Cadastrar
                        </Texto>
                        <button 
                            type="button" 
                            @click="abrirModal =false " 
                            class="cursor-pointer">
                            <PhX :size="18" class="fill-gray-700 hover:fill-black" />
                        </button>
                    </div>
                    <Texto as="body">
                        Um email de confirmação será enviado para
                    </Texto>
                    <Texto as="body" >
                        {{ registrar.email }}
                    </Texto>
                </section>
                <section class="flex justify-between gap-[24px] border-t border-gray-300 pt-[10px]">
                    <button 
                        type="button" 
                        @click="abrirModal =false " 
                        class=" font-bold text-[14px] border hover:bg-gray-200 py-[8px] px-[12px] rounded-md cursor-pointer">
                        Cancelar
                    </button>
                    <button 
                        type="button" 
                        :onClick="register" 
                        class=" font-bold text-[14px] bg-principal text-white hover:bg-principal-opaco py-[8px] px-[12px] rounded-md cursor-pointer">
                        Confirmar
                    </button>
                </section>
            </div>
    </div>

    <main class="flex-grow relative ">
        <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 h-full w-full divide-x divide-y">
            
            <div class="hidden md:flex lg:flex flex-col justify-center px-[10px] md:px-[10px] lg:px-[60px] bg-secundaria">
                 <img src="/SOTCC2.png" />
                <Texto as="body">
                    Sistema para encontrar professores para orientação de 
                    trabalhos de conclusão de curso (TCC), mostrando a disponibilidade dos professores, trabalhos orientados, formação e contatos.
                </Texto>
            </div>

            <div class="flex flex-col justify-center gap-[24px] px-[10px] md:px-[10px] lg:px-[90px]">   
                <div class="flex flex-col p-[10px] gap-[12px]"> 
                    <section class="flex flex-col ">
                        <Texto as="h3" color="principal">
                            {{ opcao === 'entrar' ? 'Entrar': '' }}
                            {{ opcao === 'cadastrarAluno' ? 'Cadastrar aluno': '' }}
                            {{ opcao === 'cadastrarProfessor' ? 'Cadastrar professor': '' }}
                        </Texto>
                    </section>
                    <section class="grid grid-cols-1 gap-[24px]" v-if="opcao === 'entrar'">
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

                    <section class="grid grid-cols-2 gap-[10px]" v-if="opcao === 'cadastrarAluno'">
                        <Campo 
                            v-model="registrar.nome" 
                            label="Nome" 
                            id="registrarnome" 
                            type="text"
                            :obrigatorio="true"
                            :maxLength="50"
                            placeholder="ex.: Davi"
                        /> 
                        <Campo 
                            v-model="registrar.sobrenome" 
                            label="Sobrenome" 
                            id="registrarsobrenome" 
                            type="text"
                            :obrigatorio="false"
                            :maxLength="50"
                            placeholder="ex.: Barroso"
                        /> 
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

                    <section class="grid grid-cols-1 " v-if="opcao === 'cadastrarProfessor'">
                        <div class="grid grid-cols-2 gap-[4px] items-end " >
                            <Campo 
                                v-model="registrar.siape" 
                                label="Buscar os dados do SIAPE" 
                                id="siape" 
                                type="text"
                                :obrigatorio="false"
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
                        <div class="grid grid-cols-3 gap-1 mt-2">
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
                        </div>
                        <div class="flex flex-col gap-[10px]" v-if="aba===0">
                            <div class="flex flex-col gap-[4px] col-span-2">
                                <Texto as="h4" >
                                    Informações principais
                                </Texto>
                            </div>
                            <div class="grid grid-cols-2 gap-[8px]">
                                <Campo 
                                    v-model="registrar.nome" 
                                    label="Nome" 
                                    id="registrarnome" 
                                    type="text"
                                    :obrigatorio="true"
                                    placeholder="ex.: Davi"
                                    :maxLength="20" 
                                /> 
                                <Campo 
                                    v-model="registrar.sobrenome" 
                                    label="Sobrenome" 
                                    id="registrarsobrenome" 
                                    type="text"
                                    :obrigatorio="false"
                                    placeholder="ex.: Barroso" 
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

                            <div class="flex flex-col gap-[4px] ">
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

                        <div class="flex flex-col gap-[10px]" v-if="aba===2">
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

                    <section class="flex flex-col gap-[10px]">
                        <div class="flex justify-between">
                            <button 
                                type="button" 
                                :class="`border flex items-center bg-white hover:bg-gray-200 border-gray-300 text-[16px] font-normal rounded-md py-[6px] px-[12px] text-black`" 
                                @click="voltarAbaProfessor()"
                                v-if="opcao ==='cadastrarProfessor'"
                            >
                                <PhCaretLeft :size="20"  />voltar
                            </button>
                            <button 
                                type="button" 
                                :class="`border flex items-center bg-white hover:bg-gray-200 border-gray-300 text-[16px] font-normal rounded-md py-[6px] px-[12px] text-black`" 
                                @click="proximaAbaProfessor()"
                                v-if="opcao ==='cadastrarProfessor' && aba < 2 "
                            >
                                próximo <PhCaretRight :size="20"  />
                            </button>
                            <button 
                                type="button" 
                                :class="`border transition-all bg-principal text-white hover:bg-principal-opaco text-[16px] font-normal rounded-md py-[6px] px-[12px] text-black`" 
                                    @click="modalConfirmar"
                                v-if="opcao ==='cadastrarProfessor' && aba === 2"
                            >
                                Cadastrar
                            </button>
                        </div>
                        <button 
                            type="button" 
                            class="text-[16px] font-normal bg-principal hover:bg-principal-opaco text-white rounded-md py-[10px] px-[12px]" 
                            @click="login()"
                            v-if="opcao !== 'cadastrarAluno' && opcao !== 'cadastrarProfessor'"
                        >
                            Entrar
                        </button>
                        <button 
                            type="button" 
                            class="text-[16px] font-normal bg-principal hover:bg-principal-opaco text-white rounded-md py-[10px] px-[12px]" 
                            @click="modalConfirmar"
                            v-if="opcao !=='entrar' && opcao !=='cadastrarProfessor'"
                        >
                            Cadastrar
                        </button>
                        <hr class=" border-gray-400"/>
                        <button 
                            type="button" 
                            class="text-[16px] hover:underline mx-auto font-normal text-center  hover:cursor-pointer" 
                            @click="alterarForm('entrar')"
                            v-if="opcao !=='entrar'"
                        >
                            Entrar
                        </button>
                        <button 
                            type="button" 
                            class="text-[16px] hover:underline mx-auto font-normal text-center  hover:cursor-pointer" 
                            @click="alterarForm('cadastrarAluno')"
                            v-if="opcao !== 'cadastrarAluno'"
                        >
                            Cadastrar aluno
                         </button>
                         <button 
                            type="button" 
                            class="text-[16px] hover:underline mx-auto font-normal text-center  hover:cursor-pointer" 
                            @click="alterarForm('cadastrarProfessor')"
                            v-if="opcao !== 'cadastrarProfessor'"
                        >
                            Cadastrar professor
                        </button>
                    </section>
                </div>
            </div>
        </section>
    </main>
</template>

<script setup>
import { PhCaretLeft, PhCaretRight, PhX, PhEraser, PhMagnifyingGlass  } from '@phosphor-icons/vue';
import api from "@/api.js";
// util
import { popupInfo, isValid } from '../stores/util.js';
import { ref, reactive } from "vue";
import Texto from '@components/Texto.vue'
import Campo from '@components/Campo.vue'
import { useLoaderState } from "../stores/isLoading";
const isLoading = useLoaderState();

const opcao = ref('entrar');
defineProps(["usuario"]);
const confirmarSenha = ref('');
const aba = ref(0);
const abrirModal = ref(false)

const emailEnviado = reactive({
    situacao: false,
    email: '',
})

const disponibilidades = [
    { value: "", nome: "Selecione disponibilidade" },
    { value: "indisponível", nome: "Indisponível" },
    { value: "matutino", nome: "Matutino" },
    { value: "vespertino", nome: "Vespertino" },
    { value: "noturno", nome: "Noturno" },
    { value: "integral", nome: "Integral" },
    { value: "flexivel", nome: "Flexível" },
];

const registrar = reactive({
    nome: '',
    tipo: 'aluno',
    sobrenome: '',
    email: '',
    senha: '',
    formacao: '',
    telefone: '',
    descricao: '',
    interesse: '',
    instituicao: '',
    disponibilidade: '',
    lattes: '',
    siape: '',
})

const form = reactive({
    email: '',
    senha: '',
})

function irParaAba(numeroAba){
    aba.value = numeroAba
}

function proximaAbaProfessor(){
    if(aba.value < 2){
        aba.value++
    }
}

function voltarAbaProfessor(){
    if(aba.value > 0){
        aba.value--
    }
}

function modalConfirmar(){
    if(opcao.value === 'cadastrarAluno'){
        registrar.tipo = 'aluno';
    }
    if(opcao.value === 'cadastrarProfessor'){
        registrar.tipo = 'professor';
    }

    if (!registrar.nome) {
        popupInfo().warning('Informe seu nome.');
        aba.value = 0;
        abrirModal.value = false;
        return;
    } 

    if(registrar.tipo === 'professor'){
        if (!registrar.formacao) {
            popupInfo().warning('Informe sua formação.');
            aba.value = 0;
            abrirModal.value = false;
            return;
        }
        if (!registrar.interesse) {
            popupInfo().warning('Informe áreas de interesse.');
            aba.value = 0;
            abrirModal.value = false;
            return;
        }
        if (!registrar.disponibilidade) {
            popupInfo().warning('Informe sua disponbilidade.');
            aba.value = 1;
            abrirModal.value = false;
            return;
        }
    }

    if (!isValid.email(registrar.email)) {
        popupInfo().warning('Informe email válido.');
        abrirModal.value = false;
        return;
    } 
    if (!registrar.senha) {
        popupInfo().warning('Informe sua senha.');
        abrirModal.value = false;
        return;
    }
    if (registrar.senha.length<6) {
        popupInfo().warning('A senha deve ter 6 caracteres no mínimo.');
        abrirModal.value = false;
        return;
    }

    if (registrar.senha !== confirmarSenha.value) {
        popupInfo().warning('As senhas não coincidem');
        abrirModal.value = false;
        return;
    }

    abrirModal.value = true;
}

async function buscarDados(){
    if(!registrar.siape || registrar.siape.length<6) {
        popupInfo().warning('Código do SIAPE inválido.');
        return;
    }
    isLoading.changeStateTrue()
    await api.get(`/usuario/siape/${registrar.siape}`)
        .then((res) => {
            if(res?.data?.dados){
                Object.assign(registrar, res.data.dados)
                popupInfo().success(res.data?.msg);
            }else{
                popupInfo().warning(res.data?.msg);
            }
        })
        .catch((e) => {
            popupInfo().error(e.response?.data?.msg);
        }).finally(()=> isLoading.changeStateFalse())
}

async function login() {
    if (form.email === "") {
        popupInfo().warning('Informe email.');
        return;
    } if (form.senha === "") {
        popupInfo().warning('Informe senha.');
        return;
    }
    if (form.senha.length<6) {
        popupInfo().warning('A senha deve ter 6 caracteres no mínimo.');
        return;
    }
    await api.post('/login', form)
        .then((res) => {
            localStorage.setItem('token', res.data.token);
            window.location.reload();
        })
        .catch((e) => {
            popupInfo().error(e.response?.data?.msg);
        });
};

async function register(){
    abrirModal.value = false;
    if(emailEnviado.situacao && registrar.email === emailEnviado.email){
        popupInfo().info('Email de confirmação enviado, verifique sua caixa de spam.');
        return;
    }
    isLoading.changeStateTrue()
    await api.post('/usuario/criar', registrar)
    .then((res) => {
        popupInfo().info(res?.data?.msg);
        emailEnviado.situacao = true;
        emailEnviado.email = registrar.email
    })
    .catch((e) => {
        popupInfo().error(e.response?.data?.msg);
    }).finally(()=> isLoading.changeStateFalse())

}

function alterarForm(page){
    opcao.value = page
    limparDados()
    
}
function limparDados(){
    form.email = '';
    form.senha = '';
    confirmarSenha.value = '';

    for (let key in registrar) {
        if(key !== 'siape') registrar[key] = '';
    }
    
    registrar.disponibilidade= '';

    if(opcao.value === 'cadastrarAluno'){
        registrar.tipo = 'aluno';
    }
    if(opcao.value === 'cadastrarProfessor'){
        registrar.tipo = 'professor';
    }
}

async function recuperarSenha() {
    if (form.email === "") {
        popupInfo().warning('Informe email.');
        return;
    }
    isLoading.changeStateTrue();
    await api.post('/usuario/recuperar_solicitacao', form)
        .then((res) => {
            popupInfo().info('Um email de recuperação da senha foi enviado, verifique sua caixa de spam.');
        })
        .catch((e) => {
            popupInfo().error(e.response?.data?.msg);
        })
        .finally (() => {isLoading.changeStateFalse()});
}

</script>