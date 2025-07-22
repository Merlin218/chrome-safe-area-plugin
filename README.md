# Chrome Safe Area Plugin

> 一个用于模拟移动设备安全区域插入的现代化 Chrome 扩展，使用 TypeScript + Vite 构建。

## ✨ 功能特性

### 📱 设备支持
- **20+ 主流设备**: iPhone、Android、iPad 等多种设备型号
- **真实硬件特征**: 刘海、动态岛、打孔屏、Home 指示器精确模拟
- **自定义配置**: 支持自定义安全边距值

### 🎨 视觉效果
- **真实设备外观**: 精确还原各品牌设备的外观和颜色
- **可视化控制**: 实时切换安全边距和内容显示区域
- **横竖屏支持**: 完整的设备方向模拟

### 💻 开发体验
- **TypeScript 支持**: 完整的类型安全和开发体验
- **现代构建系统**: 基于 Vite 的高性能构建
- **实时预览**: 支持开发模式下的实时重载

## 🚀 快速开始

### 环境要求
- Node.js 16+
- npm 7+
- Chrome 浏览器

### 安装和构建

```bash
# 克隆项目
git clone https://github.com/username/chrome-safe-area-plugin.git
cd chrome-safe-area-plugin

# 安装依赖
npm install

# 构建扩展
npm run build

# 构建并打包（用于 Chrome Web Store 发布）
npm run build:zip
```

### 加载到 Chrome

1. 打开 Chrome 浏览器，访问 `chrome://extensions/`
2. 启用"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择项目中的 `dist` 文件夹

详细安装说明请参考 [INSTALLATION.md](./INSTALLATION.md)

## 🔧 开发

### 开发命令

```bash
# 开发模式（构建 + 监听）
npm run dev

# 仅监听模式
npm run dev:watch

# 类型检查
npm run type-check

# 代码检查
npm run lint

# 修复代码问题
npm run lint:fix

# 完整验证
npm run validate

# 清理构建
npm run clean
```

### 项目结构

```
chrome-safe-area-plugin/
├── src/                    # TypeScript 源代码
│   ├── background.ts       # Service Worker
│   ├── content.ts          # Content Script
│   ├── popup.ts           # Popup 脚本
│   ├── devices.ts         # 设备配置
│   ├── phone-*.ts         # 设备渲染组件
│   └── manifest.json      # 扩展清单
├── icons/                 # 图标资源
├── dist/                  # 构建输出
├── scripts/               # 构建脚本
├── types/                 # TypeScript 类型定义
├── popup.html            # Popup HTML
├── popup.css             # Popup 样式
├── vite.config.ts        # Vite 配置
├── tsconfig.json         # TypeScript 配置
└── .eslintrc.json        # ESLint 配置
```

## 📚 文档

- [安装指南](./INSTALLATION.md) - 详细的安装和使用说明
- [构建系统](./BUILD_SYSTEM.md) - 构建系统架构和规范
- [测试说明](./TESTING.md) - 单元测试框架和运行方法
- [故障排除](./TROUBLESHOOTING.md) - 常见问题和解决方案
- [功能更新](./FEATURE_UPDATE.md) - 最新功能介绍
- [快速开始](./QUICKSTART.md) - 快速上手指南
- [TypeScript 迁移](./TYPESCRIPT_MIGRATION.md) - TypeScript 迁移说明

## 🎯 使用方法

1. **启动扩展**: 点击浏览器工具栏中的扩展图标
2. **选择设备**: 从下拉菜单选择要模拟的设备
3. **启用模拟**: 切换开关启用安全边距模拟
4. **查看效果**: 页面将显示对应的安全边距效果

### 支持的设备

#### iPhone 系列
- iPhone 15 Pro Max/Pro/Plus/15 (动态岛)
- iPhone 14 Pro Max/Pro/Plus/14 (动态岛/刘海)
- iPhone 13 Pro Max/Pro/mini/13 (刘海)
- iPhone 12 Pro Max/Pro/mini/12 (刘海)
- iPhone 11 Pro Max/Pro/11 (刘海)
- iPhone XS Max/XS/XR/X (刘海)

#### Android 系列
- Google Pixel 7 Pro/7/6 Pro/6 (打孔屏)
- Samsung Galaxy S23/S22/S21 系列 (打孔屏)
- OnePlus 9 Pro/9 (打孔屏)

#### 平板设备
- iPad Pro 12.9"/11" (圆角屏幕)
- iPad Air (圆角屏幕)

## 🛠️ 构建系统

项目使用现代化的构建系统：

- **Vite**: 快速的现代前端构建工具
- **TypeScript**: 类型安全的 JavaScript 超集
- **ESLint**: 代码质量检查
- **自动化流程**: 集成类型检查、代码检查和构建

详细信息请参考 [BUILD_SYSTEM.md](./BUILD_SYSTEM.md)

## 🔧 技术栈

- **语言**: TypeScript 5.x
- **构建工具**: Vite 5.x
- **包管理**: npm
- **代码检查**: ESLint + TypeScript ESLint
- **API**: Chrome Extension Manifest V3

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License - 详见 [LICENSE](./LICENSE) 文件

---

**🎉 享受使用 Chrome Safe Area Plugin 进行移动端开发！** 