
    const schema = {
  "asyncapi": "3.0.0",
  "info": {
    "title": "log0 Event API",
    "version": "1.0.0",
    "description": "AsyncAPI specification for all Kafka event contracts in the log0 platform.\n\nlog0 is a multi-tenant log intelligence and incident management platform.\nLogs enter at the ingestion-gateway and flow through a linear pipeline:\ningestion → normalization → clustering → incident management → notification.\n\nEvery message is keyed by `tenantId` to guarantee per-tenant ordering\nwithin Kafka partitions. Each stage has a corresponding dead-letter queue\n(DLQ) topic so no event is silently lost on processing failure.\n",
    "contact": {
      "name": "log0 Platform",
      "url": "https://log0.vercel.app/docs"
    }
  },
  "defaultContentType": "application/json",
  "servers": {
    "local": {
      "host": "localhost:9092",
      "protocol": "kafka",
      "description": "Local Kafka broker started via docker-compose in docker/kafka/"
    }
  },
  "channels": {
    "raw-logs": {
      "address": "raw-logs",
      "description": "Receives every accepted log event from the ingestion-gateway.\nKafka key = `tenantId` (ensures per-tenant ordering within partitions).\nOn producer failure the event is routed to `raw-logs-dlq` instead.\n",
      "messages": {
        "RawLogEvent": {
          "name": "RawLogEvent",
          "title": "Raw Log Event",
          "summary": "A validated log event as received by the ingestion-gateway",
          "contentType": "application/json",
          "payload": {
            "type": "object",
            "description": "Published to `raw-logs` by the ingestion-gateway immediately after a\nPOST /api/v1/logs request passes validation. Carries the original log\npayload enriched with platform metadata (eventId, receivedAt).\n",
            "required": [
              "eventId",
              "tenantId",
              "serviceName",
              "environment",
              "receivedAt",
              "level",
              "message"
            ],
            "properties": {
              "eventId": {
                "type": "string",
                "format": "uuid",
                "description": "Platform-assigned unique identifier for this log event (UUID v4)",
                "example": "a3f2c1d4-55b6-4e89-9f12-0a1b2c3d4e5f",
                "x-parser-schema-id": "<anonymous-schema-1>"
              },
              "tenantId": {
                "type": "string",
                "format": "uuid",
                "description": "Tenant that owns this log event. Also used as the Kafka partition key.",
                "example": "b7e1f290-12ab-4cd3-8ef5-6789abcd0123",
                "x-parser-schema-id": "<anonymous-schema-2>"
              },
              "serviceName": {
                "type": "string",
                "description": "Name of the application service that generated the log",
                "example": "payment-service",
                "x-parser-schema-id": "<anonymous-schema-3>"
              },
              "environment": {
                "type": "string",
                "description": "Deployment environment (e.g. production, staging, dev)",
                "example": "production",
                "x-parser-schema-id": "<anonymous-schema-4>"
              },
              "receivedAt": {
                "type": "string",
                "format": "date-time",
                "description": "UTC timestamp when the ingestion-gateway received the request",
                "example": "2026-03-30T10:15:30Z",
                "x-parser-schema-id": "<anonymous-schema-5>"
              },
              "logTimestamp": {
                "type": "string",
                "format": "date-time",
                "description": "UTC timestamp from the original log payload. Null if not provided -\nthe normalization-service falls back to `receivedAt` in that case.\n",
                "example": "2026-03-30T10:15:29.842Z",
                "x-parser-schema-id": "<anonymous-schema-6>"
              },
              "level": {
                "type": "string",
                "description": "Raw log level string as sent by the client (normalized downstream)",
                "example": "ERROR",
                "x-parser-schema-id": "<anonymous-schema-7>"
              },
              "message": {
                "type": "string",
                "maxLength": 10000,
                "description": "The log message body",
                "example": "Connection timeout after 30000ms calling payment gateway",
                "x-parser-schema-id": "<anonymous-schema-8>"
              },
              "trace": {
                "type": "string",
                "maxLength": 100000,
                "description": "Optional stack trace or structured trace context",
                "example": "java.net.SocketTimeoutException: Read timed out\n\tat com.example...",
                "x-parser-schema-id": "<anonymous-schema-9>"
              }
            },
            "x-parser-schema-id": "RawLogEvent"
          },
          "x-parser-unique-object-id": "RawLogEvent"
        }
      },
      "x-parser-unique-object-id": "raw-logs"
    },
    "raw-logs-dlq": {
      "address": "raw-logs-dlq",
      "description": "Dead-letter queue for the `raw-logs` pipeline. Receives events that\ncould not be delivered or processed by the normalization-service.\nKafka key = `eventId` of the original failed event.\nMultiple services publish here: ingestion-gateway (producer failure)\nand normalization-service (consumer processing failure).\n",
      "messages": {
        "DlqEvent": {
          "name": "DlqEvent",
          "title": "Dead-Letter Queue Event",
          "summary": "Wraps any failed event with error context for replay or alerting",
          "contentType": "application/json",
          "payload": {
            "type": "object",
            "description": "Universal dead-letter queue envelope. Published to `raw-logs-dlq` by any\nservice that catches a processing error. Preserves the original event and\nerror context for replay or alerting without losing data.\n",
            "required": [
              "originalEvent",
              "errorMessage",
              "failedAt",
              "failedAtTs"
            ],
            "properties": {
              "originalEvent": {
                "description": "The original event payload that could not be processed.\nType varies by which service published to the DLQ:\nRawLogEvent (ingestion-gateway), NormalizedLogEvent (normalization-service),\nIncidentEvent (clustering-service), NotificationEvent (incident-service).\n",
                "example": {},
                "x-parser-schema-id": "<anonymous-schema-10>"
              },
              "errorMessage": {
                "type": "string",
                "description": "Exception message or cause of failure",
                "example": "org.apache.kafka.common.errors.TimeoutException: Topic raw-logs not present",
                "x-parser-schema-id": "<anonymous-schema-11>"
              },
              "failedAt": {
                "type": "string",
                "description": "Name of the service that caught the error and published this DLQ event",
                "enum": [
                  "ingestion-gateway",
                  "normalization-service",
                  "clustering-service",
                  "incident-service",
                  "notification-service"
                ],
                "example": "normalization-service",
                "x-parser-schema-id": "<anonymous-schema-12>"
              },
              "failedAtTs": {
                "type": "string",
                "format": "date-time",
                "description": "UTC timestamp when the failure was caught",
                "example": "2026-03-30T10:15:31Z",
                "x-parser-schema-id": "<anonymous-schema-13>"
              }
            },
            "x-parser-schema-id": "DlqEvent"
          },
          "x-parser-unique-object-id": "DlqEvent"
        }
      },
      "x-parser-unique-object-id": "raw-logs-dlq"
    },
    "normalized-logs": {
      "address": "normalized-logs",
      "description": "Carries fully normalized and fingerprinted log events produced by\nthe normalization-service. Kafka key = `tenantId`.\nOn consumer failure in the clustering-service the event is routed\nto `raw-logs-dlq`.\n",
      "messages": {
        "NormalizedLogEvent": {
          "name": "NormalizedLogEvent",
          "title": "Normalized Log Event",
          "summary": "A log event after normalization and SHA-256 fingerprinting",
          "contentType": "application/json",
          "payload": {
            "type": "object",
            "description": "Published to `normalized-logs` by the normalization-service after\ncleaning the raw event and generating a deterministic SHA-256 fingerprint.\nThe fingerprint is the deduplication key used by the clustering-service.\n",
            "required": [
              "eventId",
              "tenantId",
              "serviceName",
              "environment",
              "timestamp",
              "level",
              "message",
              "messageTemplate",
              "fingerprint",
              "schemaVersion"
            ],
            "properties": {
              "eventId": {
                "type": "string",
                "format": "uuid",
                "description": "Carried through from RawLogEvent for end-to-end tracing",
                "example": "a3f2c1d4-55b6-4e89-9f12-0a1b2c3d4e5f",
                "x-parser-schema-id": "<anonymous-schema-14>"
              },
              "tenantId": {
                "type": "string",
                "format": "uuid",
                "description": "Tenant that owns this event. Kafka partition key.",
                "example": "b7e1f290-12ab-4cd3-8ef5-6789abcd0123",
                "x-parser-schema-id": "<anonymous-schema-15>"
              },
              "serviceName": {
                "type": "string",
                "example": "payment-service",
                "x-parser-schema-id": "<anonymous-schema-16>"
              },
              "environment": {
                "type": "string",
                "example": "production",
                "x-parser-schema-id": "<anonymous-schema-17>"
              },
              "timestamp": {
                "type": "string",
                "format": "date-time",
                "description": "Resolved timestamp: logTimestamp from the raw event if present,\notherwise falls back to receivedAt.\n",
                "example": "2026-03-30T10:15:29.842Z",
                "x-parser-schema-id": "<anonymous-schema-18>"
              },
              "level": {
                "type": "string",
                "description": "Normalized log level (uppercased; defaults to INFO if unrecognized)",
                "example": "ERROR",
                "x-parser-schema-id": "<anonymous-schema-19>"
              },
              "message": {
                "type": "string",
                "description": "Trimmed, null-safe log message",
                "example": "Connection timeout after 30000ms calling payment gateway",
                "x-parser-schema-id": "<anonymous-schema-20>"
              },
              "messageTemplate": {
                "type": "string",
                "description": "Dynamic values replaced by tokens in strict order:\nUUIDs → <uuid>, IPs → <ip>, numbers → <number>.\nUsed as the stable input to fingerprint hashing.\n",
                "example": "Connection timeout after <number>ms calling payment gateway",
                "x-parser-schema-id": "<anonymous-schema-21>"
              },
              "fingerprint": {
                "type": "string",
                "description": "SHA-256 hex digest of: serviceName|messageTemplate|exceptionType|firstStackFrame.\nDeterministic across deployments - same error always produces the same fingerprint.\n",
                "example": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                "x-parser-schema-id": "<anonymous-schema-22>"
              },
              "attributes": {
                "type": "object",
                "description": "Extracted structured attributes (placeholder - reserved for future enrichment)",
                "additionalProperties": true,
                "example": {},
                "x-parser-schema-id": "<anonymous-schema-23>"
              },
              "traceId": {
                "type": "string",
                "description": "Optional distributed trace ID for correlation with APM tools",
                "example": "4bf92f3577b34da6a3ce929d0e0e4736",
                "x-parser-schema-id": "<anonymous-schema-24>"
              },
              "schemaVersion": {
                "type": "string",
                "description": "Schema version for forward compatibility. Currently always \"v1\".",
                "example": "v1",
                "x-parser-schema-id": "<anonymous-schema-25>"
              }
            },
            "x-parser-schema-id": "NormalizedLogEvent"
          },
          "x-parser-unique-object-id": "NormalizedLogEvent"
        }
      },
      "x-parser-unique-object-id": "normalized-logs"
    },
    "incident-events": {
      "address": "incident-events",
      "description": "Published by the clustering-service when a fingerprint's occurrence\ncount crosses the configured threshold within a 5-minute tumbling window.\nKafka key = `tenantId`.\nConsumed by the incident-service to create or update incidents in PostgreSQL.\n",
      "messages": {
        "IncidentEvent": {
          "name": "IncidentEvent",
          "title": "Incident Event",
          "summary": "Signals that a fingerprint's occurrence count crossed the threshold",
          "contentType": "application/json",
          "payload": {
            "type": "object",
            "description": "Published to `incident-events` by the clustering-service when a\n(tenantId + fingerprint) combination exceeds the occurrence threshold\nwithin a tumbling window. Triggers incident creation or update in PostgreSQL.\n",
            "required": [
              "tenantId",
              "fingerprint",
              "serviceName",
              "environment",
              "severity",
              "occurrenceCount",
              "firstSeenAt",
              "lastSeenAt",
              "topMessages"
            ],
            "properties": {
              "tenantId": {
                "type": "string",
                "format": "uuid",
                "description": "Tenant that owns this incident. Kafka partition key.",
                "example": "b7e1f290-12ab-4cd3-8ef5-6789abcd0123",
                "x-parser-schema-id": "<anonymous-schema-26>"
              },
              "fingerprint": {
                "type": "string",
                "description": "SHA-256 fingerprint from NormalizedLogEvent. Deduplication key.",
                "example": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                "x-parser-schema-id": "<anonymous-schema-27>"
              },
              "serviceName": {
                "type": "string",
                "example": "payment-service",
                "x-parser-schema-id": "<anonymous-schema-28>"
              },
              "environment": {
                "type": "string",
                "example": "production",
                "x-parser-schema-id": "<anonymous-schema-29>"
              },
              "severity": {
                "type": "string",
                "enum": [
                  "HIGH",
                  "MEDIUM",
                  "LOW"
                ],
                "description": "Resolved by SeverityResolver: ERROR/FATAL → HIGH, WARN → MEDIUM, INFO/DEBUG → LOW\n",
                "example": "HIGH",
                "x-parser-schema-id": "<anonymous-schema-30>"
              },
              "occurrenceCount": {
                "type": "integer",
                "format": "int64",
                "description": "Number of matching log events seen within the current window",
                "example": 438,
                "x-parser-schema-id": "<anonymous-schema-31>"
              },
              "firstSeenAt": {
                "type": "string",
                "format": "date-time",
                "description": "Timestamp of the first log event in the current clustering window",
                "example": "2026-03-30T10:10:00Z",
                "x-parser-schema-id": "<anonymous-schema-32>"
              },
              "lastSeenAt": {
                "type": "string",
                "format": "date-time",
                "description": "Timestamp of the most recent log event in the current window",
                "example": "2026-03-30T10:15:00Z",
                "x-parser-schema-id": "<anonymous-schema-33>"
              },
              "topMessages": {
                "type": "array",
                "items": {
                  "type": "string",
                  "x-parser-schema-id": "<anonymous-schema-35>"
                },
                "description": "Up to 10 distinct log messages from this window (for AI prompt context)",
                "example": [
                  "Connection timeout after 30000ms calling payment gateway",
                  "Connection timeout after 28514ms calling payment gateway"
                ],
                "x-parser-schema-id": "<anonymous-schema-34>"
              }
            },
            "x-parser-schema-id": "IncidentEvent"
          },
          "x-parser-unique-object-id": "IncidentEvent"
        }
      },
      "x-parser-unique-object-id": "incident-events"
    },
    "notification-events": {
      "address": "notification-events",
      "description": "Published by the incident-service on incident lifecycle transitions\n(CREATED, ASSIGNED, RESOLVED). Kafka key = `tenantId`.\nConsumed by the notification-service to send Slack alerts.\n",
      "messages": {
        "NotificationEvent": {
          "name": "NotificationEvent",
          "title": "Notification Event",
          "summary": "Signals an incident lifecycle transition requiring a Slack alert",
          "contentType": "application/json",
          "payload": {
            "type": "object",
            "description": "Published to `notification-events` by the incident-service on incident\nlifecycle transitions. The notification-service consumes this to send\nformatted Slack Block Kit alerts.\n",
            "required": [
              "tenantId",
              "incidentId",
              "fingerprint",
              "serviceName",
              "environment",
              "severity",
              "status",
              "occurrenceCount",
              "firstSeenAt",
              "lastSeenAt",
              "topMessages",
              "notificationType"
            ],
            "properties": {
              "tenantId": {
                "type": "string",
                "format": "uuid",
                "description": "Tenant that owns this incident. Kafka partition key.",
                "example": "b7e1f290-12ab-4cd3-8ef5-6789abcd0123",
                "x-parser-schema-id": "<anonymous-schema-36>"
              },
              "incidentId": {
                "type": "string",
                "format": "uuid",
                "description": "Database ID of the incident in PostgreSQL",
                "example": "c9d8e7f6-a5b4-4c3d-2e1f-0a9b8c7d6e5f",
                "x-parser-schema-id": "<anonymous-schema-37>"
              },
              "fingerprint": {
                "type": "string",
                "example": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                "x-parser-schema-id": "<anonymous-schema-38>"
              },
              "serviceName": {
                "type": "string",
                "example": "payment-service",
                "x-parser-schema-id": "<anonymous-schema-39>"
              },
              "environment": {
                "type": "string",
                "example": "production",
                "x-parser-schema-id": "<anonymous-schema-40>"
              },
              "severity": {
                "type": "string",
                "enum": [
                  "HIGH",
                  "MEDIUM",
                  "LOW"
                ],
                "example": "HIGH",
                "x-parser-schema-id": "<anonymous-schema-41>"
              },
              "status": {
                "type": "string",
                "enum": [
                  "NEW",
                  "ASSIGNED",
                  "ACKNOWLEDGED",
                  "RESOLVED"
                ],
                "description": "Current incident status at the time of the notification",
                "example": "NEW",
                "x-parser-schema-id": "<anonymous-schema-42>"
              },
              "occurrenceCount": {
                "type": "integer",
                "format": "int64",
                "example": 438,
                "x-parser-schema-id": "<anonymous-schema-43>"
              },
              "firstSeenAt": {
                "type": "string",
                "format": "date-time",
                "example": "2026-03-30T10:10:00Z",
                "x-parser-schema-id": "<anonymous-schema-44>"
              },
              "lastSeenAt": {
                "type": "string",
                "format": "date-time",
                "example": "2026-03-30T10:15:00Z",
                "x-parser-schema-id": "<anonymous-schema-45>"
              },
              "topMessages": {
                "type": "array",
                "items": {
                  "type": "string",
                  "x-parser-schema-id": "<anonymous-schema-47>"
                },
                "example": [
                  "Connection timeout after 30000ms calling payment gateway"
                ],
                "x-parser-schema-id": "<anonymous-schema-46>"
              },
              "aiSummary": {
                "type": "string",
                "description": "AI-generated incident summary from the ai-service. Null on INCIDENT_CREATED\n(async - may arrive shortly after). Present on subsequent events.\n",
                "example": "Summary: Payment gateway timeouts causing checkout failures.\nPossible Cause: Upstream latency spike...",
                "x-parser-schema-id": "<anonymous-schema-48>"
              },
              "notificationType": {
                "type": "string",
                "enum": [
                  "INCIDENT_CREATED",
                  "INCIDENT_ASSIGNED",
                  "INCIDENT_RESOLVED"
                ],
                "description": "The lifecycle event that triggered this notification",
                "example": "INCIDENT_CREATED",
                "x-parser-schema-id": "<anonymous-schema-49>"
              },
              "assignedToUserId": {
                "type": "string",
                "format": "uuid",
                "description": "UUID of the engineer assigned to this incident.\nNull unless notificationType is INCIDENT_ASSIGNED.\n",
                "example": "d1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6a",
                "x-parser-schema-id": "<anonymous-schema-50>"
              }
            },
            "x-parser-schema-id": "NotificationEvent"
          },
          "x-parser-unique-object-id": "NotificationEvent"
        }
      },
      "x-parser-unique-object-id": "notification-events"
    }
  },
  "operations": {
    "ingestion-gateway/publishRawLog": {
      "action": "send",
      "channel": "$ref:$.channels.raw-logs",
      "summary": "Publish a raw log event after validation",
      "description": "Called by the ingestion-gateway after a POST /api/v1/logs request passes\nheader and payload validation. The event is sent asynchronously; HTTP 202\nis returned to the client immediately.\n",
      "x-parser-unique-object-id": "ingestion-gateway/publishRawLog"
    },
    "ingestion-gateway/publishRawLogDlq": {
      "action": "send",
      "channel": "$ref:$.channels.raw-logs-dlq",
      "summary": "Route failed raw log events to the DLQ",
      "description": "Published by the ingestion-gateway when the Kafka send to `raw-logs` fails.\n",
      "x-parser-unique-object-id": "ingestion-gateway/publishRawLogDlq"
    },
    "normalization-service/consumeRawLog": {
      "action": "receive",
      "channel": "$ref:$.channels.raw-logs",
      "summary": "Consume raw log events for normalization",
      "description": "Manual offset acknowledgment - the offset is committed only after the\nnormalized event is successfully published to `normalized-logs`.\nOn failure the event is forwarded to `raw-logs-dlq` and the offset is\nstill committed to prevent partition stalls.\n",
      "x-parser-unique-object-id": "normalization-service/consumeRawLog"
    },
    "normalization-service/publishNormalizedLog": {
      "action": "send",
      "channel": "$ref:$.channels.normalized-logs",
      "summary": "Publish a normalized and fingerprinted log event",
      "x-parser-unique-object-id": "normalization-service/publishNormalizedLog"
    },
    "normalization-service/publishNormalizedLogDlq": {
      "action": "send",
      "channel": "$ref:$.channels.raw-logs-dlq",
      "summary": "Route normalization failures to the DLQ",
      "x-parser-unique-object-id": "normalization-service/publishNormalizedLogDlq"
    },
    "clustering-service/consumeNormalizedLog": {
      "action": "receive",
      "channel": "$ref:$.channels.normalized-logs",
      "summary": "Consume normalized log events for fingerprint-based clustering",
      "description": "Groups events by (tenantId + fingerprint) within a configurable tumbling\nwindow (default 5 minutes). When occurrence count reaches the configured\nthreshold (default 10) an IncidentEvent is published.\n",
      "x-parser-unique-object-id": "clustering-service/consumeNormalizedLog"
    },
    "clustering-service/publishIncidentEvent": {
      "action": "send",
      "channel": "$ref:$.channels.incident-events",
      "summary": "Publish an incident event when the occurrence threshold is crossed",
      "x-parser-unique-object-id": "clustering-service/publishIncidentEvent"
    },
    "clustering-service/publishClusteringDlq": {
      "action": "send",
      "channel": "$ref:$.channels.raw-logs-dlq",
      "summary": "Route clustering failures to the DLQ",
      "x-parser-unique-object-id": "clustering-service/publishClusteringDlq"
    },
    "incident-service/consumeIncidentEvent": {
      "action": "receive",
      "channel": "$ref:$.channels.incident-events",
      "summary": "Consume incident events to create or update incidents in PostgreSQL",
      "description": "Deduplicates by (tenantId + fingerprint) where status != RESOLVED.\nOn new incident: triggers async AI summarization and publishes a\nNotificationEvent. On update: increments occurrence count only.\n",
      "x-parser-unique-object-id": "incident-service/consumeIncidentEvent"
    },
    "incident-service/publishNotificationEvent": {
      "action": "send",
      "channel": "$ref:$.channels.notification-events",
      "summary": "Publish a notification event on incident lifecycle transitions",
      "x-parser-unique-object-id": "incident-service/publishNotificationEvent"
    },
    "incident-service/publishIncidentDlq": {
      "action": "send",
      "channel": "$ref:$.channels.raw-logs-dlq",
      "summary": "Route incident processing failures to the DLQ",
      "x-parser-unique-object-id": "incident-service/publishIncidentDlq"
    },
    "notification-service/consumeNotificationEvent": {
      "action": "receive",
      "channel": "$ref:$.channels.notification-events",
      "summary": "Consume notification events and send Slack alerts",
      "description": "Posts formatted Slack Block Kit messages to the configured channel.\nOn failure routes to `notification-events-dlq` (internal DLQ topic).\n",
      "x-parser-unique-object-id": "notification-service/consumeNotificationEvent"
    }
  },
  "components": {
    "messages": {
      "RawLogEvent": "$ref:$.channels.raw-logs.messages.RawLogEvent",
      "NormalizedLogEvent": "$ref:$.channels.normalized-logs.messages.NormalizedLogEvent",
      "IncidentEvent": "$ref:$.channels.incident-events.messages.IncidentEvent",
      "NotificationEvent": "$ref:$.channels.notification-events.messages.NotificationEvent",
      "DlqEvent": "$ref:$.channels.raw-logs-dlq.messages.DlqEvent"
    },
    "schemas": {
      "RawLogEvent": "$ref:$.channels.raw-logs.messages.RawLogEvent.payload",
      "NormalizedLogEvent": "$ref:$.channels.normalized-logs.messages.NormalizedLogEvent.payload",
      "IncidentEvent": "$ref:$.channels.incident-events.messages.IncidentEvent.payload",
      "NotificationEvent": "$ref:$.channels.notification-events.messages.NotificationEvent.payload",
      "DlqEvent": "$ref:$.channels.raw-logs-dlq.messages.DlqEvent.payload"
    }
  },
  "x-parser-spec-parsed": true,
  "x-parser-api-version": 3,
  "x-parser-spec-stringified": true
};
    const config = {"show":{"sidebar":true},"sidebar":{"showOperations":"byDefault"}};
    const appRoot = document.getElementById('root');
    AsyncApiStandalone.render(
        { schema, config, }, appRoot
    );
  