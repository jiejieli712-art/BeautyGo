import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { BadRequestException } from "@nestjs/common";
import { assertInteger, assertOptionalString, assertString } from "./simple-validators";

describe("simple validators", () => {
  it("trims required strings", () => {
    assert.equal(assertString("  BeautyGo  ", "name"), "BeautyGo");
  });

  it("rejects strings beyond maxLength", () => {
    assert.throws(
      () => assertString("BeautyGo", "name", { maxLength: 4 }),
      BadRequestException
    );
  });

  it("allows empty optional strings to be omitted only when nullish", () => {
    assert.equal(assertOptionalString(undefined, "note"), undefined);
    assert.throws(() => assertOptionalString("   ", "note"), BadRequestException);
  });

  it("validates integer boundaries", () => {
    assert.equal(assertInteger(3, "experienceYears", { min: 0, max: 10 }), 3);
    assert.throws(() => assertInteger(11, "experienceYears", { max: 10 }), BadRequestException);
  });
});
