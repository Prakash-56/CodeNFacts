"use client";

import { useMemo, useState } from "react";

/* -------------------------------------------------------------------------
 * R LANGUAGE — CATEGORY PAGE
 * Signature idea: the whole page is framed like an R console session —
 * "why R" is the prompt, the topics are what you'd actually type, and the
 * quiz/cheat-sheet are the kind of reference card every R user keeps open
 * in a second tab. Works with your existing header's light/dark toggle
 * (Tailwind `dark:` classes react to a `dark` class on <html>).
 * ---------------------------------------------------------------------- */

/* ----------------------------- data: topics ----------------------------- */

type Topic = {
  id: string;
  category: string;
  title: string;
  tagline: string;
  points: string[];
  code?: string;
};

const TOPICS: Topic[] = [
  {
    id: "what-is-r",
    category: "Foundations",
    title: "What R actually is",
    tagline: "A language built by statisticians, for statisticians — then adopted by everyone doing data work.",
    points: [
      "R is a language + environment for statistical computing and graphics, born out of the S language at Bell Labs.",
      "Distributed as 'base R', extended by 20,000+ packages hosted on CRAN (the Comprehensive R Archive Network).",
      "RStudio / Posit is the IDE almost everyone uses — console, script editor, plots, and environment viewer in one window.",
      "R is interpreted and interactive: you run one line, see the result immediately, then build on it. That loop is the whole point.",
    ],
  },
  {
    id: "repl-mindset",
    category: "Foundations",
    title: "The console mindset",
    tagline: "R rewards thinking in small, checkable steps instead of writing a whole program blind.",
    points: [
      "You explore data live in the console before you ever save a script — test an idea, see the output, keep or discard it.",
      "Assignment is written as `<-` (though `=` also works) — a small habit that signals 'this is R' at a glance.",
      "Everything you type returns a value; even a `for` loop or an assignment can be inspected immediately after.",
      "This tight feedback loop is why R is often the first language recommended for people who think in data, not in software architecture.",
    ],
    code: `x <- c(4, 8, 15, 16, 23, 42)\nmean(x)\n#> [1] 18\nsd(x)\n#> [1] 13.9`,
  },
  {
    id: "data-types",
    category: "Foundations",
    title: "Data types",
    tagline: "Fewer, simpler base types than most languages — R spends its complexity budget on structures instead.",
    points: [
      "Core atomic types: double/integer (numeric), character (strings), logical (TRUE/FALSE), complex, and raw.",
      "`NA` is a first-class citizen — every type has its own missing-value marker (NA_real_, NA_character_, ...).",
      "Dates and times get dedicated classes (`Date`, `POSIXct`) rather than being plain strings — this matters constantly in real data.",
      "`class()`, `typeof()`, and `str()` are the three functions you'll run hundreds of times to sanity-check what you're holding.",
    ],
    code: `class(42L)      #> "integer"\nclass(42)       #> "numeric"\nclass("42")     #> "character"\nclass(TRUE)     #> "logical"`,
  },
  {
    id: "vectors",
    category: "Data structures",
    title: "Vectors & vectorization",
    tagline: "The single biggest shift in how R makes you think about loops.",
    points: [
      "A vector is R's most basic structure — even a single number is a vector of length 1.",
      "Operations apply element-wise automatically: `x * 2` scales every element, no loop required.",
      "'Vectorize instead of loop' is the core performance and readability rule in R — a `for` loop over a vector is usually a smell.",
      "Recycling rule: shorter vectors are repeated to match longer ones, silently — a common source of subtle bugs worth knowing.",
    ],
    code: `x <- c(1, 2, 3, 4)\ny <- c(10, 20)\nx + y\n#> [1] 11 22 13 24   (y recycled)`,
  },
  {
    id: "lists",
    category: "Data structures",
    title: "Lists",
    tagline: "R's answer to 'what if elements don't all need to be the same type'.",
    points: [
      "Unlike vectors, list elements can be different types and different lengths — including other lists.",
      "Almost every complex R object (a fitted model, a data frame under the hood) is a list with attributes.",
      "Access with `[[ ]]` for a single element's value, `[ ]` for a sub-list, `$` for named access.",
      "Model output objects (e.g. from `lm()`) are lists — that's why `model$coefficients` works.",
    ],
  },
  {
    id: "matrices",
    category: "Data structures",
    title: "Matrices & arrays",
    tagline: "Same type, multiple dimensions — the backbone of linear algebra in R.",
    points: [
      "A matrix is a vector with a `dim` attribute — everything you know about vectors still applies underneath.",
      "Matrix multiplication uses `%*%`, never plain `*` (which stays element-wise) — a classic beginner mix-up.",
      "Arrays generalize matrices to 3+ dimensions — used less often, but common in image/tensor-style data.",
      "`t()` transposes, `solve()` inverts, `dim()` and `nrow()/ncol()` describe shape.",
    ],
  },
  {
    id: "data-frames",
    category: "Data structures",
    title: "Data frames",
    tagline: "The structure everything in applied R eventually revolves around.",
    points: [
      "A data frame is a list of equal-length vectors — each column can be a different type, which is exactly what tabular data needs.",
      "`tibble` (from the tidyverse) is a stricter, friendlier data frame: no silent type conversion, cleaner printing.",
      "Row/column access mirrors matrices: `df[rows, cols]`, plus `df$column` and `df[[column_name]]` for single columns.",
      "Almost every dataset you import — CSV, Excel, SQL query result — lands as a data frame.",
    ],
    code: `df <- data.frame(name = c("A","B"), score = c(88, 92))\ndf$score\n#> [1] 88 92`,
  },
  {
    id: "factors",
    category: "Data structures",
    title: "Factors",
    tagline: "R's built-in way to model categorical variables — the thing that trips up almost every newcomer once.",
    points: [
      "A factor stores categories as integers under the hood, with a `levels` attribute holding the labels.",
      "Critical for statistics: `lm()`, `glm()`, and plotting functions treat factors specially (as groups, not numbers).",
      "Converting a factor straight to numeric gives you the underlying integer codes, not the labels — a famous gotcha.",
      "Ordered factors (`factor(x, ordered = TRUE)`) encode rank, e.g. 'low' < 'medium' < 'high'.",
    ],
  },
  {
    id: "control-flow",
    category: "Logic & functions",
    title: "Control flow",
    tagline: "The same building blocks as any language — used far less often than you'd expect.",
    points: [
      "`if / else`, `for`, `while`, `repeat` all exist and work as in most C-family languages.",
      "Because vectorized operations replace most loops, control flow in R is mainly for genuine branching logic, not iteration over data.",
      "`ifelse()` is a vectorized alternative to `if/else` for element-wise decisions across a whole vector at once.",
      "`next` skips an iteration, `break` exits a loop — identical semantics to most languages.",
    ],
    code: `ifelse(c(-2, 3, -1, 5) < 0, "neg", "pos")\n#> [1] "neg" "pos" "neg" "pos"`,
  },
  {
    id: "functions",
    category: "Logic & functions",
    title: "Writing functions",
    tagline: "Functions are values — you can pass them around like any other object.",
    points: [
      "Defined with `function(args) { body }`; the last evaluated expression is returned automatically (`return()` is optional).",
      "R uses lexical scoping: a function looks for variables in the environment where it was *defined*, not where it's called.",
      "Default arguments, `...` (dot-dot-dot for arbitrary extra args), and named arguments make R functions flexible to call.",
      "Because functions are first-class, you can write a function that takes another function as an argument — this is everywhere in R.",
    ],
    code: `z_score <- function(x, na.rm = TRUE) {\n  (x - mean(x, na.rm = na.rm)) / sd(x, na.rm = na.rm)\n}\nz_score(c(2, 4, 4, 4, 5, 5, 7, 9))`,
  },
  {
    id: "apply-family",
    category: "Logic & functions",
    title: "The apply family",
    tagline: "How experienced R users replace loops entirely — apply a function over a structure.",
    points: [
      "`sapply()` / `lapply()` apply a function to every element of a vector or list — `lapply` always returns a list, `sapply` simplifies when possible.",
      "`vapply()` is the safer sibling: you declare the expected output type, so bugs fail loudly instead of silently.",
      "`mapply()`/`Map()` apply a function over several vectors in parallel, position by position.",
      "This 'functional over data' style is the strongest reason R changes how people think about logic — you describe *what* to compute, not *how* to loop.",
    ],
    code: `sapply(1:5, function(n) n^2)\n#> [1]  1  4  9 16 25`,
  },
  {
    id: "tidyverse",
    category: "Wrangling & viz",
    title: "The tidyverse & the pipe",
    tagline: "A consistent grammar for data manipulation that reads like a sentence.",
    points: [
      "The pipe `|>` (base R) or `%>%` (magrittr) passes the result on its left into the first argument on its right — code reads top to bottom.",
      "`dplyr` gives you five core verbs: `filter()`, `select()`, `mutate()`, `arrange()`, `summarise()` — combined with `group_by()` for per-group work.",
      "`tidyr` reshapes data: `pivot_longer()` / `pivot_wider()` are the modern replacements for `melt`/`cast`-style reshaping.",
      "This chain-of-verbs style is often people's first real exposure to a 'declarative' way of describing data transformations.",
    ],
    code: `df |>\n  filter(score > 80) |>\n  group_by(team) |>\n  summarise(avg = mean(score))`,
  },
  {
    id: "import-cleaning",
    category: "Wrangling & viz",
    title: "Import & cleaning",
    tagline: "Real R work is 70% getting data into shape before any analysis happens.",
    points: [
      "`readr::read_csv()` is faster and more predictable than base `read.csv()` (no silent factor conversion, clear column types).",
      "Missing data shows up as `NA` — `is.na()`, `complete.cases()`, and `tidyr::drop_na()`/`replace_na()` are the standard toolkit.",
      "`stringr` and `lubridate` handle the two messiest raw-data types: text and dates.",
      "Type mismatches after import (numbers read as text, dates read as text) are the single most common source of downstream bugs.",
    ],
  },
  {
    id: "ggplot2",
    category: "Wrangling & viz",
    title: "Visualization with ggplot2",
    tagline: "The 'Grammar of Graphics' — plots are built by layering, not by picking a chart type.",
    points: [
      "Every plot starts with `ggplot(data, aes(x, y))` — you map data columns to visual properties (aesthetics), then add layers with `+`.",
      "Geoms (`geom_point`, `geom_line`, `geom_bar`, `geom_boxplot`...) define *how* the mapped data is drawn.",
      "Facets (`facet_wrap`, `facet_grid`) split one plot into a grid of small multiples by a categorical variable — extremely powerful for comparison.",
      "This layered, declarative approach is widely considered R's single biggest advantage over other languages for exploratory analysis.",
    ],
    code: `ggplot(df, aes(x = height, y = weight, color = sex)) +\n  geom_point() +\n  geom_smooth(method = "lm")`,
  },
  {
    id: "strings-regex",
    category: "Wrangling & viz",
    title: "Strings & regular expressions",
    tagline: "Text cleaning is unavoidable — `stringr` makes the base functions consistent.",
    points: [
      "`stringr` functions all start with `str_` and take the string first — `str_detect()`, `str_replace()`, `str_split()`, `str_trim()`.",
      "Regular expressions work the same as in most languages; R's base `grepl()`/`gsub()`/`sub()` do the same job with older syntax.",
      "`paste()` / `paste0()` combine strings; `sprintf()` gives C-style formatted output for precise number formatting.",
      "Encoding issues (UTF-8 vs Latin-1) are a real, recurring headache — check `Encoding()` when text looks corrupted.",
    ],
  },
  {
    id: "descriptive-stats",
    category: "Statistics & ML",
    title: "Descriptive stats & distributions",
    tagline: "R was designed for exactly this — it shows in how few keystrokes it takes.",
    points: [
      "`mean()`, `median()`, `sd()`, `var()`, `quantile()`, `summary()` — the whole descriptive toolkit is built in, no imports needed.",
      "Every standard distribution has four functions: `d` (density), `p` (cumulative probability), `q` (quantile), `r` (random draw) — e.g. `dnorm`, `pnorm`, `qnorm`, `rnorm`.",
      "`table()` and `prop.table()` give quick frequency counts and proportions for categorical data.",
      "`cor()` and `cov()` compute correlation/covariance directly on numeric vectors or whole data frames.",
    ],
    code: `rnorm(5, mean = 100, sd = 15)\nquantile(x, probs = c(0.25, 0.5, 0.75))`,
  },
  {
    id: "hypothesis-testing",
    category: "Statistics & ML",
    title: "Hypothesis testing",
    tagline: "Classical inferential statistics, one function call away.",
    points: [
      "`t.test()` for comparing means, `chisq.test()` for categorical association, `aov()`/`anova()` for comparing 3+ group means.",
      "Every test's output is a structured object — `$p.value`, `$statistic`, `$conf.int` — not text you have to parse.",
      "`shapiro.test()` checks normality; many tests assume it, so this usually runs first.",
      "This is where R's statistical DNA shows most clearly — these tests are first-class, not an add-on library.",
    ],
  },
  {
    id: "regression",
    category: "Statistics & ML",
    title: "Linear & logistic regression",
    tagline: "`lm()` and `glm()` — arguably the two most-used functions in all of applied R.",
    points: [
      "`lm(y ~ x1 + x2, data = df)` fits a linear model using R's compact 'formula' syntax — `~` means 'is modeled by'.",
      "`glm(y ~ x, family = binomial)` fits logistic regression for a binary outcome; `family` swaps in Poisson, Gamma, etc. for other response types.",
      "`summary(model)` returns coefficients, standard errors, p-values, and R² — everything needed to interpret the fit.",
      "`predict(model, newdata)` scores new data — the same pattern used across nearly every modeling function in R.",
    ],
    code: `model <- lm(mpg ~ wt + hp, data = mtcars)\nsummary(model)$coefficients`,
  },
  {
    id: "model-training",
    category: "Statistics & ML",
    title: "Training models, end to end",
    tagline: "The actual workflow you'll repeat for almost every predictive-modeling task in R.",
    points: [
      "Split the data: `set.seed()` then sample row indices, or use `rsample::initial_split()` from tidymodels for a clean train/test split.",
      "Preprocess: centre/scale numeric predictors, encode factors, handle missing values — `recipes` (tidymodels) or `caret::preProcess()`.",
      "Fit: pick an engine — `lm`/`glm` for classical models, `randomForest`, `xgboost`, or a tidymodels `parsnip` spec for ML models.",
      "Tune & validate: `caret::train()` or `tidymodels::tune_grid()` run k-fold cross-validation and grid-search hyperparameters automatically.",
      "Evaluate on the held-out test set only once, at the end — reusing it earlier quietly invalidates the whole evaluation.",
    ],
    code: `set.seed(42)\nsplit <- rsample::initial_split(df, prop = 0.8)\ntrain <- rsample::training(split)\ntest  <- rsample::testing(split)\n\nfit <- glm(outcome ~ ., data = train, family = binomial)\npreds <- predict(fit, test, type = "response")`,
  },
  {
    id: "model-evaluation",
    category: "Statistics & ML",
    title: "Evaluating a trained model",
    tagline: "A model that fits well isn't the same as a model that predicts well.",
    points: [
      "Regression: RMSE, MAE, and R² on the test set (`yardstick::rmse()`, or compute directly from residuals).",
      "Classification: confusion matrix (`caret::confusionMatrix()` or `table(predicted, actual)`), accuracy, precision, recall, F1.",
      "ROC curves and AUC (`pROC::roc()`) summarize classifier performance across every possible threshold, not just one cutoff.",
      "Cross-validation error (from training) and test-set error should be reasonably close — a big gap signals overfitting.",
    ],
  },
  {
    id: "rmarkdown",
    category: "Advanced & practical",
    title: "R Markdown / Quarto",
    tagline: "Code, output, and narrative in one reproducible document.",
    points: [
      "A `.Rmd`/`.qmd` file mixes Markdown prose with executable R 'chunks' — running it regenerates the whole report, plots included.",
      "Renders to HTML, PDF, or Word from the same source — one document, multiple deliverables.",
      "This is how most R analyses become 'reproducible research': anyone can re-run the file and get the same report from the same data.",
      "Parameters (`params:` in the YAML header) let one template generate different reports for different inputs automatically.",
    ],
  },
  {
    id: "shiny",
    category: "Advanced & practical",
    title: "Shiny — interactive apps",
    tagline: "Turn an analysis into something a non-coder can click through.",
    points: [
      "A Shiny app has a `ui` (what's on screen) and a `server` (how inputs turn into outputs) — reactive by design.",
      "Reactive expressions re-run automatically whenever an input they depend on changes — no manual event wiring needed.",
      "Commonly used for internal dashboards, model-exploration tools, and letting stakeholders adjust parameters live.",
      "Deployable to `shinyapps.io`, a company's own Shiny Server, or embedded in an R Markdown/Quarto document.",
    ],
  },
  {
    id: "debugging-perf",
    category: "Advanced & practical",
    title: "Debugging & performance",
    tagline: "Where R punishes loop-heavy, non-vectorized thinking the most.",
    points: [
      "`traceback()` shows the call stack after an error; `browser()` drops you into an interactive debugger at a specific line.",
      "Growing a vector/data frame inside a loop (`x <- c(x, new)`) is the single most common R performance mistake — pre-allocate instead.",
      "`Rprof()` or the `profvis` package show exactly which lines are slow, instead of guessing.",
      "Rule of thumb: if you're writing a `for` loop to touch every row of a vector, there's almost always a vectorized or `apply`-family alternative.",
    ],
  },
  {
    id: "packages",
    category: "Advanced & practical",
    title: "Packages & CRAN",
    tagline: "R's real power is rarely in base R — it's in the ecosystem.",
    points: [
      "`install.packages(\"name\")` installs from CRAN once; `library(name)` loads it into every new session.",
      "CRAN enforces strict checks (docs, tests, no broken dependencies) — a big reason R packages tend to be reliable.",
      "`renv` locks exact package versions per project, so an analysis still runs the same way a year later.",
      "Writing your own package (`usethis::create_package()`) is the standard way to share reusable functions across projects or with a team.",
    ],
  },
];

const CATEGORY_ORDER = [
  "Foundations",
  "Data structures",
  "Logic & functions",
  "Wrangling & viz",
  "Statistics & ML",
  "Advanced & practical",
];

/* ------------------------------ data: quiz ------------------------------ */

type QuizQ = {
  q: string;
  options: string[];
  answer: number;
  explain: string;
};

const QUIZ: QuizQ[] = [
  {
    q: "What does `<-` do in R?",
    options: ["Comments out a line", "Assigns a value to a name", "Compares two values", "Pipes output forward"],
    answer: 1,
    explain: "`<-` is R's conventional assignment operator; `x <- 5` stores 5 in x. `=` also works for assignment in most contexts.",
  },
  {
    q: "What will `class(42L)` return?",
    options: ["\"numeric\"", "\"double\"", "\"integer\"", "\"character\""],
    answer: 2,
    explain: "The `L` suffix forces a literal to be stored as an integer type rather than the default double.",
  },
  {
    q: "Which structure can hold a number, a string, and a data frame all in one object?",
    options: ["A vector", "A matrix", "A list", "A factor"],
    answer: 2,
    explain: "Lists are R's heterogeneous container — elements can be any type, including other lists or data frames.",
  },
  {
    q: "Why is `for` looping over a vector often discouraged in R?",
    options: [
      "for loops are disabled by default",
      "Vectorized operations already apply element-wise and are typically faster and clearer",
      "R can't loop over numeric vectors",
      "It causes a syntax error",
    ],
    answer: 1,
    explain: "R vectorizes most arithmetic and comparison operations automatically, so a loop is usually unnecessary overhead.",
  },
  {
    q: "What does the pipe `|>` (or `%>%`) do?",
    options: [
      "Runs code in parallel",
      "Comments out the rest of the line",
      "Passes the left-hand result as the first argument to the right-hand function",
      "Imports a package",
    ],
    answer: 2,
    explain: "`x |> f()` is equivalent to `f(x)` — it lets you chain steps left-to-right instead of nesting function calls.",
  },
  {
    q: "In `lm(y ~ x, data = df)`, what does the `~` mean?",
    options: ["Bitwise NOT", "\"is modeled by\" — defines the formula for the fit", "String concatenation", "Approximate equality"],
    answer: 1,
    explain: "R's formula syntax `response ~ predictors` is used across nearly every modeling function, not just `lm`.",
  },
  {
    q: "A factor stores its categories internally as:",
    options: ["Character strings only", "Integers, with a separate levels attribute for labels", "Floating point numbers", "Lists of strings"],
    answer: 1,
    explain: "This is why `as.numeric()` on a factor gives integer codes, not the visible labels — a classic beginner trap.",
  },
  {
    q: "Which function family applies another function across every element of a list/vector without writing an explicit loop?",
    options: ["print(), cat()", "sapply()/lapply()/vapply()", "library(), require()", "setwd(), getwd()"],
    answer: 1,
    explain: "The apply family is R's idiomatic replacement for explicit loops when transforming a whole structure.",
  },
  {
    q: "What's the recommended reason to evaluate a model on a held-out test set only once, at the end?",
    options: [
      "It saves computing time",
      "R can only predict once per session",
      "Reusing the test set earlier for tuning quietly leaks information and inflates the reported performance",
      "Test sets expire after one use",
    ],
    answer: 2,
    explain: "Repeatedly checking test performance during tuning turns the test set into a second training set, biasing your final estimate.",
  },
  {
    q: "What does `ggplot2`'s 'grammar of graphics' approach mean in practice?",
    options: [
      "You pick one pre-made chart type from a dropdown",
      "You build a plot by layering data, aesthetic mappings, and geoms with `+`",
      "It only works with base R plots",
      "It requires a GPU",
    ],
    answer: 1,
    explain: "Instead of choosing a chart type directly, you map variables to aesthetics and add geometric layers — highly composable.",
  },
];

/* --------------------------- data: cheat sheet --------------------------- */

type CheatRow = { code: string; desc: string };
type CheatGroup = { title: string; rows: CheatRow[] };

const CHEATSHEET: CheatGroup[] = [
  {
    title: "Vectors & basics",
    rows: [
      { code: "c(1, 2, 3)", desc: "Combine values into a vector" },
      { code: "seq(1, 10, by = 2)", desc: "Sequence with a step" },
      { code: "rep(x, times = 3)", desc: "Repeat a vector" },
      { code: "length(x)", desc: "Number of elements" },
      { code: "x[c(1,3)]", desc: "Subset by position" },
      { code: "x[x > 5]", desc: "Subset by logical condition" },
    ],
  },
  {
    title: "Data frames",
    rows: [
      { code: "str(df)", desc: "Structure / column types" },
      { code: "head(df, 5)", desc: "First 5 rows" },
      { code: "df[df$score > 80, ]", desc: "Filter rows (base R)" },
      { code: "df$new <- df$a + df$b", desc: "Add a computed column" },
      { code: "nrow(df); ncol(df)", desc: "Dimensions" },
      { code: "colnames(df)", desc: "Column names" },
    ],
  },
  {
    title: "dplyr verbs",
    rows: [
      { code: "filter(df, x > 10)", desc: "Keep matching rows" },
      { code: "select(df, a, b)", desc: "Keep specific columns" },
      { code: "mutate(df, z = a * b)", desc: "Add/modify a column" },
      { code: "arrange(df, desc(x))", desc: "Sort rows" },
      { code: "group_by(df, g) |> summarise(m = mean(x))", desc: "Aggregate per group" },
      { code: "left_join(a, b, by = \"id\")", desc: "Join two tables" },
    ],
  },
  {
    title: "Stats & distributions",
    rows: [
      { code: "mean(x); median(x); sd(x)", desc: "Central tendency & spread" },
      { code: "summary(x)", desc: "Quick 5-number summary" },
      { code: "cor(x, y)", desc: "Correlation" },
      { code: "rnorm(n, mean, sd)", desc: "Random normal draws" },
      { code: "t.test(x, y)", desc: "Compare two means" },
      { code: "lm(y ~ x, data = df)", desc: "Fit a linear model" },
    ],
  },
  {
    title: "Plotting (ggplot2)",
    rows: [
      { code: "ggplot(df, aes(x, y))", desc: "Start a plot, map variables" },
      { code: "+ geom_point()", desc: "Scatter layer" },
      { code: "+ geom_line()", desc: "Line layer" },
      { code: "+ geom_boxplot()", desc: "Boxplot layer" },
      { code: "+ facet_wrap(~group)", desc: "Small multiples by group" },
      { code: "+ labs(title = \"...\")", desc: "Titles & axis labels" },
    ],
  },
  {
    title: "Control & functions",
    rows: [
      { code: "if (x > 0) { ... } else { ... }", desc: "Branching" },
      { code: "for (i in seq_along(x)) { ... }", desc: "Loop by index (rare in idiomatic R)" },
      { code: "function(x, y = 1) { x + y }", desc: "Define a function, default arg" },
      { code: "sapply(x, f)", desc: "Apply f() over every element" },
      { code: "ifelse(cond, a, b)", desc: "Vectorized if/else" },
    ],
  },
];

/* -------------------------- data: practice problems ------------------------ */

type Problem = {
  level: "Beginner" | "Intermediate" | "Advanced";
  title: string;
  prompt: string;
  hint: string;
  solution: string;
};

const PROBLEMS: Problem[] = [
  {
    level: "Beginner",
    title: "Vector clean-up",
    prompt:
      "Given `x <- c(4, NA, 8, NA, 15, 16)`, write one line that returns the mean of x, ignoring the missing values.",
    hint: "Most summary functions in R take an `na.rm` argument.",
    solution: `mean(x, na.rm = TRUE)`,
  },
  {
    level: "Beginner",
    title: "FizzBuzz, the R way",
    prompt:
      "Print numbers 1 to 20; multiples of 3 print 'Fizz', multiples of 5 print 'Buzz', multiples of both print 'FizzBuzz'.",
    hint: "You can do this with a loop and if/else, but try `ifelse()` nested calls for a vectorized version.",
    solution: `n <- 1:20\nout <- ifelse(n %% 15 == 0, "FizzBuzz",\n       ifelse(n %% 3 == 0, "Fizz",\n       ifelse(n %% 5 == 0, "Buzz", as.character(n))))\nprint(out)`,
  },
  {
    level: "Intermediate",
    title: "Group summary",
    prompt:
      "Using the built-in `mtcars` dataset, find the average `mpg` for each number of cylinders (`cyl`), sorted from highest to lowest.",
    hint: "group_by() + summarise() + arrange(desc(...)) from dplyr, or aggregate() in base R.",
    solution: `mtcars |>\n  group_by(cyl) |>\n  summarise(avg_mpg = mean(mpg)) |>\n  arrange(desc(avg_mpg))`,
  },
  {
    level: "Intermediate",
    title: "Write your own apply",
    prompt:
      "Write a function `col_means(df)` that returns the mean of every numeric column in a data frame, without a `for` loop.",
    hint: "`sapply()` over `df` applies a function to each column already.",
    solution: `col_means <- function(df) {\n  sapply(df[sapply(df, is.numeric)], mean, na.rm = TRUE)\n}`,
  },
  {
    level: "Intermediate",
    title: "String cleanup",
    prompt:
      "You have `names <- c(\" Alice \", \"BOB\", \"charlie \")`. Return a vector with whitespace trimmed and consistent Title Case.",
    hint: "stringr::str_trim() and stringr::str_to_title() do exactly this.",
    solution: `library(stringr)\nstr_to_title(str_trim(names))\n#> "Alice"   "Bob"   "Charlie"`,
  },
  {
    level: "Advanced",
    title: "Train/test split + logistic regression",
    prompt:
      "Using a data frame `df` with a binary column `outcome`, split it 80/20, fit a logistic regression on the training set, and report accuracy on the test set.",
    hint: "set.seed() first for reproducibility; predict() with type = \"response\" gives probabilities, so threshold at 0.5.",
    solution: `set.seed(1)\nidx <- sample(nrow(df), 0.8 * nrow(df))\ntrain <- df[idx, ]; test <- df[-idx, ]\n\nfit <- glm(outcome ~ ., data = train, family = binomial)\nprobs <- predict(fit, test, type = "response")\npred  <- ifelse(probs > 0.5, 1, 0)\nmean(pred == test$outcome)`,
  },
  {
    level: "Advanced",
    title: "Cross-validated RMSE",
    prompt:
      "Using tidymodels (`rsample`), perform 5-fold cross-validation on a linear model predicting `mpg` from `wt` and `hp` in `mtcars`, and report the average RMSE across folds.",
    hint: "rsample::vfold_cv() creates the folds; loop or map() a fit + yardstick::rmse() over each.",
    solution: `library(tidymodels)\nfolds <- vfold_cv(mtcars, v = 5)\n\nresults <- map_dfr(folds$splits, function(split) {\n  train <- analysis(split); test <- assessment(split)\n  fit <- lm(mpg ~ wt + hp, data = train)\n  preds <- predict(fit, test)\n  tibble(rmse = sqrt(mean((test$mpg - preds)^2)))\n})\nmean(results$rmse)`,
  },
];

/* --------------------------------- page --------------------------------- */

export default function RProgrammingPage() {
  const [openTopic, setOpenTopic] = useState<string | null>(TOPICS[0].id);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [openProblem, setOpenProblem] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const visibleTopics = useMemo(
    () => (activeCategory === "All" ? TOPICS : TOPICS.filter((t) => t.category === activeCategory)),
    [activeCategory]
  );

  const score = useMemo(
    () => QUIZ.reduce((acc, q, i) => acc + (quizAnswers[i] === q.answer ? 1 : 0), 0),
    [quizAnswers]
  );

  function selectAnswer(qIndex: number, optIndex: number) {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  }

  function resetQuiz() {
    setQuizAnswers({});
    setQuizSubmitted(false);
  }

  function downloadNotes() {
    const md = buildNotesMarkdown();
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "R-Programming-Deep-Dive-Notes.md";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap");
        .font-display {
          font-family: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
        }
        .font-body {
          font-family: "Inter", ui-sans-serif, system-ui, sans-serif;
        }
        .font-console {
          font-family: "JetBrains Mono", ui-monospace, monospace;
        }
      `}</style>

      {/* ------------------------------- HERO ------------------------------- */}
      <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800">
        <div className="absolute inset-0 pointer-events-none opacity-[0.05] dark:opacity-[0.08]">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-600 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-amber-500 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center font-body">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-display font-bold text-white text-sm">
                R
              </span>
              <span className="font-console text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Statistical computing language
              </span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight tracking-tight">
              Learn R the way statisticians{" "}
              <span className="text-blue-600 dark:text-blue-400">actually think.</span>
            </h1>

            <p className="mt-5 text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              R turns "loop over the data" into "describe what should happen to the data" — a small mental shift
              that changes how you build logic, not just what syntax you use. This page is a full working
              reference: why R exists, how it reshapes your coding habits, how model training actually works in
              R, plus deep-dive notes, a cheat sheet, practice problems, and a quiz.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={downloadNotes}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-body font-semibold text-sm text-white hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm"
              >
                <DownloadIcon />
                Download full R notes
              </button>
              <a
                href="#cheatsheet"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 px-5 py-3 font-body font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              >
                Jump to cheat sheet
              </a>
              <a
                href="#quiz"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 px-5 py-3 font-body font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              >
                Take the quiz
              </a>
            </div>
          </div>

          {/* console mock — the signature element */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 shadow-xl overflow-hidden">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-slate-800 bg-slate-900">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
              <span className="ml-3 font-console text-xs text-slate-500">R 4.4.1 — console</span>
            </div>
            <pre className="font-console text-[13px] leading-6 p-5 text-slate-300 overflow-x-auto">
              <code>
{`> x <- c(4, 8, 15, 16, 23, 42)
> mean(x)
[1] 18

> model <- lm(mpg ~ wt + hp, data = mtcars)
> summary(model)$r.squared
[1] 0.8268

> library(ggplot2)
> ggplot(mtcars, aes(wt, mpg)) + geom_point()
`}
                <span className="animate-pulse text-blue-400">▍</span>
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* --------------------------- WHY R MATTERS --------------------------- */}
      <section className="mx-auto max-w-6xl px-6 py-16 font-body">
        <SectionEyebrow>Why R, specifically</SectionEyebrow>
        <h2 className="font-display text-2xl md:text-3xl font-bold mt-2 mb-8">
          Why you'd reach for R instead of a general-purpose language
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              title: "Statistics is native, not bolted on",
              body: "Distributions, hypothesis tests, and regression are base-language functions, not third-party add-ons — the vocabulary of statistics is R's own vocabulary.",
            },
            {
              title: "Best-in-class visualization",
              body: "ggplot2's layered grammar of graphics is still the reference point competing tools measure themselves against for exploratory and publication-quality plots.",
            },
            {
              title: "A CRAN package for almost everything",
              body: "20,000+ peer-checked packages cover niche statistical methods that would otherwise take weeks to implement from a paper.",
            },
            {
              title: "Reproducible by default",
              body: "R Markdown/Quarto ties code, output, and narrative into one document — the standard for reproducible research in academia and applied data science.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-5"
            >
              <h3 className="font-display font-semibold text-base mb-2">{card.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------ LOGIC BUILDING SHIFT ------------------------ */}
      <section className="border-y border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
        <div className="mx-auto max-w-6xl px-6 py-16 font-body">
          <SectionEyebrow>How R changes how you build logic</SectionEyebrow>
          <h2 className="font-display text-2xl md:text-3xl font-bold mt-2 mb-6">
            From "loop over it" to "describe what should happen to it"
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mb-8">
            Most people learn programming through explicit loops: walk through a list, do something to each item.
            R nudges you toward a different default — vectorized and functional thinking, where you describe the
            transformation once and let it apply across the whole structure. That habit carries over into every
            language you touch afterward.
          </p>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-100 dark:bg-slate-900 font-display">
                <tr>
                  <th className="px-4 py-3 font-semibold">Mental habit</th>
                  <th className="px-4 py-3 font-semibold">Typical imperative style</th>
                  <th className="px-4 py-3 font-semibold">R's default style</th>
                </tr>
              </thead>
              <tbody className="font-console text-[13px] divide-y divide-slate-200 dark:divide-slate-800">
                <tr>
                  <td className="px-4 py-3 font-body font-medium">Doubling every number</td>
                  <td className="px-4 py-3 text-slate-500">for i in list: out.append(i*2)</td>
                  <td className="px-4 py-3 text-blue-600 dark:text-blue-400">x * 2</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-body font-medium">Filtering rows</td>
                  <td className="px-4 py-3 text-slate-500">if condition: keep.append(row)</td>
                  <td className="px-4 py-3 text-blue-600 dark:text-blue-400">filter(df, condition)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-body font-medium">Applying a function to every item</td>
                  <td className="px-4 py-3 text-slate-500">for item in items: f(item)</td>
                  <td className="px-4 py-3 text-blue-600 dark:text-blue-400">sapply(items, f)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-body font-medium">Grouped aggregation</td>
                  <td className="px-4 py-3 text-slate-500">manual dict of running sums</td>
                  <td className="px-4 py-3 text-blue-600 dark:text-blue-400">group_by(df, g) |&gt; summarise(...)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mt-6 text-sm">
            The practical effect: R developers tend to write shorter functions, think in terms of whole
            columns/vectors rather than single values, and lean on existing statistical/functional building blocks
            instead of re-deriving control-flow logic from scratch. That's a transferable habit — it shows up
            later in pandas (Python), Spark, and SQL, all of which reward the same "operate on the whole set"
            thinking.
          </p>
        </div>
      </section>

      {/* --------------------------- MODEL TRAINING --------------------------- */}
      <section className="mx-auto max-w-6xl px-6 py-16 font-body">
        <SectionEyebrow>Training models in R</SectionEyebrow>
        <h2 className="font-display text-2xl md:text-3xl font-bold mt-2 mb-8">
          The workflow you'll repeat for almost every model
        </h2>

        <ol className="space-y-5">
          {[
            {
              step: "Split your data",
              detail:
                "set.seed() for reproducibility, then hold out a test set (commonly 20–30%) with rsample::initial_split() or plain sample().",
            },
            {
              step: "Preprocess",
              detail:
                "Centre/scale numeric predictors, encode categorical variables, impute or drop missing values — recipes (tidymodels) or caret::preProcess().",
            },
            {
              step: "Choose & fit a model",
              detail:
                "Classical: lm()/glm(). Tree-based: randomForest, xgboost. Unified interface: a parsnip model spec from tidymodels.",
            },
            {
              step: "Cross-validate & tune",
              detail:
                "k-fold CV (vfold_cv() or caret::trainControl(method='cv')) estimates performance honestly and tune_grid()/train() search hyperparameters.",
            },
            {
              step: "Evaluate once, on the test set",
              detail:
                "RMSE/MAE for regression, accuracy/precision/recall/AUC for classification — computed only after tuning is finished.",
            },
            {
              step: "Explain & ship",
              detail:
                "Wrap the fitted model + report in an R Markdown/Quarto document, or serve predictions through a Shiny app or plumber API.",
            },
          ].map((item, i) => (
            <li key={item.step} className="flex gap-4">
              <span className="flex-none font-display font-bold text-blue-600 dark:text-blue-400 text-lg w-8">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display font-semibold">{item.step}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5 max-w-2xl">{item.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ----------------------------- DEEP DIVE ----------------------------- */}
      <section id="topics" className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
        <div className="mx-auto max-w-6xl px-6 py-16 font-body">
          <SectionEyebrow>Deep-dive notes</SectionEyebrow>
          <h2 className="font-display text-2xl md:text-3xl font-bold mt-2 mb-6">
            Every topic you need to actually know R
          </h2>

          <div className="flex flex-wrap gap-2 mb-8">
            {["All", ...CATEGORY_ORDER].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  activeCategory === cat
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {visibleTopics.map((topic) => {
              const isOpen = openTopic === topic.id;
              return (
                <div
                  key={topic.id}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenTopic(isOpen ? null : topic.id)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <div>
                      <span className="font-console text-[11px] uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        {topic.category}
                      </span>
                      <h3 className="font-display font-semibold mt-0.5">{topic.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{topic.tagline}</p>
                    </div>
                    <ChevronIcon open={isOpen} />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 border-t border-slate-100 dark:border-slate-800 pt-4">
                      <ul className="space-y-2 mb-4">
                        {topic.points.map((p, i) => (
                          <li key={i} className="flex gap-2.5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                            <span className="text-blue-600 dark:text-blue-400 mt-0.5">▸</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                      {topic.code && (
                        <pre className="font-console text-[12.5px] leading-6 rounded-lg bg-slate-950 text-slate-200 p-4 overflow-x-auto">
                          <code>{topic.code}</code>
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------------------- CHEAT SHEET ---------------------------- */}
      <section id="cheatsheet" className="mx-auto max-w-6xl px-6 py-16 font-body">
        <SectionEyebrow>Quick reference</SectionEyebrow>
        <h2 className="font-display text-2xl md:text-3xl font-bold mt-2 mb-8">R cheat sheet</h2>

        <div className="grid md:grid-cols-2 gap-5">
          {CHEATSHEET.map((group) => (
            <div key={group.title} className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="px-4 py-3 bg-slate-100 dark:bg-slate-900 font-display font-semibold text-sm">
                {group.title}
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {group.rows.map((row, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 px-4 py-2.5">
                    <code className="font-console text-[12.5px] text-blue-700 dark:text-blue-400 sm:w-[52%] shrink-0">
                      {row.code}
                    </code>
                    <span className="text-sm text-slate-600 dark:text-slate-400">{row.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* -------------------------- PRACTICE PROBLEMS -------------------------- */}
      <section id="problems" className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
        <div className="mx-auto max-w-6xl px-6 py-16 font-body">
          <SectionEyebrow>Practice</SectionEyebrow>
          <h2 className="font-display text-2xl md:text-3xl font-bold mt-2 mb-8">Problems to actually write R</h2>

          <div className="space-y-3">
            {PROBLEMS.map((p) => {
              const isOpen = openProblem === p.title;
              return (
                <div
                  key={p.title}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span
                        className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full mb-2 ${
                          p.level === "Beginner"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                            : p.level === "Intermediate"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
                            : "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400"
                        }`}
                      >
                        {p.level}
                      </span>
                      <h3 className="font-display font-semibold">{p.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">{p.prompt}</p>
                    </div>
                    <button
                      onClick={() => setOpenProblem(isOpen ? null : p.title)}
                      className="flex-none text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap"
                    >
                      {isOpen ? "Hide solution" : "Show hint / solution"}
                    </button>
                  </div>

                  {isOpen && (
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                      <p className="text-sm">
                        <span className="font-semibold">Hint: </span>
                        <span className="text-slate-600 dark:text-slate-400">{p.hint}</span>
                      </p>
                      <pre className="font-console text-[12.5px] leading-6 rounded-lg bg-slate-950 text-slate-200 p-4 overflow-x-auto">
                        <code>{p.solution}</code>
                      </pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* -------------------------------- QUIZ -------------------------------- */}
      <section id="quiz" className="mx-auto max-w-6xl px-6 py-16 font-body">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div>
            <SectionEyebrow>Check yourself</SectionEyebrow>
            <h2 className="font-display text-2xl md:text-3xl font-bold mt-2">Quick R quiz</h2>
          </div>
          {quizSubmitted && (
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 px-4 py-2 font-display font-semibold text-sm">
              Score: <span className="text-blue-600 dark:text-blue-400">{score}</span> / {QUIZ.length}
            </div>
          )}
        </div>

        <div className="space-y-5">
          {QUIZ.map((item, qi) => {
            const chosen = quizAnswers[qi];
            return (
              <div key={qi} className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <h3 className="font-medium mb-3">
                  <span className="font-console text-blue-600 dark:text-blue-400 mr-2">{qi + 1}.</span>
                  {item.q}
                </h3>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {item.options.map((opt, oi) => {
                    const isChosen = chosen === oi;
                    const isCorrect = item.answer === oi;
                    let stateClasses =
                      "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900";
                    if (quizSubmitted) {
                      if (isCorrect) {
                        stateClasses =
                          "border-green-500 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300";
                      } else if (isChosen && !isCorrect) {
                        stateClasses = "border-rose-500 bg-rose-50 dark:bg-rose-900/30 text-rose-800 dark:text-rose-300";
                      }
                    } else if (isChosen) {
                      stateClasses = "border-blue-600 bg-blue-50 dark:bg-blue-900/30";
                    }
                    return (
                      <button
                        key={oi}
                        onClick={() => selectAnswer(qi, oi)}
                        className={`text-left text-sm rounded-lg border px-3.5 py-2.5 transition-colors ${stateClasses}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {quizSubmitted && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                    <span className="font-semibold">Why: </span>
                    {item.explain}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex gap-3">
          {!quizSubmitted ? (
            <button
              onClick={() => setQuizSubmitted(true)}
              disabled={Object.keys(quizAnswers).length < QUIZ.length}
              className="rounded-lg bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed px-5 py-2.5 font-semibold text-sm text-white hover:bg-blue-700 transition-colors"
            >
              Submit answers
            </button>
          ) : (
            <button
              onClick={resetQuiz}
              className="rounded-lg border border-slate-300 dark:border-slate-700 px-5 py-2.5 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
            >
              Retake quiz
            </button>
          )}
        </div>
      </section>

      {/* -------------------------------- FOOTER -------------------------------- */}
      <footer className="border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-body">
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
            Keep this page as your reference while you practice — or grab the notes offline for the console
            session next to you.
          </p>
          <button
            onClick={downloadNotes}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2.5 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors flex-none"
          >
            <DownloadIcon />
            Download R notes (.md)
          </button>
        </div>
      </footer>
    </main>
  );
}

/* ------------------------------ subcomponents ------------------------------ */

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-console text-xs uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
      {children}
    </span>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className={`h-5 w-5 flex-none text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
    >
      <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
      <path
        d="M10 3v9m0 0l-3.5-3.5M10 12l3.5-3.5M4 14.5v1a1.5 1.5 0 001.5 1.5h9a1.5 1.5 0 001.5-1.5v-1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------ notes export ------------------------------ */

function buildNotesMarkdown(): string {
  const topicMd = CATEGORY_ORDER.map((cat) => {
    const items = TOPICS.filter((t) => t.category === cat);
    const body = items
      .map(
        (t) =>
          `### ${t.title}\n_${t.tagline}_\n\n${t.points.map((p) => `- ${p}`).join("\n")}${
            t.code ? `\n\n\`\`\`r\n${t.code}\n\`\`\`` : ""
          }`
      )
      .join("\n\n");
    return `## ${cat}\n\n${body}`;
  }).join("\n\n");

  const cheatMd = CHEATSHEET.map(
    (g) => `### ${g.title}\n\n${g.rows.map((r) => `- \`${r.code}\` — ${r.desc}`).join("\n")}`
  ).join("\n\n");

  const problemsMd = PROBLEMS.map(
    (p) =>
      `### [${p.level}] ${p.title}\n${p.prompt}\n\n**Hint:** ${p.hint}\n\n\`\`\`r\n${p.solution}\n\`\`\``
  ).join("\n\n");

  return `# R Programming — Deep Dive Notes

A complete reference: why R exists, how it shapes coding & logic building, how model training
works in R, deep-dive topic notes, a cheat sheet, and practice problems.

---

# 1. Why R

- R is a language + environment built specifically for statistical computing and graphics.
- Base R is extended by 20,000+ CRAN packages covering nearly every statistical method.
- RStudio/Posit bundles the console, editor, plots, and environment viewer together.
- R Markdown/Quarto make analyses reproducible: code, output, and narrative in one document.

# 2. How R changes coding & logic building

R nudges you from explicit loops ("walk through each item and do X") toward vectorized,
functional thinking ("describe the transformation once, apply it to the whole structure").

| Mental habit               | Typical imperative style        | R's default style                     |
|-----------------------------|----------------------------------|-----------------------------------------|
| Doubling every number       | for i in list: out.append(i*2)  | x * 2                                    |
| Filtering rows              | if condition: keep.append(row)  | filter(df, condition)                    |
| Applying fn to every item   | for item in items: f(item)      | sapply(items, f)                         |
| Grouped aggregation         | manual dict of running sums     | group_by(df, g) |> summarise(...)        |

This habit transfers to pandas, Spark, and SQL later — all reward "operate on the whole set" thinking.

# 3. Training models in R — the workflow

1. **Split your data** — set.seed() + rsample::initial_split() or sample().
2. **Preprocess** — scale/encode/impute via recipes or caret::preProcess().
3. **Fit a model** — lm()/glm() for classical models; randomForest/xgboost/parsnip for ML.
4. **Cross-validate & tune** — vfold_cv()/trainControl(method="cv") + tune_grid()/train().
5. **Evaluate once on the test set** — RMSE/MAE (regression) or accuracy/precision/recall/AUC (classification).
6. **Explain & ship** — R Markdown/Quarto report, or serve via Shiny/plumber.

---

# 4. Deep-dive topics

${topicMd}

---

# 5. Cheat sheet

${cheatMd}

---

# 6. Practice problems

${problemsMd}

---

Generated as part of the R Programming reference page.
`;
}