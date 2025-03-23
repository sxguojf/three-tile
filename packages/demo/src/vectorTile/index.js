var dt = Object.defineProperty;
var ft = (i, t, e) => t in i ? dt(i, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : i[t] = e;
var g = (i, t, e) => ft(i, typeof t != "symbol" ? t + "" : t, e);
import { FileLoader as it, Texture as Z, CanvasTexture as nt } from "three";
import { TileMaterialLoader as st, LoaderFactory as rt, VectorTileRender as ot, VectorFeatureTypes as T, TileSource as lt } from "three-tile";
function R(i, t, e, n) {
  let s = n;
  const r = t + (e - t >> 1);
  let o = e - t, l;
  const a = i[t], h = i[t + 1], c = i[e], u = i[e + 1];
  for (let d = t + 3; d < e; d += 3) {
    const f = xt(i[d], i[d + 1], a, h, c, u);
    if (f > s)
      l = d, s = f;
    else if (f === s) {
      const x = Math.abs(d - r);
      x < o && (l = d, o = x);
    }
  }
  s > n && (l - t > 3 && R(i, t, l, n), i[l + 2] = s, e - l > 3 && R(i, l, e, n));
}
function xt(i, t, e, n, s, r) {
  let o = s - e, l = r - n;
  if (o !== 0 || l !== 0) {
    const a = ((i - e) * o + (t - n) * l) / (o * o + l * l);
    a > 1 ? (e = s, n = r) : a > 0 && (e += o * a, n += l * a);
  }
  return o = i - e, l = t - n, o * o + l * l;
}
function v(i, t, e, n) {
  const s = {
    id: i ?? null,
    type: t,
    geometry: e,
    tags: n,
    minX: 1 / 0,
    minY: 1 / 0,
    maxX: -1 / 0,
    maxY: -1 / 0
  };
  if (t === "Point" || t === "MultiPoint" || t === "LineString")
    C(s, e);
  else if (t === "Polygon")
    C(s, e[0]);
  else if (t === "MultiLineString")
    for (const r of e)
      C(s, r);
  else if (t === "MultiPolygon")
    for (const r of e)
      C(s, r[0]);
  return s;
}
function C(i, t) {
  for (let e = 0; e < t.length; e += 3)
    i.minX = Math.min(i.minX, t[e]), i.minY = Math.min(i.minY, t[e + 1]), i.maxX = Math.max(i.maxX, t[e]), i.maxY = Math.max(i.maxY, t[e + 1]);
}
function gt(i, t) {
  const e = [];
  if (i.type === "FeatureCollection")
    for (let n = 0; n < i.features.length; n++)
      k(e, i.features[n], t, n);
  else i.type === "Feature" ? k(e, i, t) : k(e, { geometry: i }, t);
  return e;
}
function k(i, t, e, n) {
  if (!t.geometry) return;
  const s = t.geometry.coordinates;
  if (s && s.length === 0) return;
  const r = t.geometry.type, o = Math.pow(e.tolerance / ((1 << e.maxZoom) * e.extent), 2);
  let l = [], a = t.id;
  if (e.promoteId ? a = t.properties[e.promoteId] : e.generateId && (a = n || 0), r === "Point")
    H(s, l);
  else if (r === "MultiPoint")
    for (const h of s)
      H(h, l);
  else if (r === "LineString")
    j(s, l, o, !1);
  else if (r === "MultiLineString")
    if (e.lineMetrics) {
      for (const h of s)
        l = [], j(h, l, o, !1), i.push(v(a, "LineString", l, t.properties));
      return;
    } else
      G(s, l, o, !1);
  else if (r === "Polygon")
    G(s, l, o, !0);
  else if (r === "MultiPolygon")
    for (const h of s) {
      const c = [];
      G(h, c, o, !0), l.push(c);
    }
  else if (r === "GeometryCollection") {
    for (const h of t.geometry.geometries)
      k(i, {
        id: a,
        geometry: h,
        properties: t.properties
      }, e, n);
    return;
  } else
    throw new Error("Input data is not a valid GeoJSON object.");
  i.push(v(a, r, l, t.properties));
}
function H(i, t) {
  t.push(at(i[0]), ht(i[1]), 0);
}
function j(i, t, e, n) {
  let s, r, o = 0;
  for (let a = 0; a < i.length; a++) {
    const h = at(i[a][0]), c = ht(i[a][1]);
    t.push(h, c, 0), a > 0 && (n ? o += (s * c - h * r) / 2 : o += Math.sqrt(Math.pow(h - s, 2) + Math.pow(c - r, 2))), s = h, r = c;
  }
  const l = t.length - 3;
  t[2] = 1, R(t, 0, l, e), t[l + 2] = 1, t.size = Math.abs(o), t.start = 0, t.end = t.size;
}
function G(i, t, e, n) {
  for (let s = 0; s < i.length; s++) {
    const r = [];
    j(i[s], r, e, n), t.push(r);
  }
}
function at(i) {
  return i / 360 + 0.5;
}
function ht(i) {
  const t = Math.sin(i * Math.PI / 180), e = 0.5 - 0.25 * Math.log((1 + t) / (1 - t)) / Math.PI;
  return e < 0 ? 0 : e > 1 ? 1 : e;
}
function _(i, t, e, n, s, r, o, l) {
  if (e /= t, n /= t, r >= e && o < n) return i;
  if (o < e || r >= n) return null;
  const a = [];
  for (const h of i) {
    const c = h.geometry;
    let u = h.type;
    const d = s === 0 ? h.minX : h.minY, f = s === 0 ? h.maxX : h.maxY;
    if (d >= e && f < n) {
      a.push(h);
      continue;
    } else if (f < e || d >= n)
      continue;
    let x = [];
    if (u === "Point" || u === "MultiPoint")
      pt(c, x, e, n, s);
    else if (u === "LineString")
      ct(c, x, e, n, s, !1, l.lineMetrics);
    else if (u === "MultiLineString")
      N(c, x, e, n, s, !1);
    else if (u === "Polygon")
      N(c, x, e, n, s, !0);
    else if (u === "MultiPolygon")
      for (const M of c) {
        const y = [];
        N(M, y, e, n, s, !0), y.length && x.push(y);
      }
    if (x.length) {
      if (l.lineMetrics && u === "LineString") {
        for (const M of x)
          a.push(v(h.id, u, M, h.tags));
        continue;
      }
      (u === "LineString" || u === "MultiLineString") && (x.length === 1 ? (u = "LineString", x = x[0]) : u = "MultiLineString"), (u === "Point" || u === "MultiPoint") && (u = x.length === 3 ? "Point" : "MultiPoint"), a.push(v(h.id, u, x, h.tags));
    }
  }
  return a.length ? a : null;
}
function pt(i, t, e, n, s) {
  for (let r = 0; r < i.length; r += 3) {
    const o = i[r + s];
    o >= e && o <= n && B(t, i[r], i[r + 1], i[r + 2]);
  }
}
function ct(i, t, e, n, s, r, o) {
  let l = $(i);
  const a = s === 0 ? wt : yt;
  let h = i.start, c, u;
  for (let p = 0; p < i.length - 3; p += 3) {
    const m = i[p], F = i[p + 1], D = i[p + 2], S = i[p + 3], w = i[p + 4], V = s === 0 ? m : F, P = s === 0 ? S : w;
    let X = !1;
    o && (c = Math.sqrt(Math.pow(m - S, 2) + Math.pow(F - w, 2))), V < e ? P > e && (u = a(l, m, F, S, w, e), o && (l.start = h + c * u)) : V > n ? P < n && (u = a(l, m, F, S, w, n), o && (l.start = h + c * u)) : B(l, m, F, D), P < e && V >= e && (u = a(l, m, F, S, w, e), X = !0), P > n && V <= n && (u = a(l, m, F, S, w, n), X = !0), !r && X && (o && (l.end = h + c * u), t.push(l), l = $(i)), o && (h += c);
  }
  let d = i.length - 3;
  const f = i[d], x = i[d + 1], M = i[d + 2], y = s === 0 ? f : x;
  y >= e && y <= n && B(l, f, x, M), d = l.length - 3, r && d >= 3 && (l[d] !== l[0] || l[d + 1] !== l[1]) && B(l, l[0], l[1], l[2]), l.length && t.push(l);
}
function $(i) {
  const t = [];
  return t.size = i.size, t.start = i.start, t.end = i.end, t;
}
function N(i, t, e, n, s, r) {
  for (const o of i)
    ct(o, t, e, n, s, r, !1);
}
function B(i, t, e, n) {
  i.push(t, e, n);
}
function wt(i, t, e, n, s, r) {
  const o = (r - t) / (n - t);
  return B(i, r, e + (s - e) * o, 1), o;
}
function yt(i, t, e, n, s, r) {
  const o = (r - e) / (s - e);
  return B(i, t + (n - t) * o, r, 1), o;
}
function mt(i, t) {
  const e = t.buffer / t.extent;
  let n = i;
  const s = _(i, 1, -1 - e, e, 0, -1, 2, t), r = _(i, 1, 1 - e, 2 + e, 0, -1, 2, t);
  return (s || r) && (n = _(i, 1, -e, 1 + e, 0, -1, 2, t) || [], s && (n = W(s, 1).concat(n)), r && (n = n.concat(W(r, -1)))), n;
}
function W(i, t) {
  const e = [];
  for (let n = 0; n < i.length; n++) {
    const s = i[n], r = s.type;
    let o;
    if (r === "Point" || r === "MultiPoint" || r === "LineString")
      o = O(s.geometry, t);
    else if (r === "MultiLineString" || r === "Polygon") {
      o = [];
      for (const l of s.geometry)
        o.push(O(l, t));
    } else if (r === "MultiPolygon") {
      o = [];
      for (const l of s.geometry) {
        const a = [];
        for (const h of l)
          a.push(O(h, t));
        o.push(a);
      }
    }
    e.push(v(s.id, r, o, s.tags));
  }
  return e;
}
function O(i, t) {
  const e = [];
  e.size = i.size, i.start !== void 0 && (e.start = i.start, e.end = i.end);
  for (let n = 0; n < i.length; n += 3)
    e.push(i[n] + t, i[n + 1], i[n + 2]);
  return e;
}
function K(i, t) {
  if (i.transformed) return i;
  const e = 1 << i.z, n = i.x, s = i.y;
  for (const r of i.features) {
    const o = r.geometry, l = r.type;
    if (r.geometry = [], l === 1)
      for (let a = 0; a < o.length; a += 2)
        r.geometry.push(Q(o[a], o[a + 1], t, e, n, s));
    else
      for (let a = 0; a < o.length; a++) {
        const h = [];
        for (let c = 0; c < o[a].length; c += 2)
          h.push(Q(o[a][c], o[a][c + 1], t, e, n, s));
        r.geometry.push(h);
      }
  }
  return i.transformed = !0, i;
}
function Q(i, t, e, n, s, r) {
  return [
    Math.round(e * (i * n - s)),
    Math.round(e * (t * n - r))
  ];
}
function Ft(i, t, e, n, s) {
  const r = t === s.maxZoom ? 0 : s.tolerance / ((1 << t) * s.extent), o = {
    features: [],
    numPoints: 0,
    numSimplified: 0,
    numFeatures: i.length,
    source: null,
    x: e,
    y: n,
    z: t,
    transformed: !1,
    minX: 2,
    minY: 1,
    maxX: -1,
    maxY: 0
  };
  for (const l of i)
    Pt(o, l, r, s);
  return o;
}
function Pt(i, t, e, n) {
  const s = t.geometry, r = t.type, o = [];
  if (i.minX = Math.min(i.minX, t.minX), i.minY = Math.min(i.minY, t.minY), i.maxX = Math.max(i.maxX, t.maxX), i.maxY = Math.max(i.maxY, t.maxY), r === "Point" || r === "MultiPoint")
    for (let l = 0; l < s.length; l += 3)
      o.push(s[l], s[l + 1]), i.numPoints++, i.numSimplified++;
  else if (r === "LineString")
    A(o, s, i, e, !1, !1);
  else if (r === "MultiLineString" || r === "Polygon")
    for (let l = 0; l < s.length; l++)
      A(o, s[l], i, e, r === "Polygon", l === 0);
  else if (r === "MultiPolygon")
    for (let l = 0; l < s.length; l++) {
      const a = s[l];
      for (let h = 0; h < a.length; h++)
        A(o, a[h], i, e, !0, h === 0);
    }
  if (o.length) {
    let l = t.tags || null;
    if (r === "LineString" && n.lineMetrics) {
      l = {};
      for (const h in t.tags) l[h] = t.tags[h];
      l.mapbox_clip_start = s.start / s.size, l.mapbox_clip_end = s.end / s.size;
    }
    const a = {
      geometry: o,
      type: r === "Polygon" || r === "MultiPolygon" ? 3 : r === "LineString" || r === "MultiLineString" ? 2 : 1,
      tags: l
    };
    t.id !== null && (a.id = t.id), i.features.push(a);
  }
}
function A(i, t, e, n, s, r) {
  const o = n * n;
  if (n > 0 && t.size < (s ? o : n)) {
    e.numPoints += t.length / 3;
    return;
  }
  const l = [];
  for (let a = 0; a < t.length; a += 3)
    (n === 0 || t[a + 2] > o) && (e.numSimplified++, l.push(t[a], t[a + 1])), e.numPoints++;
  s && Mt(l, r), i.push(l);
}
function Mt(i, t) {
  let e = 0;
  for (let n = 0, s = i.length, r = s - 2; n < s; r = n, n += 2)
    e += (i[n] - i[r]) * (i[n + 1] + i[r + 1]);
  if (e > 0 === t)
    for (let n = 0, s = i.length; n < s / 2; n += 2) {
      const r = i[n], o = i[n + 1];
      i[n] = i[s - 2 - n], i[n + 1] = i[s - 1 - n], i[s - 2 - n] = r, i[s - 1 - n] = o;
    }
}
const St = {
  maxZoom: 14,
  // max zoom to preserve detail on
  indexMaxZoom: 5,
  // max zoom in the tile index
  indexMaxPoints: 1e5,
  // max number of points per tile in the tile index
  tolerance: 3,
  // simplification tolerance (higher means simpler)
  extent: 4096,
  // tile extent
  buffer: 64,
  // tile buffer on each side
  lineMetrics: !1,
  // whether to calculate line metrics
  promoteId: null,
  // name of a feature property to be promoted to feature.id
  generateId: !1,
  // whether to generate feature ids. Cannot be used with promoteId
  debug: 0
  // logging level (0, 1 or 2)
};
class Vt {
  constructor(t, e) {
    e = this.options = _t(Object.create(St), e);
    const n = e.debug;
    if (n && console.time("preprocess data"), e.maxZoom < 0 || e.maxZoom > 24) throw new Error("maxZoom should be in the 0-24 range");
    if (e.promoteId && e.generateId) throw new Error("promoteId and generateId cannot be used together.");
    let s = gt(t, e);
    this.tiles = {}, this.tileCoords = [], n && (console.timeEnd("preprocess data"), console.log("index: maxZoom: %d, maxPoints: %d", e.indexMaxZoom, e.indexMaxPoints), console.time("generate tiles"), this.stats = {}, this.total = 0), s = mt(s, e), s.length && this.splitTile(s, 0, 0, 0), n && (s.length && console.log("features: %d, points: %d", this.tiles[0].numFeatures, this.tiles[0].numPoints), console.timeEnd("generate tiles"), console.log("tiles generated:", this.total, JSON.stringify(this.stats)));
  }
  // splits features from a parent tile to sub-tiles.
  // z, x, and y are the coordinates of the parent tile
  // cz, cx, and cy are the coordinates of the target tile
  //
  // If no target tile is specified, splitting stops when we reach the maximum
  // zoom or the number of points is low as specified in the options.
  splitTile(t, e, n, s, r, o, l) {
    const a = [t, e, n, s], h = this.options, c = h.debug;
    for (; a.length; ) {
      s = a.pop(), n = a.pop(), e = a.pop(), t = a.pop();
      const u = 1 << e, d = J(e, n, s);
      let f = this.tiles[d];
      if (!f && (c > 1 && console.time("creation"), f = this.tiles[d] = Ft(t, e, n, s, h), this.tileCoords.push({ z: e, x: n, y: s }), c)) {
        c > 1 && (console.log(
          "tile z%d-%d-%d (features: %d, points: %d, simplified: %d)",
          e,
          n,
          s,
          f.numFeatures,
          f.numPoints,
          f.numSimplified
        ), console.timeEnd("creation"));
        const P = `z${e}`;
        this.stats[P] = (this.stats[P] || 0) + 1, this.total++;
      }
      if (f.source = t, r == null) {
        if (e === h.indexMaxZoom || f.numPoints <= h.indexMaxPoints) continue;
      } else {
        if (e === h.maxZoom || e === r)
          continue;
        if (r != null) {
          const P = r - e;
          if (n !== o >> P || s !== l >> P) continue;
        }
      }
      if (f.source = null, t.length === 0) continue;
      c > 1 && console.time("clipping");
      const x = 0.5 * h.buffer / h.extent, M = 0.5 - x, y = 0.5 + x, p = 1 + x;
      let m = null, F = null, D = null, S = null, w = _(t, u, n - x, n + y, 0, f.minX, f.maxX, h), V = _(t, u, n + M, n + p, 0, f.minX, f.maxX, h);
      t = null, w && (m = _(w, u, s - x, s + y, 1, f.minY, f.maxY, h), F = _(w, u, s + M, s + p, 1, f.minY, f.maxY, h), w = null), V && (D = _(V, u, s - x, s + y, 1, f.minY, f.maxY, h), S = _(V, u, s + M, s + p, 1, f.minY, f.maxY, h), V = null), c > 1 && console.timeEnd("clipping"), a.push(m || [], e + 1, n * 2, s * 2), a.push(F || [], e + 1, n * 2, s * 2 + 1), a.push(D || [], e + 1, n * 2 + 1, s * 2), a.push(S || [], e + 1, n * 2 + 1, s * 2 + 1);
    }
  }
  getTile(t, e, n) {
    t = +t, e = +e, n = +n;
    const s = this.options, { extent: r, debug: o } = s;
    if (t < 0 || t > 24) return null;
    const l = 1 << t;
    e = e + l & l - 1;
    const a = J(t, e, n);
    if (this.tiles[a]) return K(this.tiles[a], r);
    o > 1 && console.log("drilling down to z%d-%d-%d", t, e, n);
    let h = t, c = e, u = n, d;
    for (; !d && h > 0; )
      h--, c = c >> 1, u = u >> 1, d = this.tiles[J(h, c, u)];
    return !d || !d.source ? null : (o > 1 && (console.log("found parent tile z%d-%d-%d", h, c, u), console.time("drilling down")), this.splitTile(d.source, h, c, u, t, e, n), o > 1 && console.timeEnd("drilling down"), this.tiles[a] ? K(this.tiles[a], r) : null);
  }
}
function J(i, t, e) {
  return ((1 << i) * e + t) * 32 + i;
}
function _t(i, t) {
  for (const e in t) i[e] = t[e];
  return i;
}
function Tt(i, t) {
  return new Vt(i, t);
}
class ie extends st {
  /**
   * 构造函数
   */
  constructor() {
    super();
    // 加载器信息
    g(this, "info", {
      version: "0.10.0",
      author: "GuoJF",
      description: "GeoJSON 加载器"
    });
    /** 数据类型标识 */
    g(this, "dataType", "geojson");
    /** 文件加载器 */
    g(this, "_loader", new it(rt.manager));
    /** 瓦片渲染器 */
    g(this, "_render", new ot());
    this._loader.setResponseType("json");
  }
  /**
   * 异步加载瓦片纹理,该方法在瓦片创建后被调用
   *
   * @param url GeoJSON的URL地址
   * @param params 加载参数，包括数据源、瓦片坐标等
   * @returns 瓦片纹理
   */
  async doLoad(e, n) {
    const { x: s, y: r, z: o, source: l } = n, a = l.userData, h = "style" in l ? l.style : a.style;
    return a.gv ? this._getTileTexture(a.gv, s, r, o, h) : (a.loading || (a.loading = !0, a.gv = await this.loadJSON(e), a.loading = !1), await (async () => {
      for (; !a.gv; )
        await new Promise((c) => setTimeout(c, 100));
    })(), console.assert(a.gv), this._getTileTexture(a.gv, s, r, o, h));
  }
  /**
   * 异步加载 JSON 文件，创建 geojson-vt 实例返回。
   *
   * @param url JSON 文件的 URL 地址
   * @returns 返回 geojsonvt 实例
   */
  async loadJSON(e) {
    console.log("load geoJSON", e);
    const n = await this._loader.loadAsync(e).catch((r) => {
      console.error("GeoJSON load error: ", e, r.message);
    });
    return Tt(n, {
      tolerance: 2,
      // buffer: 10,
      extent: 256,
      maxZoom: 20,
      indexMaxZoom: 4
    });
  }
  drawTile(e, n) {
    const o = new OffscreenCanvas(256, 256), l = o.getContext("2d");
    if (l) {
      l.scale(1, -1), l.translate(0, -256), l.save();
      const a = e.features;
      for (let h = 0; h < a.length; h++)
        this._renderFeature(l, a[h], n);
      l.restore();
    }
    return o.transferToImageBitmap();
  }
  // 渲染单个要素
  _renderFeature(e, n, s = {}) {
    const r = [
      T.Unknown,
      T.Point,
      T.Linestring,
      T.Polygon
    ][n.type], o = {
      geometry: [],
      properties: {}
    };
    for (let l = 0; l < n.geometry.length; l++) {
      let a;
      Array.isArray(n.geometry[l][0]) ? a = n.geometry[l].map((h) => ({ x: h[0], y: h[1] })) : a = [{ x: n.geometry[l][0], y: n.geometry[l][1] }], o.geometry.push(a);
    }
    o.properties = n.tags, this._render.render(e, r, o, s);
  }
  /**
   * 根据给定的坐标和样式绘制瓦片纹理
   *
   * @param gv 地图视图对象
   * @param x 瓦片的 x 坐标
   * @param y 瓦片的 y 坐标
   * @param z 瓦片的层级
   * @param style 可选的 GeoJSON 样式类型
   * @returns 返回瓦片的纹理对象，如果瓦片不存在则返回空纹理对象
   */
  _getTileTexture(e, n, s, r, o) {
    if (r < (o.minLevel ?? 1) || r > (o.maxLevel ?? 20))
      return new Z();
    const l = e.getTile(r, n, s);
    if (!l)
      return new Z();
    const a = this.drawTile(l, o);
    return new nt(a);
  }
}
class ne extends lt {
  constructor(e) {
    super(e);
    g(this, "dataType", "geojson");
    g(this, "style", {});
    Object.assign(this, e);
  }
}
function L(i, t) {
  this.x = i, this.y = t;
}
L.prototype = {
  /**
   * Clone this point, returning a new point that can be modified
   * without affecting the old one.
   * @return {Point} the clone
   */
  clone() {
    return new L(this.x, this.y);
  },
  /**
   * Add this point's x & y coordinates to another point,
   * yielding a new point.
   * @param {Point} p the other point
   * @return {Point} output point
   */
  add(i) {
    return this.clone()._add(i);
  },
  /**
   * Subtract this point's x & y coordinates to from point,
   * yielding a new point.
   * @param {Point} p the other point
   * @return {Point} output point
   */
  sub(i) {
    return this.clone()._sub(i);
  },
  /**
   * Multiply this point's x & y coordinates by point,
   * yielding a new point.
   * @param {Point} p the other point
   * @return {Point} output point
   */
  multByPoint(i) {
    return this.clone()._multByPoint(i);
  },
  /**
   * Divide this point's x & y coordinates by point,
   * yielding a new point.
   * @param {Point} p the other point
   * @return {Point} output point
   */
  divByPoint(i) {
    return this.clone()._divByPoint(i);
  },
  /**
   * Multiply this point's x & y coordinates by a factor,
   * yielding a new point.
   * @param {number} k factor
   * @return {Point} output point
   */
  mult(i) {
    return this.clone()._mult(i);
  },
  /**
   * Divide this point's x & y coordinates by a factor,
   * yielding a new point.
   * @param {number} k factor
   * @return {Point} output point
   */
  div(i) {
    return this.clone()._div(i);
  },
  /**
   * Rotate this point around the 0, 0 origin by an angle a,
   * given in radians
   * @param {number} a angle to rotate around, in radians
   * @return {Point} output point
   */
  rotate(i) {
    return this.clone()._rotate(i);
  },
  /**
   * Rotate this point around p point by an angle a,
   * given in radians
   * @param {number} a angle to rotate around, in radians
   * @param {Point} p Point to rotate around
   * @return {Point} output point
   */
  rotateAround(i, t) {
    return this.clone()._rotateAround(i, t);
  },
  /**
   * Multiply this point by a 4x1 transformation matrix
   * @param {[number, number, number, number]} m transformation matrix
   * @return {Point} output point
   */
  matMult(i) {
    return this.clone()._matMult(i);
  },
  /**
   * Calculate this point but as a unit vector from 0, 0, meaning
   * that the distance from the resulting point to the 0, 0
   * coordinate will be equal to 1 and the angle from the resulting
   * point to the 0, 0 coordinate will be the same as before.
   * @return {Point} unit vector point
   */
  unit() {
    return this.clone()._unit();
  },
  /**
   * Compute a perpendicular point, where the new y coordinate
   * is the old x coordinate and the new x coordinate is the old y
   * coordinate multiplied by -1
   * @return {Point} perpendicular point
   */
  perp() {
    return this.clone()._perp();
  },
  /**
   * Return a version of this point with the x & y coordinates
   * rounded to integers.
   * @return {Point} rounded point
   */
  round() {
    return this.clone()._round();
  },
  /**
   * Return the magnitude of this point: this is the Euclidean
   * distance from the 0, 0 coordinate to this point's x and y
   * coordinates.
   * @return {number} magnitude
   */
  mag() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  },
  /**
   * Judge whether this point is equal to another point, returning
   * true or false.
   * @param {Point} other the other point
   * @return {boolean} whether the points are equal
   */
  equals(i) {
    return this.x === i.x && this.y === i.y;
  },
  /**
   * Calculate the distance from this point to another point
   * @param {Point} p the other point
   * @return {number} distance
   */
  dist(i) {
    return Math.sqrt(this.distSqr(i));
  },
  /**
   * Calculate the distance from this point to another point,
   * without the square root step. Useful if you're comparing
   * relative distances.
   * @param {Point} p the other point
   * @return {number} distance
   */
  distSqr(i) {
    const t = i.x - this.x, e = i.y - this.y;
    return t * t + e * e;
  },
  /**
   * Get the angle from the 0, 0 coordinate to this point, in radians
   * coordinates.
   * @return {number} angle
   */
  angle() {
    return Math.atan2(this.y, this.x);
  },
  /**
   * Get the angle from this point to another point, in radians
   * @param {Point} b the other point
   * @return {number} angle
   */
  angleTo(i) {
    return Math.atan2(this.y - i.y, this.x - i.x);
  },
  /**
   * Get the angle between this point and another point, in radians
   * @param {Point} b the other point
   * @return {number} angle
   */
  angleWith(i) {
    return this.angleWithSep(i.x, i.y);
  },
  /**
   * Find the angle of the two vectors, solving the formula for
   * the cross product a x b = |a||b|sin(θ) for θ.
   * @param {number} x the x-coordinate
   * @param {number} y the y-coordinate
   * @return {number} the angle in radians
   */
  angleWithSep(i, t) {
    return Math.atan2(
      this.x * t - this.y * i,
      this.x * i + this.y * t
    );
  },
  /** @param {[number, number, number, number]} m */
  _matMult(i) {
    const t = i[0] * this.x + i[1] * this.y, e = i[2] * this.x + i[3] * this.y;
    return this.x = t, this.y = e, this;
  },
  /** @param {Point} p */
  _add(i) {
    return this.x += i.x, this.y += i.y, this;
  },
  /** @param {Point} p */
  _sub(i) {
    return this.x -= i.x, this.y -= i.y, this;
  },
  /** @param {number} k */
  _mult(i) {
    return this.x *= i, this.y *= i, this;
  },
  /** @param {number} k */
  _div(i) {
    return this.x /= i, this.y /= i, this;
  },
  /** @param {Point} p */
  _multByPoint(i) {
    return this.x *= i.x, this.y *= i.y, this;
  },
  /** @param {Point} p */
  _divByPoint(i) {
    return this.x /= i.x, this.y /= i.y, this;
  },
  _unit() {
    return this._div(this.mag()), this;
  },
  _perp() {
    const i = this.y;
    return this.y = this.x, this.x = -i, this;
  },
  /** @param {number} angle */
  _rotate(i) {
    const t = Math.cos(i), e = Math.sin(i), n = t * this.x - e * this.y, s = e * this.x + t * this.y;
    return this.x = n, this.y = s, this;
  },
  /**
   * @param {number} angle
   * @param {Point} p
   */
  _rotateAround(i, t) {
    const e = Math.cos(i), n = Math.sin(i), s = t.x + e * (this.x - t.x) - n * (this.y - t.y), r = t.y + n * (this.x - t.x) + e * (this.y - t.y);
    return this.x = s, this.y = r, this;
  },
  _round() {
    return this.x = Math.round(this.x), this.y = Math.round(this.y), this;
  },
  constructor: L
};
L.convert = function(i) {
  if (i instanceof L)
    return (
      /** @type {Point} */
      i
    );
  if (Array.isArray(i))
    return new L(+i[0], +i[1]);
  if (i.x !== void 0 && i.y !== void 0)
    return new L(+i.x, +i.y);
  throw new Error("Expected [x, y] or {x, y} point format");
};
class ut {
  /**
   * @param {Pbf} pbf
   * @param {number} end
   * @param {number} extent
   * @param {string[]} keys
   * @param {unknown[]} values
   */
  constructor(t, e, n, s, r) {
    this.properties = {}, this.extent = n, this.type = 0, this.id = void 0, this._pbf = t, this._geometry = -1, this._keys = s, this._values = r, t.readFields(Lt, this, e);
  }
  loadGeometry() {
    const t = this._pbf;
    t.pos = this._geometry;
    const e = t.readVarint() + t.pos, n = [];
    let s, r = 1, o = 0, l = 0, a = 0;
    for (; t.pos < e; ) {
      if (o <= 0) {
        const h = t.readVarint();
        r = h & 7, o = h >> 3;
      }
      if (o--, r === 1 || r === 2)
        l += t.readSVarint(), a += t.readSVarint(), r === 1 && (s && n.push(s), s = []), s && s.push(new L(l, a));
      else if (r === 7)
        s && s.push(s[0].clone());
      else
        throw new Error(`unknown command ${r}`);
    }
    return s && n.push(s), n;
  }
  bbox() {
    const t = this._pbf;
    t.pos = this._geometry;
    const e = t.readVarint() + t.pos;
    let n = 1, s = 0, r = 0, o = 0, l = 1 / 0, a = -1 / 0, h = 1 / 0, c = -1 / 0;
    for (; t.pos < e; ) {
      if (s <= 0) {
        const u = t.readVarint();
        n = u & 7, s = u >> 3;
      }
      if (s--, n === 1 || n === 2)
        r += t.readSVarint(), o += t.readSVarint(), r < l && (l = r), r > a && (a = r), o < h && (h = o), o > c && (c = o);
      else if (n !== 7)
        throw new Error(`unknown command ${n}`);
    }
    return [l, h, a, c];
  }
  /**
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @return {Feature}
   */
  toGeoJSON(t, e, n) {
    const s = this.extent * Math.pow(2, n), r = this.extent * t, o = this.extent * e, l = this.loadGeometry();
    function a(d) {
      return [
        (d.x + r) * 360 / s - 180,
        360 / Math.PI * Math.atan(Math.exp((1 - (d.y + o) * 2 / s) * Math.PI)) - 90
      ];
    }
    function h(d) {
      return d.map(a);
    }
    let c;
    if (this.type === 1) {
      const d = [];
      for (const x of l)
        d.push(x[0]);
      const f = h(d);
      c = d.length === 1 ? { type: "Point", coordinates: f[0] } : { type: "MultiPoint", coordinates: f };
    } else if (this.type === 2) {
      const d = l.map(h);
      c = d.length === 1 ? { type: "LineString", coordinates: d[0] } : { type: "MultiLineString", coordinates: d };
    } else if (this.type === 3) {
      const d = Bt(l), f = [];
      for (const x of d)
        f.push(x.map(h));
      c = f.length === 1 ? { type: "Polygon", coordinates: f[0] } : { type: "MultiPolygon", coordinates: f };
    } else
      throw new Error("unknown feature type");
    const u = {
      type: "Feature",
      geometry: c,
      properties: this.properties
    };
    return this.id != null && (u.id = this.id), u;
  }
}
ut.types = ["Unknown", "Point", "LineString", "Polygon"];
function Lt(i, t, e) {
  i === 1 ? t.id = e.readVarint() : i === 2 ? Et(e, t) : i === 3 ? t.type = /** @type {0 | 1 | 2 | 3} */
  e.readVarint() : i === 4 && (t._geometry = e.pos);
}
function Et(i, t) {
  const e = i.readVarint() + i.pos;
  for (; i.pos < e; ) {
    const n = t._keys[i.readVarint()], s = t._values[i.readVarint()];
    t.properties[n] = s;
  }
}
function Bt(i) {
  const t = i.length;
  if (t <= 1) return [i];
  const e = [];
  let n, s;
  for (let r = 0; r < t; r++) {
    const o = It(i[r]);
    o !== 0 && (s === void 0 && (s = o < 0), s === o < 0 ? (n && e.push(n), n = [i[r]]) : n && n.push(i[r]));
  }
  return n && e.push(n), e;
}
function It(i) {
  let t = 0;
  for (let e = 0, n = i.length, s = n - 1, r, o; e < n; s = e++)
    r = i[e], o = i[s], t += (o.x - r.x) * (r.y + o.y);
  return t;
}
class vt {
  /**
   * @param {Pbf} pbf
   * @param {number} [end]
   */
  constructor(t, e) {
    this.version = 1, this.name = "", this.extent = 4096, this.length = 0, this._pbf = t, this._keys = [], this._values = [], this._features = [], t.readFields(Dt, this, e), this.length = this._features.length;
  }
  /** return feature `i` from this layer as a `VectorTileFeature`
   * @param {number} i
   */
  feature(t) {
    if (t < 0 || t >= this._features.length) throw new Error("feature index out of bounds");
    this._pbf.pos = this._features[t];
    const e = this._pbf.readVarint() + this._pbf.pos;
    return new ut(this._pbf, e, this.extent, this._keys, this._values);
  }
}
function Dt(i, t, e) {
  i === 15 ? t.version = e.readVarint() : i === 1 ? t.name = e.readString() : i === 5 ? t.extent = e.readVarint() : i === 2 ? t._features.push(e.pos) : i === 3 ? t._keys.push(e.readString()) : i === 4 && t._values.push(Ct(e));
}
function Ct(i) {
  let t = null;
  const e = i.readVarint() + i.pos;
  for (; i.pos < e; ) {
    const n = i.readVarint() >> 3;
    t = n === 1 ? i.readString() : n === 2 ? i.readFloat() : n === 3 ? i.readDouble() : n === 4 ? i.readVarint64() : n === 5 ? i.readVarint() : n === 6 ? i.readSVarint() : n === 7 ? i.readBoolean() : null;
  }
  return t;
}
class bt {
  /**
   * @param {Pbf} pbf
   * @param {number} [end]
   */
  constructor(t, e) {
    this.layers = t.readFields(Yt, {}, e);
  }
}
function Yt(i, t, e) {
  if (i === 3) {
    const n = new vt(e, e.readVarint() + e.pos);
    n.length && (t[n.name] = n);
  }
}
const q = 65536 * 65536, z = 1 / q, kt = 12, tt = typeof TextDecoder > "u" ? null : new TextDecoder("utf-8"), U = 0, b = 1, I = 2, Y = 5;
class Xt {
  /**
   * @param {Uint8Array | ArrayBuffer} [buf]
   */
  constructor(t = new Uint8Array(16)) {
    this.buf = ArrayBuffer.isView(t) ? t : new Uint8Array(t), this.dataView = new DataView(this.buf.buffer), this.pos = 0, this.type = 0, this.length = this.buf.length;
  }
  // === READING =================================================================
  /**
   * @template T
   * @param {(tag: number, result: T, pbf: Pbf) => void} readField
   * @param {T} result
   * @param {number} [end]
   */
  readFields(t, e, n = this.length) {
    for (; this.pos < n; ) {
      const s = this.readVarint(), r = s >> 3, o = this.pos;
      this.type = s & 7, t(r, e, this), this.pos === o && this.skip(s);
    }
    return e;
  }
  /**
   * @template T
   * @param {(tag: number, result: T, pbf: Pbf) => void} readField
   * @param {T} result
   */
  readMessage(t, e) {
    return this.readFields(t, e, this.readVarint() + this.pos);
  }
  readFixed32() {
    const t = this.dataView.getUint32(this.pos, !0);
    return this.pos += 4, t;
  }
  readSFixed32() {
    const t = this.dataView.getInt32(this.pos, !0);
    return this.pos += 4, t;
  }
  // 64-bit int handling is based on github.com/dpw/node-buffer-more-ints (MIT-licensed)
  readFixed64() {
    const t = this.dataView.getUint32(this.pos, !0) + this.dataView.getUint32(this.pos + 4, !0) * q;
    return this.pos += 8, t;
  }
  readSFixed64() {
    const t = this.dataView.getUint32(this.pos, !0) + this.dataView.getInt32(this.pos + 4, !0) * q;
    return this.pos += 8, t;
  }
  readFloat() {
    const t = this.dataView.getFloat32(this.pos, !0);
    return this.pos += 4, t;
  }
  readDouble() {
    const t = this.dataView.getFloat64(this.pos, !0);
    return this.pos += 8, t;
  }
  /**
   * @param {boolean} [isSigned]
   */
  readVarint(t) {
    const e = this.buf;
    let n, s;
    return s = e[this.pos++], n = s & 127, s < 128 || (s = e[this.pos++], n |= (s & 127) << 7, s < 128) || (s = e[this.pos++], n |= (s & 127) << 14, s < 128) || (s = e[this.pos++], n |= (s & 127) << 21, s < 128) ? n : (s = e[this.pos], n |= (s & 15) << 28, Gt(n, t, this));
  }
  readVarint64() {
    return this.readVarint(!0);
  }
  readSVarint() {
    const t = this.readVarint();
    return t % 2 === 1 ? (t + 1) / -2 : t / 2;
  }
  readBoolean() {
    return !!this.readVarint();
  }
  readString() {
    const t = this.readVarint() + this.pos, e = this.pos;
    return this.pos = t, t - e >= kt && tt ? tt.decode(this.buf.subarray(e, t)) : Kt(this.buf, e, t);
  }
  readBytes() {
    const t = this.readVarint() + this.pos, e = this.buf.subarray(this.pos, t);
    return this.pos = t, e;
  }
  // verbose for performance reasons; doesn't affect gzipped size
  /**
   * @param {number[]} [arr]
   * @param {boolean} [isSigned]
   */
  readPackedVarint(t = [], e) {
    const n = this.readPackedEnd();
    for (; this.pos < n; ) t.push(this.readVarint(e));
    return t;
  }
  /** @param {number[]} [arr] */
  readPackedSVarint(t = []) {
    const e = this.readPackedEnd();
    for (; this.pos < e; ) t.push(this.readSVarint());
    return t;
  }
  /** @param {boolean[]} [arr] */
  readPackedBoolean(t = []) {
    const e = this.readPackedEnd();
    for (; this.pos < e; ) t.push(this.readBoolean());
    return t;
  }
  /** @param {number[]} [arr] */
  readPackedFloat(t = []) {
    const e = this.readPackedEnd();
    for (; this.pos < e; ) t.push(this.readFloat());
    return t;
  }
  /** @param {number[]} [arr] */
  readPackedDouble(t = []) {
    const e = this.readPackedEnd();
    for (; this.pos < e; ) t.push(this.readDouble());
    return t;
  }
  /** @param {number[]} [arr] */
  readPackedFixed32(t = []) {
    const e = this.readPackedEnd();
    for (; this.pos < e; ) t.push(this.readFixed32());
    return t;
  }
  /** @param {number[]} [arr] */
  readPackedSFixed32(t = []) {
    const e = this.readPackedEnd();
    for (; this.pos < e; ) t.push(this.readSFixed32());
    return t;
  }
  /** @param {number[]} [arr] */
  readPackedFixed64(t = []) {
    const e = this.readPackedEnd();
    for (; this.pos < e; ) t.push(this.readFixed64());
    return t;
  }
  /** @param {number[]} [arr] */
  readPackedSFixed64(t = []) {
    const e = this.readPackedEnd();
    for (; this.pos < e; ) t.push(this.readSFixed64());
    return t;
  }
  readPackedEnd() {
    return this.type === I ? this.readVarint() + this.pos : this.pos + 1;
  }
  /** @param {number} val */
  skip(t) {
    const e = t & 7;
    if (e === U) for (; this.buf[this.pos++] > 127; )
      ;
    else if (e === I) this.pos = this.readVarint() + this.pos;
    else if (e === Y) this.pos += 4;
    else if (e === b) this.pos += 8;
    else throw new Error(`Unimplemented type: ${e}`);
  }
  // === WRITING =================================================================
  /**
   * @param {number} tag
   * @param {number} type
   */
  writeTag(t, e) {
    this.writeVarint(t << 3 | e);
  }
  /** @param {number} min */
  realloc(t) {
    let e = this.length || 16;
    for (; e < this.pos + t; ) e *= 2;
    if (e !== this.length) {
      const n = new Uint8Array(e);
      n.set(this.buf), this.buf = n, this.dataView = new DataView(n.buffer), this.length = e;
    }
  }
  finish() {
    return this.length = this.pos, this.pos = 0, this.buf.subarray(0, this.length);
  }
  /** @param {number} val */
  writeFixed32(t) {
    this.realloc(4), this.dataView.setInt32(this.pos, t, !0), this.pos += 4;
  }
  /** @param {number} val */
  writeSFixed32(t) {
    this.realloc(4), this.dataView.setInt32(this.pos, t, !0), this.pos += 4;
  }
  /** @param {number} val */
  writeFixed64(t) {
    this.realloc(8), this.dataView.setInt32(this.pos, t & -1, !0), this.dataView.setInt32(this.pos + 4, Math.floor(t * z), !0), this.pos += 8;
  }
  /** @param {number} val */
  writeSFixed64(t) {
    this.realloc(8), this.dataView.setInt32(this.pos, t & -1, !0), this.dataView.setInt32(this.pos + 4, Math.floor(t * z), !0), this.pos += 8;
  }
  /** @param {number} val */
  writeVarint(t) {
    if (t = +t || 0, t > 268435455 || t < 0) {
      Nt(t, this);
      return;
    }
    this.realloc(4), this.buf[this.pos++] = t & 127 | (t > 127 ? 128 : 0), !(t <= 127) && (this.buf[this.pos++] = (t >>>= 7) & 127 | (t > 127 ? 128 : 0), !(t <= 127) && (this.buf[this.pos++] = (t >>>= 7) & 127 | (t > 127 ? 128 : 0), !(t <= 127) && (this.buf[this.pos++] = t >>> 7 & 127)));
  }
  /** @param {number} val */
  writeSVarint(t) {
    this.writeVarint(t < 0 ? -t * 2 - 1 : t * 2);
  }
  /** @param {boolean} val */
  writeBoolean(t) {
    this.writeVarint(+t);
  }
  /** @param {string} str */
  writeString(t) {
    t = String(t), this.realloc(t.length * 4), this.pos++;
    const e = this.pos;
    this.pos = Qt(this.buf, t, this.pos);
    const n = this.pos - e;
    n >= 128 && et(e, n, this), this.pos = e - 1, this.writeVarint(n), this.pos += n;
  }
  /** @param {number} val */
  writeFloat(t) {
    this.realloc(4), this.dataView.setFloat32(this.pos, t, !0), this.pos += 4;
  }
  /** @param {number} val */
  writeDouble(t) {
    this.realloc(8), this.dataView.setFloat64(this.pos, t, !0), this.pos += 8;
  }
  /** @param {Uint8Array} buffer */
  writeBytes(t) {
    const e = t.length;
    this.writeVarint(e), this.realloc(e);
    for (let n = 0; n < e; n++) this.buf[this.pos++] = t[n];
  }
  /**
   * @template T
   * @param {(obj: T, pbf: Pbf) => void} fn
   * @param {T} obj
   */
  writeRawMessage(t, e) {
    this.pos++;
    const n = this.pos;
    t(e, this);
    const s = this.pos - n;
    s >= 128 && et(n, s, this), this.pos = n - 1, this.writeVarint(s), this.pos += s;
  }
  /**
   * @template T
   * @param {number} tag
   * @param {(obj: T, pbf: Pbf) => void} fn
   * @param {T} obj
   */
  writeMessage(t, e, n) {
    this.writeTag(t, I), this.writeRawMessage(e, n);
  }
  /**
   * @param {number} tag
   * @param {number[]} arr
   */
  writePackedVarint(t, e) {
    e.length && this.writeMessage(t, Jt, e);
  }
  /**
   * @param {number} tag
   * @param {number[]} arr
   */
  writePackedSVarint(t, e) {
    e.length && this.writeMessage(t, Ut, e);
  }
  /**
   * @param {number} tag
   * @param {boolean[]} arr
   */
  writePackedBoolean(t, e) {
    e.length && this.writeMessage(t, jt, e);
  }
  /**
   * @param {number} tag
   * @param {number[]} arr
   */
  writePackedFloat(t, e) {
    e.length && this.writeMessage(t, Zt, e);
  }
  /**
   * @param {number} tag
   * @param {number[]} arr
   */
  writePackedDouble(t, e) {
    e.length && this.writeMessage(t, Rt, e);
  }
  /**
   * @param {number} tag
   * @param {number[]} arr
   */
  writePackedFixed32(t, e) {
    e.length && this.writeMessage(t, qt, e);
  }
  /**
   * @param {number} tag
   * @param {number[]} arr
   */
  writePackedSFixed32(t, e) {
    e.length && this.writeMessage(t, Ht, e);
  }
  /**
   * @param {number} tag
   * @param {number[]} arr
   */
  writePackedFixed64(t, e) {
    e.length && this.writeMessage(t, $t, e);
  }
  /**
   * @param {number} tag
   * @param {number[]} arr
   */
  writePackedSFixed64(t, e) {
    e.length && this.writeMessage(t, Wt, e);
  }
  /**
   * @param {number} tag
   * @param {Uint8Array} buffer
   */
  writeBytesField(t, e) {
    this.writeTag(t, I), this.writeBytes(e);
  }
  /**
   * @param {number} tag
   * @param {number} val
   */
  writeFixed32Field(t, e) {
    this.writeTag(t, Y), this.writeFixed32(e);
  }
  /**
   * @param {number} tag
   * @param {number} val
   */
  writeSFixed32Field(t, e) {
    this.writeTag(t, Y), this.writeSFixed32(e);
  }
  /**
   * @param {number} tag
   * @param {number} val
   */
  writeFixed64Field(t, e) {
    this.writeTag(t, b), this.writeFixed64(e);
  }
  /**
   * @param {number} tag
   * @param {number} val
   */
  writeSFixed64Field(t, e) {
    this.writeTag(t, b), this.writeSFixed64(e);
  }
  /**
   * @param {number} tag
   * @param {number} val
   */
  writeVarintField(t, e) {
    this.writeTag(t, U), this.writeVarint(e);
  }
  /**
   * @param {number} tag
   * @param {number} val
   */
  writeSVarintField(t, e) {
    this.writeTag(t, U), this.writeSVarint(e);
  }
  /**
   * @param {number} tag
   * @param {string} str
   */
  writeStringField(t, e) {
    this.writeTag(t, I), this.writeString(e);
  }
  /**
   * @param {number} tag
   * @param {number} val
   */
  writeFloatField(t, e) {
    this.writeTag(t, Y), this.writeFloat(e);
  }
  /**
   * @param {number} tag
   * @param {number} val
   */
  writeDoubleField(t, e) {
    this.writeTag(t, b), this.writeDouble(e);
  }
  /**
   * @param {number} tag
   * @param {boolean} val
   */
  writeBooleanField(t, e) {
    this.writeVarintField(t, +e);
  }
}
function Gt(i, t, e) {
  const n = e.buf;
  let s, r;
  if (r = n[e.pos++], s = (r & 112) >> 4, r < 128 || (r = n[e.pos++], s |= (r & 127) << 3, r < 128) || (r = n[e.pos++], s |= (r & 127) << 10, r < 128) || (r = n[e.pos++], s |= (r & 127) << 17, r < 128) || (r = n[e.pos++], s |= (r & 127) << 24, r < 128) || (r = n[e.pos++], s |= (r & 1) << 31, r < 128)) return E(i, s, t);
  throw new Error("Expected varint not more than 10 bytes");
}
function E(i, t, e) {
  return e ? t * 4294967296 + (i >>> 0) : (t >>> 0) * 4294967296 + (i >>> 0);
}
function Nt(i, t) {
  let e, n;
  if (i >= 0 ? (e = i % 4294967296 | 0, n = i / 4294967296 | 0) : (e = ~(-i % 4294967296), n = ~(-i / 4294967296), e ^ 4294967295 ? e = e + 1 | 0 : (e = 0, n = n + 1 | 0)), i >= 18446744073709552e3 || i < -18446744073709552e3)
    throw new Error("Given varint doesn't fit into 10 bytes");
  t.realloc(10), Ot(e, n, t), At(n, t);
}
function Ot(i, t, e) {
  e.buf[e.pos++] = i & 127 | 128, i >>>= 7, e.buf[e.pos++] = i & 127 | 128, i >>>= 7, e.buf[e.pos++] = i & 127 | 128, i >>>= 7, e.buf[e.pos++] = i & 127 | 128, i >>>= 7, e.buf[e.pos] = i & 127;
}
function At(i, t) {
  const e = (i & 7) << 4;
  t.buf[t.pos++] |= e | ((i >>>= 3) ? 128 : 0), i && (t.buf[t.pos++] = i & 127 | ((i >>>= 7) ? 128 : 0), i && (t.buf[t.pos++] = i & 127 | ((i >>>= 7) ? 128 : 0), i && (t.buf[t.pos++] = i & 127 | ((i >>>= 7) ? 128 : 0), i && (t.buf[t.pos++] = i & 127 | ((i >>>= 7) ? 128 : 0), i && (t.buf[t.pos++] = i & 127)))));
}
function et(i, t, e) {
  const n = t <= 16383 ? 1 : t <= 2097151 ? 2 : t <= 268435455 ? 3 : Math.floor(Math.log(t) / (Math.LN2 * 7));
  e.realloc(n);
  for (let s = e.pos - 1; s >= i; s--) e.buf[s + n] = e.buf[s];
}
function Jt(i, t) {
  for (let e = 0; e < i.length; e++) t.writeVarint(i[e]);
}
function Ut(i, t) {
  for (let e = 0; e < i.length; e++) t.writeSVarint(i[e]);
}
function Zt(i, t) {
  for (let e = 0; e < i.length; e++) t.writeFloat(i[e]);
}
function Rt(i, t) {
  for (let e = 0; e < i.length; e++) t.writeDouble(i[e]);
}
function jt(i, t) {
  for (let e = 0; e < i.length; e++) t.writeBoolean(i[e]);
}
function qt(i, t) {
  for (let e = 0; e < i.length; e++) t.writeFixed32(i[e]);
}
function Ht(i, t) {
  for (let e = 0; e < i.length; e++) t.writeSFixed32(i[e]);
}
function $t(i, t) {
  for (let e = 0; e < i.length; e++) t.writeFixed64(i[e]);
}
function Wt(i, t) {
  for (let e = 0; e < i.length; e++) t.writeSFixed64(i[e]);
}
function Kt(i, t, e) {
  let n = "", s = t;
  for (; s < e; ) {
    const r = i[s];
    let o = null, l = r > 239 ? 4 : r > 223 ? 3 : r > 191 ? 2 : 1;
    if (s + l > e) break;
    let a, h, c;
    l === 1 ? r < 128 && (o = r) : l === 2 ? (a = i[s + 1], (a & 192) === 128 && (o = (r & 31) << 6 | a & 63, o <= 127 && (o = null))) : l === 3 ? (a = i[s + 1], h = i[s + 2], (a & 192) === 128 && (h & 192) === 128 && (o = (r & 15) << 12 | (a & 63) << 6 | h & 63, (o <= 2047 || o >= 55296 && o <= 57343) && (o = null))) : l === 4 && (a = i[s + 1], h = i[s + 2], c = i[s + 3], (a & 192) === 128 && (h & 192) === 128 && (c & 192) === 128 && (o = (r & 15) << 18 | (a & 63) << 12 | (h & 63) << 6 | c & 63, (o <= 65535 || o >= 1114112) && (o = null))), o === null ? (o = 65533, l = 1) : o > 65535 && (o -= 65536, n += String.fromCharCode(o >>> 10 & 1023 | 55296), o = 56320 | o & 1023), n += String.fromCharCode(o), s += l;
  }
  return n;
}
function Qt(i, t, e) {
  for (let n = 0, s, r; n < t.length; n++) {
    if (s = t.charCodeAt(n), s > 55295 && s < 57344)
      if (r)
        if (s < 56320) {
          i[e++] = 239, i[e++] = 191, i[e++] = 189, r = s;
          continue;
        } else
          s = r - 55296 << 10 | s - 56320 | 65536, r = null;
      else {
        s > 56319 || n + 1 === t.length ? (i[e++] = 239, i[e++] = 191, i[e++] = 189) : r = s;
        continue;
      }
    else r && (i[e++] = 239, i[e++] = 191, i[e++] = 189, r = null);
    s < 128 ? i[e++] = s : (s < 2048 ? i[e++] = s >> 6 | 192 : (s < 65536 ? i[e++] = s >> 12 | 224 : (i[e++] = s >> 18 | 240, i[e++] = s >> 12 & 63 | 128), i[e++] = s >> 6 & 63 | 128), i[e++] = s & 63 | 128);
  }
  return e;
}
class se extends st {
  constructor() {
    super();
    g(this, "dataType", "mvt");
    // 加载器信息
    g(this, "info", {
      version: "0.10.0",
      author: "GuoJF",
      description: "MVT瓦片加载器"
    });
    g(this, "_loader", new it(rt.manager));
    g(this, "_render", new ot());
    this._loader.setResponseType("arraybuffer");
  }
  async doLoad(e, n) {
    const s = n.source, r = "style" in s ? s.style : s.userData.style, o = await this._loader.loadAsync(e).catch(() => new Z()), l = new bt(new Xt(o)), a = this.drawTile(l, r, n.z);
    return new nt(a);
  }
  /**
   * 在离屏画布上绘制矢量瓦片
   *
   * @param vectorTile 待绘制的矢量瓦片对象
   * @returns 绘制完成的图像位图
   * @throws 如果画布上下文不可用，则抛出错误
   */
  drawTile(e, n, s) {
    const a = new OffscreenCanvas(256, 256).getContext("2d");
    if (a) {
      if (a.scale(1, -1), a.translate(0, -256), n)
        for (const h in n.layer) {
          const c = n.layer[h];
          if (n && (s < (c.minLevel ?? 1) || s > (c.maxLevel ?? 20)))
            continue;
          const u = e.layers[h];
          if (u) {
            const d = 256 / u.extent;
            this._renderLayer(a, u, c, d);
          }
        }
      else
        for (const h in e.layers) {
          const c = e.layers[h], u = 256 / c.extent;
          this._renderLayer(a, c, void 0, u);
        }
      return a.canvas.transferToImageBitmap();
    } else
      throw new Error("Canvas context is not available");
  }
  _renderLayer(e, n, s, r = 1) {
    e.save();
    for (let o = 0; o < n.length; o++) {
      const l = n.feature(o);
      this._renderFeature(e, l, s, r);
    }
    return e.restore(), this;
  }
  // 渲染单个要素
  _renderFeature(e, n, s = {}, r = 1) {
    const o = [
      T.Unknown,
      T.Point,
      T.Linestring,
      T.Polygon
    ][n.type], l = {
      geometry: n.loadGeometry(),
      properties: n.properties
    };
    this._render.render(e, o, l, s, r);
  }
}
class re extends lt {
  //  "https://demotiles.maplibre.org/style.json";
  constructor(e) {
    super(e);
    g(this, "dataType", "mvt");
    Object.assign(this, e);
  }
}
export {
  ie as GeoJSONLoader,
  ne as GeoJSONSource,
  se as MVTLoader,
  re as MVTSource
};
