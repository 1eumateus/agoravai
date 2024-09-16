<template>
    <div class="fixed inset-0 z-40 flex items-center justify-center bg-gray-600 bg-opacity-50">
            <main class="w-full md:w-[720px] lg:w-[720px] p-[24px] h-screen md:max-h-[720px] lg:max-h-[720px] overflow-y-auto bg-white rounded-md flex flex-col gap-[24px]">
                <section class="grid grid-cols-1 gap-[14px]">
                    <div class="flex items-center justify-between border-b border-gray-300">
                        <Texto as="h3">
                            Editar informações
                        </Texto>
                        <button 
                        type="button" 
                        :onClick="()=> emits('modal:open', false)" 
                        class="cursor-pointer"
                    >
                        <PhX :size="18" class="fill-gray-700 hover:fill-black" />
                    </button>
                       
                    </div>
                    <Texto as="h4">
                        Informações principais
                    </Texto>
                    <section class="grid grid-cols-2 gap-[10px]">
                        <div class="flex flex-col gap-[4px]">
                            <div class="flex items-center gap-[10px]">
                                <Texto as="body" for="nome">
                                    Nome
                                </Texto>
                            </div>
                            <input 
                                v-model="form.nome" 
                                id="nome" 
                                class="p-[8px] border border-black" 
                                placeholder="ex.: Davi"
                                maxlength="12"
                            />
                        </div>
                        <div class="flex flex-col gap-[4px]">
                            <div class="flex items-center gap-[10px]">
                                <Texto as="body" for="sobrenome">
                                    Sobrenome
                                </Texto>
                                <Texto as="body" color='gray' for="sobrenome">
                                    Opcional
                                </Texto>
                            </div>
                            <input 
                                v-model="form.sobrenome" 
                                id="sobrenome" 
                                class="p-[8px] border border-black" 
                                placeholder="ex.: Barroso"
                                 maxlength="12"
                            />
                        </div>

                    </section>

                    <div class="flex flex-col gap-[4px]" v-if="form.tipo === 'professor'">
                        <div>
                            <Texto as="body" for="formacao">
                                Formação acadêmica/profissional (Onde obteve os títulos, atuação profissional, etc.)
                            </Texto>
                        </div>
                        <input 
                            v-model="form.formacao" 
                            type="text" 
                            id="formacao" 
                            class="p-[8px] border border-black" 
                            placeholder="ex.: Inteligência artificial, desenvolvimento web e automação"
                            maxlength="65"
                        />
                    </div>

                    <div class="flex flex-col gap-[4px]" v-if="form.tipo === 'professor'">
                        <div>
                            <Texto as="body" for="interesse">
                                Áreas de Interesse (áreas de interesse de ensino e pesquisa)
                            </Texto>
                        </div>
                        <input 
                            v-model="form.interesse" 
                            type="text" 
                            id="interesse" 
                            class="p-[8px] border border-black" 
                            placeholder="ex.: Inteligência artificial, desenvolvimento web e automação"
                            maxlength="65"
                        />
                    </div>

                    <div class="flex flex-col gap-[4px]">
                        <div>
                            <Texto as="body" for="pesquisar">
                                Disponibilidade
                            </Texto>
                        </div>
                        <select 
                            v-model="form.disponibilidade" 
                            class="p-[8px] border border-black " >
                            <option 
                                :value="disponi.value" 
                                v-for="disponi in disponibilidades">
                                {{ disponi.nome }}
                            </option>
                        </select>
                    </div>

                    <div class="flex flex-col gap-[4px]">
                        <div>
                            <Texto as="body" for="instituicao">
                                Instituição de ensino
                            </Texto>
                        </div>
                        <input 
                            v-model="form.instituicao" 
                            type="text" 
                            id="instituicao" 
                            class="p-[8px] border border-black" 
                            placeholder="ex.: Universidade Federal do Pará"
                        />
                    </div>

                    <div class="flex flex-col gap-[4px] ">
                        <div class="flex items-center gap-[10px]">
                            <Texto as="body" for="formdescricao">
                                Descrição
                            </Texto>
                            <Texto as="body" color="gray" for="formdescricao">
                                Opcional
                            </Texto>
                        </div>
                        <textarea 
                            v-model="form.descricao" 
                            id="formdescricao" 
                            class="p-[8px] border border-black" 
                            placeholder="Descrição com no máximo 100 caracteres."
                            maxlength="100"
                        >
                        </textarea>
                    </div>  

                    <Texto as="h4">
                        Informações de contato
                    </Texto>

                    <div class="flex flex-col gap-[4px]">
                        <div>
                            <Texto as="body" for="email">
                                Email
                            </Texto>
                        </div>
                        <input 
                            v-model="form.email" 
                            type="email" 
                            id="email" 
                            class="p-[8px] border border-black" 
                            placeholder="ex.: exemplo@exemplo.com"
                        />
                    </div>

                    <div class="flex flex-col gap-[4px]">
                        <div class="flex items-center gap-[10px]">
                            <Texto as="body" for="celular">
                                Celular
                            </Texto>
                            <Texto as="body" color="gray" for="celular">
                                Opcional
                            </Texto>
                        </div>
                        <input 
                            v-model="form.celular" 
                            type="text" 
                            id="celular" 
                            class="p-[8px] border border-black" 
                            placeholder="ex.: (00) 90000-0000"
                            :maxLength="15"
                            @input="form.celular = formatMask.tel(form.celular)"
                        />
                    </div>

                    <div class="flex flex-col gap-[4px]">
                        <div class="flex items-center gap-[10px]">
                            <Texto as="body" for="linkedin">
                                Currículo Lattes
                            </Texto>
                            <Texto as="body" color='gray' for="linkedin">
                                Opcional
                            </Texto>
                        </div>
                        <input 
                            v-model="form.lattes" 
                            id="lattes" 
                            class="p-[8px] border border-black" 
                            placeholder="ex.: http://lattes.cnpq.br/"
                            maxlength="90"
                        />
                    </div>

                    <div class="flex flex-col gap-[4px]">
                        <div class="flex items-center gap-[10px]">
                            <Texto as="body" for="linkedin">
                                LinkedIn
                            </Texto>
                            <Texto as="body" color='gray' for="linkedin">
                                Opcional
                            </Texto>
                        </div>
                        <input 
                            v-model="form.linkedin" 
                            id="linkedin" 
                            class="p-[8px] border border-black" 
                            placeholder="ex.: https://www.linkedin.com/"
                            maxlength="90"
                        />
                    </div>

                    <div class="flex flex-col gap-[4px]">
                        <div class="flex items-center gap-[10px]">
                            <Texto as="body" for="github">
                                GitHub
                            </Texto>
                            <Texto as="body" color='gray' for="github">
                                Opcional
                            </Texto>
                        </div>
                        <input 
                            v-model="form.github" 
                            id="github" 
                            class="p-[8px] border border-black" 
                            placeholder="ex.: https://github.com/"
                            maxlength="90"
                        />
                    </div> 

                </section>
                <section class="flex justify-between gap-[24px] border-t border-gray-300 py-[10px]">
                    <button 
                        type="button" 
                        :onClick="()=> emits('modal:open', false)" 
                        class=" font-bold text-[14px] bg-red-300 hover:bg-red-400 py-[8px] px-[12px] rounded-md cursor-pointer">
                        Cancelar
                    </button>
                    <button 
                        type="button" 
                        :onClick="salvar" 
                        class=" font-bold text-[14px] bg-principal text-white hover:bg-principal-opaco py-[8px] px-[12px] rounded-md cursor-pointer">
                        Salvar
                    </button>
                </section>

            </main>
    </div>
</template>

<script setup>
import Texto from '@components/Texto.vue'
import { PhX } from '@phosphor-icons/vue';
import { onMounted, reactive } from "vue";
import api from "@/api.js";
import { popupInfo, formatMask } from '../../stores/util.js';

const emits = defineEmits(['modal:open']);

const disponibilidades = [
    { value: "indisponível", nome: "Indisponível" },
    { value: "matutino", nome: "Matutino" },
    { value: "vespertino", nome: "Vespertino" },
    { value: "noturno", nome: "Noturno" },
    { value: "integral", nome: "Integral" },
    { value: "flexivel", nome: "Flexível" },
];

const form = reactive({
    _id: false,
    nome: "",
    sobrenome: "",
    formacao: "",
    email: "",
    descricao: "",
    github: "",
    linkedin: "",
    celular: "",
    disponibilidade: "",
    senha: "",
    tipo: null,
    ativo: true,
});

const props = defineProps({
    form: {
        type: Object,
        required: true
    },
})

function start(){
    Object.assign(form, props?.form)
    form.senha = "";
}

async function salvar(){

    if(form.linkedin && !validateLinkedin(form.linkedin)){
        return popupInfo().warning('Linkedin inválido.');
    }

    if(form.github && !validateGithub(form.github)){
        return popupInfo().warning('Github inválido.');
    }

    if(form.lattes && !validateLattes(form.lattes)){
        return popupInfo().warning('Currículo Lattes inválido.');
    }
    
    await api.put(`/usuario/editar`, form)
    .then(()=>{
        popupInfo().success('Usuário editado com sucesso.');
        emits('modal:open', false)
    }).catch((e)=>{
        popupInfo().warning('Erro ao editar usuário.');
    })
}

function validateGithub(link) {
    const github = /^https:\/\/github\.com\/[A-z0-9_-]+\/?$/;
    return github.test(link);
}

function validateLinkedin(link) {
    const linkedin = /^https:\/\/(www\.)?linkedin\.com\/in\/[A-z0-9_-]+\/?$/;
    return linkedin.test(link);
}

function validateLattes(link) {
    const lattes = /^http:\/\/lattes\.cnpq\.br\/\d{15,17}$/;
    return lattes.test(link);
}

onMounted(start);
</script>