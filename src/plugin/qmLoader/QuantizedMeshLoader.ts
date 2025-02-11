// src/loader/QuantizedMeshLoader.ts

import { FileLoaderEx, LoaderFactory } from "../../loader";

export interface QuantizedMeshHeader {
	centerX: number;
	centerY: number;
	centerZ: number;
	minHeight: number;
	maxHeight: number;
	boundingSphereCenterX: number;
	boundingSphereCenterY: number;
	boundingSphereCenterZ: number;
	boundingSphereRadius: number;
	horizonOcclusionPointX: number;
	horizonOcclusionPointY: number;
	horizonOcclusionPointZ: number;
}

export interface QuantizedMeshData {
	header: QuantizedMeshHeader;
	vertexData: {
		positions: Float32Array;
		heights: Float32Array;
	};
	indices: Uint16Array | Uint32Array;
	westIndices?: Uint16Array;
	southIndices?: Uint16Array;
	eastIndices?: Uint16Array;
	northIndices?: Uint16Array;
}

export class QuantizedMeshLoader {
	private fileLoader: FileLoaderEx = new FileLoaderEx(LoaderFactory.manager);

	constructor() {
		this.fileLoader.setResponseType("arraybuffer");
	}

	public load(
		url: string,
		onLoad: (response: any) => void,
		onError: (event: ErrorEvent | DOMException) => void,
		abortSignal: AbortSignal,
	) {
		this.fileLoader.load(
			url,
			(response) => {
				onLoad(this.parse(response));
			},
			undefined,
			onError,
			abortSignal,
		);
	}

	private parse(arrayBuffer: ArrayBuffer): QuantizedMeshData {
		const dataView = new DataView(arrayBuffer);
		let offset = 0;

		// 解析头部信息
		const header = this.parseHeader(dataView, offset);
		offset += 88; // 头部大小固定为88字节

		// 解析顶点数据
		const vertexCount = dataView.getUint32(offset, true);
		offset += 4;

		// 解析顶点坐标
		const vertexData = this.parseVertexData(dataView, offset, vertexCount, header);
		offset += vertexCount * 6; // u,v,height 各占2字节

		// 解析三角形索引
		const triangleCount = dataView.getUint32(offset, true);
		offset += 4;
		const indices = this.parseIndices(dataView, offset, triangleCount);
		offset += triangleCount * 2;

		// 解析边缘顶点索引
		const westVertexCount = dataView.getUint32(offset, true);
		offset += 4;
		const westIndices = this.parseEdgeIndices(dataView, offset, westVertexCount);
		offset += westVertexCount * 2;

		const southVertexCount = dataView.getUint32(offset, true);
		offset += 4;
		const southIndices = this.parseEdgeIndices(dataView, offset, southVertexCount);
		offset += southVertexCount * 2;

		const eastVertexCount = dataView.getUint32(offset, true);
		offset += 4;
		const eastIndices = this.parseEdgeIndices(dataView, offset, eastVertexCount);
		offset += eastVertexCount * 2;

		const northVertexCount = dataView.getUint32(offset, true);
		offset += 4;
		const northIndices = this.parseEdgeIndices(dataView, offset, northVertexCount);

		return {
			header,
			vertexData,
			indices,
			westIndices,
			southIndices,
			eastIndices,
			northIndices,
		};
	}

	private parseHeader(dataView: DataView, offset: number): QuantizedMeshHeader {
		return {
			centerX: dataView.getFloat64(offset, true),
			centerY: dataView.getFloat64(offset + 8, true),
			centerZ: dataView.getFloat64(offset + 16, true),
			minHeight: dataView.getFloat32(offset + 24, true),
			maxHeight: dataView.getFloat32(offset + 28, true),
			boundingSphereCenterX: dataView.getFloat64(offset + 32, true),
			boundingSphereCenterY: dataView.getFloat64(offset + 40, true),
			boundingSphereCenterZ: dataView.getFloat64(offset + 48, true),
			boundingSphereRadius: dataView.getFloat64(offset + 56, true),
			horizonOcclusionPointX: dataView.getFloat64(offset + 64, true),
			horizonOcclusionPointY: dataView.getFloat64(offset + 72, true),
			horizonOcclusionPointZ: dataView.getFloat64(offset + 80, true),
		};
	}

	private parseVertexData(dataView: DataView, offset: number, vertexCount: number, header: QuantizedMeshHeader) {
		const positions = new Float32Array(vertexCount * 3);
		const heights = new Float32Array(vertexCount);

		for (let i = 0; i < vertexCount; i++) {
			const u = dataView.getUint16(offset + i * 6, true) / 32767;
			const v = dataView.getUint16(offset + i * 6 + 2, true) / 32767;
			const height = dataView.getUint16(offset + i * 6 + 4, true);

			// 解量化顶点位置
			positions[i * 3] = u;
			positions[i * 3 + 1] = v;
			positions[i * 3 + 2] = height;

			// 计算实际高度
			heights[i] = header.minHeight + ((header.maxHeight - header.minHeight) * height) / 32767;
		}

		return {
			positions,
			heights,
		};
	}

	private parseIndices(dataView: DataView, offset: number, triangleCount: number): Uint16Array | Uint32Array {
		const indices = new Uint16Array(triangleCount * 3);
		let highest = 0;
		let code;
		let lastIndex = 0;

		for (let i = 0; i < triangleCount * 3; i++) {
			code = dataView.getUint16(offset + i * 2, true);
			lastIndex += code - 32767;
			indices[i] = lastIndex;
			if (lastIndex > highest) {
				highest = lastIndex;
			}
		}

		// 如果索引值超过65535，需要使用Uint32Array
		if (highest >= 65535) {
			return new Uint32Array(indices);
		}
		return indices;
	}

	private parseEdgeIndices(dataView: DataView, offset: number, vertexCount: number): Uint16Array {
		const indices = new Uint16Array(vertexCount);
		for (let i = 0; i < vertexCount; i++) {
			indices[i] = dataView.getUint16(offset + i * 2, true);
		}
		return indices;
	}
}

const loader = new QuantizedMeshLoader();
const url = "./tiles//test.terrain";
loader.load(
	url,
	(data) => {
		console.log(data);
	},
	(event) => {
		console.log(event);
	},
	new AbortController().signal,
);
