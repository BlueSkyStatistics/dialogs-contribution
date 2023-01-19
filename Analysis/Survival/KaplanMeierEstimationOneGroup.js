
var localization = {
    en: {
        title: "Kaplan-Meier Estimation, One Group",
        navigation: "Kaplan-Meier Estimation, One Group",
        timevar: "Time to event or censor",
        eventvar: "Event (1 = event, 0 = censor)",
        label1: "Plot Type",
        survivalradio:"Survival",
        inciradio: "Failure",
        printallest: "Estimate Table Including All Times",
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
        risktableprop: "Risk Table Height (0-1)",
        risktablepos: "Risk Table Position",
		risktablevaluesize: "Risk Table Value Size (1-15)",
		risktabletitlesize: "Risk Table Title Size (5-50)",
		risktableaxislabelsize: "Risk Table Axis Label Size (5-50)",
		risktableticklabelsize: "Risk Table Tick Label Size (5-50)",
		risktableclean: "Remove Axes and Gridlines from Risk Table",

        label3: "Line Options",
        linesize: "Size (0-5)",
        linecolor: "Color",
        label4 : "Confidence Interval",
        cichkbox : "include 95% CI",
        cistyle : "Style",
        citransparency : "Transparency (0-1)",

        label5: "Censored Times",
		censorchkbox:"Include Censored Times",
		censorsize : "Size (0-10)",
		medsurvivalline:"Indicate Median Survival (h=horizontal, v=vertical)",
		
		label6: "Survival Axis",
		survaxislabel:"Label",
		axislabelsize: "Axis Label Size (5-50)",		
		label7: "Scale",
		defbutton:"proportion",
		pctbutton:"percent",
		survaxislimits:"Axis limits on proportion scale (0-1) - enter 'c(min, max)'",
		survtickinc : "Tick Mark Increments (0-1)",
		
        label8: "Time Axis",
        timeaxislabel: "Label",
        timeaxislimits: "Axis Limits (NULL is default, enter 'c(min,max)' to change e.g. 'c(0,20) )'",
        timetickinc: "Tick Mark Increments (NULL is default, enter a number to change, min=0)",
		
		ticklabelsize: "Axis Tick Mark Label Size (5-50)",



        help: {
            title: "Kaplan-Meier Estimation, One Group",
            r_help: "help(ggsurvplot, package = 'survminer')",
            body: `
			See sample dataset in the install directory, the default location is at drive letter:\\program files\\BlueSky Statistics\\10\\Samples_and_Documents\\Datasets_and_Demos\\Survival\\mockstudy_upd.RData. The variable Followup_time should be entered as the time to event or censor and the variable Event should be entered as the Event (1 = event, 0 = censor).<br/>
            This dataset is an updated version of the mockstudy dataset in the arsenal package.<br/><br/>		
            <b>Kaplan-Meier survival curves</b>
            <br/>
            <br/>
            These are used to estimate the cumulative risk of not having some event (or conversely, having some event) over a length of time after the start of follow-up for that event (or time zero).  Subjects need to be at risk for the event starting at time zero.
            <br/>
            <br/>
            <b>Time:</b> Length of time to either an event, if the event occurred, or last follow-up for that event, if the event did not occur, for each subject
            <br/><br/>
            <b>Event:</b> Numeric indicator of whether or not the event occurred (1=event, 0=censor) for each subject
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
            Tables are output with the sample size, the number of subjects with the event, the median survival time (if defined), the restricted mean survival time, and the median follow-up time.  The median follow-up time is computed using the reverse Kaplan-Meier estimator, which treats true events as censored observations and true censored observations as events.  Thus, the "event" in this estimator is "following the subjects for as long as the study could".
            <br/>
            A table of Kaplan-Meier survival and event estimates is provided at each observed time in the dataset, with 95% confidence intervals. 
            <br/>
            <br/>
            <b>Required Packages:</b> survival, broom, survminer, dplyr, arsenal, ggthemes 
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
            <b>Include Number at Risk:</b> Optionally, include a table for the number of subjects still at risk over time at the bottom of the plot.  <b>Risk Table Position</b> specifies whether you want the table outside the axes or inside the axes.  The <b>Risk Table Height</b> controls the proportion of the plotting area that the table will take up.  This option is ignored when the risk table position is inside the axes. 
			The <b>Risk Table Value Size</b> controls the size of the numbers at risk. The <b>Risk Table Title Size</b> controls the size of the title for the number at risk table.
			The <b>Risk Table Axis Label Size</b> controls the size of the axis labels.
			The <b>Risk Table Tick Label Size</b> controls the size of the tick mark labels for the times in the number at risk table. If it's desired to remove all axes and gridlines 
			from the number at risk table, the <b>Remove Axes and Gridlines from Risk Table</b> option can be checked.  This will only include the numbers at risk in the table.
            <br/>
            <br/>
            <b>Line Options:</b>
            <b>Size</b> controls the thickness and <b>Color</b> controls the color of the plotted line.  One can optionally include a 95% confidence interval for the estimates in either a <b>ribbon</b> (shaded area) or <b>step</b> (line) format.  <b>Transparency</b> controls how dark the ribbon is and is ignored when the step option is selected.  <b>Censored Times</b> (when subjects become no longer at risk for the event) can be indicated on the line with "+" symbols.  The size of the "+" symbols can be adjusted.  The <b>Indicate Median Survival</b> option will include horizontal or vertical lines at the time when 50% of the subjects are estimated to have had the event.  The median time is undefined if the survival curve does not cross 50%.
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

class KaplanMeierEstimationOneGroup extends baseModal {
    constructor() {
        var config = {
            id: "KaplanMeierEstimationOneGroup",
            label: localization.en.title,
            modalType: "two",
            RCode: `
require(survival)
require(broom)
require(survminer)
require(dplyr)
require(arsenal)
require(ggthemes)

fit <- survfit(Surv({{selected.timevar | safe}},{{selected.eventvar | safe}}) ~ 1, data={{dataset.name}})

# summaries

kmsummary <- tableby(~Surv({{selected.timevar | safe}},{{selected.eventvar | safe}}),data={{dataset.name}},surv.stats=c("N","Nmiss","Nevents","medSurv","medTime"))
BSkyFormat(as.data.frame(summary(kmsummary,text=TRUE)),singleTableOutputHeader="Survival Summary: Surv({{selected.timevar | safe}},{{selected.eventvar | safe}})")

# mean and median survival estimates

meanmed <- as.data.frame(glance(fit))
meanmed <- meanmed %>% dplyr::select(rmean:conf.high)
BSkyFormat(meanmed,singleTableOutputHeader="Restricted Mean and Median Survival Times")

# KM estimates

kmest <- surv_summary(fit,data={{dataset.name}})
kmest <- kmest %>% dplyr::select(time:std.err,lower,upper)

kmest <- mutate(kmest,
                prob.event=1-surv,
                prob.lower=1-upper,
                prob.upper=1-lower)

{{if (options.selected.printallest=="TRUE")}}
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
	legend="none",legend.labs=" ",legend.title=" ",                       
	censor={{selected.censorchkbox | safe}},censor.size={{selected.censorsize | safe}},                                        
	risk.table={{selected.natriskchkbox | safe}},risk.table.height={{selected.risktableprop | safe}},risk.table.pos="{{selected.risktablepos | safe}}",fontsize={{selected.risktablevaluesize | safe}},        
	ggtheme={{selected.themedropdown | safe}},                                         
	fun={{selected.plottypegroup | safe}},                                                       
	xlim={{selected.timeaxislimits | safe}},break.time.by={{selected.timetickinc | safe}},                                 
	surv.scale="{{selected.scalebox | safe}}",ylim={{selected.survaxislimits | safe}},break.y.by={{selected.survtickinc | safe}},                   
	title="{{selected.titlebox | safe}}",font.main={{selected.plottitlesize | safe}},
	font.x={{selected.axislabelsize | safe}},xlab="{{selected.timeaxislabel | safe}}",font.y={{selected.axislabelsize | safe}},ylab="{{selected.survaxislabel | safe}}",font.tickslab={{selected.ticklabelsize | safe}},                   
	surv.median.line="{{selected.medsurvivalline | safe}}")

{{if (options.selected.natriskchkbox=="TRUE")}}
# number at risk title size and axis label size
km_plot$table <- km_plot$table + theme(plot.title=element_text(size={{selected.risktabletitlesize | safe}}), axis.title.x.bottom=element_text(size={{selected.risktableaxislabelsize | safe}}), axis.text.x=element_text(size={{selected.risktableticklabelsize}}))
{{/if}}

{{if ((options.selected.natriskchkbox=="TRUE") & (options.selected.risktableclean=="TRUE"))}}
# removing axis and grid lines
km_plot$table <- km_plot$table + theme(axis.line=element_blank(), axis.ticks=element_blank(),
	axis.text.x=element_blank(), axis.title.x.bottom=element_blank(),
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
            printallest: {
                el: new checkbox(config, {
                    label: localization.en.printallest,
                    no: "printallest",
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
					style: "ml-5",
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
            label3: { el: new labelVar(config, { label: localization.en.label3, h: 5 }) },
            linesize: {
                el: new advancedSlider(config, {
                    no: "linesize",
                    label: localization.en.linesize,
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
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["black", "blue", "red", "green", "purple", "cyan", "magenta"],
                    default: "black",
                    style:"ml-3"
                })
            },   
            label4: { el: new labelVar(config, { label: localization.en.label4, style:"ml-3 mt-3", h: 5 }) },
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
            label5: { el: new labelVar(config, { label: localization.en.label5, style:"ml-3", h: 5 }) },
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
                    step: 0.05,
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
                    style:"ml-3"
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
                    placeholder: "c(0,1)",
                    style:"ml-4 mt-3",
					width: "w-25",
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
                    placeholder: "NULL",
					required: true,
                    style:"ml-4 mt-3",
					width: "w-25",
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
                    placeholder: "NULL",
					required: true,
                    style:"ml-4 mt-3",
					width: "w-25",
                    extraction: "TextAsIs",
                    value: "NULL",
                    allow_spaces:true,
                    Type: "character"
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
					objects.risktablevaluesize.el,
					objects.risktabletitlesize.el,
					objects.risktableaxislabelsize.el,
					objects.risktableticklabelsize.el,
					objects.risktableclean.el,
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
            objects.label1.el.content,
            objects.survivalradio.el.content,
            objects.inciradio.el.content,
            objects.printallest.el.content,
			objects.printspecest.el.content,
			objects.spectimes.el.content
            ],
            bottom: [styleoptions.el.content,
            axisoptions.el.content],
            nav: {
                name: localization.en.navigation,
                icon: "icon-kaplan1",
                modal: config.id
            }
        }
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new KaplanMeierEstimationOneGroup().render()