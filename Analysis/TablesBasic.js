
var localization = {
    en: {
        title: "Table, Basic",
        navigation: "Table, Basic",
        sumvarslabel: "Variables to Summarize",
		bygroupvarlabel: "Groups to Compare (optional)",
		stratavarlabel: "Strata (optional)",
		tabletitlelabel: "Table Title",
		totalcolchkboxlabel: "Include total column",
		groupvarchkboxlabel: "Include group variable name",
		digitslabel: "Digits After Decimal",
		contdigitslabel: "Continuous Values",
		pctdigitslabel: "Percentages",
		pvaluedigitslabel: "P-Values",
		simplifylabel: "Simplify Multi-Row Variable Summaries to One Row (if possible)",
		numericsimplifylabel: "Numeric Variables",
		categorysimplifylabel: "Categorical Variables",
		ordinalsimplifylabel: "Ordinal Variables",
		datesimplifylabel: "Date Variables",
		labelsimplifylabel: "Use Last Level in Label of Categorical Variables",
		conflevellabel: "Confidence Level",
		stattestschkboxlabel: "Statistical Tests",
		numtestlabel: "Numerical Tests",
		anovaoptlabel: "ANOVA",
		kwoptlabel: "Kruskal-Wallis",
		medoptlabel: "Median Test",
		cattestlabel: "Categorical Nominal Tests",
		chisqoptlabel: "Pearson's Chi-Square",
		fisheroptlabel: "Fisher's Exact",
		simchkboxlabel: "Simulate p-values for Pearson and Fisher",
		simnumlabel: "Number of Simulations",
		ordtestlabel: "Categorical Ordinal Tests",
		trendoptlabel: "Trend",
		footnotechkboxlabel: "Test Names Footnote",
		sampsizelabel: "Sample Size",
		meanlabel: "Mean",
		quantileslabel: "Quantiles",
		otherlabel: "Other",
		nmissanylabel: "Number Missing, if any",
		nmissalwayslabel: "Number Missing, always",
		meansdlabel: "Mean (SD)",
		meancilabel: "Mean (CI)",
		meanselabel: "Mean (SE)",
		gmeanlabel: "Geometric Mean",
		gmeansdlabel: "Geometric Mean (SD)",
		gmeancilabel: "Geometric Mean (CI)",
		trimmeancilabel: "Trimmed Mean (CI)",
		trimpctlabel: "Specify Trimmed Mean Percent",
		medianlabel: "Median",
		medianq1q3label: "Median (25th %-ile, 75th %-ile)",
		q1q3label: "(25th %-ile, 75th %-ile)",
		iqrlabel: "Interquartile Range",
		medianrangelabel: "Median (Range)",
		medianmadlabel: "Median (Median Absolute Deviation)",
		rangelabel: "Range",
		minlabel: "Minimum",
		maxlabel: "Maximum",
		pct1label: "1st %-ile (CI)",
		pct5label: "5th %-ile (CI)",
		pct10label: "10th %-ile (CI)",
		pct25label: "25th %-ile (CI)",
		pct33label: "33 1/3 %-ile (CI)",
		pct50label: "Median (CI)",		
		pct66label: "66 2/3 %-ile (CI)",
		pct75label: "75th %-ile (CI)",
		pct90label: "90th %-ile (CI)",
		pct95label: "95th %-ile (CI)",
		pct99label: "99th %-ile (CI)",
		custquantlabel: "Custom %-ile (CI)",
		custquantvaluelabel: "Specify %-ile",
		sumlabel: "Sum",
		sdlabel: "SD",
		varlabel: "Variance",
		gsdlabel: "Geometric Mean SD",
		cvlabel: "Coefficient of Variation",
		skewnesslabel: "Skewness",
		kurtosislabel: "Kurtosis",
		freqlabel: "Frequency",
		freqtotallabel: "Frequency/Total",
		freqpctlabel: "Frequency (%)",
		propcilabel: "Proportion (CI)",	
        help: {
            title: "Table, Basic",
            r_help: "help(tableby, package ='arsenal')",
            body: `
This creates a table of summary statistics with options to specify groups to compare and a stratification variable to do the comparisons within.  One column for each group 
variable category will be created.  The stratification variable categories will form additional rows for the table.  Various summary statistics and statistical tests can be 
specified.
<br/><br/>
<b>Variables to Summarize:</b> Variables for which summary statistics will be computed.  Variables can be numeric, nominal factors, ordered factors, or dates.  Dates of any class 
will be converted to the Date class for summarization purposes only.  Your original dataset will be unchanged.  This also means summarized dates will be accurate to the day only.
<br/><br/>
<b>Groups to Compare (optional):</b> Variable that defines the categories to compare
<br/><br/>
<b>Strata (optional):</b> Variable that defines the categories within which the comparisons will be made
<br/><br/>
<b>Table Title:</b> specify the table title
<br/><br/>
<b>Include total column:</b> whether or not a total column is included in the table
<br/><br/>
<b>Include group variable name:</b> whether or not to include the group variable name in the table
<br/><br/>
<b>Digits After Decimal:</b> specify how many digits to display after the decimal point for continuous values, percentages, and p-values
<br/><br/>
<b>Simplify Multi-Row Variable Summaries to One Row (if possible):</b> For two-category categorical (factor/ordinal) variables or single summaries of numeric or date variables, 
you can collapse the rows to have all variable names and statistics appear in a single row.  The summaries for the last category for each categorical variable will be shown. 
Any variable for which collapsing isn't possible will take up multiple rows.  Turning this option on/off can be done for each type of variable separately.
<br/><br/>
<b>Use Last Level in Label of Categorical Variables:</b> For simplified tables, this includes the last level of factor/ordinal variables in the row label.
<br/><br/>
<b>Confidence Level:</b> This sets the confidence level of the confidence intervals.
<br/><br/>
<b>Statistical Test Options</b>
<br/><br/>
<b>Statistical Tests:</b> Whether or not statistical tests comparing groups are desired and which tests to use.  All numerical variables (continuous values and dates) will use 
the test specified in the Numerical Tests section.  All nominal factors will use the test specified in the Categorical Nominal Tests section.  All ordinal factors will use the 
test specified in the Categorical Ordinal Tests section.  Pearson and Fisher Simulations provides the ability to obtain simulated p-values for Pearson's chi-square tests and 
Fisher's Exact tests.  This procedure creates Monte Carlo simulations the specified number of times (Number of Simulations).  This can be useful in cases where the standard 
computations, especially for Fisher's Exact test, result in computer memory errors.
<br/><br/>
<b>Test Names Footnote:</b> whether or not to include p-value footnotes listing the statistical tests done for each variable
<br/><br/>
<b>Numerical Statistics Options:</b>
<br/>statistics that will be shown for numerical variables
<br/><br/>
<b>Categorical Statistics Options:</b> 
<br/>
statistics that will be shown for both nominal and ordered factors
<br/><br/>
<b>Date Statistics:</b>
<br/>statistics that will be shown for date variables
<br/><br/>
<b>Note:</b> If you want to summarize a variable of a specific type, it is recommended that you select at least one statistic in that category that is not "Number Missing, if any".  If "Number Missing, if any" is the only option selected and no variables have a missing value, then an error will result. 
<br/><br/>
<b>Required R Packages:</b> arsenal, lubridate, dplyr, DescTools
			`}
    }
}









class TableBasic extends baseModal {
    constructor() {
        var config = {
            id: "TableBasic",
            label: localization.en.title,
			splitProcessing: true,
            modalType: "two",
            RCode: `
library(arsenal)
library(lubridate)
library(dplyr)

# defining custom statistic functions
trimmean_func <- function(x, weights=rep(1,length(x)),...) {
  meanest <- DescTools::MeanCI(x, trim={{selected.trimpct | safe}}/100, na.rm=TRUE, conf.level={{selected.conflevel | safe}})
  as.tbstat(meanest, sep=" ", parens=c("(", ")"), sep2=", ")
}

pct1_func <- function(x, weights=rep(1,length(x)),...) {
  quantest <- DescTools::QuantileCI(x, prob=.01, na.rm=TRUE, conf.level={{selected.conflevel | safe}})
  as.tbstat(quantest, sep=" ", parens=c("(", ")"), sep2=", ")
}

pct5_func <- function(x, weights=rep(1,length(x)),...) {
  quantest <- DescTools::QuantileCI(x, prob=.05, na.rm=TRUE, conf.level={{selected.conflevel | safe}})
  as.tbstat(quantest, sep=" ", parens=c("(", ")"), sep2=", ")
}

pct10_func <- function(x, weights=rep(1,length(x)),...) {
  quantest <- DescTools::QuantileCI(x, prob=.1, na.rm=TRUE, conf.level={{selected.conflevel | safe}})
  as.tbstat(quantest, sep=" ", parens=c("(", ")"), sep2=", ")
}

pct25_func <- function(x, weights=rep(1,length(x)),...) {
  quantest <- DescTools::QuantileCI(x, prob=.25, na.rm=TRUE, conf.level={{selected.conflevel | safe}})
  as.tbstat(quantest, sep=" ", parens=c("(", ")"), sep2=", ")
}

pct33_func <- function(x, weights=rep(1,length(x)),...) {
  quantest <- DescTools::QuantileCI(x, prob=1/3, na.rm=TRUE, conf.level={{selected.conflevel | safe}})
  as.tbstat(quantest, sep=" ", parens=c("(", ")"), sep2=", ")
}

pct50_func <- function(x, weights=rep(1,length(x)),...) {
  quantest <- DescTools::QuantileCI(x, prob=.5, na.rm=TRUE, conf.level={{selected.conflevel | safe}})
  as.tbstat(quantest, sep=" ", parens=c("(", ")"), sep2=", ")
}

pct66_func <- function(x, weights=rep(1,length(x)),...) {
  quantest <- DescTools::QuantileCI(x, prob=2/3, na.rm=TRUE, conf.level={{selected.conflevel | safe}})
  as.tbstat(quantest, sep=" ", parens=c("(", ")"), sep2=", ")
}

pct75_func <- function(x, weights=rep(1,length(x)),...) {
  quantest <- DescTools::QuantileCI(x, prob=.75, na.rm=TRUE, conf.level={{selected.conflevel | safe}})
  as.tbstat(quantest, sep=" ", parens=c("(", ")"), sep2=", ")
}

pct90_func <- function(x, weights=rep(1,length(x)),...) {
  quantest <- DescTools::QuantileCI(x, prob=.9, na.rm=TRUE, conf.level={{selected.conflevel | safe}})
  as.tbstat(quantest, sep=" ", parens=c("(", ")"), sep2=", ")
}

pct95_func <- function(x, weights=rep(1,length(x)),...) {
  quantest <- DescTools::QuantileCI(x, prob=.95, na.rm=TRUE, conf.level={{selected.conflevel | safe}})
  as.tbstat(quantest, sep=" ", parens=c("(", ")"), sep2=", ")
}

pct99_func <- function(x, weights=rep(1,length(x)),...) {
  quantest <- DescTools::QuantileCI(x, prob=.99, na.rm=TRUE, conf.level={{selected.conflevel | safe}})
  as.tbstat(quantest, sep=" ", parens=c("(", ")"), sep2=", ")
}

custquant_func <- function(x, weights=rep(1,length(x)),...) {
  quantest <- DescTools::QuantileCI(x, prob={{selected.custquantvalue | safe}}/100, na.rm=TRUE, conf.level={{selected.conflevel | safe}})
  as.tbstat(quantest, sep=" ", parens=c("(", ")"), sep2=", ")
}

cv_func <- function(x, weights=rep(1,length(x)),...) {
  sd(x, na.rm=TRUE)/mean(x, na.rm=TRUE)
}

skewness_func <- function(x, weights=rep(1,length(x)),...) {
	DescTools::Skew(x, na.rm=TRUE)
}

kurtosis_func <- function(x, weights=rep(1,length(x)),...) {
	DescTools::Kurt(x, na.rm=TRUE)
}

# changing all date variables to Date class for tableby
{{dataset.name}}.1 <- {{dataset.name}} %>%
	mutate_if(is.timepoint,as.Date)

tab1 <- tableby({{selected.bygroupvar | safe}} ~ {{selected.sumvars | safe}}, data={{dataset.name}}.1, test={{selected.stattestschkbox | safe}}, total={{selected.totalcolchkbox | safe}}, {{selected.stratavar | safe}} 
	numeric.stats=c({{selected.numstatslist | safe}}),
	cat.stats=c({{selected.catstatslist | safe}}),
	ordered.stats=c({{selected.catstatslist | safe}}),
	date.stats=c({{selected.datestatslist | safe}}),
	numeric.test="{{selected.numtestgrp | safe}}", cat.test="{{selected.cattestgrp | safe}}", ordered.test="{{selected.ordtestgrp | safe}}", 
	chisq.correct=FALSE, digits={{selected.contdigits | safe}}, digits.pct={{selected.pctdigits | safe}}, digits.p={{selected.pvaluedigits | safe}}, simulate.p.value={{selected.simchkbox | safe}}, B={{selected.simnum | safe}}, 
	conf.level={{selected.conflevel | safe}}, numeric.simplify={{selected.numericsimplifychkbox | safe}}, cat.simplify={{if (options.selected.categorysimplifychkbox=="FALSE")}}FALSE{{#else}}{{if (options.selected.labelsimplifychkbox=="TRUE")}}"label"{{#else}}TRUE{{/if}}{{/if}}, ordered.simplify={{selected.categorysimplifychkbox | safe}}, 
	date.simplify={{selected.datesimplifychkbox | safe}})

tab1.final <- as.data.frame(summary(tab1, text=TRUE, {{selected.groupvarchkbox | safe}} pfootnote={{selected.footnotechkbox | safe}},
	stats.labels=list(trimmean_func="{{selected.trimpct |safe}}% Trimmed Mean (CI)", pct1_func="1st %-ile (CI)", pct5_func="5th %-ile (CI)", 
	pct10_func="10th %-ile (CI)", pct25_func="25th %-ile (CI)", pct33_func="1st Tertile (CI)", pct50_func="Median (CI)", pct66_func="2nd Tertile (CI)", 
	pct75_func="75th %-ile (CI)", pct90_func="90th %-ile (CI)", pct95_func="95th %-ile (CI)", pct99_func="99th %-ile (CI)", custquant_func="{{selected.custquantvalue | safe}} %-ile (CI)", 
	cv_func="CV", skewness_func="Skewness", kurtosis_func="Kurtosis")))

{{if ((options.selected.stattestschkbox=="TRUE") & (options.selected.footnotechkbox=="TRUE"))}}
# if want statistical test footnotes
pval.tests <- unique(tests(tab1)$Method)
pval.foot <- paste(paste0("(", 1:length(pval.tests), ")"), pval.tests, collapse="\n")
BSkyFormat(tab1.final, perTableFooter=pval.foot, decimalDigitsRounding=-1, singleTableOutputHeader="{{selected.tabletitle | safe}} ")
{{#else}}
BSkyFormat(tab1.final, decimalDigitsRounding=-1, singleTableOutputHeader="{{selected.tabletitle | safe}} ")
{{/if}}
`
        };
        var objects = {
            content_var: { el: new srcVariableList(config, {action: "move"}) },
			sumvars: {
				el: new dstVariableList(config,{
				label: localization.en.sumvarslabel,
				no: "sumvars",
				required: true,
				filter:"Numeric|Date|Ordinal|Nominal|Scale",
				extraction: "NoPrefix|UsePlus",
				})
			},			
			bygroupvar: {
				el: new dstVariable(config, {
				label: localization.en.bygroupvarlabel,
				no: "bygroupvar",
				filter: "String|Numeric|Ordinal|Nominal|Scale",
				extraction: "NoPrefix|UseComma",
				required: false,
				})
			},
			stratavar: {
				el: new dstVariable(config, {
				label: localization.en.stratavarlabel,
				no: "stratavar",
				filter: "String|Numeric|Ordinal|Nominal|Scale",
				extraction: "NoPrefix|UseComma",
				wrapped: "strata=%val%, ",
				required: false,
				})
			},
			tabletitle: {
				el: new input(config, {
				no: 'tabletitle',
				label: localization.en.tabletitlelabel,
				style: "mt-3 mb-3",
				placeholder: "Variable Summaries",
				value: "Variable Summaries",
				extraction: "TextAsIs",
				type: "character",
				allow_spaces: true,
				width:"w-100",
				})
			},
			totalcolchkbox: {
				el: new checkbox(config, {
				label: localization.en.totalcolchkboxlabel,
				no: "totalcolchkbox",
				extraction: "Boolean"
				})
			},
			groupvarchkbox: {
				el: new checkbox(config, {
				label: localization.en.groupvarchkboxlabel,
				no: "groupvarchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "term.name=TRUE,",
				false_value: " ",
				})
			},
			digitslabel: {
				el: new labelVar(config, {
				label: localization.en.digitslabel, 
				style: "mt-4", 
				h:5
				})
			},
			contdigits: {
				el: new inputSpinner(config, {
				no: 'contdigits',
				label: localization.en.contdigitslabel,
				style: "ml-3",
				min: 0,
				max: 1000,
				step: 1,
				value: 3,
				extraction: "NoPrefix|UseComma"
				})
			},
			pctdigits: {
				el: new inputSpinner(config, {
				no: 'pctdigits',
				label: localization.en.pctdigitslabel,
				style: "ml-3",
				min: 1,
				max: 1000,
				step: 1,
				value: 1,
				extraction: "NoPrefix|UseComma"
				})
			},
			pvaluedigits: {
				el: new inputSpinner(config, {
				no: 'pvaluedigits',
				label: localization.en.pvaluedigitslabel,
				style: "ml-3",
				min: 1,
				max: 1000,
				step: 1,
				value: 3,
				extraction: "NoPrefix|UseComma"
				})
			},
			simplifylabel: {
				el: new labelVar(config, {
				label: localization.en.simplifylabel, 
				style: "mt-4", 
				h:5
				})
			},
			numericsimplifychkbox: {
				el: new checkbox(config, {
				label: localization.en.numericsimplifylabel,
				style: "ml-3",
				no: "numericsimplifychkbox",
				extraction: "Boolean"
				})
			},
			categorysimplifychkbox: {
				el: new checkbox(config, {
				label: localization.en.categorysimplifylabel,
				no: "categorysimplifychkbox",
				extraction: "Boolean"
				})
			},
			datesimplifychkbox: {
				el: new checkbox(config, {
				label: localization.en.datesimplifylabel,
				no: "datesimplifychkbox",
				extraction: "Boolean"
				})
			},
			labelsimplifychkbox: {
				el: new checkbox(config, {
				label: localization.en.labelsimplifylabel,
				no: "labelsimplifychkbox",
				newline: true,
				style: "ml-3",
				extraction: "Boolean"
				})
			},			
			conflevel: {
				el: new inputSpinner(config, {
				no: 'conflevel',
				label: localization.en.conflevellabel,
				style: "mt-4 mb-4",
				min: 0,
				max: 1,
				step: .001,
				value: 0.95,
				extraction: "NoPrefix|UseComma"
				})
			},
			stattestschkbox: {
				el: new checkbox(config, {
				label: localization.en.stattestschkboxlabel,
				no: "stattestschkbox",
				style: "mb-2",
				extraction: "Boolean"
				})
			},
			numtestlabel: {
				el: new labelVar(config, {
				label: localization.en.numtestlabel,
				style: "ml-5 mt-3",
				h:5
				})
			},
			numanovaopt: {
				el: new radioButton(config, {
				  label: localization.en.anovaoptlabel,
				  style: "ml-5",
				  no: "numtestgrp",
				  increment: "anova",
				  value: "anova",
				  state: "checked",
				  extraction: "ValueAsIs"
				})
			},			  
			numkwopt: {
				el: new radioButton(config, {
				  label: localization.en.kwoptlabel,
				  style: "ml-5",
				  no: "numtestgrp",
				  increment: "kwt",
				  value: "kwt",
				  state: "",
				  extraction: "ValueAsIs"
				})
			},
			nummedopt: {
				el: new radioButton(config, {
				  label: localization.en.medoptlabel,
				  style: "ml-5",
				  no: "numtestgrp",
				  increment: "medtest",
				  value: "medtest",
				  state: "",
				  extraction: "ValueAsIs"
				})
			},
			cattestlabel: {
				el: new labelVar(config, {
				label: localization.en.cattestlabel,
				style: "ml-5 mt-3",
				h:5
				})
			},
			catchisqopt: {
				el: new radioButton(config, {
				  label: localization.en.chisqoptlabel,
				  style: "ml-5",
				  no: "cattestgrp",
				  increment: "chisq",
				  value: "chisq",
				  state: "checked",
				  extraction: "ValueAsIs"
				})
			},			  
			catfisheropt: {
				el: new radioButton(config, {
				  label: localization.en.fisheroptlabel,
				  style: "ml-5",
				  no: "cattestgrp",
				  increment: "fe",
				  value: "fe",
				  state: "",
				  extraction: "ValueAsIs"
				})
			},
			simchkbox: {
				el: new checkbox(config, {
				label: localization.en.simchkboxlabel,
				no: "simchkbox",
				style: "mt-2 ml-5",
				extraction: "Boolean"
				})
			},
			simnum: {
				el: new inputSpinner(config, {
				no: 'simnum',
				label: localization.en.simnumlabel,
				style: "mt-2 ml-5",
				min: 100,
				max: 1000000,
				step: 100,
				value: 2000,
				extraction: "NoPrefix|UseComma"
				})
			},
			ordtestlabel: {
				el: new labelVar(config, {
				label: localization.en.ordtestlabel,
				style: "ml-5 mt-3",
				h:5
				})
			},
			ordtrendopt: {
				el: new radioButton(config, {
				  label: localization.en.trendoptlabel,
				  style: "ml-5",
				  no: "ordtestgrp",
				  increment: "trend",
				  value: "trend",
				  state: "checked",
				  extraction: "ValueAsIs"
				})
			},			  
			ordkwopt: {
				el: new radioButton(config, {
				  label: localization.en.kwoptlabel,
				  style: "ml-5",
				  no: "ordtestgrp",
				  increment: "kwt",
				  value: "kwt",
				  state: "",
				  extraction: "ValueAsIs"
				})
			},
			footnotechkbox: {
				el: new checkbox(config, {
				label: localization.en.footnotechkboxlabel,
				no: "footnotechkbox",
				style: "mt-4",
				extraction: "Boolean"
				})
			},
			sampsizelabel: {
				el: new labelVar(config, {
				label: localization.en.sampsizelabel,
				h:5
				})
			},
			numnchkbox: {
				el: new checkbox(config, {
				label: localization.en.sampsizelabel,
				no: "numnchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'N'",
				false_value: ""
				})
			},				
			numnmisschkbox: {
				el: new checkbox(config, {
				label: localization.en.nmissanylabel,
				no: "numnmisschkbox",
				bs_type: "valuebox",
				state: "checked",
				extraction: "TextAsIs",
				true_value: "'Nmiss'",
				false_value: ""
				})
			},
			numnmiss2chkbox: {
				el: new checkbox(config, {
				label: localization.en.nmissalwayslabel,
				no: "numnmiss2chkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'Nmiss2'",
				false_value: ""
				})
			},						
			meanlabel: {
				el: new labelVar(config, {
				label: localization.en.meanlabel,
				style: "mt-3",
				h:5
				})
			},
			nummeanchkbox: {
				el: new checkbox(config, {
				label: localization.en.meanlabel,
				no: "nummeanchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'mean'",
				false_value: ""
				})
			},
			nummeansdchkbox: {
				el: new checkbox(config, {
				label: localization.en.meansdlabel,
				no: "nummeansdchkbox",
				state: "checked",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'meansd'",
				false_value: ""
				})
			},
			nummeancichkbox: {
				el: new checkbox(config, {
				label: localization.en.meancilabel,
				no: "nummeancichkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'meanCI'",
				false_value: ""
				})
			},
			nummeansechkbox: {
				el: new checkbox(config, {
				label: localization.en.meanselabel,
				no: "nummeansechkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'meanse'",
				false_value: ""
				})
			},
			numgmeanchkbox: {
				el: new checkbox(config, {
				label: localization.en.gmeanlabel,
				no: "numgmeanchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'gmean'",
				false_value: ""
				})
			},			
			numgmeansdchkbox: {
				el: new checkbox(config, {
				label: localization.en.gmeansdlabel,
				no: "numgmeansdchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'gmeansd'",
				false_value: ""
				})
			},			
			numgmeancichkbox: {
				el: new checkbox(config, {
				label: localization.en.gmeancilabel,
				no: "numgmeancichkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'gmeanCI'",
				false_value: ""
				})
			},
			numtrimmeancichkbox: {
				el: new checkbox(config, {
				label: localization.en.trimmeancilabel,
				no: "numtrimmeancichkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'trimmean_func'",
				false_value: ""
				})
			},
			trimpct: {
				el: new input(config, {
				no: 'trimpct',
				label: localization.en.trimpctlabel,
				value: "5",
				extraction: "TextAsIs",
				allow_spaces: true,
				type: "numeric",
				ml: 4,
				width:"w-25",
				})
			},			
			quantileslabel: {
				el: new labelVar(config, {
				label: localization.en.quantileslabel,
				style: "mt-3",
				h:5
				})
			},
			nummedianchkbox: {
				el: new checkbox(config, {
				label: localization.en.medianlabel,
				no: "nummedianchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'median'",
				false_value: ""
				})
			},				
			nummedianq1q3chkbox: {
				el: new checkbox(config, {
				label: localization.en.medianq1q3label,
				no: "nummedianq1q3chkbox",
				bs_type: "valuebox",
				state: "checked",
				extraction: "TextAsIs",
				true_value: "'medianq1q3'",
				false_value: ""
				})
			},			
			numq1q3chkbox: {
				el: new checkbox(config, {
				label: localization.en.q1q3label,
				no: "numq1q3chkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'q1q3'",
				false_value: ""
				})
			},			
			numiqrchkbox: {
				el: new checkbox(config, {
				label: localization.en.iqrlabel,
				no: "numiqrchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'iqr'",
				false_value: ""
				})
			},
			nummedianrangechkbox: {
				el: new checkbox(config, {
				label: localization.en.medianrangelabel,
				no: "nummedianrangechkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'medianrange'",
				false_value: ""
				})
			},
			nummedianmadchkbox: {
				el: new checkbox(config, {
				label: localization.en.medianmadlabel,
				no: "nummedianmadchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'medianmad'",
				false_value: ""
				})
			},			
			numrangechkbox: {
				el: new checkbox(config, {
				label: localization.en.rangelabel,
				no: "numrangechkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'range'",
				false_value: ""
				})
			},			
			numminchkbox: {
				el: new checkbox(config, {
				label: localization.en.minlabel,
				no: "numminchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'min'",
				false_value: ""
				})
			},			
			nummaxchkbox: {
				el: new checkbox(config, {
				label: localization.en.maxlabel,
				no: "nummaxchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'max'",
				false_value: ""
				})
			},
			numpct1chkbox: {
				el: new checkbox(config, {
				label: localization.en.pct1label,
				no: "numpct1chkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'pct1_func'",
				false_value: ""
				})
			},
			numpct5chkbox: {
				el: new checkbox(config, {
				label: localization.en.pct5label,
				no: "numpct5chkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'pct5_func'",
				false_value: ""
				})
			},
			numpct10chkbox: {
				el: new checkbox(config, {
				label: localization.en.pct10label,
				no: "numpct10chkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'pct10_func'",
				false_value: ""
				})
			},
			numpct25chkbox: {
				el: new checkbox(config, {
				label: localization.en.pct25label,
				no: "numpct25chkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'pct25_func'",
				false_value: ""
				})
			},			
			numpct33chkbox: {
				el: new checkbox(config, {
				label: localization.en.pct33label,
				no: "numpct33chkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'pct33_func'",
				false_value: ""
				})
			},
			numpct50chkbox: {
				el: new checkbox(config, {
				label: localization.en.pct50label,
				no: "numpct50chkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'pct50_func'",
				false_value: ""
				})
			},			
			numpct66chkbox: {
				el: new checkbox(config, {
				label: localization.en.pct66label,
				no: "numpct66chkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'pct66_func'",
				false_value: ""
				})
			},
			numpct75chkbox: {
				el: new checkbox(config, {
				label: localization.en.pct75label,
				no: "numpct75chkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'pct75_func'",
				false_value: ""
				})
			},
			numpct90chkbox: {
				el: new checkbox(config, {
				label: localization.en.pct90label,
				no: "numpct90chkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'pct90_func'",
				false_value: ""
				})
			},
			numpct95chkbox: {
				el: new checkbox(config, {
				label: localization.en.pct95label,
				no: "numpct95chkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'pct95_func'",
				false_value: ""
				})
			},
			numpct99chkbox: {
				el: new checkbox(config, {
				label: localization.en.pct99label,
				no: "numpct99chkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'pct99_func'",
				false_value: ""
				})
			},
			numcustquantchkbox: {
				el: new checkbox(config, {
				label: localization.en.custquantlabel,
				no: "numcustquantchkbox",
				newline: true,
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'custquant_func'",
				false_value: ""
				})
			},
			custquantvalue: {
				el: new input(config, {
				no: 'custquantvalue',
				label: localization.en.custquantvaluelabel,
				value: "20",
				extraction: "TextAsIs",
				allow_spaces: true,
				type: "numeric",
				ml: 4,
				width:"w-25",
				})
			},			
			numskewnesschkbox: {
				el: new checkbox(config, {
				label: localization.en.skewnesslabel,
				no: "numskewnesschkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'skewness_func'",
				false_value: ""
				})
			},
			numkurtosischkbox: {
				el: new checkbox(config, {
				label: localization.en.kurtosislabel,
				no: "numkurtosischkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'kurtosis_func'",
				false_value: ""
				})
			},			
			otherlabel: {
				el: new labelVar(config, {
				label: localization.en.otherlabel,
				style: "mt-3",
				h:5
				})
			},
			numsumchkbox: {
				el: new checkbox(config, {
				label: localization.en.sumlabel,
				no: "numsumchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'sum'",
				false_value: ""
				})
			},
			numsdchkbox: {
				el: new checkbox(config, {
				label: localization.en.sdlabel,
				no: "numsdchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'sd'",
				false_value: ""
				})
			},
			numvarchkbox: {
				el: new checkbox(config, {
				label: localization.en.varlabel,
				no: "numvarchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'var'",
				false_value: ""
				})
			},
			numgsdchkbox: {
				el: new checkbox(config, {
				label: localization.en.gsdlabel,
				no: "numgsdchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'gsd'",
				false_value: ""
				})
			},
			numcvchkbox: {
				el: new checkbox(config, {
				label: localization.en.cvlabel,
				no: "numcvchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'cv_func'",
				false_value: ""
				})
			},			
			catnchkbox: {
				el: new checkbox(config, {
				label: localization.en.sampsizelabel,
				no: "catnchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'N'",
				false_value: ""
				})
			},				
			catnmisschkbox: {
				el: new checkbox(config, {
				label: localization.en.nmissanylabel,
				no: "catnmisschkbox",
				bs_type: "valuebox",
				state: "checked",
				extraction: "TextAsIs",
				true_value: "'Nmiss'",
				false_value: ""
				})
			},
			catnmiss2chkbox: {
				el: new checkbox(config, {
				label: localization.en.nmissalwayslabel,
				no: "catnmiss2chkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'Nmiss2'",
				false_value: ""
				})
			},			
			freqlabel: {
				el: new labelVar(config, {
				label: localization.en.freqlabel,
				style: "mt-3",
				h:5
				})
			},
			catfreqchkbox: {
				el: new checkbox(config, {
				label: localization.en.freqlabel,
				no: "catfreqchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'count'",
				false_value: ""
				})
			},
			catfreqtotalchkbox: {
				el: new checkbox(config, {
				label: localization.en.freqtotallabel,
				no: "catfreqtotalchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'countN'",
				false_value: ""
				})
			},
			catfreqpctchkbox: {
				el: new checkbox(config, {
				label: localization.en.freqpctlabel,
				no: "catfreqpctchkbox",
				bs_type: "valuebox",
				state: "checked",
				extraction: "TextAsIs",
				true_value: "'countpct'",
				false_value: ""
				})
			},
			catpropcichkbox: {
				el: new checkbox(config, {
				label: localization.en.propcilabel,
				no: "catpropcichkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'binomCI'",
				false_value: ""
				})
			},
			datenchkbox: {
				el: new checkbox(config, {
				label: localization.en.sampsizelabel,
				no: "datenchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'N'",
				false_value: ""
				})
			},				
			datenmisschkbox: {
				el: new checkbox(config, {
				label: localization.en.nmissanylabel,
				no: "datenmisschkbox",
				bs_type: "valuebox",
				state: "checked",
				extraction: "TextAsIs",
				true_value: "'Nmiss'",
				false_value: ""
				})
			},
			datenmiss2chkbox: {
				el: new checkbox(config, {
				label: localization.en.nmissalwayslabel,
				no: "datenmiss2chkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'Nmiss2'",
				false_value: ""
				})
			},
			datemeanchkbox: {
				el: new checkbox(config, {
				label: localization.en.meanlabel,
				no: "datemeanchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'mean'",
				false_value: ""
				})
			},
			datemeansdchkbox: {
				el: new checkbox(config, {
				label: localization.en.meansdlabel,
				no: "datemeansdchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'meansd'",
				false_value: ""
				})
			},
			datemeansechkbox: {
				el: new checkbox(config, {
				label: localization.en.meanselabel,
				no: "datemeansechkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'meanse'",
				false_value: ""
				})
			},			
			datemeancichkbox: {
				el: new checkbox(config, {
				label: localization.en.meancilabel,
				no: "datemeancichkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'meanCI'",
				false_value: ""
				})
			},
			datemedianchkbox: {
				el: new checkbox(config, {
				label: localization.en.medianlabel,
				no: "datemedianchkbox",
				bs_type: "valuebox",
				state: "checked",
				extraction: "TextAsIs",
				true_value: "'median'",
				false_value: ""
				})
			},				
			datemedianq1q3chkbox: {
				el: new checkbox(config, {
				label: localization.en.medianq1q3label,
				no: "datemedianq1q3chkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'medianq1q3'",
				false_value: ""
				})
			},			
			dateq1q3chkbox: {
				el: new checkbox(config, {
				label: localization.en.q1q3label,
				no: "dateq1q3chkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'q1q3'",
				false_value: ""
				})
			},			
			dateiqrchkbox: {
				el: new checkbox(config, {
				label: localization.en.iqrlabel,
				no: "dateiqrchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'iqr'",
				false_value: ""
				})
			},
			datemedianrangechkbox: {
				el: new checkbox(config, {
				label: localization.en.medianrangelabel,
				no: "datemedianrangechkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'medianrange'",
				false_value: ""
				})
			},
			daterangechkbox: {
				el: new checkbox(config, {
				label: localization.en.rangelabel,
				no: "daterangechkbox",
				bs_type: "valuebox",
				state: "checked",
				extraction: "TextAsIs",
				true_value: "'range'",
				false_value: ""
				})
			},
			dateminchkbox: {
				el: new checkbox(config, {
				label: localization.en.minlabel,
				no: "dateminchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'min'",
				false_value: ""
				})
			},
			datemaxchkbox: {
				el: new checkbox(config, {
				label: localization.en.maxlabel,
				no: "datemaxchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'max'",
				false_value: ""
				})
			},
			datesdchkbox: {
				el: new checkbox(config, {
				label: localization.en.sdlabel,
				no: "datesdchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'sd'",
				false_value: ""
				})
			},
			datevarchkbox: {
				el: new checkbox(config, {
				label: localization.en.varlabel,
				no: "datevarchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'var'",
				false_value: ""
				})
			}
		}
		
		var stattestspanel = {
            el: new optionsVar(config, {
                no: "stattestspanel",
                name: "Statistical Test Options",
                content: [
                    objects.stattestschkbox.el, 
					objects.numtestlabel.el, objects.numanovaopt.el, objects.numkwopt.el, objects.nummedopt.el,
					objects.cattestlabel.el, objects.catchisqopt.el, objects.catfisheropt.el, objects.simchkbox.el, objects.simnum.el,
					objects.ordtestlabel.el, objects.ordtrendopt.el, objects.ordkwopt.el,
					objects.footnotechkbox.el
					]
				})
		}

		var numstatspanel = {
            el: new optionsVar(config, {
                no: "numstatspanel",
                name: "Numerical Statistics Options",
                content: [objects.sampsizelabel.el, objects.numnchkbox.el, objects.numnmisschkbox.el, objects.numnmiss2chkbox.el, 
					objects.meanlabel.el, objects.nummeanchkbox.el, objects.nummeansdchkbox.el, objects.nummeancichkbox.el, objects.nummeansechkbox.el, objects.numgmeanchkbox.el, objects.numgmeansdchkbox.el, objects.numgmeancichkbox.el, objects.numtrimmeancichkbox.el, objects.trimpct.el,
					objects.quantileslabel.el, objects.nummedianchkbox.el, objects.nummedianq1q3chkbox.el, objects.numq1q3chkbox.el, objects.numiqrchkbox.el, objects.nummedianrangechkbox.el, objects.nummedianmadchkbox.el, objects.numrangechkbox.el, objects.numminchkbox.el, 
						objects.numpct1chkbox.el, objects.numpct5chkbox.el, objects.numpct10chkbox.el, objects.numpct25chkbox.el, objects.numpct33chkbox.el, objects.numpct50chkbox.el, objects.numpct66chkbox.el, objects.numpct75chkbox.el, objects.numpct90chkbox.el,
						objects.numpct95chkbox.el, objects.numpct99chkbox.el, objects.nummaxchkbox.el, objects.numcustquantchkbox.el, objects.custquantvalue.el,
					objects.otherlabel.el, objects.numsumchkbox.el, objects.numsdchkbox.el, objects.numvarchkbox.el, objects.numgsdchkbox.el, objects.numcvchkbox.el, objects.numskewnesschkbox.el, objects.numkurtosischkbox.el                   
					]
				})
		}

		var catstatspanel = {
            el: new optionsVar(config, {
                no: "catstatspanel",
                name: "Categorical Statistics Options",
                content: [objects.sampsizelabel.el, objects.catnchkbox.el, objects.catnmisschkbox.el, objects.catnmiss2chkbox.el,
					objects.freqlabel.el, objects.catfreqchkbox.el, objects.catfreqtotalchkbox.el, objects.catfreqpctchkbox.el, objects.catpropcichkbox.el                  
					]
				})
		}

		var datestatspanel = {
            el: new optionsVar(config, {
                no: "datestatspanel",
                name: "Date Statistics Options",
                content: [objects.sampsizelabel.el, objects.datenchkbox.el, objects.datenmisschkbox.el, objects.datenmiss2chkbox.el,
					objects.meanlabel.el, objects.datemeanchkbox.el, objects.datemeansdchkbox.el, objects.datemeancichkbox.el, objects.datemeansechkbox.el,
					objects.quantileslabel.el, objects.datemedianchkbox.el, objects.datemedianq1q3chkbox.el, objects.dateq1q3chkbox.el, objects.dateiqrchkbox.el, objects.datemedianrangechkbox.el, 
						objects.daterangechkbox.el, objects.dateminchkbox.el, objects.datemaxchkbox.el,
					objects.otherlabel.el, objects.datesdchkbox.el, objects.datevarchkbox.el
					]
				})
		};			
        
        const content = {
            left: [objects.content_var.el.content],
            right: [objects.sumvars.el.content, objects.bygroupvar.el.content, objects.stratavar.el.content, objects.tabletitle.el.content, objects.totalcolchkbox.el.content,
					objects.groupvarchkbox.el.content, objects.digitslabel.el.content, objects.contdigits.el.content, objects.pctdigits.el.content, objects.pvaluedigits.el.content,
					objects.simplifylabel.el.content, objects.numericsimplifychkbox.el.content, objects.categorysimplifychkbox.el.content, 
					objects.datesimplifychkbox.el.content, objects.labelsimplifychkbox.el.content, objects.conflevel.el.content],
			bottom: [stattestspanel.el.content, numstatspanel.el.content, catstatspanel.el.content, datestatspanel.el.content],
            nav: {
                name: localization.en.navigation,
                icon: "icon-table_basic",
                modal: config.id
            }
        };
        super(config, objects, content);
        this.help = localization.en.help;
    }	


	prepareExecution(instance) {
		//following lines will be there
		var res = [];
		var code_vars = {
            dataset: {
                name: $(`#${instance.config.id}`).attr('dataset') ? $(`#${instance.config.id}`).attr('dataset') : getActiveDataset()
            },
            selected: instance.dialog.extractData()
        }
		
		//create several formats
		let numarray=[code_vars.selected.numnchkbox, code_vars.selected.numnmisschkbox, code_vars.selected.numnmiss2chkbox, code_vars.selected.nummeanchkbox, 
					code_vars.selected.nummeansdchkbox, code_vars.selected.nummeancichkbox, code_vars.selected.nummeansechkbox, code_vars.selected.numgmeanchkbox, 
					code_vars.selected.numgmeansdchkbox, code_vars.selected.numgmeancichkbox, code_vars.selected.numtrimmeancichkbox, code_vars.selected.nummedianchkbox, code_vars.selected.nummedianq1q3chkbox,
					code_vars.selected.numq1q3chkbox, code_vars.selected.numiqrchkbox, code_vars.selected.nummedianrangechkbox, code_vars.selected.nummedianmadchkbox, code_vars.selected.numrangechkbox,
					code_vars.selected.numminchkbox, code_vars.selected.numpct1chkbox, code_vars.selected.numpct5chkbox, code_vars.selected.numpct10chkbox, code_vars.selected.numpct25chkbox,
					code_vars.selected.numpct33chkbox, code_vars.selected.numpct50chkbox, code_vars.selected.numpct66chkbox, code_vars.selected.numpct75chkbox, code_vars.selected.numpct90chkbox, code_vars.selected.numpct95chkbox,
					code_vars.selected.numpct99chkbox, code_vars.selected.nummaxchkbox, code_vars.selected.numcustquantchkbox, code_vars.selected.numsumchkbox, code_vars.selected.numsdchkbox,
					code_vars.selected.numvarchkbox, code_vars.selected.numgsdchkbox, code_vars.selected.numcvchkbox, code_vars.selected.numskewnesschkbox, code_vars.selected.numkurtosischkbox]
					
		numarray=numarray.filter(elem => Boolean(elem))
		let numstatsstring=numarray.join(',')

		let catarray=[code_vars.selected.catnchkbox, code_vars.selected.catnmisschkbox, code_vars.selected.catnmiss2chkbox, code_vars.selected.catfreqchkbox,
					code_vars.selected.catfreqtotalchkbox, code_vars.selected.catfreqpctchkbox, code_vars.selected.catpropcichkbox]
		catarray=catarray.filter(elem => Boolean(elem))
		let catstatsstring=catarray.join(',')

		let datearray=[code_vars.selected.datenchkbox, code_vars.selected.datenmisschkbox, code_vars.selected.datenmiss2chkbox, code_vars.selected.datemeanchkbox,
					code_vars.selected.datemeansdchkbox, code_vars.selected.datemeancichkbox, code_vars.selected.datemeansechkbox, code_vars.selected.datemedianchkbox,
					code_vars.selected.datemedianq1q3chkbox, code_vars.selected.dateq1q3chkbox, code_vars.selected.dateiqrchkbox, code_vars.selected.datemedianrangechkbox,
					code_vars.selected.daterangechkbox, code_vars.selected.dateminchkbox, code_vars.selected.datemaxchkbox, code_vars.selected.datesdchkbox, 
					code_vars.selected.datevarchkbox]
		datearray=datearray.filter(elem => Boolean(elem))
		let datestatsstring=datearray.join(',')			


	
		//create new variables under code_vars
		code_vars.selected.numstatslist = numstatsstring
		code_vars.selected.catstatslist = catstatsstring
		code_vars.selected.datestatslist = datestatsstring
		
		
		//final piece of code
            const cmd = instance.dialog.renderR(code_vars);
            res.push({ cmd: cmd, cgid: newCommandGroup() })
            return res;		
	}	


	
}
module.exports.item = new TableBasic().render()