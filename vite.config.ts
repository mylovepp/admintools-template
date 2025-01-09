import { federation } from "@module-federation/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { dependencies } from "./package.json";

export default defineConfig(() => ({
	server: { port: {{port}} },
	build: {
		target: "chrome89"
	},
	plugins: [
		federation({
			filename: "remoteEntry.js",
			name: "{{app-name}}",
			exposes: {
				"./{{default-route}}": "./src/App.tsx"
			},
			remotes: {},
			shared: {
				react: {
					requiredVersion: dependencies.react,
					singleton: true
				}
			}
		}),
		react()
	]
}));
