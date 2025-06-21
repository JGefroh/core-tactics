import { default as System } from '@core/system';


export default class GameOverSystem extends System {
    constructor() {
        super()
        this.wait = 1000;
        this.isGameOver = false;
        this.addHandler('REQUEST_GAME_OVER', (payload) => {
            if (!this.isGameOver) {
                this.gameOver(payload.winner);
                this.isGameOver = true;
            }
        });
    }

    gameOver(winner) {
        this.send('PLAY_AUDIO', {
            audioKey: 'victory.mp3',
            decibels: 120,
            cooldownMs: 500
,        });
        this.send('ADD_GUI_RENDERABLE', {
            key: 'game-over',
            canvasXPosition:  window.innerWidth / 2,
            canvasYPosition: window.innerHeight / 4,
            text: `${winner == 'ally' ? 'VICTORY' : 'DEFEAT'}`,
            fontSize: window.innerWidth / (winner == 'ally' ? 4.5 : 4),
            renderAlignment: 'top-left',
            textAlign: 'center',
            fillStyle: 'rgba(0,0,255,1)',
            fontColor: winner == 'ally' ? 'rgba(0,255,0,0.8)' : 'rgba(255,0,0,0.8)'
        });

        setTimeout(() => {
            window.location.reload();
        }, 10000)
    }
}