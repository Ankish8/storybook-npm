import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

// Retain the library's complete usage stories, adding v2 docs and comparisons.
const name = process.argv[2];
const root = process.cwd();
const ui = path.join(root,"src/components/ui");
const config = JSON.parse(fs.readFileSync(process.argv[3],"utf8"));
let text = fs.readFileSync(path.join(ui,`${name}.stories.tsx`),"utf8");
let sf = ts.createSourceFile("story.tsx",text,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const edits=[];
const locals=[];
const visit = node => {
  if(ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
    const from=node.moduleSpecifier.text;
    if(from.startsWith('./')) {
      const dep=from.slice(2);
      edits.push([node.moduleSpecifier.getStart(sf),node.moduleSpecifier.end,JSON.stringify(fs.existsSync(path.join(ui,'v2',dep+'.tsx'))?'./'+dep:'../'+dep)]);
      const bindings=node.importClause?.namedBindings;
      if(bindings && ts.isNamedImports(bindings)) for(const el of bindings.elements) {
        if(!el.isTypeOnly && /^[A-Z]/.test(el.name.text)) locals.push({name:el.name.text,exported:el.propertyName?.text||el.name.text,from:'../'+dep});
      }
    } else if(from.startsWith('../')) edits.push([node.moduleSpecifier.getStart(sf),node.moduleSpecifier.end,JSON.stringify('../'+from)]);
  }
  if(ts.isPropertyAssignment(node)&&node.name.getText(sf)==='component'&&ts.isPropertyAssignment(node.parent?.parent)&&node.parent.parent.name.getText(sf)==='description') {
    edits.push([node.initializer.getStart(sf),node.initializer.end,'v2ComponentDocs('+JSON.stringify({name,...config})+')']);
  }
  if(ts.isPropertyAssignment(node)&&node.name.getText(sf)==='title'&&ts.isStringLiteral(node.initializer)) {
    edits.push([node.initializer.getStart(sf),node.initializer.end,JSON.stringify(node.initializer.text.replace(/^Components\//,'V2/Components/'))]);
  }
  ts.forEachChild(node,visit);
};
visit(sf);
for(const [start,end,value] of edits.sort((a,b)=>b[0]-a[0])) text=text.slice(0,start)+value+text.slice(end);
text='import { v2ComponentDocs } from "./story-docs";\n'+text;
sf=ts.createSourceFile('story.tsx',text,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const stories = new Map();
for(const st of sf.statements) if(ts.isVariableStatement(st)) for(const dec of st.declarationList.declarations) {
  if(ts.isIdentifier(dec.name)&&dec.initializer&&ts.isObjectLiteralExpression(dec.initializer)&&st.modifiers?.some(m=>m.kind===ts.SyntaxKind.ExportKeyword)) stories.set(dec.name.text,dec.initializer);
}
const base=stories.get('Overview')||stories.get('Default')||stories.values().next().value;
if(!base) throw Error('Review this story manually: no object story');
const props = base.properties.filter(ts.isPropertyAssignment);
const baseArgs=props.find(p=>p.name.getText(sf)==='args')?.initializer.getText(sf)||'{}';
const rendered=props.find(p=>p.name.getText(sf)==='render')?.initializer.getText(sf);
if(!stories.has('Overview')) text+='\nexport const Overview: Story = '+base.getText(sf)+';\n';
if(!stories.has('AllVariants')&&stories.has('AllStates')) text+='\nexport const AllVariants: Story = {...AllStates,name:"All variants"};\n';
const comparison=stories.get('AllVariants')||stories.get('AllStates')||base;
const compRender=comparison.properties.filter(ts.isPropertyAssignment).find(p=>p.name.getText(sf)==='render')?.initializer.getText(sf)||rendered||((locals.find(l=>l.from==='../'+name)?.name) ? '(args)=><'+locals.find(l=>l.from==='../'+name).name+' {...args} />' : undefined);
if(compRender&&!stories.has('V1VsV2')) {
  const aliases=new Map(locals.map(l=>[l.name,l.name+'V1']));
  const renderV1=compRender.replace(/\b[A-Z]\w*\b/g,word=>aliases.get(word)||word);
  for(const l of locals) text='import { '+l.exported+' as '+l.name+'V1 } from '+JSON.stringify(l.from)+';\n'+text;
  text+='\nconst compareV2: NonNullable<Story["render"]> = '+compRender+';\nconst compareV1: NonNullable<Story["render"]> = '+renderV1+';\nexport const V1VsV2: Story = {name:"v1 vs v2",args:'+baseArgs+',render:(args,context)=>(<div className="grid w-full gap-8 lg:grid-cols-2"><section className="space-y-4"><h2 className="m-0 text-base font-semibold text-semantic-text-primary">v1</h2>{compareV1(args,context)}</section><section className="space-y-4"><h2 className="m-0 text-base font-semibold text-semantic-text-primary">v2</h2>{compareV2(args,context)}</section></div>)};\n';
}
text=text.replace(/<p>/g,'<p className="m-0">').replace(/<p\s+className="(?![^\"]*\bm-0\b)([^\"]*)"/g,'<p className="m-0 $1"');
fs.writeFileSync(path.join(ui,'v2',`${name}.stories.tsx`),text);
console.log('Prepared '+name+' docs, current usage stories and comparison; review variants/states.');
