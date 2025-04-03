export * from "./debugLoader";
export * from "./logoLoader";
export * from "./normalLoder";
export * from "./wireframeLoader";
export * from "./singleImageLoader";
export * from "./singleTifDEMLoader";
export * from "./compass";
export * as mapSource from "./mapSource";

// import { plugin } from "three-tile";

// export namespace plugin {}
import "three-tile"; // 确保导入原始类型

declare module "three-tile" {
	namespace plugin {
		// 在这里添加你的函数声明
		function myCustomFunction(param: string): void;
		const myCustomConstant: number;

		// 或者添加接口/类等
		interface MyCustomInterface {
			prop: string;
		}
	}
}
