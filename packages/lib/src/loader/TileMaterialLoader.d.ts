/**
 *@description: Image Material loader abstract base class
 *@author: 郭江峰
 *@date: 2023-04-06
 */
import { Material, Texture } from "three";
import { ITileMaterialLoader, TileSourceLoadParamsType } from ".";
interface ITileMaterial extends Material {
    map?: Texture | null;
}
/**
 * Image loader base calss
 */
export declare abstract class TileMaterialLoader implements ITileMaterialLoader<ITileMaterial> {
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
    load(params: TileSourceLoadParamsType): Promise<ITileMaterial>;
    /**
     * Download terrain data
     * @param url url
     * @returns {Promise<TBuffer>} the buffer of download data
     */
    protected abstract doLoad(url: string, params: TileSourceLoadParamsType): Promise<Texture>;
}
export {};
