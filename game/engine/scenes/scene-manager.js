class SceneManager {
    constructor() {
        this.scenes = {};
        this.currentSceneKey = null;
    }

    registerScene(core, sceneKey, scene) {
        this.scenes[sceneKey] = new scene(this);
    }

    loadScene(core, sceneKey) {
        if (sceneKey == this.currentSceneKey) {
            return;
        };
        if (this.currentSceneKey) {
            this.unloadScene(core, this.currentSceneKey)
        }
        this.currentSceneKey = sceneKey;
        this.scenes[sceneKey].load(core);
        this._registerHooks(core);
    }

    unloadScene(core, sceneKey) {
        this.scenes[sceneKey].unload(core);
    }

    _registerHooks(core) {
        core.addHandler('LOAD_SCENE', (payload) => {
            this.loadScene(core, payload.sceneKey);
        })
    }
}

export default new SceneManager();