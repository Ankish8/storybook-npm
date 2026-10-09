"use client";

import Link from "next/link";
import { SelectionMarker } from "./selection-marker";
import { usePathname, useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import {
  ArrowUpRight,
  BookOpen,
  Blocks,
  Boxes,
  ChevronDown,
  Menu,
  Search,
  Command,
  X,
} from "lucide-react";
import {
  blocks,
  categories,
  components,
  entryHref,
  uiComponents,
  type ComponentCategory,
} from "@docs/lib/catalog";

const searchPages = [
  {
    title: "Overview",
    url: "/",
    category: "Docs",
    description: "Explore the myOperator v2 component library.",
  },
  {
    title: "Foundations",
    url: "/foundations",
    category: "Docs",
    description: "Colors, typography, spacing, focus and motion.",
  },
  ...components.map((component) => ({
    title: component.title,
    url: entryHref(component),
    category:
      component.kind === "block"
        ? "Blocks"
        : categories.find((category) => category.id === component.category)!
            .title,
    description: component.description,
  })),
];

function normalize(value: string): string {
  return value.toLowerCase().replace(/-/g, " ").trim();
}

export function LibraryShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarQuery, setSidebarQuery] = useState("");
  const [collapsedGroups, setCollapsedGroups] = useState<
    Set<ComponentCategory>
  >(new Set());
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigationRef = useRef<HTMLElement>(null);
  const sidebarInputRef = useRef<HTMLInputElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const searchReturnFocusRef = useRef<HTMLElement | null>(null);

  const { filteredComponents, filteredBlocks } = useMemo(() => {
    const terms = normalize(sidebarQuery).split(/\s+/).filter(Boolean);
    const matches = (entry: (typeof components)[number]) => {
      const text = normalize(`${entry.title} ${entry.slug}`);
      return terms.every((term) => text.includes(term));
    };
    return {
      filteredComponents: uiComponents.filter(matches),
      filteredBlocks: blocks.filter(matches),
    };
  }, [sidebarQuery]);

  const searchResults = useMemo(() => {
    const query = normalize(searchQuery);
    const terms = query.split(/\s+/).filter(Boolean);
    const score = (page: (typeof searchPages)[number]) => {
      if (!query) return 0;
      const title = normalize(page.title);
      const compact = title.replace(/\s/g, "");
      const compactQuery = query.replace(/\s/g, "");
      if (compact === compactQuery) return 100;
      if (compact.startsWith(compactQuery)) return 80;
      if (terms.every((term) => title.includes(term))) return 60;
      if (
        terms.every((term) =>
          normalize(
            `${page.title} ${page.category} ${page.description}`
          ).includes(term)
        )
      )
        return 30;
      // One mistyped letter in a component word still finds the intended page.
      const closeWord = (term: string, word: string) => {
        if (term.length < 4 || Math.abs(term.length - word.length) > 1)
          return false;
        let previous = Array.from({ length: word.length + 1 }, (_, i) => i);
        for (let i = 1; i <= term.length; i++) {
          const current = [i];
          for (let j = 1; j <= word.length; j++)
            current[j] = Math.min(
              current[j - 1] + 1,
              previous[j] + 1,
              previous[j - 1] + (term[i - 1] === word[j - 1] ? 0 : 1)
            );
          previous = current;
        }
        return previous[word.length] <= 1;
      };
      return terms.every((term) =>
        title
          .split(" ")
          .some((word) => word.includes(term) || closeWord(term, word))
      )
        ? 10
        : -1;
    };
    return searchPages
      .map((page) => ({ page, score: score(page) }))
      .filter((result) => result.score >= 0)
      .sort((a, b) => b.score - a.score)
      .map((result) => result.page);
  }, [searchQuery]);
  const selectedResult = searchResults[selectedIndex];

  const restoreSearchFocus = useCallback(() => {
    const target = searchReturnFocusRef.current;
    if (target?.isConnected && target.getClientRects().length) target.focus();
    else searchButtonRef.current?.focus();
  }, []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const openSearch = useCallback(() => {
    searchReturnFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setMobileOpen(false);
    setSearchQuery("");
    setSelectedIndex(0);
    setSearchOpen(true);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        !event.altKey &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        if (searchOpen) closeSearch();
        else openSearch();
      }
      if (event.key === "Escape" && !searchOpen) {
        if (mobileOpen) {
          event.preventDefault();
          setMobileOpen(false);
          menuButtonRef.current?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [closeSearch, mobileOpen, openSearch, searchOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (searchOpen) {
      if (!dialog.open) dialog.showModal();
      const frame = requestAnimationFrame(() =>
        searchInputRef.current?.focus()
      );
      return () => cancelAnimationFrame(frame);
    }
    if (dialog.open) {
      dialog.close();
      restoreSearchFocus();
    }
  }, [restoreSearchFocus, searchOpen]);

  useEffect(() => {
    if (!searchOpen || !selectedResult) return;
    document
      .getElementById(`arc-search-option-${selectedIndex}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [searchOpen, selectedIndex, selectedResult]);

  useEffect(() => {
    setMobileOpen(false);
    const active = components.find(
      (component) => pathname === entryHref(component)
    );
    if (!active) return;
    setCollapsedGroups((previous) => {
      if (!previous.has(active.category)) return previous;
      const next = new Set(previous);
      next.delete(active.category);
      return next;
    });
  }, [pathname]);

  useEffect(() => {
    const sidebar = navigationRef.current;
    const selected = sidebar?.querySelector<HTMLElement>(
      '.arc-nav-link[data-active="true"]'
    );
    if (!sidebar || !selected) return;
    const item = selected.getBoundingClientRect();
    const bounds = sidebar.getBoundingClientRect();
    if (item.top < bounds.top + 30 || item.bottom > bounds.bottom - 30) {
      sidebar.scrollTo({
        top:
          sidebar.scrollTop +
          item.top -
          bounds.top -
          bounds.height / 2 +
          item.height / 2,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
    }
  }, [pathname, collapsedGroups]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 900px)");
    const onResize = () => {
      if (!media.matches) setMobileOpen(false);
    };
    media.addEventListener("change", onResize);
    return () => media.removeEventListener("change", onResize);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    sidebarInputRef.current?.focus();
    const onTab = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const elements = Array.from(
        navigationRef.current?.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled]), input"
        ) ?? []
      ).filter((element) => element.getClientRects().length > 0);
      if (!elements?.length) return;
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onTab);
    return () => document.removeEventListener("keydown", onTab);
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen && !searchOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen, searchOpen]);

  const onSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!searchResults.length) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex(
        (previous) =>
          (previous +
            (event.key === "ArrowDown" ? 1 : -1) +
            searchResults.length) %
          searchResults.length
      );
    } else if (event.key === "Enter" && selectedResult) {
      event.preventDefault();
      closeSearch();
      router.push(selectedResult.url);
    }
  };

  function toggleGroup(category: ComponentCategory) {
    setCollapsedGroups((previous) => {
      const next = new Set(previous);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  }

  function closeNavigation() {
    setMobileOpen(false);
    menuButtonRef.current?.focus();
  }

  return (
    <div className="arc-shell">
      <a className="arc-skip-link" href="#arc-main">
        Skip to content
      </a>
      <header className="arc-header" inert={mobileOpen}>
        <div className="arc-header-inner">
          <div className="arc-header-left">
            <button
              ref={menuButtonRef}
              type="button"
              className="arc-mobile-toggle"
              aria-label="Open navigation"
              aria-expanded={mobileOpen}
              aria-controls="arc-navigation"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={20} aria-hidden="true" />
            </button>
            <Link
              href="/"
              className="arc-brand"
              aria-label="myOperator UI home"
            >
              <img
                className="arc-brand-symbol"
                src="/brand/myoperator-symbol.svg"
                alt=""
                width="28"
                height="29"
              />
              <img
                className="arc-brand-wordmark"
                src="/brand/myoperator-wordmark.svg"
                alt="MyOperator"
                width="104"
                height="21"
              />
              <span className="arc-brand-badge">UI</span>
            </Link>
            <nav className="arc-header-nav" aria-label="Primary">
              <SelectionMarker
                selector='[data-active="true"]'
                variant="underline"
                track={pathname}
              />
              <Link
                href="/components/button"
                prefetch={false}
                data-active={pathname.startsWith("/components/")}
              >
                Components
              </Link>
              <Link
                href={blocks[0] ? entryHref(blocks[0]) : "/#blocks"}
                prefetch={false}
                data-active={pathname.startsWith("/blocks/")}
              >
                Blocks
              </Link>
              <Link
                href="/foundations"
                prefetch={false}
                data-active={pathname === "/foundations"}
              >
                Docs
              </Link>
            </nav>
          </div>
          <div className="arc-header-right">
            <button
              type="button"
              ref={searchButtonRef}
              className="arc-search-trigger"
              aria-label="Search"
              onClick={openSearch}
              aria-haspopup="dialog"
              aria-keyshortcuts="Meta+K Control+K"
            >
              <Search size={15} aria-hidden="true" />
              <span>Search components…</span>
              <span className="arc-shortcut" aria-hidden="true">
                <kbd>
                  <Command size={12} />
                </kbd>
                <kbd>K</kbd>
              </span>
            </button>
          </div>
        </div>
      </header>
      <div className="arc-layout">
        {mobileOpen && (
          <button
            type="button"
            className="arc-mobile-backdrop"
            aria-label="Close navigation"
            tabIndex={-1}
            onClick={closeNavigation}
          />
        )}
        <aside
          ref={navigationRef}
          id="arc-navigation"
          className="arc-sidebar"
          data-open={mobileOpen}
          aria-label="Library navigation"
          role={mobileOpen ? "dialog" : undefined}
          aria-modal={mobileOpen || undefined}
        >
          <div className="arc-sidebar-mobile-header">
            <span>Navigation</span>
            <button
              type="button"
              className="arc-mobile-toggle"
              aria-label="Close navigation"
              onClick={closeNavigation}
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
          <div className="arc-sidebar-filter">
            <Search size={14} aria-hidden="true" />
            <input
              ref={sidebarInputRef}
              className="arc-filter-input"
              type="search"
              placeholder="Search components..."
              aria-label="Filter components"
              value={sidebarQuery}
              onChange={(event) => {
                setSidebarQuery(event.target.value);
                setCollapsedGroups(new Set());
              }}
            />
            {sidebarQuery && (
              <button
                type="button"
                aria-label="Clear component filter"
                onClick={() => setSidebarQuery("")}
              >
                <X size={13} aria-hidden="true" />
              </button>
            )}
          </div>
          <nav aria-label="Documentation" className="arc-navigation-items">
            <section className="arc-nav-section">
              <h2 className="arc-nav-heading">
                <BookOpen size={16} aria-hidden="true" />
                Docs
              </h2>
              <Link
                href="/"
                className="arc-nav-link"
                data-active={pathname === "/"}
                aria-current={pathname === "/" ? "page" : undefined}
              >
                Overview
              </Link>
              <Link
                href="/foundations"
                className="arc-nav-link"
                data-active={pathname === "/foundations"}
                aria-current={pathname === "/foundations" ? "page" : undefined}
              >
                Foundations
              </Link>
            </section>
            <section className="arc-nav-section">
              <h2 className="arc-nav-heading">
                <Boxes size={16} aria-hidden="true" />
                Components{" "}
                <span className="arc-nav-count">{uiComponents.length}</span>
              </h2>
              {categories.map((category) => {
                const entries = filteredComponents.filter(
                  (component) => component.category === category.id
                );
                if (!entries.length) return null;
                const expanded = !collapsedGroups.has(category.id);
                return (
                  <div className="arc-nav-group" key={category.id}>
                    <button
                      type="button"
                      className="arc-group-toggle"
                      data-expanded={expanded}
                      aria-expanded={expanded}
                      aria-controls={`arc-group-${category.id}`}
                      onClick={() => toggleGroup(category.id)}
                    >
                      <span>{category.title}</span>
                      <span className="arc-group-count">{entries.length}</span>
                      <ChevronDown size={13} aria-hidden="true" />
                    </button>
                    <div
                      className="arc-group-items"
                      id={`arc-group-${category.id}`}
                      hidden={!expanded}
                    >
                      {entries.map((component) => {
                        const active = pathname === entryHref(component);
                        return (
                          <Link
                            key={component.slug}
                            href={entryHref(component)}
                            prefetch={false}
                            className="arc-nav-link"
                            data-active={active}
                            aria-current={active ? "page" : undefined}
                          >
                            {component.title}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              {!filteredComponents.length && !filteredBlocks.length && (
                <p className="arc-nav-empty" role="status">
                  No components found.
                </p>
              )}
            </section>
            {filteredBlocks.length > 0 && (
              <section className="arc-nav-section" aria-label="Blocks">
                <h2 className="arc-nav-heading">
                  <Blocks size={16} aria-hidden="true" />
                  Blocks <span className="arc-nav-count">{blocks.length}</span>
                </h2>
                {filteredBlocks.map((block) => {
                  const active = pathname === entryHref(block);
                  return (
                    <Link
                      key={block.slug}
                      href={entryHref(block)}
                      prefetch={false}
                      className="arc-nav-link"
                      data-active={active}
                      aria-current={active ? "page" : undefined}
                    >
                      {block.title}
                    </Link>
                  );
                })}
              </section>
            )}
          </nav>
        </aside>
        <main
          className="arc-main"
          id="arc-main"
          tabIndex={-1}
          inert={mobileOpen}
        >
          <div key={pathname} className="arc-route-content">
            {children}
          </div>
        </main>
      </div>
      <dialog
        ref={dialogRef}
        className="arc-search-dialog"
        aria-label="Search documentation"
        onCancel={closeSearch}
        onClose={(event) => {
          // A queued close event must not dismiss a dialog that was reopened.
          if (!event.currentTarget.open) {
            closeSearch();
            restoreSearchFocus();
          }
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeSearch();
        }}
      >
        <div className="arc-search-bar">
          <Search size={18} aria-hidden="true" />
          <input
            ref={searchInputRef}
            className="arc-search-input"
            type="search"
            role="combobox"
            aria-label="Search documentation"
            aria-autocomplete="list"
            aria-expanded={searchOpen}
            aria-controls="arc-search-results"
            aria-activedescendant={
              searchOpen && selectedResult
                ? `arc-search-option-${selectedIndex}`
                : undefined
            }
            placeholder="Search components and docs..."
            value={searchQuery}
            onKeyDown={onSearchKeyDown}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setSelectedIndex(0);
            }}
          />
          {searchQuery && (
            <button
              className="arc-search-clear"
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setSearchQuery("");
                setSelectedIndex(0);
                searchInputRef.current?.focus();
              }}
            >
              <X size={16} />
            </button>
          )}
          <button
            className="arc-search-close"
            type="button"
            aria-label="Close search"
            onClick={closeSearch}
          >
            <kbd>Esc</kbd>
          </button>
        </div>
        <div
          className="arc-search-results"
          id="arc-search-results"
          role="listbox"
          aria-label="Search results"
        >
          {searchResults.map((result, index) => (
            <Link
              key={result.url}
              href={result.url}
              prefetch={false}
              role="option"
              tabIndex={-1}
              id={`arc-search-option-${index}`}
              className="arc-search-result"
              data-selected={selectedIndex === index}
              aria-selected={selectedIndex === index}
              onPointerMove={() => setSelectedIndex(index)}
              onClick={closeSearch}
            >
              <span>
                <span className="arc-search-result-title">{result.title}</span>
                <span className="arc-search-result-meta">
                  {result.category}
                </span>
              </span>
              <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          ))}
          {!searchResults.length && (
            <p className="arc-search-empty" role="status">
              No results found. Try another component name.
            </p>
          )}
        </div>
        <div className="arc-search-footer">
          <span>↑ ↓ to navigate · Enter to open</span>
          <span role="status">
            {searchResults.length}{" "}
            {searchResults.length === 1 ? "result" : "results"}
          </span>
        </div>
      </dialog>
    </div>
  );
}
