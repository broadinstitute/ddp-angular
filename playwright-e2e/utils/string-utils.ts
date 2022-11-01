export const makeRandomTelephone = (): string => {
  return Math.random().toString().slice(2, 11);
};

export const makeRandomNum = (min = 1, max = 99): number => {
  const num = Math.random() * (max - min) + min;
  return Math.floor(num);
};

export const makeEmailAlias = (originalEmail: string): string => {
  if (originalEmail == null || originalEmail.length === 0 || !originalEmail.includes('@')) {
    // Evaluate to true if value is: null or undefined or does not contains @
    throw Error(`Invalid Parameter: Email "${originalEmail}"`);
  }
  const splintedEmail = originalEmail.split('@');
  const name = splintedEmail[0];
  const domain = splintedEmail[1];
  return `${name}+${Math.floor(Math.random() * 1000000000)}@${domain}`;
};

/**
 * Returns the default value if value is null, empty or undefined.
 * @param value
 * @param defaultValue
 */
export const getEnv = (value: string | undefined, defaultValue: string): string => {
  if (value == null && defaultValue == null) {
    throw Error('Invalid Parameters: Value and defaultValue are both undefined or null.');
  }
  return value == null ? defaultValue : value;
};
