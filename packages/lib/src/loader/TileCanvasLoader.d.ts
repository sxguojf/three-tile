/**
 *@description: Canvas material laoder
 *@author: 郭江峰
 *@date: 2023-04-06
 */
import { ITileMaterialLoader, TileSourceLoadParamsType } from "../loader";
import { TileMaterial } from "../material";
/**
 * Canvas material laoder abstract base class
 */
export declare abstract class TileCanvasLoader implements ITileMaterialLoader {
    readonly info: {
        version: string;
        description: string;
    };
    dataType: string;
    useWorker: boolean;
    /**
     * Asynchronously load tile material
     * @param params Tile loading parameters
     * @returns Returns the tile material
     */
    load(params: TileSourceLoadParamsType): Promise<TileMaterial>;
    private _creatCanvasContext;
    /**
     * Draw tile on canvas, protected
     * @param ctx Tile canvas context
     * @param params Tile load params
     */
    protected abstract drawTile(ctx: OffscreenCanvasRenderingContext2D, params: TileSourceLoadParamsType): void;
}
