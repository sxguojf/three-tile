import { Color, ColorRepresentation, ShaderMaterial, UniformsLib, UniformsUtils } from "three";

export interface ContourShaderParameters {
	color: ColorRepresentation;
	interval: number;
	width: number;
}

export class ContourShader extends ShaderMaterial {
	constructor(parameters?: ContourShaderParameters) {
		super({
			name: "EleatorShader",
			uniforms: UniformsUtils.merge([
				{
					// 等高线颜色
					contourColor: { value: new Color(parameters?.color) },
					// 等高线间距
					contourInterval: { value: parameters?.interval },
					// 等高线宽度
					contourWidth: { value: parameters?.width },
				},
				UniformsLib.common,
				UniformsLib.lights,
				UniformsLib.fog,
			]),
			vertexShader: /* glsl */ `
                precision highp float;

                #include <common>
                #include <fog_pars_vertex>
                #include <logdepthbuf_pars_vertex>

                varying float vHeight;

                void main() {
                    #include <begin_vertex>
                    #include <project_vertex>
                    #include <logdepthbuf_vertex>

                    vHeight = position.z;

                    #include <fog_vertex>
                    #include <logdepthbuf_vertex>

                }

            `,
			fragmentShader: /* glsl */ `
                precision highp float;

                #include <common>
                #include <fog_pars_fragment>
                #include <logdepthbuf_pars_fragment>

                uniform vec3 contourColor;
                uniform float contourInterval;
                uniform float contourWidth;
                
                varying float vHeight;

                void main() {
                    #include <logdepthbuf_fragment>

                    float contourPos = mod(vHeight, contourInterval) / contourInterval;
                    float pixelWidth = contourWidth * fwidth(contourPos);                    
                    float distToEdge = min(contourPos, 1.0 - contourPos); 
                    float edgeFactor = smoothstep(0.0, pixelWidth, distToEdge/2.0); 
                    float alpha = smoothstep(0.0, 1.0, 1.0 - edgeFactor);
                    gl_FragColor = vec4(contourColor, alpha);
                    
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
