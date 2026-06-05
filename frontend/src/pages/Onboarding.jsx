import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, GraduationCap, Target, Check } from "lucide-react";

const steps = [
  { icon: Mail, title: "Connect Gmail", body: "Grant read-only access so Launchpad can scan opportunity emails." },
  { icon: GraduationCap, title: "Your profile", body: "Tell us your branch, year, and interests for better matches." },
  { icon: Target, title: "Pick categories", body: "Choose what to track: internships, placements, research, hackathons." },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const Active = steps[step].icon;

  return (
    <div className="min-h-screen bg-muted/40 px-6 py-16">
      <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-white p-10 shadow-sm">
        <div className="flex items-center justify-between">
          {steps.map((s, i) => (
            <div key={s.title} className="flex flex-1 items-center gap-2">
              <div className={`grid h-8 w-8 place-items-center rounded-full text-xs font-semibold ${i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              {i < steps.length - 1 && <div className={`h-px flex-1 ${i < step ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary-50 text-primary-700"><Active className="h-6 w-6" /></span>
          <h2 className="mt-5 text-2xl font-semibold tracking-tight">{steps[step].title}</h2>
          <p className="mt-2 text-muted-foreground">{steps[step].body}</p>
        </div>

        <div className="mt-10 flex justify-between">
          <button
            disabled={step === 0}
            onClick={() => setStep((s) => s - 1)}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            Back
          </button>
          <button
            onClick={() => (step === steps.length - 1 ? navigate("/dashboard") : setStep((s) => s + 1))}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-700"
          >
            {step === steps.length - 1 ? "Go to dashboard" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
