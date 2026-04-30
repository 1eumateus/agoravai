<template>
  <div class="min-h-screen bg-indigo-100 flex flex-col">
    <!-- Menu superior (copiado do App.vue) -->
    <Menu :user="usuario" />
    <Breadcumbs />

    <!-- Conteúdo do PDF -->
    <div class="flex-1 flex flex-col">
      <div
        class="flex justify-between items-center p-3 bg-indigo-600 text-white"
      >
        <span class="font-bold text-lg">
          {{ file?.name || "Visualizador PDF" }}
        </span>
        <button
          @click="voltar"
          class="bg-red-500 hover:bg-red-600 px-4 py-1 rounded"
        >
          Voltar
        </button>
      </div>

      <div class="flex-1 overflow-hidden">
        <PdfViewer
          ref="pdfViewerRef"
          :pdfUrl="file?.url"
          :comments="annotations"
          :zoomLevel="zoomLevel"
          @add-annotation="handleAddAnnotation"
          @annotation-clicked="handleAnnotationClick"
        />
      </div>
    </div>

    <!-- Rodapé -->
    <Rodape />

    <!-- Sidebar de comentários -->
    <CommentSidebar
      ref="commentSidebar"
      @save-comment="saveComment"
      @delete-comment="deleteComment"
    />
  </div>
</template>

<script>
import PdfViewer from "@/components/pdfViewer.vue";
import CommentSidebar from "@/components/orientacao/CommentSidebar.vue";
import Menu from "@/components/Menu.vue";
import Breadcumbs from "@/components/Breadcumbs.vue";
import Rodape from "@/components/Rodape.vue";

export default {
  components: {
    PdfViewer,
    CommentSidebar,
    Menu,
    Breadcumbs,
    Rodape,
  },
  // ... resto do código igual
};
</script>
