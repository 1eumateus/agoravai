<template>
    <nav class="flex items-center justify-between px-[5px] md:px-[80px] lg:px-[80px] border-b-[2px] border-terciaria gap-[24px] bg-principal text-white">
       <section class="flex items-center gap-[24px] ">
            <router-link to="/ui/" class=" hover:text-terciaria hidden md:block lg:block">
                <Texto as="h3" color="white" :cursorPointer="true">
                    SOTCC 
                </Texto>
                <Texto as="h3" color="white" :cursorPointer="true">
                    - Sistema de orientação em TCC
                </Texto>
            </router-link> 

            <router-link to="/ui/" class=" hover:text-terciaria block md:hidden lg:hidden">
                <Texto as="body-bold" color="white" :cursorPointer="true">
                    SOTCC
                </Texto>
                <Texto as="body-bold" color="white" :cursorPointer="true">
                    - Sistema de orientação em TCC
                </Texto>
            </router-link>
        </section>

        <div class="hidden md:flex flex-1 max-w-md relative" v-if="user.tipo === 'aluno' || user.tipo === 'professor'">
            <PhMagnifyingGlass :size="18" class="fill-white opacity-70 absolute left-[10px] top-1/2 -translate-y-1/2" />
            <input
                v-model="buscaProfessor"
                type="text"
                :placeholder="user.tipo === 'professor' ? 'Buscar aluno...' : 'Buscar professor...'"
                class="w-full pl-[34px] pr-[10px] py-[8px] rounded-md bg-principal-opaco text-white placeholder-white/60 border border-terciaria/40 focus:outline-none focus:border-terciaria text-sm"
                @keyup.enter="buscarProfessor"
            />
        </div>

        <section class="flex items-center gap-[16px]">
            <dropdown-menu mode="click" :overlay="false" v-if="user.tipo !== 'admin'">
                <template #trigger>
                    <div class="cursor-pointer hover:text-terciaria relative">
                        <PhBell :size="26" />
                        <span
                            v-if="orientacoesComNotificacao.length > 0"
                            class="absolute -top-[2px] -right-[2px] w-[10px] h-[10px] rounded-full bg-red-500 border border-principal"
                        ></span>
                    </div>
                </template>
                <template #body>
                    <div class="relative">
                        <div class="absolute z-40 top-4 right-0 w-[260px] bg-principal rounded-md border border-terciaria flex flex-col text-left">
                            <div class="px-[14px] py-[8px] border-b border-terciaria">
                                Notificações
                            </div>
                            <router-link
                                v-for="item in orientacoesComNotificacao"
                                :key="item._id"
                                :to="item.solicitacaoPendente ? '/ui/' : `/ui/acompanhamento/${item._id}`"
                                class="cursor-pointer flex flex-col gap-[2px] px-[14px] py-[8px] hover:text-terciaria w-full rounded-md"
                            >
                                <Texto as="body-bold" color="white">
                                    {{ user.tipo === 'aluno' ? nomeCompleto(item.professor) : nomeCompleto(item.aluno) }}
                                </Texto>
                                <Texto as="label" color="white">
                                    <template v-if="item.solicitacaoPendente">
                                        Nova solicitação de orientação{{ item.proposta ? `: "${item.proposta}"` : '' }}
                                    </template>
                                    <template v-else-if="item.cancelamentoPendente">
                                        Solicitou cancelamento: "{{ item.cancelamento.motivo }}"
                                    </template>
                                    <template v-else>
                                        {{ resumoNotificacao(item.notificacaoDetalhe) }}
                                    </template>
                                </Texto>
                            </router-link>
                            <div v-if="orientacoesComNotificacao.length === 0" class="px-[14px] py-[8px] text-gray-300">
                                Nenhuma novidade.
                            </div>
                        </div>
                    </div>
                </template>
            </dropdown-menu>

        <dropdown-menu mode="click" :overlay="false" >
            <template #trigger >
                <div class="cursor-pointer hover:text-terciaria flex items-center gap-[8px]"> 
                    {{user.nome}} 
                    <PhGear :size="28" />
                </div>
            </template>
            <template #body>
                <div class="relative">
                    <div class="absolute z-40 top-4 right-0 bg-principal rounded-md border border-terciaria flex flex-col text-left">
                        <router-link 
                            to="/ui/perfil" 
                            class="px-[14px] py-[8px] hover:text-terciaria w-full rounded-md" >
                            Perfil
                        </router-link>
                        <router-link 
                            to="/ui/usuarios" 
                            class="px-[14px] py-[8px] hover:text-terciaria w-full rounded-md"
                            v-if="user.tipo === 'admin'"
                            >
                            Usuários 
                        </router-link>
                        <button 
                            type="button" 
                            @click="logout" 
                            class="flex px-[14px] py-[8px] hover:text-terciaria w-full rounded-md" >
                            Sair
                        </button>
                    </div>
                </div>
            </template>
        </dropdown-menu>
        </section>
    </nav>
</template>

<script setup>
import { PhGear, PhBell, PhMagnifyingGlass } from '@phosphor-icons/vue';
import Texto from '@components/Texto.vue'
import dropdownMenu from 'v-dropdown-menu';
import { reactive, ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api.js';

const props = defineProps(["user"]);
const route = useRoute();
const router = useRouter();

const orientacoesComNotificacao = reactive([]);
const buscaProfessor = ref('');

watch(() => route.query.procurar, (valor) => {
    buscaProfessor.value = valor || '';
}, { immediate: true });

function buscarProfessor() {
    router.push({ name: 'Home', query: { procurar: buscaProfessor.value || undefined } });
}

function nomeCompleto(pessoa) {
    return `${pessoa?.nome || ''} ${pessoa?.sobrenome || ''}`.trim();
}

function resumoNotificacao(detalhe) {
    if (!detalhe) return '';
    if (detalhe.tipo === 'arquivo') {
        return `Arquivo novo em "${detalhe.fase}": ${detalhe.texto}`;
    }
    const texto = detalhe.texto.length > 50 ? detalhe.texto.slice(0, 50) + '...' : detalhe.texto;
    return `Comentário em "${detalhe.fase}": "${texto}"`;
}

async function buscarNotificacoes() {
    if (props.user.tipo === 'admin') return;
    await api.get('/orientacao/')
        .then((res) => {
            const itens = res.data?.item || [];
            const comAtividade = itens.filter((item) => item.situacao === 'confirmado' && item.notificacao);
            const pendentes = props.user.tipo === 'professor'
                ? itens.filter((item) => item.situacao === 'pendente').map((item) => ({ ...item, solicitacaoPendente: true }))
                : [];
            const cancelamentos = props.user.tipo === 'professor'
                ? itens.filter((item) => item.cancelamento?.solicitadoPor === 'aluno').map((item) => ({ ...item, cancelamentoPendente: true }))
                : [];
            orientacoesComNotificacao.splice(0, orientacoesComNotificacao.length, ...pendentes, ...cancelamentos, ...comAtividade);
        })
        .catch(() => {});
}

watch(() => route.fullPath, buscarNotificacoes);
onMounted(buscarNotificacoes);

async function logout() {
    localStorage.removeItem("token");
    window.location.reload();
}
</script>