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
  hideTooltip
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
const authLoc = Math.max(callbackURL.indexOf('/auth'), callbackURL.indexOf('/login-landing'));

if (authLoc === -1) {
  baseUrl = callbackURL;
} else {
  baseUrl = callbackURL.substring(0, authLoc);
}
let dictionary;
const languageDataDir = '/assets/i18n';
const translator = translatorCreator(baseUrl + languageDataDir, (loadedDictionary: any) => {
  dictionary = loadedDictionary;
});

prepareUiElements(baseUrl);

/**
 * start validate-js for checking forms
 */

if (!isResetPasswordPage) {
  createForm(configs.signUp, ($form, data) => {
    webAuth.signup({
      connection: 'Username-Password-Authentication',
      email: data.email,
      password: data.password,
      user_metadata: {
        temp_user_guid: config.extraParams.temp_user_guid,
      }
    }, () => {
      $('#enteredEmail').text($form.find('#email').val());
      onActivateActivateAccount();
    });
  });
} else {
  createForm(configs.resetPassword, $form => {
    $.ajax({
      type: $form.attr('method'),
      url: $form.attr('action'),
      data: $form.serialize(),
      success: () => showModal(dictionary.modal.SuccessChangedPassword),
    });
  });
}
createForm(configs.login, ($form, data) => {
  webAuth.login({
    state: !isResetPasswordPage && config.extraParams.state,
    realm: 'Username-Password-Authentication',
    email: data.email,
    password: data.password,
  }, () => showModal(dictionary.modal.InvalidLogin, true));
});

createForm(configs.resendInstructions, () => {});
createForm(configs.forgetPassword, ($form, data) => {
  webAuth.changePassword({
    connection: 'Username-Password-Authentication',
    email: data.email
  }, (err) => {
    if (err) {
      $form.find('.form-group').addClass('error');
    } else {
      showModal(dictionary.modal.YouWillGetInstructions);
      onActivateLogin();
    }
  });
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

translator.changeTranslate('en');

$('#google-sign').on('click', e => {
  e.preventDefault();
  webAuth.popup.authorize({
    redirectUri: callbackURL,
    connection: 'google-oauth2',
  }, () => {});
});

if (!isResetPasswordPage) {
  // open login or signUp form
  config.extraParams.mode === 'login' ? onActivateLogin() : onActivateSignUp();
} else {
  // open password reset form
  onActivateResetPasssword();
}

const helpLinks = document.getElementsByClassName("FormItem-help");
Array.from(helpLinks).forEach(x => x.addEventListener("mouseenter", () => showTooltip(x)));
Array.from(helpLinks).forEach(x => x.addEventListener("mouseleave", () => hideTooltip(x)));

export const api = null;
