/**
 *@description: Map projection factory
 *@author: 郭江峰
 *@date: 2023-04-06
 */
import { ProjMCT } from "./ProjMCT";
import { ProjWGS } from "./ProjWGS";
export const ProjectFactory = {
    /**
     * create projection object from projection ID
     *
     * @param id projeciton ID, default: "3857"
     * @returns IProjection instance
     */
    createFromID: (id = "3857", lon0) => {
        let proj;
        switch (id) {
            case "3857":
                proj = new ProjMCT(lon0);
                break;
            case "4326":
                proj = new ProjWGS(lon0);
                break;
            default:
                throw new Error(`Projection ID: ${id} is not supported.`);
        }
        return proj;
    },
};
