[English](README.md) | [简体中文](README_CN.md)

# **three-tile V0.11.8**

<p align='right'>hz_gjf@163.com</p>

<img src="./images/wechat.jpg" width = 300 height = 400>

## Home（Document、Example...）:

[![home](./images/home.png)](https://sxguojf.github.io/three-tile-doc/)

Document：https://sxguojf.github.io/three-tile-doc/

## 1 Introduction

three-tile is a lightweight 3D tile map library developed based on [threejs](https://threejs.org/). It offers advantages such as ease of use and low resource consumption, and provides a lightweight 3D terrain model suitable for adding 3D maps to applications developed with threejs.

For more details, please visit: [https://blog.csdn.net/HZGJF/article/details/140280844](https://blog.csdn.net/HZGJF/article/details/140280844)

Note: This is neither Cesium nor Mapbox-gl, and it has no relationship with these 3D GIS frameworks.

Source: [https://github.com/sxguojf/three-tile](https://github.com/sxguojf/three-tile)

Demo: [https://sxguojf.github.io/mydemo/three-tile/index.html](https://sxguojf.github.io/mydemo/three-tile/index.html)

Document: [https://sxguojf.github.io/three-tile-doc/](https://sxguojf.github.io/three-tile-doc/)

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

- This framework does not contain any map data. The maps used in the examples directly call third-party data. Please comply with legal and regulatory requirements when using them.

### 1.1 Features

- Lightweight: The map is provided as a 3D model, without any impact on the existing program architecture.
- Few dependencies: The entire framework only has one dependency, which is threejs (R165).
- Fast: Low resource consumption, capable of running smoothly at 60FPS even on integrated graphics.
- Easy to use: Familiarity with threejs means virtually no learning curve.
- Highly extensible: Data, models, textures, materials, and the rendering process can all be extended and replaced according to your needs.

### 1.2 Development Environment

- Language: 100% TypeScript
- IDE: VSCode
- Bundler: Vite 4.0
- Dependency: three 0.171

---

## 3. References

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
