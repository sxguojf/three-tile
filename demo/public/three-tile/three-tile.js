import { Vector3 as p, PlaneGeometry as Z, MeshBasicMaterial as K, Mesh as le, Matrix4 as mt, Frustum as pt, Box3 as Ee, ShaderMaterial as Fe, UniformsUtils as Ue, ShaderLib as ft, Color as X, MathUtils as H, Float32BufferAttribute as ne, Loader as q, LoadingManager as gt, Vector2 as x, Box2 as Ae, Texture as de, MeshLambertMaterial as yt, BufferGeometry as vt, Raycaster as Ze, Clock as Be, CanvasTexture as bt, MeshNormalMaterial as _t, EventDispatcher as Ne, MOUSE as k, TOUCH as U, Quaternion as Pe, Spherical as De, Object3D as xt, Scene as wt, FogExp2 as Ce, WebGLRenderer as Tt, PerspectiveCamera as Lt, AmbientLight as St, DirectionalLight as Mt, UniformsLib as Et } from "three";
const At = "three-tile", Pt = "0.5.0", Dt = "module", Ct = [
  "dist"
], jt = "dist/three-tile.umd.cjs", Ot = "dist/three-tile.js", It = "./dist/three-tile.es.d.ts", zt = {
  ".": {
    import: "./dist/three-tile.js",
    require: "./dist/three-tile.umd.cjs",
    types: "./dist/three-tile.es.d.ts"
  }
}, kt = "A lightweight tile map using threejs", Rt = "GPL V3", Ft = {
  name: "GuoJiangfeng",
  email: "hz_gjf@163.com"
}, Ut = [
  "three",
  "gis",
  "tile",
  "map",
  "3D",
  "cesium"
], Zt = {
  dev: "vite --config vite.config.dev.ts",
  lib: "tsc && vite build  --config vite.config.lib.ts",
  demo: "tsc && vite build  --config vite.config.demo.ts",
  docs: "typedoc src --out ./docs",
  lint: "eslint --ext .tsx,.ts ./src ",
  fix: "eslint --ext .tsx,.ts ./src --fix"
}, Bt = {
  "@types/node": "^20.2.3",
  "@types/offscreencanvas": "^2019.7.0",
  "@types/three": "^0.152.1",
  "@typescript-eslint/eslint-plugin": "^7.5.0",
  "@typescript-eslint/parser": "^7.5.0",
  eslint: "^8.57.0",
  typedoc: "^0.23.23",
  typescript: "^5.0.4",
  vite: "^4.0.0",
  "vite-plugin-dts": "^2.3.0",
  "vite-plugin-wasm": "^3.3.0"
}, Nt = {
  esbuild: "^0.18.20",
  three: "^0.152.2"
}, Ge = {
  name: At,
  private: !1,
  version: Pt,
  type: Dt,
  files: Ct,
  main: jt,
  module: Ot,
  types: It,
  exports: zt,
  description: kt,
  license: Rt,
  author: Ft,
  keywords: Ut,
  scripts: Zt,
  devDependencies: Bt,
  dependencies: Nt
};
function G(s, e, r, t, n) {
  const o = new Q(s, e, r);
  return o.position.copy(t), o.scale.copy(n), o;
}
function Gt(s, e = !1) {
  if (s.isLeaf) {
    const r = s.coord.z + 1, t = s.coord.x * 2, n = 0, o = 1 / 4;
    if (s.coord.z === 0 && e) {
      const a = s.coord.y, c = new p(0.5, 1, 1);
      s.add(G(t, a, r, new p(-o, 0, n), c)), s.add(G(t + 1, a, r, new p(o, 0, n), c));
    } else {
      const a = s.coord.y * 2, c = new p(0.5, 0.5, 1);
      s.add(G(t, a + 1, r, new p(-o, -o, n), c)), s.add(G(t + 1, a + 1, r, new p(o, -o, n), c)), s.add(G(t, a, r, new p(-o, o, n), c)), s.add(G(t + 1, a, r, new p(o, o, n), c));
    }
    s.traverse((a) => {
      a.updateMatrix(), a.updateMatrixWorld(), a.receiveShadow = s.receiveShadow, a.castShadow = s.castShadow;
    });
  }
  return s.children;
}
const Yt = new p();
function Wt(s, e, r) {
  const t = s.position.clone().setZ(r).applyMatrix4(s.matrixWorld);
  return e.distanceTo(t);
}
function Ht(s) {
  const e = new p(-0.5, -0.5, 0).applyMatrix4(s.matrixWorld), r = new p(0.5, 0.5, 0).applyMatrix4(s.matrixWorld);
  return e.sub(r).length();
}
function je(s, e) {
  const r = e.getWorldPosition(Yt), t = Wt(s, r, s.avgZ), n = Ht(s), o = t / n;
  return Math.log10(o) * 5 + 0.5;
}
var ce = /* @__PURE__ */ ((s) => (s[s.none = 0] = "none", s[s.create = 1] = "create", s[s.remove = 2] = "remove", s))(ce || {});
function Kt(s, e, r, t, n) {
  if (s.coord.z > r && s.index === 0 && s.parent?.isTile) {
    const a = je(s.parent, e);
    if (s.coord.z > t || a > n * 1.02)
      return 2;
  }
  if (s.coord.z < t && s.isLeafInFrustum) {
    const a = je(s, e);
    if (s.userData.dist = a, s.coord.z < r || a < n / 1.02)
      return 1;
  }
  return 0;
}
const ie = new Z(), oe = new K({ color: 16711680 });
class Q extends le {
  /** coordinate of tile */
  coord;
  /** is a tile? */
  isTile = !0;
  /** tile parent */
  parent = null;
  /** children of tile */
  children = [];
  /** max height of tile */
  maxZ = 0;
  /** min height of tile */
  minZ = 0;
  /** avg height of tile */
  avgZ = 0;
  /** index of tile, mean positon in parent.
   *  (0:left-bottom, 1:right-bottom,2:left-top、3:right-top、-1:parent is null）
   */
  get index() {
    return this.parent ? this.parent.children.indexOf(this) : -1;
  }
  /* downloading abort controller */
  _abortController = new AbortController();
  /** singnal of abort when downloading  */
  get abortSignal() {
    return this._abortController.signal;
  }
  _loadState = "empty";
  /** get the tile load state*/
  get loadState() {
    return this._loadState;
  }
  _toLoad = !1;
  /** needs to load? */
  get _needsLoad() {
    return this.inFrustum && this._toLoad && this.loadState === "empty";
  }
  _inFrustum = !1;
  /** tile in frustum? */
  get inFrustum() {
    return this._inFrustum;
  }
  /** set the tile in frustum */
  set inFrustum(e) {
    this._inFrustum != e && (this._inFrustum = e, e ? this._toLoad = this.isLeaf : this.dispose(!0));
  }
  /** is the tile  leaf in frustum ? */
  get isLeafInFrustum() {
    return this.inFrustum && this.isLeaf;
  }
  /** set the tile to temp*/
  set isTemp(e) {
    this.material.forEach((r) => {
      "wireframe" in r && (r.wireframe = e || r.userData.wireframe);
    });
  }
  /** is tile leaf?  */
  get isLeaf() {
    return this.children.length === 0;
  }
  /**
   * constructor
   * @param x tile X-coordinate, default:0
   * @param y tile X-coordinate, default:0
   * * @param z tile level, default:0
   */
  constructor(e = 0, r = 0, t = 0) {
    super(ie, [oe]), this.coord = { x: e, y: r, z: t }, this.name = `Tile ${t}-${e}-${r}`, this.matrixAutoUpdate = !1, this.matrixWorldAutoUpdate = !1;
  }
  /**
   * Override Obejct3D.traverse, change the callback param to "this"
   * @param callback callback
   */
  traverse(e) {
    e(this), this.children.forEach((r) => {
      r.traverse(e);
    });
  }
  /**
   * Override mesh.raycast，only when tile has loaded
   * @param raycaster
   * @param intersects
   */
  raycast(e, r) {
    this.loadState === "loaded" && super.raycast(e, r);
  }
  /**
   * Level Of Details
   * @param camera
   * @param minLevel min level for LOD
   * @param maxLevel max level for LOD
   * @param threshold threshold for LOD
   * @param isWGS is WGS projection?
   * @returns new tiles
   */
  _lod(e, r, t, n, o) {
    let a = [];
    const c = Kt(this, e, r, t, n);
    if (c === ce.create)
      a = Gt(this, o), this._toLoad = !1;
    else if (c === ce.remove) {
      const l = this.parent;
      l?.isTile && (l._toLoad = !0);
    }
    return a;
  }
  /**
   * load tile data
   * @param loader data loader
   * @returns update visible of tiles ?
   */
  _load(e) {
    return this._needsLoad ? (this._abortController = new AbortController(), this._loadState = "loading", new Promise((r, t) => {
      e.load(
        this,
        () => r(this._onLoad()),
        (n) => r(this._onError(n))
      );
    })) : Promise.resolve(!1);
  }
  /**
   * callback function when error. (include abort)
   * @param err error message
   * @returns
   */
  _onError(e) {
    return this._toLoad = !1, e.name === "AbortError" ? (console.assert(this._loadState === "empty"), console.log(e.message)) : (this._loadState = "loaded", console.error(e.message || e.type || e)), !1;
  }
  /**
   * recursion tile tree to find loaded parent (hide when parent showing)
   * @returns loaded parent or null
   */
  hasLoadedParent() {
    const e = this.parent;
    return !e || !e.isTile ? null : e.loadState === "loaded" ? e : e.hasLoadedParent();
  }
  /**
   * callback function on loaded
   */
  _onLoad() {
    if (this.loadState === "empty")
      return !1;
    if (!this.inFrustum)
      debugger;
    return this._loadState = "loaded", this._updateZ(), this.material.forEach((e) => {
      "wireframe" in e && (e.userData.wireframe = e.wireframe);
    }), this.isLeaf ? this.isTemp = this.hasLoadedParent() != null : this._toLoad ? (this.isTemp = !1, this.children.forEach((e) => e.dispose(!0)), this.clear()) : this.dispose(!1), this._toLoad = !1, !0;
  }
  // update height
  _updateZ() {
    this.geometry.computeBoundingBox(), this.maxZ = this.geometry.boundingBox?.max.z || 0, this.minZ = this.geometry.boundingBox?.min.z || 0, this.avgZ = (this.maxZ + this.minZ) / 2;
  }
  /**
   * abort download
   */
  abortLoad() {
    this._abortController.abort();
  }
  /**
   * free the tile
   * @param removeChildren 是否移除子瓦片
   */
  dispose(e) {
    return this.loadState != "empty" && this._dispose(), e && (this.children.forEach((r) => {
      r.dispose(e), r.clear();
    }), this.clear()), this;
  }
  _dispose() {
    this.abortLoad(), this._loadState = "empty", this.isTemp = !0, this.material[0] != oe && (this.material.forEach((e) => e.dispose()), this.material = [oe]), this.geometry != ie && (this.geometry.dispose(), this.geometry.groups = [], this.geometry = ie), this.dispatchEvent({ type: "dispose" });
  }
}
const $t = new mt(), Oe = new pt();
class Ie extends Q {
  _treeReadyCount = 0;
  _autoLoad = !0;
  _loader;
  _minLevel = 0;
  /**
   * Get the map minLevel
   */
  get minLevel() {
    return this._minLevel;
  }
  /**
   * Set the map minLevel,
   */
  set minLevel(e) {
    this._minLevel = e;
  }
  _maxLevel = 19;
  /**
   * Get the map maxLevel
   */
  get maxLevel() {
    return this._maxLevel;
  }
  /**
   * Set the map maxLevel
   */
  set maxLevel(e) {
    this._maxLevel = e;
  }
  _LODThreshold = 1;
  /**
   * Get the map LOD threshold
   */
  get LODThreshold() {
    return this._LODThreshold;
  }
  /**
   * Set the map LOD threshold
   */
  set LODThreshold(e) {
    this._LODThreshold = e;
  }
  /**
   * Is the map WGS projection
   */
  isWGS = !1;
  /**
   * Get the tile loader
   */
  get loader() {
    return this._loader;
  }
  /**
   * Set the tile loader
   */
  set loader(e) {
    this._loader = e;
  }
  /**
   * Get whether allow tile data to update, default true.
   */
  get autoLoad() {
    return this._autoLoad;
  }
  /**
   * Set whether allow tile data to update, default true.
   * true: auto load data on the scene update every frame it is rendered.
   * false: only update quad tree on render.
   */
  set autoLoad(e) {
    this._autoLoad = e;
  }
  _vierwerBufferSize = 0.6;
  // tile bounds, used to decide the tile in frustum, it greater than tile size to cache
  _tileBox = new Ee(
    new p(-this.viewerbufferSize, -this.viewerbufferSize, 0),
    new p(this.viewerbufferSize, this.viewerbufferSize, 10)
  );
  /**
   * Get the renderer cache size scale. (0.5-2.5，default: 0.6)
   */
  get viewerbufferSize() {
    return this._vierwerBufferSize;
  }
  /**
   * Get the renderer cache size. (0.5-2.5，default: 0.6)
   */
  set viewerbufferSize(e) {
    this._vierwerBufferSize = Math.min(Math.max(e, 0.5), 2.5), this._tileBox = new Ee(
      new p(-this.viewerbufferSize, -this.viewerbufferSize, 0),
      new p(this.viewerbufferSize, this.viewerbufferSize, 9)
    );
  }
  /**
   * constructor
   * @param loader tile data loader
   * @param level tile level, default:0
   * @param x tile X-coordinate, default:0
   * @param y tile y-coordinate, default:0
   */
  constructor(e, r = 0, t = 0, n = 0) {
    super(r, t, n), this._loader = e, this.matrixAutoUpdate = !0, this.matrixWorldAutoUpdate = !0;
  }
  /**
   * update the quadTree and tile data
   * @param camera
   */
  update(e) {
    return this._updateTileTree(e) ? this._treeReadyCount = 0 : this._treeReadyCount = Math.min(this._treeReadyCount + 1, 100), this.autoLoad && this._treeReadyCount > 2 && this._updateTileData(), this;
  }
  /**
   * reload data, Called to take effect after source is modified
   */
  reload() {
    return this.dispose(!0), this;
  }
  /**
   * update the tile tree use LOD
   * @param cameraWorldPosition positon of the camera
   * @returns  the tile tree has changed
   */
  _updateTileTree(e) {
    let r = !1;
    return Oe.setFromProjectionMatrix($t.multiplyMatrices(e.projectionMatrix, e.matrixWorldInverse)), this.traverse((t) => {
      if (t.isTile) {
        t.geometry.computeBoundingBox(), t.geometry.computeBoundingSphere(), t.inFrustum = Oe.intersectsBox(this._tileBox.clone().applyMatrix4(t.matrixWorld));
        const n = t._lod(e, this.minLevel, this.maxLevel, this.LODThreshold, this.isWGS);
        n.forEach((o) => {
          this.dispatchEvent({ type: "tile-created", tile: o });
        }), n.length > 0 && (r = !0);
      }
    }), r;
  }
  /**
   *  update tileTree data.
   *  traverse the tiles to load data and update tiles visible.
   */
  _updateTileData() {
    return this.traverse((e) => {
      e.isTile && e._load(this.loader).then((r) => {
        r && (this._updateVisible() && (this.dispatchEvent({ type: "loaded", tile: e }), console.log("ok")), this._updateVisibleZ()), this.dispatchEvent({ type: "tile-loaded", tile: e });
      });
    }), this;
  }
  /**
   * update the tile visible when tile loaded
   * @returns all of tile has loaded?
   */
  _updateVisible() {
    const e = (r) => {
      if (!r.inFrustum)
        return !0;
      if (r.isLeaf)
        return r.loadState === "loaded";
      const t = r.children.every((n) => e(n));
      return t && r.children.forEach((n) => {
        n.inFrustum && (n.isLeaf ? n.isTemp = !1 : n.dispose(!1));
      }), t;
    };
    return e(this);
  }
  /**
   * update the tiles height
   */
  _updateVisibleZ() {
    let e = 0, r = 0;
    this.maxZ = 0, this.minZ = 9e3, this.traverse((t) => {
      t.isTile && t.isLeafInFrustum && t.loadState === "loaded" && (this.maxZ = Math.max(this.maxZ, t.maxZ), this.minZ = Math.min(this.minZ, t.minZ), e += t.avgZ, r++);
    }), r > 0 && (this.avgZ = e / r);
  }
}
const Vt = `\r
// #define LAMBERT\r
\r
uniform vec3 diffuse;\r
uniform vec3 emissive;\r
uniform float opacity;\r
\r
uniform sampler2D map;\r
uniform sampler2D map1;\r
\r
varying vec2 vUv;\r
\r
#include <common>\r
#include <packing>\r
#include <dithering_pars_fragment>\r
#include <color_pars_fragment>\r
#include <uv_pars_fragment>\r
#include <map_pars_fragment>\r
#include <alphamap_pars_fragment>\r
#include <alphatest_pars_fragment>\r
#include <aomap_pars_fragment>\r
#include <lightmap_pars_fragment>\r
#include <emissivemap_pars_fragment>\r
#include <envmap_common_pars_fragment>\r
#include <envmap_pars_fragment>\r
#include <fog_pars_fragment>\r
#include <bsdfs>\r
#include <lights_pars_begin>\r
#include <normal_pars_fragment>\r
#include <lights_lambert_pars_fragment>\r
#include <shadowmap_pars_fragment>\r
#include <bumpmap_pars_fragment>\r
#include <normalmap_pars_fragment>\r
#include <specularmap_pars_fragment>\r
#include <logdepthbuf_pars_fragment>\r
#include <clipping_planes_pars_fragment>\r
\r
void main() {\r
\r
	#include <clipping_planes_fragment>\r
\r
	vec4 diffuseColor = vec4( diffuse, opacity );\r
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\r
	vec3 totalEmissiveRadiance = emissive;\r
\r
	#include <logdepthbuf_fragment>\r
	#include <map_fragment>\r
	#include <color_fragment>\r
	#include <alphamap_fragment>\r
	\r
	\r
	#include <alphatest_fragment>\r
	#include <specularmap_fragment>\r
	#include <normal_fragment_begin>\r
	#include <normal_fragment_maps>\r
	#include <emissivemap_fragment>\r
\r
\r
	// 增加多图层混合\r
    diffuseColor *= texture2D( map, vUv );\r
	vec4 map1Color = texture2D(map1, vUv);\r
	diffuseColor.rgb = diffuseColor.rgb * (1.0 - map1Color.a) + map1Color.rgb * map1Color.a;\r
    diffuseColor.a = opacity;\r
    \r
	// 未加载纹理图片时显示白色（网格）\r
	vec2 size = vec2(textureSize(map, 0));\r
	if(size.x<2.0){\r
		diffuseColor = vec4(1.0, 1.0, 1.0, 0.3);		\r
	}\r
\r
	// accumulation\r
	#include <lights_lambert_fragment>\r
	#include <lights_fragment_begin>\r
	#include <lights_fragment_maps>\r
	#include <lights_fragment_end>\r
\r
	// modulation\r
	// #include <aomap_fragment>\r
\r
\r
\r
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;\r
\r
	#include <envmap_fragment>\r
	#include <output_fragment>\r
	#include <tonemapping_fragment>\r
	#include <encodings_fragment>\r
	#include <fog_fragment>\r
	#include <premultiplied_alpha_fragment>\r
	#include <dithering_fragment>\r
\r
}`, Xt = `\r
#define LAMBERT\r
\r
varying vec3 vViewPosition;\r
varying vec2 vUv;\r
\r
#include <common>\r
#include <uv_pars_vertex>\r
#include <displacementmap_pars_vertex>\r
#include <envmap_pars_vertex>\r
#include <color_pars_vertex>\r
#include <fog_pars_vertex>\r
#include <normal_pars_vertex>\r
#include <morphtarget_pars_vertex>\r
#include <skinning_pars_vertex>\r
#include <shadowmap_pars_vertex>\r
#include <logdepthbuf_pars_vertex>\r
#include <clipping_planes_pars_vertex>\r
\r
void main() {\r
\r
	#include <uv_vertex>\r
\r
	vUv = vec3( uv, 1 ).xy;\r
\r
	#include <color_vertex>\r
	#include <morphcolor_vertex>\r
\r
	#include <beginnormal_vertex>\r
	#include <morphnormal_vertex>\r
	#include <skinbase_vertex>\r
	#include <skinnormal_vertex>\r
	#include <defaultnormal_vertex>\r
	#include <normal_vertex>\r
\r
	#include <begin_vertex>\r
	#include <morphtarget_vertex>\r
	#include <skinning_vertex>\r
	#include <displacementmap_vertex>\r
\r
	// 增加dem数据\r
	#ifdef USE_DISPLACEMENTMAP\r
		vec4 heightColor = texture2D(displacementMap, vUv);\r
		// mapBox高程\r
		float h = ((heightColor.r * 255.0 * 65536.0 + heightColor.g * 255.0 * 256.0 + heightColor.b * 255.0) * 0.1)*heightColor.a - 10000.0;\r
		transformed += normalize( objectNormal ) * h / 1000.0;\r
	#endif\r
\r
\r
	#include <project_vertex>\r
	#include <logdepthbuf_vertex>\r
	#include <clipping_planes_vertex>\r
\r
	vViewPosition = - mvPosition.xyz;\r
\r
	#include <worldpos_vertex>\r
	#include <envmap_vertex>\r
	#include <shadowmap_vertex>\r
	#include <fog_vertex>\r
\r
}`;
class Ur extends Fe {
  constructor(e) {
    super({
      uniforms: Ue.merge([
        ft.lambert.uniforms,
        {
          map1: { value: null },
          diffuse: { value: new X(16777215) }
        }
      ]),
      vertexShader: Xt,
      fragmentShader: Vt,
      lights: !0,
      transparent: e.transparent || !0,
      wireframe: e.wireframe || !1,
      fog: !0
    }), this.uniforms.map.value = e.map, this.uniforms.map1.value = e.map1, this.defineProperty("map1"), this.defineProperty("diffuse"), this.defineProperty("opacity");
  }
  dispose() {
    this.uniforms.map.value?.dispose(), this.uniforms.map1.value?.dispose(), super.dispose();
  }
  defineProperty(e) {
    Object.defineProperty(this, e, {
      get: function() {
        return this.uniforms[e].value;
      },
      set: function(r) {
        this.uniforms[e].value = r;
      }
    });
  }
}
class Zr extends Z {
  build(e, r) {
    this.dispose(), this.copy(new Z(1, 1, r - 1, r - 1));
    const t = this.getAttribute("position");
    for (let n = 0; n < t.count; n++)
      t.setZ(n, e[n]);
  }
  setData(e, r) {
    if (e.length != r * r)
      throw "DEM array size error!";
    return this.build(e, r), this.computeBoundingBox(), this.computeBoundingSphere(), this.computeVertexNormals(), this;
  }
}
class qt extends Z {
  _min = 1 / 0;
  /**
   * buile
   * @param dem 2d array of dem
   * @param tileSize tile size
   */
  build(e, r) {
    this.dispose();
    const t = 1, n = 1, o = r - 1, a = r - 1, c = t / 2, l = n / 2;
    let h = Math.floor(o), d = Math.floor(a);
    const L = t / h, v = n / d;
    h += 2, d += 2;
    const f = h + 1, M = d + 1, T = [], A = [], C = [], j = [];
    let O = 0;
    this._min = Math.min(...Array.from(e));
    for (let g = 0; g < M; g++)
      for (let m = 0; m < f; m++) {
        let P = (m - 1) * L - c, R = (g - 1) * v - l, D = (m - 1) / (h - 2), S = 1 - (g - 1) / (d - 2);
        P = H.clamp(P, -0.5, 0.5), R = H.clamp(R, -0.5, 0.5), D = H.clamp(D, 0, 1), S = H.clamp(S, 0, 1);
        let F = 0;
        g === 0 || g === M - 1 || m === 0 || m === f - 1 ? F = this._min - 0.1 : (F = e[O], O++), A.push(P, -R, F), C.push(0, 0, 1), j.push(D, S);
      }
    for (let g = 0; g < d; g++)
      for (let m = 0; m < h; m++) {
        const P = m + f * g, R = m + f * (g + 1), D = m + 1 + f * (g + 1), S = m + 1 + f * g;
        T.push(P, R, S), T.push(R, D, S);
      }
    return this.setIndex(T), this.setAttribute("position", new ne(A, 3)), this.setAttribute("normal", new ne(C, 3)), this.setAttribute("uv", new ne(j, 2)), this;
  }
  /**
   * set the tile dem data
   * @param dem 2d dem array
   * @param tileSize dem size
   * @returns this
   */
  setData(e, r) {
    if (e.length != r * r)
      throw "DEM array size error!";
    return this.build(e, r), this.computeBoundingBox(), this.computeBoundingSphere(), this.computeVertexNormals(), this;
  }
  // set normal on edge(skirt)
  // 瓦片边缘法向量计算比较复杂，需要根据相邻瓦片高程计算，暂未实现
  // 考虑使用Mapbox Terrain-DEM v1格式地形 https://docs.mapbox.com/data/tilesets/reference/mapbox-terrain-dem-v1/
  computeVertexNormals() {
    super.computeVertexNormals();
    const e = this.index, r = this.getAttribute("position"), t = this.getAttribute("normal"), n = new p(), o = new p(), a = new p(), c = new p(0, 0, 1);
    function l(h) {
      return t.setXYZ(h, c.x, c.y, c.z);
    }
    if (e)
      for (let h = 0, d = e.count; h < d; h += 3) {
        const L = e.getX(h + 0), v = e.getX(h + 1), f = e.getX(h + 2);
        n.fromBufferAttribute(r, L), o.fromBufferAttribute(r, v), a.fromBufferAttribute(r, f), (n.z < this._min || o.z < this._min || a.z < this._min) && (l(L), l(v), l(f));
      }
    t.needsUpdate = !0;
  }
}
class V {
  static enabled = !0;
  static size = 500;
  static files = /* @__PURE__ */ new Map();
  static add(e, r) {
    if (!this.enabled || this.files.has(e))
      return;
    this.files.set(e, r);
    const t = Array.from(this.files.keys()), n = this.files.size - this.size;
    for (let o = 0; o < n; o++)
      this.remove(t[o]);
    console.assert(this.files.size <= this.size);
  }
  static get(e) {
    if (this.enabled)
      return this.files.get(e);
  }
  static remove(e) {
    this.files.delete(e);
  }
  static clear() {
    this.files.clear();
  }
}
class Qt extends Error {
  response;
  constructor(e, r) {
    super(e), this.response = r;
  }
}
class Jt extends q {
  mimeType;
  responseType;
  constructor(e) {
    super(e);
  }
  load(e, r, t, n, o) {
    this.path !== void 0 && (e = this.path + e), e = this.manager.resolveURL(e);
    const a = V.get(e);
    if (a)
      return this.manager.itemStart(e), setTimeout(() => {
        r && r(a), this.manager.itemEnd(e);
      }), a;
    if (o?.aborted) {
      console.log("aborted befor load");
      return;
    }
    const c = new Request(e, {
      headers: new Headers(this.requestHeader),
      credentials: this.withCredentials ? "include" : "same-origin",
      // An abort controller could be added within a future PR
      signal: o
    }), l = this.mimeType, h = this.responseType;
    fetch(c).then((d) => {
      if (d.status === 200 || d.status === 0)
        return d.status === 0 && console.warn("THREE.FileLoader: HTTP Status 0 received."), d;
      throw new Qt(
        `fetch for "${d.url}" responded with ${d.status}: ${d.statusText}`,
        d
      );
    }).then((d) => {
      switch (h) {
        case "arraybuffer":
          return d.arrayBuffer();
        case "blob":
          return d.blob();
        case "document":
          return d.text().then((L) => new DOMParser().parseFromString(L, l));
        case "json":
          return d.json();
        default:
          if (l === void 0)
            return d.text();
          {
            const v = /charset="?([^;"\s]*)"?/i.exec(l), f = v && v[1] ? v[1].toLowerCase() : void 0, M = new TextDecoder(f);
            return d.arrayBuffer().then((T) => M.decode(T));
          }
      }
    }).then((d) => {
      V.add(e, d), r && r(d);
    }).catch((d) => {
      n && n(d), d.name != "AbortError" && this.manager.itemError(e);
    }).finally(() => {
      this.manager.itemEnd(e);
    }), this.manager.itemStart(e);
  }
  setResponseType(e) {
    return this.responseType = e, this;
  }
  setMimeType(e) {
    return this.mimeType = e, this;
  }
}
class _ {
  static manager = new gt();
  // dict of dem loader
  static demLoaderMap = /* @__PURE__ */ new Map();
  // dict of img loader
  static imgLoaderMap = /* @__PURE__ */ new Map();
  /**
   * register material loader
   * @param loader material loader
   */
  static registerMaterialLoader(e) {
    _.imgLoaderMap.set(e.dataType, e), console.log(`* Register imageLoader: ${e.dataType}`);
  }
  /**
   * register geometry loader
   * @param loader geometry loader
   */
  static registerGeometryLoader(e) {
    _.demLoaderMap.set(e.dataType, e), console.log(`* Register terrainLoader: ${e.dataType}`);
  }
  /**
   * get material loader from datasource
   * @param source datasource
   * @returns material loader
   */
  static getMaterialLoader(e) {
    const r = _.imgLoaderMap.get(e.dataType);
    if (r)
      return r;
    throw `Source dataType "${e.dataType}" is not support!`;
  }
  /**
   * get geometry loader from datasource
   * @param source datasouce
   * @returns geometry loader
   */
  static getGeometryLoader(e) {
    const r = _.demLoaderMap.get(e.dataType);
    if (r)
      return r;
    throw `Source dataType "${e.dataType}" is not support!`;
  }
}
const er = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
class Ye extends q {
  loader = new Jt(_.manager);
  constructor(e) {
    super(e), this.loader.setResponseType("blob");
  }
  /**
   * load image
   * @param url imageurl
   * @param onLoad callback when loaded and abort and error
   * @param onProgress callback when progress
   * @param onError callback when error
   * @param abortSignal signal of abort loading
   * @returns image
   */
  load(e, r, t, n, o) {
    const a = new Image(), c = (d) => {
      h(), r && r(a);
    }, l = (d) => {
      h(), n && n(d), a.src = er;
    }, h = () => {
      a.removeEventListener("load", c, !1), a.removeEventListener("error", l, !1);
    };
    return a.addEventListener("load", c, !1), a.addEventListener("error", l, !1), this.crossOrigin, this.requestHeader, this.loader.load(
      e,
      (d) => {
        r && (a.src = URL.createObjectURL(d));
      },
      t,
      n,
      o
    ), a;
  }
}
function We(s, e) {
  s.translate(new x(0.5, 0.5));
  const r = Math.floor(s.min.x * e), t = Math.floor(s.min.y * e), n = Math.floor((s.max.x - s.min.x) * e), o = Math.floor((s.max.y - s.min.y) * e);
  return { sx: r, sy: t, sw: n, sh: o };
}
function Br(s, e) {
  if (s.width <= e)
    return s;
  const r = document.createElement("canvas"), t = r.getContext("2d");
  r.width = e, r.height = e;
  const n = e - 2;
  t.drawImage(s, 0, 0, s.width, s.height, 1, 1, n, n);
  const o = t.getImageData(1, 1, n, n);
  return t.putImageData(o, 0, 0), r;
}
function He(s, e) {
  if (e.coord.z <= s.maxLevel)
    return {
      url: s.getTileUrl(e.coord.x, e.coord.y, e.coord.z),
      rect: new Ae(new x(-0.5, -0.5), new x(0.5, 0.5))
    };
  function r(o, a) {
    const c = new p(), l = new x(1, 1);
    for (; o.coord.z > a && (c.applyMatrix4(o.matrix), l.multiplyScalar(0.5), o.parent instanceof Q); )
      o = o.parent;
    c.setY(-c.y);
    const h = new Ae().setFromCenterAndSize(new x(c.x, c.y), l);
    return { tile: o, rect: h };
  }
  const t = r(e, s.maxLevel);
  return { url: s.getTileUrl(
    t.tile.coord.x,
    t.tile.coord.y,
    t.tile.coord.z
  ), rect: t.rect };
}
class w {
  dataType = "image";
  attribution = "ThreeTile";
  minLevel = 0;
  maxLevel = 19;
  projection = "3857";
  url = "";
  subdomains = [];
  s = "";
  colorSpace = "srgb";
  opacity = 1;
  bounds = [-180, 85.05112877980659, 180, -85.05112877980659];
  /**
   * get url callback function, overwrite it to convt orgin xyz to new xzy
   */
  onGetUrl;
  /**
   * constructor
   * @param options
   */
  constructor(e) {
    e && (Object.assign(this, e), e.url instanceof Function ? this.getUrl = e.url : this.url = e.url || "");
  }
  /**
   * get url from tile coordinate, public
   * @param x
   * @param y
   * @param z
   * @returns url
   */
  getTileUrl(e, r, t) {
    const n = this.subdomains.length;
    if (n > 0) {
      const a = Math.floor(Math.random() * n);
      this.s = this.subdomains[a];
    }
    const o = this.onGetUrl ? this.onGetUrl(e, r, t) : { x: e, y: r, z: t };
    if (o)
      return this.getUrl(o.x, o.y, o.z);
  }
  /**
   * get url from tile coordinate, protected, overwrite to custom generation tile url from xyz
   * @param x
   * @param y
   * @param z
   * @returns url
   */
  getUrl(e, r, t) {
    if (this.url) {
      const n = Object.assign({}, this, { x: e, y: r, z: t });
      return tr(this.url, n);
    }
  }
  /**
   * source factory function, create source directly through factoy functions.
   * @param options
   * @returns ISource
   */
  static create(e) {
    return new w(e);
  }
}
function tr(s, e) {
  const r = /\{ *([\w_ -]+) *\}/g;
  return s.replace(r, (t, n) => {
    let o = e[n];
    if (o === void 0)
      throw new Error(`source url template error, No value provided for variable: ${t}`);
    return typeof o == "function" && (o = o(e)), o;
  });
}
class rr extends q {
  /** get loader cache size of file  */
  get cacheSize() {
    return V.size;
  }
  /** set loader cache size of file  */
  set cacheSize(e) {
    V.size = e;
  }
  _imgSource;
  /** get image source */
  get imgSource() {
    return this._imgSource;
  }
  /** set image source */
  set imgSource(e) {
    this._imgSource = e;
  }
  _demSource;
  /** get dem source */
  get demSource() {
    return this._demSource;
  }
  /** set dem source */
  set demSource(e) {
    this._demSource = e;
  }
  /**
   * constructor
   * @param imgSource image dataSource
   * @param demSource dem dataSource
   */
  constructor(e, r) {
    super(_.manager), this.imgSource = e || [w.create({ dataType: "test" })], this.demSource = r;
  }
  /**
   * load material and geometry data
   * @param tile tile to load
   * @param onLoad callback on data loaded
   * @returns geometry, material(s)
   */
  load(e, r, t) {
    if (this.imgSource.length === 0)
      throw new Error("imgSource can not be empty");
    const n = () => {
      if (o && a) {
        for (let h = 0; h < l.length; h++)
          c.addGroup(0, 1 / 0, h);
        r();
      }
    };
    let o = !1, a = !1;
    const c = this.loadGeometry(
      e,
      () => {
        o = !0, n();
      },
      t
    ), l = this.loadMaterial(
      e,
      () => {
        a = !0, n();
      },
      t
    );
    return e.geometry = c, e.material = l, { geometry: c, material: l };
  }
  /**
   * load geometry
   * @param tile tile to load
   * @param onLoad loaded callback
   * @param onError error callback
   * @returns geometry
   */
  loadGeometry(e, r, t) {
    let n;
    return this.demSource ? n = _.getGeometryLoader(this.demSource).load(this.demSource, e, r, t) : (n = new Z(), setTimeout(r)), n;
  }
  /**
   * load material
   * @param tile tile to load
   * @param onLoad loaded callback
   * @param onError error callback
   * @returns material
   */
  loadMaterial(e, r, t) {
    const n = this.imgSource.map((o) => {
      const c = _.getMaterialLoader(o).load(
        o,
        e,
        () => {
          c.userData.loaded = !0, n.every((l) => l.userData.loaded) && r();
        },
        t
      );
      return c;
    });
    return n;
  }
}
const nr = new de();
class ir {
  loader = new Ye(_.manager);
  /**
   * load the tile texture
   * @param tile tile to load
   * @param source datasource
   * @param onLoad callback
   * @returns texture
   */
  load(e, r, t, n) {
    const { url: o, rect: a } = He(e, r);
    if (!o)
      return setTimeout(t), nr;
    const c = new de(new Image());
    return c.colorSpace = e.colorSpace, this.loader.load(
      o,
      // onLoad
      (l) => {
        r.coord.z > e.maxLevel ? c.image = or(l, a) : c.image = l, c.needsUpdate = !0, t();
      },
      // onProgress
      void 0,
      // onError
      n,
      r.abortSignal
    ), c;
  }
}
function or(s, e) {
  const r = s.width, t = new OffscreenCanvas(r, r), n = t.getContext("2d"), { sx: o, sy: a, sw: c, sh: l } = We(e, s.width);
  return n.drawImage(s, o, a, c, l, 0, 0, r, r), t;
}
class sr {
  dataType = "image";
  load(e, r, t, n) {
    const o = (h) => {
      const d = h.target;
      d.map?.image instanceof ImageBitmap && d.map.image.close(), d.map?.dispose(), d.removeEventListener("dispose", o);
    }, a = this.createMaterial();
    a.opacity = e.opacity, a.addEventListener("dispose", o);
    const l = new ir().load(
      e,
      r,
      () => {
        a.map = l, l.needsUpdate = !0, t();
      },
      (h) => {
        n(h);
      }
    );
    return a;
  }
  createMaterial() {
    return new yt({
      transparent: !0
    });
  }
}
_.registerMaterialLoader(new sr());
const ar = new vt();
class cr extends q {
  dataType = "terrain-rgb";
  imageLoader = new Ye(_.manager);
  /**
   * load tile's data from source
   * @param source
   * @param tile
   * @param onLoad
   * @param onError
   * @returns
   */
  load(e, r, t, n) {
    if (r.coord.z < 8)
      return setTimeout(t), new Z();
    const { url: o, rect: a } = He(e, r);
    return o ? this._load(r, o, a, t, n) : (setTimeout(t), ar);
  }
  _load(e, r, t, n, o) {
    let a = e.coord.z * 3;
    a = Math.min(Math.max(a, 2), 48);
    const c = new qt();
    return this.imageLoader.load(
      r,
      // onLoad
      (l) => {
        const { data: h, size: d } = ur(l, a, t);
        c.setData(dr(h), d), n();
      },
      // onProgress
      void 0,
      // onError
      o,
      e.abortSignal
    ), c;
  }
}
function lr(s, e) {
  const r = s[e * 4], t = s[e * 4 + 1], n = s[e * 4 + 2];
  return (((r << 16) + (t << 8) + n) * 0.1 - 1e4) / 1e3;
}
function dr(s) {
  const e = Math.floor(s.length / 4), r = new Float32Array(e);
  for (let t = 0; t < r.length; t++)
    r[t] = lr(s, t);
  return r;
}
function ur(s, e, r) {
  const n = new OffscreenCanvas(e, e).getContext("2d");
  n.imageSmoothingEnabled = !1;
  const o = We(r, s.width);
  return e > o.sw && (e = o.sw), n.drawImage(s, o.sx, o.sy, o.sw, o.sh, 0, 0, e, e), { data: n.getImageData(0, 0, e, e).data, size: e };
}
_.registerGeometryLoader(new cr());
class Y {
  isWGS = !1;
  /**
   * create projection object from projection ID
   *
   * @param id projeciton ID, default: "3857"
   * @returns IProjection instance
   */
  static createFromID(e = "3857") {
    let r;
    switch (e) {
      case "3857":
        r = new Ke();
        break;
      case "4326":
        r = new hr();
        break;
    }
    return r;
  }
  /**
   * create projection object from map source
   * @param source map source
   * @returns IProjection instance
   */
  static createFromSource(e) {
    let r = "3857";
    return e && (r = e.projection), Y.createFromID(r);
  }
}
const se = 6378;
class Ke extends Y {
  ID = "3857";
  // projeciton ID
  isWGS = !1;
  // Is linear projection of latitude and longitude
  mapWidth = 2 * Math.PI * se;
  //E-W scacle Earth's circumference(km)
  mapHeight = this.mapWidth;
  //S-N scacle Earth's circumference(km)
  mapDepth = 1;
  //Height scale
  /**
   * Latitude and longitude to projected coordinates
   * @param lon longitude
   * @param lat Latitude
   * @returns projected coordinates
   */
  project(e, r, t) {
    const n = se;
    let o = (e - t) * Math.PI / 180 * n;
    o > this.mapWidth / 2 && (o = o - this.mapWidth);
    const a = Math.log(Math.tan(Math.PI / 4 + r * Math.PI / 180 / 2)) * n;
    return { x: o, y: a };
  }
  /**
   * Projected coordinates to latitude and longitude
   * @param x projection x
   * @param y projection y
   * @returns latitude and longitude
   */
  unProject(e, r, t) {
    const n = se, o = (e / n / Math.PI * 180 + t + 540) % 360 - 180;
    return { lat: (Math.atan(Math.exp(r / n)) * 2 - Math.PI / 2) * 180 / Math.PI, lon: o };
  }
}
class hr extends Y {
  ID = "4326";
  isWGS = !0;
  mapWidth = 36e3;
  //E-W scacle (*0.01°)
  mapHeight = 18e3;
  //S-N scale (*0.01°)
  mapDepth = 1;
  //height scale
  project(e, r, t) {
    return { x: (e - t) * 100, y: r * 100 };
  }
  unProject(e, r, t) {
    return { lon: e / 100 + t, lat: r / 100 };
  }
}
const mr = new p(0, 0, -1);
function $e(s, e) {
  const r = e.intersectObjects([s.rootTile]);
  for (const t of r)
    if (t.object instanceof Q) {
      const n = s.worldToLocal(t.point), o = s.pos2geo(n);
      return Object.assign(t, {
        location: o
      });
    }
}
function ze(s, e) {
  const r = new p(e.x, e.y, 10), t = new Ze(r, mr);
  return $e(s, t);
}
function pr(s, e, r) {
  const t = new Ze();
  return t.setFromCamera(r, s), $e(e, t);
}
class Ve extends le {
  // 渲染时钟计时器
  _clock = new Be();
  // 是否为LOD模型（LOD模型，当autoUpdate为真时渲染时会自动调用update方法）
  isLOD = !0;
  /**
   * 瓦片是否在每帧渲染时自动更新
   * Whether the LOD object is updated automatically by the renderer per frame or not.
   * If set to false, you have to call LOD.update() in the render loop by yourself. Default is true.
   */
  autoUpdate = !0;
  /**
   * Root tile, it is the root node of tile tree.
   * 根瓦片
   */
  rootTile;
  /**
   * Map data loader, it used for load tile data and create tile geometry/Material
   * 地图数据加载器
   */
  loader;
  /**
   * Get min level of map
   * 取得地图最小缩放级别，小于这个级别瓦片树不再更新
   */
  get minLevel() {
    return this.rootTile.minLevel;
  }
  /**
   * Set max level of map
   * 设置地图最小缩放级别，小于这个级别瓦片树不再更新
   */
  set minLevel(e) {
    this.rootTile.minLevel = e;
  }
  /**
   * Get max level of map
   * 取得地图最大缩放级别，大于这个级别瓦片树不再更新
   */
  get maxLevel() {
    return this.rootTile.maxLevel;
  }
  /**
   * Set max level of map
   * 设置地图最大缩放级别，大于这个级别瓦片树不再更新
   */
  set maxLevel(e) {
    this.rootTile.maxLevel = e;
  }
  /**
   * Whether the LOD object is load data automatically by the renderer per frame or not.
   * 取得是否在每帧渲染时按需更新瓦片数据
   */
  get autoLoad() {
    return this.rootTile.autoLoad;
  }
  /**
   * Get whether the LOD object is load data automatically by the renderer per frame or not.
   * 设置是否在每帧渲染时按需更新瓦片数据
   */
  set autoLoad(e) {
    this.rootTile.autoLoad = e;
  }
  _autoAdjustZ = !1;
  /**
   * Get whether to adjust z of map automatically.
   * 取得是否自动根据视野内地形高度调整地图Z坐标
   */
  get autoAdjustZ() {
    return this._autoAdjustZ;
  }
  /**
   * Set whether to adjust z of map automatically.
   * 设置是否自动调整地图Z坐标，如果设置为true，将在每帧渲染中将地图Z坐标调整可视区域瓦片的平均高度
   */
  set autoAdjustZ(e) {
    this._autoAdjustZ = e;
  }
  /**
   * Get the number of  download cache files.
   * 取得瓦片下载缓存文件数量。
   */
  get loadCacheSize() {
    return this.loader.cacheSize;
  }
  /**
   * Set the number of  download cache files.
   * 设置瓦片下载缓存文件数量。使用该属性限制缓存瓦片数量，较大的缓存能加快数据下载速度，但会增加内存使用量，一般取<1000。
   */
  set loadCacheSize(e) {
    this.loader.cacheSize = e;
  }
  /**
   * Get the render cache size. Default:1.2
   * 取得瓦片渲染缓冲大小
   */
  get viewerBufferSize() {
    return this.rootTile.viewerbufferSize * 2;
  }
  /**
   * Set the render cache size. Default:1.2.
   * 设置瓦片视图缓冲大小（取值范围1.2-5.0，默认1.2）.
   * 在判断瓦片是否在可视范围时，将瓦片大小扩大该属性倍来判断，可预加载部分不在可视范围的瓦片，增大viewerBufferSize可预加载较多瓦片，但也增大了数据下载量并占用更多资源。
   */
  set viewerBufferSize(e) {
    this.rootTile.viewerbufferSize = e / 2;
  }
  /**
   * Get max height in view
   * 取得可视范围内瓦片的最高高度
   */
  get maxZInView() {
    return this.rootTile.maxZ;
  }
  /**
   * Set min height in view
   * 取得可视范围内瓦片的最低高度
   */
  get minZInView() {
    return this.rootTile.minZ;
  }
  /**
   * Get avg hegiht in view
   * 取得可视范围内瓦片的平均高度
   */
  get avgZInView() {
    return this.rootTile.avgZ;
  }
  _centralMeridian = 0;
  /**
   * Get central Meridian latidute
   * 取得子午线经度
   */
  get centralMeridian() {
    return this._centralMeridian;
  }
  /**
   * Set central Meridian latidute, default:0
   * 设置子午线经度，子午线经度决定了地图的投影中心经度，可设置为-90，0，90
   */
  set centralMeridian(e) {
    e != 0 && this.rootTile.minLevel < 1 && console.warn(`Map centralMeridian is ${this.centralMeridian}, minLevel must > 0`), this._centralMeridian = e, this.reload();
  }
  _projection = new Ke();
  /**
   * Set the map projection object
   * 取得地图投影对象
   */
  get projection() {
    return this._projection;
  }
  /**
   * Get the map projection object
   * 设置地图投影对象
   */
  set projection(e) {
    this.rootTile.scale.set(e.mapWidth, e.mapHeight, e.mapDepth), e.ID != this.projection.ID && (this.rootTile.isWGS = e.isWGS, this._projection = e, this.reload(), console.log("Map Projection Changed:", e.ID), this.dispatchEvent({
      type: "projection-changed",
      projection: e
    }));
  }
  /**
   * Get the image data source object
   * 取得影像数据源
   */
  get imgSource() {
    return this.loader.imgSource;
  }
  /**
   * Set the image data source object
   * 设置影像数据源
   */
  set imgSource(e) {
    this.loader.imgSource = Array.isArray(e) ? e : [e], this._setMapProjection(), this._setTileCoordConvert(), this.dispatchEvent({ type: "source-changed", source: e });
  }
  /**
   * Get the terrain data source
   * 设置地形数据源
   */
  get demSource() {
    return this.loader.demSource;
  }
  /**
   * Set the terrain data source
   * 取得地形数据源
   */
  set demSource(e) {
    this.loader.demSource = e, this._setTileCoordConvert(), this.dispatchEvent({ type: "source-changed", source: e });
  }
  /**
   * Get LOD threshold
   * 取得LOD阈值
   */
  get LODThreshold() {
    return this.rootTile.LODThreshold;
  }
  /**
   * Set LOD threshold
   * 设置LOD阈值，LOD阈值越大，使用更多瓦片显示，地图越清晰，但耗费资源越高，建议取0.8-5之间
   */
  set LODThreshold(e) {
    this.rootTile.LODThreshold = e;
  }
  /**
      * Create a map using factory function
      * 地图创建工厂函数
        @param params 地图参数 {@link MapParams}
        @returns map mesh 地图模型
        @example
        ``` typescript
         TileMap.create({
             // 影像数据源
             imgSource: [Source.mapBoxImgSource, new TestSource()],
             // 高程数据源
             demSource: source.mapBoxDemSource,
             // 地图投影中心经度
             centralMeridian: 90,
             // 最小缩放级别
             minLevel: 1,
             // 最大缩放级别
             maxLevel: 18,
         });
        ```
      */
  static create(e) {
    let r = e.imgSource;
    Array.isArray(r) || (r = [r]);
    const t = new rr(r, e.demSource), n = new Ie(t, 0, 0, 0);
    return new Ve({
      loader: t,
      rootTile: n,
      centralMeridian: e.centralMeridian,
      minLevel: e.minLevel,
      maxLevel: e.maxLevel
    });
  }
  /**
   * Map mesh constructor
   *
   * 地图模型构造函数
   * @param params 地图构造参数 {@link MapContructParams}     *
   * @example
   * ``` typescript
   *  const imgSource = [Source.mapBoxImgSource, new tt.TestSource()];
   *  const demSource = Source.mapBoxDemSource;
   *  const loader = new tt.TileLoader(imgSource, demSource, 2, 18);
   *  const map = new TileMap({ loader, centralMeridian: 90 });
   * ```
   */
  constructor(e) {
    super(), this.loader = e.loader, this.rootTile = e.rootTile || new Ie(this.loader), this.rootTile.minLevel = e.minLevel || 0, this.rootTile.maxLevel = e.maxLevel || 18, this.projection = Y.createFromSource(this.loader.imgSource[0] || "3857"), this.centralMeridian = e.centralMeridian || 0, this._setTileCoordConvert(), this._attachEvent(), this.add(this.rootTile), this.rootTile.updateMatrix(), this.rootTile.updateMatrixWorld();
  }
  _setTileCoordConvert() {
    const e = this;
    function r(t, n, o) {
      const a = Math.pow(2, o);
      let c = t + Math.round(a / 360 * e.centralMeridian);
      return c >= a ? c -= a : c < 0 && (c += a), { x: c, y: n, z: o };
    }
    this.loader.imgSource.forEach((t) => {
      t.onGetUrl || (t.onGetUrl = r);
    }), this.loader.demSource && (this.loader.demSource.onGetUrl = r);
  }
  _setMapProjection() {
    const e = this.loader.imgSource[0].projection;
    this.projection.ID != e && (this.projection = Y.createFromID(e));
  }
  /**
   * Update the map, It is automatically called after mesh adding a scene
   * 模型更新回调函数，地图加入场景后会在每帧更新时被调用，该函数调用根瓦片实现瓦片树更新和数据加载
   * @param camera
   */
  update(e) {
    this.rootTile.receiveShadow = this.receiveShadow, this.rootTile.castShadow = this.castShadow, this.autoAdjustZ && this.position.setZ((this.position.z - this.avgZInView / 100) / 1.03), this.rootTile.update(e), this.dispatchEvent({ type: "update", delta: this._clock.getDelta() });
  }
  /**
   * reload the map data，muse called after the source has changed
   * 重新加载地图，在改变地图数据源后调用它才能生效
   */
  reload() {
    this.rootTile.dispose(!0), this.position.setZ(0);
  }
  /**
   * dispose map.
   * todo: remve event.
   * 释放地图资源，并移出场景
   */
  dispose() {
    this.removeFromParent(), this.reload();
  }
  /**
   * Get map data attributions information
   * 取得地图数据归属版权信息
   * @returns Attributions 版权信息数组
   */
  get attributions() {
    const e = [];
    let r = this.imgSource;
    if (Array.isArray(r) || (r = [r]), r.forEach((t) => {
      const n = t.attribution;
      n && e.push(n);
    }), this.demSource) {
      const t = this.demSource.attribution;
      t && e.push(t);
    }
    return Array.from(new Set(e));
  }
  /**
   * Geo coordinates converted to model coordinates
   * 地理坐标转换为地图模型坐标
   * @param geo 地理坐标（经纬度）
   * @returns 模型坐标
   */
  geo2pos(e) {
    const r = this._projection.project(e.x, e.y, this.centralMeridian);
    return new p(r.x, r.y, e.z);
  }
  /**
   * Model coordinates converted to coordinates geo
   * 模型坐标转换为地理坐标
   * @param pos 模型坐标
   * @returns 地理坐标（经纬度）
   */
  pos2geo(e) {
    const r = this._projection.unProject(e.x, e.y, this.centralMeridian);
    return new p(r.lon, r.lat, e.z);
  }
  /**
   * Get the ground infomation for the specified latitude and longitude
   * 获取指定经纬度的地面信息（法向量、高度等）
   * @param geo 地理坐标
   * @returns 地面信息
   */
  getLocalInfoFromGeo(e) {
    const r = this.geo2pos(e);
    return ze(this, r);
  }
  /**
   * Get loacation infomation from world position
   * 获取指定世界坐标的地面信息
   * @param pos 世界坐标
   * @returns 地面信息
   */
  getLocalInfoFromWorld(e) {
    return ze(this, e);
  }
  /**
   * Get loacation infomation from screen point
   * 获取指定屏幕坐标的地面信息
   * @param camera 摄像机
   * @param pointer 点的屏幕坐标（-0.5~0.5）
   * @returns 位置信息（经纬度、高度等）
   */
  getLocalInfoFromScreen(e, r) {
    return pr(e, this, r);
  }
  /**
   * Get map tiles statistics to debug
   * @returns 取得瓦片统计信息，用于调试性能
   */
  getTileCount() {
    let e = 0, r = 0, t = 0, n = 0;
    return this.rootTile.traverse((o) => {
      o.isTile && (e++, o.isLeafInFrustum && r++, o.isLeaf && n++, t = Math.max(t, o.coord.z));
    }), { total: e, visible: r, leaf: n, maxLevle: t };
  }
  /**
   * Listen tile event.
   * 监听瓦片数据加载等事件，并将事件挂接到TileMap上以方便使用
   */
  _attachEvent() {
    const e = this.loader.manager;
    return e.onStart = (r, t, n) => {
      this.dispatchEvent({
        type: "loading-start",
        itemsLoaded: t,
        itemsTotal: n
      });
    }, e.onError = (r) => {
      this.dispatchEvent({ type: "loading-error", url: r });
    }, e.onLoad = () => {
      this.dispatchEvent({ type: "loading-complete" });
    }, e.onProgress = (r, t, n) => {
      this.dispatchEvent({
        type: "loading-progress",
        url: r,
        itemsLoaded: t,
        itemsTotal: n
      });
    }, this.rootTile.addEventListener("tile-created", (r) => {
      this.dispatchEvent({ type: "tile-created", tile: r.tile });
    }), this.rootTile.addEventListener("tile-loaded", (r) => {
      this.dispatchEvent({ type: "tile-loaded", tile: r.tile });
    }), this.rootTile.addEventListener("loaded", () => {
      this.dispatchEvent({ type: "loaded" });
    }), this;
  }
}
class fr {
  dataType = "debug";
  load(e, r, t, n) {
    const o = (l) => {
      const h = l.target;
      h.map?.image instanceof ImageBitmap && h.map.image.close(), h.map?.dispose(), h.removeEventListener("dispose", o);
    }, a = new bt(this.drawTile(r));
    a.needsUpdate = !0;
    const c = new K({
      transparent: !0,
      map: a,
      opacity: e.opacity
    });
    return c.addEventListener("dispose", o), setTimeout(t), c;
  }
  /**
   * draw a box and coordiante
   * @param tile
   * @returns bitmap
   */
  drawTile(e) {
    const t = new OffscreenCanvas(256, 256), n = t.getContext("2d");
    return n.scale(1, -1), n.translate(0, -256), n && (n.strokeStyle = "#ccc", n.lineWidth = 4, n.strokeRect(5, 5, 256 - 10, 256 - 10), n.fillStyle = "white", n.shadowColor = "black", n.shadowBlur = 5, n.shadowOffsetX = 1, n.shadowOffsetY = 1, n.font = "bold 20px arial", n.textAlign = "center", n.fillText(`Tile Test - level: ${e.coord.z}`, 256 / 2, 50), n.fillText(`[${e.coord.x}, ${e.coord.y}]`, 256 / 2, 80)), t.transferToImageBitmap();
  }
}
_.registerMaterialLoader(new fr());
class gr {
  dataType = "logo";
  /**
   * 加载材质
   * @param source 数据源
   * @param tile 瓦片
   * @param onLoad 加载完成回调
   * @returns 材质
   */
  load(e, r, t, n) {
    if (r.coord.z < 4)
      return setTimeout(t), new K();
    const o = new de(this.drawLogo(e.attribution));
    o.needsUpdate = !0;
    const a = new K({
      transparent: !0,
      map: o,
      opacity: e.opacity
    }), c = (l) => {
      const h = l.target;
      h.map?.image instanceof ImageBitmap && h.map.image.close(), h.map?.dispose(), h.removeEventListener("dispose", c);
    };
    return a.addEventListener("dispose", c), setTimeout(t), a;
  }
  /**
   * draw LOGO
   * @param logo text
   * @returns bitmap
   */
  drawLogo(e) {
    const t = new OffscreenCanvas(256, 256), n = t.getContext("2d");
    return n.scale(1, -1), n.translate(0, -256), n && (n.fillStyle = "white", n.shadowColor = "black", n.shadowBlur = 5, n.shadowOffsetX = 1, n.shadowOffsetY = 1, n.font = "bold 14px arial", n.textAlign = "center", n.translate(256 / 2, 256 / 2), n.rotate(30 * Math.PI / 180), n.fillText(`${e}`, 0, 0)), t.transferToImageBitmap();
  }
}
_.registerMaterialLoader(new gr());
class yr {
  dataType = "normal";
  load(e, r, t, n) {
    const o = new _t({
      transparent: !0,
      opacity: e.opacity,
      flatShading: !0
    });
    return setTimeout(t), o;
  }
}
_.registerMaterialLoader(new yr());
class vr {
  dataType = "wireframe";
  load(e, r, t, n) {
    const o = new X(`hsl(${r.coord.z * 14}, 100%, 50%)`), a = new K({
      transparent: !0,
      wireframe: !0,
      color: o,
      opacity: e.opacity
    });
    return setTimeout(t), a;
  }
}
_.registerMaterialLoader(new vr());
const ke = { type: "change" }, ae = { type: "start" }, Re = { type: "end" };
class br extends Ne {
  constructor(e, r) {
    super(), this.object = e, this.domElement = r, this.domElement.style.touchAction = "none", this.enabled = !0, this.target = new p(), this.minDistance = 0, this.maxDistance = 1 / 0, this.minZoom = 0, this.maxZoom = 1 / 0, this.minPolarAngle = 0, this.maxPolarAngle = Math.PI, this.minAzimuthAngle = -1 / 0, this.maxAzimuthAngle = 1 / 0, this.enableDamping = !1, this.dampingFactor = 0.05, this.enableZoom = !0, this.zoomSpeed = 1, this.enableRotate = !0, this.rotateSpeed = 1, this.enablePan = !0, this.panSpeed = 1, this.screenSpacePanning = !0, this.keyPanSpeed = 7, this.autoRotate = !1, this.autoRotateSpeed = 2, this.keys = { LEFT: "ArrowLeft", UP: "ArrowUp", RIGHT: "ArrowRight", BOTTOM: "ArrowDown" }, this.mouseButtons = { LEFT: k.ROTATE, MIDDLE: k.DOLLY, RIGHT: k.PAN }, this.touches = { ONE: U.ROTATE, TWO: U.DOLLY_PAN }, this.target0 = this.target.clone(), this.position0 = this.object.position.clone(), this.zoom0 = this.object.zoom, this._domElementKeyEvents = null, this.getPolarAngle = function() {
      return c.phi;
    }, this.getAzimuthalAngle = function() {
      return c.theta;
    }, this.getDistance = function() {
      return this.object.position.distanceTo(this.target);
    }, this.listenToKeyEvents = function(i) {
      i.addEventListener("keydown", te), this._domElementKeyEvents = i;
    }, this.stopListenToKeyEvents = function() {
      this._domElementKeyEvents.removeEventListener("keydown", te), this._domElementKeyEvents = null;
    }, this.saveState = function() {
      t.target0.copy(t.target), t.position0.copy(t.object.position), t.zoom0 = t.object.zoom;
    }, this.reset = function() {
      t.target.copy(t.target0), t.object.position.copy(t.position0), t.object.zoom = t.zoom0, t.object.updateProjectionMatrix(), t.dispatchEvent(ke), t.update(), o = n.NONE;
    }, this.update = function() {
      const i = new p(), u = new Pe().setFromUnitVectors(e.up, new p(0, 1, 0)), y = u.clone().invert(), b = new p(), E = new Pe(), N = 2 * Math.PI;
      return function() {
        const Me = t.object.position;
        i.copy(Me).sub(t.target), i.applyQuaternion(u), c.setFromVector3(i), t.autoRotate && o === n.NONE && S(R()), t.enableDamping ? (c.theta += l.theta * t.dampingFactor, c.phi += l.phi * t.dampingFactor) : (c.theta += l.theta, c.phi += l.phi);
        let I = t.minAzimuthAngle, z = t.maxAzimuthAngle;
        return isFinite(I) && isFinite(z) && (I < -Math.PI ? I += N : I > Math.PI && (I -= N), z < -Math.PI ? z += N : z > Math.PI && (z -= N), I <= z ? c.theta = Math.max(I, Math.min(z, c.theta)) : c.theta = c.theta > (I + z) / 2 ? Math.max(I, c.theta) : Math.min(z, c.theta)), c.phi = Math.max(t.minPolarAngle, Math.min(t.maxPolarAngle, c.phi)), c.makeSafe(), c.radius *= h, c.radius = Math.max(t.minDistance, Math.min(t.maxDistance, c.radius)), t.enableDamping === !0 ? t.target.addScaledVector(d, t.dampingFactor) : t.target.add(d), i.setFromSpherical(c), i.applyQuaternion(y), Me.copy(t.target).add(i), t.object.lookAt(t.target), t.enableDamping === !0 ? (l.theta *= 1 - t.dampingFactor, l.phi *= 1 - t.dampingFactor, d.multiplyScalar(1 - t.dampingFactor)) : (l.set(0, 0, 0), d.set(0, 0, 0)), h = 1, L || b.distanceToSquared(t.object.position) > a || 8 * (1 - E.dot(t.object.quaternion)) > a ? (t.dispatchEvent(ke), b.copy(t.object.position), E.copy(t.object.quaternion), L = !1, !0) : !1;
      };
    }(), this.dispose = function() {
      t.domElement.removeEventListener("contextmenu", Le), t.domElement.removeEventListener("pointerdown", we), t.domElement.removeEventListener("pointercancel", W), t.domElement.removeEventListener("wheel", Te), t.domElement.removeEventListener("pointermove", ee), t.domElement.removeEventListener("pointerup", W), t._domElementKeyEvents !== null && (t._domElementKeyEvents.removeEventListener("keydown", te), t._domElementKeyEvents = null);
    };
    const t = this, n = {
      NONE: -1,
      ROTATE: 0,
      DOLLY: 1,
      PAN: 2,
      TOUCH_ROTATE: 3,
      TOUCH_PAN: 4,
      TOUCH_DOLLY_PAN: 5,
      TOUCH_DOLLY_ROTATE: 6
    };
    let o = n.NONE;
    const a = 1e-6, c = new De(), l = new De();
    let h = 1;
    const d = new p();
    let L = !1;
    const v = new x(), f = new x(), M = new x(), T = new x(), A = new x(), C = new x(), j = new x(), O = new x(), g = new x(), m = [], P = {};
    function R() {
      return 2 * Math.PI / 60 / 60 * t.autoRotateSpeed;
    }
    function D() {
      return Math.pow(0.95, t.zoomSpeed);
    }
    function S(i) {
      l.theta -= i;
    }
    function F(i) {
      l.phi -= i;
    }
    const ue = function() {
      const i = new p();
      return function(y, b) {
        i.setFromMatrixColumn(b, 0), i.multiplyScalar(-y), d.add(i);
      };
    }(), he = function() {
      const i = new p();
      return function(y, b) {
        t.screenSpacePanning === !0 ? i.setFromMatrixColumn(b, 1) : (i.setFromMatrixColumn(b, 0), i.crossVectors(t.object.up, i)), i.multiplyScalar(y), d.add(i);
      };
    }(), B = function() {
      const i = new p();
      return function(y, b) {
        const E = t.domElement;
        if (t.object.isPerspectiveCamera) {
          const N = t.object.position;
          i.copy(N).sub(t.target);
          let $ = i.length();
          $ *= Math.tan(t.object.fov / 2 * Math.PI / 180), ue(2 * y * $ / E.clientHeight, t.object.matrix), he(2 * b * $ / E.clientHeight, t.object.matrix);
        } else
          t.object.isOrthographicCamera ? (ue(y * (t.object.right - t.object.left) / t.object.zoom / E.clientWidth, t.object.matrix), he(b * (t.object.top - t.object.bottom) / t.object.zoom / E.clientHeight, t.object.matrix)) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."), t.enablePan = !1);
      };
    }();
    function J(i) {
      t.object.isPerspectiveCamera ? h /= i : t.object.isOrthographicCamera ? (t.object.zoom = Math.max(t.minZoom, Math.min(t.maxZoom, t.object.zoom * i)), t.object.updateProjectionMatrix(), L = !0) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), t.enableZoom = !1);
    }
    function me(i) {
      t.object.isPerspectiveCamera ? h *= i : t.object.isOrthographicCamera ? (t.object.zoom = Math.max(t.minZoom, Math.min(t.maxZoom, t.object.zoom / i)), t.object.updateProjectionMatrix(), L = !0) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), t.enableZoom = !1);
    }
    function pe(i) {
      v.set(i.clientX, i.clientY);
    }
    function qe(i) {
      j.set(i.clientX, i.clientY);
    }
    function fe(i) {
      T.set(i.clientX, i.clientY);
    }
    function Qe(i) {
      f.set(i.clientX, i.clientY), M.subVectors(f, v).multiplyScalar(t.rotateSpeed);
      const u = t.domElement;
      S(2 * Math.PI * M.x / u.clientHeight), F(2 * Math.PI * M.y / u.clientHeight), v.copy(f), t.update();
    }
    function Je(i) {
      O.set(i.clientX, i.clientY), g.subVectors(O, j), g.y > 0 ? J(D()) : g.y < 0 && me(D()), j.copy(O), t.update();
    }
    function et(i) {
      A.set(i.clientX, i.clientY), C.subVectors(A, T).multiplyScalar(t.panSpeed), B(C.x, C.y), T.copy(A), t.update();
    }
    function tt(i) {
      i.deltaY < 0 ? me(D()) : i.deltaY > 0 && J(D()), t.update();
    }
    function rt(i) {
      let u = !1;
      switch (i.code) {
        case t.keys.UP:
          i.ctrlKey || i.metaKey || i.shiftKey ? F(2 * Math.PI * t.rotateSpeed / t.domElement.clientHeight) : B(0, t.keyPanSpeed), u = !0;
          break;
        case t.keys.BOTTOM:
          i.ctrlKey || i.metaKey || i.shiftKey ? F(-2 * Math.PI * t.rotateSpeed / t.domElement.clientHeight) : B(0, -t.keyPanSpeed), u = !0;
          break;
        case t.keys.LEFT:
          i.ctrlKey || i.metaKey || i.shiftKey ? S(2 * Math.PI * t.rotateSpeed / t.domElement.clientHeight) : B(t.keyPanSpeed, 0), u = !0;
          break;
        case t.keys.RIGHT:
          i.ctrlKey || i.metaKey || i.shiftKey ? S(-2 * Math.PI * t.rotateSpeed / t.domElement.clientHeight) : B(-t.keyPanSpeed, 0), u = !0;
          break;
      }
      u && (i.preventDefault(), t.update());
    }
    function ge() {
      if (m.length === 1)
        v.set(m[0].pageX, m[0].pageY);
      else {
        const i = 0.5 * (m[0].pageX + m[1].pageX), u = 0.5 * (m[0].pageY + m[1].pageY);
        v.set(i, u);
      }
    }
    function ye() {
      if (m.length === 1)
        T.set(m[0].pageX, m[0].pageY);
      else {
        const i = 0.5 * (m[0].pageX + m[1].pageX), u = 0.5 * (m[0].pageY + m[1].pageY);
        T.set(i, u);
      }
    }
    function ve() {
      const i = m[0].pageX - m[1].pageX, u = m[0].pageY - m[1].pageY, y = Math.sqrt(i * i + u * u);
      j.set(0, y);
    }
    function nt() {
      t.enableZoom && ve(), t.enablePan && ye();
    }
    function it() {
      t.enableZoom && ve(), t.enableRotate && ge();
    }
    function be(i) {
      if (m.length == 1)
        f.set(i.pageX, i.pageY);
      else {
        const y = re(i), b = 0.5 * (i.pageX + y.x), E = 0.5 * (i.pageY + y.y);
        f.set(b, E);
      }
      M.subVectors(f, v).multiplyScalar(t.rotateSpeed);
      const u = t.domElement;
      S(2 * Math.PI * M.x / u.clientHeight), F(2 * Math.PI * M.y / u.clientHeight), v.copy(f);
    }
    function _e(i) {
      if (m.length === 1)
        A.set(i.pageX, i.pageY);
      else {
        const u = re(i), y = 0.5 * (i.pageX + u.x), b = 0.5 * (i.pageY + u.y);
        A.set(y, b);
      }
      C.subVectors(A, T).multiplyScalar(t.panSpeed), B(C.x, C.y), T.copy(A);
    }
    function xe(i) {
      const u = re(i), y = i.pageX - u.x, b = i.pageY - u.y, E = Math.sqrt(y * y + b * b);
      O.set(0, E), g.set(0, Math.pow(O.y / j.y, t.zoomSpeed)), J(g.y), j.copy(O);
    }
    function ot(i) {
      t.enableZoom && xe(i), t.enablePan && _e(i);
    }
    function st(i) {
      t.enableZoom && xe(i), t.enableRotate && be(i);
    }
    function we(i) {
      t.enabled !== !1 && (m.length === 0 && (t.domElement.setPointerCapture(i.pointerId), t.domElement.addEventListener("pointermove", ee), t.domElement.addEventListener("pointerup", W)), ut(i), i.pointerType === "touch" ? lt(i) : at(i));
    }
    function ee(i) {
      t.enabled !== !1 && (i.pointerType === "touch" ? dt(i) : ct(i));
    }
    function W(i) {
      ht(i), m.length === 0 && (t.domElement.releasePointerCapture(i.pointerId), t.domElement.removeEventListener("pointermove", ee), t.domElement.removeEventListener("pointerup", W)), t.dispatchEvent(Re), o = n.NONE;
    }
    function at(i) {
      let u;
      switch (i.button) {
        case 0:
          u = t.mouseButtons.LEFT;
          break;
        case 1:
          u = t.mouseButtons.MIDDLE;
          break;
        case 2:
          u = t.mouseButtons.RIGHT;
          break;
        default:
          u = -1;
      }
      switch (u) {
        case k.DOLLY:
          if (t.enableZoom === !1)
            return;
          qe(i), o = n.DOLLY;
          break;
        case k.ROTATE:
          if (i.ctrlKey || i.metaKey || i.shiftKey) {
            if (t.enablePan === !1)
              return;
            fe(i), o = n.PAN;
          } else {
            if (t.enableRotate === !1)
              return;
            pe(i), o = n.ROTATE;
          }
          break;
        case k.PAN:
          if (i.ctrlKey || i.metaKey || i.shiftKey) {
            if (t.enableRotate === !1)
              return;
            pe(i), o = n.ROTATE;
          } else {
            if (t.enablePan === !1)
              return;
            fe(i), o = n.PAN;
          }
          break;
        default:
          o = n.NONE;
      }
      o !== n.NONE && t.dispatchEvent(ae);
    }
    function ct(i) {
      switch (o) {
        case n.ROTATE:
          if (t.enableRotate === !1)
            return;
          Qe(i);
          break;
        case n.DOLLY:
          if (t.enableZoom === !1)
            return;
          Je(i);
          break;
        case n.PAN:
          if (t.enablePan === !1)
            return;
          et(i);
          break;
      }
    }
    function Te(i) {
      t.enabled === !1 || t.enableZoom === !1 || o !== n.NONE || (i.preventDefault(), t.dispatchEvent(ae), tt(i), t.dispatchEvent(Re));
    }
    function te(i) {
      t.enabled === !1 || t.enablePan === !1 || rt(i);
    }
    function lt(i) {
      switch (Se(i), m.length) {
        case 1:
          switch (t.touches.ONE) {
            case U.ROTATE:
              if (t.enableRotate === !1)
                return;
              ge(), o = n.TOUCH_ROTATE;
              break;
            case U.PAN:
              if (t.enablePan === !1)
                return;
              ye(), o = n.TOUCH_PAN;
              break;
            default:
              o = n.NONE;
          }
          break;
        case 2:
          switch (t.touches.TWO) {
            case U.DOLLY_PAN:
              if (t.enableZoom === !1 && t.enablePan === !1)
                return;
              nt(), o = n.TOUCH_DOLLY_PAN;
              break;
            case U.DOLLY_ROTATE:
              if (t.enableZoom === !1 && t.enableRotate === !1)
                return;
              it(), o = n.TOUCH_DOLLY_ROTATE;
              break;
            default:
              o = n.NONE;
          }
          break;
        default:
          o = n.NONE;
      }
      o !== n.NONE && t.dispatchEvent(ae);
    }
    function dt(i) {
      switch (Se(i), o) {
        case n.TOUCH_ROTATE:
          if (t.enableRotate === !1)
            return;
          be(i), t.update();
          break;
        case n.TOUCH_PAN:
          if (t.enablePan === !1)
            return;
          _e(i), t.update();
          break;
        case n.TOUCH_DOLLY_PAN:
          if (t.enableZoom === !1 && t.enablePan === !1)
            return;
          ot(i), t.update();
          break;
        case n.TOUCH_DOLLY_ROTATE:
          if (t.enableZoom === !1 && t.enableRotate === !1)
            return;
          st(i), t.update();
          break;
        default:
          o = n.NONE;
      }
    }
    function Le(i) {
      t.enabled !== !1 && i.preventDefault();
    }
    function ut(i) {
      m.push(i);
    }
    function ht(i) {
      delete P[i.pointerId];
      for (let u = 0; u < m.length; u++)
        if (m[u].pointerId == i.pointerId) {
          m.splice(u, 1);
          return;
        }
    }
    function Se(i) {
      let u = P[i.pointerId];
      u === void 0 && (u = new x(), P[i.pointerId] = u), u.set(i.pageX, i.pageY);
    }
    function re(i) {
      const u = i.pointerId === m[0].pointerId ? m[1] : m[0];
      return P[u.pointerId];
    }
    t.domElement.addEventListener("contextmenu", Le), t.domElement.addEventListener("pointerdown", we), t.domElement.addEventListener("pointercancel", W), t.domElement.addEventListener("wheel", Te, { passive: !1 }), this.update();
  }
}
class _r extends br {
  constructor(e, r) {
    super(e, r), this.screenSpacePanning = !1, this.mouseButtons = { LEFT: k.PAN, MIDDLE: k.DOLLY, RIGHT: k.ROTATE }, this.touches = { ONE: U.PAN, TWO: U.DOLLY_ROTATE };
  }
}
xt.DEFAULT_UP.set(0, 0, 1);
class xr extends Ne {
  scene;
  renderer;
  camera;
  controls;
  ambLight;
  dirLight;
  container;
  _clock = new Be();
  _fogFactor = 1;
  get fogFactor() {
    return this._fogFactor;
  }
  set fogFactor(e) {
    this._fogFactor = e, this.controls.dispatchEvent({ type: "change", target: this.controls });
  }
  get width() {
    return this.container.clientWidth;
  }
  get height() {
    return this.container.clientHeight;
  }
  constructor(e, r = new p(0, 3e3, 0), t = new p(0, -1e3, 1e4)) {
    super(), this.container = e, this.renderer = this._createRenderer(), this.scene = this._createScene(), this.camera = this._createCamera(t), this.controls = this._createControls(r, this.camera, e), this.ambLight = this._createAmbLight(), this.scene.add(this.ambLight), this.dirLight = this._createDirLight(), this.scene.add(this.dirLight), this.container.appendChild(this.renderer.domElement), window.addEventListener("resize", this.resize.bind(this)), this.resize(), this.animate();
  }
  _createScene() {
    const e = new wt(), r = 14414079;
    return e.background = new X(r), e.fog = new Ce(r, 0), e;
  }
  _createRenderer() {
    const e = new Tt({
      antialias: !1,
      alpha: !0,
      logarithmicDepthBuffer: !0,
      precision: "highp"
    });
    return e.debug.checkShaderErrors = !0, e.toneMapping = 0, e.sortObjects = !0, e.setPixelRatio(window.devicePixelRatio), e;
  }
  _createCamera(e) {
    const r = new Lt(70, 1, 0.1, 5e4);
    return r.position.copy(e), r;
  }
  _createControls(e, r, t) {
    const n = new _r(r, t);
    return n.target.copy(e), n.minDistance = 0.1, n.maxDistance = 3e4, n.maxPolarAngle = 1.1, n.enableDamping = !0, n.keyPanSpeed = 5, n.listenToKeyEvents(window), n.addEventListener("change", () => {
      const o = Math.max(this.controls.getPolarAngle(), 0.1), a = Math.max(this.controls.getDistance(), 0.1);
      n.zoomSpeed = Math.max(Math.log(a), 1.8), this.camera.far = H.clamp(a / o * 8, 100, 5e4), this.camera.near = this.camera.far / 1e3, this.camera.updateProjectionMatrix(), this.scene.fog instanceof Ce && (this.scene.fog.density = o / (a + 5) / 4 * this.fogFactor), a > 8e3 ? (n.minAzimuthAngle = 0, n.maxAzimuthAngle = 0) : (n.minAzimuthAngle = -1 / 0, n.maxAzimuthAngle = 1 / 0), n.maxPolarAngle = Math.min(Math.pow(1e4, 4) / Math.pow(a, 4), 1.1);
    }), n.saveState(), n;
  }
  _createAmbLight() {
    return new St(16777215, 0.5);
  }
  _createDirLight() {
    const e = new Mt(16777215, 0.5);
    return e.target.position.copy(this.controls.target), e.position.set(-1e3, -2e3, 1e4), e;
  }
  resize() {
    const e = this.width, r = this.height;
    return this.renderer.setPixelRatio(window.devicePixelRatio), this.renderer.setSize(e, r), this.camera.aspect = e / r, this.camera.updateProjectionMatrix(), this;
  }
  animate() {
    this.controls.update(), this.renderer.render(this.scene, this.camera), this.dispatchEvent({ type: "update", delta: this._clock.getDelta() }), requestAnimationFrame(this.animate.bind(this));
  }
}
class wr extends w {
  token = "";
  format = "webp";
  style = "mapbox.satellite";
  attribution = "MapBox";
  maxLevel = 19;
  url = "https://api.mapbox.com/v4/{style}/{z}/{x}/{y}.{format}?access_token={token}";
  constructor(e) {
    super(e), Object.assign(this, e);
  }
}
class Tr extends w {
  dataType = "image";
  attribution = "ArcGIS";
  style = "World_Imagery";
  url = "https://services.arcgisonline.com/arcgis/rest/services/{style}/MapServer/tile/{z}/{y}/{x}";
  constructor(e) {
    super(e), Object.assign(this, e);
  }
}
class Lr extends w {
  dataType = "lerc";
  attribution = "ArcGIS";
  maxLevel = 13;
  url = "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer/tile/{z}/{y}/{x}";
  constructor(e) {
    super(e), Object.assign(this, e);
  }
}
class Sr extends w {
  dataType = "image";
  attribution = "Bing[GS(2021)1731号]";
  style = "A";
  mkt = "zh-CN";
  subdomains = "123";
  constructor(e) {
    super(e), Object.assign(this, e);
  }
  getUrl(e, r, t) {
    const n = Mr(t, e, r);
    return `https://t${this.s}.dynamic.tiles.ditu.live.com/comp/ch/${n}?mkt=${this.mkt}&ur=CN&it=${this.style}&n=z&og=804&cstl=vb`;
  }
}
function Mr(s, e, r) {
  let t = "";
  for (let n = s; n > 0; n--) {
    const o = 1 << n - 1;
    let a = 0;
    e & o && a++, r & o && (a += 2), t += a;
  }
  return t;
}
class Er extends w {
  dataType = "image";
  attribution = "高德[GS(2021)6375号]";
  style = "8";
  subdomains = "1234";
  maxLevel = 18;
  url = "https://webst0{s}.is.autonavi.com/appmaptile?style={style}&x={x}&y={y}&z={z}";
  constructor(e) {
    super(e), Object.assign(this, e);
  }
}
class Ar extends w {
  dataType = "image";
  maxLevel = 16;
  attribution = "GeoQ[GS(2019)758号]";
  style = "ChinaOnlineStreetPurplishBlue";
  url = "https://map.geoq.cn/ArcGIS/rest/services/{style}/MapServer/tile/{z}/{y}/{x}";
  constructor(e) {
    super(e), Object.assign(this, e);
  }
}
class Pr extends w {
  dataType = "image";
  attribution = "Google";
  maxLevel = 20;
  style = "y";
  subdomains = "0123";
  // 已失效
  // public url = "https://gac-geo.googlecnapps.cn/maps/vt?lyrs={style}&x={x}&y={y}&z={z}";
  // 2024年新地址，不知道能坚持多久
  // public url = "https://gac-geo.googlecnapps.club/maps/vt?lyrs={style}&x={x}&y={y}&z={z}";
  // 想访问原版google，你懂的
  url = "http://mt{s}.google.com/vt/lyrs={style}&src=app&x={x}&y={y}&z={z}";
  constructor(e) {
    super(e), Object.assign(this, e);
  }
}
class Dr extends w {
  attribution = "MapTiler";
  token = "get_your_own_key_QmavnBrQwNGsQ8YvPzZg";
  format = "jpg";
  style = "satellite-v2";
  url = "https://api.maptiler.com/tiles/{style}/{z}/{x}/{y}.{format}?key={token}";
  constructor(e) {
    super(e), Object.assign(this, e);
  }
}
class Cr extends w {
  dataType = "image";
  attribution = "Stadia";
  url = "https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}.jpg";
  constructor(e) {
    super(e), Object.assign(this, e);
  }
}
class jr extends w {
  dataType = "image";
  attribution = "天地图[GS(2023)336号]";
  token = "";
  style = "img_w";
  subdomains = "01234";
  url = "https://t{s}.tianditu.gov.cn/DataServer?T={style}&x={x}&y={y}&l={z}&tk={token}";
  constructor(e) {
    super(e), Object.assign(this, e);
  }
  // public getUrl(x: number, y: number, z: number): string {
  //     const proj = this.projection === "3857" ? "w" : "c";
  //     const layer = this.style.substring(0, 3);
  //     return `https://${this.s}.tianditu.gov.cn/${this.style}/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=${layer}&STYLE=default&TILEMATRIXSET=${proj}&FORMAT=tiles&TILEMATRIX=${z}&TILEROW=${y}&TILECOL=${x}&tk=${this.token}`;
  // }
}
class Or extends w {
  dataType = "image";
  style = "sateTiles";
  attribution = "腾讯[GS(2023)1号]";
  subdomains = "0123";
  maxLevel = 18;
  constructor(e) {
    super(e), Object.assign(this, e);
  }
  getUrl(e, r, t) {
    const n = e >> 4, o = (1 << t) - r >> 4, a = Math.pow(2, t) - 1 - r;
    return `https://p${this.s}.map.gtimg.com/${this.style}/${t}/${n}/${o}/${e}_${a}.jpg`;
  }
}
class Ir extends w {
  attribution = "中科星图[GS(2022)3995号]";
  token = "";
  style = "img";
  format = "webp";
  subdomains = "12";
  url = "https://tiles{s}.geovisearth.com/base/v1/{style}/{z}/{x}/{y}?format={format}&tmsIds=w&token={token}";
  constructor(e) {
    super(e), Object.assign(this, e);
  }
}
const zr = `
varying vec2 vUv;
uniform vec3 bkColor;
uniform vec3 airColor;

void main() {  
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);  
}  
`, kr = `



varying vec2 vUv;
uniform vec3 bkColor;
uniform vec3 airColor;

void main() {   

    // 当前点距中点的距离
    float d = distance(vUv, vec2(0.5f))*5.0f;
    
    if(d<0.47f){
        // 球体颜色(<0.48)
        float a = smoothstep(0.4f,0.0f,0.48f-d);     
        gl_FragColor = vec4(vec3(0.0f), a);               
    } else if(d<0.48){
        float c = (d-0.47f)/0.01f;
        gl_FragColor =vec4(mix(vec3(0.0f),airColor,c*c),1.0f);
    } else if(d<0.52f){
        // 光晕(0.48-0.52)
        float c = (d-0.48f)/0.04f;
        gl_FragColor = vec4(mix(airColor,bkColor,sqrt(c)),1.0);
    } else{
        // 球体外颜色
        gl_FragColor = vec4(bkColor,1.0f);
    }
    
    #include <tonemapping_fragment>
    #include <encodings_fragment>    
    
}  
`;
class Xe extends Fe {
  constructor(e) {
    super({
      uniforms: Ue.merge([
        Et.fog,
        {
          bkColor: {
            value: e.bkColor
          },
          airColor: {
            value: e.airColor
          }
        }
      ]),
      transparent: !0,
      depthTest: !1,
      vertexShader: zr,
      fragmentShader: kr,
      lights: !1
    });
  }
}
class Rr extends le {
  get bkColor() {
    return this.material.uniforms.bkColor.value;
  }
  set bkColor(e) {
    this.material.uniforms.bkColor.value.set(e);
  }
  constructor(e, r = new X(6724044)) {
    super(new Z(5, 5), new Xe({ bkColor: e, airColor: r })), this.renderOrder = 999;
  }
}
const Nr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ArcGisDemSource: Lr,
  ArcGisSource: Tr,
  BingSource: Sr,
  EarthMaskMaterial: Xe,
  FakeEarth: Rr,
  GDSource: Er,
  GLViewer: xr,
  GeoqSource: Ar,
  GoogleSource: Pr,
  MapBoxSource: wr,
  MapTilerSource: Dr,
  StadiaSource: Cr,
  TDTSource: jr,
  TXSource: Or,
  ZKXTSource: Ir
}, Symbol.toStringTag, { value: "Module" })), Gr = Ge.version, Yr = Ge.author;
export {
  w as BaseSource,
  Jt as FileLoaderEx,
  Ye as ImageLoaderEx,
  _ as LoaderFactory,
  Ke as ProjMCT,
  hr as ProjWGS,
  Y as Projection,
  Ie as RootTile,
  Q as Tile,
  qt as TileGridGeometry,
  rr as TileLoader,
  Ve as TileMap,
  Ur as TileMaterial,
  Zr as TileSimpleGeometry,
  ir as TileTextureLoader,
  Yr as author,
  He as getSafeTileUrlAndRect,
  Nr as plugin,
  We as rect2ImageBounds,
  Br as resizeImage,
  Gr as version
};
