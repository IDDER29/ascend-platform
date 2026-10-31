import assert from "node:assert/strict";
import { test } from "node:test";
import { asRgb, asUtf8, asWord, bitwise, flipBit, parseByte, readByte } from "./model";

test("one byte, several readings", () => {
  assert.deepEqual(readByte(65), { unsigned: 65, signed: 65, hex: "41", bits: "01000001", ascii: "A" });
  assert.deepEqual(readByte(255), { unsigned: 255, signed: -1, hex: "FF", bits: "11111111", ascii: null });
  assert.equal(readByte(128).signed, -128);
  assert.equal(readByte(10).ascii, null);
});

test("UTF-8 text, or null when the bytes aren't valid UTF-8", () => {
  assert.equal(asUtf8([72, 105]), "Hi");
  assert.equal(asUtf8([0xc3, 0xa9]), "é");
  assert.equal(asUtf8([0xe2, 0x82, 0xac]), "€");
  assert.equal(asUtf8([0xc3]), null);
  assert.equal(asUtf8([0xff]), null);
});

test("colours and 16-bit words", () => {
  assert.equal(asRgb([255, 128, 0]), "#FF8000");
  assert.equal(asRgb([1, 2]), null);
  assert.deepEqual(asWord([0x34, 0x12]), { little: 0x1234, big: 0x3412 });
});

test("bitwise operations stay within 8 bits", () => {
  assert.equal(bitwise("AND", 0b1100, 0b1010), 0b1000);
  assert.equal(bitwise("OR", 0b1100, 0b1010), 0b1110);
  assert.equal(bitwise("XOR", 0b1100, 0b1010), 0b0110);
  assert.equal(bitwise("NOT", 0b00001111, 0), 0b11110000);
  assert.equal(bitwise("SHL", 200, 1), 144); // 400 & 255
  assert.equal(bitwise("SHR", 200, 3), 25);
  assert.equal(flipBit(0, 7), 128);
  assert.equal(flipBit(65, 5), 97); // A to a
});

test("typed bytes: decimal, hex, binary and negatives", () => {
  assert.equal(parseByte("65"), 65);
  assert.equal(parseByte("0x41"), 65);
  assert.equal(parseByte("0b1000001"), 65);
  assert.equal(parseByte("-1"), 255);
  assert.equal(parseByte("-128"), 128);
  assert.equal(parseByte("256"), null);
  assert.equal(parseByte("-129"), null);
  assert.equal(parseByte("hello"), null);
});
