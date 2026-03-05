<template>
  <div class="bg-indigo-100 w-full h-screen grid grid-flow-col-dense grid-cols-12">
    <div class="main-direito col-span-8 border-2 border-black flex flex-col items-center justify-center">
      <h3>Seu progresso</h3>
      <div class="p-4 sm:w-[200px] md:w-[400px] lg:w-[850px]">
        <div class="overflow-x-auto border-2 border-black h-[650px]">
          <h3 class="mx-20">Arquivos enviados</h3>
          <div class="bg-white overflow-y-auto max-h-[450px]">
            <table class="min-w-full table-auto">
              <tbody>
                <tr v-for="(file, index) in file" :key="index" class="hover:bg-gray-300 cursor-pointer">
                  <td v-if="isDocx(file)" class="p-5">
                    <img src="/pdf.png" alt="Ícone DOCX" class="w-10 h-10" />
                  </td>
                  <td class="p-5 flex border-b-2 border-gray-400">{{ file.name }}</td>
                  <td class="p-5">{{ file.date }}</td>
                  <td class="p-5">
                    <button @click="removeFile(index)">
                      Remover
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            
            <!-- Mostrar conteúdo editável do DOCX -->
            <div v-if="docxContent">
              <textarea v-model="docxContent" class="w-full h-[300px]" placeholder="Edite o conteúdo aqui..."></textarea>
              <button @click="generateDoc" class="bg-green-500 text-white py-2 px-4 mt-2 rounded-md">Gerar Documento Editado</button>
            </div>
            
            <!-- Mostrar link para download do documento editado -->
            <div v-if="docxUrl">
              <a :href="docxUrl" target="_blank">Baixar Documento Editado</a>
            </div>
          </div>

          <div class="col-span-1 p-4 justify-center items-center flex flex-col">
            <label for="upload" class="cursor-pointer flex items-center">
              <img src="/nuvem.png" alt="Ícone PDF" class="w-10 h-10 cursor-pointer"/>
              <span class="ml-2 self-center">Clique aqui para enviar um novo arquivo</span>
            </label>
            <input type="file" id="upload" @change="handleFileUpload" class="hidden" accept=".docx"/>
          </div>
        </div>
      </div>
    </div>

    <!-- Lado Esquerdo: Chat -->
    <div class="lado-esquerdo col-span-4 bg-indigo-200 border-2 border-black justify-center items-center flex">
      <div class="flex flex-col bg-white shadow-lg rounded-lg p-5 border-2 border-black w-[500px] overflow-y-auto h-[500px]">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Chat - Professor & Aluno</h2>
          <span class="text-sm text-gray-500">Professor: João</span>
        </div>

        <div class="flex-1 overflow-y-auto mb-4" id="messages-container">
          <div v-for="(message, index) in messages" :key="index" :class="{'text-right': message.sender === 'aluno', 'text-left': message.sender === 'professor'}" class="mb-3">
            <div :class="{'bg-blue-200': message.sender === 'aluno', 'bg-green-200': message.sender === 'professor'}" class="inline-block p-3 rounded-lg max-w-xs">
              <p>{{ message.text }}</p>
            </div>
          </div>
        </div>

        <div class="flex items-center">
          <input v-model="newMessage" @keyup.enter="sendMessage" class="border border-gray-300 p-2 rounded-md w-full mr-2" placeholder="Digite sua mensagem..." />
          <button @click="sendMessage" class="bg-blue-500 text-white py-2 px-4 rounded-md">Enviar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Importar as bibliotecas necessárias
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

export default {
  name: 'Acompanhamento',
  data() {
    return {
      file: [],
      messages: [],
      docxContent: '', // Conteúdo do arquivo docx editável
      docxUrl: null,   // URL do arquivo gerado
      newMessage: "",
      path: [],
    };
  },
  methods: {
    // Função para fazer o upload do arquivo DOCX
    handleFileUpload(event) {
      const file = event.target.files[0];
      const currentDate = new Date().toLocaleDateString();
      if (file) {
        this.file.push({
          name: file.name,
          date: currentDate,
        });

        if (file.name.endsWith('.docx')) {
          // Carregar e exibir o conteúdo do arquivo DOCX
          const reader = new FileReader();
          reader.onload = (e) => {
            const zip = new PizZip(e.target.result);  // Lê o arquivo docx
            const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

            // Aqui assumimos que o documento tem algum marcador de texto, por exemplo: {{name}}
            // Obtemos os dados do documento e mostramos para edição
            const data = doc.getData();
            this.docxContent = `Conteúdo original: ${data.name || "Nenhum conteúdo encontrado"}`; // Ajuste conforme seu documento
          };
          reader.readAsArrayBuffer(file);
        }
      }
    },

    // Função para remover um arquivo
    removeFile(index) {
      this.file.splice(index, 1);
    },

    // Função para gerar o arquivo editado
    generateDoc() {
      if (this.docxContent) {
        const zip = new PizZip();
        const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

        // Substituir o conteúdo editado na variável
        doc.setData({ name: this.docxContent });

        try {
          doc.render();
          const out = doc.getZip().generate({ type: 'blob' });
          this.docxUrl = URL.createObjectURL(out); // Criar uma URL do arquivo editado
        } catch (error) {
          console.log('Erro ao gerar documento:', error);
        }
      }
    },

    // Função para enviar mensagens no chat
    sendMessage() {
      if (this.newMessage.trim() !== "") {
        this.messages.push({
          sender: "aluno",
          text: this.newMessage,
        });
        this.newMessage = ""; 
        this.scrollToBottom();

        setTimeout(() => {
          this.messages.push({
            sender: "professor",
            text: "Entendido, vou te ajudar com isso! aguarde um momento enquanto analiso o arquivo.",
          });
          this.scrollToBottom();
        }, 1500);
      }
    },

    // Função para rolar até o final das mensagens
    scrollToBottom() {
      const container = document.getElementById("messages-container");
      container.scrollTop = container.scrollHeight;
    },

    // Função para verificar se o arquivo é DOCX
    isDocx(file) {
      return file.name.endsWith('.docx');
    },
  },
};
</script>

<style scoped>
/* Estilos do componente */
</style>
