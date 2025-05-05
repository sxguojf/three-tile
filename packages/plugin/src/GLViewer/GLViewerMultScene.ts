/**
 *@description: Threejs 3D scene initalize
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { Scene } from "three";

import { GLViewer } from "./GLViewer";

/**
 * Threejs mulitple scene initialize class
 */
export class GLViewerMultScene extends GLViewer {
	// 增加另一个场景
	public readonly topScene: Scene = new Scene();

	protected render() {
		// 禁止自动清除缓冲
		this.renderer.autoClear = false;
		// 手动清除缓冲
		this.renderer.clear();
		// 渲染默认场景
		this.renderer.render(this.scene, this.camera);
		// 清除深度缓冲，防止默认场景盖住后一个场景
		this.renderer.clearDepth();
		// 渲染另一个场景
		this.renderer.render(this.topScene, this.camera);
		// 开启自动清除缓冲
		this.renderer.autoClear = true;
	}
}
