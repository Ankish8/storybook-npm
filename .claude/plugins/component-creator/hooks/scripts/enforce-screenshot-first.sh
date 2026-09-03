#!/bin/bash

# This script enforces screenshot-first workflow for component creation
# It blocks AskUserQuestion calls that ask about component name/type
# before a screenshot has been provided

# The tool input is passed via stdin as JSON
INPUT=$(cat)

# Extract the question from the AskUserQuestion parameters
QUESTION=$(echo "$INPUT" | grep -o '"question"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/"question"[[:space:]]*:[[:space:]]*"//' | sed 's/"$//')

# Convert to lowercase for easier matching
QUESTION_LOWER=$(echo "$QUESTION" | tr '[:upper:]' '[:lower:]')

# Check if this is asking for a screenshot (ALLOW these)
if echo "$QUESTION_LOWER" | grep -qiE "screenshot|provide.*image|design.*image|image.*component|paste.*screenshot|drag.*screenshot"; then
    # This is asking for screenshot - ALLOW
    exit 0
fi

# Check if this is asking about component name or type (BLOCK these)
if echo "$QUESTION_LOWER" | grep -qiE "component.*name|name.*component|what.*component|which.*component|component.*type|type.*component|component.*create|create.*component|would you like to create|like to create|kebab-case"; then
    # This is asking about name/type before screenshot - BLOCK
    echo "BLOCKED: You must ask for a screenshot first before asking about component name or type. Please ask: 'Please provide a screenshot of the component you want to create.'"
    exit 1
fi

# Default: allow other questions
exit 0
