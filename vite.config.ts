import { federation } from "@module-federation/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { dependencies } from "./package.json";

export default defineConfig(() => ({
	server: { port: 3001 },
	build: {
		target: "chrome89"
	},
	plugins: [
		federation({
			filename: "remoteEntry.js",
			name: "{{app-name}}",
			exposes: {
				"./home": "./src/App.tsx"
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
