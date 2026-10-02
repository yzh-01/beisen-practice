(function(root){
'use strict';
function shuffle(list,rng=Math.random){const a=[...list];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function selectQuestions(bank,config,rng=Math.random){
 const candidates=bank.filter(q=>(config.category==='all'||q.category===config.category)&&(!config.difficulty||q.difficulty===Number(config.difficulty))&&(!config.provenance||q.provenance===config.provenance));
 const n=Math.min(config.count==='all'?candidates.length:Number(config.count),candidates.length);
 const groups=new Map();shuffle(candidates,rng).forEach(q=>{if(!groups.has(q.category))groups.set(q.category,[]);groups.get(q.category).push(q);});
 const output=[];const cats=shuffle([...groups.keys()],rng);while(output.length<n){for(const cat of cats){const group=groups.get(cat);if(group.length&&output.length<n)output.push(group.pop());}if(!cats.some(c=>groups.get(c).length))break;}
 return shuffle(output,rng);
}
function assess(questions,answers,times={},elapsed=0){
 const rows=questions.map(q=>({id:q.id,category:q.category,tag:q.tag,answer:answers[q.id]??null,correct:answers[q.id]===q.answer,skipped:answers[q.id]===undefined||answers[q.id]===null,seconds:Math.max(0,times[q.id]||0),target:q.seconds}));
 const total=rows.length,correct=rows.filter(r=>r.correct).length,answered=rows.filter(r=>!r.skipped).length;
 const pct=(a,b)=>b?Math.round(a/b*1000)/10:0;
 const dimensions=[...new Set(rows.map(r=>r.category))].map(category=>{const rs=rows.filter(r=>r.category===category);const n=rs.length,c=rs.filter(r=>r.correct).length,a=rs.filter(r=>!r.skipped).length;return {category,total:n,correct:c,answered:a,skipped:n-a,accuracy:pct(c,n),averageSeconds:rs.reduce((s,r)=>s+r.seconds,0)/n,slow:rs.filter(r=>r.seconds>r.target).length};});
 return {total,correct,answered,skipped:total-answered,incorrect:answered-correct,accuracy:pct(correct,total),answeredAccuracy:pct(correct,answered),completion:pct(answered,total),score:pct(correct,total),elapsed:Math.max(0,elapsed),dimensions,rows};
}
root.PRACTICE_ENGINE={shuffle,selectQuestions,assess};if(typeof module!=='undefined'&&module.exports)module.exports=root.PRACTICE_ENGINE;
})(typeof window!=='undefined'?window:globalThis);
