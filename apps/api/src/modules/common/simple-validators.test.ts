import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { BadRequestException } from "@nestjs/common";
import {
  assertArray,
  assertInteger,
  assertNumber,
  assertOneOf,
  assertOptionalString,
  assertString,
  isRecord
} from "./simple-validators";

describe("simple validators", () => {
  it("trims required strings", () => {
    assert.equal(assertString("  BeautyGo  ", "name"), "BeautyGo");
  });

  it("rejects non-string values", () => {
    assert.throws(() => assertString(123, "name"), BadRequestException);
    assert.throws(() => assertString(null, "name"), BadRequestException);
    assert.throws(() => assertString(undefined, "name"), BadRequestException);
  });

  it("rejects empty strings", () => {
    assert.throws(() => assertString("", "name"), BadRequestException);
    assert.throws(() => assertString("   ", "name"), BadRequestException);
  });

  it("rejects strings beyond maxLength", () => {
    assert.throws(
      () => assertString("BeautyGo", "name", { maxLength: 4 }),
      BadRequestException
    );
  });

  it("accepts strings within maxLength", () => {
    assert.equal(assertString("abc", "name", { maxLength: 3 }), "abc");
  });

  it("allows empty optional strings to be omitted only when nullish", () => {
    assert.equal(assertOptionalString(undefined, "note"), undefined);
    assert.equal(assertOptionalString(null, "note"), undefined);
    assert.throws(() => assertOptionalString("   ", "note"), BadRequestException);
  });

  it("validates optional string present values", () => {
    assert.equal(assertOptionalString("hello", "note"), "hello");
  });

  it("accepts finite numbers", () => {
    assert.equal(assertNumber(42, "price"), 42);
    assert.equal(assertNumber(0, "price"), 0);
    assert.equal(assertNumber(-1.5, "price"), -1.5);
  });

  it("rejects non-numbers", () => {
    assert.throws(() => assertNumber("42", "price"), BadRequestException);
    assert.throws(() => assertNumber(NaN, "price"), BadRequestException);
    assert.throws(() => assertNumber(Infinity, "price"), BadRequestException);
  });

  it("validates integer boundaries", () => {
    assert.equal(assertInteger(3, "experienceYears", { min: 0, max: 10 }), 3);
    assert.throws(() => assertInteger(11, "experienceYears", { max: 10 }), BadRequestException);
    assert.throws(() => assertInteger(-1, "experienceYears", { min: 0 }), BadRequestException);
  });

  it("rejects non-integers", () => {
    assert.throws(() => assertInteger(1.5, "count"), BadRequestException);
  });

  it("accepts arrays", () => {
    assert.deepEqual(assertArray([1, 2], "items"), [1, 2]);
    assert.deepEqual(assertArray([], "items"), []);
  });

  it("rejects non-arrays", () => {
    assert.throws(() => assertArray("not array", "items"), BadRequestException);
    assert.throws(() => assertArray({}, "items"), BadRequestException);
  });

  it("assertOneOf accepts allowed values", () => {
    const allowed = ["a", "b", "c"] as const;
    assert.equal(assertOneOf("a", "field", allowed), "a");
    assert.equal(assertOneOf("c", "field", allowed), "c");
  });

  it("assertOneOf rejects disallowed values", () => {
    const allowed = ["a", "b", "c"] as const;
    assert.throws(() => assertOneOf("d", "field", allowed), BadRequestException);
    assert.throws(() => assertOneOf("", "field", allowed), BadRequestException);
  });

  it("isRecord identifies plain objects", () => {
    assert.equal(isRecord({}), true);
    assert.equal(isRecord({ a: 1 }), true);
    assert.equal(isRecord(null), false);
    assert.equal(isRecord([]), false);
    assert.equal(isRecord("string"), false);
    assert.equal(isRecord(42), false);
  });
});
