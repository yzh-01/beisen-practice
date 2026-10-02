(function(root){
'use strict';
const sources=[
 {id:'cata',title:'北森 CATA 官方产品介绍',url:'https://www.beisen.com/product/evaluation/cata/',kind:'官方题型依据',note:'确认言语、数学、逻辑推理、空间能力四个维度；页面介绍自适应抽题。它不提供本工具题目的原题或答案。',checked:'2026-10-02'},
 {id:'irt',title:'北森：能力测验 CATA 背后的五大关键环节',url:'https://www.beisen.com/res/324.html',kind:'官方计分依据',note:'介绍 IRT 双参数模型和题目参数估计。说明官方能力值不能由简单正确率直接换算。',checked:'2026-10-02'},
 {id:'manual',title:'西北农林科技大学公开《人员素质测评实验指导书》',url:'https://ch.nwafu.edu.cn/docs/20190625113824467756.pdf',kind:'高校公开资料',note:'已下载并核对 PDF 第 17–29 页，包含图形、思维策略、空间、数字、言语、数学及资料分析能力测验介绍。历史资料只用于题型参考，未发现可收录的能力题原题。',checked:'2026-10-02'},
 {id:'publicA',title:'百度文库公开预览：2026 年北森测评模拟试题及答案',url:'https://wenku.baidu.com/view/63644825c87931b765ce0508763231126edb7700.html',kind:'第三方公开模拟样题',note:'仅整理公开预览中的数列与集合推理各 1 题；无法验证为北森实考题。选项经整理，解析为本工具独立编写。',checked:'2026-10-02'},
 {id:'publicB',title:'百度文库公开预览：2026 年北森认知能力测试题及答案',url:'https://wenku.baidu.com/view/1c99a9645d0102020740be1e650e52ea5518cef0.html',kind:'第三方公开模拟样题',note:'整理平方数列和阶乘数列各 1 题，答案独立核算。页面其他解析存在算式错误，未直接沿用其解析；真实性未经官方认证。',checked:'2026-10-02'},
 {id:'publicC',title:'公开题库预览：EPI 综合能力数字推理精选',url:'https://www.yeyulingfeng.com/wendang/8838.html',kind:'第三方公开模拟样题',note:'整理数位和递推与幂次递推各 1 题；属于通用能力训练，不能认证为北森实考题。',checked:'2026-10-02'},
 {id:'publicD',title:'Scribd 公开预览：数字推理精选 320 道',url:'https://www.scribd.com/document/1056935096/北森-数字推理题-精选320道题加解析',kind:'第三方公开模拟样题',note:'整理相邻均值递推与立方修正数列各 1 题，独立编写解析。用户上传资料的实考来源不可验证。',checked:'2026-10-02'},
 {id:'original',title:'本工具原创能力训练题',url:null,kind:'原创训练题',note:'按已核实的能力维度设计。计算类题目以公式或枚举复核；言语题仅依题干判断。难度与建议时长为练习标签，没有官方常模或心理测量参数。',checked:'2026-10-02'}
];
const categories=[
 {id:'verbal',name:'言语理解',dimension:'言语能力',icon:'Aa',brief:'主旨 · 细节 · 推断 · 语句排序',tip:'先读设问，再圈出转折、限制条件和结论。区分“材料没有说”与“材料否定”，不要用常识补足证据。',target:70},
 {id:'quantity',name:'数量关系',dimension:'数学能力',icon:'x²',brief:'比例 · 工程 · 概率 · 排列组合',tip:'先明确单位与未知量，再列式。优先掌握增长率、效率相加、加权平均与分步计数，最后核对数量级。',target:90},
 {id:'sequence',name:'数字推理',dimension:'逻辑推理',icon:'1 3 7',brief:'差分 · 交替 · 递推 · 幂次',tip:'按作差、作商、奇偶分组、递推的顺序检查。规则必须解释已有各项；数列答案按题设规则或常见简洁规律选取。',target:65},
 {id:'data',name:'资料分析',dimension:'数学能力',icon:'▥',brief:'增长率 · 占比 · 总量 · 加权',tip:'先核对年份、单位和分母。增长率用旧值作分母，占比用整体作分母；整体增长率不能简单平均各组增长率。',target:90},
 {id:'logic',name:'逻辑判断',dimension:'逻辑推理',icon:'∴',brief:'条件推理 · 真假 · 排序 · 论证',tip:'把“如果 A 则 B”写成 A⇒B，仅能反推非 B⇒非 A。排序题画位置表，真假题逐一代入，论证题找证据与结论之间的缺口。',target:75},
 {id:'figure',name:'图形推理',dimension:'逻辑推理',icon:'◇',brief:'旋转 · 数量 · 叠加 · 移动',tip:'一次只追踪一个特征：方向、数量、位置或填充。叠加题按对应格逐格比对，矩阵题同时检查行与列。',target:65},
 {id:'spatial',name:'空间推理',dimension:'空间能力',icon:'▱',brief:'折叠 · 相对面 · 旋转 · 三视图',tip:'折叠先找相对面，固定一个面再判断邻接。三视图按每个方向的最大高度读取；平面旋转保留相对距离，避免当成镜像。',target:85}
];
const qs=[];
function add(cat,tag,stem,options,answer,explanation,extra={}){
 const n=qs.filter(q=>q.category===cat).length+1;
 const c=categories.find(c=>c.id===cat);
 qs.push({id:cat+'-'+String(n).padStart(3,'0'),category:cat,tag,stem,options,answer,explanation,source:'original',provenance:'original',difficulty:1+((n-1)%3),seconds:c.target,...extra});
}
function numeric(cat,tag,stem,value,explanation,extra={}){
 const distractors=extra.distractors||[value*.8,value*1.2,value+7];
 const format=extra.format||((x)=>String(Number(x.toFixed(3))));
 const opts=[value,...distractors].map(format);
 const idx=qs.length%4;const v=opts.shift();opts.splice(idx,0,v);
 const clean={...extra};delete clean.distractors;delete clean.format;
 add(cat,tag,stem,opts,idx,explanation,{...clean,expectedText:format(value)});
}
// 20 道言语题：每道题以给定材料为全部判断依据。
const reading=[
 ['所有提交报销单的员工都必须附发票。小林提交了报销单。','小林必须附发票。',0,'材料规定提交报销单的人必须附发票，小林符合该条件，因此结论成立。'],
 ['试点团队的周平均沟通时长从 10 小时降到 7 小时，满意度保持不变。未调查其他团队。','新流程提升了全公司所有团队的满意度。',1,'试点团队满意度未变，已经构成“所有团队满意度提升”的反例。'],
 ['周五的访客只能从东门进入。今天是周五，小陈从东门进入。材料没有说明他是员工还是访客。','小陈一定是访客。',2,'访客必须走东门，不能反过来认定走东门的都是访客；员工也可能走东门。'],
 ['本季度总订单增长 20%，退款订单数增长 10%。总订单和退款订单的上季度数量均大于零。','本季度退款订单占总订单的比例低于上季度。',0,'新比例是原比例的 1.10÷1.20，系数小于 1，因此占比下降。'],
 ['甲产品售价保持不变，单位成本下降。甲产品本期与上期均有销售。','甲产品本期的总利润一定增加。',2,'单位利润提高，但销量未知，总利润可能增加也可能减少。'],
 ['该项目只有通过安全审核后才能上线。项目尚未通过安全审核。','该项目现在可以上线。',1,'通过审核是上线的必要条件，未通过时不满足上线要求。'],
 ['调查仅收集了 200 名主动填写问卷者的意见，其中 70% 希望延长营业时间。','全体顾客中恰有 70% 希望延长营业时间。',2,'主动填写的样本不等于全体顾客，不能将样本比例当成总体精确比例。'],
 ['服务台在工作日的 9:00 至 17:00 开放；周末全天关闭。某日是星期日。','服务台在该日 10:00 开放。',1,'星期日属于周末，材料明确周末全天关闭。']
];
reading.forEach(([passage,claim,answer,ex])=>add('verbal','材料推断',`只依据材料判断：${claim}`,['正确：材料支持','错误：与材料矛盾','无法判断：信息不足'],answer,ex,{passage}));
[
 ['远程协作减少了通勤时间，却也增加了协调成本。团队需要明确交付标准，并固定沟通节奏，才能更好地发挥这种方式的优势。','远程协作需要配套规则与沟通机制','远程办公必然比现场办公高效','通勤是团队绩效的唯一因素','所有团队应取消远程协作'],
 ['一项新技术在实验室中表现优秀，并不意味着它能立即投入生产。实际环境中的稳定性、维护成本和兼容性，都需要进一步验证。','技术落地需要验证实际环境下的可行性','实验室试验没有任何价值','维护成本决定所有技术是否成功','稳定性好的技术无需测试'],
 ['客户提出的需求可能是解决方法而非真正的问题。先了解目标和约束，再讨论方案，有助于避免交付一个能运行却不能解决问题的产品。','识别真实问题应先于确定解决方案','应直接满足客户提出的一切方案','能运行的产品一定能解决问题','客户不了解自己的目标'],
 ['平均处理时长下降，不代表每位客户都等得更短。如果少数复杂问题的等待时间明显增加，平均值仍可能改善，因此应同时观察分布。','评估服务效率应兼顾平均值与分布','平均值总是错误的','复杂问题越多服务越好','客户等待时间只能用平均值衡量']
].forEach(([passage,a,b,c,d])=>add('verbal','主旨概括','以下哪项最准确概括材料的主旨？',[a,b,c,d],0,'正确选项覆盖材料的核心论点与限制条件，其余选项将局部因素绝对化或与原文不符。',{passage}));
[
 ['本月共有 80 个工单，其中 50 个在当天完成，20 个在次日完成，其余在两天后完成。','有多少个工单在两天后完成？',['10 个','20 个','30 个','无法计算'],0,'80−50−20=10。材料已给出互不重叠的三个完成时段。'],
 ['培训通知：已报名且通过资格审核的人可参加。报名截止为周二 18:00，审核结果于周三公布。','关于参训条件，哪项与通知一致？',['报名就可直接参加','报名且审核通过才能参加','周三可以补报名','审核通过后无需报名'],1,'通知将报名与通过审核列为同时需要满足的条件。'],
 ['材料称该项目“可能减少重复录入”，但未给出实施后的数据。','材料对项目效果的态度是？',['已证实有效','明确认定无效','存在可能，尚未验证','效果一定持续改善'],2,'“可能”是保留性表达，不能改写为已证实、必然或无效。'],
 ['服务改版前后均调查 100 人，满意者分别为 60 人与 75 人。未给出个人前后意见对应关系。','以下哪项可直接得到？',['恰有 15 人由不满意转为满意','满意者比例提高了 15 个百分点','每个人都更加满意','改版是满意度提高的唯一原因'],1,'比例从 60% 到 75%，增加 15 个百分点；个人变化和因果关系无法由汇总数据确定。']
].forEach(([passage,stem,opts,a,ex])=>add('verbal','细节辨析',stem,opts,a,ex,{passage}));
[
 ['①据此制定改进方案。②首先收集用户反馈。③最后验证方案的效果。④接着识别反馈中的共性问题。',['②④①③','①②③④','③②①④','④①③②'],0,'先收集，再分析共性，再制定方案，最后验证。'],
 ['①问题解决后记录处理结果。②用户先提交工单。③工作人员根据分派处理问题。④系统随后将工单分派给负责人。',['②③④①','②④③①','④②①③','①③②④'],1,'工单先产生，然后分派，再处理，最后记录。'],
 ['①因此试验采用随机分组。②试验结束后比较两组的变化。③研究需要减少初始差异的影响。④分组后分别实施新旧方案。',['③①④②','①③②④','④②③①','②④①③'],0,'研究目标引出随机分组；分组后实施；结束后比较。'],
 ['①但单纯增加人手未必有效。②应先识别流程中的瓶颈。③任务积压时，人们常想到增派人员。④再针对瓶颈调整资源配置。',['③①②④','①④②③','②①③④','④③②①'],0,'先提出常见反应，“但”转折后引出更合理的处理顺序。']
].forEach(([passage,opts,a,ex])=>add('verbal','语句排序','按语义与指代关系排列下列语句。',opts,a,ex,{passage}));
// 20 道数量题，覆盖 7 种解法；参数供独立复核。
for(let k=0;k<4;k++){
 const base=400+k*100,rate=10+k*5;
 numeric('quantity','百分比还原',`某项本期数量为 ${base*(100+rate)/100}，比上期增长 ${rate}%。上期数量是多少？`,base,`上期=本期÷(1+增长率)=${base*(100+rate)/100}÷${1+rate/100}=${base}。`,{check:{type:'base',current:base*(100+rate)/100,rate},distractors:[base-50,base+50,base+100]});
 const a=10+k*2,b=a*3;
 numeric('quantity','工程效率',`甲单独完成任务需要 ${a} 天，乙需要 ${b} 天，两人同时工作且效率不变，完成任务需要多少天？`,a*b/(a+b),`将任务总量设为 1，合计日效率=1/${a}+1/${b}。时间=${a*b}÷${a+b}≈${(a*b/(a+b)).toFixed(3)} 天。`,{check:{type:'work',a,b},format:x=>Number(x.toFixed(3))+' 天',distractors:[a,a/2,b/2]});
 const distance=120+k*60,v1=40+k*10,v2=60+k*10;
 numeric('quantity','相遇问题',`两地相距 ${distance} 千米，两车同时相向行驶，速度分别为 ${v1}、${v2} 千米/小时。多久相遇？`,distance/(v1+v2),`相向运动的接近速度是 ${v1+v2} 千米/小时，时间=${distance}÷${v1+v2}≈${(distance/(v1+v2)).toFixed(3)} 小时。`,{check:{type:'meet',distance,v1,v2},format:x=>Number(x.toFixed(3))+' 小时',distractors:[distance/v1,distance/v2,distance/(v1+v2)+.5]});
}
for(let k=0;k<2;k++){
 const red=4+k*2,blue=7;
 numeric('quantity','不放回概率',`盒中有 ${red} 个红球、${blue} 个蓝球，随机不放回取两球。两球都为红球的概率约为多少？`,100*red/(red+blue)*(red-1)/(red+blue-1),`第一次取红球概率为 ${red}/${red+blue}，第二次为 ${red-1}/${red+blue-1}，相乘约 ${(100*red/(red+blue)*(red-1)/(red+blue-1)).toFixed(1)}%。`,{check:{type:'prob',red,blue},format:x=>x.toFixed(1)+'%',distractors:[100*red/(red+blue),100*(red/(red+blue))**2,100*blue/(red+blue)]});
 const low=10,high=30,total=100+k*100;
 numeric('quantity','混合浓度',`要把 10% 和 30% 的溶液混成 ${total} 克的 25% 溶液，无损耗。需要多少克 30% 的溶液？`,total*.75,`设高浓度溶液 x 克：0.30x+0.10(${total}−x)=0.25×${total}，解得 x=${total*.75} 克。`,{check:{type:'mix',low,high,target:25,total},distractors:[total*.25,total*.5,total]});
 const n=5+k;
 numeric('quantity','排列组合',`从 ${n} 名候选人中选出不同的 1 名组长和 1 名副组长，有多少种安排？`,n*(n-1),`两个职位有区别，先选组长 ${n} 种，再选副组长 ${n-1} 种，共 ${n}×${n-1}=${n*(n-1)}。`,{check:{type:'permutation',n},distractors:[n*(n-1)/2,n*n,n+n-1]});
 const price=12+k*3,nA=20+k*5,nB=10+k*5;
 numeric('quantity','平均数与总量',`甲组 ${nA} 人人均完成 ${price} 件，乙组 ${nB} 人人均完成 ${price+6} 件。两组合计人均完成多少件？`,(nA*price+nB*(price+6))/(nA+nB),`加权平均=(${nA}×${price}+${nB}×${price+6})÷(${nA}+${nB})≈${((nA*price+nB*(price+6))/(nA+nB)).toFixed(3)} 件。`,{check:{type:'weighted',nA,nB,price},distractors:[price+3,price,price+6]});
}
// 20 道原创数列：5 类规则，每类四题。
for(let k=0;k<4;k++){
 const start=2+k,diff=3+k,seq=Array.from({length:5},(_,i)=>start+diff*i);
 numeric('sequence','等差数列',`按等差规律补全：${seq.join('，')}，（ ）。`,start+diff*5,`相邻差值恒为 ${diff}，下一项=${seq[4]}+${diff}=${start+diff*5}。`,{check:{type:'arithmetic',start,diff},distractors:[start+diff*5-1,start+diff*5+diff,start+diff*4]});
 const d0=2+k,step=2,arr=[k+1];for(let i=0;i<4;i++)arr.push(arr.at(-1)+d0+i*step);
 numeric('sequence','二级差分',`相邻差值按等差变化，补全：${arr.join('，')}，（ ）。`,arr[4]+d0+4*step,`相邻差依次为 ${Array.from({length:4},(_,i)=>d0+i*step).join('、')}，下一差为 ${d0+4*step}，故答案为 ${arr[4]+d0+4*step}。`,{check:{type:'difference',arr,d0,step},distractors:[arr[4]+d0+3*step,arr[4]+d0+5*step,arr[4]*2]});
 const r=2,offset=k+1,rec=[3+k];for(let i=0;i<4;i++)rec.push(rec.at(-1)*r+offset);
 numeric('sequence','乘加递推',`每次采用同一乘加规则，补全：${rec.join('，')}，（ ）。`,rec[4]*r+offset,`每项=前项×${r}+${offset}，所以 ${rec[4]}×${r}+${offset}=${rec[4]*r+offset}。`,{check:{type:'recurrence',arr:rec,r,offset},distractors:[rec[4]*r,rec[4]*r-offset,rec[4]+offset]});
 const odd=3+k,even=30+k*2,inter=[odd,even,odd+3,even-2,odd+6,even-4];
 numeric('sequence','奇偶交替',`奇数项和偶数项各自成等差数列，补全：${inter.join('，')}，（ ）。`,odd+9,`奇数项 ${odd}、${odd+3}、${odd+6} 每次加 3，第七项=${odd+9}；偶数项每次减 2。`,{check:{type:'interleave',odd},distractors:[even-6,odd+6,odd+12]});
 const off=k+2,pow=Array.from({length:5},(_,i)=>(i+1)**2+off);
 numeric('sequence','平方修正',`各项为连续正整数的平方加同一常数，补全：${pow.join('，')}，（ ）。`,36+off,`各项为 1²+${off}、2²+${off}……5²+${off}，下一项为 6²+${off}=${36+off}。`,{check:{type:'power',off},distractors:[25+off,36-off,49+off]});
}
// 20 道资料分析：5 组完整材料，数值为训练数据。
for(let k=0;k<5;k++){
 const rows=[['甲产品',100+20*k,120+24*k],['乙产品',200+20*k,220+22*k],['丙产品',100+10*k,150+15*k]];
 const old=rows.reduce((s,r)=>s+r[1],0),now=rows.reduce((s,r)=>s+r[2],0);
 const table={caption:`第 ${k+1} 组训练数据 · 销售额（万元）`,headers:['产品','上期','本期'],rows};
 const shared={table};
 numeric('data','合计数',`三种产品的本期销售额合计为多少万元？`,now,`本期合计=${rows.map(r=>r[2]).join('+')}=${now} 万元。`,{...shared,check:{type:'sum',rows},distractors:[old,now+30,now-30]});
 numeric('data','增长率',`甲产品的本期销售额比上期增长多少？`,20,`增长率=(${rows[0][2]}−${rows[0][1]})÷${rows[0][1]}×100%=20%。分母应为上期值。`,{...shared,check:{type:'growth',row:rows[0]},format:x=>x.toFixed(1)+'%',distractors:[10,16.667,25]});
 numeric('data','比重',`丙产品占三种产品本期销售额的比重约为多少？`,100*rows[2][2]/now,`占比=${rows[2][2]}÷${now}×100%≈${(100*rows[2][2]/now).toFixed(1)}%。`,{...shared,check:{type:'share',rows,index:2},format:x=>x.toFixed(1)+'%',distractors:[100*rows[2][1]/old,100*rows[2][2]/old,50]});
 numeric('data','整体增长率',`三种产品合计销售额的本期增长率约为多少？`,100*(now-old)/old,`先求上期合计 ${old}、本期合计 ${now}。整体增长率=(${now}−${old})÷${old}×100%≈${(100*(now-old)/old).toFixed(1)}%，不能直接平均各产品增长率。`,{...shared,check:{type:'totalGrowth',rows},format:x=>x.toFixed(1)+'%',distractors:[(20+10+50)/3,100*(now-old)/now,15]});
}
// 20 道逻辑题：8 道条件/量词，4 道排序，4 道真假，4 道论证。
const logical=[
 ['所有审核员都参加过培训。小王是审核员。哪项必然成立？',['小王参加过培训','参加培训的人都是审核员','小王是唯一审核员','小王参加了所有培训'],0,'审核员集合属于参训者集合，小王是审核员，故参加过培训。'],
 ['只有完成验收，项目才可结项。项目已结项。哪项必然成立？',['项目没有验收','项目已完成验收','验收后必定立即结项','所有项目都已结项'],1,'“只有 A 才 B”表示 B⇒A。结项可推出完成验收。'],
 ['如果订单加急，就使用航空运输。这个订单没有使用航空运输。哪项必然成立？',['这个订单加急','这个订单未加急','航空运输都用于加急','这个订单没有运输'],1,'由加急⇒航空，逆否得到非航空⇒非加急。'],
 ['至少一名研发人员会德语，所有会德语的人都能阅读该德语手册。哪项必然成立？',['所有研发人员能阅读手册','至少一名研发人员能阅读手册','能阅读手册的人都会德语','不会德语的人不能阅读手册'],1,'存在同时为研发人员且会德语者，该人也能阅读手册。'],
 ['没有实习生可以独立签署该合同。小陈可以独立签署该合同。哪项必然成立？',['小陈不是实习生','小陈是实习生','小陈是经理','所有正式员工都可以签署'],0,'实习生集合与可独立签署者集合不相交，故小陈不是实习生；职位不能确定。'],
 ['甲、乙两项工作至少完成一项，但不能同时完成。已知甲未完成。哪项必然成立？',['乙完成了','乙未完成','甲和乙都未完成','无法判断乙'],0,'两项恰好完成一项，甲未完成，则乙完成。'],
 ['若系统升级，则安排维护。安排维护时暂停服务。哪项必然成立？',['暂停服务一定是因为升级','升级时会暂停服务','未升级就不会维护','维护只发生一次'],1,'升级⇒维护⇒暂停服务，连续条件可以传递。'],
 ['所有甲类文件都需备份，但并非所有需备份文件都是甲类。哪项必然成立？',['所有需备份文件都是甲类','存在需备份但非甲类文件','没有甲类文件','非甲类文件都不需备份'],1,'“并非所有 B 都是 A”等价于存在 B 且非 A。']
];
logical.forEach(([stem,opts,a,ex])=>add('logic','条件与量词',stem,opts,a,ex,{difficulty:2}));
for(let k=0;k<4;k++){
 const names=[['甲','乙','丙','丁'],['春','夏','秋','冬'],['A','B','C','D'],['红','蓝','绿','黄']][k];
 add('logic','顺序约束',`${names.join('、')}四人从左到右站成一排。${names[0]}在最左边，${names[1]}紧挨着位于${names[2]}左边，${names[3]}不在最右边。最右边是谁？`,[names[0],names[1],names[2],names[3]],2,`固定最左 ${names[0]}，相邻组合 ${names[1]}${names[2]}只能占第 2、3 或第 3、4 位。若占第 2、3 位，${names[3]}将在最右而违反条件。因此排列为 ${names[0]}${names[3]}${names[1]}${names[2]}。`,{check:{type:'order',names}});
 const people=[['甲','乙','丙'],['小周','小吴','小郑'],['A','B','C'],['一号','二号','三号']][k];
 add('logic','真假判断',`三人中只有一人获奖，且恰好一句话为真。${people[0]}说：“${people[1]}获奖。”${people[1]}说：“我没有获奖。”${people[2]}说：“${people[0]}没有获奖。”谁获奖？`,[people[0],people[1],people[2],'无法确定'],0,`前两句话互为否定，恰有一句真。要让总共仅一句为真，第三句必须假，即 ${people[0]}获奖。代入后前两句一假一真，满足条件。`,{check:{type:'truth',people},difficulty:3});
}
[
 ['门店换了新招牌后销量上升，负责人认为销量上升完全由新招牌造成。以下哪项最能削弱？',['换招牌时同时开展了大幅降价促销','招牌由专业设计师设计','招牌比原来更大','销量确实比上月高'],0,'同期促销提供另一原因，削弱“完全由招牌造成”的归因。'],
 ['公司认为培训能提高效率。以下哪项最有助于检验培训的因果效果？',['询问培训者是否喜欢课程','只比较参训者培训前后的平均效率','随机分配相近员工接受培训或不接受，再比较变化','只统计参加培训的人数'],2,'随机分配和对照比较有助于控制初始差异与共同时间因素。'],
 ['调查发现使用某软件的人业绩更高，作者推断使用软件导致业绩提高。该推断依赖哪项尚未排除的可能性？',['高业绩人员本来就更倾向于使用该软件','该软件有图标','软件能够安装在电脑上','公司存在不同部门'],0,'反向因果或使用者自我选择可以解释相关性，相关关系本身不足以证明因果。'],
 ['减少退货率的方案需要解决主要退货原因。现有统计显示七成退货因尺寸不合适。以下哪项最直接支持改进尺码指引？',['改进指引可减少用户选错尺寸','包装颜色比较单一','配送时间很快','网站访问量有所上升'],0,'正确选项建立尺码指引与主要退货原因之间的联系，补足方案与目标的逻辑链。']
].forEach(([stem,opts,a,ex])=>add('logic','论证分析',stem,opts,a,ex));
// 20 道图形题，图形规格同时用于渲染与答案检查。
for(let k=0;k<4;k++){
 const start=k*90,correct=(start+360)%360;
 const ropts=[0,90,180,270].map(angle=>({kind:'arrow',angle}));
 add('figure','旋转规律','箭头每次顺时针旋转 90°，第四幅之后应该是哪幅？',ropts,k,`方向每次顺时针转 90°，四次旋转后回到初始方向，所以选择与第一幅同向的箭头。`,{figures:Array.from({length:4},(_,i)=>({kind:'arrow',angle:(start+i*90)%360})),check:{type:'rotation',angle:correct},difficulty:1});
 const init=1+k,step=1;
 add('figure','数量变化','每幅图的圆点数量比前一幅多 1 个。下一幅应有多少个圆点？',[init+3,init+4,init+5,init+2].map(count=>({kind:'dots',count})),1,`数量为 ${init}、${init+1}、${init+2}、${init+3}，下一幅应为 ${init+4} 个。`,{figures:Array.from({length:4},(_,i)=>({kind:'dots',count:init+i})),check:{type:'dots',count:init+4}});
 const a=[1,1,0,0],b=[[1,0,1,0],[0,1,0,1],[1,1,1,0],[0,1,1,0]][k],ans=a.map((v,i)=>v^b[i]);
 const bad1=a.map((v,i)=>v|b[i]),bad2=a.map((v,i)=>v&b[i]),bad3=ans.map(v=>1-v);
 add('figure','异或叠加','两幅图逐格叠加：恰有一幅为黑色时结果为黑色，两幅同色时结果为白色。选择结果图。',[bad1,ans,bad2,bad3].map(cells=>({kind:'grid',cells})),1,`逐格应用“不同为黑，相同为白”：结果格依次为 ${ans.map(x=>x?'黑':'白').join('、')}（从左上按行读取）。`,{figures:[{kind:'grid',cells:a},{kind:'grid',cells:b}],check:{type:'xor',a,b},difficulty:3});
 const startCell=k,positions=[startCell,(startCell+1)%9,(startCell+2)%9,(startCell+3)%9],next=(startCell+4)%9;
 const poss=[(next+1)%9,next,(next+3)%9,(next+8)%9];
 add('figure','位置移动','九宫格按从左到右、从上到下编号 1–9，黑点每次前进一格，到 9 后回到 1。选择下一幅。',poss.map(position=>({kind:'move',position})),1,`位置按编号依次递增，第 9 格后循环到第 1 格。下一位置为第 ${next+1} 格。`,{figures:positions.map(position=>({kind:'move',position})),check:{type:'move',position:next},difficulty:2});
 const x=1+k,y=2;
 add('figure','矩阵数量','每一行第三幅的圆点数等于前两幅圆点数之和。补全第二行的问号。',[x+y+1,x+2*y,x+y,x+2*y+1].map(count=>({kind:'dots',count})),1,`第一行 ${x}+${y}=${x+y}；第二行 ${x+y}+${y}=${x+2*y}。`,{matrix:[[{kind:'dots',count:x},{kind:'dots',count:y},{kind:'dots',count:x+y}],[{kind:'dots',count:x+y},{kind:'dots',count:y},null]],check:{type:'matrix',count:x+2*y},difficulty:2});
}
// 20 道空间题。正方体展开图固定几何，标签变换。
for(let k=0;k<4;k++){
 const labels=[['A','B','C','D','E','F'],['1','2','3','4','5','6'],['甲','乙','丙','丁','戊','己'],['红','蓝','绿','黄','白','黑']][k];
 const net={kind:'net',labels};
 add('spatial','展开图相对面',`下图折成立方体，标有“${labels[2]}”的面与哪个面相对？`,[labels[0],labels[1],labels[3],labels[5]],3,`以中心 ${labels[2]} 为基准，直接相邻的四面为 ${labels[0]}、${labels[1]}、${labels[3]}、${labels[4]}；延伸的 ${labels[5]} 折到背面。因此 ${labels[2]} 与 ${labels[5]} 相对。`,{spatial:net,check:{type:'netOpposite',labels,target:2},difficulty:2});
 add('spatial','展开图邻接',`同一展开图折成立方体，下面哪一对面不能共用一条边？`,[`${labels[0]} 与 ${labels[2]}`,`${labels[1]} 与 ${labels[3]}`,`${labels[2]} 与 ${labels[4]}`,`${labels[3]} 与 ${labels[5]}`],1,`相对面组为 ${labels[0]}–${labels[4]}、${labels[1]}–${labels[3]}、${labels[2]}–${labels[5]}。只有 ${labels[1]} 与 ${labels[3]} 为相对面，不能共边。`,{spatial:net,check:{type:'netAdjacent',labels},difficulty:3});
 const cells=[[1,0,1,1],[1,1,0,1],[1,1,1,0],[0,1,1,1]][k];
 const rotate=a=>[a[2],a[0],a[3],a[1]];
 const r1=rotate(cells),r2=rotate(r1),r3=rotate(r2);
 add('spatial','平面旋转','把下图顺时针旋转 90°（不翻转、不镜像），选择结果。',[{kind:'grid',cells:r2},{kind:'grid',cells:r1},{kind:'grid',cells:r3},{kind:'grid',cells}],1,'顺时针 90° 时，左上移到右上，右上移到右下，右下移到左下，左下移到左上；按此对应搬移全部格子。',{figures:[{kind:'grid',cells}],check:{type:'gridRotate',cells},difficulty:2});
 const n=3+k*2;
 numeric('spatial','涂色立方体',`边长由 ${n} 个小正方体组成的大正方体，六个外表面都涂色后拆开。有多少个小正方体恰好有两个面涂色？`,12*(n-2),`恰好两面涂色的方块位于 12 条棱上，且排除每条棱的两个角点：12×(${n}−2)=${12*(n-2)}。`,{spatial:{kind:'cube',n},check:{type:'paint',n},distractors:[8,6*(n-2)**2,n**3],difficulty:3});
 const heights=[[1+k,2,1],[2,1+k,5],[1,2+k,1]];
 const front=[0,1,2].map(col=>Math.max(...heights.map(row=>row[col])));
 const rear=[...front].reverse(),first=heights[2],sum=front.map((_,i)=>heights.reduce((s,row)=>s+row[i],0));
 add('spatial','三视图',`每个格子的数字表示该位置叠放的小正方体数量。从图中下方向上看，正视图从左到右的最高轮廓是？`,[front.join('，'),rear.join('，'),first.join('，'),sum.join('，')],0,`前后相同列会遮挡，逐列取最大高度：${front.join('、')}。正视图应看最高值，而不是只看最近一行或求和。`,{spatial:{kind:'heights',heights},check:{type:'front',heights},difficulty:3});
}
// 8 道可追溯的公开模拟样题：来源不认证为北森实考。
[
 ['3，6，11，18，27',38,'相邻差为 3、5、7、9，下一差为 11，故 27+11=38。','publicA','二级差分',[36,37,40]],
 ['1，4，9，16，25',36,'各项为 1²、2²、3²、4²、5²，下一项为 6²=36。','publicB','平方数列',[30,35,49]],
 ['1，2，6，24，120',720,'依次乘 2、3、4、5，下一步乘 6：120×6=720。','publicB','阶乘数列',[600,840,1440]],
 ['34，41，46，56，67',80,'每次加上当前数的数位和：34+3+4=41，41+4+1=46，46+4+6=56，56+5+6=67，67+6+7=80。','publicC','数位和递推',[75,77,79]],
 ['6，62，214',510,'可用连续偶数的立方减 2 解释：2³−2=6，4³−2=62，6³−2=214，8³−2=510。短数列可有其他规则，本题按此常见简洁规则选择。','publicC','立方修正',[500,342,344]],
 ['0，16，8，12，10',11,'从第三项起，每项等于前两项的平均值：(0+16)/2=8，(16+8)/2=12，(8+12)/2=10，下一项=(12+10)/2=11。','publicD','相邻均值',[13,14,18]],
 ['3，10，29，66',127,'各项依次为 1³+2、2³+2、3³+2、4³+2，下一项为 5³+2=127。','publicD','立方修正',[85,166,87]]
].forEach(([seq,ans,ex,source,tag,distractors])=>numeric('sequence',tag,`依照常见简洁规律，${seq}，（ ）应选哪一项？`,ans,ex,{source,provenance:'public',difficulty:2,distractors,check:{type:'publicSequence',seq}}));
add('logic','集合包含','所有 A 都属于 B，所有 B 都属于 C。哪项必然成立？',['所有 A 都属于 C','所有 C 都属于 A','存在 B 属于 A','存在 C 不属于 A'],0,'集合包含具有传递性：A⊆B 且 B⊆C，可推出 A⊆C。题干未保证任何集合非空，因此不能推出存在性结论。',{source:'publicA',provenance:'public',difficulty:2});
const data={questions:qs,categories,sources,version:'2026.10.02',sourcePolicy:'公开模拟样题 8 题，原创训练题 140 题；北森官方实考原题 0 题。'};
root.PRACTICE_BANK=data;if(typeof module!=='undefined'&&module.exports)module.exports=data;
})(typeof window!=='undefined'?window:globalThis);
