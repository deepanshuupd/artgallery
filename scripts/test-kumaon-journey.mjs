import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../src/components/home/kumaon-journey-progress.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
const exported = {};
runInNewContext(compiled.outputText, { exports: exported });
const { journeyProgress } = exported;

test("every scroll signal stays bounded, including beyond the section", () => {
  for (let i = -100; i <= 200; i++) {
    for (const value of Object.values(journeyProgress(i / 100))) {
      assert.ok(Number.isFinite(value) && value >= 0 && value <= 1);
    }
  }
  assert.equal(journeyProgress(-1).progress, 0);
  assert.equal(journeyProgress(2).progress, 1);
});

test("the stack opens into a pronounced fan and settles into shopping links", () => {
  assert.equal(journeyProgress(0).spread, 0);
  assert.equal(journeyProgress(0).labels, 0);
  assert.ok(journeyProgress(0.39).fan > 0.99);
  assert.equal(journeyProgress(1).spread, 1);
  assert.equal(journeyProgress(1).labels, 1);
  assert.ok(journeyProgress(1).fan < 0.00001);
});

test("scrolling backward produces the identical earlier composition", () => {
  const forward = [0, 0.2, 0.39, 0.7, 1].map(p => JSON.stringify(journeyProgress(p)));
  const backward = [1, 0.7, 0.39, 0.2, 0].map(p => JSON.stringify(journeyProgress(p))).reverse();
  assert.deepEqual(backward, forward);
});

test("caption windows never display two competing messages", () => {
  for (let i = 0; i <= 1000; i++) {
    const { opening, middle, closing } = journeyProgress(i / 1000);
    assert.ok([opening, middle, closing].filter(value => value > 0.001).length <= 1);
  }
});
