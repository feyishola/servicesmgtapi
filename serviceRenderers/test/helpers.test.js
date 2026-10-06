const { test } = require("node:test");
const assert = require("node:assert/strict");
const { ratings, escapeRegex } = require("../src/utils/helperfuctions");
const createPresence = require("../src/utils/presence");

test("ratings averages the five categories and clamps each to 0-5", () => {
  assert.equal(ratings({ timeliness: 5, communication: 4, valueForMoney: 3, customerService: 4, professionalism: 4 }), 4);
  assert.equal(ratings({ timeliness: 9, communication: 5, valueForMoney: 5, customerService: 5, professionalism: 5 }), 5);
  assert.equal(ratings({ timeliness: -3 }), 0);
});

test("ratings accepts a single overall score", () => {
  assert.equal(ratings({ score: 4 }), 4);
  assert.equal(ratings({ score: 12 }), 5);
});

test("escapeRegex neutralises user input before it reaches $regex", () => {
  const pattern = new RegExp(escapeRegex("a.c (plumbing)*"));
  assert.ok(pattern.test("a.c (plumbing)*"));
  assert.ok(!pattern.test("abc plumbing"));
});

const memoryStore = () => {
  const map = new Map();
  return {
    get: async (k) => map.get(k) ?? null,
    set: async (k, v) => void map.set(k, v),
    del: async (k) => void map.delete(k),
  };
};

test("presence tracks providers and reports who is online", async () => {
  const presence = createPresence(memoryStore());
  await presence.goOnline("p1", "s1");
  assert.deepEqual(await presence.onlineMap(["p1", "p2"]), { p1: true, p2: false });
  assert.equal(await presence.socketFor("p1"), "s1");
  assert.equal(await presence.goOffline("s1"), "p1");
  assert.deepEqual(await presence.onlineMap(["p1"]), { p1: false });
});

test("closing an older tab doesn't take a provider offline", async () => {
  const presence = createPresence(memoryStore());
  await presence.goOnline("p1", "old-tab");
  await presence.goOnline("p1", "new-tab");
  assert.equal(await presence.goOffline("old-tab"), null);
  assert.equal(await presence.socketFor("p1"), "new-tab");
});
