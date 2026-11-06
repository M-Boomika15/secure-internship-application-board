# Security Checklist

## Implemented in this project

- [x] Helmet middleware adds common HTTP security headers.
- [x] API requests are rate-limited to 100 requests per 15-minute window per client by default.
- [x] JSON request body size is limited to 10 KB.
- [x] SQL statements that use applicant input are parameterized.
- [x] Server validates internship ID, name, email, phone number and resume URL.
- [x] Resume URLs are restricted to HTTP and HTTPS protocols.
- [x] Frontend displays database text using `textContent` and DOM methods rather than injecting it as HTML.
- [x] `.gitignore` excludes dependencies, local database files and environment files.

## Before using with real applicants

- [ ] Add administrator authentication and authorization before creating any admin-only features.
- [ ] Use HTTPS in production.
- [ ] Add a privacy notice and a data-retention/deletion process for applicant information.
- [ ] Restrict access to applicant records; do not expose them through a public endpoint.
- [ ] Configure rate limits and logging for the production hosting environment.
- [ ] Store secrets in the hosting provider's environment settings, never in source control.
- [ ] Back up and protect the SQLite database, or use a managed production database.
- [ ] Review legal requirements applicable to collecting personal information.

## Scope

This is an educational starter project. The public API only creates applications and lists internship opportunities; it does not provide an endpoint to read personal application records.
