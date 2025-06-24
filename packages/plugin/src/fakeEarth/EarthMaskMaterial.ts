/**
 *@description: Fake earth material
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { Color, ShaderMaterial } from "three";

/**
 * Fake ball material
 */
export class EarthMaskMaterial extends ShaderMaterial {
	public constructor(parameters: { bkColor: Color; airColor: Color }) {
		super({
			uniforms: {
				bkColor: {
					value: parameters.bkColor,
				},
				airColor: {
					value: parameters.airColor,
				},
			},
			transparent: true,
			depthTest: false,
			lights: false,
			vertexShader: /* glsl */ `
                varying vec2 vUv;
                uniform vec3 bkColor;
                uniform vec3 airColor;

                void main() {  
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);  
                }  
            `,
			fragmentShader: /* glsl */ `
                varying vec2 vUv;
                uniform vec3 bkColor;
                uniform vec3 airColor;
            
                void main() {   
                    
                    // 当前点距中点的距离
                    float d = distance(vUv, vec2(0.5f)); 
                    d = d * d * 100.0f;
                    
                    if(d<0.98f){
                        // 球体颜色
                        float a = smoothstep(0.0f,1.0f,d);     
                        gl_FragColor = vec4(vec3(0.0f), a);               
                    } else if(d<=1.0f){
                        float c = (d-0.98f)/(1.0f-0.98f);        
                        gl_FragColor =vec4(mix(vec3(0.0f),airColor,c),1.0f);        
                    } else if(d<=1.08f){        
                        float c = (d-1.0f)/(1.08f-1.0f);
                        gl_FragColor = vec4(mix(airColor,bkColor,sqrt(c)),1.0f);
                    } else{
                        // 球体外颜色
                        gl_FragColor = vec4(bkColor,1.0f);
                    }
            
                    #include <colorspace_fragment>
                    
                }  
            `,
		});
	}
}
