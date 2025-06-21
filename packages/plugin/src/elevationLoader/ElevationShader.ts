import { Color, ShaderMaterial, UniformsLib, UniformsUtils } from "three";

export class ElevationShader extends ShaderMaterial {
	/** 获取最小高度 */
	public get minHeight(): number {
		return this.uniforms.uMinHeight.value;
	}
	/** 获取最大高度 */
	public get maxHeight(): number {
		return this.uniforms.uMaxHeight.value;
	}
	/** 设置最小高度 */
	public set minHeight(value: number) {
		this.uniforms.uMinHeight.value = value;
	}
	/** 设置最大高度 */
	public set maxHeight(value: number) {
		this.uniforms.uMaxHeight.value = value;
	}

	constructor(minH: number, maxH: number) {
		super({
			name: "EleatorShader",
			uniforms: UniformsUtils.merge([
				{
					uMinHeight: { value: minH },
					uMaxHeight: { value: maxH },
					uWaterColor: { value: new Color(0.1, 0.3, 0.7) },
					uSandColor: { value: new Color(0.76, 0.7, 0.5) },
					uGrassColor: { value: new Color(0.3, 0.6, 0.2) },
					uRockColor: { value: new Color(0.5, 0.4, 0.3) },
					uSnowColor: { value: new Color(0.95, 0.95, 1.0) },
				},
				UniformsLib.common,
				UniformsLib.lights,
				UniformsLib.fog,
				{
					// 可以添加自定义uniforms
				},
			]),
			vertexShader: /* glsl */ `
                precision highp float;

                #include <common>
                #include <fog_pars_vertex>
                #include <logdepthbuf_pars_vertex>

                varying vec3 vNormal;
                varying vec3 vViewPosition;
                varying float vHeight;

                void main() {
                    #include <begin_vertex>
                    #include <project_vertex>
                    #include <logdepthbuf_vertex>

                    vHeight = position.z;
                    vNormal = normalize(normalMatrix * normal);
                    vViewPosition = -mvPosition.xyz;

                    #include <fog_vertex>
                    #include <logdepthbuf_vertex>

                }

            `,
			fragmentShader: /* glsl */ `
                precision highp float;

                #include <common>
                #include <fog_pars_fragment>
                #include <logdepthbuf_pars_fragment>

                varying float vHeight;

                varying vec3 vNormal;
                varying vec3 vViewPosition;

                uniform float uMinHeight;
                uniform float uMaxHeight;
                uniform vec3 uWaterColor;
                uniform vec3 uSandColor;
                uniform vec3 uGrassColor;
                uniform vec3 uRockColor;
                uniform vec3 uSnowColor;

                // 平滑过渡函数
                float smoothBlend(float edge0, float edge1, float x) {
                    float t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
                    return t * t * (3.0 - 2.0 * t);
                }

                void main() {
                    #include <logdepthbuf_fragment>

                    // 归一化高度 (0到1之间)
                    float normalizedHeight = (vHeight - uMinHeight) / (uMaxHeight - uMinHeight);

                    // 定义各高度段的阈值
                    float waterLevel = 0.2;
                    float sandLevel = 0.3;
                    float grassLevel = 0.6;
                    float rockLevel = 0.85;

                    // 根据高度混合颜色
                    vec3 color;

                    if(normalizedHeight < waterLevel) {
                        // 水区域 - 深蓝色到浅蓝色
                        float t = smoothBlend(0.0, waterLevel, normalizedHeight);
                        color = mix(uWaterColor * 0.5, uWaterColor, t);
                    } else if(normalizedHeight < sandLevel) {
                        // 沙滩区域 - 浅蓝色到沙色
                        float t = smoothBlend(waterLevel, sandLevel, normalizedHeight);
                        color = mix(uWaterColor, uSandColor, t);
                    } else if(normalizedHeight < grassLevel) {
                        // 草地区域 - 沙色到绿色
                        float t = smoothBlend(sandLevel, grassLevel, normalizedHeight);
                        color = mix(uSandColor, uGrassColor, t);
                    } else if(normalizedHeight < rockLevel) {
                        // 岩石区域 - 绿色到棕色
                        float t = smoothBlend(grassLevel, rockLevel, normalizedHeight);
                        color = mix(uGrassColor, uRockColor, t);
                    } else {
                        // 雪地区域 - 棕色到白色
                        float t = smoothBlend(rockLevel, 1.0, normalizedHeight);
                        color = mix(uRockColor, uSnowColor, t);
                    }

                    // 添加简单光照效果（基于法线）
                    vec3 lightDir = normalize(vec3(0.5, 1.0, 0.5));
                    float diffuse = dot(vNormal, lightDir) * 0.5 + 0.5;
                    color *= diffuse;

                    gl_FragColor = vec4(color, 1.0);

                    #include <fog_fragment>
                }
            `,
			transparent: false,
			fog: true,
		});
	}
	public copy(material: this): this {
		this.uniforms = material.uniforms;
		return this;
	}
}
