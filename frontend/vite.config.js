import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from "path";

const projectRootDir = path.resolve(__dirname);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      // Para poder utilizar @components ao invés de ../../../../components
      { "find": "@components", "replacement": path.resolve(projectRootDir, 'src/components') },
      { "find": "@", "replacement": path.resolve(projectRootDir, 'src') },  
    ],
  },
  base: 'ui'
});