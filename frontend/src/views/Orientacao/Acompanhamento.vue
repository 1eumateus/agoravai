<template>
  <div class=" bg-indigo-100 w-full h-screen grid grid-flow-col-dense grid-cols-12 ">
    
    <div class="main-direito col-span-8 border-2 border-black flex flex-col items-center justify-center">
      <h3>Seu progresso</h3>
      <div class=" p-4 h-[700px] sm:w-[200px] md:w-[400px] lg:w-[850px]  ">
  
        <div class="overflow-x-auto ">      <!-- Tela de envio -->        
            <h3 class="mx-20">Arquivos enviados</h3>  
            <div class="bg-white overflow-y-auto max-h-[550px]">
              <table class="min-w-full table-auto  ">
                <tbody>
                  <tr v-for="(file, index) in file" :key="index" class="hover:bg-gray-300 cursor-pointer">
                    <td v-if="isPdf(file)" class="p-5">
                      <img src="/pdf.png" alt="Ícone PDF" class="w-10 h-10" />
                    </td>
                    <td v-if="isTxt(file)" class="p-5">
                      <img src="/txt.png" alt="Ícone TXT" class="w-10 h-10" />
                    </td>
                    <td class="p-5 flex border-b-2 border-gray-400">{{ file.name }}
                    </td>
                    <td class="p-5">{{ file.date }}</td>
                    <td class="p-5">
                      <button @click="removeFile(index)">
                        Remover
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class=" mt-2 grid grid-flow-col-dense gap-4 max-w-5xl justify-center">
              <div class="col-span-1 p-4">
                <label for="upload" class="cursor-pointer flex items-center">
                  <img src="/nuvem.png" alt="Ícone PDF" class="w-10 h-10 cursor-pointer"/>
                  <span class="ml-2 self-center">Clique aqui para enviar um novo arquivo</span>
                </label>
                <input  type="file" id="upload" @change="handleFileUpload" class="hidden" accept=".pdf, .txt"/>
              </div>
            </div>
            
        </div>
      </div>    
    </div>
    
    <div class="lado-esquerdo col-span-4 bg-indigo-200 border-2 border-black justify-center items-center flex">
      
      <div class="flex flex-col   bg-white shadow-lg rounded-lg p-5 border-2 border-black w-[500px]">
        <!-- Cabeçalho do Chat -->
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Chat - Professor & Aluno</h2>
          <span class="text-sm text-gray-500">Professor: João</span>
        </div>

        <!-- Mensagens do chat -->
        <div class="flex-1 overflow-y-auto mb-4" id="messages-container">
          <div v-for="(message, index) in messages" :key="index" :class="{'text-right': message.sender === 'aluno', 'text-left': message.sender === 'professor'}" class="mb-3">
            <div :class="{'bg-blue-200': message.sender === 'aluno', 'bg-green-200': message.sender === 'professor'}" class="inline-block p-3 rounded-lg max-w-xs">
              <p>{{ message.text }}</p>
            </div>
          </div>
        </div>

        <!-- Input de mensagem -->
        <div class="flex items-center">
          <input v-model="newMessage" @keyup.enter="sendMessage" class="border border-gray-300 p-2 rounded-md w-full mr-2" placeholder="Digite sua mensagem..." />
          <button @click="sendMessage" class="bg-blue-500 text-white py-2 px-4 rounded-md">Enviar</button>
        </div>
      </div>

      
    </div>
  </div>
  
</template>

<script >


    

    export default {
        name: 'Acompanhamento',
        data(){
          return{
            file:[],
            messages: [],
              
          }
        },
        methods:{
          handleFileUpload(event){
            const file=event.target.files[0];
            const currentDate = new Date().toLocaleDateString();
            if(file){
              this.file.push(
                {
                  name: file.name,
                  date: currentDate,
                });
            }
          },
          removeFile(index){
            this.file.splice(index,1);
          },
          formatSize(size){
            const units=['B','KB','MB','GB','TB'];
            let unitIndex=0;
            

            while(size>=1024 && unitIndex<units.length-1){
              size/=1024;
              unitIndex++;
            }
            return `${size.toFixed(2)} ${units[unitIndex]}`;
        },
        isPdf(file){
          return file.name.endsWith('.pdf');
        },
        isTxt(file){
          return file.name.endsWith('.txt');}
        },
         sendMessage() {
      if (this.newMessage.trim() !== "") {
        this.messages.push({
          sender: "aluno",
          text: this.newMessage
        });
        this.newMessage = ""; 
        this.scrollToBottom(); 
   
        setTimeout(() => {
          this.messages.push({
            sender: "professor",
            text: "Entendido, vou te ajudar com isso!"
          });
          this.scrollToBottom(); 
        }, 1500); 
      }
    },
    scrollToBottom() {
      const container = document.getElementById("messages-container");
      container.scrollTop = container.scrollHeight;
    }
  }

       

        
          
      

        
    
</script>

<style scoped>

</style>
