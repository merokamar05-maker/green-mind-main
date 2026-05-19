const GAME_ENGINE = new GameEngine();

const ASSET_MANAGER = new AssetManager();

fetch("./additional.json")
    .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
    })
    .then(data => {
        console.log("Loading assets from additional.json...");
        Array.from(data["jsons"]).forEach(_path => {
            ASSET_MANAGER.queueDownloadJson(_path);
        });
        Array.from(data["images"]).forEach(_path => {
            ASSET_MANAGER.queueDownloadImage(_path);
        });
        Array.from(data["audios"]).forEach(_path => {
            ASSET_MANAGER.queueDownloadMusic(_path);
        });
        ASSET_MANAGER.downloadAll(() => {
            console.log("All assets loaded! Starting game...");
            const canvas = document.getElementById("gameWorld");
            const ctx = canvas.getContext("2d");
            // disable image smoothing since this is a pixel game
            ctx.imageSmoothingEnabled = false
            GAME_ENGINE.init(ctx);
            GAME_ENGINE.start();
        })
    })
    .catch(error => {
        console.error(`Fatal Error: cannot load additional.json - ${error}`);
        // alert(`Game Loading Error: ${error.message}\nCheck console for details.`);
    })
