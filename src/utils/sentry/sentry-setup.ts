// Import with `const Sentry = require("@sentry/nestjs");` if you are using CJS
import * as Sentry from '@sentry/nestjs'
import { nodeProfilingIntegration } from '@sentry/profiling-node'

export const sentrySetup = (dsn: string) => {
	Sentry.init({
		dsn,
		integrations: [nodeProfilingIntegration()],

		tracesSampleRate: 1.0,

		profilesSampleRate: 1.0
	})
}
