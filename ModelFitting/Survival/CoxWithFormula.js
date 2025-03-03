/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */




class CoxWithFormula extends baseModal {
    static dialogId = 'CoxWithFormula'
    static t = baseModal.makeT(CoxWithFormula.dialogId)

    constructor() {
        var config = {
            id: CoxWithFormula.dialogId,
            label: CoxWithFormula.t('title'),
            modalType: "two",
            RCode: `
require(survival)
require(broom)
require(survminer)
require(car)
BSkyFormula = Surv({{selected.timevar | safe}},{{selected.eventvar | safe}}) ~ {{selected.modelterms | safe}}   
# model fit and output
{{selected.modelname | safe}}<-coxph(Surv({{selected.timevar | safe}},{{selected.eventvar | safe}}) ~ {{selected.modelterms | safe}}, data={{dataset.name}}, ties="{{selected.tiemethod | safe}}", weights={{selected.weightvar | safe}}, na.action=na.exclude)
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
attr(.GlobalEnv\${{selected.modelname | safe}},"indepvarCL") = paste ("'", paste (base::all.vars(BSkyFormula[-2]), collapse="','"), "'", sep="")
#Setting independent variables for machine learners (All variables including event and followup time need to be present in the data set
#in order for the dataset to be scored
attr(.GlobalEnv\${{selected.modelname | safe}},"indepvar") = paste ("'", paste ( c(base::all.vars(BSkyFormula[-2]), '{{selected.eventvar | safe }}','{{selected.timevar | safe }}'), collapse="','"), "'", sep="")
attr(.GlobalEnv\${{selected.modelname | safe}},"depvar") = "'{{selected.eventvar | safe }}'"
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
				label: CoxWithFormula.t('helplabel'), 
				style: "mt-3", 
				h:5
				})
			},	
            modelname: {
                el: new input(config, {
                    no: 'modelname',
                    label: CoxWithFormula.t('modelname'),
                    placeholder: "CoxRegModel1",
                    required: true,
                    type: "character",
                    extraction: "TextAsIs",
                    value: "CoxRegModel1"
                })
            },            
            timevar: {
                el: new dstVariable(config, {
                    label: CoxWithFormula.t('timevar'),
                    no: "timevar",
                    filter: "Numeric|Scale",
                    extraction: "NoPrefix|UseComma",
                    required: true,
                }), r: ['{{ var | safe}}']
            },
            eventvar: {
                el: new dstVariable(config, {
                    label: CoxWithFormula.t('eventvar'),
                    no: "eventvar",
                    filter: "Numeric|Scale",
                    required: true,
                    extraction: "NoPrefix|UseComma",
                }), r: ['{{ var | safe}}']
            },
            modelterms: {
                el: new formulaBuilder(config, {
                    no: "modelterms",
                    label: CoxWithFormula.t('modelterms'),
					required: true
                })
            }, 
            weightvar: {
                el: new dstVariable(config, {
                    label: CoxWithFormula.t('weightvar'),
                    no: "weightvar",
                    filter: "Numeric|Scale",
                    required: false,
                    extraction: "NoPrefix|UseComma",
                }), r: ['{{ var | safe}}']
            },                       


            tiemethod: {
                el: new comboBox(config, {
                    no: 'tiemethod',
                    label: CoxWithFormula.t('tiemethod'),
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["efron", "breslow", "exact"],
                    default: "efron"
                })
            }, 
            forestplotbox: {
                el: new checkbox(config, {
                    label: CoxWithFormula.t('forestplotbox'),
                    no: "forestplotbox",
                    extraction: "Boolean",
                    newline: true,
                    style:"mt-3"
                })
            },
            diagnosticsbox: {
                el: new checkbox(config, {
                    label: CoxWithFormula.t('diagnosticsbox'),
                    no: "diagnosticsbox",
                    extraction: "Boolean",
                    newline: true,
                    style:"mt-3"
                })
            },
            martscalebox: {
                el: new input(config, {
                    no: 'martscalebox',
                    label: CoxWithFormula.t('martscalebox'),
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
                    label: CoxWithFormula.t('devbox'),
                    no: "devbox",
                    extraction: "Boolean",
                    newline: true,
                    style:"mt-3"
                })
            },
            devtype: {
                el: new comboBox(config, {
                    no: 'devtype',
                    label: CoxWithFormula.t('devtype'),
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["Wald", "LR"],
                    default: "Wald",
                    style:"mt-3"
                })
            },             

        }
        var options = {
            el: new optionsVar(config, {
                no: "options",
                /*name: CoxWithFormula.t('options'),*/
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
                objects.modelterms.el.content,
                objects.weightvar.el.content,
            ],
            bottom: [options.el.content],
            nav: {
                name: CoxWithFormula.t('navigation'),
                icon: "icon-cox-advanced",
				positionInNav: 0,
                modal: config.id
            }
        }
        super(config, objects, content);
        
        this.help = {
            title: CoxWithFormula.t('help.title'),
            r_help: CoxWithFormula.t('help.r_help'), //r_help: "help(data,package='utils')",
            body: CoxWithFormula.t('help.body')
        }
;
    }
}

module.exports = {
    render: () => new CoxWithFormula().render()
}
