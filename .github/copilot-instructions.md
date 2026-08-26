# Revenue Leakage Detective — Copilot Instructions

## Product

Build an AI-powered merchant revenue leakage investigation platform.

Core lifecycle:

Order → Checkout → Payment → Refund → Settlement → Subscription → Dispute

## Critical principle

The application must identify financial leakage using deterministic calculations.

Never allow the LLM to calculate financial values.

Use:

* Python
* SQL
* deterministic business rules
* analytics

for financial calculations.

Use the LLM only for:

* investigation
* explanation
* root-cause reasoning
* recommendations
* natural-language interaction

## Financial correctness

Never count every failed payment as revenue leakage.

If:

Order ₹5,000
Payment attempt 1 = failed
Payment attempt 2 = successful

then:

Revenue leakage = ₹0.

Prevent double counting across the same transaction lifecycle.

## MVP leakage categories

1. Payment failure leakage
2. Checkout abandonment
3. Refund anomalies
4. Settlement mismatch
5. Subscription payment failure

## Financial metrics

Always distinguish:

* Potential Leakage
* Recoverable Leakage
* Confirmed Leakage

## AI requirements

The AI must use controlled tools to access financial information.

Never fabricate:

* transaction amounts
* leakage amounts
* recovery values
* customer information
* settlement values

AI responses must contain:

* Finding
* Financial Impact
* Evidence
* Confidence
* Root Cause
* Recommended Action

## Architecture

Prefer a simple modular architecture.

Frontend:
React + TypeScript + Vite

Backend:
Python + FastAPI

Analytics:
Pandas + deterministic Python logic

Database:
SQLite for MVP

AI:
Provider abstraction supporting OpenRouter-compatible APIs

## Development principles

Do not over-engineer.

Do not create unnecessary microservices.

Do not create unnecessary AI agents.

Keep financial logic independent from the LLM.

Keep the application functional when the LLM is unavailable.

Use synthetic data only.

Never commit secrets.

Write tests for all financial calculations.

Before changing code:

1. Inspect existing implementation.
2. Identify affected files.
3. Make the smallest required change.
4. Run relevant tests.
5. Fix failures.
6. Do not rewrite unrelated code.
