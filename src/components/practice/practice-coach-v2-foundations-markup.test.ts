import assert from "node:assert/strict";
import { test } from "node:test";
import { PRACTICE_COACH_V2_FOUNDATIONS_HTML } from "./practice-coach-v2-foundations-markup";

test("Foundations practice CTAs start the live path-scoped session", () => {
  const practiceSessionHrefs = [
    ...PRACTICE_COACH_V2_FOUNDATIONS_HTML.matchAll(
      /href="([^"]*practicev2\/session[^"]*)"/g,
    ),
  ].map((match) => match[1]);

  assert.ok(practiceSessionHrefs.length > 0);
  assert.ok(
    practiceSessionHrefs.every(
      (href) => href === "/practicev2/session?scope=path&path=foundations",
    ),
  );
});
