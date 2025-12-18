const forbidden = [
  "ignore previous",
  "sudo",
  "rm -rf",
  "hack",
  "delete",
  "violent",
  "weapon",
  "bypass",
  "jailbreak",
  "system prompt",
  "prompt injection",
  "sex",
  "nsfw",
];

export function guardPrompt(text: string) {
  const lowered = text.toLowerCase();
  const tooLong = text.length > 240;
  const hasForbidden = forbidden.some((f) => lowered.includes(f));
  const looksLikeCode = lowered.includes(";") && lowered.includes("{");
  return !text.trim() || tooLong || hasForbidden || looksLikeCode;
}

export function ruleBasedPlan(task: string) {
  const lowered = task.toLowerCase();
  if (lowered.match(/study|learn|revise|read/)) {
    return {
      starter: "Open notes, name a section, and list 3 headings.",
      steps: [
        "Write 3 bullets of what you already know.",
        "Skim one page/slide and capture 3 key terms.",
        "Answer one easy check: define 1 concept.",
      ],
    };
  }
  if (lowered.match(/code|bug|fix|build|commit/)) {
    return {
      starter: "Open the repo, run it once, and note the failing area.",
      steps: [
        "Write a 3-bullet plan in TODO form.",
        "Add one log or test to see the current behavior.",
        "Make one small change and verify locally.",
      ],
    };
  }
  if (lowered.match(/assignment|report|essay|write/)) {
    return {
      starter: "Create the doc, add a title, and drop 3 outline bullets.",
      steps: [
        "Draft a rough intro sentence.",
        "Fill one outline bullet with 2 sentences.",
        "Add a source or citation placeholder.",
      ],
    };
  }
  if (lowered.match(/email|reach out|follow up/)) {
    return {
      starter: "Open your email and draft a 3-line skeleton: greet, ask, close.",
      steps: [
        "Fill in one specific ask or update.",
        "Attach or link the needed file/resource.",
        "Add a clear next step and send/save draft.",
      ],
    };
  }
  return {
    starter: "Write the tiniest next move you can finish in 2 minutes.",
    steps: [
      "Write 3 bullets for what success looks like.",
      "Do one tiny action that takes <5 min.",
      "Leave a note for future you on what's next.",
    ],
  };
}
