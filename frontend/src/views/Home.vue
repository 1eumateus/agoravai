<template>
    <SolicitarOrientacao
        @modal:open="recarregarAposSolicitar($event)"
        :professor="professorSelecionado._id"
        :emailProfessor="professorSelecionado.email"
        :nomeAluno="props?.usuario?.nome"
        :aluno="props?.usuario?.id"
        v-if="openSolicitarOrientacao"
    />
    <RespostaOrientacao
        @modal:open="recarregarAposNegar($event)"
        :orientacao="orientacaoParaNegar"
        situacao="negado"
        :usuario="props?.usuario"
        v-if="openNegarOrientacao"
    />
    <main class="flex-grow relative " >
        <section class="mx-auto max-w-7xl p-[14px] flex flex-col gap-[24px]">
            <ListaOrientacao :usuario="props?.usuario" @atualizado="listarOrientacao" v-if="props?.usuario?.tipo !== 'professor' || temPendente"></ListaOrientacao>

            <section v-if="props?.usuario?.tipo === 'professor'" class="grid grid-cols-1 gap-[10px] border border-secundaria-opaco rounded-md bg-white p-[14px]">
                <div class="flex items-center justify-between flex-wrap gap-[8px] border-b border-secundaria-opaco pb-[8px]">
                    <div class="flex items-center gap-[8px]">
                        <PhUserCircle :size="22" class="fill-principal" />
                        <Texto as="h4" color="principal">
                            <template v-if="!procurar">Meus alunos</template>
                            <template v-else>Resultados para "{{ procurar }}" ({{ alunosOrientados.length }})</template>
                        </Texto>
                    </div>
                    <button v-if="procurar" type="button" class="cursor-pointer text-[13px] font-bold text-principal hover:underline" @click="limparBusca">
                        Limpar busca
                    </button>
                </div>

                <Texto as="body" color="gray" v-if="alunosOrientados.length === 0 && !procurar">
                    Você ainda não está orientando nenhum aluno.
                </Texto>
                <Texto as="body" color="gray" v-else-if="alunosOrientados.length === 0">
                    Nenhum aluno encontrado para "{{ procurar }}".
                </Texto>
                <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[10px]">
                    <section
                        v-for="aluno in alunosOrientados"
                        :key="aluno.orientacaoId"
                        class="flex flex-col gap-[6px] border border-secundaria-opaco rounded-md p-[8px] bg-white hover:shadow-md transition-shadow"
                    >
                        <div class="flex items-center gap-[8px]">
                            <img
                                v-if="aluno?.imagem?.filename"
                                :src="`${urlApi}/uploads/${aluno.imagem.filename}`"
                                :alt="aluno.imagem.originalname"
                                class="h-[40px] w-[40px] object-cover rounded-md border border-secundaria-opaco flex-shrink-0"
                            />
                            <img
                                v-else
                                :src="`/ui/Sem_imagem.jpg`"
                                :alt="'sem imagem'"
                                class="h-[40px] w-[40px] object-cover rounded-md border border-secundaria-opaco flex-shrink-0"
                            />
                            <Texto as="label" class="truncate font-bold">
                                {{ aluno.nome }} {{ aluno.sobrenome }}
                            </Texto>
                        </div>

                        <div class="border-t border-secundaria pt-[6px]">
                            <Texto as="small" color="gray">Proposta</Texto>
                            <Texto as="label" class="line-clamp-2">
                                {{ aluno.proposta?.trim() || 'Não informado' }}
                            </Texto>
                        </div>

                        <div
                            v-if="aluno.cancelamento?.solicitadoPor === 'aluno'"
                            class="border border-orange-300 bg-orange-50 rounded-md p-[8px] flex flex-col gap-[4px]"
                        >
                            <Texto as="small" color="orange">Solicitação de cancelamento</Texto>
                            <Texto as="label" class="line-clamp-2">
                                {{ aluno.cancelamento.motivo }}
                            </Texto>
                            <div class="flex gap-[4px]">
                                <button
                                    type="button"
                                    class="flex-1 cursor-pointer px-[8px] py-[5px] bg-green-600 hover:bg-green-700 text-white rounded-md font-bold text-[11px]"
                                    @click="aceitarCancelamento(aluno.orientacaoId)"
                                >
                                    Aceitar
                                </button>
                                <button
                                    type="button"
                                    class="flex-1 cursor-pointer px-[8px] py-[5px] border border-gray-300 hover:bg-gray-100 rounded-md font-bold text-[11px]"
                                    @click="recusarCancelamento(aluno.orientacaoId)"
                                >
                                    Recusar
                                </button>
                            </div>
                        </div>

                        <div class="flex flex-col gap-[4px] mt-auto pt-[4px]">
                            <router-link
                                :to="`/ui/orientacao/${aluno.orientacaoId}`"
                                class="cursor-pointer w-full flex items-center justify-center gap-[4px] px-[8px] py-[5px] border border-principal text-principal hover:bg-secundaria rounded-md font-bold text-[11px]"
                            >
                                <PhInfo :size="13" />
                                Detalhes
                            </router-link>
                            <router-link
                                :to="`/ui/acompanhamento/${aluno.orientacaoId}`"
                                class="cursor-pointer w-full flex items-center justify-center gap-[4px] px-[8px] py-[5px] bg-terciaria text-white hover:bg-terciaria-opaco rounded-md font-bold text-[11px]"
                            >
                                <PhChartLineUp :size="13" />
                                Acompanhar
                                <span v-if="aluno.notificacao" class="w-[8px] h-[8px] rounded-full bg-red-500 border border-white"></span>
                            </router-link>
                            <button
                                type="button"
                                class="cursor-pointer w-full flex items-center justify-center gap-[4px] px-[8px] py-[5px] border border-red-300 text-red-600 hover:bg-red-50 rounded-md font-bold text-[11px]"
                                @click="abrirNegarOrientacao(aluno.orientacaoId)"
                            >
                                <PhX :size="13" />
                                Negar
                            </button>
                        </div>
                    </section>
                </div>
            </section>

            <section v-else class="grid grid-cols-1 gap-[10px] border border-secundaria-opaco rounded-md bg-white p-[14px]">
                <div class="flex items-center justify-between flex-wrap gap-[8px] border-b border-secundaria-opaco pb-[8px]">
                    <div class="flex items-center gap-[8px]">
                        <PhUserCircle :size="22" class="fill-principal" />
                        <Texto as="h4" color="principal">
                            <template v-if="!procurar">Professores disponíveis</template>
                            <template v-else-if="professoresDisponiveis.length > 0 && !mostrandoParecidos">
                                Resultados para "{{ procurar }}" ({{ professoresDisponiveis.length }})
                            </template>
                            <template v-else>
                                Nenhum professor encontrado para "{{ procurar }}" — veja professores parecidos
                            </template>
                        </Texto>
                    </div>
                    <button v-if="procurar" type="button" class="cursor-pointer text-[13px] font-bold text-principal hover:underline" @click="limparBusca">
                        Limpar busca
                    </button>
                </div>

                <Texto as="body" color="gray" v-if="professoresDisponiveis.length === 0">
                    Nenhum professor disponível encontrado no momento.
                </Texto>
                <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[10px]">
                    <section
                        v-for="professor in professoresDisponiveis"
                        :key="professor._id"
                        class="flex flex-col gap-[6px] border border-secundaria-opaco rounded-md p-[8px] bg-white hover:shadow-md transition-shadow"
                    >
                        <div class="flex items-center gap-[8px]">
                            <img
                                v-if="professor?.imagem?.filename"
                                :src="`${urlApi}/uploads/${professor?.imagem?.filename}`"
                                :alt="professor?.imagem?.originalname"
                                class="h-[40px] w-[40px] object-cover rounded-md border border-secundaria-opaco flex-shrink-0"
                            />
                            <img
                                v-else
                                :src="`/ui/Sem_imagem.jpg`"
                                :alt="'sem imagem'"
                                class="h-[40px] w-[40px] object-cover rounded-md border border-secundaria-opaco flex-shrink-0"
                            />
                            <div class="flex flex-col gap-[2px] min-w-0">
                                <Texto as="label" class="truncate font-bold">
                                    {{ professor.nome }} {{ professor.sobrenome }}
                                </Texto>
                                <span class="self-start text-[10px] font-bold px-[6px] py-[1px] rounded-full bg-secundaria-opaco text-principal">
                                    {{ professor.disponibilidade }}
                                </span>
                            </div>
                        </div>

                        <div class="flex flex-col gap-[4px] border-t border-secundaria pt-[6px]">
                            <div>
                                <Texto as="small" color="gray">Formação</Texto>
                                <Texto as="label" class="line-clamp-2">
                                    {{ professor.formacao?.trim() || 'Não informado' }}
                                </Texto>
                            </div>
                            <div>
                                <Texto as="small" color="gray">Áreas de interesse</Texto>
                                <Texto as="label" class="line-clamp-2">
                                    {{ professor.interesse?.trim() || 'Não informado' }}
                                </Texto>
                            </div>
                        </div>

                        <div class="flex flex-col gap-[4px] mt-auto pt-[4px]">
                            <router-link
                                v-if="props?.usuario?.tipo !== 'aluno'"
                                :to="`/ui/professor/${professor._id}`"
                                class="cursor-pointer w-full flex items-center justify-center gap-[4px] px-[8px] py-[5px] border border-principal text-principal hover:bg-secundaria rounded-md font-bold text-[11px]"
                            >
                                <PhInfo :size="13" />
                                Mais informações
                            </router-link>
                            <button
                                v-if="props?.usuario?.tipo === 'aluno'"
                                type="button"
                                class="cursor-pointer w-full flex items-center justify-center gap-[4px] px-[8px] py-[5px] bg-principal text-white hover:bg-principal-opaco rounded-md font-bold text-[11px]"
                                @click="iniciarSolicitacao(professor)"
                            >
                                <PhRocketLaunch :size="13" />
                                Iniciar orientação
                            </button>
                        </div>
                    </section>
                </div>
            </section>
        </section>
    </main>
</template>
<script setup>
import { PhInfo, PhUserCircle, PhRocketLaunch, PhChartLineUp, PhX } from '@phosphor-icons/vue';
import { computed, onMounted, ref, watch, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "@/api.js";
import { popupInfo } from '../stores/util.js';
import Texto from '@components/Texto.vue'
import { useLoaderState } from "../stores/isLoading";
import ListaOrientacao from './Orientacao/ListaOrientacao.vue';
import SolicitarOrientacao from './Orientacao/SolicitarOrientacao.vue';
import RespostaOrientacao from './Orientacao/RespostaOrientacao.vue';
const isLoading = useLoaderState();
const route = useRoute();
const router = useRouter();

const professores = ref([])
const procurar = ref(route.query.procurar || '')
const mostrandoParecidos = ref(false)
const orientacoes = reactive([])
const urlApi = import.meta.env.VITE_URL;
const props = defineProps({
    usuario: {
        type: [Object],
        required: false,
    },
})

const openSolicitarOrientacao = ref(false);
const professorSelecionado = reactive({ _id: '', email: '' });

const professoresDisponiveis = computed(() =>
    professores.value.filter((p) => p.disponibilidade && p.disponibilidade !== 'indisponível' && !orientacaoDoProfessor(p._id))
);

const alunosOrientados = computed(() => {
    const busca = procurar.value.trim().toLowerCase();
    return orientacoes
        .filter((o) => o.situacao === 'confirmado')
        .filter((o) => !busca || `${o.aluno?.nome} ${o.aluno?.sobrenome}`.toLowerCase().includes(busca))
        .map((o) => ({
            ...o.aluno,
            orientacaoId: o._id,
            proposta: o.proposta,
            notificacao: o.notificacao,
            cancelamento: o.cancelamento,
        }));
});

const temPendente = computed(() => orientacoes.some((o) => o.situacao === 'pendente'));

const openNegarOrientacao = ref(false);
const orientacaoParaNegar = reactive({});

async function start() {
    if (props?.usuario?.tipo === 'professor') {
        await listarOrientacao();
        return;
    }
    mostrandoParecidos.value = false;
    await api.get(`/usuario/professores?procurar=${procurar.value}`)
    .then((res)=>{
        professores.value = res.data.item;
    }).catch((e)=>{
        popupInfo().warning('Erro ao pesquisar usuários.');
    })
    if(props?.usuario.tipo === 'aluno'){
        await listarOrientacao()
    }
    if (procurar.value && professoresDisponiveis.value.length === 0) {
        mostrandoParecidos.value = true;
        await api.get('/usuario/professores')
        .then((res)=>{
            professores.value = res.data.item;
        }).catch((e)=>{
            popupInfo().warning('Erro ao pesquisar usuários.');
        })
    }
}

function limparBusca() {
    router.push({ name: 'Home' });
}

function iniciarSolicitacao(professor) {
    professorSelecionado._id = professor._id;
    professorSelecionado.email = professor.email;
    openSolicitarOrientacao.value = true;
}

async function recarregarAposSolicitar(event) {
    openSolicitarOrientacao.value = event;
    await listarOrientacao();
}

function abrirNegarOrientacao(orientacaoId) {
    const original = orientacoes.find((o) => o._id === orientacaoId);
    if (!original) return;
    Object.assign(orientacaoParaNegar, original);
    openNegarOrientacao.value = true;
}

async function recarregarAposNegar(event) {
    openNegarOrientacao.value = event;
    await listarOrientacao();
}

async function aceitarCancelamento(orientacaoId) {
    await api.put(`/orientacao/${orientacaoId}/responderCancelamento`, { aceitar: true })
        .then((res) => popupInfo().success(res?.data?.msg))
        .catch((e) => popupInfo().warning(e?.response?.data?.msg || e))
        .finally(() => listarOrientacao());
}

async function recusarCancelamento(orientacaoId) {
    await api.put(`/orientacao/${orientacaoId}/responderCancelamento`, { aceitar: false })
        .then((res) => popupInfo().success(res?.data?.msg))
        .catch((e) => popupInfo().warning(e?.response?.data?.msg || e))
        .finally(() => listarOrientacao());
}

function orientacaoDoProfessor(professorId) {
    return orientacoes.find((item) => item?.professor?._id === professorId) || null;
}

async function listarOrientacao(){
    await api.get(`/orientacao/`)
    .then((res)=>{
        Object.assign(orientacoes, res.data?.item)
    }).catch((e)=>{
        popupInfo().warning(e?.response?.data?.msg || e);
    })
}

watch(() => route.query.procurar, (valor) => {
    procurar.value = valor || '';
    start();
});

onMounted(async()=>{
    isLoading.changeStateTrue();
    await start();
    isLoading.changeStateFalse();
});
</script>
