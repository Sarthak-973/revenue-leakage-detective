# Revenue Leakage Detective Architecture

## Scope

Build a modular monolith for the MVP. The system ingests synthetic CSV/JSON data, reconstructs payment lifecycles, detects five leakage categories, calculates financial impact deterministically, and exposes evidence-backed dashboard and investigation experiences.

## Technology

- Frontend: React, TypeScript, Vite
- Backend: Python, FastAPI
- Database: SQLite with SQLAlchemy; keep repositories replaceable for a later PostgreSQL migration
- Analytics: Pandas and deterministic Python business rules
- AI: provider abstraction for OpenRouter-compatible APIs
- Testing: pytest, FastAPI client tests, frontend component tests, and end-to-end acceptance fixtures

The LLM may investigate, explain, identify probable causes, and recommend actions. It must never calculate or invent monetary values. The application must remain useful when the AI provider is unavailable.

## Runtime Flow

```text
Upload files
  -> Validate and normalize records
  -> Correlate order/payment/refund/settlement/subscription events
  -> Run deterministic leakage detectors
  -> Calculate potential, recoverable, and confirmed leakage
  -> Attach evidence, confidence, root cause, and priority
  -> Serve dashboard, drill-down views, and controlled AI investigation
```

## Repository Layout

```text
frontend/
  src/{app,components,pages,api,types,charts}
backend/
  app/
    main.py
    api/{routes_ingestion.py,routes_dashboard.py,routes_findings.py,routes_investigator.py}
    models/
    schemas/
    repositories/
    services/{ingestion.py,normalization.py,lifecycle.py,findings.py,recommendations.py}
    analytics/{payment_failure.py,checkout_abandonment.py,refund_anomalies.py,settlement_reconciliation.py,subscription_failures.py,recovery.py,prioritization.py}
    ai/{provider.py,agent.py,tools.py,prompts.py}
    db/{database.py,migrations/}
data/synthetic/
tests/{unit,integration,fixtures}
docs/
```

## Data Model

Core entities:

- `merchants(merchant_id, merchant_name, industry)`
- `customers(customer_id, merchant_id, segment, created_at)`
- `orders(order_id, merchant_id, customer_id, amount_minor, currency, status, created_at)`
- `payments(payment_id, order_id, transaction_id, amount_minor, method, provider, status, failure_reason, created_at)`
- `refunds(refund_id, payment_id, amount_minor, status, created_at)`
- `settlements(settlement_id, transaction_id, expected_amount_minor, actual_amount_minor, fees_minor, adjustments_minor, created_at)`
- `subscriptions(subscription_id, customer_id, amount_minor, billing_cycle, renewal_date, status)`
- `lifecycle_events(event_id, entity_type, entity_id, order_id, event_type, occurred_at, source_payload)`
- `analysis_runs(run_id, status, period_start, period_end, validation_errors, calculation_version)`
- `leakage_findings(finding_id, run_id, category, subtype, entity_id, potential_minor, recoverable_minor, confirmed_minor, confidence, priority, evidence_ids)`
- `audit_logs(log_id, actor, action, query, tool_name, created_at)`

Store money as integer minor units or `Decimal`, never binary floating point. Do not store raw card data. Mask sensitive fields at ingestion and response boundaries.

Checkout events are required for abandonment detection even though they are not a primary financial entity; represent them as normalized `lifecycle_events` in the MVP.

## Analytics Ownership

Each detector returns findings with affected entity IDs, deterministic amounts, confidence inputs, and evidence references. A central aggregation layer deduplicates findings before calculating dashboard totals.

- Payment failures: group attempts by order; exclude any order with a later successful payment.
- Checkout abandonment: identify initiated checkout with no completed payment; exclude later recovered orders.
- Refund anomalies: detect duplicate refunds, refunds exceeding successful payment value, and refunds without successful payment.
- Settlement mismatch: expected settlement equals successful payments minus refunds, fees, adjustments, and disputes; compare with actual settlement and retain unexplained differences as findings.
- Subscription failures: analyze failed renewals, retry attempts, customer history, and eligibility for recovery.
- Recovery: begin with configurable deterministic rules based on reason, retry count, customer history, age, method, and historical recovery.
- Priority: `financial_impact * recovery_probability * confidence / intervention_cost`; document default weights and allow configuration.
- Root cause: aggregate findings by provider, method, failure reason, time window, and baseline deviation.

Keep `potential_leakage`, `recoverable_leakage`, and `confirmed_leakage` separate. Low-confidence findings remain potential, and independent leakage events must be evidenced before one lifecycle can contribute to multiple categories.

## API Contracts

- `POST /api/analyses/upload`: upload CSV/JSON files and return `analysis_id`.
- `GET /api/analyses/{analysis_id}/status`: ingestion, validation, and analysis progress.
- `GET /api/dashboard?analysis_id=...`: KPI totals, category breakdown, and period comparisons.
- `GET /api/findings`: filter findings by category, confidence, period, and priority.
- `GET /api/findings/{finding_id}`: finding, evidence, calculation inputs, and recommendation.
- `GET /api/transactions/{id}/lifecycle`: reconstructed transaction journey.
- `GET /api/recommendations`: ranked actions with financial impact and rationale.
- `POST /api/investigator/query`: natural-language question and structured answer.
- `GET /api/health`: service health.

All financial response fields originate from persisted analytical results and include currency, calculation version, and evidence references where applicable.

## Controlled AI Tools

The investigator may call only schema-validated, read-oriented tools:

`get_dashboard_metrics`, `get_findings`, `get_order_lifecycle`, `get_payment_attempts`, `get_customer_history`, `get_refunds`, `get_settlements`, `get_subscriptions`, `calculate_leakage`, `find_anomalies`, `compare_periods`, `get_root_cause`, and `get_recommendations`.

Tool results are the sole source of financial figures. Responses must contain Finding, Financial Impact, Evidence, Confidence, Root Cause, and Recommended Action. Log prompts, tool calls, and recommendations, but never secrets or raw payment data. Financial actions stop at recommendation and require human approval.

## Testing Strategy

- Unit-test every detector, amount formula, confidence rule, recovery rule, and priority calculation.
- Include fixtures for recovered payment retries, permanent failures, abandonment later recovered, duplicate/over refunds, refund without successful payment, settlement adjustments, and subscription retries.
- Add regression tests for lifecycle deduplication and cross-category double counting.
- Test upload validation, missing identifiers, duplicate records, timestamps, currencies, masked data, and insufficient-data responses.
- Test API schemas and upload-to-dashboard integration.
- Test AI tool restrictions, evidence references, structured response fields, fabricated-value prevention, and provider-unavailable fallback.
- Run a scaled synthetic-data performance smoke test for interactive ingestion and dashboard loading.

## Build Order

1. Scaffold frontend/backend, configuration, SQLite, and test harness.
2. Add schemas, repositories, synthetic fixtures, ingestion, and normalization.
3. Implement lifecycle correlation and deduplication.
4. Implement payment and checkout detectors with financial tests.
5. Implement refund, settlement, and subscription detectors.
6. Add recovery, confidence, evidence, root cause, and priority calculations.
7. Add dashboard, findings, lifecycle, and recommendation APIs.
8. Build dashboard, breakdown, investigation, and drill-down views.
9. Add AI provider, controlled tools, structured responses, audit logging, and fallback mode.
10. Run acceptance scenarios, security checks, and performance smoke tests.

## Decisions and Risks

- Use SQLite for the buildathon despite the PRD's PostgreSQL diagram; isolate persistence behind repositories.
- Define one canonical lifecycle key and explicit event ownership before implementing detectors.
- Agree on baseline periods, confidence thresholds, recovery probabilities, intervention costs, and confirmed-leakage criteria.
- Require one analysis currency or explicit conversion rates; multi-currency behavior is otherwise ambiguous.
- Settlement reconciliation may need provider-specific matching rules and batch identifiers.
- Basic masking and local access controls are MVP measures; production encryption, RBAC, secret management, and multi-tenant isolation need further hardening.
- Rotate any real API key that has appeared in terminal history and keep credentials outside source control.
