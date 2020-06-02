import {
  onActivateLogin,
  onActivateSignUp,
  onActivateForgotPassword,
  onActivateResendInstructions,
  onActivateActivateAccount,
  showModal,
  hideModal,
  onActivateResetPasssword,
  prepareUiElements
} from './ui-actions';
import { createAuth0 } from './auth';
import { configs, createForm } from './forms';

declare const config;
declare const $;

const isResetPasswordPage = Array.isArray(config);
const webAuth = createAuth0(config);

if (!isResetPasswordPage) {
  let mainUrl = '';
  const authLoc = Math.max(config.callbackURL.indexOf('/auth'), config.callbackURL.indexOf('/login-landing'));
  if (authLoc === -1) {
    mainUrl = config.callbackURL;
  } else {
    mainUrl = config.callbackURL.substring(0, authLoc);
  }
  prepareUiElements(mainUrl);
} else {
  prepareUiElements(config[3]);
}

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
      success: () => showModal('Your password has been changed successfully.'),
    });
  });
}
createForm(configs.login, ($form, data) => {
  webAuth.login({
    state: !isResetPasswordPage && config.extraParams.state,
    realm: 'Username-Password-Authentication',
    email: data.email,
    password: data.password,
  }, () => showModal('Invalid email or password', true));
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
      showModal('You will receive an email with instructions on how to reset your password in a few minutes.');
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

$('#google-sign').on('click', e => {
  e.preventDefault();
  webAuth.popup.authorize({
    redirectUri: config.callbackURL,
    connection: 'google',
  }, () => {});
});

if (!isResetPasswordPage) {
  // open login or signUp form
  config.extraParams.mode === 'login' ? onActivateLogin() : onActivateSignUp();
} else {
  // open password reset form
  onActivateResetPasssword();
}

export const api = null;
