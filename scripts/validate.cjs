const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const ctx={module:{exports:{}},console};ctx.globalThis=ctx;
for(const name of ['bank.js','github-bank.js','engine.js'])vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../dist',name),'utf8'),ctx,{filename:name});
const b=ctx.PRACTICE_BANK,e=ctx.PRACTICE_ENGINE;
assert.equal(b.questions.length,265);assert.equal(b.questions.filter(q=>q.provenance==='github').length,117);assert.equal(b.questions.filter(q=>q.provenance==='public').length,8);assert.equal(b.questions.filter(q=>q.provenance==='original').length,140);
assert.equal(new Set(b.questions.map(q=>q.id)).size,265);
const githubCounts={verbal:26,quantity:8,sequence:20,data:32,logic:13,figure:16,spatial:2};
for(const [category,count] of Object.entries(githubCounts))assert.equal(b.questions.filter(q=>q.category===category&&q.provenance==='github').length,count);
const upstream=path.join(__dirname,'../research/upstream/BeiSen_Practice-'+b.githubSummary.commit);
const upstreamFile=path.join(upstream,'src/data/questions.js');
const upstreamLines=fs.existsSync(upstreamFile)?fs.readFileSync(upstreamFile,'utf8').split(/\r?\n/):null;
const usedImages=new Set();
const permutations=a=>a.length===0?[[]]:a.flatMap((v,i)=>permutations(a.filter((_,j)=>j!==i)).map(p=>[v,...p]));
function numberAnswer(q,value){const actual=parseFloat(q.options[q.answer]);const tolerance=q.options[q.answer].includes('%')?.051:.00051;assert(Math.abs(actual-value)<=tolerance,`${q.id}: ${actual} != ${value}`);}
let verified=0;
for(const q of b.questions){
 assert(q.options.length>=3&&q.options.length<=5,q.id);assert(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<q.options.length,q.id);
 assert.equal(new Set(q.options.map(o=>JSON.stringify(o))).size,q.options.length,`Duplicate option in ${q.id}`);
 assert(b.sources.some(s=>s.id===q.source));assert(q.explanation&&q.stem);assert(q.difficulty>=1&&q.difficulty<=3);assert(q.seconds>0);
 if(q.provenance==='github'){
  assert(q.sourceQuestionId&&q.reviewNote,q.id);assert(/^https:\/\/github.com\/.+\/blob\/[a-f0-9]{40}\//.test(q.sourceUrl),q.id);
  if(q.source==='ghBeisen'){const line=Number(q.sourceUrl.split('#L')[1]);assert(Number.isInteger(line)&&line>0,q.id+' source line');if(upstreamLines)assert(upstreamLines[line-1].includes('"id": "'+q.sourceQuestionId+'"'),q.id+' source line');}
 }
 for(const im of [...(q.images||[]),...q.options.filter(o=>o&&o.kind==='image')]){
  assert(im.width>0&&im.height>0);assert(/^question-bank\/[a-zA-Z0-9_.-]+\.jpg$/.test(im.file));
  const local=fs.readFileSync(path.join(__dirname,'../dist',im.file));assert(local.length>0,q.id+' image exists');
  const originalPath=path.join(upstream,'public',im.file);if(upstreamLines){assert(local.equals(fs.readFileSync(originalPath)),q.id+' original image bytes');}usedImages.add(im.file);
  if(im.crop){const [x,y,w,h]=im.crop;assert(x>=0&&y>=0&&w>0&&h>0&&x+w<=im.width&&y+h<=im.height+.0001,q.id+' crop bounds');}
 }
 if(q.expectedText)assert.equal(q.options[q.answer],q.expectedText,q.id);
 const c=q.check;if(!c)continue;verified++;
 switch(c.type){
 case 'base':numberAnswer(q,c.current*100/(100+c.rate));break;
 case 'work':numberAnswer(q,1/(1/c.a+1/c.b));break;
 case 'meet':numberAnswer(q,c.distance/(c.v1+c.v2));break;
 case 'prob':{const balls=Array.from({length:c.red+c.blue},(_,i)=>i<c.red);let total=0,good=0;for(let i=0;i<balls.length;i++)for(let j=i+1;j<balls.length;j++){total++;if(balls[i]&&balls[j])good++;}numberAnswer(q,good/total*100);break;}
 case 'mix':{const mass=parseFloat(q.options[q.answer]);assert(Math.abs((mass*c.high+(c.total-mass)*c.low)/c.total-c.target)<.001);break;}
 case 'permutation':{const people=Array.from({length:c.n},(_,i)=>i);numberAnswer(q,people.flatMap(i=>people.filter(j=>j!==i)).length);break;}
 case 'weighted':{const samples=[...Array(c.nA).fill(c.price),...Array(c.nB).fill(c.price+6)];numberAnswer(q,samples.reduce((s,x)=>s+x,0)/samples.length);break;}
 case 'arithmetic':numberAnswer(q,c.start+5*c.diff);break;
 case 'difference':{const next=parseFloat(q.options[q.answer]);const all=[...c.arr,next],ds=all.slice(1).map((v,i)=>v-all[i]);assert(ds.slice(1).every((v,i)=>v-ds[i]===c.step));break;}
 case 'recurrence':{const all=[...c.arr,parseFloat(q.options[q.answer])];assert(all.slice(1).every((v,i)=>v-all[i]*c.r===c.offset));break;}
 case 'interleave':numberAnswer(q,c.odd+3*3);break;
 case 'power':numberAnswer(q,6*6+c.off);break;
 case 'sum':numberAnswer(q,c.rows.map(r=>r[2]).reduce((a,b)=>a+b));break;
 case 'growth':numberAnswer(q,(c.row[2]/c.row[1]-1)*100);break;
 case 'share':numberAnswer(q,c.rows[c.index][2]/c.rows.reduce((s,r)=>s+r[2],0)*100);break;
 case 'totalGrowth':numberAnswer(q,(c.rows.reduce((s,r)=>s+r[2],0)/c.rows.reduce((s,r)=>s+r[1],0)-1)*100);break;
 case 'order':{const [a,bb,cc,d]=c.names;const valid=permutations(c.names).filter(p=>p[0]===a&&p.indexOf(bb)+1===p.indexOf(cc)&&p[3]!==d);assert.equal(valid.length,1);assert.equal(q.options[q.answer],valid[0][3]);break;}
 case 'truth':{const [a,bb]=c.people;const valid=c.people.filter(winner=>[winner===bb,winner!==bb,winner!==a].filter(Boolean).length===1);assert.equal(valid.length,1);assert.equal(q.options[q.answer],valid[0]);break;}
 case 'rotation':assert.equal(q.options[q.answer].angle,c.angle);break;
 case 'dots':assert.equal(q.options[q.answer].count,c.count);break;
 case 'xor':{const actual=q.options[q.answer].cells;assert(actual.every((v,i)=>v===(c.a[i]!==c.b[i]?1:0)));break;}
 case 'move':assert.equal(q.options[q.answer].position,c.position);break;
 case 'matrix':assert.equal(q.options[q.answer].count,q.matrix[1][0].count+q.matrix[1][1].count);break;
 case 'gridRotate':{const before=[[c.cells[0],c.cells[1]],[c.cells[2],c.cells[3]]];const rotated=[];for(let y=0;y<2;y++)for(let x=0;x<2;x++)rotated.push(before[1-x][y]);assert.deepEqual(Array.from(q.options[q.answer].cells),rotated);break;}
 case 'paint':{let count=0;for(let x=0;x<c.n;x++)for(let y=0;y<c.n;y++)for(let z=0;z<c.n;z++)if([x,y,z].filter(v=>v===0||v===c.n-1).length===2)count++;numberAnswer(q,count);break;}
 case 'front':{const highest=[];for(let col=0;col<3;col++){let max=0;for(let row=0;row<3;row++)max=Math.max(max,c.heights[row][col]);highest.push(max);}assert.equal(q.options[q.answer],highest.join('，'));break;}
 case 'netOpposite':case 'netAdjacent':{
  const coords=[[1,0],[0,1],[1,1],[2,1],[1,2],[1,3]],neg=a=>a.map(v=>-v),frames=new Map([[2,{r:[1,0,0],d:[0,1,0],n:[0,0,1]}]]),todo=[2];
  while(todo.length){const id=todo.shift(),p=coords[id],f=frames.get(id);coords.forEach((pp,j)=>{const dx=pp[0]-p[0],dy=pp[1]-p[1];if(Math.abs(dx)+Math.abs(dy)!==1||frames.has(j))return;const nf=dx===1?{r:neg(f.n),d:f.d,n:f.r}:dx===-1?{r:f.n,d:f.d,n:neg(f.r)}:dy===1?{r:f.r,d:neg(f.n),n:f.d}:{r:f.r,d:f.n,n:neg(f.d)};frames.set(j,nf);todo.push(j);});}
  assert.equal(new Set([...frames.values()].map(f=>f.n.join(','))).size,6);
  const opposite=(a,bb)=>frames.get(a).n.every((v,i)=>v===-frames.get(bb).n[i]);
  if(c.type==='netOpposite'){const j=c.labels.indexOf(q.options[q.answer]);assert(opposite(c.target,j));}else{const [a,bb]=q.options[q.answer].split(' 与 ').map(v=>c.labels.indexOf(v));assert(opposite(a,bb));}break;
 }
 case 'publicSequence':{const nums=c.seq.split('，').map(Number),next=parseFloat(q.options[q.answer]);const independent={
 '3，6，11，18，27':()=>27+(9+2),
 '1，4，9，16，25':()=>Math.pow(Math.sqrt(25)+1,2),
 '1，2，6，24，120':()=>Array.from({length:6},(_,i)=>i+1).reduce((a,b)=>a*b,1),
 '34，41，46，56，67':()=>67+String(67).split('').reduce((s,d)=>s+Number(d),0),
 '6，62，214':()=>Math.pow(8,3)-2,
 '0，16，8，12，10':()=>nums.slice(-2).reduce((s,n)=>s+n)/2,
 '3，10，29，66':()=>125+2};assert.equal(next,independent[c.seq]());break;}
 default:throw Error('Unknown check: '+c.type);
 }
}
// GitHub 数量题的独立数值/枚举检查，避免直接信任 OCR 参考答案。
const githubQuestion=id=>{const q=b.questions.find(q=>q.id===id);assert(q,id);return q;};
numberAnswer(githubQuestion('gh-gd-01025'),(20*5-20*.5)/25);
let schedules=0;for(let a=1;a<=7;a++)for(let bb=a+2;bb<=7;bb++)for(let c=bb+2;c<=7;c++)schedules++;
numberAnswer(githubQuestion('gh-gd-01027'),schedules);
const feasibleScores=[];for(let bb=1;bb<100;bb++){const scores=[100-bb,bb,96-bb,bb-16];if(scores.every(s=>s>0)&&scores.slice(1).every((s,i)=>s<scores[i]))feasibleScores.push(scores);}
assert.equal(feasibleScores.length,1);numberAnswer(githubQuestion('gh-gd-01028'),feasibleScores[0][3]);
const costs=permutations([4,6,7,8]).map(tasks=>{let wait=0,total=0;for(const t of tasks){total+=wait;wait+=t;}return total*100;});
numberAnswer(githubQuestion('gh-gd-01029'),Math.min(...costs));
const position=(v,t,L)=>{const s=v*t%(2*L);return s<=L?s:2*L-s;};
const firstCatch=2*200/(140-100),secondCatch=firstCatch*2;
assert.equal(position(140,firstCatch,200),200);assert.equal(position(100,firstCatch,200),200);
assert.equal(position(140,secondCatch,200),position(100,secondCatch,200));numberAnswer(githubQuestion('gh-gd-01030'),position(140,secondCatch,200));
const seatQ=githubQuestion('gh-notes-syllabus-2');const probability=7/39*100;assert(probability>15&&probability<20);assert.equal(seatQ.answer,1);
const rankQ=githubQuestion('gh-notes-syllabus-3');const x=50,dd=x-6.5,ww=x+3.5;assert.equal((dd+ww)/2,dd+5);assert.equal((x+2)-(x+dd+ww)/3,3);assert(ww>x&&x>dd);assert.equal(rankQ.options[rankQ.answer],'戊>丙>丁');
const populations=[];for(let n=71;n<80;n++)if(Number.isInteger(n*.96)&&Number.isInteger(n*.2))populations.push(n);
assert.equal(populations.length,1);const n=populations[0],teaching=n*.2;numberAnswer(githubQuestion('gh-notes-syllabus-4'),n*.96-teaching-(teaching+2)-(teaching-1));
const seats=permutations(['教育','住建','交通','农业','人社','财政']).filter(p=>p.indexOf('财政')===p.indexOf('人社')+1&&p.indexOf('住建')>p.indexOf('财政')+1&&Math.abs(p.indexOf('教育')-p.indexOf('交通'))===2&&Math.abs(p.indexOf('农业')-p.indexOf('财政'))===1);
assert(seats.length>0);const universallyTrue=[p=>p.indexOf('教育')===3,p=>p.indexOf('住建')===4,p=>p.indexOf('交通')===2,p=>p.indexOf('人社')===1].map(fn=>seats.every(fn));assert.equal(universallyTrue.filter(Boolean).length,1);assert.equal(githubQuestion('gh-gd-01047').answer,universallyTrue.indexOf(true));
const implies=(a,bb)=>!a||bb,visitCases=[];for(const technology of [false,true])for(const culture of [false,true])for(const museum of [false,true])for(const art of [false,true])if(!(culture&&museum)&&(art||culture)&&!art)visitCases.push({technology,museum});
const additionalRules=[x=>implies(!x.technology,x.museum),x=>implies(x.museum,!x.technology),x=>implies(!x.technology,!x.museum),x=>implies(x.museum,!x.technology)];
const sufficient=additionalRules.map(rule=>{const allowed=visitCases.filter(rule);return allowed.length>0&&allowed.every(x=>x.technology);});assert.equal(sufficient.filter(Boolean).length,1);assert.equal(githubQuestion('gh-gd-01039').answer,sufficient.indexOf(true));
const githubMathAndEnumerationChecks=10;
// 独立验证分母、漏答、筛选、组内去重和按类别均衡抽题。
const sample=b.questions.slice(0,4),answers={[sample[0].id]:sample[0].answer,[sample[1].id]:sample[1].answer,[sample[2].id]:(sample[2].answer+1)%sample[2].options.length};
const result=e.assess(sample,answers,{},100);assert.equal(result.score,50);assert.equal(result.accuracy,50);assert.equal(result.answeredAccuracy,66.7);assert.equal(result.completion,75);assert.equal(result.skipped,1);assert.equal(result.incorrect,1);assert.equal(e.assess([],{}).score,0);assert.equal(e.assess(sample,{}).skipped,4);
for(let i=0;i<100;i++){
 const set=e.selectQuestions(b.questions,{category:'all',count:28});assert.equal(set.length,28);assert.equal(new Set(set.map(q=>q.id)).size,28);for(const c of b.categories)assert.equal(set.filter(q=>q.category===c.id).length,4);
 const github=e.selectQuestions(b.questions,{category:'all',provenance:'github',count:28});assert.equal(github.length,28);assert.equal(new Set(github.map(q=>q.id)).size,28);assert(github.every(q=>q.provenance==='github'));assert.equal(github.filter(q=>q.category==='spatial').length,2);for(const c of b.categories)assert(github.filter(q=>q.category===c.id).length>=2);
}
assert.equal(usedImages.size,66);
assert.equal(e.selectQuestions(b.questions,{category:'all',provenance:'github',count:'all'}).length,117);
const restricted=e.selectQuestions(b.questions,{category:'figure',difficulty:3,provenance:'original',count:35});assert(restricted.every(q=>q.category==='figure'&&q.difficulty===3&&q.provenance==='original'));
assert.equal(e.selectQuestions(b.questions,{category:'all',provenance:'public',count:35}).length,8);assert.equal(e.selectQuestions(b.questions,{category:'verbal',provenance:'public',count:7}).length,0);
const offlinePath=path.join(__dirname,'../北森测评练习.html');
let offline=null;
if(fs.existsSync(offlinePath)){
 const html=fs.readFileSync(offlinePath,'utf8');
 const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
 assert.equal(scripts.length,4);for(const s of scripts)new vm.Script(s[1]);
 assert(!html.includes('src="bank.js"')&&!html.includes('src="github-bank.js"')&&!html.includes('src="engine.js"')&&!html.includes('src="app.js"')&&!html.includes('href="styles.css"'));
 const offlineBank={window:{}};for(const s of scripts.slice(0,3))vm.runInNewContext(s[1],offlineBank);
 assert.equal(offlineBank.window.PRACTICE_BANK.questions.length,265);assert.equal(Object.keys(offlineBank.window.PRACTICE_IMAGES).length,66);
 for(const file of usedImages)assert.equal(offlineBank.window.PRACTICE_IMAGES[file],'data:image/jpeg;base64,'+fs.readFileSync(path.join(__dirname,'../dist',file)).toString('base64'));
 offline={inlineScripts:4,embeddedImages:66,syntax:'passed',standalone:true};
}
console.log(JSON.stringify({status:'passed',questions:265,githubQuestions:117,githubCounts,formulaAndEnumerationChecks:verified,githubMathAndEnumerationChecks,sourceCount:b.sources.length,randomizedBalancedSets:200,scoring:'correct, wrong and skipped verified',images:66,upstreamCrossCheck:upstreamLines?'source lines and original image bytes verified':'not run: optional upstream snapshot is absent',sourceLinks:'fixed commits and positive line numbers verified',offline}));
