declare const $;

export const screensIds = {
  signUp: 'sign-up',
  resetPassword: 'reset-password',
  login: 'login',
  resendInstructions: 'resend-instructions',
  forgetPassword: 'forgot-password',
  activateAccount: 'activate-account',
};

const onChangeScreen = (screenName: string) => {
  $('.path').addClass('not-visible');
  $('.path.' + screenName).removeClass('not-visible').addClass('visible');
};

export const onActivateSignUp = () => onChangeScreen(screensIds.signUp);
export const onActivateLogin = () => onChangeScreen(screensIds.login);
export const onActivateForgotPassword = () => onChangeScreen(screensIds.forgetPassword);
export const onActivateResendInstructions = () => onChangeScreen(screensIds.resendInstructions);
export const onActivateActivateAccount = () => onChangeScreen(screensIds.activateAccount);
export const onActivateResetPasssword = () => onChangeScreen(screensIds.resetPassword);

let timeoutId;
export const showModal = (message?: string, isError?: boolean) => {
  if (isError) {
    $('.NoticesModal--success').addClass('NoticesModal--danger');
  } else {
    $('.NoticesModal--success').removeClass('NoticesModal--danger');
  }
  if (message) {
    $('#modal-text').text(message);
  }
  $('#message_modal').addClass('show');

  timeoutId = setTimeout(() => {
    hideModal();
  }, 5000);
};

export const hideModal = () => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  $('#message_modal').removeClass('show');
  $('.NoticesModal--success').removeClass('NoticesModal--danger');
};

export const prepareUiElements = (url: string): void => {
  $('[data-toggle="tooltip"]').tooltip();
  $('.prepare-link-host').map((i, el) => {
    const $el = $(el);
    $el.attr('href', url + $el.attr('href'));
  });
};
