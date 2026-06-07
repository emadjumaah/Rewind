import { useState, useEffect, useRef, useCallback } from "react";

// ─── THEME ───────────────────────────────────────────────────────────────────
const C = {
  bg: "#0a0a0a",
  surface: "#111111",
  border: "#1e1e1e",
  red: "#c0392b",
  redDim: "#7a1e14",
  amber: "#b8860b",
  green: "#1a4a2e",
  text: "#e8e8e8",
  muted: "#555",
  faint: "#2a2a2a",
};

// ─── UTILS ───────────────────────────────────────────────────────────────────
function pad(n) { return String(n).padStart(2, "0"); }

function timeStats(now) {
  const startOfDay = new Date(now); startOfDay.setHours(0,0,0,0);
  const endOfDay   = new Date(now); endOfDay.setHours(23,59,59,999);
  const startOfYear= new Date(now.getFullYear(),0,1);
  const endOfYear  = new Date(now.getFullYear(),11,31,23,59,59,999);

  const dayPct  = (now - startOfDay)  / (endOfDay - startOfDay)  * 100;
  const yearPct = (now - startOfYear) / (endOfYear - startOfYear)* 100;

  const msLeft  = endOfDay - now;
  const hLeft   = Math.floor(msLeft / 3600000);
  const mLeft   = Math.floor((msLeft % 3600000) / 60000);
  const sLeft   = Math.floor((msLeft % 60000) / 1000);

  const daysInYear = (now.getFullYear() % 4 === 0) ? 366 : 365;
  const dayOfYear  = Math.floor((now - startOfYear) / 86400000) + 1;
  const daysLeft   = daysInYear - dayOfYear;

  return { dayPct, yearPct, hLeft, mLeft, sLeft, daysLeft, dayOfYear, daysInYear };
}

const DAY_QUIPS = [
  "Almost gone.", "You had plans.", "Gone like the others.",
  "Wasted yet?", "Irretrievable.", "It won't come back.",
  "Tick. Tock.", "Another one.", "This is fine.",
];
const YEAR_QUIPS = [
  "It'll be over soon.", "Another year, same you.", "Progress: debatable.",
  "You thought you had time.", "Resolutions: unfulfilled.", "Time: indifferent.",
];
const FOCUS_QUIPS = [
  "Stop reading this. Work.",
  "The timer doesn't care about your excuses.",
  "90 minutes. You can lie to everyone else.",
  "No distractions. You've earned nothing yet.",
  "Silence is uncomfortable. Good.",
];

// ─── REVERSE ANALOG CLOCK ────────────────────────────────────────────────────
function ReverseClock({ now }) {
  const h = now.getHours() % 12;
  const m = now.getMinutes();
  const s = now.getSeconds();
  const ms = now.getMilliseconds();

  // counter-clockwise: negate the angle
  const secDeg  = -((s + ms/1000) * 6);
  const minDeg  = -((m + s/60) * 6);
  const hourDeg = -((h + m/60) * 30);

  const size = 260;
  const cx = size / 2;
  const r = cx - 20;

  // Mirrored hour labels (clockwise positions, counter-clockwise numbers)
  const labels = [12,11,10,9,8,7,6,5,4,3,2,1];

  function hand(deg, length, width, color) {
    const rad = (deg - 90) * Math.PI / 180;
    const x2 = cx + length * Math.cos(rad);
    const y2 = cx + length * Math.sin(rad);
    return <line x1={cx} y1={cx} x2={x2} y2={y2}
      stroke={color} strokeWidth={width} strokeLinecap="round" />;
  }

  return (
    <div style={{ position:"relative", display:"inline-block" }}>
      <svg width={size} height={size} style={{ display:"block" }}>
        {/* Face */}
        <circle cx={cx} cy={cx} r={cx-2} fill={C.surface} stroke={C.border} strokeWidth={1.5}/>

        {/* Tick marks */}
        {Array.from({length:60},(_,i)=>{
          const a = (i*6 - 90) * Math.PI/180;
          const isMajor = i%5===0;
          const r1 = r - (isMajor?12:6);
          return <line key={i}
            x1={cx + r1*Math.cos(a)} y1={cx + r1*Math.sin(a)}
            x2={cx + r*Math.cos(a)}  y2={cx + r*Math.sin(a)}
            stroke={isMajor ? C.muted : C.faint} strokeWidth={isMajor?1.5:0.8}/>;
        })}

        {/* Hour labels — positioned clockwise, numbered counter-clockwise */}
        {labels.map((num, i) => {
          const a = (i * 30 - 90) * Math.PI / 180;
          const lr = r - 22;
          return <text key={num}
            x={cx + lr*Math.cos(a)} y={cx + lr*Math.sin(a)}
            textAnchor="middle" dominantBaseline="central"
            fontSize="11" fontFamily="'Courier New', monospace"
            fill={C.muted} fontWeight="500">{num}</text>;
        })}

        {/* Hands */}
        {hand(hourDeg, r*0.55, 4, C.text)}
        {hand(minDeg,  r*0.75, 2.5, C.text)}
        {hand(secDeg,  r*0.88, 1.5, C.red)}

        {/* Center */}
        <circle cx={cx} cy={cx} r={5} fill={C.red}/>
        <circle cx={cx} cy={cx} r={2} fill={C.bg}/>

        {/* REWIND label */}
        <text x={cx} y={cx+38} textAnchor="middle"
          fontSize="8" fontFamily="'Courier New', monospace"
          fill={C.muted} letterSpacing="4">REWIND</text>
      </svg>
    </div>
  );
}

// ─── DEADLINE CARD ────────────────────────────────────────────────────────────
function urgencyOf(daysLeft) {
  if (daysLeft < 0)  return { label:"OVERDUE",   color:C.red,   quip:"You failed." };
  if (daysLeft === 0)return { label:"TODAY",     color:C.red,   quip:"Today. As in: now." };
  if (daysLeft <= 2) return { label:"CRITICAL",  color:C.red,   quip:"Panic is appropriate." };
  if (daysLeft <= 7) return { label:"URGENT",    color:C.amber, quip:"Probably fine. (It's not.)" };
  if (daysLeft <= 14)return { label:"SOON",      color:C.amber, quip:"Still pretending you have time." };
  return               { label:"EVENTUAL",   color:C.muted, quip:"Future you's problem." };
}

function DeadlineCard({ dl, onRemove }) {
  const now = new Date();
  const target = new Date(dl.date);
  const diff = target - now;
  const daysLeft = Math.floor(diff / 86400000);
  const hoursLeft = Math.floor((diff % 86400000) / 3600000);
  const { label, color, quip } = urgencyOf(daysLeft);

  return (
    <div style={{
      border:`1px solid ${color}22`,
      borderLeft:`3px solid ${color}`,
      background:C.surface,
      padding:"14px 16px",
      marginBottom:8,
      position:"relative",
    }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div>
          <div style={{ fontSize:11, color, fontFamily:"monospace", letterSpacing:2, marginBottom:4 }}>{label}</div>
          <div style={{ fontSize:15, color:C.text, fontWeight:600 }}>{dl.name}</div>
          <div style={{ fontSize:12, color:C.muted, marginTop:4, fontFamily:"monospace" }}>
            {daysLeft > 0
              ? `${daysLeft}d ${hoursLeft}h remaining`
              : daysLeft === 0 ? `${hoursLeft}h remaining`
              : `${Math.abs(daysLeft)}d overdue`}
          </div>
          <div style={{ fontSize:11, color:C.muted, marginTop:6, fontStyle:"italic" }}>{quip}</div>
        </div>
        <button onClick={() => onRemove(dl.id)}
          style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:16, padding:"0 0 0 12px", lineHeight:1 }}>×</button>
      </div>
    </div>
  );
}

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────
function Bar({ pct, color, label, quip }) {
  return (
    <div style={{ marginBottom:20 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
        <span style={{ fontFamily:"monospace", fontSize:11, color:C.muted, letterSpacing:2 }}>{label}</span>
        <span style={{ fontFamily:"monospace", fontSize:11, color }}>
          {pct.toFixed(2)}% consumed
        </span>
      </div>
      <div style={{ height:3, background:C.faint, position:"relative" }}>
        <div style={{ position:"absolute", left:0, top:0, height:"100%", width:`${pct}%`, background:color, transition:"width 1s linear" }}/>
      </div>
      <div style={{ fontSize:11, color:C.muted, marginTop:5, fontStyle:"italic" }}>{quip}</div>
    </div>
  );
}

// ─── FOCUS MODE ──────────────────────────────────────────────────────────────
function FocusMode({ onClose }) {
  const DURATION = 90 * 60;
  const [remaining, setRemaining] = useState(DURATION);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef(null);
  const quip = useRef(FOCUS_QUIPS[Math.floor(Math.random()*FOCUS_QUIPS.length)]);

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining(r => {
          if (r <= 1) { setRunning(false); setDone(true); return 0; }
          return r - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, remaining]);

  const pct = ((DURATION - remaining) / DURATION) * 100;
  const h = Math.floor(remaining / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;

  return (
    <div style={{
      position:"fixed", inset:0, background:C.bg, zIndex:100,
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
    }}>
      <button onClick={onClose} style={{
        position:"absolute", top:24, right:28,
        background:"none", border:"none", color:C.muted, cursor:"pointer",
        fontFamily:"monospace", fontSize:12, letterSpacing:2,
      }}>ESC / QUIT</button>

      <div style={{ fontFamily:"monospace", fontSize:11, color:C.muted, letterSpacing:4, marginBottom:32 }}>
        FOCUS MODE
      </div>

      <div style={{
        fontFamily:"'Courier New', monospace",
        fontSize: "clamp(60px, 12vw, 120px)",
        color: done ? C.red : C.text,
        fontWeight:700,
        letterSpacing:"-2px",
        lineHeight:1,
        marginBottom:24,
      }}>
        {done ? "DONE." : `${pad(h)}:${pad(m)}:${pad(s)}`}
      </div>

      {/* Drain bar */}
      <div style={{ width:"min(480px, 80vw)", height:2, background:C.faint, marginBottom:32 }}>
        <div style={{ height:"100%", width:`${pct}%`, background:C.red, transition:"width 1s linear" }}/>
      </div>

      <div style={{ fontSize:12, color:C.muted, fontStyle:"italic", marginBottom:40, textAlign:"center", maxWidth:360 }}>
        {done ? "90 minutes. Spent. Gone. Did you use them?" : quip.current}
      </div>

      {!done && (
        <button onClick={() => setRunning(r => !r)} style={{
          background:"none",
          border:`1px solid ${running ? C.muted : C.red}`,
          color: running ? C.muted : C.red,
          fontFamily:"monospace", fontSize:12, letterSpacing:3,
          padding:"10px 32px", cursor:"pointer",
        }}>
          {running ? "PAUSE" : remaining === DURATION ? "BEGIN" : "RESUME"}
        </button>
      )}
    </div>
  );
}

// ─── COMMAND PALETTE ──────────────────────────────────────────────────────────
function CommandPalette({ onClose, onFocus, onAddDeadline }) {
  const [q, setQ] = useState("");
  const cmds = [
    { key:"focus",    label:"Enter Focus Mode",      desc:"90 minutes. No excuses.", action: onFocus },
    { key:"deadline", label:"Add Deadline",           desc:"Another thing you won't finish.", action: onAddDeadline },
    { key:"close",    label:"Close Palette",          desc:"Escape the meta.", action: onClose },
  ].filter(c => c.label.toLowerCase().includes(q.toLowerCase()));

  return (
    <div style={{
      position:"fixed", inset:0, background:"#000000bb", zIndex:90,
      display:"flex", alignItems:"flex-start", justifyContent:"center",
      paddingTop:"15vh",
    }} onClick={onClose}>
      <div style={{
        background:C.surface, border:`1px solid ${C.border}`,
        width:"min(560px, 90vw)",
        boxShadow:"0 32px 80px #000",
      }} onClick={e => e.stopPropagation()}>
        <div style={{ borderBottom:`1px solid ${C.border}`, padding:"12px 16px", display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ color:C.muted, fontFamily:"monospace", fontSize:14 }}>⌘</span>
          <input autoFocus value={q} onChange={e=>setQ(e.target.value)}
            placeholder="Type a command..."
            style={{
              flex:1, background:"none", border:"none", outline:"none",
              color:C.text, fontFamily:"monospace", fontSize:14,
            }}/>
        </div>
        {cmds.map(c => (
          <div key={c.key} onClick={c.action}
            style={{
              padding:"14px 18px", cursor:"pointer", borderBottom:`1px solid ${C.border}22`,
              display:"flex", justifyContent:"space-between", alignItems:"center",
            }}
            onMouseEnter={e=>e.currentTarget.style.background=C.faint}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <span style={{ color:C.text, fontFamily:"monospace", fontSize:13 }}>{c.label}</span>
            <span style={{ color:C.muted, fontFamily:"monospace", fontSize:11 }}>{c.desc}</span>
          </div>
        ))}
        {cmds.length===0 && (
          <div style={{ padding:"18px", color:C.muted, fontFamily:"monospace", fontSize:13, textAlign:"center" }}>
            No commands found. Like your free time.
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ADD DEADLINE MODAL ───────────────────────────────────────────────────────
function AddDeadlineModal({ onAdd, onClose }) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");

  return (
    <div style={{
      position:"fixed", inset:0, background:"#000000bb", zIndex:90,
      display:"flex", alignItems:"center", justifyContent:"center",
    }} onClick={onClose}>
      <div style={{
        background:C.surface, border:`1px solid ${C.border}`,
        width:"min(440px, 90vw)", padding:28,
      }} onClick={e=>e.stopPropagation()}>
        <div style={{ fontFamily:"monospace", fontSize:11, color:C.muted, letterSpacing:3, marginBottom:20 }}>
          ADD DEADLINE
        </div>
        <div style={{ fontSize:12, color:C.muted, fontStyle:"italic", marginBottom:20 }}>
          Another commitment. Another opportunity to disappoint yourself.
        </div>
        <input value={name} onChange={e=>setName(e.target.value)}
          placeholder="What won't you finish?"
          style={{
            width:"100%", boxSizing:"border-box",
            background:C.bg, border:`1px solid ${C.border}`,
            color:C.text, fontFamily:"monospace", fontSize:13,
            padding:"10px 12px", marginBottom:12, outline:"none",
          }}/>
        <input type="date" value={date} onChange={e=>setDate(e.target.value)}
          style={{
            width:"100%", boxSizing:"border-box",
            background:C.bg, border:`1px solid ${C.border}`,
            color:C.text, fontFamily:"monospace", fontSize:13,
            padding:"10px 12px", marginBottom:20, outline:"none",
            colorScheme:"dark",
          }}/>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={()=>{ if(name&&date){ onAdd({id:Date.now(), name, date}); onClose(); }}}
            style={{
              flex:1, background:C.red, border:"none", color:"#fff",
              fontFamily:"monospace", fontSize:12, letterSpacing:2,
              padding:"10px", cursor:"pointer",
            }}>ADD IT</button>
          <button onClick={onClose}
            style={{
              flex:1, background:"none", border:`1px solid ${C.border}`, color:C.muted,
              fontFamily:"monospace", fontSize:12, letterSpacing:2,
              padding:"10px", cursor:"pointer",
            }}>CANCEL</button>
        </div>
      </div>
    </div>
  );
}

// ─── DIGITAL DISPLAY ─────────────────────────────────────────────────────────
function DigitalTime({ now }) {
  const h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();

  // Backward digital: count down from 23:59:59
  const totalSec = h*3600 + m*60 + s;
  const backSec  = 86399 - totalSec;
  const bh = Math.floor(backSec / 3600);
  const bm = Math.floor((backSec % 3600) / 60);
  const bs = backSec % 60;

  return (
    <div style={{ textAlign:"center" }}>
      <div style={{
        fontFamily:"'Courier New', monospace",
        fontSize: "clamp(36px, 7vw, 72px)",
        color:C.text,
        letterSpacing:2,
        fontWeight:700,
        lineHeight:1,
      }}>
        {pad(bh)}:{pad(bm)}:{pad(bs)}
      </div>
      <div style={{ fontFamily:"monospace", fontSize:10, color:C.muted, letterSpacing:3, marginTop:8 }}>
        TIME REMAINING TODAY
      </div>
    </div>
  );
}

// ─── SECTION HEADER ──────────────────────────────────────────────────────────
function Section({ title, sub, children }) {
  return (
    <div style={{ marginBottom:40 }}>
      <div style={{ borderBottom:`1px solid ${C.border}`, paddingBottom:10, marginBottom:20 }}>
        <span style={{ fontFamily:"monospace", fontSize:10, color:C.muted, letterSpacing:4 }}>{title}</span>
        {sub && <span style={{ fontFamily:"monospace", fontSize:10, color:C.redDim, letterSpacing:2, marginLeft:16 }}>{sub}</span>}
      </div>
      {children}
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [now, setNow] = useState(new Date());
  const [deadlines, setDeadlines] = useState([
    { id:1, name:"Q2 report", date: new Date(Date.now()+2*86400000).toISOString().slice(0,10) },
    { id:2, name:"Side project launch", date: new Date(Date.now()+18*86400000).toISOString().slice(0,10) },
    { id:3, name:"Tax extension deadline", date: new Date(Date.now()+45*86400000).toISOString().slice(0,10) },
  ]);
  const [showFocus, setShowFocus]   = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [showAddDl, setShowAddDl]   = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowPalette(p => !p);
      }
      if (e.key === "Escape") {
        setShowPalette(false);
        setShowAddDl(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const stats = timeStats(now);
  const removeDeadline = (id) => setDeadlines(ds => ds.filter(d => d.id !== id));
  const addDeadline    = (dl) => setDeadlines(ds => [...ds, dl]);

  const dayQuip  = DAY_QUIPS[now.getMinutes() % DAY_QUIPS.length];
  const yearQuip = YEAR_QUIPS[now.getHours()  % YEAR_QUIPS.length];
  const dayColor = stats.dayPct > 80 ? C.red : stats.dayPct > 50 ? C.amber : C.muted;

  return (
    <div style={{
      minHeight:"100vh",
      background:C.bg,
      color:C.text,
      fontFamily:"'Courier New', monospace",
    }}>
      {/* Grain overlay */}
      <div style={{
        position:"fixed", inset:0, pointerEvents:"none", zIndex:50, opacity:0.025,
        backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize:"200px",
      }}/>

      {/* Header */}
      <div style={{
        borderBottom:`1px solid ${C.border}`,
        padding:"18px 32px",
        display:"flex", alignItems:"center", justifyContent:"space-between",
      }}>
        <div>
          <div style={{ fontSize:18, fontWeight:700, letterSpacing:6, color:C.text }}>REWIND</div>
          <div style={{ fontSize:9, color:C.red, letterSpacing:3, marginTop:2 }}>TIME IS RUNNING OUT</div>
        </div>
        <div style={{ display:"flex", gap:12, alignItems:"center" }}>
          <button onClick={() => setShowFocus(true)}
            style={{ background:"none", border:`1px solid ${C.border}`, color:C.muted,
              fontFamily:"monospace", fontSize:10, letterSpacing:2, padding:"6px 14px", cursor:"pointer" }}>
            FOCUS
          </button>
          <button onClick={() => setShowPalette(true)}
            style={{ background:"none", border:`1px solid ${C.border}`, color:C.muted,
              fontFamily:"monospace", fontSize:10, letterSpacing:2, padding:"6px 14px", cursor:"pointer" }}>
            ⌘K
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ maxWidth:960, margin:"0 auto", padding:"40px 32px" }}>

        {/* Hero: Clock + Digital */}
        <div style={{
          display:"grid",
          gridTemplateColumns:"1fr 1fr",
          gap:48,
          marginBottom:56,
          alignItems:"center",
        }}>
          <div style={{ display:"flex", justifyContent:"center" }}>
            <div>
              <div style={{ textAlign:"center", marginBottom:12, fontSize:9, color:C.muted, letterSpacing:4 }}>
                COUNTER-CLOCKWISE / REAL TIME
              </div>
              <ReverseClock now={now} />
              <div style={{ textAlign:"center", marginTop:10, fontSize:10, color:C.muted, fontStyle:"italic" }}>
                The hands move backward.<br/>So does your time.
              </div>
            </div>
          </div>

          <div>
            <DigitalTime now={now} />
            <div style={{ marginTop:32 }}>
              <div style={{ fontSize:10, color:C.muted, letterSpacing:3, marginBottom:16 }}>LIVE DATE</div>
              <div style={{ fontSize:14, color:C.text }}>
                {now.toLocaleDateString("en-US",{weekday:"long", year:"numeric", month:"long", day:"numeric"})}
              </div>
              <div style={{ fontSize:11, color:C.muted, marginTop:6 }}>
                Day {stats.dayOfYear} of {stats.daysInYear}. {stats.daysLeft} remain.
              </div>
              <div style={{ fontSize:11, color:C.redDim, fontStyle:"italic", marginTop:4 }}>
                {stats.daysLeft < 100 ? "Under 100 days left this year." : "Still going. For now."}
              </div>
            </div>
          </div>
        </div>

        {/* Time Analytics */}
        <Section title="TIME CONSUMED" sub="IRREVERSIBLE">
          <Bar pct={stats.dayPct}  color={dayColor} label="TODAY"      quip={dayQuip} />
          <Bar pct={stats.yearPct} color={stats.yearPct > 75 ? C.red : C.amber}
               label="THIS YEAR"  quip={yearQuip} />
          <div style={{
            background:C.surface, border:`1px solid ${C.border}`,
            padding:"14px 18px", fontSize:11, color:C.muted, fontStyle:"italic",
          }}>
            You have {stats.hLeft}h {stats.mLeft}m {stats.sLeft}s left today.
            That's {(stats.hLeft*60+stats.mLeft)} minutes.
            {stats.hLeft < 4 ? " You should sleep." : stats.hLeft < 8 ? " Use them." : " Plenty of time to waste."}
          </div>
        </Section>

        {/* Deadlines */}
        <Section title="DEADLINES" sub={`${deadlines.length} PENDING`}>
          {deadlines.length === 0 && (
            <div style={{ color:C.muted, fontSize:13, fontStyle:"italic", padding:"20px 0" }}>
              No deadlines. Either you're ahead of schedule, or in denial.
            </div>
          )}
          {[...deadlines].sort((a,b)=>new Date(a.date)-new Date(b.date))
            .map(dl => <DeadlineCard key={dl.id} dl={dl} onRemove={removeDeadline}/>)}
          <button onClick={() => setShowAddDl(true)}
            style={{
              display:"block", width:"100%", marginTop:8,
              background:"none", border:`1px dashed ${C.border}`,
              color:C.muted, fontFamily:"monospace", fontSize:11, letterSpacing:2,
              padding:"12px", cursor:"pointer",
            }}
            onMouseEnter={e=>e.currentTarget.style.borderColor=C.muted}
            onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
            + ADD DEADLINE
          </button>
        </Section>

        {/* Footer */}
        <div style={{
          borderTop:`1px solid ${C.border}`,
          paddingTop:24,
          display:"flex", justifyContent:"space-between", alignItems:"center",
        }}>
          <div style={{ fontSize:9, color:C.muted, letterSpacing:2 }}>
            REWIND — A CLOCK THAT TELLS THE TRUTH
          </div>
          <div style={{ fontSize:9, color:C.muted }}>
            ⌘K for commands
          </div>
        </div>
      </div>

      {/* Modals */}
      {showFocus   && <FocusMode onClose={() => setShowFocus(false)} />}
      {showPalette && <CommandPalette
        onClose={() => setShowPalette(false)}
        onFocus={() => { setShowPalette(false); setShowFocus(true); }}
        onAddDeadline={() => { setShowPalette(false); setShowAddDl(true); }} />}
      {showAddDl   && <AddDeadlineModal onAdd={addDeadline} onClose={() => setShowAddDl(false)} />}
    </div>
  );
}
