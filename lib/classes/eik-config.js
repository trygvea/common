const _config = Symbol('config');
const _tokens = Symbol('tokens');
module.exports = class EikConfig {
    constructor(configHash, tokens) {
        this[_config] = configHash;

        this[_tokens] = new Map(tokens);
    }
    get name() {
        return this[_config].name;
    }
    get version() {
        return this[_config].version;
    }
    get map() {
        return this[_config]['import-map'];
    }
    get server() {
        // TODO
        // const configuredServer = this[_config].server
        return this[_tokens].keys().next().value;
    }
    get token() {
        return this[_tokens].get(this.server);
    }
};
