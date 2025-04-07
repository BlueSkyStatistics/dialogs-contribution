










class TableAdvanced extends baseModal {
    static dialogId = 'TableAdvanced'
    static t = baseModal.makeT(TableAdvanced.dialogId)

    constructor() {
        var config = {
            id: TableAdvanced.dialogId,
            label: TableAdvanced.t('title'),
			splitProcessing: true,
            modalType: "two",
            RCode: `
library(arsenal)
library(lubridate)
library(dplyr)

# defining custom statistic functions
trimmean_func <<- function(x, weights=rep(1,length(x)),...) {
  meanest <- DescTools::MeanCI(x, trim={{selected.trimpct | safe}}/100, na.rm=TRUE, conf.level={{selected.conflevel | safe}})
  as.tbstat(meanest, sep=" ", parens=c("(", ")"), sep2=", ")
}

pct1_func <<- function(x, weights=rep(1,length(x)),...) {
  quantest <- DescTools::QuantileCI(x, prob=.01, na.rm=TRUE, conf.level={{selected.conflevel | safe}})
  as.tbstat(quantest, sep=" ", parens=c("(", ")"), sep2=", ")
}

pct5_func <<- function(x, weights=rep(1,length(x)),...) {
  quantest <- DescTools::QuantileCI(x, prob=.05, na.rm=TRUE, conf.level={{selected.conflevel | safe}})
  as.tbstat(quantest, sep=" ", parens=c("(", ")"), sep2=", ")
}

pct10_func <<- function(x, weights=rep(1,length(x)),...) {
  quantest <- DescTools::QuantileCI(x, prob=.1, na.rm=TRUE, conf.level={{selected.conflevel | safe}})
  as.tbstat(quantest, sep=" ", parens=c("(", ")"), sep2=", ")
}

pct25_func <<- function(x, weights=rep(1,length(x)),...) {
  quantest <- DescTools::QuantileCI(x, prob=.25, na.rm=TRUE, conf.level={{selected.conflevel | safe}})
  as.tbstat(quantest, sep=" ", parens=c("(", ")"), sep2=", ")
}

pct33_func <<- function(x, weights=rep(1,length(x)),...) {
  quantest <- DescTools::QuantileCI(x, prob=1/3, na.rm=TRUE, conf.level={{selected.conflevel | safe}})
  as.tbstat(quantest, sep=" ", parens=c("(", ")"), sep2=", ")
}

pct50_func <<- function(x, weights=rep(1,length(x)),...) {
  quantest <- DescTools::QuantileCI(x, prob=.5, na.rm=TRUE, conf.level={{selected.conflevel | safe}})
  as.tbstat(quantest, sep=" ", parens=c("(", ")"), sep2=", ")
}

pct66_func <<- function(x, weights=rep(1,length(x)),...) {
  quantest <- DescTools::QuantileCI(x, prob=2/3, na.rm=TRUE, conf.level={{selected.conflevel | safe}})
  as.tbstat(quantest, sep=" ", parens=c("(", ")"), sep2=", ")
}

pct75_func <<- function(x, weights=rep(1,length(x)),...) {
  quantest <- DescTools::QuantileCI(x, prob=.75, na.rm=TRUE, conf.level={{selected.conflevel | safe}})
  as.tbstat(quantest, sep=" ", parens=c("(", ")"), sep2=", ")
}

pct90_func <<- function(x, weights=rep(1,length(x)),...) {
  quantest <- DescTools::QuantileCI(x, prob=.9, na.rm=TRUE, conf.level={{selected.conflevel | safe}})
  as.tbstat(quantest, sep=" ", parens=c("(", ")"), sep2=", ")
}

pct95_func <<- function(x, weights=rep(1,length(x)),...) {
  quantest <- DescTools::QuantileCI(x, prob=.95, na.rm=TRUE, conf.level={{selected.conflevel | safe}})
  as.tbstat(quantest, sep=" ", parens=c("(", ")"), sep2=", ")
}

pct99_func <<- function(x, weights=rep(1,length(x)),...) {
  quantest <- DescTools::QuantileCI(x, prob=.99, na.rm=TRUE, conf.level={{selected.conflevel | safe}})
  as.tbstat(quantest, sep=" ", parens=c("(", ")"), sep2=", ")
}

custquant_func <<- function(x, weights=rep(1,length(x)),...) {
  quantest <- DescTools::QuantileCI(x, prob={{selected.custquantvalue | safe}}/100, na.rm=TRUE, conf.level={{selected.conflevel | safe}})
  as.tbstat(quantest, sep=" ", parens=c("(", ")"), sep2=", ")
}

cv_func <<- function(x, weights=rep(1,length(x)),...) {
  sd(x, na.rm=TRUE)/mean(x, na.rm=TRUE)
}

skewness_func <<- function(x, weights=rep(1,length(x)),...) {
	DescTools::Skew(x, na.rm=TRUE)
}

kurtosis_func <<- function(x, weights=rep(1,length(x)),...) {
	DescTools::Kurt(x, na.rm=TRUE)
}

# changing all date variables to Date class for tableby
{{dataset.name}}.1 <- {{dataset.name}} %>%
	mutate_if(is.timepoint,as.Date)

tab1 <- tableby({{selected.bygroupvar | safe}} ~ {{selected.alltestslist | safe}}, data={{dataset.name}}.1, total={{selected.totalcolchkbox | safe}}, {{selected.stratavar | safe}} 
	numeric.stats=c({{selected.numstatslist | safe}}),
	cat.stats=c({{selected.catstatslist | safe}}),
	ordered.stats=c({{selected.catstatslist | safe}}),
	date.stats=c({{selected.datestatslist | safe}}),
	chisq.correct=FALSE, digits={{selected.contdigits | safe}}, digits.pct={{selected.pctdigits | safe}}, digits.p={{selected.pvaluedigits | safe}}, simulate.p.value={{selected.simchkbox | safe}}, B={{selected.simnum | safe}}, 
	conf.level={{selected.conflevel | safe}}, numeric.simplify={{selected.numericsimplifychkbox | safe}}, cat.simplify={{if (options.selected.categorysimplifychkbox=="FALSE")}}FALSE{{#else}}{{if (options.selected.labelsimplifychkbox=="TRUE")}}"label"{{#else}}TRUE{{/if}}{{/if}}, ordered.simplify={{selected.categorysimplifychkbox | safe}}, 
	date.simplify={{selected.datesimplifychkbox | safe}})

tab1.final <- as.data.frame(summary(tab1, text=TRUE, {{selected.groupvarchkbox | safe}} pfootnote={{selected.footnotechkbox | safe}},
	stats.labels=list(trimmean_func="{{selected.trimpct |safe}}% Trimmed Mean (CI)", pct1_func="1st %-ile (CI)", pct5_func="5th %-ile (CI)", 
	pct10_func="10th %-ile (CI)", pct25_func="25th %-ile (CI)", pct33_func="1st Tertile", pct50_func="Median (CI)", pct66_func="2nd Tertile", 
	pct75_func="75th %-ile (CI)", pct90_func="90th %-ile", pct95_func="95th %-ile", pct99_func="99th %-ile", custquant_func="{{selected.custquantvalue | safe}} %-ile (CI)",
	cv_func="CV", skewness_func="Skewness", kurtosis_func="Kurtosis")))

{{if ((options.selected.footnotechkbox=="TRUE") && (options.selected.ciFootNote!="TRUE"))}}
# You want statistical tests, and footnotes but not confidence interval footnotes
#Get count of unique p values
pval.tests <- unique(tests(tab1)$Method)
pval.foot <- paste(paste0("(", 1:length(pval.tests), ")"), pval.tests, collapse="\n")
BSkyFormat(tab1.final, perTableFooter=pval.foot, decimalDigitsRounding=-1, singleTableOutputHeader="{{selected.tabletitle | safe}} ")
{{/if}}

{{if ((options.selected.footnotechkbox=="TRUE") && (options.selected.ciFootNote=="TRUE"))}}
#You want statistical tests, and footnotes and confidence interval footnotes
#Get count of unique p values
pval.tests <- unique(tests(tab1)$Method)
pval.foot <- paste(paste0("(", 1:length(pval.tests), ")"), pval.tests, collapse="\n")
pval.foot <- paste(pval.foot, "Confidence interval level = {{selected.conflevel | safe}}", sep ="\n")
BSkyFormat(tab1.final, perTableFooter=pval.foot, decimalDigitsRounding=-1, singleTableOutputHeader="{{selected.tabletitle | safe}} ")
{{/if}}


{{if ( (options.selected.footnotechkbox=="FALSE") && (options.selected.ciFootNote=="TRUE"))}}
BSkyFormat(tab1.final, perTableFooter="Confidence interval level = {{selected.conflevel | safe}}", decimalDigitsRounding=-1, singleTableOutputHeader="{{selected.tabletitle | safe}} ")
{{/if}}

{{if ((options.selected.footnotechkbox=="FALSE") && (options.selected.ciFootNote=="FALSE"))}}
BSkyFormat(tab1.final, decimalDigitsRounding=-1, singleTableOutputHeader="{{selected.tabletitle | safe}} ")
{{/if}}
`
        };
        var objects = {
            content_var: { el: new srcVariableList(config, {action: "move", scroll: true}) },
			note: {
				el: new labelVar(config, {
				label: TableAdvanced.t('notelabel'), 
				style: "mb-3", 
				h:5
				})
			},			
			anovavars: {
				el: new dstVariableList(config,{
				label: TableAdvanced.t('anovavarslabel'),
				no: "anovavars",
				required: false,
				filter:"Numeric|Date|Scale",
				extraction: "NoPrefix|UsePlus",
				})
			},
			kwvars: {
				el: new dstVariableList(config,{
				label: TableAdvanced.t('kwvarslabel'),
				no: "kwvars",
				required: false,
				filter:"Numeric|Date|Ordinal|Scale",
				extraction: "NoPrefix|UsePlus",
				})
			},
			medvars: {
				el: new dstVariableList(config,{
				label: TableAdvanced.t('medvarslabel'),
				no: "medvars",
				required: false,
				filter:"Numeric|Date|Scale",
				extraction: "NoPrefix|UsePlus",
				})
			},			
			chisqvars: {
				el: new dstVariableList(config,{
				label: TableAdvanced.t('chisqvarslabel'),
				no: "chisqvars",
				required: false,
				filter:"Numeric|Nominal|Ordinal",
				extraction: "NoPrefix|UsePlus",
				})
			},
			fishervars: {
				el: new dstVariableList(config,{
				label: TableAdvanced.t('fishervarslabel'),
				no: "fishervars",
				required: false,
				filter:"Numeric|Nominal|Ordinal",
				extraction: "NoPrefix|UsePlus",
				})
			},
			ordvars: {
				el: new dstVariableList(config,{
				label: TableAdvanced.t('ordvarslabel'),
				no: "ordvars",
				required: false,
				filter:"Numeric|Nominal|Ordinal",
				extraction: "NoPrefix|UsePlus",
				})
			},
			notestvars: {
				el: new dstVariableList(config,{
				label: TableAdvanced.t('notestvarslabel'),
				no: "notestvars",
				required: false,
				filter:"Numeric|Date|Nominal|Ordinal|Scale",
				extraction: "NoPrefix|UsePlus",
				})
			},			
			bygroupvar: {
				el: new dstVariable(config, {
				label: TableAdvanced.t('bygroupvarlabel'),
				no: "bygroupvar",
				filter: "String|Numeric|Ordinal|Nominal|Scale",
				extraction: "NoPrefix|UseComma",
				required: true,
				})
			},
			stratavar: {
				el: new dstVariable(config, {
				label: TableAdvanced.t('stratavarlabel'),
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
				label: TableAdvanced.t('tabletitlelabel'),
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
				label: TableAdvanced.t('totalcolchkboxlabel'),
				no: "totalcolchkbox",
				extraction: "Boolean"
				})
			},
			groupvarchkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('groupvarchkboxlabel'),
				no: "groupvarchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "term.name=TRUE,",
				false_value: " ",
				})
			},
			digitslabel: {
				el: new labelVar(config, {
				label: TableAdvanced.t('digitslabel'), 
				style: "mt-4", 
				h:5
				})
			},
			contdigits: {
				el: new inputSpinner(config, {
				no: 'contdigits',
				label: TableAdvanced.t('contdigitslabel'),
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
				label: TableAdvanced.t('pctdigitslabel'),
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
				label: TableAdvanced.t('pvaluedigitslabel'),
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
				label: TableAdvanced.t('simplifylabel'), 
				style: "mt-4", 
				h:5
				})
			},
			numericsimplifychkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('numericsimplifylabel'),
				style: "ml-3",
				no: "numericsimplifychkbox",
				extraction: "Boolean"
				})
			},
			categorysimplifychkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('categorysimplifylabel'),
				no: "categorysimplifychkbox",
				extraction: "Boolean"
				})
			},
			datesimplifychkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('datesimplifylabel'),
				no: "datesimplifychkbox",
				extraction: "Boolean"
				})
			},
			labelsimplifychkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('labelsimplifylabel'),
				no: "labelsimplifychkbox",
				newline: true,
				style: "ml-3",
				extraction: "Boolean"
				})
			},			
			conflevel: {
				el: new inputSpinner(config, {
				no: 'conflevel',
				label: TableAdvanced.t('conflevellabel'),
				style: "mt-4 mb-4",
				min: 0,
				max: 1,
				step: .001,
				value: 0.95,
				extraction: "NoPrefix|UseComma"
				})
			},
			simchkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('simchkboxlabel'),
				no: "simchkbox",
				style: "mt-2",
				extraction: "Boolean"
				})
			},
			simnum: {
				el: new inputSpinner(config, {
				no: 'simnum',
				label: TableAdvanced.t('simnumlabel'),
				style: "mt-2",
				min: 100,
				max: 1000000,
				step: 100,
				value: 2000,
				extraction: "NoPrefix|UseComma"
				})
			},
			footnotechkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('footnotechkboxlabel'),
				no: "footnotechkbox",
				style: "mt-4",
				extraction: "Boolean"
				})
			},
			ciFootNote: {
				el: new checkbox(config, {
				label: TableAdvanced.t('ciFootNote'),
				no: "ciFootNote",
				style: "mb-2",
				extraction: "Boolean"
				})
			},
			sampsizelabel: {
				el: new labelVar(config, {
				label: TableAdvanced.t('sampsizelabel'),
				h:5
				})
			},
			numnchkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('sampsizelabel'),
				no: "numnchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'N'",
				false_value: ""
				})
			},				
			numnmisschkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('nmissanylabel'),
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
				label: TableAdvanced.t('nmissalwayslabel'),
				no: "numnmiss2chkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'Nmiss2'",
				false_value: ""
				})
			},						
			meanlabel: {
				el: new labelVar(config, {
				label: TableAdvanced.t('meanlabel'),
				style: "mt-3",
				h:5
				})
			},
			nummeanchkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('meanlabel'),
				no: "nummeanchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'mean'",
				false_value: ""
				})
			},
			nummeansdchkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('meansdlabel'),
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
				label: TableAdvanced.t('meancilabel'),
				no: "nummeancichkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'meanCI'",
				false_value: ""
				})
			},
			nummeansechkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('meanselabel'),
				no: "nummeansechkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'meanse'",
				false_value: ""
				})
			},
			numgmeanchkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('gmeanlabel'),
				no: "numgmeanchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'gmean'",
				false_value: ""
				})
			},			
			numgmeansdchkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('gmeansdlabel'),
				no: "numgmeansdchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'gmeansd'",
				false_value: ""
				})
			},			
			numgmeancichkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('gmeancilabel'),
				no: "numgmeancichkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'gmeanCI'",
				false_value: ""
				})
			},
			numtrimmeancichkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('trimmeancilabel'),
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
				label: TableAdvanced.t('trimpctlabel'),
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
				label: TableAdvanced.t('quantileslabel'),
				style: "mt-3",
				h:5
				})
			},
			nummedianchkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('medianlabel'),
				no: "nummedianchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'median'",
				false_value: ""
				})
			},				
			nummedianq1q3chkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('medianq1q3label'),
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
				label: TableAdvanced.t('q1q3label'),
				no: "numq1q3chkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'q1q3'",
				false_value: ""
				})
			},			
			numiqrchkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('iqrlabel'),
				no: "numiqrchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'iqr'",
				false_value: ""
				})
			},
			nummedianrangechkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('medianrangelabel'),
				no: "nummedianrangechkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'medianrange'",
				false_value: ""
				})
			},
			nummedianmadchkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('medianmadlabel'),
				no: "nummedianmadchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'medianmad'",
				false_value: ""
				})
			},			
			numrangechkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('rangelabel'),
				no: "numrangechkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'range'",
				false_value: ""
				})
			},			
			numminchkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('minlabel'),
				no: "numminchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'min'",
				false_value: ""
				})
			},			
			nummaxchkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('maxlabel'),
				no: "nummaxchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'max'",
				false_value: ""
				})
			},
			numpct1chkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('pct1label'),
				no: "numpct1chkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'pct1_func'",
				false_value: ""
				})
			},
			numpct5chkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('pct5label'),
				no: "numpct5chkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'pct5_func'",
				false_value: ""
				})
			},
			numpct10chkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('pct10label'),
				no: "numpct10chkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'pct10_func'",
				false_value: ""
				})
			},
			numpct25chkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('pct25label'),
				no: "numpct25chkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'pct25_func'",
				false_value: ""
				})
			},			
			numpct33chkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('pct33label'),
				no: "numpct33chkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'pct33_func'",
				false_value: ""
				})
			},
			numpct50chkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('pct50label'),
				no: "numpct50chkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'pct50_func'",
				false_value: ""
				})
			},			
			numpct66chkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('pct66label'),
				no: "numpct66chkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'pct66_func'",
				false_value: ""
				})
			},
			numpct75chkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('pct75label'),
				no: "numpct75chkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'pct75_func'",
				false_value: ""
				})
			},			
			numpct90chkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('pct90label'),
				no: "numpct90chkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'pct90_func'",
				false_value: ""
				})
			},
			numpct95chkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('pct95label'),
				no: "numpct95chkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'pct95_func'",
				false_value: ""
				})
			},
			numpct99chkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('pct99label'),
				no: "numpct99chkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'pct99_func'",
				false_value: ""
				})
			},
			numcustquantchkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('custquantlabel'),
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
				label: TableAdvanced.t('custquantvaluelabel'),
				value: "20",
				extraction: "TextAsIs",
				allow_spaces: true,
				type: "numeric",
				ml: 4,
				width:"w-25",
				})
			},			
			otherlabel: {
				el: new labelVar(config, {
				label: TableAdvanced.t('otherlabel'),
				style: "mt-3",
				h:5
				})
			},
			numsumchkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('sumlabel'),
				no: "numsumchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'sum'",
				false_value: ""
				})
			},
			numsdchkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('sdlabel'),
				no: "numsdchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'sd'",
				false_value: ""
				})
			},
			numvarchkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('varlabel'),
				no: "numvarchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'var'",
				false_value: ""
				})
			},
			numgsdchkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('gsdlabel'),
				no: "numgsdchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'gsd'",
				false_value: ""
				})
			},
			numcvchkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('cvlabel'),
				no: "numcvchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'cv_func'",
				false_value: ""
				})
			},
			numskewnesschkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('skewnesslabel'),
				no: "numskewnesschkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'skewness_func'",
				false_value: ""
				})
			},
			numkurtosischkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('kurtosislabel'),
				no: "numkurtosischkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'kurtosis_func'",
				false_value: ""
				})
			},			
			catnchkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('sampsizelabel'),
				no: "catnchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'N'",
				false_value: ""
				})
			},				
			catnmisschkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('nmissanylabel'),
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
				label: TableAdvanced.t('nmissalwayslabel'),
				no: "catnmiss2chkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'Nmiss2'",
				false_value: ""
				})
			},			
			freqlabel: {
				el: new labelVar(config, {
				label: TableAdvanced.t('freqlabel'),
				style: "mt-3",
				h:5
				})
			},
			catfreqchkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('freqlabel'),
				no: "catfreqchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'count'",
				false_value: ""
				})
			},
			catfreqtotalchkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('freqtotallabel'),
				no: "catfreqtotalchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'countN'",
				false_value: ""
				})
			},
			catfreqpctchkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('freqpctlabel'),
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
				label: TableAdvanced.t('propcilabel'),
				no: "catpropcichkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'binomCI'",
				false_value: ""
				})
			},
			datenchkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('sampsizelabel'),
				no: "datenchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'N'",
				false_value: ""
				})
			},				
			datenmisschkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('nmissanylabel'),
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
				label: TableAdvanced.t('nmissalwayslabel'),
				no: "datenmiss2chkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'Nmiss2'",
				false_value: ""
				})
			},
			datemeanchkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('meanlabel'),
				no: "datemeanchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'mean'",
				false_value: ""
				})
			},
			datemeansdchkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('meansdlabel'),
				no: "datemeansdchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'meansd'",
				false_value: ""
				})
			},
			datemeansechkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('meanselabel'),
				no: "datemeansechkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'meanse'",
				false_value: ""
				})
			},			
			datemeancichkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('meancilabel'),
				no: "datemeancichkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'meanCI'",
				false_value: ""
				})
			},
			datemedianchkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('medianlabel'),
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
				label: TableAdvanced.t('medianq1q3label'),
				no: "datemedianq1q3chkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'medianq1q3'",
				false_value: ""
				})
			},			
			dateq1q3chkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('q1q3label'),
				no: "dateq1q3chkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'q1q3'",
				false_value: ""
				})
			},			
			dateiqrchkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('iqrlabel'),
				no: "dateiqrchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'iqr'",
				false_value: ""
				})
			},
			datemedianrangechkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('medianrangelabel'),
				no: "datemedianrangechkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'medianrange'",
				false_value: ""
				})
			},
			daterangechkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('rangelabel'),
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
				label: TableAdvanced.t('minlabel'),
				no: "dateminchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'min'",
				false_value: ""
				})
			},
			datemaxchkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('maxlabel'),
				no: "datemaxchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'max'",
				false_value: ""
				})
			},
			datesdchkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('sdlabel'),
				no: "datesdchkbox",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "'sd'",
				false_value: ""
				})
			},
			datevarchkbox: {
				el: new checkbox(config, {
				label: TableAdvanced.t('varlabel'),
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
                name: TableAdvanced.t('optvarStatistical'),
                content: [ 
					objects.simchkbox.el, objects.simnum.el,
					objects.footnotechkbox.el
					]
				})
		}

		var numstatspanel = {
            el: new optionsVar(config, {
                no: "numstatspanel",
                name: TableAdvanced.t('optvarNumerical'),
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
                name: TableAdvanced.t('optvarCategorical'),
                content: [objects.sampsizelabel.el, objects.catnchkbox.el, objects.catnmisschkbox.el, objects.catnmiss2chkbox.el,
					objects.freqlabel.el, objects.catfreqchkbox.el, objects.catfreqtotalchkbox.el, objects.catfreqpctchkbox.el, objects.catpropcichkbox.el                  
					]
				})
		}

		var datestatspanel = {
            el: new optionsVar(config, {
                no: "datestatspanel",
                name: TableAdvanced.t('optvarDate'),
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
            right: [objects.bygroupvar.el.content, objects.note.el.content, objects.anovavars.el.content, objects.kwvars.el.content, objects.medvars.el.content, objects.chisqvars.el.content, objects.fishervars.el.content, objects.ordvars.el.content, objects.notestvars.el.content,
					objects.stratavar.el.content, objects.tabletitle.el.content, objects.totalcolchkbox.el.content,
					objects.groupvarchkbox.el.content, objects.digitslabel.el.content, objects.contdigits.el.content, objects.pctdigits.el.content, objects.pvaluedigits.el.content,
					objects.simplifylabel.el.content, objects.numericsimplifychkbox.el.content, objects.categorysimplifychkbox.el.content, 
					objects.datesimplifychkbox.el.content, objects.labelsimplifychkbox.el.content, objects.conflevel.el.content, objects.ciFootNote.el.content],
			bottom: [stattestspanel.el.content, numstatspanel.el.content, catstatspanel.el.content, datestatspanel.el.content],
            nav: {
                name: TableAdvanced.t('navigation'),
                icon: "icon-tableadvanced",
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: TableAdvanced.t('help.title'),
            r_help: TableAdvanced.t('help.r_help'), //r_help: "help(data,package='utils')",
            body: TableAdvanced.t('help.body')
        }
;
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

		//creating correct strings for R statistical test calls
		let anovavars=code_vars.selected.anovavars.toString().replaceAll("+", ") + anova(")
		if (anovavars != "") {
			anovavars="anova("+anovavars+")"
		}
		
		let kwvars=code_vars.selected.kwvars.toString().replaceAll("+", ") + kwt(")
		if (kwvars != "") {
			kwvars="kwt("+kwvars+")"
		}
		
		let medvars=code_vars.selected.medvars.toString().replaceAll("+", ") + medtest(")
		if (medvars != "") {
			medvars="medtest("+medvars+")"
		}
		
		let chisqvars=code_vars.selected.chisqvars.toString().replaceAll("+", ") + chisq(")
		if (chisqvars != "") {
			chisqvars="chisq("+chisqvars+")"
		}
		
		let fishervars=code_vars.selected.fishervars.toString().replaceAll("+", ") + fe(")
		if (fishervars != "") {
			fishervars="fe("+fishervars+")"
		}
		
		let ordvars=code_vars.selected.ordvars.toString().replaceAll("+", ") + trend(")
		if (ordvars != "") {
			ordvars="trend("+ordvars+")"
		}
		
		let notestvars=code_vars.selected.notestvars.toString().replaceAll("+", ") + notest(")
		if (notestvars != "") {
			notestvars="notest("+notestvars+")"
		}
		
		let alltestsarray=[]
		if (anovavars != "") {
			alltestsarray.push(anovavars)
		}
		if (kwvars != "") {
			alltestsarray.push(kwvars)
		}
		if (medvars != "") {
			alltestsarray.push(medvars)
		}
		if (chisqvars != "") {
			alltestsarray.push(chisqvars)
		}
		if (fishervars != "") {
			alltestsarray.push(fishervars)
		}
		if (ordvars != "") {
			alltestsarray.push(ordvars)
		}
		if (notestvars != "") {
			alltestsarray.push(notestvars)
		}	
		
		let alltestsstring=alltestsarray.join(' + ')

		//creating correct strings for statistic lists for R 
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
		code_vars.selected.alltestslist = alltestsstring
		
		code_vars.selected.numstatslist = numstatsstring
		code_vars.selected.catstatslist = catstatsstring
		code_vars.selected.datestatslist = datestatsstring
		
		
		//final piece of code
            const cmd = instance.dialog.renderR(code_vars);
            res.push({ cmd: cmd, cgid: newCommandGroup(`${instance.config.id}`, `${instance.config.label}`), oriR: instance.config.RCode, code_vars: code_vars })
            return res;		
	}	


	
}

module.exports = {
    render: () => new TableAdvanced().render()
}
