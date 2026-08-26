# Revenue Leakage Detective

## Product Requirements Document (PRD)

**Product:** Revenue Leakage Detective
**Track:** AI Revenue Recovery
**Document Type:** Product Requirements Document
**Version:** 1.0
**Status:** Buildathon MVP
**Primary Objective:** Identify, quantify, explain, prioritize, and help recover revenue lost across the merchant payment lifecycle.

---

## 1. Executive Summary

Revenue Leakage Detective is an AI-powered financial intelligence product designed to help merchants identify revenue that is being lost or placed at risk across the complete payment lifecycle.

Traditional payment analytics typically focus on individual metrics such as payment success rate, failed transactions, refunds, or settlements. This creates a fragmented view of the merchant's financial performance.

Revenue Leakage Detective connects these events into a single transaction journey:

**Order → Checkout → Payment Attempt → Payment Success/Failure → Refund → Settlement → Dispute**

The system analyses this lifecycle to identify potential revenue leakage, determine its root cause, estimate the amount that can realistically be recovered, and prioritize corrective actions based on expected financial impact.

The core product promise is:

> **Don't just show merchants where transactions failed. Show them where money was lost, why it happened, how much can be recovered, and what they should fix first.**

---

# 2. Problem Statement

Merchants process thousands or millions of transactions across multiple payment and financial stages. Revenue can be lost because of:

* Payment failures
* Checkout abandonment
* Repeated unsuccessful payment attempts
* Subscription renewal failures
* Duplicate or excessive refunds
* Settlement discrepancies
* Disputes and chargebacks
* Operational inconsistencies

Currently, merchants may have access to individual reports, but identifying the relationship between these events requires manual investigation.

For example:

A merchant may see:

> 5,000 failed payment attempts.

However, this does not necessarily mean revenue was lost.

Some customers may retry successfully.

Therefore:

**Failed transaction ≠ Revenue leakage**

The product must distinguish between:

* A temporary payment failure
* A successfully recovered payment
* A genuinely lost transaction
* A suspicious financial discrepancy
* A potentially recoverable transaction

---

# 3. Product Vision

Build an intelligent **revenue detective** that continuously investigates the merchant's payment lifecycle and converts transaction data into actionable financial decisions.

### Vision

> **Every significant revenue leakage event should be detected, explained, quantified, and assigned an actionable recovery opportunity.**

---

# 4. Product Goals

## Primary Goals

1. Identify potential revenue leakage across the payment lifecycle.
2. Correlate related transactions into a single customer/order journey.
3. Prevent double-counting of leakage.
4. Quantify the financial impact of each leakage category.
5. Estimate recoverable revenue.
6. Identify root causes.
7. Prioritize issues based on expected financial impact.
8. Provide evidence-backed AI explanations.
9. Recommend appropriate corrective actions.
10. Reduce manual financial investigation effort.

## Secondary Goals

* Improve merchant payment success rates.
* Improve recovery rates.
* Reduce unnecessary payment retries.
* Identify abnormal refund behaviour.
* Detect settlement discrepancies.
* Provide finance teams with investigation-ready information.

---

# 5. Non-Goals

The MVP will **not** attempt to:

* Automatically move or transfer merchant funds.
* Automatically issue refunds.
* Automatically dispute transactions.
* Replace a merchant's accounting/ERP system.
* Provide legal or financial advice.
* Build a complete fraud-prevention platform.
* Support every possible payment-provider integration.
* Predict revenue with perfect certainty.

The AI should recommend actions, while financial actions remain subject to merchant approval.

---

# 6. Target Users

## Persona 1 — Merchant/Business Owner

### Needs

* Understand where money is being lost.
* Know the most important problem to solve.
* Understand financial impact without analysing raw data.

### Typical Question

> "Why did my revenue fall this month?"

---

## Persona 2 — Finance Manager

### Needs

* Reconcile payments and settlements.
* Investigate discrepancies.
* Identify refund abnormalities.
* Validate financial reports.

### Typical Question

> "Why does expected settlement differ from actual settlement?"

---

## Persona 3 — Revenue/Operations Manager

### Needs

* Recover failed payments.
* Reduce checkout abandonment.
* Improve payment conversion.
* Prioritize recovery campaigns.

### Typical Question

> "Which failed payments should we try to recover first?"

---

# 7. Core Product Workflow

```text
                 Merchant Data
                      ↓
              Data Normalization
                      ↓
          Transaction Correlation Layer
                      ↓
          Payment Lifecycle Reconstruction
                      ↓
       ┌──────────────┼──────────────┐
       ↓              ↓              ↓
   Rule Engine     ML Analysis    Anomaly Detection
       └──────────────┼──────────────┘
                      ↓
             Leakage Detection
                      ↓
             Leakage Calculation
                      ↓
           Recovery Probability
                      ↓
             Root Cause Analysis
                      ↓
            Priority Calculation
                      ↓
            AI Investigation Agent
                      ↓
              Merchant Dashboard
                      ↓
            Recommended Actions
```

---

# 8. Product Scope

The MVP will analyse five major leakage categories.

### P0 — Mandatory

1. Payment Failure Leakage
2. Checkout Abandonment
3. Refund Anomalies
4. Settlement Mismatch
5. Subscription Payment Failure

### P1 — Optional

6. Dispute/Chargeback Leakage
7. Merchant-level anomaly detection
8. Automated recovery campaign recommendations

---

# 9. Functional Requirements

## FR-001 — Merchant Data Ingestion

The system shall allow merchant transaction data to be uploaded or connected to the system.

### MVP Input

CSV/JSON files.

### Minimum datasets

* Orders
* Payments
* Refunds
* Settlements
* Subscriptions

### Required common identifiers

* merchant_id
* customer_id
* order_id
* transaction_id
* payment_id
* refund_id
* settlement_id
* subscription_id

---

# 10. FR-002 — Data Normalization

The system shall normalize incoming data into a common internal data model.

It shall:

* Validate required fields.
* Identify duplicate records.
* Normalize timestamps.
* Normalize transaction statuses.
* Normalize monetary values.
* Detect missing identifiers.
* Flag invalid records.

### Acceptance Criteria

Given valid transaction data, the system must create a consistent internal representation without changing the original transaction amount.

---

# 11. FR-003 — Transaction Lifecycle Correlation

The system shall associate related events into a single transaction journey.

Example:

```text
Order ORD001
      ↓
Payment Attempt P001 — Failed
      ↓
Payment Attempt P002 — Failed
      ↓
Payment Attempt P003 — Successful
      ↓
Refund R001 — ₹500
      ↓
Settlement S001 — ₹480
```

The system must understand that the payment was eventually successful.

### Business Rule

A failed payment attempt must **not automatically be classified as revenue leakage** if the corresponding order is subsequently paid successfully.

---

# 12. FR-004 — Checkout Abandonment Detection

The system shall identify orders where:

```text
Order Created
      ↓
Checkout Initiated
      ↓
Payment Not Completed
```

The system shall calculate:

* Number of abandoned checkouts.
* Gross potential revenue.
* Abandonment rate.
* Customer/order segments.
* Payment method distribution.
* Estimated recoverable revenue.

---

# 13. FR-005 — Payment Failure Analysis

The system shall identify payment failures and classify them based on available failure information.

Possible categories:

* Bank decline
* Insufficient funds
* Authentication failure
* Timeout
* Technical failure
* Payment method failure
* Unknown failure

For each category, the system shall calculate:

* Transaction count.
* Failed value.
* Failure rate.
* Historical baseline.
* Potential leakage.
* Recovery probability.

---

# 14. FR-006 — Refund Anomaly Detection

The system shall identify potentially abnormal refunds.

### Required detection scenarios

#### Duplicate Refund

```text
Payment = ₹5,000
Refund 1 = ₹5,000
Refund 2 = ₹5,000
```

Potential leakage:

**₹5,000**

#### Over Refund

```text
Payment = ₹3,000
Refund = ₹4,000
```

Potential leakage:

**₹1,000**

#### Refund Without Successful Payment

```text
Payment = Failed
Refund = ₹5,000
```

Potential leakage:

**₹5,000**

The system shall distinguish legitimate refunds from potentially abnormal refunds.

---

# 15. FR-007 — Settlement Reconciliation

The system shall compare expected settlement against actual settlement.

### Expected Settlement

```text
Successful Payments
- Refunds
- Fees
- Adjustments
- Disputes
= Expected Settlement
```

The system shall compare this against the actual settlement amount.

### Example

```text
Successful payments     ₹10,00,000
Refunds                    -₹50,000
Fees                       -₹20,000
Expected settlement       ₹9,30,000

Actual settlement         ₹9,05,000

Potential discrepancy       ₹25,000
```

The system shall investigate possible reasons before classifying the difference as leakage.

---

# 16. FR-008 — Subscription Failure Detection

The system shall identify failed recurring payments.

For each failed renewal, the system shall determine:

* Subscription value.
* Customer history.
* Previous successful payments.
* Number of retry attempts.
* Failure reason.
* Probability of recovery.
* Expected recoverable revenue.

---

# 17. FR-009 — Leakage Classification

The system shall classify detected leakage into standardized categories.

```text
Payment Leakage
├── Bank failure
├── Technical failure
├── Authentication failure
└── Other

Checkout Leakage
├── Abandonment
├── Timeout
└── Payment method issue

Refund Leakage
├── Duplicate refund
├── Over refund
└── Refund without payment

Settlement Leakage
├── Amount mismatch
├── Missing settlement
└── Unexpected adjustment

Subscription Leakage
├── Renewal failure
├── Repeated failure
└── Customer churn risk
```

---

# 18. FR-010 — Leakage Calculation

The system shall calculate three separate financial measures.

## 1. Potential Leakage

Maximum financial opportunity identified.

## 2. Recoverable Leakage

Estimated amount that can realistically be recovered.

## 3. Confirmed Leakage

High-confidence financial discrepancy supported by evidence.

Example:

```text
Potential leakage:       ₹18.4L
Non-recoverable:          ₹5.2L
Recoverable:             ₹13.2L
High-confidence leakage: ₹9.6L
```

---

# 19. FR-011 — Double-Counting Prevention

The system shall prevent the same financial event from being counted multiple times.

Example:

```text
Order = ₹5,000

Payment attempt 1 = Failed
Payment attempt 2 = Successful
```

The system shall not report ₹5,000 as lost revenue.

Similarly, checkout abandonment and payment failure belonging to the same customer journey should be correlated before calculating leakage.

---

# 20. FR-012 — Recovery Probability

The system shall estimate the probability that a leakage event can be recovered.

The score may consider:

* Historical customer behaviour.
* Failure reason.
* Transaction value.
* Number of previous attempts.
* Payment method.
* Time since failure.
* Merchant recovery history.
* Similar historical transactions.

Example:

```text
Recovery Probability: 82%
Potential value: ₹10,000

Expected recoverable value:
₹8,200
```

---

# 21. FR-013 — Leakage Priority Score

The system shall rank detected issues based on expected business impact.

Recommended model:

```text
Priority Score =
Financial Impact
× Recovery Probability
× Confidence
÷ Intervention Cost
```

The exact weighting can be tuned during implementation.

### Example

| Issue                | Potential | Recovery | Priority |
| -------------------- | --------: | -------: | -------- |
| Bank failures        |     ₹7.2L |      72% | High     |
| Refund anomaly       |     ₹2.3L |      85% | High     |
| Checkout abandonment |     ₹4.1L |      35% | Medium   |

---

# 22. FR-014 — Root Cause Analysis

The system shall identify the probable reason behind significant leakage.

Example:

> Payment leakage increased by 46% this week.

Agent investigation:

> 63% of excess failures originated from Bank X.

> Failure rate increased from 4.1% to 12.8%.

> The increase began at 11:42 AM.

> Similar merchants experienced the same pattern.

### Output

**Likely root cause: Payment infrastructure/bank-side failure.**

The system must show supporting evidence.

---

# 23. FR-015 — AI Investigation Agent

The product shall provide a conversational AI interface.

Users should be able to ask:

> "Why did my revenue drop?"

> "How much money did I lose this week?"

> "What should I fix first?"

> "Show me the biggest payment problem."

> "Why are refunds unusually high?"

> "How much revenue can I recover?"

The agent shall use structured financial data and product tools to answer questions.

---

# 24. AI Agent Tools

The agent should have controlled access to tools such as:

```text
get_transactions()
get_order()
get_payment_attempts()
get_customer_history()
get_refunds()
get_settlements()
get_subscriptions()
get_disputes()
calculate_leakage()
calculate_recovery_probability()
find_anomalies()
compare_periods()
get_root_cause()
get_recommendations()
```

The LLM must not directly invent financial values.

All financial figures must originate from the underlying analytical layer.

---

# 25. FR-016 — Evidence-Based AI Responses

Every major AI finding shall contain:

```text
Finding
+
Financial Impact
+
Evidence
+
Confidence
+
Recommended Action
```

Example:

> **₹4.3L payment leakage identified.**

> **Evidence:** Bank X failure rate increased from 4.1% to 12.8% and accounts for 63% of excess failures.

> **Confidence:** 91%

> **Recommended action:** Investigate alternate routing/payment method for affected transactions.

---

# 26. FR-017 — Merchant Dashboard

The dashboard shall display:

### KPI Cards

* Revenue at Risk
* Potential Leakage
* Recoverable Revenue
* Confirmed Leakage
* Recovery Opportunity

### Leakage Breakdown

```text
Payment
Checkout
Refund
Settlement
Subscription
```

### Priority Actions

The top 3–5 recommended actions.

### Trend

Comparison against:

* Previous day
* Previous week
* Previous month

---

# 27. FR-018 — Leakage Investigation View

Selecting a leakage category shall open a detailed investigation page.

Example:

### Payment Leakage

```text
Total affected transactions: 1,824
Potential value: ₹7.2L
Recoverable value: ₹4.3L
Confidence: 91%

Top contributor:
Bank X

Failure rate:
12.8%

Historical baseline:
4.1%
```

The user must be able to drill down to the underlying transactions.

---

# 28. FR-019 — Recommended Actions

For every high-priority issue, the system shall provide an actionable recommendation.

Examples:

### Payment Failure

> Route eligible transactions through an alternate payment method.

### Subscription Failure

> Initiate recovery workflow for high-probability customers.

### Refund Anomaly

> Investigate duplicate refunds before further processing.

### Settlement Mismatch

> Reconcile affected settlement batch.

### Checkout Abandonment

> Target high-intent abandoned orders with a recovery workflow.

---

# 29. FR-020 — Human Approval

Financial actions shall require explicit user approval.

The system should follow:

```text
Detect
  ↓
Explain
  ↓
Recommend
  ↓
Human Approval
  ↓
Execute
```

The MVP may stop at **Recommend**.

---

# 30. Data Model

Minimum entities:

### Merchant

```text
merchant_id
merchant_name
industry
```

### Customer

```text
customer_id
merchant_id
customer_segment
created_at
```

### Order

```text
order_id
customer_id
amount
currency
created_at
status
```

### Payment

```text
payment_id
order_id
amount
method
provider
status
failure_reason
created_at
```

### Refund

```text
refund_id
payment_id
amount
status
created_at
```

### Settlement

```text
settlement_id
transaction_id
expected_amount
actual_amount
fees
adjustments
created_at
```

### Subscription

```text
subscription_id
customer_id
amount
billing_cycle
renewal_date
status
```

### Dispute

```text
dispute_id
payment_id
amount
reason
status
created_at
```

---

# 31. Business Rules

## BR-001

A failed payment shall not be considered leakage if the associated order is subsequently successfully paid.

## BR-002

Multiple payment attempts belonging to the same order must be correlated.

## BR-003

Refund leakage shall only be reported when there is evidence of an abnormal refund.

## BR-004

Settlement mismatch shall not automatically equal revenue leakage until expected adjustments are considered.

## BR-005

Potential leakage and confirmed leakage must remain separate metrics.

## BR-006

The same transaction must not contribute to multiple leakage categories unless there is evidence of independent leakage events.

## BR-007

AI-generated financial conclusions must be traceable to source transaction data.

## BR-008

Low-confidence findings must be labelled as potential rather than confirmed leakage.

## BR-009

Financial actions must require human approval.

---

# 32. Non-Functional Requirements

## Security

* Sensitive payment information must be masked.
* No raw card information should be stored.
* Role-based access should be supported.
* Data should be encrypted.
* AI actions should be logged.

## Performance

For the buildathon MVP:

* Dataset ingestion should complete within an acceptable interactive timeframe.
* Dashboard should load within a few seconds after analysis.
* AI responses should be streamed where possible.

## Reliability

The system should:

* Handle missing data gracefully.
* Identify insufficient data.
* Avoid fabricated conclusions.
* Show confidence levels.

## Explainability

Every high-impact finding should be explainable using underlying transaction evidence.

---

# 33. AI Architecture Requirements

The system should follow a **hybrid AI architecture**.

### Deterministic layer

Use:

* SQL
* Python
* Business rules
* Statistical calculations

For:

* Reconciliation
* Amount calculations
* Duplicate detection
* Financial metrics

### ML layer

Use ML where appropriate for:

* Anomaly detection
* Recovery probability
* Failure classification
* Behavioural patterns

### LLM layer

Use an LLM for:

* Investigation
* Natural-language reasoning
* Root-cause explanation
* Recommendations
* Conversational interface

### Principle

> **LLM for reasoning and interaction; deterministic systems for money.**

---

# 34. MVP Requirements

For the buildathon, the minimum viable product should support:

### Data

* CSV upload
* Orders
* Payments
* Refunds
* Settlements
* Subscriptions

### Detection

* Payment failures
* Checkout abandonment
* Refund anomalies
* Settlement mismatches
* Subscription failures

### Intelligence

* Leakage calculation
* Recovery probability
* Priority scoring
* Root-cause analysis

### Interface

* Executive dashboard
* Leakage breakdown
* Investigation view
* AI investigator

### Output

The system must answer:

1. **How much revenue is at risk?**
2. **Where is the leakage occurring?**
3. **Why is it happening?**
4. **How much can potentially be recovered?**
5. **What should the merchant fix first?**

---

# 35. MVP Acceptance Criteria

The MVP will be considered successful if:

### AC-001 — Leakage Detection

Given a dataset containing known leakage scenarios, the system identifies the relevant leakage category.

### AC-002 — Financial Accuracy

Calculated leakage values match deterministic expected values within an agreed tolerance.

### AC-003 — Lifecycle Correlation

The system correctly associates multiple payment attempts with the same order.

### AC-004 — Double Counting

Successfully recovered payment attempts are not counted as lost revenue.

### AC-005 — Refund Detection

Duplicate and over-refund scenarios are identified.

### AC-006 — Settlement

Expected and actual settlement amounts can be compared.

### AC-007 — Recovery

The system generates a recovery estimate for eligible leakage events.

### AC-008 — Prioritization

The system produces a ranked list of recommended actions.

### AC-009 — Explainability

Every high-priority finding provides supporting evidence.

### AC-010 — AI Investigation

A merchant can ask a natural-language question and receive an answer based on the underlying dataset.

---

# 36. Success Metrics

The product should be evaluated using both **technical and business metrics**.

## Primary North Star Metric

### Expected Recoverable Revenue Identified

This measures the financial opportunity discovered by the system.

## Secondary Metrics

### Detection Precision

Percentage of identified leakage events that are actually valid.

### Detection Recall

Percentage of known leakage events detected.

### Recovery Estimation Accuracy

Difference between predicted and actual recoverable revenue.

### Investigation Time

Time required to identify the root cause.

Target:

> Reduce manual investigation time significantly.

### Actionability

Percentage of high-priority findings that have an actionable recommendation.

---

# 37. Example End-to-End Scenario

A merchant uploads one month of transaction data.

The system processes:

```text
250,000 orders
310,000 payment attempts
12,000 refunds
18,000 subscription renewals
4,500 settlements
```

The dashboard reports:

> ## ₹18.4L Potential Revenue Leakage

Breakdown:

| Category                 | Potential Leakage | Recoverable |
| ------------------------ | ----------------: | ----------: |
| Payment failures         |             ₹7.2L |       ₹4.3L |
| Checkout abandonment     |             ₹4.1L |       ₹1.2L |
| Subscription failures    |             ₹3.0L |       ₹1.8L |
| Refund anomalies         |             ₹2.3L |       ₹1.5L |
| Settlement discrepancies |             ₹1.8L |       ₹1.6L |

### AI conclusion

> **₹10.4L is estimated to be recoverable.**

### Top recommendation

> **Investigate payment failures associated with Bank X.**

### Reason

> Bank X's failure rate increased from 4.1% to 12.8%, contributing approximately ₹4.3L of potentially recoverable revenue.

### Next recommendation

> **Investigate duplicate refunds worth ₹72K.**

The merchant can drill into the underlying transactions and approve a recovery/investigation workflow.

---

# 38. Product Differentiation

The product should differentiate itself from a normal payment analytics dashboard through four capabilities:

### 1. Lifecycle Intelligence

It understands the entire journey rather than individual transactions.

### 2. Financial Quantification

It converts technical/operational anomalies into **₹ impact**.

### 3. Recovery Intelligence

It distinguishes:

**Potential loss → Recoverable loss → Expected recovery**

### 4. AI Investigation

The merchant can ask:

> **"Why am I losing money?"**

and the system investigates the underlying data rather than simply retrieving dashboard metrics.

---

# 39. Recommended MVP Technology Architecture

```text
                    ┌─────────────────┐
                    │   Web Frontend  │
                    │ React / Next.js │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │    API Layer    │
                    │ FastAPI/Node.js │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
       ┌────────────┐ ┌────────────┐ ┌────────────┐
       │ PostgreSQL │ │ Analytics  │ │ AI Agent   │
       │            │ │ Engine     │ │            │
       └────────────┘ └─────┬──────┘ └─────┬──────┘
                             │              │
                             ▼              ▼
                      Leakage Engine    Tool Layer
                             │              │
                             └──────┬───────┘
                                    ▼
                              AI Insights
```

For the buildathon, this can be simplified substantially.

---

# 40. Product Principle

The most important design principle for the entire product is:

> ### **Every AI finding must answer three questions:**
>
> **How much money is affected?**
> **Why is it happening?**
> **What should the merchant do next?**

If the system cannot answer those three questions, it should not present the event as a high-priority revenue leakage finding.

---

# 41. Final Product Definition

**Revenue Leakage Detective is an AI-powered merchant intelligence system that reconstructs the complete payment lifecycle, detects and quantifies revenue leakage, prevents double-counting, identifies root causes, estimates recoverable revenue, and prioritizes evidence-backed actions based on expected financial impact.**

The product should ultimately move the merchant from:

> **"Something is wrong with my payments."**

to:

> **"₹18.4L is at risk, ₹10.4L is potentially recoverable, Bank X payment failures are the largest contributor, and this is the first action I should take."**

That is the core product experience the buildathon MVP should demonstrate.
