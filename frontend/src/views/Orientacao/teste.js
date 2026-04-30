import * as mammoth from 'mammoth';

// Função para processar o arquivo .docx e extrair texto
export function processDocx(file, callback) {
  const reader = new FileReader();

  reader.onload = function (e) {
    console.log("Arquivo carregado: ", file.name);

    // Usando mammoth para extrair texto do DOCX
    mammoth.extractRawText({ arrayBuffer: e.target.result })
      .then(function(result) {
        const text = result.value; // Texto extraído
        console.log("Texto extraído:", text.substring(0, 200) + "...");
        callback(text); // Passando o texto para o Vue
      })
      .catch(function(error) {
        console.error('Erro ao processar o documento:', error);
        callback('Erro ao processar o documento: ' + error.message);
      });
  };

  reader.onerror = function (error) {
    console.error("Erro ao ler o arquivo:", error);
    callback('Erro ao ler o arquivo');
  };

  reader.readAsArrayBuffer(file);
}