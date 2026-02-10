import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Activity, Globe, Clock, BarChart3, ArrowRight, Shield, Zap } from "lucide-react";
import { Navbar } from "@/components/Navbar";

const features = [
  {
    icon: Globe,
    title: "Multi-Region Monitoring",
    description: "Check your websites from USA and India simultaneously for global coverage.",
  },
  {
    icon: Clock,
    title: "Response Time Tracking",
    description: "Track response times in milliseconds with detailed charts and trends.",
  },
  {
    icon: BarChart3,
    title: "Visual Analytics",
    description: "Beautiful charts showing uptime history, response times, and regional data.",
  },
  {
    icon: Shield,
    title: "Instant Alerts",
    description: "Know the moment your website goes down with real-time status updates.",
  },
  {
    icon: Zap,
    title: "Fast Checks",
    description: "Automated monitoring runs continuously to catch issues before your users do.",
  },
  {
    icon: Activity,
    title: "Uptime History",
    description: "Full history of every check result, filterable by region and time range.",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(212_100%_48%/0.08),transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:py-32">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs text-muted-foreground">
              <Activity className="h-3 w-3 text-primary" />
              Uptime monitoring made simple
            </div>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
              Monitor your websites.
              <br />
              <span className="text-muted-foreground">Stay ahead of downtime.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
              Track uptime, response times, and availability across multiple regions. 
              Get instant visibility into your infrastructure health.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <Button size="lg" asChild>
                <Link to="/signup">
                  Get Started <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/login">Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Everything you need to stay online
            </h2>
            <p className="mt-3 text-muted-foreground">
              Simple, powerful monitoring for your entire stack.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-lg border border-border bg-background p-6 transition-colors hover:border-muted-foreground/30"
              >
                <f.icon className="mb-3 h-5 w-5 text-primary" />
                <h3 className="mb-1 text-sm font-medium">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="mb-12 text-center text-2xl font-semibold tracking-tight sm:text-3xl">
            Get started in minutes
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { step: "01", title: "Create an account", desc: "Sign up for free in seconds." },
              { step: "02", title: "Add your websites", desc: "Enter the URLs you want to monitor." },
              { step: "03", title: "Track uptime", desc: "View real-time status, charts, and analytics." },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-border text-xs font-mono text-muted-foreground">
                  {s.step}
                </div>
                <h3 className="mb-1 text-sm font-medium">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Activity className="h-3 w-3" />
            BetterUptime
          </div>
          <p className="text-xs text-muted-foreground">© 2026 All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
