import { describe, it, expect } from "vitest";
import { mulberry32, hashSeed, randRange } from "./rng";

describe("rng", () => {
  it("mulberry32 is deterministic for same seed", () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it("different seeds diverge", () => {
    const a = mulberry32(1)();
    const b = mulberry32(2)();
    expect(a).not.toEqual(b);
  });

  it("randRange stays within bounds", () => {
    const r = mulberry32(7);
    for (let i = 0; i < 100; i++) {
      const v = randRange(r, 10, 20);
      expect(v).toBeGreaterThanOrEqual(10);
      expect(v).toBeLessThan(20);
    }
  });

  it("hashSeed is stable", () => {
    expect(hashSeed("dragon")).toEqual(hashSeed("dragon"));
    expect(hashSeed("a")).not.toEqual(hashSeed("b"));
  });
});
