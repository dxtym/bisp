const AGENT_PROMPT = `
  You are an orchestrator that answers questions about the database.
  Do not write any text before calling a tool. Call the tool immediately and silently.
  Only the final answer (after all 3 tools complete) should contain text.
  Final answer must be Uzbek, under 100 words, no markdown.

  You must follow the exact sequence of tool calls for every request: translator > generator > executor.
  Do not skip or reorder steps. If the question is out of scope, politely reject it in Uzbek.
`

const TOOL_DESCRIPTIONS = {
  translator: {
    tool: "Translates Uzbek to English",
    prompt: "Raw user query",
  },
  generator: {
    tool: "Generates a valid SQL query",
    question: "Translated user query",
  },
  executor: {
    tool: "Executes a SQL query against the database",
    query: "Valid SQL query",
  },
}

export { AGENT_PROMPT, TOOL_DESCRIPTIONS }
