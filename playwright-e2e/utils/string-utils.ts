export const makeRandomTelephone = (): string => {
  return Math.random().toString().slice(2, 11);
};

export const makeRandomNum = (min = 1, max = 99): number => {
  const num = Math.random() * (max - min) + min;
  return Math.floor(num);
};

export const makeEmailAlias = (originalEmail: string): string => {
  const splintedEmail = originalEmail.split('@');
  const name = splintedEmail[0];
  const domain = splintedEmail[1];
  return `${name}+${Math.floor(Math.random() * 1000000000)}@${domain}`;
};
