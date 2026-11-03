# StudentGuard: Project Specification

This file is the single source of truth for the StudentGuard documentation website and, later, the application. Do not invent facts, numbers or claims that are not in this file. If something is missing, write "To be decided" and list it under Open Questions.

---

## 0. Instructions for the AI assistant (Copilot)

**Goal:** Build a static documentation website for StudentGuard using plain HTML, CSS and vanilla JavaScript (no frameworks, no npm, no external CDN). It is hosted on Netlify from a GitHub repo.

**Existing project structure (already in the workspace):**

```
index.html
css/style.css          (CSS variables, light and dark theme)
js/main.js             (builds sidebar from NAV array, theme toggle, mobile menu, previous/next links)
01-overview/problem-statement.html
01-overview/solution.html
01-overview/key-features.html
```

**Rules**

1. Do not change the existing design, class names or CSS variables. Reuse the classes: `doc`, `lead`, `tbl`, `note`, `pill high`, `pill medium`, `pill low`.
2. Every page needs `<body data-page="unique-id">`, `<main class="doc" id="content">`, and the script tag at the end with `data-root="../"` for pages inside a folder and `data-root=""` for `index.html`.
3. Add every new page to the `NAV` array in `js/main.js` (id, label, href). Use relative paths only.
4. Write in clear English with short paragraphs. Use tables where they help.
5. Build ONE section at a time. After each section, list the files created or changed, check for broken links, and wait for confirmation before the next section.
6. Wrap wide tables in `<div class="tbl">`.

**Sections to build, in order** (content for each is in this file)

| Section | Pages | Content source |
|---|---|---|
| 02-users-roles | super-admin, admin, teacher, student | Part 3 |
| 03-system-design | architecture, database-schema, csv-format | Parts 5, 6, 7 |
| 04-ml-model | data-and-features, training-evaluation, explainability | Part 8 |
| 05-api | endpoints, authentication | Part 9 |
| 06-deployment | hosting, backup-and-uptime | Part 10 |
| 07-business | market-and-competitors, pricing-and-sales, faq | Part 11 |

---

## 1. Product overview

**Name:** StudentGuard (placeholder name, can be changed)

**One-line description:** An add-on early-warning layer for college ERPs that tells teachers which students need academic support, why, and what to do next, before exam results arrive.

**Problem ID:** AI-03, Student Performance Prediction (Track T1)

**Problem statement:** Students may not recognise declining academic performance until examinations.

**Task:** Use sample attendance, internal marks and assignment scores to identify students who may need academic support.

**Expected output**

- A risk level for every student: High, Medium or Low
- A teacher dashboard listing at-risk students
- An early warning before exams, not after results

---

## 2. Why this is needed

| Today | Gap |
|---|---|
| College ERP stores attendance, marks, assignments and fees | It records data but does not warn when performance falls |
| Faculty report marks after internals | The warning arrives after the result, when it is too late to change it |
| Each faculty member sees one subject | Nobody sees the combined pattern across subjects |
| Students see numbers only | They do not know their risk or what to improve |

**Existing platforms (for context):** Some vendors advertise early-warning or dropout analytics, for example Creatrix Campus, Digiicampus, MasterSoft SIS and Camu. StudentGuard does not claim to be the first. Its position is a lightweight, explainable add-on that works with the ERP a college already has.

**Differentiators**

1. Add-on layer, not a replacement for the ERP
2. Explainable: shows why a student is at risk
3. Trend-based: detects falling marks before the next result
4. Student-facing view, not only teacher-facing
5. Intervention tracking: teachers log support and see whether risk reduced
6. Lightweight: needs only attendance, marks and assignment data
7. Privacy-first: data belongs to the institute

---

## 3. User roles and permissions

| Role | Purpose |
|---|---|
| Super Admin | Platform owner. Manages institutes and admins |
| Admin | Institute or department head. Manages users and data |
| Teacher | Enters data, reviews at-risk students, records support given |
| Student | Views own performance, risk and suggestions |
| Parent (future) | Read-only view of own child's report |

**Permissions**

| Action | Super Admin | Admin | Teacher | Student |
|---|---|---|---|---|
| Add or remove institutes | Yes | No | No | No |
| Create admins | Yes | No | No | No |
| System-wide analytics, model settings | Yes | No | No | No |
| Add teachers and students | No | Yes | No | No |
| Bulk upload users by CSV | No | Yes | No | No |
| Manage classes and subjects | No | Yes | No | No |
| Department-wise reports and export | No | Yes | Own class only | No |
| Enter or upload attendance, marks, assignments | No | Yes | Own classes | No |
| View at-risk list | No | Yes | Own classes | No |
| View student detail and trend graph | No | Yes | Own classes | Own data only |
| Log interventions and remarks | No | No | Yes | No |
| View own risk, reasons and suggestions | No | No | No | Yes |

**MVP note:** Super Admin and Admin may be merged in the first version.

**Pages per role**

- Common: Login, Forgot password
- Teacher: Dashboard, At-risk list, Student detail, Data entry and CSV upload, Intervention log
- Student: My performance, My risk status, Suggestions
- Admin: User management, CSV bulk import, Department analytics, Reports export
- Super Admin: Institute management, Admin management, System analytics

---

## 4. Features by priority

**Level 1: Essential**

- Role-based login with a separate dashboard per role
- CSV upload and manual entry form
- Risk level (High, Medium, Low), risk score and marks trend
- Teacher dashboard: risk counts, at-risk list with filters (class, subject, risk), student detail page
- Student dashboard: own attendance, marks trend, risk status

**Level 2: Differentiators**

- Explainable reasons per prediction, for example "attendance 58%, marks fell in the last 3 tests, 4 assignments pending"
- Suggested actions with each risk level
- Intervention log with outcome tracking
- Early warning banner before exams
- Teacher remarks

**Level 3: Future scope**

- PDF or Excel report export
- Parent view
- WhatsApp or SMS alerts
- Hindi and Hinglish interface
- Direct ERP integration through an API
- Mobile app

---

## 5. System architecture

Data flow, left to right:

```
College ERP export or CSV upload
  -> Validation and cleaning
  -> Feature engineering
  -> ML model (risk score)
  -> Explanation (SHAP reasons) and suggested actions
  -> Database
  -> Backend API (authentication, role-based access)
  -> Dashboards (Teacher, Student, Admin)
```

**Technology stack**

| Layer | Choice |
|---|---|
| ML and backend language | Python |
| ML libraries | Pandas, NumPy, Scikit-learn, SHAP, Matplotlib |
| Backend framework | FastAPI |
| Authentication | JWT with role-based access control |
| Database | SQLite for the prototype, PostgreSQL for production |
| Frontend | React with Tailwind CSS, or Streamlit if time is short |
| Charts | Recharts or Plotly |
| Version control | Git and GitHub |
| Hosting | Render or Railway (backend), Vercel or Netlify (frontend), Netlify (this docs site) |

---

## 6. Database schema

| Table | Columns |
|---|---|
| users | id, name, email, password_hash, role, institute_id |
| institutes | id, name |
| students | id, user_id, roll_no, class, department, institute_id |
| subjects | id, name, class, teacher_id |
| attendance | id, student_id, subject_id, date, status |
| marks | id, student_id, subject_id, test_name, score, max_score, date |
| assignments | id, student_id, subject_id, title, submitted, score, max_score, due_date |
| predictions | id, student_id, risk_score, risk_level, top_reasons, created_at |
| interventions | id, student_id, teacher_id, action, notes, date, outcome |

---

## 7. CSV format

CSV is the bridge between the college ERP and StudentGuard. The ERP exports data, the teacher or admin uploads it.

**Sample**

```
student_id,name,attendance_pct,internal_1,internal_2,internal_3,assignments_submitted,assignments_total
101,Rahul,58,32,28,24,3,8
102,Priya,92,41,44,46,8,8
103,Aman,75,35,33,30,5,8
```

**Upload behaviour**

1. Provide a downloadable CSV template
2. Validate required columns and data types
3. Show clear row-level errors, for example "Row 5: attendance_pct is missing"
4. Compute features, run the model, show results on the dashboard

---

## 8. ML model specification

**Features**

- Attendance percentage
- Average internal marks
- Marks trend (slope across tests: improving or declining)
- Change from the previous test
- Assignment submission rate
- Assignment average score

**Label:** at-risk or not at-risk. Example definition: final result below a pass threshold. The threshold is set per institute.

**Models:** Start with Logistic Regression, compare with Random Forest. Keep the chosen model explainable.

**Risk levels:** Convert the risk probability into High, Medium and Low using thresholds. Example starting point: High above 0.70, Medium 0.40 to 0.70, Low below 0.40. Tune using validation data.

**Evaluation**

- Primary metric: Recall for the at-risk class, because missing an at-risk student is the costliest error
- Also report Precision, F1 and the confusion matrix

**Explainability:** Use SHAP to list the top factors behind each prediction, shown in plain language.

**Data rules**

- Avoid data leakage: never use the final result as a feature
- Check fairness across groups
- Do not use caste, gender, religion or family background as features
- The model supports teacher decisions and never makes the final decision

**Data for development:** Generate a synthetic dataset (500 to 1000 rows) or use the UCI Student Performance dataset. State clearly which one is used.

---

## 9. API endpoints (planned)

| Method | Endpoint | Purpose | Roles |
|---|---|---|---|
| POST | /auth/login | Login, returns JWT | All |
| POST | /students/upload-csv | Upload attendance, marks, assignments | Admin, Teacher |
| GET | /students | List students | Admin, Teacher |
| GET | /students/{id} | Student detail | Admin, Teacher, Student (own) |
| POST | /predict/{student_id} | Run prediction | Admin, Teacher |
| GET | /at-risk | At-risk list with filters | Admin, Teacher |
| POST | /interventions | Log an intervention | Teacher |
| GET | /reports/export | Export report | Admin |

---

## 10. Deployment and reliability

- Prototype: free cloud tiers. Free tiers can have limits such as sleeping servers, so test the live link before any demo and keep a local backup
- Production options: managed cloud hosting by the StudentGuard team, or on-premise installation on the college's own server for institutes that do not allow data to leave
- Daily automatic database backups
- Uptime monitoring with alerts
- StudentGuard is separate from the ERP, so if it is briefly unavailable the college's ERP and exams are not affected
- Any uptime figure promised in an agreement must be one the team can realistically meet

---

## 11. Business

**Customers:** Private colleges, coaching centres, schools (classes 9 to 12), universities (longer sales cycle). Start with small private colleges and coaching centres.

**Value proposition:** The ERP already holds the data but does not warn. StudentGuard warns before exams, explains why, and suggests what to do.

**Sales approach**

1. Demo with dummy data
2. Free pilot with one class or department
3. Show results from the pilot
4. Offer a paid plan
5. Turn pilot results into a case study

**Pricing options (to be decided):** per student per year, flat yearly plan by institute size, free pilot followed by paid plan, setup fee plus yearly fee.

**FAQ**

| Question | Answer |
|---|---|
| We already have an ERP. Why this? | The ERP stores data but does not warn. StudentGuard is an add-on. Export a CSV and it gives risk levels. |
| Faculty already tell us who failed. | They report after results. StudentGuard flags risk before results and looks across all subjects together. |
| How accurate is it? | No model is 100% accurate. It focuses on Recall so at-risk students are not missed, and accuracy is measured on the institute's own data during the pilot. |
| Is student data safe? | Data belongs only to the institute, access is role-based, and on-premise installation is available. |
| Who provides the server and database? | StudentGuard hosts them. On-premise is available on request. |
| What if the server goes down? | Data is backed up, the ERP and exams are not affected, and the team recovers the service quickly. |
| What if a prediction is wrong? | The teacher makes the final decision. The system only provides a priority list with reasons. |
| Could it be biased? | Fairness is checked, and only attendance, marks and assignment data are used as inputs. |
| Our teachers are not technical. | The dashboard is a simple colour-coded list with a reason one click away. |

---

## 12. Open questions

- Final product name
- Final pricing model
- Exact label definition (pass mark) and risk thresholds
- Frontend choice (React or Streamlit)
- Whether Super Admin and Admin are merged in version 1
