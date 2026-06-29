/* ===== R2 Admin — shared view helpers + views A ===== */

/* ---------- PageHead ---------- */
function PageHead({ title, subtitle, actions }) {
  return (
    <div className="page-head">
      <div>
        <div className="pt">{title}</div>
        {subtitle && <div className="ps">{subtitle}</div>}
      </div>
      {actions && <div className="actions">{actions}</div>}
    </div>
  );
}

/* ---------- Unsaved banner ---------- */
function UnsavedBar({ show, onSave, onDiscard }) {
  if (!show) return null;
  return (
    <div className="unsaved-bar">
      <Icon name="alert" />
      You have unsaved changes.
      <span className="sp">
        <button className="btn btn--ghost btn--sm" onClick={onDiscard}>Discard</button>
        <button className="btn btn--primary btn--sm" onClick={onSave}>Save now</button>
      </span>
    </div>
  );
}

/* ---------- Dropzone ---------- */
function Dropzone({ label = "Drop an image here or click to upload", sub = "PNG or JPG, up to 5MB", onFile }) {
  const [over, setOver] = useState(false);
  const inp = useRef(null);
  return (
    <div className={"dropzone" + (over ? " over" : "")}
      onClick={() => inp.current && inp.current.click()}
      onDragOver={e => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={e => { e.preventDefault(); setOver(false); onFile && onFile(e.dataTransfer.files[0]); }}>
      <div className="dz-ic"><Icon name="upload" /></div>
      <b>{label}</b><span>{sub}</span>
      <input ref={inp} type="file" accept="image/*" hidden onChange={e => onFile && onFile(e.target.files[0])} />
    </div>
  );
}

/* eq helper */
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const clone = (o) => JSON.parse(JSON.stringify(o));

/* ============================================================
   DASHBOARD
   ============================================================ */
function DashboardView({ go }) {
  const { data } = useStore();
  const stats = [
    { ic: "inbox", color: "#2563EB", bg: "#EFF5FF", val: "7", lbl: "Enquiries Today", delta: "+3", up: true },
    { ic: "camera", color: "#8B5CF6", bg: "#F3EEFF", val: String(data.photos.length), lbl: "Success Photos", delta: "Synced", up: false },
    { ic: "box", color: "#16A34A", bg: "#E4F3EA", val: String(data.packages.length), lbl: "Active Packages", delta: "Live", up: false },
    { ic: "help", color: "#D97706", bg: "#FEF3E2", val: String(data.faqs.length), lbl: "FAQ Items", delta: "Live", up: false },
  ];
  const actIcon = {
    edit: { ic: "edit", c: "#2563EB", bg: "#EFF5FF" }, photo: { ic: "camera", c: "#8B5CF6", bg: "#F3EEFF" },
    price: { ic: "dollar", c: "#16A34A", bg: "#E4F3EA" }, faq: { ic: "help", c: "#D97706", bg: "#FEF3E2" },
    review: { ic: "google", c: "#2563EB", bg: "#EFF5FF" }, area: { ic: "pin", c: "#06B6D4", bg: "#E0F7FB" },
  };
  return (
    <div className="view">
      <div className="page-head">
        <div>
          <div className="pt">Welcome back 👋</div>
          <div className="ps">Here's what's happening with your website. Last updated {data.lastUpdated}.</div>
        </div>
        <div className="actions">
          <button className="btn btn--ghost" onClick={() => go("preview")}><Icon name="eye" />Preview Website</button>
        </div>
      </div>

      <div className="stat-grid" style={{ marginBottom: 22 }}>
        {stats.map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="top">
              <div className="stat-ic" style={{ background: s.bg, color: s.color }}><Icon name={s.ic} /></div>
              <span className={"delta " + (s.up ? "up" : "flat")}>{s.up && "↑ "}{s.delta}</span>
            </div>
            <div className="val">{s.val}</div>
            <div className="lbl">{s.lbl}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: 22 }}>
        <div className="card-head"><h3>Quick Actions</h3><span className="sub">Jump straight to common edits</span></div>
        <div className="card-pad">
          <div className="qa-grid">
            <button className="qa" onClick={() => go("settings")}>
              <span className="qa-ic"><Icon name="layout" /></span>
              <span><b>Edit Homepage Hero</b><span>Headline, subtext & stats</span></span>
            </button>
            <button className="qa" onClick={() => go("photos")}>
              <span className="qa-ic"><Icon name="camera" /></span>
              <span><b>Add New Photo</b><span>Upload a student success story</span></span>
            </button>
            <button className="qa" onClick={() => go("packages")}>
              <span className="qa-ic"><Icon name="dollar" /></span>
              <span><b>Update Pricing</b><span>Edit lesson packages</span></span>
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-head"><h3>Recent Activity</h3><div className="right"><span className="sub">Last 7 days</span></div></div>
        <div className="card-pad" style={{ paddingTop: 4, paddingBottom: 8 }}>
          <div className="activity">
            {data.activity.map(a => {
              const m = actIcon[a.type] || actIcon.edit;
              return (
                <div className="act-row" key={a.id}>
                  <div className="act-ic" style={{ background: m.bg, color: m.c }}><Icon name={m.ic} /></div>
                  <div className="a-txt">{a.text}</div>
                  <div className="a-time">{a.time}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   GLOBAL SETTINGS
   ============================================================ */
function GlobalSettingsView() {
  const { data, update, logActivity } = useStore();
  const { toast } = useUI();
  const [draft, setDraft] = useState(() => clone({ business: data.business, hero: data.hero, stats: data.stats, sections: data.sections }));
  const orig = { business: data.business, hero: data.hero, stats: data.stats, sections: data.sections };
  const dirty = !eq(draft, orig);

  const save = () => {
    update("business", draft.business); update("hero", draft.hero);
    update("stats", draft.stats); update("sections", draft.sections);
    logActivity("edit", "Updated global settings & hero");
    toast("Changes saved successfully");
  };
  const discard = () => setDraft(clone(orig));

  return (
    <div className="view">
      <PageHead title="Global Settings" subtitle="Core business details and homepage hero content."
        actions={<button className="btn btn--primary" onClick={save} disabled={!dirty}><Icon name="check" />Save Changes</button>} />
      <UnsavedBar show={dirty} onSave={save} onDiscard={discard} />

      <div className="section-stack">
        <div className="card">
          <div className="card-head"><h3>Business Details</h3></div>
          <div className="card-pad">
            <Field label="Business Name">
              <input value={draft.business.name} onChange={e => setDraft(d => ({ ...d, business: { ...d.business, name: e.target.value } }))} />
            </Field>
            <Field label="Tagline / Subheading">
              <input value={draft.business.tagline} onChange={e => setDraft(d => ({ ...d, business: { ...d.business, tagline: e.target.value } }))} />
            </Field>
          </div>
        </div>

        <div className="card">
          <div className="card-head"><h3>Homepage Hero</h3><span className="sub">Wrap a word in [brackets] to highlight it blue</span></div>
          <div className="card-pad">
            <Field label="Hero Headline" hint="e.g. Learn to Drive with [Confidence]">
              <input value={draft.hero.headline} onChange={e => setDraft(d => ({ ...d, hero: { ...d.hero, headline: e.target.value } }))} />
            </Field>
            <div style={{ margin: "-6px 0 14px", fontSize: 13, color: "var(--muted)" }}>
              Preview: {draft.hero.headline.split(/(\[[^\]]*\])/).map((part, i) =>
                part.startsWith("[") ? <b key={i} style={{ color: "var(--blue)" }}>{part.slice(1, -1)}</b> : <span key={i} style={{ color: "var(--ink)", fontWeight: 700 }}>{part}</span>)}
            </div>
            <Field label="Hero Subtext" count={draft.hero.subtext.length + " chars"}>
              <textarea value={draft.hero.subtext} onChange={e => setDraft(d => ({ ...d, hero: { ...d.hero, subtext: e.target.value } }))} />
            </Field>
          </div>
        </div>

        <div className="card">
          <div className="card-head"><h3>Stats Bar Values</h3><span className="sub">The 4 numbers in the navy band</span></div>
          <div className="card-pad">
            <div className="grid-2">
              {draft.stats.map((s, i) => (
                <Field key={s.id} label={s.label}>
                  <input value={s.value} onChange={e => setDraft(d => ({ ...d, stats: d.stats.map((x, j) => j === i ? { ...x, value: e.target.value } : x) }))} />
                </Field>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head"><h3>Section Visibility</h3><span className="sub">Show or hide whole sections of the site</span></div>
          <div className="card-pad" style={{ paddingTop: 6, paddingBottom: 6 }}>
            {draft.sections.map((s, i) => (
              <div className="toggle-row" key={s.id}>
                <div className="tr-txt"><b>{s.label}</b><span>{s.desc}</span></div>
                <Toggle checked={s.on} onChange={v => setDraft(d => ({ ...d, sections: d.sections.map((x, j) => j === i ? { ...x, on: v } : x) }))} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   LOGO & BRANDING
   ============================================================ */
const COLOR_OPTS = ["#1E3A5F","#0F2747","#1B4332","#3B1F47","#7A1F2B","#0F1B2A"];
const ACCENT_OPTS = ["#2563EB","#0EA5E9","#16A34A","#7C3AED","#EA580C","#DB2777"];

function ColorField({ label, value, options, onChange }) {
  return (
    <Field label={label}>
      <div className="color-row">
        <label className="color-swatch" style={{ background: value }}>
          <input type="color" value={value} onChange={e => onChange(e.target.value)} />
        </label>
        <div style={{ flex: 1 }}>
          <div className="swatch-options" style={{ marginBottom: 8 }}>
            {options.map(c => (
              <span key={c} className={"swatch-opt" + (c.toLowerCase() === value.toLowerCase() ? " sel" : "")} style={{ background: c }} onClick={() => onChange(c)} />
            ))}
          </div>
          <span className="color-hex">{value}</span>
        </div>
      </div>
    </Field>
  );
}

function LogoBrandingView() {
  const { data, update, logActivity } = useStore();
  const { toast } = useUI();
  const [draft, setDraft] = useState(() => clone(data.branding));
  const dirty = !eq(draft, data.branding);
  const save = () => { update("branding", draft); logActivity("edit", "Updated logo & branding colours"); toast("Branding saved successfully"); };

  return (
    <div className="view">
      <PageHead title="Logo & Branding" subtitle="Your logo, brand colours and favicon."
        actions={<button className="btn btn--primary" onClick={save} disabled={!dirty}><Icon name="check" />Save Changes</button>} />
      <UnsavedBar show={dirty} onSave={save} onDiscard={() => setDraft(clone(data.branding))} />

      <div className="grid-2" style={{ alignItems: "start" }}>
        <div className="section-stack">
          <div className="card">
            <div className="card-head"><h3>Current Logo</h3></div>
            <div className="card-pad" style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div className="sb-badge" style={{ width: 56, height: 56, fontSize: 20, background: draft.accent, borderRadius: 13 }}>{draft.logoText}</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 17, color: "var(--ink)" }}>{data.business.name}</div>
                <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{data.business.tagline}</div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-head"><h3>Upload New Logo</h3></div>
            <div className="card-pad">
              <Dropzone onFile={() => toast("Logo uploaded — remember to Save", "info")} />
              <Field label="Badge Text" hint="shown if no logo image"><input maxLength={3} value={draft.logoText} onChange={e => setDraft(d => ({ ...d, logoText: e.target.value }))} style={{ maxWidth: 120 }} /></Field>
              <Field label="Favicon" hint="browser tab icon">
                <Dropzone label="Drop favicon (.ico / .png)" sub="32×32 or 64×64 recommended" onFile={() => toast("Favicon uploaded", "info")} />
              </Field>
            </div>
          </div>
        </div>

        <div className="section-stack">
          <div className="card">
            <div className="card-head"><h3>Brand Colours</h3></div>
            <div className="card-pad">
              <ColorField label="Primary Colour" value={draft.primary} options={COLOR_OPTS} onChange={v => setDraft(d => ({ ...d, primary: v }))} />
              <ColorField label="Accent / CTA Colour" value={draft.accent} options={ACCENT_OPTS} onChange={v => setDraft(d => ({ ...d, accent: v }))} />
            </div>
          </div>
          <div className="card">
            <div className="card-head"><h3>Live Preview</h3><span className="sub">How your nav bar will look</span></div>
            <div className="card-pad">
              <div className="mini-nav" style={{ borderTop: "3px solid " + draft.primary }}>
                <div className="mn-badge" style={{ background: draft.accent }}>{draft.logoText}</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 13, color: draft.primary }}>{data.business.name}</div>
                </div>
                <div className="mn-links">
                  <span>Lessons</span><span>Packages</span><span>Reviews</span>
                </div>
                <div className="mn-cta" style={{ background: draft.accent }}>Book a Lesson</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SUCCESS PHOTOS
   ============================================================ */
function PhotoModal({ initial, onClose, onSave }) {
  const [f, setF] = useState(initial || { name: "", suburb: "", quote: "", rating: 5 });
  const [errs, setErrs] = useState({});
  const submit = () => {
    const e = {};
    if (!f.name.trim()) e.name = "Enter the student's first name";
    if (!f.suburb.trim()) e.suburb = "Enter a suburb";
    if (!f.quote.trim()) e.quote = "Add a short quote";
    setErrs(e);
    if (Object.keys(e).length) return;
    onSave(f);
  };
  return (
    <Modal title={initial ? "Edit Success Photo" : "Add Success Photo"} icon="camera" onClose={onClose}
      footer={<>
        <button className="btn btn--ghost" onClick={onClose}>Cancel</button>
        <button className="btn btn--primary" onClick={submit}><Icon name="check" />{initial ? "Save Changes" : "Add Photo"}</button>
      </>}>
      <Field label="Photo"><Dropzone label="Drop student photo" sub="Square or 4:3 works best" onFile={() => {}} /></Field>
      <div className="grid-2">
        <Field label="Student First Name" error={errs.name}>
          <input value={f.name} onChange={e => setF({ ...f, name: e.target.value })} placeholder="Emily R." />
        </Field>
        <Field label="Suburb" error={errs.suburb}>
          <input value={f.suburb} onChange={e => setF({ ...f, suburb: e.target.value })} placeholder="Minto" />
        </Field>
      </div>
      <Field label="Quote" error={errs.quote} count={f.quote.length + "/160"}>
        <textarea maxLength={160} value={f.quote} onChange={e => setF({ ...f, quote: e.target.value })} placeholder="Passed first time…" />
      </Field>
      <Field label="Star Rating">
        <Stars n={f.rating} set onSet={r => setF({ ...f, rating: r })} />
      </Field>
    </Modal>
  );
}

function SuccessPhotosView() {
  const { data, update, logActivity } = useStore();
  const { toast, confirm } = useUI();
  const [modal, setModal] = useState(null); // {edit?:photo}
  const drag = useRef(null);
  const [overId, setOverId] = useState(null);

  const photos = data.photos;
  const onDrop = (targetId) => {
    const from = photos.findIndex(p => p.id === drag.current);
    const to = photos.findIndex(p => p.id === targetId);
    if (from < 0 || to < 0 || from === to) return;
    const next = [...photos];
    const [m] = next.splice(from, 1); next.splice(to, 0, m);
    update("photos", next);
    setOverId(null);
  };
  const savePhoto = (f) => {
    if (modal.edit) {
      update("photos", photos.map(p => p.id === modal.edit.id ? { ...p, ...f } : p));
      toast("Photo updated");
    } else {
      update("photos", [...photos, { id: uid("p"), ...f }]);
      logActivity("photo", "Added success photo — " + f.name);
      toast("Photo added successfully");
    }
    setModal(null);
  };
  const del = (p) => confirm({
    title: "Delete this photo?", message: `"${p.name} — ${p.suburb}" will be removed from the website. This can't be undone.`,
    onConfirm: () => { update("photos", photos.filter(x => x.id !== p.id)); toast("Photo deleted"); }
  });

  return (
    <div className="view">
      <PageHead title="Success Photos" subtitle="Student success stories shown in the carousel. Drag to reorder."
        actions={<button className="btn btn--primary" onClick={() => setModal({})}><Icon name="plus" />Add New Photo</button>} />
      <div className="photo-grid">
        {photos.map(p => (
          <div key={p.id} className={"photo-card" + (overId === p.id ? " drag-over" : "")}
            draggable
            onDragStart={() => { drag.current = p.id; }}
            onDragOver={e => { e.preventDefault(); setOverId(p.id); }}
            onDragLeave={() => setOverId(o => o === p.id ? null : o)}
            onDrop={() => onDrop(p.id)}>
            <div className="photo-thumb">
              <div className="ph"><span>{p.name} · {p.suburb}</span></div>
              <div className="drag-h" title="Drag to reorder"><Icon name="grip" /></div>
            </div>
            <div className="pc-body">
              <div style={{ minWidth: 0 }}>
                <div className="nm">{p.name}</div>
                <div className="sub">{p.suburb} · <Stars n={p.rating} /></div>
              </div>
              <div className="pc-acts">
                <button className="icon-btn" onClick={() => setModal({ edit: p })} title="Edit"><Icon name="edit" /></button>
                <button className="icon-btn del" onClick={() => del(p)} title="Delete"><Icon name="trash" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {modal && <PhotoModal initial={modal.edit} onClose={() => setModal(null)} onSave={savePhoto} />}
    </div>
  );
}

Object.assign(window, { PageHead, UnsavedBar, Dropzone, eq, clone, ColorField, DashboardView, GlobalSettingsView, LogoBrandingView, SuccessPhotosView });
