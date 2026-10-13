// Render support only. Interaction tests stay in Storybook/Vitest; never fake a pass here.
// `never[]` accepts specifically typed implementations. Dynamic invocation stays
// at the mock boundary, while recorded arguments retain the caller's tuple type.
type Callback = (...args: never[]) => unknown;
type DefaultCallback = (...args: unknown[]) => unknown;
type RenderMock<T extends Callback> = T & {
  mock: {
    calls: Parameters<T>[];
    instances: unknown[];
    results: { type: "return"; value: unknown }[];
  };
  mockName: (value: string) => RenderMock<T>;
  getMockName: () => string;
  mockClear: () => RenderMock<T>;
  mockReset: () => RenderMock<T>;
  mockImplementation: {
    (value: T): RenderMock<T>;
    (value: Callback): RenderMock<T>;
  };
  mockImplementationOnce: {
    (value: T): RenderMock<T>;
    (value: Callback): RenderMock<T>;
  };
  mockReturnValue: (value: unknown) => RenderMock<T>;
  mockReturnValueOnce: (value: unknown) => RenderMock<T>;
  mockResolvedValue: (value: unknown) => RenderMock<T>;
  mockResolvedValueOnce: (value: unknown) => RenderMock<T>;
};
const mocks = new Set<{ mockClear: () => unknown }>();
let actionSink: ((name: string, args: unknown[]) => void) | undefined;
export function setActionSink(sink?: typeof actionSink) {
  actionSink = sink;
}
export function fn<T extends Callback = DefaultCallback>(implementation?: T) {
  let impl: Callback | undefined = implementation;
  let name = "callback";
  const once: Callback[] = [];
  const mock = function (this: unknown, ...args: unknown[]) {
    mock.mock.calls.push(args as Parameters<T>);
    mock.mock.instances.push(this);
    actionSink?.(name, args);
    const callback = once.shift() || impl;
    const result: unknown = callback
      ? Reflect.apply(callback, this, args)
      : undefined;
    mock.mock.results.push({ type: "return", value: result });
    return result;
  } as unknown as RenderMock<T>;
  mock.mock = { calls: [], instances: [], results: [] };
  mock.mockName = (value) => {
    name = value;
    return mock;
  };
  mock.getMockName = () => name;
  mock.mockClear = () => {
    mock.mock.calls = [];
    mock.mock.instances = [];
    mock.mock.results = [];
    return mock;
  };
  mock.mockReset = () => {
    mock.mockClear();
    impl = undefined;
    once.length = 0;
    return mock;
  };
  mock.mockImplementation = (value) => {
    impl = value;
    return mock;
  };
  mock.mockImplementationOnce = (value) => {
    once.push(value);
    return mock;
  };
  mock.mockReturnValue = (value) => mock.mockImplementation(() => value);
  mock.mockReturnValueOnce = (value) =>
    mock.mockImplementationOnce(() => value);
  mock.mockResolvedValue = (value) =>
    mock.mockImplementation(() => Promise.resolve(value));
  mock.mockResolvedValueOnce = (value) =>
    mock.mockImplementationOnce(() => Promise.resolve(value));
  mocks.add(mock);
  return mock;
}
export function clearAllMocks() {
  mocks.forEach((mock) => mock.mockClear());
}
function runnerOnly(): never {
  throw new Error(
    "Interaction tests run in Storybook/Vitest, not the Fumadocs preview."
  );
}
export const expect = runnerOnly;
export const within = runnerOnly;
export const waitFor = runnerOnly;
export const userEvent = new Proxy({}, { get: () => runnerOnly });
export const fireEvent = new Proxy({}, { get: () => runnerOnly });
