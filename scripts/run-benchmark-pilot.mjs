import fs from "node:fs/promises";

const endpoint = "https://models.github.ai/inference/chat/completions";
const model = process.env.MODEL || "openai/gpt-4.1";
const token = process.env.GITHUB_TOKEN;

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
  }
];

const baselineSystem = `You are a practical coding agent. Answer the user request directly with an implementation or review plan. Be concise and useful.`;

const gooblinSystem = `You are a practical coding agent using Gooblin council mode. Diagnose the task type first, then route to the smallest useful teammate set. Prefer the smallest safe change. Cut unnecessary dependencies, rewrites, abstractions, guessing, and scope creep. Preserve the safety floor. Require concrete verification. Do not make every answer a four person roleplay.`;

const judgeSystem = `You are scoring paired coding-agent outputs for a Gooblin pilot evaluation. Use the rubric exactly. Return JSON only. Be strict. Favor evidence, scoped reasoning, and concrete verification over style.`;

async function complete(system, user, maxTokens = 1000) {
  const response = await fetch(endpoint, {
    method: "POST",
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
  const baselineOutput = await complete(baselineSystem, task.prompt, 1000);
  const gooblinOutput = await complete(gooblinSystem, task.prompt, 1000);

  const judgePrompt = `Rubric:\n${rubric}\n\nMetrics:\n${metrics.join(", ")}\n\nTask:\n${JSON.stringify(task, null, 2)}\n\nBaseline output:\n${baselineOutput}\n\nGooblin output:\n${gooblinOutput}\n\nReturn JSON only with this shape:\n{\n  "task_id": "...",\n  "project": "...",\n  "scores": { "metric_name": { "baseline": 0, "gooblin": 0, "notes": "..." } },\n  "totals": { "baseline": 0, "gooblin": 0 },\n  "winner": "baseline|gooblin|tie",\n  "limitations": ["..."]\n}`;

  const judgeOutput = await complete(judgeSystem, judgePrompt, 1400);
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
