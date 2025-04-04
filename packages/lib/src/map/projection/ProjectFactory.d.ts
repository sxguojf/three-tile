/**
 *@description: Map projection factory
 *@author: 郭江峰
 *@date: 2023-04-06
 */
import { IProjection, ProjectionType } from "./IProjection";
export declare const ProjectFactory: {
    /**
     * create projection object from projection ID
     *
     * @param id projeciton ID, default: "3857"
     * @returns IProjection instance
     */
    createFromID: (id: ProjectionType | undefined, lon0: number) => IProjection;
};
