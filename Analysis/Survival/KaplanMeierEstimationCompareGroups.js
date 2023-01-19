
var localization = {
    en: {
        title: "Kaplan-Meier Estimation, Compare Groups",
        navigation: "Kaplan-Meier Estimation, Compare Groups",
        timevar: "Time to event or censor",
        eventvar: "Event (1 = event, 0 = censor)",
        groupvar: "Group",
        label1: "Plot Type",
        survivalradio:"Survival",
        inciradio: "Failure",
        allesttable: "Estimate Table Including All Times",
		printspecest: "Estimate Table for Specific Times",
		spectimes: "Specify times as time1, time2, time3, etc. or as seq(1,5,by=1)",
        styleoptions: "Style Options",
        axisoptions: "Axis Options",
		label12: "Click on the ? button on the top right of the dialog for details on sample datasets and the data format supported.",
        titlebox: "Plot Title",
		plottitlesizelabel: "Plot Title Size (5-50)",
        themedropdown: "Plot Theme",
        label2: "Number at Risk",
        natriskchkbox: "Include Number at Risk",
        risktableprop: "Risk Table Height(0-1)",
        risktablepos: "Risk Table Position",
		risktabletext: "Include strata labels",
		risktablevaluesize: "Risk Table Value Size (1-15)",
		risktabletitlesize: "Risk Table Title Size (5-50)",
		risktableaxislabelsize: "Risk Table Axis Label Size (5-50)",
		risktableticklabelsize: "Risk Table Tick Label Size (5-50)",
		risktableclean: "Remove Axes and Gridlines from Risk Table",
		
		label2b: "Legend",
		legendpos: "Position",
		legendtitle: "Title",
		legendlabels:"Value Labels (default is NULL; give in order of strata; e.g. c( 'Male', 'Female' )):",
		legendfontsize: "Legend Labels Size (5-50)",
		
		
        label3: "Line Options",
        linesize: "Size (0-5)",
        linecolor: "Color palette",
        label4 : "Confidence Interval",
        cichkbox : "include 95% CI",
        cistyle : "Style",
        citransparency : "Transparency (0-1)",

        label5: "Censored Times",
		censorchkbox:"Include Censored Times",
		censorsize : "Size (0-10)",
		medsurvivalline:"Indicate Median Survival (h=horizontal, v=vertical)",
		
		label5b: "P-Value",
		pvaluechkbox:"Include p-value",
		label5c: "Type",
		logrank:"Log-Rank",
		gehanbreslow:"Gehan-Breslow (Wilcoxon)",
		taroneware:"Tarone-Ware",
		petopeto:"Peto-Peto",
		modpetopeto:"Modified Peto-Peto",
		flemharr:"Flemington-Harrington",
		pvaluelocation:"Location ((x,y), e.g. c( time, proportion)):",
		pvaluesize:"Size",
		
		label6: "Survival Axis",
		survaxislabel:"Label",
		label7: "Scale",
		defbutton:"proportion",
		pctbutton:"percent",
		survaxislimits:"Axis limits on proportion scale(0-1) - enter 'c(min, max)'",
		survtickinc : "Tick Mark Increments (0-1)",
		
        label8: "Time Axis",
        timeaxislabel: "Label",
        timeaxislimits: "Axis Limits (NULL is default, enter 'c(min,max)' to change e.g. 'c(0,20)'",
        timetickinc: "Tick Mark Increments (NULL is default, enter a number to change, min=0",
		
		axislabelsize: "Axis Label Size (5-50)",
		ticklabelsize: "Axis Tick Mark Label Size (5-50)",


        help: {
            title: "Kaplan-Meier Estimation, Compare Groups",
            r_help: "help(ggsurvplot, package = 'survminer')",
            body: `
			See sample dataset in the install directory, the default location is at drive letter:\\program files\\BlueSky Statistics\\10\\Samples_and_Documents\\Datasets_and_Demos\\survival\\mockstudy_upd.RData. The variable Followup_time should be entered as the time to event or censor and the variable Event should be entered as the Event (1 = event, 0 = censor). The variable sex should be the group variable.<br/>
            This dataset is an updated version of the mockstudy dataset in the arsenal package.<br/><br/>			
            <b>Comparison of Kaplan-Meier survival curves</b>
            <br/>
            <br/>
            These are used to estimate the cumulative risk of not having some event (or conversely, having some event) over a length of time after the start of follow-up for that event (or time zero).  Subjects need to be at risk for the event starting at time zero.
            <br/>
            <br/>
            <b>Time:</b> Length of time to either an event, if the event occurred, or last follow-up for that event, if the event did not occur, for each subject
            <br/><br/>
            <b>Event:</b> Numeric indicator of whether or not the event occurred (1=event, 0=censor) for each subject
            <br/><br/>
            <b>Group:</b> Groups you want to compare
            <br/><br/>
            <b>Plot Type:</b> Whether you want to plot the probability of not having the event (survival) or having the event (failure)
            <br/><br/>
            <b>Estimate Table Including All Times:</b> Option to include a table that has the survival and event estimate probabilities for each observed time in the dataset
            <br/>
            <br/>
			<b>Estimate Table for Specific Times:</b> Option to include a table that has the survival estimate probabilities for a user-selected set of times.
			<br/><br/>
			<b>Specify times as time1, time2, time3, etc. or as seq(1,5,by=1):</b> These are the specific times that will be included in the table for specific times.  They can be specified individually with commas, or as a sequence of evenly-spaced values.
			<br/><br/>
            A table is output with the sample size, the number of subjects with the event, the median survival time (if defined), and the median follow-up time by group and overall.  The median follow-up time is an estimate of the "typical" follow-up time.  It is computed using the reverse Kaplan-Meier estimator, which treats true events as censored observations and true censored observations as events.  Thus, the "event" in this estimator is "following the subjects for as long as the study could".
            <br/>
            The survival curves are compared using multiple different methods, with the log-rank and Gehan-Breslow (Wilcoxon) being the most commonly reported.
            A table of Kaplan-Meier survival and event estimates is provided at each observed time in the dataset, with 95% confidence intervals. 
            <br/>
            <br/>
            <b>Required Packages:</b> survival, broom, survminer, dplyr, arsenal, ggthemes, RColorBrewer, ggsci
            <br/>
            <br/>
            <br/>
            <b>Style Options</b>
            <br/>
            <br/>
            <b>Plot Title:</b> Title of the plot; delete all text for no title
            <br/><br/>
			<b>Plot Title Size:</b> Size of the plot title.
			<br/><br/>			
            <b>Plot Theme:</b> General style of the plot
            <br/><br/>
            <b>Number at Risk:</b> Optionally, include a table for the number of subjects still at risk over time at the bottom of the plot.  <b>Risk Table Position</b> specifies whether you want the table outside the axes or inside the axes.  The <b>Risk Table Height</b> controls the proportion of the plotting area that the table will take up.  The <b>Include strata labels</b> option controls whether or not the strata labels are included.  If not, the strata will only be dfferentiated by color.  The table position and strata labels options are ignored when the risk table position is inside the axes.
			The <b>Risk Table Value Size</b> controls the size of the numbers at risk. The <b>Risk Table Title Size</b> controls the size of the title for the number at risk table.
			The <b>Risk Table Axis Label Size</b> controls the size of the axis labels. 
			The <b>Risk Table Tick Label Size</b> controls the size of the tick mark labels. If it's desired to remove all axes and gridlines 
			from the number at risk table, the <b>Remove Axes and Gridlines from Risk Table</b> option can be checked.  This will only include the numbers at risk in the table.           
            <br/><br/>
            <b>Legend options:</b>
            <br/>
            The <b>Position</b> option controls the location of the legend (top, bottom, left, right).  The <b>Title</b> is the title of the legend.  To remove the title, remove all text from the textbox.  <b>Value Labels</b> determines the labels by which the strata will be shown in the legend.  Important: If you want to change the default, they must be specified in the order of appearance in the legend.  Switching the labels does NOT change the color associated with each strata.
			The <b>Legend Labels Size</b> option controls the size of all text contained in the legend.
            <br/>
            <br/>
            <b>Line Options:</b>
            <br/>
            <b>Size</b> controls the thickness and <b>Color Palette</b> controls the colors of the plotted lines.  Choose one of the "gray" options to get a grayscale palette.  Color schemes mimicing scientific journals are also provided.  One can optionally include a 95% confidence interval for the estimates in either a <b>ribbon</b> (shaded area) or <b>step</b> (line) format.  <b>Transparency</b> controls how dark the ribbon is and is ignored when the step option is selected.  <b>Censored Times</b> (when subjects become no longer at risk for the event) can be indicated on the line with "+" symbols.  The size of the "+" symbols can be adjusted.  The <b>Indicate Median Survival</b> option will include horizontal or vertical lines at the time when 50% of the subjects are estimated to have had the event.  The median time is undefined if the survival curve does not cross 50%.
            <br/>
            <br/>
            <b>P-Value options:</b>
            <br/>
            One can optionally include the p-value comparing the curves on the plot.  The <b>Type</b> controls which p-value is desired, with the Log-Rank and Gehan-Breslow (Wilcoxon) being the most commonly reported.  The <b>Location</b> controls where the p-value will be placed on the plot, at the (x,y)=(time,proportion) position.  The <b>Size</b> determines the size of the plotted p-value.
            <br/>
            <br/>
            <br/>      
            <b>Axis Options</b>
            <br/>
            <br/>
            The <b>Label</b> option specifies the text label for the axis.  The <b>Axis Limits</b> specifies the minimum and maximum values of the axis.  The <b>Tick Mark Increments</b> option controls the spacing of the tick marks on the axis.  The increments on the time axis also control the times for the optional number at risk table.
            <br/>
            The survival axis <b>Scale</b> option specifies whether you want the estimates to be on a proportion (0-1) or percent (0-100) scale.
			<br/><br/>
			<b>Axis Label Size:</b>  This controls the size of both the survival and time axis label sizes.
			<br/><br/>
			<b>Axis Tick Mark Label Size:</b>  This controls the size of both the survival and time axis tick mark label sizes.			
`}
    }
}

class KaplanMeierEstimationCompareGroups extends baseModal {
    constructor() {
        var config = {
            id: "KaplanMeierEstimationCompareGroups",
            label: localization.en.title,
            modalType: "two",
            RCode: `
require(survival)
require(broom)
require(survminer)
require(dplyr)
require(arsenal)
require(ggthemes)
require(RColorBrewer)
require(ggsci)

fit <- survfit(Surv({{selected.timevar | safe}},{{selected.eventvar | safe}}) ~ {{selected.groupvar | safe}}, data={{dataset.name}})

# summaries

kmsummary <- tableby({{selected.groupvar | safe}}~Surv({{selected.timevar | safe}},{{selected.eventvar | safe}}),data={{dataset.name}},surv.stats=c("N","Nmiss","Nevents","medSurv","medTime"))
BSkyFormat(as.data.frame(summary(kmsummary,text=TRUE)),singleTableOutputHeader="Survival Summary: Surv({{selected.timevar | safe}},{{selected.eventvar | safe}}) by {{selected.groupvar | safe}}")

# p-values by different methods
lr_p <- surv_pvalue(fit,data={{dataset.name}},method="LR")
gb_p <- surv_pvalue(fit,data={{dataset.name}},method="GB")
tw_p <- surv_pvalue(fit,data={{dataset.name}},method="TW")
pp_p <- surv_pvalue(fit,data={{dataset.name}},method="PP")
mpp_p <- surv_pvalue(fit,data={{dataset.name}},method="mPP")
fh_p <- surv_pvalue(fit,data={{dataset.name}},method="FH")

# putting the p-values together and renaming for BlueSky formatting
all_p <- bind_rows(lr_p,gb_p,tw_p,pp_p,mpp_p,fh_p)
all_p <- all_p %>% dplyr::select(method,p.value=pval) 

BSkyFormat(all_p,singleTableOutputHeader="Survival Curve Comparisons")

# mean and median survival estimates

BSkyFormat(surv_median(fit),singleTableOutputHeader="Median Survival Times and 95% Confidence Intervals")

# KM estimates

kmest <- surv_summary(fit,data={{dataset.name}})
kmest <- kmest %>% dplyr::select(strata,time:std.err,lower,upper)

kmest <- mutate(kmest,
	prob.event=1-surv,
    prob.lower=1-upper,
    prob.upper=1-lower)

{{if (options.selected.allesttable=="TRUE")}}
BSkyFormat(kmest,singleTableOutputHeader="Kaplan-Meier Estimates and 95% Confidence Intervals")
{{/if}}

{{if ((options.selected.printspecest=="TRUE") & (options.selected.spectimes!=""))}}
cat("Kaplan-Meier Estimates and 95% Confidence Intervals\n")
summary(fit, times=c({{selected.spectimes | safe}}))
{{/if}}

# survival curve

km_plot <- ggsurvplot(fit,data={{dataset.name}},
	size={{selected.linesize | safe}},linetype=1,palette="{{selected.linecolor | safe}}",                                  
	conf.int={{selected.cichkbox | safe}},conf.int.style="{{selected.cistyle | safe}}",conf.int.alpha={{selected.citransparency | safe}},            
	legend="{{selected.legendpos | safe}}",legend.labs={{selected.legendlabels | safe}},legend.title="{{selected.legendtitle | safe}} ",font.legend={{selected.legendfontsize | safe}},                       
	censor={{selected.censorchkbox | safe}},censor.size={{selected.censorsize | safe}},                                        
	risk.table={{selected.natriskchkbox | safe}},risk.table.height={{selected.risktableprop | safe}},risk.table.pos="{{selected.risktablepos | safe}}",fontsize={{selected.risktablevaluesize | safe}},risk.table.y.text={{selected.risktabletext | safe}},       
	ggtheme={{selected.themedropdown | safe}},                                         
	fun={{selected.plottypegroup | safe}},                                                       
	xlim={{selected.timeaxislimits | safe}},break.time.by={{selected.timetickinc | safe}},                                 
	surv.scale="{{selected.scalebox | safe}}",ylim={{selected.survaxislimits | safe}},break.y.by={{selected.survtickinc | safe}},                   
	title="{{selected.titlebox | safe}}",font.main={{selected.plottitlesize | safe}},
	font.x={{selected.axislabelsize | safe}},xlab="{{selected.timeaxislabel | safe}}",font.y={{selected.axislabelsize | safe}},ylab="{{selected.survaxislabel | safe}}",font.tickslab={{selected.ticklabelsize | safe}},                   
	surv.median.line="{{selected.medsurvivalline | safe}}",
	pval={{selected.pvaluechkbox | safe}},log.rank.weights="{{selected.pvaluetype | safe}}",pval.coord={{selected.pvaluelocation | safe}},pval.size={{selected.pvaluesize | safe}})  

{{if ((options.selected.natriskchkbox=="TRUE") & (options.selected.risktabletext=="FALSE"))}}
# number at risk title size and axis label size
km_plot$table <- km_plot$table + theme(plot.title=element_text(size={{selected.risktabletitlesize | safe}}), axis.title.x.bottom=element_text(size={{selected.risktableaxislabelsize | safe}}), axis.title.y.left=element_text(size={{selected.risktableaxislabelsize | safe}}), axis.text.x.bottom=element_text(size={{selected.risktableticklabelsize}}))
{{/if}}

{{if ((options.selected.natriskchkbox=="TRUE") & (options.selected.risktabletext=="TRUE"))}}
# number at risk title size and axis label size
km_plot$table <- km_plot$table + theme(plot.title=element_text(size={{selected.risktabletitlesize | safe}}), axis.title.x.bottom=element_text(size={{selected.risktableaxislabelsize | safe}}), axis.title.y.left=element_text(size={{selected.risktableaxislabelsize | safe}}), axis.text.x.bottom=element_text(size={{selected.risktableticklabelsize}}), axis.text.y.left=element_text(size={{selected.risktableticklabelsize}}))
{{/if}}

{{if ((options.selected.natriskchkbox=="TRUE") & (options.selected.risktableclean=="TRUE"))}}
# removing axis and grid lines
km_plot$table <- km_plot$table + theme(axis.line=element_blank(), axis.ticks=element_blank(),
	axis.text.x.bottom=element_blank(), axis.title.x.bottom=element_blank(),
	panel.grid.major=element_blank(), panel.grid.minor=element_blank())
{{/if}}

km_plot
`
        }
        var objects = {
            content_var: {
                el: new srcVariableList(config, {
                    action: "move"
                })
            },
            timevar: {
                el: new dstVariable(config, {
                    label: localization.en.timevar,
                    no: "timevar",
                    filter: "Numeric|Scale",
                    extraction: "NoPrefix|UseComma",
                    required: true,
                }), r: ['{{ var | safe}}']
            },
            eventvar: {
                el: new dstVariable(config, {
                    label: localization.en.eventvar,
                    no: "eventvar",
                    filter: "Numeric|Scale",
                    required: true,
                    extraction: "NoPrefix|UseComma",
                }), r: ['{{ var | safe}}']
            },
            groupvar: {
                el: new dstVariable(config, {
                    label: localization.en.groupvar,
                    no: "groupvar",
                    filter: "String|Numeric|Logical|Ordinal|Nominal|Scale",
                    required: true,
                    extraction: "NoPrefix|UseComma",
                }), r: ['{{ var | safe}}']
            },            

            label1: { el: new labelVar(config, { label: localization.en.label1, style: "mt-2", h: 6 }) },
            survivalradio: {
                el: new radioButton(config, {
                    label: localization.en.survivalradio,
                    no: "plottypegroup",
                    increment: "survivalradio",
                    syntax: "NULL",
                    state: "checked",
                    extraction: "ValueAsIs"
                })
            },
            inciradio: {
                el: new radioButton(config, {
                    label: localization.en.inciradio,
                    no: "plottypegroup",
                    increment: "inciradio",
                    syntax: "'event'",
                    state: "",
                    extraction: "ValueAsIs"
                })
            }, 
            allesttable: {
                el: new checkbox(config, {
                    label: localization.en.allesttable,
                    no: "allesttable",
                    extraction: "Boolean",
                    style: "mt-3"
                })
            },
            printspecest: {
                el: new checkbox(config, {
                    label: localization.en.printspecest,
                    no: "printspecest",
                    extraction: "Boolean",
					newline: true
                })
            },
            spectimes: {
                el: new input(config, {
                    no: 'spectimes',
                    label: localization.en.spectimes,
					style: "ml-5 mb-3",
                    extraction: "TextAsIs",
                    allow_spaces:true,
                    type: "character",
                })
            },	
            titlebox: {
                el: new input(config, {
                    no: 'titlebox',
                    label: localization.en.titlebox,
                    placeholder: "Kaplan-Meier Estimates",
                    extraction: "TextAsIs",
                    value: "Kaplan-Meier Estimates",
                    allow_spaces:true,
                    type: "character",
                })
            },
			plottitlesize: {
				el: new inputSpinner(config,{
				no: 'plottitlesize',
				label: localization.en.plottitlesizelabel,
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
                    "theme_classic()", "theme_clean()", "theme_cleantable()", "theme_dark()", "theme_economist()", "theme_economist_white()",
                    "theme_excel()", "theme_excel_new()", "theme_few()",
                    "theme_fivethirtyeight()", "theme_foundation()", "theme_gdocs()", "theme_grey()",
                    "theme_hc()", "theme_igray()", "theme_light()", "theme_linedraw()", "theme_map()","theme_pander()",
                    "theme_par()", "theme_solarized()", "theme_solarized_2()",
                    "theme_solid()", "theme_stata()", "theme_survminer()", "theme_tufte()",
                    "theme_wsj()"],
                    default: "theme_survminer()"
                })
            },
            label2: { el: new labelVar(config, { label: localization.en.label2, style:"mt-3", h: 5 }) },
            natriskchkbox: {
                el: new checkbox(config, {
                    label: localization.en.natriskchkbox,
                    no: "natriskchkbox",
                    extraction: "Boolean",
                    style: "ml-3"
                })
            },
            risktableprop: {
                el: new advancedSlider(config, {
                    no: "risktableprop",
                    label: localization.en.risktableprop,
                    min: 0,
                    max: 1,
                    step: 0.05,
                    value: 0.25,
                    extraction: "NoPrefix|UseComma",
                    style: "ml-3 mt-3"
                })
            },   
            risktablepos: {
                el: new comboBox(config, {
                    no: 'risktablepos',
                    label: localization.en.risktablepos,
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["out", "in"],
                    default: "out",
                    style:"ml-3"
                })
            },   
            risktabletext: {
                el: new checkbox(config, {
                    label: localization.en.risktabletext,
                    no: "risktabletext",
                    extraction: "Boolean",
					state: "checked",
                    style:"ml-3"
                })
            },
			risktablevaluesize: {
				el: new inputSpinner(config,{
				no: 'risktablevaluesize',
				label: localization.en.risktablevaluesize,
				style: "mt-3 ml-1",
				min: 1,
				max: 15,
				step: 0.5,
				value: 4.5,
				extraction: "NoPrefix|UseComma"
				})
			},
			risktabletitlesize: {
				el: new inputSpinner(config,{
				no: 'risktabletitlesize',
				label: localization.en.risktabletitlesize,
				style: "ml-1",
				min: 5,
				max: 50,
				step: 1,
				value: 16,
				extraction: "NoPrefix|UseComma"
				})
			},
			risktableaxislabelsize: {
				el: new inputSpinner(config,{
				no: 'risktableaxislabelsize',
				label: localization.en.risktableaxislabelsize,
				style: "ml-1",
				min: 5,
				max: 50,
				step: 1,
				value: 16,
				extraction: "NoPrefix|UseComma"
				})
			},			
			risktableticklabelsize: {
				el: new inputSpinner(config,{
				no: 'risktableticklabelsize',
				label: localization.en.risktableticklabelsize,
				style: "ml-1 mb-3",
				min: 5,
				max: 50,
				step: 1,
				value: 12,
				extraction: "NoPrefix|UseComma"
				})
			},			
            risktableclean: {
                el: new checkbox(config, {
                    label: localization.en.risktableclean,
                    no: "risktableclean",
                    extraction: "Boolean",
                    newline: true,
                    style:"ml-3 mb-3"
                })
            },			
            label2b: { el: new labelVar(config, { label: localization.en.label2b, style:"mt-3", h: 5 }) },
            legendpos: {
                el: new comboBox(config, {
                    no: 'legendpos',
                    label: localization.en.legendpos,
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["top", "bottom", "left", "right"],
                    default: "top",
                    style:"ml-4"
                })
            },   
            legendtitle: {
                el: new input(config, {
                    no: 'legendtitle',
                    label: localization.en.legendtitle,
                    placeholder: "Strata",
                    ml: 4,
                    extraction: "TextAsIs",
                    value: "Strata",
                    allow_spaces:true,
                    type: "character",
                })
            },    
            legendlabels: {
                el: new input(config, {
                    no: 'legendlabels',
                    label: localization.en.legendlabels,
                    placeholder: "NULL",
                    ml: 4,
                    extraction: "TextAsIs",
                    value: "NULL",
                    allow_spaces:true,
                    type: "character",
                })
            },
			legendfontsize: {
				el: new inputSpinner(config,{
				no: 'legendfontsize',
				label: localization.en.legendfontsize,
				style: "ml-2",
				min: 5,
				max: 50,
				step: 1,
				value: 12,
				extraction: "NoPrefix|UseComma"
				})
			}, 			

            label3: { el: new labelVar(config, { label: localization.en.label3, style:"mt-3", h: 5 }) },
            linesize: {
                el: new advancedSlider(config, {
                    no: "linesize",
                    label: localization.en.linesize,
					style: "ml-5",
                    min: 0,
                    max: 5,
                    step: 0.5,
                    value: 1,
                    extraction: "NoPrefix|UseComma",
                    style:"ml-3"
                })
            },             
            linecolor: {
                el: new comboBox(config, {
                    no: 'linecolor',
                    label: localization.en.linecolor,
					style: "ml-5",
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["hue", "grey", "Greys", "Set1", "Set2", "Dark2", "npg", "aaas", "nejm", "lancet", "jama", "jco"],
                    default: "hue",
                    style:"ml-3"
                })
            },   
            label4: { el: new labelVar(config, { label: localization.en.label4, style:"mt-4 ml-3", h: 5 }) },
            cichkbox: {
                el: new checkbox(config, {
                    label: localization.en.cichkbox,
                    no: "cichkbox",
                    extraction: "Boolean",
                    newline: true,
                    style:"ml-5"
                })
            },            
            cistyle: {
                el: new comboBox(config, {
                    no: 'cistyle',
                    label: localization.en.cistyle,
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["ribbon", "step"],
                    default: "ribbon",
                    style:"ml-5"
                })
            },
            citransparency: {
                el: new advancedSlider(config, {
                    no: "citransparency",
                    label: localization.en.citransparency,
                    min: 0,
                    max: 1,
                    step: 0.1,
                    value: 0.5,
                    extraction: "NoPrefix|UseComma",
                    style:"ml-5"
                })
            },   
            label5: { el: new labelVar(config, { label: localization.en.label5, style:"mt-4 ml-3", h: 5 }) },
            censorchkbox: {
                el: new checkbox(config, {
                    label: localization.en.censorchkbox,
                    no: "censorchkbox",
                    extraction: "Boolean",
                    style:"ml-5"
                })
            },   
            censorsize: {
                el: new advancedSlider(config, {
                    no: "censorsize",
                    label: localization.en.censorsize,
                    min: 0,
                    max: 10,
                    step: 0.5,
                    value: 4.5,
                    extraction: "NoPrefix|UseComma",
                    style:"ml-5"
                })
            }, 
            medsurvivalline: {
                el: new comboBox(config, {
                    no: 'medsurvivalline',
                    label: localization.en.medsurvivalline,
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["none", "hv", "h", "v"],
                    default: "none",
                    style:"ml-4"
                })
            }, 
            label5b: { el: new labelVar(config, { label: localization.en.label5b, h: 5 }) },
            pvaluechkbox: {
                el: new checkbox(config, {
                    label: localization.en.pvaluechkbox,
                    no: "pvaluechkbox",
                    extraction: "Boolean",
                    style:"ml-3"
                })
            },  
            label5c: { el: new labelVar(config, { label: localization.en.label5c, style:"mt-3 ml-3", h: 5 }) },
            logrank: {
                el: new radioButton(config, {
                    label: localization.en.logrank,
                    no: "pvaluetype",
                    increment: "logrank",
                    syntax: "1",
                    state: "checked",
                    extraction: "ValueAsIs",
                    style:"ml-3"
                })
            }, 
            gehanbreslow: {
                el: new radioButton(config, {
                    label: localization.en.gehanbreslow,
                    no: "pvaluetype",
                    increment: "gehanbreslow",
                    syntax: "n",
                    state: "",
                    extraction: "ValueAsIs",
                    style:"ml-3"
                })
            },
            taroneware: {
                el: new radioButton(config, {
                    label: localization.en.taroneware,
                    no: "pvaluetype",
                    increment: "taroneware",
                    syntax: "sqrtN",
                    state: "",
                    extraction: "ValueAsIs",
                    style:"ml-3"
                })
            },
            petopeto: {
                el: new radioButton(config, {
                    label: localization.en.petopeto,
                    no: "pvaluetype",
                    increment: "petopeto",
                    syntax: "S1",
                    state: "",
                    extraction: "ValueAsIs",
                    style:"ml-3"
                })
            },
            modpetopeto: {
                el: new radioButton(config, {
                    label: localization.en.modpetopeto,
                    no: "pvaluetype",
                    increment: "modpetopeto",
                    syntax: "S2",
                    state: "",
                    extraction: "ValueAsIs",
                    style:"ml-3"
                })
            },
            flemharr: {
                el: new radioButton(config, {
                    label: localization.en.flemharr,
                    no: "pvaluetype",
                    increment: "flemharr",
                    syntax: "FH",
                    state: "",
                    extraction: "ValueAsIs",
                    style:"ml-3"
                })
            },    
            pvaluelocation: {
                el: new input(config, {
                    no: 'pvaluelocation',
                    label: localization.en.pvaluelocation,
					width: "w-25",
                    placeholder: "c(0,.5)",
                    ml: 4,
                    extraction: "TextAsIs",
                    value: "c(0,.5)",
                    allow_spaces:true,
                    type: "character",
                })
            },              
            pvaluesize: {
                el: new advancedSlider(config, {
                    no: "pvaluesize",
                    label: localization.en.pvaluesize,
                    min: 0,
                    max: 10,
                    step: 1,
                    value: 5,
                    extraction: "NoPrefix|UseComma",
                    style:"ml-4"
                })
            }, 


            label6: { el: new labelVar(config, { label: localization.en.label6, h: 5 }) },
            survaxislabel: {
                el: new input(config, {
                    no: 'survaxislabel',
                    label: localization.en.survaxislabel,
                    placeholder: "Probability",
                    ml: 4,
                    extraction: "TextAsIs",
                    value: "Probability",
                    allow_spaces:true,
                    type: "character",
                })
            },            
            label7: { el: new labelVar(config, { label: localization.en.label7, style: "mt-3 ml-4", h: 6 }) },
            defbutton: {
                el: new radioButton(config, {
                    label: localization.en.defbutton,
                    no: "scalebox",
                    increment: "defbutton",
                    syntax: "default",
                    state: "checked",
                    extraction: "ValueAsIs",
                    style:"ml-4"
                })
            },
            pctbutton: {
                el: new radioButton(config, {
                    label: localization.en.pctbutton,
                    no: "scalebox",
                    increment: "pctbutton",
                    syntax: "percent",
                    state: "",
                    extraction: "ValueAsIs",
                    style:"ml-4"
                })
            },   
            survaxislimits: {
                el: new input(config, {
                    no: 'survaxislimits',
                    label: localization.en.survaxislimits,
					width: "w-25",
                    placeholder: "c(0,1)",
                    style:"ml-4 mt-3",
                    extraction: "TextAsIs",
                    value: "c(0,1)",
                    allow_spaces:true,
                    Type: "character"
                })
            }, 
            survtickinc: {
                el: new advancedSlider(config, {
                    no: "survtickinc",
                    label: localization.en.survtickinc,
                    min: 0,
                    max: 1,
                    step: 0.01,
                    value: 0.1,
                    extraction: "NoPrefix|UseComma",
                    style:"ml-4 mt-3"
                })
            }, 
            label8: { el: new labelVar(config, { label: localization.en.label8, h: 5 }) },
            timeaxislabel: {
                el: new input(config, {
                    no: 'timeaxislabel',
                    label: localization.en.timeaxislabel,
                    placeholder: "Time",
                    style:"ml-4 mt-3",
                    extraction: "TextAsIs",
                    value: "Time",
                    allow_spaces:true,
                    type: "character",
                })
            }, 

            timeaxislimits: {
                el: new input(config, {
                    no: 'timeaxislimits',
                    label: localization.en.timeaxislimits,
					width: "w-25",
                    placeholder: "NULL",
                    style:"ml-4 mt-3",
                    extraction: "TextAsIs",
                    value: "NULL",
                    allow_spaces:true,
                    Type: "character"
                })
            }, 
            timetickinc: {
                el: new input(config, {
                    no: 'timetickinc',
                    label: localization.en.timetickinc,
					width: "w-25",
                    placeholder: "NULL",
                    style:"ml-4 mt-3",
                    extraction: "TextAsIs",
                    value: "NULL",
                    allow_spaces:true,
                    Type: "character"
                })
            },
			axislabelsize: {
				el: new inputSpinner(config,{
				no: 'axislabelsize',
				label: localization.en.axislabelsize,
				style: "mt-5",
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
				min: 5,
				max: 50,
				step: 1,
				value: 12,
				extraction: "NoPrefix|UseComma"
				})
			}, 			
            label12: {
                el: new labelVar(config, {
                  label: localization.en.label12, 
                  style: "mt-3", 
                  h:5
                })
              }, 			

        }
        var styleoptions = {
            el: new optionsVar(config, {
                no: "styleoptions",
                name: localization.en.styleoptions,
                content: [
                    objects.titlebox.el,
					objects.plottitlesize.el,
                    objects.themedropdown.el,
                    objects.label2.el,
                    objects.natriskchkbox.el,
                    objects.risktableprop.el,
                    objects.risktablepos.el,
                    objects.risktabletext.el,
					objects.risktablevaluesize.el,
					objects.risktabletitlesize.el,
					objects.risktableaxislabelsize.el,
					objects.risktableticklabelsize.el,
					objects.risktableclean.el,
                    objects.label2b.el,
                    objects.legendpos.el,
                    objects.legendtitle.el,
                    objects.legendlabels.el,
					objects.legendfontsize.el,

                    objects.label3.el,
                    objects.linesize.el,
                    objects.linecolor.el,
                    objects.label4.el,
                    objects.cichkbox.el,
                    objects.cistyle.el,
                    objects.citransparency.el,
                    objects.label5.el,
                    objects.censorchkbox.el,
                    objects.censorsize.el,
                    objects.medsurvivalline.el,

                    objects.label5b.el,
                    objects.pvaluechkbox.el,
                    objects.label5c.el,
                    objects.logrank.el,
                    objects.gehanbreslow.el,
                    objects.taroneware.el,
                    objects.petopeto.el,
                    objects.modpetopeto.el,
                    objects.flemharr.el,
                    objects.pvaluelocation.el,
                    objects.pvaluesize.el,
                ]
            })
        };
        var axisoptions = {
            el: new optionsVar(config, {
                no: "axisoptions",
                name: localization.en.axisoptions,
                content: [
                    objects.label6.el,
                    objects.survaxislabel.el,
                    objects.label7.el,
                    objects.defbutton.el,
                    objects.pctbutton.el,
                    objects.survaxislimits.el,
                    objects.survtickinc.el,
                    objects.label8.el,
                    objects.timeaxislabel.el,
                    objects.timeaxislimits.el,
                    objects.timetickinc.el,
					objects.axislabelsize.el,
					objects.ticklabelsize.el

                ]
            })
        };        
        const content = {
			head: [objects.label12.el.content],
            left: [objects.content_var.el.content],
            right: [objects.timevar.el.content,
            objects.eventvar.el.content, 
            objects.groupvar.el.content, 
            objects.label1.el.content,
            objects.survivalradio.el.content,
            objects.inciradio.el.content,
            objects.allesttable.el.content,
			objects.printspecest.el.content,
			objects.spectimes.el.content
            ],
            bottom: [styleoptions.el.content,
            axisoptions.el.content],
            nav: {
                name: localization.en.navigation,
                icon: "icon-kaplanc",
                modal: config.id
            }
        }
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new KaplanMeierEstimationCompareGroups().render()