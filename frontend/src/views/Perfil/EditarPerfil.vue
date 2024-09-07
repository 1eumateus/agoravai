<template>
    <div class="fixed inset-0 z-40 flex items-center justify-center bg-gray-600 bg-opacity-50">
            <main class="w-full md:w-[720px] lg:w-[720px] p-[24px] h-screen md:max-h-[720px] lg:max-h-[720px] overflow-y-auto bg-white rounded-md flex flex-col gap-[24px]">
                <section class="grid grid-cols-1 gap-[14px]">
                    <section class="grid grid-cols-2 gap-[10px]">
                        <div class="flex flex-col gap-[4px]">
                            <div class="flex items-center gap-[10px]">
                                <label class="text-[18px] " for="nome">Nome</label>
                            </div>
                            <input 
                                v-model="form.nome" 
                                id="nome" 
                                class="p-[8px] border border-black" 
                                placeholder="ex.: Davi"
                            />
                        </div>
                        <div class="flex flex-col gap-[4px]">
                            <div class="flex items-center gap-[10px]">
                                <label class="text-[18px] " for="sobrenome">Sobrenome</label>
                                <label class="text-gray-600" for="sobrenome">Opcional</label>
                            </div>
                            <input 
                                v-model="form.sobrenome" 
                                id="sobrenome" 
                                class="p-[8px] border border-black" 
                                placeholder="ex.: Barroso"
                            />
                        </div>

                    </section>
                    <div class="flex flex-col gap-[4px]">
                        <div>
                            <label class="text-[18px]" for="email">Email</label>
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
                        <div>
                            <label class="text-[18px]" for="instituicao">Instituição de ensino</label>
                        </div>
                        <input 
                            v-model="form.instituicao" 
                            type="text" 
                            id="instituicao" 
                            class="p-[8px] border border-black" 
                            placeholder="ex.: Universidade Federal do Pará"
                        />
                    </div>

                    <div class="flex flex-col gap-[4px]">
                        <div class="flex items-center gap-[10px]">
                            <label class="text-[18px]" for="linkedin">LinkedIn </label>
                            <label class="text-gray-600" for="linkedin">Opcional</label>
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
                            <label class="text-[18px]" for="github">GitHub </label>
                            <label class="text-gray-600" for="github">Opcional</label>
                        </div>
                        <input 
                            v-model="form.github" 
                            id="github" 
                            class="p-[8px] border border-black" 
                            placeholder="ex.: https://github.com/"
                            maxlength="90"
                        />
                    </div>

                    <div class="flex flex-col gap-[12px] ">
                        <div class="flex items-center gap-[10px]">
                            <label class="text-[18px]" for="formdisponibilidade">Disponibilidade </label>
                        </div>
                        <div class="flex items-center flex-wrap gap-[14px]">
                            <label class="flex items-center p-[10px] gap-[10px] border border-black rounded-md">
                                <input 
                                    type="radio"
                                    v-model="form.disponibilidade" 
                                    value="matutino"
                                />Matutino
                            </label>

                            <label class="flex items-center p-[10px] gap-[10px] border border-black rounded-md">
                                <input 
                                    type="radio"
                                    v-model="form.disponibilidade" 
                                    value="vespertino"
                                />
                                Vespertino
                                </label>

                            <label class="flex items-center p-[10px] gap-[10px] border border-black rounded-md">
                                <input 
                                    type="radio"
                                    v-model="form.disponibilidade" 
                                    value="noturno"
                                />
                                Noturno
                            </label>

                            <label class="flex items-center p-[10px] gap-[10px] border border-black rounded-md">
                                <input 
                                    type="radio"
                                    v-model="form.disponibilidade" 
                                    value="integral"
                                />
                                Integral
                            </label>

                            <label class="flex items-center p-[10px] gap-[10px] border border-black rounded-md">
                                <input 
                                    type="radio"
                                    v-model="form.disponibilidade" 
                                    value="flexivel"
                                />
                                Flexível
                            </label>
                        </div>
                    </div>

                    <div class="flex flex-col gap-[4px] ">
                        <div class="flex items-center gap-[10px]">
                            <label class="text-[18px]" for="formdescricao">Descrição </label>
                            <label class="text-gray-600" for="formdescricao">Opcional</label>
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

                </section>
                <section class="flex justify-between gap-[24px]">
                    <button 
                        type="button" 
                        :onClick="()=> emits('modal:open', false)" 
                        class=" font-bold text-[14px] bg-gray-300 hover:bg-gray-400 py-[8px] px-[12px] rounded-md cursor-pointer">
                        Cancelar
                    </button>
                    <button 
                        type="button" 
                        :onClick="salvar" 
                        class=" font-bold text-[14px] bg-gray-300 hover:bg-gray-400 py-[8px] px-[12px] rounded-md cursor-pointer">
                        Salvar
                    </button>
                </section>

            </main>
    </div>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import api from "@/api.js";
import { popupInfo } from '../../stores/util.js';

const emits = defineEmits(['modal:open']);

const form = reactive({
    _id: false,
    nome: "",
    sobrenome: "",
    email: "",
    descricao: "",
    github: "",
    linkedin: "",
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
    console.log(form._id)
    await api.put(`/usuario/editar`, form)
    .then(()=>{
        popupInfo().success('Usuário editado com sucesso.');
        emits('modal:open', false)
    }).catch((e)=>{
        popupInfo().warning('Erro ao editar usuário.');
    })
}

onMounted(start);
</script>