# three-tile 插件

https://github.com/sxguojf/three-tile

hz_gjf@163.com

## 1. 安装

```sh
npm i three-tile-plugin
```

```sh
yarn i three-tile-plugin
```

## 2. 使用

### 插件注册

```ts
// 引入插件包
import * as plugin from "three-tile-plugin";

//================================注册加载器====================================
// 注册wrieframe加载器
tt.registerImgLoader(new plugin.TileMaterialWrieLoader());
// 注册瓦片调试加载器
tt.registerImgLoader(new plugin.TileMaterialDebugeLoader());
// 注册logo加载器
tt.registerImgLoader(new plugin.TileMaterialLogoLoader());
// 注册法向量图像加载器
tt.registerImgLoader(new plugin.TileMateriaNormalLoader());
// 注册GeoJSON加载器
tt.registerImgLoader(new plugin.GeoJSONLoader());
// 注册矢量瓦片MVT加载器
tt.registerImgLoader(new plugin.MVTLoader());
// 注册单影像加载器
tt.registerImgLoader(new plugin.SingleImageLoader());
// 注册单影像TIF-DEM加载器
tt.registerDEMLoader(new plugin.SingleTifDEMLoader());
//===============================================================================
```

- Register imageLoader: 'image', Author: 'GuoJF'
- Register terrainLoader: 'lerc', Author: 'GuoJF'
- Register terrainLoader: 'terrain-rgb', Author: 'GuoJF'
- Register imageLoader: 'wireframe', Author: 'GuoJF'
- Register imageLoader: 'debug', Author: 'GuoJF'
- Register imageLoader: 'logo', Author: 'GuoJF'
- Register imageLoader: 'normal', Author: 'GuoJF'
- Register imageLoader: 'geojson', Author: 'GuoJF'
- Register imageLoader: 'mvt', Author: 'GuoJF'
- Register imageLoader: 'single-image', Author: 'GuoJF'
- Register terrainLoader: 'single-tif', Author: 'GuoJF'

### 插件使用
