/**
 *@description: Map background material loader
 *@author: 郭江峰
 *@date: 2023-04-06
 */

import { Color, ColorRepresentation, Material, MeshLambertMaterial } from "three";
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
	private _material: Material;
	/** 取得默认材质 */
	public get material() {
		return this._material;
	}
	/** 设置默认材质 */
	public set material(value) {
		this.material.dispose();
		this._material = value;
	}

	constructor(backgroundColor: ColorRepresentation = 0x112233) {
		this._material = new MeshLambertMaterial({ color: backgroundColor, transparent: false });
	}

	/**
	 * Load tile material from source
	 * @param source
	 * @param tile
	 * @returns
	 */
	public async load(params: TileSourceLoadParamsType<BackgroundSource>): Promise<ITileMaterial> {
		const material = this.material;
		if ("color" in material && material.color instanceof Color) {
			material.color.set(params.source.color);
		}
		return this.material;
	}
}
