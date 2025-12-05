---
name: use-frontend-developer-agent
enabled: true
event: prompt
conditions:
  - field: user_prompt
    operator: regex_match
    pattern: (create|build|make|design|implement).*(new|complete|full|frontend|ui|component|page|interface|layout|screen|view)
---

🎨 **Frontend Design Request Detected**

The user is asking for a new frontend design/implementation.

**Use the `frontend-developer` subagent** for this task!

Launch via Task tool:
```
{
  "subagent_type": "frontend-developer",
  "description": "Create frontend design",
  "prompt": "<user's request details>"
}
```

The frontend-developer agent has access to all tools and specializes in:
- Building React/Vue/Angular components
- Implementing responsive UI layouts
- Frontend state management
- Component tests
- Production-grade implementations
