<template>
    <main class="flex-grow relative ">
        <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 h-full w-full gap-[2px] md:gap-[40px] lg:gap-[40px] divide-x divide-y">
            
            <div class="flex flex-col justify-center gap-[24px] px-[10px] md:px-[90px] lg:px-[90px]">
                <label class="text-[56px] font-bold">
                    Bem vindo
                </label>
                <label class="text-[16px] ">
                    Sistema para encontrar professores disponíveis para orientação de 
                    TCC e trabalhos acadêmicos. Além disso, você pode organizar seus 
                    próximos passos para a conclusão do trabalho e armazenar versões dos seus documentos.
                </label>
            </div>

            <div class="flex flex-col justify-center gap-[24px] px-[10px] md:px-[90px] lg:px-[90px]">
                
                <div class="flex flex-col border border-gray-200 rounded-md p-[20px] gap-[24px]"> 
                    <h1 class="text-[30px] font-bold">
                        {{ showRegister ? 'Cadastre-se' : 'Entrar' }}
                    </h1>
                    <section class="grid grid-cols-1 gap-[24px]" v-if="!showRegister">
                        <div class="flex flex-col gap-[4px]">
                            <div >
                                <label class="text-[18px] " for="formemail">Email</label>
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
                                <label class="text-[18px] " for="formsenha">Senha</label>
                            </div>
                            <input 
                                v-model="form.senha" 
                                type="password" 
                                id="formsenha" 
                                class="p-[8px] border border-black" 
                            />
                        </div>

                    </section>

                    <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-[10px]" v-else>
                        
                        <div class="flex flex-col gap-[4px] col-span-1 md:col-span-2 lg:col-span-2">
                            <div class="flex items-center gap-[10px]">
                                <label class="text-[18px] " for="registrartipo">Eu sou</label>
                            </div>
                            <select 
                                v-model="registrar.tipo" 
                                id="registrartipo" 
                                class="p-[8px] border border-black" 
                            >
                                <option :value="'aluno'" selected>Aluno</option>
                                <option :value="'professor'" >Professor</option>
                            </select>
                        </div>

                        <div class="flex flex-col gap-[4px]">
                            <div class="flex items-center gap-[10px]">
                                <label class="text-[18px] " for="registrarnome">Nome</label>
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
                                <label class="text-[18px] " for="registrarsobrenome">Sobrenome</label>
                                <label class="text-gray-600" for="registrarsobrenome">Opcional</label>
                            </div>
                            <input 
                                v-model="registrar.sobrenome" 
                                id="registrarsobrenome" 
                                class="p-[8px] border border-black" 
                                placeholder="ex.: Barroso"
                            />
                        </div>

                        <div class="flex flex-col gap-[4px] col-span-1 md:col-span-2 lg:col-span-2">
                            <div>
                                <label class="text-[18px]" for="registraremail">Email</label>
                            </div>
                            <input 
                                v-model="registrar.email" 
                                type="email" 
                                id="registraremail" 
                                class="p-[8px] border border-black" 
                                placeholder="ex.: exemplo@exemplo.com"
                            />
                        </div>

                        <!-- <div class="flex flex-col gap-[4px]">
                            <div class="flex items-center gap-[10px]">
                                <label class="text-[18px]" for="registrartelefone">Telefone </label>
                                <label class="text-gray-600" for="registrartelefone">Opcional</label>
                            </div>
                            <input 
                                v-model="registrar.telefone" 
                                id="registrartelefone" 
                                class="p-[8px] border border-black" 
                                placeholder="ex.: (00) 90000-0000"
                            />
                        </div> -->

                        <div class="flex flex-col gap-[4px] col-span-1 md:col-span-2 lg:col-span-2">
                            <div class="flex items-center gap-[10px]">
                                <label class="text-[18px]" for="registrarsenha">Senha </label>
                            </div>
                            <input 
                                v-model="registrar.senha" 
                                type="password"
                                id="registrarsenha" 
                                class="p-[8px] border border-black" 
                            />
                        </div>

                        <div class="flex flex-col gap-[4px] col-span-1 md:col-span-2 lg:col-span-2">
                            <div class="flex items-center gap-[10px]">
                                <label class="text-[18px]" for="confirmarSenha">Confirmar senha </label>
                            </div>
                            <input 
                                v-model="confirmarSenha" 
                                type="password"
                                id="confirmarSenha" 
                                class="p-[8px] border border-black" 
                            />
                        </div>
                        <!-- <div class="flex flex-col gap-[4px]">
                            <div class="flex items-center gap-[10px]">
                                <label class="text-[18px]" for="registrarlinkedin">LinkedIn </label>
                                <label class="text-gray-600" for="registrarlinkedin">Opcional</label>
                            </div>
                            <input 
                                v-model="registrar.linkedin" 
                                id="registrarlinkedin" 
                                class="p-[8px] border border-black" 
                                placeholder="ex.: https://www.linkedin.com/"
                            />
                        </div>

                        <div class="flex flex-col gap-[4px]">
                            <div class="flex items-center gap-[10px]">
                                <label class="text-[18px]" for="registrargithub">GitHub </label>
                                <label class="text-gray-600" for="registrargithub">Opcional</label>
                            </div>
                            <input 
                                v-model="registrar.github" 
                                id="registrargithub" 
                                class="p-[8px] border border-black" 
                                placeholder="ex.: https://github.com/"
                            />
                        </div>
                       
                        <div class="flex flex-col gap-[4px] col-span-1 md:col-span-2 lg:col-span-2">
                            <div class="flex items-center gap-[10px]">
                                <label class="text-[18px]" for="registrardisponibilidade">Disponibilidade </label>
                            </div>
                            <div class="flex items-center flex-wrap gap-[14px]">
                                
                                <label class="flex items-center p-[10px] gap-[10px] border border-black rounded-md">
                                    <input 
                                        type="radio"
                                        v-model="registrar.disponibilidade" 
                                        value="matutino"
                                    />Matutino
                                </label>

                                <label class="flex items-center p-[10px] gap-[10px] border border-black rounded-md">
                                    <input 
                                        type="radio"
                                        v-model="registrar.disponibilidade" 
                                        value="vespertino"
                                    />
                                    Vespertino
                                    </label>

                                <label class="flex items-center p-[10px] gap-[10px] border border-black rounded-md">
                                    <input 
                                        type="radio"
                                        v-model="registrar.disponibilidade" 
                                        value="noturno"
                                    />
                                    Noturno
                                </label>

                                <label class="flex items-center p-[10px] gap-[10px] border border-black rounded-md">
                                    <input 
                                        type="radio"
                                        v-model="registrar.disponibilidade" 
                                        value="integral"
                                    />
                                    Integral
                                </label>

                                <label class="flex items-center p-[10px] gap-[10px] border border-black rounded-md">
                                    <input 
                                        type="radio"
                                        v-model="registrar.disponibilidade" 
                                        value="flexivel"
                                    />
                                    Flexível
                                </label>

                            </div>
                        </div>

                        <div class="flex flex-col gap-[4px] col-span-1 md:col-span-2 lg:col-span-2">
                            <div class="flex items-center gap-[10px]">
                                <label class="text-[18px]" for="registrardescricao">Descrição </label>
                                <label class="text-gray-600" for="registrardescricao">Opcional</label>
                            </div>
                            <textarea 
                                v-model="registrar.descricao" 
                                id="registrardescricao" 
                                class="p-[8px] border border-black" 
                                placeholder="Descrição com no máximo 100 caracteres."
                                maxlength="100"
                            >
                            </textarea>
                        </div> -->

                    </section>

                    <section class="flex flex-col gap-[10px]">
                        <button type="button" class="text-[16px] font-normal bg-gray-200 rounded-md py-[10px]" @click="login" v-if="!showRegister">
                            Entrar
                        </button>
                        <button type="button" class="text-[16px] font-normal bg-gray-200 rounded-md py-[10px]" @click="register" v-if="showRegister">
                            Cadastre-se
                        </button>
                        <button type="button" class="text-[16px] font-normal" @click="alterarForm" >
                            {{ showRegister ? 'Entrar' : ' Criar nova conta' }}
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
    console.log(form)
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
    registrar.tipo= 'aluno';
    registrar.senha= '';
    registrar.areaAtuacao= null;
}

</script>
