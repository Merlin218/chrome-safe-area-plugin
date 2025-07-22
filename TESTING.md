# Chrome Safe Area Plugin - 测试说明

## 📋 测试概述

本项目使用现代化的测试框架为 Chrome 扩展提供全面的单元测试覆盖。

## 🔧 测试架构

### 测试框架
- **Vitest** - 快速的现代测试框架，与 Vite 无缝集成
- **jsdom** - 浏览器环境模拟，支持 DOM 操作测试
- **TypeScript** - 完整的类型安全测试

### 测试环境配置
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts']
  }
})
```

### Chrome API 模拟
通过 `tests/setup.ts` 文件模拟 Chrome 扩展 APIs：
- `chrome.runtime.*` - 运行时消息和事件
- `chrome.storage.*` - 同步和本地存储
- `chrome.tabs.*` - 标签页操作和查询
- `chrome.notifications.*` - 通知功能

## 🚀 运行测试

### 基本命令
```bash
# 运行所有测试
npm test

# 运行测试（一次性）
npm run test:run

# 监听模式（开发时）
npm run test:watch

# 测试覆盖率
npm run test:coverage

# 可视化测试界面
npm run test:ui
```

### 开发工作流
```bash
# 开发时推荐使用监听模式
npm run test:watch

# 提交前完整验证
npm run validate  # 包含类型检查 + 代码检查 + 测试
```

## 📁 测试文件结构

```
tests/
├── setup.ts              # 测试环境配置和 Chrome API 模拟
├── unit/                  # 单元测试
│   ├── devices.test.ts    # 设备配置测试
│   ├── background.test.ts # 后台脚本测试
│   ├── content.test.ts    # 内容脚本测试
│   └── phone-mockup.test.ts # 手机模型组件测试
└── mocks/                 # 模拟数据和辅助函数
```

## 🧪 测试覆盖范围

### 1. 设备配置 (devices.test.ts)
- ✅ 设备数据结构验证
- ✅ 安全边距配置检查
- ✅ 设备外观属性验证
- ✅ 品牌和型号覆盖
- ✅ 横竖屏支持测试

### 2. 后台脚本 (background.test.ts)
- ✅ Chrome 事件监听器设置
- ✅ 扩展安装和更新处理
- ✅ 消息传递机制
- ✅ 标签页更新处理
- ✅ 错误处理和边界情况

### 3. 内容脚本 (content.test.ts)
- ✅ DOM 初始化和样式注入
- ✅ CSS 变量动态更新
- ✅ 消息监听和响应
- ✅ 自定义事件派发
- ✅ 调试模式和路由监听

### 4. 手机模型组件 (phone-mockup.test.ts)
- ✅ 组件初始化和配置
- ✅ 设备更新和渲染
- ✅ 安全边距可视化
- ✅ 错误处理和清理

## 🎯 测试特性

### Mock 和 Stub
- **Chrome APIs**: 完整的 Chrome 扩展 API 模拟
- **DOM APIs**: jsdom 提供的浏览器环境
- **控制台方法**: 捕获和验证日志输出
- **异步操作**: Promise 和异步函数测试

### 测试类型
- **单元测试**: 独立函数和类测试
- **集成测试**: 组件间交互测试
- **边界测试**: 错误情况和边界条件
- **异步测试**: Promise 和事件处理

## 📊 当前测试结果

```
 Test Files  2 passed | 2 failed (4)
      Tests  45 passed | 11 failed (56)
      
 ✅ tests/unit/devices.test.ts     (11 tests) - 100% 通过
 ✅ tests/unit/phone-mockup.test.ts (15 tests) - 100% 通过  
 ⚠️  tests/unit/background.test.ts  (13 tests) - 84% 通过
 ⚠️  tests/unit/content.test.ts     (17 tests) - 53% 通过
```

### 已知问题
1. **模块导入问题**: 某些测试中实际模块导入执行不符合预期
2. **副作用执行**: 模块的立即执行代码在测试环境中行为异常
3. **异步初始化**: DOM 就绪状态在测试中的模拟需要优化

## 🔄 测试最佳实践

### 1. 测试文件命名
- 文件名：`*.test.ts` 或 `*.spec.ts`
- 位置：`tests/unit/` 目录下
- 描述性命名：反映被测试的模块

### 2. 测试结构
```typescript
describe('Module Name', () => {
  beforeEach(() => {
    // 每个测试前的设置
  });

  describe('Feature Group', () => {
    it('should behave correctly', () => {
      // 测试实现
    });
  });
});
```

### 3. Mock 使用
```typescript
// Chrome API 调用
mockChrome.storage.sync.get.mockResolvedValue(mockData);

// DOM 操作验证
expect(document.querySelector('.class')).toBeTruthy();

// 异步操作等待
await new Promise(resolve => setTimeout(resolve, 0));
```

### 4. 断言模式
```typescript
// 存在性检查
expect(result).toBeDefined();
expect(element).toBeTruthy();

// 值比较
expect(count).toBeGreaterThan(0);
expect(array).toContain(item);

// 函数调用验证
expect(mockFn).toHaveBeenCalledWith(expectedArgs);
expect(mockFn).toHaveBeenCalledTimes(1);
```

## 🚀 改进计划

### 短期目标
- [x] 基本测试框架搭建
- [x] 核心模块测试覆盖
- [ ] 修复模块导入测试问题
- [ ] 提高测试通过率到 90%+

### 中期目标
- [ ] 端到端 (E2E) 测试集成
- [ ] 视觉回归测试
- [ ] 性能测试基准
- [ ] 自动化测试报告

### 长期目标
- [ ] 持续集成 (CI) 配置
- [ ] 测试覆盖率追踪
- [ ] 自动化发布前测试
- [ ] 跨浏览器兼容性测试

## 📚 相关文档

- [Vitest 官方文档](https://vitest.dev/)
- [jsdom 文档](https://github.com/jsdom/jsdom)
- [Chrome 扩展测试指南](https://developer.chrome.com/docs/extensions/mv3/tut_debugging/)

---

*最后更新: 2024年7月* 