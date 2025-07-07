/**
 * 相册页面主脚本
 * 功能：图片加载、分类筛选、搜索、分页、图片预览等
 */

// 图片数据 - 实际项目中可以从服务器获取
const galleryData = [
    {
        id: 1,
        title: "雁荡晨曦",
        description: "浙江雁荡山清晨的第一缕阳光穿透云海，为群山披上金色外衣",
        image: "images/gallery/gallery-1.jpg",
        category: "nature",
        date: "2023-05-15",
        location: "浙江雁荡山",
        tags: ["日出", "云海", "山脉", "自然风光"]
    },
    {
        id: 2,
        title: "外滩夜色",
        description: "上海外滩灯火璀璨的夜景，黄浦江倒映着陆家嘴的摩天大楼",
        image: "images/gallery/gallery-2.jpg",
        category: "city",
        date: "2023-06-20",
        location: "上海外滩",
        tags: ["城市风光", "夜景", "地标", "长曝光"]
    },
    {
        id: 3,
        title: "黄山云瀑",
        description: "黄山云海如瀑布般从峰顶倾泻而下，形成壮观的自然奇观",
        image: "images/gallery/gallery-3.jpg",
        category: "nature",
        date: "2023-07-12",
        location: "安徽黄山",
        tags: ["云海", "奇松", "怪石", "世界遗产"]
    },
    {
        id: 4,
        title: "香港维港",
        description: "从太平山顶俯瞰维多利亚港，城市天际线与海港交相辉映",
        image: "images/gallery/gallery-4.jpg",
        category: "city",
        date: "2023-08-05",
        location: "香港",
        tags: ["城市全景", "海港", "天际线", "国际都市"]
    },
    {
        id: 5,
        title: "西湖雪霁",
        description: "雪后初晴的杭州西湖，断桥残雪与湖面倒影构成水墨画卷",
        image: "images/gallery/gallery-5.jpg",
        category: "nature",
        date: "2023-01-18",
        location: "杭州西湖",
        tags: ["雪景", "冬日", "文化遗产", "江南风光"]
    },
    {
        id: 6,
        title: "重庆洪崖洞",
        description: "夜幕下的洪崖洞吊脚楼建筑群，灯光璀璨如宫崎骏动画场景",
        image: "images/gallery/gallery-6.jpg",
        category: "city",
        date: "2023-09-22",
        location: "重庆",
        tags: ["山地城市", "夜景", "民俗建筑", "网红打卡"]
    },
    {
        id: 7,
        title: "藏族老人",
        description: "西藏高原上饱经风霜的藏族老人，皱纹中刻满故事与智慧",
        image: "images/gallery/gallery-7.jpg",
        category: "people",
        date: "2023-04-30",
        location: "西藏拉萨",
        tags: ["人像", "少数民族", "纪实", "高原"]
    },
    {
        id: 8,
        title: "抽象光影",
        description: "通过多重曝光创造的抽象光影艺术作品，展现色彩与形态的流动",
        image: "images/gallery/gallery-8.jpg",
        category: "art",
        date: "2023-10-15",
        location: "北京798艺术区",
        tags: ["实验摄影", "抽象", "色彩", "创意"]
    },
    {
        id: 9,
        title: "街头艺人",
        description: "巴黎蒙马特高地的街头画家专注创作，艺术气息弥漫在空气中",
        image: "images/gallery/gallery-9.jpg",
        category: "people",
        date: "2023-03-08",
        location: "法国巴黎",
        tags: ["街头文化", "艺术家", "欧洲", "纪实"]
    },
    {
        id: 10,
        title: "几何建筑",
        description: "现代建筑中的几何线条与光影交错，形成强烈的视觉冲击",
        image: "images/gallery/gallery-10.jpg",
        category: "art",
        date: "2023-11-11",
        location: "上海西岸",
        tags: ["建筑摄影", "极简", "线条", "现代艺术"]
    },
    {
        id: 11,
        title: "渔夫剪影",
        description: "霞浦滩涂上渔夫收网的剪影，与晚霞构成完美的黄金分割",
        image: "images/gallery/gallery-11.jpg",
        category: "people",
        date: "2023-05-28",
        location: "福建霞浦",
        tags: ["劳动场景", "剪影", "日落", "人文"]
    },
    {
        id: 12,
        title: "液态金属",
        description: "通过特殊摄影技术捕捉的水银流体形态，展现超现实的金属美感",
        image: "images/gallery/gallery-12.jpg",
        category: "art",
        date: "2023-12-05",
        location: "深圳实验室",
        tags: ["概念摄影", "流体", "金属", "科幻感"]
    }

    // 更多图片数据...
    // 实际项目中可以替换为从服务器获取的动态数据
];


// DOM元素
const galleryGrid = document.getElementById('gallery-grid');
const filterButtons = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('gallery-search');
const searchButton = document.getElementById('gallery-search-btn');
const prevPageButton = document.getElementById('prev-page');
const nextPageButton = document.getElementById('next-page');
const pageInfo = document.getElementById('page-info');
const modal = document.getElementById('gallery-modal');
const modalImage = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalDate = document.getElementById('modal-date');
const modalLocation = document.getElementById('modal-location');
const modalTags = document.getElementById('modal-tags');
const closeModal = document.querySelector('.close-modal');
const prevImageButton = document.getElementById('prev-img');
const nextImageButton = document.getElementById('next-img');
const downloadButton = document.getElementById('download-btn');
const shareButton = document.getElementById('share-btn');

// 分页变量
let currentPage = 1;
const itemsPerPage = 12; // 每页显示12张图片
let filteredData = [...galleryData];
let currentFilter = 'all';
let currentSearch = '';

// 初始化相册
function initGallery() {
    renderGallery();
    setupEventListeners();
    updatePagination();
}

// 渲染相册图片
function renderGallery() {
    // 计算当前页的数据范围
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredData.slice(startIndex, endIndex);

    if (currentItems.length === 0) {
        galleryGrid.innerHTML = '<div class="error">没有找到相关图片</div>';
        return;
    }

    let html = '';
    currentItems.forEach(item => {
        html += `
        <div class="gallery-item" data-id="${item.id}" data-category="${item.category}">
            <img src="${item.image}" alt="${item.title}" class="gallery-img">
            <div class="gallery-caption">
                <h3>${item.title}</h3>
                <p>${item.description.substring(0, 30)}...</p>
            </div>
        </div>`;
    });

    galleryGrid.innerHTML = html;

    // 为每个图片项添加点击事件
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            openModal(id);
        });
    });
}

// 设置事件监听器
function setupEventListeners() {
    // 分类筛选按钮
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 更新活动按钮状态
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            currentFilter = this.getAttribute('data-filter');
            currentPage = 1; // 重置到第一页
            filterGallery();
        });
    });

    // 搜索功能
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') performSearch();
    });

    // 分页控制
    prevPageButton.addEventListener('click', goToPrevPage);
    nextPageButton.addEventListener('click', goToNextPage);

    // 模态框控制
    closeModal.addEventListener('click', closeImageModal);
    prevImageButton.addEventListener('click', showPrevImage);
    nextImageButton.addEventListener('click', showNextImage);
    downloadButton.addEventListener('click', downloadImage);
    shareButton.addEventListener('click', shareImage);
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeImageModal();
        }
    });
    window.addEventListener('keydown', function(e) {
        if (modal.style.display === 'block') {
            if (e.key === 'Escape') closeImageModal();
            if (e.key === 'ArrowLeft') showPrevImage();
            if (e.key === 'ArrowRight') showNextImage();
        }
    });
}

// 筛选图片
function filterGallery() {
    filteredData = galleryData.filter(item => {
        // 应用分类筛选
        const categoryMatch = currentFilter === 'all' || item.category === currentFilter;
        // 应用搜索筛选
        const searchMatch = item.title.toLowerCase().includes(currentSearch.toLowerCase()) || 
                           item.description.toLowerCase().includes(currentSearch.toLowerCase()) ||
                           item.tags.some(tag => tag.toLowerCase().includes(currentSearch.toLowerCase()));
        
        return categoryMatch && searchMatch;
    });

    updatePagination();
    renderGallery();
}

// 执行搜索
function performSearch() {
    currentSearch = searchInput.value.trim();
    currentPage = 1;
    filterGallery();
}

// 更新分页控制
function updatePagination() {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    
    // 更新分页信息
    pageInfo.textContent = `${currentPage} / ${totalPages}`;
    
    // 更新按钮状态
    prevPageButton.disabled = currentPage <= 1;
    nextPageButton.disabled = currentPage >= totalPages;
}

// 上一页
function goToPrevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderGallery();
        updatePagination();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// 下一页
function goToNextPage() {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderGallery();
        updatePagination();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// 打开图片模态框
function openModal(id) {
    const item = galleryData.find(item => item.id === id);
    if (!item) return;

    // 更新模态框内容
    modalImage.src = item.image;
    modalImage.alt = item.title;
    modalTitle.textContent = item.title;
    modalDescription.textContent = item.description;
    modalDate.textContent = `拍摄日期: ${item.date}`;
    modalLocation.textContent = `地点: ${item.location}`;
    modalTags.textContent = `标签: ${item.tags.join(', ')}`;

    // 设置当前图片ID
    modalImage.dataset.id = id;

    // 显示模态框
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // 防止背景滚动
}

// 关闭图片模态框
function closeImageModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// 显示上一张图片
function showPrevImage() {
    const currentId = parseInt(modalImage.dataset.id);
    const currentIndex = filteredData.findIndex(item => item.id === currentId);
    
    if (currentIndex > 0) {
        const prevItem = filteredData[currentIndex - 1];
        openModal(prevItem.id);
    }
}

// 显示下一张图片
function showNextImage() {
    const currentId = parseInt(modalImage.dataset.id);
    const currentIndex = filteredData.findIndex(item => item.id === currentId);
    
    if (currentIndex < filteredData.length - 1) {
        const nextItem = filteredData[currentIndex + 1];
        openModal(nextItem.id);
    }
}

// 下载图片
function downloadImage() {
    const currentId = parseInt(modalImage.dataset.id);
    const item = galleryData.find(item => item.id === currentId);
    if (!item) return;

    // 创建一个临时链接元素
    const link = document.createElement('a');
    link.href = item.image;
    link.download = `honge-gallery-${item.id}-${item.title.replace(/\s+/g, '-')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 分享图片
function shareImage() {
    const currentId = parseInt(modalImage.dataset.id);
    const item = galleryData.find(item => item.id === currentId);
    if (!item) return;

    if (navigator.share) {
        navigator.share({
            title: item.title,
            text: item.description,
            url: window.location.href.split('#')[0] + `?image=${item.id}`
        }).catch(err => {
            console.log('分享失败:', err);
            fallbackShare(item);
        });
    } else {
        fallbackShare(item);
    }
}

// 备用分享方法
function fallbackShare(item) {
    const shareText = `${item.title} - ${item.description}\n\n查看完整图片: ${window.location.href.split('#')[0]}?image=${item.id}`;
    prompt('复制以下内容分享:', shareText);
}

// 页面加载完成后初始化相册
document.addEventListener('DOMContentLoaded', function() {
    // 更新版权年份
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // 初始化相册
    initGallery();
});