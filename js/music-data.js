/**
 * 增强版音乐数据文件
 * 包含所有音乐和歌单数据，以及歌词信息
 */

// 定义主色调RGB值（用于CSS变量）
const PRIMARY_RGB = '0, 255, 0';

// 音乐库数据
const musicLibrary = {
    // 最爱歌单
    favorites: [
        {
            id: 1,
            title: "夜曲",
            artist: "周杰伦",
            album: "十一月的萧邦",
            cover: "icon/music-cover1.jpg",
            src: "music/night-song.mp3",
            duration: "3:45",
            lyrics: [
                { time: 0, text: "夜曲 - 周杰伦" },
                { time: 10, text: "一群嗜血的蚂蚁 被腐肉所吸引" },
                { time: 15, text: "我面无表情 看孤独的风景" },
                { time: 20, text: "失去你 爱恨开始分明" },
                { time: 25, text: "失去你 还有什么事好关心" },
                // 更多歌词...
            ]
        },
        {
            id: 2,
            title: "晴天",
            artist: "周杰伦",
            album: "叶惠美",
            cover: "icon/music-cover2.jpg",
            src: "music/sunny-day.mp3",
            duration: "4:30",
            lyrics: [
                { time: 0, text: "晴天 - 周杰伦" },
                { time: 12, text: "故事的小黄花 从出生那年就飘着" },
                { time: 18, text: "童年的荡秋千 随记忆一直晃到现在" },
                // 更多歌词...
            ]
        },
        // 更多歌曲...
    ],
    
    // DJ舞曲歌单
    dj: [
        {
            id: 6,
            title: "电音之王",
            artist: "王绎龙",
            album: "电音之王",
            cover: "icon/music-dj1.jpg",
            src: "music/king-of-edm.mp3",
            duration: "5:20",
            lyrics: [
                { time: 0, text: "电音之王 - 王绎龙" },
                { time: 30, text: "Everybody跟我一起 嗨嗨嗨" },
                { time: 35, text: "Everybody我要让你 嗨嗨嗨" },
                // 更多歌词...
            ]
        },
        {
            id: 7,
            title: "Faded",
            artist: "Alan Walker",
            album: "Faded",
            cover: "icon/music-dj2.jpg",
            src: "music/faded.mp3",
            duration: "3:35",
            lyrics: [
                { time: 0, text: "Faded - Alan Walker" },
                { time: 20, text: "You were the shadow to my light" },
                { time: 25, text: "Did you feel us" },
                // 更多歌词...
            ]
        },
        // 更多DJ歌曲...
    ],
    
    // 轻音乐歌单
    light: [
        {
            id: 8,
            title: "月光",
            artist: "班得瑞",
            album: "月光水岸",
            cover: "icon/music-light1.jpg",
            src: "music/moonlight.mp3",
            duration: "4:15",
            lyrics: [] // 纯音乐无歌词
        },
        {
            id: 9,
            title: "清晨",
            artist: "班得瑞",
            album: "迷雾森林",
            cover: "icon/music-light2.jpg",
            src: "music/morning.mp3",
            duration: "3:50",
            lyrics: [] // 纯音乐无歌词
        },
        // 更多轻音乐...
    ],
    
    // 运动歌单
    workout: [
        {
            id: 10,
            title: "双截棍",
            artist: "周杰伦",
            album: "范特西",
            cover: "icon/music-cover9.jpg",
            src: "music/nunchucks.mp3",
            duration: "3:20",
            lyrics: [
                { time: 0, text: "双截棍 - 周杰伦" },
                { time: 15, text: "岩烧店的烟味弥漫 隔壁是国术馆" },
                { time: 20, text: "店里面的妈妈桑 茶道有三段" },
                // 更多歌词...
            ]
        },
        // 更多运动歌曲...
    ]
};

/**
 * 获取所有音乐
 * @returns {Array} 所有音乐的数组
 */
function getAllMusic() {
    let allMusic = [];
    for (const playlist in musicLibrary) {
        allMusic = allMusic.concat(musicLibrary[playlist]);
    }
    return allMusic;
}

/**
 * 根据歌单ID获取音乐
 * @param {string} playlistId 歌单ID
 * @returns {Array} 对应歌单的音乐数组
 */
function getMusicByPlaylist(playlistId) {
    return musicLibrary[playlistId] || [];
}

/**
 * 根据ID获取单首音乐
 * @param {number} id 音乐ID
 * @returns {Object|null} 音乐对象或null
 */
function getMusicById(id) {
    const allMusic = getAllMusic();
    return allMusic.find(song => song.id === id) || null;
}

/**
 * 搜索音乐
 * @param {string} query 搜索关键词
 * @returns {Array} 匹配的音乐数组
 */
function searchMusic(query) {
    const allMusic = getAllMusic();
    const lowerQuery = query.toLowerCase();
    return allMusic.filter(song => 
        song.title.toLowerCase().includes(lowerQuery) || 
        song.artist.toLowerCase().includes(lowerQuery) ||
        song.album.toLowerCase().includes(lowerQuery)
    );
}

/**
 * 获取主色调RGB值
 * @returns {string} RGB值字符串
 */
function getPrimaryRgb() {
    return PRIMARY_RGB;
}