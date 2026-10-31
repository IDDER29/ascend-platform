import assert from "node:assert/strict";
import { test } from "node:test";
import {
  MORE_ITEMS,
  SIDEBAR_GROUPS,
  TAB_ITEMS,
  dueBadge,
  isMoreActive,
  isNavActive,
  navAccessibleName,
} from "./app-nav";

test("a nav item is current on its page and the pages under it", () => {
  assert.equal(isNavActive("/practice", "/practice"), true);
  assert.equal(isNavActive("/practice/bank", "/practice"), true);
  assert.equal(isNavActive("/settings/account", "/settings"), true);
  assert.equal(isNavActive("/progressive", "/progress"), false);
  assert.equal(isNavActive(null, "/dashboard"), false);
});

test("lessons and the capstone count as Paths", () => {
  assert.equal(isNavActive("/lessons/what-is-a-bit", "/paths"), true);
  assert.equal(isNavActive("/projects/shellforge", "/paths"), true);
  assert.equal(isNavActive("/paths/foundations", "/paths"), true);
  assert.equal(isNavActive("/lessons/what-is-a-bit", "/dashboard"), false);
});

test("More is current only on the pages inside it", () => {
  assert.equal(isMoreActive("/bookmarks"), true);
  assert.equal(isMoreActive("/settings/appearance"), true);
  assert.equal(isMoreActive("/practice"), false);
});

test("every sidebar place is reachable on a phone, once", () => {
  const sidebar = SIDEBAR_GROUPS.flatMap((g) => g.items.map((i) => i.id)).sort();
  const phone = [...TAB_ITEMS, ...MORE_ITEMS].map((i) => i.id).sort();
  assert.deepEqual(phone, sidebar);
});

test("the due badge hides at zero and caps at 99+", () => {
  assert.equal(dueBadge(0), null);
  assert.equal(dueBadge(-3), null);
  assert.equal(dueBadge(Number.NaN), null);
  assert.equal(dueBadge(7), "7");
  assert.equal(dueBadge(99), "99");
  assert.equal(dueBadge(140), "99+");
});

test("the badge is spoken with the label", () => {
  assert.equal(navAccessibleName("Practice", 0), "Practice");
  assert.equal(navAccessibleName("Practice", 1), "Practice, 1 card due");
  assert.equal(navAccessibleName("Practice", 12), "Practice, 12 cards due");
});
