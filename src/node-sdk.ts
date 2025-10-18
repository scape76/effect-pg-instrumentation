import { NodeSdk } from "@effect/opentelemetry";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { PgInstrumentation } from "@opentelemetry/instrumentation-pg";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";

export const NodeSdkLive = NodeSdk.layer(() => ({
	resource: {
		serviceName: "test-effect-pg-instrumentation",
	},
	instrumentations: [
		new PgInstrumentation({
			enhancedDatabaseReporting: true,
		}),
	],
	spanProcessor: (() => {
		return new BatchSpanProcessor(new OTLPTraceExporter());
	})(),
}));
