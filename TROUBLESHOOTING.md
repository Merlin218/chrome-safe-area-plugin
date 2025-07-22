# Chrome Safe Area Plugin - 故障排除指南

## 🚨 常见问题及解决方案

### 1. Chrome 扩展加载失败："清单文件缺失或不可读取"

**问题描述**
在 Chrome 中加载扩展时出现错误：
- "未能成功加载扩展程序"
- "清单文件缺失或不可读取"
- "无法加载清单"

**原因分析**
这个问题通常由以下原因引起：
1. 构建输出的 JavaScript 使用了不兼容的模块格式
2. manifest.json 中的配置不适合当前 Chrome 版本
3. ES 模块导入在 Content Scripts 中不被支持

**解决方案**

#### 步骤 1：检查构建配置
确保使用标准的 Vite 构建：
```bash
# 使用标准的 Vite 构建系统
npm run build

# 这个命令会自动执行类型检查和构建
```

#### 步骤 2：验证 manifest.json
检查 `dist/manifest.json` 文件：
```json
{
  "manifest_version": 3,
  "background": {
    "service_worker": "background.js"
    // 注意：不要包含 "type": "module"
  }
}
```

#### 步骤 3：检查 JavaScript 文件格式
确保生成的 JavaScript 文件：
- 不包含 `import`/`export` 语句
- Content scripts 使用全局变量而非模块导入
- Background script 是纯 JavaScript 而非 ES 模块

#### 步骤 4：重新构建和加载
```bash
# 清理并重新构建
npm run clean
npm run build

# 在 Chrome 中重新加载扩展
# 1. 打开 chrome://extensions/
# 2. 点击扩展的"重新加载"按钮
# 或删除后重新"加载已解压的扩展程序"
```

### 2. Content Script 执行错误

**问题描述**
- Console 显示 "DEVICES is not defined"
- Content script 功能不工作
- 模块依赖错误

**解决方案**
确保 manifest.json 中的脚本加载顺序正确：
```json
"content_scripts": [
  {
    "matches": ["<all_urls>"],
    "js": ["devices.js", "phone-frame-simple.js", "content.js"],
    "run_at": "document_start"
  }
]
```

### 3. 构建输出问题

**问题描述**
构建后的文件包含 TypeScript 语法或模块导入

**解决方案**
检查构建脚本是否正确处理了：
- TypeScript 类型注解移除
- 导入/导出语句转换
- 全局变量暴露

### 4. 扩展权限问题

**问题描述**
扩展安装后某些功能不工作

**解决方案**
检查 manifest.json 中的权限配置：
```json
{
  "permissions": [
    "activeTab",
    "storage"
  ]
}
```

### 5. 图标显示问题

**问题描述**
扩展图标不显示或显示异常

**解决方案**
```bash
# 重新生成图标
npm run generate-icons

# 检查图标文件是否存在
ls -la icons/
ls -la dist/icons/
```

## 🔧 调试步骤

### 1. 检查扩展状态
1. 打开 `chrome://extensions/`
2. 启用"开发者模式"
3. 查看扩展状态和错误信息

### 2. 查看控制台错误
- **Background Script**: 点击"Service Worker"链接查看后台脚本日志
- **Content Script**: 在目标页面按 F12，查看 Console 面板
- **Popup**: 右键点击扩展图标 → "检查弹出内容"

### 3. 验证文件完整性
```bash
# 检查构建输出
ls -la dist/

# 验证关键文件
cat dist/manifest.json
head -20 dist/background.js
head -20 dist/content.js
```

### 4. 测试基本功能
1. 扩展加载成功后，打开任意网页
2. 点击扩展图标，检查 popup 是否显示
3. 选择设备，观察页面是否应用安全边距

## 🚀 最佳实践

### 开发流程
1. 修改源码后，运行 `npm run build`
2. 在 Chrome 中点击扩展的"重新加载"按钮
3. 刷新测试页面
4. 检查功能是否正常

### 版本兼容性
- 确保使用 Manifest V3
- 测试多个 Chrome 版本
- 关注 Chrome 扩展 API 变更

### 代码质量
```bash
# 运行完整验证
npm run validate

# 单独检查
npm run type-check  # TypeScript 类型检查
npm run lint        # 代码质量检查
npm run test:run    # 单元测试
```

## 📞 获取帮助

如果问题依然存在：

1. **查看构建日志**: 检查构建过程中的警告和错误
2. **对比工作版本**: 与已知工作的提交进行对比
3. **查看浏览器兼容性**: 确认目标 Chrome 版本支持使用的特性
4. **检查相关文档**: 
   - [Chrome 扩展开发文档](https://developer.chrome.com/docs/extensions/)
   - [Manifest V3 指南](https://developer.chrome.com/docs/extensions/mv3/)

---

*最后更新: 2024年7月* 