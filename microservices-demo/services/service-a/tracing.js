// services/service-a/tracing.js
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-grpc');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { Resource } = require('@opentelemetry/resources');
const { SEMRESATTRS_SERVICE_NAME } = require('@opentelemetry/semantic-conventions');

const SERVICE_NAME = process.env.SERVICE_NAME || 'default-service';

const traceExporter = new OTLPTraceExporter({
  url: 'http://tempo:4317', // Tempo 的 OTLP gRPC 端口
});

const sdk = new NodeSDK({
  resource: new Resource({
    [SEMRESATTRS_SERVICE_NAME]: SERVICE_NAME,
  }),
  traceExporter: traceExporter,
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-express': {},
      '@opentelemetry/instrumentation-http': {},
    }),
  ],
});

// 強制同步啟動
try {
  sdk.start();
  console.log(`OpenTelemetry tracing initialized for ${SERVICE_NAME}`);
} catch (error) {
  console.error('Error initializing OpenTelemetry tracing', error);
}
// 如果需要優雅關閉 SDK
// module.exports = sdk;

