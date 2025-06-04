'use strict';
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { Resource } = require('@opentelemetry/resources'); 
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');


const resource = new Resource({
  [SemanticResourceAttributes.SERVICE_NAME]: 'service-b', 
});


const sdk = new NodeSDK({
  resource,
  traceExporter: new OTLPTraceExporter({
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
console.log(' OpenTelemetry SDK started for service-b'); 
