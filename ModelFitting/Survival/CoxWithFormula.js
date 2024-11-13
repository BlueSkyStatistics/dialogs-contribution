
var localization = {
    en: {
        title: "Cox, Advanced",
        navigation: "Cox, Advanced",
		helplabel: "Click on the ? button on the top right of the dialog for details on sample datasets and the data format supported.",		
        modelname:"Enter model name",
        timevar: "Time to event or censor",
        eventvar: "Events (1 = event 1, 0 = censor)",
        modelterms:"Model expression builder for independent variables",
        weightvar: "Weights (optional)",

        tiemethod: "Tied Time Method",
        forestplotbox : "Forest Plot",
        diagnosticsbox: "Model Diagnostics",
        martscalebox:"Null Model Martingale Residual Axis Minimum Value (-Inf to 1):",
        devbox:"Analysis of Deviance (Type II)",
        devtype:"Test Statistic",

        help: {
            title: "Cox, Advanced",
            r_help: "help(coxph, package = 'survival')",
            body: `
			See sample dataset in the install directory, the default location is at drive letter:&bsol;program files&bsol;BlueSky Statistics&bsol;10&bsol;Samples_and_Documents&bsol;Datasets_and_Demos&bsol;Regression_Cox&bsol;mockstudy_upd.RData. The variable Followup_time should be entered as the time to event or censor and the variable Event should be entered as the Events (1 = event, 0 = censor). Sex, age and bmi can be the independent variables. 
			<br/>
			This dataset is an updated version of the mockstudy dataset in the arsenal package.
			<br/><br/>
            <b>Cox Proportional Hazards Model</b>
            <br/>
            <br/>
            Fits a Cox proportional hazards model for time-to-event data with censored observations.  Model fitting statistics, parameter estimates, and hazard ratios are provided.  Options available include the tied time method, model diagnostics such as proportional hazards and covariate functional form assessments, and a forest plot of hazard ratios with confidence intervals.  The model is fit using the coxph function in the survival package.
            <br/>
            <br/>
            <b>Time:</b> Time to event for those experiencing the event or time to last follow-up for those not experiencing the event
            <br/><br/>
            <b>Event:</b> Numerical event indicator; 1=event, 0=censor
            <br/><br/>
            <b>Independent Variables:</b> Independent variables to include in the model.  Factors, strings, and logical variables will be dummy coded.
            <br/><br/>
            <b>Weights:</b> Numeric variable for observation weights. Useful in situations where each record should not be counted as one observation. 
            <br/>
            <br/>
            <b>Required packages:</b> survival, broom, survminer, car, BlueSky
            <br/>
            <br/>
            Click the Get R Help button to get detailed R help about the coxph function.
            <br/>
            <br/>
            <br/>
            <br/>
            <b>Options</b>
            <br/>
            <br/>
            <b>Tied Time Method:</b>
            <br/>
            Method of breaking tied observed times.  Efron is usually the better choice when there aren't many tied times.  The exact method can be beneficial if there are many tied times, as in discrete time situations, but can take a little longer for the model to be fit. 
            <br/>
            <br/>
            <b>Forest Plot:</b>
            <br/>
            Plot of hazard ratios and confidence intervals for each predictor in the model.
            <br/>
            <br/>
            <b>Model Diagnostics:</b>
            <br/>
            If selected, proportional hazards tests and plots will be provided, in addition to assessments of functional form for each covariate in the model.  The null model Martingale residual axis minimum value option might need to be changed so that all residuals appear in the plot. To get functional form assessments, you must specify only numeric predictors and have no missing data. See Variables > Missing Values > Remove NAs.
            <br/>
            <br/>
            <b>Analysis of Deviance (Type II):</b>
            Global test of each predictor in the model.  Multi-degree of freedom tests will be provided for effects with more than 2 levels.  Wald and Likelihood ratio tests can be obtained, with likelihood ratios tests having better small sample properties.
            
`}
    }
}

class CoxWithFormula extends baseModal {
    constructor() {
        var config = {
            id: "CoxWithFormula",
            label: localization.en.title,
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
				label: localization.en.helplabel, 
				style: "mt-3", 
				h:5
				})
			},	
            modelname: {
                el: new input(config, {
                    no: 'modelname',
                    label: localization.en.modelname,
                    placeholder: "CoxRegModel1",
                    required: true,
                    type: "character",
                    extraction: "TextAsIs",
                    value: "CoxRegModel1"
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
            modelterms: {
                el: new formulaBuilder(config, {
                    no: "modelterms",
                    label: localization.en.modelterms,
					required: true
                })
            }, 
            weightvar: {
                el: new dstVariable(config, {
                    label: localization.en.weightvar,
                    no: "weightvar",
                    filter: "Numeric|Scale",
                    required: false,
                    extraction: "NoPrefix|UseComma",
                }), r: ['{{ var | safe}}']
            },                       


            tiemethod: {
                el: new comboBox(config, {
                    no: 'tiemethod',
                    label: localization.en.tiemethod,
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["efron", "breslow", "exact"],
                    default: "efron"
                })
            }, 
            forestplotbox: {
                el: new checkbox(config, {
                    label: localization.en.forestplotbox,
                    no: "forestplotbox",
                    extraction: "Boolean",
                    newline: true,
                    style:"mt-3"
                })
            },
            diagnosticsbox: {
                el: new checkbox(config, {
                    label: localization.en.diagnosticsbox,
                    no: "diagnosticsbox",
                    extraction: "Boolean",
                    newline: true,
                    style:"mt-3"
                })
            },
            martscalebox: {
                el: new input(config, {
                    no: 'martscalebox',
                    label: localization.en.martscalebox,
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
                    label: localization.en.devbox,
                    no: "devbox",
                    extraction: "Boolean",
                    newline: true,
                    style:"mt-3"
                })
            },
            devtype: {
                el: new comboBox(config, {
                    no: 'devtype',
                    label: localization.en.devtype,
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
                /*name: localization.en.options,*/
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
                name: localization.en.navigation,
                icon: "icon-cox-advanced",
				positionInNav: 0,
                modal: config.id
            }
        }
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new CoxWithFormula().render()