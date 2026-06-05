import { Link, useNavigate } from "react-router-dom";
import { Rocket } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  return (
    <div className="grid min-h-screen place-items-center bg-muted/40 px-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-white p-8 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground"><Rocket className="h-4 w-4" /></span>
          <span className="font-semibold tracking-tight">Launchpad</span>
        </div>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign in to continue to your dashboard.</p>

        <form onSubmit={(e) => { e.preventDefault(); navigate("/dashboard"); }} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">VIT email</label>
            <input type="email" required placeholder="you@vitstudent.ac.in" className="mt-1.5 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none ring-primary/30 focus:ring-2" />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <input type="password" required className="mt-1.5 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none ring-primary/30 focus:ring-2" />
          </div>
          <button className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-700">Sign in</button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          New here? <Link to="/signup" className="font-medium text-primary hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
