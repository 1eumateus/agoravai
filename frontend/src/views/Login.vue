<template>
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
                <div class="flex flex-col p-[20px] gap-[12px]"> 
                    <section class="flex flex-col">
                        <div class="flex justify-center items-center block md:hidden lg:hidden">
                            <img src="/SOTCC2.png" class="w-1/2" />
                        </div>
                        <Texto as="h3" color="principal">
                            {{ showRegister ? 'Cadastrar aluno' : 'Entrar' }}
                        </Texto>
                    </section>
                    <section class="grid grid-cols-1 gap-[24px]" v-if="!showRegister">
                        <div class="flex flex-col gap-[4px]">
                            <div>
                                <Texto as="body" for="formemail">
                                    Email
                                </Texto>
                            </div>
                            <input 
                                v-model="form.email" 
                                type="email" 
                                id="formemail" 
                                class="p-[8px] border border-black" 
                                placeholder="ex.: exemplo@exemplo.com"
                            />
                        </div>

                        <div class="flex flex-col gap-[4px]">
                            <div >
                                <Texto as="body" for="formsenha">
                                    Senha
                                </Texto>
                            </div>
                            <input 
                                v-model="form.senha" 
                                type="password" 
                                id="formsenha" 
                                class="p-[8px] border border-black" 
                            />
                        </div>

                    </section>

                    <section class="grid grid-cols-1 lg:grid-cols-2 gap-[10px]" v-else>
                        <div class="flex flex-col gap-[4px]">
                            <div class="flex items-center gap-[10px]">
                                <Texto as="body" for="registrarnome">
                                    Nome
                                </Texto>
                            </div>
                            <input 
                                v-model="registrar.nome" 
                                id="registrarnome" 
                                class="p-[8px] border border-black" 
                                placeholder="ex.: Davi"
                            />
                        </div>
                        <div class="flex flex-col gap-[4px]">
                            <div class="flex items-center gap-[10px]">
                                <Texto as="body" for="registrarsobrenome">
                                    Sobrenome
                                </Texto>
                                <Texto as="body" color="gray" for="registrarsobrenome">
                                    Opcional
                                </Texto>
                            </div>
                            <input 
                                v-model="registrar.sobrenome" 
                                id="registrarsobrenome" 
                                class="p-[8px] border border-black" 
                                placeholder="ex.: Barroso"
                            />
                        </div>
                        <div class="flex flex-col gap-[4px] col-span-1 lg:col-span-2">
                            <div>
                                <Texto as="body" for="registraremail">
                                    Email
                                </Texto>
                            </div>
                            <input 
                                v-model="registrar.email" 
                                type="email" 
                                id="registraremail" 
                                class="p-[8px] border border-black" 
                                placeholder="ex.: exemplo@exemplo.com"
                            />
                        </div>

                        <div class="flex flex-col gap-[4px] col-span-1 lg:col-span-2">
                            <div class="flex items-center gap-[10px]">
                                <Texto as="body" for="registrarsenha">
                                    Senha
                                </Texto>
                            </div>
                            <input 
                                v-model="registrar.senha" 
                                type="password"
                                id="registrarsenha" 
                                class="p-[8px] border border-black" 
                            />
                        </div>

                        <div class="flex flex-col gap-[4px] col-span-1 lg:col-span-2">
                            <div class="flex items-center gap-[10px]">
                                <Texto as="body" for="confirmarSenha">
                                    Confirmar senha
                                </Texto>
                            </div>
                            <input 
                                v-model="confirmarSenha" 
                                type="password"
                                id="confirmarSenha" 
                                class="p-[8px] border border-black" 
                            />
                        </div>
                    </section>

                    <section class="flex flex-col gap-[10px]">
                        <button 
                            type="button" 
                            class="text-[16px] font-normal bg-principal hover:bg-principal-opaco text-white rounded-md py-[10px]" 
                            @click="login" 
                            v-if="!showRegister"
                        >
                            Entrar
                        </button>
                        <button 
                            type="button" 
                            class="text-[16px] font-normal bg-principal hover:bg-principal-opaco text-white rounded-md py-[10px] px-[12px]" 
                            @click="register" 
                            v-if="showRegister"
                        >
                            Cadastre-se
                        </button>
                        <button 
                            type="button" 
                            class="text-[16px] font-normal hover:bg-gray-200 py-[10px] px-[12px]" 
                            @click="alterarForm" >
                            {{ showRegister ? 'Entrar' : ' Cadastrar novo aluno' }}
                        </button>
                    </section>
                </div>
            </div>
        </section>
    </main>
</template>

<script setup>
import api from "@/api.js";
// util
import { popupInfo } from '../stores/util.js';
import { ref, reactive } from "vue";
import Texto from '@components/Texto.vue'
const showRegister = ref(false);

const confirmarSenha = ref('');

const registrar = reactive({
    nome: '',
    tipo: 'aluno',
    sobrenome: '',
    email: '',
    telefone: '',
    senha: '',
    areaAtuacao: null,
})

const form = reactive({
    email: '',
    senha: '',
})

async function login() {
    if (form.email === "") {
        popupInfo().warning('Informe email.');
        return;
    } if (form.senha === "") {
        popupInfo().warning('Informe senha.');
        return;
    }
    if (form.senha.length<6) {
        popupInfo().warning('Senha muito curta.');
        return;
    }
    
    await api.post('/login', form)
        .then((res) => {
            localStorage.setItem('token', res.data.token);
            window.location.reload();
        })
        .catch((e) => {
            popupInfo().error(e.response.data.msg);
        });
};

async function register(){
    if (!registrar.nome) {
        popupInfo().warning('Informe seu nome.');
        return;
    } 
    if (!registrar.email) {
        popupInfo().warning('Informe seu email.');
        return;
    } 
    if (!registrar.senha) {
        popupInfo().warning('Informe sua senha.');
        return;
    }
    if (registrar.senha.length<6) {
        popupInfo().warning('A senha deve ter 6 caracteres no mínimo.');
        return;
    }

    if (registrar.senha !== confirmarSenha.value) {
        popupInfo().warning('Senhas não coincidem');
        return;
    }

    await api.post('/usuario/criar', registrar)
        .then((res) => {
            localStorage.setItem('token', res.data.token);
            window.location.reload();
        })
        .catch((e) => {
            popupInfo().error(e.msg);
        });
}

function alterarForm(){
    showRegister.value = !showRegister.value;
    form.email = '';
    form.senha = '';

    registrar.nome= '';
    registrar.sobrenome= '';
    registrar.email= '';
    registrar.telefone= '';
    registrar.senha= '';
    registrar.areaAtuacao= null;
}

</script>
