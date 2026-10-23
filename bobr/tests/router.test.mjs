import { test } from "node:test";
import assert from "node:assert/strict";
import { parse, href } from "../src/js/router.js";

test("parse", () => {
  assert.deepEqual(parse(""), { section: null, question: null });
  assert.deepEqual(parse("?section=razeni"), { section: "razeni", question: null });
  assert.deepEqual(parse("?question=b&utm=x&section=a"), { section: "a", question: "b" });
  assert.deepEqual(parse("?question=b"), { section: null, question: "b" });
  assert.deepEqual(parse("?section="), { section: null, question: null });
});

test("href: vždy relativní, section před question", () => {
  assert.equal(href({}), "./");
  assert.equal(href({ section: "razeni" }), "?section=razeni");
  assert.equal(href({ section: "razeni", question: "jeden-pruchod" }), "?section=razeni&question=jeden-pruchod");
  assert.equal(href({ section: "a b&c" }), "?section=a+b%26c");
});
