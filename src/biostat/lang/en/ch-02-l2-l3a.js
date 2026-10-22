/* English content: Level 2 and start of Level 3 */
Object.assign(I18N.packs.en.ch, {
  'prob-rules': {
    title: `Rules of probability`, refs: `Whitlock ch. 5; Rosner 3.2–3.6`,
    body: `<p>A probability describes how likely something is, from 0 (impossible) to 1 (certain). Something that may happen is called an <b>event</b>, e.g. “the person drawn smokes”. Every statistical method rests on the following rules.</p>
<h3>Complement</h3>
<div class="formula">P(not A) = 1 − P(A)</div>
<p>“A does not happen” is the <b>complement</b> of A. If 30% smoke, 70% do not.</p>
<h3>Addition rule: A or B</h3>
<div class="formula">P(A or B) = P(A) + P(B) − P(A and B)</div>
<p>Simply adding the two probabilities counts people with both twice, so subtract it once. If A and B cannot happen together (e.g. blood group A and blood group O) they are <b>mutually exclusive</b>; then P(A and B) = 0 and the probabilities can simply be added.</p>
<h3>Conditional probability</h3>
<div class="formula">P(B | A) = P(A and B) ÷ P(A)</div>
<p>“Among those for whom A happened, the proportion for whom B also happened” — e.g. the proportion of smokers with hypertension.</p>
<h3>Multiplication rule and independence</h3>
<div class="formula">P(A and B) = P(A) × P(B | A)<br>If A and B are independent: P(A and B) = P(A) × P(B)</div>
<p>If knowing whether A happened does not change the probability of B at all — P(B | A) = P(B | not A) = P(B) — A and B are <b>independent events</b>. Example: both parents are carriers (Aa); each child gets an a from the father with probability 1/2 and from the mother with probability 1/2, independently, so the chance the child is aa is 1/2 × 1/2 = 1/4.</p>
<h3>Law of total probability</h3>
<div class="formula">P(B) = P(A) × P(B | A) + P(not A) × P(B | not A)</div>
<p>Split the population into two groups by A; the overall proportion of B is the proportion of B in each group, weighted by group size. The next chapter's diagnostic testing (Bayes' theorem) simply combines these rules.</p>`,
    quiz: [
      { q: `Both parents carry a recessive disease (Aa). What is the probability that a child is aa?`, o: [`1/4`, `1/2`, `1/3`, `3/4`], why: `Probability of an a from the father 1/2 and from the mother 1/2, independent: 1/2 × 1/2 = 1/4.`, look: `“Adjust it yourself” mode: treat “a from the father” as A and “a from the mother” as B, each 50% and independent: the red area at bottom left is 1/2 × 1/2 = 25%.` },
      { q: `Smoking prevalence is 30% and hypertension 20%, independently. For a random person, what is the probability of “smoking or hypertension”?`, o: [`44%`, `50%`, `6%`, `24%`], why: `0.3 + 0.2 − 0.3 × 0.2 = 0.44. Subtract the 6% with both, otherwise they are counted twice.`, look: `Equal red heights (20%) in both columns mean independence. Click “P(A or B)” and see the highlighted area: the whole A column plus the red part on the right.` },
      { q: `30% of smokers and 15% of non-smokers have hypertension. Are smoking and hypertension independent?`, o: [`No: knowing whether someone smokes changes the probability of hypertension`, `Yes: both are proportions`, `Yes: they are independent whenever both are below 50%`, `Cannot tell`], why: `Independence means P(hypertension | smoker) = P(hypertension | non-smoker); 30% ≠ 15%, so they are not independent.`, look: `The red heights differ between the columns: knowing whether someone is in A changes the probability of B. Click “if independent” to see the height expected under independence.` },
      { q: `20.8% of the study patients smoke. 32.5% of smokers and 20.8% of non-smokers had a cardiovascular event within 36 months. Are smoking and cardiovascular events independent?`, o: [`No: knowing whether someone smokes changes the probability of an event`, `Yes: both are just proportions`, `Yes: because fewer people smoke`, `Cannot tell`], why: `Independence means P(event | smoker) = P(event | non-smoker); 32.5% ≠ 20.8%.`, look: `The left column (smokers) has more red than the right. Click “if independent”: the height both columns would share.` },
    ],
  },
  'c2-1': {
    title: `Probability and diagnostic tests`, wtitle: `Screening 10,000 people`, refs: `Whitlock ch. 5; Rosner 3.6–3.7`,
    body: `<p>A probability is a number between 0 and 1. The <b>conditional probability</b> P(A | B), read “the probability of A given B”, is at the heart of medical testing.</p>
<div class="tbl-wrap"><table class="st"><thead><tr><th></th><th>Diseased</th><th>Not diseased</th></tr></thead><tbody><tr><td>Test positive</td><td>True positive TP</td><td>False positive FP</td></tr><tr><td>Test negative</td><td>False negative FN</td><td>True negative TN</td></tr></tbody></table></div>
<div class="formula">sensitivity = TP ÷ (TP + FN) = P(positive | diseased)<br>specificity = TN ÷ (TN + FP) = P(negative | not diseased)<br>positive predictive value PPV = TP ÷ (TP + FP) = P(diseased | positive)</div>
<div class="formula">negative predictive value NPV = TN ÷ (TN + FN) = P(not diseased | negative)</div>
<p>A <b>false positive</b> is a positive test in someone without the disease; a <b>false negative</b> is a negative test in someone with it. The negative predictive value (NPV) answers “given a negative test, the probability that I really do not have the disease”.</p>
<p>Key point: the PPV depends not only on the test but strongly on the <b>prevalence</b> — this is Bayes' theorem. In the tool above, set the prevalence to 0.1% and see how likely a positive result from a test with high sensitivity and specificity is to be a real case.</p>`,
    quiz: [
      { q: `When screening widely for a rare disease, among the positive results?`, o: [`False positives may be the majority`, `Almost all are true positives`, `The PPV equals the sensitivity`, `The PPV does not depend on prevalence`], why: `There are far more people without the disease, so even with high specificity the absolute number of false positives can exceed the true positives.`, look: `Look at the positive row: false positives (red) outnumber true positives (green); the PPV is only about 9%.` },
      { q: `A test with very high sensitivity is best used to?`, o: [`Rule out disease: a negative result is reassuring`, `Confirm disease`, `Estimate prevalence`, `Replace specificity`], why: `High sensitivity → few false negatives → a negative result is reliable (often remembered as SnNout).`, look: `With 99% sensitivity the negative predictive value NPV is very high: negative results are reliable.` },
      { q: `Physician A reading ECGs has sensitivity 74.4% and specificity 72.6%. Screening a general population with a prevalence of only 2%, what proportion of positives actually have left ventricular hypertrophy?`, o: [`About 5%`, `About 74%`, `About 73%`, `About 37%`], why: `Few people have the condition: of 10,000, 200 do, giving about 149 true positives; among the 9,800 without it there are about 2,685 false positives. PPV = 149 ÷ (149 + 2,685) ≈ 5%.`, look: `The upper table is the actual reading results for the 400 study patients; the lower table applies the same sensitivity and specificity to a population with 2% prevalence. Most positives are false positives.` },
    ],
  },
  'roc': {
    title: `ROC curves`, refs: `Rosner 3.9; UTHealth GSBS syllabus week 10`,
    body: `<p>Many tests give a continuous result, such as the blood concentration of a biomarker. To turn it into “positive/negative” you need a <b>threshold</b> (cutoff): values above it are called positive. Where you put the threshold changes sensitivity and specificity:</p>
<ul><li><b>Lower</b> threshold: more people are called positive. People with the disease are caught more often (sensitivity rises), but people without it are misclassified more often (specificity falls).</li>
<li><b>Higher</b> threshold: the opposite.</li></ul>
<h3>The ROC curve</h3>
<p>Try every possible threshold and plot sensitivity (y-axis) against 1 − specificity (the false-positive rate, x-axis): that is the <b>ROC curve</b>. The closer the curve hugs the top-left corner, the better the test separates diseased from non-diseased; the diagonal is no better than tossing a coin.</p>
<h3>Area under the curve, AUC</h3>
<p>The <b>AUC</b> (area under the curve) lies between 0.5 and 1. It has an intuitive meaning: <b>pick one person with the disease and one without at random; the AUC is the probability that the diseased person has the higher test value</b>. AUC = 0.5 means no discrimination; AUC = 1 means complete separation.</p>
<h3>Choosing a threshold</h3>
<p>A common choice is the threshold that maximizes the <b>Youden index</b> J = sensitivity + specificity − 1. In practice it depends on the purpose: screening values not missing patients and picks a high-sensitivity threshold; tests before a diagnosis value specificity. The choice should also consider prevalence (positive predictive value, chapter {{c2-1}}).</p>
<p class="note">ROC curves are also used to evaluate prediction models. The lab results for logistic regression (chapter {{c4-2}}) include the ROC curve and AUC of the predicted probabilities.</p>`,
    quiz: [
      { q: `What happens if the biomarker threshold is lowered (positives become easier)?`, o: [`Sensitivity rises and specificity falls`, `Both rise`, `Sensitivity falls and specificity rises`, `Neither changes`], why: `More people are called positive: fewer people with the disease are missed, but more people without it are misclassified.`, look: `Study data: lowering the threshold from 3 to 2 calls more people positive. More of the red (hypertrophy) is highlighted = higher sensitivity; more of the blue (no hypertrophy) is also called positive = lower specificity. The red point on the ROC curve moves up and to the right.` },
      { q: `A test has AUC = 0.5. What does this mean?`, o: [`The test cannot distinguish diseased from non-diseased — like tossing a coin`, `Half the people have the disease`, `Sensitivity is 50%`, `The test is very accurate`], why: `At AUC 0.5 the ROC curve is the diagonal: at every threshold, sensitivity equals the false-positive rate.`, look: `“Adjust it yourself”: when the two distributions overlap completely, the ROC curve is the diagonal and AUC = 0.5.` },
      { q: `The best interpretation of AUC = 0.85 is?`, o: [`Pick one diseased and one non-diseased person at random: the probability the diseased person has the higher value is 85%`, `85% of people are classified correctly`, `Sensitivity is 85%`, `The positive predictive value is 85%`], why: `The AUC measures overall discrimination, which is not the accuracy at any particular threshold.`, look: `In the study data the AUC of the ECG score is about 0.82. Click “AUC” to see the area under the curve: it describes overall discrimination, not accuracy at one threshold.` },
    ],
  },
  'rv': {
    title: `Random variables, expected value and variance`, refs: `Rosner 4.2–4.6`,
    body: `<p>“The number of pups surviving in a randomly chosen litter” is not known in advance, but each possible value has its own probability. A quantity whose value is determined by chance is a <b>random variable</b>, usually written with a capital X.</p>
<ul><li><b>Discrete random variable</b>: can only take separate values, e.g. 0, 1, 2, 3 survivors.</li><li><b>Continuous random variable</b>: can take any value in an interval, e.g. weight or blood pressure. The normal distribution (chapter {{c1-4}}) is a distribution of a continuous random variable.</li></ul>
<h3>Probability distributions</h3>
<p>Listing every possible value and its probability gives the random variable's <b>probability distribution</b>. The probabilities must add up to 1.</p>
<div class="tbl-wrap"><table class="st"><thead><tr><th>Survivors x</th><th>0</th><th>1</th><th>2</th><th>3</th></tr></thead><tbody><tr><td>P(X = x)</td><td>0.1</td><td>0.3</td><td>0.4</td><td>0.2</td></tr></tbody></table></div>
<h3>Expected value and variance</h3>
<div class="formula">expected value E(X) = μ = Σ x × P(X = x)<br>variance Var(X) = σ² = Σ (x − μ)² × P(X = x)　　standard deviation σ = √Var(X)</div>
<p>For the table above, the expected value = 0 × 0.1 + 1 × 0.3 + 2 × 0.4 + 3 × 0.2 = 1.7. The <b>expected value</b> is a probability-weighted mean, the “long-run average over many repetitions”; it need not be a value that can actually occur (there are no 1.7 mice). The variance and standard deviation describe how spread out the outcomes are — the same idea as the standard deviation of data (chapter {{c1-3}}), only weighted by probability.</p>
<h3>Cumulative probability</h3>
<p>The <b>cumulative probability</b> P(X ≤ x) is the probability of a value “less than or equal to x”: add up all probabilities up to x. In the table, P(X ≤ 1) = 0.1 + 0.3 = 0.4.</p>
<h3>The law of large numbers</h3>
<p>The more often the same random experiment is repeated, the closer the average of the results gets to the expected value — the <b>law of large numbers</b>. It is why “estimating a population mean with a sample mean” works, and why the line in the simulation above ends up hugging the expected value.</p>`,
    quiz: [
      { q: `The number of survivors per litter X has P(0) = 0.1, P(1) = 0.3, P(2) = 0.4, P(3) = 0.2. What is E(X)?`, o: [`1.7`, `1.5`, `2`, `0.25`], why: `0 × 0.1 + 1 × 0.3 + 2 × 0.4 + 3 × 0.2 = 1.7.`, look: `“Adjust it yourself”: this is the question's distribution. The red line is the expected value, between 1 and 2.` },
      { q: `The best interpretation of an expected value of 1.7 is?`, o: [`Over very many litters, about 1.7 pups survive per litter on average`, `Every litter has 1.7 survivors`, `The most common number of survivors is 1.7`, `There is a 1.7% chance of survival`], why: `The expected value is a long-run average; a single litter can only have a whole number of survivors.`, look: `Right panel: the more simulations, the closer the average gets to the red dashed line (expected value 1.7), but each single result is a whole number.` },
      { q: `For the same distribution, what is P(X ≤ 1)?`, o: [`0.4`, `0.3`, `0.7`, `0.1`], why: `P(X = 0) + P(X = 1) = 0.1 + 0.3 = 0.4.`, look: `Click “P(X ≤ 1)”: the bars for X = 0 and X = 1 light up and their probabilities add.` },
      { q: `Pick a study patient at random; X = their number of adverse events within 12 weeks. Of the 400, 70.8% had 0, 26.3% had 1, 2.8% had 2 and 0.3% had 4. E(X) is about?`, o: [`0.33`, `0`, `1`, `0.71`], why: `0 × 0.708 + 1 × 0.263 + 2 × 0.028 + 4 × 0.003 ≈ 0.33: 0.33 events per person on average, although nobody has exactly 0.33.`, look: `Study data: most people have 0. The red line (expected value) lies between 0 and 1; picking patients at random, the running average in the right panel approaches it.` },
    ],
  },
  'binom': {
    title: `The binomial distribution`, refs: `Whitlock 7.1; Rosner 4.7–4.9, 5.7; Kirkwood ch. 15`,
    body: `<p>A trial with only two outcomes (response/no response, carrying a genotype or not) is a <b>Bernoulli trial</b>. Repeat the same trial n times and count the “successes”: that count follows a <b>binomial distribution</b>. Examples: the number responding among 20 treated patients; the number of recessive (aa) children among 4 children of two carriers.</p>
<h3>Four conditions for the binomial distribution</h3>
<ol><li>The number of trials n is fixed in advance.</li><li>Each trial has only two outcomes.</li><li>The probability of success p is the same every time.</li><li>Trials are independent.</li></ol>
<h3>The formula</h3>
<div class="formula">P(X = k) = C(n, k) × p<sup>k</sup> × (1 − p)<sup>n − k</sup><br>C(n, k) = n! ÷ (k! × (n − k)!)　　(the number of ways to choose k successes out of n)</div>
<p>Example: two carriers have 4 children, each aa with p = 1/4. The probability of exactly 1 aa child = C(4, 1) × (1/4)¹ × (3/4)³ = 4 × 0.25 × 0.422 ≈ 0.42. C(n, k) is the <b>binomial coefficient</b>: any one of the 4 children could be the aa one, so there are 4 possibilities.</p>
<h3>Expected value and variance</h3>
<div class="formula">E(X) = n × p　　Var(X) = n × p × (1 − p)　　standard deviation = √(n × p × (1 − p))</div>
<p>Treating 20 people with a drug that works in 30%, we expect 6 responders on average, with standard deviation √(20 × 0.3 × 0.7) ≈ 2.05.</p>
<h3>Normal approximation</h3>
<p>When n is large, the binomial distribution looks like a normal distribution (an instance of the central limit theorem), and it can be approximated by a normal distribution with mean np and standard deviation √(np(1 − p)). Rosner's rule of thumb is to use it only when <b>n × p × (1 − p) ≥ 5</b>. When computing P(X ≤ k) with the normal approximation, k is usually increased by 0.5 — the <b>continuity correction</b>. With p close to 0 or 1 and small n, the distribution is very skewed and the normal approximation is poor.</p>`,
    quiz: [
      { q: `Two carriers (Aa × Aa) have 4 children. The probability that exactly one is aa is about?`, o: [`0.42`, `0.25`, `0.75`, `0.11`], why: `C(4, 1) × 0.25 × 0.75³ = 4 × 0.25 × 0.422 ≈ 0.42.`, look: `“Adjust it yourself”: 4 children, each aa with probability 1/4. Click “P(X = 1)” and see that bar is about 0.42 high.` },
      { q: `A drug works in 30% of patients and 20 are treated. The expected number of responders and its standard deviation are?`, o: [`6; about 2.05`, `6; 4.2`, `3; about 1.4`, `30; about 5.5`], why: `E = 20 × 0.3 = 6; SD = √(20 × 0.3 × 0.7) = √4.2 ≈ 2.05. 4.2 is the variance, not the SD.`, look: `The red line is the expected value 6; click “standard deviation” to see 6 ± 2.05.` },
      { q: `Which of these is NOT a condition for the binomial distribution?`, o: [`Each trial's outcome must be normally distributed`, `The number of trials is fixed in advance`, `The probability of success is the same each time`, `Trials are independent`], why: `Each binomial trial has only two outcomes; normality has nothing to do with it.`, look: `With large n and p near 0.5, the binomial distribution and the green normal curve almost coincide. Drag p to 0.05 and see what happens.` },
      { q: `The response rate in the study's new-drug group is about 0.656. Sampling 10 new-drug patients at random, the expected number of responders is about?`, o: [`6.6`, `0.656`, `10`, `3.4`], why: `E = n × p = 10 × 0.656 ≈ 6.6.`, look: `The red dots are what actually happened when 10 new-drug patients were drawn 1,000 times; they match the blue bars (binomial distribution). The red line is the expected value.` },
    ],
  },
  'poisson': {
    title: `The Poisson distribution`, refs: `Whitlock 8.4; Rosner 4.10–4.13; Kirkwood ch. 22`,
    body: `<p>Much biological data is “how many times something happens in a fixed amount of time or space”: colonies on a culture plate, cells in a microscope field, cases of a rare disease in a hospital in a year. If events occur <b>randomly and independently</b> at a constant average rate, the count follows a <b>Poisson distribution</b>.</p>
<div class="formula">P(X = k) = e<sup>−λ</sup> × λ<sup>k</sup> ÷ k!　　(k = 0, 1, 2, …)<br>E(X) = λ　　Var(X) = λ</div>
<p>λ (lambda) is the average count per unit of time or space, also called the <b>rate</b>. Example: with an average of 3 colonies per plate, the probability of exactly 2 = e<sup>−3</sup> × 3² ÷ 2! ≈ 0.224.</p>
<h3>Mean equals variance</h3>
<p>The defining feature of the Poisson distribution is that the <b>mean equals the variance</b>. When the variance of real data is much larger than the mean, this is <b>overdispersion</b>, which usually means events are not independent and random but <b>clustered</b> (colonies in clumps, outbreaks), or that different units have different rates. Then models such as the negative binomial are needed. The culture-plate simulation above compares the two situations.</p>
<h3>Poisson approximation to the binomial</h3>
<p>For a binomial distribution with large n and small p (rare events), a Poisson distribution with λ = n × p is a good approximation. Example: with a mutation rate of 0.001 and 2,000 cells examined, the number of mutated cells is approximately Poisson with λ = 2.</p>
<p class="note">Comparing rates between two groups (e.g. incidence per 1,000 person-years) and Poisson regression are covered in the correlation and regression level.</p>`,
    quiz: [
      { q: `Plates average 3 colonies (Poisson). The probability that a plate has exactly 2 colonies is about?`, o: [`0.224`, `0.149`, `0.423`, `0.667`], why: `e⁻³ × 3² ÷ 2! = 0.0498 × 9 ÷ 2 ≈ 0.224. 0.423 is P(X ≤ 2).`, look: `“Adjust it yourself”: click “P(X = k)”; with λ = 3 the probability of exactly 2 is about 0.224.` },
      { q: `Colony counts per square have mean 2 and variance 9. What does this indicate?`, o: [`Overdispersion: the colonies may be clumped and do not follow a Poisson distribution`, `A perfect Poisson distribution`, `The sample is too small to mean anything`, `The mean was calculated wrongly`], why: `For a Poisson distribution the variance equals the mean; a much larger variance indicates clustering.`, look: `Clumped: many squares are 0 and a few have many; the variance per square is far above the mean, and the histogram does not follow the blue Poisson curve.` },
      { q: `Mutation rate 0.001, 2,000 cells examined. The number of mutated cells is best approximated by?`, o: [`A Poisson distribution with λ = 2`, `A normal distribution with mean 2000`, `A binomial with p = 0.5`, `A uniform distribution`], why: `With large n and small p, the binomial is well approximated by a Poisson with λ = n × p = 2.`, look: `A Poisson distribution with λ = n × p = 2000 × 0.001 = 2.` },
      { q: `Among the 363 patients who completed 12 weeks, adverse events per person had mean 0.333 and variance 0.311. What does this indicate?`, o: [`Variance close to the mean: the data roughly follow a Poisson distribution`, `Severe overdispersion`, `The data must be wrong`, `A normal distribution should be used`], why: `For a Poisson distribution the variance equals the mean; 0.311 ÷ 0.333 ≈ 0.93, close to 1.`, look: `The red bars (observed proportions) and blue dots (Poisson with the same mean) almost coincide; click “variance ÷ mean”.` },
    ],
  },
  'c2-2': {
    title: `Sampling distributions and the central limit theorem`, wtitle: `Central limit theorem simulator`, refs: `Whitlock ch. 4`,
    body: `<p>We can only measure a <b>sample</b>, yet we want to learn about the <b>population</b>. If we sampled many times and computed a mean each time, those means would form a distribution: the <b>sampling distribution</b>.</p>
<p><b>The central limit theorem (CLT)</b>: whatever the shape of the population (as long as its variance is finite), when the sample size n is large enough the distribution of sample means is approximately normal, centred on μ with standard deviation σ ÷ √n.</p>
<p>This standard deviation of sample means, σ ÷ √n, has its own name: the <b>standard error</b> (SE). It describes how uncertain the mean is as an estimate; the larger n, the smaller the standard error.</p>
<p>This is why the normal distribution is everywhere in statistics: we usually work with means or sums. In the simulator above, choose a skewed population and increase n from 1 to 30; watch the distribution of means become bell-shaped and narrower.</p>`,
    quiz: [
      { q: `If the sample size per draw goes from 10 to 40, the standard deviation of sample means (the standard error)?`, o: [`Halves`, `Becomes 1/4`, `Does not change`, `Doubles`], why: `Standard error = σ ÷ √n; √40 ÷ √10 = 2, so it halves.`, look: `Compare the “theoretical standard error” with that at n = 10; drag n back to 10 to check.` },
      { q: `According to the central limit theorem, what becomes approximately normal?`, o: [`The distribution of sample means`, `The raw data themselves`, `The population distribution`, `The p-value`], why: `The shape of the raw data does not change; what changes is the distribution of the mean.`, look: `The population on the left (CRP of the 400 patients) is clearly right-skewed, yet the 2,000 means on the right are already bell-shaped.` },
    ],
  },
  'c2-3': {
    title: `Standard errors and confidence intervals`, wtitle: `Confidence intervals from 50 studies`, refs: `Whitlock ch. 4; Rosner 6.5; Kirkwood ch. 6`,
    body: `<div class="formula">standard error SE = s ÷ √n<br>95% confidence interval = x̄ ± t<sub>0.975, n−1</sub> × SE　(t ≈ 1.96 for large n)</div>
<div class="ex"><b>Example</b>　40 patients have mean systolic BP 138, SD 16. SE = 16 ÷ √40 = 2.53; t<sub>0.975, 39</sub> = 2.02; 95% CI = 138 ± 5.1, i.e. 132.9 to 143.1 mmHg.</div>
<p><b>The correct interpretation</b>: if the study were repeated many times with the same method, computing an interval each time, about 95% of the intervals would contain the true μ; this proportion is the <b>coverage</b>. For a single interval already computed, μ is either inside or not — it is not “95% likely” to be inside. See it for yourself in the simulator above.</p>
<p>Modern journals (especially medical ones) increasingly require <b>effect sizes with 95% CIs</b> rather than just p-values, because the interval tells you both how large the effect is and how uncertain the estimate is.</p>`,
    quiz: [
      { q: `To halve the width of a confidence interval, the sample size needs to be about?`, o: [`4 times larger`, `2 times larger`, `Halved`, `Unchanged`], why: `The width is proportional to 1 ÷ √n, so halving it needs n four times larger.`, look: `n = 80 is 4 times 20. Compared with n = 20, the intervals are about half as long.` },
      { q: `Compared with a 95% CI, a 99% CI is?`, o: [`Wider`, `Narrower`, `The same width`, `Depends on the data`], why: `To be more sure of covering the true value, the interval must be wider.`, look: `With 99%, every interval gets longer and fewer red (missing) intervals remain.` },
    ],
  },
  'tdist': {
    title: `The t distribution`, refs: `Whitlock 11.1; Rosner 6.5`,
    body: `<p>Ideally a confidence interval for a mean would use the population standard deviation σ, but σ is almost never known and the sample standard deviation s is used instead. s is itself an estimate with error, so (x̄ − μ) ÷ (s ÷ √n) is more spread out than the standard normal: its distribution is the <b>t distribution</b>.</p>
<h3>Properties of the t distribution</h3>
<ul><li>Like the normal, it is a symmetric bell centred on 0.</li><li>Its tails are “heavier”: extreme values are more likely than under the normal, so its critical values exceed 1.96.</li><li>Its shape depends on the <b>degrees of freedom</b>; for estimating one mean, df = n − 1. The more degrees of freedom, the closer to the normal; beyond about 30 it is already very close.</li></ul>
<h3>Critical values</h3>
<div class="tbl-wrap"><table class="st"><thead><tr><th>Degrees of freedom</th><th>2</th><th>4</th><th>9</th><th>19</th><th>29</th><th>99</th><th>∞ (normal)</th></tr></thead><tbody><tr><td>Two-sided 95% <b>critical value</b></td><td>4.30</td><td>2.78</td><td>2.26</td><td>2.09</td><td>2.05</td><td>1.98</td><td>1.96</td></tr></tbody></table></div>
<p>So with n = 10, the 95% confidence interval for a mean is x̄ ± 2.26 × s ÷ √n, not ± 1.96. The smaller the sample, the bigger the difference.</p>
<p class="note">Using 1.96 with a small sample makes the confidence interval too narrow, so it covers the true value less than 95% of the time. The simulation above shows the gap directly. p-values from t-tests (chapter {{c3-1}}) are also computed from the t distribution.</p>`,
    quiz: [
      { q: `Why use a t critical value instead of 1.96 for a confidence interval for a mean from a small sample?`, o: [`Replacing σ with the sample SD s adds uncertainty; the t distribution has heavier tails`, `Because small samples are never normal`, `Because the t distribution is narrower and gives a more precise interval`, `1.96 can only be used for proportions`], why: `s is an estimate too; the t distribution accounts for that extra uncertainty, so its critical value exceeds 1.96.`, look: `With 4 degrees of freedom (n = 5) the blue t distribution has heavier tails than the grey normal. In the simulation, the coverage when wrongly using 1.96 is clearly below 95%.` },
      { q: `As the degrees of freedom increase, the t distribution?`, o: [`Gets closer and closer to the standard normal`, `Becomes more skewed`, `Gets heavier tails`, `Shifts its centre to the right`], why: `With large samples s is very close to σ, so the t distribution is almost the same as the normal.`, look: `With 60 degrees of freedom the t and normal distributions almost coincide and the critical value is close to 1.96.` },
      { q: `With n = 10, the critical value for a 95% CI for a mean is about?`, o: [`2.26`, `1.96`, `2.09`, `1.645`], why: `Degrees of freedom = 10 − 1 = 9; t₀.₉₇₅,₉ ≈ 2.26.`, look: `9 degrees of freedom (n = 10): click “95% critical value of t”.` },
    ],
  },
  'prop-ci': {
    title: `Confidence intervals for proportions`, refs: `Whitlock 7.3; Rosner 6.8; Kirkwood ch. 15`,
    body: `<p>Many studies estimate a proportion: a prevalence, response rate, survival rate or the proportion carrying a genotype. With x “successes” among n, the sample proportion p̂ = x ÷ n estimates the population proportion p.</p>
<div class="formula">standard error of a proportion SE = √(p̂ × (1 − p̂) ÷ n)</div>
<h3>The most common formula: the Wald method</h3>
<div class="formula">p̂ ± 1.96 × SE</div>
<p>This is the first formula in many textbooks, but it has clear weaknesses: with small samples, or proportions near 0 or 1, its actual coverage is often below 95%, and the interval can even extend beyond 0–1. The extreme case is 0 side effects among 50 people: p̂ = 0, SE = 0 and the interval is “0 to 0”, as if nobody could ever have a side effect — clearly unreasonable.</p>
<h3>Recommended methods</h3>
<ul><li><b>Wilson method</b>: pulls the centre of the interval slightly towards 0.5 and adjusts the width; its coverage is close to 95% in all situations, and it is currently the most recommended method. The Agresti–Coull method used in Whitlock's textbook is a simplified version.</li>
<li><b>Exact method</b> (Clopper–Pearson): computed directly from the binomial distribution (chapter {{binom}}); its coverage is guaranteed to be at least 95%, so it is usually wider (conservative).</li></ul>
<p>Papers should state the method, e.g. “prevalence 35% (95% CI 18.1–56.7%, Wilson method)”.</p>
<p class="note">Like the mean, the standard error of a proportion is inversely proportional to √n: to halve the interval's width, the sample must be 4 times larger. The closer p is to 0.5, the larger the standard error.</p>`,
    quiz: [
      { q: `7 of 20 people respond. The sample proportion and its standard error are?`, o: [`0.35; about 0.107`, `0.35; about 0.023`, `7; about 2.13`, `0.35; 0.65`], why: `p̂ = 7 ÷ 20 = 0.35; SE = √(0.35 × 0.65 ÷ 20) ≈ 0.107.`, look: `Click the “sample proportion” and “standard error” cards.` },
      { q: `0 of 50 people have a side effect. What does the Wald 95% CI give, and what should you do?`, o: [`0 to 0, which is unreasonable; use the Wilson or exact method instead`, `A reasonable interval that can be reported`, `It cannot be estimated; just say there were no side effects`, `Recruit more people until someone has a side effect`], why: `When p̂ = 0 the Wald standard error is 0; Wilson or exact methods give an interval from 0 up to some upper limit.`, look: `0 events: the red Wald interval collapses to a point; Wilson and exact methods both give an interval from 0 to an upper limit.` },
      { q: `To halve the width of a confidence interval for a proportion, the sample size must be about how many times larger?`, o: [`4 times`, `2 times`, `Half`, `Unchanged`], why: `The width is proportional to 1 ÷ √n.`, look: `Compared with n = 20, the interval at n = 80 is about half as wide. Below, sampling from the study: the true proportion with diabetes is only 0.0625, and the coverage of the Wald interval is clearly below 95%.` },
    ],
  },
});
