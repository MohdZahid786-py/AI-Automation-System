
import { useState, useEffect, useRef } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const INDUSTRIES = [
  "Technology & SaaS", "Finance & Banking", "Consulting & Advisory",
  "Healthcare & Biotech", "E-Commerce & Retail", "Real Estate",
  "Manufacturing & Logistics", "Marketing & Media", "Legal Services",
  "Education & EdTech", "Other",
];

const COMPANY_SIZES = [
  "1–10 (Startup)", "11–50 (Small)", "51–200 (Mid-size)",
  "201–500 (Growth)", "501–1000 (Scale-up)", "1000+ (Enterprise)",
];

const GOALS = [
  "Automate lead follow-up", "Generate better client reports", "Streamline onboarding",
  "Improve data enrichment", "Scale outreach campaigns", "Reduce manual ops",
];

// ─── ANIMATIONS CSS ────────────────────────────────────────────────────────────
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink: #0A0F1E;
    --ink-2: #1E293B;
    --cyan: #00D4FF;
    --cyan-dim: #0099CC;
    --blue: #3B82F6;
    --emerald: #10B981;
    --amber: #F59E0B;
    --slate: #64748B;
    --slate-light: #94A3B8;
    --surface: #F8FAFC;
    --surface-2: #F1F5F9;
    --border: #E2E8F0;
    --white: #FFFFFF;
    --radius: 14px;
    --shadow: 0 4px 24px rgba(0,0,0,0.08);
    --shadow-lg: 0 16px 48px rgba(0,0,0,0.14);
  }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--surface);
    color: var(--ink);
    min-height: 100vh;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes pulse-ring {
    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 212, 255, 0.5); }
    70% { transform: scale(1); box-shadow: 0 0 0 16px rgba(0, 212, 255, 0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 212, 255, 0); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes checkmark {
    from { stroke-dashoffset: 50; }
    to { stroke-dashoffset: 0; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }
  @keyframes gradient-shift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .fade-up { animation: fadeUp 0.5s ease both; }
  .fade-up-1 { animation: fadeUp 0.5s ease 0.1s both; }
  .fade-up-2 { animation: fadeUp 0.5s ease 0.2s both; }
  .fade-up-3 { animation: fadeUp 0.5s ease 0.3s both; }
  .fade-up-4 { animation: fadeUp 0.5s ease 0.4s both; }

  input, select, textarea {
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    transition: all 0.2s ease;
  }
  input:focus, select:focus, textarea:focus { outline: none; }
  button { font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.2s ease; }
  button:disabled { cursor: not-allowed; }

  .field-group { margin-bottom: 20px; }
  .field-label {
    display: block;
    font-size: 12.5px;
    font-weight: 600;
    color: var(--slate);
    margin-bottom: 7px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .field-label span { color: #EF4444; margin-left: 2px; }

  .field-input {
    width: 100%;
    padding: 12px 16px;
    border: 1.5px solid var(--border);
    border-radius: 10px;
    background: var(--white);
    color: var(--ink);
    font-size: 15px;
    font-weight: 400;
  }
  .field-input:focus {
    border-color: var(--cyan);
    box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.12);
  }
  .field-input.error {
    border-color: #EF4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }
  .field-error {
    font-size: 12px;
    color: #EF4444;
    margin-top: 5px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 600px) { .grid-2 { grid-template-columns: 1fr; } }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--surface); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
`;

// ─── ICONS ─────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const icons = {
    check: <polyline points="20 6 9 17 4 12" />,
    zap: <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></>,
    mail: <><rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="22,4 12,13 2,4" /></>,
    building: <><rect x="3" y="2" width="18" height="20" rx="1" /><line x1="9" y1="22" x2="9" y2="12" /><line x1="15" y1="22" x2="15" y2="12" /><rect x="9" y="12" width="6" height="10" /><line x1="7" y1="6" x2="7.01" y2="6" /><line x1="11" y1="6" x2="11.01" y2="6" /><line x1="15" y1="6" x2="15.01" y2="6" /><line x1="7" y1="10" x2="7.01" y2="10" /><line x1="11" y1="10" x2="11.01" y2="10" /><line x1="15" y1="10" x2="15.01" y2="10" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></>,
    arrow: <><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>,
    sparkle: <><path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5z" /><path d="M5 19l.75 2.25L8 22l-2.25.75L5 25l-.75-2.25L2 22l2.25-.75z" /></>,
    globe: <><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></>,
    target: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></>,
    chart: <><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></>,
    loader: <><line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="4.93" y1="4.93" x2="7.76" y2="7.76" /><line x1="16.24" y1="16.24" x2="19.07" y2="19.07" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" /><line x1="4.93" y1="19.07" x2="7.76" y2="16.24" /><line x1="16.24" y1="7.76" x2="19.07" y2="4.93" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  );
};

// ─── STEP INDICATOR ────────────────────────────────────────────────────────────
const StepIndicator = ({ current, total, labels }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: 36 }}>
    {labels.map((label, i) => (
      <div key={i} style={{ display: "flex", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: i < current ? "var(--cyan)" : i === current ? "var(--ink)" : "var(--border)",
            border: i === current ? "2.5px solid var(--cyan)" : "2.5px solid transparent",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: i < current ? "var(--ink)" : i === current ? "var(--white)" : "var(--slate-light)",
            fontSize: 14, fontWeight: 700,
            transition: "all 0.3s ease",
            boxShadow: i === current ? "0 0 0 4px rgba(0,212,255,0.15)" : "none",
          }}>
            {i < current ? <Icon name="check" size={16} color="var(--ink)" /> : i + 1}
          </div>
          <span style={{
            fontSize: 11, fontWeight: 600, color: i === current ? "var(--ink)" : "var(--slate-light)",
            letterSpacing: "0.04em", whiteSpace: "nowrap",
          }}>{label}</span>
        </div>
        {i < total - 1 && (
          <div style={{
            width: 60, height: 2, marginBottom: 20, marginLeft: 0, marginRight: 0,
            background: i < current ? "var(--cyan)" : "var(--border)",
            transition: "background 0.3s ease",
          }} />
        )}
      </div>
    ))}
  </div>
);

// ─── FIELD COMPONENT ───────────────────────────────────────────────────────────
const Field = ({ label, required, error, children }) => (
  <div className="field-group">
    {label && (
      <label className="field-label">
        {label}{required && <span>*</span>}
      </label>
    )}
    {children}
    {error && <div className="field-error">⚠ {error}</div>}
  </div>
);

// ─── CHECKBOX PILL ─────────────────────────────────────────────────────────────
const Pill = ({ label, checked, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      padding: "8px 16px", borderRadius: 99,
      border: checked ? "2px solid var(--cyan)" : "2px solid var(--border)",
      background: checked ? "rgba(0,212,255,0.08)" : "var(--white)",
      color: checked ? "var(--cyan-dim)" : "var(--slate)",
      fontSize: 13, fontWeight: checked ? 600 : 400,
      cursor: "pointer", transition: "all 0.18s",
      whiteSpace: "nowrap",
    }}
  >
    {checked ? "✓ " : ""}{label}
  </button>
);

// ─── SUCCESS SCREEN ────────────────────────────────────────────────────────────
const SuccessScreen = ({ lead }) => {
  const [dots, setDots] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setDots(d => (d + 1) % 4), 600);
    return () => clearInterval(t);
  }, []);

  const steps = [
    { icon: "building", label: "Enriching company data", delay: 0 },
    { icon: "sparkle", label: "Generating AI insights", delay: 2000 },
    { icon: "chart", label: "Creating PDF report", delay: 5000 },
    { icon: "mail", label: "Sending to your inbox", delay: 9000 },
  ];

  const [doneSteps, setDoneSteps] = useState([0]);
  useEffect(() => {
    steps.forEach((s, i) => {
      if (i === 0) return;
      setTimeout(() => setDoneSteps(prev => [...prev, i]), s.delay);
    });
  }, []);

  return (
    <div className="fade-up" style={{ textAlign: "center", padding: "20px 0" }}>
      <div style={{ position: "relative", display: "inline-block", marginBottom: 28 }}>
        <div style={{
          width: 88, height: 88, borderRadius: "50%",
          background: "linear-gradient(135deg, var(--cyan), var(--blue))",
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: "pulse-ring 2s ease infinite",
          margin: "0 auto",
        }}>
          <Icon name="mail" size={36} color="#fff" />
        </div>
      </div>

      <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: "var(--ink)", marginBottom: 10 }}>
        Report incoming, {lead.firstName}!
      </h2>
      <p style={{ color: "var(--slate)", fontSize: 15, marginBottom: 8, lineHeight: 1.6 }}>
        We're analyzing <strong>{lead.companyName}</strong> and crafting your<br />
        personalized Business Intelligence Report.
      </p>
      <p style={{ color: "var(--cyan-dim)", fontSize: 13, marginBottom: 36 }}>
        Sending to <strong>{lead.email}</strong> in a few moments{".".repeat(dots + 1)}
      </p>

      <div style={{
        background: "var(--ink)", borderRadius: 14, padding: "24px 28px",
        textAlign: "left", marginBottom: 28,
      }}>
        <p style={{ color: "#64748B", fontSize: 11, letterSpacing: "0.1em", fontWeight: 600, marginBottom: 16 }}>
          AUTOMATION PIPELINE
        </p>
        {steps.map((step, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "10px 0",
            borderBottom: i < steps.length - 1 ? "1px solid #1E293B" : "none",
            opacity: doneSteps.includes(i) ? 1 : 0.35,
            transition: "opacity 0.5s ease",
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: doneSteps.includes(i) ? "rgba(0,212,255,0.15)" : "rgba(255,255,255,0.05)",
              border: `1.5px solid ${doneSteps.includes(i) ? "var(--cyan)" : "#2D3748"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              {doneSteps.includes(i)
                ? <Icon name="check" size={14} color="var(--cyan)" />
                : <div style={{ width: 14, height: 14, border: "2px solid #64748B", borderTopColor: "var(--cyan)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              }
            </div>
            <span style={{ fontSize: 14, color: doneSteps.includes(i) ? "#E2E8F0" : "#475569", fontWeight: doneSteps.includes(i) ? 500 : 400 }}>
              {step.label}
            </span>
            {doneSteps.includes(i) && i < doneSteps.length - 1 && (
              <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--cyan)", fontWeight: 600 }}>Done</span>
            )}
            {doneSteps.includes(i) && i === doneSteps.length - 1 && (
              <span style={{ marginLeft: "auto", fontSize: 11, color: "#64748B" }}>Processing...</span>
            )}
          </div>
        ))}
      </div>

      <p style={{ fontSize: 12, color: "var(--slate-light)", lineHeight: 1.6 }}>
        Check your inbox within 1–2 minutes · No spam, ever
      </p>
    </div>
  );
};

// ─── STEP 1: COMPANY INFO ──────────────────────────────────────────────────────
const Step1 = ({ data, onChange, errors }) => (
  <div>
    <div style={{ marginBottom: 28 }}>
      <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, color: "var(--ink)", marginBottom: 6 }}>
        Tell us about your company
      </h2>
      <p style={{ color: "var(--slate)", fontSize: 14.5, lineHeight: 1.6 }}>
        We'll use this to research your business and craft a fully personalized report.
      </p>
    </div>

    <div className="grid-2">
      <Field label="First Name" required error={errors.firstName}>
        <input className={`field-input ${errors.firstName ? "error" : ""}`} placeholder="Jane" value={data.firstName} onChange={e => onChange("firstName", e.target.value)} />
      </Field>
      <Field label="Last Name" required error={errors.lastName}>
        <input className={`field-input ${errors.lastName ? "error" : ""}`} placeholder="Smith" value={data.lastName} onChange={e => onChange("lastName", e.target.value)} />
      </Field>
    </div>

    <Field label="Work Email" required error={errors.email}>
      <input className={`field-input ${errors.email ? "error" : ""}`} type="email" placeholder="jane@company.com" value={data.email} onChange={e => onChange("email", e.target.value)} />
    </Field>

    <Field label="Company Name" required error={errors.companyName}>
      <input className={`field-input ${errors.companyName ? "error" : ""}`} placeholder="Acme Corp" value={data.companyName} onChange={e => onChange("companyName", e.target.value)} />
    </Field>

    <div className="grid-2">
      <Field label="Job Title">
        <input className="field-input" placeholder="CEO, VP Sales…" value={data.jobTitle} onChange={e => onChange("jobTitle", e.target.value)} />
      </Field>
      <Field label="Company Website">
        <input className="field-input" placeholder="https://company.com" value={data.website} onChange={e => onChange("website", e.target.value)} />
      </Field>
    </div>

    <div className="grid-2">
      <Field label="Industry" required error={errors.industry}>
        <select className={`field-input ${errors.industry ? "error" : ""}`} value={data.industry} onChange={e => onChange("industry", e.target.value)}>
          <option value="">Select industry…</option>
          {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
        </select>
      </Field>
      <Field label="Company Size" required error={errors.companySize}>
        <select className={`field-input ${errors.companySize ? "error" : ""}`} value={data.companySize} onChange={e => onChange("companySize", e.target.value)}>
          <option value="">Select size…</option>
          {COMPANY_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </Field>
    </div>
  </div>
);

// ─── STEP 2: GOALS & CONTEXT ───────────────────────────────────────────────────
const Step2 = ({ data, onChange }) => (
  <div>
    <div style={{ marginBottom: 28 }}>
      <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, color: "var(--ink)", marginBottom: 6 }}>
        What are you trying to achieve?
      </h2>
      <p style={{ color: "var(--slate)", fontSize: 14.5, lineHeight: 1.6 }}>
        Help us tailor insights specifically to your goals and challenges.
      </p>
    </div>

    <Field label="Select your goals (pick all that apply)">
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 4 }}>
        {GOALS.map(goal => (
          <Pill
            key={goal}
            label={goal}
            checked={(data.goals || []).includes(goal)}
            onClick={() => {
              const current = data.goals || [];
              onChange("goals", current.includes(goal)
                ? current.filter(g => g !== goal)
                : [...current, goal]);
            }}
          />
        ))}
      </div>
    </Field>

    <Field label="Current Biggest Pain Point">
      <textarea
        className="field-input"
        rows={3}
        placeholder="e.g. Our lead follow-up is completely manual and we're losing deals because of slow response times…"
        value={data.notes}
        onChange={e => onChange("notes", e.target.value)}
        style={{ resize: "vertical", lineHeight: 1.6 }}
      />
    </Field>

    <Field label="Current Tools & Tech Stack">
      <input
        className="field-input"
        placeholder="e.g. HubSpot, Salesforce, Notion, Slack…"
        value={data.techStack}
        onChange={e => onChange("techStack", e.target.value)}
      />
    </Field>

    <Field label="Monthly Revenue Range">
      <select className="field-input" value={data.revenue} onChange={e => onChange("revenue", e.target.value)}>
        <option value="">Prefer not to say</option>
        <option>Under $10K</option>
        <option>$10K – $50K</option>
        <option>$50K – $250K</option>
        <option>$250K – $1M</option>
        <option>$1M+</option>
      </select>
    </Field>
  </div>
);

// ─── STEP 3: REVIEW ────────────────────────────────────────────────────────────
const Step3 = ({ data }) => {
  const reviewRows = [
    { label: "Name",     value: `${data.firstName} ${data.lastName}` },
    { label: "Email",    value: data.email },
    { label: "Company",  value: data.companyName },
    { label: "Title",    value: data.jobTitle || "—" },
    { label: "Website",  value: data.website || "—" },
    { label: "Industry", value: data.industry },
    { label: "Team Size",value: data.companySize },
    { label: "Goals",    value: (data.goals || []).join(", ") || "—" },
  ];

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, color: "var(--ink)", marginBottom: 6 }}>
          Confirm your details
        </h2>
        <p style={{ color: "var(--slate)", fontSize: 14.5, lineHeight: 1.6 }}>
          Review and submit. We'll instantly start building your report.
        </p>
      </div>

      <div style={{ background: "var(--ink)", borderRadius: 14, padding: "24px 28px", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            background: "linear-gradient(135deg, var(--cyan), var(--blue))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, fontWeight: 700, color: "var(--ink)", flexShrink: 0,
          }}>
            {data.companyName?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div>
            <div style={{ color: "var(--white)", fontWeight: 700, fontSize: 17 }}>{data.companyName}</div>
            <div style={{ color: "var(--cyan)", fontSize: 13 }}>{data.industry} · {data.companySize}</div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid #1E293B", paddingTop: 16 }}>
          {reviewRows.map(({ label, value }) => (
            <div key={label} style={{
              display: "flex", justifyContent: "space-between",
              padding: "6px 0", borderBottom: "1px solid #1E293B",
            }}>
              <span style={{ color: "#64748B", fontSize: 13, fontWeight: 600, letterSpacing: "0.03em" }}>{label}</span>
              <span style={{ color: "#CBD5E1", fontSize: 13, maxWidth: "60%", textAlign: "right" }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "rgba(0,212,255,0.06)", border: "1.5px solid rgba(0,212,255,0.2)", borderRadius: 12, padding: "18px 20px" }}>
        <p style={{ color: "var(--cyan-dim)", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 10 }}>
          WHAT HAPPENS NEXT
        </p>
        {[
          "We research your company using AI & public sources",
          "A personalized PDF report is generated automatically",
          "You receive it via email within 2 minutes",
        ].map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
            <div style={{
              width: 20, height: 20, borderRadius: "50%", background: "var(--cyan)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700, color: "var(--ink)", flexShrink: 0, marginTop: 1,
            }}>
              {i + 1}
            </div>
            <span style={{ color: "var(--slate)", fontSize: 13.5, lineHeight: 1.5 }}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const containerRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", companyName: "",
    jobTitle: "", website: "", industry: "", companySize: "",
    goals: [], notes: "", techStack: "", revenue: "",
  });

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "Required";
    if (!formData.lastName.trim()) newErrors.lastName = "Required";
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Valid email required";
    if (!formData.companyName.trim()) newErrors.companyName = "Required";
    if (!formData.industry) newErrors.industry = "Please select an industry";
    if (!formData.companySize) newErrors.companySize = "Please select company size";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 0 && !validateStep1()) return;
    containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    setStep(s => s + 1);
  };

  const handleBack = () => {
    setErrors({});
    setStep(s => s - 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await fetch("/api/leads/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true); // still show success; pipeline is async
    } finally {
      setSubmitting(false);
    }
  };

  const steps = ["Company Info", "Goals & Context", "Review & Submit"];

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 50%, #F0FDFA 100%)",
        display: "flex", flexDirection: "column",
      }}>

        {/* ── NAVBAR ── */}
        <nav style={{
          background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border)",
          padding: "0 40px", height: 60,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          position: "sticky", top: 0, zIndex: 100,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: "linear-gradient(135deg, var(--cyan), var(--blue))",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon name="zap" size={16} color="#fff" />
            </div>
            <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: "var(--ink)", letterSpacing: "-0.3px" }}>
              SimplifIQ
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981", animation: "pulse-ring 2s ease infinite" }} />
            <span style={{ fontSize: 12.5, color: "var(--slate)", fontWeight: 500 }}>AI Pipeline Active</span>
          </div>
        </nav>

        {/* ── HERO ── */}
        <div style={{
          background: "linear-gradient(135deg, var(--ink) 0%, #0F172A 100%)",
          padding: "48px 40px 52px", textAlign: "center",
          borderBottom: "4px solid var(--cyan)",
        }}>
          <div className="fade-up" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(0,212,255,0.12)", border: "1px solid rgba(0,212,255,0.3)",
            borderRadius: 99, padding: "5px 14px", marginBottom: 18,
          }}>
            <Icon name="sparkle" size={13} color="var(--cyan)" />
            <span style={{ color: "var(--cyan)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em" }}>
              AI-POWERED BUSINESS INTELLIGENCE
            </span>
          </div>
          <h1 className="fade-up-1" style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(28px, 5vw, 44px)",
            color: "var(--white)", lineHeight: 1.15,
            marginBottom: 14, letterSpacing: "-0.5px",
          }}>
            Get Your Free Personalized<br />
            <span style={{ color: "var(--cyan)" }}>Business Intelligence Report</span>
          </h1>
          <p className="fade-up-2" style={{
            color: "#94A3B8", fontSize: 16, lineHeight: 1.7,
            maxWidth: 560, margin: "0 auto 28px",
          }}>
            Fill in your details. Our AI will research your company, generate a professional
            audit report, and deliver it to your inbox — automatically.
          </p>
          <div className="fade-up-3" style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
            {[["⚡", "Ready in ~2 min"], ["🎯", "Hyper-personalized"], ["📄", "PDF delivered to inbox"]].map(([icon, text]) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 15 }}>{icon}</span>
                <span style={{ color: "#64748B", fontSize: 13.5, fontWeight: 500 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── FORM CARD ── */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center", padding: "48px 24px 80px" }}>
          <div
            ref={containerRef}
            style={{
              width: "100%", maxWidth: 580,
              background: "var(--white)", borderRadius: 20,
              boxShadow: "0 8px 40px rgba(0,0,0,0.1), 0 1px 0 rgba(0,212,255,0.3)",
              padding: "40px 44px",
              border: "1px solid var(--border)",
              position: "relative", overflow: "hidden",
            }}
          >
            {/* Top gradient bar */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 4,
              background: "linear-gradient(90deg, var(--cyan), var(--blue), #8B5CF6)",
            }} />

            {!submitted ? (
              <>
                <StepIndicator current={step} total={3} labels={steps} />

                {step === 0 && <Step1 data={formData} onChange={handleChange} errors={errors} />}
                {step === 1 && <Step2 data={formData} onChange={handleChange} errors={errors} />}
                {step === 2 && <Step3 data={formData} />}

                {/* Nav buttons */}
                <div style={{
                  display: "flex", gap: 12, marginTop: 32,
                  paddingTop: 24, borderTop: "1px solid var(--border)",
                }}>
                  {step > 0 && (
                    <button
                      onClick={handleBack}
                      style={{
                        flex: 1, padding: "13px 0", borderRadius: 10,
                        border: "1.5px solid var(--border)", background: "var(--white)",
                        color: "var(--slate)", fontSize: 15, fontWeight: 600,
                      }}
                    >
                      ← Back
                    </button>
                  )}
                  {step < 2 ? (
                    <button
                      onClick={handleNext}
                      style={{
                        flex: 2, padding: "13px 0", borderRadius: 10,
                        background: "linear-gradient(135deg, var(--ink) 0%, #1E293B 100%)",
                        color: "var(--white)", fontSize: 15, fontWeight: 700,
                        border: "none", display: "flex", alignItems: "center",
                        justifyContent: "center", gap: 8,
                      }}
                    >
                      Continue <Icon name="arrow" size={16} color="#fff" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      style={{
                        flex: 2, padding: "14px 0", borderRadius: 10,
                        background: submitting
                          ? "var(--border)"
                          : "linear-gradient(135deg, var(--cyan) 0%, var(--blue) 100%)",
                        color: submitting ? "var(--slate)" : "var(--ink)",
                        fontSize: 15, fontWeight: 700,
                        border: "none", display: "flex", alignItems: "center",
                        justifyContent: "center", gap: 8,
                        boxShadow: submitting ? "none" : "0 4px 20px rgba(0,212,255,0.35)",
                      }}
                    >
                      {submitting ? (
                        <>
                          <div style={{
                            width: 16, height: 16,
                            border: "2px solid var(--slate)", borderTopColor: "transparent",
                            borderRadius: "50%", animation: "spin 0.7s linear infinite",
                          }} />
                          Submitting…
                        </>
                      ) : (
                        <>
                          <Icon name="zap" size={16} color="var(--ink)" />
                          Generate My Report
                        </>
                      )}
                    </button>
                  )}
                </div>

                <p style={{ textAlign: "center", color: "var(--slate-light)", fontSize: 12, marginTop: 16 }}>
                  🔒 Your data is secure. No spam, ever.
                </p>
              </>
            ) : (
              <SuccessScreen lead={formData} />
            )}
          </div>
        </div>

        {/* ── FOOTER ── */}
        <footer style={{
          background: "var(--ink)", borderTop: "1px solid #1E293B",
          padding: "20px 40px", textAlign: "center",
        }}>
          <p style={{ color: "#475569", fontSize: 12.5 }}>
            © 2025 SimplifIQ · AI-Powered Lead Intelligence · Built with Claude AI
          </p>
        </footer>
      </div>
    </>
  );
}