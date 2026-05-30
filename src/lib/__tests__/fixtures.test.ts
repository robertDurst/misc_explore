import { describe, it, expect } from "vitest";
import { italyLocalToUtcISO, italyOffsetMinutes } from "../fixtures";

describe("italyOffsetMinutes", () => {
  it("is +60 (CET) in deep winter", () => {
    expect(italyOffsetMinutes(new Date("2026-01-15T12:00:00Z"))).toBe(60);
  });
  it("is +120 (CEST) in deep summer", () => {
    expect(italyOffsetMinutes(new Date("2026-07-15T12:00:00Z"))).toBe(120);
  });
});

describe("italyLocalToUtcISO", () => {
  it("20:45 in winter -> 19:45 UTC", () => {
    expect(italyLocalToUtcISO("2026-02-08", "20:45"))
      .toBe("2026-02-08T19:45:00.000Z");
  });
  it("20:45 in summer -> 18:45 UTC", () => {
    expect(italyLocalToUtcISO("2026-09-13", "20:45"))
      .toBe("2026-09-13T18:45:00.000Z");
  });
  it("kickoff after DST spring-forward (29 Mar 2026)", () => {
    expect(italyLocalToUtcISO("2026-03-29", "20:45"))
      .toBe("2026-03-29T18:45:00.000Z");
  });
  it("kickoff after DST fall-back (25 Oct 2026)", () => {
    expect(italyLocalToUtcISO("2026-10-25", "20:45"))
      .toBe("2026-10-25T19:45:00.000Z");
  });
  it("00:30 local crosses UTC day boundary", () => {
    expect(italyLocalToUtcISO("2026-11-02", "00:30"))
      .toBe("2026-11-01T23:30:00.000Z");
  });
});
