<template>
  <div class="pdf-viewer-container h-full flex flex-col">
    <div v-if="loading" class="p-4 text-center">
      <div class="inline-flex items-center gap-2">
        <div
          class="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"
        ></div>
        <span>Carregando PDF...</span>
      </div>
    </div>
    <div v-if="error" class="p-4 text-red-600 bg-red-50 m-4 rounded">
      {{ error }}
    </div>
    <div ref="containerRef" class="flex-1 overflow-y-auto p-4">
      <div
        v-for="(pageNum, idx) in pages"
        :key="`page-${pageNum}-${renderKey}`"
        class="page-wrapper mb-6 flex justify-center"
      >
        <canvas
          :id="`canvas-${idx}`"
          class="shadow-lg rounded"
          @click="handleClick($event, idx)"
        ></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import * as pdfjsLib from "pdfjs-dist";
import { markRaw } from "vue";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default {
  name: "PdfViewer",
  props: {
    pdfUrl: { type: String, required: true },
    comments: { type: Array, default: () => [] },
    zoomLevel: { type: Number, default: 1.0 },
  },
  data() {
    return {
      loading: false,
      error: null,
      pages: [],
      pdfDoc: null,
      isMounted: false,
      renderKey: 0,
      isRendering: false,
      resizeTimer: null,
    };
  },
  mounted() {
    this.isMounted = true;
    this.$nextTick(() => this.loadPDF(this.pdfUrl));
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    this.isMounted = false;
    if (this.resizeTimer) clearTimeout(this.resizeTimer);
    window.removeEventListener("resize", this.handleResize);
    if (this.pdfDoc) this.pdfDoc.destroy();
  },
  watch: {
    pdfUrl(newUrl) {
      if (newUrl && this.isMounted) this.loadPDF(newUrl);
    },
    zoomLevel(newZoom, oldZoom) {
      if (this.pdfDoc && this.isMounted && newZoom !== oldZoom) {
        this.rerenderAllPages();
      }
    },
    comments: {
      handler() {
        if (!this.pdfDoc || !this.isMounted) return;

        // 🔥 SEMPRE usa redrawAnnotationsOnly para comentários
        // Não importa se é o primeiro ou centésimo comentário
        this.redrawAnnotationsOnly();
      },
      deep: true,
    },
  },
  methods: {
    handleClick(event, index) {
      const canvas = event.target;
      const rect = canvas.getBoundingClientRect();

      const clickX = (event.clientX - rect.left) / rect.width;
      const clickY = (event.clientY - rect.top) / rect.height;

      const pageNumber = index + 1;

      // Detecta se clicou em algum comentário existente
      const CLICK_RADIUS = 0.04; // 4% do canvas para facilitar clique
      const found = (this.comments || []).find((a) => {
        if (a.page !== pageNumber) return false;
        const dx = Math.abs(a.x - clickX);
        const dy = Math.abs(a.y - clickY);
        return Math.sqrt(dx * dx + dy * dy) < CLICK_RADIUS;
      });

      if (found) {
        // Emite evento com o comentário encontrado
        this.$emit("annotation-clicked", {
          annotation: found,
          position: {
            x: event.clientX,
            y: event.clientY,
          },
        });
        return;
      }

      // Se não clicou em comentário existente, cria novo
      this.$emit("add-annotation", {
        page: pageNumber,
        x: clickX,
        y: clickY,
      });
    },

    async loadPDF(url) {
      if (!this.isMounted) return;
      this.loading = true;
      this.error = null;
      this.pages = [];

      try {
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;
        if (!this.isMounted) return;

        this.pdfDoc = markRaw(pdf);
        this.pages = Array.from({ length: pdf.numPages }, (_, i) => i + 1);
        await this.$nextTick();
        await this.renderAllPages();
      } catch (err) {
        console.error("Erro ao carregar PDF:", err);
        this.error =
          "Erro ao carregar o PDF. Verifique se o arquivo é válido e tente novamente.";
      } finally {
        this.loading = false;
      }
    },

    async renderAllPages() {
      if (!this.pdfDoc || !this.isMounted) return;

      for (let i = 0; i < this.pages.length; i++) {
        try {
          const page = await this.pdfDoc.getPage(this.pages[i]);
          await this.renderPage(page, i);
        } catch (err) {
          console.error(`Erro ao renderizar página ${i + 1}:`, err);
        }
      }
    },

    async renderPage(page, index, retryCount = 0) {
      const MAX_RETRIES = 5;
      const canvas = document.getElementById(`canvas-${index}`);
      const container = this.$refs.containerRef;

      if ((!canvas || !container) && retryCount < MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, 50));
        return this.renderPage(page, index, retryCount + 1);
      }

      if (!canvas || !container) {
        console.error(`Canvas não encontrado para página ${index + 1}`);
        return;
      }

      try {
        const containerWidth = container.clientWidth - 48;
        let baseWidth = Math.min(containerWidth, 1000);
        const scaledWidth = baseWidth * this.zoomLevel;
        const originalViewport = page.getViewport({ scale: 1 });
        const scale = scaledWidth / originalViewport.width;
        const viewport = page.getViewport({ scale: scale });

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;

        const context = canvas.getContext("2d");
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";
        context.clearRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvasContext: context, viewport }).promise;

        this.renderAnnotations(index, canvas);
      } catch (err) {
        console.error(`Erro ao renderizar página ${index + 1}:`, err);
      }
    },

    redrawAnnotationsOnly() {
      if (!this.isMounted) return;

      // 🔥 Não recria os canvases, apenas redesenha as anotações por cima
      for (let i = 0; i < this.pages.length; i++) {
        const canvas = document.getElementById(`canvas-${i}`);
        if (canvas) {
          this.renderAnnotations(i, canvas);
        }
      }
    },

    renderAnnotations(pageIndex, canvas) {
      const pageNumber = pageIndex + 1;
      const annotations = this.comments || [];
      const ctx = canvas.getContext("2d");

      annotations
        .filter((a) => a.page === pageNumber)
        .forEach((a) => {
          const x = a.x * canvas.width;
          const y = a.y * canvas.height;

          ctx.save();

          ctx.shadowBlur = 4;
          ctx.shadowColor = "rgba(0,0,0,0.3)";

          ctx.beginPath();
          ctx.arc(x, y, 8, 0, 2 * Math.PI);
          ctx.fillStyle = "#ef4444";
          ctx.fill();

          ctx.beginPath();
          ctx.arc(x, y, 8, 0, 2 * Math.PI);
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2.5;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(x, y, 2, 0, 2 * Math.PI);
          ctx.fillStyle = "#ffffff";
          ctx.fill();

          ctx.restore();
        });
    },

    async rerenderAllPages() {
      if (!this.pdfDoc || !this.isMounted || this.isRendering) return;

      const container = this.$refs.containerRef;
      const savedScrollTop = container ? container.scrollTop : 0;

      this.isRendering = true;

      try {
        this.renderKey++;
        await this.$nextTick();
        await this.renderAllPages();

        if (container && savedScrollTop > 0) {
          await this.$nextTick();
          container.scrollTop = savedScrollTop;
        }
      } catch (err) {
        console.error("Erro ao re-renderizar páginas:", err);
      } finally {
        this.isRendering = false;
      }
    },

    handleResize() {
      if (this.resizeTimer) clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        if (this.pdfDoc && this.isMounted) {
          this.rerenderAllPages();
        }
      }, 150);
    },
  },
};
</script>

<style scoped>
/* Seu estilo atual permanece igual */
.pdf-viewer-container {
  background: #f3f4f6;
}

.page-wrapper canvas {
  display: block;
  cursor: pointer;
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -2px rgb(0 0 0 / 0.1);
  border-radius: 0.5rem;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #e5e7eb;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #9ca3af;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
