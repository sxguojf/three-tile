/**
 *@description: Mapbox-RGB geometry loader
 *@author: 郭江峰
 *@date: 2023-04-06
 */
import { ImageLoader } from "three";
import { WorkerPool } from "three/examples/jsm/utils/WorkerPool.js";
import { LoaderFactory, TileGeometryLoader } from "..";
import { version } from "../..";
import { TileGeometry } from "../../geometry/TileGeometry";
import ParseWorker from "./parse.worker?worker&inline";
const THREADSNUM = 10;
/**
 * Mapbox-RGB geometry loader
 */
export class TerrainDEMLoader extends TileGeometryLoader {
    constructor() {
        super();
        this.info = {
            version,
            description: "Mapbox-DEM terrain loader, It can load Mapbox-DEM terrain data.",
        };
        // 数据类型标识
        this.dataType = "terrain-dem";
        // 使用imageLoader下载
        this.imageLoader = new ImageLoader(LoaderFactory.manager);
        this._workerPool = new WorkerPool(0);
        this._workerPool.setWorkerCreator(() => new ParseWorker());
    }
    /**
     * 异步加载BufferGeometry对象
     *
     * @param url 图片的URL地址
     * @param params 加载参数，包含瓦片xyz和裁剪边界clipBounds
     * @returns 返回解析后的BufferGeometry对象
     */
    async doLoad(url, params) {
        if (this._workerPool.pool === 0) {
            this._workerPool.setWorkerLimit(THREADSNUM);
        }
        // 取得瓦片层级和剪裁范围
        const { z, clipBounds } = params;
        const img = await this.imageLoader.loadAsync(url);
        const imgData = getImageData(img);
        // 解析取得几何体数据
        const message = {
            demData: imgData,
            z,
            clipBounds,
        };
        // const transferList = [buffer];
        const geoData = (await this._workerPool.postMessage(message)).data;
        // const geoData = parse(imgData, z, clipBounds);
        // 创建瓦片几何体对象
        return new TileGeometry().setAttribes(geoData, z);
    }
}
function getImageData(image) {
    const canvas = new OffscreenCanvas(image.width, image.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);
    return ctx.getImageData(0, 0, image.width, image.height);
}
/**
 * Get pixels in bounds from image and resize to targetSize
 * 从image中截取bounds区域子图像，缩放到targetSize大小，返回其中的像素数组
 * @param image 源图像
 * @param bounds clip bounds
 * @param targetSize dest size
 * @returns imgData
 */
// function getSubImageData(image: HTMLImageElement, bounds: [number, number, number, number], targetSize: number) {
// 	const cropRect = getBoundsCoord(bounds, image.width);
// 	targetSize = Math.min(targetSize, cropRect.sw);
// 	const canvas = new OffscreenCanvas(targetSize, targetSize);
// 	const ctx = canvas.getContext("2d")!;
// 	ctx.imageSmoothingEnabled = false;
// 	ctx.drawImage(image, cropRect.sx, cropRect.sy, cropRect.sw, cropRect.sh, 0, 0, targetSize, targetSize);
// 	return ctx.getImageData(0, 0, targetSize, targetSize);
// }
