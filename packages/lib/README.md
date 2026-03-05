three-tile

[![npm version](https://badge.fury.io/js/%40three-tile%2Flib.svg)](https://badge.fury.io/js/%40three-tile%2Flib)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

一个基于 [Three.js](https://threejs.org/) 开发的轻量级三维瓦片地图库，专为 Three.js 应用程序提供高性能的地图渲染能力。

## ✨ 特性

- 🚀 **轻量级设计** - 仅依赖 Three.js，核显即可流畅运行 60FPS
- 📦 **零侵入集成** - 以 Three.js 对象形式提供，不影响现有架构
- 🎯 **TypeScript 原生支持** - 100% TypeScript 开发，完整类型定义
- 🔧 **高度可扩展** - 模块化加载器系统，支持自定义数据源和渲染
- ⚡ **Web Workers 优化** - 复杂计算异步处理，保持主线程流畅
- 🌍 **多投影支持** - 支持 WGS84、Web Mercator 等常用投影系统
- 📊 **多数据格式** - 内置 Terrain-RGB、LERC、DEM 等地形加载器

## 📦 安装

```bash
npm i three-tile -S
# 或
yarn add three-tile -S
```

### 依赖

- **Three.js**: `>=0.171.0`

## 🚀 快速开始

### 基础示例

```html
<!DOCTYPE html>
<html lang="zh-cn">
	<head>
		<meta />
		<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0" />
		<title>three-tile最小化应用</title>
	</head>
	<style>
		html,
		body {
			background-color: #333;
			height: 100%;
			width: 100%;
			padding: 0;
			margin: 0;
			display: flex;
			overflow: hidden;
		}
		#map {
			height: 100%;
			width: 100%;
		}
	</style>

	<script type="importmap">
		{
			"imports": {
				"three": "https://unpkg.com/three@0.171.0/build/three.module.js",
				"three/addons/": "https://unpkg.com/three@0.171.0/examples/jsm/",
				"three-tile": "https://unpkg.com/three-tile@0.11.10/dist"
			}
		}
	</script>

	<body>
		<div id="map"></div>
		<script type="module">
			import * as THREE from "three";
			import * as tt from "three-tile";
			import { MapControls } from "three/addons/controls/MapControls.js";

			console.log(`three-tile v${tt.version} start!`);

			// 创建场景
			const createViewer = container => {
				const width = container.clientWidth;
				const height = container.clientHeight;

				// scene
				const scene = new THREE.Scene();

				// renderer
				const renderer = new THREE.WebGLRenderer();
				renderer.setSize(width, height);

				// camera
				const camera = new THREE.PerspectiveCamera(60, width / height, 10, 4e7);
				camera.position.set(0, camera.far / 2, 0);

				// ambient light
				const ambLight = new THREE.AmbientLight(0xffffff);
				scene.add(ambLight);

				// directional light
				const dirLight = new THREE.DirectionalLight(0xffffff);
				dirLight.position.set(0, 5e6, 1e5);
				dirLight.target.position.set(0, 0, -5e6);
				scene.add(dirLight);

				// controls
				const controls = new MapControls(camera, renderer.domElement);
				controls.maxDistance = 2e7;
				controls.minDistance = 10;
				controls.enableDamping = true;
				// add renderer to container
				container.appendChild(renderer.domElement);

				return {
					scene,
					camera,
					renderer,
					controls,
					ambLight,
					dirLight,
				};
			};

			const createMap = () => {
				// 创建影像数据源
				const imgSource = new tt.TileSource({
					url: "https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
					dataType: "image",
					minLevel: 0,
					maxLevel: 18,
				});

				// 创建地形数据源（可选）
				const demSource = new tt.TileSource({
					url: "https://server.arcgisonline.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer/tile/{z}/{y}/{x}",
					dataType: "lerc",
					minLevel: 5,
					maxLevel: 13,
				});

				// 创建地图
				const map = tt.TileMap.create({
					// 影像数据源
					imgSource: imgSource,
					// 地形数据源
					demSource: demSource,
					lon0: 90,
				});

				return map;
			};

			// 初始化场景
			const viewer = createViewer(document.querySelector("#map"));
			// 创建地图
			const map = createMap();
			// 地图旋转到xz平面
			map.rotateX(-Math.PI / 2);
			// 地图添加到场景
			viewer.scene.add(map);

			// 动画循环
			viewer.renderer.setAnimationLoop(() => {
				viewer.controls.update();
				viewer.renderer.render(viewer.scene, viewer.camera);
			});
		</script>
	</body>
</html>
```

## 🏗️ 核心概念

### TileMap - 地图核心

`TileMap` 是整个库的核心类，继承自 `THREE.Object3D`，负责瓦片的加载、渲染和管理。

```typescript
const map =  TileMap.create(params: MapParams)
```

```typescript
interface MapParams {
	// 影像数据源
	imgSource: ISource[] | ISource;
	// 地形数据源（可选）,默认undefined
	demSource?: ISource;
	// 中央子午线经度,默认0
	lon0?: 0 | 90 | -90;
	// 最小缩放级别,默认2
	minLevel?: number;
	// 地图范围 [minLon, minLat, maxLon, maxLat]
	bounds?: [number, number, number, number];
	// 调试级别 0:关闭, 1+:开启，默认0
	debug?: number;
}
```

### 数据源 (ISource)

数据源定义了瓦片数据的获取方式和元数据信息：

```typescript
const source = new tt.TileSource(params: SourceOptions );
```

```typescript
interface SourceOptions {
	/** 数据类型标识，指示用哪个加载器加载，默认为"image" */
	dataType?: string;
	/** 数据所有者 */
	attribution?: string;
	/** 瓦片最大级别 */
	minLevel?: number;
	/** 瓦片最小级别 */
	maxLevel?: number;
	/** 投影方式，默认3857 */
	projectionID?: ProjectionType;
	/** 图层显示时的透明度，0-1 */
	opacity?: number;
	/* 数据经纬度范围 [minLon,minLat,maxLon,maxLat] */
	bounds?: [number, number, number, number];
	/** 瓦片url模板 */
	url?: string;
	/** 瓦片url子域 */
	subdomains?: string[] | string;
}
```

## 📚 API 参考

### 主要类和接口

| 类/接口      | 描述                                | 主要方法                                                                       |
| ------------ | ----------------------------------- | ------------------------------------------------------------------------------ |
| `TileMap`    | 地图核心类，继承自 `THREE.Object3D` | `geo2world()`, `world2geo()`, `getLocalInfoFromScreen()`, `addEventListener()` |
| `TileSource` | 数据源类，定义瓦片数据来源          | `getUrl()`, `getBounds()`                                                      |

### TileMap 核心属性

```typescript
interface MapParams {
	imgSource: ISource[] | ISource; // 影像数据源
	demSource?: ISource; // 地形数据源（可选）
	lon0?: 0 | 90 | -90; // 中央子午线经度
	minLevel?: number; // 最小缩放级别
	maxLevel?: number; // 最大缩放级别（废弃，自动计算）
	bounds?: [number, number, number, number]; // 地图范围 [minLon, minLat, maxLon, maxLat]
	debug?: number; // 调试级别 0:关闭, 1+:开启
}
```

### TileMap 核心方法

```typescript
// 坐标转换
geo2world(geo: Vector3): Vector3;           // 地理坐标转世界坐标
world2geo(world: Vector3): Vector3;         // 世界坐标转地理坐标
getLocalInfoFromScreen(camera: Camera, pointer: Vector2): LocationInfo | undefined;
getLocalInfoFromGeo(geo: Vector3): LocationInfo | undefined;
getLocalInfoFromWorld(pos: Vector3): LocationInfo | undefined;

// 地图控制
reload(): void;                             // 重新加载地图
update(): void;                             // 手动更新地图
addEventListener(type: string, listener: Function): void;
removeEventListener(type: string, listener: Function): void;
```

### ISource 数据源接口

```typescript
interface ISource {
	dataType: string; // 数据类型标识 ('image', 'terrain-rgb', 'lerc', 'dem' 等)
	url: string; // URL 模板，支持 {x}, {y}, {z} 占位符
	attribution: string; // 版权信息
	minLevel: number; // 最小级别
	maxLevel: number; // 最大级别
	projectionID: "3857" | "4326"; // 投影系统
	opacity?: number; // 透明度
	transparent?: boolean; // 是否透明
	isTMS?: boolean; // 是否为 TMS 服务
	bounds?: [number, number, number, number]; // 数据范围 [minLon,minLat,maxLon,maxLat]
	getUrl(x: number, y: number, z: number): string | undefined;
}
```

### 事件系统

```typescript
// 地图事件类型
type MapEventTypes = "ready" | "tile-loaded" | "tile-unloaded" | "update";

// 监听地图事件
map.addEventListener("ready", () => {
	console.log("地图就绪");
});

map.addEventListener("tile-loaded", event => {
	console.log("瓦片加载完成:", event.tile.x, event.tile.y, event.tile.z);
});

map.addEventListener("update", () => {
	console.log("地图更新");
});
```

### 实用工具函数

```typescript
import {
	waitFor, // 等待条件成立
	registerImgLoader, // 注册影像加载器
	registerDEMLoader, // 注册地形加载器
	getImgLoader, // 获取影像加载器
	getDEMLoader, // 获取地形加载器
	getTileLoaders, // 获取所有加载器
} from "three-tile";

// 等待地图就绪
await waitFor(() => map.isReady);

// 获取特定类型的加载器
const imageLoader = getImgLoader<TileImageLoader>("image");
const terrainLoader = getDEMLoader<TerrainRGBLoader>("terrain-rgb");

// 获取所有加载器信息
const loaders = getTileLoaders();
console.log("影像加载器:", loaders.imgLoaders);
console.log("地形加载器:", loaders.demLoaders);
```

### LocationInfo 地面信息接口

```typescript
interface LocationInfo extends Intersection {
	location: Vector3; // 经纬度信息 (经度, 纬度, 高度米)
	// 继承自 Intersection：
	// - distance: 射线投射原点和相交部分之间的距离
	// - point: 相交部分的点（世界坐标）
	// - face: 相交的面
	// - faceIndex: 相交的面的索引
	// - object: 相交的物体
	// - uv: 相交部分的点的 UV 坐标
	// - normal: 交点处的内插法向量
}
```

## 🎯 示例

### 设置地图边界

```typescript
// 限制地图显示范围（中国范围）
const map = new TileMap({
	imgSource: imgSource,
	demSource: demSource,
	bounds: [73.66, 3.86, 135.08, 53.55], // [minLon, minLat, maxLon, maxLat]
	lon0: 90,
});

// 获取投影边界
const projBounds = map.projection.getProjBoundsFromLonLat(map.bounds);
console.log("投影边界:", projBounds);
```

### 地图阴影效果

```typescript
import { DirectionalLight } from "three";

// 设置环境光
const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

// 设置方向光（产生阴影）
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(100000, 100000, 100000);
directionalLight.castShadow = true;

// 配置阴影渲染参数
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 500000;

scene.add(directionalLight);

// 配置地图接收阴影
map.castShadow = false; // 地图不投射阴影
map.receiveShadow = true; // 地图接收阴影

// 配置渲染器支持阴影
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
```

### 地理坐标转换

```typescript
// 地理坐标转世界坐标
const geoPos = new THREE.Vector3(116.3974, 39.9093, 0); // 北京天安门
const worldPos = map.geo2world(geoPos);

// 世界坐标转地理坐标
const geoPos2 = map.world2geo(worldPos);
console.log(`经度: ${geoPos2.x}, 纬度: ${geoPos2.y}`);

// 投影坐标转换
const projPos = map.projection.forward(geoPos); // 地理坐标转投影坐标
const geoPos3 = map.projection.inverse(projPos); // 投影坐标转地理坐标
```

### 获取地面信息

```typescript
// 从屏幕坐标获取地面信息
const mouse = new THREE.Vector2(
	(event.clientX / window.innerWidth) * 2 - 1,
	-(event.clientY / window.innerHeight) * 2 + 1
);
const groundInfo = map.getLocalInfoFromScreen(camera, mouse);

if (groundInfo) {
	console.log("地面位置:", groundInfo.location); // 经度、纬度、高度(米)
	console.log("世界坐标:", groundInfo.point);
	console.log("法向量:", groundInfo.normal); // 可计算坡向、坡度
	console.log("UV坐标:", groundInfo.uv);
}

// 从经纬度获取地面信息
const geoPos = new THREE.Vector3(116.3974, 39.9093, 0);
const groundInfo2 = map.getLocalInfoFromGeo(geoPos);

// 从世界坐标获取地面信息
const worldPos = new THREE.Vector3(x, y, z);
const groundInfo3 = map.getLocalInfoFromWorld(worldPos);
```

### 多数据源支持

```typescript
// 使用多个影像数据源
const map = new TileMap({
	imgSource: [
		new TileSource({
			url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
			dataType: "image",
			attribution: "© OpenStreetMap",
		}),
		new TileSource({
			url: "https://satellite.example.com/{z}/{x}/{y}.jpg",
			dataType: "image",
			attribution: "© Example Satellite",
		}),
	],
	demSource: new TileSource({
		url: "https://terrain.example.com/{z}/{x}/{y}.png",
		dataType: "terrain-rgb",
		attribution: "© Example Terrain",
	}),
});

// 动态切换数据源
map.imgSource = [newDataSource];
map.reload(); // 重新加载地图
```

### 地图事件系统

```typescript
// 监听地图就绪事件
map.addEventListener("ready", () => {
	console.log("地图加载完成");
});

// 监听瓦片加载事件
map.addEventListener("tile-loaded", event => {
	console.log(`瓦片加载完成: ${event.tile.x},${event.tile.y},${event.tile.z}`);
});

// 监听地图更新事件
map.addEventListener("update", () => {
	// 更新UI状态
});

// 监听点击事件
window.addEventListener("click", event => {
	const mouse = new THREE.Vector2(
		(event.clientX / window.innerWidth) * 2 - 1,
		-(event.clientY / window.innerHeight) * 2 + 1
	);

	const groundInfo = map.getLocalInfoFromScreen(camera, mouse);
	if (groundInfo) {
		// 在点击位置放置模型
		const marker = new THREE.Mesh(
			new THREE.SphereGeometry(100, 32, 16),
			new THREE.MeshBasicMaterial({ color: 0xff0000 })
		);
		marker.position.copy(groundInfo.point);
		marker.position.y += 100; // 稍微抬高一点
		scene.add(marker);
	}
});
```

### 获取地面信息（地形采样）

```typescript
// 从屏幕坐标获取地面信息
const mouse = new THREE.Vector2(event.clientX, event.clientY);
const groundInfo = map.getGroundInfoFromScreen(mouse, camera);

if (groundInfo) {
	console.log("地面位置:", groundInfo.location);
	console.log("经纬度:", groundInfo.lonLat);
	console.log("高度:", groundInfo.height);
}
```

## 🏛️ 架构设计

### 模块结构

```
src/
├── tile/           # 瓦片核心
├── map/            # 地图管理
├── source/         # 数据源
├── loader/         # 加载器系统
├── geometry/       # 几何体处理
├── material/       # 材质系统
└── layers/         # 图层管理
```

### 性能优化

- **Web Workers**: 地形解析等复杂计算在 Worker 中执行，保持主线程流畅
- **对象池**: 复用 Vector3、Matrix4 等临时对象，减少内存分配
- **LOD 系统**: 根据距离动态调整瓦片精度，远距离使用低精度瓦片
- **异步加载**: 非阻塞的瓦片数据加载，支持并发下载
- **智能缓存**: 自动管理瓦片缓存，避免重复下载
- **视锥剔除**: 只渲染摄像机可见范围内的瓦片
- **按需加载**: 根据摄像机位置和缩放级别智能加载瓦片

### DLOD (Dynamic Level Of Details)

three-tile 采用独特的 DLOD 技术实现高性能渲染：

```typescript
// 地图更新机制
class TileMap extends THREE.Object3D {
	private updateInterval = 200; // 200ms 更新一次
	private tileSize = 4096; // 瓦片大小

	// 自动计算 LOD 级别
	private calculateLOD(tile: Tile, camera: Camera): number {
		const distance = tile.position.distanceTo(camera.position);
		return Math.floor(Math.log2(distance / this.tileSize));
	}

	// 动态细分或合并瓦片
	private updateLOD(): void {
		// 根据距离决定是否细分或合并瓦片
		// 实现四叉树结构的动态调整
	}
}
```

## 🛠️ 开发指南

### 构建命令

```bash
# 开发模式（监听文件变化）
npm run dev

# 构建生产版本
npm run build

# 类型检查
npm run build  # 包含 tsc 编译
```

### 调试模式

```typescript
// 启用调试信息
const map = new TileMap({
	imgSource: source,
	debug: 1, // 0: 关闭, 1+: 开启调试
});

// 调试信息包括：
// - 瓦片加载状态
// - 性能统计
// - 网络请求日志
```

### 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 代码规范

- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 使用 Prettier 格式化代码
- 编写 JSDoc 注释

## 🆕 更新日志

### v0.11.10

- 🎉 优化 Martini 地形算法性能，提升地形渲染速度
- 🐛 修复 Web Worker 内存泄漏问题，提高长时间运行稳定性
- ✨ 新增投影边界计算功能 `getProjBoundsFromLonLat()`
- 📚 完善 TypeScript 类型定义文件，提供更好的开发体验
- 🔧 改进瓦片加载机制，减少重复下载

### v0.11.9

- 🌟 新增地图边界设置功能，支持指定显示范围
- 🚀 优化瓦片缓存算法，提高内存利用效率
- 📱 改进移动端触摸交互支持
- 🛠️ 修复投影转换精度问题

### v0.11.8

- ⚡ Web Workers 优化地形解析，主线程不再阻塞
- 🎨 新增地形夸张功能，支持动态调整地形高度
- 🔍 完善调试模式，提供更详细的瓦片加载信息
- 🐛 修复摄像机碰撞检测的边界情况

### v0.11.7

- 🌍 支持多种投影系统（WGS84、Web Mercator 等）
- 📦 模块化重构，支持按需导入减少包体积
- 🎯 新增精确的地面信息获取方法
- 🛡️ 增强错误处理和异常恢复机制

### v0.11.6

- 🔄 重构加载器系统架构，提升扩展性
- 🎭 新增自定义着色器支持
- 📊 改进性能监控和统计功能
- 🐱 支持瓦片纹理压缩格式

### v0.11.5

- 🎉 首次发布，核心功能完善
- 🌐 支持标准 WMTS/TMS 瓦片服务
- 🏔️ 支持 Terrain-RGB、LERC、DEM 地形格式
- 🚀 实现动态 LOD 渲染算法

查看完整更新日志：[CHANGELOG.md](./CHANGELOG.md)

## 📄 许可证

本项目采用 [MIT 许可证](./LICENSE)。

## 🔗 相关链接

- **📚 官方文档**: [https://sxguojf.github.io/three-tile-doc/](https://sxguojf.github.io/three-tile-doc/)

  - 完整的 API 文档和详细教程
  - 38+ 实用示例和应用场景
  - Vue/React 集成指南

- **🐛 问题反馈**: [https://github.com/sxguojf/three-tile/issues](https://github.com/sxguojf/three-tile/issues)

  - Bug 报告和功能请求
  - 技术问题讨论
  - 社区支持和帮助

- **🏠 项目主页**: [https://github.com/sxguojf/three-tile](https://github.com/sxguojf/three-tile)

  - 源代码和开发进展
  - 贡献指南和开发文档
  - 版本发布和更新日志

- **📖 相关博客**: [https://blog.csdn.net/HZGJF/article/details/140280844](https://blog.csdn.net/HZGJF/article/details/140280844)
  - 项目介绍和技术原理
  - 开发心得和最佳实践
  - 性能优化技巧

## 🎯 常见应用场景

### 🗺️ 地理信息系统 (GIS)

- 数字孪生城市建模
- 三维地理信息可视化
- 地形分析和测量
- 空间数据展示

### 🎮 游戏开发

- 开放世界游戏地图
- 第一人称/第三人称游戏
- 地形生成和渲染
- 场景导航系统

### 🏗️ 建筑和规划

- 城市规划展示
- 建筑群可视化
- 地形分析和规划
- 工程项目管理

### 📊 数据可视化

- 大数据地理展示
- 实时数据地图
- 统计信息可视化
- 航空/气象数据

### 🎓 教育科研

- 地理教学工具
- 科研数据展示
- 模拟训练系统
- 学术研究可视化

## 🎨 特色功能

### 🌍 多数据源支持

- **影像数据**: OpenStreetMap、Google Maps、ArcGIS、高德、腾讯等
- **地形数据**: Terrain-RGB、LERC、TIFF 等格式
- **矢量数据**: GeoJSON、MVT (Mapbox Vector Tiles)
- **自定义数据**: 支持通过插件扩展任何数据格式

### 🚀 高性能渲染

- **DLOD 算法**: 动态细节层次优化
- **Web Workers**: 复杂计算异步处理
- **智能缓存**: 自动瓦片缓存管理
- **视锥剔除**: 只渲染可见区域

### 🔧 丰富的插件生态

- **地图控制**: 多种控制器模式（飞行、行走、第一人称等）
- **可视化工具**: 等高线、热力图、粒子效果等
- **3D 模型**: GLTF/GLB 模型加载和展示
- **环境效果**: 大气渲染、水体模拟、天空盒等

## 🤝 致谢

感谢以下开源项目的启发和支持：

- **[Three.js](https://threejs.org/)** - 强大的 3D 图形库，本项目的基础
- **[Mapbox Martini](https://github.com/mapbox/martini)** - 优秀的地形网格算法
- **[Cesium](https://github.com/CesiumGS/cesium)** - 专业的 3D 地球引擎，提供了很多设计灵感
- **[Mapbox GL JS](https://github.com/mapbox/mapbox-gl-js)** - 矢量瓦片渲染技术参考
- **[Leaflet](https://leafletjs.com/)** - 轻量级地图库，API 设计参考
- **[Geo-three](https://github.com/tentone/geo-three)** - Three.js 地球引擎，架构参考

## 📜 许可证信息

**注意**: 本库不含任何地图数据，示例中使用的地图数据均为第三方服务，使用时请遵守相关法律法规和版权要求。

### 数据源版权声明

- 使用商业地图数据时请遵守相应服务商的条款
- 自定义数据源的使用请确保拥有合法授权

---

**Made with ❤️ by Guo Jiangfeng**
