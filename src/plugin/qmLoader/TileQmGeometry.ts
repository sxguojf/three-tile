import { BufferAttribute, PlaneGeometry } from "three";
import decode, { DecodeResult } from "./qm-decoder";

/**
 * Geomety from rules grid DEM, it has gap between tiles
 */

// let meshData: DecodeResult;
export class TileQmGeometry extends PlaneGeometry {
	protected build(meshData: DecodeResult) {
		this.dispose();

		// 设置顶点位置
		if (meshData.vertexData) {
			const attributes = getMeshAttributes(meshData);
			if (attributes) {
				this.setAttribute("position", new BufferAttribute(attributes.positions.value, 3));
				this.setAttribute("uv", new BufferAttribute(attributes.uvs.value, 2));
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
		// }
		if (meshData.vertexData && meshData.triangleIndices) {
			this.build(meshData);
			this.computeBoundingBox();
			this.computeBoundingSphere();
			this.computeVertexNormals();
		}

		return this;
	}
}

function getMeshAttributes(data: DecodeResult) {
	if (!data.vertexData) return;
	if (!data.triangleIndices) return;

	const { minHeight, maxHeight } = data.header;
	const [minX, minY, maxX, maxY] = [0, 0, 1, 1];
	const xScale = maxX - minX;
	const yScale = maxY - minY;
	const zScale = maxHeight - minHeight;

	const nCoords = data.vertexData.length / 3;
	// vec3. x, y defined by bounds, z in meters
	const positions = new Float32Array(nCoords * 3);

	// vec2. 1 to 1 relationship with position. represents the uv on the texture image. 0,0 to 1,1.
	const texCoords = new Float32Array(nCoords * 2);

	// Data is not interleaved; all u, then all v, then all heights
	for (let i = 0; i < nCoords; i++) {
		const x = data.vertexData[i] / 32767;
		const y = data.vertexData[i + nCoords] / 32767;
		const z = data.vertexData[i + nCoords * 2] / 32767;

		positions[3 * i + 0] = x * xScale + minX - 0.5;
		positions[3 * i + 1] = y * yScale + minY - 0.5;
		positions[3 * i + 2] = (z * zScale + minHeight) / 1000;

		texCoords[2 * i + 0] = x;
		texCoords[2 * i + 1] = y;
	}

	return {
		positions: { value: positions, size: 3 },
		uvs: { value: texCoords, size: 2 },
	};
}
