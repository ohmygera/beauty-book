import { Calendar, Clock, User, ChevronLeft, ChevronRight } from "lucide-react";

const MOCK_APPOINTMENTS = [
  {
    id: "apt-1",
    client: "Sofia Petrov",
    service: "Signature Facial",
    time: "10:00",
    duration: 60,
    status: "confirmed" as const,
  },
  {
    id: "apt-2",
    client: "Anna Morozova",
    service: "Gel Manicure",
    time: "11:30",
    duration: 45,
    status: "confirmed" as const,
  },
  {
    id: "apt-3",
    client: "Elena Sidorova",
    service: "Brow Lamination",
    time: "14:00",
    duration: 50,
    status: "confirmed" as const,
  },
  {
    id: "apt-4",
    client: "Maria Volkova",
    service: "Signature Facial",
    time: "15:30",
    duration: 60,
    status: "completed" as const,
  },
];

const STATUS_STYLES = {
  confirmed: "bg-sage/15 text-sage border-sage/30",
  cancelled: "bg-dusty-rose/15 text-dusty-rose border-dusty-rose/30",
  completed: "bg-muted text-muted-foreground border-border",
};

const TODAY = new Date();
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function WeekStrip() {
  const today = TODAY.getDay();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(TODAY);
    d.setDate(TODAY.getDate() - today + i);
    return d;
  });

  return (
    <div className="flex items-center justify-between gap-1">
      {days.map((d, i) => {
        const isToday = d.toDateString() === TODAY.toDateString();
        return (
          <div
            key={i}
            className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl cursor-pointer transition-colors ${
              isToday
                ? "bg-sage text-white"
                : "text-muted-foreground hover:bg-accent"
            }`}
          >
            <span className="text-[10px] font-medium uppercase tracking-wide">
              {DAY_NAMES[d.getDay()]}
            </span>
            <span className="text-sm font-semibold">{d.getDate()}</span>
          </div>
        );
      })}
    </div>
  );
}

export function CalendarTab() {
  return (
    <div className="space-y-5">
      {/* Month header */}
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-foreground">
          {MONTH_NAMES[TODAY.getMonth()]} {TODAY.getFullYear()}
        </h2>
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent transition-colors">
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent transition-colors">
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Week strip */}
      <div className="bg-card border border-border rounded-2xl p-3">
        <WeekStrip />
      </div>

      {/* Today's label */}
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-sage" />
        <span className="text-sm font-semibold text-foreground">
          Today · {MOCK_APPOINTMENTS.length} appointments
        </span>
      </div>

      {/* Appointment list */}
      <div className="space-y-3">
        {MOCK_APPOINTMENTS.map((apt) => (
          <div
            key={apt.id}
            className="bg-card border border-border rounded-2xl p-4 flex items-start gap-3 hover:shadow-sm transition-shadow"
          >
            {/* Time column */}
            <div className="flex flex-col items-center gap-0.5 min-w-[44px]">
              <span className="text-sm font-semibold text-foreground">{apt.time}</span>
              <div className="w-px h-6 bg-border" />
              <span className="text-[10px] text-muted-foreground">{apt.duration}m</span>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-1.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-foreground">{apt.service}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <User className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{apt.client}</span>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${STATUS_STYLES[apt.status]}`}
                >
                  {apt.status}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{apt.time} – {apt.duration}min</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}