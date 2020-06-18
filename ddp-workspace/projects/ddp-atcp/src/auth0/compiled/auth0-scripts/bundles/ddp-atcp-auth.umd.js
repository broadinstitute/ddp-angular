(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define('ddp-atcp-auth', ['exports'], factory) :
    (global = global || self, factory(global['ddp-atcp-auth'] = {}));
}(this, (function (exports) { 'use strict';

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
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

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

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    }

    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    }

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

    function __exportStar(m, exports) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }

    function __values(o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m) return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }

    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    }

    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }

    function __asyncValues(o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    }

    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    function __importStar(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
        result.default = mod;
        return result;
    }

    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /** @type {?} */
    var screensIds = {
        signUp: 'sign-up',
        resetPassword: 'reset-password',
        login: 'login',
        resendInstructions: 'resend-instructions',
        forgetPassword: 'forgot-password',
        activateAccount: 'activate-account',
    };
    /** @type {?} */
    var onChangeScreen = (/**
     * @param {?} screenName
     * @return {?}
     */
    function (screenName) {
        $('.path').addClass('not-visible');
        $('.path.' + screenName).removeClass('not-visible').addClass('visible');
    });
    var ɵ0 = onChangeScreen;
    /** @type {?} */
    var onActivateSignUp = (/**
     * @return {?}
     */
    function () { return onChangeScreen(screensIds.signUp); });
    /** @type {?} */
    var onActivateLogin = (/**
     * @return {?}
     */
    function () { return onChangeScreen(screensIds.login); });
    /** @type {?} */
    var onActivateForgotPassword = (/**
     * @return {?}
     */
    function () { return onChangeScreen(screensIds.forgetPassword); });
    /** @type {?} */
    var onActivateResendInstructions = (/**
     * @return {?}
     */
    function () { return onChangeScreen(screensIds.resendInstructions); });
    /** @type {?} */
    var onActivateActivateAccount = (/**
     * @return {?}
     */
    function () { return onChangeScreen(screensIds.activateAccount); });
    /** @type {?} */
    var onActivateResetPasssword = (/**
     * @return {?}
     */
    function () { return onChangeScreen(screensIds.resetPassword); });
    /** @type {?} */
    var timeoutId;
    /** @type {?} */
    var showModal = (/**
     * @param {?=} message
     * @param {?=} isError
     * @return {?}
     */
    function (message, isError) {
        if (isError) {
            $('.NoticesModal--success').addClass('NoticesModal--danger');
        }
        else {
            $('.NoticesModal--success').removeClass('NoticesModal--danger');
        }
        if (message) {
            $('#modal-text').text(message);
        }
        $('#message_modal').addClass('show');
        timeoutId = setTimeout((/**
         * @return {?}
         */
        function () {
            hideModal();
        }), 5000);
    });
    /** @type {?} */
    var hideModal = (/**
     * @return {?}
     */
    function () {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        $('#message_modal').removeClass('show');
        $('.NoticesModal--success').removeClass('NoticesModal--danger');
    });
    /** @type {?} */
    var prepareUiElements = (/**
     * @param {?} url
     * @return {?}
     */
    function (url) {
        $('[data-toggle="tooltip"]').tooltip();
        $('.prepare-link-host').map((/**
         * @param {?} i
         * @param {?} el
         * @return {?}
         */
        function (i, el) {
            /** @type {?} */
            var $el = $(el);
            $el.attr('href', url + $el.attr('href'));
        }));
    });
    /** @type {?} */
    var showTooltip = (/**
     * @param {?} x
     * @return {?}
     */
    function (x) { return x.parentElement.getElementsByClassName("tooltip")[0].classList.add("in"); });
    /** @type {?} */
    var hideTooltip = (/**
     * @param {?} x
     * @return {?}
     */
    function (x) { return x.parentElement.getElementsByClassName("tooltip")[0].classList.remove("in"); });

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /** @type {?} */
    var createAuth0 = (/**
     * @param {?} config
     * @return {?}
     */
    function (config) {
        if (Array.isArray(config)) {
            return new auth0.WebAuth({
                domain: config[0],
                clientID: config[1],
                responseType: 'token id_token',
            });
        }
        return new auth0.WebAuth({
            domain: config.auth0Domain,
            clientID: config.clientID,
            redirectUri: config.callbackURL,
            responseType: config.responseType,
            params: config.internalOptions,
            configurationBaseUrl: config.clientConfigurationBaseUrl,
        });
    });

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /** @type {?} */
    var regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*?&])[A-Za-z\d!@#$%^&**?&]{8,}$/;
    /** @type {?} */
    var regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    /**
     * @record
     */
    function Config() { }
    if (false) {
        /** @type {?} */
        Config.prototype.id;
        /** @type {?} */
        Config.prototype.validators;
        /** @type {?|undefined} */
        Config.prototype.customValidators;
    }
    /** @type {?} */
    var commonChecks = [
        {
            name: 'email',
            rules: 'required|!callback_check_email',
        }, {
            name: 'password',
            rules: 'required|min_length[8]|!callback_check_password'
        }
    ];
    var ɵ0$1 = /**
     * @param {?} value
     * @return {?}
     */
    function (value) { return regexEmail.test(value); };
    /** @type {?} */
    var checkEmail = {
        name: 'check_email',
        validator: (ɵ0$1)
    };
    var ɵ1 = screensIds.signUp, ɵ2 = /**
     * @param {?} value
     * @return {?}
     */
    function (value) { return regexPassword.test(value); };
    /** @type {?} */
    var signUp = {
        id: ɵ1,
        validators: __spread(commonChecks, [{
                name: 'password_confirm',
                rules: 'required|matches[password]'
            }]),
        customValidators: [{
                name: 'check_password',
                validator: (ɵ2),
            }, checkEmail],
    };
    var ɵ3 = screensIds.login;
    /** @type {?} */
    var login = {
        id: ɵ3,
        validators: [commonChecks[0], {
                name: 'password',
                rules: 'required|min_length[8]'
            }],
    };
    var ɵ4 = screensIds.resetPassword, ɵ5 = /**
     * @param {?} value
     * @return {?}
     */
    function (value) { return regexPassword.test(value); };
    /** @type {?} */
    var resetPassword = {
        id: ɵ4,
        validators: [
            {
                name: 'newPassword',
                rules: 'required|min_length[8]|!callback_check_password'
            }, {
                name: 'confirmNewPassword',
                rules: 'required|matches[newPassword]'
            }
        ],
        customValidators: [{
                name: 'check_password',
                validator: (ɵ5),
            }, checkEmail],
    };
    var ɵ6 = screensIds.forgetPassword;
    /** @type {?} */
    var forgetPassword = {
        id: ɵ6,
        validators: [commonChecks[0]],
    };
    var ɵ7 = screensIds.resendInstructions;
    /** @type {?} */
    var resendInstructions = {
        id: ɵ7,
        validators: [commonChecks[0]],
        customValidators: [checkEmail],
    };
    /** @type {?} */
    var createForm = (/**
     * @param {?} params
     * @param {?} success
     * @return {?}
     */
    function (params, success) {
        var id = params.id, validators = params.validators, customValidators = params.customValidators;
        /** @type {?} */
        var validator = new FormValidator(id, validators, (/**
         * @param {?} errors
         * @param {?} event
         * @return {?}
         */
        function (errors, event) {
            event.preventDefault();
            $('#' + id + ' .form-group').removeClass('error');
            if (errors.length > 0) {
                errors.forEach((/**
                 * @param {?} item
                 * @return {?}
                 */
                function (item) {
                    $('#' + id + ' #' + item.name).closest('.form-group').addClass('error');
                }));
            }
            else {
                /** @type {?} */
                var $form = $('#' + id);
                success($form, $form.serializeArray().reduce((/**
                 * @param {?} prev
                 * @param {?} current
                 * @return {?}
                 */
                function (prev, current) {
                    prev[current.name] = current.value;
                    return prev;
                }), {}));
            }
        }));
        if (customValidators) {
            customValidators.forEach((/**
             * @param {?} customValidator
             * @return {?}
             */
            function (customValidator) {
                validator.registerCallback(customValidator.name, customValidator.validator);
            }));
        }
    });
    /** @type {?} */
    var configs = {
        signUp: signUp,
        login: login,
        resetPassword: resetPassword,
        resendInstructions: resendInstructions,
        forgetPassword: forgetPassword,
    };

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /** @type {?} */
    var onTranslate = (/**
     * @param {?} dictionary
     * @return {?}
     */
    function (dictionary) {
        $('[data-translate]').each((/**
         * @param {?} i
         * @param {?} el
         * @return {?}
         */
        function (i, el) {
            /** @type {?} */
            var $el = $(el);
            /** @type {?} */
            var key = $el.data('translate');
            /** @type {?} */
            var text = '';
            if (key.indexOf('.') !== -1) {
                /** @type {?} */
                var pathKeys = key.split('.');
                try {
                    text = pathKeys.reduce((/**
                     * @param {?} prev
                     * @param {?} curr
                     * @return {?}
                     */
                    function (prev, curr) { return prev[curr]; }), dictionary);
                }
                catch (e) {
                    console.log(e);
                }
            }
            else {
                text = dictionary[key];
            }
            $el.text(text);
        }));
    });
    var ɵ0$2 = onTranslate;
    /** @type {?} */
    var onChange = (/**
     * @param {?} baseUrl
     * @param {?} language
     * @param {?} cb
     * @return {?}
     */
    function (baseUrl, language, cb) {
        $.getJSON(baseUrl + '/auth-' + language + '.json', (/**
         * @param {?} data
         * @return {?}
         */
        function (data) {
            onTranslate(data);
            cb(data);
        }));
    });
    var ɵ1$1 = onChange;
    /** @type {?} */
    var loadLanguagesList = (/**
     * @param {?} baseUrl
     * @return {?}
     */
    function (baseUrl) {
        $.getJSON(baseUrl + '/languages.json', (/**
         * @param {?} languages
         * @return {?}
         */
        function (languages) {
            /** @type {?} */
            var $container = $('.languages');
            /** @type {?} */
            var items = '';
            languages.forEach((/**
             * @param {?} item
             * @return {?}
             */
            function (item) {
                items += '<li><a class="green-hover change-language" href="#" data-language="' + item.code.split('-')[0] + '">' + item.name + '</a></li>';
            }));
            $container.empty();
            $container.append(items);
        }));
    });
    var ɵ2$1 = loadLanguagesList;
    /** @type {?} */
    var translatorCreator = (/**
     * @param {?} url
     * @param {?} cb
     * @return {?}
     */
    function (url, cb) {
        loadLanguagesList(url);
        return {
            changeTranslate: (/**
             * @param {?} language
             * @return {?}
             */
            function (language) { return onChange(url, language, cb); }),
        };
    });

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /** @type {?} */
    var isResetPasswordPage = Array.isArray(config);
    /** @type {?} */
    var webAuth = createAuth0(config);
    /** @type {?} */
    var baseUrl;
    /** @type {?} */
    var authLoc = Math.max(config.callbackURL.indexOf('/auth'), config.callbackURL.indexOf('/login-landing'));
    if (authLoc === -1) {
        baseUrl = config.callbackURL;
    }
    else {
        baseUrl = config.callbackURL.substring(0, authLoc);
    }
    /** @type {?} */
    var dictionary;
    /** @type {?} */
    var languageDataDir = '/assets/i18n';
    var ɵ0$3 = /**
     * @param {?} loadedDictionary
     * @return {?}
     */
    function (loadedDictionary) {
        dictionary = loadedDictionary;
    };
    /** @type {?} */
    var translator = translatorCreator(!isResetPasswordPage ? baseUrl + languageDataDir : config[3], (ɵ0$3));
    if (!isResetPasswordPage) {
        prepareUiElements(baseUrl);
    }
    else {
        prepareUiElements(config[3]);
    }
    /**
     * start validate-js for checking forms
     */
    if (!isResetPasswordPage) {
        createForm(configs.signUp, (/**
         * @param {?} $form
         * @param {?} data
         * @return {?}
         */
        function ($form, data) {
            webAuth.signup({
                connection: 'Username-Password-Authentication',
                email: data.email,
                password: data.password,
                user_metadata: {
                    temp_user_guid: config.extraParams.temp_user_guid,
                }
            }, (/**
             * @return {?}
             */
            function () {
                $('#enteredEmail').text($form.find('#email').val());
                onActivateActivateAccount();
            }));
        }));
    }
    else {
        createForm(configs.resetPassword, (/**
         * @param {?} $form
         * @return {?}
         */
        function ($form) {
            $.ajax({
                type: $form.attr('method'),
                url: $form.attr('action'),
                data: $form.serialize(),
                success: (/**
                 * @return {?}
                 */
                function () { return showModal(dictionary.modal.SuccessChangedPassword); }),
            });
        }));
    }
    createForm(configs.login, (/**
     * @param {?} $form
     * @param {?} data
     * @return {?}
     */
    function ($form, data) {
        webAuth.login({
            state: !isResetPasswordPage && config.extraParams.state,
            realm: 'Username-Password-Authentication',
            email: data.email,
            password: data.password,
        }, (/**
         * @return {?}
         */
        function () { return showModal(dictionary.modal.InvalidLogin, true); }));
    }));
    createForm(configs.resendInstructions, (/**
     * @return {?}
     */
    function () { }));
    createForm(configs.forgetPassword, (/**
     * @param {?} $form
     * @param {?} data
     * @return {?}
     */
    function ($form, data) {
        webAuth.changePassword({
            connection: 'Username-Password-Authentication',
            email: data.email
        }, (/**
         * @param {?} err
         * @return {?}
         */
        function (err) {
            if (err) {
                $form.find('.form-group').addClass('error');
            }
            else {
                showModal(dictionary.modal.YouWillGetInstructions);
            }
        }));
    }));
    /**
     * the end validate-js for checking forms
     */
    /**
     * Ui events...
     */
    $('.onActivateForgotPassword').on('click', (/**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        event.preventDefault();
        onActivateForgotPassword();
    }));
    $('.onActivateResendInstructions').on('click', (/**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        event.preventDefault();
        onActivateResendInstructions();
    }));
    $('.onActivateSignIn').on('click', (/**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        event.preventDefault();
        onActivateLogin();
    }));
    $('.hideModal').on('click', (/**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        event.preventDefault();
        hideModal();
    }));
    $(document).on('click', '.change-language', (/**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        event.preventDefault();
        translator.changeTranslate($(event.currentTarget).data('language'));
    }));
    translator.changeTranslate('en');
    $('#google-sign').on('click', (/**
     * @param {?} e
     * @return {?}
     */
    function (e) {
        e.preventDefault();
        webAuth.popup.authorize({
            redirectUri: config.callbackURL,
            connection: 'google',
        }, (/**
         * @return {?}
         */
        function () { }));
    }));
    if (!isResetPasswordPage) {
        // open login or signUp form
        config.extraParams.mode === 'login' ? onActivateLogin() : onActivateSignUp();
    }
    else {
        // open password reset form
        onActivateResetPasssword();
    }
    /** @type {?} */
    var helpLinks = document.getElementsByClassName("FormItem-help");
    Array.from(helpLinks).forEach((/**
     * @param {?} x
     * @return {?}
     */
    function (x) { return x.addEventListener("mouseenter", (/**
     * @return {?}
     */
    function () { return showTooltip(x); })); }));
    Array.from(helpLinks).forEach((/**
     * @param {?} x
     * @return {?}
     */
    function (x) { return x.addEventListener("mouseleave", (/**
     * @return {?}
     */
    function () { return hideTooltip(x); })); }));
    /** @type {?} */
    var api = null;

    exports.api = api;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
