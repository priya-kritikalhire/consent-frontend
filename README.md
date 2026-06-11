# Consent + DSAR + Child Consent Portal Frontend

Standalone Next.js portal UI for the separate request portal. This version calls the same backend endpoint families as the existing backend for DSAR, webforms, and child consent.

## Pages

```text
/login                    Portal login
/dashboard                Summary dashboard
/dsar                     DSAR records
/consents                 Consent records
/child-consents           Child-consent records
/users                    Users and RBAC
/request/dsar             Public DSAR form
/request/consent          Public consent form
/request/child-consent    Public child-consent form
```

## Setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

Default API URL:

```env
NEXT_PUBLIC_PORTAL_API_URL=http://localhost:4100/api
```

## Endpoint usage

```text
/dsar -> GET /dsar
/webforms -> GET /internal-webform-submissions/submissions
/child-consents -> GET /child-consent-submissions
/request/dsar -> POST /dsar
/request/child-consent -> /child-consent-configs + /child-consent-submissions/*
```

## Child consent flow

The public child-consent page calculates age from date of birth:

- Age 18 or above: adult self-consent fields are shown.
- Below 18: parent/guardian consent fields are shown.

After submission, the backend creates a `DATA_PRINCIPAL` login account automatically and returns development credentials when SMTP is disabled.
