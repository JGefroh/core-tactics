import { default as Component} from '@core/component'

export default class GroupComponent extends Component {
    constructor(payload = {}) {
        super();
        this.componentType = 'GroupComponent';
        this.group = payload.group;
    }
}