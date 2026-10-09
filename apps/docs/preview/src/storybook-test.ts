// Render support only. Interaction tests stay in Storybook/Vitest; never fake a pass here.
type Callback = (...args: any[]) => any;
const mocks = new Set<any>();
let actionSink: ((name: string, args: unknown[]) => void) | undefined;
export function setActionSink(sink?: typeof actionSink) {
  actionSink = sink;
}
export function fn<T extends Callback = Callback>(implementation?: T) {
  let impl: Callback | undefined = implementation;
  let name = "callback";
  const once: Callback[] = [];
  const mock = function (this: unknown, ...args: any[]) {
    mock.mock.calls.push(args);
    mock.mock.instances.push(this);
    actionSink?.(name, args);
    const result = (once.shift() || impl)?.apply(this, args);
    mock.mock.results.push({ type: "return", value: result });
    return result;
  } as T & {
    mock: { calls: any[][]; instances: unknown[]; results: unknown[] };
    mockName: (value: string) => typeof mock;
    getMockName: () => string;
    mockClear: () => typeof mock;
    mockReset: () => typeof mock;
    mockImplementation: (value: Callback) => typeof mock;
    mockImplementationOnce: (value: Callback) => typeof mock;
    mockReturnValue: (value: any) => typeof mock;
    mockReturnValueOnce: (value: any) => typeof mock;
    mockResolvedValue: (value: any) => typeof mock;
    mockResolvedValueOnce: (value: any) => typeof mock;
  };
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
