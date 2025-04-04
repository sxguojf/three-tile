(function (y, p) {
	typeof exports == "object" && typeof module < "u"
		? p(exports, require("three"), require("three-tile"))
		: typeof define == "function" && define.amd
			? define(["exports", "three", "three-tile"], p)
			: ((y = typeof globalThis < "u" ? globalThis : y || self),
				p((y["three-tile-plugin-vector"] = {}), y.three, y["three-tile"]));
})(this, function (y, p, g) {
	"use strict";
	var Wt = Object.defineProperty;
	var Kt = (y, p, g) =>
		p in y ? Wt(y, p, { enumerable: !0, configurable: !0, writable: !0, value: g }) : (y[p] = g);
	var w = (y, p, g) => Kt(y, typeof p != "symbol" ? p + "" : p, g);
	function G(i, t, e, n) {
		let s = n;
		const r = t + ((e - t) >> 1);
		let o = e - t,
			a;
		const l = i[t],
			h = i[t + 1],
			u = i[e],
			c = i[e + 1];
		for (let d = t + 3; d < e; d += 3) {
			const f = at(i[d], i[d + 1], l, h, u, c);
			if (f > s) (a = d), (s = f);
			else if (f === s) {
				const x = Math.abs(d - r);
				x < o && ((a = d), (o = x));
			}
		}
		s > n && (a - t > 3 && G(i, t, a, n), (i[a + 2] = s), e - a > 3 && G(i, a, e, n));
	}
	function at(i, t, e, n, s, r) {
		let o = s - e,
			a = r - n;
		if (o !== 0 || a !== 0) {
			const l = ((i - e) * o + (t - n) * a) / (o * o + a * a);
			l > 1 ? ((e = s), (n = r)) : l > 0 && ((e += o * l), (n += a * l));
		}
		return (o = i - e), (a = t - n), o * o + a * a;
	}
	function D(i, t, e, n) {
		const s = {
			id: i ?? null,
			type: t,
			geometry: e,
			tags: n,
			minX: 1 / 0,
			minY: 1 / 0,
			maxX: -1 / 0,
			maxY: -1 / 0,
		};
		if (t === "Point" || t === "MultiPoint" || t === "LineString") b(s, e);
		else if (t === "Polygon") b(s, e[0]);
		else if (t === "MultiLineString") for (const r of e) b(s, r);
		else if (t === "MultiPolygon") for (const r of e) b(s, r[0]);
		return s;
	}
	function b(i, t) {
		for (let e = 0; e < t.length; e += 3)
			(i.minX = Math.min(i.minX, t[e])),
				(i.minY = Math.min(i.minY, t[e + 1])),
				(i.maxX = Math.max(i.maxX, t[e])),
				(i.maxY = Math.max(i.maxY, t[e + 1]));
	}
	function lt(i, t) {
		const e = [];
		if (i.type === "FeatureCollection") for (let n = 0; n < i.features.length; n++) Y(e, i.features[n], t, n);
		else i.type === "Feature" ? Y(e, i, t) : Y(e, { geometry: i }, t);
		return e;
	}
	function Y(i, t, e, n) {
		if (!t.geometry) return;
		const s = t.geometry.coordinates;
		if (s && s.length === 0) return;
		const r = t.geometry.type,
			o = Math.pow(e.tolerance / ((1 << e.maxZoom) * e.extent), 2);
		let a = [],
			l = t.id;
		if ((e.promoteId ? (l = t.properties[e.promoteId]) : e.generateId && (l = n || 0), r === "Point")) $(s, a);
		else if (r === "MultiPoint") for (const h of s) $(h, a);
		else if (r === "LineString") N(s, a, o, !1);
		else if (r === "MultiLineString")
			if (e.lineMetrics) {
				for (const h of s) (a = []), N(h, a, o, !1), i.push(D(l, "LineString", a, t.properties));
				return;
			} else J(s, a, o, !1);
		else if (r === "Polygon") J(s, a, o, !0);
		else if (r === "MultiPolygon")
			for (const h of s) {
				const u = [];
				J(h, u, o, !0), a.push(u);
			}
		else if (r === "GeometryCollection") {
			for (const h of t.geometry.geometries) Y(i, { id: l, geometry: h, properties: t.properties }, e, n);
			return;
		} else throw new Error("Input data is not a valid GeoJSON object.");
		i.push(D(l, r, a, t.properties));
	}
	function $(i, t) {
		t.push(W(i[0]), K(i[1]), 0);
	}
	function N(i, t, e, n) {
		let s,
			r,
			o = 0;
		for (let l = 0; l < i.length; l++) {
			const h = W(i[l][0]),
				u = K(i[l][1]);
			t.push(h, u, 0),
				l > 0 && (n ? (o += (s * u - h * r) / 2) : (o += Math.sqrt(Math.pow(h - s, 2) + Math.pow(u - r, 2)))),
				(s = h),
				(r = u);
		}
		const a = t.length - 3;
		(t[2] = 1), G(t, 0, a, e), (t[a + 2] = 1), (t.size = Math.abs(o)), (t.start = 0), (t.end = t.size);
	}
	function J(i, t, e, n) {
		for (let s = 0; s < i.length; s++) {
			const r = [];
			N(i[s], r, e, n), t.push(r);
		}
	}
	function W(i) {
		return i / 360 + 0.5;
	}
	function K(i) {
		const t = Math.sin((i * Math.PI) / 180),
			e = 0.5 - (0.25 * Math.log((1 + t) / (1 - t))) / Math.PI;
		return e < 0 ? 0 : e > 1 ? 1 : e;
	}
	function _(i, t, e, n, s, r, o, a) {
		if (((e /= t), (n /= t), r >= e && o < n)) return i;
		if (o < e || r >= n) return null;
		const l = [];
		for (const h of i) {
			const u = h.geometry;
			let c = h.type;
			const d = s === 0 ? h.minX : h.minY,
				f = s === 0 ? h.maxX : h.maxY;
			if (d >= e && f < n) {
				l.push(h);
				continue;
			} else if (f < e || d >= n) continue;
			let x = [];
			if (c === "Point" || c === "MultiPoint") ht(u, x, e, n, s);
			else if (c === "LineString") Q(u, x, e, n, s, !1, a.lineMetrics);
			else if (c === "MultiLineString") A(u, x, e, n, s, !1);
			else if (c === "Polygon") A(u, x, e, n, s, !0);
			else if (c === "MultiPolygon")
				for (const T of u) {
					const P = [];
					A(T, P, e, n, s, !0), P.length && x.push(P);
				}
			if (x.length) {
				if (a.lineMetrics && c === "LineString") {
					for (const T of x) l.push(D(h.id, c, T, h.tags));
					continue;
				}
				(c === "LineString" || c === "MultiLineString") &&
					(x.length === 1 ? ((c = "LineString"), (x = x[0])) : (c = "MultiLineString")),
					(c === "Point" || c === "MultiPoint") && (c = x.length === 3 ? "Point" : "MultiPoint"),
					l.push(D(h.id, c, x, h.tags));
			}
		}
		return l.length ? l : null;
	}
	function ht(i, t, e, n, s) {
		for (let r = 0; r < i.length; r += 3) {
			const o = i[r + s];
			o >= e && o <= n && B(t, i[r], i[r + 1], i[r + 2]);
		}
	}
	function Q(i, t, e, n, s, r, o) {
		let a = z(i);
		const l = s === 0 ? ut : ct;
		let h = i.start,
			u,
			c;
		for (let m = 0; m < i.length - 3; m += 3) {
			const M = i[m],
				S = i[m + 1],
				O = i[m + 2],
				L = i[m + 3],
				F = i[m + 4],
				E = s === 0 ? M : S,
				V = s === 0 ? L : F;
			let H = !1;
			o && (u = Math.sqrt(Math.pow(M - L, 2) + Math.pow(S - F, 2))),
				E < e
					? V > e && ((c = l(a, M, S, L, F, e)), o && (a.start = h + u * c))
					: E > n
						? V < n && ((c = l(a, M, S, L, F, n)), o && (a.start = h + u * c))
						: B(a, M, S, O),
				V < e && E >= e && ((c = l(a, M, S, L, F, e)), (H = !0)),
				V > n && E <= n && ((c = l(a, M, S, L, F, n)), (H = !0)),
				!r && H && (o && (a.end = h + u * c), t.push(a), (a = z(i))),
				o && (h += u);
		}
		let d = i.length - 3;
		const f = i[d],
			x = i[d + 1],
			T = i[d + 2],
			P = s === 0 ? f : x;
		P >= e && P <= n && B(a, f, x, T),
			(d = a.length - 3),
			r && d >= 3 && (a[d] !== a[0] || a[d + 1] !== a[1]) && B(a, a[0], a[1], a[2]),
			a.length && t.push(a);
	}
	function z(i) {
		const t = [];
		return (t.size = i.size), (t.start = i.start), (t.end = i.end), t;
	}
	function A(i, t, e, n, s, r) {
		for (const o of i) Q(o, t, e, n, s, r, !1);
	}
	function B(i, t, e, n) {
		i.push(t, e, n);
	}
	function ut(i, t, e, n, s, r) {
		const o = (r - t) / (n - t);
		return B(i, r, e + (s - e) * o, 1), o;
	}
	function ct(i, t, e, n, s, r) {
		const o = (r - e) / (s - e);
		return B(i, t + (n - t) * o, r, 1), o;
	}
	function dt(i, t) {
		const e = t.buffer / t.extent;
		let n = i;
		const s = _(i, 1, -1 - e, e, 0, -1, 2, t),
			r = _(i, 1, 1 - e, 2 + e, 0, -1, 2, t);
		return (
			(s || r) &&
				((n = _(i, 1, -e, 1 + e, 0, -1, 2, t) || []),
				s && (n = tt(s, 1).concat(n)),
				r && (n = n.concat(tt(r, -1)))),
			n
		);
	}
	function tt(i, t) {
		const e = [];
		for (let n = 0; n < i.length; n++) {
			const s = i[n],
				r = s.type;
			let o;
			if (r === "Point" || r === "MultiPoint" || r === "LineString") o = U(s.geometry, t);
			else if (r === "MultiLineString" || r === "Polygon") {
				o = [];
				for (const a of s.geometry) o.push(U(a, t));
			} else if (r === "MultiPolygon") {
				o = [];
				for (const a of s.geometry) {
					const l = [];
					for (const h of a) l.push(U(h, t));
					o.push(l);
				}
			}
			e.push(D(s.id, r, o, s.tags));
		}
		return e;
	}
	function U(i, t) {
		const e = [];
		(e.size = i.size), i.start !== void 0 && ((e.start = i.start), (e.end = i.end));
		for (let n = 0; n < i.length; n += 3) e.push(i[n] + t, i[n + 1], i[n + 2]);
		return e;
	}
	function et(i, t) {
		if (i.transformed) return i;
		const e = 1 << i.z,
			n = i.x,
			s = i.y;
		for (const r of i.features) {
			const o = r.geometry,
				a = r.type;
			if (((r.geometry = []), a === 1))
				for (let l = 0; l < o.length; l += 2) r.geometry.push(it(o[l], o[l + 1], t, e, n, s));
			else
				for (let l = 0; l < o.length; l++) {
					const h = [];
					for (let u = 0; u < o[l].length; u += 2) h.push(it(o[l][u], o[l][u + 1], t, e, n, s));
					r.geometry.push(h);
				}
		}
		return (i.transformed = !0), i;
	}
	function it(i, t, e, n, s, r) {
		return [Math.round(e * (i * n - s)), Math.round(e * (t * n - r))];
	}
	function ft(i, t, e, n, s) {
		const r = t === s.maxZoom ? 0 : s.tolerance / ((1 << t) * s.extent),
			o = {
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
				maxY: 0,
			};
		for (const a of i) xt(o, a, r, s);
		return o;
	}
	function xt(i, t, e, n) {
		const s = t.geometry,
			r = t.type,
			o = [];
		if (
			((i.minX = Math.min(i.minX, t.minX)),
			(i.minY = Math.min(i.minY, t.minY)),
			(i.maxX = Math.max(i.maxX, t.maxX)),
			(i.maxY = Math.max(i.maxY, t.maxY)),
			r === "Point" || r === "MultiPoint")
		)
			for (let a = 0; a < s.length; a += 3) o.push(s[a], s[a + 1]), i.numPoints++, i.numSimplified++;
		else if (r === "LineString") Z(o, s, i, e, !1, !1);
		else if (r === "MultiLineString" || r === "Polygon")
			for (let a = 0; a < s.length; a++) Z(o, s[a], i, e, r === "Polygon", a === 0);
		else if (r === "MultiPolygon")
			for (let a = 0; a < s.length; a++) {
				const l = s[a];
				for (let h = 0; h < l.length; h++) Z(o, l[h], i, e, !0, h === 0);
			}
		if (o.length) {
			let a = t.tags || null;
			if (r === "LineString" && n.lineMetrics) {
				a = {};
				for (const h in t.tags) a[h] = t.tags[h];
				(a.mapbox_clip_start = s.start / s.size), (a.mapbox_clip_end = s.end / s.size);
			}
			const l = {
				geometry: o,
				type:
					r === "Polygon" || r === "MultiPolygon" ? 3 : r === "LineString" || r === "MultiLineString" ? 2 : 1,
				tags: a,
			};
			t.id !== null && (l.id = t.id), i.features.push(l);
		}
	}
	function Z(i, t, e, n, s, r) {
		const o = n * n;
		if (n > 0 && t.size < (s ? o : n)) {
			e.numPoints += t.length / 3;
			return;
		}
		const a = [];
		for (let l = 0; l < t.length; l += 3)
			(n === 0 || t[l + 2] > o) && (e.numSimplified++, a.push(t[l], t[l + 1])), e.numPoints++;
		s && gt(a, r), i.push(a);
	}
	function gt(i, t) {
		let e = 0;
		for (let n = 0, s = i.length, r = s - 2; n < s; r = n, n += 2) e += (i[n] - i[r]) * (i[n + 1] + i[r + 1]);
		if (e > 0 === t)
			for (let n = 0, s = i.length; n < s / 2; n += 2) {
				const r = i[n],
					o = i[n + 1];
				(i[n] = i[s - 2 - n]), (i[n + 1] = i[s - 1 - n]), (i[s - 2 - n] = r), (i[s - 1 - n] = o);
			}
	}
	const pt = {
		maxZoom: 14,
		indexMaxZoom: 5,
		indexMaxPoints: 1e5,
		tolerance: 3,
		extent: 4096,
		buffer: 64,
		lineMetrics: !1,
		promoteId: null,
		generateId: !1,
		debug: 0,
	};
	class yt {
		constructor(t, e) {
			e = this.options = wt(Object.create(pt), e);
			const n = e.debug;
			if ((n && console.time("preprocess data"), e.maxZoom < 0 || e.maxZoom > 24))
				throw new Error("maxZoom should be in the 0-24 range");
			if (e.promoteId && e.generateId) throw new Error("promoteId and generateId cannot be used together.");
			let s = lt(t, e);
			(this.tiles = {}),
				(this.tileCoords = []),
				n &&
					(console.timeEnd("preprocess data"),
					console.log("index: maxZoom: %d, maxPoints: %d", e.indexMaxZoom, e.indexMaxPoints),
					console.time("generate tiles"),
					(this.stats = {}),
					(this.total = 0)),
				(s = dt(s, e)),
				s.length && this.splitTile(s, 0, 0, 0),
				n &&
					(s.length &&
						console.log("features: %d, points: %d", this.tiles[0].numFeatures, this.tiles[0].numPoints),
					console.timeEnd("generate tiles"),
					console.log("tiles generated:", this.total, JSON.stringify(this.stats)));
		}
		splitTile(t, e, n, s, r, o, a) {
			const l = [t, e, n, s],
				h = this.options,
				u = h.debug;
			for (; l.length; ) {
				(s = l.pop()), (n = l.pop()), (e = l.pop()), (t = l.pop());
				const c = 1 << e,
					d = j(e, n, s);
				let f = this.tiles[d];
				if (
					!f &&
					(u > 1 && console.time("creation"),
					(f = this.tiles[d] = ft(t, e, n, s, h)),
					this.tileCoords.push({ z: e, x: n, y: s }),
					u)
				) {
					u > 1 &&
						(console.log(
							"tile z%d-%d-%d (features: %d, points: %d, simplified: %d)",
							e,
							n,
							s,
							f.numFeatures,
							f.numPoints,
							f.numSimplified
						),
						console.timeEnd("creation"));
					const V = `z${e}`;
					(this.stats[V] = (this.stats[V] || 0) + 1), this.total++;
				}
				if (((f.source = t), r == null)) {
					if (e === h.indexMaxZoom || f.numPoints <= h.indexMaxPoints) continue;
				} else {
					if (e === h.maxZoom || e === r) continue;
					if (r != null) {
						const V = r - e;
						if (n !== o >> V || s !== a >> V) continue;
					}
				}
				if (((f.source = null), t.length === 0)) continue;
				u > 1 && console.time("clipping");
				const x = (0.5 * h.buffer) / h.extent,
					T = 0.5 - x,
					P = 0.5 + x,
					m = 1 + x;
				let M = null,
					S = null,
					O = null,
					L = null,
					F = _(t, c, n - x, n + P, 0, f.minX, f.maxX, h),
					E = _(t, c, n + T, n + m, 0, f.minX, f.maxX, h);
				(t = null),
					F &&
						((M = _(F, c, s - x, s + P, 1, f.minY, f.maxY, h)),
						(S = _(F, c, s + T, s + m, 1, f.minY, f.maxY, h)),
						(F = null)),
					E &&
						((O = _(E, c, s - x, s + P, 1, f.minY, f.maxY, h)),
						(L = _(E, c, s + T, s + m, 1, f.minY, f.maxY, h)),
						(E = null)),
					u > 1 && console.timeEnd("clipping"),
					l.push(M || [], e + 1, n * 2, s * 2),
					l.push(S || [], e + 1, n * 2, s * 2 + 1),
					l.push(O || [], e + 1, n * 2 + 1, s * 2),
					l.push(L || [], e + 1, n * 2 + 1, s * 2 + 1);
			}
		}
		getTile(t, e, n) {
			(t = +t), (e = +e), (n = +n);
			const s = this.options,
				{ extent: r, debug: o } = s;
			if (t < 0 || t > 24) return null;
			const a = 1 << t;
			e = (e + a) & (a - 1);
			const l = j(t, e, n);
			if (this.tiles[l]) return et(this.tiles[l], r);
			o > 1 && console.log("drilling down to z%d-%d-%d", t, e, n);
			let h = t,
				u = e,
				c = n,
				d;
			for (; !d && h > 0; ) h--, (u = u >> 1), (c = c >> 1), (d = this.tiles[j(h, u, c)]);
			return !d || !d.source
				? null
				: (o > 1 && (console.log("found parent tile z%d-%d-%d", h, u, c), console.time("drilling down")),
					this.splitTile(d.source, h, u, c, t, e, n),
					o > 1 && console.timeEnd("drilling down"),
					this.tiles[l] ? et(this.tiles[l], r) : null);
		}
	}
	function j(i, t, e) {
		return ((1 << i) * e + t) * 32 + i;
	}
	function wt(i, t) {
		for (const e in t) i[e] = t[e];
		return i;
	}
	function mt(i, t) {
		return new yt(i, t);
	}
	class Ft extends g.TileMaterialLoader {
		constructor() {
			super();
			w(this, "info", { version: "0.10.0", author: "GuoJF", description: "GeoJSON 加载器" });
			w(this, "dataType", "geojson");
			w(this, "_loader", new p.FileLoader(g.LoaderFactory.manager));
			w(this, "_render", new g.VectorTileRender());
			this._loader.setResponseType("json");
		}
		async doLoad(e, n) {
			const { x: s, y: r, z: o, source: a } = n,
				l = a.userData,
				h = "style" in a ? a.style : l.style;
			return l.gv
				? this._getTileTexture(l.gv, s, r, o, h)
				: (l.loading || ((l.loading = !0), (l.gv = await this.loadJSON(e)), (l.loading = !1)),
					await (async () => {
						for (; !l.gv; ) await new Promise(u => setTimeout(u, 100));
					})(),
					console.assert(l.gv),
					this._getTileTexture(l.gv, s, r, o, h));
		}
		async loadJSON(e) {
			console.log("load geoJSON", e);
			const n = await this._loader.loadAsync(e).catch(r => {
				console.error("GeoJSON load error: ", e, r.message);
			});
			return mt(n, { tolerance: 2, extent: 256, maxZoom: 20, indexMaxZoom: 4 });
		}
		drawTile(e, n) {
			const o = new OffscreenCanvas(256, 256),
				a = o.getContext("2d");
			if (a) {
				a.scale(1, -1), a.translate(0, -256), a.save();
				const l = e.features;
				for (let h = 0; h < l.length; h++) this._renderFeature(a, l[h], n);
				a.restore();
			}
			return o.transferToImageBitmap();
		}
		_renderFeature(e, n, s = {}) {
			const r = [
					g.VectorFeatureTypes.Unknown,
					g.VectorFeatureTypes.Point,
					g.VectorFeatureTypes.Linestring,
					g.VectorFeatureTypes.Polygon,
				][n.type],
				o = { geometry: [], properties: {} };
			for (let a = 0; a < n.geometry.length; a++) {
				let l;
				Array.isArray(n.geometry[a][0])
					? (l = n.geometry[a].map(h => ({ x: h[0], y: h[1] })))
					: (l = [{ x: n.geometry[a][0], y: n.geometry[a][1] }]),
					o.geometry.push(l);
			}
			(o.properties = n.tags), this._render.render(e, r, o, s);
		}
		_getTileTexture(e, n, s, r, o) {
			if (r < (o.minLevel ?? 1) || r > (o.maxLevel ?? 20)) return new p.Texture();
			const a = e.getTile(r, n, s);
			if (!a) return new p.Texture();
			const l = this.drawTile(a, o);
			return new p.CanvasTexture(l);
		}
	}
	class Pt extends g.TileSource {
		constructor(e) {
			super(e);
			w(this, "dataType", "geojson");
			w(this, "style", {});
			Object.assign(this, e);
		}
	}
	function v(i, t) {
		(this.x = i), (this.y = t);
	}
	(v.prototype = {
		clone() {
			return new v(this.x, this.y);
		},
		add(i) {
			return this.clone()._add(i);
		},
		sub(i) {
			return this.clone()._sub(i);
		},
		multByPoint(i) {
			return this.clone()._multByPoint(i);
		},
		divByPoint(i) {
			return this.clone()._divByPoint(i);
		},
		mult(i) {
			return this.clone()._mult(i);
		},
		div(i) {
			return this.clone()._div(i);
		},
		rotate(i) {
			return this.clone()._rotate(i);
		},
		rotateAround(i, t) {
			return this.clone()._rotateAround(i, t);
		},
		matMult(i) {
			return this.clone()._matMult(i);
		},
		unit() {
			return this.clone()._unit();
		},
		perp() {
			return this.clone()._perp();
		},
		round() {
			return this.clone()._round();
		},
		mag() {
			return Math.sqrt(this.x * this.x + this.y * this.y);
		},
		equals(i) {
			return this.x === i.x && this.y === i.y;
		},
		dist(i) {
			return Math.sqrt(this.distSqr(i));
		},
		distSqr(i) {
			const t = i.x - this.x,
				e = i.y - this.y;
			return t * t + e * e;
		},
		angle() {
			return Math.atan2(this.y, this.x);
		},
		angleTo(i) {
			return Math.atan2(this.y - i.y, this.x - i.x);
		},
		angleWith(i) {
			return this.angleWithSep(i.x, i.y);
		},
		angleWithSep(i, t) {
			return Math.atan2(this.x * t - this.y * i, this.x * i + this.y * t);
		},
		_matMult(i) {
			const t = i[0] * this.x + i[1] * this.y,
				e = i[2] * this.x + i[3] * this.y;
			return (this.x = t), (this.y = e), this;
		},
		_add(i) {
			return (this.x += i.x), (this.y += i.y), this;
		},
		_sub(i) {
			return (this.x -= i.x), (this.y -= i.y), this;
		},
		_mult(i) {
			return (this.x *= i), (this.y *= i), this;
		},
		_div(i) {
			return (this.x /= i), (this.y /= i), this;
		},
		_multByPoint(i) {
			return (this.x *= i.x), (this.y *= i.y), this;
		},
		_divByPoint(i) {
			return (this.x /= i.x), (this.y /= i.y), this;
		},
		_unit() {
			return this._div(this.mag()), this;
		},
		_perp() {
			const i = this.y;
			return (this.y = this.x), (this.x = -i), this;
		},
		_rotate(i) {
			const t = Math.cos(i),
				e = Math.sin(i),
				n = t * this.x - e * this.y,
				s = e * this.x + t * this.y;
			return (this.x = n), (this.y = s), this;
		},
		_rotateAround(i, t) {
			const e = Math.cos(i),
				n = Math.sin(i),
				s = t.x + e * (this.x - t.x) - n * (this.y - t.y),
				r = t.y + n * (this.x - t.x) + e * (this.y - t.y);
			return (this.x = s), (this.y = r), this;
		},
		_round() {
			return (this.x = Math.round(this.x)), (this.y = Math.round(this.y)), this;
		},
		constructor: v,
	}),
		(v.convert = function (i) {
			if (i instanceof v) return i;
			if (Array.isArray(i)) return new v(+i[0], +i[1]);
			if (i.x !== void 0 && i.y !== void 0) return new v(+i.x, +i.y);
			throw new Error("Expected [x, y] or {x, y} point format");
		});
	class nt {
		constructor(t, e, n, s, r) {
			(this.properties = {}),
				(this.extent = n),
				(this.type = 0),
				(this.id = void 0),
				(this._pbf = t),
				(this._geometry = -1),
				(this._keys = s),
				(this._values = r),
				t.readFields(Mt, this, e);
		}
		loadGeometry() {
			const t = this._pbf;
			t.pos = this._geometry;
			const e = t.readVarint() + t.pos,
				n = [];
			let s,
				r = 1,
				o = 0,
				a = 0,
				l = 0;
			for (; t.pos < e; ) {
				if (o <= 0) {
					const h = t.readVarint();
					(r = h & 7), (o = h >> 3);
				}
				if ((o--, r === 1 || r === 2))
					(a += t.readSVarint()),
						(l += t.readSVarint()),
						r === 1 && (s && n.push(s), (s = [])),
						s && s.push(new v(a, l));
				else if (r === 7) s && s.push(s[0].clone());
				else throw new Error(`unknown command ${r}`);
			}
			return s && n.push(s), n;
		}
		bbox() {
			const t = this._pbf;
			t.pos = this._geometry;
			const e = t.readVarint() + t.pos;
			let n = 1,
				s = 0,
				r = 0,
				o = 0,
				a = 1 / 0,
				l = -1 / 0,
				h = 1 / 0,
				u = -1 / 0;
			for (; t.pos < e; ) {
				if (s <= 0) {
					const c = t.readVarint();
					(n = c & 7), (s = c >> 3);
				}
				if ((s--, n === 1 || n === 2))
					(r += t.readSVarint()),
						(o += t.readSVarint()),
						r < a && (a = r),
						r > l && (l = r),
						o < h && (h = o),
						o > u && (u = o);
				else if (n !== 7) throw new Error(`unknown command ${n}`);
			}
			return [a, h, l, u];
		}
		toGeoJSON(t, e, n) {
			const s = this.extent * Math.pow(2, n),
				r = this.extent * t,
				o = this.extent * e,
				a = this.loadGeometry();
			function l(d) {
				return [
					((d.x + r) * 360) / s - 180,
					(360 / Math.PI) * Math.atan(Math.exp((1 - ((d.y + o) * 2) / s) * Math.PI)) - 90,
				];
			}
			function h(d) {
				return d.map(l);
			}
			let u;
			if (this.type === 1) {
				const d = [];
				for (const x of a) d.push(x[0]);
				const f = h(d);
				u = d.length === 1 ? { type: "Point", coordinates: f[0] } : { type: "MultiPoint", coordinates: f };
			} else if (this.type === 2) {
				const d = a.map(h);
				u =
					d.length === 1
						? { type: "LineString", coordinates: d[0] }
						: { type: "MultiLineString", coordinates: d };
			} else if (this.type === 3) {
				const d = Vt(a),
					f = [];
				for (const x of d) f.push(x.map(h));
				u = f.length === 1 ? { type: "Polygon", coordinates: f[0] } : { type: "MultiPolygon", coordinates: f };
			} else throw new Error("unknown feature type");
			const c = { type: "Feature", geometry: u, properties: this.properties };
			return this.id != null && (c.id = this.id), c;
		}
	}
	nt.types = ["Unknown", "Point", "LineString", "Polygon"];
	function Mt(i, t, e) {
		i === 1
			? (t.id = e.readVarint())
			: i === 2
				? St(e, t)
				: i === 3
					? (t.type = e.readVarint())
					: i === 4 && (t._geometry = e.pos);
	}
	function St(i, t) {
		const e = i.readVarint() + i.pos;
		for (; i.pos < e; ) {
			const n = t._keys[i.readVarint()],
				s = t._values[i.readVarint()];
			t.properties[n] = s;
		}
	}
	function Vt(i) {
		const t = i.length;
		if (t <= 1) return [i];
		const e = [];
		let n, s;
		for (let r = 0; r < t; r++) {
			const o = _t(i[r]);
			o !== 0 && (s === void 0 && (s = o < 0), s === o < 0 ? (n && e.push(n), (n = [i[r]])) : n && n.push(i[r]));
		}
		return n && e.push(n), e;
	}
	function _t(i) {
		let t = 0;
		for (let e = 0, n = i.length, s = n - 1, r, o; e < n; s = e++)
			(r = i[e]), (o = i[s]), (t += (o.x - r.x) * (r.y + o.y));
		return t;
	}
	class Tt {
		constructor(t, e) {
			(this.version = 1),
				(this.name = ""),
				(this.extent = 4096),
				(this.length = 0),
				(this._pbf = t),
				(this._keys = []),
				(this._values = []),
				(this._features = []),
				t.readFields(Lt, this, e),
				(this.length = this._features.length);
		}
		feature(t) {
			if (t < 0 || t >= this._features.length) throw new Error("feature index out of bounds");
			this._pbf.pos = this._features[t];
			const e = this._pbf.readVarint() + this._pbf.pos;
			return new nt(this._pbf, e, this.extent, this._keys, this._values);
		}
	}
	function Lt(i, t, e) {
		i === 15
			? (t.version = e.readVarint())
			: i === 1
				? (t.name = e.readString())
				: i === 5
					? (t.extent = e.readVarint())
					: i === 2
						? t._features.push(e.pos)
						: i === 3
							? t._keys.push(e.readString())
							: i === 4 && t._values.push(Et(e));
	}
	function Et(i) {
		let t = null;
		const e = i.readVarint() + i.pos;
		for (; i.pos < e; ) {
			const n = i.readVarint() >> 3;
			t =
				n === 1
					? i.readString()
					: n === 2
						? i.readFloat()
						: n === 3
							? i.readDouble()
							: n === 4
								? i.readVarint64()
								: n === 5
									? i.readVarint()
									: n === 6
										? i.readSVarint()
										: n === 7
											? i.readBoolean()
											: null;
		}
		return t;
	}
	class vt {
		constructor(t, e) {
			this.layers = t.readFields(Bt, {}, e);
		}
	}
	function Bt(i, t, e) {
		if (i === 3) {
			const n = new Tt(e, e.readVarint() + e.pos);
			n.length && (t[n.name] = n);
		}
	}
	const R = 65536 * 65536,
		st = 1 / R,
		It = 12,
		rt = typeof TextDecoder > "u" ? null : new TextDecoder("utf-8"),
		q = 0,
		k = 1,
		C = 2,
		X = 5;
	class Dt {
		constructor(t = new Uint8Array(16)) {
			(this.buf = ArrayBuffer.isView(t) ? t : new Uint8Array(t)),
				(this.dataView = new DataView(this.buf.buffer)),
				(this.pos = 0),
				(this.type = 0),
				(this.length = this.buf.length);
		}
		readFields(t, e, n = this.length) {
			for (; this.pos < n; ) {
				const s = this.readVarint(),
					r = s >> 3,
					o = this.pos;
				(this.type = s & 7), t(r, e, this), this.pos === o && this.skip(s);
			}
			return e;
		}
		readMessage(t, e) {
			return this.readFields(t, e, this.readVarint() + this.pos);
		}
		readFixed32() {
			const t = this.dataView.getUint32(this.pos, !0);
			return (this.pos += 4), t;
		}
		readSFixed32() {
			const t = this.dataView.getInt32(this.pos, !0);
			return (this.pos += 4), t;
		}
		readFixed64() {
			const t = this.dataView.getUint32(this.pos, !0) + this.dataView.getUint32(this.pos + 4, !0) * R;
			return (this.pos += 8), t;
		}
		readSFixed64() {
			const t = this.dataView.getUint32(this.pos, !0) + this.dataView.getInt32(this.pos + 4, !0) * R;
			return (this.pos += 8), t;
		}
		readFloat() {
			const t = this.dataView.getFloat32(this.pos, !0);
			return (this.pos += 4), t;
		}
		readDouble() {
			const t = this.dataView.getFloat64(this.pos, !0);
			return (this.pos += 8), t;
		}
		readVarint(t) {
			const e = this.buf;
			let n, s;
			return (
				(s = e[this.pos++]),
				(n = s & 127),
				s < 128 ||
				((s = e[this.pos++]), (n |= (s & 127) << 7), s < 128) ||
				((s = e[this.pos++]), (n |= (s & 127) << 14), s < 128) ||
				((s = e[this.pos++]), (n |= (s & 127) << 21), s < 128)
					? n
					: ((s = e[this.pos]), (n |= (s & 15) << 28), Ct(n, t, this))
			);
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
			const t = this.readVarint() + this.pos,
				e = this.pos;
			return (this.pos = t), t - e >= It && rt ? rt.decode(this.buf.subarray(e, t)) : Rt(this.buf, e, t);
		}
		readBytes() {
			const t = this.readVarint() + this.pos,
				e = this.buf.subarray(this.pos, t);
			return (this.pos = t), e;
		}
		readPackedVarint(t = [], e) {
			const n = this.readPackedEnd();
			for (; this.pos < n; ) t.push(this.readVarint(e));
			return t;
		}
		readPackedSVarint(t = []) {
			const e = this.readPackedEnd();
			for (; this.pos < e; ) t.push(this.readSVarint());
			return t;
		}
		readPackedBoolean(t = []) {
			const e = this.readPackedEnd();
			for (; this.pos < e; ) t.push(this.readBoolean());
			return t;
		}
		readPackedFloat(t = []) {
			const e = this.readPackedEnd();
			for (; this.pos < e; ) t.push(this.readFloat());
			return t;
		}
		readPackedDouble(t = []) {
			const e = this.readPackedEnd();
			for (; this.pos < e; ) t.push(this.readDouble());
			return t;
		}
		readPackedFixed32(t = []) {
			const e = this.readPackedEnd();
			for (; this.pos < e; ) t.push(this.readFixed32());
			return t;
		}
		readPackedSFixed32(t = []) {
			const e = this.readPackedEnd();
			for (; this.pos < e; ) t.push(this.readSFixed32());
			return t;
		}
		readPackedFixed64(t = []) {
			const e = this.readPackedEnd();
			for (; this.pos < e; ) t.push(this.readFixed64());
			return t;
		}
		readPackedSFixed64(t = []) {
			const e = this.readPackedEnd();
			for (; this.pos < e; ) t.push(this.readSFixed64());
			return t;
		}
		readPackedEnd() {
			return this.type === C ? this.readVarint() + this.pos : this.pos + 1;
		}
		skip(t) {
			const e = t & 7;
			if (e === q) for (; this.buf[this.pos++] > 127; );
			else if (e === C) this.pos = this.readVarint() + this.pos;
			else if (e === X) this.pos += 4;
			else if (e === k) this.pos += 8;
			else throw new Error(`Unimplemented type: ${e}`);
		}
		writeTag(t, e) {
			this.writeVarint((t << 3) | e);
		}
		realloc(t) {
			let e = this.length || 16;
			for (; e < this.pos + t; ) e *= 2;
			if (e !== this.length) {
				const n = new Uint8Array(e);
				n.set(this.buf), (this.buf = n), (this.dataView = new DataView(n.buffer)), (this.length = e);
			}
		}
		finish() {
			return (this.length = this.pos), (this.pos = 0), this.buf.subarray(0, this.length);
		}
		writeFixed32(t) {
			this.realloc(4), this.dataView.setInt32(this.pos, t, !0), (this.pos += 4);
		}
		writeSFixed32(t) {
			this.realloc(4), this.dataView.setInt32(this.pos, t, !0), (this.pos += 4);
		}
		writeFixed64(t) {
			this.realloc(8),
				this.dataView.setInt32(this.pos, t & -1, !0),
				this.dataView.setInt32(this.pos + 4, Math.floor(t * st), !0),
				(this.pos += 8);
		}
		writeSFixed64(t) {
			this.realloc(8),
				this.dataView.setInt32(this.pos, t & -1, !0),
				this.dataView.setInt32(this.pos + 4, Math.floor(t * st), !0),
				(this.pos += 8);
		}
		writeVarint(t) {
			if (((t = +t || 0), t > 268435455 || t < 0)) {
				bt(t, this);
				return;
			}
			this.realloc(4),
				(this.buf[this.pos++] = (t & 127) | (t > 127 ? 128 : 0)),
				!(t <= 127) &&
					((this.buf[this.pos++] = ((t >>>= 7) & 127) | (t > 127 ? 128 : 0)),
					!(t <= 127) &&
						((this.buf[this.pos++] = ((t >>>= 7) & 127) | (t > 127 ? 128 : 0)),
						!(t <= 127) && (this.buf[this.pos++] = (t >>> 7) & 127)));
		}
		writeSVarint(t) {
			this.writeVarint(t < 0 ? -t * 2 - 1 : t * 2);
		}
		writeBoolean(t) {
			this.writeVarint(+t);
		}
		writeString(t) {
			(t = String(t)), this.realloc(t.length * 4), this.pos++;
			const e = this.pos;
			this.pos = qt(this.buf, t, this.pos);
			const n = this.pos - e;
			n >= 128 && ot(e, n, this), (this.pos = e - 1), this.writeVarint(n), (this.pos += n);
		}
		writeFloat(t) {
			this.realloc(4), this.dataView.setFloat32(this.pos, t, !0), (this.pos += 4);
		}
		writeDouble(t) {
			this.realloc(8), this.dataView.setFloat64(this.pos, t, !0), (this.pos += 8);
		}
		writeBytes(t) {
			const e = t.length;
			this.writeVarint(e), this.realloc(e);
			for (let n = 0; n < e; n++) this.buf[this.pos++] = t[n];
		}
		writeRawMessage(t, e) {
			this.pos++;
			const n = this.pos;
			t(e, this);
			const s = this.pos - n;
			s >= 128 && ot(n, s, this), (this.pos = n - 1), this.writeVarint(s), (this.pos += s);
		}
		writeMessage(t, e, n) {
			this.writeTag(t, C), this.writeRawMessage(e, n);
		}
		writePackedVarint(t, e) {
			e.length && this.writeMessage(t, Xt, e);
		}
		writePackedSVarint(t, e) {
			e.length && this.writeMessage(t, Ot, e);
		}
		writePackedBoolean(t, e) {
			e.length && this.writeMessage(t, Jt, e);
		}
		writePackedFloat(t, e) {
			e.length && this.writeMessage(t, Gt, e);
		}
		writePackedDouble(t, e) {
			e.length && this.writeMessage(t, Nt, e);
		}
		writePackedFixed32(t, e) {
			e.length && this.writeMessage(t, At, e);
		}
		writePackedSFixed32(t, e) {
			e.length && this.writeMessage(t, Ut, e);
		}
		writePackedFixed64(t, e) {
			e.length && this.writeMessage(t, Zt, e);
		}
		writePackedSFixed64(t, e) {
			e.length && this.writeMessage(t, jt, e);
		}
		writeBytesField(t, e) {
			this.writeTag(t, C), this.writeBytes(e);
		}
		writeFixed32Field(t, e) {
			this.writeTag(t, X), this.writeFixed32(e);
		}
		writeSFixed32Field(t, e) {
			this.writeTag(t, X), this.writeSFixed32(e);
		}
		writeFixed64Field(t, e) {
			this.writeTag(t, k), this.writeFixed64(e);
		}
		writeSFixed64Field(t, e) {
			this.writeTag(t, k), this.writeSFixed64(e);
		}
		writeVarintField(t, e) {
			this.writeTag(t, q), this.writeVarint(e);
		}
		writeSVarintField(t, e) {
			this.writeTag(t, q), this.writeSVarint(e);
		}
		writeStringField(t, e) {
			this.writeTag(t, C), this.writeString(e);
		}
		writeFloatField(t, e) {
			this.writeTag(t, X), this.writeFloat(e);
		}
		writeDoubleField(t, e) {
			this.writeTag(t, k), this.writeDouble(e);
		}
		writeBooleanField(t, e) {
			this.writeVarintField(t, +e);
		}
	}
	function Ct(i, t, e) {
		const n = e.buf;
		let s, r;
		if (
			((r = n[e.pos++]),
			(s = (r & 112) >> 4),
			r < 128 ||
				((r = n[e.pos++]), (s |= (r & 127) << 3), r < 128) ||
				((r = n[e.pos++]), (s |= (r & 127) << 10), r < 128) ||
				((r = n[e.pos++]), (s |= (r & 127) << 17), r < 128) ||
				((r = n[e.pos++]), (s |= (r & 127) << 24), r < 128) ||
				((r = n[e.pos++]), (s |= (r & 1) << 31), r < 128))
		)
			return I(i, s, t);
		throw new Error("Expected varint not more than 10 bytes");
	}
	function I(i, t, e) {
		return e ? t * 4294967296 + (i >>> 0) : (t >>> 0) * 4294967296 + (i >>> 0);
	}
	function bt(i, t) {
		let e, n;
		if (
			(i >= 0
				? ((e = i % 4294967296 | 0), (n = (i / 4294967296) | 0))
				: ((e = ~(-i % 4294967296)),
					(n = ~(-i / 4294967296)),
					e ^ 4294967295 ? (e = (e + 1) | 0) : ((e = 0), (n = (n + 1) | 0))),
			i >= 18446744073709552e3 || i < -18446744073709552e3)
		)
			throw new Error("Given varint doesn't fit into 10 bytes");
		t.realloc(10), Yt(e, n, t), kt(n, t);
	}
	function Yt(i, t, e) {
		(e.buf[e.pos++] = (i & 127) | 128),
			(i >>>= 7),
			(e.buf[e.pos++] = (i & 127) | 128),
			(i >>>= 7),
			(e.buf[e.pos++] = (i & 127) | 128),
			(i >>>= 7),
			(e.buf[e.pos++] = (i & 127) | 128),
			(i >>>= 7),
			(e.buf[e.pos] = i & 127);
	}
	function kt(i, t) {
		const e = (i & 7) << 4;
		(t.buf[t.pos++] |= e | ((i >>>= 3) ? 128 : 0)),
			i &&
				((t.buf[t.pos++] = (i & 127) | ((i >>>= 7) ? 128 : 0)),
				i &&
					((t.buf[t.pos++] = (i & 127) | ((i >>>= 7) ? 128 : 0)),
					i &&
						((t.buf[t.pos++] = (i & 127) | ((i >>>= 7) ? 128 : 0)),
						i &&
							((t.buf[t.pos++] = (i & 127) | ((i >>>= 7) ? 128 : 0)), i && (t.buf[t.pos++] = i & 127)))));
	}
	function ot(i, t, e) {
		const n = t <= 16383 ? 1 : t <= 2097151 ? 2 : t <= 268435455 ? 3 : Math.floor(Math.log(t) / (Math.LN2 * 7));
		e.realloc(n);
		for (let s = e.pos - 1; s >= i; s--) e.buf[s + n] = e.buf[s];
	}
	function Xt(i, t) {
		for (let e = 0; e < i.length; e++) t.writeVarint(i[e]);
	}
	function Ot(i, t) {
		for (let e = 0; e < i.length; e++) t.writeSVarint(i[e]);
	}
	function Gt(i, t) {
		for (let e = 0; e < i.length; e++) t.writeFloat(i[e]);
	}
	function Nt(i, t) {
		for (let e = 0; e < i.length; e++) t.writeDouble(i[e]);
	}
	function Jt(i, t) {
		for (let e = 0; e < i.length; e++) t.writeBoolean(i[e]);
	}
	function At(i, t) {
		for (let e = 0; e < i.length; e++) t.writeFixed32(i[e]);
	}
	function Ut(i, t) {
		for (let e = 0; e < i.length; e++) t.writeSFixed32(i[e]);
	}
	function Zt(i, t) {
		for (let e = 0; e < i.length; e++) t.writeFixed64(i[e]);
	}
	function jt(i, t) {
		for (let e = 0; e < i.length; e++) t.writeSFixed64(i[e]);
	}
	function Rt(i, t, e) {
		let n = "",
			s = t;
		for (; s < e; ) {
			const r = i[s];
			let o = null,
				a = r > 239 ? 4 : r > 223 ? 3 : r > 191 ? 2 : 1;
			if (s + a > e) break;
			let l, h, u;
			a === 1
				? r < 128 && (o = r)
				: a === 2
					? ((l = i[s + 1]), (l & 192) === 128 && ((o = ((r & 31) << 6) | (l & 63)), o <= 127 && (o = null)))
					: a === 3
						? ((l = i[s + 1]),
							(h = i[s + 2]),
							(l & 192) === 128 &&
								(h & 192) === 128 &&
								((o = ((r & 15) << 12) | ((l & 63) << 6) | (h & 63)),
								(o <= 2047 || (o >= 55296 && o <= 57343)) && (o = null)))
						: a === 4 &&
							((l = i[s + 1]),
							(h = i[s + 2]),
							(u = i[s + 3]),
							(l & 192) === 128 &&
								(h & 192) === 128 &&
								(u & 192) === 128 &&
								((o = ((r & 15) << 18) | ((l & 63) << 12) | ((h & 63) << 6) | (u & 63)),
								(o <= 65535 || o >= 1114112) && (o = null))),
				o === null
					? ((o = 65533), (a = 1))
					: o > 65535 &&
						((o -= 65536),
						(n += String.fromCharCode(((o >>> 10) & 1023) | 55296)),
						(o = 56320 | (o & 1023))),
				(n += String.fromCharCode(o)),
				(s += a);
		}
		return n;
	}
	function qt(i, t, e) {
		for (let n = 0, s, r; n < t.length; n++) {
			if (((s = t.charCodeAt(n)), s > 55295 && s < 57344))
				if (r)
					if (s < 56320) {
						(i[e++] = 239), (i[e++] = 191), (i[e++] = 189), (r = s);
						continue;
					} else (s = ((r - 55296) << 10) | (s - 56320) | 65536), (r = null);
				else {
					s > 56319 || n + 1 === t.length ? ((i[e++] = 239), (i[e++] = 191), (i[e++] = 189)) : (r = s);
					continue;
				}
			else r && ((i[e++] = 239), (i[e++] = 191), (i[e++] = 189), (r = null));
			s < 128
				? (i[e++] = s)
				: (s < 2048
						? (i[e++] = (s >> 6) | 192)
						: (s < 65536
								? (i[e++] = (s >> 12) | 224)
								: ((i[e++] = (s >> 18) | 240), (i[e++] = ((s >> 12) & 63) | 128)),
							(i[e++] = ((s >> 6) & 63) | 128)),
					(i[e++] = (s & 63) | 128));
		}
		return e;
	}
	class Ht extends g.TileMaterialLoader {
		constructor() {
			super();
			w(this, "dataType", "mvt");
			w(this, "info", { version: "0.10.0", author: "GuoJF", description: "MVT瓦片加载器" });
			w(this, "_loader", new p.FileLoader(g.LoaderFactory.manager));
			w(this, "_render", new g.VectorTileRender());
			this._loader.setResponseType("arraybuffer");
		}
		async doLoad(e, n) {
			const s = n.source,
				r = "style" in s ? s.style : s.userData.style,
				o = await this._loader.loadAsync(e).catch(() => new p.Texture()),
				a = new vt(new Dt(o)),
				l = this.drawTile(a, r, n.z);
			return new p.CanvasTexture(l);
		}
		drawTile(e, n, s) {
			const l = new OffscreenCanvas(256, 256).getContext("2d");
			if (l) {
				if ((l.scale(1, -1), l.translate(0, -256), n))
					for (const h in n.layer) {
						const u = n.layer[h];
						if (n && (s < (u.minLevel ?? 1) || s > (u.maxLevel ?? 20))) continue;
						const c = e.layers[h];
						if (c) {
							const d = 256 / c.extent;
							this._renderLayer(l, c, u, d);
						}
					}
				else
					for (const h in e.layers) {
						const u = e.layers[h],
							c = 256 / u.extent;
						this._renderLayer(l, u, void 0, c);
					}
				return l.canvas.transferToImageBitmap();
			} else throw new Error("Canvas context is not available");
		}
		_renderLayer(e, n, s, r = 1) {
			e.save();
			for (let o = 0; o < n.length; o++) {
				const a = n.feature(o);
				this._renderFeature(e, a, s, r);
			}
			return e.restore(), this;
		}
		_renderFeature(e, n, s = {}, r = 1) {
			const o = [
					g.VectorFeatureTypes.Unknown,
					g.VectorFeatureTypes.Point,
					g.VectorFeatureTypes.Linestring,
					g.VectorFeatureTypes.Polygon,
				][n.type],
				a = { geometry: n.loadGeometry(), properties: n.properties };
			this._render.render(e, o, a, s, r);
		}
	}
	class $t extends g.TileSource {
		constructor(e) {
			super(e);
			w(this, "dataType", "mvt");
			Object.assign(this, e);
		}
	}
	(y.GeoJSONLoader = Ft),
		(y.GeoJSONSource = Pt),
		(y.MVTLoader = Ht),
		(y.MVTSource = $t),
		Object.defineProperty(y, Symbol.toStringTag, { value: "Module" });
});
