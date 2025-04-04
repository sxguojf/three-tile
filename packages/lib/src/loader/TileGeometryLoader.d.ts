/**
 *@description: Geometry loader abstrace baseclass
 *@author: 郭江峰
 *@date: 2023-04-06
 */
import { ITileGeometryLoader, ITileLoaderInfo, TileSourceLoadParamsType } from ".";
import { TileGeometry } from "../geometry";
/**
 * Terrain loader base calss
 */
export declare abstract class TileGeometryLoader implements ITileGeometryLoader<TileGeometry> {
    info: ITileLoaderInfo;
    dataType: string;
    useWorker: boolean;
    /**
     * load tile's data from source
     * @param source
     * @param tile
     * @param onError
     * @returns
     */
    load(params: TileSourceLoadParamsType): Promise<TileGeometry>;
    /**
     * Download terrain data
     * @param url url
     */
    protected abstract doLoad(url: string, params: TileSourceLoadParamsType): Promise<TileGeometry>;
}
