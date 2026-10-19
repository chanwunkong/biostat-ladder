// 統計函式對照 R 的參考值，並在每份內建資料集上跑一次所有分析。
// 執行：node tests/stats.test.js
const fs = require('fs');
const path = require('path');
const src = fs.readFileSync(path.join(__dirname, '..', 'src', 'core.js'), 'utf8');
const { S, AN, DATASETS, makeDS, dsFromText } = new Function(src + '; return { S, AN, DATASETS, makeDS, dsFromText };')();

let fail = 0;
const near = (name, got, want, tol = 5e-4) => {
  const ok = Math.abs(got - want) <= tol * Math.max(1, Math.abs(want));
  if (!ok) fail++;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name.padEnd(30)} ${got.toFixed(5)}  (R: ${want})`);
};

near('qt(.975, 10)', S.qt(0.975, 10), 2.228139);
near('qt(.975, 1)', S.qt(0.975, 1), 12.7062);
near('pchisq(3.841459, 1)', S.pchisq(3.841459, 1), 0.05);
near('pchisq(10, 4)', S.pchisq(10, 4), 0.04042768);
near('qnorm(.975)', S.qnorm(0.975), 1.959964);
near('pnorm(-1.5)', S.pnorm(-1.5), 0.0668072);
near('fisher 3,1,1,3', S.fisher(3, 1, 1, 3), 0.4857143);
near('fisher 8,2,1,5', S.fisher(8, 2, 1, 5), 0.03496503);

// R: t.test(extra ~ group, data = sleep)
const g1 = [0.7, -1.6, -0.2, -1.2, -0.1, 3.4, 3.7, 0.8, 0.0, 2.0], g2 = [1.9, 0.8, 1.1, 0.1, -0.1, 4.4, 5.5, 1.6, 4.6, 3.4];
const w = S.welch(g2, g1);
near('Welch t (sleep)', w.t, -1.860813);
near('Welch df', w.df, 17.77647);
near('Welch p', w.p, 0.07939414);
const pt = S.pairedT(g1, g2);
near('paired t', pt.t, 4.062128);
near('paired p', pt.p, 0.00283289);
near('Mann-Whitney p', S.mannWhitney(g1, g2).p, 0.06932758);
near('n per group, d = 0.5', S.nMeans(0.5, 0.05, 0.8), 64);

// R: survival::aml
const t = [9, 13, 13, 18, 23, 28, 31, 34, 45, 48, 161, 5, 5, 8, 8, 12, 16, 23, 27, 30, 33, 43, 45];
const s = [1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1];
const g = [...Array(11).fill(0), ...Array(12).fill(1)];
near('log-rank chi2 (aml)', S.logrank(t, s, g, 2).chi2, 3.396389, 2e-3);
near('Cox coef, Breslow (aml)', S.cox(t, s, g.map(v => [v])).b[0], 0.9042, 2e-3);
near('KM median (aml maintained)', S.km(t.slice(0, 11), s.slice(0, 11)).median, 31);

// R: PlantGrowth
const pg = [[4.17, 5.58, 5.18, 6.11, 4.50, 4.61, 5.17, 4.53, 5.33, 5.14], [4.81, 4.17, 4.41, 3.59, 5.87, 3.83, 6.03, 4.89, 4.32, 4.69], [6.31, 5.12, 5.54, 5.50, 5.37, 5.29, 4.92, 6.15, 5.80, 5.26]];
near('ANOVA F (PlantGrowth)', S.anova(pg).F, 4.846088);
near('ANOVA p (PlantGrowth)', S.anova(pg).p, 0.01591);
near('Welch ANOVA F (oneway.test)', S.welchAnova(pg).F, 5.181);
near('Welch ANOVA df2', S.welchAnova(pg).df2, 17.128);
near('Welch ANOVA p', S.welchAnova(pg).p, 0.01739);
near('Levene F (car, median)', S.levene(pg).F, 1.1192);
near('Levene p', S.levene(pg).p, 0.3412);

near('qtukey(0.95, 3, 27)', S.qtukey(0.95, 3, 27), 3.506426);
near('qtukey(0.95, 4, 60)', S.qtukey(0.95, 4, 60), 3.737416);
const tk = S.tukey(pg).pairs;
near('TukeyHSD p trt1-ctrl', tk[0].p, 0.3908711);
near('TukeyHSD p trt2-ctrl', tk[1].p, 0.1979960);
near('TukeyHSD p trt2-trt1', tk[2].p, 0.0120064);
near('TukeyHSD 下限 trt2-trt1', tk[2].ci[0], 0.1737839);

// R: summary(aov(len ~ supp * factor(dose), data = ToothGrowth))
const tg = { VC: [[4.2, 11.5, 7.3, 5.8, 6.4, 10, 11.2, 11.2, 5.2, 7], [16.5, 16.5, 15.2, 17.3, 22.5, 17.3, 13.6, 14.5, 18.8, 15.5], [23.6, 18.5, 33.9, 25.5, 26.4, 32.5, 26.7, 21.5, 23.3, 29.5]],
  OJ: [[15.2, 21.5, 17.6, 9.7, 14.5, 10, 8.2, 9.4, 16.5, 9.7], [19.7, 23.3, 23.6, 26.4, 20, 25.2, 25.8, 21.2, 14.5, 27.3], [25.5, 26.4, 22.4, 24.5, 24.8, 30.9, 26.4, 27.3, 29.4, 23]] };
const ty = [], ta = [], tb = []; ['OJ', 'VC'].forEach((sp, i) => tg[sp].forEach((cell, j) => cell.forEach(v => { ty.push(v); ta.push(i); tb.push(j); })));
const tw = S.twoway(ty, ta, tb);
near('二因子 F 給法 (ToothGrowth)', tw.A.F, 15.572);
near('二因子 F 劑量', tw.B.F, 92.000);
near('二因子 F 交互作用', tw.AB.F, 4.107);
near('二因子 p 交互作用', tw.AB.p, 0.021860);

const DS = {};
for (const m of DATASETS) { const d = m.gen(); DS[m.id] = makeDS({ ...m, head: d.head, rows: d.rows }); }
const runs = [
  ['bp_trial', 'table1', { g: 'group', vars: ['age', 'sex', 'bmi', 'sbp_base', 'sbp_wk12', 'ae'] }],
  ['bp_trial', 'ttest', { y: 'sbp_wk12', g: 'group' }],
  ['bp_trial', 'paired', { a: 'sbp_base', b: 'sbp_wk12' }],
  ['bp_trial', 'linreg', { y: 'sbp_wk12', xs: ['group', 'sbp_base', 'age', 'bmi'] }],
  ['bp_trial', 'chisq', { r: 'group', c: 'ae' }],
  ['cvd_cohort', 'corr', { x: 'age', y: 'sbp' }],
  ['cvd_cohort', 'logreg', { y: 'cvd_10y', xs: ['smoker', 'age', 'sex', 'sbp', 'chol', 'diabetes'] }],
  ['lung_surv', 'surv', { time: 'time_months', status: 'status', g: 'treatment', xs: ['treatment', 'stage', 'age'] }],
  ['gene_expr', 'multi', { g: 'tissue', vars: DS.gene_expr.cols.slice(2).map(c => c.name) }],
  ['plant_growth', 'anova', { y: 'height_cm', g: 'fertilizer' }],
  ['diet_geno', 'anova2', { y: 'weight_gain_g', a: 'diet', b: 'genotype' }],
];
for (const [id, an, sel] of runs) {
  try { const r = AN[an].run(DS[id], sel); console.log(`ok   ${id} / ${an}: ${r.write ? r.write.zh.r.slice(0, 60) : r.title}…`); }
  catch (e) { fail++; console.log(`FAIL ${id} / ${an}: ${e.message}`); }
}
const up = dsFromText('x.csv', 'a,b,c\n1,x,"q,1"\n2,y,NA\n3,x,4\n');
const types = up.cols.map(c => `${c.name}:${c.type}:${c.nmiss}`).join(' ');
if (types !== 'a:num:0 b:cat:0 c:cat:1') { fail++; console.log('FAIL CSV parsing', types); } else console.log('ok   CSV parsing');

console.log(fail ? `\n${fail} 項失敗` : '\n全部通過');
process.exit(fail ? 1 : 0);
