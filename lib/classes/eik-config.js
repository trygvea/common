const _config = Symbol('config');
const _tokens = Symbol('tokens');

module.exports = class EikConfig {
    constructor(configHash, tokens, projectDir) {
        this[_config] = configHash;

        this[_tokens] = new Map(tokens);
        this.cwd = projectDir;
    }
    get name() {
        return this[_config].name;
    }
    get version() {
        return this[_config].version;
    }
    get map() {
        return this[_config]['import-map'] || [];
    }
    get server() {
        const configuredServer = this[_config].server;
        if (configuredServer) {
            return configuredServer;
        }
        return this[_tokens].keys().next().value;
    }
    get token() {
        return this[_tokens].get(this.server);
    }
    get files() {
        return this[_config].files;
    }
    get out() {
        return this[_config].out || '.eik';
    }
};
