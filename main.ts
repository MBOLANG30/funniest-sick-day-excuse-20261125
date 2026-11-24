// funniest-sick-day-excuse-20261125
// make.fun entry: "The Funniest Sick-Day Excuse".
//
// A deterministic Node program with no network, no randomness and no
// dependencies. It writes exactly one line — a sick-day excuse under 200
// characters — to entry.txt inside MAKEFUN_OUTPUT_DIR (default "output").
//
// The line is validated before it is written: it must be 1-200 characters,
// a single line, with no trailing whitespace and no control characters, so
// the sealed gate (UTF-8 text of 1 to 200 characters, not only whitespace)
// always passes.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The excuse, composed for this entry: a sneeze mid-stretch puts the
// narrator's back out, and the back "files for divorce" — the twist lands
// on "couples therapy with a heating pad", just before the last word.
const EXCUSE =
  "I sneezed mid-stretch this morning and my back filed for divorce, so I'm spending the day in couples therapy with a heating pad.";

function validateLine(line: string): void {
  if (line.length < 1 || line.length > 200) {
    throw new Error(`excuse must be 1-200 characters, got ${line.length}`);
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("excuse must be a single line");
  }
  if (line !== line.trim()) {
    throw new Error("excuse must not start or end with whitespace");
  }
  for (const ch of line) {
    // Reject every control character, tabs included: a stray tab would
    // survive the gate but reads as a formatting glitch to the judge.
    if (ch.charCodeAt(0) < 0x20 || ch.charCodeAt(0) === 0x7f) {
      throw new Error("excuse must not contain control characters");
    }
  }
  if (line.trim().length === 0) {
    throw new Error("excuse must not be only whitespace");
  }
}

function main(): void {
  validateLine(EXCUSE);
  const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "output";
  // Only create the directory; never remove it or its contents wholesale —
  // the grader mounts this folder, so deleting it would fail.
  mkdirSync(outputDir, { recursive: true });
  const target = join(outputDir, "entry.txt");
  writeFileSync(target, `${EXCUSE}\n`, "utf8");
  // Read the file back and confirm it holds exactly the validated line:
  // a silent partial write must fail loudly instead of shipping a bad file.
  const written = readFileSync(target, "utf8");
  if (written !== `${EXCUSE}\n`) {
    throw new Error("entry.txt does not hold exactly the validated excuse");
  }
}

main();
