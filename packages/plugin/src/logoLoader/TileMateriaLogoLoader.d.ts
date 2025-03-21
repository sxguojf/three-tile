/**
 *@description: LOGO loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */
import { TileCanvasLoader, TileSourceLoadParamsType } from "../../loader";
/**
 * LOGO tile Material loader
 */
export declare class TileMaterialLogoLoader extends TileCanvasLoader {
    readonly info: {
        version: string;
        description: string;
    };
    dataType: string;
    /**
     * Draw tile on canvas
     * @param ctx Tile canvas context
     * @param params Tile load params
     */
    protected drawTile(ctx: OffscreenCanvasRenderingContext2D, params: TileSourceLoadParamsType): void;
}
