const { useState, useEffect } = React;

const KEY = "keeneland2026:log";
// Persistence is this browser, and only this browser. The log never leaves the
// device it was typed on, so the same page can be handed to someone else and
// they keep their own book — no shared pot, nobody overwriting anybody.
const store = {
  read() {
    try {
      const v = localStorage.getItem(KEY);
      return v ? JSON.parse(v) : null;
    } catch (e) {
      return null;
    }
  },
  save(o) {
    try {
      localStorage.setItem(KEY, JSON.stringify(o));
      return true;
    } catch (e) {
      return false;
    }
  },
};

const INK = "#14231C";
const GREEN = "#10503C";
const PAPER = "#E5E4DC";
const PAPER_HI = "#F0EFE8";
const AMBER = "#E8B33A";
const LOSS = "#B4483F";
const WIN = "#5E9C6B";
const RULE = "#C3C2B6";

const DAYS = [
  { id: "fri", label: "Fri", date: "Oct 2" },
  { id: "sat", label: "Sat", date: "Oct 3" },
  { id: "sun", label: "Sun", date: "Oct 4" },
];

const TYPES = ["Win", "Place", "Show", "Exacta", "Turf P3"];
const ANGLES = ["Trip trouble", "Speed / pace", "Class", "Name", "Other"];
const CHIPS = [2, 6, 10, 18, 20];

// Keeneland trainer standings, Fall 2025 (thru Oct 25) + Spring 2026 (thru Apr 24).
// Source: Equibase "Keeneland Standings". Combined across both meets.
// [name, turfStarts, turfWins, turfITM, dirtStarts, dirtWins, dirtITM]
// Trainers with fewer than 3 combined starts are omitted.
const TRAINERS = [
  ["Brendan P. Walsh",62,10,35,35,7,22],
  ["Brad H. Cox",28,9,15,58,20,38],
  ["Steven M. Asmussen",16,1,4,65,10,30],
  ["Kenneth G. McPeek",20,4,7,55,5,15],
  ["Wesley A. Ward",32,2,14,33,15,23],
  ["Joe Sharp",22,1,6,36,5,15],
  ["Michael J. Maker",31,2,12,18,1,8],
  ["William I. Mott",22,1,5,27,6,16],
  ["Mark E. Casse",23,5,11,24,1,9],
  ["Chad C. Brown",32,4,16,12,1,8],
  ["Cherie DeVaux",25,4,9,19,2,5],
  ["George R. Arnold II",29,6,13,15,2,7],
  ["John Ennis",11,1,1,31,2,8],
  ["Victoria H. Oliver",20,1,6,17,2,7],
  ["Brian A. Lynch",20,4,11,17,2,6],
  ["William Walden",20,4,9,15,2,10],
  ["Eddie Kenneally",12,1,3,23,3,11],
  ["David Jacobson",1,0,0,33,3,14],
  ["Ian R. Wilkes",15,1,3,19,4,9],
  ["Todd A. Pletcher",16,5,10,16,6,11],
  ["Rodolphe Brisset",7,0,0,21,3,11],
  ["D. Whitworth Beckman",12,2,4,16,1,5],
  ["W. B. Calhoun",8,0,1,19,3,6],
  ["Riley Mott",13,1,3,12,2,5],
  ["Dale L. Romans",8,2,2,16,1,6],
  ["Matthew P. Sims",6,1,1,18,3,8],
  ["Peter Eurton",10,2,6,14,2,5],
  ["Ben Colebrook",7,0,1,17,4,10],
  ["Robert Medina",7,0,0,17,4,5],
  ["J. K. Desormeaux",6,0,2,15,0,2],
  ["H. G. Motion",20,2,7,1,0,0],
  ["Christopher Davis",7,0,1,13,4,5],
  ["Lindsay Schultz",11,3,4,8,1,2],
  ["George Weaver",12,0,2,6,0,2],
  ["Michael W. McCarthy",9,0,3,9,1,4],
  ["Gregory D. Foley",8,2,5,10,1,5],
  ["Saffie A. Joseph, Jr.",8,1,4,10,1,5],
  ["Andrew McKeever",5,0,0,13,0,3],
  ["Dallas Stewart",1,0,0,17,0,8],
  ["Kelsey Danner",11,1,1,6,2,2],
  ["Eric N. Foster",4,0,1,12,3,4],
  ["Thomas Drury, Jr.",3,1,1,13,0,4],
  ["Ron Moquett",3,0,0,13,0,1],
  ["Chris A. Hartman",5,0,1,11,2,4],
  ["Eoin G. Harty",7,0,2,9,1,2],
  ["John A. Ortiz",2,0,0,13,2,4],
  ["Norm W. Casse",1,0,0,14,1,6],
  ["Philip A. Bauer",3,1,2,11,0,5],
  ["Hugh H. Robertson",2,0,0,12,0,2],
  ["Ismael Bahena",2,0,0,12,0,6],
  ["Ed Moger, Jr.",6,0,0,8,0,2],
  ["Matt A. Shirer",3,0,2,11,3,5],
  ["Ignacio Correas IV",6,1,3,7,0,0],
  ["Danny Gargan",5,0,1,8,0,3],
  ["Paul McEntee",4,0,0,8,1,2],
  ["Thomas M. Amoss",1,0,0,10,1,5],
  ["Michael A. Tomlinson",1,0,0,10,2,7],
  ["Anna M. Meah",3,0,0,8,2,4],
  ["Larry Rivelli",3,2,2,7,0,1],
  ["Carlos A. David",4,0,1,6,1,3],
  ["Jack Sisterson",6,0,0,4,1,2],
  ["William D. Cowans",4,0,1,6,0,1],
  ["Michael Stidham",5,0,2,5,0,2],
  ["Wayne M. Catalano",7,1,1,3,0,2],
  ["Doug F. O'Neill",2,0,0,8,2,4],
  ["Robertino Diodoro",1,0,0,8,2,3],
  ["Paul J. McGee",4,0,0,5,1,1],
  ["Troy S. Wismer",3,0,0,6,1,3],
  ["Ethan W. West",3,0,0,6,1,1],
  ["Paulo H. Lobo",3,0,2,6,1,4],
  ["John A. Hancock",1,0,1,8,0,0],
  ["Destin G. Heath",5,0,0,4,0,1],
  ["Philip D'Amato",2,0,0,6,0,1],
  ["Genaro Garcia",0,0,0,8,1,2],
  ["Albert M. Stall, Jr.",2,0,1,6,2,4],
  ["Michelle Nihei",6,0,1,2,0,0],
  ["Carlos Munoz",0,0,0,8,1,2],
  ["Anna Navarrete",3,0,0,5,1,2],
  ["J. K. Sweezey",1,0,0,7,0,2],
  ["Jeremiah O'Dwyer",4,0,2,3,0,1],
  ["Marcelino Salas",2,0,0,5,0,2],
  ["Caio Caramori",3,0,1,4,1,2],
  ["Robert B. Hess, Jr.",1,0,0,6,3,4],
  ["Troy Newton",1,0,1,6,1,3],
  ["Miguel Clement",7,0,0,0,0,0],
  ["Jordan Blair",2,0,0,5,1,2],
  ["Lacy Pierce",1,0,0,6,1,3],
  ["Jena M. Antonucci",3,0,0,4,0,1],
  ["Jonathan Thomas",6,1,1,1,0,1],
  ["Kevin Rice",3,0,1,4,0,0],
  ["Brittany A. Vanden Berg",1,0,0,6,0,1],
  ["Kelli Martinez",0,0,0,7,2,4],
  ["Rey Hernandez",1,0,0,6,0,3],
  ["Nolan Ramsey",5,0,1,1,0,0],
  ["Hutch Holsapple",3,0,0,3,0,1],
  ["Jesus Esquivel",0,0,0,6,1,1],
  ["Jose F. D'Angelo",5,1,2,1,0,1],
  ["Tito Moreno",2,0,0,4,0,0],
  ["Matt Williams",0,0,0,6,0,1],
  ["Conor Murphy",2,0,0,4,0,1],
  ["Richard Baltas",3,0,0,3,0,1],
  ["Aaron M. West",1,0,0,5,0,1],
  ["Michel Douaihy",4,0,0,2,1,2],
  ["Tommy Humphries",0,0,0,6,1,2],
  ["Doug L. Anderson",0,0,0,6,0,1],
  ["Brian Williamson",1,0,0,5,1,1],
  ["Grant T. Forster",1,0,0,5,0,1],
  ["Nicholas Vaccarezza",3,0,1,3,0,1],
  ["Chris M. Block",3,0,2,3,0,1],
  ["Darrin Miller",3,1,1,3,0,0],
  ["Edward Vaughan",5,1,1,1,0,1],
  ["Eduardo Caramori",3,0,0,2,1,2],
  ["Elias Lopez",1,0,0,4,1,2],
  ["Aaron Shorter",0,0,0,5,1,1],
  ["Michelle Lovell",4,0,0,1,0,0],
  ["Randy L. Morse",0,0,0,5,0,2],
  ["Claude R. McGaughey III",4,0,2,1,1,1],
  ["Tim Girten",2,0,0,3,0,1],
  ["Eric R. Reed",2,0,0,3,0,1],
  ["Coty W. Rosin",2,0,0,3,0,1],
  ["John C. Servis",2,0,0,3,0,0],
  ["David Fawkes",2,0,0,3,0,0],
  ["Marcelino Torres",1,0,0,4,0,0],
  ["James P. DiVito",1,0,1,4,0,2],
  ["Israel Acevedo",2,0,0,3,0,1],
  ["Rohan G. Crichton",2,0,0,3,0,1],
  ["Glenn S. Wismer",2,0,0,3,0,0],
  ["Richard E. Dutrow, Jr.",0,0,0,5,2,3],
  ["Justin Wojczynski",4,0,0,1,0,0],
  ["William E. Morey",1,0,0,3,0,0],
  ["Niccolo Troiani",2,0,0,2,0,0],
  ["Gustavo Esquivel",0,0,0,4,0,0],
  ["James A. Kelley",4,0,0,0,0,0],
  ["Lauren Robson",1,0,0,3,0,1],
  ["Fausto Gutierrez",1,0,0,3,0,1],
  ["Susan L. Anderson",3,0,0,1,0,0],
  ["S. J. Cunningham",0,0,0,4,0,1],
  ["Kinnon LaRose",0,0,0,4,2,4],
  ["Josie Carroll",3,1,1,1,1,1],
  ["Claude L. Brownfield III",0,0,0,4,0,1],
  ["Kevin Attard",2,0,1,2,0,2],
  ["Patrick L. Biancone",2,0,0,2,0,0],
  ["Fergus Bogle",2,0,0,2,0,0],
  ["Brittany T. Russell",1,0,0,3,1,1],
  ["Brian Knippenberg",2,0,0,2,0,0],
  ["Jose L. Aranha",2,0,0,2,0,1],
  ["Gustavo Delgado",1,0,0,3,0,0],
  ["Rick Hiles",0,0,0,4,0,2],
  ["Greg Begley",0,0,0,4,0,0],
  ["Carl J. Deville",0,0,0,4,1,1],
  ["Mertkan Kantarmaci",0,0,0,4,1,1],
  ["Pavel Matejka",3,0,0,1,0,0],
  ["Thomas L. Van Berg",0,0,0,4,0,1],
  ["Roddina A. Barrett",0,0,0,4,0,0],
  ["Philip A. Sims",1,0,1,3,0,0],
  ["Kelly A. Fernandez",3,0,0,1,0,0],
  ["Mark Simms, Jr.",0,0,0,4,0,1],
  ["Anna Decker",0,0,0,3,0,0],
  ["Greg Compton",0,0,0,3,1,1],
  ["Dana Hancock",1,0,0,2,0,0],
  ["Juan C. Perez",1,0,1,2,0,0],
  ["Madison F. Meyers",3,1,2,0,0,0],
  ["Carlos Santamaria",1,0,0,2,0,0],
  ["John J. Manning, Jr.",0,0,0,3,0,0],
  ["Michael J. Trombetta",3,0,1,0,0,0],
  ["Anthony T. Quartarolo",0,0,0,3,0,2],
  ["Barry L. King",0,0,0,3,0,0],
  ["Arnaud Delacour",1,0,0,2,2,2],
  ["Bob Baffert",0,0,0,3,1,2],
  ["Bobby C. Barnett",1,0,0,2,0,0],
  ["Karyn Wittek",0,0,0,3,0,1],
  ["Ryan D. Walsh",1,0,0,2,0,0],
  ["Manuel Chavez",0,0,0,3,1,1],
  ["Jerry Antonuik",0,0,0,3,0,0],
  ["Michael R. Thompson",0,0,0,3,0,0],
  ["Daniel Leitch",0,0,0,3,0,0],
  ["Rachel Halden",3,1,1,0,0,0],
  ["Louis C. Linder, Jr.",1,0,0,2,0,0],
  ["Mary A. Howard",1,0,0,2,0,0],
  ["James J. Toner",3,0,0,0,0,0],
  ["Jayde J. Gelner",1,0,0,2,0,0],
  ["Thomas Morley",3,2,2,0,0,0],
  ["Amelia J. Green",1,0,0,2,0,1],
  ["Jose M. Camejo",2,0,0,1,0,0],
  ["Concepcion Torres",1,0,0,2,0,0],
  ["Jimmy Corrigan",3,0,1,0,0,0],
  ["Jeff Engler",3,0,0,0,0,0],
  ["Jorge R. Abreu",3,0,0,0,0,0],
  ["Horacio De Paz",1,0,0,2,0,0],
  ["Joe B. Roberts",0,0,0,3,0,0],
  ["Cirilo Gorostieta",1,0,0,2,0,0],
];

const THIN = 8; // below this many starts on a surface, treat the rate as noise

function rate(n, d) {
  return d ? (100 * n) / d : null;
}

function parseOdds(raw) {
  if (!raw) return null;
  const s = String(raw).trim().replace("/", "-");
  if (s.includes("-")) {
    const [a, b] = s.split("-").map(Number);
    if (!isNaN(a) && !isNaN(b) && b !== 0) return a / b;
    return null;
  }
  const n = Number(s);
  return isNaN(n) ? null : n;
}

function band(odds) {
  if (odds === null) return "Unpriced";
  if (odds < 5) return "Under 5-1";
  if (odds <= 15) return "5-1 to 15-1";
  return "Over 15-1";
}

const money = (n) =>
  (n < 0 ? "-$" : "$") + Math.abs(n).toFixed(2).replace(/\.00$/, "");

function KeenelandBetLog() {
  const seed = store.read();
  const [saveError, setSaveError] = useState(null);
  const [bets, setBets] = useState(seed && seed.bets ? seed.bets : []);
  const [horses, setHorses] = useState(
    seed && seed.horses ? seed.horses : { starred: {}, mine: [] }
  );
  const [stacks, setStacks] = useState(
    seed && seed.stacks ? seed.stacks : { handicap: 60, fun: 40 }
  );
  const [day, setDay] = useState("fri");
  const [view, setView] = useState("log");
  const [adding, setAdding] = useState(false);
  const [settling, setSettling] = useState(null);
  const [payout, setPayout] = useState("");

  const blank = {
    race: 1,
    horse: "",
    odds: "",
    type: "Win",
    stake: 10,
    stack: "handicap",
    angle: "Trip trouble",
    note: "",
  };
  const [draft, setDraft] = useState(blank);


  // One blob for everything, so Copy log carries the horses too.
  const persist = (patch) => {
    const ok = store.save({ bets, stacks, horses, ...patch });
    setSaveError(
      ok ? null : "Couldn't save. Write it on your program — this entry may not stick."
    );
  };

  const addBet = () => {
    if (!draft.horse.trim()) return;
    const bet = {
      ...draft,
      horse: draft.horse.trim(),
      stake: Number(draft.stake) || 0,
      day,
      id: Date.now(),
      returned: null,
    };
    const next = [...bets, bet];
    setBets(next);
    persist({ bets: next });
    setDraft({ ...blank, race: Math.min(11, bet.race + 1), stack: draft.stack });
    setAdding(false);
  };

  const settle = (id, amount) => {
    const next = bets.map((b) =>
      b.id === id ? { ...b, returned: Number(amount) || 0 } : b
    );
    setBets(next);
    persist({ bets: next });
    setSettling(null);
    setPayout("");
  };

  const remove = (id) => {
    const next = bets.filter((b) => b.id !== id);
    setBets(next);
    persist({ bets: next });
  };

  const toggleStar = (id) => {
    const starred = { ...horses.starred };
    if (starred[id]) delete starred[id];
    else starred[id] = true;
    const next = { ...horses, starred };
    setHorses(next);
    persist({ horses: next });
  };

  const addHorse = (h) => {
    const next = { ...horses, mine: [...horses.mine, h] };
    setHorses(next);
    persist({ horses: next });
  };

  const dropHorse = (id) => {
    const starred = { ...horses.starred };
    delete starred[id];
    const next = { starred, mine: horses.mine.filter((m) => m.id !== id) };
    setHorses(next);
    persist({ horses: next });
  };

  const dayBets = bets.filter((b) => b.day === day);
  const stakedBy = (stack) =>
    dayBets.filter((b) => b.stack === stack).reduce((s, b) => s + b.stake, 0);
  const settled = dayBets.filter((b) => b.returned !== null);
  const dayNet =
    settled.reduce((s, b) => s + b.returned, 0) -
    settled.reduce((s, b) => s + b.stake, 0);

  const updateStack = (which, val) => {
    const next = { ...stacks, [which]: Number(val) || 0 };
    setStacks(next);
    persist({ stacks: next });
  };

  return (
    <div
      style={{ background: PAPER, color: INK, minHeight: 560 }}
      className="w-full"
    >
      {/* Header */}
      <div id="app-header" style={{ background: GREEN }} className="px-4 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <Mark />
          <div className="min-w-0">
            <div
              style={{ color: PAPER_HI, fontFamily: "Georgia, serif" }}
              className="text-xl leading-tight"
            >
              Fall Stars Weekend
            </div>
            <div style={{ color: AMBER }} className="text-xs tracking-wide mt-1">
              Keeneland · October 2–4, 2026
            </div>
          </div>
        </div>
        <div className="flex gap-1 mt-3">
          {DAYS.map((d) => (
            <button
              key={d.id}
              onClick={() => setDay(d.id)}
              style={{
                background: day === d.id ? PAPER_HI : "transparent",
                color: day === d.id ? INK : PAPER_HI,
                border: `1px solid ${day === d.id ? PAPER_HI : "rgba(240,239,232,0.4)"}`,
              }}
              className="flex-1 py-2 rounded text-sm"
            >
              {d.label}
              <span className="block text-xs opacity-70">{d.date}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tote board */}
      <div style={{ background: INK }} className="px-4 py-3">
        <div className="flex justify-between items-end">
          <Board
            label="Handicap stack"
            used={stakedBy("handicap")}
            total={stacks.handicap}
            onEdit={(v) => updateStack("handicap", v)}
          />
          <Board
            label="Fun stack"
            used={stakedBy("fun")}
            total={stacks.fun}
            onEdit={(v) => updateStack("fun", v)}
          />
          <div className="text-right">
            <div style={{ color: "#8A9A90" }} className="text-xs">
              Day net
            </div>
            <div
              style={{
                color: dayNet > 0 ? WIN : dayNet < 0 ? LOSS : AMBER,
                fontFamily: "ui-monospace, monospace",
              }}
              className="text-lg"
            >
              {money(dayNet)}
            </div>
          </div>
        </div>
      </div>

      {saveError && (
        <div
          style={{ background: LOSS, color: "#fff" }}
          className="px-4 py-2 text-xs"
        >
          {saveError} Try logging it again.
        </div>
      )}

      {/* View switch */}
      <div
        style={{ borderBottom: `1px solid ${RULE}` }}
        className="flex px-4 pt-3 gap-4"
      >
        {[
          ["log", "Today's bets"],
          ["horses", "Horses"],
          ["totals", "Totals"],
          ["trainers", "Trainers"],
        ].map(([v, label]) => (
          <button
            key={v}
            onClick={() => setView(v)}
            style={{
              color: view === v ? INK : "#7C7B70",
              borderBottom: view === v ? `2px solid ${GREEN}` : "2px solid transparent",
            }}
            className="pb-2 text-sm"
          >
            {label}
          </button>
        ))}
      </div>

      {view === "log" ? (
        <div className="px-4 py-3">
          {!adding && (
            <button
              onClick={() => setAdding(true)}
              style={{ background: GREEN, color: PAPER_HI }}
              className="w-full py-3 rounded text-base"
            >
              Log a bet
            </button>
          )}

          {adding && (
            <div
              style={{ background: PAPER_HI, border: `1px solid ${RULE}` }}
              className="rounded p-3"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm">Race</span>
                <button
                  onClick={() =>
                    setDraft({ ...draft, race: Math.max(1, draft.race - 1) })
                  }
                  style={{ border: `1px solid ${RULE}` }}
                  className="w-9 h-9 rounded text-lg"
                >
                  −
                </button>
                <span
                  style={{ fontFamily: "ui-monospace, monospace" }}
                  className="w-8 text-center text-lg"
                >
                  {draft.race}
                </span>
                <button
                  onClick={() =>
                    setDraft({ ...draft, race: Math.min(11, draft.race + 1) })
                  }
                  style={{ border: `1px solid ${RULE}` }}
                  className="w-9 h-9 rounded text-lg"
                >
                  +
                </button>
              </div>

              <input
                value={draft.horse}
                onChange={(e) => setDraft({ ...draft, horse: e.target.value })}
                placeholder="Horse"
                style={{ border: `1px solid ${RULE}`, background: "#fff" }}
                className="w-full px-3 py-2 rounded mb-2 text-base"
              />
              <input
                value={draft.odds}
                onChange={(e) => setDraft({ ...draft, odds: e.target.value })}
                placeholder="Odds at post (e.g. 12-1)"
                style={{ border: `1px solid ${RULE}`, background: "#fff" }}
                className="w-full px-3 py-2 rounded mb-3 text-base"
              />

              <Row label="Bet type">
                {TYPES.map((t) => (
                  <Pill
                    key={t}
                    on={draft.type === t}
                    onClick={() => setDraft({ ...draft, type: t })}
                  >
                    {t}
                  </Pill>
                ))}
              </Row>

              <Row label="From">
                <Pill
                  on={draft.stack === "handicap"}
                  onClick={() => setDraft({ ...draft, stack: "handicap" })}
                >
                  Handicap
                </Pill>
                <Pill
                  on={draft.stack === "fun"}
                  onClick={() => setDraft({ ...draft, stack: "fun", stake: 2 })}
                >
                  Fun
                </Pill>
              </Row>

              <Row label="Stake">
                {CHIPS.map((c) => (
                  <Pill
                    key={c}
                    on={Number(draft.stake) === c}
                    onClick={() => setDraft({ ...draft, stake: c })}
                  >
                    ${c}
                  </Pill>
                ))}
                <input
                  value={draft.stake}
                  onChange={(e) => setDraft({ ...draft, stake: e.target.value })}
                  style={{ border: `1px solid ${RULE}`, background: "#fff" }}
                  className="w-16 px-2 py-1 rounded text-sm"
                />
              </Row>

              <Row label="Why">
                {ANGLES.map((a) => (
                  <Pill
                    key={a}
                    on={draft.angle === a}
                    onClick={() => setDraft({ ...draft, angle: a })}
                  >
                    {a}
                  </Pill>
                ))}
              </Row>

              <input
                value={draft.note}
                onChange={(e) => setDraft({ ...draft, note: e.target.value })}
                placeholder="Note (optional) — what you saw"
                style={{ border: `1px solid ${RULE}`, background: "#fff" }}
                className="w-full px-3 py-2 rounded mb-3 mt-1 text-sm"
              />

              <div className="flex gap-2">
                <button
                  onClick={addBet}
                  style={{ background: GREEN, color: PAPER_HI }}
                  className="flex-1 py-3 rounded"
                >
                  Save bet
                </button>
                <button
                  onClick={() => setAdding(false)}
                  style={{ border: `1px solid ${RULE}` }}
                  className="px-4 py-3 rounded text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="mt-3">
            {dayBets.length === 0 && !adding && (
              <p style={{ color: "#7C7B70" }} className="text-sm py-6">
                No bets yet for {DAYS.find((d) => d.id === day).date}. Log the
                first one before the gates open.
              </p>
            )}
            {dayBets
              .slice()
              .reverse()
              .map((b) => {
                const net = b.returned === null ? null : b.returned - b.stake;
                return (
                  <div
                    key={b.id}
                    style={{ borderBottom: `1px solid ${RULE}` }}
                    className="py-3"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <div className="text-base truncate">
                          <span
                            style={{ fontFamily: "ui-monospace, monospace", color: GREEN }}
                          >
                            R{b.race}
                          </span>{" "}
                          {b.horse}
                        </div>
                        <div style={{ color: "#7C7B70" }} className="text-xs mt-1">
                          {b.type} · ${b.stake} · {b.odds || "no odds"} ·{" "}
                          {b.angle}
                          {b.stack === "fun" ? " · fun" : ""}
                        </div>
                        {b.note && (
                          <div className="text-xs mt-1 italic">{b.note}</div>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        {net === null ? (
                          <button
                            onClick={() => {
                              setSettling(b.id);
                              setPayout("");
                            }}
                            style={{ border: `1px solid ${GREEN}`, color: GREEN }}
                            className="px-3 py-2 rounded text-xs"
                          >
                            Settle
                          </button>
                        ) : (
                          <div
                            style={{
                              color: net >= 0 ? WIN : LOSS,
                              fontFamily: "ui-monospace, monospace",
                            }}
                            className="text-base"
                          >
                            {money(net)}
                          </div>
                        )}
                      </div>
                    </div>

                    {settling === b.id && (
                      <div className="flex gap-2 mt-2 items-center">
                        <input
                          value={payout}
                          onChange={(e) => setPayout(e.target.value)}
                          placeholder="Total returned"
                          style={{ border: `1px solid ${RULE}`, background: "#fff" }}
                          className="flex-1 px-3 py-2 rounded text-sm"
                        />
                        <button
                          onClick={() => settle(b.id, payout)}
                          style={{ background: GREEN, color: PAPER_HI }}
                          className="px-3 py-2 rounded text-sm"
                        >
                          Cashed
                        </button>
                        <button
                          onClick={() => settle(b.id, 0)}
                          style={{ border: `1px solid ${RULE}` }}
                          className="px-3 py-2 rounded text-sm"
                        >
                          Tore it up
                        </button>
                      </div>
                    )}
                    {settling === b.id && (
                      <button
                        onClick={() => remove(b.id)}
                        style={{ color: LOSS }}
                        className="text-xs mt-2"
                      >
                        Delete this entry
                      </button>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      ) : view === "horses" ? (
        <Horses
          day={day}
          horses={horses}
          onStar={toggleStar}
          onAdd={addHorse}
          onDrop={dropHorse}
        />
      ) : view === "totals" ? (
        <Totals bets={bets} stacks={stacks} />
      ) : (
        <Trainers />
      )}
    </div>
  );
}

function Board({ label, used, total, onEdit }) {
  return (
    <div>
      <div style={{ color: "#8A9A90" }} className="text-xs">
        {label}
      </div>
      <div className="flex items-baseline gap-1">
        <span
          style={{
            color: used > total ? "#B4483F" : "#E8B33A",
            fontFamily: "ui-monospace, monospace",
          }}
          className="text-lg"
        >
          ${used}
        </span>
        <span style={{ color: "#8A9A90" }} className="text-xs">
          of
        </span>
        <input
          value={total}
          onChange={(e) => onEdit(e.target.value)}
          style={{
            color: "#8A9A90",
            background: "transparent",
            border: "none",
            fontFamily: "ui-monospace, monospace",
            width: 34,
          }}
          className="text-xs"
        />
      </div>
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div className="mb-3">
      <div style={{ color: "#7C7B70" }} className="text-xs mb-1">
        {label}
      </div>
      <div className="flex flex-wrap gap-1 items-center">{children}</div>
    </div>
  );
}

function Pill({ on, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: on ? GREEN : "#fff",
        color: on ? PAPER_HI : INK,
        border: `1px solid ${on ? GREEN : RULE}`,
      }}
      className="px-3 py-2 rounded text-sm"
    >
      {children}
    </button>
  );
}

function Totals({ bets, stacks }) {
  const settled = bets.filter((b) => b.returned !== null);
  const agg = (list) => {
    const staked = list.reduce((s, b) => s + b.stake, 0);
    const back = list.reduce((s, b) => s + b.returned, 0);
    const hits = list.filter((b) => b.returned > 0).length;
    return {
      n: list.length,
      staked,
      net: back - staked,
      roi: staked ? ((back - staked) / staked) * 100 : 0,
      hit: list.length ? (hits / list.length) * 100 : 0,
    };
  };

  const all = agg(settled);
  const byAngle = ANGLES.map((a) => ({
    name: a,
    ...agg(settled.filter((b) => b.angle === a)),
  })).filter((r) => r.n > 0);
  const bands = ["Under 5-1", "5-1 to 15-1", "Over 15-1", "Unpriced"];
  const byBand = bands
    .map((name) => ({
      name,
      ...agg(settled.filter((b) => band(parseOdds(b.odds)) === name)),
    }))
    .filter((r) => r.n > 0);

  if (settled.length === 0) {
    return (
      <div className="px-4 py-8">
        <p style={{ color: "#7C7B70" }} className="text-sm">
          Settle a few bets and the numbers show up here — overall ROI, plus how
          each angle and each odds range is actually doing.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      <div
        style={{ background: INK }}
        className="rounded p-4 mb-4 flex justify-between"
      >
        <Stat label="Bets settled" value={all.n} />
        <Stat label="Staked" value={money(all.staked)} />
        <Stat
          label="Net"
          value={money(all.net)}
          color={all.net >= 0 ? WIN : LOSS}
        />
        <Stat
          label="ROI"
          value={`${all.roi >= 0 ? "+" : ""}${all.roi.toFixed(0)}%`}
          color={all.roi >= 0 ? WIN : LOSS}
        />
      </div>

      <Table title="By angle" rows={byAngle} />
      <Table title="By odds range" rows={byBand} />

      <Export bets={bets} stacks={stacks} />

      <p style={{ color: "#7C7B70" }} className="text-xs mt-4 leading-relaxed">
        Fifteen or twenty bets proves nothing on its own. Keep the log across
        meets — a few hundred bets is where the ROI column starts telling the
        truth. This log is saved in this browser only; clearing site data wipes
        it, so copy it out at the end of the weekend.
      </p>
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div>
      <div style={{ color: "#8A9A90" }} className="text-xs">
        {label}
      </div>
      <div
        style={{ color: color || "#E8B33A", fontFamily: "ui-monospace, monospace" }}
        className="text-lg"
      >
        {value}
      </div>
    </div>
  );
}

function Table({ title, rows }) {
  if (rows.length === 0) return null;
  return (
    <div className="mb-5">
      <div
        style={{ fontFamily: "Georgia, serif", borderBottom: `1px solid ${RULE}` }}
        className="text-base pb-1 mb-1"
      >
        {title}
      </div>
      {rows.map((r) => (
        <div
          key={r.name}
          style={{ borderBottom: `1px solid ${RULE}` }}
          className="flex justify-between items-center py-2 text-sm"
        >
          <div>
            <div>{r.name}</div>
            <div style={{ color: "#7C7B70" }} className="text-xs">
              {r.n} bets · {r.hit.toFixed(0)}% hit
            </div>
          </div>
          <div className="text-right">
            <div
              style={{
                color: r.net >= 0 ? WIN : LOSS,
                fontFamily: "ui-monospace, monospace",
              }}
            >
              {money(r.net)}
            </div>
            <div style={{ color: "#7C7B70" }} className="text-xs">
              {r.roi >= 0 ? "+" : ""}
              {r.roi.toFixed(0)}% ROI
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Trainers() {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("starts");

  const needle = q.trim().toLowerCase();
  let rows = TRAINERS.filter((t) => !needle || t[0].toLowerCase().includes(needle));

  // Total ITM is weighted across both surfaces — every start counts once —
  // rather than averaging the two percentages, which would give a five-start
  // surface the same say as a sixty-start one.
  const totStarts = (t) => t[1] + t[4];
  const totItm = (t) => t[3] + t[6];

  if (sort === "turf") {
    rows = rows.filter((t) => t[1] >= THIN);
    rows.sort((a, b) => b[2] / b[1] - a[2] / a[1]);
  } else if (sort === "dirt") {
    rows = rows.filter((t) => t[4] >= THIN);
    rows.sort((a, b) => b[5] / b[4] - a[5] / a[4]);
  } else if (sort === "itm") {
    rows = rows.filter((t) => totStarts(t) >= THIN * 2);
    rows.sort((a, b) => totItm(b) / totStarts(b) - totItm(a) / totStarts(a));
  } else {
    rows = rows.slice().sort((a, b) => b[1] + b[4] - (a[1] + a[4]));
  }

  return (
    <div className="px-4 py-3">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search trainer"
        style={{ border: `1px solid ${RULE}`, background: "#fff" }}
        className="w-full px-3 py-2 rounded mb-3 text-base"
      />

      <Row label="Sort by">
        <Pill on={sort === "starts"} onClick={() => setSort("starts")}>
          Most starts
        </Pill>
        <Pill on={sort === "turf"} onClick={() => setSort("turf")}>
          Turf win%
        </Pill>
        <Pill on={sort === "dirt"} onClick={() => setSort("dirt")}>
          Dirt win%
        </Pill>
        <Pill on={sort === "itm"} onClick={() => setSort("itm")}>
          Total ITM
        </Pill>
      </Row>

      {sort !== "starts" && (
        <p style={{ color: "#7C7B70" }} className="text-xs mb-2">
          {sort === "itm"
            ? `In the money over both surfaces combined, ${THIN * 2}+ starts. Weighted by starts, not an average of the two percentages.`
            : `Showing only trainers with ${THIN}+ starts on that surface — a 100% win rate off two starts isn't a fact.`}
        </p>
      )}

      <div
        style={{ borderBottom: `1px solid ${RULE}`, color: "#7C7B70" }}
        className="flex text-xs pb-1"
      >
        <div className="flex-1">Trainer</div>
        <div style={{ width: 92 }} className="text-right">
          Turf
        </div>
        <div style={{ width: 92 }} className="text-right">
          Dirt
        </div>
      </div>

      {rows.length === 0 && (
        <p style={{ color: "#7C7B70" }} className="text-sm py-6">
          No trainer by that name in the Fall 2025 or Spring 2026 standings. If
          he's shipping in for a stakes, that's expected — and worth noting, since
          it means no Keeneland form to go on.
        </p>
      )}

      {rows.map((t) => (
        <div
          key={t[0]}
          style={{ borderBottom: `1px solid ${RULE}` }}
          className="flex items-center py-2"
        >
          <div className="flex-1 min-w-0 pr-2">
            <div className="text-sm truncate">{t[0]}</div>
            {sort === "itm" && (
              <div
                style={{ color: "#7C7B70", fontFamily: "ui-monospace, monospace" }}
                className="text-xs leading-tight"
              >
                {rate(t[3] + t[6], t[1] + t[4]).toFixed(0)}% itm ·{" "}
                {t[1] + t[4]} st
              </div>
            )}
          </div>
          <Surface st={t[1]} w={t[2]} itm={t[3]} />
          <Surface st={t[4]} w={t[5]} itm={t[6]} />
        </div>
      ))}

      <p style={{ color: "#7C7B70" }} className="text-xs mt-4 leading-relaxed">
        Keeneland standings, Fall 2025 and Spring 2026 combined — {TRAINERS.length}{" "}
        trainers, {" "}
        {TRAINERS.reduce((s, t) => s + t[1] + t[4], 0).toLocaleString()} starts.
        Top figure is win%, below it starts-wins and in-the-money%. Greyed rows are
        under {THIN} starts on that surface: read them as "has run here," not as a
        rate. These are meet-wide numbers — they say nothing about a barn's record
        with first-time starters, two-year-olds, or horses off a layoff, which is
        usually where the real trainer edge lives.
      </p>
    </div>
  );
}

function Surface({ st, w, itm }) {
  if (!st) {
    return (
      <div style={{ width: 92, color: "#B8B7AC" }} className="text-right text-xs">
        —
      </div>
    );
  }
  const thin = st < THIN;
  const win = rate(w, st);
  return (
    <div style={{ width: 92 }} className="text-right">
      <div
        style={{
          fontFamily: "ui-monospace, monospace",
          color: thin ? "#9C9B90" : win >= 20 ? GREEN : INK,
        }}
        className="text-sm leading-tight"
      >
        {win.toFixed(0)}%
      </div>
      <div
        style={{ color: thin ? "#B8B7AC" : "#7C7B70" }}
        className="text-xs leading-tight"
      >
        {st}-{w} · {rate(itm, st).toFixed(0)}% itm
      </div>
    </div>
  );
}

// The mark: JT's licensed clip art, recoloured to the app's palette — cream-gold
// horse, amber money — and embedded so the page carries its own artwork.
const MARK_SRC = "data:image/png;base64,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";

function Mark() {
  return (
    <img
      src={MARK_SRC}
      alt="A racehorse at full gallop, money flying in its wake"
      width="76"
      height="40"
      className="shrink-0"
      style={{ objectFit: "contain" }}
    />
  );
}

// ---- The full card, by day and race. Friday and Saturday carry the
// program's own PACE/SPEED/CLASS ratings and morning lines; Sunday is
// built from the entries only (post, horse, trainer) until that program
// lands. `p` = program handicapper's top pick. ----
const CARD = {
  fri: [
    { r: 1, dist: "7f", surf: "dirt", name: "Starter Allowance, F&M 3+", post: "1:00", wager: "Pick 5 (1-5) starts", runners: [
      { n: 1, h: "Heartbeat", ml: "10/1", jp: 11, t: "Asmussen Steven M.", tp: 16, pa: "94", sp: "75", cl: "110" },
      { n: 2, h: "Sweet Bebsi", ml: "20/1", jp: 13, t: "Walsh Ryan D.", tp: 12, pa: "83", sp: "76", cl: "111" },
      { n: 3, h: "Noroomformischief", ml: "9/2", jp: 10, t: "Ennis John", tp: 14, pa: "89", sp: "80", cl: "112", p: 1 },
      { n: 4, h: "Hollybygolly", ml: "8/1", jp: 12, t: "Mott Riley", tp: 13, pa: "79", sp: "55", cl: "109" },
      { n: 5, h: "Lady Pippa", ml: "20/1", jp: 18, t: "Medina Robert", tp: 5, pa: "92", sp: "71", cl: "110" },
      { n: 6, h: "Our Shenanigan", ml: "6/1", jp: 9, t: "Donjuan Sergio", tp: 10, pa: "72", sp: "74", cl: "112" },
      { n: 7, h: "Modern Sound", ml: "5/1", jp: 14, t: "Radosevich Shelly R.", tp: 13, pa: "75", sp: "79", cl: "112" },
      { n: 8, h: "Queen Of Queens", ml: "3/1", jp: 22, t: "Sharp Joe", tp: 19, pa: "92", sp: "79", cl: "112" },
      { n: 9, h: "Epic Prankster", ml: "12/1", jp: 22, t: "Watkins James M.", tp: 19, pa: "92", sp: "73", cl: "109" },
      { n: 10, h: "Mom's Cheesecake", ml: "20/1", jp: 13, t: "Pierce Lacy", tp: 0, pa: "86", sp: "79", cl: "112" },
      { n: 11, h: "Belle Ofthe Dance", ml: "8/1", jp: 11, t: "Santamaria Carlos", tp: 24, pa: "88", sp: "80", cl: "112" },
    ] },
    { r: 2, dist: "1 1/16m", surf: "dirt", name: "Claiming $16,000, 3+", post: "1:32", wager: "Pick 4 (2-5)", runners: [
      { n: 1, h: "National Eclipse", ml: "5/2", jp: 22, t: "Kenneally Eddie", tp: 15, pa: "95", sp: "82", cl: "113", p: 1 },
      { n: 2, h: "Raising Kane", ml: "10/1", jp: 7, t: "Moreno-Barban Leandro", tp: 14, pa: "86", sp: "75", cl: "111" },
      { n: 3, h: "Jus Too Fly", ml: "20/1", jp: 14, t: "Decker Anna", tp: 22, pa: "70", sp: "75", cl: "112" },
      { n: 4, h: "Mena", ml: "4/1", jp: 22, t: "Moquett Ron", tp: 13, pa: "84", sp: "85", cl: "112" },
      { n: 5, h: "Vino Couragio", ml: "20/1", jp: 17, t: "Campbell Joel", tp: 12, pa: "77", sp: "75", cl: "112" },
      { n: 6, h: "Professor Higgins", ml: "10/1", jp: 13, t: "Holsapple Hutch", tp: 14, pa: "88", sp: "78", cl: "111" },
      { n: 7, h: "Manfredi", ml: "3/1", jp: 16, t: "Casse Norm W.", tp: 17, pa: "88", sp: "71", cl: "111" },
      { n: 8, h: "Special Justice", ml: "10/1", jp: 10, t: "Molloy Thomas", tp: 17, pa: "83", sp: "78", cl: "112" },
      { n: 9, h: "Stolen Power", ml: "8/1", jp: 20, t: "Williams Colby", tp: 12, pa: "78", sp: "82", cl: "112" },
      { n: 10, h: "Contrary Chieftain", ml: "15/1", jp: 14, t: "Shorter Aaron", tp: 8, pa: "85", sp: "47", cl: "106" },
    ] },
    { r: 3, dist: "6f", surf: "dirt", name: "Allowance, 2yo fillies", post: "2:04", wager: "", runners: [
      { n: 1, h: "Sharpie Girl", ml: "8/1", jp: 5, t: "Danner Kelsey", tp: 12, pa: "92", sp: "75", cl: "113" },
      { n: 2, h: "Seaside Startup", ml: "7/2", jp: 24, t: "Brown Chad C.", tp: 22, pa: "94", sp: "81", cl: "114" },
      { n: 3, h: "Velvet Beretta", ml: "20/1", jp: 18, t: "Douaihy Michel", tp: 10, pa: "96", sp: "77", cl: "112" },
      { n: 4, h: "Master Queen", ml: "10/1", jp: 3, t: "Munoz Carlos", tp: 10, pa: "83", sp: "72", cl: "111" },
      { n: 5, h: "Chickies Perch", ml: "8/1", jp: 11, t: "Weaver George", tp: 16, pa: "90", sp: "71", cl: "108" },
      { n: 6, h: "Washton", ml: "4/1", jp: 22, t: "Asmussen Steven M.", tp: 16, pa: "84", sp: "71", cl: "112" },
      { n: 7, h: "Virabhadrasana", ml: "1/1", jp: 24, t: "LaRose Kinnon", tp: 13, pa: "92", sp: "82", cl: "113", p: 1 },
    ] },
    { r: 4, dist: "7f", surf: "dirt", name: "Maiden Special Weight, F&M 3+", post: "2:36", wager: "", runners: [
      { n: 1, h: "Pretty In A Dress", ml: "6/1", jp: 14, t: "Walsh Brendan P.", tp: 16, pa: "86", sp: "77", cl: "109" },
      { n: 2, h: "Hathaway", ml: "20/1", jp: 18, t: "Douaihy Michel", tp: 10, pa: "—", sp: "—", cl: "—" },
      { n: 3, h: "Cartier Gold", ml: "12/1", jp: 16, t: "Servis John C.", tp: 14, pa: "71", sp: "74", cl: "110" },
      { n: 4, h: "Shewontbudge", ml: "6/1", jp: 21, t: "Spicer James T.", tp: 11, pa: "84", sp: "84", cl: "114" },
      { n: 5, h: "Fast Gun", ml: "4/1", jp: 22, t: "Asmussen Steven M.", tp: 16, pa: "81", sp: "82", cl: "112", p: 1 },
      { n: 6, h: "Touch Of An Angel", ml: "10/1", jp: 12, t: "D'Amato Philip", tp: 18, pa: "82", sp: "70", cl: "110" },
      { n: 7, h: "Rules And Regs", ml: "5/1", jp: 12, t: "Wilkes Ian R.", tp: 13, pa: "75", sp: "74", cl: "112" },
      { n: 8, h: "Maxfield's Dream", ml: "50/1", jp: 17, t: "Pompell Robert", tp: 9, pa: "86", sp: "66", cl: "107" },
      { n: 9, h: "Parisinthespring", ml: "15/1", jp: 16, t: "Oliver Victoria H.", tp: 12, pa: "80", sp: "74", cl: "110" },
      { n: 10, h: "Crawford", ml: "20/1", jp: 22, t: "Delacour Arnaud", tp: 22, pa: "85", sp: "74", cl: "110" },
      { n: 11, h: "Cognition", ml: "8/1", jp: 24, t: "Brown Chad C.", tp: 22, pa: "88", sp: "73", cl: "109" },
      { n: 12, h: "Staged", ml: "9/2", jp: 24, t: "Mott William I.", tp: 16, pa: "—", sp: "—", cl: "—" },
    ] },
    { r: 5, dist: "5½f", surf: "turf", name: "Allowance, 3yo fillies", post: "3:08", wager: "Pick 6 (5-10) · Turf Pick 3 (5,8,10)", runners: [
      { n: 1, h: "Quiet Street", ml: "10/1", jp: 24, t: "Mott William I.", tp: 16, pa: "86", sp: "86", cl: "115" },
      { n: 2, h: "La Puma", ml: "8/1", jp: 11, t: "Hernandez Rey", tp: 18, pa: "100", sp: "87", cl: "113" },
      { n: 3, h: "Gerrards Cross", ml: "10/1", jp: 18, t: "O'Connell Kathleen", tp: 19, pa: "100", sp: "87", cl: "115" },
      { n: 4, h: "Should've", ml: "12/1", jp: 22, t: "Ward Wesley A.", tp: 25, pa: "95", sp: "87", cl: "114" },
      { n: 5, h: "Alpenglow", ml: "30/1", jp: 14, t: "D'Angelo Jose Francisco", tp: 14, pa: "97", sp: "79", cl: "112" },
      { n: 6, h: "Rocket Rania", ml: "30/1", jp: 11, t: "Matejka Pavel", tp: 13, pa: "90", sp: "86", cl: "114" },
      { n: 7, h: "Now Or Nevermore", ml: "12/1", jp: 13, t: "Banks Chris", tp: 17, pa: "93", sp: "76", cl: "111" },
      { n: 8, h: "Pillar Of Beauty", ml: "8/1", jp: 16, t: "Mott William I.", tp: 16, pa: "94", sp: "84", cl: "114" },
      { n: 9, h: "Triskelion", ml: "12/1", jp: 16, t: "Arnold, II G. R.", tp: 15, pa: "98", sp: "85", cl: "113" },
      { n: 10, h: "Light Won Up", ml: "9/2", jp: 22, t: "O'Neill Doug", tp: 16, pa: "96", sp: "88", cl: "115", p: 1 },
      { n: 11, h: "Cadenza", ml: "7/2", jp: 24, t: "Cox Brad H.", tp: 25, pa: "94", sp: "86", cl: "115" },
      { n: 12, h: "Laigina", ml: "5/1", jp: 11, t: "Biancone Patrick L.", tp: 16, pa: "86", sp: "85", cl: "115" },
      { n: 13, h: "Office", ml: "10/1", jp: 16, t: "Beckman D. Whitworth", tp: 15, pa: "108", sp: "80", cl: "112" },
      { n: 14, h: "Storm Cloud Rising", ml: "20/1", jp: 22, t: "Cambray Andres", tp: 4, pa: "92", sp: "86", cl: "112" },
    ] },
    { r: 6, dist: "6f", surf: "dirt", name: "Maiden Special Weight, 2yo", post: "3:40", wager: "Pick 5 (6-10)", runners: [
      { n: 1, h: "Super Saiyajin", ml: "30/1", jp: 9, t: "Donjuan Sergio", tp: 10, pa: "90", sp: "58", cl: "107" },
      { n: 2, h: "General Jack", ml: "6/1", jp: 24, t: "Walsh Brendan P.", tp: 16, pa: "—", sp: "—", cl: "—" },
      { n: 3, h: "Kingside", ml: "7/2", jp: 14, t: "Walsh Brendan P.", tp: 16, pa: "—", sp: "—", cl: "—" },
      { n: 4, h: "Saltwater Soul", ml: "12/1", jp: 11, t: "Mott Riley", tp: 13, pa: "—", sp: "—", cl: "—" },
      { n: 5, h: "Overtime Bonus", ml: "8/1", jp: 22, t: "Casse Mark E.", tp: 16, pa: "92", sp: "72", cl: "110" },
      { n: 6, h: "T V Time Out", ml: "6/1", jp: 16, t: "Asmussen Steven M.", tp: 16, pa: "92", sp: "79", cl: "111" },
      { n: 7, h: "Redmoor", ml: "15/1", jp: 14, t: "Diodoro Robertino", tp: 25, pa: "—", sp: "—", cl: "—" },
      { n: 8, h: "National Forest", ml: "8/5", jp: 24, t: "Cox Brad H.", tp: 25, pa: "95", sp: "83", cl: "116", p: 1 },
      { n: 9, h: "Knicks Diamonds", ml: "15/1", jp: 18, t: "Sims Matthew P.", tp: 12, pa: "—", sp: "—", cl: "—" },
      { n: 10, h: "Drain The Bourbon", ml: "20/1", jp: 12, t: "Wilkes Ian R.", tp: 13, pa: "—", sp: "—", cl: "—" },
    ] },
    { r: 7, dist: "6f", surf: "dirt", name: "Stoll Keenon Ogden Phoenix (G2)", post: "4:12", wager: "Pick 4 (7-10)", runners: [
      { n: 1, h: "Mad House", ml: "10/1", jp: 14, t: "VanWinkle David", tp: 5, pa: "102", sp: "95", cl: "118" },
      { n: 2, h: "Booth", ml: "6/1", jp: 22, t: "Asmussen Steven M.", tp: 16, pa: "98", sp: "80", cl: "115" },
      { n: 3, h: "Little Thunder", ml: "15/1", jp: 16, t: "Hamm Timothy E.", tp: 16, pa: "98", sp: "94", cl: "116" },
      { n: 4, h: "Verifire", ml: "5/2", jp: 24, t: "Cox Brad H.", tp: 25, pa: "101", sp: "97", cl: "119", p: 1 },
      { n: 5, h: "Classic Of Course", ml: "20/1", jp: 16, t: "Biancone Patrick L.", tp: 16, pa: "90", sp: "90", cl: "117" },
      { n: 6, h: "Viking", ml: "8/1", jp: 14, t: "Fawkes David", tp: 20, pa: "103", sp: "90", cl: "117" },
      { n: 7, h: "C K Wonder", ml: "30/1", jp: 13, t: "Romans Dale L.", tp: 11, pa: "93", sp: "91", cl: "117" },
      { n: 8, h: "Hymn", ml: "4/1", jp: 15, t: "Moquett Ron", tp: 13, pa: "97", sp: "100", cl: "121" },
      { n: 9, h: "Jack's Promise", ml: "30/1", jp: 12, t: "Romans Dale L.", tp: 11, pa: "103", sp: "92", cl: "118" },
      { n: 10, h: "Nakatomi", ml: "7/2", jp: 24, t: "Ward Wesley A.", tp: 25, pa: "93", sp: "94", cl: "117" },
      { n: 11, h: "Here Mi Song", ml: "15/1", jp: 9, t: "Stinson, Jr. William", tp: 0, pa: "95", sp: "93", cl: "117" },
    ] },
    { r: 8, dist: "1 1/16m", surf: "turf", name: "Jessamine (G2)", post: "4:44", wager: "Late Pick 3 (8-10)", runners: [
      { n: 1, h: "Pros And Cons", ml: "12/1", jp: 22, t: "Casse Mark E.", tp: 16, pa: "92", sp: "80", cl: "114" },
      { n: 2, h: "Mel Went Home", ml: "15/1", jp: 14, t: "Medina Robert", tp: 5, pa: "78", sp: "75", cl: "113" },
      { n: 3, h: "Monique En Vol", ml: "4/1", jp: 24, t: "Cox Brad H.", tp: 25, pa: "75", sp: "81", cl: "108" },
      { n: 4, h: "Beautiful Harper", ml: "15/1", jp: 14, t: "DeVaux Cherie", tp: 17, pa: "80", sp: "74", cl: "110" },
      { n: 5, h: "Seneca Park", ml: "9/2", jp: 12, t: "Stewart Dallas", tp: 21, pa: "93", sp: "86", cl: "115", p: 1 },
      { n: 6, h: "Glycogen", ml: "8/1", jp: 16, t: "Servis John C.", tp: 14, pa: "77", sp: "73", cl: "114" },
      { n: 7, h: "Golden Maiden", ml: "12/1", jp: 15, t: "McPeek Kenneth G.", tp: 16, pa: "72", sp: "79", cl: "113" },
      { n: 8, h: "Lucky Bernadine", ml: "9/2", jp: 24, t: "Cox Brad H.", tp: 25, pa: "76", sp: "73", cl: "110" },
      { n: 9, h: "Quibbler", ml: "15/1", jp: 11, t: "Mott Riley", tp: 13, pa: "74", sp: "72", cl: "112" },
      { n: 10, h: "Serenas Ghost", ml: "10/1", jp: 16, t: "Sharp Joe", tp: 19, pa: "66", sp: "68", cl: "106" },
      { n: 11, h: "Elegante Miz", ml: "8/1", jp: 11, t: "Biancone Patrick L.", tp: 16, pa: "99", sp: "79", cl: "114" },
      { n: 12, h: "Mightily", ml: "15/1", jp: 13, t: "O'Dwyer Jeremiah", tp: 17, pa: "65", sp: "74", cl: "111" },
    ] },
    { r: 9, dist: "1 1/16m", surf: "dirt", name: "Darley Alcibiades (G1)", post: "5:16", wager: "", runners: [
      { n: 1, h: "Emphatic", ml: "4/1", jp: 14, t: "Walsh Brendan P.", tp: 16, pa: "84", sp: "83", cl: "116" },
      { n: 2, h: "For The Money", ml: "30/1", jp: 15, t: "Crichton Rohan G.", tp: 19, pa: "90", sp: "76", cl: "111" },
      { n: 3, h: "Ever Forward", ml: "20/1", jp: 12, t: "Walsh Brendan P.", tp: 16, pa: "92", sp: "81", cl: "114" },
      { n: 4, h: "Oh She Said Yes", ml: "10/1", jp: 17, t: "McPeek Kenneth G.", tp: 16, pa: "91", sp: "84", cl: "116" },
      { n: 5, h: "Summer Starlet", ml: "4/5", jp: 24, t: "Asmussen Steven M.", tp: 16, pa: "89", sp: "95", cl: "120", p: 1 },
      { n: 6, h: "Forever Carina", ml: "9/2", jp: 22, t: "Brown Chad C.", tp: 22, pa: "74", sp: "84", cl: "115" },
      { n: 7, h: "High Speed Reed", ml: "8/1", jp: 16, t: "Casse Mark E.", tp: 16, pa: "82", sp: "79", cl: "115" },
      { n: 8, h: "Elewene", ml: "15/1", jp: 16, t: "Romans Dale L.", tp: 11, pa: "94", sp: "83", cl: "117" },
    ] },
    { r: 10, dist: "1 3/16m", surf: "turf", name: "Allowance, 3+", post: "5:48", wager: "Super High Five", runners: [
      { n: 1, h: "Chillax", ml: "20/1", jp: 15, t: "Jacobson David", tp: 14, pa: "88", sp: "86", cl: "113" },
      { n: 2, h: "Highly Connected", ml: "15/1", jp: 18, t: "Williams Matt", tp: 11, pa: "84", sp: "87", cl: "112" },
      { n: 3, h: "Quiet Mischief", ml: "30/1", jp: 11, t: "McKeever Andrew", tp: 12, pa: "89", sp: "75", cl: "110" },
      { n: 4, h: "Lahainaluna", ml: "12/1", jp: 16, t: "Sharp Joe", tp: 19, pa: "78", sp: "86", cl: "112" },
      { n: 5, h: "Timestream", ml: "30/1", jp: 22, t: "Molloy Thomas", tp: 17, pa: "80", sp: "77", cl: "111" },
      { n: 6, h: "Michael's Cove", ml: "15/1", jp: 12, t: "Newton Troy", tp: 13, pa: "85", sp: "85", cl: "113" },
      { n: 7, h: "My Boy Tony", ml: "8/1", jp: 14, t: "Kenneally Eddie", tp: 15, pa: "106", sp: "89", cl: "114" },
      { n: 8, h: "Kravitz", ml: "10/1", jp: 16, t: "Motion H. Graham", tp: 17, pa: "84", sp: "83", cl: "113" },
      { n: 9, h: "Lazlo", ml: "5/1", jp: 24, t: "Maker Michael J.", tp: 18, pa: "86", sp: "84", cl: "113" },
      { n: 10, h: "Caragogo", ml: "6/1", jp: 9, t: "Arnold, II G. R.", tp: 15, pa: "92", sp: "81", cl: "112" },
      { n: 11, h: "Doctrine", ml: "4/1", jp: 24, t: "Cox Brad H.", tp: 25, pa: "85", sp: "91", cl: "114", p: 1 },
      { n: 12, h: "The Brigade", ml: "3/1", jp: 22, t: "Casse Mark E.", tp: 16, pa: "94", sp: "88", cl: "115" },
      { n: 13, h: "Shure", ml: "15/1", jp: 10, t: "Corrigan Jimmy", tp: 13, pa: "84", sp: "81", cl: "113" },
      { n: 14, h: "Ramblin", ml: "30/1", jp: 11, t: "Lobo Paulo H.", tp: 16, pa: "75", sp: "74", cl: "110" },
    ] },
  ],
  sat: [
    { r: 1, dist: "7f", surf: "dirt", name: "Maiden Special Weight, 3+", post: "1:00", wager: "Pick 5 (1-5) starts", runners: [
      { n: 1, h: "Ur A Collection", ml: "8/1", jp: 11, t: "Schultz Lindsay", tp: 13, pa: "98", sp: "72", cl: "108" },
      { n: 2, h: "Commentate", ml: "3/1", jp: 22, t: "DeVaux Cherie", tp: 17, pa: "57", sp: "78", cl: "110" },
      { n: 3, h: "Summit Ridge", ml: "12/1", jp: 9, t: "Sweezey J. Kent", tp: 13, pa: "88", sp: "80", cl: "113" },
      { n: 4, h: "Dream Machine", ml: "9/5", jp: 24, t: "Brown Chad C.", tp: 22, pa: "89", sp: "63", cl: "109", p: 1 },
      { n: 5, h: "Alworth", ml: "9/2", jp: 16, t: "Davis Christopher", tp: 11, pa: "86", sp: "75", cl: "110" },
      { n: 6, h: "Noble Anthem", ml: "12/1", jp: 16, t: "Oliver Victoria H.", tp: 12, pa: "83", sp: "71", cl: "110" },
      { n: 7, h: "Mayfield", ml: "6/1", jp: 14, t: "Walsh Brendan P.", tp: 16, pa: "86", sp: "68", cl: "107" },
      { n: 8, h: "Unlimited", ml: "10/1", jp: 14, t: "Mott Riley", tp: 13, pa: "—", sp: "—", cl: "—" },
    ] },
    { r: 2, dist: "6f", surf: "dirt", name: "Allowance, 2yo", post: "1:32", wager: "Pick 4 (2-5)", runners: [
      { n: 1, h: "Chancery", ml: "8/5", jp: 12, t: "Arnold II G. R.", tp: 15, pa: "93", sp: "85", cl: "114", p: 1 },
      { n: 2, h: "Game Sayayin", ml: "8/1", jp: 16, t: "Delgado Jose H.", tp: 7, pa: "—", sp: "83", cl: "112" },
      { n: 3, h: "Never A Doubt", ml: "6/1", jp: 14, t: "David Carlos A.", tp: 20, pa: "92", sp: "78", cl: "113" },
      { n: 4, h: "Never Sleep", ml: "5/1", jp: 17, t: "Rivelli Larry", tp: 27, pa: "107", sp: "80", cl: "112" },
      { n: 5, h: "Dormie", ml: "4/1", jp: 16, t: "Block Chris M.", tp: 18, pa: "92", sp: "76", cl: "113" },
      { n: 6, h: "Maker Of Mischief", ml: "3/1", jp: 22, t: "West Ethan W.", tp: 13, pa: "84", sp: "70", cl: "104" },
    ] },
    { r: 3, dist: "1 3/16m", surf: "turf", name: "Allowance, F&M 3+", post: "2:04", wager: "", runners: [
      { n: 1, h: "Marcinkowski", ml: "8/1", jp: 16, t: "Oliver Victoria H.", tp: 12, pa: "80", sp: "79", cl: "112" },
      { n: 2, h: "Temple Goddess", ml: "30/1", jp: 10, t: "Corrigan Jimmy", tp: 13, pa: "82", sp: "78", cl: "112" },
      { n: 3, h: "Market Chill", ml: "8/1", jp: 24, t: "Brown Chad C.", tp: 22, pa: "81", sp: "81", cl: "112" },
      { n: 4, h: "Paseo", ml: "10/1", jp: 12, t: "Wilkes Ian R.", tp: 13, pa: "77", sp: "81", cl: "114" },
      { n: 5, h: "Episist", ml: "6/1", jp: 22, t: "Asmussen Steven M.", tp: 16, pa: "79", sp: "83", cl: "113" },
      { n: 6, h: "Miss Pharaoh", ml: "12/1", jp: 11, t: "Sims Matthew P.", tp: 12, pa: "79", sp: "80", cl: "113" },
      { n: 7, h: "Winning Streep", ml: "20/1", jp: 15, t: "Servis John C.", tp: 14, pa: "88", sp: "86", cl: "113" },
      { n: 8, h: "Classic Glide", ml: "15/1", jp: 14, t: "Medina Robert", tp: 5, pa: "83", sp: "84", cl: "114" },
      { n: 9, h: "Charm Of Venice", ml: "5/1", jp: 14, t: "Walsh Brendan P.", tp: 16, pa: "80", sp: "84", cl: "115" },
      { n: 10, h: "Siouxse", ml: "9/2", jp: 16, t: "Motion H. Graham", tp: 17, pa: "77", sp: "82", cl: "113" },
      { n: 11, h: "Tulip", ml: "3/1", jp: 14, t: "Walden William", tp: 25, pa: "96", sp: "86", cl: "115", p: 1 },
    ] },
    { r: 4, dist: "6½f", surf: "dirt", name: "Allowance Opt Clm $100k, 3+", post: "2:36", wager: "", runners: [
      { n: 1, h: "Autodrive", ml: "9/2", jp: 12, t: "Calhoun W. Bret", tp: 19, pa: "92", sp: "88", cl: "115" },
      { n: 2, h: "Floodlites", ml: "7/5", jp: 16, t: "Ward Wesley A.", tp: 26, pa: "99", sp: "92", cl: "117", p: 1 },
      { n: 3, h: "C K Wonder", ml: "5/2", jp: 22, t: "Romans Dale L.", tp: 11, pa: "93", sp: "91", cl: "117" },
      { n: 4, h: "Durante", ml: "6/1", jp: 24, t: "Jacobson David", tp: 14, pa: "93", sp: "80", cl: "114" },
      { n: 5, h: "Touch Of Destiny", ml: "30/1", jp: 10, t: "Aranha Jose L.", tp: 11, pa: "89", sp: "64", cl: "111" },
      { n: 6, h: "Lips Say Bliss", ml: "7/2", jp: 14, t: "Medina Robert", tp: 5, pa: "85", sp: "89", cl: "116" },
    ] },
    { r: 5, dist: "1 1/8m", surf: "dirt", name: "Allowance Opt Clm $80k, 3+", post: "3:08", wager: "Pick 6 (5-10)", runners: [
      { n: 1, h: "Urban Planner", ml: "12/1", jp: 14, t: "Jacobson David", tp: 14, pa: "78", sp: "88", cl: "117" },
      { n: 2, h: "Render Judgment", ml: "7/2", jp: 22, t: "McPeek Kenneth G.", tp: 16, pa: "83", sp: "91", cl: "117" },
      { n: 3, h: "First Resort", ml: "8/1", jp: 16, t: "Harty Eoin G.", tp: 11, pa: "86", sp: "85", cl: "115" },
      { n: 4, h: "Stowaway", ml: "6/1", jp: 17, t: "Beckman D. Whitworth", tp: 15, pa: "89", sp: "102", cl: "119" },
      { n: 5, h: "Groveland", ml: "20/1", jp: 18, t: "Kenneally Eddie", tp: 15, pa: "96", sp: "90", cl: "116" },
      { n: 6, h: "Copper Missile", ml: "20/1", jp: 15, t: "Sims Matthew P.", tp: 12, pa: "76", sp: "83", cl: "112" },
      { n: 7, h: "Archie The Giza", ml: "10/1", jp: 14, t: "Medina Robert", tp: 5, pa: "85", sp: "82", cl: "114" },
      { n: 8, h: "Can't Hush This", ml: "30/1", jp: 15, t: "West Ethan W.", tp: 13, pa: "95", sp: "87", cl: "115" },
      { n: 9, h: "Bullard", ml: "5/2", jp: 24, t: "McCarthy Michael W.", tp: 13, pa: "90", sp: "91", cl: "117" },
      { n: 10, h: "Who Dey", ml: "4/1", jp: 12, t: "Drury, Jr. Thomas", tp: 12, pa: "82", sp: "97", cl: "118", p: 1 },
    ] },
    { r: 6, dist: "5½f", surf: "turf", name: "Woodford (G2)", post: "3:40", wager: "Pick 5 (6-10) · Turf Pick 3 (6,8,10)", runners: [
      { n: 1, h: "Script", ml: "20/1", jp: 16, t: "Arnold II G. R.", tp: 15, pa: "92", sp: "86", cl: "115" },
      { n: 2, h: "Mondogetsbuckets", ml: "15/1", jp: 15, t: "Block Chris M.", tp: 18, pa: "94", sp: "86", cl: "116" },
      { n: 3, h: "No Nay Hudson", ml: "8/1", jp: 22, t: "Ward Wesley A.", tp: 26, pa: "—", sp: "92", cl: "117" },
      { n: 4, h: "Nobals", ml: "15/1", jp: 9, t: "Rivelli Larry", tp: 27, pa: "99", sp: "87", cl: "115" },
      { n: 5, h: "Okiro", ml: "12/1", jp: 14, t: "Garoffalo Jose", tp: 13, pa: "88", sp: "87", cl: "116" },
      { n: 6, h: "Joe Shiesty", ml: "5/2", jp: 16, t: "Foster Eric N.", tp: 13, pa: "101", sp: "93", cl: "117", p: 1 },
      { n: 7, h: "Motorious", ml: "4/1", jp: 21, t: "D'Amato Philip", tp: 18, pa: "—", sp: "89", cl: "117" },
      { n: 8, h: "My Boy Prince", ml: "5/1", jp: 16, t: "Casse Mark E.", tp: 16, pa: "92", sp: "87", cl: "116" },
      { n: 9, h: "Its Bourbon Thirty", ml: "20/1", jp: 13, t: "O'Dwyer Jeremiah", tp: 17, pa: "96", sp: "81", cl: "114" },
      { n: 10, h: "Doncho", ml: "7/2", jp: 24, t: "Lovell Michelle", tp: 17, pa: "104", sp: "94", cl: "117" },
    ] },
    { r: 7, dist: "6½f", surf: "dirt", name: "Thoroughbred Club of America (G2)", post: "4:12", wager: "Pick 4 (7-10)", runners: [
      { n: 1, h: "Praying", ml: "12/1", jp: 16, t: "Medina Robert", tp: 5, pa: "94", sp: "79", cl: "114" },
      { n: 2, h: "Jersey Pearl", ml: "15/1", jp: 18, t: "Miller Darrin", tp: 11, pa: "94", sp: "87", cl: "117" },
      { n: 3, h: "Queen's Martini", ml: "30/1", jp: 14, t: "Moquett Ron", tp: 13, pa: "94", sp: "87", cl: "117" },
      { n: 4, h: "Evanescence", ml: "4/1", jp: 22, t: "Kenneally Eddie", tp: 15, pa: "90", sp: "95", cl: "119" },
      { n: 5, h: "Zeitlos", ml: "6/1", jp: 12, t: "Asmussen Steven M.", tp: 16, pa: "98", sp: "92", cl: "117" },
      { n: 6, h: "Eclatant", ml: "6/5", jp: 24, t: "Cox Brad H.", tp: 25, pa: "98", sp: "90", cl: "120", p: 1 },
      { n: 7, h: "Echo Sound", ml: "5/2", jp: 16, t: "Arnold II G. R.", tp: 15, pa: "102", sp: "88", cl: "118" },
    ] },
    { r: 8, dist: "1m", surf: "turf", name: "First Lady (G1)", post: "4:44", wager: "Pick 4 (8-11)", runners: [
      { n: 1, h: "Pin Up Betty", ml: "20/1", jp: 14, t: "Maker Michael J.", tp: 18, pa: "91", sp: "91", cl: "116" },
      { n: 2, h: "Lush Lips", ml: "8/1", jp: 14, t: "Walsh Brendan P.", tp: 16, pa: "92", sp: "88", cl: "116" },
      { n: 3, h: "Mandanaba", ml: "7/2", jp: 21, t: "Graffard Francis - Henri", tp: 0, pa: "98", sp: "94", cl: "118", p: 1 },
      { n: 4, h: "Expensive Queen", ml: "9/2", jp: 16, t: "Walsh Brendan P.", tp: 16, pa: "94", sp: "92", cl: "118" },
      { n: 5, h: "And One More Time", ml: "10/1", jp: 15, t: "Casse Mark E.", tp: 16, pa: "98", sp: "92", cl: "118" },
      { n: 6, h: "Deep Satin", ml: "8/1", jp: 22, t: "DeVaux Cherie", tp: 17, pa: "91", sp: "91", cl: "117" },
      { n: 7, h: "Love You Anyway", ml: "30/1", jp: 12, t: "Arnold II G. R.", tp: 15, pa: "86", sp: "77", cl: "114" },
      { n: 8, h: "Segesta", ml: "3/1", jp: 24, t: "Brown Chad C.", tp: 22, pa: "96", sp: "94", cl: "118" },
      { n: 9, h: "Classic Q", ml: "10/1", jp: 16, t: "Casse Mark E.", tp: 16, pa: "98", sp: "91", cl: "118" },
      { n: 10, h: "Bless The Broken", ml: "12/1", jp: 12, t: "Cox Brad H.", tp: 25, pa: "98", sp: "95", cl: "118" },
      { n: 11, h: "Vina Arana", ml: "20/1", jp: 5, t: "Sisterson Jack", tp: 20, pa: "100", sp: "92", cl: "117" },
    ] },
    { r: 9, dist: "1 1/16m", surf: "dirt", name: "Claiborne Breeders' Futurity (G1)", post: "5:16", wager: "Late Pick 3 (9-11)", runners: [
      { n: 1, h: "Coach Pope", ml: "4/5", jp: 22, t: "McPeek Kenneth G.", tp: 16, pa: "93", sp: "94", cl: "117", p: 1 },
      { n: 2, h: "Q B Rocket", ml: "2/1", jp: 14, t: "Cox Brad H.", tp: 25, pa: "98", sp: "95", cl: "117" },
      { n: 3, h: "Phone Booth", ml: "12/1", jp: 21, t: "O'Neill Doug", tp: 16, pa: "88", sp: "87", cl: "116" },
      { n: 4, h: "Title Worthy", ml: "20/1", jp: 9, t: "Stewart Dallas", tp: 21, pa: "95", sp: "75", cl: "115" },
      { n: 5, h: "Jaded", ml: "15/1", jp: 24, t: "Casse Mark E.", tp: 16, pa: "77", sp: "79", cl: "109" },
      { n: 6, h: "American History", ml: "4/1", jp: 16, t: "Pletcher Todd A.", tp: 16, pa: "79", sp: "83", cl: "116" },
    ] },
    { r: 10, dist: "1m", surf: "turf", name: "Coolmore Turf Mile (G1)", post: "5:48", wager: "", runners: [
      { n: 1, h: "Title Role", ml: "12/1", jp: 16, t: "Walsh Brendan P.", tp: 16, pa: "88", sp: "90", cl: "116" },
      { n: 2, h: "Brilliant Berti", ml: "6/1", jp: 12, t: "DeVaux Cherie", tp: 17, pa: "92", sp: "93", cl: "119" },
      { n: 3, h: "Rhetorical", ml: "2/1", jp: 24, t: "Walden William", tp: 25, pa: "104", sp: "97", cl: "119" },
      { n: 4, h: "Mercante", ml: "15/1", jp: 21, t: "Knippenberg Brian", tp: 11, pa: "96", sp: "94", cl: "117" },
      { n: 5, h: "Pass The Hat", ml: "8/1", jp: 14, t: "Mott William I.", tp: 16, pa: "96", sp: "95", cl: "118" },
      { n: 6, h: "Plensa", ml: "30/1", jp: 12, t: "Arnold II G. R.", tp: 15, pa: "92", sp: "90", cl: "116" },
      { n: 7, h: "Lake Forest", ml: "4/1", jp: 0, t: "Haggas William J.", tp: 0, pa: "—", sp: "—", cl: "121", p: 1 },
      { n: 8, h: "Kupuna", ml: "15/1", jp: 14, t: "Casse Norm W.", tp: 17, pa: "101", sp: "96", cl: "118" },
      { n: 9, h: "Zulu Kingdom", ml: "3/1", jp: 22, t: "Brown Chad C.", tp: 22, pa: "94", sp: "93", cl: "118" },
    ] },
    { r: 11, dist: "6f", surf: "dirt", name: "Maiden Special Weight, 2yo fillies", post: "6:20", wager: "Super High Five", runners: [
      { n: 1, h: "Niosa", ml: "5/1", jp: 14, t: "D'Amato Philip", tp: 18, pa: "—", sp: "—", cl: "—" },
      { n: 2, h: "Right In Time", ml: "9/2", jp: 14, t: "Mott Riley", tp: 13, pa: "—", sp: "—", cl: "—" },
      { n: 3, h: "Rock Your Dreams", ml: "3/1", jp: 15, t: "McPeek Kenneth G.", tp: 16, pa: "—", sp: "—", cl: "—" },
      { n: 4, h: "Ronna's Sizzler", ml: "20/1", jp: 11, t: "Moquett Ron", tp: 13, pa: "—", sp: "—", cl: "—" },
      { n: 5, h: "Stars In My Eyes", ml: "12/1", jp: 22, t: "Calhoun W. Bret", tp: 19, pa: "—", sp: "—", cl: "—" },
      { n: 6, h: "Neuromap", ml: "20/1", jp: 13, t: "Colebrook Ben", tp: 10, pa: "—", sp: "—", cl: "—" },
      { n: 7, h: "Pastya", ml: "6/1", jp: 16, t: "Arnold II G. R.", tp: 15, pa: "—", sp: "—", cl: "—" },
      { n: 8, h: "Liam's Lucky Lass", ml: "20/1", jp: 9, t: "Wilkes Ian R.", tp: 13, pa: "—", sp: "—", cl: "—" },
      { n: 9, h: "Clock", ml: "12/1", jp: 16, t: "Pletcher Todd A.", tp: 16, pa: "96", sp: "75", cl: "111", p: 1 },
      { n: 10, h: "Rapagna", ml: "8/1", jp: 12, t: "Walden William", tp: 25, pa: "—", sp: "—", cl: "—" },
      { n: 11, h: "Life On Marz", ml: "12/1", jp: 12, t: "Wilkes Ian R.", tp: 13, pa: "—", sp: "—", cl: "—" },
      { n: 12, h: "Nu Why Me", ml: "20/1", jp: 18, t: "DiVito James P.", tp: 13, pa: "86", sp: "70", cl: "109" },
      { n: 13, h: "Speightful Moon", ml: "30/1", jp: 12, t: "Begley Greg", tp: 12, pa: "—", sp: "—", cl: "—" },
      { n: 14, h: "Joy Of Life", ml: "6/1", jp: 14, t: "Mott William I.", tp: 16, pa: "88", sp: "74", cl: "112" },
      { n: 15, h: "Palestra", ml: "8/1", jp: 14, t: "Beckman D. Whitworth", tp: 15, pa: "—", sp: "—", cl: "—" },
      { n: 16, h: "Won'tcatchmecryan", ml: "15/1", jp: 16, t: "David Carlos A.", tp: 20, pa: "90", sp: "62", cl: "105" },
    ] },
  ],
  sun: [
    { r: 1, dist: "7f", surf: "dirt", name: "Starter Allowance, 3+", post: "1:00", wager: "", runners: [
      { n: 1, h: "Lil Trick", ml: "", jp: 0, t: "Rey Hernandez", tp: 0, pa: "", sp: "", cl: "" },
      { n: 2, h: "Good Mojo", ml: "", jp: 0, t: "Norm W. Casse", tp: 0, pa: "", sp: "", cl: "" },
      { n: 3, h: "Just Asap", ml: "", jp: 0, t: "Steven M. Asmussen", tp: 0, pa: "", sp: "", cl: "" },
      { n: 4, h: "Captain Mercury", ml: "", jp: 0, t: "Rohan G. Crichton", tp: 0, pa: "", sp: "", cl: "" },
      { n: 5, h: "Il Cavallino", ml: "", jp: 0, t: "Aaron Shorter", tp: 0, pa: "", sp: "", cl: "" },
      { n: 6, h: "Keep On Moving", ml: "", jp: 0, t: "Michael A. Tomlinson", tp: 0, pa: "", sp: "", cl: "" },
      { n: 7, h: "Capital Connection", ml: "", jp: 0, t: "Carlos Santamaria", tp: 0, pa: "", sp: "", cl: "" },
      { n: 8, h: "Trouble Ahead", ml: "", jp: 0, t: "Cameron Milligan", tp: 0, pa: "", sp: "", cl: "" },
    ] },
    { r: 2, dist: "1 1/16m", surf: "dirt", name: "Maiden Claiming, 3+", post: "1:35", wager: "", runners: [
      { n: 1, h: "Get Them Roses", ml: "", jp: 0, t: "William Walden", tp: 0, pa: "", sp: "", cl: "" },
      { n: 2, h: "Maximum Honor", ml: "", jp: 0, t: "Aaron Shorter", tp: 0, pa: "", sp: "", cl: "" },
      { n: 3, h: "Bedeviled", ml: "", jp: 0, t: "Steven M. Asmussen", tp: 0, pa: "", sp: "", cl: "" },
      { n: 4, h: "Private Show", ml: "", jp: 0, t: "Steven M. Asmussen", tp: 0, pa: "", sp: "", cl: "" },
      { n: 5, h: "Meanstepper", ml: "", jp: 0, t: "Ron Moquett", tp: 0, pa: "", sp: "", cl: "" },
      { n: 6, h: "El Ramundo", ml: "", jp: 0, t: "Troy Newton", tp: 0, pa: "", sp: "", cl: "" },
      { n: 7, h: "Money Man", ml: "", jp: 0, t: "Destin G. Heath", tp: 0, pa: "", sp: "", cl: "" },
      { n: 8, h: "Maginnesontap", ml: "", jp: 0, t: "Brendan P. Walsh", tp: 0, pa: "", sp: "", cl: "" },
    ] },
    { r: 3, dist: "6½f", surf: "dirt", name: "Claiming, 3+", post: "2:10", wager: "", runners: [
      { n: 1, h: "Mom's Spaghetti", ml: "", jp: 0, t: "Anna Navarrete", tp: 0, pa: "", sp: "", cl: "" },
      { n: 2, h: "State Conceal", ml: "", jp: 0, t: "Carlos Munoz", tp: 0, pa: "", sp: "", cl: "" },
      { n: 3, h: "Way Beyond", ml: "", jp: 0, t: "Steven M. Asmussen", tp: 0, pa: "", sp: "", cl: "" },
      { n: 4, h: "Join", ml: "", jp: 0, t: "Shelbi A. Kurtz", tp: 0, pa: "", sp: "", cl: "" },
      { n: 5, h: "Stone County", ml: "", jp: 0, t: "Armando Hernandez", tp: 0, pa: "", sp: "", cl: "" },
      { n: 6, h: "City of Life", ml: "", jp: 0, t: "Troy S. Wismer", tp: 0, pa: "", sp: "", cl: "" },
      { n: 7, h: "Kokomo Joe", ml: "", jp: 0, t: "Matthew P. Sims", tp: 0, pa: "", sp: "", cl: "" },
      { n: 8, h: "Terrapin Station", ml: "", jp: 0, t: "Dale L. Romans", tp: 0, pa: "", sp: "", cl: "" },
    ] },
    { r: 4, dist: "1 1/16m", surf: "dirt", name: "Maiden Special Weight, 2yo", post: "2:45", wager: "", runners: [
      { n: 1, h: "Grantchester", ml: "", jp: 0, t: "Ian R. Wilkes", tp: 0, pa: "", sp: "", cl: "" },
      { n: 2, h: "Just a Holiday", ml: "", jp: 0, t: "Wesley A. Ward", tp: 0, pa: "", sp: "", cl: "" },
      { n: 3, h: "Hickory", ml: "", jp: 0, t: "Cherie DeVaux", tp: 0, pa: "", sp: "", cl: "" },
      { n: 4, h: "Damavand", ml: "", jp: 0, t: "Todd A. Pletcher", tp: 0, pa: "", sp: "", cl: "" },
      { n: 5, h: "Code of Arms", ml: "", jp: 0, t: "Steven M. Asmussen", tp: 0, pa: "", sp: "", cl: "" },
      { n: 6, h: "Barrel Roll", ml: "", jp: 0, t: "Chad C. Brown", tp: 0, pa: "", sp: "", cl: "" },
      { n: 7, h: "Belzoni", ml: "", jp: 0, t: "William I. Mott", tp: 0, pa: "", sp: "", cl: "" },
      { n: 8, h: "Biathlon", ml: "", jp: 0, t: "Victoria H. Oliver", tp: 0, pa: "", sp: "", cl: "" },
      { n: 9, h: "Magical Mikel", ml: "", jp: 0, t: "Kenneth G. McPeek", tp: 0, pa: "", sp: "", cl: "" },
      { n: 10, h: "Stadion", ml: "", jp: 0, t: "Cameron Milligan", tp: 0, pa: "", sp: "", cl: "" },
      { n: 11, h: "Patriots Quest", ml: "", jp: 0, t: "Mark E. Casse", tp: 0, pa: "", sp: "", cl: "" },
      { n: 12, h: "Jokes Reserve", ml: "", jp: 0, t: "Caio Caramori", tp: 0, pa: "", sp: "", cl: "" },
    ] },
    { r: 5, dist: "5½f", surf: "turf", name: "Allowance, 3+", post: "3:20", wager: "", runners: [
      { n: 1, h: "Golden Ale", ml: "", jp: 0, t: "Frank Lucarelli", tp: 0, pa: "", sp: "", cl: "" },
      { n: 2, h: "Zambezi", ml: "", jp: 0, t: "Bobby C. Barnett", tp: 0, pa: "", sp: "", cl: "" },
      { n: 3, h: "Murdock", ml: "", jp: 0, t: "Larry Rivelli", tp: 0, pa: "", sp: "", cl: "" },
      { n: 4, h: "Mountain Bear (IRE)", ml: "", jp: 0, t: "J. Kent Sweezey", tp: 0, pa: "", sp: "", cl: "" },
      { n: 5, h: "Moon Sniper", ml: "", jp: 0, t: "Darrin Miller", tp: 0, pa: "", sp: "", cl: "" },
      { n: 6, h: "Max Vegas", ml: "", jp: 0, t: "McLean Robertson", tp: 0, pa: "", sp: "", cl: "" },
      { n: 7, h: "Kalahari Dreams", ml: "", jp: 0, t: "Philip A. Bauer", tp: 0, pa: "", sp: "", cl: "" },
      { n: 8, h: "Storm Cloud Rising", ml: "", jp: 0, t: "Andres Cambray", tp: 0, pa: "", sp: "", cl: "" },
      { n: 9, h: "Ortley Avenue (IRE)", ml: "", jp: 0, t: "George Weaver", tp: 0, pa: "", sp: "", cl: "" },
      { n: 10, h: "Jet Sweep Joe", ml: "", jp: 0, t: "Paul McEntee", tp: 0, pa: "", sp: "", cl: "" },
      { n: 11, h: "Guy Smiley", ml: "", jp: 0, t: "Wesley A. Ward", tp: 0, pa: "", sp: "", cl: "" },
      { n: 12, h: "Twilight Delight", ml: "", jp: 0, t: "Daniel Leitch", tp: 0, pa: "", sp: "", cl: "" },
    ] },
    { r: 6, dist: "7f", surf: "dirt", name: "Claiming, 3+", post: "3:57", wager: "", runners: [
      { n: 1, h: "Executive Chef", ml: "", jp: 0, t: "Michael Puhich", tp: 0, pa: "", sp: "", cl: "" },
      { n: 2, h: "Billal", ml: "", jp: 0, t: "William I. Mott", tp: 0, pa: "", sp: "", cl: "" },
      { n: 3, h: "Timing Difference", ml: "", jp: 0, t: "Chris A. Hartman", tp: 0, pa: "", sp: "", cl: "" },
      { n: 4, h: "High Ceiling", ml: "", jp: 0, t: "Joe Sharp", tp: 0, pa: "", sp: "", cl: "" },
      { n: 5, h: "Flying Liam", ml: "", jp: 0, t: "Nolan Ramsey", tp: 0, pa: "", sp: "", cl: "" },
      { n: 6, h: "Tarantino", ml: "", jp: 0, t: "David Jacobson", tp: 0, pa: "", sp: "", cl: "" },
      { n: 7, h: "Barksdale", ml: "", jp: 0, t: "Robertino Diodoro", tp: 0, pa: "", sp: "", cl: "" },
      { n: 8, h: "Tom Cat Tuesday", ml: "", jp: 0, t: "Shelbi A. Kurtz", tp: 0, pa: "", sp: "", cl: "" },
    ] },
    { r: 7, dist: "7f", surf: "dirt", name: "Allowance, 3+", post: "4:34", wager: "", runners: [
      { n: 1, h: "Amor Patriae", ml: "", jp: 0, t: "James P. DiVito", tp: 0, pa: "", sp: "", cl: "" },
      { n: 2, h: "Bob's Carrot", ml: "", jp: 0, t: "Carlos Santamaria", tp: 0, pa: "", sp: "", cl: "" },
      { n: 3, h: "Ezum", ml: "", jp: 0, t: "Brad H. Cox", tp: 0, pa: "", sp: "", cl: "" },
      { n: 4, h: "Overtime Rules", ml: "", jp: 0, t: "Arnaud Delacour", tp: 0, pa: "", sp: "", cl: "" },
      { n: 5, h: "Pimlott", ml: "", jp: 0, t: "Brendan P. Walsh", tp: 0, pa: "", sp: "", cl: "" },
      { n: 6, h: "Mount Vernon", ml: "", jp: 0, t: "Cherie DeVaux", tp: 0, pa: "", sp: "", cl: "" },
      { n: 7, h: "Lincoln's Law", ml: "", jp: 0, t: "Philip A. Bauer", tp: 0, pa: "", sp: "", cl: "" },
      { n: 8, h: "Embry Show", ml: "", jp: 0, t: "Bob Baffert", tp: 0, pa: "", sp: "", cl: "" },
      { n: 9, h: "Discotheque", ml: "", jp: 0, t: "J. Kent Sweezey", tp: 0, pa: "", sp: "", cl: "" },
      { n: 10, h: "Speedstorm", ml: "", jp: 0, t: "Ron Moquett", tp: 0, pa: "", sp: "", cl: "" },
      { n: 11, h: "Tre Italiani", ml: "", jp: 0, t: "Larry Rivelli", tp: 0, pa: "", sp: "", cl: "" },
      { n: 12, h: "Reclamation", ml: "", jp: 0, t: "Christopher Davis", tp: 0, pa: "", sp: "", cl: "" },
    ] },
    { r: 8, dist: "5½f", surf: "turf", name: "Indian Summer (G3), 2yo", post: "", wager: "", runners: [
      { n: 1, h: "Adonius (IRE)", ml: "", jp: 0, t: "Rebecca Menzies", tp: 0, pa: "", sp: "", cl: "" },
      { n: 2, h: "Fanshell Beach", ml: "", jp: 0, t: "Wesley A. Ward", tp: 0, pa: "", sp: "", cl: "" },
      { n: 3, h: "Cactus Closer", ml: "", jp: 0, t: "Dale L. Romans", tp: 0, pa: "", sp: "", cl: "" },
      { n: 4, h: "Crack On", ml: "", jp: 0, t: "Jimmy Corrigan", tp: 0, pa: "", sp: "", cl: "" },
      { n: 5, h: "Love a Warrior", ml: "", jp: 0, t: "Steven M. Asmussen", tp: 0, pa: "", sp: "", cl: "" },
      { n: 6, h: "Ciarlatano", ml: "", jp: 0, t: "Brittany A. Vanden Berg", tp: 0, pa: "", sp: "", cl: "" },
      { n: 7, h: "Wood Island", ml: "", jp: 0, t: "George Weaver", tp: 0, pa: "", sp: "", cl: "" },
      { n: 8, h: "Ruiva", ml: "", jp: 0, t: "Wesley A. Ward", tp: 0, pa: "", sp: "", cl: "" },
      { n: 9, h: "Bee Crazy", ml: "", jp: 0, t: "Kelsey Danner", tp: 0, pa: "", sp: "", cl: "" },
    ] },
    { r: 9, dist: "1 1/8m", surf: "dirt", name: "Juddmonte Spinster (G1), F&M 3+", post: "", wager: "", runners: [
      { n: 1, h: "Regaled", ml: "", jp: 0, t: "D. Whitworth Beckman", tp: 0, pa: "", sp: "", cl: "" },
      { n: 2, h: "Counting Stars", ml: "", jp: 0, t: "Mark E. Casse", tp: 0, pa: "", sp: "", cl: "" },
      { n: 3, h: "Immersive", ml: "", jp: 0, t: "Brad H. Cox", tp: 0, pa: "", sp: "", cl: "" },
      { n: 4, h: "Fully Subscribed", ml: "", jp: 0, t: "Chad C. Brown", tp: 0, pa: "", sp: "", cl: "" },
      { n: 5, h: "Snowyte", ml: "", jp: 0, t: "Danny Gargan", tp: 0, pa: "", sp: "", cl: "" },
    ] },
    { r: 10, dist: "1 1/16m", surf: "turf", name: "Castle & Key Bourbon (G2), 2yo", post: "", wager: "", runners: [
      { n: 1, h: "Trim Castle", ml: "", jp: 0, t: "John Ennis", tp: 0, pa: "", sp: "", cl: "" },
      { n: 2, h: "Agate", ml: "", jp: 0, t: "Kelsey Danner", tp: 0, pa: "", sp: "", cl: "" },
      { n: 3, h: "Bold Leadership", ml: "", jp: 0, t: "Todd A. Pletcher", tp: 0, pa: "", sp: "", cl: "" },
      { n: 4, h: "Heracles", ml: "", jp: 0, t: "Ronald B. Spatz", tp: 0, pa: "", sp: "", cl: "" },
      { n: 5, h: "Real Goodbar", ml: "", jp: 0, t: "Kenneth G. McPeek", tp: 0, pa: "", sp: "", cl: "" },
      { n: 6, h: "Popcorn", ml: "", jp: 0, t: "Jonathan Thomas", tp: 0, pa: "", sp: "", cl: "" },
      { n: 7, h: "Mad Mo", ml: "", jp: 0, t: "John Ennis", tp: 0, pa: "", sp: "", cl: "" },
      { n: 8, h: "Hemingway", ml: "", jp: 0, t: "Brad H. Cox", tp: 0, pa: "", sp: "", cl: "" },
      { n: 9, h: "Blaring Ambition", ml: "", jp: 0, t: "Michael J. Maker", tp: 0, pa: "", sp: "", cl: "" },
      { n: 10, h: "Let Em Know", ml: "", jp: 0, t: "D. Whitworth Beckman", tp: 0, pa: "", sp: "", cl: "" },
      { n: 11, h: "Mid American", ml: "", jp: 0, t: "James P. DiVito", tp: 0, pa: "", sp: "", cl: "" },
    ] },
  ],
};

// ---- My notes, attached to the runners they apply to. Everything else on
// the card is the program's data, not my opinion. ----
const NOTES = {
  "lightwonup": { tag: "avoid", last: "Sep 5 Kentucky Downs R10 · 6½f turf · 5th of 12, btn 1¼, 26.2-1. Caught in tight between runners into deep stretch — and the chart says BLED.", call: "YOUR race. 9/2 second choice, top SPEED fig (88) and tied-top CLASS (115). Everything says bet him except the bleed. Do not back him; a pass here is correct, not a bad beat. He is also not the speed — Office has a 108 pace fig from post 13." },
  "madhouse": { tag: "stakes", last: "No start in my chart window.", call: "REVISED Oct 2. I called him the structural speed play assuming an uncontested lead — wrong. Viking 103 and Jack's Promise 103 both out-pace him (102), Verifire 101. Contested speed cooks itself on a sealed track. Still live at 10/1 on a 95 speed fig, but as a horse, not a lock on the shape. Trainer 5%." },
  "nakatomi": { tag: "avoid", last: "No start in my chart window.", call: "REVISED Oct 2 — pass. Pace fig 93, lowest of the live horses, so Ward's 45% main-track number describes a closer, which is the wrong style for a sealed track. My two arguments were fighting each other. Not at 7/2 from post 10 of 11." },
  "hymn": { tag: "stakes", last: "Best figures in the race: SPEED 100, CLASS 121, both tops.", call: "Added Oct 2. I dismissed him as 'not in my charts' and never looked. On figures the best horse here, at third choice. Strike against: Moquett is 0-for-13 on the Keeneland main track across the last two meets." },
  "nonayhudson": { tag: "avoid", last: "No start in my chart window.", call: "Ward on the GRASS, where he is 2-for-32 at Keeneland — the opposite side of the split from Nakatomi. 8/1 does not buy that." },
  "brilliantberti": { tag: "watch", last: "Won at Kentucky Downs in my window, clean trip.", call: "A G1 that stays on grass whatever the weather. 6/1 in a nine-horse field is fair, not generous." },
  "immersive": { tag: "avoid", last: "3rd of 4 in my window, beaten 8½, no trouble in the footnote.", call: "A bad line, not an excuse — in a five-horse field with no price. Watch it, don't bet it." },
  "guysmiley": { tag: "watch", last: "Won for Ward at Kentucky Downs.", call: "Ward won with him on KD grass, but this is the Keeneland turf course (2-for-32). Those two facts fight. Let the price settle it, and only if the race stays on grass." },
  "fanshellbeach": { tag: "avoid", last: "No start in my chart window.", call: "One of two Ward runners in here, on the surface where he is 2-for-32." },
  "ruiva": { tag: "avoid", last: "No start in my chart window.", call: "The second Ward runner. Two from one barn in a nine-horse turf sprint is a pace note, not a reason to back either." },
  "midamerican": { tag: "stakes", last: "Aug 29 Kentucky Downs R6 · 6½f turf · WON by 1¼ at 5.35-1. Rated off the pace, saved ground to the turn, took command in the final furlong.", call: "Genuine stalker and the style wants a route — but post 11 of 11 stretching out on a tight course is the bigger fact. Needs to be past 8-1." },
  "agate": { tag: "stakes", last: "Sep 9 Kentucky Downs R11 · 1m turf · 3rd of 12, btn 6¼, 5.58-1. Took a bad step and was bumped nearing the five-furlong marker.", call: "Best of the Bourbon group on merit: real trouble at a real price, and post 2 is the opposite of Mid American's problem." },
  "trimcastle": { tag: "avoid", last: "Sep 9 Kentucky Downs R11 · 1m turf · 5th of 12, btn 11½, 40.19-1. Also 3rd of 9 Aug 29 at 4.42-1.", call: "Two lines and the route one is the 40-1 flop. No case." },
  "realgoodbar": { tag: "trouble", last: "Sep 12 Churchill R10 · 1m DIRT · 4th of 7, btn 4½, 6.69-1. Floated five wide, in tight in upper stretch.", call: "The one Bourbon runner with proven main-track form, so if this race comes off the turf he is live. Weaker than I first said: McPeek is 5-for-55 (9%) on Keeneland dirt, 20% on its turf. The horse's dirt form is real; the barn's local dirt record is not." },
};

const DAY_LABEL = { fri: "Friday · Oct 2", sat: "Saturday · Oct 3", sun: "Sunday · Oct 4" };
const TAG_COLOR = { trouble: GREEN, avoid: LOSS, stakes: "#1F4E79", watch: "#6B6A5E", mine: "#8A6D1F" };
const TAG_LABEL = { trouble: "Trip trouble", avoid: "Do not back", stakes: "Stakes", watch: "Watch", mine: "Yours" };

// Strip country suffix and punctuation so the program's spelling and mine
// land on the same key.
const nkey = (n) =>
  String(n)
    .replace(/\s*\((?:IRE|GB|FR|CHI|URU|JPN|ARG|BRZ)\)\s*$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

function Horses({ day, horses, onStar, onAdd, onDrop }) {
  const [q, setQ] = useState("");
  const [only, setOnly] = useState("all");
  const [open, setOpen] = useState({});
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ name: "", race: "", note: "" });

  const races = CARD[day] || [];
  const needle = q.trim().toLowerCase();
  const rid = (r, n) => day + "-" + r + "-" + n;

  const hit = (x) =>
    !needle ||
    x.h.toLowerCase().includes(needle) ||
    (x.t || "").toLowerCase().includes(needle);

  const shown = (r) =>
    r.runners.filter(
      (x) => hit(x) && (only === "all" || horses.starred[rid(r.r, x.n)])
    );

  const save = () => {
    if (!draft.name.trim()) return;
    onAdd({
      id: "mine-" + Date.now(),
      name: draft.name.trim(),
      trainer: "",
      last: "",
      note: draft.note.trim(),
      day: day,
      race: draft.race || null,
      call: "",
    });
    setDraft({ name: "", race: "", note: "" });
    setAdding(false);
  };

  const mine = (horses.mine || []).filter((m) => (m.day || day) === day);
  const live = races.map((r) => ({ r, rows: shown(r) })).filter((g) => g.rows.length);
  const filtering = needle || only === "star";

  return (
    <div className="px-4 py-3">
      <div
        style={{ background: "#F6E9C8", border: `1px solid ${AMBER}`, color: INK }}
        className="rounded p-2 mb-3 text-xs leading-relaxed"
      >
        <b>Check the board before you bet a turf race.</b> Turf races are marked{" "}
        <span style={{ color: GREEN }}>▲</span>. Keeneland keeps the G1s on grass
        and moves the non-stakes turf races first. A race off the turf is a
        different race.
        <div style={{ marginTop: 6 }}>
          <b>Trainer win% is already in the price.</b> Cox is 34.5% dirt / 32.1%
          turf here — no split to exploit. The edges are the splits one number
          hides: Ward 45% dirt vs 6% turf, Casse 4% dirt (1-for-24) vs 22% turf,
          Asmussen 15% vs 6%. See Trainers.
        </div>
      </div>

      <input
        id="horse-search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search horse or trainer on this card"
        style={{ border: `1px solid ${RULE}`, background: "#fff" }}
        className="w-full px-3 py-2 rounded mb-3 text-base"
      />

      <div className="flex gap-2 items-center mb-3">
        <Pill on={only === "all"} onClick={() => setOnly("all")}>
          All
        </Pill>
        <Pill on={only === "star"} onClick={() => setOnly("star")}>
          ★ Starred
        </Pill>
        <div className="flex-1" />
        <button
          onClick={() => setAdding(!adding)}
          style={{ border: `1px solid ${GREEN}`, color: GREEN }}
          className="px-3 py-2 rounded text-sm"
        >
          {adding ? "Cancel" : "+ Add"}
        </button>
      </div>

      {adding && (
        <div
          style={{ background: PAPER_HI, border: `1px solid ${RULE}` }}
          className="rounded p-3 mb-3"
        >
          <input
            id="horse-name"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            placeholder="Horse"
            style={{ border: `1px solid ${RULE}`, background: "#fff" }}
            className="w-full px-3 py-2 rounded mb-2 text-base"
          />
          <Row label="Race">
            <input
              id="horse-race"
              value={draft.race}
              onChange={(e) => setDraft({ ...draft, race: e.target.value })}
              placeholder="Race"
              style={{ border: `1px solid ${RULE}`, background: "#fff" }}
              className="w-16 px-2 py-1 rounded text-sm"
            />
          </Row>
          <input
            id="horse-note"
            value={draft.note}
            onChange={(e) => setDraft({ ...draft, note: e.target.value })}
            placeholder="What you saw"
            style={{ border: `1px solid ${RULE}`, background: "#fff" }}
            className="w-full px-3 py-2 rounded mb-3 text-sm"
          />
          <button
            onClick={save}
            style={{ background: GREEN, color: PAPER_HI }}
            className="w-full py-3 rounded"
          >
            Add to {DAY_LABEL[day]}
          </button>
        </div>
      )}

      {live.length === 0 && (
        <p style={{ color: "#7C7B70" }} className="text-sm py-6">
          {only === "star"
            ? "Nothing starred on this card yet. Tap a star to shortlist a runner."
            : "No horse or trainer by that name on this card."}
        </p>
      )}

      {live.map(({ r, rows }) => {
        const isOpen = filtering || open[r.r];
        const flagged = r.runners.filter((x) => NOTES[nkey(x.h)]).length;
        return (
          <div key={r.r} className="mb-2">
            <button
              onClick={() => setOpen({ ...open, [r.r]: !open[r.r] })}
              style={{ borderBottom: `1px solid ${RULE}` }}
              className="w-full text-left pb-1 flex gap-2 items-baseline"
            >
              <span
                style={{ fontFamily: "ui-monospace, monospace", color: GREEN }}
                className="text-base"
              >
                R{r.r}
              </span>
              <span style={{ fontFamily: "Georgia, serif" }} className="text-base">
                {r.dist} {r.surf === "turf" ? "turf ▲" : "dirt"}
              </span>
              <span style={{ color: "#7C7B70" }} className="text-xs truncate flex-1">
                {r.name}
              </span>
              {flagged > 0 && (
                <span style={{ color: AMBER }} className="text-xs">
                  ●{flagged}
                </span>
              )}
              <span style={{ color: "#7C7B70" }} className="text-xs">
                {r.post && r.post + " · "}
                {r.runners.length}
              </span>
              <span style={{ color: "#7C7B70" }} className="text-xs">
                {isOpen ? "▾" : "▸"}
              </span>
            </button>

            {r.wager && (
              <div style={{ color: "#7C7B70" }} className="text-xs mt-1">
                {r.wager}
              </div>
            )}

            {isOpen &&
              rows.map((x) => {
                const note = NOTES[nkey(x.h)];
                const id = rid(r.r, x.n);
                return (
                  <div
                    key={x.n}
                    style={{ borderBottom: `1px solid ${RULE}` }}
                    className="py-2 flex gap-2 items-start"
                  >
                    <button
                      onClick={() => onStar(id)}
                      aria-label={horses.starred[id] ? "Unstar" : "Star"}
                      style={{ color: horses.starred[id] ? AMBER : "#C3C2B6" }}
                      className="text-lg leading-tight shrink-0"
                    >
                      ★
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="text-base">
                        <span
                          style={{ fontFamily: "ui-monospace, monospace", color: "#7C7B70" }}
                        >
                          {x.n}{" "}
                        </span>
                        {x.h}
                        {x.ml && (
                          <span
                            style={{ fontFamily: "ui-monospace, monospace", color: INK }}
                            className="text-xs"
                          >
                            {" "}
                            {x.ml}
                          </span>
                        )}
                        {x.p ? (
                          <span style={{ color: AMBER }} className="text-xs">
                            {" "}
                            ★prog
                          </span>
                        ) : null}
                      </div>
                      <div className="flex gap-2 items-center mt-1 flex-wrap">
                        {note && (
                          <span
                            style={{ color: TAG_COLOR[note.tag] || INK }}
                            className="text-xs"
                          >
                            {TAG_LABEL[note.tag] || note.tag}
                          </span>
                        )}
                        <span style={{ color: "#7C7B70" }} className="text-xs truncate">
                          {x.t}
                          {x.tp ? " " + x.tp + "%" : ""}
                        </span>
                        {x.pa && (
                          <span
                            style={{ fontFamily: "ui-monospace, monospace", color: "#7C7B70" }}
                            className="text-xs"
                          >
                            P{x.pa} S{x.sp} C{x.cl}
                          </span>
                        )}
                      </div>
                      {note && (
                        <div style={{ color: "#7C7B70" }} className="text-xs mt-1">
                          {note.last}
                        </div>
                      )}
                      {note && (
                        <div style={{ color: GREEN }} className="text-xs mt-1">
                          {note.call}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        );
      })}

      {mine.length > 0 && (
        <div className="mb-4 mt-4">
          <div
            style={{
              fontFamily: "Georgia, serif",
              borderBottom: `1px solid ${RULE}`,
              color: "#8A6D1F",
            }}
            className="text-base pb-1 mb-1"
          >
            Yours — {DAY_LABEL[day]}
          </div>
          {mine.map((m) => (
            <div
              key={m.id}
              style={{ borderBottom: `1px solid ${RULE}` }}
              className="py-2"
            >
              <div className="text-base">
                {m.race ? (
                  <span style={{ fontFamily: "ui-monospace, monospace", color: GREEN }}>
                    R{m.race}{" "}
                  </span>
                ) : null}
                {m.name}
              </div>
              {m.note && <div className="text-xs mt-1 italic">{m.note}</div>}
              <button
                onClick={() => onDrop(m.id)}
                style={{ color: LOSS }}
                className="text-xs mt-1"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <p style={{ color: "#7C7B70" }} className="text-xs mt-3 leading-relaxed">
        The full {DAY_LABEL[day]} card — {races.length} races,{" "}
        {races.reduce((a, r) => a + r.runners.length, 0)} runners. Morning lines
        and the P/S/C figures are the program's, not mine; Sunday has entries
        only until that program lands. Amber ● counts my notes in a race. Posts,
        prices and surfaces all move — the board at the gate wins any argument
        with this screen. Stars and anything you add are saved on this phone and
        ride along in Copy log.
      </p>
    </div>
  );
}

function Export({ bets, stacks }) {
  const [note, setNote] = useState("");
  const [showText, setShowText] = useState(false);
  const text = JSON.stringify({ bets, stacks }, null, 2);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setNote("Copied. Paste it into Claude and I'll run the numbers.");
    } catch (e) {
      setNote("Couldn't reach the clipboard — copy it from the box below.");
      setShowText(true);
    }
  };

  return (
    <div style={{ borderTop: `1px solid ${RULE}` }} className="pt-3 mt-1">
      <div className="flex gap-2 items-center">
        <button
          onClick={copy}
          style={{ border: `1px solid ${GREEN}`, color: GREEN }}
          className="px-3 py-2 rounded text-sm"
        >
          Copy log
        </button>
        <button
          onClick={() => setShowText(!showText)}
          style={{ color: "#7C7B70" }}
          className="text-xs"
        >
          {showText ? "Hide" : "Show"} raw
        </button>
      </div>
      {note && (
        <div style={{ color: "#7C7B70" }} className="text-xs mt-2">
          {note}
        </div>
      )}
      {showText && (
        <textarea
          id="raw-log"
          readOnly
          value={text}
          onFocus={(e) => e.target.select()}
          style={{
            border: `1px solid ${RULE}`,
            background: "#fff",
            fontFamily: "ui-monospace, monospace",
            height: 140,
          }}
          className="w-full px-2 py-2 rounded mt-2 text-xs"
        />
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(KeenelandBetLog));
