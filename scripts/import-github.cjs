// Parse data as JSON; never execute downloaded repository JavaScript.
const fs=require('node:fs'),path=require('node:path');
const project=path.resolve(__dirname,'..'),research=path.join(project,'research');
const plan=JSON.parse(fs.readFileSync(path.join(research,'curation.json'),'utf8'));
const reviews=JSON.parse(fs.readFileSync(path.join(research,'reviewed-explanations.json'),'utf8'));
const upstream=path.join(research,'upstream','BeiSen_Practice-'+plan.upstream.commit);
const raw=fs.readFileSync(path.join(upstream,'src/data/questions.js'),'utf8');
const input=raw.split(/\r?\n/).filter(l=>l.trim().startsWith('{"id":')).map(l=>JSON.parse(l.trim().replace(/,$/,'')));
const imageDir=path.join(upstream,'public/question-bank'),outDir=path.join(project,'dist/question-bank');
fs.mkdirSync(outDir,{recursive:true});
const imageNames=new Set();
function imageInfo(filename){
 const bytes=fs.readFileSync(path.join(imageDir,filename));
 // JPEG SOF dimensions, independent of image library availability.
 let width,height;for(let i=2;i<bytes.length-9;){if(bytes[i]!==0xff){i++;continue;}const marker=bytes[i+1];if(marker===0xd8||marker===0xd9){i+=2;continue;}const len=bytes.readUInt16BE(i+2);if([0xc0,0xc1,0xc2,0xc3].includes(marker)){height=bytes.readUInt16BE(i+5);width=bytes.readUInt16BE(i+7);break;}i+=2+len;}
 if(!width||!height)throw Error('Invalid JPEG '+filename);
 imageNames.add(filename);return {kind:'image',file:'question-bank/'+filename,width,height};
}
const prefixes={verbal:'v',data:'d',figure:'g',spatial:'g'},result=[];
const stemStarts={9:'Y 公司',13:'2019 年',22:'企业公布',25:'国内服装',26:'下表是 AMA',30:'2017 年',31:'对于广告'};
for(const [category,selected] of Object.entries(plan.selections))for(const n of selected){
 if(!reviews[category][n])continue;
 const item=input.find(q=>q.id===prefixes[category]+'-'+n);if(!item)throw Error('Missing '+category+n);
 const keys=Object.keys(item.options).filter(k=>item.options[k].trim());
 let stem=item.stem;
 if(category==='data'&&stemStarts[n]){const i=stem.indexOf(stemStarts[n]);if(i<0)throw Error('Missing expected stem');stem=stem.slice(i);}
 stem=stem.replace('人均差值','人均产值').replace('80 万量','80 万辆').replace('口端午节','端午节');
 const q={id:'gh-bs-'+item.id,category,tag:item.tag,stem,options:keys.map(k=>item.options[k].replace('口端午节','端午节')),answer:keys.indexOf(item.answer),explanation:reviews[category][n],source:'ghBeisen',provenance:'github',difficulty:category==='data'?2:category==='figure'?2:1,seconds:category==='data'?100:category==='spatial'?100:80,sourceQuestionId:item.id,sourceUrl:'https://github.com/'+plan.upstream.repository+'/blob/'+plan.upstream.commit+'/src/data/questions.js#L'+(raw.split(/\r?\n/).findIndex(l=>l.includes('"id": "'+item.id+'"'))+1),reviewNote:'保留原题条件与选项，解析已复核。整理/OCR 修正不改变题目条件。'+(['figure','spatial'].includes(category)?' 原图按选项顺序拆分展示。':'')};
 if(category==='figure'||category==='spatial'){
  const count=[5,7].includes(n)?5:4,onlyOptions=n===20;
  const opt=imageInfo(item.images[onlyOptions?0:1]);
  const width=n===1?67:opt.width;
  q.options=Array.from({length:count},(_,i)=>({...opt,crop:[0,opt.height*i/count,width,opt.height/count],alt:'原题选项 '+'ABCDE'[i]}));
  q.answer='ABCDE'.indexOf(item.answer);q.tag=category==='spatial'?(n===16?'平面拼合':'翻折变换'):item.tag;
  if(!onlyOptions)q.images=[{...imageInfo(item.images[0]),alt:'原题题干图'}];
 }else if(item.images?.length&&n!==30)q.images=item.images.map(f=>({...imageInfo(f),alt:'原题统计图表'}));
 if(q.answer<0||q.answer>=q.options.length)throw Error('Bad answer '+q.id);
 result.push(q);
}
// The notes contain explicit exercise blocks. Retain original stems/options,
// replace long or mistaken explanations with independently checked concise ones.
const notes=fs.readFileSync(path.join(research,'notes-multiple.mdx'),'utf8');
const blocks=notes.split(/^#### /m).slice(1), explanations=[
 '奇数项每次乘 2，偶数项每次乘 3。第八项属于偶数列，18×3=54。',
 '奇数项每次加 2，偶数项每次减 2。第八项为 22−2=20。',
 '两项一组，后一项除以前一项依次为 1、2、3、4、5，最后一项=2×5=10。',
 '两项一组，每组乘积都是 120，缺项为 120÷15=8 和 120÷10=12。',
 '三项一组，前两项的差为第三项，17−5=12。',
 '奇数项 2、4、16、？依次乘 2、4、6，得到 96；偶数项依次乘 3、5、7 得 315。原解析多次试探失败的步骤已移除。',
 '偶数项 6、7、8、9；奇数项 1、5、2、6 依次加4、减3、加4，下项减3得 3。',
 '奇数项每次加2；偶数项每次减5，下一个偶数项=168−5=163。',
 '奇数项 12、14、16，下一项 18；偶数项 10、13、16，下一项 19。',
 '两项一组，各组乘积为120，4×？=120，得30。',
 '两项一组，组内差分别40、30、20、10，50−？=10，得40。',
 '奇数项 2、9、20、35 的相邻差7、11、15每次加4，下一差19，35+19=54。偶数列也符合差分。',
 '三项一组，前两项乘积为第三项，5×8=40。',
 '三项一组，第一项+第二项平方=第三项，5+6²=41。',
 '奇数项 5、8、12、17 差为3、4、5，下一差6，17+6=23。',
 '加号前按1、2交替，加号后按3、2、1循环，下一项的形式为1+3。',
 '正负号交替；整数绝对值每次减18得9；小数点后两位每次加2得11，所以−9.11。',
 '',
 '第一个 ln 内的数依次乘2得64；第二个 ln 内的数差为5、7、9、11、13，缺项24+11=35。',
 '将3写成2+√1，将9写成7+√4；整数部分2、3、5、7、11、13是质数，根号内依次1–6，所以11+√5。'
];
for(let i=0;i<blocks.length;i++){
 if(!explanations[i])continue;
 const block=blocks[i],first=block.split('<BlurredAnswer>')[0],opts=[...first.matchAll(/^- ([A-D])[.、]\s*(.+)$/gm)];
 const answer=block.match(/\*\*答案：([A-D])\*\*/)?.[1];if(opts.length!==4||!answer)throw Error('Invalid notes block '+i);
 const clean=t=>t.replace(/<[^>]+>/g,'').replace(/\$+/g,'').replace(/\\sqrt\{(\d+)\}/g,'√$1').trim();
 const stem=clean(first.split('\n').slice(2).filter(l=>!l.startsWith('- ')).join('\n'));
 result.push({id:'gh-notes-seq-'+(i+1),category:'sequence',tag:i<7?'多重数列':'分组与交叉',stem:'按常见简洁规律补全：'+stem,options:opts.map(m=>clean(m[2])),answer:'ABCD'.indexOf(answer),explanation:explanations[i],source:'ghNotes',provenance:'github',difficulty:i<5?1:2,seconds:70,sourceQuestionId:first.split('\n')[0].trim(),sourceUrl:'https://github.com/SiriusFHJ/ShangAnNotes/blob/79cb922828e13bf8aaa44b9716e14a668400ef41/src/pages/math/number/multiple.mdx',reviewNote:'通用数字推理公开练习，未认证为北森实考；保留题干和选项，解析独立复核。'});
}
result.push(...JSON.parse(fs.readFileSync(path.join(research,'supplement-questions.json'),'utf8')));
const syllabusSource='https://github.com/SiriusFHJ/ShangAnNotes/blob/79cb922828e13bf8aaa44b9716e14a668400ef41/src/lib/prepare/syllabus.mdx';
const syllabus=[
 ['sequence','等比数列','1，2，4，8，16，（ ）',['16','24','32','36'],2,'每次乘2，16×2=32。'],
 ['quantity','随机入座概率','某单位的会议室有5排共40个座位，每排座位数相同。小张和小李随机入座，则他们坐在同一排的概率：',['不高于15%','高于15%但低于20%','正好为20%','高于20%'],1,'固定小张座位，剩余39个座位中同排有7个，概率7/39≈17.95%，介于15%和20%之间。'],
 ['quantity','平均数方程','甲、乙、丙、丁、戊5名职工参加党史知识测验，每人得分均不相同。甲和乙的平均分比丙多2分，丁和戊的平均分比丁多5分，甲、乙的平均分比丙、丁、戊的平均分多3分。问丙、丁、戊三人得分的排序为：',['丙>丁>戊','丙>戊>丁','丁>丙>戊','戊>丙>丁'],3,'设丙=x，则丁+戊=2x−3，戊−丁=10。解得戊=x+3.5、丁=x−6.5，所以戊>丙>丁。'],
 ['quantity','人数与比例','高校某专业70多名毕业生中，有96%在毕业后去西部省区支援国家建设。其中去偏远中小学支教的毕业生占该专业毕业生总数的20%，比任职大学生村官的毕业生少2人，比在西部地区参军入伍的毕业生多1人，其余的毕业生选择去国有企业西部边远岗位工作。问去国有企业西部边远岗位工作的毕业生有多少人？',['23','26','29','32'],1,'总数乘96%须为整数，所以是25的倍数，70多只能是75。去西部72人，支教15、村官17、参军14，国企=72−15−17−14=26。']
];
syllabus.forEach(([category,tag,stem,options,answer,explanation],i)=>result.push({id:'gh-notes-syllabus-'+(i+1),category,tag,stem,options,answer,explanation,source:'ghSyllabus',provenance:'github',difficulty:2,seconds:90,sourceQuestionId:'数量关系示例 '+i,sourceUrl:syllabusSource,reviewNote:'GitHub 保存的通用能力考试大纲示例；不标注为北森原题。'}));
for(const name of imageNames)fs.copyFileSync(path.join(imageDir,name),path.join(outDir,name));
const sources=[
 {id:'ghBeisen',title:'GitHub · Liqing-Lin/BeiSen_Practice',url:'https://github.com/Liqing-Lin/BeiSen_Practice/tree/'+plan.upstream.commit,kind:'北森相关公开整理题库',note:'原仓库汇总《2024北森测评题库整理》445题，本工具筛入76题，保留条件、数值与原图，解析复核后编写。已排除缺选项、题图错配、统计交集误算等题。第三方整理来源，未获北森官方认证。仓库未附许可证，不将其视为官方授权资料。',checked:plan.checked},
 {id:'ghNotes',title:'GitHub · ShangAnNotes / 多重数列',url:'https://github.com/SiriusFHJ/ShangAnNotes/blob/79cb922828e13bf8aaa44b9716e14a668400ef41/src/pages/math/number/multiple.mdx',kind:'通用数字推理补充',note:'收录19道原有例题/练习，排除不能唯一排除另一选项的小数练习11。保留数列和选项，独立核算答案并精简解析；并非北森专属题。',checked:plan.checked},
 {id:'ghGuangdong',title:'GitHub · daily-gongkao-skill / 广东2026回忆版',url:'https://github.com/yangj557/daily-gongkao-skill/tree/main/data/ocr_question_bank',kind:'通用数量与逻辑补充',note:'原文件标注OCR草稿。本工具仅选18道无图、条件完整的题（数量5、逻辑13），逐题审阅并独立核算。保留题干与选项，不使用原仓库脚本或性格策略。不是北森专用实考题。',checked:plan.checked},
 {id:'ghSyllabus',title:'GitHub · ShangAnNotes / 考试大纲示例',url:syllabusSource,kind:'通用数量与数列补充',note:'收录数量关系示例4题（数学运算3、数字推理1），保留题干和选项。概率、方程与人数约束独立复核，不宣称北森真题。',checked:plan.checked},
 {id:'ghIndex',title:'GitHub · 2024北森测评题库整理分享',url:'https://github.com/youmenl0769/2024beisencepingtikuzhenglifenxiang',kind:'资料线索 · 未收题',note:'实查仓库只有README及网盘链接，没有直接可核对的题干和答案，未纳入可计分题库。',checked:plan.checked},
 {id:'ghMatcher',title:'GitHub · fk_beisen 来源追溯',url:'https://github.com/Ian010529/fk_beisen',kind:'来源线索 · 未使用程序',note:'README指向Liqing-Lin/BeiSen_Practice作为题库来源。本工具只沿来源链接核查，不安装扩展、不连接正式测评页面、不使用性格题。',checked:plan.checked}
];
const output='(function(root){\n"use strict";\nconst bank=root.PRACTICE_BANK;\nbank.questions.unshift(...'+JSON.stringify(result)+');\nbank.sources.unshift(...'+JSON.stringify(sources)+');\nbank.githubSummary='+JSON.stringify({total:result.length,primary:76,images:imageNames.size,commit:plan.upstream.commit})+';\n})(typeof window!=="undefined"?window:globalThis);\n';
fs.writeFileSync(path.join(project,'dist/github-bank.js'),output);
console.log(JSON.stringify({githubQuestions:result.length,categories:result.reduce((a,q)=>{a[q.category]=(a[q.category]||0)+1;return a;},{}),images:imageNames.size}));
