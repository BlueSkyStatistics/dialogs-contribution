
var localization = {
    en: {
        title: "Compare ROC Curves",
        navigation: "Compare ROC Curves",
		outcomevar: "Binary Outcome Variable (numeric/factor)",
		predprobvars: "Predicted Probability Variables from Each Model, specify at least 2",
		outcomeorderlabel: "Outcome 'Positive' Value",
		outcomeorderhigh: "Higher ordered value",
		outcomeorderlow: "Lower ordered value",
		specopt: "Plot specificity instead of 1-specificity",
		cilevel: "Confidence Level",
		multcompopt: "Multiple Comparison Adjustment",
		multcompmethod: "Multiple Comparison Method",
		
		plotoptions: "Plot Options",
		plottitle: "Plot Title",
		plottitlesize: "Plot Title Size (5-50)",
		themedropdown: "Plot Theme",
		
		lineoptionslabel: "Line Options",
		linesize: "Line Size (0-5)",
		colorpalette: "Color Palette",
		
		axisoptionslabel: "Axis Options",
		axislabelsize: "Axis Label Size (5-50)",
		ticklabelsize: "Axis Tick Mark Label Size (5-50)",
		
		legendoptionslabel: "Legend Options",
		legendtitle: "Title",
        legendpos : "Position",
		curvelabels: "Curve Labels, specify as 'Label 1', 'Label 2', 'Label 3'; use \\n within a label for a line break",
		legendfontsize: "Legend Labels Size (5-50)",

        help: {
            title: "Compare ROC Curves",
            r_help: "help(roc.test, package = 'pROC')",
            body: `
This dialog compares receiver operating characteristic (ROC) curves given a set of predicted probabilities from a model (e.g. logistic regression).  Each model must have
been fit using the same ordering of the outcome variabe.  It provides a table of individual areas under the ROC curves with confidence intervals, a table of pairwise comparisons 
using DeLong's test, and an overlaid set of ROC curves.  Subjects with missing values for the outcome or the predicted probabilities are removed so that every model is assessed 
on the same set of subjects.  See Model Evaluation > Predict > Model Scoring to obtain predicted probablities from candidate models. 
<br/><br/><br/>
<b>Binary Outcome Variable:</b> The binary outcome used for predictions.  Must be numeric or factor.
<br/><br/>
<b>Predicted Probability Variables from Each Model:</b> Specify predicted probability columns from each fitted model you want to compare.
<br/><br/>
<b>Outcome 'Positive' Value:</b> Specify whether the higher or lower ordered value of the specified binary outcome variable should be considered the 'positive' value.  This is the 
level that the predicted proabilities pertain to.  For example, if the binary outcome was coded as 0/1, the higher ordered value would mean that 1 is the 'positive' response and
the lower ordered value would mean that 0 is the 'positive' response. 
<br/><br/>
<b>Plot specificity instead of 1-specificity:</b> This changes the x-axis of the ROC curve plot to use specificity instead.  The axis will be decreasing from 1 to 0, as you go
left to right.
<br/><br/> 
<b>Confidence Level:</b> Confidence level for ROC curve area intervals
<br/><br/>
<b>Multiple Comparison Adjustment:</b> Apply a multiple comparison adjustment to the pairwise comparisons of ROC curve areas.
<br/><br/><br/>
<b>Plot Options:</b>
<br/><br/>
<b>Plot Title:</b> Specify the title for the plot.  Can be removed.
<br/><br/>
<b>Plot Theme:</b> Specify the general theme for the plot
<br/><br/>
<b>Line Options:</b>
<br/><br/>
<b>Line Size:</b> Specify the size of the lines on the ROC curve plot
<br/><br/>
<b>Color Palette:</b> Specify the color palette used for the ROC curve lines
<br/><br/>
<b>Axis Options:</b>
<br/><br/>
<b>Axis Label Size:</b> Specify the size of the axis labels used on the plot.
<br/><br/>
<b>Axis Tick Mark Label Size:</b> Specify the size of the axis tick mark labels.
<br/><br/>
<b>Legend Options:</b>
<br/><br/>
<b>Position:</b> Specify the position of the legend in the plot.  Can be right, top, bottom, or left.
<br/><br/>
<b>Title:</b> Specify the title for the legend.  Can be removed.
<br/><br/>
<b>Curve Labels:</b> Specify the curve labels used in the legend corresponding to the order of the curves (curve 1, curve 2, curve 3, etc.).  Specifying nothing will yield curve 
labels of 1, 2, 3, etc.  If you specify any labels, you must specify labels for all curves.  The order of the curves is the same as the specified order of the predicted probabilities.
<br/><br/>
<b>Legend Labels Size:</b> Size of all text in the legend.
<br/><br/>
<b>Required R Packages:</b> pROC, ggthemes, RColorBrewer, ggsci, ggplot2
`}
    }
}

class CompareROCCurves extends baseModal {
    constructor() {
        var config = {
            id: "CompareROCCurves",
            label: localization.en.title,
            modalType: "two",
            RCode: `
library(pROC)
library(ggthemes)
library(RColorBrewer)
library(ggsci)
library(ggplot2)  

pred_vars <- c({{selected.predprobvars | safe}})

# removing missing values

dataset_nomiss <- na.omit({{dataset.name}}[ , c("{{selected.outcomevar | safe}}", pred_vars)])
num_nonmiss <- nrow(dataset_nomiss)

# individual ROC AUCs, confidence intervals, tests, and list of ROC objects

num_vars <- length(pred_vars)
auc_vec <- c()
auc_lower_vec <- c()
auc_upper_vec <- c()
zind_vec <- c()
zindpvalue_vec <- c()
roc_list <- list()

for (i in 1:num_vars) {
roc_obj <- roc(response=dataset_nomiss{{selected.dollaroutcomevar | safe}}, predictor=dataset_nomiss[, c(pred_vars[i])], direction="{{selected.outcomeordergrp | safe}}")
ci_roc_obj <- ci(roc_obj, conf.level={{selected.cilevel | safe}})
roc_list[[i]] <- roc_obj
auc_vec[i] <- ci_roc_obj[2]
auc_lower_vec[i] <- ci_roc_obj[1]
auc_upper_vec[i] <- ci_roc_obj[3]
zind_vec[i] <- (roc_obj$auc-.5)/sqrt(var(roc_obj, method="delong"))
zindpvalue_vec[i] <- 1-pnorm(abs(zind_vec[i]))  
}

# sample size and positive level output

{{if (options.selected.outcomeordergrp=="<")}}
pos_level <- levels(factor({{dataset.name}}{{selected.dollaroutcomevar | safe}}))[2]
{{#else}}
pos_level <- levels(factor({{dataset.name}}{{selected.dollaroutcomevar | safe}}))[1]
{{/if}}

BSkyFormat(data.frame(N=num_nonmiss, Outcome="{{selected.outcomevar | safe}}", Positive_Level=pos_level), singleTableOutputHeader="Sample Size and Outcome")

# individual ROC curve output

rocauc_table <- data.frame(Curve=1:num_vars, Variable=pred_vars, AUC=auc_vec, AUC_lower=auc_lower_vec, AUC_upper=auc_upper_vec, Z=zind_vec, p.value=zindpvalue_vec)

BSkyFormat(rocauc_table, singleTableOutputHeader="ROC Curve Areas, {{selected.cilevel | safe}} Level Confidence Intervals, and Tests of Area>0.5")

# pairwise AUC tests

rocname1_vec <- c()
rocname2_vec <- c()
auc1_vec <- c()
auc2_vec <- c()
ztest_vec <- c()
zpvalue_vec <- c()
aucdiff_vec <- c()
aucdiff_lower_vec <- c()
aucdiff_upper_vec <- c()

for (i in 1:(num_vars-1)) {
 for (j in (i+1):num_vars) {
    roc_pair <- roc.test(roc_list[[i]], roc_list[[j]], method="delong")
    rocname1_vec <- c(rocname1_vec, pred_vars[i])
    rocname2_vec <- c(rocname2_vec, pred_vars[j])
    auc1_vec <- c(auc1_vec, roc_pair$estimate[1])
    auc2_vec <- c(auc2_vec, roc_pair$estimate[2])
    ztest_vec <- c(ztest_vec, roc_pair$statistic)
    zpvalue_vec <- c(zpvalue_vec, roc_pair$p.value)
    aucdiff_vec <- c(aucdiff_vec, roc_pair$estimate[1]-roc_pair$estimate[2])
    roc1var <- var(roc_list[[i]], method="delong")
    roc2var <- var(roc_list[[j]], method="delong")
    roc12_cov <- cov(roc_list[[i]], roc_list[[j]], method="delong")
    roc12_se <- sqrt(roc1var + roc2var - 2*roc12_cov)
    aucdiff_lower_vec <- c(aucdiff_lower_vec, roc_pair$estimate[1]-roc_pair$estimate[2] - qnorm(1-(1-{{selected.cilevel | safe}})/2)*roc12_se)
    aucdiff_upper_vec <- c(aucdiff_upper_vec, roc_pair$estimate[1]-roc_pair$estimate[2] + qnorm(1-(1-{{selected.cilevel | safe}})/2)*roc12_se)
 }
}

# pairwise AUC test output

rocpairs_table <- data.frame(Variable1=rocname1_vec, AUC1=auc1_vec, Variable2=rocname2_vec, AUC2=auc2_vec, Z=ztest_vec, p.value=zpvalue_vec, AUC_diff=aucdiff_vec, AUC_diff_lower=aucdiff_lower_vec, AUC_diff_upper=aucdiff_upper_vec)
BSkyFormat(rocpairs_table, singleTableOutputHeader="Pairwise Comparisons of ROC Curve Areas and {{selected.cilevel | safe}} Level Confidence Intervals")

{{if (options.selected.multcompopt=="TRUE")}}
# multiple comparison adjustments
rocpairs_adjtable <- data.frame(Variable1=rocname1_vec, AUC1=auc1_vec, Variable2=rocname2_vec, AUC2=auc2_vec, p.value=p.adjust(zpvalue_vec, method="{{selected.multcompmethod | safe}}"))
BSkyFormat(rocpairs_adjtable, singleTableOutputHeader="Multiple Comparison Adjusted Pairwise Comparisons, {{selected.multcompmethod | safe}} method")
{{/if}}

# overlaid ROC curves

# setting up colors and legend
color_pal_spec <- "{{selected.colorpalette | safe}}"

if (color_pal_spec=="hue") {
scale_color <- scale_color_hue(name="{{selected.legendtitle | safe}} " {{selected.curvelabels | safe}})
} else if (color_pal_spec=="grey") {
scale_color <- scale_color_grey(name="{{selected.legendtitle | safe}} " {{selected.curvelabels | safe}})
} else if (color_pal_spec=="Greys") {
scale_color <- scale_color_brewer(palette="Greys", name="{{selected.legendtitle | safe}} " {{selected.curvelabels | safe}})
} else if (color_pal_spec=="Set1") {
scale_color <- scale_color_brewer(palette="Set1", name="{{selected.legendtitle | safe}} " {{selected.curvelabels | safe}})
} else if (color_pal_spec=="Set2") {
scale_color <- scale_color_brewer(palette="Set2", name="{{selected.legendtitle | safe}} " {{selected.curvelabels | safe}})
} else if (color_pal_spec=="Dark2") {
scale_color <- scale_color_brewer(palette="Dark2", name="{{selected.legendtitle | safe}} " {{selected.curvelabels | safe}})
} else if (color_pal_spec=="npg") {
scale_color <- scale_color_npg(name="{{selected.legendtitle | safe}} " {{selected.curvelabels | safe}})
} else if (color_pal_spec=="aaas") {
scale_color <- scale_color_aaas(name="{{selected.legendtitle | safe}} " {{selected.curvelabels | safe}})
} else if (color_pal_spec=="nejm") {
scale_color <- scale_color_nejm(name="{{selected.legendtitle | safe}} " {{selected.curvelabels | safe}})
} else if (color_pal_spec=="lancet") {
scale_color <- scale_color_lancet(name="{{selected.legendtitle | safe}} " {{selected.curvelabels | safe}})
} else if (color_pal_spec=="jama") {
scale_color <- scale_color_jama(name="{{selected.legendtitle | safe}} " {{selected.curvelabels | safe}})
} else if (color_pal_spec=="jco") {
scale_color <- scale_color_jco(name="{{selected.legendtitle | safe}} " {{selected.curvelabels | safe}})
}

ggroc(data=roc_list, legacy.axes={{selected.specopt | safe}}) + 
    {{selected.themedropdown | safe}} + 
    theme(plot.title=element_text(size={{selected.plottitlesize}}), axis.title=element_text(size={{selected.axislabelsize | safe}}), axis.text=element_text(size={{selected.ticklabelsize | safe}}), 
		legend.position="{{selected.legendpos | safe}}", legend.title=element_text(size={{selected.legendfontsize | safe}}), legend.text=element_text(size={{selected.legendfontsize}})) + 
    labs(title="{{selected.plottitle | safe}}") + 
    geom_line(size={{selected.linesize | safe}}) +
    scale_color         
`
        }
        var objects = {
            content_var: {
                el: new srcVariableList(config, {
                    action: "move"
                })
            },
            outcomevar: {
                el: new dstVariable(config, {
                    label: localization.en.outcomevar,
                    no: "outcomevar",
                    filter: "Numeric|Nominal|Scale",
                    extraction: "NoPrefix|UseComma",
                    required: true
                })
            },
            predprobvars: {
                el: new dstVariableList(config, {
                    label: localization.en.predprobvars,
                    no: "predprobvars",
                    required: true,
                    filter: "Numeric|Scale",
                    extraction: "NoPrefix|UseComma|Enclosed"
                })
            },
			outcomeorderlabel: {
				el: new labelVar(config, {
					label: localization.en.outcomeorderlabel, 
					style: "mt-3", 
					h:5
				})
			},
			outcomeorderhigh: {
				el: new radioButton(config, {
					label: localization.en.outcomeorderhigh,
					no: "outcomeordergrp",
					increment: "outcomeorderhigh",
					value: "<",
					state: "checked",
					extraction: "ValueAsIs"
				})
			},		
			outcomeorderlow: {
				el: new radioButton(config, {
					label: localization.en.outcomeorderlow,
					no: "outcomeordergrp",
					increment: "outcomeorderlow",
					value: ">",
					state: "",
					extraction: "ValueAsIs"
				})
			},
			specopt: {
				el: new checkbox(config, {
				label: localization.en.specopt,
				no: "specopt",
				style: "mt-4",
				bs_type: "valuebox",
				extraction: "TextAsIs",
				true_value: "FALSE",
				false_value: "TRUE"
				})
			},			
			cilevel: {
				el: new advancedSlider(config,{
					no: 'cilevel',
					label: localization.en.cilevel,
					style: "mt-4",
					min: 0,
					max: 1,
					step: 0.01,
					value: 0.95,
					extraction: "NoPrefix|UseComma"
				})
			},
			multcompopt: {
				el: new checkbox(config, {
				label: localization.en.multcompopt,
				no: "multcompopt",
				extraction: "Boolean"
				})
			},
            multcompmethod: {
                el: new comboBox(config, {
                    no: 'multcompmethod',
                    label: localization.en.multcompmethod,
					style: "ml-3",
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["holm","hochberg","hommel","bonferroni","fdr","BY"],
                    default: "holm"
                })
            },			
			plottitle: {
				el: new input(config, {
					no: 'plottitle',
					label: localization.en.plottitle,
					placeholder: "ROC Curve Comparison",
					extraction: "TextAsIs",
					type: "character",
					allow_spaces: true,
					value: "ROC Curve Comparison",
					width: "w-75",
				})
			},			
			plottitlesize: {
				el: new inputSpinner(config,{
				no: 'plottitlesize',
				label: localization.en.plottitlesize,
				style: "mt-3",
				min: 5,
				max: 50,
				step: 1,
				value: 20,
				extraction: "NoPrefix|UseComma"
				})
			},	
            themedropdown: {
                el: new comboBox(config, {
                    no: 'themedropdown',
                    label: localization.en.themedropdown,
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["theme_base()", "theme_bw()", "theme_calc()",
                    "theme_classic()", "theme_clean()", "theme_dark()", "theme_economist()", "theme_economist_white()",
                    "theme_excel()", "theme_excel_new()", "theme_few()",
                    "theme_fivethirtyeight()", "theme_foundation()", "theme_gdocs()", "theme_grey()",
                    "theme_hc()", "theme_igray()", "theme_light()", "theme_linedraw()", "theme_map()","theme_pander()",
                    "theme_par()", "theme_solarized()", "theme_solarized_2()",
                    "theme_solid()", "theme_stata()", "theme_test()", "theme_tufte()", "theme_void()",
                    "theme_wsj()"],
                    default: "theme_grey()"
                })
            },
			lineoptionslabel: { el: new labelVar(config, { label: localization.en.lineoptionslabel, h: 5, style: "mt-4" }) },
			linesize: {
				el: new inputSpinner(config, {
					no: 'linesize',
					label: localization.en.linesize,
					style: "ml-1",
					min: 0,
					max: 5,
					step: 0.5,
					value: 1,
					extraction: "NoPrefix|UseComma"
				})
			},			
            colorpalette: {
                el: new comboBox(config, {
                    no: 'colorpalette',
                    label: localization.en.colorpalette,
					style: "ml-3",
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["hue", "grey", "Greys", "Set1", "Set2", "Dark2", "npg", "aaas", "nejm", "lancet", "jama", "jco"],
                    default: "hue"
                })
            },
			axisoptionslabel: { el: new labelVar(config, { label: localization.en.axisoptionslabel, h: 5, style: "mt-4" }) },
			axislabelsize: {
				el: new inputSpinner(config,{
				no: 'axislabelsize',
				label: localization.en.axislabelsize,
				style: "ml-1",
				min: 5,
				max: 50,
				step: 1,
				value: 16,
				extraction: "NoPrefix|UseComma"
				})
			},
			ticklabelsize: {
				el: new inputSpinner(config,{
				no: 'ticklabelsize',
				label: localization.en.ticklabelsize,
				style: "ml-1",
				min: 5,
				max: 50,
				step: 1,
				value: 12,
				extraction: "NoPrefix|UseComma"
				})
			},
			legendoptionslabel: { el: new labelVar(config, { label: localization.en.legendoptionslabel, h: 5, style: "mt-4" }) },
            legendpos: {
                el: new comboBox(config, {
                    no: 'legendpos',
                    label: localization.en.legendpos,
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["top", "bottom", "left", "right"],
                    default: "top",
                    style: "ml-3"
                })
            },
            legendtitle: {
                el: new input(config, {
                    no: 'legendtitle',
                    label: localization.en.legendtitle,
                    placeholder: "Model",
                    ml: 3,
                    extraction: "TextAsIs",
                    value: "Model",
                    allow_spaces:true,
                    type: "character",
                })
            },            
            curvelabels: {
                el: new input(config, {
                    no: 'curvelabels',
                    label: localization.en.curvelabels,
                    placeholder: "",
                    ml: 3,
                    extraction: "TextAsIs",
                    value: "",
                    allow_spaces:true,
                    type: "character",
					width: "w-100",
					wrapped:', labels=c(%val%)'
                })
            },
			legendfontsize: {
				el: new inputSpinner(config,{
				no: 'legendfontsize',
				label: localization.en.legendfontsize,
				style: "ml-1",
				min: 5,
				max: 50,
				step: 1,
				value: 12,
				extraction: "NoPrefix|UseComma"
				})
			}			
        }
        var plotoptions = {
            el: new optionsVar(config, {
                no: "plotoptions",
                name: localization.en.plotoptions,
                content: [
                    objects.plottitle.el, objects.plottitlesize.el, objects.themedropdown.el,
					objects.lineoptionslabel.el, objects.linesize.el, objects.colorpalette.el,
					objects.axisoptionslabel.el, objects.axislabelsize.el, objects.ticklabelsize.el,
					objects.legendoptionslabel.el, objects.legendpos.el, objects.legendtitle.el, objects.curvelabels.el, objects.legendfontsize.el
                ]
            })
        };
       
        const content = {
            left: [objects.content_var.el.content],
            right: [
				objects.outcomevar.el.content, objects.predprobvars.el.content, 
				objects.outcomeorderlabel.el.content, objects.outcomeorderhigh.el.content, objects.outcomeorderlow.el.content, objects.specopt.el.content, objects.cilevel.el.content,
				objects.multcompopt.el.content, objects.multcompmethod.el.content
            ],
            bottom: [plotoptions.el.content],
            nav: {
                name: localization.en.navigation,
                icon: "icon-icc",
				positionInNav: 3,
                modal: config.id
            }
        }
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
		let dollaroutcomestring="$"+code_vars.selected.outcomevar
	
		//create new variables under code_vars
		code_vars.selected.dollaroutcomevar = dollaroutcomestring		
		
		//final piece of code
            const cmd = instance.dialog.renderR(code_vars);
            res.push({ cmd: cmd, cgid: newCommandGroup(`${instance.config.id}`, `${instance.config.label}`), oriR: instance.config.RCode, code_vars: code_vars })
            return res;		
	}		
	
	
}
module.exports.item = new CompareROCCurves().render()