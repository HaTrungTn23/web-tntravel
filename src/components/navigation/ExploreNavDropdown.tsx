"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { CalendarDays, ChevronDown, Compass, Map, UtensilsCrossed } from "lucide-react";
import styles from "./explore-dropdown.module.css";

type SectionOption = {
  key: string;
  href: string;
  label: string;
  note: string;
  image: string;
  icon: typeof Map;
};

const SECTIONS: SectionOption[] = [
  {
    key: "destinations",
    href: "/explore",
    label: "Điểm đến",
    note: "Bản đồ tương tác, vùng trà và danh thắng",
    image: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=800&q=82",
    icon: Map,
  },
  {
    key: "cuisine",
    href: "/cuisine",
    label: "Ẩm thực",
    note: "Món ngon đậm vị vùng cao và sản vật trà",
    image: "/images/culture/am-thuc-thai-nguyen.webp",
    icon: UtensilsCrossed,
  },
  {
    key: "festivals",
    href: "/festivals",
    label: "Lễ hội",
    note: "Nghi lễ truyền thống và nhịp hội theo mùa",
    image: "/images/culture/le-hoi-thai-nguyen.webp",
    icon: CalendarDays,
  },
];

export function ExploreNavDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string>("destinations");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Highlight if current page is within explore / cuisine / festivals
  const isCurrentActive =
    pathname.startsWith("/explore") ||
    pathname.startsWith("/cuisine") ||
    pathname.startsWith("/festivals");

  // Close dropdown on outside click or Esc
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Track pathname to close dropdown on navigation without triggering synchronous effect render
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  const activeOption = SECTIONS.find((s) => s.key === selectedKey) || SECTIONS[0];

  return (
    <div className={styles.wrap} ref={dropdownRef}>
      <button
        type="button"
        className={`${styles.trigger} ${isCurrentActive ? styles.activeNav : ""}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Compass size={16} aria-hidden="true" />
        <span>Khám phá</span>
        <ChevronDown
          size={14}
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div className={styles.menu} role="menu" aria-label="Không gian khám phá">
          <div className={styles.list}>
            <small className={styles.listHeading}>CHỌN KHÔNG GIAN</small>
            {SECTIONS.map((item) => {
              const Icon = item.icon;
              const isSelected = item.key === selectedKey;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  role="menuitem"
                  className={`${styles.item} ${isSelected ? styles.itemActive : ""}`}
                  onMouseEnter={() => setSelectedKey(item.key)}
                  onClick={() => setIsOpen(false)}
                >
                  <span className={styles.itemIconWrap}>
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <span className={styles.itemText}>
                    <b>{item.label}</b>
                    <em>{item.note}</em>
                  </span>
                </Link>
              );
            })}
          </div>

          <div className={styles.preview}>
            <Image
              src={activeOption.image}
              alt={activeOption.label}
              fill
              sizes="280px"
              className={styles.previewImg}
            />
            <div className={styles.previewOverlay}>
              <small>ĐANG XEM TRƯỚC</small>
              <b>{activeOption.label}</b>
              <Link
                href={activeOption.href}
                className={styles.previewBtn}
                onClick={() => setIsOpen(false)}
              >
                Mở chuyên trang
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
