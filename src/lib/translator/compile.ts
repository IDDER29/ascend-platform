/**
 * The tiny-language translator: a deliberately small language compiled to the tiny CPU, version 2
 * (src/lib/tiny-cpu/v2.ts), following the curriculum blueprint's translator contract (Appendix A.6):
 * unsigned 8-bit values that wrap, variables in 0x80..0xBF, `if`/`while` compiled to compares and
 * jumps, compile errors instead of silent truncation. It is not C.
 *
 *   var x = 3;            declare (with a starting value)
 *   x = x - 1;            assign; expressions use numbers, variables, + and -, left to right
 *   if (x == 0) { ... }   also != ; compares with a number 0..255; optional else { ... }
 *   while (x != 0) { ... }
 *   output(x);            send a value to the output
 */

export const DATA_START = 0x80;
export const DATA_END = 0xbf;
const MAX_INSTRUCTIONS = 64;

export type CompileError = { line: number; message: string };
export type CompileResult =
  | {
      ok: true;
      /** The assembly, one instruction or label per line. */
      asm: string[];
      /** Which source line each assembly line came from (0 for the final HALT). */
      origin: number[];
      /** Each variable's address. */
      vars: Record<string, number>;
      instructions: number;
    }
  | { ok: false; error: CompileError };

type Token = { kind: "num" | "name" | "sym"; text: string; line: number };

const KEYWORDS = new Set(["var", "if", "else", "while", "output"]);

function tokenize(src: string): Token[] {
  const tokens: Token[] = [];
  src.split("\n").forEach((rawLine, i) => {
    const line = rawLine.replace(/\/\/.*/, "");
    // < > * / are read so the parser can explain that this language doesn't have them.
    const re = /\s*(?:(\d+)|([A-Za-z_]\w*)|(==|!=|<=|>=|[=+\-;(){}<>*\/]))/y;
    let pos = 0;
    while (pos < line.length) {
      if (/^\s*$/.test(line.slice(pos))) break;
      re.lastIndex = pos;
      const m = re.exec(line);
      if (!m) throw { line: i + 1, message: `can't read "${line.slice(pos).trim()[0]}"` } as CompileError;
      pos = re.lastIndex;
      if (m[1] !== undefined) tokens.push({ kind: "num", text: m[1], line: i + 1 });
      else if (m[2] !== undefined) tokens.push({ kind: "name", text: m[2], line: i + 1 });
      else tokens.push({ kind: "sym", text: m[3], line: i + 1 });
    }
  });
  return tokens;
}

type Expr = { first: Term; rest: { op: "+" | "-"; term: Term }[] };
type Term = { kind: "num"; value: number } | { kind: "var"; name: string; line: number };
type Cond = { name: string; op: "==" | "!="; value: number; line: number };
type Stmt =
  | { kind: "var"; name: string; expr: Expr; line: number }
  | { kind: "set"; name: string; expr: Expr; line: number }
  | { kind: "output"; expr: Expr; line: number }
  | { kind: "if"; cond: Cond; then: Stmt[]; else: Stmt[] | null; line: number }
  | { kind: "while"; cond: Cond; body: Stmt[]; line: number };

function parse(tokens: Token[]): Stmt[] {
  let i = 0;
  const lastLine = () => tokens[tokens.length - 1]?.line ?? 1;
  const peek = () => tokens[i];
  const fail = (message: string, line = peek()?.line ?? lastLine()): never => {
    throw { line, message } as CompileError;
  };
  const expect = (text: string) => {
    const t = peek();
    if (!t || t.text !== text) fail(`expected "${text}"${t ? ` but found "${t.text}"` : " before the end"}`);
    i++;
  };
  const name = (): Token => {
    const t = peek();
    if (!t || t.kind !== "name" || KEYWORDS.has(t.text)) fail(`expected a variable name${t ? ` but found "${t.text}"` : ""}`);
    i++;
    return t!;
  };
  const number = (): number => {
    const t = peek();
    if (!t || t.kind !== "num") fail(`expected a number${t ? ` but found "${t.text}"` : ""}`);
    const v = Number(t!.text);
    if (v > 255) fail(`${v} doesn't fit in a byte (0 to 255)`, t!.line);
    i++;
    return v;
  };
  const term = (): Term => {
    const t = peek();
    if (t?.kind === "num") return { kind: "num", value: number() };
    const n = name();
    return { kind: "var", name: n.text, line: n.line };
  };
  const expr = (): Expr => {
    const first = term();
    const rest: Expr["rest"] = [];
    while (peek()?.text === "+" || peek()?.text === "-") {
      const op = peek()!.text as "+" | "-";
      i++;
      rest.push({ op, term: term() });
    }
    if (peek()?.text === "*" || peek()?.text === "/") fail("this language only has + and - (multiply with a loop)");
    return { first, rest };
  };
  const cond = (): Cond => {
    expect("(");
    const n = name();
    const t = peek();
    if (!t || (t.text !== "==" && t.text !== "!=")) fail('a condition compares with == or !=, like (x == 0)');
    i++;
    const value = number();
    expect(")");
    return { name: n.text, op: t!.text as "==" | "!=", value, line: n.line };
  };
  const block = (): Stmt[] => {
    expect("{");
    const body: Stmt[] = [];
    while (peek() && peek()!.text !== "}") body.push(statement());
    expect("}");
    return body;
  };
  const statement = (): Stmt => {
    const t = peek()!;
    if (t.text === "var") {
      i++;
      const n = name();
      expect("=");
      const e = expr();
      expect(";");
      return { kind: "var", name: n.text, expr: e, line: t.line };
    }
    if (t.text === "output") {
      i++;
      expect("(");
      const e = expr();
      expect(")");
      expect(";");
      return { kind: "output", expr: e, line: t.line };
    }
    if (t.text === "if") {
      i++;
      const c = cond();
      const then = block();
      let otherwise: Stmt[] | null = null;
      if (peek()?.text === "else") {
        i++;
        otherwise = block();
      }
      return { kind: "if", cond: c, then, else: otherwise, line: t.line };
    }
    if (t.text === "while") {
      i++;
      const c = cond();
      return { kind: "while", cond: c, body: block(), line: t.line };
    }
    if (t.kind === "name") {
      const n = name();
      expect("=");
      const e = expr();
      expect(";");
      return { kind: "set", name: n.text, expr: e, line: t.line };
    }
    return fail(`a statement can't start with "${t.text}"`);
  };
  const program: Stmt[] = [];
  while (i < tokens.length) program.push(statement());
  return program;
}

/** Compile tiny-language source to tiny CPU (version 2) assembly. */
export function compileTiny(source: string): CompileResult {
  try {
    const program = parse(tokenize(source));
    const vars: Record<string, number> = {};
    const asm: string[] = [];
    const origin: number[] = [];
    let labelCount = 0;
    const emit = (line: string, from: number) => {
      asm.push(line);
      origin.push(from);
    };
    const hex = (n: number) => `0x${n.toString(16).toUpperCase()}`;
    const addressOf = (name: string, line: number): number => {
      if (!(name in vars)) throw { line, message: `${name} is used before it's declared with var` } as CompileError;
      return vars[name];
    };
    const load = (reg: "R0" | "R1", t: Term, line: number) =>
      t.kind === "num" ? emit(`LDI ${reg}, ${t.value}`, line) : emit(`LDA ${reg}, [${hex(addressOf(t.name, t.line))}]`, line);
    const genExpr = (e: Expr, line: number) => {
      load("R0", e.first, line);
      for (const { op, term } of e.rest) {
        load("R1", term, line);
        emit(`${op === "+" ? "ADD" : "SUB"} R0, R1`, line);
      }
    };
    /** Jump to `target` when the condition is false. */
    const genTest = (c: Cond, target: string) => {
      emit(`LDA R0, [${hex(addressOf(c.name, c.line))}]`, c.line);
      emit(`CMPI R0, ${c.value}`, c.line);
      emit(`${c.op === "==" ? "JNZ" : "JZ"} ${target}`, c.line);
    };
    const gen = (stmts: Stmt[]) => {
      for (const s of stmts) {
        if (s.kind === "var") {
          if (s.name in vars) throw { line: s.line, message: `${s.name} is declared twice` } as CompileError;
          genExpr(s.expr, s.line);
          const addr = DATA_START + Object.keys(vars).length;
          if (addr > DATA_END) throw { line: s.line, message: "too many variables: there's room for 64" } as CompileError;
          vars[s.name] = addr;
          emit(`STA R0, [${hex(addr)}]`, s.line);
        } else if (s.kind === "set") {
          const addr = addressOf(s.name, s.line);
          genExpr(s.expr, s.line);
          emit(`STA R0, [${hex(addr)}]`, s.line);
        } else if (s.kind === "output") {
          genExpr(s.expr, s.line);
          emit("OUT R0", s.line);
        } else if (s.kind === "if") {
          const n = ++labelCount;
          genTest(s.cond, s.else ? `else${n}` : `endif${n}`);
          gen(s.then);
          if (s.else) {
            emit(`JMP endif${n}`, s.line);
            emit(`else${n}:`, s.line);
            gen(s.else);
          }
          emit(`endif${n}:`, s.line);
        } else {
          const n = ++labelCount;
          emit(`while${n}:`, s.line);
          genTest(s.cond, `endwhile${n}`);
          gen(s.body);
          emit(`JMP while${n}`, s.line);
          emit(`endwhile${n}:`, s.line);
        }
      }
    };
    gen(program);
    emit("HALT", 0);
    const instructions = asm.filter((l) => !l.endsWith(":")).length;
    if (instructions > MAX_INSTRUCTIONS) {
      return {
        ok: false,
        error: { line: 0, message: `the program needs ${instructions} instructions; the code area holds ${MAX_INSTRUCTIONS}` },
      };
    }
    // A label must sit on an instruction line for the assembler: fold a label into the next line.
    const folded: string[] = [];
    const foldedOrigin: number[] = [];
    let pending: string[] = [];
    asm.forEach((l, k) => {
      if (l.endsWith(":")) pending.push(l);
      else {
        // Several labels can name the same instruction; the assembler takes one per line, so the
        // extra ones become label-only lines just before it (they take no space).
        for (const extra of pending.slice(0, -1)) {
          folded.push(extra);
          foldedOrigin.push(origin[k]);
        }
        folded.push(pending.length ? `${pending[pending.length - 1]} ${l}` : l);
        foldedOrigin.push(origin[k]);
        pending = [];
      }
    });
    return { ok: true, asm: folded, origin: foldedOrigin, vars, instructions };
  } catch (e) {
    if (e && typeof e === "object" && "line" in e && "message" in e) return { ok: false, error: e as CompileError };
    throw e;
  }
}
