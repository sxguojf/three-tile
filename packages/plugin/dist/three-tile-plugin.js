import { TileCanvasLoader as oi, registerImgLoader as ee, LoaderFactory as si, TileMaterial as nn, TileSource as tA, TileGeometry as rn, registerDEMLoader as on } from "three-tile";
import { ShaderMaterial as sn, UniformsUtils as an, UniformsLib as gn, Mesh as ln, Color as ZA, PlaneGeometry as In, FogExp2 as Oe, EventDispatcher as ai, Vector3 as sA, MOUSE as mA, TOUCH as SA, Spherical as ut, Quaternion as dt, Vector2 as IA, Ray as cn, Plane as fn, MathUtils as ze, Clock as Bn, Scene as hn, WebGLRenderer as Cn, PerspectiveCamera as En, AmbientLight as Qn, DirectionalLight as un, MeshNormalMaterial as dn, ImageLoader as wn, Texture as yn, SRGBColorSpace as pn, FileLoader as Dn, MeshBasicMaterial as mn } from "three";
const xn = `<style>\r
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
class kn {
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
  constructor(A) {
    this.controls = A, this.dom.innerHTML = xn, this.dom.style.width = "100%", this.dom.style.height = "100%", this.plane = this.dom.querySelector("#tt-compass-plane"), this.text = this.dom.querySelector("#tt-compass-text"), A.addEventListener("change", () => {
      this.plane && this.text && (this.plane.style.transform = `rotateX(${A.getPolarAngle()}rad)`, this.text.style.transform = `rotate(${A.getAzimuthalAngle()}rad)`);
    }), this.dom.onclick = () => open("https://github.com/sxguojf/three-tile");
  }
}
function aa(t) {
  return new kn(t);
}
class Sn extends oi {
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
  drawTile(A, e) {
    const { x: i, y: s, z: r, bounds: c, lonLatBounds: a } = e, w = A.canvas.width, o = A.canvas.height;
    A.strokeStyle = "#ccc", A.lineWidth = 4, A.strokeRect(5, 5, w - 10, o - 10), A.fillStyle = "white", A.shadowColor = "black", A.shadowBlur = 5, A.shadowOffsetX = 1, A.shadowOffsetY = 1, A.font = "bold 20px arial", A.textAlign = "center", A.fillText(`Level: ${r}`, w / 2, 50), A.fillText(`[${i}, ${s}]`, o / 2, 80);
    const n = w / 2;
    A.font = "14px arial", A.fillText(`[${c[0].toFixed(3)}, ${c[1].toFixed(3)}]`, n, o - 50), A.fillText(`[${c[2].toFixed(3)}, ${c[3].toFixed(3)}]`, n, o - 30), a && (A.fillText(`[${a[0].toFixed(3)}, ${a[1].toFixed(3)}]`, n, o - 120), A.fillText(`[${a[2].toFixed(3)}, ${a[3].toFixed(3)}]`, n, o - 100));
  }
}
ee(new Sn());
const bn = `
varying vec2 vUv;
uniform vec3 bkColor;
uniform vec3 airColor;

void main() {  
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);  
}  
`, Fn = `
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
class Mn extends sn {
  constructor(A) {
    super({
      uniforms: an.merge([
        gn.fog,
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
      vertexShader: bn,
      fragmentShader: Fn,
      lights: !1
    });
  }
}
class Gn extends ln {
  get bkColor() {
    return this.material.uniforms.bkColor.value;
  }
  set bkColor(A) {
    this.material.uniforms.bkColor.value.set(A);
  }
  constructor(A, e = new ZA(6724044)) {
    super(new In(5, 5), new Mn({ bkColor: A, airColor: e })), this.renderOrder = 999;
  }
}
function ga(t, A = 14414079, e = 6724044) {
  const i = new Gn(new ZA(A), new ZA(e));
  return i.name = "fakeearth", i.applyMatrix4(t.rootTile.matrix), i;
}
class vn extends Oe {
  _controls;
  _factor = 1;
  get factor() {
    return this._factor;
  }
  set factor(A) {
    this._factor = A, this._controls.dispatchEvent({ type: "change" });
  }
  constructor(A, e) {
    super(e), this._controls = A, A.addEventListener("change", () => {
      const i = Math.max(A.getPolarAngle(), 0.1), s = Math.max(A.getDistance(), 0.1);
      this.density = i / (s + 5) * this.factor * 0.25;
    });
  }
}
function la(t, A = 14414079) {
  return new vn(t, A);
}
const wt = { type: "change" }, De = { type: "start" }, yt = { type: "end" }, re = new cn(), pt = new fn(), Ln = Math.cos(70 * ze.DEG2RAD);
class Rn extends ai {
  constructor(A, e) {
    super(), this.object = A, this.domElement = e, this.domElement.style.touchAction = "none", this.enabled = !0, this.target = new sA(), this.cursor = new sA(), this.minDistance = 0, this.maxDistance = 1 / 0, this.minZoom = 0, this.maxZoom = 1 / 0, this.minTargetRadius = 0, this.maxTargetRadius = 1 / 0, this.minPolarAngle = 0, this.maxPolarAngle = Math.PI, this.minAzimuthAngle = -1 / 0, this.maxAzimuthAngle = 1 / 0, this.enableDamping = !1, this.dampingFactor = 0.05, this.enableZoom = !0, this.zoomSpeed = 1, this.enableRotate = !0, this.rotateSpeed = 1, this.enablePan = !0, this.panSpeed = 1, this.screenSpacePanning = !0, this.keyPanSpeed = 7, this.zoomToCursor = !1, this.autoRotate = !1, this.autoRotateSpeed = 2, this.keys = { LEFT: "ArrowLeft", UP: "ArrowUp", RIGHT: "ArrowRight", BOTTOM: "ArrowDown" }, this.mouseButtons = { LEFT: mA.ROTATE, MIDDLE: mA.DOLLY, RIGHT: mA.PAN }, this.touches = { ONE: SA.ROTATE, TWO: SA.DOLLY_PAN }, this.target0 = this.target.clone(), this.position0 = this.object.position.clone(), this.zoom0 = this.object.zoom, this._domElementKeyEvents = null, this.getPolarAngle = function() {
      return a.phi;
    }, this.getAzimuthalAngle = function() {
      return a.theta;
    }, this.getDistance = function() {
      return this.object.position.distanceTo(this.target);
    }, this.listenToKeyEvents = function(m) {
      m.addEventListener("keydown", pe), this._domElementKeyEvents = m;
    }, this.stopListenToKeyEvents = function() {
      this._domElementKeyEvents.removeEventListener("keydown", pe), this._domElementKeyEvents = null;
    }, this.saveState = function() {
      i.target0.copy(i.target), i.position0.copy(i.object.position), i.zoom0 = i.object.zoom;
    }, this.reset = function() {
      i.target.copy(i.target0), i.object.position.copy(i.position0), i.object.zoom = i.zoom0, i.object.updateProjectionMatrix(), i.dispatchEvent(wt), i.update(), r = s.NONE;
    }, this.update = function() {
      const m = new sA(), v = new dt().setFromUnitVectors(A.up, new sA(0, 1, 0)), P = v.clone().invert(), X = new sA(), nA = new dt(), kA = new sA(), lA = 2 * Math.PI;
      return function(tn = null) {
        const Et = i.object.position;
        m.copy(Et).sub(i.target), m.applyQuaternion(v), a.setFromVector3(m), i.autoRotate && r === s.NONE && G(b(tn)), i.enableDamping ? (a.theta += w.theta * i.dampingFactor, a.phi += w.phi * i.dampingFactor) : (a.theta += w.theta, a.phi += w.phi);
        let dA = i.minAzimuthAngle, wA = i.maxAzimuthAngle;
        isFinite(dA) && isFinite(wA) && (dA < -Math.PI ? dA += lA : dA > Math.PI && (dA -= lA), wA < -Math.PI ? wA += lA : wA > Math.PI && (wA -= lA), dA <= wA ? a.theta = Math.max(dA, Math.min(wA, a.theta)) : a.theta = a.theta > (dA + wA) / 2 ? Math.max(dA, a.theta) : Math.min(wA, a.theta)), a.phi = Math.max(i.minPolarAngle, Math.min(i.maxPolarAngle, a.phi)), a.makeSafe(), i.enableDamping === !0 ? i.target.addScaledVector(n, i.dampingFactor) : i.target.add(n), i.target.sub(i.cursor), i.target.clampLength(i.minTargetRadius, i.maxTargetRadius), i.target.add(i.cursor);
        let KA = !1;
        if (i.zoomToCursor && C || i.object.isOrthographicCamera)
          a.radius = _(a.radius);
        else {
          const yA = a.radius;
          a.radius = _(a.radius * o), KA = yA != a.radius;
        }
        if (m.setFromSpherical(a), m.applyQuaternion(P), Et.copy(i.target).add(m), i.object.lookAt(i.target), i.enableDamping === !0 ? (w.theta *= 1 - i.dampingFactor, w.phi *= 1 - i.dampingFactor, n.multiplyScalar(1 - i.dampingFactor)) : (w.set(0, 0, 0), n.set(0, 0, 0)), i.zoomToCursor && C) {
          let yA = null;
          if (i.object.isPerspectiveCamera) {
            const HA = m.length();
            yA = _(HA * o);
            const ne = HA - yA;
            i.object.position.addScaledVector(E, ne), i.object.updateMatrixWorld(), KA = !!ne;
          } else if (i.object.isOrthographicCamera) {
            const HA = new sA(D.x, D.y, 0);
            HA.unproject(i.object);
            const ne = i.object.zoom;
            i.object.zoom = Math.max(i.minZoom, Math.min(i.maxZoom, i.object.zoom / o)), i.object.updateProjectionMatrix(), KA = ne !== i.object.zoom;
            const Qt = new sA(D.x, D.y, 0);
            Qt.unproject(i.object), i.object.position.sub(Qt).add(HA), i.object.updateMatrixWorld(), yA = m.length();
          } else
            console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."), i.zoomToCursor = !1;
          yA !== null && (this.screenSpacePanning ? i.target.set(0, 0, -1).transformDirection(i.object.matrix).multiplyScalar(yA).add(i.object.position) : (re.origin.copy(i.object.position), re.direction.set(0, 0, -1).transformDirection(i.object.matrix), Math.abs(i.object.up.dot(re.direction)) < Ln ? A.lookAt(i.target) : (pt.setFromNormalAndCoplanarPoint(i.object.up, i.target), re.intersectPlane(pt, i.target))));
        } else if (i.object.isOrthographicCamera) {
          const yA = i.object.zoom;
          i.object.zoom = Math.max(i.minZoom, Math.min(i.maxZoom, i.object.zoom / o)), yA !== i.object.zoom && (i.object.updateProjectionMatrix(), KA = !0);
        }
        return o = 1, C = !1, KA || X.distanceToSquared(i.object.position) > c || 8 * (1 - nA.dot(i.object.quaternion)) > c || kA.distanceToSquared(i.target) > c ? (i.dispatchEvent(wt), X.copy(i.object.position), nA.copy(i.object.quaternion), kA.copy(i.target), !0) : !1;
      };
    }(), this.dispose = function() {
      i.domElement.removeEventListener("contextmenu", ht), i.domElement.removeEventListener("pointerdown", fA), i.domElement.removeEventListener("pointercancel", oA), i.domElement.removeEventListener("wheel", It), i.domElement.removeEventListener("pointermove", FA), i.domElement.removeEventListener("pointerup", oA), i.domElement.getRootNode().removeEventListener("keydown", ct, { capture: !0 }), i._domElementKeyEvents !== null && (i._domElementKeyEvents.removeEventListener("keydown", pe), i._domElementKeyEvents = null);
    };
    const i = this, s = {
      NONE: -1,
      ROTATE: 0,
      DOLLY: 1,
      PAN: 2,
      TOUCH_ROTATE: 3,
      TOUCH_PAN: 4,
      TOUCH_DOLLY_PAN: 5,
      TOUCH_DOLLY_ROTATE: 6
    };
    let r = s.NONE;
    const c = 1e-6, a = new ut(), w = new ut();
    let o = 1;
    const n = new sA(), g = new IA(), B = new IA(), l = new IA(), I = new IA(), d = new IA(), f = new IA(), h = new IA(), u = new IA(), p = new IA(), E = new sA(), D = new IA();
    let C = !1;
    const Q = [], y = {};
    let S = !1;
    function b(m) {
      return m !== null ? 2 * Math.PI / 60 * i.autoRotateSpeed * m : 2 * Math.PI / 60 / 60 * i.autoRotateSpeed;
    }
    function x(m) {
      const v = Math.abs(m * 0.01);
      return Math.pow(0.95, i.zoomSpeed * v);
    }
    function G(m) {
      w.theta -= m;
    }
    function M(m) {
      w.phi -= m;
    }
    const Y = function() {
      const m = new sA();
      return function(P, X) {
        m.setFromMatrixColumn(X, 0), m.multiplyScalar(-P), n.add(m);
      };
    }(), F = function() {
      const m = new sA();
      return function(P, X) {
        i.screenSpacePanning === !0 ? m.setFromMatrixColumn(X, 1) : (m.setFromMatrixColumn(X, 0), m.crossVectors(i.object.up, m)), m.multiplyScalar(P), n.add(m);
      };
    }(), k = function() {
      const m = new sA();
      return function(P, X) {
        const nA = i.domElement;
        if (i.object.isPerspectiveCamera) {
          const kA = i.object.position;
          m.copy(kA).sub(i.target);
          let lA = m.length();
          lA *= Math.tan(i.object.fov / 2 * Math.PI / 180), Y(2 * P * lA / nA.clientHeight, i.object.matrix), F(2 * X * lA / nA.clientHeight, i.object.matrix);
        } else i.object.isOrthographicCamera ? (Y(P * (i.object.right - i.object.left) / i.object.zoom / nA.clientWidth, i.object.matrix), F(X * (i.object.top - i.object.bottom) / i.object.zoom / nA.clientHeight, i.object.matrix)) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."), i.enablePan = !1);
      };
    }();
    function U(m) {
      i.object.isPerspectiveCamera || i.object.isOrthographicCamera ? o /= m : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), i.enableZoom = !1);
    }
    function L(m) {
      i.object.isPerspectiveCamera || i.object.isOrthographicCamera ? o *= m : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), i.enableZoom = !1);
    }
    function R(m, v) {
      if (!i.zoomToCursor)
        return;
      C = !0;
      const P = i.domElement.getBoundingClientRect(), X = m - P.left, nA = v - P.top, kA = P.width, lA = P.height;
      D.x = X / kA * 2 - 1, D.y = -(nA / lA) * 2 + 1, E.set(D.x, D.y, 1).unproject(i.object).sub(i.object.position).normalize();
    }
    function _(m) {
      return Math.max(i.minDistance, Math.min(i.maxDistance, m));
    }
    function N(m) {
      g.set(m.clientX, m.clientY);
    }
    function H(m) {
      R(m.clientX, m.clientX), h.set(m.clientX, m.clientY);
    }
    function j(m) {
      I.set(m.clientX, m.clientY);
    }
    function T(m) {
      B.set(m.clientX, m.clientY), l.subVectors(B, g).multiplyScalar(i.rotateSpeed);
      const v = i.domElement;
      G(2 * Math.PI * l.x / v.clientHeight), M(2 * Math.PI * l.y / v.clientHeight), g.copy(B), i.update();
    }
    function q(m) {
      u.set(m.clientX, m.clientY), p.subVectors(u, h), p.y > 0 ? U(x(p.y)) : p.y < 0 && L(x(p.y)), h.copy(u), i.update();
    }
    function O(m) {
      d.set(m.clientX, m.clientY), f.subVectors(d, I).multiplyScalar(i.panSpeed), k(f.x, f.y), I.copy(d), i.update();
    }
    function K(m) {
      R(m.clientX, m.clientY), m.deltaY < 0 ? L(x(m.deltaY)) : m.deltaY > 0 && U(x(m.deltaY)), i.update();
    }
    function V(m) {
      let v = !1;
      switch (m.code) {
        case i.keys.UP:
          m.ctrlKey || m.metaKey || m.shiftKey ? M(2 * Math.PI * i.rotateSpeed / i.domElement.clientHeight) : k(0, i.keyPanSpeed), v = !0;
          break;
        case i.keys.BOTTOM:
          m.ctrlKey || m.metaKey || m.shiftKey ? M(-2 * Math.PI * i.rotateSpeed / i.domElement.clientHeight) : k(0, -i.keyPanSpeed), v = !0;
          break;
        case i.keys.LEFT:
          m.ctrlKey || m.metaKey || m.shiftKey ? G(2 * Math.PI * i.rotateSpeed / i.domElement.clientHeight) : k(i.keyPanSpeed, 0), v = !0;
          break;
        case i.keys.RIGHT:
          m.ctrlKey || m.metaKey || m.shiftKey ? G(-2 * Math.PI * i.rotateSpeed / i.domElement.clientHeight) : k(-i.keyPanSpeed, 0), v = !0;
          break;
      }
      v && (m.preventDefault(), i.update());
    }
    function z(m) {
      if (Q.length === 1)
        g.set(m.pageX, m.pageY);
      else {
        const v = RA(m), P = 0.5 * (m.pageX + v.x), X = 0.5 * (m.pageY + v.y);
        g.set(P, X);
      }
    }
    function W(m) {
      if (Q.length === 1)
        I.set(m.pageX, m.pageY);
      else {
        const v = RA(m), P = 0.5 * (m.pageX + v.x), X = 0.5 * (m.pageY + v.y);
        I.set(P, X);
      }
    }
    function AA(m) {
      const v = RA(m), P = m.pageX - v.x, X = m.pageY - v.y, nA = Math.sqrt(P * P + X * X);
      h.set(0, nA);
    }
    function eA(m) {
      i.enableZoom && AA(m), i.enablePan && W(m);
    }
    function LA(m) {
      i.enableZoom && AA(m), i.enableRotate && z(m);
    }
    function BA(m) {
      if (Q.length == 1)
        B.set(m.pageX, m.pageY);
      else {
        const P = RA(m), X = 0.5 * (m.pageX + P.x), nA = 0.5 * (m.pageY + P.y);
        B.set(X, nA);
      }
      l.subVectors(B, g).multiplyScalar(i.rotateSpeed);
      const v = i.domElement;
      G(2 * Math.PI * l.x / v.clientHeight), M(2 * Math.PI * l.y / v.clientHeight), g.copy(B);
    }
    function aA(m) {
      if (Q.length === 1)
        d.set(m.pageX, m.pageY);
      else {
        const v = RA(m), P = 0.5 * (m.pageX + v.x), X = 0.5 * (m.pageY + v.y);
        d.set(P, X);
      }
      f.subVectors(d, I).multiplyScalar(i.panSpeed), k(f.x, f.y), I.copy(d);
    }
    function iA(m) {
      const v = RA(m), P = m.pageX - v.x, X = m.pageY - v.y, nA = Math.sqrt(P * P + X * X);
      u.set(0, nA), p.set(0, Math.pow(u.y / h.y, i.zoomSpeed)), U(p.y), h.copy(u);
      const kA = (m.pageX + v.x) * 0.5, lA = (m.pageY + v.y) * 0.5;
      R(kA, lA);
    }
    function ye(m) {
      i.enableZoom && iA(m), i.enablePan && aA(m);
    }
    function ie(m) {
      i.enableZoom && iA(m), i.enableRotate && BA(m);
    }
    function fA(m) {
      i.enabled !== !1 && (Q.length === 0 && (i.domElement.setPointerCapture(m.pointerId), i.domElement.addEventListener("pointermove", FA), i.domElement.addEventListener("pointerup", oA)), !en(m) && ($i(m), m.pointerType === "touch" ? Bt(m) : Xi(m)));
    }
    function FA(m) {
      i.enabled !== !1 && (m.pointerType === "touch" ? Wi(m) : zi(m));
    }
    function oA(m) {
      switch (An(m), Q.length) {
        case 0:
          i.domElement.releasePointerCapture(m.pointerId), i.domElement.removeEventListener("pointermove", FA), i.domElement.removeEventListener("pointerup", oA), i.dispatchEvent(yt), r = s.NONE;
          break;
        case 1:
          const v = Q[0], P = y[v];
          Bt({ pointerId: v, pageX: P.x, pageY: P.y });
          break;
      }
    }
    function Xi(m) {
      let v;
      switch (m.button) {
        case 0:
          v = i.mouseButtons.LEFT;
          break;
        case 1:
          v = i.mouseButtons.MIDDLE;
          break;
        case 2:
          v = i.mouseButtons.RIGHT;
          break;
        default:
          v = -1;
      }
      switch (v) {
        case mA.DOLLY:
          if (i.enableZoom === !1) return;
          H(m), r = s.DOLLY;
          break;
        case mA.ROTATE:
          if (m.ctrlKey || m.metaKey || m.shiftKey) {
            if (i.enablePan === !1) return;
            j(m), r = s.PAN;
          } else {
            if (i.enableRotate === !1) return;
            N(m), r = s.ROTATE;
          }
          break;
        case mA.PAN:
          if (m.ctrlKey || m.metaKey || m.shiftKey) {
            if (i.enableRotate === !1) return;
            N(m), r = s.ROTATE;
          } else {
            if (i.enablePan === !1) return;
            j(m), r = s.PAN;
          }
          break;
        default:
          r = s.NONE;
      }
      r !== s.NONE && i.dispatchEvent(De);
    }
    function zi(m) {
      switch (r) {
        case s.ROTATE:
          if (i.enableRotate === !1) return;
          T(m);
          break;
        case s.DOLLY:
          if (i.enableZoom === !1) return;
          q(m);
          break;
        case s.PAN:
          if (i.enablePan === !1) return;
          O(m);
          break;
      }
    }
    function It(m) {
      i.enabled === !1 || i.enableZoom === !1 || r !== s.NONE || (m.preventDefault(), i.dispatchEvent(De), K(Zi(m)), i.dispatchEvent(yt));
    }
    function Zi(m) {
      const v = m.deltaMode, P = {
        clientX: m.clientX,
        clientY: m.clientY,
        deltaY: m.deltaY
      };
      switch (v) {
        case 1:
          P.deltaY *= 16;
          break;
        case 2:
          P.deltaY *= 100;
          break;
      }
      return m.ctrlKey && !S && (P.deltaY *= 10), P;
    }
    function ct(m) {
      m.key === "Control" && (S = !0, i.domElement.getRootNode().addEventListener("keyup", ft, { passive: !0, capture: !0 }));
    }
    function ft(m) {
      m.key === "Control" && (S = !1, i.domElement.getRootNode().removeEventListener("keyup", ft, { passive: !0, capture: !0 }));
    }
    function pe(m) {
      i.enabled === !1 || i.enablePan === !1 || V(m);
    }
    function Bt(m) {
      switch (Ct(m), Q.length) {
        case 1:
          switch (i.touches.ONE) {
            case SA.ROTATE:
              if (i.enableRotate === !1) return;
              z(m), r = s.TOUCH_ROTATE;
              break;
            case SA.PAN:
              if (i.enablePan === !1) return;
              W(m), r = s.TOUCH_PAN;
              break;
            default:
              r = s.NONE;
          }
          break;
        case 2:
          switch (i.touches.TWO) {
            case SA.DOLLY_PAN:
              if (i.enableZoom === !1 && i.enablePan === !1) return;
              eA(m), r = s.TOUCH_DOLLY_PAN;
              break;
            case SA.DOLLY_ROTATE:
              if (i.enableZoom === !1 && i.enableRotate === !1) return;
              LA(m), r = s.TOUCH_DOLLY_ROTATE;
              break;
            default:
              r = s.NONE;
          }
          break;
        default:
          r = s.NONE;
      }
      r !== s.NONE && i.dispatchEvent(De);
    }
    function Wi(m) {
      switch (Ct(m), r) {
        case s.TOUCH_ROTATE:
          if (i.enableRotate === !1) return;
          BA(m), i.update();
          break;
        case s.TOUCH_PAN:
          if (i.enablePan === !1) return;
          aA(m), i.update();
          break;
        case s.TOUCH_DOLLY_PAN:
          if (i.enableZoom === !1 && i.enablePan === !1) return;
          ye(m), i.update();
          break;
        case s.TOUCH_DOLLY_ROTATE:
          if (i.enableZoom === !1 && i.enableRotate === !1) return;
          ie(m), i.update();
          break;
        default:
          r = s.NONE;
      }
    }
    function ht(m) {
      i.enabled !== !1 && m.preventDefault();
    }
    function $i(m) {
      Q.push(m.pointerId);
    }
    function An(m) {
      delete y[m.pointerId];
      for (let v = 0; v < Q.length; v++)
        if (Q[v] == m.pointerId) {
          Q.splice(v, 1);
          return;
        }
    }
    function en(m) {
      for (let v = 0; v < Q.length; v++)
        if (Q[v] == m.pointerId) return !0;
      return !1;
    }
    function Ct(m) {
      let v = y[m.pointerId];
      v === void 0 && (v = new IA(), y[m.pointerId] = v), v.set(m.pageX, m.pageY);
    }
    function RA(m) {
      const v = m.pointerId === Q[0] ? Q[1] : Q[0];
      return y[v];
    }
    i.domElement.addEventListener("contextmenu", ht), i.domElement.addEventListener("pointerdown", fA), i.domElement.addEventListener("pointercancel", oA), i.domElement.addEventListener("wheel", It, { passive: !1 }), i.domElement.getRootNode().addEventListener("keydown", ct, { passive: !0, capture: !0 }), this.update();
  }
}
class Un extends Rn {
  constructor(A, e) {
    super(A, e), this.screenSpacePanning = !1, this.mouseButtons = { LEFT: mA.PAN, MIDDLE: mA.DOLLY, RIGHT: mA.ROTATE }, this.touches = { ONE: SA.PAN, TWO: SA.DOLLY_ROTATE };
  }
}
var _A = Object.freeze({
  Linear: Object.freeze({
    None: function(t) {
      return t;
    },
    In: function(t) {
      return t;
    },
    Out: function(t) {
      return t;
    },
    InOut: function(t) {
      return t;
    }
  }),
  Quadratic: Object.freeze({
    In: function(t) {
      return t * t;
    },
    Out: function(t) {
      return t * (2 - t);
    },
    InOut: function(t) {
      return (t *= 2) < 1 ? 0.5 * t * t : -0.5 * (--t * (t - 2) - 1);
    }
  }),
  Cubic: Object.freeze({
    In: function(t) {
      return t * t * t;
    },
    Out: function(t) {
      return --t * t * t + 1;
    },
    InOut: function(t) {
      return (t *= 2) < 1 ? 0.5 * t * t * t : 0.5 * ((t -= 2) * t * t + 2);
    }
  }),
  Quartic: Object.freeze({
    In: function(t) {
      return t * t * t * t;
    },
    Out: function(t) {
      return 1 - --t * t * t * t;
    },
    InOut: function(t) {
      return (t *= 2) < 1 ? 0.5 * t * t * t * t : -0.5 * ((t -= 2) * t * t * t - 2);
    }
  }),
  Quintic: Object.freeze({
    In: function(t) {
      return t * t * t * t * t;
    },
    Out: function(t) {
      return --t * t * t * t * t + 1;
    },
    InOut: function(t) {
      return (t *= 2) < 1 ? 0.5 * t * t * t * t * t : 0.5 * ((t -= 2) * t * t * t * t + 2);
    }
  }),
  Sinusoidal: Object.freeze({
    In: function(t) {
      return 1 - Math.sin((1 - t) * Math.PI / 2);
    },
    Out: function(t) {
      return Math.sin(t * Math.PI / 2);
    },
    InOut: function(t) {
      return 0.5 * (1 - Math.sin(Math.PI * (0.5 - t)));
    }
  }),
  Exponential: Object.freeze({
    In: function(t) {
      return t === 0 ? 0 : Math.pow(1024, t - 1);
    },
    Out: function(t) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    },
    InOut: function(t) {
      return t === 0 ? 0 : t === 1 ? 1 : (t *= 2) < 1 ? 0.5 * Math.pow(1024, t - 1) : 0.5 * (-Math.pow(2, -10 * (t - 1)) + 2);
    }
  }),
  Circular: Object.freeze({
    In: function(t) {
      return 1 - Math.sqrt(1 - t * t);
    },
    Out: function(t) {
      return Math.sqrt(1 - --t * t);
    },
    InOut: function(t) {
      return (t *= 2) < 1 ? -0.5 * (Math.sqrt(1 - t * t) - 1) : 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
    }
  }),
  Elastic: Object.freeze({
    In: function(t) {
      return t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI);
    },
    Out: function(t) {
      return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1;
    },
    InOut: function(t) {
      return t === 0 ? 0 : t === 1 ? 1 : (t *= 2, t < 1 ? -0.5 * Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI) : 0.5 * Math.pow(2, -10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI) + 1);
    }
  }),
  Back: Object.freeze({
    In: function(t) {
      var A = 1.70158;
      return t === 1 ? 1 : t * t * ((A + 1) * t - A);
    },
    Out: function(t) {
      var A = 1.70158;
      return t === 0 ? 0 : --t * t * ((A + 1) * t + A) + 1;
    },
    InOut: function(t) {
      var A = 2.5949095;
      return (t *= 2) < 1 ? 0.5 * (t * t * ((A + 1) * t - A)) : 0.5 * ((t -= 2) * t * ((A + 1) * t + A) + 2);
    }
  }),
  Bounce: Object.freeze({
    In: function(t) {
      return 1 - _A.Bounce.Out(1 - t);
    },
    Out: function(t) {
      return t < 1 / 2.75 ? 7.5625 * t * t : t < 2 / 2.75 ? 7.5625 * (t -= 1.5 / 2.75) * t + 0.75 : t < 2.5 / 2.75 ? 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375 : 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
    },
    InOut: function(t) {
      return t < 0.5 ? _A.Bounce.In(t * 2) * 0.5 : _A.Bounce.Out(t * 2 - 1) * 0.5 + 0.5;
    }
  }),
  generatePow: function(t) {
    return t === void 0 && (t = 4), t = t < Number.EPSILON ? Number.EPSILON : t, t = t > 1e4 ? 1e4 : t, {
      In: function(A) {
        return Math.pow(A, t);
      },
      Out: function(A) {
        return 1 - Math.pow(1 - A, t);
      },
      InOut: function(A) {
        return A < 0.5 ? Math.pow(A * 2, t) / 2 : (1 - Math.pow(2 - A * 2, t)) / 2 + 0.5;
      }
    };
  }
}), VA = function() {
  return performance.now();
}, Tn = (
  /** @class */
  function() {
    function t() {
      this._tweens = {}, this._tweensAddedDuringUpdate = {};
    }
    return t.prototype.getAll = function() {
      var A = this;
      return Object.keys(this._tweens).map(function(e) {
        return A._tweens[e];
      });
    }, t.prototype.removeAll = function() {
      this._tweens = {};
    }, t.prototype.add = function(A) {
      this._tweens[A.getId()] = A, this._tweensAddedDuringUpdate[A.getId()] = A;
    }, t.prototype.remove = function(A) {
      delete this._tweens[A.getId()], delete this._tweensAddedDuringUpdate[A.getId()];
    }, t.prototype.update = function(A, e) {
      A === void 0 && (A = VA()), e === void 0 && (e = !1);
      var i = Object.keys(this._tweens);
      if (i.length === 0)
        return !1;
      for (; i.length > 0; ) {
        this._tweensAddedDuringUpdate = {};
        for (var s = 0; s < i.length; s++) {
          var r = this._tweens[i[s]], c = !e;
          r && r.update(A, c) === !1 && !e && delete this._tweens[i[s]];
        }
        i = Object.keys(this._tweensAddedDuringUpdate);
      }
      return !0;
    }, t;
  }()
), qe = {
  Linear: function(t, A) {
    var e = t.length - 1, i = e * A, s = Math.floor(i), r = qe.Utils.Linear;
    return A < 0 ? r(t[0], t[1], i) : A > 1 ? r(t[e], t[e - 1], e - i) : r(t[s], t[s + 1 > e ? e : s + 1], i - s);
  },
  Utils: {
    Linear: function(t, A, e) {
      return (A - t) * e + t;
    }
  }
}, gi = (
  /** @class */
  function() {
    function t() {
    }
    return t.nextId = function() {
      return t._nextId++;
    }, t._nextId = 0, t;
  }()
), Ye = new Tn(), Dt = (
  /** @class */
  function() {
    function t(A, e) {
      e === void 0 && (e = Ye), this._object = A, this._group = e, this._isPaused = !1, this._pauseStart = 0, this._valuesStart = {}, this._valuesEnd = {}, this._valuesStartRepeat = {}, this._duration = 1e3, this._isDynamic = !1, this._initialRepeat = 0, this._repeat = 0, this._yoyo = !1, this._isPlaying = !1, this._reversed = !1, this._delayTime = 0, this._startTime = 0, this._easingFunction = _A.Linear.None, this._interpolationFunction = qe.Linear, this._chainedTweens = [], this._onStartCallbackFired = !1, this._onEveryStartCallbackFired = !1, this._id = gi.nextId(), this._isChainStopped = !1, this._propertiesAreSetUp = !1, this._goToEnd = !1;
    }
    return t.prototype.getId = function() {
      return this._id;
    }, t.prototype.isPlaying = function() {
      return this._isPlaying;
    }, t.prototype.isPaused = function() {
      return this._isPaused;
    }, t.prototype.getDuration = function() {
      return this._duration;
    }, t.prototype.to = function(A, e) {
      if (e === void 0 && (e = 1e3), this._isPlaying)
        throw new Error("Can not call Tween.to() while Tween is already started or paused. Stop the Tween first.");
      return this._valuesEnd = A, this._propertiesAreSetUp = !1, this._duration = e < 0 ? 0 : e, this;
    }, t.prototype.duration = function(A) {
      return A === void 0 && (A = 1e3), this._duration = A < 0 ? 0 : A, this;
    }, t.prototype.dynamic = function(A) {
      return A === void 0 && (A = !1), this._isDynamic = A, this;
    }, t.prototype.start = function(A, e) {
      if (A === void 0 && (A = VA()), e === void 0 && (e = !1), this._isPlaying)
        return this;
      if (this._group && this._group.add(this), this._repeat = this._initialRepeat, this._reversed) {
        this._reversed = !1;
        for (var i in this._valuesStartRepeat)
          this._swapEndStartRepeatValues(i), this._valuesStart[i] = this._valuesStartRepeat[i];
      }
      if (this._isPlaying = !0, this._isPaused = !1, this._onStartCallbackFired = !1, this._onEveryStartCallbackFired = !1, this._isChainStopped = !1, this._startTime = A, this._startTime += this._delayTime, !this._propertiesAreSetUp || e) {
        if (this._propertiesAreSetUp = !0, !this._isDynamic) {
          var s = {};
          for (var r in this._valuesEnd)
            s[r] = this._valuesEnd[r];
          this._valuesEnd = s;
        }
        this._setupProperties(this._object, this._valuesStart, this._valuesEnd, this._valuesStartRepeat, e);
      }
      return this;
    }, t.prototype.startFromCurrentValues = function(A) {
      return this.start(A, !0);
    }, t.prototype._setupProperties = function(A, e, i, s, r) {
      for (var c in i) {
        var a = A[c], w = Array.isArray(a), o = w ? "array" : typeof a, n = !w && Array.isArray(i[c]);
        if (!(o === "undefined" || o === "function")) {
          if (n) {
            var g = i[c];
            if (g.length === 0)
              continue;
            for (var B = [a], l = 0, I = g.length; l < I; l += 1) {
              var d = this._handleRelativeValue(a, g[l]);
              if (isNaN(d)) {
                n = !1, console.warn("Found invalid interpolation list. Skipping.");
                break;
              }
              B.push(d);
            }
            n && (i[c] = B);
          }
          if ((o === "object" || w) && a && !n) {
            e[c] = w ? [] : {};
            var f = a;
            for (var h in f)
              e[c][h] = f[h];
            s[c] = w ? [] : {};
            var g = i[c];
            if (!this._isDynamic) {
              var u = {};
              for (var h in g)
                u[h] = g[h];
              i[c] = g = u;
            }
            this._setupProperties(f, e[c], g, s[c], r);
          } else
            (typeof e[c] > "u" || r) && (e[c] = a), w || (e[c] *= 1), n ? s[c] = i[c].slice().reverse() : s[c] = e[c] || 0;
        }
      }
    }, t.prototype.stop = function() {
      return this._isChainStopped || (this._isChainStopped = !0, this.stopChainedTweens()), this._isPlaying ? (this._group && this._group.remove(this), this._isPlaying = !1, this._isPaused = !1, this._onStopCallback && this._onStopCallback(this._object), this) : this;
    }, t.prototype.end = function() {
      return this._goToEnd = !0, this.update(1 / 0), this;
    }, t.prototype.pause = function(A) {
      return A === void 0 && (A = VA()), this._isPaused || !this._isPlaying ? this : (this._isPaused = !0, this._pauseStart = A, this._group && this._group.remove(this), this);
    }, t.prototype.resume = function(A) {
      return A === void 0 && (A = VA()), !this._isPaused || !this._isPlaying ? this : (this._isPaused = !1, this._startTime += A - this._pauseStart, this._pauseStart = 0, this._group && this._group.add(this), this);
    }, t.prototype.stopChainedTweens = function() {
      for (var A = 0, e = this._chainedTweens.length; A < e; A++)
        this._chainedTweens[A].stop();
      return this;
    }, t.prototype.group = function(A) {
      return A === void 0 && (A = Ye), this._group = A, this;
    }, t.prototype.delay = function(A) {
      return A === void 0 && (A = 0), this._delayTime = A, this;
    }, t.prototype.repeat = function(A) {
      return A === void 0 && (A = 0), this._initialRepeat = A, this._repeat = A, this;
    }, t.prototype.repeatDelay = function(A) {
      return this._repeatDelayTime = A, this;
    }, t.prototype.yoyo = function(A) {
      return A === void 0 && (A = !1), this._yoyo = A, this;
    }, t.prototype.easing = function(A) {
      return A === void 0 && (A = _A.Linear.None), this._easingFunction = A, this;
    }, t.prototype.interpolation = function(A) {
      return A === void 0 && (A = qe.Linear), this._interpolationFunction = A, this;
    }, t.prototype.chain = function() {
      for (var A = [], e = 0; e < arguments.length; e++)
        A[e] = arguments[e];
      return this._chainedTweens = A, this;
    }, t.prototype.onStart = function(A) {
      return this._onStartCallback = A, this;
    }, t.prototype.onEveryStart = function(A) {
      return this._onEveryStartCallback = A, this;
    }, t.prototype.onUpdate = function(A) {
      return this._onUpdateCallback = A, this;
    }, t.prototype.onRepeat = function(A) {
      return this._onRepeatCallback = A, this;
    }, t.prototype.onComplete = function(A) {
      return this._onCompleteCallback = A, this;
    }, t.prototype.onStop = function(A) {
      return this._onStopCallback = A, this;
    }, t.prototype.update = function(A, e) {
      var i;
      if (A === void 0 && (A = VA()), e === void 0 && (e = !0), this._isPaused)
        return !0;
      var s = this._startTime + this._duration;
      if (!this._goToEnd && !this._isPlaying) {
        if (A > s)
          return !1;
        e && this.start(A, !0);
      }
      if (this._goToEnd = !1, A < this._startTime)
        return !0;
      this._onStartCallbackFired === !1 && (this._onStartCallback && this._onStartCallback(this._object), this._onStartCallbackFired = !0), this._onEveryStartCallbackFired === !1 && (this._onEveryStartCallback && this._onEveryStartCallback(this._object), this._onEveryStartCallbackFired = !0);
      var r = A - this._startTime, c = this._duration + ((i = this._repeatDelayTime) !== null && i !== void 0 ? i : this._delayTime), a = this._duration + this._repeat * c, w = this._calculateElapsedPortion(r, c, a), o = this._easingFunction(w), n = this._calculateCompletionStatus(r, c);
      if (n === "repeat" && this._processRepetition(r, c), this._updateProperties(this._object, this._valuesStart, this._valuesEnd, o), n === "about-to-repeat" && this._processRepetition(r, c), this._onUpdateCallback && this._onUpdateCallback(this._object, w), n === "repeat" || n === "about-to-repeat")
        this._onRepeatCallback && this._onRepeatCallback(this._object), this._onEveryStartCallbackFired = !1;
      else if (n === "completed") {
        this._isPlaying = !1, this._onCompleteCallback && this._onCompleteCallback(this._object);
        for (var g = 0, B = this._chainedTweens.length; g < B; g++)
          this._chainedTweens[g].start(this._startTime + this._duration, !1);
      }
      return n !== "completed";
    }, t.prototype._calculateElapsedPortion = function(A, e, i) {
      if (this._duration === 0 || A > i)
        return 1;
      var s = A % e, r = Math.min(s / this._duration, 1);
      return r === 0 && A !== 0 && A % this._duration === 0 ? 1 : r;
    }, t.prototype._calculateCompletionStatus = function(A, e) {
      return this._duration !== 0 && A < this._duration ? "playing" : this._repeat <= 0 ? "completed" : A === this._duration ? "about-to-repeat" : "repeat";
    }, t.prototype._processRepetition = function(A, e) {
      var i = Math.min(Math.trunc((A - this._duration) / e) + 1, this._repeat);
      isFinite(this._repeat) && (this._repeat -= i);
      for (var s in this._valuesStartRepeat) {
        var r = this._valuesEnd[s];
        !this._yoyo && typeof r == "string" && (this._valuesStartRepeat[s] = this._valuesStartRepeat[s] + parseFloat(r)), this._yoyo && this._swapEndStartRepeatValues(s), this._valuesStart[s] = this._valuesStartRepeat[s];
      }
      this._yoyo && (this._reversed = !this._reversed), this._startTime += e * i;
    }, t.prototype._updateProperties = function(A, e, i, s) {
      for (var r in i)
        if (e[r] !== void 0) {
          var c = e[r] || 0, a = i[r], w = Array.isArray(A[r]), o = Array.isArray(a), n = !w && o;
          n ? A[r] = this._interpolationFunction(a, s) : typeof a == "object" && a ? this._updateProperties(A[r], c, a, s) : (a = this._handleRelativeValue(c, a), typeof a == "number" && (A[r] = c + (a - c) * s));
        }
    }, t.prototype._handleRelativeValue = function(A, e) {
      return typeof e != "string" ? e : e.charAt(0) === "+" || e.charAt(0) === "-" ? A + parseFloat(e) : parseFloat(e);
    }, t.prototype._swapEndStartRepeatValues = function(A) {
      var e = this._valuesStartRepeat[A], i = this._valuesEnd[A];
      typeof i == "string" ? this._valuesStartRepeat[A] = this._valuesStartRepeat[A] + parseFloat(i) : this._valuesStartRepeat[A] = this._valuesEnd[A], this._valuesEnd[A] = e;
    }, t;
  }()
);
gi.nextId;
var uA = Ye;
uA.getAll.bind(uA);
uA.removeAll.bind(uA);
uA.add.bind(uA);
uA.remove.bind(uA);
var Nn = uA.update.bind(uA);
class Ia extends ai {
  scene;
  renderer;
  camera;
  controls;
  ambLight;
  dirLight;
  container;
  _clock = new Bn();
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
  constructor(A, e = {}) {
    super();
    const i = typeof A == "string" ? document.querySelector(A) : A;
    if (i instanceof HTMLElement) {
      const { antialias: s = !1, stencil: r = !0, logarithmicDepthBuffer: c = !0 } = e;
      this.container = i, this.renderer = this._createRenderer(s, r, c), this.scene = this._createScene(), this.camera = this._createCamera(), this.controls = this._createControls(), this.ambLight = this._createAmbLight(), this.scene.add(this.ambLight), this.dirLight = this._createDirLight(), this.scene.add(this.dirLight), this.scene.add(this.dirLight.target), this.container.appendChild(this.renderer.domElement), window.addEventListener("resize", this.resize.bind(this)), this.resize(), this.renderer.setAnimationLoop(this.animate.bind(this));
    } else
      throw new Error(`${A} not found!`);
  }
  _createScene() {
    const A = new hn(), e = 14414079;
    return A.background = new ZA(e), A.fog = new Oe(e, 0), A;
  }
  _createRenderer(A, e, i) {
    const s = new Cn({
      antialias: A,
      logarithmicDepthBuffer: i,
      stencil: e,
      alpha: !0,
      precision: "highp"
    });
    return s.setPixelRatio(window.devicePixelRatio), s;
  }
  _createCamera() {
    const A = new En(70, 1, 0.1, 5e4);
    return A.position.set(0, 3e4, 0), A;
  }
  _createControls() {
    const r = new Un(this.camera, this.container);
    return r.target.set(0, 0, -3e3), r.screenSpacePanning = !1, r.minDistance = 0.1, r.maxDistance = 3e4, r.maxPolarAngle = 1.2, r.enableDamping = !0, r.dampingFactor = 0.05, r.keyPanSpeed = 5, this.container.tabIndex = 0, r.listenToKeyEvents(this.container), r.addEventListener("change", () => {
      const c = Math.max(r.getPolarAngle(), 0.1), a = Math.max(r.getDistance(), 0.1);
      r.zoomSpeed = Math.max(Math.log(a), 0) + 0.5, this.camera.far = ze.clamp(a / c * 8, 100, 5e4), this.camera.near = this.camera.far / 1e3, this.camera.updateProjectionMatrix(), this.scene.fog instanceof Oe && (this.scene.fog.density = c / (a + 5) * this.fogFactor * 0.25);
      const w = a > 8e3;
      r.minAzimuthAngle = w ? 0 : -1 / 0, r.maxAzimuthAngle = w ? 0 : 1 / 0, r.maxPolarAngle = Math.min(Math.pow(1e4 / a, 4), 1.2);
    }), r;
  }
  _createAmbLight() {
    return new Qn(16777215, 1);
  }
  _createDirLight() {
    const A = new un(16777215, 1);
    return A.position.set(0, 2e3, 1e3), A.target.position.copy(this.controls.target), A;
  }
  resize() {
    const A = this.width, e = this.height;
    return this.renderer.setPixelRatio(window.devicePixelRatio), this.renderer.setSize(A, e), this.camera.aspect = A / e, this.camera.updateProjectionMatrix(), this;
  }
  animate() {
    this.controls.update(), this.renderer.render(this.scene, this.camera), Nn(), this.dispatchEvent({ type: "update", delta: this._clock.getDelta() });
  }
  /**
   * Fly to a position
   * @param centerPostion Map center target position
   * @param cameraPostion Camera target position
   * @param animate animate or not
   */
  flyTo(A, e, i = !0, s) {
    if (this.controls.target.copy(A), i) {
      const r = this.camera.position;
      new Dt(r).to({ y: 1e4, z: 0 }, 500).chain(
        new Dt(r).to(e, 2e3).easing(_A.Quintic.Out).onComplete((c) => s && s(c))
      ).start();
    } else
      this.camera.position.copy(e);
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
class _n extends oi {
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
  drawTile(A, e) {
    A.fillStyle = "white", A.shadowColor = "black", A.shadowBlur = 5, A.shadowOffsetX = 1, A.shadowOffsetY = 1, A.font = "bold 14px arial", A.textAlign = "center", A.translate(A.canvas.width / 2, A.canvas.height / 2), A.rotate(30 * Math.PI / 180), A.fillText(`${e.source.attribution}`, 0, 0);
  }
}
ee(new _n());
class On {
  info = {
    version: "0.10.0",
    description: "Tile normal material loader."
  };
  dataType = "normal";
  async load(A) {
    return new dn({
      // transparent: true,
      opacity: A.source.opacity,
      flatShading: !0
    });
  }
}
ee(new On());
class qn {
  info = {
    version: "0.10.0",
    description: "Single image loader. It can load single image to bounds and stick to the ground."
  };
  dataType = "single-image";
  // private _image?: HTMLImageElement | undefined;
  _imageLoader = new wn(si.manager);
  /**
   * 加载材质
   * @param source 数据源
   * @param tile 瓦片
   * @returns 材质
   */
  async load(A) {
    const { source: e, bounds: i, z: s } = A, r = new nn({
      transparent: !0,
      opacity: e.opacity
    }), c = e._getUrl(0, 0, 0);
    return s < e.minLevel || s > e.maxLevel || !c ? r : e.image?.complete ? (this._setTexture(r, e.image, e, i), r) : (console.log("loadi image...", c), e.image = await this._imageLoader.loadAsync(c), this._setTexture(r, e.image, e, i), r);
  }
  _setTexture(A, e, i, s) {
    const r = this._getTileTexture(e, i, s);
    A.setTexture(r), r.needsUpdate = !0;
  }
  _getTileTexture(A, e, i) {
    const s = e, r = 256, c = new OffscreenCanvas(r, r);
    if (A) {
      const w = c.getContext("2d"), o = s._projectionBounds, n = A.width, g = A.height, B = (o[2] - o[0]) / n, l = (o[3] - o[1]) / g, I = (i[0] - o[0]) / B, d = (o[3] - i[3]) / l, f = (i[2] - i[0]) / B, h = (i[3] - i[1]) / l;
      w.drawImage(A, I, d, f, h, 0, 0, r, r);
    }
    const a = new yn(c);
    return a.colorSpace = pn, a;
  }
}
class ca extends tA {
  dataType = "image";
  image;
}
ee(new qn());
function $(t) {
  return (A, ...e) => Yn(t, A, e);
}
function qA(t, A) {
  return $(
    li(
      t,
      A
    ).get
  );
}
const {
  apply: Yn,
  getOwnPropertyDescriptor: li,
  getPrototypeOf: Ze,
  ownKeys: Jn
} = Reflect, {
  iterator: te,
  toStringTag: Kn
} = Symbol, Hn = Object, {
  create: We,
  defineProperty: Pn
} = Hn, Vn = Array, jn = Vn.prototype, Ii = jn[te], Xn = $(Ii), ci = ArrayBuffer, zn = ci.prototype;
qA(zn, "byteLength");
const mt = typeof SharedArrayBuffer < "u" ? SharedArrayBuffer : null;
mt && qA(mt.prototype, "byteLength");
const fi = Ze(Uint8Array);
fi.from;
const rA = fi.prototype;
rA[te];
$(rA.keys);
$(
  rA.values
);
$(
  rA.entries
);
$(rA.set);
$(
  rA.reverse
);
$(rA.fill);
$(
  rA.copyWithin
);
$(rA.sort);
$(rA.slice);
$(
  rA.subarray
);
qA(
  rA,
  "buffer"
);
qA(
  rA,
  "byteOffset"
);
qA(
  rA,
  "length"
);
qA(
  rA,
  Kn
);
const Zn = Uint8Array, Bi = Uint16Array, $e = Uint32Array, Wn = Float32Array, WA = Ze([][te]()), hi = $(WA.next), $n = $(function* () {
}().next), Ar = Ze(WA), er = DataView.prototype, tr = $(
  er.getUint16
), At = WeakMap, Ci = At.prototype, Ei = $(Ci.get), ir = $(Ci.set), Qi = new At(), nr = We(null, {
  next: {
    value: function() {
      const A = Ei(Qi, this);
      return hi(A);
    }
  },
  [te]: {
    value: function() {
      return this;
    }
  }
});
function rr(t) {
  if (t[te] === Ii && WA.next === hi)
    return t;
  const A = We(nr);
  return ir(Qi, A, Xn(t)), A;
}
const or = new At(), sr = We(Ar, {
  next: {
    value: function() {
      const A = Ei(or, this);
      return $n(A);
    },
    writable: !0,
    configurable: !0
  }
});
for (const t of Jn(WA))
  t !== "next" && Pn(sr, t, li(WA, t));
const ui = new ci(4), ar = new Wn(ui), gr = new $e(ui), hA = new Bi(512), CA = new Zn(512);
for (let t = 0; t < 256; ++t) {
  const A = t - 127;
  A < -24 ? (hA[t] = 0, hA[t | 256] = 32768, CA[t] = 24, CA[t | 256] = 24) : A < -14 ? (hA[t] = 1024 >> -A - 14, hA[t | 256] = 1024 >> -A - 14 | 32768, CA[t] = -A - 1, CA[t | 256] = -A - 1) : A <= 15 ? (hA[t] = A + 15 << 10, hA[t | 256] = A + 15 << 10 | 32768, CA[t] = 13, CA[t | 256] = 13) : A < 128 ? (hA[t] = 31744, hA[t | 256] = 64512, CA[t] = 24, CA[t | 256] = 24) : (hA[t] = 31744, hA[t | 256] = 64512, CA[t] = 13, CA[t | 256] = 13);
}
const et = new $e(2048);
for (let t = 1; t < 1024; ++t) {
  let A = t << 13, e = 0;
  for (; !(A & 8388608); )
    A <<= 1, e -= 8388608;
  A &= -8388609, e += 947912704, et[t] = A | e;
}
for (let t = 1024; t < 2048; ++t)
  et[t] = 939524096 + (t - 1024 << 13);
const YA = new $e(64);
for (let t = 1; t < 31; ++t)
  YA[t] = t << 23;
YA[31] = 1199570944;
YA[32] = 2147483648;
for (let t = 33; t < 63; ++t)
  YA[t] = 2147483648 + (t - 32 << 23);
YA[63] = 3347054592;
const di = new Bi(64);
for (let t = 1; t < 64; ++t)
  t !== 32 && (di[t] = 1024);
function lr(t) {
  const A = t >> 10;
  return gr[0] = et[di[A] + (t & 1023)] + YA[A], ar[0];
}
function wi(t, A, ...e) {
  return lr(
    tr(t, A, ...rr(e))
  );
}
function tt(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var it = { exports: {} };
function yi(t, A, e) {
  const i = e && e.debug || !1;
  i && console.log("[xml-utils] getting " + A + " in " + t);
  const s = typeof t == "object" ? t.outer : t, r = s.slice(0, s.indexOf(">") + 1), c = ['"', "'"];
  for (let a = 0; a < c.length; a++) {
    const w = c[a], o = A + "\\=" + w + "([^" + w + "]*)" + w;
    i && console.log("[xml-utils] pattern:", o);
    const g = new RegExp(o).exec(r);
    if (i && console.log("[xml-utils] match:", g), g) return g[1];
  }
}
it.exports = yi;
it.exports.default = yi;
var Ir = it.exports;
const me = /* @__PURE__ */ tt(Ir);
var nt = { exports: {} }, rt = { exports: {} }, ot = { exports: {} };
function pi(t, A, e) {
  const s = new RegExp(A).exec(t.slice(e));
  return s ? e + s.index : -1;
}
ot.exports = pi;
ot.exports.default = pi;
var cr = ot.exports, st = { exports: {} };
function Di(t, A, e) {
  const s = new RegExp(A).exec(t.slice(e));
  return s ? e + s.index + s[0].length - 1 : -1;
}
st.exports = Di;
st.exports.default = Di;
var fr = st.exports, at = { exports: {} };
function mi(t, A) {
  const e = new RegExp(A, "g"), i = t.match(e);
  return i ? i.length : 0;
}
at.exports = mi;
at.exports.default = mi;
var Br = at.exports;
const hr = cr, xe = fr, xt = Br;
function xi(t, A, e) {
  const i = e && e.debug || !1, s = !(e && typeof e.nested === !1), r = e && e.startIndex || 0;
  i && console.log("[xml-utils] starting findTagByName with", A, " and ", e);
  const c = hr(t, `<${A}[ 
>/]`, r);
  if (i && console.log("[xml-utils] start:", c), c === -1) return;
  const a = t.slice(c + A.length);
  let w = xe(a, "^[^<]*[ /]>", 0);
  const o = w !== -1 && a[w - 1] === "/";
  if (i && console.log("[xml-utils] selfClosing:", o), o === !1)
    if (s) {
      let l = 0, I = 1, d = 0;
      for (; (w = xe(a, "[ /]" + A + ">", l)) !== -1; ) {
        const f = a.substring(l, w + 1);
        if (I += xt(f, "<" + A + `[ 
	>]`), d += xt(f, "</" + A + ">"), d >= I) break;
        l = w;
      }
    } else
      w = xe(a, "[ /]" + A + ">", 0);
  const n = c + A.length + w + 1;
  if (i && console.log("[xml-utils] end:", n), n === -1) return;
  const g = t.slice(c, n);
  let B;
  return o ? B = null : B = g.slice(g.indexOf(">") + 1, g.lastIndexOf("<")), { inner: B, outer: g, start: c, end: n };
}
rt.exports = xi;
rt.exports.default = xi;
var Cr = rt.exports;
const Er = Cr;
function ki(t, A, e) {
  const i = [], s = e && e.debug || !1, r = e && typeof e.nested == "boolean" ? e.nested : !0;
  let c = e && e.startIndex || 0, a;
  for (; a = Er(t, A, { debug: s, startIndex: c }); )
    r ? c = a.start + 1 + A.length : c = a.end, i.push(a);
  return s && console.log("findTagsByName found", i.length, "tags"), i;
}
nt.exports = ki;
nt.exports.default = ki;
var Qr = nt.exports;
const ur = /* @__PURE__ */ tt(Qr), jA = {
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
}, QA = {};
for (const t in jA)
  jA.hasOwnProperty(t) && (QA[jA[t]] = parseInt(t, 10));
const dr = [
  QA.BitsPerSample,
  QA.ExtraSamples,
  QA.SampleFormat,
  QA.StripByteCounts,
  QA.StripOffsets,
  QA.StripRowCounts,
  QA.TileByteCounts,
  QA.TileOffsets,
  QA.SubIFDs
], ke = {
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
}, J = {};
for (const t in ke)
  ke.hasOwnProperty(t) && (J[ke[t]] = parseInt(t, 10));
const gA = {
  WhiteIsZero: 0,
  BlackIsZero: 1,
  RGB: 2,
  Palette: 3,
  CMYK: 5,
  YCbCr: 6,
  CIELab: 8
}, wr = {
  Unspecified: 0
}, yr = {
  AddCompression: 1
}, Se = {
  None: 0,
  Deflate: 1,
  Zstandard: 2
}, pr = {
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
function Dr(t, A) {
  const { width: e, height: i } = t, s = new Uint8Array(e * i * 3);
  let r;
  for (let c = 0, a = 0; c < t.length; ++c, a += 3)
    r = 256 - t[c] / A * 256, s[a] = r, s[a + 1] = r, s[a + 2] = r;
  return s;
}
function mr(t, A) {
  const { width: e, height: i } = t, s = new Uint8Array(e * i * 3);
  let r;
  for (let c = 0, a = 0; c < t.length; ++c, a += 3)
    r = t[c] / A * 256, s[a] = r, s[a + 1] = r, s[a + 2] = r;
  return s;
}
function xr(t, A) {
  const { width: e, height: i } = t, s = new Uint8Array(e * i * 3), r = A.length / 3, c = A.length / 3 * 2;
  for (let a = 0, w = 0; a < t.length; ++a, w += 3) {
    const o = t[a];
    s[w] = A[o] / 65536 * 256, s[w + 1] = A[o + r] / 65536 * 256, s[w + 2] = A[o + c] / 65536 * 256;
  }
  return s;
}
function kr(t) {
  const { width: A, height: e } = t, i = new Uint8Array(A * e * 3);
  for (let s = 0, r = 0; s < t.length; s += 4, r += 3) {
    const c = t[s], a = t[s + 1], w = t[s + 2], o = t[s + 3];
    i[r] = 255 * ((255 - c) / 256) * ((255 - o) / 256), i[r + 1] = 255 * ((255 - a) / 256) * ((255 - o) / 256), i[r + 2] = 255 * ((255 - w) / 256) * ((255 - o) / 256);
  }
  return i;
}
function Sr(t) {
  const { width: A, height: e } = t, i = new Uint8ClampedArray(A * e * 3);
  for (let s = 0, r = 0; s < t.length; s += 3, r += 3) {
    const c = t[s], a = t[s + 1], w = t[s + 2];
    i[r] = c + 1.402 * (w - 128), i[r + 1] = c - 0.34414 * (a - 128) - 0.71414 * (w - 128), i[r + 2] = c + 1.772 * (a - 128);
  }
  return i;
}
const br = 0.95047, Fr = 1, Mr = 1.08883;
function Gr(t) {
  const { width: A, height: e } = t, i = new Uint8Array(A * e * 3);
  for (let s = 0, r = 0; s < t.length; s += 3, r += 3) {
    const c = t[s + 0], a = t[s + 1] << 24 >> 24, w = t[s + 2] << 24 >> 24;
    let o = (c + 16) / 116, n = a / 500 + o, g = o - w / 200, B, l, I;
    n = br * (n * n * n > 8856e-6 ? n * n * n : (n - 16 / 116) / 7.787), o = Fr * (o * o * o > 8856e-6 ? o * o * o : (o - 16 / 116) / 7.787), g = Mr * (g * g * g > 8856e-6 ? g * g * g : (g - 16 / 116) / 7.787), B = n * 3.2406 + o * -1.5372 + g * -0.4986, l = n * -0.9689 + o * 1.8758 + g * 0.0415, I = n * 0.0557 + o * -0.204 + g * 1.057, B = B > 31308e-7 ? 1.055 * B ** (1 / 2.4) - 0.055 : 12.92 * B, l = l > 31308e-7 ? 1.055 * l ** (1 / 2.4) - 0.055 : 12.92 * l, I = I > 31308e-7 ? 1.055 * I ** (1 / 2.4) - 0.055 : 12.92 * I, i[r] = Math.max(0, Math.min(1, B)) * 255, i[r + 1] = Math.max(0, Math.min(1, l)) * 255, i[r + 2] = Math.max(0, Math.min(1, I)) * 255;
  }
  return i;
}
const Si = /* @__PURE__ */ new Map();
function bA(t, A) {
  Array.isArray(t) || (t = [t]), t.forEach((e) => Si.set(e, A));
}
async function vr(t) {
  const A = Si.get(t.Compression);
  if (!A)
    throw new Error(`Unknown compression method identifier: ${t.Compression}`);
  const e = await A();
  return new e(t);
}
bA([void 0, 1], () => Promise.resolve().then(() => po).then((t) => t.default));
bA(5, () => Promise.resolve().then(() => So).then((t) => t.default));
bA(6, () => {
  throw new Error("old style JPEG compression is not supported.");
});
bA(7, () => Promise.resolve().then(() => vo).then((t) => t.default));
bA([8, 32946], () => Promise.resolve().then(() => js).then((t) => t.default));
bA(32773, () => Promise.resolve().then(() => zs).then((t) => t.default));
bA(
  34887,
  () => Promise.resolve().then(() => ea).then(async (t) => (await t.zstd.init(), t)).then((t) => t.default)
);
bA(50001, () => Promise.resolve().then(() => ia).then((t) => t.default));
function ue(t, A, e, i = 1) {
  return new (Object.getPrototypeOf(t)).constructor(A * e * i);
}
function Lr(t, A, e, i, s) {
  const r = A / i, c = e / s;
  return t.map((a) => {
    const w = ue(a, i, s);
    for (let o = 0; o < s; ++o) {
      const n = Math.min(Math.round(c * o), e - 1);
      for (let g = 0; g < i; ++g) {
        const B = Math.min(Math.round(r * g), A - 1), l = a[n * A + B];
        w[o * i + g] = l;
      }
    }
    return w;
  });
}
function OA(t, A, e) {
  return (1 - e) * t + e * A;
}
function Rr(t, A, e, i, s) {
  const r = A / i, c = e / s;
  return t.map((a) => {
    const w = ue(a, i, s);
    for (let o = 0; o < s; ++o) {
      const n = c * o, g = Math.floor(n), B = Math.min(Math.ceil(n), e - 1);
      for (let l = 0; l < i; ++l) {
        const I = r * l, d = I % 1, f = Math.floor(I), h = Math.min(Math.ceil(I), A - 1), u = a[g * A + f], p = a[g * A + h], E = a[B * A + f], D = a[B * A + h], C = OA(
          OA(u, p, d),
          OA(E, D, d),
          n % 1
        );
        w[o * i + l] = C;
      }
    }
    return w;
  });
}
function Ur(t, A, e, i, s, r = "nearest") {
  switch (r.toLowerCase()) {
    case "nearest":
      return Lr(t, A, e, i, s);
    case "bilinear":
    case "linear":
      return Rr(t, A, e, i, s);
    default:
      throw new Error(`Unsupported resampling method: '${r}'`);
  }
}
function Tr(t, A, e, i, s, r) {
  const c = A / i, a = e / s, w = ue(t, i, s, r);
  for (let o = 0; o < s; ++o) {
    const n = Math.min(Math.round(a * o), e - 1);
    for (let g = 0; g < i; ++g) {
      const B = Math.min(Math.round(c * g), A - 1);
      for (let l = 0; l < r; ++l) {
        const I = t[n * A * r + B * r + l];
        w[o * i * r + g * r + l] = I;
      }
    }
  }
  return w;
}
function Nr(t, A, e, i, s, r) {
  const c = A / i, a = e / s, w = ue(t, i, s, r);
  for (let o = 0; o < s; ++o) {
    const n = a * o, g = Math.floor(n), B = Math.min(Math.ceil(n), e - 1);
    for (let l = 0; l < i; ++l) {
      const I = c * l, d = I % 1, f = Math.floor(I), h = Math.min(Math.ceil(I), A - 1);
      for (let u = 0; u < r; ++u) {
        const p = t[g * A * r + f * r + u], E = t[g * A * r + h * r + u], D = t[B * A * r + f * r + u], C = t[B * A * r + h * r + u], Q = OA(
          OA(p, E, d),
          OA(D, C, d),
          n % 1
        );
        w[o * i * r + l * r + u] = Q;
      }
    }
  }
  return w;
}
function _r(t, A, e, i, s, r, c = "nearest") {
  switch (c.toLowerCase()) {
    case "nearest":
      return Tr(
        t,
        A,
        e,
        i,
        s,
        r
      );
    case "bilinear":
    case "linear":
      return Nr(
        t,
        A,
        e,
        i,
        s,
        r
      );
    default:
      throw new Error(`Unsupported resampling method: '${c}'`);
  }
}
function Or(t, A, e) {
  let i = 0;
  for (let s = A; s < e; ++s)
    i += t[s];
  return i;
}
function Je(t, A, e) {
  switch (t) {
    case 1:
      if (A <= 8)
        return new Uint8Array(e);
      if (A <= 16)
        return new Uint16Array(e);
      if (A <= 32)
        return new Uint32Array(e);
      break;
    case 2:
      if (A === 8)
        return new Int8Array(e);
      if (A === 16)
        return new Int16Array(e);
      if (A === 32)
        return new Int32Array(e);
      break;
    case 3:
      switch (A) {
        case 16:
        case 32:
          return new Float32Array(e);
        case 64:
          return new Float64Array(e);
      }
      break;
  }
  throw Error("Unsupported data format/bitsPerSample");
}
function qr(t, A) {
  return (t === 1 || t === 2) && A <= 32 && A % 8 === 0 ? !1 : !(t === 3 && (A === 16 || A === 32 || A === 64));
}
function Yr(t, A, e, i, s, r, c) {
  const a = new DataView(t), w = e === 2 ? c * r : c * r * i, o = e === 2 ? 1 : i, n = Je(A, s, w), g = parseInt("1".repeat(s), 2);
  if (A === 1) {
    let B;
    e === 1 ? B = i * s : B = s;
    let l = r * B;
    l & 7 && (l = l + 7 & -8);
    for (let I = 0; I < c; ++I) {
      const d = I * l;
      for (let f = 0; f < r; ++f) {
        const h = d + f * o * s;
        for (let u = 0; u < o; ++u) {
          const p = h + u * s, E = (I * r + f) * o + u, D = Math.floor(p / 8), C = p % 8;
          if (C + s <= 8)
            n[E] = a.getUint8(D) >> 8 - s - C & g;
          else if (C + s <= 16)
            n[E] = a.getUint16(D) >> 16 - s - C & g;
          else if (C + s <= 24) {
            const Q = a.getUint16(D) << 8 | a.getUint8(D + 2);
            n[E] = Q >> 24 - s - C & g;
          } else
            n[E] = a.getUint32(D) >> 32 - s - C & g;
        }
      }
    }
  }
  return n.buffer;
}
class Jr {
  /**
   * @constructor
   * @param {Object} fileDirectory The parsed file directory
   * @param {Object} geoKeys The parsed geo-keys
   * @param {DataView} dataView The DataView for the underlying file.
   * @param {Boolean} littleEndian Whether the file is encoded in little or big endian
   * @param {Boolean} cache Whether or not decoded tiles shall be cached
   * @param {import('./source/basesource').BaseSource} source The datasource to read from
   */
  constructor(A, e, i, s, r, c) {
    this.fileDirectory = A, this.geoKeys = e, this.dataView = i, this.littleEndian = s, this.tiles = r ? {} : null, this.isTiled = !A.StripOffsets;
    const a = A.PlanarConfiguration;
    if (this.planarConfiguration = typeof a > "u" ? 1 : a, this.planarConfiguration !== 1 && this.planarConfiguration !== 2)
      throw new Error("Invalid planar configuration.");
    this.source = c;
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
  getBlockHeight(A) {
    return this.isTiled || (A + 1) * this.getTileHeight() <= this.getHeight() ? this.getTileHeight() : this.getHeight() - A * this.getTileHeight();
  }
  /**
   * Calculates the number of bytes for each pixel across all samples. Only full
   * bytes are supported, an exception is thrown when this is not the case.
   * @returns {Number} the bytes per pixel
   */
  getBytesPerPixel() {
    let A = 0;
    for (let e = 0; e < this.fileDirectory.BitsPerSample.length; ++e)
      A += this.getSampleByteSize(e);
    return A;
  }
  getSampleByteSize(A) {
    if (A >= this.fileDirectory.BitsPerSample.length)
      throw new RangeError(`Sample index ${A} is out of range.`);
    return Math.ceil(this.fileDirectory.BitsPerSample[A] / 8);
  }
  getReaderForSample(A) {
    const e = this.fileDirectory.SampleFormat ? this.fileDirectory.SampleFormat[A] : 1, i = this.fileDirectory.BitsPerSample[A];
    switch (e) {
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
            return function(s, r) {
              return wi(this, s, r);
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
  getSampleFormat(A = 0) {
    return this.fileDirectory.SampleFormat ? this.fileDirectory.SampleFormat[A] : 1;
  }
  getBitsPerSample(A = 0) {
    return this.fileDirectory.BitsPerSample[A];
  }
  getArrayForSample(A, e) {
    const i = this.getSampleFormat(A), s = this.getBitsPerSample(A);
    return Je(i, s, e);
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
  async getTileOrStrip(A, e, i, s, r) {
    const c = Math.ceil(this.getWidth() / this.getTileWidth()), a = Math.ceil(this.getHeight() / this.getTileHeight());
    let w;
    const { tiles: o } = this;
    this.planarConfiguration === 1 ? w = e * c + A : this.planarConfiguration === 2 && (w = i * c * a + e * c + A);
    let n, g;
    this.isTiled ? (n = this.fileDirectory.TileOffsets[w], g = this.fileDirectory.TileByteCounts[w]) : (n = this.fileDirectory.StripOffsets[w], g = this.fileDirectory.StripByteCounts[w]);
    const B = (await this.source.fetch([{ offset: n, length: g }], r))[0];
    let l;
    return o === null || !o[w] ? (l = (async () => {
      let I = await s.decode(this.fileDirectory, B);
      const d = this.getSampleFormat(), f = this.getBitsPerSample();
      return qr(d, f) && (I = Yr(
        I,
        d,
        this.planarConfiguration,
        this.getSamplesPerPixel(),
        f,
        this.getTileWidth(),
        this.getBlockHeight(e)
      )), I;
    })(), o !== null && (o[w] = l)) : l = o[w], { x: A, y: e, sample: i, data: await l };
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
  async _readRaster(A, e, i, s, r, c, a, w, o) {
    const n = this.getTileWidth(), g = this.getTileHeight(), B = this.getWidth(), l = this.getHeight(), I = Math.max(Math.floor(A[0] / n), 0), d = Math.min(
      Math.ceil(A[2] / n),
      Math.ceil(B / n)
    ), f = Math.max(Math.floor(A[1] / g), 0), h = Math.min(
      Math.ceil(A[3] / g),
      Math.ceil(l / g)
    ), u = A[2] - A[0];
    let p = this.getBytesPerPixel();
    const E = [], D = [];
    for (let y = 0; y < e.length; ++y)
      this.planarConfiguration === 1 ? E.push(Or(this.fileDirectory.BitsPerSample, 0, e[y]) / 8) : E.push(0), D.push(this.getReaderForSample(e[y]));
    const C = [], { littleEndian: Q } = this;
    for (let y = f; y < h; ++y)
      for (let S = I; S < d; ++S) {
        let b;
        this.planarConfiguration === 1 && (b = this.getTileOrStrip(S, y, 0, r, o));
        for (let x = 0; x < e.length; ++x) {
          const G = x, M = e[x];
          this.planarConfiguration === 2 && (p = this.getSampleByteSize(M), b = this.getTileOrStrip(S, y, M, r, o));
          const Y = b.then((F) => {
            const k = F.data, U = new DataView(k), L = this.getBlockHeight(F.y), R = F.y * g, _ = F.x * n, N = R + L, H = (F.x + 1) * n, j = D[G], T = Math.min(L, L - (N - A[3]), l - R), q = Math.min(n, n - (H - A[2]), B - _);
            for (let O = Math.max(0, A[1] - R); O < T; ++O)
              for (let K = Math.max(0, A[0] - _); K < q; ++K) {
                const V = (O * n + K) * p, z = j.call(
                  U,
                  V + E[G],
                  Q
                );
                let W;
                s ? (W = (O + R - A[1]) * u * e.length + (K + _ - A[0]) * e.length + G, i[W] = z) : (W = (O + R - A[1]) * u + K + _ - A[0], i[G][W] = z);
              }
          });
          C.push(Y);
        }
      }
    if (await Promise.all(C), c && A[2] - A[0] !== c || a && A[3] - A[1] !== a) {
      let y;
      return s ? y = _r(
        i,
        A[2] - A[0],
        A[3] - A[1],
        c,
        a,
        e.length,
        w
      ) : y = Ur(
        i,
        A[2] - A[0],
        A[3] - A[1],
        c,
        a,
        w
      ), y.width = c, y.height = a, y;
    }
    return i.width = c || A[2] - A[0], i.height = a || A[3] - A[1], i;
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
    window: A,
    samples: e = [],
    interleave: i,
    pool: s = null,
    width: r,
    height: c,
    resampleMethod: a,
    fillValue: w,
    signal: o
  } = {}) {
    const n = A || [0, 0, this.getWidth(), this.getHeight()];
    if (n[0] > n[2] || n[1] > n[3])
      throw new Error("Invalid subsets");
    const g = n[2] - n[0], B = n[3] - n[1], l = g * B, I = this.getSamplesPerPixel();
    if (!e || !e.length)
      for (let u = 0; u < I; ++u)
        e.push(u);
    else
      for (let u = 0; u < e.length; ++u)
        if (e[u] >= I)
          return Promise.reject(new RangeError(`Invalid sample index '${e[u]}'.`));
    let d;
    if (i) {
      const u = this.fileDirectory.SampleFormat ? Math.max.apply(null, this.fileDirectory.SampleFormat) : 1, p = Math.max.apply(null, this.fileDirectory.BitsPerSample);
      d = Je(u, p, l * e.length), w && d.fill(w);
    } else {
      d = [];
      for (let u = 0; u < e.length; ++u) {
        const p = this.getArrayForSample(e[u], l);
        Array.isArray(w) && u < w.length ? p.fill(w[u]) : w && !Array.isArray(w) && p.fill(w), d.push(p);
      }
    }
    const f = s || await vr(this.fileDirectory);
    return await this._readRaster(
      n,
      e,
      d,
      i,
      f,
      r,
      c,
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
    window: A,
    interleave: e = !0,
    pool: i = null,
    width: s,
    height: r,
    resampleMethod: c,
    enableAlpha: a = !1,
    signal: w
  } = {}) {
    const o = A || [0, 0, this.getWidth(), this.getHeight()];
    if (o[0] > o[2] || o[1] > o[3])
      throw new Error("Invalid subsets");
    const n = this.fileDirectory.PhotometricInterpretation;
    if (n === gA.RGB) {
      let h = [0, 1, 2];
      if (this.fileDirectory.ExtraSamples !== wr.Unspecified && a) {
        h = [];
        for (let u = 0; u < this.fileDirectory.BitsPerSample.length; u += 1)
          h.push(u);
      }
      return this.readRasters({
        window: A,
        interleave: e,
        samples: h,
        pool: i,
        width: s,
        height: r,
        resampleMethod: c,
        signal: w
      });
    }
    let g;
    switch (n) {
      case gA.WhiteIsZero:
      case gA.BlackIsZero:
      case gA.Palette:
        g = [0];
        break;
      case gA.CMYK:
        g = [0, 1, 2, 3];
        break;
      case gA.YCbCr:
      case gA.CIELab:
        g = [0, 1, 2];
        break;
      default:
        throw new Error("Invalid or unsupported photometric interpretation.");
    }
    const B = {
      window: o,
      interleave: !0,
      samples: g,
      pool: i,
      width: s,
      height: r,
      resampleMethod: c,
      signal: w
    }, { fileDirectory: l } = this, I = await this.readRasters(B), d = 2 ** this.fileDirectory.BitsPerSample[0];
    let f;
    switch (n) {
      case gA.WhiteIsZero:
        f = Dr(I, d);
        break;
      case gA.BlackIsZero:
        f = mr(I, d);
        break;
      case gA.Palette:
        f = xr(I, l.ColorMap);
        break;
      case gA.CMYK:
        f = kr(I);
        break;
      case gA.YCbCr:
        f = Sr(I);
        break;
      case gA.CIELab:
        f = Gr(I);
        break;
      default:
        throw new Error("Unsupported photometric interpretation.");
    }
    if (!e) {
      const h = new Uint8Array(f.length / 3), u = new Uint8Array(f.length / 3), p = new Uint8Array(f.length / 3);
      for (let E = 0, D = 0; E < f.length; E += 3, ++D)
        h[D] = f[E], u[D] = f[E + 1], p[D] = f[E + 2];
      f = [h, u, p];
    }
    return f.width = I.width, f.height = I.height, f;
  }
  /**
   * Returns an array of tiepoints.
   * @returns {Object[]}
   */
  getTiePoints() {
    if (!this.fileDirectory.ModelTiepoint)
      return [];
    const A = [];
    for (let e = 0; e < this.fileDirectory.ModelTiepoint.length; e += 6)
      A.push({
        i: this.fileDirectory.ModelTiepoint[e],
        j: this.fileDirectory.ModelTiepoint[e + 1],
        k: this.fileDirectory.ModelTiepoint[e + 2],
        x: this.fileDirectory.ModelTiepoint[e + 3],
        y: this.fileDirectory.ModelTiepoint[e + 4],
        z: this.fileDirectory.ModelTiepoint[e + 5]
      });
    return A;
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
  getGDALMetadata(A = null) {
    const e = {};
    if (!this.fileDirectory.GDAL_METADATA)
      return null;
    const i = this.fileDirectory.GDAL_METADATA;
    let s = ur(i, "Item");
    A === null ? s = s.filter((r) => me(r, "sample") === void 0) : s = s.filter((r) => Number(me(r, "sample")) === A);
    for (let r = 0; r < s.length; ++r) {
      const c = s[r];
      e[me(c, "name")] = c.inner;
    }
    return e;
  }
  /**
   * Returns the GDAL nodata value
   * @returns {number|null}
   */
  getGDALNoData() {
    if (!this.fileDirectory.GDAL_NODATA)
      return null;
    const A = this.fileDirectory.GDAL_NODATA;
    return Number(A.substring(0, A.length - 1));
  }
  /**
   * Returns the image origin as a XYZ-vector. When the image has no affine
   * transformation, then an exception is thrown.
   * @returns {Array<number>} The origin as a vector
   */
  getOrigin() {
    const A = this.fileDirectory.ModelTiepoint, e = this.fileDirectory.ModelTransformation;
    if (A && A.length === 6)
      return [
        A[3],
        A[4],
        A[5]
      ];
    if (e)
      return [
        e[3],
        e[7],
        e[11]
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
  getResolution(A = null) {
    const e = this.fileDirectory.ModelPixelScale, i = this.fileDirectory.ModelTransformation;
    if (e)
      return [
        e[0],
        -e[1],
        e[2]
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
    if (A) {
      const [s, r, c] = A.getResolution();
      return [
        s * A.getWidth() / this.getWidth(),
        r * A.getHeight() / this.getHeight(),
        c * A.getWidth() / this.getWidth()
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
  getBoundingBox(A = !1) {
    const e = this.getHeight(), i = this.getWidth();
    if (this.fileDirectory.ModelTransformation && !A) {
      const [s, r, c, a, w, o, n, g] = this.fileDirectory.ModelTransformation, l = [
        [0, 0],
        [0, e],
        [i, 0],
        [i, e]
      ].map(([f, h]) => [
        a + s * f + r * h,
        g + w * f + o * h
      ]), I = l.map((f) => f[0]), d = l.map((f) => f[1]);
      return [
        Math.min(...I),
        Math.min(...d),
        Math.max(...I),
        Math.max(...d)
      ];
    } else {
      const s = this.getOrigin(), r = this.getResolution(), c = s[0], a = s[1], w = c + r[0] * i, o = a + r[1] * e;
      return [
        Math.min(c, w),
        Math.min(a, o),
        Math.max(c, w),
        Math.max(a, o)
      ];
    }
  }
}
class Kr {
  constructor(A) {
    this._dataView = new DataView(A);
  }
  get buffer() {
    return this._dataView.buffer;
  }
  getUint64(A, e) {
    const i = this.getUint32(A, e), s = this.getUint32(A + 4, e);
    let r;
    if (e) {
      if (r = i + 2 ** 32 * s, !Number.isSafeInteger(r))
        throw new Error(
          `${r} exceeds MAX_SAFE_INTEGER. Precision may be lost. Please report if you get this message to https://github.com/geotiffjs/geotiff.js/issues`
        );
      return r;
    }
    if (r = 2 ** 32 * i + s, !Number.isSafeInteger(r))
      throw new Error(
        `${r} exceeds MAX_SAFE_INTEGER. Precision may be lost. Please report if you get this message to https://github.com/geotiffjs/geotiff.js/issues`
      );
    return r;
  }
  // adapted from https://stackoverflow.com/a/55338384/8060591
  getInt64(A, e) {
    let i = 0;
    const s = (this._dataView.getUint8(A + (e ? 7 : 0)) & 128) > 0;
    let r = !0;
    for (let c = 0; c < 8; c++) {
      let a = this._dataView.getUint8(A + (e ? c : 7 - c));
      s && (r ? a !== 0 && (a = ~(a - 1) & 255, r = !1) : a = ~a & 255), i += a * 256 ** c;
    }
    return s && (i = -i), i;
  }
  getUint8(A, e) {
    return this._dataView.getUint8(A, e);
  }
  getInt8(A, e) {
    return this._dataView.getInt8(A, e);
  }
  getUint16(A, e) {
    return this._dataView.getUint16(A, e);
  }
  getInt16(A, e) {
    return this._dataView.getInt16(A, e);
  }
  getUint32(A, e) {
    return this._dataView.getUint32(A, e);
  }
  getInt32(A, e) {
    return this._dataView.getInt32(A, e);
  }
  getFloat16(A, e) {
    return wi(this._dataView, A, e);
  }
  getFloat32(A, e) {
    return this._dataView.getFloat32(A, e);
  }
  getFloat64(A, e) {
    return this._dataView.getFloat64(A, e);
  }
}
class Hr {
  constructor(A, e, i, s) {
    this._dataView = new DataView(A), this._sliceOffset = e, this._littleEndian = i, this._bigTiff = s;
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
  covers(A, e) {
    return this.sliceOffset <= A && this.sliceTop >= A + e;
  }
  readUint8(A) {
    return this._dataView.getUint8(
      A - this._sliceOffset,
      this._littleEndian
    );
  }
  readInt8(A) {
    return this._dataView.getInt8(
      A - this._sliceOffset,
      this._littleEndian
    );
  }
  readUint16(A) {
    return this._dataView.getUint16(
      A - this._sliceOffset,
      this._littleEndian
    );
  }
  readInt16(A) {
    return this._dataView.getInt16(
      A - this._sliceOffset,
      this._littleEndian
    );
  }
  readUint32(A) {
    return this._dataView.getUint32(
      A - this._sliceOffset,
      this._littleEndian
    );
  }
  readInt32(A) {
    return this._dataView.getInt32(
      A - this._sliceOffset,
      this._littleEndian
    );
  }
  readFloat32(A) {
    return this._dataView.getFloat32(
      A - this._sliceOffset,
      this._littleEndian
    );
  }
  readFloat64(A) {
    return this._dataView.getFloat64(
      A - this._sliceOffset,
      this._littleEndian
    );
  }
  readUint64(A) {
    const e = this.readUint32(A), i = this.readUint32(A + 4);
    let s;
    if (this._littleEndian) {
      if (s = e + 2 ** 32 * i, !Number.isSafeInteger(s))
        throw new Error(
          `${s} exceeds MAX_SAFE_INTEGER. Precision may be lost. Please report if you get this message to https://github.com/geotiffjs/geotiff.js/issues`
        );
      return s;
    }
    if (s = 2 ** 32 * e + i, !Number.isSafeInteger(s))
      throw new Error(
        `${s} exceeds MAX_SAFE_INTEGER. Precision may be lost. Please report if you get this message to https://github.com/geotiffjs/geotiff.js/issues`
      );
    return s;
  }
  // adapted from https://stackoverflow.com/a/55338384/8060591
  readInt64(A) {
    let e = 0;
    const i = (this._dataView.getUint8(A + (this._littleEndian ? 7 : 0)) & 128) > 0;
    let s = !0;
    for (let r = 0; r < 8; r++) {
      let c = this._dataView.getUint8(
        A + (this._littleEndian ? r : 7 - r)
      );
      i && (s ? c !== 0 && (c = ~(c - 1) & 255, s = !1) : c = ~c & 255), e += c * 256 ** r;
    }
    return i && (e = -e), e;
  }
  readOffset(A) {
    return this._bigTiff ? this.readUint64(A) : this.readUint32(A);
  }
}
class Pr {
  /**
   *
   * @param {Slice[]} slices
   * @returns {ArrayBuffer[]}
   */
  async fetch(A, e = void 0) {
    return Promise.all(
      A.map((i) => this.fetchSlice(i, e))
    );
  }
  /**
   *
   * @param {Slice} slice
   * @returns {ArrayBuffer}
   */
  async fetchSlice(A) {
    throw new Error(`fetching of slice ${A} not possible, not implemented`);
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
class gt extends Error {
  constructor(A) {
    super(A), Error.captureStackTrace && Error.captureStackTrace(this, gt), this.name = "AbortError";
  }
}
class Vr extends Pr {
  constructor(A) {
    super(), this.arrayBuffer = A;
  }
  fetchSlice(A, e) {
    if (e && e.aborted)
      throw new gt("Request aborted");
    return this.arrayBuffer.slice(A.offset, A.offset + A.length);
  }
}
function jr(t) {
  return new Vr(t);
}
function Xr(t, A) {
  let e = t.length - A, i = 0;
  do {
    for (let s = A; s > 0; s--)
      t[i + A] += t[i], i++;
    e -= A;
  } while (e > 0);
}
function zr(t, A, e) {
  let i = 0, s = t.length;
  const r = s / e;
  for (; s > A; ) {
    for (let a = A; a > 0; --a)
      t[i + A] += t[i], ++i;
    s -= A;
  }
  const c = t.slice();
  for (let a = 0; a < r; ++a)
    for (let w = 0; w < e; ++w)
      t[e * a + w] = c[(e - w - 1) * r + a];
}
function Zr(t, A, e, i, s, r) {
  if (A === 1)
    return t;
  for (let w = 0; w < s.length; ++w) {
    if (s[w] % 8 !== 0)
      throw new Error("When decoding with predictor, only multiple of 8 bits are supported.");
    if (s[w] !== s[0])
      throw new Error("When decoding with predictor, all samples must have the same size.");
  }
  const c = s[0] / 8, a = r === 2 ? 1 : s.length;
  for (let w = 0; w < i && !(w * a * e * c >= t.byteLength); ++w) {
    let o;
    if (A === 2) {
      switch (s[0]) {
        case 8:
          o = new Uint8Array(
            t,
            w * a * e * c,
            a * e * c
          );
          break;
        case 16:
          o = new Uint16Array(
            t,
            w * a * e * c,
            a * e * c / 2
          );
          break;
        case 32:
          o = new Uint32Array(
            t,
            w * a * e * c,
            a * e * c / 4
          );
          break;
        default:
          throw new Error(`Predictor 2 not allowed with ${s[0]} bits per sample.`);
      }
      Xr(o, a);
    } else A === 3 && (o = new Uint8Array(
      t,
      w * a * e * c,
      a * e * c
    ), zr(o, a, c));
  }
  return t;
}
class GA {
  async decode(A, e) {
    const i = await this.decodeBlock(e), s = A.Predictor || 1;
    if (s !== 1) {
      const r = !A.StripOffsets, c = r ? A.TileWidth : A.ImageWidth, a = r ? A.TileLength : A.RowsPerStrip || A.ImageLength;
      return Zr(
        i,
        s,
        c,
        a,
        A.BitsPerSample,
        A.PlanarConfiguration
      );
    }
    return i;
  }
}
function Ke(t) {
  switch (t) {
    case J.BYTE:
    case J.ASCII:
    case J.SBYTE:
    case J.UNDEFINED:
      return 1;
    case J.SHORT:
    case J.SSHORT:
      return 2;
    case J.LONG:
    case J.SLONG:
    case J.FLOAT:
    case J.IFD:
      return 4;
    case J.RATIONAL:
    case J.SRATIONAL:
    case J.DOUBLE:
    case J.LONG8:
    case J.SLONG8:
    case J.IFD8:
      return 8;
    default:
      throw new RangeError(`Invalid field type: ${t}`);
  }
}
function Wr(t) {
  const A = t.GeoKeyDirectory;
  if (!A)
    return null;
  const e = {};
  for (let i = 4; i <= A[3] * 4; i += 4) {
    const s = pr[A[i]], r = A[i + 1] ? jA[A[i + 1]] : null, c = A[i + 2], a = A[i + 3];
    let w = null;
    if (!r)
      w = a;
    else {
      if (w = t[r], typeof w > "u" || w === null)
        throw new Error(`Could not get value of geoKey '${s}'.`);
      typeof w == "string" ? w = w.substring(a, a + c - 1) : w.subarray && (w = w.subarray(a, a + c), c === 1 && (w = w[0]));
    }
    e[s] = w;
  }
  return e;
}
function UA(t, A, e, i) {
  let s = null, r = null;
  const c = Ke(A);
  switch (A) {
    case J.BYTE:
    case J.ASCII:
    case J.UNDEFINED:
      s = new Uint8Array(e), r = t.readUint8;
      break;
    case J.SBYTE:
      s = new Int8Array(e), r = t.readInt8;
      break;
    case J.SHORT:
      s = new Uint16Array(e), r = t.readUint16;
      break;
    case J.SSHORT:
      s = new Int16Array(e), r = t.readInt16;
      break;
    case J.LONG:
    case J.IFD:
      s = new Uint32Array(e), r = t.readUint32;
      break;
    case J.SLONG:
      s = new Int32Array(e), r = t.readInt32;
      break;
    case J.LONG8:
    case J.IFD8:
      s = new Array(e), r = t.readUint64;
      break;
    case J.SLONG8:
      s = new Array(e), r = t.readInt64;
      break;
    case J.RATIONAL:
      s = new Uint32Array(e * 2), r = t.readUint32;
      break;
    case J.SRATIONAL:
      s = new Int32Array(e * 2), r = t.readInt32;
      break;
    case J.FLOAT:
      s = new Float32Array(e), r = t.readFloat32;
      break;
    case J.DOUBLE:
      s = new Float64Array(e), r = t.readFloat64;
      break;
    default:
      throw new RangeError(`Invalid field type: ${A}`);
  }
  if (A === J.RATIONAL || A === J.SRATIONAL)
    for (let a = 0; a < e; a += 2)
      s[a] = r.call(
        t,
        i + a * c
      ), s[a + 1] = r.call(
        t,
        i + (a * c + 4)
      );
  else
    for (let a = 0; a < e; ++a)
      s[a] = r.call(
        t,
        i + a * c
      );
  return A === J.ASCII ? new TextDecoder("utf-8").decode(s) : s;
}
class $r {
  constructor(A, e, i) {
    this.fileDirectory = A, this.geoKeyDirectory = e, this.nextIFDByteOffset = i;
  }
}
class oe extends Error {
  constructor(A) {
    super(`No image at index ${A}`), this.index = A;
  }
}
class Ao {
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
  async readRasters(A = {}) {
    const { window: e, width: i, height: s } = A;
    let { resX: r, resY: c, bbox: a } = A;
    const w = await this.getImage();
    let o = w;
    const n = await this.getImageCount(), g = w.getBoundingBox();
    if (e && a)
      throw new Error('Both "bbox" and "window" passed.');
    if (i || s) {
      if (e) {
        const [I, d] = w.getOrigin(), [f, h] = w.getResolution();
        a = [
          I + e[0] * f,
          d + e[1] * h,
          I + e[2] * f,
          d + e[3] * h
        ];
      }
      const l = a || g;
      if (i) {
        if (r)
          throw new Error("Both width and resX passed");
        r = (l[2] - l[0]) / i;
      }
      if (s) {
        if (c)
          throw new Error("Both width and resY passed");
        c = (l[3] - l[1]) / s;
      }
    }
    if (r || c) {
      const l = [];
      for (let I = 0; I < n; ++I) {
        const d = await this.getImage(I), { SubfileType: f, NewSubfileType: h } = d.fileDirectory;
        (I === 0 || f === 2 || h & 1) && l.push(d);
      }
      l.sort((I, d) => I.getWidth() - d.getWidth());
      for (let I = 0; I < l.length; ++I) {
        const d = l[I], f = (g[2] - g[0]) / d.getWidth(), h = (g[3] - g[1]) / d.getHeight();
        if (o = d, r && r > f || c && c > h)
          break;
      }
    }
    let B = e;
    if (a) {
      const [l, I] = w.getOrigin(), [d, f] = o.getResolution(w);
      B = [
        Math.round((a[0] - l) / d),
        Math.round((a[1] - I) / f),
        Math.round((a[2] - l) / d),
        Math.round((a[3] - I) / f)
      ], B = [
        Math.min(B[0], B[2]),
        Math.min(B[1], B[3]),
        Math.max(B[0], B[2]),
        Math.max(B[1], B[3])
      ];
    }
    return o.readRasters({ ...A, window: B });
  }
}
class lt extends Ao {
  /**
   * @constructor
   * @param {*} source The datasource to read from.
   * @param {boolean} littleEndian Whether the image uses little endian.
   * @param {boolean} bigTiff Whether the image uses bigTIFF conventions.
   * @param {number} firstIFDOffset The numeric byte-offset from the start of the image
   *                                to the first IFD.
   * @param {GeoTIFFOptions} [options] further options.
   */
  constructor(A, e, i, s, r = {}) {
    super(), this.source = A, this.littleEndian = e, this.bigTiff = i, this.firstIFDOffset = s, this.cache = r.cache || !1, this.ifdRequests = [], this.ghostValues = null;
  }
  async getSlice(A, e) {
    const i = this.bigTiff ? 4048 : 1024;
    return new Hr(
      (await this.source.fetch([{
        offset: A,
        length: typeof e < "u" ? e : i
      }]))[0],
      A,
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
  async parseFileDirectoryAt(A) {
    const e = this.bigTiff ? 20 : 12, i = this.bigTiff ? 8 : 2;
    let s = await this.getSlice(A);
    const r = this.bigTiff ? s.readUint64(A) : s.readUint16(A), c = r * e + (this.bigTiff ? 16 : 6);
    s.covers(A, c) || (s = await this.getSlice(A, c));
    const a = {};
    let w = A + (this.bigTiff ? 8 : 2);
    for (let g = 0; g < r; w += e, ++g) {
      const B = s.readUint16(w), l = s.readUint16(w + 2), I = this.bigTiff ? s.readUint64(w + 4) : s.readUint32(w + 4);
      let d, f;
      const h = Ke(l), u = w + (this.bigTiff ? 12 : 8);
      if (h * I <= (this.bigTiff ? 8 : 4))
        d = UA(s, l, I, u);
      else {
        const p = s.readOffset(u), E = Ke(l) * I;
        if (s.covers(p, E))
          d = UA(s, l, I, p);
        else {
          const D = await this.getSlice(p, E);
          d = UA(D, l, I, p);
        }
      }
      I === 1 && dr.indexOf(B) === -1 && !(l === J.RATIONAL || l === J.SRATIONAL) ? f = d[0] : f = d, a[jA[B]] = f;
    }
    const o = Wr(a), n = s.readOffset(
      A + i + e * r
    );
    return new $r(
      a,
      o,
      n
    );
  }
  async requestIFD(A) {
    if (this.ifdRequests[A])
      return this.ifdRequests[A];
    if (A === 0)
      return this.ifdRequests[A] = this.parseFileDirectoryAt(this.firstIFDOffset), this.ifdRequests[A];
    if (!this.ifdRequests[A - 1])
      try {
        this.ifdRequests[A - 1] = this.requestIFD(A - 1);
      } catch (e) {
        throw e instanceof oe ? new oe(A) : e;
      }
    return this.ifdRequests[A] = (async () => {
      const e = await this.ifdRequests[A - 1];
      if (e.nextIFDByteOffset === 0)
        throw new oe(A);
      return this.parseFileDirectoryAt(e.nextIFDByteOffset);
    })(), this.ifdRequests[A];
  }
  /**
   * Get the n-th internal subfile of an image. By default, the first is returned.
   *
   * @param {number} [index=0] the index of the image to return.
   * @returns {Promise<GeoTIFFImage>} the image at the given index
   */
  async getImage(A = 0) {
    const e = await this.requestIFD(A);
    return new Jr(
      e.fileDirectory,
      e.geoKeyDirectory,
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
    let A = 0, e = !0;
    for (; e; )
      try {
        await this.requestIFD(A), ++A;
      } catch (i) {
        if (i instanceof oe)
          e = !1;
        else
          throw i;
      }
    return A;
  }
  /**
   * Get the values of the COG ghost area as a parsed map.
   * See https://gdal.org/drivers/raster/cog.html#header-ghost-area for reference
   * @returns {Promise<Object>} the parsed ghost area or null, if no such area was found
   */
  async getGhostValues() {
    const A = this.bigTiff ? 16 : 8;
    if (this.ghostValues)
      return this.ghostValues;
    const e = "GDAL_STRUCTURAL_METADATA_SIZE=", i = e.length + 100;
    let s = await this.getSlice(A, i);
    if (e === UA(s, J.ASCII, e.length, A)) {
      const c = UA(s, J.ASCII, i, A).split(`
`)[0], a = Number(c.split("=")[1].split(" ")[0]) + c.length;
      a > i && (s = await this.getSlice(A, a));
      const w = UA(s, J.ASCII, a, A);
      this.ghostValues = {}, w.split(`
`).filter((o) => o.length > 0).map((o) => o.split("=")).forEach(([o, n]) => {
        this.ghostValues[o] = n;
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
  static async fromSource(A, e, i) {
    const s = (await A.fetch([{ offset: 0, length: 1024 }], i))[0], r = new Kr(s), c = r.getUint16(0, 0);
    let a;
    if (c === 18761)
      a = !0;
    else if (c === 19789)
      a = !1;
    else
      throw new TypeError("Invalid byte order value.");
    const w = r.getUint16(2, a);
    let o;
    if (w === 42)
      o = !1;
    else if (w === 43) {
      if (o = !0, r.getUint16(4, a) !== 8)
        throw new Error("Unsupported offset byte-size.");
    } else
      throw new TypeError("Invalid magic number.");
    const n = o ? r.getUint64(8, a) : r.getUint32(4, a);
    return new lt(A, a, o, n, e);
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
async function eo(t, A) {
  return lt.fromSource(jr(t), A);
}
function to(t, A, e, i = 64, s = 64) {
  const [r, c, a, w] = A, [o, n, g, B] = e, l = t.width / (a - r), I = t.height / (w - c), d = (o - r) * l, f = (w - B) * I, h = (g - r) * l, u = (w - n) * I, p = [d, f, h, u];
  return io(t.buffer, t.width, t.height, p, i, s, 0);
}
function io(t, A, e, i, s, r, c = 0) {
  if (t.length !== A * e)
    throw new Error("Buffer size does not match width and height");
  const [a, w, o, n] = i, g = Math.min(a, o), B = Math.max(a, o), l = Math.min(w, n), I = Math.max(w, n), d = new Float32Array(s * r), f = (B - g) / s, h = (I - l) / r;
  for (let u = 0; u < r; u++)
    for (let p = 0; p < s; p++) {
      const E = g + p * f, D = l + u * h, C = u * s + p;
      if (E < 0 || E >= A || D < 0 || D >= e) {
        d[C] = c;
        continue;
      }
      const Q = Math.floor(E), y = Math.floor(D), S = Math.min(Q + 1, A - 1), b = Math.min(y + 1, e - 1);
      if (!(Q > g && Q < B && y > l && y < I)) {
        d[C] = t[y * A + Q] + 1e3;
        continue;
      }
      const G = E - Q, M = D - y, Y = t[y * A + Q], F = t[b * A + Q], k = t[y * A + S], U = t[b * A + S], L = Y * (1 - G) * (1 - M) + k * G * (1 - M) + F * (1 - G) * M + U * G * M;
      console.assert(!isNaN(L)), d[C] = L + 1e3;
    }
  return d;
}
class no {
  info = {
    version: "0.10.0",
    description: "TIF DEM terrain loader. It can load single tif dem."
  };
  // 数据标识
  dataType = "tif-dem";
  // 数据加载器
  _loader = new Dn(si.manager);
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
  async load(A) {
    const { source: e, z: i, bounds: s } = A, r = new rn(), c = e._getUrl(0, 0, 0);
    if (i < e.minLevel || i > e.maxLevel || !c)
      return r;
    const a = ze.clamp((A.z + 2) * 3, 2, 128);
    if (!e.data) {
      console.log("load image...", c);
      const o = await this._loader.loadAsync(c);
      e.data = await this.getTIFFRaster(o);
    }
    const w = await this.getTileDEM(e.data, e._projectionBounds, s, a);
    return r.setData(w);
  }
  /**
   * 从 ArrayBuffer 中读取 TIFF 图像的栅格数据
   * @param buffer 包含 TIFF 图像数据的 ArrayBuffer
   * @returns 包含栅格数据的对象，包含 buffer、width 和 height 属性
   */
  async getTIFFRaster(A) {
    const i = await (await (await eo(A)).getImage(0)).readRasters();
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
  async getTileDEM(A, e, i, s) {
    return to(A, e, i, s, s).map((c) => c / 1e3);
  }
}
class fa extends tA {
  dataType = "tif-dem";
  data;
}
on(new no());
class ro {
  info = {
    version: "0.10.0",
    description: "Tile wireframe material loader."
  };
  dataType = "wireframe";
  async load(A) {
    const e = new ZA(`hsl(${A.z * 14}, 100%, 50%)`);
    return new mn({
      transparent: !0,
      wireframe: !0,
      color: e,
      opacity: A.source.opacity,
      depthTest: !1
    });
  }
}
ee(new ro());
class oo extends tA {
  token = "";
  format = "webp";
  style = "mapbox.satellite";
  attribution = "MapBox";
  maxLevel = 19;
  url = "https://api.mapbox.com/v4/{style}/{z}/{x}/{y}.{format}?access_token={token}";
  constructor(A) {
    super(A), Object.assign(this, A);
  }
}
class so extends tA {
  dataType = "image";
  attribution = "ArcGIS";
  style = "World_Imagery";
  url = "https://services.arcgisonline.com/arcgis/rest/services/{style}/MapServer/tile/{z}/{y}/{x}";
  constructor(A) {
    super(A), Object.assign(this, A);
  }
}
class ao extends tA {
  dataType = "lerc";
  attribution = "ArcGIS";
  minLevel = 6;
  maxLevel = 13;
  url = "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer/tile/{z}/{y}/{x}";
  constructor(A) {
    super(A), Object.assign(this, A);
  }
}
class go extends tA {
  dataType = "image";
  attribution = "Bing[GS(2021)1731号]";
  style = "A";
  mkt = "zh-CN";
  subdomains = "123";
  constructor(A) {
    super(A), Object.assign(this, A);
  }
  getUrl(A, e, i) {
    const s = lo(i, A, e);
    return `https://t${this.s}.dynamic.tiles.ditu.live.com/comp/ch/${s}?mkt=${this.mkt}&ur=CN&it=${this.style}&n=z&og=804&cstl=vb`;
  }
}
function lo(t, A, e) {
  let i = "";
  for (let s = t; s > 0; s--) {
    const r = 1 << s - 1;
    let c = 0;
    A & r && c++, e & r && (c += 2), i += c;
  }
  return i;
}
class Io extends tA {
  dataType = "image";
  attribution = "高德[GS(2021)6375号]";
  style = "8";
  subdomains = "1234";
  maxLevel = 18;
  url = "https://webst0{s}.is.autonavi.com/appmaptile?style={style}&x={x}&y={y}&z={z}";
  constructor(A) {
    super(A), Object.assign(this, A);
  }
}
class co extends tA {
  dataType = "image";
  maxLevel = 16;
  attribution = "GeoQ[GS(2019)758号]";
  style = "ChinaOnlineStreetPurplishBlue";
  url = "https://map.geoq.cn/ArcGIS/rest/services/{style}/MapServer/tile/{z}/{y}/{x}";
  constructor(A) {
    super(A), Object.assign(this, A);
  }
}
class fo extends tA {
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
  constructor(A) {
    super(A), Object.assign(this, A);
  }
}
class Bo extends tA {
  attribution = "MapTiler";
  token = "get_your_own_key_QmavnBrQwNGsQ8YvPzZg";
  format = "jpg";
  style = "satellite-v2";
  url = "https://api.maptiler.com/tiles/{style}/{z}/{x}/{y}.{format}?key={token}";
  constructor(A) {
    super(A), Object.assign(this, A);
  }
}
class ho extends tA {
  dataType = "image";
  attribution = "Stadia";
  url = "https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}.jpg";
  constructor(A) {
    super(A), Object.assign(this, A);
  }
}
class Co extends tA {
  dataType = "image";
  attribution = "天地图[GS(2023)336号]";
  token = "";
  style = "img_w";
  subdomains = "01234";
  url = "https://t{s}.tianditu.gov.cn/DataServer?T={style}&x={x}&y={y}&l={z}&tk={token}";
  constructor(A) {
    super(A), Object.assign(this, A);
  }
}
class Eo extends tA {
  dataType = "quantized-mesh";
  attribution = "天地图[GS(2023)336号]";
  token = "";
  subdomains = "01234";
  url = "https://t{s}.tianditu.gov.cn/mapservice/swdx?T=elv_c&tk={token}&x={x}&y={y}&l={z}";
  constructor(A) {
    super(A), Object.assign(this, A);
  }
}
class Qo extends tA {
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
  constructor(A) {
    super(A), Object.assign(this, A);
  }
  _getUrl(A, e, i) {
    return this.sx = A >> 4, this.sy = (1 << i) - e >> 4, super._getUrl(A, e, i);
  }
}
class uo extends tA {
  attribution = "中科星图[GS(2022)3995号]";
  token = "";
  style = "img";
  format = "webp";
  subdomains = "12";
  url = "https://tiles{s}.geovisearth.com/base/v1/{style}/{z}/{x}/{y}?format={format}&tmsIds=w&token={token}";
  constructor(A) {
    super(A), Object.assign(this, A);
  }
}
class wo extends tA {
  dataType = "quantized-mesh";
  attribution = "中科星图[GS(2022)3995号]";
  token = "";
  subdomains = "012";
  url = "https://tiles{s}.geovisearth.com/base/v1/terrain/{z}/{x}/{y}.terrain&token={token}";
  constructor(A) {
    super(A), Object.assign(this, A);
  }
}
const Ba = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ArcGisDemSource: ao,
  ArcGisSource: so,
  BingSource: go,
  GDSource: Io,
  GeoqSource: co,
  GoogleSource: fo,
  MapBoxSource: oo,
  MapTilerSource: Bo,
  StadiaSource: ho,
  TDTQMSource: Eo,
  TDTSource: Co,
  TXSource: Qo,
  ZKXTQMSource: wo,
  ZKXTSource: uo
}, Symbol.toStringTag, { value: "Module" }));
function ha(t, A, e) {
  const { currentTarget: i, clientX: s, clientY: r } = t;
  if (i instanceof HTMLElement) {
    const c = i.clientWidth, a = i.clientHeight, w = new IA(s / c * 2 - 1, -(r / a) * 2 + 1);
    return A.getLocalInfoFromScreen(e, w)?.location;
  } else
    return;
}
function Ca(t) {
  const A = /* @__PURE__ */ new Set();
  if ((Array.isArray(t.imgSource) ? t.imgSource : [t.imgSource]).forEach((i) => {
    const s = i.attribution;
    s && A.add(s);
  }), t.demSource) {
    const i = t.demSource.attribution;
    i && A.add(i);
  }
  return Array.from(A);
}
function Ea(t, A, e = 0.1) {
  const i = A.localToWorld(new sA(0, 0, -A.near - 0.1)), s = t.getLocalInfoFromWorld(i);
  if (s) {
    const r = i.y - s.point.y;
    if (r < e) {
      const c = r < 0 ? -r * 1.1 : r / 10, a = t.localToWorld(t.up.clone()).multiplyScalar(c);
      return A.position.add(a), !0;
    }
  }
  return !1;
}
class yo extends GA {
  decodeBlock(A) {
    return A;
  }
}
const po = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: yo
}, Symbol.toStringTag, { value: "Module" })), kt = 9, be = 256, He = 257, Do = 12;
function mo(t, A, e) {
  const i = A % 8, s = Math.floor(A / 8), r = 8 - i, c = A + e - (s + 1) * 8;
  let a = 8 * (s + 2) - (A + e);
  const w = (s + 2) * 8 - A;
  if (a = Math.max(0, a), s >= t.length)
    return console.warn("ran off the end of the buffer before finding EOI_CODE (end on input code)"), He;
  let o = t[s] & 2 ** (8 - i) - 1;
  o <<= e - r;
  let n = o;
  if (s + 1 < t.length) {
    let g = t[s + 1] >>> a;
    g <<= Math.max(0, e - w), n += g;
  }
  if (c > 8 && s + 2 < t.length) {
    const g = (s + 3) * 8 - (A + e), B = t[s + 2] >>> g;
    n += B;
  }
  return n;
}
function Fe(t, A) {
  for (let e = A.length - 1; e >= 0; e--)
    t.push(A[e]);
  return t;
}
function xo(t) {
  const A = new Uint16Array(4093), e = new Uint8Array(4093);
  for (let I = 0; I <= 257; I++)
    A[I] = 4096, e[I] = I;
  let i = 258, s = kt, r = 0;
  function c() {
    i = 258, s = kt;
  }
  function a(I) {
    const d = mo(I, r, s);
    return r += s, d;
  }
  function w(I, d) {
    return e[i] = d, A[i] = I, i++, i - 1;
  }
  function o(I) {
    const d = [];
    for (let f = I; f !== 4096; f = A[f])
      d.push(e[f]);
    return d;
  }
  const n = [];
  c();
  const g = new Uint8Array(t);
  let B = a(g), l;
  for (; B !== He; ) {
    if (B === be) {
      for (c(), B = a(g); B === be; )
        B = a(g);
      if (B === He)
        break;
      if (B > be)
        throw new Error(`corrupted code at scanline ${B}`);
      {
        const I = o(B);
        Fe(n, I), l = B;
      }
    } else if (B < i) {
      const I = o(B);
      Fe(n, I), w(l, I[I.length - 1]), l = B;
    } else {
      const I = o(l);
      if (!I)
        throw new Error(`Bogus entry. Not in dictionary, ${l} / ${i}, position: ${r}`);
      Fe(n, I), n.push(I[I.length - 1]), w(l, I[I.length - 1]), l = B;
    }
    i + 1 >= 2 ** s && (s === Do ? l = void 0 : s++), B = a(g);
  }
  return new Uint8Array(n);
}
class ko extends GA {
  decodeBlock(A) {
    return xo(A).buffer;
  }
}
const So = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ko
}, Symbol.toStringTag, { value: "Module" })), XA = new Int32Array([
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
]), se = 4017, ae = 799, ge = 3406, le = 2276, Ie = 1567, ce = 3784, TA = 5793, fe = 2896;
function St(t, A) {
  let e = 0;
  const i = [];
  let s = 16;
  for (; s > 0 && !t[s - 1]; )
    --s;
  i.push({ children: [], index: 0 });
  let r = i[0], c;
  for (let a = 0; a < s; a++) {
    for (let w = 0; w < t[a]; w++) {
      for (r = i.pop(), r.children[r.index] = A[e]; r.index > 0; )
        r = i.pop();
      for (r.index++, i.push(r); i.length <= a; )
        i.push(c = { children: [], index: 0 }), r.children[r.index] = c.children, r = c;
      e++;
    }
    a + 1 < s && (i.push(c = { children: [], index: 0 }), r.children[r.index] = c.children, r = c);
  }
  return i[0].children;
}
function bo(t, A, e, i, s, r, c, a, w) {
  const { mcusPerLine: o, progressive: n } = e, g = A;
  let B = A, l = 0, I = 0;
  function d() {
    if (I > 0)
      return I--, l >> I & 1;
    if (l = t[B++], l === 255) {
      const T = t[B++];
      if (T)
        throw new Error(`unexpected marker: ${(l << 8 | T).toString(16)}`);
    }
    return I = 7, l >>> 7;
  }
  function f(T) {
    let q = T, O;
    for (; (O = d()) !== null; ) {
      if (q = q[O], typeof q == "number")
        return q;
      if (typeof q != "object")
        throw new Error("invalid huffman sequence");
    }
    return null;
  }
  function h(T) {
    let q = T, O = 0;
    for (; q > 0; ) {
      const K = d();
      if (K === null)
        return;
      O = O << 1 | K, --q;
    }
    return O;
  }
  function u(T) {
    const q = h(T);
    return q >= 1 << T - 1 ? q : q + (-1 << T) + 1;
  }
  function p(T, q) {
    const O = f(T.huffmanTableDC), K = O === 0 ? 0 : u(O);
    T.pred += K, q[0] = T.pred;
    let V = 1;
    for (; V < 64; ) {
      const z = f(T.huffmanTableAC), W = z & 15, AA = z >> 4;
      if (W === 0) {
        if (AA < 15)
          break;
        V += 16;
      } else {
        V += AA;
        const eA = XA[V];
        q[eA] = u(W), V++;
      }
    }
  }
  function E(T, q) {
    const O = f(T.huffmanTableDC), K = O === 0 ? 0 : u(O) << w;
    T.pred += K, q[0] = T.pred;
  }
  function D(T, q) {
    q[0] |= d() << w;
  }
  let C = 0;
  function Q(T, q) {
    if (C > 0) {
      C--;
      return;
    }
    let O = r;
    const K = c;
    for (; O <= K; ) {
      const V = f(T.huffmanTableAC), z = V & 15, W = V >> 4;
      if (z === 0) {
        if (W < 15) {
          C = h(W) + (1 << W) - 1;
          break;
        }
        O += 16;
      } else {
        O += W;
        const AA = XA[O];
        q[AA] = u(z) * (1 << w), O++;
      }
    }
  }
  let y = 0, S;
  function b(T, q) {
    let O = r;
    const K = c;
    let V = 0;
    for (; O <= K; ) {
      const z = XA[O], W = q[z] < 0 ? -1 : 1;
      switch (y) {
        case 0: {
          const AA = f(T.huffmanTableAC), eA = AA & 15;
          if (V = AA >> 4, eA === 0)
            V < 15 ? (C = h(V) + (1 << V), y = 4) : (V = 16, y = 1);
          else {
            if (eA !== 1)
              throw new Error("invalid ACn encoding");
            S = u(eA), y = V ? 2 : 3;
          }
          continue;
        }
        case 1:
        case 2:
          q[z] ? q[z] += (d() << w) * W : (V--, V === 0 && (y = y === 2 ? 3 : 0));
          break;
        case 3:
          q[z] ? q[z] += (d() << w) * W : (q[z] = S << w, y = 0);
          break;
        case 4:
          q[z] && (q[z] += (d() << w) * W);
          break;
      }
      O++;
    }
    y === 4 && (C--, C === 0 && (y = 0));
  }
  function x(T, q, O, K, V) {
    const z = O / o | 0, W = O % o, AA = z * T.v + K, eA = W * T.h + V;
    q(T, T.blocks[AA][eA]);
  }
  function G(T, q, O) {
    const K = O / T.blocksPerLine | 0, V = O % T.blocksPerLine;
    q(T, T.blocks[K][V]);
  }
  const M = i.length;
  let Y, F, k, U, L, R;
  n ? r === 0 ? R = a === 0 ? E : D : R = a === 0 ? Q : b : R = p;
  let _ = 0, N, H;
  M === 1 ? H = i[0].blocksPerLine * i[0].blocksPerColumn : H = o * e.mcusPerColumn;
  const j = s || H;
  for (; _ < H; ) {
    for (F = 0; F < M; F++)
      i[F].pred = 0;
    if (C = 0, M === 1)
      for (Y = i[0], L = 0; L < j; L++)
        G(Y, R, _), _++;
    else
      for (L = 0; L < j; L++) {
        for (F = 0; F < M; F++) {
          Y = i[F];
          const { h: T, v: q } = Y;
          for (k = 0; k < q; k++)
            for (U = 0; U < T; U++)
              x(Y, R, _, k, U);
        }
        if (_++, _ === H)
          break;
      }
    if (I = 0, N = t[B] << 8 | t[B + 1], N < 65280)
      throw new Error("marker was not found");
    if (N >= 65488 && N <= 65495)
      B += 2;
    else
      break;
  }
  return B - g;
}
function Fo(t, A) {
  const e = [], { blocksPerLine: i, blocksPerColumn: s } = A, r = i << 3, c = new Int32Array(64), a = new Uint8Array(64);
  function w(o, n, g) {
    const B = A.quantizationTable;
    let l, I, d, f, h, u, p, E, D;
    const C = g;
    let Q;
    for (Q = 0; Q < 64; Q++)
      C[Q] = o[Q] * B[Q];
    for (Q = 0; Q < 8; ++Q) {
      const y = 8 * Q;
      if (C[1 + y] === 0 && C[2 + y] === 0 && C[3 + y] === 0 && C[4 + y] === 0 && C[5 + y] === 0 && C[6 + y] === 0 && C[7 + y] === 0) {
        D = TA * C[0 + y] + 512 >> 10, C[0 + y] = D, C[1 + y] = D, C[2 + y] = D, C[3 + y] = D, C[4 + y] = D, C[5 + y] = D, C[6 + y] = D, C[7 + y] = D;
        continue;
      }
      l = TA * C[0 + y] + 128 >> 8, I = TA * C[4 + y] + 128 >> 8, d = C[2 + y], f = C[6 + y], h = fe * (C[1 + y] - C[7 + y]) + 128 >> 8, E = fe * (C[1 + y] + C[7 + y]) + 128 >> 8, u = C[3 + y] << 4, p = C[5 + y] << 4, D = l - I + 1 >> 1, l = l + I + 1 >> 1, I = D, D = d * ce + f * Ie + 128 >> 8, d = d * Ie - f * ce + 128 >> 8, f = D, D = h - p + 1 >> 1, h = h + p + 1 >> 1, p = D, D = E + u + 1 >> 1, u = E - u + 1 >> 1, E = D, D = l - f + 1 >> 1, l = l + f + 1 >> 1, f = D, D = I - d + 1 >> 1, I = I + d + 1 >> 1, d = D, D = h * le + E * ge + 2048 >> 12, h = h * ge - E * le + 2048 >> 12, E = D, D = u * ae + p * se + 2048 >> 12, u = u * se - p * ae + 2048 >> 12, p = D, C[0 + y] = l + E, C[7 + y] = l - E, C[1 + y] = I + p, C[6 + y] = I - p, C[2 + y] = d + u, C[5 + y] = d - u, C[3 + y] = f + h, C[4 + y] = f - h;
    }
    for (Q = 0; Q < 8; ++Q) {
      const y = Q;
      if (C[1 * 8 + y] === 0 && C[2 * 8 + y] === 0 && C[3 * 8 + y] === 0 && C[4 * 8 + y] === 0 && C[5 * 8 + y] === 0 && C[6 * 8 + y] === 0 && C[7 * 8 + y] === 0) {
        D = TA * g[Q + 0] + 8192 >> 14, C[0 * 8 + y] = D, C[1 * 8 + y] = D, C[2 * 8 + y] = D, C[3 * 8 + y] = D, C[4 * 8 + y] = D, C[5 * 8 + y] = D, C[6 * 8 + y] = D, C[7 * 8 + y] = D;
        continue;
      }
      l = TA * C[0 * 8 + y] + 2048 >> 12, I = TA * C[4 * 8 + y] + 2048 >> 12, d = C[2 * 8 + y], f = C[6 * 8 + y], h = fe * (C[1 * 8 + y] - C[7 * 8 + y]) + 2048 >> 12, E = fe * (C[1 * 8 + y] + C[7 * 8 + y]) + 2048 >> 12, u = C[3 * 8 + y], p = C[5 * 8 + y], D = l - I + 1 >> 1, l = l + I + 1 >> 1, I = D, D = d * ce + f * Ie + 2048 >> 12, d = d * Ie - f * ce + 2048 >> 12, f = D, D = h - p + 1 >> 1, h = h + p + 1 >> 1, p = D, D = E + u + 1 >> 1, u = E - u + 1 >> 1, E = D, D = l - f + 1 >> 1, l = l + f + 1 >> 1, f = D, D = I - d + 1 >> 1, I = I + d + 1 >> 1, d = D, D = h * le + E * ge + 2048 >> 12, h = h * ge - E * le + 2048 >> 12, E = D, D = u * ae + p * se + 2048 >> 12, u = u * se - p * ae + 2048 >> 12, p = D, C[0 * 8 + y] = l + E, C[7 * 8 + y] = l - E, C[1 * 8 + y] = I + p, C[6 * 8 + y] = I - p, C[2 * 8 + y] = d + u, C[5 * 8 + y] = d - u, C[3 * 8 + y] = f + h, C[4 * 8 + y] = f - h;
    }
    for (Q = 0; Q < 64; ++Q) {
      const y = 128 + (C[Q] + 8 >> 4);
      y < 0 ? n[Q] = 0 : y > 255 ? n[Q] = 255 : n[Q] = y;
    }
  }
  for (let o = 0; o < s; o++) {
    const n = o << 3;
    for (let g = 0; g < 8; g++)
      e.push(new Uint8Array(r));
    for (let g = 0; g < i; g++) {
      w(A.blocks[o][g], a, c);
      let B = 0;
      const l = g << 3;
      for (let I = 0; I < 8; I++) {
        const d = e[n + I];
        for (let f = 0; f < 8; f++)
          d[l + f] = a[B++];
      }
    }
  }
  return e;
}
class Mo {
  constructor() {
    this.jfif = null, this.adobe = null, this.quantizationTables = [], this.huffmanTablesAC = [], this.huffmanTablesDC = [], this.resetFrames();
  }
  resetFrames() {
    this.frames = [];
  }
  parse(A) {
    let e = 0;
    function i() {
      const a = A[e] << 8 | A[e + 1];
      return e += 2, a;
    }
    function s() {
      const a = i(), w = A.subarray(e, e + a - 2);
      return e += w.length, w;
    }
    function r(a) {
      let w = 0, o = 0, n, g;
      for (g in a.components)
        a.components.hasOwnProperty(g) && (n = a.components[g], w < n.h && (w = n.h), o < n.v && (o = n.v));
      const B = Math.ceil(a.samplesPerLine / 8 / w), l = Math.ceil(a.scanLines / 8 / o);
      for (g in a.components)
        if (a.components.hasOwnProperty(g)) {
          n = a.components[g];
          const I = Math.ceil(Math.ceil(a.samplesPerLine / 8) * n.h / w), d = Math.ceil(Math.ceil(a.scanLines / 8) * n.v / o), f = B * n.h, h = l * n.v, u = [];
          for (let p = 0; p < h; p++) {
            const E = [];
            for (let D = 0; D < f; D++)
              E.push(new Int32Array(64));
            u.push(E);
          }
          n.blocksPerLine = I, n.blocksPerColumn = d, n.blocks = u;
        }
      a.maxH = w, a.maxV = o, a.mcusPerLine = B, a.mcusPerColumn = l;
    }
    let c = i();
    if (c !== 65496)
      throw new Error("SOI not found");
    for (c = i(); c !== 65497; ) {
      switch (c) {
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
          const a = s();
          c === 65504 && a[0] === 74 && a[1] === 70 && a[2] === 73 && a[3] === 70 && a[4] === 0 && (this.jfif = {
            version: { major: a[5], minor: a[6] },
            densityUnits: a[7],
            xDensity: a[8] << 8 | a[9],
            yDensity: a[10] << 8 | a[11],
            thumbWidth: a[12],
            thumbHeight: a[13],
            thumbData: a.subarray(14, 14 + 3 * a[12] * a[13])
          }), c === 65518 && a[0] === 65 && a[1] === 100 && a[2] === 111 && a[3] === 98 && a[4] === 101 && a[5] === 0 && (this.adobe = {
            version: a[6],
            flags0: a[7] << 8 | a[8],
            flags1: a[9] << 8 | a[10],
            transformCode: a[11]
          });
          break;
        }
        case 65499: {
          const w = i() + e - 2;
          for (; e < w; ) {
            const o = A[e++], n = new Int32Array(64);
            if (o >> 4)
              if (o >> 4 === 1)
                for (let g = 0; g < 64; g++) {
                  const B = XA[g];
                  n[B] = i();
                }
              else
                throw new Error("DQT: invalid table spec");
            else for (let g = 0; g < 64; g++) {
              const B = XA[g];
              n[B] = A[e++];
            }
            this.quantizationTables[o & 15] = n;
          }
          break;
        }
        case 65472:
        case 65473:
        case 65474: {
          i();
          const a = {
            extended: c === 65473,
            progressive: c === 65474,
            precision: A[e++],
            scanLines: i(),
            samplesPerLine: i(),
            components: {},
            componentsOrder: []
          }, w = A[e++];
          let o;
          for (let n = 0; n < w; n++) {
            o = A[e];
            const g = A[e + 1] >> 4, B = A[e + 1] & 15, l = A[e + 2];
            a.componentsOrder.push(o), a.components[o] = {
              h: g,
              v: B,
              quantizationIdx: l
            }, e += 3;
          }
          r(a), this.frames.push(a);
          break;
        }
        case 65476: {
          const a = i();
          for (let w = 2; w < a; ) {
            const o = A[e++], n = new Uint8Array(16);
            let g = 0;
            for (let l = 0; l < 16; l++, e++)
              n[l] = A[e], g += n[l];
            const B = new Uint8Array(g);
            for (let l = 0; l < g; l++, e++)
              B[l] = A[e];
            w += 17 + g, o >> 4 ? this.huffmanTablesAC[o & 15] = St(
              n,
              B
            ) : this.huffmanTablesDC[o & 15] = St(
              n,
              B
            );
          }
          break;
        }
        case 65501:
          i(), this.resetInterval = i();
          break;
        case 65498: {
          i();
          const a = A[e++], w = [], o = this.frames[0];
          for (let I = 0; I < a; I++) {
            const d = o.components[A[e++]], f = A[e++];
            d.huffmanTableDC = this.huffmanTablesDC[f >> 4], d.huffmanTableAC = this.huffmanTablesAC[f & 15], w.push(d);
          }
          const n = A[e++], g = A[e++], B = A[e++], l = bo(
            A,
            e,
            o,
            w,
            this.resetInterval,
            n,
            g,
            B >> 4,
            B & 15
          );
          e += l;
          break;
        }
        case 65535:
          A[e] !== 255 && e--;
          break;
        default:
          if (A[e - 3] === 255 && A[e - 2] >= 192 && A[e - 2] <= 254) {
            e -= 3;
            break;
          }
          throw new Error(`unknown JPEG marker ${c.toString(16)}`);
      }
      c = i();
    }
  }
  getResult() {
    const { frames: A } = this;
    if (this.frames.length === 0)
      throw new Error("no frames were decoded");
    this.frames.length > 1 && console.warn("more than one frame is not supported");
    for (let n = 0; n < this.frames.length; n++) {
      const g = this.frames[n].components;
      for (const B of Object.keys(g))
        g[B].quantizationTable = this.quantizationTables[g[B].quantizationIdx], delete g[B].quantizationIdx;
    }
    const e = A[0], { components: i, componentsOrder: s } = e, r = [], c = e.samplesPerLine, a = e.scanLines;
    for (let n = 0; n < s.length; n++) {
      const g = i[s[n]];
      r.push({
        lines: Fo(e, g),
        scaleX: g.h / e.maxH,
        scaleY: g.v / e.maxV
      });
    }
    const w = new Uint8Array(c * a * r.length);
    let o = 0;
    for (let n = 0; n < a; ++n)
      for (let g = 0; g < c; ++g)
        for (let B = 0; B < r.length; ++B) {
          const l = r[B];
          w[o] = l.lines[0 | n * l.scaleY][0 | g * l.scaleX], ++o;
        }
    return w;
  }
}
class Go extends GA {
  constructor(A) {
    super(), this.reader = new Mo(), A.JPEGTables && this.reader.parse(A.JPEGTables);
  }
  decodeBlock(A) {
    return this.reader.resetFrames(), this.reader.parse(new Uint8Array(A)), this.reader.getResult().buffer;
  }
}
const vo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Go
}, Symbol.toStringTag, { value: "Module" }));
function JA(t) {
  let A = t.length;
  for (; --A >= 0; )
    t[A] = 0;
}
const Lo = 3, Ro = 258, bi = 29, Uo = 256, To = Uo + 1 + bi, Fi = 30, No = 512, _o = new Array((To + 2) * 2);
JA(_o);
const Oo = new Array(Fi * 2);
JA(Oo);
const qo = new Array(No);
JA(qo);
const Yo = new Array(Ro - Lo + 1);
JA(Yo);
const Jo = new Array(bi);
JA(Jo);
const Ko = new Array(Fi);
JA(Ko);
const Ho = (t, A, e, i) => {
  let s = t & 65535 | 0, r = t >>> 16 & 65535 | 0, c = 0;
  for (; e !== 0; ) {
    c = e > 2e3 ? 2e3 : e, e -= c;
    do
      s = s + A[i++] | 0, r = r + s | 0;
    while (--c);
    s %= 65521, r %= 65521;
  }
  return s | r << 16 | 0;
};
var Pe = Ho;
const Po = () => {
  let t, A = [];
  for (var e = 0; e < 256; e++) {
    t = e;
    for (var i = 0; i < 8; i++)
      t = t & 1 ? 3988292384 ^ t >>> 1 : t >>> 1;
    A[e] = t;
  }
  return A;
}, Vo = new Uint32Array(Po()), jo = (t, A, e, i) => {
  const s = Vo, r = i + e;
  t ^= -1;
  for (let c = i; c < r; c++)
    t = t >>> 8 ^ s[(t ^ A[c]) & 255];
  return t ^ -1;
};
var EA = jo, Ve = {
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
}, Mi = {
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
const Xo = (t, A) => Object.prototype.hasOwnProperty.call(t, A);
var zo = function(t) {
  const A = Array.prototype.slice.call(arguments, 1);
  for (; A.length; ) {
    const e = A.shift();
    if (e) {
      if (typeof e != "object")
        throw new TypeError(e + "must be non-object");
      for (const i in e)
        Xo(e, i) && (t[i] = e[i]);
    }
  }
  return t;
}, Zo = (t) => {
  let A = 0;
  for (let i = 0, s = t.length; i < s; i++)
    A += t[i].length;
  const e = new Uint8Array(A);
  for (let i = 0, s = 0, r = t.length; i < r; i++) {
    let c = t[i];
    e.set(c, s), s += c.length;
  }
  return e;
}, Gi = {
  assign: zo,
  flattenChunks: Zo
};
let vi = !0;
try {
  String.fromCharCode.apply(null, new Uint8Array(1));
} catch {
  vi = !1;
}
const $A = new Uint8Array(256);
for (let t = 0; t < 256; t++)
  $A[t] = t >= 252 ? 6 : t >= 248 ? 5 : t >= 240 ? 4 : t >= 224 ? 3 : t >= 192 ? 2 : 1;
$A[254] = $A[254] = 1;
var Wo = (t) => {
  if (typeof TextEncoder == "function" && TextEncoder.prototype.encode)
    return new TextEncoder().encode(t);
  let A, e, i, s, r, c = t.length, a = 0;
  for (s = 0; s < c; s++)
    e = t.charCodeAt(s), (e & 64512) === 55296 && s + 1 < c && (i = t.charCodeAt(s + 1), (i & 64512) === 56320 && (e = 65536 + (e - 55296 << 10) + (i - 56320), s++)), a += e < 128 ? 1 : e < 2048 ? 2 : e < 65536 ? 3 : 4;
  for (A = new Uint8Array(a), r = 0, s = 0; r < a; s++)
    e = t.charCodeAt(s), (e & 64512) === 55296 && s + 1 < c && (i = t.charCodeAt(s + 1), (i & 64512) === 56320 && (e = 65536 + (e - 55296 << 10) + (i - 56320), s++)), e < 128 ? A[r++] = e : e < 2048 ? (A[r++] = 192 | e >>> 6, A[r++] = 128 | e & 63) : e < 65536 ? (A[r++] = 224 | e >>> 12, A[r++] = 128 | e >>> 6 & 63, A[r++] = 128 | e & 63) : (A[r++] = 240 | e >>> 18, A[r++] = 128 | e >>> 12 & 63, A[r++] = 128 | e >>> 6 & 63, A[r++] = 128 | e & 63);
  return A;
};
const $o = (t, A) => {
  if (A < 65534 && t.subarray && vi)
    return String.fromCharCode.apply(null, t.length === A ? t : t.subarray(0, A));
  let e = "";
  for (let i = 0; i < A; i++)
    e += String.fromCharCode(t[i]);
  return e;
};
var As = (t, A) => {
  const e = A || t.length;
  if (typeof TextDecoder == "function" && TextDecoder.prototype.decode)
    return new TextDecoder().decode(t.subarray(0, A));
  let i, s;
  const r = new Array(e * 2);
  for (s = 0, i = 0; i < e; ) {
    let c = t[i++];
    if (c < 128) {
      r[s++] = c;
      continue;
    }
    let a = $A[c];
    if (a > 4) {
      r[s++] = 65533, i += a - 1;
      continue;
    }
    for (c &= a === 2 ? 31 : a === 3 ? 15 : 7; a > 1 && i < e; )
      c = c << 6 | t[i++] & 63, a--;
    if (a > 1) {
      r[s++] = 65533;
      continue;
    }
    c < 65536 ? r[s++] = c : (c -= 65536, r[s++] = 55296 | c >> 10 & 1023, r[s++] = 56320 | c & 1023);
  }
  return $o(r, s);
}, es = (t, A) => {
  A = A || t.length, A > t.length && (A = t.length);
  let e = A - 1;
  for (; e >= 0 && (t[e] & 192) === 128; )
    e--;
  return e < 0 || e === 0 ? A : e + $A[t[e]] > A ? e : A;
}, je = {
  string2buf: Wo,
  buf2string: As,
  utf8border: es
};
function ts() {
  this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
}
var is = ts;
const Be = 16209, ns = 16191;
var rs = function(A, e) {
  let i, s, r, c, a, w, o, n, g, B, l, I, d, f, h, u, p, E, D, C, Q, y, S, b;
  const x = A.state;
  i = A.next_in, S = A.input, s = i + (A.avail_in - 5), r = A.next_out, b = A.output, c = r - (e - A.avail_out), a = r + (A.avail_out - 257), w = x.dmax, o = x.wsize, n = x.whave, g = x.wnext, B = x.window, l = x.hold, I = x.bits, d = x.lencode, f = x.distcode, h = (1 << x.lenbits) - 1, u = (1 << x.distbits) - 1;
  A:
    do {
      I < 15 && (l += S[i++] << I, I += 8, l += S[i++] << I, I += 8), p = d[l & h];
      e:
        for (; ; ) {
          if (E = p >>> 24, l >>>= E, I -= E, E = p >>> 16 & 255, E === 0)
            b[r++] = p & 65535;
          else if (E & 16) {
            D = p & 65535, E &= 15, E && (I < E && (l += S[i++] << I, I += 8), D += l & (1 << E) - 1, l >>>= E, I -= E), I < 15 && (l += S[i++] << I, I += 8, l += S[i++] << I, I += 8), p = f[l & u];
            t:
              for (; ; ) {
                if (E = p >>> 24, l >>>= E, I -= E, E = p >>> 16 & 255, E & 16) {
                  if (C = p & 65535, E &= 15, I < E && (l += S[i++] << I, I += 8, I < E && (l += S[i++] << I, I += 8)), C += l & (1 << E) - 1, C > w) {
                    A.msg = "invalid distance too far back", x.mode = Be;
                    break A;
                  }
                  if (l >>>= E, I -= E, E = r - c, C > E) {
                    if (E = C - E, E > n && x.sane) {
                      A.msg = "invalid distance too far back", x.mode = Be;
                      break A;
                    }
                    if (Q = 0, y = B, g === 0) {
                      if (Q += o - E, E < D) {
                        D -= E;
                        do
                          b[r++] = B[Q++];
                        while (--E);
                        Q = r - C, y = b;
                      }
                    } else if (g < E) {
                      if (Q += o + g - E, E -= g, E < D) {
                        D -= E;
                        do
                          b[r++] = B[Q++];
                        while (--E);
                        if (Q = 0, g < D) {
                          E = g, D -= E;
                          do
                            b[r++] = B[Q++];
                          while (--E);
                          Q = r - C, y = b;
                        }
                      }
                    } else if (Q += g - E, E < D) {
                      D -= E;
                      do
                        b[r++] = B[Q++];
                      while (--E);
                      Q = r - C, y = b;
                    }
                    for (; D > 2; )
                      b[r++] = y[Q++], b[r++] = y[Q++], b[r++] = y[Q++], D -= 3;
                    D && (b[r++] = y[Q++], D > 1 && (b[r++] = y[Q++]));
                  } else {
                    Q = r - C;
                    do
                      b[r++] = b[Q++], b[r++] = b[Q++], b[r++] = b[Q++], D -= 3;
                    while (D > 2);
                    D && (b[r++] = b[Q++], D > 1 && (b[r++] = b[Q++]));
                  }
                } else if (E & 64) {
                  A.msg = "invalid distance code", x.mode = Be;
                  break A;
                } else {
                  p = f[(p & 65535) + (l & (1 << E) - 1)];
                  continue t;
                }
                break;
              }
          } else if (E & 64)
            if (E & 32) {
              x.mode = ns;
              break A;
            } else {
              A.msg = "invalid literal/length code", x.mode = Be;
              break A;
            }
          else {
            p = d[(p & 65535) + (l & (1 << E) - 1)];
            continue e;
          }
          break;
        }
    } while (i < s && r < a);
  D = I >> 3, i -= D, I -= D << 3, l &= (1 << I) - 1, A.next_in = i, A.next_out = r, A.avail_in = i < s ? 5 + (s - i) : 5 - (i - s), A.avail_out = r < a ? 257 + (a - r) : 257 - (r - a), x.hold = l, x.bits = I;
};
const NA = 15, bt = 852, Ft = 592, Mt = 0, Me = 1, Gt = 2, os = new Uint16Array([
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
]), ss = new Uint8Array([
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
]), as = new Uint16Array([
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
]), gs = new Uint8Array([
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
]), ls = (t, A, e, i, s, r, c, a) => {
  const w = a.bits;
  let o = 0, n = 0, g = 0, B = 0, l = 0, I = 0, d = 0, f = 0, h = 0, u = 0, p, E, D, C, Q, y = null, S;
  const b = new Uint16Array(NA + 1), x = new Uint16Array(NA + 1);
  let G = null, M, Y, F;
  for (o = 0; o <= NA; o++)
    b[o] = 0;
  for (n = 0; n < i; n++)
    b[A[e + n]]++;
  for (l = w, B = NA; B >= 1 && b[B] === 0; B--)
    ;
  if (l > B && (l = B), B === 0)
    return s[r++] = 1 << 24 | 64 << 16 | 0, s[r++] = 1 << 24 | 64 << 16 | 0, a.bits = 1, 0;
  for (g = 1; g < B && b[g] === 0; g++)
    ;
  for (l < g && (l = g), f = 1, o = 1; o <= NA; o++)
    if (f <<= 1, f -= b[o], f < 0)
      return -1;
  if (f > 0 && (t === Mt || B !== 1))
    return -1;
  for (x[1] = 0, o = 1; o < NA; o++)
    x[o + 1] = x[o] + b[o];
  for (n = 0; n < i; n++)
    A[e + n] !== 0 && (c[x[A[e + n]]++] = n);
  if (t === Mt ? (y = G = c, S = 20) : t === Me ? (y = os, G = ss, S = 257) : (y = as, G = gs, S = 0), u = 0, n = 0, o = g, Q = r, I = l, d = 0, D = -1, h = 1 << l, C = h - 1, t === Me && h > bt || t === Gt && h > Ft)
    return 1;
  for (; ; ) {
    M = o - d, c[n] + 1 < S ? (Y = 0, F = c[n]) : c[n] >= S ? (Y = G[c[n] - S], F = y[c[n] - S]) : (Y = 96, F = 0), p = 1 << o - d, E = 1 << I, g = E;
    do
      E -= p, s[Q + (u >> d) + E] = M << 24 | Y << 16 | F | 0;
    while (E !== 0);
    for (p = 1 << o - 1; u & p; )
      p >>= 1;
    if (p !== 0 ? (u &= p - 1, u += p) : u = 0, n++, --b[o] === 0) {
      if (o === B)
        break;
      o = A[e + c[n]];
    }
    if (o > l && (u & C) !== D) {
      for (d === 0 && (d = l), Q += g, I = o - d, f = 1 << I; I + d < B && (f -= b[I + d], !(f <= 0)); )
        I++, f <<= 1;
      if (h += 1 << I, t === Me && h > bt || t === Gt && h > Ft)
        return 1;
      D = u & C, s[D] = l << 24 | I << 16 | Q - r | 0;
    }
  }
  return u !== 0 && (s[Q + u] = o - d << 24 | 64 << 16 | 0), a.bits = l, 0;
};
var zA = ls;
const Is = 0, Li = 1, Ri = 2, {
  Z_FINISH: vt,
  Z_BLOCK: cs,
  Z_TREES: he,
  Z_OK: MA,
  Z_STREAM_END: fs,
  Z_NEED_DICT: Bs,
  Z_STREAM_ERROR: cA,
  Z_DATA_ERROR: Ui,
  Z_MEM_ERROR: Ti,
  Z_BUF_ERROR: hs,
  Z_DEFLATED: Lt
} = Mi, de = 16180, Rt = 16181, Ut = 16182, Tt = 16183, Nt = 16184, _t = 16185, Ot = 16186, qt = 16187, Yt = 16188, Jt = 16189, Qe = 16190, pA = 16191, Ge = 16192, Kt = 16193, ve = 16194, Ht = 16195, Pt = 16196, Vt = 16197, jt = 16198, Ce = 16199, Ee = 16200, Xt = 16201, zt = 16202, Zt = 16203, Wt = 16204, $t = 16205, Le = 16206, Ai = 16207, ei = 16208, Z = 16209, Ni = 16210, _i = 16211, Cs = 852, Es = 592, Qs = 15, us = Qs, ti = (t) => (t >>> 24 & 255) + (t >>> 8 & 65280) + ((t & 65280) << 8) + ((t & 255) << 24);
function ds() {
  this.strm = null, this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new Uint16Array(320), this.work = new Uint16Array(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
}
const vA = (t) => {
  if (!t)
    return 1;
  const A = t.state;
  return !A || A.strm !== t || A.mode < de || A.mode > _i ? 1 : 0;
}, Oi = (t) => {
  if (vA(t))
    return cA;
  const A = t.state;
  return t.total_in = t.total_out = A.total = 0, t.msg = "", A.wrap && (t.adler = A.wrap & 1), A.mode = de, A.last = 0, A.havedict = 0, A.flags = -1, A.dmax = 32768, A.head = null, A.hold = 0, A.bits = 0, A.lencode = A.lendyn = new Int32Array(Cs), A.distcode = A.distdyn = new Int32Array(Es), A.sane = 1, A.back = -1, MA;
}, qi = (t) => {
  if (vA(t))
    return cA;
  const A = t.state;
  return A.wsize = 0, A.whave = 0, A.wnext = 0, Oi(t);
}, Yi = (t, A) => {
  let e;
  if (vA(t))
    return cA;
  const i = t.state;
  return A < 0 ? (e = 0, A = -A) : (e = (A >> 4) + 5, A < 48 && (A &= 15)), A && (A < 8 || A > 15) ? cA : (i.window !== null && i.wbits !== A && (i.window = null), i.wrap = e, i.wbits = A, qi(t));
}, Ji = (t, A) => {
  if (!t)
    return cA;
  const e = new ds();
  t.state = e, e.strm = t, e.window = null, e.mode = de;
  const i = Yi(t, A);
  return i !== MA && (t.state = null), i;
}, ws = (t) => Ji(t, us);
let ii = !0, Re, Ue;
const ys = (t) => {
  if (ii) {
    Re = new Int32Array(512), Ue = new Int32Array(32);
    let A = 0;
    for (; A < 144; )
      t.lens[A++] = 8;
    for (; A < 256; )
      t.lens[A++] = 9;
    for (; A < 280; )
      t.lens[A++] = 7;
    for (; A < 288; )
      t.lens[A++] = 8;
    for (zA(Li, t.lens, 0, 288, Re, 0, t.work, { bits: 9 }), A = 0; A < 32; )
      t.lens[A++] = 5;
    zA(Ri, t.lens, 0, 32, Ue, 0, t.work, { bits: 5 }), ii = !1;
  }
  t.lencode = Re, t.lenbits = 9, t.distcode = Ue, t.distbits = 5;
}, Ki = (t, A, e, i) => {
  let s;
  const r = t.state;
  return r.window === null && (r.wsize = 1 << r.wbits, r.wnext = 0, r.whave = 0, r.window = new Uint8Array(r.wsize)), i >= r.wsize ? (r.window.set(A.subarray(e - r.wsize, e), 0), r.wnext = 0, r.whave = r.wsize) : (s = r.wsize - r.wnext, s > i && (s = i), r.window.set(A.subarray(e - i, e - i + s), r.wnext), i -= s, i ? (r.window.set(A.subarray(e - i, e), 0), r.wnext = i, r.whave = r.wsize) : (r.wnext += s, r.wnext === r.wsize && (r.wnext = 0), r.whave < r.wsize && (r.whave += s))), 0;
}, ps = (t, A) => {
  let e, i, s, r, c, a, w, o, n, g, B, l, I, d, f = 0, h, u, p, E, D, C, Q, y;
  const S = new Uint8Array(4);
  let b, x;
  const G = (
    /* permutation of code lengths */
    new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15])
  );
  if (vA(t) || !t.output || !t.input && t.avail_in !== 0)
    return cA;
  e = t.state, e.mode === pA && (e.mode = Ge), c = t.next_out, s = t.output, w = t.avail_out, r = t.next_in, i = t.input, a = t.avail_in, o = e.hold, n = e.bits, g = a, B = w, y = MA;
  A:
    for (; ; )
      switch (e.mode) {
        case de:
          if (e.wrap === 0) {
            e.mode = Ge;
            break;
          }
          for (; n < 16; ) {
            if (a === 0)
              break A;
            a--, o += i[r++] << n, n += 8;
          }
          if (e.wrap & 2 && o === 35615) {
            e.wbits === 0 && (e.wbits = 15), e.check = 0, S[0] = o & 255, S[1] = o >>> 8 & 255, e.check = EA(e.check, S, 2, 0), o = 0, n = 0, e.mode = Rt;
            break;
          }
          if (e.head && (e.head.done = !1), !(e.wrap & 1) || /* check if zlib header allowed */
          (((o & 255) << 8) + (o >> 8)) % 31) {
            t.msg = "incorrect header check", e.mode = Z;
            break;
          }
          if ((o & 15) !== Lt) {
            t.msg = "unknown compression method", e.mode = Z;
            break;
          }
          if (o >>>= 4, n -= 4, Q = (o & 15) + 8, e.wbits === 0 && (e.wbits = Q), Q > 15 || Q > e.wbits) {
            t.msg = "invalid window size", e.mode = Z;
            break;
          }
          e.dmax = 1 << e.wbits, e.flags = 0, t.adler = e.check = 1, e.mode = o & 512 ? Jt : pA, o = 0, n = 0;
          break;
        case Rt:
          for (; n < 16; ) {
            if (a === 0)
              break A;
            a--, o += i[r++] << n, n += 8;
          }
          if (e.flags = o, (e.flags & 255) !== Lt) {
            t.msg = "unknown compression method", e.mode = Z;
            break;
          }
          if (e.flags & 57344) {
            t.msg = "unknown header flags set", e.mode = Z;
            break;
          }
          e.head && (e.head.text = o >> 8 & 1), e.flags & 512 && e.wrap & 4 && (S[0] = o & 255, S[1] = o >>> 8 & 255, e.check = EA(e.check, S, 2, 0)), o = 0, n = 0, e.mode = Ut;
        case Ut:
          for (; n < 32; ) {
            if (a === 0)
              break A;
            a--, o += i[r++] << n, n += 8;
          }
          e.head && (e.head.time = o), e.flags & 512 && e.wrap & 4 && (S[0] = o & 255, S[1] = o >>> 8 & 255, S[2] = o >>> 16 & 255, S[3] = o >>> 24 & 255, e.check = EA(e.check, S, 4, 0)), o = 0, n = 0, e.mode = Tt;
        case Tt:
          for (; n < 16; ) {
            if (a === 0)
              break A;
            a--, o += i[r++] << n, n += 8;
          }
          e.head && (e.head.xflags = o & 255, e.head.os = o >> 8), e.flags & 512 && e.wrap & 4 && (S[0] = o & 255, S[1] = o >>> 8 & 255, e.check = EA(e.check, S, 2, 0)), o = 0, n = 0, e.mode = Nt;
        case Nt:
          if (e.flags & 1024) {
            for (; n < 16; ) {
              if (a === 0)
                break A;
              a--, o += i[r++] << n, n += 8;
            }
            e.length = o, e.head && (e.head.extra_len = o), e.flags & 512 && e.wrap & 4 && (S[0] = o & 255, S[1] = o >>> 8 & 255, e.check = EA(e.check, S, 2, 0)), o = 0, n = 0;
          } else e.head && (e.head.extra = null);
          e.mode = _t;
        case _t:
          if (e.flags & 1024 && (l = e.length, l > a && (l = a), l && (e.head && (Q = e.head.extra_len - e.length, e.head.extra || (e.head.extra = new Uint8Array(e.head.extra_len)), e.head.extra.set(
            i.subarray(
              r,
              // extra field is limited to 65536 bytes
              // - no need for additional size check
              r + l
            ),
            /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
            Q
          )), e.flags & 512 && e.wrap & 4 && (e.check = EA(e.check, i, l, r)), a -= l, r += l, e.length -= l), e.length))
            break A;
          e.length = 0, e.mode = Ot;
        case Ot:
          if (e.flags & 2048) {
            if (a === 0)
              break A;
            l = 0;
            do
              Q = i[r + l++], e.head && Q && e.length < 65536 && (e.head.name += String.fromCharCode(Q));
            while (Q && l < a);
            if (e.flags & 512 && e.wrap & 4 && (e.check = EA(e.check, i, l, r)), a -= l, r += l, Q)
              break A;
          } else e.head && (e.head.name = null);
          e.length = 0, e.mode = qt;
        case qt:
          if (e.flags & 4096) {
            if (a === 0)
              break A;
            l = 0;
            do
              Q = i[r + l++], e.head && Q && e.length < 65536 && (e.head.comment += String.fromCharCode(Q));
            while (Q && l < a);
            if (e.flags & 512 && e.wrap & 4 && (e.check = EA(e.check, i, l, r)), a -= l, r += l, Q)
              break A;
          } else e.head && (e.head.comment = null);
          e.mode = Yt;
        case Yt:
          if (e.flags & 512) {
            for (; n < 16; ) {
              if (a === 0)
                break A;
              a--, o += i[r++] << n, n += 8;
            }
            if (e.wrap & 4 && o !== (e.check & 65535)) {
              t.msg = "header crc mismatch", e.mode = Z;
              break;
            }
            o = 0, n = 0;
          }
          e.head && (e.head.hcrc = e.flags >> 9 & 1, e.head.done = !0), t.adler = e.check = 0, e.mode = pA;
          break;
        case Jt:
          for (; n < 32; ) {
            if (a === 0)
              break A;
            a--, o += i[r++] << n, n += 8;
          }
          t.adler = e.check = ti(o), o = 0, n = 0, e.mode = Qe;
        case Qe:
          if (e.havedict === 0)
            return t.next_out = c, t.avail_out = w, t.next_in = r, t.avail_in = a, e.hold = o, e.bits = n, Bs;
          t.adler = e.check = 1, e.mode = pA;
        case pA:
          if (A === cs || A === he)
            break A;
        case Ge:
          if (e.last) {
            o >>>= n & 7, n -= n & 7, e.mode = Le;
            break;
          }
          for (; n < 3; ) {
            if (a === 0)
              break A;
            a--, o += i[r++] << n, n += 8;
          }
          switch (e.last = o & 1, o >>>= 1, n -= 1, o & 3) {
            case 0:
              e.mode = Kt;
              break;
            case 1:
              if (ys(e), e.mode = Ce, A === he) {
                o >>>= 2, n -= 2;
                break A;
              }
              break;
            case 2:
              e.mode = Pt;
              break;
            case 3:
              t.msg = "invalid block type", e.mode = Z;
          }
          o >>>= 2, n -= 2;
          break;
        case Kt:
          for (o >>>= n & 7, n -= n & 7; n < 32; ) {
            if (a === 0)
              break A;
            a--, o += i[r++] << n, n += 8;
          }
          if ((o & 65535) !== (o >>> 16 ^ 65535)) {
            t.msg = "invalid stored block lengths", e.mode = Z;
            break;
          }
          if (e.length = o & 65535, o = 0, n = 0, e.mode = ve, A === he)
            break A;
        case ve:
          e.mode = Ht;
        case Ht:
          if (l = e.length, l) {
            if (l > a && (l = a), l > w && (l = w), l === 0)
              break A;
            s.set(i.subarray(r, r + l), c), a -= l, r += l, w -= l, c += l, e.length -= l;
            break;
          }
          e.mode = pA;
          break;
        case Pt:
          for (; n < 14; ) {
            if (a === 0)
              break A;
            a--, o += i[r++] << n, n += 8;
          }
          if (e.nlen = (o & 31) + 257, o >>>= 5, n -= 5, e.ndist = (o & 31) + 1, o >>>= 5, n -= 5, e.ncode = (o & 15) + 4, o >>>= 4, n -= 4, e.nlen > 286 || e.ndist > 30) {
            t.msg = "too many length or distance symbols", e.mode = Z;
            break;
          }
          e.have = 0, e.mode = Vt;
        case Vt:
          for (; e.have < e.ncode; ) {
            for (; n < 3; ) {
              if (a === 0)
                break A;
              a--, o += i[r++] << n, n += 8;
            }
            e.lens[G[e.have++]] = o & 7, o >>>= 3, n -= 3;
          }
          for (; e.have < 19; )
            e.lens[G[e.have++]] = 0;
          if (e.lencode = e.lendyn, e.lenbits = 7, b = { bits: e.lenbits }, y = zA(Is, e.lens, 0, 19, e.lencode, 0, e.work, b), e.lenbits = b.bits, y) {
            t.msg = "invalid code lengths set", e.mode = Z;
            break;
          }
          e.have = 0, e.mode = jt;
        case jt:
          for (; e.have < e.nlen + e.ndist; ) {
            for (; f = e.lencode[o & (1 << e.lenbits) - 1], h = f >>> 24, u = f >>> 16 & 255, p = f & 65535, !(h <= n); ) {
              if (a === 0)
                break A;
              a--, o += i[r++] << n, n += 8;
            }
            if (p < 16)
              o >>>= h, n -= h, e.lens[e.have++] = p;
            else {
              if (p === 16) {
                for (x = h + 2; n < x; ) {
                  if (a === 0)
                    break A;
                  a--, o += i[r++] << n, n += 8;
                }
                if (o >>>= h, n -= h, e.have === 0) {
                  t.msg = "invalid bit length repeat", e.mode = Z;
                  break;
                }
                Q = e.lens[e.have - 1], l = 3 + (o & 3), o >>>= 2, n -= 2;
              } else if (p === 17) {
                for (x = h + 3; n < x; ) {
                  if (a === 0)
                    break A;
                  a--, o += i[r++] << n, n += 8;
                }
                o >>>= h, n -= h, Q = 0, l = 3 + (o & 7), o >>>= 3, n -= 3;
              } else {
                for (x = h + 7; n < x; ) {
                  if (a === 0)
                    break A;
                  a--, o += i[r++] << n, n += 8;
                }
                o >>>= h, n -= h, Q = 0, l = 11 + (o & 127), o >>>= 7, n -= 7;
              }
              if (e.have + l > e.nlen + e.ndist) {
                t.msg = "invalid bit length repeat", e.mode = Z;
                break;
              }
              for (; l--; )
                e.lens[e.have++] = Q;
            }
          }
          if (e.mode === Z)
            break;
          if (e.lens[256] === 0) {
            t.msg = "invalid code -- missing end-of-block", e.mode = Z;
            break;
          }
          if (e.lenbits = 9, b = { bits: e.lenbits }, y = zA(Li, e.lens, 0, e.nlen, e.lencode, 0, e.work, b), e.lenbits = b.bits, y) {
            t.msg = "invalid literal/lengths set", e.mode = Z;
            break;
          }
          if (e.distbits = 6, e.distcode = e.distdyn, b = { bits: e.distbits }, y = zA(Ri, e.lens, e.nlen, e.ndist, e.distcode, 0, e.work, b), e.distbits = b.bits, y) {
            t.msg = "invalid distances set", e.mode = Z;
            break;
          }
          if (e.mode = Ce, A === he)
            break A;
        case Ce:
          e.mode = Ee;
        case Ee:
          if (a >= 6 && w >= 258) {
            t.next_out = c, t.avail_out = w, t.next_in = r, t.avail_in = a, e.hold = o, e.bits = n, rs(t, B), c = t.next_out, s = t.output, w = t.avail_out, r = t.next_in, i = t.input, a = t.avail_in, o = e.hold, n = e.bits, e.mode === pA && (e.back = -1);
            break;
          }
          for (e.back = 0; f = e.lencode[o & (1 << e.lenbits) - 1], h = f >>> 24, u = f >>> 16 & 255, p = f & 65535, !(h <= n); ) {
            if (a === 0)
              break A;
            a--, o += i[r++] << n, n += 8;
          }
          if (u && !(u & 240)) {
            for (E = h, D = u, C = p; f = e.lencode[C + ((o & (1 << E + D) - 1) >> E)], h = f >>> 24, u = f >>> 16 & 255, p = f & 65535, !(E + h <= n); ) {
              if (a === 0)
                break A;
              a--, o += i[r++] << n, n += 8;
            }
            o >>>= E, n -= E, e.back += E;
          }
          if (o >>>= h, n -= h, e.back += h, e.length = p, u === 0) {
            e.mode = $t;
            break;
          }
          if (u & 32) {
            e.back = -1, e.mode = pA;
            break;
          }
          if (u & 64) {
            t.msg = "invalid literal/length code", e.mode = Z;
            break;
          }
          e.extra = u & 15, e.mode = Xt;
        case Xt:
          if (e.extra) {
            for (x = e.extra; n < x; ) {
              if (a === 0)
                break A;
              a--, o += i[r++] << n, n += 8;
            }
            e.length += o & (1 << e.extra) - 1, o >>>= e.extra, n -= e.extra, e.back += e.extra;
          }
          e.was = e.length, e.mode = zt;
        case zt:
          for (; f = e.distcode[o & (1 << e.distbits) - 1], h = f >>> 24, u = f >>> 16 & 255, p = f & 65535, !(h <= n); ) {
            if (a === 0)
              break A;
            a--, o += i[r++] << n, n += 8;
          }
          if (!(u & 240)) {
            for (E = h, D = u, C = p; f = e.distcode[C + ((o & (1 << E + D) - 1) >> E)], h = f >>> 24, u = f >>> 16 & 255, p = f & 65535, !(E + h <= n); ) {
              if (a === 0)
                break A;
              a--, o += i[r++] << n, n += 8;
            }
            o >>>= E, n -= E, e.back += E;
          }
          if (o >>>= h, n -= h, e.back += h, u & 64) {
            t.msg = "invalid distance code", e.mode = Z;
            break;
          }
          e.offset = p, e.extra = u & 15, e.mode = Zt;
        case Zt:
          if (e.extra) {
            for (x = e.extra; n < x; ) {
              if (a === 0)
                break A;
              a--, o += i[r++] << n, n += 8;
            }
            e.offset += o & (1 << e.extra) - 1, o >>>= e.extra, n -= e.extra, e.back += e.extra;
          }
          if (e.offset > e.dmax) {
            t.msg = "invalid distance too far back", e.mode = Z;
            break;
          }
          e.mode = Wt;
        case Wt:
          if (w === 0)
            break A;
          if (l = B - w, e.offset > l) {
            if (l = e.offset - l, l > e.whave && e.sane) {
              t.msg = "invalid distance too far back", e.mode = Z;
              break;
            }
            l > e.wnext ? (l -= e.wnext, I = e.wsize - l) : I = e.wnext - l, l > e.length && (l = e.length), d = e.window;
          } else
            d = s, I = c - e.offset, l = e.length;
          l > w && (l = w), w -= l, e.length -= l;
          do
            s[c++] = d[I++];
          while (--l);
          e.length === 0 && (e.mode = Ee);
          break;
        case $t:
          if (w === 0)
            break A;
          s[c++] = e.length, w--, e.mode = Ee;
          break;
        case Le:
          if (e.wrap) {
            for (; n < 32; ) {
              if (a === 0)
                break A;
              a--, o |= i[r++] << n, n += 8;
            }
            if (B -= w, t.total_out += B, e.total += B, e.wrap & 4 && B && (t.adler = e.check = /*UPDATE_CHECK(state.check, put - _out, _out);*/
            e.flags ? EA(e.check, s, B, c - B) : Pe(e.check, s, B, c - B)), B = w, e.wrap & 4 && (e.flags ? o : ti(o)) !== e.check) {
              t.msg = "incorrect data check", e.mode = Z;
              break;
            }
            o = 0, n = 0;
          }
          e.mode = Ai;
        case Ai:
          if (e.wrap && e.flags) {
            for (; n < 32; ) {
              if (a === 0)
                break A;
              a--, o += i[r++] << n, n += 8;
            }
            if (e.wrap & 4 && o !== (e.total & 4294967295)) {
              t.msg = "incorrect length check", e.mode = Z;
              break;
            }
            o = 0, n = 0;
          }
          e.mode = ei;
        case ei:
          y = fs;
          break A;
        case Z:
          y = Ui;
          break A;
        case Ni:
          return Ti;
        case _i:
        default:
          return cA;
      }
  return t.next_out = c, t.avail_out = w, t.next_in = r, t.avail_in = a, e.hold = o, e.bits = n, (e.wsize || B !== t.avail_out && e.mode < Z && (e.mode < Le || A !== vt)) && Ki(t, t.output, t.next_out, B - t.avail_out), g -= t.avail_in, B -= t.avail_out, t.total_in += g, t.total_out += B, e.total += B, e.wrap & 4 && B && (t.adler = e.check = /*UPDATE_CHECK(state.check, strm.next_out - _out, _out);*/
  e.flags ? EA(e.check, s, B, t.next_out - B) : Pe(e.check, s, B, t.next_out - B)), t.data_type = e.bits + (e.last ? 64 : 0) + (e.mode === pA ? 128 : 0) + (e.mode === Ce || e.mode === ve ? 256 : 0), (g === 0 && B === 0 || A === vt) && y === MA && (y = hs), y;
}, Ds = (t) => {
  if (vA(t))
    return cA;
  let A = t.state;
  return A.window && (A.window = null), t.state = null, MA;
}, ms = (t, A) => {
  if (vA(t))
    return cA;
  const e = t.state;
  return e.wrap & 2 ? (e.head = A, A.done = !1, MA) : cA;
}, xs = (t, A) => {
  const e = A.length;
  let i, s, r;
  return vA(t) || (i = t.state, i.wrap !== 0 && i.mode !== Qe) ? cA : i.mode === Qe && (s = 1, s = Pe(s, A, e, 0), s !== i.check) ? Ui : (r = Ki(t, A, e, e), r ? (i.mode = Ni, Ti) : (i.havedict = 1, MA));
};
var ks = qi, Ss = Yi, bs = Oi, Fs = ws, Ms = Ji, Gs = ps, vs = Ds, Ls = ms, Rs = xs, Us = "pako inflate (from Nodeca project)", xA = {
  inflateReset: ks,
  inflateReset2: Ss,
  inflateResetKeep: bs,
  inflateInit: Fs,
  inflateInit2: Ms,
  inflate: Gs,
  inflateEnd: vs,
  inflateGetHeader: Ls,
  inflateSetDictionary: Rs,
  inflateInfo: Us
};
function Ts() {
  this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
}
var Ns = Ts;
const Hi = Object.prototype.toString, {
  Z_NO_FLUSH: _s,
  Z_FINISH: Os,
  Z_OK: Ae,
  Z_STREAM_END: Te,
  Z_NEED_DICT: Ne,
  Z_STREAM_ERROR: qs,
  Z_DATA_ERROR: ni,
  Z_MEM_ERROR: Ys
} = Mi;
function we(t) {
  this.options = Gi.assign({
    chunkSize: 1024 * 64,
    windowBits: 15,
    to: ""
  }, t || {});
  const A = this.options;
  A.raw && A.windowBits >= 0 && A.windowBits < 16 && (A.windowBits = -A.windowBits, A.windowBits === 0 && (A.windowBits = -15)), A.windowBits >= 0 && A.windowBits < 16 && !(t && t.windowBits) && (A.windowBits += 32), A.windowBits > 15 && A.windowBits < 48 && (A.windowBits & 15 || (A.windowBits |= 15)), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new is(), this.strm.avail_out = 0;
  let e = xA.inflateInit2(
    this.strm,
    A.windowBits
  );
  if (e !== Ae)
    throw new Error(Ve[e]);
  if (this.header = new Ns(), xA.inflateGetHeader(this.strm, this.header), A.dictionary && (typeof A.dictionary == "string" ? A.dictionary = je.string2buf(A.dictionary) : Hi.call(A.dictionary) === "[object ArrayBuffer]" && (A.dictionary = new Uint8Array(A.dictionary)), A.raw && (e = xA.inflateSetDictionary(this.strm, A.dictionary), e !== Ae)))
    throw new Error(Ve[e]);
}
we.prototype.push = function(t, A) {
  const e = this.strm, i = this.options.chunkSize, s = this.options.dictionary;
  let r, c, a;
  if (this.ended) return !1;
  for (A === ~~A ? c = A : c = A === !0 ? Os : _s, Hi.call(t) === "[object ArrayBuffer]" ? e.input = new Uint8Array(t) : e.input = t, e.next_in = 0, e.avail_in = e.input.length; ; ) {
    for (e.avail_out === 0 && (e.output = new Uint8Array(i), e.next_out = 0, e.avail_out = i), r = xA.inflate(e, c), r === Ne && s && (r = xA.inflateSetDictionary(e, s), r === Ae ? r = xA.inflate(e, c) : r === ni && (r = Ne)); e.avail_in > 0 && r === Te && e.state.wrap > 0 && t[e.next_in] !== 0; )
      xA.inflateReset(e), r = xA.inflate(e, c);
    switch (r) {
      case qs:
      case ni:
      case Ne:
      case Ys:
        return this.onEnd(r), this.ended = !0, !1;
    }
    if (a = e.avail_out, e.next_out && (e.avail_out === 0 || r === Te))
      if (this.options.to === "string") {
        let w = je.utf8border(e.output, e.next_out), o = e.next_out - w, n = je.buf2string(e.output, w);
        e.next_out = o, e.avail_out = i - o, o && e.output.set(e.output.subarray(w, w + o), 0), this.onData(n);
      } else
        this.onData(e.output.length === e.next_out ? e.output : e.output.subarray(0, e.next_out));
    if (!(r === Ae && a === 0)) {
      if (r === Te)
        return r = xA.inflateEnd(this.strm), this.onEnd(r), this.ended = !0, !0;
      if (e.avail_in === 0) break;
    }
  }
  return !0;
};
we.prototype.onData = function(t) {
  this.chunks.push(t);
};
we.prototype.onEnd = function(t) {
  t === Ae && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = Gi.flattenChunks(this.chunks)), this.chunks = [], this.err = t, this.msg = this.strm.msg;
};
function Js(t, A) {
  const e = new we(A);
  if (e.push(t), e.err) throw e.msg || Ve[e.err];
  return e.result;
}
var Ks = Js, Hs = {
  inflate: Ks
};
const { inflate: Ps } = Hs;
var Pi = Ps;
class Vs extends GA {
  decodeBlock(A) {
    return Pi(new Uint8Array(A)).buffer;
  }
}
const js = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Vs
}, Symbol.toStringTag, { value: "Module" }));
class Xs extends GA {
  decodeBlock(A) {
    const e = new DataView(A), i = [];
    for (let s = 0; s < A.byteLength; ++s) {
      let r = e.getInt8(s);
      if (r < 0) {
        const c = e.getUint8(s + 1);
        r = -r;
        for (let a = 0; a <= r; ++a)
          i.push(c);
        s += 1;
      } else {
        for (let c = 0; c <= r; ++c)
          i.push(e.getUint8(s + c + 1));
        s += r + 1;
      }
    }
    return new Uint8Array(i).buffer;
  }
}
const zs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Xs
}, Symbol.toStringTag, { value: "Module" }));
var Vi = { exports: {} };
(function(t) {
  /* Copyright 2015-2021 Esri. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 @preserve */
  (function() {
    var A = function() {
      var r = {};
      r.defaultNoDataValue = -34027999387901484e22, r.decode = function(g, B) {
        B = B || {};
        var l = B.encodedMaskData || B.encodedMaskData === null, I = o(g, B.inputOffset || 0, l), d = B.noDataValue !== null ? B.noDataValue : r.defaultNoDataValue, f = c(
          I,
          B.pixelType || Float32Array,
          B.encodedMaskData,
          d,
          B.returnMask
        ), h = {
          width: I.width,
          height: I.height,
          pixelData: f.resultPixels,
          minValue: f.minValue,
          maxValue: I.pixels.maxValue,
          noDataValue: d
        };
        return f.resultMask && (h.maskData = f.resultMask), B.returnEncodedMask && I.mask && (h.encodedMaskData = I.mask.bitset ? I.mask.bitset : null), B.returnFileInfo && (h.fileInfo = a(I), B.computeUsedBitDepths && (h.fileInfo.bitDepths = w(I))), h;
      };
      var c = function(g, B, l, I, d) {
        var f = 0, h = g.pixels.numBlocksX, u = g.pixels.numBlocksY, p = Math.floor(g.width / h), E = Math.floor(g.height / u), D = 2 * g.maxZError, C = Number.MAX_VALUE, Q;
        l = l || (g.mask ? g.mask.bitset : null);
        var y, S;
        y = new B(g.width * g.height), d && l && (S = new Uint8Array(g.width * g.height));
        for (var b = new Float32Array(p * E), x, G, M = 0; M <= u; M++) {
          var Y = M !== u ? E : g.height % u;
          if (Y !== 0)
            for (var F = 0; F <= h; F++) {
              var k = F !== h ? p : g.width % h;
              if (k !== 0) {
                var U = M * g.width * E + F * p, L = g.width - k, R = g.pixels.blocks[f], _, N, H;
                R.encoding < 2 ? (R.encoding === 0 ? _ = R.rawData : (n(R.stuffedData, R.bitsPerPixel, R.numValidPixels, R.offset, D, b, g.pixels.maxValue), _ = b), N = 0) : R.encoding === 2 ? H = 0 : H = R.offset;
                var j;
                if (l)
                  for (G = 0; G < Y; G++) {
                    for (U & 7 && (j = l[U >> 3], j <<= U & 7), x = 0; x < k; x++)
                      U & 7 || (j = l[U >> 3]), j & 128 ? (S && (S[U] = 1), Q = R.encoding < 2 ? _[N++] : H, C = C > Q ? Q : C, y[U++] = Q) : (S && (S[U] = 0), y[U++] = I), j <<= 1;
                    U += L;
                  }
                else if (R.encoding < 2)
                  for (G = 0; G < Y; G++) {
                    for (x = 0; x < k; x++)
                      Q = _[N++], C = C > Q ? Q : C, y[U++] = Q;
                    U += L;
                  }
                else
                  for (C = C > H ? H : C, G = 0; G < Y; G++) {
                    for (x = 0; x < k; x++)
                      y[U++] = H;
                    U += L;
                  }
                if (R.encoding === 1 && N !== R.numValidPixels)
                  throw "Block and Mask do not match";
                f++;
              }
            }
        }
        return {
          resultPixels: y,
          resultMask: S,
          minValue: C
        };
      }, a = function(g) {
        return {
          fileIdentifierString: g.fileIdentifierString,
          fileVersion: g.fileVersion,
          imageType: g.imageType,
          height: g.height,
          width: g.width,
          maxZError: g.maxZError,
          eofOffset: g.eofOffset,
          mask: g.mask ? {
            numBlocksX: g.mask.numBlocksX,
            numBlocksY: g.mask.numBlocksY,
            numBytes: g.mask.numBytes,
            maxValue: g.mask.maxValue
          } : null,
          pixels: {
            numBlocksX: g.pixels.numBlocksX,
            numBlocksY: g.pixels.numBlocksY,
            numBytes: g.pixels.numBytes,
            maxValue: g.pixels.maxValue,
            noDataValue: g.noDataValue
          }
        };
      }, w = function(g) {
        for (var B = g.pixels.numBlocksX * g.pixels.numBlocksY, l = {}, I = 0; I < B; I++) {
          var d = g.pixels.blocks[I];
          d.encoding === 0 ? l.float32 = !0 : d.encoding === 1 ? l[d.bitsPerPixel] = !0 : l[0] = !0;
        }
        return Object.keys(l);
      }, o = function(g, B, l) {
        var I = {}, d = new Uint8Array(g, B, 10);
        if (I.fileIdentifierString = String.fromCharCode.apply(null, d), I.fileIdentifierString.trim() !== "CntZImage")
          throw "Unexpected file identifier string: " + I.fileIdentifierString;
        B += 10;
        var f = new DataView(g, B, 24);
        if (I.fileVersion = f.getInt32(0, !0), I.imageType = f.getInt32(4, !0), I.height = f.getUint32(8, !0), I.width = f.getUint32(12, !0), I.maxZError = f.getFloat64(16, !0), B += 24, !l)
          if (f = new DataView(g, B, 16), I.mask = {}, I.mask.numBlocksY = f.getUint32(0, !0), I.mask.numBlocksX = f.getUint32(4, !0), I.mask.numBytes = f.getUint32(8, !0), I.mask.maxValue = f.getFloat32(12, !0), B += 16, I.mask.numBytes > 0) {
            var h = new Uint8Array(Math.ceil(I.width * I.height / 8));
            f = new DataView(g, B, I.mask.numBytes);
            var u = f.getInt16(0, !0), p = 2, E = 0;
            do {
              if (u > 0)
                for (; u--; )
                  h[E++] = f.getUint8(p++);
              else {
                var D = f.getUint8(p++);
                for (u = -u; u--; )
                  h[E++] = D;
              }
              u = f.getInt16(p, !0), p += 2;
            } while (p < I.mask.numBytes);
            if (u !== -32768 || E < h.length)
              throw "Unexpected end of mask RLE encoding";
            I.mask.bitset = h, B += I.mask.numBytes;
          } else I.mask.numBytes | I.mask.numBlocksY | I.mask.maxValue || (I.mask.bitset = new Uint8Array(Math.ceil(I.width * I.height / 8)));
        f = new DataView(g, B, 16), I.pixels = {}, I.pixels.numBlocksY = f.getUint32(0, !0), I.pixels.numBlocksX = f.getUint32(4, !0), I.pixels.numBytes = f.getUint32(8, !0), I.pixels.maxValue = f.getFloat32(12, !0), B += 16;
        var C = I.pixels.numBlocksX, Q = I.pixels.numBlocksY, y = C + (I.width % C > 0 ? 1 : 0), S = Q + (I.height % Q > 0 ? 1 : 0);
        I.pixels.blocks = new Array(y * S);
        for (var b = 0, x = 0; x < S; x++)
          for (var G = 0; G < y; G++) {
            var M = 0, Y = g.byteLength - B;
            f = new DataView(g, B, Math.min(10, Y));
            var F = {};
            I.pixels.blocks[b++] = F;
            var k = f.getUint8(0);
            if (M++, F.encoding = k & 63, F.encoding > 3)
              throw "Invalid block encoding (" + F.encoding + ")";
            if (F.encoding === 2) {
              B++;
              continue;
            }
            if (k !== 0 && k !== 2) {
              if (k >>= 6, F.offsetType = k, k === 2)
                F.offset = f.getInt8(1), M++;
              else if (k === 1)
                F.offset = f.getInt16(1, !0), M += 2;
              else if (k === 0)
                F.offset = f.getFloat32(1, !0), M += 4;
              else
                throw "Invalid block offset type";
              if (F.encoding === 1)
                if (k = f.getUint8(M), M++, F.bitsPerPixel = k & 63, k >>= 6, F.numValidPixelsType = k, k === 2)
                  F.numValidPixels = f.getUint8(M), M++;
                else if (k === 1)
                  F.numValidPixels = f.getUint16(M, !0), M += 2;
                else if (k === 0)
                  F.numValidPixels = f.getUint32(M, !0), M += 4;
                else
                  throw "Invalid valid pixel count type";
            }
            if (B += M, F.encoding !== 3) {
              var U, L;
              if (F.encoding === 0) {
                var R = (I.pixels.numBytes - 1) / 4;
                if (R !== Math.floor(R))
                  throw "uncompressed block has invalid length";
                U = new ArrayBuffer(R * 4), L = new Uint8Array(U), L.set(new Uint8Array(g, B, R * 4));
                var _ = new Float32Array(U);
                F.rawData = _, B += R * 4;
              } else if (F.encoding === 1) {
                var N = Math.ceil(F.numValidPixels * F.bitsPerPixel / 8), H = Math.ceil(N / 4);
                U = new ArrayBuffer(H * 4), L = new Uint8Array(U), L.set(new Uint8Array(g, B, N)), F.stuffedData = new Uint32Array(U), B += N;
              }
            }
          }
        return I.eofOffset = B, I;
      }, n = function(g, B, l, I, d, f, h) {
        var u = (1 << B) - 1, p = 0, E, D = 0, C, Q, y = Math.ceil((h - I) / d), S = g.length * 4 - Math.ceil(B * l / 8);
        for (g[g.length - 1] <<= 8 * S, E = 0; E < l; E++) {
          if (D === 0 && (Q = g[p++], D = 32), D >= B)
            C = Q >>> D - B & u, D -= B;
          else {
            var b = B - D;
            C = (Q & u) << b & u, Q = g[p++], D = 32 - b, C += Q >>> D;
          }
          f[E] = C < y ? I + C * d : h;
        }
        return f;
      };
      return r;
    }(), e = /* @__PURE__ */ function() {
      var r = {
        //methods ending with 2 are for the new byte order used by Lerc2.3 and above.
        //originalUnstuff is used to unpack Huffman code table. code is duplicated to unstuffx for performance reasons.
        unstuff: function(o, n, g, B, l, I, d, f) {
          var h = (1 << g) - 1, u = 0, p, E = 0, D, C, Q, y, S = o.length * 4 - Math.ceil(g * B / 8);
          if (o[o.length - 1] <<= 8 * S, l)
            for (p = 0; p < B; p++)
              E === 0 && (C = o[u++], E = 32), E >= g ? (D = C >>> E - g & h, E -= g) : (Q = g - E, D = (C & h) << Q & h, C = o[u++], E = 32 - Q, D += C >>> E), n[p] = l[D];
          else
            for (y = Math.ceil((f - I) / d), p = 0; p < B; p++)
              E === 0 && (C = o[u++], E = 32), E >= g ? (D = C >>> E - g & h, E -= g) : (Q = g - E, D = (C & h) << Q & h, C = o[u++], E = 32 - Q, D += C >>> E), n[p] = D < y ? I + D * d : f;
        },
        unstuffLUT: function(o, n, g, B, l, I) {
          var d = (1 << n) - 1, f = 0, h = 0, u = 0, p = 0, E = 0, D, C = [], Q = o.length * 4 - Math.ceil(n * g / 8);
          o[o.length - 1] <<= 8 * Q;
          var y = Math.ceil((I - B) / l);
          for (h = 0; h < g; h++)
            p === 0 && (D = o[f++], p = 32), p >= n ? (E = D >>> p - n & d, p -= n) : (u = n - p, E = (D & d) << u & d, D = o[f++], p = 32 - u, E += D >>> p), C[h] = E < y ? B + E * l : I;
          return C.unshift(B), C;
        },
        unstuff2: function(o, n, g, B, l, I, d, f) {
          var h = (1 << g) - 1, u = 0, p, E = 0, D = 0, C, Q, y;
          if (l)
            for (p = 0; p < B; p++)
              E === 0 && (Q = o[u++], E = 32, D = 0), E >= g ? (C = Q >>> D & h, E -= g, D += g) : (y = g - E, C = Q >>> D & h, Q = o[u++], E = 32 - y, C |= (Q & (1 << y) - 1) << g - y, D = y), n[p] = l[C];
          else {
            var S = Math.ceil((f - I) / d);
            for (p = 0; p < B; p++)
              E === 0 && (Q = o[u++], E = 32, D = 0), E >= g ? (C = Q >>> D & h, E -= g, D += g) : (y = g - E, C = Q >>> D & h, Q = o[u++], E = 32 - y, C |= (Q & (1 << y) - 1) << g - y, D = y), n[p] = C < S ? I + C * d : f;
          }
          return n;
        },
        unstuffLUT2: function(o, n, g, B, l, I) {
          var d = (1 << n) - 1, f = 0, h = 0, u = 0, p = 0, E = 0, D = 0, C, Q = [], y = Math.ceil((I - B) / l);
          for (h = 0; h < g; h++)
            p === 0 && (C = o[f++], p = 32, D = 0), p >= n ? (E = C >>> D & d, p -= n, D += n) : (u = n - p, E = C >>> D & d, C = o[f++], p = 32 - u, E |= (C & (1 << u) - 1) << n - u, D = u), Q[h] = E < y ? B + E * l : I;
          return Q.unshift(B), Q;
        },
        originalUnstuff: function(o, n, g, B) {
          var l = (1 << g) - 1, I = 0, d, f = 0, h, u, p, E = o.length * 4 - Math.ceil(g * B / 8);
          for (o[o.length - 1] <<= 8 * E, d = 0; d < B; d++)
            f === 0 && (u = o[I++], f = 32), f >= g ? (h = u >>> f - g & l, f -= g) : (p = g - f, h = (u & l) << p & l, u = o[I++], f = 32 - p, h += u >>> f), n[d] = h;
          return n;
        },
        originalUnstuff2: function(o, n, g, B) {
          var l = (1 << g) - 1, I = 0, d, f = 0, h = 0, u, p, E;
          for (d = 0; d < B; d++)
            f === 0 && (p = o[I++], f = 32, h = 0), f >= g ? (u = p >>> h & l, f -= g, h += g) : (E = g - f, u = p >>> h & l, p = o[I++], f = 32 - E, u |= (p & (1 << E) - 1) << g - E, h = E), n[d] = u;
          return n;
        }
      }, c = {
        HUFFMAN_LUT_BITS_MAX: 12,
        //use 2^12 lut, treat it like constant
        computeChecksumFletcher32: function(o) {
          for (var n = 65535, g = 65535, B = o.length, l = Math.floor(B / 2), I = 0; l; ) {
            var d = l >= 359 ? 359 : l;
            l -= d;
            do
              n += o[I++] << 8, g += n += o[I++];
            while (--d);
            n = (n & 65535) + (n >>> 16), g = (g & 65535) + (g >>> 16);
          }
          return B & 1 && (g += n += o[I] << 8), n = (n & 65535) + (n >>> 16), g = (g & 65535) + (g >>> 16), (g << 16 | n) >>> 0;
        },
        readHeaderInfo: function(o, n) {
          var g = n.ptr, B = new Uint8Array(o, g, 6), l = {};
          if (l.fileIdentifierString = String.fromCharCode.apply(null, B), l.fileIdentifierString.lastIndexOf("Lerc2", 0) !== 0)
            throw "Unexpected file identifier string (expect Lerc2 ): " + l.fileIdentifierString;
          g += 6;
          var I = new DataView(o, g, 8), d = I.getInt32(0, !0);
          l.fileVersion = d, g += 4, d >= 3 && (l.checksum = I.getUint32(4, !0), g += 4), I = new DataView(o, g, 12), l.height = I.getUint32(0, !0), l.width = I.getUint32(4, !0), g += 8, d >= 4 ? (l.numDims = I.getUint32(8, !0), g += 4) : l.numDims = 1, I = new DataView(o, g, 40), l.numValidPixel = I.getUint32(0, !0), l.microBlockSize = I.getInt32(4, !0), l.blobSize = I.getInt32(8, !0), l.imageType = I.getInt32(12, !0), l.maxZError = I.getFloat64(16, !0), l.zMin = I.getFloat64(24, !0), l.zMax = I.getFloat64(32, !0), g += 40, n.headerInfo = l, n.ptr = g;
          var f, h;
          if (d >= 3 && (h = d >= 4 ? 52 : 48, f = this.computeChecksumFletcher32(new Uint8Array(o, g - h, l.blobSize - 14)), f !== l.checksum))
            throw "Checksum failed.";
          return !0;
        },
        checkMinMaxRanges: function(o, n) {
          var g = n.headerInfo, B = this.getDataTypeArray(g.imageType), l = g.numDims * this.getDataTypeSize(g.imageType), I = this.readSubArray(o, n.ptr, B, l), d = this.readSubArray(o, n.ptr + l, B, l);
          n.ptr += 2 * l;
          var f, h = !0;
          for (f = 0; f < g.numDims; f++)
            if (I[f] !== d[f]) {
              h = !1;
              break;
            }
          return g.minValues = I, g.maxValues = d, h;
        },
        readSubArray: function(o, n, g, B) {
          var l;
          if (g === Uint8Array)
            l = new Uint8Array(o, n, B);
          else {
            var I = new ArrayBuffer(B), d = new Uint8Array(I);
            d.set(new Uint8Array(o, n, B)), l = new g(I);
          }
          return l;
        },
        readMask: function(o, n) {
          var g = n.ptr, B = n.headerInfo, l = B.width * B.height, I = B.numValidPixel, d = new DataView(o, g, 4), f = {};
          if (f.numBytes = d.getUint32(0, !0), g += 4, (I === 0 || l === I) && f.numBytes !== 0)
            throw "invalid mask";
          var h, u;
          if (I === 0)
            h = new Uint8Array(Math.ceil(l / 8)), f.bitset = h, u = new Uint8Array(l), n.pixels.resultMask = u, g += f.numBytes;
          else if (f.numBytes > 0) {
            h = new Uint8Array(Math.ceil(l / 8)), d = new DataView(o, g, f.numBytes);
            var p = d.getInt16(0, !0), E = 2, D = 0, C = 0;
            do {
              if (p > 0)
                for (; p--; )
                  h[D++] = d.getUint8(E++);
              else
                for (C = d.getUint8(E++), p = -p; p--; )
                  h[D++] = C;
              p = d.getInt16(E, !0), E += 2;
            } while (E < f.numBytes);
            if (p !== -32768 || D < h.length)
              throw "Unexpected end of mask RLE encoding";
            u = new Uint8Array(l);
            var Q = 0, y = 0;
            for (y = 0; y < l; y++)
              y & 7 ? (Q = h[y >> 3], Q <<= y & 7) : Q = h[y >> 3], Q & 128 && (u[y] = 1);
            n.pixels.resultMask = u, f.bitset = h, g += f.numBytes;
          }
          return n.ptr = g, n.mask = f, !0;
        },
        readDataOneSweep: function(o, n, g, B) {
          var l = n.ptr, I = n.headerInfo, d = I.numDims, f = I.width * I.height, h = I.imageType, u = I.numValidPixel * c.getDataTypeSize(h) * d, p, E = n.pixels.resultMask;
          if (g === Uint8Array)
            p = new Uint8Array(o, l, u);
          else {
            var D = new ArrayBuffer(u), C = new Uint8Array(D);
            C.set(new Uint8Array(o, l, u)), p = new g(D);
          }
          if (p.length === f * d)
            B ? n.pixels.resultPixels = c.swapDimensionOrder(p, f, d, g, !0) : n.pixels.resultPixels = p;
          else {
            n.pixels.resultPixels = new g(f * d);
            var Q = 0, y = 0, S = 0, b = 0;
            if (d > 1) {
              if (B) {
                for (y = 0; y < f; y++)
                  if (E[y])
                    for (b = y, S = 0; S < d; S++, b += f)
                      n.pixels.resultPixels[b] = p[Q++];
              } else
                for (y = 0; y < f; y++)
                  if (E[y])
                    for (b = y * d, S = 0; S < d; S++)
                      n.pixels.resultPixels[b + S] = p[Q++];
            } else
              for (y = 0; y < f; y++)
                E[y] && (n.pixels.resultPixels[y] = p[Q++]);
          }
          return l += u, n.ptr = l, !0;
        },
        readHuffmanTree: function(o, n) {
          var g = this.HUFFMAN_LUT_BITS_MAX, B = new DataView(o, n.ptr, 16);
          n.ptr += 16;
          var l = B.getInt32(0, !0);
          if (l < 2)
            throw "unsupported Huffman version";
          var I = B.getInt32(4, !0), d = B.getInt32(8, !0), f = B.getInt32(12, !0);
          if (d >= f)
            return !1;
          var h = new Uint32Array(f - d);
          c.decodeBits(o, n, h);
          var u = [], p, E, D, C;
          for (p = d; p < f; p++)
            E = p - (p < I ? 0 : I), u[E] = { first: h[p - d], second: null };
          var Q = o.byteLength - n.ptr, y = Math.ceil(Q / 4), S = new ArrayBuffer(y * 4), b = new Uint8Array(S);
          b.set(new Uint8Array(o, n.ptr, Q));
          var x = new Uint32Array(S), G = 0, M, Y = 0;
          for (M = x[0], p = d; p < f; p++)
            E = p - (p < I ? 0 : I), C = u[E].first, C > 0 && (u[E].second = M << G >>> 32 - C, 32 - G >= C ? (G += C, G === 32 && (G = 0, Y++, M = x[Y])) : (G += C - 32, Y++, M = x[Y], u[E].second |= M >>> 32 - G));
          var F = 0, k = 0, U = new a();
          for (p = 0; p < u.length; p++)
            u[p] !== void 0 && (F = Math.max(F, u[p].first));
          F >= g ? k = g : k = F;
          var L = [], R, _, N, H, j, T;
          for (p = d; p < f; p++)
            if (E = p - (p < I ? 0 : I), C = u[E].first, C > 0)
              if (R = [C, E], C <= k)
                for (_ = u[E].second << k - C, N = 1 << k - C, D = 0; D < N; D++)
                  L[_ | D] = R;
              else
                for (_ = u[E].second, T = U, H = C - 1; H >= 0; H--)
                  j = _ >>> H & 1, j ? (T.right || (T.right = new a()), T = T.right) : (T.left || (T.left = new a()), T = T.left), H === 0 && !T.val && (T.val = R[1]);
          return {
            decodeLut: L,
            numBitsLUTQick: k,
            numBitsLUT: F,
            tree: U,
            stuffedData: x,
            srcPtr: Y,
            bitPos: G
          };
        },
        readHuffman: function(o, n, g, B) {
          var l = n.headerInfo, I = l.numDims, d = n.headerInfo.height, f = n.headerInfo.width, h = f * d, u = this.readHuffmanTree(o, n), p = u.decodeLut, E = u.tree, D = u.stuffedData, C = u.srcPtr, Q = u.bitPos, y = u.numBitsLUTQick, S = u.numBitsLUT, b = n.headerInfo.imageType === 0 ? 128 : 0, x, G, M, Y = n.pixels.resultMask, F, k, U, L, R, _, N, H = 0;
          Q > 0 && (C++, Q = 0);
          var j = D[C], T = n.encodeMode === 1, q = new g(h * I), O = q, K;
          if (I < 2 || T) {
            for (K = 0; K < I; K++)
              if (I > 1 && (O = new g(q.buffer, h * K, h), H = 0), n.headerInfo.numValidPixel === f * d)
                for (_ = 0, L = 0; L < d; L++)
                  for (R = 0; R < f; R++, _++) {
                    if (G = 0, F = j << Q >>> 32 - y, k = F, 32 - Q < y && (F |= D[C + 1] >>> 64 - Q - y, k = F), p[k])
                      G = p[k][1], Q += p[k][0];
                    else
                      for (F = j << Q >>> 32 - S, k = F, 32 - Q < S && (F |= D[C + 1] >>> 64 - Q - S, k = F), x = E, N = 0; N < S; N++)
                        if (U = F >>> S - N - 1 & 1, x = U ? x.right : x.left, !(x.left || x.right)) {
                          G = x.val, Q = Q + N + 1;
                          break;
                        }
                    Q >= 32 && (Q -= 32, C++, j = D[C]), M = G - b, T ? (R > 0 ? M += H : L > 0 ? M += O[_ - f] : M += H, M &= 255, O[_] = M, H = M) : O[_] = M;
                  }
              else
                for (_ = 0, L = 0; L < d; L++)
                  for (R = 0; R < f; R++, _++)
                    if (Y[_]) {
                      if (G = 0, F = j << Q >>> 32 - y, k = F, 32 - Q < y && (F |= D[C + 1] >>> 64 - Q - y, k = F), p[k])
                        G = p[k][1], Q += p[k][0];
                      else
                        for (F = j << Q >>> 32 - S, k = F, 32 - Q < S && (F |= D[C + 1] >>> 64 - Q - S, k = F), x = E, N = 0; N < S; N++)
                          if (U = F >>> S - N - 1 & 1, x = U ? x.right : x.left, !(x.left || x.right)) {
                            G = x.val, Q = Q + N + 1;
                            break;
                          }
                      Q >= 32 && (Q -= 32, C++, j = D[C]), M = G - b, T ? (R > 0 && Y[_ - 1] ? M += H : L > 0 && Y[_ - f] ? M += O[_ - f] : M += H, M &= 255, O[_] = M, H = M) : O[_] = M;
                    }
          } else
            for (_ = 0, L = 0; L < d; L++)
              for (R = 0; R < f; R++)
                if (_ = L * f + R, !Y || Y[_])
                  for (K = 0; K < I; K++, _ += h) {
                    if (G = 0, F = j << Q >>> 32 - y, k = F, 32 - Q < y && (F |= D[C + 1] >>> 64 - Q - y, k = F), p[k])
                      G = p[k][1], Q += p[k][0];
                    else
                      for (F = j << Q >>> 32 - S, k = F, 32 - Q < S && (F |= D[C + 1] >>> 64 - Q - S, k = F), x = E, N = 0; N < S; N++)
                        if (U = F >>> S - N - 1 & 1, x = U ? x.right : x.left, !(x.left || x.right)) {
                          G = x.val, Q = Q + N + 1;
                          break;
                        }
                    Q >= 32 && (Q -= 32, C++, j = D[C]), M = G - b, O[_] = M;
                  }
          n.ptr = n.ptr + (C + 1) * 4 + (Q > 0 ? 4 : 0), n.pixels.resultPixels = q, I > 1 && !B && (n.pixels.resultPixels = c.swapDimensionOrder(q, h, I, g));
        },
        decodeBits: function(o, n, g, B, l) {
          {
            var I = n.headerInfo, d = I.fileVersion, f = 0, h = o.byteLength - n.ptr >= 5 ? 5 : o.byteLength - n.ptr, u = new DataView(o, n.ptr, h), p = u.getUint8(0);
            f++;
            var E = p >> 6, D = E === 0 ? 4 : 3 - E, C = (p & 32) > 0, Q = p & 31, y = 0;
            if (D === 1)
              y = u.getUint8(f), f++;
            else if (D === 2)
              y = u.getUint16(f, !0), f += 2;
            else if (D === 4)
              y = u.getUint32(f, !0), f += 4;
            else
              throw "Invalid valid pixel count type";
            var S = 2 * I.maxZError, b, x, G, M, Y, F, k, U, L, R = I.numDims > 1 ? I.maxValues[l] : I.zMax;
            if (C) {
              for (n.counter.lut++, U = u.getUint8(f), f++, M = Math.ceil((U - 1) * Q / 8), Y = Math.ceil(M / 4), x = new ArrayBuffer(Y * 4), G = new Uint8Array(x), n.ptr += f, G.set(new Uint8Array(o, n.ptr, M)), k = new Uint32Array(x), n.ptr += M, L = 0; U - 1 >>> L; )
                L++;
              M = Math.ceil(y * L / 8), Y = Math.ceil(M / 4), x = new ArrayBuffer(Y * 4), G = new Uint8Array(x), G.set(new Uint8Array(o, n.ptr, M)), b = new Uint32Array(x), n.ptr += M, d >= 3 ? F = r.unstuffLUT2(k, Q, U - 1, B, S, R) : F = r.unstuffLUT(k, Q, U - 1, B, S, R), d >= 3 ? r.unstuff2(b, g, L, y, F) : r.unstuff(b, g, L, y, F);
            } else
              n.counter.bitstuffer++, L = Q, n.ptr += f, L > 0 && (M = Math.ceil(y * L / 8), Y = Math.ceil(M / 4), x = new ArrayBuffer(Y * 4), G = new Uint8Array(x), G.set(new Uint8Array(o, n.ptr, M)), b = new Uint32Array(x), n.ptr += M, d >= 3 ? B == null ? r.originalUnstuff2(b, g, L, y) : r.unstuff2(b, g, L, y, !1, B, S, R) : B == null ? r.originalUnstuff(b, g, L, y) : r.unstuff(b, g, L, y, !1, B, S, R));
          }
        },
        readTiles: function(o, n, g, B) {
          var l = n.headerInfo, I = l.width, d = l.height, f = I * d, h = l.microBlockSize, u = l.imageType, p = c.getDataTypeSize(u), E = Math.ceil(I / h), D = Math.ceil(d / h);
          n.pixels.numBlocksY = D, n.pixels.numBlocksX = E, n.pixels.ptr = 0;
          var C = 0, Q = 0, y = 0, S = 0, b = 0, x = 0, G = 0, M = 0, Y = 0, F = 0, k = 0, U = 0, L = 0, R = 0, _ = 0, N = 0, H, j, T, q, O, K, V = new g(h * h), z = d % h || h, W = I % h || h, AA, eA, LA = l.numDims, BA, aA = n.pixels.resultMask, iA = n.pixels.resultPixels, ye = l.fileVersion, ie = ye >= 5 ? 14 : 15, fA, FA = l.zMax, oA;
          for (y = 0; y < D; y++)
            for (b = y !== D - 1 ? h : z, S = 0; S < E; S++)
              for (x = S !== E - 1 ? h : W, k = y * I * h + S * h, U = I - x, BA = 0; BA < LA; BA++) {
                if (LA > 1 ? (oA = iA, k = y * I * h + S * h, iA = new g(n.pixels.resultPixels.buffer, f * BA * p, f), FA = l.maxValues[BA]) : oA = null, G = o.byteLength - n.ptr, H = new DataView(o, n.ptr, Math.min(10, G)), j = {}, N = 0, M = H.getUint8(0), N++, fA = l.fileVersion >= 5 ? M & 4 : 0, Y = M >> 6 & 255, F = M >> 2 & ie, F !== (S * h >> 3 & ie) || fA && BA === 0)
                  throw "integrity issue";
                if (K = M & 3, K > 3)
                  throw n.ptr += N, "Invalid block encoding (" + K + ")";
                if (K === 2) {
                  if (fA)
                    if (aA)
                      for (C = 0; C < b; C++)
                        for (Q = 0; Q < x; Q++)
                          aA[k] && (iA[k] = oA[k]), k++;
                    else
                      for (C = 0; C < b; C++)
                        for (Q = 0; Q < x; Q++)
                          iA[k] = oA[k], k++;
                  n.counter.constant++, n.ptr += N;
                  continue;
                } else if (K === 0) {
                  if (fA)
                    throw "integrity issue";
                  if (n.counter.uncompressed++, n.ptr += N, L = b * x * p, R = o.byteLength - n.ptr, L = L < R ? L : R, T = new ArrayBuffer(L % p === 0 ? L : L + p - L % p), q = new Uint8Array(T), q.set(new Uint8Array(o, n.ptr, L)), O = new g(T), _ = 0, aA)
                    for (C = 0; C < b; C++) {
                      for (Q = 0; Q < x; Q++)
                        aA[k] && (iA[k] = O[_++]), k++;
                      k += U;
                    }
                  else
                    for (C = 0; C < b; C++) {
                      for (Q = 0; Q < x; Q++)
                        iA[k++] = O[_++];
                      k += U;
                    }
                  n.ptr += _ * p;
                } else if (AA = c.getDataTypeUsed(fA && u < 6 ? 4 : u, Y), eA = c.getOnePixel(j, N, AA, H), N += c.getDataTypeSize(AA), K === 3)
                  if (n.ptr += N, n.counter.constantoffset++, aA)
                    for (C = 0; C < b; C++) {
                      for (Q = 0; Q < x; Q++)
                        aA[k] && (iA[k] = fA ? Math.min(FA, oA[k] + eA) : eA), k++;
                      k += U;
                    }
                  else
                    for (C = 0; C < b; C++) {
                      for (Q = 0; Q < x; Q++)
                        iA[k] = fA ? Math.min(FA, oA[k] + eA) : eA, k++;
                      k += U;
                    }
                else if (n.ptr += N, c.decodeBits(o, n, V, eA, BA), N = 0, fA)
                  if (aA)
                    for (C = 0; C < b; C++) {
                      for (Q = 0; Q < x; Q++)
                        aA[k] && (iA[k] = V[N++] + oA[k]), k++;
                      k += U;
                    }
                  else
                    for (C = 0; C < b; C++) {
                      for (Q = 0; Q < x; Q++)
                        iA[k] = V[N++] + oA[k], k++;
                      k += U;
                    }
                else if (aA)
                  for (C = 0; C < b; C++) {
                    for (Q = 0; Q < x; Q++)
                      aA[k] && (iA[k] = V[N++]), k++;
                    k += U;
                  }
                else
                  for (C = 0; C < b; C++) {
                    for (Q = 0; Q < x; Q++)
                      iA[k++] = V[N++];
                    k += U;
                  }
              }
          LA > 1 && !B && (n.pixels.resultPixels = c.swapDimensionOrder(n.pixels.resultPixels, f, LA, g));
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
            pixelType: c.getPixelType(o.headerInfo.imageType),
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
        constructConstantSurface: function(o, n) {
          var g = o.headerInfo.zMax, B = o.headerInfo.zMin, l = o.headerInfo.maxValues, I = o.headerInfo.numDims, d = o.headerInfo.height * o.headerInfo.width, f = 0, h = 0, u = 0, p = o.pixels.resultMask, E = o.pixels.resultPixels;
          if (p)
            if (I > 1) {
              if (n)
                for (f = 0; f < I; f++)
                  for (u = f * d, g = l[f], h = 0; h < d; h++)
                    p[h] && (E[u + h] = g);
              else
                for (h = 0; h < d; h++)
                  if (p[h])
                    for (u = h * I, f = 0; f < I; f++)
                      E[u + I] = l[f];
            } else
              for (h = 0; h < d; h++)
                p[h] && (E[h] = g);
          else if (I > 1 && B !== g)
            if (n)
              for (f = 0; f < I; f++)
                for (u = f * d, g = l[f], h = 0; h < d; h++)
                  E[u + h] = g;
            else
              for (h = 0; h < d; h++)
                for (u = h * I, f = 0; f < I; f++)
                  E[u + f] = l[f];
          else
            for (h = 0; h < d * I; h++)
              E[h] = g;
        },
        getDataTypeArray: function(o) {
          var n;
          switch (o) {
            case 0:
              n = Int8Array;
              break;
            case 1:
              n = Uint8Array;
              break;
            case 2:
              n = Int16Array;
              break;
            case 3:
              n = Uint16Array;
              break;
            case 4:
              n = Int32Array;
              break;
            case 5:
              n = Uint32Array;
              break;
            case 6:
              n = Float32Array;
              break;
            case 7:
              n = Float64Array;
              break;
            default:
              n = Float32Array;
          }
          return n;
        },
        getPixelType: function(o) {
          var n;
          switch (o) {
            case 0:
              n = "S8";
              break;
            case 1:
              n = "U8";
              break;
            case 2:
              n = "S16";
              break;
            case 3:
              n = "U16";
              break;
            case 4:
              n = "S32";
              break;
            case 5:
              n = "U32";
              break;
            case 6:
              n = "F32";
              break;
            case 7:
              n = "F64";
              break;
            default:
              n = "F32";
          }
          return n;
        },
        isValidPixelValue: function(o, n) {
          if (n == null)
            return !1;
          var g;
          switch (o) {
            case 0:
              g = n >= -128 && n <= 127;
              break;
            case 1:
              g = n >= 0 && n <= 255;
              break;
            case 2:
              g = n >= -32768 && n <= 32767;
              break;
            case 3:
              g = n >= 0 && n <= 65536;
              break;
            case 4:
              g = n >= -2147483648 && n <= 2147483647;
              break;
            case 5:
              g = n >= 0 && n <= 4294967296;
              break;
            case 6:
              g = n >= -34027999387901484e22 && n <= 34027999387901484e22;
              break;
            case 7:
              g = n >= -17976931348623157e292 && n <= 17976931348623157e292;
              break;
            default:
              g = !1;
          }
          return g;
        },
        getDataTypeSize: function(o) {
          var n = 0;
          switch (o) {
            case 0:
            case 1:
              n = 1;
              break;
            case 2:
            case 3:
              n = 2;
              break;
            case 4:
            case 5:
            case 6:
              n = 4;
              break;
            case 7:
              n = 8;
              break;
            default:
              n = o;
          }
          return n;
        },
        getDataTypeUsed: function(o, n) {
          var g = o;
          switch (o) {
            case 2:
            case 4:
              g = o - n;
              break;
            case 3:
            case 5:
              g = o - 2 * n;
              break;
            case 6:
              n === 0 ? g = o : n === 1 ? g = 2 : g = 1;
              break;
            case 7:
              n === 0 ? g = o : g = o - 2 * n + 1;
              break;
            default:
              g = o;
              break;
          }
          return g;
        },
        getOnePixel: function(o, n, g, B) {
          var l = 0;
          switch (g) {
            case 0:
              l = B.getInt8(n);
              break;
            case 1:
              l = B.getUint8(n);
              break;
            case 2:
              l = B.getInt16(n, !0);
              break;
            case 3:
              l = B.getUint16(n, !0);
              break;
            case 4:
              l = B.getInt32(n, !0);
              break;
            case 5:
              l = B.getUInt32(n, !0);
              break;
            case 6:
              l = B.getFloat32(n, !0);
              break;
            case 7:
              l = B.getFloat64(n, !0);
              break;
            default:
              throw "the decoder does not understand this pixel type";
          }
          return l;
        },
        swapDimensionOrder: function(o, n, g, B, l) {
          var I = 0, d = 0, f = 0, h = 0, u = o;
          if (g > 1)
            if (u = new B(n * g), l)
              for (I = 0; I < n; I++)
                for (h = I, f = 0; f < g; f++, h += n)
                  u[h] = o[d++];
            else
              for (I = 0; I < n; I++)
                for (h = I, f = 0; f < g; f++, h += n)
                  u[d++] = o[h];
          return u;
        }
      }, a = function(o, n, g) {
        this.val = o, this.left = n, this.right = g;
      }, w = {
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
        decode: function(o, n) {
          n = n || {};
          var g = n.noDataValue, B = 0, l = {};
          if (l.ptr = n.inputOffset || 0, l.pixels = {}, !!c.readHeaderInfo(o, l)) {
            var I = l.headerInfo, d = I.fileVersion, f = c.getDataTypeArray(I.imageType);
            if (d > 5)
              throw "unsupported lerc version 2." + d;
            c.readMask(o, l), I.numValidPixel !== I.width * I.height && !l.pixels.resultMask && (l.pixels.resultMask = n.maskData);
            var h = I.width * I.height;
            l.pixels.resultPixels = new f(h * I.numDims), l.counter = {
              onesweep: 0,
              uncompressed: 0,
              lut: 0,
              bitstuffer: 0,
              constant: 0,
              constantoffset: 0
            };
            var u = !n.returnPixelInterleavedDims;
            if (I.numValidPixel !== 0)
              if (I.zMax === I.zMin)
                c.constructConstantSurface(l, u);
              else if (d >= 4 && c.checkMinMaxRanges(o, l))
                c.constructConstantSurface(l, u);
              else {
                var p = new DataView(o, l.ptr, 2), E = p.getUint8(0);
                if (l.ptr++, E)
                  c.readDataOneSweep(o, l, f, u);
                else if (d > 1 && I.imageType <= 1 && Math.abs(I.maxZError - 0.5) < 1e-5) {
                  var D = p.getUint8(1);
                  if (l.ptr++, l.encodeMode = D, D > 2 || d < 4 && D > 1)
                    throw "Invalid Huffman flag " + D;
                  D ? c.readHuffman(o, l, f, u) : c.readTiles(o, l, f, u);
                } else
                  c.readTiles(o, l, f, u);
              }
            l.eofOffset = l.ptr;
            var C;
            n.inputOffset ? (C = l.headerInfo.blobSize + n.inputOffset - l.ptr, Math.abs(C) >= 1 && (l.eofOffset = n.inputOffset + l.headerInfo.blobSize)) : (C = l.headerInfo.blobSize - l.ptr, Math.abs(C) >= 1 && (l.eofOffset = l.headerInfo.blobSize));
            var Q = {
              width: I.width,
              height: I.height,
              pixelData: l.pixels.resultPixels,
              minValue: I.zMin,
              maxValue: I.zMax,
              validPixelCount: I.numValidPixel,
              dimCount: I.numDims,
              dimStats: {
                minValues: I.minValues,
                maxValues: I.maxValues
              },
              maskData: l.pixels.resultMask
              //noDataValue: noDataValue
            };
            if (l.pixels.resultMask && c.isValidPixelValue(I.imageType, g)) {
              var y = l.pixels.resultMask;
              for (B = 0; B < h; B++)
                y[B] || (Q.pixelData[B] = g);
              Q.noDataValue = g;
            }
            return l.noDataValue = g, n.returnFileInfo && (Q.fileInfo = c.formatFileInfo(l)), Q;
          }
        },
        getBandCount: function(o) {
          var n = 0, g = 0, B = {};
          for (B.ptr = 0, B.pixels = {}; g < o.byteLength - 58; )
            c.readHeaderInfo(o, B), g += B.headerInfo.blobSize, n++, B.ptr = g;
          return n;
        }
      };
      return w;
    }(), i = function() {
      var r = new ArrayBuffer(4), c = new Uint8Array(r), a = new Uint32Array(r);
      return a[0] = 1, c[0] === 1;
    }(), s = {
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
      decode: function(r, c) {
        if (!i)
          throw "Big endian system is not supported.";
        c = c || {};
        var a = c.inputOffset || 0, w = new Uint8Array(r, a, 10), o = String.fromCharCode.apply(null, w), n, g;
        if (o.trim() === "CntZImage")
          n = A, g = 1;
        else if (o.substring(0, 5) === "Lerc2")
          n = e, g = 2;
        else
          throw "Unexpected file identifier string: " + o;
        for (var B = 0, l = r.byteLength - 10, I, d = [], f, h, u = {
          width: 0,
          height: 0,
          pixels: [],
          pixelType: c.pixelType,
          mask: null,
          statistics: []
        }, p = 0; a < l; ) {
          var E = n.decode(r, {
            inputOffset: a,
            //for both lerc1 and lerc2
            encodedMaskData: I,
            //lerc1 only
            maskData: h,
            //lerc2 only
            returnMask: B === 0,
            //lerc1 only
            returnEncodedMask: B === 0,
            //lerc1 only
            returnFileInfo: !0,
            //for both lerc1 and lerc2
            returnPixelInterleavedDims: c.returnPixelInterleavedDims,
            //for ndim lerc2 only
            pixelType: c.pixelType || null,
            //lerc1 only
            noDataValue: c.noDataValue || null
            //lerc1 only
          });
          a = E.fileInfo.eofOffset, h = E.maskData, B === 0 && (I = E.encodedMaskData, u.width = E.width, u.height = E.height, u.dimCount = E.dimCount || 1, u.pixelType = E.pixelType || E.fileInfo.pixelType, u.mask = h), g > 1 && (h && d.push(h), E.fileInfo.mask && E.fileInfo.mask.numBytes > 0 && p++), B++, u.pixels.push(E.pixelData), u.statistics.push({
            minValue: E.minValue,
            maxValue: E.maxValue,
            noDataValue: E.noDataValue,
            dimStats: E.dimStats
          });
        }
        var D, C, Q;
        if (g > 1 && p > 1) {
          for (Q = u.width * u.height, u.bandMasks = d, h = new Uint8Array(Q), h.set(d[0]), D = 1; D < d.length; D++)
            for (f = d[D], C = 0; C < Q; C++)
              h[C] = h[C] & f[C];
          u.maskData = h;
        }
        return u;
      }
    };
    t.exports ? t.exports = s : this.Lerc = s;
  })();
})(Vi);
var Zs = Vi.exports;
const Ws = /* @__PURE__ */ tt(Zs);
let PA, DA, Xe;
const _e = {
  env: {
    emscripten_notify_memory_growth: function(t) {
      Xe = new Uint8Array(DA.exports.memory.buffer);
    }
  }
};
class $s {
  init() {
    return PA || (typeof fetch < "u" ? PA = fetch("data:application/wasm;base64," + ri).then((A) => A.arrayBuffer()).then((A) => WebAssembly.instantiate(A, _e)).then(this._init) : PA = WebAssembly.instantiate(Buffer.from(ri, "base64"), _e).then(this._init), PA);
  }
  _init(A) {
    DA = A.instance, _e.env.emscripten_notify_memory_growth(0);
  }
  decode(A, e = 0) {
    if (!DA) throw new Error("ZSTDDecoder: Await .init() before decoding.");
    const i = A.byteLength, s = DA.exports.malloc(i);
    Xe.set(A, s), e = e || Number(DA.exports.ZSTD_findDecompressedSize(s, i));
    const r = DA.exports.malloc(e), c = DA.exports.ZSTD_decompress(r, e, s, i), a = Xe.slice(r, r + c);
    return DA.exports.free(s), DA.exports.free(r), a;
  }
}
const ri = "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IAMNACAEQQNxBEADQCACRQ0FIAAgAkF/aiICaiIDIAEgAmotAAA6AAAgA0EDcQ0ACwsgAkEDTQ0AA0AgACACQXxqIgJqIAEgAmooAgA2AgAgAkEDSw0ACwsgAkUNAgNAIAAgAkF/aiICaiABIAJqLQAAOgAAIAINAAsMAgsgAkEDTQ0AIAIhBANAIAMgASgCADYCACABQQRqIQEgA0EEaiEDIARBfGoiBEEDSw0ACyACQQNxIQILIAJFDQADQCADIAEtAAA6AAAgA0EBaiEDIAFBAWohASACQX9qIgINAAsLIAAL8wICAn8BfgJAIAJFDQAgACACaiIDQX9qIAE6AAAgACABOgAAIAJBA0kNACADQX5qIAE6AAAgACABOgABIANBfWogAToAACAAIAE6AAIgAkEHSQ0AIANBfGogAToAACAAIAE6AAMgAkEJSQ0AIABBACAAa0EDcSIEaiIDIAFB/wFxQYGChAhsIgE2AgAgAyACIARrQXxxIgRqIgJBfGogATYCACAEQQlJDQAgAyABNgIIIAMgATYCBCACQXhqIAE2AgAgAkF0aiABNgIAIARBGUkNACADIAE2AhggAyABNgIUIAMgATYCECADIAE2AgwgAkFwaiABNgIAIAJBbGogATYCACACQWhqIAE2AgAgAkFkaiABNgIAIAQgA0EEcUEYciIEayICQSBJDQAgAa0iBUIghiAFhCEFIAMgBGohAQNAIAEgBTcDGCABIAU3AxAgASAFNwMIIAEgBTcDACABQSBqIQEgAkFgaiICQR9LDQALCyAACy8BAn8gACgCBCAAKAIAQQJ0aiICLQACIQMgACACLwEAIAEgAi0AAxAIajYCACADCy8BAn8gACgCBCAAKAIAQQJ0aiICLQACIQMgACACLwEAIAEgAi0AAxAFajYCACADCx8AIAAgASACKAIEEAg2AgAgARAEGiAAIAJBCGo2AgQLCAAgAGdBH3MLugUBDX8jAEEQayIKJAACfyAEQQNNBEAgCkEANgIMIApBDGogAyAEEAsaIAAgASACIApBDGpBBBAVIgBBbCAAEAMbIAAgACAESxsMAQsgAEEAIAEoAgBBAXRBAmoQECENQVQgAygAACIGQQ9xIgBBCksNABogAiAAQQVqNgIAIAMgBGoiAkF8aiEMIAJBeWohDiACQXtqIRAgAEEGaiELQQQh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ASIDNgLE4AEgACgCvOABIQQgACABNgK84AEgACABIAJqNgK44AEgACABIAQgA2tqNgLA4AELpgEBAX8gACAAKALs4QEQFjYCyOABIABCADcD+OABIABCADcDuOABIABBwOABakIANwMAIABBqNAAaiIBQYyAgOAANgIAIABBADYCmOIBIABCADcDiOEBIABCAzcDgOEBIABBrNABakHgEikCADcCACAAQbTQAWpB6BIoAgA2AgAgACABNgIMIAAgAEGYIGo2AgggACAAQaAwajYCBCAAIABBEGo2AgALYQEBf0G4fyEDAkAgAUEDSQ0AIAIgABAhIgFBA3YiADYCCCACIAFBAXE2AgQgAiABQQF2QQNxIgM2AgACQCADQX9qIgFBAksNAAJAIAFBAWsOAgEAAgtBbA8LIAAhAwsgAwsMACAAIAEgAkEAEC4LiAQCA38CfiADEBYhBCAAQQBBKBAQIQAgBCACSwRAIAQPCyABRQRAQX8PCwJAAkAgA0EBRg0AIAEoAAAiBkGo6r5pRg0AQXYhAyAGQXBxQdDUtMIBRw0BQQghAyACQQhJDQEgAEEAQSgQECEAIAEoAAQhASAAQQE2AhQgACABrTcDAEEADwsgASACIAMQLyIDIAJLDQAgACADNgIYQXIhAyABIARqIgVBf2otAAAiAkEIcQ0AIAJBIHEiBkUEQEFwIQMgBS0AACIFQacBSw0BIAVBB3GtQgEgBUEDdkEKaq2GIgdCA4h+IAd8IQggBEEBaiEECyACQQZ2IQMgAkECdiEFAkAgAkEDcUF/aiICQQJLBEBBACECDAELAkACQAJAIAJBAWsOAgECAAsgASAEai0AACECIARBAWohBAwCCyABIARqLwAAIQIgBEECaiEEDAELIAEgBGooAAAhAiAEQQRqIQQLIAVBAXEhBQJ+AkACQAJAIANBf2oiA0ECTQRAIANBAWsOAgIDAQtCfyAGRQ0DGiABIARqMQAADAMLIAEgBGovAACtQoACfAwCCyABIARqKAAArQwBCyABIARqKQAACyEHIAAgBTYCICAAIAI2AhwgACAHNwMAQQAhAyAAQQA2AhQgACAHIAggBhsiBzcDCCAAIAdCgIAIIAdCgIAIVBs+AhALIAMLWwEBf0G4fyEDIAIQFiICIAFNBH8gACACakF/ai0AACIAQQNxQQJ0QaAeaigC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C0Egak8NAQsgByAHKQNoNwMQIAcgBykDYDcDCCAEIA0gB0EIaiAHQdwAaiAPIA4gESAQEB4hCwwBCyACIARqIQggBCAKEAcgAkERTwRAIARBEGohAgNAIAIgCkEQaiIKEAcgAkEQaiICIAhJDQALCyAIIAlrIQIgByATNgJcIAkgCCAOa0sEQCAJIAggEWtLBEBBbCELDAILIBAgAiAOayICaiIKIANqIBBNBEAgCCAKIAMQDxoMAgsgCCAKQQAgAmsQDyEIIAcgAiADaiIDNgJkIAggAmshCCAOIQILIAlBEE8EQCADIAhqIQMDQCAIIAIQByACQRBqIQIgCEEQaiIIIANJDQALDAELAkAgCUEHTQRAIAggAi0AADoAACAIIAItAAE6AAEgCCACLQACOgACIAggAi0AAzoAAyAIQQRqIAIgCUECdCIDQcAeaigCAGoiAhAXIAIgA0HgHmooAgBrIQIgBygCZCEDDAELIAggAhAMCyADQQlJDQAgAyAIaiEDIAhBCGoiCCACQQhqIgJrQQ9MBEADQCAIIAIQDCACQQhqIQIgCEEIaiIIIANJDQAMAgALAAsDQCAIIAIQByACQRBqIQIgCEEQaiIIIANJDQALCyAHQRhqEAQaIAsgDCALEAMiAhshDCAEIAQgC2ogAhshBCAFQX9qIgUNAAsgDBADDQFBbCEMIAdBGGoQBEECSQ0BQQAhCANAIAhBA0cEQCAAIAhBAnQiAmpBrNABaiACIAdqKAJENgIAIAhBAWohCAwBCwsgBygCXCEIC0G6fyEMIA8gCGsiACANIARrSw0AIAQEfyAEIAggABALIABqBUEACyABayEMCyAHQfAAaiQAIAwLkRcCFn8FfiMAQdABayIHJAAgByAAKALw4QEiCDYCvAEgASACaiESIAggACgCgOIBaiETAkACQCAFRQRAIAEhAwwBCyAAKALE4AEhESAAKALA4AEhFSAAKAK84AEhDyAAQQE2AozhAUEAIQgDQCAIQQNHBEAgByAIQQJ0IgJqIAAgAmpBrNABaigCADYCVCAIQQFqIQgMAQsLIAcgETYCZCAHIA82AmAgByABIA9rNgJoQWwhECAHQShqIAMgBBAGEAMNASAFQQQgBUEESBshFyAHQTxqIAdBKGogACgCABATIAdBxABqIAdBKGogACgCCBATIAdBzABqIAdB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IAdB0AFqJAAgEAslACAAQgA3AgAgAEEAOwEIIABBADoACyAAIAE2AgwgACACOgAKC7QFAQN/IwBBMGsiBCQAIABB/wFqIgVBfWohBgJAIAMvAQIEQCAEQRhqIAEgAhAGIgIQAw0BIARBEGogBEEYaiADEBwgBEEIaiAEQRhqIAMQHCAAIQMDQAJAIARBGGoQBCADIAZPckUEQCADIARBEGogBEEYahASOgAAIAMgBEEIaiAEQRhqEBI6AAEgBEEYahAERQ0BIANBAmohAwsgBUF+aiEFAn8DQEG6fyECIAMiASAFSw0FIAEgBEEQaiAEQRhqEBI6AAAgAUEBaiEDIARBGGoQBEEDRgRAQQIhAiAEQQhqDAILIAMgBUsNBSABIARBCGogBEEYahASOgABIAFBAmohA0EDIQIgBEEYahAEQQNHDQALIARBEGoLIQUgAyAFIARBGGoQEjoAACABIAJqIABrIQIMAwsgAyAEQRBqIARBGGoQEjoAAiADIARBCGogBEEYahASOgADIANBBGohAwwAAAsACyAEQRhqIAEgAhAGIgIQAw0AIARBEGogBEEYaiADEBwgBEEIaiAEQRhqIAMQHCAAIQMDQAJAIARBGGoQBCADIAZPckUEQCADIARBEGogBEEYahAROgAAIAMgBEEIaiAEQRhqEBE6AAEgBEEYahAERQ0BIANBAmohAwsgBUF+aiEFAn8DQEG6fyECIAMiASAFSw0EIAEgBEEQaiAEQRhqEBE6AAAgAUEBaiEDIARBGGoQBEEDRgRAQQIhAiAEQQhqDAILIAMgBUsNBCABIARBCGogBEEYahAROgABIAFBAmohA0EDIQIgBEEYahAEQQNHDQALIARBEGoLIQUgAyAFIARBGGoQEToAACABIAJqIABrIQIMAgsgAyAEQRBqIARBGGoQEToAAiADIARBCGogBEEYahAROgADIANBBGohAwwAAAsACyAEQTBqJAAgAgtpAQF/An8CQAJAIAJBB00NACABKAAAQbfIwuF+Rw0AIAAgASgABDYCmOIBQWIgAEEQaiABIAIQPiIDEAMNAhogAEKBgICAEDcDiOEBIAAgASADaiACIANrECoMAQsgACABIAIQKgtBAAsLrQMBBn8jAEGAAWsiAyQAQWIhCAJAIAJBCUkNACAAQZjQAGogAUEIaiIEIAJBeGogAEGY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wOABCwutAgIEfwF+IwBBQGoiBCQAAkACQCACQQhJDQAgASgAAEFwcUHQ1LTCAUcNACABIAIQIiEBIABCADcDCCAAQQA2AgQgACABNgIADAELIARBGGogASACEC0iAxADBEAgACADEBoMAQsgAwRAIABBuH8QGgwBCyACIAQoAjAiA2shAiABIANqIQMDQAJAIAAgAyACIARBCGoQLCIFEAMEfyAFBSACIAVBA2oiBU8NAUG4fwsQGgwCCyAGQQFqIQYgAiAFayECIAMgBWohAyAEKAIMRQ0ACyAEKAI4BEAgAkEDTQRAIABBuH8QGgwCCyADQQRqIQMLIAQoAighAiAEKQMYIQcgAEEANgIEIAAgAyABazYCACAAIAIgBmytIAcgB0J/URs3AwgLIARBQGskAAslAQF/IwBBEGsiAiQAIAIgACABEFEgAigCACEAIAJBEGokACAAC30BBH8jAEGQBGsiBCQAIARB/wE2AggCQCAEQRBqIARBCGogBEEMaiABIAIQFSIGEAMEQCAGIQUMAQtBVCEFIAQoAgwiB0EGSw0AIAMgBEEQaiAEKAIIIAcQQSIFEAMNACAAIAEgBmogAiAGayADEDwhBQsgBEGQBGokACAFC4cBAgJ/An5BABAWIQMCQANAIAEgA08EQAJAIAAoAABBcHFB0NS0wgFGBEAgACABECIiAhADRQ0BQn4PCyAAIAEQVSIEQn1WDQMgBCAFfCIFIARUIQJCfiEEIAINAyAAIAEQUiICEAMNAwsgASACayEBIAAgAmohAAwBCwtCfiAFIAEbIQQLIAQLPwIBfwF+IwBBMGsiAiQAAn5CfiACQQhqIAAgARAtDQAaQgAgAigCHEEBRg0AGiACKQMICyEDIAJBMGokACADC40BAQJ/IwBBMGsiASQAAkAgAEUNACAAKAKI4gENACABIABB/OEBaigCADYCKCABIAApAvThATcDICAAEDAgACgCqOIBIQIgASABKAIoNgIYIAEgASkDIDcDECACIAFBEGoQGyAAQQA2AqjiASABIAEoAig2AgggASABKQMgNwMAIAAgARAbCyABQTBqJAALKgECfyMAQRBrIgAkACAAQQA2AgggAEIANwMAIAAQWCEBIABBEGokACABC4cBAQN/IwBBEGsiAiQAAkAgACgCAEUgACgCBEVzDQAgAiAAKAIINgIIIAIgACkCADcDAAJ/IAIoAgAiAQRAIAIoAghBqOMJIAERBQAMAQtBqOMJECgLIgFFDQAgASAAKQIANwL04QEgAUH84QFqIAAoAgg2AgAgARBZIAEhAwsgAkEQaiQAIAMLywEBAn8jAEEgayIBJAAgAEGBgIDAADYCtOIBIABBADYCiOIBIABBADYC7OEBIABCADcDkOIBIABBADYCpOMJIABBADYC3OIBIABCADcCzOIBIABBADYCvOIBIABBADYCxOABIABCADcCnOIBIABBpOIBakIANwIAIABBrOIBakEANgIAIAFCADcCECABQgA3AhggASABKQMYNwMIIAEgASkDEDcDACABKAIIQQh2QQFxIQIgAEEANgLg4gEgACACNgKM4gEgAUEgaiQAC3YBA38jAEEwayIBJAAgAARAIAEgAEHE0AFqIgIoAgA2AiggASAAKQK80AE3AyAgACgCACEDIAEgAigCADYCGCABIAApArzQATcDECADIAFBEGoQGyABIAEoAig2AgggASABKQMgNwMAIAAgARAbCyABQTBqJAALzAEBAX8gACABKAK00AE2ApjiASAAIAEoAgQiAjYCwOABIAAgAjYCvOABIAAgAiABKAIIaiICNgK44AEgACACNgLE4AEgASgCuNABBEAgAEKBgICAEDcDiOEBIAAgAUGk0ABqNgIMIAAgAUGUIGo2AgggACABQZwwajYCBCAAIAFBDGo2AgAgAEGs0AFqIAFBqNABaigCADYCACAAQbDQAWogAUGs0AFqKAIANgIAIABBtNABaiABQbDQAWooAgA2AgAPCyAAQgA3A4jhAQs7ACACRQRAQbp/DwsgBEUEQEFsDwsgAiAEEGAEQCAAIAEgAiADIAQgBRBhDwsgACABIAIgAyAEIAUQZQtGAQF/IwBBEGsiBSQAIAVBCGogBBAOAn8gBS0ACQRAIAAgASACIAMgBBAyDAELIAAgASACIAMgBBA0CyEAIAVBEGokACAACzQAIAAgAyAEIAUQNiIFEAMEQCAFDwsgBSAESQR/IAEgAiADIAVqIAQgBWsgABA1BUG4fwsLRgEBfyMAQRBrIgUkACAFQQhqIAQQDgJ/IAUtAAkEQCAAIAEgAiADIAQQYgwBCyAAIAEgAiADIAQQNQshACAFQRBqJAAgAAtZAQF/QQ8hAiABIABJBEAgAUEE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", ji = new $s();
class Aa extends GA {
  constructor(A) {
    super(), this.planarConfiguration = typeof A.PlanarConfiguration < "u" ? A.PlanarConfiguration : 1, this.samplesPerPixel = typeof A.SamplesPerPixel < "u" ? A.SamplesPerPixel : 1, this.addCompression = A.LercParameters[yr.AddCompression];
  }
  decodeBlock(A) {
    switch (this.addCompression) {
      case Se.None:
        break;
      case Se.Deflate:
        A = Pi(new Uint8Array(A)).buffer;
        break;
      case Se.Zstandard:
        A = ji.decode(new Uint8Array(A)).buffer;
        break;
      default:
        throw new Error(`Unsupported LERC additional compression method identifier: ${this.addCompression}`);
    }
    return Ws.decode(A, { returnPixelInterleavedDims: this.planarConfiguration === 1 }).pixels[0].buffer;
  }
}
const ea = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Aa,
  zstd: ji
}, Symbol.toStringTag, { value: "Module" }));
class ta extends GA {
  constructor() {
    if (super(), typeof createImageBitmap > "u")
      throw new Error("Cannot decode WebImage as `createImageBitmap` is not available");
    if (typeof document > "u" && typeof OffscreenCanvas > "u")
      throw new Error("Cannot decode WebImage as neither `document` nor `OffscreenCanvas` is not available");
  }
  async decode(A, e) {
    const i = new Blob([e]), s = await createImageBitmap(i);
    let r;
    typeof document < "u" ? (r = document.createElement("canvas"), r.width = s.width, r.height = s.height) : r = new OffscreenCanvas(s.width, s.height);
    const c = r.getContext("2d");
    return c.drawImage(s, 0, 0), c.getImageData(0, 0, s.width, s.height).data.buffer;
  }
}
const ia = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ta
}, Symbol.toStringTag, { value: "Module" }));
export {
  kn as Compass,
  Mn as EarthMaskMaterial,
  Gn as FakeEarth,
  Ia as GLViewer,
  vn as MapFog,
  ca as SingleImageSource,
  no as TifDEMLoder,
  fa as TifDemSource,
  aa as createCompass,
  la as createFog,
  ga as createFrakEarth,
  Ca as getAttributions,
  ha as getLocalFromMouse,
  Ea as limitCameraHeight,
  Ba as mapSource
};
