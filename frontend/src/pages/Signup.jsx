import { Link, useNavigate } from "react-router-dom";
import { Rocket } from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();
  return (
    <div className="grid min-h-screen place-items-center bg-muted/40 px-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-white p-8 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground"><Rocket className="h-4 w-4" /></span>
          <span className="font-semibold tracking-tight">Launchpad</span>
        </div>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">Create your account</h1>
        <p className="mt-1 text-sm text-muted-foreground">Free for all VIT students.</p>

        <form onSubmit={(e) => { e.preventDefault(); navigate("/onboarding"); }} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Full name</label>
            <input required className="mt-1.5 w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none ring-primary/30 focus:ring-2" />
          </div>
          <div>
            <label className="text-sm font-medium">VIT email</label>
            <input type="email" required placeholder="you@vitstudent.ac.in" className="mt-1.5 w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none ring-primary/30 focus:ring-2" />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <input type="password" required className="mt-1.5 w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none ring-primary/30 focus:ring-2" />
          </div>
          <button className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-700">Create account</button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have one? <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
