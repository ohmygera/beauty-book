import { User, Clock, Bell, Link, ChevronRight, Shield } from "lucide-react";

interface SettingsRowProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onClick?: () => void;
}

function SettingsRow({ icon, label, value, onClick }: SettingsRowProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 py-3 px-1 hover:bg-accent rounded-xl transition-colors group"
    >
      <div className="w-8 h-8 rounded-xl bg-sage/10 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 text-left">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {value && <p className="text-xs text-muted-foreground mt-0.5">{value}</p>}
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
    </button>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 space-y-1">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2 px-1">
        {title}
      </p>
      {children}
    </div>
  );
}

export function SettingsTab() {
  return (
    <div className="space-y-5">
      {/* Profile summary */}
      <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-sage/20 flex items-center justify-center flex-shrink-0">
          <User className="w-6 h-6 text-sage" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-foreground">Master Name</p>
          <p className="text-sm text-muted-foreground">master@example.com</p>
          <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-semibold text-sage bg-sage/10 px-2 py-0.5 rounded-full">
            <Shield className="w-2.5 h-2.5" /> Active
          </span>
        </div>
        <button className="text-xs font-medium text-sage hover:underline">Edit</button>
      </div>

      {/* Settings sections */}
      <SectionCard title="Profile">
        <SettingsRow
          icon={<User className="w-4 h-4 text-sage" />}
          label="Display name & bio"
          value="Update how clients see you"
        />
        <SettingsRow
          icon={<Link className="w-4 h-4 text-sage" />}
          label="Booking page URL"
          value="aurabook.app/b/mastername"
        />
      </SectionCard>

      <SectionCard title="Scheduling">
        <SettingsRow
          icon={<Clock className="w-4 h-4 text-sage" />}
          label="Working hours"
          value="Mon–Sat · 09:00 – 19:00"
        />
        <SettingsRow
          icon={<Clock className="w-4 h-4 text-sage" />}
          label="Buffer time"
          value="15 minutes between appointments"
        />
        <SettingsRow
          icon={<Bell className="w-4 h-4 text-sage" />}
          label="Advance notice"
          value="2 hours minimum"
        />
      </SectionCard>

      <SectionCard title="Notifications">
        <SettingsRow
          icon={<Bell className="w-4 h-4 text-sage" />}
          label="New booking alerts"
          value="Email + push"
        />
      </SectionCard>
    </div>
  );
}