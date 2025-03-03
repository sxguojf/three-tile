// /h:/MyApp/MyJs/three-tile/src/plugin/IPlugin.ts

export interface IPlugin {
	install(app: App, options: any[]): Promise<void>;
}

// /h:/MyApp/MyJs/three-tile/src/plugin/App.ts

export class App {
	private plugins: IPlugin[] = [];

	async use(plugin: IPlugin, ...options: any[]): Promise<this> {
		if (this.plugins.includes(plugin)) {
			return this;
		}
		await plugin.install(this, options);
		this.plugins.push(plugin);
		return this;
	}
}

// /h:/MyApp/MyJs/three-tile/src/plugin/ExamplePlugin.ts

export class ExamplePlugin implements IPlugin {
	async install(app: App, options: any[]): Promise<void> {
		// Perform async initialization here
		await new Promise((resolve) => setTimeout(resolve, 1000));
		console.log("ExamplePlugin installed with options:", options);
	}
}

// /h:/MyApp/MyJs/three-tile/src/main.ts

async function main() {
	const app = new App();
	const plugin = new ExamplePlugin();
	await app.use(plugin, { someOption: true });
	console.log("App initialized with plugins");
}

main();
