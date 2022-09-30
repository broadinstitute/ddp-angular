export function makeRandomNum(min = 1, max = 99) {
  const num = Math.random() * (max - min) + min;
  return Math.floor(num);
}

export function makeRandomString(len = 6): string {
  let str = '',
    i = 0;
  for (; i++ < len; ) {
    let rand = Math.floor(Math.random() * 62);
    const charCode = (rand += rand > 9 ? (rand < 36 ? 55 : 61) : 48);
    str += String.fromCharCode(charCode);
  }
  return str;
}

export function makeRandomEmail(originalEmail: string): string {
  const splintedEmail = originalEmail.split('@');
  const name = splintedEmail[0];
  const domain = splintedEmail[1];
  return `${name}+${Math.floor(Math.random() * 1000000)}@${domain}`;
}
