/**
 *@description: tile material,
 *@author: 郭江峰
 *@date: 2023-04-06
 */

import {
	Color,
	Matrix4,
	MeshStandardMaterialParameters,
	ShaderLib,
	ShaderMaterial,
	UniformsLib,
	UniformsUtils,
} from "three";
// import frag from "./tile.frag.glsl?raw";
// import vert from "./tile.vert.glsl?raw";

export type FilterType = {
	opposite: Matrix4;
	monochrome: { r: any; g: any; b: any };
	genBright: number;
	genContrast: number;
	genSaturate: number;
};

export interface TileMaterialParameters extends MeshStandardMaterialParameters {
	// map?: Texture | null | undefined;
	// map1?: Texture | null | undefined;
	// transparent?: boolean;
	// wireframe?: boolean;
	// diffuse?: Color;
	filter?: FilterType;
}

const vert = `
varying vec2 vUv;
uniform mat4 t_Matrix;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
const frag = `
//uniform sampler2D e_Texture;     //纹理图像
// varying vec2 vUv;               //片元纹理坐标
// uniform mat4 t_Matrix;     //接收变换矩阵

void main () {
  	gl_FragColor = vec4(1.0f,0.0f,0.0f,1.0f);    
`;

/**
 * Tile shade, include multiple textures and pixel to Z
 */
export class TileFilterMaterial extends ShaderMaterial {
	public filter: FilterType = {
		monochrome: { r: 0.3, g: 0.6, b: 0.1 },
		opposite: new Matrix4(), //反色
		genBright: 1,
		genContrast: 1,
		genSaturate: 1,
	};
	// public getTranMatrix(): any {
	// let tranMatrix = new Matrix4();

	// 	if (this.filter?.opposite) {
	// 		let oppositeMat = new Matrix4(); // 初始化一个 4x4 的矩阵用于反色处理
	// 		oppositeMat.set(-1, 0, 0, 0, 0, -1, 0, 0, 0, 0, -1, 0, 1, 1, 1, 1); // 设置矩阵的值以实现反色效果
	// 		tranMatrix.multiply(oppositeMat); // 将反色矩阵与当前的变换矩阵相乘
	// 	}

	// 	if (this.filter?.monochrome) {
	// 		let monochromeMat = new Matrix4(); // 初始化一个 4x4 的矩阵用于单色滤镜处理
	// 		const rmonoWeight = this.filter.monochrome.r;
	// 		const gmonoWeight = this.filter.monochrome.g;
	// 		const bmonoWeight = this.filter.monochrome.b;
	// 		monochromeMat.set(
	// 			rmonoWeight,
	// 			gmonoWeight,
	// 			bmonoWeight,
	// 			0, // Red channel
	// 			rmonoWeight,
	// 			gmonoWeight,
	// 			bmonoWeight,
	// 			0, // Green channel
	// 			rmonoWeight,
	// 			gmonoWeight,
	// 			bmonoWeight,
	// 			0, // Blue channel
	// 			0,
	// 			0,
	// 			0,
	// 			1
	// 		);
	// 		tranMatrix.multiply(monochromeMat);
	// 	}

	// 	if (this.filter?.genBright) {
	// 		let genBrightMat = new Matrix4(); //亮度
	// 		const genBright = this.filter.genBright; // 1 原色，  < 1 变暗， > 1 变亮
	// 		genBrightMat.set(genBright, 0, 0, 0, 0, genBright, 0, 0, 0, 0, genBright, 0, 0, 0, 0, 1);
	// 		tranMatrix.multiply(genBrightMat);
	// 	}

	// 	if (this.filter?.genContrast) {
	// 		let genContrastMat = new Matrix4(); //对比度
	// 		const genContrast1 = this.filter.genContrast; // 1 原色，  < 1 减弱对比度， > 1 增强对比度
	// 		const genContrast2 = 0.5 * (1 - genContrast1);
	// 		genContrastMat.set(
	// 			genContrast1,
	// 			0,
	// 			0,
	// 			0,
	// 			0,
	// 			genContrast1,
	// 			0,
	// 			0,
	// 			0,
	// 			0,
	// 			genContrast1,
	// 			0,
	// 			genContrast2,
	// 			genContrast2,
	// 			genContrast2,
	// 			1
	// 		);
	// 		tranMatrix.multiply(genContrastMat);
	// 	}

	// 	if (this.filter?.genSaturate) {
	// 		let genSaturateMat = new Matrix4(); //饱和度
	// 		const genSaturate = this.filter.genSaturate; // p = 0 完全灰度化，p = 1 原色，p > 1 增强饱和度。
	// 		const rWeight = 0.3 * (1 - genSaturate);
	// 		const gWeight = 0.6 * (1 - genSaturate);
	// 		const bWeight = 0.1 * (1 - genSaturate);
	// 		genSaturateMat.set(
	// 			rWeight + genSaturate,
	// 			rWeight,
	// 			rWeight,
	// 			0,
	// 			gWeight,
	// 			gWeight + genSaturate,
	// 			gWeight,
	// 			0,
	// 			bWeight,
	// 			bWeight,
	// 			bWeight + genSaturate,
	// 			0,
	// 			0,
	// 			0,
	// 			0,
	// 			1
	// 		);
	// 		tranMatrix.multiply(genSaturateMat);
	// 	}
	// 	return tranMatrix;
	// }
	public constructor(parameters?: TileMaterialParameters) {
		super({
			// vertexShader: vert,
			// fragmentShader: frag,
			// lights: true,
			// transparent: parameters?.transparent || true,
			// wireframe: parameters?.wireframe || false,
			// fog: true,
		});
		// debugger;
		this.filter = parameters?.filter || this.filter;
		this.vertexShader = vert;
		this.fragmentShader = frag;

		// this.uniforms = UniformsUtils.merge([
		// 	ShaderLib.lambert.uniforms,
		// 	{
		// 		t_Matrix: {
		// 			value: this.getTranMatrix(),
		// 		},
		// 	},
		// ]);
		// 	(this.uniforms.map.value = parameters.map);
		// this.uniforms.map1.value = parameters.map1;

		// this.defineProperty("map1");
		// this.defineProperty("diffuse");
		// this.defineProperty("opacity");
	}

	// public dispose(): void {
	// 	super.dispose();
	// }

	// defineProperty(propertyName: string) {
	// 	Object.defineProperty(this, propertyName, {
	// 		get: function () {
	// 			return this.uniforms[propertyName].value;
	// 		},
	// 		set: function (value) {
	// 			this.uniforms[propertyName].value = value;
	// 		},
	// 	});
	// }
}

// const vert = `;
// varying vec2 vUv;
// uniform vec3 bkColor;
// uniform vec3 airColor;

// void main() {
//     vUv = uv;
//     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
// }
// `;
// const frag = `
// varying vec2 vUv;
// uniform vec3 bkColor;
// uniform vec3 airColor;

// void main() {

//     // 当前点距中点的距离
//     float d = distance(vUv, vec2(0.5f));
//     d = d * d * 100.0f;

//     if(d<0.98f){
//         // 球体颜色
//         float a = smoothstep(0.0f,1.0f,d);
//         gl_FragColor = vec4(vec3(0.0f), a);
//     } else if(d<=1.0f){
//         float c = (d-0.98f)/(1.0f-0.98f);
//         gl_FragColor =vec4(mix(vec3(0.0f),airColor,c),1.0f);
//     } else if(d<=1.1f){
//         float c = (d-1.0f)/(1.1f-1.0f);
//         gl_FragColor = vec4(mix(airColor,bkColor,sqrt(c)),1.0f);
//     } else{
//         // 球体外颜色
//         gl_FragColor = vec4(bkColor,1.0f);
//     }

//     // #include <tonemapping_fragment>
//     // #include <encodings_fragment>
//     #include <colorspace_fragment>

// }
// `;

/**
 * a fake ball Material
 */
export class TileFilterMaterial1 extends ShaderMaterial {
	public constructor(parameters: { bkColor: Color; airColor: Color }) {
		super({
			uniforms: UniformsUtils.merge([
				UniformsLib.fog,
				{
					bkColor: {
						value: parameters.bkColor,
					},
					airColor: {
						value: parameters.airColor,
					},
				},
			]),
			transparent: true,
			depthTest: false,
			vertexShader: vert,
			fragmentShader: frag,
			lights: false,
		});
	}
}
