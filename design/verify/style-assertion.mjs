import ts from "typescript";

const normalize = (name) =>
  name.replace(/ > /g, " ").replace(/\s+/g, " ").trim();
const callbackBody = (call) => {
  const callback = call.arguments[1];
  return callback &&
    (ts.isArrowFunction(callback) || ts.isFunctionExpression(callback)) &&
    ts.isBlock(callback.body)
    ? callback.body
    : undefined;
};

/**
 * A missing semantic utility is a style failure even when the assertion uses
 * querySelector(...).toBeInTheDocument() instead of toHaveClass(). Inspect the
 * unchanged test AST: accept only render -> one class query -> one presence
 * assertion. Extra assertions, interactions, ids, roles, text, and structural
 * selectors remain behaviour checks, independent of the test's title.
 */
function isSemanticClassPresenceTest(source, fullName) {
  const file = ts.createSourceFile(
    "v1.test.tsx",
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  );
  const matches = [];
  const visit = (node, suite = []) => {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.arguments[0] &&
      ts.isStringLiteral(node.arguments[0])
    ) {
      const title = node.arguments[0].text;
      const body = callbackBody(node);
      if (body && node.expression.text === "describe") {
        visit(body, [...suite, title]);
        return;
      }
      if (
        body &&
        ["it", "test"].includes(node.expression.text) &&
        normalize([...suite, title].join(" ")) === normalize(fullName)
      ) {
        matches.push(body);
        return;
      }
    }
    ts.forEachChild(node, (child) => visit(child, suite));
  };
  visit(file);
  if (matches.length !== 1) return false;
  const statements = matches[0].statements;
  if (statements.length !== 3) return false;

  const declaration = (statement) =>
    ts.isVariableStatement(statement) &&
    (statement.declarationList.flags & ts.NodeFlags.Const) !== 0 &&
    statement.declarationList.declarations.length === 1
      ? statement.declarationList.declarations[0]
      : undefined;
  const render = declaration(statements[0]);
  if (
    !render ||
    !ts.isObjectBindingPattern(render.name) ||
    render.name.elements.length !== 1
  )
    return false;
  const container = render.name.elements[0];
  if (
    !ts.isIdentifier(container.name) ||
    container.propertyName ||
    container.dotDotDotToken ||
    container.name.text !== "container"
  )
    return false;
  if (
    !render.initializer ||
    !ts.isCallExpression(render.initializer) ||
    !ts.isIdentifier(render.initializer.expression) ||
    render.initializer.expression.text !== "render"
  )
    return false;

  const query = declaration(statements[1]);
  if (
    !query ||
    !ts.isIdentifier(query.name) ||
    !query.initializer ||
    !ts.isCallExpression(query.initializer)
  )
    return false;
  const call = query.initializer;
  if (
    !ts.isPropertyAccessExpression(call.expression) ||
    !ts.isIdentifier(call.expression.expression) ||
    call.expression.expression.text !== container.name.text ||
    call.expression.name.text !== "querySelector" ||
    call.arguments.length !== 1 ||
    !ts.isStringLiteral(call.arguments[0])
  )
    return false;
  if (
    !/^\.(?:bg|text|border(?:-[tblrxysie])?|outline|ring(?:-offset)?|fill|stroke|caret|divide|accent|decoration|from|via|to|shadow)-(?:v2-)?semantic-[\w-]+$/.test(
      call.arguments[0].text
    )
  )
    return false;

  const statement = statements[2];
  if (
    !ts.isExpressionStatement(statement) ||
    !ts.isCallExpression(statement.expression)
  )
    return false;
  const assertion = statement.expression;
  if (
    assertion.arguments.length !== 0 ||
    !ts.isPropertyAccessExpression(assertion.expression) ||
    assertion.expression.name.text !== "toBeInTheDocument"
  )
    return false;
  const expectation = assertion.expression.expression;
  return (
    ts.isCallExpression(expectation) &&
    ts.isIdentifier(expectation.expression) &&
    expectation.expression.text === "expect" &&
    expectation.arguments.length === 1 &&
    ts.isIdentifier(expectation.arguments[0]) &&
    expectation.arguments[0].text === query.name.text
  );
}

/** Class-string CVA assertions are visual checks, just like toHaveClass(). */
export function isStyleAssertion(name, message, context) {
  if (
    /toHaveClass|toHaveStyle|Expected the element (not )?to have class|to match \/tw-|\.not\.toHaveClass/.test(
      message
    )
  )
    return true;
  if (
    context?.source &&
    context.fullName &&
    /expect\((?:received|element)\)\.toBeInTheDocument\(\)/.test(message) &&
    isSemanticClassPresenceTest(context.source, context.fullName)
  )
    return true;
  return (
    /Variants returns correct classes\b/.test(name) &&
    /to contain ['"](?:bg|border|text)-semantic-[\w-]+['"]/.test(message)
  );
}
