import { BufferAttribute, Float16BufferAttribute, Float32BufferAttribute, PlaneGeometry } from "three";
import { decode, DecodedData } from "./quantized-mesh-decoder";

/**
 * Geomety from rules grid DEM, it has gap between tiles
 */

export class TileQmGeometry extends PlaneGeometry {
	protected build(meshData: DecodedData) {
		this.dispose();

		// 设置顶点位置
		if (meshData.vertexData) {
			let len = Math.floor(meshData.vertexData.length / 3);
			const vertices = new Float32Array(len * 3);
			for (let i = 0; i < len; i += 3) {
				vertices[i] = changeRange(meshData.vertexData[i]) - 0.5;
				vertices[i + 1] = changeRange(meshData.vertexData[i + 1]) - 0.5;
				vertices[i + 2] = changeRange(meshData.vertexData[i + 2] + meshData.header.minHeight) / 1000;
			}

			// for (let i = 0; i < len; i++) {
			// 	if (isNaN(vertices[i])) {
			// 		debugger;
			// 	}
			// }

			// len = len / 3;
			const uvs = new Float32Array(len * 2);
			for (let i = 0; i < len; i++) {
				uvs[i * 2] = vertices[i * 3] + 0.5;
				uvs[i * 2 + 1] = vertices[i * 3 + 1] + 0.5;
			}
			this.setAttribute("position", new Float32BufferAttribute(vertices, 3));
			this.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
		}

		// 设置索引
		if (meshData.triangleIndices) {
			// let highest = 0;
			// const indices = meshData.triangleIndices;
			// for (var i = 0; i < indices.length; ++i) {
			// 	var code = indices[i];
			// 	indices[i] = highest - code;
			// 	if (code === 0) {
			// 		++highest;
			// 	}
			// }

			// if (!indices) {
			// indices = new Float32Array(meshData.triangleIndices);
			// }
			this.setIndex(new BufferAttribute(meshData.triangleIndices, 1));
		}
	}

	public setData(data: ArrayBuffer) {
		Object.freeze(data);
		const meshData = decode(data);
		// Object.freeze(meshData.vertexData);
		// Object.freeze(meshData.triangleIndices);

		// Object.freeze(meshData);
		if (!meshData.vertexData || !meshData.triangleIndices) {
			return;
		}
		this.build(meshData);
		// const vertices = this.attributes.position;
		// for (let i = 0; i < vertices.count; i++) {
		// 	if (isNaN(vertices.getX(i)) || isNaN(vertices.getY(i)) || isNaN(vertices.getZ(i))) {
		// 		debugger;
		// 	}
		// }

		this.computeBoundingBox();
		this.computeBoundingSphere();
		this.computeVertexNormals();
		return this;
	}
}

function changeRange(value: number) {
	const OLD_MIN = 0;
	const OLD_MAX = 32767;
	const NEW_MIN = 0;
	const NEW_MAX = 1;
	const result = ((value - OLD_MIN) * (NEW_MAX - NEW_MIN)) / (OLD_MAX - OLD_MIN) + NEW_MIN;
	return value / 32767;
}
