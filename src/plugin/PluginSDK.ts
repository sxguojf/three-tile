/**
 * 插件接口，各插件必须实现此接口
 */
export interface IPlugin {
	name?: string;
	author?: string;
	description?: string;
	install(options?: any): Promise<void>;
}

/** use 函数声明 */
type useFunction = Promise<(plugin: IPlugin, options?: any) => useFunction>;

/** 插件列表 */
const plugins: IPlugin[] = [];

/**
 * 取得所有插件
 * @returns 插件列表
 */
export function getPlugins() {
	return plugins;
}

/**
 * 插件引入函数
 * @param plugin 插件实例
 * @param options 选项
 * @returns use函数
 */
export async function use<TOptions = any>(plugin: IPlugin, options?: TOptions): useFunction {
	if (plugins.includes(plugin)) {
		return use;
	}
	await plugin.install(options);
	plugins.push(plugin);
	return use;
}

/**
 * 插件抽象基类，采用模板方法模式简化插件开发，插件可继承此类实现doInstall方法
 */
export abstract class BasePlugin implements IPlugin {
	public name = "Base plugin";
	public author = "GuoJF";
	public description = "-";
	public async install(options?: any): Promise<void> {
		try {
			this.doInstall(options);
		} catch (err) {
			console.error("Plugin install errro: ", err);
			Promise.reject(err);
		}
		return Promise.resolve();
	}

	// 抽象方法，子类实现此方法完成插件初始化
	protected abstract doInstall(options: any): void;
}
