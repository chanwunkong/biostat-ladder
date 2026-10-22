/* English content: rest of Level 3, start of Level 4 */
Object.assign(I18N.packs.en.ch, {
  'c2-4': {
    title: `Hypothesis tests and p-values`, wtitle: `p-values from 1,000 experiments`, refs: `Whitlock ch. 6; Rosner 7.1–7.5; Kirkwood ch. 8`,
    body: `<ol><li>State the <b>null hypothesis</b> H<sub>0</sub> (e.g. the two group means are equal) and the alternative H<sub>1</sub>.</li><li>Choose the significance level α in advance (usually 0.05).</li><li>Compute a test statistic from the data (t, χ², F…).</li><li>Compute the p-value: <b>if H<sub>0</sub> were true</b>, the probability of a result at least this extreme.</li><li>Reject H<sub>0</sub> when p &lt; α.</li></ol>
<div class="tbl-wrap"><table class="st"><thead><tr><th></th><th>H<sub>0</sub> true (no real difference)</th><th>H<sub>0</sub> false (a real difference)</th></tr></thead><tbody><tr><td>Reject H<sub>0</sub></td><td>Type I error (false positive), probability α</td><td>Correct, probability = power 1 − β</td></tr><tr><td>Do not reject H<sub>0</sub></td><td>Correct</td><td>Type II error (false negative), probability β</td></tr></tbody></table></div>
<h3>What a p-value is NOT (American Statistical Association statement, 2016)</h3>
<ul><li>The p-value is <b>not</b> the probability that H<sub>0</sub> is true.</li><li>p &gt; 0.05 does <b>not</b> mean there is no difference; the sample may simply be too small.</li><li>A small p does <b>not</b> mean a large or clinically important effect.</li><li>Do not draw conclusions from p &lt; 0.05 alone; always report the effect size and confidence interval.</li></ul>
<h3>Effect size</h3>
<p>p-values depend on sample size, so we also need a number describing “how big the difference is”: the <b>effect size</b>. The most common is <b>Cohen's d</b> = difference in means ÷ standard deviation, i.e. the difference in units of standard deviations. d = 0 means no difference; d = 0.5 means half a standard deviation.</p>
<p>The simulator above repeats a two-group experiment 1,000 times. First choose two groups that do not truly differ (H<sub>0</sub> true) and look at the p-values; then switch to groups that do differ.</p>`,
    quiz: [
      { q: `The correct interpretation of p = 0.03 is?`, o: [`If H0 were true, the probability of a result at least this extreme is 3%`, `The probability that H0 is true is 3%`, `There is a 97% chance the conclusion is correct`, `The effect is large`], why: `The p-value is computed assuming H0 is true; it cannot tell you the probability that H0 is true.`, look: `Both groups are placebo patients (H₀ true), yet the p-values are spread from 0 to 1; p-values are computed assuming H₀ is true.` },
      { q: `In the simulator, choose “placebo vs placebo” (no real difference). About what proportion of experiments give p < 0.05?`, o: [`About 5%`, `About 0%`, `About 50%`, `About 95%`], why: `When H0 is true, p-values are uniformly distributed between 0 and 1, so about 5% fall below 0.05: the type I error rate.`, look: `With no real difference, look at the proportion of red bars (p < 0.05). Then switch to “new drug vs placebo” and compare.` },
    ],
  },
  'one-t': {
    title: `The one-sample t-test and its link to confidence intervals`, refs: `Whitlock 11.2; Rosner 7.3–7.5; UTHealth GSBS syllabus week 2`,
    body: `<p>Sometimes we compare not two groups but one sample with a <b>known reference value</b> μ₀: healthy body temperature 37.0 °C, the labelled concentration of a reagent, a population mean from the literature, a theoretical prediction. This calls for the <b>one-sample t-test</b>.</p>
<div class="formula">null hypothesis H₀: μ = μ₀<br>t = (x̄ − μ₀) ÷ (s ÷ √n)　　degrees of freedom = n − 1</div>
<p>Example: 10 people's body temperature has mean 36.8 °C and SD 0.3. t = (36.8 − 37.0) ÷ (0.3 ÷ √10) ≈ −2.11, 9 degrees of freedom, two-sided p ≈ 0.064.</p>
<h3>Tests and confidence intervals are two sides of one coin</h3>
<p>For the same data, a two-sided test (α = 0.05) and a 95% confidence interval always agree:</p>
<ul><li>μ₀ lies <b>outside</b> the 95% confidence interval ⇔ p &lt; 0.05</li><li>μ₀ lies inside the 95% confidence interval ⇔ p ≥ 0.05</li></ul>
<p>So besides “is it different”, a confidence interval tells you “the range of true values compatible with the data” — more information than a single p-value. That is why journals require confidence intervals.</p>
<h3>Relation to the paired t-test</h3>
<p>The paired t-test (chapter {{c3-1}}) is simply: compute each person's difference (after − before), then do a one-sample t-test of the differences against μ₀ = 0.</p>
<p class="note">The one-sample t-test has the same assumptions as other t-tests: independent observations and data (or, with enough data, the mean) close to normal. For very skewed data, the Wilcoxon signed-rank test compares the median with the reference value.</p>`,
    quiz: [
      { q: `30 patients in hospital H1 have mean baseline systolic BP 156.9 and SD 11.7. Compared with a reference value of 150, t is about?`, o: [`3.23`, `0.59`, `6.9`, `−3.23`], why: `SE = 11.7 ÷ √30 ≈ 2.14; t = (156.9 − 150) ÷ 2.14 ≈ 3.23.`, look: `Click the “t” card: how many standard errors the mean is from μ₀.` },
      { q: `A sample mean has a 95% confidence interval of 36.6 to 37.0. Testing μ₀ = 37.1, the two-sided p-value is?`, o: [`Less than 0.05`, `Greater than 0.05`, `Exactly 0.05`, `Cannot tell`], why: `37.1 lies outside the 95% confidence interval, so the corresponding two-sided test has p < 0.05.`, look: `H1's 95% CI is about 152.5 to 161.3. μ₀ = 165 is outside: p < 0.05. Drag μ₀ back inside (e.g. 155) and compare.` },
      { q: `The paired t-test is really?`, o: [`A one-sample t-test of each person's differences against μ₀ = 0`, `A Welch t-test of two independent groups`, `A chi-square test`, `A t-test of the two measurements added together`], why: `A paired design is only interested in each person's change, so it is a one-sample test on the differences.`, look: `Switch the variable to “week 4 − baseline”: each point is one person's change, compared with μ₀ = 0 — that is the paired t-test.` },
    ],
  },
  'binom-test': {
    title: `Testing a single proportion: the binomial test`, refs: `Whitlock 7.2; Rosner 7.9`, labs: [`BP trial: proportion with adverse events vs 10%`],
    body: `<p>The one-sample t-test compares a mean with a reference value; proportions have a counterpart. Example: in Mendel's pea crosses, theory predicts purple : white = 3 : 1, i.e. a purple proportion p₀ = 0.75. He observed 705 purple plants out of 929 (75.9%). Is that consistent with 0.75?</p>
<div class="formula">null hypothesis H₀: p = p₀</div>
<h3>The exact binomial test</h3>
<p>If H₀ is true, the number of purple plants among n follows a binomial distribution with n and p₀ (chapter {{binom}}). The <b>exact binomial test</b> uses this distribution directly: add up the probabilities of all outcomes “as unlikely as or less likely than the one observed” to get the two-sided p-value. For Mendel's data p ≈ 0.54, consistent with 3 : 1.</p>
<h3>The z-test using the normal approximation</h3>
<div class="formula">z = (x − n × p₀) ÷ √(n × p₀ × (1 − p₀))</div>
<p>With large samples a normal approximation z can be used. The two differ with small samples; since computers make the exact test easy, use the exact test.</p>
<p class="note">Report a confidence interval for the proportion as well as the p-value (chapter {{prop-ci}}). With more than two categories (e.g. 9 : 3 : 3 : 1) use the chi-square goodness-of-fit test of the next chapter.</p>`,
    quiz: [
      { q: `A litter has 20 mice; the expected proportion male is 0.5 and 7 males are observed. The two-sided exact binomial p-value is about?`, o: [`0.26`, `0.13`, `0.05`, `0.35`], why: `P(X ≤ 7) + P(X ≥ 13) ≈ 0.132 × 2 ≈ 0.26. 0.13 is one-sided.`, look: `“Adjust it yourself”: the red bars are 7 or fewer and 13 or more (equally or more extreme). Click “exact binomial test p-value”.` },
      { q: `What do the red bars on the binomial test chart represent?`, o: [`Outcomes as unlikely as or less likely than the one observed, assuming H₀ is true; their probabilities add up to the p-value`, `The observed count`, `The confidence interval`, `The distribution under the alternative hypothesis`], why: `The p-value is the probability, under H₀, of a result “at least this extreme”.`, look: `Observing 4 mice: only a few short red bars remain at the ends, so the p-value is smaller.` },
      { q: `A cross is expected to give a purple proportion of 0.75; 705 of 929 plants are purple. The most appropriate analysis is?`, o: [`An exact binomial test (p₀ = 0.75)`, `An independent two-sample t-test`, `A paired t-test`, `A correlation analysis`], why: `One sample, one binary outcome, compared with a known expected proportion: the binomial test.`, look: `A scaled-down Mendel experiment: 76 purple out of 100 with expected 0.75; the observed value sits right next to the green dashed line (expected value).` },
      { q: `In hospital H1, 8 of 13 new-drug patients had a fall of ≥ 10 mmHg. Compared with an expected proportion of 0.3, the exact binomial p-value is about?`, o: [`0.028`, `0.62`, `0.30`, `0.78`], why: `If the true proportion were 0.3, about 3.9 of 13 would be expected; the probability of 8 or a more extreme result is about 0.028.`, look: `The black line is the observed 8; the green dashed line is the expected value 3.9 under H₀; the red bars add up to the p-value.` },
    ],
  },
  'gof': {
    title: `The chi-square goodness-of-fit test`, refs: `Whitlock 8.1–8.3; Rosner 10.7`,
    body: `<p>The binomial test handles only two categories. With three or more, the question “do the observed counts match some expected proportions?” is answered by the <b>chi-square goodness-of-fit test</b>. The classic example is Mendel's dihybrid cross: round-yellow, wrinkled-yellow, round-green and wrinkled-green peas, expected 9 : 3 : 3 : 1. He observed 315, 108, 101 and 32 (556 in total).</p>
<h3>Steps</h3>
<ol><li>Compute each category's <b>expected count</b>: total × expected proportion. E.g. round-yellow 556 × 9/16 = 312.75.</li>
<li>For each category compute (observed − expected)² ÷ expected and add them up to get χ². The closer observed and expected, the smaller χ².</li>
<li>Degrees of freedom = number of categories − 1 (subtract one more for each parameter of the expected proportions estimated from the same data).</li>
<li>Compare with the χ² distribution to get the p-value.</li></ol>
<p>Mendel's data: χ² = 0.47, 3 degrees of freedom, p = 0.93 — a very close match to 9 : 3 : 3 : 1.</p>
<h3>Assumptions</h3>
<ul><li>Each observation is independent and belongs to exactly one category.</li>
<li>Expected counts must not be too small. Whitlock recommends: no category with an expected count below 1, and no more than 20% of categories below 5. Otherwise merge adjacent categories or use an exact test.</li></ul>
<p class="note">With only two categories, the chi-square goodness-of-fit test and the z approximation of the binomial test are the same thing (χ² = z²). Applied to a contingency table (chapter {{c3-3}}) the chi-square test asks whether two variables are related; applied to one variable it asks whether its distribution matches expectations.</p>`,
    quiz: [
      { q: `Mendel's dihybrid cross has 4 phenotypes, expected 9 : 3 : 3 : 1. How many degrees of freedom does the goodness-of-fit test have?`, o: [`3`, `4`, `1`, `555`], why: `Degrees of freedom = categories − 1 = 4 − 1 = 3.`, look: `“Adjust it yourself”: Mendel's 4 categories; the title of the χ² distribution below says 3 degrees of freedom.` },
      { q: `Mendel's data give χ² = 0.47, p = 0.93. What does this mean?`, o: [`The observed counts are very close to the 9 : 3 : 3 : 1 expectation`, `The counts deviate significantly from expectation`, `It proves 9 : 3 : 3 : 1 is correct`, `The sample is too small`], why: `A small χ² means observed and expected are close; a large p means no evidence of a mismatch — which does not “prove” the theory.`, look: `Click “χ²”: the red line for each category (observed minus expected) is short and the p-value is large. Switch to 1 : 1 : 1 : 1 to compare.` },
      { q: `One category has an expected count of only 2.1; all others exceed 10. A reasonable approach is?`, o: [`Merge it with an adjacent category, or use an exact test`, `Delete that category's data`, `Calculate as usual`, `Round the expected count up to 5`], why: `With small expected counts the chi-square approximation is inaccurate; merge categories or use an exact test.`, look: `With only 36 peas in total, the expected count for wrinkled-green is only about 2.3. Click “smallest expected count”.` },
      { q: `The study's age-group counts are 62, 140, 142 and 56. Compared with expected proportions 2 : 3 : 3 : 2, χ² = 18.6, 3 degrees of freedom, p < 0.001. What does this mean?`, o: [`The observed age distribution differs a lot from 2 : 3 : 3 : 2 (the middle groups exceed expectation)`, `The age groups match expectation exactly`, `The degrees of freedom are wrong`, `The sample is too small`], why: `The expected counts are 80, 120, 120 and 80; the middle groups each have about 20 more and the outer groups about 20 fewer, which gives the large χ².`, look: `Compare the blue (observed) and grey (expected) bars for each group; click “χ²” to see the red gaps.` },
    ],
  },
  'boot': {
    title: `Bootstrap and permutation tests`, refs: `Whitlock 13.8, ch. 19; Rosner 6.11, 9.6`,
    body: `<p>The methods so far rely on a theoretical distribution (normal, t, χ²). Since computers became common, two methods that need no such formulas — they simply resample the data repeatedly — have become increasingly popular in biology.</p>
<h3>Permutation tests: build the null distribution yourself</h3>
<p>When comparing two groups, if the null hypothesis is true (group and outcome are unrelated), the labels saying who belongs to which group are effectively random. A <b>permutation test</b>:</p>
<ol><li>Compute the observed difference in means.</li><li><b>Shuffle</b> the group labels at random, split the data into two groups again and compute the difference.</li><li>Repeat thousands of times to obtain “the distribution of differences under the null hypothesis”: the <b>null distribution</b>.</li><li>p-value = the proportion of shuffled differences as extreme as or more extreme than the observed one.</li></ol>
<p>A permutation test needs no normality assumption, only that observations are exchangeable under the null hypothesis. It is especially useful for small samples of unknown shape.</p>
<h3>The bootstrap: uncertainty for any statistic</h3>
<p>To get a standard error or confidence interval for a median, a ratio or a correlation when there is no simple formula, use the <b>bootstrap</b>:</p>
<ol><li><b>Sample with replacement</b> from the original data, drawing as many observations as there are (some values may be drawn several times, some not at all).</li><li>Compute the statistic on this resample.</li><li>Repeat thousands of times to get the statistic's distribution.</li><li>Take its 2.5th and 97.5th percentiles as the 95% confidence interval (percentile method).</li></ol>
<p>The idea of the bootstrap: treat your sample as a miniature of the population and resample from it to mimic how much results would vary if you resampled the population.</p>
<p class="note">Both require independent observations; with very small samples bootstrap intervals may be too narrow. More resamples give more stable results; use at least 1,000.</p>`,
    quiz: [
      { q: `How is the null distribution of a permutation test obtained?`, o: [`Shuffle the group labels many times and recompute the difference between groups each time`, `Assume the data are normal`, `Resample the data with replacement`, `Sort each group's data`], why: `If the null hypothesis is true the labels are interchangeable; the differences from shuffled labels show how large a difference chance alone produces.`, look: `Top: the two groups after shuffling. Press “resample once” several times — the difference changes each time; press “resample 2000 times” to get the null distribution.` },
      { q: `How does the bootstrap resample?`, o: [`Draw the same number of observations from the original data with replacement`, `Draw half the data without replacement`, `Generate new data from a normal distribution`, `Shuffle the group labels`], why: `Sampling with replacement makes each resample slightly different, mimicking the variability of sampling from the population.`, look: `In the resample some values appear twice or more and some not at all: that is sampling with replacement.` },
      { q: `The easiest way to get a 95% confidence interval for the median of skewed data is?`, o: [`Bootstrap: resample thousands of times and take the 2.5th and 97.5th percentiles of the medians`, `Mean ± 1.96 × SD`, `A chi-square test`, `Median ± 1.96`], why: `There is no simple formula for the standard error of a median; the bootstrap estimates its distribution directly from the data.`, look: `Click “bootstrap 95% confidence interval”: the red line runs from the 2.5th to the 97.5th percentile of 2000 medians.` },
    ],
  },
  'c4-5': {
    title: `Power and sample size`, wtitle: `Sample size calculator`, refs: `Whitlock 14.6; Rosner 7.6–7.7, 8.9; Kirkwood ch. 35`,
    body: `<p>The question reviewers and ethics committees ask most: “how was the sample size chosen?” Sample size involves four quantities; knowing three gives the fourth:</p>
<ul><li>α (usually 0.05, two-sided)</li><li>power 1 − β (usually 0.8 or 0.9)</li><li>expected effect size: the smallest clinically meaningful difference ÷ SD, or the two groups' proportions</li><li>sample size n</li></ul>
<div class="formula">comparing two means, per group n ≈ 2 (z<sub>1−α/2</sub> + z<sub>1−β</sub>)² ÷ d²</div>
<p>State the basis for the effect size: a pilot study, the literature, or the minimal clinically important difference (MCID). Do not work backwards from the sample size you want.</p>
<p class="warn">Computing “observed power” after the study is meaningless — it is just another way of writing the p-value. When results are not significant, look at what effect sizes the confidence interval can rule out.</p>
<p>A <b>one-sided test</b> tests only one direction (e.g. only “is the new drug better”). Switching to one-sided after the fact, or using it without good reason, is not acceptable; studies normally use two-sided tests.</p>
<p>Remember dropout: if 15% are expected to be lost, divide n by 0.85.</p>`,
    quiz: [
      { q: `All else equal, if the effect size to be detected is halved, the required sample size is about?`, o: [`4 times`, `2 times`, `Half`, `Unchanged`], why: `n is proportional to 1 ÷ d².`, look: `The difference halves from 5 to 2.5. Compare with “per group required” at Δ = 5 (64).` },
      { q: `A study finishes with p = 0.3 and a reviewer questions its power. A better response is?`, o: [`Report the effect size with its 95% CI and explain how large an effect the data can rule out`, `Compute observed power`, `Switch to a one-sided test`, `Keep recruiting until it is significant`], why: `The confidence interval directly shows which effect sizes are compatible with the data; the other three are poor practice.`, look: `Sample size should be fixed before the study starts; the basis is listed in “Reporting the numbers” below.` },
      { q: `Planning the next trial from this study: the SD of the week-12 change is about 10 mmHg and we want to detect 5 mmHg (α = 0.05, 80% power). About how many per group (before dropout)?`, o: [`64`, `16`, `200`, `32`], why: `d = 5 ÷ 10 = 0.5; per group n ≈ 2 × (1.96 + 0.84)² ÷ 0.5² ≈ 63, rounded up to 64.`, look: `Press “fill in from the study data”: the SD comes from this study's data. Click “per group required”.` },
    ],
  },
  'c5-1': {
    title: `Study design and bias`, refs: `Rosner 13.2; Kirkwood ch. 34`,
    body: `<div class="tbl-wrap"><table class="st"><thead><tr><th>Design</th><th>Direction in time</th><th>Can estimate</th><th>Main limitations</th></tr></thead><tbody>
<tr><td>Randomized controlled trial (RCT)</td><td>Prospective</td><td>RR, mean difference, HR; causal inference</td><td>Expensive, limited generalizability</td></tr>
<tr><td>Cohort study</td><td>Prospective or retrospective</td><td>Incidence, RR, HR</td><td>Confounding, loss to follow-up</td></tr>
<tr><td>Case-control study</td><td>Retrospective</td><td>OR</td><td>Recall bias, choice of controls</td></tr>
<tr><td>Cross-sectional study</td><td>One time point</td><td>Prevalence, prevalence ratio</td><td>Cannot establish temporal order</td></tr>
<tr><td>Laboratory experiment</td><td>Controlled conditions</td><td>Treatment effect</td><td>Pseudoreplication, batch effects</td></tr></tbody></table></div>
<h3>Three major sources of bias</h3>
<ul><li><b>Selection bias</b>: participants do not represent the target population, e.g. only hospitalized patients are recruited.</li><li><b>Information bias</b>: errors in measurement or classification, e.g. cases recall past exposures better than controls.</li><li><b>Confounding</b>: a third variable affects both exposure and outcome, e.g. age affects both smoking habits and cardiovascular disease.</li></ul>
<p>Statistical methods can adjust for <b>measured</b> confounders but cannot fix design errors. Before analysing, draw a causal diagram (DAG) and think about which variables should and should not be adjusted for — e.g. do not adjust for a mediator lying on the causal path.</p>
<p>On a causal diagram, a path from exposure to outcome that runs through a confounder is a <b>backdoor path</b>, e.g. “coffee ← smoking → lung cancer”. Adjusting for the confounder blocks the backdoor path, leaving only the effect you want to estimate.</p>
<p class="note">In experimental biology pay particular attention to: randomizing treatments, blinding the person measuring, setting exclusion criteria in advance, and recording batch (different days, different machines) as a variable.</p>`,
    quiz: [
      { q: `A study of coffee and lung cancer finds a positive association, but coffee drinkers also smoke more. Smoking here is a?`, o: [`Confounder`, `Mediator`, `Outcome variable`, `Selection bias`], why: `Smoking is related to both the exposure (coffee) and the outcome (lung cancer) and is not on the causal path between them.`, look: `Smoking points to both coffee and lung cancer. After adjusting for smoking, the OR returns to about 1.` },
      { q: `Coffee truly has no effect (true OR = 1). Without adjusting for smoking, the estimated OR will be?`, o: [`Above 1 — coffee looks harmful`, `Equal to 1`, `Below 1`, `Cannot be estimated`], why: `Smokers drink more coffee and get more lung cancer; this backdoor path makes coffee look harmful.`, look: `Look at where the red “unadjusted OR” lies.` },
      { q: `In the study data, the crude odds ratio of a cardiovascular event for diabetes is 2.81; after adjusting by three age strata it becomes 2.31. What role does age play?`, o: [`Confounder: age affects both diabetes and cardiovascular events`, `Mediator`, `Outcome variable`, `Unrelated to both`], why: `Older people are more likely to have diabetes and to have cardiovascular events, so the unadjusted estimate includes the effect of age.`, look: `Study data: switch between “unadjusted” and “adjust for the confounder” and compare the two ORs. The red arrows are the backdoor path through age.` },
    ],
  },
  'c3-1': {
    title: `Comparing two groups: the t-test`, refs: `Whitlock ch. 12; Rosner ch. 8; Kirkwood ch. 7`, labs: [`Compare week-12 blood pressure between groups`, `Compare before and after treatment (paired)`],
    body: `<p>Comparing the means of two groups. First identify the data structure:</p>
<div class="tbl-wrap"><table class="st"><thead><tr><th>Situation</th><th>Method</th><th>Example</th></tr></thead><tbody><tr><td>The two groups are different individuals</td><td>Independent-samples t-test (Welch version recommended)</td><td>Blood pressure, drug vs placebo group</td></tr><tr><td>The same individuals measured twice</td><td>Paired t-test</td><td>The same patients before vs after treatment</td></tr></tbody></table></div>
<div class="formula">Welch t = (x̄<sub>1</sub> − x̄<sub>2</sub>) ÷ √(s<sub>1</sub>²/n<sub>1</sub> + s<sub>2</sub>²/n<sub>2</sub>)</div>
<p>The numerator is the signal (how different), the denominator the noise (the standard error of that difference). The larger t, the less it looks like pure chance.</p>
<p><b>Why default to Welch?</b> The classic Student t-test assumes equal variances in the two groups; Welch's version does not, and loses almost nothing when the variances really are equal.</p>
<p><b>Effect size, Cohen's d</b> = difference in means ÷ pooled standard deviation. Roughly 0.2 small, 0.5 medium, 0.8 large — only a rough guide; judge by clinical meaning in the end.</p>
<p class="note">A paired design has more power than an independent one because each person is their own control, removing between-person differences. Analysing paired data as if independent is a common mistake.</p>`,
    quiz: [
      { q: `With a mean difference of 6, SD 12 and 20 per group, p is about 0.12. If each group grows to 80, the p-value will?`, o: [`Get smaller: the standard error shrinks and t grows`, `Get larger`, `Stay the same`, `Become 0.12 × 4`], why: `Standard error = SD × √(2/n); 4 times the n halves the standard error, doubles t and lowers p.`, look: `First look at t and p at n = 80, then drag n back to 20 to compare.` },
      { q: `A large t statistic means?`, o: [`The difference between groups is large relative to its uncertainty`, `Both groups are large`, `The data must be normal`, `The effect is clinically important`], why: `t = difference ÷ standard error measures the signal-to-noise ratio; it does not directly indicate clinical importance.`, look: `With a large signal and little noise, t is far out in the tail and the red area (p-value) is almost invisible.` },
      { q: `In the study data, t for the “week-12 change” across all hospitals is about −10.7; for the “week-4 change” in hospital H1 alone it is only −0.43. What is the main difference?`, o: [`H1's week-4 signal (mean difference 1.6) is much smaller, and with few patients per group its noise (standard error) is large`, `H1's data must be wrong`, `Week-4 blood pressure cannot be t-tested`, `The two t values are calculated differently`], why: `t = signal ÷ noise. All hospitals at week 12: difference about 9.8, standard error about 0.92; H1 at week 4: difference 1.6, standard error about 3.7.`, look: `First look at H1 at week 4: the two distributions overlap heavily and t is small. Then switch the hospital to “all hospitals” and the comparison to “week 12” and watch t change.` },
    ],
  },
  'two-assume': {
    title: `Assumptions for comparing two groups, transformations and extreme values`, refs: `Whitlock 13.1–13.3; Rosner 8.6, 8.10; Kirkwood ch. 13`, labs: [`Two-group comparison: try “log first”`],
    body: `<p>For the p-value of a two-group t-test (chapter {{c3-1}}) to be reliable, three assumptions are needed: <b>independent</b> observations, data in each group (or, with large samples, the mean) <b>close to normal</b>, and — only for the classic Student t-test — <b>equal variances</b> in the two groups.</p>
<h3>Checking normality</h3>
<p>The most useful checks are graphical: histograms, box plots and each group's Q-Q plot (chapter {{anova-assume}}). Formal normality tests exist (e.g. Shapiro–Wilk), but they have little power with small samples and flag tiny deviations with large ones, so do not use them mechanically to choose a method.</p>
<h3>Are the variances equal?</h3>
<p>The traditional way to compare two variances is the <b>F-test</b> (F = s₁² ÷ s₂²), but it is very sensitive to non-normality and not recommended; Levene's test is more robust. In practice it is simpler to <b>default to the Welch t-test</b>, which does not require equal variances and loses almost nothing when they are equal.</p>
<h3>Transformations</h3>
<p>Biological data are often right-skewed: concentrations, cell counts, enzyme activities, gene expression. Such data usually behave multiplicatively (a treatment multiplies values) and the standard deviation grows with the mean.</p>
<ul><li><b>Log transformation</b>: after taking logs the data are often symmetric and the variances more similar. A t-test on logged data gives a mean difference that, exponentiated, is the ratio of the two <b>geometric means</b>, e.g. “the treated group is 1.8 times the control (95% CI 1.3–2.5)”. Data containing 0 cannot be logged directly.</li>
<li><b>Square-root transformation</b>: often used for count data.</li></ul>
<p>Report transformed results in terms of the original scale, and state in the methods which transformation was used.</p>
<h3>Extreme values</h3>
<p>When you meet an unusually large or small value:</p>
<ol><li>First check whether it is a data-entry or measurement error; only correct or exclude it if it is an error, and say so in the paper.</li>
<li>Never delete it just because it is “too extreme” or “makes the result non-significant” — that introduces bias.</li>
<li>Do a <b>sensitivity analysis</b>: compare results with and without the value, or use a method less affected by extremes (medians, nonparametric methods such as Mann–Whitney, introduced in the next chapter), and see whether the conclusion changes.</li></ol>`,
    quiz: [
      { q: `Right-skewed concentration data in two groups are log-transformed and t-tested; the mean difference is 0.59. What does e^0.59 ≈ 1.8 mean?`, o: [`The second group's geometric mean is about 1.8 times the first's`, `The means differ by 1.8`, `The second group is 1.8% higher`, `The p-value is 1.8`], why: `A difference on the log scale becomes a ratio (fold change) on the original scale — a ratio of geometric means.`, look: `After logging, both groups become symmetric. Click the last card: the ratio of geometric means is about 1.25, i.e. smokers' CRP is about 1.25 times non-smokers' (the question's 1.8 means the same kind of thing).` },
      { q: `The data contain one unusually large value. The most appropriate handling is?`, o: [`First check whether it is an error; if not, keep it and do a sensitivity analysis with and without it`, `Delete it because it is extreme`, `Always replace it with the median`, `Collect new data until there are no extremes`], why: `Deleting values just because they are extreme biases results; checking for errors and reporting a sensitivity analysis is correct.`, look: `The non-smoking group now has an extreme value of 40 mg/L: compare the Welch t and Mann–Whitney p-values, then tick “log first” and compare again. That is a sensitivity analysis.` },
      { q: `The two groups' standard deviations differ 2.5-fold. Before using the Welch t-test, must you show the variances are equal?`, o: [`No: the Welch t-test does not require equal variances`, `Yes, do an F-test first`, `Yes, otherwise the groups cannot be compared`, `Switch to a chi-square test`], why: `Only the classic Student t-test assumes equal variances.`, look: `On the original scale the two groups' standard deviations differ (look at the box heights); the Welch t-test does not need equal variances.` },
    ],
  },
  'nonpar': {
    title: `Nonparametric methods: sign test, Wilcoxon, Mann–Whitney`, refs: `Whitlock 13.4–13.7; Rosner 9.2–9.4`,
    body: `<p>When samples are small, clearly skewed, contain extreme values, or are only ordinal (e.g. pain scores), and transformation does not help, use <b>nonparametric methods</b>. They do not assume normality and mostly work with <b>ranks</b>.</p>
<h3>Paired data: the sign test</h3>
<p>The simplest method: look only at whether each pair's difference is positive or negative (ignore zeros). If the null hypothesis is true (median difference 0), plus and minus are equally likely and the number of pluses follows a binomial distribution with p = 0.5 (chapter {{binom-test}}). Example: after treatment 7 of 8 mice go up and 1 goes down; two-sided p ≈ 0.07. The sign test uses only the signs and discards the size of the differences, so it has less power.</p>
<h3>Paired data: the Wilcoxon signed-rank test</h3>
<ol><li>Compute each pair's difference and drop zeros.</li><li>Rank the <b>absolute values</b> of the differences from smallest to largest, giving ties the average rank.</li><li>Add up the ranks of the positive differences to get the statistic V.</li><li>The further V is from its expected value under the null (half the total of all ranks), the smaller the p-value.</li></ol>
<p>It uses both the signs and the order of the sizes of the differences, so it is more powerful than the sign test — the most common nonparametric alternative to the paired t-test.</p>
<h3>Two independent groups: the Mann–Whitney U test</h3>
<p>Also called the Wilcoxon rank-sum test.</p>
<ol><li><b>Combine</b> the two groups and rank all values.</li><li>Add up the ranks of one group and convert to U.</li><li>If the two groups come from the same distribution, their ranks should be interleaved; if one group's ranks cluster high or low, the p-value is small.</li></ol>
<p>Mann–Whitney tests whether “values in one group tend to be larger than in the other”. Only when the two distributions have the same shape can it be interpreted as “the medians differ”.</p>
<h3>Costs and limits</h3>
<ul><li>When data really are close to normal, nonparametric methods have slightly less power than t-tests, but not much.</li><li>They mainly give p-values; to report an effect size, add a difference in medians or the Hodges–Lehmann estimate with its confidence interval.</li><li>They still require independent observations and cannot fix pseudoreplication or design problems.</li></ul>`,
    quiz: [
      { q: `After treatment 7 of 8 mice go up and 1 goes down. The two-sided sign-test p-value is about?`, o: [`0.07`, `0.035`, `0.875`, `0.0039`], why: `The number of pluses follows a binomial with n = 8, p = 0.5: P(X ≥ 7) = 9/256 ≈ 0.035, two-sided ≈ 0.07.`, look: `8 new-drug patients in hospital H1: 7 had a fall (blue) and 1 a rise (red); sign-test p ≈ 0.07 — the same calculation as the question's 7 to 1.` },
      { q: `How does the Mann–Whitney U test compare two groups?`, o: [`It ranks the combined data and compares the groups' ranks`, `It compares the means and standard deviations`, `It looks only at whether each value is positive or negative`, `It compares the variances`], why: `It uses only ranks, so it is unaffected by the size of extreme values.`, look: `The numbers in the circles are ranks in the combined data: compare the rank sums of the two groups. Try a few hospitals.` },
      { q: `When the data are actually close to normal, Mann–Whitney compared with the t-test?`, o: [`Has slightly less power, but not much`, `Always has more power`, `Has a higher false-positive rate`, `Cannot be used at all`], why: `Nonparametric methods discard some numerical information; under normality the t-test is most efficient, but the difference is usually small.`, look: `Add an extreme value: it simply becomes the last rank and Mann–Whitney barely changes; see how the Welch t p-value changes.` },
    ],
  },
});
