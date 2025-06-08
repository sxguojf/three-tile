/**
 *@description: Modules of tile loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */

// tile factory
export * from "./LoaderFactory";

export * from "./TileLoadingManager";

// extends the threejs loader
export * from "./ITileLoaders";

export * from "./PromiseWorker";

// tile utils
export * from "./util";

// tile loader (include material loader and geometry loader)
export * from "./TileLoader";

// texture loader
// export * from "./TileTextureLoader";

// tile geometry loader base class
export * from "./TileGeometryLoader";

export * from "./TileMaterialLoader";

// Canvas loader. 画布加载器
export * from "./TileCanvasLoader";

// tile raster image loader. 通用影像材质瓦片加载器
export * from "./tileImageLoader";

// ArcGis lerc loader. ArcGis lerc格式地形瓦片加载器
export * from "./terrainLercLoader";

// Mapbox terrain-rgb loader. Mapbox terrain-rgb格式地形瓦片加载器
import "./terrainRGBLoader";
