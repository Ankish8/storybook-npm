import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
const root = process.cwd();
const baseline = JSON.parse(
  fs.readFileSync("design/arc-review/baseline.json", "utf8")
);
const audits = ["buttons", "forms", "navigation", "display"].flatMap((name) => {
  const file = `design/arc-review/${name}.json`;
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : [];
});
const bySlug = new Map(audits.map((entry) => [entry.slug, entry]));
const hash = (text) => crypto.createHash("sha256").update(text).digest("hex");
const formSlugs = new Set(
  "checkbox creatable-multi-select creatable-select date-range-picker date-time-picker file-upload input multi-select number-step-field otp-input phone-input readable-field search-filter select select-field switch text-field textarea".split(
    " "
  )
);
const navSlugs = new Set(
  "accordion breadcrumbs modal dropdown-menu pagination panel scrollbar stepper tabs toast tooltip page-header page-footer".split(
    " "
  )
);
const buttonSlugs = new Set([
  "button",
  "action-button",
  "split-button",
  "button-group",
]);
const focusComponents = new Set(
  "creatable-multi-select creatable-select date-range-picker date-time-picker input multi-select number-step-field otp-input phone-input readable-field search-filter select select-field text-field textarea".split(
    " "
  )
);
const examples = {
  "image-media": "Compact",
  typography: "Label",
  "reply-quote": "Interactive",
  "ui-card": "Action",
  table: "SortableHeaders",
  skeleton: "Usage",
  pagination: "FirstPageActive",
  panel: "Interactive",
  breadcrumbs: "Usage",
};
const replays = {
  "dropdown-menu": [{ open: false }, { open: true }],
  "text-field": [
    { helperText: "Use a short name", error: false },
    { helperText: "A name is required", error: true },
  ],
  textarea: [
    { helperText: "Write a short description", error: false },
    { helperText: "Add a little more detail", error: true },
  ],
  "phone-input": [
    { helperText: "Include the country code", error: false },
    { helperText: "Enter a valid phone number", error: true },
  ],
  checkbox: [{ checked: false }, { checked: true }],
  badge: [{ children: "Pending" }, { children: "Delivered" }],
  avatar: [{ status: "offline" }, { status: "online" }],
  "progress-indicator": [{ value: 5 }, { value: 85 }],
  stepper: [{ currentStep: 0 }, { currentStep: 2 }],
  alert: [{ open: true }, { open: false }],
  panel: [{ open: true }, { open: false }],
};
const explanations = {
  "dropdown-menu": [
    "48px rows / 16px text",
    "36px rows / 14px text",
    "Press Replay change to open both menus and compare their density.",
  ],
  "image-media": [
    "Cropped to the height cap",
    "Full attachment remains visible",
    "This compact example exposes how the height cap fits the image.",
  ],
  typography: [
    "Semibold labels · 600",
    "Medium labels · 500",
    "The label example shows the reduced weight directly.",
  ],
  checkbox: [
    "Mark scales into place",
    "Check draws inside a stable shell",
    "Press Replay change to compare selection feedback.",
  ],
  badge: [
    "Label changes immediately",
    "Label crossfades",
    "Press Replay change to compare Pending → Delivered.",
  ],
  avatar: [
    "Presence switches immediately",
    "Presence dot springs in",
    "Press Replay change to compare offline → online.",
  ],
  "progress-indicator": [
    "Count jumps ahead of the fill",
    "Count and fill travel together",
    "Press Replay change and watch the number during the transition.",
  ],
  alert: [
    "Dismissal removes the alert immediately",
    "Dismissal fades and collapses",
    "Press Replay change to compare dismissal.",
  ],
  skeleton: [
    "Placeholders pulse together",
    "Placeholders can stagger",
    "The same stagger delay is applied to both examples; only the updated component supports it.",
  ],
  table: [
    "Rows jump after sorting",
    "Keyed rows spring into position",
    "Click the same sortable column in each preview to compare row movement.",
  ],
  pagination: [
    "Disabled links can still activate",
    "Disabled links are blocked",
    "Use Tab and Enter on the first-page example to check Previous.",
  ],
  scrollbar: [
    "Thumb jumps to its centre",
    "Thumb keeps the grabbed point",
    "Grab each thumb near its edge and drag.",
  ],
  "ui-card": [
    "No pressed feedback",
    "Subtle content press feedback",
    "Press and hold the card in each preview.",
  ],
  accordion: [
    "No row-arrow navigation",
    "Arrow and Home/End navigation",
    "Focus a row; use Up/Down, Home and End. Open a row to compare its reveal.",
  ],
  panel: [
    "Closed controls remain focusable",
    "Closed controls become inert",
    "Close the panel and use Tab; the updated version restores focus to its opener.",
  ],
  "modal": [
    "Uncontrolled cancellation can stay open",
    "Cancellation closes the modal",
    "The change is behavioral. Try dismissal; controlled examples may look identical at rest.",
  ],
  "button": ["Ghost is 2px narrower than Secondary", "Ghost matches Secondary width; tracking -0.16px", "Compare the Ghost and Secondary buttons side by side in All variants."],
  "action-button": ["Tighter padding; opacity change on hover", "Arc spacing; spring width morph", "Click the button and watch the width and label change."],
  "split-button": ["Two joined buttons, short divider", "One bordered pill, full-height divider", "Open the menu and press the main action."],
  "button-group": ["Wider segments, short dividers", "Arc padding, hairline dividers, springy width", "Press each segment and change its label."],
  "tooltip": ["Compact tooltip, 700ms delay", "Roomier tooltip, 250ms delay, rise-in", "Hover the trigger in each preview."],
  "tabs": ["32px tabs, no track border", "36px tabs, bordered track, sliding panel", "Switch tabs in the pill variant and watch the cursor and panel."],
  "switch": ["Scaling track", "Gliding thumb that stretches while pressed", "Press and hold the switch, then release."],
  "tag": ["Hover grows the tag", "Hover is still; press dips", "Hover and press a tag, then dismiss it."],
  "otp-input": ["Teal focus border / outer glow", "Primary border / no outer glow", "Focus a slot in each preview."],
  "spinner": ["Faint track with round-capped arc", "Single 270-degree ring", "Compare the spinner sizes."],
  "bouncing-loader": ["Larger, slower dots", "Small, quick typing dots", "Watch the dots cycle."],
  "page-header": ["73px bar, 16px title", "92px bar, 18px title", "Compare the header height and the back button."],
  "page-footer": ["Tighter footer", "Arc footer padding and text", "Compare the footer height beside the buttons."],
  "date-divider": ["Light label, wide gap", "Medium label, 12px gap", "Compare the divider label and spacing."],
  "system-message": ["13px message", "12px message", "Compare the message text size."],
  "unread-separator": ["Previous label sizing", "12px/500 label, 12px gap", "Compare the label and line gap."],
};
const entries = baseline.components.map((slug) => {
  const audit = bySlug.get(slug);
  const source = fs.readFileSync(`src/components/ui/v2/${slug}.tsx`);
  const changed = hash(source) !== baseline.files[`${slug}.tsx`];
  const before = fs.readFileSync(
    `design/arc-review/before/${slug}.stories.tsx`,
    "utf8"
  );
  const after = fs.readFileSync(
    `src/components/ui/v2/${slug}.stories.tsx`,
    "utf8"
  );
  const ids = (text) =>
    [...text.matchAll(/export const (\w+)/g)].map((match) => match[1]);
  const afterIds = new Set(ids(after));
  const commonStories = ids(before).filter((id) => afterIds.has(id));
  return {
    slug,
    title: slug
      .split("-")
      .map((word) =>
        word === "ui"
          ? "UI"
          : word === "otp"
            ? "OTP"
            : word[0].toUpperCase() + word.slice(1)
      )
      .join(" "),
    family: buttonSlugs.has(slug)
      ? "Actions"
      : formSlugs.has(slug)
        ? "Forms"
        : navSlugs.has(slug)
          ? "Navigation & overlays"
          : "Display",
    status: audit
      ? changed || audit.status === "changed"
        ? "changed"
        : "reviewed"
      : "pending",
    changed,
    referenceUrl: audit?.referenceUrl ?? null,
    changes: audit?.changes ?? ["Review in progress."],
    verification: audit?.verification ?? [],
    commonStories,
    defaultStory: commonStories.includes(examples[slug])
      ? examples[slug]
      : "Overview",
    demoState: focusComponents.has(slug)
      ? "focus"
      : slug === "skeleton"
        ? "stagger"
        : "none",
    replay: replays[slug] ?? null,
    initialArgs: null,
    beforeCaption: focusComponents.has(slug)
      ? "Teal focus border / outer glow"
      : (explanations[slug]?.[0] ?? "Before this pass"),
    afterCaption: focusComponents.has(slug)
      ? "Primary border / no outer glow"
      : (explanations[slug]?.[1] ?? "Updated behavior"),
    tryThis: focusComponents.has(slug)
      ? "Focus state is shown in both previews so the border and glow difference is visible immediately."
      : (explanations[slug]?.[2] ??
        "Interact with both previews to compare the changes described above."),
  };
});
if (
  process.argv.includes("--require-complete") &&
  entries.some((entry) => entry.status === "pending")
)
  throw new Error(
    `Missing reviews: ${entries
      .filter((e) => e.status === "pending")
      .map((e) => e.slug)
      .join(", ")}`
  );
const data = JSON.stringify({
  capturedAt: baseline.capturedAt,
  entries: entries.filter((entry) => entry.status === "changed"),
}).replaceAll("<", "\\u003c");
const page = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>MyOperator v2 · Before & after</title>
<style>
:root{--ink:#484848;--body:#5e5e5e;--muted:#707070;--line:#e9eaeb;--primary:#343e55;--canvas:#f7f7f7}*{box-sizing:border-box}body{margin:0;font:14px/1.55 Inter,system-ui,sans-serif;color:var(--body);background:#fafafa}button,input,select{font:inherit}button,a,input,select{-webkit-tap-highlight-color:transparent}a{color:inherit}button{cursor:pointer}button:disabled{cursor:default;opacity:.55}button:focus-visible,input:focus-visible,select:focus-visible,a:focus-visible{outline:2px solid var(--primary);outline-offset:3px}header{background:#fff;border-bottom:1px solid var(--line)}.hero{max-width:1560px;margin:auto;padding:38px 32px 24px}.brand{display:flex;align-items:center;gap:10px;font-size:14px;font-weight:500;color:var(--ink);text-decoration:none}.brand img{width:28px;height:28px;object-fit:contain}.brand .wordmark{width:120px;height:24px}.eyebrow{color:var(--muted);font-size:12px;margin:26px 0 8px}h1{margin:0;font-size:34px;line-height:1.2;letter-spacing:-1px;font-weight:500;color:var(--ink)}.intro{max-width:760px;margin:12px 0 22px;font-size:15px}.stats{display:flex;gap:18px;flex-wrap:wrap;font-size:13px}.stats strong{color:var(--ink);font-weight:500}.toolbar{position:sticky;top:0;z-index:10;background:rgba(255,255,255,.97);border-bottom:1px solid var(--line)}.toolbar-inner{max-width:1560px;margin:auto;padding:14px 32px;display:flex;align-items:center;gap:14px;flex-wrap:wrap}.search{position:relative;min-width:240px;flex:1;max-width:400px}.search svg{position:absolute;left:12px;top:12px;width:16px;height:16px;color:var(--muted)}.search input{width:100%;padding:9px 12px 9px 36px;background:var(--canvas);border:1px solid var(--line);border-radius:8px;color:var(--ink);outline-offset:2px}.filters{display:flex;gap:6px;flex-wrap:wrap}.pill{border:1px solid transparent;border-radius:8px;background:transparent;color:var(--body);padding:7px 11px;transition:background .15s,color .15s}.pill:hover{background:#f5f5f5}.pill[aria-pressed=true]{background:var(--primary);color:#fff}.only-changed{margin-left:auto;display:flex;align-items:center;gap:8px;white-space:nowrap;font-size:13px}.only-changed input{accent-color:var(--primary);width:15px;height:15px}main{max-width:1560px;margin:auto;padding:24px 32px 72px}.review-card{background:#fff;border:1px solid var(--line);border-radius:12px;margin-bottom:24px;overflow:hidden;scroll-margin-top:95px}.card-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;padding:22px 24px 16px}.card-heading h2{font-size:20px;line-height:1.4;font-weight:500;color:var(--ink);margin:0;letter-spacing:-.3px}.card-heading h2 a{text-decoration:none}.family{color:var(--muted);font-size:12px;margin-bottom:5px}.status{font-size:12px;padding:4px 9px;border-radius:6px;background:#f5f5f5;color:var(--body);white-space:nowrap}.status.changed{background:#ecf1fb;color:var(--primary)}.summary{padding:0 24px 18px;margin:0;font-size:14px;max-width:1100px}.change-guide{margin:12px 0 0;padding:10px 12px;border-radius:8px;background:#f7f7f7;color:#484848;font-size:13px}.summary li{margin:4px 0 4px 18px}.summary ul{margin:0;padding:0}.card-tools{padding:0 24px 18px;display:flex;align-items:center;gap:12px;flex-wrap:wrap}.card-tools label{font-size:13px;color:var(--muted)}select{border:1px solid var(--line);border-radius:8px;background:#fff;color:var(--ink);padding:7px 30px 7px 10px;max-width:300px}.quiet-button{border:1px solid var(--line);border-radius:8px;background:#fff;color:var(--body);padding:7px 10px;font-size:13px;transition:background .15s}.quiet-button:hover{background:#f5f5f5}.text-link{font-size:13px;color:var(--muted);text-decoration:none}.text-link:hover{color:var(--ink);text-decoration:underline}.card-links{margin-left:auto;display:flex;gap:16px}.preview-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);border-top:1px solid var(--line)}.preview-column{min-width:0;background:var(--canvas)}.preview-column+ .preview-column{border-left:1px solid var(--line)}.preview-label{display:flex;justify-content:space-between;gap:8px;padding:11px 18px;border-bottom:1px solid var(--line);font-size:12px;background:#fff;color:var(--muted)}.preview-label strong{color:var(--ink);font-weight:500}.preview-column iframe{width:100%;display:block;border:0;background:var(--canvas);height:320px}.preview-error{padding:12px 18px;color:#b42318;font-size:13px;display:none}.controls{display:none;padding:20px 24px;border-top:1px solid var(--line);background:#fff}.controls.open{display:block}.control-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:16px}.field{min-width:0;display:flex;flex-direction:column;gap:6px;font-size:13px}.field input:not([type=checkbox]),.field select{width:100%;max-width:none;border:1px solid var(--line);border-radius:8px;padding:8px 10px;color:var(--ink);background:#fff}.field input[type=checkbox]{width:16px;height:16px;accent-color:var(--primary)}.control-hint{margin:0 0 16px;font-size:12px;color:var(--muted)}.no-results{padding:60px;text-align:center;color:var(--muted)}.footer{font-size:12px;color:var(--muted);margin:28px 0}.note{font-size:12px;color:var(--muted);margin:18px 0 0}.review-card[hidden]{display:none}.controls-empty{color:var(--muted);font-size:13px}.review-card{animation:appear .18s ease-out}@keyframes appear{from{opacity:0}to{opacity:1}}@media(max-width:760px){.hero{padding:28px 18px 20px}.toolbar-inner{padding:12px 18px;gap:10px}main{padding:18px}.preview-grid{grid-template-columns:1fr}.preview-column+.preview-column{border-left:0;border-top:1px solid var(--line)}.card-heading{padding:18px}.summary,.card-tools{padding-left:18px;padding-right:18px}.only-changed{margin-left:0}.card-links{margin-left:0}.search{max-width:none}.filters{overflow-x:auto;flex-wrap:nowrap;max-width:100%}.pill{white-space:nowrap}h1{font-size:28px}.controls{padding:18px}}@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;animation:none!important;transition:none!important}}
</style></head><body>
<header><div class="hero"><a class="brand" href="/components/button"><img src="/brand/myoperator-symbol.svg" alt=""><img class="wordmark" src="/brand/myoperator-wordmark.svg" alt="MyOperator"><span style="color:var(--muted);font-weight:400">UI / v2</span></a><p class="eyebrow">Component review</p><h1>Before & after, in one place.</h1><p class="intro">Explore the current library beside the Arc-inspired updates. Both previews are interactive. Switch examples or open shared controls to compare the same state.</p><div class="stats" id="stats"></div><p class="note">Before is frozen at the start of this review. Primary colors, corner radii and v1 compatibility are preserved. Live Arc examples were exercised. Local before/after visual sign-off remains unverified.</p></div></header>
<div class="toolbar"><div class="toolbar-inner"><label class="search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/></svg><input id="search" type="search" placeholder="Find a component or change…" aria-label="Find a component or change"></label><div class="filters" id="filters" aria-label="Component categories"></div><span class="only-changed">Updated components only</span></div></div>
<main><div id="cards"></div><p id="empty" class="no-results" hidden>No matching components. Try another name or clear the filters.</p><p class="footer">Use each preview independently, or shared controls to apply the same values to both. Components with no direct Arc equivalent are identified in their review notes.</p></main>
<script type="application/json" id="review-data">${data}</script>
<script>
const review=JSON.parse(document.getElementById('review-data').textContent);
const channel='myoperator-v2-docs';
const cards=new Map();let family='All';
const make=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el};
const name=id=>id.replace(/([a-z0-9])([A-Z])/g,'$1 $2');
const changed=review.entries.filter(e=>e.status==='changed').length;
document.getElementById('stats').innerHTML='<span><strong>'+review.entries.length+'</strong> updated components</span><span>Before snapshot + current version</span>';
['All',...new Set(review.entries.map(entry=>entry.family))].forEach(value=>{const b=make('button','pill',value);b.type='button';b.setAttribute('aria-pressed',String(value===family));b.onclick=()=>{family=value;document.querySelectorAll('.pill').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));filter()};document.getElementById('filters').append(b)});
function send(state,type,args){Object.values(state.frames).forEach(frame=>frame.contentWindow?.postMessage({channel,type,component:state.entry.slug,story:state.story,...args},location.origin))}
function choose(state,id){state.story=id;state.metadata={};state.heights={};state.initialized={};send(state,'select-story',{story:id});Object.values(state.frames).forEach(frame=>{frame.parentElement.querySelector('.preview-error').style.display='none'});state.controls.replaceChildren(make('p','control-hint','Loading shared controls…'))}
function buildControls(state){
 const before=state.metadata.before,after=state.metadata.after;if(!before||!after)return;
 state.controls.replaceChildren(make('p','control-hint','Changes apply to both previews. Controls show the updated value; the before version may begin with a different default.'));
 const grid=make('div','control-grid');state.controls.append(grid);state.fields=new Map();
 const options=type=>Array.isArray(type.options)?type.options:[];
 const common=Object.entries(after.argTypes||{}).filter(([key,type])=>before.argTypes?.[key]&&type.control!==false);
 let count=0;
 for(const [key,type] of common){
  const raw=typeof type.control==='string'?type.control:type.control?.type;
  const value=after.args?.[key];let input;
  if(raw==='boolean'||typeof value==='boolean'){input=make('input');input.type='checkbox';input.checked=!!value;input.onchange=()=>send(state,'update-args',{args:{[key]:input.checked}})}
  else if(options(type).length){const valid=options(type).filter(v=>!options(before.argTypes[key]).length||options(before.argTypes[key]).some(other=>JSON.stringify(other)===JSON.stringify(v)));if(!valid.length)continue;input=make('select');valid.forEach((v,i)=>{const o=make('option',null,String(v));o.value=String(i);o.selected=JSON.stringify(v)===JSON.stringify(value);input.append(o)});input.onchange=()=>send(state,'update-args',{args:{[key]:valid[Number(input.value)]}})}
  else if(raw==='number'||typeof value==='number'){input=make('input');input.type='number';input.value=value??'';input.onchange=()=>{const n=Number(input.value);if(Number.isFinite(n))send(state,'update-args',{args:{[key]:n}})}}
  else if(raw==='text'||typeof value==='string'){input=make('input');input.type='text';input.value=value??'';input.oninput=()=>send(state,'update-args',{args:{[key]:input.value}})}
  else continue;
  const label=make('label','field');label.append(make('span',null,name(key)),input);grid.append(label);state.fields.set(key,{input,type:raw,options:input.tagName==='SELECT'?Array.from(input.options).map(option=>options(type).find(v=>String(v)===option.textContent)):[]});count++;
 }
 if(!count)state.controls.append(make('p','controls-empty','This example has no shared editable properties. You can still interact with both previews.'));
}
for(const entry of review.entries){
 const card=make('section','review-card');card.id=entry.slug;
 const state={entry,card,frames:{},metadata:{},heights:{},story:entry.defaultStory||'Overview'};cards.set(entry.slug,state);
 const heading=make('div','card-heading'),left=make('div');left.append(make('div','family',entry.family));const title=make('h2');const anchor=make('a',null,entry.title);anchor.href='#'+entry.slug;title.append(anchor);left.append(title);heading.append(left,make('span','status '+entry.status,entry.status==='changed'?'Updated':entry.status==='reviewed'?'Reviewed':'In progress'));card.append(heading);
 const summary=make('div','summary'),list=make('ul');entry.changes.forEach(change=>list.append(make('li',null,change)));summary.append(list);summary.append(make('p','change-guide',entry.tryThis));card.append(summary);
 const tools=make('div','card-tools');const select=make('select');select.setAttribute('aria-label',entry.title+' example');entry.commonStories.forEach(id=>{const o=make('option',null,name(id));o.value=id;o.selected=id===state.story;select.append(o)});select.onchange=()=>choose(state,select.value);tools.append(make('label',null,'Example'),select);
 const customize=make('button','quiet-button','Shared controls');customize.type='button';customize.setAttribute('aria-expanded','false');customize.onclick=()=>{const open=!state.controls.classList.contains('open');state.controls.classList.toggle('open',open);customize.setAttribute('aria-expanded',String(open));if(open)buildControls(state)};tools.append(customize);
 const reset=make('button','quiet-button','Reset both');reset.type='button';reset.onclick=()=>send(state,'reset');tools.append(reset);if(entry.demoState==='focus'){const focus=make('button','quiet-button','Show resting state');focus.type='button';let forced=true;focus.onclick=()=>{forced=!forced;send(state,'review-state',{state:forced?'focus':'none'});focus.textContent=forced?'Show resting state':'Show focus difference'};tools.append(focus)}if(entry.replay){const replay=make('button','quiet-button','Replay change');replay.type='button';replay.disabled=true;state.replayButton=replay;replay.onclick=()=>{send(state,'reset');send(state,'update-args',{args:entry.replay[0]});clearTimeout(state.replayTimer);state.replayTimer=setTimeout(()=>send(state,'update-args',{args:entry.replay[1]}),300)};tools.append(replay)}
 const links=make('div','card-links');const docs=make('a','text-link','Full component');docs.href='/components/'+entry.slug;links.append(docs);if(entry.referenceUrl){const ref=make('a','text-link','Arc reference ↗');ref.href=entry.referenceUrl;ref.target='_blank';ref.rel='noopener noreferrer';links.append(ref)}tools.append(links);card.append(tools);
 const grid=make('div','preview-grid');for(const version of ['before','after']){
  const col=make('div','preview-column');const label=make('div','preview-label');label.append(make('strong',null,version==='before'?'Before':'Updated'),make('span',null,version==='before'?entry.beforeCaption:entry.afterCaption));col.append(label);
  const frame=make('iframe');frame.title=entry.title+' '+version+' interactive preview';frame.loading='lazy';frame.setAttribute('sandbox','allow-scripts allow-same-origin');frame.style.height=['button','button-group','action-button','split-button'].includes(entry.slug)?'420px':'320px';const url=new URL('/preview/index.html',location.origin);url.searchParams.set('component',entry.slug);url.searchParams.set('story',state.story);url.searchParams.set('parentOrigin',location.origin);url.searchParams.set('comparison','1');url.searchParams.set('compareState',entry.demoState);if(version==='before')url.searchParams.set('review','before');frame.src=url.href;col.append(frame);const error=make('p','preview-error');error.setAttribute('role','alert');col.append(error);state.frames[version]=frame;frame.addEventListener('load',()=>frame.contentWindow?.postMessage({channel,type:'request-metadata'},location.origin));grid.append(col);
 }card.append(grid);state.controls=make('div','controls');card.append(state.controls);document.getElementById('cards').append(card);
}
window.addEventListener('message',event=>{
 if(event.origin!==location.origin||event.data?.channel!==channel)return;
 let state,version;for(const candidate of cards.values()){version=Object.keys(candidate.frames).find(key=>candidate.frames[key].contentWindow===event.source);if(version){state=candidate;break}}if(!state)return;
 const message=event.data;if(message.component&&message.component!==state.entry.slug)return;
 if(message.type==='metadata'){state.metadata[version]=message;if(state.entry.initialArgs&&!state.initialized?.[version]){state.initialized=state.initialized||{};state.initialized[version]=true;state.frames[version].contentWindow?.postMessage({channel,type:'update-args',component:state.entry.slug,story:state.story,args:state.entry.initialArgs},location.origin)}if(state.replayButton)state.replayButton.disabled=!(state.metadata.before&&state.metadata.after);if(state.controls.classList.contains('open'))buildControls(state)}
 if(message.type==='args-updated'&&state.metadata[version]){state.metadata[version].args=message.args;state.metadata[version].argTypes=message.argTypes;if(version==='after'&&state.fields){for(const [key,field] of state.fields){const value=message.args?.[key],input=field.input;if(document.activeElement===input)continue;if(input.type==='checkbox')input.checked=!!value;else if(input.tagName==='SELECT'){const i=field.options.findIndex(option=>JSON.stringify(option)===JSON.stringify(value));if(i>=0)input.value=String(i)}else if(input.value!==String(value??''))input.value=String(value??'')}}}
 if(message.type==='resize'&&Number.isFinite(message.height)){state.heights[version]=message.height;const height=Math.max(220,Math.min(860,Math.max(...Object.values(state.heights))));Object.values(state.frames).forEach(frame=>frame.style.height=height+'px')}
 if(message.type==='error'){const el=state.frames[version].parentElement.querySelector('.preview-error');el.textContent=message.message||'Preview could not render.';el.style.display='block'}
});
function filter(){const query=document.getElementById('search').value.trim().toLowerCase();let visible=0;for(const state of cards.values()){const e=state.entry;const show=(family==='All'||e.family===family)&&(!query||[e.title,...e.changes].join(' ').toLowerCase().includes(query));state.card.hidden=!show;if(show)visible++}document.getElementById('empty').hidden=visible>0}
document.getElementById('search').addEventListener('input',filter);
</script></body></html>`;
fs.mkdirSync("apps/docs/public", { recursive: true });
fs.writeFileSync("apps/docs/public/v2-review.html", page);
fs.writeFileSync(
  "design/arc-review/review-data.json",
  JSON.stringify({ capturedAt: baseline.capturedAt, entries }, null, 2) + "\n"
);
console.log(
  `Built v2-review.html: ${entries.length} components; ${entries.filter((e) => e.status === "changed").length} updated; ${entries.filter((e) => e.status === "pending").length} pending`
);
