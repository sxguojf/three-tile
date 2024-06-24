/**
 * three-tile目前暂未使用layer概念，使用layer来对渲染效果分层设置，但对代码架构影响较大，暂未使用。
 *
 * 1、loader中传入的不再是source，改为layer
 * 2、SourceWithProjection中功能移入layer中
 * 3、layer中包含source以及瓦片渲染相关属性 *
 * 4、layer中增加loader方法加载瓦片数据，tile中不再使用loader，改用layer加载数据，改动太大待讨论
 *
 * 难点：
 * 1、修改layer渲染相关属性后，该layer关联的所有瓦片需要重新渲染，如果根据图层找到其包含的瓦片（几何体、材质、纹理）？
 * 		解决办法1：给layer增加一个属性保存瓦片ID，在修改layer渲染相关属性后，遍历该属性，重新渲染。
 *	 	解决办法2：给瓦片几何体、材质、纹理添加layer的ID，在修改layer渲染相关属性后，遍历瓦片，重新渲染。
 *
 */

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
