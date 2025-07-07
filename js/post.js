/**
 * 文章详情页核心功能脚本 - 优化版
 * 主要改进：
 * 1. 增强Markdown解析能力，支持更丰富的语法
 * 2. 集成highlight.js实现代码高亮
 * 3. 添加代码块复制功能
 * 4. 改进错误处理和用户体验
 * 5. 代码块全屏显示优化
 */

// 引入highlight.js库（需要在HTML中加载）
// <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/[theme].min.css">
// <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js"></script>

/**
 * 从URL查询参数获取文章ID
 * @returns {string|null} 文章ID，如果没有则返回null
 */
function getPostIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

/**
 * HTML特殊字符转义函数
 * @param {string} unsafe 包含HTML特殊字符的原始字符串
 * @returns {string} 转义后的安全字符串
 */
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/**
 * 增强版Markdown转HTML转换器
 * 支持标准Markdown语法和部分扩展语法
 * @param {string} markdown Markdown格式的文本
 * @returns {string} 转换后的HTML
 */
function markdownToHtml(markdown) {
    // 预处理：规范化换行符
    let html = markdown.replace(/\r\n/g, '\n');

    // 标题转换（支持1-6级标题）
    html = html
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
        .replace(/^##### (.*$)/gm, '<h5>$1</h5>')
        .replace(/^###### (.*$)/gm, '<h6>$1</h6>');

    // 代码块处理（支持语法高亮）
    html = html.replace(/```(\w*)\n([\s\S]*?)\n```/g, function(match, lang, code) {
        const escapedCode = escapeHtml(code);
        const language = lang || 'plaintext';
        const lines = escapedCode.split('\n');
        
        // 生成带行号的代码HTML（简化版）
        let codeWithLines = '';
        lines.forEach((line, index) => {
            // 跳过最后的空行
            if (index === lines.length - 1 && line.trim() === '') return;
            codeWithLines += `<div class="code-line">${line || ' '}</div>`;
        });

        return `
        <div class="code-block-wrapper normal-code-style">
            <div class="code-header">
                <span class="language-name">${language}</span>
                <button class="copy-button" title="复制代码">
                    <i class="far fa-copy"></i> 复制
                </button>
            </div>
            <pre><code class="language-${language}">${codeWithLines}</code></pre>
        </div>`;
    });

    // 行内代码
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // 链接和图片（支持title属性）
    html = html.replace(/!\[(.*?)\]\((.*?)(?:\s+"(.*?)")?\)/g, 
        '<img src="$2" alt="$1" title="$3" class="md-image" loading="lazy">');
    html = html.replace(/\[(.*?)\]\((.*?)(?:\s+"(.*?)")?\)/g, 
        '<a href="$2" title="$3" target="_blank" rel="noopener noreferrer">$1</a>');

    // 粗体和斜体
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.*?)_/g, '<em>$1</em>');

    // 列表处理（无序和有序）
    html = html.replace(/^\s*\*\s(.*$)/gm, '<li>$1</li>');
    html = html.replace(/^\s*-\s(.*$)/gm, '<li>$1</li>');
    html = html.replace(/^\s*\+\s(.*$)/gm, '<li>$1</li>');
    html = html.replace(/^\s*\d+\.\s(.*$)/gm, '<li>$1</li>');

    // 引用
    html = html.replace(/^>\s(.*$)/gm, '<blockquote>$1</blockquote>');

    // 水平线
    html = html.replace(/^---/gm, '<hr>');

    // 表格处理（简单支持）
    html = html.replace(/^\|(.+)\|$/gm, function(match, row) {
        if (row.includes('---')) {
            return ''; // 跳过表头分隔线
        }
        const cells = row.split('|').map(cell => cell.trim());
        return `<tr>${cells.map(cell => `<td>${cell}</td>`).join('')}</tr>`;
    });

    // 段落和换行处理
    html = html.replace(/\n\n+/g, '</p><p>');
    html = html.replace(/\n/g, '<br>');

    // 确保有段落标签
    if (!html.startsWith('<p>') && !html.startsWith('<h') && !html.startsWith('<pre')) {
        html = '<p>' + html;
    }
    if (!html.endsWith('</p>') && !html.endsWith('</h') && !html.endsWith('</pre>')) {
        html = html + '</p>';
    }

    // 修复标签嵌套问题
    const nestingFixRules = [
        { start: '<p><h', end: '</h', replaceStart: '<h', replaceEnd: '</h' },
        { start: '<p><pre', end: '</pre>', replaceStart: '<pre', replaceEnd: '</pre>' },
        { start: '<p><blockquote', end: '</blockquote>', replaceStart: '<blockquote', replaceEnd: '</blockquote>' },
        { start: '<p><ul', end: '</ul>', replaceStart: '<ul', replaceEnd: '</ul>' },
        { start: '<p><ol', end: '</ol>', replaceStart: '<ol', replaceEnd: '</ol>' },
        { start: '<p><hr>', end: '<hr>', replaceStart: '<hr>', replaceEnd: '<hr>' },
        { start: '<p><table', end: '</table>', replaceStart: '<table', replaceEnd: '</table>' }
    ];

    nestingFixRules.forEach(rule => {
        while (html.includes(rule.start)) {
            html = html.replace(rule.start, rule.replaceStart);
            html = html.replace(new RegExp(rule.end + '></p>', 'g'), rule.replaceEnd + '>');
        }
    });

    // 列表包装
    html = html.replace(/(<li>.*?<\/li>)+/gs, function(match) {
        if (match.includes('</li><li>')) {
            return '<ul>' + match + '</ul>';
        }
        return match;
    });

    // 表格包装
    if (html.includes('<tr>')) {
        html = html.replace(/(<tr>.*?<\/tr>)+/gs, function(match) {
            return '<table>' + match + '</table>';
        });
    }

    return html;
}

/**
 * 初始化代码高亮和复制功能
 */
function initCodeHighlighting() {
    // 初始化highlight.js
    if (typeof hljs !== 'undefined') {
        // 高亮所有代码块
        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
            
            // 为代码块添加行号
            const lines = block.innerHTML.split('\n');
            if (lines.length > 1) {
                let html = '';
                lines.forEach((line, i) => {
                    if (line.trim() === '' && i === lines.length - 1) return;
                    html += `<div class="code-line"><span class="line-number">${i + 1}</span>${line || ' '}</div>`;
                });
                block.innerHTML = html;
            }
        });
    } else {
        console.warn('未检测到highlight.js，代码高亮功能将不可用');
    }
    
    // 初始化复制按钮 - 使用事件委托提高性能
    document.addEventListener('click', function(e) {
        if (e.target.closest('.copy-button')) {
            const button = e.target.closest('.copy-button');
            const codeBlock = button.closest('.code-block-wrapper').querySelector('code');
            
            // 获取纯文本内容（去除行号等装饰元素）
            let textToCopy = codeBlock.textContent;
            
            // 如果有行号，去除行号
            const lineNumbers = codeBlock.querySelectorAll('.line-number');
            if (lineNumbers.length > 0) {
                textToCopy = Array.from(codeBlock.querySelectorAll('.code-line'))
                    .map(line => line.textContent.replace(/^\d+\s/, ''))
                    .join('\n');
            }
            
            // 创建临时textarea元素用于复制
            const textarea = document.createElement('textarea');
            textarea.value = textToCopy;
            textarea.style.position = 'fixed';
            document.body.appendChild(textarea);
            textarea.select();
            
            try {
                // 执行复制命令
                const successful = document.execCommand('copy');
                showCopyNotification();
                
                // 显示复制成功反馈
                const originalText = button.innerHTML;
                button.innerHTML = '<i class="fas fa-check"></i> 已复制';
                button.classList.add('copied');
                
                // 3秒后恢复原状
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.classList.remove('copied');
                }, 2000);
            } catch (err) {
                console.error('复制失败:', err);
                button.innerHTML = '<i class="fas fa-exclamation-circle"></i> 请手动复制';
                setTimeout(() => {
                    button.innerHTML = originalText;
                }, 2000);
            }
            
            // 移除临时textarea
            document.body.removeChild(textarea);
        }
    });
}

/**
 * 显示全局复制成功通知
 */
function showCopyNotification() {
    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    notification.textContent = '代码已复制到剪贴板';
    document.body.appendChild(notification);
    
    // 显示通知
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // 3秒后隐藏并移除
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}
/**
 * 日期格式化函数
 * @param {string} dateString ISO格式的日期字符串
 * @returns {string} 格式化后的日期字符串
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '未知日期';
    
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Shanghai'
    };
    
    return new Intl.DateTimeFormat('zh-CN', options).format(date);
}

/**
 * 渲染文章详情页
 * @param {Object} post 文章对象，包含标题、内容、元数据等
 */
function renderPost(post) {
    const container = document.getElementById('post-detail');
    
    if (!container) {
        console.error('无法找到文章详情容器元素');
        return;
    }
    
    // 使用增强版Markdown转换
    let contentHtml = markdownToHtml(post.content);
    
    // 为资源下载文章添加特殊标记和下载按钮
    const downloadNotice = post.category === 'downloads' 
        ? `<div class="download-notice">
              <i class="fas fa-download"></i> 本文包含可下载资源
              <a href="/downloads/${post.id}.zip" class="download-button" download>
                  <i class="fas fa-file-archive"></i> 下载资源包
              </a>
           </div>`
        : '';
    
    // 渲染文章详情HTML
    container.innerHTML = `
        <article class="post-article">
            <h1 class="post-title">${post.title} ${post.category === 'downloads' ? '<span class="download-badge">资源下载</span>' : ''}</h1>
            ${downloadNotice}
            <div class="post-meta">
                <span class="post-author">${post.author || post.meta || '未知作者'}</span>
                <span class="post-date">${formatDate(post.date)}</span>
                <span class="post-length">${post.length || ''}</span>
            </div>
            ${post.image ? `
            <div class="post-image-container">
                <img src="${post.image}" alt="${post.title}" class="post-image" loading="lazy">
                ${post.imageCaption ? `<div class="image-caption">${post.imageCaption}</div>` : ''}
            </div>` : ''}
            <div class="post-content">
                ${contentHtml}
            </div>
            <div class="post-footer">
                <a href="index.html" class="back-link"><i class="fas fa-arrow-left"></i> 返回博客首页</a>
                ${post.tags ? `<div class="post-tags">标签: ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>` : ''}
            </div>
        </article>
    `;
    
    // 初始化代码高亮和复制功能
    initCodeHighlighting();
}

/**
 * 显示错误消息
 * @param {string} message 错误消息
 */
function showError(message) {
    const container = document.getElementById('post-detail') || document.body;
    container.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
            <a href="index.html" class="back-link"><i class="fas fa-arrow-left"></i> 返回博客首页</a>
        </div>
    `;
}

// DOM加载完成后的初始化函数
document.addEventListener('DOMContentLoaded', async function() {
    console.log('文章详情页面DOM加载完成');
    
    // 更新版权年份
    const currentYearEl = document.getElementById('current-year');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }
    
    // 获取文章ID并加载文章内容
    const postId = getPostIdFromUrl();
    if (!postId) {
        showError('未指定文章ID');
        return;
    }
    
    try {
        // 异步获取文章数据（从MD文件加载内容）
        const post = await getPostById(postId);
        if (post) {
            renderPost(post);
        } else {
            showError('文章不存在');
        }
    } catch (error) {
        console.error('加载文章时出错:', error);
        showError('加载文章失败，请稍后再试');
    }
});