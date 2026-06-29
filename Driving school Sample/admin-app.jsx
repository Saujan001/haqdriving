/* ===== R2 Admin — app shell ===== */

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard", title: "Dashboard" },
  { id: "settings", label: "Global Settings", icon: "settings", title: "Global Settings" },
  { id: "branding", label: "Logo & Branding", icon: "image", title: "Logo & Branding" },
  { id: "photos", label: "Success Photos", icon: "camera", title: "Success Photos" },
  { id: "packages", label: "Lesson Packages", icon: "box", title: "Lesson Packages" },
  { id: "faq", label: "FAQ Manager", icon: "help", title: "FAQ Manager" },
  { id: "areas", label: "Service Areas", icon: "pin", title: "Service Areas" },
  { id: "social", label: "Social Media Links", icon: "globe", title: "Social Media Links" },
  { id: "contact", label: "Contact Details", icon: "phone", title: "Contact Details" },
  { id: "reviews", label: "Google Reviews", icon: "google", title: "Google Reviews" },
  { sep: true },
  { id: "preview", label: "Preview Site", icon: "eye", external: true },
  { id: "logout", label: "Logout", icon: "logout", danger: true },
];

const VIEWS = {
  dashboard: DashboardView,
  settings: GlobalSettingsView,
  branding: LogoBrandingView,
  photos: SuccessPhotosView,
  packages: PackagesView,
  faq: FaqManagerView,
  areas: ServiceAreasView,
  social: SocialView,
  contact: ContactView,
  reviews: GoogleReviewsView,
};

function Sidebar({ current, go, counts, open, onClose }) {
  const { data } = useStore();
  return (
    <>
      <div className={"sb-backdrop" + (open ? " open" : "")} onClick={onClose}></div>
      <aside className={"sidebar" + (open ? " open" : "")}>
        <div className="sb-brand">
          <div className="sb-badge">{data.branding.logoText}</div>
          <div><div className="t">R2 Admin</div><div className="s">{data.business.name}</div></div>
        </div>
        <nav className="sb-nav">
          {NAV.map((n, i) => n.sep
            ? <div className="sb-sep" key={"sep" + i}></div>
            : (
              <button key={n.id} className={"sb-link" + (current === n.id ? " active" : "") + (n.danger ? " danger" : "")} onClick={() => go(n.id)}>
                <Icon name={n.icon} />
                {n.label}
                {counts[n.id] != null && <span className="badge-count">{counts[n.id]}</span>}
              </button>
            ))}
        </nav>
      </aside>
    </>
  );
}

function Topbar({ title, onBurger, onPreview }) {
  return (
    <header className="topbar">
      <button className="tb-burger" onClick={onBurger} aria-label="Menu"><Icon name="menu" /></button>
      <div className="tb-titles">
        <div className="tb-crumb">Home <Icon name="chevronRight" /> <span style={{ color: "var(--body)" }}>{title}</span></div>
        <div className="tb-title">{title}</div>
      </div>
      <div className="tb-right">
        <button className="btn btn--ghost" onClick={onPreview}><Icon name="eye" />Preview Website</button>
        <div className="avatar-wrap">
          <div className="who"><b>School Owner</b><span>Administrator</span></div>
          <div className="avatar">SO</div>
        </div>
      </div>
    </header>
  );
}

function AdminApp() {
  const { data, resetData } = useStore();
  const { toast, confirm } = useUI();
  const [current, setCurrent] = useState("dashboard");
  const [sbOpen, setSbOpen] = useState(false);

  const openSite = () => window.open("Right 2 Drive.html", "_blank");

  const go = (id) => {
    if (id === "preview") { openSite(); return; }
    if (id === "logout") {
      confirm({ title: "Log out?", message: "You'll be returned to the login screen. Unsaved changes on the current page will be lost.", icon: "logout", confirmLabel: "Log out", onConfirm: () => toast("Logged out", "info") });
      return;
    }
    setCurrent(id);
    setSbOpen(false);
    window.scrollTo(0, 0);
  };

  const counts = {
    photos: data.photos.length, packages: data.packages.length, faq: data.faqs.length,
    areas: data.areas.length, reviews: data.reviews.items.length,
  };
  const View = VIEWS[current] || DashboardView;
  const title = (NAV.find(n => n.id === current) || {}).title || "Dashboard";

  return (
    <div className="app">
      <Sidebar current={current} go={go} counts={counts} open={sbOpen} onClose={() => setSbOpen(false)} />
      <div className="main">
        <Topbar title={title} onBurger={() => setSbOpen(true)} onPreview={openSite} />
        <View go={go} />
      </div>
    </div>
  );
}

function Root() {
  return (
    <StoreProvider>
      <UIProvider>
        <AdminApp />
      </UIProvider>
    </StoreProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);
