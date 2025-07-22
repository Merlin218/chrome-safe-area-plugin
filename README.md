# Chrome Safe Area Plugin

> 一个用于模拟移动设备安全区域插入的现代化 Chrome 扩展，使用 TypeScript + WXT 框架构建。

## ✨ 功能特性

### 📱 设备支持
- **30+ 主流设备**: iPhone、Android、iPad 等多种设备型号
- **真实硬件特征**: 刘海、动态岛、打孔屏、Home 指示器精确模拟
- **硬件区域渲染**: 支持完整的硬件元素展示（状态栏、相机传感器等）
- **自定义配置**: 支持自定义安全边距值

### 🎨 视觉效果
- **真实设备外观**: 精确还原各品牌设备的外观和颜色
- **可视化控制**: 实时切换安全边距和内容显示区域
- **调试叠加层**: 直观的安全边距可视化
- **横竖屏支持**: 完整的设备方向模拟

### 💻 开发体验
- **TypeScript 支持**: 完整的类型安全和开发体验
- **WXT 框架**: 现代化的 Web 扩展开发框架
- **热重载**: 开发模式下的实时重载
- **SPA 路由检测**: 自动检测单页应用路由变化

## 🚀 快速开始

### 环境要求
- Node.js 16+
- npm 或 pnpm
- Chrome 浏览器

### 安装和构建

```bash
# 克隆项目
git clone https://github.com/username/chrome-safe-area-plugin.git
cd chrome-safe-area-plugin

# 安装依赖
npm install

# 开发模式（带热重载）
npm run dev

# 生产构建
npm run build

# 构建并打包（用于 Chrome Web Store 发布）
npm run build:zip
```

### 加载到 Chrome

1. 打开 Chrome 浏览器，访问 `chrome://extensions/`
2. 启用"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择项目中的 `.output/chrome-mv3` 文件夹

## 🔧 开发

### 开发命令

```bash
# 开发模式（WXT 热重载）
npm run dev

# 快速构建（单次构建）
npm run dev:fast

# 生产构建
npm run build

# 类型检查
npm run type-check

# 代码检查
npm run lint

# 修复代码问题
npm run lint:fix

# 完整验证（类型检查 + 代码检查 + 测试）
npm run validate

# 清理构建
npm run clean

# 运行测试
npm test

# 生成图标
npm run generate-icons
```

### 项目结构

```
chrome-safe-area-plugin/
├── entrypoints/              # WXT 入口点
│   ├── background.ts         # 后台脚本
│   ├── content.ts           # 内容脚本
│   └── popup/               # 弹窗界面
│       ├── index.html
│       ├── main.ts
│       └── style.css
├── src/                     # 源代码
│   ├── shared/              # 共享模块
│   │   ├── devices.ts       # 设备数据库
│   │   └── utils.ts         # 工具函数
│   ├── hardware-renderer.ts # 硬件区域渲染器
│   ├── phone-frame-simple.ts # 设备框架组件
│   └── phone-mockup.ts      # 设备预览组件
├── icons/                   # 扩展图标
├── .output/                 # WXT 构建输出
├── tests/                   # 单元测试
├── types/                   # TypeScript 类型定义
├── wxt.config.ts           # WXT 配置
├── tsconfig.json           # TypeScript 配置
└── vitest.config.ts        # 测试配置
```

## 🎯 使用方法

1. **启动扩展**: 点击浏览器工具栏中的扩展图标
2. **选择设备**: 从下拉菜单选择要模拟的设备
3. **启用模拟**: 切换开关启用安全边距模拟
4. **调试模式**: 点击设置按钮启用硬件区域可视化
5. **查看效果**: 页面将显示对应的安全边距和硬件区域效果

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
- Samsung Galaxy S23 Ultra/S23/S22 Ultra/S22/S21 系列 (打孔屏)
- OnePlus 9 Pro/9 (打孔屏)

#### 平板设备
- iPad Pro 12.9"/11" (圆角屏幕)
- iPad Air (圆角屏幕)

### CSS 变量

扩展会自动注入以下 CSS 变量到页面中：

```css
:root {
  --safe-area-inset-top: 44px;
  --safe-area-inset-bottom: 34px;
  --safe-area-inset-left: 0px;
  --safe-area-inset-right: 0px;
}
```

在你的 CSS 中使用：

```css
.app-header {
  padding-top: var(--safe-area-inset-top);
}

.app-content {
  padding-left: var(--safe-area-inset-left);
  padding-right: var(--safe-area-inset-right);
}

.app-footer {
  padding-bottom: var(--safe-area-inset-bottom);
}
```

## 🛠️ 技术架构

### 核心技术栈
- **WXT**: 现代化的 Web 扩展开发框架
- **TypeScript**: 类型安全的 JavaScript 超集
- **Vite**: 高性能构建工具
- **Vitest**: 现代化的测试框架
- **ESLint**: 代码质量检查

### 主要组件
- **SafeAreaInjector**: CSS 注入和 SPA 路由检测
- **HardwareRegionsRenderer**: 硬件区域可视化渲染
- **PhoneFrameSimple**: 设备框架叠加系统
- **PhoneMockup**: 弹窗中的设备预览

### WXT 框架优势
- **文件基础路由**: 自动识别入口点
- **热重载开发**: 修改代码自动重新加载扩展
- **TypeScript 集成**: 完整的类型支持
- **多浏览器支持**: 支持 Chrome、Firefox、Safari

## 🧪 测试

```bash
# 运行测试（监听模式）
npm test

# 运行测试（单次）
npm run test:run

# 测试覆盖率
npm run test:coverage

# 测试 UI
npm run test:ui
```

项目包含完整的单元测试套件，覆盖：
- 设备配置验证
- 内容脚本功能
- 后台脚本逻辑
- UI 组件渲染

## 🚀 发布

### 创建发布包

```bash
# 构建并打包
npm run build:zip

# 手动打包已有构建
npm run package
```

生成的 ZIP 包位于 `packages/` 目录，可直接上传到 Chrome Web Store。

### 文件命名规则
- 格式：`chrome-safe-area-plugin-v{version}-{timestamp}.zip`
- 包含版本号和构建时间戳
- 支持最大压缩优化

## 📚 开发指南

### 添加新设备

1. 在 `src/shared/devices.ts` 中添加设备配置：

```typescript
{
  name: "iPhone 16 Pro",
  brand: "Apple",
  safeAreaInsets: {
    top: 59,
    bottom: 34,
    left: 0,
    right: 0
  },
  appearance: {
    // 设备外观配置
  },
  hardwareRegions: {
    // 硬件区域配置
  }
}
```

2. 测试新设备配置
3. 运行 `npm run validate` 确保代码质量

### 自定义硬件区域

硬件区域支持多种类型：
- `dynamic-island`: 动态岛
- `notch`: 传统刘海
- `punch-hole`: 打孔屏
- `status-bar`: 状态栏
- `home-indicator`: Home 指示器

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 开发流程
1. Fork 项目
2. 创建功能分支
3. 提交代码并通过 `npm run validate`
4. 创建 Pull Request

## 📄 许可证

MIT License - 详见 [LICENSE](./LICENSE) 文件

---

**🎉 享受使用 Chrome Safe Area Plugin 进行移动端开发！** 