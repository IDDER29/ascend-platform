# Course 2 — Binary, Numbers, and Data Representation

**Foundations Curriculum v2.0 — Course 2 of 8**  
**Shared plan:** [Foundations overview](01_foundations_overview.md) · **Machine ISA:** [FS-8 v1.0 specification in Course 5](06_course_05_cpu_architecture.md)  
**Navigation:** [Overview](01_foundations_overview.md) · [Previous course](02_course_01_computers_and_information.md) · [Next course](04_course_03_logic_and_circuits.md)

**Note:** All course project acceptance criteria, debugging tasks, transfer assessments and primary source links are preserved below. FS-8 machine rules are defined normatively in the appendix to Course 5, not separately in each course.

**Course goal:** Read and construct bit patterns for numbers and other basic kinds of data; understand the limitations of fixed-size representations.  
**Prerequisites:** Course 1.  
**End-of-course ability:** Explain why the same byte can have multiple interpretations; predict common eight-bit arithmetic results; describe how text and media are encoded.

## Lessons

| ID | Lesson | Description |
|---|---|---|
| F010 | Place Value and Number Bases | Revisit decimal place value and generalize it to a base, preparing for binary without assuming the decimal notation is physically special. |
| F011 | Counting in Binary | Count using only `0` and `1`, read powers-of-two place values, and explain why each new bit doubles the possible patterns. |
| F012 | Converting Binary and Decimal | Convert small whole numbers in both directions and verify by reconstructing their weighted sum. |
| F013 | Bits, Nibbles, Bytes, and Words | Relate fixed widths to representable patterns; distinguish a byte from a CPU word and decimal from binary capacity prefixes. |
| F014 | Hexadecimal: A Human-Friendly View of Bits | Group four bits per hex digit and move between binary and hexadecimal as a compact notation useful for inspecting memory and machine code. |
| F015 | Unsigned Binary Addition and Carry | Perform addition in a fixed number of bits; distinguish result bits, carry-out, and the mathematical sum. |
| F016 | Negative Numbers and Two's Complement | Encode and decode signed two's-complement integers and explain why a bit pattern does not declare its own signedness. |
| F017 | Binary Subtraction with an Adder | Use complement-and-add to subtract; connect this rule to the arithmetic circuits that will be built in Course 3. |
| F018 | Overflow, Truncation, and Fixed-Width Arithmetic | Predict what happens when a result cannot fit the selected representation; distinguish unsigned carry from signed overflow. |
| F019 | Bitwise Operations and Shifts | Apply AND, OR, XOR, NOT, left/right shifts and simple masks to patterns; distinguish bitwise operations from ordinary logical claims. |
| F020 | Characters: ASCII, Unicode, and UTF-8 | Encode a few characters, distinguish a character from its code point and byte encoding, and see why a text character need not occupy one byte. |
| F021 | Pixels, Color, Audio, and File Encodings | Introduce pixels and color channels, sampled sound, and file-format conventions as different interpretations of bytes—not as a full multimedia-processing course. |
| F022 | Binary Fractions and Floating-Point Approximation | Show why some decimal fractions are not exactly representable in finite binary and why floating-point results may be approximate; postpone full IEEE 754 mechanics. |

## Projects

**P2-A · Guided lab (non-gating) — Number-System Workbench.** Convert values among decimal, binary, and hexadecimal; display eight-bit signed and unsigned interpretations; test overflow with predictions before the tool reveals results. **Accept:** correct conversions and ability to distinguish signed overflow from an unsigned carry.

**P2-B · Required core milestone — The Byte Laboratory (v2).** Upgrade the Machine Atlas with an editable byte grid, interpretation modes (unsigned, two's complement, ASCII/UTF-8 when valid, RGB components), and bitwise-operation previews. Export/import byte arrays that future circuit and memory projects can use. **Accept:** a data pattern survives round-tripping through at least two display formats without silently changing bits.

**P2-X · Optional extension — Design a Tiny File Format.** Define a header and payload for a small black-and-white image; document encoding, dimensions, byte order (if multi-byte fields are used), and a decoder. Do not assume arbitrary bytes form valid UTF-8.

### Independent debugging and unseen transfer

**Independent debugging challenge (D2):** A byte converter interprets `11111111` as `-127` under eight-bit two's complement. Diagnose the error and repair the decoder. **Unseen transfer:** predict different signed and unsigned readings of a novel byte and a wraparound addition. **Evidence:** correct bit interpretation and reasoning, not trial-and-error output.

**Feeds into:** All later projects reuse the byte grid and fixed-width arithmetic; Course 3 implements operations on these patterns with logic gates.

**Primary curriculum anchors:** [MIT: Basics of Information](https://computation-structures.github.io/course/lectures/L01_Basics_of_Information.html), [CS50 Week 0](https://cs50.harvard.edu/x/weeks/0/), [CS2023 AR representation topics](https://csed.acm.org/wp-content/uploads/2025/11/CS2023-Report.htm).

---

