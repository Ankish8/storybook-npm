# v2 Figma specs (New Design System - MyO, file q84boKV4Bly9HKXzdtBj2K, page v2, frame "Components" 2285:8532)

## How to read Figma (Work Chrome tab in MCP group; Dev Mode = shift+d)
- Helpers on window: __sel(id) (select layer row by node id), __x()/__css() (inspect panel text), __key('Enter') (select children), __v (button variants list)
- Output filter blocks key=value / "a:b; c:d" -> use "prop value · prop value" format
- Child id of a variant frame = variant id + 1.. (icon L, Label, icon R, Focus Ring)
- Tab key via computer tool walks siblings. Shift+2 zoom-to-selection only in Design mode.

## Card node ids (children of Components 2285:8532)
Accordion 924:9830 | Alert 924:9912 | Avatar 924:9983 | Badges 924:6748 | Bouncing Loader 2185:13995 | Breadcrumbs 2274:48709
Buttons 924:6438 (set 924:6442) | Button Groups 932:19755 | Checkboxes 924:6837(hidden) | Confirmation Modal 924:10148
Date Range Picker 3217:27914 | Date Time Picker 2185:14049 | Delete Confirmation Modal 924:11626 | Dialog 924:11664
Dropdown Menu 924:7148 | Empty State 924:7344 | File Upload 924:7516 | Input Field 924:7628 | Number Step 2185:15837
OTP Input 2000:11973 | Page Header 924:11749, 2188:7792 | 924:11830 | 924:11892 | Input Field 2190:7669 | 2284:50240 | 2224:16084
924:12122 | 2284:50242 | Input Field 2118:22190, 2650:18296 | 3217:102530 | 924:12193 | 924:12231 | 2705:35397 | Switch 924:12476
2207:12414 | 924:12601 | Table 924:8961 | Tags 924:9132 | Text Field 924:9305 | Toast 924:12618 | Tooltip 924:12668 | 2284:50241

## Global v2 facts
- Font: Inter (var --v2). App currently Open Sans (self-hosted) -> use --font-v2 token w/ Open Sans fallback; ASK user re loading Inter.
- Text styles: v2/Title/Medium 16px/500 normal; v2/Body/Medium 14px/400 normal (muted #717680); v2/Label/Large 14px/600 lh20 ls0.014px; v2/Label/Medium 12px/600 lh normal ls0.06px
- Colors same palette as myoperator-ui-theme.css (Text-text-primary #181D27, bg-primary #FFF, text-muted #717680, primary #343E55, hover #2F384D)
- Radius token New-sm = 8px. Shadow SKEU = 0 1px 2px 0 rgba(12,15,18,.05), 0 0 0 1px rgba(10,13,18,.18) inset, 0 -2px 0 0 rgba(12,15,18,.05) inset. Border token Skeuomorphic = rgba(255,255,255,.12)
- Soft shadow (secondary/outline) = 4px 4px 40px 0 rgba(0,0,0,.02)

## BUTTON (set 924:6442; variants Primary,Secondary,Outline,Ghost,Destructive,Link,Dashed,Success x states Default,Hover,Pressed,Disabled,Loading x sizes Large,Medium,Small,Icon)
Sizes: Large h48 / Medium h40 / Small h32 / Icon 40x40; px16 py10 gap8 radius8; icon 18x18. Label Large+Medium: 14/600/lh20/ls .014px; Small label: 12/600/ls .06px
Focus ring: abs rect offset 3px, 1px solid #343E55
Primary: border 2px SKB, bg #343E55, SKEU shadow, text #FFF | hover bg #2F384D | pressed bg linear-gradient(270deg,#777E8D 0%,#2F384D 100%) no shadow, h-1 | disabled+loading bg #A2A6B1 no border/shadow text #FFF
Secondary: bg #ECF1FB, soft shadow, no border, text #343E55 | hover border 1px SKB no shadow | pressed gradient(270deg,#EBECEE 0%,#ECF1FB 100%) | disabled bg #EBECEE text #717680 | loading bg #F5F5F5
Outline: border 1px #E9EAEB bg #FFF soft shadow text #343E55 | hover bg #F5F5F5 | pressed gradient(270deg,#E9EAEB 0%,#F5F5F5 100%) | disabled bg #EBECEE text #717680 | loading bg #FFF
Destructive: border 1px SKB bg #F04438 SKEU text #FFF | hover #D92D20 | pressed gradient(270deg,#F04438 0%,#D92D20 47.6%) | disabled/loading rgba(240,68,56,.6) no border/shadow
Success: border 1px SKB bg #17B26A SKEU text #FFF | hover #079455 | pressed gradient(270deg,#17B26A 0%,#079455 47.6%) | loading #17B26A no border/shadow (no disabled variant)
Dashed: border 1px dashed #E9EAEB bg #FFF text #717680 | hover border dashed #C0C3CA bg #F5F5F5 | pressed gradient(270deg,#E9EAEB,#F5F5F5)+border #C0C3CA | loading=default (no disabled variant)
Ghost: bg #FFF/transparent, text #4275D6 (blue!), label 12px | hover bg #F5F5F5 | pressed gradient(270deg,#E9EAEB,#F5F5F5) | disabled text #A2A6B1
Link: no bg/border; dark text, underline on hover (label color unread)
Usage in app (outside ui/): secondary 75, primary 42, link 28, outline 23, default 10, success 5, ghost 5, destructive 1

## PROCESS NOTES (important)
- Chrome automation window is often visibilityState hidden -> Figma canvas only paints when visible. Call mcp__Control_Chrome__switch_to_tab(<my figma tab id>) right before a Figma batch; ALWAYS follow input with screenshot(scale 0.1) before reading Inspect via JS (forces a frame). Tab id changes per group (current 1312414828). NEVER touch other tabs from Control_Chrome (user's Gmail/FB etc).
- After navigate reload, restore helpers: eval(localStorage.getItem('__h')) ; __read(ms) returns "name/type [props] ## css"
- Read frame of a child: cmd+click child, then shift+Return (select parent). Screenshot coordinate frame can change (1500x757 vs 1568x741) -> always check frame before clicking.
- Control_Chrome tab ids: my Figma tab is separate from user's own Figma tab 1312414804 (don't touch).
- Code state: Button (button.tsx), Badge (badge.tsx), Tag (tag.tsx) edited; tailwind.config.js fontFamily.v2; src/lib/myoperator-ui-v2.css (+ import in App.scss); TEMP gallery src/modules/Shadcn/V2Gallery + routes.ts/route-components.ts entries (path /bots/v2-gallery since Cake only whitelists known prefixes).
- twMerge note: use literal tw-shadow-[...] (not var()/[box-shadow:...]) so merges dedupe.

## BADGE (set 924:6752) variants Primary,Outline,Disabled,Info,Active,Failed,Warning,Destructive,Secondary x Small/Default/Large
Pill radius 25px; gap 8px; check icon glyph 10.7x7.3 stroke 1.2; Small h20 pad 2/8 text 12/400; Default h24 pad 4/12 text 12/400; Large h30 pad 6/16 text 14/400
Primary bg #F5F5F5 b .4px #E9EAEB t #181D27 | Outline bg #FFF b 1px #E9EAEB t #181D27 | Disabled bg #F5F5F5 no border t #717680
Info bg #ECF1FB b #A8C0EC(border shows #000 in design, bug) t #2F5398 | Active bg #ECFDF3 b #ABEFC6 t #067647 | Failed/Destructive bg #FEF3F2 b #FECDCA t #B42318
Warning bg #FFFAEB b #FEDF89 t #B54708 | Secondary bg #EAF8FA b #27ABB8 t #181D27   (DONE in badge.tsx)

## TAGS (card 924:9132): variants Primary,Secondary(gray),Accent(teal),Info,Success,Warning,Error,Destructive x Small/Default/Large
radius 8; gap 6; border .4px; Small h20 pad 2/6 text12 label 12/600; Default h24 pad 4/8 text14 label 14/600(ls .014px); Large h30 pad 6/12; icons glyph 6.7px stroke 1
gray bg #F5F5F5 b #E9EAEB t #181D27 | accent bg #EAF8FA b #27ABB8 | info #ECF1FB/#A8C0EC/#2F5398 | success #ECFDF3/#ABEFC6/#067647 | warning #FFFAEB/#FEDF89/#B54708 | error+destructive #FEF3F2/#FECDCA/#B42318  (DONE in tag.tsx)

## TEXT AREA (card 924:9305 'Text Field' = Text Area): label 14/600 #343E55; placeholder S12 / D14 / L16 color #A2A6B1; helper 12/400 #717680 w/ info icon 14px gap 6; counter 0/100 12/400 #717680; variant col gap 4
## INPUT FIELD (card 924:7628) inputField variant col gap 4, width 420
container: pad 10px 16px, gap 8px, radius 8px, border 1px #E9EAEB, bg #FFF => h40. hover border #C0C3CA | focus border #27ABB8 + shadow 0 0 4px rgba(39,171,184,.4) | error border #F04438 (helper+icon #B42318) | disabled bg #F5F5F5 border #E9EAEB (placeholder #A2A6B1)
label 14/600 #343E55 (+ red asterisk, info icon); placeholder #A2A6B1 16/400; value #181D27 16/400; prefix/suffix #717680 16/400; search icon glyph 13.5px stroke 1.2 #717680; helper 12/400 #717680; counter 12/400 #717680

## STATUS (update): DONE in code + verified in gallery: Button, Badge, Tag, Input, TextField, Toast, Tooltip, Dialog base, ConfirmationModal, DeleteConfirmationModal, DropdownMenu items, Tabs, Table (header/cell)
Card id map additions: Page Footer 2188:7792 | Pagination 924:11830 | Panel 924:11892 | Phone Input 2190:7669 | Progress Indicator 2284:50240 | hidden 2224:16084 | Readable Field 924:12122 | Scrollbar 2284:50242
 Dropdown Field 2118:22190 | Selection (checkbox/radio/switch) 2650:18296 | Shimmering Text 3217:102530 | Skeleton 924:12193 | Spinner 924:12231 | Stepper 2705:35397 | Tabs 924:12601 | UI Cards 2284:50241
 Breadcrumbs 2274:48709 | Switch 924:12476 hidden | Checkboxes 924:6837 hidden
Gallery tab: my app tab id 1312414840 (url /bots/v2-gallery), figma tab 1312414828. Use mcp__Control_Chrome__switch_to_tab to focus each before using.

## TOAST v2: width 384, radius 8, border 1px tint, shadow xl 0 20px 24px -4px rgba(10,13,18,.08), 0 8px 8px -4px rgba(10,13,18,.03), 0 3px 3px -1.5px rgba(10,13,18,.04); header pad16 gap16 border-b .4px, title 16/500; content row pad 12/16 gap12 desc 12/400 + Action (outline small btn)
 default #FFF/#E9EAEB/#181D27 | success #ECFDF3/#ABEFC6/#067647 | error #FEF3F2/#FECDCA/#B42318 | warning #FFFAEB/#FEDF89/#B54708 | info #ECF1FB/#A8C0EC/#2F5398
## TOOLTIP v2: bg #ECF1FB, radius 6, pad 6/16, text 12 #343E55, title 12/600 #181D27, shadow 0 1px 3px rgba(10,13,18,.1),0 1px 2px -1px rgba(10,13,18,.1), maxw 320
## DIALOG v2: radius 12, border 1.2px #E9EAEB, shadow xl, sizes 384/512/672/896; header pad24 gap16 border-b; title 16/500 #181D27; desc 12/400 #717680; close icon 12; body pad24 gap16; footer pad 0 24 24 gap8 (buttons Medium)
## CONFIRMATION v2: 384 radius12; header pad16 gap12 border-b icon24 title16/500; body pad 12/16 text 14/400 #343E55; footer pad 12/16/16 buttons flex-1
## DELETE v2: header pad24 gap16 icon box32 (trash red); body pad 0 24, label 14/600 + input; footer pad 0 16 16 right aligned
## DROPDOWN ITEM v2: h48 min40 pad 10/6 gap8 label 16/400 #181D27 (destructive #B42318) subtext 12 #717680 hover bg #F5F5F5, shortcut chip, selected check teal, submenu chevron
## TABS v2: tab pad 16/12 gap 8 label 14/600 (active #181D27, inactive #343E55), active border-b 2px #343E55; count badge 18px circle bg #EBECEE border .4px #E9EAEB text 12
## TABLE v2: header cell pad 12/24 h60 bg #EBECEE label Title/Small 14/500 ls .014 UPPERCASE #343E55; body cells 14/400 #181D27


## LIBRARY CONTINUATION — October 1, 2026

- The user confirmed that everything should match v2. Badge Info uses the black border shown in the recorded design, rather than the earlier blue correction. Tag Info remains #A8C0EC.
- A1 values were checked against this recorded spec and the already verified web-panel diffs; Figma was not reopened.
- Checkbox (Selection card, verified web-panel diff): sizes 16/20/24 square, radius 4, border 1; unchecked white/E9EAEB, hover F5F5F5/C0C3CA, focus border343E55 plus 2px EBECEE shadow, disabled borderF5F5F5. Checked/indeterminate fill and border343E55, iconswhite; hover fill2F384D (checked also border2F384D and 2px EBECEE shadow; indeterminate retains default border). Disabled selected fill/borderA2A6B1, no whole-control opacity. Check/minus glyphs12/14/16, stroke3; label sizes12/14/16 and weight600 preserve v1.
- Switch (Selection card, verified web-panel diff): tracks32x18 / 36x20 / 44x24, radius12, transparent border2; thumbs14/16/20, checked translation14/16/20. On343E55, hover2F384D, disabledonA2A6B1. OffEBECEE, hoverE9EAEB. Focusoutline1px343E55 with offset3. Thumbwhite with shadow0 2px 8px rgba(0,0,0,.06); disabledon thumbEBECEE and disabledoff thumbF5F5F5. No whole-control opacity. Label sizes12/14/16 and weight600 preserve v1.
