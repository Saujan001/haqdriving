/* ===== R2 Admin — views B ===== */

/* ============================================================
   LESSON PACKAGES
   ============================================================ */
function PackagesView() {
  const { data, update, logActivity } = useStore();
  const { toast, confirm } = useUI();
  const [draft, setDraft] = useState(() => clone(data.packages));
  const dirty = !eq(draft, data.packages);
  const save = () => { update("packages", draft); logActivity("price", "Updated lesson packages"); toast("Packages saved successfully"); };

  const setPkg = (id, patch) => setDraft(d => d.map(p => p.id === id ? { ...p, ...patch } : p));
  const setPopular = (id) => setDraft(d => d.map(p => ({ ...p, popular: p.id === id })));
  const addFeat = (id) => setDraft(d => d.map(p => p.id === id ? { ...p, feats: [...p.feats, ""] } : p));
  const setFeat = (id, i, v) => setDraft(d => d.map(p => p.id === id ? { ...p, feats: p.feats.map((f, j) => j === i ? v : f) } : p));
  const rmFeat = (id, i) => setDraft(d => d.map(p => p.id === id ? { ...p, feats: p.feats.filter((_, j) => j !== i) } : p));
  const addPkg = () => setDraft(d => [...d, { id: uid("pk"), name: "New Package", price: "$0", duration: "/ 1 hour", popular: false, button: "Book Now", feats: ["Feature one"] }]);
  const delPkg = (p) => confirm({ title: "Delete package?", message: `"${p.name}" will be removed.`, onConfirm: () => setDraft(d => d.filter(x => x.id !== p.id)) });

  return (
    <div className="view">
      <PageHead title="Lesson Packages" subtitle="Pricing cards shown on the website. Edit inline."
        actions={<>
          <button className="btn btn--ghost" onClick={addPkg}><Icon name="plus" />Add Package</button>
          <button className="btn btn--primary" onClick={save} disabled={!dirty}><Icon name="check" />Save Changes</button>
        </>} />
      <UnsavedBar show={dirty} onSave={save} onDiscard={() => setDraft(clone(data.packages))} />

      <div className="pkg-admin-grid">
        {draft.map(p => (
          <div key={p.id} className={"pkg-edit-card" + (p.popular ? " popular" : "")}>
            {p.popular && <span className="pe-flag">Most Popular</span>}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4 }}>
              <button className="icon-btn del" onClick={() => delPkg(p)} title="Delete package"><Icon name="trash" /></button>
            </div>
            <Field label="Package Name"><input value={p.name} onChange={e => setPkg(p.id, { name: e.target.value })} /></Field>
            <div className="grid-2">
              <Field label="Price"><input value={p.price} onChange={e => setPkg(p.id, { price: e.target.value })} /></Field>
              <Field label="Duration"><input value={p.duration} onChange={e => setPkg(p.id, { duration: e.target.value })} /></Field>
            </div>
            <Field label="Features">
              <div className="feat-list">
                {p.feats.map((f, i) => (
                  <div className="feat-item" key={i}>
                    <input value={f} onChange={e => setFeat(p.id, i, e.target.value)} placeholder="Feature text" />
                    <button className="rm" onClick={() => rmFeat(p.id, i)} title="Remove"><Icon name="x" /></button>
                  </div>
                ))}
              </div>
              <button className="add-link" onClick={() => addFeat(p.id)}><Icon name="plus" />Add feature</button>
            </Field>
            <Field label="Button Label"><input value={p.button} onChange={e => setPkg(p.id, { button: e.target.value })} /></Field>
            <div className="toggle-row" style={{ borderBottom: "none", paddingBottom: 0 }}>
              <div className="tr-txt"><b>Most Popular</b><span>Highlight with blue border</span></div>
              <Toggle checked={p.popular} onChange={() => setPopular(p.id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   FAQ MANAGER
   ============================================================ */
function FaqManagerView() {
  const { data, update, logActivity } = useStore();
  const { toast, confirm } = useUI();
  const [draft, setDraft] = useState(() => clone(data.faqs));
  const [open, setOpen] = useState(null);
  const dirty = !eq(draft, data.faqs);
  const drag = useRef(null);
  const [overId, setOverId] = useState(null);

  const save = () => { update("faqs", draft); logActivity("faq", "Updated FAQ items"); toast("FAQs saved successfully"); };
  const setItem = (id, patch) => setDraft(d => d.map(f => f.id === id ? { ...f, ...patch } : f));
  const add = () => { const id = uid("f"); setDraft(d => [...d, { id, q: "New question", a: "" }]); setOpen(id); };
  const del = (f) => confirm({ title: "Delete FAQ?", message: `"${f.q}" will be removed.`, onConfirm: () => setDraft(d => d.filter(x => x.id !== f.id)) });
  const onDrop = (targetId) => {
    const from = draft.findIndex(f => f.id === drag.current);
    const to = draft.findIndex(f => f.id === targetId);
    if (from < 0 || to < 0 || from === to) { setOverId(null); return; }
    const next = [...draft]; const [m] = next.splice(from, 1); next.splice(to, 0, m);
    setDraft(next); setOverId(null);
  };

  return (
    <div className="view">
      <PageHead title="FAQ Manager" subtitle="Questions shown in the accordion. Drag to reorder."
        actions={<>
          <button className="btn btn--ghost" onClick={add}><Icon name="plus" />Add New FAQ</button>
          <button className="btn btn--primary" onClick={save} disabled={!dirty}><Icon name="check" />Save Changes</button>
        </>} />
      <UnsavedBar show={dirty} onSave={save} onDiscard={() => setDraft(clone(data.faqs))} />

      <div>
        {draft.map(f => (
          <div key={f.id} className={"faq-row" + (open === f.id ? " open" : "") + (overId === f.id ? " drag-over" : "")}
            draggable onDragStart={() => { drag.current = f.id; }}
            onDragOver={e => { e.preventDefault(); setOverId(f.id); }}
            onDragLeave={() => setOverId(o => o === f.id ? null : o)} onDrop={() => onDrop(f.id)}>
            <div className="faq-row-head">
              <span className="faq-handle" title="Drag to reorder"><Icon name="grip" /></span>
              <span className="q">{f.q || "Untitled question"}</span>
              <button className="icon-btn del" onClick={() => del(f)} title="Delete"><Icon name="trash" /></button>
              <button className="icon-btn" onClick={() => setOpen(o => o === f.id ? null : f.id)} title="Edit"><span className="chev"><Icon name="chevronDown" /></span></button>
            </div>
            <div className="faq-edit">
              <Field label="Question"><input value={f.q} onChange={e => setItem(f.id, { q: e.target.value })} /></Field>
              <Field label="Answer" count={f.a.length + "/400"}>
                <textarea maxLength={400} value={f.a} onChange={e => setItem(f.id, { a: e.target.value })} placeholder="Type the answer…" />
              </Field>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   SERVICE AREAS
   ============================================================ */
function ServiceAreasView() {
  const { data, update, logActivity } = useStore();
  const { toast } = useUI();
  const [draft, setDraft] = useState(() => clone(data.areas));
  const [val, setVal] = useState("");
  const dirty = !eq(draft, data.areas);
  const drag = useRef(null);
  const [overIdx, setOverIdx] = useState(null);

  const save = () => { update("areas", draft); logActivity("area", "Updated service areas"); toast("Service areas saved"); };
  const add = () => { const v = val.trim(); if (!v) return; if (draft.includes(v)) { toast(v + " is already listed", "info"); return; } setDraft([...draft, v]); setVal(""); };
  const rm = (a) => setDraft(draft.filter(x => x !== a));
  const onDrop = (to) => {
    const from = draft.indexOf(drag.current);
    if (from < 0 || to < 0 || from === to) { setOverIdx(null); return; }
    const next = [...draft]; const [m] = next.splice(from, 1); next.splice(to, 0, m);
    setDraft(next); setOverIdx(null);
  };

  return (
    <div className="view">
      <PageHead title="Service Areas" subtitle="Suburbs you cover. Areas appear as location pills on the website."
        actions={<button className="btn btn--primary" onClick={save} disabled={!dirty}><Icon name="check" />Save Changes</button>} />
      <UnsavedBar show={dirty} onSave={save} onDiscard={() => setDraft(clone(data.areas))} />

      <div className="card">
        <div className="card-head"><h3>Add an Area</h3></div>
        <div className="card-pad">
          <div style={{ display: "flex", gap: 10 }}>
            <div className="input-icon" style={{ flex: 1 }}>
              <Icon name="pin" />
              <input value={val} onChange={e => setVal(e.target.value)} onKeyDown={e => { if (e.key === "Enter") add(); }} placeholder="e.g. Wollongong" />
            </div>
            <button className="btn btn--primary" onClick={add}><Icon name="plus" />Add</button>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-head"><h3>Current Areas</h3><span className="sub">{draft.length} suburbs · drag to reorder</span></div>
        <div className="card-pad">
          {draft.length === 0 ? (
            <div className="empty-state"><Icon name="pin" /><b>No areas yet</b>Add your first suburb above.</div>
          ) : (
            <div className="pill-wrap">
              {draft.map((a, i) => (
                <span key={a} className={"area-pill" + (overIdx === i ? " drag-over" : "")}
                  draggable onDragStart={() => { drag.current = a; }}
                  onDragOver={e => { e.preventDefault(); setOverIdx(i); }}
                  onDragLeave={() => setOverIdx(o => o === i ? null : o)} onDrop={() => onDrop(i)}>
                  <Icon name="pin" className="gp" />{a}
                  <button className="rm" onClick={() => rm(a)} title="Remove"><Icon name="x" /></button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SOCIAL MEDIA LINKS
   ============================================================ */
const SOCIALS = [
  { key: "facebook", label: "Facebook URL", icon: "facebook", color: "#1877F2", ph: "https://facebook.com/yourpage" },
  { key: "instagram", label: "Instagram URL", icon: "instagram", color: "#E4405F", ph: "https://instagram.com/yourpage" },
  { key: "tiktok", label: "TikTok URL", icon: "music", color: "#0F1B2A", ph: "https://tiktok.com/@yourpage", opt: true },
  { key: "youtube", label: "YouTube URL", icon: "play", color: "#FF0000", ph: "https://youtube.com/@yourpage", opt: true },
];
function SocialView() {
  const { data, update, logActivity } = useStore();
  const { toast } = useUI();
  const [draft, setDraft] = useState(() => clone(data.social));
  const dirty = !eq(draft, data.social);
  const save = () => { update("social", draft); logActivity("edit", "Updated social media links"); toast("Links saved successfully"); };
  const set = (k, patch) => setDraft(d => ({ ...d, [k]: { ...d[k], ...patch } }));

  return (
    <div className="view">
      <PageHead title="Social Media Links" subtitle="Profile links and which icons show in the footer."
        actions={<button className="btn btn--primary" onClick={save} disabled={!dirty}><Icon name="check" />Save Links</button>} />
      <UnsavedBar show={dirty} onSave={save} onDiscard={() => setDraft(clone(data.social))} />

      <div className="card">
        <div className="card-pad">
          {SOCIALS.map(s => (
            <div key={s.key} style={{ display: "flex", alignItems: "flex-end", gap: 14, paddingBottom: 16, marginBottom: 16, borderBottom: "1px solid var(--line-soft)" }}>
              <div style={{ flex: 1 }}>
                <Field label={<span>{s.label}{s.opt && <span className="hint">optional</span>}</span>}>
                  <div className="input-icon">
                    <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: s.color, display: "grid", placeItems: "center", width: 17, height: 17 }}><Icon name={s.icon} /></span>
                    <input style={{ paddingLeft: 38 }} value={draft[s.key].url} onChange={e => set(s.key, { url: e.target.value })} placeholder={s.ph} />
                  </div>
                </Field>
              </div>
              <div style={{ paddingBottom: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                <span style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600 }}>Show</span>
                <Toggle checked={draft[s.key].on} onChange={v => set(s.key, { on: v })} />
              </div>
            </div>
          ))}
          <p style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 4 }}>Toggle controls whether each icon appears on the website footer.</p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   CONTACT DETAILS
   ============================================================ */
function ContactView() {
  const { data, update, logActivity } = useStore();
  const { toast } = useUI();
  const [draft, setDraft] = useState(() => clone(data.contact));
  const [errs, setErrs] = useState({});
  const dirty = !eq(draft, data.contact);
  const save = () => {
    const e = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)) e.email = "Enter a valid email address";
    if (!draft.phone.trim()) e.phone = "Enter a phone number";
    setErrs(e); if (Object.keys(e).length) return;
    update("contact", draft); logActivity("edit", "Updated contact details"); toast("Contact info saved successfully");
  };
  const set = (patch) => setDraft(d => ({ ...d, ...patch }));
  const setHour = (i, patch) => setDraft(d => ({ ...d, hours: d.hours.map((h, j) => j === i ? { ...h, ...patch } : h) }));

  return (
    <div className="view">
      <PageHead title="Contact Details" subtitle="Phone, email, address, opening hours and map."
        actions={<button className="btn btn--primary" onClick={save} disabled={!dirty}><Icon name="check" />Save Contact Info</button>} />
      <UnsavedBar show={dirty} onSave={save} onDiscard={() => { setDraft(clone(data.contact)); setErrs({}); }} />

      <div className="section-stack">
        <div className="card">
          <div className="card-head"><h3>Primary Details</h3></div>
          <div className="card-pad">
            <div className="grid-2">
              <Field label="Phone Number" hint="+61 format" error={errs.phone}>
                <div className="input-icon"><Icon name="phone" /><input style={{ paddingLeft: 38 }} value={draft.phone} onChange={e => set({ phone: e.target.value })} /></div>
              </Field>
              <Field label="Email Address" error={errs.email}>
                <div className="input-icon"><Icon name="mail" /><input style={{ paddingLeft: 38 }} value={draft.email} onChange={e => set({ email: e.target.value })} /></div>
              </Field>
            </div>
            <Field label="Street Address">
              <textarea style={{ minHeight: 70 }} value={draft.address} onChange={e => set({ address: e.target.value })} />
            </Field>
            <Field label="Google Maps Embed URL">
              <div className="input-icon"><Icon name="globe" /><input style={{ paddingLeft: 38 }} value={draft.mapUrl} onChange={e => set({ mapUrl: e.target.value })} placeholder="https://maps.google.com/…" /></div>
            </Field>
          </div>
        </div>

        <div className="card">
          <div className="card-head"><h3>Business Hours</h3><span className="sub">Set open/close times or mark a day closed</span></div>
          <div className="card-pad" style={{ paddingTop: 6, paddingBottom: 6 }}>
            {draft.hours.map((h, i) => (
              <div className="hours-row" key={h.day}>
                <span className="day">{h.day}</span>
                {h.closed
                  ? <span className="closed-lbl">Closed</span>
                  : <span className="hours-times">
                      <input type="time" value={h.open} onChange={e => setHour(i, { open: e.target.value })} />
                      <span className="dash">–</span>
                      <input type="time" value={h.close} onChange={e => setHour(i, { close: e.target.value })} />
                    </span>}
                <span className="hours-toggle"><span>Closed</span><Toggle checked={h.closed} onChange={v => setHour(i, { closed: v })} /></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   GOOGLE REVIEWS
   ============================================================ */
function ReviewModal({ initial, onClose, onSave }) {
  const [f, setF] = useState(initial || { name: "", rating: 5, date: new Date().toISOString().slice(0, 10), text: "" });
  const [errs, setErrs] = useState({});
  const submit = () => {
    const e = {};
    if (!f.name.trim()) e.name = "Enter reviewer name";
    if (!f.text.trim()) e.text = "Enter the review text";
    setErrs(e); if (Object.keys(e).length) return; onSave(f);
  };
  return (
    <Modal title={initial ? "Edit Review" : "Add Review"} icon="google" onClose={onClose}
      footer={<><button className="btn btn--ghost" onClick={onClose}>Cancel</button><button className="btn btn--primary" onClick={submit}><Icon name="check" />{initial ? "Save" : "Add Review"}</button></>}>
      <div className="grid-2">
        <Field label="Reviewer Name" error={errs.name}><input value={f.name} onChange={e => setF({ ...f, name: e.target.value })} placeholder="Daniel A." /></Field>
        <Field label="Date"><input type="date" value={f.date} onChange={e => setF({ ...f, date: e.target.value })} /></Field>
      </div>
      <Field label="Star Rating"><Stars n={f.rating} set onSet={r => setF({ ...f, rating: r })} /></Field>
      <Field label="Review Text" error={errs.text} count={f.text.length + " chars"}>
        <textarea value={f.text} onChange={e => setF({ ...f, text: e.target.value })} placeholder="Their review…" />
      </Field>
    </Modal>
  );
}

function GoogleReviewsView() {
  const { data, update, logActivity } = useStore();
  const { toast, confirm } = useUI();
  const [draft, setDraft] = useState(() => clone(data.reviews));
  const [modal, setModal] = useState(null);
  const [showKey, setShowKey] = useState(false);
  const dirty = !eq(draft, data.reviews);

  const save = () => { update("reviews", draft); logActivity("review", "Updated Google reviews settings"); toast("Review settings saved"); };
  const sync = () => { logActivity("review", "Synced reviews from Google"); toast("Reviews synced from Google", "info"); };
  const saveReview = (f) => {
    if (modal.edit) setDraft(d => ({ ...d, items: d.items.map(r => r.id === modal.edit.id ? { ...r, ...f } : r) }));
    else setDraft(d => ({ ...d, items: [{ id: uid("r"), ...f }, ...d.items] }));
    setModal(null); toast(modal.edit ? "Review updated" : "Review added");
  };
  const del = (r) => confirm({ title: "Delete review?", message: `Review by ${r.name} will be removed.`, onConfirm: () => setDraft(d => ({ ...d, items: d.items.filter(x => x.id !== r.id) })) });

  return (
    <div className="view">
      <PageHead title="Google Reviews" subtitle="Pull reviews automatically from Google or manage them manually."
        actions={<>
          {draft.mode === "auto" && <button className="btn btn--ghost" onClick={sync}><Icon name="refresh" />Sync Reviews</button>}
          <button className="btn btn--primary" onClick={save} disabled={!dirty}><Icon name="check" />Save Changes</button>
        </>} />
      <UnsavedBar show={dirty} onSave={save} onDiscard={() => setDraft(clone(data.reviews))} />

      <div className="grid-2" style={{ alignItems: "start" }}>
        <div className="section-stack">
          <div className="card">
            <div className="card-head"><h3>Source</h3></div>
            <div className="card-pad">
              <div className="seg" style={{ marginBottom: 18 }}>
                <button className={draft.mode === "auto" ? "on" : ""} onClick={() => setDraft(d => ({ ...d, mode: "auto" }))}>Auto-fetch from Google</button>
                <button className={draft.mode === "manual" ? "on" : ""} onClick={() => setDraft(d => ({ ...d, mode: "manual" }))}>Manual entry</button>
              </div>
              {draft.mode === "auto" ? (
                <Field label="Google Places API Key">
                  <div className="input-icon">
                    <Icon name="lock" />
                    <input style={{ paddingLeft: 38, paddingRight: 64 }} type={showKey ? "text" : "password"} value={draft.apiKey} onChange={e => setDraft(d => ({ ...d, apiKey: e.target.value }))} placeholder="AIza…" />
                    <button type="button" onClick={() => setShowKey(s => !s)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "var(--blue)", fontWeight: 600 }}>{showKey ? "Hide" : "Show"}</button>
                  </div>
                  <div className="masked-note"><Icon name="lock" />Stored securely. Reviews refresh every 24 hours.</div>
                </Field>
              ) : (
                <div style={{ display: "flex", gap: 12 }}>
                  <Field label="Overall Rating"><input value={draft.overall} onChange={e => setDraft(d => ({ ...d, overall: e.target.value }))} /></Field>
                  <Field label="Review Count"><input value={draft.count} onChange={e => setDraft(d => ({ ...d, count: e.target.value }))} /></Field>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <h3>Reviews</h3>
              <div className="right"><button className="btn btn--soft btn--sm" onClick={() => setModal({})}><Icon name="plus" />Add Review</button></div>
            </div>
            <div className="card-pad" style={{ paddingTop: 8 }}>
              {draft.items.map(r => (
                <div key={r.id} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 0", borderBottom: "1px solid var(--line-soft)" }}>
                  <div className="gav" style={{ width: 38, height: 38, borderRadius: "50%", display: "grid", placeItems: "center", color: "#fff", fontWeight: 700, fontSize: 13, background: avatarColor(r.name), flex: "none" }}>{initials(r.name)}</div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}><b style={{ fontSize: 13.5, color: "var(--ink)" }}>{r.name}</b><Stars n={r.rating} /></div>
                    <div style={{ fontSize: 13, color: "var(--body)", margin: "3px 0", lineHeight: 1.5 }}>{r.text}</div>
                    <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{r.date}</div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="icon-btn" onClick={() => setModal({ edit: r })}><Icon name="edit" /></button>
                    <button className="icon-btn del" onClick={() => del(r)}><Icon name="trash" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head"><h3>Frontend Preview</h3><span className="sub">How reviews appear on the site</span></div>
          <div className="card-pad">
            <div className="greview-preview">
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#fff", border: "1px solid var(--line)", borderRadius: 10, padding: "10px 14px", marginBottom: 14 }}>
                <Icon name="google" />
                <div><div style={{ fontSize: 18, fontWeight: 800, color: "var(--ink)", lineHeight: 1 }}>{draft.overall} <span style={{ display: "inline-flex", verticalAlign: "middle" }}><Stars n={Math.round(+draft.overall)} /></span></div><div style={{ fontSize: 11, color: "var(--muted)" }}>from {draft.count}+ reviews</div></div>
              </div>
              {draft.items[0] && (
                <div className="greview-card">
                  <div className="gh"><div className="gav" style={{ background: avatarColor(draft.items[0].name) }}>{initials(draft.items[0].name)}</div><div><div className="gn">{draft.items[0].name}</div><Stars n={draft.items[0].rating} /></div><span style={{ marginLeft: "auto" }}><Icon name="google" /></span></div>
                  <div style={{ fontSize: 13, color: "var(--body)", lineHeight: 1.55 }}>{draft.items[0].text}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {modal && <ReviewModal initial={modal.edit} onClose={() => setModal(null)} onSave={saveReview} />}
    </div>
  );
}

Object.assign(window, { PackagesView, FaqManagerView, ServiceAreasView, SocialView, ContactView, GoogleReviewsView });
