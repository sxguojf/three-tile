/**
 *@description: LOD Tile
 *@author: 郭江峰
 *@date: 2025-05-01
 */
import { Box3, Matrix4, Object3D, Vector3 } from "three";
import { FrustumEx } from "./FrustumEx";
import { createChildren, LODAction, LODEvaluate } from "./util";
/** 相机世界坐标 */
const cameraWorldPosition = new Vector3();
/** 场景视锥体 */
const frustum = new FrustumEx();
/** 临时变量 */
const tempMat4 = new Matrix4();
/**
 * 动态LOD（DLOD）地图瓦片类，用于表示地图中的一块瓦片，瓦片可以包含子瓦片，以四叉树方式管理。
 */
export class Tile extends Object3D {
    /** 瓦片模型 */
    get model() {
        return this._model;
    }
    /** 子瓦片 */
    get subTiles() {
        return this._subTiles;
    }
    /** 瓦片到相机的距离比例，用于 LOD 评估，值越小瓦片越密集 */
    get distRatio() {
        const checkPoint = new Vector3().applyMatrix4(this.matrixWorld);
        checkPoint.setY(this.model?.geometry.boundingBox?.max.z || 0);
        const distToCamera = cameraWorldPosition.distanceTo(checkPoint);
        const ratio = distToCamera / this._sizeInWorld;
        return this.inFrustum ? ratio * 0.8 : ratio * 2;
    }
    /** 瓦片是否在视锥体内 */
    get inFrustum() {
        return this._inFrustum;
    }
    /** 是否为叶子瓦片 */
    get isLeaf() {
        return !this.subTiles;
    }
    /** 取得瓦片是否显示 */
    get showing() {
        return !!this.model && this.model.visible;
    }
    /** 设置瓦片是否显示 */
    set showing(value) {
        if (this.model) {
            if (value) {
                this._updateShadow();
            }
            if (value != this.showing) {
                this.model.traverse(child => child.layers.set(value ? 0 : 31));
                this.model.visible = value;
                this._root.dispatchEvent({ type: "tile-visible-changed", tile: this, visible: value });
            }
        }
        else {
            console.assert(!value);
        }
    }
    _needsLoad(loader) {
        // 下载线程数>最大下载线程数不下载
        if (loader.downloadingThreads >= loader.maxThreads) {
            return false;
        }
        // 没有模型则下载
        if (!this.model) {
            return true;
        }
        // 不是脏瓦片或者不在视野范围内不下载
        if (!this._isDirty || !this.inFrustum) {
            return false;
        }
        // 父瓦片等子瓦片已下载完成后再下载
        return !this.subTiles?.some(tile => !tile._isDirty);
        // 仅下载叶子瓦片
        // return  this.isLeaf;
        // 仅加载叶子瓦片和其父瓦片
        // return !this.subTiles || this.subTiles?.some(tile => tile.isLeaf);
    }
    /**
     * 构造函数
     * @param x - 瓦片X坐标，默认：0
     * @param y - 瓦片Y坐标，默认：0
     * @param z - 瓦片层级，默认：0
     */
    constructor(x = 0, y = 0, z = 0) {
        super();
        /** 是否为瓦片 */
        this.isTile = true;
        /** 瓦片是否正在加载中 */
        this._isLoading = false;
        /** 根瓦片 */
        this._root = this;
        /* 瓦片在世界坐标系中的大小*/
        this._sizeInWorld = -1;
        this._inFrustum = false;
        /** 是否为脏瓦片 */
        this._isDirty = false;
        this.x = x;
        this.y = y;
        this.z = z;
        this.name = `Tile ${z}-${x}-${y}`;
        this.up.set(0, 0, 1);
    }
    /**
     * 瓦片射线检测，仅检测视锥体中的瓦片
     */
    raycast(_raycaster) {
        return this.inFrustum;
    }
    /** 计算瓦片包围盒（世界坐标） */
    getBBox() {
        let maxY = 9000;
        if (this.model) {
            maxY = this.model.geometry.boundingBox?.max.z || 0;
        }
        const bbox = new Box3(new Vector3(-this.scale.x, -this.scale.y, -300), new Vector3(this.scale.x, this.scale.y, maxY)).applyMatrix4(this.matrixWorld);
        return bbox;
    }
    /**
     * 计算瓦片大小
     * @returns 瓦片对角线长度
     */
    getTileSize() {
        if (this._sizeInWorld < 0) {
            const p1 = new Vector3(-this.scale.x, -this.scale.y).applyMatrix4(this.matrixWorld);
            const p2 = new Vector3(this.scale.x, this.scale.y).applyMatrix4(this.matrixWorld);
            this._sizeInWorld = p1.distanceTo(p2);
            console.assert(this._sizeInWorld > 10);
        }
        return this._sizeInWorld;
    }
    /**
     * 瓦片更新，该函数在每帧渲染中被调用
     * @param params 瓦片更新参数，包括相机、加载器、最小层级、最大层级和LOD阈值
     */
    update(params) {
        // （没有父瓦片||模型正在加载）时不进行更新
        if (!this.parent || this._isLoading) {
            return;
        }
        // 设置根瓦片
        if (this.parent instanceof Tile) {
            this._root = this.parent._root;
        }
        console.assert(this._root.z === 0);
        const { loader, minLevel, camera } = params;
        // 如果是根瓦片，则计算一次视锥体和摄像机坐标
        if (this.z === 0) {
            camera.getWorldPosition(cameraWorldPosition);
            frustum.setFromProjectionMatrix(tempMat4.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));
        }
        // 计算是否在视椎体内
        this._inFrustum = frustum.intersectsBox(this.getBBox());
        // 下载瓦片
        if (this.z >= minLevel && this._needsLoad(loader)) {
            if (this.model) {
                this._startModify(loader);
            }
            else {
                this._startLoad(loader);
            }
            return;
        }
        // 更新瓦片阴影
        this._updateShadow();
        // LOD
        this.LOD(params);
        // 递归更新子瓦片
        this.subTiles?.forEach(child => child.update(params));
    }
    /** 更新瓦片阴影 */
    _updateShadow() {
        if (this.model) {
            this.model.castShadow = this._root.castShadow;
            this.model.receiveShadow = this._root.receiveShadow;
        }
    }
    /**
     * LOD (Level of Detail).
     * @returns add or remove
     */
    LOD(params) {
        const { loader, minLevel, maxLevel, LODThreshold } = params;
        const action = LODEvaluate(this, minLevel, maxLevel, LODThreshold);
        if (action === LODAction.create) {
            if (this.inFrustum && (this.showing || this.z <= minLevel)) {
                // console.log("create", this.name);
                const newTiles = createChildren(this, loader);
                this.add(...newTiles);
                this._subTiles = newTiles;
                this._subTiles.forEach(child => {
                    child.updateMatrixWorld();
                    child.updateMatrix();
                    child.getTileSize();
                    this._root.dispatchEvent({ type: "tile-created", tile: child });
                });
            }
        }
        else if (action === LODAction.remove) {
            // console.log("remove", this.name);
            if (this.model) {
                this.showing = true;
                this.unLoadSubTiles();
            }
        }
        return action;
    }
    /**
     * 瓦片下载完成后，检查4个兄弟瓦片全部下载完成时再显示
     */
    _checkVisible() {
        const parent = this.parent;
        if (parent instanceof Tile) {
            if (parent.model) {
                const subTiles = parent.subTiles;
                if (subTiles) {
                    const allLoaded = !subTiles.some(tile => !tile.model);
                    subTiles.forEach(child => (child.showing = allLoaded));
                    parent.showing = !allLoaded;
                    // if (allLoaded) {
                    // 	parent.unLoadModel(loader);
                    // }
                }
            }
            else {
                this.showing = true;
            }
        }
        return this;
    }
    /**
     * 下载瓦片数据
     * @param loader  - 瓦片加载器
     */
    async _startLoad(loader) {
        console.assert(!this.model);
        this._isLoading = true;
        // load
        const model = await loader.load(this);
        this._model = model;
        model.geometry.computeBoundingBox();
        this.add(model);
        this._root.dispatchEvent({ type: "tile-visible-changed", tile: this, visible: true });
        this.isLeaf && this._checkVisible();
        this._isLoading = false;
        this._root.dispatchEvent({ type: "tile-loaded", tile: this });
    }
    /**
     * 修改瓦片数据
     * @param loader  - 瓦片加载器
     */
    async _startModify(loader) {
        console.assert(!!this.model);
        if (this.model) {
            this._isLoading = true;
            // load
            await loader.update(this, this.model);
            this.model.geometry.computeBoundingBox();
            this._root.dispatchEvent({ type: "tile-visible-changed", tile: this, visible: true });
            this._isDirty = false;
            this._isLoading = false;
            this._root.dispatchEvent({ type: "tile-loaded", tile: this });
        }
    }
    /**
     * 重新加载瓦片数据
     * @param dispose - 是否销毁瓦片树
     * @returns this
     */
    reload(dispose = true) {
        if (dispose) {
            return this.unLoad();
        }
        else {
            this.traverse(child => {
                if (child instanceof Tile && (child.model || child._isLoading)) {
                    child._isDirty = true;
                }
            });
        }
        return this;
    }
    /**
     * 卸载瓦片 (包括瓦片模型和其子瓦片)，释放资源
     * @returns this
     */
    unLoad() {
        this.unLoadSubTiles();
        this.unLoadModel();
        return this;
    }
    unLoadModel() {
        // console.assert(!!this.model);
        if (this.model) {
            this.model.removeFromParent();
            // loader.unload(this.model);
            this.model.material.forEach((material) => {
                for (const key in material) {
                    const value = material[key];
                    if (value && value.isTexture) {
                        value.dispose();
                    }
                    material.dispose();
                }
            });
            this.model.material = [];
            this.model.geometry.dispose();
            this._model = undefined;
            this._isDirty = false;
            this._root.dispatchEvent({ type: "tile-unload", tile: this });
        }
        return this;
    }
    unLoadSubTiles() {
        this.subTiles?.forEach(child => {
            child.removeFromParent();
            child.unLoadModel();
            child.unLoadSubTiles();
        });
        this._subTiles = undefined;
        return this;
    }
}
