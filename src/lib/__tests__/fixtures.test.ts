import { describe, it, expect } from "vitest";
import { italyLocalToUtcISO, italyOffsetMinutes } from "../fixtures";
import { ageFromDob } from "../squad";

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

describe("ageFromDob", () => {
  it("birthday already passed this year", () => {
    expect(ageFromDob("2001-01-10", new Date("2026-05-29T00:00:00Z"))).toBe(25);
  });
  it("birthday tomorrow -> not yet", () => {
    expect(ageFromDob("2001-05-30", new Date("2026-05-29T00:00:00Z"))).toBe(24);
  });
  it("leap-day DOB on non-leap year", () => {
    expect(ageFromDob("2000-02-29", new Date("2026-02-28T00:00:00Z"))).toBe(25);
  });
});
