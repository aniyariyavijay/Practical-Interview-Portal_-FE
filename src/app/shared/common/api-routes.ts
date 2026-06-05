export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VALIDATE_RESET_TOKEN: '/auth/validate-reset-token',
  },
  QUESTIONS:{
    GET_ALL: '/questions',
    GET_BY_ID: '/questions/',
    CREATE: '/questions',
    UPDATE: '/questions/',
    DELETE: '/questions/',
    GET_ALL_CATEGORIES: '/questions/category'
  }
};
