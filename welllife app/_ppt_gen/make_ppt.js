// Codex × Claude Cowork — 3-slide deck
// Run: npm install && node make_ppt.js
// Output: codex_cowork_3pages.pptx in this folder

const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title = "Codex x Claude Cowork";

const C = {
  bg:"FFFFFF", ink:"0F172A", body:"334155", muted:"64748B",
  faint:"E2E8F0", faintBg:"F8FAFC",
  codex:"4338CA", codexSoft:"EEF2FF",
  cowork:"EA580C", coworkSoft:"FFF7ED",
  auto:"0D9488", autoSoft:"CCFBF1",
  ok:"059669", okSoft:"D1FAE5",
  power:"7C3AED", powerSoft:"F3E8FF",
};

// ───────────── SLIDE 1 ─────────────
const slide = pres.addSlide();
slide.background = { color: C.bg };

slide.addText("双 AI 协作：同一文件夹，互改互查", {
  x:0.5, y:0.30, w:9.0, h:0.55,
  fontSize:26, bold:true, fontFace:"Calibri", color:C.ink, align:"left", margin:0,
});
slide.addText("Codex × Claude Cowork — 两个桌面 AI 共享同一项目，改与查视情况互换", {
  x:0.5, y:0.85, w:9.0, h:0.35,
  fontSize:13, fontFace:"Calibri", color:C.muted, align:"left", margin:0,
});

const cardY=1.45, cardH=3.45, cardW=3.30;
const codexX=0.40, coworkX=6.30;
const folderX=4.10, folderY=1.85, folderW=1.80, folderH=2.65;

function drawCard(s, opts){
  const { x, accent, accentSoft, tag, title, tagline, rows } = opts;
  s.addShape(pres.shapes.RECTANGLE, {
    x, y:cardY, w:cardW, h:cardH,
    fill:{color:"FFFFFF"}, line:{color:C.faint, width:0.75},
    shadow:{type:"outer", color:"0F172A", opacity:0.06, blur:10, offset:3, angle:90},
  });
  s.addShape(pres.shapes.RECTANGLE, { x, y:cardY, w:0.10, h:cardH, fill:{color:accent}, line:{type:"none"} });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x:x+cardW-1.00, y:cardY+0.30, w:0.80, h:0.28,
    fill:{color:accentSoft}, line:{type:"none"}, rectRadius:0.06,
  });
  s.addText(tag, { x:x+cardW-1.00, y:cardY+0.30, w:0.80, h:0.28, fontSize:9, bold:true, fontFace:"Calibri", color:accent, align:"center", valign:"middle", margin:0 });
  s.addText(title, { x:x+0.28, y:cardY+0.25, w:cardW-1.20, h:0.45, fontSize:21, bold:true, fontFace:"Calibri", color:C.ink, align:"left", margin:0 });
  s.addText(tagline, { x:x+0.28, y:cardY+0.72, w:cardW-0.45, h:0.32, fontSize:11, italic:true, fontFace:"Calibri", color:accent, align:"left", margin:0 });
  s.addShape(pres.shapes.LINE, { x:x+0.28, y:cardY+1.10, w:cardW-0.50, h:0, line:{color:C.faint, width:0.75} });
  rows.forEach((r,i)=>{
    const ry = cardY+1.30 + i*0.55;
    s.addShape(pres.shapes.OVAL, { x:x+0.32, y:ry+0.13, w:0.12, h:0.12, fill:{color:accent}, line:{type:"none"} });
    s.addText(r.label, { x:x+0.52, y:ry, w:0.85, h:0.40, fontSize:10, bold:true, fontFace:"Calibri", color:C.muted, align:"left", valign:"middle", margin:0, charSpacing:1 });
    s.addText(r.value, { x:x+0.32, y:ry+0.30, w:cardW-0.55, h:0.30, fontSize:11.5, fontFace:"Calibri", color:C.body, align:"left", valign:"middle", margin:0 });
  });
}
drawCard(slide,{x:codexX, accent:C.codex, accentSoft:C.codexSoft, tag:"OPENAI", title:"Codex", tagline:"工程深度优化",
  rows:[{label:"专长", value:"代码生成、重构、批量修改"},{label:"整合", value:"Git / GitHub / IDE 原生"},{label:"节奏", value:"异步执行：批量任务、产 PR"}],
});
drawCard(slide,{x:coworkX, accent:C.cowork, accentSoft:C.coworkSoft, tag:"ANTHROPIC", title:"Claude Cowork", tagline:"跨工具协作与编排",
  rows:[{label:"专长", value:"代码、文档、数据、跨应用流程"},{label:"整合", value:"MCP：Slack/Drive/Notion…"},{label:"节奏", value:"实时对话：边讨论边操作"}],
});

slide.addShape(pres.shapes.RECTANGLE, { x:folderX+0.18, y:folderY, w:0.75, h:0.20, fill:{color:C.ink}, line:{type:"none"} });
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:folderX, y:folderY+0.18, w:folderW, h:folderH-0.18, fill:{color:C.faintBg}, line:{color:C.ink, width:1.4}, rectRadius:0.10 });
slide.addText("共享项目文件夹", { x:folderX, y:folderY+0.30, w:folderW, h:0.32, fontSize:12, bold:true, fontFace:"Calibri", color:C.ink, align:"center", valign:"middle", margin:0 });
slide.addText("welllife app /", { x:folderX, y:folderY+0.65, w:folderW, h:0.28, fontSize:10, italic:true, fontFace:"Consolas", color:C.muted, align:"center", valign:"middle", margin:0 });
const files = ["index.html","news.json","package.json","README.md","..."];
files.forEach((fname,i)=>{
  const fy = folderY+1.05 + i*0.28;
  slide.addShape(pres.shapes.RECTANGLE, { x:folderX+0.25, y:fy+0.08, w:0.10, h:0.10, fill:{color: i===files.length-1 ? C.muted : C.ink}, line:{type:"none"} });
  slide.addText(fname, { x:folderX+0.40, y:fy, w:folderW-0.50, h:0.26, fontSize:10, fontFace:"Consolas", color: i===files.length-1 ? C.muted : C.body, align:"left", valign:"middle", margin:0 });
});
const arrowY = cardY + cardH*0.5 - 0.05;
slide.addShape(pres.shapes.LINE, { x:codexX+cardW+0.05, y:arrowY, w:folderX-(codexX+cardW)-0.10, h:0, line:{color:C.codex, width:2.8, endArrowType:"triangle", beginArrowType:"triangle"} });
slide.addShape(pres.shapes.LINE, { x:folderX+folderW+0.05, y:arrowY, w:coworkX-(folderX+folderW)-0.10, h:0, line:{color:C.cowork, width:2.8, endArrowType:"triangle", beginArrowType:"triangle"} });
slide.addText([
  { text:"两个 AI 在同一文件夹接力 · ", options:{color:C.muted} },
  { text:"改", options:{bold:true, color:C.codex} },
  { text:" 与 ", options:{color:C.muted} },
  { text:"查", options:{bold:true, color:C.cowork} },
  { text:" 视情况互换 · 谁更合适谁上", options:{color:C.muted} },
], { x:0.5, y:5.10, w:9.0, h:0.40, fontSize:12, fontFace:"Calibri", align:"center", valign:"middle", margin:0 });

// ───────────── SLIDE 2 ─────────────
const s2 = pres.addSlide();
s2.background = { color: C.bg };
s2.addText("两种沟通模式：手动是护栏，自动是放大器", { x:0.5, y:0.30, w:9.0, h:0.55, fontSize:26, bold:true, fontFace:"Calibri", color:C.ink, align:"left", margin:0 });
s2.addText("手动复制粘贴 = 防 AI 跑偏的关卡 · 自动 = 多轮对话 + 自动写总结", { x:0.5, y:0.85, w:9.0, h:0.35, fontSize:13, fontFace:"Calibri", color:C.muted, align:"left", margin:0 });

function drawFrame(s, x, y, w, h, accent){
  s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill:{color:"FFFFFF"}, line:{color:C.faint, width:0.75}, shadow:{type:"outer", color:"0F172A", opacity:0.06, blur:10, offset:3, angle:90} });
  s.addShape(pres.shapes.RECTANGLE, { x, y, w:0.10, h, fill:{color:accent}, line:{type:"none"} });
}

const m_x=0.40, m_y=1.45, m_w=3.50, m_h=3.55;
drawFrame(s2, m_x, m_y, m_w, m_h, C.ink);
s2.addShape(pres.shapes.OVAL, { x:m_x+0.30, y:m_y+0.30, w:0.45, h:0.45, fill:{color:C.ink}, line:{type:"none"} });
s2.addText("1", { x:m_x+0.30, y:m_y+0.30, w:0.45, h:0.45, fontSize:18, bold:true, fontFace:"Calibri", color:"FFFFFF", align:"center", valign:"middle", margin:0 });
s2.addText("手动 · 护栏", { x:m_x+0.85, y:m_y+0.30, w:m_w-1.00, h:0.45, fontSize:18, bold:true, fontFace:"Calibri", color:C.ink, align:"left", valign:"middle", margin:0 });
s2.addText("复制粘贴 — 防 AI 跑偏的关卡", { x:m_x+0.30, y:m_y+0.85, w:m_w-0.50, h:0.30, fontSize:12, italic:true, fontFace:"Calibri", color:C.muted, align:"left", margin:0 });
s2.addShape(pres.shapes.LINE, { x:m_x+0.30, y:m_y+1.18, w:m_w-0.55, h:0, line:{color:C.faint, width:0.75} });
const mPros = ["透明、人在中间审阅","随时打断 / 改方向","关键决策可干预","零依赖、零配置"];
mPros.forEach((p,i)=>{
  const py = m_y+1.30 + i*0.34;
  s2.addText("✓", { x:m_x+0.30, y:py, w:0.25, h:0.30, fontSize:13, bold:true, fontFace:"Calibri", color:C.ok, align:"left", valign:"middle", margin:0 });
  s2.addText(p, { x:m_x+0.55, y:py, w:m_w-0.75, h:0.30, fontSize:11.5, fontFace:"Calibri", color:C.body, align:"left", valign:"middle", margin:0 });
});
s2.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:m_x+0.30, y:m_y+m_h-0.65, w:m_w-0.55, h:0.45, fill:{color:C.faintBg}, line:{color:C.faint, width:0.6}, rectRadius:0.06 });
s2.addText("适合：探索期、决策点、边界判断", { x:m_x+0.30, y:m_y+m_h-0.65, w:m_w-0.55, h:0.45, fontSize:11, bold:true, fontFace:"Calibri", color:C.body, align:"center", valign:"middle", margin:0 });

const a_x=4.10, a_y=1.45, a_w=5.50, a_h=3.55;
drawFrame(s2, a_x, a_y, a_w, a_h, C.auto);
s2.addShape(pres.shapes.OVAL, { x:a_x+0.30, y:a_y+0.30, w:0.45, h:0.45, fill:{color:C.auto}, line:{type:"none"} });
s2.addText("2", { x:a_x+0.30, y:a_y+0.30, w:0.45, h:0.45, fontSize:18, bold:true, fontFace:"Calibri", color:"FFFFFF", align:"center", valign:"middle", margin:0 });
s2.addText("自动 · 互相讨论 → 写总结", { x:a_x+0.85, y:a_y+0.30, w:a_w-1.00, h:0.45, fontSize:18, bold:true, fontFace:"Calibri", color:C.ink, align:"left", valign:"middle", margin:0 });
s2.addText("Python 编排两个 AI 多轮对话，比对结果，最后产总结报告", { x:a_x+0.30, y:a_y+0.85, w:a_w-0.50, h:0.30, fontSize:12, italic:true, fontFace:"Calibri", color:C.muted, align:"left", margin:0 });
s2.addShape(pres.shapes.LINE, { x:a_x+0.30, y:a_y+1.18, w:a_w-0.55, h:0, line:{color:C.faint, width:0.75} });

const steps = [
  { n:"1", title:"Codex 起草", file:"codex/round_N.md", color:C.codex },
  { n:"2", title:"Cowork 复审", file:"cowork/round_N.md", color:C.cowork },
  { n:"3", title:"Python 比对", file:"识别冲突点", color:C.auto },
  { n:"4", title:"循环 N 轮", file:"直到收敛", color:C.muted },
  { n:"5", title:"AI 写总结", file:"summary.md", color:C.ok },
];
const stepStartX = a_x + 0.30;
const stepW = (a_w - 0.60 - 4*0.06) / 5;
const stepY = a_y + 1.32;
const stepH = 1.30;
steps.forEach((st, i) => {
  const sx = stepStartX + i*(stepW + 0.06);
  s2.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:sx, y:stepY, w:stepW, h:stepH, fill:{color:"FAFAFA"}, line:{color:st.color, width:0.8}, rectRadius:0.06 });
  s2.addShape(pres.shapes.OVAL, { x:sx + stepW/2 - 0.13, y:stepY+0.12, w:0.26, h:0.26, fill:{color:st.color}, line:{type:"none"} });
  s2.addText(st.n, { x:sx + stepW/2 - 0.13, y:stepY+0.12, w:0.26, h:0.26, fontSize:10, bold:true, fontFace:"Calibri", color:"FFFFFF", align:"center", valign:"middle", margin:0 });
  s2.addText(st.title, { x:sx+0.04, y:stepY+0.42, w:stepW-0.08, h:0.36, fontSize:11, bold:true, fontFace:"Calibri", color:C.ink, align:"center", valign:"middle", margin:0 });
  s2.addText(st.file, { x:sx+0.04, y:stepY+0.78, w:stepW-0.08, h:0.40, fontSize:9, fontFace:"Consolas", color:st.color, align:"center", valign:"middle", margin:0 });
  if (i < steps.length - 1) {
    s2.addText("→", { x:sx + stepW - 0.02, y:stepY + stepH/2 - 0.10, w:0.10, h:0.20, fontSize:13, bold:true, color:C.muted, align:"center", valign:"middle", margin:0 });
  }
});
const loopX1 = stepStartX + 2*(stepW + 0.06) + stepW/2;
const loopX2 = stepStartX + 3*(stepW + 0.06) + stepW/2;
s2.addText("↺  循环回 1", { x:loopX1 - 0.20, y:stepY + stepH + 0.05, w:(loopX2-loopX1)+0.40, h:0.25, fontSize:9, italic:true, bold:true, fontFace:"Calibri", color:C.auto, align:"center", valign:"middle", margin:0 });
s2.addText([
  { text:"关键节点用 ", options:{color:C.muted} },
  { text:"手动护栏", options:{bold:true, color:C.ink} },
  { text:" · 重复劳动交 ", options:{color:C.muted} },
  { text:"自动循环", options:{bold:true, color:C.auto} },
  { text:" · 多数实战是 ", options:{color:C.muted} },
  { text:"两者混合", options:{bold:true, color:C.ok} },
], { x:0.5, y:5.15, w:9.0, h:0.35, fontSize:12, fontFace:"Calibri", align:"center", valign:"middle", margin:0 });

// ───────────── SLIDE 3: HORMONElife auto-test loop ─────────────
const s3 = pres.addSlide();
s3.background = { color: C.bg };
s3.addText("Codex 自动压测 → 自动修代码 → 自动迭代", { x:0.5, y:0.30, w:9.0, h:0.55, fontSize:26, bold:true, fontFace:"Calibri", color:C.ink, align:"left", margin:0 });
s3.addText("用 1000 道题考 HORMONElife agent · 失败自动诊断 · Codex 自动改代码 · 直到收敛", { x:0.5, y:0.85, w:9.0, h:0.35, fontSize:13, fontFace:"Calibri", color:C.muted, align:"left", margin:0 });

const p_x=0.40, p_y=1.45, p_w=5.30, p_h=3.55;
drawFrame(s3, p_x, p_y, p_w, p_h, C.codex);
s3.addText("自动闭环 Pipeline", { x:p_x+0.30, y:p_y+0.30, w:p_w-0.55, h:0.40, fontSize:16, bold:true, fontFace:"Calibri", color:C.ink, align:"left", margin:0 });
s3.addText("Codex 全程驱动，整夜跑，醒来看报告", { x:p_x+0.30, y:p_y+0.72, w:p_w-0.55, h:0.30, fontSize:11, italic:true, fontFace:"Calibri", color:C.codex, align:"left", margin:0 });
s3.addShape(pres.shapes.LINE, { x:p_x+0.30, y:p_y+1.10, w:p_w-0.55, h:0, line:{color:C.faint, width:0.75} });

const pipe = [
  { n:"①", title:"生成 1000 题",       file:"codex/test_set.jsonl", color:C.codex },
  { n:"②", title:"跑测试 vs agent",     file:"results/run_N.json",   color:C.codex },
  { n:"③", title:"诊断失败模式",        file:"results/failures.md",  color:C.cowork },
  { n:"④", title:"Codex 自动改代码",   file:"git commit + diff",     color:C.codex },
  { n:"↺", title:"循环回 ②，直到 ≥99% 通过", file:"或 N 轮上限",       color:C.auto },
  { n:"⑤", title:"自动写总结报告",      file:"final_report.md",      color:C.ok },
];
const pStartY = p_y + 1.25;
const pRowH = 0.36;
pipe.forEach((it, i)=>{
  const ry = pStartY + i*pRowH;
  s3.addShape(pres.shapes.OVAL, { x:p_x+0.30, y:ry+0.04, w:0.28, h:0.28, fill:{color:it.color}, line:{type:"none"} });
  s3.addText(it.n, { x:p_x+0.30, y:ry+0.04, w:0.28, h:0.28, fontSize:11, bold:true, fontFace:"Calibri", color:"FFFFFF", align:"center", valign:"middle", margin:0 });
  s3.addText(it.title, { x:p_x+0.66, y:ry, w:2.50, h:0.36, fontSize:11.5, bold:true, fontFace:"Calibri", color:C.ink, align:"left", valign:"middle", margin:0 });
  s3.addText(it.file, { x:p_x+3.16, y:ry, w:p_w-3.40, h:0.36, fontSize:9.5, fontFace:"Consolas", color:it.color, align:"left", valign:"middle", margin:0 });
});

const r_x=5.95, r_y=1.45, r_w=3.65, r_h=3.55;
drawFrame(s3, r_x, r_y, r_w, r_h, C.power);
s3.addText("Agent 的强力体现", { x:r_x+0.30, y:r_y+0.30, w:r_w-0.55, h:0.40, fontSize:16, bold:true, fontFace:"Calibri", color:C.ink, align:"left", margin:0 });
s3.addText("人不可能做 → agent 整夜做完", { x:r_x+0.30, y:r_y+0.72, w:r_w-0.55, h:0.30, fontSize:11, italic:true, fontFace:"Calibri", color:C.power, align:"left", margin:0 });
s3.addShape(pres.shapes.LINE, { x:r_x+0.30, y:r_y+1.10, w:r_w-0.55, h:0, line:{color:C.faint, width:0.75} });

const power = [
  { tag:"体量",     value:"1000 题人工不可行 · agent 几小时跑完" },
  { tag:"速度",     value:"整夜连续跑 · 无需人盯着" },
  { tag:"闭环",     value:"测 → 修 → 再测，全自动 N 轮" },
  { tag:"可追溯",   value:"每轮 commit + diff 都在 git" },
  { tag:"边界发现", value:"Codex 主动构造极端 / 对抗 case" },
];
power.forEach((p, i)=>{
  const py = r_y + 1.25 + i*0.42;
  s3.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:r_x+0.30, y:py+0.04, w:0.95, h:0.28, fill:{color:C.powerSoft}, line:{color:C.power, width:0.8}, rectRadius:0.05 });
  s3.addText(p.tag, { x:r_x+0.30, y:py+0.04, w:0.95, h:0.28, fontSize:10, bold:true, fontFace:"Calibri", color:C.power, align:"center", valign:"middle", margin:0, charSpacing:1 });
  s3.addText(p.value, { x:r_x+1.30, y:py, w:r_w-1.55, h:0.36, fontSize:10.5, fontFace:"Calibri", color:C.body, align:"left", valign:"middle", margin:0 });
});

s3.addText([
  { text:"agent 的真正价值不是 ", options:{color:C.muted} },
  { text:"做得跟人一样", options:{italic:true, color:C.muted} },
  { text:" · 而是 ", options:{color:C.muted} },
  { text:"做人不可能做的体量", options:{bold:true, color:C.power} },
  { text:" — 这就是放大", options:{color:C.muted} },
], { x:0.5, y:5.15, w:9.0, h:0.35, fontSize:12, fontFace:"Calibri", align:"center", valign:"middle", margin:0 });

// ───────────── Save ─────────────
pres.writeFile({ fileName: "codex_cowork_3pages.pptx" })
    .then(f => console.log("OK ->", f));
