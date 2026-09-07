<template>
    <main class="flex-grow relative ">
        <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 h-full w-full divide-x divide-y">

            <div class="hidden md:flex lg:flex flex-col px-[10px] md:px-[10px] lg:px-[60px] py-[24px] gap-[24px] overflow-y-auto bg-secundaria">
                 <img src="/SOTCC2.png" />
                <Texto as="body">
                    Sistema para encontrar professores para orientação de
                    trabalhos de conclusão de curso (TCC), mostrando a disponibilidade dos professores, trabalhos orientados, formação e contatos.
                </Texto>
                <DefesasPublicas />
            </div>

            <div class="md:hidden order-last px-[10px] py-[24px] border-t border-secundaria-opaco bg-secundaria">
                <DefesasPublicas />
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

                    <EntrarForm v-if="opcao === 'entrar'" />
                    <CadastrarAlunoForm v-if="opcao === 'cadastrarAluno'" @cadastrado="opcao = 'entrar'" />
                    <CadastrarProfessorForm v-if="opcao === 'cadastrarProfessor'" @cadastrado="opcao = 'entrar'" />

                    <section class="flex flex-col gap-[10px]">
                        <hr class=" border-gray-400"/>
                        <button
                            type="button"
                            class="text-[16px] hover:underline mx-auto font-normal text-center  hover:cursor-pointer"
                            @click="opcao = 'entrar'"
                            v-if="opcao !=='entrar'"
                        >
                            Entrar
                        </button>
                        <button
                            type="button"
                            class="text-[16px] hover:underline mx-auto font-normal text-center  hover:cursor-pointer"
                            @click="opcao = 'cadastrarAluno'"
                            v-if="opcao !== 'cadastrarAluno'"
                        >
                            Cadastrar aluno
                         </button>
                         <button
                            type="button"
                            class="text-[16px] hover:underline mx-auto font-normal text-center  hover:cursor-pointer"
                            @click="opcao = 'cadastrarProfessor'"
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
import { ref } from "vue";
import Texto from '@components/Texto.vue';
import EntrarForm from '@components/login/EntrarForm.vue';
import CadastrarAlunoForm from '@components/login/CadastrarAlunoForm.vue';
import CadastrarProfessorForm from '@components/login/CadastrarProfessorForm.vue';
import DefesasPublicas from '@components/login/DefesasPublicas.vue';

defineProps (["usuario"]);

const opcao = ref ('entrar');
</script>
