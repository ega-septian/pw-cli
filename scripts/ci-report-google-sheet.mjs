#!/usr/bin/env node
/**
 * CI helper: POST Pass/Fail to a Google Apps Script Web App (bound sheet updater).
 *
 * Env (required to run, else exits 0 = skip):
 *   PLAYWRIGHT_OUTCOME — "success" | "failure" (from GitHub Actions job output)
 *   SHEETS_WEBHOOK_URL — Web App URL ending in /exec
 *   WEBHOOK_SECRET     — must match the secret checked in Apps Script
 *
 * Optional:
 *   SHEET_TEST_CASE_ID — default TC-LP-001
 *   SHEET_NAME         — default Login
 *
 * Uses global fetch (Node 18+). Redirects after POST use GET on the echo hop per fetch spec.
 */

const outcome = process.env.PLAYWRIGHT_OUTCOME ?? "";
const url = (process.env.SHEETS_WEBHOOK_URL ?? "").trim();
const secret = (process.env.WEBHOOK_SECRET ?? "").trim();
const testCaseId = (process.env.SHEET_TEST_CASE_ID ?? "TC-LP-001").trim();
const sheetName = (process.env.SHEET_NAME ?? "Login").trim();

function skip(message) {
  console.log(message);
  process.exit(0);
}

function fail(message) {
  console.log(`::error::${message}`);
  process.exit(1);
}

if (outcome !== "success" && outcome !== "failure") {
  skip(
    `Skipping sheet update: Playwright outcome is '${outcome || "(unset)"}' (not success or failure).`,
  );
}

if (!url || !secret) {
  skip(
    "Skipping Google Sheet: set SHEETS_WEBHOOK_URL and WEBHOOK_SECRET in repo Actions secrets.",
  );
}

const result = outcome === "success" ? "Pass" : "Fail";
console.log(
  `Posting ${testCaseId} as ${result} to sheet ${sheetName} (Playwright outcome=${outcome}).`,
);

const payload = { secret, testCaseId, result, sheetName };

const res = await fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
  redirect: "follow",
});

const text = await res.text();
console.log(text);

let data;
try {
  data = JSON.parse(text);
} catch {
  if (
    /Sorry, unable to open the file|<title>Page Not Found<\/title>|docs-drivelogo/i.test(
      text,
    )
  ) {
    fail(
      "Got Google Drive HTML instead of JSON. Check SHEETS_WEBHOOK_URL is the Web App …/exec URL from Deploy → Manage deployments.",
    );
  }
  fail(
    "Webhook response is not JSON (wrong SHEETS_WEBHOOK_URL or unexpected HTML from Google).",
  );
}

if (data.ok !== true) {
  console.log(
    "::error::Google Sheet webhook returned ok!=true (e.g. test_case_not_found if the row is missing).",
  );
  console.log(JSON.stringify(data, null, 2));
  process.exit(1);
}
