# AGENTS.md - three-tile 开发指南

本文档为在 three-tile 代码库中工作的代理编码助手提供指导。

## 项目概述

three-tile 是一个基于 Three.js 的轻量级瓦片地图库，采用 monorepo 架构：

- `packages/lib/` - 核心库
- `packages/plugin/` - 插件扩展
- `packages/demo/` - 演示应用

## 构建命令

### 开发环境

```bash
npm run dev          # 启动 demo 开发服务器
npm run dev --workspace=packages/lib     # 监听构建 lib 包
npm run dev --workspace=packages/plugin  # 监听构建 plugin 包
```

### 构建命令

```bash
npm run build        # 构建所有包（lib + plugin）并复制到根目录
npm run build:lib    # 构建 lib 包
npm run build:plugin # 构建 plugin 包
npm run build:demo   # 构建 demo 应用
```

### 代码格式化

```bash
npm run format       # 使用 prettier 格式化所有 ts/json/md 文件
```

### TypeScript 编译

```bash
# 各包内使用 tsc 进行类型检查
npm run build --workspace=packages/lib  # 包含 tsc && vite build
```

## 代码风格指南

### 导入规范

- 使用 ES6 模块导入语法 (`import { } from "..."`)
- Three.js 相关导入: `import { Mesh, Material } from "three"`
- 相对路径导入: `import { ISource } from "../source"`
- 外部库放在前面，相对路径放在后面

### 命名约定

- **类名**: PascalCase (如 `TileLoader`, `GeometryLoader`)
- **接口名**: 以 I 开头的 PascalCase (如 `ISource`, `ITileLoader`)
- **函数/方法**: camelCase (如 `registerLoader`, `getTileLoaders`)
- **变量/属性**: camelCase (如 `_maxThreads`, `cameraWorldPosition`)
- **常量**: UPPER_SNAKE_CASE (如 `cameraWorldPosition`)
- **文件名**: PascalCase.ts (如 `TileLoader.ts`, `ITileLoader.ts`)

### TypeScript 规范

- 启用严格模式 (`"strict": true`)
- 启用未使用变量检查 (`"noUnusedLocals": true`, `"noUnusedParameters": true`)
- 使用显式返回值检查 (`"noImplicitReturns": true`)
- 优先使用接口定义类型，使用 type 定义联合类型
- 避免使用 `any`，如必须使用请添加注释说明原因

### 注释和文档

- 使用 JSDoc 格式的文件头注释：

```typescript
/**
 *@description: 简要描述
 *@author: 作者名
 *@date: 2023-04-05
 */
```

- 导出的类和方法必须有 JSDoc 注释
- 复杂逻辑添加行内注释说明

### 代码组织

- 每个文件只导出一个主要类/接口
- 使用 `export * from "./module"` 重新导出子模块
- 工厂类使用静态方法创建实例
- 使用私有字段和方法 (\_前缀) 封装内部实现

### 错误处理

- 使用 try-catch 包装可能出错的操作
- 优先返回 Promise 而非抛出异常
- 在异步操作中提供有意义的错误信息
- 使用 TypeScript 的可选链操作符 (?.) 避免空指针

### 性能考虑

- 复杂计算使用 Web Workers (如解析 LERC/DEM 数据)
- 使用对象池减少内存分配 (如 Vector3, Matrix4 临时变量)
- 按需加载和懒加载策略
- 避免在渲染循环中创建新对象

### Three.js 特定规范

- 继承自 Three.js 类时保持命名一致性
- 使用 `BufferGeometry` 而非 `Geometry`
- 材质使用统一的管理模式
- 正确处理资源释放 (dispose, remove)

## 包管理

### Workspaces

- 使用 npm workspaces 管理多包依赖
- 内部包引用使用相对路径: `"three-tile": "../lib"`
- 版本号保持同步，根包的 package.json 作为主版本

### 依赖管理

- Three.js 作为 peerDependency (`"three": "0.171.0"`)
- 构建工具: Vite + TypeScript
- 代码格式化: Prettier
- 类型定义: @types/three

## 开发工具配置

### TypeScript

- 目标版本: ES2020
- 模块系统: ES2020 + bundler resolution
- 严格模式: 启用所有严格检查

### Vite 构建配置

- 库模式构建，支持 UMD 和 ESM
- 外部依赖: three, three-tile
- 生成类型定义文件

### VS Code 设置

- 保存时自动格式化
- 粘贴时自动格式化
- 中文聊天语言支持

## 测试指南

目前项目未配置自动化测试，代码验证通过：

1. TypeScript 编译检查
2. Demo 应用运行验证
3. 构建过程验证

如需添加测试，建议使用：

- 单元测试: Jest + @types/jest
- E2E 测试: Playwright 或 Cypress
- 组件测试: Testing Library

## 提交规范

- 提交前运行 `npm run format` 格式化代码
- 确保 TypeScript 编译无错误
- 测试 Demo 应用正常运行
- 遵循语义化版本控制

## 常见问题

### Q: 如何添加新的瓦片加载器？

A: 实现 `ITileGeometryLoader` 或 `ITileMaterialLoader` 接口，使用 `registerDEMLoader()` 或 `registerImgLoader()` 注册。

### Q: 如何添加新的地图源？

A: 实现 `ISource` 接口，在 plugin 的 mapSource 目录下创建源文件。

### Q: 调试建议？

A: 使用 Chrome DevTools，关注 Web Workers 状态，查看网络请求和内存使用情况。

## 注意事项

- 避免在核心库中添加第三方依赖
- 保持 API 向后兼容性
- Web Workers 中无法访问 DOM
- 注意内存泄漏，正确释放 Three.js 资源
- 考虑移动端性能限制
