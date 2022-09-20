export const randomNum = (min = 1, max = 99) => {
  const num = Math.random() * (max - min) + min;

  return Math.floor(num);
};
