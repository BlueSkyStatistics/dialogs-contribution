/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */




class KaplanMeierEstimationOneGroup extends baseModal {
    static dialogId = 'KaplanMeierEstimationOneGroup'
    static t = baseModal.makeT(KaplanMeierEstimationOneGroup.dialogId)

    constructor() {
        var config = {
            id: KaplanMeierEstimationOneGroup.dialogId,
            label: KaplanMeierEstimationOneGroup.t('title'),
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

kmest <- dplyr::mutate(kmest,
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
                    label: KaplanMeierEstimationOneGroup.t('timevar'),
                    no: "timevar",
                    filter: "Numeric|Scale",
                    extraction: "NoPrefix|UseComma",
                    required: true,
                }), r: ['{{ var | safe}}']
            },
            eventvar: {
                el: new dstVariable(config, {
                    label: KaplanMeierEstimationOneGroup.t('eventvar'),
                    no: "eventvar",
                    filter: "Numeric|Scale",
                    required: true,
                    extraction: "NoPrefix|UseComma",
                }), r: ['{{ var | safe}}']
            },

            label1: { el: new labelVar(config, { label: KaplanMeierEstimationOneGroup.t('label1'), style: "mt-2", h: 6 }) },
            survivalradio: {
                el: new radioButton(config, {
                    label: KaplanMeierEstimationOneGroup.t('survivalradio'),
                    no: "plottypegroup",
                    increment: "survivalradio",
                    syntax: "NULL",
                    state: "checked",
                    extraction: "ValueAsIs"
                })
            },
            inciradio: {
                el: new radioButton(config, {
                    label: KaplanMeierEstimationOneGroup.t('inciradio'),
                    no: "plottypegroup",
                    increment: "inciradio",
                    syntax: "'event'",
                    state: "",
                    extraction: "ValueAsIs"
                })
            }, 
            printallest: {
                el: new checkbox(config, {
                    label: KaplanMeierEstimationOneGroup.t('printallest'),
                    no: "printallest",
                    extraction: "Boolean",
                    style: "mt-3"
                })
            },
            printspecest: {
                el: new checkbox(config, {
                    label: KaplanMeierEstimationOneGroup.t('printspecest'),
                    no: "printspecest",
                    extraction: "Boolean",
					newline: true
                })
            },
            spectimes: {
                el: new input(config, {
                    no: 'spectimes',
                    label: KaplanMeierEstimationOneGroup.t('spectimes'),
					style: "ml-5",
                    extraction: "TextAsIs",
                    allow_spaces:true,
                    type:"character"
                })
            },			
            titlebox: {
                el: new input(config, {
                    no: 'titlebox',
                    label: KaplanMeierEstimationOneGroup.t('titlebox'),
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
				label: KaplanMeierEstimationOneGroup.t('plottitlesizelabel'),
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
                    label: KaplanMeierEstimationOneGroup.t('themedropdown'),
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
            label2: { el: new labelVar(config, { label: KaplanMeierEstimationOneGroup.t('label2'), style:"mt-3", h: 5 }) },
            natriskchkbox: {
                el: new checkbox(config, {
                    label: KaplanMeierEstimationOneGroup.t('natriskchkbox'),
                    no: "natriskchkbox",
                    extraction: "Boolean",
                    style: "ml-3"
                })
            },
            risktableprop: {
                el: new advancedSlider(config, {
                    no: "risktableprop",
                    label: KaplanMeierEstimationOneGroup.t('risktableprop'),
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
                    label: KaplanMeierEstimationOneGroup.t('risktablepos'),
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
				label: KaplanMeierEstimationOneGroup.t('risktablevaluesize'),
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
				label: KaplanMeierEstimationOneGroup.t('risktabletitlesize'),
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
				label: KaplanMeierEstimationOneGroup.t('risktableaxislabelsize'),
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
				label: KaplanMeierEstimationOneGroup.t('risktableticklabelsize'),
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
                    label: KaplanMeierEstimationOneGroup.t('risktableclean'),
                    no: "risktableclean",
                    extraction: "Boolean",
                    newline: true,
                    style:"ml-3 mb-3"
                })
            }, 			
            label3: { el: new labelVar(config, { label: KaplanMeierEstimationOneGroup.t('label3'), h: 5 }) },
            linesize: {
                el: new advancedSlider(config, {
                    no: "linesize",
                    label: KaplanMeierEstimationOneGroup.t('linesize'),
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
                    label: KaplanMeierEstimationOneGroup.t('linecolor'),
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["black", "blue", "red", "green", "purple", "cyan", "magenta"],
                    default: "black",
                    style:"ml-3"
                })
            },   
            label4: { el: new labelVar(config, { label: KaplanMeierEstimationOneGroup.t('label4'), style:"ml-3 mt-3", h: 5 }) },
            cichkbox: {
                el: new checkbox(config, {
                    label: KaplanMeierEstimationOneGroup.t('cichkbox'),
                    no: "cichkbox",
                    extraction: "Boolean",
                    newline: true,
                    style:"ml-5"
                })
            },            
            cistyle: {
                el: new comboBox(config, {
                    no: 'cistyle',
                    label: KaplanMeierEstimationOneGroup.t('cistyle'),
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
                    label: KaplanMeierEstimationOneGroup.t('citransparency'),
                    min: 0,
                    max: 1,
                    step: 0.1,
                    value: 0.5,
                    extraction: "NoPrefix|UseComma",
                    style:"ml-5"
                })
            },   
            label5: { el: new labelVar(config, { label: KaplanMeierEstimationOneGroup.t('label5'), style:"ml-3", h: 5 }) },
            censorchkbox: {
                el: new checkbox(config, {
                    label: KaplanMeierEstimationOneGroup.t('censorchkbox'),
                    no: "censorchkbox",
                    extraction: "Boolean",
                    style:"ml-5"
                })
            },   
            censorsize: {
                el: new advancedSlider(config, {
                    no: "censorsize",
                    label: KaplanMeierEstimationOneGroup.t('censorsize'),
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
                    label: KaplanMeierEstimationOneGroup.t('medsurvivalline'),
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["none", "hv", "h", "v"],
                    default: "none",
                    style:"ml-3"
                })
            }, 
            
            label6: { el: new labelVar(config, { label: KaplanMeierEstimationOneGroup.t('label6'), h: 5 }) },
            survaxislabel: {
                el: new input(config, {
                    no: 'survaxislabel',
                    label: KaplanMeierEstimationOneGroup.t('survaxislabel'),
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
				label: KaplanMeierEstimationOneGroup.t('axislabelsize'),
				style: "mt-5",
				min: 5,
				max: 50,
				step: 1,
				value: 16,
				extraction: "NoPrefix|UseComma"
				})
			},            
            label7: { el: new labelVar(config, { label: KaplanMeierEstimationOneGroup.t('label7'), style: "mt-3 ml-4", h: 6 }) },
            defbutton: {
                el: new radioButton(config, {
                    label: KaplanMeierEstimationOneGroup.t('defbutton'),
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
                    label: KaplanMeierEstimationOneGroup.t('pctbutton'),
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
                    label: KaplanMeierEstimationOneGroup.t('survaxislimits'),
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
                    label: KaplanMeierEstimationOneGroup.t('survtickinc'),
                    min: 0,
                    max: 1,
                    step: 0.01,
                    value: 0.1,
                    extraction: "NoPrefix|UseComma",
                    style:"ml-4 mt-3"
                })
            }, 
            label8: { el: new labelVar(config, { label: KaplanMeierEstimationOneGroup.t('label8'), h: 5 }) },
            timeaxislabel: {
                el: new input(config, {
                    no: 'timeaxislabel',
                    label: KaplanMeierEstimationOneGroup.t('timeaxislabel'),
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
                    label: KaplanMeierEstimationOneGroup.t('timeaxislimits'),
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
                    label: KaplanMeierEstimationOneGroup.t('timetickinc'),
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
				label: KaplanMeierEstimationOneGroup.t('ticklabelsize'),
				min: 5,
				max: 50,
				step: 1,
				value: 12,
				extraction: "NoPrefix|UseComma"
				})
			},			
            label12: {
                el: new labelVar(config, {
                  label: KaplanMeierEstimationOneGroup.t('label12'), 
                  style: "mt-3", 
                  h:5
                })
              },  			

        }
        var styleoptions = {
            el: new optionsVar(config, {
                no: "styleoptions",
                name: KaplanMeierEstimationOneGroup.t('styleoptions'),
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
                name: KaplanMeierEstimationOneGroup.t('axisoptions'),
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
                name: KaplanMeierEstimationOneGroup.t('navigation'),
                icon: "icon-kaplan1",
                modal: config.id
            }
        }
        super(config, objects, content);
        
        this.help = {
            title: KaplanMeierEstimationOneGroup.t('help.title'),
            r_help: KaplanMeierEstimationOneGroup.t('help.r_help'), //r_help: "help(data,package='utils')",
            body: KaplanMeierEstimationOneGroup.t('help.body')
        }
;
    }
}

module.exports = {
    render: () => new KaplanMeierEstimationOneGroup().render()
}

