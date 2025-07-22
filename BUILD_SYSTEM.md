# Chrome Safe Area Plugin - 构建系统规范

## 📋 概述

本项目已升级到使用 **Vite** 作为主要构建工具，替换了之前的自定义构建脚本，提供更可靠和规范的构建流程。

## 🔧 构建系统架构

### 主要工具
- **Vite 5.x** - 现代前端构建工具
- **TypeScript 5.x** - 类型检查和编译
- **ESLint** - 代码质量检查
- **npm** - 包管理器

### 构建配置文件
- `vite.config.ts` - Vite 主配置
- `tsconfig.json` - TypeScript 配置
- `package.json` - 构建脚本定义

## 🚀 构建命令

### 开发模式
```bash
# 构建并启动监听模式
npm run dev

# 仅启动监听模式
npm run dev:watch
```

### 生产构建
```bash
# 完整构建（类型检查 + 构建）
npm run build

# 仅构建（跳过类型检查）
vite build
```

### 质量检查
```bash
# TypeScript 类型检查
npm run type-check

# ESLint 代码检查
npm run lint

# 修复 ESLint 错误
npm run lint:fix

# 完整验证（类型 + 代码质量）
npm run validate
```

### 工具命令
```bash
# 清理构建目录
npm run clean

# 生成图标
npm run generate-icons

# 清理图标文件
npm run clean-icons
```

## 📁 构建输出

构建后的文件位于 `./dist` 目录：

```
dist/
├── background.js      # Service Worker
├── content.js         # Content Script
├── popup.js          # Popup 脚本
├── devices.js        # 设备数据
├── phone-*.js        # 可选组件
├── manifest.json     # 扩展清单
├── popup.html        # Popup HTML
├── popup.css         # Popup 样式
├── icons/            # 图标资源
└── *.js.map         # Source Maps
```

## 🎯 构建特性

### ✅ 优势
1. **类型安全** - 完整的 TypeScript 支持
2. **现代化** - 使用 ES2020 标准
3. **调试友好** - 生成 Source Maps
4. **快速构建** - Vite 的高性能构建
5. **自动化** - 集成类型检查和代码质量检查
6. **扩展验证** - 自动验证 Chrome 扩展结构

### 🔧 关键配置

#### TypeScript 配置
- 目标: ES2020
- 模块解析: bundler 模式
- 严格类型检查: 启用
- 路径别名: `@/*` → `src/*`

#### Vite 配置
- 输出格式: ES Modules
- 多入口点: 支持所有脚本文件
- 外部依赖: Chrome APIs
- 静态资源: 自动复制和验证

## 🔄 迁移说明

### 从旧构建系统迁移
- ✅ 保留原有的 `scripts/build.cjs`（作为 `build:legacy`）
- ✅ 新增 Vite 构建流程
- ✅ 统一使用 `npm run build`
- ✅ 改进的错误处理和验证

### 兼容性
- Node.js 16+ 
- Chrome Extension Manifest V3
- 现代浏览器 ES2020 支持

## 🐛 故障排除

### 常见问题

1. **构建失败 - 类型错误**
   ```bash
   npm run type-check  # 单独检查类型
   ```

2. **构建失败 - ESLint 错误**
   ```bash
   npm run lint:fix    # 自动修复
   ```

3. **需要使用旧构建系统**
   ```bash
   npm run build:legacy  # 使用原有构建脚本
   ```

### 调试模式
- Source Maps 已启用，可在 Chrome DevTools 中调试原始 TypeScript 代码
- 未压缩代码，便于问题排查

## 📊 构建性能

- ⚡ 初次构建: ~100ms
- 🔄 增量构建: ~50ms
- 📦 输出大小: ~40KB （未压缩）
- 🗺️ Source Maps: 包含

## 🔮 未来改进

- [ ] 添加单元测试集成
- [ ] 集成代码覆盖率报告
- [ ] 自动化 Chrome 商店打包
- [ ] 多环境配置支持

---

*最后更新: 2024年7月* 