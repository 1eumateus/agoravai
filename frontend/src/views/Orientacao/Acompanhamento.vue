<template>
  <main class="flex-grow relative">
    <section class="mx-auto max-w-6xl p-[14px] flex flex-col gap-[14px]">
      <template v-if="!viewing">
        <div class="border-b border-secundaria-opaco pb-[8px] flex items-center justify-between flex-wrap gap-[8px]">
          <Texto as="h3" color="principal">
            {{ ehProfessor ? 'Progresso do aluno' : 'Seu progresso' }}
          </Texto>
          <Texto as="body" color="gray" v-if="orientacao.aluno?.nome">
            {{
              ehProfessor
                ? `Aluno: ${orientacao.aluno.nome} ${orientacao.aluno.sobrenome || ''}`
                : `Orientador: ${orientacao.professor?.nome || ''} ${orientacao.professor?.sobrenome || ''}`
            }}
          </Texto>
        </div>

        <template v-if="orientacao.fases?.length">
          <div class="grid grid-cols-4 gap-1 mt-2">
            <div v-for="(fase, index) in orientacao.fases" :key="fase._id || index" class="flex flex-col items-center gap-[4px]">
              <Texto
                as="label"
                :color="faseStatus(index) === 'locked' ? 'gray' : 'principal'"
                class="text-center justify-center truncate max-w-full"
              >
                {{ fase.nome }}
              </Texto>
              <button
                type="button"
                :disabled="faseStatus(index) === 'locked'"
                :class="`${abaClass(index)} p-1 min-w-full border rounded-md`"
                @click="abaSelecionada = index"
              ></button>
            </div>
          </div>

          <div class="flex flex-col gap-[10px]">
            <div class="flex items-center justify-between flex-wrap gap-[8px]">
              <div class="flex items-center gap-[8px] flex-wrap">
                <Texto as="h4" color="principal">
                  Fase {{ abaSelecionada + 1 }}: {{ faseSelecionada.nome }}
                </Texto>
                <span
                  v-if="faseStatus(abaSelecionada) === 'current'"
                  class="text-xs font-bold px-[8px] py-[2px] rounded-full bg-terciaria text-white"
                >
                  Fase atual
                </span>
              </div>
              <span
                :class="`text-xs font-bold px-[8px] py-[2px] rounded-full ${faseSelecionada.situacao === 'aprovada' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`"
              >
                {{ faseSelecionada.situacao === 'aprovada' ? 'Aprovada' : 'Aguardando aprovação' }}
              </span>
            </div>

            <div class="border border-secundaria-opaco rounded-md overflow-hidden" v-if="faseSelecionada.arquivos?.length > 0">
              <table class="w-full text-sm">
                <tbody>
                  <tr
                    v-for="arquivo in faseSelecionada.arquivos"
                    :key="arquivo._id"
                    class="even:bg-secundaria border-b border-secundaria last:border-b-0"
                  >
                    <td class="p-2">
                      <div class="flex items-center gap-[6px]">
                        <PhFilePdf :size="18" class="fill-principal" />
                        <span class="truncate max-w-[220px]" :title="arquivo.originalname">
                          {{ arquivo.originalname }}
                        </span>
                      </div>
                    </td>
                    <td class="p-2 text-xs text-gray-600">
                      {{ formatMask.viewDate(arquivo.dataEnvio) }}
                    </td>
                    <td class="p-2">
                      <div class="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          @click="viewPdf(arquivo)"
                          class="cursor-pointer p-[6px] border border-gray-300 hover:bg-secundaria rounded-md"
                          title="Visualizar"
                        >
                          <PhEye :size="16" class="fill-principal" />
                        </button>
                        <button
                          v-if="!ehProfessor && faseSelecionada.situacao !== 'aprovada'"
                          type="button"
                          @click="removerArquivo(abaSelecionada, arquivo._id)"
                          class="cursor-pointer p-[6px] border border-gray-300 hover:bg-secundaria rounded-md"
                          title="Remover"
                        >
                          <PhTrash :size="16" class="fill-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <Texto as="label" color="gray" v-else>
              Nenhum arquivo enviado nesta fase ainda.
            </Texto>

            <div
              v-if="!ehProfessor && faseSelecionada.situacao !== 'aprovada'"
              class="flex flex-col items-start gap-[6px]"
            >
              <label
                for="upload"
                class="cursor-pointer inline-flex items-center gap-2 bg-principal text-white px-[14px] py-[8px] rounded-md hover:bg-principal-opaco"
              >
                <PhCloudArrowUp :size="18" class="fill-white" />
                <Texto as="button" color="white">
                  Enviar PDF
                </Texto>
              </label>
              <input
                id="upload"
                type="file"
                accept=".pdf"
                class="hidden"
                @change="enviarArquivo($event, abaSelecionada)"
              />
              <Texto as="label" color="gray">
                Você pode enviar quantos arquivos quiser. A fase avança quando o orientador aprovar.
              </Texto>
            </div>

            <div class="flex flex-col gap-[6px] border-t border-secundaria-opaco pt-[8px]">
              <Texto as="body-bold">
                Comentários
              </Texto>
              <div v-if="!faseSelecionada.comentarios?.length">
                <Texto as="label" color="gray">
                  Nenhum comentário ainda.
                </Texto>
              </div>
              <div
                v-for="comentario in faseSelecionada.comentarios"
                :key="comentario._id"
                :class="`rounded-md p-[8px] flex flex-col gap-[2px] ${comentario.autor === 'professor' ? 'bg-secundaria' : 'bg-gray-100'}`"
              >
                <Texto as="body-bold" :color="comentario.autor === 'professor' ? 'principal' : 'gray'">
                  {{ comentario.autor === 'professor' ? 'Orientador' : 'Aluno' }}
                </Texto>
                <Texto as="body">
                  {{ comentario.texto }}
                </Texto>
                <Texto as="small" color="gray">
                  {{ formatMask.viewDate(comentario.data) }}
                </Texto>
              </div>

              <textarea
                v-model="comentarioTexto[abaSelecionada]"
                rows="2"
                placeholder="Escreva um comentário..."
                class="w-full border border-principal focus:outline-principal p-[8px] rounded-md text-sm"
              ></textarea>
              <div class="flex gap-[8px] flex-wrap">
                <button
                  type="button"
                  @click="enviarComentario(abaSelecionada)"
                  class="cursor-pointer border border-gray-300 hover:bg-gray-200 px-[14px] py-[8px] rounded-md font-bold text-[14px]"
                >
                  Enviar comentário
                </button>
                <button
                  v-if="ehProfessor && faseSelecionada.situacao !== 'aprovada'"
                  type="button"
                  @click="aprovarFase(abaSelecionada)"
                  :disabled="!faseSelecionada.arquivos?.length"
                  class="cursor-pointer bg-principal hover:bg-principal-opaco disabled:opacity-50 disabled:cursor-not-allowed text-white px-[14px] py-[8px] rounded-md font-bold text-[14px] flex items-center gap-1"
                >
                  <PhCheck :size="18" class="fill-white" />
                  Aprovar fase
                </button>
              </div>
            </div>
          </div>
        </template>

        <div
          v-if="orientacao.fases?.length && faseAtualIndex >= orientacao.fases.length"
          class="border border-secundaria-opaco rounded-md bg-white p-[24px] flex flex-col items-center gap-[6px]"
        >
          <PhCheckCircle :size="40" class="fill-principal" />
          <Texto as="h4" color="principal">
            Todas as fases foram concluídas!
          </Texto>
        </div>
      </template>

      <template v-else>
        <div class="flex items-center justify-between gap-[12px] flex-wrap border-b border-secundaria-opaco pb-[8px]">
          <div class="flex items-center gap-[12px]">
            <button
              @click="closePdfViewer"
              type="button"
              class="cursor-pointer flex items-center gap-1 border border-gray-300 bg-white hover:bg-gray-200 px-[12px] py-[8px] rounded-md text-black font-normal"
            >
              <PhCaretLeft :size="18" />
              voltar
            </button>
            <div class="flex items-center gap-[6px]">
              <PhFilePdf :size="22" class="fill-principal" />
              <Texto as="h4" color="principal">
                {{ selectedFile?.originalname || "Visualizador PDF" }}
              </Texto>
            </div>
          </div>

          <div class="flex items-center gap-[10px]">
            <PhMagnifyingGlass :size="18" class="fill-gray-600" />
            <input
              type="range"
              v-model="zoomLevel"
              min="0.5"
              max="1.5"
              step="0.01"
              @input="updateZoom"
              class="w-32 h-1 rounded-lg appearance-none cursor-pointer zoom-slider"
              :style="{
                background: `linear-gradient(to right, #3d4a7b 0%, #3d4a7b ${(zoomLevel - 0.5) * 100}%, #e9e9e9 ${(zoomLevel - 0.5) * 100}%, #e9e9e9 100%)`,
              }"
            />
            <Texto as="label" color="gray" class="min-w-[45px]">
              {{ Math.round(zoomLevel * 100) }}%
            </Texto>
            <button
              @click="resetZoom"
              type="button"
              class="cursor-pointer text-xs border border-gray-300 hover:bg-gray-200 px-[10px] py-[6px] rounded-md transition-colors"
              title="Resetar zoom"
            >
              Resetar
            </button>
          </div>
        </div>

        <div class="h-[75vh] border border-secundaria-opaco rounded-md overflow-auto">
          <PdfViewer
            ref="pdfViewerRef"
            :key="selectedPdfUrl"
            :pdfUrl="selectedPdfUrl"
            :zoomLevel="zoomLevel"
          />
        </div>
      </template>
    </section>
  </main>
</template>

<script setup>
import { onMounted, reactive, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  PhTrash, PhEye, PhCloudArrowUp, PhFilePdf, PhMagnifyingGlass,
  PhCaretLeft, PhCheck, PhCheckCircle,
} from '@phosphor-icons/vue';
import Texto from '@components/Texto.vue';
import PdfViewer from "../../components/pdfViewer.vue";
import api from "@/api.js";
import { popupInfo, formatMask } from '../../stores/util.js';
import { useLoaderState } from "../../stores/isLoading.js";

const props = defineProps({
  usuario: {
    type: [Object],
    required: false,
  },
});

const route = useRoute();
const router = useRouter();
const isLoading = useLoaderState();
const urlApi = import.meta.env.VITE_URL;

const ehProfessor = computed(() => props.usuario?.tipo === 'professor');

const orientacao = reactive({
  _id: null,
  situacao: '',
  aluno: {},
  professor: {},
  fases: [],
});

const comentarioTexto = reactive({});
const abaSelecionada = ref(0);

const faseSelecionada = computed(() => orientacao.fases[abaSelecionada.value] || {});

const selectedFile = ref(null);
const viewing = ref(false);
const zoomLevel = ref(1.0);
const pdfViewerRef = ref(null);

const selectedPdfUrl = computed(() =>
  selectedFile.value ? `${urlApi}/uploads/${selectedFile.value.filename}` : null
);

const faseAtualIndex = computed(() => {
  if (!orientacao.fases?.length) return 0;
  const idx = orientacao.fases.findIndex((f) => f.situacao !== 'aprovada');
  return idx === -1 ? orientacao.fases.length : idx;
});

function faseStatus(index) {
  if (index < faseAtualIndex.value) return 'completed';
  if (index === faseAtualIndex.value) return 'current';
  return 'locked';
}

function abaClass(index) {
  if (index === abaSelecionada.value) return 'bg-principal border-terciaria';
  return 'bg-gray-300 border-white';
}

let primeiraCarga = true;

async function start() {
  isLoading.changeStateTrue();
  await api.get(`/orientacao/${route.params.id}`)
    .then((res) => {
      Object.assign(orientacao, res.data.orientacao);
      if (primeiraCarga) {
        abaSelecionada.value = Math.min(faseAtualIndex.value, orientacao.fases.length - 1);
        primeiraCarga = false;
      }
      api.put(`/orientacao/${orientacao._id}/visualizar`).catch(() => {});
    })
    .catch((e) => {
      popupInfo().warning(e.response?.data?.msg || 'Orientação não encontrada.');
      router.push({ name: 'Home' });
    });
  isLoading.changeStateFalse();
}

async function enviarArquivo(event, faseIndex) {
  const file = event.target.files[0];
  event.target.value = '';
  if (!file) return;
  if (file.type !== 'application/pdf') {
    return popupInfo().warning('Selecione um arquivo PDF.');
  }
  const formData = new FormData();
  formData.append('arquivo', file);
  isLoading.changeStateTrue();
  await api.post(`/orientacao/${orientacao._id}/fases/${faseIndex}/arquivo`, formData)
    .then(async (res) => {
      popupInfo().success(res.data?.msg);
      await start();
    })
    .catch((e) => popupInfo().warning(e.response?.data?.msg || 'Erro ao enviar arquivo.'))
    .finally(() => isLoading.changeStateFalse());
}

async function removerArquivo(faseIndex, arquivoId) {
  isLoading.changeStateTrue();
  await api.delete(`/orientacao/${orientacao._id}/fases/${faseIndex}/arquivo/${arquivoId}`)
    .then(async (res) => {
      popupInfo().success(res.data?.msg);
      await start();
    })
    .catch((e) => popupInfo().warning(e.response?.data?.msg || 'Erro ao remover arquivo.'))
    .finally(() => isLoading.changeStateFalse());
}

async function aprovarFase(faseIndex) {
  isLoading.changeStateTrue();
  await api.put(`/orientacao/${orientacao._id}/fases/${faseIndex}/avaliar`, {
    texto: comentarioTexto[faseIndex] || '',
  })
    .then(async (res) => {
      popupInfo().success(res.data?.msg);
      comentarioTexto[faseIndex] = '';
      await start();
    })
    .catch((e) => popupInfo().warning(e.response?.data?.msg || 'Erro ao aprovar fase.'))
    .finally(() => isLoading.changeStateFalse());
}

async function enviarComentario(faseIndex) {
  if (!comentarioTexto[faseIndex]?.trim()) {
    return popupInfo().warning('Escreva um comentário.');
  }
  isLoading.changeStateTrue();
  await api.post(`/orientacao/${orientacao._id}/fases/${faseIndex}/comentario`, {
    texto: comentarioTexto[faseIndex],
  })
    .then(async (res) => {
      popupInfo().success(res.data?.msg);
      comentarioTexto[faseIndex] = '';
      await start();
    })
    .catch((e) => popupInfo().warning(e.response?.data?.msg || 'Erro ao enviar comentário.'))
    .finally(() => isLoading.changeStateFalse());
}

function viewPdf(arquivo) {
  selectedFile.value = arquivo;
  viewing.value = true;
  zoomLevel.value = 1.0;
}

function closePdfViewer() {
  selectedFile.value = null;
  viewing.value = false;
  zoomLevel.value = 1.0;
}

function updateZoom() {
  if (pdfViewerRef.value) {
    pdfViewerRef.value.updateZoom(zoomLevel.value);
  }
}

function resetZoom() {
  zoomLevel.value = 1.0;
  updateZoom();
}

onMounted(start);
</script>

<style scoped>
button {
  cursor: pointer;
  transition: all 0.2s ease;
}

.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.zoom-slider {
  -webkit-appearance: none;
  appearance: none;
}

.zoom-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  background: #3d4a7b;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.zoom-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.zoom-slider:focus {
  outline: none;
}
</style>
