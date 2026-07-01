import fs from "node:fs/promises";

const endpoint = "https://models.github.ai/inference/chat/completions";
const model = process.env.MODEL || "openai/gpt-4o-mini";
const token = process.env.GITHUB_TOKEN;
const timeoutMs = Number(process.env.MODEL_TIMEOUT_MS || "60000");

if (!token) {
  throw new Error("GITHUB_TOKEN is required");
}

const metrics = [
  "task_solved",
  "unnecessary_code_avoided",
  "dependency_avoided",
  "abstraction_control",
  "scope_control",
  "debugging_discipline",
  "verification_quality",
  "safety_preserved"
];

const rubric = `Score each metric from 0 to 5.
0 means missing, harmful, or counterproductive.
3 means adequate and usable with some missed opportunities.
5 means excellent, specific, verified, and well scoped.
Safety rule: a solution that weakens auth, validation, secrets handling, data protection, rollback, accessibility, or user constraints should not receive a high score even if it is short.
Do not turn these pilot scores into public benchmark claims.`;

const tasks = [
  {
    id: "cltree-agent-cli-support",
    project: "jsleemaster/cltree",
    taskType: "architecture and scope control",
    prompt: `Review this requested change and propose the smallest safe implementation plan. Do not edit code. Include likely files, scope cuts, risks, and verification.

Repository context:
cltree is a terminal-based file explorer designed to work alongside Claude Code CLI. It uses a split-pane TUI, forwards keystrokes to the agent CLI, tracks CWD with OSC 7 plus vterm detection, respects gitignore, and is meant to have zero interference.

Open issue context:
Support agent CLI tools beyond Claude Code, such as Gemini CLI, Codex CLI, and others.
Key tasks listed in the issue:
- Extract PTY execution command into a config file at ~/.config/cltree/config.toml
- Implement config file system with TOML parsing, defaults, validation
- Add CWD detection logic for each CLI tool
- Support CLI presets such as claude, gemini, codex
Related files: src/terminal.rs, src/vterm.rs, src/app.rs`
  },
  {
    id: "cltree-homebrew-core-submission",
    project: "jsleemaster/cltree",
    taskType: "roadmap and release scope",
    prompt: `Review this roadmap issue and propose the next shippable move. Do not edit code. Separate what can be done now from what must wait for external criteria.

Repository context:
cltree is an npm and bun installable Rust terminal UI that works beside Claude Code CLI. Current installation is npm install -g cltree or bun install -g cltree.

Open issue context:
Submit cltree formula to Homebrew core so users can install with brew install cltree without a custom tap.
Current install path:
brew tap jsleemaster/tap
brew install cltree
Requirements:
- Meet Homebrew core notable software criteria
- Formula must pass brew audit --strict
References include Homebrew acceptable formulae and Homebrew pull request docs.`
  },
  {
    id: "layo-figma-image-fill-shipcheck",
    project: "jsleemaster/layo",
    taskType: "pre merge shipcheck",
    prompt: `Run a final pre-merge review on this PR summary. Do not approve blindly. Identify what is safe, what is still risky, what should be verified, and what can be deferred.

Repository context:
Layo is a local-first AI-operable design platform with a Rust document engine, TypeScript editor shell, server, asset storage, MCP and HTTP tools, collaboration relay, and deterministic document edit workflows. Agents are expected to inspect, dry-run, apply, validate, summarize, and verify visual behavior.

PR context:
Import Figma image fill assets.
Summary:
- Add Figma ZIP package review and import support for REST JSON plus exported image assets.
- Map packaged Figma IMAGE fills to Layo image nodes and persist referenced bytes through local asset storage.
- Update web API and e2e coverage plus migration maturity docs and plan status.
Verification reported:
- pnpm test
- pnpm test:e2e with 145 passed
- git diff --check
Notes:
- Missing packaged Figma image assets remain warnings and fall back to geometry mapping.
- Worktree preserved for PR feedback.`
  },
  {
    id: "ranch-agent-rail-control-shipcheck",
    project: "jsleemaster/ranch-agent",
    taskType: "large PR shipcheck and scope control",
    prompt: `Run a pre-merge review on this large PR summary. Do not edit code. Identify whether the PR should stay bundled, what risks need verification, what can be deferred, and what checks should block merge.

Repository context:
Ranch-Agent is a VS Code extension for visualizing multi-agent runtime activity from Claude JSONL logs. It has extension host code, React webview UI, shared runtime types, JSONL discovery, skill normalization, main-branch risk highlighting, optional debug logging, and operator setup docs.

PR context:
Rebrand ranch-agent into premium rail control room.
Runtime changes:
- Multi-source runtime ingestion for JSONL plus HTTP hooks.
- JSONL remains primary source of truth with short-window dedupe.
- Runtime signals split into analytics labels.
Session and statusline changes:
- Separate stable lineage identity from actual Claude session identity.
- Add session archive with rollover, finished, stale cleanup reasons.
- Add Claude statusLine.command stdin bridge for context usage, trip throughput, and operating cost.
- Add fan-out wrapper so Ranch-Agent and claude-hud can run together.
Webview and docs changes:
- Rebrand UI to premium rail control room with Korean rail labels.
- Replace minimap with 5-stop route diagram.
- Rewrite README, HTTP hooks docs, statusline bridge docs, AGENTS guidance, and ignores.
Verification listed:
- npm run build
- npm --prefix extension run test
- npm --prefix extension run typecheck
- npm --prefix webview-ui run typecheck
Manual checks include VS Code panel review, JSONL-only mode, statusline metrics, session archive, and claude-hud fan-out.`
  }
];

const baselineSystem = `You are a practical coding agent. Answer the user request directly with an implementation or review plan. Be concise and useful.`;

const gooblinSystem = `You are a practical coding agent using Gooblin council mode. Diagnose the task type first, then route to the smallest useful teammate set. Prefer the smallest safe change. Cut unnecessary dependencies, rewrites, abstractions, guessing, and scope creep. Preserve the safety floor. Require concrete verification. Do not make every answer a four person roleplay.`;

const judgeSystem = `You are scoring paired coding-agent outputs for a Gooblin pilot evaluation. Use the rubric exactly. Return JSON only. Be strict. Favor evidence, scoped reasoning, and concrete verification over style.`;

async function complete(label, system, user, maxTokens = 1000) {
  console.log(`Calling model for ${label}`);
  const startedAt = Date.now();
  const response = await fetch(endpoint, {
    method: "POST",
    signal: AbortSignal.timeout(timeoutMs),
    headers: {
      "Accept": "application/vnd.github+json",
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28"
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      max_tokens: maxTokens,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user }
      ]
    })
  });

  const text = await response.text();
  console.log(`Model call completed for ${label} in ${Date.now() - startedAt}ms with status ${response.status}`);
  if (!response.ok) {
    throw new Error(`Model request failed ${response.status}: ${text}`);
  }

  const data = JSON.parse(text);
  return data.choices?.[0]?.message?.content ?? "";
}

function extractJson(text) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) {
    return { parse_error: true, raw: text };
  }
  try {
    return JSON.parse(match[0]);
  } catch (error) {
    return { parse_error: true, error: String(error), raw: text };
  }
}

function totalFromScores(scores, side) {
  if (!scores || typeof scores !== "object") return null;
  return metrics.reduce((sum, metric) => {
    const value = Number(scores[metric]?.[side]);
    return Number.isFinite(value) ? sum + value : sum;
  }, 0);
}

await fs.mkdir("benchmark-output/raw", { recursive: true });

const results = [];

for (const task of tasks) {
  console.log(`Running ${task.id} with ${model}`);
  const baselineOutput = await complete(`${task.id} baseline`, baselineSystem, task.prompt, 1000);
  const gooblinOutput = await complete(`${task.id} gooblin`, gooblinSystem, task.prompt, 1000);

  const judgePrompt = `Rubric:\n${rubric}\n\nMetrics:\n${metrics.join(", ")}\n\nTask:\n${JSON.stringify(task, null, 2)}\n\nBaseline output:\n${baselineOutput}\n\nGooblin output:\n${gooblinOutput}\n\nReturn JSON only with this shape:\n{\n  "task_id": "...",\n  "project": "...",\n  "scores": { "metric_name": { "baseline": 0, "gooblin": 0, "notes": "..." } },\n  "totals": { "baseline": 0, "gooblin": 0 },\n  "winner": "baseline|gooblin|tie",\n  "limitations": ["..."]\n}`;

  const judgeOutput = await complete(`${task.id} judge`, judgeSystem, judgePrompt, 1400);
  const parsed = extractJson(judgeOutput);
  if (!parsed.totals && parsed.scores) {
    parsed.totals = {
      baseline: totalFromScores(parsed.scores, "baseline"),
      gooblin: totalFromScores(parsed.scores, "gooblin")
    };
  }

  results.push({ task, baselineOutput, gooblinOutput, judgeOutput, parsed });

  await fs.writeFile(`benchmark-output/raw/${task.id}-baseline.md`, baselineOutput);
  await fs.writeFile(`benchmark-output/raw/${task.id}-gooblin.md`, gooblinOutput);
  await fs.writeFile(`benchmark-output/raw/${task.id}-judge.json`, JSON.stringify(parsed, null, 2));
}

const summary = [];
summary.push("# Gooblin Benchmark Pilot");
summary.push("");
summary.push("Pilot measurement only. Not a public benchmark claim.");
summary.push("");
summary.push(`Date: ${new Date().toISOString()}`);
summary.push(`Model: ${model}`);
summary.push("Method: same model, same task prompt, baseline system prompt vs Gooblin system prompt, model-judged with Gooblin rubric.");
summary.push("Limitations: small sample, prompt-only treatment, model judge, no code execution, no human review yet.");
summary.push("");
summary.push("| Task | Project | Baseline | Gooblin | Delta | Winner |");
summary.push("| --- | --- | ---: | ---: | ---: | --- |");

for (const result of results) {
  const baseline = result.parsed?.totals?.baseline;
  const gooblin = result.parsed?.totals?.gooblin;
  const delta = Number.isFinite(baseline) && Number.isFinite(gooblin) ? gooblin - baseline : "n/a";
  summary.push(`| ${result.task.id} | ${result.task.project} | ${baseline ?? "n/a"} | ${gooblin ?? "n/a"} | ${delta} | ${result.parsed?.winner ?? "n/a"} |`);
}

summary.push("");
summary.push("## Metric Notes");
summary.push("");
for (const result of results) {
  summary.push(`### ${result.task.id}`);
  const scores = result.parsed?.scores ?? {};
  for (const metric of metrics) {
    const item = scores[metric];
    if (!item) continue;
    summary.push(`- ${metric}: baseline ${item.baseline}, gooblin ${item.gooblin}. ${item.notes}`);
  }
  if (Array.isArray(result.parsed?.limitations)) {
    summary.push(`- Limitations: ${result.parsed.limitations.join("; ")}`);
  }
  summary.push("");
}

await fs.writeFile("benchmark-output/summary.md", summary.join("\n"));
await fs.writeFile("benchmark-output/results.json", JSON.stringify({ model, generatedAt: new Date().toISOString(), results }, null, 2));

console.log(summary.join("\n"));
