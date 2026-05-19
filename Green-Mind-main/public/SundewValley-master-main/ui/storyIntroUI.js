class StoryIntroUI {
    static play(videoPath, onComplete) {
        // 1. Pause Game Engine and Store Music State
        Level.STORY_PLAYING = true;
        const previousPausedState = GAME_ENGINE.paused;
        GAME_ENGINE.paused = true;
        const previousBGM = Level.BGM;
        if (previousBGM && previousBGM !== "$NO_MUSIC$") {
            ASSET_MANAGER.stopMusic(previousBGM);
        }

        const overlay = document.createElement('div');
        overlay.id = 'story-intro-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.backgroundColor = 'black';
        overlay.style.zIndex = '9999';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';

        // 2. Loading Indicator (Centered on top of video)
        const loadingIndicator = document.createElement('div');
        loadingIndicator.id = 'story-loading';
        loadingIndicator.innerHTML = '<div class="spinner"></div><div style="margin-top:20px; font-family:Verdana; color:white; font-size:18px; text-shadow: 0 0 10px rgba(0,0,0,1);">Buffering Story...</div>';
        loadingIndicator.style.position = 'absolute';
        loadingIndicator.style.top = '50%';
        loadingIndicator.style.left = '50%';
        loadingIndicator.style.transform = 'translate(-50%, -50%)';
        loadingIndicator.style.textAlign = 'center';
        loadingIndicator.style.zIndex = '10001';
        loadingIndicator.style.pointerEvents = 'none';

        
        // Add minimal CSS for spinner if not exists
        if (!document.getElementById('story-spinner-css')) {
            const style = document.createElement('style');
            style.id = 'story-spinner-css';
            style.innerHTML = `
                .spinner {
                    width: 50px;
                    height: 50px;
                    border: 5px solid rgba(255,255,255,0.1);
                    border-top-color: #fff;
                    border-radius: 50%;
                    animation: story-spin 1s linear infinite;
                    margin: 0 auto;
                }
                @keyframes story-spin { to { transform: rotate(360deg); } }
            `;
            document.head.appendChild(style);
        }
        overlay.appendChild(loadingIndicator);

        const isGif = videoPath.toLowerCase().endsWith('.gif');
        const mediaElement = document.createElement(isGif ? 'img' : 'video');
        mediaElement.src = videoPath;
        
        if (!isGif) {
            mediaElement.preload = 'auto';
            mediaElement.playsInline = true;
        }
        
        mediaElement.style.width = '100%';
        mediaElement.style.height = '100%';
        mediaElement.style.objectFit = 'contain';
        mediaElement.style.opacity = '0'; // Hide until ready
        mediaElement.style.transition = 'opacity 0.5s ease';

        const skipBtn = document.createElement('button');
        skipBtn.innerText = 'Skip >>';
        skipBtn.style.position = 'absolute';
        skipBtn.style.bottom = '30px';
        skipBtn.style.right = '40px';
        skipBtn.style.padding = '10px 20px';
        skipBtn.style.fontSize = '18px';
        skipBtn.style.fontFamily = 'Verdana';
        skipBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        skipBtn.style.color = '#fff';
        skipBtn.style.border = '2px solid rgba(255, 255, 255, 0.4)';
        skipBtn.style.borderRadius = '8px';
        skipBtn.style.cursor = 'pointer';
        skipBtn.style.zIndex = '10000';

        const finish = () => {
            // Stop video/audio immediately so it doesn't bleed into gameplay
            if (!isGif) {
                mediaElement.pause();
                mediaElement.muted = true;
                mediaElement.src = "";   // detach the media resource entirely
                mediaElement.load();     // reset the element
            }

            // Restore Game Engine and Music
            GAME_ENGINE.paused = previousPausedState;
            if (previousBGM && previousBGM !== "$NO_MUSIC$") {
                ASSET_MANAGER.playMusic(previousBGM);
            }

            overlay.style.opacity = '0';
            overlay.style.transition = 'opacity 1s ease';
            Level.STORY_PLAYING = false;
            setTimeout(() => {
                overlay.remove();
                if (onComplete) onComplete();
            }, 1000);
        };

        if (!isGif) {
            mediaElement.onended = finish;
        }
        skipBtn.onclick = finish;
        overlay.onclick = finish; // Close on click anywhere

        overlay.appendChild(mediaElement);
        overlay.appendChild(skipBtn);
        document.body.appendChild(overlay);

        // 3. Logic to start and handle buffering mid-playback
        const startPlayback = () => {
            loadingIndicator.style.display = 'none';
            mediaElement.style.opacity = '1';
            if (!isGif) {
                mediaElement.play().catch(e => {
                    console.log("Autoplay blocked, waiting for interaction");
                    const playHint = document.createElement('div');
                    playHint.id = 'play-hint';
                    playHint.innerText = 'Click to Start Story';
                    playHint.style.color = 'white';
                    playHint.style.fontSize = '24px';
                    playHint.style.cursor = 'pointer';
                    overlay.appendChild(playHint);
                    playHint.onclick = () => {
                        mediaElement.play();
                        playHint.remove();
                    };
                });
            }
        };

        if (!isGif) {
            // If the video stalls mid-way, show the loader again
            mediaElement.onwaiting = () => {
                loadingIndicator.style.display = 'block';
            };

            // When it resumes, hide the loader
            mediaElement.onplaying = () => {
                loadingIndicator.style.display = 'none';
                const hint = document.getElementById('play-hint');
                if (hint) hint.remove();
            };

            // Wait for enough data to play smoothly
            mediaElement.oncanplaythrough = startPlayback;
        } else {
            // For GIFs, wait for load
            mediaElement.onload = startPlayback;
        }
        
        // Fallback for slower connections
        setTimeout(() => {
            if (mediaElement.readyState >= 3 && loadingIndicator.style.display !== 'none') {
                startPlayback();
            }
        }, 5000);

    }
}
