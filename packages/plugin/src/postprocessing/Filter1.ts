import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { Camera, Scene, WebGLRenderer } from "three";
import { HueSaturationShader, BrightnessContrastShader, ShaderPass, RenderPass } from "three/examples/jsm/Addons.js";
import { CopyShader } from "three/examples/jsm/shaders/CopyShader.js";

// 自定义滤镜着色器
const filterShader = {
	uniforms: {
		tDiffuse: { value: null }, // 必须的输入纹理
		brightness: { value: 1.0 },
		contrast: { value: 1.0 },
		hue: { value: 0.0 },
		saturation: { value: 1.0 },
	},
	vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
	fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float brightness;
    uniform float contrast;
    uniform float hue;
    uniform float saturation;
    
    varying vec2 vUv;
    
    // RGB 转 HSL
    vec3 rgb2hsl(vec3 c) {
      float cmax = max(c.r, max(c.g, c.b));
      float cmin = min(c.r, min(c.g, c.b));
      float delta = cmax - cmin;
      vec3 hsl = vec3(0.0);
      hsl.z = (cmax + cmin) * 0.5;
      if (delta > 0.0) {
        hsl.y = delta / (1.0 - abs(2.0 * hsl.z - 1.0));
        if (cmax == c.r) hsl.x = mod((c.g - c.b) / delta / 6.0, 1.0);
        else if (cmax == c.g) hsl.x = ((c.b - c.r) / delta + 2.0) / 6.0;
        else hsl.x = ((c.r - c.g) / delta + 4.0) / 6.0;
      }
      return hsl;
    }
    
    // HSL 转 RGB
    vec3 hsl2rgb(vec3 hsl) {
      vec3 rgb = clamp(abs(mod(hsl.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
      return hsl.z + hsl.y * (rgb - 0.5) * (1.0 - abs(2.0 * hsl.z - 1.0));
    }
    
    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      vec3 finalColor = color.rgb;
      
      // 亮度调整
      finalColor *= brightness;
      
      // 对比度调整
      finalColor = (finalColor - 0.5) * contrast + 0.5;
      
      // 色调和饱和度调整
      vec3 hsl = rgb2hsl(finalColor);
      hsl.x = mod(hsl.x + hue, 1.0);
      hsl.y *= saturation;
      finalColor = hsl2rgb(hsl);
      
      gl_FragColor = vec4(finalColor, color.a);
    }
  `,
};

export class Fillter {
	public scene: Scene;
	public camera: Camera;
	public renderer: WebGLRenderer;
	// public filterPass: ShaderPass;
	public composer: EffectComposer;

	constructor(scene: Scene, camera: Camera, renderer: WebGLRenderer) {
		this.scene = scene;
		this.camera = camera;
		this.renderer = renderer;
		// 创建 EffectComposer
		this.composer = new EffectComposer(renderer);

		// 第一步：渲染原始场景
		const renderPass = new RenderPass(scene, camera);
		this.composer.addPass(renderPass);

		const effectCopy = new ShaderPass(CopyShader);
		effectCopy.renderToScreen = true;

		// 第二步：添加滤镜
		const hueSaturationPass = new ShaderPass(HueSaturationShader);
		// this.filterPass.uniforms.brightness.value = 10;
		// this.filterPass.uniforms.contrast.value = 0.5;
		hueSaturationPass.uniforms.hue.value = 0; // 色调
		hueSaturationPass.uniforms.saturation.value = 0.5; // 饱和度
		// hueSaturationPass.renderToScreen = false;

		this.composer.addPass(hueSaturationPass);

		const brightnessContrastPass = new ShaderPass(BrightnessContrastShader);
		brightnessContrastPass.uniforms.brightness.value = 0.5; // 亮度
		brightnessContrastPass.uniforms.contrast.value = 0.6; // 对比度
		this.composer.addPass(brightnessContrastPass);
	}

	public update() {
		this.composer.render(); // 渲染场景
	}
}
