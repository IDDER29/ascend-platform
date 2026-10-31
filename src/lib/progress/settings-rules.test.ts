import assert from "node:assert/strict";
import { test } from "node:test";
import { cleanSettingsPatch, NAME_MAX } from "./settings-rules";

test("valid fields pass through, trimmed", () => {
  assert.deepEqual(cleanSettingsPatch({ name: "  Ada  ", theme: "Dark", pace: "regular", accent: "#00FF88", reminderTime: "07:30", notifWeeklyRecap: true }), {
    name: "Ada",
    theme: "Dark",
    pace: "regular",
    accent: "#00FF88",
    reminderTime: "07:30",
    notifWeeklyRecap: true,
  });
});

test("unknown values, wrong types and extra fields are dropped", () => {
  assert.deepEqual(
    cleanSettingsPatch({ theme: "Neon", pace: "x", accent: "red;}", reminderTime: "25:00", notifWeeklyRecap: "yes", userId: "someone-else" }),
    {},
  );
  assert.deepEqual(cleanSettingsPatch(null), {});
  assert.deepEqual(cleanSettingsPatch("theme"), {});
});

test("long strings are capped", () => {
  assert.equal(cleanSettingsPatch({ name: "a".repeat(1000) }).name?.length, NAME_MAX);
  assert.equal(cleanSettingsPatch({ bio: "b".repeat(10000) }).bio?.length, 2000);
});
