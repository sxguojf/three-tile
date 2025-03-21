/**
 *@description: Image Material loader abstrace baseclass
 *@author: 郭江峰
 *@date: 2023-04-06
 */
import { Material, Texture } from "three";
import { ITileMaterialLoader, TileSourceLoadParamsType } from ".";
/**
 * Image loader base calss
 */
export declare abstract class TileMaterialLoader implements ITileMaterialLoader {
    info: {
        version: string;
        description: string;
    };
    dataType: string;
    useWorker: boolean;
    /**
     * Load tile data from source
     * @param source
     * @param tile
     * @returns
     */
    load(params: TileSourceLoadParamsType): Promise<Material>;
    /**
     * Download terrain data
     * @param url url
     * @returns {Promise<TBuffer>} the buffer of download data
     */
    protected abstract doLoad(url: string, params: TileSourceLoadParamsType): Promise<Texture>;
}
