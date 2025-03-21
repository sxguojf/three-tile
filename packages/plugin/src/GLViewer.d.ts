/**
 *@description: Threejs 3D scene initalize
 *@author: 郭江峰
 *@date: 2023-04-05
 */
import { AmbientLight, BaseEvent, DirectionalLight, EventDispatcher, Object3DEventMap, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from "three";
import { MapControls } from "three/examples/jsm/controls/MapControls";
/**
 * GlViewer event map
 */
export interface GLViewerEventMap extends Object3DEventMap {
    update: BaseEvent & {
        delta: number;
    };
}
/**
 * GlViewer options
 */
type GLViewerOptions = {
    antialias?: boolean;
    stencil?: boolean;
    logarithmicDepthBuffer?: boolean;
};
/**
 * threejs scene viewer initialize class
 */
export declare class GLViewer extends EventDispatcher<GLViewerEventMap> {
    readonly scene: Scene;
    readonly renderer: WebGLRenderer;
    readonly camera: PerspectiveCamera;
    readonly controls: MapControls;
    readonly ambLight: AmbientLight;
    readonly dirLight: DirectionalLight;
    readonly container: HTMLElement;
    private readonly _clock;
    private _fogFactor;
    get fogFactor(): number;
    set fogFactor(value: number);
    get width(): number;
    get height(): number;
    constructor(container: HTMLElement | string, options?: GLViewerOptions);
    private _createScene;
    private _createRenderer;
    private _createCamera;
    private _createControls;
    private _createAmbLight;
    private _createDirLight;
    resize(): this;
    private animate;
    /**
     * Fly to a position
     * @param centerPostion Map center target position
     * @param cameraPostion Camera target position
     * @param animate animate or not
     */
    flyTo(centerPostion: Vector3, cameraPostion: Vector3, animate?: boolean, onComplete?: (obj: Vector3) => void): void;
}
export {};
