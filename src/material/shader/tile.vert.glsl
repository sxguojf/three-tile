
#define LAMBERT

varying vec3 vViewPosition;
varying vec2 vUv;

#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

void main() {

	#include <uv_vertex>

	vUv = vec3( uv, 1 ).xy;

	#include <color_vertex>
	#include <morphcolor_vertex>

	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>

	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>

	// 增加dem数据
	#ifdef USE_DISPLACEMENTMAP
		vec4 heightColor = texture2D(displacementMap, vUv);
		// mapBox高程
		float h = ((heightColor.r * 255.0 * 65536.0 + heightColor.g * 255.0 * 256.0 + heightColor.b * 255.0) * 0.1)*heightColor.a - 10000.0;
		transformed += normalize( objectNormal ) * h / 1000.0;
	#endif


	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>

	vViewPosition = - mvPosition.xyz;

	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>

}