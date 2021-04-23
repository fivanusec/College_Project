declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    EMAIL_HOST: string;
    EMAIL_DATA: string;
    EMAIL_PASS: string;
  }
}
