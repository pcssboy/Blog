/**
 * Markdown处理工具集
 * 基于marked.js + highlight.js实现
 */

// 彩色高亮区域 ▼▼▼
import { marked } from 'marked';
import hljs from 'highlight.js';

// 配置语法高亮
marked.setOptions({
  highlight: function(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  },
  langPrefix: 'hljs language-', // 高亮样式前缀
  pedantic: false,
  gfm: true,
  breaks: true,
  smartLists: true
});

// 自定义渲染规则
const renderer = {
  code(code, infostring, escaped) {
    const lang = (infostring || '').match(/\S*/)[0];
    return `<pre class="hljs"><code class="language-${lang}">${
      hljs.highlightAuto(code).value
    }</code></pre>`;
  },
  link(href, title, text) {
    return `<a href="${href}" target="_blank" rel="noopener" ${
      title ? `title="${title}"` : ''
    }>${text}</a>`;
  }
};

// 导出处理函数
export const markdownToHtml = (content) => {
  marked.use({ renderer });
  return marked(content);
};
// ▲▲▲ 可点击复制按钮直接复制
// 彩色高亮区域 ▼▼▼ Markdown提示扩展 ▼▼▼
// 在markdown-utils.js中扩展自定义语法
marked.use({
  extensions: [{
    // 提示块语法：:::tip 这是提示内容 :::
    name: 'hintBlocks',
    level: 'block',
    start(src) { return src.match(/^:::(info|warn|tip|example|risk)/)?.index; },
    tokenizer(src) {
      const match = src.match(/^:::(info|warn|tip|example|risk)\n([\s\S]+?)\n:::/);
      if (match) {
        return {
          type: 'hintBlock',
          raw: match[0],
          hintType: match[1],
          text: match[2].trim()
        };
      }
    },
    renderer(token) {
      const typeMap = {
        info: CodeHints.TYPE.INFO,
        warn: CodeHints.TYPE.WARN,
        tip: CodeHints.TYPE.TIP,
        example: CodeHints.TYPE.EXAMPLE,
        risk: CodeHints.TYPE.RISK
      };
      return CodeHints.createHint(typeMap[token.hintType], token.text).outerHTML;
    }
  }]
});
// ▲▲▲ Markdown提示扩展 ▲▲▲