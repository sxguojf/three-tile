[English](README.md) | [简体中文](README_CN.md)

# three-tile

A lightweight 3D tile map development framework

[![GitHub stars](https://img.shields.io/github/stars/sxguojf/three-tile?style=flat)](https://github.com/sxguojf/three-tile/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/sxguojf/three-tile?style=flat)](https://github.com/sxguojf/three-tile/network)
[![npm version](https://img.shields.io/npm/v/three-tile?style=flat)](https://www.npmjs.com/package/three-tile)
[![npm downloads](https://img.shields.io/npm/dm/three-tile?style=flat)](https://www.npmjs.com/package/three-tile)

[Documentation](https://sxguojf.github.io/three-tile-doc/) | [GitHub Repository](https://github.com/sxguojf/three-tile) | [Issues](https://github.com/sxguojf/three-tile/issues)

## 1. Introduction

three-tile is an open-source, lightweight frontend 3D tile framework built on Three.js using TypeScript. It provides 3D terrain models and lets you easily add 3D tile maps to your applications. After dozens of iterations, the framework's features and effects meet production environment requirements and have been validated and applied in multiple projects.

three-tile is more like LOD terrain from game development, but it can use data from map service providers to render maps.

::: warning Disclaimer
This framework does not contain any map data. Maps used in examples and demos directly reference third-party data and do not represent the position of this development framework. Developers should comply with relevant regulations and use legal maps.
:::

## 2. Features

| Feature              | Description                                                                                                                 |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Lightweight**      | Under 70KB (zip: 28KB) after bundling (excluding plugins), easy to integrate                                                |
| **Fast**             | Resource usage optimized to the extreme, low memory footprint, fast rendering, integrated graphics can easily achieve 60fps |
| **Few Dependencies** | Only one external dependency: threejs , all features self-implemented                                                       |
| **Easy to Extend**   | Plugin-based architecture, tile data loading, parsing, modeling, and rendering are all independent from core                |
| **Simple to Use**    | Almost no learning curve if you're familiar with threejs                                                                    |

## 3. Use Cases

### 1. Add Terrain to Existing Applications

In threejs examples, most simple applications use a plane as ground. If you replace the plane with real terrain, the effect immediately improves.

### 2. Simple WebGIS

three-tile map models can directly use mainstream tile data sources to render realistic terrain; provides conversion from geographic coordinates (longitude, latitude, altitude) to 3D scene coordinates, allowing map elements (models, labels) to be overlaid at specified geographic locations.

### 3. Game Development

Fully supports all built-in Three.js controllers. Simply switch controllers to implement first-person, flight, and other game features.

### 4. Data Visualization

Data visualization scenarios like atmosphere, satellite cloud maps, wind field animations, and volume rendering.

## 4. Quick Start

### Installation

### npm

```bash
npm i three -S
npm i three-tile -S
```

### Script Tag

```html
<script type="importmap">
	{
		"imports": {
			"three": "https://unpkg.com/three@0.171.0/build/three.module.js",
			"three-tile": "https://unpkg.com/three-tile@0.12.1/dist",
			"three-tile/plugin": "https://unpkg.com/three-tile@0.12.1/dist/plugin"
		}
	}
</script>
```

### Usage

1. Define map data source
2. Create map model
3. Add map model to 3D scene

```typescript
import * as THREE from "three";
import * as tt from "three-tile";
import * as plugin from "three-tile/plugin";

// Create map
const map = tt.TileMap.create({
	// Image data source
	imgSource: new plugin.ArcGisSource(),
	// DEM data source
	demSource: new plugin.ArcGisDemSource(),
});
// Rotate map to xz plane
map.rotateX(-Math.PI / 2);

// Initialize viewer
const viewer = new plugin.GLViewer("#map");
// Add map to scene
viewer.scene.add(map);
```

## 5. Supported Map Data Sources

Built-in support for mainstream tile map services:

- ArcGIS
- Mapbox
- Bing
- Google
- Tianditu (China)
- Gaode (China)
- Tencent (China)

Also supports custom tile data source extensions.

## 6. API Documentation

- [Core Library API](https://sxguojf.github.io/three-tile-doc/api/lib/) - three-tile core library
- [Plugin API](https://sxguojf.github.io/three-tile-doc/api/plugin/) - three-tile plugins

## 7. Applications

### Basics

- [Introduction](https://sxguojf.github.io/three-tile-doc/1.introduce/01.whatIs/) - What is three-tile, features, use cases
- [Quick Start](https://sxguojf.github.io/three-tile-doc/1.introduce/02.getstart/) - Installation and basic usage

### Examples

| Category         | Examples                                                                                                                                                                                                                                                                                                                                                                                                               |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Basic Functions  | [Get Mouse Location](https://sxguojf.github.io/three-tile-doc/3.examples/01.getMouseLocation/) · [Get Loading Info](https://sxguojf.github.io/three-tile-doc/3.examples/02.getLodingInfo/) · [Set Map Zoom](https://sxguojf.github.io/three-tile-doc/3.examples/03.setMapZoom/) · [Custom Map Source](https://sxguojf.github.io/three-tile-doc/3.examples/04.custmMapSource/)                                          |
| Map Display      | [Fake Earth](https://sxguojf.github.io/three-tile-doc/3.examples/05.fakeEarth/) · [Compass](https://sxguojf.github.io/three-tile-doc/3.examples/06.compass/) · [Limit Camera Height](https://sxguojf.github.io/three-tile-doc/3.examples/07.limitCameraHeight/) · [Skybox](https://sxguojf.github.io/three-tile-doc/3.examples/08.skyBox/)                                                                             |
| Terrain Control  | [Add Mesh](https://sxguojf.github.io/three-tile-doc/3.examples/09.addMesh/) · [Terrain Scale](https://sxguojf.github.io/three-tile-doc/3.examples/10.terrainScale/) · [Limit Pan](https://sxguojf.github.io/three-tile-doc/3.examples/31.limitPan/) · [Set Map Bounds](https://sxguojf.github.io/three-tile-doc/3.examples/28.setMapBounds/)                                                                           |
| Material Effects | [Add Shadow](https://sxguojf.github.io/three-tile-doc/3.examples/11.addShadow/) · [CSS Filter](https://sxguojf.github.io/three-tile-doc/3.examples/12.addCssFilter/) · [Add Sky](https://sxguojf.github.io/three-tile-doc/3.examples/16.addSky/) · [Add Water](https://sxguojf.github.io/three-tile-doc/3.examples/17.addWater/)                                                                                       |
| Data Overlay     | [GeoJSON](https://sxguojf.github.io/three-tile-doc/3.examples/13.addGeoJSON/) · [MVT](https://sxguojf.github.io/three-tile-doc/3.examples/14.addMVT/) · [WMS Source](https://sxguojf.github.io/three-tile-doc/3.examples/27.useWMSSource/) · [CSS2D Labels](https://sxguojf.github.io/three-tile-doc/3.examples/29.addCss2d/)                                                                                          |
| Model Loading    | [Add Model](https://sxguojf.github.io/three-tile-doc/3.examples/15.addModel/) · [Icon Marker](https://sxguojf.github.io/three-tile-doc/3.examples/20.addIcon/) · [Logo Marker](https://sxguojf.github.io/three-tile-doc/3.examples/18.addLogo/) · [White Model](https://sxguojf.github.io/three-tile-doc/3.examples/38.addWhiteModel/)                                                                                 |
| Terrain Effects  | [Mask](https://sxguojf.github.io/three-tile-doc/3.examples/19.addMask/) · [Single DEM](https://sxguojf.github.io/three-tile-doc/3.examples/21.singleDem/) · [Single Image](https://sxguojf.github.io/three-tile-doc/3.examples/22.singleImage/) · [Create Hole](https://sxguojf.github.io/three-tile-doc/3.examples/23.createHole/) · [Polygon Hole](https://sxguojf.github.io/three-tile-doc/3.examples/34.polyHole/) |
| Scene Config     | [Background](https://sxguojf.github.io/three-tile-doc/3.examples/24.background/) · [Switch Controls](https://sxguojf.github.io/three-tile-doc/3.examples/25.changeControls/) · [Ground Group](https://sxguojf.github.io/three-tile-doc/3.examples/30.groundGroup/) · [2D Map](https://sxguojf.github.io/three-tile-doc/3.examples/33.2DMap/)                                                                           |
| Advanced         | [Non-Map Tile](https://sxguojf.github.io/three-tile-doc/3.examples/32.notMapTile/) · [3DTiles Rendering](https://sxguojf.github.io/three-tile-doc/3.examples/35.3dtilesRender/) · [SplatLuma](https://sxguojf.github.io/three-tile-doc/3.examples/36.splatLuma/) · [SplatDrei](https://sxguojf.github.io/three-tile-doc/3.examples/37.splatDrei/)                                                                      |

### Application Examples

| Example                                                                                     | Description                   |
| ------------------------------------------------------------------------------------------- | ----------------------------- |
| [First Person](https://sxguojf.github.io/three-tile-doc/4.application/01.firstPerson/)      | First-person view navigation  |
| [Flight Controls](https://sxguojf.github.io/three-tile-doc/4.application/02.flyControls/)   | Free flight mode              |
| [Walking](https://sxguojf.github.io/three-tile-doc/4.application/03.walk/)                  | Ground walking navigation     |
| [Satellite Cloud Map](https://sxguojf.github.io/three-tile-doc/4.application/04.cloud/)     | 3D cloud map display          |
| [Contour Lines](https://sxguojf.github.io/three-tile-doc/4.application/05.contour/)         | Terrain contour lines         |
| [Atmosphere Effects](https://sxguojf.github.io/three-tile-doc/4.application/06.atmosphere/) | Atmospheric rendering effects |
| [GeoJSON 3D](https://sxguojf.github.io/three-tile-doc/4.application/07.GeoJSON3D/)          | GeoJSON 3D building display   |

## 8. References

- https://threejs.org/
- https://github.com/CesiumGS/cesium
- https://github.com/mapbox/mapbox-gl-js
- https://leafletjs.com
- https://github.com/tentone/geo-three
- https://github.com/ebeaufay/threedtiles
- https://github.com/NASA-AMMOS/3DTilesRendererJS
- https://github.com/wlgys8/GPUDrivenTerrainLearn
- https://github.com/lijundacom/LeoGPUDriven
- https://github.com/mapbox/martini
- https://github.com/visgl/loaders.gl/blob/master/modules/terrain/src/lib/helpers/skirt.ts
