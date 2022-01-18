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
import { Translator } from './translator';

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

// Translator
const languageDataDir = '/assets/i18n';
const translator = Translator.create(`${baseUrl}${languageDataDir}`);

prepareUiElements(baseUrl);

$('[data-toggle="tooltip"]').tooltip({
  title: function() {
    const el = $(this);
    const translateKey = el.data('translate-tooltip');

    return translateKey
      .split('.')
      .reduce((prev, curr) => prev[curr], translator.currentDictionary);
  },
});

/**
 * start validate-js for checking forms
 */

if (!isResetPasswordPage) {
  createForm(configs.signUp, ($form, data) => {
    const emailInput = $form.find('#email');
    const formGroup = emailInput.parent();

    formGroup.removeClass('email-taken');

    let firstName = '',
      lastName = '';

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
      err => {
        if (err) {
          formGroup.addClass('email-taken');
        } else {
          $('#enteredEmail').text(emailInput.val());
          onActivateActivateAccount();
        }
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
        showModal(translator.currentDictionary.modal.SuccessChangedPassword);
        if (result.result_url) {
          window.location.assign(result.result_url.split('?')[0]);
        }
      },
      error: () => {
        showModal(
          translator.currentDictionary.modal.SuccessChangedPassword,
          true
        );
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
    () => showModal(translator.currentDictionary.modal.InvalidLogin, true)
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
        showModal(translator.currentDictionary.modal.YouWillGetInstructions);
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
  translator.changeLanguage($(event.currentTarget).data('language'));
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
