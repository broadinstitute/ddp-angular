import { FuncType } from './auth';

declare const $;

export const screensIds = {
  signUp: 'sign-up',
  resetPassword: 'reset-password',
  login: 'login',
  resendInstructions: 'resend-instructions',
  forgetPassword: 'forgot-password',
  activateAccount: 'activate-account',
};

const onChangeScreen: FuncType<void> = (screenName: string) => {
  $('.path').addClass('not-visible');
  $('.path.' + screenName).removeClass('not-visible').addClass('visible');
};

export const onActivateSignUp: FuncType<void> = () => onChangeScreen(screensIds.signUp);
export const onActivateLogin: FuncType<void> = () => onChangeScreen(screensIds.login);
export const onActivateForgotPassword: FuncType<void> = () => onChangeScreen(screensIds.forgetPassword);
export const onActivateResendInstructions: FuncType<void> = () => onChangeScreen(screensIds.resendInstructions);
export const onActivateActivateAccount: FuncType<void> = () => onChangeScreen(screensIds.activateAccount);
export const onActivateResetPasssword: FuncType<void> = () => onChangeScreen(screensIds.resetPassword);

let timeoutId;
export const showModal: FuncType<void> = (message?: string, isError?: boolean) => {
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

export const hideModal: FuncType<any> = () => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  $('#message_modal').removeClass('show');
  $('.NoticesModal--success').removeClass('NoticesModal--danger');
};

export const prepareUiElements: FuncType<void> = (url: string): void => {
  $('.prepare-link-host').map((i, el) => {
    const $el = $(el);
    $el.attr('href', url + $el.attr('href'));
  });
};

export const showTooltip: FuncType<void> = (x) => x.parentElement.getElementsByClassName('tooltip')[0].classList.add('in');
export const hideTooltip: FuncType<void> = (x) => x.parentElement.getElementsByClassName('tooltip')[0].classList.remove('in');
