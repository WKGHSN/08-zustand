// components/TagsMenu/TagsMenu.tsx
"use client";

import css from "./TagsMenu.module.css";
import { useState } from "react";
import { NoteTag } from "@/types/note";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NOTE_TAGS: NoteTag[] = [
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
];

export default function TagsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
  const toggleFilterMenu = () => setIsOpen(!isOpen);
  
  // Функція для визначення активного тегу
  const isActiveTag = (tag: string) => {
    return pathname === `/notes/filter/${tag}`;
  };

  return (
    <div className={css.menuContainer}>
      <button 
        className={css.menuButton} 
        onClick={toggleFilterMenu}
        aria-expanded={isOpen}
        aria-label="Filter notes by tag"
      >
        Notes ▾
      </button>
      
      {isOpen && (
        <ul className={css.menuList} role="menu">
          <li key="All" className={css.menuItem} role="none">
            <Link
              href="/notes/filter/All"
              className={`${css.menuLink} ${isActiveTag("All") ? css.active : ""}`}
              onClick={toggleFilterMenu}
              role="menuitem"
              aria-current={isActiveTag("All") ? "page" : undefined}
            >
              All Tags
            </Link>
          </li>
          
          {NOTE_TAGS.map((tag) => (
            <li key={tag} className={css.menuItem} role="none">
              <Link
                href={`/notes/filter/${tag}`}
                className={`${css.menuLink} ${isActiveTag(tag) ? css.active : ""}`}
                onClick={toggleFilterMenu}
                role="menuitem"
                aria-current={isActiveTag(tag) ? "page" : undefined}
              >
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}