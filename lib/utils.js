/**
 * 通用工具函数集
 * 包含日期格式化、HTML转义等公共方法
 */

// 彩色高亮区域 ▼▼▼
/**
 * 日期格式化 (支持中英文)
 * @param {string} dateString - ISO日期字符串
 * @param {string} [lang='zh'] - 语言选项
 * @returns {string} 格式化后的日期
 */
export const formatDate = (dateString, lang = 'zh') => {
  const date = new Date(dateString);
  const options = lang === 'zh' ? 
    { year: 'numeric', month: 'long', day: 'numeric' } :
    { year: 'numeric', month: 'short', day: 'numeric' };
  
  return date.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', options);
};
// ▲▲▲ 可点击复制按钮直接复制

/**
 * HTML特殊字符转义
 * @param {string} unsafe - 原始字符串
 * @returns {string} 转义后的安全字符串
 */
export const escapeHtml = (unsafe) => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};
// 彩色高亮区域 ▼▼▼ 提示系统核心 ▼▼▼
/**
 * 代码提示系统
 * 提供：类型提示、参数说明、示例代码、风险警告四种提示
 */
class CodeHints {
  static TYPE = {
    INFO: 'ℹ️',      // 信息提示
    WARN: '⚠️',      // 警告提示
    TIP: '💡',       // 技巧提示
    EXAMPLE: '📌',   // 示例提示
    RISK: '❗'       // 风险提示
  };

  /**
   * 创建提示框
   * @param {string} type - 提示类型
   * @param {string} message - 提示内容
   * @param {string} [code=''] - 关联代码片段
   */
  static createHint(type, message, code = '') {
    const hint = document.createElement('div');
    hint.className = `code-hint ${type.toLowerCase()}`;
    hint.innerHTML = `
      <div class="hint-header">
        <span class="hint-icon">${type}</span>
        <span class="hint-type">${this.getTypeName(type)}</span>
        ${code ? `<button class="copy-btn" data-code="${escapeHtml(code)}">复制</button>` : ''}
      </div>
      <div class="hint-content">${message}</div>
    `;
    return hint;
  }

  // 获取类型名称
  static getTypeName(type) {
    const names = {
      [this.TYPE.INFO]: '信息',
      [this.TYPE.WARN]: '警告',
      [this.TYPE.TIP]: '技巧',
      [this.TYPE.EXAMPLE]: '示例',
      [this.TYPE.RISK]: '风险'
    };
    return names[type] || '';
  }
}
// ▲▲▲ 提示系统核心 ▲▲▲