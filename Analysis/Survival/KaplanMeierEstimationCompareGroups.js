/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */




class KaplanMeierEstimationCompareGroups extends baseModal {
    static dialogId = 'KaplanMeierEstimationCompareGroups'
    static t = baseModal.makeT(KaplanMeierEstimationCompareGroups.dialogId)

    constructor() {
        var config = {
            id: KaplanMeierEstimationCompareGroups.dialogId,
            label: KaplanMeierEstimationCompareGroups.t('title'),
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

kmsummary <- tableby({{selected.groupvar | safe}}~Surv({{selected.timevar | safe}},{{selected.eventvar | safe}}),data={{dataset.name}},surv.stats=c("N","Nmiss","Nevents","medSurv","medTime"), digits.p = 4)
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
                    label: KaplanMeierEstimationCompareGroups.t('timevar'),
                    no: "timevar",
                    filter: "Numeric|Scale",
                    extraction: "NoPrefix|UseComma",
                    required: true,
                }), r: ['{{ var | safe}}']
            },
            eventvar: {
                el: new dstVariable(config, {
                    label: KaplanMeierEstimationCompareGroups.t('eventvar'),
                    no: "eventvar",
                    filter: "Numeric|Scale",
                    required: true,
                    extraction: "NoPrefix|UseComma",
                }), r: ['{{ var | safe}}']
            },
            groupvar: {
                el: new dstVariable(config, {
                    label: KaplanMeierEstimationCompareGroups.t('groupvar'),
                    no: "groupvar",
                    filter: "String|Numeric|Logical|Ordinal|Nominal|Scale",
                    required: true,
                    extraction: "NoPrefix|UseComma",
                }), r: ['{{ var | safe}}']
            },            

            label1: { el: new labelVar(config, { label: KaplanMeierEstimationCompareGroups.t('label1'), style: "mt-2", h: 6 }) },
            survivalradio: {
                el: new radioButton(config, {
                    label: KaplanMeierEstimationCompareGroups.t('survivalradio'),
                    no: "plottypegroup",
                    increment: "survivalradio",
                    syntax: "NULL",
                    state: "checked",
                    extraction: "ValueAsIs"
                })
            },
            inciradio: {
                el: new radioButton(config, {
                    label: KaplanMeierEstimationCompareGroups.t('inciradio'),
                    no: "plottypegroup",
                    increment: "inciradio",
                    syntax: "'event'",
                    state: "",
                    extraction: "ValueAsIs"
                })
            }, 
            allesttable: {
                el: new checkbox(config, {
                    label: KaplanMeierEstimationCompareGroups.t('allesttable'),
                    no: "allesttable",
                    extraction: "Boolean",
                    style: "mt-3"
                })
            },
            printspecest: {
                el: new checkbox(config, {
                    label: KaplanMeierEstimationCompareGroups.t('printspecest'),
                    no: "printspecest",
                    extraction: "Boolean",
					newline: true
                })
            },
            spectimes: {
                el: new input(config, {
                    no: 'spectimes',
                    label: KaplanMeierEstimationCompareGroups.t('spectimes'),
			        style: "ml-5 mb-3",
                    extraction: "TextAsIs",
                    allow_spaces:true,
                    type: "character"
                })
            },	
            titlebox: {
                el: new input(config, {
                    no: 'titlebox',
                    label: KaplanMeierEstimationCompareGroups.t('titlebox'),
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
				label: KaplanMeierEstimationCompareGroups.t('plottitlesizelabel'),
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
                    label: KaplanMeierEstimationCompareGroups.t('themedropdown'),
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
            label2: { el: new labelVar(config, { label: KaplanMeierEstimationCompareGroups.t('label2'), style:"mt-3", h: 5 }) },
            natriskchkbox: {
                el: new checkbox(config, {
                    label: KaplanMeierEstimationCompareGroups.t('natriskchkbox'),
                    no: "natriskchkbox",
                    extraction: "Boolean",
                    style: "ml-3"
                })
            },
            risktableprop: {
                el: new advancedSlider(config, {
                    no: "risktableprop",
                    label: KaplanMeierEstimationCompareGroups.t('risktableprop'),
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
                    label: KaplanMeierEstimationCompareGroups.t('risktablepos'),
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["out", "in"],
                    default: "out",
                    style:"ml-3"
                })
            },   
            risktabletext: {
                el: new checkbox(config, {
                    label: KaplanMeierEstimationCompareGroups.t('risktabletext'),
                    no: "risktabletext",
                    extraction: "Boolean",
					state: "checked",
                    style:"ml-3"
                })
            },
			risktablevaluesize: {
				el: new inputSpinner(config,{
				no: 'risktablevaluesize',
				label: KaplanMeierEstimationCompareGroups.t('risktablevaluesize'),
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
				label: KaplanMeierEstimationCompareGroups.t('risktabletitlesize'),
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
				label: KaplanMeierEstimationCompareGroups.t('risktableaxislabelsize'),
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
				label: KaplanMeierEstimationCompareGroups.t('risktableticklabelsize'),
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
                    label: KaplanMeierEstimationCompareGroups.t('risktableclean'),
                    no: "risktableclean",
                    extraction: "Boolean",
                    newline: true,
                    style:"ml-3 mb-3"
                })
            },			
            label2b: { el: new labelVar(config, { label: KaplanMeierEstimationCompareGroups.t('label2b'), style:"mt-3", h: 5 }) },
            legendpos: {
                el: new comboBox(config, {
                    no: 'legendpos',
                    label: KaplanMeierEstimationCompareGroups.t('legendpos'),
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
                    label: KaplanMeierEstimationCompareGroups.t('legendtitle'),
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
                    label: KaplanMeierEstimationCompareGroups.t('legendlabels'),
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
				label: KaplanMeierEstimationCompareGroups.t('legendfontsize'),
				style: "ml-2",
				min: 5,
				max: 50,
				step: 1,
				value: 12,
				extraction: "NoPrefix|UseComma"
				})
			}, 			

            label3: { el: new labelVar(config, { label: KaplanMeierEstimationCompareGroups.t('label3'), style:"mt-3", h: 5 }) },
            linesize: {
                el: new advancedSlider(config, {
                    no: "linesize",
                    label: KaplanMeierEstimationCompareGroups.t('linesize'),
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
                    label: KaplanMeierEstimationCompareGroups.t('linecolor'),
					style: "ml-5",
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["hue", "grey", "Greys", "Set1", "Set2", "Dark2", "npg", "aaas", "nejm", "lancet", "jama", "jco"],
                    default: "hue",
                    style:"ml-3"
                })
            },   
            label4: { el: new labelVar(config, { label: KaplanMeierEstimationCompareGroups.t('label4'), style:"mt-4 ml-3", h: 5 }) },
            cichkbox: {
                el: new checkbox(config, {
                    label: KaplanMeierEstimationCompareGroups.t('cichkbox'),
                    no: "cichkbox",
                    extraction: "Boolean",
                    newline: true,
                    style:"ml-5"
                })
            },            
            cistyle: {
                el: new comboBox(config, {
                    no: 'cistyle',
                    label: KaplanMeierEstimationCompareGroups.t('cistyle'),
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
                    label: KaplanMeierEstimationCompareGroups.t('citransparency'),
                    min: 0,
                    max: 1,
                    step: 0.1,
                    value: 0.5,
                    extraction: "NoPrefix|UseComma",
                    style:"ml-5"
                })
            },   
            label5: { el: new labelVar(config, { label: KaplanMeierEstimationCompareGroups.t('label5'), style:"mt-4 ml-3", h: 5 }) },
            censorchkbox: {
                el: new checkbox(config, {
                    label: KaplanMeierEstimationCompareGroups.t('censorchkbox'),
                    no: "censorchkbox",
                    extraction: "Boolean",
                    style:"ml-5"
                })
            },   
            censorsize: {
                el: new advancedSlider(config, {
                    no: "censorsize",
                    label: KaplanMeierEstimationCompareGroups.t('censorsize'),
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
                    label: KaplanMeierEstimationCompareGroups.t('medsurvivalline'),
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["none", "hv", "h", "v"],
                    default: "none",
                    style:"ml-4"
                })
            }, 
            label5b: { el: new labelVar(config, { label: KaplanMeierEstimationCompareGroups.t('label5b'), h: 5 }) },
            pvaluechkbox: {
                el: new checkbox(config, {
                    label: KaplanMeierEstimationCompareGroups.t('pvaluechkbox'),
                    no: "pvaluechkbox",
                    extraction: "Boolean",
                    style:"ml-3"
                })
            },  
            label5c: { el: new labelVar(config, { label: KaplanMeierEstimationCompareGroups.t('label5c'), style:"mt-3 ml-3", h: 5 }) },
            logrank: {
                el: new radioButton(config, {
                    label: KaplanMeierEstimationCompareGroups.t('logrank'),
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
                    label: KaplanMeierEstimationCompareGroups.t('gehanbreslow'),
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
                    label: KaplanMeierEstimationCompareGroups.t('taroneware'),
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
                    label: KaplanMeierEstimationCompareGroups.t('petopeto'),
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
                    label: KaplanMeierEstimationCompareGroups.t('modpetopeto'),
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
                    label: KaplanMeierEstimationCompareGroups.t('flemharr'),
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
                    label: KaplanMeierEstimationCompareGroups.t('pvaluelocation'),
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
                    label: KaplanMeierEstimationCompareGroups.t('pvaluesize'),
                    min: 0,
                    max: 10,
                    step: 1,
                    value: 5,
                    extraction: "NoPrefix|UseComma",
                    style:"ml-4"
                })
            }, 


            label6: { el: new labelVar(config, { label: KaplanMeierEstimationCompareGroups.t('label6'), h: 5 }) },
            survaxislabel: {
                el: new input(config, {
                    no: 'survaxislabel',
                    label: KaplanMeierEstimationCompareGroups.t('survaxislabel'),
                    placeholder: "Probability",
                    ml: 4,
                    extraction: "TextAsIs",
                    value: "Probability",
                    allow_spaces:true,
                    type: "character",
                })
            },            
            label7: { el: new labelVar(config, { label: KaplanMeierEstimationCompareGroups.t('label7'), style: "mt-3 ml-4", h: 6 }) },
            defbutton: {
                el: new radioButton(config, {
                    label: KaplanMeierEstimationCompareGroups.t('defbutton'),
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
                    label: KaplanMeierEstimationCompareGroups.t('pctbutton'),
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
                    label: KaplanMeierEstimationCompareGroups.t('survaxislimits'),
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
                    label: KaplanMeierEstimationCompareGroups.t('survtickinc'),
                    min: 0,
                    max: 1,
                    step: 0.01,
                    value: 0.1,
                    extraction: "NoPrefix|UseComma",
                    style:"ml-4 mt-3"
                })
            }, 
            label8: { el: new labelVar(config, { label: KaplanMeierEstimationCompareGroups.t('label8'), h: 5 }) },
            timeaxislabel: {
                el: new input(config, {
                    no: 'timeaxislabel',
                    label: KaplanMeierEstimationCompareGroups.t('timeaxislabel'),
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
                    label: KaplanMeierEstimationCompareGroups.t('timeaxislimits'),
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
                    label: KaplanMeierEstimationCompareGroups.t('timetickinc'),
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
				label: KaplanMeierEstimationCompareGroups.t('axislabelsize'),
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
				label: KaplanMeierEstimationCompareGroups.t('ticklabelsize'),
				min: 5,
				max: 50,
				step: 1,
				value: 12,
				extraction: "NoPrefix|UseComma"
				})
			}, 			
            label12: {
                el: new labelVar(config, {
                  label: KaplanMeierEstimationCompareGroups.t('label12'), 
                  style: "mt-3", 
                  h:5
                })
              }, 			

        }
        var styleoptions = {
            el: new optionsVar(config, {
                no: "styleoptions",
                name: KaplanMeierEstimationCompareGroups.t('styleoptions'),
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
                name: KaplanMeierEstimationCompareGroups.t('axisoptions'),
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
                name: KaplanMeierEstimationCompareGroups.t('navigation'),
                icon: "icon-kaplanc",
                modal: config.id
            }
        }
        super(config, objects, content);
        
        this.help = {
            title: KaplanMeierEstimationCompareGroups.t('help.title'),
            r_help: KaplanMeierEstimationCompareGroups.t('help.r_help'), //r_help: "help(data,package='utils')",
            body: KaplanMeierEstimationCompareGroups.t('help.body')
        }
;
    }
}

module.exports = {
    render: () => new KaplanMeierEstimationCompareGroups().render()
}

