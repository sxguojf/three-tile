[English](README.md) | [简体中文](README_CN.md)

# **three-tile V0.8.2**

<p align='right'>hz_gjf@163.com</p>

<img src="./images/wechat.jpg" width = 300 height = 400>

微信搜索群：three-tile开发交流


## 1 Introduction

three-tile is a lightweight 3D tile map library developed based on [threejs](https://threejs.org/). It offers advantages such as ease of use and low resource consumption, and provides a lightweight 3D terrain model suitable for adding 3D maps to applications developed with threejs.

For more details, please visit: [https://blog.csdn.net/HZGJF/article/details/140280844](https://blog.csdn.net/HZGJF/article/details/140280844)

Note: This is neither Cesium nor Mapbox-gl, and it has no relationship with these 3D GIS frameworks.

Source: [https://github.com/sxguojf/three-tile](https://github.com/sxguojf/three-tile)

Demo: [https://sxguojf.github.io/mydemo/three-tile/index.html](https://sxguojf.github.io/mydemo/three-tile/index.html)

Some development examples are provided:

Examples Source: [https://github.com/sxguojf/three-tile-example](https://github.com/sxguojf/three-tile-example)

Examples: [https://sxguojf.github.io/three-tile-example](https://sxguojf.github.io/three-tile-example)

Developed using Vue:

[https://sxguojf.github.io/mydemo/three-tile-vue/index.html](https://sxguojf.github.io/mydemo/three-tile-vue/index.html)

| ![alt text](images/image-3.png)                                | ![alt text](images/image-4.png)                                |
| -------------------------------------------------------------- | -------------------------------------------------------------- |
| ![alt text](images/image-2.png)                                | ![image-20240715090719129](images/image-20240715090719129.png) |
| ![image-20240715090911564](images/image-20240715090911564.png) | ![alt text](images/image-1.png)                                |

Disclaimer:

-   This framework does not contain any map data. The maps used in the examples directly call third-party data. Please comply with legal and regulatory requirements when using them.

### 1.1 Features

-   Lightweight: The map is provided as a 3D model, without any impact on the existing program architecture.
-   Few dependencies: The entire framework only has one dependency, which is threejs (R165).
-   Fast: Low resource consumption, capable of running smoothly at 60FPS even on integrated graphics.
-   Easy to use: Familiarity with threejs means virtually no learning curve.
-   Highly extensible: Data, models, textures, materials, and the rendering process can all be extended and replaced according to your needs.

### 1.2 Development Environment

-   Language: 100% TypeScript
-   IDE: VSCode
-   Bundler: Vite 4.0
-   Dependency: three 0.165

---

## 2 Installation

### 2.1 Direct Reference

```
<script type="importmap">
{
    "imports": {
        "three": "https://unpkg.com/three@0.165.0/build/three.module.js",
        "three-tile": "https://unpkg.com/three-tile@0.7.0/dist/three-tile.js"
    }
}
</script>
```

### 2.2 npm

```sh
npm i three-tile -S
```

```sh
yarn add three-tile -S
```

---

## 3 Usage

Like a typical threejs application, after initializing the threejs 3D scene, you can add the map model to the scene to display the map.

Follow these steps for usage:

1. Define the map data source
2. Create the map model
3. Initialize the 3D scene
4. Add the map model to the 3D scene

### 3.1 Define the Map Data Source

three-tile comes with built-in tile map sources from multiple providers such as Mapbox, ArcGis, Bing, Tianditu, Gaode, Tencent, etc. These can be directly used or extended as needed. By default, the map tiles use the Google scheme, and the terrain tiles support MapBox's terrain-rgb and ArcGis's LERC formats. For example, creating a MapBox data source is done as follows:

```typescript
import * as tt from "three-tile";

// MapBox Token
const MAPBOXKEY = "xxxxxxxxxx";

// mapbox raster data source
const mapBoxImgSource = new tt.plugin.MapBoxSource({
	token: MAPBOXKEY,
	dataType: "image", // image data type flag
	style: "mapbox.satellite", //mapbox raster data url parameter
});

// mapbox terrain data source
export const mapBoxDemSource = new tt.plugin.MapBoxSource({
	token: MAPBOXKEY,
	dataType: "terrain-rgb", //terrain-rgb data type flag
	style: "mapbox.terrain-rgb", //mapbox terrain-rgb data url parameter
	maxLevel: 15,
});
```

Note:

Most map service sources require a token to use, so please do not use the one in my example.
For ease of experience, the demo code includes tokens for some map service providers, but excessive use may lead to restrictions. If the map does not load, please replace the token.
Some foreign maps may be inaccessible or very slow. You will need to find your own solution for this, as you know.
Chinese maps use the "Mars Coordinate System," which may result in misalignment between imagery and terrain.
When using map data, please comply with legal and regulatory requirements.

3.2 Map Creation

```typescript
import * as tt from "three-tile";

// Create map object
const map = new tt.TileMap({
	// Image data source
	imgSource: imgSource,
	// Elevation data source
	demSource: demSource,
	// Central meridian longitude of map projection
	lon0: 90,
	// Minimum zoom level
	minLevel: 2,
	// Maximum zoom level
	maxLevel: 20,
});

// Rotate the map to the xz plane
map.rotateX(-Math.PI / 2);

// Add the map to the 3D scene
viewer.scene.add(map);
```

3.3 Initialize the 3D Scene
The initialization of the 3D scene in three-tile is the same as in threejs. You can initialize the scene, camera, controls, lights, etc., following the threejs approach. For ease of use, three-tile also provides a GLViewer class that encapsulates the scene initialization process and can be used directly for initialization.

```typescript
import * as tt from "three-tile";

// Initialize the 3D scene (using the built-in initialization class of three-tile)
const viewer = new tt.plugin.GLViewer("#map");
```

Unlike 2D webgis, translating, scaling, and rotating the map model in a 3D scene is not achieved by modifying the model's position and size, but by adjusting the camera's (observer's) position. This includes modifying the camera's coordinates and its direction vector (or heading, pitch, roll), which determines where the observer is located and in which direction they are looking. This description may be somewhat abstract. In three-tile, camera coordinates and map center coordinates are used instead. By converting the camera's latitude, longitude, and altitude, as well as the map center's latitude, longitude, and altitude, into world coordinates, they are passed as parameters to the GLViewer constructor for positioning.

```typescript
// Initialize the 3D scene
function initViewer(id: string, map: tt.TileMap) {
	// Map center coordinates (longitude, latitude, altitude)
	const centerGeo = new Vector3(110, 30, 0);
	// Camera coordinates (longitude, latitude, altitude)
	const camersGeo = new Vector3(110, 0, 10000);
	// Convert map center longitude, latitude, and altitude to world coordinates
	const centerPostion = map.geo2world(centerGeo);
	// Convert camera longitude, latitude, and altitude to world coordinates
	const cameraPosition = map.geo2world(camersGeo);
	// Initialize the scene
	const viewer = new tt.plugin.GLViewer(id, { centerPostion, cameraPosition });
	// Add the map to the scene
	viewer.scene.add(map);
	return viewer;
}
```

If you are familiar with threejs, it is best to initialize the scene yourself, as it is not much different from a regular threejs program. Here are some key points to note:

-   The map needs to be illuminated to be visible. Generally, at least one ambient light is required, and it is advisable to add a directional light to enhance the sense of relief.
-   For scene controls, the built-in MapControls in threejs can be used for most applications. Other controllers such as OrbitControls, FlyControls, PointerLockControls, TransformControls, and FirstPersonControls are also fully supported.

## 4. Key Class Descriptions

For general use, the TileMap class is sufficient for most operations. TileMap inherits from the Mesh class in threejs, so you can treat it as a regular 3D model and add it to the scene for use.

### 4.1 TileMap Constructor

`constructor(params: MapParams)` - The constructor for the map. The parameters for the map constructor are as follows:

```typescript
type MapParams = {
	imgSource: ISource[] | ISource; // Image data source
	demSource?: ISource; // Elevation data source
	minLevel?: number; // Minimum zoom level
	maxLevel?: number; // Maximum zoom level
	lon0?: ProjectCenterLongitude; // Central meridian longitude of map projection
	loader?: ITileLoader; // Map loader
	rootTile?: RootTile; // Root tile
};
```

The parameters for the TileMap constructor are encapsulated as properties with the same names within the TileMap class, and the map state can be changed by modifying these properties during runtime.

Here is a detailed breakdown of the parameters:

| Name      | Type                   | Description                                                                                                                                                                                                                                                                                                                                               |
| --------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| imgSource | ISource[] \| ISource   | Required, default is `[]`. Specifies the image data source for map tiles. If multiple image layers are needed, an array of image sources can be passed, and they will be displayed in a blended overlay manner. The data source type is `ISource`, and three-tile comes with built-in mainstream tile data sources that can be created and used directly. |
| demSource | ISource                | Optional, default is `undefined`. Specifies the terrain data source for map tiles. If it is empty, the terrain will not be displayed on the map. Like the image data source, built-in terrain data sources can be used.                                                                                                                                   |
| minLevel  | number                 | Optional, default is `0`. Specifies the minimum zoom level for map tiles. When the tile zoom level is less than this value, map tiles will no longer be merged.                                                                                                                                                                                           |
| maxLevel  | number                 | Optional, default is `19`. Specifies the maximum zoom level for map tiles. When the tile zoom level exceeds this value, map tiles will no longer be subdivided.                                                                                                                                                                                           |
| lon0      | ProjectCenterLongitude | Optional, default is `0`. Specifies the longitude of the central meridian for the map projection. Note that it is not used to specify the center position of the map.                                                                                                                                                                                     |
| loader    | ITileLoader            | Optional, default is an instance of the built-in `TileLoader` class. Specifies which loader to use for loading data to generate tile models and materials. Advanced developers can customize the loader to implement custom data loading and tile model creation processes.                                                                               |
| rootTile  | RootTile               | Optional, default is the level 0 tile. Specifies from which tile to start creating the tile tree. This does not need to be passed manually.                                                                                                                                                                                                               |

During runtime, you can change the state of the map by modifying these properties.

### 4.2 Main Properties of TileMap

| Name          | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| autoUpdate    | boolean  | Default is `true`. Specifies whether to update the map model and data during each frame render. Disabling updates is mainly used in two scenarios: one is for offline rendering of new camera images for certain effects, such as water surfaces and reflections. When `autoUpdate` is `true`, map tiles will perform LOD based on camera position, which may not obtain correct offline rendered images. To solve this problem, set `autoUpdate` to `false` before loading the effects to disable automatic updates, and restore it after the effects are rendered. The second scenario is for debugging the tile tree and data loading, where disabling automatic updates during runtime allows you to check whether the tile tree is correctly refined, merged, or culled. |
| autoPosition  | boolean  | Default is `false`. Specifies whether to adjust the position (height) of the map model based on the average altitude of the tiles within the view in each frame render. The default position of the map model is at sea level (0 meters), but in high-altitude areas, the ground appears high in the view. Enabling automatic adjustment will set the model position to the average ground altitude instead of 0 meters. If you are unsure what this means, keep the default value.                                                                                                                                                                                                                                                                                           |
| maxZInView    | number   | Gets the maximum height of the terrain within the view.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| minZInView    | number   | Gets the minimum height of the terrain within the view.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| avgZInView    | number   | Gets the average height of the terrain within the view.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| loadCacheSize | number   | Default is `300`. Sets or gets the cache size for tile data, measured in tiles. A larger cache can improve runtime performance but will consume more memory.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| LODThreshold  | number   | Default is `1`. Sets the LOD threshold coefficient for tiles. TileMap is essentially a dynamic LOD model that refines or merges models based on the distance of the tiles from the camera. A higher value results in faster tile refinement, while a lower value results in faster tile merging.                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| attributions  | string[] | Gets attribution information for the tile data, such as copyright, from the `attributions` property defined in the tile data source.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| tileCount     | Object   | Gets tile statistics information, such as the total number of tiles, the number of leaf tiles, and the number of visible tiles, primarily used for debugging.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |

### 4.3 Main Methods of TileMap

| Name                                                     | Parameters                                  | Returns                                                                                                                                             | Function                                                                                    |
| -------------------------------------------------------- | ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| geo2pos(geo: Vector3)                                    | geo: geographic coordinates (lat/lon)       | Vector3: local coordinates of the map model                                                                                                         | Convert geographic coordinates to map model coordinates                                     |
| pos2geo(pos: Vector3)                                    | pos: map model coordinates                  | Vector3: geographic coordinates (longitude, latitude, altitude)                                                                                     | Convert map model coordinates to geographic coordinates                                     |
| geo2world(geo: Vector3)                                  | geo: geographic coordinates (lat/lon)       | Vector3: world coordinates                                                                                                                          | Convert geographic coordinates to world coordinates                                         |
| world2geo(world: Vector3)                                | world: world coordinates                    | Vector3: geographic coordinates (longitude, latitude, altitude)                                                                                     | Convert world coordinates to geographic coordinates                                         |
| getLocalInfoFromGeo(geo: Vector3)                        | geo: geographic coordinates (lat/lon)       | LocationInfo: inherits from THREE.Intersection, with additional location property containing geographic coordinates (longitude, latitude, altitude) | Get ground information (normal vector, altitude, etc.) for specified geographic coordinates |
| getLocalInfoFromWorld(pos: Vector3)                      | pos: world coordinates                      | LocationInfo: inherits from THREE.Intersection, with additional location property containing geographic coordinates (longitude, latitude, altitude) | Get ground information (normal vector, altitude, etc.) for specified world coordinates      |
| getLocalInfoFromScreen(camera: Camera, pointer: Vector2) | camera: camera, pointer: screen coordinates | LocationInfo: inherits from THREE.Intersection, with additional location property containing geographic coordinates (longitude, latitude, altitude) | Get ground information (normal vector, altitude, etc.) for specified screen coordinates     |
| reload()                                                 | void                                        | void                                                                                                                                                | Reload the map; call this method after changing the map data source for it to take effect   |
| static create(params: MapParams)                         | params: map construction parameters         | TileMap: tile map object                                                                                                                            | Static factory function with the same functionality and parameters as the constructor       |

### 4.4 TileMap Events

| Event Name         | Parameters                                                               | Description                                                                                                  |
| ------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| update             | delta: timestamp                                                         | Occurs on each frame update of the map, similar to the render callback function in threejs                   |
| tile-created       | tile: tile                                                               | Occurs after each tile is created, allowing modification of default tile properties                          |
| tile-loaded        | tile: tile                                                               | Occurs when the data for each tile is loaded, allowing modification of tile geometry and material properties |
| source-changed     | source: map data source                                                  | Occurs when the data source object changes                                                                   |
| projection-changed | projection: projection object                                            | Occurs when the map projection changes                                                                       |
| loading-start      | itemsLoaded: number of items loaded<br />itemsTotal: total items to load | Occurs when map data starts loading (wrapper for THREE.LoadingManager event)                                 |
| loading-error      | url: tile URL                                                            | Occurs when an error occurs during map data loading (wrapper for THREE.LoadingManager event)                 |
| loading-complete   | None                                                                     | Occurs when all map data is fully loaded (wrapper for THREE.LoadingManager event)                            |

## 5. Conventions and Limitations

-   Coordinate System: The local coordinate system of the map model is an east-north-up (ENU) system, where the X-axis points east, the Y-axis points north, and the Z-axis points upwards. This differs from the default coordinates in threejs and should be noted. The up vector for the map is (0,0,1).
-   Coordinate Units: Angle units are in radians, latitude and longitude are in degrees, 3857 projection (default) coordinate units are in kilometers, 4326 projection units are in 0.01 degrees, and all height units are in kilometers.
-   Tile Data: Built-in map imagery and terrain support 3854 and 4326 projection tiles, vector tiles are not currently supported.
-   Tile Properties: By default, tile models have transparency enabled and renderOrder=0; please pay attention to the rendering order.
-   Map Clarity: Map clarity is unrelated to this framework and depends on the precision of the data source.
-   Map Offset: Most domestic map data providers have certain offsets in place names, boundaries, and roads, which may not fully align with terrain.
-   Map Tokens: Most map data providers require a development key to access their data. The three-tile examples may include tokens for some providers, but these have limited access. Users should apply for their own tokens (which are usually free) to avoid direct use.

## 6. Running and Debugging the Program

-   npm run dev

## 7. References

-   https://github.com/CesiumGS/cesium
-   https://github.com/mapbox/mapbox-gl-js
-   https://leafletjs.com
-   https://github.com/tentone/geo-three
-   https://github.com/ebeaufay/threedtiles
-   https://github.com/NASA-AMMOS/3DTilesRendererJS
-   https://github.com/wlgys8/GPUDrivenTerrainLearn
-   https://github.com/lijundacom/LeoGPUDriven
