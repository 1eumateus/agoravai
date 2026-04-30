<template>
  <div>
    <!-- Backdrop -->
    <div v-if="isOpen" class="sidebar-backdrop" @click="closeSidebar"></div>

    <!-- Sidebar -->
    <div class="comment-sidebar" :class="{ 'is-open': isOpen }">
      <div class="sidebar-header">
        <h3 class="text-lg font-semibold text-gray-900">
          {{
            mode === "edit"
              ? "Editar Comentário"
              : mode === "view"
                ? "Comentário"
                : "Novo Comentário"
          }}
        </h3>
        <button @click="closeSidebar" class="text-gray-400 hover:text-gray-600">
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div class="sidebar-content">
        <div class="space-y-4">
          <!-- Informação da página -->
          <div class="text-sm text-gray-500 bg-gray-50 rounded-lg p-2">
            📄 Página {{ currentPage }}
          </div>

          <!-- Modo VISUALIZAÇÃO -->
          <div v-if="mode === 'view' && currentComment">
            <div class="comment-display bg-gray-50 rounded-lg p-4">
              <p class="text-gray-700 whitespace-pre-wrap break-words">
                {{ currentComment.text || "Sem texto" }}
              </p>
            </div>
            <button
              @click="enterEditMode"
              class="w-full mt-3 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 py-2 rounded flex items-center justify-center gap-2"
            >
              ✏️ Editar comentário
            </button>
          </div>

          <!-- Modo EDIÇÃO/CRIAÇÃO -->
          <div v-else>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Seu comentário
              </label>
              <textarea
                v-model="commentText"
                :placeholder="
                  mode === 'edit'
                    ? 'Edite seu comentário...'
                    : 'Digite seu comentário aqui...'
                "
                rows="6"
                class="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 resize-y"
                :class="{ 'border-red-300': error }"
              ></textarea>
              <p v-if="error" class="text-xs text-red-500 mt-1">
                Por favor, digite um comentário
              </p>
            </div>

            <div
              v-if="mode === 'edit' && currentComment?.createdAt"
              class="text-xs text-gray-400 border-t pt-2"
            >
              <div>
                📅 Criado em: {{ formatDate(currentComment.createdAt) }}
              </div>
              <div v-if="currentComment.updatedAt">
                ✏️ Atualizado em: {{ formatDate(currentComment.updatedAt) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="sidebar-footer">
        <div v-if="mode !== 'view'">
          <div class="flex gap-2">
            <button
              v-if="mode === 'edit'"
              @click="deleteComment"
              class="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded"
            >
              🗑️ Excluir
            </button>
            <button
              @click="saveComment"
              class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded"
            >
              💾 {{ mode === "edit" ? "Salvar" : "Criar" }}
            </button>
          </div>
          <button
            @click="closeSidebar"
            class="w-full mt-2 text-gray-500 hover:text-gray-700 text-sm py-1"
          >
            Cancelar
          </button>
        </div>
        <button
          v-else
          @click="closeSidebar"
          class="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded"
        >
          Fechar
        </button>
      </div>
    </div>

    <!-- Toast -->
    <div v-if="toast.show" class="toast-notification" :class="toast.type">
      <div class="flex items-center gap-2">
        <span>{{ toast.type === "success" ? "✅" : "❌" }}</span>
        <span>{{ toast.message }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CommentSidebar",
  data() {
    return {
      isOpen: false,
      mode: "new",
      currentComment: null,
      pendingComment: null,
      commentText: "",
      error: false,
      toast: { show: false, message: "", type: "success", timeout: null },
    };
  },
  computed: {
    currentPage() {
      if (this.mode === "edit" && this.currentComment)
        return this.currentComment.page;
      if (this.mode === "view" && this.currentComment)
        return this.currentComment.page;
      if (this.mode === "new" && this.pendingComment)
        return this.pendingComment.page;
      return "?";
    },
  },
  methods: {
    showToast(message, type = "success") {
      if (this.toast.timeout) clearTimeout(this.toast.timeout);
      this.toast = { show: true, message, type, timeout: null };
      this.toast.timeout = setTimeout(() => {
        this.toast.show = false;
      }, 3000);
    },
    openForNewComment(comment) {
      this.mode = "new";
      this.pendingComment = comment;
      this.currentComment = null;
      this.commentText = "";
      this.error = false;
      this.isOpen = true;
    },
    openForView(comment) {
      this.mode = "view";
      this.currentComment = comment;
      this.pendingComment = null;
      this.commentText = "";
      this.error = false;
      this.isOpen = true;
    },
    enterEditMode() {
      this.mode = "edit";
      this.commentText = this.currentComment?.text || "";
    },
    closeSidebar() {
      this.isOpen = false;
      this.currentComment = null;
      this.pendingComment = null;
      this.commentText = "";
      this.error = false;
    },
    saveComment() {
      if (!this.commentText.trim()) {
        this.error = true;
        return;
      }
      this.error = false;

      if (this.mode === "edit" && this.currentComment) {
        // Edição: atualiza e volta para visualização
        const updatedComment = {
          ...this.currentComment,
          text: this.commentText,
          updatedAt: new Date(),
        };
        this.$emit("save-comment", updatedComment);
        this.showToast("Comentário atualizado!");
        this.currentComment = updatedComment;
        this.mode = "view";
      } else if (this.mode === "new" && this.pendingComment) {
        // Criação: cria o comentário e já mostra em modo view
        const newComment = {
          ...this.pendingComment,
          text: this.commentText,
          id: Date.now(),
          createdAt: new Date(),
        };
        this.$emit("save-comment", newComment);
        this.showToast("Comentário criado!");

        // 👇 PARTE IMPORTANTE: Mantém o sidebar aberto mostrando o comentário
        this.currentComment = newComment;
        this.pendingComment = null;
        this.mode = "view";
        this.commentText = "";
      }
    },
    // Novo método para atualizar após criação
    updateAfterCreate(commentWithId) {
      if (this.mode === "new" && commentWithId) {
        this.currentComment = commentWithId;
        this.mode = "view";
        this.pendingComment = null;
        this.commentText = "";
      }
    },
    deleteComment() {
      if (this.currentComment?.id && confirm("Excluir este comentário?")) {
        this.$emit("delete-comment", this.currentComment.id);
        this.showToast("Comentário excluído!");
        this.closeSidebar();
      }
    },
    formatDate(date) {
      if (!date) return "";
      const d = new Date(date);
      return (
        d.toLocaleDateString("pt-BR") + " " + d.toLocaleTimeString("pt-BR")
      );
    },
  },
};
</script>

<style scoped>
.sidebar-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 999;
  animation: fadeIn 0.2s ease;
}

.comment-sidebar {
  position: fixed;
  right: 0;
  top: 0;
  width: 420px;
  height: 100vh;
  background: white;
  box-shadow: -2px 0 12px rgba(0, 0, 0, 0.15);
  transform: translateX(100%);
  transition: transform 0.3s ease-in-out;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.comment-sidebar.is-open {
  transform: translateX(0);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.sidebar-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.sidebar-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
  flex-shrink: 0;
}

.comment-display {
  max-height: 400px;
  overflow-y: auto;
  word-wrap: break-word;
  word-break: break-word;
  white-space: pre-wrap;
}

.break-words {
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
}

textarea {
  resize: vertical;
  min-height: 100px;
}

.toast-notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: white;
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 2000;
  animation: slideIn 0.3s ease;
  font-size: 14px;
  font-weight: 500;
}

.toast-notification.success {
  border-left: 4px solid #10b981;
  color: #065f46;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.sidebar-content::-webkit-scrollbar,
.comment-display::-webkit-scrollbar {
  width: 6px;
}

.sidebar-content::-webkit-scrollbar-track,
.comment-display::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.sidebar-content::-webkit-scrollbar-thumb,
.comment-display::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}
</style>
