import SceneManager from '@game/engine/scenes/scene-manager';
import { TitleScene } from '@game/specifics/scenes/title-scene';
import { GameScene } from '@game/specifics/scenes/game-scene';
import { EditorScene } from '../../editor/editor-scene';
import BaseScene from '@game/engine/scenes/base-scene';

export class BootstrapScene extends BaseScene {
    load(core) {
        this.setPageMetadata();
        let isCompatible = this.setPageContents();

        if (isCompatible) {
            this.defineCanvas();
            this.loadFont();
            
            SceneManager.registerScene(core, 'title', TitleScene)
            SceneManager.registerScene(core, 'game', GameScene)
            SceneManager.registerScene(core, 'editor', EditorScene)

            if (window.location.href.indexOf('skiptitle') != -1) {
                 if (window.location.href.indexOf('editor') != -1) {
                    SceneManager.loadScene(core, 'editor');
                 }
                 else {
                    SceneManager.loadScene(core, 'game');
                 }
            }
            else {
                SceneManager.loadScene(core, 'title');
            }
        }
    }

    unload(core) {
    }

    setPageMetadata() {
        document.title = "Tactics by Joseph Gefroh";

        let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/png';
        link.rel = 'icon';
        link.href = '/assets/images/favicon.ico';
        document.head.appendChild(link);
    }

    setPageContents() {
        const ua = navigator.userAgent;
        const isChrome = /Chrome/.test(ua) &&
            /Google Inc/.test(navigator.vendor) &&
            !/Edg/.test(ua) &&
            !/OPR/.test(ua) &&
            !/Brave/.test(ua);

        if (!isChrome && window.location.href.indexOf('forceload') == -1) {
            document.body.style.margin = '0';
            document.body.style.backgroundColor = 'black';
            document.documentElement.style.backgroundColor = 'black';
            document.body.innerHTML = `
            <div style="color: white;font-family:sans-serif;padding:2rem;text-align:center;">
              <h1>Tactics by Joseph Gefroh</h1>
              <h3>Unsupported Browser</h3>
              <p>Tactics was designed to work in <b>Google Chrome</b>.</p>
              <p><a href="/?forceload" style="color: white;">Try playing anyways</p>
              <p><a href="https://github.com/jgefroh/core-tactics" style="color: white;">Github</a></p>
            </div>
          `;
          return false;
        }
        return true;
    }


    defineCanvas() {
        const canvas = document.createElement("canvas");
        canvas.setAttribute("id", "canvas");
        document.body.appendChild(canvas);
        document.body.style = 'margin: 0px;';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
  
        // UI Canvas (until I figure out how to re-combine the layers)
        const uiCanvas = document.createElement("canvas");
        uiCanvas.setAttribute("id", 'ui-canvas');
        document.body.appendChild(uiCanvas);
        uiCanvas.style.position = "absolute";
        uiCanvas.style.top = "0";
        uiCanvas.style.left = "0";
        uiCanvas.style.pointerEvents = "none"; // Let clicks pass through to WebGL if needed
        uiCanvas.width = window.innerWidth;
        uiCanvas.height = window.innerHeight;
        
        // canvas.style.cursor = 'none';
        // canvas.onclick = () => {
        // canvas.requestPointerLock();
        // };
    
        const offScreenCanvas = document.createElement('canvas');
        offScreenCanvas.setAttribute("id", "canvas-offscreen");
        window.offScreenCanvas = offScreenCanvas;
        offScreenCanvas.width = window.innerWidth;
        offScreenCanvas.height = window.innerHeight;
    }

    loadFont() {
    //     var customFont = new FontFace('<FONTNAME>', 'url(<FONT_PATH>)');
    //     customFont.load().then(function(loadedFont) {
    //         document.fonts.add(loadedFont);
    //     })
    }
}