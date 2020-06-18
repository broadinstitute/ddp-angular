import {screensIds} from './ui-actions';

declare const FormValidator;
declare const $;

const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*?&])[A-Za-z\d!@#$%^&**?&]{8,}$/;
const regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

interface Config {
  id: string;
  validators: Array<{
    name: string;
    rules: string;
  }>;
  customValidators?: Array<{
    name: string;
    validator: (value: string) => boolean;
  }>;
}

const commonChecks = [
  {
    name: 'email',
    rules: 'required|!callback_check_email',
  }, {
    name: 'password',
    rules: 'required|min_length[8]|!callback_check_password'
  }
];

const checkEmail = {
  name: 'check_email',
  validator: (value) => regexEmail.test(value)
};

const signUp: Config = {
  id: screensIds.signUp,
  validators: [...commonChecks, {
    name: 'password_confirm',
    rules: 'required|matches[password]'
  }],
  customValidators: [{
    name: 'check_password',
    validator: (value) => regexPassword.test(value),
  }, checkEmail],
};

const login: Config = {
  id: screensIds.login,
  validators: [commonChecks[0], {
    name: 'password',
    rules: 'required|min_length[8]'
  }],
};

const resetPassword: Config = {
  id: screensIds.resetPassword,
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
    validator: (value) => regexPassword.test(value),
  }, checkEmail],
};

const forgetPassword: Config = {
  id: screensIds.forgetPassword,
  validators: [commonChecks[0]],
};

const resendInstructions: Config = {
  id: screensIds.resendInstructions,
  validators: [commonChecks[0]],
  customValidators: [checkEmail],
};

export const createForm = (params: Config, success: ($form, data) => void) => {
  const { id, validators, customValidators } = params;
  const validator = new FormValidator(id, validators, (errors, event) => {
    event.preventDefault();
    $('#' + id + ' .form-group').removeClass('error');
    if (errors.length > 0) {
      errors.forEach(item => {
        $('#' + id + ' #' + item.name).closest('.form-group').addClass('error');
      });
    } else {
      const $form  = $('#' + id);
      success($form, $form.serializeArray().reduce((prev, current) => {
        prev[current.name] = current.value;
        return prev;
      }, {}));
    }
  });
  if (customValidators) {
    customValidators.forEach((customValidator) => {
      validator.registerCallback(customValidator.name, customValidator.validator);
    });
  }
};

export const configs = {
  signUp,
  login,
  resetPassword,
  resendInstructions,
  forgetPassword,
};
