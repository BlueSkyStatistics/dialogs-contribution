


class CoxFirth extends baseModal {
    static dialogId = 'CoxFirth'
    static t = baseModal.makeT(CoxFirth.dialogId)

    constructor() {
        var config = {
            id: CoxFirth.dialogId,
            label: CoxFirth.t('title'),
            modalType: "two",
            RCode: `
library(coxphf)
library(survival)
library(survminer)
library(dplyr)

# model fit
{{selected.modelname | safe}} <- coxphf(Surv({{selected.timevar | safe}}, {{selected.eventvar | safe}}) ~ {{selected.modelterms | safe}},
              data={{dataset.name}},
             pl={{selected.statgrp | safe}}, maxit={{selected.maxiter | safe}}, maxstep={{selected.maxstep | safe}})

# model LRT
LL <- 2 * diff({{selected.modelname | safe}}$loglik)
LL_p <- 1 - pchisq(LL, {{selected.modelname | safe}}$df)

# model Wald test
wald_z <- t(coef({{selected.modelname | safe}})) %*% solve({{selected.modelname | safe}}$var) %*% coef({{selected.modelname | safe}})
wald_p <- 1 - pchisq(wald_z, {{selected.modelname | safe}}$df)

# model concordance
model_conc <- concordance(Surv({{selected.timevar | safe}}, {{selected.eventvar | safe}}) ~ predict({{selected.modelname | safe}}), data={{dataset.name}}, reverse=TRUE)

# model summary table
modsum <- cbind(glance({{selected.modelname | safe}}), "LRT Statistic"=LL, "LRT p-value"=LL_p, 
                "Wald Statistic"=wald_z, "Wald p-value"=wald_p,
                "Concordance (95% CI)"=paste0(round(model_conc$concordance, 4), " (", 
					round(model_conc$concordance-1.96*sqrt(model_conc$var), 4), ", ", 
					round(model_conc$concordance+1.96*sqrt(model_conc$var), 4), ")"), 
					"Concordance SE"=sqrt(model_conc$var))
BSkyFormat(t(modsum), singleTableOutputHeader="Firth Correction Cox Model Summary for Surv({{selected.timevar | safe}}, {{selected.eventvar | safe}})")

# parameter estimates
parm_est <- tidy.coxphf({{selected.modelname | safe}}) %>%
	cbind(ci.lower=log({{selected.modelname | safe}}$ci.lower), ci.upper=log({{selected.modelname | safe}}$ci.upper))
rownames(parm_est) <- NULL
{{if (options.selected.statgrp=="TRUE")}}
BSkyFormat(as.data.frame(parm_est), singleTableOutputHeader="Parameter Estimates and 95% Profile Likelihood Confidence Intervals")
{{#else}}
BSkyFormat(as.data.frame(parm_est), singleTableOutputHeader="Parameter Estimates and 95% Wald Confidence Intervals")
{{/if}}

# hazard ratios
hr_est <- tidy.coxphf({{selected.modelname | safe}}, exponentiate=TRUE) %>%
	cbind(ci.lower={{selected.modelname | safe}}$ci.lower, ci.upper={{selected.modelname | safe}}$ci.upper) %>%
	dplyr::select(-std.error)
rownames(hr_est) <- NULL
{{if (options.selected.statgrp=="TRUE")}}
BSkyFormat(as.data.frame(hr_est), singleTableOutputHeader="Hazard Ratios and 95% Profile Likelihood Confidence Intervals")
{{#else}}
BSkyFormat(as.data.frame(hr_est), singleTableOutputHeader="Hazard Ratios and 95% Wald Confidence Intervals")
{{/if}}

{{if (options.selected.diagnosticsbox=="TRUE")}}
# diagnostics
# using Firth coefficients as initialized values in a standard Cox model with no estimation steps
fit_for_residuals <- coxph(Surv({{selected.timevar | safe}}, {{selected.eventvar | safe}}) ~ {{selected.modelterms | safe}},
                           data={{dataset.name}},
                           init=coef({{selected.modelname | safe}}), iter.max=0)

prophaz<-as.data.frame(cox.zph(fit_for_residuals)$table)
BSkyFormat(prophaz,singleTableOutputHeader="Proportional Hazards Tests")
plot(cox.zph(fit_for_residuals), hr=TRUE, col=2, lwd=2)
ggcoxfunctional(fit_for_residuals, data={{dataset.name}}, ylim=c({{selected.martscalebox | safe}},1))
ggcoxdiagnostics(fit_for_residuals)
{{/if}}

suppressWarnings(rm(LL, LL_p, wald_z, wald_p, model_conc, modsum, parm_est, hr_est, fit_for_residuals, prophaz))
`
        }
        var objects = {
            content_var: {
                el: new srcVariableList(config, {
                    action: "move"
                })
            },
			complabel: {
				el: new labelVar(config, {
					label: CoxFirth.t('complabeltext'),
					style: "mb-3",					
					h:5
				})
			},			
            modelname: {
                el: new input(config, {
                    no: 'modelname',
                    label: CoxFirth.t('modelname'),
                    placeholder: "CoxFirthModel1",
                    required: true,
                    type: "character",
                    extraction: "TextAsIs",
                    value: "CoxFirthModel1"
                })
            },            
            timevar: {
                el: new dstVariable(config, {
                    label: CoxFirth.t('timevar'),
                    no: "timevar",
                    filter: "Numeric|Scale",
                    extraction: "NoPrefix|UseComma",
                    required: true,
                })
            },
            eventvar: {
                el: new dstVariable(config, {
                    label: CoxFirth.t('eventvar'),
                    no: "eventvar",
                    filter: "Numeric|Scale",
                    required: true,
                    extraction: "NoPrefix|UseComma",
                })
            },
            modelterms: {
                el: new formulaBuilder(config, {
                    no: "modelterms",
                    label: CoxFirth.t('modelterms'),
					required: true
                })
            }, 

			statlabel: {
				el: new labelVar(config, {
					label: CoxFirth.t('stattext'),
					h:5
				})
			},	
			profilelikelihood: {
				el: new radioButton(config, {
					label: CoxFirth.t('profilelikelihoodlabel'),
					no: "statgrp",
					increment: "profilelikelihood",
					value: "TRUE",
					state: "checked",
					extraction: "ValueAsIs"
				})
			}, 
			wald: {
				el: new radioButton(config, {
					label: CoxFirth.t('waldlabel'),
					no: "statgrp",
					increment: "wald",
					value: "FALSE",
					state: "",
					extraction: "ValueAsIs"
				})
			},
			
			convergeopt: {
				el: new labelVar(config, {
					label: CoxFirth.t('convergeoptlabel'),
					style: "mt-5",
					h:5
				})
			},
			maxiter: {
				el: new inputSpinner(config, {
					no: 'maxiter',
					label: CoxFirth.t('maxiterlabel'),
					min: 10,
					max: 500,
					step: 1,
					value: 50,
					style: "ml-2",
					extraction: "NoPrefix|UseComma"
				})
			},			
			maxstep: {
                el: new input(config, {
                    no: 'maxstep',
                    label: CoxFirth.t('maxsteplabel'),
                    placeholder: ".5",
                    style: "ml-4",
                    extraction: "TextAsIs",
                    value: ".5",
                    allow_spaces: true,
					width: "w-25",
                    Type: "numeric"
                })
            },	
                      
            diagnosticsbox: {
                el: new checkbox(config, {
                    label: CoxFirth.t('diagnosticsbox'),
                    no: "diagnosticsbox",
                    extraction: "Boolean",
                    newline: true,
                    style:"mt-5"
                })
            },
            martscalebox: {
                el: new input(config, {
                    no: 'martscalebox',
                    label: CoxFirth.t('martscalebox'),
                    placeholder: "-1",
                    ml: 4,
                    extraction: "TextAsIs",
                    value: "-1",
                    allow_spaces: true,
					width: "w-25",
                    Type: "numeric"
                })
            }, 
             

        }
        var options = {
            el: new optionsVar(config, {
                no: "options",
                name: CoxFirth.t('options'),
                content: [
					objects.statlabel.el, objects.profilelikelihood.el, objects.wald.el,
					objects.convergeopt.el, objects.maxiter.el, objects.maxstep.el,
                    objects.diagnosticsbox.el,
                    objects.martscalebox.el,
                ]
            })
        };
       
        const content = {
			head: [objects.complabel.el.content],
			left: [objects.content_var.el.content],
            right: [
                objects.modelname.el.content,
                objects.timevar.el.content,
                objects.eventvar.el.content, 
                objects.modelterms.el.content
            ],
            bottom: [options.el.content],
            nav: {
                name: CoxFirth.t('navigation'),
                icon: "icon-cox-advanced",
				positionInNav: 5,
                modal: config.id
            }
        }
        super(config, objects, content);
        
        this.help = {
            title: CoxFirth.t('help.title'),
            r_help: CoxFirth.t('help.r_help'), //Fix by Anil //r_help: "help(data,package='utils')",
            body: CoxFirth.t('help.body')
        }
;
    }
}

module.exports = {
    render: () => new CoxFirth().render()
}
