/**
 * 增强版音乐播放器主逻辑
 * 包含歌词显示、更多歌单和优化视觉效果
 */

// 等待DOM完全加载
document.addEventListener('DOMContentLoaded', function() {
    // 获取主色调RGB值并设置为CSS变量
    const primaryRgb = getPrimaryRgb();
    document.documentElement.style.setProperty('--primary-rgb', primaryRgb);
    
    // 获取DOM元素
    const audioPlayer = new Audio();
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const volumeBar = document.getElementById('volume-bar');
    const muteBtn = document.getElementById('mute-btn');
    const repeatBtn = document.getElementById('repeat-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const playlistEl = document.getElementById('playlist');
    const currentTrackTitle = document.getElementById('current-track-title');
    const currentTrackArtist = document.getElementById('current-track-artist');
    const currentTrackCover = document.getElementById('current-track-cover');
    const playlistCountEl = document.getElementById('playlist-count');
    const searchInput = document.getElementById('music-search-input');
    const searchBtn = document.getElementById('music-search-button');
    const lyricsContent = document.getElementById('lyrics-content');
    const toggleLyricsBtn = document.getElementById('toggle-lyrics');
    
    // 播放器状态
    let isPlaying = false;
    let isShuffle = false;
    let isRepeat = false;
    let isLyricsVisible = true;
    let currentPlaylist = 'favorites'; // 默认播放最爱歌单
    let currentSongIndex = 0;
    let songs = getMusicByPlaylist(currentPlaylist); // 初始歌曲列表
    
    // 初始化播放器
    function initPlayer() {
        updatePlaylist();
        updatePlayerInfo();
        updatePlaylistCount();
        
        // 设置初始音量
        audioPlayer.volume = volumeBar.value / 100;
        
        // 如果歌单不为空，加载第一首歌
        if (songs.length > 0) {
            loadSong(currentSongIndex);
        }
    }
    
    // 加载歌曲
    function loadSong(index) {
        if (songs.length === 0) return;
        
        // 确保索引在有效范围内
        if (index < 0) index = songs.length - 1;
        if (index >= songs.length) index = 0;
        
        currentSongIndex = index;
        const song = songs[currentSongIndex];
        
        // 设置音频源
        audioPlayer.src = song.src;
        
        // 更新播放器信息
        currentTrackTitle.textContent = song.title;
        currentTrackArtist.textContent = song.artist;
        currentTrackCover.src = song.cover;
        
        // 更新歌词显示
        updateLyrics(song.lyrics || []);
        
        // 高亮播放列表中的当前歌曲
        highlightCurrentSong();
        
        // 如果之前是播放状态，继续播放
        if (isPlaying) {
            audioPlayer.play().catch(e => console.error('播放失败:', e));
        }
    }
    
    // 更新歌词显示
    function updateLyrics(lyrics) {
        lyricsContent.innerHTML = '';
        
        if (lyrics.length === 0) {
            lyricsContent.innerHTML = '<p class="no-lyrics">暂无歌词</p>';
            return;
        }
        
        lyrics.forEach(line => {
            const p = document.createElement('p');
            p.textContent = line.text;
            p.dataset.time = line.time;
            lyricsContent.appendChild(p);
        });
    }
    
    // 同步歌词高亮
    function syncLyrics() {
        const currentTime = audioPlayer.currentTime;
        const lines = lyricsContent.querySelectorAll('p');
        let activeLine = null;
        
        lines.forEach(line => {
            line.classList.remove('active');
            const lineTime = parseFloat(line.dataset.time);
            
            if (lineTime <= currentTime) {
                activeLine = line;
            }
        });
        
        if (activeLine) {
            activeLine.classList.add('active');
            // 滚动到当前歌词
            activeLine.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }
    
    // 播放/暂停
    function togglePlay() {
        if (songs.length === 0) return;
        
        if (isPlaying) {
            audioPlayer.pause();
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            document.querySelector('.music-player-section').classList.remove('playing');
        } else {
            audioPlayer.play().catch(e => console.error('播放失败:', e));
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            document.querySelector('.music-player-section').classList.add('playing');
        }
        isPlaying = !isPlaying;
    }
    
    // 上一首
    function prevSong() {
        if (songs.length === 0) return;
        
        if (isShuffle) {
            // 随机播放模式
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * songs.length);
            } while (newIndex === currentSongIndex && songs.length > 1);
            
            currentSongIndex = newIndex;
        } else {
            // 顺序播放模式
            currentSongIndex--;
            if (currentSongIndex < 0) {
                currentSongIndex = songs.length - 1;
            }
        }
        loadSong(currentSongIndex);
        if (isPlaying) {
            audioPlayer.play().catch(e => console.error('播放失败:', e));
        }
    }
    
    // 下一首
    function nextSong() {
        if (songs.length === 0) return;
        
        if (isShuffle) {
            // 随机播放模式
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * songs.length);
            } while (newIndex === currentSongIndex && songs.length > 1);
            
            currentSongIndex = newIndex;
        } else {
            // 顺序播放模式
            currentSongIndex++;
            if (currentSongIndex >= songs.length) {
                currentSongIndex = 0;
            }
        }
        loadSong(currentSongIndex);
        if (isPlaying) {
            audioPlayer.play().catch(e => console.error('播放失败:', e));
        }
    }
    
    // 更新进度条
    function updateProgress() {
        const { currentTime, duration } = audioPlayer;
        const progressPercent = (currentTime / duration) * 100;
        progressBar.value = progressPercent;
        
        // 更新时间显示
        currentTimeEl.textContent = formatTime(currentTime);
        durationEl.textContent = formatTime(duration);
        
        // 同步歌词
        if (isLyricsVisible) {
            syncLyrics();
        }
    }
    
    // 设置进度
    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audioPlayer.duration;
        audioPlayer.currentTime = (clickX / width) * duration;
    }
    
    // 格式化时间 (秒 -> MM:SS)
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }
    
    // 设置音量
    function setVolume() {
        audioPlayer.volume = this.value / 100;
        
        // 更新静音按钮图标
        updateVolumeIcon();
    }
    
    // 更新音量图标
    function updateVolumeIcon() {
        if (audioPlayer.volume === 0) {
            muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            muteBtn.title = '取消静音';
        } else if (audioPlayer.volume < 0.5) {
            muteBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
            muteBtn.title = '静音';
        } else {
            muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            muteBtn.title = '静音';
        }
    }
    
    // 切换静音
    function toggleMute() {
        if (audioPlayer.volume === 0) {
            // 如果静音，恢复之前的音量
            audioPlayer.volume = volumeBar.value / 100;
            volumeBar.value = audioPlayer.volume * 100;
        } else {
            // 如果没静音，静音并保存当前音量
            volumeBar.value = 0;
            audioPlayer.volume = 0;
        }
        updateVolumeIcon();
    }
    
    // 切换随机播放
    function toggleShuffle() {
        isShuffle = !isShuffle;
        shuffleBtn.classList.toggle('active', isShuffle);
        shuffleBtn.title = isShuffle ? '关闭随机' : '随机播放';
    }
    
    // 切换循环播放
    function toggleRepeat() {
        isRepeat = !isRepeat;
        repeatBtn.classList.toggle('active', isRepeat);
        repeatBtn.title = isRepeat ? '关闭循环' : '单曲循环';
        audioPlayer.loop = isRepeat;
    }
    
    // 切换歌词显示
    function toggleLyrics() {
        isLyricsVisible = !isLyricsVisible;
        const lyricsContainer = document.querySelector('.lyrics-container');
        
        if (isLyricsVisible) {
            lyricsContainer.style.display = 'block';
            toggleLyricsBtn.title = '隐藏歌词';
            // 恢复歌词同步
            syncLyrics();
        } else {
            lyricsContainer.style.display = 'none';
            toggleLyricsBtn.title = '显示歌词';
        }
    }
    
    // 更新播放列表显示
    function updatePlaylist() {
        playlistEl.innerHTML = '';
        
        if (songs.length === 0) {
            playlistEl.innerHTML = '<li class="empty">播放列表为空</li>';
            return;
        }
        
        songs.forEach((song, index) => {
            const li = document.createElement('li');
            li.dataset.index = index;
            
            li.innerHTML = `
                <img src="${song.cover}" alt="${song.title}">
                <div class="song-info">
                    <h4>${song.title}</h4>
                    <p>${song.artist} · ${song.album}</p>
                </div>
                <span class="song-duration">${song.duration}</span>
            `;
            
            li.addEventListener('click', () => {
                currentSongIndex = index;
                loadSong(currentSongIndex);
                if (!isPlaying) {
                    togglePlay();
                }
            });
            
            playlistEl.appendChild(li);
        });
        
        // 高亮当前歌曲
        highlightCurrentSong();
    }
    
    // 高亮当前播放的歌曲
    function highlightCurrentSong() {
        const playlistItems = playlistEl.querySelectorAll('li');
        playlistItems.forEach(item => item.classList.remove('playing'));
        
        if (playlistItems[currentSongIndex]) {
            playlistItems[currentSongIndex].classList.add('playing');
            // 滚动到当前歌曲
            playlistItems[currentSongIndex].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }
    }
    
    // 更新播放器信息
    function updatePlayerInfo() {
        if (songs.length === 0) {
            currentTrackTitle.textContent = '未选择歌曲';
            currentTrackArtist.textContent = '未知艺术家';
            currentTrackCover.src = 'icon/music-default-cover.jpg';
            return;
        }
        
        const song = songs[currentSongIndex];
        currentTrackTitle.textContent = song.title;
        currentTrackArtist.textContent = song.artist;
        currentTrackCover.src = song.cover;
    }
    
    // 更新播放列表计数
    function updatePlaylistCount() {
        playlistCountEl.textContent = `${songs.length}首歌曲`;
    }
    
    // 加载歌单
    function loadPlaylist(playlistId) {
        currentPlaylist = playlistId;
        songs = getMusicByPlaylist(playlistId);
        currentSongIndex = 0;
        
        updatePlaylist();
        updatePlayerInfo();
        updatePlaylistCount();
        
        if (songs.length > 0) {
            loadSong(currentSongIndex);
        }
    }
    
    // 搜索音乐
    function handleSearch() {
        const query = searchInput.value.trim();
        if (query) {
            songs = searchMusic(query);
            currentSongIndex = 0;
            
            updatePlaylist();
            updatePlayerInfo();
            updatePlaylistCount();
            
            if (songs.length > 0) {
                loadSong(currentSongIndex);
            }
        } else {
            // 如果搜索框为空，恢复当前歌单
            songs = getMusicByPlaylist(currentPlaylist);
            currentSongIndex = 0;
            
            updatePlaylist();
            updatePlayerInfo();
            updatePlaylistCount();
            
            if (songs.length > 0) {
                loadSong(currentSongIndex);
            }
        }
    }
    
    // 事件监听
    playBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);
    progressBar.addEventListener('input', setProgress);
    volumeBar.addEventListener('input', setVolume);
    muteBtn.addEventListener('click', toggleMute);
    shuffleBtn.addEventListener('click', toggleShuffle);
    repeatBtn.addEventListener('click', toggleRepeat);
    toggleLyricsBtn.addEventListener('click', toggleLyrics);
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    
    // 歌单卡片点击事件
    document.querySelectorAll('.playlist-card').forEach(card => {
        card.addEventListener('click', () => {
            const playlistId = card.dataset.playlistId;
            loadPlaylist(playlistId);
        });
    });
    
    // 音频事件
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', () => {
        if (!isRepeat) {
            nextSong();
        }
    });
    audioPlayer.addEventListener('play', () => {
        isPlaying = true;
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        document.querySelector('.music-player-section').classList.add('playing');
    });
    audioPlayer.addEventListener('pause', () => {
        isPlaying = false;
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        document.querySelector('.music-player-section').classList.remove('playing');
    });
    audioPlayer.addEventListener('volumechange', updateVolumeIcon);
    
    // 初始化播放器
    initPlayer();
    
    // 更新版权年份
    document.getElementById('current-year').textContent = new Date().getFullYear();
});