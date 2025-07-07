/**
 * 文章数据数组，包含所有文章的基本信息
 * 每篇文章包含：ID、标题、日期、元信息、分类、字数、标签、图片和内容
 */
const posts = [
    {
        id: 'BilldDesk',
        title: '🌈 BilldDesk 远程在线桌面控制',
        date: '2025-06-15',
        meta: '资源下载',
        category: 'downloads',
        length: '15.2MB 安装包',
        tags: ['download', '远程桌面', 'BilldDesk','windows'],
        image: 'images/BilldDesk/BilldDesk.jpg',
        content: '在线远程：https://desk.hsslive.cn<p>客户端下载：https://desk.hsslive.cn/#/download</p><p>问题反馈：https://github.com/galaxy-s10/billd-desk/issues</p>'
    },
    {
        id: 'fmhy',
        title: '🚧Free Media Heck Yeah互联网开源工具',
        date: '2025-06-08',
        meta: '语言学习',
        category: 'language',
        length: '883字 2分钟',
        tags: ['开源项目', '人工智能', 'bash', 'mastodon', 'pub-relay'],
        image: 'images/fmhy/fmhy.png',
        content: '互联网上最大的免费内容集合！' // 内容从103.md加载
    },

    {
        id: 'Allinssl',
        title: '🔒 All in SSL - SSL证书全流程管理工具',
        date: '2024-04-15',
        meta: '技术分享',
        category: 'tech',
        length: '1700字 6钟',
        tags: ['开源', 'docker', 'Linux','GitHub', 'Windows'],
        image: 'images/Allinssl/allinssl.png',
        content: 'AllinSSL 是一个集证书申请、管理、部署和监控于一体的SSL证书全生命周期管理工具。' // 内容从106.md加载
    },
    {
        id: 'MusicFree',
        title: '🌟音乐播放器 MusicFree 桌面版',
        date: '2023-06-09',
        meta: '资源下载',
        category: 'downloads',
        length: '120.65MB 安装包',
        tags: ['Music', 'Windows', '开源', '免费', 'download'],
        image: 'images/MusicFree/MusicFree.png',
        content: '官网地址：https://musicfree.catcat.work/<p>下载下载：https://r0rvr854dd1.feishu.cn/drive/folder/IrVEfD67KlWZGkdqwjecLHFNnBb</p>'
    },
    {
        id: 'LLMS',                            // 文章ID ，对应posts/xxx.md文件
        title: '🔧Debugawesome-llm-apps',    // 文章标题
        date: '2022-08-15',                   // 文章日期
        meta: '生活随笔 ',                     // 文章分类
        category: 'life',                     // 文章分类
        length: '1200字 3分钟',               // 阅读时长
        tags: ['人工智能', '语言模型', 'GPT-4', 'AI'],  // 文章标签
        image: 'images/LLMS/LLMS.png',         // 封面图片
        content: '使用 OpenAI、Anthropic、Gemini 和开源模型的带有 AI Agents 和 RAG 的出色 LLM 应用程序集合'                           // 文章自定义封面内容（格式前后有单引号: 'xxx' ），否则填写：// 内容从xxxID.md加载
    },
	{
        id: 'Home',
        title: '🌱Honges Home 开源Home简约主页！',
        date: '2020-02-20',
        meta: '技术分享',
        category: 'tech',
        length: '2285字 5分钟',
        tags: ['开源项目','三剑客','主页','Hongge','社交媒体'],
        image: 'images/Home/home.png',
        content: '基于JavaScript和vue3代码语言编写，并考虑安全性避开PHP而写的个人主页' // 内容从104.md加载
    },
    {
        id: 'Navgation',
        title: '🌱Honges Navgation 开源SEO简约导航栏',
        date: '2019-09-19',
        meta: '技术分享',
        category: 'tech',
        length: '3400字 7分钟',
        tags: ['开源项目','三剑客','导航页','Hongge','社交平台'],
        image: 'images/Navigation/Navigation.png',
        content: '基于JavaScript和vue3代码语言编写，本着简约至上的原则，并考虑安全性避开PHP而写的导航页' // 内容从105.md加载
    },
    {
        id: 'blog',
        title: '🌱Honges Blog 开源Blog简约博客',
        date: '2018-08-18',
        meta: '技术分享',
        category: 'tech',
        length: '861字 2分钟',
        tags: ['开源项目', 'mastodon', 'Blog', 'Hongge', '博客'],
        image: 'images/blog/blog.png',
        content: '🟩 你好！我是一名80后业余网络爱好者，喜欢学习和研究语言代码和运算逻辑。我会在博客中分享玩法教程和资源下载以及开源的项目。欢迎你的关注！' // 内容从102.md加载
    },
];
/*分割线：以上是文章区域用户可修改，下面为函数部分不懂代码请勿修改===================================*/
/**
 * 文章分类配置
 * 每个分类包含：名称、描述、图标、颜色和文章数量
 */
// 文章分类数据，包含分类名称和描述
const categories = {
    'tech': {
        name: '技术分享',
        description: '编程开发和开源技术相关文章',
        icon: 'fa-code',  // Font Awesome图标
        color: '#2e7d32',  // 主题绿色
        count: 0  // 初始化文章数量为0
    },
    'language': {
        name: '语言学习',
        description: '印地语及其他语言学习经验',
        icon: 'fa-language',
        color: '#1565C0',
        count: 0
    },
    'life': {
        name: '生活随笔',
        description: '日常思考与生活记录',
        icon: 'fa-pen-fancy',
        color: '#6A1B9A',
        count: 0
    },
    'downloads': {
        name: '资源下载',
        description: '可下载的技术资源和文件',
        icon: 'fa-download',  // 下载图标
        color: '#D32F2F',  // 红色突出显示
        count: 0
    }
// 在此添加其他分类...	
};

// 关于我信息
const about = {
    name: 'Holger Hub',
    title: '印地语本科生，科技与开源爱好者',
    bio: '我是一名对技术和语言充满热情的学生，喜欢探索开源世界和不同文化。',
    contact: 'contact@holgerhub.com',
    social: {
        github: 'https://github.com/holgerhub',
        twitter: 'https://twitter.com/holgerhub',
        mastodon: 'https://mastodon.social/@holgerhub'
    }
};

/**
 * 初始化分类文章数量统计
 * 遍历所有文章，统计每个分类下的文章数量
 */
// 初始化分类文章数量统计-----遍历所有分类，统计每个分类下的文章数量
function initCategoryCounts() {
    const allPosts = getAllPosts();
    Object.keys(categories).forEach(categoryId => {
        categories[categoryId].count = allPosts.filter(post => 
            post.category === categoryId
        ).length;
    });
}

/**
 * 获取所有文章数据
 * @returns {Array} 所有文章数组
 */
// 获取所有文章数据
function getAllPosts() {
    return posts;
}

/**
 * 根据ID获取文章（异步加载MD内容）
 * @param {string} id 文章ID
 * @returns {Promise<Object>} 文章对象
 */
// 根据ID获取文章（异步加载MD内容）
async function getPostById(id) {
    const post = posts.find(post => post.id === id);
    if (post) {
        try {
            // 从posts目录加载对应的MD文件
            const response = await fetch(`posts/${id}.md`);
            post.content = response.ok ? await response.text() : post.content || '（内容加载失败）';
        } catch (error) {
            console.error('加载文章内容出错:', error);
            post.content = post.content || '（内容加载失败）';
        }
    }
    return post;
}

/**
 * 根据分类获取文章
 * @param {string} category 分类ID
 * @returns {Array} 该分类下的文章数组
 */
// 根据分类获取文章数组
function getPostsByCategory(category) {
    return posts.filter(post => post.category === category);
}

/**
 * 搜索文章（标题、内容、标签）
 * @param {string} query 搜索关键词
 * @returns {Array} 匹配的文章数组
 */
// 搜索文章（根据标题、内容、标签）
function searchPosts(query) {
    const lowerQuery = query.toLowerCase();
    return posts.filter(post => 
        post.title.toLowerCase().includes(lowerQuery) || 
        post.content.toLowerCase().includes(lowerQuery) ||
        post.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
}

/**
 * 获取所有分类数据
 * @returns {Object} 分类配置对象
 */
// 获取所有分类数据
function getAllCategories() {
    return categories;
}

/**
 * 获取关于我信息
 * @returns {Object} 关于我信息对象
 */
// 获取关于我信息
function getAboutInfo() {
    return about;
}