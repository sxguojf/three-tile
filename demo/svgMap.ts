import {
	AdditiveBlending,
	BackSide,
	DecrementWrapStencilOp,
	ExtrudeGeometry,
	FrontSide,
	IncrementWrapStencilOp,
	Mesh,
	MeshBasicMaterial,
	NotEqualStencilFunc,
	Shape,
	Vector2,
	ZeroStencilOp,
} from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import * as tt from "../src";

function getGroundMaterials() {
	const backMat = new MeshBasicMaterial({
		side: BackSide,
		transparent: true,
		depthWrite: false,
		colorWrite: false,
		stencilWrite: true,
		// stencilRef: 0,
		// stencilFunc: AlwaysStencilFunc,
		// stencilFail: KeepStencilOp,
		// stencilZPass: KeepStencilOp,
		stencilZFail: IncrementWrapStencilOp, // 背面深度测试失败+1
	});

	const frontMat = new MeshBasicMaterial({
		side: FrontSide,
		transparent: true,
		depthWrite: false,
		colorWrite: false,
		stencilWrite: true,
		// stencilRef: 0,
		// stencilFunc: AlwaysStencilFunc,
		// stencilFail: KeepStencilOp,
		// stencilZPass: KeepStencilOp,
		stencilZFail: DecrementWrapStencilOp, // 正面深度测试失败-1
	});

	const surfaceMat = new MeshBasicMaterial({
		// map: new TextureLoader().load("./image/test.jpg"),
		color: 0xffff00,
		opacity: 0.2,
		transparent: true,
		side: BackSide,
		depthTest: false,
		// depthFunc: GreaterDepth,
		stencilWrite: true,
		stencilRef: 0,
		stencilFunc: NotEqualStencilFunc,
		stencilFail: ZeroStencilOp,
		stencilZFail: ZeroStencilOp,
		stencilZPass: ZeroStencilOp,
		// stencilFail: KeepStencilOp,
		// stencilZFail: KeepStencilOp,
		// stencilZPass: IncrementWrapStencilOp,
		blending: AdditiveBlending,
		fog: false,
	});
	return { backMat, frontMat, surfaceMat };
}

// function getGroundLine(points: Vector2[], width: number = 0.5) {
// 	const shape = new Shape([
// 		new Vector2(0, 0), //多边形起点
// 		new Vector2(0, width),
// 		new Vector2(0, width),
// 		new Vector2(10, 0),
// 	]);

// 	const p3 = points.map((p) => new Vector3(p.x, p.y, 0));
// 	const line = new CatmullRomCurve3(p3);

// 	// 根据路径挤出几何体
// 	const geometry = new ExtrudeGeometry(shape, {
// 		extrudePath: line,
// 		steps: points.length * 5,
// 		bevelEnabled: false,
// 	});
// 	return geometry;
// }

function getGroundPoly(points: Vector2[]) {
	const line = new Shape(points);
	// 根据路径挤出几何体
	const geometry = new ExtrudeGeometry(line, {
		steps: points.length * 2,
		bevelEnabled: false,
		depth: 1,
	});
	return geometry;
}

export function loadSvg(url: string, map: tt.TileMap) {
	const loader = new SVGLoader();

	loader.load(url, function (data) {
		const pp = data.paths[0];
		const geometry = getGroundPoly(pp.subPaths[0].getPoints());
		geometry.rotateX(Math.PI);
		geometry.scale(2.43, 2.43, 10);
		geometry.translate(690, 5200, 9);

		const { backMat, frontMat, surfaceMat } = getGroundMaterials();

		// 创建网格并添加到场景中
		const wall1 = new Mesh(geometry, backMat);
		wall1.renderOrder = 10;
		const wall2 = new Mesh(geometry, frontMat);
		wall2.renderOrder = 11;
		const wall3 = new Mesh(geometry, surfaceMat);
		wall3.renderOrder = 12;
		map.add(wall1, wall2, wall3);

		// const mat = new MeshLambertMaterial({
		// 	color: 0x00ff00,
		// 	transparent: true,
		// 	opacity: 0.5,
		// });
		// const mesh = new Mesh(geometry, mat);
		// mesh.renderOrder = 13;
		// map.add(mesh);
	});
}
