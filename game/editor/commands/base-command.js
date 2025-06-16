export default class BaseCommand {
    onPerform(core, system, context) {
        if (context.event == 'start' && (!this.mode || this.mode == 'ended')) {
            this.onStart(core, system, context);
            this.mode = 'started'
        }
        else if (context.event == 'continue' && this.mode == 'started') {
            this.onContinue(core, system, context);
        }
        else if (context.event == 'end') {
            this.mode = 'ended'
            this.onEnd(core, system, context);
        }
    }

    canPerform() {
        return true;
    }
}