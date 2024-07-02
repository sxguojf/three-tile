import { Vector3 as m, PlaneGeometry as G, MeshBasicMaterial as J, Mesh as be, Matrix4 as jt, Frustum as At, Box3 as Ye, MeshLambertMaterial as Dt, FrontSide as It, MathUtils as H, Float32BufferAttribute as ue, Loader as re, LoadingManager as Ot, Vector2 as T, Box2 as Ge, Texture as we, SRGBColorSpace as Ct, BufferGeometry as zt, Raycaster as Je, Clock as et, CanvasTexture as kt, MeshNormalMaterial as Rt, Color as xe, Ray as Ft, Plane as Nt, EventDispatcher as tt, MOUSE as N, TOUCH as Y, Quaternion as Ze, Spherical as Ue, Scene as Bt, FogExp2 as We, WebGLRenderer as Yt, PerspectiveCamera as Gt, AmbientLight as Zt, DirectionalLight as Ut, ShaderMaterial as Wt, UniformsUtils as Ht, UniformsLib as Xt } from "three";
const Kt = "three-tile", $t = "0.6.1", Vt = "module", qt = [
  "dist",
  "images",
  "docs"
], Qt = "dist/three-tile.umd.cjs", Jt = "dist/three-tile.js", eo = "./dist/three-tile.es.d.ts", to = {
  ".": {
    import: "./dist/three-tile.js",
    require: "./dist/three-tile.umd.cjs",
    types: "./dist/three-tile.es.d.ts"
  }
}, oo = "A lightweight tile map using threejs", so = "GPL-3.0", io = {
  name: "GuoJiangfeng",
  email: "hz_gjf@163.com"
}, ro = [
  "three",
  "gis",
  "tile",
  "map",
  "3D",
  "cesium"
], no = {
  dev: "vite --config vite.config.dev.ts",
  lib: "tsc && vite build  --config vite.config.lib.ts",
  demo: "tsc && vite build  --config vite.config.demo.ts",
  docs: "typedoc src --out ./docs",
  test: "vitest"
}, ao = {
  "@types/node": "^20.2.3",
  "@types/offscreencanvas": "^2019.7.0",
  "@types/three": "^0.152.1",
  "@typescript-eslint/eslint-plugin": "^7.5.0",
  "@typescript-eslint/parser": "^7.5.0",
  esbuild: "^0.20.2",
  jsdom: "^24.1.0",
  typedoc: "^0.25.13",
  typescript: "^5.4.5",
  vite: "^5.2.8",
  "vite-plugin-dts": "^3.8.1",
  vitest: "^1.6.0"
}, co = {
  three: "^0.165.0"
}, lo = {
  registry: "https://registry.npmjs.org/"
}, ot = {
  name: Kt,
  private: !1,
  version: $t,
  type: Vt,
  files: qt,
  main: Qt,
  module: Jt,
  types: eo,
  exports: to,
  description: oo,
  license: so,
  author: io,
  keywords: ro,
  scripts: no,
  devDependencies: ao,
  dependencies: co,
  publishConfig: lo
};
function W(r, e, o, t, i) {
  const n = new ne(r, e, o);
  return n.position.copy(t), n.scale.copy(i), n;
}
function ho(r, e = !1) {
  if (r.isTile) {
    const o = r.coord.z + 1, t = r.coord.x * 2, i = 0, n = 1 / 4;
    if (r.coord.z === 0 && e) {
      const a = r.coord.y, c = new m(0.5, 1, 1);
      r.add(W(t, a, o, new m(-n, 0, i), c)), r.add(W(t + 1, a, o, new m(n, 0, i), c));
    } else {
      const a = r.coord.y * 2, c = new m(0.5, 0.5, 1);
      r.add(W(t, a + 1, o, new m(-n, -n, i), c)), r.add(W(t + 1, a + 1, o, new m(n, -n, i), c)), r.add(W(t, a, o, new m(-n, n, i), c)), r.add(W(t + 1, a, o, new m(n, n, i), c));
    }
    r.traverse((a) => {
      a.updateMatrix(), a.updateMatrixWorld(), a.receiveShadow = r.receiveShadow, a.castShadow = r.castShadow;
    });
  }
  return r.children;
}
const uo = new m();
function mo(r, e, o) {
  const t = r.position.clone().setZ(o).applyMatrix4(r.matrixWorld);
  return e.distanceTo(t);
}
function po(r) {
  const e = new m(-0.5, -0.5, 0).applyMatrix4(r.matrixWorld), o = new m(0.5, 0.5, 0).applyMatrix4(r.matrixWorld);
  return e.sub(o).length();
}
function He(r, e) {
  const o = e.getWorldPosition(uo), t = mo(r, o, r.avgZ), i = po(r), n = t / i;
  return Math.log10(n) * 5 + 0.5;
}
var ye = /* @__PURE__ */ ((r) => (r[r.none = 0] = "none", r[r.create = 1] = "create", r[r.remove = 2] = "remove", r))(ye || {});
function fo(r, e, o, t, i) {
  if (r.coord.z > o && r.index === 0 && r.parent?.isTile) {
    const a = He(r.parent, e);
    if (r.coord.z > t || a > i * 1.02)
      return 2;
  }
  if (r.coord.z < t && r.isLeafInFrustum) {
    const a = He(r, e);
    if (r.userData.dist = a, r.coord.z < o || a < i / 1.02)
      return 1;
  }
  return 0;
}
const me = new G(), pe = new J({ color: 16711680 });
class ne extends be {
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
  /** is tile in frustum? */
  get inFrustum() {
    return this._inFrustum;
  }
  /** set tile is in frustum */
  set inFrustum(e) {
    this._inFrustum != e && (this._inFrustum = e, e ? this._toLoad = this.isLeaf : this.dispose(!0));
  }
  /** is leaf in frustum ? */
  get isLeafInFrustum() {
    return this.inFrustum && this.isLeaf;
  }
  _isTemp = !1;
  /** set the tile to temp*/
  set isTemp(e) {
    if (this._isTemp = e, this.material.forEach((o) => {
      "wireframe" in o && (o.wireframe = e || o.userData.wireframe);
    }), !e) {
      const o = this._getLoadedParent();
      o && o.loadState;
    }
  }
  /** is leaf?  */
  get isLeaf() {
    return this.children.length === 0;
  }
  /**
   * constructor
   * @param x tile X-coordinate, default:0
   * @param y tile X-coordinate, default:0
   * * @param z tile level, default:0
   */
  constructor(e = 0, o = 0, t = 0) {
    super(me, [pe]), this.coord = { x: e, y: o, z: t }, this.name = `Tile ${t}-${e}-${o}`, this.matrixAutoUpdate = !1, this.matrixWorldAutoUpdate = !1;
  }
  /**
   * Override Obejct3D.traverse, change the callback param type to "this"
   * @param callback callback
   */
  traverse(e) {
    e(this), this.children.forEach((o) => {
      o.traverse(e);
    });
  }
  /**
   * Override mesh.raycast，only called when tile has loaded
   * @param raycaster
   * @param intersects
   */
  raycast(e, o) {
    this.loadState === "loaded" && super.raycast(e, o);
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
  _lod(e, o, t, i, n) {
    let a = [];
    const c = fo(this, e, o, t, i);
    if (c === ye.create)
      a = ho(this, n), this._toLoad = !1;
    else if (c === ye.remove) {
      const d = this.parent;
      d?.isTile && (d._toLoad = !0);
    }
    return a;
  }
  /**
   * load data
   * @param loader data loader
   * @returns Promise<void>
   */
  _load(e) {
    return this._needsLoad ? (this._abortController = new AbortController(), this._loadState = "loading", new Promise((o, t) => {
      e.load(
        this,
        () => o(this._onLoad()),
        (i) => o(this._onError(i))
      );
    })) : Promise.resolve();
  }
  /**
   * callback function when error. (include abort)
   * @param err error message
   */
  _onError(e) {
    this._toLoad = !1, e.name === "AbortError" ? console.assert(this._loadState === "empty") : (this._loadState = "loaded", console.error(e.message || e.type || e));
  }
  /**
   * Recursion to find loaded parent (hide when parent showing)
   * @returns loaded parent or null
   */
  _getLoadedParent() {
    const e = this.parent;
    return !e || !e.isTile ? null : e.loadState === "loaded" && !e._isTemp ? e : e._getLoadedParent();
  }
  _checkVisible() {
    const e = [];
    this.traverse((t) => e.push(t));
    const o = !e.filter((t) => t.isLeafInFrustum).some((t) => t.loadState != "loaded");
    return o && e.forEach((t) => {
      t.isLeaf ? t.isTemp = !1 : t.dispose(!1);
    }), o;
  }
  /**
   * tile loaded callback
   */
  _onLoad() {
    this._loadState = "loaded", this.material.forEach((e) => {
      "wireframe" in e && (e.userData.wireframe = e.wireframe);
    }), this._updateHeight(), !this.isLeaf && this._toLoad && (this.children.forEach((e) => e.dispose(!0)), this.clear()), this.isTemp = this._getLoadedParent() != null, this._toLoad = !1, this._getLoadedParent()?._checkVisible();
  }
  // update height
  _updateHeight() {
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
   * @param removeChildren remove children?
   */
  dispose(e) {
    return this.loadState != "empty" && this._dispose(), e && (this.children.forEach((o) => {
      o.dispose(e), o.clear();
    }), this.clear()), this;
  }
  _dispose() {
    this.abortLoad(), this._loadState = "empty", this.isTemp = !0, this._toLoad = !1, this.material[0] != pe && (this.material.forEach((e) => e.dispose()), this.material = [pe]), this.geometry != me && (this.geometry.dispose(), this.geometry.groups = [], this.geometry = me), this.dispatchEvent({ type: "dispose" });
  }
}
const go = new jt(), Xe = new At();
class yo extends ne {
  _treeReadyCount = 0;
  _autoLoad = !0;
  _loader;
  _minLevel = 0;
  /**
   * Get minLevel of the map
   */
  get minLevel() {
    return this._minLevel;
  }
  /**
   * Set minLevel of the map,
   */
  set minLevel(e) {
    this._minLevel = e;
  }
  _maxLevel = 19;
  /**
   * Get maxLevel of the map
   */
  get maxLevel() {
    return this._maxLevel;
  }
  /**
   * Set  maxLevel of the map
   */
  set maxLevel(e) {
    this._maxLevel = e;
  }
  _LODThreshold = 1;
  /**
   * Get LOD threshold
   */
  get LODThreshold() {
    return this._LODThreshold;
  }
  /**
   * Set LOD threshold
   */
  set LODThreshold(e) {
    this._LODThreshold = e;
  }
  /**
   * Is the map WGS projection
   */
  isWGS = !1;
  /**
   * Get tile loader
   */
  get loader() {
    return this._loader;
  }
  /**
   * Set tile loader
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
   * true: load data on the scene update every frame it is rendered.
   * false: do not load data, only update tile true.
   */
  set autoLoad(e) {
    this._autoLoad = e;
  }
  _vierwerBufferSize = 0.6;
  // tile bounds, used to decide the tile in frustum, it greater than tile size to cache
  _tileBox = new Ye(
    new m(-this.viewerbufferSize, -this.viewerbufferSize, 0),
    new m(this.viewerbufferSize, this.viewerbufferSize, 10)
  );
  /**
   * Get renderer cache size scale. (0.5-2.5，default: 0.6)
   */
  get viewerbufferSize() {
    return this._vierwerBufferSize;
  }
  /**
   * Get renderer cache size. (0.5-2.5，default: 0.6)
   */
  set viewerbufferSize(e) {
    this._vierwerBufferSize = Math.min(Math.max(e, 0.5), 2.5), this._tileBox = new Ye(
      new m(-this.viewerbufferSize, -this.viewerbufferSize, 0),
      new m(this.viewerbufferSize, this.viewerbufferSize, 9)
    );
  }
  /**
   * Constructor
   * @param loader tile data loader
   * @param level tile level, default:0
   * @param x tile X-coordinate, default:0
   * @param y tile y-coordinate, default:0
   */
  constructor(e, o = 0, t = 0, i = 0) {
    super(o, t, i), this._loader = e, this.matrixAutoUpdate = !0, this.matrixWorldAutoUpdate = !0;
  }
  /**
   * Update tile tree and tile data. It needs called on the scene update every frame.
   * @param camera
   */
  update(e) {
    return this._updateTileTree(e) ? this._treeReadyCount = 0 : this._treeReadyCount = Math.min(this._treeReadyCount + 1, 100), this.autoLoad && this._treeReadyCount > 10 && this._updateTileData(), this;
  }
  /**
   * Reload data, Called to take effect after source has changed
   */
  reload() {
    return this.dispose(!0), this;
  }
  /**
   * Update tile tree use LOD
   * @param camera  camera
   * @returns  the tile tree has changed
   */
  _updateTileTree(e) {
    let o = !1;
    return Xe.setFromProjectionMatrix(go.multiplyMatrices(e.projectionMatrix, e.matrixWorldInverse)), this.traverse((t) => {
      if (t.isTile) {
        t.geometry.computeBoundingBox(), t.geometry.computeBoundingSphere(), t.inFrustum = Xe.intersectsBox(this._tileBox.clone().applyMatrix4(t.matrixWorld));
        const i = t._lod(e, this.minLevel, this.maxLevel, this.LODThreshold, this.isWGS);
        i.forEach((n) => {
          this.dispatchEvent({ type: "tile-created", tile: n });
        }), i.length > 0 && (o = !0);
      }
    }), o;
  }
  /**
   *  Update tileTree data
   */
  _updateTileData() {
    return this.traverse((e) => {
      e.isTile && e._load(this.loader).then(() => {
        e.loadState === "loaded" && (this._updateVisibleHight(), this.dispatchEvent({ type: "tile-loaded", tile: e }));
      });
    }), this;
  }
  /**
   * Update height of tiles in view
   */
  _updateVisibleHight() {
    let e = 0, o = 0;
    this.maxZ = 0, this.minZ = 9e3, this.traverse((t) => {
      t.isTile && t.isLeafInFrustum && t.loadState === "loaded" && (this.maxZ = Math.max(this.maxZ, t.maxZ), this.minZ = Math.min(this.minZ, t.minZ), e += t.avgZ, o++);
    }), o > 0 && (this.avgZ = e / o);
  }
}
class bo extends Dt {
  constructor(e = { transparent: !0, side: It }) {
    super(e);
  }
}
class us extends G {
  build(e, o) {
    this.dispose(), this.copy(new G(1, 1, o - 1, o - 1));
    const t = this.getAttribute("position");
    for (let i = 0; i < t.count; i++)
      t.setZ(i, e[i]);
  }
  setData(e, o) {
    if (e.length != o * o)
      throw "DEM array size error!";
    return this.build(e, o), this.computeBoundingBox(), this.computeBoundingSphere(), this.computeVertexNormals(), this;
  }
}
class wo extends G {
  _min = 1 / 0;
  /**
   * buile
   * @param dem 2d array of dem
   * @param tileSize tile size
   */
  build(e, o) {
    this.dispose();
    const t = 1, i = 1, n = o - 1, a = o - 1, c = t / 2, d = i / 2;
    let h = Math.floor(n), u = Math.floor(a);
    const v = t / h, w = i / u;
    h += 2, u += 2;
    const b = h + 1, M = u + 1, E = [], O = [], C = [], z = [];
    let A = 0;
    this._min = Math.min(...Array.from(e));
    for (let x = 0; x < M; x++)
      for (let y = 0; y < b; y++) {
        let D = (y - 1) * v - c, g = (x - 1) * w - d, j = (y - 1) / (h - 2), I = 1 - (x - 1) / (u - 2);
        D = H.clamp(D, -0.5, 0.5), g = H.clamp(g, -0.5, 0.5), j = H.clamp(j, 0, 1), I = H.clamp(I, 0, 1);
        let X = 0;
        x === 0 || x === M - 1 || y === 0 || y === b - 1 ? X = this._min - 0.1 : (X = e[A], A++), O.push(D, -g, X), C.push(0, 0, 1), z.push(j, I);
      }
    for (let x = 0; x < u; x++)
      for (let y = 0; y < h; y++) {
        const D = y + b * x, g = y + b * (x + 1), j = y + 1 + b * (x + 1), I = y + 1 + b * x;
        E.push(D, g, I), E.push(g, j, I);
      }
    return this.setIndex(E), this.setAttribute("position", new ue(O, 3)), this.setAttribute("normal", new ue(C, 3)), this.setAttribute("uv", new ue(z, 2)), this;
  }
  /**
   * set the tile dem data
   * @param dem 2d dem array
   * @param tileSize dem size
   * @returns this
   */
  setData(e, o) {
    if (e.length != o * o)
      throw "DEM array size error!";
    return this.build(e, o), this.computeBoundingBox(), this.computeBoundingSphere(), this.computeVertexNormals(), this;
  }
  // set normal on edge(skirt)
  // 瓦片边缘法向量计算比较复杂，需要根据相邻瓦片高程计算，暂未实现
  // 考虑使用Mapbox Terrain-DEM v1格式地形 https://docs.mapbox.com/data/tilesets/reference/mapbox-terrain-dem-v1/
  computeVertexNormals() {
    super.computeVertexNormals();
    const e = this.index, o = this.getAttribute("position"), t = this.getAttribute("normal"), i = new m(), n = new m(), a = new m(), c = new m(0, 0, 1);
    function d(h) {
      return t.setXYZ(h, c.x, c.y, c.z);
    }
    if (e)
      for (let h = 0, u = e.count; h < u; h += 3) {
        const v = e.getX(h + 0), w = e.getX(h + 1), b = e.getX(h + 2);
        i.fromBufferAttribute(o, v), n.fromBufferAttribute(o, w), a.fromBufferAttribute(o, b), (i.z < this._min || n.z < this._min || a.z < this._min) && (d(v), d(w), d(b));
      }
    t.needsUpdate = !0;
  }
}
class ie {
  static enabled = !0;
  static size = 500;
  static files = /* @__PURE__ */ new Map();
  static add(e, o) {
    if (!this.enabled || this.files.has(e))
      return;
    this.files.set(e, o);
    const t = Array.from(this.files.keys()), i = this.files.size - this.size;
    for (let n = 0; n < i; n++)
      this.remove(t[n]);
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
class xo extends Error {
  response;
  constructor(e, o) {
    super(e), this.response = o;
  }
}
class To extends re {
  mimeType;
  responseType;
  constructor(e) {
    super(e);
  }
  load(e, o, t, i, n) {
    this.path !== void 0 && (e = this.path + e), e = this.manager.resolveURL(e);
    const a = ie.get(e);
    if (a)
      return this.manager.itemStart(e), setTimeout(() => {
        o && o(a), this.manager.itemEnd(e);
      }), a;
    if (n?.aborted) {
      console.log("aborted befor load");
      return;
    }
    const c = new Request(e, {
      headers: new Headers(this.requestHeader),
      credentials: this.withCredentials ? "include" : "same-origin",
      // An abort controller could be added within a future PR
      signal: n
    }), d = this.mimeType, h = this.responseType;
    fetch(c).then((u) => {
      if (u.status === 200 || u.status === 0)
        return u.status === 0 && console.warn("THREE.FileLoader: HTTP Status 0 received."), u;
      throw new xo(
        `fetch for "${u.url}" responded with ${u.status}: ${u.statusText}`,
        u
      );
    }).then((u) => {
      switch (h) {
        case "arraybuffer":
          return u.arrayBuffer();
        case "blob":
          return u.blob();
        case "document":
          return u.text().then((v) => new DOMParser().parseFromString(v, d));
        case "json":
          return u.json();
        default:
          if (d === void 0)
            return u.text();
          {
            const w = /charset="?([^;"\s]*)"?/i.exec(d), b = w && w[1] ? w[1].toLowerCase() : void 0, M = new TextDecoder(b);
            return u.arrayBuffer().then((E) => M.decode(E));
          }
      }
    }).then((u) => {
      ie.add(e, u), o && o(u);
    }).catch((u) => {
      i && i(u), u.name != "AbortError" && this.manager.itemError(e);
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
const L = {
  manager: new Ot(),
  // dict of dem loader
  demLoaderMap: /* @__PURE__ */ new Map(),
  // dict of img loader
  imgLoaderMap: /* @__PURE__ */ new Map(),
  /**
   * register material loader
   * @param loader material loader
   */
  registerMaterialLoader(r) {
    L.imgLoaderMap.set(r.dataType, r), console.log(`* Register imageLoader: ${r.dataType}`);
  },
  /**
   * register geometry loader
   * @param loader geometry loader
   */
  registerGeometryLoader(r) {
    L.demLoaderMap.set(r.dataType, r), console.log(`* Register terrainLoader: ${r.dataType}`);
  },
  /**
   * get material loader from datasource
   * @param source datasource
   * @returns material loader
   */
  getMaterialLoader(r) {
    const e = L.imgLoaderMap.get(r.dataType);
    if (e)
      return e;
    throw `Source dataType "${r.dataType}" is not support!`;
  },
  /**
   * get geometry loader from datasource
   * @param source datasouce
   * @returns geometry loader
   */
  getGeometryLoader(r) {
    const e = L.demLoaderMap.get(r.dataType);
    if (e)
      return e;
    throw `Source dataType "${r.dataType}" is not support!`;
  }
}, Lo = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
class st extends re {
  loader = new To(L.manager);
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
  load(e, o, t, i, n) {
    const a = new Image(), c = (u) => {
      h(), o && o(a);
    }, d = (u) => {
      h(), i && i(u), a.src = Lo;
    }, h = () => {
      a.removeEventListener("load", c, !1), a.removeEventListener("error", d, !1);
    };
    return a.addEventListener("load", c, !1), a.addEventListener("error", d, !1), this.crossOrigin, this.requestHeader, this.loader.load(
      e,
      (u) => {
        o && (a.src = URL.createObjectURL(u));
      },
      t,
      i,
      n
    ), a;
  }
}
function it(r, e) {
  r.translate(new T(0.5, 0.5));
  const o = Math.floor(r.min.x * e), t = Math.floor(r.min.y * e), i = Math.floor((r.max.x - r.min.x) * e), n = Math.floor((r.max.y - r.min.y) * e);
  return { sx: o, sy: t, sw: i, sh: n };
}
function ms(r, e) {
  if (r.width <= e)
    return r;
  const o = document.createElement("canvas"), t = o.getContext("2d");
  o.width = e, o.height = e;
  const i = e - 2;
  t.drawImage(r, 0, 0, r.width, r.height, 1, 1, i, i);
  const n = t.getImageData(1, 1, i, i);
  return t.putImageData(n, 0, 0), o;
}
function rt(r, e) {
  if (e.coord.z <= r.maxLevel)
    return {
      url: r.getTileUrl(e.coord.x, e.coord.y, e.coord.z),
      rect: new Ge(new T(-0.5, -0.5), new T(0.5, 0.5))
    };
  function o(n, a) {
    const c = new m(), d = new T(1, 1);
    for (; n.coord.z > a && (c.applyMatrix4(n.matrix), d.multiplyScalar(0.5), n.parent instanceof ne); )
      n = n.parent;
    c.setY(-c.y);
    const h = new Ge().setFromCenterAndSize(new T(c.x, c.y), d);
    return { tile: n, rect: h };
  }
  const t = o(e, r.maxLevel);
  return { url: r.getTileUrl(
    t.tile.coord.x,
    t.tile.coord.y,
    t.tile.coord.z
  ), rect: t.rect };
}
class vo extends re {
  /** get loader cache size of file  */
  get cacheSize() {
    return ie.size;
  }
  /** set loader cache size of file  */
  set cacheSize(e) {
    ie.size = e;
  }
  _imgSource = [];
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
   */
  constructor() {
    super(L.manager);
  }
  /**
   * load material and geometry data
   * @param tile tile to load
   * @param onLoad callback on data loaded
   * @returns geometry, material(s)
   */
  load(e, o, t) {
    if (this.imgSource.length === 0)
      throw new Error("imgSource can not be empty");
    const i = () => {
      if (n && a) {
        for (let h = 0; h < d.length; h++)
          c.addGroup(0, 1 / 0, h);
        o();
      }
    };
    let n = !1, a = !1;
    const c = this.loadGeometry(
      e,
      () => {
        n = !0, i();
      },
      t
    ), d = this.loadMaterial(
      e,
      () => {
        a = !0, i();
      },
      t
    );
    return e.geometry = c, e.material = d, { geometry: c, material: d };
  }
  /**
   * load geometry
   * @param tile tile to load
   * @param onLoad loaded callback
   * @param onError error callback
   * @returns geometry
   */
  loadGeometry(e, o, t) {
    let i;
    return this.demSource ? i = L.getGeometryLoader(this.demSource).load(this.demSource, e, o, t) : (i = new G(), setTimeout(o)), i;
  }
  /**
   * load material
   * @param tile tile to load
   * @param onLoad loaded callback
   * @param onError error callback
   * @returns material
   */
  loadMaterial(e, o, t) {
    const i = this.imgSource.map((n) => {
      const c = L.getMaterialLoader(n).load(
        n,
        e,
        () => {
          c.userData.loaded = !0, i.every((d) => d.userData.loaded) && o();
        },
        t
      );
      return c;
    });
    return i;
  }
}
const So = new we(new Image(1, 1));
class _o {
  // image loader
  loader = new st(L.manager);
  /**
   * load the tile texture
   * @param tile tile to load
   * @param source datasource
   * @param onLoad callback
   * @returns texture
   */
  load(e, o, t, i) {
    const { url: n, rect: a } = rt(e, o);
    if (!n)
      return setTimeout(t), So;
    const c = new we(new Image());
    return c.colorSpace = Ct, this.loader.load(
      n,
      // onLoad
      (d) => {
        o.coord.z > e.maxLevel ? c.image = Eo(d, a) : c.image = d, c.needsUpdate = !0, t();
      },
      // onProgress
      void 0,
      // onError
      i,
      o.abortSignal
    ), c;
  }
}
function Eo(r, e) {
  const o = r.width, t = new OffscreenCanvas(o, o), i = t.getContext("2d"), { sx: n, sy: a, sw: c, sh: d } = it(e, r.width);
  return i.drawImage(r, n, a, c, d, 0, 0, o, o), t;
}
class Mo {
  dataType = "image";
  load(e, o, t, i) {
    const n = (h) => {
      const u = h.target;
      u.map?.image instanceof ImageBitmap && u.map.image.close(), u.map?.dispose(), u.removeEventListener("dispose", n);
    }, a = this.createMaterial();
    a.opacity = e.opacity, a.addEventListener("dispose", n);
    const d = new _o().load(
      e,
      o,
      () => {
        a.map = d, d.needsUpdate = !0, t();
      },
      (h) => {
        i(h);
      }
    );
    return a;
  }
  createMaterial() {
    return new bo();
  }
}
L.registerMaterialLoader(new Mo());
const Po = new zt();
class jo extends re {
  dataType = "terrain-rgb";
  imageLoader = new st(L.manager);
  /**
   * load tile's data from source
   * @param source
   * @param tile
   * @param onLoad
   * @param onError
   * @returns
   */
  load(e, o, t, i) {
    if (o.coord.z < 8)
      return setTimeout(t), new G();
    const { url: n, rect: a } = rt(e, o);
    return n ? this._load(o, n, a, t, i) : (setTimeout(t), Po);
  }
  _load(e, o, t, i, n) {
    let a = e.coord.z * 3;
    a = Math.min(Math.max(a, 2), 48);
    const c = this.createGeometry();
    return this.imageLoader.load(
      o,
      // onLoad
      (d) => {
        const { data: h, size: u } = Io(d, a, t);
        c.setData(Do(h), u), i();
      },
      // onProgress
      void 0,
      // onError
      n,
      e.abortSignal
    ), c;
  }
  createGeometry() {
    return new wo();
  }
}
function Ao(r, e) {
  const o = r[e * 4], t = r[e * 4 + 1], i = r[e * 4 + 2];
  return (((o << 16) + (t << 8) + i) * 0.1 - 1e4) / 1e3;
}
function Do(r) {
  const e = Math.floor(r.length / 4), o = new Float32Array(e);
  for (let t = 0; t < o.length; t++)
    o[t] = Ao(r, t);
  return o;
}
function Io(r, e, o) {
  const i = new OffscreenCanvas(e, e).getContext("2d");
  i.imageSmoothingEnabled = !1;
  const n = it(o, r.width);
  return e > n.sw && (e = n.sw), i.drawImage(r, n.sx, n.sy, n.sw, n.sh, 0, 0, e, e), { data: i.getImageData(0, 0, e, e).data, size: e };
}
L.registerGeometryLoader(new jo());
class _ {
  dataType = "image";
  attribution = "ThreeTile";
  minLevel = 0;
  maxLevel = 19;
  projectionID = "3857";
  url = "";
  subdomains = [];
  s = "";
  opacity = 1;
  // public bounds: [number, number, number, number] = [60, 10, 140, 60];
  bounds = [-180, -85.05112877980659, 180, 85.05112877980659];
  /**
   * constructor
   * @param options
   */
  constructor(e) {
    Object.assign(this, e);
  }
  /**
   * Get url from tile coordinate, public，called by TileLoader
   * @param x
   * @param y
   * @param z
   * @returns url
   */
  getTileUrl(e, o, t) {
    const i = this.subdomains.length;
    if (i > 0) {
      const n = Math.floor(Math.random() * i);
      this.s = this.subdomains[n];
    }
    return this.getUrl(e, o, t);
  }
  /**
   * Get url from tile coordinate, protected, overwrite to custom generation tile url from xyz
   * @param x
   * @param y
   * @param z
   * @returns url
   */
  getUrl(e, o, t) {
    const i = Object.assign({}, this, { x: e, y: o, z: t });
    return Oo(this.url, i);
  }
  /**
   * source factory function, create source directly through factoy functions.
   * @param options
   * @returns ISource
   */
  static create(e) {
    return new _(e);
  }
}
function Oo(r, e) {
  const o = /\{ *([\w_ -]+) *\}/g;
  return r.replace(o, (t, i) => {
    let n = e[i];
    if (n === void 0)
      throw new Error(`source url template error, No value provided for variable: ${t}`);
    return typeof n == "function" && (n = n(e)), n;
  });
}
class fe extends _ {
  _source;
  _projection;
  get projection() {
    return this._projection;
  }
  set projection(e) {
    this._projection = e, this._bounds = this.projection.getPorjBounds(this._source.bounds);
  }
  _bounds;
  _getTileBounds(e, o, t, i = 1) {
    const n = this.projection.getTileXYZproj(e, o, t), a = this.projection.getTileXYZproj(e + i, o + i, t);
    return {
      minX: Math.min(n.x, a.x),
      minY: Math.min(n.y, a.y),
      maxX: Math.max(n.x, a.x),
      maxY: Math.max(n.y, a.y)
    };
  }
  constructor(e, o) {
    super(), Object.assign(this, e), this._source = e, this.projection = o;
  }
  getUrl(e, o, t) {
    const i = Math.pow(2, t);
    let n = e + Math.round(i / 360 * this.projection.lon0);
    n >= i ? n -= i : n < 0 && (n += i);
    const a = 0.9, c = this._bounds, d = this._getTileBounds(n, o, t, a);
    if (!(d.maxX < c.minX || d.minX > c.maxX || d.maxY < c.minY || d.minY > c.maxY))
      return this._source.getTileUrl(n, o, t);
  }
}
class nt {
  _lon0 = 0;
  /** 中央经线 */
  get lon0() {
    return this._lon0;
  }
  /**
   * 构造函数
   * @param centerLon 中央经线
   */
  constructor(e = 0) {
    this._lon0 = e;
  }
  /**
   * 根据中央经线取得变换后的瓦片X坐标
   * @param x
   * @param z
   * @returns
   */
  getTileXWithCenterLon(e, o) {
    const t = Math.pow(2, o);
    let i = e + Math.round(t / 360 * this._lon0);
    return i >= t ? i -= t : i < 0 && (i += t), i;
  }
  /**
   * 根据瓦片坐标计算投影坐标
   * @param x
   * @param y
   * @param z
   * @returns
   */
  getTileXYZproj(e, o, t) {
    const i = this.mapWidth, n = this.mapHeight / 2, a = e / Math.pow(2, t) * i - i / 2, c = n - o / Math.pow(2, t) * n * 2;
    return { x: a, y: c };
  }
  /**
   * 取得投影后的经纬度边界坐标
   * @param bounds 经纬度边界
   * @returns 投影坐标
   */
  getPorjBounds(e) {
    const o = this.project(e[0] + this.lon0, e[1]), t = this.project(e[2] + this.lon0, e[3]);
    return {
      minX: Math.min(o.x, t.x),
      minY: Math.min(o.y, t.y),
      maxX: Math.max(o.x, t.x),
      maxY: Math.max(o.y, t.y)
    };
  }
}
const Q = 6378;
class at extends nt {
  ID = "3857";
  // projeciton ID
  isWGS = !1;
  // Is linear projection of latitude and longitude
  mapWidth = 2 * Math.PI * Q;
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
  project(e, o) {
    const t = (e - this.lon0) * (Math.PI / 180), i = o * (Math.PI / 180), n = Q * t, a = Q * Math.log(Math.tan(Math.PI / 4 + i / 2));
    return { x: n, y: a };
  }
  /**
   * Projected coordinates to latitude and longitude
   * @param x projection x
   * @param y projection y
   * @returns latitude and longitude
   */
  unProject(e, o) {
    const t = e / Q * (180 / Math.PI) + this.lon0;
    return { lat: (2 * Math.atan(Math.exp(o / Q)) - Math.PI / 2) * (180 / Math.PI), lon: t };
  }
}
class Co extends nt {
  ID = "4326";
  isWGS = !0;
  mapWidth = 36e3;
  //E-W scacle (*0.01°)
  mapHeight = 18e3;
  //S-N scale (*0.01°)
  mapDepth = 1;
  //height scale
  project(e, o) {
    return { x: (e - this.lon0) * 100, y: o * 100 };
  }
  unProject(e, o) {
    return { lon: e / 100 + this.lon0, lat: o / 100 };
  }
}
const Ke = {
  /**
   * create projection object from projection ID
   *
   * @param id projeciton ID, default: "3857"
   * @returns IProjection instance
   */
  createFromID: (r = "3857", e) => {
    let o;
    switch (r) {
      case "3857":
        o = new at(e);
        break;
      case "4326":
        o = new Co(e);
        break;
      default:
        throw new Error(`Projection ID: ${r} is not supported.`);
    }
    return o;
  }
};
function ct(r, e) {
  const o = e.intersectObjects([r.rootTile]);
  for (const t of o)
    if (t.object instanceof ne) {
      const i = r.worldToLocal(t.point), n = r.pos2geo(i);
      return Object.assign(t, {
        location: n
      });
    }
}
function $e(r, e) {
  const o = new m(0, -1, 0), t = new m(e.x, 10, e.z), i = new Je(t, o);
  return ct(r, i);
}
function zo(r, e, o) {
  const t = new Je();
  return t.setFromCamera(o, r), ct(e, t);
}
function ko(r) {
  const e = r.loader.manager;
  return e.onStart = (o, t, i) => {
    r.dispatchEvent({
      type: "loading-start",
      itemsLoaded: t,
      itemsTotal: i
    });
  }, e.onError = (o) => {
    r.dispatchEvent({ type: "loading-error", url: o });
  }, e.onLoad = () => {
    r.dispatchEvent({ type: "loading-complete" });
  }, e.onProgress = (o, t, i) => {
    r.dispatchEvent({
      type: "loading-progress",
      url: o,
      itemsLoaded: t,
      itemsTotal: i
    });
  }, r.rootTile.addEventListener("tile-created", (o) => {
    r.dispatchEvent({ type: "tile-created", tile: o.tile });
  }), r.rootTile.addEventListener("tile-loaded", (o) => {
    r.dispatchEvent({ type: "tile-loaded", tile: o.tile });
  }), r.rootTile.addEventListener("loaded", () => {
    r.dispatchEvent({ type: "loaded" });
  }), r;
}
function Ro(r) {
  let e = 0, o = 0, t = 0, i = 0;
  return r.rootTile.traverse((n) => {
    n.isTile && (e++, n.isLeafInFrustum && o++, n.isLeaf && i++, t = Math.max(t, n.coord.z));
  }), { total: e, visible: o, leaf: i, maxLevle: t };
}
function Fo(r) {
  const e = [];
  let o = r.imgSource;
  if (Array.isArray(o) || (o = [o]), o.forEach((t) => {
    const i = t.attribution;
    i && e.push(i);
  }), r.demSource) {
    const t = r.demSource.attribution;
    t && e.push(t);
  }
  return Array.from(new Set(e));
}
class lt extends be {
  // 渲染时钟计时器
  _clock = new et();
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
  _autoPosition = !1;
  /**
   * Get whether to adjust z of map automatically.
   * 取得是否自动根据视野内地形高度调整地图坐标
   */
  get autoPosition() {
    return this._autoPosition;
  }
  /**
   * Set whether to adjust z of map automatically.
   * 设置是否自动调整地图坐标，如果设置为true，将在每帧渲染中将地图坐标调整可视区域瓦片的平均高度
   */
  set autoPosition(e) {
    this._autoPosition = e;
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
  /**
   * Get central Meridian latidute
   * 取得中央子午线经度
   */
  get lon0() {
    return this.projection.lon0;
  }
  /**
   * Set central Meridian latidute, default:0
   * 设置中央子午线经度，中央子午线决定了地图的投影中心经度，可设置为-90，0，90
   */
  set lon0(e) {
    this.projection.lon0 !== e && (e != 0 && this.rootTile.minLevel < 1 && console.warn(`Map centralMeridian is ${this.lon0}, minLevel must > 0`), this.projection = Ke.createFromID(this.projection.ID, e), this.reload());
  }
  _projection = new at(0);
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
    this._projection = e, this.rootTile.scale.set(e.mapWidth, e.mapHeight, e.mapDepth), this.rootTile.isWGS = e.isWGS, this.imgSource.forEach((o) => o.projection = this.projection), this.demSource && (this.demSource.projection = this.projection), e.ID != this.projection.ID && e.lon0 != this.lon0 && (this.reload(), console.log("Map Projection Changed:", e.ID), this.dispatchEvent({
      type: "projection-changed",
      projection: e
    }));
  }
  _imgSource = [];
  /**
   * Get the image data source object
   * 取得影像数据源
   */
  get imgSource() {
    return this._imgSource;
  }
  /**
   * Set the image data source object
   * 设置影像数据源
   */
  set imgSource(e) {
    const o = Array.isArray(e) ? e : [e];
    if (o.length === 0)
      throw new Error("imgSource can not be empty");
    this.projection = Ke.createFromID(o[0].projectionID, this.projection.lon0);
    const t = o.map((i) => i instanceof fe ? i : new fe(i, this.projection));
    this._imgSource = t, this.loader.imgSource = t, this.dispatchEvent({ type: "source-changed", source: e });
  }
  _demSource;
  /**
   * Get the terrain data source
   * 设置地形数据源
   */
  get demSource() {
    return this._demSource;
  }
  /**
   * Set the terrain data source
   * 取得地形数据源
   */
  set demSource(e) {
    e && (this._demSource = new fe(e, this.projection), this.loader.demSource = this._demSource), this.dispatchEvent({ type: "source-changed", source: e });
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
             lon0: 90,
             // 最小缩放级别
             minLevel: 1,
             // 最大缩放级别
             maxLevel: 18,
         });
        ```
      */
  static create(e) {
    return new lt(e);
  }
  /**
   * Map mesh constructor
   *
   * 地图模型构造函数
   * @param params 地图参数 {@link MapParams}
   * @example
   * ``` typescript
  
    const map = new TileMap({
    		// 加载器
  		loader: new TileLoader(),
             // 影像数据源
             imgSource: [Source.mapBoxImgSource, new TestSource()],
             // 高程数据源
             demSource: source.mapBoxDemSource,
             // 地图投影中心经度
             lon0: 90,
             // 最小缩放级别
             minLevel: 1,
             // 最大缩放级别
             maxLevel: 18,
         });;
   * ```
   */
  constructor(e) {
    super(), this.up.set(0, 0, 1), this.loader = e.loader ?? new vo(), this.rootTile = e.rootTile ?? new yo(this.loader), this.minLevel = e.minLevel ?? 0, this.maxLevel = e.maxLevel ?? 19, this.imgSource = e.imgSource, this.demSource = e.demSource, this.lon0 = e.lon0 ?? 0, ko(this), this.add(this.rootTile), this.rootTile.updateMatrix(), this.rootTile.updateMatrixWorld();
  }
  /**
   * Update the map, It is automatically called after mesh adding a scene
   * 模型更新回调函数，地图加入场景后会在每帧更新时被调用，该函数调用根瓦片实现瓦片树更新和数据加载
   * @param camera
   */
  update(e) {
    if (this.rootTile.receiveShadow = this.receiveShadow, this.rootTile.castShadow = this.castShadow, this.autoPosition) {
      const o = this.localToWorld(this.up.clone().multiplyScalar(this.avgZInView)), t = this.position.clone().add(o).multiplyScalar(0.01);
      this.position.sub(t);
    }
    this.rootTile.update(e), this.dispatchEvent({ type: "update", delta: this._clock.getDelta() });
  }
  /**
   * reload the map data，muse called after the source has changed
   * 重新加载地图，在改变地图数据源后调用它才能生效
   */
  reload() {
    this.rootTile.dispose(!0);
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
   * Geo coordinates converted to map model coordinates
   * 地理坐标转换为地图模型坐标
   * @param geo 地理坐标（经纬度）
   * @returns 模型坐标
   */
  geo2pos(e) {
    const o = this.projection.project(e.x, e.y);
    return new m(o.x, o.y, e.z);
  }
  /**
   * Map model coordinates converted to coordinates geo
   * 地图模型坐标转换为地理坐标
   * @param pos 模型坐标
   * @returns 地理坐标（经纬度）
   */
  pos2geo(e) {
    const o = this.projection.unProject(e.x, e.y);
    return new m(o.lon, o.lat, e.z);
  }
  /**
   * Get the ground infomation for the specified latitude and longitude
   * 获取指定经纬度的地面信息（法向量、高度等）
   * @param geo 地理坐标
   * @returns 地面信息
   */
  getLocalInfoFromGeo(e) {
    const o = this.geo2pos(e);
    return $e(this, o);
  }
  /**
   * Get loacation infomation from world position
   * 获取指定世界坐标的地面信息
   * @param pos 世界坐标
   * @returns 地面信息
   */
  getLocalInfoFromWorld(e) {
    return $e(this, e);
  }
  /**
   * Get loacation infomation from screen point
   * 获取指定屏幕坐标的地面信息
   * @param camera 摄像机
   * @param pointer 点的屏幕坐标（-0.5~0.5）
   * @returns 位置信息（经纬度、高度等）
   */
  getLocalInfoFromScreen(e, o) {
    return zo(e, this, o);
  }
  /**
   * Get map data attributions information
   * 取得地图数据归属版权信息
   * @returns Attributions 版权信息字符串数组
   */
  get attributions() {
    return Fo(this);
  }
  /**
   * Get map tiles statistics to debug
   * @returns 取得瓦片统计信息，用于调试性能
   */
  get tileCount() {
    return Ro(this);
  }
}
class No {
  dataType = "debug";
  load(e, o, t, i) {
    const n = (d) => {
      const h = d.target;
      h.map?.image instanceof ImageBitmap && h.map.image.close(), h.map?.dispose(), h.removeEventListener("dispose", n);
    }, a = new kt(this.drawTile(o));
    a.needsUpdate = !0;
    const c = new J({
      transparent: !0,
      map: a,
      opacity: e.opacity
    });
    return c.addEventListener("dispose", n), setTimeout(t), c;
  }
  /**
   * draw a box and coordiante
   * @param tile
   * @returns bitmap
   */
  drawTile(e) {
    const t = new OffscreenCanvas(256, 256), i = t.getContext("2d");
    return i.scale(1, -1), i.translate(0, -256), i && (i.strokeStyle = "#ccc", i.lineWidth = 4, i.strokeRect(5, 5, 246, 246), i.fillStyle = "white", i.shadowColor = "black", i.shadowBlur = 5, i.shadowOffsetX = 1, i.shadowOffsetY = 1, i.font = "bold 20px arial", i.textAlign = "center", i.fillText(`Tile Test - level: ${e.coord.z}`, 256 / 2, 50), i.fillText(`[${e.coord.x}, ${e.coord.y}]`, 256 / 2, 80)), t.transferToImageBitmap();
  }
}
L.registerMaterialLoader(new No());
class Bo {
  dataType = "logo";
  /**
   * 加载材质
   * @param source 数据源
   * @param tile 瓦片
   * @param onLoad 加载完成回调
   * @returns 材质
   */
  load(e, o, t, i) {
    if (o.coord.z < 4)
      return setTimeout(t), new J();
    const n = new we(this.drawLogo(e.attribution));
    n.needsUpdate = !0;
    const a = new J({
      transparent: !0,
      map: n,
      opacity: e.opacity
    }), c = (d) => {
      const h = d.target;
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
    const t = new OffscreenCanvas(256, 256), i = t.getContext("2d");
    return i.scale(1, -1), i.translate(0, -256), i && (i.fillStyle = "white", i.shadowColor = "black", i.shadowBlur = 5, i.shadowOffsetX = 1, i.shadowOffsetY = 1, i.font = "bold 14px arial", i.textAlign = "center", i.translate(256 / 2, 256 / 2), i.rotate(30 * Math.PI / 180), i.fillText(`${e}`, 0, 0)), t.transferToImageBitmap();
  }
}
L.registerMaterialLoader(new Bo());
class Yo {
  dataType = "normal";
  load(e, o, t, i) {
    const n = new Rt({
      transparent: !0,
      opacity: e.opacity,
      flatShading: !0
    });
    return setTimeout(t), n;
  }
}
L.registerMaterialLoader(new Yo());
class Go {
  dataType = "wireframe";
  load(e, o, t, i) {
    const n = new xe(`hsl(${o.coord.z * 14}, 100%, 50%)`), a = new J({
      transparent: !0,
      wireframe: !0,
      color: n,
      opacity: e.opacity
    });
    return setTimeout(t), a;
  }
}
L.registerMaterialLoader(new Go());
const Ve = { type: "change" }, ge = { type: "start" }, qe = { type: "end" }, se = new Ft(), Qe = new Nt(), Zo = Math.cos(70 * H.DEG2RAD);
class Uo extends tt {
  constructor(e, o) {
    super(), this.object = e, this.domElement = o, this.domElement.style.touchAction = "none", this.enabled = !0, this.target = new m(), this.cursor = new m(), this.minDistance = 0, this.maxDistance = 1 / 0, this.minZoom = 0, this.maxZoom = 1 / 0, this.minTargetRadius = 0, this.maxTargetRadius = 1 / 0, this.minPolarAngle = 0, this.maxPolarAngle = Math.PI, this.minAzimuthAngle = -1 / 0, this.maxAzimuthAngle = 1 / 0, this.enableDamping = !1, this.dampingFactor = 0.05, this.enableZoom = !0, this.zoomSpeed = 1, this.enableRotate = !0, this.rotateSpeed = 1, this.enablePan = !0, this.panSpeed = 1, this.screenSpacePanning = !0, this.keyPanSpeed = 7, this.zoomToCursor = !1, this.autoRotate = !1, this.autoRotateSpeed = 2, this.keys = { LEFT: "ArrowLeft", UP: "ArrowUp", RIGHT: "ArrowRight", BOTTOM: "ArrowDown" }, this.mouseButtons = { LEFT: N.ROTATE, MIDDLE: N.DOLLY, RIGHT: N.PAN }, this.touches = { ONE: Y.ROTATE, TWO: Y.DOLLY_PAN }, this.target0 = this.target.clone(), this.position0 = this.object.position.clone(), this.zoom0 = this.object.zoom, this._domElementKeyEvents = null, this.getPolarAngle = function() {
      return c.phi;
    }, this.getAzimuthalAngle = function() {
      return c.theta;
    }, this.getDistance = function() {
      return this.object.position.distanceTo(this.target);
    }, this.listenToKeyEvents = function(s) {
      s.addEventListener("keydown", he), this._domElementKeyEvents = s;
    }, this.stopListenToKeyEvents = function() {
      this._domElementKeyEvents.removeEventListener("keydown", he), this._domElementKeyEvents = null;
    }, this.saveState = function() {
      t.target0.copy(t.target), t.position0.copy(t.object.position), t.zoom0 = t.object.zoom;
    }, this.reset = function() {
      t.target.copy(t.target0), t.object.position.copy(t.position0), t.object.zoom = t.zoom0, t.object.updateProjectionMatrix(), t.dispatchEvent(Ve), t.update(), n = i.NONE;
    }, this.update = function() {
      const s = new m(), l = new Ze().setFromUnitVectors(e.up, new m(0, 1, 0)), p = l.clone().invert(), f = new m(), S = new Ze(), B = new m(), P = 2 * Math.PI;
      return function(Pt = null) {
        const Ne = t.object.position;
        s.copy(Ne).sub(t.target), s.applyQuaternion(l), c.setFromVector3(s), t.autoRotate && n === i.NONE && K(X(Pt)), t.enableDamping ? (c.theta += d.theta * t.dampingFactor, c.phi += d.phi * t.dampingFactor) : (c.theta += d.theta, c.phi += d.phi);
        let k = t.minAzimuthAngle, R = t.maxAzimuthAngle;
        isFinite(k) && isFinite(R) && (k < -Math.PI ? k += P : k > Math.PI && (k -= P), R < -Math.PI ? R += P : R > Math.PI && (R -= P), k <= R ? c.theta = Math.max(k, Math.min(R, c.theta)) : c.theta = c.theta > (k + R) / 2 ? Math.max(k, c.theta) : Math.min(R, c.theta)), c.phi = Math.max(t.minPolarAngle, Math.min(t.maxPolarAngle, c.phi)), c.makeSafe(), t.enableDamping === !0 ? t.target.addScaledVector(u, t.dampingFactor) : t.target.add(u), t.target.sub(t.cursor), t.target.clampLength(t.minTargetRadius, t.maxTargetRadius), t.target.add(t.cursor);
        let V = !1;
        if (t.zoomToCursor && D || t.object.isOrthographicCamera)
          c.radius = le(c.radius);
        else {
          const F = c.radius;
          c.radius = le(c.radius * h), V = F != c.radius;
        }
        if (s.setFromSpherical(c), s.applyQuaternion(p), Ne.copy(t.target).add(s), t.object.lookAt(t.target), t.enableDamping === !0 ? (d.theta *= 1 - t.dampingFactor, d.phi *= 1 - t.dampingFactor, u.multiplyScalar(1 - t.dampingFactor)) : (d.set(0, 0, 0), u.set(0, 0, 0)), t.zoomToCursor && D) {
          let F = null;
          if (t.object.isPerspectiveCamera) {
            const q = s.length();
            F = le(q * h);
            const oe = q - F;
            t.object.position.addScaledVector(x, oe), t.object.updateMatrixWorld(), V = !!oe;
          } else if (t.object.isOrthographicCamera) {
            const q = new m(y.x, y.y, 0);
            q.unproject(t.object);
            const oe = t.object.zoom;
            t.object.zoom = Math.max(t.minZoom, Math.min(t.maxZoom, t.object.zoom / h)), t.object.updateProjectionMatrix(), V = oe !== t.object.zoom;
            const Be = new m(y.x, y.y, 0);
            Be.unproject(t.object), t.object.position.sub(Be).add(q), t.object.updateMatrixWorld(), F = s.length();
          } else
            console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."), t.zoomToCursor = !1;
          F !== null && (this.screenSpacePanning ? t.target.set(0, 0, -1).transformDirection(t.object.matrix).multiplyScalar(F).add(t.object.position) : (se.origin.copy(t.object.position), se.direction.set(0, 0, -1).transformDirection(t.object.matrix), Math.abs(t.object.up.dot(se.direction)) < Zo ? e.lookAt(t.target) : (Qe.setFromNormalAndCoplanarPoint(t.object.up, t.target), se.intersectPlane(Qe, t.target))));
        } else if (t.object.isOrthographicCamera) {
          const F = t.object.zoom;
          t.object.zoom = Math.max(t.minZoom, Math.min(t.maxZoom, t.object.zoom / h)), F !== t.object.zoom && (t.object.updateProjectionMatrix(), V = !0);
        }
        return h = 1, D = !1, V || f.distanceToSquared(t.object.position) > a || 8 * (1 - S.dot(t.object.quaternion)) > a || B.distanceToSquared(t.target) > a ? (t.dispatchEvent(Ve), f.copy(t.object.position), S.copy(t.object.quaternion), B.copy(t.target), !0) : !1;
      };
    }(), this.dispose = function() {
      t.domElement.removeEventListener("contextmenu", Re), t.domElement.removeEventListener("pointerdown", Ie), t.domElement.removeEventListener("pointercancel", $), t.domElement.removeEventListener("wheel", Oe), t.domElement.removeEventListener("pointermove", de), t.domElement.removeEventListener("pointerup", $), t.domElement.getRootNode().removeEventListener("keydown", Ce, { capture: !0 }), t._domElementKeyEvents !== null && (t._domElementKeyEvents.removeEventListener("keydown", he), t._domElementKeyEvents = null);
    };
    const t = this, i = {
      NONE: -1,
      ROTATE: 0,
      DOLLY: 1,
      PAN: 2,
      TOUCH_ROTATE: 3,
      TOUCH_PAN: 4,
      TOUCH_DOLLY_PAN: 5,
      TOUCH_DOLLY_ROTATE: 6
    };
    let n = i.NONE;
    const a = 1e-6, c = new Ue(), d = new Ue();
    let h = 1;
    const u = new m(), v = new T(), w = new T(), b = new T(), M = new T(), E = new T(), O = new T(), C = new T(), z = new T(), A = new T(), x = new m(), y = new T();
    let D = !1;
    const g = [], j = {};
    let I = !1;
    function X(s) {
      return s !== null ? 2 * Math.PI / 60 * t.autoRotateSpeed * s : 2 * Math.PI / 60 / 60 * t.autoRotateSpeed;
    }
    function ee(s) {
      const l = Math.abs(s * 0.01);
      return Math.pow(0.95, t.zoomSpeed * l);
    }
    function K(s) {
      d.theta -= s;
    }
    function te(s) {
      d.phi -= s;
    }
    const Te = function() {
      const s = new m();
      return function(p, f) {
        s.setFromMatrixColumn(f, 0), s.multiplyScalar(-p), u.add(s);
      };
    }(), Le = function() {
      const s = new m();
      return function(p, f) {
        t.screenSpacePanning === !0 ? s.setFromMatrixColumn(f, 1) : (s.setFromMatrixColumn(f, 0), s.crossVectors(t.object.up, s)), s.multiplyScalar(p), u.add(s);
      };
    }(), Z = function() {
      const s = new m();
      return function(p, f) {
        const S = t.domElement;
        if (t.object.isPerspectiveCamera) {
          const B = t.object.position;
          s.copy(B).sub(t.target);
          let P = s.length();
          P *= Math.tan(t.object.fov / 2 * Math.PI / 180), Te(2 * p * P / S.clientHeight, t.object.matrix), Le(2 * f * P / S.clientHeight, t.object.matrix);
        } else t.object.isOrthographicCamera ? (Te(p * (t.object.right - t.object.left) / t.object.zoom / S.clientWidth, t.object.matrix), Le(f * (t.object.top - t.object.bottom) / t.object.zoom / S.clientHeight, t.object.matrix)) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."), t.enablePan = !1);
      };
    }();
    function ae(s) {
      t.object.isPerspectiveCamera || t.object.isOrthographicCamera ? h /= s : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), t.enableZoom = !1);
    }
    function ve(s) {
      t.object.isPerspectiveCamera || t.object.isOrthographicCamera ? h *= s : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), t.enableZoom = !1);
    }
    function ce(s, l) {
      if (!t.zoomToCursor)
        return;
      D = !0;
      const p = t.domElement.getBoundingClientRect(), f = s - p.left, S = l - p.top, B = p.width, P = p.height;
      y.x = f / B * 2 - 1, y.y = -(S / P) * 2 + 1, x.set(y.x, y.y, 1).unproject(t.object).sub(t.object.position).normalize();
    }
    function le(s) {
      return Math.max(t.minDistance, Math.min(t.maxDistance, s));
    }
    function Se(s) {
      v.set(s.clientX, s.clientY);
    }
    function ht(s) {
      ce(s.clientX, s.clientX), C.set(s.clientX, s.clientY);
    }
    function _e(s) {
      M.set(s.clientX, s.clientY);
    }
    function ut(s) {
      w.set(s.clientX, s.clientY), b.subVectors(w, v).multiplyScalar(t.rotateSpeed);
      const l = t.domElement;
      K(2 * Math.PI * b.x / l.clientHeight), te(2 * Math.PI * b.y / l.clientHeight), v.copy(w), t.update();
    }
    function mt(s) {
      z.set(s.clientX, s.clientY), A.subVectors(z, C), A.y > 0 ? ae(ee(A.y)) : A.y < 0 && ve(ee(A.y)), C.copy(z), t.update();
    }
    function pt(s) {
      E.set(s.clientX, s.clientY), O.subVectors(E, M).multiplyScalar(t.panSpeed), Z(O.x, O.y), M.copy(E), t.update();
    }
    function ft(s) {
      ce(s.clientX, s.clientY), s.deltaY < 0 ? ve(ee(s.deltaY)) : s.deltaY > 0 && ae(ee(s.deltaY)), t.update();
    }
    function gt(s) {
      let l = !1;
      switch (s.code) {
        case t.keys.UP:
          s.ctrlKey || s.metaKey || s.shiftKey ? te(2 * Math.PI * t.rotateSpeed / t.domElement.clientHeight) : Z(0, t.keyPanSpeed), l = !0;
          break;
        case t.keys.BOTTOM:
          s.ctrlKey || s.metaKey || s.shiftKey ? te(-2 * Math.PI * t.rotateSpeed / t.domElement.clientHeight) : Z(0, -t.keyPanSpeed), l = !0;
          break;
        case t.keys.LEFT:
          s.ctrlKey || s.metaKey || s.shiftKey ? K(2 * Math.PI * t.rotateSpeed / t.domElement.clientHeight) : Z(t.keyPanSpeed, 0), l = !0;
          break;
        case t.keys.RIGHT:
          s.ctrlKey || s.metaKey || s.shiftKey ? K(-2 * Math.PI * t.rotateSpeed / t.domElement.clientHeight) : Z(-t.keyPanSpeed, 0), l = !0;
          break;
      }
      l && (s.preventDefault(), t.update());
    }
    function Ee(s) {
      if (g.length === 1)
        v.set(s.pageX, s.pageY);
      else {
        const l = U(s), p = 0.5 * (s.pageX + l.x), f = 0.5 * (s.pageY + l.y);
        v.set(p, f);
      }
    }
    function Me(s) {
      if (g.length === 1)
        M.set(s.pageX, s.pageY);
      else {
        const l = U(s), p = 0.5 * (s.pageX + l.x), f = 0.5 * (s.pageY + l.y);
        M.set(p, f);
      }
    }
    function Pe(s) {
      const l = U(s), p = s.pageX - l.x, f = s.pageY - l.y, S = Math.sqrt(p * p + f * f);
      C.set(0, S);
    }
    function yt(s) {
      t.enableZoom && Pe(s), t.enablePan && Me(s);
    }
    function bt(s) {
      t.enableZoom && Pe(s), t.enableRotate && Ee(s);
    }
    function je(s) {
      if (g.length == 1)
        w.set(s.pageX, s.pageY);
      else {
        const p = U(s), f = 0.5 * (s.pageX + p.x), S = 0.5 * (s.pageY + p.y);
        w.set(f, S);
      }
      b.subVectors(w, v).multiplyScalar(t.rotateSpeed);
      const l = t.domElement;
      K(2 * Math.PI * b.x / l.clientHeight), te(2 * Math.PI * b.y / l.clientHeight), v.copy(w);
    }
    function Ae(s) {
      if (g.length === 1)
        E.set(s.pageX, s.pageY);
      else {
        const l = U(s), p = 0.5 * (s.pageX + l.x), f = 0.5 * (s.pageY + l.y);
        E.set(p, f);
      }
      O.subVectors(E, M).multiplyScalar(t.panSpeed), Z(O.x, O.y), M.copy(E);
    }
    function De(s) {
      const l = U(s), p = s.pageX - l.x, f = s.pageY - l.y, S = Math.sqrt(p * p + f * f);
      z.set(0, S), A.set(0, Math.pow(z.y / C.y, t.zoomSpeed)), ae(A.y), C.copy(z);
      const B = (s.pageX + l.x) * 0.5, P = (s.pageY + l.y) * 0.5;
      ce(B, P);
    }
    function wt(s) {
      t.enableZoom && De(s), t.enablePan && Ae(s);
    }
    function xt(s) {
      t.enableZoom && De(s), t.enableRotate && je(s);
    }
    function Ie(s) {
      t.enabled !== !1 && (g.length === 0 && (t.domElement.setPointerCapture(s.pointerId), t.domElement.addEventListener("pointermove", de), t.domElement.addEventListener("pointerup", $)), !Mt(s) && (_t(s), s.pointerType === "touch" ? ke(s) : Tt(s)));
    }
    function de(s) {
      t.enabled !== !1 && (s.pointerType === "touch" ? St(s) : Lt(s));
    }
    function $(s) {
      switch (Et(s), g.length) {
        case 0:
          t.domElement.releasePointerCapture(s.pointerId), t.domElement.removeEventListener("pointermove", de), t.domElement.removeEventListener("pointerup", $), t.dispatchEvent(qe), n = i.NONE;
          break;
        case 1:
          const l = g[0], p = j[l];
          ke({ pointerId: l, pageX: p.x, pageY: p.y });
          break;
      }
    }
    function Tt(s) {
      let l;
      switch (s.button) {
        case 0:
          l = t.mouseButtons.LEFT;
          break;
        case 1:
          l = t.mouseButtons.MIDDLE;
          break;
        case 2:
          l = t.mouseButtons.RIGHT;
          break;
        default:
          l = -1;
      }
      switch (l) {
        case N.DOLLY:
          if (t.enableZoom === !1) return;
          ht(s), n = i.DOLLY;
          break;
        case N.ROTATE:
          if (s.ctrlKey || s.metaKey || s.shiftKey) {
            if (t.enablePan === !1) return;
            _e(s), n = i.PAN;
          } else {
            if (t.enableRotate === !1) return;
            Se(s), n = i.ROTATE;
          }
          break;
        case N.PAN:
          if (s.ctrlKey || s.metaKey || s.shiftKey) {
            if (t.enableRotate === !1) return;
            Se(s), n = i.ROTATE;
          } else {
            if (t.enablePan === !1) return;
            _e(s), n = i.PAN;
          }
          break;
        default:
          n = i.NONE;
      }
      n !== i.NONE && t.dispatchEvent(ge);
    }
    function Lt(s) {
      switch (n) {
        case i.ROTATE:
          if (t.enableRotate === !1) return;
          ut(s);
          break;
        case i.DOLLY:
          if (t.enableZoom === !1) return;
          mt(s);
          break;
        case i.PAN:
          if (t.enablePan === !1) return;
          pt(s);
          break;
      }
    }
    function Oe(s) {
      t.enabled === !1 || t.enableZoom === !1 || n !== i.NONE || (s.preventDefault(), t.dispatchEvent(ge), ft(vt(s)), t.dispatchEvent(qe));
    }
    function vt(s) {
      const l = s.deltaMode, p = {
        clientX: s.clientX,
        clientY: s.clientY,
        deltaY: s.deltaY
      };
      switch (l) {
        case 1:
          p.deltaY *= 16;
          break;
        case 2:
          p.deltaY *= 100;
          break;
      }
      return s.ctrlKey && !I && (p.deltaY *= 10), p;
    }
    function Ce(s) {
      s.key === "Control" && (I = !0, t.domElement.getRootNode().addEventListener("keyup", ze, { passive: !0, capture: !0 }));
    }
    function ze(s) {
      s.key === "Control" && (I = !1, t.domElement.getRootNode().removeEventListener("keyup", ze, { passive: !0, capture: !0 }));
    }
    function he(s) {
      t.enabled === !1 || t.enablePan === !1 || gt(s);
    }
    function ke(s) {
      switch (Fe(s), g.length) {
        case 1:
          switch (t.touches.ONE) {
            case Y.ROTATE:
              if (t.enableRotate === !1) return;
              Ee(s), n = i.TOUCH_ROTATE;
              break;
            case Y.PAN:
              if (t.enablePan === !1) return;
              Me(s), n = i.TOUCH_PAN;
              break;
            default:
              n = i.NONE;
          }
          break;
        case 2:
          switch (t.touches.TWO) {
            case Y.DOLLY_PAN:
              if (t.enableZoom === !1 && t.enablePan === !1) return;
              yt(s), n = i.TOUCH_DOLLY_PAN;
              break;
            case Y.DOLLY_ROTATE:
              if (t.enableZoom === !1 && t.enableRotate === !1) return;
              bt(s), n = i.TOUCH_DOLLY_ROTATE;
              break;
            default:
              n = i.NONE;
          }
          break;
        default:
          n = i.NONE;
      }
      n !== i.NONE && t.dispatchEvent(ge);
    }
    function St(s) {
      switch (Fe(s), n) {
        case i.TOUCH_ROTATE:
          if (t.enableRotate === !1) return;
          je(s), t.update();
          break;
        case i.TOUCH_PAN:
          if (t.enablePan === !1) return;
          Ae(s), t.update();
          break;
        case i.TOUCH_DOLLY_PAN:
          if (t.enableZoom === !1 && t.enablePan === !1) return;
          wt(s), t.update();
          break;
        case i.TOUCH_DOLLY_ROTATE:
          if (t.enableZoom === !1 && t.enableRotate === !1) return;
          xt(s), t.update();
          break;
        default:
          n = i.NONE;
      }
    }
    function Re(s) {
      t.enabled !== !1 && s.preventDefault();
    }
    function _t(s) {
      g.push(s.pointerId);
    }
    function Et(s) {
      delete j[s.pointerId];
      for (let l = 0; l < g.length; l++)
        if (g[l] == s.pointerId) {
          g.splice(l, 1);
          return;
        }
    }
    function Mt(s) {
      for (let l = 0; l < g.length; l++)
        if (g[l] == s.pointerId) return !0;
      return !1;
    }
    function Fe(s) {
      let l = j[s.pointerId];
      l === void 0 && (l = new T(), j[s.pointerId] = l), l.set(s.pageX, s.pageY);
    }
    function U(s) {
      const l = s.pointerId === g[0] ? g[1] : g[0];
      return j[l];
    }
    t.domElement.addEventListener("contextmenu", Re), t.domElement.addEventListener("pointerdown", Ie), t.domElement.addEventListener("pointercancel", $), t.domElement.addEventListener("wheel", Oe, { passive: !1 }), t.domElement.getRootNode().addEventListener("keydown", Ce, { passive: !0, capture: !0 }), this.update();
  }
}
class Wo extends Uo {
  constructor(e, o) {
    super(e, o), this.screenSpacePanning = !1, this.mouseButtons = { LEFT: N.PAN, MIDDLE: N.DOLLY, RIGHT: N.ROTATE }, this.touches = { ONE: Y.PAN, TWO: Y.DOLLY_ROTATE };
  }
}
class Ho extends tt {
  scene;
  renderer;
  camera;
  controls;
  ambLight;
  dirLight;
  container;
  _clock = new et();
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
  constructor(e, o = { centerPostion: new m(0, 0, -3e3), cameraPosition: new m(0, 3e4, 0) }) {
    super();
    const t = typeof e == "string" ? document.querySelector(e) : e;
    if (t instanceof HTMLElement)
      this.container = t, this.renderer = this._createRenderer(), this.scene = this._createScene(), this.camera = this._createCamera(o.cameraPosition), this.controls = this._createControls(o.centerPostion), this.ambLight = this._createAmbLight(), this.scene.add(this.ambLight), this.dirLight = this._createDirLight(o.centerPostion), this.scene.add(this.dirLight), this.container.appendChild(this.renderer.domElement), window.addEventListener("resize", this.resize.bind(this)), this.resize(), this.renderer.setAnimationLoop(this.animate.bind(this));
    else
      throw `${e} not found!}`;
  }
  _createScene() {
    const e = new Bt(), o = 14414079;
    return e.background = new xe(o), e.fog = new We(o, 0), e;
  }
  _createRenderer() {
    const e = new Yt({
      antialias: !1,
      alpha: !0,
      logarithmicDepthBuffer: !0,
      precision: "highp"
    });
    return e.debug.checkShaderErrors = !0, e.sortObjects = !0, e.setPixelRatio(window.devicePixelRatio), e;
  }
  _createCamera(e) {
    const o = new Gt(70, 1, 0.1, 5e4);
    return o.position.copy(e), o;
  }
  _createControls(e) {
    const o = new Wo(this.camera, this.container);
    return o.target.copy(e), o.screenSpacePanning = !1, o.minDistance = 0.1, o.maxDistance = 3e4, o.enableDamping = !0, o.keyPanSpeed = 5, o.listenToKeyEvents(window), o.addEventListener("change", () => {
      const t = Math.max(this.controls.getPolarAngle(), 0.1), i = Math.max(this.controls.getDistance(), 0.1);
      o.zoomSpeed = Math.max(Math.log(i), 1.8), this.camera.far = H.clamp(i / t * 8, 100, 5e4), this.camera.near = this.camera.far / 1e3, this.camera.updateProjectionMatrix(), this.scene.fog instanceof We && (this.scene.fog.density = t / (i + 5) * this.fogFactor * 0.25), i > 8e3 ? (o.minAzimuthAngle = 0, o.maxAzimuthAngle = 0) : (o.minAzimuthAngle = -1 / 0, o.maxAzimuthAngle = 1 / 0), o.maxPolarAngle = Math.min(Math.pow(1e4, 4) / Math.pow(i, 4), 1.3);
    }), o;
  }
  _createAmbLight() {
    return new Zt(16777215, 1);
  }
  _createDirLight(e) {
    const o = new Ut(16777215, 1);
    return o.position.set(0, 2e3, 1e3), o.target.position.copy(e), o;
  }
  resize() {
    const e = this.width, o = this.height;
    return this.renderer.setPixelRatio(window.devicePixelRatio), this.renderer.setSize(e, o), this.camera.aspect = e / o, this.camera.updateProjectionMatrix(), this;
  }
  animate() {
    this.controls.update(), this.renderer.render(this.scene, this.camera), this.dispatchEvent({ type: "update", delta: this._clock.getDelta() });
  }
}
class Xo extends _ {
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
class Ko extends _ {
  dataType = "image";
  attribution = "ArcGIS";
  style = "World_Imagery";
  url = "https://services.arcgisonline.com/arcgis/rest/services/{style}/MapServer/tile/{z}/{y}/{x}";
  constructor(e) {
    super(e), Object.assign(this, e);
  }
}
class $o extends _ {
  dataType = "lerc";
  attribution = "ArcGIS";
  maxLevel = 13;
  url = "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer/tile/{z}/{y}/{x}";
  constructor(e) {
    super(e), Object.assign(this, e);
  }
}
class Vo extends _ {
  dataType = "image";
  attribution = "Bing[GS(2021)1731号]";
  style = "A";
  mkt = "zh-CN";
  subdomains = "123";
  constructor(e) {
    super(e), Object.assign(this, e);
  }
  getUrl(e, o, t) {
    const i = qo(t, e, o);
    return `https://t${this.s}.dynamic.tiles.ditu.live.com/comp/ch/${i}?mkt=${this.mkt}&ur=CN&it=${this.style}&n=z&og=804&cstl=vb`;
  }
}
function qo(r, e, o) {
  let t = "";
  for (let i = r; i > 0; i--) {
    const n = 1 << i - 1;
    let a = 0;
    e & n && a++, o & n && (a += 2), t += a;
  }
  return t;
}
class Qo extends _ {
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
class Jo extends _ {
  dataType = "image";
  maxLevel = 16;
  attribution = "GeoQ[GS(2019)758号]";
  style = "ChinaOnlineStreetPurplishBlue";
  url = "https://map.geoq.cn/ArcGIS/rest/services/{style}/MapServer/tile/{z}/{y}/{x}";
  constructor(e) {
    super(e), Object.assign(this, e);
  }
}
class es extends _ {
  dataType = "image";
  attribution = "Google";
  maxLevel = 20;
  style = "y";
  subdomains = "0123";
  // 已失效
  // public url = "https://gac-geo.googlecnapps.cn/maps/vt?lyrs={style}&x={x}&y={y}&z={z}";
  // 2024年新地址，不知道能坚持多久。 续：坚持不到10天就挂了。
  url = "https://gac-geo.googlecnapps.club/maps/vt?lyrs={style}&x={x}&y={y}&z={z}";
  // 访问原版google，你懂的
  // public url = "http://mt{s}.google.com/vt/lyrs={style}&src=app&x={x}&y={y}&z={z}";
  constructor(e) {
    super(e), Object.assign(this, e);
  }
}
class ts extends _ {
  attribution = "MapTiler";
  token = "get_your_own_key_QmavnBrQwNGsQ8YvPzZg";
  format = "jpg";
  style = "satellite-v2";
  url = "https://api.maptiler.com/tiles/{style}/{z}/{x}/{y}.{format}?key={token}";
  constructor(e) {
    super(e), Object.assign(this, e);
  }
}
class os extends _ {
  dataType = "image";
  attribution = "Stadia";
  url = "https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}.jpg";
  constructor(e) {
    super(e), Object.assign(this, e);
  }
}
class ss extends _ {
  dataType = "image";
  attribution = "天地图[GS(2023)336号]";
  token = "";
  style = "img_w";
  subdomains = "01234";
  url = "https://t{s}.tianditu.gov.cn/DataServer?T={style}&x={x}&y={y}&l={z}&tk={token}";
  constructor(e) {
    super(e), Object.assign(this, e);
  }
}
class is extends _ {
  dataType = "image";
  style = "sateTiles";
  attribution = "腾讯[GS(2023)1号]";
  subdomains = "0123";
  maxLevel = 18;
  constructor(e) {
    super(e), Object.assign(this, e);
  }
  getUrl(e, o, t) {
    const i = e >> 4, n = (1 << t) - o >> 4, a = Math.pow(2, t) - 1 - o;
    return `https://p${this.s}.map.gtimg.com/${this.style}/${t}/${i}/${n}/${e}_${a}.jpg`;
  }
}
class rs extends _ {
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
const ns = `
varying vec2 vUv;
uniform vec3 bkColor;
uniform vec3 airColor;

void main() {  
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);  
}  
`, as = `



varying vec2 vUv;
uniform vec3 bkColor;
uniform vec3 airColor;

void main() {   

    // 当前点距中点的距离
    float d = distance(vUv, vec2(0.5f))*5.0f;
    
    if(d<0.49f){
        // 球体颜色
        float a = smoothstep(0.0f,0.4f,d-0.12f);     
        gl_FragColor = vec4(vec3(0.0f), a);               
    } else if(d<0.5){
        float c = (d-0.48f)/0.02f;
        gl_FragColor =vec4(mix(vec3(0.0f),airColor,c*c),1.5f-d);
    } else if(d<0.53f){
        // 光晕(0.48-0.52)
        float c = (d-0.49f)/0.04f;
        gl_FragColor = vec4(mix(airColor,bkColor,sqrt(c)),1.0);
    } else{
        // 球体外颜色
        gl_FragColor = vec4(bkColor,1.0f);
    }
    
    // #include <tonemapping_fragment>
    // #include <encodings_fragment>    
    // #include <colorspace_fragment>
    
}  
`;
class dt extends Wt {
  constructor(e) {
    super({
      uniforms: Ht.merge([
        Xt.fog,
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
      vertexShader: ns,
      fragmentShader: as,
      lights: !1
    });
  }
}
class cs extends be {
  get bkColor() {
    return this.material.uniforms.bkColor.value;
  }
  set bkColor(e) {
    this.material.uniforms.bkColor.value.set(e);
  }
  constructor(e, o = new xe(6724044)) {
    super(new G(5, 5), new dt({ bkColor: e, airColor: o })), this.renderOrder = 999;
  }
}
const ps = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ArcGisDemSource: $o,
  ArcGisSource: Ko,
  BingSource: Vo,
  EarthMaskMaterial: dt,
  FakeEarth: cs,
  GDSource: Qo,
  GLViewer: Ho,
  GeoqSource: Jo,
  GoogleSource: es,
  MapBoxSource: Xo,
  MapTilerSource: ts,
  StadiaSource: os,
  TDTSource: ss,
  TXSource: is,
  ZKXTSource: rs
}, Symbol.toStringTag, { value: "Module" })), fs = ot.version, gs = ot.author;
export {
  To as FileLoaderEx,
  st as ImageLoaderEx,
  L as LoaderFactory,
  yo as RootTile,
  ne as Tile,
  wo as TileGridGeometry,
  vo as TileLoader,
  lt as TileMap,
  bo as TileMaterial,
  us as TileSimpleGeometry,
  _ as TileSource,
  _o as TileTextureLoader,
  gs as author,
  rt as getSafeTileUrlAndRect,
  ps as plugin,
  it as rect2ImageBounds,
  ms as resizeImage,
  fs as version
};
