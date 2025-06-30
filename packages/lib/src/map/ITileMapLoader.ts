import { ITileLoader } from "../loader";
import { IProjection } from "./projection";

export interface ITileMapLoader extends ITileLoader {
	get projection(): IProjection;
	set projection(projection: IProjection);
}
