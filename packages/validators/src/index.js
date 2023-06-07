const semver = require('semver');
const npmPkg = require('validate-npm-package-name');

module.exports = {
    origin: (value) => {
        if (/^https?:\/\/[a-zA-Z0-9-_./]+(:[0-9]+)?/.test(value)) {
            return value.toLowerCase();
        }
        throw new Error('Parameter "origin" is not valid');
    },
    org: (value) => {
        if (/^[a-zA-Z0-9_-]+$/.test(value)) {
            return value.toLowerCase();
        }
        throw new Error(`Parameter "org" is not valid - Value: ${value}`);
    },
    name: (value) => {
        const result = npmPkg(value);
        if (result.validForNewPackages || result.validForOldPackages) {
            return value.toLowerCase();
        }
        throw new Error(`Parameter "name" is not valid - Value: ${value}`);
    },
    version: (value) => {
        const result = semver.valid(value);
        if (result) {
            return result;
        }
        throw new Error(`Parameter "version" is not valid - Value: ${value}`);
    },
    alias: (value) => {
        if (/^[0-9]+$/.test(value)) {
            return value;
        }
        throw new Error(`Parameter "alias" is not valid - Value: ${value}`);
    },
    type: (value) => {
        if (value === 'pkg' || value === 'map' || value === 'npm') {
            return value;
        }
        throw new Error(`Parameter "type" is not valid - Value: ${value}`);
    },
    semverType: (value) => {
        if (value === 'major' || value === 'minor' || value === 'patch') {
            return value;
        }
        throw new Error(
            `Parameter "semverType" is not valid - Value: ${value}`,
        );
    },
    // TODO; https://github.com/asset-pipe/core/issues/12
    extra: (value) => value,
};
