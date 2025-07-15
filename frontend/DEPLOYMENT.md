# Vercel 部署说明

## 前端部署配置

### 1. 环境变量设置

在Vercel项目设置中，需要添加以下环境变量：

**变量名**: `VITE_API_URL`  
**变量值**: 您的后端Vercel URL，例如：`https://your-backend-app.vercel.app`

### 2. 设置步骤

1. 登录Vercel控制台
2. 选择您的前端项目
3. 进入 "Settings" → "Environment Variables"
4. 添加环境变量：
   - Name: `VITE_API_URL`
   - Value: 您的后端Vercel URL
   - Environment: Production (和 Preview)
5. 保存并重新部署

### 3. 验证配置

部署完成后，检查：
- 注册/登录功能是否正常工作
- 背景图片是否正确显示
- 主题切换是否正常

### 4. 常见问题

**问题**: 注册/登录无法fetch
**解决**: 检查 `VITE_API_URL` 环境变量是否正确设置

**问题**: 背景图片无法显示
**解决**: 背景图片已移动到 `public` 目录，应该可以正常访问

**问题**: CORS错误
**解决**: 确保后端已正确配置CORS，允许前端域名访问 