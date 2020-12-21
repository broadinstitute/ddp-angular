import {
  onActivateLogin,
  onActivateSignUp,
  onActivateForgotPassword,
  onActivateResendInstructions,
  onActivateActivateAccount,
  showModal,
  hideModal,
  onActivateResetPasssword,
  prepareUiElements,
  showTooltip,
  hideTooltip,
} from './ui-actions';
import { createAuth0 } from './auth';
import { configs, createForm } from './forms';
import { translatorCreator } from './translator';

declare const config;
declare const $;

const isResetPasswordPage = Array.isArray(config);
const webAuth = createAuth0(config);
let baseUrl;

const callbackURL = isResetPasswordPage ? config[3] : config.callbackURL;
const authLoc = Math.max(
  callbackURL.indexOf('/auth'),
  callbackURL.indexOf('/login-landing')
);

if (authLoc === -1) {
  baseUrl = callbackURL;
} else {
  baseUrl = callbackURL.substring(0, authLoc);
}
let dictionary;
const languageDataDir = '/assets/i18n';
const translator = translatorCreator(
  baseUrl + languageDataDir,
  (loadedDictionary: any) => {
    dictionary = loadedDictionary;
  }
);

prepareUiElements(baseUrl);

$('[data-toggle="tooltip"]').tooltip({
  title: function () {
    const el = $(this);
    const translateKey = el.data('translate-tooltip');

    return translateKey
      .split('.')
      .reduce((prev, curr) => prev[curr], dictionary);
  },
});

/**
 * start validate-js for checking forms
 */

if (!isResetPasswordPage) {
  createForm(configs.signUp, ($form, data) => {
    let firstName = '', lastName = '';

    if (config.extraParams.first_name) {
      firstName = config.extraParams.first_name;
    }

    if (config.extraParams.last_name) {
      lastName = config.extraParams.last_name;
    }

    webAuth.signup(
      {
        connection: 'Username-Password-Authentication',
        email: data.email,
        password: data.password,
        user_metadata: {
          temp_user_guid: config.extraParams.temp_user_guid,
          first_name: firstName,
          last_name: lastName,
        },
      },
      () => {
        $('#enteredEmail').text($form.find('#email').val());
        onActivateActivateAccount();
      }
    );
  });
} else {
  createForm(configs.resetPassword, $form => {
    $.ajax({
      type: $form.attr('method'),
      url: $form.attr('action'),
      data: $form.serialize(),
      success: result => {
        showModal(dictionary.modal.SuccessChangedPassword);
        if (result.result_url) {
          window.location.assign(result.result_url.split('?')[0]);
        }
      },
      error: error => {
        showModal(dictionary.modal.SuccessChangedPassword, true);
      },
    });
  });
}

createForm(configs.login, ($form, data) => {
  webAuth.login(
    {
      state: !isResetPasswordPage && config.extraParams.state,
      realm: 'Username-Password-Authentication',
      email: data.email,
      password: data.password,
    },
    () => showModal(dictionary.modal.InvalidLogin, true)
  );
});

createForm(configs.resendInstructions, () => {});
createForm(configs.forgetPassword, ($form, data) => {
  webAuth.changePassword(
    {
      connection: 'Username-Password-Authentication',
      email: data.email,
    },
    err => {
      if (err) {
        $form.find('.form-group').addClass('error');
      } else {
        showModal(dictionary.modal.YouWillGetInstructions);
        onActivateLogin();
      }
    }
  );
});

/**
 * the end validate-js for checking forms
 */

/**
 * Ui events...
 */
$('.onActivateForgotPassword').on('click', event => {
  event.preventDefault();
  onActivateForgotPassword();
});

$('.onActivateResendInstructions').on('click', event => {
  event.preventDefault();
  onActivateResendInstructions();
});

$('.onActivateSignIn').on('click', event => {
  event.preventDefault();
  onActivateLogin();
});

$('.hideModal').on('click', event => {
  event.preventDefault();
  hideModal();
});

$(document).on('click', '.change-language', event => {
  event.preventDefault();
  translator.changeTranslate($(event.currentTarget).data('language'));
});

$(document).ready(() => {
  const lang = window.localStorage.getItem('lang');

  if (lang) {
    return translator.changeTranslate(lang);
  }

  if (config && config.extraParams && config.extraParams.language) {
    const lang = config.extraParams.language;

    return translator.changeTranslate(lang);
  }

  translator.changeTranslate('en');
});

$('#google-sign').on('click', e => {
  e.preventDefault();
  webAuth.authorize(
    {
      state: config.extraParams.state,
      redirectUri: callbackURL,
      connection: 'google-oauth2',
    },
    () => {}
  );
});

$('#google').on('click', e => {
  e.preventDefault();
  webAuth.authorize(
    {
      state: config.extraParams.state,
      redirectUri: callbackURL,
      connection: 'google-oauth2',
    },
    () => {}
  );
});

if (!isResetPasswordPage) {
  // open login or signUp form
  config.extraParams.mode === 'login' ? onActivateLogin() : onActivateSignUp();
} else {
  // open password reset form
  onActivateResetPasssword();
}

const helpLinks = document.getElementsByClassName('FormItem-help');
Array.from(helpLinks).forEach(x =>
  x.addEventListener('mouseenter', () => showTooltip(x))
);
Array.from(helpLinks).forEach(x =>
  x.addEventListener('mouseleave', () => hideTooltip(x))
);

export const api = null;
