# WELLlife Care — Privacy Policy

**Effective date:** May 12, 2026
**Last updated:** May 12, 2026

---

## 1. Who we are

WELLlife Care ("**WELLlife Care**", "**we**", "**us**", "**our**") is a consumer
health-tracking mobile application operated by **Wondfo USA, Inc.** We can be
reached at **appadmin@wondfousa.com** for any question relating to this policy
or your data. Our mailing address is available on request.

For purposes of GDPR and similar regimes, Wondfo USA, Inc. is the **data
controller**. The Service is offered for use in the United States; we have not
designated an EU representative and do not target users in the European
Economic Area.

## 2. What WELLlife Care is — and is not

WELLlife Care helps you **log** rapid-test results, symptoms, temperature, pulse
oximetry (SpO₂), blood pressure, and personal notes; review CDC and other
public-health information; and produce a personal record you can choose to share.

**WELLlife Care is not:**

- a medical device, a diagnostic tool, or a substitute for the **instructions
  for use (IFU)** that accompany any rapid test you take;
- an FDA-cleared or FDA-authorized companion app to any specific rapid test;
- a HIPAA-covered entity or a business associate of any health-care provider
  (see Section 8); and
- a service that determines whether you are infectious, recovered, or fit to
  return to work, school, or any other activity.

Our AI assistant provides general, public-health-style information only and
**does not provide medical advice**.

## 3. Information we collect

### 3.1 Information you give us

| Category | Examples | When collected |
|---|---|---|
| **Account information** | Email address, password (hashed via Firebase Authentication), display name | When you register or update your profile |
| **Profile & family members** | Names, initials, color tags, optional avatar photos | When you add a family member |
| **Self-reported health data** | Symptoms, severity self-rating, temperature, SpO₂, blood pressure, notes, dates | Each time you save a daily log |
| **Rapid-test entries** | The test type you used, the result you entered (positive / negative / invalid), the line appearance you selected, the date | When you log a test |
| **Strip photos (optional)** | A photo you take or upload of your test strip — stored as a personal record only; we do **not** read, scan, analyze, or extract a result from this image | When you choose to add a photo to a daily log |
| **AI assistant chat messages** | The questions you ask and the assistant's replies | When you use the in-app assistant |
| **Support communications** | Messages you send to appadmin@wondfousa.com | When you contact us |

### 3.2 Information collected automatically

| Category | Purpose |
|---|---|
| **Device & technical data** | Approximate device model, OS version, app version, crash reports — to keep the app working and diagnose bugs |
| **Logs** | Authentication events (sign-in success/failure), timestamps of saves — for security and abuse prevention |

We **do not** use third-party advertising trackers, cross-app tracking SDKs,
session-replay tools, or behavioral profiling.

### 3.3 Information we do **not** collect

- Precise geolocation
- Contacts, calendar, microphone, or media library (other than a photo you
  explicitly upload)
- Government identifiers (SSN, driver's-license number, etc.)
- Payment card information (the current version of WELLlife Care does not
  charge users)

## 4. How we use your information

We use the information described above only to:

1. Provide and operate the app (authentication, syncing your logs across
   devices, member switching, AI chat).
2. Generate the personal reports you request.
3. Show public-health context (CDC respiratory-disease guidance, regional
   risk maps) — these features fetch only **publicly available data** from CDC
   endpoints; they do not send your personal data to CDC.
4. Maintain security, prevent abuse, and meet our legal obligations.
5. Communicate essential service messages (e.g., email verification, security
   alerts). We do **not** send marketing email without your separate opt-in.

We **do not** use your health data, photos, chat messages, or any other
information for: advertising, sale to third parties, training third-party AI
models, or profiling.

## 5. Legal basis (GDPR / UK GDPR users)

If you are located in the EEA or UK, we rely on the following Article 6 /
Article 9 grounds:

- **Performance of a contract** (Art. 6(1)(b)) — to provide the app you signed
  up for.
- **Explicit consent** (Art. 9(2)(a)) — to process self-reported health data,
  test results, and photos, which are *special category* data. You may
  withdraw consent at any time (see Section 9).
- **Legitimate interests** (Art. 6(1)(f)) — security, fraud prevention,
  service improvement, where not overridden by your rights.
- **Legal obligation** (Art. 6(1)(c)) — where law requires us to retain or
  disclose specific information.

## 6. Sharing and disclosure

We share information only with the following categories of recipients:

| Recipient | Purpose | Safeguard |
|---|---|---|
| **Google / Firebase** (Firebase Authentication, Cloud Firestore, Cloud Storage) | Hosting, authentication, sync database | Google's Data Processing & Security Terms; data stored in **us-central1** |
| **CDC public APIs** | Read-only public data fetched into your app | No personal data sent; outbound only |
| **Law-enforcement / regulators** | Only in response to a valid legal demand | We provide the minimum required and will notify you unless prohibited |
| **Successor entities** | In the event of a merger, acquisition, or restructuring | Same protections required to continue |

We **do not sell** your personal information. We **do not share** personal
information for cross-context behavioral advertising. We **do not** disclose
your health data to medical providers, employers, schools, or insurers —
sharing reports with anyone is your action, taken outside the app.

## 7. Where data is stored and how it is protected

- Account and synced data: **Google Cloud / Firebase** in **us-central1**.
- Strip photos and locally cached logs: currently stored on your device's
  encrypted application storage (`localStorage` within the app's WebView).
- Transport: all network traffic is encrypted with TLS 1.2+.
- Authentication: passwords are hashed and salted by Firebase; we never see
  your plaintext password.
- Access controls: only a small number of authorized engineers can access
  production data, and only for incident response or your support request.

No system is perfectly secure. If a breach occurs, we will notify affected
users and the U.S. Federal Trade Commission as required by the **FTC Health
Breach Notification Rule** (16 CFR Part 318), and any applicable state
authorities, within the timeframes those rules require (typically within
60 days of discovery).

## 8. HIPAA status

WELLlife Care is a **consumer-facing application**. You install it, you enter
your own data, and you decide whether to export or share any report.
Accordingly, we are **not** a *covered entity* and **not** a *business
associate* as those terms are defined in the federal Health Insurance
Portability and Accountability Act of 1996 ("HIPAA"). HIPAA does **not** apply
to the information you store in this app on your own behalf.

Because HIPAA does not apply, we instead hold ourselves to comparable security
practices and to the consumer-health-data laws described below, but we
**cannot** provide HIPAA-specific protections such as a Notice of Privacy
Practices or a Business Associate Agreement.

## 9. Your rights

You have the right to:

- **Access** a copy of your information.
- **Correct** information that is inaccurate.
- **Delete** your account and the data we hold. Deletion is irreversible.
- **Export** your data in a portable format (JSON or CSV).
- **Withdraw consent** to processing of your health data; this will require
  closing your account because the app cannot function without that data.
- **Object** to certain processing (e.g., for legitimate-interest-based
  processing).
- **Lodge a complaint** with your local data-protection authority (EEA/UK
  users) or your state attorney general (U.S.).

To exercise any right, email **appadmin@wondfousa.com** from the address on
your account. We will respond within 30 days (45 days for U.S. CCPA requests,
extendable to 90 days where allowed).

### 9.1 California residents (CCPA / CPRA)

In the last 12 months we have collected the categories of personal information
listed in Section 3. We do **not** sell or "share" (as defined by CPRA) your
information. California residents also have the right to:

- Know which categories of personal information we have collected and the
  sources and purposes;
- Request correction or deletion;
- Limit the use of "sensitive personal information" (your health data
  qualifies);
- Be free from retaliation for exercising these rights.

We honor the **Global Privacy Control (GPC)** signal as a do-not-sell /
do-not-share request where applicable.

You may also designate an **authorized agent** to make requests on your behalf;
we may verify the request directly with you.

### 9.2 Washington residents (My Health My Data Act)

WELLlife Care collects "consumer health data" as defined by the Washington
**My Health My Data Act** (RCW 19.373). If you are a Washington resident, you
have the right to:

- **Confirm** whether we are processing your consumer health data;
- **Access** that data;
- **Withdraw consent** to its collection or sharing;
- **Delete** it from our systems and require us to instruct our processors
  to do the same.

We will **not** geofence health-care facilities or use precise location data
in any form, in accordance with RCW 19.373.

To submit a request, use **appadmin@wondfousa.com** with the subject line
"WA MHMDA request". You may also appeal an adverse decision by replying to
our response; if we deny the appeal, you may contact the Washington State
Attorney General at [www.atg.wa.gov](https://www.atg.wa.gov).

### 9.3 Other state laws

Residents of Colorado, Connecticut, Texas, Virginia, Utah, Oregon, Montana,
and similar states with comprehensive consumer-privacy statutes have rights
substantially similar to those described above. The same email address
(appadmin@wondfousa.com) is the intake point for all such requests.

## 10. Children

WELLlife Care is **not directed at children under 13**, and we do not
knowingly collect personal information from children under 13. If you are a
parent or guardian and believe your child has provided us with personal
information, contact us and we will delete it. Families using the
"member" feature acknowledge that the account holder is responsible for any
data they choose to log on behalf of a minor in their household; we do not
verify family relationships and store such entries as the account holder's
own data.

## 11. Data retention

- **Account data** — retained until you delete your account.
- **Health logs and test entries** — retained until you delete the relevant
  card or your account.
- **Strip photos** — stored on-device only by default; if you sync to
  Firebase in a future version, the same deletion rules apply.
- **AI chat history** — retained for 12 months, then deleted.
- **Backups** — encrypted backups may persist for up to 35 days beyond
  deletion before being purged.
- **Logs** — security and access logs are retained for up to 12 months.

After deletion you may not be able to recover content; please export first if
you want a copy.

## 12. International transfers

If you access WELLlife Care from outside the United States, your information
will be transferred to and processed in the United States and in any other
country where Google operates Firebase infrastructure. We rely on Standard
Contractual Clauses (Module 2) and supplementary measures for transfers from
the EEA, UK, and Switzerland.

## 13. Changes to this policy

We will update the "Last updated" date at the top of this policy if anything
changes. If the change is material (for example, a new category of recipients
or a new purpose), we will notify you in-app and by email before the change
takes effect, and where required we will obtain your renewed consent.

## 14. Contact

For privacy questions, requests, or breach reports:

- **Email:** appadmin@wondfousa.com
- **Mail:** Wondfo USA, Inc. — mailing address available on request.
