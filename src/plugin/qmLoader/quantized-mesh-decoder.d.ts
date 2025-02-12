export interface Header {
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

export interface DecodedData {
	header: Header;
	vertexData?: Uint16Array;
	triangleIndices?: Uint16Array | Uint32Array;
	westIndices?: Uint16Array | Uint32Array;
	southIndices?: Uint16Array | Uint32Array;
	eastIndices?: Uint16Array | Uint32Array;
	northIndices?: Uint16Array | Uint32Array;
	extensions?: {
		vertexNormals?: Uint8Array;
		waterMask?: ArrayBuffer;
		metadata?: any;
	};
}

export const DECODING_STEPS: {
	header: number;
	vertices: number;
	triangleIndices: number;
	edgeIndices: number;
	extensions: number;
};

export interface DecodeOptions {
	maxDecodingStep?: number;
}

export function decode(data: ArrayBuffer, userOptions?: DecodeOptions): DecodedData;
