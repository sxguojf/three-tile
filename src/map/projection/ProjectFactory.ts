import { IProjection, ProjectionType } from "./IProjection";
import { ProjMCT } from "./ProjMCT";
import { ProjWGS } from "./ProjWGS";

export const ProjectFactory = {
	/**
	 * create projection object from projection ID
	 *
	 * @param id projeciton ID, default: "3857"
	 * @returns IProjection instance
	 */
	createFromID: (id: ProjectionType = "3857") => {
		let proj: IProjection;
		switch (id) {
			case "3857":
				proj = new ProjMCT();
				break;
			case "4326":
				proj = new ProjWGS();
				break;
			default:
				throw new Error(`Projection ID: ${id} is not supported.`);
		}
		return proj;
	},
};
