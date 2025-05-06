/// <reference types="vitest" />
import '@testing-library/jest-dom/vitest'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { serviceWorker } from './mocks/server'
import { cleanup } from '@testing-library/react'

// Start server before all tests
beforeAll(() => serviceWorker.listen({ onUnhandledRequest: 'error' }))

// Close server after all tests
afterAll(() => serviceWorker.close())

// Reset handlers after each test for test isolation
afterEach(() => {
    serviceWorker.resetHandlers()
    cleanup()
})