require(["scenes/need-files", "skin", "sound"], function(NeedFiles, Skin, sound) {
    
    let app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        resolution: window.devicePixelRatio || 1,
        autoResize: true,
    });
	document.body.removeChild(document.getElementById("title"));
    document.body.appendChild(app.view);
    
    app.renderer.autoResize = true;
    app.renderer.backgroundColor = 0xFFFFFF;

    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    PIXI.Sprite.prototype.bringToFront = function() {
        if (this.parent) {
            var parent = this.parent;
            parent.removeChild(this);
            parent.addChild(this);
        }
    }

    var game = {
        window: window,
        stage: null,
        scene: null,
        updatePlayerActions: null,

        allowMouseButton: true,
        allowMouseScroll: true,
        backgroundDimRate: 0.7,
        backgroundBlurRate: 0.0, // not yet implemented

        masterVolume: 0.7,
        effectVolume: 1.0,
        musicVolume: 1.0,

        cursorSize: 1.0,

        // cursor info
        mouseX: 0, // in absolute pixel
        mouseY: 0,
        K1down: false,
        K2down: false,
        K1keycode: 90,
        K2keycode: 88,
        M1down: false,
        M2down: false,
        down: false,

        lastFrameTime: -1,
        finished : false,
        score: {
          nbClicks: 0,
          goodClicks: 0,
          points: 0
        },
        sample: [{}, {}, {}, {}],
        sampleSet: 1
    };
    window.game = game;

    window.addEventListener("mousemove", function(e) {
        game.mouseX = e.clientX;
        game.mouseY = e.clientY;
    });
    
    document.addEventListener("contextmenu", function(e) {
        e.preventDefault();
        return false;
    });

    game.stage = new PIXI.Container();

    game.cursor = null;

    var statusText = new PIXI.Text("Loading skin...", { font: "24px sans-serif" });
    statusText.anchor.x = statusText.anchor.y = 0.5;
    statusText.x = window.innerWidth / 2;
    statusText.y = window.innerHeight / 2;
    game.stage.addChild(statusText);

    var wipText = new PIXI.Text("WORK IN PROGRESS", { font: "24px sans-serif", fill: 0xFF0000 });
    wipText.anchor.x = 0.5;
    wipText.x = window.innerWidth / 2;
    wipText.y = 0;
    game.stage.addChild(wipText);

    // load game cursor
    Skin.oncomplete = function() {
        game.cursor = new PIXI.Sprite(Skin["cursor.png"]);
        game.cursor.anchor.x = game.cursor.anchor.y = 0.5;
        game.stage.addChild(game.cursor);
        game.stage.removeChild(statusText);
        game.scene = new NeedFiles(game);
    };
    Skin.loadDefault();

    function gameLoop(timestamp) {
        var timediff = timestamp - game.lastFrameTime;

        if (game.cursor) {
            // Handle cursor
            game.cursor.x = game.mouseX;
            game.cursor.y = game.mouseY;
            game.cursor.scale.x = game.cursor.scale.y = 0.6 * game.cursorSize;
            game.cursor.bringToFront();
        }

        if (game.scene) {
            game.scene.render(timestamp);
        }

        wipText.bringToFront();
        app.renderer.render(game.stage);
        game.lastFrameTime = timestamp;

        window.requestAnimationFrame(gameLoop);
    }

    window.requestAnimationFrame(gameLoop);
});
