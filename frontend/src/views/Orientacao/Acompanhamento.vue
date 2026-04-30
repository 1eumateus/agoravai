<template>
  <div class="bg-indigo-100 w-full h-screen grid grid-cols-12">
    <!-- 🔹 TABELA CENTRALIZADA -->
    <div
      v-if="!viewing"
      class="col-span-12 flex items-center justify-center p-4"
    >
      <div class="w-full max-w-md bg-white rounded-lg shadow-lg">
        <div class="p-4 border-b border-indigo-200">
          <h3 class="text-lg font-semibold text-center">Seu progresso</h3>
        </div>

        <div class="p-4">
          <div
            class="border border-black rounded-md h-[500px] flex flex-col w-full"
          >
            <h3 class="text-center text-sm bg-indigo-200 py-2">
              Arquivos enviados
            </h3>

            <div class="bg-white overflow-y-auto flex-1">
              <table class="w-full text-sm">
                <tbody>
                  <tr
                    v-for="(item, index) in file"
                    :key="index"
                    class="hover:bg-gray-200 border-b"
                  >
                    <td class="p-2 truncate max-w-[150px]" :title="item.name">
                      {{ item.name }}
                    </td>
                    <td class="p-2 text-xs">{{ item.date }}</td>
                    <td class="p-2 text-center">
                      <button @click="removeFile(index)" class="text-red-600">
                        🗑️
                      </button>
                    </td>
                    <td class="p-2 text-center">
                      <button @click="viewPdf(item)" class="text-blue-600">
                        👁️
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="p-3 border-t text-center">
              <label
                for="upload"
                class="cursor-pointer inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                <img src="/nuvem.png" class="w-5 h-5" />
                <span>Enviar PDF</span>
              </label>
              <input
                type="file"
                id="upload"
                @change="handleFileChange"
                class="hidden"
                accept=".pdf"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 🔹 VISUALIZADOR EM TELA CHEIA -->
    <div
      v-if="selectedPdfUrl"
      class="col-span-12 bg-gray-100 flex flex-col h-screen fixed inset-0 z-50"
    >
      <div
        class="flex justify-between items-center p-3 bg-indigo-600 text-white shadow-lg"
      >
        <div class="flex items-center gap-4">
          <span class="font-bold text-lg">{{
            selectedFile?.name || "Visualizador PDF"
          }}</span>

          <!-- Controle de zoom discreto com slider -->
          <div class="flex items-center gap-3 ml-4">
            <span class="text-sm opacity-75">🔍</span>
            <input
              type="range"
              v-model="zoomLevel"
              min="0.5"
              max="1.5"
              step="0.01"
              @input="updateZoom"
              class="w-32 h-1 bg-indigo-300 rounded-lg appearance-none cursor-pointer"
              :style="{
                background: `linear-gradient(to right, white 0%, white ${(zoomLevel - 0.5) * 100}%, #818cf8 ${(zoomLevel - 0.5) * 100}%, #818cf8 100%)`,
              }"
            />
            <span class="text-sm min-w-[45px]"
              >{{ Math.round(zoomLevel * 100) }}%</span
            >
            <button
              @click="resetZoom"
              class="text-xs bg-indigo-500 hover:bg-indigo-400 px-2 py-1 rounded transition-colors"
              title="Resetar zoom"
            >
              Resetar
            </button>
          </div>
        </div>
        <button
          @click="closePdfViewer"
          class="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
        >
          Fechar
        </button>
      </div>

      <div class="flex-1 overflow-hidden">
        <!-- PDF Viewer em tela cheia (sem sidebar fixa) -->
        <PdfViewer
          ref="pdfViewerRef"
          :key="selectedPdfUrl"
          :pdfUrl="selectedPdfUrl"
          :comments="allAnnotations"
          :zoomLevel="zoomLevel"
          @add-annotation="handleAddAnnotation"
          @annotation-clicked="handleAnnotationClick"
        />
      </div>
    </div>

    <!-- Sidebar flutuante de comentários -->
    <CommentSidebar
      ref="commentSidebar"
      @save-comment="saveCommentFromSidebar"
      @delete-comment="deleteComment"
    />
  </div>
</template>

<script>
import PdfViewer from "@components/pdfViewer.vue";
import CommentSidebar from "@components/orientacao/CommentSidebar.vue";

export default {
  name: "Acompanhamento",
  components: {
    PdfViewer,
    CommentSidebar,
  },
  data() {
    return {
      file: [],
      selectedPdfUrl: null,
      selectedFile: null,
      viewing: false,
      zoomLevel: 1.0,
      pendingAnnotation: null, // Para novo comentário
    };
  },
  computed: {
    // Converte anotações para o formato esperado pelo PdfViewer (compatibilidade)
    allAnnotations() {
      if (!this.selectedFile?.annotations) return [];

      // Converte o formato antigo para o novo, se necessário
      return this.selectedFile.annotations.map((ann) => ({
        ...ann,
        id: ann.id || Date.now() + Math.random(),
        page: ann.page,
        x: ann.x,
        y: ann.y,
        text: ann.text,
        createdAt: ann.date || ann.createdAt,
      }));
    },
  },
  methods: {
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file && file.type === "application/pdf") {
        this.file.push({
          name: file.name,
          date: new Date().toLocaleString(),
          url: URL.createObjectURL(file),
          annotations: [], // Array de anotações
        });
      } else {
        alert("Selecione um PDF válido.");
      }
      event.target.value = "";
    },

    removeFile(index) {
      const removed = this.file.splice(index, 1)[0];
      if (removed?.url) {
        if (this.selectedPdfUrl === removed.url) {
          this.closePdfViewer();
        }
        URL.revokeObjectURL(removed.url);
      }
    },

    // Acompanhamento.vue - Modifique o método viewPdf
    viewPdf(file) {
      // Abre o PDF no overlay
      this.selectedFile = file;
      this.selectedPdfUrl = file.url;
      this.viewing = true;
      this.zoomLevel = 1.0; // Reset zoom ao abrir
      this.pendingAnnotation = null; // Limpa pending

      // Fecha sidebar se estiver aberto
      if (this.$refs.commentSidebar) {
        this.$refs.commentSidebar.closeSidebar();
      }
    },

    closePdfViewer() {
      this.selectedPdfUrl = null;
      this.selectedFile = null;
      this.viewing = false;
      this.zoomLevel = 1.0;
      this.pendingAnnotation = null;

      // Fecha o sidebar se estiver aberto
      if (this.$refs.commentSidebar) {
        this.$refs.commentSidebar.closeSidebar();
      }
    },

    // Quando clica no PDF para criar um novo comentário
    handleAddAnnotation(annotation) {
      this.pendingAnnotation = {
        ...annotation,
        id: Date.now(),
        text: "",
        createdAt: new Date(),
      };

      // Abre o sidebar em modo de criação
      this.$refs.commentSidebar.openForNewComment(
        this.pendingAnnotation,
        "Criar Comentário",
      );
    },

    // Quando clica em um marcador existente
    handleAnnotationClick({ annotation, position }) {
      // Abre o sidebar em modo de VISUALIZAÇÃO (não edição direta)
      this.$refs.commentSidebar.openForView(annotation); // Mudou de openForEdit para openForView
    },

    // Salva comentário vindo do sidebar
    // Salva comentário vindo do sidebar
    // Salva comentário vindo do sidebar
    saveCommentFromSidebar(commentData) {
      if (!this.selectedFile) return;

      if (
        commentData.id &&
        this.selectedFile.annotations.find((a) => a.id === commentData.id)
      ) {
        // Atualiza comentário existente
        const index = this.selectedFile.annotations.findIndex(
          (a) => a.id === commentData.id,
        );
        if (index !== -1) {
          this.selectedFile.annotations[index] = {
            ...this.selectedFile.annotations[index],
            text: commentData.text,
            updatedAt: new Date(),
          };
        }
      } else {
        // Adiciona novo comentário
        const newComment = {
          ...this.pendingAnnotation,
          text: commentData.text,
          id: Date.now(),
          createdAt: new Date(),
        };

        this.selectedFile.annotations.push(newComment);
        this.pendingAnnotation = null;
      }

      // 🔥 MUDANÇA AQUI: use redrawAnnotationsOnly em vez de rerenderAllPages
      // Isso apenas redesenha os círculos, sem recriar o PDF
      this.$refs.pdfViewerRef?.redrawAnnotationsOnly();
    },

    // Deleta um comentário
    deleteComment(commentId) {
      if (!this.selectedFile) return;

      const index = this.selectedFile.annotations.findIndex(
        (a) => a.id === commentId,
      );
      if (index !== -1) {
        this.selectedFile.annotations.splice(index, 1);

        // Fecha o sidebar se estiver aberto
        this.$refs.commentSidebar.closeSidebar();

        // Força re-renderização das anotações
        tthis.$refs.pdfViewerRef?.redrawAnnotationsOnly();
      }
    },

    updateZoom() {
      // O zoom é gerenciado pelo PdfViewer via prop
      // Força re-renderização se necessário
      this.$refs.pdfViewerRef?.redrawAnnotationsOnly();
    },

    resetZoom() {
      this.zoomLevel = 1.0;
      this.$refs.pdfViewerRef?.redrawAnnotationsOnly();
    },
  },
};
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

/* Ajustes para tela cheia */
.fixed {
  position: fixed;
}

.z-50 {
  z-index: 50;
}

.comment-preview {
  word-wrap: break-word;
  white-space: normal;
  line-height: 1.3;
}

/* Estilização do slider (input range) */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

input[type="range"]:focus {
  outline: none;
}
</style>
