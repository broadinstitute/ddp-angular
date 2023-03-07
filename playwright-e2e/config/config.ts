import path from 'path';
import dotenv from 'dotenv';
import { env } from 'process';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

type STUDY = 'SINGULAR' | 'RGP';

interface ENV {
  EMAIL: number | undefined;
  PASSWORD: number | undefined;
  BASE_URI: string | undefined;
}

export type Config = Required<ENV>;

const getConfig = (study: STUDY): ENV => {
  return {
    EMAIL: undefined,
    PASSWORD: undefined,
    BASE_URI: env.BASE_URI
  };
};

/**
 * Throwing error if any study env is undefined
 * @param {STUDY} study
 */
const verifyEnv = (study: STUDY): void => {
  const studyEnv = Object.entries(env).filter((key) => key.indexOf(study) > -1);
  for (const [key, value] of studyEnv) {
    if (value === undefined) {
      throw new Error(`Missing ${key} in .env`);
    }
  }
};

export default verifyEnv;
