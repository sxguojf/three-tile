import { ISource } from "../source";

export interface ImageLayerOptions {
	id?: string;
	show?: boolean;
	opacity?: number;
	colorSpace: number;
}

export class IImageLayer {
	public id = "";
	public show = true;
	public opacity = 1;
	public colorSpace = 0;

	private _source: ISource;

	public get source(): ISource {
		return this._source;
	}
	public set source(value: ISource) {
		this._source = value;
	}

	public constructor(source: ISource, options?: ImageLayerOptions) {
		this._source = source;
		if (options) {
			this.id = options.id ?? this.id;
			this.show = options.show ?? this.show;
			this.opacity = options.opacity ?? this.opacity;
			this.colorSpace = options.colorSpace ?? this.colorSpace;
		}
	}
}
