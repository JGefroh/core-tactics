import { default as System } from '@core/system';
import AudioPlayer from './audio-player';

export default class AudioSystem extends System {
    constructor() {
      super()

      this.exclusiveGroups = {}
      this.audioState = {
      }
      this.audioCache = {}
      this.audioPlayer = new AudioPlayer();

      this.addHandler('PLAY_AUDIO', (payload) => {
        this._playAudio(payload);
      });

      this.addHandler('STOP_AUDIO', (payload) => {
        const { audioKey, group } = payload;
        if (!this.audioState[audioKey]) return;
      
        this.audioState[audioKey].pause();
        delete this.audioState[audioKey];
        if (group) {
          delete this.exclusiveGroups[group];
        }
      });

    }
  
    work() {
      let listenerPosition = this._getAudioListenerPosition();
      if (listenerPosition) {
        this.audioPlayer.setListenerPositon(listenerPosition.xPosition, listenerPosition.yPosition)
      }
    };

    async _playAudio(payload) {
        const {
          audioKey,
          sourceXPosition, // Optional If you set this and decibels, you can use audio falloff.
          sourceYPosition, // Optional
          volume = 1, // an absolute value for volume
          decibels, // Optional The "power" of the sound, 
          cooldownMs = 0, // optional - amount of time before another variant of this audio key or exclusiveGroup can be played.
          loop = false, // whether to loop
          exclusiveGroup, // exlusivity is segmented via all shared audio playbacks in the same group - useful for variants
          endsAtMs, // end playback at a specific ms
          startsAtMs = 0, // start playback at a specific ms
        } = payload;

        this.audioPlayer.play(`/assets/audio/${audioKey}`, {
          sourceXPosition: sourceXPosition,
          sourceYPosition: sourceYPosition,
          volume: decibels >= 0 ? (decibels/130) : volume ,
          cooldownMs: cooldownMs,
          exclusiveGroup: exclusiveGroup,
          startsAtMs: startsAtMs,
          endsAtMs: endsAtMs
        });
    }

    _getAudioListenerPosition() {
      let position = null;

      this.workForTag('AudioListener', (tag) => {
        position = {xPosition: tag.getXPosition(), yPosition: tag.getYPosition()}
      });

      return position;
    }
  }
  