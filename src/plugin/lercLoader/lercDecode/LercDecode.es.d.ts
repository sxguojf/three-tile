export type PixelTypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array;

export type LercPixelType = "S8" | "U8" | "S16" | "U16" | "S32" | "U32" | "F32" | "F64";

export interface BandStats {
  minValue: number;
  maxValue: number;
  depthStats?: {
    minValues: Float64Array;
    maxValues: Float64Array;
  };
}

export interface LercHeaderInfo {
  version: number;
  width: number;
  height: number;
  validPixelCount: number;
  bandCount: number;
  blobSize: number;
  maskCount: number;
  depthCount: number;
  dataType: number;
  minValue: number;
  maxValue: number;
  maxZerror: number;
  statistics: BandStats[];
  bandCountWithNoData: number;
}

export interface DecodeOptions {
  inputOffset?: number;
  returnInterleaved?: boolean;
  noDataValue?: number;
}

export interface LercData {
  width: number;
  height: number;
  pixelType: LercPixelType;
  statistics: BandStats[];
  pixels: PixelTypedArray[];
  mask: Uint8Array;
  depthCount: number;
  bandMasks?: Uint8Array[];
}

export function load(options?: { locateFile?: (wasmFileName?: string, scriptDir?: string) => string }): Promise<void>;
export function isLoaded(): boolean;
export function decode(input: ArrayBuffer | Uint8Array, options?: DecodeOptions): LercData;
export function getBlobInfo(input: ArrayBuffer | Uint8Array, options?: { inputOffset?: number }): LercHeaderInfo;
export function getBandCount(input: ArrayBuffer | Uint8Array, options?: { inputOffset?: number }): number;
