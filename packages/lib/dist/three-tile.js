import { LoadingManager as SI, Vector2 as nA, Box2 as MI, PlaneGeometry as SA, MeshBasicMaterial as dA, ImageLoader as MA, Texture as fA, SRGBColorSpace as uA, BufferAttribute as wA, MeshStandardMaterial as LI, FrontSide as cI, CanvasTexture as TA, FileLoader as kI, MathUtils as UI, Vector3 as P, InstancedBufferGeometry as rI, Matrix4 as eI, Box3 as JI, Frustum as nI, Mesh as mA, Raycaster as pA, SpriteMaterial as dI, Sprite as KI, Clock as qI } from "three";
const YI = "0.10.0", KA = {
  name: "GuoJF"
};
console.log(`====================three-tile V${YI}==============================`);
class HI extends SI {
  onParseEnd = void 0;
  parseEnd(A) {
    this.onParseEnd && this.onParseEnd(A);
  }
}
const T = {
  manager: new HI(),
  // Dict of dem loader
  demLoaderMap: /* @__PURE__ */ new Map(),
  // Dict of img loader
  imgLoaderMap: /* @__PURE__ */ new Map(),
  /**
   * Register material loader
   * @param loader material loader
   */
  registerMaterialLoader(C) {
    T.imgLoaderMap.set(C.dataType, C), C.info.author = C.info.author ?? KA.name, console.log(`* Register imageLoader: '${C.dataType}', Author: '${C.info.author}'`);
  },
  /**
   * Register geometry loader
   * @param loader geometry loader
   */
  registerGeometryLoader(C) {
    T.demLoaderMap.set(C.dataType, C), C.info.author = C.info.author ?? KA.name, console.log(`* Register terrainLoader: '${C.dataType}', Author: '${C.info.author}'`);
  },
  /**
   * Get material loader from datasource
   * @param source datasource
   * @returns material loader
   */
  getMaterialLoader(C) {
    const A = T.imgLoaderMap.get(C.dataType);
    if (A)
      return A;
    throw `Source dataType "${C.dataType}" is not support!`;
  },
  /**
   * Get geometry loader from datasource
   * @param source datasouce
   * @returns geometry loader
   */
  getGeometryLoader(C) {
    const A = T.demLoaderMap.get(C.dataType);
    if (A)
      return A;
    throw `Source dataType "${C.dataType}" is not support!`;
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
class xg {
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
  async run(A, I) {
    return new Promise((g) => {
      this.worker.onmessage = (Q) => {
        g(Q.data);
      }, this.worker.postMessage(A, I);
    });
  }
  /**
   * 终止当前工作进程。
   */
  terminate() {
    this.worker.terminate();
  }
}
function LA(C, A) {
  const I = Math.floor(C[0] * A), g = Math.floor(C[1] * A), Q = Math.floor((C[2] - C[0]) * A), B = Math.floor((C[3] - C[1]) * A);
  return { sx: I, sy: g, sw: Q, sh: B };
}
function cA(C, A, I, g) {
  if (g < C.minLevel)
    return {
      url: void 0,
      clipBounds: [0, 0, 1, 1]
    };
  if (g <= C.maxLevel)
    return {
      url: C._getUrl(A, I, g),
      clipBounds: [0, 0, 1, 1]
    };
  const Q = xI(A, I, g, C.maxLevel), B = Q.parentNO;
  return { url: C._getUrl(B.x, B.y, B.z), clipBounds: Q.bounds };
}
function xI(C, A, I, g) {
  const Q = I - g, B = { x: C >> Q, y: A >> Q, z: I - Q }, D = Math.pow(2, Q), E = Math.pow(0.5, Q), s = C % D / D - 0.5 + E / 2, N = A % D / D - 0.5 + E / 2, h = new nA(s, N), R = new MI().setFromCenterAndSize(h, new nA(E, E)), G = [
    R.min.x + 0.5,
    R.min.y + 0.5,
    R.max.x + 0.5,
    R.max.y + 0.5
  ];
  return { parentNO: B, bounds: G };
}
class ZA {
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
  manager = T.manager;
  /**
   * Load getmetry and materail of tile from x, y and z coordinate.
   *
   * @returns Promise<MeshDateType> tile data
   */
  async load(A) {
    const I = await this.loadGeometry(A), g = await this.loadMaterial(A);
    console.assert(!!g && !!I);
    for (let Q = 0; Q < g.length; Q++)
      I.addGroup(0, 1 / 0, Q);
    return { materials: g, geometry: I };
  }
  /**
   * Unload tile mesh data
   * @param tileMesh tile mesh
   */
  unload(A) {
    const I = A.material, g = A.geometry;
    for (let Q = 0; Q < I.length; Q++)
      I[Q].dispose();
    g.dispose();
  }
  /**
   * Load geometry
   * @returns BufferGeometry
   */
  async loadGeometry(A) {
    let I;
    if (this.demSource && A.z >= this.demSource.minLevel && this._isBoundsInSourceBounds(this.demSource, A.bounds)) {
      const g = T.getGeometryLoader(this.demSource);
      g.useWorker = this.useWorker;
      const Q = this.demSource;
      I = await g.load({ source: Q, ...A }).catch((B) => (console.error("Load material error", Q.dataType, A), new SA())), I.addEventListener("dispose", () => {
        g.unload && g.unload(I);
      });
    } else
      I = new SA();
    return I;
  }
  /**
   * Load material
   * @param x x coordinate of tile
   * @param y y coordinate of tile
   * @param z z coordinate of tile
   * @returns Material[]
   */
  async loadMaterial(A) {
    const g = this.imgSource.filter(
      (Q) => A.z >= Q.minLevel && this._isBoundsInSourceBounds(Q, A.bounds)
    ).map(async (Q) => {
      const B = T.getMaterialLoader(Q);
      B.useWorker = this.useWorker;
      const D = await B.load({ source: Q, ...A }).catch((s) => (console.error("Load material error", Q.dataType, A), new dA())), E = (s) => {
        B.unload && B.unload(s.target), s.target.removeEventListener("dispose", E);
      };
      return D instanceof dA || D.addEventListener("dispose", E), D;
    });
    return Promise.all(g);
  }
  /**
   * Check the tile is in the source bounds. (projection coordinate)
   * @returns true in the bounds,else false
   */
  _isBoundsInSourceBounds(A, I) {
    const g = A._projectionBounds;
    return !(I[2] < g[0] || I[3] < g[1] || I[0] > g[2] || I[1] > g[3]);
  }
}
class lg {
  // image loader
  loader = new MA(T.manager);
  /**
   * load the tile texture
   * @param tile tile to load
   * @param source datasource
   * @returns texture
   */
  async load(A, I, g, Q) {
    const B = new fA(new Image(1, 1));
    B.colorSpace = uA;
    const { url: D, clipBounds: E } = cA(A, I, g, Q);
    if (D) {
      const s = await this.loader.loadAsync(D);
      Q > A.maxLevel ? B.image = lI(s, E) : B.image = s;
    }
    return B;
  }
}
function lI(C, A) {
  const I = C.width, g = new OffscreenCanvas(I, I), Q = g.getContext("2d"), { sx: B, sy: D, sw: E, sh: s } = LA(A, C.width);
  return Q.drawImage(C, B, D, E, s, 0, 0, I, I), g;
}
function aA(...C) {
  const A = C, I = A && A.length > 1 && A[0].constructor || null;
  if (!I)
    throw new Error(
      "concatenateTypedArrays - incorrect quantity of arguments or arguments have incompatible data types"
    );
  const g = A.reduce((D, E) => D + E.length, 0), Q = new I(g);
  let B = 0;
  for (const D of A)
    Q.set(D, B), B += D.length;
  return Q;
}
function PA(C, A, I, g) {
  const Q = g ? WI(g, C.position.value) : OI(A), B = Q.length, D = new Float32Array(B * 6), E = new Float32Array(B * 4), s = new A.constructor(B * 6), N = new Float32Array(B * 6);
  for (let R = 0; R < B; R++)
    fI({
      edge: Q[R],
      edgeIndex: R,
      attributes: C,
      skirtHeight: I,
      newPosition: D,
      newTexcoord0: E,
      newTriangles: s,
      newNormals: N
    });
  C.position.value = aA(C.position.value, D), C.texcoord.value = aA(C.texcoord.value, E), C.normal.value = aA(C.normal.value, N);
  const h = aA(A, s);
  return {
    attributes: C,
    indices: h
  };
}
function OI(C) {
  const A = [], I = Array.isArray(C) ? C : Array.from(C);
  for (let Q = 0; Q < I.length; Q += 3) {
    const B = I[Q], D = I[Q + 1], E = I[Q + 2];
    A.push([B, D], [D, E], [E, B]);
  }
  A.sort(([Q, B], [D, E]) => {
    const s = Math.min(Q, B), N = Math.min(D, E);
    return s !== N ? s - N : Math.max(Q, B) - Math.max(D, E);
  });
  const g = [];
  for (let Q = 0; Q < A.length; Q++)
    Q + 1 < A.length && A[Q][0] === A[Q + 1][1] && A[Q][1] === A[Q + 1][0] ? Q++ : g.push(A[Q]);
  return g;
}
function WI(C, A) {
  const I = (Q, B) => {
    Q.sort(B);
  };
  I(C.westIndices, (Q, B) => A[3 * Q + 1] - A[3 * B + 1]), I(C.eastIndices, (Q, B) => A[3 * B + 1] - A[3 * Q + 1]), I(C.southIndices, (Q, B) => A[3 * B] - A[3 * Q]), I(C.northIndices, (Q, B) => A[3 * Q] - A[3 * B]);
  const g = [];
  return Object.values(C).forEach((Q) => {
    if (Q.length > 1)
      for (let B = 0; B < Q.length - 1; B++)
        g.push([Q[B], Q[B + 1]]);
  }), g;
}
function fI({
  edge: C,
  edgeIndex: A,
  attributes: I,
  skirtHeight: g,
  newPosition: Q,
  newTexcoord0: B,
  newTriangles: D,
  newNormals: E
}) {
  const s = I.position.value.length, N = A * 2, h = N + 1;
  Q.set(I.position.value.subarray(C[0] * 3, C[0] * 3 + 3), N * 3), Q[N * 3 + 2] = Q[N * 3 + 2] - g, Q.set(I.position.value.subarray(C[1] * 3, C[1] * 3 + 3), h * 3), Q[h * 3 + 2] = Q[h * 3 + 2] - g, B.set(I.texcoord.value.subarray(C[0] * 2, C[0] * 2 + 2), N * 2), B.set(I.texcoord.value.subarray(C[1] * 2, C[1] * 2 + 2), h * 2);
  const R = A * 2 * 3;
  D[R] = C[0], D[R + 1] = s / 3 + h, D[R + 2] = C[1], D[R + 3] = s / 3 + h, D[R + 4] = C[0], D[R + 5] = s / 3 + N, E[R] = 0, E[R + 1] = 0, E[R + 2] = 1, E[R + 3] = 0, E[R + 4] = 0, E[R + 5] = 1;
}
function uI(C, A = !0) {
  if (C.length < 4)
    throw new Error(`DEM array must > 4, got ${C.length}!`);
  const I = Math.floor(Math.sqrt(C.length)), g = I, Q = I, B = XA(Q, g), D = TI(C, Q, g);
  return A ? PA(D, B, 1) : { attributes: D, indices: B };
}
function TI(C, A, I) {
  const g = I * A, Q = new Float32Array(g * 3), B = new Float32Array(g * 2);
  let D = 0;
  for (let E = 0; E < A; E++)
    for (let s = 0; s < I; s++) {
      const N = s / (I - 1), h = E / (A - 1);
      B[D * 2] = N, B[D * 2 + 1] = h, Q[D * 3] = N - 0.5, Q[D * 3 + 1] = h - 0.5, Q[D * 3 + 2] = C[(A - E - 1) * I + s], D++;
    }
  return {
    // 顶点位置属性
    position: { value: Q, size: 3 },
    // UV坐标属性
    texcoord: { value: B, size: 2 },
    // 法线属性
    normal: { value: bA(Q, XA(A, I)), size: 3 }
  };
}
function XA(C, A) {
  const I = 6 * (A - 1) * (C - 1), g = new Uint16Array(I);
  let Q = 0;
  for (let B = 0; B < C - 1; B++)
    for (let D = 0; D < A - 1; D++) {
      const E = B * A + D, s = E + 1, N = E + A, h = N + 1, R = Q * 6;
      g[R] = E, g[R + 1] = s, g[R + 2] = N, g[R + 3] = N, g[R + 4] = s, g[R + 5] = h, Q++;
    }
  return g;
}
function bA(C, A) {
  const I = new Float32Array(C.length);
  for (let g = 0; g < A.length; g += 3) {
    const Q = A[g] * 3, B = A[g + 1] * 3, D = A[g + 2] * 3, E = C[Q], s = C[Q + 1], N = C[Q + 2], h = C[B], R = C[B + 1], G = C[B + 2], y = C[D], F = C[D + 1], w = C[D + 2], k = h - E, t = R - s, a = G - N, M = y - E, S = F - s, c = w - N, J = t * c - a * S, n = a * M - k * c, r = k * S - t * M, e = Math.sqrt(J * J + n * n + r * r), d = [0, 0, 1];
    if (e > 0) {
      const U = 1 / e;
      d[0] = J * U, d[1] = n * U, d[2] = r * U;
    }
    for (let U = 0; U < 3; U++)
      I[Q + U] = I[B + U] = I[D + U] = d[U];
  }
  return I;
}
class kA extends SA {
  type = "TileGeometry";
  /**
   * set attribute data to geometry
   * @param data geometry data
   * @returns this
   */
  setData(A) {
    A instanceof Float32Array && (A = uI(A, !0)), A = PA(A.attributes, A.indices, 10), this.setIndex(new wA(A.indices, 1));
    const { attributes: I } = A;
    return this.setAttribute("position", new wA(I.position.value, I.position.size)), this.setAttribute("uv", new wA(I.texcoord.value, I.texcoord.size)), this.setAttribute("normal", new wA(I.normal.value, I.normal.size)), this.computeBoundingBox(), this.computeBoundingSphere(), this;
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
class mI {
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
    const I = A - 1;
    if (I & I - 1)
      throw new Error(`Expected grid size to be 2^n+1, got ${A}.`);
    this.numTriangles = I * I * 2 - 2, this.numParentTriangles = this.numTriangles - I * I, this.indices = new Uint32Array(this.gridSize * this.gridSize), this.coords = new Uint16Array(this.numTriangles * 4);
    for (let g = 0; g < this.numTriangles; g++) {
      let Q = g + 2, B = 0, D = 0, E = 0, s = 0, N = 0, h = 0;
      for (Q & 1 ? E = s = N = I : B = D = h = I; (Q >>= 1) > 1; ) {
        const G = B + E >> 1, y = D + s >> 1;
        Q & 1 ? (E = B, s = D, B = N, D = h) : (B = E, D = s, E = N, s = h), N = G, h = y;
      }
      const R = g * 4;
      this.coords[R + 0] = B, this.coords[R + 1] = D, this.coords[R + 2] = E, this.coords[R + 3] = s;
    }
  }
  createTile(A) {
    return new pI(A, this);
  }
}
class pI {
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
  constructor(A, I) {
    const g = I.gridSize;
    if (A.length !== g * g)
      throw new Error(
        `Expected terrain data of length ${g * g} (${g} x ${g}), got ${A.length}.`
      );
    this.terrain = A, this.martini = I, this.errors = new Float32Array(A.length), this.update();
  }
  update() {
    const { numTriangles: A, numParentTriangles: I, coords: g, gridSize: Q } = this.martini, { terrain: B, errors: D } = this;
    for (let E = A - 1; E >= 0; E--) {
      const s = E * 4, N = g[s + 0], h = g[s + 1], R = g[s + 2], G = g[s + 3], y = N + R >> 1, F = h + G >> 1, w = y + F - h, k = F + N - y, t = (B[h * Q + N] + B[G * Q + R]) / 2, a = F * Q + y, M = Math.abs(t - B[a]);
      if (D[a] = Math.max(D[a], M), E < I) {
        const S = (h + k >> 1) * Q + (N + w >> 1), c = (G + k >> 1) * Q + (R + w >> 1);
        D[a] = Math.max(D[a], D[S], D[c]);
      }
    }
  }
  getGeometryData(A = 0) {
    const { gridSize: I, indices: g } = this.martini, { errors: Q } = this;
    let B = 0, D = 0;
    const E = I - 1;
    let s, N, h = 0;
    g.fill(0);
    function R(a, M, S, c, J, n) {
      const r = a + S >> 1, e = M + c >> 1;
      Math.abs(a - J) + Math.abs(M - n) > 1 && Q[e * I + r] > A ? (R(J, n, a, M, r, e), R(S, c, J, n, r, e)) : (s = M * I + a, N = c * I + S, h = n * I + J, g[s] === 0 && (g[s] = ++B), g[N] === 0 && (g[N] = ++B), g[h] === 0 && (g[h] = ++B), D++);
    }
    R(0, 0, E, E, E, 0), R(E, E, 0, 0, 0, E);
    const G = B * 2, y = D * 3, F = new Uint16Array(G), w = new Uint32Array(y);
    let k = 0;
    function t(a, M, S, c, J, n) {
      const r = a + S >> 1, e = M + c >> 1;
      if (Math.abs(a - J) + Math.abs(M - n) > 1 && Q[e * I + r] > A)
        t(J, n, a, M, r, e), t(S, c, J, n, r, e);
      else {
        const d = g[M * I + a] - 1, U = g[c * I + S] - 1, x = g[n * I + J] - 1;
        F[2 * d] = a, F[2 * d + 1] = M, F[2 * U] = S, F[2 * U + 1] = c, F[2 * x] = J, F[2 * x + 1] = n, w[k++] = d, w[k++] = U, w[k++] = x;
      }
    }
    return t(0, 0, E, E, E, 0), t(E, E, 0, 0, 0, E), {
      attributes: this._getMeshAttributes(this.terrain, F, w),
      indices: w
    };
  }
  _getMeshAttributes(A, I, g) {
    const Q = Math.floor(Math.sqrt(A.length)), B = Q - 1, D = I.length / 2, E = new Float32Array(D * 3), s = new Float32Array(D * 2);
    for (let h = 0; h < D; h++) {
      const R = I[h * 2], G = I[h * 2 + 1], y = G * Q + R;
      E[3 * h + 0] = R / B - 0.5, E[3 * h + 1] = 0.5 - G / B, E[3 * h + 2] = A[y], s[2 * h + 0] = R / B, s[2 * h + 1] = 1 - G / B;
    }
    const N = bA(E, g);
    return {
      position: { value: E, size: 3 },
      texcoord: { value: s, size: 2 },
      normal: { value: N, size: 3 }
    };
  }
}
class jA {
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
    const { source: I, x: g, y: Q, z: B } = A, { url: D, clipBounds: E } = cA(I, g, Q, B);
    if (!D)
      return new kA();
    const s = await this.doLoad(D, { source: I, x: g, y: Q, z: B, bounds: E });
    return T.manager.parseEnd(D), s;
  }
}
class VA extends LI {
  constructor(A = {}) {
    super({ transparent: !0, side: cI, ...A });
  }
  setTexture(A) {
    this.map = A, this.needsUpdate = !0;
  }
  dispose() {
    const A = this.map;
    A && (A.image instanceof ImageBitmap && A.image.close(), A.dispose());
  }
}
var DA = /* @__PURE__ */ ((C) => (C[C.Unknown = 0] = "Unknown", C[C.Point = 1] = "Point", C[C.Linestring = 2] = "Linestring", C[C.Polygon = 3] = "Polygon", C))(DA || {});
class Og {
  /**
   * 渲染矢量数据
   * @param ctx 渲染上下文
   * @param type 元素类型
   * @param feature 元素
   * @param style 样式
   * @param scale 拉伸倍数
   */
  render(A, I, g, Q, B = 1) {
    switch (A.lineCap = "round", A.lineJoin = "round", (Q.shadowBlur ?? 0) > 0 && (A.shadowBlur = Q.shadowBlur ?? 2, A.shadowColor = Q.shadowColor ?? "black", A.shadowOffsetX = Q.shadowOffset ? Q.shadowOffset[0] : 0, A.shadowOffsetY = Q.shadowOffset ? Q.shadowOffset[1] : 0), I) {
      case DA.Point:
        A.textAlign = "center", A.textBaseline = "middle", A.font = Q.font ?? "14px Arial", A.fillStyle = Q.fontColor ?? "white", this._renderPointText(A, g, B, Q.textField ?? "name", Q.fontOffset ?? [0, -8]);
        break;
      case DA.Linestring:
        this._renderLineString(A, g, B);
        break;
      case DA.Polygon:
        this._renderPolygon(A, g, B);
        break;
      default:
        console.warn(`Unknown feature type: ${I}`);
    }
    (Q.fill || I === DA.Point) && (A.globalAlpha = Q.fillOpacity || 0.5, A.fillStyle = Q.fillColor || Q.color || "#3388ff", A.fill(Q.fillRule || "evenodd")), (Q.stroke ?? !0) && (Q.weight ?? 1) > 0 && (A.globalAlpha = Q.opacity || 1, A.lineWidth = Q.weight || 1, A.strokeStyle = Q.color || "#3388ff", A.setLineDash(Q.dashArray || []), A.stroke());
  }
  // 渲染点要素
  _renderPointText(A, I, g = 1, Q = "name", B = [0, 0]) {
    const D = I.geometry;
    A.beginPath();
    for (const s of D)
      for (let N = 0; N < s.length; N++) {
        const h = s[N];
        A.arc(h.x * g, h.y * g, 2, 0, 2 * Math.PI);
      }
    const E = I.properties;
    E && E[Q] && A.fillText(
      E[Q],
      D[0][0].x * g + B[0],
      D[0][0].y * g + B[1]
    );
  }
  // 渲染线要素
  _renderLineString(A, I, g) {
    const Q = I.geometry;
    A.beginPath();
    for (const B of Q)
      for (let D = 0; D < B.length; D++) {
        const { x: E, y: s } = B[D];
        D === 0 ? A.moveTo(E * g, s * g) : A.lineTo(E * g, s * g);
      }
  }
  // 渲染面要素
  _renderPolygon(A, I, g) {
    const Q = I.geometry;
    A.beginPath();
    for (let B = 0; B < Q.length; B++) {
      const D = Q[B];
      for (let E = 0; E < D.length; E++) {
        const { x: s, y: N } = D[E];
        E === 0 ? A.moveTo(s * g, N * g) : A.lineTo(s * g, N * g);
      }
      A.closePath();
    }
  }
}
class ZI {
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
    const { source: I, x: g, y: Q, z: B } = A, D = new VA(), { url: E, clipBounds: s } = cA(I, g, Q, B);
    if (E) {
      const N = await this.doLoad(E, { source: I, x: g, y: Q, z: B, bounds: s });
      D.map = N, T.manager.parseEnd(E);
    }
    return D;
  }
}
class Wg {
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
    const I = this._creatCanvasContext(256, 256);
    this.drawTile(I, A);
    const g = new TA(I.canvas.transferToImageBitmap());
    return new VA({
      transparent: !0,
      map: g,
      opacity: A.source.opacity
    });
  }
  _creatCanvasContext(A, I) {
    const Q = new OffscreenCanvas(A, I).getContext("2d");
    if (!Q)
      throw new Error("create canvas context failed");
    return Q.scale(1, -1), Q.translate(0, -I), Q;
  }
}
class PI extends ZI {
  info = {
    version: "0.10.0",
    description: "Tile image loader. It can load xyz tile image."
  };
  dataType = "image";
  loader = new MA(T.manager);
  /**
   * 加载图像资源的方法
   *
   * @param url 图像资源的URL
   * @param params 加载参数，包括x, y, z坐标和裁剪边界clipBounds
   * @returns 返回一个Promise对象，解析为HTMLImageElement类型。
   */
  async doLoad(A, I) {
    const g = await this.loader.loadAsync(A), Q = new fA();
    Q.colorSpace = uA;
    const { bounds: B } = I;
    return B[2] - B[0] < 1 ? Q.image = XI(g, B) : Q.image = g, Q.needsUpdate = !0, Q;
  }
}
function XI(C, A) {
  const I = C.width, g = new OffscreenCanvas(I, I), Q = g.getContext("2d"), { sx: B, sy: D, sw: E, sh: s } = LA(A, C.width);
  return Q.drawImage(C, B, D, E, s, 0, 0, I, I), g;
}
Yg(new PI());
class zA {
  constructor(A = 4) {
    this.pool = A, this.queue = [], this.workers = [], this.workersResolve = [], this.workerStatus = 0;
  }
  _initWorker(A) {
    if (!this.workers[A]) {
      const I = this.workerCreator();
      I.addEventListener("message", this._onMessage.bind(this, A)), this.workers[A] = I;
    }
  }
  _getIdleWorker() {
    for (let A = 0; A < this.pool; A++)
      if (!(this.workerStatus & 1 << A)) return A;
    return -1;
  }
  _onMessage(A, I) {
    const g = this.workersResolve[A];
    if (g && g(I), this.queue.length) {
      const { resolve: Q, msg: B, transfer: D } = this.queue.shift();
      this.workersResolve[A] = Q, this.workers[A].postMessage(B, D);
    } else
      this.workerStatus ^= 1 << A;
  }
  setWorkerCreator(A) {
    this.workerCreator = A;
  }
  setWorkerLimit(A) {
    this.pool = A;
  }
  postMessage(A, I) {
    return new Promise((g) => {
      const Q = this._getIdleWorker();
      Q !== -1 ? (this._initWorker(Q), this.workerStatus |= 1 << Q, this.workersResolve[Q] = g, this.workers[Q].postMessage(A, I)) : this.queue.push({ resolve: g, msg: A, transfer: I });
    });
  }
  dispose() {
    this.workers.forEach((A) => A.terminate()), this.workersResolve.length = 0, this.workers.length = 0, this.queue.length = 0, this.workerStatus = 0;
  }
}
const bI = "data:application/wasm;base64,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Tg0AA0AgCiACQQN0ai8BAEUNASACQQFqIgIgA0cNAAsgAyECDAELIAIhBSACIANODQEDQCAKIAVBA3RqLwEADQIgBUEBaiIFIANHDQALCyADIAJrIgUgCSAFIAlKIgUbIQkgAiAIIAUbIQgMAgsgBSACayILIAkgCSALSCILGyEJIAIgCCALGyEIIAMgBSICSg0ACwsgAyAJayAAIARrSARAIAYgCCAJajYCFCAGIAMgCGoiADYCECAGKAIUIQQLQQAhAiAAIARMDQAgACAEayIFQQFxIQkCQCAEQQFqIABGBEBBACEADAELIAVBfnEhBUEAIQADQCAAIAogBEEAIAMgAyAEShtrQQN0ai8BACIIIAAgCEobIgAgCiAEQQFqIghBACADIAMgCEoba0EDdGovAQAiCCAAIAhKGyEAIARBAmohBCACQQJqIgIgBUcNAAsLIAkEQCAAIAogBEEAIAMgAyAEShtrQQN0ai8BACICIAAgAkobIQALIABBIWsiAkFgTwRAIAYgADYCDAsgAkFfSyECCwJAIAIiCkUNACAHKAIIIQwgBygCBCENIAEgBigCDCILIAcoAhwiDiALIA5IGyIANgIAIAcgBygCEDYCFCAGQX82AhhBACEFQQAhCAJAQQEgAHQiAyAHKAIYIgAgBygCECICa0ECdU0EQAJAIAcoAhQiBSACa0ECdSIJIAMgAyAJSxsiBEUNACAEQQFrIQ8CQCAEQQNxIhBFBEAgAiEADAELIAIhAANAIAAgBi8BGDsBACAAIAYvARo7AQIgBEEBayEEIABBBGohACAIQQFqIgggEEcNAAsLIA9BA0kNAANAIAAgBi8BGDsBACAAIAYvARo7AQIgACAGLwEYOwEEIAAgBi8BGjsBBiAAIAYvARg7AQggACAGLwEaOwEKIAAgBi8BGDsBDCAAIAYvARo7AQ4gAEEQaiEAIARBBGsiBA0ACwsgAyAJSwRAIAUgAyAJa0ECdGohAANAIAUgBigBGDYBACAFQQRqIgUgAEcNAAsgByAANgIUDAILIAcgAiADQQJ0ajYCFAwBCyACBEAgByACNgIUIAIQBiAHQQA2AhggB0IANwIQQQAhAAsCQCADQYCAgIAETw0AIABBAXUiAiADIAIgA0sbQf////8DIABB/P///wdJGyIAQYCAgIAETw0AIAcgAEECdCIAEAki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QYCAgHxxakGAgIB8cXIiCDYCACADIAQgB2oiB0ECdGoiASAJIAEoAgAiAWpB////A3EgCCABQYCAgHxxakGAgIB8cXIiATYCACAEIAdqIQcgD0ECaiIPIBZHDQALCyAQRQ0AIAMgB0ECdGoiByABIAcoAgAiB2pB////A3EgASAHQYCAgHxxakGAgIB8cXI2AgALIANBBGohAyARQQFqIhEgBEcNAAsLIAVFDQIgBEEBayIBQX5xIRIgAUEBcSEJQQAhESAEQQJJIQgDQAJAIAgNACAAKAIAIQNBACEPQQEhASAEQQJHBEADQCAAIAFBAnRqIgogCigCACIHQYCAgHxxIANqQYCAgHxxIAMgB2oiB0H///8DcXIiAzYCACAKIAMgCigCBCIDQYCAgHxxakGAgIB8cSADIAdqQf///wNxciIDNgIEIAFBAmohASAPQQJqIg8gEkcNAAsLIAlFDQAgACABQQJ0aiIBIAEoAgAiAUGAgIB8cSADakGAgIB8cSABIANqQf///wNxcjYCAAsgACAEQQJ0aiEAIBFBAWoiESAFRw0ACwwCC0GTDEH/CEGaB0GUCBAAAAsgBARAIAVBAmshECAFQQFrIgFBfnEhCiABQQFxIRIgBUECSSEJIAAhAwNAAkAgCQ0AIARBAUcEQEEAIQcgBCEBIBAEQANAIAMgAUEDdGoiCCADIAEgBGtBA3RqKQMAIiMgCCkDACIkfCIlQv////////8HgyAjICRCgICAgICAgHiDfEKAgICAgICAeIOEIiM3AwAgAyABIARqIghBA3RqIgEgJSABKQMAIiR8Qv////////8HgyAjICRCgICAgICAgHiDfEKAgICAgICAeIOENwMAIAQgCGohASAHQQJqIgcgCkcNAAsLIBJFDQEgAyABQQN0aiIHIAMgASAEa0EDdGopAwAiIyAHKQMAIiR8Qv////////8HgyAjICRCgICAgICAgHiDfEKAgICAgICAeIOENwMADAELIAMpAwAhI0EAIQcgBCEBIBAEQANAIAMgAUEDdGoiCCAjIAgpAwAiJHwiJUL/////////B4MgIyAkQoCAgICAgIB4g3xCgICAgICAgHiDhCIjNwMAIAMgASAEaiIIQQN0aiIBICUgASkDACIkfEL/////////B4MgIyAkQoCAgICAgIB4g3xCgICAgICAgHiDhCIjNwMAIAQgCGohASAHQQJqIgcgCkcNAAsLIBJFDQAgAyABQQN0aiIBICMgASkDACIkfEL/////////B4MgIyAkQoCAgICAgIB4g3xCgICAgICAgHiDhDcDAAsgA0EIaiEDIA9BAWoiDyAERw0ACwsgBUUNACAEQQFrIgFBfnEhEiABQQFxIQlBACEPIARBAkkhCANAAkAgCA0AIAApAwAhI0EAIQdBASEDIARBAkcEQANAIAAgA0EDdGoiASABKQMAIiRCgICAgICAgHiDICN8QoCAgICAgIB4gyAjICR8IiVC/////////weDhCIjNwMAIAEgIyABKQMIIiRCgICAgICAgHiDfEKAgICAgICAeIMgJCAlfEL/////////B4OEIiM3AwggA0ECaiEDIAdBAmoiByASRw0ACwsgCUUNACAAIANBA3RqIgEgASkDACIkQoCAgICAgIB4gyAjfEKAgICAgICAeIMgIyAkfEL/////////B4OENwMACyAAIARBA3RqIQAgD0EBaiIPIAVHDQALCyAfQQVGBEAgBiAaEFALIBgEQCAYIAY2AgAMAQsgBhAGCyAGQQBHDAILQY4LQbwIQfIEQZQIEAAACwwECyEeDAELAn8gDEEMaiEVQQAhDiAAQQJJBEAgDCgCFCIKIAwoAhAiEmsiA0EDdSIPIB8QLEYEQEEBIABBAkZBAXQgAEEBRhshHgJAIA8gBCAFbCIYbBASIgFFDQAgGARAIA9BASAPQQFLGyIAQX5xIQkgAEEBcSEIIAwoAhAhFkEAIREgA0EQSSEHA0ACQCAKIBJGDQBBACEAQQAhECAHRQRAA0AgASAWIABBA3QiBmoiAygCACAOamogAygCBCARai0AADoAACABIBYgBkEIcmoiAygCACAOamogAygCBCARai0AADoAACAAQQJqIQAgEEECaiIQIAlHDQALCyAIRQ0AIAEgFiAAQQN0aiIAKAIAIA5qaiAAKAIEIBFqLQAAOgAACyAOIA9qIQ4gEUEBaiIRIBhHDQALCyABIQBBACERAkAgHkUNAAJAAkACQCAfQQVrDgIAAgELAkAgHkECRw0AIAVFDQAgBEEBcSEWIARBAmtBfnEhECAEQQNJIQogACEDA0ACQCAKDQAgAygCBCEOQQAhD0ECIQYgBEEDRwRAA0AgAyAGQQJ0IhJqIgcgBygCACIHQYCAgHxxIA5qQYCAgHxxIAcgDmoiCUH///8DcXIiCDYCACADIBJBBHJqIgcgBygCACIHQYCAgHxxIAhqQYCAgHxxIAcgCWpB////A3FyIg42AgAgBkECaiEGIA9BAmoiDyAQRw0ACwsgFkUNACADIAZBAnRqIgYgBigCACIGQYCAgHxxIA5qQYCAgHxxIAYgDmpB////A3FyNgIACyADIARBAnRqIQMgEUEBaiIRIAVHDQALCyAeQQBMDQIgBUUNAiAEQQFrIgNBfnEhCiADQQFxIRJBACERIARBAkkhCQNAAkAgCQ0AIAAoAgAhDkEAIQ9BASEGIARBAkcEQANAIAAgBkECdGoiECAQKAIAIgNBgICAfHEgDmpBgICAfHEgAyAOaiIIQf///wNxciIHNgIAIBAgByAQKAIEIgNBgICAfHFqQYCAgHxxIAMgCGpB////A3FyIg42AgQgBkECaiEGIA9BAmoiDyAKRw0ACwsgEkUNACAAIAZBAnRqIgMgAygCACIDQYCAgHxxIA5qQYCAgHxxIAMgDmpB////A3FyNgIACyAAIARBAnRqIQAgEUEBaiIRIAVHDQALDAILQZMMQf8IQYEGQasLEAAACwJAIB5BAkcNACAFRQ0AIARBAXEhCiAEQQJrQX5xIRIgBEEDSSEJIAAhBgNAAkAgCQ0AIAYpAwghI0EAIQNBAiEOIARBA0cEQANAIAYgDkEDdCIIaiIHIAcpAwAiJEKAgICAgICAeIMgI3xCgICAgICAgHiDICMgJHwiJUL/////////B4OEIiM3AwAgBiAIQQhyaiIHICMgBykDACIkQoCAgICAgIB4g3xCgICAgICAgHiDICQgJXxC/////////weDhCIjNwMAIA5BAmohDiADQQJqIgMgEkcNAAsLIApFDQAgBiAOQQN0aiIDIAMpAwAiJEKAgICAgICAeIMgI3xCgICAgICAgHiDICMgJHxC/////////weDhDcDAAsgBiAEQQN0aiEGIBFBAWoiESAFRw0ACwsgHkEATA0AIAVFDQAgBEEBayIDQX5xIQkgA0EBcSEIQQAhBiAEQQJJIQcDQAJAIAcNACAAKQMAISNBACEDQQEhDiAEQQJHBEADQCAAIA5BA3RqIhIgEikDACIkQoCAgICAgIB4gyAjfEKAgICAgICAeIMgIyAkfCIlQv////////8Hg4QiIzcDACASICMgEikDCCIkQoCAgICAgIB4g3xCgICAgICAgHiDICQgJXxC/////////weDhCIjNwMIIA5BAmohDiADQQJqIgMgCUcNAAsLIAhFDQAgACAOQQN0aiIDIAMpAwAiJEKAgICAgICAeIMgI3xCgICAgICAgHiDICMgJHxC/////////weDhDcDAAsgACAEQQN0aiEAIAZBAWoiBiAFRw0ACwsgH0EFRgRAIAEgGBBQCyAVBEAgFSABNgIADAELIAEQBgsgAUEARwwCCwsMAwshHgsgDCgCECIAIAtHBEBBACEDIAAhCwNAIAsgA0EDdGooAgQQBiADQQFqIgMgDCgCFCAMKAIQIgtrQQN1SQ0ACwsgDCALNgIUIAwoAgwiAARAIAIgACAaICBsEAgaIAAQBgsgHgshASAMKAIQIgAEQCAAEAYLIAxBIGokACABDwtBBBACIgBB0As2AgAgAEG8EkEAEAEAC9cBAQV/AkAgAUUNACABQQFHBEAgAUF+cSEFA0AgACADQQJ0IgZqIgIgAigCACICQQF2QYCAgPwHcSACQf///wNxciACQQh0QYCAgIB4cXI2AgAgACAGQQRyaiICIAIoAgAiAkEBdkGAgID8B3EgAkH///8DcXIgAkEIdEGAgICAeHFyNgIAIANBAmohAyAEQQJqIgQgBUcNAAsLIAFBAXFFDQAgACADQQJ0aiIAIAAoAgAiAEEBdkGAgID8B3EgAEH///8DcXIgAEEIdEGAgICAeHFyNgIACwsLACAAEFIaIAAQBgsxAQJ/IABB7BU2AgAgACgCBEEMayIBIAEoAghBAWsiAjYCCCACQQBIBEAgARAGCyAAC90BAQR/IABBADYCCCAAQgA3AgACQCABBEAgAUGAgICABE8NASAAIAFBAnQiBBAJIgM2AgAgACADIARqIgQ2AgggAUEBa0H/////A3EhBSACKAIAIQIgAUEHcSIGBEBBACEBA0AgAyACNgIAIANBBGohAyABQQFqIgEgBkcNAAsLIAVBB08EQANAIAMgAjYCHCADIAI2AhggAyACNgIUIAMgAjYCECADIAI2AgwgAyACNgIIIAMgAjYCBCADIAI2AgAgA0EgaiIDIARHDQALCyAAIAQ2AgQLIAAPCxAKAAuaAQAgAEEBOgA1AkAgACgCBCACRw0AIABB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QmxvY2tTZXF1ZW5jZQByZXN0b3JlU2VxdWVuY2UAQXNzZXJ0aW9uIGZhaWxlZABzdGQ6OmJhZF9hbGxvYwBwcEJ5dGVbMF0gPT0gSFVGRk1BTl9OT1JNQUwAc2l6ZSA+IDAAUHVyZSB2aXJ0dWFsIGZ1bmN0aW9uIGNhbGxlZCEAQ250WkltYWdlIABMZXJjMiAAAAAAAAAAAHAGAAABAAAAAgAAAE42TGVyY05TMTBCaXRTdHVmZmVyRQAAALQJAABYBgAAAAAAAOgGAAAFAAAABgAAAAcAAAAIAAAACQAAAE42TGVyY05TOUNudFpJbWFnZUUATjZMZXJjTlM2VEltYWdlSU5TXzRDbnRaRUVFAE42TGVyY05TNUltYWdlRQC0CQAAxAYAANwJAACoBgAA1AYAANwJAACUBgAA3AYAAAAAAADcBgAACgAAAAsAAAAMAAAACAAAAAkAAAAAAAAAMAcAAA0AAAAOAAAATjZMZXJjTlM1TGVyYzJFALQJAAAgBwAAAAAAAGAHAAAPAAAAEAAAAE42TGVyY05TMTFCaXRTdHVmZmVyMkUAALQJAABIBwAAAAAAAIwHAAARAAAAEgAAAE42TGVyY05TN0JpdE1hc2tFAAAAtAkAAHgHAABOMTBfX2N4eGFiaXYxMTZfX3NoaW1fdHlwZV9pbmZvRQAAAADcCQAAlAcAAFgLAABOMTBfX2N4eGFiaXYxMTdfX2NsYXNzX3R5cGVfaW5mb0UAAADcCQAAxAcAALgHAABOMTBfX2N4eGFiaXYxMTdfX3BiYXNlX3R5cGVfaW5mb0UAAADcCQAA9AcAALgHAABOMTBfX2N4eGFiaXYxMTlfX3BvaW50ZXJfdHlwZV9pbmZvRQDcCQAAJAgAABgIAABOMTBfX2N4eGFiaXYxMjBfX2Z1bmN0aW9uX3R5cGVfaW5mb0UAAAAA3AkAAFQIAAC4BwAATjEwX19jeHhhYml2MTI5X19wb2ludGVyX3RvX21lbWJlcl90eXBlX2luZm9FAAAA3AkAAIgIAAAYCAAAAAAAAAgJAAATAAAAFAAAABUAAAAWAAAAFwAAAE4xMF9fY3h4YWJpdjEyM19fZnVuZGFtZW50YWxfdHlwZV9pbmZvRQDcCQAA4AgAALgHAAB2AAAAzAgAABQJAABEbgAAzAgAACAJAABjAAAAzAgAACwJAABQS2MAOAoAADgJAAABAAAAMAkAAGgAAADMCAAATAkAAGEAAADMCAAAWAkAAHMAAADMCAAAZAkAAHQAAADMCAAAcAkAAGkAAADMCAAAfAkAAGoAAADMCAAAiAkAAGYAAADMCAAAlAkAAGQAAADMCAAAoAkAAAAAAADoBwAAEwAAABgAAAAVAAAAFgAAABkAAAAaAAAAGwAAABwAAAAAAAAAJAoAABMAAAAdAAAAFQAAABYAAAAZAAAAHgAAAB8AAAAgAAAATjEwX19jeHhhYml2MTIwX19zaV9jbGFzc190eXBlX2luZm9FAAAAANwJAAD8CQAA6AcAAAAAAABICAAAEwAAACEAAAAVAAAAFgAAACIAAAAAAAAAsAoAAAQAAAAjAAAAJAAAAAAAAADYCgAABAAAACUAAAAmAAAAAAAAAJgKAAAEAAAAJwAAACgAAABTdDlleGNlcHRpb24AAAAAtAkAAIgKAABTdDliYWRfYWxsb2MAAAAA3AkAAKAKAACYCgAAU3QyMGJhZF9hcnJheV9uZXdfbGVuZ3RoAAAAANwJAAC8CgAAsAoAAAAAAAAICwAAAwAAACkAAAAqAAAAU3QxMWxvZ2ljX2Vycm9yANwJAAD4CgAAmAoAAAAAAAA8CwAAAwAAACsAAAAqAAAAU3QxMmxlbmd0aF9lcnJvcgAAAADcCQAAKAsAAAgLAABTdDl0eXBlX2luZm8AAAAAtAkAAEgLAEHgFgsDYA1Q";
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
var jI = (() => {
  var C = import.meta.url;
  return function(I) {
    I = I || {};
    var I = typeof I < "u" ? I : {}, g, Q;
    I.ready = new Promise(function(i, o) {
      g = i, Q = o;
    });
    var B = Object.assign({}, I), D = typeof window == "object", E = typeof importScripts == "function", s = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string", N = "";
    function h(i) {
      return I.locateFile ? I.locateFile(i, N) : N + i;
    }
    var R, G, y, F, w, k;
    s ? (E ? N = require("path").dirname(N) + "/" : N = __dirname + "/", k = () => {
      w || (F = require("fs"), w = require("path"));
    }, R = function(o, L) {
      return k(), o = w.normalize(o), F.readFileSync(o, L ? void 0 : "utf8");
    }, y = (i) => {
      var o = R(i, !0);
      return o.buffer || (o = new Uint8Array(o)), o;
    }, G = (i, o, L) => {
      k(), i = w.normalize(i), F.readFile(i, function(q, m) {
        q ? L(q) : o(m.buffer);
      });
    }, process.argv.length > 1 && process.argv[1].replace(/\\/g, "/"), process.argv.slice(2), process.on("uncaughtException", function(i) {
      if (!(i instanceof tI))
        throw i;
    }), process.on("unhandledRejection", function(i) {
      throw i;
    }), I.inspect = function() {
      return "[Emscripten Module object]";
    }) : (D || E) && (E ? N = self.location.href : typeof document < "u" && document.currentScript && (N = document.currentScript.src), C && (N = C), N.indexOf("blob:") !== 0 ? N = N.substr(
      0,
      N.replace(/[?#].*/, "").lastIndexOf("/") + 1
    ) : N = "", R = (i) => {
      var o = new XMLHttpRequest();
      return o.open("GET", i, !1), o.send(null), o.responseText;
    }, E && (y = (i) => {
      var o = new XMLHttpRequest();
      return o.open("GET", i, !1), o.responseType = "arraybuffer", o.send(null), new Uint8Array(o.response);
    }), G = (i, o, L) => {
      var q = new XMLHttpRequest();
      q.open("GET", i, !0), q.responseType = "arraybuffer", q.onload = () => {
        if (q.status == 200 || q.status == 0 && q.response) {
          o(q.response);
          return;
        }
        L();
      }, q.onerror = L, q.send(null);
    }), I.print || console.log.bind(console);
    var t = I.printErr || console.warn.bind(console);
    Object.assign(I, B), B = null, I.arguments, I.thisProgram, I.quit;
    var a;
    I.wasmBinary && (a = I.wasmBinary), I.noExitRuntime, typeof WebAssembly != "object" && z("no native wasm support detected");
    var M, S = !1, c = typeof TextDecoder < "u" ? new TextDecoder("utf8") : void 0;
    function J(i, o, L) {
      for (var q = o + L, m = o; i[m] && !(m >= q); ) ++m;
      if (m - o > 16 && i.buffer && c)
        return c.decode(i.subarray(o, m));
      for (var Z = ""; o < m; ) {
        var Y = i[o++];
        if (!(Y & 128)) {
          Z += String.fromCharCode(Y);
          continue;
        }
        var f = i[o++] & 63;
        if ((Y & 224) == 192) {
          Z += String.fromCharCode((Y & 31) << 6 | f);
          continue;
        }
        var v = i[o++] & 63;
        if ((Y & 240) == 224 ? Y = (Y & 15) << 12 | f << 6 | v : Y = (Y & 7) << 18 | f << 12 | v << 6 | i[o++] & 63, Y < 65536)
          Z += String.fromCharCode(Y);
        else {
          var gA = Y - 65536;
          Z += String.fromCharCode(55296 | gA >> 10, 56320 | gA & 1023);
        }
      }
      return Z;
    }
    function n(i, o) {
      return i ? J(d, i, o) : "";
    }
    var r, e, d, U, x;
    function K(i) {
      r = i, I.HEAP8 = e = new Int8Array(i), I.HEAP16 = new Int16Array(i), I.HEAP32 = U = new Int32Array(i), I.HEAPU8 = d = new Uint8Array(i), I.HEAPU16 = new Uint16Array(i), I.HEAPU32 = x = new Uint32Array(i), I.HEAPF32 = new Float32Array(i), I.HEAPF64 = new Float64Array(i);
    }
    I.INITIAL_MEMORY;
    var H, l = [], O = [], p = [];
    function X() {
      if (I.preRun)
        for (typeof I.preRun == "function" && (I.preRun = [I.preRun]); I.preRun.length; )
          V(I.preRun.shift());
      GA(l);
    }
    function QA() {
      GA(O);
    }
    function AA() {
      if (I.postRun)
        for (typeof I.postRun == "function" && (I.postRun = [I.postRun]); I.postRun.length; )
          CA(I.postRun.shift());
      GA(p);
    }
    function V(i) {
      l.unshift(i);
    }
    function IA(i) {
      O.unshift(i);
    }
    function CA(i) {
      p.unshift(i);
    }
    var b = 0, _ = null;
    function oA(i) {
      b++, I.monitorRunDependencies && I.monitorRunDependencies(b);
    }
    function j(i) {
      if (b--, I.monitorRunDependencies && I.monitorRunDependencies(b), b == 0 && _) {
        var o = _;
        _ = null, o();
      }
    }
    function z(i) {
      I.onAbort && I.onAbort(i), i = "Aborted(" + i + ")", t(i), S = !0, i += ". Build with -sASSERTIONS for more info.";
      var o = new WebAssembly.RuntimeError(i);
      throw Q(o), o;
    }
    var BA = "data:application/octet-stream;base64,";
    function sA(i) {
      return i.startsWith(BA);
    }
    function RA(i) {
      return i.startsWith("file://");
    }
    var W;
    I.locateFile ? (W = "lerc-wasm.wasm", sA(W) || (W = h(W))) : W = new URL("data:application/wasm;base64,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Tg0AA0AgCiACQQN0ai8BAEUNASACQQFqIgIgA0cNAAsgAyECDAELIAIhBSACIANODQEDQCAKIAVBA3RqLwEADQIgBUEBaiIFIANHDQALCyADIAJrIgUgCSAFIAlKIgUbIQkgAiAIIAUbIQgMAgsgBSACayILIAkgCSALSCILGyEJIAIgCCALGyEIIAMgBSICSg0ACwsgAyAJayAAIARrSARAIAYgCCAJajYCFCAGIAMgCGoiADYCECAGKAIUIQQLQQAhAiAAIARMDQAgACAEayIFQQFxIQkCQCAEQQFqIABGBEBBACEADAELIAVBfnEhBUEAIQADQCAAIAogBEEAIAMgAyAEShtrQQN0ai8BACIIIAAgCEobIgAgCiAEQQFqIghBACADIAMgCEoba0EDdGovAQAiCCAAIAhKGyEAIARBAmohBCACQQJqIgIgBUcNAAsLIAkEQCAAIAogBEEAIAMgAyAEShtrQQN0ai8BACICIAAgAkobIQALIABBIWsiAkFgTwRAIAYgADYCDAsgAkFfSyECCwJAIAIiCkUNACAHKAIIIQwgBygCBCENIAEgBigCDCILIAcoAhwiDiALIA5IGyIANgIAIAcgBygCEDYCFCAGQX82AhhBACEFQQAhCAJAQQEgAHQiAyAHKAIYIgAgBygCECICa0ECdU0EQAJAIAcoAhQiBSACa0ECdSIJIAMgAyAJSxsiBEUNACAEQQFrIQ8CQCAEQQNxIhBFBEAgAiEADAELIAIhAANAIAAgBi8BGDsBACAAIAYvARo7AQIgBEEBayEEIABBBGohACAIQQFqIgggEEcNAAsLIA9BA0kNAANAIAAgBi8BGDsBACAAIAYvARo7AQIgACAGLwEYOwEEIAAgBi8BGjsBBiAAIAYvARg7AQggACAGLwEaOwEKIAAgBi8BGDsBDCAAIAYvARo7AQ4gAEEQaiEAIARBBGsiBA0ACwsgAyAJSwRAIAUgAyAJa0ECdGohAANAIAUgBigBGDYBACAFQQRqIgUgAEcNAAsgByAANgIUDAILIAcgAiADQQJ0ajYCFAwBCyACBEAgByACNgIUIAIQBiAHQQA2AhggB0IANwIQQQAhAAsCQCADQYCAgIAETw0AIABBAXUiAiADIAIgA0sbQf////8DIABB/P///wdJGyIAQYCAgIAETw0AIAcgAEECdCIAEAki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QYCAgHxxakGAgIB8cXIiCDYCACADIAQgB2oiB0ECdGoiASAJIAEoAgAiAWpB////A3EgCCABQYCAgHxxakGAgIB8cXIiATYCACAEIAdqIQcgD0ECaiIPIBZHDQALCyAQRQ0AIAMgB0ECdGoiByABIAcoAgAiB2pB////A3EgASAHQYCAgHxxakGAgIB8cXI2AgALIANBBGohAyARQQFqIhEgBEcNAAsLIAVFDQIgBEEBayIBQX5xIRIgAUEBcSEJQQAhESAEQQJJIQgDQAJAIAgNACAAKAIAIQNBACEPQQEhASAEQQJHBEADQCAAIAFBAnRqIgogCigCACIHQYCAgHxxIANqQYCAgHxxIAMgB2oiB0H///8DcXIiAzYCACAKIAMgCigCBCIDQYCAgHxxakGAgIB8cSADIAdqQf///wNxciIDNgIEIAFBAmohASAPQQJqIg8gEkcNAAsLIAlFDQAgACABQQJ0aiIBIAEoAgAiAUGAgIB8cSADakGAgIB8cSABIANqQf///wNxcjYCAAsgACAEQQJ0aiEAIBFBAWoiESAFRw0ACwwCC0GTDEH/CEGaB0GUCBAAAAsgBARAIAVBAmshECAFQQFrIgFBfnEhCiABQQFxIRIgBUECSSEJIAAhAwNAAkAgCQ0AIARBAUcEQEEAIQcgBCEBIBAEQANAIAMgAUEDdGoiCCADIAEgBGtBA3RqKQMAIiMgCCkDACIkfCIlQv////////8HgyAjICRCgICAgICAgHiDfEKAgICAgICAeIOEIiM3AwAgAyABIARqIghBA3RqIgEgJSABKQMAIiR8Qv////////8HgyAjICRCgICAgICAgHiDfEKAgICAgICAeIOENwMAIAQgCGohASAHQQJqIgcgCkcNAAsLIBJFDQEgAyABQQN0aiIHIAMgASAEa0EDdGopAwAiIyAHKQMAIiR8Qv////////8HgyAjICRCgICAgICAgHiDfEKAgICAgICAeIOENwMADAELIAMpAwAhI0EAIQcgBCEBIBAEQANAIAMgAUEDdGoiCCAjIAgpAwAiJHwiJUL/////////B4MgIyAkQoCAgICAgIB4g3xCgICAgICAgHiDhCIjNwMAIAMgASAEaiIIQQN0aiIBICUgASkDACIkfEL/////////B4MgIyAkQoCAgICAgIB4g3xCgICAgICAgHiDhCIjNwMAIAQgCGohASAHQQJqIgcgCkcNAAsLIBJFDQAgAyABQQN0aiIBICMgASkDACIkfEL/////////B4MgIyAkQoCAgICAgIB4g3xCgICAgICAgHiDhDcDAAsgA0EIaiEDIA9BAWoiDyAERw0ACwsgBUUNACAEQQFrIgFBfnEhEiABQQFxIQlBACEPIARBAkkhCANAAkAgCA0AIAApAwAhI0EAIQdBASEDIARBAkcEQANAIAAgA0EDdGoiASABKQMAIiRCgICAgICAgHiDICN8QoCAgICAgIB4gyAjICR8IiVC/////////weDhCIjNwMAIAEgIyABKQMIIiRCgICAgICAgHiDfEKAgICAgICAeIMgJCAlfEL/////////B4OEIiM3AwggA0ECaiEDIAdBAmoiByASRw0ACwsgCUUNACAAIANBA3RqIgEgASkDACIkQoCAgICAgIB4gyAjfEKAgICAgICAeIMgIyAkfEL/////////B4OENwMACyAAIARBA3RqIQAgD0EBaiIPIAVHDQALCyAfQQVGBEAgBiAaEFALIBgEQCAYIAY2AgAMAQsgBhAGCyAGQQBHDAILQY4LQbwIQfIEQZQIEAAACwwECyEeDAELAn8gDEEMaiEVQQAhDiAAQQJJBEAgDCgCFCIKIAwoAhAiEmsiA0EDdSIPIB8QLEYEQEEBIABBAkZBAXQgAEEBRhshHgJAIA8gBCAFbCIYbBASIgFFDQAgGARAIA9BASAPQQFLGyIAQX5xIQkgAEEBcSEIIAwoAhAhFkEAIREgA0EQSSEHA0ACQCAKIBJGDQBBACEAQQAhECAHRQRAA0AgASAWIABBA3QiBmoiAygCACAOamogAygCBCARai0AADoAACABIBYgBkEIcmoiAygCACAOamogAygCBCARai0AADoAACAAQQJqIQAgEEECaiIQIAlHDQALCyAIRQ0AIAEgFiAAQQN0aiIAKAIAIA5qaiAAKAIEIBFqLQAAOgAACyAOIA9qIQ4gEUEBaiIRIBhHDQALCyABIQBBACERAkAgHkUNAAJAAkACQCAfQQVrDgIAAgELAkAgHkECRw0AIAVFDQAgBEEBcSEWIARBAmtBfnEhECAEQQNJIQogACEDA0ACQCAKDQAgAygCBCEOQQAhD0ECIQYgBEEDRwRAA0AgAyAGQQJ0IhJqIgcgBygCACIHQYCAgHxxIA5qQYCAgHxxIAcgDmoiCUH///8DcXIiCDYCACADIBJBBHJqIgcgBygCACIHQYCAgHxxIAhqQYCAgHxxIAcgCWpB////A3FyIg42AgAgBkECaiEGIA9BAmoiDyAQRw0ACwsgFkUNACADIAZBAnRqIgYgBigCACIGQYCAgHxxIA5qQYCAgHxxIAYgDmpB////A3FyNgIACyADIARBAnRqIQMgEUEBaiIRIAVHDQALCyAeQQBMDQIgBUUNAiAEQQFrIgNBfnEhCiADQQFxIRJBACERIARBAkkhCQNAAkAgCQ0AIAAoAgAhDkEAIQ9BASEGIARBAkcEQANAIAAgBkECdGoiECAQKAIAIgNBgICAfHEgDmpBgICAfHEgAyAOaiIIQf///wNxciIHNgIAIBAgByAQKAIEIgNBgICAfHFqQYCAgHxxIAMgCGpB////A3FyIg42AgQgBkECaiEGIA9BAmoiDyAKRw0ACwsgEkUNACAAIAZBAnRqIgMgAygCACIDQYCAgHxxIA5qQYCAgHxxIAMgDmpB////A3FyNgIACyAAIARBAnRqIQAgEUEBaiIRIAVHDQALDAILQZMMQf8IQYEGQasLEAAACwJAIB5BAkcNACAFRQ0AIARBAXEhCiAEQQJrQX5xIRIgBEEDSSEJIAAhBgNAAkAgCQ0AIAYpAwghI0EAIQNBAiEOIARBA0cEQANAIAYgDkEDdCIIaiIHIAcpAwAiJEKAgICAgICAeIMgI3xCgICAgICAgHiDICMgJHwiJUL/////////B4OEIiM3AwAgBiAIQQhyaiIHICMgBykDACIkQoCAgICAgIB4g3xCgICAgICAgHiDICQgJXxC/////////weDhCIjNwMAIA5BAmohDiADQQJqIgMgEkcNAAsLIApFDQAgBiAOQQN0aiIDIAMpAwAiJEKAgICAgICAeIMgI3xCgICAgICAgHiDICMgJHxC/////////weDhDcDAAsgBiAEQQN0aiEGIBFBAWoiESAFRw0ACwsgHkEATA0AIAVFDQAgBEEBayIDQX5xIQkgA0EBcSEIQQAhBiAEQQJJIQcDQAJAIAcNACAAKQMAISNBACEDQQEhDiAEQQJHBEADQCAAIA5BA3RqIhIgEikDACIkQoCAgICAgIB4gyAjfEKAgICAgICAeIMgIyAkfCIlQv////////8Hg4QiIzcDACASICMgEikDCCIkQoCAgICAgIB4g3xCgICAgICAgHiDICQgJXxC/////////weDhCIjNwMIIA5BAmohDiADQQJqIgMgCUcNAAsLIAhFDQAgACAOQQN0aiIDIAMpAwAiJEKAgICAgICAeIMgI3xCgICAgICAgHiDICMgJHxC/////////weDhDcDAAsgACAEQQN0aiEAIAZBAWoiBiAFRw0ACwsgH0EFRgRAIAEgGBBQCyAVBEAgFSABNgIADAELIAEQBgsgAUEARwwCCwsMAwshHgsgDCgCECIAIAtHBEBBACEDIAAhCwNAIAsgA0EDdGooAgQQBiADQQFqIgMgDCgCFCAMKAIQIgtrQQN1SQ0ACwsgDCALNgIUIAwoAgwiAARAIAIgACAaICBsEAgaIAAQBgsgHgshASAMKAIQIgAEQCAAEAYLIAxBIGokACABDwtBBBACIgBB0As2AgAgAEG8EkEAEAEAC9cBAQV/AkAgAUUNACABQQFHBEAgAUF+cSEFA0AgACADQQJ0IgZqIgIgAigCACICQQF2QYCAgPwHcSACQf///wNxciACQQh0QYCAgIB4cXI2AgAgACAGQQRyaiICIAIoAgAiAkEBdkGAgID8B3EgAkH///8DcXIgAkEIdEGAgICAeHFyNgIAIANBAmohAyAEQQJqIgQgBUcNAAsLIAFBAXFFDQAgACADQQJ0aiIAIAAoAgAiAEEBdkGAgID8B3EgAEH///8DcXIgAEEIdEGAgICAeHFyNgIACwsLACAAEFIaIAAQBgsxAQJ/IABB7BU2AgAgACgCBEEMayIBIAEoAghBAWsiAjYCCCACQQBIBEAgARAGCyAAC90BAQR/IABBADYCCCAAQgA3AgACQCABBEAgAUGAgICABE8NASAAIAFBAnQiBBAJIgM2AgAgACADIARqIgQ2AgggAUEBa0H/////A3EhBSACKAIAIQIgAUEHcSIGBEBBACEBA0AgAyACNgIAIANBBGohAyABQQFqIgEgBkcNAAsLIAVBB08EQANAIAMgAjYCHCADIAI2AhggAyACNgIUIAMgAjYCECADIAI2AgwgAyACNgIIIAMgAjYCBCADIAI2AgAgA0EgaiIDIARHDQALCyAAIAQ2AgQLIAAPCxAKAAuaAQAgAEEBOgA1AkAgACgCBCACRw0AIABB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QmxvY2tTZXF1ZW5jZQByZXN0b3JlU2VxdWVuY2UAQXNzZXJ0aW9uIGZhaWxlZABzdGQ6OmJhZF9hbGxvYwBwcEJ5dGVbMF0gPT0gSFVGRk1BTl9OT1JNQUwAc2l6ZSA+IDAAUHVyZSB2aXJ0dWFsIGZ1bmN0aW9uIGNhbGxlZCEAQ250WkltYWdlIABMZXJjMiAAAAAAAAAAAHAGAAABAAAAAgAAAE42TGVyY05TMTBCaXRTdHVmZmVyRQAAALQJAABYBgAAAAAAAOgGAAAFAAAABgAAAAcAAAAIAAAACQAAAE42TGVyY05TOUNudFpJbWFnZUUATjZMZXJjTlM2VEltYWdlSU5TXzRDbnRaRUVFAE42TGVyY05TNUltYWdlRQC0CQAAxAYAANwJAACoBgAA1AYAANwJAACUBgAA3AYAAAAAAADcBgAACgAAAAsAAAAMAAAACAAAAAkAAAAAAAAAMAcAAA0AAAAOAAAATjZMZXJjTlM1TGVyYzJFALQJAAAgBwAAAAAAAGAHAAAPAAAAEAAAAE42TGVyY05TMTFCaXRTdHVmZmVyMkUAALQJAABIBwAAAAAAAIwHAAARAAAAEgAAAE42TGVyY05TN0JpdE1hc2tFAAAAtAkAAHgHAABOMTBfX2N4eGFiaXYxMTZfX3NoaW1fdHlwZV9pbmZvRQAAAADcCQAAlAcAAFgLAABOMTBfX2N4eGFiaXYxMTdfX2NsYXNzX3R5cGVfaW5mb0UAAADcCQAAxAcAALgHAABOMTBfX2N4eGFiaXYxMTdfX3BiYXNlX3R5cGVfaW5mb0UAAADcCQAA9AcAALgHAABOMTBfX2N4eGFiaXYxMTlfX3BvaW50ZXJfdHlwZV9pbmZvRQDcCQAAJAgAABgIAABOMTBfX2N4eGFiaXYxMjBfX2Z1bmN0aW9uX3R5cGVfaW5mb0UAAAAA3AkAAFQIAAC4BwAATjEwX19jeHhhYml2MTI5X19wb2ludGVyX3RvX21lbWJlcl90eXBlX2luZm9FAAAA3AkAAIgIAAAYCAAAAAAAAAgJAAATAAAAFAAAABUAAAAWAAAAFwAAAE4xMF9fY3h4YWJpdjEyM19fZnVuZGFtZW50YWxfdHlwZV9pbmZvRQDcCQAA4AgAALgHAAB2AAAAzAgAABQJAABEbgAAzAgAACAJAABjAAAAzAgAACwJAABQS2MAOAoAADgJAAABAAAAMAkAAGgAAADMCAAATAkAAGEAAADMCAAAWAkAAHMAAADMCAAAZAkAAHQAAADMCAAAcAkAAGkAAADMCAAAfAkAAGoAAADMCAAAiAkAAGYAAADMCAAAlAkAAGQAAADMCAAAoAkAAAAAAADoBwAAEwAAABgAAAAVAAAAFgAAABkAAAAaAAAAGwAAABwAAAAAAAAAJAoAABMAAAAdAAAAFQAAABYAAAAZAAAAHgAAAB8AAAAgAAAATjEwX19jeHhhYml2MTIwX19zaV9jbGFzc190eXBlX2luZm9FAAAAANwJAAD8CQAA6AcAAAAAAABICAAAEwAAACEAAAAVAAAAFgAAACIAAAAAAAAAsAoAAAQAAAAjAAAAJAAAAAAAAADYCgAABAAAACUAAAAmAAAAAAAAAJgKAAAEAAAAJwAAACgAAABTdDlleGNlcHRpb24AAAAAtAkAAIgKAABTdDliYWRfYWxsb2MAAAAA3AkAAKAKAACYCgAAU3QyMGJhZF9hcnJheV9uZXdfbGVuZ3RoAAAAANwJAAC8CgAAsAoAAAAAAAAICwAAAwAAACkAAAAqAAAAU3QxMWxvZ2ljX2Vycm9yANwJAAD4CgAAmAoAAAAAAAA8CwAAAwAAACsAAAAqAAAAU3QxMmxlbmd0aF9lcnJvcgAAAADcCQAAKAsAAAgLAABTdDl0eXBlX2luZm8AAAAAtAkAAEgLAEHgFgsDYA1Q", import.meta.url).toString();
    function UA(i) {
      try {
        if (i == W && a)
          return new Uint8Array(a);
        if (y)
          return y(i);
        throw "both async and sync fetching of the wasm failed";
      } catch (o) {
        z(o);
      }
    }
    function DI() {
      if (!a && (D || E)) {
        if (typeof fetch == "function" && !RA(W))
          return fetch(W, { credentials: "same-origin" }).then(function(i) {
            if (!i.ok)
              throw "failed to load wasm binary file at '" + W + "'";
            return i.arrayBuffer();
          }).catch(function() {
            return UA(W);
          });
        if (G)
          return new Promise(function(i, o) {
            G(
              W,
              function(L) {
                i(new Uint8Array(L));
              },
              o
            );
          });
      }
      return Promise.resolve().then(function() {
        return UA(W);
      });
    }
    function iI() {
      var i = { a: GI };
      function o(Y, f) {
        var v = Y.exports;
        I.asm = v, M = I.asm.g, K(M.buffer), H = I.asm.m, IA(I.asm.h), j();
      }
      oA();
      function L(Y) {
        o(Y.instance);
      }
      function q(Y) {
        return DI().then(function(f) {
          return WebAssembly.instantiate(f, i);
        }).then(function(f) {
          return f;
        }).then(Y, function(f) {
          t("failed to asynchronously prepare wasm: " + f), z(f);
        });
      }
      function m() {
        return !a && typeof WebAssembly.instantiateStreaming == "function" && !sA(W) && !RA(W) && !s && typeof fetch == "function" ? fetch(W, { credentials: "same-origin" }).then(function(Y) {
          var f = WebAssembly.instantiateStreaming(Y, i);
          return f.then(L, function(v) {
            return t("wasm streaming compile failed: " + v), t("falling back to ArrayBuffer instantiation"), q(L);
          });
        }) : q(L);
      }
      if (I.instantiateWasm)
        try {
          var Z = I.instantiateWasm(i, o);
          return Z;
        } catch (Y) {
          return t("Module.instantiateWasm callback failed with error: " + Y), !1;
        }
      return m().catch(Q), {};
    }
    function GA(i) {
      for (; i.length > 0; ) {
        var o = i.shift();
        if (typeof o == "function") {
          o(I);
          continue;
        }
        var L = o.func;
        typeof L == "number" ? o.arg === void 0 ? rA(L)() : rA(L)(o.arg) : L(o.arg === void 0 ? null : o.arg);
      }
    }
    var NA = [];
    function rA(i) {
      var o = NA[i];
      return o || (i >= NA.length && (NA.length = i + 1), NA[i] = o = H.get(i)), o;
    }
    function oI(i, o, L, q) {
      z(
        "Assertion failed: " + n(i) + ", at: " + [
          o ? n(o) : "unknown filename",
          L,
          q ? n(q) : "unknown function"
        ]
      );
    }
    function sI(i) {
      return eA(i + 24) + 24;
    }
    function RI(i) {
      this.excPtr = i, this.ptr = i - 24, this.set_type = function(o) {
        x[this.ptr + 4 >> 2] = o;
      }, this.get_type = function() {
        return x[this.ptr + 4 >> 2];
      }, this.set_destructor = function(o) {
        x[this.ptr + 8 >> 2] = o;
      }, this.get_destructor = function() {
        return x[this.ptr + 8 >> 2];
      }, this.set_refcount = function(o) {
        U[this.ptr >> 2] = o;
      }, this.set_caught = function(o) {
        o = o ? 1 : 0, e[this.ptr + 12 >> 0] = o;
      }, this.get_caught = function() {
        return e[this.ptr + 12 >> 0] != 0;
      }, this.set_rethrown = function(o) {
        o = o ? 1 : 0, e[this.ptr + 13 >> 0] = o;
      }, this.get_rethrown = function() {
        return e[this.ptr + 13 >> 0] != 0;
      }, this.init = function(o, L) {
        this.set_adjusted_ptr(0), this.set_type(o), this.set_destructor(L), this.set_refcount(0), this.set_caught(!1), this.set_rethrown(!1);
      }, this.add_ref = function() {
        var o = U[this.ptr >> 2];
        U[this.ptr >> 2] = o + 1;
      }, this.release_ref = function() {
        var o = U[this.ptr >> 2];
        return U[this.ptr >> 2] = o - 1, o === 1;
      }, this.set_adjusted_ptr = function(o) {
        x[this.ptr + 16 >> 2] = o;
      }, this.get_adjusted_ptr = function() {
        return x[this.ptr + 16 >> 2];
      }, this.get_exception_ptr = function() {
        var o = JA(this.get_type());
        if (o)
          return x[this.excPtr >> 2];
        var L = this.get_adjusted_ptr();
        return L !== 0 ? L : this.excPtr;
      };
    }
    function NI(i, o, L) {
      var q = new RI(i);
      throw q.init(o, L), i;
    }
    function hI() {
      z("");
    }
    function wI(i, o, L) {
      d.copyWithin(i, o, o + L);
    }
    function aI() {
      return 2147483648;
    }
    function yI(i) {
      try {
        return M.grow(i - r.byteLength + 65535 >>> 16), K(M.buffer), 1;
      } catch {
      }
    }
    function FI(i) {
      var o = d.length;
      i = i >>> 0;
      var L = aI();
      if (i > L)
        return !1;
      let q = (v, gA) => v + (gA - v % gA) % gA;
      for (var m = 1; m <= 4; m *= 2) {
        var Z = o * (1 + 0.2 / m);
        Z = Math.min(Z, i + 100663296);
        var Y = Math.min(
          L,
          q(Math.max(i, Z), 65536)
        ), f = yI(Y);
        if (f)
          return !0;
      }
      return !1;
    }
    var GI = {
      a: oI,
      c: sI,
      b: NI,
      d: hI,
      f: wI,
      e: FI
    };
    iI(), I.___wasm_call_ctors = function() {
      return (I.___wasm_call_ctors = I.asm.h).apply(null, arguments);
    }, I._lerc_getBlobInfo = function() {
      return (I._lerc_getBlobInfo = I.asm.i).apply(null, arguments);
    }, I._lerc_getDataRanges = function() {
      return (I._lerc_getDataRanges = I.asm.j).apply(null, arguments);
    }, I._lerc_decode = function() {
      return (I._lerc_decode = I.asm.k).apply(null, arguments);
    }, I._lerc_decode_4D = function() {
      return (I._lerc_decode_4D = I.asm.l).apply(null, arguments);
    };
    var eA = I._malloc = function() {
      return (eA = I._malloc = I.asm.n).apply(null, arguments);
    };
    I._free = function() {
      return (I._free = I.asm.o).apply(null, arguments);
    };
    var JA = I.___cxa_is_pointer_type = function() {
      return (JA = I.___cxa_is_pointer_type = I.asm.p).apply(
        null,
        arguments
      );
    }, hA;
    function tI(i) {
      this.name = "ExitStatus", this.message = "Program terminated with exit(" + i + ")", this.status = i;
    }
    _ = function i() {
      hA || tA(), hA || (_ = i);
    };
    function tA(i) {
      if (b > 0 || (X(), b > 0))
        return;
      function o() {
        hA || (hA = !0, I.calledRun = !0, !S && (QA(), g(I), I.onRuntimeInitialized && I.onRuntimeInitialized(), AA()));
      }
      I.setStatus ? (I.setStatus("Running..."), setTimeout(function() {
        setTimeout(function() {
          I.setStatus("");
        }, 1), o();
      }, 1)) : o();
    }
    if (I.run = tA, I.preInit)
      for (typeof I.preInit == "function" && (I.preInit = [I.preInit]); I.preInit.length > 0; )
        I.preInit.pop()();
    return tA(), I.ready;
  };
})();
const vA = [
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
let yA = null, _A = !1;
function VI(C = {}) {
  if (yA)
    return yA;
  const A = C.locateFile || ((I, g) => `${g}${I}`);
  return yA = jI({ locateFile: A }).then(
    (I) => I.ready.then(() => {
      vI(I), _A = !0;
    })
  ), yA;
}
function qA() {
  return _A;
}
const FA = {
  getBlobInfo: null,
  decode: null
};
function zI(C) {
  return (C >> 3 << 3) + 16;
}
function $(C, A, I) {
  I.set(C.slice(A, A + I.length));
}
function vI(C) {
  const { _malloc: A, _free: I, _lerc_getBlobInfo: g, _lerc_getDataRanges: Q, _lerc_decode_4D: B, asm: D } = C;
  let E;
  const s = Object.values(D).find(
    (h) => h && "buffer" in h && h.buffer === C.HEAPU8.buffer
  ), N = (h) => {
    const R = h.map((w) => zI(w)), G = R.reduce((w, k) => w + k), y = A(G);
    E = new Uint8Array(s.buffer);
    let F = R[0];
    R[0] = y;
    for (let w = 1; w < R.length; w++) {
      const k = R[w];
      R[w] = R[w - 1] + F, F = k;
    }
    return R;
  };
  FA.getBlobInfo = (h) => {
    const y = new Uint8Array(48), F = new Uint8Array(3 * 8), [w, k, t] = N([
      h.length,
      y.length,
      F.length
    ]);
    E.set(h, w), E.set(y, k), E.set(F, t);
    let a = g(w, h.length, k, t, 12, 3);
    if (a)
      throw I(w), `lerc-getBlobInfo: error code is ${a}`;
    E = new Uint8Array(s.buffer), $(E, k, y), $(E, t, F);
    const M = new Uint32Array(y.buffer), S = new Float64Array(F.buffer), [
      c,
      J,
      n,
      r,
      e,
      d,
      U,
      x,
      K,
      H,
      l
    ] = M, O = {
      version: c,
      dimCount: n,
      width: r,
      height: e,
      validPixelCount: U,
      bandCount: d,
      blobSize: x,
      maskCount: K,
      depthCount: H,
      dataType: J,
      minValue: S[0],
      maxValue: S[1],
      maxZerror: S[2],
      statistics: [],
      bandCountWithNoData: l
    };
    if (l)
      return I(w), O;
    if (H === 1 && d === 1)
      return I(w), O.statistics.push({
        minValue: S[0],
        maxValue: S[1]
      }), O;
    const p = H * d * 8, X = new Uint8Array(p), QA = new Uint8Array(p);
    let AA = w, V = 0, IA = 0, CA = !1;
    if (E.byteLength < w + p * 2 ? (I(w), CA = !0, [AA, V, IA] = N([h.length, p, p]), E.set(h, AA)) : [V, IA] = N([p, p]), E.set(X, V), E.set(QA, IA), a = Q(AA, h.length, H, d, V, IA), a)
      throw I(AA), CA || I(V), `lerc-getDataRanges: error code is ${a}`;
    E = new Uint8Array(s.buffer), $(E, V, X), $(E, IA, QA);
    const b = new Float64Array(X.buffer), _ = new Float64Array(QA.buffer), oA = O.statistics;
    for (let j = 0; j < d; j++)
      if (H > 1) {
        const z = b.slice(j * H, (j + 1) * H), BA = _.slice(j * H, (j + 1) * H), sA = Math.min.apply(null, z), RA = Math.max.apply(null, BA);
        oA.push({
          minValue: sA,
          maxValue: RA,
          dimStats: { minValues: z, maxValues: BA },
          depthStats: { minValues: z, maxValues: BA }
        });
      } else
        oA.push({
          minValue: b[j],
          maxValue: _[j]
        });
    return I(AA), CA || I(V), O;
  }, FA.decode = (h, R) => {
    const { maskCount: G, depthCount: y, bandCount: F, width: w, height: k, dataType: t, bandCountWithNoData: a } = R, M = vA[t], S = w * k, c = new Uint8Array(S * F), J = S * y * F * M.size, n = new Uint8Array(J), r = new Uint8Array(F), e = new Uint8Array(F * 8), [d, U, x, K, H] = N([
      h.length,
      c.length,
      n.length,
      r.length,
      e.length
    ]);
    E.set(h, d), E.set(c, U), E.set(n, x), E.set(r, K), E.set(e, H);
    const l = B(
      d,
      h.length,
      G,
      U,
      y,
      w,
      k,
      F,
      t,
      x,
      K,
      H
    );
    if (l)
      throw I(d), `lerc-decode: error code is ${l}`;
    E = new Uint8Array(s.buffer), $(E, x, n), $(E, U, c);
    let O = null;
    if (a) {
      $(E, K, r), $(E, H, e), O = [];
      const p = new Float64Array(e.buffer);
      for (let X = 0; X < r.length; X++)
        O.push(r[X] ? p[X] : null);
    }
    return I(d), {
      data: n,
      maskData: c,
      noDataValues: O
    };
  };
}
function _I(C, A, I, g, Q) {
  if (I < 2)
    return C;
  const B = new g(A * I);
  for (let D = 0, E = 0; D < A; D++)
    for (let s = 0, N = D; s < I; s++, N += A)
      B[N] = C[E++];
  return B;
}
function $I(C, A = {}) {
  var I, g;
  const Q = (I = A.inputOffset) !== null && I !== void 0 ? I : 0, B = C instanceof Uint8Array ? C.subarray(Q) : new Uint8Array(C, Q), D = FA.getBlobInfo(B), { data: E, maskData: s } = FA.decode(B, D), { width: N, height: h, bandCount: R, dimCount: G, depthCount: y, dataType: F, maskCount: w, statistics: k } = D, t = vA[F], a = new t.ctor(E.buffer), M = [], S = [], c = N * h, J = c * y, n = (g = A.returnInterleaved) !== null && g !== void 0 ? g : A.returnPixelInterleavedDims;
  for (let K = 0; K < R; K++) {
    const H = a.subarray(K * J, (K + 1) * J);
    if (n)
      M.push(H);
    else {
      const l = _I(H, c, y, t.ctor);
      M.push(l);
    }
    S.push(s.subarray(K * J, (K + 1) * J));
  }
  const r = w === 0 ? null : w === 1 ? S[0] : new Uint8Array(c);
  if (w > 1) {
    r.set(S[0]);
    for (let K = 1; K < S.length; K++) {
      const H = S[K];
      for (let l = 0; l < c; l++)
        r[l] = r[l] & H[l];
    }
  }
  const { noDataValue: e } = A, d = e != null && t.range[0] <= e && t.range[1] >= e;
  if (w > 0 && d)
    for (let K = 0; K < R; K++) {
      const H = M[K], l = S[K] || r;
      for (let O = 0; O < c; O++)
        l[O] === 0 && (H[O] = e);
    }
  const U = w === R && R > 1 ? S : null, { pixelType: x } = t;
  return {
    width: N,
    height: h,
    pixelType: x,
    statistics: k,
    pixels: M,
    mask: r,
    dimCount: G,
    depthCount: y,
    bandMasks: U
  };
}
const Ag = {
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
function Ig(C, A, I) {
  let g = C;
  I[2] - I[0] < 1 && (g = gg(C, I));
  const { array: Q, width: B } = g, E = new mI(B).createTile(Q), s = Ag[A] / 1e3 || 0;
  return E.getGeometryData(s);
}
function gg(C, A) {
  function I(E, s, N, h, R, G, y, F) {
    const w = new Float32Array(R * G);
    for (let t = 0; t < G; t++)
      for (let a = 0; a < R; a++) {
        const M = (t + h) * s + (a + N), S = t * R + a;
        w[S] = E[M];
      }
    const k = new Float32Array(F * y);
    for (let t = 0; t < F; t++)
      for (let a = 0; a < y; a++) {
        const M = t * F + a, S = Math.round(a * G / F), J = Math.round(t * R / y) * R + S;
        k[M] = w[J];
      }
    return k;
  }
  const g = Qg(A, C.width), Q = g.sw + 1, B = g.sh + 1;
  return { array: I(
    C.array,
    C.width,
    g.sx,
    g.sy,
    g.sw,
    g.sh,
    Q,
    B
  ), width: Q, height: B };
}
function Qg(C, A) {
  const I = Math.floor(C[0] * A), g = Math.floor(C[1] * A), Q = Math.floor((C[2] - C[0]) * A), B = Math.floor((C[3] - C[1]) * A);
  return { sx: I, sy: g, sw: Q, sh: B };
}
const $A = "KGZ1bmN0aW9uKCl7InVzZSBzdHJpY3QiO2Z1bmN0aW9uIEQoaSxvKXtjb25zdCBuPW5ldyBGbG9hdDMyQXJyYXkoaS5sZW5ndGgpO2ZvcihsZXQgdD0wO3Q8by5sZW5ndGg7dCs9Myl7Y29uc3QgYz1vW3RdKjMsZT1vW3QrMV0qMyxhPW9bdCsyXSozLHM9aVtjXSxoPWlbYysxXSxnPWlbYysyXSxsPWlbZV0sZD1pW2UrMV0seD1pW2UrMl0sdz1pW2FdLGY9aVthKzFdLEk9aVthKzJdLHA9bC1zLG09ZC1oLHI9eC1nLHU9dy1zLE09Zi1oLHk9SS1nLHo9bSp5LXIqTSxUPXIqdS1wKnksRT1wKk0tbSp1LFM9TWF0aC5zcXJ0KHoqeitUKlQrRSpFKSxiPVswLDAsMV07aWYoUz4wKXtjb25zdCBBPTEvUztiWzBdPXoqQSxiWzFdPVQqQSxiWzJdPUUqQX1mb3IobGV0IEE9MDtBPDM7QSsrKW5bYytBXT1uW2UrQV09blthK0FdPWJbQV19cmV0dXJuIG59Y2xhc3MgJHtncmlkU2l6ZTtudW1UcmlhbmdsZXM7bnVtUGFyZW50VHJpYW5nbGVzO2luZGljZXM7Y29vcmRzO2NvbnN0cnVjdG9yKG89MjU3KXt0aGlzLmdyaWRTaXplPW87Y29uc3Qgbj1vLTE7aWYobiZuLTEpdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBncmlkIHNpemUgdG8gYmUgMl5uKzEsIGdvdCAke299LmApO3RoaXMubnVtVHJpYW5nbGVzPW4qbioyLTIsdGhpcy5udW1QYXJlbnRUcmlhbmdsZXM9dGhpcy5udW1UcmlhbmdsZXMtbipuLHRoaXMuaW5kaWNlcz1uZXcgVWludDMyQXJyYXkodGhpcy5ncmlkU2l6ZSp0aGlzLmdyaWRTaXplKSx0aGlzLmNvb3Jkcz1uZXcgVWludDE2QXJyYXkodGhpcy5udW1UcmlhbmdsZXMqNCk7Zm9yKGxldCB0PTA7dDx0aGlzLm51bVRyaWFuZ2xlczt0Kyspe2xldCBjPXQrMixlPTAsYT0wLHM9MCxoPTAsZz0wLGw9MDtmb3IoYyYxP3M9aD1nPW46ZT1hPWw9bjsoYz4+PTEpPjE7KXtjb25zdCB4PWUrcz4+MSx3PWEraD4+MTtjJjE/KHM9ZSxoPWEsZT1nLGE9bCk6KGU9cyxhPWgscz1nLGg9bCksZz14LGw9d31jb25zdCBkPXQqNDt0aGlzLmNvb3Jkc1tkKzBdPWUsdGhpcy5jb29yZHNbZCsxXT1hLHRoaXMuY29vcmRzW2QrMl09cyx0aGlzLmNvb3Jkc1tkKzNdPWh9fWNyZWF0ZVRpbGUobyl7cmV0dXJuIG5ldyBDKG8sdGhpcyl9fWNsYXNzIEN7bWFydGluaTt0ZXJyYWluO2Vycm9ycztjb25zdHJ1Y3RvcihvLG4pe2NvbnN0IHQ9bi5ncmlkU2l6ZTtpZihvLmxlbmd0aCE9PXQqdCl0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIHRlcnJhaW4gZGF0YSBvZiBsZW5ndGggJHt0KnR9ICgke3R9IHggJHt0fSksIGdvdCAke28ubGVuZ3RofS5gKTt0aGlzLnRlcnJhaW49byx0aGlzLm1hcnRpbmk9bix0aGlzLmVycm9ycz1uZXcgRmxvYXQzMkFycmF5KG8ubGVuZ3RoKSx0aGlzLnVwZGF0ZSgpfXVwZGF0ZSgpe2NvbnN0e251bVRyaWFuZ2xlczpvLG51bVBhcmVudFRyaWFuZ2xlczpuLGNvb3Jkczp0LGdyaWRTaXplOmN9PXRoaXMubWFydGluaSx7dGVycmFpbjplLGVycm9yczphfT10aGlzO2ZvcihsZXQgcz1vLTE7cz49MDtzLS0pe2NvbnN0IGg9cyo0LGc9dFtoKzBdLGw9dFtoKzFdLGQ9dFtoKzJdLHg9dFtoKzNdLHc9ZytkPj4xLGY9bCt4Pj4xLEk9dytmLWwscD1mK2ctdyxtPShlW2wqYytnXStlW3gqYytkXSkvMixyPWYqYyt3LHU9TWF0aC5hYnMobS1lW3JdKTtpZihhW3JdPU1hdGgubWF4KGFbcl0sdSksczxuKXtjb25zdCBNPShsK3A+PjEpKmMrKGcrST4+MSkseT0oeCtwPj4xKSpjKyhkK0k+PjEpO2Fbcl09TWF0aC5tYXgoYVtyXSxhW01dLGFbeV0pfX19Z2V0R2VvbWV0cnlEYXRhKG89MCl7Y29uc3R7Z3JpZFNpemU6bixpbmRpY2VzOnR9PXRoaXMubWFydGluaSx7ZXJyb3JzOmN9PXRoaXM7bGV0IGU9MCxhPTA7Y29uc3Qgcz1uLTE7bGV0IGgsZyxsPTA7dC5maWxsKDApO2Z1bmN0aW9uIGQocix1LE0seSx6LFQpe2NvbnN0IEU9citNPj4xLFM9dSt5Pj4xO01hdGguYWJzKHIteikrTWF0aC5hYnModS1UKT4xJiZjW1MqbitFXT5vPyhkKHosVCxyLHUsRSxTKSxkKE0seSx6LFQsRSxTKSk6KGg9dSpuK3IsZz15Km4rTSxsPVQqbit6LHRbaF09PT0wJiYodFtoXT0rK2UpLHRbZ109PT0wJiYodFtnXT0rK2UpLHRbbF09PT0wJiYodFtsXT0rK2UpLGErKyl9ZCgwLDAscyxzLHMsMCksZChzLHMsMCwwLDAscyk7Y29uc3QgeD1lKjIsdz1hKjMsZj1uZXcgVWludDE2QXJyYXkoeCksST1uZXcgVWludDMyQXJyYXkodyk7bGV0IHA9MDtmdW5jdGlvbiBtKHIsdSxNLHkseixUKXtjb25zdCBFPXIrTT4+MSxTPXUreT4+MTtpZihNYXRoLmFicyhyLXopK01hdGguYWJzKHUtVCk+MSYmY1tTKm4rRV0+byltKHosVCxyLHUsRSxTKSxtKE0seSx6LFQsRSxTKTtlbHNle2NvbnN0IGI9dFt1Km4rcl0tMSxBPXRbeSpuK01dLTEsRj10W1Qqbit6XS0xO2ZbMipiXT1yLGZbMipiKzFdPXUsZlsyKkFdPU0sZlsyKkErMV09eSxmWzIqRl09eixmWzIqRisxXT1ULElbcCsrXT1iLElbcCsrXT1BLElbcCsrXT1GfX1yZXR1cm4gbSgwLDAscyxzLHMsMCksbShzLHMsMCwwLDAscykse2F0dHJpYnV0ZXM6dGhpcy5fZ2V0TWVzaEF0dHJpYnV0ZXModGhpcy50ZXJyYWluLGYsSSksaW5kaWNlczpJfX1fZ2V0TWVzaEF0dHJpYnV0ZXMobyxuLHQpe2NvbnN0IGM9TWF0aC5mbG9vcihNYXRoLnNxcnQoby5sZW5ndGgpKSxlPWMtMSxhPW4ubGVuZ3RoLzIscz1uZXcgRmxvYXQzMkFycmF5KGEqMyksaD1uZXcgRmxvYXQzMkFycmF5KGEqMik7Zm9yKGxldCBsPTA7bDxhO2wrKyl7Y29uc3QgZD1uW2wqMl0seD1uW2wqMisxXSx3PXgqYytkO3NbMypsKzBdPWQvZS0uNSxzWzMqbCsxXT0uNS14L2Usc1szKmwrMl09b1t3XSxoWzIqbCswXT1kL2UsaFsyKmwrMV09MS14L2V9Y29uc3QgZz1EKHMsdCk7cmV0dXJue3Bvc2l0aW9uOnt2YWx1ZTpzLHNpemU6M30sdGV4Y29vcmQ6e3ZhbHVlOmgsc2l6ZToyfSxub3JtYWw6e3ZhbHVlOmcsc2l6ZTozfX19fWNvbnN0IFU9ezA6N2UzLDE6NmUzLDI6NWUzLDM6NGUzLDQ6M2UzLDU6MjUwMCw2OjJlMyw3OjE1MDAsODo4MDAsOTo1MDAsMTA6MjAwLDExOjEwMCwxMjo0MCwxMzoxMiwxNDo1LDE1OjIsMTY6MSwxNzouNSwxODouMiwxOTouMSwyMDouMDV9O2Z1bmN0aW9uIHYoaSxvLG4pe2xldCB0PWk7blsyXS1uWzBdPDEmJih0PVAoaSxuKSk7Y29uc3R7YXJyYXk6Yyx3aWR0aDplfT10LHM9bmV3ICQoZSkuY3JlYXRlVGlsZShjKSxoPVVbb10vMWUzfHwwO3JldHVybiBzLmdldEdlb21ldHJ5RGF0YShoKX1mdW5jdGlvbiBQKGksbyl7ZnVuY3Rpb24gbihzLGgsZyxsLGQseCx3LGYpe2NvbnN0IEk9bmV3IEZsb2F0MzJBcnJheShkKngpO2ZvcihsZXQgbT0wO208eDttKyspZm9yKGxldCByPTA7cjxkO3IrKyl7Y29uc3QgdT0obStsKSpoKyhyK2cpLE09bSpkK3I7SVtNXT1zW3VdfWNvbnN0IHA9bmV3IEZsb2F0MzJBcnJheShmKncpO2ZvcihsZXQgbT0wO208ZjttKyspZm9yKGxldCByPTA7cjx3O3IrKyl7Y29uc3QgdT1tKmYrcixNPU1hdGgucm91bmQocip4L2YpLHo9TWF0aC5yb3VuZChtKmQvdykqZCtNO3BbdV09SVt6XX1yZXR1cm4gcH1jb25zdCB0PVYobyxpLndpZHRoKSxjPXQuc3crMSxlPXQuc2grMTtyZXR1cm57YXJyYXk6bihpLmFycmF5LGkud2lkdGgsdC5zeCx0LnN5LHQuc3csdC5zaCxjLGUpLHdpZHRoOmMsaGVpZ2h0OmV9fWZ1bmN0aW9uIFYoaSxvKXtjb25zdCBuPU1hdGguZmxvb3IoaVswXSpvKSx0PU1hdGguZmxvb3IoaVsxXSpvKSxjPU1hdGguZmxvb3IoKGlbMl0taVswXSkqbyksZT1NYXRoLmZsb29yKChpWzNdLWlbMV0pKm8pO3JldHVybntzeDpuLHN5OnQsc3c6YyxzaDplfX1zZWxmLm9ubWVzc2FnZT1pPT57Y29uc3Qgbz1pLmRhdGEsbj12KG8uZGVtRGF0YSxvLnosby5jbGlwQm91bmRzKTtzZWxmLnBvc3RNZXNzYWdlKG4pfX0pKCk7Ci8vIyBzb3VyY2VNYXBwaW5nVVJMPXBhcnNlLndvcmtlci1CdkZSeFNBdS5qcy5tYXAK", Cg = (C) => Uint8Array.from(atob(C), (A) => A.charCodeAt(0)), YA = typeof self < "u" && self.Blob && new Blob([Cg($A)], { type: "text/javascript;charset=utf-8" });
function Bg(C) {
  let A;
  try {
    if (A = YA && (self.URL || self.webkitURL).createObjectURL(YA), !A) throw "";
    const I = new Worker(A, {
      name: C?.name
    });
    return I.addEventListener("error", () => {
      (self.URL || self.webkitURL).revokeObjectURL(A);
    }), I;
  } catch {
    return new Worker(
      "data:text/javascript;base64," + $A,
      {
        name: C?.name
      }
    );
  } finally {
    A && (self.URL || self.webkitURL).revokeObjectURL(A);
  }
}
const Eg = 10;
class Dg extends jA {
  info = {
    version: "0.10.0",
    description: "Tile LERC terrain loader. It can load ArcGis-lerc format terrain data."
  };
  dataType = "lerc";
  // 图像加载器
  fileLoader = new kI(T.manager);
  _workerPool = new zA(0);
  constructor() {
    super(), this.fileLoader.setResponseType("arraybuffer"), this._workerPool.setWorkerCreator(() => new Bg()), VI({ locateFile: () => bI });
  }
  /**
   * 解码给定缓冲区中的Lerc数据
   *
   * @param buffer Lerc编码数据的ArrayBuffer
   * @returns 解码后的高度图数据、宽度和高度的对象
   */
  async decode(A) {
    await ig(qA()), console.assert(qA());
    const { height: I, width: g, pixels: Q } = $I(A), B = new Float32Array(I * g);
    for (let D = 0; D < B.length; D++)
      B[D] = Q[0][D] / 1e3;
    return { array: B, width: g, height: I };
  }
  /**
   * 异步加载并解析数据，返回BufferGeometry对象
   *
   * @param url 数据文件的URL
   * @param params 解析参数，包含瓦片xyz和裁剪边界clipBounds
   * @returns 返回解析后的BufferGeometry对象
   */
  async doLoad(A, I) {
    const g = await this.fileLoader.loadAsync(A), Q = await this.decode(g), { z: B, bounds: D } = I;
    let E;
    return this.useWorker ? (this._workerPool.pool === 0 && this._workerPool.setWorkerLimit(Eg), E = (await this._workerPool.postMessage({ demData: Q, z: B, clipBounds: D }, [
      Q.array.buffer
    ])).data) : E = Ig(Q, B, D), new kA().setData(E);
  }
}
function ig(C, A = 100) {
  return new Promise((I) => {
    const g = setInterval(() => {
      C && (clearInterval(g), I());
    }, A);
  });
}
EI(new Dg());
function og(C) {
  return sg(C.data);
}
function sg(C) {
  function A(Q, B) {
    const D = B * 4, [E, s, N, h] = Q.slice(D, D + 4);
    return h === 0 ? 0 : (E << 16 | s << 8 | N) / 1e4 - 10;
  }
  const I = C.length >>> 2, g = new Float32Array(I);
  for (let Q = 0; Q < I; Q++)
    g[Q] = A(C, Q);
  return g;
}
const AI = "KGZ1bmN0aW9uKCl7InVzZSBzdHJpY3QiO2Z1bmN0aW9uIGModCl7cmV0dXJuIGEodC5kYXRhKX1mdW5jdGlvbiBhKHQpe2Z1bmN0aW9uIG4oZSx1KXtjb25zdCByPXUqNCxbaSxmLGcsbF09ZS5zbGljZShyLHIrNCk7cmV0dXJuIGw9PT0wPzA6KGk8PDE2fGY8PDh8ZykvMWU0LTEwfWNvbnN0IG89dC5sZW5ndGg+Pj4yLHM9bmV3IEZsb2F0MzJBcnJheShvKTtmb3IobGV0IGU9MDtlPG87ZSsrKXNbZV09bih0LGUpO3JldHVybiBzfXNlbGYub25tZXNzYWdlPXQ9Pntjb25zdCBuPWModC5kYXRhLmltZ0RhdGEpO3NlbGYucG9zdE1lc3NhZ2Uobil9fSkoKTsKLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGFyc2Uud29ya2VyLUNYM3F5djlILmpzLm1hcAo=", Rg = (C) => Uint8Array.from(atob(C), (A) => A.charCodeAt(0)), HA = typeof self < "u" && self.Blob && new Blob([Rg(AI)], { type: "text/javascript;charset=utf-8" });
function Ng(C) {
  let A;
  try {
    if (A = HA && (self.URL || self.webkitURL).createObjectURL(HA), !A) throw "";
    const I = new Worker(A, {
      name: C?.name
    });
    return I.addEventListener("error", () => {
      (self.URL || self.webkitURL).revokeObjectURL(A);
    }), I;
  } catch {
    return new Worker(
      "data:text/javascript;base64," + AI,
      {
        name: C?.name
      }
    );
  } finally {
    A && (self.URL || self.webkitURL).revokeObjectURL(A);
  }
}
const hg = 10;
class wg extends jA {
  info = {
    version: "0.10.0",
    description: "Mapbox-RGB terrain loader, It can load Mapbox-RGB terrain data."
  };
  // 数据类型标识
  dataType = "terrain-rgb";
  // 使用imageLoader下载
  imageLoader = new MA(T.manager);
  _workerPool = new zA(0);
  constructor() {
    super(), this._workerPool.setWorkerCreator(() => new Ng());
  }
  // 下载数据
  /**
   * 异步加载BufferGeometry对象
   *
   * @param url 图片的URL地址
   * @param params 加载参数，包含瓦片xyz和裁剪边界clipBounds
   * @returns 返回解析后的BufferGeometry对象
   */
  async doLoad(A, I) {
    const g = await this.imageLoader.loadAsync(A), Q = UI.clamp((I.z + 2) * 3, 2, 64), B = ag(g, I.bounds, Q);
    let D;
    this.useWorker ? (this._workerPool.pool === 0 && this._workerPool.setWorkerLimit(hg), D = (await this._workerPool.postMessage({ imgData: B }, [B.data.buffer])).data) : D = og(B);
    const E = new kA();
    return E.setData(D), E;
  }
}
function ag(C, A, I) {
  const g = LA(A, C.width);
  I = Math.min(I, g.sw);
  const B = new OffscreenCanvas(I, I).getContext("2d");
  return B.imageSmoothingEnabled = !1, B.drawImage(C, g.sx, g.sy, g.sw, g.sh, 0, 0, I, I), B.getImageData(0, 0, I, I);
}
EI(new wg());
const yg = `{\r
	"name": "three-tile-lib",\r
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
var iA = /* @__PURE__ */ ((C) => (C[C.none = 0] = "none", C[C.create = 1] = "create", C[C.remove = 2] = "remove", C))(iA || {});
const xA = 1.02;
function Fg(C, A) {
  const I = C.position.clone().setZ(C.maxZ).applyMatrix4(C.matrixWorld);
  return A.distanceTo(I);
}
function Gg(C) {
  const A = C.scale, I = new P(-A.x, -A.y, 0).applyMatrix4(C.matrixWorld), g = new P(A.x, A.y, 0).applyMatrix4(C.matrixWorld);
  return I.sub(g).length();
}
function tg(C) {
  return C.distToCamera / C.sizeInWorld * 0.8;
}
function Sg(C, A, I, g) {
  const Q = tg(C);
  if (C.isLeaf) {
    if (C.inFrustum && C.z < I && (C.z < A || C.showing) && // Create child tilee until parent tile has showed
    (C.z < A || Q < g / xA))
      return 1;
  } else if (C.z >= A && (C.z > I || Q > g * xA))
    return 2;
  return 0;
}
function Mg(C, A, I, g) {
  const Q = [], B = g + 1, D = A * 2, E = 0, s = 0.25, N = C.imgSource[0].projectionID === "4326";
  if (g === 0 && N) {
    const h = I, R = new P(0.5, 1, 1), G = new u(D, h, B), y = new u(D, h, B);
    G.position.set(-0.25, 0, E), G.scale.copy(R), y.position.set(s, 0, E), y.scale.copy(R), Q.push(G, y);
  } else {
    const h = I * 2, R = new P(0.5, 0.5, 1), G = new u(D, h, B), y = new u(D + 1, h, B), F = new u(D, h + 1, B), w = new u(D + 1, h + 1, B);
    G.position.set(-0.25, s, E), G.scale.copy(R), y.position.set(s, s, E), y.scale.copy(R), F.position.set(-0.25, -0.25, E), F.scale.copy(R), w.position.set(s, -0.25, E), w.scale.copy(R), Q.push(G, y, F, w);
  }
  return Q;
}
const Lg = 10, cg = new rI(), kg = new P(), Ug = new eI(), rg = new JI(new P(-0.5, -0.5, 0), new P(0.5, 0.5, 9)), lA = new nI();
class u extends mA {
  static _downloadThreads = 0;
  /**
   * Number of download threads.
   */
  static get downloadThreads() {
    return u._downloadThreads;
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
    this._showing = A, this.material.forEach((I) => I.visible = A);
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
  constructor(A = 0, I = 0, g = 0) {
    super(cg, []), this.x = A, this.y = I, this.z = g, this.name = `Tile ${g}-${A}-${I}`, this.up.set(0, 0, 1), this.matrixAutoUpdate = !1;
  }
  /**
   * Override Object3D.traverse, change the callback param type to "this".
   * @param callback - The callback function.
   */
  traverse(A) {
    A(this), this.children.forEach((I) => {
      I.isTile && I.traverse(A);
    });
  }
  /**
   * Override Object3D.traverseVisible, change the callback param type to "this".
   * @param callback - The callback function.
   */
  traverseVisible(A) {
    this.visible && (A(this), this.children.forEach((I) => {
      I.isTile && I.traverseVisible(A);
    }));
  }
  /**
   * Override Object3D.raycast, only test the tile has loaded.
   * @param raycaster - The raycaster.
   * @param intersects - The array of intersections.
   */
  raycast(A, I) {
    this.showing && this.loaded && this.isTile && super.raycast(A, I);
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
    if (u.downloadThreads > Lg)
      return { action: iA.none };
    let I = [];
    const { loader: g, minLevel: Q, maxLevel: B, LODThreshold: D } = A, E = Sg(this, Q, B, D);
    return E === iA.create && (I = Mg(g, this.x, this.y, this.z), this.add(...I)), { action: E, newTiles: I };
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
      const I = A.children.filter((Q) => Q.isTile), g = I.every((Q) => Q.loaded);
      A.showing = !g, I.forEach((Q) => Q.showing = g);
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
    u._downloadThreads++;
    const { x: I, y: g, z: Q } = this, B = await A.load({
      x: I,
      y: g,
      z: Q,
      bounds: [-1 / 0, -1 / 0, 1 / 0, 1 / 0]
    });
    return this.material = B.materials, this.geometry = B.geometry, this.maxZ = this.geometry.boundingBox?.max.z || 0, this._loaded = !0, u._downloadThreads--, this;
  }
  /** New tile init */
  _init() {
    this.updateMatrix(), this.updateMatrixWorld(), this.sizeInWorld = Gg(this);
  }
  /**
   * Updates the tile.
   * @param params - The update parameters.
   * @returns this
   */
  update(A) {
    if (console.assert(this.z === 0), !this.parent)
      return this;
    lA.setFromProjectionMatrix(
      Ug.multiplyMatrices(A.camera.projectionMatrix, A.camera.matrixWorldInverse)
    );
    const I = A.camera.getWorldPosition(kg);
    return this.traverse((g) => {
      g.receiveShadow = this.receiveShadow, g.castShadow = this.castShadow;
      const Q = rg.clone().applyMatrix4(g.matrixWorld);
      g.inFrustum = lA.intersectsBox(Q), g.distToCamera = Fg(g, I);
      const { action: B, newTiles: D } = g.LOD(A);
      this._doAction(g, B, D, A);
    }), this._checkReady(), this;
  }
  _doAction(A, I, g, Q) {
    return I === iA.create ? g?.forEach((B) => {
      B._init(), B._isDummy = B.z < Q.minLevel, this.dispatchEvent({ type: "tile-created", tile: B }), B.isDummy || B._load(Q.loader).then(() => {
        B._checkVisible(), this.dispatchEvent({ type: "tile-loaded", tile: B });
      });
    }) : I === iA.remove && (A.showing = !0, A._unLoad(!1, Q.loader), this.dispatchEvent({ type: "tile-unload", tile: A })), this;
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
  _unLoad(A, I) {
    return A && this.isTile && !this.isDummy && (this.dispatchEvent({ type: "unload" }), I?.unload?.(this)), this.children.forEach((g) => g._unLoad(!0, I)), this.clear(), this;
  }
}
class II {
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
  getUrl(A, I, g) {
    const Q = { ...this, x: A, y: I, z: g };
    return eg(this.url, Q);
  }
  /**
   * Get url from tile coordinate, public，called by TileLoader
   * @param x tile x coordinate
   * @param y tile y coordinate
   * @param z tile z coordinate
   * @returns url tile url
   */
  _getUrl(A, I, g) {
    const Q = this.subdomains.length;
    if (Q > 0) {
      const D = Math.floor(Math.random() * Q);
      this.s = this.subdomains[D];
    }
    const B = this.isTMS ? Math.pow(2, g) - 1 - I : I;
    return this.getUrl(A, B, g);
  }
  /**
   * Create source directly through factoy functions.
   * @param options source options
   * @returns ISource data source instance
   */
  static create(A) {
    return new II(A);
  }
}
function eg(C, A) {
  const I = /\{ *([\w_-]+) *\}/g;
  return C.replace(I, (g, Q) => {
    const B = A[Q] ?? (() => {
      throw new Error(`source url template error, No value provided for variable: ${g}`);
    })();
    return typeof B == "function" ? B(A) : B;
  });
}
class gI {
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
  getTileXWithCenterLon(A, I) {
    const g = Math.pow(2, I);
    let Q = A + Math.round(g / 360 * this._lon0);
    return Q >= g ? Q -= g : Q < 0 && (Q += g), Q;
  }
  /**
   * 取得瓦片左下角投影坐标
   * @param x
   * @param y
   * @param z
   * @returns
   */
  getTileXYZproj(A, I, g) {
    const Q = this.mapWidth, B = this.mapHeight / 2, D = A / Math.pow(2, g) * Q - Q / 2, E = B - I / Math.pow(2, g) * B * 2;
    return { x: D, y: E };
  }
  /**
   * 取得经纬度范围的投影坐标
   * @param bounds 经纬度边界
   * @returns 投影坐标
   */
  getProjBoundsFromLonLat(A) {
    const I = A[0] === -180 && A[2] === 180, g = this.project(A[0] + (I ? this._lon0 : 0), A[1]), Q = this.project(A[2] + (I ? this._lon0 : 0), A[3]);
    return [Math.min(g.x, Q.x), Math.min(g.y, Q.y), Math.max(g.x, Q.x), Math.max(g.y, Q.y)];
  }
  /**
  	 * 取得瓦片边界投影坐标范围
  
  	 * @param x 瓦片X坐标
  	 * @param y 瓦片Y坐标
  	 * @param z  瓦片层级
  	 * @returns 
  	 */
  getProjBoundsFromXYZ(A, I, g) {
    const Q = this.getTileXYZproj(A, I, g), B = this.getTileXYZproj(A + 1, I + 1, g);
    return [Math.min(Q.x, B.x), Math.min(Q.y, B.y), Math.max(Q.x, B.x), Math.max(Q.y, B.y)];
  }
  getLonLatBoundsFromXYZ(A, I, g) {
    const Q = this.getProjBoundsFromXYZ(A, I, g), B = this.unProject(Q[0], Q[1]), D = this.unProject(Q[2], Q[3]);
    return [B.lon, B.lat, D.lon, D.lat];
  }
}
const EA = 6378;
class QI extends gI {
  ID = "3857";
  // projeciton ID
  mapWidth = 2 * Math.PI * EA;
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
  project(A, I) {
    const g = (A - this.lon0) * (Math.PI / 180), Q = I * (Math.PI / 180), B = EA * g, D = EA * Math.log(Math.tan(Math.PI / 4 + Q / 2));
    return { x: B, y: D };
  }
  /**
   * Projected coordinates to latitude and longitude
   * @param x projection x
   * @param y projection y
   * @returns latitude and longitude
   */
  unProject(A, I) {
    let g = A / EA * (180 / Math.PI) + this.lon0;
    return g > 180 && (g -= 360), { lat: (2 * Math.atan(Math.exp(I / EA)) - Math.PI / 2) * (180 / Math.PI), lon: g };
  }
}
class Jg extends gI {
  ID = "4326";
  mapWidth = 36e3;
  //E-W scacle (*0.01°)
  mapHeight = 18e3;
  //S-N scale (*0.01°)
  mapDepth = 1;
  //height scale
  project(A, I) {
    return { x: (A - this.lon0) * 100, y: I * 100 };
  }
  unProject(A, I) {
    return { lon: A / 100 + this.lon0, lat: I / 100 };
  }
}
const OA = {
  /**
   * create projection object from projection ID
   *
   * @param id projeciton ID, default: "3857"
   * @returns IProjection instance
   */
  createFromID: (C = "3857", A) => {
    let I;
    switch (C) {
      case "3857":
        I = new QI(A);
        break;
      case "4326":
        I = new Jg(A);
        break;
      default:
        throw new Error(`Projection ID: ${C} is not supported.`);
    }
    return I;
  }
};
class ng extends ZA {
  _projection;
  attcth(A, I) {
    Object.assign(this, A), this._projection = I;
    const g = A.imgSource, Q = A.demSource;
    g.forEach((B) => {
      B._projectionBounds = I.getProjBoundsFromLonLat(B.bounds);
    }), Q && (Q._projectionBounds = I.getProjBoundsFromLonLat(Q.bounds));
  }
  async load(A) {
    if (!this._projection)
      throw new Error("projection is undefined");
    const { x: I, y: g, z: Q } = A, B = this._projection.getTileXWithCenterLon(I, Q), D = this._projection.getProjBoundsFromXYZ(I, g, Q), E = this._projection.getLonLatBoundsFromXYZ(I, g, Q);
    return super.load({ x: B, y: g, z: Q, bounds: D, lonLatBounds: E });
  }
}
function CI(C, A) {
  const I = A.intersectObjects([C.rootTile]);
  for (const g of I)
    if (g.object instanceof u) {
      const Q = C.worldToLocal(g.point.clone()), B = C.map2geo(Q);
      return Object.assign(g, {
        location: B
      });
    }
}
function WA(C, A) {
  const I = new P(0, -1, 0), g = new P(A.x, 10, A.z), Q = new pA(g, I);
  return CI(C, Q);
}
function dg(C, A, I) {
  const g = new pA();
  return g.setFromCamera(I, C), CI(A, g);
}
function Kg(C) {
  const A = C.loader.manager, I = (g, Q) => {
    C.dispatchEvent({ type: g, ...Q });
  };
  A.onStart = (g, Q, B) => {
    I("loading-start", { url: g, itemsLoaded: Q, itemsTotal: B });
  }, A.onError = (g) => {
    I("loading-error", { url: g });
  }, A.onLoad = () => {
    I("loading-complete");
  }, A.onProgress = (g, Q, B) => {
    I("loading-progress", { url: g, itemsLoaded: Q, itemsTotal: B });
  }, A.onParseEnd = (g) => {
    I("parsing-end", { url: g });
  }, C.rootTile.addEventListener("ready", () => I("ready")), C.rootTile.addEventListener("tile-created", (g) => {
    I("tile-created", { tile: g.tile });
  }), C.rootTile.addEventListener("tile-loaded", (g) => {
    I("tile-loaded", { tile: g.tile });
  }), C.rootTile.addEventListener("tile-unload", (g) => {
    I("tile-unload", { tile: g.tile });
  });
}
function qg(C, A = 128) {
  const I = document.createElement("canvas"), g = I.getContext("2d");
  if (!g)
    throw new Error("Failed to get canvas context");
  I.width = A, I.height = A;
  const Q = A / 2, B = A / 2;
  return g.imageSmoothingEnabled = !1, g.fillStyle = "#000022", g.strokeStyle = "DarkGoldenrod", g.lineWidth = 5, g.moveTo(Q, 3), g.lineTo(Q, A), g.stroke(), g.closePath(), g.lineWidth = 2, g.beginPath(), g.roundRect(2, 2, A - 4, B - 8, 10), g.closePath(), g.fill(), g.stroke(), g.font = "24px Arial", g.fillStyle = "Goldenrod", g.strokeStyle = "black", g.textAlign = "center", g.textBaseline = "top", g.strokeText(C, Q, 20), g.fillText(C, Q, 20), I;
}
function fg(C, A = 128) {
  const I = new TA(qg(C, A)), g = new dI({
    map: I,
    sizeAttenuation: !1
  }), Q = new KI(g);
  return Q.visible = !1, Q.center.set(0.5, 0.3), Q.scale.setScalar(0.11), Q.renderOrder = 999, Q;
}
class BI extends mA {
  // 名称
  name = "map";
  // 瓦片树更新时钟
  _clock = new qI();
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
  _loader = new ng();
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
    this.projection.lon0 !== A && (A != 0 && this.minLevel < 1 && console.warn(`Map centralMeridian is ${this.lon0}, minLevel must > 0`), this.projection = OA.createFromID(this.projection.ID, A), this.reload());
  }
  _projection = new QI(0);
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
    const I = Array.isArray(A) ? A : [A];
    if (I.length === 0)
      throw new Error("imgSource can not be empty");
    this.projection = OA.createFromID(I[0].projectionID, this.projection.lon0), this._imgSource = I, this.loader.imgSource = I, this.dispatchEvent({ type: "source-changed", source: A });
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
    return new BI(A);
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
      loader: I = new ZA(),
      rootTile: g = new u(),
      minLevel: Q = 2,
      maxLevel: B = 19,
      imgSource: D,
      demSource: E,
      lon0: s = 0
    } = A;
    this.loader = I, g.matrixAutoUpdate = !0, g.scale.set(this.projection.mapWidth, this.projection.mapHeight, this.projection.mapDepth), this.rootTile = g, this.minLevel = Q, this.maxLevel = B, this.imgSource = D, this.demSource = E, this.lon0 = s, this.add(g), g.updateMatrix(), Kg(this);
  }
  /**
   * Update the map, It is automatically called after mesh adding a scene
   * 模型更新回调函数，地图加入场景后会在每帧更新时被调用，该函数调用根瓦片实现瓦片树更新和数据加载
   * @param camera
   */
  update(A) {
    const I = this._clock.getElapsedTime();
    if (I > this.updateInterval / 1e3) {
      this._loader.attcth(this.loader, this.projection);
      try {
        this.rootTile.update({
          camera: A,
          loader: this._loader,
          minLevel: this.minLevel,
          maxLevel: this.maxLevel,
          LODThreshold: this.LODThreshold
        }), this.rootTile.castShadow = this.castShadow, this.rootTile.receiveShadow = this.receiveShadow;
      } catch (g) {
        console.error("Error on loading tile data.", g);
      }
      this._clock.start(), this.dispatchEvent({ type: "update", delta: I });
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
    const I = this.projection.project(A.x, A.y);
    return new P(I.x, I.y, A.z);
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
    const I = this.projection.unProject(A.x, A.y);
    return new P(I.lon, I.lat, A.z);
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
    const I = this.geo2world(A);
    return WA(this, I);
  }
  /**
   * Get loacation infomation from world position
   * 获取指定世界坐标的地面信息
   * @param pos 世界坐标
   * @returns 地面信息
   */
  getLocalInfoFromWorld(A) {
    return WA(this, A);
  }
  /**
   * Get loacation infomation from screen pointer
   * 获取指定屏幕坐标的地面信息
   * @param camera 摄像机
   * @param pointer 点的屏幕坐标（-0.5~0.5）
   * @returns 位置信息（经纬度、高度等）
   */
  getLocalInfoFromScreen(A, I) {
    return dg(A, this, I);
  }
  /**
   * Get the number of currently downloading tiles
   * 取得当前正在下载的瓦片数量
   */
  get downloading() {
    return u.downloadThreads;
  }
  getTileCount() {
    let A = 0, I = 0, g = 0, Q = 0, B = 0;
    return this.rootTile.traverse((D) => {
      D.isTile && (A++, D.isLeaf && (Q++, D.inFrustum && I++), g = Math.max(g, D.z), B = u.downloadThreads);
    }), { total: A, visible: I, leaf: Q, maxLevel: g, downloading: B };
  }
}
const { version: ug, author: Tg } = JSON.parse(yg);
function mg(C, A = 100) {
  return new Promise((I) => {
    const g = setInterval(() => {
      C && (clearInterval(g), I());
    }, A);
  });
}
function Yg(C) {
  return T.registerMaterialLoader(C), C;
}
function EI(C) {
  return T.registerGeometryLoader(C), C;
}
export {
  T as LoaderFactory,
  mI as Martini,
  xg as PromiseWorker,
  u as Tile,
  Wg as TileCanvasLoader,
  kA as TileGeometry,
  jA as TileGeometryLoader,
  ZA as TileLoader,
  HI as TileLoadingManager,
  BI as TileMap,
  VA as TileMaterial,
  ZI as TileMaterialLoader,
  II as TileSource,
  lg as TileTextureLoader,
  DA as VectorFeatureTypes,
  Og as VectorTileRender,
  PA as addSkirt,
  Kg as attachEvent,
  Tg as author,
  aA as concatenateTypedArrays,
  fg as createBillboards,
  LA as getBoundsCoord,
  uI as getGeometryDataFromDem,
  XA as getGridIndices,
  CI as getLocalInfoFromRay,
  dg as getLocalInfoFromScreen,
  WA as getLocalInfoFromWorld,
  bA as getNormals,
  cA as getSafeTileUrlAndBounds,
  EI as registerDEMLoader,
  Yg as registerImgLoader,
  ug as version,
  mg as waitFor
};
//# sourceMappingURL=three-tile.js.map
