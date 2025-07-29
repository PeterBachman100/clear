// src/setupTests.js
import { expect, afterEach, beforeAll, afterAll } from 'vitest';
import { server } from './mocks/server';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';


expect.extend(matchers);

beforeAll(() => {
  server.listen()
});
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
afterAll(() => {
  server.close();
});
