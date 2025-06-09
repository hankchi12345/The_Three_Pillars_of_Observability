// services/service-a/tracing.js (所有服務共用此檔案內容)
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-grpc'); // 改為 gRPC
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
      // 確保 Express 和 HTTP/HTTPS 請求被自動追蹤
      '@opentelemetry/instrumentation-express': {},
      '@opentelemetry/instrumentation-http': {},
    }),
  ],
});

try {
  sdk.start();
  console.log(`OpenTelemetry tracing initialized for ${SERVICE_NAME}`);
} catch (error) {
  console.error('Error initializing OpenTelemetry tracing', error);
}
// 為了在 app.js 中能夠進行優雅關閉，可以選擇將 SDK 暴露出去
// module.exports = sdk; // 如果你需要從 app.js 呼叫 sdk.shutdown()

