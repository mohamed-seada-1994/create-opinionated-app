#!/usr/bin/env node
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var chalk = require('chalk');
var chalk__default = _interopDefault(chalk);
var figlet = _interopDefault(require('figlet'));
var inquirer = require('inquirer');
var childProcess = _interopDefault(require('child_process'));
var ora = _interopDefault(require('ora'));
var shelljs = _interopDefault(require('shelljs'));
var path = _interopDefault(require('path'));
var Handlebars = _interopDefault(require('handlebars'));
var fs = _interopDefault(require('fs'));

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

// https://stackoverflow.com/questions/46354368/how-to-have-cli-spinner-run-during-shelljs-command-exec
var runLongExec = function (command) {
    return new Promise(function (resolve, reject) {
        var spawnedProcess = childProcess.spawn(command, { shell: true });
        spawnedProcess.on('exit', resolve);
        spawnedProcess.on('error', reject);
    });
};
var execWithSpinner = function (command, successMessage, options) { return __awaiter(void 0, void 0, void 0, function () {
    var spinner, response;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                spinner = ora();
                spinner.start("Running: " + chalk__default.yellow(((_a = options) === null || _a === void 0 ? void 0 : _a.trim) ? command.replace(options.trim, '') : command));
                return [4 /*yield*/, runLongExec(command)];
            case 1:
                response = _b.sent();
                spinner.succeed(successMessage);
                return [2 /*return*/, response];
        }
    });
}); };
var exec = function (command, silent) {
    if (silent === void 0) { silent = true; }
    return shelljs.exec(command, { silent: silent });
};
var execInProject = function (projectFolder) { return function (command) {
    return exec("cd " + projectFolder + " && " + command);
}; };
var execInProjectWithSpinner = function (projectFolder) { return function (command, successMessage) {
    var goToProjectDir = "cd " + projectFolder + " && ";
    return execWithSpinner("" + goToProjectDir + command, successMessage, {
        trim: goToProjectDir,
    });
}; };
var shell = {
    exec: exec,
    execWithSpinner: execWithSpinner,
    execInProject: execInProject,
    execInProjectWithSpinner: execInProjectWithSpinner,
};

var state = {};

var addDependencies = function (name, libraries, isDev) {
    if (isDev === void 0) { isDev = false; }
    return shell.execInProjectWithSpinner(state.projectFolder)("yarn add " + libraries.join(' ') + " " + (isDev ? '-D' : ''), "[dependencies][add] " + name);
};
var removeDependencies = function (name, libraries) {
    return shell.execInProjectWithSpinner(state.projectFolder)("yarn add " + libraries.join(' '), "[dependencies][remove] " + name);
};
var moveToDevDependencies = function (name, libraries) {
    return shell.execInProjectWithSpinner(state.projectFolder)("yarn remove " + libraries.join(' ') + " && yarn add " + libraries.join(' ') + " -D", "[dependencies][move] " + name);
};
var removeFiles = function (name, files, recursive) {
    if (recursive === void 0) { recursive = false; }
    return shell.execInProjectWithSpinner(state.projectFolder)("rm " + (recursive ? '-r' : '') + " " + files.join(' '), "[fs][remove files] " + name);
};
var makeDir = function (name) {
    return shell.execWithSpinner("mkdir " + name, "[fs][make dir] " + name);
};

// TODO: Make these modules work in ES6
// eslint-disable-next-line
var through = require('through2');
// eslint-disable-next-line
var copy = require('recursive-copy');
var copyFiles = function (source, destination, context) { return __awaiter(void 0, void 0, void 0, function () {
    var options, sourcePath, projectFolder, destinationPath;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                options = {
                    overwrite: true,
                    dot: true,
                    rename: function (filePath) {
                        if (filePath.endsWith('.hbs')) {
                            return filePath.replace('.hbs', '');
                        }
                        return filePath;
                    },
                    transform: function (src) {
                        if (!src.endsWith('.hbs')) {
                            return null;
                        }
                        return through(function (chunk, _, done) {
                            var compileTemplate = Handlebars.compile(chunk.toString());
                            done(null, compileTemplate(context));
                        });
                    },
                };
                sourcePath = path.join(__dirname, 'generators', source);
                projectFolder = process.cwd() + "/" + state.projectFolder;
                destinationPath = path.join(projectFolder, destination);
                return [4 /*yield*/, copy(sourcePath, destinationPath, options)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };

var generate = function (_a) {
    var name = _a.name, source = _a.source, destination = _a.destination, context = _a.context;
    return __awaiter(void 0, void 0, void 0, function () {
        var spinner, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    spinner = ora();
                    spinner.start("[generator] running " + name);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, copyFiles(path.join(name, source), destination, context)];
                case 2:
                    _b.sent();
                    spinner.succeed("[generator] create " + name);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _b.sent();
                    spinner.warn("[generator] " + name + " error: " + error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
};

var update = function (fileName) { return function (_a, updateFile) {
    var projectName = _a.projectName, message = _a.message, messageSuccess = _a.messageSuccess;
    return __awaiter(void 0, void 0, void 0, function () {
        var spinner, jsonFilePath, jsonFile, updatedJsonFile;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    spinner = ora();
                    spinner.start(message);
                    jsonFilePath = path.join(process.cwd(), projectName, fileName);
                    // These two lines break about 10 different eslint rules 🙈
                    // eslint-disable-next-line
                    delete require.cache[jsonFilePath];
                    jsonFile = require(jsonFilePath);
                    return [4 /*yield*/, updateFile(jsonFile)];
                case 1:
                    updatedJsonFile = _b.sent();
                    fs.writeFileSync(jsonFilePath, JSON.stringify(updatedJsonFile, null, 2));
                    spinner.succeed(messageSuccess);
                    return [2 /*return*/];
            }
        });
    });
}; };
var json = {
    update: update,
};

var moduleName = '_CreateReactApp';
var initReactApp = function (context) { return __awaiter(void 0, void 0, void 0, function () {
    var isRouter;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, inquirer.prompt({
                    name: 'isRouter',
                    type: 'list',
                    message: 'Do you want to use react-router?',
                    choices: [
                        { name: 'No', value: false },
                        { name: 'Yes', value: true },
                    ],
                })];
            case 1:
                isRouter = (_a.sent()).isRouter;
                return [4 /*yield*/, shell.execWithSpinner("npx create-react-app " + context.projectFolder + " --template typescript", '[create react app] initialize')];
            case 2:
                _a.sent();
                return [4 /*yield*/, removeFiles('old project structure', ['src/*'], true)];
            case 3:
                _a.sent();
                return [4 /*yield*/, moveToDevDependencies('@types to devDependencies', ['@types/jest', '@types/node', '@types/react', '@types/react-dom'])];
            case 4:
                _a.sent();
                return [4 /*yield*/, addDependencies('install @types/webpack-env', ['@types/webpack-env'], true)];
            case 5:
                _a.sent();
                return [4 /*yield*/, addDependencies('styled-components', ['styled-components'])];
            case 6:
                _a.sent();
                return [4 /*yield*/, addDependencies('css reset', ['sanitize.css'])];
            case 7:
                _a.sent();
                return [4 /*yield*/, addDependencies('@types and testing libraries', ['@types/styled-components', 'jest-styled-components'], true)];
            case 8:
                _a.sent();
                return [4 /*yield*/, moveToDevDependencies('testing libraries', ['@testing-library/jest-dom', '@testing-library/react', '@testing-library/user-event'])];
            case 9:
                _a.sent();
                if (!isRouter) return [3 /*break*/, 12];
                return [4 /*yield*/, addDependencies('react-router', ['react-router', 'react-router-dom'])];
            case 10:
                _a.sent();
                return [4 /*yield*/, addDependencies('router @types', ['@types/react-router-dom'])];
            case 11:
                _a.sent();
                _a.label = 12;
            case 12: return [4 /*yield*/, json.update('tsconfig.json')({
                    projectName: context.projectFolder,
                    message: '[json] adding baseUrl to tsconfig.json',
                    messageSuccess: '[json] add baseUrl to tsconfig.json',
                }, function (jsonFile) { return (__assign(__assign({}, jsonFile), { compilerOptions: __assign(__assign({}, jsonFile.compilerOptions), { baseUrl: 'src' }) })); })];
            case 13:
                _a.sent();
                return [4 /*yield*/, json.update('package.json')({
                        projectName: context.projectFolder,
                        message: '[json] cleaning package.json',
                        messageSuccess: '[json] clean package.json',
                    }, function (jsonFile) {
                        delete jsonFile.private;
                        delete jsonFile.browserslist;
                        delete jsonFile.eslintConfig;
                        delete jsonFile.scripts.eject;
                        delete jsonFile.scripts.start;
                        return __assign(__assign({}, jsonFile), { scripts: __assign(__assign({}, jsonFile.scripts), { dev: 'react-scripts start' }) });
                    })];
            case 14:
                _a.sent();
                return [4 /*yield*/, generate({
                        name: moduleName,
                        source: 'templates/base',
                        destination: '.',
                        context: context,
                    })];
            case 15:
                _a.sent();
                if (!isRouter) return [3 /*break*/, 17];
                return [4 /*yield*/, generate({
                        name: moduleName,
                        source: 'templates/react-router',
                        destination: '.',
                        context: {
                            projectName: context.projectName,
                        },
                    })];
            case 16:
                _a.sent();
                _a.label = 17;
            case 17: return [2 /*return*/];
        }
    });
}); };

var moduleName$1 = 'browserslist';
var addBrowserlist = function () {
    return generate({
        name: moduleName$1,
        source: 'templates',
        destination: '.',
    });
};

var moduleName$2 = 'cypress';
var CiType;
(function (CiType) {
    CiType["NONE"] = "none";
    CiType["GITHUB"] = "github";
})(CiType || (CiType = {}));
var addCypress = function (context) { return __awaiter(void 0, void 0, void 0, function () {
    var ciType;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, inquirer.prompt({
                    name: 'ciType',
                    type: 'list',
                    message: 'Do you want to generate CI configuration for cypress?',
                    choices: [
                        { name: 'None', value: CiType.NONE },
                        { name: 'GitHub Actions', value: CiType.GITHUB },
                    ],
                })];
            case 1:
                ciType = (_a.sent()).ciType;
                return [4 /*yield*/, json.update('package.json')({
                        projectName: context.projectFolder,
                        message: '[json] adding "cypress:open" & "cypress:run" to scripts',
                        messageSuccess: '[json] add "cypress:open" & "cypress:run" to scripts',
                    }, function (jsonFile) { return (__assign(__assign({}, jsonFile), { scripts: __assign(__assign({}, jsonFile.scripts), { 'cypress:open': 'node_modules/.bin/cypress open', 'cypress:run': 'node_modules/.bin/cypress run' }) })); })];
            case 2:
                _a.sent();
                return [4 /*yield*/, addDependencies('cypress', ['cypress'], true)];
            case 3:
                _a.sent();
                return [4 /*yield*/, generate({
                        name: moduleName$2,
                        source: 'templates/base',
                        destination: '.',
                        context: context,
                    })];
            case 4:
                _a.sent();
                if (!(ciType === CiType.GITHUB)) return [3 /*break*/, 6];
                return [4 /*yield*/, generate({
                        name: moduleName$2,
                        source: 'templates/ci/github',
                        destination: '.',
                    })];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); };

var moduleName$3 = 'editorconfig';
var addEditorconfig = function () {
    return generate({
        name: moduleName$3,
        source: 'templates',
        destination: '.',
    });
};

var ProjectType;
(function (ProjectType) {
    ProjectType["CRA"] = "cra";
    ProjectType["NEXT"] = "next";
    ProjectType["RN"] = "rn";
    ProjectType["NEST"] = "nest";
})(ProjectType || (ProjectType = {}));
var AppType;
(function (AppType) {
    AppType["WEB"] = "web";
    AppType["MOBILE"] = "mobile";
    AppType["NODE"] = "node";
})(AppType || (AppType = {}));
var DeploymentType;
(function (DeploymentType) {
    DeploymentType["NONE"] = "none";
    DeploymentType["HEROKU"] = "heroku";
})(DeploymentType || (DeploymentType = {}));
var DatabaseType;
(function (DatabaseType) {
    DatabaseType["NONE"] = "none";
    DatabaseType["SQL"] = "sql";
})(DatabaseType || (DatabaseType = {}));

var moduleName$4 = 'eslint';
var addEslint = function (context) { return __awaiter(void 0, void 0, void 0, function () {
    var lintTs, dependenciesShared, dependenciesMobile, dependenciesWeb, dependenciesNode, _a, dependencies, dependencies, dependencies;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                lintTs = 'eslint --ext .ts,.tsx src';
                return [4 /*yield*/, json.update('package.json')({
                        projectName: context.projectFolder,
                        message: '[json] adding "lint:ts" to scripts',
                        messageSuccess: '[json] add "lint:ts" to scripts',
                    }, function (jsonFile) { return (__assign(__assign({}, jsonFile), { scripts: __assign(__assign({}, jsonFile.scripts), { 'lint:ts': lintTs }) })); })];
            case 1:
                _b.sent();
                dependenciesShared = ['eslint', 'eslint-plugin-import', '@code-quality/eslint-config-typescript', '@code-quality/eslint-config-jest', 'eslint-config-prettier'];
                dependenciesMobile = ['@code-quality/eslint-config-react-native'];
                dependenciesWeb = ['@code-quality/eslint-config-react'];
                dependenciesNode = ['@code-quality/eslint-config-node'];
                _a = context.appType;
                switch (_a) {
                    case AppType.MOBILE: return [3 /*break*/, 2];
                    case AppType.WEB: return [3 /*break*/, 4];
                    case AppType.NODE: return [3 /*break*/, 6];
                }
                return [3 /*break*/, 8];
            case 2:
                dependencies = __spreadArrays(dependenciesShared, dependenciesMobile);
                return [4 /*yield*/, addDependencies('eslint', dependencies, true)];
            case 3:
                _b.sent();
                return [3 /*break*/, 8];
            case 4:
                dependencies = __spreadArrays(dependenciesShared, dependenciesWeb);
                return [4 /*yield*/, addDependencies('eslint', dependencies, true)];
            case 5:
                _b.sent();
                return [3 /*break*/, 8];
            case 6:
                dependencies = __spreadArrays(dependenciesShared, dependenciesNode);
                return [4 /*yield*/, addDependencies('eslint', dependencies, true)];
            case 7:
                _b.sent();
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/, generate({
                    name: moduleName$4,
                    source: path.join('templates', context.appType),
                    destination: '.',
                })];
        }
    });
}); };

/* eslint-disable */
var logInfo = console.log;
var logger = {
    info: logInfo,
    // eslint-disable-next-line no-irregular-whitespace
    warning: function (message) { return console.log("\u00A0\u00A0" + chalk__default.red(message)); },
};

var addFilesToGit = function (context) { return __awaiter(void 0, void 0, void 0, function () {
    var code;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                code = shell.exec('git --version').code;
                if (code !== 0) {
                    return [2 /*return*/, logger.warning('git not found. skipping this step')];
                }
                return [4 /*yield*/, shell.execInProjectWithSpinner(context.projectFolder)('git add .', '[git] add new files')];
            case 1:
                _a.sent();
                return [4 /*yield*/, shell.execInProjectWithSpinner(context.projectFolder)('git commit -m "feat: bootstrap application"', '[git] commit changes')];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };

var moduleName$5 = 'git';
var setUpGitHooks = function (context) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, addDependencies('git hooks', [
                    'husky',
                    'lint-staged',
                    '@commitlint/cli',
                    '@code-quality/commitlint-config',
                ], true)];
            case 1:
                _a.sent();
                return [2 /*return*/, generate({
                        name: moduleName$5,
                        source: 'templates',
                        destination: '.',
                        context: {
                            isStylelint: context.appType !== AppType.NODE,
                        },
                    })];
        }
    });
}); };

var moduleName$6 = 'heroku';
var updatePackageJson = function (context) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, json.update('package.json')({
                    projectName: context.projectFolder,
                    message: '[json] adding heroku scripts',
                    messageSuccess: '[json] add heroku scripts',
                }, function (jsonFile) { return (__assign(__assign({}, jsonFile), { scripts: __assign(__assign({}, jsonFile.scripts), { 'heroku-postbuild': 'npm run build' }) })); })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var addHerokuWeb = function (context) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, updatePackageJson(context)];
            case 1:
                _a.sent();
                return [4 /*yield*/, generate({
                        name: moduleName$6,
                        source: 'templates/web',
                        destination: '.',
                        context: context,
                    })];
            case 2:
                _a.sent();
                if (!(context.projectType === ProjectType.CRA)) return [3 /*break*/, 5];
                return [4 /*yield*/, addDependencies('serve', ['serve'])];
            case 3:
                _a.sent();
                return [4 /*yield*/, json.update('package.json')({
                        projectName: context.projectFolder,
                        message: '[json] adding heroku scripts',
                        messageSuccess: '[json] add heroku scripts',
                    }, function (jsonFile) { return (__assign(__assign({}, jsonFile), { scripts: __assign(__assign({}, jsonFile.scripts), { 'start': 'node node_modules/.bin/serve -s build' }) })); })];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}); };
var addHerokuNode = function (context) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, updatePackageJson(context)];
            case 1:
                _a.sent();
                return [4 /*yield*/, generate({
                        name: moduleName$6,
                        source: 'templates/node',
                        destination: '.',
                        context: context,
                    })];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };

var moduleName$7 = 'prettier';
var addPrettier = function (context) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, json.update('package.json')({
                    projectName: context.projectFolder,
                    message: '[json] adding "format" to scripts',
                    messageSuccess: '[json] add "format" to scripts',
                }, function (jsonFile) { return (__assign(__assign({}, jsonFile), { scripts: __assign(__assign({}, jsonFile.scripts), { format: 'prettier --write \'*/**/*.{ts,tsx,css,md,json}\'' }) })); })];
            case 1:
                _a.sent();
                return [4 /*yield*/, addDependencies('prettier', ['prettier', '@code-quality/prettier-config'], true)];
            case 2:
                _a.sent();
                return [2 /*return*/, generate({
                        name: moduleName$7,
                        source: 'templates',
                        destination: '.',
                    })];
        }
    });
}); };

var moduleName$8 = 'stylelint';
var addStylelint = function (context) { return __awaiter(void 0, void 0, void 0, function () {
    var lintCss, dependenciesShared, dependenciesMobile, dependenciesWeb, dependencies;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                lintCss = 'stylelint \'**/*.{ts,tsx}\'';
                dependenciesShared = ['stylelint', 'prettier', 'stylelint-config-prettier'];
                dependenciesMobile = ['@code-quality/stylelint-styled-components-react-native-config'];
                dependenciesWeb = ['@code-quality/stylelint-styled-components-config'];
                dependencies = __spreadArrays(dependenciesShared, (context.appType === AppType.MOBILE ? dependenciesMobile : dependenciesWeb));
                return [4 /*yield*/, json.update('package.json')({
                        projectName: context.projectFolder,
                        message: '[json] adding lint:css to scripts',
                        messageSuccess: '[json] add "lint:css" to scripts',
                    }, function (jsonFile) { return (__assign(__assign({}, jsonFile), { scripts: __assign(__assign({}, jsonFile.scripts), { 'lint:css': lintCss }) })); })];
            case 1:
                _a.sent();
                return [4 /*yield*/, addDependencies('stylelint', dependencies, true)];
            case 2:
                _a.sent();
                return [2 /*return*/, generate({
                        name: moduleName$8,
                        source: path.join('templates', context.appType),
                        destination: '.',
                    })];
        }
    });
}); };

var createReactApp = function (context) { return __awaiter(void 0, void 0, void 0, function () {
    var isCypress, deploymentType, isHeroku;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, inquirer.prompt({
                    name: 'isCypress',
                    type: 'list',
                    message: 'Do you want to use cypress?',
                    choices: [
                        { name: 'No', value: false },
                        { name: 'Yes', value: true },
                    ],
                })];
            case 1:
                isCypress = (_a.sent()).isCypress;
                return [4 /*yield*/, inquirer.prompt({
                        name: 'deploymentType',
                        type: 'list',
                        message: 'Do you want to generate CD configuration?',
                        choices: [
                            { name: 'No', value: DeploymentType.NONE },
                            { name: 'Heroku', value: DeploymentType.HEROKU },
                        ],
                    })];
            case 2:
                deploymentType = (_a.sent()).deploymentType;
                isHeroku = deploymentType === DeploymentType.HEROKU;
                // Init app
                return [4 /*yield*/, initReactApp({
                        projectFolder: context.projectFolder,
                        projectName: context.projectName,
                        isCypress: isCypress,
                        isHeroku: isHeroku,
                    })];
            case 3:
                // Init app
                _a.sent();
                if (!isCypress) return [3 /*break*/, 5];
                return [4 /*yield*/, addCypress({ projectFolder: context.projectFolder, projectName: context.projectName })];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5: 
            // Code quality tools
            return [4 /*yield*/, addEditorconfig()];
            case 6:
                // Code quality tools
                _a.sent();
                return [4 /*yield*/, addBrowserlist()];
            case 7:
                _a.sent();
                return [4 /*yield*/, addPrettier({ projectFolder: context.projectFolder })];
            case 8:
                _a.sent();
                return [4 /*yield*/, addStylelint({
                        appType: context.appType,
                        projectFolder: context.projectFolder,
                    })];
            case 9:
                _a.sent();
                return [4 /*yield*/, addEslint({ appType: context.appType, projectFolder: context.projectFolder })
                    // Git hooks
                ];
            case 10:
                _a.sent();
                // Git hooks
                return [4 /*yield*/, setUpGitHooks({
                        appType: AppType.WEB,
                    })];
            case 11:
                // Git hooks
                _a.sent();
                if (!isHeroku) return [3 /*break*/, 13];
                return [4 /*yield*/, addHerokuWeb({
                        projectName: context.projectName,
                        projectFolder: context.projectFolder,
                        projectType: ProjectType.CRA,
                    })];
            case 12:
                _a.sent();
                _a.label = 13;
            case 13: 
            // Commit and share on GitHub
            return [4 /*yield*/, addFilesToGit({ projectFolder: context.projectFolder })];
            case 14:
                // Commit and share on GitHub
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };

var moduleName$9 = '_NestJs';
var initNestJsApp = function (context) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, shell.execWithSpinner("npx nest new " + context.projectFolder + " --package-manager yarn", '[nest.js] initialize')];
            case 1:
                _a.sent();
                return [4 /*yield*/, addDependencies('install essential libraries', ['@nestjs/config', 'class-transformer', '@nestjs/swagger', 'swagger-ui-express', '@godaddy/terminus', '@nestjs/terminus'])];
            case 2:
                _a.sent();
                return [4 /*yield*/, removeFiles('old project structure', ['src', 'test', '.eslintrc.js', '.prettierrc', 'README.md'], true)];
            case 3:
                _a.sent();
                return [4 /*yield*/, json.update('package.json')({
                        projectName: context.projectFolder,
                        message: '[json] cleaning package.json',
                        messageSuccess: '[json] clean package.json',
                    }, function (jsonFile) {
                        delete jsonFile.jest;
                        delete jsonFile.scripts.lint;
                        delete jsonFile.scripts['test:e2e'];
                        jsonFile.scripts['start:dev'] = 'NODE_ENV=development nest start --watch';
                        return jsonFile;
                    })];
            case 4:
                _a.sent();
                return [4 /*yield*/, generate({
                        name: moduleName$9,
                        source: 'templates/base',
                        destination: '.',
                        context: context,
                    })];
            case 5:
                _a.sent();
                if (!context.isDatabase) return [3 /*break*/, 9];
                return [4 /*yield*/, addDependencies('install typeorm', ['pg', 'typeorm', '@nestjs/typeorm', 'pg-connection-string'])];
            case 6:
                _a.sent();
                return [4 /*yield*/, addDependencies('install typeorm @types', ['@types/pg-connection-string'], true)];
            case 7:
                _a.sent();
                return [4 /*yield*/, generate({
                        name: moduleName$9,
                        source: 'templates/typeorm',
                        destination: '.',
                        context: context,
                    })];
            case 8:
                _a.sent();
                _a.label = 9;
            case 9: return [2 /*return*/];
        }
    });
}); };

var createNestJsApp = function (context) { return __awaiter(void 0, void 0, void 0, function () {
    var databaseType, isDatabase, deploymentType, isHeroku;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, inquirer.prompt({
                    name: 'databaseType',
                    type: 'list',
                    message: 'Do you want to use database?',
                    choices: [
                        { name: 'No', value: DatabaseType.NONE },
                        { name: 'SQL', value: DatabaseType.SQL },
                    ],
                })];
            case 1:
                databaseType = (_a.sent()).databaseType;
                isDatabase = databaseType === DatabaseType.SQL;
                return [4 /*yield*/, inquirer.prompt({
                        name: 'deploymentType',
                        type: 'list',
                        message: 'Do you want to generate CD configuration?',
                        choices: [
                            { name: 'No', value: DeploymentType.NONE },
                            { name: 'Heroku', value: DeploymentType.HEROKU },
                        ],
                    })];
            case 2:
                deploymentType = (_a.sent()).deploymentType;
                isHeroku = deploymentType === DeploymentType.HEROKU;
                return [4 /*yield*/, initNestJsApp({
                        projectFolder: context.projectFolder,
                        projectName: context.projectName,
                        isHeroku: isHeroku,
                        isDatabase: isDatabase,
                    })];
            case 3:
                _a.sent();
                return [4 /*yield*/, addEditorconfig()];
            case 4:
                _a.sent();
                return [4 /*yield*/, addPrettier({ projectFolder: context.projectFolder })];
            case 5:
                _a.sent();
                return [4 /*yield*/, addEslint({ appType: context.appType, projectFolder: context.projectFolder })];
            case 6:
                _a.sent();
                return [4 /*yield*/, setUpGitHooks({
                        appType: AppType.NODE,
                    })];
            case 7:
                _a.sent();
                if (!isHeroku) return [3 /*break*/, 9];
                return [4 /*yield*/, addHerokuNode({
                        projectName: context.projectName,
                        projectFolder: context.projectFolder,
                        projectType: ProjectType.NEST,
                        isDatabase: isDatabase,
                    })];
            case 8:
                _a.sent();
                _a.label = 9;
            case 9: return [2 /*return*/];
        }
    });
}); };

var moduleName$a = '_NextJs';
var initNextJsApp = function (context) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, makeDir(context.projectFolder)];
            case 1:
                _a.sent();
                return [4 /*yield*/, generate(({
                        name: moduleName$a,
                        source: 'templates',
                        destination: '.',
                        context: context,
                    }))];
            case 2:
                _a.sent();
                return [4 /*yield*/, addDependencies('next, react, styled-components', ['next', 'react', 'react-dom', 'styled-components'])];
            case 3:
                _a.sent();
                return [4 /*yield*/, addDependencies('@types', ['@types/node ', '@types/react', '@types/react-dom', '@types/styled-components', 'babel-plugin-styled-components', 'typescript'], true)];
            case 4:
                _a.sent();
                return [4 /*yield*/, addDependencies('test utilities', ['jest', '@types/jest', '@testing-library/react', 'ts-jest', 'babel-jest', 'jest-styled-components'], true)];
            case 5:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };

var createNextJsApp = function (context) { return __awaiter(void 0, void 0, void 0, function () {
    var isCypress, deploymentType, isHeroku;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, inquirer.prompt({
                    name: 'isCypress',
                    type: 'list',
                    message: 'Do you want to use cypress?',
                    choices: [
                        { name: 'No', value: false },
                        { name: 'Yes', value: true },
                    ],
                })];
            case 1:
                isCypress = (_a.sent()).isCypress;
                return [4 /*yield*/, inquirer.prompt({
                        name: 'deploymentType',
                        type: 'list',
                        message: 'Do you want to generate CD configuration?',
                        choices: [
                            { name: 'No', value: DeploymentType.NONE },
                            { name: 'Heroku', value: DeploymentType.HEROKU },
                        ],
                    })];
            case 2:
                deploymentType = (_a.sent()).deploymentType;
                isHeroku = deploymentType === DeploymentType.HEROKU;
                // Init app
                return [4 /*yield*/, initNextJsApp({
                        projectName: context.projectName,
                        projectFolder: context.projectFolder,
                        isCypress: isCypress,
                        isHeroku: isHeroku,
                    })];
            case 3:
                // Init app
                _a.sent();
                if (!isCypress) return [3 /*break*/, 5];
                return [4 /*yield*/, addCypress({ projectFolder: context.projectFolder, projectName: context.projectName })];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5: 
            // Code quality tools
            return [4 /*yield*/, addEditorconfig()];
            case 6:
                // Code quality tools
                _a.sent();
                return [4 /*yield*/, addBrowserlist()];
            case 7:
                _a.sent();
                return [4 /*yield*/, addPrettier({ projectFolder: context.projectFolder })];
            case 8:
                _a.sent();
                return [4 /*yield*/, addStylelint({
                        appType: context.appType,
                        projectFolder: context.projectFolder,
                    })];
            case 9:
                _a.sent();
                return [4 /*yield*/, addEslint({ appType: context.appType, projectFolder: context.projectFolder })
                    // Git hooks
                ];
            case 10:
                _a.sent();
                // Git hooks
                return [4 /*yield*/, setUpGitHooks({
                        appType: AppType.WEB,
                    })];
            case 11:
                // Git hooks
                _a.sent();
                if (!isHeroku) return [3 /*break*/, 13];
                return [4 /*yield*/, addHerokuWeb({
                        projectName: context.projectName,
                        projectFolder: context.projectFolder,
                        projectType: ProjectType.NEXT,
                    })];
            case 12:
                _a.sent();
                _a.label = 13;
            case 13: 
            // Commit and share on GitHub
            return [4 /*yield*/, addFilesToGit({ projectFolder: context.projectFolder })];
            case 14:
                // Commit and share on GitHub
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };

var moduleName$b = '_ReactNative';
var NavigationType;
(function (NavigationType) {
    NavigationType["NONE"] = "NONE";
    NavigationType["WIX"] = "WIX";
    NavigationType["REACT_NAVIGATION"] = "REACT_NAVIGATION";
})(NavigationType || (NavigationType = {}));
// eslint-disable-next-line
var initReactNativeApp = function (context) { return __awaiter(void 0, void 0, void 0, function () {
    var navigationType, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, inquirer.prompt({
                    name: 'navigationType',
                    type: 'list',
                    message: 'Do you want to use navigation?',
                    choices: [
                        { name: 'None', value: NavigationType.NONE },
                        { name: 'React Native Navigation (WIX)', value: NavigationType.WIX },
                        { name: 'React Navigation', value: NavigationType.REACT_NAVIGATION },
                    ],
                })];
            case 1:
                navigationType = (_b.sent()).navigationType;
                return [4 /*yield*/, shell.execWithSpinner("npx react-native init " + context.projectFolder + " --version 0.61.5", '[react-native-app] initialized')];
            case 2:
                _b.sent();
                return [4 /*yield*/, removeFiles('default project files', [
                        '.eslintrc.js',
                        '.flowconfig',
                        '.prettierrc.js',
                        'App.js',
                        'babel.config.js',
                        'index.js',
                    ])];
            case 3:
                _b.sent();
                return [4 /*yield*/, removeFiles('__tests__', ['__tests__'], true)];
            case 4:
                _b.sent();
                return [4 /*yield*/, json.update('package.json')({
                        projectName: context.projectFolder,
                        message: '[json] cleaning package.json',
                        messageSuccess: '[json] clean package.json',
                    }, function (jsonFile) { return (__assign(__assign({}, jsonFile), { scripts: __assign(__assign({}, jsonFile.scripts), { 'android': undefined, 'ios': undefined, 'lint': undefined, 'start': 'react-native start --reset-cache', 'start:android': 'react-native run-android', 'start:ios': 'react-native run-ios', 'test': 'jest' }) })); })];
            case 5:
                _b.sent();
                return [4 /*yield*/, json.update('package.json')({
                        projectName: context.projectFolder,
                        message: '[json] adding detox configuration',
                        messageSuccess: '[json] detox configuration',
                    }, function (jsonFile) { return (__assign(__assign({}, jsonFile), { scripts: __assign(__assign({}, jsonFile.scripts), { 'detox:build:ios': 'detox build e2e --configuration ios.sim.release', 'detox:test:ios': 'detox test e2e --configuration ios.sim.release --cleanup --debug-synchronization 200', 'detox:build:android': 'detox build -c android.emu.debug', 'detox:test:android': 'detox test -c android.emu.debug' }), 'detox': {
                            'configurations': {
                                'android.emu.debug': {
                                    'binaryPath': 'android/app/build/outputs/apk/debug/app-debug.apk',
                                    'build': 'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug && cd ..',
                                    'type': 'android.emulator',
                                    'name': 'emu',
                                },
                                'ios.sim.release': {
                                    'binaryPath': "ios/build/Build/Products/Release-iphonesimulator/" + context.projectFolder + ".app",
                                    'build': "xcodebuild -workspace ios/" + context.projectFolder + ".xcworkspace -scheme " + context.projectFolder + " -configuration Release -sdk iphonesimulator -derivedDataPath ios/build",
                                    'type': 'ios.simulator',
                                    'name': 'iPhone 8',
                                },
                            },
                            'test-runner': 'jest',
                        } })); })];
            case 6:
                _b.sent();
                return [4 /*yield*/, generate({
                        name: moduleName$b,
                        source: 'templates/detox-android-test-class',
                        destination: "android/app/src/androidTest/java/com/" + context.projectFolder,
                        context: context,
                    })];
            case 7:
                _b.sent();
                return [4 /*yield*/, addDependencies('styled-components', ['styled-components'])];
            case 8:
                _b.sent();
                return [4 /*yield*/, addDependencies('types and test tools', [
                        'typescript',
                        'babel-plugin-inline-import',
                        'metro-react-native-babel-preset',
                        '@types/jest @types/react',
                        '@types/react-native',
                        '@types/react-test-renderer',
                        '@testing-library/react-native',
                        '@types/node @types/styled-components',
                        'babel-plugin-module-resolver',
                    ], true)];
            case 9:
                _b.sent();
                return [4 /*yield*/, removeDependencies('react-test-renderer', ['react-test-renderer', '@types/react-test-renderer'])];
            case 10:
                _b.sent();
                return [4 /*yield*/, addDependencies('react-native-config', ['react-native-config'])];
            case 11:
                _b.sent();
                return [4 /*yield*/, addDependencies('detox', ['detox@15.1.4', '@types/detox'], true)];
            case 12:
                _b.sent();
                return [4 /*yield*/, generate({
                        name: moduleName$b,
                        source: 'templates/base',
                        destination: '.',
                        context: context,
                    })];
            case 13:
                _b.sent();
                _a = navigationType;
                switch (_a) {
                    case NavigationType.REACT_NAVIGATION: return [3 /*break*/, 14];
                    case NavigationType.WIX: return [3 /*break*/, 17];
                }
                return [3 /*break*/, 22];
            case 14: return [4 /*yield*/, addDependencies('react-navigation', ['react-navigation', 'react-native-reanimated', 'react-native-gesture-handler', 'react-native-screens', 'react-native-safe-area-context', 'react-navigation-stack', 'react-navigation-tabs'])];
            case 15:
                _b.sent();
                return [4 /*yield*/, generate({
                        name: moduleName$b,
                        source: 'templates/react-navigation',
                        destination: '.',
                        context: context,
                    })];
            case 16:
                _b.sent();
                return [3 /*break*/, 22];
            case 17: return [4 /*yield*/, addDependencies('react-native-navigation', ['react-native-navigation@4.4.0'])];
            case 18:
                _b.sent();
                return [4 /*yield*/, generate({
                        name: moduleName$b,
                        source: 'templates/react-native-navigation',
                        destination: '.',
                        context: context,
                    })];
            case 19:
                _b.sent();
                return [4 /*yield*/, generate({
                        name: moduleName$b,
                        source: 'templates/react-native-navigation-app-delegate-fix',
                        destination: "ios/" + context.projectFolder,
                        context: context,
                    })];
            case 20:
                _b.sent();
                return [4 /*yield*/, generate({
                        name: moduleName$b,
                        source: 'templates/react-native-navigation-main-activity-fix',
                        destination: "android/app/src/main/java/com/" + context.projectFolder,
                        context: context,
                    })];
            case 21:
                _b.sent();
                return [3 /*break*/, 22];
            case 22: return [4 /*yield*/, shell.execInProjectWithSpinner(context.projectFolder)('react-native link', '[exec] link RN dependencies')];
            case 23:
                _b.sent();
                return [4 /*yield*/, shell.execInProjectWithSpinner(context.projectFolder)('cd ios && pod install', '[exec] run pod install')];
            case 24:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };

var createReactNativeApp = function (context) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            // Init app
            return [4 /*yield*/, initReactNativeApp({
                    projectFolder: context.projectFolder,
                    projectName: context.projectName,
                })
                // Code quality tools
            ];
            case 1:
                // Init app
                _a.sent();
                // Code quality tools
                return [4 /*yield*/, addEditorconfig()];
            case 2:
                // Code quality tools
                _a.sent();
                return [4 /*yield*/, addPrettier({ projectFolder: context.projectFolder })];
            case 3:
                _a.sent();
                return [4 /*yield*/, addStylelint({ appType: context.appType, projectFolder: context.projectFolder })];
            case 4:
                _a.sent();
                return [4 /*yield*/, addEslint({ appType: context.appType, projectFolder: context.projectFolder })
                    // Git hooks
                ];
            case 5:
                _a.sent();
                // Git hooks
                return [4 /*yield*/, setUpGitHooks({
                        appType: AppType.MOBILE,
                    })
                    // Commit and share on Github
                ];
            case 6:
                // Git hooks
                _a.sent();
                // Commit and share on Github
                return [4 /*yield*/, addFilesToGit({ projectFolder: context.projectFolder })];
            case 7:
                // Commit and share on Github
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };

var checkNpx = function () { return __awaiter(void 0, void 0, void 0, function () {
    var code;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                code = shell.exec('npx --version').code;
                if (!(code !== 0)) return [3 /*break*/, 2];
                logger.info("Npx not found. Installing npx on your machine " + chalk.blue('https://github.com/zkat/npx'));
                return [4 /*yield*/, shell.execWithSpinner('npm install -g npx', 'npx installed')];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); };

var checkYarn = function () { return __awaiter(void 0, void 0, void 0, function () {
    var code;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                code = shell.exec('yarn --version').code;
                if (!(code !== 0)) return [3 /*break*/, 2];
                logger.info("Yarn not found. Installing yarn on your machine " + chalk.blue('https://github.com/yarnpkg/yarn'));
                return [4 /*yield*/, shell.execWithSpinner('npm install -g yarn', 'yarn installed')];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); };

var capitalize = function (word) {
    return word.charAt(0).toUpperCase() + word.substring(1);
};
var capitalizeAll = function (name) {
    var _a;
    var words = (_a = name.match(/[A-Za-z][a-z]*/gu), (_a !== null && _a !== void 0 ? _a : []));
    return words.map(capitalize).join(' ');
};
var toAlphaNumeric = function (name) {
    return name.replace(/\W/gu, '');
};

var validateProjectFolder = function (value) {
    // eslint-disable-next-line
    var validateName = require('validate-npm-package-name');
    var errors = validateName(value).errors;
    if (errors) {
        return 'Invalid name.';
    }
    if (fs.existsSync(path.resolve(value.toLowerCase()))) {
        return 'Project with this name already exists.';
    }
    return true;
};
var validator = {
    validateProjectFolder: validateProjectFolder,
};

var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var projectType, rawProjectFolder, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                logger.info(chalk.green(figlet.textSync('Create App')));
                return [4 /*yield*/, inquirer.prompt({
                        name: 'projectType',
                        type: 'list',
                        message: 'What type of application would you like to create?',
                        choices: [
                            { name: 'Create React App', value: ProjectType.CRA },
                            { name: 'Next.js', value: ProjectType.NEXT },
                            { name: 'React Native', value: ProjectType.RN },
                            { name: 'Nest.js', value: ProjectType.NEST },
                        ],
                    })];
            case 1:
                projectType = (_b.sent()).projectType;
                state.projectType = projectType;
                return [4 /*yield*/, inquirer.prompt({
                        name: 'projectFolder',
                        message: 'How do you want to call your project?',
                        validate: validator.validateProjectFolder,
                    })];
            case 2:
                rawProjectFolder = (_b.sent()).projectFolder;
                state.projectName = capitalizeAll(rawProjectFolder);
                state.projectFolder = rawProjectFolder.toLowerCase();
                if (projectType === ProjectType.RN) {
                    state.projectFolder = toAlphaNumeric(state.projectFolder);
                }
                return [4 /*yield*/, checkYarn()];
            case 3:
                _b.sent();
                return [4 /*yield*/, checkNpx()];
            case 4:
                _b.sent();
                _a = projectType;
                switch (_a) {
                    case ProjectType.CRA: return [3 /*break*/, 5];
                    case ProjectType.NEXT: return [3 /*break*/, 7];
                    case ProjectType.RN: return [3 /*break*/, 9];
                    case ProjectType.NEST: return [3 /*break*/, 11];
                }
                return [3 /*break*/, 13];
            case 5:
                state.appType = AppType.WEB;
                return [4 /*yield*/, createReactApp(state)];
            case 6:
                _b.sent();
                return [3 /*break*/, 13];
            case 7:
                state.appType = AppType.WEB;
                return [4 /*yield*/, createNextJsApp(state)];
            case 8:
                _b.sent();
                return [3 /*break*/, 13];
            case 9:
                state.appType = AppType.MOBILE;
                return [4 /*yield*/, createReactNativeApp(state)];
            case 10:
                _b.sent();
                return [3 /*break*/, 13];
            case 11:
                state.appType = AppType.NODE;
                return [4 /*yield*/, createNestJsApp(state)];
            case 12:
                _b.sent();
                return [3 /*break*/, 13];
            case 13:
                logger.info(chalk.green(figlet.textSync('Success', { horizontalLayout: 'full' })));
                logger.info(chalk.bold("Your new application lives in " + chalk.underline.green("./" + state.projectFolder)));
                return [2 /*return*/];
        }
    });
}); };
main().catch(function (error) { return logger.warning("[main] Failed to run generator: " + error); });
