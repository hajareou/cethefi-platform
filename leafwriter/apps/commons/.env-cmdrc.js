const envs = {
  GA_MEASUREMENT_ID: 'G-JG3NWYH6TY',
  GEONAMES_USERNAME: 'LEAFwriter',
  AUTH_API_URL: 'https://auth-api.dev.lincsproject.ca',
};

module.exports = {
  // ========== LOCAL DEV ==========
  development: {
    ...envs,
    AUTH_API_URL: 'http://localhost:8091',
    NODE_ENV: 'development',
    WORKER_ENV: 'production',
  },
  // ========== PUBLISH TO VM ==========
  production: {
    ...envs,
    NODE_ENV: 'production',
    WORKER_ENV: 'production',
  },
};
