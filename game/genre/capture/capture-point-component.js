import { default as Component } from '@core/component';

export default class CapturePointComponent extends Component {
    constructor(payload = {}) {
        super();
        this.componentType = 'CapturePointComponent';

        // Fill up a capture point to "capture" it
        this.pointsToCapture = payload.pointsToCapture || 30;
        this.capturePointsProgress = payload.pointsToCapture || 0;
        this.lastProgressed = Date.now();
        this.progressionIntervalMs = 1000;
    }
} 