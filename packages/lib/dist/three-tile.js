import { LoadingManager as Ag, Vector2 as j, Box2 as Ig, PlaneGeometry as ZA, MeshBasicMaterial as tI, ImageLoader as QI, Texture as LI, SRGBColorSpace as kI, BufferAttribute as WA, MeshStandardMaterial as gg, FrontSide as Qg, CanvasTexture as UI, FileLoader as Cg, MathUtils as CI, Vector3 as p, InstancedBufferGeometry as Eg, Matrix4 as Bg, Box3 as ig, Frustum as Dg, Mesh as EI, Raycaster as dI, SpriteMaterial as og, Sprite as sg, Clock as JI, EventDispatcher as KI, MOUSE as oA, TOUCH as hA, Spherical as aI, Quaternion as hI, Ray as tg, Plane as ag, Scene as hg, Color as XA, FogExp2 as AI, WebGLRenderer as Rg, PerspectiveCamera as eg, AmbientLight as Ng, DirectionalLight as wg, ShaderMaterial as yg, UniformsUtils as Fg, UniformsLib as rg } from "three";
const cg = "0.10.0", RI = {
  name: "GuoJF"
};
console.log(`====================three-tile V${cg}==============================`);
class ng extends Ag {
  onParseEnd = void 0;
  parseEnd(A) {
    this.onParseEnd && this.onParseEnd(A);
  }
}
const X = {
  manager: new ng(),
  // Dict of dem loader
  demLoaderMap: /* @__PURE__ */ new Map(),
  // Dict of img loader
  imgLoaderMap: /* @__PURE__ */ new Map(),
  /**
   * Register material loader
   * @param loader material loader
   */
  registerMaterialLoader(Q) {
    X.imgLoaderMap.set(Q.dataType, Q), Q.info.author = Q.info.author ?? RI.name, console.log(`* Register imageLoader: '${Q.dataType}', Author: '${Q.info.author}'`);
  },
  /**
   * Register geometry loader
   * @param loader geometry loader
   */
  registerGeometryLoader(Q) {
    X.demLoaderMap.set(Q.dataType, Q), Q.info.author = Q.info.author ?? RI.name, console.log(`* Register terrainLoader: '${Q.dataType}', Author: '${Q.info.author}'`);
  },
  /**
   * Get material loader from datasource
   * @param source datasource
   * @returns material loader
   */
  getMaterialLoader(Q) {
    const A = X.imgLoaderMap.get(Q.dataType);
    if (A)
      return A;
    throw `Source dataType "${Q.dataType}" is not support!`;
  },
  /**
   * Get geometry loader from datasource
   * @param source datasouce
   * @returns geometry loader
   */
  getGeometryLoader(Q) {
    const A = X.demLoaderMap.get(Q.dataType);
    if (A)
      return A;
    throw `Source dataType "${Q.dataType}" is not support!`;
  }
  // getLoadersInfo() {
  // 	const imgLoaders = Array.from(this.imgLoaderMap.values()).map((loader) => ({
  // 		category: "image",
  // 		dataType: loader.dataType,
  // 		info: loader.info,
  // 	}));
  // 	const demLoaders = Array.from(this.demLoaderMap.values()).map((loader) => ({
  // 		category: "terrain",
  // 		dataType: loader.dataType,
  // 		info: loader.info,
  // 	}));
  // 	return [...imgLoaders, ...demLoaders];
  // },
};
class xQ {
  worker;
  /**
   * 构造函数
   *
   * @param creator 创建一个 Worker 实例的函数
   */
  constructor(A) {
    this.worker = A();
  }
  /**
   * 异步执行worker任务，并返回结果。
   *
   * @param message 要传递给worker的消息。
   * @param transfer 可转移对象的数组，用于优化内存传输。
   * @returns 返回一个Promise，解析为worker返回的结果。
   */
  async run(A, g) {
    return new Promise((I) => {
      this.worker.onmessage = (C) => {
        I(C.data);
      }, this.worker.postMessage(A, g);
    });
  }
  /**
   * 终止当前工作进程。
   */
  terminate() {
    this.worker.terminate();
  }
}
function BI(Q, A) {
  const g = Math.floor(Q[0] * A), I = Math.floor(Q[1] * A), C = Math.floor((Q[2] - Q[0]) * A), E = Math.floor((Q[3] - Q[1]) * A);
  return { sx: g, sy: I, sw: C, sh: E };
}
function iI(Q, A, g, I) {
  if (I < Q.minLevel)
    return {
      url: void 0,
      clipBounds: [0, 0, 1, 1]
    };
  if (I <= Q.maxLevel)
    return {
      url: Q._getUrl(A, g, I),
      clipBounds: [0, 0, 1, 1]
    };
  const C = Gg(A, g, I, Q.maxLevel), E = C.parentNO;
  return { url: Q._getUrl(E.x, E.y, E.z), clipBounds: C.bounds };
}
function Gg(Q, A, g, I) {
  const C = g - I, E = { x: Q >> C, y: A >> C, z: g - C }, i = Math.pow(2, C), D = Math.pow(0.5, C), o = Q % i / i - 0.5 + D / 2, R = A % i / i - 0.5 + D / 2, h = new j(o, R), t = new Ig().setFromCenterAndSize(h, new j(D, D)), r = [
    t.min.x + 0.5,
    t.min.y + 0.5,
    t.max.x + 0.5,
    t.max.y + 0.5
  ];
  return { parentNO: E, bounds: r };
}
class qI {
  _imgSource = [];
  /** Get image source */
  get imgSource() {
    return this._imgSource;
  }
  /** Set image source */
  set imgSource(A) {
    this._imgSource = A;
  }
  _demSource;
  /** Get DEM source */
  get demSource() {
    return this._demSource;
  }
  /** Set DEM source */
  set demSource(A) {
    this._demSource = A;
  }
  _useWorker = !0;
  /** Get use worker */
  get useWorker() {
    return this._useWorker;
  }
  /** Set use worker */
  set useWorker(A) {
    this._useWorker = A;
  }
  /** Loader manager */
  manager = X.manager;
  /**
   * Load getmetry and materail of tile from x, y and z coordinate.
   *
   * @returns Promise<MeshDateType> tile data
   */
  async load(A) {
    const g = await this.loadGeometry(A), I = await this.loadMaterial(A);
    console.assert(!!I && !!g);
    for (let C = 0; C < I.length; C++)
      g.addGroup(0, 1 / 0, C);
    return { materials: I, geometry: g };
  }
  /**
   * Unload tile mesh data
   * @param tileMesh tile mesh
   */
  unload(A) {
    const g = A.material, I = A.geometry;
    for (let C = 0; C < g.length; C++)
      g[C].dispose();
    I.dispose();
  }
  /**
   * Load geometry
   * @returns BufferGeometry
   */
  async loadGeometry(A) {
    let g;
    if (this.demSource && A.z >= this.demSource.minLevel && this._isBoundsInSourceBounds(this.demSource, A.bounds)) {
      const I = X.getGeometryLoader(this.demSource);
      I.useWorker = this.useWorker;
      const C = this.demSource;
      g = await I.load({ source: C, ...A }).catch((E) => (console.error("Load material error", C.dataType, A), new ZA())), g.addEventListener("dispose", () => {
        I.unload && I.unload(g);
      });
    } else
      g = new ZA();
    return g;
  }
  /**
   * Load material
   * @param x x coordinate of tile
   * @param y y coordinate of tile
   * @param z z coordinate of tile
   * @returns Material[]
   */
  async loadMaterial(A) {
    const I = this.imgSource.filter(
      (C) => A.z >= C.minLevel && this._isBoundsInSourceBounds(C, A.bounds)
    ).map(async (C) => {
      const E = X.getMaterialLoader(C);
      E.useWorker = this.useWorker;
      const i = await E.load({ source: C, ...A }).catch((o) => (console.error("Load material error", C.dataType, A), new tI())), D = (o) => {
        E.unload && E.unload(o.target), o.target.removeEventListener("dispose", D);
      };
      return i instanceof tI || i.addEventListener("dispose", D), i;
    });
    return Promise.all(I);
  }
  /**
   * Check the tile is in the source bounds. (projection coordinate)
   * @returns true in the bounds,else false
   */
  _isBoundsInSourceBounds(A, g) {
    const I = A._projectionBounds;
    return !(g[2] < I[0] || g[3] < I[1] || g[0] > I[2] || g[1] > I[3]);
  }
}
class OQ {
  // image loader
  loader = new QI(X.manager);
  /**
   * load the tile texture
   * @param tile tile to load
   * @param source datasource
   * @returns texture
   */
  async load(A, g, I, C) {
    const E = new LI(new Image(1, 1));
    E.colorSpace = kI;
    const { url: i, clipBounds: D } = iI(A, g, I, C);
    if (i) {
      const o = await this.loader.loadAsync(i);
      C > A.maxLevel ? E.image = Sg(o, D) : E.image = o;
    }
    return E;
  }
}
function Sg(Q, A) {
  const g = Q.width, I = new OffscreenCanvas(g, g), C = I.getContext("2d"), { sx: E, sy: i, sw: D, sh: o } = BI(A, Q.width);
  return C.drawImage(Q, E, i, D, o, 0, 0, g, g), I;
}
function TA(...Q) {
  const A = Q, g = A && A.length > 1 && A[0].constructor || null;
  if (!g)
    throw new Error(
      "concatenateTypedArrays - incorrect quantity of arguments or arguments have incompatible data types"
    );
  const I = A.reduce((i, D) => i + D.length, 0), C = new g(I);
  let E = 0;
  for (const i of A)
    C.set(i, E), E += i.length;
  return C;
}
function YI(Q, A, g, I) {
  const C = I ? Lg(I, Q.position.value) : Mg(A), E = C.length, i = new Float32Array(E * 6), D = new Float32Array(E * 4), o = new A.constructor(E * 6), R = new Float32Array(E * 6);
  for (let t = 0; t < E; t++)
    kg({
      edge: C[t],
      edgeIndex: t,
      attributes: Q,
      skirtHeight: g,
      newPosition: i,
      newTexcoord0: D,
      newTriangles: o,
      newNormals: R
    });
  Q.position.value = TA(Q.position.value, i), Q.texcoord.value = TA(Q.texcoord.value, D), Q.normal.value = TA(Q.normal.value, R);
  const h = TA(A, o);
  return {
    attributes: Q,
    indices: h
  };
}
function Mg(Q) {
  const A = [], g = Array.isArray(Q) ? Q : Array.from(Q);
  for (let C = 0; C < g.length; C += 3) {
    const E = g[C], i = g[C + 1], D = g[C + 2];
    A.push([E, i], [i, D], [D, E]);
  }
  A.sort(([C, E], [i, D]) => {
    const o = Math.min(C, E), R = Math.min(i, D);
    return o !== R ? o - R : Math.max(C, E) - Math.max(i, D);
  });
  const I = [];
  for (let C = 0; C < A.length; C++)
    C + 1 < A.length && A[C][0] === A[C + 1][1] && A[C][1] === A[C + 1][0] ? C++ : I.push(A[C]);
  return I;
}
function Lg(Q, A) {
  const g = (C, E) => {
    C.sort(E);
  };
  g(Q.westIndices, (C, E) => A[3 * C + 1] - A[3 * E + 1]), g(Q.eastIndices, (C, E) => A[3 * E + 1] - A[3 * C + 1]), g(Q.southIndices, (C, E) => A[3 * E] - A[3 * C]), g(Q.northIndices, (C, E) => A[3 * C] - A[3 * E]);
  const I = [];
  return Object.values(Q).forEach((C) => {
    if (C.length > 1)
      for (let E = 0; E < C.length - 1; E++)
        I.push([C[E], C[E + 1]]);
  }), I;
}
function kg({
  edge: Q,
  edgeIndex: A,
  attributes: g,
  skirtHeight: I,
  newPosition: C,
  newTexcoord0: E,
  newTriangles: i,
  newNormals: D
}) {
  const o = g.position.value.length, R = A * 2, h = R + 1;
  C.set(g.position.value.subarray(Q[0] * 3, Q[0] * 3 + 3), R * 3), C[R * 3 + 2] = C[R * 3 + 2] - I, C.set(g.position.value.subarray(Q[1] * 3, Q[1] * 3 + 3), h * 3), C[h * 3 + 2] = C[h * 3 + 2] - I, E.set(g.texcoord.value.subarray(Q[0] * 2, Q[0] * 2 + 2), R * 2), E.set(g.texcoord.value.subarray(Q[1] * 2, Q[1] * 2 + 2), h * 2);
  const t = A * 2 * 3;
  i[t] = Q[0], i[t + 1] = o / 3 + h, i[t + 2] = Q[1], i[t + 3] = o / 3 + h, i[t + 4] = Q[0], i[t + 5] = o / 3 + R, D[t] = 0, D[t + 1] = 0, D[t + 2] = 1, D[t + 3] = 0, D[t + 4] = 0, D[t + 5] = 1;
}
function Ug(Q, A = !0) {
  if (Q.length < 4)
    throw new Error(`DEM array must > 4, got ${Q.length}!`);
  const g = Math.floor(Math.sqrt(Q.length)), I = g, C = g, E = HI(C, I), i = dg(Q, C, I);
  return A ? YI(i, E, 1) : { attributes: i, indices: E };
}
function dg(Q, A, g) {
  const I = g * A, C = new Float32Array(I * 3), E = new Float32Array(I * 2);
  let i = 0;
  for (let D = 0; D < A; D++)
    for (let o = 0; o < g; o++) {
      const R = o / (g - 1), h = D / (A - 1);
      E[i * 2] = R, E[i * 2 + 1] = h, C[i * 3] = R - 0.5, C[i * 3 + 1] = h - 0.5, C[i * 3 + 2] = Q[(A - D - 1) * g + o], i++;
    }
  return {
    // 顶点位置属性
    position: { value: C, size: 3 },
    // UV坐标属性
    texcoord: { value: E, size: 2 },
    // 法线属性
    normal: { value: lI(C, HI(A, g)), size: 3 }
  };
}
function HI(Q, A) {
  const g = 6 * (A - 1) * (Q - 1), I = new Uint16Array(g);
  let C = 0;
  for (let E = 0; E < Q - 1; E++)
    for (let i = 0; i < A - 1; i++) {
      const D = E * A + i, o = D + 1, R = D + A, h = R + 1, t = C * 6;
      I[t] = D, I[t + 1] = o, I[t + 2] = R, I[t + 3] = R, I[t + 4] = o, I[t + 5] = h, C++;
    }
  return I;
}
function lI(Q, A) {
  const g = new Float32Array(Q.length);
  for (let I = 0; I < A.length; I += 3) {
    const C = A[I] * 3, E = A[I + 1] * 3, i = A[I + 2] * 3, D = Q[C], o = Q[C + 1], R = Q[C + 2], h = Q[E], t = Q[E + 1], r = Q[E + 2], F = Q[i], c = Q[i + 1], N = Q[i + 2], L = h - D, n = t - o, y = r - R, M = F - D, k = c - o, d = N - R, q = n * d - y * k, G = y * M - L * d, J = L * k - n * M, Y = Math.sqrt(q * q + G * G + J * J), l = [0, 0, 1];
    if (Y > 0) {
      const K = 1 / Y;
      l[0] = q * K, l[1] = G * K, l[2] = J * K;
    }
    for (let K = 0; K < 3; K++)
      g[C + K] = g[E + K] = g[i + K] = l[K];
  }
  return g;
}
class DI extends ZA {
  type = "TileGeometry";
  /**
   * set attribute data to geometry
   * @param data geometry data
   * @returns this
   */
  setData(A) {
    A instanceof Float32Array && (A = Ug(A, !0)), A = YI(A.attributes, A.indices, 10), this.setIndex(new WA(A.indices, 1));
    const { attributes: g } = A;
    return this.setAttribute("position", new WA(g.position.value, g.position.size)), this.setAttribute("uv", new WA(g.texcoord.value, g.texcoord.size)), this.setAttribute("normal", new WA(g.normal.value, g.normal.size)), this.computeBoundingBox(), this.computeBoundingSphere(), this;
  }
  // /**
  //  * set DEM data to geometry
  //  *
  //  * @param dem Float32Array类型，表示地形高度图数据
  //  * @returns 返回设置地形高度图数据后的对象
  //  */
  // public setDEM(dem: Float32Array) {
  // 	let geoData = getGeometryDataFromDem(dem, true);
  // 	geoData = addSkirt(geoData.attributes, geoData.indices, 1);
  // 	return this.setData(geoData);
  // }
}
class Jg {
  /**
   * Size of the grid to be generated.
   */
  gridSize;
  /**
   * Number of triangles to be used in the tile.
   */
  numTriangles;
  /**
   * Number of triangles in the parent node.
   */
  numParentTriangles;
  /**
   * Indices of the triangles faces.
   */
  indices;
  /**
   * Coordinates of the points composing the mesh.
   */
  coords;
  /**
   * Constructor for the generator.
   *
   * @param gridSize - Size of the grid.
   */
  constructor(A = 257) {
    this.gridSize = A;
    const g = A - 1;
    if (g & g - 1)
      throw new Error(`Expected grid size to be 2^n+1, got ${A}.`);
    this.numTriangles = g * g * 2 - 2, this.numParentTriangles = this.numTriangles - g * g, this.indices = new Uint32Array(this.gridSize * this.gridSize), this.coords = new Uint16Array(this.numTriangles * 4);
    for (let I = 0; I < this.numTriangles; I++) {
      let C = I + 2, E = 0, i = 0, D = 0, o = 0, R = 0, h = 0;
      for (C & 1 ? D = o = R = g : E = i = h = g; (C >>= 1) > 1; ) {
        const r = E + D >> 1, F = i + o >> 1;
        C & 1 ? (D = E, o = i, E = R, i = h) : (E = D, i = o, D = R, o = h), R = r, h = F;
      }
      const t = I * 4;
      this.coords[t + 0] = E, this.coords[t + 1] = i, this.coords[t + 2] = D, this.coords[t + 3] = o;
    }
  }
  createTile(A) {
    return new Kg(A, this);
  }
}
class Kg {
  /**
   * Pointer to the martini generator object.
   */
  martini;
  /**
   * Terrain to generate the tile for.
   */
  terrain;
  /**
   * Errors detected while creating the tile.
   */
  errors;
  constructor(A, g) {
    const I = g.gridSize;
    if (A.length !== I * I)
      throw new Error(
        `Expected terrain data of length ${I * I} (${I} x ${I}), got ${A.length}.`
      );
    this.terrain = A, this.martini = g, this.errors = new Float32Array(A.length), this.update();
  }
  update() {
    const { numTriangles: A, numParentTriangles: g, coords: I, gridSize: C } = this.martini, { terrain: E, errors: i } = this;
    for (let D = A - 1; D >= 0; D--) {
      const o = D * 4, R = I[o + 0], h = I[o + 1], t = I[o + 2], r = I[o + 3], F = R + t >> 1, c = h + r >> 1, N = F + c - h, L = c + R - F, n = (E[h * C + R] + E[r * C + t]) / 2, y = c * C + F, M = Math.abs(n - E[y]);
      if (i[y] = Math.max(i[y], M), D < g) {
        const k = (h + L >> 1) * C + (R + N >> 1), d = (r + L >> 1) * C + (t + N >> 1);
        i[y] = Math.max(i[y], i[k], i[d]);
      }
    }
  }
  getGeometryData(A = 0) {
    const { gridSize: g, indices: I } = this.martini, { errors: C } = this;
    let E = 0, i = 0;
    const D = g - 1;
    let o, R, h = 0;
    I.fill(0);
    function t(y, M, k, d, q, G) {
      const J = y + k >> 1, Y = M + d >> 1;
      Math.abs(y - q) + Math.abs(M - G) > 1 && C[Y * g + J] > A ? (t(q, G, y, M, J, Y), t(k, d, q, G, J, Y)) : (o = M * g + y, R = d * g + k, h = G * g + q, I[o] === 0 && (I[o] = ++E), I[R] === 0 && (I[R] = ++E), I[h] === 0 && (I[h] = ++E), i++);
    }
    t(0, 0, D, D, D, 0), t(D, D, 0, 0, 0, D);
    const r = E * 2, F = i * 3, c = new Uint16Array(r), N = new Uint32Array(F);
    let L = 0;
    function n(y, M, k, d, q, G) {
      const J = y + k >> 1, Y = M + d >> 1;
      if (Math.abs(y - q) + Math.abs(M - G) > 1 && C[Y * g + J] > A)
        n(q, G, y, M, J, Y), n(k, d, q, G, J, Y);
      else {
        const l = I[M * g + y] - 1, K = I[d * g + k] - 1, f = I[G * g + q] - 1;
        c[2 * l] = y, c[2 * l + 1] = M, c[2 * K] = k, c[2 * K + 1] = d, c[2 * f] = q, c[2 * f + 1] = G, N[L++] = l, N[L++] = K, N[L++] = f;
      }
    }
    return n(0, 0, D, D, D, 0), n(D, D, 0, 0, 0, D), {
      attributes: this._getMeshAttributes(this.terrain, c, N),
      indices: N
    };
  }
  _getMeshAttributes(A, g, I) {
    const C = Math.floor(Math.sqrt(A.length)), E = C - 1, i = g.length / 2, D = new Float32Array(i * 3), o = new Float32Array(i * 2);
    for (let h = 0; h < i; h++) {
      const t = g[h * 2], r = g[h * 2 + 1], F = r * C + t;
      D[3 * h + 0] = t / E - 0.5, D[3 * h + 1] = 0.5 - r / E, D[3 * h + 2] = A[F], o[2 * h + 0] = t / E, o[2 * h + 1] = 1 - r / E;
    }
    const R = lI(D, I);
    return {
      position: { value: D, size: 3 },
      texcoord: { value: o, size: 2 },
      normal: { value: R, size: 3 }
    };
  }
}
class fI {
  info = {
    version: "0.10.0",
    description: "Terrain loader base class"
  };
  dataType = "";
  useWorker = !0;
  /**
   * load tile's data from source
   * @param source
   * @param tile
   * @param onError
   * @returns
   */
  async load(A) {
    const { source: g, x: I, y: C, z: E } = A, { url: i, clipBounds: D } = iI(g, I, C, E);
    if (!i)
      return new DI();
    const o = await this.doLoad(i, { source: g, x: I, y: C, z: E, bounds: D });
    return X.manager.parseEnd(i), o;
  }
}
class uI extends gg {
  constructor(A = {}) {
    super({ transparent: !0, side: Qg, ...A });
  }
  setTexture(A) {
    this.map = A, this.needsUpdate = !0;
  }
  dispose() {
    const A = this.map;
    A && (A.image instanceof ImageBitmap && A.image.close(), A.dispose());
  }
}
var dA = /* @__PURE__ */ ((Q) => (Q[Q.Unknown = 0] = "Unknown", Q[Q.Point = 1] = "Point", Q[Q.Linestring = 2] = "Linestring", Q[Q.Polygon = 3] = "Polygon", Q))(dA || {});
class pQ {
  /**
   * 渲染矢量数据
   * @param ctx 渲染上下文
   * @param type 元素类型
   * @param feature 元素
   * @param style 样式
   * @param scale 拉伸倍数
   */
  render(A, g, I, C, E = 1) {
    switch (A.lineCap = "round", A.lineJoin = "round", (C.shadowBlur ?? 0) > 0 && (A.shadowBlur = C.shadowBlur ?? 2, A.shadowColor = C.shadowColor ?? "black", A.shadowOffsetX = C.shadowOffset ? C.shadowOffset[0] : 0, A.shadowOffsetY = C.shadowOffset ? C.shadowOffset[1] : 0), g) {
      case dA.Point:
        A.textAlign = "center", A.textBaseline = "middle", A.font = C.font ?? "14px Arial", A.fillStyle = C.fontColor ?? "white", this._renderPointText(A, I, E, C.textField ?? "name", C.fontOffset ?? [0, -8]);
        break;
      case dA.Linestring:
        this._renderLineString(A, I, E);
        break;
      case dA.Polygon:
        this._renderPolygon(A, I, E);
        break;
      default:
        console.warn(`Unknown feature type: ${g}`);
    }
    (C.fill || g === dA.Point) && (A.globalAlpha = C.fillOpacity || 0.5, A.fillStyle = C.fillColor || C.color || "#3388ff", A.fill(C.fillRule || "evenodd")), (C.stroke ?? !0) && (C.weight ?? 1) > 0 && (A.globalAlpha = C.opacity || 1, A.lineWidth = C.weight || 1, A.strokeStyle = C.color || "#3388ff", A.setLineDash(C.dashArray || []), A.stroke());
  }
  // 渲染点要素
  _renderPointText(A, g, I = 1, C = "name", E = [0, 0]) {
    const i = g.geometry;
    A.beginPath();
    for (const o of i)
      for (let R = 0; R < o.length; R++) {
        const h = o[R];
        A.arc(h.x * I, h.y * I, 2, 0, 2 * Math.PI);
      }
    const D = g.properties;
    D && D[C] && A.fillText(
      D[C],
      i[0][0].x * I + E[0],
      i[0][0].y * I + E[1]
    );
  }
  // 渲染线要素
  _renderLineString(A, g, I) {
    const C = g.geometry;
    A.beginPath();
    for (const E of C)
      for (let i = 0; i < E.length; i++) {
        const { x: D, y: o } = E[i];
        i === 0 ? A.moveTo(D * I, o * I) : A.lineTo(D * I, o * I);
      }
  }
  // 渲染面要素
  _renderPolygon(A, g, I) {
    const C = g.geometry;
    A.beginPath();
    for (let E = 0; E < C.length; E++) {
      const i = C[E];
      for (let D = 0; D < i.length; D++) {
        const { x: o, y: R } = i[D];
        D === 0 ? A.moveTo(o * I, R * I) : A.lineTo(o * I, R * I);
      }
      A.closePath();
    }
  }
}
class qg {
  info = {
    version: "0.10.0",
    description: "Image loader base class"
  };
  dataType = "";
  useWorker = !0;
  /**
   * Load tile data from source
   * @param source
   * @param tile
   * @returns
   */
  async load(A) {
    const { source: g, x: I, y: C, z: E } = A, i = new uI(), { url: D, clipBounds: o } = iI(g, I, C, E);
    if (D) {
      const R = await this.doLoad(D, { source: g, x: I, y: C, z: E, bounds: o });
      i.map = R, X.manager.parseEnd(D);
    }
    return i;
  }
}
class mQ {
  info = {
    version: "0.10.0",
    description: "Canvas tile abstract loader"
  };
  dataType = "";
  useWorker = !1;
  /**
   * Asynchronously load tile material
   * @param params Tile loading parameters
   * @returns Returns the tile material
   */
  async load(A) {
    const g = this._creatCanvasContext(256, 256);
    this.drawTile(g, A);
    const I = new UI(g.canvas.transferToImageBitmap());
    return new uI({
      transparent: !0,
      map: I,
      opacity: A.source.opacity
    });
  }
  _creatCanvasContext(A, g) {
    const C = new OffscreenCanvas(A, g).getContext("2d");
    if (!C)
      throw new Error("create canvas context failed");
    return C.scale(1, -1), C.translate(0, -g), C;
  }
}
class Yg extends qg {
  info = {
    version: "0.10.0",
    description: "Tile image loader. It can load xyz tile image."
  };
  dataType = "image";
  loader = new QI(X.manager);
  /**
   * 加载图像资源的方法
   *
   * @param url 图像资源的URL
   * @param params 加载参数，包括x, y, z坐标和裁剪边界clipBounds
   * @returns 返回一个Promise对象，解析为HTMLImageElement类型。
   */
  async doLoad(A, g) {
    const I = await this.loader.loadAsync(A), C = new LI();
    C.colorSpace = kI;
    const { bounds: E } = g;
    return E[2] - E[0] < 1 ? C.image = Hg(I, E) : C.image = I, C.needsUpdate = !0, C;
  }
}
function Hg(Q, A) {
  const g = Q.width, I = new OffscreenCanvas(g, g), C = I.getContext("2d"), { sx: E, sy: i, sw: D, sh: o } = BI(A, Q.width);
  return C.drawImage(Q, E, i, D, o, 0, 0, g, g), I;
}
lQ(new Yg());
class xI {
  constructor(A = 4) {
    this.pool = A, this.queue = [], this.workers = [], this.workersResolve = [], this.workerStatus = 0;
  }
  _initWorker(A) {
    if (!this.workers[A]) {
      const g = this.workerCreator();
      g.addEventListener("message", this._onMessage.bind(this, A)), this.workers[A] = g;
    }
  }
  _getIdleWorker() {
    for (let A = 0; A < this.pool; A++)
      if (!(this.workerStatus & 1 << A)) return A;
    return -1;
  }
  _onMessage(A, g) {
    const I = this.workersResolve[A];
    if (I && I(g), this.queue.length) {
      const { resolve: C, msg: E, transfer: i } = this.queue.shift();
      this.workersResolve[A] = C, this.workers[A].postMessage(E, i);
    } else
      this.workerStatus ^= 1 << A;
  }
  setWorkerCreator(A) {
    this.workerCreator = A;
  }
  setWorkerLimit(A) {
    this.pool = A;
  }
  postMessage(A, g) {
    return new Promise((I) => {
      const C = this._getIdleWorker();
      C !== -1 ? (this._initWorker(C), this.workerStatus |= 1 << C, this.workersResolve[C] = I, this.workers[C].postMessage(A, g)) : this.queue.push({ resolve: I, msg: A, transfer: g });
    });
  }
  dispose() {
    this.workers.forEach((A) => A.terminate()), this.workersResolve.length = 0, this.workers.length = 0, this.queue.length = 0, this.workerStatus = 0;
  }
}
const lg = "data:application/wasm;base64,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Tg0AA0AgCiACQQN0ai8BAEUNASACQQFqIgIgA0cNAAsgAyECDAELIAIhBSACIANODQEDQCAKIAVBA3RqLwEADQIgBUEBaiIFIANHDQALCyADIAJrIgUgCSAFIAlKIgUbIQkgAiAIIAUbIQgMAgsgBSACayILIAkgCSALSCILGyEJIAIgCCALGyEIIAMgBSICSg0ACwsgAyAJayAAIARrSARAIAYgCCAJajYCFCAGIAMgCGoiADYCECAGKAIUIQQLQQAhAiAAIARMDQAgACAEayIFQQFxIQkCQCAEQQFqIABGBEBBACEADAELIAVBfnEhBUEAIQADQCAAIAogBEEAIAMgAyAEShtrQQN0ai8BACIIIAAgCEobIgAgCiAEQQFqIghBACADIAMgCEoba0EDdGovAQAiCCAAIAhKGyEAIARBAmohBCACQQJqIgIgBUcNAAsLIAkEQCAAIAogBEEAIAMgAyAEShtrQQN0ai8BACICIAAgAkobIQALIABBIWsiAkFgTwRAIAYgADYCDAsgAkFfSyECCwJAIAIiCkUNACAHKAIIIQwgBygCBCENIAEgBigCDCILIAcoAhwiDiALIA5IGyIANgIAIAcgBygCEDYCFCAGQX82AhhBACEFQQAhCAJAQQEgAHQiAyAHKAIYIgAgBygCECICa0ECdU0EQAJAIAcoAhQiBSACa0ECdSIJIAMgAyAJSxsiBEUNACAEQQFrIQ8CQCAEQQNxIhBFBEAgAiEADAELIAIhAANAIAAgBi8BGDsBACAAIAYvARo7AQIgBEEBayEEIABBBGohACAIQQFqIgggEEcNAAsLIA9BA0kNAANAIAAgBi8BGDsBACAAIAYvARo7AQIgACAGLwEYOwEEIAAgBi8BGjsBBiAAIAYvARg7AQggACAGLwEaOwEKIAAgBi8BGDsBDCAAIAYvARo7AQ4gAEEQaiEAIARBBGsiBA0ACwsgAyAJSwRAIAUgAyAJa0ECdGohAANAIAUgBigBGDYBACAFQQRqIgUgAEcNAAsgByAANgIUDAILIAcgAiADQQJ0ajYCFAwBCyACBEAgByACNgIUIAIQBiAHQQA2AhggB0IANwIQQQAhAAsCQCADQYCAgIAETw0AIABBAXUiAiADIAIgA0sbQf////8DIABB/P///wdJGyIAQYCAgIAETw0AIAcgAEECdCIAEAki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QYCAgHxxakGAgIB8cXIiCDYCACADIAQgB2oiB0ECdGoiASAJIAEoAgAiAWpB////A3EgCCABQYCAgHxxakGAgIB8cXIiATYCACAEIAdqIQcgD0ECaiIPIBZHDQALCyAQRQ0AIAMgB0ECdGoiByABIAcoAgAiB2pB////A3EgASAHQYCAgHxxakGAgIB8cXI2AgALIANBBGohAyARQQFqIhEgBEcNAAsLIAVFDQIgBEEBayIBQX5xIRIgAUEBcSEJQQAhESAEQQJJIQgDQAJAIAgNACAAKAIAIQNBACEPQQEhASAEQQJHBEADQCAAIAFBAnRqIgogCigCACIHQYCAgHxxIANqQYCAgHxxIAMgB2oiB0H///8DcXIiAzYCACAKIAMgCigCBCIDQYCAgHxxakGAgIB8cSADIAdqQf///wNxciIDNgIEIAFBAmohASAPQQJqIg8gEkcNAAsLIAlFDQAgACABQQJ0aiIBIAEoAgAiAUGAgIB8cSADakGAgIB8cSABIANqQf///wNxcjYCAAsgACAEQQJ0aiEAIBFBAWoiESAFRw0ACwwCC0GTDEH/CEGaB0GUCBAAAAsgBARAIAVBAmshECAFQQFrIgFBfnEhCiABQQFxIRIgBUECSSEJIAAhAwNAAkAgCQ0AIARBAUcEQEEAIQcgBCEBIBAEQANAIAMgAUEDdGoiCCADIAEgBGtBA3RqKQMAIiMgCCkDACIkfCIlQv////////8HgyAjICRCgICAgICAgHiDfEKAgICAgICAeIOEIiM3AwAgAyABIARqIghBA3RqIgEgJSABKQMAIiR8Qv////////8HgyAjICRCgICAgICAgHiDfEKAgICAgICAeIOENwMAIAQgCGohASAHQQJqIgcgCkcNAAsLIBJFDQEgAyABQQN0aiIHIAMgASAEa0EDdGopAwAiIyAHKQMAIiR8Qv////////8HgyAjICRCgICAgICAgHiDfEKAgICAgICAeIOENwMADAELIAMpAwAhI0EAIQcgBCEBIBAEQANAIAMgAUEDdGoiCCAjIAgpAwAiJHwiJUL/////////B4MgIyAkQoCAgICAgIB4g3xCgICAgICAgHiDhCIjNwMAIAMgASAEaiIIQQN0aiIBICUgASkDACIkfEL/////////B4MgIyAkQoCAgICAgIB4g3xCgICAgICAgHiDhCIjNwMAIAQgCGohASAHQQJqIgcgCkcNAAsLIBJFDQAgAyABQQN0aiIBICMgASkDACIkfEL/////////B4MgIyAkQoCAgICAgIB4g3xCgICAgICAgHiDhDcDAAsgA0EIaiEDIA9BAWoiDyAERw0ACwsgBUUNACAEQQFrIgFBfnEhEiABQQFxIQlBACEPIARBAkkhCANAAkAgCA0AIAApAwAhI0EAIQdBASEDIARBAkcEQANAIAAgA0EDdGoiASABKQMAIiRCgICAgICAgHiDICN8QoCAgICAgIB4gyAjICR8IiVC/////////weDhCIjNwMAIAEgIyABKQMIIiRCgICAgICAgHiDfEKAgICAgICAeIMgJCAlfEL/////////B4OEIiM3AwggA0ECaiEDIAdBAmoiByASRw0ACwsgCUUNACAAIANBA3RqIgEgASkDACIkQoCAgICAgIB4gyAjfEKAgICAgICAeIMgIyAkfEL/////////B4OENwMACyAAIARBA3RqIQAgD0EBaiIPIAVHDQALCyAfQQVGBEAgBiAaEFALIBgEQCAYIAY2AgAMAQsgBhAGCyAGQQBHDAILQY4LQbwIQfIEQZQIEAAACwwECyEeDAELAn8gDEEMaiEVQQAhDiAAQQJJBEAgDCgCFCIKIAwoAhAiEmsiA0EDdSIPIB8QLEYEQEEBIABBAkZBAXQgAEEBRhshHgJAIA8gBCAFbCIYbBASIgFFDQAgGARAIA9BASAPQQFLGyIAQX5xIQkgAEEBcSEIIAwoAhAhFkEAIREgA0EQSSEHA0ACQCAKIBJGDQBBACEAQQAhECAHRQRAA0AgASAWIABBA3QiBmoiAygCACAOamogAygCBCARai0AADoAACABIBYgBkEIcmoiAygCACAOamogAygCBCARai0AADoAACAAQQJqIQAgEEECaiIQIAlHDQALCyAIRQ0AIAEgFiAAQQN0aiIAKAIAIA5qaiAAKAIEIBFqLQAAOgAACyAOIA9qIQ4gEUEBaiIRIBhHDQALCyABIQBBACERAkAgHkUNAAJAAkACQCAfQQVrDgIAAgELAkAgHkECRw0AIAVFDQAgBEEBcSEWIARBAmtBfnEhECAEQQNJIQogACEDA0ACQCAKDQAgAygCBCEOQQAhD0ECIQYgBEEDRwRAA0AgAyAGQQJ0IhJqIgcgBygCACIHQYCAgHxxIA5qQYCAgHxxIAcgDmoiCUH///8DcXIiCDYCACADIBJBBHJqIgcgBygCACIHQYCAgHxxIAhqQYCAgHxxIAcgCWpB////A3FyIg42AgAgBkECaiEGIA9BAmoiDyAQRw0ACwsgFkUNACADIAZBAnRqIgYgBigCACIGQYCAgHxxIA5qQYCAgHxxIAYgDmpB////A3FyNgIACyADIARBAnRqIQMgEUEBaiIRIAVHDQALCyAeQQBMDQIgBUUNAiAEQQFrIgNBfnEhCiADQQFxIRJBACERIARBAkkhCQNAAkAgCQ0AIAAoAgAhDkEAIQ9BASEGIARBAkcEQANAIAAgBkECdGoiECAQKAIAIgNBgICAfHEgDmpBgICAfHEgAyAOaiIIQf///wNxciIHNgIAIBAgByAQKAIEIgNBgICAfHFqQYCAgHxxIAMgCGpB////A3FyIg42AgQgBkECaiEGIA9BAmoiDyAKRw0ACwsgEkUNACAAIAZBAnRqIgMgAygCACIDQYCAgHxxIA5qQYCAgHxxIAMgDmpB////A3FyNgIACyAAIARBAnRqIQAgEUEBaiIRIAVHDQALDAILQZMMQf8IQYEGQasLEAAACwJAIB5BAkcNACAFRQ0AIARBAXEhCiAEQQJrQX5xIRIgBEEDSSEJIAAhBgNAAkAgCQ0AIAYpAwghI0EAIQNBAiEOIARBA0cEQANAIAYgDkEDdCIIaiIHIAcpAwAiJEKAgICAgICAeIMgI3xCgICAgICAgHiDICMgJHwiJUL/////////B4OEIiM3AwAgBiAIQQhyaiIHICMgBykDACIkQoCAgICAgIB4g3xCgICAgICAgHiDICQgJXxC/////////weDhCIjNwMAIA5BAmohDiADQQJqIgMgEkcNAAsLIApFDQAgBiAOQQN0aiIDIAMpAwAiJEKAgICAgICAeIMgI3xCgICAgICAgHiDICMgJHxC/////////weDhDcDAAsgBiAEQQN0aiEGIBFBAWoiESAFRw0ACwsgHkEATA0AIAVFDQAgBEEBayIDQX5xIQkgA0EBcSEIQQAhBiAEQQJJIQcDQAJAIAcNACAAKQMAISNBACEDQQEhDiAEQQJHBEADQCAAIA5BA3RqIhIgEikDACIkQoCAgICAgIB4gyAjfEKAgICAgICAeIMgIyAkfCIlQv////////8Hg4QiIzcDACASICMgEikDCCIkQoCAgICAgIB4g3xCgICAgICAgHiDICQgJXxC/////////weDhCIjNwMIIA5BAmohDiADQQJqIgMgCUcNAAsLIAhFDQAgACAOQQN0aiIDIAMpAwAiJEKAgICAgICAeIMgI3xCgICAgICAgHiDICMgJHxC/////////weDhDcDAAsgACAEQQN0aiEAIAZBAWoiBiAFRw0ACwsgH0EFRgRAIAEgGBBQCyAVBEAgFSABNgIADAELIAEQBgsgAUEARwwCCwsMAwshHgsgDCgCECIAIAtHBEBBACEDIAAhCwNAIAsgA0EDdGooAgQQBiADQQFqIgMgDCgCFCAMKAIQIgtrQQN1SQ0ACwsgDCALNgIUIAwoAgwiAARAIAIgACAaICBsEAgaIAAQBgsgHgshASAMKAIQIgAEQCAAEAYLIAxBIGokACABDwtBBBACIgBB0As2AgAgAEG8EkEAEAEAC9cBAQV/AkAgAUUNACABQQFHBEAgAUF+cSEFA0AgACADQQJ0IgZqIgIgAigCACICQQF2QYCAgPwHcSACQf///wNxciACQQh0QYCAgIB4cXI2AgAgACAGQQRyaiICIAIoAgAiAkEBdkGAgID8B3EgAkH///8DcXIgAkEIdEGAgICAeHFyNgIAIANBAmohAyAEQQJqIgQgBUcNAAsLIAFBAXFFDQAgACADQQJ0aiIAIAAoAgAiAEEBdkGAgID8B3EgAEH///8DcXIgAEEIdEGAgICAeHFyNgIACwsLACAAEFIaIAAQBgsxAQJ/IABB7BU2AgAgACgCBEEMayIBIAEoAghBAWsiAjYCCCACQQBIBEAgARAGCyAAC90BAQR/IABBADYCCCAAQgA3AgACQCABBEAgAUGAgICABE8NASAAIAFBAnQiBBAJIgM2AgAgACADIARqIgQ2AgggAUEBa0H/////A3EhBSACKAIAIQIgAUEHcSIGBEBBACEBA0AgAyACNgIAIANBBGohAyABQQFqIgEgBkcNAAsLIAVBB08EQANAIAMgAjYCHCADIAI2AhggAyACNgIUIAMgAjYCECADIAI2AgwgAyACNgIIIAMgAjYCBCADIAI2AgAgA0EgaiIDIARHDQALCyAAIAQ2AgQLIAAPCxAKAAuaAQAgAEEBOgA1AkAgACgCBCACRw0AIABB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QmxvY2tTZXF1ZW5jZQByZXN0b3JlU2VxdWVuY2UAQXNzZXJ0aW9uIGZhaWxlZABzdGQ6OmJhZF9hbGxvYwBwcEJ5dGVbMF0gPT0gSFVGRk1BTl9OT1JNQUwAc2l6ZSA+IDAAUHVyZSB2aXJ0dWFsIGZ1bmN0aW9uIGNhbGxlZCEAQ250WkltYWdlIABMZXJjMiAAAAAAAAAAAHAGAAABAAAAAgAAAE42TGVyY05TMTBCaXRTdHVmZmVyRQAAALQJAABYBgAAAAAAAOgGAAAFAAAABgAAAAcAAAAIAAAACQAAAE42TGVyY05TOUNudFpJbWFnZUUATjZMZXJjTlM2VEltYWdlSU5TXzRDbnRaRUVFAE42TGVyY05TNUltYWdlRQC0CQAAxAYAANwJAACoBgAA1AYAANwJAACUBgAA3AYAAAAAAADcBgAACgAAAAsAAAAMAAAACAAAAAkAAAAAAAAAMAcAAA0AAAAOAAAATjZMZXJjTlM1TGVyYzJFALQJAAAgBwAAAAAAAGAHAAAPAAAAEAAAAE42TGVyY05TMTFCaXRTdHVmZmVyMkUAALQJAABIBwAAAAAAAIwHAAARAAAAEgAAAE42TGVyY05TN0JpdE1hc2tFAAAAtAkAAHgHAABOMTBfX2N4eGFiaXYxMTZfX3NoaW1fdHlwZV9pbmZvRQAAAADcCQAAlAcAAFgLAABOMTBfX2N4eGFiaXYxMTdfX2NsYXNzX3R5cGVfaW5mb0UAAADcCQAAxAcAALgHAABOMTBfX2N4eGFiaXYxMTdfX3BiYXNlX3R5cGVfaW5mb0UAAADcCQAA9AcAALgHAABOMTBfX2N4eGFiaXYxMTlfX3BvaW50ZXJfdHlwZV9pbmZvRQDcCQAAJAgAABgIAABOMTBfX2N4eGFiaXYxMjBfX2Z1bmN0aW9uX3R5cGVfaW5mb0UAAAAA3AkAAFQIAAC4BwAATjEwX19jeHhhYml2MTI5X19wb2ludGVyX3RvX21lbWJlcl90eXBlX2luZm9FAAAA3AkAAIgIAAAYCAAAAAAAAAgJAAATAAAAFAAAABUAAAAWAAAAFwAAAE4xMF9fY3h4YWJpdjEyM19fZnVuZGFtZW50YWxfdHlwZV9pbmZvRQDcCQAA4AgAALgHAAB2AAAAzAgAABQJAABEbgAAzAgAACAJAABjAAAAzAgAACwJAABQS2MAOAoAADgJAAABAAAAMAkAAGgAAADMCAAATAkAAGEAAADMCAAAWAkAAHMAAADMCAAAZAkAAHQAAADMCAAAcAkAAGkAAADMCAAAfAkAAGoAAADMCAAAiAkAAGYAAADMCAAAlAkAAGQAAADMCAAAoAkAAAAAAADoBwAAEwAAABgAAAAVAAAAFgAAABkAAAAaAAAAGwAAABwAAAAAAAAAJAoAABMAAAAdAAAAFQAAABYAAAAZAAAAHgAAAB8AAAAgAAAATjEwX19jeHhhYml2MTIwX19zaV9jbGFzc190eXBlX2luZm9FAAAAANwJAAD8CQAA6AcAAAAAAABICAAAEwAAACEAAAAVAAAAFgAAACIAAAAAAAAAsAoAAAQAAAAjAAAAJAAAAAAAAADYCgAABAAAACUAAAAmAAAAAAAAAJgKAAAEAAAAJwAAACgAAABTdDlleGNlcHRpb24AAAAAtAkAAIgKAABTdDliYWRfYWxsb2MAAAAA3AkAAKAKAACYCgAAU3QyMGJhZF9hcnJheV9uZXdfbGVuZ3RoAAAAANwJAAC8CgAAsAoAAAAAAAAICwAAAwAAACkAAAAqAAAAU3QxMWxvZ2ljX2Vycm9yANwJAAD4CgAAmAoAAAAAAAA8CwAAAwAAACsAAAAqAAAAU3QxMmxlbmd0aF9lcnJvcgAAAADcCQAAKAsAAAgLAABTdDl0eXBlX2luZm8AAAAAtAkAAEgLAEHgFgsDYA1Q";
/*! Lerc 4.0
Copyright 2015 - 2023 Esri
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
A local copy of the license and additional notices are located with the
source distribution at:
http://github.com/Esri/lerc/
Contributors:  Thomas Maurer, Wenxue Ju
*/
var fg = (() => {
  var Q = import.meta.url;
  return function(g) {
    g = g || {};
    var g = typeof g < "u" ? g : {}, I, C;
    g.ready = new Promise(function(s, a) {
      I = s, C = a;
    });
    var E = Object.assign({}, g), i = typeof window == "object", D = typeof importScripts == "function", o = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string", R = "";
    function h(s) {
      return g.locateFile ? g.locateFile(s, R) : R + s;
    }
    var t, r, F, c, N, L;
    o ? (D ? R = require("path").dirname(R) + "/" : R = __dirname + "/", L = () => {
      N || (c = require("fs"), N = require("path"));
    }, t = function(a, U) {
      return L(), a = N.normalize(a), c.readFileSync(a, U ? void 0 : "utf8");
    }, F = (s) => {
      var a = t(s, !0);
      return a.buffer || (a = new Uint8Array(a)), a;
    }, r = (s, a, U) => {
      L(), s = N.normalize(s), c.readFile(s, function(x, B) {
        x ? U(x) : a(B.buffer);
      });
    }, process.argv.length > 1 && process.argv[1].replace(/\\/g, "/"), process.argv.slice(2), process.on("uncaughtException", function(s) {
      if (!(s instanceof _A))
        throw s;
    }), process.on("unhandledRejection", function(s) {
      throw s;
    }), g.inspect = function() {
      return "[Emscripten Module object]";
    }) : (i || D) && (D ? R = self.location.href : typeof document < "u" && document.currentScript && (R = document.currentScript.src), Q && (R = Q), R.indexOf("blob:") !== 0 ? R = R.substr(
      0,
      R.replace(/[?#].*/, "").lastIndexOf("/") + 1
    ) : R = "", t = (s) => {
      var a = new XMLHttpRequest();
      return a.open("GET", s, !1), a.send(null), a.responseText;
    }, D && (F = (s) => {
      var a = new XMLHttpRequest();
      return a.open("GET", s, !1), a.responseType = "arraybuffer", a.send(null), new Uint8Array(a.response);
    }), r = (s, a, U) => {
      var x = new XMLHttpRequest();
      x.open("GET", s, !0), x.responseType = "arraybuffer", x.onload = () => {
        if (x.status == 200 || x.status == 0 && x.response) {
          a(x.response);
          return;
        }
        U();
      }, x.onerror = U, x.send(null);
    }), g.print || console.log.bind(console);
    var n = g.printErr || console.warn.bind(console);
    Object.assign(g, E), E = null, g.arguments, g.thisProgram, g.quit;
    var y;
    g.wasmBinary && (y = g.wasmBinary), g.noExitRuntime, typeof WebAssembly != "object" && IA("no native wasm support detected");
    var M, k = !1, d = typeof TextDecoder < "u" ? new TextDecoder("utf8") : void 0;
    function q(s, a, U) {
      for (var x = a + U, B = a; s[B] && !(B >= x); ) ++B;
      if (B - a > 16 && s.buffer && d)
        return d.decode(s.subarray(a, B));
      for (var e = ""; a < B; ) {
        var w = s[a++];
        if (!(w & 128)) {
          e += String.fromCharCode(w);
          continue;
        }
        var S = s[a++] & 63;
        if ((w & 224) == 192) {
          e += String.fromCharCode((w & 31) << 6 | S);
          continue;
        }
        var O = s[a++] & 63;
        if ((w & 240) == 224 ? w = (w & 15) << 12 | S << 6 | O : w = (w & 7) << 18 | S << 12 | O << 6 | s[a++] & 63, w < 65536)
          e += String.fromCharCode(w);
        else {
          var b = w - 65536;
          e += String.fromCharCode(55296 | b >> 10, 56320 | b & 1023);
        }
      }
      return e;
    }
    function G(s, a) {
      return s ? q(l, s, a) : "";
    }
    var J, Y, l, K, f;
    function H(s) {
      J = s, g.HEAP8 = Y = new Int8Array(s), g.HEAP16 = new Int16Array(s), g.HEAP32 = K = new Int32Array(s), g.HEAPU8 = l = new Uint8Array(s), g.HEAPU16 = new Uint16Array(s), g.HEAPU32 = f = new Uint32Array(s), g.HEAPF32 = new Float32Array(s), g.HEAPF64 = new Float64Array(s);
    }
    g.INITIAL_MEMORY;
    var u, W = [], m = [], P = [];
    function V() {
      if (g.preRun)
        for (typeof g.preRun == "function" && (g.preRun = [g.preRun]); g.preRun.length; )
          v(g.preRun.shift());
      FA(W);
    }
    function CA() {
      FA(m);
    }
    function AA() {
      if (g.postRun)
        for (typeof g.postRun == "function" && (g.postRun = [g.postRun]); g.postRun.length; )
          sA(g.postRun.shift());
      FA(P);
    }
    function v(s) {
      W.unshift(s);
    }
    function EA(s) {
      m.unshift(s);
    }
    function sA(s) {
      P.unshift(s);
    }
    var z = 0, gA = null;
    function yA(s) {
      z++, g.monitorRunDependencies && g.monitorRunDependencies(z);
    }
    function _(s) {
      if (z--, g.monitorRunDependencies && g.monitorRunDependencies(z), z == 0 && gA) {
        var a = gA;
        gA = null, a();
      }
    }
    function IA(s) {
      g.onAbort && g.onAbort(s), s = "Aborted(" + s + ")", n(s), k = !0, s += ". Build with -sASSERTIONS for more info.";
      var a = new WebAssembly.RuntimeError(s);
      throw C(a), a;
    }
    var tA = "data:application/octet-stream;base64,";
    function RA(s) {
      return s.startsWith(tA);
    }
    function eA(s) {
      return s.startsWith("file://");
    }
    var T;
    g.locateFile ? (T = "lerc-wasm.wasm", RA(T) || (T = h(T))) : T = new URL("data:application/wasm;base64,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Tg0AA0AgCiACQQN0ai8BAEUNASACQQFqIgIgA0cNAAsgAyECDAELIAIhBSACIANODQEDQCAKIAVBA3RqLwEADQIgBUEBaiIFIANHDQALCyADIAJrIgUgCSAFIAlKIgUbIQkgAiAIIAUbIQgMAgsgBSACayILIAkgCSALSCILGyEJIAIgCCALGyEIIAMgBSICSg0ACwsgAyAJayAAIARrSARAIAYgCCAJajYCFCAGIAMgCGoiADYCECAGKAIUIQQLQQAhAiAAIARMDQAgACAEayIFQQFxIQkCQCAEQQFqIABGBEBBACEADAELIAVBfnEhBUEAIQADQCAAIAogBEEAIAMgAyAEShtrQQN0ai8BACIIIAAgCEobIgAgCiAEQQFqIghBACADIAMgCEoba0EDdGovAQAiCCAAIAhKGyEAIARBAmohBCACQQJqIgIgBUcNAAsLIAkEQCAAIAogBEEAIAMgAyAEShtrQQN0ai8BACICIAAgAkobIQALIABBIWsiAkFgTwRAIAYgADYCDAsgAkFfSyECCwJAIAIiCkUNACAHKAIIIQwgBygCBCENIAEgBigCDCILIAcoAhwiDiALIA5IGyIANgIAIAcgBygCEDYCFCAGQX82AhhBACEFQQAhCAJAQQEgAHQiAyAHKAIYIgAgBygCECICa0ECdU0EQAJAIAcoAhQiBSACa0ECdSIJIAMgAyAJSxsiBEUNACAEQQFrIQ8CQCAEQQNxIhBFBEAgAiEADAELIAIhAANAIAAgBi8BGDsBACAAIAYvARo7AQIgBEEBayEEIABBBGohACAIQQFqIgggEEcNAAsLIA9BA0kNAANAIAAgBi8BGDsBACAAIAYvARo7AQIgACAGLwEYOwEEIAAgBi8BGjsBBiAAIAYvARg7AQggACAGLwEaOwEKIAAgBi8BGDsBDCAAIAYvARo7AQ4gAEEQaiEAIARBBGsiBA0ACwsgAyAJSwRAIAUgAyAJa0ECdGohAANAIAUgBigBGDYBACAFQQRqIgUgAEcNAAsgByAANgIUDAILIAcgAiADQQJ0ajYCFAwBCyACBEAgByACNgIUIAIQBiAHQQA2AhggB0IANwIQQQAhAAsCQCADQYCAgIAETw0AIABBAXUiAiADIAIgA0sbQf////8DIABB/P///wdJGyIAQYCAgIAETw0AIAcgAEECdCIAEAki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QYCAgHxxakGAgIB8cXIiCDYCACADIAQgB2oiB0ECdGoiASAJIAEoAgAiAWpB////A3EgCCABQYCAgHxxakGAgIB8cXIiATYCACAEIAdqIQcgD0ECaiIPIBZHDQALCyAQRQ0AIAMgB0ECdGoiByABIAcoAgAiB2pB////A3EgASAHQYCAgHxxakGAgIB8cXI2AgALIANBBGohAyARQQFqIhEgBEcNAAsLIAVFDQIgBEEBayIBQX5xIRIgAUEBcSEJQQAhESAEQQJJIQgDQAJAIAgNACAAKAIAIQNBACEPQQEhASAEQQJHBEADQCAAIAFBAnRqIgogCigCACIHQYCAgHxxIANqQYCAgHxxIAMgB2oiB0H///8DcXIiAzYCACAKIAMgCigCBCIDQYCAgHxxakGAgIB8cSADIAdqQf///wNxciIDNgIEIAFBAmohASAPQQJqIg8gEkcNAAsLIAlFDQAgACABQQJ0aiIBIAEoAgAiAUGAgIB8cSADakGAgIB8cSABIANqQf///wNxcjYCAAsgACAEQQJ0aiEAIBFBAWoiESAFRw0ACwwCC0GTDEH/CEGaB0GUCBAAAAsgBARAIAVBAmshECAFQQFrIgFBfnEhCiABQQFxIRIgBUECSSEJIAAhAwNAAkAgCQ0AIARBAUcEQEEAIQcgBCEBIBAEQANAIAMgAUEDdGoiCCADIAEgBGtBA3RqKQMAIiMgCCkDACIkfCIlQv////////8HgyAjICRCgICAgICAgHiDfEKAgICAgICAeIOEIiM3AwAgAyABIARqIghBA3RqIgEgJSABKQMAIiR8Qv////////8HgyAjICRCgICAgICAgHiDfEKAgICAgICAeIOENwMAIAQgCGohASAHQQJqIgcgCkcNAAsLIBJFDQEgAyABQQN0aiIHIAMgASAEa0EDdGopAwAiIyAHKQMAIiR8Qv////////8HgyAjICRCgICAgICAgHiDfEKAgICAgICAeIOENwMADAELIAMpAwAhI0EAIQcgBCEBIBAEQANAIAMgAUEDdGoiCCAjIAgpAwAiJHwiJUL/////////B4MgIyAkQoCAgICAgIB4g3xCgICAgICAgHiDhCIjNwMAIAMgASAEaiIIQQN0aiIBICUgASkDACIkfEL/////////B4MgIyAkQoCAgICAgIB4g3xCgICAgICAgHiDhCIjNwMAIAQgCGohASAHQQJqIgcgCkcNAAsLIBJFDQAgAyABQQN0aiIBICMgASkDACIkfEL/////////B4MgIyAkQoCAgICAgIB4g3xCgICAgICAgHiDhDcDAAsgA0EIaiEDIA9BAWoiDyAERw0ACwsgBUUNACAEQQFrIgFBfnEhEiABQQFxIQlBACEPIARBAkkhCANAAkAgCA0AIAApAwAhI0EAIQdBASEDIARBAkcEQANAIAAgA0EDdGoiASABKQMAIiRCgICAgICAgHiDICN8QoCAgICAgIB4gyAjICR8IiVC/////////weDhCIjNwMAIAEgIyABKQMIIiRCgICAgICAgHiDfEKAgICAgICAeIMgJCAlfEL/////////B4OEIiM3AwggA0ECaiEDIAdBAmoiByASRw0ACwsgCUUNACAAIANBA3RqIgEgASkDACIkQoCAgICAgIB4gyAjfEKAgICAgICAeIMgIyAkfEL/////////B4OENwMACyAAIARBA3RqIQAgD0EBaiIPIAVHDQALCyAfQQVGBEAgBiAaEFALIBgEQCAYIAY2AgAMAQsgBhAGCyAGQQBHDAILQY4LQbwIQfIEQZQIEAAACwwECyEeDAELAn8gDEEMaiEVQQAhDiAAQQJJBEAgDCgCFCIKIAwoAhAiEmsiA0EDdSIPIB8QLEYEQEEBIABBAkZBAXQgAEEBRhshHgJAIA8gBCAFbCIYbBASIgFFDQAgGARAIA9BASAPQQFLGyIAQX5xIQkgAEEBcSEIIAwoAhAhFkEAIREgA0EQSSEHA0ACQCAKIBJGDQBBACEAQQAhECAHRQRAA0AgASAWIABBA3QiBmoiAygCACAOamogAygCBCARai0AADoAACABIBYgBkEIcmoiAygCACAOamogAygCBCARai0AADoAACAAQQJqIQAgEEECaiIQIAlHDQALCyAIRQ0AIAEgFiAAQQN0aiIAKAIAIA5qaiAAKAIEIBFqLQAAOgAACyAOIA9qIQ4gEUEBaiIRIBhHDQALCyABIQBBACERAkAgHkUNAAJAAkACQCAfQQVrDgIAAgELAkAgHkECRw0AIAVFDQAgBEEBcSEWIARBAmtBfnEhECAEQQNJIQogACEDA0ACQCAKDQAgAygCBCEOQQAhD0ECIQYgBEEDRwRAA0AgAyAGQQJ0IhJqIgcgBygCACIHQYCAgHxxIA5qQYCAgHxxIAcgDmoiCUH///8DcXIiCDYCACADIBJBBHJqIgcgBygCACIHQYCAgHxxIAhqQYCAgHxxIAcgCWpB////A3FyIg42AgAgBkECaiEGIA9BAmoiDyAQRw0ACwsgFkUNACADIAZBAnRqIgYgBigCACIGQYCAgHxxIA5qQYCAgHxxIAYgDmpB////A3FyNgIACyADIARBAnRqIQMgEUEBaiIRIAVHDQALCyAeQQBMDQIgBUUNAiAEQQFrIgNBfnEhCiADQQFxIRJBACERIARBAkkhCQNAAkAgCQ0AIAAoAgAhDkEAIQ9BASEGIARBAkcEQANAIAAgBkECdGoiECAQKAIAIgNBgICAfHEgDmpBgICAfHEgAyAOaiIIQf///wNxciIHNgIAIBAgByAQKAIEIgNBgICAfHFqQYCAgHxxIAMgCGpB////A3FyIg42AgQgBkECaiEGIA9BAmoiDyAKRw0ACwsgEkUNACAAIAZBAnRqIgMgAygCACIDQYCAgHxxIA5qQYCAgHxxIAMgDmpB////A3FyNgIACyAAIARBAnRqIQAgEUEBaiIRIAVHDQALDAILQZMMQf8IQYEGQasLEAAACwJAIB5BAkcNACAFRQ0AIARBAXEhCiAEQQJrQX5xIRIgBEEDSSEJIAAhBgNAAkAgCQ0AIAYpAwghI0EAIQNBAiEOIARBA0cEQANAIAYgDkEDdCIIaiIHIAcpAwAiJEKAgICAgICAeIMgI3xCgICAgICAgHiDICMgJHwiJUL/////////B4OEIiM3AwAgBiAIQQhyaiIHICMgBykDACIkQoCAgICAgIB4g3xCgICAgICAgHiDICQgJXxC/////////weDhCIjNwMAIA5BAmohDiADQQJqIgMgEkcNAAsLIApFDQAgBiAOQQN0aiIDIAMpAwAiJEKAgICAgICAeIMgI3xCgICAgICAgHiDICMgJHxC/////////weDhDcDAAsgBiAEQQN0aiEGIBFBAWoiESAFRw0ACwsgHkEATA0AIAVFDQAgBEEBayIDQX5xIQkgA0EBcSEIQQAhBiAEQQJJIQcDQAJAIAcNACAAKQMAISNBACEDQQEhDiAEQQJHBEADQCAAIA5BA3RqIhIgEikDACIkQoCAgICAgIB4gyAjfEKAgICAgICAeIMgIyAkfCIlQv////////8Hg4QiIzcDACASICMgEikDCCIkQoCAgICAgIB4g3xCgICAgICAgHiDICQgJXxC/////////weDhCIjNwMIIA5BAmohDiADQQJqIgMgCUcNAAsLIAhFDQAgACAOQQN0aiIDIAMpAwAiJEKAgICAgICAeIMgI3xCgICAgICAgHiDICMgJHxC/////////weDhDcDAAsgACAEQQN0aiEAIAZBAWoiBiAFRw0ACwsgH0EFRgRAIAEgGBBQCyAVBEAgFSABNgIADAELIAEQBgsgAUEARwwCCwsMAwshHgsgDCgCECIAIAtHBEBBACEDIAAhCwNAIAsgA0EDdGooAgQQBiADQQFqIgMgDCgCFCAMKAIQIgtrQQN1SQ0ACwsgDCALNgIUIAwoAgwiAARAIAIgACAaICBsEAgaIAAQBgsgHgshASAMKAIQIgAEQCAAEAYLIAxBIGokACABDwtBBBACIgBB0As2AgAgAEG8EkEAEAEAC9cBAQV/AkAgAUUNACABQQFHBEAgAUF+cSEFA0AgACADQQJ0IgZqIgIgAigCACICQQF2QYCAgPwHcSACQf///wNxciACQQh0QYCAgIB4cXI2AgAgACAGQQRyaiICIAIoAgAiAkEBdkGAgID8B3EgAkH///8DcXIgAkEIdEGAgICAeHFyNgIAIANBAmohAyAEQQJqIgQgBUcNAAsLIAFBAXFFDQAgACADQQJ0aiIAIAAoAgAiAEEBdkGAgID8B3EgAEH///8DcXIgAEEIdEGAgICAeHFyNgIACwsLACAAEFIaIAAQBgsxAQJ/IABB7BU2AgAgACgCBEEMayIBIAEoAghBAWsiAjYCCCACQQBIBEAgARAGCyAAC90BAQR/IABBADYCCCAAQgA3AgACQCABBEAgAUGAgICABE8NASAAIAFBAnQiBBAJIgM2AgAgACADIARqIgQ2AgggAUEBa0H/////A3EhBSACKAIAIQIgAUEHcSIGBEBBACEBA0AgAyACNgIAIANBBGohAyABQQFqIgEgBkcNAAsLIAVBB08EQANAIAMgAjYCHCADIAI2AhggAyACNgIUIAMgAjYCECADIAI2AgwgAyACNgIIIAMgAjYCBCADIAI2AgAgA0EgaiIDIARHDQALCyAAIAQ2AgQLIAAPCxAKAAuaAQAgAEEBOgA1AkAgACgCBCACRw0AIABBAToANAJAIAAoAhAiAkUEQCAAQQE2AiQgACADNgIYIAAgATYCECADQQFHDQIgACgCMEEBRg0BDAILIAEgAkYEQCAAKAIYIgJBAkYEQCAAIAM2AhggAyECCyAAKAIwQQFHDQIgAkEBRg0BDAILIAAgACgCJEEBajYCJAsgAEEBOgA2CwtLAQF/AkAgAUUNACABQbgREA8iAUUNACABKAIIIAAoAghBf3NxDQAgACgCDCABKAIMQQAQC0UNACAAKAIQIAEoAhBBABALIQILIAIL+gQBBH8jAEFAaiIGJAACQCABQaQSQQAQCwRAIAJBADYCAEEBIQQMAQsCQCAAIAEgAC0ACEEYcQR/QQEFIAFFDQEgAUGYEBAPIgNFDQEgAy0ACEEYcUEARwsQCyEFCyAFBEBBASEEIAIoAgAiAEUNASACIAAoAgA2AgAMAQsCQCABRQ0AIAFByBAQDyIFRQ0BIAIoAgAiAQRAIAIgASgCADYCAAsgBSgCCCIDIAAoAggiAUF/c3FBB3ENASADQX9zIAFxQeAAcQ0BQQEhBCAAKAIMIAUoAgxBABALDQEgACgCDEGYEkEAEAsEQCAFKAIMIgBFDQIgAEH8EBAPRSEEDAILIAAoAgwiA0UNAEEAIQQgA0HIEBAPIgEEQCAALQAIQQFxRQ0CAn8gBSgCDCEAQQAhAgJAA0BBACAARQ0CGiAAQcgQEA8iA0UNASADKAIIIAEoAghBf3NxDQFBASABKAIMIAMoAgxBABALDQIaIAEtAAhBAXFFDQEgASgCDCIARQ0BIABByBAQDyIBBEAgAygCDCEADAELCyAAQbgREA8iAEUNACAAIAMoAgwQVSECCyACCyEEDAILIANBuBEQDyIBBEAgAC0ACEEBcUUNAiABIAUoAgwQVSEEDAILIANB6A8QDyIBRQ0BIAUoAgwiAEUNASAAQegPEA8iA0UNASAGQQhqIgBBBHJBAEE0EAcaIAZBATYCOCAGQX82AhQgBiABNgIQIAYgAzYCCCADIAAgAigCAEEBIAMoAgAoAhwRBQACQCAGKAIgIgBBAUcNACACKAIARQ0AIAIgBigCGDYCAAsgAEEBRiEEDAELQQAhBAsgBkFAayQAIAQLMQAgACABKAIIQQAQCwRAIAEgAiADEC4PCyAAKAIIIgAgASACIAMgACgCACgCHBEFAAsYACAAIAEoAghBABALBEAgASACIAMQLgsLngEBAn8jAEFAaiIDJAACf0EBIAAgAUEAEAsNABpBACABRQ0AGkEAIAFB6A8QDyIBRQ0AGiADQQhqIgRBBHJBAEE0EAcaIANBATYCOCADQX82AhQgAyAANgIQIAMgATYCCCABIAQgAigCAEEBIAEoAgAoAhwRBQAgAygCICIAQQFGBEAgAiADKAIYNgIACyAAQQFGCyEAIANBQGskACAACwoAIAAgAUEAEAsLBQAQAwALdAEBf0ECIQwCQCAHQQBMDQAgBkEATA0AIAVBAEwNACAEQQBMDQAgCEEHSw0AIABFDQAgAUUNACAJRQ0AIAIgB0cgAkECT3ENAEEAIAJBAEogAxsNACAAIAEgAiADIAQgBSAGIAcgCCAJIAogCxA2IQwLIAwLdAEBf0ECIQoCQCAHQQBMDQAgBkEATA0AIAVBAEwNACAEQQBMDQAgCEEHSw0AIABFDQAgAUUNACAJRQ0AIAIgB0cgAkECT3ENAEEAIAJBAEogAxsNACAAIAEgAiADIAQgBSAGIAcgCCAJQQBBABA2IQoLIAoLUgECfyMAQUBqIgYkAEECIQcCQCADQQBMDQAgAkEATA0AIABFDQAgAUUNACAERQ0AIAVFDQAgACABIAYgBCAFIAIgA2wQFCEHCyAGQUBrJAAgBwvLBAECfyMAQUBqIgYkAEECIQcCQCAARQ0AIAFFDQAgAiADckUNACAEQQBMIAVBAExxDQAgACABIAZBAEEAQQAQFCIHDQACQCACRQ0AQQEhAAJAIARBAEwEQEEAIQAMAQsgAkEAIARBAnQQByAGKAIANgIACyAAIARIBEAgAiAAQQJ0aiAGKAIkNgIAIABBAWohAAsgACAESARAIAIgAEECdGogBigCBDYCACAAQQFqIQALIAAgBEgEQCACIABBAnRqIAYoAgg2AgAgAEEBaiEACyAAIARIBEAgAiAAQQJ0aiAGKAIMNgIAIABBAWohAAsgACAESARAIAIgAEECdGogBigCFDYCACAAQQFqIQALIAAgBEgEQCACIABBAnRqIAYoAhA2AgAgAEEBaiEACyAAIARIBEAgAiAAQQJ0aiAGKAIYNgIAIABBAWohAAsgACAESARAIAIgAEECdGogBigCHDYCACAAQQFqIQALIAAgBEgEQCACIABBAnRqIAYoAgQ2AgAgAEEBaiEACyAAIARODQAgAiAAQQJ0aiAGKAIgNgIACyADRQ0AQQAhAAJAIAVBAEwEQCAGKAIEQQFKIAYoAiBBAEpxIQEMAQtBASEAIANBACAFQQN0EAdEAAAAAAAA8L8gBisDKCAGKAIEQQFKIAYoAiBBAEpxIgEbOQMACyAAIAVIBEAgAyAAQQN0akQAAAAAAADwvyAGKwMwIAEbOQMAIABBAWohAAsgACAFTg0AIAMgAEEDdGogBisDODkDAAsgBkFAayQAIAcLEgAgAEHwDjYCACAAEBAgABAGC08BAX8gAEHADjYCACAAKAIcIgEEQCAAIAE2AiAgARAGCyAAKAIQIgEEQCAAIAE2AhQgARAGCyAAKAIEIgEEQCAAIAE2AgggARAGCyAAEAYLCAAgABAREAYLEAAgAEHwDjYCACAAEBAgAAsDAAALIQAgAEH8DTYCACAAKAIQEAYgAEIANwIIIABBADYCECAACxcAIAAoAhAQBiAAQgA3AgggAEEANgIQC6kBAQR/AkAgACABRg0AIAEoAggiA0EATA0AIAEoAgwiBEEATA0AIAAoAhAhAgJAAkAgACgCCCADRw0AIAAoAgwgBEcNACACDQELIAIQBiAAQgA3AgggACADIARsQQN0EBIiAjYCECACRQ0BIAAgBDYCDCAAIAM2AggLIAEoAhAiBUUNACACIAUgAyAEbEEDdBAIGiAAIAEoAgw2AgwgACABKQIENwIECyAACyYAIABBCjoACyAAQbMMKQAANwAAIABBuwwvAAA7AAggAEEAOgAKCzQBAX8gAEGADTYCACAAKAJIIgEEQCAAIAE2AkwgARAGCyAAQfwNNgIAIAAoAhAQBiAAEAYLQAEBfyAAQYANNgIAIAAoAkgiAQRAIAAgATYCTCABEAYLIABB/A02AgAgACgCEBAGIABCADcDCCAAQQA2AhAgAAslAQF/IABB0Aw2AgAgACgCBCIBBEAgACABNgIIIAEQBgsgABAGCyMBAX8gAEHQDDYCACAAKAIEIgEEQCAAIAE2AgggARAGCyAACwcAIAAoAgQLBQBB7AoLBQBB4QsLBQBBzwoLFQAgAEUEQEEADwsgAEHIEBAPQQBHCxoAIAAgASgCCCAFEAsEQCABIAIgAyAEEFQLCzcAIAAgASgCCCAFEAsEQCABIAIgAyAEEFQPCyAAKAIIIgAgASACIAMgBCAFIAAoAgAoAhQRCgALpwEAIAAgASgCCCAEEAsEQAJAIAEoAgQgAkcNACABKAIcQQFGDQAgASADNgIcCw8LAkAgACABKAIAIAQQC0UNAAJAIAIgASgCEEcEQCABKAIUIAJHDQELIANBAUcNASABQQE2AiAPCyABIAI2AhQgASADNgIgIAEgASgCKEEBajYCKAJAIAEoAiRBAUcNACABKAIYQQJHDQAgAUEBOgA2CyABQQQ2AiwLC4gCACAAIAEoAgggBBALBEACQCABKAIEIAJHDQAgASgCHEEBRg0AIAEgAzYCHAsPCwJAIAAgASgCACAEEAsEQAJAIAIgASgCEEcEQCABKAIUIAJHDQELIANBAUcNAiABQQE2AiAPCyABIAM2AiACQCABKAIsQQRGDQAgAUEAOwE0IAAoAggiACABIAIgAkEBIAQgACgCACgCFBEKACABLQA1BEAgAUEDNgIsIAEtADRFDQEMAwsgAUEENgIsCyABIAI2AhQgASABKAIoQQFqNgIoIAEoAiRBAUcNASABKAIYQQJHDQEgAUEBOgA2DwsgACgCCCIAIAEgAiADIAQgACgCACgCGBELAAsLC+4OAgBBgQgL3Q4BAQIBAgIDAQICAwIDAwRyZXQAcmVzdG9yZUNyb3NzQnl0ZXMAdmVjdG9yAGV4dHJhY3RfYnVmZmVyAC9ob21lL2pvaG4vRG9jdW1lbnRzL0NvZGUvbGVyYy1tYXN0ZXIvc3JjL0xlcmNMaWIvZnBsX0xlcmMyRXh0LmNwcAAvaG9tZS9qb2huL0RvY3VtZW50cy9Db2RlL2xlcmMtbWFzdGVyL3NyYy9MZXJjTGliL2ZwbF9Vbml0VHlwZXMuY3BwAC9ob21lL2pvaG4vRG9jdW1lbnRzL0NvZGUvbGVyYy1tYXN0ZXIvc3JjL0xlcmNMaWIvZnBsX0NvbXByZXNzaW9uLmNwcAAvaG9tZS9qb2huL0RvY3VtZW50cy9Db2RlL2xlcmMtbWFzdGVyL3NyYy9MZXJjTGliL2ZwbF9Fc3JpSHVmZm1hbi5jcHAAc3RkOjpleGNlcHRpb24ARGVjb2RlSHVmZm1hbgBiYWRfYXJyYXlfbmV3X2xlbmd0aABiYXNpY19zdHJpbmcAaW5wdXRfaW5fYnl0ZXMgPT0gYmxvY2tfc2l6ZQByZXN0b3JlQmxvY2tTZXF1ZW5jZQByZXN0b3JlU2VxdWVuY2UAQXNzZXJ0aW9uIGZhaWxlZABzdGQ6OmJhZF9hbGxvYwBwcEJ5dGVbMF0gPT0gSFVGRk1BTl9OT1JNQUwAc2l6ZSA+IDAAUHVyZSB2aXJ0dWFsIGZ1bmN0aW9uIGNhbGxlZCEAQ250WkltYWdlIABMZXJjMiAAAAAAAAAAAHAGAAABAAAAAgAAAE42TGVyY05TMTBCaXRTdHVmZmVyRQAAALQJAABYBgAAAAAAAOgGAAAFAAAABgAAAAcAAAAIAAAACQAAAE42TGVyY05TOUNudFpJbWFnZUUATjZMZXJjTlM2VEltYWdlSU5TXzRDbnRaRUVFAE42TGVyY05TNUltYWdlRQC0CQAAxAYAANwJAACoBgAA1AYAANwJAACUBgAA3AYAAAAAAADcBgAACgAAAAsAAAAMAAAACAAAAAkAAAAAAAAAMAcAAA0AAAAOAAAATjZMZXJjTlM1TGVyYzJFALQJAAAgBwAAAAAAAGAHAAAPAAAAEAAAAE42TGVyY05TMTFCaXRTdHVmZmVyMkUAALQJAABIBwAAAAAAAIwHAAARAAAAEgAAAE42TGVyY05TN0JpdE1hc2tFAAAAtAkAAHgHAABOMTBfX2N4eGFiaXYxMTZfX3NoaW1fdHlwZV9pbmZvRQAAAADcCQAAlAcAAFgLAABOMTBfX2N4eGFiaXYxMTdfX2NsYXNzX3R5cGVfaW5mb0UAAADcCQAAxAcAALgHAABOMTBfX2N4eGFiaXYxMTdfX3BiYXNlX3R5cGVfaW5mb0UAAADcCQAA9AcAALgHAABOMTBfX2N4eGFiaXYxMTlfX3BvaW50ZXJfdHlwZV9pbmZvRQDcCQAAJAgAABgIAABOMTBfX2N4eGFiaXYxMjBfX2Z1bmN0aW9uX3R5cGVfaW5mb0UAAAAA3AkAAFQIAAC4BwAATjEwX19jeHhhYml2MTI5X19wb2ludGVyX3RvX21lbWJlcl90eXBlX2luZm9FAAAA3AkAAIgIAAAYCAAAAAAAAAgJAAATAAAAFAAAABUAAAAWAAAAFwAAAE4xMF9fY3h4YWJpdjEyM19fZnVuZGFtZW50YWxfdHlwZV9pbmZvRQDcCQAA4AgAALgHAAB2AAAAzAgAABQJAABEbgAAzAgAACAJAABjAAAAzAgAACwJAABQS2MAOAoAADgJAAABAAAAMAkAAGgAAADMCAAATAkAAGEAAADMCAAAWAkAAHMAAADMCAAAZAkAAHQAAADMCAAAcAkAAGkAAADMCAAAfAkAAGoAAADMCAAAiAkAAGYAAADMCAAAlAkAAGQAAADMCAAAoAkAAAAAAADoBwAAEwAAABgAAAAVAAAAFgAAABkAAAAaAAAAGwAAABwAAAAAAAAAJAoAABMAAAAdAAAAFQAAABYAAAAZAAAAHgAAAB8AAAAgAAAATjEwX19jeHhhYml2MTIwX19zaV9jbGFzc190eXBlX2luZm9FAAAAANwJAAD8CQAA6AcAAAAAAABICAAAEwAAACEAAAAVAAAAFgAAACIAAAAAAAAAsAoAAAQAAAAjAAAAJAAAAAAAAADYCgAABAAAACUAAAAmAAAAAAAAAJgKAAAEAAAAJwAAACgAAABTdDlleGNlcHRpb24AAAAAtAkAAIgKAABTdDliYWRfYWxsb2MAAAAA3AkAAKAKAACYCgAAU3QyMGJhZF9hcnJheV9uZXdfbGVuZ3RoAAAAANwJAAC8CgAAsAoAAAAAAAAICwAAAwAAACkAAAAqAAAAU3QxMWxvZ2ljX2Vycm9yANwJAAD4CgAAmAoAAAAAAAA8CwAAAwAAACsAAAAqAAAAU3QxMmxlbmd0aF9lcnJvcgAAAADcCQAAKAsAAAgLAABTdDl0eXBlX2luZm8AAAAAtAkAAEgLAEHgFgsDYA1Q", import.meta.url).toString();
    function qA(s) {
      try {
        if (s == T && y)
          return new Uint8Array(y);
        if (F)
          return F(s);
        throw "both async and sync fetching of the wasm failed";
      } catch (a) {
        IA(a);
      }
    }
    function YA() {
      if (!y && (i || D)) {
        if (typeof fetch == "function" && !eA(T))
          return fetch(T, { credentials: "same-origin" }).then(function(s) {
            if (!s.ok)
              throw "failed to load wasm binary file at '" + T + "'";
            return s.arrayBuffer();
          }).catch(function() {
            return qA(T);
          });
        if (r)
          return new Promise(function(s, a) {
            r(
              T,
              function(U) {
                s(new Uint8Array(U));
              },
              a
            );
          });
      }
      return Promise.resolve().then(function() {
        return qA(T);
      });
    }
    function HA() {
      var s = { a: GA };
      function a(w, S) {
        var O = w.exports;
        g.asm = O, M = g.asm.g, H(M.buffer), u = g.asm.m, EA(g.asm.h), _();
      }
      yA();
      function U(w) {
        a(w.instance);
      }
      function x(w) {
        return YA().then(function(S) {
          return WebAssembly.instantiate(S, s);
        }).then(function(S) {
          return S;
        }).then(w, function(S) {
          n("failed to asynchronously prepare wasm: " + S), IA(S);
        });
      }
      function B() {
        return !y && typeof WebAssembly.instantiateStreaming == "function" && !RA(T) && !eA(T) && !o && typeof fetch == "function" ? fetch(T, { credentials: "same-origin" }).then(function(w) {
          var S = WebAssembly.instantiateStreaming(w, s);
          return S.then(U, function(O) {
            return n("wasm streaming compile failed: " + O), n("falling back to ArrayBuffer instantiation"), x(U);
          });
        }) : x(U);
      }
      if (g.instantiateWasm)
        try {
          var e = g.instantiateWasm(s, a);
          return e;
        } catch (w) {
          return n("Module.instantiateWasm callback failed with error: " + w), !1;
        }
      return B().catch(C), {};
    }
    function FA(s) {
      for (; s.length > 0; ) {
        var a = s.shift();
        if (typeof a == "function") {
          a(g);
          continue;
        }
        var U = a.func;
        typeof U == "number" ? a.arg === void 0 ? lA(U)() : lA(U)(a.arg) : U(a.arg === void 0 ? null : a.arg);
      }
    }
    var rA = [];
    function lA(s) {
      var a = rA[s];
      return a || (s >= rA.length && (rA.length = s + 1), rA[s] = a = u.get(s)), a;
    }
    function fA(s, a, U, x) {
      IA(
        "Assertion failed: " + G(s) + ", at: " + [
          a ? G(a) : "unknown filename",
          U,
          x ? G(x) : "unknown function"
        ]
      );
    }
    function nA(s) {
      return SA(s + 24) + 24;
    }
    function NA(s) {
      this.excPtr = s, this.ptr = s - 24, this.set_type = function(a) {
        f[this.ptr + 4 >> 2] = a;
      }, this.get_type = function() {
        return f[this.ptr + 4 >> 2];
      }, this.set_destructor = function(a) {
        f[this.ptr + 8 >> 2] = a;
      }, this.get_destructor = function() {
        return f[this.ptr + 8 >> 2];
      }, this.set_refcount = function(a) {
        K[this.ptr >> 2] = a;
      }, this.set_caught = function(a) {
        a = a ? 1 : 0, Y[this.ptr + 12 >> 0] = a;
      }, this.get_caught = function() {
        return Y[this.ptr + 12 >> 0] != 0;
      }, this.set_rethrown = function(a) {
        a = a ? 1 : 0, Y[this.ptr + 13 >> 0] = a;
      }, this.get_rethrown = function() {
        return Y[this.ptr + 13 >> 0] != 0;
      }, this.init = function(a, U) {
        this.set_adjusted_ptr(0), this.set_type(a), this.set_destructor(U), this.set_refcount(0), this.set_caught(!1), this.set_rethrown(!1);
      }, this.add_ref = function() {
        var a = K[this.ptr >> 2];
        K[this.ptr >> 2] = a + 1;
      }, this.release_ref = function() {
        var a = K[this.ptr >> 2];
        return K[this.ptr >> 2] = a - 1, a === 1;
      }, this.set_adjusted_ptr = function(a) {
        f[this.ptr + 16 >> 2] = a;
      }, this.get_adjusted_ptr = function() {
        return f[this.ptr + 16 >> 2];
      }, this.get_exception_ptr = function() {
        var a = pA(this.get_type());
        if (a)
          return f[this.excPtr >> 2];
        var U = this.get_adjusted_ptr();
        return U !== 0 ? U : this.excPtr;
      };
    }
    function VA(s, a, U) {
      var x = new NA(s);
      throw x.init(a, U), s;
    }
    function vA() {
      IA("");
    }
    function uA(s, a, U) {
      l.copyWithin(s, a, a + U);
    }
    function zA() {
      return 2147483648;
    }
    function xA(s) {
      try {
        return M.grow(s - J.byteLength + 65535 >>> 16), H(M.buffer), 1;
      } catch {
      }
    }
    function OA(s) {
      var a = l.length;
      s = s >>> 0;
      var U = zA();
      if (s > U)
        return !1;
      let x = (O, b) => O + (b - O % b) % b;
      for (var B = 1; B <= 4; B *= 2) {
        var e = a * (1 + 0.2 / B);
        e = Math.min(e, s + 100663296);
        var w = Math.min(
          U,
          x(Math.max(s, e), 65536)
        ), S = xA(w);
        if (S)
          return !0;
      }
      return !1;
    }
    var GA = {
      a: fA,
      c: nA,
      b: VA,
      d: vA,
      f: uA,
      e: OA
    };
    HA(), g.___wasm_call_ctors = function() {
      return (g.___wasm_call_ctors = g.asm.h).apply(null, arguments);
    }, g._lerc_getBlobInfo = function() {
      return (g._lerc_getBlobInfo = g.asm.i).apply(null, arguments);
    }, g._lerc_getDataRanges = function() {
      return (g._lerc_getDataRanges = g.asm.j).apply(null, arguments);
    }, g._lerc_decode = function() {
      return (g._lerc_decode = g.asm.k).apply(null, arguments);
    }, g._lerc_decode_4D = function() {
      return (g._lerc_decode_4D = g.asm.l).apply(null, arguments);
    };
    var SA = g._malloc = function() {
      return (SA = g._malloc = g.asm.n).apply(null, arguments);
    };
    g._free = function() {
      return (g._free = g.asm.o).apply(null, arguments);
    };
    var pA = g.___cxa_is_pointer_type = function() {
      return (pA = g.___cxa_is_pointer_type = g.asm.p).apply(
        null,
        arguments
      );
    }, wA;
    function _A(s) {
      this.name = "ExitStatus", this.message = "Program terminated with exit(" + s + ")", this.status = s;
    }
    gA = function s() {
      wA || MA(), wA || (gA = s);
    };
    function MA(s) {
      if (z > 0 || (V(), z > 0))
        return;
      function a() {
        wA || (wA = !0, g.calledRun = !0, !k && (CA(), I(g), g.onRuntimeInitialized && g.onRuntimeInitialized(), AA()));
      }
      g.setStatus ? (g.setStatus("Running..."), setTimeout(function() {
        setTimeout(function() {
          g.setStatus("");
        }, 1), a();
      }, 1)) : a();
    }
    if (g.run = MA, g.preInit)
      for (typeof g.preInit == "function" && (g.preInit = [g.preInit]); g.preInit.length > 0; )
        g.preInit.pop()();
    return MA(), g.ready;
  };
})();
const OI = [
  {
    pixelType: "S8",
    size: 1,
    ctor: Int8Array,
    range: [-128, 128]
  },
  {
    pixelType: "U8",
    size: 1,
    ctor: Uint8Array,
    range: [0, 255]
  },
  {
    pixelType: "S16",
    size: 2,
    ctor: Int16Array,
    range: [-32768, 32767]
  },
  {
    pixelType: "U16",
    size: 2,
    ctor: Uint16Array,
    range: [0, 65536]
  },
  {
    pixelType: "S32",
    size: 4,
    ctor: Int32Array,
    range: [-2147483648, 2147483647]
  },
  {
    pixelType: "U32",
    size: 4,
    ctor: Uint32Array,
    range: [0, 4294967296]
  },
  {
    pixelType: "F32",
    size: 4,
    ctor: Float32Array,
    range: [-34027999387901484e22, 34027999387901484e22]
  },
  {
    pixelType: "F64",
    size: 8,
    ctor: Float64Array,
    range: [-17976931348623157e292, 17976931348623157e292]
  }
];
let PA = null, pI = !1;
function ug(Q = {}) {
  if (PA)
    return PA;
  const A = Q.locateFile || ((g, I) => `${I}${g}`);
  return PA = fg({ locateFile: A }).then(
    (g) => g.ready.then(() => {
      Og(g), pI = !0;
    })
  ), PA;
}
function eI() {
  return pI;
}
const jA = {
  getBlobInfo: null,
  decode: null
};
function xg(Q) {
  return (Q >> 3 << 3) + 16;
}
function aA(Q, A, g) {
  g.set(Q.slice(A, A + g.length));
}
function Og(Q) {
  const { _malloc: A, _free: g, _lerc_getBlobInfo: I, _lerc_getDataRanges: C, _lerc_decode_4D: E, asm: i } = Q;
  let D;
  const o = Object.values(i).find(
    (h) => h && "buffer" in h && h.buffer === Q.HEAPU8.buffer
  ), R = (h) => {
    const t = h.map((N) => xg(N)), r = t.reduce((N, L) => N + L), F = A(r);
    D = new Uint8Array(o.buffer);
    let c = t[0];
    t[0] = F;
    for (let N = 1; N < t.length; N++) {
      const L = t[N];
      t[N] = t[N - 1] + c, c = L;
    }
    return t;
  };
  jA.getBlobInfo = (h) => {
    const F = new Uint8Array(48), c = new Uint8Array(3 * 8), [N, L, n] = R([
      h.length,
      F.length,
      c.length
    ]);
    D.set(h, N), D.set(F, L), D.set(c, n);
    let y = I(N, h.length, L, n, 12, 3);
    if (y)
      throw g(N), `lerc-getBlobInfo: error code is ${y}`;
    D = new Uint8Array(o.buffer), aA(D, L, F), aA(D, n, c);
    const M = new Uint32Array(F.buffer), k = new Float64Array(c.buffer), [
      d,
      q,
      G,
      J,
      Y,
      l,
      K,
      f,
      H,
      u,
      W
    ] = M, m = {
      version: d,
      dimCount: G,
      width: J,
      height: Y,
      validPixelCount: K,
      bandCount: l,
      blobSize: f,
      maskCount: H,
      depthCount: u,
      dataType: q,
      minValue: k[0],
      maxValue: k[1],
      maxZerror: k[2],
      statistics: [],
      bandCountWithNoData: W
    };
    if (W)
      return g(N), m;
    if (u === 1 && l === 1)
      return g(N), m.statistics.push({
        minValue: k[0],
        maxValue: k[1]
      }), m;
    const P = u * l * 8, V = new Uint8Array(P), CA = new Uint8Array(P);
    let AA = N, v = 0, EA = 0, sA = !1;
    if (D.byteLength < N + P * 2 ? (g(N), sA = !0, [AA, v, EA] = R([h.length, P, P]), D.set(h, AA)) : [v, EA] = R([P, P]), D.set(V, v), D.set(CA, EA), y = C(AA, h.length, u, l, v, EA), y)
      throw g(AA), sA || g(v), `lerc-getDataRanges: error code is ${y}`;
    D = new Uint8Array(o.buffer), aA(D, v, V), aA(D, EA, CA);
    const z = new Float64Array(V.buffer), gA = new Float64Array(CA.buffer), yA = m.statistics;
    for (let _ = 0; _ < l; _++)
      if (u > 1) {
        const IA = z.slice(_ * u, (_ + 1) * u), tA = gA.slice(_ * u, (_ + 1) * u), RA = Math.min.apply(null, IA), eA = Math.max.apply(null, tA);
        yA.push({
          minValue: RA,
          maxValue: eA,
          dimStats: { minValues: IA, maxValues: tA },
          depthStats: { minValues: IA, maxValues: tA }
        });
      } else
        yA.push({
          minValue: z[_],
          maxValue: gA[_]
        });
    return g(AA), sA || g(v), m;
  }, jA.decode = (h, t) => {
    const { maskCount: r, depthCount: F, bandCount: c, width: N, height: L, dataType: n, bandCountWithNoData: y } = t, M = OI[n], k = N * L, d = new Uint8Array(k * c), q = k * F * c * M.size, G = new Uint8Array(q), J = new Uint8Array(c), Y = new Uint8Array(c * 8), [l, K, f, H, u] = R([
      h.length,
      d.length,
      G.length,
      J.length,
      Y.length
    ]);
    D.set(h, l), D.set(d, K), D.set(G, f), D.set(J, H), D.set(Y, u);
    const W = E(
      l,
      h.length,
      r,
      K,
      F,
      N,
      L,
      c,
      n,
      f,
      H,
      u
    );
    if (W)
      throw g(l), `lerc-decode: error code is ${W}`;
    D = new Uint8Array(o.buffer), aA(D, f, G), aA(D, K, d);
    let m = null;
    if (y) {
      aA(D, H, J), aA(D, u, Y), m = [];
      const P = new Float64Array(Y.buffer);
      for (let V = 0; V < J.length; V++)
        m.push(J[V] ? P[V] : null);
    }
    return g(l), {
      data: G,
      maskData: d,
      noDataValues: m
    };
  };
}
function pg(Q, A, g, I, C) {
  if (g < 2)
    return Q;
  const E = new I(A * g);
  for (let i = 0, D = 0; i < A; i++)
    for (let o = 0, R = i; o < g; o++, R += A)
      E[R] = Q[D++];
  return E;
}
function mg(Q, A = {}) {
  var g, I;
  const C = (g = A.inputOffset) !== null && g !== void 0 ? g : 0, E = Q instanceof Uint8Array ? Q.subarray(C) : new Uint8Array(Q, C), i = jA.getBlobInfo(E), { data: D, maskData: o } = jA.decode(E, i), { width: R, height: h, bandCount: t, dimCount: r, depthCount: F, dataType: c, maskCount: N, statistics: L } = i, n = OI[c], y = new n.ctor(D.buffer), M = [], k = [], d = R * h, q = d * F, G = (I = A.returnInterleaved) !== null && I !== void 0 ? I : A.returnPixelInterleavedDims;
  for (let H = 0; H < t; H++) {
    const u = y.subarray(H * q, (H + 1) * q);
    if (G)
      M.push(u);
    else {
      const W = pg(u, d, F, n.ctor);
      M.push(W);
    }
    k.push(o.subarray(H * q, (H + 1) * q));
  }
  const J = N === 0 ? null : N === 1 ? k[0] : new Uint8Array(d);
  if (N > 1) {
    J.set(k[0]);
    for (let H = 1; H < k.length; H++) {
      const u = k[H];
      for (let W = 0; W < d; W++)
        J[W] = J[W] & u[W];
    }
  }
  const { noDataValue: Y } = A, l = Y != null && n.range[0] <= Y && n.range[1] >= Y;
  if (N > 0 && l)
    for (let H = 0; H < t; H++) {
      const u = M[H], W = k[H] || J;
      for (let m = 0; m < d; m++)
        W[m] === 0 && (u[m] = Y);
    }
  const K = N === t && t > 1 ? k : null, { pixelType: f } = n;
  return {
    width: R,
    height: h,
    pixelType: f,
    statistics: L,
    pixels: M,
    mask: J,
    dimCount: r,
    depthCount: F,
    bandMasks: K
  };
}
const Wg = {
  0: 7e3,
  1: 6e3,
  2: 5e3,
  3: 4e3,
  4: 3e3,
  5: 2500,
  6: 2e3,
  7: 1500,
  8: 800,
  9: 500,
  10: 200,
  11: 100,
  12: 40,
  13: 12,
  14: 5,
  15: 2,
  16: 1,
  17: 0.5,
  18: 0.2,
  19: 0.1,
  20: 0.05
};
function Tg(Q, A, g) {
  let I = Q;
  g[2] - g[0] < 1 && (I = Pg(Q, g));
  const { array: C, width: E } = I, D = new Jg(E).createTile(C), o = Wg[A] / 1e3 || 0;
  return D.getGeometryData(o);
}
function Pg(Q, A) {
  function g(D, o, R, h, t, r, F, c) {
    const N = new Float32Array(t * r);
    for (let n = 0; n < r; n++)
      for (let y = 0; y < t; y++) {
        const M = (n + h) * o + (y + R), k = n * t + y;
        N[k] = D[M];
      }
    const L = new Float32Array(c * F);
    for (let n = 0; n < c; n++)
      for (let y = 0; y < F; y++) {
        const M = n * c + y, k = Math.round(y * r / c), q = Math.round(n * t / F) * t + k;
        L[M] = N[q];
      }
    return L;
  }
  const I = bg(A, Q.width), C = I.sw + 1, E = I.sh + 1;
  return { array: g(
    Q.array,
    Q.width,
    I.sx,
    I.sy,
    I.sw,
    I.sh,
    C,
    E
  ), width: C, height: E };
}
function bg(Q, A) {
  const g = Math.floor(Q[0] * A), I = Math.floor(Q[1] * A), C = Math.floor((Q[2] - Q[0]) * A), E = Math.floor((Q[3] - Q[1]) * A);
  return { sx: g, sy: I, sw: C, sh: E };
}
const mI = "KGZ1bmN0aW9uKCl7InVzZSBzdHJpY3QiO2Z1bmN0aW9uIEQoaSxvKXtjb25zdCBuPW5ldyBGbG9hdDMyQXJyYXkoaS5sZW5ndGgpO2ZvcihsZXQgdD0wO3Q8by5sZW5ndGg7dCs9Myl7Y29uc3QgYz1vW3RdKjMsZT1vW3QrMV0qMyxhPW9bdCsyXSozLHM9aVtjXSxoPWlbYysxXSxnPWlbYysyXSxsPWlbZV0sZD1pW2UrMV0seD1pW2UrMl0sdz1pW2FdLGY9aVthKzFdLEk9aVthKzJdLHA9bC1zLG09ZC1oLHI9eC1nLHU9dy1zLE09Zi1oLHk9SS1nLHo9bSp5LXIqTSxUPXIqdS1wKnksRT1wKk0tbSp1LFM9TWF0aC5zcXJ0KHoqeitUKlQrRSpFKSxiPVswLDAsMV07aWYoUz4wKXtjb25zdCBBPTEvUztiWzBdPXoqQSxiWzFdPVQqQSxiWzJdPUUqQX1mb3IobGV0IEE9MDtBPDM7QSsrKW5bYytBXT1uW2UrQV09blthK0FdPWJbQV19cmV0dXJuIG59Y2xhc3MgJHtncmlkU2l6ZTtudW1UcmlhbmdsZXM7bnVtUGFyZW50VHJpYW5nbGVzO2luZGljZXM7Y29vcmRzO2NvbnN0cnVjdG9yKG89MjU3KXt0aGlzLmdyaWRTaXplPW87Y29uc3Qgbj1vLTE7aWYobiZuLTEpdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBncmlkIHNpemUgdG8gYmUgMl5uKzEsIGdvdCAke299LmApO3RoaXMubnVtVHJpYW5nbGVzPW4qbioyLTIsdGhpcy5udW1QYXJlbnRUcmlhbmdsZXM9dGhpcy5udW1UcmlhbmdsZXMtbipuLHRoaXMuaW5kaWNlcz1uZXcgVWludDMyQXJyYXkodGhpcy5ncmlkU2l6ZSp0aGlzLmdyaWRTaXplKSx0aGlzLmNvb3Jkcz1uZXcgVWludDE2QXJyYXkodGhpcy5udW1UcmlhbmdsZXMqNCk7Zm9yKGxldCB0PTA7dDx0aGlzLm51bVRyaWFuZ2xlczt0Kyspe2xldCBjPXQrMixlPTAsYT0wLHM9MCxoPTAsZz0wLGw9MDtmb3IoYyYxP3M9aD1nPW46ZT1hPWw9bjsoYz4+PTEpPjE7KXtjb25zdCB4PWUrcz4+MSx3PWEraD4+MTtjJjE/KHM9ZSxoPWEsZT1nLGE9bCk6KGU9cyxhPWgscz1nLGg9bCksZz14LGw9d31jb25zdCBkPXQqNDt0aGlzLmNvb3Jkc1tkKzBdPWUsdGhpcy5jb29yZHNbZCsxXT1hLHRoaXMuY29vcmRzW2QrMl09cyx0aGlzLmNvb3Jkc1tkKzNdPWh9fWNyZWF0ZVRpbGUobyl7cmV0dXJuIG5ldyBDKG8sdGhpcyl9fWNsYXNzIEN7bWFydGluaTt0ZXJyYWluO2Vycm9ycztjb25zdHJ1Y3RvcihvLG4pe2NvbnN0IHQ9bi5ncmlkU2l6ZTtpZihvLmxlbmd0aCE9PXQqdCl0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIHRlcnJhaW4gZGF0YSBvZiBsZW5ndGggJHt0KnR9ICgke3R9IHggJHt0fSksIGdvdCAke28ubGVuZ3RofS5gKTt0aGlzLnRlcnJhaW49byx0aGlzLm1hcnRpbmk9bix0aGlzLmVycm9ycz1uZXcgRmxvYXQzMkFycmF5KG8ubGVuZ3RoKSx0aGlzLnVwZGF0ZSgpfXVwZGF0ZSgpe2NvbnN0e251bVRyaWFuZ2xlczpvLG51bVBhcmVudFRyaWFuZ2xlczpuLGNvb3Jkczp0LGdyaWRTaXplOmN9PXRoaXMubWFydGluaSx7dGVycmFpbjplLGVycm9yczphfT10aGlzO2ZvcihsZXQgcz1vLTE7cz49MDtzLS0pe2NvbnN0IGg9cyo0LGc9dFtoKzBdLGw9dFtoKzFdLGQ9dFtoKzJdLHg9dFtoKzNdLHc9ZytkPj4xLGY9bCt4Pj4xLEk9dytmLWwscD1mK2ctdyxtPShlW2wqYytnXStlW3gqYytkXSkvMixyPWYqYyt3LHU9TWF0aC5hYnMobS1lW3JdKTtpZihhW3JdPU1hdGgubWF4KGFbcl0sdSksczxuKXtjb25zdCBNPShsK3A+PjEpKmMrKGcrST4+MSkseT0oeCtwPj4xKSpjKyhkK0k+PjEpO2Fbcl09TWF0aC5tYXgoYVtyXSxhW01dLGFbeV0pfX19Z2V0R2VvbWV0cnlEYXRhKG89MCl7Y29uc3R7Z3JpZFNpemU6bixpbmRpY2VzOnR9PXRoaXMubWFydGluaSx7ZXJyb3JzOmN9PXRoaXM7bGV0IGU9MCxhPTA7Y29uc3Qgcz1uLTE7bGV0IGgsZyxsPTA7dC5maWxsKDApO2Z1bmN0aW9uIGQocix1LE0seSx6LFQpe2NvbnN0IEU9citNPj4xLFM9dSt5Pj4xO01hdGguYWJzKHIteikrTWF0aC5hYnModS1UKT4xJiZjW1MqbitFXT5vPyhkKHosVCxyLHUsRSxTKSxkKE0seSx6LFQsRSxTKSk6KGg9dSpuK3IsZz15Km4rTSxsPVQqbit6LHRbaF09PT0wJiYodFtoXT0rK2UpLHRbZ109PT0wJiYodFtnXT0rK2UpLHRbbF09PT0wJiYodFtsXT0rK2UpLGErKyl9ZCgwLDAscyxzLHMsMCksZChzLHMsMCwwLDAscyk7Y29uc3QgeD1lKjIsdz1hKjMsZj1uZXcgVWludDE2QXJyYXkoeCksST1uZXcgVWludDMyQXJyYXkodyk7bGV0IHA9MDtmdW5jdGlvbiBtKHIsdSxNLHkseixUKXtjb25zdCBFPXIrTT4+MSxTPXUreT4+MTtpZihNYXRoLmFicyhyLXopK01hdGguYWJzKHUtVCk+MSYmY1tTKm4rRV0+byltKHosVCxyLHUsRSxTKSxtKE0seSx6LFQsRSxTKTtlbHNle2NvbnN0IGI9dFt1Km4rcl0tMSxBPXRbeSpuK01dLTEsRj10W1Qqbit6XS0xO2ZbMipiXT1yLGZbMipiKzFdPXUsZlsyKkFdPU0sZlsyKkErMV09eSxmWzIqRl09eixmWzIqRisxXT1ULElbcCsrXT1iLElbcCsrXT1BLElbcCsrXT1GfX1yZXR1cm4gbSgwLDAscyxzLHMsMCksbShzLHMsMCwwLDAscykse2F0dHJpYnV0ZXM6dGhpcy5fZ2V0TWVzaEF0dHJpYnV0ZXModGhpcy50ZXJyYWluLGYsSSksaW5kaWNlczpJfX1fZ2V0TWVzaEF0dHJpYnV0ZXMobyxuLHQpe2NvbnN0IGM9TWF0aC5mbG9vcihNYXRoLnNxcnQoby5sZW5ndGgpKSxlPWMtMSxhPW4ubGVuZ3RoLzIscz1uZXcgRmxvYXQzMkFycmF5KGEqMyksaD1uZXcgRmxvYXQzMkFycmF5KGEqMik7Zm9yKGxldCBsPTA7bDxhO2wrKyl7Y29uc3QgZD1uW2wqMl0seD1uW2wqMisxXSx3PXgqYytkO3NbMypsKzBdPWQvZS0uNSxzWzMqbCsxXT0uNS14L2Usc1szKmwrMl09b1t3XSxoWzIqbCswXT1kL2UsaFsyKmwrMV09MS14L2V9Y29uc3QgZz1EKHMsdCk7cmV0dXJue3Bvc2l0aW9uOnt2YWx1ZTpzLHNpemU6M30sdGV4Y29vcmQ6e3ZhbHVlOmgsc2l6ZToyfSxub3JtYWw6e3ZhbHVlOmcsc2l6ZTozfX19fWNvbnN0IFU9ezA6N2UzLDE6NmUzLDI6NWUzLDM6NGUzLDQ6M2UzLDU6MjUwMCw2OjJlMyw3OjE1MDAsODo4MDAsOTo1MDAsMTA6MjAwLDExOjEwMCwxMjo0MCwxMzoxMiwxNDo1LDE1OjIsMTY6MSwxNzouNSwxODouMiwxOTouMSwyMDouMDV9O2Z1bmN0aW9uIHYoaSxvLG4pe2xldCB0PWk7blsyXS1uWzBdPDEmJih0PVAoaSxuKSk7Y29uc3R7YXJyYXk6Yyx3aWR0aDplfT10LHM9bmV3ICQoZSkuY3JlYXRlVGlsZShjKSxoPVVbb10vMWUzfHwwO3JldHVybiBzLmdldEdlb21ldHJ5RGF0YShoKX1mdW5jdGlvbiBQKGksbyl7ZnVuY3Rpb24gbihzLGgsZyxsLGQseCx3LGYpe2NvbnN0IEk9bmV3IEZsb2F0MzJBcnJheShkKngpO2ZvcihsZXQgbT0wO208eDttKyspZm9yKGxldCByPTA7cjxkO3IrKyl7Y29uc3QgdT0obStsKSpoKyhyK2cpLE09bSpkK3I7SVtNXT1zW3VdfWNvbnN0IHA9bmV3IEZsb2F0MzJBcnJheShmKncpO2ZvcihsZXQgbT0wO208ZjttKyspZm9yKGxldCByPTA7cjx3O3IrKyl7Y29uc3QgdT1tKmYrcixNPU1hdGgucm91bmQocip4L2YpLHo9TWF0aC5yb3VuZChtKmQvdykqZCtNO3BbdV09SVt6XX1yZXR1cm4gcH1jb25zdCB0PVYobyxpLndpZHRoKSxjPXQuc3crMSxlPXQuc2grMTtyZXR1cm57YXJyYXk6bihpLmFycmF5LGkud2lkdGgsdC5zeCx0LnN5LHQuc3csdC5zaCxjLGUpLHdpZHRoOmMsaGVpZ2h0OmV9fWZ1bmN0aW9uIFYoaSxvKXtjb25zdCBuPU1hdGguZmxvb3IoaVswXSpvKSx0PU1hdGguZmxvb3IoaVsxXSpvKSxjPU1hdGguZmxvb3IoKGlbMl0taVswXSkqbyksZT1NYXRoLmZsb29yKChpWzNdLWlbMV0pKm8pO3JldHVybntzeDpuLHN5OnQsc3c6YyxzaDplfX1zZWxmLm9ubWVzc2FnZT1pPT57Y29uc3Qgbz1pLmRhdGEsbj12KG8uZGVtRGF0YSxvLnosby5jbGlwQm91bmRzKTtzZWxmLnBvc3RNZXNzYWdlKG4pfX0pKCk7Cg==", Zg = (Q) => Uint8Array.from(atob(Q), (A) => A.charCodeAt(0)), NI = typeof self < "u" && self.Blob && new Blob([Zg(mI)], { type: "text/javascript;charset=utf-8" });
function Xg(Q) {
  let A;
  try {
    if (A = NI && (self.URL || self.webkitURL).createObjectURL(NI), !A) throw "";
    const g = new Worker(A, {
      name: Q?.name
    });
    return g.addEventListener("error", () => {
      (self.URL || self.webkitURL).revokeObjectURL(A);
    }), g;
  } catch {
    return new Worker(
      "data:text/javascript;base64," + mI,
      {
        name: Q?.name
      }
    );
  } finally {
    A && (self.URL || self.webkitURL).revokeObjectURL(A);
  }
}
const jg = 10;
class Vg extends fI {
  info = {
    version: "0.10.0",
    description: "Tile LERC terrain loader. It can load ArcGis-lerc format terrain data."
  };
  dataType = "lerc";
  // 图像加载器
  fileLoader = new Cg(X.manager);
  _workerPool = new xI(0);
  constructor() {
    super(), this.fileLoader.setResponseType("arraybuffer"), this._workerPool.setWorkerCreator(() => new Xg()), ug({ locateFile: () => lg });
  }
  /**
   * 解码给定缓冲区中的Lerc数据
   *
   * @param buffer Lerc编码数据的ArrayBuffer
   * @returns 解码后的高度图数据、宽度和高度的对象
   */
  async decode(A) {
    await vg(eI()), console.assert(eI());
    const { height: g, width: I, pixels: C } = mg(A), E = new Float32Array(g * I);
    for (let i = 0; i < E.length; i++)
      E[i] = C[0][i] / 1e3;
    return { array: E, width: I, height: g };
  }
  /**
   * 异步加载并解析数据，返回BufferGeometry对象
   *
   * @param url 数据文件的URL
   * @param params 解析参数，包含瓦片xyz和裁剪边界clipBounds
   * @returns 返回解析后的BufferGeometry对象
   */
  async doLoad(A, g) {
    const I = await this.fileLoader.loadAsync(A), C = await this.decode(I), { z: E, bounds: i } = g;
    let D;
    return this.useWorker ? (this._workerPool.pool === 0 && this._workerPool.setWorkerLimit(jg), D = (await this._workerPool.postMessage({ demData: C, z: E, clipBounds: i }, [
      C.array.buffer
    ])).data) : D = Tg(C, E, i), new DI().setData(D);
  }
}
function vg(Q, A = 100) {
  return new Promise((g) => {
    const I = setInterval(() => {
      Q && (clearInterval(I), g());
    }, A);
  });
}
_I(new Vg());
function zg(Q) {
  return _g(Q.data);
}
function _g(Q) {
  function A(C, E) {
    const i = E * 4, [D, o, R, h] = C.slice(i, i + 4);
    return h === 0 ? 0 : (D << 16 | o << 8 | R) / 1e4 - 10;
  }
  const g = Q.length >>> 2, I = new Float32Array(g);
  for (let C = 0; C < g; C++)
    I[C] = A(Q, C);
  return I;
}
const WI = "KGZ1bmN0aW9uKCl7InVzZSBzdHJpY3QiO2Z1bmN0aW9uIGModCl7cmV0dXJuIGEodC5kYXRhKX1mdW5jdGlvbiBhKHQpe2Z1bmN0aW9uIG4oZSx1KXtjb25zdCByPXUqNCxbaSxmLGcsbF09ZS5zbGljZShyLHIrNCk7cmV0dXJuIGw9PT0wPzA6KGk8PDE2fGY8PDh8ZykvMWU0LTEwfWNvbnN0IG89dC5sZW5ndGg+Pj4yLHM9bmV3IEZsb2F0MzJBcnJheShvKTtmb3IobGV0IGU9MDtlPG87ZSsrKXNbZV09bih0LGUpO3JldHVybiBzfXNlbGYub25tZXNzYWdlPXQ9Pntjb25zdCBuPWModC5kYXRhLmltZ0RhdGEpO3NlbGYucG9zdE1lc3NhZ2Uobil9fSkoKTsK", $g = (Q) => Uint8Array.from(atob(Q), (A) => A.charCodeAt(0)), wI = typeof self < "u" && self.Blob && new Blob([$g(WI)], { type: "text/javascript;charset=utf-8" });
function AQ(Q) {
  let A;
  try {
    if (A = wI && (self.URL || self.webkitURL).createObjectURL(wI), !A) throw "";
    const g = new Worker(A, {
      name: Q?.name
    });
    return g.addEventListener("error", () => {
      (self.URL || self.webkitURL).revokeObjectURL(A);
    }), g;
  } catch {
    return new Worker(
      "data:text/javascript;base64," + WI,
      {
        name: Q?.name
      }
    );
  } finally {
    A && (self.URL || self.webkitURL).revokeObjectURL(A);
  }
}
const IQ = 10;
class gQ extends fI {
  info = {
    version: "0.10.0",
    description: "Mapbox-RGB terrain loader, It can load Mapbox-RGB terrain data."
  };
  // 数据类型标识
  dataType = "terrain-rgb";
  // 使用imageLoader下载
  imageLoader = new QI(X.manager);
  _workerPool = new xI(0);
  constructor() {
    super(), this._workerPool.setWorkerCreator(() => new AQ());
  }
  // 下载数据
  /**
   * 异步加载BufferGeometry对象
   *
   * @param url 图片的URL地址
   * @param params 加载参数，包含瓦片xyz和裁剪边界clipBounds
   * @returns 返回解析后的BufferGeometry对象
   */
  async doLoad(A, g) {
    const I = await this.imageLoader.loadAsync(A), C = CI.clamp((g.z + 2) * 3, 2, 64), E = QQ(I, g.bounds, C);
    let i;
    this.useWorker ? (this._workerPool.pool === 0 && this._workerPool.setWorkerLimit(IQ), i = (await this._workerPool.postMessage({ imgData: E }, [E.data.buffer])).data) : i = zg(E);
    const D = new DI();
    return D.setData(i), D;
  }
}
function QQ(Q, A, g) {
  const I = BI(A, Q.width);
  g = Math.min(g, I.sw);
  const E = new OffscreenCanvas(g, g).getContext("2d");
  return E.imageSmoothingEnabled = !1, E.drawImage(Q, I.sx, I.sy, I.sw, I.sh, 0, 0, g, g), E.getImageData(0, 0, g, g);
}
_I(new gQ());
const CQ = `{\r
	"name": "three-tile",\r
	"version": "0.10.0",\r
	"type": "module",\r
	"files": [\r
		"dist"\r
	],\r
	"main": "dist/three-tile.umd.cjs",\r
	"module": "dist/three-tile.js",\r
	"types": "./dist/three-tile.es.d.ts",\r
	"exports": {\r
		".": {\r
			"import": "./dist/three-tile.js",\r
			"require": "./dist/three-tile.umd.cjs",\r
			"types": "./dist/three-tile.es.d.ts"\r
		}\r
	},\r
	"description": "A lightweight tile map using threejs",\r
	"license": "GPL-3.0",\r
	"author": {\r
		"name": "GuoJF",\r
		"email": "hz_gjf@163.com"\r
	},\r
	"keywords": [\r
		"three",\r
		"gis",\r
		"tile",\r
		"map",\r
		"3D",\r
		"cesium"\r
	],\r
	"scripts": {\r
		"dev": "vite build --watch",\r
		"build": "tsc && vite build"\r
	},\r
	"publishConfig": {\r
		"registry": "https://registry.npmjs.org/",\r
		"access": "public"\r
	},\r
	"repository": {\r
		"type": "git",\r
		"url": "git+https://github.com/sxguojf/three-tile.git"\r
	},\r
	"bugs": {\r
		"url": "https://github.com/sxguojf/three-tile/issues"\r
	},\r
	"homepage": "https://github.com/sxguojf/three-tile#readme"\r
}\r
`;
var JA = /* @__PURE__ */ ((Q) => (Q[Q.none = 0] = "none", Q[Q.create = 1] = "create", Q[Q.remove = 2] = "remove", Q))(JA || {});
const yI = 1.02;
function EQ(Q, A) {
  const g = Q.position.clone().setZ(Q.maxZ).applyMatrix4(Q.matrixWorld);
  return A.distanceTo(g);
}
function BQ(Q) {
  const A = Q.scale, g = new p(-A.x, -A.y, 0).applyMatrix4(Q.matrixWorld), I = new p(A.x, A.y, 0).applyMatrix4(Q.matrixWorld);
  return g.sub(I).length();
}
function iQ(Q) {
  return Q.distToCamera / Q.sizeInWorld * 0.8;
}
function DQ(Q, A, g, I) {
  const C = iQ(Q);
  if (Q.isLeaf) {
    if (Q.inFrustum && Q.z < g && (Q.z < A || Q.showing) && // Create child tilee until parent tile has showed
    (Q.z < A || C < I / yI))
      return 1;
  } else if (Q.z >= A && (Q.z > g || C > I * yI))
    return 2;
  return 0;
}
function oQ(Q, A, g, I) {
  const C = [], E = I + 1, i = A * 2, D = 0, o = 0.25, R = Q.imgSource[0].projectionID === "4326";
  if (I === 0 && R) {
    const h = g, t = new p(0.5, 1, 1), r = new Z(i, h, E), F = new Z(i, h, E);
    r.position.set(-0.25, 0, D), r.scale.copy(t), F.position.set(o, 0, D), F.scale.copy(t), C.push(r, F);
  } else {
    const h = g * 2, t = new p(0.5, 0.5, 1), r = new Z(i, h, E), F = new Z(i + 1, h, E), c = new Z(i, h + 1, E), N = new Z(i + 1, h + 1, E);
    r.position.set(-0.25, o, D), r.scale.copy(t), F.position.set(o, o, D), F.scale.copy(t), c.position.set(-0.25, -0.25, D), c.scale.copy(t), N.position.set(o, -0.25, D), N.scale.copy(t), C.push(r, F, c, N);
  }
  return C;
}
const sQ = 10, tQ = new Eg(), aQ = new p(), hQ = new Bg(), RQ = new ig(new p(-0.5, -0.5, 0), new p(0.5, 0.5, 9)), FI = new Dg();
class Z extends EI {
  static _downloadThreads = 0;
  /**
   * Number of download threads.
   */
  static get downloadThreads() {
    return Z._downloadThreads;
  }
  /** Coordinate of tile */
  x;
  y;
  z;
  /** Is a tile? */
  isTile = !0;
  /** Tile parent */
  parent = null;
  /** Children of tile */
  children = [];
  _ready = !1;
  /** return this.minLevel < map.minLevel, True mean do not needs load tile data */
  _isDummy = !1;
  get isDummy() {
    return this._isDummy;
  }
  _showing = !1;
  /**
   * Gets the showing state of the tile.
   */
  get showing() {
    return this._showing;
  }
  /**
   * Sets the showing state of the tile.
   * @param value - The new showing state.
   */
  set showing(A) {
    this._showing = A, this.material.forEach((g) => g.visible = A);
  }
  /** Max height of tile */
  _maxZ = 0;
  /**
   * Gets the maximum height of the tile.
   */
  get maxZ() {
    return this._maxZ;
  }
  /**
   * Sets the maximum height of the tile.
   * @param value - The new maximum height.
   */
  set maxZ(A) {
    this._maxZ = A;
  }
  /** Distance to camera */
  distToCamera = 0;
  /* Tile size in world */
  sizeInWorld = 0;
  /**
   * Gets the index of the tile in its parent's children array.
   * @returns The index of the tile.
   */
  get index() {
    return this.parent ? this.parent.children.indexOf(this) : -1;
  }
  _loaded = !1;
  /**
   * Gets the load state of the tile.
   */
  get loaded() {
    return this._loaded;
  }
  _inFrustum = !1;
  /** Is tile in frustum ?*/
  get inFrustum() {
    return this._inFrustum;
  }
  /**
   * Sets whether the tile is in the frustum.
   * @param value - The new frustum state.
   */
  set inFrustum(A) {
    this._inFrustum = A;
  }
  /** Tile is a leaf ?  */
  get isLeaf() {
    return this.children.filter((A) => A.isTile).length === 0;
  }
  /**
   * Constructor for the Tile class.
   * @param x - Tile X-coordinate, default: 0.
   * @param y - Tile Y-coordinate, default: 0.
   * @param z - Tile level, default: 0.
   */
  constructor(A = 0, g = 0, I = 0) {
    super(tQ, []), this.x = A, this.y = g, this.z = I, this.name = `Tile ${I}-${A}-${g}`, this.up.set(0, 0, 1), this.matrixAutoUpdate = !1;
  }
  /**
   * Override Object3D.traverse, change the callback param type to "this".
   * @param callback - The callback function.
   */
  traverse(A) {
    A(this), this.children.forEach((g) => {
      g.isTile && g.traverse(A);
    });
  }
  /**
   * Override Object3D.traverseVisible, change the callback param type to "this".
   * @param callback - The callback function.
   */
  traverseVisible(A) {
    this.visible && (A(this), this.children.forEach((g) => {
      g.isTile && g.traverseVisible(A);
    }));
  }
  /**
   * Override Object3D.raycast, only test the tile has loaded.
   * @param raycaster - The raycaster.
   * @param intersects - The array of intersections.
   */
  raycast(A, g) {
    this.showing && this.loaded && this.isTile && super.raycast(A, g);
  }
  /**
   * LOD (Level of Detail).
   * @param loader - The tile loader.
   * @param minLevel - The minimum level.
   * @param maxLevel - The maximum level.
   * @param threshold - The threshold.
   * @returns this
   */
  LOD(A) {
    if (Z.downloadThreads > sQ)
      return { action: JA.none };
    let g = [];
    const { loader: I, minLevel: C, maxLevel: E, LODThreshold: i } = A, D = DQ(this, C, E, i);
    return D === JA.create && (g = oQ(I, this.x, this.y, this.z), this.add(...g)), { action: D, newTiles: g };
  }
  /**
   * Checks the visibility of the tile.
   */
  // private _checkChildrenVisible() {
  // 	const children = this.children.filter((child) => child.isTile);
  // 	const allLoaded = children.every((child) => child.loaded);
  // 	this.showing = !allLoaded;
  // 	children.forEach((child) => (child.showing = allLoaded));
  // 	return this;
  // }
  /**
   * Checks the visibility of the tile.
   */
  _checkVisible() {
    const A = this.parent;
    if (A && A.isTile) {
      const g = A.children.filter((C) => C.isTile), I = g.every((C) => C.loaded);
      A.showing = !I, g.forEach((C) => C.showing = I);
    }
    return this;
  }
  /**
   * Asynchronously load tile data
   *
   * @param loader Tile loader
   * @returns this
   */
  async _load(A) {
    Z._downloadThreads++;
    const { x: g, y: I, z: C } = this, E = await A.load({
      x: g,
      y: I,
      z: C,
      bounds: [-1 / 0, -1 / 0, 1 / 0, 1 / 0]
    });
    return this.material = E.materials, this.geometry = E.geometry, this.maxZ = this.geometry.boundingBox?.max.z || 0, this._loaded = !0, Z._downloadThreads--, this;
  }
  /** New tile init */
  _init() {
    this.updateMatrix(), this.updateMatrixWorld(), this.sizeInWorld = BQ(this);
  }
  /**
   * Updates the tile.
   * @param params - The update parameters.
   * @returns this
   */
  update(A) {
    if (console.assert(this.z === 0), !this.parent)
      return this;
    FI.setFromProjectionMatrix(
      hQ.multiplyMatrices(A.camera.projectionMatrix, A.camera.matrixWorldInverse)
    );
    const g = A.camera.getWorldPosition(aQ);
    return this.traverse((I) => {
      I.receiveShadow = this.receiveShadow, I.castShadow = this.castShadow;
      const C = RQ.clone().applyMatrix4(I.matrixWorld);
      I.inFrustum = FI.intersectsBox(C), I.distToCamera = EQ(I, g);
      const { action: E, newTiles: i } = I.LOD(A);
      this._doAction(I, E, i, A);
    }), this._checkReady(), this;
  }
  _doAction(A, g, I, C) {
    const E = this;
    return g === JA.create ? I?.forEach((i) => {
      i._init(), i._isDummy = i.z < C.minLevel, E.dispatchEvent({ type: "tile-created", tile: i }), i.isDummy || i._load(C.loader).then(() => {
        i._checkVisible(), E.dispatchEvent({ type: "tile-loaded", tile: i });
      });
    }) : g === JA.remove && (A.showing = !0, A._unLoad(!1, C.loader), E.dispatchEvent({ type: "tile-unload", tile: A })), this;
  }
  /**
   * Reloads the tile data.
   * @returns this
   */
  reload(A) {
    return this._unLoad(!0, A), this;
  }
  /**
   * Checks if the tile is ready to render.
   * @returns this
   */
  _checkReady() {
    return this._ready || (this._ready = !0, this.traverse((A) => {
      if (A.isLeaf && A.loaded && !A.isDummy) {
        this._ready = !1;
        return;
      }
    }), this._ready && this.dispatchEvent({ type: "ready" })), this;
  }
  /**
   * UnLoads the tile data.
   * @param unLoadSelf - Whether to unload tile itself.
   * @returns this.
   */
  _unLoad(A, g) {
    return A && this.isTile && !this.isDummy && (this.dispatchEvent({ type: "unload" }), g?.unload?.(this)), this.children.forEach((I) => I._unLoad(!0, g)), this.clear(), this;
  }
}
class TI {
  /** Data type that determines which loader to use for loading and processing data. Default is "image" type */
  dataType = "image";
  /** Copyright attribution information for the data source, used for displaying map copyright notices */
  attribution = "ThreeTile";
  /** Minimum zoom level supported by the data source. Default is 0 */
  minLevel = 0;
  /** Maximum zoom level supported by the data source. Default is 18 */
  maxLevel = 18;
  /** Data projection type. Default is "3857" Mercator projection */
  projectionID = "3857";
  /** URL template for tile data. Uses variables like {x},{y},{z} to construct tile request URLs */
  url = "";
  /** List of URL subdomains for load balancing. Can be an array of strings or a single string */
  subdomains = [];
  /** Currently used subdomain. Randomly selected from subdomains when requesting tiles */
  s = "";
  /** Layer opacity. Range 0-1, default is 1.0 (completely opaque) */
  opacity = 1;
  /** Whether to use TMS tile coordinate system. Default false uses XYZ system, true uses TMS system */
  isTMS = !1;
  /** Data bounds in format [minLon, minLat, maxLon, maxLat]. Default covers global range excluding polar regions */
  bounds = [-180, -85, 180, 85];
  /** Projected data bounds */
  _projectionBounds = [-1 / 0, -1 / 0, 1 / 0, 1 / 0];
  /** User-defined data. Can store any key-value pairs */
  userData = {
    name: "TileSource"
  };
  /**
   * constructor
   * @param options SourceOptions
   */
  constructor(A) {
    Object.assign(this, A);
  }
  /**
   * Get url from tile coordinate, public, overwrite to custom generation tile url from xyz
   * @param x tile x coordinate
   * @param y tile y coordinate
   * @param z tile z coordinate
   * @returns url tile url
   */
  getUrl(A, g, I) {
    const C = { ...this, x: A, y: g, z: I };
    return eQ(this.url, C);
  }
  /**
   * Get url from tile coordinate, public，called by TileLoader
   * @param x tile x coordinate
   * @param y tile y coordinate
   * @param z tile z coordinate
   * @returns url tile url
   */
  _getUrl(A, g, I) {
    const C = this.subdomains.length;
    if (C > 0) {
      const i = Math.floor(Math.random() * C);
      this.s = this.subdomains[i];
    }
    const E = this.isTMS ? Math.pow(2, I) - 1 - g : g;
    return this.getUrl(A, E, I);
  }
  /**
   * Create source directly through factoy functions.
   * @param options source options
   * @returns ISource data source instance
   */
  static create(A) {
    return new TI(A);
  }
}
function eQ(Q, A) {
  const g = /\{ *([\w_-]+) *\}/g;
  return Q.replace(g, (I, C) => {
    const E = A[C] ?? (() => {
      throw new Error(`source url template error, No value provided for variable: ${I}`);
    })();
    return typeof E == "function" ? E(A) : E;
  });
}
class PI {
  _lon0 = 0;
  /** 中央经线 */
  get lon0() {
    return this._lon0;
  }
  /**
   * 构造函数
   * @param centerLon 中央经线
   */
  constructor(A = 0) {
    this._lon0 = A;
  }
  /**
   * 根据中央经线取得变换后的瓦片X坐标
   * @param x
   * @param z
   * @returns
   */
  getTileXWithCenterLon(A, g) {
    const I = Math.pow(2, g);
    let C = A + Math.round(I / 360 * this._lon0);
    return C >= I ? C -= I : C < 0 && (C += I), C;
  }
  /**
   * 取得瓦片左下角投影坐标
   * @param x
   * @param y
   * @param z
   * @returns
   */
  getTileXYZproj(A, g, I) {
    const C = this.mapWidth, E = this.mapHeight / 2, i = A / Math.pow(2, I) * C - C / 2, D = E - g / Math.pow(2, I) * E * 2;
    return { x: i, y: D };
  }
  /**
   * 取得经纬度范围的投影坐标
   * @param bounds 经纬度边界
   * @returns 投影坐标
   */
  getProjBoundsFromLonLat(A) {
    const g = A[0] === -180 && A[2] === 180, I = this.project(A[0] + (g ? this._lon0 : 0), A[1]), C = this.project(A[2] + (g ? this._lon0 : 0), A[3]);
    return [Math.min(I.x, C.x), Math.min(I.y, C.y), Math.max(I.x, C.x), Math.max(I.y, C.y)];
  }
  /**
  	 * 取得瓦片边界投影坐标范围
  
  	 * @param x 瓦片X坐标
  	 * @param y 瓦片Y坐标
  	 * @param z  瓦片层级
  	 * @returns 
  	 */
  getProjBoundsFromXYZ(A, g, I) {
    const C = this.getTileXYZproj(A, g, I), E = this.getTileXYZproj(A + 1, g + 1, I);
    return [Math.min(C.x, E.x), Math.min(C.y, E.y), Math.max(C.x, E.x), Math.max(C.y, E.y)];
  }
  getLonLatBoundsFromXYZ(A, g, I) {
    const C = this.getProjBoundsFromXYZ(A, g, I), E = this.unProject(C[0], C[1]), i = this.unProject(C[2], C[3]);
    return [E.lon, E.lat, i.lon, i.lat];
  }
}
const UA = 6378;
class bI extends PI {
  ID = "3857";
  // projeciton ID
  mapWidth = 2 * Math.PI * UA;
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
  project(A, g) {
    const I = (A - this.lon0) * (Math.PI / 180), C = g * (Math.PI / 180), E = UA * I, i = UA * Math.log(Math.tan(Math.PI / 4 + C / 2));
    return { x: E, y: i };
  }
  /**
   * Projected coordinates to latitude and longitude
   * @param x projection x
   * @param y projection y
   * @returns latitude and longitude
   */
  unProject(A, g) {
    let I = A / UA * (180 / Math.PI) + this.lon0;
    return I > 180 && (I -= 360), { lat: (2 * Math.atan(Math.exp(g / UA)) - Math.PI / 2) * (180 / Math.PI), lon: I };
  }
}
class NQ extends PI {
  ID = "4326";
  mapWidth = 36e3;
  //E-W scacle (*0.01°)
  mapHeight = 18e3;
  //S-N scale (*0.01°)
  mapDepth = 1;
  //height scale
  project(A, g) {
    return { x: (A - this.lon0) * 100, y: g * 100 };
  }
  unProject(A, g) {
    return { lon: A / 100 + this.lon0, lat: g / 100 };
  }
}
const rI = {
  /**
   * create projection object from projection ID
   *
   * @param id projeciton ID, default: "3857"
   * @returns IProjection instance
   */
  createFromID: (Q = "3857", A) => {
    let g;
    switch (Q) {
      case "3857":
        g = new bI(A);
        break;
      case "4326":
        g = new NQ(A);
        break;
      default:
        throw new Error(`Projection ID: ${Q} is not supported.`);
    }
    return g;
  }
};
class wQ extends qI {
  _projection;
  attcth(A, g) {
    Object.assign(this, A), this._projection = g;
    const I = A.imgSource, C = A.demSource;
    I.forEach((E) => {
      E._projectionBounds = g.getProjBoundsFromLonLat(E.bounds);
    }), C && (C._projectionBounds = g.getProjBoundsFromLonLat(C.bounds));
  }
  async load(A) {
    if (!this._projection)
      throw new Error("projection is undefined");
    const { x: g, y: I, z: C } = A, E = this._projection.getTileXWithCenterLon(g, C), i = this._projection.getProjBoundsFromXYZ(g, I, C), D = this._projection.getLonLatBoundsFromXYZ(g, I, C);
    return super.load({ x: E, y: I, z: C, bounds: i, lonLatBounds: D });
  }
}
function ZI(Q, A) {
  const g = A.intersectObjects([Q.rootTile]);
  for (const I of g)
    if (I.object instanceof Z) {
      const C = Q.worldToLocal(I.point.clone()), E = Q.map2geo(C);
      return Object.assign(I, {
        location: E
      });
    }
}
function cI(Q, A) {
  const g = new p(0, -1, 0), I = new p(A.x, 10, A.z), C = new dI(I, g);
  return ZI(Q, C);
}
function yQ(Q, A, g) {
  const I = new dI();
  return I.setFromCamera(g, Q), ZI(A, I);
}
function FQ(Q) {
  const A = Q.loader.manager, g = (I, C) => {
    Q.dispatchEvent({ type: I, ...C });
  };
  A.onStart = (I, C, E) => {
    g("loading-start", { url: I, itemsLoaded: C, itemsTotal: E });
  }, A.onError = (I) => {
    g("loading-error", { url: I });
  }, A.onLoad = () => {
    g("loading-complete");
  }, A.onProgress = (I, C, E) => {
    g("loading-progress", { url: I, itemsLoaded: C, itemsTotal: E });
  }, A.onParseEnd = (I) => {
    g("parsing-end", { url: I });
  }, Q.rootTile.addEventListener("ready", () => g("ready")), Q.rootTile.addEventListener("tile-created", (I) => {
    g("tile-created", { tile: I.tile });
  }), Q.rootTile.addEventListener("tile-loaded", (I) => {
    g("tile-loaded", { tile: I.tile });
  }), Q.rootTile.addEventListener("tile-unload", (I) => {
    g("tile-unload", { tile: I.tile });
  });
}
function rQ(Q, A = 128) {
  const g = document.createElement("canvas"), I = g.getContext("2d");
  if (!I)
    throw new Error("Failed to get canvas context");
  g.width = A, g.height = A;
  const C = A / 2, E = A / 2;
  return I.imageSmoothingEnabled = !1, I.fillStyle = "#000022", I.strokeStyle = "DarkGoldenrod", I.lineWidth = 5, I.moveTo(C, 3), I.lineTo(C, A), I.stroke(), I.closePath(), I.lineWidth = 2, I.beginPath(), I.roundRect(2, 2, A - 4, E - 8, 10), I.closePath(), I.fill(), I.stroke(), I.font = "24px Arial", I.fillStyle = "Goldenrod", I.strokeStyle = "black", I.textAlign = "center", I.textBaseline = "top", I.strokeText(Q, C, 20), I.fillText(Q, C, 20), g;
}
function WQ(Q, A = 128) {
  const g = new UI(rQ(Q, A)), I = new og({
    map: g,
    sizeAttenuation: !1
  }), C = new sg(I);
  return C.visible = !1, C.center.set(0.5, 0.3), C.scale.setScalar(0.11), C.renderOrder = 999, C;
}
class XI extends EI {
  // 名称
  name = "map";
  // 瓦片树更新时钟
  _clock = new JI();
  // 是否为LOD模型（LOD模型，当autoUpdate为真时渲染时会自动调用update方法）
  isLOD = !0;
  /**
   * Whether the LOD object is updated automatically by the renderer per frame or not.
   * If set to false, you have to call LOD.update() in the render loop by yourself. Default is true.
   * 瓦片是否在每帧渲染时自动更新，默认为真
   */
  autoUpdate = !0;
  /**
   * Tile tree update interval, unit: ms (default 100ms)
   * 瓦片树更新间隔，单位毫秒（默认100ms）
   */
  updateInterval = 100;
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
  _loader = new wQ();
  _minLevel = 2;
  /**
   * Get min level of map
   * 地图最小缩放级别，小于这个级别瓦片树不再更新
   */
  get minLevel() {
    return this._minLevel;
  }
  /**
   * Set max level of map
   * 设置地图最小缩放级别，小于这个级别瓦片树不再更新
   */
  set minLevel(A) {
    this._minLevel = A;
  }
  _maxLevel = 19;
  /**
   * Get max level of map
   * 地图最大缩放级别，大于这个级别瓦片树不再更新
   */
  get maxLevel() {
    return this._maxLevel;
  }
  /**
   * Set max level of map
   * 设置地图最大缩放级别，大于这个级别瓦片树不再更新
   */
  set maxLevel(A) {
    this._maxLevel = A;
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
  set lon0(A) {
    this.projection.lon0 !== A && (A != 0 && this.minLevel < 1 && console.warn(`Map centralMeridian is ${this.lon0}, minLevel must > 0`), this.projection = rI.createFromID(this.projection.ID, A), this.reload());
  }
  _projection = new bI(0);
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
  set projection(A) {
    (A.ID != this.projection.ID || A.lon0 != this.lon0) && (this.rootTile.scale.set(A.mapWidth, A.mapHeight, A.mapDepth), this._projection = A, this.reload(), this.dispatchEvent({
      type: "projection-changed",
      projection: A
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
  set imgSource(A) {
    const g = Array.isArray(A) ? A : [A];
    if (g.length === 0)
      throw new Error("imgSource can not be empty");
    this.projection = rI.createFromID(g[0].projectionID, this.projection.lon0), this._imgSource = g, this.loader.imgSource = g, this.dispatchEvent({ type: "source-changed", source: A });
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
  set demSource(A) {
    this._demSource = A, this.loader.demSource = this._demSource, this.dispatchEvent({ type: "source-changed", source: A });
  }
  _LODThreshold = 1;
  /**
   * Get LOD threshold
   * 取得LOD阈值
   */
  get LODThreshold() {
    return this._LODThreshold;
  }
  /**
   * Set LOD threshold
   * 设置LOD阈值，LOD阈值越大，瓦片细化，但耗费资源越高，建议取1-2之间
   */
  set LODThreshold(A) {
    this._LODThreshold = A;
  }
  /** get use worker */
  get useWorker() {
    return this.loader.useWorker;
  }
  /** set use worker */
  set useWorker(A) {
    this.loader.useWorker = A;
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
  static create(A) {
    return new XI(A);
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
  constructor(A) {
    super(), this.up.set(0, 0, 1);
    const {
      loader: g = new qI(),
      rootTile: I = new Z(),
      minLevel: C = 2,
      maxLevel: E = 19,
      imgSource: i,
      demSource: D,
      lon0: o = 0
    } = A;
    this.loader = g, I.matrixAutoUpdate = !0, I.scale.set(this.projection.mapWidth, this.projection.mapHeight, this.projection.mapDepth), this.rootTile = I, this.minLevel = C, this.maxLevel = E, this.imgSource = i, this.demSource = D, this.lon0 = o, this.add(I), I.updateMatrix(), FQ(this);
  }
  /**
   * Update the map, It is automatically called after mesh adding a scene
   * 模型更新回调函数，地图加入场景后会在每帧更新时被调用，该函数调用根瓦片实现瓦片树更新和数据加载
   * @param camera
   */
  update(A) {
    const g = this._clock.getElapsedTime();
    if (g > this.updateInterval / 1e3) {
      this._loader.attcth(this.loader, this.projection);
      try {
        this.rootTile.update({
          camera: A,
          loader: this._loader,
          minLevel: this.minLevel,
          maxLevel: this.maxLevel,
          LODThreshold: this.LODThreshold
        }), this.rootTile.castShadow = this.castShadow, this.rootTile.receiveShadow = this.receiveShadow;
      } catch (I) {
        console.error("Error on loading tile data.", I);
      }
      this._clock.start(), this.dispatchEvent({ type: "update", delta: g });
    }
  }
  /**
   * reload the map data，muse called after the source has changed
   * 重新加载地图，在改变地图数据源后调用它才能生效
   */
  reload() {
    this.rootTile.reload(this.loader);
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
   * 地理坐标转换为地图模型坐标(与geo2map同功能)
   * @param geo 地理坐标（经纬度）
   * @returns 模型坐标
   * @deprecated This method is not recommended. Use geo2map() instead.
   */
  geo2pos(A) {
    return this.geo2map(A);
  }
  /**
   * Geo coordinates converted to map model coordinates
   * 地理坐标转换为地图模型坐标(与geo2pos同功能)
   * @param geo 地理坐标（经纬度）
   * @returns 模型坐标
   */
  geo2map(A) {
    const g = this.projection.project(A.x, A.y);
    return new p(g.x, g.y, A.z);
  }
  /**
   * Geo coordinates converted to world coordinates
   * 地理坐标转换为世界坐标
   *
   * @param geo 地理坐标（经纬度）
   * @returns 世界坐标
   */
  geo2world(A) {
    return this.localToWorld(this.geo2pos(A));
  }
  /**
   * Map model coordinates converted to geo coordinates
   * 地图模型坐标转换为地理坐标(与map2geo同功能)
   * @param pos 模型坐标
   * @returns 地理坐标（经纬度）
   *  @deprecated This method is not recommended. Use map2geo() instead.
   */
  pos2geo(A) {
    return this.map2geo(A);
  }
  /**
   * Map model coordinates converted to geo coordinates
   * 地图模型坐标转换为地理坐标(与pos2geo同功能)
   * @param map 模型坐标
   * @returns 地理坐标（经纬度）
   */
  map2geo(A) {
    const g = this.projection.unProject(A.x, A.y);
    return new p(g.lon, g.lat, A.z);
  }
  /**
   * World coordinates converted to geo coordinates
   * 世界坐标转换为地理坐标
   *
   * @param world 世界坐标
   * @returns 地理坐标（经纬度）
   */
  world2geo(A) {
    return this.pos2geo(this.worldToLocal(A.clone()));
  }
  /**
   * Get the ground infomation from latitude and longitude
   * 获取指定经纬度的地面信息（法向量、高度等）
   * @param geo 地理坐标
   * @returns 地面信息
   */
  getLocalInfoFromGeo(A) {
    const g = this.geo2world(A);
    return cI(this, g);
  }
  /**
   * Get loacation infomation from world position
   * 获取指定世界坐标的地面信息
   * @param pos 世界坐标
   * @returns 地面信息
   */
  getLocalInfoFromWorld(A) {
    return cI(this, A);
  }
  /**
   * Get loacation infomation from screen pointer
   * 获取指定屏幕坐标的地面信息
   * @param camera 摄像机
   * @param pointer 点的屏幕坐标（-0.5~0.5）
   * @returns 位置信息（经纬度、高度等）
   */
  getLocalInfoFromScreen(A, g) {
    return yQ(A, this, g);
  }
  /**
   * Get the number of currently downloading tiles
   * 取得当前正在下载的瓦片数量
   */
  get downloading() {
    return Z.downloadThreads;
  }
  // public static get loaderInfo() {
  // 	return LoaderFactory.getLoadersInfo();
  // }
  // public static registerImgLoader(loader: ITileMaterialLoader) {
  // 	LoaderFactory.registerMaterialLoader(loader);
  // 	return loader;
  // }
  // public static registerDEMloader(loader: ITileGeometryLoader) {
  // 	LoaderFactory.registerGeometryLoader(loader);
  // 	return loader;
  // }
}
const nI = { type: "change" }, $A = { type: "start" }, GI = { type: "end" }, bA = new tg(), SI = new ag(), cQ = Math.cos(70 * CI.DEG2RAD);
class nQ extends KI {
  constructor(A, g) {
    super(), this.object = A, this.domElement = g, this.domElement.style.touchAction = "none", this.enabled = !0, this.target = new p(), this.cursor = new p(), this.minDistance = 0, this.maxDistance = 1 / 0, this.minZoom = 0, this.maxZoom = 1 / 0, this.minTargetRadius = 0, this.maxTargetRadius = 1 / 0, this.minPolarAngle = 0, this.maxPolarAngle = Math.PI, this.minAzimuthAngle = -1 / 0, this.maxAzimuthAngle = 1 / 0, this.enableDamping = !1, this.dampingFactor = 0.05, this.enableZoom = !0, this.zoomSpeed = 1, this.enableRotate = !0, this.rotateSpeed = 1, this.enablePan = !0, this.panSpeed = 1, this.screenSpacePanning = !0, this.keyPanSpeed = 7, this.zoomToCursor = !1, this.autoRotate = !1, this.autoRotateSpeed = 2, this.keys = { LEFT: "ArrowLeft", UP: "ArrowUp", RIGHT: "ArrowRight", BOTTOM: "ArrowDown" }, this.mouseButtons = { LEFT: oA.ROTATE, MIDDLE: oA.DOLLY, RIGHT: oA.PAN }, this.touches = { ONE: hA.ROTATE, TWO: hA.DOLLY_PAN }, this.target0 = this.target.clone(), this.position0 = this.object.position.clone(), this.zoom0 = this.object.zoom, this._domElementKeyEvents = null, this.getPolarAngle = function() {
      return D.phi;
    }, this.getAzimuthalAngle = function() {
      return D.theta;
    }, this.getDistance = function() {
      return this.object.position.distanceTo(this.target);
    }, this.listenToKeyEvents = function(B) {
      B.addEventListener("keydown", GA), this._domElementKeyEvents = B;
    }, this.stopListenToKeyEvents = function() {
      this._domElementKeyEvents.removeEventListener("keydown", GA), this._domElementKeyEvents = null;
    }, this.saveState = function() {
      I.target0.copy(I.target), I.position0.copy(I.object.position), I.zoom0 = I.object.zoom;
    }, this.reset = function() {
      I.target.copy(I.target0), I.object.position.copy(I.position0), I.object.zoom = I.zoom0, I.object.updateProjectionMatrix(), I.dispatchEvent(nI), I.update(), E = C.NONE;
    }, this.update = function() {
      const B = new p(), e = new hI().setFromUnitVectors(A.up, new p(0, 1, 0)), w = e.clone().invert(), S = new p(), O = new hI(), b = new p(), $ = 2 * Math.PI;
      return function($I = null) {
        const oI = I.object.position;
        B.copy(oI).sub(I.target), B.applyQuaternion(e), D.setFromVector3(B), I.autoRotate && E === C.NONE && f(l($I)), I.enableDamping ? (D.theta += o.theta * I.dampingFactor, D.phi += o.phi * I.dampingFactor) : (D.theta += o.theta, D.phi += o.phi);
        let BA = I.minAzimuthAngle, iA = I.maxAzimuthAngle;
        isFinite(BA) && isFinite(iA) && (BA < -Math.PI ? BA += $ : BA > Math.PI && (BA -= $), iA < -Math.PI ? iA += $ : iA > Math.PI && (iA -= $), BA <= iA ? D.theta = Math.max(BA, Math.min(iA, D.theta)) : D.theta = D.theta > (BA + iA) / 2 ? Math.max(BA, D.theta) : Math.min(iA, D.theta)), D.phi = Math.max(I.minPolarAngle, Math.min(I.maxPolarAngle, D.phi)), D.makeSafe(), I.enableDamping === !0 ? I.target.addScaledVector(h, I.dampingFactor) : I.target.add(h), I.target.sub(I.cursor), I.target.clampLength(I.minTargetRadius, I.maxTargetRadius), I.target.add(I.cursor);
        let LA = !1;
        if (I.zoomToCursor && q || I.object.isOrthographicCamera)
          D.radius = AA(D.radius);
        else {
          const DA = D.radius;
          D.radius = AA(D.radius * R), LA = DA != D.radius;
        }
        if (B.setFromSpherical(D), B.applyQuaternion(w), oI.copy(I.target).add(B), I.object.lookAt(I.target), I.enableDamping === !0 ? (o.theta *= 1 - I.dampingFactor, o.phi *= 1 - I.dampingFactor, h.multiplyScalar(1 - I.dampingFactor)) : (o.set(0, 0, 0), h.set(0, 0, 0)), I.zoomToCursor && q) {
          let DA = null;
          if (I.object.isPerspectiveCamera) {
            const kA = B.length();
            DA = AA(kA * R);
            const mA = kA - DA;
            I.object.position.addScaledVector(k, mA), I.object.updateMatrixWorld(), LA = !!mA;
          } else if (I.object.isOrthographicCamera) {
            const kA = new p(d.x, d.y, 0);
            kA.unproject(I.object);
            const mA = I.object.zoom;
            I.object.zoom = Math.max(I.minZoom, Math.min(I.maxZoom, I.object.zoom / R)), I.object.updateProjectionMatrix(), LA = mA !== I.object.zoom;
            const sI = new p(d.x, d.y, 0);
            sI.unproject(I.object), I.object.position.sub(sI).add(kA), I.object.updateMatrixWorld(), DA = B.length();
          } else
            console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."), I.zoomToCursor = !1;
          DA !== null && (this.screenSpacePanning ? I.target.set(0, 0, -1).transformDirection(I.object.matrix).multiplyScalar(DA).add(I.object.position) : (bA.origin.copy(I.object.position), bA.direction.set(0, 0, -1).transformDirection(I.object.matrix), Math.abs(I.object.up.dot(bA.direction)) < cQ ? A.lookAt(I.target) : (SI.setFromNormalAndCoplanarPoint(I.object.up, I.target), bA.intersectPlane(SI, I.target))));
        } else if (I.object.isOrthographicCamera) {
          const DA = I.object.zoom;
          I.object.zoom = Math.max(I.minZoom, Math.min(I.maxZoom, I.object.zoom / R)), DA !== I.object.zoom && (I.object.updateProjectionMatrix(), LA = !0);
        }
        return R = 1, q = !1, LA || S.distanceToSquared(I.object.position) > i || 8 * (1 - O.dot(I.object.quaternion)) > i || b.distanceToSquared(I.target) > i ? (I.dispatchEvent(nI), S.copy(I.object.position), O.copy(I.object.quaternion), b.copy(I.target), !0) : !1;
      };
    }(), this.dispose = function() {
      I.domElement.removeEventListener("contextmenu", wA), I.domElement.removeEventListener("pointerdown", fA), I.domElement.removeEventListener("pointercancel", NA), I.domElement.removeEventListener("wheel", uA), I.domElement.removeEventListener("pointermove", nA), I.domElement.removeEventListener("pointerup", NA), I.domElement.getRootNode().removeEventListener("keydown", xA, { capture: !0 }), I._domElementKeyEvents !== null && (I._domElementKeyEvents.removeEventListener("keydown", GA), I._domElementKeyEvents = null);
    };
    const I = this, C = {
      NONE: -1,
      ROTATE: 0,
      DOLLY: 1,
      PAN: 2,
      TOUCH_ROTATE: 3,
      TOUCH_PAN: 4,
      TOUCH_DOLLY_PAN: 5,
      TOUCH_DOLLY_ROTATE: 6
    };
    let E = C.NONE;
    const i = 1e-6, D = new aI(), o = new aI();
    let R = 1;
    const h = new p(), t = new j(), r = new j(), F = new j(), c = new j(), N = new j(), L = new j(), n = new j(), y = new j(), M = new j(), k = new p(), d = new j();
    let q = !1;
    const G = [], J = {};
    let Y = !1;
    function l(B) {
      return B !== null ? 2 * Math.PI / 60 * I.autoRotateSpeed * B : 2 * Math.PI / 60 / 60 * I.autoRotateSpeed;
    }
    function K(B) {
      const e = Math.abs(B * 0.01);
      return Math.pow(0.95, I.zoomSpeed * e);
    }
    function f(B) {
      o.theta -= B;
    }
    function H(B) {
      o.phi -= B;
    }
    const u = function() {
      const B = new p();
      return function(w, S) {
        B.setFromMatrixColumn(S, 0), B.multiplyScalar(-w), h.add(B);
      };
    }(), W = function() {
      const B = new p();
      return function(w, S) {
        I.screenSpacePanning === !0 ? B.setFromMatrixColumn(S, 1) : (B.setFromMatrixColumn(S, 0), B.crossVectors(I.object.up, B)), B.multiplyScalar(w), h.add(B);
      };
    }(), m = function() {
      const B = new p();
      return function(w, S) {
        const O = I.domElement;
        if (I.object.isPerspectiveCamera) {
          const b = I.object.position;
          B.copy(b).sub(I.target);
          let $ = B.length();
          $ *= Math.tan(I.object.fov / 2 * Math.PI / 180), u(2 * w * $ / O.clientHeight, I.object.matrix), W(2 * S * $ / O.clientHeight, I.object.matrix);
        } else I.object.isOrthographicCamera ? (u(w * (I.object.right - I.object.left) / I.object.zoom / O.clientWidth, I.object.matrix), W(S * (I.object.top - I.object.bottom) / I.object.zoom / O.clientHeight, I.object.matrix)) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."), I.enablePan = !1);
      };
    }();
    function P(B) {
      I.object.isPerspectiveCamera || I.object.isOrthographicCamera ? R /= B : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), I.enableZoom = !1);
    }
    function V(B) {
      I.object.isPerspectiveCamera || I.object.isOrthographicCamera ? R *= B : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), I.enableZoom = !1);
    }
    function CA(B, e) {
      if (!I.zoomToCursor)
        return;
      q = !0;
      const w = I.domElement.getBoundingClientRect(), S = B - w.left, O = e - w.top, b = w.width, $ = w.height;
      d.x = S / b * 2 - 1, d.y = -(O / $) * 2 + 1, k.set(d.x, d.y, 1).unproject(I.object).sub(I.object.position).normalize();
    }
    function AA(B) {
      return Math.max(I.minDistance, Math.min(I.maxDistance, B));
    }
    function v(B) {
      t.set(B.clientX, B.clientY);
    }
    function EA(B) {
      CA(B.clientX, B.clientX), n.set(B.clientX, B.clientY);
    }
    function sA(B) {
      c.set(B.clientX, B.clientY);
    }
    function z(B) {
      r.set(B.clientX, B.clientY), F.subVectors(r, t).multiplyScalar(I.rotateSpeed);
      const e = I.domElement;
      f(2 * Math.PI * F.x / e.clientHeight), H(2 * Math.PI * F.y / e.clientHeight), t.copy(r), I.update();
    }
    function gA(B) {
      y.set(B.clientX, B.clientY), M.subVectors(y, n), M.y > 0 ? P(K(M.y)) : M.y < 0 && V(K(M.y)), n.copy(y), I.update();
    }
    function yA(B) {
      N.set(B.clientX, B.clientY), L.subVectors(N, c).multiplyScalar(I.panSpeed), m(L.x, L.y), c.copy(N), I.update();
    }
    function _(B) {
      CA(B.clientX, B.clientY), B.deltaY < 0 ? V(K(B.deltaY)) : B.deltaY > 0 && P(K(B.deltaY)), I.update();
    }
    function IA(B) {
      let e = !1;
      switch (B.code) {
        case I.keys.UP:
          B.ctrlKey || B.metaKey || B.shiftKey ? H(2 * Math.PI * I.rotateSpeed / I.domElement.clientHeight) : m(0, I.keyPanSpeed), e = !0;
          break;
        case I.keys.BOTTOM:
          B.ctrlKey || B.metaKey || B.shiftKey ? H(-2 * Math.PI * I.rotateSpeed / I.domElement.clientHeight) : m(0, -I.keyPanSpeed), e = !0;
          break;
        case I.keys.LEFT:
          B.ctrlKey || B.metaKey || B.shiftKey ? f(2 * Math.PI * I.rotateSpeed / I.domElement.clientHeight) : m(I.keyPanSpeed, 0), e = !0;
          break;
        case I.keys.RIGHT:
          B.ctrlKey || B.metaKey || B.shiftKey ? f(-2 * Math.PI * I.rotateSpeed / I.domElement.clientHeight) : m(-I.keyPanSpeed, 0), e = !0;
          break;
      }
      e && (B.preventDefault(), I.update());
    }
    function tA(B) {
      if (G.length === 1)
        t.set(B.pageX, B.pageY);
      else {
        const e = U(B), w = 0.5 * (B.pageX + e.x), S = 0.5 * (B.pageY + e.y);
        t.set(w, S);
      }
    }
    function RA(B) {
      if (G.length === 1)
        c.set(B.pageX, B.pageY);
      else {
        const e = U(B), w = 0.5 * (B.pageX + e.x), S = 0.5 * (B.pageY + e.y);
        c.set(w, S);
      }
    }
    function eA(B) {
      const e = U(B), w = B.pageX - e.x, S = B.pageY - e.y, O = Math.sqrt(w * w + S * S);
      n.set(0, O);
    }
    function T(B) {
      I.enableZoom && eA(B), I.enablePan && RA(B);
    }
    function qA(B) {
      I.enableZoom && eA(B), I.enableRotate && tA(B);
    }
    function YA(B) {
      if (G.length == 1)
        r.set(B.pageX, B.pageY);
      else {
        const w = U(B), S = 0.5 * (B.pageX + w.x), O = 0.5 * (B.pageY + w.y);
        r.set(S, O);
      }
      F.subVectors(r, t).multiplyScalar(I.rotateSpeed);
      const e = I.domElement;
      f(2 * Math.PI * F.x / e.clientHeight), H(2 * Math.PI * F.y / e.clientHeight), t.copy(r);
    }
    function HA(B) {
      if (G.length === 1)
        N.set(B.pageX, B.pageY);
      else {
        const e = U(B), w = 0.5 * (B.pageX + e.x), S = 0.5 * (B.pageY + e.y);
        N.set(w, S);
      }
      L.subVectors(N, c).multiplyScalar(I.panSpeed), m(L.x, L.y), c.copy(N);
    }
    function FA(B) {
      const e = U(B), w = B.pageX - e.x, S = B.pageY - e.y, O = Math.sqrt(w * w + S * S);
      y.set(0, O), M.set(0, Math.pow(y.y / n.y, I.zoomSpeed)), P(M.y), n.copy(y);
      const b = (B.pageX + e.x) * 0.5, $ = (B.pageY + e.y) * 0.5;
      CA(b, $);
    }
    function rA(B) {
      I.enableZoom && FA(B), I.enablePan && HA(B);
    }
    function lA(B) {
      I.enableZoom && FA(B), I.enableRotate && YA(B);
    }
    function fA(B) {
      I.enabled !== !1 && (G.length === 0 && (I.domElement.setPointerCapture(B.pointerId), I.domElement.addEventListener("pointermove", nA), I.domElement.addEventListener("pointerup", NA)), !s(B) && (_A(B), B.pointerType === "touch" ? SA(B) : VA(B)));
    }
    function nA(B) {
      I.enabled !== !1 && (B.pointerType === "touch" ? pA(B) : vA(B));
    }
    function NA(B) {
      switch (MA(B), G.length) {
        case 0:
          I.domElement.releasePointerCapture(B.pointerId), I.domElement.removeEventListener("pointermove", nA), I.domElement.removeEventListener("pointerup", NA), I.dispatchEvent(GI), E = C.NONE;
          break;
        case 1:
          const e = G[0], w = J[e];
          SA({ pointerId: e, pageX: w.x, pageY: w.y });
          break;
      }
    }
    function VA(B) {
      let e;
      switch (B.button) {
        case 0:
          e = I.mouseButtons.LEFT;
          break;
        case 1:
          e = I.mouseButtons.MIDDLE;
          break;
        case 2:
          e = I.mouseButtons.RIGHT;
          break;
        default:
          e = -1;
      }
      switch (e) {
        case oA.DOLLY:
          if (I.enableZoom === !1) return;
          EA(B), E = C.DOLLY;
          break;
        case oA.ROTATE:
          if (B.ctrlKey || B.metaKey || B.shiftKey) {
            if (I.enablePan === !1) return;
            sA(B), E = C.PAN;
          } else {
            if (I.enableRotate === !1) return;
            v(B), E = C.ROTATE;
          }
          break;
        case oA.PAN:
          if (B.ctrlKey || B.metaKey || B.shiftKey) {
            if (I.enableRotate === !1) return;
            v(B), E = C.ROTATE;
          } else {
            if (I.enablePan === !1) return;
            sA(B), E = C.PAN;
          }
          break;
        default:
          E = C.NONE;
      }
      E !== C.NONE && I.dispatchEvent($A);
    }
    function vA(B) {
      switch (E) {
        case C.ROTATE:
          if (I.enableRotate === !1) return;
          z(B);
          break;
        case C.DOLLY:
          if (I.enableZoom === !1) return;
          gA(B);
          break;
        case C.PAN:
          if (I.enablePan === !1) return;
          yA(B);
          break;
      }
    }
    function uA(B) {
      I.enabled === !1 || I.enableZoom === !1 || E !== C.NONE || (B.preventDefault(), I.dispatchEvent($A), _(zA(B)), I.dispatchEvent(GI));
    }
    function zA(B) {
      const e = B.deltaMode, w = {
        clientX: B.clientX,
        clientY: B.clientY,
        deltaY: B.deltaY
      };
      switch (e) {
        case 1:
          w.deltaY *= 16;
          break;
        case 2:
          w.deltaY *= 100;
          break;
      }
      return B.ctrlKey && !Y && (w.deltaY *= 10), w;
    }
    function xA(B) {
      B.key === "Control" && (Y = !0, I.domElement.getRootNode().addEventListener("keyup", OA, { passive: !0, capture: !0 }));
    }
    function OA(B) {
      B.key === "Control" && (Y = !1, I.domElement.getRootNode().removeEventListener("keyup", OA, { passive: !0, capture: !0 }));
    }
    function GA(B) {
      I.enabled === !1 || I.enablePan === !1 || IA(B);
    }
    function SA(B) {
      switch (a(B), G.length) {
        case 1:
          switch (I.touches.ONE) {
            case hA.ROTATE:
              if (I.enableRotate === !1) return;
              tA(B), E = C.TOUCH_ROTATE;
              break;
            case hA.PAN:
              if (I.enablePan === !1) return;
              RA(B), E = C.TOUCH_PAN;
              break;
            default:
              E = C.NONE;
          }
          break;
        case 2:
          switch (I.touches.TWO) {
            case hA.DOLLY_PAN:
              if (I.enableZoom === !1 && I.enablePan === !1) return;
              T(B), E = C.TOUCH_DOLLY_PAN;
              break;
            case hA.DOLLY_ROTATE:
              if (I.enableZoom === !1 && I.enableRotate === !1) return;
              qA(B), E = C.TOUCH_DOLLY_ROTATE;
              break;
            default:
              E = C.NONE;
          }
          break;
        default:
          E = C.NONE;
      }
      E !== C.NONE && I.dispatchEvent($A);
    }
    function pA(B) {
      switch (a(B), E) {
        case C.TOUCH_ROTATE:
          if (I.enableRotate === !1) return;
          YA(B), I.update();
          break;
        case C.TOUCH_PAN:
          if (I.enablePan === !1) return;
          HA(B), I.update();
          break;
        case C.TOUCH_DOLLY_PAN:
          if (I.enableZoom === !1 && I.enablePan === !1) return;
          rA(B), I.update();
          break;
        case C.TOUCH_DOLLY_ROTATE:
          if (I.enableZoom === !1 && I.enableRotate === !1) return;
          lA(B), I.update();
          break;
        default:
          E = C.NONE;
      }
    }
    function wA(B) {
      I.enabled !== !1 && B.preventDefault();
    }
    function _A(B) {
      G.push(B.pointerId);
    }
    function MA(B) {
      delete J[B.pointerId];
      for (let e = 0; e < G.length; e++)
        if (G[e] == B.pointerId) {
          G.splice(e, 1);
          return;
        }
    }
    function s(B) {
      for (let e = 0; e < G.length; e++)
        if (G[e] == B.pointerId) return !0;
      return !1;
    }
    function a(B) {
      let e = J[B.pointerId];
      e === void 0 && (e = new j(), J[B.pointerId] = e), e.set(B.pageX, B.pageY);
    }
    function U(B) {
      const e = B.pointerId === G[0] ? G[1] : G[0];
      return J[e];
    }
    I.domElement.addEventListener("contextmenu", wA), I.domElement.addEventListener("pointerdown", fA), I.domElement.addEventListener("pointercancel", NA), I.domElement.addEventListener("wheel", uA, { passive: !1 }), I.domElement.getRootNode().addEventListener("keydown", xA, { passive: !0, capture: !0 }), this.update();
  }
}
class GQ extends nQ {
  constructor(A, g) {
    super(A, g), this.screenSpacePanning = !1, this.mouseButtons = { LEFT: oA.PAN, MIDDLE: oA.DOLLY, RIGHT: oA.ROTATE }, this.touches = { ONE: hA.PAN, TWO: hA.DOLLY_ROTATE };
  }
}
var cA = Object.freeze({
  Linear: Object.freeze({
    None: function(Q) {
      return Q;
    },
    In: function(Q) {
      return Q;
    },
    Out: function(Q) {
      return Q;
    },
    InOut: function(Q) {
      return Q;
    }
  }),
  Quadratic: Object.freeze({
    In: function(Q) {
      return Q * Q;
    },
    Out: function(Q) {
      return Q * (2 - Q);
    },
    InOut: function(Q) {
      return (Q *= 2) < 1 ? 0.5 * Q * Q : -0.5 * (--Q * (Q - 2) - 1);
    }
  }),
  Cubic: Object.freeze({
    In: function(Q) {
      return Q * Q * Q;
    },
    Out: function(Q) {
      return --Q * Q * Q + 1;
    },
    InOut: function(Q) {
      return (Q *= 2) < 1 ? 0.5 * Q * Q * Q : 0.5 * ((Q -= 2) * Q * Q + 2);
    }
  }),
  Quartic: Object.freeze({
    In: function(Q) {
      return Q * Q * Q * Q;
    },
    Out: function(Q) {
      return 1 - --Q * Q * Q * Q;
    },
    InOut: function(Q) {
      return (Q *= 2) < 1 ? 0.5 * Q * Q * Q * Q : -0.5 * ((Q -= 2) * Q * Q * Q - 2);
    }
  }),
  Quintic: Object.freeze({
    In: function(Q) {
      return Q * Q * Q * Q * Q;
    },
    Out: function(Q) {
      return --Q * Q * Q * Q * Q + 1;
    },
    InOut: function(Q) {
      return (Q *= 2) < 1 ? 0.5 * Q * Q * Q * Q * Q : 0.5 * ((Q -= 2) * Q * Q * Q * Q + 2);
    }
  }),
  Sinusoidal: Object.freeze({
    In: function(Q) {
      return 1 - Math.sin((1 - Q) * Math.PI / 2);
    },
    Out: function(Q) {
      return Math.sin(Q * Math.PI / 2);
    },
    InOut: function(Q) {
      return 0.5 * (1 - Math.sin(Math.PI * (0.5 - Q)));
    }
  }),
  Exponential: Object.freeze({
    In: function(Q) {
      return Q === 0 ? 0 : Math.pow(1024, Q - 1);
    },
    Out: function(Q) {
      return Q === 1 ? 1 : 1 - Math.pow(2, -10 * Q);
    },
    InOut: function(Q) {
      return Q === 0 ? 0 : Q === 1 ? 1 : (Q *= 2) < 1 ? 0.5 * Math.pow(1024, Q - 1) : 0.5 * (-Math.pow(2, -10 * (Q - 1)) + 2);
    }
  }),
  Circular: Object.freeze({
    In: function(Q) {
      return 1 - Math.sqrt(1 - Q * Q);
    },
    Out: function(Q) {
      return Math.sqrt(1 - --Q * Q);
    },
    InOut: function(Q) {
      return (Q *= 2) < 1 ? -0.5 * (Math.sqrt(1 - Q * Q) - 1) : 0.5 * (Math.sqrt(1 - (Q -= 2) * Q) + 1);
    }
  }),
  Elastic: Object.freeze({
    In: function(Q) {
      return Q === 0 ? 0 : Q === 1 ? 1 : -Math.pow(2, 10 * (Q - 1)) * Math.sin((Q - 1.1) * 5 * Math.PI);
    },
    Out: function(Q) {
      return Q === 0 ? 0 : Q === 1 ? 1 : Math.pow(2, -10 * Q) * Math.sin((Q - 0.1) * 5 * Math.PI) + 1;
    },
    InOut: function(Q) {
      return Q === 0 ? 0 : Q === 1 ? 1 : (Q *= 2, Q < 1 ? -0.5 * Math.pow(2, 10 * (Q - 1)) * Math.sin((Q - 1.1) * 5 * Math.PI) : 0.5 * Math.pow(2, -10 * (Q - 1)) * Math.sin((Q - 1.1) * 5 * Math.PI) + 1);
    }
  }),
  Back: Object.freeze({
    In: function(Q) {
      var A = 1.70158;
      return Q === 1 ? 1 : Q * Q * ((A + 1) * Q - A);
    },
    Out: function(Q) {
      var A = 1.70158;
      return Q === 0 ? 0 : --Q * Q * ((A + 1) * Q + A) + 1;
    },
    InOut: function(Q) {
      var A = 2.5949095;
      return (Q *= 2) < 1 ? 0.5 * (Q * Q * ((A + 1) * Q - A)) : 0.5 * ((Q -= 2) * Q * ((A + 1) * Q + A) + 2);
    }
  }),
  Bounce: Object.freeze({
    In: function(Q) {
      return 1 - cA.Bounce.Out(1 - Q);
    },
    Out: function(Q) {
      return Q < 1 / 2.75 ? 7.5625 * Q * Q : Q < 2 / 2.75 ? 7.5625 * (Q -= 1.5 / 2.75) * Q + 0.75 : Q < 2.5 / 2.75 ? 7.5625 * (Q -= 2.25 / 2.75) * Q + 0.9375 : 7.5625 * (Q -= 2.625 / 2.75) * Q + 0.984375;
    },
    InOut: function(Q) {
      return Q < 0.5 ? cA.Bounce.In(Q * 2) * 0.5 : cA.Bounce.Out(Q * 2 - 1) * 0.5 + 0.5;
    }
  }),
  generatePow: function(Q) {
    return Q === void 0 && (Q = 4), Q = Q < Number.EPSILON ? Number.EPSILON : Q, Q = Q > 1e4 ? 1e4 : Q, {
      In: function(A) {
        return Math.pow(A, Q);
      },
      Out: function(A) {
        return 1 - Math.pow(1 - A, Q);
      },
      InOut: function(A) {
        return A < 0.5 ? Math.pow(A * 2, Q) / 2 : (1 - Math.pow(2 - A * 2, Q)) / 2 + 0.5;
      }
    };
  }
}), KA = function() {
  return performance.now();
}, SQ = (
  /** @class */
  function() {
    function Q() {
      this._tweens = {}, this._tweensAddedDuringUpdate = {};
    }
    return Q.prototype.getAll = function() {
      var A = this;
      return Object.keys(this._tweens).map(function(g) {
        return A._tweens[g];
      });
    }, Q.prototype.removeAll = function() {
      this._tweens = {};
    }, Q.prototype.add = function(A) {
      this._tweens[A.getId()] = A, this._tweensAddedDuringUpdate[A.getId()] = A;
    }, Q.prototype.remove = function(A) {
      delete this._tweens[A.getId()], delete this._tweensAddedDuringUpdate[A.getId()];
    }, Q.prototype.update = function(A, g) {
      A === void 0 && (A = KA()), g === void 0 && (g = !1);
      var I = Object.keys(this._tweens);
      if (I.length === 0)
        return !1;
      for (; I.length > 0; ) {
        this._tweensAddedDuringUpdate = {};
        for (var C = 0; C < I.length; C++) {
          var E = this._tweens[I[C]], i = !g;
          E && E.update(A, i) === !1 && !g && delete this._tweens[I[C]];
        }
        I = Object.keys(this._tweensAddedDuringUpdate);
      }
      return !0;
    }, Q;
  }()
), II = {
  Linear: function(Q, A) {
    var g = Q.length - 1, I = g * A, C = Math.floor(I), E = II.Utils.Linear;
    return A < 0 ? E(Q[0], Q[1], I) : A > 1 ? E(Q[g], Q[g - 1], g - I) : E(Q[C], Q[C + 1 > g ? g : C + 1], I - C);
  },
  Utils: {
    Linear: function(Q, A, g) {
      return (A - Q) * g + Q;
    }
  }
}, jI = (
  /** @class */
  function() {
    function Q() {
    }
    return Q.nextId = function() {
      return Q._nextId++;
    }, Q._nextId = 0, Q;
  }()
), gI = new SQ(), MI = (
  /** @class */
  function() {
    function Q(A, g) {
      g === void 0 && (g = gI), this._object = A, this._group = g, this._isPaused = !1, this._pauseStart = 0, this._valuesStart = {}, this._valuesEnd = {}, this._valuesStartRepeat = {}, this._duration = 1e3, this._isDynamic = !1, this._initialRepeat = 0, this._repeat = 0, this._yoyo = !1, this._isPlaying = !1, this._reversed = !1, this._delayTime = 0, this._startTime = 0, this._easingFunction = cA.Linear.None, this._interpolationFunction = II.Linear, this._chainedTweens = [], this._onStartCallbackFired = !1, this._onEveryStartCallbackFired = !1, this._id = jI.nextId(), this._isChainStopped = !1, this._propertiesAreSetUp = !1, this._goToEnd = !1;
    }
    return Q.prototype.getId = function() {
      return this._id;
    }, Q.prototype.isPlaying = function() {
      return this._isPlaying;
    }, Q.prototype.isPaused = function() {
      return this._isPaused;
    }, Q.prototype.getDuration = function() {
      return this._duration;
    }, Q.prototype.to = function(A, g) {
      if (g === void 0 && (g = 1e3), this._isPlaying)
        throw new Error("Can not call Tween.to() while Tween is already started or paused. Stop the Tween first.");
      return this._valuesEnd = A, this._propertiesAreSetUp = !1, this._duration = g < 0 ? 0 : g, this;
    }, Q.prototype.duration = function(A) {
      return A === void 0 && (A = 1e3), this._duration = A < 0 ? 0 : A, this;
    }, Q.prototype.dynamic = function(A) {
      return A === void 0 && (A = !1), this._isDynamic = A, this;
    }, Q.prototype.start = function(A, g) {
      if (A === void 0 && (A = KA()), g === void 0 && (g = !1), this._isPlaying)
        return this;
      if (this._group && this._group.add(this), this._repeat = this._initialRepeat, this._reversed) {
        this._reversed = !1;
        for (var I in this._valuesStartRepeat)
          this._swapEndStartRepeatValues(I), this._valuesStart[I] = this._valuesStartRepeat[I];
      }
      if (this._isPlaying = !0, this._isPaused = !1, this._onStartCallbackFired = !1, this._onEveryStartCallbackFired = !1, this._isChainStopped = !1, this._startTime = A, this._startTime += this._delayTime, !this._propertiesAreSetUp || g) {
        if (this._propertiesAreSetUp = !0, !this._isDynamic) {
          var C = {};
          for (var E in this._valuesEnd)
            C[E] = this._valuesEnd[E];
          this._valuesEnd = C;
        }
        this._setupProperties(this._object, this._valuesStart, this._valuesEnd, this._valuesStartRepeat, g);
      }
      return this;
    }, Q.prototype.startFromCurrentValues = function(A) {
      return this.start(A, !0);
    }, Q.prototype._setupProperties = function(A, g, I, C, E) {
      for (var i in I) {
        var D = A[i], o = Array.isArray(D), R = o ? "array" : typeof D, h = !o && Array.isArray(I[i]);
        if (!(R === "undefined" || R === "function")) {
          if (h) {
            var t = I[i];
            if (t.length === 0)
              continue;
            for (var r = [D], F = 0, c = t.length; F < c; F += 1) {
              var N = this._handleRelativeValue(D, t[F]);
              if (isNaN(N)) {
                h = !1, console.warn("Found invalid interpolation list. Skipping.");
                break;
              }
              r.push(N);
            }
            h && (I[i] = r);
          }
          if ((R === "object" || o) && D && !h) {
            g[i] = o ? [] : {};
            var L = D;
            for (var n in L)
              g[i][n] = L[n];
            C[i] = o ? [] : {};
            var t = I[i];
            if (!this._isDynamic) {
              var y = {};
              for (var n in t)
                y[n] = t[n];
              I[i] = t = y;
            }
            this._setupProperties(L, g[i], t, C[i], E);
          } else
            (typeof g[i] > "u" || E) && (g[i] = D), o || (g[i] *= 1), h ? C[i] = I[i].slice().reverse() : C[i] = g[i] || 0;
        }
      }
    }, Q.prototype.stop = function() {
      return this._isChainStopped || (this._isChainStopped = !0, this.stopChainedTweens()), this._isPlaying ? (this._group && this._group.remove(this), this._isPlaying = !1, this._isPaused = !1, this._onStopCallback && this._onStopCallback(this._object), this) : this;
    }, Q.prototype.end = function() {
      return this._goToEnd = !0, this.update(1 / 0), this;
    }, Q.prototype.pause = function(A) {
      return A === void 0 && (A = KA()), this._isPaused || !this._isPlaying ? this : (this._isPaused = !0, this._pauseStart = A, this._group && this._group.remove(this), this);
    }, Q.prototype.resume = function(A) {
      return A === void 0 && (A = KA()), !this._isPaused || !this._isPlaying ? this : (this._isPaused = !1, this._startTime += A - this._pauseStart, this._pauseStart = 0, this._group && this._group.add(this), this);
    }, Q.prototype.stopChainedTweens = function() {
      for (var A = 0, g = this._chainedTweens.length; A < g; A++)
        this._chainedTweens[A].stop();
      return this;
    }, Q.prototype.group = function(A) {
      return A === void 0 && (A = gI), this._group = A, this;
    }, Q.prototype.delay = function(A) {
      return A === void 0 && (A = 0), this._delayTime = A, this;
    }, Q.prototype.repeat = function(A) {
      return A === void 0 && (A = 0), this._initialRepeat = A, this._repeat = A, this;
    }, Q.prototype.repeatDelay = function(A) {
      return this._repeatDelayTime = A, this;
    }, Q.prototype.yoyo = function(A) {
      return A === void 0 && (A = !1), this._yoyo = A, this;
    }, Q.prototype.easing = function(A) {
      return A === void 0 && (A = cA.Linear.None), this._easingFunction = A, this;
    }, Q.prototype.interpolation = function(A) {
      return A === void 0 && (A = II.Linear), this._interpolationFunction = A, this;
    }, Q.prototype.chain = function() {
      for (var A = [], g = 0; g < arguments.length; g++)
        A[g] = arguments[g];
      return this._chainedTweens = A, this;
    }, Q.prototype.onStart = function(A) {
      return this._onStartCallback = A, this;
    }, Q.prototype.onEveryStart = function(A) {
      return this._onEveryStartCallback = A, this;
    }, Q.prototype.onUpdate = function(A) {
      return this._onUpdateCallback = A, this;
    }, Q.prototype.onRepeat = function(A) {
      return this._onRepeatCallback = A, this;
    }, Q.prototype.onComplete = function(A) {
      return this._onCompleteCallback = A, this;
    }, Q.prototype.onStop = function(A) {
      return this._onStopCallback = A, this;
    }, Q.prototype.update = function(A, g) {
      var I;
      if (A === void 0 && (A = KA()), g === void 0 && (g = !0), this._isPaused)
        return !0;
      var C = this._startTime + this._duration;
      if (!this._goToEnd && !this._isPlaying) {
        if (A > C)
          return !1;
        g && this.start(A, !0);
      }
      if (this._goToEnd = !1, A < this._startTime)
        return !0;
      this._onStartCallbackFired === !1 && (this._onStartCallback && this._onStartCallback(this._object), this._onStartCallbackFired = !0), this._onEveryStartCallbackFired === !1 && (this._onEveryStartCallback && this._onEveryStartCallback(this._object), this._onEveryStartCallbackFired = !0);
      var E = A - this._startTime, i = this._duration + ((I = this._repeatDelayTime) !== null && I !== void 0 ? I : this._delayTime), D = this._duration + this._repeat * i, o = this._calculateElapsedPortion(E, i, D), R = this._easingFunction(o), h = this._calculateCompletionStatus(E, i);
      if (h === "repeat" && this._processRepetition(E, i), this._updateProperties(this._object, this._valuesStart, this._valuesEnd, R), h === "about-to-repeat" && this._processRepetition(E, i), this._onUpdateCallback && this._onUpdateCallback(this._object, o), h === "repeat" || h === "about-to-repeat")
        this._onRepeatCallback && this._onRepeatCallback(this._object), this._onEveryStartCallbackFired = !1;
      else if (h === "completed") {
        this._isPlaying = !1, this._onCompleteCallback && this._onCompleteCallback(this._object);
        for (var t = 0, r = this._chainedTweens.length; t < r; t++)
          this._chainedTweens[t].start(this._startTime + this._duration, !1);
      }
      return h !== "completed";
    }, Q.prototype._calculateElapsedPortion = function(A, g, I) {
      if (this._duration === 0 || A > I)
        return 1;
      var C = A % g, E = Math.min(C / this._duration, 1);
      return E === 0 && A !== 0 && A % this._duration === 0 ? 1 : E;
    }, Q.prototype._calculateCompletionStatus = function(A, g) {
      return this._duration !== 0 && A < this._duration ? "playing" : this._repeat <= 0 ? "completed" : A === this._duration ? "about-to-repeat" : "repeat";
    }, Q.prototype._processRepetition = function(A, g) {
      var I = Math.min(Math.trunc((A - this._duration) / g) + 1, this._repeat);
      isFinite(this._repeat) && (this._repeat -= I);
      for (var C in this._valuesStartRepeat) {
        var E = this._valuesEnd[C];
        !this._yoyo && typeof E == "string" && (this._valuesStartRepeat[C] = this._valuesStartRepeat[C] + parseFloat(E)), this._yoyo && this._swapEndStartRepeatValues(C), this._valuesStart[C] = this._valuesStartRepeat[C];
      }
      this._yoyo && (this._reversed = !this._reversed), this._startTime += g * I;
    }, Q.prototype._updateProperties = function(A, g, I, C) {
      for (var E in I)
        if (g[E] !== void 0) {
          var i = g[E] || 0, D = I[E], o = Array.isArray(A[E]), R = Array.isArray(D), h = !o && R;
          h ? A[E] = this._interpolationFunction(D, C) : typeof D == "object" && D ? this._updateProperties(A[E], i, D, C) : (D = this._handleRelativeValue(i, D), typeof D == "number" && (A[E] = i + (D - i) * C));
        }
    }, Q.prototype._handleRelativeValue = function(A, g) {
      return typeof g != "string" ? g : g.charAt(0) === "+" || g.charAt(0) === "-" ? A + parseFloat(g) : parseFloat(g);
    }, Q.prototype._swapEndStartRepeatValues = function(A) {
      var g = this._valuesStartRepeat[A], I = this._valuesEnd[A];
      typeof I == "string" ? this._valuesStartRepeat[A] = this._valuesStartRepeat[A] + parseFloat(I) : this._valuesStartRepeat[A] = this._valuesEnd[A], this._valuesEnd[A] = g;
    }, Q;
  }()
);
jI.nextId;
var QA = gI;
QA.getAll.bind(QA);
QA.removeAll.bind(QA);
QA.add.bind(QA);
QA.remove.bind(QA);
var MQ = QA.update.bind(QA);
class LQ extends KI {
  scene;
  renderer;
  camera;
  controls;
  ambLight;
  dirLight;
  container;
  _clock = new JI();
  _fogFactor = 1;
  get fogFactor() {
    return this._fogFactor;
  }
  set fogFactor(A) {
    this._fogFactor = A, this.controls.dispatchEvent({ type: "change" });
  }
  get width() {
    return this.container.clientWidth;
  }
  get height() {
    return this.container.clientHeight;
  }
  constructor(A, g = {}) {
    super();
    const I = typeof A == "string" ? document.querySelector(A) : A;
    if (I instanceof HTMLElement) {
      const { antialias: C = !1, stencil: E = !0, logarithmicDepthBuffer: i = !0 } = g;
      this.container = I, this.renderer = this._createRenderer(C, E, i), this.scene = this._createScene(), this.camera = this._createCamera(), this.controls = this._createControls(), this.ambLight = this._createAmbLight(), this.scene.add(this.ambLight), this.dirLight = this._createDirLight(), this.scene.add(this.dirLight), this.scene.add(this.dirLight.target), this.container.appendChild(this.renderer.domElement), window.addEventListener("resize", this.resize.bind(this)), this.resize(), this.renderer.setAnimationLoop(this.animate.bind(this));
    } else
      throw new Error(`${A} not found!`);
  }
  _createScene() {
    const A = new hg(), g = 14414079;
    return A.background = new XA(g), A.fog = new AI(g, 0), A;
  }
  _createRenderer(A, g, I) {
    const C = new Rg({
      antialias: A,
      logarithmicDepthBuffer: I,
      stencil: g,
      alpha: !0,
      precision: "highp"
    });
    return C.setPixelRatio(window.devicePixelRatio), C;
  }
  _createCamera() {
    const A = new eg(70, 1, 0.1, 5e4);
    return A.position.set(0, 3e4, 0), A;
  }
  _createControls() {
    const E = new GQ(this.camera, this.container);
    return E.target.set(0, 0, -3e3), E.screenSpacePanning = !1, E.minDistance = 0.1, E.maxDistance = 3e4, E.maxPolarAngle = 1.2, E.enableDamping = !0, E.dampingFactor = 0.05, E.keyPanSpeed = 5, this.container.tabIndex = 0, E.listenToKeyEvents(this.container), E.addEventListener("change", () => {
      const i = Math.max(E.getPolarAngle(), 0.1), D = Math.max(E.getDistance(), 0.1);
      E.zoomSpeed = Math.max(Math.log(D), 0) + 0.5, this.camera.far = CI.clamp(D / i * 8, 100, 5e4), this.camera.near = this.camera.far / 1e3, this.camera.updateProjectionMatrix(), this.scene.fog instanceof AI && (this.scene.fog.density = i / (D + 5) * this.fogFactor * 0.25);
      const o = D > 8e3;
      E.minAzimuthAngle = o ? 0 : -1 / 0, E.maxAzimuthAngle = o ? 0 : 1 / 0, E.maxPolarAngle = Math.min(Math.pow(1e4 / D, 4), 1.2);
    }), E;
  }
  _createAmbLight() {
    return new Ng(16777215, 1);
  }
  _createDirLight() {
    const A = new wg(16777215, 1);
    return A.position.set(0, 2e3, 1e3), A.target.position.copy(this.controls.target), A;
  }
  resize() {
    const A = this.width, g = this.height;
    return this.renderer.setPixelRatio(window.devicePixelRatio), this.renderer.setSize(A, g), this.camera.aspect = A / g, this.camera.updateProjectionMatrix(), this;
  }
  animate() {
    this.controls.update(), this.renderer.render(this.scene, this.camera), MQ(), this.dispatchEvent({ type: "update", delta: this._clock.getDelta() });
  }
  /**
   * Fly to a position
   * @param centerPostion Map center target position
   * @param cameraPostion Camera target position
   * @param animate animate or not
   */
  flyTo(A, g, I = !0, C) {
    if (this.controls.target.copy(A), I) {
      const E = this.camera.position;
      new MI(E).to({ y: 1e4, z: 0 }, 500).chain(
        new MI(E).to(g, 2e3).easing(cA.Quintic.Out).onComplete((i) => C && C(i))
      ).start();
    } else
      this.camera.position.copy(g);
  }
  /**
   * Get current scens state
   * @returns center position and camera position
   */
  getState() {
    return {
      centerPosition: this.controls.target,
      cameraPosition: this.camera.position
    };
  }
}
const kQ = `
varying vec2 vUv;
uniform vec3 bkColor;
uniform vec3 airColor;

void main() {  
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);  
}  
`, UQ = `
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
    } else if(d<=1.1f){        
        float c = (d-1.0f)/(1.1f-1.0f);
        gl_FragColor = vec4(mix(airColor,bkColor,sqrt(c)),1.0f);
    } else{
        // 球体外颜色
        gl_FragColor = vec4(bkColor,1.0f);
    }
    
    // #include <tonemapping_fragment>
    // #include <encodings_fragment>    
    #include <colorspace_fragment>
    
}  
`;
class VI extends yg {
  constructor(A) {
    super({
      uniforms: Fg.merge([
        rg.fog,
        {
          bkColor: {
            value: A.bkColor
          },
          airColor: {
            value: A.airColor
          }
        }
      ]),
      transparent: !0,
      depthTest: !1,
      vertexShader: kQ,
      fragmentShader: UQ,
      lights: !1
    });
  }
}
class vI extends EI {
  get bkColor() {
    return this.material.uniforms.bkColor.value;
  }
  set bkColor(A) {
    this.material.uniforms.bkColor.value.set(A);
  }
  constructor(A, g = new XA(6724044)) {
    super(new ZA(5, 5), new VI({ bkColor: A, airColor: g })), this.renderOrder = 999;
  }
}
function dQ(Q, A = 14414079, g = 6724044) {
  const I = new vI(new XA(A), new XA(g));
  return I.name = "fakeearth", I.applyMatrix4(Q.rootTile.matrix), I;
}
class zI extends AI {
  _controls;
  _factor = 1;
  get factor() {
    return this._factor;
  }
  set factor(A) {
    this._factor = A, this._controls.dispatchEvent({ type: "change" });
  }
  constructor(A, g) {
    super(g), this._controls = A, A.addEventListener("change", () => {
      const I = Math.max(A.getPolarAngle(), 0.1), C = Math.max(A.getDistance(), 0.1);
      this.density = I / (C + 5) * this.factor * 0.25;
    });
  }
}
function JQ(Q, A = 14414079) {
  return new zI(Q, A);
}
function KQ(Q) {
  const A = /* @__PURE__ */ new Set();
  if ((Array.isArray(Q.imgSource) ? Q.imgSource : [Q.imgSource]).forEach((I) => {
    const C = I.attribution;
    C && A.add(C);
  }), Q.demSource) {
    const I = Q.demSource.attribution;
    I && A.add(I);
  }
  return Array.from(A);
}
function qQ(Q, A, g) {
  const { currentTarget: I, clientX: C, clientY: E } = Q;
  if (I instanceof HTMLElement) {
    const i = I.clientWidth, D = I.clientHeight, o = new j(C / i * 2 - 1, -(E / D) * 2 + 1);
    return A.getLocalInfoFromScreen(g, o)?.location;
  } else
    return;
}
function YQ(Q, A, g = 0.1) {
  const I = A.localToWorld(new p(0, 0, -A.near - 0.1)), C = Q.getLocalInfoFromWorld(I);
  if (C) {
    const E = I.y - C.point.y;
    if (E < g) {
      const i = E < 0 ? -E * 1.1 : E / 10, D = Q.localToWorld(Q.up.clone()).multiplyScalar(i);
      return A.position.add(D), !0;
    }
  }
  return !1;
}
function HQ(Q) {
  let A = 0, g = 0, I = 0, C = 0, E = 0;
  return Q.rootTile.traverse((i) => {
    i.isTile && (A++, i.isLeaf && (C++, i.inFrustum && g++), I = Math.max(I, i.z), E = Z.downloadThreads);
  }), { total: A, visible: g, leaf: C, maxLevel: I, downloading: E };
}
const TQ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  EarthMaskMaterial: VI,
  FakeEarth: vI,
  GLViewer: LQ,
  MapFog: zI,
  createFog: JQ,
  createFrakEarth: dQ,
  getAttributions: KQ,
  getLocalFromMouse: qQ,
  getTileCount: HQ,
  limitCameraHeight: YQ
}, Symbol.toStringTag, { value: "Module" })), { version: PQ, author: bQ } = JSON.parse(CQ);
function ZQ(Q, A = 100) {
  return new Promise((g) => {
    const I = setInterval(() => {
      Q && (clearInterval(I), g());
    }, A);
  });
}
function lQ(Q) {
  return X.registerMaterialLoader(Q), Q;
}
function _I(Q) {
  return X.registerGeometryLoader(Q), Q;
}
export {
  X as LoaderFactory,
  Jg as Martini,
  xQ as PromiseWorker,
  Z as Tile,
  mQ as TileCanvasLoader,
  DI as TileGeometry,
  fI as TileGeometryLoader,
  qI as TileLoader,
  ng as TileLoadingManager,
  XI as TileMap,
  uI as TileMaterial,
  qg as TileMaterialLoader,
  TI as TileSource,
  OQ as TileTextureLoader,
  dA as VectorFeatureTypes,
  pQ as VectorTileRender,
  YI as addSkirt,
  FQ as attachEvent,
  bQ as author,
  TA as concatenateTypedArrays,
  WQ as createBillboards,
  BI as getBoundsCoord,
  Ug as getGeometryDataFromDem,
  HI as getGridIndices,
  ZI as getLocalInfoFromRay,
  yQ as getLocalInfoFromScreen,
  cI as getLocalInfoFromWorld,
  lI as getNormals,
  iI as getSafeTileUrlAndBounds,
  TQ as plugin,
  _I as registerDEMLoader,
  lQ as registerImgLoader,
  PQ as version,
  ZQ as waitFor
};
