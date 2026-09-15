# Schema Architecture & Data Model Technical Report

**Target Audience:** AI Coding Agents, Backend Engineers, and External Service Developers  
**Database:** PostgreSQL 14+ (`DATABASE2_URL`)  
**Active Schema:** `checkin_app`  
**Read-Only Cross-Schema Reference:** `public.users`, `public.teams`

---

## 1. Executive Architecture Overview

All application state for the Event Management & Check-in System lives inside a dedicated PostgreSQL schema named **`checkin_app`** on the primary unified database (`DATABASE2_URL`). 

### Key Architectural Boundaries:
- **`checkin_app` Schema:** Contains all 10 core tables owned and mutated by the backend API.
- **`public` Schema:** Contains teammate-owned tables (`public.users`, `public.teams`). The application **NEVER writes** to `public.users` or `public.teams`; it performs `SELECT` queries or cross-schema `JOIN` operations on `lower(email) = lower(external_ref)`.
- **Search Path:** Every database client connection configures `SET search_path = checkin_app, public;`. Unqualified table references resolve to `checkin_app`, while `public.users` remains accessible.

---

## 2. Table-by-Table Technical Reference

```
                             +-------------------+
                             | checkin_app.events|
                             +---------+---------+
                                       |
                   +-------------------+-------------------+
                   | 1:N                                   | 1:N
         +---------v---------+                   +---------v---------+
         |   participants    |                   |     scanners      |
         +----+---------+----+                   +----+---------+----+
              |         |                             |         |
          1:1 |     1:N |                         1:N |     1:N |
   +----------v-+     +-v----------+             +----v-+     +-v----------+
   |  details   |     |   tokens   |             |check_ins|  | scan_logs  |
   +------------+     +------------+             +------+--+  +------------+
                            |                           ^
                        1:1 | (mapped)                  | 1:1
                      +-----v-----------+               |
                      | email_token_map |---------------+ (participant_id)
                      +-----------------+
```

---

### 2.1 `checkin_app.admins`
Stores administrator accounts authorized to manage events, participants, scanners, and QR exports.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Internal unique admin ID |
| `username` | `TEXT` | `NOT NULL`, `UNIQUE` | Case-sensitive admin login username |
| `password_hash` | `TEXT` | `NOT NULL` | Bcrypt password hash |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT now()` | Account creation timestamp |

---

### 2.2 `checkin_app.events`
Top-level entity for organizing event instances (e.g. hackathons, conferences).

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Unique event ID |
| `name` | `TEXT` | `NOT NULL` | Human-readable event title |
| `event_date` | `DATE` | `NOT NULL` | Scheduled date of the event |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT now()` | Event record creation timestamp |

---

### 2.3 `checkin_app.participants`
Tracks participant registrations for a specific event.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Unique internal participant ID |
| `event_id` | `UUID` | `NOT NULL`, `FK -> events(id)` | Event assignment |
| `external_ref` | `TEXT` | `NOT NULL` | Participant email (matches `public.users.email`) |
| `status` | `TEXT` | `NOT NULL`, `DEFAULT 'REGISTERED'`, `CHECK IN ('REGISTERED', 'QR_GENERATED', 'CHECKED_IN', 'REVOKED')` | Lifecycle status |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT now()` | Registration timestamp |

> **Constraint:** `UNIQUE (event_id, external_ref)` ensures a participant cannot be registered twice for the same event.

---

### 2.4 `checkin_app.participant_details`
Loose/deferred JSONB storage for custom event registration fields (e.g. t-shirt size, dietary needs).

| Column | Type | Constraints | Description |
|---|---|---|---|
| `participant_ref` | `TEXT` | `PRIMARY KEY` | Matches `participants.external_ref` |
| `event_id` | `UUID` | `NOT NULL`, `FK -> events(id)` | Event scope |
| `details` | `JSONB` | `NOT NULL` | Key-value dictionary of custom fields |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT now()` | Last update timestamp |

---

### 2.5 `checkin_app.tokens`
Stores SHA-256 hashed QR tokens for active and historic participant tokens.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Token record ID |
| `participant_id` | `UUID` | `NOT NULL`, `FK -> participants(id)` | Assigned participant |
| `token_hash` | `CHAR(64)` | `NOT NULL`, `UNIQUE` | SHA-256 hex hash of the raw token |
| `version` | `INT` | `NOT NULL`, `DEFAULT 1` | Incremental version number |
| `is_active` | `BOOLEAN` | `NOT NULL`, `DEFAULT TRUE` | Active state flag |
| `qr_image` | `TEXT` | `NULLABLE` | Cached base64 Data URL PNG image |
| `issued_at` | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT now()` | Token issuance timestamp |
| `revoked_at` | `TIMESTAMPTZ` | `NULLABLE` | Revocation timestamp |

> **Critical Partial Index:** `CREATE UNIQUE INDEX one_active_token_per_participant ON checkin_app.tokens (participant_id) WHERE is_active;`  
> Enforces that a participant can have at most **ONE active token** at any given moment.

---

### 2.6 `checkin_app.email_token_map`
**Primary Integration Table for External Servers.** Stores raw tokens mapped by lowercased email.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `email` | `VARCHAR` | `PRIMARY KEY` | Lowercased email (matches `public.users.email`) |
| `token` | `VARCHAR` | `NOT NULL` | **Raw token string** (un-hashed) |
| `participant_id` | `UUID` | `NOT NULL` | Linked `participants.id` |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT now()` | Last updated timestamp |

> **Security & Usage Rules for External Servers:**
> 1. The external server reads the **raw `token` string** directly from `email_token_map`.
> 2. The external server passes this raw string to its QR generator to render the QR image on the user's screen.
> 3. The external server does **not** hash the token. Our backend API performs SHA-256 hashing during the scan validation process.

---

### 2.7 `checkin_app.scanners`
Scanner devices/workstations registered by admins to check in participants.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Scanner device ID |
| `event_id` | `UUID` | `NOT NULL`, `FK -> events(id)` | Assigned event |
| `label` | `TEXT` | `NOT NULL` | Device label (e.g., "Gate 1 North") |
| `credential_hash` | `TEXT` | `NOT NULL` | Bcrypt hash of device secret credential |
| `is_active` | `BOOLEAN` | `NOT NULL`, `DEFAULT TRUE` | Active scanner flag |
| `created_by` | `UUID` | `NOT NULL`, `FK -> admins(id)` | Creator admin ID |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT now()` | Registration timestamp |
| `revoked_at` | `TIMESTAMPTZ` | `NULLABLE` | Revocation timestamp |

> **Constraint:** `UNIQUE (event_id, label)` ensures unique scanner labels per event.

---

### 2.8 `checkin_app.check_ins`
**Sole Authority for Check-in Uniqueness.** Ensures a participant can only be checked in once.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Check-in record ID |
| `participant_id` | `UUID` | `NOT NULL`, `FK -> participants(id)`, `UNIQUE` | Checked-in participant |
| `scanner_id` | `UUID` | `NOT NULL`, `FK -> scanners(id)` | Scanner device that performed scan |
| `checked_in_at` | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT now()` | Check-in timestamp |

> **Concurrency Protection:** The `UNIQUE (participant_id)` constraint guarantees that even if 50 scanners scan the same QR code simultaneously across multiple API nodes, PostgreSQL's row-level lock enforces exactly **1 SUCCESS** insert, while the remaining 49 fail with a unique violation (caught and logged as `DUPLICATE`).

---

### 2.9 `checkin_app.scan_logs`
Immutable audit history of all scan attempts.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Log entry ID |
| `scanner_id` | `UUID` | `NOT NULL`, `FK -> scanners(id)` | Scanner device |
| `participant_id` | `UUID` | `NULLABLE`, `FK -> participants(id)` | Identified participant (if token valid) |
| `token_hash_attempted` | `CHAR(64)` | `NULLABLE` | SHA-256 hash of scanned QR code |
| `result_status` | `TEXT` | `NOT NULL`, `CHECK IN ('SUCCESS', 'DUPLICATE', 'INVALID_TOKEN', 'REVOKED_TOKEN', 'SCANNER_INACTIVE', 'ERROR')` | Scan outcome |
| `server_time` | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT now()` | Server processing timestamp |
| `client_time` | `TIMESTAMPTZ` | `NULLABLE` | Client-reported scan timestamp |
| `request_id` | `UUID` | `NULLABLE` | Idempotency request UUID |
| `meta` | `JSONB` | `NULLABLE` | Diagnostic/request metadata |

> **Constraint:** `UNIQUE (scanner_id, request_id)` prevents duplicate log writes on client network retries.

---

### 2.10 `checkin_app.audit_log`
Tracks administrative mutations for compliance and accountability.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Audit record ID |
| `admin_id` | `UUID` | `NOT NULL`, `FK -> admins(id)` | Performing admin |
| `action` | `TEXT` | `NOT NULL` | Action code (`GENERATE_QR`, `REGENERATE_TOKEN`, etc.) |
| `target_table` | `TEXT` | `NOT NULL` | Affected table name |
| `target_id` | `UUID` | `NOT NULL` | Affected entity ID |
| `before_data` | `JSONB` | `NULLABLE` | JSON snapshot before mutation |
| `after_data` | `JSONB` | `NULLABLE` | JSON snapshot after mutation |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT now()` | Audit entry timestamp |

---

## 3. Real-Time WebSocket Notification Trigger

PostgreSQL handles dashboard WebSocket fan-out using `LISTEN/NOTIFY`:

```sql
CREATE OR REPLACE FUNCTION checkin_app.notify_check_in() RETURNS trigger AS $$
BEGIN
    IF NEW.result_status IN ('SUCCESS', 'DUPLICATE') THEN
        PERFORM pg_notify('check_in_events', json_build_object(
            'event', 'CHECK_IN',
            'result_status', NEW.result_status,
            'scanner_id', NEW.scanner_id,
            'participant_id', NEW.participant_id,
            'checked_in_at', NEW.server_time
        )::text);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER scan_log_check_in_notify
AFTER INSERT ON checkin_app.scan_logs
FOR EACH ROW EXECUTE FUNCTION checkin_app.notify_check_in();
```

---

## 4. Role-Based Database Permissions

To protect data boundaries, two database roles are configured:

### 1. Application Role (`resonance-checkin-api`)
- Full `USAGE` on schema `checkin_app`.
- Full `SELECT`, `INSERT`, `UPDATE`, `DELETE` privileges on all `checkin_app.*` tables.
- `SELECT` privilege on `public.users` and `public.teams`.

### 2. External Server Least-Privilege Role (`external_token_reader`)
Used by external servers to read raw QR tokens:
```sql
CREATE ROLE external_token_reader WITH LOGIN PASSWORD 'strong_password_here';
GRANT USAGE ON SCHEMA checkin_app TO external_token_reader;
GRANT SELECT ON checkin_app.email_token_map TO external_token_reader;
```
> This role **cannot** view `admins`, `scanners`, `check_ins`, or `scan_logs`, and cannot mutate any data.

---

## 5. Instructions for Incoming AI Coding Agents

When working on this codebase, adhere strictly to the following conventions:

1. **Schema Scope:** Always set `search_path = checkin_app, public;` on new client connections. Never place new application tables into `public`.
2. **Teammate Data Policy:** Never issue `INSERT`, `UPDATE`, or `DELETE` statements against `public.users` or `public.teams`.
3. **Scan Validation Authority:** Always validate scans by computing `SHA256(scanned_raw_token)` and querying `tokens.token_hash`. Do not store raw tokens in `tokens`.
4. **`email_token_map` Synchronization:** Whenever issuing or regenerating a token in `admin.ts`, perform an upsert into `checkin_app.email_token_map` within the same SQL transaction.
5. **No Destructive Migrations:** Never execute `DROP TABLE`, `TRUNCATE`, or destructive column drops.
