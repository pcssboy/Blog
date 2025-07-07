/**
 * 下载页面主脚本
 * 功能：资源加载、分类显示、搜索、下载统计等
 */

// 下载资源数据 - 实际项目中可以从服务器获取
const downloadsData = {
    software: [
        {
            id: 's001',
            title: 'Markdown编辑器',
            description: '一款轻量级的Markdown编辑器，支持实时预览和多种主题切换',
            image: 'images/software1.jpg',
            file: 'downloads/software/markdown-editor.zip',
            size: '12.5 MB',
            version: 'v2.3.1',
            downloads: 1245,
            updated: '2023-09-15',
            tags: ['编辑器', 'Markdown', '工具'],
            isNew: true
        },
        // 更多软件资源...
    ],
    templates: [
        {
            id: 't001',
            title: '企业网站模板',
            description: '响应式企业网站HTML模板，包含多种页面布局和组件',
            image: 'images/template1.jpg',
            file: 'downloads/templates/company-website.zip',
            size: '8.2 MB',
            version: 'v1.0',
            downloads: 892,
            updated: '2023-08-20',
            tags: ['HTML', '模板', '企业'],
            isNew: false
        },
        // 更多模板资源...
    ],
    ebooks: [
        {
            id: 'e001',
            title: 'JavaScript高级编程',
            description: '深入讲解JavaScript高级特性和设计模式，适合有一定基础的开发者',
            image: 'images/ebook1.jpg',
            file: 'downloads/ebooks/js-advanced.pdf',
            size: '5.7 MB',
            pages: 420,
            downloads: 1567,
            updated: '2023-07-10',
            tags: ['JavaScript', '编程', '电子书'],
            isNew: false
        },
        // 更多电子书资源...
    ]
};

// DOM元素
const totalCountEl = document.getElementById('total-count');
const downloadCountEl = document.getElementById('download-count');
const lastUpdateEl = document.getElementById('last-update');
const searchInput = document.getElementById('downloads-search');
const searchButton = document.getElementById('downloads-search-btn');
const softwareGrid = document.getElementById('software-grid');
const templatesGrid = document.getElementById('templates-grid');
const ebooksGrid = document.getElementById('ebooks-grid');

// 初始化下载页面
function initDownloads() {
    // 更新统计数据
    updateStats();
    
    // 渲染各分类资源
    renderDownloads('software', softwareGrid);
    renderDownloads('templates', templatesGrid);
    renderDownloads('ebooks', ebooksGrid);
    
    // 设置事件监听
    setupEventListeners();
}

// 更新统计数据
function updateStats() {
    let totalItems = 0;
    let totalDownloads = 0;
    let lastUpdate = '';
    
    // 计算总数和下载量
    Object.keys(downloadsData).forEach(category => {
        totalItems += downloadsData[category].length;
        downloadsData[category].forEach(item => {
            totalDownloads += item.downloads;
            if (!lastUpdate || item.updated > lastUpdate) {
                lastUpdate = item.updated;
            }
        });
    });
    
    // 更新DOM
    totalCountEl.textContent = totalItems;
    downloadCountEl.textContent = totalDownloads;
    lastUpdateEl.textContent = lastUpdate;
}

// 渲染下载资源
function renderDownloads(category, container) {
    const items = downloadsData[category];
    if (!items || items.length === 0) {
        container.innerHTML = '<div class="error">暂无资源</div>';
        return;
    }
    
    let html = '';
    items.forEach(item => {
        // 根据不同类别显示不同的元信息
        let metaInfo = '';
        if (category === 'software') {
            metaInfo = `<span class="download-size"><i class="fas fa-weight-hanging"></i> ${item.size}</span>
                       <span class="download-count"><i class="fas fa-download"></i> ${item.downloads}</span>`;
        } else if (category === 'templates') {
            metaInfo = `<span class="download-size"><i class="fas fa-weight-hanging"></i> ${item.size}</span>
                       <span class="download-count"><i class="fas fa-download"></i> ${item.downloads}</span>`;
        } else if (category === 'ebooks') {
            metaInfo = `<span class="download-size"><i class="fas fa-book"></i> ${item.pages}页</span>
                       <span class="download-count"><i class="fas fa-download"></i> ${item.downloads}</span>`;
        }
        
        // 新资源标记
        const newBadge = item.isNew ? '<span class="new-badge">NEW</span>' : '';
        
        html += `
        <div class="download-item" data-id="${item.id}" data-category="${category}">
            ${newBadge}
            <img src="${item.image}" alt="${item.title}" class="download-image">
            <div class="download-content">
                <h3 class="download-title">${item.title}</h3>
                <p class="download-description">${item.description}</p>
                <div class="download-meta">
                    ${metaInfo}
                </div>
                <div class="download-actions">
                    <a href="${item.file}" class="download-btn" download onclick="trackDownload('${item.id}', '${category}')">
                        <i class="fas fa-download"></i> 下载
                    </a>
                    <button class="download-btn secondary" onclick="showDetails('${item.id}', '${category}')">
                        <i class="fas fa-info-circle"></i> 详情
                    </button>
                </div>
                <div class="download-tags">
                    ${item.tags.map(tag => `<span class="download-tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>`;
    });
    
    container.innerHTML = html;
}

// 设置事件监听器
function setupEventListeners() {
    // 搜索功能
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') performSearch();
    });
}

// 执行搜索
function performSearch() {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) {
        // 如果搜索框为空，恢复原始显示
        renderDownloads('software', softwareGrid);
        renderDownloads('templates', templatesGrid);
        renderDownloads('ebooks', ebooksGrid);
        return;
    }
    
    // 搜索所有分类
    Object.keys(downloadsData).forEach(category => {
        const filteredItems = downloadsData[category].filter(item => {
            return item.title.toLowerCase().includes(query) || 
                   item.description.toLowerCase().includes(query) ||
                   item.tags.some(tag => tag.toLowerCase().includes(query));
        });
        
        // 临时渲染搜索结果
        const container = category === 'software' ? softwareGrid : 
                         category === 'templates' ? templatesGrid : ebooksGrid;
        
        if (filteredItems.length === 0) {
            container.innerHTML = `<div class="error">没有找到与"${query}"相关的${getCategoryName(category)}</div>`;
        } else {
            // 创建一个临时数据对象来渲染
            const tempData = { [category]: filteredItems };
            renderSearchResults(tempData[category], container);
        }
    });
}

// 渲染搜索结果
function renderSearchResults(items, container) {
    let html = '';
    items.forEach(item => {
        const category = item.id.charAt(0) === 's' ? 'software' : 
                        item.id.charAt(0) === 't' ? 'templates' : 'ebooks';
        
        // 根据不同类别显示不同的元信息
        let metaInfo = '';
        if (category === 'software') {
            metaInfo = `<span class="download-size"><i class="fas fa-weight-hanging"></i> ${item.size}</span>
                       <span class="download-count"><i class="fas fa-download"></i> ${item.downloads}</span>`;
        } else if (category === 'templates') {
            metaInfo = `<span class="download-size"><i class="fas fa-weight-hanging"></i> ${item.size}</span>
                       <span class="download-count"><i class="fas fa-download"></i> ${item.downloads}</span>`;
        } else if (category === 'ebooks') {
            metaInfo = `<span class="download-size"><i class="fas fa-book"></i> ${item.pages}页</span>
                       <span class="download-count"><i class="fas fa-download"></i> ${item.downloads}</span>`;
        }
        
        html += `
        <div class="download-item" data-id="${item.id}" data-category="${category}">
            <img src="${item.image}" alt="${item.title}" class="download-image">
            <div class="download-content">
                <h3 class="download-title">${item.title}</h3>
                <p class="download-description">${item.description}</p>
                <div class="download-meta">
                    ${metaInfo}
                </div>
                <div class="download-actions">
                    <a href="${item.file}" class="download-btn" download onclick="trackDownload('${item.id}', '${category}')">
                        <i class="fas fa-download"></i> 下载
                    </a>
                    <button class="download-btn secondary" onclick="showDetails('${item.id}', '${category}')">
                        <i class="fas fa-info-circle"></i> 详情
                    </button>
                </div>
                <div class="download-tags">
                    ${item.tags.map(tag => `<span class="download-tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>`;
    });
    
    container.innerHTML = html;
}

// 获取分类名称
function getCategoryName(category) {
    switch (category) {
        case 'software': return '软件工具';
        case 'templates': return '设计模板';
        case 'ebooks': return '电子书籍';
        default: return '资源';
    }
}

// 跟踪下载
function trackDownload(id, category) {
    // 在实际应用中，这里应该发送请求到服务器更新下载计数
    console.log(`下载跟踪: ${category} - ${id}`);
    
    // 模拟更新本地数据
    const item = downloadsData[category].find(item => item.id === id);
    if (item) {
        item.downloads++;
        updateStats();
    }
    
    // 这里可以添加实际的统计代码，如Google Analytics等
}

// 显示资源详情
function showDetails(id, category) {
    const item = downloadsData[category].find(item => item.id === id);
    if (!item) return;
    
    // 构建详情信息
    let details = `
        <h3>${item.title}</h3>
        <p><strong>描述:</strong> ${item.description}</p>
        <p><strong>文件大小:</strong> ${item.size}</p>
        <p><strong>更新日期:</strong> ${item.updated}</p>
        <p><strong>下载次数:</strong> ${item.downloads}</p>`;
    
    if (category === 'software') {
        details += `<p><strong>版本:</strong> ${item.version}</p>`;
    } else if (category === 'ebooks') {
        details += `<p><strong>页数:</strong> ${item.pages}页</p>`;
    }
    
    details += `<p><strong>标签:</strong> ${item.tags.join(', ')}</p>`;
    
    // 使用浏览器原生弹窗显示详情
    alert(details);
    
    // 在实际应用中，可以使用更美观的模态框
}

// 页面加载完成后初始化下载页面
document.addEventListener('DOMContentLoaded', function() {
    // 更新版权年份
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // 初始化下载页面
    initDownloads();
});