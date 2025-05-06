import { setupServer } from 'msw/node';

export const handlers = [];

export const serviceWorker = setupServer(...handlers);