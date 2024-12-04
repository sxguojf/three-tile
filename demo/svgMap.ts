import {
	AdditiveBlending,
	BackSide,
	CatmullRomCurve3,
	DecrementWrapStencilOp,
	DoubleSide,
	ExtrudeGeometry,
	FrontSide,
	Group,
	IncrementWrapStencilOp,
	Mesh,
	MeshBasicMaterial,
	NotEqualStencilFunc,
	Shape,
	Vector2,
	Vector3,
	ZeroStencilOp,
} from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import * as tt from "../src";

const groundMaterials = {
	backMat: new MeshBasicMaterial({
		side: BackSide,
		transparent: true,
		depthWrite: false,
		colorWrite: false,
		stencilWrite: true,
		stencilZFail: IncrementWrapStencilOp, // 背面深度测试失败+1
		fog: false,
	}),

	frontMat: new MeshBasicMaterial({
		side: FrontSide,
		transparent: true,
		depthWrite: false,
		colorWrite: false,
		stencilWrite: true,
		stencilZFail: DecrementWrapStencilOp, // 正面深度测试失败-1
		fog: false,
	}),

	surfaceMat: new MeshBasicMaterial({
		color: 0xffff00,
		opacity: 0.2,
		transparent: true,
		side: DoubleSide,
		depthTest: false,
		// depthFunc: GreaterDepth,
		stencilWrite: true,
		stencilRef: 0,
		stencilFunc: NotEqualStencilFunc,
		stencilFail: ZeroStencilOp,
		stencilZFail: ZeroStencilOp,
		stencilZPass: ZeroStencilOp,
		blending: AdditiveBlending,
		fog: false,
	}),
};

function createGroundLineGeometry(points: Vector2[], width: number = 0.5) {
	const shape = new Shape([new Vector2(0, 0), new Vector2(0, width), new Vector2(10, width), new Vector2(10, 0)]);

	const p3 = points.map((p) => new Vector3(p.x, p.y, 0));
	const line = new CatmullRomCurve3(p3, true);

	// 根据路径挤出几何体
	const geometry = new ExtrudeGeometry(shape, {
		extrudePath: line,
		steps: points.length,
		bevelEnabled: false,
	});

	return geometry;
}

function createGroundLineMesh(lonlat: Vector2[]) {
	const geometry = createGroundLineGeometry(lonlat);
	geometry.rotateX(Math.PI);
	geometry.scale(2.43, 2.43, 1);
	geometry.translate(690, 5200, -1);

	const { backMat, frontMat, surfaceMat } = groundMaterials;

	const smat = surfaceMat.clone();
	smat.color.set(0xff0000);
	smat.opacity = 0.8;

	// 创建网格并添加到场景中
	const backMesh = new Mesh(geometry, backMat);
	backMesh.renderOrder = 10;
	const frontMesh = new Mesh(geometry, frontMat);
	frontMesh.renderOrder = 11;
	const surfaceMesh = new Mesh(geometry, smat);
	surfaceMesh.renderOrder = 12;
	const group = new Group();
	group.add(backMesh, frontMesh, surfaceMesh);
	return group;
}

function createGroundPolyGeometry(points: Vector2[]) {
	const line = new Shape(points);
	// 根据路径挤出几何体
	const geometry = new ExtrudeGeometry(line, {
		steps: points.length * 2,
		bevelEnabled: false,
		depth: 10,
	});
	return geometry;
}

function createGroundPolyMesh(lonlat: Vector2[]) {
	const geometry = createGroundPolyGeometry(lonlat);
	geometry.rotateX(Math.PI);
	geometry.scale(2.43, 2.43, 1);
	geometry.translate(690, 5200, 9);

	const { backMat, frontMat, surfaceMat } = groundMaterials;

	const backMesh = new Mesh(geometry, backMat);
	backMesh.renderOrder = 10;
	const frontMesh = new Mesh(geometry, frontMat);
	frontMesh.renderOrder = 11;
	const surfaceMesh = new Mesh(geometry, surfaceMat);
	surfaceMesh.renderOrder = 12;
	const group = new Group();
	group.add(backMesh, frontMesh, surfaceMesh);
	// geometry.addGroup(0, Infinity, 0);
	// geometry.addGroup(0, Infinity, 1);
	// geometry.addGroup(0, Infinity, 2);
	// const group = new Mesh(geometry, [backMat, frontMat, surfaceMat]);
	return group;
	// return [backMesh, frontMesh, surfaceMesh];
}

export function loadSvg(url: string, map: tt.TileMap) {
	const loader = new SVGLoader();

	loader.load(url, function (data) {
		const points = data.paths[0].subPaths[0].getPoints();
		// const path = points.map((p) => new Vector2(p.x * 2.43 + 690, p.y * 2.43 - 5200));
		//const path = points.map((p) => new Vector2(p.x, p.y));
		const polyMesh = createGroundPolyMesh(points);
		const lineMesh = createGroundLineMesh(points);

		polyMesh.renderOrder = 13;
		lineMesh.renderOrder = 14;
		map.add(polyMesh);

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
