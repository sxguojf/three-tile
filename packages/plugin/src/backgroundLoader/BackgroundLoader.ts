/**
 *@description: Map background material loader
 *@author: 郭江峰
 *@date: 2023-04-06
 */

import { MeshLambertMaterial } from "three";
import { ITileMaterial, ITileMaterialLoader, TileSourceLoadParamsType, version } from "three-tile";
import { BackgroundSource } from "./backgroundSource";

/**
 * 地图背景加载器
 */
export class BackgroundLoader implements ITileMaterialLoader<ITileMaterial> {
	public info = {
		version,
		description: "Map background material loader",
	};

	public dataType = "background";
	private _material: MeshLambertMaterial = new MeshLambertMaterial();

	/** 取得默认材质 */
	public get material() {
		return this._material;
	}
	/** 设置默认材质 */
	public set material(value) {
		this.material.dispose();
		this._material = value;
	}

	/** 取得背景颜色 */
	public get backgroundColor() {
		return this.material.color;
	}

	/** 设置背景颜色 */
	public set backgroundColor(value) {
		this.material.color.set(value);
	}

	/**
	 * Load tile material from source
	 * @params params backgournd setting
	 * @retrun background material
	 */
	public async load(params: TileSourceLoadParamsType<BackgroundSource>): Promise<ITileMaterial> {
		this.material.color.set(params.source.color);
		return this.material;
	}
}
