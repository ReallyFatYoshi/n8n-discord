class Settings extends Map<string, any> {
    ready: boolean;
    login: boolean;
    testMode: boolean;
    clientId: string;
    token: string;
    baseUrl: string;
    parameters: any;
    triggerNodes: any;

    constructor() {
        super();
        this.ready = false;
        this.login = false;
        this.testMode = false;
        this.clientId = '';
        this.token = '';
        this.baseUrl = '';
        this.parameters = {};
        this.triggerNodes = {};
    }
}

const settings = new Settings();

export default settings;