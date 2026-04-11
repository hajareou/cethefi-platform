import { webpackEnv } from '@src/types';

const normalizeBasePath = (value?: string) => {
  if (!value || value === '/') return '/';

  let normalized = value.trim();
  if (!normalized.startsWith('/')) normalized = `/${normalized}`;
  if (!normalized.endsWith('/')) normalized = `${normalized}/`;

  return normalized;
};

export const appBasePath = normalizeBasePath(webpackEnv.ROUTER_BASE);

export const appPath = (path = '') => {
  const normalizedPath = path.replace(/^\/+/, '');
  if (!normalizedPath) return appBasePath;
  return `${appBasePath}${normalizedPath}`;
};

export const absoluteAppUrl = (path = '') => new URL(appPath(path), window.location.origin).toString();
