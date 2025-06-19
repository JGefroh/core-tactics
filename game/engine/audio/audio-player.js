export default class AudioPlayer {
    constructor(options) {
        this.buffers = new Map();
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.lastPlayedByKey = {};
        this.playingSoundsByKey = {};

        this.options = {
            masterVolume: 1,
            minDistance: window.innerWidth,
            maxDistance: window.innerWidth + 100
        }

        this.configure(options)
    }

    configure(options) {
        this.options = Object.assign(this.options, options);
    }

    setListenerPositon(xPosition, yPosition) {
        // Set default listener position
        this.audioContext.listener.positionX.value = xPosition;
        this.audioContext.listener.positionY.value = yPosition;
        this.audioContext.listener.positionZ.value = 0;
    }

    async play(audioKey, options = {}) {
        if (options.cooldownMs) {
            // If sound was recently played and has a cooldown
            let lastPlayed = this.lastPlayedByKey[options.exclusiveGroup || audioKey];
            if (lastPlayed && Date.now() < lastPlayed + options.cooldownMs) {
                return;
            }
        }

        if (options.exclusive || options.exclusiveGroup) {
            // If sound is currently playing but is meant to be exclusive
            if (this.playingSoundsByKey[options.exclusiveGroup || audioKey]) {
                return;
            }
        }

        this.lastPlayedByKey[options.exclusiveGroup || audioKey] = Date.now()
        this.playingSoundsByKey[options.exclusiveGroup || audioKey] = true;
        const buffer = await this._loadBuffer(audioKey);
        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = (options.volume / 1) * this.options.masterVolume;

        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.loop = options.loop;

        // Lifecycle events
        source.onended = () => {
            delete this.playingSoundsByKey[options.exclusiveGroup || audioKey];
        };

        // Add node chains
        let nodeChain = source.connect(gainNode);
        if (options.sourceXPosition && options.sourceYPosition) {
            nodeChain = nodeChain.connect(this.createPanner(options.sourceXPosition, options.sourceYPosition))
        }
        nodeChain = nodeChain.connect(this.audioContext.destination);
        
        source.start(0, options.startsAtMs ? options.startsAtMs / 1000 : 0, options.endsAtMs ? options.endsAtMs / 1000 : undefined);
    }

    createPanner(sourceXPosition, sourceYPosition) {
        // Used for positional audio / distance falloff
        const panner = this.audioContext.createPanner();
        panner.panningModel = 'equalpower';
        panner.distanceModel = 'inverse';
        panner.refDistance = this.options.minDistance;
        panner.maxDistance = this.options.maxDistance;
        panner.rolloffFactor = 50;
        panner.positionX.value = sourceXPosition;
        panner.positionY.value = sourceYPosition;
        panner.positionZ.value = 0;

        return panner;

    }

    async _loadBuffer(audioKey) {
        if (this.buffers.has(audioKey)) return this.buffers.get(audioKey);

        const response = await fetch(audioKey);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        this.buffers.set(audioKey, audioBuffer);
        return audioBuffer;
    }
}
