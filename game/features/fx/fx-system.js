import { default as Core } from '@core/core';
import { default as Entity } from '@core/entity.js';
import { default as System } from '@core/system';

export default class FxSystem extends System {
    constructor() {
        super()

        this.fx = {};
        this.lastFx = null;

        this.addHandler('REGISTER_FX', (payload) => {
            this.fx[payload.getFxKey()] = new payload();
        });

        this.addHandler('EXECUTE_FX', (payload) => {
            this.executeFx(payload.fxKey, payload.params);
            
            if (payload.onExecuteComplete) {
                payload.onExecuteComplete();
            }
        })

        this.addHandler('UNDO_FX', (payload) => {
            if (this.lastFx) {
                this.lastFx.undo(this._core, {});
            }
        })
    }

    work() {
    }

    executeFx(fxKey, params = {}) {
        if (!this.fx[fxKey]) {
            return;
        }

        let fx = this.fx[fxKey];
        if (this.lastFx) {
            this.lastFx.undo(this._core, {});
        }
        this.lastFx = fx;

        fx.preExecute(this._core, params);
        fx.execute(this._core, params);
        fx.postExecute(this._core, params);
    }
}

