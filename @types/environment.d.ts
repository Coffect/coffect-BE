import { Secret } from 'jsonwebtoken';

declare namespace NodeJS {
  interface ProcessEnv {
    // PORT: string;
    // DATABASE_URL: string;
    // EXPRESS_SESSION_SECRET: string;
    // PASSPORT_GOOGLE_CLIENT_ID: string;
    // PASSPORT_GOOGLE_CLIENT_SECRET: string;
    JWT_SECRET: Secret | string;
    JWT_REFRESH: string;
  }
}
