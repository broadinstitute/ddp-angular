export type MailAddressFormErrorFormatter = (
  formControlName: string,
  fieldLabel: string,
  error: 'required' | 'pattern',
) => string;
