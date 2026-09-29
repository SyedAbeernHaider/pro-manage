import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import logoMark from '../assets/kanbrix-mark.svg';
import './Navbar.css';

/* =========================================================
   NAV DATA
========================================================= */

const NAV_MENUS = [
  {
    id: 'features',
    label: 'Features',
    columns: 2,
    items: [
      {
        title: 'Task Management',
        desc: 'Plan, assign and track every task',
        icon: 'check',
      },
      {
        title: 'Project Management',
        desc: 'Boards, timelines and milestones',
        icon: 'board',
      },
      {
        title: 'Team Collaboration',
        desc: 'Comments, mentions and files',
        icon: 'users',
      },
      {
        title: 'Reports',
        desc: 'Real-time insights on progress',
        icon: 'chart',
      },
    ],
    footer: { label: 'Explore all features', to: '/features' },
  },
  {
    id: 'solutions',
    label: 'Solutions',
    columns: 1,
    items: [
      {
        title: 'For Teams',
        desc: 'Keep everyone aligned and shipping',
        icon: 'team',
      },
      {
        title: 'For Startups',
        desc: 'Move fast without losing track',
        icon: 'rocket',
      },
      {
        title: 'For Agencies',
        desc: 'Manage clients and deliverables',
        icon: 'briefcase',
      },
    ],
  },
  {
    id: 'resources',
    label: 'Resources',
    columns: 1,
    items: [
      {
        title: 'Blog',
        desc: 'Guides, tips and product news',
        icon: 'pen',
      },
      {
        title: 'Documentation',
        desc: 'Learn how Kanbrix works',
        icon: 'book',
      },
      {
        title: 'Help Center',
        desc: 'Get answers and support',
        icon: 'help',
      },
    ],
  },
];

const ICON_PATHS = {
  check: 'M9 11l3 3 8-8M20 12v6a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h9',
  board:
    'M4 5a1 1 0 011-1h4a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v8a1 1 0 01-1 1h-4a1 1 0 01-1-1V5z',
  users:
    'M17 20v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1M10 11a4 4 0 100-8 4 4 0 000 8zM21 20v-1a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
  chart: 'M4 20V10M10 20V4M16 20v-8M22 20H2',
  team: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0',
  rocket:
    'M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2M9 11a18 18 0 016-7c2-1 5-1 5-1s0 3-1 5a18 18 0 01-7 6l-3-3zM9 11H5l2-4h5M13 15v4l4-2v-5',
  briefcase:
    'M4 8h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1zM9 8V5a1 1 0 011-1h4a1 1 0 011 1v3M3 13h18',
  pen: 'M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z',
  book: 'M4 19.5A2.5 2.5 0 016.5 17H20V3H6.5A2.5 2.5 0 004 5.5v14zM4 19.5A2.5 2.5 0 006.5 22H20v-5',
  help: 'M12 22a10 10 0 100-20 10 10 0 000 20zM9.1 9a3 3 0 015.8 1c0 2-3 3-3 3M12 17h.01',
};

const NavIcon = ({ name }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={ICON_PATHS[name]} />
  </svg>
);

const ArrowIcon = ({ className }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const Chevron = ({ open }) => (
  <svg
    className={`chevron ${open ? 'chevron-open' : ''}`}
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M6 9L12 15L18 9"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* =========================================================
   NAVBAR
========================================================= */

const Navbar = () => {
  const [openId, setOpenId] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pill, setPill] = useState({ left: 0, width: 0, visible: false });

  const headerRef = useRef(null);
  const linksRef = useRef(null);
  const progressRef = useRef(null);
  const triggerRefs = useRef({});
  const closeTimer = useRef(null);
  const hovering = useRef(false);

  /* ---------- sliding hover pill ---------- */

  const movePill = (el) => {
    if (!el || !linksRef.current) return;

    const parent = linksRef.current.getBoundingClientRect();
    const rect = el.getBoundingClientRect();

    setPill({
      left: rect.left - parent.left,
      width: rect.width,
      visible: true,
    });
  };

  useEffect(() => {
    if (openId) {
      movePill(triggerRefs.current[openId]);
    } else if (!hovering.current) {
      setPill((p) => ({ ...p, visible: false }));
    }
  }, [openId]);

  /* ---------- hover open / delayed close ---------- */

  const openMenu = (id) => {
    clearTimeout(closeTimer.current);
    setOpenId(id);
  };

  const scheduleClose = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenId(null), 160);
  };

  const closeAll = () => {
    clearTimeout(closeTimer.current);
    setOpenId(null);
    setMobileOpen(false);
  };

  /* ---------- scroll state + progress bar ---------- */

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;

      setScrolled(y > 12);

      progressRef.current?.style.setProperty('--progress', max > 0 ? Math.min(y / max, 1) : 0);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ---------- outside click, Escape, resize ---------- */

  useEffect(() => {
    const onPointerDown = (e) => {
      if (!headerRef.current?.contains(e.target)) closeAll();
    };

    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeAll();
    };

    const onResize = () => {
      if (window.innerWidth > 900) setMobileOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
      clearTimeout(closeTimer.current);
    };
  }, []);

  return (
    <header ref={headerRef} className={`navbar-wrapper ${scrolled ? 'navbar-scrolled' : ''}`}>
      <nav className="navbar" aria-label="Main">
        {/* ================= LOGO ================= */}
        <a href="/" className="navbar-logo" aria-label="Kanbrix home">
          <img src={logoMark} alt="" className="navbar-logo-mark" />
          <span className="navbar-logo-text">
            Kan<span className="navbar-logo-accent">brix</span>
          </span>
        </a>

        {/* ================= DESKTOP NAV ================= */}
        <div
          ref={linksRef}
          className="desktop-nav"
          onMouseEnter={() => {
            hovering.current = true;
          }}
          onMouseLeave={() => {
            hovering.current = false;
            if (!openId) {
              setPill((p) => ({ ...p, visible: false }));
            }
          }}
        >
          <span
            className={`nav-pill ${pill.visible ? 'nav-pill-visible' : ''}`}
            style={{
              width: pill.width,
              transform: `translate(${pill.left}px, -50%)`,
            }}
            aria-hidden="true"
          />

          {NAV_MENUS.map((menu, index) => {
            const open = openId === menu.id;

            return (
              <div
                key={menu.id}
                className={`nav-dropdown ${open ? 'nav-dropdown-open' : ''}`}
                style={{ '--i': index }}
                onPointerEnter={(e) => {
                  if (e.pointerType !== 'mouse') return;
                  movePill(triggerRefs.current[menu.id]);
                  openMenu(menu.id);
                }}
                onPointerLeave={(e) => {
                  if (e.pointerType !== 'mouse') return;
                  scheduleClose();
                }}
              >
                <button
                  ref={(el) => {
                    triggerRefs.current[menu.id] = el;
                  }}
                  type="button"
                  className={`nav-button ${open ? 'nav-button-active' : ''}`}
                  aria-expanded={open}
                  aria-haspopup="true"
                  onClick={() => (open ? setOpenId(null) : openMenu(menu.id))}
                >
                  <span>{menu.label}</span>
                  <Chevron open={open} />
                </button>

                <DropdownMenu menu={menu} open={open} onSelect={closeAll} />
              </div>
            );
          })}

          <a
            href="#pricing"
            className="nav-link"
            style={{ '--i': NAV_MENUS.length }}
            onMouseEnter={(e) => {
              movePill(e.currentTarget);
              setOpenId(null);
            }}
            onFocus={(e) => movePill(e.currentTarget)}
          >
            Pricing
          </a>
        </div>

        {/* ================= RIGHT ACTIONS ================= */}
        <div className="navbar-actions">
          <a href="#login" className="login-button">
            Login
          </a>

          <a href="#get-started" className="get-started-button">
            <span>Get Started</span>
            <ArrowIcon className="arrow-icon" />
          </a>
        </div>

        {/* ================= MOBILE MENU BUTTON ================= */}
        <button
          type="button"
          className={`mobile-menu-button ${mobileOpen ? 'mobile-menu-active' : ''}`}
          onClick={() => {
            setMobileOpen(!mobileOpen);
            setOpenId(null);
          }}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* ================= SCROLL PROGRESS ================= */}
        <span ref={progressRef} className="nav-progress" aria-hidden="true" />
      </nav>

      {/* ================= MOBILE MENU ================= */}
      <div
        className={`mobile-menu ${mobileOpen ? 'mobile-menu-open' : ''}`}
        aria-hidden={!mobileOpen}
      >
        <div className="mobile-menu-inner">
          <div className="mobile-menu-card">
            {NAV_MENUS.map((menu, index) => (
              <MobileItem key={menu.id} menu={menu} index={index} onSelect={closeAll} />
            ))}

            <a
              href="#pricing"
              className="mobile-link"
              style={{ '--i': NAV_MENUS.length }}
              onClick={closeAll}
            >
              Pricing
            </a>

            <div className="mobile-actions" style={{ '--i': NAV_MENUS.length + 1 }}>
              <a href="#login" className="mobile-login" onClick={closeAll}>
                Login
              </a>

              <a href="#get-started" className="mobile-get-started" onClick={closeAll}>
                Get Started
                <ArrowIcon className="arrow-icon" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

/* =========================================================
   DROPDOWN MENU COMPONENT
========================================================= */

const DropdownMenu = ({ menu, open, onSelect }) => (
  <div
    className={`dropdown-menu ${open ? 'dropdown-open' : ''} ${
      menu.columns > 1 ? 'dropdown-wide' : ''
    }`}
  >
    <div className="dropdown-grid" style={{ gridTemplateColumns: `repeat(${menu.columns}, 1fr)` }}>
      {menu.items.map((item, index) => (
        <a
          key={item.title}
          href="#"
          className="dropdown-item"
          style={{ '--i': index }}
          tabIndex={open ? 0 : -1}
          onClick={(e) => {
            e.preventDefault();
            onSelect();
          }}
        >
          <span className="dropdown-icon">
            <NavIcon name={item.icon} />
          </span>

          <span className="dropdown-text">
            <span className="dropdown-title">{item.title}</span>
            <span className="dropdown-desc">{item.desc}</span>
          </span>
        </a>
      ))}
    </div>

    {menu.footer && (
      <Link
        to={menu.footer.to}
        className="dropdown-footer"
        tabIndex={open ? 0 : -1}
        onClick={onSelect}
      >
        <span>{menu.footer.label}</span>
        <ArrowIcon className="dropdown-footer-arrow" />
      </Link>
    )}
  </div>
);

/* =========================================================
   MOBILE ACCORDION COMPONENT
========================================================= */

const MobileItem = ({ menu, index, onSelect }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mobile-dropdown" style={{ '--i': index }}>
      <button
        type="button"
        className={`mobile-dropdown-button ${open ? 'mobile-dropdown-active' : ''}`}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span>{menu.label}</span>
        <Chevron open={open} />
      </button>

      <div className={`mobile-accordion ${open ? 'mobile-accordion-open' : ''}`}>
        <div className="mobile-accordion-inner">
          {menu.items.map((item) => (
            <a
              key={item.title}
              href="#"
              className="mobile-option"
              tabIndex={open ? 0 : -1}
              onClick={(e) => {
                e.preventDefault();
                onSelect();
              }}
            >
              <span className="dropdown-icon">
                <NavIcon name={item.icon} />
              </span>
              <span className="dropdown-text">
                <span className="dropdown-title">{item.title}</span>
                <span className="dropdown-desc">{item.desc}</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
