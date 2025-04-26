import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { Camera, Object3D, Scene, WebGLRenderer } from "three";
import { HueSaturationShader, BrightnessContrastShader, ShaderPass, RenderPass } from "three/examples/jsm/Addons.js";

export class Filter {
	private _scene: Scene;
	private _camera: Camera;
	private _renderer: WebGLRenderer;
	private _hueSaturationPass: ShaderPass;
	private _brightnessContrastPass: ShaderPass;

	public mainComposer: EffectComposer;
	public filterComposer: EffectComposer;
	private _filterObject?: Object3D;
	public set filterObject(value: Object3D | undefined) {
		this._filterObject = value;
		// this._filterObject?.traverse(child => {
		// 	child.layers.set(1);
		// });
		// .layers.set(1);
	}
	public get filterObject() {
		return this._filterObject;
	}

	public set hue(value: number) {
		this._hueSaturationPass.uniforms.hue.value = value; // 色调
	}
	public get hue() {
		return this._hueSaturationPass.uniforms.hue.value; // 色调
	}

	public set saturation(value: number) {
		this._hueSaturationPass.uniforms.saturation.value = value; // 饱和度
	}

	public get brightness() {
		return this._brightnessContrastPass.uniforms.brightness.value; // 亮度
	}
	public set brightness(value: number) {
		this._brightnessContrastPass.uniforms.brightness.value = value; // 亮度
	}

	public get contrast() {
		return this._brightnessContrastPass.uniforms.contrast.value; // 对比度
	}
	public set contrast(value: number) {
		this._brightnessContrastPass.uniforms.contrast.value = value; // 对比度
	}

	public set enable(value: boolean) {
		this.mainComposer.passes.forEach(pass => (pass.enabled = value));
	}

	constructor(params: { scene: Scene; camera: Camera; renderer: WebGLRenderer }) {
		this._scene = params.scene;
		this._camera = params.camera;
		this._renderer = params.renderer;
		// 创建 EffectComposer
		const mainComposer = new EffectComposer(this._renderer);
		const filterComposer = new EffectComposer(this._renderer);

		// 第一步：渲染原始场景
		const renderPass = new RenderPass(this._scene, this._camera);
		mainComposer.addPass(renderPass);

		// 第二步：调整色调和饱和度
		this._hueSaturationPass = new ShaderPass(HueSaturationShader);
		filterComposer.addPass(new RenderPass(this._scene, this._camera));
		filterComposer.addPass(this._hueSaturationPass);

		// 第三步：调整亮度和对比度
		this._brightnessContrastPass = new ShaderPass(BrightnessContrastShader);
		filterComposer.addPass(this._brightnessContrastPass);

		// 监听窗口大小变化，调整 EffectComposer 的大小
		new ResizeObserver(() => {
			const width = this._renderer.domElement.clientWidth;
			const height = this._renderer.domElement.clientHeight;
			this.mainComposer.setSize(width, height);
			this.filterComposer.setSize(width, height);
		}).observe(this._renderer.domElement);

		this.mainComposer = mainComposer;
		this.filterComposer = filterComposer;
	}

	// public update() {
	// 	this._camera.layers.set(0);
	// 	this._mainComposer.render(); // 渲染场景
	// 	if (this.filterObject) {
	// 		this._renderer.autoClear = false; // 禁用自动清除
	// 		this._camera.layers.set(1);
	// 		this.filterObject.layers.set(1);
	// 		this._filtercomposer.render();
	// 	}
	// }
}
