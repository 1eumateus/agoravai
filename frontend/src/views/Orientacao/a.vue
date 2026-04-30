<!-- <style scoped></style>

<template>
  <div>
    <input type="file" accept="application/pdf" @change="handleFileChange" />

    <PdfViewer v-if="pdfUrl" :pdfUrl="pdfUrl" />
    <p v-else>Selecione um arquivo PDF para visualizar</p>
  </div>
</template>

<script>
import PdfViewer from "../../components/pdfViewer.vue";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "a",
  components: {
    PdfViewer,
  },
  data() {
    return {
      pdfUrl: null,
    };
  },
  methods: {
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file && file.type === "application/pdf") {
        // Remove a URL anterior se existir
        if (this.pdfUrl) {
          URL.revokeObjectURL(this.pdfUrl);
        }
        // Cria nova URL a partir do arquivo
        this.pdfUrl = URL.createObjectURL(file);
      } else {
        alert("Por favor, selecione um arquivo PDF válido.");
        this.pdfUrl = null;
      }
    },
  },
  // beforeDestroy() {
  //   // Limpa a URL quando o componente for destruído
  //   if (this.pdfUrl) {
  //     URL.revokeObjectURL(this.pdfUrl);
  //   }
  // },
};
</script>

<style scoped>
/* Seus estilos aqui */
</style> -->
