import { BufferAttribute, Float32BufferAttribute, PlaneGeometry, TypedArray } from "three";
import { decode, DecodedData } from "./quantized-mesh-decoder";

/**
 * Geomety from rules grid DEM, it has gap between tiles
 */

// let meshData: DecodedData;
export class TileQmGeometry extends PlaneGeometry {
	protected build(meshData: DecodedData) {
		this.dispose();

		// 设置顶点位置
		if (meshData.vertexData) {
			const positionAttribute = constructPositionAttribute(meshData);
			if (positionAttribute) {
				this.setAttribute("position", positionAttribute);
				const uvAttribute = constructUvAttribute(positionAttribute.array);
				this.setAttribute("uv", uvAttribute);
			}
		}

		// 设置索引
		if (meshData.triangleIndices) {
			this.setIndex(new BufferAttribute(meshData.triangleIndices, 1));
		}
	}

	public setData(data: ArrayBuffer) {
		// if (!meshData) {
		const meshData = decode(data);
		// console.log("raw", new Uint16Array(data));
		console.log("idx", meshData.triangleIndices);
		// }
		if (!meshData.vertexData || !meshData.triangleIndices) {
			return;
		}
		this.build(meshData);
		this.computeBoundingBox();
		this.computeBoundingSphere();
		this.computeVertexNormals();
		return this;
	}
}

function constructPositionAttribute(data: DecodedData) {
	const vertexData = data.vertexData;
	if (vertexData) {
		const vertexCount = vertexData.length / 3;
		const positionAttributeArray = new Float32Array(vertexData.length);
		const scale = 1 / 32767;
		for (let i = 0; i < vertexData.length / 3; i++) {
			positionAttributeArray[i * 3] = vertexData[i] * scale - 0.5;
			positionAttributeArray[i * 3 + 1] = vertexData[i + vertexCount] * scale - 0.5;
			positionAttributeArray[i * 3 + 2] =
				(data.header.minHeight + vertexData[i + vertexCount * 2] * scale) / 1000;
		}

		return new Float32BufferAttribute(positionAttributeArray, 3);
	} else {
		return;
	}
}

function constructUvAttribute(verticesArray: TypedArray) {
	const uvArray = new Float32Array((verticesArray.length / 3) * 2);
	for (let i = 0, uvIndex = 0; i < verticesArray.length; i++) {
		switch (i % 3) {
			case 0: {
				uvArray[uvIndex] = verticesArray[i] + 0.5;
				uvIndex++;
				break;
			}
			case 1: {
				uvArray[uvIndex] = verticesArray[i] + 0.5;
				uvIndex++;
			}
		}
	}

	return new BufferAttribute(uvArray, 2);
}
