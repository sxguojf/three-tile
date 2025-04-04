import { TileCanvasLoader as Et, registerImgLoader as UA, LoaderFactory as Qt, TileMaterial as ni, TileSource as Z, TileGeometry as ri, registerDEMLoader as oi } from "three-tile";
import { MeshNormalMaterial as si, ImageLoader as ai, Texture as gi, SRGBColorSpace as Ii, FileLoader as Bi, MathUtils as li, Color as Ci, MeshBasicMaterial as fi } from "three";
const ci = `<style>\r
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
class Ei {
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
    this.controls = e, this.dom.innerHTML = ci, this.dom.style.width = "100%", this.dom.style.height = "100%", this.plane = this.dom.querySelector("#tt-compass-plane"), this.text = this.dom.querySelector("#tt-compass-text"), e.addEventListener("change", () => {
      this.plane && this.text && (this.plane.style.transform = `rotateX(${e.getPolarAngle()}rad)`, this.text.style.transform = `rotate(${e.getAzimuthalAngle()}rad)`);
    }), this.dom.onclick = () => open("https://github.com/sxguojf/three-tile");
  }
}
function Jo(t) {
  return new Ei(t);
}
class Qi extends Et {
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
    const { x: o, y: I, z: r, bounds: C, lonLatBounds: B } = A, y = e.canvas.width, n = e.canvas.height;
    e.strokeStyle = "#ccc", e.lineWidth = 4, e.strokeRect(5, 5, y - 10, n - 10), e.fillStyle = "white", e.shadowColor = "black", e.shadowBlur = 5, e.shadowOffsetX = 1, e.shadowOffsetY = 1, e.font = "bold 20px arial", e.textAlign = "center", e.fillText(`Level: ${r}`, y / 2, 50), e.fillText(`[${o}, ${I}]`, n / 2, 80);
    const i = y / 2;
    e.font = "14px arial", e.fillText(`[${C[0].toFixed(3)}, ${C[1].toFixed(3)}]`, i, n - 50), e.fillText(`[${C[2].toFixed(3)}, ${C[3].toFixed(3)}]`, i, n - 30), B && (e.fillText(`[${B[0].toFixed(3)}, ${B[1].toFixed(3)}]`, i, n - 120), e.fillText(`[${B[2].toFixed(3)}, ${B[3].toFixed(3)}]`, i, n - 100));
  }
}
UA(new Qi());
class hi extends Et {
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
UA(new hi());
class ui {
  info = {
    version: "0.10.0",
    description: "Tile normal material loader."
  };
  dataType = "normal";
  async load(e) {
    return new si({
      // transparent: true,
      opacity: e.source.opacity,
      flatShading: !0
    });
  }
}
UA(new ui());
class di {
  info = {
    version: "0.10.0",
    description: "Single image loader. It can load single image to bounds and stick to the ground."
  };
  dataType = "single-image";
  // private _image?: HTMLImageElement | undefined;
  _imageLoader = new ai(Qt.manager);
  /**
   * 加载材质
   * @param source 数据源
   * @param tile 瓦片
   * @returns 材质
   */
  async load(e) {
    const { source: A, bounds: o, z: I } = e, r = new ni({
      transparent: !0,
      opacity: A.opacity
    }), C = A._getUrl(0, 0, 0);
    return I < A.minLevel || I > A.maxLevel || !C ? r : A.image?.complete ? (this._setTexture(r, A.image, A, o), r) : (console.log("loadi image...", C), A.image = await this._imageLoader.loadAsync(C), this._setTexture(r, A.image, A, o), r);
  }
  _setTexture(e, A, o, I) {
    const r = this._getTileTexture(A, o, I);
    e.setTexture(r), r.needsUpdate = !0;
  }
  _getTileTexture(e, A, o) {
    const I = A, r = 256, C = new OffscreenCanvas(r, r);
    if (e) {
      const y = C.getContext("2d"), n = I._projectionBounds, i = e.width, a = e.height, f = (n[2] - n[0]) / i, s = (n[3] - n[1]) / a, g = (o[0] - n[0]) / f, u = (n[3] - o[3]) / s, l = (o[2] - o[0]) / f, c = (o[3] - o[1]) / s;
      y.drawImage(e, g, u, l, c, 0, 0, r, r);
    }
    const B = new gi(C);
    return B.colorSpace = Ii, B;
  }
}
class Yo extends Z {
  dataType = "image";
  image;
}
UA(new di());
function P(t) {
  return (e, ...A) => wi(t, e, A);
}
function DA(t, e) {
  return P(
    ht(
      t,
      e
    ).get
  );
}
const {
  apply: wi,
  getOwnPropertyDescriptor: ht,
  getPrototypeOf: de,
  ownKeys: Di
} = Reflect, {
  iterator: bA,
  toStringTag: yi
} = Symbol, xi = Object, {
  create: we,
  defineProperty: mi
} = xi, pi = Array, ki = pi.prototype, ut = ki[bA], Fi = P(ut), dt = ArrayBuffer, Si = dt.prototype;
DA(Si, "byteLength");
const Re = typeof SharedArrayBuffer < "u" ? SharedArrayBuffer : null;
Re && DA(Re.prototype, "byteLength");
const wt = de(Uint8Array);
wt.from;
const z = wt.prototype;
z[bA];
P(z.keys);
P(
  z.values
);
P(
  z.entries
);
P(z.set);
P(
  z.reverse
);
P(z.fill);
P(
  z.copyWithin
);
P(z.sort);
P(z.slice);
P(
  z.subarray
);
DA(
  z,
  "buffer"
);
DA(
  z,
  "byteOffset"
);
DA(
  z,
  "length"
);
DA(
  z,
  yi
);
const Gi = Uint8Array, Dt = Uint16Array, De = Uint32Array, Mi = Float32Array, SA = de([][bA]()), yt = P(SA.next), Ui = P(function* () {
}().next), bi = de(SA), Li = DataView.prototype, Ri = P(
  Li.getUint16
), ye = WeakMap, xt = ye.prototype, mt = P(xt.get), vi = P(xt.set), pt = new ye(), Ni = we(null, {
  next: {
    value: function() {
      const e = mt(pt, this);
      return yt(e);
    }
  },
  [bA]: {
    value: function() {
      return this;
    }
  }
});
function Ti(t) {
  if (t[bA] === ut && SA.next === yt)
    return t;
  const e = we(Ni);
  return vi(pt, e, Fi(t)), e;
}
const qi = new ye(), Ji = we(bi, {
  next: {
    value: function() {
      const e = mt(qi, this);
      return Ui(e);
    },
    writable: !0,
    configurable: !0
  }
});
for (const t of Di(SA))
  t !== "next" && mi(Ji, t, ht(SA, t));
const kt = new dt(4), Yi = new Mi(kt), Oi = new De(kt), nA = new Dt(512), rA = new Gi(512);
for (let t = 0; t < 256; ++t) {
  const e = t - 127;
  e < -24 ? (nA[t] = 0, nA[t | 256] = 32768, rA[t] = 24, rA[t | 256] = 24) : e < -14 ? (nA[t] = 1024 >> -e - 14, nA[t | 256] = 1024 >> -e - 14 | 32768, rA[t] = -e - 1, rA[t | 256] = -e - 1) : e <= 15 ? (nA[t] = e + 15 << 10, nA[t | 256] = e + 15 << 10 | 32768, rA[t] = 13, rA[t | 256] = 13) : e < 128 ? (nA[t] = 31744, nA[t | 256] = 64512, rA[t] = 24, rA[t | 256] = 24) : (nA[t] = 31744, nA[t | 256] = 64512, rA[t] = 13, rA[t | 256] = 13);
}
const xe = new De(2048);
for (let t = 1; t < 1024; ++t) {
  let e = t << 13, A = 0;
  for (; !(e & 8388608); )
    e <<= 1, A -= 8388608;
  e &= -8388609, A += 947912704, xe[t] = e | A;
}
for (let t = 1024; t < 2048; ++t)
  xe[t] = 939524096 + (t - 1024 << 13);
const yA = new De(64);
for (let t = 1; t < 31; ++t)
  yA[t] = t << 23;
yA[31] = 1199570944;
yA[32] = 2147483648;
for (let t = 33; t < 63; ++t)
  yA[t] = 2147483648 + (t - 32 << 23);
yA[63] = 3347054592;
const Ft = new Dt(64);
for (let t = 1; t < 64; ++t)
  t !== 32 && (Ft[t] = 1024);
function Ki(t) {
  const e = t >> 10;
  return Oi[0] = xe[Ft[e] + (t & 1023)] + yA[e], Yi[0];
}
function St(t, e, ...A) {
  return Ki(
    Ri(t, e, ...Ti(A))
  );
}
function me(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var pe = { exports: {} };
function Gt(t, e, A) {
  const o = A && A.debug || !1;
  o && console.log("[xml-utils] getting " + e + " in " + t);
  const I = typeof t == "object" ? t.outer : t, r = I.slice(0, I.indexOf(">") + 1), C = ['"', "'"];
  for (let B = 0; B < C.length; B++) {
    const y = C[B], n = e + "\\=" + y + "([^" + y + "]*)" + y;
    o && console.log("[xml-utils] pattern:", n);
    const a = new RegExp(n).exec(r);
    if (o && console.log("[xml-utils] match:", a), a) return a[1];
  }
}
pe.exports = Gt;
pe.exports.default = Gt;
var Hi = pe.exports;
const WA = /* @__PURE__ */ me(Hi);
var ke = { exports: {} }, Fe = { exports: {} }, Se = { exports: {} };
function Mt(t, e, A) {
  const I = new RegExp(e).exec(t.slice(A));
  return I ? A + I.index : -1;
}
Se.exports = Mt;
Se.exports.default = Mt;
var _i = Se.exports, Ge = { exports: {} };
function Ut(t, e, A) {
  const I = new RegExp(e).exec(t.slice(A));
  return I ? A + I.index + I[0].length - 1 : -1;
}
Ge.exports = Ut;
Ge.exports.default = Ut;
var Vi = Ge.exports, Me = { exports: {} };
function bt(t, e) {
  const A = new RegExp(e, "g"), o = t.match(A);
  return o ? o.length : 0;
}
Me.exports = bt;
Me.exports.default = bt;
var Xi = Me.exports;
const ji = _i, $A = Vi, ve = Xi;
function Lt(t, e, A) {
  const o = A && A.debug || !1, I = !(A && typeof A.nested === !1), r = A && A.startIndex || 0;
  o && console.log("[xml-utils] starting findTagByName with", e, " and ", A);
  const C = ji(t, `<${e}[ 
>/]`, r);
  if (o && console.log("[xml-utils] start:", C), C === -1) return;
  const B = t.slice(C + e.length);
  let y = $A(B, "^[^<]*[ /]>", 0);
  const n = y !== -1 && B[y - 1] === "/";
  if (o && console.log("[xml-utils] selfClosing:", n), n === !1)
    if (I) {
      let s = 0, g = 1, u = 0;
      for (; (y = $A(B, "[ /]" + e + ">", s)) !== -1; ) {
        const l = B.substring(s, y + 1);
        if (g += ve(l, "<" + e + `[ 
	>]`), u += ve(l, "</" + e + ">"), u >= g) break;
        s = y;
      }
    } else
      y = $A(B, "[ /]" + e + ">", 0);
  const i = C + e.length + y + 1;
  if (o && console.log("[xml-utils] end:", i), i === -1) return;
  const a = t.slice(C, i);
  let f;
  return n ? f = null : f = a.slice(a.indexOf(">") + 1, a.lastIndexOf("<")), { inner: f, outer: a, start: C, end: i };
}
Fe.exports = Lt;
Fe.exports.default = Lt;
var Pi = Fe.exports;
const Zi = Pi;
function Rt(t, e, A) {
  const o = [], I = A && A.debug || !1, r = A && typeof A.nested == "boolean" ? A.nested : !0;
  let C = A && A.startIndex || 0, B;
  for (; B = Zi(t, e, { debug: I, startIndex: C }); )
    r ? C = B.start + 1 + e.length : C = B.end, o.push(B);
  return I && console.log("findTagsByName found", o.length, "tags"), o;
}
ke.exports = Rt;
ke.exports.default = Rt;
var zi = ke.exports;
const Wi = /* @__PURE__ */ me(zi), pA = {
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
}, sA = {};
for (const t in pA)
  pA.hasOwnProperty(t) && (sA[pA[t]] = parseInt(t, 10));
const $i = [
  sA.BitsPerSample,
  sA.ExtraSamples,
  sA.SampleFormat,
  sA.StripByteCounts,
  sA.StripOffsets,
  sA.StripRowCounts,
  sA.TileByteCounts,
  sA.TileOffsets,
  sA.SubIFDs
], Ae = {
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
}, Y = {};
for (const t in Ae)
  Ae.hasOwnProperty(t) && (Y[Ae[t]] = parseInt(t, 10));
const AA = {
  WhiteIsZero: 0,
  BlackIsZero: 1,
  RGB: 2,
  Palette: 3,
  CMYK: 5,
  YCbCr: 6,
  CIELab: 8
}, An = {
  Unspecified: 0
}, en = {
  AddCompression: 1
}, ee = {
  None: 0,
  Deflate: 1,
  Zstandard: 2
}, tn = {
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
function nn(t, e) {
  const { width: A, height: o } = t, I = new Uint8Array(A * o * 3);
  let r;
  for (let C = 0, B = 0; C < t.length; ++C, B += 3)
    r = 256 - t[C] / e * 256, I[B] = r, I[B + 1] = r, I[B + 2] = r;
  return I;
}
function rn(t, e) {
  const { width: A, height: o } = t, I = new Uint8Array(A * o * 3);
  let r;
  for (let C = 0, B = 0; C < t.length; ++C, B += 3)
    r = t[C] / e * 256, I[B] = r, I[B + 1] = r, I[B + 2] = r;
  return I;
}
function on(t, e) {
  const { width: A, height: o } = t, I = new Uint8Array(A * o * 3), r = e.length / 3, C = e.length / 3 * 2;
  for (let B = 0, y = 0; B < t.length; ++B, y += 3) {
    const n = t[B];
    I[y] = e[n] / 65536 * 256, I[y + 1] = e[n + r] / 65536 * 256, I[y + 2] = e[n + C] / 65536 * 256;
  }
  return I;
}
function sn(t) {
  const { width: e, height: A } = t, o = new Uint8Array(e * A * 3);
  for (let I = 0, r = 0; I < t.length; I += 4, r += 3) {
    const C = t[I], B = t[I + 1], y = t[I + 2], n = t[I + 3];
    o[r] = 255 * ((255 - C) / 256) * ((255 - n) / 256), o[r + 1] = 255 * ((255 - B) / 256) * ((255 - n) / 256), o[r + 2] = 255 * ((255 - y) / 256) * ((255 - n) / 256);
  }
  return o;
}
function an(t) {
  const { width: e, height: A } = t, o = new Uint8ClampedArray(e * A * 3);
  for (let I = 0, r = 0; I < t.length; I += 3, r += 3) {
    const C = t[I], B = t[I + 1], y = t[I + 2];
    o[r] = C + 1.402 * (y - 128), o[r + 1] = C - 0.34414 * (B - 128) - 0.71414 * (y - 128), o[r + 2] = C + 1.772 * (B - 128);
  }
  return o;
}
const gn = 0.95047, In = 1, Bn = 1.08883;
function ln(t) {
  const { width: e, height: A } = t, o = new Uint8Array(e * A * 3);
  for (let I = 0, r = 0; I < t.length; I += 3, r += 3) {
    const C = t[I + 0], B = t[I + 1] << 24 >> 24, y = t[I + 2] << 24 >> 24;
    let n = (C + 16) / 116, i = B / 500 + n, a = n - y / 200, f, s, g;
    i = gn * (i * i * i > 8856e-6 ? i * i * i : (i - 16 / 116) / 7.787), n = In * (n * n * n > 8856e-6 ? n * n * n : (n - 16 / 116) / 7.787), a = Bn * (a * a * a > 8856e-6 ? a * a * a : (a - 16 / 116) / 7.787), f = i * 3.2406 + n * -1.5372 + a * -0.4986, s = i * -0.9689 + n * 1.8758 + a * 0.0415, g = i * 0.0557 + n * -0.204 + a * 1.057, f = f > 31308e-7 ? 1.055 * f ** (1 / 2.4) - 0.055 : 12.92 * f, s = s > 31308e-7 ? 1.055 * s ** (1 / 2.4) - 0.055 : 12.92 * s, g = g > 31308e-7 ? 1.055 * g ** (1 / 2.4) - 0.055 : 12.92 * g, o[r] = Math.max(0, Math.min(1, f)) * 255, o[r + 1] = Math.max(0, Math.min(1, s)) * 255, o[r + 2] = Math.max(0, Math.min(1, g)) * 255;
  }
  return o;
}
const vt = /* @__PURE__ */ new Map();
function CA(t, e) {
  Array.isArray(t) || (t = [t]), t.forEach((A) => vt.set(A, e));
}
async function Cn(t) {
  const e = vt.get(t.Compression);
  if (!e)
    throw new Error(`Unknown compression method identifier: ${t.Compression}`);
  const A = await e();
  return new A(t);
}
CA([void 0, 1], () => Promise.resolve().then(() => tr).then((t) => t.default));
CA(5, () => Promise.resolve().then(() => sr).then((t) => t.default));
CA(6, () => {
  throw new Error("old style JPEG compression is not supported.");
});
CA(7, () => Promise.resolve().then(() => lr).then((t) => t.default));
CA([8, 32946], () => Promise.resolve().then(() => Fo).then((t) => t.default));
CA(32773, () => Promise.resolve().then(() => Go).then((t) => t.default));
CA(
  34887,
  () => Promise.resolve().then(() => Ro).then(async (t) => (await t.zstd.init(), t)).then((t) => t.default)
);
CA(50001, () => Promise.resolve().then(() => No).then((t) => t.default));
function jA(t, e, A, o = 1) {
  return new (Object.getPrototypeOf(t)).constructor(e * A * o);
}
function fn(t, e, A, o, I) {
  const r = e / o, C = A / I;
  return t.map((B) => {
    const y = jA(B, o, I);
    for (let n = 0; n < I; ++n) {
      const i = Math.min(Math.round(C * n), A - 1);
      for (let a = 0; a < o; ++a) {
        const f = Math.min(Math.round(r * a), e - 1), s = B[i * e + f];
        y[n * o + a] = s;
      }
    }
    return y;
  });
}
function wA(t, e, A) {
  return (1 - A) * t + A * e;
}
function cn(t, e, A, o, I) {
  const r = e / o, C = A / I;
  return t.map((B) => {
    const y = jA(B, o, I);
    for (let n = 0; n < I; ++n) {
      const i = C * n, a = Math.floor(i), f = Math.min(Math.ceil(i), A - 1);
      for (let s = 0; s < o; ++s) {
        const g = r * s, u = g % 1, l = Math.floor(g), c = Math.min(Math.ceil(g), e - 1), h = B[a * e + l], D = B[a * e + c], Q = B[f * e + l], x = B[f * e + c], E = wA(
          wA(h, D, u),
          wA(Q, x, u),
          i % 1
        );
        y[n * o + s] = E;
      }
    }
    return y;
  });
}
function En(t, e, A, o, I, r = "nearest") {
  switch (r.toLowerCase()) {
    case "nearest":
      return fn(t, e, A, o, I);
    case "bilinear":
    case "linear":
      return cn(t, e, A, o, I);
    default:
      throw new Error(`Unsupported resampling method: '${r}'`);
  }
}
function Qn(t, e, A, o, I, r) {
  const C = e / o, B = A / I, y = jA(t, o, I, r);
  for (let n = 0; n < I; ++n) {
    const i = Math.min(Math.round(B * n), A - 1);
    for (let a = 0; a < o; ++a) {
      const f = Math.min(Math.round(C * a), e - 1);
      for (let s = 0; s < r; ++s) {
        const g = t[i * e * r + f * r + s];
        y[n * o * r + a * r + s] = g;
      }
    }
  }
  return y;
}
function hn(t, e, A, o, I, r) {
  const C = e / o, B = A / I, y = jA(t, o, I, r);
  for (let n = 0; n < I; ++n) {
    const i = B * n, a = Math.floor(i), f = Math.min(Math.ceil(i), A - 1);
    for (let s = 0; s < o; ++s) {
      const g = C * s, u = g % 1, l = Math.floor(g), c = Math.min(Math.ceil(g), e - 1);
      for (let h = 0; h < r; ++h) {
        const D = t[a * e * r + l * r + h], Q = t[a * e * r + c * r + h], x = t[f * e * r + l * r + h], E = t[f * e * r + c * r + h], d = wA(
          wA(D, Q, u),
          wA(x, E, u),
          i % 1
        );
        y[n * o * r + s * r + h] = d;
      }
    }
  }
  return y;
}
function un(t, e, A, o, I, r, C = "nearest") {
  switch (C.toLowerCase()) {
    case "nearest":
      return Qn(
        t,
        e,
        A,
        o,
        I,
        r
      );
    case "bilinear":
    case "linear":
      return hn(
        t,
        e,
        A,
        o,
        I,
        r
      );
    default:
      throw new Error(`Unsupported resampling method: '${C}'`);
  }
}
function dn(t, e, A) {
  let o = 0;
  for (let I = e; I < A; ++I)
    o += t[I];
  return o;
}
function Ce(t, e, A) {
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
function wn(t, e) {
  return (t === 1 || t === 2) && e <= 32 && e % 8 === 0 ? !1 : !(t === 3 && (e === 16 || e === 32 || e === 64));
}
function Dn(t, e, A, o, I, r, C) {
  const B = new DataView(t), y = A === 2 ? C * r : C * r * o, n = A === 2 ? 1 : o, i = Ce(e, I, y), a = parseInt("1".repeat(I), 2);
  if (e === 1) {
    let f;
    A === 1 ? f = o * I : f = I;
    let s = r * f;
    s & 7 && (s = s + 7 & -8);
    for (let g = 0; g < C; ++g) {
      const u = g * s;
      for (let l = 0; l < r; ++l) {
        const c = u + l * n * I;
        for (let h = 0; h < n; ++h) {
          const D = c + h * I, Q = (g * r + l) * n + h, x = Math.floor(D / 8), E = D % 8;
          if (E + I <= 8)
            i[Q] = B.getUint8(x) >> 8 - I - E & a;
          else if (E + I <= 16)
            i[Q] = B.getUint16(x) >> 16 - I - E & a;
          else if (E + I <= 24) {
            const d = B.getUint16(x) << 8 | B.getUint8(x + 2);
            i[Q] = d >> 24 - I - E & a;
          } else
            i[Q] = B.getUint32(x) >> 32 - I - E & a;
        }
      }
    }
  }
  return i.buffer;
}
class yn {
  /**
   * @constructor
   * @param {Object} fileDirectory The parsed file directory
   * @param {Object} geoKeys The parsed geo-keys
   * @param {DataView} dataView The DataView for the underlying file.
   * @param {Boolean} littleEndian Whether the file is encoded in little or big endian
   * @param {Boolean} cache Whether or not decoded tiles shall be cached
   * @param {import('./source/basesource').BaseSource} source The datasource to read from
   */
  constructor(e, A, o, I, r, C) {
    this.fileDirectory = e, this.geoKeys = A, this.dataView = o, this.littleEndian = I, this.tiles = r ? {} : null, this.isTiled = !e.StripOffsets;
    const B = e.PlanarConfiguration;
    if (this.planarConfiguration = typeof B > "u" ? 1 : B, this.planarConfiguration !== 1 && this.planarConfiguration !== 2)
      throw new Error("Invalid planar configuration.");
    this.source = C;
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
    const A = this.fileDirectory.SampleFormat ? this.fileDirectory.SampleFormat[e] : 1, o = this.fileDirectory.BitsPerSample[e];
    switch (A) {
      case 1:
        if (o <= 8)
          return DataView.prototype.getUint8;
        if (o <= 16)
          return DataView.prototype.getUint16;
        if (o <= 32)
          return DataView.prototype.getUint32;
        break;
      case 2:
        if (o <= 8)
          return DataView.prototype.getInt8;
        if (o <= 16)
          return DataView.prototype.getInt16;
        if (o <= 32)
          return DataView.prototype.getInt32;
        break;
      case 3:
        switch (o) {
          case 16:
            return function(I, r) {
              return St(this, I, r);
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
    const o = this.getSampleFormat(e), I = this.getBitsPerSample(e);
    return Ce(o, I, A);
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
  async getTileOrStrip(e, A, o, I, r) {
    const C = Math.ceil(this.getWidth() / this.getTileWidth()), B = Math.ceil(this.getHeight() / this.getTileHeight());
    let y;
    const { tiles: n } = this;
    this.planarConfiguration === 1 ? y = A * C + e : this.planarConfiguration === 2 && (y = o * C * B + A * C + e);
    let i, a;
    this.isTiled ? (i = this.fileDirectory.TileOffsets[y], a = this.fileDirectory.TileByteCounts[y]) : (i = this.fileDirectory.StripOffsets[y], a = this.fileDirectory.StripByteCounts[y]);
    const f = (await this.source.fetch([{ offset: i, length: a }], r))[0];
    let s;
    return n === null || !n[y] ? (s = (async () => {
      let g = await I.decode(this.fileDirectory, f);
      const u = this.getSampleFormat(), l = this.getBitsPerSample();
      return wn(u, l) && (g = Dn(
        g,
        u,
        this.planarConfiguration,
        this.getSamplesPerPixel(),
        l,
        this.getTileWidth(),
        this.getBlockHeight(A)
      )), g;
    })(), n !== null && (n[y] = s)) : s = n[y], { x: e, y: A, sample: o, data: await s };
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
  async _readRaster(e, A, o, I, r, C, B, y, n) {
    const i = this.getTileWidth(), a = this.getTileHeight(), f = this.getWidth(), s = this.getHeight(), g = Math.max(Math.floor(e[0] / i), 0), u = Math.min(
      Math.ceil(e[2] / i),
      Math.ceil(f / i)
    ), l = Math.max(Math.floor(e[1] / a), 0), c = Math.min(
      Math.ceil(e[3] / a),
      Math.ceil(s / a)
    ), h = e[2] - e[0];
    let D = this.getBytesPerPixel();
    const Q = [], x = [];
    for (let w = 0; w < A.length; ++w)
      this.planarConfiguration === 1 ? Q.push(dn(this.fileDirectory.BitsPerSample, 0, A[w]) / 8) : Q.push(0), x.push(this.getReaderForSample(A[w]));
    const E = [], { littleEndian: d } = this;
    for (let w = l; w < c; ++w)
      for (let k = g; k < u; ++k) {
        let F;
        this.planarConfiguration === 1 && (F = this.getTileOrStrip(k, w, 0, r, n));
        for (let m = 0; m < A.length; ++m) {
          const M = m, G = A[m];
          this.planarConfiguration === 2 && (D = this.getSampleByteSize(G), F = this.getTileOrStrip(k, w, G, r, n));
          const J = F.then((S) => {
            const p = S.data, R = new DataView(p), U = this.getBlockHeight(S.y), L = S.y * a, N = S.x * i, v = L + U, K = (S.x + 1) * i, _ = x[M], b = Math.min(U, U - (v - e[3]), s - L), q = Math.min(i, i - (K - e[2]), f - N);
            for (let T = Math.max(0, e[1] - L); T < b; ++T)
              for (let O = Math.max(0, e[0] - N); O < q; ++O) {
                const H = (T * i + O) * D, X = _.call(
                  R,
                  H + Q[M],
                  d
                );
                let j;
                I ? (j = (T + L - e[1]) * h * A.length + (O + N - e[0]) * A.length + M, o[j] = X) : (j = (T + L - e[1]) * h + O + N - e[0], o[M][j] = X);
              }
          });
          E.push(J);
        }
      }
    if (await Promise.all(E), C && e[2] - e[0] !== C || B && e[3] - e[1] !== B) {
      let w;
      return I ? w = un(
        o,
        e[2] - e[0],
        e[3] - e[1],
        C,
        B,
        A.length,
        y
      ) : w = En(
        o,
        e[2] - e[0],
        e[3] - e[1],
        C,
        B,
        y
      ), w.width = C, w.height = B, w;
    }
    return o.width = C || e[2] - e[0], o.height = B || e[3] - e[1], o;
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
    interleave: o,
    pool: I = null,
    width: r,
    height: C,
    resampleMethod: B,
    fillValue: y,
    signal: n
  } = {}) {
    const i = e || [0, 0, this.getWidth(), this.getHeight()];
    if (i[0] > i[2] || i[1] > i[3])
      throw new Error("Invalid subsets");
    const a = i[2] - i[0], f = i[3] - i[1], s = a * f, g = this.getSamplesPerPixel();
    if (!A || !A.length)
      for (let h = 0; h < g; ++h)
        A.push(h);
    else
      for (let h = 0; h < A.length; ++h)
        if (A[h] >= g)
          return Promise.reject(new RangeError(`Invalid sample index '${A[h]}'.`));
    let u;
    if (o) {
      const h = this.fileDirectory.SampleFormat ? Math.max.apply(null, this.fileDirectory.SampleFormat) : 1, D = Math.max.apply(null, this.fileDirectory.BitsPerSample);
      u = Ce(h, D, s * A.length), y && u.fill(y);
    } else {
      u = [];
      for (let h = 0; h < A.length; ++h) {
        const D = this.getArrayForSample(A[h], s);
        Array.isArray(y) && h < y.length ? D.fill(y[h]) : y && !Array.isArray(y) && D.fill(y), u.push(D);
      }
    }
    const l = I || await Cn(this.fileDirectory);
    return await this._readRaster(
      i,
      A,
      u,
      o,
      l,
      r,
      C,
      B,
      n
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
    pool: o = null,
    width: I,
    height: r,
    resampleMethod: C,
    enableAlpha: B = !1,
    signal: y
  } = {}) {
    const n = e || [0, 0, this.getWidth(), this.getHeight()];
    if (n[0] > n[2] || n[1] > n[3])
      throw new Error("Invalid subsets");
    const i = this.fileDirectory.PhotometricInterpretation;
    if (i === AA.RGB) {
      let c = [0, 1, 2];
      if (this.fileDirectory.ExtraSamples !== An.Unspecified && B) {
        c = [];
        for (let h = 0; h < this.fileDirectory.BitsPerSample.length; h += 1)
          c.push(h);
      }
      return this.readRasters({
        window: e,
        interleave: A,
        samples: c,
        pool: o,
        width: I,
        height: r,
        resampleMethod: C,
        signal: y
      });
    }
    let a;
    switch (i) {
      case AA.WhiteIsZero:
      case AA.BlackIsZero:
      case AA.Palette:
        a = [0];
        break;
      case AA.CMYK:
        a = [0, 1, 2, 3];
        break;
      case AA.YCbCr:
      case AA.CIELab:
        a = [0, 1, 2];
        break;
      default:
        throw new Error("Invalid or unsupported photometric interpretation.");
    }
    const f = {
      window: n,
      interleave: !0,
      samples: a,
      pool: o,
      width: I,
      height: r,
      resampleMethod: C,
      signal: y
    }, { fileDirectory: s } = this, g = await this.readRasters(f), u = 2 ** this.fileDirectory.BitsPerSample[0];
    let l;
    switch (i) {
      case AA.WhiteIsZero:
        l = nn(g, u);
        break;
      case AA.BlackIsZero:
        l = rn(g, u);
        break;
      case AA.Palette:
        l = on(g, s.ColorMap);
        break;
      case AA.CMYK:
        l = sn(g);
        break;
      case AA.YCbCr:
        l = an(g);
        break;
      case AA.CIELab:
        l = ln(g);
        break;
      default:
        throw new Error("Unsupported photometric interpretation.");
    }
    if (!A) {
      const c = new Uint8Array(l.length / 3), h = new Uint8Array(l.length / 3), D = new Uint8Array(l.length / 3);
      for (let Q = 0, x = 0; Q < l.length; Q += 3, ++x)
        c[x] = l[Q], h[x] = l[Q + 1], D[x] = l[Q + 2];
      l = [c, h, D];
    }
    return l.width = g.width, l.height = g.height, l;
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
    const o = this.fileDirectory.GDAL_METADATA;
    let I = Wi(o, "Item");
    e === null ? I = I.filter((r) => WA(r, "sample") === void 0) : I = I.filter((r) => Number(WA(r, "sample")) === e);
    for (let r = 0; r < I.length; ++r) {
      const C = I[r];
      A[WA(C, "name")] = C.inner;
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
    const A = this.fileDirectory.ModelPixelScale, o = this.fileDirectory.ModelTransformation;
    if (A)
      return [
        A[0],
        -A[1],
        A[2]
      ];
    if (o)
      return o[1] === 0 && o[4] === 0 ? [
        o[0],
        -o[5],
        o[10]
      ] : [
        Math.sqrt(o[0] * o[0] + o[4] * o[4]),
        -Math.sqrt(o[1] * o[1] + o[5] * o[5]),
        o[10]
      ];
    if (e) {
      const [I, r, C] = e.getResolution();
      return [
        I * e.getWidth() / this.getWidth(),
        r * e.getHeight() / this.getHeight(),
        C * e.getWidth() / this.getWidth()
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
    const A = this.getHeight(), o = this.getWidth();
    if (this.fileDirectory.ModelTransformation && !e) {
      const [I, r, C, B, y, n, i, a] = this.fileDirectory.ModelTransformation, s = [
        [0, 0],
        [0, A],
        [o, 0],
        [o, A]
      ].map(([l, c]) => [
        B + I * l + r * c,
        a + y * l + n * c
      ]), g = s.map((l) => l[0]), u = s.map((l) => l[1]);
      return [
        Math.min(...g),
        Math.min(...u),
        Math.max(...g),
        Math.max(...u)
      ];
    } else {
      const I = this.getOrigin(), r = this.getResolution(), C = I[0], B = I[1], y = C + r[0] * o, n = B + r[1] * A;
      return [
        Math.min(C, y),
        Math.min(B, n),
        Math.max(C, y),
        Math.max(B, n)
      ];
    }
  }
}
class xn {
  constructor(e) {
    this._dataView = new DataView(e);
  }
  get buffer() {
    return this._dataView.buffer;
  }
  getUint64(e, A) {
    const o = this.getUint32(e, A), I = this.getUint32(e + 4, A);
    let r;
    if (A) {
      if (r = o + 2 ** 32 * I, !Number.isSafeInteger(r))
        throw new Error(
          `${r} exceeds MAX_SAFE_INTEGER. Precision may be lost. Please report if you get this message to https://github.com/geotiffjs/geotiff.js/issues`
        );
      return r;
    }
    if (r = 2 ** 32 * o + I, !Number.isSafeInteger(r))
      throw new Error(
        `${r} exceeds MAX_SAFE_INTEGER. Precision may be lost. Please report if you get this message to https://github.com/geotiffjs/geotiff.js/issues`
      );
    return r;
  }
  // adapted from https://stackoverflow.com/a/55338384/8060591
  getInt64(e, A) {
    let o = 0;
    const I = (this._dataView.getUint8(e + (A ? 7 : 0)) & 128) > 0;
    let r = !0;
    for (let C = 0; C < 8; C++) {
      let B = this._dataView.getUint8(e + (A ? C : 7 - C));
      I && (r ? B !== 0 && (B = ~(B - 1) & 255, r = !1) : B = ~B & 255), o += B * 256 ** C;
    }
    return I && (o = -o), o;
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
    return St(this._dataView, e, A);
  }
  getFloat32(e, A) {
    return this._dataView.getFloat32(e, A);
  }
  getFloat64(e, A) {
    return this._dataView.getFloat64(e, A);
  }
}
class mn {
  constructor(e, A, o, I) {
    this._dataView = new DataView(e), this._sliceOffset = A, this._littleEndian = o, this._bigTiff = I;
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
    const A = this.readUint32(e), o = this.readUint32(e + 4);
    let I;
    if (this._littleEndian) {
      if (I = A + 2 ** 32 * o, !Number.isSafeInteger(I))
        throw new Error(
          `${I} exceeds MAX_SAFE_INTEGER. Precision may be lost. Please report if you get this message to https://github.com/geotiffjs/geotiff.js/issues`
        );
      return I;
    }
    if (I = 2 ** 32 * A + o, !Number.isSafeInteger(I))
      throw new Error(
        `${I} exceeds MAX_SAFE_INTEGER. Precision may be lost. Please report if you get this message to https://github.com/geotiffjs/geotiff.js/issues`
      );
    return I;
  }
  // adapted from https://stackoverflow.com/a/55338384/8060591
  readInt64(e) {
    let A = 0;
    const o = (this._dataView.getUint8(e + (this._littleEndian ? 7 : 0)) & 128) > 0;
    let I = !0;
    for (let r = 0; r < 8; r++) {
      let C = this._dataView.getUint8(
        e + (this._littleEndian ? r : 7 - r)
      );
      o && (I ? C !== 0 && (C = ~(C - 1) & 255, I = !1) : C = ~C & 255), A += C * 256 ** r;
    }
    return o && (A = -A), A;
  }
  readOffset(e) {
    return this._bigTiff ? this.readUint64(e) : this.readUint32(e);
  }
}
class pn {
  /**
   *
   * @param {Slice[]} slices
   * @returns {ArrayBuffer[]}
   */
  async fetch(e, A = void 0) {
    return Promise.all(
      e.map((o) => this.fetchSlice(o, A))
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
class Ue extends Error {
  constructor(e) {
    super(e), Error.captureStackTrace && Error.captureStackTrace(this, Ue), this.name = "AbortError";
  }
}
class kn extends pn {
  constructor(e) {
    super(), this.arrayBuffer = e;
  }
  fetchSlice(e, A) {
    if (A && A.aborted)
      throw new Ue("Request aborted");
    return this.arrayBuffer.slice(e.offset, e.offset + e.length);
  }
}
function Fn(t) {
  return new kn(t);
}
function Sn(t, e) {
  let A = t.length - e, o = 0;
  do {
    for (let I = e; I > 0; I--)
      t[o + e] += t[o], o++;
    A -= e;
  } while (A > 0);
}
function Gn(t, e, A) {
  let o = 0, I = t.length;
  const r = I / A;
  for (; I > e; ) {
    for (let B = e; B > 0; --B)
      t[o + e] += t[o], ++o;
    I -= e;
  }
  const C = t.slice();
  for (let B = 0; B < r; ++B)
    for (let y = 0; y < A; ++y)
      t[A * B + y] = C[(A - y - 1) * r + B];
}
function Mn(t, e, A, o, I, r) {
  if (e === 1)
    return t;
  for (let y = 0; y < I.length; ++y) {
    if (I[y] % 8 !== 0)
      throw new Error("When decoding with predictor, only multiple of 8 bits are supported.");
    if (I[y] !== I[0])
      throw new Error("When decoding with predictor, all samples must have the same size.");
  }
  const C = I[0] / 8, B = r === 2 ? 1 : I.length;
  for (let y = 0; y < o && !(y * B * A * C >= t.byteLength); ++y) {
    let n;
    if (e === 2) {
      switch (I[0]) {
        case 8:
          n = new Uint8Array(
            t,
            y * B * A * C,
            B * A * C
          );
          break;
        case 16:
          n = new Uint16Array(
            t,
            y * B * A * C,
            B * A * C / 2
          );
          break;
        case 32:
          n = new Uint32Array(
            t,
            y * B * A * C,
            B * A * C / 4
          );
          break;
        default:
          throw new Error(`Predictor 2 not allowed with ${I[0]} bits per sample.`);
      }
      Sn(n, B);
    } else e === 3 && (n = new Uint8Array(
      t,
      y * B * A * C,
      B * A * C
    ), Gn(n, B, C));
  }
  return t;
}
class EA {
  async decode(e, A) {
    const o = await this.decodeBlock(A), I = e.Predictor || 1;
    if (I !== 1) {
      const r = !e.StripOffsets, C = r ? e.TileWidth : e.ImageWidth, B = r ? e.TileLength : e.RowsPerStrip || e.ImageLength;
      return Mn(
        o,
        I,
        C,
        B,
        e.BitsPerSample,
        e.PlanarConfiguration
      );
    }
    return o;
  }
}
function fe(t) {
  switch (t) {
    case Y.BYTE:
    case Y.ASCII:
    case Y.SBYTE:
    case Y.UNDEFINED:
      return 1;
    case Y.SHORT:
    case Y.SSHORT:
      return 2;
    case Y.LONG:
    case Y.SLONG:
    case Y.FLOAT:
    case Y.IFD:
      return 4;
    case Y.RATIONAL:
    case Y.SRATIONAL:
    case Y.DOUBLE:
    case Y.LONG8:
    case Y.SLONG8:
    case Y.IFD8:
      return 8;
    default:
      throw new RangeError(`Invalid field type: ${t}`);
  }
}
function Un(t) {
  const e = t.GeoKeyDirectory;
  if (!e)
    return null;
  const A = {};
  for (let o = 4; o <= e[3] * 4; o += 4) {
    const I = tn[e[o]], r = e[o + 1] ? pA[e[o + 1]] : null, C = e[o + 2], B = e[o + 3];
    let y = null;
    if (!r)
      y = B;
    else {
      if (y = t[r], typeof y > "u" || y === null)
        throw new Error(`Could not get value of geoKey '${I}'.`);
      typeof y == "string" ? y = y.substring(B, B + C - 1) : y.subarray && (y = y.subarray(B, B + C), C === 1 && (y = y[0]));
    }
    A[I] = y;
  }
  return A;
}
function hA(t, e, A, o) {
  let I = null, r = null;
  const C = fe(e);
  switch (e) {
    case Y.BYTE:
    case Y.ASCII:
    case Y.UNDEFINED:
      I = new Uint8Array(A), r = t.readUint8;
      break;
    case Y.SBYTE:
      I = new Int8Array(A), r = t.readInt8;
      break;
    case Y.SHORT:
      I = new Uint16Array(A), r = t.readUint16;
      break;
    case Y.SSHORT:
      I = new Int16Array(A), r = t.readInt16;
      break;
    case Y.LONG:
    case Y.IFD:
      I = new Uint32Array(A), r = t.readUint32;
      break;
    case Y.SLONG:
      I = new Int32Array(A), r = t.readInt32;
      break;
    case Y.LONG8:
    case Y.IFD8:
      I = new Array(A), r = t.readUint64;
      break;
    case Y.SLONG8:
      I = new Array(A), r = t.readInt64;
      break;
    case Y.RATIONAL:
      I = new Uint32Array(A * 2), r = t.readUint32;
      break;
    case Y.SRATIONAL:
      I = new Int32Array(A * 2), r = t.readInt32;
      break;
    case Y.FLOAT:
      I = new Float32Array(A), r = t.readFloat32;
      break;
    case Y.DOUBLE:
      I = new Float64Array(A), r = t.readFloat64;
      break;
    default:
      throw new RangeError(`Invalid field type: ${e}`);
  }
  if (e === Y.RATIONAL || e === Y.SRATIONAL)
    for (let B = 0; B < A; B += 2)
      I[B] = r.call(
        t,
        o + B * C
      ), I[B + 1] = r.call(
        t,
        o + (B * C + 4)
      );
  else
    for (let B = 0; B < A; ++B)
      I[B] = r.call(
        t,
        o + B * C
      );
  return e === Y.ASCII ? new TextDecoder("utf-8").decode(I) : I;
}
class bn {
  constructor(e, A, o) {
    this.fileDirectory = e, this.geoKeyDirectory = A, this.nextIFDByteOffset = o;
  }
}
class RA extends Error {
  constructor(e) {
    super(`No image at index ${e}`), this.index = e;
  }
}
class Ln {
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
    const { window: A, width: o, height: I } = e;
    let { resX: r, resY: C, bbox: B } = e;
    const y = await this.getImage();
    let n = y;
    const i = await this.getImageCount(), a = y.getBoundingBox();
    if (A && B)
      throw new Error('Both "bbox" and "window" passed.');
    if (o || I) {
      if (A) {
        const [g, u] = y.getOrigin(), [l, c] = y.getResolution();
        B = [
          g + A[0] * l,
          u + A[1] * c,
          g + A[2] * l,
          u + A[3] * c
        ];
      }
      const s = B || a;
      if (o) {
        if (r)
          throw new Error("Both width and resX passed");
        r = (s[2] - s[0]) / o;
      }
      if (I) {
        if (C)
          throw new Error("Both width and resY passed");
        C = (s[3] - s[1]) / I;
      }
    }
    if (r || C) {
      const s = [];
      for (let g = 0; g < i; ++g) {
        const u = await this.getImage(g), { SubfileType: l, NewSubfileType: c } = u.fileDirectory;
        (g === 0 || l === 2 || c & 1) && s.push(u);
      }
      s.sort((g, u) => g.getWidth() - u.getWidth());
      for (let g = 0; g < s.length; ++g) {
        const u = s[g], l = (a[2] - a[0]) / u.getWidth(), c = (a[3] - a[1]) / u.getHeight();
        if (n = u, r && r > l || C && C > c)
          break;
      }
    }
    let f = A;
    if (B) {
      const [s, g] = y.getOrigin(), [u, l] = n.getResolution(y);
      f = [
        Math.round((B[0] - s) / u),
        Math.round((B[1] - g) / l),
        Math.round((B[2] - s) / u),
        Math.round((B[3] - g) / l)
      ], f = [
        Math.min(f[0], f[2]),
        Math.min(f[1], f[3]),
        Math.max(f[0], f[2]),
        Math.max(f[1], f[3])
      ];
    }
    return n.readRasters({ ...e, window: f });
  }
}
class be extends Ln {
  /**
   * @constructor
   * @param {*} source The datasource to read from.
   * @param {boolean} littleEndian Whether the image uses little endian.
   * @param {boolean} bigTiff Whether the image uses bigTIFF conventions.
   * @param {number} firstIFDOffset The numeric byte-offset from the start of the image
   *                                to the first IFD.
   * @param {GeoTIFFOptions} [options] further options.
   */
  constructor(e, A, o, I, r = {}) {
    super(), this.source = e, this.littleEndian = A, this.bigTiff = o, this.firstIFDOffset = I, this.cache = r.cache || !1, this.ifdRequests = [], this.ghostValues = null;
  }
  async getSlice(e, A) {
    const o = this.bigTiff ? 4048 : 1024;
    return new mn(
      (await this.source.fetch([{
        offset: e,
        length: typeof A < "u" ? A : o
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
    const A = this.bigTiff ? 20 : 12, o = this.bigTiff ? 8 : 2;
    let I = await this.getSlice(e);
    const r = this.bigTiff ? I.readUint64(e) : I.readUint16(e), C = r * A + (this.bigTiff ? 16 : 6);
    I.covers(e, C) || (I = await this.getSlice(e, C));
    const B = {};
    let y = e + (this.bigTiff ? 8 : 2);
    for (let a = 0; a < r; y += A, ++a) {
      const f = I.readUint16(y), s = I.readUint16(y + 2), g = this.bigTiff ? I.readUint64(y + 4) : I.readUint32(y + 4);
      let u, l;
      const c = fe(s), h = y + (this.bigTiff ? 12 : 8);
      if (c * g <= (this.bigTiff ? 8 : 4))
        u = hA(I, s, g, h);
      else {
        const D = I.readOffset(h), Q = fe(s) * g;
        if (I.covers(D, Q))
          u = hA(I, s, g, D);
        else {
          const x = await this.getSlice(D, Q);
          u = hA(x, s, g, D);
        }
      }
      g === 1 && $i.indexOf(f) === -1 && !(s === Y.RATIONAL || s === Y.SRATIONAL) ? l = u[0] : l = u, B[pA[f]] = l;
    }
    const n = Un(B), i = I.readOffset(
      e + o + A * r
    );
    return new bn(
      B,
      n,
      i
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
        throw A instanceof RA ? new RA(e) : A;
      }
    return this.ifdRequests[e] = (async () => {
      const A = await this.ifdRequests[e - 1];
      if (A.nextIFDByteOffset === 0)
        throw new RA(e);
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
    return new yn(
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
      } catch (o) {
        if (o instanceof RA)
          A = !1;
        else
          throw o;
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
    const A = "GDAL_STRUCTURAL_METADATA_SIZE=", o = A.length + 100;
    let I = await this.getSlice(e, o);
    if (A === hA(I, Y.ASCII, A.length, e)) {
      const C = hA(I, Y.ASCII, o, e).split(`
`)[0], B = Number(C.split("=")[1].split(" ")[0]) + C.length;
      B > o && (I = await this.getSlice(e, B));
      const y = hA(I, Y.ASCII, B, e);
      this.ghostValues = {}, y.split(`
`).filter((n) => n.length > 0).map((n) => n.split("=")).forEach(([n, i]) => {
        this.ghostValues[n] = i;
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
  static async fromSource(e, A, o) {
    const I = (await e.fetch([{ offset: 0, length: 1024 }], o))[0], r = new xn(I), C = r.getUint16(0, 0);
    let B;
    if (C === 18761)
      B = !0;
    else if (C === 19789)
      B = !1;
    else
      throw new TypeError("Invalid byte order value.");
    const y = r.getUint16(2, B);
    let n;
    if (y === 42)
      n = !1;
    else if (y === 43) {
      if (n = !0, r.getUint16(4, B) !== 8)
        throw new Error("Unsupported offset byte-size.");
    } else
      throw new TypeError("Invalid magic number.");
    const i = n ? r.getUint64(8, B) : r.getUint32(4, B);
    return new be(e, B, n, i, A);
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
async function Rn(t, e) {
  return be.fromSource(Fn(t), e);
}
function vn(t, e, A, o = 64, I = 64) {
  const [r, C, B, y] = e, [n, i, a, f] = A, s = t.width / (B - r), g = t.height / (y - C), u = (n - r) * s, l = (y - f) * g, c = (a - r) * s, h = (y - i) * g, D = [u, l, c, h];
  return Nn(t.buffer, t.width, t.height, D, o, I, 0);
}
function Nn(t, e, A, o, I, r, C = 0) {
  if (t.length !== e * A)
    throw new Error("Buffer size does not match width and height");
  const [B, y, n, i] = o, a = Math.min(B, n), f = Math.max(B, n), s = Math.min(y, i), g = Math.max(y, i), u = new Float32Array(I * r), l = (f - a) / I, c = (g - s) / r;
  for (let h = 0; h < r; h++)
    for (let D = 0; D < I; D++) {
      const Q = a + D * l, x = s + h * c, E = h * I + D;
      if (Q < 0 || Q >= e || x < 0 || x >= A) {
        u[E] = C;
        continue;
      }
      const d = Math.floor(Q), w = Math.floor(x), k = Math.min(d + 1, e - 1), F = Math.min(w + 1, A - 1);
      if (!(d > a && d < f && w > s && w < g)) {
        u[E] = t[w * e + d] + 1e3;
        continue;
      }
      const M = Q - d, G = x - w, J = t[w * e + d], S = t[F * e + d], p = t[w * e + k], R = t[F * e + k], U = J * (1 - M) * (1 - G) + p * M * (1 - G) + S * (1 - M) * G + R * M * G;
      console.assert(!isNaN(U)), u[E] = U + 1e3;
    }
  return u;
}
class Tn {
  info = {
    version: "0.10.0",
    description: "TIF DEM terrain loader. It can load single tif dem."
  };
  // 数据标识
  dataType = "tif-dem";
  // 数据加载器
  _loader = new Bi(Qt.manager);
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
    const { source: A, z: o, bounds: I } = e, r = new ri(), C = A._getUrl(0, 0, 0);
    if (o < A.minLevel || o > A.maxLevel || !C)
      return r;
    const B = li.clamp((e.z + 2) * 3, 2, 128);
    if (!A.data) {
      console.log("load image...", C);
      const n = await this._loader.loadAsync(C);
      A.data = await this.getTIFFRaster(n);
    }
    const y = await this.getTileDEM(A.data, A._projectionBounds, I, B);
    return r.setData(y);
  }
  /**
   * 从 ArrayBuffer 中读取 TIFF 图像的栅格数据
   * @param buffer 包含 TIFF 图像数据的 ArrayBuffer
   * @returns 包含栅格数据的对象，包含 buffer、width 和 height 属性
   */
  async getTIFFRaster(e) {
    const o = await (await (await Rn(e)).getImage(0)).readRasters();
    return {
      // 第一个波段的栅格数据，强制转换为 Float32Array 类型
      buffer: o[0],
      // 栅格数据的宽度
      width: o.width,
      // 栅格数据的高度
      height: o.height
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
  async getTileDEM(e, A, o, I) {
    return vn(e, A, o, I, I).map((C) => C / 1e3);
  }
}
class Oo extends Z {
  dataType = "tif-dem";
  data;
}
oi(new Tn());
class qn {
  info = {
    version: "0.10.0",
    description: "Tile wireframe material loader."
  };
  dataType = "wireframe";
  async load(e) {
    const A = new Ci(`hsl(${e.z * 14}, 100%, 50%)`);
    return new fi({
      transparent: !0,
      wireframe: !0,
      color: A,
      opacity: e.source.opacity,
      depthTest: !1
    });
  }
}
UA(new qn());
class Jn extends Z {
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
class Yn extends Z {
  dataType = "image";
  attribution = "ArcGIS";
  style = "World_Imagery";
  url = "https://services.arcgisonline.com/arcgis/rest/services/{style}/MapServer/tile/{z}/{y}/{x}";
  constructor(e) {
    super(e), Object.assign(this, e);
  }
}
class On extends Z {
  dataType = "lerc";
  attribution = "ArcGIS";
  minLevel = 6;
  maxLevel = 13;
  url = "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer/tile/{z}/{y}/{x}";
  constructor(e) {
    super(e), Object.assign(this, e);
  }
}
class Kn extends Z {
  dataType = "image";
  attribution = "Bing[GS(2021)1731号]";
  style = "A";
  mkt = "zh-CN";
  subdomains = "123";
  constructor(e) {
    super(e), Object.assign(this, e);
  }
  getUrl(e, A, o) {
    const I = Hn(o, e, A);
    return `https://t${this.s}.dynamic.tiles.ditu.live.com/comp/ch/${I}?mkt=${this.mkt}&ur=CN&it=${this.style}&n=z&og=804&cstl=vb`;
  }
}
function Hn(t, e, A) {
  let o = "";
  for (let I = t; I > 0; I--) {
    const r = 1 << I - 1;
    let C = 0;
    e & r && C++, A & r && (C += 2), o += C;
  }
  return o;
}
class _n extends Z {
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
class Vn extends Z {
  dataType = "image";
  maxLevel = 16;
  attribution = "GeoQ[GS(2019)758号]";
  style = "ChinaOnlineStreetPurplishBlue";
  url = "https://map.geoq.cn/ArcGIS/rest/services/{style}/MapServer/tile/{z}/{y}/{x}";
  constructor(e) {
    super(e), Object.assign(this, e);
  }
}
class Xn extends Z {
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
class jn extends Z {
  attribution = "MapTiler";
  token = "get_your_own_key_QmavnBrQwNGsQ8YvPzZg";
  format = "jpg";
  style = "satellite-v2";
  url = "https://api.maptiler.com/tiles/{style}/{z}/{x}/{y}.{format}?key={token}";
  constructor(e) {
    super(e), Object.assign(this, e);
  }
}
class Pn extends Z {
  dataType = "image";
  attribution = "Stadia";
  url = "https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}.jpg";
  constructor(e) {
    super(e), Object.assign(this, e);
  }
}
class Zn extends Z {
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
class zn extends Z {
  dataType = "quantized-mesh";
  attribution = "天地图[GS(2023)336号]";
  token = "";
  subdomains = "01234";
  url = "https://t{s}.tianditu.gov.cn/mapservice/swdx?T=elv_c&tk={token}&x={x}&y={y}&l={z}";
  constructor(e) {
    super(e), Object.assign(this, e);
  }
}
class Wn extends Z {
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
  _getUrl(e, A, o) {
    return this.sx = e >> 4, this.sy = (1 << o) - A >> 4, super._getUrl(e, A, o);
  }
}
class $n extends Z {
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
class Ar extends Z {
  dataType = "quantized-mesh";
  attribution = "中科星图[GS(2022)3995号]";
  token = "";
  subdomains = "012";
  url = "https://tiles{s}.geovisearth.com/base/v1/terrain/{z}/{x}/{y}.terrain&token={token}";
  constructor(e) {
    super(e), Object.assign(this, e);
  }
}
const Ko = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ArcGisDemSource: On,
  ArcGisSource: Yn,
  BingSource: Kn,
  GDSource: _n,
  GeoqSource: Vn,
  GoogleSource: Xn,
  MapBoxSource: Jn,
  MapTilerSource: jn,
  StadiaSource: Pn,
  TDTQMSource: zn,
  TDTSource: Zn,
  TXSource: Wn,
  ZKXTQMSource: Ar,
  ZKXTSource: $n
}, Symbol.toStringTag, { value: "Module" }));
class er extends EA {
  decodeBlock(e) {
    return e;
  }
}
const tr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: er
}, Symbol.toStringTag, { value: "Module" })), Ne = 9, te = 256, ce = 257, ir = 12;
function nr(t, e, A) {
  const o = e % 8, I = Math.floor(e / 8), r = 8 - o, C = e + A - (I + 1) * 8;
  let B = 8 * (I + 2) - (e + A);
  const y = (I + 2) * 8 - e;
  if (B = Math.max(0, B), I >= t.length)
    return console.warn("ran off the end of the buffer before finding EOI_CODE (end on input code)"), ce;
  let n = t[I] & 2 ** (8 - o) - 1;
  n <<= A - r;
  let i = n;
  if (I + 1 < t.length) {
    let a = t[I + 1] >>> B;
    a <<= Math.max(0, A - y), i += a;
  }
  if (C > 8 && I + 2 < t.length) {
    const a = (I + 3) * 8 - (e + A), f = t[I + 2] >>> a;
    i += f;
  }
  return i;
}
function ie(t, e) {
  for (let A = e.length - 1; A >= 0; A--)
    t.push(e[A]);
  return t;
}
function rr(t) {
  const e = new Uint16Array(4093), A = new Uint8Array(4093);
  for (let g = 0; g <= 257; g++)
    e[g] = 4096, A[g] = g;
  let o = 258, I = Ne, r = 0;
  function C() {
    o = 258, I = Ne;
  }
  function B(g) {
    const u = nr(g, r, I);
    return r += I, u;
  }
  function y(g, u) {
    return A[o] = u, e[o] = g, o++, o - 1;
  }
  function n(g) {
    const u = [];
    for (let l = g; l !== 4096; l = e[l])
      u.push(A[l]);
    return u;
  }
  const i = [];
  C();
  const a = new Uint8Array(t);
  let f = B(a), s;
  for (; f !== ce; ) {
    if (f === te) {
      for (C(), f = B(a); f === te; )
        f = B(a);
      if (f === ce)
        break;
      if (f > te)
        throw new Error(`corrupted code at scanline ${f}`);
      {
        const g = n(f);
        ie(i, g), s = f;
      }
    } else if (f < o) {
      const g = n(f);
      ie(i, g), y(s, g[g.length - 1]), s = f;
    } else {
      const g = n(s);
      if (!g)
        throw new Error(`Bogus entry. Not in dictionary, ${s} / ${o}, position: ${r}`);
      ie(i, g), i.push(g[g.length - 1]), y(s, g[g.length - 1]), s = f;
    }
    o + 1 >= 2 ** I && (I === ir ? s = void 0 : I++), f = B(a);
  }
  return new Uint8Array(i);
}
class or extends EA {
  decodeBlock(e) {
    return rr(e).buffer;
  }
}
const sr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: or
}, Symbol.toStringTag, { value: "Module" })), kA = new Int32Array([
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
]), vA = 4017, NA = 799, TA = 3406, qA = 2276, JA = 1567, YA = 3784, uA = 5793, OA = 2896;
function Te(t, e) {
  let A = 0;
  const o = [];
  let I = 16;
  for (; I > 0 && !t[I - 1]; )
    --I;
  o.push({ children: [], index: 0 });
  let r = o[0], C;
  for (let B = 0; B < I; B++) {
    for (let y = 0; y < t[B]; y++) {
      for (r = o.pop(), r.children[r.index] = e[A]; r.index > 0; )
        r = o.pop();
      for (r.index++, o.push(r); o.length <= B; )
        o.push(C = { children: [], index: 0 }), r.children[r.index] = C.children, r = C;
      A++;
    }
    B + 1 < I && (o.push(C = { children: [], index: 0 }), r.children[r.index] = C.children, r = C);
  }
  return o[0].children;
}
function ar(t, e, A, o, I, r, C, B, y) {
  const { mcusPerLine: n, progressive: i } = A, a = e;
  let f = e, s = 0, g = 0;
  function u() {
    if (g > 0)
      return g--, s >> g & 1;
    if (s = t[f++], s === 255) {
      const b = t[f++];
      if (b)
        throw new Error(`unexpected marker: ${(s << 8 | b).toString(16)}`);
    }
    return g = 7, s >>> 7;
  }
  function l(b) {
    let q = b, T;
    for (; (T = u()) !== null; ) {
      if (q = q[T], typeof q == "number")
        return q;
      if (typeof q != "object")
        throw new Error("invalid huffman sequence");
    }
    return null;
  }
  function c(b) {
    let q = b, T = 0;
    for (; q > 0; ) {
      const O = u();
      if (O === null)
        return;
      T = T << 1 | O, --q;
    }
    return T;
  }
  function h(b) {
    const q = c(b);
    return q >= 1 << b - 1 ? q : q + (-1 << b) + 1;
  }
  function D(b, q) {
    const T = l(b.huffmanTableDC), O = T === 0 ? 0 : h(T);
    b.pred += O, q[0] = b.pred;
    let H = 1;
    for (; H < 64; ) {
      const X = l(b.huffmanTableAC), j = X & 15, $ = X >> 4;
      if (j === 0) {
        if ($ < 15)
          break;
        H += 16;
      } else {
        H += $;
        const W = kA[H];
        q[W] = h(j), H++;
      }
    }
  }
  function Q(b, q) {
    const T = l(b.huffmanTableDC), O = T === 0 ? 0 : h(T) << y;
    b.pred += O, q[0] = b.pred;
  }
  function x(b, q) {
    q[0] |= u() << y;
  }
  let E = 0;
  function d(b, q) {
    if (E > 0) {
      E--;
      return;
    }
    let T = r;
    const O = C;
    for (; T <= O; ) {
      const H = l(b.huffmanTableAC), X = H & 15, j = H >> 4;
      if (X === 0) {
        if (j < 15) {
          E = c(j) + (1 << j) - 1;
          break;
        }
        T += 16;
      } else {
        T += j;
        const $ = kA[T];
        q[$] = h(X) * (1 << y), T++;
      }
    }
  }
  let w = 0, k;
  function F(b, q) {
    let T = r;
    const O = C;
    let H = 0;
    for (; T <= O; ) {
      const X = kA[T], j = q[X] < 0 ? -1 : 1;
      switch (w) {
        case 0: {
          const $ = l(b.huffmanTableAC), W = $ & 15;
          if (H = $ >> 4, W === 0)
            H < 15 ? (E = c(H) + (1 << H), w = 4) : (H = 16, w = 1);
          else {
            if (W !== 1)
              throw new Error("invalid ACn encoding");
            k = h(W), w = H ? 2 : 3;
          }
          continue;
        }
        case 1:
        case 2:
          q[X] ? q[X] += (u() << y) * j : (H--, H === 0 && (w = w === 2 ? 3 : 0));
          break;
        case 3:
          q[X] ? q[X] += (u() << y) * j : (q[X] = k << y, w = 0);
          break;
        case 4:
          q[X] && (q[X] += (u() << y) * j);
          break;
      }
      T++;
    }
    w === 4 && (E--, E === 0 && (w = 0));
  }
  function m(b, q, T, O, H) {
    const X = T / n | 0, j = T % n, $ = X * b.v + O, W = j * b.h + H;
    q(b, b.blocks[$][W]);
  }
  function M(b, q, T) {
    const O = T / b.blocksPerLine | 0, H = T % b.blocksPerLine;
    q(b, b.blocks[O][H]);
  }
  const G = o.length;
  let J, S, p, R, U, L;
  i ? r === 0 ? L = B === 0 ? Q : x : L = B === 0 ? d : F : L = D;
  let N = 0, v, K;
  G === 1 ? K = o[0].blocksPerLine * o[0].blocksPerColumn : K = n * A.mcusPerColumn;
  const _ = I || K;
  for (; N < K; ) {
    for (S = 0; S < G; S++)
      o[S].pred = 0;
    if (E = 0, G === 1)
      for (J = o[0], U = 0; U < _; U++)
        M(J, L, N), N++;
    else
      for (U = 0; U < _; U++) {
        for (S = 0; S < G; S++) {
          J = o[S];
          const { h: b, v: q } = J;
          for (p = 0; p < q; p++)
            for (R = 0; R < b; R++)
              m(J, L, N, p, R);
        }
        if (N++, N === K)
          break;
      }
    if (g = 0, v = t[f] << 8 | t[f + 1], v < 65280)
      throw new Error("marker was not found");
    if (v >= 65488 && v <= 65495)
      f += 2;
    else
      break;
  }
  return f - a;
}
function gr(t, e) {
  const A = [], { blocksPerLine: o, blocksPerColumn: I } = e, r = o << 3, C = new Int32Array(64), B = new Uint8Array(64);
  function y(n, i, a) {
    const f = e.quantizationTable;
    let s, g, u, l, c, h, D, Q, x;
    const E = a;
    let d;
    for (d = 0; d < 64; d++)
      E[d] = n[d] * f[d];
    for (d = 0; d < 8; ++d) {
      const w = 8 * d;
      if (E[1 + w] === 0 && E[2 + w] === 0 && E[3 + w] === 0 && E[4 + w] === 0 && E[5 + w] === 0 && E[6 + w] === 0 && E[7 + w] === 0) {
        x = uA * E[0 + w] + 512 >> 10, E[0 + w] = x, E[1 + w] = x, E[2 + w] = x, E[3 + w] = x, E[4 + w] = x, E[5 + w] = x, E[6 + w] = x, E[7 + w] = x;
        continue;
      }
      s = uA * E[0 + w] + 128 >> 8, g = uA * E[4 + w] + 128 >> 8, u = E[2 + w], l = E[6 + w], c = OA * (E[1 + w] - E[7 + w]) + 128 >> 8, Q = OA * (E[1 + w] + E[7 + w]) + 128 >> 8, h = E[3 + w] << 4, D = E[5 + w] << 4, x = s - g + 1 >> 1, s = s + g + 1 >> 1, g = x, x = u * YA + l * JA + 128 >> 8, u = u * JA - l * YA + 128 >> 8, l = x, x = c - D + 1 >> 1, c = c + D + 1 >> 1, D = x, x = Q + h + 1 >> 1, h = Q - h + 1 >> 1, Q = x, x = s - l + 1 >> 1, s = s + l + 1 >> 1, l = x, x = g - u + 1 >> 1, g = g + u + 1 >> 1, u = x, x = c * qA + Q * TA + 2048 >> 12, c = c * TA - Q * qA + 2048 >> 12, Q = x, x = h * NA + D * vA + 2048 >> 12, h = h * vA - D * NA + 2048 >> 12, D = x, E[0 + w] = s + Q, E[7 + w] = s - Q, E[1 + w] = g + D, E[6 + w] = g - D, E[2 + w] = u + h, E[5 + w] = u - h, E[3 + w] = l + c, E[4 + w] = l - c;
    }
    for (d = 0; d < 8; ++d) {
      const w = d;
      if (E[1 * 8 + w] === 0 && E[2 * 8 + w] === 0 && E[3 * 8 + w] === 0 && E[4 * 8 + w] === 0 && E[5 * 8 + w] === 0 && E[6 * 8 + w] === 0 && E[7 * 8 + w] === 0) {
        x = uA * a[d + 0] + 8192 >> 14, E[0 * 8 + w] = x, E[1 * 8 + w] = x, E[2 * 8 + w] = x, E[3 * 8 + w] = x, E[4 * 8 + w] = x, E[5 * 8 + w] = x, E[6 * 8 + w] = x, E[7 * 8 + w] = x;
        continue;
      }
      s = uA * E[0 * 8 + w] + 2048 >> 12, g = uA * E[4 * 8 + w] + 2048 >> 12, u = E[2 * 8 + w], l = E[6 * 8 + w], c = OA * (E[1 * 8 + w] - E[7 * 8 + w]) + 2048 >> 12, Q = OA * (E[1 * 8 + w] + E[7 * 8 + w]) + 2048 >> 12, h = E[3 * 8 + w], D = E[5 * 8 + w], x = s - g + 1 >> 1, s = s + g + 1 >> 1, g = x, x = u * YA + l * JA + 2048 >> 12, u = u * JA - l * YA + 2048 >> 12, l = x, x = c - D + 1 >> 1, c = c + D + 1 >> 1, D = x, x = Q + h + 1 >> 1, h = Q - h + 1 >> 1, Q = x, x = s - l + 1 >> 1, s = s + l + 1 >> 1, l = x, x = g - u + 1 >> 1, g = g + u + 1 >> 1, u = x, x = c * qA + Q * TA + 2048 >> 12, c = c * TA - Q * qA + 2048 >> 12, Q = x, x = h * NA + D * vA + 2048 >> 12, h = h * vA - D * NA + 2048 >> 12, D = x, E[0 * 8 + w] = s + Q, E[7 * 8 + w] = s - Q, E[1 * 8 + w] = g + D, E[6 * 8 + w] = g - D, E[2 * 8 + w] = u + h, E[5 * 8 + w] = u - h, E[3 * 8 + w] = l + c, E[4 * 8 + w] = l - c;
    }
    for (d = 0; d < 64; ++d) {
      const w = 128 + (E[d] + 8 >> 4);
      w < 0 ? i[d] = 0 : w > 255 ? i[d] = 255 : i[d] = w;
    }
  }
  for (let n = 0; n < I; n++) {
    const i = n << 3;
    for (let a = 0; a < 8; a++)
      A.push(new Uint8Array(r));
    for (let a = 0; a < o; a++) {
      y(e.blocks[n][a], B, C);
      let f = 0;
      const s = a << 3;
      for (let g = 0; g < 8; g++) {
        const u = A[i + g];
        for (let l = 0; l < 8; l++)
          u[s + l] = B[f++];
      }
    }
  }
  return A;
}
class Ir {
  constructor() {
    this.jfif = null, this.adobe = null, this.quantizationTables = [], this.huffmanTablesAC = [], this.huffmanTablesDC = [], this.resetFrames();
  }
  resetFrames() {
    this.frames = [];
  }
  parse(e) {
    let A = 0;
    function o() {
      const B = e[A] << 8 | e[A + 1];
      return A += 2, B;
    }
    function I() {
      const B = o(), y = e.subarray(A, A + B - 2);
      return A += y.length, y;
    }
    function r(B) {
      let y = 0, n = 0, i, a;
      for (a in B.components)
        B.components.hasOwnProperty(a) && (i = B.components[a], y < i.h && (y = i.h), n < i.v && (n = i.v));
      const f = Math.ceil(B.samplesPerLine / 8 / y), s = Math.ceil(B.scanLines / 8 / n);
      for (a in B.components)
        if (B.components.hasOwnProperty(a)) {
          i = B.components[a];
          const g = Math.ceil(Math.ceil(B.samplesPerLine / 8) * i.h / y), u = Math.ceil(Math.ceil(B.scanLines / 8) * i.v / n), l = f * i.h, c = s * i.v, h = [];
          for (let D = 0; D < c; D++) {
            const Q = [];
            for (let x = 0; x < l; x++)
              Q.push(new Int32Array(64));
            h.push(Q);
          }
          i.blocksPerLine = g, i.blocksPerColumn = u, i.blocks = h;
        }
      B.maxH = y, B.maxV = n, B.mcusPerLine = f, B.mcusPerColumn = s;
    }
    let C = o();
    if (C !== 65496)
      throw new Error("SOI not found");
    for (C = o(); C !== 65497; ) {
      switch (C) {
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
          const B = I();
          C === 65504 && B[0] === 74 && B[1] === 70 && B[2] === 73 && B[3] === 70 && B[4] === 0 && (this.jfif = {
            version: { major: B[5], minor: B[6] },
            densityUnits: B[7],
            xDensity: B[8] << 8 | B[9],
            yDensity: B[10] << 8 | B[11],
            thumbWidth: B[12],
            thumbHeight: B[13],
            thumbData: B.subarray(14, 14 + 3 * B[12] * B[13])
          }), C === 65518 && B[0] === 65 && B[1] === 100 && B[2] === 111 && B[3] === 98 && B[4] === 101 && B[5] === 0 && (this.adobe = {
            version: B[6],
            flags0: B[7] << 8 | B[8],
            flags1: B[9] << 8 | B[10],
            transformCode: B[11]
          });
          break;
        }
        case 65499: {
          const y = o() + A - 2;
          for (; A < y; ) {
            const n = e[A++], i = new Int32Array(64);
            if (n >> 4)
              if (n >> 4 === 1)
                for (let a = 0; a < 64; a++) {
                  const f = kA[a];
                  i[f] = o();
                }
              else
                throw new Error("DQT: invalid table spec");
            else for (let a = 0; a < 64; a++) {
              const f = kA[a];
              i[f] = e[A++];
            }
            this.quantizationTables[n & 15] = i;
          }
          break;
        }
        case 65472:
        case 65473:
        case 65474: {
          o();
          const B = {
            extended: C === 65473,
            progressive: C === 65474,
            precision: e[A++],
            scanLines: o(),
            samplesPerLine: o(),
            components: {},
            componentsOrder: []
          }, y = e[A++];
          let n;
          for (let i = 0; i < y; i++) {
            n = e[A];
            const a = e[A + 1] >> 4, f = e[A + 1] & 15, s = e[A + 2];
            B.componentsOrder.push(n), B.components[n] = {
              h: a,
              v: f,
              quantizationIdx: s
            }, A += 3;
          }
          r(B), this.frames.push(B);
          break;
        }
        case 65476: {
          const B = o();
          for (let y = 2; y < B; ) {
            const n = e[A++], i = new Uint8Array(16);
            let a = 0;
            for (let s = 0; s < 16; s++, A++)
              i[s] = e[A], a += i[s];
            const f = new Uint8Array(a);
            for (let s = 0; s < a; s++, A++)
              f[s] = e[A];
            y += 17 + a, n >> 4 ? this.huffmanTablesAC[n & 15] = Te(
              i,
              f
            ) : this.huffmanTablesDC[n & 15] = Te(
              i,
              f
            );
          }
          break;
        }
        case 65501:
          o(), this.resetInterval = o();
          break;
        case 65498: {
          o();
          const B = e[A++], y = [], n = this.frames[0];
          for (let g = 0; g < B; g++) {
            const u = n.components[e[A++]], l = e[A++];
            u.huffmanTableDC = this.huffmanTablesDC[l >> 4], u.huffmanTableAC = this.huffmanTablesAC[l & 15], y.push(u);
          }
          const i = e[A++], a = e[A++], f = e[A++], s = ar(
            e,
            A,
            n,
            y,
            this.resetInterval,
            i,
            a,
            f >> 4,
            f & 15
          );
          A += s;
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
          throw new Error(`unknown JPEG marker ${C.toString(16)}`);
      }
      C = o();
    }
  }
  getResult() {
    const { frames: e } = this;
    if (this.frames.length === 0)
      throw new Error("no frames were decoded");
    this.frames.length > 1 && console.warn("more than one frame is not supported");
    for (let i = 0; i < this.frames.length; i++) {
      const a = this.frames[i].components;
      for (const f of Object.keys(a))
        a[f].quantizationTable = this.quantizationTables[a[f].quantizationIdx], delete a[f].quantizationIdx;
    }
    const A = e[0], { components: o, componentsOrder: I } = A, r = [], C = A.samplesPerLine, B = A.scanLines;
    for (let i = 0; i < I.length; i++) {
      const a = o[I[i]];
      r.push({
        lines: gr(A, a),
        scaleX: a.h / A.maxH,
        scaleY: a.v / A.maxV
      });
    }
    const y = new Uint8Array(C * B * r.length);
    let n = 0;
    for (let i = 0; i < B; ++i)
      for (let a = 0; a < C; ++a)
        for (let f = 0; f < r.length; ++f) {
          const s = r[f];
          y[n] = s.lines[0 | i * s.scaleY][0 | a * s.scaleX], ++n;
        }
    return y;
  }
}
class Br extends EA {
  constructor(e) {
    super(), this.reader = new Ir(), e.JPEGTables && this.reader.parse(e.JPEGTables);
  }
  decodeBlock(e) {
    return this.reader.resetFrames(), this.reader.parse(new Uint8Array(e)), this.reader.getResult().buffer;
  }
}
const lr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Br
}, Symbol.toStringTag, { value: "Module" }));
function xA(t) {
  let e = t.length;
  for (; --e >= 0; )
    t[e] = 0;
}
const Cr = 3, fr = 258, Nt = 29, cr = 256, Er = cr + 1 + Nt, Tt = 30, Qr = 512, hr = new Array((Er + 2) * 2);
xA(hr);
const ur = new Array(Tt * 2);
xA(ur);
const dr = new Array(Qr);
xA(dr);
const wr = new Array(fr - Cr + 1);
xA(wr);
const Dr = new Array(Nt);
xA(Dr);
const yr = new Array(Tt);
xA(yr);
const xr = (t, e, A, o) => {
  let I = t & 65535 | 0, r = t >>> 16 & 65535 | 0, C = 0;
  for (; A !== 0; ) {
    C = A > 2e3 ? 2e3 : A, A -= C;
    do
      I = I + e[o++] | 0, r = r + I | 0;
    while (--C);
    I %= 65521, r %= 65521;
  }
  return I | r << 16 | 0;
};
var Ee = xr;
const mr = () => {
  let t, e = [];
  for (var A = 0; A < 256; A++) {
    t = A;
    for (var o = 0; o < 8; o++)
      t = t & 1 ? 3988292384 ^ t >>> 1 : t >>> 1;
    e[A] = t;
  }
  return e;
}, pr = new Uint32Array(mr()), kr = (t, e, A, o) => {
  const I = pr, r = o + A;
  t ^= -1;
  for (let C = o; C < r; C++)
    t = t >>> 8 ^ I[(t ^ e[C]) & 255];
  return t ^ -1;
};
var oA = kr, Qe = {
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
}, qt = {
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
const Fr = (t, e) => Object.prototype.hasOwnProperty.call(t, e);
var Sr = function(t) {
  const e = Array.prototype.slice.call(arguments, 1);
  for (; e.length; ) {
    const A = e.shift();
    if (A) {
      if (typeof A != "object")
        throw new TypeError(A + "must be non-object");
      for (const o in A)
        Fr(A, o) && (t[o] = A[o]);
    }
  }
  return t;
}, Gr = (t) => {
  let e = 0;
  for (let o = 0, I = t.length; o < I; o++)
    e += t[o].length;
  const A = new Uint8Array(e);
  for (let o = 0, I = 0, r = t.length; o < r; o++) {
    let C = t[o];
    A.set(C, I), I += C.length;
  }
  return A;
}, Jt = {
  assign: Sr,
  flattenChunks: Gr
};
let Yt = !0;
try {
  String.fromCharCode.apply(null, new Uint8Array(1));
} catch {
  Yt = !1;
}
const GA = new Uint8Array(256);
for (let t = 0; t < 256; t++)
  GA[t] = t >= 252 ? 6 : t >= 248 ? 5 : t >= 240 ? 4 : t >= 224 ? 3 : t >= 192 ? 2 : 1;
GA[254] = GA[254] = 1;
var Mr = (t) => {
  if (typeof TextEncoder == "function" && TextEncoder.prototype.encode)
    return new TextEncoder().encode(t);
  let e, A, o, I, r, C = t.length, B = 0;
  for (I = 0; I < C; I++)
    A = t.charCodeAt(I), (A & 64512) === 55296 && I + 1 < C && (o = t.charCodeAt(I + 1), (o & 64512) === 56320 && (A = 65536 + (A - 55296 << 10) + (o - 56320), I++)), B += A < 128 ? 1 : A < 2048 ? 2 : A < 65536 ? 3 : 4;
  for (e = new Uint8Array(B), r = 0, I = 0; r < B; I++)
    A = t.charCodeAt(I), (A & 64512) === 55296 && I + 1 < C && (o = t.charCodeAt(I + 1), (o & 64512) === 56320 && (A = 65536 + (A - 55296 << 10) + (o - 56320), I++)), A < 128 ? e[r++] = A : A < 2048 ? (e[r++] = 192 | A >>> 6, e[r++] = 128 | A & 63) : A < 65536 ? (e[r++] = 224 | A >>> 12, e[r++] = 128 | A >>> 6 & 63, e[r++] = 128 | A & 63) : (e[r++] = 240 | A >>> 18, e[r++] = 128 | A >>> 12 & 63, e[r++] = 128 | A >>> 6 & 63, e[r++] = 128 | A & 63);
  return e;
};
const Ur = (t, e) => {
  if (e < 65534 && t.subarray && Yt)
    return String.fromCharCode.apply(null, t.length === e ? t : t.subarray(0, e));
  let A = "";
  for (let o = 0; o < e; o++)
    A += String.fromCharCode(t[o]);
  return A;
};
var br = (t, e) => {
  const A = e || t.length;
  if (typeof TextDecoder == "function" && TextDecoder.prototype.decode)
    return new TextDecoder().decode(t.subarray(0, e));
  let o, I;
  const r = new Array(A * 2);
  for (I = 0, o = 0; o < A; ) {
    let C = t[o++];
    if (C < 128) {
      r[I++] = C;
      continue;
    }
    let B = GA[C];
    if (B > 4) {
      r[I++] = 65533, o += B - 1;
      continue;
    }
    for (C &= B === 2 ? 31 : B === 3 ? 15 : 7; B > 1 && o < A; )
      C = C << 6 | t[o++] & 63, B--;
    if (B > 1) {
      r[I++] = 65533;
      continue;
    }
    C < 65536 ? r[I++] = C : (C -= 65536, r[I++] = 55296 | C >> 10 & 1023, r[I++] = 56320 | C & 1023);
  }
  return Ur(r, I);
}, Lr = (t, e) => {
  e = e || t.length, e > t.length && (e = t.length);
  let A = e - 1;
  for (; A >= 0 && (t[A] & 192) === 128; )
    A--;
  return A < 0 || A === 0 ? e : A + GA[t[A]] > e ? A : e;
}, he = {
  string2buf: Mr,
  buf2string: br,
  utf8border: Lr
};
function Rr() {
  this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
}
var vr = Rr;
const KA = 16209, Nr = 16191;
var Tr = function(e, A) {
  let o, I, r, C, B, y, n, i, a, f, s, g, u, l, c, h, D, Q, x, E, d, w, k, F;
  const m = e.state;
  o = e.next_in, k = e.input, I = o + (e.avail_in - 5), r = e.next_out, F = e.output, C = r - (A - e.avail_out), B = r + (e.avail_out - 257), y = m.dmax, n = m.wsize, i = m.whave, a = m.wnext, f = m.window, s = m.hold, g = m.bits, u = m.lencode, l = m.distcode, c = (1 << m.lenbits) - 1, h = (1 << m.distbits) - 1;
  A:
    do {
      g < 15 && (s += k[o++] << g, g += 8, s += k[o++] << g, g += 8), D = u[s & c];
      e:
        for (; ; ) {
          if (Q = D >>> 24, s >>>= Q, g -= Q, Q = D >>> 16 & 255, Q === 0)
            F[r++] = D & 65535;
          else if (Q & 16) {
            x = D & 65535, Q &= 15, Q && (g < Q && (s += k[o++] << g, g += 8), x += s & (1 << Q) - 1, s >>>= Q, g -= Q), g < 15 && (s += k[o++] << g, g += 8, s += k[o++] << g, g += 8), D = l[s & h];
            t:
              for (; ; ) {
                if (Q = D >>> 24, s >>>= Q, g -= Q, Q = D >>> 16 & 255, Q & 16) {
                  if (E = D & 65535, Q &= 15, g < Q && (s += k[o++] << g, g += 8, g < Q && (s += k[o++] << g, g += 8)), E += s & (1 << Q) - 1, E > y) {
                    e.msg = "invalid distance too far back", m.mode = KA;
                    break A;
                  }
                  if (s >>>= Q, g -= Q, Q = r - C, E > Q) {
                    if (Q = E - Q, Q > i && m.sane) {
                      e.msg = "invalid distance too far back", m.mode = KA;
                      break A;
                    }
                    if (d = 0, w = f, a === 0) {
                      if (d += n - Q, Q < x) {
                        x -= Q;
                        do
                          F[r++] = f[d++];
                        while (--Q);
                        d = r - E, w = F;
                      }
                    } else if (a < Q) {
                      if (d += n + a - Q, Q -= a, Q < x) {
                        x -= Q;
                        do
                          F[r++] = f[d++];
                        while (--Q);
                        if (d = 0, a < x) {
                          Q = a, x -= Q;
                          do
                            F[r++] = f[d++];
                          while (--Q);
                          d = r - E, w = F;
                        }
                      }
                    } else if (d += a - Q, Q < x) {
                      x -= Q;
                      do
                        F[r++] = f[d++];
                      while (--Q);
                      d = r - E, w = F;
                    }
                    for (; x > 2; )
                      F[r++] = w[d++], F[r++] = w[d++], F[r++] = w[d++], x -= 3;
                    x && (F[r++] = w[d++], x > 1 && (F[r++] = w[d++]));
                  } else {
                    d = r - E;
                    do
                      F[r++] = F[d++], F[r++] = F[d++], F[r++] = F[d++], x -= 3;
                    while (x > 2);
                    x && (F[r++] = F[d++], x > 1 && (F[r++] = F[d++]));
                  }
                } else if (Q & 64) {
                  e.msg = "invalid distance code", m.mode = KA;
                  break A;
                } else {
                  D = l[(D & 65535) + (s & (1 << Q) - 1)];
                  continue t;
                }
                break;
              }
          } else if (Q & 64)
            if (Q & 32) {
              m.mode = Nr;
              break A;
            } else {
              e.msg = "invalid literal/length code", m.mode = KA;
              break A;
            }
          else {
            D = u[(D & 65535) + (s & (1 << Q) - 1)];
            continue e;
          }
          break;
        }
    } while (o < I && r < B);
  x = g >> 3, o -= x, g -= x << 3, s &= (1 << g) - 1, e.next_in = o, e.next_out = r, e.avail_in = o < I ? 5 + (I - o) : 5 - (o - I), e.avail_out = r < B ? 257 + (B - r) : 257 - (r - B), m.hold = s, m.bits = g;
};
const dA = 15, qe = 852, Je = 592, Ye = 0, ne = 1, Oe = 2, qr = new Uint16Array([
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
]), Jr = new Uint8Array([
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
]), Yr = new Uint16Array([
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
]), Or = new Uint8Array([
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
]), Kr = (t, e, A, o, I, r, C, B) => {
  const y = B.bits;
  let n = 0, i = 0, a = 0, f = 0, s = 0, g = 0, u = 0, l = 0, c = 0, h = 0, D, Q, x, E, d, w = null, k;
  const F = new Uint16Array(dA + 1), m = new Uint16Array(dA + 1);
  let M = null, G, J, S;
  for (n = 0; n <= dA; n++)
    F[n] = 0;
  for (i = 0; i < o; i++)
    F[e[A + i]]++;
  for (s = y, f = dA; f >= 1 && F[f] === 0; f--)
    ;
  if (s > f && (s = f), f === 0)
    return I[r++] = 1 << 24 | 64 << 16 | 0, I[r++] = 1 << 24 | 64 << 16 | 0, B.bits = 1, 0;
  for (a = 1; a < f && F[a] === 0; a++)
    ;
  for (s < a && (s = a), l = 1, n = 1; n <= dA; n++)
    if (l <<= 1, l -= F[n], l < 0)
      return -1;
  if (l > 0 && (t === Ye || f !== 1))
    return -1;
  for (m[1] = 0, n = 1; n < dA; n++)
    m[n + 1] = m[n] + F[n];
  for (i = 0; i < o; i++)
    e[A + i] !== 0 && (C[m[e[A + i]]++] = i);
  if (t === Ye ? (w = M = C, k = 20) : t === ne ? (w = qr, M = Jr, k = 257) : (w = Yr, M = Or, k = 0), h = 0, i = 0, n = a, d = r, g = s, u = 0, x = -1, c = 1 << s, E = c - 1, t === ne && c > qe || t === Oe && c > Je)
    return 1;
  for (; ; ) {
    G = n - u, C[i] + 1 < k ? (J = 0, S = C[i]) : C[i] >= k ? (J = M[C[i] - k], S = w[C[i] - k]) : (J = 96, S = 0), D = 1 << n - u, Q = 1 << g, a = Q;
    do
      Q -= D, I[d + (h >> u) + Q] = G << 24 | J << 16 | S | 0;
    while (Q !== 0);
    for (D = 1 << n - 1; h & D; )
      D >>= 1;
    if (D !== 0 ? (h &= D - 1, h += D) : h = 0, i++, --F[n] === 0) {
      if (n === f)
        break;
      n = e[A + C[i]];
    }
    if (n > s && (h & E) !== x) {
      for (u === 0 && (u = s), d += a, g = n - u, l = 1 << g; g + u < f && (l -= F[g + u], !(l <= 0)); )
        g++, l <<= 1;
      if (c += 1 << g, t === ne && c > qe || t === Oe && c > Je)
        return 1;
      x = h & E, I[x] = s << 24 | g << 16 | d - r | 0;
    }
  }
  return h !== 0 && (I[d + h] = n - u << 24 | 64 << 16 | 0), B.bits = s, 0;
};
var FA = Kr;
const Hr = 0, Ot = 1, Kt = 2, {
  Z_FINISH: Ke,
  Z_BLOCK: _r,
  Z_TREES: HA,
  Z_OK: cA,
  Z_STREAM_END: Vr,
  Z_NEED_DICT: Xr,
  Z_STREAM_ERROR: tA,
  Z_DATA_ERROR: Ht,
  Z_MEM_ERROR: _t,
  Z_BUF_ERROR: jr,
  Z_DEFLATED: He
} = qt, PA = 16180, _e = 16181, Ve = 16182, Xe = 16183, je = 16184, Pe = 16185, Ze = 16186, ze = 16187, We = 16188, $e = 16189, XA = 16190, aA = 16191, re = 16192, At = 16193, oe = 16194, et = 16195, tt = 16196, it = 16197, nt = 16198, _A = 16199, VA = 16200, rt = 16201, ot = 16202, st = 16203, at = 16204, gt = 16205, se = 16206, It = 16207, Bt = 16208, V = 16209, Vt = 16210, Xt = 16211, Pr = 852, Zr = 592, zr = 15, Wr = zr, lt = (t) => (t >>> 24 & 255) + (t >>> 8 & 65280) + ((t & 65280) << 8) + ((t & 255) << 24);
function $r() {
  this.strm = null, this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new Uint16Array(320), this.work = new Uint16Array(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
}
const QA = (t) => {
  if (!t)
    return 1;
  const e = t.state;
  return !e || e.strm !== t || e.mode < PA || e.mode > Xt ? 1 : 0;
}, jt = (t) => {
  if (QA(t))
    return tA;
  const e = t.state;
  return t.total_in = t.total_out = e.total = 0, t.msg = "", e.wrap && (t.adler = e.wrap & 1), e.mode = PA, e.last = 0, e.havedict = 0, e.flags = -1, e.dmax = 32768, e.head = null, e.hold = 0, e.bits = 0, e.lencode = e.lendyn = new Int32Array(Pr), e.distcode = e.distdyn = new Int32Array(Zr), e.sane = 1, e.back = -1, cA;
}, Pt = (t) => {
  if (QA(t))
    return tA;
  const e = t.state;
  return e.wsize = 0, e.whave = 0, e.wnext = 0, jt(t);
}, Zt = (t, e) => {
  let A;
  if (QA(t))
    return tA;
  const o = t.state;
  return e < 0 ? (A = 0, e = -e) : (A = (e >> 4) + 5, e < 48 && (e &= 15)), e && (e < 8 || e > 15) ? tA : (o.window !== null && o.wbits !== e && (o.window = null), o.wrap = A, o.wbits = e, Pt(t));
}, zt = (t, e) => {
  if (!t)
    return tA;
  const A = new $r();
  t.state = A, A.strm = t, A.window = null, A.mode = PA;
  const o = Zt(t, e);
  return o !== cA && (t.state = null), o;
}, Ao = (t) => zt(t, Wr);
let Ct = !0, ae, ge;
const eo = (t) => {
  if (Ct) {
    ae = new Int32Array(512), ge = new Int32Array(32);
    let e = 0;
    for (; e < 144; )
      t.lens[e++] = 8;
    for (; e < 256; )
      t.lens[e++] = 9;
    for (; e < 280; )
      t.lens[e++] = 7;
    for (; e < 288; )
      t.lens[e++] = 8;
    for (FA(Ot, t.lens, 0, 288, ae, 0, t.work, { bits: 9 }), e = 0; e < 32; )
      t.lens[e++] = 5;
    FA(Kt, t.lens, 0, 32, ge, 0, t.work, { bits: 5 }), Ct = !1;
  }
  t.lencode = ae, t.lenbits = 9, t.distcode = ge, t.distbits = 5;
}, Wt = (t, e, A, o) => {
  let I;
  const r = t.state;
  return r.window === null && (r.wsize = 1 << r.wbits, r.wnext = 0, r.whave = 0, r.window = new Uint8Array(r.wsize)), o >= r.wsize ? (r.window.set(e.subarray(A - r.wsize, A), 0), r.wnext = 0, r.whave = r.wsize) : (I = r.wsize - r.wnext, I > o && (I = o), r.window.set(e.subarray(A - o, A - o + I), r.wnext), o -= I, o ? (r.window.set(e.subarray(A - o, A), 0), r.wnext = o, r.whave = r.wsize) : (r.wnext += I, r.wnext === r.wsize && (r.wnext = 0), r.whave < r.wsize && (r.whave += I))), 0;
}, to = (t, e) => {
  let A, o, I, r, C, B, y, n, i, a, f, s, g, u, l = 0, c, h, D, Q, x, E, d, w;
  const k = new Uint8Array(4);
  let F, m;
  const M = (
    /* permutation of code lengths */
    new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15])
  );
  if (QA(t) || !t.output || !t.input && t.avail_in !== 0)
    return tA;
  A = t.state, A.mode === aA && (A.mode = re), C = t.next_out, I = t.output, y = t.avail_out, r = t.next_in, o = t.input, B = t.avail_in, n = A.hold, i = A.bits, a = B, f = y, w = cA;
  A:
    for (; ; )
      switch (A.mode) {
        case PA:
          if (A.wrap === 0) {
            A.mode = re;
            break;
          }
          for (; i < 16; ) {
            if (B === 0)
              break A;
            B--, n += o[r++] << i, i += 8;
          }
          if (A.wrap & 2 && n === 35615) {
            A.wbits === 0 && (A.wbits = 15), A.check = 0, k[0] = n & 255, k[1] = n >>> 8 & 255, A.check = oA(A.check, k, 2, 0), n = 0, i = 0, A.mode = _e;
            break;
          }
          if (A.head && (A.head.done = !1), !(A.wrap & 1) || /* check if zlib header allowed */
          (((n & 255) << 8) + (n >> 8)) % 31) {
            t.msg = "incorrect header check", A.mode = V;
            break;
          }
          if ((n & 15) !== He) {
            t.msg = "unknown compression method", A.mode = V;
            break;
          }
          if (n >>>= 4, i -= 4, d = (n & 15) + 8, A.wbits === 0 && (A.wbits = d), d > 15 || d > A.wbits) {
            t.msg = "invalid window size", A.mode = V;
            break;
          }
          A.dmax = 1 << A.wbits, A.flags = 0, t.adler = A.check = 1, A.mode = n & 512 ? $e : aA, n = 0, i = 0;
          break;
        case _e:
          for (; i < 16; ) {
            if (B === 0)
              break A;
            B--, n += o[r++] << i, i += 8;
          }
          if (A.flags = n, (A.flags & 255) !== He) {
            t.msg = "unknown compression method", A.mode = V;
            break;
          }
          if (A.flags & 57344) {
            t.msg = "unknown header flags set", A.mode = V;
            break;
          }
          A.head && (A.head.text = n >> 8 & 1), A.flags & 512 && A.wrap & 4 && (k[0] = n & 255, k[1] = n >>> 8 & 255, A.check = oA(A.check, k, 2, 0)), n = 0, i = 0, A.mode = Ve;
        case Ve:
          for (; i < 32; ) {
            if (B === 0)
              break A;
            B--, n += o[r++] << i, i += 8;
          }
          A.head && (A.head.time = n), A.flags & 512 && A.wrap & 4 && (k[0] = n & 255, k[1] = n >>> 8 & 255, k[2] = n >>> 16 & 255, k[3] = n >>> 24 & 255, A.check = oA(A.check, k, 4, 0)), n = 0, i = 0, A.mode = Xe;
        case Xe:
          for (; i < 16; ) {
            if (B === 0)
              break A;
            B--, n += o[r++] << i, i += 8;
          }
          A.head && (A.head.xflags = n & 255, A.head.os = n >> 8), A.flags & 512 && A.wrap & 4 && (k[0] = n & 255, k[1] = n >>> 8 & 255, A.check = oA(A.check, k, 2, 0)), n = 0, i = 0, A.mode = je;
        case je:
          if (A.flags & 1024) {
            for (; i < 16; ) {
              if (B === 0)
                break A;
              B--, n += o[r++] << i, i += 8;
            }
            A.length = n, A.head && (A.head.extra_len = n), A.flags & 512 && A.wrap & 4 && (k[0] = n & 255, k[1] = n >>> 8 & 255, A.check = oA(A.check, k, 2, 0)), n = 0, i = 0;
          } else A.head && (A.head.extra = null);
          A.mode = Pe;
        case Pe:
          if (A.flags & 1024 && (s = A.length, s > B && (s = B), s && (A.head && (d = A.head.extra_len - A.length, A.head.extra || (A.head.extra = new Uint8Array(A.head.extra_len)), A.head.extra.set(
            o.subarray(
              r,
              // extra field is limited to 65536 bytes
              // - no need for additional size check
              r + s
            ),
            /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
            d
          )), A.flags & 512 && A.wrap & 4 && (A.check = oA(A.check, o, s, r)), B -= s, r += s, A.length -= s), A.length))
            break A;
          A.length = 0, A.mode = Ze;
        case Ze:
          if (A.flags & 2048) {
            if (B === 0)
              break A;
            s = 0;
            do
              d = o[r + s++], A.head && d && A.length < 65536 && (A.head.name += String.fromCharCode(d));
            while (d && s < B);
            if (A.flags & 512 && A.wrap & 4 && (A.check = oA(A.check, o, s, r)), B -= s, r += s, d)
              break A;
          } else A.head && (A.head.name = null);
          A.length = 0, A.mode = ze;
        case ze:
          if (A.flags & 4096) {
            if (B === 0)
              break A;
            s = 0;
            do
              d = o[r + s++], A.head && d && A.length < 65536 && (A.head.comment += String.fromCharCode(d));
            while (d && s < B);
            if (A.flags & 512 && A.wrap & 4 && (A.check = oA(A.check, o, s, r)), B -= s, r += s, d)
              break A;
          } else A.head && (A.head.comment = null);
          A.mode = We;
        case We:
          if (A.flags & 512) {
            for (; i < 16; ) {
              if (B === 0)
                break A;
              B--, n += o[r++] << i, i += 8;
            }
            if (A.wrap & 4 && n !== (A.check & 65535)) {
              t.msg = "header crc mismatch", A.mode = V;
              break;
            }
            n = 0, i = 0;
          }
          A.head && (A.head.hcrc = A.flags >> 9 & 1, A.head.done = !0), t.adler = A.check = 0, A.mode = aA;
          break;
        case $e:
          for (; i < 32; ) {
            if (B === 0)
              break A;
            B--, n += o[r++] << i, i += 8;
          }
          t.adler = A.check = lt(n), n = 0, i = 0, A.mode = XA;
        case XA:
          if (A.havedict === 0)
            return t.next_out = C, t.avail_out = y, t.next_in = r, t.avail_in = B, A.hold = n, A.bits = i, Xr;
          t.adler = A.check = 1, A.mode = aA;
        case aA:
          if (e === _r || e === HA)
            break A;
        case re:
          if (A.last) {
            n >>>= i & 7, i -= i & 7, A.mode = se;
            break;
          }
          for (; i < 3; ) {
            if (B === 0)
              break A;
            B--, n += o[r++] << i, i += 8;
          }
          switch (A.last = n & 1, n >>>= 1, i -= 1, n & 3) {
            case 0:
              A.mode = At;
              break;
            case 1:
              if (eo(A), A.mode = _A, e === HA) {
                n >>>= 2, i -= 2;
                break A;
              }
              break;
            case 2:
              A.mode = tt;
              break;
            case 3:
              t.msg = "invalid block type", A.mode = V;
          }
          n >>>= 2, i -= 2;
          break;
        case At:
          for (n >>>= i & 7, i -= i & 7; i < 32; ) {
            if (B === 0)
              break A;
            B--, n += o[r++] << i, i += 8;
          }
          if ((n & 65535) !== (n >>> 16 ^ 65535)) {
            t.msg = "invalid stored block lengths", A.mode = V;
            break;
          }
          if (A.length = n & 65535, n = 0, i = 0, A.mode = oe, e === HA)
            break A;
        case oe:
          A.mode = et;
        case et:
          if (s = A.length, s) {
            if (s > B && (s = B), s > y && (s = y), s === 0)
              break A;
            I.set(o.subarray(r, r + s), C), B -= s, r += s, y -= s, C += s, A.length -= s;
            break;
          }
          A.mode = aA;
          break;
        case tt:
          for (; i < 14; ) {
            if (B === 0)
              break A;
            B--, n += o[r++] << i, i += 8;
          }
          if (A.nlen = (n & 31) + 257, n >>>= 5, i -= 5, A.ndist = (n & 31) + 1, n >>>= 5, i -= 5, A.ncode = (n & 15) + 4, n >>>= 4, i -= 4, A.nlen > 286 || A.ndist > 30) {
            t.msg = "too many length or distance symbols", A.mode = V;
            break;
          }
          A.have = 0, A.mode = it;
        case it:
          for (; A.have < A.ncode; ) {
            for (; i < 3; ) {
              if (B === 0)
                break A;
              B--, n += o[r++] << i, i += 8;
            }
            A.lens[M[A.have++]] = n & 7, n >>>= 3, i -= 3;
          }
          for (; A.have < 19; )
            A.lens[M[A.have++]] = 0;
          if (A.lencode = A.lendyn, A.lenbits = 7, F = { bits: A.lenbits }, w = FA(Hr, A.lens, 0, 19, A.lencode, 0, A.work, F), A.lenbits = F.bits, w) {
            t.msg = "invalid code lengths set", A.mode = V;
            break;
          }
          A.have = 0, A.mode = nt;
        case nt:
          for (; A.have < A.nlen + A.ndist; ) {
            for (; l = A.lencode[n & (1 << A.lenbits) - 1], c = l >>> 24, h = l >>> 16 & 255, D = l & 65535, !(c <= i); ) {
              if (B === 0)
                break A;
              B--, n += o[r++] << i, i += 8;
            }
            if (D < 16)
              n >>>= c, i -= c, A.lens[A.have++] = D;
            else {
              if (D === 16) {
                for (m = c + 2; i < m; ) {
                  if (B === 0)
                    break A;
                  B--, n += o[r++] << i, i += 8;
                }
                if (n >>>= c, i -= c, A.have === 0) {
                  t.msg = "invalid bit length repeat", A.mode = V;
                  break;
                }
                d = A.lens[A.have - 1], s = 3 + (n & 3), n >>>= 2, i -= 2;
              } else if (D === 17) {
                for (m = c + 3; i < m; ) {
                  if (B === 0)
                    break A;
                  B--, n += o[r++] << i, i += 8;
                }
                n >>>= c, i -= c, d = 0, s = 3 + (n & 7), n >>>= 3, i -= 3;
              } else {
                for (m = c + 7; i < m; ) {
                  if (B === 0)
                    break A;
                  B--, n += o[r++] << i, i += 8;
                }
                n >>>= c, i -= c, d = 0, s = 11 + (n & 127), n >>>= 7, i -= 7;
              }
              if (A.have + s > A.nlen + A.ndist) {
                t.msg = "invalid bit length repeat", A.mode = V;
                break;
              }
              for (; s--; )
                A.lens[A.have++] = d;
            }
          }
          if (A.mode === V)
            break;
          if (A.lens[256] === 0) {
            t.msg = "invalid code -- missing end-of-block", A.mode = V;
            break;
          }
          if (A.lenbits = 9, F = { bits: A.lenbits }, w = FA(Ot, A.lens, 0, A.nlen, A.lencode, 0, A.work, F), A.lenbits = F.bits, w) {
            t.msg = "invalid literal/lengths set", A.mode = V;
            break;
          }
          if (A.distbits = 6, A.distcode = A.distdyn, F = { bits: A.distbits }, w = FA(Kt, A.lens, A.nlen, A.ndist, A.distcode, 0, A.work, F), A.distbits = F.bits, w) {
            t.msg = "invalid distances set", A.mode = V;
            break;
          }
          if (A.mode = _A, e === HA)
            break A;
        case _A:
          A.mode = VA;
        case VA:
          if (B >= 6 && y >= 258) {
            t.next_out = C, t.avail_out = y, t.next_in = r, t.avail_in = B, A.hold = n, A.bits = i, Tr(t, f), C = t.next_out, I = t.output, y = t.avail_out, r = t.next_in, o = t.input, B = t.avail_in, n = A.hold, i = A.bits, A.mode === aA && (A.back = -1);
            break;
          }
          for (A.back = 0; l = A.lencode[n & (1 << A.lenbits) - 1], c = l >>> 24, h = l >>> 16 & 255, D = l & 65535, !(c <= i); ) {
            if (B === 0)
              break A;
            B--, n += o[r++] << i, i += 8;
          }
          if (h && !(h & 240)) {
            for (Q = c, x = h, E = D; l = A.lencode[E + ((n & (1 << Q + x) - 1) >> Q)], c = l >>> 24, h = l >>> 16 & 255, D = l & 65535, !(Q + c <= i); ) {
              if (B === 0)
                break A;
              B--, n += o[r++] << i, i += 8;
            }
            n >>>= Q, i -= Q, A.back += Q;
          }
          if (n >>>= c, i -= c, A.back += c, A.length = D, h === 0) {
            A.mode = gt;
            break;
          }
          if (h & 32) {
            A.back = -1, A.mode = aA;
            break;
          }
          if (h & 64) {
            t.msg = "invalid literal/length code", A.mode = V;
            break;
          }
          A.extra = h & 15, A.mode = rt;
        case rt:
          if (A.extra) {
            for (m = A.extra; i < m; ) {
              if (B === 0)
                break A;
              B--, n += o[r++] << i, i += 8;
            }
            A.length += n & (1 << A.extra) - 1, n >>>= A.extra, i -= A.extra, A.back += A.extra;
          }
          A.was = A.length, A.mode = ot;
        case ot:
          for (; l = A.distcode[n & (1 << A.distbits) - 1], c = l >>> 24, h = l >>> 16 & 255, D = l & 65535, !(c <= i); ) {
            if (B === 0)
              break A;
            B--, n += o[r++] << i, i += 8;
          }
          if (!(h & 240)) {
            for (Q = c, x = h, E = D; l = A.distcode[E + ((n & (1 << Q + x) - 1) >> Q)], c = l >>> 24, h = l >>> 16 & 255, D = l & 65535, !(Q + c <= i); ) {
              if (B === 0)
                break A;
              B--, n += o[r++] << i, i += 8;
            }
            n >>>= Q, i -= Q, A.back += Q;
          }
          if (n >>>= c, i -= c, A.back += c, h & 64) {
            t.msg = "invalid distance code", A.mode = V;
            break;
          }
          A.offset = D, A.extra = h & 15, A.mode = st;
        case st:
          if (A.extra) {
            for (m = A.extra; i < m; ) {
              if (B === 0)
                break A;
              B--, n += o[r++] << i, i += 8;
            }
            A.offset += n & (1 << A.extra) - 1, n >>>= A.extra, i -= A.extra, A.back += A.extra;
          }
          if (A.offset > A.dmax) {
            t.msg = "invalid distance too far back", A.mode = V;
            break;
          }
          A.mode = at;
        case at:
          if (y === 0)
            break A;
          if (s = f - y, A.offset > s) {
            if (s = A.offset - s, s > A.whave && A.sane) {
              t.msg = "invalid distance too far back", A.mode = V;
              break;
            }
            s > A.wnext ? (s -= A.wnext, g = A.wsize - s) : g = A.wnext - s, s > A.length && (s = A.length), u = A.window;
          } else
            u = I, g = C - A.offset, s = A.length;
          s > y && (s = y), y -= s, A.length -= s;
          do
            I[C++] = u[g++];
          while (--s);
          A.length === 0 && (A.mode = VA);
          break;
        case gt:
          if (y === 0)
            break A;
          I[C++] = A.length, y--, A.mode = VA;
          break;
        case se:
          if (A.wrap) {
            for (; i < 32; ) {
              if (B === 0)
                break A;
              B--, n |= o[r++] << i, i += 8;
            }
            if (f -= y, t.total_out += f, A.total += f, A.wrap & 4 && f && (t.adler = A.check = /*UPDATE_CHECK(state.check, put - _out, _out);*/
            A.flags ? oA(A.check, I, f, C - f) : Ee(A.check, I, f, C - f)), f = y, A.wrap & 4 && (A.flags ? n : lt(n)) !== A.check) {
              t.msg = "incorrect data check", A.mode = V;
              break;
            }
            n = 0, i = 0;
          }
          A.mode = It;
        case It:
          if (A.wrap && A.flags) {
            for (; i < 32; ) {
              if (B === 0)
                break A;
              B--, n += o[r++] << i, i += 8;
            }
            if (A.wrap & 4 && n !== (A.total & 4294967295)) {
              t.msg = "incorrect length check", A.mode = V;
              break;
            }
            n = 0, i = 0;
          }
          A.mode = Bt;
        case Bt:
          w = Vr;
          break A;
        case V:
          w = Ht;
          break A;
        case Vt:
          return _t;
        case Xt:
        default:
          return tA;
      }
  return t.next_out = C, t.avail_out = y, t.next_in = r, t.avail_in = B, A.hold = n, A.bits = i, (A.wsize || f !== t.avail_out && A.mode < V && (A.mode < se || e !== Ke)) && Wt(t, t.output, t.next_out, f - t.avail_out), a -= t.avail_in, f -= t.avail_out, t.total_in += a, t.total_out += f, A.total += f, A.wrap & 4 && f && (t.adler = A.check = /*UPDATE_CHECK(state.check, strm.next_out - _out, _out);*/
  A.flags ? oA(A.check, I, f, t.next_out - f) : Ee(A.check, I, f, t.next_out - f)), t.data_type = A.bits + (A.last ? 64 : 0) + (A.mode === aA ? 128 : 0) + (A.mode === _A || A.mode === oe ? 256 : 0), (a === 0 && f === 0 || e === Ke) && w === cA && (w = jr), w;
}, io = (t) => {
  if (QA(t))
    return tA;
  let e = t.state;
  return e.window && (e.window = null), t.state = null, cA;
}, no = (t, e) => {
  if (QA(t))
    return tA;
  const A = t.state;
  return A.wrap & 2 ? (A.head = e, e.done = !1, cA) : tA;
}, ro = (t, e) => {
  const A = e.length;
  let o, I, r;
  return QA(t) || (o = t.state, o.wrap !== 0 && o.mode !== XA) ? tA : o.mode === XA && (I = 1, I = Ee(I, e, A, 0), I !== o.check) ? Ht : (r = Wt(t, e, A, A), r ? (o.mode = Vt, _t) : (o.havedict = 1, cA));
};
var oo = Pt, so = Zt, ao = jt, go = Ao, Io = zt, Bo = to, lo = io, Co = no, fo = ro, co = "pako inflate (from Nodeca project)", IA = {
  inflateReset: oo,
  inflateReset2: so,
  inflateResetKeep: ao,
  inflateInit: go,
  inflateInit2: Io,
  inflate: Bo,
  inflateEnd: lo,
  inflateGetHeader: Co,
  inflateSetDictionary: fo,
  inflateInfo: co
};
function Eo() {
  this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
}
var Qo = Eo;
const $t = Object.prototype.toString, {
  Z_NO_FLUSH: ho,
  Z_FINISH: uo,
  Z_OK: MA,
  Z_STREAM_END: Ie,
  Z_NEED_DICT: Be,
  Z_STREAM_ERROR: wo,
  Z_DATA_ERROR: ft,
  Z_MEM_ERROR: Do
} = qt;
function ZA(t) {
  this.options = Jt.assign({
    chunkSize: 1024 * 64,
    windowBits: 15,
    to: ""
  }, t || {});
  const e = this.options;
  e.raw && e.windowBits >= 0 && e.windowBits < 16 && (e.windowBits = -e.windowBits, e.windowBits === 0 && (e.windowBits = -15)), e.windowBits >= 0 && e.windowBits < 16 && !(t && t.windowBits) && (e.windowBits += 32), e.windowBits > 15 && e.windowBits < 48 && (e.windowBits & 15 || (e.windowBits |= 15)), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new vr(), this.strm.avail_out = 0;
  let A = IA.inflateInit2(
    this.strm,
    e.windowBits
  );
  if (A !== MA)
    throw new Error(Qe[A]);
  if (this.header = new Qo(), IA.inflateGetHeader(this.strm, this.header), e.dictionary && (typeof e.dictionary == "string" ? e.dictionary = he.string2buf(e.dictionary) : $t.call(e.dictionary) === "[object ArrayBuffer]" && (e.dictionary = new Uint8Array(e.dictionary)), e.raw && (A = IA.inflateSetDictionary(this.strm, e.dictionary), A !== MA)))
    throw new Error(Qe[A]);
}
ZA.prototype.push = function(t, e) {
  const A = this.strm, o = this.options.chunkSize, I = this.options.dictionary;
  let r, C, B;
  if (this.ended) return !1;
  for (e === ~~e ? C = e : C = e === !0 ? uo : ho, $t.call(t) === "[object ArrayBuffer]" ? A.input = new Uint8Array(t) : A.input = t, A.next_in = 0, A.avail_in = A.input.length; ; ) {
    for (A.avail_out === 0 && (A.output = new Uint8Array(o), A.next_out = 0, A.avail_out = o), r = IA.inflate(A, C), r === Be && I && (r = IA.inflateSetDictionary(A, I), r === MA ? r = IA.inflate(A, C) : r === ft && (r = Be)); A.avail_in > 0 && r === Ie && A.state.wrap > 0 && t[A.next_in] !== 0; )
      IA.inflateReset(A), r = IA.inflate(A, C);
    switch (r) {
      case wo:
      case ft:
      case Be:
      case Do:
        return this.onEnd(r), this.ended = !0, !1;
    }
    if (B = A.avail_out, A.next_out && (A.avail_out === 0 || r === Ie))
      if (this.options.to === "string") {
        let y = he.utf8border(A.output, A.next_out), n = A.next_out - y, i = he.buf2string(A.output, y);
        A.next_out = n, A.avail_out = o - n, n && A.output.set(A.output.subarray(y, y + n), 0), this.onData(i);
      } else
        this.onData(A.output.length === A.next_out ? A.output : A.output.subarray(0, A.next_out));
    if (!(r === MA && B === 0)) {
      if (r === Ie)
        return r = IA.inflateEnd(this.strm), this.onEnd(r), this.ended = !0, !0;
      if (A.avail_in === 0) break;
    }
  }
  return !0;
};
ZA.prototype.onData = function(t) {
  this.chunks.push(t);
};
ZA.prototype.onEnd = function(t) {
  t === MA && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = Jt.flattenChunks(this.chunks)), this.chunks = [], this.err = t, this.msg = this.strm.msg;
};
function yo(t, e) {
  const A = new ZA(e);
  if (A.push(t), A.err) throw A.msg || Qe[A.err];
  return A.result;
}
var xo = yo, mo = {
  inflate: xo
};
const { inflate: po } = mo;
var Ai = po;
class ko extends EA {
  decodeBlock(e) {
    return Ai(new Uint8Array(e)).buffer;
  }
}
const Fo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ko
}, Symbol.toStringTag, { value: "Module" }));
class So extends EA {
  decodeBlock(e) {
    const A = new DataView(e), o = [];
    for (let I = 0; I < e.byteLength; ++I) {
      let r = A.getInt8(I);
      if (r < 0) {
        const C = A.getUint8(I + 1);
        r = -r;
        for (let B = 0; B <= r; ++B)
          o.push(C);
        I += 1;
      } else {
        for (let C = 0; C <= r; ++C)
          o.push(A.getUint8(I + C + 1));
        I += r + 1;
      }
    }
    return new Uint8Array(o).buffer;
  }
}
const Go = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: So
}, Symbol.toStringTag, { value: "Module" }));
var ei = { exports: {} };
(function(t) {
  /* Copyright 2015-2021 Esri. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 @preserve */
  (function() {
    var e = function() {
      var r = {};
      r.defaultNoDataValue = -34027999387901484e22, r.decode = function(a, f) {
        f = f || {};
        var s = f.encodedMaskData || f.encodedMaskData === null, g = n(a, f.inputOffset || 0, s), u = f.noDataValue !== null ? f.noDataValue : r.defaultNoDataValue, l = C(
          g,
          f.pixelType || Float32Array,
          f.encodedMaskData,
          u,
          f.returnMask
        ), c = {
          width: g.width,
          height: g.height,
          pixelData: l.resultPixels,
          minValue: l.minValue,
          maxValue: g.pixels.maxValue,
          noDataValue: u
        };
        return l.resultMask && (c.maskData = l.resultMask), f.returnEncodedMask && g.mask && (c.encodedMaskData = g.mask.bitset ? g.mask.bitset : null), f.returnFileInfo && (c.fileInfo = B(g), f.computeUsedBitDepths && (c.fileInfo.bitDepths = y(g))), c;
      };
      var C = function(a, f, s, g, u) {
        var l = 0, c = a.pixels.numBlocksX, h = a.pixels.numBlocksY, D = Math.floor(a.width / c), Q = Math.floor(a.height / h), x = 2 * a.maxZError, E = Number.MAX_VALUE, d;
        s = s || (a.mask ? a.mask.bitset : null);
        var w, k;
        w = new f(a.width * a.height), u && s && (k = new Uint8Array(a.width * a.height));
        for (var F = new Float32Array(D * Q), m, M, G = 0; G <= h; G++) {
          var J = G !== h ? Q : a.height % h;
          if (J !== 0)
            for (var S = 0; S <= c; S++) {
              var p = S !== c ? D : a.width % c;
              if (p !== 0) {
                var R = G * a.width * Q + S * D, U = a.width - p, L = a.pixels.blocks[l], N, v, K;
                L.encoding < 2 ? (L.encoding === 0 ? N = L.rawData : (i(L.stuffedData, L.bitsPerPixel, L.numValidPixels, L.offset, x, F, a.pixels.maxValue), N = F), v = 0) : L.encoding === 2 ? K = 0 : K = L.offset;
                var _;
                if (s)
                  for (M = 0; M < J; M++) {
                    for (R & 7 && (_ = s[R >> 3], _ <<= R & 7), m = 0; m < p; m++)
                      R & 7 || (_ = s[R >> 3]), _ & 128 ? (k && (k[R] = 1), d = L.encoding < 2 ? N[v++] : K, E = E > d ? d : E, w[R++] = d) : (k && (k[R] = 0), w[R++] = g), _ <<= 1;
                    R += U;
                  }
                else if (L.encoding < 2)
                  for (M = 0; M < J; M++) {
                    for (m = 0; m < p; m++)
                      d = N[v++], E = E > d ? d : E, w[R++] = d;
                    R += U;
                  }
                else
                  for (E = E > K ? K : E, M = 0; M < J; M++) {
                    for (m = 0; m < p; m++)
                      w[R++] = K;
                    R += U;
                  }
                if (L.encoding === 1 && v !== L.numValidPixels)
                  throw "Block and Mask do not match";
                l++;
              }
            }
        }
        return {
          resultPixels: w,
          resultMask: k,
          minValue: E
        };
      }, B = function(a) {
        return {
          fileIdentifierString: a.fileIdentifierString,
          fileVersion: a.fileVersion,
          imageType: a.imageType,
          height: a.height,
          width: a.width,
          maxZError: a.maxZError,
          eofOffset: a.eofOffset,
          mask: a.mask ? {
            numBlocksX: a.mask.numBlocksX,
            numBlocksY: a.mask.numBlocksY,
            numBytes: a.mask.numBytes,
            maxValue: a.mask.maxValue
          } : null,
          pixels: {
            numBlocksX: a.pixels.numBlocksX,
            numBlocksY: a.pixels.numBlocksY,
            numBytes: a.pixels.numBytes,
            maxValue: a.pixels.maxValue,
            noDataValue: a.noDataValue
          }
        };
      }, y = function(a) {
        for (var f = a.pixels.numBlocksX * a.pixels.numBlocksY, s = {}, g = 0; g < f; g++) {
          var u = a.pixels.blocks[g];
          u.encoding === 0 ? s.float32 = !0 : u.encoding === 1 ? s[u.bitsPerPixel] = !0 : s[0] = !0;
        }
        return Object.keys(s);
      }, n = function(a, f, s) {
        var g = {}, u = new Uint8Array(a, f, 10);
        if (g.fileIdentifierString = String.fromCharCode.apply(null, u), g.fileIdentifierString.trim() !== "CntZImage")
          throw "Unexpected file identifier string: " + g.fileIdentifierString;
        f += 10;
        var l = new DataView(a, f, 24);
        if (g.fileVersion = l.getInt32(0, !0), g.imageType = l.getInt32(4, !0), g.height = l.getUint32(8, !0), g.width = l.getUint32(12, !0), g.maxZError = l.getFloat64(16, !0), f += 24, !s)
          if (l = new DataView(a, f, 16), g.mask = {}, g.mask.numBlocksY = l.getUint32(0, !0), g.mask.numBlocksX = l.getUint32(4, !0), g.mask.numBytes = l.getUint32(8, !0), g.mask.maxValue = l.getFloat32(12, !0), f += 16, g.mask.numBytes > 0) {
            var c = new Uint8Array(Math.ceil(g.width * g.height / 8));
            l = new DataView(a, f, g.mask.numBytes);
            var h = l.getInt16(0, !0), D = 2, Q = 0;
            do {
              if (h > 0)
                for (; h--; )
                  c[Q++] = l.getUint8(D++);
              else {
                var x = l.getUint8(D++);
                for (h = -h; h--; )
                  c[Q++] = x;
              }
              h = l.getInt16(D, !0), D += 2;
            } while (D < g.mask.numBytes);
            if (h !== -32768 || Q < c.length)
              throw "Unexpected end of mask RLE encoding";
            g.mask.bitset = c, f += g.mask.numBytes;
          } else g.mask.numBytes | g.mask.numBlocksY | g.mask.maxValue || (g.mask.bitset = new Uint8Array(Math.ceil(g.width * g.height / 8)));
        l = new DataView(a, f, 16), g.pixels = {}, g.pixels.numBlocksY = l.getUint32(0, !0), g.pixels.numBlocksX = l.getUint32(4, !0), g.pixels.numBytes = l.getUint32(8, !0), g.pixels.maxValue = l.getFloat32(12, !0), f += 16;
        var E = g.pixels.numBlocksX, d = g.pixels.numBlocksY, w = E + (g.width % E > 0 ? 1 : 0), k = d + (g.height % d > 0 ? 1 : 0);
        g.pixels.blocks = new Array(w * k);
        for (var F = 0, m = 0; m < k; m++)
          for (var M = 0; M < w; M++) {
            var G = 0, J = a.byteLength - f;
            l = new DataView(a, f, Math.min(10, J));
            var S = {};
            g.pixels.blocks[F++] = S;
            var p = l.getUint8(0);
            if (G++, S.encoding = p & 63, S.encoding > 3)
              throw "Invalid block encoding (" + S.encoding + ")";
            if (S.encoding === 2) {
              f++;
              continue;
            }
            if (p !== 0 && p !== 2) {
              if (p >>= 6, S.offsetType = p, p === 2)
                S.offset = l.getInt8(1), G++;
              else if (p === 1)
                S.offset = l.getInt16(1, !0), G += 2;
              else if (p === 0)
                S.offset = l.getFloat32(1, !0), G += 4;
              else
                throw "Invalid block offset type";
              if (S.encoding === 1)
                if (p = l.getUint8(G), G++, S.bitsPerPixel = p & 63, p >>= 6, S.numValidPixelsType = p, p === 2)
                  S.numValidPixels = l.getUint8(G), G++;
                else if (p === 1)
                  S.numValidPixels = l.getUint16(G, !0), G += 2;
                else if (p === 0)
                  S.numValidPixels = l.getUint32(G, !0), G += 4;
                else
                  throw "Invalid valid pixel count type";
            }
            if (f += G, S.encoding !== 3) {
              var R, U;
              if (S.encoding === 0) {
                var L = (g.pixels.numBytes - 1) / 4;
                if (L !== Math.floor(L))
                  throw "uncompressed block has invalid length";
                R = new ArrayBuffer(L * 4), U = new Uint8Array(R), U.set(new Uint8Array(a, f, L * 4));
                var N = new Float32Array(R);
                S.rawData = N, f += L * 4;
              } else if (S.encoding === 1) {
                var v = Math.ceil(S.numValidPixels * S.bitsPerPixel / 8), K = Math.ceil(v / 4);
                R = new ArrayBuffer(K * 4), U = new Uint8Array(R), U.set(new Uint8Array(a, f, v)), S.stuffedData = new Uint32Array(R), f += v;
              }
            }
          }
        return g.eofOffset = f, g;
      }, i = function(a, f, s, g, u, l, c) {
        var h = (1 << f) - 1, D = 0, Q, x = 0, E, d, w = Math.ceil((c - g) / u), k = a.length * 4 - Math.ceil(f * s / 8);
        for (a[a.length - 1] <<= 8 * k, Q = 0; Q < s; Q++) {
          if (x === 0 && (d = a[D++], x = 32), x >= f)
            E = d >>> x - f & h, x -= f;
          else {
            var F = f - x;
            E = (d & h) << F & h, d = a[D++], x = 32 - F, E += d >>> x;
          }
          l[Q] = E < w ? g + E * u : c;
        }
        return l;
      };
      return r;
    }(), A = /* @__PURE__ */ function() {
      var r = {
        //methods ending with 2 are for the new byte order used by Lerc2.3 and above.
        //originalUnstuff is used to unpack Huffman code table. code is duplicated to unstuffx for performance reasons.
        unstuff: function(n, i, a, f, s, g, u, l) {
          var c = (1 << a) - 1, h = 0, D, Q = 0, x, E, d, w, k = n.length * 4 - Math.ceil(a * f / 8);
          if (n[n.length - 1] <<= 8 * k, s)
            for (D = 0; D < f; D++)
              Q === 0 && (E = n[h++], Q = 32), Q >= a ? (x = E >>> Q - a & c, Q -= a) : (d = a - Q, x = (E & c) << d & c, E = n[h++], Q = 32 - d, x += E >>> Q), i[D] = s[x];
          else
            for (w = Math.ceil((l - g) / u), D = 0; D < f; D++)
              Q === 0 && (E = n[h++], Q = 32), Q >= a ? (x = E >>> Q - a & c, Q -= a) : (d = a - Q, x = (E & c) << d & c, E = n[h++], Q = 32 - d, x += E >>> Q), i[D] = x < w ? g + x * u : l;
        },
        unstuffLUT: function(n, i, a, f, s, g) {
          var u = (1 << i) - 1, l = 0, c = 0, h = 0, D = 0, Q = 0, x, E = [], d = n.length * 4 - Math.ceil(i * a / 8);
          n[n.length - 1] <<= 8 * d;
          var w = Math.ceil((g - f) / s);
          for (c = 0; c < a; c++)
            D === 0 && (x = n[l++], D = 32), D >= i ? (Q = x >>> D - i & u, D -= i) : (h = i - D, Q = (x & u) << h & u, x = n[l++], D = 32 - h, Q += x >>> D), E[c] = Q < w ? f + Q * s : g;
          return E.unshift(f), E;
        },
        unstuff2: function(n, i, a, f, s, g, u, l) {
          var c = (1 << a) - 1, h = 0, D, Q = 0, x = 0, E, d, w;
          if (s)
            for (D = 0; D < f; D++)
              Q === 0 && (d = n[h++], Q = 32, x = 0), Q >= a ? (E = d >>> x & c, Q -= a, x += a) : (w = a - Q, E = d >>> x & c, d = n[h++], Q = 32 - w, E |= (d & (1 << w) - 1) << a - w, x = w), i[D] = s[E];
          else {
            var k = Math.ceil((l - g) / u);
            for (D = 0; D < f; D++)
              Q === 0 && (d = n[h++], Q = 32, x = 0), Q >= a ? (E = d >>> x & c, Q -= a, x += a) : (w = a - Q, E = d >>> x & c, d = n[h++], Q = 32 - w, E |= (d & (1 << w) - 1) << a - w, x = w), i[D] = E < k ? g + E * u : l;
          }
          return i;
        },
        unstuffLUT2: function(n, i, a, f, s, g) {
          var u = (1 << i) - 1, l = 0, c = 0, h = 0, D = 0, Q = 0, x = 0, E, d = [], w = Math.ceil((g - f) / s);
          for (c = 0; c < a; c++)
            D === 0 && (E = n[l++], D = 32, x = 0), D >= i ? (Q = E >>> x & u, D -= i, x += i) : (h = i - D, Q = E >>> x & u, E = n[l++], D = 32 - h, Q |= (E & (1 << h) - 1) << i - h, x = h), d[c] = Q < w ? f + Q * s : g;
          return d.unshift(f), d;
        },
        originalUnstuff: function(n, i, a, f) {
          var s = (1 << a) - 1, g = 0, u, l = 0, c, h, D, Q = n.length * 4 - Math.ceil(a * f / 8);
          for (n[n.length - 1] <<= 8 * Q, u = 0; u < f; u++)
            l === 0 && (h = n[g++], l = 32), l >= a ? (c = h >>> l - a & s, l -= a) : (D = a - l, c = (h & s) << D & s, h = n[g++], l = 32 - D, c += h >>> l), i[u] = c;
          return i;
        },
        originalUnstuff2: function(n, i, a, f) {
          var s = (1 << a) - 1, g = 0, u, l = 0, c = 0, h, D, Q;
          for (u = 0; u < f; u++)
            l === 0 && (D = n[g++], l = 32, c = 0), l >= a ? (h = D >>> c & s, l -= a, c += a) : (Q = a - l, h = D >>> c & s, D = n[g++], l = 32 - Q, h |= (D & (1 << Q) - 1) << a - Q, c = Q), i[u] = h;
          return i;
        }
      }, C = {
        HUFFMAN_LUT_BITS_MAX: 12,
        //use 2^12 lut, treat it like constant
        computeChecksumFletcher32: function(n) {
          for (var i = 65535, a = 65535, f = n.length, s = Math.floor(f / 2), g = 0; s; ) {
            var u = s >= 359 ? 359 : s;
            s -= u;
            do
              i += n[g++] << 8, a += i += n[g++];
            while (--u);
            i = (i & 65535) + (i >>> 16), a = (a & 65535) + (a >>> 16);
          }
          return f & 1 && (a += i += n[g] << 8), i = (i & 65535) + (i >>> 16), a = (a & 65535) + (a >>> 16), (a << 16 | i) >>> 0;
        },
        readHeaderInfo: function(n, i) {
          var a = i.ptr, f = new Uint8Array(n, a, 6), s = {};
          if (s.fileIdentifierString = String.fromCharCode.apply(null, f), s.fileIdentifierString.lastIndexOf("Lerc2", 0) !== 0)
            throw "Unexpected file identifier string (expect Lerc2 ): " + s.fileIdentifierString;
          a += 6;
          var g = new DataView(n, a, 8), u = g.getInt32(0, !0);
          s.fileVersion = u, a += 4, u >= 3 && (s.checksum = g.getUint32(4, !0), a += 4), g = new DataView(n, a, 12), s.height = g.getUint32(0, !0), s.width = g.getUint32(4, !0), a += 8, u >= 4 ? (s.numDims = g.getUint32(8, !0), a += 4) : s.numDims = 1, g = new DataView(n, a, 40), s.numValidPixel = g.getUint32(0, !0), s.microBlockSize = g.getInt32(4, !0), s.blobSize = g.getInt32(8, !0), s.imageType = g.getInt32(12, !0), s.maxZError = g.getFloat64(16, !0), s.zMin = g.getFloat64(24, !0), s.zMax = g.getFloat64(32, !0), a += 40, i.headerInfo = s, i.ptr = a;
          var l, c;
          if (u >= 3 && (c = u >= 4 ? 52 : 48, l = this.computeChecksumFletcher32(new Uint8Array(n, a - c, s.blobSize - 14)), l !== s.checksum))
            throw "Checksum failed.";
          return !0;
        },
        checkMinMaxRanges: function(n, i) {
          var a = i.headerInfo, f = this.getDataTypeArray(a.imageType), s = a.numDims * this.getDataTypeSize(a.imageType), g = this.readSubArray(n, i.ptr, f, s), u = this.readSubArray(n, i.ptr + s, f, s);
          i.ptr += 2 * s;
          var l, c = !0;
          for (l = 0; l < a.numDims; l++)
            if (g[l] !== u[l]) {
              c = !1;
              break;
            }
          return a.minValues = g, a.maxValues = u, c;
        },
        readSubArray: function(n, i, a, f) {
          var s;
          if (a === Uint8Array)
            s = new Uint8Array(n, i, f);
          else {
            var g = new ArrayBuffer(f), u = new Uint8Array(g);
            u.set(new Uint8Array(n, i, f)), s = new a(g);
          }
          return s;
        },
        readMask: function(n, i) {
          var a = i.ptr, f = i.headerInfo, s = f.width * f.height, g = f.numValidPixel, u = new DataView(n, a, 4), l = {};
          if (l.numBytes = u.getUint32(0, !0), a += 4, (g === 0 || s === g) && l.numBytes !== 0)
            throw "invalid mask";
          var c, h;
          if (g === 0)
            c = new Uint8Array(Math.ceil(s / 8)), l.bitset = c, h = new Uint8Array(s), i.pixels.resultMask = h, a += l.numBytes;
          else if (l.numBytes > 0) {
            c = new Uint8Array(Math.ceil(s / 8)), u = new DataView(n, a, l.numBytes);
            var D = u.getInt16(0, !0), Q = 2, x = 0, E = 0;
            do {
              if (D > 0)
                for (; D--; )
                  c[x++] = u.getUint8(Q++);
              else
                for (E = u.getUint8(Q++), D = -D; D--; )
                  c[x++] = E;
              D = u.getInt16(Q, !0), Q += 2;
            } while (Q < l.numBytes);
            if (D !== -32768 || x < c.length)
              throw "Unexpected end of mask RLE encoding";
            h = new Uint8Array(s);
            var d = 0, w = 0;
            for (w = 0; w < s; w++)
              w & 7 ? (d = c[w >> 3], d <<= w & 7) : d = c[w >> 3], d & 128 && (h[w] = 1);
            i.pixels.resultMask = h, l.bitset = c, a += l.numBytes;
          }
          return i.ptr = a, i.mask = l, !0;
        },
        readDataOneSweep: function(n, i, a, f) {
          var s = i.ptr, g = i.headerInfo, u = g.numDims, l = g.width * g.height, c = g.imageType, h = g.numValidPixel * C.getDataTypeSize(c) * u, D, Q = i.pixels.resultMask;
          if (a === Uint8Array)
            D = new Uint8Array(n, s, h);
          else {
            var x = new ArrayBuffer(h), E = new Uint8Array(x);
            E.set(new Uint8Array(n, s, h)), D = new a(x);
          }
          if (D.length === l * u)
            f ? i.pixels.resultPixels = C.swapDimensionOrder(D, l, u, a, !0) : i.pixels.resultPixels = D;
          else {
            i.pixels.resultPixels = new a(l * u);
            var d = 0, w = 0, k = 0, F = 0;
            if (u > 1) {
              if (f) {
                for (w = 0; w < l; w++)
                  if (Q[w])
                    for (F = w, k = 0; k < u; k++, F += l)
                      i.pixels.resultPixels[F] = D[d++];
              } else
                for (w = 0; w < l; w++)
                  if (Q[w])
                    for (F = w * u, k = 0; k < u; k++)
                      i.pixels.resultPixels[F + k] = D[d++];
            } else
              for (w = 0; w < l; w++)
                Q[w] && (i.pixels.resultPixels[w] = D[d++]);
          }
          return s += h, i.ptr = s, !0;
        },
        readHuffmanTree: function(n, i) {
          var a = this.HUFFMAN_LUT_BITS_MAX, f = new DataView(n, i.ptr, 16);
          i.ptr += 16;
          var s = f.getInt32(0, !0);
          if (s < 2)
            throw "unsupported Huffman version";
          var g = f.getInt32(4, !0), u = f.getInt32(8, !0), l = f.getInt32(12, !0);
          if (u >= l)
            return !1;
          var c = new Uint32Array(l - u);
          C.decodeBits(n, i, c);
          var h = [], D, Q, x, E;
          for (D = u; D < l; D++)
            Q = D - (D < g ? 0 : g), h[Q] = { first: c[D - u], second: null };
          var d = n.byteLength - i.ptr, w = Math.ceil(d / 4), k = new ArrayBuffer(w * 4), F = new Uint8Array(k);
          F.set(new Uint8Array(n, i.ptr, d));
          var m = new Uint32Array(k), M = 0, G, J = 0;
          for (G = m[0], D = u; D < l; D++)
            Q = D - (D < g ? 0 : g), E = h[Q].first, E > 0 && (h[Q].second = G << M >>> 32 - E, 32 - M >= E ? (M += E, M === 32 && (M = 0, J++, G = m[J])) : (M += E - 32, J++, G = m[J], h[Q].second |= G >>> 32 - M));
          var S = 0, p = 0, R = new B();
          for (D = 0; D < h.length; D++)
            h[D] !== void 0 && (S = Math.max(S, h[D].first));
          S >= a ? p = a : p = S;
          var U = [], L, N, v, K, _, b;
          for (D = u; D < l; D++)
            if (Q = D - (D < g ? 0 : g), E = h[Q].first, E > 0)
              if (L = [E, Q], E <= p)
                for (N = h[Q].second << p - E, v = 1 << p - E, x = 0; x < v; x++)
                  U[N | x] = L;
              else
                for (N = h[Q].second, b = R, K = E - 1; K >= 0; K--)
                  _ = N >>> K & 1, _ ? (b.right || (b.right = new B()), b = b.right) : (b.left || (b.left = new B()), b = b.left), K === 0 && !b.val && (b.val = L[1]);
          return {
            decodeLut: U,
            numBitsLUTQick: p,
            numBitsLUT: S,
            tree: R,
            stuffedData: m,
            srcPtr: J,
            bitPos: M
          };
        },
        readHuffman: function(n, i, a, f) {
          var s = i.headerInfo, g = s.numDims, u = i.headerInfo.height, l = i.headerInfo.width, c = l * u, h = this.readHuffmanTree(n, i), D = h.decodeLut, Q = h.tree, x = h.stuffedData, E = h.srcPtr, d = h.bitPos, w = h.numBitsLUTQick, k = h.numBitsLUT, F = i.headerInfo.imageType === 0 ? 128 : 0, m, M, G, J = i.pixels.resultMask, S, p, R, U, L, N, v, K = 0;
          d > 0 && (E++, d = 0);
          var _ = x[E], b = i.encodeMode === 1, q = new a(c * g), T = q, O;
          if (g < 2 || b) {
            for (O = 0; O < g; O++)
              if (g > 1 && (T = new a(q.buffer, c * O, c), K = 0), i.headerInfo.numValidPixel === l * u)
                for (N = 0, U = 0; U < u; U++)
                  for (L = 0; L < l; L++, N++) {
                    if (M = 0, S = _ << d >>> 32 - w, p = S, 32 - d < w && (S |= x[E + 1] >>> 64 - d - w, p = S), D[p])
                      M = D[p][1], d += D[p][0];
                    else
                      for (S = _ << d >>> 32 - k, p = S, 32 - d < k && (S |= x[E + 1] >>> 64 - d - k, p = S), m = Q, v = 0; v < k; v++)
                        if (R = S >>> k - v - 1 & 1, m = R ? m.right : m.left, !(m.left || m.right)) {
                          M = m.val, d = d + v + 1;
                          break;
                        }
                    d >= 32 && (d -= 32, E++, _ = x[E]), G = M - F, b ? (L > 0 ? G += K : U > 0 ? G += T[N - l] : G += K, G &= 255, T[N] = G, K = G) : T[N] = G;
                  }
              else
                for (N = 0, U = 0; U < u; U++)
                  for (L = 0; L < l; L++, N++)
                    if (J[N]) {
                      if (M = 0, S = _ << d >>> 32 - w, p = S, 32 - d < w && (S |= x[E + 1] >>> 64 - d - w, p = S), D[p])
                        M = D[p][1], d += D[p][0];
                      else
                        for (S = _ << d >>> 32 - k, p = S, 32 - d < k && (S |= x[E + 1] >>> 64 - d - k, p = S), m = Q, v = 0; v < k; v++)
                          if (R = S >>> k - v - 1 & 1, m = R ? m.right : m.left, !(m.left || m.right)) {
                            M = m.val, d = d + v + 1;
                            break;
                          }
                      d >= 32 && (d -= 32, E++, _ = x[E]), G = M - F, b ? (L > 0 && J[N - 1] ? G += K : U > 0 && J[N - l] ? G += T[N - l] : G += K, G &= 255, T[N] = G, K = G) : T[N] = G;
                    }
          } else
            for (N = 0, U = 0; U < u; U++)
              for (L = 0; L < l; L++)
                if (N = U * l + L, !J || J[N])
                  for (O = 0; O < g; O++, N += c) {
                    if (M = 0, S = _ << d >>> 32 - w, p = S, 32 - d < w && (S |= x[E + 1] >>> 64 - d - w, p = S), D[p])
                      M = D[p][1], d += D[p][0];
                    else
                      for (S = _ << d >>> 32 - k, p = S, 32 - d < k && (S |= x[E + 1] >>> 64 - d - k, p = S), m = Q, v = 0; v < k; v++)
                        if (R = S >>> k - v - 1 & 1, m = R ? m.right : m.left, !(m.left || m.right)) {
                          M = m.val, d = d + v + 1;
                          break;
                        }
                    d >= 32 && (d -= 32, E++, _ = x[E]), G = M - F, T[N] = G;
                  }
          i.ptr = i.ptr + (E + 1) * 4 + (d > 0 ? 4 : 0), i.pixels.resultPixels = q, g > 1 && !f && (i.pixels.resultPixels = C.swapDimensionOrder(q, c, g, a));
        },
        decodeBits: function(n, i, a, f, s) {
          {
            var g = i.headerInfo, u = g.fileVersion, l = 0, c = n.byteLength - i.ptr >= 5 ? 5 : n.byteLength - i.ptr, h = new DataView(n, i.ptr, c), D = h.getUint8(0);
            l++;
            var Q = D >> 6, x = Q === 0 ? 4 : 3 - Q, E = (D & 32) > 0, d = D & 31, w = 0;
            if (x === 1)
              w = h.getUint8(l), l++;
            else if (x === 2)
              w = h.getUint16(l, !0), l += 2;
            else if (x === 4)
              w = h.getUint32(l, !0), l += 4;
            else
              throw "Invalid valid pixel count type";
            var k = 2 * g.maxZError, F, m, M, G, J, S, p, R, U, L = g.numDims > 1 ? g.maxValues[s] : g.zMax;
            if (E) {
              for (i.counter.lut++, R = h.getUint8(l), l++, G = Math.ceil((R - 1) * d / 8), J = Math.ceil(G / 4), m = new ArrayBuffer(J * 4), M = new Uint8Array(m), i.ptr += l, M.set(new Uint8Array(n, i.ptr, G)), p = new Uint32Array(m), i.ptr += G, U = 0; R - 1 >>> U; )
                U++;
              G = Math.ceil(w * U / 8), J = Math.ceil(G / 4), m = new ArrayBuffer(J * 4), M = new Uint8Array(m), M.set(new Uint8Array(n, i.ptr, G)), F = new Uint32Array(m), i.ptr += G, u >= 3 ? S = r.unstuffLUT2(p, d, R - 1, f, k, L) : S = r.unstuffLUT(p, d, R - 1, f, k, L), u >= 3 ? r.unstuff2(F, a, U, w, S) : r.unstuff(F, a, U, w, S);
            } else
              i.counter.bitstuffer++, U = d, i.ptr += l, U > 0 && (G = Math.ceil(w * U / 8), J = Math.ceil(G / 4), m = new ArrayBuffer(J * 4), M = new Uint8Array(m), M.set(new Uint8Array(n, i.ptr, G)), F = new Uint32Array(m), i.ptr += G, u >= 3 ? f == null ? r.originalUnstuff2(F, a, U, w) : r.unstuff2(F, a, U, w, !1, f, k, L) : f == null ? r.originalUnstuff(F, a, U, w) : r.unstuff(F, a, U, w, !1, f, k, L));
          }
        },
        readTiles: function(n, i, a, f) {
          var s = i.headerInfo, g = s.width, u = s.height, l = g * u, c = s.microBlockSize, h = s.imageType, D = C.getDataTypeSize(h), Q = Math.ceil(g / c), x = Math.ceil(u / c);
          i.pixels.numBlocksY = x, i.pixels.numBlocksX = Q, i.pixels.ptr = 0;
          var E = 0, d = 0, w = 0, k = 0, F = 0, m = 0, M = 0, G = 0, J = 0, S = 0, p = 0, R = 0, U = 0, L = 0, N = 0, v = 0, K, _, b, q, T, O, H = new a(c * c), X = u % c || c, j = g % c || c, $, W, LA = s.numDims, fA, iA = i.pixels.resultMask, eA = i.pixels.resultPixels, ii = s.fileVersion, Le = ii >= 5 ? 14 : 15, BA, zA = s.zMax, lA;
          for (w = 0; w < x; w++)
            for (F = w !== x - 1 ? c : X, k = 0; k < Q; k++)
              for (m = k !== Q - 1 ? c : j, p = w * g * c + k * c, R = g - m, fA = 0; fA < LA; fA++) {
                if (LA > 1 ? (lA = eA, p = w * g * c + k * c, eA = new a(i.pixels.resultPixels.buffer, l * fA * D, l), zA = s.maxValues[fA]) : lA = null, M = n.byteLength - i.ptr, K = new DataView(n, i.ptr, Math.min(10, M)), _ = {}, v = 0, G = K.getUint8(0), v++, BA = s.fileVersion >= 5 ? G & 4 : 0, J = G >> 6 & 255, S = G >> 2 & Le, S !== (k * c >> 3 & Le) || BA && fA === 0)
                  throw "integrity issue";
                if (O = G & 3, O > 3)
                  throw i.ptr += v, "Invalid block encoding (" + O + ")";
                if (O === 2) {
                  if (BA)
                    if (iA)
                      for (E = 0; E < F; E++)
                        for (d = 0; d < m; d++)
                          iA[p] && (eA[p] = lA[p]), p++;
                    else
                      for (E = 0; E < F; E++)
                        for (d = 0; d < m; d++)
                          eA[p] = lA[p], p++;
                  i.counter.constant++, i.ptr += v;
                  continue;
                } else if (O === 0) {
                  if (BA)
                    throw "integrity issue";
                  if (i.counter.uncompressed++, i.ptr += v, U = F * m * D, L = n.byteLength - i.ptr, U = U < L ? U : L, b = new ArrayBuffer(U % D === 0 ? U : U + D - U % D), q = new Uint8Array(b), q.set(new Uint8Array(n, i.ptr, U)), T = new a(b), N = 0, iA)
                    for (E = 0; E < F; E++) {
                      for (d = 0; d < m; d++)
                        iA[p] && (eA[p] = T[N++]), p++;
                      p += R;
                    }
                  else
                    for (E = 0; E < F; E++) {
                      for (d = 0; d < m; d++)
                        eA[p++] = T[N++];
                      p += R;
                    }
                  i.ptr += N * D;
                } else if ($ = C.getDataTypeUsed(BA && h < 6 ? 4 : h, J), W = C.getOnePixel(_, v, $, K), v += C.getDataTypeSize($), O === 3)
                  if (i.ptr += v, i.counter.constantoffset++, iA)
                    for (E = 0; E < F; E++) {
                      for (d = 0; d < m; d++)
                        iA[p] && (eA[p] = BA ? Math.min(zA, lA[p] + W) : W), p++;
                      p += R;
                    }
                  else
                    for (E = 0; E < F; E++) {
                      for (d = 0; d < m; d++)
                        eA[p] = BA ? Math.min(zA, lA[p] + W) : W, p++;
                      p += R;
                    }
                else if (i.ptr += v, C.decodeBits(n, i, H, W, fA), v = 0, BA)
                  if (iA)
                    for (E = 0; E < F; E++) {
                      for (d = 0; d < m; d++)
                        iA[p] && (eA[p] = H[v++] + lA[p]), p++;
                      p += R;
                    }
                  else
                    for (E = 0; E < F; E++) {
                      for (d = 0; d < m; d++)
                        eA[p] = H[v++] + lA[p], p++;
                      p += R;
                    }
                else if (iA)
                  for (E = 0; E < F; E++) {
                    for (d = 0; d < m; d++)
                      iA[p] && (eA[p] = H[v++]), p++;
                    p += R;
                  }
                else
                  for (E = 0; E < F; E++) {
                    for (d = 0; d < m; d++)
                      eA[p++] = H[v++];
                    p += R;
                  }
              }
          LA > 1 && !f && (i.pixels.resultPixels = C.swapDimensionOrder(i.pixels.resultPixels, l, LA, a));
        },
        /*****************
        *  private methods (helper methods)
        *****************/
        formatFileInfo: function(n) {
          return {
            fileIdentifierString: n.headerInfo.fileIdentifierString,
            fileVersion: n.headerInfo.fileVersion,
            imageType: n.headerInfo.imageType,
            height: n.headerInfo.height,
            width: n.headerInfo.width,
            numValidPixel: n.headerInfo.numValidPixel,
            microBlockSize: n.headerInfo.microBlockSize,
            blobSize: n.headerInfo.blobSize,
            maxZError: n.headerInfo.maxZError,
            pixelType: C.getPixelType(n.headerInfo.imageType),
            eofOffset: n.eofOffset,
            mask: n.mask ? {
              numBytes: n.mask.numBytes
            } : null,
            pixels: {
              numBlocksX: n.pixels.numBlocksX,
              numBlocksY: n.pixels.numBlocksY,
              //"numBytes": data.pixels.numBytes,
              maxValue: n.headerInfo.zMax,
              minValue: n.headerInfo.zMin,
              noDataValue: n.noDataValue
            }
          };
        },
        constructConstantSurface: function(n, i) {
          var a = n.headerInfo.zMax, f = n.headerInfo.zMin, s = n.headerInfo.maxValues, g = n.headerInfo.numDims, u = n.headerInfo.height * n.headerInfo.width, l = 0, c = 0, h = 0, D = n.pixels.resultMask, Q = n.pixels.resultPixels;
          if (D)
            if (g > 1) {
              if (i)
                for (l = 0; l < g; l++)
                  for (h = l * u, a = s[l], c = 0; c < u; c++)
                    D[c] && (Q[h + c] = a);
              else
                for (c = 0; c < u; c++)
                  if (D[c])
                    for (h = c * g, l = 0; l < g; l++)
                      Q[h + g] = s[l];
            } else
              for (c = 0; c < u; c++)
                D[c] && (Q[c] = a);
          else if (g > 1 && f !== a)
            if (i)
              for (l = 0; l < g; l++)
                for (h = l * u, a = s[l], c = 0; c < u; c++)
                  Q[h + c] = a;
            else
              for (c = 0; c < u; c++)
                for (h = c * g, l = 0; l < g; l++)
                  Q[h + l] = s[l];
          else
            for (c = 0; c < u * g; c++)
              Q[c] = a;
        },
        getDataTypeArray: function(n) {
          var i;
          switch (n) {
            case 0:
              i = Int8Array;
              break;
            case 1:
              i = Uint8Array;
              break;
            case 2:
              i = Int16Array;
              break;
            case 3:
              i = Uint16Array;
              break;
            case 4:
              i = Int32Array;
              break;
            case 5:
              i = Uint32Array;
              break;
            case 6:
              i = Float32Array;
              break;
            case 7:
              i = Float64Array;
              break;
            default:
              i = Float32Array;
          }
          return i;
        },
        getPixelType: function(n) {
          var i;
          switch (n) {
            case 0:
              i = "S8";
              break;
            case 1:
              i = "U8";
              break;
            case 2:
              i = "S16";
              break;
            case 3:
              i = "U16";
              break;
            case 4:
              i = "S32";
              break;
            case 5:
              i = "U32";
              break;
            case 6:
              i = "F32";
              break;
            case 7:
              i = "F64";
              break;
            default:
              i = "F32";
          }
          return i;
        },
        isValidPixelValue: function(n, i) {
          if (i == null)
            return !1;
          var a;
          switch (n) {
            case 0:
              a = i >= -128 && i <= 127;
              break;
            case 1:
              a = i >= 0 && i <= 255;
              break;
            case 2:
              a = i >= -32768 && i <= 32767;
              break;
            case 3:
              a = i >= 0 && i <= 65536;
              break;
            case 4:
              a = i >= -2147483648 && i <= 2147483647;
              break;
            case 5:
              a = i >= 0 && i <= 4294967296;
              break;
            case 6:
              a = i >= -34027999387901484e22 && i <= 34027999387901484e22;
              break;
            case 7:
              a = i >= -17976931348623157e292 && i <= 17976931348623157e292;
              break;
            default:
              a = !1;
          }
          return a;
        },
        getDataTypeSize: function(n) {
          var i = 0;
          switch (n) {
            case 0:
            case 1:
              i = 1;
              break;
            case 2:
            case 3:
              i = 2;
              break;
            case 4:
            case 5:
            case 6:
              i = 4;
              break;
            case 7:
              i = 8;
              break;
            default:
              i = n;
          }
          return i;
        },
        getDataTypeUsed: function(n, i) {
          var a = n;
          switch (n) {
            case 2:
            case 4:
              a = n - i;
              break;
            case 3:
            case 5:
              a = n - 2 * i;
              break;
            case 6:
              i === 0 ? a = n : i === 1 ? a = 2 : a = 1;
              break;
            case 7:
              i === 0 ? a = n : a = n - 2 * i + 1;
              break;
            default:
              a = n;
              break;
          }
          return a;
        },
        getOnePixel: function(n, i, a, f) {
          var s = 0;
          switch (a) {
            case 0:
              s = f.getInt8(i);
              break;
            case 1:
              s = f.getUint8(i);
              break;
            case 2:
              s = f.getInt16(i, !0);
              break;
            case 3:
              s = f.getUint16(i, !0);
              break;
            case 4:
              s = f.getInt32(i, !0);
              break;
            case 5:
              s = f.getUInt32(i, !0);
              break;
            case 6:
              s = f.getFloat32(i, !0);
              break;
            case 7:
              s = f.getFloat64(i, !0);
              break;
            default:
              throw "the decoder does not understand this pixel type";
          }
          return s;
        },
        swapDimensionOrder: function(n, i, a, f, s) {
          var g = 0, u = 0, l = 0, c = 0, h = n;
          if (a > 1)
            if (h = new f(i * a), s)
              for (g = 0; g < i; g++)
                for (c = g, l = 0; l < a; l++, c += i)
                  h[c] = n[u++];
            else
              for (g = 0; g < i; g++)
                for (c = g, l = 0; l < a; l++, c += i)
                  h[u++] = n[c];
          return h;
        }
      }, B = function(n, i, a) {
        this.val = n, this.left = i, this.right = a;
      }, y = {
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
        decode: function(n, i) {
          i = i || {};
          var a = i.noDataValue, f = 0, s = {};
          if (s.ptr = i.inputOffset || 0, s.pixels = {}, !!C.readHeaderInfo(n, s)) {
            var g = s.headerInfo, u = g.fileVersion, l = C.getDataTypeArray(g.imageType);
            if (u > 5)
              throw "unsupported lerc version 2." + u;
            C.readMask(n, s), g.numValidPixel !== g.width * g.height && !s.pixels.resultMask && (s.pixels.resultMask = i.maskData);
            var c = g.width * g.height;
            s.pixels.resultPixels = new l(c * g.numDims), s.counter = {
              onesweep: 0,
              uncompressed: 0,
              lut: 0,
              bitstuffer: 0,
              constant: 0,
              constantoffset: 0
            };
            var h = !i.returnPixelInterleavedDims;
            if (g.numValidPixel !== 0)
              if (g.zMax === g.zMin)
                C.constructConstantSurface(s, h);
              else if (u >= 4 && C.checkMinMaxRanges(n, s))
                C.constructConstantSurface(s, h);
              else {
                var D = new DataView(n, s.ptr, 2), Q = D.getUint8(0);
                if (s.ptr++, Q)
                  C.readDataOneSweep(n, s, l, h);
                else if (u > 1 && g.imageType <= 1 && Math.abs(g.maxZError - 0.5) < 1e-5) {
                  var x = D.getUint8(1);
                  if (s.ptr++, s.encodeMode = x, x > 2 || u < 4 && x > 1)
                    throw "Invalid Huffman flag " + x;
                  x ? C.readHuffman(n, s, l, h) : C.readTiles(n, s, l, h);
                } else
                  C.readTiles(n, s, l, h);
              }
            s.eofOffset = s.ptr;
            var E;
            i.inputOffset ? (E = s.headerInfo.blobSize + i.inputOffset - s.ptr, Math.abs(E) >= 1 && (s.eofOffset = i.inputOffset + s.headerInfo.blobSize)) : (E = s.headerInfo.blobSize - s.ptr, Math.abs(E) >= 1 && (s.eofOffset = s.headerInfo.blobSize));
            var d = {
              width: g.width,
              height: g.height,
              pixelData: s.pixels.resultPixels,
              minValue: g.zMin,
              maxValue: g.zMax,
              validPixelCount: g.numValidPixel,
              dimCount: g.numDims,
              dimStats: {
                minValues: g.minValues,
                maxValues: g.maxValues
              },
              maskData: s.pixels.resultMask
              //noDataValue: noDataValue
            };
            if (s.pixels.resultMask && C.isValidPixelValue(g.imageType, a)) {
              var w = s.pixels.resultMask;
              for (f = 0; f < c; f++)
                w[f] || (d.pixelData[f] = a);
              d.noDataValue = a;
            }
            return s.noDataValue = a, i.returnFileInfo && (d.fileInfo = C.formatFileInfo(s)), d;
          }
        },
        getBandCount: function(n) {
          var i = 0, a = 0, f = {};
          for (f.ptr = 0, f.pixels = {}; a < n.byteLength - 58; )
            C.readHeaderInfo(n, f), a += f.headerInfo.blobSize, i++, f.ptr = a;
          return i;
        }
      };
      return y;
    }(), o = function() {
      var r = new ArrayBuffer(4), C = new Uint8Array(r), B = new Uint32Array(r);
      return B[0] = 1, C[0] === 1;
    }(), I = {
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
      decode: function(r, C) {
        if (!o)
          throw "Big endian system is not supported.";
        C = C || {};
        var B = C.inputOffset || 0, y = new Uint8Array(r, B, 10), n = String.fromCharCode.apply(null, y), i, a;
        if (n.trim() === "CntZImage")
          i = e, a = 1;
        else if (n.substring(0, 5) === "Lerc2")
          i = A, a = 2;
        else
          throw "Unexpected file identifier string: " + n;
        for (var f = 0, s = r.byteLength - 10, g, u = [], l, c, h = {
          width: 0,
          height: 0,
          pixels: [],
          pixelType: C.pixelType,
          mask: null,
          statistics: []
        }, D = 0; B < s; ) {
          var Q = i.decode(r, {
            inputOffset: B,
            //for both lerc1 and lerc2
            encodedMaskData: g,
            //lerc1 only
            maskData: c,
            //lerc2 only
            returnMask: f === 0,
            //lerc1 only
            returnEncodedMask: f === 0,
            //lerc1 only
            returnFileInfo: !0,
            //for both lerc1 and lerc2
            returnPixelInterleavedDims: C.returnPixelInterleavedDims,
            //for ndim lerc2 only
            pixelType: C.pixelType || null,
            //lerc1 only
            noDataValue: C.noDataValue || null
            //lerc1 only
          });
          B = Q.fileInfo.eofOffset, c = Q.maskData, f === 0 && (g = Q.encodedMaskData, h.width = Q.width, h.height = Q.height, h.dimCount = Q.dimCount || 1, h.pixelType = Q.pixelType || Q.fileInfo.pixelType, h.mask = c), a > 1 && (c && u.push(c), Q.fileInfo.mask && Q.fileInfo.mask.numBytes > 0 && D++), f++, h.pixels.push(Q.pixelData), h.statistics.push({
            minValue: Q.minValue,
            maxValue: Q.maxValue,
            noDataValue: Q.noDataValue,
            dimStats: Q.dimStats
          });
        }
        var x, E, d;
        if (a > 1 && D > 1) {
          for (d = h.width * h.height, h.bandMasks = u, c = new Uint8Array(d), c.set(u[0]), x = 1; x < u.length; x++)
            for (l = u[x], E = 0; E < d; E++)
              c[E] = c[E] & l[E];
          h.maskData = c;
        }
        return h;
      }
    };
    t.exports ? t.exports = I : this.Lerc = I;
  })();
})(ei);
var Mo = ei.exports;
const Uo = /* @__PURE__ */ me(Mo);
let mA, gA, ue;
const le = {
  env: {
    emscripten_notify_memory_growth: function(t) {
      ue = new Uint8Array(gA.exports.memory.buffer);
    }
  }
};
class bo {
  init() {
    return mA || (typeof fetch < "u" ? mA = fetch("data:application/wasm;base64," + ct).then((e) => e.arrayBuffer()).then((e) => WebAssembly.instantiate(e, le)).then(this._init) : mA = WebAssembly.instantiate(Buffer.from(ct, "base64"), le).then(this._init), mA);
  }
  _init(e) {
    gA = e.instance, le.env.emscripten_notify_memory_growth(0);
  }
  decode(e, A = 0) {
    if (!gA) throw new Error("ZSTDDecoder: Await .init() before decoding.");
    const o = e.byteLength, I = gA.exports.malloc(o);
    ue.set(e, I), A = A || Number(gA.exports.ZSTD_findDecompressedSize(I, o));
    const r = gA.exports.malloc(A), C = gA.exports.ZSTD_decompress(r, A, I, o), B = ue.slice(r, r + C);
    return gA.exports.free(I), gA.exports.free(r), B;
  }
}
const ct = "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IAMNACAEQQNxBEADQCACRQ0FIAAgAkF/aiICaiIDIAEgAmotAAA6AAAgA0EDcQ0ACwsgAkEDTQ0AA0AgACACQXxqIgJqIAEgAmooAgA2AgAgAkEDSw0ACwsgAkUNAgNAIAAgAkF/aiICaiABIAJqLQAAOgAAIAINAAsMAgsgAkEDTQ0AIAIhBANAIAMgASgCADYCACABQQRqIQEgA0EEaiEDIARBfGoiBEEDSw0ACyACQQNxIQILIAJFDQADQCADIAEtAAA6AAAgA0EBaiEDIAFBAWohASACQX9qIgINAAsLIAAL8wICAn8BfgJAIAJFDQAgACACaiIDQX9qIAE6AAAgACABOgAAIAJBA0kNACADQX5qIAE6AAAgACABOgABIANBfWogAToAACAAIAE6AAIgAkEHSQ0AIANBfGogAToAACAAIAE6AAMgAkEJSQ0AIABBACAAa0EDcSIEaiIDIAFB/wFxQYGChAhsIgE2AgAgAyACIARrQXxxIgRqIgJBfGogATYCACAEQQlJDQAgAyABNgIIIAMgATYCBCACQXhqIAE2AgAgAkF0aiABNgIAIARBGUkNACADIAE2AhggAyABNgIUIAMgATYCECADIAE2AgwgAkFwaiABNgIAIAJBbGogATYCACACQWhqIAE2AgAgAkFkaiABNgIAIAQgA0EEcUEYciIEayICQSBJDQAgAa0iBUIghiAFhCEFIAMgBGohAQNAIAEgBTcDGCABIAU3AxAgASAFNwMIIAEgBTcDACABQSBqIQEgAkFgaiICQR9LDQALCyAACy8BAn8gACgCBCAAKAIAQQJ0aiICLQACIQMgACACLwEAIAEgAi0AAxAIajYCACADCy8BAn8gACgCBCAAKAIAQQJ0aiICLQACIQMgACACLwEAIAEgAi0AAxAFajYCACADCx8AIAAgASACKAIEEAg2AgAgARAEGiAAIAJBCGo2AgQLCAAgAGdBH3MLugUBDX8jAEEQayIKJAACfyAEQQNNBEAgCkEANgIMIApBDGogAyAEEAsaIAAgASACIApBDGpBBBAVIgBBbCAAEAMbIAAgACAESxsMAQsgAEEAIAEoAgBBAXRBAmoQECENQVQgAygAACIGQQ9xIgBBCksNABogAiAAQQVqNgIAIAMgBGoiAkF8aiEMIAJBeWohDiACQXtqIRAgAEEGaiELQQQh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ASIDNgLE4AEgACgCvOABIQQgACABNgK84AEgACABIAJqNgK44AEgACABIAQgA2tqNgLA4AELpgEBAX8gACAAKALs4QEQFjYCyOABIABCADcD+OABIABCADcDuOABIABBwOABakIANwMAIABBqNAAaiIBQYyAgOAANgIAIABBADYCmOIBIABCADcDiOEBIABCAzcDgOEBIABBrNABakHgEikCADcCACAAQbTQAWpB6BIoAgA2AgAgACABNgIMIAAgAEGYIGo2AgggACAAQaAwajYCBCAAIABBEGo2AgALYQEBf0G4fyEDAkAgAUEDSQ0AIAIgABAhIgFBA3YiADYCCCACIAFBAXE2AgQgAiABQQF2QQNxIgM2AgACQCADQX9qIgFBAksNAAJAIAFBAWsOAgEAAgtBbA8LIAAhAwsgAwsMACAAIAEgAkEAEC4LiAQCA38CfiADEBYhBCAAQQBBKBAQIQAgBCACSwRAIAQPCyABRQRAQX8PCwJAAkAgA0EBRg0AIAEoAAAiBkGo6r5pRg0AQXYhAyAGQXBxQdDUtMIBRw0BQQghAyACQQhJDQEgAEEAQSgQECEAIAEoAAQhASAAQQE2AhQgACABrTcDAEEADwsgASACIAMQLyIDIAJLDQAgACADNgIYQXIhAyABIARqIgVBf2otAAAiAkEIcQ0AIAJBIHEiBkUEQEFwIQMgBS0AACIFQacBSw0BIAVBB3GtQgEgBUEDdkEKaq2GIgdCA4h+IAd8IQggBEEBaiEECyACQQZ2IQMgAkECdiEFAkAgAkEDcUF/aiICQQJLBEBBACECDAELAkACQAJAIAJBAWsOAgECAAsgASAEai0AACECIARBAWohBAwCCyABIARqLwAAIQIgBEECaiEEDAELIAEgBGooAAAhAiAEQQRqIQQLIAVBAXEhBQJ+AkACQAJAIANBf2oiA0ECTQRAIANBAWsOAgIDAQtCfyAGRQ0DGiABIARqMQAADAMLIAEgBGovAACtQoACfAwCCyABIARqKAAArQwBCyABIARqKQAACyEHIAAgBTYCICAAIAI2AhwgACAHNwMAQQAhAyAAQQA2AhQgACAHIAggBhsiBzcDCCAAIAdCgIAIIAdCgIAIVBs+AhALIAMLWwEBf0G4fyEDIAIQFiICIAFNBH8gACACakF/ai0AACIAQQNxQQJ0QaAeaigC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C0Egak8NAQsgByAHKQNoNwMQIAcgBykDYDcDCCAEIA0gB0EIaiAHQdwAaiAPIA4gESAQEB4hCwwBCyACIARqIQggBCAKEAcgAkERTwRAIARBEGohAgNAIAIgCkEQaiIKEAcgAkEQaiICIAhJDQALCyAIIAlrIQIgByATNgJcIAkgCCAOa0sEQCAJIAggEWtLBEBBbCELDAILIBAgAiAOayICaiIKIANqIBBNBEAgCCAKIAMQDxoMAgsgCCAKQQAgAmsQDyEIIAcgAiADaiIDNgJkIAggAmshCCAOIQILIAlBEE8EQCADIAhqIQMDQCAIIAIQByACQRBqIQIgCEEQaiIIIANJDQALDAELAkAgCUEHTQRAIAggAi0AADoAACAIIAItAAE6AAEgCCACLQACOgACIAggAi0AAzoAAyAIQQRqIAIgCUECdCIDQcAeaigCAGoiAhAXIAIgA0HgHmooAgBrIQIgBygCZCEDDAELIAggAhAMCyADQQlJDQAgAyAIaiEDIAhBCGoiCCACQQhqIgJrQQ9MBEADQCAIIAIQDCACQQhqIQIgCEEIaiIIIANJDQAMAgALAAsDQCAIIAIQByACQRBqIQIgCEEQaiIIIANJDQALCyAHQRhqEAQaIAsgDCALEAMiAhshDCAEIAQgC2ogAhshBCAFQX9qIgUNAAsgDBADDQFBbCEMIAdBGGoQBEECSQ0BQQAhCANAIAhBA0cEQCAAIAhBAnQiAmpBrNABaiACIAdqKAJENgIAIAhBAWohCAwBCwsgBygCXCEIC0G6fyEMIA8gCGsiACANIARrSw0AIAQEfyAEIAggABALIABqBUEACyABayEMCyAHQfAAaiQAIAwLkRcCFn8FfiMAQdABayIHJAAgByAAKALw4QEiCDYCvAEgASACaiESIAggACgCgOIBaiETAkACQCAFRQRAIAEhAwwBCyAAKALE4AEhESAAKALA4AEhFSAAKAK84AEhDyAAQQE2AozhAUEAIQgDQCAIQQNHBEAgByAIQQJ0IgJqIAAgAmpBrNABaigCADYCVCAIQQFqIQgMAQsLIAcgETYCZCAHIA82AmAgByABIA9rNgJoQWwhECAHQShqIAMgBBAGEAMNASAFQQQgBUEESBshFyAHQTxqIAdBKGogACgCABATIAdBxABqIAdBKGogACgCCBATIAdBzABqIAdB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IAdB0AFqJAAgEAslACAAQgA3AgAgAEEAOwEIIABBADoACyAAIAE2AgwgACACOgAKC7QFAQN/IwBBMGsiBCQAIABB/wFqIgVBfWohBgJAIAMvAQIEQCAEQRhqIAEgAhAGIgIQAw0BIARBEGogBEEYaiADEBwgBEEIaiAEQRhqIAMQHCAAIQMDQAJAIARBGGoQBCADIAZPckUEQCADIARBEGogBEEYahASOgAAIAMgBEEIaiAEQRhqEBI6AAEgBEEYahAERQ0BIANBAmohAwsgBUF+aiEFAn8DQEG6fyECIAMiASAFSw0FIAEgBEEQaiAEQRhqEBI6AAAgAUEBaiEDIARBGGoQBEEDRgRAQQIhAiAEQQhqDAILIAMgBUsNBSABIARBCGogBEEYahASOgABIAFBAmohA0EDIQIgBEEYahAEQQNHDQALIARBEGoLIQUgAyAFIARBGGoQEjoAACABIAJqIABrIQIMAwsgAyAEQRBqIARBGGoQEjoAAiADIARBCGogBEEYahASOgADIANBBGohAwwAAAsACyAEQRhqIAEgAhAGIgIQAw0AIARBEGogBEEYaiADEBwgBEEIaiAEQRhqIAMQHCAAIQMDQAJAIARBGGoQBCADIAZPckUEQCADIARBEGogBEEYahAROgAAIAMgBEEIaiAEQRhqEBE6AAEgBEEYahAERQ0BIANBAmohAwsgBUF+aiEFAn8DQEG6fyECIAMiASAFSw0EIAEgBEEQaiAEQRhqEBE6AAAgAUEBaiEDIARBGGoQBEEDRgRAQQIhAiAEQQhqDAILIAMgBUsNBCABIARBCGogBEEYahAROgABIAFBAmohA0EDIQIgBEEYahAEQQNHDQALIARBEGoLIQUgAyAFIARBGGoQEToAACABIAJqIABrIQIMAgsgAyAEQRBqIARBGGoQEToAAiADIARBCGogBEEYahAROgADIANBBGohAwwAAAsACyAEQTBqJAAgAgtpAQF/An8CQAJAIAJBB00NACABKAAAQbfIwuF+Rw0AIAAgASgABDYCmOIBQWIgAEEQaiABIAIQPiIDEAMNAhogAEKBgICAEDcDiOEBIAAgASADaiACIANrECoMAQsgACABIAIQKgtBAAsLrQMBBn8jAEGAAWsiAyQAQWIhCAJAIAJBCUkNACAAQZjQAGogAUEIaiIEIAJBeGogAEGY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wOABCwutAgIEfwF+IwBBQGoiBCQAAkACQCACQQhJDQAgASgAAEFwcUHQ1LTCAUcNACABIAIQIiEBIABCADcDCCAAQQA2AgQgACABNgIADAELIARBGGogASACEC0iAxADBEAgACADEBoMAQsgAwRAIABBuH8QGgwBCyACIAQoAjAiA2shAiABIANqIQMDQAJAIAAgAyACIARBCGoQLCIFEAMEfyAFBSACIAVBA2oiBU8NAUG4fwsQGgwCCyAGQQFqIQYgAiAFayECIAMgBWohAyAEKAIMRQ0ACyAEKAI4BEAgAkEDTQRAIABBuH8QGgwCCyADQQRqIQMLIAQoAighAiAEKQMYIQcgAEEANgIEIAAgAyABazYCACAAIAIgBmytIAcgB0J/URs3AwgLIARBQGskAAslAQF/IwBBEGsiAiQAIAIgACABEFEgAigCACEAIAJBEGokACAAC30BBH8jAEGQBGsiBCQAIARB/wE2AggCQCAEQRBqIARBCGogBEEMaiABIAIQFSIGEAMEQCAGIQUMAQtBVCEFIAQoAgwiB0EGSw0AIAMgBEEQaiAEKAIIIAcQQSIFEAMNACAAIAEgBmogAiAGayADEDwhBQsgBEGQBGokACAFC4cBAgJ/An5BABAWIQMCQANAIAEgA08EQAJAIAAoAABBcHFB0NS0wgFGBEAgACABECIiAhADRQ0BQn4PCyAAIAEQVSIEQn1WDQMgBCAFfCIFIARUIQJCfiEEIAINAyAAIAEQUiICEAMNAwsgASACayEBIAAgAmohAAwBCwtCfiAFIAEbIQQLIAQLPwIBfwF+IwBBMGsiAiQAAn5CfiACQQhqIAAgARAtDQAaQgAgAigCHEEBRg0AGiACKQMICyEDIAJBMGokACADC40BAQJ/IwBBMGsiASQAAkAgAEUNACAAKAKI4gENACABIABB/OEBaigCADYCKCABIAApAvThATcDICAAEDAgACgCqOIBIQIgASABKAIoNgIYIAEgASkDIDcDECACIAFBEGoQGyAAQQA2AqjiASABIAEoAig2AgggASABKQMgNwMAIAAgARAbCyABQTBqJAALKgECfyMAQRBrIgAkACAAQQA2AgggAEIANwMAIAAQWCEBIABBEGokACABC4cBAQN/IwBBEGsiAiQAAkAgACgCAEUgACgCBEVzDQAgAiAAKAIINgIIIAIgACkCADcDAAJ/IAIoAgAiAQRAIAIoAghBqOMJIAERBQAMAQtBqOMJECgLIgFFDQAgASAAKQIANwL04QEgAUH84QFqIAAoAgg2AgAgARBZIAEhAwsgAkEQaiQAIAMLywEBAn8jAEEgayIBJAAgAEGBgIDAADYCtOIBIABBADYCiOIBIABBADYC7OEBIABCADcDkOIBIABBADYCpOMJIABBADYC3OIBIABCADcCzOIBIABBADYCvOIBIABBADYCxOABIABCADcCnOIBIABBpOIBakIANwIAIABBrOIBakEANgIAIAFCADcCECABQgA3AhggASABKQMYNwMIIAEgASkDEDcDACABKAIIQQh2QQFxIQIgAEEANgLg4gEgACACNgKM4gEgAUEgaiQAC3YBA38jAEEwayIBJAAgAARAIAEgAEHE0AFqIgIoAgA2AiggASAAKQK80AE3AyAgACgCACEDIAEgAigCADYCGCABIAApArzQATcDECADIAFBEGoQGyABIAEoAig2AgggASABKQMgNwMAIAAgARAbCyABQTBqJAALzAEBAX8gACABKAK00AE2ApjiASAAIAEoAgQiAjYCwOABIAAgAjYCvOABIAAgAiABKAIIaiICNgK44AEgACACNgLE4AEgASgCuNABBEAgAEKBgICAEDcDiOEBIAAgAUGk0ABqNgIMIAAgAUGUIGo2AgggACABQZwwajYCBCAAIAFBDGo2AgAgAEGs0AFqIAFBqNABaigCADYCACAAQbDQAWogAUGs0AFqKAIANgIAIABBtNABaiABQbDQAWooAgA2AgAPCyAAQgA3A4jhAQs7ACACRQRAQbp/DwsgBEUEQEFsDwsgAiAEEGAEQCAAIAEgAiADIAQgBRBhDwsgACABIAIgAyAEIAUQZQtGAQF/IwBBEGsiBSQAIAVBCGogBBAOAn8gBS0ACQRAIAAgASACIAMgBBAyDAELIAAgASACIAMgBBA0CyEAIAVBEGokACAACzQAIAAgAyAEIAUQNiIFEAMEQCAFDwsgBSAESQR/IAEgAiADIAVqIAQgBWsgABA1BUG4fwsLRgEBfyMAQRBrIgUkACAFQQhqIAQQDgJ/IAUtAAkEQCAAIAEgAiADIAQQYgwBCyAAIAEgAiADIAQQNQshACAFQRBqJAAgAAtZAQF/QQ8hAiABIABJBEAgAUEE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", ti = new bo();
class Lo extends EA {
  constructor(e) {
    super(), this.planarConfiguration = typeof e.PlanarConfiguration < "u" ? e.PlanarConfiguration : 1, this.samplesPerPixel = typeof e.SamplesPerPixel < "u" ? e.SamplesPerPixel : 1, this.addCompression = e.LercParameters[en.AddCompression];
  }
  decodeBlock(e) {
    switch (this.addCompression) {
      case ee.None:
        break;
      case ee.Deflate:
        e = Ai(new Uint8Array(e)).buffer;
        break;
      case ee.Zstandard:
        e = ti.decode(new Uint8Array(e)).buffer;
        break;
      default:
        throw new Error(`Unsupported LERC additional compression method identifier: ${this.addCompression}`);
    }
    return Uo.decode(e, { returnPixelInterleavedDims: this.planarConfiguration === 1 }).pixels[0].buffer;
  }
}
const Ro = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Lo,
  zstd: ti
}, Symbol.toStringTag, { value: "Module" }));
class vo extends EA {
  constructor() {
    if (super(), typeof createImageBitmap > "u")
      throw new Error("Cannot decode WebImage as `createImageBitmap` is not available");
    if (typeof document > "u" && typeof OffscreenCanvas > "u")
      throw new Error("Cannot decode WebImage as neither `document` nor `OffscreenCanvas` is not available");
  }
  async decode(e, A) {
    const o = new Blob([A]), I = await createImageBitmap(o);
    let r;
    typeof document < "u" ? (r = document.createElement("canvas"), r.width = I.width, r.height = I.height) : r = new OffscreenCanvas(I.width, I.height);
    const C = r.getContext("2d");
    return C.drawImage(I, 0, 0), C.getImageData(0, 0, I.width, I.height).data.buffer;
  }
}
const No = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: vo
}, Symbol.toStringTag, { value: "Module" }));
export {
  Ei as Compass,
  Yo as SingleImageSource,
  Tn as TifDEMLoder,
  Oo as TifDemSource,
  Jo as createCompass,
  Ko as mapSource
};
