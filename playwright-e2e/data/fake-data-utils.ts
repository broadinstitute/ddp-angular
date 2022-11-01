import { faker } from '@faker-js/faker';

export const generateUserName = (namePrefix: string): string => {
  return `${namePrefix}-${faker.name.lastName()}`;
};
