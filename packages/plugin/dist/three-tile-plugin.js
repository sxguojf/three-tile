import { TileCanvasLoader as Pt, TileMap as FA, LoaderFactory as se, TileMaterial as _i, TileSource as j, TileGeometry as Ji, TileMaterialLoader as Xt, VectorTileRender as jt, VectorFeatureTypes as hA } from "three-tile";
import { MeshNormalMaterial as Oi, Color as Vi, MeshBasicMaterial as Ki, ImageLoader as Hi, Texture as ne, SRGBColorSpace as Pi, FileLoader as Je, MathUtils as Xi, CanvasTexture as Zt } from "three";
class ji extends Pt {
  /** Loader info */
  info = {
    version: "0.10.0",
    description: "Tile debug image loader. It will draw a rectangle and coordinate on the tile."
  };
  /** Source data type */
  dataType = "debug";
  /**
   * Draw tile on canvas
   * @param ctx Tile canvas context
   * @param params Tile load params
   */
  drawTile(e, A) {
    const { x: i, y: n, z: r, bounds: g, lonLatBounds: a } = A, h = e.canvas.width, o = e.canvas.height;
    e.strokeStyle = "#ccc", e.lineWidth = 4, e.strokeRect(5, 5, h - 10, o - 10), e.fillStyle = "white", e.shadowColor = "black", e.shadowBlur = 5, e.shadowOffsetX = 1, e.shadowOffsetY = 1, e.font = "bold 20px arial", e.textAlign = "center", e.fillText(`Level: ${r}`, h / 2, 50), e.fillText(`[${i}, ${n}]`, o / 2, 80);
    const s = h / 2;
    e.font = "14px arial", e.fillText(`[${g[0].toFixed(3)}, ${g[1].toFixed(3)}]`, s, o - 50), e.fillText(`[${g[2].toFixed(3)}, ${g[3].toFixed(3)}]`, s, o - 30), a && (e.fillText(`[${a[0].toFixed(3)}, ${a[1].toFixed(3)}]`, s, o - 120), e.fillText(`[${a[2].toFixed(3)}, ${a[3].toFixed(3)}]`, s, o - 100));
  }
}
FA.registerImgLoader(new ji());
class Zi extends Pt {
  info = {
    version: "0.10.0",
    description: "Tile debug image loader. It will draw a rectangle and coordinate on the tile."
  };
  dataType = "logo";
  /**
   * Draw tile on canvas
   * @param ctx Tile canvas context
   * @param params Tile load params
   */
  drawTile(e, A) {
    e.fillStyle = "white", e.shadowColor = "black", e.shadowBlur = 5, e.shadowOffsetX = 1, e.shadowOffsetY = 1, e.font = "bold 14px arial", e.textAlign = "center", e.translate(e.canvas.width / 2, e.canvas.height / 2), e.rotate(30 * Math.PI / 180), e.fillText(`${A.source.attribution}`, 0, 0);
  }
}
FA.registerImgLoader(new Zi());
class zi {
  info = {
    version: "0.10.0",
    description: "Tile normal material loader."
  };
  dataType = "normal";
  async load(e) {
    return new Oi({
      // transparent: true,
      opacity: e.source.opacity,
      flatShading: !0
    });
  }
}
FA.registerImgLoader(new zi());
class Wi {
  info = {
    version: "0.10.0",
    description: "Tile wireframe material loader."
  };
  dataType = "wireframe";
  async load(e) {
    const A = new Vi(`hsl(${e.z * 14}, 100%, 50%)`);
    return new Ki({
      transparent: !0,
      wireframe: !0,
      color: A,
      opacity: e.source.opacity,
      depthTest: !1
    });
  }
}
FA.registerImgLoader(new Wi());
class $i {
  info = {
    version: "0.10.0",
    description: "Single image loader. It can load single image to bounds and stick to the ground."
  };
  dataType = "single-image";
  // private _image?: HTMLImageElement | undefined;
  _imageLoader = new Hi(se.manager);
  /**
   * 加载材质
   * @param source 数据源
   * @param tile 瓦片
   * @returns 材质
   */
  async load(e) {
    const { source: A, bounds: i, z: n } = e, r = new _i({
      transparent: !0,
      opacity: A.opacity
    }), g = A._getUrl(0, 0, 0);
    return n < A.minLevel || n > A.maxLevel || !g ? r : A.image?.complete ? (this._setTexture(r, A.image, A, i), r) : (console.log("loadi image...", g), A.image = await this._imageLoader.loadAsync(g), this._setTexture(r, A.image, A, i), r);
  }
  _setTexture(e, A, i, n) {
    const r = this._getTileTexture(A, i, n);
    e.setTexture(r), r.needsUpdate = !0;
  }
  _getTileTexture(e, A, i) {
    const n = A, r = 256, g = new OffscreenCanvas(r, r);
    if (e) {
      const h = g.getContext("2d"), o = n._projectionBounds, s = e.width, I = e.height, c = (o[2] - o[0]) / s, l = (o[3] - o[1]) / I, f = (i[0] - o[0]) / c, d = (o[3] - i[3]) / l, B = (i[2] - i[0]) / c, C = (i[3] - i[1]) / l;
      h.drawImage(e, f, d, B, C, 0, 0, r, r);
    }
    const a = new ne(g);
    return a.colorSpace = Pi, a;
  }
}
class aa extends j {
  dataType = "image";
  image;
}
FA.registerImgLoader(new $i());
function Z(t) {
  return (e, ...A) => An(t, e, A);
}
function SA(t, e) {
  return Z(
    zt(
      t,
      e
    ).get
  );
}
const {
  apply: An,
  getOwnPropertyDescriptor: zt,
  getPrototypeOf: Oe,
  ownKeys: en
} = Reflect, {
  iterator: YA,
  toStringTag: tn
} = Symbol, nn = Object, {
  create: Ve,
  defineProperty: rn
} = nn, sn = Array, on = sn.prototype, Wt = on[YA], an = Z(Wt), $t = ArrayBuffer, gn = $t.prototype;
SA(gn, "byteLength");
const nt = typeof SharedArrayBuffer < "u" ? SharedArrayBuffer : null;
nt && SA(nt.prototype, "byteLength");
const Ai = Oe(Uint8Array);
Ai.from;
const z = Ai.prototype;
z[YA];
Z(z.keys);
Z(
  z.values
);
Z(
  z.entries
);
Z(z.set);
Z(
  z.reverse
);
Z(z.fill);
Z(
  z.copyWithin
);
Z(z.sort);
Z(z.slice);
Z(
  z.subarray
);
SA(
  z,
  "buffer"
);
SA(
  z,
  "byteOffset"
);
SA(
  z,
  "length"
);
SA(
  z,
  tn
);
const In = Uint8Array, ei = Uint16Array, Ke = Uint32Array, ln = Float32Array, RA = Oe([][YA]()), ti = Z(RA.next), fn = Z(function* () {
}().next), cn = Oe(RA), Bn = DataView.prototype, hn = Z(
  Bn.getUint16
), He = WeakMap, ii = He.prototype, ni = Z(ii.get), Cn = Z(ii.set), ri = new He(), En = Ve(null, {
  next: {
    value: function() {
      const e = ni(ri, this);
      return ti(e);
    }
  },
  [YA]: {
    value: function() {
      return this;
    }
  }
});
function Qn(t) {
  if (t[YA] === Wt && RA.next === ti)
    return t;
  const e = Ve(En);
  return Cn(ri, e, an(t)), e;
}
const un = new He(), dn = Ve(cn, {
  next: {
    value: function() {
      const e = ni(un, this);
      return fn(e);
    },
    writable: !0,
    configurable: !0
  }
});
for (const t of en(RA))
  t !== "next" && rn(dn, t, zt(RA, t));
const si = new $t(4), wn = new ln(si), yn = new Ke(si), rA = new ei(512), sA = new In(512);
for (let t = 0; t < 256; ++t) {
  const e = t - 127;
  e < -24 ? (rA[t] = 0, rA[t | 256] = 32768, sA[t] = 24, sA[t | 256] = 24) : e < -14 ? (rA[t] = 1024 >> -e - 14, rA[t | 256] = 1024 >> -e - 14 | 32768, sA[t] = -e - 1, sA[t | 256] = -e - 1) : e <= 15 ? (rA[t] = e + 15 << 10, rA[t | 256] = e + 15 << 10 | 32768, sA[t] = 13, sA[t | 256] = 13) : e < 128 ? (rA[t] = 31744, rA[t | 256] = 64512, sA[t] = 24, sA[t | 256] = 24) : (rA[t] = 31744, rA[t | 256] = 64512, sA[t] = 13, sA[t | 256] = 13);
}
const Pe = new Ke(2048);
for (let t = 1; t < 1024; ++t) {
  let e = t << 13, A = 0;
  for (; !(e & 8388608); )
    e <<= 1, A -= 8388608;
  e &= -8388609, A += 947912704, Pe[t] = e | A;
}
for (let t = 1024; t < 2048; ++t)
  Pe[t] = 939524096 + (t - 1024 << 13);
const kA = new Ke(64);
for (let t = 1; t < 31; ++t)
  kA[t] = t << 23;
kA[31] = 1199570944;
kA[32] = 2147483648;
for (let t = 33; t < 63; ++t)
  kA[t] = 2147483648 + (t - 32 << 23);
kA[63] = 3347054592;
const oi = new ei(64);
for (let t = 1; t < 64; ++t)
  t !== 32 && (oi[t] = 1024);
function pn(t) {
  const e = t >> 10;
  return yn[0] = Pe[oi[e] + (t & 1023)] + kA[e], wn[0];
}
function ai(t, e, ...A) {
  return pn(
    hn(t, e, ...Qn(A))
  );
}
function Xe(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var je = { exports: {} };
function gi(t, e, A) {
  const i = A && A.debug || !1;
  i && console.log("[xml-utils] getting " + e + " in " + t);
  const n = typeof t == "object" ? t.outer : t, r = n.slice(0, n.indexOf(">") + 1), g = ['"', "'"];
  for (let a = 0; a < g.length; a++) {
    const h = g[a], o = e + "\\=" + h + "([^" + h + "]*)" + h;
    i && console.log("[xml-utils] pattern:", o);
    const I = new RegExp(o).exec(r);
    if (i && console.log("[xml-utils] match:", I), I) return I[1];
  }
}
je.exports = gi;
je.exports.default = gi;
var Dn = je.exports;
const le = /* @__PURE__ */ Xe(Dn);
var Ze = { exports: {} }, ze = { exports: {} }, We = { exports: {} };
function Ii(t, e, A) {
  const n = new RegExp(e).exec(t.slice(A));
  return n ? A + n.index : -1;
}
We.exports = Ii;
We.exports.default = Ii;
var xn = We.exports, $e = { exports: {} };
function li(t, e, A) {
  const n = new RegExp(e).exec(t.slice(A));
  return n ? A + n.index + n[0].length - 1 : -1;
}
$e.exports = li;
$e.exports.default = li;
var mn = $e.exports, At = { exports: {} };
function fi(t, e) {
  const A = new RegExp(e, "g"), i = t.match(A);
  return i ? i.length : 0;
}
At.exports = fi;
At.exports.default = fi;
var Fn = At.exports;
const Sn = xn, fe = mn, rt = Fn;
function ci(t, e, A) {
  const i = A && A.debug || !1, n = !(A && typeof A.nested === !1), r = A && A.startIndex || 0;
  i && console.log("[xml-utils] starting findTagByName with", e, " and ", A);
  const g = Sn(t, `<${e}[ 
>/]`, r);
  if (i && console.log("[xml-utils] start:", g), g === -1) return;
  const a = t.slice(g + e.length);
  let h = fe(a, "^[^<]*[ /]>", 0);
  const o = h !== -1 && a[h - 1] === "/";
  if (i && console.log("[xml-utils] selfClosing:", o), o === !1)
    if (n) {
      let l = 0, f = 1, d = 0;
      for (; (h = fe(a, "[ /]" + e + ">", l)) !== -1; ) {
        const B = a.substring(l, h + 1);
        if (f += rt(B, "<" + e + `[ 
	>]`), d += rt(B, "</" + e + ">"), d >= f) break;
        l = h;
      }
    } else
      h = fe(a, "[ /]" + e + ">", 0);
  const s = g + e.length + h + 1;
  if (i && console.log("[xml-utils] end:", s), s === -1) return;
  const I = t.slice(g, s);
  let c;
  return o ? c = null : c = I.slice(I.indexOf(">") + 1, I.lastIndexOf("<")), { inner: c, outer: I, start: g, end: s };
}
ze.exports = ci;
ze.exports.default = ci;
var kn = ze.exports;
const Mn = kn;
function Bi(t, e, A) {
  const i = [], n = A && A.debug || !1, r = A && typeof A.nested == "boolean" ? A.nested : !0;
  let g = A && A.startIndex || 0, a;
  for (; a = Mn(t, e, { debug: n, startIndex: g }); )
    r ? g = a.start + 1 + e.length : g = a.end, i.push(a);
  return n && console.log("findTagsByName found", i.length, "tags"), i;
}
Ze.exports = Bi;
Ze.exports.default = Bi;
var Gn = Ze.exports;
const bn = /* @__PURE__ */ Xe(Gn), LA = {
  // TIFF Baseline
  315: "Artist",
  258: "BitsPerSample",
  265: "CellLength",
  264: "CellWidth",
  320: "ColorMap",
  259: "Compression",
  33432: "Copyright",
  306: "DateTime",
  338: "ExtraSamples",
  266: "FillOrder",
  289: "FreeByteCounts",
  288: "FreeOffsets",
  291: "GrayResponseCurve",
  290: "GrayResponseUnit",
  316: "HostComputer",
  270: "ImageDescription",
  257: "ImageLength",
  256: "ImageWidth",
  271: "Make",
  281: "MaxSampleValue",
  280: "MinSampleValue",
  272: "Model",
  254: "NewSubfileType",
  274: "Orientation",
  262: "PhotometricInterpretation",
  284: "PlanarConfiguration",
  296: "ResolutionUnit",
  278: "RowsPerStrip",
  277: "SamplesPerPixel",
  305: "Software",
  279: "StripByteCounts",
  273: "StripOffsets",
  255: "SubfileType",
  263: "Threshholding",
  282: "XResolution",
  283: "YResolution",
  // TIFF Extended
  326: "BadFaxLines",
  327: "CleanFaxData",
  343: "ClipPath",
  328: "ConsecutiveBadFaxLines",
  433: "Decode",
  434: "DefaultImageColor",
  269: "DocumentName",
  336: "DotRange",
  321: "HalftoneHints",
  346: "Indexed",
  347: "JPEGTables",
  285: "PageName",
  297: "PageNumber",
  317: "Predictor",
  319: "PrimaryChromaticities",
  532: "ReferenceBlackWhite",
  339: "SampleFormat",
  340: "SMinSampleValue",
  341: "SMaxSampleValue",
  559: "StripRowCounts",
  330: "SubIFDs",
  292: "T4Options",
  293: "T6Options",
  325: "TileByteCounts",
  323: "TileLength",
  324: "TileOffsets",
  322: "TileWidth",
  301: "TransferFunction",
  318: "WhitePoint",
  344: "XClipPathUnits",
  286: "XPosition",
  529: "YCbCrCoefficients",
  531: "YCbCrPositioning",
  530: "YCbCrSubSampling",
  345: "YClipPathUnits",
  287: "YPosition",
  // EXIF
  37378: "ApertureValue",
  40961: "ColorSpace",
  36868: "DateTimeDigitized",
  36867: "DateTimeOriginal",
  34665: "Exif IFD",
  36864: "ExifVersion",
  33434: "ExposureTime",
  41728: "FileSource",
  37385: "Flash",
  40960: "FlashpixVersion",
  33437: "FNumber",
  42016: "ImageUniqueID",
  37384: "LightSource",
  37500: "MakerNote",
  37377: "ShutterSpeedValue",
  37510: "UserComment",
  // IPTC
  33723: "IPTC",
  // ICC
  34675: "ICC Profile",
  // XMP
  700: "XMP",
  // GDAL
  42112: "GDAL_METADATA",
  42113: "GDAL_NODATA",
  // Photoshop
  34377: "Photoshop",
  // GeoTiff
  33550: "ModelPixelScale",
  33922: "ModelTiepoint",
  34264: "ModelTransformation",
  34735: "GeoKeyDirectory",
  34736: "GeoDoubleParams",
  34737: "GeoAsciiParams",
  // LERC
  50674: "LercParameters"
}, aA = {};
for (const t in LA)
  LA.hasOwnProperty(t) && (aA[LA[t]] = parseInt(t, 10));
const Ln = [
  aA.BitsPerSample,
  aA.ExtraSamples,
  aA.SampleFormat,
  aA.StripByteCounts,
  aA.StripOffsets,
  aA.StripRowCounts,
  aA.TileByteCounts,
  aA.TileOffsets,
  aA.SubIFDs
], ce = {
  1: "BYTE",
  2: "ASCII",
  3: "SHORT",
  4: "LONG",
  5: "RATIONAL",
  6: "SBYTE",
  7: "UNDEFINED",
  8: "SSHORT",
  9: "SLONG",
  10: "SRATIONAL",
  11: "FLOAT",
  12: "DOUBLE",
  // IFD offset, suggested by https://owl.phy.queensu.ca/~phil/exiftool/standards.html
  13: "IFD",
  // introduced by BigTIFF
  16: "LONG8",
  17: "SLONG8",
  18: "IFD8"
}, _ = {};
for (const t in ce)
  ce.hasOwnProperty(t) && (_[ce[t]] = parseInt(t, 10));
const AA = {
  WhiteIsZero: 0,
  BlackIsZero: 1,
  RGB: 2,
  Palette: 3,
  CMYK: 5,
  YCbCr: 6,
  CIELab: 8
}, Un = {
  Unspecified: 0
}, vn = {
  AddCompression: 1
}, Be = {
  None: 0,
  Deflate: 1,
  Zstandard: 2
}, Rn = {
  1024: "GTModelTypeGeoKey",
  1025: "GTRasterTypeGeoKey",
  1026: "GTCitationGeoKey",
  2048: "GeographicTypeGeoKey",
  2049: "GeogCitationGeoKey",
  2050: "GeogGeodeticDatumGeoKey",
  2051: "GeogPrimeMeridianGeoKey",
  2052: "GeogLinearUnitsGeoKey",
  2053: "GeogLinearUnitSizeGeoKey",
  2054: "GeogAngularUnitsGeoKey",
  2055: "GeogAngularUnitSizeGeoKey",
  2056: "GeogEllipsoidGeoKey",
  2057: "GeogSemiMajorAxisGeoKey",
  2058: "GeogSemiMinorAxisGeoKey",
  2059: "GeogInvFlatteningGeoKey",
  2060: "GeogAzimuthUnitsGeoKey",
  2061: "GeogPrimeMeridianLongGeoKey",
  2062: "GeogTOWGS84GeoKey",
  3072: "ProjectedCSTypeGeoKey",
  3073: "PCSCitationGeoKey",
  3074: "ProjectionGeoKey",
  3075: "ProjCoordTransGeoKey",
  3076: "ProjLinearUnitsGeoKey",
  3077: "ProjLinearUnitSizeGeoKey",
  3078: "ProjStdParallel1GeoKey",
  3079: "ProjStdParallel2GeoKey",
  3080: "ProjNatOriginLongGeoKey",
  3081: "ProjNatOriginLatGeoKey",
  3082: "ProjFalseEastingGeoKey",
  3083: "ProjFalseNorthingGeoKey",
  3084: "ProjFalseOriginLongGeoKey",
  3085: "ProjFalseOriginLatGeoKey",
  3086: "ProjFalseOriginEastingGeoKey",
  3087: "ProjFalseOriginNorthingGeoKey",
  3088: "ProjCenterLongGeoKey",
  3089: "ProjCenterLatGeoKey",
  3090: "ProjCenterEastingGeoKey",
  3091: "ProjCenterNorthingGeoKey",
  3092: "ProjScaleAtNatOriginGeoKey",
  3093: "ProjScaleAtCenterGeoKey",
  3094: "ProjAzimuthAngleGeoKey",
  3095: "ProjStraightVertPoleLongGeoKey",
  3096: "ProjRectifiedGridAngleGeoKey",
  4096: "VerticalCSTypeGeoKey",
  4097: "VerticalCitationGeoKey",
  4098: "VerticalDatumGeoKey",
  4099: "VerticalUnitsGeoKey"
};
function Nn(t, e) {
  const { width: A, height: i } = t, n = new Uint8Array(A * i * 3);
  let r;
  for (let g = 0, a = 0; g < t.length; ++g, a += 3)
    r = 256 - t[g] / e * 256, n[a] = r, n[a + 1] = r, n[a + 2] = r;
  return n;
}
function Tn(t, e) {
  const { width: A, height: i } = t, n = new Uint8Array(A * i * 3);
  let r;
  for (let g = 0, a = 0; g < t.length; ++g, a += 3)
    r = t[g] / e * 256, n[a] = r, n[a + 1] = r, n[a + 2] = r;
  return n;
}
function qn(t, e) {
  const { width: A, height: i } = t, n = new Uint8Array(A * i * 3), r = e.length / 3, g = e.length / 3 * 2;
  for (let a = 0, h = 0; a < t.length; ++a, h += 3) {
    const o = t[a];
    n[h] = e[o] / 65536 * 256, n[h + 1] = e[o + r] / 65536 * 256, n[h + 2] = e[o + g] / 65536 * 256;
  }
  return n;
}
function Yn(t) {
  const { width: e, height: A } = t, i = new Uint8Array(e * A * 3);
  for (let n = 0, r = 0; n < t.length; n += 4, r += 3) {
    const g = t[n], a = t[n + 1], h = t[n + 2], o = t[n + 3];
    i[r] = 255 * ((255 - g) / 256) * ((255 - o) / 256), i[r + 1] = 255 * ((255 - a) / 256) * ((255 - o) / 256), i[r + 2] = 255 * ((255 - h) / 256) * ((255 - o) / 256);
  }
  return i;
}
function _n(t) {
  const { width: e, height: A } = t, i = new Uint8ClampedArray(e * A * 3);
  for (let n = 0, r = 0; n < t.length; n += 3, r += 3) {
    const g = t[n], a = t[n + 1], h = t[n + 2];
    i[r] = g + 1.402 * (h - 128), i[r + 1] = g - 0.34414 * (a - 128) - 0.71414 * (h - 128), i[r + 2] = g + 1.772 * (a - 128);
  }
  return i;
}
const Jn = 0.95047, On = 1, Vn = 1.08883;
function Kn(t) {
  const { width: e, height: A } = t, i = new Uint8Array(e * A * 3);
  for (let n = 0, r = 0; n < t.length; n += 3, r += 3) {
    const g = t[n + 0], a = t[n + 1] << 24 >> 24, h = t[n + 2] << 24 >> 24;
    let o = (g + 16) / 116, s = a / 500 + o, I = o - h / 200, c, l, f;
    s = Jn * (s * s * s > 8856e-6 ? s * s * s : (s - 16 / 116) / 7.787), o = On * (o * o * o > 8856e-6 ? o * o * o : (o - 16 / 116) / 7.787), I = Vn * (I * I * I > 8856e-6 ? I * I * I : (I - 16 / 116) / 7.787), c = s * 3.2406 + o * -1.5372 + I * -0.4986, l = s * -0.9689 + o * 1.8758 + I * 0.0415, f = s * 0.0557 + o * -0.204 + I * 1.057, c = c > 31308e-7 ? 1.055 * c ** (1 / 2.4) - 0.055 : 12.92 * c, l = l > 31308e-7 ? 1.055 * l ** (1 / 2.4) - 0.055 : 12.92 * l, f = f > 31308e-7 ? 1.055 * f ** (1 / 2.4) - 0.055 : 12.92 * f, i[r] = Math.max(0, Math.min(1, c)) * 255, i[r + 1] = Math.max(0, Math.min(1, l)) * 255, i[r + 2] = Math.max(0, Math.min(1, f)) * 255;
  }
  return i;
}
const hi = /* @__PURE__ */ new Map();
function EA(t, e) {
  Array.isArray(t) || (t = [t]), t.forEach((A) => hi.set(A, e));
}
async function Hn(t) {
  const e = hi.get(t.Compression);
  if (!e)
    throw new Error(`Unknown compression method identifier: ${t.Compression}`);
  const A = await e();
  return new A(t);
}
EA([void 0, 1], () => Promise.resolve().then(() => Ds).then((t) => t.default));
EA(5, () => Promise.resolve().then(() => ks).then((t) => t.default));
EA(6, () => {
  throw new Error("old style JPEG compression is not supported.");
});
EA(7, () => Promise.resolve().then(() => Us).then((t) => t.default));
EA([8, 32946], () => Promise.resolve().then(() => Zo).then((t) => t.default));
EA(32773, () => Promise.resolve().then(() => Wo).then((t) => t.default));
EA(
  34887,
  () => Promise.resolve().then(() => ia).then(async (t) => (await t.zstd.init(), t)).then((t) => t.default)
);
EA(50001, () => Promise.resolve().then(() => ra).then((t) => t.default));
function oe(t, e, A, i = 1) {
  return new (Object.getPrototypeOf(t)).constructor(e * A * i);
}
function Pn(t, e, A, i, n) {
  const r = e / i, g = A / n;
  return t.map((a) => {
    const h = oe(a, i, n);
    for (let o = 0; o < n; ++o) {
      const s = Math.min(Math.round(g * o), A - 1);
      for (let I = 0; I < i; ++I) {
        const c = Math.min(Math.round(r * I), e - 1), l = a[s * e + c];
        h[o * i + I] = l;
      }
    }
    return h;
  });
}
function xA(t, e, A) {
  return (1 - A) * t + A * e;
}
function Xn(t, e, A, i, n) {
  const r = e / i, g = A / n;
  return t.map((a) => {
    const h = oe(a, i, n);
    for (let o = 0; o < n; ++o) {
      const s = g * o, I = Math.floor(s), c = Math.min(Math.ceil(s), A - 1);
      for (let l = 0; l < i; ++l) {
        const f = r * l, d = f % 1, B = Math.floor(f), C = Math.min(Math.ceil(f), e - 1), u = a[I * e + B], p = a[I * e + C], Q = a[c * e + B], D = a[c * e + C], E = xA(
          xA(u, p, d),
          xA(Q, D, d),
          s % 1
        );
        h[o * i + l] = E;
      }
    }
    return h;
  });
}
function jn(t, e, A, i, n, r = "nearest") {
  switch (r.toLowerCase()) {
    case "nearest":
      return Pn(t, e, A, i, n);
    case "bilinear":
    case "linear":
      return Xn(t, e, A, i, n);
    default:
      throw new Error(`Unsupported resampling method: '${r}'`);
  }
}
function Zn(t, e, A, i, n, r) {
  const g = e / i, a = A / n, h = oe(t, i, n, r);
  for (let o = 0; o < n; ++o) {
    const s = Math.min(Math.round(a * o), A - 1);
    for (let I = 0; I < i; ++I) {
      const c = Math.min(Math.round(g * I), e - 1);
      for (let l = 0; l < r; ++l) {
        const f = t[s * e * r + c * r + l];
        h[o * i * r + I * r + l] = f;
      }
    }
  }
  return h;
}
function zn(t, e, A, i, n, r) {
  const g = e / i, a = A / n, h = oe(t, i, n, r);
  for (let o = 0; o < n; ++o) {
    const s = a * o, I = Math.floor(s), c = Math.min(Math.ceil(s), A - 1);
    for (let l = 0; l < i; ++l) {
      const f = g * l, d = f % 1, B = Math.floor(f), C = Math.min(Math.ceil(f), e - 1);
      for (let u = 0; u < r; ++u) {
        const p = t[I * e * r + B * r + u], Q = t[I * e * r + C * r + u], D = t[c * e * r + B * r + u], E = t[c * e * r + C * r + u], w = xA(
          xA(p, Q, d),
          xA(D, E, d),
          s % 1
        );
        h[o * i * r + l * r + u] = w;
      }
    }
  }
  return h;
}
function Wn(t, e, A, i, n, r, g = "nearest") {
  switch (g.toLowerCase()) {
    case "nearest":
      return Zn(
        t,
        e,
        A,
        i,
        n,
        r
      );
    case "bilinear":
    case "linear":
      return zn(
        t,
        e,
        A,
        i,
        n,
        r
      );
    default:
      throw new Error(`Unsupported resampling method: '${g}'`);
  }
}
function $n(t, e, A) {
  let i = 0;
  for (let n = e; n < A; ++n)
    i += t[n];
  return i;
}
function be(t, e, A) {
  switch (t) {
    case 1:
      if (e <= 8)
        return new Uint8Array(A);
      if (e <= 16)
        return new Uint16Array(A);
      if (e <= 32)
        return new Uint32Array(A);
      break;
    case 2:
      if (e === 8)
        return new Int8Array(A);
      if (e === 16)
        return new Int16Array(A);
      if (e === 32)
        return new Int32Array(A);
      break;
    case 3:
      switch (e) {
        case 16:
        case 32:
          return new Float32Array(A);
        case 64:
          return new Float64Array(A);
      }
      break;
  }
  throw Error("Unsupported data format/bitsPerSample");
}
function Ar(t, e) {
  return (t === 1 || t === 2) && e <= 32 && e % 8 === 0 ? !1 : !(t === 3 && (e === 16 || e === 32 || e === 64));
}
function er(t, e, A, i, n, r, g) {
  const a = new DataView(t), h = A === 2 ? g * r : g * r * i, o = A === 2 ? 1 : i, s = be(e, n, h), I = parseInt("1".repeat(n), 2);
  if (e === 1) {
    let c;
    A === 1 ? c = i * n : c = n;
    let l = r * c;
    l & 7 && (l = l + 7 & -8);
    for (let f = 0; f < g; ++f) {
      const d = f * l;
      for (let B = 0; B < r; ++B) {
        const C = d + B * o * n;
        for (let u = 0; u < o; ++u) {
          const p = C + u * n, Q = (f * r + B) * o + u, D = Math.floor(p / 8), E = p % 8;
          if (E + n <= 8)
            s[Q] = a.getUint8(D) >> 8 - n - E & I;
          else if (E + n <= 16)
            s[Q] = a.getUint16(D) >> 16 - n - E & I;
          else if (E + n <= 24) {
            const w = a.getUint16(D) << 8 | a.getUint8(D + 2);
            s[Q] = w >> 24 - n - E & I;
          } else
            s[Q] = a.getUint32(D) >> 32 - n - E & I;
        }
      }
    }
  }
  return s.buffer;
}
class tr {
  /**
   * @constructor
   * @param {Object} fileDirectory The parsed file directory
   * @param {Object} geoKeys The parsed geo-keys
   * @param {DataView} dataView The DataView for the underlying file.
   * @param {Boolean} littleEndian Whether the file is encoded in little or big endian
   * @param {Boolean} cache Whether or not decoded tiles shall be cached
   * @param {import('./source/basesource').BaseSource} source The datasource to read from
   */
  constructor(e, A, i, n, r, g) {
    this.fileDirectory = e, this.geoKeys = A, this.dataView = i, this.littleEndian = n, this.tiles = r ? {} : null, this.isTiled = !e.StripOffsets;
    const a = e.PlanarConfiguration;
    if (this.planarConfiguration = typeof a > "u" ? 1 : a, this.planarConfiguration !== 1 && this.planarConfiguration !== 2)
      throw new Error("Invalid planar configuration.");
    this.source = g;
  }
  /**
   * Returns the associated parsed file directory.
   * @returns {Object} the parsed file directory
   */
  getFileDirectory() {
    return this.fileDirectory;
  }
  /**
   * Returns the associated parsed geo keys.
   * @returns {Object} the parsed geo keys
   */
  getGeoKeys() {
    return this.geoKeys;
  }
  /**
   * Returns the width of the image.
   * @returns {Number} the width of the image
   */
  getWidth() {
    return this.fileDirectory.ImageWidth;
  }
  /**
   * Returns the height of the image.
   * @returns {Number} the height of the image
   */
  getHeight() {
    return this.fileDirectory.ImageLength;
  }
  /**
   * Returns the number of samples per pixel.
   * @returns {Number} the number of samples per pixel
   */
  getSamplesPerPixel() {
    return typeof this.fileDirectory.SamplesPerPixel < "u" ? this.fileDirectory.SamplesPerPixel : 1;
  }
  /**
   * Returns the width of each tile.
   * @returns {Number} the width of each tile
   */
  getTileWidth() {
    return this.isTiled ? this.fileDirectory.TileWidth : this.getWidth();
  }
  /**
   * Returns the height of each tile.
   * @returns {Number} the height of each tile
   */
  getTileHeight() {
    return this.isTiled ? this.fileDirectory.TileLength : typeof this.fileDirectory.RowsPerStrip < "u" ? Math.min(this.fileDirectory.RowsPerStrip, this.getHeight()) : this.getHeight();
  }
  getBlockWidth() {
    return this.getTileWidth();
  }
  getBlockHeight(e) {
    return this.isTiled || (e + 1) * this.getTileHeight() <= this.getHeight() ? this.getTileHeight() : this.getHeight() - e * this.getTileHeight();
  }
  /**
   * Calculates the number of bytes for each pixel across all samples. Only full
   * bytes are supported, an exception is thrown when this is not the case.
   * @returns {Number} the bytes per pixel
   */
  getBytesPerPixel() {
    let e = 0;
    for (let A = 0; A < this.fileDirectory.BitsPerSample.length; ++A)
      e += this.getSampleByteSize(A);
    return e;
  }
  getSampleByteSize(e) {
    if (e >= this.fileDirectory.BitsPerSample.length)
      throw new RangeError(`Sample index ${e} is out of range.`);
    return Math.ceil(this.fileDirectory.BitsPerSample[e] / 8);
  }
  getReaderForSample(e) {
    const A = this.fileDirectory.SampleFormat ? this.fileDirectory.SampleFormat[e] : 1, i = this.fileDirectory.BitsPerSample[e];
    switch (A) {
      case 1:
        if (i <= 8)
          return DataView.prototype.getUint8;
        if (i <= 16)
          return DataView.prototype.getUint16;
        if (i <= 32)
          return DataView.prototype.getUint32;
        break;
      case 2:
        if (i <= 8)
          return DataView.prototype.getInt8;
        if (i <= 16)
          return DataView.prototype.getInt16;
        if (i <= 32)
          return DataView.prototype.getInt32;
        break;
      case 3:
        switch (i) {
          case 16:
            return function(n, r) {
              return ai(this, n, r);
            };
          case 32:
            return DataView.prototype.getFloat32;
          case 64:
            return DataView.prototype.getFloat64;
        }
        break;
    }
    throw Error("Unsupported data format/bitsPerSample");
  }
  getSampleFormat(e = 0) {
    return this.fileDirectory.SampleFormat ? this.fileDirectory.SampleFormat[e] : 1;
  }
  getBitsPerSample(e = 0) {
    return this.fileDirectory.BitsPerSample[e];
  }
  getArrayForSample(e, A) {
    const i = this.getSampleFormat(e), n = this.getBitsPerSample(e);
    return be(i, n, A);
  }
  /**
   * Returns the decoded strip or tile.
   * @param {Number} x the strip or tile x-offset
   * @param {Number} y the tile y-offset (0 for stripped images)
   * @param {Number} sample the sample to get for separated samples
   * @param {import("./geotiff").Pool|import("./geotiff").BaseDecoder} poolOrDecoder the decoder or decoder pool
   * @param {AbortSignal} [signal] An AbortSignal that may be signalled if the request is
   *                               to be aborted
   * @returns {Promise.<ArrayBuffer>}
   */
  async getTileOrStrip(e, A, i, n, r) {
    const g = Math.ceil(this.getWidth() / this.getTileWidth()), a = Math.ceil(this.getHeight() / this.getTileHeight());
    let h;
    const { tiles: o } = this;
    this.planarConfiguration === 1 ? h = A * g + e : this.planarConfiguration === 2 && (h = i * g * a + A * g + e);
    let s, I;
    this.isTiled ? (s = this.fileDirectory.TileOffsets[h], I = this.fileDirectory.TileByteCounts[h]) : (s = this.fileDirectory.StripOffsets[h], I = this.fileDirectory.StripByteCounts[h]);
    const c = (await this.source.fetch([{ offset: s, length: I }], r))[0];
    let l;
    return o === null || !o[h] ? (l = (async () => {
      let f = await n.decode(this.fileDirectory, c);
      const d = this.getSampleFormat(), B = this.getBitsPerSample();
      return Ar(d, B) && (f = er(
        f,
        d,
        this.planarConfiguration,
        this.getSamplesPerPixel(),
        B,
        this.getTileWidth(),
        this.getBlockHeight(A)
      )), f;
    })(), o !== null && (o[h] = l)) : l = o[h], { x: e, y: A, sample: i, data: await l };
  }
  /**
   * Internal read function.
   * @private
   * @param {Array} imageWindow The image window in pixel coordinates
   * @param {Array} samples The selected samples (0-based indices)
   * @param {TypedArray|TypedArray[]} valueArrays The array(s) to write into
   * @param {Boolean} interleave Whether or not to write in an interleaved manner
   * @param {import("./geotiff").Pool|AbstractDecoder} poolOrDecoder the decoder or decoder pool
   * @param {number} width the width of window to be read into
   * @param {number} height the height of window to be read into
   * @param {number} resampleMethod the resampling method to be used when interpolating
   * @param {AbortSignal} [signal] An AbortSignal that may be signalled if the request is
   *                               to be aborted
   * @returns {Promise<ReadRasterResult>}
   */
  async _readRaster(e, A, i, n, r, g, a, h, o) {
    const s = this.getTileWidth(), I = this.getTileHeight(), c = this.getWidth(), l = this.getHeight(), f = Math.max(Math.floor(e[0] / s), 0), d = Math.min(
      Math.ceil(e[2] / s),
      Math.ceil(c / s)
    ), B = Math.max(Math.floor(e[1] / I), 0), C = Math.min(
      Math.ceil(e[3] / I),
      Math.ceil(l / I)
    ), u = e[2] - e[0];
    let p = this.getBytesPerPixel();
    const Q = [], D = [];
    for (let y = 0; y < A.length; ++y)
      this.planarConfiguration === 1 ? Q.push($n(this.fileDirectory.BitsPerSample, 0, A[y]) / 8) : Q.push(0), D.push(this.getReaderForSample(A[y]));
    const E = [], { littleEndian: w } = this;
    for (let y = B; y < C; ++y)
      for (let m = f; m < d; ++m) {
        let S;
        this.planarConfiguration === 1 && (S = this.getTileOrStrip(m, y, 0, r, o));
        for (let x = 0; x < A.length; ++x) {
          const G = x, M = A[x];
          this.planarConfiguration === 2 && (p = this.getSampleByteSize(M), S = this.getTileOrStrip(m, y, M, r, o));
          const Y = S.then((k) => {
            const F = k.data, v = new DataView(F), b = this.getBlockHeight(k.y), U = k.y * I, N = k.x * s, R = U + b, O = (k.x + 1) * s, K = D[G], L = Math.min(b, b - (R - e[3]), l - U), q = Math.min(s, s - (O - e[2]), c - N);
            for (let T = Math.max(0, e[1] - U); T < L; ++T)
              for (let J = Math.max(0, e[0] - N); J < q; ++J) {
                const V = (T * s + J) * p, P = K.call(
                  v,
                  V + Q[G],
                  w
                );
                let X;
                n ? (X = (T + U - e[1]) * u * A.length + (J + N - e[0]) * A.length + G, i[X] = P) : (X = (T + U - e[1]) * u + J + N - e[0], i[G][X] = P);
              }
          });
          E.push(Y);
        }
      }
    if (await Promise.all(E), g && e[2] - e[0] !== g || a && e[3] - e[1] !== a) {
      let y;
      return n ? y = Wn(
        i,
        e[2] - e[0],
        e[3] - e[1],
        g,
        a,
        A.length,
        h
      ) : y = jn(
        i,
        e[2] - e[0],
        e[3] - e[1],
        g,
        a,
        h
      ), y.width = g, y.height = a, y;
    }
    return i.width = g || e[2] - e[0], i.height = a || e[3] - e[1], i;
  }
  /**
   * Reads raster data from the image. This function reads all selected samples
   * into separate arrays of the correct type for that sample or into a single
   * combined array when `interleave` is set. When provided, only a subset
   * of the raster is read for each sample.
   *
   * @param {ReadRasterOptions} [options={}] optional parameters
   * @returns {Promise<ReadRasterResult>} the decoded arrays as a promise
   */
  async readRasters({
    window: e,
    samples: A = [],
    interleave: i,
    pool: n = null,
    width: r,
    height: g,
    resampleMethod: a,
    fillValue: h,
    signal: o
  } = {}) {
    const s = e || [0, 0, this.getWidth(), this.getHeight()];
    if (s[0] > s[2] || s[1] > s[3])
      throw new Error("Invalid subsets");
    const I = s[2] - s[0], c = s[3] - s[1], l = I * c, f = this.getSamplesPerPixel();
    if (!A || !A.length)
      for (let u = 0; u < f; ++u)
        A.push(u);
    else
      for (let u = 0; u < A.length; ++u)
        if (A[u] >= f)
          return Promise.reject(new RangeError(`Invalid sample index '${A[u]}'.`));
    let d;
    if (i) {
      const u = this.fileDirectory.SampleFormat ? Math.max.apply(null, this.fileDirectory.SampleFormat) : 1, p = Math.max.apply(null, this.fileDirectory.BitsPerSample);
      d = be(u, p, l * A.length), h && d.fill(h);
    } else {
      d = [];
      for (let u = 0; u < A.length; ++u) {
        const p = this.getArrayForSample(A[u], l);
        Array.isArray(h) && u < h.length ? p.fill(h[u]) : h && !Array.isArray(h) && p.fill(h), d.push(p);
      }
    }
    const B = n || await Hn(this.fileDirectory);
    return await this._readRaster(
      s,
      A,
      d,
      i,
      B,
      r,
      g,
      a,
      o
    );
  }
  /**
   * Reads raster data from the image as RGB. The result is always an
   * interleaved typed array.
   * Colorspaces other than RGB will be transformed to RGB, color maps expanded.
   * When no other method is applicable, the first sample is used to produce a
   * grayscale image.
   * When provided, only a subset of the raster is read for each sample.
   *
   * @param {Object} [options] optional parameters
   * @param {Array<number>} [options.window] the subset to read data from in pixels.
   * @param {boolean} [options.interleave=true] whether the data shall be read
   *                                             in one single array or separate
   *                                             arrays.
   * @param {import("./geotiff").Pool} [options.pool=null] The optional decoder pool to use.
   * @param {number} [options.width] The desired width of the output. When the width is no the
   *                                 same as the images, resampling will be performed.
   * @param {number} [options.height] The desired height of the output. When the width is no the
   *                                  same as the images, resampling will be performed.
   * @param {string} [options.resampleMethod='nearest'] The desired resampling method.
   * @param {boolean} [options.enableAlpha=false] Enable reading alpha channel if present.
   * @param {AbortSignal} [options.signal] An AbortSignal that may be signalled if the request is
   *                                       to be aborted
   * @returns {Promise<ReadRasterResult>} the RGB array as a Promise
   */
  async readRGB({
    window: e,
    interleave: A = !0,
    pool: i = null,
    width: n,
    height: r,
    resampleMethod: g,
    enableAlpha: a = !1,
    signal: h
  } = {}) {
    const o = e || [0, 0, this.getWidth(), this.getHeight()];
    if (o[0] > o[2] || o[1] > o[3])
      throw new Error("Invalid subsets");
    const s = this.fileDirectory.PhotometricInterpretation;
    if (s === AA.RGB) {
      let C = [0, 1, 2];
      if (this.fileDirectory.ExtraSamples !== Un.Unspecified && a) {
        C = [];
        for (let u = 0; u < this.fileDirectory.BitsPerSample.length; u += 1)
          C.push(u);
      }
      return this.readRasters({
        window: e,
        interleave: A,
        samples: C,
        pool: i,
        width: n,
        height: r,
        resampleMethod: g,
        signal: h
      });
    }
    let I;
    switch (s) {
      case AA.WhiteIsZero:
      case AA.BlackIsZero:
      case AA.Palette:
        I = [0];
        break;
      case AA.CMYK:
        I = [0, 1, 2, 3];
        break;
      case AA.YCbCr:
      case AA.CIELab:
        I = [0, 1, 2];
        break;
      default:
        throw new Error("Invalid or unsupported photometric interpretation.");
    }
    const c = {
      window: o,
      interleave: !0,
      samples: I,
      pool: i,
      width: n,
      height: r,
      resampleMethod: g,
      signal: h
    }, { fileDirectory: l } = this, f = await this.readRasters(c), d = 2 ** this.fileDirectory.BitsPerSample[0];
    let B;
    switch (s) {
      case AA.WhiteIsZero:
        B = Nn(f, d);
        break;
      case AA.BlackIsZero:
        B = Tn(f, d);
        break;
      case AA.Palette:
        B = qn(f, l.ColorMap);
        break;
      case AA.CMYK:
        B = Yn(f);
        break;
      case AA.YCbCr:
        B = _n(f);
        break;
      case AA.CIELab:
        B = Kn(f);
        break;
      default:
        throw new Error("Unsupported photometric interpretation.");
    }
    if (!A) {
      const C = new Uint8Array(B.length / 3), u = new Uint8Array(B.length / 3), p = new Uint8Array(B.length / 3);
      for (let Q = 0, D = 0; Q < B.length; Q += 3, ++D)
        C[D] = B[Q], u[D] = B[Q + 1], p[D] = B[Q + 2];
      B = [C, u, p];
    }
    return B.width = f.width, B.height = f.height, B;
  }
  /**
   * Returns an array of tiepoints.
   * @returns {Object[]}
   */
  getTiePoints() {
    if (!this.fileDirectory.ModelTiepoint)
      return [];
    const e = [];
    for (let A = 0; A < this.fileDirectory.ModelTiepoint.length; A += 6)
      e.push({
        i: this.fileDirectory.ModelTiepoint[A],
        j: this.fileDirectory.ModelTiepoint[A + 1],
        k: this.fileDirectory.ModelTiepoint[A + 2],
        x: this.fileDirectory.ModelTiepoint[A + 3],
        y: this.fileDirectory.ModelTiepoint[A + 4],
        z: this.fileDirectory.ModelTiepoint[A + 5]
      });
    return e;
  }
  /**
   * Returns the parsed GDAL metadata items.
   *
   * If sample is passed to null, dataset-level metadata will be returned.
   * Otherwise only metadata specific to the provided sample will be returned.
   *
   * @param {number} [sample=null] The sample index.
   * @returns {Object}
   */
  getGDALMetadata(e = null) {
    const A = {};
    if (!this.fileDirectory.GDAL_METADATA)
      return null;
    const i = this.fileDirectory.GDAL_METADATA;
    let n = bn(i, "Item");
    e === null ? n = n.filter((r) => le(r, "sample") === void 0) : n = n.filter((r) => Number(le(r, "sample")) === e);
    for (let r = 0; r < n.length; ++r) {
      const g = n[r];
      A[le(g, "name")] = g.inner;
    }
    return A;
  }
  /**
   * Returns the GDAL nodata value
   * @returns {number|null}
   */
  getGDALNoData() {
    if (!this.fileDirectory.GDAL_NODATA)
      return null;
    const e = this.fileDirectory.GDAL_NODATA;
    return Number(e.substring(0, e.length - 1));
  }
  /**
   * Returns the image origin as a XYZ-vector. When the image has no affine
   * transformation, then an exception is thrown.
   * @returns {Array<number>} The origin as a vector
   */
  getOrigin() {
    const e = this.fileDirectory.ModelTiepoint, A = this.fileDirectory.ModelTransformation;
    if (e && e.length === 6)
      return [
        e[3],
        e[4],
        e[5]
      ];
    if (A)
      return [
        A[3],
        A[7],
        A[11]
      ];
    throw new Error("The image does not have an affine transformation.");
  }
  /**
   * Returns the image resolution as a XYZ-vector. When the image has no affine
   * transformation, then an exception is thrown.
   * @param {GeoTIFFImage} [referenceImage=null] A reference image to calculate the resolution from
   *                                             in cases when the current image does not have the
   *                                             required tags on its own.
   * @returns {Array<number>} The resolution as a vector
   */
  getResolution(e = null) {
    const A = this.fileDirectory.ModelPixelScale, i = this.fileDirectory.ModelTransformation;
    if (A)
      return [
        A[0],
        -A[1],
        A[2]
      ];
    if (i)
      return i[1] === 0 && i[4] === 0 ? [
        i[0],
        -i[5],
        i[10]
      ] : [
        Math.sqrt(i[0] * i[0] + i[4] * i[4]),
        -Math.sqrt(i[1] * i[1] + i[5] * i[5]),
        i[10]
      ];
    if (e) {
      const [n, r, g] = e.getResolution();
      return [
        n * e.getWidth() / this.getWidth(),
        r * e.getHeight() / this.getHeight(),
        g * e.getWidth() / this.getWidth()
      ];
    }
    throw new Error("The image does not have an affine transformation.");
  }
  /**
   * Returns whether or not the pixels of the image depict an area (or point).
   * @returns {Boolean} Whether the pixels are a point
   */
  pixelIsArea() {
    return this.geoKeys.GTRasterTypeGeoKey === 1;
  }
  /**
   * Returns the image bounding box as an array of 4 values: min-x, min-y,
   * max-x and max-y. When the image has no affine transformation, then an
   * exception is thrown.
   * @param {boolean} [tilegrid=false] If true return extent for a tilegrid
   *                                   without adjustment for ModelTransformation.
   * @returns {Array<number>} The bounding box
   */
  getBoundingBox(e = !1) {
    const A = this.getHeight(), i = this.getWidth();
    if (this.fileDirectory.ModelTransformation && !e) {
      const [n, r, g, a, h, o, s, I] = this.fileDirectory.ModelTransformation, l = [
        [0, 0],
        [0, A],
        [i, 0],
        [i, A]
      ].map(([B, C]) => [
        a + n * B + r * C,
        I + h * B + o * C
      ]), f = l.map((B) => B[0]), d = l.map((B) => B[1]);
      return [
        Math.min(...f),
        Math.min(...d),
        Math.max(...f),
        Math.max(...d)
      ];
    } else {
      const n = this.getOrigin(), r = this.getResolution(), g = n[0], a = n[1], h = g + r[0] * i, o = a + r[1] * A;
      return [
        Math.min(g, h),
        Math.min(a, o),
        Math.max(g, h),
        Math.max(a, o)
      ];
    }
  }
}
class ir {
  constructor(e) {
    this._dataView = new DataView(e);
  }
  get buffer() {
    return this._dataView.buffer;
  }
  getUint64(e, A) {
    const i = this.getUint32(e, A), n = this.getUint32(e + 4, A);
    let r;
    if (A) {
      if (r = i + 2 ** 32 * n, !Number.isSafeInteger(r))
        throw new Error(
          `${r} exceeds MAX_SAFE_INTEGER. Precision may be lost. Please report if you get this message to https://github.com/geotiffjs/geotiff.js/issues`
        );
      return r;
    }
    if (r = 2 ** 32 * i + n, !Number.isSafeInteger(r))
      throw new Error(
        `${r} exceeds MAX_SAFE_INTEGER. Precision may be lost. Please report if you get this message to https://github.com/geotiffjs/geotiff.js/issues`
      );
    return r;
  }
  // adapted from https://stackoverflow.com/a/55338384/8060591
  getInt64(e, A) {
    let i = 0;
    const n = (this._dataView.getUint8(e + (A ? 7 : 0)) & 128) > 0;
    let r = !0;
    for (let g = 0; g < 8; g++) {
      let a = this._dataView.getUint8(e + (A ? g : 7 - g));
      n && (r ? a !== 0 && (a = ~(a - 1) & 255, r = !1) : a = ~a & 255), i += a * 256 ** g;
    }
    return n && (i = -i), i;
  }
  getUint8(e, A) {
    return this._dataView.getUint8(e, A);
  }
  getInt8(e, A) {
    return this._dataView.getInt8(e, A);
  }
  getUint16(e, A) {
    return this._dataView.getUint16(e, A);
  }
  getInt16(e, A) {
    return this._dataView.getInt16(e, A);
  }
  getUint32(e, A) {
    return this._dataView.getUint32(e, A);
  }
  getInt32(e, A) {
    return this._dataView.getInt32(e, A);
  }
  getFloat16(e, A) {
    return ai(this._dataView, e, A);
  }
  getFloat32(e, A) {
    return this._dataView.getFloat32(e, A);
  }
  getFloat64(e, A) {
    return this._dataView.getFloat64(e, A);
  }
}
class nr {
  constructor(e, A, i, n) {
    this._dataView = new DataView(e), this._sliceOffset = A, this._littleEndian = i, this._bigTiff = n;
  }
  get sliceOffset() {
    return this._sliceOffset;
  }
  get sliceTop() {
    return this._sliceOffset + this.buffer.byteLength;
  }
  get littleEndian() {
    return this._littleEndian;
  }
  get bigTiff() {
    return this._bigTiff;
  }
  get buffer() {
    return this._dataView.buffer;
  }
  covers(e, A) {
    return this.sliceOffset <= e && this.sliceTop >= e + A;
  }
  readUint8(e) {
    return this._dataView.getUint8(
      e - this._sliceOffset,
      this._littleEndian
    );
  }
  readInt8(e) {
    return this._dataView.getInt8(
      e - this._sliceOffset,
      this._littleEndian
    );
  }
  readUint16(e) {
    return this._dataView.getUint16(
      e - this._sliceOffset,
      this._littleEndian
    );
  }
  readInt16(e) {
    return this._dataView.getInt16(
      e - this._sliceOffset,
      this._littleEndian
    );
  }
  readUint32(e) {
    return this._dataView.getUint32(
      e - this._sliceOffset,
      this._littleEndian
    );
  }
  readInt32(e) {
    return this._dataView.getInt32(
      e - this._sliceOffset,
      this._littleEndian
    );
  }
  readFloat32(e) {
    return this._dataView.getFloat32(
      e - this._sliceOffset,
      this._littleEndian
    );
  }
  readFloat64(e) {
    return this._dataView.getFloat64(
      e - this._sliceOffset,
      this._littleEndian
    );
  }
  readUint64(e) {
    const A = this.readUint32(e), i = this.readUint32(e + 4);
    let n;
    if (this._littleEndian) {
      if (n = A + 2 ** 32 * i, !Number.isSafeInteger(n))
        throw new Error(
          `${n} exceeds MAX_SAFE_INTEGER. Precision may be lost. Please report if you get this message to https://github.com/geotiffjs/geotiff.js/issues`
        );
      return n;
    }
    if (n = 2 ** 32 * A + i, !Number.isSafeInteger(n))
      throw new Error(
        `${n} exceeds MAX_SAFE_INTEGER. Precision may be lost. Please report if you get this message to https://github.com/geotiffjs/geotiff.js/issues`
      );
    return n;
  }
  // adapted from https://stackoverflow.com/a/55338384/8060591
  readInt64(e) {
    let A = 0;
    const i = (this._dataView.getUint8(e + (this._littleEndian ? 7 : 0)) & 128) > 0;
    let n = !0;
    for (let r = 0; r < 8; r++) {
      let g = this._dataView.getUint8(
        e + (this._littleEndian ? r : 7 - r)
      );
      i && (n ? g !== 0 && (g = ~(g - 1) & 255, n = !1) : g = ~g & 255), A += g * 256 ** r;
    }
    return i && (A = -A), A;
  }
  readOffset(e) {
    return this._bigTiff ? this.readUint64(e) : this.readUint32(e);
  }
}
class rr {
  /**
   *
   * @param {Slice[]} slices
   * @returns {ArrayBuffer[]}
   */
  async fetch(e, A = void 0) {
    return Promise.all(
      e.map((i) => this.fetchSlice(i, A))
    );
  }
  /**
   *
   * @param {Slice} slice
   * @returns {ArrayBuffer}
   */
  async fetchSlice(e) {
    throw new Error(`fetching of slice ${e} not possible, not implemented`);
  }
  /**
   * Returns the filesize if already determined and null otherwise
   */
  get fileSize() {
    return null;
  }
  async close() {
  }
}
class et extends Error {
  constructor(e) {
    super(e), Error.captureStackTrace && Error.captureStackTrace(this, et), this.name = "AbortError";
  }
}
class sr extends rr {
  constructor(e) {
    super(), this.arrayBuffer = e;
  }
  fetchSlice(e, A) {
    if (A && A.aborted)
      throw new et("Request aborted");
    return this.arrayBuffer.slice(e.offset, e.offset + e.length);
  }
}
function or(t) {
  return new sr(t);
}
function ar(t, e) {
  let A = t.length - e, i = 0;
  do {
    for (let n = e; n > 0; n--)
      t[i + e] += t[i], i++;
    A -= e;
  } while (A > 0);
}
function gr(t, e, A) {
  let i = 0, n = t.length;
  const r = n / A;
  for (; n > e; ) {
    for (let a = e; a > 0; --a)
      t[i + e] += t[i], ++i;
    n -= e;
  }
  const g = t.slice();
  for (let a = 0; a < r; ++a)
    for (let h = 0; h < A; ++h)
      t[A * a + h] = g[(A - h - 1) * r + a];
}
function Ir(t, e, A, i, n, r) {
  if (e === 1)
    return t;
  for (let h = 0; h < n.length; ++h) {
    if (n[h] % 8 !== 0)
      throw new Error("When decoding with predictor, only multiple of 8 bits are supported.");
    if (n[h] !== n[0])
      throw new Error("When decoding with predictor, all samples must have the same size.");
  }
  const g = n[0] / 8, a = r === 2 ? 1 : n.length;
  for (let h = 0; h < i && !(h * a * A * g >= t.byteLength); ++h) {
    let o;
    if (e === 2) {
      switch (n[0]) {
        case 8:
          o = new Uint8Array(
            t,
            h * a * A * g,
            a * A * g
          );
          break;
        case 16:
          o = new Uint16Array(
            t,
            h * a * A * g,
            a * A * g / 2
          );
          break;
        case 32:
          o = new Uint32Array(
            t,
            h * a * A * g,
            a * A * g / 4
          );
          break;
        default:
          throw new Error(`Predictor 2 not allowed with ${n[0]} bits per sample.`);
      }
      ar(o, a);
    } else e === 3 && (o = new Uint8Array(
      t,
      h * a * A * g,
      a * A * g
    ), gr(o, a, g));
  }
  return t;
}
class dA {
  async decode(e, A) {
    const i = await this.decodeBlock(A), n = e.Predictor || 1;
    if (n !== 1) {
      const r = !e.StripOffsets, g = r ? e.TileWidth : e.ImageWidth, a = r ? e.TileLength : e.RowsPerStrip || e.ImageLength;
      return Ir(
        i,
        n,
        g,
        a,
        e.BitsPerSample,
        e.PlanarConfiguration
      );
    }
    return i;
  }
}
function Le(t) {
  switch (t) {
    case _.BYTE:
    case _.ASCII:
    case _.SBYTE:
    case _.UNDEFINED:
      return 1;
    case _.SHORT:
    case _.SSHORT:
      return 2;
    case _.LONG:
    case _.SLONG:
    case _.FLOAT:
    case _.IFD:
      return 4;
    case _.RATIONAL:
    case _.SRATIONAL:
    case _.DOUBLE:
    case _.LONG8:
    case _.SLONG8:
    case _.IFD8:
      return 8;
    default:
      throw new RangeError(`Invalid field type: ${t}`);
  }
}
function lr(t) {
  const e = t.GeoKeyDirectory;
  if (!e)
    return null;
  const A = {};
  for (let i = 4; i <= e[3] * 4; i += 4) {
    const n = Rn[e[i]], r = e[i + 1] ? LA[e[i + 1]] : null, g = e[i + 2], a = e[i + 3];
    let h = null;
    if (!r)
      h = a;
    else {
      if (h = t[r], typeof h > "u" || h === null)
        throw new Error(`Could not get value of geoKey '${n}'.`);
      typeof h == "string" ? h = h.substring(a, a + g - 1) : h.subarray && (h = h.subarray(a, a + g), g === 1 && (h = h[0]));
    }
    A[n] = h;
  }
  return A;
}
function yA(t, e, A, i) {
  let n = null, r = null;
  const g = Le(e);
  switch (e) {
    case _.BYTE:
    case _.ASCII:
    case _.UNDEFINED:
      n = new Uint8Array(A), r = t.readUint8;
      break;
    case _.SBYTE:
      n = new Int8Array(A), r = t.readInt8;
      break;
    case _.SHORT:
      n = new Uint16Array(A), r = t.readUint16;
      break;
    case _.SSHORT:
      n = new Int16Array(A), r = t.readInt16;
      break;
    case _.LONG:
    case _.IFD:
      n = new Uint32Array(A), r = t.readUint32;
      break;
    case _.SLONG:
      n = new Int32Array(A), r = t.readInt32;
      break;
    case _.LONG8:
    case _.IFD8:
      n = new Array(A), r = t.readUint64;
      break;
    case _.SLONG8:
      n = new Array(A), r = t.readInt64;
      break;
    case _.RATIONAL:
      n = new Uint32Array(A * 2), r = t.readUint32;
      break;
    case _.SRATIONAL:
      n = new Int32Array(A * 2), r = t.readInt32;
      break;
    case _.FLOAT:
      n = new Float32Array(A), r = t.readFloat32;
      break;
    case _.DOUBLE:
      n = new Float64Array(A), r = t.readFloat64;
      break;
    default:
      throw new RangeError(`Invalid field type: ${e}`);
  }
  if (e === _.RATIONAL || e === _.SRATIONAL)
    for (let a = 0; a < A; a += 2)
      n[a] = r.call(
        t,
        i + a * g
      ), n[a + 1] = r.call(
        t,
        i + (a * g + 4)
      );
  else
    for (let a = 0; a < A; ++a)
      n[a] = r.call(
        t,
        i + a * g
      );
  return e === _.ASCII ? new TextDecoder("utf-8").decode(n) : n;
}
class fr {
  constructor(e, A, i) {
    this.fileDirectory = e, this.geoKeyDirectory = A, this.nextIFDByteOffset = i;
  }
}
class JA extends Error {
  constructor(e) {
    super(`No image at index ${e}`), this.index = e;
  }
}
class cr {
  /**
   * (experimental) Reads raster data from the best fitting image. This function uses
   * the image with the lowest resolution that is still a higher resolution than the
   * requested resolution.
   * When specified, the `bbox` option is translated to the `window` option and the
   * `resX` and `resY` to `width` and `height` respectively.
   * Then, the [readRasters]{@link GeoTIFFImage#readRasters} method of the selected
   * image is called and the result returned.
   * @see GeoTIFFImage.readRasters
   * @param {import('./geotiffimage').ReadRasterOptions} [options={}] optional parameters
   * @returns {Promise<ReadRasterResult>} the decoded array(s), with `height` and `width`, as a promise
   */
  async readRasters(e = {}) {
    const { window: A, width: i, height: n } = e;
    let { resX: r, resY: g, bbox: a } = e;
    const h = await this.getImage();
    let o = h;
    const s = await this.getImageCount(), I = h.getBoundingBox();
    if (A && a)
      throw new Error('Both "bbox" and "window" passed.');
    if (i || n) {
      if (A) {
        const [f, d] = h.getOrigin(), [B, C] = h.getResolution();
        a = [
          f + A[0] * B,
          d + A[1] * C,
          f + A[2] * B,
          d + A[3] * C
        ];
      }
      const l = a || I;
      if (i) {
        if (r)
          throw new Error("Both width and resX passed");
        r = (l[2] - l[0]) / i;
      }
      if (n) {
        if (g)
          throw new Error("Both width and resY passed");
        g = (l[3] - l[1]) / n;
      }
    }
    if (r || g) {
      const l = [];
      for (let f = 0; f < s; ++f) {
        const d = await this.getImage(f), { SubfileType: B, NewSubfileType: C } = d.fileDirectory;
        (f === 0 || B === 2 || C & 1) && l.push(d);
      }
      l.sort((f, d) => f.getWidth() - d.getWidth());
      for (let f = 0; f < l.length; ++f) {
        const d = l[f], B = (I[2] - I[0]) / d.getWidth(), C = (I[3] - I[1]) / d.getHeight();
        if (o = d, r && r > B || g && g > C)
          break;
      }
    }
    let c = A;
    if (a) {
      const [l, f] = h.getOrigin(), [d, B] = o.getResolution(h);
      c = [
        Math.round((a[0] - l) / d),
        Math.round((a[1] - f) / B),
        Math.round((a[2] - l) / d),
        Math.round((a[3] - f) / B)
      ], c = [
        Math.min(c[0], c[2]),
        Math.min(c[1], c[3]),
        Math.max(c[0], c[2]),
        Math.max(c[1], c[3])
      ];
    }
    return o.readRasters({ ...e, window: c });
  }
}
class tt extends cr {
  /**
   * @constructor
   * @param {*} source The datasource to read from.
   * @param {boolean} littleEndian Whether the image uses little endian.
   * @param {boolean} bigTiff Whether the image uses bigTIFF conventions.
   * @param {number} firstIFDOffset The numeric byte-offset from the start of the image
   *                                to the first IFD.
   * @param {GeoTIFFOptions} [options] further options.
   */
  constructor(e, A, i, n, r = {}) {
    super(), this.source = e, this.littleEndian = A, this.bigTiff = i, this.firstIFDOffset = n, this.cache = r.cache || !1, this.ifdRequests = [], this.ghostValues = null;
  }
  async getSlice(e, A) {
    const i = this.bigTiff ? 4048 : 1024;
    return new nr(
      (await this.source.fetch([{
        offset: e,
        length: typeof A < "u" ? A : i
      }]))[0],
      e,
      this.littleEndian,
      this.bigTiff
    );
  }
  /**
   * Instructs to parse an image file directory at the given file offset.
   * As there is no way to ensure that a location is indeed the start of an IFD,
   * this function must be called with caution (e.g only using the IFD offsets from
   * the headers or other IFDs).
   * @param {number} offset the offset to parse the IFD at
   * @returns {Promise<ImageFileDirectory>} the parsed IFD
   */
  async parseFileDirectoryAt(e) {
    const A = this.bigTiff ? 20 : 12, i = this.bigTiff ? 8 : 2;
    let n = await this.getSlice(e);
    const r = this.bigTiff ? n.readUint64(e) : n.readUint16(e), g = r * A + (this.bigTiff ? 16 : 6);
    n.covers(e, g) || (n = await this.getSlice(e, g));
    const a = {};
    let h = e + (this.bigTiff ? 8 : 2);
    for (let I = 0; I < r; h += A, ++I) {
      const c = n.readUint16(h), l = n.readUint16(h + 2), f = this.bigTiff ? n.readUint64(h + 4) : n.readUint32(h + 4);
      let d, B;
      const C = Le(l), u = h + (this.bigTiff ? 12 : 8);
      if (C * f <= (this.bigTiff ? 8 : 4))
        d = yA(n, l, f, u);
      else {
        const p = n.readOffset(u), Q = Le(l) * f;
        if (n.covers(p, Q))
          d = yA(n, l, f, p);
        else {
          const D = await this.getSlice(p, Q);
          d = yA(D, l, f, p);
        }
      }
      f === 1 && Ln.indexOf(c) === -1 && !(l === _.RATIONAL || l === _.SRATIONAL) ? B = d[0] : B = d, a[LA[c]] = B;
    }
    const o = lr(a), s = n.readOffset(
      e + i + A * r
    );
    return new fr(
      a,
      o,
      s
    );
  }
  async requestIFD(e) {
    if (this.ifdRequests[e])
      return this.ifdRequests[e];
    if (e === 0)
      return this.ifdRequests[e] = this.parseFileDirectoryAt(this.firstIFDOffset), this.ifdRequests[e];
    if (!this.ifdRequests[e - 1])
      try {
        this.ifdRequests[e - 1] = this.requestIFD(e - 1);
      } catch (A) {
        throw A instanceof JA ? new JA(e) : A;
      }
    return this.ifdRequests[e] = (async () => {
      const A = await this.ifdRequests[e - 1];
      if (A.nextIFDByteOffset === 0)
        throw new JA(e);
      return this.parseFileDirectoryAt(A.nextIFDByteOffset);
    })(), this.ifdRequests[e];
  }
  /**
   * Get the n-th internal subfile of an image. By default, the first is returned.
   *
   * @param {number} [index=0] the index of the image to return.
   * @returns {Promise<GeoTIFFImage>} the image at the given index
   */
  async getImage(e = 0) {
    const A = await this.requestIFD(e);
    return new tr(
      A.fileDirectory,
      A.geoKeyDirectory,
      this.dataView,
      this.littleEndian,
      this.cache,
      this.source
    );
  }
  /**
   * Returns the count of the internal subfiles.
   *
   * @returns {Promise<number>} the number of internal subfile images
   */
  async getImageCount() {
    let e = 0, A = !0;
    for (; A; )
      try {
        await this.requestIFD(e), ++e;
      } catch (i) {
        if (i instanceof JA)
          A = !1;
        else
          throw i;
      }
    return e;
  }
  /**
   * Get the values of the COG ghost area as a parsed map.
   * See https://gdal.org/drivers/raster/cog.html#header-ghost-area for reference
   * @returns {Promise<Object>} the parsed ghost area or null, if no such area was found
   */
  async getGhostValues() {
    const e = this.bigTiff ? 16 : 8;
    if (this.ghostValues)
      return this.ghostValues;
    const A = "GDAL_STRUCTURAL_METADATA_SIZE=", i = A.length + 100;
    let n = await this.getSlice(e, i);
    if (A === yA(n, _.ASCII, A.length, e)) {
      const g = yA(n, _.ASCII, i, e).split(`
`)[0], a = Number(g.split("=")[1].split(" ")[0]) + g.length;
      a > i && (n = await this.getSlice(e, a));
      const h = yA(n, _.ASCII, a, e);
      this.ghostValues = {}, h.split(`
`).filter((o) => o.length > 0).map((o) => o.split("=")).forEach(([o, s]) => {
        this.ghostValues[o] = s;
      });
    }
    return this.ghostValues;
  }
  /**
   * Parse a (Geo)TIFF file from the given source.
   *
   * @param {*} source The source of data to parse from.
   * @param {GeoTIFFOptions} [options] Additional options.
   * @param {AbortSignal} [signal] An AbortSignal that may be signalled if the request is
   *                               to be aborted
   */
  static async fromSource(e, A, i) {
    const n = (await e.fetch([{ offset: 0, length: 1024 }], i))[0], r = new ir(n), g = r.getUint16(0, 0);
    let a;
    if (g === 18761)
      a = !0;
    else if (g === 19789)
      a = !1;
    else
      throw new TypeError("Invalid byte order value.");
    const h = r.getUint16(2, a);
    let o;
    if (h === 42)
      o = !1;
    else if (h === 43) {
      if (o = !0, r.getUint16(4, a) !== 8)
        throw new Error("Unsupported offset byte-size.");
    } else
      throw new TypeError("Invalid magic number.");
    const s = o ? r.getUint64(8, a) : r.getUint32(4, a);
    return new tt(e, a, o, s, A);
  }
  /**
   * Closes the underlying file buffer
   * N.B. After the GeoTIFF has been completely processed it needs
   * to be closed but only if it has been constructed from a file.
   */
  close() {
    return typeof this.source.close == "function" ? this.source.close() : !1;
  }
}
async function Br(t, e) {
  return tt.fromSource(or(t), e);
}
function hr(t, e, A, i = 64, n = 64) {
  const [r, g, a, h] = e, [o, s, I, c] = A, l = t.width / (a - r), f = t.height / (h - g), d = (o - r) * l, B = (h - c) * f, C = (I - r) * l, u = (h - s) * f, p = [d, B, C, u];
  return Cr(t.buffer, t.width, t.height, p, i, n, 0);
}
function Cr(t, e, A, i, n, r, g = 0) {
  if (t.length !== e * A)
    throw new Error("Buffer size does not match width and height");
  const [a, h, o, s] = i, I = Math.min(a, o), c = Math.max(a, o), l = Math.min(h, s), f = Math.max(h, s), d = new Float32Array(n * r), B = (c - I) / n, C = (f - l) / r;
  for (let u = 0; u < r; u++)
    for (let p = 0; p < n; p++) {
      const Q = I + p * B, D = l + u * C, E = u * n + p;
      if (Q < 0 || Q >= e || D < 0 || D >= A) {
        d[E] = g;
        continue;
      }
      const w = Math.floor(Q), y = Math.floor(D), m = Math.min(w + 1, e - 1), S = Math.min(y + 1, A - 1);
      if (!(w > I && w < c && y > l && y < f)) {
        d[E] = t[y * e + w] + 1e3;
        continue;
      }
      const G = Q - w, M = D - y, Y = t[y * e + w], k = t[S * e + w], F = t[y * e + m], v = t[S * e + m], b = Y * (1 - G) * (1 - M) + F * G * (1 - M) + k * (1 - G) * M + v * G * M;
      console.assert(!isNaN(b)), d[E] = b + 1e3;
    }
  return d;
}
class Er {
  info = {
    version: "0.10.0",
    description: "TIF DEM terrain loader. It can load single tif dem."
  };
  // 数据标识
  dataType = "tif-dem";
  // 数据加载器
  _loader = new Je(se.manager);
  /**
   * 构造函数，初始化 TifDEMLoder 实例
   */
  constructor() {
    this._loader.setResponseType("arraybuffer");
  }
  /**
   * 加载瓦片的几何体数据
   * @param params 包含加载瓦片所需的参数，类型为 TileSourceLoadParamsType<TifDemSource>
   * @returns 加载完成后返回一个 BufferGeometry 对象
   */
  async load(e) {
    const { source: A, z: i, bounds: n } = e, r = new Ji(), g = A._getUrl(0, 0, 0);
    if (i < A.minLevel || i > A.maxLevel || !g)
      return r;
    const a = Xi.clamp((e.z + 2) * 3, 2, 128);
    if (!A.data) {
      console.log("load image...", g);
      const o = await this._loader.loadAsync(g);
      A.data = await this.getTIFFRaster(o);
    }
    const h = await this.getTileDEM(A.data, A._projectionBounds, n, a);
    return r.setData(h);
  }
  /**
   * 从 ArrayBuffer 中读取 TIFF 图像的栅格数据
   * @param buffer 包含 TIFF 图像数据的 ArrayBuffer
   * @returns 包含栅格数据的对象，包含 buffer、width 和 height 属性
   */
  async getTIFFRaster(e) {
    const i = await (await (await Br(e)).getImage(0)).readRasters();
    return {
      // 第一个波段的栅格数据，强制转换为 Float32Array 类型
      buffer: i[0],
      // 栅格数据的宽度
      width: i.width,
      // 栅格数据的高度
      height: i.height
    };
  }
  /**
   * 获取指定瓦片的数字高程模型（DEM）数据
   * @param raster 包含DEM数据的对象，具有buffer、width和height属性
   * @param sourceProjBbox 原始数据的投影边界框，格式为 [xMin, yMin, xMax, yMax]
   * @param tileBounds 瓦片的边界框，格式为 [xMin, yMin, xMax, yMax]
   * @param targetSize 目标数据的大小，用于指定输出数据的宽度和高度
   * @returns 经过处理后的DEM数据数组，除以1000得到km单位高程
   */
  async getTileDEM(e, A, i, n) {
    return hr(e, A, i, n, n).map((g) => g / 1e3);
  }
}
class ga extends j {
  dataType = "tif-dem";
  data;
}
FA.registerDEMloader(new Er());
var Qr = Object.defineProperty, ur = (t, e, A) => e in t ? Qr(t, e, { enumerable: !0, configurable: !0, writable: !0, value: A }) : t[e] = A, iA = (t, e, A) => ur(t, typeof e != "symbol" ? e + "" : e, A);
function Ue(t, e, A, i) {
  let n = i;
  const r = e + (A - e >> 1);
  let g = A - e, a;
  const h = t[e], o = t[e + 1], s = t[A], I = t[A + 1];
  for (let c = e + 3; c < A; c += 3) {
    const l = dr(t[c], t[c + 1], h, o, s, I);
    if (l > n)
      a = c, n = l;
    else if (l === n) {
      const f = Math.abs(c - r);
      f < g && (a = c, g = f);
    }
  }
  n > i && (a - e > 3 && Ue(t, e, a, i), t[a + 2] = n, A - a > 3 && Ue(t, a, A, i));
}
function dr(t, e, A, i, n, r) {
  let g = n - A, a = r - i;
  if (g !== 0 || a !== 0) {
    const h = ((t - A) * g + (e - i) * a) / (g * g + a * a);
    h > 1 ? (A = n, i = r) : h > 0 && (A += g * h, i += a * h);
  }
  return g = t - A, a = e - i, g * g + a * a;
}
function NA(t, e, A, i) {
  const n = {
    id: t ?? null,
    type: e,
    geometry: A,
    tags: i,
    minX: 1 / 0,
    minY: 1 / 0,
    maxX: -1 / 0,
    maxY: -1 / 0
  };
  if (e === "Point" || e === "MultiPoint" || e === "LineString")
    OA(n, A);
  else if (e === "Polygon")
    OA(n, A[0]);
  else if (e === "MultiLineString")
    for (const r of A)
      OA(n, r);
  else if (e === "MultiPolygon")
    for (const r of A)
      OA(n, r[0]);
  return n;
}
function OA(t, e) {
  for (let A = 0; A < e.length; A += 3)
    t.minX = Math.min(t.minX, e[A]), t.minY = Math.min(t.minY, e[A + 1]), t.maxX = Math.max(t.maxX, e[A]), t.maxY = Math.max(t.maxY, e[A + 1]);
}
function wr(t, e) {
  const A = [];
  if (t.type === "FeatureCollection")
    for (let i = 0; i < t.features.length; i++)
      ie(A, t.features[i], e, i);
  else t.type === "Feature" ? ie(A, t, e) : ie(A, { geometry: t }, e);
  return A;
}
function ie(t, e, A, i) {
  if (!e.geometry) return;
  const n = e.geometry.coordinates;
  if (n && n.length === 0) return;
  const r = e.geometry.type, g = Math.pow(A.tolerance / ((1 << A.maxZoom) * A.extent), 2);
  let a = [], h = e.id;
  if (A.promoteId ? h = e.properties[A.promoteId] : A.generateId && (h = i || 0), r === "Point")
    st(n, a);
  else if (r === "MultiPoint")
    for (const o of n)
      st(o, a);
  else if (r === "LineString")
    ve(n, a, g, !1);
  else if (r === "MultiLineString")
    if (A.lineMetrics) {
      for (const o of n)
        a = [], ve(o, a, g, !1), t.push(NA(h, "LineString", a, e.properties));
      return;
    } else
      he(n, a, g, !1);
  else if (r === "Polygon")
    he(n, a, g, !0);
  else if (r === "MultiPolygon")
    for (const o of n) {
      const s = [];
      he(o, s, g, !0), a.push(s);
    }
  else if (r === "GeometryCollection") {
    for (const o of e.geometry.geometries)
      ie(t, {
        id: h,
        geometry: o,
        properties: e.properties
      }, A, i);
    return;
  } else
    throw new Error("Input data is not a valid GeoJSON object.");
  t.push(NA(h, r, a, e.properties));
}
function st(t, e) {
  e.push(Ci(t[0]), Ei(t[1]), 0);
}
function ve(t, e, A, i) {
  let n, r, g = 0;
  for (let h = 0; h < t.length; h++) {
    const o = Ci(t[h][0]), s = Ei(t[h][1]);
    e.push(o, s, 0), h > 0 && (i ? g += (n * s - o * r) / 2 : g += Math.sqrt(Math.pow(o - n, 2) + Math.pow(s - r, 2))), n = o, r = s;
  }
  const a = e.length - 3;
  e[2] = 1, Ue(e, 0, a, A), e[a + 2] = 1, e.size = Math.abs(g), e.start = 0, e.end = e.size;
}
function he(t, e, A, i) {
  for (let n = 0; n < t.length; n++) {
    const r = [];
    ve(t[n], r, A, i), e.push(r);
  }
}
function Ci(t) {
  return t / 360 + 0.5;
}
function Ei(t) {
  const e = Math.sin(t * Math.PI / 180), A = 0.5 - 0.25 * Math.log((1 + e) / (1 - e)) / Math.PI;
  return A < 0 ? 0 : A > 1 ? 1 : A;
}
function lA(t, e, A, i, n, r, g, a) {
  if (A /= e, i /= e, r >= A && g < i) return t;
  if (g < A || r >= i) return null;
  const h = [];
  for (const o of t) {
    const s = o.geometry;
    let I = o.type;
    const c = n === 0 ? o.minX : o.minY, l = n === 0 ? o.maxX : o.maxY;
    if (c >= A && l < i) {
      h.push(o);
      continue;
    } else if (l < A || c >= i)
      continue;
    let f = [];
    if (I === "Point" || I === "MultiPoint")
      yr(s, f, A, i, n);
    else if (I === "LineString")
      Qi(s, f, A, i, n, !1, a.lineMetrics);
    else if (I === "MultiLineString")
      Ce(s, f, A, i, n, !1);
    else if (I === "Polygon")
      Ce(s, f, A, i, n, !0);
    else if (I === "MultiPolygon")
      for (const d of s) {
        const B = [];
        Ce(d, B, A, i, n, !0), B.length && f.push(B);
      }
    if (f.length) {
      if (a.lineMetrics && I === "LineString") {
        for (const d of f)
          h.push(NA(o.id, I, d, o.tags));
        continue;
      }
      (I === "LineString" || I === "MultiLineString") && (f.length === 1 ? (I = "LineString", f = f[0]) : I = "MultiLineString"), (I === "Point" || I === "MultiPoint") && (I = f.length === 3 ? "Point" : "MultiPoint"), h.push(NA(o.id, I, f, o.tags));
    }
  }
  return h.length ? h : null;
}
function yr(t, e, A, i, n) {
  for (let r = 0; r < t.length; r += 3) {
    const g = t[r + n];
    g >= A && g <= i && mA(e, t[r], t[r + 1], t[r + 2]);
  }
}
function Qi(t, e, A, i, n, r, g) {
  let a = ot(t);
  const h = n === 0 ? pr : Dr;
  let o = t.start, s, I;
  for (let C = 0; C < t.length - 3; C += 3) {
    const u = t[C], p = t[C + 1], Q = t[C + 2], D = t[C + 3], E = t[C + 4], w = n === 0 ? u : p, y = n === 0 ? D : E;
    let m = !1;
    g && (s = Math.sqrt(Math.pow(u - D, 2) + Math.pow(p - E, 2))), w < A ? y > A && (I = h(a, u, p, D, E, A), g && (a.start = o + s * I)) : w > i ? y < i && (I = h(a, u, p, D, E, i), g && (a.start = o + s * I)) : mA(a, u, p, Q), y < A && w >= A && (I = h(a, u, p, D, E, A), m = !0), y > i && w <= i && (I = h(a, u, p, D, E, i), m = !0), !r && m && (g && (a.end = o + s * I), e.push(a), a = ot(t)), g && (o += s);
  }
  let c = t.length - 3;
  const l = t[c], f = t[c + 1], d = t[c + 2], B = n === 0 ? l : f;
  B >= A && B <= i && mA(a, l, f, d), c = a.length - 3, r && c >= 3 && (a[c] !== a[0] || a[c + 1] !== a[1]) && mA(a, a[0], a[1], a[2]), a.length && e.push(a);
}
function ot(t) {
  const e = [];
  return e.size = t.size, e.start = t.start, e.end = t.end, e;
}
function Ce(t, e, A, i, n, r) {
  for (const g of t)
    Qi(g, e, A, i, n, r, !1);
}
function mA(t, e, A, i) {
  t.push(e, A, i);
}
function pr(t, e, A, i, n, r) {
  const g = (r - e) / (i - e);
  return mA(t, r, A + (n - A) * g, 1), g;
}
function Dr(t, e, A, i, n, r) {
  const g = (r - A) / (n - A);
  return mA(t, e + (i - e) * g, r, 1), g;
}
function xr(t, e) {
  const A = e.buffer / e.extent;
  let i = t;
  const n = lA(t, 1, -1 - A, A, 0, -1, 2, e), r = lA(t, 1, 1 - A, 2 + A, 0, -1, 2, e);
  return (n || r) && (i = lA(t, 1, -A, 1 + A, 0, -1, 2, e) || [], n && (i = at(n, 1).concat(i)), r && (i = i.concat(at(r, -1)))), i;
}
function at(t, e) {
  const A = [];
  for (let i = 0; i < t.length; i++) {
    const n = t[i], r = n.type;
    let g;
    if (r === "Point" || r === "MultiPoint" || r === "LineString")
      g = Ee(n.geometry, e);
    else if (r === "MultiLineString" || r === "Polygon") {
      g = [];
      for (const a of n.geometry)
        g.push(Ee(a, e));
    } else if (r === "MultiPolygon") {
      g = [];
      for (const a of n.geometry) {
        const h = [];
        for (const o of a)
          h.push(Ee(o, e));
        g.push(h);
      }
    }
    A.push(NA(n.id, r, g, n.tags));
  }
  return A;
}
function Ee(t, e) {
  const A = [];
  A.size = t.size, t.start !== void 0 && (A.start = t.start, A.end = t.end);
  for (let i = 0; i < t.length; i += 3)
    A.push(t[i] + e, t[i + 1], t[i + 2]);
  return A;
}
function gt(t, e) {
  if (t.transformed) return t;
  const A = 1 << t.z, i = t.x, n = t.y;
  for (const r of t.features) {
    const g = r.geometry, a = r.type;
    if (r.geometry = [], a === 1)
      for (let h = 0; h < g.length; h += 2)
        r.geometry.push(It(g[h], g[h + 1], e, A, i, n));
    else
      for (let h = 0; h < g.length; h++) {
        const o = [];
        for (let s = 0; s < g[h].length; s += 2)
          o.push(It(g[h][s], g[h][s + 1], e, A, i, n));
        r.geometry.push(o);
      }
  }
  return t.transformed = !0, t;
}
function It(t, e, A, i, n, r) {
  return [
    Math.round(A * (t * i - n)),
    Math.round(A * (e * i - r))
  ];
}
function mr(t, e, A, i, n) {
  const r = e === n.maxZoom ? 0 : n.tolerance / ((1 << e) * n.extent), g = {
    features: [],
    numPoints: 0,
    numSimplified: 0,
    numFeatures: t.length,
    source: null,
    x: A,
    y: i,
    z: e,
    transformed: !1,
    minX: 2,
    minY: 1,
    maxX: -1,
    maxY: 0
  };
  for (const a of t)
    Fr(g, a, r, n);
  return g;
}
function Fr(t, e, A, i) {
  const n = e.geometry, r = e.type, g = [];
  if (t.minX = Math.min(t.minX, e.minX), t.minY = Math.min(t.minY, e.minY), t.maxX = Math.max(t.maxX, e.maxX), t.maxY = Math.max(t.maxY, e.maxY), r === "Point" || r === "MultiPoint")
    for (let a = 0; a < n.length; a += 3)
      g.push(n[a], n[a + 1]), t.numPoints++, t.numSimplified++;
  else if (r === "LineString")
    Qe(g, n, t, A, !1, !1);
  else if (r === "MultiLineString" || r === "Polygon")
    for (let a = 0; a < n.length; a++)
      Qe(g, n[a], t, A, r === "Polygon", a === 0);
  else if (r === "MultiPolygon")
    for (let a = 0; a < n.length; a++) {
      const h = n[a];
      for (let o = 0; o < h.length; o++)
        Qe(g, h[o], t, A, !0, o === 0);
    }
  if (g.length) {
    let a = e.tags || null;
    if (r === "LineString" && i.lineMetrics) {
      a = {};
      for (const o in e.tags) a[o] = e.tags[o];
      a.mapbox_clip_start = n.start / n.size, a.mapbox_clip_end = n.end / n.size;
    }
    const h = {
      geometry: g,
      type: r === "Polygon" || r === "MultiPolygon" ? 3 : r === "LineString" || r === "MultiLineString" ? 2 : 1,
      tags: a
    };
    e.id !== null && (h.id = e.id), t.features.push(h);
  }
}
function Qe(t, e, A, i, n, r) {
  const g = i * i;
  if (i > 0 && e.size < (n ? g : i)) {
    A.numPoints += e.length / 3;
    return;
  }
  const a = [];
  for (let h = 0; h < e.length; h += 3)
    (i === 0 || e[h + 2] > g) && (A.numSimplified++, a.push(e[h], e[h + 1])), A.numPoints++;
  n && Sr(a, r), t.push(a);
}
function Sr(t, e) {
  let A = 0;
  for (let i = 0, n = t.length, r = n - 2; i < n; r = i, i += 2)
    A += (t[i] - t[r]) * (t[i + 1] + t[r + 1]);
  if (A > 0 === e)
    for (let i = 0, n = t.length; i < n / 2; i += 2) {
      const r = t[i], g = t[i + 1];
      t[i] = t[n - 2 - i], t[i + 1] = t[n - 1 - i], t[n - 2 - i] = r, t[n - 1 - i] = g;
    }
}
const kr = {
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
class Mr {
  constructor(e, A) {
    A = this.options = Gr(Object.create(kr), A);
    const i = A.debug;
    if (i && console.time("preprocess data"), A.maxZoom < 0 || A.maxZoom > 24) throw new Error("maxZoom should be in the 0-24 range");
    if (A.promoteId && A.generateId) throw new Error("promoteId and generateId cannot be used together.");
    let n = wr(e, A);
    this.tiles = {}, this.tileCoords = [], i && (console.timeEnd("preprocess data"), console.log("index: maxZoom: %d, maxPoints: %d", A.indexMaxZoom, A.indexMaxPoints), console.time("generate tiles"), this.stats = {}, this.total = 0), n = xr(n, A), n.length && this.splitTile(n, 0, 0, 0), i && (n.length && console.log("features: %d, points: %d", this.tiles[0].numFeatures, this.tiles[0].numPoints), console.timeEnd("generate tiles"), console.log("tiles generated:", this.total, JSON.stringify(this.stats)));
  }
  // splits features from a parent tile to sub-tiles.
  // z, x, and y are the coordinates of the parent tile
  // cz, cx, and cy are the coordinates of the target tile
  //
  // If no target tile is specified, splitting stops when we reach the maximum
  // zoom or the number of points is low as specified in the options.
  splitTile(e, A, i, n, r, g, a) {
    const h = [e, A, i, n], o = this.options, s = o.debug;
    for (; h.length; ) {
      n = h.pop(), i = h.pop(), A = h.pop(), e = h.pop();
      const I = 1 << A, c = ue(A, i, n);
      let l = this.tiles[c];
      if (!l && (s > 1 && console.time("creation"), l = this.tiles[c] = mr(e, A, i, n, o), this.tileCoords.push({ z: A, x: i, y: n }), s)) {
        s > 1 && (console.log(
          "tile z%d-%d-%d (features: %d, points: %d, simplified: %d)",
          A,
          i,
          n,
          l.numFeatures,
          l.numPoints,
          l.numSimplified
        ), console.timeEnd("creation"));
        const y = `z${A}`;
        this.stats[y] = (this.stats[y] || 0) + 1, this.total++;
      }
      if (l.source = e, r == null) {
        if (A === o.indexMaxZoom || l.numPoints <= o.indexMaxPoints) continue;
      } else {
        if (A === o.maxZoom || A === r)
          continue;
        if (r != null) {
          const y = r - A;
          if (i !== g >> y || n !== a >> y) continue;
        }
      }
      if (l.source = null, e.length === 0) continue;
      s > 1 && console.time("clipping");
      const f = 0.5 * o.buffer / o.extent, d = 0.5 - f, B = 0.5 + f, C = 1 + f;
      let u = null, p = null, Q = null, D = null, E = lA(e, I, i - f, i + B, 0, l.minX, l.maxX, o), w = lA(e, I, i + d, i + C, 0, l.minX, l.maxX, o);
      e = null, E && (u = lA(E, I, n - f, n + B, 1, l.minY, l.maxY, o), p = lA(E, I, n + d, n + C, 1, l.minY, l.maxY, o), E = null), w && (Q = lA(w, I, n - f, n + B, 1, l.minY, l.maxY, o), D = lA(w, I, n + d, n + C, 1, l.minY, l.maxY, o), w = null), s > 1 && console.timeEnd("clipping"), h.push(u || [], A + 1, i * 2, n * 2), h.push(p || [], A + 1, i * 2, n * 2 + 1), h.push(Q || [], A + 1, i * 2 + 1, n * 2), h.push(D || [], A + 1, i * 2 + 1, n * 2 + 1);
    }
  }
  getTile(e, A, i) {
    e = +e, A = +A, i = +i;
    const n = this.options, { extent: r, debug: g } = n;
    if (e < 0 || e > 24) return null;
    const a = 1 << e;
    A = A + a & a - 1;
    const h = ue(e, A, i);
    if (this.tiles[h]) return gt(this.tiles[h], r);
    g > 1 && console.log("drilling down to z%d-%d-%d", e, A, i);
    let o = e, s = A, I = i, c;
    for (; !c && o > 0; )
      o--, s = s >> 1, I = I >> 1, c = this.tiles[ue(o, s, I)];
    return !c || !c.source ? null : (g > 1 && (console.log("found parent tile z%d-%d-%d", o, s, I), console.time("drilling down")), this.splitTile(c.source, o, s, I, e, A, i), g > 1 && console.timeEnd("drilling down"), this.tiles[h] ? gt(this.tiles[h], r) : null);
  }
}
function ue(t, e, A) {
  return ((1 << t) * A + e) * 32 + t;
}
function Gr(t, e) {
  for (const A in e) t[A] = e[A];
  return t;
}
function br(t, e) {
  return new Mr(t, e);
}
class Ia extends Xt {
  /**
   * 构造函数
   */
  constructor() {
    super(), iA(this, "info", {
      version: "0.10.0",
      author: "GuoJF",
      description: "GeoJSON 加载器"
    }), iA(this, "dataType", "geojson"), iA(this, "_loader", new Je(se.manager)), iA(this, "_render", new jt()), this._loader.setResponseType("json");
  }
  /**
   * 异步加载瓦片纹理,该方法在瓦片创建后被调用
   *
   * @param url GeoJSON的URL地址
   * @param params 加载参数，包括数据源、瓦片坐标等
   * @returns 瓦片纹理
   */
  async doLoad(e, A) {
    const { x: i, y: n, z: r, source: g } = A, a = g.userData, h = "style" in g ? g.style : a.style;
    return a.gv ? this._getTileTexture(a.gv, i, n, r, h) : (a.loading || (a.loading = !0, a.gv = await this.loadJSON(e), a.loading = !1), await (async () => {
      for (; !a.gv; )
        await new Promise((o) => setTimeout(o, 100));
    })(), console.assert(a.gv), this._getTileTexture(a.gv, i, n, r, h));
  }
  /**
   * 异步加载 JSON 文件，创建 geojson-vt 实例返回。
   *
   * @param url JSON 文件的 URL 地址
   * @returns 返回 geojsonvt 实例
   */
  async loadJSON(e) {
    console.log("load geoJSON", e);
    const A = await this._loader.loadAsync(e).catch((i) => {
      console.error("GeoJSON load error: ", e, i.message);
    });
    return br(A, {
      tolerance: 2,
      // buffer: 10,
      extent: 256,
      maxZoom: 20,
      indexMaxZoom: 4
    });
  }
  drawTile(e, A) {
    const i = new OffscreenCanvas(256, 256), n = i.getContext("2d");
    if (n) {
      n.scale(1, -1), n.translate(0, -256), n.save();
      const r = e.features;
      for (let g = 0; g < r.length; g++)
        this._renderFeature(n, r[g], A);
      n.restore();
    }
    return i.transferToImageBitmap();
  }
  // 渲染单个要素
  _renderFeature(e, A, i = {}) {
    const n = [
      hA.Unknown,
      hA.Point,
      hA.Linestring,
      hA.Polygon
    ][A.type], r = {
      geometry: [],
      properties: {}
    };
    for (let g = 0; g < A.geometry.length; g++) {
      let a;
      Array.isArray(A.geometry[g][0]) ? a = A.geometry[g].map((h) => ({ x: h[0], y: h[1] })) : a = [{ x: A.geometry[g][0], y: A.geometry[g][1] }], r.geometry.push(a);
    }
    r.properties = A.tags, this._render.render(e, n, r, i);
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
  _getTileTexture(e, A, i, n, r) {
    if (n < (r.minLevel ?? 1) || n > (r.maxLevel ?? 20))
      return new ne();
    const g = e.getTile(n, A, i);
    if (!g)
      return new ne();
    const a = this.drawTile(g, r);
    return new Zt(a);
  }
}
class la extends j {
  constructor(e) {
    super(e), iA(this, "dataType", "geojson"), iA(this, "style", {}), Object.assign(this, e);
  }
}
function CA(t, e) {
  this.x = t, this.y = e;
}
CA.prototype = {
  /**
   * Clone this point, returning a new point that can be modified
   * without affecting the old one.
   * @return {Point} the clone
   */
  clone() {
    return new CA(this.x, this.y);
  },
  /**
   * Add this point's x & y coordinates to another point,
   * yielding a new point.
   * @param {Point} p the other point
   * @return {Point} output point
   */
  add(t) {
    return this.clone()._add(t);
  },
  /**
   * Subtract this point's x & y coordinates to from point,
   * yielding a new point.
   * @param {Point} p the other point
   * @return {Point} output point
   */
  sub(t) {
    return this.clone()._sub(t);
  },
  /**
   * Multiply this point's x & y coordinates by point,
   * yielding a new point.
   * @param {Point} p the other point
   * @return {Point} output point
   */
  multByPoint(t) {
    return this.clone()._multByPoint(t);
  },
  /**
   * Divide this point's x & y coordinates by point,
   * yielding a new point.
   * @param {Point} p the other point
   * @return {Point} output point
   */
  divByPoint(t) {
    return this.clone()._divByPoint(t);
  },
  /**
   * Multiply this point's x & y coordinates by a factor,
   * yielding a new point.
   * @param {number} k factor
   * @return {Point} output point
   */
  mult(t) {
    return this.clone()._mult(t);
  },
  /**
   * Divide this point's x & y coordinates by a factor,
   * yielding a new point.
   * @param {number} k factor
   * @return {Point} output point
   */
  div(t) {
    return this.clone()._div(t);
  },
  /**
   * Rotate this point around the 0, 0 origin by an angle a,
   * given in radians
   * @param {number} a angle to rotate around, in radians
   * @return {Point} output point
   */
  rotate(t) {
    return this.clone()._rotate(t);
  },
  /**
   * Rotate this point around p point by an angle a,
   * given in radians
   * @param {number} a angle to rotate around, in radians
   * @param {Point} p Point to rotate around
   * @return {Point} output point
   */
  rotateAround(t, e) {
    return this.clone()._rotateAround(t, e);
  },
  /**
   * Multiply this point by a 4x1 transformation matrix
   * @param {[number, number, number, number]} m transformation matrix
   * @return {Point} output point
   */
  matMult(t) {
    return this.clone()._matMult(t);
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
  equals(t) {
    return this.x === t.x && this.y === t.y;
  },
  /**
   * Calculate the distance from this point to another point
   * @param {Point} p the other point
   * @return {number} distance
   */
  dist(t) {
    return Math.sqrt(this.distSqr(t));
  },
  /**
   * Calculate the distance from this point to another point,
   * without the square root step. Useful if you're comparing
   * relative distances.
   * @param {Point} p the other point
   * @return {number} distance
   */
  distSqr(t) {
    const e = t.x - this.x, A = t.y - this.y;
    return e * e + A * A;
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
  angleTo(t) {
    return Math.atan2(this.y - t.y, this.x - t.x);
  },
  /**
   * Get the angle between this point and another point, in radians
   * @param {Point} b the other point
   * @return {number} angle
   */
  angleWith(t) {
    return this.angleWithSep(t.x, t.y);
  },
  /**
   * Find the angle of the two vectors, solving the formula for
   * the cross product a x b = |a||b|sin(θ) for θ.
   * @param {number} x the x-coordinate
   * @param {number} y the y-coordinate
   * @return {number} the angle in radians
   */
  angleWithSep(t, e) {
    return Math.atan2(
      this.x * e - this.y * t,
      this.x * t + this.y * e
    );
  },
  /** @param {[number, number, number, number]} m */
  _matMult(t) {
    const e = t[0] * this.x + t[1] * this.y, A = t[2] * this.x + t[3] * this.y;
    return this.x = e, this.y = A, this;
  },
  /** @param {Point} p */
  _add(t) {
    return this.x += t.x, this.y += t.y, this;
  },
  /** @param {Point} p */
  _sub(t) {
    return this.x -= t.x, this.y -= t.y, this;
  },
  /** @param {number} k */
  _mult(t) {
    return this.x *= t, this.y *= t, this;
  },
  /** @param {number} k */
  _div(t) {
    return this.x /= t, this.y /= t, this;
  },
  /** @param {Point} p */
  _multByPoint(t) {
    return this.x *= t.x, this.y *= t.y, this;
  },
  /** @param {Point} p */
  _divByPoint(t) {
    return this.x /= t.x, this.y /= t.y, this;
  },
  _unit() {
    return this._div(this.mag()), this;
  },
  _perp() {
    const t = this.y;
    return this.y = this.x, this.x = -t, this;
  },
  /** @param {number} angle */
  _rotate(t) {
    const e = Math.cos(t), A = Math.sin(t), i = e * this.x - A * this.y, n = A * this.x + e * this.y;
    return this.x = i, this.y = n, this;
  },
  /**
   * @param {number} angle
   * @param {Point} p
   */
  _rotateAround(t, e) {
    const A = Math.cos(t), i = Math.sin(t), n = e.x + A * (this.x - e.x) - i * (this.y - e.y), r = e.y + i * (this.x - e.x) + A * (this.y - e.y);
    return this.x = n, this.y = r, this;
  },
  _round() {
    return this.x = Math.round(this.x), this.y = Math.round(this.y), this;
  },
  constructor: CA
};
CA.convert = function(t) {
  if (t instanceof CA)
    return (
      /** @type {Point} */
      t
    );
  if (Array.isArray(t))
    return new CA(+t[0], +t[1]);
  if (t.x !== void 0 && t.y !== void 0)
    return new CA(+t.x, +t.y);
  throw new Error("Expected [x, y] or {x, y} point format");
};
class ui {
  /**
   * @param {Pbf} pbf
   * @param {number} end
   * @param {number} extent
   * @param {string[]} keys
   * @param {unknown[]} values
   */
  constructor(e, A, i, n, r) {
    this.properties = {}, this.extent = i, this.type = 0, this.id = void 0, this._pbf = e, this._geometry = -1, this._keys = n, this._values = r, e.readFields(Lr, this, A);
  }
  loadGeometry() {
    const e = this._pbf;
    e.pos = this._geometry;
    const A = e.readVarint() + e.pos, i = [];
    let n, r = 1, g = 0, a = 0, h = 0;
    for (; e.pos < A; ) {
      if (g <= 0) {
        const o = e.readVarint();
        r = o & 7, g = o >> 3;
      }
      if (g--, r === 1 || r === 2)
        a += e.readSVarint(), h += e.readSVarint(), r === 1 && (n && i.push(n), n = []), n && n.push(new CA(a, h));
      else if (r === 7)
        n && n.push(n[0].clone());
      else
        throw new Error(`unknown command ${r}`);
    }
    return n && i.push(n), i;
  }
  bbox() {
    const e = this._pbf;
    e.pos = this._geometry;
    const A = e.readVarint() + e.pos;
    let i = 1, n = 0, r = 0, g = 0, a = 1 / 0, h = -1 / 0, o = 1 / 0, s = -1 / 0;
    for (; e.pos < A; ) {
      if (n <= 0) {
        const I = e.readVarint();
        i = I & 7, n = I >> 3;
      }
      if (n--, i === 1 || i === 2)
        r += e.readSVarint(), g += e.readSVarint(), r < a && (a = r), r > h && (h = r), g < o && (o = g), g > s && (s = g);
      else if (i !== 7)
        throw new Error(`unknown command ${i}`);
    }
    return [a, o, h, s];
  }
  /**
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @return {Feature}
   */
  toGeoJSON(e, A, i) {
    const n = this.extent * Math.pow(2, i), r = this.extent * e, g = this.extent * A, a = this.loadGeometry();
    function h(c) {
      return [
        (c.x + r) * 360 / n - 180,
        360 / Math.PI * Math.atan(Math.exp((1 - (c.y + g) * 2 / n) * Math.PI)) - 90
      ];
    }
    function o(c) {
      return c.map(h);
    }
    let s;
    if (this.type === 1) {
      const c = [];
      for (const f of a)
        c.push(f[0]);
      const l = o(c);
      s = c.length === 1 ? { type: "Point", coordinates: l[0] } : { type: "MultiPoint", coordinates: l };
    } else if (this.type === 2) {
      const c = a.map(o);
      s = c.length === 1 ? { type: "LineString", coordinates: c[0] } : { type: "MultiLineString", coordinates: c };
    } else if (this.type === 3) {
      const c = vr(a), l = [];
      for (const f of c)
        l.push(f.map(o));
      s = l.length === 1 ? { type: "Polygon", coordinates: l[0] } : { type: "MultiPolygon", coordinates: l };
    } else
      throw new Error("unknown feature type");
    const I = {
      type: "Feature",
      geometry: s,
      properties: this.properties
    };
    return this.id != null && (I.id = this.id), I;
  }
}
ui.types = ["Unknown", "Point", "LineString", "Polygon"];
function Lr(t, e, A) {
  t === 1 ? e.id = A.readVarint() : t === 2 ? Ur(A, e) : t === 3 ? e.type = /** @type {0 | 1 | 2 | 3} */
  A.readVarint() : t === 4 && (e._geometry = A.pos);
}
function Ur(t, e) {
  const A = t.readVarint() + t.pos;
  for (; t.pos < A; ) {
    const i = e._keys[t.readVarint()], n = e._values[t.readVarint()];
    e.properties[i] = n;
  }
}
function vr(t) {
  const e = t.length;
  if (e <= 1) return [t];
  const A = [];
  let i, n;
  for (let r = 0; r < e; r++) {
    const g = Rr(t[r]);
    g !== 0 && (n === void 0 && (n = g < 0), n === g < 0 ? (i && A.push(i), i = [t[r]]) : i && i.push(t[r]));
  }
  return i && A.push(i), A;
}
function Rr(t) {
  let e = 0;
  for (let A = 0, i = t.length, n = i - 1, r, g; A < i; n = A++)
    r = t[A], g = t[n], e += (g.x - r.x) * (r.y + g.y);
  return e;
}
class Nr {
  /**
   * @param {Pbf} pbf
   * @param {number} [end]
   */
  constructor(e, A) {
    this.version = 1, this.name = "", this.extent = 4096, this.length = 0, this._pbf = e, this._keys = [], this._values = [], this._features = [], e.readFields(Tr, this, A), this.length = this._features.length;
  }
  /** return feature `i` from this layer as a `VectorTileFeature`
   * @param {number} i
   */
  feature(e) {
    if (e < 0 || e >= this._features.length) throw new Error("feature index out of bounds");
    this._pbf.pos = this._features[e];
    const A = this._pbf.readVarint() + this._pbf.pos;
    return new ui(this._pbf, A, this.extent, this._keys, this._values);
  }
}
function Tr(t, e, A) {
  t === 15 ? e.version = A.readVarint() : t === 1 ? e.name = A.readString() : t === 5 ? e.extent = A.readVarint() : t === 2 ? e._features.push(A.pos) : t === 3 ? e._keys.push(A.readString()) : t === 4 && e._values.push(qr(A));
}
function qr(t) {
  let e = null;
  const A = t.readVarint() + t.pos;
  for (; t.pos < A; ) {
    const i = t.readVarint() >> 3;
    e = i === 1 ? t.readString() : i === 2 ? t.readFloat() : i === 3 ? t.readDouble() : i === 4 ? t.readVarint64() : i === 5 ? t.readVarint() : i === 6 ? t.readSVarint() : i === 7 ? t.readBoolean() : null;
  }
  return e;
}
class Yr {
  /**
   * @param {Pbf} pbf
   * @param {number} [end]
   */
  constructor(e, A) {
    this.layers = e.readFields(_r, {}, A);
  }
}
function _r(t, e, A) {
  if (t === 3) {
    const i = new Nr(A, A.readVarint() + A.pos);
    i.length && (e[i.name] = i);
  }
}
const Re = 65536 * 65536, lt = 1 / Re, Jr = 12, ft = typeof TextDecoder > "u" ? null : new TextDecoder("utf-8"), de = 0, VA = 1, GA = 2, KA = 5;
class Or {
  /**
   * @param {Uint8Array | ArrayBuffer} [buf]
   */
  constructor(e = new Uint8Array(16)) {
    this.buf = ArrayBuffer.isView(e) ? e : new Uint8Array(e), this.dataView = new DataView(this.buf.buffer), this.pos = 0, this.type = 0, this.length = this.buf.length;
  }
  // === READING =================================================================
  /**
   * @template T
   * @param {(tag: number, result: T, pbf: Pbf) => void} readField
   * @param {T} result
   * @param {number} [end]
   */
  readFields(e, A, i = this.length) {
    for (; this.pos < i; ) {
      const n = this.readVarint(), r = n >> 3, g = this.pos;
      this.type = n & 7, e(r, A, this), this.pos === g && this.skip(n);
    }
    return A;
  }
  /**
   * @template T
   * @param {(tag: number, result: T, pbf: Pbf) => void} readField
   * @param {T} result
   */
  readMessage(e, A) {
    return this.readFields(e, A, this.readVarint() + this.pos);
  }
  readFixed32() {
    const e = this.dataView.getUint32(this.pos, !0);
    return this.pos += 4, e;
  }
  readSFixed32() {
    const e = this.dataView.getInt32(this.pos, !0);
    return this.pos += 4, e;
  }
  // 64-bit int handling is based on github.com/dpw/node-buffer-more-ints (MIT-licensed)
  readFixed64() {
    const e = this.dataView.getUint32(this.pos, !0) + this.dataView.getUint32(this.pos + 4, !0) * Re;
    return this.pos += 8, e;
  }
  readSFixed64() {
    const e = this.dataView.getUint32(this.pos, !0) + this.dataView.getInt32(this.pos + 4, !0) * Re;
    return this.pos += 8, e;
  }
  readFloat() {
    const e = this.dataView.getFloat32(this.pos, !0);
    return this.pos += 4, e;
  }
  readDouble() {
    const e = this.dataView.getFloat64(this.pos, !0);
    return this.pos += 8, e;
  }
  /**
   * @param {boolean} [isSigned]
   */
  readVarint(e) {
    const A = this.buf;
    let i, n;
    return n = A[this.pos++], i = n & 127, n < 128 || (n = A[this.pos++], i |= (n & 127) << 7, n < 128) || (n = A[this.pos++], i |= (n & 127) << 14, n < 128) || (n = A[this.pos++], i |= (n & 127) << 21, n < 128) ? i : (n = A[this.pos], i |= (n & 15) << 28, Vr(i, e, this));
  }
  readVarint64() {
    return this.readVarint(!0);
  }
  readSVarint() {
    const e = this.readVarint();
    return e % 2 === 1 ? (e + 1) / -2 : e / 2;
  }
  readBoolean() {
    return !!this.readVarint();
  }
  readString() {
    const e = this.readVarint() + this.pos, A = this.pos;
    return this.pos = e, e - A >= Jr && ft ? ft.decode(this.buf.subarray(A, e)) : ns(this.buf, A, e);
  }
  readBytes() {
    const e = this.readVarint() + this.pos, A = this.buf.subarray(this.pos, e);
    return this.pos = e, A;
  }
  // verbose for performance reasons; doesn't affect gzipped size
  /**
   * @param {number[]} [arr]
   * @param {boolean} [isSigned]
   */
  readPackedVarint(e = [], A) {
    const i = this.readPackedEnd();
    for (; this.pos < i; ) e.push(this.readVarint(A));
    return e;
  }
  /** @param {number[]} [arr] */
  readPackedSVarint(e = []) {
    const A = this.readPackedEnd();
    for (; this.pos < A; ) e.push(this.readSVarint());
    return e;
  }
  /** @param {boolean[]} [arr] */
  readPackedBoolean(e = []) {
    const A = this.readPackedEnd();
    for (; this.pos < A; ) e.push(this.readBoolean());
    return e;
  }
  /** @param {number[]} [arr] */
  readPackedFloat(e = []) {
    const A = this.readPackedEnd();
    for (; this.pos < A; ) e.push(this.readFloat());
    return e;
  }
  /** @param {number[]} [arr] */
  readPackedDouble(e = []) {
    const A = this.readPackedEnd();
    for (; this.pos < A; ) e.push(this.readDouble());
    return e;
  }
  /** @param {number[]} [arr] */
  readPackedFixed32(e = []) {
    const A = this.readPackedEnd();
    for (; this.pos < A; ) e.push(this.readFixed32());
    return e;
  }
  /** @param {number[]} [arr] */
  readPackedSFixed32(e = []) {
    const A = this.readPackedEnd();
    for (; this.pos < A; ) e.push(this.readSFixed32());
    return e;
  }
  /** @param {number[]} [arr] */
  readPackedFixed64(e = []) {
    const A = this.readPackedEnd();
    for (; this.pos < A; ) e.push(this.readFixed64());
    return e;
  }
  /** @param {number[]} [arr] */
  readPackedSFixed64(e = []) {
    const A = this.readPackedEnd();
    for (; this.pos < A; ) e.push(this.readSFixed64());
    return e;
  }
  readPackedEnd() {
    return this.type === GA ? this.readVarint() + this.pos : this.pos + 1;
  }
  /** @param {number} val */
  skip(e) {
    const A = e & 7;
    if (A === de) for (; this.buf[this.pos++] > 127; )
      ;
    else if (A === GA) this.pos = this.readVarint() + this.pos;
    else if (A === KA) this.pos += 4;
    else if (A === VA) this.pos += 8;
    else throw new Error(`Unimplemented type: ${A}`);
  }
  // === WRITING =================================================================
  /**
   * @param {number} tag
   * @param {number} type
   */
  writeTag(e, A) {
    this.writeVarint(e << 3 | A);
  }
  /** @param {number} min */
  realloc(e) {
    let A = this.length || 16;
    for (; A < this.pos + e; ) A *= 2;
    if (A !== this.length) {
      const i = new Uint8Array(A);
      i.set(this.buf), this.buf = i, this.dataView = new DataView(i.buffer), this.length = A;
    }
  }
  finish() {
    return this.length = this.pos, this.pos = 0, this.buf.subarray(0, this.length);
  }
  /** @param {number} val */
  writeFixed32(e) {
    this.realloc(4), this.dataView.setInt32(this.pos, e, !0), this.pos += 4;
  }
  /** @param {number} val */
  writeSFixed32(e) {
    this.realloc(4), this.dataView.setInt32(this.pos, e, !0), this.pos += 4;
  }
  /** @param {number} val */
  writeFixed64(e) {
    this.realloc(8), this.dataView.setInt32(this.pos, e & -1, !0), this.dataView.setInt32(this.pos + 4, Math.floor(e * lt), !0), this.pos += 8;
  }
  /** @param {number} val */
  writeSFixed64(e) {
    this.realloc(8), this.dataView.setInt32(this.pos, e & -1, !0), this.dataView.setInt32(this.pos + 4, Math.floor(e * lt), !0), this.pos += 8;
  }
  /** @param {number} val */
  writeVarint(e) {
    if (e = +e || 0, e > 268435455 || e < 0) {
      Hr(e, this);
      return;
    }
    this.realloc(4), this.buf[this.pos++] = e & 127 | (e > 127 ? 128 : 0), !(e <= 127) && (this.buf[this.pos++] = (e >>>= 7) & 127 | (e > 127 ? 128 : 0), !(e <= 127) && (this.buf[this.pos++] = (e >>>= 7) & 127 | (e > 127 ? 128 : 0), !(e <= 127) && (this.buf[this.pos++] = e >>> 7 & 127)));
  }
  /** @param {number} val */
  writeSVarint(e) {
    this.writeVarint(e < 0 ? -e * 2 - 1 : e * 2);
  }
  /** @param {boolean} val */
  writeBoolean(e) {
    this.writeVarint(+e);
  }
  /** @param {string} str */
  writeString(e) {
    e = String(e), this.realloc(e.length * 4), this.pos++;
    const A = this.pos;
    this.pos = rs(this.buf, e, this.pos);
    const i = this.pos - A;
    i >= 128 && ct(A, i, this), this.pos = A - 1, this.writeVarint(i), this.pos += i;
  }
  /** @param {number} val */
  writeFloat(e) {
    this.realloc(4), this.dataView.setFloat32(this.pos, e, !0), this.pos += 4;
  }
  /** @param {number} val */
  writeDouble(e) {
    this.realloc(8), this.dataView.setFloat64(this.pos, e, !0), this.pos += 8;
  }
  /** @param {Uint8Array} buffer */
  writeBytes(e) {
    const A = e.length;
    this.writeVarint(A), this.realloc(A);
    for (let i = 0; i < A; i++) this.buf[this.pos++] = e[i];
  }
  /**
   * @template T
   * @param {(obj: T, pbf: Pbf) => void} fn
   * @param {T} obj
   */
  writeRawMessage(e, A) {
    this.pos++;
    const i = this.pos;
    e(A, this);
    const n = this.pos - i;
    n >= 128 && ct(i, n, this), this.pos = i - 1, this.writeVarint(n), this.pos += n;
  }
  /**
   * @template T
   * @param {number} tag
   * @param {(obj: T, pbf: Pbf) => void} fn
   * @param {T} obj
   */
  writeMessage(e, A, i) {
    this.writeTag(e, GA), this.writeRawMessage(A, i);
  }
  /**
   * @param {number} tag
   * @param {number[]} arr
   */
  writePackedVarint(e, A) {
    A.length && this.writeMessage(e, jr, A);
  }
  /**
   * @param {number} tag
   * @param {number[]} arr
   */
  writePackedSVarint(e, A) {
    A.length && this.writeMessage(e, Zr, A);
  }
  /**
   * @param {number} tag
   * @param {boolean[]} arr
   */
  writePackedBoolean(e, A) {
    A.length && this.writeMessage(e, $r, A);
  }
  /**
   * @param {number} tag
   * @param {number[]} arr
   */
  writePackedFloat(e, A) {
    A.length && this.writeMessage(e, zr, A);
  }
  /**
   * @param {number} tag
   * @param {number[]} arr
   */
  writePackedDouble(e, A) {
    A.length && this.writeMessage(e, Wr, A);
  }
  /**
   * @param {number} tag
   * @param {number[]} arr
   */
  writePackedFixed32(e, A) {
    A.length && this.writeMessage(e, As, A);
  }
  /**
   * @param {number} tag
   * @param {number[]} arr
   */
  writePackedSFixed32(e, A) {
    A.length && this.writeMessage(e, es, A);
  }
  /**
   * @param {number} tag
   * @param {number[]} arr
   */
  writePackedFixed64(e, A) {
    A.length && this.writeMessage(e, ts, A);
  }
  /**
   * @param {number} tag
   * @param {number[]} arr
   */
  writePackedSFixed64(e, A) {
    A.length && this.writeMessage(e, is, A);
  }
  /**
   * @param {number} tag
   * @param {Uint8Array} buffer
   */
  writeBytesField(e, A) {
    this.writeTag(e, GA), this.writeBytes(A);
  }
  /**
   * @param {number} tag
   * @param {number} val
   */
  writeFixed32Field(e, A) {
    this.writeTag(e, KA), this.writeFixed32(A);
  }
  /**
   * @param {number} tag
   * @param {number} val
   */
  writeSFixed32Field(e, A) {
    this.writeTag(e, KA), this.writeSFixed32(A);
  }
  /**
   * @param {number} tag
   * @param {number} val
   */
  writeFixed64Field(e, A) {
    this.writeTag(e, VA), this.writeFixed64(A);
  }
  /**
   * @param {number} tag
   * @param {number} val
   */
  writeSFixed64Field(e, A) {
    this.writeTag(e, VA), this.writeSFixed64(A);
  }
  /**
   * @param {number} tag
   * @param {number} val
   */
  writeVarintField(e, A) {
    this.writeTag(e, de), this.writeVarint(A);
  }
  /**
   * @param {number} tag
   * @param {number} val
   */
  writeSVarintField(e, A) {
    this.writeTag(e, de), this.writeSVarint(A);
  }
  /**
   * @param {number} tag
   * @param {string} str
   */
  writeStringField(e, A) {
    this.writeTag(e, GA), this.writeString(A);
  }
  /**
   * @param {number} tag
   * @param {number} val
   */
  writeFloatField(e, A) {
    this.writeTag(e, KA), this.writeFloat(A);
  }
  /**
   * @param {number} tag
   * @param {number} val
   */
  writeDoubleField(e, A) {
    this.writeTag(e, VA), this.writeDouble(A);
  }
  /**
   * @param {number} tag
   * @param {boolean} val
   */
  writeBooleanField(e, A) {
    this.writeVarintField(e, +A);
  }
}
function Vr(t, e, A) {
  const i = A.buf;
  let n, r;
  if (r = i[A.pos++], n = (r & 112) >> 4, r < 128 || (r = i[A.pos++], n |= (r & 127) << 3, r < 128) || (r = i[A.pos++], n |= (r & 127) << 10, r < 128) || (r = i[A.pos++], n |= (r & 127) << 17, r < 128) || (r = i[A.pos++], n |= (r & 127) << 24, r < 128) || (r = i[A.pos++], n |= (r & 1) << 31, r < 128)) return Kr(t, n, e);
  throw new Error("Expected varint not more than 10 bytes");
}
function Kr(t, e, A) {
  return A ? e * 4294967296 + (t >>> 0) : (e >>> 0) * 4294967296 + (t >>> 0);
}
function Hr(t, e) {
  let A, i;
  if (t >= 0 ? (A = t % 4294967296 | 0, i = t / 4294967296 | 0) : (A = ~(-t % 4294967296), i = ~(-t / 4294967296), A ^ 4294967295 ? A = A + 1 | 0 : (A = 0, i = i + 1 | 0)), t >= 18446744073709552e3 || t < -18446744073709552e3)
    throw new Error("Given varint doesn't fit into 10 bytes");
  e.realloc(10), Pr(A, i, e), Xr(i, e);
}
function Pr(t, e, A) {
  A.buf[A.pos++] = t & 127 | 128, t >>>= 7, A.buf[A.pos++] = t & 127 | 128, t >>>= 7, A.buf[A.pos++] = t & 127 | 128, t >>>= 7, A.buf[A.pos++] = t & 127 | 128, t >>>= 7, A.buf[A.pos] = t & 127;
}
function Xr(t, e) {
  const A = (t & 7) << 4;
  e.buf[e.pos++] |= A | ((t >>>= 3) ? 128 : 0), t && (e.buf[e.pos++] = t & 127 | ((t >>>= 7) ? 128 : 0), t && (e.buf[e.pos++] = t & 127 | ((t >>>= 7) ? 128 : 0), t && (e.buf[e.pos++] = t & 127 | ((t >>>= 7) ? 128 : 0), t && (e.buf[e.pos++] = t & 127 | ((t >>>= 7) ? 128 : 0), t && (e.buf[e.pos++] = t & 127)))));
}
function ct(t, e, A) {
  const i = e <= 16383 ? 1 : e <= 2097151 ? 2 : e <= 268435455 ? 3 : Math.floor(Math.log(e) / (Math.LN2 * 7));
  A.realloc(i);
  for (let n = A.pos - 1; n >= t; n--) A.buf[n + i] = A.buf[n];
}
function jr(t, e) {
  for (let A = 0; A < t.length; A++) e.writeVarint(t[A]);
}
function Zr(t, e) {
  for (let A = 0; A < t.length; A++) e.writeSVarint(t[A]);
}
function zr(t, e) {
  for (let A = 0; A < t.length; A++) e.writeFloat(t[A]);
}
function Wr(t, e) {
  for (let A = 0; A < t.length; A++) e.writeDouble(t[A]);
}
function $r(t, e) {
  for (let A = 0; A < t.length; A++) e.writeBoolean(t[A]);
}
function As(t, e) {
  for (let A = 0; A < t.length; A++) e.writeFixed32(t[A]);
}
function es(t, e) {
  for (let A = 0; A < t.length; A++) e.writeSFixed32(t[A]);
}
function ts(t, e) {
  for (let A = 0; A < t.length; A++) e.writeFixed64(t[A]);
}
function is(t, e) {
  for (let A = 0; A < t.length; A++) e.writeSFixed64(t[A]);
}
function ns(t, e, A) {
  let i = "", n = e;
  for (; n < A; ) {
    const r = t[n];
    let g = null, a = r > 239 ? 4 : r > 223 ? 3 : r > 191 ? 2 : 1;
    if (n + a > A) break;
    let h, o, s;
    a === 1 ? r < 128 && (g = r) : a === 2 ? (h = t[n + 1], (h & 192) === 128 && (g = (r & 31) << 6 | h & 63, g <= 127 && (g = null))) : a === 3 ? (h = t[n + 1], o = t[n + 2], (h & 192) === 128 && (o & 192) === 128 && (g = (r & 15) << 12 | (h & 63) << 6 | o & 63, (g <= 2047 || g >= 55296 && g <= 57343) && (g = null))) : a === 4 && (h = t[n + 1], o = t[n + 2], s = t[n + 3], (h & 192) === 128 && (o & 192) === 128 && (s & 192) === 128 && (g = (r & 15) << 18 | (h & 63) << 12 | (o & 63) << 6 | s & 63, (g <= 65535 || g >= 1114112) && (g = null))), g === null ? (g = 65533, a = 1) : g > 65535 && (g -= 65536, i += String.fromCharCode(g >>> 10 & 1023 | 55296), g = 56320 | g & 1023), i += String.fromCharCode(g), n += a;
  }
  return i;
}
function rs(t, e, A) {
  for (let i = 0, n, r; i < e.length; i++) {
    if (n = e.charCodeAt(i), n > 55295 && n < 57344)
      if (r)
        if (n < 56320) {
          t[A++] = 239, t[A++] = 191, t[A++] = 189, r = n;
          continue;
        } else
          n = r - 55296 << 10 | n - 56320 | 65536, r = null;
      else {
        n > 56319 || i + 1 === e.length ? (t[A++] = 239, t[A++] = 191, t[A++] = 189) : r = n;
        continue;
      }
    else r && (t[A++] = 239, t[A++] = 191, t[A++] = 189, r = null);
    n < 128 ? t[A++] = n : (n < 2048 ? t[A++] = n >> 6 | 192 : (n < 65536 ? t[A++] = n >> 12 | 224 : (t[A++] = n >> 18 | 240, t[A++] = n >> 12 & 63 | 128), t[A++] = n >> 6 & 63 | 128), t[A++] = n & 63 | 128);
  }
  return A;
}
class fa extends Xt {
  constructor() {
    super(), iA(this, "dataType", "mvt"), iA(this, "info", {
      version: "0.10.0",
      author: "GuoJF",
      description: "MVT瓦片加载器"
    }), iA(this, "_loader", new Je(se.manager)), iA(this, "_render", new jt()), this._loader.setResponseType("arraybuffer");
  }
  async doLoad(e, A) {
    const i = A.source, n = "style" in i ? i.style : i.userData.style, r = await this._loader.loadAsync(e).catch(() => new ne()), g = new Yr(new Or(r)), a = this.drawTile(g, n, A.z);
    return new Zt(a);
  }
  /**
   * 在离屏画布上绘制矢量瓦片
   *
   * @param vectorTile 待绘制的矢量瓦片对象
   * @returns 绘制完成的图像位图
   * @throws 如果画布上下文不可用，则抛出错误
   */
  drawTile(e, A, i) {
    const n = new OffscreenCanvas(256, 256).getContext("2d");
    if (n) {
      if (n.scale(1, -1), n.translate(0, -256), A)
        for (const r in A.layer) {
          const g = A.layer[r];
          if (A && (i < (g.minLevel ?? 1) || i > (g.maxLevel ?? 20)))
            continue;
          const a = e.layers[r];
          if (a) {
            const h = 256 / a.extent;
            this._renderLayer(n, a, g, h);
          }
        }
      else
        for (const r in e.layers) {
          const g = e.layers[r], a = 256 / g.extent;
          this._renderLayer(n, g, void 0, a);
        }
      return n.canvas.transferToImageBitmap();
    } else
      throw new Error("Canvas context is not available");
  }
  _renderLayer(e, A, i, n = 1) {
    e.save();
    for (let r = 0; r < A.length; r++) {
      const g = A.feature(r);
      this._renderFeature(e, g, i, n);
    }
    return e.restore(), this;
  }
  // 渲染单个要素
  _renderFeature(e, A, i = {}, n = 1) {
    const r = [
      hA.Unknown,
      hA.Point,
      hA.Linestring,
      hA.Polygon
    ][A.type], g = {
      geometry: A.loadGeometry(),
      properties: A.properties
    };
    this._render.render(e, r, g, i, n);
  }
}
class ca extends j {
  //  "https://demotiles.maplibre.org/style.json";
  constructor(e) {
    super(e), iA(this, "dataType", "mvt"), Object.assign(this, e);
  }
}
const ss = `<style>\r
	#tt-compass {\r
		width: 100%;\r
		height: 100%;\r
		display: flex;\r
		align-items: center;\r
		justify-content: center;\r
		border-radius: 50%;\r
		border: 1px solid #fffc;\r
		filter: drop-shadow(0px 0px 2px black);\r
		background-color: #0005;\r
		cursor: pointer;\r
	}\r
	#tt-compass > .tt-circle {\r
		width: 60%;\r
		height: 60%;\r
		text-align: center;\r
		border-radius: 50%;\r
		border: 1px solid #fffc;\r
		background-color: #fff4;\r
		display: flex;\r
		justify-content: center;\r
	}\r
\r
	#tt-compass:hover > .tt-circle {\r
		background-color: #0f05;\r
	}\r
\r
	#tt-compass:active .tt-circle {\r
		background-color: #000;\r
	}\r
\r
	#tt-compass > #tt-compass-text {\r
		position: absolute;\r
		top: 0px;\r
		left: 0px;\r
		width: 100%;\r
		height: 100%;\r
		display: grid;\r
		align-items: center;\r
		justify-items: center;\r
		grid-template-columns: 18% auto 18%;\r
		grid-template-rows: 18% auto 18%;\r
		text-shadow: 0px 0px 2px black;\r
		font-size: 10px;\r
	}\r
\r
	#tt-compass > .tt-circle > #tt-compass-plane {\r
		height: 90%;\r
		width: 90%;\r
		fill: #fffc;\r
		filter: drop-shadow(5px 5px 5px black);\r
	}\r
</style>\r
\r
<div id="tt-compass">\r
	<div class="tt-circle">\r
		<svg\r
			id="tt-compass-plane"\r
			viewBox="0 0 1024 1024"\r
			version="1.1"\r
			xmlns="http://www.w3.org/2000/svg"\r
		>\r
			<path\r
				d="M479.075523 711.254681c0 70.2291 0.083871 114.20878 0.218064 140.734974l-148.360914 106.16768 0 65.842665c0 0 137.164181-31.552144 156.372659-56.247861 19.212672-24.685233 1.369189 45.264997 24.691523 45.264997 23.324432 0 5.476754-69.95023 24.695717-45.264997 19.206382 24.695717 156.372659 56.247861 156.372659 56.247861l0-65.842665-148.375592-106.16768c0.14258-26.526194 0.226451-70.505874 0.226451-140.734974 0-283.942036 460.894459 0 460.894459 0l0-79.555518-115.225712-85.227272 0-65.662343c0-9.083193-13.343823-16.461715-24.685233-16.461715-11.351894 0-24.695717 7.378522-24.695717 16.461715l0 29.119895-85.724206-63.422996c0-178.315322-28.115543-160.490709-28.115543-160.490709s-21.938469 15.094623-24.685233 100.128992c-1.645962 51.108686-52.339488 15.51817-92.547084-21.017988l-22.569596-104.490267-26.182325-14.138497c0-35.590516 0-81.312609 0-129.18179C561.379902 13.064953 511.307019 0 511.307019 0s-48.693211 13.054469-48.693211 117.311994c0 47.240151 0 92.396117 0 127.766473l-28.803283 14.329303-23.194432 106.176067 0.016774 0c3.310794-1.945799 6.558686-4.151598 9.735287-6.470622-3.159827 2.966925-6.407719 5.938043-9.735287 8.919645-39.630985 35.456323-87.693069 67.884915-89.311773 18.12445-2.748861-85.051143-24.691523-100.128992-24.691523-100.128992s-28.115543-17.824613-28.115543 160.490709l-85.724206 63.406222 0-29.119895c0-9.083193-13.335436-16.461715-24.691523-16.461715s-24.691523 7.378522-24.691523 16.461715l0 65.662343L18.187353 631.697066l0 79.555518C18.187353 711.254681 479.075523 427.310549 479.075523 711.254681z"\r
			></path>\r
		</svg>\r
	</div>\r
	<div id="tt-compass-text">\r
		<span></span> <span>N</span><span></span> <span>W</span><span></span><span>E</span> <span></span><span>S</span\r
		><span></span>\r
	</div>\r
</div>\r
`;
class os {
  /** 罗盘顶层dom */
  dom = document.createElement("div");
  /* 罗盘中的小飞机 */
  plane;
  /** 罗盘中的文字 */
  text;
  /* 地图控制器 */
  controls;
  /**
   * 构造函数
   * @param controls 地图控制器
   */
  constructor(e) {
    this.controls = e, this.dom.innerHTML = ss, this.dom.style.width = "100%", this.dom.style.height = "100%", this.plane = this.dom.querySelector("#tt-compass-plane"), this.text = this.dom.querySelector("#tt-compass-text"), e.addEventListener("change", () => {
      this.plane && this.text && (this.plane.style.transform = `rotateX(${e.getPolarAngle()}rad)`, this.text.style.transform = `rotate(${e.getAzimuthalAngle()}rad)`);
    }), this.dom.onclick = () => open("https://github.com/sxguojf/three-tile");
  }
}
function Ba(t) {
  return new os(t);
}
class as extends j {
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
class gs extends j {
  dataType = "image";
  attribution = "ArcGIS";
  style = "World_Imagery";
  url = "https://services.arcgisonline.com/arcgis/rest/services/{style}/MapServer/tile/{z}/{y}/{x}";
  constructor(e) {
    super(e), Object.assign(this, e);
  }
}
class Is extends j {
  dataType = "lerc";
  attribution = "ArcGIS";
  minLevel = 6;
  maxLevel = 13;
  url = "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer/tile/{z}/{y}/{x}";
  constructor(e) {
    super(e), Object.assign(this, e);
  }
}
class ls extends j {
  dataType = "image";
  attribution = "Bing[GS(2021)1731号]";
  style = "A";
  mkt = "zh-CN";
  subdomains = "123";
  constructor(e) {
    super(e), Object.assign(this, e);
  }
  getUrl(e, A, i) {
    const n = fs(i, e, A);
    return `https://t${this.s}.dynamic.tiles.ditu.live.com/comp/ch/${n}?mkt=${this.mkt}&ur=CN&it=${this.style}&n=z&og=804&cstl=vb`;
  }
}
function fs(t, e, A) {
  let i = "";
  for (let n = t; n > 0; n--) {
    const r = 1 << n - 1;
    let g = 0;
    e & r && g++, A & r && (g += 2), i += g;
  }
  return i;
}
class cs extends j {
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
class Bs extends j {
  dataType = "image";
  maxLevel = 16;
  attribution = "GeoQ[GS(2019)758号]";
  style = "ChinaOnlineStreetPurplishBlue";
  url = "https://map.geoq.cn/ArcGIS/rest/services/{style}/MapServer/tile/{z}/{y}/{x}";
  constructor(e) {
    super(e), Object.assign(this, e);
  }
}
class hs extends j {
  dataType = "image";
  attribution = "Google";
  maxLevel = 20;
  style = "y";
  subdomains = "0123";
  // 已失效
  // public url = "https://gac-geo.googlecnapps.cn/maps/vt?lyrs={style}&x={x}&y={y}&z={z}";
  // 2024年新地址，不知道能坚持多久。 续：坚持不到10天就挂了。
  // public url = "https://gac-geo.googlecnapps.club/maps/vt?lyrs={style}&x={x}&y={y}&z={z}";
  // 访问原版google，你懂的
  url = "http://mt{s}.google.com/vt/lyrs={style}&src=app&x={x}&y={y}&z={z}";
  constructor(e) {
    super(e), Object.assign(this, e);
  }
}
class Cs extends j {
  attribution = "MapTiler";
  token = "get_your_own_key_QmavnBrQwNGsQ8YvPzZg";
  format = "jpg";
  style = "satellite-v2";
  url = "https://api.maptiler.com/tiles/{style}/{z}/{x}/{y}.{format}?key={token}";
  constructor(e) {
    super(e), Object.assign(this, e);
  }
}
class Es extends j {
  dataType = "image";
  attribution = "Stadia";
  url = "https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}.jpg";
  constructor(e) {
    super(e), Object.assign(this, e);
  }
}
class Qs extends j {
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
class us extends j {
  dataType = "quantized-mesh";
  attribution = "天地图[GS(2023)336号]";
  token = "";
  subdomains = "01234";
  url = "https://t{s}.tianditu.gov.cn/mapservice/swdx?T=elv_c&tk={token}&x={x}&y={y}&l={z}";
  constructor(e) {
    super(e), Object.assign(this, e);
  }
}
class ds extends j {
  dataType = "image";
  style = "sateTiles";
  attribution = "腾讯[GS(2023)1号]";
  subdomains = "0123";
  maxLevel = 18;
  isTMS = !0;
  // public url = "https://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}";
  sx = 0;
  sy = 0;
  url = "https://p{s}.map.gtimg.com/{style}/{z}/{sx}/{sy}/{x}_{y}.jpg";
  constructor(e) {
    super(e), Object.assign(this, e);
  }
  _getUrl(e, A, i) {
    return this.sx = e >> 4, this.sy = (1 << i) - A >> 4, super._getUrl(e, A, i);
  }
}
class ws extends j {
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
class ys extends j {
  dataType = "quantized-mesh";
  attribution = "中科星图[GS(2022)3995号]";
  token = "";
  subdomains = "012";
  url = "https://tiles{s}.geovisearth.com/base/v1/terrain/{z}/{x}/{y}.terrain&token={token}";
  constructor(e) {
    super(e), Object.assign(this, e);
  }
}
const ha = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ArcGisDemSource: Is,
  ArcGisSource: gs,
  BingSource: ls,
  GDSource: cs,
  GeoqSource: Bs,
  GoogleSource: hs,
  MapBoxSource: as,
  MapTilerSource: Cs,
  StadiaSource: Es,
  TDTQMSource: us,
  TDTSource: Qs,
  TXSource: ds,
  ZKXTQMSource: ys,
  ZKXTSource: ws
}, Symbol.toStringTag, { value: "Module" }));
class ps extends dA {
  decodeBlock(e) {
    return e;
  }
}
const Ds = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ps
}, Symbol.toStringTag, { value: "Module" })), Bt = 9, we = 256, Ne = 257, xs = 12;
function ms(t, e, A) {
  const i = e % 8, n = Math.floor(e / 8), r = 8 - i, g = e + A - (n + 1) * 8;
  let a = 8 * (n + 2) - (e + A);
  const h = (n + 2) * 8 - e;
  if (a = Math.max(0, a), n >= t.length)
    return console.warn("ran off the end of the buffer before finding EOI_CODE (end on input code)"), Ne;
  let o = t[n] & 2 ** (8 - i) - 1;
  o <<= A - r;
  let s = o;
  if (n + 1 < t.length) {
    let I = t[n + 1] >>> a;
    I <<= Math.max(0, A - h), s += I;
  }
  if (g > 8 && n + 2 < t.length) {
    const I = (n + 3) * 8 - (e + A), c = t[n + 2] >>> I;
    s += c;
  }
  return s;
}
function ye(t, e) {
  for (let A = e.length - 1; A >= 0; A--)
    t.push(e[A]);
  return t;
}
function Fs(t) {
  const e = new Uint16Array(4093), A = new Uint8Array(4093);
  for (let f = 0; f <= 257; f++)
    e[f] = 4096, A[f] = f;
  let i = 258, n = Bt, r = 0;
  function g() {
    i = 258, n = Bt;
  }
  function a(f) {
    const d = ms(f, r, n);
    return r += n, d;
  }
  function h(f, d) {
    return A[i] = d, e[i] = f, i++, i - 1;
  }
  function o(f) {
    const d = [];
    for (let B = f; B !== 4096; B = e[B])
      d.push(A[B]);
    return d;
  }
  const s = [];
  g();
  const I = new Uint8Array(t);
  let c = a(I), l;
  for (; c !== Ne; ) {
    if (c === we) {
      for (g(), c = a(I); c === we; )
        c = a(I);
      if (c === Ne)
        break;
      if (c > we)
        throw new Error(`corrupted code at scanline ${c}`);
      {
        const f = o(c);
        ye(s, f), l = c;
      }
    } else if (c < i) {
      const f = o(c);
      ye(s, f), h(l, f[f.length - 1]), l = c;
    } else {
      const f = o(l);
      if (!f)
        throw new Error(`Bogus entry. Not in dictionary, ${l} / ${i}, position: ${r}`);
      ye(s, f), s.push(f[f.length - 1]), h(l, f[f.length - 1]), l = c;
    }
    i + 1 >= 2 ** n && (n === xs ? l = void 0 : n++), c = a(I);
  }
  return new Uint8Array(s);
}
class Ss extends dA {
  decodeBlock(e) {
    return Fs(e).buffer;
  }
}
const ks = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ss
}, Symbol.toStringTag, { value: "Module" })), UA = new Int32Array([
  0,
  1,
  8,
  16,
  9,
  2,
  3,
  10,
  17,
  24,
  32,
  25,
  18,
  11,
  4,
  5,
  12,
  19,
  26,
  33,
  40,
  48,
  41,
  34,
  27,
  20,
  13,
  6,
  7,
  14,
  21,
  28,
  35,
  42,
  49,
  56,
  57,
  50,
  43,
  36,
  29,
  22,
  15,
  23,
  30,
  37,
  44,
  51,
  58,
  59,
  52,
  45,
  38,
  31,
  39,
  46,
  53,
  60,
  61,
  54,
  47,
  55,
  62,
  63
]), HA = 4017, PA = 799, XA = 3406, jA = 2276, ZA = 1567, zA = 3784, pA = 5793, WA = 2896;
function ht(t, e) {
  let A = 0;
  const i = [];
  let n = 16;
  for (; n > 0 && !t[n - 1]; )
    --n;
  i.push({ children: [], index: 0 });
  let r = i[0], g;
  for (let a = 0; a < n; a++) {
    for (let h = 0; h < t[a]; h++) {
      for (r = i.pop(), r.children[r.index] = e[A]; r.index > 0; )
        r = i.pop();
      for (r.index++, i.push(r); i.length <= a; )
        i.push(g = { children: [], index: 0 }), r.children[r.index] = g.children, r = g;
      A++;
    }
    a + 1 < n && (i.push(g = { children: [], index: 0 }), r.children[r.index] = g.children, r = g);
  }
  return i[0].children;
}
function Ms(t, e, A, i, n, r, g, a, h) {
  const { mcusPerLine: o, progressive: s } = A, I = e;
  let c = e, l = 0, f = 0;
  function d() {
    if (f > 0)
      return f--, l >> f & 1;
    if (l = t[c++], l === 255) {
      const L = t[c++];
      if (L)
        throw new Error(`unexpected marker: ${(l << 8 | L).toString(16)}`);
    }
    return f = 7, l >>> 7;
  }
  function B(L) {
    let q = L, T;
    for (; (T = d()) !== null; ) {
      if (q = q[T], typeof q == "number")
        return q;
      if (typeof q != "object")
        throw new Error("invalid huffman sequence");
    }
    return null;
  }
  function C(L) {
    let q = L, T = 0;
    for (; q > 0; ) {
      const J = d();
      if (J === null)
        return;
      T = T << 1 | J, --q;
    }
    return T;
  }
  function u(L) {
    const q = C(L);
    return q >= 1 << L - 1 ? q : q + (-1 << L) + 1;
  }
  function p(L, q) {
    const T = B(L.huffmanTableDC), J = T === 0 ? 0 : u(T);
    L.pred += J, q[0] = L.pred;
    let V = 1;
    for (; V < 64; ) {
      const P = B(L.huffmanTableAC), X = P & 15, $ = P >> 4;
      if (X === 0) {
        if ($ < 15)
          break;
        V += 16;
      } else {
        V += $;
        const W = UA[V];
        q[W] = u(X), V++;
      }
    }
  }
  function Q(L, q) {
    const T = B(L.huffmanTableDC), J = T === 0 ? 0 : u(T) << h;
    L.pred += J, q[0] = L.pred;
  }
  function D(L, q) {
    q[0] |= d() << h;
  }
  let E = 0;
  function w(L, q) {
    if (E > 0) {
      E--;
      return;
    }
    let T = r;
    const J = g;
    for (; T <= J; ) {
      const V = B(L.huffmanTableAC), P = V & 15, X = V >> 4;
      if (P === 0) {
        if (X < 15) {
          E = C(X) + (1 << X) - 1;
          break;
        }
        T += 16;
      } else {
        T += X;
        const $ = UA[T];
        q[$] = u(P) * (1 << h), T++;
      }
    }
  }
  let y = 0, m;
  function S(L, q) {
    let T = r;
    const J = g;
    let V = 0;
    for (; T <= J; ) {
      const P = UA[T], X = q[P] < 0 ? -1 : 1;
      switch (y) {
        case 0: {
          const $ = B(L.huffmanTableAC), W = $ & 15;
          if (V = $ >> 4, W === 0)
            V < 15 ? (E = C(V) + (1 << V), y = 4) : (V = 16, y = 1);
          else {
            if (W !== 1)
              throw new Error("invalid ACn encoding");
            m = u(W), y = V ? 2 : 3;
          }
          continue;
        }
        case 1:
        case 2:
          q[P] ? q[P] += (d() << h) * X : (V--, V === 0 && (y = y === 2 ? 3 : 0));
          break;
        case 3:
          q[P] ? q[P] += (d() << h) * X : (q[P] = m << h, y = 0);
          break;
        case 4:
          q[P] && (q[P] += (d() << h) * X);
          break;
      }
      T++;
    }
    y === 4 && (E--, E === 0 && (y = 0));
  }
  function x(L, q, T, J, V) {
    const P = T / o | 0, X = T % o, $ = P * L.v + J, W = X * L.h + V;
    q(L, L.blocks[$][W]);
  }
  function G(L, q, T) {
    const J = T / L.blocksPerLine | 0, V = T % L.blocksPerLine;
    q(L, L.blocks[J][V]);
  }
  const M = i.length;
  let Y, k, F, v, b, U;
  s ? r === 0 ? U = a === 0 ? Q : D : U = a === 0 ? w : S : U = p;
  let N = 0, R, O;
  M === 1 ? O = i[0].blocksPerLine * i[0].blocksPerColumn : O = o * A.mcusPerColumn;
  const K = n || O;
  for (; N < O; ) {
    for (k = 0; k < M; k++)
      i[k].pred = 0;
    if (E = 0, M === 1)
      for (Y = i[0], b = 0; b < K; b++)
        G(Y, U, N), N++;
    else
      for (b = 0; b < K; b++) {
        for (k = 0; k < M; k++) {
          Y = i[k];
          const { h: L, v: q } = Y;
          for (F = 0; F < q; F++)
            for (v = 0; v < L; v++)
              x(Y, U, N, F, v);
        }
        if (N++, N === O)
          break;
      }
    if (f = 0, R = t[c] << 8 | t[c + 1], R < 65280)
      throw new Error("marker was not found");
    if (R >= 65488 && R <= 65495)
      c += 2;
    else
      break;
  }
  return c - I;
}
function Gs(t, e) {
  const A = [], { blocksPerLine: i, blocksPerColumn: n } = e, r = i << 3, g = new Int32Array(64), a = new Uint8Array(64);
  function h(o, s, I) {
    const c = e.quantizationTable;
    let l, f, d, B, C, u, p, Q, D;
    const E = I;
    let w;
    for (w = 0; w < 64; w++)
      E[w] = o[w] * c[w];
    for (w = 0; w < 8; ++w) {
      const y = 8 * w;
      if (E[1 + y] === 0 && E[2 + y] === 0 && E[3 + y] === 0 && E[4 + y] === 0 && E[5 + y] === 0 && E[6 + y] === 0 && E[7 + y] === 0) {
        D = pA * E[0 + y] + 512 >> 10, E[0 + y] = D, E[1 + y] = D, E[2 + y] = D, E[3 + y] = D, E[4 + y] = D, E[5 + y] = D, E[6 + y] = D, E[7 + y] = D;
        continue;
      }
      l = pA * E[0 + y] + 128 >> 8, f = pA * E[4 + y] + 128 >> 8, d = E[2 + y], B = E[6 + y], C = WA * (E[1 + y] - E[7 + y]) + 128 >> 8, Q = WA * (E[1 + y] + E[7 + y]) + 128 >> 8, u = E[3 + y] << 4, p = E[5 + y] << 4, D = l - f + 1 >> 1, l = l + f + 1 >> 1, f = D, D = d * zA + B * ZA + 128 >> 8, d = d * ZA - B * zA + 128 >> 8, B = D, D = C - p + 1 >> 1, C = C + p + 1 >> 1, p = D, D = Q + u + 1 >> 1, u = Q - u + 1 >> 1, Q = D, D = l - B + 1 >> 1, l = l + B + 1 >> 1, B = D, D = f - d + 1 >> 1, f = f + d + 1 >> 1, d = D, D = C * jA + Q * XA + 2048 >> 12, C = C * XA - Q * jA + 2048 >> 12, Q = D, D = u * PA + p * HA + 2048 >> 12, u = u * HA - p * PA + 2048 >> 12, p = D, E[0 + y] = l + Q, E[7 + y] = l - Q, E[1 + y] = f + p, E[6 + y] = f - p, E[2 + y] = d + u, E[5 + y] = d - u, E[3 + y] = B + C, E[4 + y] = B - C;
    }
    for (w = 0; w < 8; ++w) {
      const y = w;
      if (E[1 * 8 + y] === 0 && E[2 * 8 + y] === 0 && E[3 * 8 + y] === 0 && E[4 * 8 + y] === 0 && E[5 * 8 + y] === 0 && E[6 * 8 + y] === 0 && E[7 * 8 + y] === 0) {
        D = pA * I[w + 0] + 8192 >> 14, E[0 * 8 + y] = D, E[1 * 8 + y] = D, E[2 * 8 + y] = D, E[3 * 8 + y] = D, E[4 * 8 + y] = D, E[5 * 8 + y] = D, E[6 * 8 + y] = D, E[7 * 8 + y] = D;
        continue;
      }
      l = pA * E[0 * 8 + y] + 2048 >> 12, f = pA * E[4 * 8 + y] + 2048 >> 12, d = E[2 * 8 + y], B = E[6 * 8 + y], C = WA * (E[1 * 8 + y] - E[7 * 8 + y]) + 2048 >> 12, Q = WA * (E[1 * 8 + y] + E[7 * 8 + y]) + 2048 >> 12, u = E[3 * 8 + y], p = E[5 * 8 + y], D = l - f + 1 >> 1, l = l + f + 1 >> 1, f = D, D = d * zA + B * ZA + 2048 >> 12, d = d * ZA - B * zA + 2048 >> 12, B = D, D = C - p + 1 >> 1, C = C + p + 1 >> 1, p = D, D = Q + u + 1 >> 1, u = Q - u + 1 >> 1, Q = D, D = l - B + 1 >> 1, l = l + B + 1 >> 1, B = D, D = f - d + 1 >> 1, f = f + d + 1 >> 1, d = D, D = C * jA + Q * XA + 2048 >> 12, C = C * XA - Q * jA + 2048 >> 12, Q = D, D = u * PA + p * HA + 2048 >> 12, u = u * HA - p * PA + 2048 >> 12, p = D, E[0 * 8 + y] = l + Q, E[7 * 8 + y] = l - Q, E[1 * 8 + y] = f + p, E[6 * 8 + y] = f - p, E[2 * 8 + y] = d + u, E[5 * 8 + y] = d - u, E[3 * 8 + y] = B + C, E[4 * 8 + y] = B - C;
    }
    for (w = 0; w < 64; ++w) {
      const y = 128 + (E[w] + 8 >> 4);
      y < 0 ? s[w] = 0 : y > 255 ? s[w] = 255 : s[w] = y;
    }
  }
  for (let o = 0; o < n; o++) {
    const s = o << 3;
    for (let I = 0; I < 8; I++)
      A.push(new Uint8Array(r));
    for (let I = 0; I < i; I++) {
      h(e.blocks[o][I], a, g);
      let c = 0;
      const l = I << 3;
      for (let f = 0; f < 8; f++) {
        const d = A[s + f];
        for (let B = 0; B < 8; B++)
          d[l + B] = a[c++];
      }
    }
  }
  return A;
}
class bs {
  constructor() {
    this.jfif = null, this.adobe = null, this.quantizationTables = [], this.huffmanTablesAC = [], this.huffmanTablesDC = [], this.resetFrames();
  }
  resetFrames() {
    this.frames = [];
  }
  parse(e) {
    let A = 0;
    function i() {
      const a = e[A] << 8 | e[A + 1];
      return A += 2, a;
    }
    function n() {
      const a = i(), h = e.subarray(A, A + a - 2);
      return A += h.length, h;
    }
    function r(a) {
      let h = 0, o = 0, s, I;
      for (I in a.components)
        a.components.hasOwnProperty(I) && (s = a.components[I], h < s.h && (h = s.h), o < s.v && (o = s.v));
      const c = Math.ceil(a.samplesPerLine / 8 / h), l = Math.ceil(a.scanLines / 8 / o);
      for (I in a.components)
        if (a.components.hasOwnProperty(I)) {
          s = a.components[I];
          const f = Math.ceil(Math.ceil(a.samplesPerLine / 8) * s.h / h), d = Math.ceil(Math.ceil(a.scanLines / 8) * s.v / o), B = c * s.h, C = l * s.v, u = [];
          for (let p = 0; p < C; p++) {
            const Q = [];
            for (let D = 0; D < B; D++)
              Q.push(new Int32Array(64));
            u.push(Q);
          }
          s.blocksPerLine = f, s.blocksPerColumn = d, s.blocks = u;
        }
      a.maxH = h, a.maxV = o, a.mcusPerLine = c, a.mcusPerColumn = l;
    }
    let g = i();
    if (g !== 65496)
      throw new Error("SOI not found");
    for (g = i(); g !== 65497; ) {
      switch (g) {
        case 65280:
          break;
        case 65504:
        case 65505:
        case 65506:
        case 65507:
        case 65508:
        case 65509:
        case 65510:
        case 65511:
        case 65512:
        case 65513:
        case 65514:
        case 65515:
        case 65516:
        case 65517:
        case 65518:
        case 65519:
        case 65534: {
          const a = n();
          g === 65504 && a[0] === 74 && a[1] === 70 && a[2] === 73 && a[3] === 70 && a[4] === 0 && (this.jfif = {
            version: { major: a[5], minor: a[6] },
            densityUnits: a[7],
            xDensity: a[8] << 8 | a[9],
            yDensity: a[10] << 8 | a[11],
            thumbWidth: a[12],
            thumbHeight: a[13],
            thumbData: a.subarray(14, 14 + 3 * a[12] * a[13])
          }), g === 65518 && a[0] === 65 && a[1] === 100 && a[2] === 111 && a[3] === 98 && a[4] === 101 && a[5] === 0 && (this.adobe = {
            version: a[6],
            flags0: a[7] << 8 | a[8],
            flags1: a[9] << 8 | a[10],
            transformCode: a[11]
          });
          break;
        }
        case 65499: {
          const h = i() + A - 2;
          for (; A < h; ) {
            const o = e[A++], s = new Int32Array(64);
            if (o >> 4)
              if (o >> 4 === 1)
                for (let I = 0; I < 64; I++) {
                  const c = UA[I];
                  s[c] = i();
                }
              else
                throw new Error("DQT: invalid table spec");
            else for (let I = 0; I < 64; I++) {
              const c = UA[I];
              s[c] = e[A++];
            }
            this.quantizationTables[o & 15] = s;
          }
          break;
        }
        case 65472:
        case 65473:
        case 65474: {
          i();
          const a = {
            extended: g === 65473,
            progressive: g === 65474,
            precision: e[A++],
            scanLines: i(),
            samplesPerLine: i(),
            components: {},
            componentsOrder: []
          }, h = e[A++];
          let o;
          for (let s = 0; s < h; s++) {
            o = e[A];
            const I = e[A + 1] >> 4, c = e[A + 1] & 15, l = e[A + 2];
            a.componentsOrder.push(o), a.components[o] = {
              h: I,
              v: c,
              quantizationIdx: l
            }, A += 3;
          }
          r(a), this.frames.push(a);
          break;
        }
        case 65476: {
          const a = i();
          for (let h = 2; h < a; ) {
            const o = e[A++], s = new Uint8Array(16);
            let I = 0;
            for (let l = 0; l < 16; l++, A++)
              s[l] = e[A], I += s[l];
            const c = new Uint8Array(I);
            for (let l = 0; l < I; l++, A++)
              c[l] = e[A];
            h += 17 + I, o >> 4 ? this.huffmanTablesAC[o & 15] = ht(
              s,
              c
            ) : this.huffmanTablesDC[o & 15] = ht(
              s,
              c
            );
          }
          break;
        }
        case 65501:
          i(), this.resetInterval = i();
          break;
        case 65498: {
          i();
          const a = e[A++], h = [], o = this.frames[0];
          for (let f = 0; f < a; f++) {
            const d = o.components[e[A++]], B = e[A++];
            d.huffmanTableDC = this.huffmanTablesDC[B >> 4], d.huffmanTableAC = this.huffmanTablesAC[B & 15], h.push(d);
          }
          const s = e[A++], I = e[A++], c = e[A++], l = Ms(
            e,
            A,
            o,
            h,
            this.resetInterval,
            s,
            I,
            c >> 4,
            c & 15
          );
          A += l;
          break;
        }
        case 65535:
          e[A] !== 255 && A--;
          break;
        default:
          if (e[A - 3] === 255 && e[A - 2] >= 192 && e[A - 2] <= 254) {
            A -= 3;
            break;
          }
          throw new Error(`unknown JPEG marker ${g.toString(16)}`);
      }
      g = i();
    }
  }
  getResult() {
    const { frames: e } = this;
    if (this.frames.length === 0)
      throw new Error("no frames were decoded");
    this.frames.length > 1 && console.warn("more than one frame is not supported");
    for (let s = 0; s < this.frames.length; s++) {
      const I = this.frames[s].components;
      for (const c of Object.keys(I))
        I[c].quantizationTable = this.quantizationTables[I[c].quantizationIdx], delete I[c].quantizationIdx;
    }
    const A = e[0], { components: i, componentsOrder: n } = A, r = [], g = A.samplesPerLine, a = A.scanLines;
    for (let s = 0; s < n.length; s++) {
      const I = i[n[s]];
      r.push({
        lines: Gs(A, I),
        scaleX: I.h / A.maxH,
        scaleY: I.v / A.maxV
      });
    }
    const h = new Uint8Array(g * a * r.length);
    let o = 0;
    for (let s = 0; s < a; ++s)
      for (let I = 0; I < g; ++I)
        for (let c = 0; c < r.length; ++c) {
          const l = r[c];
          h[o] = l.lines[0 | s * l.scaleY][0 | I * l.scaleX], ++o;
        }
    return h;
  }
}
class Ls extends dA {
  constructor(e) {
    super(), this.reader = new bs(), e.JPEGTables && this.reader.parse(e.JPEGTables);
  }
  decodeBlock(e) {
    return this.reader.resetFrames(), this.reader.parse(new Uint8Array(e)), this.reader.getResult().buffer;
  }
}
const Us = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ls
}, Symbol.toStringTag, { value: "Module" }));
function MA(t) {
  let e = t.length;
  for (; --e >= 0; )
    t[e] = 0;
}
const vs = 3, Rs = 258, di = 29, Ns = 256, Ts = Ns + 1 + di, wi = 30, qs = 512, Ys = new Array((Ts + 2) * 2);
MA(Ys);
const _s = new Array(wi * 2);
MA(_s);
const Js = new Array(qs);
MA(Js);
const Os = new Array(Rs - vs + 1);
MA(Os);
const Vs = new Array(di);
MA(Vs);
const Ks = new Array(wi);
MA(Ks);
const Hs = (t, e, A, i) => {
  let n = t & 65535 | 0, r = t >>> 16 & 65535 | 0, g = 0;
  for (; A !== 0; ) {
    g = A > 2e3 ? 2e3 : A, A -= g;
    do
      n = n + e[i++] | 0, r = r + n | 0;
    while (--g);
    n %= 65521, r %= 65521;
  }
  return n | r << 16 | 0;
};
var Te = Hs;
const Ps = () => {
  let t, e = [];
  for (var A = 0; A < 256; A++) {
    t = A;
    for (var i = 0; i < 8; i++)
      t = t & 1 ? 3988292384 ^ t >>> 1 : t >>> 1;
    e[A] = t;
  }
  return e;
}, Xs = new Uint32Array(Ps()), js = (t, e, A, i) => {
  const n = Xs, r = i + A;
  t ^= -1;
  for (let g = i; g < r; g++)
    t = t >>> 8 ^ n[(t ^ e[g]) & 255];
  return t ^ -1;
};
var oA = js, qe = {
  2: "need dictionary",
  /* Z_NEED_DICT       2  */
  1: "stream end",
  /* Z_STREAM_END      1  */
  0: "",
  /* Z_OK              0  */
  "-1": "file error",
  /* Z_ERRNO         (-1) */
  "-2": "stream error",
  /* Z_STREAM_ERROR  (-2) */
  "-3": "data error",
  /* Z_DATA_ERROR    (-3) */
  "-4": "insufficient memory",
  /* Z_MEM_ERROR     (-4) */
  "-5": "buffer error",
  /* Z_BUF_ERROR     (-5) */
  "-6": "incompatible version"
  /* Z_VERSION_ERROR (-6) */
}, yi = {
  /* Allowed flush values; see deflate() and inflate() below for details */
  Z_NO_FLUSH: 0,
  Z_FINISH: 4,
  Z_BLOCK: 5,
  Z_TREES: 6,
  /* Return codes for the compression/decompression functions. Negative values
  * are errors, positive values are used for special but normal events.
  */
  Z_OK: 0,
  Z_STREAM_END: 1,
  Z_NEED_DICT: 2,
  Z_STREAM_ERROR: -2,
  Z_DATA_ERROR: -3,
  Z_MEM_ERROR: -4,
  Z_BUF_ERROR: -5,
  /* The deflate compression method */
  Z_DEFLATED: 8
  //Z_NULL:                 null // Use -1 or null inline, depending on var type
};
const Zs = (t, e) => Object.prototype.hasOwnProperty.call(t, e);
var zs = function(t) {
  const e = Array.prototype.slice.call(arguments, 1);
  for (; e.length; ) {
    const A = e.shift();
    if (A) {
      if (typeof A != "object")
        throw new TypeError(A + "must be non-object");
      for (const i in A)
        Zs(A, i) && (t[i] = A[i]);
    }
  }
  return t;
}, Ws = (t) => {
  let e = 0;
  for (let i = 0, n = t.length; i < n; i++)
    e += t[i].length;
  const A = new Uint8Array(e);
  for (let i = 0, n = 0, r = t.length; i < r; i++) {
    let g = t[i];
    A.set(g, n), n += g.length;
  }
  return A;
}, pi = {
  assign: zs,
  flattenChunks: Ws
};
let Di = !0;
try {
  String.fromCharCode.apply(null, new Uint8Array(1));
} catch {
  Di = !1;
}
const TA = new Uint8Array(256);
for (let t = 0; t < 256; t++)
  TA[t] = t >= 252 ? 6 : t >= 248 ? 5 : t >= 240 ? 4 : t >= 224 ? 3 : t >= 192 ? 2 : 1;
TA[254] = TA[254] = 1;
var $s = (t) => {
  if (typeof TextEncoder == "function" && TextEncoder.prototype.encode)
    return new TextEncoder().encode(t);
  let e, A, i, n, r, g = t.length, a = 0;
  for (n = 0; n < g; n++)
    A = t.charCodeAt(n), (A & 64512) === 55296 && n + 1 < g && (i = t.charCodeAt(n + 1), (i & 64512) === 56320 && (A = 65536 + (A - 55296 << 10) + (i - 56320), n++)), a += A < 128 ? 1 : A < 2048 ? 2 : A < 65536 ? 3 : 4;
  for (e = new Uint8Array(a), r = 0, n = 0; r < a; n++)
    A = t.charCodeAt(n), (A & 64512) === 55296 && n + 1 < g && (i = t.charCodeAt(n + 1), (i & 64512) === 56320 && (A = 65536 + (A - 55296 << 10) + (i - 56320), n++)), A < 128 ? e[r++] = A : A < 2048 ? (e[r++] = 192 | A >>> 6, e[r++] = 128 | A & 63) : A < 65536 ? (e[r++] = 224 | A >>> 12, e[r++] = 128 | A >>> 6 & 63, e[r++] = 128 | A & 63) : (e[r++] = 240 | A >>> 18, e[r++] = 128 | A >>> 12 & 63, e[r++] = 128 | A >>> 6 & 63, e[r++] = 128 | A & 63);
  return e;
};
const Ao = (t, e) => {
  if (e < 65534 && t.subarray && Di)
    return String.fromCharCode.apply(null, t.length === e ? t : t.subarray(0, e));
  let A = "";
  for (let i = 0; i < e; i++)
    A += String.fromCharCode(t[i]);
  return A;
};
var eo = (t, e) => {
  const A = e || t.length;
  if (typeof TextDecoder == "function" && TextDecoder.prototype.decode)
    return new TextDecoder().decode(t.subarray(0, e));
  let i, n;
  const r = new Array(A * 2);
  for (n = 0, i = 0; i < A; ) {
    let g = t[i++];
    if (g < 128) {
      r[n++] = g;
      continue;
    }
    let a = TA[g];
    if (a > 4) {
      r[n++] = 65533, i += a - 1;
      continue;
    }
    for (g &= a === 2 ? 31 : a === 3 ? 15 : 7; a > 1 && i < A; )
      g = g << 6 | t[i++] & 63, a--;
    if (a > 1) {
      r[n++] = 65533;
      continue;
    }
    g < 65536 ? r[n++] = g : (g -= 65536, r[n++] = 55296 | g >> 10 & 1023, r[n++] = 56320 | g & 1023);
  }
  return Ao(r, n);
}, to = (t, e) => {
  e = e || t.length, e > t.length && (e = t.length);
  let A = e - 1;
  for (; A >= 0 && (t[A] & 192) === 128; )
    A--;
  return A < 0 || A === 0 ? e : A + TA[t[A]] > e ? A : e;
}, Ye = {
  string2buf: $s,
  buf2string: eo,
  utf8border: to
};
function io() {
  this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
}
var no = io;
const $A = 16209, ro = 16191;
var so = function(e, A) {
  let i, n, r, g, a, h, o, s, I, c, l, f, d, B, C, u, p, Q, D, E, w, y, m, S;
  const x = e.state;
  i = e.next_in, m = e.input, n = i + (e.avail_in - 5), r = e.next_out, S = e.output, g = r - (A - e.avail_out), a = r + (e.avail_out - 257), h = x.dmax, o = x.wsize, s = x.whave, I = x.wnext, c = x.window, l = x.hold, f = x.bits, d = x.lencode, B = x.distcode, C = (1 << x.lenbits) - 1, u = (1 << x.distbits) - 1;
  A:
    do {
      f < 15 && (l += m[i++] << f, f += 8, l += m[i++] << f, f += 8), p = d[l & C];
      e:
        for (; ; ) {
          if (Q = p >>> 24, l >>>= Q, f -= Q, Q = p >>> 16 & 255, Q === 0)
            S[r++] = p & 65535;
          else if (Q & 16) {
            D = p & 65535, Q &= 15, Q && (f < Q && (l += m[i++] << f, f += 8), D += l & (1 << Q) - 1, l >>>= Q, f -= Q), f < 15 && (l += m[i++] << f, f += 8, l += m[i++] << f, f += 8), p = B[l & u];
            t:
              for (; ; ) {
                if (Q = p >>> 24, l >>>= Q, f -= Q, Q = p >>> 16 & 255, Q & 16) {
                  if (E = p & 65535, Q &= 15, f < Q && (l += m[i++] << f, f += 8, f < Q && (l += m[i++] << f, f += 8)), E += l & (1 << Q) - 1, E > h) {
                    e.msg = "invalid distance too far back", x.mode = $A;
                    break A;
                  }
                  if (l >>>= Q, f -= Q, Q = r - g, E > Q) {
                    if (Q = E - Q, Q > s && x.sane) {
                      e.msg = "invalid distance too far back", x.mode = $A;
                      break A;
                    }
                    if (w = 0, y = c, I === 0) {
                      if (w += o - Q, Q < D) {
                        D -= Q;
                        do
                          S[r++] = c[w++];
                        while (--Q);
                        w = r - E, y = S;
                      }
                    } else if (I < Q) {
                      if (w += o + I - Q, Q -= I, Q < D) {
                        D -= Q;
                        do
                          S[r++] = c[w++];
                        while (--Q);
                        if (w = 0, I < D) {
                          Q = I, D -= Q;
                          do
                            S[r++] = c[w++];
                          while (--Q);
                          w = r - E, y = S;
                        }
                      }
                    } else if (w += I - Q, Q < D) {
                      D -= Q;
                      do
                        S[r++] = c[w++];
                      while (--Q);
                      w = r - E, y = S;
                    }
                    for (; D > 2; )
                      S[r++] = y[w++], S[r++] = y[w++], S[r++] = y[w++], D -= 3;
                    D && (S[r++] = y[w++], D > 1 && (S[r++] = y[w++]));
                  } else {
                    w = r - E;
                    do
                      S[r++] = S[w++], S[r++] = S[w++], S[r++] = S[w++], D -= 3;
                    while (D > 2);
                    D && (S[r++] = S[w++], D > 1 && (S[r++] = S[w++]));
                  }
                } else if (Q & 64) {
                  e.msg = "invalid distance code", x.mode = $A;
                  break A;
                } else {
                  p = B[(p & 65535) + (l & (1 << Q) - 1)];
                  continue t;
                }
                break;
              }
          } else if (Q & 64)
            if (Q & 32) {
              x.mode = ro;
              break A;
            } else {
              e.msg = "invalid literal/length code", x.mode = $A;
              break A;
            }
          else {
            p = d[(p & 65535) + (l & (1 << Q) - 1)];
            continue e;
          }
          break;
        }
    } while (i < n && r < a);
  D = f >> 3, i -= D, f -= D << 3, l &= (1 << f) - 1, e.next_in = i, e.next_out = r, e.avail_in = i < n ? 5 + (n - i) : 5 - (i - n), e.avail_out = r < a ? 257 + (a - r) : 257 - (r - a), x.hold = l, x.bits = f;
};
const DA = 15, Ct = 852, Et = 592, Qt = 0, pe = 1, ut = 2, oo = new Uint16Array([
  /* Length codes 257..285 base */
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  13,
  15,
  17,
  19,
  23,
  27,
  31,
  35,
  43,
  51,
  59,
  67,
  83,
  99,
  115,
  131,
  163,
  195,
  227,
  258,
  0,
  0
]), ao = new Uint8Array([
  /* Length codes 257..285 extra */
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  17,
  17,
  17,
  17,
  18,
  18,
  18,
  18,
  19,
  19,
  19,
  19,
  20,
  20,
  20,
  20,
  21,
  21,
  21,
  21,
  16,
  72,
  78
]), go = new Uint16Array([
  /* Distance codes 0..29 base */
  1,
  2,
  3,
  4,
  5,
  7,
  9,
  13,
  17,
  25,
  33,
  49,
  65,
  97,
  129,
  193,
  257,
  385,
  513,
  769,
  1025,
  1537,
  2049,
  3073,
  4097,
  6145,
  8193,
  12289,
  16385,
  24577,
  0,
  0
]), Io = new Uint8Array([
  /* Distance codes 0..29 extra */
  16,
  16,
  16,
  16,
  17,
  17,
  18,
  18,
  19,
  19,
  20,
  20,
  21,
  21,
  22,
  22,
  23,
  23,
  24,
  24,
  25,
  25,
  26,
  26,
  27,
  27,
  28,
  28,
  29,
  29,
  64,
  64
]), lo = (t, e, A, i, n, r, g, a) => {
  const h = a.bits;
  let o = 0, s = 0, I = 0, c = 0, l = 0, f = 0, d = 0, B = 0, C = 0, u = 0, p, Q, D, E, w, y = null, m;
  const S = new Uint16Array(DA + 1), x = new Uint16Array(DA + 1);
  let G = null, M, Y, k;
  for (o = 0; o <= DA; o++)
    S[o] = 0;
  for (s = 0; s < i; s++)
    S[e[A + s]]++;
  for (l = h, c = DA; c >= 1 && S[c] === 0; c--)
    ;
  if (l > c && (l = c), c === 0)
    return n[r++] = 1 << 24 | 64 << 16 | 0, n[r++] = 1 << 24 | 64 << 16 | 0, a.bits = 1, 0;
  for (I = 1; I < c && S[I] === 0; I++)
    ;
  for (l < I && (l = I), B = 1, o = 1; o <= DA; o++)
    if (B <<= 1, B -= S[o], B < 0)
      return -1;
  if (B > 0 && (t === Qt || c !== 1))
    return -1;
  for (x[1] = 0, o = 1; o < DA; o++)
    x[o + 1] = x[o] + S[o];
  for (s = 0; s < i; s++)
    e[A + s] !== 0 && (g[x[e[A + s]]++] = s);
  if (t === Qt ? (y = G = g, m = 20) : t === pe ? (y = oo, G = ao, m = 257) : (y = go, G = Io, m = 0), u = 0, s = 0, o = I, w = r, f = l, d = 0, D = -1, C = 1 << l, E = C - 1, t === pe && C > Ct || t === ut && C > Et)
    return 1;
  for (; ; ) {
    M = o - d, g[s] + 1 < m ? (Y = 0, k = g[s]) : g[s] >= m ? (Y = G[g[s] - m], k = y[g[s] - m]) : (Y = 96, k = 0), p = 1 << o - d, Q = 1 << f, I = Q;
    do
      Q -= p, n[w + (u >> d) + Q] = M << 24 | Y << 16 | k | 0;
    while (Q !== 0);
    for (p = 1 << o - 1; u & p; )
      p >>= 1;
    if (p !== 0 ? (u &= p - 1, u += p) : u = 0, s++, --S[o] === 0) {
      if (o === c)
        break;
      o = e[A + g[s]];
    }
    if (o > l && (u & E) !== D) {
      for (d === 0 && (d = l), w += I, f = o - d, B = 1 << f; f + d < c && (B -= S[f + d], !(B <= 0)); )
        f++, B <<= 1;
      if (C += 1 << f, t === pe && C > Ct || t === ut && C > Et)
        return 1;
      D = u & E, n[D] = l << 24 | f << 16 | w - r | 0;
    }
  }
  return u !== 0 && (n[w + u] = o - d << 24 | 64 << 16 | 0), a.bits = l, 0;
};
var vA = lo;
const fo = 0, xi = 1, mi = 2, {
  Z_FINISH: dt,
  Z_BLOCK: co,
  Z_TREES: Ae,
  Z_OK: uA,
  Z_STREAM_END: Bo,
  Z_NEED_DICT: ho,
  Z_STREAM_ERROR: tA,
  Z_DATA_ERROR: Fi,
  Z_MEM_ERROR: Si,
  Z_BUF_ERROR: Co,
  Z_DEFLATED: wt
} = yi, ae = 16180, yt = 16181, pt = 16182, Dt = 16183, xt = 16184, mt = 16185, Ft = 16186, St = 16187, kt = 16188, Mt = 16189, re = 16190, gA = 16191, De = 16192, Gt = 16193, xe = 16194, bt = 16195, Lt = 16196, Ut = 16197, vt = 16198, ee = 16199, te = 16200, Rt = 16201, Nt = 16202, Tt = 16203, qt = 16204, Yt = 16205, me = 16206, _t = 16207, Jt = 16208, H = 16209, ki = 16210, Mi = 16211, Eo = 852, Qo = 592, uo = 15, wo = uo, Ot = (t) => (t >>> 24 & 255) + (t >>> 8 & 65280) + ((t & 65280) << 8) + ((t & 255) << 24);
function yo() {
  this.strm = null, this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new Uint16Array(320), this.work = new Uint16Array(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
}
const wA = (t) => {
  if (!t)
    return 1;
  const e = t.state;
  return !e || e.strm !== t || e.mode < ae || e.mode > Mi ? 1 : 0;
}, Gi = (t) => {
  if (wA(t))
    return tA;
  const e = t.state;
  return t.total_in = t.total_out = e.total = 0, t.msg = "", e.wrap && (t.adler = e.wrap & 1), e.mode = ae, e.last = 0, e.havedict = 0, e.flags = -1, e.dmax = 32768, e.head = null, e.hold = 0, e.bits = 0, e.lencode = e.lendyn = new Int32Array(Eo), e.distcode = e.distdyn = new Int32Array(Qo), e.sane = 1, e.back = -1, uA;
}, bi = (t) => {
  if (wA(t))
    return tA;
  const e = t.state;
  return e.wsize = 0, e.whave = 0, e.wnext = 0, Gi(t);
}, Li = (t, e) => {
  let A;
  if (wA(t))
    return tA;
  const i = t.state;
  return e < 0 ? (A = 0, e = -e) : (A = (e >> 4) + 5, e < 48 && (e &= 15)), e && (e < 8 || e > 15) ? tA : (i.window !== null && i.wbits !== e && (i.window = null), i.wrap = A, i.wbits = e, bi(t));
}, Ui = (t, e) => {
  if (!t)
    return tA;
  const A = new yo();
  t.state = A, A.strm = t, A.window = null, A.mode = ae;
  const i = Li(t, e);
  return i !== uA && (t.state = null), i;
}, po = (t) => Ui(t, wo);
let Vt = !0, Fe, Se;
const Do = (t) => {
  if (Vt) {
    Fe = new Int32Array(512), Se = new Int32Array(32);
    let e = 0;
    for (; e < 144; )
      t.lens[e++] = 8;
    for (; e < 256; )
      t.lens[e++] = 9;
    for (; e < 280; )
      t.lens[e++] = 7;
    for (; e < 288; )
      t.lens[e++] = 8;
    for (vA(xi, t.lens, 0, 288, Fe, 0, t.work, { bits: 9 }), e = 0; e < 32; )
      t.lens[e++] = 5;
    vA(mi, t.lens, 0, 32, Se, 0, t.work, { bits: 5 }), Vt = !1;
  }
  t.lencode = Fe, t.lenbits = 9, t.distcode = Se, t.distbits = 5;
}, vi = (t, e, A, i) => {
  let n;
  const r = t.state;
  return r.window === null && (r.wsize = 1 << r.wbits, r.wnext = 0, r.whave = 0, r.window = new Uint8Array(r.wsize)), i >= r.wsize ? (r.window.set(e.subarray(A - r.wsize, A), 0), r.wnext = 0, r.whave = r.wsize) : (n = r.wsize - r.wnext, n > i && (n = i), r.window.set(e.subarray(A - i, A - i + n), r.wnext), i -= n, i ? (r.window.set(e.subarray(A - i, A), 0), r.wnext = i, r.whave = r.wsize) : (r.wnext += n, r.wnext === r.wsize && (r.wnext = 0), r.whave < r.wsize && (r.whave += n))), 0;
}, xo = (t, e) => {
  let A, i, n, r, g, a, h, o, s, I, c, l, f, d, B = 0, C, u, p, Q, D, E, w, y;
  const m = new Uint8Array(4);
  let S, x;
  const G = (
    /* permutation of code lengths */
    new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15])
  );
  if (wA(t) || !t.output || !t.input && t.avail_in !== 0)
    return tA;
  A = t.state, A.mode === gA && (A.mode = De), g = t.next_out, n = t.output, h = t.avail_out, r = t.next_in, i = t.input, a = t.avail_in, o = A.hold, s = A.bits, I = a, c = h, y = uA;
  A:
    for (; ; )
      switch (A.mode) {
        case ae:
          if (A.wrap === 0) {
            A.mode = De;
            break;
          }
          for (; s < 16; ) {
            if (a === 0)
              break A;
            a--, o += i[r++] << s, s += 8;
          }
          if (A.wrap & 2 && o === 35615) {
            A.wbits === 0 && (A.wbits = 15), A.check = 0, m[0] = o & 255, m[1] = o >>> 8 & 255, A.check = oA(A.check, m, 2, 0), o = 0, s = 0, A.mode = yt;
            break;
          }
          if (A.head && (A.head.done = !1), !(A.wrap & 1) || /* check if zlib header allowed */
          (((o & 255) << 8) + (o >> 8)) % 31) {
            t.msg = "incorrect header check", A.mode = H;
            break;
          }
          if ((o & 15) !== wt) {
            t.msg = "unknown compression method", A.mode = H;
            break;
          }
          if (o >>>= 4, s -= 4, w = (o & 15) + 8, A.wbits === 0 && (A.wbits = w), w > 15 || w > A.wbits) {
            t.msg = "invalid window size", A.mode = H;
            break;
          }
          A.dmax = 1 << A.wbits, A.flags = 0, t.adler = A.check = 1, A.mode = o & 512 ? Mt : gA, o = 0, s = 0;
          break;
        case yt:
          for (; s < 16; ) {
            if (a === 0)
              break A;
            a--, o += i[r++] << s, s += 8;
          }
          if (A.flags = o, (A.flags & 255) !== wt) {
            t.msg = "unknown compression method", A.mode = H;
            break;
          }
          if (A.flags & 57344) {
            t.msg = "unknown header flags set", A.mode = H;
            break;
          }
          A.head && (A.head.text = o >> 8 & 1), A.flags & 512 && A.wrap & 4 && (m[0] = o & 255, m[1] = o >>> 8 & 255, A.check = oA(A.check, m, 2, 0)), o = 0, s = 0, A.mode = pt;
        case pt:
          for (; s < 32; ) {
            if (a === 0)
              break A;
            a--, o += i[r++] << s, s += 8;
          }
          A.head && (A.head.time = o), A.flags & 512 && A.wrap & 4 && (m[0] = o & 255, m[1] = o >>> 8 & 255, m[2] = o >>> 16 & 255, m[3] = o >>> 24 & 255, A.check = oA(A.check, m, 4, 0)), o = 0, s = 0, A.mode = Dt;
        case Dt:
          for (; s < 16; ) {
            if (a === 0)
              break A;
            a--, o += i[r++] << s, s += 8;
          }
          A.head && (A.head.xflags = o & 255, A.head.os = o >> 8), A.flags & 512 && A.wrap & 4 && (m[0] = o & 255, m[1] = o >>> 8 & 255, A.check = oA(A.check, m, 2, 0)), o = 0, s = 0, A.mode = xt;
        case xt:
          if (A.flags & 1024) {
            for (; s < 16; ) {
              if (a === 0)
                break A;
              a--, o += i[r++] << s, s += 8;
            }
            A.length = o, A.head && (A.head.extra_len = o), A.flags & 512 && A.wrap & 4 && (m[0] = o & 255, m[1] = o >>> 8 & 255, A.check = oA(A.check, m, 2, 0)), o = 0, s = 0;
          } else A.head && (A.head.extra = null);
          A.mode = mt;
        case mt:
          if (A.flags & 1024 && (l = A.length, l > a && (l = a), l && (A.head && (w = A.head.extra_len - A.length, A.head.extra || (A.head.extra = new Uint8Array(A.head.extra_len)), A.head.extra.set(
            i.subarray(
              r,
              // extra field is limited to 65536 bytes
              // - no need for additional size check
              r + l
            ),
            /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
            w
          )), A.flags & 512 && A.wrap & 4 && (A.check = oA(A.check, i, l, r)), a -= l, r += l, A.length -= l), A.length))
            break A;
          A.length = 0, A.mode = Ft;
        case Ft:
          if (A.flags & 2048) {
            if (a === 0)
              break A;
            l = 0;
            do
              w = i[r + l++], A.head && w && A.length < 65536 && (A.head.name += String.fromCharCode(w));
            while (w && l < a);
            if (A.flags & 512 && A.wrap & 4 && (A.check = oA(A.check, i, l, r)), a -= l, r += l, w)
              break A;
          } else A.head && (A.head.name = null);
          A.length = 0, A.mode = St;
        case St:
          if (A.flags & 4096) {
            if (a === 0)
              break A;
            l = 0;
            do
              w = i[r + l++], A.head && w && A.length < 65536 && (A.head.comment += String.fromCharCode(w));
            while (w && l < a);
            if (A.flags & 512 && A.wrap & 4 && (A.check = oA(A.check, i, l, r)), a -= l, r += l, w)
              break A;
          } else A.head && (A.head.comment = null);
          A.mode = kt;
        case kt:
          if (A.flags & 512) {
            for (; s < 16; ) {
              if (a === 0)
                break A;
              a--, o += i[r++] << s, s += 8;
            }
            if (A.wrap & 4 && o !== (A.check & 65535)) {
              t.msg = "header crc mismatch", A.mode = H;
              break;
            }
            o = 0, s = 0;
          }
          A.head && (A.head.hcrc = A.flags >> 9 & 1, A.head.done = !0), t.adler = A.check = 0, A.mode = gA;
          break;
        case Mt:
          for (; s < 32; ) {
            if (a === 0)
              break A;
            a--, o += i[r++] << s, s += 8;
          }
          t.adler = A.check = Ot(o), o = 0, s = 0, A.mode = re;
        case re:
          if (A.havedict === 0)
            return t.next_out = g, t.avail_out = h, t.next_in = r, t.avail_in = a, A.hold = o, A.bits = s, ho;
          t.adler = A.check = 1, A.mode = gA;
        case gA:
          if (e === co || e === Ae)
            break A;
        case De:
          if (A.last) {
            o >>>= s & 7, s -= s & 7, A.mode = me;
            break;
          }
          for (; s < 3; ) {
            if (a === 0)
              break A;
            a--, o += i[r++] << s, s += 8;
          }
          switch (A.last = o & 1, o >>>= 1, s -= 1, o & 3) {
            case 0:
              A.mode = Gt;
              break;
            case 1:
              if (Do(A), A.mode = ee, e === Ae) {
                o >>>= 2, s -= 2;
                break A;
              }
              break;
            case 2:
              A.mode = Lt;
              break;
            case 3:
              t.msg = "invalid block type", A.mode = H;
          }
          o >>>= 2, s -= 2;
          break;
        case Gt:
          for (o >>>= s & 7, s -= s & 7; s < 32; ) {
            if (a === 0)
              break A;
            a--, o += i[r++] << s, s += 8;
          }
          if ((o & 65535) !== (o >>> 16 ^ 65535)) {
            t.msg = "invalid stored block lengths", A.mode = H;
            break;
          }
          if (A.length = o & 65535, o = 0, s = 0, A.mode = xe, e === Ae)
            break A;
        case xe:
          A.mode = bt;
        case bt:
          if (l = A.length, l) {
            if (l > a && (l = a), l > h && (l = h), l === 0)
              break A;
            n.set(i.subarray(r, r + l), g), a -= l, r += l, h -= l, g += l, A.length -= l;
            break;
          }
          A.mode = gA;
          break;
        case Lt:
          for (; s < 14; ) {
            if (a === 0)
              break A;
            a--, o += i[r++] << s, s += 8;
          }
          if (A.nlen = (o & 31) + 257, o >>>= 5, s -= 5, A.ndist = (o & 31) + 1, o >>>= 5, s -= 5, A.ncode = (o & 15) + 4, o >>>= 4, s -= 4, A.nlen > 286 || A.ndist > 30) {
            t.msg = "too many length or distance symbols", A.mode = H;
            break;
          }
          A.have = 0, A.mode = Ut;
        case Ut:
          for (; A.have < A.ncode; ) {
            for (; s < 3; ) {
              if (a === 0)
                break A;
              a--, o += i[r++] << s, s += 8;
            }
            A.lens[G[A.have++]] = o & 7, o >>>= 3, s -= 3;
          }
          for (; A.have < 19; )
            A.lens[G[A.have++]] = 0;
          if (A.lencode = A.lendyn, A.lenbits = 7, S = { bits: A.lenbits }, y = vA(fo, A.lens, 0, 19, A.lencode, 0, A.work, S), A.lenbits = S.bits, y) {
            t.msg = "invalid code lengths set", A.mode = H;
            break;
          }
          A.have = 0, A.mode = vt;
        case vt:
          for (; A.have < A.nlen + A.ndist; ) {
            for (; B = A.lencode[o & (1 << A.lenbits) - 1], C = B >>> 24, u = B >>> 16 & 255, p = B & 65535, !(C <= s); ) {
              if (a === 0)
                break A;
              a--, o += i[r++] << s, s += 8;
            }
            if (p < 16)
              o >>>= C, s -= C, A.lens[A.have++] = p;
            else {
              if (p === 16) {
                for (x = C + 2; s < x; ) {
                  if (a === 0)
                    break A;
                  a--, o += i[r++] << s, s += 8;
                }
                if (o >>>= C, s -= C, A.have === 0) {
                  t.msg = "invalid bit length repeat", A.mode = H;
                  break;
                }
                w = A.lens[A.have - 1], l = 3 + (o & 3), o >>>= 2, s -= 2;
              } else if (p === 17) {
                for (x = C + 3; s < x; ) {
                  if (a === 0)
                    break A;
                  a--, o += i[r++] << s, s += 8;
                }
                o >>>= C, s -= C, w = 0, l = 3 + (o & 7), o >>>= 3, s -= 3;
              } else {
                for (x = C + 7; s < x; ) {
                  if (a === 0)
                    break A;
                  a--, o += i[r++] << s, s += 8;
                }
                o >>>= C, s -= C, w = 0, l = 11 + (o & 127), o >>>= 7, s -= 7;
              }
              if (A.have + l > A.nlen + A.ndist) {
                t.msg = "invalid bit length repeat", A.mode = H;
                break;
              }
              for (; l--; )
                A.lens[A.have++] = w;
            }
          }
          if (A.mode === H)
            break;
          if (A.lens[256] === 0) {
            t.msg = "invalid code -- missing end-of-block", A.mode = H;
            break;
          }
          if (A.lenbits = 9, S = { bits: A.lenbits }, y = vA(xi, A.lens, 0, A.nlen, A.lencode, 0, A.work, S), A.lenbits = S.bits, y) {
            t.msg = "invalid literal/lengths set", A.mode = H;
            break;
          }
          if (A.distbits = 6, A.distcode = A.distdyn, S = { bits: A.distbits }, y = vA(mi, A.lens, A.nlen, A.ndist, A.distcode, 0, A.work, S), A.distbits = S.bits, y) {
            t.msg = "invalid distances set", A.mode = H;
            break;
          }
          if (A.mode = ee, e === Ae)
            break A;
        case ee:
          A.mode = te;
        case te:
          if (a >= 6 && h >= 258) {
            t.next_out = g, t.avail_out = h, t.next_in = r, t.avail_in = a, A.hold = o, A.bits = s, so(t, c), g = t.next_out, n = t.output, h = t.avail_out, r = t.next_in, i = t.input, a = t.avail_in, o = A.hold, s = A.bits, A.mode === gA && (A.back = -1);
            break;
          }
          for (A.back = 0; B = A.lencode[o & (1 << A.lenbits) - 1], C = B >>> 24, u = B >>> 16 & 255, p = B & 65535, !(C <= s); ) {
            if (a === 0)
              break A;
            a--, o += i[r++] << s, s += 8;
          }
          if (u && !(u & 240)) {
            for (Q = C, D = u, E = p; B = A.lencode[E + ((o & (1 << Q + D) - 1) >> Q)], C = B >>> 24, u = B >>> 16 & 255, p = B & 65535, !(Q + C <= s); ) {
              if (a === 0)
                break A;
              a--, o += i[r++] << s, s += 8;
            }
            o >>>= Q, s -= Q, A.back += Q;
          }
          if (o >>>= C, s -= C, A.back += C, A.length = p, u === 0) {
            A.mode = Yt;
            break;
          }
          if (u & 32) {
            A.back = -1, A.mode = gA;
            break;
          }
          if (u & 64) {
            t.msg = "invalid literal/length code", A.mode = H;
            break;
          }
          A.extra = u & 15, A.mode = Rt;
        case Rt:
          if (A.extra) {
            for (x = A.extra; s < x; ) {
              if (a === 0)
                break A;
              a--, o += i[r++] << s, s += 8;
            }
            A.length += o & (1 << A.extra) - 1, o >>>= A.extra, s -= A.extra, A.back += A.extra;
          }
          A.was = A.length, A.mode = Nt;
        case Nt:
          for (; B = A.distcode[o & (1 << A.distbits) - 1], C = B >>> 24, u = B >>> 16 & 255, p = B & 65535, !(C <= s); ) {
            if (a === 0)
              break A;
            a--, o += i[r++] << s, s += 8;
          }
          if (!(u & 240)) {
            for (Q = C, D = u, E = p; B = A.distcode[E + ((o & (1 << Q + D) - 1) >> Q)], C = B >>> 24, u = B >>> 16 & 255, p = B & 65535, !(Q + C <= s); ) {
              if (a === 0)
                break A;
              a--, o += i[r++] << s, s += 8;
            }
            o >>>= Q, s -= Q, A.back += Q;
          }
          if (o >>>= C, s -= C, A.back += C, u & 64) {
            t.msg = "invalid distance code", A.mode = H;
            break;
          }
          A.offset = p, A.extra = u & 15, A.mode = Tt;
        case Tt:
          if (A.extra) {
            for (x = A.extra; s < x; ) {
              if (a === 0)
                break A;
              a--, o += i[r++] << s, s += 8;
            }
            A.offset += o & (1 << A.extra) - 1, o >>>= A.extra, s -= A.extra, A.back += A.extra;
          }
          if (A.offset > A.dmax) {
            t.msg = "invalid distance too far back", A.mode = H;
            break;
          }
          A.mode = qt;
        case qt:
          if (h === 0)
            break A;
          if (l = c - h, A.offset > l) {
            if (l = A.offset - l, l > A.whave && A.sane) {
              t.msg = "invalid distance too far back", A.mode = H;
              break;
            }
            l > A.wnext ? (l -= A.wnext, f = A.wsize - l) : f = A.wnext - l, l > A.length && (l = A.length), d = A.window;
          } else
            d = n, f = g - A.offset, l = A.length;
          l > h && (l = h), h -= l, A.length -= l;
          do
            n[g++] = d[f++];
          while (--l);
          A.length === 0 && (A.mode = te);
          break;
        case Yt:
          if (h === 0)
            break A;
          n[g++] = A.length, h--, A.mode = te;
          break;
        case me:
          if (A.wrap) {
            for (; s < 32; ) {
              if (a === 0)
                break A;
              a--, o |= i[r++] << s, s += 8;
            }
            if (c -= h, t.total_out += c, A.total += c, A.wrap & 4 && c && (t.adler = A.check = /*UPDATE_CHECK(state.check, put - _out, _out);*/
            A.flags ? oA(A.check, n, c, g - c) : Te(A.check, n, c, g - c)), c = h, A.wrap & 4 && (A.flags ? o : Ot(o)) !== A.check) {
              t.msg = "incorrect data check", A.mode = H;
              break;
            }
            o = 0, s = 0;
          }
          A.mode = _t;
        case _t:
          if (A.wrap && A.flags) {
            for (; s < 32; ) {
              if (a === 0)
                break A;
              a--, o += i[r++] << s, s += 8;
            }
            if (A.wrap & 4 && o !== (A.total & 4294967295)) {
              t.msg = "incorrect length check", A.mode = H;
              break;
            }
            o = 0, s = 0;
          }
          A.mode = Jt;
        case Jt:
          y = Bo;
          break A;
        case H:
          y = Fi;
          break A;
        case ki:
          return Si;
        case Mi:
        default:
          return tA;
      }
  return t.next_out = g, t.avail_out = h, t.next_in = r, t.avail_in = a, A.hold = o, A.bits = s, (A.wsize || c !== t.avail_out && A.mode < H && (A.mode < me || e !== dt)) && vi(t, t.output, t.next_out, c - t.avail_out), I -= t.avail_in, c -= t.avail_out, t.total_in += I, t.total_out += c, A.total += c, A.wrap & 4 && c && (t.adler = A.check = /*UPDATE_CHECK(state.check, strm.next_out - _out, _out);*/
  A.flags ? oA(A.check, n, c, t.next_out - c) : Te(A.check, n, c, t.next_out - c)), t.data_type = A.bits + (A.last ? 64 : 0) + (A.mode === gA ? 128 : 0) + (A.mode === ee || A.mode === xe ? 256 : 0), (I === 0 && c === 0 || e === dt) && y === uA && (y = Co), y;
}, mo = (t) => {
  if (wA(t))
    return tA;
  let e = t.state;
  return e.window && (e.window = null), t.state = null, uA;
}, Fo = (t, e) => {
  if (wA(t))
    return tA;
  const A = t.state;
  return A.wrap & 2 ? (A.head = e, e.done = !1, uA) : tA;
}, So = (t, e) => {
  const A = e.length;
  let i, n, r;
  return wA(t) || (i = t.state, i.wrap !== 0 && i.mode !== re) ? tA : i.mode === re && (n = 1, n = Te(n, e, A, 0), n !== i.check) ? Fi : (r = vi(t, e, A, A), r ? (i.mode = ki, Si) : (i.havedict = 1, uA));
};
var ko = bi, Mo = Li, Go = Gi, bo = po, Lo = Ui, Uo = xo, vo = mo, Ro = Fo, No = So, To = "pako inflate (from Nodeca project)", fA = {
  inflateReset: ko,
  inflateReset2: Mo,
  inflateResetKeep: Go,
  inflateInit: bo,
  inflateInit2: Lo,
  inflate: Uo,
  inflateEnd: vo,
  inflateGetHeader: Ro,
  inflateSetDictionary: No,
  inflateInfo: To
};
function qo() {
  this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
}
var Yo = qo;
const Ri = Object.prototype.toString, {
  Z_NO_FLUSH: _o,
  Z_FINISH: Jo,
  Z_OK: qA,
  Z_STREAM_END: ke,
  Z_NEED_DICT: Me,
  Z_STREAM_ERROR: Oo,
  Z_DATA_ERROR: Kt,
  Z_MEM_ERROR: Vo
} = yi;
function ge(t) {
  this.options = pi.assign({
    chunkSize: 1024 * 64,
    windowBits: 15,
    to: ""
  }, t || {});
  const e = this.options;
  e.raw && e.windowBits >= 0 && e.windowBits < 16 && (e.windowBits = -e.windowBits, e.windowBits === 0 && (e.windowBits = -15)), e.windowBits >= 0 && e.windowBits < 16 && !(t && t.windowBits) && (e.windowBits += 32), e.windowBits > 15 && e.windowBits < 48 && (e.windowBits & 15 || (e.windowBits |= 15)), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new no(), this.strm.avail_out = 0;
  let A = fA.inflateInit2(
    this.strm,
    e.windowBits
  );
  if (A !== qA)
    throw new Error(qe[A]);
  if (this.header = new Yo(), fA.inflateGetHeader(this.strm, this.header), e.dictionary && (typeof e.dictionary == "string" ? e.dictionary = Ye.string2buf(e.dictionary) : Ri.call(e.dictionary) === "[object ArrayBuffer]" && (e.dictionary = new Uint8Array(e.dictionary)), e.raw && (A = fA.inflateSetDictionary(this.strm, e.dictionary), A !== qA)))
    throw new Error(qe[A]);
}
ge.prototype.push = function(t, e) {
  const A = this.strm, i = this.options.chunkSize, n = this.options.dictionary;
  let r, g, a;
  if (this.ended) return !1;
  for (e === ~~e ? g = e : g = e === !0 ? Jo : _o, Ri.call(t) === "[object ArrayBuffer]" ? A.input = new Uint8Array(t) : A.input = t, A.next_in = 0, A.avail_in = A.input.length; ; ) {
    for (A.avail_out === 0 && (A.output = new Uint8Array(i), A.next_out = 0, A.avail_out = i), r = fA.inflate(A, g), r === Me && n && (r = fA.inflateSetDictionary(A, n), r === qA ? r = fA.inflate(A, g) : r === Kt && (r = Me)); A.avail_in > 0 && r === ke && A.state.wrap > 0 && t[A.next_in] !== 0; )
      fA.inflateReset(A), r = fA.inflate(A, g);
    switch (r) {
      case Oo:
      case Kt:
      case Me:
      case Vo:
        return this.onEnd(r), this.ended = !0, !1;
    }
    if (a = A.avail_out, A.next_out && (A.avail_out === 0 || r === ke))
      if (this.options.to === "string") {
        let h = Ye.utf8border(A.output, A.next_out), o = A.next_out - h, s = Ye.buf2string(A.output, h);
        A.next_out = o, A.avail_out = i - o, o && A.output.set(A.output.subarray(h, h + o), 0), this.onData(s);
      } else
        this.onData(A.output.length === A.next_out ? A.output : A.output.subarray(0, A.next_out));
    if (!(r === qA && a === 0)) {
      if (r === ke)
        return r = fA.inflateEnd(this.strm), this.onEnd(r), this.ended = !0, !0;
      if (A.avail_in === 0) break;
    }
  }
  return !0;
};
ge.prototype.onData = function(t) {
  this.chunks.push(t);
};
ge.prototype.onEnd = function(t) {
  t === qA && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = pi.flattenChunks(this.chunks)), this.chunks = [], this.err = t, this.msg = this.strm.msg;
};
function Ko(t, e) {
  const A = new ge(e);
  if (A.push(t), A.err) throw A.msg || qe[A.err];
  return A.result;
}
var Ho = Ko, Po = {
  inflate: Ho
};
const { inflate: Xo } = Po;
var Ni = Xo;
class jo extends dA {
  decodeBlock(e) {
    return Ni(new Uint8Array(e)).buffer;
  }
}
const Zo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: jo
}, Symbol.toStringTag, { value: "Module" }));
class zo extends dA {
  decodeBlock(e) {
    const A = new DataView(e), i = [];
    for (let n = 0; n < e.byteLength; ++n) {
      let r = A.getInt8(n);
      if (r < 0) {
        const g = A.getUint8(n + 1);
        r = -r;
        for (let a = 0; a <= r; ++a)
          i.push(g);
        n += 1;
      } else {
        for (let g = 0; g <= r; ++g)
          i.push(A.getUint8(n + g + 1));
        n += r + 1;
      }
    }
    return new Uint8Array(i).buffer;
  }
}
const Wo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: zo
}, Symbol.toStringTag, { value: "Module" }));
var Ti = { exports: {} };
(function(t) {
  /* Copyright 2015-2021 Esri. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 @preserve */
  (function() {
    var e = function() {
      var r = {};
      r.defaultNoDataValue = -34027999387901484e22, r.decode = function(I, c) {
        c = c || {};
        var l = c.encodedMaskData || c.encodedMaskData === null, f = o(I, c.inputOffset || 0, l), d = c.noDataValue !== null ? c.noDataValue : r.defaultNoDataValue, B = g(
          f,
          c.pixelType || Float32Array,
          c.encodedMaskData,
          d,
          c.returnMask
        ), C = {
          width: f.width,
          height: f.height,
          pixelData: B.resultPixels,
          minValue: B.minValue,
          maxValue: f.pixels.maxValue,
          noDataValue: d
        };
        return B.resultMask && (C.maskData = B.resultMask), c.returnEncodedMask && f.mask && (C.encodedMaskData = f.mask.bitset ? f.mask.bitset : null), c.returnFileInfo && (C.fileInfo = a(f), c.computeUsedBitDepths && (C.fileInfo.bitDepths = h(f))), C;
      };
      var g = function(I, c, l, f, d) {
        var B = 0, C = I.pixels.numBlocksX, u = I.pixels.numBlocksY, p = Math.floor(I.width / C), Q = Math.floor(I.height / u), D = 2 * I.maxZError, E = Number.MAX_VALUE, w;
        l = l || (I.mask ? I.mask.bitset : null);
        var y, m;
        y = new c(I.width * I.height), d && l && (m = new Uint8Array(I.width * I.height));
        for (var S = new Float32Array(p * Q), x, G, M = 0; M <= u; M++) {
          var Y = M !== u ? Q : I.height % u;
          if (Y !== 0)
            for (var k = 0; k <= C; k++) {
              var F = k !== C ? p : I.width % C;
              if (F !== 0) {
                var v = M * I.width * Q + k * p, b = I.width - F, U = I.pixels.blocks[B], N, R, O;
                U.encoding < 2 ? (U.encoding === 0 ? N = U.rawData : (s(U.stuffedData, U.bitsPerPixel, U.numValidPixels, U.offset, D, S, I.pixels.maxValue), N = S), R = 0) : U.encoding === 2 ? O = 0 : O = U.offset;
                var K;
                if (l)
                  for (G = 0; G < Y; G++) {
                    for (v & 7 && (K = l[v >> 3], K <<= v & 7), x = 0; x < F; x++)
                      v & 7 || (K = l[v >> 3]), K & 128 ? (m && (m[v] = 1), w = U.encoding < 2 ? N[R++] : O, E = E > w ? w : E, y[v++] = w) : (m && (m[v] = 0), y[v++] = f), K <<= 1;
                    v += b;
                  }
                else if (U.encoding < 2)
                  for (G = 0; G < Y; G++) {
                    for (x = 0; x < F; x++)
                      w = N[R++], E = E > w ? w : E, y[v++] = w;
                    v += b;
                  }
                else
                  for (E = E > O ? O : E, G = 0; G < Y; G++) {
                    for (x = 0; x < F; x++)
                      y[v++] = O;
                    v += b;
                  }
                if (U.encoding === 1 && R !== U.numValidPixels)
                  throw "Block and Mask do not match";
                B++;
              }
            }
        }
        return {
          resultPixels: y,
          resultMask: m,
          minValue: E
        };
      }, a = function(I) {
        return {
          fileIdentifierString: I.fileIdentifierString,
          fileVersion: I.fileVersion,
          imageType: I.imageType,
          height: I.height,
          width: I.width,
          maxZError: I.maxZError,
          eofOffset: I.eofOffset,
          mask: I.mask ? {
            numBlocksX: I.mask.numBlocksX,
            numBlocksY: I.mask.numBlocksY,
            numBytes: I.mask.numBytes,
            maxValue: I.mask.maxValue
          } : null,
          pixels: {
            numBlocksX: I.pixels.numBlocksX,
            numBlocksY: I.pixels.numBlocksY,
            numBytes: I.pixels.numBytes,
            maxValue: I.pixels.maxValue,
            noDataValue: I.noDataValue
          }
        };
      }, h = function(I) {
        for (var c = I.pixels.numBlocksX * I.pixels.numBlocksY, l = {}, f = 0; f < c; f++) {
          var d = I.pixels.blocks[f];
          d.encoding === 0 ? l.float32 = !0 : d.encoding === 1 ? l[d.bitsPerPixel] = !0 : l[0] = !0;
        }
        return Object.keys(l);
      }, o = function(I, c, l) {
        var f = {}, d = new Uint8Array(I, c, 10);
        if (f.fileIdentifierString = String.fromCharCode.apply(null, d), f.fileIdentifierString.trim() !== "CntZImage")
          throw "Unexpected file identifier string: " + f.fileIdentifierString;
        c += 10;
        var B = new DataView(I, c, 24);
        if (f.fileVersion = B.getInt32(0, !0), f.imageType = B.getInt32(4, !0), f.height = B.getUint32(8, !0), f.width = B.getUint32(12, !0), f.maxZError = B.getFloat64(16, !0), c += 24, !l)
          if (B = new DataView(I, c, 16), f.mask = {}, f.mask.numBlocksY = B.getUint32(0, !0), f.mask.numBlocksX = B.getUint32(4, !0), f.mask.numBytes = B.getUint32(8, !0), f.mask.maxValue = B.getFloat32(12, !0), c += 16, f.mask.numBytes > 0) {
            var C = new Uint8Array(Math.ceil(f.width * f.height / 8));
            B = new DataView(I, c, f.mask.numBytes);
            var u = B.getInt16(0, !0), p = 2, Q = 0;
            do {
              if (u > 0)
                for (; u--; )
                  C[Q++] = B.getUint8(p++);
              else {
                var D = B.getUint8(p++);
                for (u = -u; u--; )
                  C[Q++] = D;
              }
              u = B.getInt16(p, !0), p += 2;
            } while (p < f.mask.numBytes);
            if (u !== -32768 || Q < C.length)
              throw "Unexpected end of mask RLE encoding";
            f.mask.bitset = C, c += f.mask.numBytes;
          } else f.mask.numBytes | f.mask.numBlocksY | f.mask.maxValue || (f.mask.bitset = new Uint8Array(Math.ceil(f.width * f.height / 8)));
        B = new DataView(I, c, 16), f.pixels = {}, f.pixels.numBlocksY = B.getUint32(0, !0), f.pixels.numBlocksX = B.getUint32(4, !0), f.pixels.numBytes = B.getUint32(8, !0), f.pixels.maxValue = B.getFloat32(12, !0), c += 16;
        var E = f.pixels.numBlocksX, w = f.pixels.numBlocksY, y = E + (f.width % E > 0 ? 1 : 0), m = w + (f.height % w > 0 ? 1 : 0);
        f.pixels.blocks = new Array(y * m);
        for (var S = 0, x = 0; x < m; x++)
          for (var G = 0; G < y; G++) {
            var M = 0, Y = I.byteLength - c;
            B = new DataView(I, c, Math.min(10, Y));
            var k = {};
            f.pixels.blocks[S++] = k;
            var F = B.getUint8(0);
            if (M++, k.encoding = F & 63, k.encoding > 3)
              throw "Invalid block encoding (" + k.encoding + ")";
            if (k.encoding === 2) {
              c++;
              continue;
            }
            if (F !== 0 && F !== 2) {
              if (F >>= 6, k.offsetType = F, F === 2)
                k.offset = B.getInt8(1), M++;
              else if (F === 1)
                k.offset = B.getInt16(1, !0), M += 2;
              else if (F === 0)
                k.offset = B.getFloat32(1, !0), M += 4;
              else
                throw "Invalid block offset type";
              if (k.encoding === 1)
                if (F = B.getUint8(M), M++, k.bitsPerPixel = F & 63, F >>= 6, k.numValidPixelsType = F, F === 2)
                  k.numValidPixels = B.getUint8(M), M++;
                else if (F === 1)
                  k.numValidPixels = B.getUint16(M, !0), M += 2;
                else if (F === 0)
                  k.numValidPixels = B.getUint32(M, !0), M += 4;
                else
                  throw "Invalid valid pixel count type";
            }
            if (c += M, k.encoding !== 3) {
              var v, b;
              if (k.encoding === 0) {
                var U = (f.pixels.numBytes - 1) / 4;
                if (U !== Math.floor(U))
                  throw "uncompressed block has invalid length";
                v = new ArrayBuffer(U * 4), b = new Uint8Array(v), b.set(new Uint8Array(I, c, U * 4));
                var N = new Float32Array(v);
                k.rawData = N, c += U * 4;
              } else if (k.encoding === 1) {
                var R = Math.ceil(k.numValidPixels * k.bitsPerPixel / 8), O = Math.ceil(R / 4);
                v = new ArrayBuffer(O * 4), b = new Uint8Array(v), b.set(new Uint8Array(I, c, R)), k.stuffedData = new Uint32Array(v), c += R;
              }
            }
          }
        return f.eofOffset = c, f;
      }, s = function(I, c, l, f, d, B, C) {
        var u = (1 << c) - 1, p = 0, Q, D = 0, E, w, y = Math.ceil((C - f) / d), m = I.length * 4 - Math.ceil(c * l / 8);
        for (I[I.length - 1] <<= 8 * m, Q = 0; Q < l; Q++) {
          if (D === 0 && (w = I[p++], D = 32), D >= c)
            E = w >>> D - c & u, D -= c;
          else {
            var S = c - D;
            E = (w & u) << S & u, w = I[p++], D = 32 - S, E += w >>> D;
          }
          B[Q] = E < y ? f + E * d : C;
        }
        return B;
      };
      return r;
    }(), A = /* @__PURE__ */ function() {
      var r = {
        //methods ending with 2 are for the new byte order used by Lerc2.3 and above.
        //originalUnstuff is used to unpack Huffman code table. code is duplicated to unstuffx for performance reasons.
        unstuff: function(o, s, I, c, l, f, d, B) {
          var C = (1 << I) - 1, u = 0, p, Q = 0, D, E, w, y, m = o.length * 4 - Math.ceil(I * c / 8);
          if (o[o.length - 1] <<= 8 * m, l)
            for (p = 0; p < c; p++)
              Q === 0 && (E = o[u++], Q = 32), Q >= I ? (D = E >>> Q - I & C, Q -= I) : (w = I - Q, D = (E & C) << w & C, E = o[u++], Q = 32 - w, D += E >>> Q), s[p] = l[D];
          else
            for (y = Math.ceil((B - f) / d), p = 0; p < c; p++)
              Q === 0 && (E = o[u++], Q = 32), Q >= I ? (D = E >>> Q - I & C, Q -= I) : (w = I - Q, D = (E & C) << w & C, E = o[u++], Q = 32 - w, D += E >>> Q), s[p] = D < y ? f + D * d : B;
        },
        unstuffLUT: function(o, s, I, c, l, f) {
          var d = (1 << s) - 1, B = 0, C = 0, u = 0, p = 0, Q = 0, D, E = [], w = o.length * 4 - Math.ceil(s * I / 8);
          o[o.length - 1] <<= 8 * w;
          var y = Math.ceil((f - c) / l);
          for (C = 0; C < I; C++)
            p === 0 && (D = o[B++], p = 32), p >= s ? (Q = D >>> p - s & d, p -= s) : (u = s - p, Q = (D & d) << u & d, D = o[B++], p = 32 - u, Q += D >>> p), E[C] = Q < y ? c + Q * l : f;
          return E.unshift(c), E;
        },
        unstuff2: function(o, s, I, c, l, f, d, B) {
          var C = (1 << I) - 1, u = 0, p, Q = 0, D = 0, E, w, y;
          if (l)
            for (p = 0; p < c; p++)
              Q === 0 && (w = o[u++], Q = 32, D = 0), Q >= I ? (E = w >>> D & C, Q -= I, D += I) : (y = I - Q, E = w >>> D & C, w = o[u++], Q = 32 - y, E |= (w & (1 << y) - 1) << I - y, D = y), s[p] = l[E];
          else {
            var m = Math.ceil((B - f) / d);
            for (p = 0; p < c; p++)
              Q === 0 && (w = o[u++], Q = 32, D = 0), Q >= I ? (E = w >>> D & C, Q -= I, D += I) : (y = I - Q, E = w >>> D & C, w = o[u++], Q = 32 - y, E |= (w & (1 << y) - 1) << I - y, D = y), s[p] = E < m ? f + E * d : B;
          }
          return s;
        },
        unstuffLUT2: function(o, s, I, c, l, f) {
          var d = (1 << s) - 1, B = 0, C = 0, u = 0, p = 0, Q = 0, D = 0, E, w = [], y = Math.ceil((f - c) / l);
          for (C = 0; C < I; C++)
            p === 0 && (E = o[B++], p = 32, D = 0), p >= s ? (Q = E >>> D & d, p -= s, D += s) : (u = s - p, Q = E >>> D & d, E = o[B++], p = 32 - u, Q |= (E & (1 << u) - 1) << s - u, D = u), w[C] = Q < y ? c + Q * l : f;
          return w.unshift(c), w;
        },
        originalUnstuff: function(o, s, I, c) {
          var l = (1 << I) - 1, f = 0, d, B = 0, C, u, p, Q = o.length * 4 - Math.ceil(I * c / 8);
          for (o[o.length - 1] <<= 8 * Q, d = 0; d < c; d++)
            B === 0 && (u = o[f++], B = 32), B >= I ? (C = u >>> B - I & l, B -= I) : (p = I - B, C = (u & l) << p & l, u = o[f++], B = 32 - p, C += u >>> B), s[d] = C;
          return s;
        },
        originalUnstuff2: function(o, s, I, c) {
          var l = (1 << I) - 1, f = 0, d, B = 0, C = 0, u, p, Q;
          for (d = 0; d < c; d++)
            B === 0 && (p = o[f++], B = 32, C = 0), B >= I ? (u = p >>> C & l, B -= I, C += I) : (Q = I - B, u = p >>> C & l, p = o[f++], B = 32 - Q, u |= (p & (1 << Q) - 1) << I - Q, C = Q), s[d] = u;
          return s;
        }
      }, g = {
        HUFFMAN_LUT_BITS_MAX: 12,
        //use 2^12 lut, treat it like constant
        computeChecksumFletcher32: function(o) {
          for (var s = 65535, I = 65535, c = o.length, l = Math.floor(c / 2), f = 0; l; ) {
            var d = l >= 359 ? 359 : l;
            l -= d;
            do
              s += o[f++] << 8, I += s += o[f++];
            while (--d);
            s = (s & 65535) + (s >>> 16), I = (I & 65535) + (I >>> 16);
          }
          return c & 1 && (I += s += o[f] << 8), s = (s & 65535) + (s >>> 16), I = (I & 65535) + (I >>> 16), (I << 16 | s) >>> 0;
        },
        readHeaderInfo: function(o, s) {
          var I = s.ptr, c = new Uint8Array(o, I, 6), l = {};
          if (l.fileIdentifierString = String.fromCharCode.apply(null, c), l.fileIdentifierString.lastIndexOf("Lerc2", 0) !== 0)
            throw "Unexpected file identifier string (expect Lerc2 ): " + l.fileIdentifierString;
          I += 6;
          var f = new DataView(o, I, 8), d = f.getInt32(0, !0);
          l.fileVersion = d, I += 4, d >= 3 && (l.checksum = f.getUint32(4, !0), I += 4), f = new DataView(o, I, 12), l.height = f.getUint32(0, !0), l.width = f.getUint32(4, !0), I += 8, d >= 4 ? (l.numDims = f.getUint32(8, !0), I += 4) : l.numDims = 1, f = new DataView(o, I, 40), l.numValidPixel = f.getUint32(0, !0), l.microBlockSize = f.getInt32(4, !0), l.blobSize = f.getInt32(8, !0), l.imageType = f.getInt32(12, !0), l.maxZError = f.getFloat64(16, !0), l.zMin = f.getFloat64(24, !0), l.zMax = f.getFloat64(32, !0), I += 40, s.headerInfo = l, s.ptr = I;
          var B, C;
          if (d >= 3 && (C = d >= 4 ? 52 : 48, B = this.computeChecksumFletcher32(new Uint8Array(o, I - C, l.blobSize - 14)), B !== l.checksum))
            throw "Checksum failed.";
          return !0;
        },
        checkMinMaxRanges: function(o, s) {
          var I = s.headerInfo, c = this.getDataTypeArray(I.imageType), l = I.numDims * this.getDataTypeSize(I.imageType), f = this.readSubArray(o, s.ptr, c, l), d = this.readSubArray(o, s.ptr + l, c, l);
          s.ptr += 2 * l;
          var B, C = !0;
          for (B = 0; B < I.numDims; B++)
            if (f[B] !== d[B]) {
              C = !1;
              break;
            }
          return I.minValues = f, I.maxValues = d, C;
        },
        readSubArray: function(o, s, I, c) {
          var l;
          if (I === Uint8Array)
            l = new Uint8Array(o, s, c);
          else {
            var f = new ArrayBuffer(c), d = new Uint8Array(f);
            d.set(new Uint8Array(o, s, c)), l = new I(f);
          }
          return l;
        },
        readMask: function(o, s) {
          var I = s.ptr, c = s.headerInfo, l = c.width * c.height, f = c.numValidPixel, d = new DataView(o, I, 4), B = {};
          if (B.numBytes = d.getUint32(0, !0), I += 4, (f === 0 || l === f) && B.numBytes !== 0)
            throw "invalid mask";
          var C, u;
          if (f === 0)
            C = new Uint8Array(Math.ceil(l / 8)), B.bitset = C, u = new Uint8Array(l), s.pixels.resultMask = u, I += B.numBytes;
          else if (B.numBytes > 0) {
            C = new Uint8Array(Math.ceil(l / 8)), d = new DataView(o, I, B.numBytes);
            var p = d.getInt16(0, !0), Q = 2, D = 0, E = 0;
            do {
              if (p > 0)
                for (; p--; )
                  C[D++] = d.getUint8(Q++);
              else
                for (E = d.getUint8(Q++), p = -p; p--; )
                  C[D++] = E;
              p = d.getInt16(Q, !0), Q += 2;
            } while (Q < B.numBytes);
            if (p !== -32768 || D < C.length)
              throw "Unexpected end of mask RLE encoding";
            u = new Uint8Array(l);
            var w = 0, y = 0;
            for (y = 0; y < l; y++)
              y & 7 ? (w = C[y >> 3], w <<= y & 7) : w = C[y >> 3], w & 128 && (u[y] = 1);
            s.pixels.resultMask = u, B.bitset = C, I += B.numBytes;
          }
          return s.ptr = I, s.mask = B, !0;
        },
        readDataOneSweep: function(o, s, I, c) {
          var l = s.ptr, f = s.headerInfo, d = f.numDims, B = f.width * f.height, C = f.imageType, u = f.numValidPixel * g.getDataTypeSize(C) * d, p, Q = s.pixels.resultMask;
          if (I === Uint8Array)
            p = new Uint8Array(o, l, u);
          else {
            var D = new ArrayBuffer(u), E = new Uint8Array(D);
            E.set(new Uint8Array(o, l, u)), p = new I(D);
          }
          if (p.length === B * d)
            c ? s.pixels.resultPixels = g.swapDimensionOrder(p, B, d, I, !0) : s.pixels.resultPixels = p;
          else {
            s.pixels.resultPixels = new I(B * d);
            var w = 0, y = 0, m = 0, S = 0;
            if (d > 1) {
              if (c) {
                for (y = 0; y < B; y++)
                  if (Q[y])
                    for (S = y, m = 0; m < d; m++, S += B)
                      s.pixels.resultPixels[S] = p[w++];
              } else
                for (y = 0; y < B; y++)
                  if (Q[y])
                    for (S = y * d, m = 0; m < d; m++)
                      s.pixels.resultPixels[S + m] = p[w++];
            } else
              for (y = 0; y < B; y++)
                Q[y] && (s.pixels.resultPixels[y] = p[w++]);
          }
          return l += u, s.ptr = l, !0;
        },
        readHuffmanTree: function(o, s) {
          var I = this.HUFFMAN_LUT_BITS_MAX, c = new DataView(o, s.ptr, 16);
          s.ptr += 16;
          var l = c.getInt32(0, !0);
          if (l < 2)
            throw "unsupported Huffman version";
          var f = c.getInt32(4, !0), d = c.getInt32(8, !0), B = c.getInt32(12, !0);
          if (d >= B)
            return !1;
          var C = new Uint32Array(B - d);
          g.decodeBits(o, s, C);
          var u = [], p, Q, D, E;
          for (p = d; p < B; p++)
            Q = p - (p < f ? 0 : f), u[Q] = { first: C[p - d], second: null };
          var w = o.byteLength - s.ptr, y = Math.ceil(w / 4), m = new ArrayBuffer(y * 4), S = new Uint8Array(m);
          S.set(new Uint8Array(o, s.ptr, w));
          var x = new Uint32Array(m), G = 0, M, Y = 0;
          for (M = x[0], p = d; p < B; p++)
            Q = p - (p < f ? 0 : f), E = u[Q].first, E > 0 && (u[Q].second = M << G >>> 32 - E, 32 - G >= E ? (G += E, G === 32 && (G = 0, Y++, M = x[Y])) : (G += E - 32, Y++, M = x[Y], u[Q].second |= M >>> 32 - G));
          var k = 0, F = 0, v = new a();
          for (p = 0; p < u.length; p++)
            u[p] !== void 0 && (k = Math.max(k, u[p].first));
          k >= I ? F = I : F = k;
          var b = [], U, N, R, O, K, L;
          for (p = d; p < B; p++)
            if (Q = p - (p < f ? 0 : f), E = u[Q].first, E > 0)
              if (U = [E, Q], E <= F)
                for (N = u[Q].second << F - E, R = 1 << F - E, D = 0; D < R; D++)
                  b[N | D] = U;
              else
                for (N = u[Q].second, L = v, O = E - 1; O >= 0; O--)
                  K = N >>> O & 1, K ? (L.right || (L.right = new a()), L = L.right) : (L.left || (L.left = new a()), L = L.left), O === 0 && !L.val && (L.val = U[1]);
          return {
            decodeLut: b,
            numBitsLUTQick: F,
            numBitsLUT: k,
            tree: v,
            stuffedData: x,
            srcPtr: Y,
            bitPos: G
          };
        },
        readHuffman: function(o, s, I, c) {
          var l = s.headerInfo, f = l.numDims, d = s.headerInfo.height, B = s.headerInfo.width, C = B * d, u = this.readHuffmanTree(o, s), p = u.decodeLut, Q = u.tree, D = u.stuffedData, E = u.srcPtr, w = u.bitPos, y = u.numBitsLUTQick, m = u.numBitsLUT, S = s.headerInfo.imageType === 0 ? 128 : 0, x, G, M, Y = s.pixels.resultMask, k, F, v, b, U, N, R, O = 0;
          w > 0 && (E++, w = 0);
          var K = D[E], L = s.encodeMode === 1, q = new I(C * f), T = q, J;
          if (f < 2 || L) {
            for (J = 0; J < f; J++)
              if (f > 1 && (T = new I(q.buffer, C * J, C), O = 0), s.headerInfo.numValidPixel === B * d)
                for (N = 0, b = 0; b < d; b++)
                  for (U = 0; U < B; U++, N++) {
                    if (G = 0, k = K << w >>> 32 - y, F = k, 32 - w < y && (k |= D[E + 1] >>> 64 - w - y, F = k), p[F])
                      G = p[F][1], w += p[F][0];
                    else
                      for (k = K << w >>> 32 - m, F = k, 32 - w < m && (k |= D[E + 1] >>> 64 - w - m, F = k), x = Q, R = 0; R < m; R++)
                        if (v = k >>> m - R - 1 & 1, x = v ? x.right : x.left, !(x.left || x.right)) {
                          G = x.val, w = w + R + 1;
                          break;
                        }
                    w >= 32 && (w -= 32, E++, K = D[E]), M = G - S, L ? (U > 0 ? M += O : b > 0 ? M += T[N - B] : M += O, M &= 255, T[N] = M, O = M) : T[N] = M;
                  }
              else
                for (N = 0, b = 0; b < d; b++)
                  for (U = 0; U < B; U++, N++)
                    if (Y[N]) {
                      if (G = 0, k = K << w >>> 32 - y, F = k, 32 - w < y && (k |= D[E + 1] >>> 64 - w - y, F = k), p[F])
                        G = p[F][1], w += p[F][0];
                      else
                        for (k = K << w >>> 32 - m, F = k, 32 - w < m && (k |= D[E + 1] >>> 64 - w - m, F = k), x = Q, R = 0; R < m; R++)
                          if (v = k >>> m - R - 1 & 1, x = v ? x.right : x.left, !(x.left || x.right)) {
                            G = x.val, w = w + R + 1;
                            break;
                          }
                      w >= 32 && (w -= 32, E++, K = D[E]), M = G - S, L ? (U > 0 && Y[N - 1] ? M += O : b > 0 && Y[N - B] ? M += T[N - B] : M += O, M &= 255, T[N] = M, O = M) : T[N] = M;
                    }
          } else
            for (N = 0, b = 0; b < d; b++)
              for (U = 0; U < B; U++)
                if (N = b * B + U, !Y || Y[N])
                  for (J = 0; J < f; J++, N += C) {
                    if (G = 0, k = K << w >>> 32 - y, F = k, 32 - w < y && (k |= D[E + 1] >>> 64 - w - y, F = k), p[F])
                      G = p[F][1], w += p[F][0];
                    else
                      for (k = K << w >>> 32 - m, F = k, 32 - w < m && (k |= D[E + 1] >>> 64 - w - m, F = k), x = Q, R = 0; R < m; R++)
                        if (v = k >>> m - R - 1 & 1, x = v ? x.right : x.left, !(x.left || x.right)) {
                          G = x.val, w = w + R + 1;
                          break;
                        }
                    w >= 32 && (w -= 32, E++, K = D[E]), M = G - S, T[N] = M;
                  }
          s.ptr = s.ptr + (E + 1) * 4 + (w > 0 ? 4 : 0), s.pixels.resultPixels = q, f > 1 && !c && (s.pixels.resultPixels = g.swapDimensionOrder(q, C, f, I));
        },
        decodeBits: function(o, s, I, c, l) {
          {
            var f = s.headerInfo, d = f.fileVersion, B = 0, C = o.byteLength - s.ptr >= 5 ? 5 : o.byteLength - s.ptr, u = new DataView(o, s.ptr, C), p = u.getUint8(0);
            B++;
            var Q = p >> 6, D = Q === 0 ? 4 : 3 - Q, E = (p & 32) > 0, w = p & 31, y = 0;
            if (D === 1)
              y = u.getUint8(B), B++;
            else if (D === 2)
              y = u.getUint16(B, !0), B += 2;
            else if (D === 4)
              y = u.getUint32(B, !0), B += 4;
            else
              throw "Invalid valid pixel count type";
            var m = 2 * f.maxZError, S, x, G, M, Y, k, F, v, b, U = f.numDims > 1 ? f.maxValues[l] : f.zMax;
            if (E) {
              for (s.counter.lut++, v = u.getUint8(B), B++, M = Math.ceil((v - 1) * w / 8), Y = Math.ceil(M / 4), x = new ArrayBuffer(Y * 4), G = new Uint8Array(x), s.ptr += B, G.set(new Uint8Array(o, s.ptr, M)), F = new Uint32Array(x), s.ptr += M, b = 0; v - 1 >>> b; )
                b++;
              M = Math.ceil(y * b / 8), Y = Math.ceil(M / 4), x = new ArrayBuffer(Y * 4), G = new Uint8Array(x), G.set(new Uint8Array(o, s.ptr, M)), S = new Uint32Array(x), s.ptr += M, d >= 3 ? k = r.unstuffLUT2(F, w, v - 1, c, m, U) : k = r.unstuffLUT(F, w, v - 1, c, m, U), d >= 3 ? r.unstuff2(S, I, b, y, k) : r.unstuff(S, I, b, y, k);
            } else
              s.counter.bitstuffer++, b = w, s.ptr += B, b > 0 && (M = Math.ceil(y * b / 8), Y = Math.ceil(M / 4), x = new ArrayBuffer(Y * 4), G = new Uint8Array(x), G.set(new Uint8Array(o, s.ptr, M)), S = new Uint32Array(x), s.ptr += M, d >= 3 ? c == null ? r.originalUnstuff2(S, I, b, y) : r.unstuff2(S, I, b, y, !1, c, m, U) : c == null ? r.originalUnstuff(S, I, b, y) : r.unstuff(S, I, b, y, !1, c, m, U));
          }
        },
        readTiles: function(o, s, I, c) {
          var l = s.headerInfo, f = l.width, d = l.height, B = f * d, C = l.microBlockSize, u = l.imageType, p = g.getDataTypeSize(u), Q = Math.ceil(f / C), D = Math.ceil(d / C);
          s.pixels.numBlocksY = D, s.pixels.numBlocksX = Q, s.pixels.ptr = 0;
          var E = 0, w = 0, y = 0, m = 0, S = 0, x = 0, G = 0, M = 0, Y = 0, k = 0, F = 0, v = 0, b = 0, U = 0, N = 0, R = 0, O, K, L, q, T, J, V = new I(C * C), P = d % C || C, X = f % C || C, $, W, _A = l.numDims, QA, nA = s.pixels.resultMask, eA = s.pixels.resultPixels, Yi = l.fileVersion, it = Yi >= 5 ? 14 : 15, cA, Ie = l.zMax, BA;
          for (y = 0; y < D; y++)
            for (S = y !== D - 1 ? C : P, m = 0; m < Q; m++)
              for (x = m !== Q - 1 ? C : X, F = y * f * C + m * C, v = f - x, QA = 0; QA < _A; QA++) {
                if (_A > 1 ? (BA = eA, F = y * f * C + m * C, eA = new I(s.pixels.resultPixels.buffer, B * QA * p, B), Ie = l.maxValues[QA]) : BA = null, G = o.byteLength - s.ptr, O = new DataView(o, s.ptr, Math.min(10, G)), K = {}, R = 0, M = O.getUint8(0), R++, cA = l.fileVersion >= 5 ? M & 4 : 0, Y = M >> 6 & 255, k = M >> 2 & it, k !== (m * C >> 3 & it) || cA && QA === 0)
                  throw "integrity issue";
                if (J = M & 3, J > 3)
                  throw s.ptr += R, "Invalid block encoding (" + J + ")";
                if (J === 2) {
                  if (cA)
                    if (nA)
                      for (E = 0; E < S; E++)
                        for (w = 0; w < x; w++)
                          nA[F] && (eA[F] = BA[F]), F++;
                    else
                      for (E = 0; E < S; E++)
                        for (w = 0; w < x; w++)
                          eA[F] = BA[F], F++;
                  s.counter.constant++, s.ptr += R;
                  continue;
                } else if (J === 0) {
                  if (cA)
                    throw "integrity issue";
                  if (s.counter.uncompressed++, s.ptr += R, b = S * x * p, U = o.byteLength - s.ptr, b = b < U ? b : U, L = new ArrayBuffer(b % p === 0 ? b : b + p - b % p), q = new Uint8Array(L), q.set(new Uint8Array(o, s.ptr, b)), T = new I(L), N = 0, nA)
                    for (E = 0; E < S; E++) {
                      for (w = 0; w < x; w++)
                        nA[F] && (eA[F] = T[N++]), F++;
                      F += v;
                    }
                  else
                    for (E = 0; E < S; E++) {
                      for (w = 0; w < x; w++)
                        eA[F++] = T[N++];
                      F += v;
                    }
                  s.ptr += N * p;
                } else if ($ = g.getDataTypeUsed(cA && u < 6 ? 4 : u, Y), W = g.getOnePixel(K, R, $, O), R += g.getDataTypeSize($), J === 3)
                  if (s.ptr += R, s.counter.constantoffset++, nA)
                    for (E = 0; E < S; E++) {
                      for (w = 0; w < x; w++)
                        nA[F] && (eA[F] = cA ? Math.min(Ie, BA[F] + W) : W), F++;
                      F += v;
                    }
                  else
                    for (E = 0; E < S; E++) {
                      for (w = 0; w < x; w++)
                        eA[F] = cA ? Math.min(Ie, BA[F] + W) : W, F++;
                      F += v;
                    }
                else if (s.ptr += R, g.decodeBits(o, s, V, W, QA), R = 0, cA)
                  if (nA)
                    for (E = 0; E < S; E++) {
                      for (w = 0; w < x; w++)
                        nA[F] && (eA[F] = V[R++] + BA[F]), F++;
                      F += v;
                    }
                  else
                    for (E = 0; E < S; E++) {
                      for (w = 0; w < x; w++)
                        eA[F] = V[R++] + BA[F], F++;
                      F += v;
                    }
                else if (nA)
                  for (E = 0; E < S; E++) {
                    for (w = 0; w < x; w++)
                      nA[F] && (eA[F] = V[R++]), F++;
                    F += v;
                  }
                else
                  for (E = 0; E < S; E++) {
                    for (w = 0; w < x; w++)
                      eA[F++] = V[R++];
                    F += v;
                  }
              }
          _A > 1 && !c && (s.pixels.resultPixels = g.swapDimensionOrder(s.pixels.resultPixels, B, _A, I));
        },
        /*****************
        *  private methods (helper methods)
        *****************/
        formatFileInfo: function(o) {
          return {
            fileIdentifierString: o.headerInfo.fileIdentifierString,
            fileVersion: o.headerInfo.fileVersion,
            imageType: o.headerInfo.imageType,
            height: o.headerInfo.height,
            width: o.headerInfo.width,
            numValidPixel: o.headerInfo.numValidPixel,
            microBlockSize: o.headerInfo.microBlockSize,
            blobSize: o.headerInfo.blobSize,
            maxZError: o.headerInfo.maxZError,
            pixelType: g.getPixelType(o.headerInfo.imageType),
            eofOffset: o.eofOffset,
            mask: o.mask ? {
              numBytes: o.mask.numBytes
            } : null,
            pixels: {
              numBlocksX: o.pixels.numBlocksX,
              numBlocksY: o.pixels.numBlocksY,
              //"numBytes": data.pixels.numBytes,
              maxValue: o.headerInfo.zMax,
              minValue: o.headerInfo.zMin,
              noDataValue: o.noDataValue
            }
          };
        },
        constructConstantSurface: function(o, s) {
          var I = o.headerInfo.zMax, c = o.headerInfo.zMin, l = o.headerInfo.maxValues, f = o.headerInfo.numDims, d = o.headerInfo.height * o.headerInfo.width, B = 0, C = 0, u = 0, p = o.pixels.resultMask, Q = o.pixels.resultPixels;
          if (p)
            if (f > 1) {
              if (s)
                for (B = 0; B < f; B++)
                  for (u = B * d, I = l[B], C = 0; C < d; C++)
                    p[C] && (Q[u + C] = I);
              else
                for (C = 0; C < d; C++)
                  if (p[C])
                    for (u = C * f, B = 0; B < f; B++)
                      Q[u + f] = l[B];
            } else
              for (C = 0; C < d; C++)
                p[C] && (Q[C] = I);
          else if (f > 1 && c !== I)
            if (s)
              for (B = 0; B < f; B++)
                for (u = B * d, I = l[B], C = 0; C < d; C++)
                  Q[u + C] = I;
            else
              for (C = 0; C < d; C++)
                for (u = C * f, B = 0; B < f; B++)
                  Q[u + B] = l[B];
          else
            for (C = 0; C < d * f; C++)
              Q[C] = I;
        },
        getDataTypeArray: function(o) {
          var s;
          switch (o) {
            case 0:
              s = Int8Array;
              break;
            case 1:
              s = Uint8Array;
              break;
            case 2:
              s = Int16Array;
              break;
            case 3:
              s = Uint16Array;
              break;
            case 4:
              s = Int32Array;
              break;
            case 5:
              s = Uint32Array;
              break;
            case 6:
              s = Float32Array;
              break;
            case 7:
              s = Float64Array;
              break;
            default:
              s = Float32Array;
          }
          return s;
        },
        getPixelType: function(o) {
          var s;
          switch (o) {
            case 0:
              s = "S8";
              break;
            case 1:
              s = "U8";
              break;
            case 2:
              s = "S16";
              break;
            case 3:
              s = "U16";
              break;
            case 4:
              s = "S32";
              break;
            case 5:
              s = "U32";
              break;
            case 6:
              s = "F32";
              break;
            case 7:
              s = "F64";
              break;
            default:
              s = "F32";
          }
          return s;
        },
        isValidPixelValue: function(o, s) {
          if (s == null)
            return !1;
          var I;
          switch (o) {
            case 0:
              I = s >= -128 && s <= 127;
              break;
            case 1:
              I = s >= 0 && s <= 255;
              break;
            case 2:
              I = s >= -32768 && s <= 32767;
              break;
            case 3:
              I = s >= 0 && s <= 65536;
              break;
            case 4:
              I = s >= -2147483648 && s <= 2147483647;
              break;
            case 5:
              I = s >= 0 && s <= 4294967296;
              break;
            case 6:
              I = s >= -34027999387901484e22 && s <= 34027999387901484e22;
              break;
            case 7:
              I = s >= -17976931348623157e292 && s <= 17976931348623157e292;
              break;
            default:
              I = !1;
          }
          return I;
        },
        getDataTypeSize: function(o) {
          var s = 0;
          switch (o) {
            case 0:
            case 1:
              s = 1;
              break;
            case 2:
            case 3:
              s = 2;
              break;
            case 4:
            case 5:
            case 6:
              s = 4;
              break;
            case 7:
              s = 8;
              break;
            default:
              s = o;
          }
          return s;
        },
        getDataTypeUsed: function(o, s) {
          var I = o;
          switch (o) {
            case 2:
            case 4:
              I = o - s;
              break;
            case 3:
            case 5:
              I = o - 2 * s;
              break;
            case 6:
              s === 0 ? I = o : s === 1 ? I = 2 : I = 1;
              break;
            case 7:
              s === 0 ? I = o : I = o - 2 * s + 1;
              break;
            default:
              I = o;
              break;
          }
          return I;
        },
        getOnePixel: function(o, s, I, c) {
          var l = 0;
          switch (I) {
            case 0:
              l = c.getInt8(s);
              break;
            case 1:
              l = c.getUint8(s);
              break;
            case 2:
              l = c.getInt16(s, !0);
              break;
            case 3:
              l = c.getUint16(s, !0);
              break;
            case 4:
              l = c.getInt32(s, !0);
              break;
            case 5:
              l = c.getUInt32(s, !0);
              break;
            case 6:
              l = c.getFloat32(s, !0);
              break;
            case 7:
              l = c.getFloat64(s, !0);
              break;
            default:
              throw "the decoder does not understand this pixel type";
          }
          return l;
        },
        swapDimensionOrder: function(o, s, I, c, l) {
          var f = 0, d = 0, B = 0, C = 0, u = o;
          if (I > 1)
            if (u = new c(s * I), l)
              for (f = 0; f < s; f++)
                for (C = f, B = 0; B < I; B++, C += s)
                  u[C] = o[d++];
            else
              for (f = 0; f < s; f++)
                for (C = f, B = 0; B < I; B++, C += s)
                  u[d++] = o[C];
          return u;
        }
      }, a = function(o, s, I) {
        this.val = o, this.left = s, this.right = I;
      }, h = {
        /*
        * ********removed options compared to LERC1. We can bring some of them back if needed.
         * removed pixel type. LERC2 is typed and doesn't require user to give pixel type
         * changed encodedMaskData to maskData. LERC2 's js version make it faster to use maskData directly.
         * removed returnMask. mask is used by LERC2 internally and is cost free. In case of user input mask, it's returned as well and has neglible cost.
         * removed nodatavalue. Because LERC2 pixels are typed, nodatavalue will sacrify a useful value for many types (8bit, 16bit) etc,
         *       user has to be knowledgable enough about raster and their data to avoid usability issues. so nodata value is simply removed now.
         *       We can add it back later if their's a clear requirement.
         * removed encodedMask. This option was not implemented in LercDecode. It can be done after decoding (less efficient)
         * removed computeUsedBitDepths.
         *
         *
         * response changes compared to LERC1
         * 1. encodedMaskData is not available
         * 2. noDataValue is optional (returns only if user's noDataValue is with in the valid data type range)
         * 3. maskData is always available
        */
        /*****************
        *  public properties
        ******************/
        //HUFFMAN_LUT_BITS_MAX: 12, //use 2^12 lut, not configurable
        /*****************
        *  public methods
        *****************/
        /**
         * Decode a LERC2 byte stream and return an object containing the pixel data and optional metadata.
         *
         * @param {ArrayBuffer} input The LERC input byte stream
         * @param {object} [options] options Decoding options
         * @param {number} [options.inputOffset] The number of bytes to skip in the input byte stream. A valid LERC file is expected at that position
         * @param {boolean} [options.returnFileInfo] If true, the return value will have a fileInfo property that contains metadata obtained from the LERC headers and the decoding process
         * @param {boolean} [options.returnPixelInterleavedDims]  If true, returned dimensions are pixel-interleaved, a.k.a [p1_dim0, p1_dim1, p1_dimn, p2_dim0...], default is [p1_dim0, p2_dim0, ..., p1_dim1, p2_dim1...]
         */
        decode: function(o, s) {
          s = s || {};
          var I = s.noDataValue, c = 0, l = {};
          if (l.ptr = s.inputOffset || 0, l.pixels = {}, !!g.readHeaderInfo(o, l)) {
            var f = l.headerInfo, d = f.fileVersion, B = g.getDataTypeArray(f.imageType);
            if (d > 5)
              throw "unsupported lerc version 2." + d;
            g.readMask(o, l), f.numValidPixel !== f.width * f.height && !l.pixels.resultMask && (l.pixels.resultMask = s.maskData);
            var C = f.width * f.height;
            l.pixels.resultPixels = new B(C * f.numDims), l.counter = {
              onesweep: 0,
              uncompressed: 0,
              lut: 0,
              bitstuffer: 0,
              constant: 0,
              constantoffset: 0
            };
            var u = !s.returnPixelInterleavedDims;
            if (f.numValidPixel !== 0)
              if (f.zMax === f.zMin)
                g.constructConstantSurface(l, u);
              else if (d >= 4 && g.checkMinMaxRanges(o, l))
                g.constructConstantSurface(l, u);
              else {
                var p = new DataView(o, l.ptr, 2), Q = p.getUint8(0);
                if (l.ptr++, Q)
                  g.readDataOneSweep(o, l, B, u);
                else if (d > 1 && f.imageType <= 1 && Math.abs(f.maxZError - 0.5) < 1e-5) {
                  var D = p.getUint8(1);
                  if (l.ptr++, l.encodeMode = D, D > 2 || d < 4 && D > 1)
                    throw "Invalid Huffman flag " + D;
                  D ? g.readHuffman(o, l, B, u) : g.readTiles(o, l, B, u);
                } else
                  g.readTiles(o, l, B, u);
              }
            l.eofOffset = l.ptr;
            var E;
            s.inputOffset ? (E = l.headerInfo.blobSize + s.inputOffset - l.ptr, Math.abs(E) >= 1 && (l.eofOffset = s.inputOffset + l.headerInfo.blobSize)) : (E = l.headerInfo.blobSize - l.ptr, Math.abs(E) >= 1 && (l.eofOffset = l.headerInfo.blobSize));
            var w = {
              width: f.width,
              height: f.height,
              pixelData: l.pixels.resultPixels,
              minValue: f.zMin,
              maxValue: f.zMax,
              validPixelCount: f.numValidPixel,
              dimCount: f.numDims,
              dimStats: {
                minValues: f.minValues,
                maxValues: f.maxValues
              },
              maskData: l.pixels.resultMask
              //noDataValue: noDataValue
            };
            if (l.pixels.resultMask && g.isValidPixelValue(f.imageType, I)) {
              var y = l.pixels.resultMask;
              for (c = 0; c < C; c++)
                y[c] || (w.pixelData[c] = I);
              w.noDataValue = I;
            }
            return l.noDataValue = I, s.returnFileInfo && (w.fileInfo = g.formatFileInfo(l)), w;
          }
        },
        getBandCount: function(o) {
          var s = 0, I = 0, c = {};
          for (c.ptr = 0, c.pixels = {}; I < o.byteLength - 58; )
            g.readHeaderInfo(o, c), I += c.headerInfo.blobSize, s++, c.ptr = I;
          return s;
        }
      };
      return h;
    }(), i = function() {
      var r = new ArrayBuffer(4), g = new Uint8Array(r), a = new Uint32Array(r);
      return a[0] = 1, g[0] === 1;
    }(), n = {
      /************wrapper**********************************************/
      /**
       * A wrapper for decoding both LERC1 and LERC2 byte streams capable of handling multiband pixel blocks for various pixel types.
       *
       * @alias module:Lerc
       * @param {ArrayBuffer} input The LERC input byte stream
       * @param {object} [options] The decoding options below are optional.
       * @param {number} [options.inputOffset] The number of bytes to skip in the input byte stream. A valid Lerc file is expected at that position.
       * @param {string} [options.pixelType] (LERC1 only) Default value is F32. Valid pixel types for input are U8/S8/S16/U16/S32/U32/F32.
       * @param {number} [options.noDataValue] (LERC1 only). It is recommended to use the returned mask instead of setting this value.
       * @param {boolean} [options.returnPixelInterleavedDims] (nDim LERC2 only) If true, returned dimensions are pixel-interleaved, a.k.a [p1_dim0, p1_dim1, p1_dimn, p2_dim0...], default is [p1_dim0, p2_dim0, ..., p1_dim1, p2_dim1...]
       * @returns {{width, height, pixels, pixelType, mask, statistics}}
         * @property {number} width Width of decoded image.
         * @property {number} height Height of decoded image.
         * @property {array} pixels [band1, band2, …] Each band is a typed array of width*height.
         * @property {string} pixelType The type of pixels represented in the output.
         * @property {mask} mask Typed array with a size of width*height, or null if all pixels are valid.
         * @property {array} statistics [statistics_band1, statistics_band2, …] Each element is a statistics object representing min and max values
      **/
      decode: function(r, g) {
        if (!i)
          throw "Big endian system is not supported.";
        g = g || {};
        var a = g.inputOffset || 0, h = new Uint8Array(r, a, 10), o = String.fromCharCode.apply(null, h), s, I;
        if (o.trim() === "CntZImage")
          s = e, I = 1;
        else if (o.substring(0, 5) === "Lerc2")
          s = A, I = 2;
        else
          throw "Unexpected file identifier string: " + o;
        for (var c = 0, l = r.byteLength - 10, f, d = [], B, C, u = {
          width: 0,
          height: 0,
          pixels: [],
          pixelType: g.pixelType,
          mask: null,
          statistics: []
        }, p = 0; a < l; ) {
          var Q = s.decode(r, {
            inputOffset: a,
            //for both lerc1 and lerc2
            encodedMaskData: f,
            //lerc1 only
            maskData: C,
            //lerc2 only
            returnMask: c === 0,
            //lerc1 only
            returnEncodedMask: c === 0,
            //lerc1 only
            returnFileInfo: !0,
            //for both lerc1 and lerc2
            returnPixelInterleavedDims: g.returnPixelInterleavedDims,
            //for ndim lerc2 only
            pixelType: g.pixelType || null,
            //lerc1 only
            noDataValue: g.noDataValue || null
            //lerc1 only
          });
          a = Q.fileInfo.eofOffset, C = Q.maskData, c === 0 && (f = Q.encodedMaskData, u.width = Q.width, u.height = Q.height, u.dimCount = Q.dimCount || 1, u.pixelType = Q.pixelType || Q.fileInfo.pixelType, u.mask = C), I > 1 && (C && d.push(C), Q.fileInfo.mask && Q.fileInfo.mask.numBytes > 0 && p++), c++, u.pixels.push(Q.pixelData), u.statistics.push({
            minValue: Q.minValue,
            maxValue: Q.maxValue,
            noDataValue: Q.noDataValue,
            dimStats: Q.dimStats
          });
        }
        var D, E, w;
        if (I > 1 && p > 1) {
          for (w = u.width * u.height, u.bandMasks = d, C = new Uint8Array(w), C.set(d[0]), D = 1; D < d.length; D++)
            for (B = d[D], E = 0; E < w; E++)
              C[E] = C[E] & B[E];
          u.maskData = C;
        }
        return u;
      }
    };
    t.exports ? t.exports = n : this.Lerc = n;
  })();
})(Ti);
var $o = Ti.exports;
const Aa = /* @__PURE__ */ Xe($o);
let bA, IA, _e;
const Ge = {
  env: {
    emscripten_notify_memory_growth: function(t) {
      _e = new Uint8Array(IA.exports.memory.buffer);
    }
  }
};
class ea {
  init() {
    return bA || (typeof fetch < "u" ? bA = fetch("data:application/wasm;base64," + Ht).then((e) => e.arrayBuffer()).then((e) => WebAssembly.instantiate(e, Ge)).then(this._init) : bA = WebAssembly.instantiate(Buffer.from(Ht, "base64"), Ge).then(this._init), bA);
  }
  _init(e) {
    IA = e.instance, Ge.env.emscripten_notify_memory_growth(0);
  }
  decode(e, A = 0) {
    if (!IA) throw new Error("ZSTDDecoder: Await .init() before decoding.");
    const i = e.byteLength, n = IA.exports.malloc(i);
    _e.set(e, n), A = A || Number(IA.exports.ZSTD_findDecompressedSize(n, i));
    const r = IA.exports.malloc(A), g = IA.exports.ZSTD_decompress(r, A, n, i), a = _e.slice(r, r + g);
    return IA.exports.free(n), IA.exports.free(r), a;
  }
}
const Ht = "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IAMNACAEQQNxBEADQCACRQ0FIAAgAkF/aiICaiIDIAEgAmotAAA6AAAgA0EDcQ0ACwsgAkEDTQ0AA0AgACACQXxqIgJqIAEgAmooAgA2AgAgAkEDSw0ACwsgAkUNAgNAIAAgAkF/aiICaiABIAJqLQAAOgAAIAINAAsMAgsgAkEDTQ0AIAIhBANAIAMgASgCADYCACABQQRqIQEgA0EEaiEDIARBfGoiBEEDSw0ACyACQQNxIQILIAJFDQADQCADIAEtAAA6AAAgA0EBaiEDIAFBAWohASACQX9qIgINAAsLIAAL8wICAn8BfgJAIAJFDQAgACACaiIDQX9qIAE6AAAgACABOgAAIAJBA0kNACADQX5qIAE6AAAgACABOgABIANBfWogAToAACAAIAE6AAIgAkEHSQ0AIANBfGogAToAACAAIAE6AAMgAkEJSQ0AIABBACAAa0EDcSIEaiIDIAFB/wFxQYGChAhsIgE2AgAgAyACIARrQXxxIgRqIgJBfGogATYCACAEQQlJDQAgAyABNgIIIAMgATYCBCACQXhqIAE2AgAgAkF0aiABNgIAIARBGUkNACADIAE2AhggAyABNgIUIAMgATYCECADIAE2AgwgAkFwaiABNgIAIAJBbGogATYCACACQWhqIAE2AgAgAkFkaiABNgIAIAQgA0EEcUEYciIEayICQSBJDQAgAa0iBUIghiAFhCEFIAMgBGohAQNAIAEgBTcDGCABIAU3AxAgASAFNwMIIAEgBTcDACABQSBqIQEgAkFgaiICQR9LDQALCyAACy8BAn8gACgCBCAAKAIAQQJ0aiICLQACIQMgACACLwEAIAEgAi0AAxAIajYCACADCy8BAn8gACgCBCAAKAIAQQJ0aiICLQACIQMgACACLwEAIAEgAi0AAxAFajYCACADCx8AIAAgASACKAIEEAg2AgAgARAEGiAAIAJBCGo2AgQLCAAgAGdBH3MLugUBDX8jAEEQayIKJAACfyAEQQNNBEAgCkEANgIMIApBDGogAyAEEAsaIAAgASACIApBDGpBBBAVIgBBbCAAEAMbIAAgACAESxsMAQsgAEEAIAEoAgBBAXRBAmoQECENQVQgAygAACIGQQ9xIgBBCksNABogAiAAQQVqNgIAIAMgBGoiAkF8aiEMIAJBeWohDiACQXtqIRAgAEEGaiELQQQhBSAGQQR2IQRBICAAdCIAQQFyIQkgASgCACEPQQAhAiADIQYCQANAIAlBAkggAiAPS3JFBEAgAiEHAkAgCARAA0AgBEH//wNxQf//A0YEQCAHQRhqIQcgBiAQSQR/IAZBAmoiBigAACAFdgUgBUEQaiEFIARBEHYLIQQMAQsLA0AgBEEDcSIIQQNGBEAgBUECaiEFIARBAnYhBCAHQQNqIQcMAQsLIAcgCGoiByAPSw0EIAVBAmohBQNAIAIgB0kEQCANIAJBAXRqQQA7AQAgAkEBaiECDAELCyAGIA5LQQAgBiAFQQN1aiIHIAxLG0UEQCAHKAAAIAVBB3EiBXYhBAwCCyAEQQJ2IQQLIAYhBwsCfyALQX9qIAQgAEF/anEiBiAAQQF0QX9qIgggCWsiEUkNABogBCAIcSIEQQAgESAEIABIG2shBiALCyEIIA0gAkEBdGogBkF/aiIEOwEAIAlBASAGayAEIAZBAUgbayEJA0AgCSAASARAIABBAXUhACALQX9qIQsMAQsLAn8gByAOS0EAIAcgBSAIaiIFQQN1aiIGIAxLG0UEQCAFQQdxDAELIAUgDCIGIAdrQQN0awshBSACQQFqIQIgBEUhCCAGKAAAIAVBH3F2IQQMAQsLQWwgCUEBRyAFQSBKcg0BGiABIAJBf2o2AgAgBiAFQQdqQQN1aiADawwBC0FQCyEAIApBEGokACAACwkAQQFBBSAAGwsMACAAIAEoAAA2AAALqgMBCn8jAEHwAGsiCiQAIAJBAWohDiAAQQhqIQtBgIAEIAVBf2p0QRB1IQxBACECQQEhBkEBIAV0IglBf2oiDyEIA0AgAiAORkUEQAJAIAEgAkEBdCINai8BACIHQf//A0YEQCALIAhBA3RqIAI2AgQgCEF/aiEIQQEhBwwBCyAGQQAgDCAHQRB0QRB1ShshBgsgCiANaiAHOwEAIAJBAWohAgwBCwsgACAFNgIEIAAgBjYCACAJQQN2IAlBAXZqQQNqIQxBACEAQQAhBkEAIQIDQCAGIA5GBEADQAJAIAAgCUYNACAKIAsgAEEDdGoiASgCBCIGQQF0aiICIAIvAQAiAkEBajsBACABIAUgAhAUayIIOgADIAEgAiAIQf8BcXQgCWs7AQAgASAEIAZBAnQiAmooAgA6AAIgASACIANqKAIANgIEIABBAWohAAwBCwsFIAEgBkEBdGouAQAhDUEAIQcDQCAHIA1ORQRAIAsgAkEDdGogBjYCBANAIAIgDGogD3EiAiAISw0ACyAHQQFqIQcMAQsLIAZBAWohBgwBCwsgCkHwAGokAAsjAEIAIAEQCSAAhUKHla+vmLbem55/fkLj3MqV/M7y9YV/fAsQACAAQn43AwggACABNgIACyQBAX8gAARAIAEoAgQiAgRAIAEoAgggACACEQEADwsgABAmCwsfACAAIAEgAi8BABAINgIAIAEQBBogACACQQRqNgIEC0oBAX9BoCAoAgAiASAAaiIAQX9MBEBBiCBBMDYCAEF/DwsCQCAAPwBBEHRNDQAgABBmDQBBiCBBMDYCAEF/DwtBoCAgADYCACABC9cBAQh/Qbp/IQoCQCACKAIEIgggAigCACIJaiIOIAEgAGtLDQBBbCEKIAkgBCADKAIAIgtrSw0AIAAgCWoiBCACKAIIIgxrIQ0gACABQWBqIg8gCyAJQQAQKSADIAkgC2o2AgACQAJAIAwgBCAFa00EQCANIQUMAQsgDCAEIAZrSw0CIAcgDSAFayIAaiIBIAhqIAdNBEAgBCABIAgQDxoMAgsgBCABQQAgAGsQDyEBIAIgACAIaiIINgIEIAEgAGshBAsgBCAPIAUgCEEBECkLIA4hCgsgCgubAgEBfyMAQYABayINJAAgDSADNgJ8AkAgAkEDSwRAQX8hCQwBCwJAAkACQAJAIAJBAWsOAwADAgELIAZFBEBBuH8hCQwEC0FsIQkgBS0AACICIANLDQMgACAHIAJBAnQiAmooAgAgAiAIaigCABA7IAEgADYCAEEBIQkMAwsgASAJNgIAQQAhCQwCCyAKRQRAQWwhCQwCC0EAIQkgC0UgDEEZSHINAUEIIAR0QQhqIQBBACECA0AgAiAATw0CIAJBQGshAgwAAAsAC0FsIQkgDSANQfwAaiANQfgAaiAFIAYQFSICEAMNACANKAJ4IgMgBEsNACAAIA0gDSgCfCAHIAggAxAYIAEgADYCACACIQkLIA1BgAFqJAAgCQsLACAAIAEgAhALGgsQACAALwAAIAAtAAJBEHRyCy8AAn9BuH8gAUEISQ0AGkFyIAAoAAQiAEF3Sw0AGkG4fyAAQQhqIgAgACABSxsLCwkAIAAgATsAAAsDAAELigYBBX8gACAAKAIAIgVBfnE2AgBBACAAIAVBAXZqQYQgKAIAIgQgAEYbIQECQAJAIAAoAgQiAkUNACACKAIAIgNBAXENACACQQhqIgUgA0EBdkF4aiIDQQggA0EISxtnQR9zQQJ0QYAfaiIDKAIARgRAIAMgAigCDDYCAAsgAigCCCIDBEAgAyACKAIMNgIECyACKAIMIgMEQCADIAIoAgg2AgALIAIgAigCACAAKAIAQX5xajYCAEGEICEAAkACQCABRQ0AIAEgAjYCBCABKAIAIgNBAXENASADQQF2QXhqIgNBCCADQQhLG2dBH3NBAnRBgB9qIgMoAgAgAUEIakYEQCADIAEoAgw2AgALIAEoAggiAwRAIAMgASgCDDYCBAsgASgCDCIDBEAgAyABKAIINgIAQYQgKAIAIQQLIAIgAigCACABKAIAQX5xajYCACABIARGDQAgASABKAIAQQF2akEEaiEACyAAIAI2AgALIAIoAgBBAXZBeGoiAEEIIABBCEsbZ0Efc0ECdEGAH2oiASgCACEAIAEgBTYCACACIAA2AgwgAkEANgIIIABFDQEgACAFNgIADwsCQCABRQ0AIAEoAgAiAkEBcQ0AIAJBAXZBeGoiAkEIIAJBCEsbZ0Efc0ECdEGAH2oiAigCACABQQhqRgRAIAIgASgCDDYCAAsgASgCCCICBEAgAiABKAIMNgIECyABKAIMIgIEQCACIAEoAgg2AgBBhCAoAgAhBAsgACAAKAIAIAEoAgBBfnFqIgI2AgACQCABIARHBEAgASABKAIAQQF2aiAANgIEIAAoAgAhAgwBC0GEICAANgIACyACQQF2QXhqIgFBCCABQQhLG2dBH3NBAnRBgB9qIgIoAgAhASACIABBCGoiAjYCACAAIAE2AgwgAEEANgIIIAFFDQEgASACNgIADwsgBUEBdkF4aiIBQQggAUEISxtnQR9zQQJ0QYAfaiICKAIAIQEgAiAAQQhqIgI2AgAgACABNgIMIABBADYCCCABRQ0AIAEgAjYCAAsLDgAgAARAIABBeGoQJQsLgAIBA38CQCAAQQ9qQXhxQYQgKAIAKAIAQQF2ayICEB1Bf0YNAAJAQYQgKAIAIgAoAgAiAUEBcQ0AIAFBAXZBeGoiAUEIIAFBCEsbZ0Efc0ECdEGAH2oiASgCACAAQQhqRgRAIAEgACgCDDYCAAsgACgCCCIBBEAgASAAKAIMNgIECyAAKAIMIgFFDQAgASAAKAIINgIAC0EBIQEgACAAKAIAIAJBAXRqIgI2AgAgAkEBcQ0AIAJBAXZBeGoiAkEIIAJBCEsbZ0Efc0ECdEGAH2oiAygCACECIAMgAEEIaiIDNgIAIAAgAjYCDCAAQQA2AgggAkUNACACIAM2AgALIAELtwIBA38CQAJAIABBASAAGyICEDgiAA0AAkACQEGEICgCACIARQ0AIAAoAgAiA0EBcQ0AIAAgA0EBcjYCACADQQF2QXhqIgFBCCABQQhLG2dBH3NBAnRBgB9qIgEoAgAgAEEIakYEQCABIAAoAgw2AgALIAAoAggiAQRAIAEgACgCDDYCBAsgACgCDCIBBEAgASAAKAIINgIACyACECchAkEAIQFBhCAoAgAhACACDQEgACAAKAIAQX5xNgIAQQAPCyACQQ9qQXhxIgMQHSICQX9GDQIgAkEHakF4cSIAIAJHBEAgACACaxAdQX9GDQMLAkBBhCAoAgAiAUUEQEGAICAANgIADAELIAAgATYCBAtBhCAgADYCACAAIANBAXRBAXI2AgAMAQsgAEUNAQsgAEEIaiEBCyABC7kDAQJ/IAAgA2ohBQJAIANBB0wEQANAIAAgBU8NAiAAIAItAAA6AAAgAEEBaiEAIAJBAWohAgwAAAsACyAEQQFGBEACQCAAIAJrIgZBB00EQCAAIAItAAA6AAAgACACLQABOgABIAAgAi0AAjoAAiAAIAItAAM6AAMgAEEEaiACIAZBAnQiBkHAHmooAgBqIgIQFyACIAZB4B5qKAIAayECDAELIAAgAhAMCyACQQhqIQIgAEEIaiEACwJAAkACQAJAIAUgAU0EQCAAIANqIQEgBEEBRyAAIAJrQQ9Kcg0BA0AgACACEAwgAkEIaiECIABBCGoiACABSQ0ACwwFCyAAIAFLBEAgACEBDAQLIARBAUcgACACa0EPSnINASAAIQMgAiEEA0AgAyAEEAwgBEEIaiEEIANBCGoiAyABSQ0ACwwCCwNAIAAgAhAHIAJBEGohAiAAQRBqIgAgAUkNAAsMAwsgACEDIAIhBANAIAMgBBAHIARBEGohBCADQRBqIgMgAUkNAAsLIAIgASAAa2ohAgsDQCABIAVPDQEgASACLQAAOgAAIAFBAWohASACQQFqIQIMAAALAAsLQQECfyAAIAAoArjgASIDNgLE4AEgACgCvOABIQQgACABNgK84AEgACABIAJqNgK44AEgACABIAQgA2tqNgLA4AELpgEBAX8gACAAKALs4QEQFjYCyOABIABCADcD+OABIABCADcDuOABIABBwOABakIANwMAIABBqNAAaiIBQYyAgOAANgIAIABBADYCmOIBIABCADcDiOEBIABCAzcDgOEBIABBrNABakHgEikCADcCACAAQbTQAWpB6BIoAgA2AgAgACABNgIMIAAgAEGYIGo2AgggACAAQaAwajYCBCAAIABBEGo2AgALYQEBf0G4fyEDAkAgAUEDSQ0AIAIgABAhIgFBA3YiADYCCCACIAFBAXE2AgQgAiABQQF2QQNxIgM2AgACQCADQX9qIgFBAksNAAJAIAFBAWsOAgEAAgtBbA8LIAAhAwsgAwsMACAAIAEgAkEAEC4LiAQCA38CfiADEBYhBCAAQQBBKBAQIQAgBCACSwRAIAQPCyABRQRAQX8PCwJAAkAgA0EBRg0AIAEoAAAiBkGo6r5pRg0AQXYhAyAGQXBxQdDUtMIBRw0BQQghAyACQQhJDQEgAEEAQSgQECEAIAEoAAQhASAAQQE2AhQgACABrTcDAEEADwsgASACIAMQLyIDIAJLDQAgACADNgIYQXIhAyABIARqIgVBf2otAAAiAkEIcQ0AIAJBIHEiBkUEQEFwIQMgBS0AACIFQacBSw0BIAVBB3GtQgEgBUEDdkEKaq2GIgdCA4h+IAd8IQggBEEBaiEECyACQQZ2IQMgAkECdiEFAkAgAkEDcUF/aiICQQJLBEBBACECDAELAkACQAJAIAJBAWsOAgECAAsgASAEai0AACECIARBAWohBAwCCyABIARqLwAAIQIgBEECaiEEDAELIAEgBGooAAAhAiAEQQRqIQQLIAVBAXEhBQJ+AkACQAJAIANBf2oiA0ECTQRAIANBAWsOAgIDAQtCfyAGRQ0DGiABIARqMQAADAMLIAEgBGovAACtQoACfAwCCyABIARqKAAArQwBCyABIARqKQAACyEHIAAgBTYCICAAIAI2AhwgACAHNwMAQQAhAyAAQQA2AhQgACAHIAggBhsiBzcDCCAAIAdCgIAIIAdCgIAIVBs+AhALIAMLWwEBf0G4fyEDIAIQFiICIAFNBH8gACACakF/ai0AACIAQQNxQQJ0QaAeaigC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C0Egak8NAQsgByAHKQNoNwMQIAcgBykDYDcDCCAEIA0gB0EIaiAHQdwAaiAPIA4gESAQEB4hCwwBCyACIARqIQggBCAKEAcgAkERTwRAIARBEGohAgNAIAIgCkEQaiIKEAcgAkEQaiICIAhJDQALCyAIIAlrIQIgByATNgJcIAkgCCAOa0sEQCAJIAggEWtLBEBBbCELDAILIBAgAiAOayICaiIKIANqIBBNBEAgCCAKIAMQDxoMAgsgCCAKQQAgAmsQDyEIIAcgAiADaiIDNgJkIAggAmshCCAOIQILIAlBEE8EQCADIAhqIQMDQCAIIAIQByACQRBqIQIgCEEQaiIIIANJDQALDAELAkAgCUEHTQRAIAggAi0AADoAACAIIAItAAE6AAEgCCACLQACOgACIAggAi0AAzoAAyAIQQRqIAIgCUECdCIDQcAeaigCAGoiAhAXIAIgA0HgHmooAgBrIQIgBygCZCEDDAELIAggAhAMCyADQQlJDQAgAyAIaiEDIAhBCGoiCCACQQhqIgJrQQ9MBEADQCAIIAIQDCACQQhqIQIgCEEIaiIIIANJDQAMAgALAAsDQCAIIAIQByACQRBqIQIgCEEQaiIIIANJDQALCyAHQRhqEAQaIAsgDCALEAMiAhshDCAEIAQgC2ogAhshBCAFQX9qIgUNAAsgDBADDQFBbCEMIAdBGGoQBEECSQ0BQQAhCANAIAhBA0cEQCAAIAhBAnQiAmpBrNABaiACIAdqKAJENgIAIAhBAWohCAwBCwsgBygCXCEIC0G6fyEMIA8gCGsiACANIARrSw0AIAQEfyAEIAggABALIABqBUEACyABayEMCyAHQfAAaiQAIAwLkRcCFn8FfiMAQdABayIHJAAgByAAKALw4QEiCDYCvAEgASACaiESIAggACgCgOIBaiETAkACQCAFRQRAIAEhAwwBCyAAKALE4AEhESAAKALA4AEhFSAAKAK84AEhDyAAQQE2AozhAUEAIQgDQCAIQQNHBEAgByAIQQJ0IgJqIAAgAmpBrNABaigCADYCVCAIQQFqIQgMAQsLIAcgETYCZCAHIA82AmAgByABIA9rNgJoQWwhECAHQShqIAMgBBAGEAMNASAFQQQgBUEESBshFyAHQTxqIAdBKGogACgCABATIAdBxABqIAdBKGogACgCCBATIAdBzABqIAdB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IAdB0AFqJAAgEAslACAAQgA3AgAgAEEAOwEIIABBADoACyAAIAE2AgwgACACOgAKC7QFAQN/IwBBMGsiBCQAIABB/wFqIgVBfWohBgJAIAMvAQIEQCAEQRhqIAEgAhAGIgIQAw0BIARBEGogBEEYaiADEBwgBEEIaiAEQRhqIAMQHCAAIQMDQAJAIARBGGoQBCADIAZPckUEQCADIARBEGogBEEYahASOgAAIAMgBEEIaiAEQRhqEBI6AAEgBEEYahAERQ0BIANBAmohAwsgBUF+aiEFAn8DQEG6fyECIAMiASAFSw0FIAEgBEEQaiAEQRhqEBI6AAAgAUEBaiEDIARBGGoQBEEDRgRAQQIhAiAEQQhqDAILIAMgBUsNBSABIARBCGogBEEYahASOgABIAFBAmohA0EDIQIgBEEYahAEQQNHDQALIARBEGoLIQUgAyAFIARBGGoQEjoAACABIAJqIABrIQIMAwsgAyAEQRBqIARBGGoQEjoAAiADIARBCGogBEEYahASOgADIANBBGohAwwAAAsACyAEQRhqIAEgAhAGIgIQAw0AIARBEGogBEEYaiADEBwgBEEIaiAEQRhqIAMQHCAAIQMDQAJAIARBGGoQBCADIAZPckUEQCADIARBEGogBEEYahAROgAAIAMgBEEIaiAEQRhqEBE6AAEgBEEYahAERQ0BIANBAmohAwsgBUF+aiEFAn8DQEG6fyECIAMiASAFSw0EIAEgBEEQaiAEQRhqEBE6AAAgAUEBaiEDIARBGGoQBEEDRgRAQQIhAiAEQQhqDAILIAMgBUsNBCABIARBCGogBEEYahAROgABIAFBAmohA0EDIQIgBEEYahAEQQNHDQALIARBEGoLIQUgAyAFIARBGGoQEToAACABIAJqIABrIQIMAgsgAyAEQRBqIARBGGoQEToAAiADIARBCGogBEEYahAROgADIANBBGohAwwAAAsACyAEQTBqJAAgAgtpAQF/An8CQAJAIAJBB00NACABKAAAQbfIwuF+Rw0AIAAgASgABDYCmOIBQWIgAEEQaiABIAIQPiIDEAMNAhogAEKBgICAEDcDiOEBIAAgASADaiACIANrECoMAQsgACABIAIQKgtBAAsLrQMBBn8jAEGAAWsiAyQAQWIhCAJAIAJBCUkNACAAQZjQAGogAUEIaiIEIAJBeGogAEGY0AAQMyIFEAMiBg0AIANBHzYCfCADIANB/ABqIANB+ABqIAQgBCAFaiAGGyIEIAEgAmoiAiAEaxAVIgUQAw0AIAMoAnwiBkEfSw0AIAMoAngiB0EJTw0AIABBiCBqIAMgBkGAC0GADCAHEBggA0E0NgJ8IAMgA0H8AGogA0H4AGogBCAFaiIEIAIgBGsQFSIFEAMNACADKAJ8IgZBNEsNACADKAJ4IgdBCk8NACAAQZAwaiADIAZBgA1B4A4gBxAYIANBIzYCfCADIANB/ABqIANB+ABqIAQgBWoiBCACIARrEBUiBRADDQAgAygCfCIGQSNLDQAgAygCeCIHQQpPDQAgACADIAZBwBBB0BEgBxAYIAQgBWoiBEEMaiIFIAJLDQAgAiAFayEFQQAhAgNAIAJBA0cEQCAEKAAAIgZBf2ogBU8NAiAAIAJBAnRqQZzQAWogBjYCACACQQFqIQIgBEEEaiEEDAELCyAEIAFrIQgLIANBgAFqJAAgCAtGAQN/IABBCGohAyAAKAIEIQJBACEAA0AgACACdkUEQCABIAMgAEEDdGotAAJBFktqIQEgAEEBaiEADAELCyABQQggAmt0C4YDAQV/Qbh/IQcCQCADRQ0AIAItAAAiBEUEQCABQQA2AgBBAUG4fyADQQFGGw8LAn8gAkEBaiIFIARBGHRBGHUiBkF/Sg0AGiAGQX9GBEAgA0EDSA0CIAUvAABBgP4BaiEEIAJBA2oMAQsgA0ECSA0BIAItAAEgBEEIdHJBgIB+aiEEIAJBAmoLIQUgASAENgIAIAVBAWoiASACIANqIgNLDQBBbCEHIABBEGogACAFLQAAIgVBBnZBI0EJIAEgAyABa0HAEEHQEUHwEiAAKAKM4QEgACgCnOIBIAQQHyIGEAMiCA0AIABBmCBqIABBCGogBUEEdkEDcUEfQQggASABIAZqIAgbIgEgAyABa0GAC0GADEGAFyAAKAKM4QEgACgCnOIBIAQQHyIGEAMiCA0AIABBoDBqIABBBGogBUECdkEDcUE0QQkgASABIAZqIAgbIgEgAyABa0GADUHgDkGQGSAAKAKM4QEgACgCnOIBIAQQHyIAEAMNACAAIAFqIAJrIQcLIAcLrQMBCn8jAEGABGsiCCQAAn9BUiACQf8BSw0AGkFUIANBDEsNABogAkEBaiELIABBBGohCUGAgAQgA0F/anRBEHUhCkEAIQJBASEEQQEgA3QiB0F/aiIMIQUDQCACIAtGRQRAAkAgASACQQF0Ig1qLwEAIgZB//8DRgRAIAkgBUECdGogAjoAAiAFQX9qIQVBASEGDAELIARBACAKIAZBEHRBEHVKGyEECyAIIA1qIAY7AQAgAkEBaiECDAELCyAAIAQ7AQIgACADOwEAIAdBA3YgB0EBdmpBA2ohBkEAIQRBACECA0AgBCALRkUEQCABIARBAXRqLgEAIQpBACEAA0AgACAKTkUEQCAJIAJBAnRqIAQ6AAIDQCACIAZqIAxxIgIgBUsNAAsgAEEBaiEADAELCyAEQQFqIQQMAQsLQX8gAg0AGkEAIQIDfyACIAdGBH9BAAUgCCAJIAJBAnRqIgAtAAJBAXRqIgEgAS8BACIBQQFqOwEAIAAgAyABEBRrIgU6AAMgACABIAVB/wFxdCAHazsBACACQQFqIQIMAQsLCyEFIAhBgARqJAAgBQvjBgEIf0FsIQcCQCACQQNJDQACQAJAAkACQCABLQAAIgNBA3EiCUEBaw4DAwEAAgsgACgCiOEBDQBBYg8LIAJBBUkNAkEDIQYgASgAACEFAn8CQAJAIANBAnZBA3EiCEF+aiIEQQFNBEAgBEEBaw0BDAILIAVBDnZB/wdxIQQgBUEEdkH/B3EhAyAIRQwCCyAFQRJ2IQRBBCEGIAVBBHZB//8AcSEDQQAMAQsgBUEEdkH//w9xIgNBgIAISw0DIAEtAARBCnQgBUEWdnIhBEEFIQZBAAshBSAEIAZqIgogAksNAgJAIANBgQZJDQAgACgCnOIBRQ0AQQAhAgNAIAJBg4ABSw0BIAJBQGshAgwAAAsACwJ/IAlBA0YEQCABIAZqIQEgAEHw4gFqIQIgACgCDCEGIAUEQCACIAMgASAEIAYQXwwCCyACIAMgASAEIAYQXQwBCyAAQbjQAWohAiABIAZqIQEgAEHw4gFqIQYgAEGo0ABqIQggBQRAIAggBiADIAEgBCACEF4MAQsgCCAGIAMgASAEIAIQXAsQAw0CIAAgAzYCgOIBIABBATYCiOEBIAAgAEHw4gFqNgLw4QEgCUECRgRAIAAgAEGo0ABqNgIMCyAAIANqIgBBiOMBakIANwAAIABBgOMBakIANwAAIABB+OIBakIANwAAIABB8OIBakIANwAAIAoPCwJ/AkACQAJAIANBAnZBA3FBf2oiBEECSw0AIARBAWsOAgACAQtBASEEIANBA3YMAgtBAiEEIAEvAABBBHYMAQtBAyEEIAEQIUEEdgsiAyAEaiIFQSBqIAJLBEAgBSACSw0CIABB8OIBaiABIARqIAMQCyEBIAAgAzYCgOIBIAAgATYC8OEBIAEgA2oiAEIANwAYIABCADcAECAAQgA3AAggAEIANwAAIAUPCyAAIAM2AoDiASAAIAEgBGo2AvDhASAFDwsCfwJAAkACQCADQQJ2QQNxQX9qIgRBAksNACAEQQFrDgIAAgELQQEhByADQQN2DAILQQIhByABLwAAQQR2DAELIAJBBEkgARAhIgJBj4CAAUtyDQFBAyEHIAJBBHYLIQIgAEHw4gFqIAEgB2otAAAgAkEgahAQIQEgACACNgKA4gEgACABNgLw4QEgB0EBaiEHCyAHC0sAIABC+erQ0OfJoeThADcDICAAQgA3AxggAELP1tO+0ser2UI3AxAgAELW64Lu6v2J9eAANwMIIABCADcDACAAQShqQQBBKBAQGgviAgICfwV+IABBKGoiASAAKAJIaiECAn4gACkDACIDQiBaBEAgACkDECIEQgeJIAApAwgiBUIBiXwgACkDGCIGQgyJfCAAKQMgIgdCEol8IAUQGSAEEBkgBhAZIAcQGQwBCyAAKQMYQsXP2bLx5brqJ3wLIAN8IQMDQCABQQhqIgAgAk0EQEIAIAEpAAAQCSADhUIbiUKHla+vmLbem55/fkLj3MqV/M7y9YV/fCEDIAAhAQwBCwsCQCABQQRqIgAgAksEQCABIQAMAQsgASgAAK1Ch5Wvr5i23puef34gA4VCF4lCz9bTvtLHq9lCfkL5893xmfaZqxZ8IQMLA0AgACACSQRAIAAxAABCxc/ZsvHluuonfiADhUILiUKHla+vmLbem55/fiEDIABBAWohAAwBCwsgA0IhiCADhULP1tO+0ser2UJ+IgNCHYggA4VC+fPd8Zn2masWfiIDQiCIIAOFC+8CAgJ/BH4gACAAKQMAIAKtfDcDAAJAAkAgACgCSCIDIAJqIgRBH00EQCABRQ0BIAAgA2pBKGogASACECAgACgCSCACaiEEDAELIAEgAmohAgJ/IAMEQCAAQShqIgQgA2ogAUEgIANrECAgACAAKQMIIAQpAAAQCTcDCCAAIAApAxAgACkAMBAJNwMQIAAgACkDGCAAKQA4EAk3AxggACAAKQMgIABBQGspAAAQCTcDICAAKAJIIQMgAEEANgJIIAEgA2tBIGohAQsgAUEgaiACTQsEQCACQWBqIQMgACkDICEFIAApAxghBiAAKQMQIQcgACkDCCEIA0AgCCABKQAAEAkhCCAHIAEpAAgQCSEHIAYgASkAEBAJIQYgBSABKQAYEAkhBSABQSBqIgEgA00NAAsgACAFNwMgIAAgBjcDGCAAIAc3AxAgACAINwMICyABIAJPDQEgAEEoaiABIAIgAWsiBBAgCyAAIAQ2AkgLCy8BAX8gAEUEQEG2f0EAIAMbDwtBun8hBCADIAFNBH8gACACIAMQEBogAwVBun8LCy8BAX8gAEUEQEG2f0EAIAMbDwtBun8hBCADIAFNBH8gACACIAMQCxogAwVBun8LC6gCAQZ/IwBBEGsiByQAIABB2OABaikDAEKAgIAQViEIQbh/IQUCQCAEQf//B0sNACAAIAMgBBBCIgUQAyIGDQAgACgCnOIBIQkgACAHQQxqIAMgAyAFaiAGGyIKIARBACAFIAYbayIGEEAiAxADBEAgAyEFDAELIAcoAgwhBCABRQRAQbp/IQUgBEEASg0BCyAGIANrIQUgAyAKaiEDAkAgCQRAIABBADYCnOIBDAELAkACQAJAIARBBUgNACAAQdjgAWopAwBCgICACFgNAAwBCyAAQQA2ApziAQwBCyAAKAIIED8hBiAAQQA2ApziASAGQRRPDQELIAAgASACIAMgBSAEIAgQOSEFDAELIAAgASACIAMgBSAEIAgQOiEFCyAHQRBqJAAgBQtnACAAQdDgAWogASACIAAoAuzhARAuIgEQAwRAIAEPC0G4fyECAkAgAQ0AIABB7OABaigCACIBBEBBYCECIAAoApjiASABRw0BC0EAIQIgAEHw4AFqKAIARQ0AIABBkOEBahBDCyACCycBAX8QVyIERQRAQUAPCyAEIAAgASACIAMgBBBLEE8hACAEEFYgAAs/AQF/AkACQAJAIAAoAqDiAUEBaiIBQQJLDQAgAUEBaw4CAAECCyAAEDBBAA8LIABBADYCoOIBCyAAKAKU4gELvAMCB38BfiMAQRBrIgkkAEG4fyEGAkAgBCgCACIIQQVBCSAAKALs4QEiBRtJDQAgAygCACIHQQFBBSAFGyAFEC8iBRADBEAgBSEGDAELIAggBUEDakkNACAAIAcgBRBJIgYQAw0AIAEgAmohCiAAQZDhAWohCyAIIAVrIQIgBSAHaiEHIAEhBQNAIAcgAiAJECwiBhADDQEgAkF9aiICIAZJBEBBuH8hBgwCCyAJKAIAIghBAksEQEFsIQYMAgsgB0EDaiEHAn8CQAJAAkAgCEEBaw4CAgABCyAAIAUgCiAFayAHIAYQSAwCCyAFIAogBWsgByAGEEcMAQsgBSAKIAVrIActAAAgCSgCCBBGCyIIEAMEQCAIIQYMAgsgACgC8OABBEAgCyAFIAgQRQsgAiAGayECIAYgB2ohByAFIAhqIQUgCSgCBEUNAAsgACkD0OABIgxCf1IEQEFsIQYgDCAFIAFrrFINAQsgACgC8OABBEBBaiEGIAJBBEkNASALEEQhDCAHKAAAIAynRw0BIAdBBGohByACQXxqIQILIAMgBzYCACAEIAI2AgAgBSABayEGCyAJQRBqJAAgBgsuACAAECsCf0EAQQAQAw0AGiABRSACRXJFBEBBYiAAIAEgAhA9EAMNARoLQQALCzcAIAEEQCAAIAAoAsTgASABKAIEIAEoAghqRzYCnOIBCyAAECtBABADIAFFckUEQCAAIAEQWwsL0QIBB38jAEEQayIGJAAgBiAENgIIIAYgAzYCDCAFBEAgBSgCBCEKIAUoAgghCQsgASEIAkACQANAIAAoAuzhARAWIQsCQANAIAQgC0kNASADKAAAQXBxQdDUtMIBRgRAIAMgBBAiIgcQAw0EIAQgB2shBCADIAdqIQMMAQsLIAYgAzYCDCAGIAQ2AggCQCAFBEAgACAFEE5BACEHQQAQA0UNAQwFCyAAIAogCRBNIgcQAw0ECyAAIAgQUCAMQQFHQQAgACAIIAIgBkEMaiAGQQhqEEwiByIDa0EAIAMQAxtBCkdyRQRAQbh/IQcMBAsgBxADDQMgAiAHayECIAcgCGohCEEBIQwgBigCDCEDIAYoAgghBAwBCwsgBiADNgIMIAYgBDYCCEG4fyEHIAQNASAIIAFrIQcMAQsgBiADNgIMIAYgBDYCCAsgBkEQaiQAIAcLRgECfyABIAAoArjgASICRwRAIAAgAjYCxOABIAAgATYCuOABIAAoArzgASEDIAAgATYCvOABIAAgASADIAJrajYCwOABCwutAgIEfwF+IwBBQGoiBCQAAkACQCACQQhJDQAgASgAAEFwcUHQ1LTCAUcNACABIAIQIiEBIABCADcDCCAAQQA2AgQgACABNgIADAELIARBGGogASACEC0iAxADBEAgACADEBoMAQsgAwRAIABBuH8QGgwBCyACIAQoAjAiA2shAiABIANqIQMDQAJAIAAgAyACIARBCGoQLCIFEAMEfyAFBSACIAVBA2oiBU8NAUG4fwsQGgwCCyAGQQFqIQYgAiAFayECIAMgBWohAyAEKAIMRQ0ACyAEKAI4BEAgAkEDTQRAIABBuH8QGgwCCyADQQRqIQMLIAQoAighAiAEKQMYIQcgAEEANgIEIAAgAyABazYCACAAIAIgBmytIAcgB0J/URs3AwgLIARBQGskAAslAQF/IwBBEGsiAiQAIAIgACABEFEgAigCACEAIAJBEGokACAAC30BBH8jAEGQBGsiBCQAIARB/wE2AggCQCAEQRBqIARBCGogBEEMaiABIAIQFSIGEAMEQCAGIQUMAQtBVCEFIAQoAgwiB0EGSw0AIAMgBEEQaiAEKAIIIAcQQSIFEAMNACAAIAEgBmogAiAGayADEDwhBQsgBEGQBGokACAFC4cBAgJ/An5BABAWIQMCQANAIAEgA08EQAJAIAAoAABBcHFB0NS0wgFGBEAgACABECIiAhADRQ0BQn4PCyAAIAEQVSIEQn1WDQMgBCAFfCIFIARUIQJCfiEEIAINAyAAIAEQUiICEAMNAwsgASACayEBIAAgAmohAAwBCwtCfiAFIAEbIQQLIAQLPwIBfwF+IwBBMGsiAiQAAn5CfiACQQhqIAAgARAtDQAaQgAgAigCHEEBRg0AGiACKQMICyEDIAJBMGokACADC40BAQJ/IwBBMGsiASQAAkAgAEUNACAAKAKI4gENACABIABB/OEBaigCADYCKCABIAApAvThATcDICAAEDAgACgCqOIBIQIgASABKAIoNgIYIAEgASkDIDcDECACIAFBEGoQGyAAQQA2AqjiASABIAEoAig2AgggASABKQMgNwMAIAAgARAbCyABQTBqJAALKgECfyMAQRBrIgAkACAAQQA2AgggAEIANwMAIAAQWCEBIABBEGokACABC4cBAQN/IwBBEGsiAiQAAkAgACgCAEUgACgCBEVzDQAgAiAAKAIINgIIIAIgACkCADcDAAJ/IAIoAgAiAQRAIAIoAghBqOMJIAERBQAMAQtBqOMJECgLIgFFDQAgASAAKQIANwL04QEgAUH84QFqIAAoAgg2AgAgARBZIAEhAwsgAkEQaiQAIAMLywEBAn8jAEEgayIBJAAgAEGBgIDAADYCtOIBIABBADYCiOIBIABBADYC7OEBIABCADcDkOIBIABBADYCpOMJIABBADYC3OIBIABCADcCzOIBIABBADYCvOIBIABBADYCxOABIABCADcCnOIBIABBpOIBakIANwIAIABBrOIBakEANgIAIAFCADcCECABQgA3AhggASABKQMYNwMIIAEgASkDEDcDACABKAIIQQh2QQFxIQIgAEEANgLg4gEgACACNgKM4gEgAUEgaiQAC3YBA38jAEEwayIBJAAgAARAIAEgAEHE0AFqIgIoAgA2AiggASAAKQK80AE3AyAgACgCACEDIAEgAigCADYCGCABIAApArzQATcDECADIAFBEGoQGyABIAEoAig2AgggASABKQMgNwMAIAAgARAbCyABQTBqJAALzAEBAX8gACABKAK00AE2ApjiASAAIAEoAgQiAjYCwOABIAAgAjYCvOABIAAgAiABKAIIaiICNgK44AEgACACNgLE4AEgASgCuNABBEAgAEKBgICAEDcDiOEBIAAgAUGk0ABqNgIMIAAgAUGUIGo2AgggACABQZwwajYCBCAAIAFBDGo2AgAgAEGs0AFqIAFBqNABaigCADYCACAAQbDQAWogAUGs0AFqKAIANgIAIABBtNABaiABQbDQAWooAgA2AgAPCyAAQgA3A4jhAQs7ACACRQRAQbp/DwsgBEUEQEFsDwsgAiAEEGAEQCAAIAEgAiADIAQgBRBhDwsgACABIAIgAyAEIAUQZQtGAQF/IwBBEGsiBSQAIAVBCGogBBAOAn8gBS0ACQRAIAAgASACIAMgBBAyDAELIAAgASACIAMgBBA0CyEAIAVBEGokACAACzQAIAAgAyAEIAUQNiIFEAMEQCAFDwsgBSAESQR/IAEgAiADIAVqIAQgBWsgABA1BUG4fwsLRgEBfyMAQRBrIgUkACAFQQhqIAQQDgJ/IAUtAAkEQCAAIAEgAiADIAQQYgwBCyAAIAEgAiADIAQQNQshACAFQRBqJAAgAAtZAQF/QQ8hAiABIABJBEAgAUEE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", qi = new ea();
class ta extends dA {
  constructor(e) {
    super(), this.planarConfiguration = typeof e.PlanarConfiguration < "u" ? e.PlanarConfiguration : 1, this.samplesPerPixel = typeof e.SamplesPerPixel < "u" ? e.SamplesPerPixel : 1, this.addCompression = e.LercParameters[vn.AddCompression];
  }
  decodeBlock(e) {
    switch (this.addCompression) {
      case Be.None:
        break;
      case Be.Deflate:
        e = Ni(new Uint8Array(e)).buffer;
        break;
      case Be.Zstandard:
        e = qi.decode(new Uint8Array(e)).buffer;
        break;
      default:
        throw new Error(`Unsupported LERC additional compression method identifier: ${this.addCompression}`);
    }
    return Aa.decode(e, { returnPixelInterleavedDims: this.planarConfiguration === 1 }).pixels[0].buffer;
  }
}
const ia = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ta,
  zstd: qi
}, Symbol.toStringTag, { value: "Module" }));
class na extends dA {
  constructor() {
    if (super(), typeof createImageBitmap > "u")
      throw new Error("Cannot decode WebImage as `createImageBitmap` is not available");
    if (typeof document > "u" && typeof OffscreenCanvas > "u")
      throw new Error("Cannot decode WebImage as neither `document` nor `OffscreenCanvas` is not available");
  }
  async decode(e, A) {
    const i = new Blob([A]), n = await createImageBitmap(i);
    let r;
    typeof document < "u" ? (r = document.createElement("canvas"), r.width = n.width, r.height = n.height) : r = new OffscreenCanvas(n.width, n.height);
    const g = r.getContext("2d");
    return g.drawImage(n, 0, 0), g.getImageData(0, 0, n.width, n.height).data.buffer;
  }
}
const ra = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: na
}, Symbol.toStringTag, { value: "Module" }));
export {
  os as Compass,
  Ia as GeoJSONLoader,
  la as GeoJSONSource,
  fa as MVTLoader,
  ca as MVTSource,
  aa as SingleImageSource,
  Er as TifDEMLoder,
  ga as TifDemSource,
  Ba as createCompass,
  ha as mapSource
};
