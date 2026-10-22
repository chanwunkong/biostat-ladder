/* English content: rest of Level 4, start of Level 5 */
Object.assign(I18N.packs.en.ch, {
  'c3-3': {
    title: `Categorical data: the chi-square test and odds ratios`, refs: `Whitlock ch. 9; Rosner 10.2–10.6; Kirkwood ch. 16–17`, labs: [`Smoking and cardiovascular events`, `New drug and adverse events`],
    body: `<p>When both variables are categorical (e.g. smoking × cardiovascular event), the data form a <b>contingency table</b>.</p>
<div class="formula">χ² = Σ (observed − expected count)² ÷ expected count　　　expected count = row total × column total ÷ grand total</div>
<p>If any cell has an expected count below 5 (common with small samples), use <b>Fisher's exact test</b> instead.</p>
<h3>Effect sizes: risk ratio and odds ratio</h3>
<div class="tbl-wrap"><table class="st"><thead><tr><th></th><th>Event</th><th>No event</th></tr></thead><tbody><tr><td>Exposed</td><td>a</td><td>b</td></tr><tr><td>Unexposed</td><td>c</td><td>d</td></tr></tbody></table></div>
<div class="formula">risk ratio RR = [a ÷ (a+b)] ÷ [c ÷ (c+d)]<br>odds ratio OR = (a ÷ b) ÷ (c ÷ d) = ad ÷ bc</div>
<p>Two common study types: a <b>cohort study</b> groups people by exposure (e.g. smoking) and follows them forward to see who has the event; a <b>case-control study</b> first finds people with the disease (cases) and without it (controls) and looks back at their past exposures. The <b>odds</b> are “number with the event ÷ number without”; the odds ratio divides the odds of the two groups.</p>
<p>Cohort studies and randomized trials can estimate the RR directly; case-control studies can only estimate the OR, because the ratio of cases to controls is set by the investigator. When the event is rare (below about 10%), OR ≈ RR.</p>`,
    quiz: [
      { q: `Which effect size should a case-control study report?`, o: [`OR`, `RR`, `Incidence rate`, `Prevalence`], why: `In a case-control study the proportion of cases is set by the investigator, so risk cannot be estimated; only the odds ratio can.`, look: `The OR uses only the cross-products of a, b, c and d and does not need the true event rate in the population — that is all a case-control study can estimate.` },
      { q: `A 2×2 table is 4, 3 / 1, 8 and the smallest expected count is about 2.2. What should you do?`, o: [`Use Fisher's exact test`, `Use chi-square anyway`, `Delete that cell`, `Collapse to a 1×2 table`], why: `With expected counts below 5 the chi-square approximation is inaccurate; use Fisher's exact test.`, look: `A warning appears below: the smallest expected count is below 5. Compare the chi-square p and the Fisher p.` },
      { q: `Study data: 27 of 83 smokers and 66 of 317 non-smokers had a cardiovascular event. The risk ratio RR is about?`, o: [`1.56`, `1.83`, `0.64`, `11.7`], why: `RR = (27/83) ÷ (66/317) = 32.5% ÷ 20.8% ≈ 1.56. 1.83 is the odds ratio; 11.7 is the difference in percentage points.`, look: `Click “risk ratio RR” and “odds ratio OR”: when the event is not rare, the OR is further from 1 than the RR.` },
    ],
  },
  'two-prop': {
    title: `Comparing two proportions`, refs: `Rosner 10.2, 10.5; Kirkwood ch. 16`,
    body: `<p>When comparing two proportions (e.g. response rates on a new drug and placebo), more important than the chi-square p-value (chapter {{c3-3}}) is estimating <b>how much</b> they differ.</p>
<h3>The risk difference and its confidence interval</h3>
<div class="formula">risk difference = p₂ − p₁<br>standard error = √(p₁(1 − p₁) ÷ n₁ + p₂(1 − p₂) ÷ n₂)<br>95% CI = risk difference ± 1.96 × standard error</div>
<p>Example: 15 of 50 placebo patients respond (30%) and 25 of 50 on the new drug (50%). The <b>risk difference</b> = 20 percentage points, 95% CI about 1.2 to 38.8 points. The interval excludes 0 but its lower limit is close to 0: the data are compatible with anything from “almost no difference” to “a large difference”, and a larger sample is needed for a more precise estimate.</p>
<h3>The z-test for two proportions</h3>
<div class="formula">pooled proportion p̄ = (x₁ + x₂) ÷ (n₁ + n₂)<br>z = (p₂ − p₁) ÷ √(p̄(1 − p̄)(1/n₁ + 1/n₂))</div>
<p>The test uses the pooled proportion for the standard error because the null hypothesis says the two proportions are equal. In the example z ≈ 2.04, p ≈ 0.041. The square of this z equals the χ² of the 2×2 chi-square test on the same data (without continuity correction): they are the same test.</p>
<h3>Absolute or relative difference?</h3>
<p>The same data can be expressed three ways: a risk difference of 20 percentage points, a risk ratio of 1.67 (chapter {{c0-1}}), an odds ratio of 2.33. Clinical meaning usually requires both the absolute and the relative difference: for rare events the relative difference can be large while the absolute difference is tiny. The reciprocal of the risk difference is the number needed to treat (NNT).</p>
<p class="note">With small samples or proportions near 0 or 1, the Wald interval is inaccurate; improved methods such as Newcombe's can be used, and Fisher's exact test when counts are very small. Sample-size calculation for two proportions is in chapter {{c4-5}}.</p>`,
    quiz: [
      { q: `15 of 50 placebo patients and 25 of 50 new-drug patients respond. What is the difference in response rates?`, o: [`20 percentage points`, `10 people`, `67%`, `0.5`], why: `25/50 − 15/50 = 0.5 − 0.3 = 0.2, i.e. 20 percentage points.`, look: `30% vs 50%: click “risk difference” to see the red interval.` },
      { q: `A two-proportion z-test on a 2×2 table gives z = 2.04. A chi-square test on the same data (no continuity correction) gives χ² of about?`, o: [`4.17`, `2.04`, `1.43`, `0.04`], why: `z² = 2.04² ≈ 4.17; they are the same test with the same p-value.`, look: `Look at the last two cards: z ≈ 2.04, χ² = z² ≈ 4.17.` },
      { q: `Risk difference 20 percentage points, 95% CI 1.2 to 38.8. The best interpretation is?`, o: [`The difference could be anything from small to large; the estimate is not yet precise`, `The new drug certainly raises the response rate by 20 points`, `Because the lower limit is near 0, there is no difference`, `The p-value must exceed 0.05`], why: `The interval excludes 0 (p < 0.05) but is wide, so the true difference is still very uncertain.`, look: `The same 30% vs 50%, but with 200 per group: the interval for the risk difference is about half as wide.` },
      { q: `Study data: 52 of 183 placebo patients and 118 of 180 new-drug patients respond. The risk difference and 95% CI are about?`, o: [`37.1 percentage points (27.6 to 46.7)`, `66 people`, `2.3-fold`, `28.4%`], why: `118/180 − 52/183 = 65.6% − 28.4% = 37.1 points; the interval combines the uncertainty of both proportions.`, look: `Click “risk difference”: the red interval lies entirely to the right of 0. With a single hospital it would be much wider.` },
    ],
  },
  'mcnemar': {
    title: `Paired binary data: McNemar's test`, refs: `Rosner 10.4; Kirkwood ch. 21; Agresti, Categorical Data Analysis`,
    body: `<p>The same people assessed twice with a yes/no outcome: symptoms before and after treatment, the same patients tested with two different tests, a matched case-control study. These data are <b>paired</b> and cannot be analysed with an ordinary chi-square test as if they were two independent groups.</p>
<h3>Only the “discordant” people carry information</h3>
<div class="tbl-wrap"><table class="st"><thead><tr><th></th><th>After: symptoms</th><th>After: none</th></tr></thead><tbody><tr><td>Before: symptoms</td><td>a (both times)</td><td><b>b (improved)</b></td></tr><tr><td>Before: none</td><td><b>c (worsened)</b></td><td>d (neither time)</td></tr></tbody></table></div>
<p>People with the same result twice (a, d) carry no information about “whether before and after differ”. If treatment had no effect, about as many would improve as worsen, so <b>McNemar's test</b> compares only b and c:</p>
<div class="formula">χ² = (b − c)² ÷ (b + c)　　1 degree of freedom</div>
<p>Example: of 100 patients, 20 went from symptoms to none and 5 from none to symptoms. χ² = (20 − 5)² ÷ 25 = 9, p ≈ 0.003.</p>
<h3>Small samples: the exact test</h3>
<p>When b + c is small, treat b as a binomial outcome “out of b + c trials with success probability 0.5” and compute the p-value with the exact binomial test (chapter {{binom-test}}) — the same idea as the sign test (chapter {{nonpar}}). Some software applies a continuity correction (|b − c| − 1)² ÷ (b + c) by default, which is slightly conservative.</p>
<p class="warn">Analysing paired data as two independent groups with an ordinary chi-square test violates independence and wastes the power of the paired design.</p>`,
    quiz: [
      { q: `Of 100 patients, 20 go from symptoms to none after treatment and 5 from none to symptoms. What is McNemar's χ²?`, o: [`9`, `15`, `25`, `0.6`], why: `(20 − 5)² ÷ (20 + 5) = 225 ÷ 25 = 9. People with the same result twice are not used.`, look: `Click “McNemar χ²”: only the two red cells (20 and 5) are used: (20 − 5)² ÷ 25 = 9.` },
      { q: `Why can't before/after yes/no symptom data be analysed with an ordinary 2×2 chi-square test?`, o: [`The two results of the same person are not independent; use McNemar's test`, `Because the sample is too large`, `Because chi-square needs three or more groups`, `Because the outcome is not continuous`], why: `The ordinary chi-square test assumes every observation comes from a different person.`, look: `Compare the p-value on the last card, “wrong approach”: treating the same people's before and after as two groups gives a different and incorrect result.` },
      { q: `The same 200 patients each get rapid tests A and B, and we want to compare the positive rates of the two tests. Use?`, o: [`McNemar's test`, `A chi-square test for two independent groups`, `A Welch t-test`, `Mann–Whitney`], why: `Each patient had both tests: paired binary data.`, look: `Think of a as both tests positive, b as only A positive and c as only B positive. Comparing the tests again uses only b and c.` },
      { q: `For the same 400 ECGs, 42 were read positive only by physician A and 24 only by physician B. McNemar's χ² is about?`, o: [`4.91`, `18`, `66`, `0.27`], why: `(42 − 24)² ÷ (42 + 24) = 324 ÷ 66 ≈ 4.91. The 334 ECGs read the same way by both are not used.`, look: `Study data: only the two red cells are used. Compare the p-value on the last card, “wrong approach”.` },
    ],
  },
  'kappa': {
    title: `Agreement: kappa`, refs: `Rosner 10.8; Landis & Koch (1977) Biometrics 33:159`,
    body: `<p>Two pathologists reading the same slides, two doctors diagnosing the same X-rays, one researcher re-scoring a week later: we want to know how much the two readings <b>agree</b>. The most intuitive measure is the <b>observed agreement</b> (the proportion read the same), but it has a problem: even two people guessing at random will sometimes agree by chance.</p>
<h3>Cohen's κ (kappa)</h3>
<div class="formula">κ = (observed agreement − chance agreement) ÷ (1 − chance agreement)<br>chance agreement = Σ (rater 1's proportion in a category × rater 2's proportion in that category)</div>
<p>Example: 50 slides; both call 20 positive and 15 negative, so observed agreement = 35/50 = 0.7. Rater 1 calls 25 positive and rater 2 calls 30 positive, so chance agreement = 0.5 × 0.6 + 0.5 × 0.4 = 0.5. κ = (0.7 − 0.5) ÷ (1 − 0.5) = 0.4.</p>
<p>κ = 1 means perfect agreement; κ = 0 means agreement no better than guessing; κ &lt; 0 means worse than guessing. A frequently quoted scale (Landis &amp; Koch, 1977): 0.21–0.40 fair, 0.41–0.60 moderate, 0.61–0.80 substantial, above 0.81 almost perfect. This is just a convention; requirements differ by field.</p>
<h3>The kappa paradox</h3>
<p>When one category is very common (e.g. 95% of slides are negative), it is easy for both raters to say “negative”, so chance agreement is already high; even with 90% observed agreement, κ can be low. Report the observed agreement, κ and the cross-table together.</p>
<p class="note">κ is for categorical data. For agreement of continuous measurements use the intraclass correlation coefficient ICC (chapter {{random-eff}}) or a Bland–Altman analysis, not the correlation coefficient r: two methods can be perfectly correlated yet always differ by a fixed amount.</p>`,
    quiz: [
      { q: `Observed agreement 0.7, chance agreement 0.5. What is Cohen's κ?`, o: [`0.4`, `0.2`, `0.7`, `1.4`], why: `(0.7 − 0.5) ÷ (1 − 0.5) = 0.4.`, look: `Click “Kappa κ”: the solid red line is “observed − chance”, the dashed red line is “1 − chance”; dividing them gives κ = 0.4.` },
      { q: `Why not simply use “the proportion read the same” to assess agreement?`, o: [`Even guessing produces some agreement by chance; κ removes it`, `Because a proportion cannot exceed 1`, `Because normality is needed`, `Because proportions can only compare two groups`], why: `Chance agreement can be high when one category is very common.`, look: `The grey chance agreement is 50%: even guessing, the two would agree half the time.` },
      { q: `95% of samples are negative; observed agreement is 92% but κ is only 0.3. The most likely reason is?`, o: [`Negatives are so common that chance agreement is already high`, `A calculation error`, `The sample is too large`, `The raters do not agree at all`], why: `This is the kappa paradox; report agreement and the cross-table as well.`, look: `Most slides are negative: observed agreement 92%, but chance agreement is also high, so κ is only about 0.3.` },
      { q: `Two physicians read 400 ECGs: observed agreement 83.5%, chance agreement 54.6%. κ is about?`, o: [`0.64`, `0.84`, `0.29`, `0.55`], why: `(0.835 − 0.546) ÷ (1 − 0.546) ≈ 0.64.`, look: `Study data: click “Kappa κ” — the solid red line divided by the dashed red line.` },
    ],
  },
  'c3-5': {
    title: `Choosing a statistical method`, refs: `Whitlock ch. 13; Rosner ch. 9`,
    body: `<p>When data are clearly skewed, samples are small or the data are ordinal, <b>nonparametric methods</b> that do not assume normality can be used; they are usually based on ranks.</p>
<div class="tbl-wrap"><table class="st"><thead><tr><th>Purpose</th><th>Parametric</th><th>Nonparametric</th></tr></thead><tbody><tr><td>Two independent groups</td><td>Welch t-test</td><td>Mann–Whitney U</td></tr><tr><td>Two paired groups</td><td>Paired t-test</td><td>Wilcoxon signed-rank</td></tr><tr><td>Three or more groups</td><td>ANOVA</td><td>Kruskal–Wallis</td></tr><tr><td>Correlation</td><td>Pearson</td><td>Spearman</td></tr></tbody></table></div>
<h3>Choosing: start from the outcome variable</h3>
<div class="tbl-wrap"><table class="st"><thead><tr><th>Outcome</th><th>Question</th><th>Method</th></tr></thead><tbody>
<tr><td rowspan="4">Numerical</td><td>Two independent groups</td><td>Welch t / Mann–Whitney</td></tr><tr><td>Same individuals twice</td><td>Paired t / Wilcoxon signed-rank</td></tr><tr><td>Three or more groups</td><td>ANOVA / Kruskal–Wallis</td></tr><tr><td>Continuous predictor, or adjusting for confounders</td><td>Linear regression</td></tr>
<tr><td rowspan="2">Binary (yes/no)</td><td>Compare two groups</td><td>Chi-square / Fisher</td></tr><tr><td>Adjust for confounders</td><td>Logistic regression</td></tr>
<tr><td rowspan="2">Time-to-event</td><td>Compare groups</td><td>Kaplan–Meier + log-rank</td></tr><tr><td>Adjust for confounders</td><td>Cox regression</td></tr>
<tr><td>Any type</td><td>Repeated measures or clustered data</td><td>Mixed models, GEE</td></tr></tbody></table></div>
<h3>Methods in the table you have not met yet</h3>
<ul><li><b>Binary variable</b>: a variable with only two outcomes, e.g. yes/no, alive/dead.</li>
<li><b>Linear regression</b> (chapter {{c4-1}}): predicts a numerical outcome with a line, or a combination of several variables, while adjusting for others.</li>
<li><b>Logistic regression</b> (chapter {{c4-2}}): regression for a binary outcome that can adjust for variables such as age; results are odds ratios.</li>
<li><b>Kaplan–Meier and log-rank</b> (chapter {{c4-3}}): drawing and comparing survival curves.</li>
<li><b>Cox regression</b> (chapter {{c4-3}}): regression for survival data, adjusting for several variables; results are hazard ratios.</li>
<li><b>Mixed models, GEE</b> (chapter {{c4-6}}): methods for repeated measurements on the same individual or clustered data.</li></ul>
<p class="note">With reasonably large groups (about 30 or more), t-tests tolerate non-normality well. Do not switch methods mechanically because a normality test (Shapiro–Wilk) gives p &lt; 0.05 — with large samples it is almost always significant. Look at the graphs and the degree of skewness, and be clear whether you want to compare means or whole distributions.</p>`,
    quiz: [
      { q: `Comparing tumour volume in mice on three diets; the data are very right-skewed with only 6 per group. The most suitable method is?`, o: [`Kruskal–Wallis (or ANOVA after a log transformation)`, `Three t-tests`, `A chi-square test`, `A paired t-test`], why: `Three or more groups, small samples and skewness call for a nonparametric method or a transformation first.`, look: `Numerical outcome, three or more groups: see the note on skewness under the suggested method.` },
      { q: `Comparing “death within a year” between a new drug and placebo while adjusting for age, use?`, o: [`Logistic regression`, `Linear regression`, `A paired t-test`, `Pearson correlation`], why: `The outcome is binary and adjustment is needed; with each person's survival time, Cox regression would be better.`, look: `Binary outcome, adjusting for other variables.` },
    ],
  },
  'exp-design': {
    title: `Principles of experimental design`, refs: `Whitlock ch. 14; Rosner 6.4`,
    body: `<p>In an <b>experiment</b> the investigator decides who gets which treatment; an <b>observational study</b> only records exposures that occur naturally. Only well-designed experiments let us attribute differences to the treatment itself. Good design deals with two problems at once: <b>bias</b> and <b>sampling error</b>.</p>
<div class="formula">Bias: how far estimates are off the true value on average. It does not disappear however often you repeat.<br>Sampling error: random fluctuation of the estimate between experiments. It shrinks with larger samples, i.e. better <b>precision</b>.</div>
<h3>Three ways to reduce bias</h3>
<ul><li><b>Control group</b>: a group identical in every respect except the treatment. Clinical trials use a <b>placebo</b>; animal experiments use sham surgery or vehicle only, so the effect of “being treated” itself is the same in both groups.</li>
<li><b>Randomization</b>: random numbers decide which group each individual joins, not the investigator. Even unintentionally, investigators tend to put healthier, easier-to-catch animals in the treatment group, making the treatment look better than it is.</li>
<li><b>Blinding</b>: participants, carers or the people measuring do not know which group each individual is in. <b>Single-blind</b> means the participants do not know; <b>double-blind</b> means neither participants nor researchers know. When the person measuring knows the group, measurements tend to drift unconsciously towards expectations.</li></ul>
<h3>Three ways to reduce sampling error</h3>
<ul><li><b>Replication</b>: each group needs enough <b>experimental units</b>. The experimental unit is “the unit that independently receives the treatment”, e.g. each mouse or each culture dish; measuring many cells from one mouse is not replication but pseudoreplication (chapter {{c4-6}}).</li>
<li><b>Balance</b>: comparisons are most precise when groups have equal numbers of experimental units.</li>
<li><b>Blocking</b>: group similar experimental units together (e.g. same day, same cage, same litter) and randomize all treatments within each group, so differences between groups do not get mixed into the treatment effect. Covered later in this level.</li></ul>
<h3>When experiments are impossible</h3>
<p>Many questions (e.g. the effects of smoking) cannot be answered by experiments, only by observational studies. Then confounders must be handled by matching, stratification or regression adjustment, but unmeasured confounding can never be ruled out. That is why experimental evidence ranks higher.</p>
<p class="note">Before the experiment starts, decide how many experimental units per group (sample size: chapter {{c4-5}}), how to randomize, who will be blinded and when data will be excluded. Deciding afterwards can turn into choosing by results.</p>`,
    quiz: [
      { q: `The investigator puts the healthiest-looking mice in the drug group. Even if the drug does nothing, what happens?`, o: [`The estimated effect is too large and far more than 5% of experiments give p < 0.05`, `The estimate is unaffected`, `It only makes the estimate less precise; the average is still right`, `The p-values get larger`], why: `Healthy mice grow better anyway; that difference gets mixed into the estimated “drug effect” — bias.`, look: `Set the drug effect to 0 and switch to investigator choice (patients with lower blood pressure get the new drug). See how far the orange dashed line (average estimate) is from the black line (true value), and the proportion in red (p < 0.05).` },
      { q: `Increasing each group from 10 to 40 mice mainly improves?`, o: [`The spread of the estimates (precision), but not the bias`, `The bias disappears automatically`, `Neither changes`, `False positives always fall to 5%`], why: `Larger samples only reduce sampling error; bias from selection needs randomization.`, look: `40 per group: the distribution is narrower but still entirely off the black line. Switch back to “randomization” to compare.` },
      { q: `The drug does nothing and allocation is randomized, but the person measuring knows which mice were treated. The most likely result is?`, o: [`Measurements drift towards expectations and the estimated effect is too large`, `Randomization has removed all bias`, `Only the control group is affected`, `No effect at all`], why: `Randomization only handles bias from allocation; measurement bias needs blinding.`, look: `Randomized but not blinded: the distribution is still shifted right; the bias comes from measurement. Tick “blinded measurement” again to compare.` },
    ],
  },
  'c3-2': {
    title: `One-way ANOVA`, refs: `Whitlock ch. 15; Rosner 12.1–12.4; Kirkwood ch. 9`, labs: [`Compare plant height across four fertilizers`, `Regression with block and pH`],
    body: `<p>To compare three or more means, do not run t-tests on every pair: 3 groups need 3 comparisons and 5 groups need 10, and the 5% false-positive chance of each accumulates far beyond 5% overall.</p>
<p><b>One-way analysis of variance (ANOVA)</b> first answers one overall question: are all the group means equal?</p>
<div class="formula">F = between-group variability MS<sub>between</sub> ÷ within-group variability MS<sub>within</sub></div>
<p>This ratio is the <b>F statistic</b>. <b>Between-group variation</b> is how much the group means differ from one another; <b>within-group variation</b> is how spread out individuals are within the same group.</p>
<h3>Splitting the total variation into two parts</h3>
<p>Each value's distance from the overall mean splits into two pieces: “value → its group mean” plus “group mean → overall mean”. Squaring and adding gives three <b>sums of squares</b> (SS):</p>
<div class="formula">total sum of squares = between-group SS + within-group SS<br>SS<sub>total</sub> = Σ(each value − overall mean)²<br>SS<sub>between</sub> = Σ group size × (group mean − overall mean)²<br>SS<sub>within</sub> = Σ(each value − its own group mean)²</div>
<p>Sums of squares grow with the number of people and groups, so each is divided by its degrees of freedom to get a <b>mean square</b> (MS): between-group df = groups − 1, within-group df = total N − groups. F is the ratio of the two mean squares:</p>
<div class="tbl-wrap"><table class="st"><thead><tr><th>Source</th><th>SS</th><th>df</th><th>MS = SS ÷ df</th><th>F</th></tr></thead><tbody><tr><td>Between</td><td>120</td><td>3 − 1 = 2</td><td>60</td><td>60 ÷ 10 = 6.0</td></tr><tr><td>Within</td><td>270</td><td>30 − 3 = 27</td><td>10</td><td></td></tr><tr><td>Total</td><td>390</td><td>29</td><td></td><td></td></tr></tbody></table></div>
<p class="w-cap">Example: 3 groups of 10 plants. This is the “ANOVA table” printed in papers and software.</p>
<p>With only two groups, ANOVA and the equal-variance t-test are the same: F equals t² and the p-values agree.</p>
<p>A large F means between-group differences are much larger than within-group random variation: at least one group differs. But ANOVA does not tell you <b>which</b> groups differ; that needs <b>post hoc comparisons</b>, e.g. Tukey HSD, or pairwise comparisons with Holm/Bonferroni correction. This site's lab uses pairwise Welch t-tests with Holm correction.</p>
<p>The effect size η² (eta squared) = SS<sub>between</sub> ÷ SS<sub>total</sub>: the proportion of variation explained by group.</p>
<p class="note">With two factors (e.g. fertilizer × variety) use two-way ANOVA; with blocks or repeated measures use a model with blocks or a mixed model (see {{c4-6}}). In the lab, a block can be entered as a variable in linear regression.</p>`,
    quiz: [
      { q: `With the between-group gap fixed at 4, raising the within-group SD from 3 to 8 makes F?`, o: [`Smaller`, `Larger`, `Unchanged`, `Negative`], why: `F = between-group variability ÷ within-group variability; a larger denominator gives a smaller F and the groups become hard to tell apart.`, look: `The grey within-group bar gets longer and F falls.` },
      { q: `Between-group SS = 120 and within-group SS = 480. What is η²?`, o: [`0.2`, `0.25`, `4`, `600`], why: `Total SS = 120 + 480 = 600; η² = between SS ÷ total SS = 120 ÷ 600 = 0.2: group explains 20% of the variation.`, look: `Click the “total SS”, “between-group SS” and “within-group SS” cards to see how the distances add up; η² is the between-group share of the total.` },
      { q: `ANOVA gives p < 0.001. This means?`, o: [`At least one group mean differs from the others`, `All groups differ from one another`, `The control group is worst`, `The data are normal`], why: `ANOVA is an overall test; post hoc comparisons show which groups differ.`, look: `When the three means are clearly apart p is tiny, but A and C differ less than A and B: ANOVA does not tell you which groups differ.` },
      { q: `Baseline systolic BP across 8 hospitals: F = 18.3, η² = 0.25; age across the same hospitals: F = 0.40, η² = 0.007. What does η² = 0.25 mean?`, o: [`About 25% of the total variation in systolic BP comes from differences between hospitals`, `25% of the hospitals differ`, `There is a 25% chance the hospitals differ`, `The hospitals differ by 25 mmHg`], why: `η² = between SS ÷ total SS. Age hardly differs between hospitals, so its η² is near 0.`, look: `Click “between-group SS” and “total SS”: the between-group (red) share of the total is η². Then switch the variable to “age” and compare.` },
    ],
  },
  'anova-assume': {
    title: `ANOVA assumptions and alternatives`, refs: `Whitlock 13.1–13.3, 15.2; Rosner 8.6; Kirkwood ch. 13`,
    body: `<p>For ANOVA's p-value to be correct, three assumptions are needed. Checking them is not about “passing a test” but confirming the method suits your data.</p>
<ol><li><b>Independence</b>: each observation comes from a different experimental unit and they do not affect one another. Only the design can guarantee this — the data cannot reveal it; measuring the same animal many times violates it (see chapter {{c4-6}}).</li>
<li><b>Normality</b>: the <b>residuals</b> within each group (each value − its group mean) are approximately normal.</li>
<li><b>Homogeneity of variance</b>: the groups have roughly equal variances (squared standard deviations).</li></ol>
<h3>Checking normality: the Q-Q plot</h3>
<p>A <b>Q-Q plot</b> sorts the residuals and plots them against “where the i-th smallest value would be if the data were normal”. Points roughly on a straight line mean close to normal; ends curling up or down mean long tails or skewness. Small samples always bend somewhat; look for clear, systematic departures.</p>
<p class="note">With enough data per group, ANOVA tolerates non-normality well because it compares means, whose distribution approaches normal by the central limit theorem (chapter {{c2-2}}). The real worry is small samples with very skewed distributions or extreme values.</p>
<h3>Checking variances: Levene's test</h3>
<p><b>Levene's test</b> computes each value's distance from its group centre (median) and uses ANOVA to compare these distances across groups. A small p-value means the groups differ in spread. You can also compare the groups' standard deviations directly: the larger the ratio of the largest to the smallest, the clearer the difference.</p>
<p>The most dangerous case of unequal variances is when <b>the more variable group is smaller</b>: the false-positive rate of ordinary ANOVA clearly exceeds 5%. The interactive chart above simulates this.</p>
<h3>What to do when assumptions fail</h3>
<div class="tbl-wrap"><table class="st"><thead><tr><th>Situation</th><th>Approach</th></tr></thead><tbody>
<tr><td>Unequal group variances</td><td><b>Welch ANOVA</b>: a version of ANOVA that does not require equal variances — the same idea as the Welch t-test for two groups</td></tr>
<tr><td>Right-skewed data (concentrations, cell counts, viral load)</td><td><b>Log transformation</b>: take logs, then do ANOVA. Right-skewed data often become symmetric with more similar variances; interpret results as “fold” differences</td></tr>
<tr><td>Small samples, severe skew or many extreme values</td><td><b>Kruskal–Wallis</b>: compares groups using ranks without assuming normality (see chapter {{c3-5}})</td></tr>
<tr><td>Non-independent observations (repeated measures, clusters)</td><td>Repeated-measures ANOVA or mixed models, introduced later in this level</td></tr></tbody></table></div>
<p class="warn">Do not run a pile of assumption tests and then pick the method that turns out “significant”. Choose the method in advance from the nature of the data and the design, and write it into the statistical analysis plan.</p>`,
    quiz: [
      { q: `On a Q-Q plot of the residuals the points lie roughly on a straight line. This means?`, o: [`The residuals are close to normal`, `The group means are equal`, `The group variances are equal`, `The observations are independent`], why: `A Q-Q plot compares residuals with where they would be under normality; it does not check means, variances or independence.`, look: `Normal data, 30 per group: the points on the right-hand Q-Q plot follow the dashed line. Switch to “right-skewed” and compare the bending at the ends.` },
      { q: `Group variances differ a lot and the most variable group is the smallest. With no true difference, ordinary ANOVA's false-positive rate will?`, o: [`Clearly exceed 5%; use Welch ANOVA`, `Be exactly 5%`, `Be below 5%`, `Become 0`], why: `Ordinary ANOVA pools the group variances; when a small group is very variable the pooled estimate is too small and F too large. Welch ANOVA estimates each group's variance separately.`, look: `Simulation result: ordinary ANOVA's false-positive rate exceeds the 5% dashed line; Welch ANOVA's is close to 5%.` },
      { q: `Cell-concentration data are clearly right-skewed and the SDs grow with the means. A common approach is?`, o: [`Log-transform then do ANOVA, or use Kruskal–Wallis`, `Delete the largest values`, `Do nothing and run ANOVA`, `Use a chi-square test`], why: `Right-skewed data often become symmetric with similar variances after logging; deleting data is not legitimate.`, look: `Right-skewed data: the box plots have long upper tails and the right end of the Q-Q plot curls up.` },
      { q: `CRP in 4 age groups: on the original scale the box plots have long tails and the Q-Q plot curls up at the right; for ln(CRP) the Q-Q plot is close to straight. A better way to compare the 4 groups is?`, o: [`ANOVA on ln(CRP), or Kruskal–Wallis`, `ANOVA on raw CRP without looking at graphs`, `Delete the patients with the highest CRP`, `Compare only the groups with the highest and lowest means`], why: `Right-skewed data are often close to normal after logging; Kruskal–Wallis needs no normality assumption.`, look: `Study data: first look at CRP's Q-Q plot, then switch the variable to “ln(CRP)” to compare.` },
    ],
  },
  'posthoc': {
    title: `Planned and post hoc comparisons`, refs: `Whitlock 15.3–15.4; Rosner 12.4`,
    body: `<p>ANOVA only answers “are all the group means the same?”. When p is small, the next question is: <b>which groups differ?</b> That needs pairwise comparisons, but with many comparisons false positives accumulate.</p>
<div class="formula">m comparisons each at α = 0.05: probability of at least one false positive = 1 − 0.95<sup>m</sup><br>4 groups → 6 pairs → 1 − 0.95⁶ ≈ 26%</div>
<p>This probability of “at least one false positive in a whole family of comparisons” is the <b>familywise error rate</b> (FWER). How to handle it depends on whether the comparisons were planned.</p>
<h3>Planned (a priori) comparisons</h3>
<p>Deciding <b>before</b> seeing the data, from the research question, to compare only a few pairs — e.g. “each fertilizer versus control” — gives <b>planned comparisons</b>. They are few and well justified, and can use t-tests (with ANOVA's within-group mean square and df), needing only light correction when there are few. The standard method for comparing only with a control is <b>Dunnett's test</b>.</p>
<h3>Post hoc (unplanned) comparisons</h3>
<p>Deciding after seeing the data, or comparing every pair, are <b>post hoc comparisons</b>, and the familywise error rate must be controlled:</p>
<div class="tbl-wrap"><table class="st"><thead><tr><th>Method</th><th>Use</th><th>Properties</th></tr></thead><tbody>
<tr><td><b>Tukey HSD</b></td><td>All pairwise comparisons</td><td>Designed for “all pairs”, more powerful than Bonferroni; the most common in biomedical papers</td></tr>
<tr><td>Bonferroni / Holm</td><td>Any set of comparisons</td><td>General but conservative; Holm is never worse than Bonferroni</td></tr>
<tr><td>Dunnett</td><td>Each group only versus control</td><td>Fewer comparisons, more powerful than Tukey</td></tr></tbody></table></div>
<p><b>Tukey HSD</b>: divide each pair's difference by its standard error, q = |difference| ÷ √(within-group MS ÷ 2 × (1/n₁ + 1/n₂)), and compare with the <b>studentized range distribution</b>. That distribution describes “the gap between the largest and smallest of k means”, so it already accounts for comparing all pairs at once.</p>
<h3>Reading letter displays</h3>
<p>Biology papers often put letters such as a, b and ab above bars or box plots — a <b>compact letter display</b>: <b>groups sharing a letter are not significantly different</b>; only groups with no letter in common differ. E.g. groups labelled a and b differ; a group labelled ab does not differ significantly from either.</p>
<p class="warn">Do not look for the two groups that differ most and then test only that pair. You have effectively compared all pairs in your head — without correction.</p>`,
    quiz: [
      { q: `Comparing every pair among 4 groups (uncorrected), even with no true differences the probability of at least one p < 0.05 is about?`, o: [`About 26%`, `5%`, `About 20%`, `About 50%`], why: `4 groups give 6 pairs: 1 − 0.95⁶ ≈ 0.26.`, look: `The four groups are truly identical. Look at the “uncorrected” proportion in the simulation, about 1 − 0.95⁶.` },
      { q: `Three groups are labelled a, ab and b. Which two differ significantly?`, o: [`The groups labelled a and b`, `All three differ from one another`, `The ab group and the other two`, `None differ`], why: `A shared letter means no significant difference. ab shares a with a and b with b; only a and b have no letter in common.`, look: `Look at the letters above the box plots: groups sharing a letter do not differ significantly. Click the “letter display” card to compare.` },
      { q: `Planned before the experiment: we only want to know whether each of three treatments differs from control. A better approach is?`, o: [`Planned comparisons: only the three “treatment vs control” comparisons (e.g. Dunnett)`, `Always do Tukey on all 6 pairs`, `No comparisons are needed`, `Test only the pair that differs most`], why: `With few, pre-planned comparisons there is no need to pay in power for pairs you will not use.`, look: `Currently all 6 pairs are compared with Bonferroni correction. Comparing only “A, B, C each vs control” (3 pairs) would need much lighter correction and give narrower intervals.` },
      { q: `Baseline systolic BP in 4 age groups has Tukey letters 40–49 c, 50–59 bc, 60–69 ab, 70–80 a. Which is correct?`, o: [`40–49 and 60–69 differ (no shared letter)`, `50–59 and 60–69 differ`, `All four differ from one another`, `None of the four differ`], why: `Groups sharing at least one letter are not judged different; c and ab share no letter.`, look: `Study data: look at the letters above the box plots, then at the forest plot below: pairs whose interval excludes 0 differ.` },
    ],
  },
  'twoway': {
    title: `Two-way ANOVA and interaction`, refs: `Whitlock 14.4, 18.3; Rosner 12.6`, labs: [`Two-way ANOVA: genotype × diet`],
    body: `<p>Many experiments manipulate two factors at once, e.g. <b>genotype</b> (wild-type WT / knockout KO) × <b>diet</b> (normal / high-fat). A design with experimental units in every combination is a <b>factorial design</b>. A 2 × 2 factorial has 4 combinations, and one experiment answers three questions.</p>
<div class="tbl-wrap"><table class="st"><thead><tr><th>Question</th><th>Name</th></tr></thead><tbody>
<tr><td>On average, does a high-fat diet increase weight?</td><td>The <b>main effect</b> of diet</td></tr>
<tr><td>On average, does weight gain differ between KO and WT?</td><td>The main effect of genotype</td></tr>
<tr><td>Is the effect of a high-fat diet the same in KO and WT?</td><td>The genotype × diet <b>interaction</b></td></tr></tbody></table></div>
<p>A <b>main effect</b> is the effect of one factor averaged over the levels of the other. An <b>interaction</b> means the effect of one factor depends on the level of the other.</p>
<h3>Interaction plots</h3>
<p>An <b>interaction plot</b> puts one factor on the x-axis, draws one coloured line per level of the other, and each point is the mean of one combination.</p>
<ul><li>Lines <b>parallel</b>: no interaction. The diet effect is the same in both genotypes.</li><li>Lines <b>not parallel</b>, or even crossing: an interaction. E.g. a high-fat diet adds 6 g in WT but only 2 g in KO.</li></ul>
<h3>The two-way ANOVA table</h3>
<p>The total sum of squares splits into four parts, each with its own F:</p>
<div class="tbl-wrap"><table class="st"><thead><tr><th>Source</th><th>Degrees of freedom (A has a levels, B has b levels, N observations)</th></tr></thead><tbody>
<tr><td>Factor A</td><td>a − 1</td></tr><tr><td>Factor B</td><td>b − 1</td></tr><tr><td>A × B interaction</td><td>(a − 1)(b − 1)</td></tr><tr><td>Residual</td><td>N − a × b</td></tr></tbody></table></div>
<p>Each combination needs at least 2 experimental units to estimate the residual. A <b>balanced design</b>, with equal numbers in each combination, is easiest to interpret; with unequal numbers, different software sums of squares (Type I, II, III) can give different results. This site's lab uses Type II.</p>
<h3>Interpreting a significant interaction</h3>
<p>With a significant interaction, a main effect averages effects of different direction or size, and reporting it alone can mislead. Report <b>simple effects</b> instead: the effect of one factor within each level of the other, e.g. “in WT mice the high-fat diet added 6 g; in KO mice it added 2 g”.</p>
<p class="warn">Do not run two separate one-way analyses (one for WT, one for KO) and conclude the effects differ because “one is significant and the other is not”. To know whether effects differ, test the interaction directly (chapter {{c5-4}} returns to this).</p>`,
    quiz: [
      { q: `On an interaction plot the two lines are perfectly parallel. This means?`, o: [`No interaction: one factor's effect is the same at every level of the other`, `Neither factor has an effect`, `Both main effects must be significant`, `The data are not normal`], why: `Parallel lines keep the same gap at every x position: the effect does not change with the other factor.`, look: `Interaction set to 0: the lines are parallel. Click “interaction F”: the dashed line (where it would be with no interaction) almost coincides with the solid one.` },
      { q: `A high-fat diet adds 6 g in WT mice but only 2 g in KO mice, and the interaction is significant. The best way to report this is?`, o: [`Report the diet effect separately for each genotype (simple effects)`, `Report only the main effect of diet (about 4 g on average)`, `Delete the KO mice`, `Run two t-tests and see which is significant`], why: `With a significant interaction, the averaged main effect (about 4 g) describes neither genotype.`, look: `The lines are not parallel. Click the two “simple effect” cards to compare how much WT and KO gain on the high-fat diet; the diet main effect is their average.` },
      { q: `A 2 × 3 factorial design with 5 experimental units per combination. How many degrees of freedom does the interaction have?`, o: [`2`, `6`, `5`, `24`], why: `(2 − 1) × (3 − 1) = 2. The residual has 30 − 6 = 24.`, look: `This is a 2 × 2 design: interaction df (2 − 1)(2 − 1) = 1, residual 20 − 4 = 16. Compare with the ANOVA table below, then think about the 2 × 3 case.` },
      { q: `Study data: the group × smoking interaction for the week-12 change has F = 0.49, p = 0.49, and the two lines are roughly parallel. What does this mean?`, o: [`The new drug lowers blood pressure by a similar amount in smokers and non-smokers`, `Smoking makes the new drug ineffective`, `The new drug has no effect`, `Smokers always have higher blood pressure`], why: `An interaction describes whether one factor's effect changes with another; roughly parallel lines mean similar effects.`, look: `Study data: the two lines are nearly parallel; click the two “simple effect” cards to compare the drug effect in smokers and non-smokers.` },
    ],
  },
});
