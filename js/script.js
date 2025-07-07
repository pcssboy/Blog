/**
 * 日期格式化函数
 * @param {string} dateString ISO格式日期字符串
 * @returns {string} 格式化后的中文日期
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const months = ['一月', '二月', '三月', '四月', '五月', '六月', 
                   '七月', '八月', '九月', '十月', '十一月', '十二月'];
    return `${date.getFullYear()}年${months[date.getMonth()]}${date.getDate()}日`;
}

/**
 * 渲染文章列表
 * @param {Array} postsToRender 要渲染的文章数组（默认为所有文章）
 */
function renderPosts(postsToRender = getAllPosts()) {
    const container = document.getElementById('posts-container');
    
    // 无文章时显示提示
    if (postsToRender.length === 0) {
        container.innerHTML = '<div class="error">没有找到相关文章</div>';
        return;
    }
    
    let html = '';
    postsToRender.forEach(post => {
        // 为资源下载类目添加特殊标记和下载按钮
        const downloadBadge = post.category === 'downloads' 
            ? `<span class="download-badge">可下载资源</span>
               <a href="/downloads/${post.id}.zip">
               <i class="fa fa-download "></i> 
               </a>` 
            : '';
        
        // 生成每篇文章的HTML
        html += `
        <article class="post" onclick="navigateToPost('${post.id}')">
            <div class="post-image-container">
                <img src="${post.image}" alt="${post.title}" class="post-image">
            </div>
            <div class="post-content">
                <h3>${post.title} ${downloadBadge}</h3>
                <div class="post-meta">${post.meta}：${formatDate(post.date)} ${post.length}</div>
                <p>${post.content.split('\n\n')[0]}</p>
                <div class="post-tags">
                    ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        </article>`;
    });
    
    container.innerHTML = html;
}
/**
 * 跳转到文章详情页
 * @param {string} id 文章ID
 */
function navigateToPost(id) {
    window.location.href = `post.html?id=${id}`;
}

/**
 * 显示指定分类的文章
 * @param {string} category 分类ID
 */
// script.js

/**
 * 显示指定分类的文章
 * @param {string} category 分类ID
 */
function showCategory(category) {
    // 获取当前哈希值
    const currentHash = window.location.hash.substring(1);
    
    // 如果当前不在主页，先跳转到主页
    if (currentHash !== 'home') {
        window.location.hash = 'home';
    }
    
    // 渲染该分类下的文章
    renderPosts(getPostsByCategory(category));
    
    // 平滑滚动到文章列表
    document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
}

/**
 * 处理URL哈希变化，实现单页应用导航
 */
function handleHashChange() {
    const hash = window.location.hash.substring(1);
    
    // 隐藏所有部分
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    
    // 根据哈希显示对应部分
    if (hash === 'categories') {
        document.getElementById('categories').style.display = 'block';
    } else if (hash === 'about') {
        document.getElementById('about').style.display = 'block';
    } else if (hash === 'timeline') {
        document.getElementById('timeline').style.display = 'block';
        renderTimeline();
    } else {
        // 默认显示主页和所有文章
        document.getElementById('home').style.display = 'block';
        renderPosts();
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 更新版权年份
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // 初始化分类计数
    initCategoryCounts();  
    
    // 渲染文章列表
    renderPosts();  
    
    // 渲染分类列表
    renderCategories();  
    
    // 初始化搜索
    initSearch();  
    
    // 处理初始哈希状态
    handleHashChange();  
    
    // 监听哈希变化
    window.addEventListener('hashchange', handleHashChange);
});

/**
 * 渲染分类列表
 */
function renderCategories() {
    const categories = getAllCategories();
    const container = document.querySelector('.categories-list');
    if (!container) return;
    
    let html = '';
    Object.keys(categories).forEach(categoryId => {
        const category = categories[categoryId];
        // 为资源下载类目添加特殊标记
        const isDownloads = categoryId === 'downloads';
        const badge = isDownloads ? '<span class="new-badge">NEW</span>' : '';
        
        html += `
        <div class="category-card" onclick="showCategory('${categoryId}')">
            <div class="category-icon" style="background-color: ${category.color};">
                <i class="fas ${category.icon}"></i>
            </div>
            <h3>${category.name} ${badge}</h3>
            <p>${category.description} (${category.count}篇)</p>
            ${isDownloads ? '<div class="downloads-notice">点击查看可下载资源</div>' : ''}
        </div>`;
    });
    
    container.innerHTML = html;
}
/**
 * 初始化搜索功能
 */
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    
    // 执行搜索的核心函数
    const performSearch = () => {
        const query = searchInput.value.trim();
        if (query) {
            renderPosts(searchPosts(query));
            document.getElementById('home').style.display = 'block';
        } else {
            renderPosts();
        }
    };
    
    // 监听键盘回车和按钮点击事件
    searchInput.addEventListener('keypress', (e) => e.key === 'Enter' && performSearch());
    searchButton.addEventListener('click', performSearch);
}

/**
 * 渲染分类列表
 */
function renderCategories() {
    const categories = getAllCategories();
    const container = document.querySelector('.categories-list');
    if (!container) return;
    
    let html = '';
    Object.keys(categories).forEach(categoryId => {
        const category = categories[categoryId];
        // 为资源下载类目添加特殊标记
        const isDownloads = categoryId === 'downloads';
        const badge = isDownloads ? '<span class="new-badge">NEW</span>' : '';
        
        html += `
        <div class="category-card" onclick="showCategory('${categoryId}')">
            <div class="category-icon" style="background-color: ${category.color};">
                <i class="fas ${category.icon}"></i>
            </div>
            <h3>${category.name} ${badge}</h3>
            <p>${category.description} (${category.count}篇)</p>
            ${isDownloads ? '<div class="downloads-notice">点击查看可下载资源</div>' : ''}
        </div>`;
    });
    
    container.innerHTML = html;
}

/**
 * 处理URL哈希变化，实现单页应用导航
 */
function handleHashChange() {
    const hash = window.location.hash.substring(1);
    
    // 隐藏所有部分
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    
    // 根据哈希显示对应部分
    if (hash === 'categories') {
        document.getElementById('categories').style.display = 'block';
    } else if (hash === 'about') {
        document.getElementById('about').style.display = 'block';
    } else if (hash === 'timeline') {
        document.getElementById('timeline').style.display = 'block';
        renderTimeline();
    } else {
        document.getElementById('home').style.display = 'block';
        renderPosts();
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('current-year').textContent = new Date().getFullYear();
    initCategoryCounts();  // 初始化分类计数
    renderPosts();  // 渲染文章列表
    renderCategories();  // 渲染分类列表
    initSearch();  // 初始化搜索
    handleHashChange();  // 处理初始哈希状态
    window.addEventListener('hashchange', handleHashChange);  // 监听哈希变化
});

// 新增：渲染时间轴----------------------------------
function renderTimeline() {
    const container = document.getElementById('timeline-container');
    if (!container) return;
    
    // 按日期排序文章
    const sortedPosts = [...getAllPosts()].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    );
    
    let html = '';
    sortedPosts.forEach((post, index) => {
        html += `
        <div class="timeline-item ${index % 2 === 0 ? 'left' : 'right'}">
            <div class="timeline-content" onclick="navigateToPost('${post.id}')">
                <div class="timeline-date">${formatDate(post.date)}</div>
                <h3 class="timeline-title">${post.title}</h3>
                <p class="timeline-desc">${post.content.split('\n\n')[0].substring(0, 100)}...</p>
                <div class="post-tags">
                    ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
        `;
    });
    
    container.innerHTML = html;
}

// 修改handleHashChange函数支持时间轴
function handleHashChange() {
    const hash = window.location.hash.substring(1);
    
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    
    if (hash === 'categories') {
        document.getElementById('categories').style.display = 'block';
    } else if (hash === 'about') {
        document.getElementById('about').style.display = 'block';
    } else if (hash === 'timeline') {
        document.getElementById('timeline').style.display = 'block';
        renderTimeline();
    } else {
        document.getElementById('blog').style.display = 'block';
    }
}

// 修改初始化函数
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('current-year').textContent = new Date().getFullYear();
    renderPosts();
    initSearch();
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
});

// 处理hash变化
function handleHashChange() {
    const hash = window.location.hash.substring(1);
    
    // 隐藏所有部分
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    
    // 显示对应的部分
    if (hash === 'home') {
        document.getElementById('home').style.display = 'block';
    } else if (hash === 'timeline') {
        document.getElementById('timeline').style.display = 'block';
        renderTimeline();
    } else if (hash === 'categories') {
        document.getElementById('categories').style.display = 'block';
    } else if (hash === 'about') {
        document.getElementById('about').style.display = 'block';
    } else {
        // 默认显示主页
        document.getElementById('home').style.display = 'block';
    }
}

// DOM加载完成后的初始化函数
document.addEventListener('DOMContentLoaded', function() {
    // 更新版权年份
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // 渲染文章列表
    renderPosts();
    
    // 初始化搜索功能
    initSearch();
    
    // 处理初始哈希状态
    handleHashChange();
    
    // 监听哈希变化事件
    window.addEventListener('hashchange', handleHashChange);
});

/**
 * ============================================
 * 优化版左右分栏留言板功能
 * ============================================
 */

// 辅助函数 - HTML转义
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// 辅助函数 - 简单Markdown转HTML
function markdownToHtml(text) {
    // 处理换行
    let html = text.replace(/\n/g, '<br>');
    // 处理粗体 **text**
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // 处理斜体 *text*
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // 处理链接 [text](url)
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');
    return html;
}

// 辅助函数 - 根据字符串生成颜色
function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 70%, 50%)`;
}

// 主留言板功能
function initGuestbook() {
    // 确保DOM元素存在
    const form = document.getElementById('guestbook-form');
    const entriesContainer = document.getElementById('guestbook-entries');
    const entryCount = document.getElementById('entry-count');
    
    if (!form || !entriesContainer || !entryCount) {
        console.error('留言板所需DOM元素未找到');
        return;
    }
    
    const STORAGE_KEY = 'honge_guestbook_v2';
    
    // 加载留言
    function loadEntries() {
        let entries = [];
        try {
            const storedData = localStorage.getItem(STORAGE_KEY);
            entries = storedData ? JSON.parse(storedData) : [];
        } catch (e) {
            console.error('读取留言数据失败:', e);
            showAlert('加载留言失败，请刷新页面重试', 'error');
            return;
        }
        
        // 更新计数
        entryCount.textContent = `${entries.length}条留言`;
        
        if (entries.length === 0) {
            entriesContainer.innerHTML = `
                        <div class="entry-header">
                        <img  class="entry-avatar" src="/icon/logo.png" alt="absolutely" />
                        <span class="entry-author">Honge's</span>
                        <span class="entry-date">2017-03-18 18:46:06</span>
                        </div>
                        <div class="entry-content">
                        留言板只是模拟评论功能！你的言论只存在当前页面。如需咨询请联系 ➜
                        <a target="_blank" href="tencent://message/?uin=46406444&site=QQ&menu=yes">
						<img border="0"style="width:70px;height:20px;" src="./icon/icon-qq.jpg" 
						alt="点击这里给我发消息" title="❤️点我QQ聊天❤️"/></a>									
                <div class="no-entries">
                    <i class="far fa-comment-dots"></i>
                    <p>还没有留言，期待您的第一条留言~</p>
                </div>`;
            return;
        }
        
        let html = '';
        entries.forEach(entry => {
            // 格式化日期
            const formattedDate = formatDate(entry.date);
            
            html += `
            <div class="guestbook-entry">
                <div class="entry-header">
                    <div class="entry-avatar" style="background-color: ${stringToColor(entry.name)}">
                        ${entry.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <span class="entry-author">${escapeHtml(entry.name)}</span>
                        <span class="entry-date">${formattedDate}</span>
                    </div>
                </div>
                <div class="entry-content">${markdownToHtml(entry.content)}</div>
            </div>`;
        });
        
        entriesContainer.innerHTML = html;
    }
    
    // 表单提交处理
    function handleSubmit(e) {
        e.preventDefault();
        
        const nameInput = document.getElementById('gb-name');
        const contentInput = document.getElementById('gb-content');
        const emailInput = document.getElementById('gb-email');
        
        const name = nameInput.value.trim();
        const content = contentInput.value.trim();
        const email = emailInput.value.trim();
        
        // 验证输入
        if (name.length < 2) {
            showAlert('昵称至少需要2个字符', 'error');
            nameInput.focus();
            return;
        }
        
        if (content.length < 10) {
            showAlert('留言内容至少需要10个字符', 'error');
            contentInput.focus();
            return;
        }
        
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showAlert('请输入有效的邮箱地址', 'error');
            emailInput.focus();
            return;
        }
        
        try {
            const newEntry = {
                name,
                email,
                content,
                date: new Date().toISOString()
            };
            
            // 获取现有留言
            const entries = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
            // 将新留言添加到开头
            entries.unshift(newEntry);
            // 保存回本地存储
            localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
            
            // 重新加载留言
            loadEntries();
            // 重置表单
            form.reset();
            // 显示成功消息
            showAlert('留言已提交，感谢您的支持！', 'success');
            
            // 滚动到最新留言
            setTimeout(() => {
                if (entriesContainer.firstChild) {
                    entriesContainer.firstChild.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
            
        } catch (error) {
            console.error('保存留言失败:', error);
            showAlert('留言提交失败，请稍后再试', 'error');
        }
    }
    
    // 显示通知消息
    function showAlert(message, type) {
        // 移除现有通知
        const existingAlert = form.querySelector('.alert');
        if (existingAlert) existingAlert.remove();
        
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            ${message}
        `;
        form.insertBefore(alert, form.firstChild);
        
        // 3秒后自动消失
        setTimeout(() => {
            alert.classList.add('fade-out');
            setTimeout(() => {
                alert.remove();
            }, 300);
        }, 3000);
    }
    
    // 绑定表单提交事件
    form.addEventListener('submit', handleSubmit);
    
    // 初始化加载留言
    loadEntries();
}

// 确保在DOM完全加载后初始化留言板
document.addEventListener('DOMContentLoaded', function() {
    // 其他初始化代码...
    initGuestbook();
});