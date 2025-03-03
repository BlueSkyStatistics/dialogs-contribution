/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */




class CoxSingleModel extends baseModal {
    static dialogId = 'CoxSingleModel'
    static t = baseModal.makeT(CoxSingleModel.dialogId)

    constructor() {
        var config = {
            id: CoxSingleModel.dialogId,
            label: CoxSingleModel.t('title'),
            modalType: "two",
            RCode: `
require(survival)
require(broom)
require(survminer)
require(car)

# model fit and output
{{selected.modelname | safe}}<-coxph(Surv({{selected.timevar | safe}},{{selected.eventvar | safe}}) ~ {{selected.destvars | safe}}, data={{dataset.name}}, ties="{{selected.tiemethod | safe}}", {{selected.weightvar | safe}} na.action=na.exclude)
cox_summary<-t(glance({{selected.modelname | safe}}))
cox_est<-as.data.frame(tidy({{selected.modelname | safe}}, conf.int=TRUE))
cox_hr<-as.data.frame(tidy({{selected.modelname | safe}},exponentiate=TRUE, conf.int=TRUE))

BSkyFormat(cox_summary,singleTableOutputHeader="Cox Model Summary for Surv({{selected.timevar | safe}},{{selected.eventvar | safe}})")
BSkyFormat(cox_est,singleTableOutputHeader="Parameter Estimates")
BSkyFormat(cox_hr,singleTableOutputHeader="Hazard Ratios (HR) and 95% Confidence Intervals")

{{if (options.selected.devbox=="TRUE")}}
# analysis of deviance option
anovatable<-Anova({{selected.modelname | safe}},type=2,test.statistic="{{selected.devtype | safe}}")
BSkyFormat(as.data.frame(anovatable),singleTableOutputHeader="Analysis of Deviance (Type II)")
{{/if}}

{{if (options.selected.diagnosticsbox=="TRUE")}}
# diagnostics option
prophaz<-as.data.frame(cox.zph({{selected.modelname | safe}})$table)
BSkyFormat(prophaz,singleTableOutputHeader="Proportional Hazards Tests")
plot(cox.zph({{selected.modelname | safe}}), hr=TRUE, col=2, lwd=2)
ggcoxfunctional({{selected.modelname | safe}},data={{dataset.name}},ylim=c({{selected.martscalebox | safe}},1))
ggcoxdiagnostics({{selected.modelname | safe}})
{{/if}}

{{if (options.selected.forestplotbox=="TRUE")}}
# forest plot option
ggforest({{selected.modelname | safe}},data={{dataset.name}})
{{/if}}  


#Setting attributes to support scoring
attr(.GlobalEnv\${{selected.modelname | safe}},"eventVar") = "'{{selected.eventvar | safe }}'"
attr(.GlobalEnv\${{selected.modelname | safe}},"followUpTimeVar") = "'{{selected.timevar | safe }}'"

#Setting independent variables for clinicans
attr(.GlobalEnv\${{selected.modelname | safe}},"indepvarCL") = paste(str_split("{{selected.destvars}}",fixed("+")),sep=",", collapse="")

#Setting independent variables for machine learners (All variables including event and followup time need to be present in the data set
#in order for the dataset to be scored
BSkyIndepVars = str_split("{{selected.destvars}}",fixed("+"))
BSkyIndepVars[[1]] = c(BSkyIndepVars[[1]], '{{selected.eventvar | safe }}', '{{selected.timevar | safe }}')
attr(.GlobalEnv\${{selected.modelname | safe}}, "indepvar") = paste(BSkyIndepVars,sep=",", collapse="")

attr(.GlobalEnv\${{selected.modelname | safe}},"depvar") = "'{{selected.eventvar | safe }}'"
#attr(.GlobalEnv\${{selected.modelname | safe}},"indepvar") = paste(str_split("{{selected.destvars}}",fixed("+")),sep=",", collapse="")
attr(.GlobalEnv\${{selected.modelname | safe}},"classDepVar") = class({{dataset.name}}[, c("{{selected.eventvar | safe}}")])
attr(.GlobalEnv\${{selected.modelname | safe}},"depVarSample") = sample({{dataset.name}}[, c("{{selected.eventvar | safe}}")], size = 2, replace = TRUE)
`
        }
        var objects = {
            content_var: {
                el: new srcVariableList(config, {
                    action: "move"
                })
            },
			helplabel: {
				el: new labelVar(config, {
				label: CoxSingleModel.t('helplabel'), 
				style: "mt-3", 
				h:5
				})
			},			
            modelname: {
                el: new input(config, {
                    no: 'modelname',
                    label: CoxSingleModel.t('modelname'),
                    placeholder: "CoxRegModel1",
                    required: true,
                    type: "character",
                    extraction: "TextAsIs",
                    value: "CoxRegModel1",
					style: "mb-3"
                })
            },              
            timevar: {
                el: new dstVariable(config, {
                    label: CoxSingleModel.t('timevar'),
                    no: "timevar",
                    filter: "Numeric|Scale",
                    extraction: "NoPrefix|UseComma",
                    required: true
                }), r: ['{{ var | safe}}']
            },
            eventvar: {
                el: new dstVariable(config, {
                    label: CoxSingleModel.t('eventvar'),
                    no: "eventvar",
                    filter: "Numeric|Scale",
                    required: true,
                    extraction: "NoPrefix|UseComma"
                }), r: ['{{ var | safe}}']
            },
            destvars: {
                el: new dstVariableList(config, {
                    label: CoxSingleModel.t('destvars'),
                    no: "destvars",
                    required: true,
                    filter: "String|Numeric|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UsePlus"
                }), r: ['{{ var | safe}}']
            }, 
            weightvar: {
                el: new dstVariable(config, {
                    label: CoxSingleModel.t('weightvar'),
                    no: "weightvar",
                    filter: "Numeric|Scale",
                    required: false,
                    extraction: "NoPrefix|UseComma",
                    wrapped: 'weights=%val%,'  
                }), r: ['{{ var | safe}}']
            },                       


            tiemethod: {
                el: new comboBox(config, {
                    no: 'tiemethod',
                    label: CoxSingleModel.t('tiemethod'),
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["efron", "breslow", "exact"],
                    default: "efron"
                })
            }, 
            forestplotbox: {
                el: new checkbox(config, {
                    label: CoxSingleModel.t('forestplotbox'),
                    no: "forestplotbox",
                    extraction: "Boolean",
                    newline: true,
                    style:"mt-3"
                })
            },
            diagnosticsbox: {
                el: new checkbox(config, {
                    label: CoxSingleModel.t('diagnosticsbox'),
                    no: "diagnosticsbox",
                    extraction: "Boolean",
                    newline: true,
                    style:"mt-3"
                })
            },
            martscalebox: {
                el: new input(config, {
                    no: 'martscalebox',
                    label: CoxSingleModel.t('martscalebox'),
                    placeholder: "-1",
                    ml: 4,
                    extraction: "TextAsIs",
                    value: "-1",
                    allow_spaces:true,
                    Type: "numeric"
                })
            }, 
            devbox: {
                el: new checkbox(config, {
                    label: CoxSingleModel.t('devbox'),
                    no: "devbox",
                    extraction: "Boolean",
                    newline: true,
                    style:"mt-3"
                })
            },
            devtype: {
                el: new comboBox(config, {
                    no: 'devtype',
                    label: CoxSingleModel.t('devtype'),
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["Wald", "LR"],
                    default: "Wald",
                    style:"ml-3"
                })
            },             

        }
        var options = {
            el: new optionsVar(config, {
                no: "options",
                /* name: CoxSingleModel.t('options'), */
                content: [
                    objects.tiemethod.el,
                    objects.forestplotbox.el, 
                    objects.diagnosticsbox.el,
                    objects.martscalebox.el,
                    objects.devbox.el,
                    objects.devtype.el,
                ]
            })
        };
       
        const content = {
            head: [objects.helplabel.el.content],
			left: [objects.content_var.el.content],
            right: [
				objects.modelname.el.content,
                objects.timevar.el.content,
                objects.eventvar.el.content, 
                objects.destvars.el.content,
                objects.weightvar.el.content,
            ],
            bottom: [options.el.content],
            nav: {
                name: CoxSingleModel.t('navigation'),
                icon: "icon-survival",
				positionInNav: 1,
                modal: config.id
            }
        }
        super(config, objects, content);
        
        this.help = {
            title: CoxSingleModel.t('help.title'),
            r_help: CoxSingleModel.t('help.r_help'), //r_help: "help(data,package='utils')",
            body: CoxSingleModel.t('help.body')
        }
;
    }
}

module.exports = {
    render: () => new CoxSingleModel().render()
}
