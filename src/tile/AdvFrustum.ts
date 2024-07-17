// https://github.com/mrdoob/three.js/issues/27756
// custom Frustum class

import { Frustum, Matrix3, Matrix4, Plane, Vector3 } from "three";

const _mat3 = new Matrix3();
const _constants = new Vector3();

export class AdvFrustum extends Frustum {
	public mPoints: Vector3[];

	constructor() {
		super();
		this.mPoints = new Array(8).fill(1).map(() => new Vector3());
	}

	public setFromProjectionMatrix(m: Matrix4): this {
		// super.setFromProjectionMatrix(m, coordinateSystem);
		super.setFromProjectionMatrix(m);
		this.calculateFrustumPoints();
		return this;
	}

	// setFromProjectionMatrix(m, coordinateSystem) {
	// 	super.setFromProjectionMatrix(m, coordinateSystem);
	// 	this.calculateFrustumPoints();
	//     return this;
	// }

	calculateFrustumPoints() {
		const planeIntersections = [
			[this.planes[0], this.planes[3], this.planes[4]], // Near top left
			[this.planes[1], this.planes[3], this.planes[4]], // Near top right
			[this.planes[0], this.planes[2], this.planes[4]], // Near bottom left
			[this.planes[1], this.planes[2], this.planes[4]], // Near bottom right
			[this.planes[0], this.planes[3], this.planes[5]], // Far top left
			[this.planes[1], this.planes[3], this.planes[5]], // Far top right
			[this.planes[0], this.planes[2], this.planes[5]], // Far bottom left
			[this.planes[1], this.planes[2], this.planes[5]], // Far bottom right
		];

		planeIntersections.forEach((planes, index) => {
			this.mPoints[index].fromArray(this.findIntersectionPointThree(planes[0], planes[1], planes[2]));
		});
	}

	findIntersectionPointThree(plane1: Plane, plane2: Plane, plane3: Plane) {
		// Create the matrix A using the normals of the planes
		const A = _mat3.set(
			plane1.normal.x,
			plane1.normal.y,
			plane1.normal.z,
			plane2.normal.x,
			plane2.normal.y,
			plane2.normal.z,
			plane3.normal.x,
			plane3.normal.y,
			plane3.normal.z,
		);

		// Create the vector B using the constants of the planes
		const B = _constants.set(-plane1.constant, -plane2.constant, -plane3.constant);

		// Solve for X by applying the inverse matrix to B
		const X = B.applyMatrix3(A.invert());

		return [X.x, X.y, X.z];
	}

	boxInFrustum(box: { max: Vector3; min: Vector3 }) {
		let out;
		out = 0;
		for (let i = 0; i < 8; i++) out += this.mPoints[i].x > box.max.x ? 1 : 0;
		if (out == 8) return false;
		out = 0;
		for (let i = 0; i < 8; i++) out += this.mPoints[i].x < box.min.x ? 1 : 0;
		if (out == 8) return false;
		out = 0;
		for (let i = 0; i < 8; i++) out += this.mPoints[i].y > box.max.y ? 1 : 0;
		if (out == 8) return false;
		out = 0;
		for (let i = 0; i < 8; i++) out += this.mPoints[i].y < box.min.y ? 1 : 0;
		if (out == 8) return false;
		out = 0;
		for (let i = 0; i < 8; i++) out += this.mPoints[i].z > box.max.z ? 1 : 0;
		if (out == 8) return false;
		out = 0;
		for (let i = 0; i < 8; i++) out += this.mPoints[i].z < box.min.z ? 1 : 0;
		if (out == 8) return false;

		return true;
	}
}
