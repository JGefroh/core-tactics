import { default as Component } from '@core/component';

export default class MinimapComponent extends Component {
    constructor(payload = {}) {
        super();
        this.componentType = 'MinimapComponent';
        this.color = payload.color;
    }
} 