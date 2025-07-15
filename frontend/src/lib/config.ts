// API配置
// 开发环境使用localhost，生产环境需要在Vercel中设置VITE_API_URL环境变量
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// 部署说明：
// 1. 在Vercel项目设置中添加环境变量 VITE_API_URL
// 2. 值设置为您的后端Vercel URL，例如：https://your-backend-app.vercel.app

// 调试函数 - 可以在浏览器控制台调用
export const debugConfig = () => {
  console.log('当前环境:', import.meta.env.MODE);
  console.log('API URL:', API_BASE_URL);
  console.log('环境变量 VITE_API_URL:', import.meta.env.VITE_API_URL);
}; 