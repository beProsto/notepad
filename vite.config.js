import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	base: "/notepad/",
	root: path.join(__dirname, "src"),
	build: {
		outDir: path.join(__dirname, "dist"),
		rollupOptions: {
			input: {
				main: path.resolve(__dirname, 'src/index.html'),
			}
		},
	},
	plugins: [svelte()],
})
