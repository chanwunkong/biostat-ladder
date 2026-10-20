/* English content: Levels 0–1 */
Object.assign(I18N.packs.en.ch, {
  'c0-1': {
    title: `Proportions, percentages and “rates”`,
    body: `<p class="note">From this chapter on, almost every chart in the course uses the same data set: a <b>multicenter blood-pressure trial</b>. 400 patients with hypertension at 8 hospitals were randomized to a new drug or placebo and followed for blood pressure, blood tests, ECGs, adverse events and cardiovascular events. The data are simulated by computer from known true relationships, so you can compare what you calculate with “the truth”. See the <a href="#data">Data sets</a> page for every column.</p>
<p>The first step in biostatistics is stating clearly “how many out of how many”.</p>
<div class="formula">proportion = part ÷ whole　　　percentage = proportion × 100%</div>
<p>Example: 6 of 40 students in a class are severely short-sighted; proportion = 6 ÷ 40 = 0.15, or 15%.</p>
<h3>Proportions, ratios and rates</h3>
<ul><li><b>Proportion</b>: the numerator is part of the denominator, so it lies between 0 and 1. Example: <b>prevalence</b> = people currently ill ÷ total people.</li>
<li><b>Ratio</b>: one quantity divided by another; the numerator need not be part of the denominator, e.g. sex ratio = men ÷ women, which can exceed 1.</li>
<li><b>Rate</b>: the denominator contains <i>time</i>. <b>Incidence rate</b> = new cases ÷ person-years. Following 100 people for 2 years each = 200 person-years.</li></ul>
<div class="ex"><b>Example</b>　500 people are followed for 4 years and 10 new cases occur. Incidence rate = 10 ÷ (500 × 4) = 0.005 per person-year, usually written “5 per 1,000 person-years”.</div>
<h3>Comparing two groups: absolute difference, relative change, risk ratio, number needed to treat</h3>
<p>Clinical studies often compare the <b>event rate</b> (the proportion of a group who have an event, such as a side effect or death) of two groups. Suppose the <b>control group</b> (the group that does not get the new treatment and is used for comparison) has an event rate of 20% and the treated group 10%:</p>
<div class="formula">absolute difference = 20% − 10% = 10 percentage points<br>relative change = absolute difference ÷ control event rate = 10 ÷ 20 = 50% reduction<br>risk ratio RR = treated ÷ control = 10% ÷ 20% = 0.5<br>number needed to treat NNT = 100 ÷ absolute difference (points) = 100 ÷ 10 = 10 people</div>
<p>The <b>number needed to treat (NNT)</b> means: on average, 10 people must be treated to prevent one event. A risk ratio of 1 means the two groups are the same.</p>
<p class="note">“Percentage points” and “percent” differ. Going from 10% to 15% is an increase of 5 <b>percentage points</b> (absolute difference) but a 50% relative increase. Papers and news use both — read carefully.</p>`,
    quiz: [
      { q: `In the course trial, the proportion with a cardiovascular event within 36 months was 26.5% on placebo and 20.0% on the new drug. Which is correct?`, o: [`Absolute difference 6.5 percentage points; relative reduction about 25%`, `The absolute difference is a 25% reduction`, `Relative reduction of 6.5%`, `Absolute difference and relative change are both 6.5%`], why: `Absolute difference = 26.5 − 20.0 = 6.5 points; relative change = 6.5 ÷ 26.5 ≈ 25%. Advertisements usually quote only the relative change because the number is bigger.`, look: `Choose the event “cardiovascular event”, all hospitals. Compare the “absolute difference” and “relative change” cards: same result, but the relative change looks much bigger.` },
      { q: `The 200 placebo patients were followed for 419 person-years in total and had 53 cardiovascular events. The incidence rate is about?`, o: [`12.6 per 100 person-years`, `26.5%`, `53 per 100 person-years`, `0.265 per person`], why: `53 ÷ 419 person-years = 0.126 per person-year = 12.6 per 100 person-years. The denominator is total follow-up time, not the number of people.`, look: `Look at the “incidence rate” card at the bottom: events divided by total person-years, not by people.` },
      { q: `Switch the event to “systolic BP fell ≥ 10 mmHg by week 12” (a good outcome): placebo 28.4%, new drug 65.6%. The number needed to treat is about?`, o: [`About 3`, `About 37`, `About 66`, `About 28`], why: `Absolute difference = 65.6 − 28.4 = 37.2 points; NNT = 100 ÷ 37.2 ≈ 2.7: treating about 3 people gives one extra clear blood-pressure drop.`, look: `The difference in coloured figures between the two pictograms is the absolute difference; click the NNT card.` },
      { q: `Switch to “at least one adverse event within 12 weeks”: placebo 24.5%, new drug 34.0%. The risk ratio RR is about?`, o: [`1.39: higher adverse-event risk on the new drug`, `0.72: lower on the new drug`, `9.5`, `1.00`], why: `RR = 34.0 ÷ 24.5 ≈ 1.39; above 1 means events are more common on the new drug.`, look: `This time the new-drug group has more coloured figures; look at the RR card.` },
    ],
  },
  'c0-2': {
    title: `The language of symbols: subscripts and Σ`,
    body: `<p>Statistical formulas look frightening mainly because of the symbols. There are really only a few rules.</p>
<ul><li>x<sub>i</sub>: the i-th observation. With 5 people's heights, x<sub>1</sub> is the first person and x<sub>5</sub> the fifth.</li><li>n: the sample size, i.e. the number of observations.</li><li>Σ (sigma): “add them all up”.</li></ul>
<div class="formula">Σx<sub>i</sub> = x<sub>1</sub> + x<sub>2</sub> + … + x<sub>n</sub>　　　x̄ = Σx<sub>i</sub> ÷ n</div>
<p>So the formula for the mean is just “add everything up and divide by how many”.</p>
<div class="ex"><b>Example</b>　Data 3, 5, 10: Σx<sub>i</sub> = 18, n = 3, x̄ = 6.<br>Σ(x<sub>i</sub> − x̄)² = (3−6)² + (5−6)² + (10−6)² = 9 + 1 + 16 = 26. This is the <b>sum of squared deviations</b>; the next level uses it to compute the standard deviation.</div><p>A preview: divide the sum of squared deviations by (n − 1) and take the square root and you get the <b>standard deviation s</b>, which describes how spread out the data are; chapter {{c1-3}} explains it. The tool above computes it too.</p>
<h3>Greek and Latin letters</h3>
<p>By convention, Greek letters stand for true <b>population</b> values (what we want but cannot see) and Latin letters for estimates computed from a <b>sample</b>:</p>
<div class="tbl-wrap"><table class="st"><thead><tr><th>Meaning</th><th>Population (parameter)</th><th>Sample (estimate)</th></tr></thead><tbody><tr><td>Mean</td><td>μ</td><td>x̄</td></tr><tr><td>Standard deviation</td><td>σ</td><td>s</td></tr><tr><td>Correlation</td><td>ρ</td><td>r</td></tr><tr><td>Regression coefficient</td><td>β</td><td>b or β̂</td></tr></tbody></table></div>`,
    quiz: [
      { q: `For any hospital and any group of 5 patients, what is Σ(x_i − x̄)?`, o: [`Always 0`, `Depends on which 5 people`, `Equal to Σx`, `Equal to 5 × x̄`], why: `Deviations from the mean always sum to 0: the green (positive) and red (negative) segments cancel exactly. That is why we square them when measuring variability.`, look: `Try several hospitals and groups: the last line of the formula is always 0.` },
      { q: `The systolic pressures of the first 5 patients in hospital H1 are 178, 138, 174, 157 and 161. What is the mean x̄?`, o: [`161.6`, `157`, `808`, `174`], why: `Σx = 808, x̄ = 808 ÷ 5 = 161.6.`, look: `The red dashed line is the mean x̄; the second line of the formula shows the calculation.` },
    ],
  },
  'c0-3': {
    title: `Powers, square roots and logarithms`, wtitle: `Fold changes and logs of CRP`,
    body: `<p>Three tools keep coming back: squares (for variability), square roots (to get back to the original units) and logarithms (for multiplicative change).</p>
<div class="formula">log<sub>b</sub>(x) = y　⟺　b<sup>y</sup> = x</div>
<p>log<sub>2</sub>(8) = 3 because 2³ = 8. log<sub>10</sub>(1000) = 3. ln is the natural logarithm, base e ≈ 2.718.</p>
<p><b>Fold change</b> (FC) = treated ÷ control. If expression is 400 in the treated group and 100 in controls, FC = 4: four times as much. Taking log₂ of the FC gives the familiar <b>log₂FC</b>: log₂(4) = 2.</p>
<h3>Why biologists love logarithms</h3>
<ul><li><b>Fold changes become symmetric</b>: a 2-fold increase in expression is log<sub>2</sub>FC = +1 and halving is −1. Without logs, 2 and 0.5 look asymmetric.</li>
<li><b>They tame skewed data</b>: viral loads, bacterial counts and concentrations often have huge values; after logging they look closer to normal.</li>
<li><b>Multiplication becomes addition</b>: log(a × b) = log a + log b. Coefficients of logistic and Cox models live on the log scale; exponentiate them to get back to “fold” quantities (OR, HR).</li></ul>`,
    quiz: [
      { q: `Gene A's expression in tumours is 1/4 of that in normal tissue. What is the log2 fold change?`, o: [`−2`, `−4`, `0.25`, `−0.25`], why: `log₂(1/4) = −2: “halved twice”.`, look: `In “Try it yourself” below, enter treated 50 and control 200 — that is 1/4. Look at the log₂FC and the orange arrow on the log₂ scale.` },
      { q: `Treated expression 400, control 50. What is the log₂ fold change?`, o: [`3`, `8`, `350`, `0.125`], why: `400 ÷ 50 = 8-fold = 2³, so log₂FC = 3: doubled three times.`, look: `On the log₂ scale the orange arrow sits at 3.` },
      { q: `In the data, smokers' CRP (geometric mean) is about 1.54 times that of non-smokers. The log₂FC is about?`, o: [`0.62: less than one doubling`, `1.54`, `−0.62`, `2`], why: `log₂(1.54) ≈ 0.62. One doubling is log₂FC = 1, so 1.54-fold lies between 0 and 1.`, look: `The two charts above: on the ordinary scale CRP is squashed to the left; on the log₂ scale it is nearly symmetric. Click the “log₂FC” card to see the distance between the two group centres.` },
    ],
  },
  'c0-4': {
    title: `Coordinates and the equation of a line`, wtitle: `Age and systolic BP: find the best line yourself`,
    body: `<p>The heart of regression analysis is the equation of a straight line from school mathematics.</p>
<div class="formula">y = a + b·x　　　a: intercept (y when x = 0)　　b: slope (how much y changes when x increases by 1)</div>
<div class="ex"><b>Example</b>　If “systolic BP = 90 + 0.8 × age”, each extra year of age raises systolic BP by 0.8 mmHg on average; the predicted value for a 50-year-old is 90 + 0.8 × 50 = 130 mmHg.</div>
<p>Each point's actual value minus the value predicted by the line is its <b>residual</b>; square all residuals and add them up to get the <b>residual sum of squares</b> — the smaller it is, the closer the line fits the data.</p>
<p>Real data never fall exactly on a line. Statistics uses <b>least squares</b> to find the line that “minimizes the sum of squared vertical distances from the points to the line”. The tool above uses the age and systolic BP of 30 patients from hospital H1; the red segments are the <b>residuals</b>. Drag the sliders to make the residual sum of squares smaller, then press “Best line” to see the answer.</p>`,
    quiz: [
      { q: `What does a slope of b = −2 mean?`, o: [`For each 1-unit increase in x, y falls by 2 on average`, `For each 1-unit increase in y, x falls by 2`, `y = −2 when x = 0`, `x and y are unrelated`], why: `The slope describes how much y changes when x increases by one unit.`, look: `With a negative slope the line drops by 5 for every 10 years of age. Click the “slope b” card to see the triangle on the chart.` },
      { q: `When does the intercept have no practical meaning?`, o: [`When x = 0 is outside the plausible range, e.g. the systolic BP of a “0-year-old adult”`, `When the slope is positive`, `When there are more than 100 observations`, `The intercept always has meaning`], why: `The intercept is the prediction at x = 0; if x = 0 cannot occur, it is just a mathematical anchor.`, look: `The intercept is where the line meets the y-axis at x = 0 — here the systolic BP of a “0-year-old”, who does not exist in the data: it is only a mathematical starting point.` },
    ],
  },
  'c1-1': {
    title: `Data and variable types`, refs: `Whitlock ch. 1; Kirkwood ch. 2`,
    body: `<p>Choosing the right statistical method depends mostly on what type of variable you have.</p>
<div class="tbl-wrap"><table class="st"><thead><tr><th>Type</th><th>Subtype</th><th>Examples</th><th>Usual summary</th></tr></thead><tbody>
<tr><td rowspan="2">Categorical</td><td>Nominal (no order)</td><td>Blood group, sex, treatment group</td><td>Counts, percentages</td></tr>
<tr><td>Ordinal</td><td>Cancer stage I–IV, pain level</td><td>Counts, median</td></tr>
<tr><td rowspan="2">Numerical</td><td>Continuous</td><td>Blood pressure, weight, gene expression</td><td>Mean ± SD or median [IQR]</td></tr>
<tr><td>Count</td><td>Colony counts, days in hospital</td><td>Median, rate</td></tr>
<tr><td>Time-to-event</td><td>—</td><td>Survival time (with censoring)</td><td>Kaplan–Meier</td></tr></tbody></table></div>
<p>Papers usually call the four types in the table: <b>nominal variables</b> (categories with no order), <b>ordinal variables</b> (ordered categories whose spacing is not necessarily equal), <b>continuous variables</b> (measurements that can take decimals) and <b>count variables</b> (0, 1, 2… occurrences).</p>
<p><b>Time-to-event</b> is the time from a starting point to an event. Some people have not had the event when follow-up ends — they were lost to follow-up or still alive at the end of the study — so we only know their time is “at least” this long. This is called <b>censoring</b>, often shown with a “+” after the number (e.g. 32+ months). Censored data need survival analysis (chapter {{c4-3}}).</p>
<h3>Tidy data</h3>
<p>Before importing into any statistics software (including this site's analysis lab), arrange the data so that:</p>
<ul><li>each <b>row</b> is one unit of observation (a patient, a plant, a sample)</li><li>each <b>column</b> is one variable, with names in the first row</li><li>each cell holds a single value; leave missing values blank or write NA</li><li>no merged cells and no information encoded as colour</li></ul>
<p>Also write a <b>codebook</b>: the meaning, unit and coding of each column (e.g. 1 = male, 0 = female). See examples on the Data sets page.</p>`,
    quiz: [
      { q: `A “pain score from 0 to 10” is best classed as?`, o: [`Ordinal (sometimes treated as numerical when the sample is large)`, `Nominal`, `A continuous variable that must be normal`, `Time-to-event`], why: `Pain scores are ordered, but the gap from 2 to 4 is not necessarily the same as from 6 to 8, so it is essentially ordinal.`, look: `The chart switches to the “age group” card: like pain scores it is ordered, but the “distance” between groups is not necessarily equal.` },
      { q: `In this study, “months of follow-up until a cardiovascular event: 35.4+, 25.1+, 3.9, 31.6+” is what type of variable?`, o: [`Time-to-event`, `Continuous`, `Count`, `Ordinal`], why: `Some people had not had the event when follow-up ended (marked +): that is censoring, which requires survival analysis.`, look: `The chart switches to this variable — note the “+” after the numbers; the red 0s in the data table above are these people.` },
    ],
  },
  'c1-2': {
    title: `Central tendency: mean and median`, wtitle: `Mean and median: systolic BP and CRP`, refs: `Whitlock ch. 3; Rosner 2.2–2.3; Kirkwood ch. 4`,
    body: `<div class="formula">mean x̄ = Σx<sub>i</sub> ÷ n　　　median: the middle value after sorting (the average of the two middle values when n is even)</div>
<p>The mean uses every value, so it is sensitive to extreme values; the median only uses order, so it is more <b>robust</b>.</p>
<div class="ex"><b>Example</b>　5 patients' days in hospital: 3, 4, 4, 5, 34. Mean = 10 days, median = 4 days. Which better represents a “typical patient”? The median.</div>
<p><b>Skewness</b> means the distribution is asymmetric. A <b>right-skewed</b> distribution has a long tail on the right: most values are small and a few are very large (e.g. length of stay, income), so the large values pull the mean to the right of the median. <b>Left-skewed</b> is the opposite.</p>
<p>The tool above also computes two numbers describing spread, explained in the next chapter ({{c1-3}}): the <b>standard deviation</b> (SD) describes how far each value is from the mean; the <b>IQR</b> is the range of the middle half of the data, where Q1 is the value at the 25% position and Q3 the value at the 75% position.</p>
<p>Rule of thumb: report the mean when the data are roughly symmetric and the median when they are clearly skewed (length of stay, viral load, income). Change the numbers in the tool above and watch both move.</p>`,
    quiz: [
      { q: `Enter 1, 2, 3, 4, 100 in the tool above. Which statement is correct?`, o: [`The mean is pulled up to 22 by the 100; the median is still 3`, `The median is pulled up`, `Both are 22`, `Both are 3`], why: `A single extreme value can move the mean a lot, but the median only looks at the middle value.`, look: `Compare the red line (mean) with the green dashed line (median).` },
      { q: `In a right-skewed distribution (long tail to the right), usually?`, o: [`mean > median`, `mean < median`, `They are equal`, `Cannot tell`], why: `The large values on the right pull the mean to the right.`, look: `CRP is right-skewed: most people are low and a few are very high (yellow bars on the right). The mean is pulled right, above the median. Switch to “baseline systolic BP”: when the data are symmetric the two almost coincide.` },
    ],
  },
  'c1-3': {
    title: `Variability: standard deviation and interquartile range`, wtitle: `A feel for variability`, refs: `Whitlock ch. 3; Rosner 2.4–2.6; Kirkwood ch. 4`,
    body: `<p>Two groups of patients both have a mean systolic BP of 120 mmHg; in one everyone is between 118 and 122, in the other values range from 90 to 150. Same mean, completely different situations. We need to describe the <i>spread</i>.</p>
<div class="formula">variance s² = Σ(x<sub>i</sub> − x̄)² ÷ (n − 1)<br>standard deviation s = √s² (same units as the data)</div>
<p><b>Why divide by n − 1?</b> x̄ is computed from the same data, so it is naturally closer to them; dividing by n would underestimate the population variability. Dividing by n − 1 (the <b>degrees of freedom</b>) corrects this bias.</p>
<p>Sort the data and cut them into four equal parts; the cut points are the <b>quartiles</b>: Q1 (25th percentile), the median (50th) and Q3 (75th).</p>
<p>The <b>interquartile range IQR</b> = Q3 − Q1, the range of the middle 50% of the data. It is usually paired with the median and written “median [Q1, Q3]”.</p>
<h3>Coefficient of variation</h3>
<div class="formula">coefficient of variation CV = standard deviation ÷ mean × 100%</div>
<p>Standard deviations of measurements with different units or sizes cannot be compared directly. Human weight (mean 70 kg, SD 7) and mouse weight (mean 25 g, SD 2.5) both have a CV of 10%: the same relative variability. Laboratories often use the CV to describe the precision of an assay (variability of repeated measurements of the same sample). The CV only makes sense for data with a true zero and positive values (weights, concentrations), not for temperature in °C.</p>
<div class="ex"><b>How to write it</b>　“Age was 58.2 ± 9.1 years” (mean ± SD); “median length of stay 4 days (IQR 3–6)”.</div>
<p>The first table of a paper (called <b>Table 1</b>, chapter {{c1-5}}) describes the study participants with mean ± SD.</p>
<p class="warn">Do not confuse <b>SD</b> with <b>SE</b>. The SD describes differences between individuals; the SE describes the uncertainty of the mean as an estimate (chapter {{c2-2}}). Use the SD to describe participants.</p>`,
    quiz: [
      { q: `After adding an extreme value of 240 mmHg to group B (H8), which number changes more?`, o: [`The SD rises clearly; the IQR barely changes`, `The IQR rises clearly; the SD does not change`, `Neither changes`, `Both rise by the same amount`], why: `The SD uses the squared distance of every value from the mean, so one extreme value has a large effect; the IQR only looks at the middle 50% of the data.`, look: `Compare group B's SD and IQR cards (before and after ticking the box), and where the red point is.` },
      { q: `When describing participants' characteristics (Table 1), continuous variables should be shown with?`, o: [`SD`, `SE`, `p-value`, `Sample size`], why: `Table 1 describes differences between individuals, so it uses the SD.`, look: `The dark band is mean ± 1 SD: it describes how spread out blood pressure is “between patients”.` },
      { q: `A glucose meter measuring the same sample repeatedly gives mean 100 mg/dL, SD 4; another gives mean 200 mg/dL, SD 6. Which has the smaller relative variability?`, o: [`The second: CV 3% vs 4% for the first`, `The first: its SD is smaller`, `They are the same`, `Cannot compare`], why: `CV = SD ÷ mean: 4/100 = 4%, 6/200 = 3%. When units are the same but magnitudes differ, compare relative variability with the CV.`, look: `Look at the last two cards: CV = SD ÷ mean. CRP's CV is far larger than systolic BP's (switch back to compare): relative to its own mean, CRP is much more spread out.` },
    ],
  },
  'graphs': {
    title: `Displaying data`, refs: `Whitlock ch. 2; Rosner 2.8; Kirkwood ch. 3`,
    body: `<p>The first step in analysing data is always to <b>draw it</b>. Graphs show what means and p-values hide: skewness, extreme values, clusters, data-entry errors. Which graph to choose depends on the type of variable (chapter {{c1-1}}).</p>
<div class="tbl-wrap"><table class="st"><thead><tr><th>To show</th><th>Suitable graph</th></tr></thead><tbody>
<tr><td>Counts in each category of a categorical variable</td><td><b>Bar chart</b> (bars start at 0)</td></tr>
<tr><td>The distribution of a numerical variable</td><td><b>Histogram</b>, box plot, dot plot</td></tr>
<tr><td>A numerical variable compared across groups</td><td>Box plot or dot plot (show every point when samples are small)</td></tr>
<tr><td>The relationship between two numerical variables</td><td><b>Scatter plot</b></td></tr>
<tr><td>Change over time</td><td>Line plot (points from the same individual joined)</td></tr></tbody></table></div>
<h3>Histograms</h3>
<p>Cut the range of values into equal-width intervals (bins); the bar height is the number of values in each bin. The <b>number of bins</b> changes what you see: too few and the detail is smoothed away; too many and each bin holds only a few values and looks noisy. Try several before deciding.</p>
<h3>Box plots</h3>
<p>The box runs from the 25th to the 75th percentile (the interquartile range), the line inside is the median, the whiskers extend to the furthest value within 1.5 times the interquartile range, and points beyond are drawn individually. A box plot shows centre, spread, skewness and extreme values in very little space, ideal for comparing several groups side by side.</p>
<h3>Principles of good graphs</h3>
<ul><li><b>Show the data</b>: with small samples draw every point rather than just a bar of the mean (chapter {{c5-3}}).</li>
<li>The y-axis of a bar chart must start at 0, otherwise differences are exaggerated.</li>
<li>Avoid 3D charts and pie charts: the eye compares lengths far more accurately than angles or areas.</li>
<li>Label axes with the variable and units; state whether error bars are SD, SE or confidence intervals.</li></ul>`,
    quiz: [
      { q: `To see the shape of the distribution of a continuous variable such as “days in hospital”, which graph is best?`, o: [`Histogram`, `Pie chart`, `Bar chart (counts per category)`, `Scatter plot`], why: `A histogram cuts values into intervals and shows the shape of the distribution; scatter plots are for two numerical variables.`, look: `Histogram: most people have low CRP and a few have high values — a long tail to the right.` },
      { q: `What happens if a histogram has too few bins?`, o: [`Details of the distribution (e.g. skewness, two peaks) are smoothed away`, `False positives increase`, `The mean changes`, `The sample size shrinks`], why: `The number of bins only affects the display, not the data; too few hides the shape and too many looks noisy.`, look: `Only 3 bins: the long right tail is barely visible. Set the bins back to 12 or 40 and compare.` },
      { q: `Two groups of only 6 mice each are to be compared. The best display is?`, o: [`A dot plot or box plot showing every data point`, `Just two bars of the means with SE`, `A pie chart`, `Report only the p-value`], why: `With small samples, bar charts of means hide the distribution and extreme values.`, look: `The bar chart of the mean shows only one number and a short error bar — no skewness or extreme values. Switch to “dot plot” to compare.` },
    ],
  },
  'c1-4': {
    title: `The normal distribution and z-scores`, wtitle: `The normal curve and cumulative probability`, refs: `Whitlock ch. 10; Rosner ch. 5; Kirkwood ch. 5`,
    body: `<p>Many biological measurements (height, blood pressure, measurement error) roughly follow the bell-shaped <b>normal distribution</b>, determined by two numbers: the mean μ and the standard deviation σ.</p>
<div class="formula">z = (x − μ) ÷ σ　　(how many standard deviations from the mean)</div>
<p><b>The 68–95–99.7 rule</b>: about 68% of values lie within μ ± 1σ, 95% within μ ± 1.96σ and 99.7% within μ ± 3σ.</p>
<p><b>Percentile</b>: the p-th percentile is the value that p% of values are less than or equal to. A height at the 90th percentile means 90% of people are shorter or the same height. For the normal distribution, P(X ≤ x) is “the probability of being less than or equal to x”; multiplied by 100 it is the percentile. z = 2 is at about the 97.7th percentile.</p>
<p>z-scores make quantities with different units comparable, e.g. height z-scores on children's growth charts or T-scores for bone density.</p>
<p class="note">The normal distribution is a model; real data are not guaranteed to follow it. Check with a histogram or a Q–Q plot. With large samples, t-tests and regression tolerate non-normality well; with small, very skewed samples, consider a log transformation or nonparametric methods.</p>`,
    quiz: [
      { q: `The 400 patients' baseline systolic BP has mean 150.4 and SD 13.7. Patient S001 has 178 mmHg. The z-score is about?`, o: [`2.0`, `27.6`, `1.3`, `−2.0`], why: `(178 − 150.4) ÷ 13.7 ≈ 2.0: about 2 standard deviations above the mean.`, look: `The black line (178) is near the second dashed line to the right of the mean: each dashed line is 1 SD. Click the “z-score” card.` },
      { q: `z = 2 is at about which percentile?`, o: [`About the 97.7th percentile`, `The 2nd percentile`, `The 50th percentile`, `The 68th percentile`], why: `P(Z ≤ 2) ≈ 0.977. Check with the tool above.`, look: `z ≈ 2. Compare P(X ≤ x) from the “normal curve” with the “actual proportion”: the normal curve is an approximation and the real data agree reasonably well.` },
    ],
  },
  'c1-5': {
    title: `Table 1: describing your participants`, refs: `Kirkwood ch. 34`, labs: [`Make a Table 1 for the BP trial`],
    body: `<p>The first table of almost every clinical or epidemiological paper is “Table 1”: participants' baseline characteristics by group, so readers can judge who was studied and whether the groups are comparable.</p>
<ul><li>Continuous variables: mean ± SD (roughly normal) or median [IQR] (skewed)</li><li>Categorical variables: n (%)</li><li>Column headings give the group size, e.g. “Drug (n = 60)”</li><li>State the number of missing values</li></ul>
<h3>Terms used in this chapter</h3>
<ul><li><b>Randomized controlled trial</b> (RCT): a chance mechanism, like drawing lots, decides whether each participant gets the new drug or placebo. Because the decision is random, the groups differ in characteristics such as age only by chance.</li>
<li><b>p-value</b> (explained in chapter {{c2-4}}): assuming the groups truly do not differ, the probability of seeing a difference this large (or larger).</li>
<li><b>Adjustment</b>: when comparing groups, include other variables that affect the outcome (such as age) in the calculation, so the comparison is effectively between “people of the same age” (chapter {{c4-1}}).</li>
<li><b>Clinical significance</b>: a difference large enough to matter for patients or treatment decisions. An age difference of 1 year can have p &lt; 0.05 yet mean nothing clinically.</li></ul>
<p class="warn">In a <b>randomized controlled trial</b>, the CONSORT guideline recommends <b>not</b> putting p-values in Table 1: allocation was random, so any difference is by definition due to chance. Observational studies may show group differences, but the emphasis should be on their size, not on p-values.</p>
<p>In the lab, use the “BP drug randomized trial” data and group by group to make a Table 1. Think about it: should this table keep the p-value column?</p>`,
    quiz: [
      { q: `An RCT's Table 1 shows p = 0.03 for age between groups. What should you do?`, o: [`Treat it as chance; judge whether the size of the difference matters clinically and adjust in the main analysis if needed`, `It means randomization failed and the study is invalid`, `Delete the age row`, `Switch to medians until p > 0.05`], why: `Under randomization, about 1 in 20 variables having p < 0.05 is expected. Variables to adjust for should be specified in the analysis plan in advance.`, look: `This is a randomized trial's Table 1, with a p-value column on the right. Turn off “show p-value column” and see whether the table is still complete.` },
    ],
  },
});
