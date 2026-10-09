import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import crypto from "node:crypto";
import { JSDOM } from "jsdom";
const html = fs.readFileSync("apps/docs/public/v2-review.html", "utf8");
function page() {
  return new JSDOM(html, {
    url: "http://localhost:6009/v2-review.html",
    runScripts: "dangerously",
  });
}
const event = (window, frame, data, origin = window.location.origin) =>
  window.dispatchEvent(
    new window.MessageEvent("message", {
      origin,
      source: frame.contentWindow,
      data: { channel: "myoperator-v2-docs", component: "input", ...data },
    })
  );
test("all frozen source files match their captured hashes and no installable components were added", () => {
  const baseline = JSON.parse(
    fs.readFileSync("design/arc-review/baseline.json", "utf8")
  );
  for (const [name, hash] of Object.entries(baseline.files)) {
    const actual = crypto
      .createHash("sha256")
      .update(fs.readFileSync("design/arc-review/before/" + name))
      .digest("hex");
    assert.equal(actual, hash, name);
  }
  const current = fs
    .readdirSync("src/components/ui/v2")
    .filter((f) => f.endsWith(".stories.tsx"))
    .map((f) => f.replace(".stories.tsx", ""))
    .sort();
  assert.deepEqual(current, baseline.components);
});
test("one page contains only the updated before/after pairs and category/search filters work", () => {
  const dom = page(),
    d = dom.window.document;
  assert.equal(d.querySelectorAll(".review-card").length, 40);
  assert.equal(d.querySelectorAll("iframe").length, 80);
  d.querySelector("#search").value = "typography";
  d.querySelector("#search").dispatchEvent(new dom.window.Event("input"));
  assert.equal(d.querySelectorAll(".review-card:not([hidden])").length, 1);
  assert.equal(d.querySelector(".review-card:not([hidden])").id, "typography");
  d.querySelector("#search").value = "";
  d.querySelector("#search").dispatchEvent(new dom.window.Event("input"));
  [...d.querySelectorAll(".pill")]
    .find((p) => p.textContent === "Forms")
    .click();
  assert.equal(d.querySelectorAll(".review-card:not([hidden])").length, 17);
  dom.window.close();
});
test("shared controls synchronize both frames, preserve typing and accept current state feedback", () => {
  const dom = page(),
    w = dom.window,
    d = w.document,
    card = d.querySelector("#input"),
    frames = [...card.querySelectorAll("iframe")],
    sent = [];
  frames.forEach(
    (frame) =>
      (frame.contentWindow.postMessage = (message) => sent.push(message))
  );
  const metadata = {
    type: "metadata",
    args: { disabled: false, children: "Button" },
    argTypes: {
      disabled: { control: "boolean" },
      children: { control: "text" },
    },
  };
  frames.forEach((frame) => event(w, frame, metadata));
  [...card.querySelectorAll("button")]
    .find((b) => b.textContent === "Shared controls")
    .click();
  const toggle = card.querySelector(".controls input[type=checkbox]");
  toggle.checked = true;
  toggle.dispatchEvent(new w.Event("change"));
  assert.equal(
    sent.filter((m) => m.type === "update-args" && m.args.disabled === true)
      .length,
    2
  );
  const text = card.querySelector(".controls input[type=text]");
  text.focus();
  text.value = "New label";
  text.dispatchEvent(new w.Event("input"));
  event(w, frames[1], {
    type: "args-updated",
    args: { children: "New label", disabled: false },
    argTypes: metadata.argTypes,
  });
  assert.equal(d.activeElement, text);
  assert.equal(text.value, "New label");
  assert.equal(toggle.checked, false);
  dom.window.close();
});
test("the page ignores foreign messages and aligns both preview heights", () => {
  const dom = page(),
    w = dom.window,
    card = w.document.querySelector("#input"),
    frames = [...card.querySelectorAll("iframe")];
  event(
    w,
    frames[0],
    { type: "resize", height: 650 },
    "https://foreign.example"
  );
  assert.equal(frames[0].style.height, "320px");
  event(w, frames[0], { type: "resize", height: 650 });
  assert.equal(frames[0].style.height, "650px");
  assert.equal(frames[1].style.height, "650px");
  event(w, frames[1], { type: "resize", height: 3000 });
  assert.equal(frames[0].style.height, "860px");
  event(w, frames[0], { type: "error", message: "Example failed" });
  assert.equal(
    frames[0].parentElement.querySelector(".preview-error").textContent,
    "Example failed"
  );
  dom.window.close();
});
