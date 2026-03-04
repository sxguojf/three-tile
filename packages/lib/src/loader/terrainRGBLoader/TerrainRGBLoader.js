/**
 *@description: Mapbox-RGB geometry loader
 *@author: 郭江峰
 *@date: 2023-04-06
 */
import { ImageLoader, MathUtils } from "three";
import { WorkerPool } from "three/examples/jsm/utils/WorkerPool.js";
import { getBoundsCoord, LoaderFactory, TileGeometryLoader } from "..";
import { version } from "../..";
import { TileGeometry } from "../../geometry/TileGeometry";
import ParseWorker from "./parse.worker?worker&inline";
const THREADSNUM = 10;
/**
 * Mapbox-RGB geometry loader
 */
export class TerrainRGBLoader extends TileGeometryLoader {
    constructor() {
        super();
        this.info = {
            version,
            description: "Mapbox-RGB terrain loader, It can load Mapbox-RGB terrain data.",
        };
        // 数据类型标识
        this.dataType = "terrain-rgb";
        // 使用imageLoader下载
        this.imageLoader = new ImageLoader(LoaderFactory.manager);
        this._workerPool = new WorkerPool(0);
        this._workerPool.setWorkerCreator(() => new ParseWorker());
    }
    // 下载数据
    /**
     * 异步加载BufferGeometry对象
     *
     * @param url 图片的URL地址
     * @param params 加载参数，包含瓦片xyz和裁剪边界clipBounds
     * @returns 返回解析后的BufferGeometry对象
     */
    async doLoad(url, params) {
        const img = await this.imageLoader.loadAsync(url);
        const { clipBounds, z } = params;
        // 抽稀像素点
        const targetSize = MathUtils.clamp((z + 2) * 3, 2, 64);
        // 图像剪裁缩放
        const imgData = getSubImageData(img, clipBounds, targetSize);
        let dem;
        if (this._workerPool.pool === 0) {
            this._workerPool.setWorkerLimit(THREADSNUM);
        }
        dem = (await this._workerPool.postMessage({ imgData }, [imgData.data.buffer])).data;
        const geometry = new TileGeometry();
        geometry.setData(dem, z);
        return geometry;
    }
}
/**
 * Get pixels in bounds from image and resize to targetSize
 * 从image中截取bounds区域子图像，缩放到targetSize大小，返回其中的像素数组
 * @param image 源图像
 * @param bounds clip bounds
 * @param targetSize dest size
 * @returns imgData
 */
function getSubImageData(image, bounds, targetSize) {
    const cropRect = getBoundsCoord(bounds, image.width);
    targetSize = Math.min(targetSize, cropRect.sw);
    const canvas = new OffscreenCanvas(targetSize, targetSize);
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(image, cropRect.sx, cropRect.sy, cropRect.sw, cropRect.sh, 0, 0, targetSize, targetSize);
    return ctx.getImageData(0, 0, targetSize, targetSize);
}
