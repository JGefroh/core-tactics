import { default as Component } from '@core/component';

export default class IntentComponent extends Component {
    
    constructor(payload = {}) {
        super()
        this.componentType = 'IntentComponent';

        this.intentsByName = new Map();
        this.intentsById = new Map();
    }

    addIntent(id, intentName, payload, atEnd = true) {
        payload.id = id;

        if (!this.intentsByName.has(intentName)) {
            let intents = [];
            this.intentsByName.set(intentName, intents);
            if (!this.intentsById.has(id)) {
                this.intentsById.set(id, intents);
            }
        }

        if (atEnd) {
            this.intentsByName.get(intentName).push(payload);
        }
        else {
            this.intentsByName.get(intentName).unshift(payload);
        }
    }

    insertIntent(id, intentName, payload) {
        this.addIntent(id, intentName, payload, false);
    }

    replaceIntent(id, intentName, payload) {
        this.removeIntents(intentName);
        this.addIntent(id, intentName, payload)
    }

    removeIntent(intentName) {
        const queue = this.intentsByName.get(intentName);
        if (!queue || queue.length === 0) return;

        const payload = queue.shift();

        if (queue.length === 0) {
            this.intentsByName.delete(intentName);
            this.intentsById.delete(payload.id);
        }
    }
    

    getIntentByName(intentName, position) {
        const list = this.intentsByName.get(intentName);
        if (!list || list.length === 0) return undefined;
        return list[0];
    }

    getIntentById(intentId) {
        const list = this.intentsById.get(intentId);
        if (!list || list.length === 0) return undefined;
        return list[0];
    }

    removeIntents(intentName) {
        let intent = this.getIntentByName(intentName)
        this.intentsById.delete(intent?.id)
        this.intentsByName.delete(intentName)
    }

    clearIntents() {
        this.intentsById.clear();
        this.intentsByName.clear();
    }
}