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
                    <section class="flex items-center gap-2">
                        <img 
                            v-if="form?.imagem?.filename && !imagePreview && !novaImagem" 
                            :src="`${urlApi}/uploads/${form?.imagem?.filename}`" 
                            :alt="form?.imagem?.originalname" 
                              class="h-[140px] min-w-[140px] rounded border-2 border-principal"
                        />
                        <img 
                            v-if="imagePreview && novaImagem" 
                            :src="imagePreview" 
                            :alt="novaImagem?.name" 
                            class="h-[140px] min-w-[140px] rounded border-2 border-green-500"
                        />
                        <div class="flex flex-col items-center w-full">
                            <label for="file" class="cursor-pointer w-full">
                                <div class="flex items-center justify-center text-center min-w-full h-[140px] border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition duration-200">
                                    <span class="text-gray-500" v-if="!imagePreview && !novaImagem">Selecione uma foto de até 5 MB.</span>
                                    <span class="text-gray-500" v-else>Imagem {{ novaImagem.name  }} selecionada</span>
                                </div>
                            </label>
                            <input 
                                type="file" 
                                id="file" 
                                name="image" 
                                accept="image/*" 
                                class="hidden" 
                                @change="handleFileUpload" 
                            />
                        </div>
                    </section>
                    <Texto as="h4">
                        Informações principais
                    </Texto>
                    <section class="grid grid-cols-2 gap-[10px]">
                        <Campo 
                            v-model="form.nome" 
                            label="Nome" 
                            id="nome" 
                            type="text"
                            :opcional="false"
                            placeholder="ex.: Davi"
                            :maxLength="20"  
                        /> 
                        <Campo 
                            v-model="form.sobrenome" 
                            label="Sobrenome" 
                            id="sobrenome" 
                            type="text"
                            :opcional="true"
                            placeholder="ex.: Barroso"
                            :maxLength="20"  
                        />
                    </section>
                    <Campo 
                        v-model="form.formacao" 
                        label="Formação acadêmica/profissional (Onde obteve os títulos, atuação profissional, etc.)" 
                        id="formacao" 
                        type="text"
                        :maxLength="500"
                        :opcional="false"
                        placeholder="ex.: Mestrado em Inteligência artificial"
                        v-if="form.tipo === 'professor'"
                    />
                    <Campo 
                        v-model="form.interesse" 
                        label=" Áreas de Interesse (áreas de interesse de ensino e pesquisa)" 
                        id="interesse" 
                        type="text"
                        :maxLength="400"
                        :opcional="false"
                        placeholder="ex.: Inteligência artificial, desenvolvimento web e automação"
                        v-if="form.tipo === 'professor'"
                    />

                    <div class="flex flex-col gap-[4px]"  v-if="form.tipo === 'professor'">
                        <div>
                            <Texto as="body" for="pesquisar">
                                Disponibilidade
                            </Texto>
                        </div>
                        <select 
                            v-model="form.disponibilidade" 
                            class="p-[8px] border border-principal h-11 rounded-md " >
                            <option 
                                :value="disponi.value" 
                                v-for="disponi in disponibilidades">
                                {{ disponi.nome }}
                            </option>
                        </select>
                    </div>
                    <!-- <Campo 
                        v-model="form.instituicao" 
                        label="Instituição de ensino" 
                        id="instituicao" 
                        type="text"
                        :maxLength="400"
                        :opcional="false"
                         placeholder="ex.: Universidade Federal do Pará"
                    /> -->

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
                            class="p-[8px] border border-principal rounded-md focus:outline-principal" 
                            placeholder="Descrição com no máximo 100 caracteres."
                            maxlength="200"
                        >
                        </textarea>
                    </div>  

                    <Texto as="h4">
                        Informações de contato
                    </Texto>
                    <Campo 
                        v-model="form.email" 
                        label="Email" 
                        id="email" 
                        type="email"
                        :opcional="false"
                        :maxLength="50"
                        placeholder="ex.: exemplo@exemplo.com"
                    /> 
                    <Campo 
                        v-model="form.telefone" 
                        label="Telefone" 
                        id="telefone" 
                        type="text"
                        :maxLength="15"
                        :opcional="true"
                        placeholder="ex.: (00) 90000-0000"
                        @input="form.telefone = formatMask.tel(form.telefone)"
                    />
                    <Campo 
                        v-model="form.lattes" 
                        label="Currículo Lattes" 
                        id="lattes" 
                        type="text"
                        :maxLength="90"
                        :opcional="true"
                        placeholder="ex.: http://lattes.cnpq.br/"
                    />
                    <Campo 
                        v-model="form.linkedin" 
                        label="LinkedIn" 
                        id="linkedin" 
                        type="text"
                        :maxLength="90"
                        :opcional="true"
                        placeholder="ex.: https://www.linkedin.com/"
                    />
                    <Campo 
                        v-model="form.github" 
                        label="GitHub" 
                        id="github" 
                        type="text"
                        :maxLength="90"
                        :opcional="true"
                        placeholder="ex.: https://github.com/"
                    />

                </section>
                <section class="flex justify-between gap-[24px] border-t border-gray-300 py-[10px]">
                    <button 
                        type="button" 
                        :onClick="()=> emits('modal:open', false)" 
                        class=" font-bold text-[14px] border hover:bg-gray-200 py-[8px] px-[12px] rounded-md cursor-pointer">
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
import Campo from '@components/Campo.vue'
import Texto from '@components/Texto.vue'
import { PhX } from '@phosphor-icons/vue';
import { onMounted, reactive, ref } from "vue";
import api from "@/api.js";
import { popupInfo, formatMask } from '../../stores/util.js';

const emits = defineEmits(['modal:open']);
const urlApi = import.meta.env.VITE_URL;

const novaImagem = ref(null)
const imagePreview = ref(null);

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
    telefone: "",
    disponibilidade: "",
    senha: "",
    imagem: "",
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

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) { // Limite de 5MB
        return popupInfo().warning('Imagem muito grande. Limite de 5MB.');
    }
    if (file && !file.type.startsWith('image/')) {
        return popupInfo().warning('Formato de arquivo inválido. Por favor, envie uma imagem.');
    }
    novaImagem.value = file;
    imagePreview.value = URL.createObjectURL(file); 
}

async function salvarImagem() {
    if (!novaImagem.value) {
        return
    }
    form.imagem = novaImagem.value;
    const formData = new FormData();
    formData.append('image', form.imagem);

    try {
        await api.post(`/usuario/imagem/`, formData);
    } catch (e) {
        popupInfo().warning(e.response?.data?.msg || e);
    }
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
    await salvarImagem();

    await api.put(`/usuario/editar`, form)
    .then(()=>{
        popupInfo().success('Usuário editado com sucesso.');
        emits('modal:open', false)
    }).catch((e)=>{
        popupInfo().warning(e.response.data.msg || e);
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