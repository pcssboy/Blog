/**
 * 主题切换功能
 * 同时适用于所有页面
 */

// 主题切换按钮
const themeToggle = document.getElementById('theme-toggle');
// 主题图标
const themeIcon = themeToggle ? themeToggle.querySelector('img') : null;

// 可用的主题
const themes = ['dark', 'light'];
// 默认主题
const defaultTheme = 'dark';

// 初始化主题
function initTheme() {
    // 从本地存储获取保存的主题，如果没有则使用默认主题
    const savedTheme = localStorage.getItem('theme') || defaultTheme;
    // 应用主题
    setTheme(savedTheme);
    
    // 如果存在主题切换按钮，添加点击事件
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

// 设置主题
function setTheme(theme) {
    // 确保主题是有效的
    if (!themes.includes(theme)) return;
    
    // 设置HTML元素的data-theme属性
    document.documentElement.setAttribute('data-theme', theme);
    // 保存到本地存储
    localStorage.setItem('theme', theme);
    
    // 更新主题图标
    updateThemeIcon(theme);
}

// 切换主题
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

// 更新主题图标
function updateThemeIcon(theme) {
    if (!themeIcon) return;
    
    // 根据当前主题切换图标
    themeIcon.src = theme === 'dark' ? 'icon/icon-light.svg' : 'icon/icon-dark.svg';
    themeIcon.alt = theme === 'dark' ? '切换到亮色主题' : '切换到暗色主题';
}

// 页面加载完成后初始化主题
document.addEventListener('DOMContentLoaded', initTheme);