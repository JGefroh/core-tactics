import { default as System } from '@core/system';
import AudioPlayer from './audio-player';

export default class AdvancedAudioSystem extends System {
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
      this.audioPlayer.setListenerPositon(listenerPosition.xPosition, listenerPosition.yPosition)
    };

    async _playAudio(payload) {
        const {
          audioKey,
          sourceXPosition, // Optional If you set this and decibels, you can use audio falloff.
          sourceYPosition, // Optional
          volume = 1, // an absolute value for volume
          decibels, // Optional The "power" of the sound, used only for audio falloff. If there's no souce or listener, use volume
          startAt = 0, // start playback at a specific second
          exclusive, // whether it should be the ONLY version playing.
          exclusiveGroup, // exlusivity is segmented via all shared audio playbacks in the same group - useful for variants
          loop, // whether to loop
          endAt, // end playback at a specific second
        } = payload;

        this.audioPlayer.play(`/assets/audio/${audioKey}`, {
          sourceXPosition: sourceXPosition,
          sourceYPosition: sourceYPosition,
          volume: decibels >= 0 ? (decibels/130) : volume 
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
  