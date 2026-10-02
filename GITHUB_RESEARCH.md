# GitHub 资料检索与筛选记录

核查日期：2026-10-02。目标：尽量使用已有公开题，排除性格测试，保证题干、选项、图片和答案可检查。

## 已使用的资料

| 仓库与文件 | 固定版本 | 收录结果 |
| --- | --- | --- |
| [BeiSen_Practice](https://github.com/Liqing-Lin/BeiSen_Practice) 的 src/data/questions.js 与 public/question-bank | fcd30068e84421a97f1aca6ab98b1f1400e11406 | 原有 445 题：言语 40、资料 253、图形 152。筛入 76 题：言语 26、资料 32、图形 16、空间 2 |
| [ShangAnNotes](https://github.com/SiriusFHJ/ShangAnNotes) 的 src/pages/math/number/multiple.mdx | 79cb922828e13bf8aaa44b9716e14a668400ef41 | 19 道现成数列例题/练习；排除练习 11 |
| 同仓库 src/lib/prepare/syllabus.mdx | 同上 | 数字推理 1、数学运算 3 |
| [daily-gongkao-skill](https://github.com/yangj557/daily-gongkao-skill) 的广东 2026 行测网友回忆版 OCR 题库 | ddce6a2251a1b9f605fbe65efb2ff0c8127b42d9 | 筛入无图且条件完整的 18 题：数量 5、逻辑 13 |

总计 117 道已有公开题。前者为北森相关第三方整理，后两者为通用能力补充，并非北森专属真题。原题编号与固定提交链接随题保留，解释采用独立复核后的简明解析。

## 其他检索线索

- [Ian010529/fk_beisen](https://github.com/Ian010529/fk_beisen)：README 指向 Liqing-Lin/BeiSen_Practice，用于追溯来源。未安装扩展或运行程序。其代码的 MIT 许可不能自动作为另一仓库题库的内容许可。
- [youmenl0769/2024beisencepingtikuzhenglifenxiang](https://github.com/youmenl0769/2024beisencepingtikuzhenglifenxiang)：只有 README 和网盘链接，缺少可直接核对的原题，不收录为可计分题。
- MikeCreken/lanlanInterview：涉及测评经历与类型说明，未作为完整题干来源。
- adlink8/career-os：生成练习中存在答案/解析问题，未收录。
- fei98/civil-service-exam-prep：为通用公考题库，当前未导入，避免仅凭规模混入大量不相关内容。

## 代表性排除原因

原库未被整体视为可信答案库。下列题号未纳入练习：

| 原题号 | 原因 |
| --- | --- |
| v-12 | 词语疑似 OCR 错误，解释不能充分区分候选词 |
| v-16 | D 选项缺失 |
| v-24 | 参考答案的因果和总体推断超出材料 |
| v-32 | 填空上下文与参考成语关系不足 |
| d-2 | 将持平的增长率描述为放缓 |
| d-4 | 只有边际人数，不能确定两个群体交集；解析擅自相乘 |
| d-8 | 把占比平均数当成增长贡献率 |
| d-14 | A/B 选项重复 |
| d-18 | 设问第二年，解析只增长一期 |
| d-21 | 缺少交易手续费条件 |
| d-27、d-47 | 题干与统计图内容错配 |
| d-32 | 选项、增长率、单位和解析结果不一致 |
| d-37 | 消费区间人数占比不能确定各群体消费总额 |
| d-38 | 历史趋势不能保证未知年份的增长 |
| g-23 | 混入相邻题图片 |
| g-14、g-18、g-21、g-24 | 尚未通过逐题人工复核，不进入可计分题库 |
| ShangAnNotes 练习 11 | 小数数列解析不能排除另一个选项 |

其他未入选题也不视为已经复核。research/curation.json 记录候选题号，实际导入还必须在 research/reviewed-explanations.json 中有复核解析。

## 整理方式与可信边界

- 保留题干条件、数值和原有选项；明显 OCR 字符仅作文字修正。
- 清除资料题题干中串入的上一题解析，去掉原库末尾空选项。
- g-5、g-7 的五个选项完整保留，支持 E 选项与键盘选择。
- 66 张所需图片从原仓库复制，检查输出与原文件字节相同。选项通过 SVG 视窗切分展示；g-1 图片右侧含答案箭头，视窗排除该区域。
- 独立核算数量/资料题，按原图逐题检查图形；数字推理采用常见简洁规律，题干对此有说明。阅读和论证仅依所给材料审阅。
- GitHub 托管不等于北森官方认证。回忆版和 OCR 草稿的身份原样说明，不能据此保证实考复现。
- 官方 CATA 资料用于了解能力维度和计分原理，未作为这 117 道题的真实性证明。

当前为本地练习交付。部分原题库未附许可证，不将其视为官方授权或允许任意再发布。
