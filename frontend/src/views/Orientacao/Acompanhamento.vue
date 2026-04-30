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

      <div class="flex flex-1 overflow-hidden">
        <!-- PDF Viewer com zoom controlado -->
        <div class="flex-1 h-full overflow-auto">
          <PdfViewer
            ref="pdfViewerRef"
            :key="selectedPdfUrl"
            :pdfUrl="selectedPdfUrl"
            :comments="selectedFile?.comments || {}"
            :zoomLevel="zoomLevel"
          />
        </div>

        <!-- Painel de comentários (sidebar fixa) -->
        <div
          class="w-80 bg-white border-l flex flex-col shadow-lg flex-shrink-0"
        >
          <div class="p-3 bg-indigo-50 border-b">
            <h3 class="font-semibold text-indigo-900 flex items-center gap-2">
              <span>💬</span> Comentários
            </h3>
          </div>
          <div class="flex-1 overflow-y-auto p-3">
            <div
              v-if="(selectedFile?.commentsList || []).length === 0"
              class="text-gray-400 text-center text-sm py-4"
            >
              Nenhum comentário ainda
            </div>
            <div
              v-for="(c, index) in selectedFile?.commentsList || []"
              :key="index"
              class="text-sm border-b py-2 mb-2"
            >
              <p class="text-gray-800">{{ c.text }}</p>
              <span class="text-gray-400 text-[10px]">{{ c.date }}</span>
            </div>
          </div>
          <div class="p-3 border-t bg-white">
            <textarea
              v-model="newComment"
              placeholder="Digite um comentário..."
              rows="3"
              class="w-full border border-gray-300 p-2 rounded text-sm focus:outline-none focus:border-indigo-500"
            ></textarea>
            <button
              @click="addComment"
              class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded mt-2 transition-colors"
            >
              Enviar comentário
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PdfViewer from "../../components/pdfViewer.vue";

export default {
  name: "Acompanhamento",
  components: { PdfViewer },
  data() {
    return {
      file: [],
      selectedPdfUrl: null,
      selectedFile: null,
      viewing: false,
      newComment: "",
      zoomLevel: 1.0,
    };
  },
  methods: {
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file && file.type === "application/pdf") {
        this.file.push({
          name: file.name,
          date: new Date().toLocaleString(),
          url: URL.createObjectURL(file),
          comments: {},
          commentsList: [],
          annotations: [],
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
    viewPdf(file) {
      this.selectedPdfUrl = file.url;
      this.selectedFile = file;
      this.viewing = true;
      this.zoomLevel = 1.0;
    },
    closePdfViewer() {
      this.selectedPdfUrl = null;
      this.selectedFile = null;
      this.viewing = false;
      this.zoomLevel = 1.0;
    },
    addComment() {
      if (!this.newComment.trim() || !this.selectedFile) return;
      const comment = {
        text: this.newComment,
        date: new Date().toLocaleString(),
      };
      this.selectedFile.commentsList.push(comment);
      this.newComment = "";
    },
    updateZoom() {
      // Apenas atualiza o valor, o componente PdfViewer reage ao zoomLevel via watch
      if (this.$refs.pdfViewerRef) {
        this.$refs.pdfViewerRef.updateZoom(this.zoomLevel);
      }
    },
    resetZoom() {
      this.zoomLevel = 1.0;
      if (this.$refs.pdfViewerRef) {
        this.$refs.pdfViewerRef.updateZoom(1.0);
      }
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
