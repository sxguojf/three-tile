import { LoadingManager } from "three";
export class TileLoadingManager extends LoadingManager {
    constructor() {
        super(...arguments);
        this.onParseEnd = undefined;
    }
    parseEnd(geometry) {
        this.onParseEnd && this.onParseEnd(geometry);
    }
}
