


class LogisticFirth extends baseModal {
    static dialogId = 'LogisticFirth'
    static t = baseModal.makeT(LogisticFirth.dialogId)

    constructor() {
        var config = {
            id: LogisticFirth.dialogId,
            label: LogisticFirth.t('title'),
            modalType: "two",
            RCode: `
library(logistf)
library(survival)

# model fit
{{selected.modelname | safe}} <- logistf({{selected.outcomevar | safe}} ~ {{selected.modelterms | safe}},
               data={{dataset.name}}, pl={{selected.statgrp | safe}},
				 control=logistf.control(maxit={{selected.maxiter | safe}}, maxstep={{selected.maxstep | safe}}),
			   flic={{selected.flic | safe}}, na.action=na.exclude{{selected.offset |safe}}{{selected.weights | safe}})

# model LRT
LL <- -2 * ({{selected.modelname | safe}}$loglik["null"] - {{selected.modelname | safe}}$loglik["full"])
LL_p <- 1 - pchisq(LL, {{selected.modelname | safe}}$df)

# model Wald test
wald_z <- t(coef({{selected.modelname | safe}})) %*% solve({{selected.modelname | safe}}$var) %*% coef({{selected.modelname | safe}})
wald_p <- 1 - pchisq(wald_z, {{selected.modelname | safe}}$df)

# model concordance
model_conc <- concordance({{selected.modelname | safe}}$y ~ predict({{selected.modelname | safe}}))

# model summary table
modsum <- data.frame("Category probability modelled"=levels(factor({{dataset.name}}{{selected.dollaroutcomevar | safe}}))[2],
                     "n"={{selected.modelname | safe}}$n, "n events"=sum({{selected.modelname | safe}}$y), "loglik"={{selected.modelname | safe}}$loglik["full"],
                     "AIC"=extractAIC({{selected.modelname | safe}})[2],
                     "LRT Statistic"=LL, "LRT p-value"=LL_p, 
                     "Wald Statistic"=wald_z, "Wald p-value"=wald_p,
                     "Concordance (95% CI)"=paste0(round(model_conc$concordance, 4), " (",
                            round(model_conc$concordance-1.96*sqrt(model_conc$var), 4), ", ",
                            round(model_conc$concordance+1.96*sqrt(model_conc$var), 4), ")"), 
                     "Concordance SE"=sqrt(model_conc$var),
                    check.names=FALSE)
rownames(modsum) <- NULL
BSkyFormat(t(modsum), singleTableOutputHeader="Firth Correction Logistic Model Summary for {{selected.outcomevar | safe}}")

# parameter estimates
parm_est <- cbind({{selected.modelname | safe}}$coefficients, diag({{selected.modelname | safe}}$var)^0.5, {{selected.modelname | safe}}$ci.lower,
        {{selected.modelname | safe}}$ci.upper, qchisq(1 - {{selected.modelname | safe}}$prob, 1), {{selected.modelname | safe}}$prob)
colnames(parm_est) <- c("coef",
        "se(coef)", "lower 95%", "upper 95%",
        "Chisq", "p.value")
{{if (options.selected.statgrp=="TRUE")}}
BSkyFormat(parm_est, singleTableOutputHeader="Parameter Estimates and 95% Profile Likelihood Confidence Intervals")
{{#else}}
BSkyFormat(parm_est, singleTableOutputHeader="Parameter Estimates and 95% Wald Confidence Intervals")
{{/if}}

# odds ratios
or_est <- cbind(exp({{selected.modelname | safe}}$coefficients), qchisq(1 - {{selected.modelname | safe}}$prob, 1), {{selected.modelname | safe}}$prob, 
                confint({{selected.modelname | safe}}, exp=TRUE))
colnames(or_est) <- c("OR", "Chisq", "p.value", "lower 95%", "upper 95%")
{{if (options.selected.statgrp=="TRUE")}}
BSkyFormat(or_est, singleTableOutputHeader="Odds Ratios and 95% Profile Likelihood Confidence Intervals")
{{#else}}
BSkyFormat(or_est, singleTableOutputHeader="Odds Ratios and 95% Wald Confidence Intervals")
{{/if}}

suppressWarnings(rm(LL, LL_p, wald_z, wald_p, model_conc, modsum, parm_est, or_est))
`
        }
        var objects = {
            content_var: {
                el: new srcVariableList(config, {
                    action: "move"
                })
            },		
            modelname: {
                el: new input(config, {
                    no: 'modelname',
                    label: LogisticFirth.t('modelname'),
                    placeholder: "LogisticFirthModel1",
                    required: true,
                    type: "character",
                    extraction: "TextAsIs",
                    value: "LogisticFirthModel1"
                })
            },            
            outcomevar: {
                el: new dstVariable(config, {
                    label: LogisticFirth.t('outcomevar'),
                    no: "outcomevar",
                    filter: "Numeric|Scale|Nominal|Logical",
                    required: true,
                    extraction: "NoPrefix|UseComma",
                })
            },
            modelterms: {
                el: new formulaBuilder(config, {
                    no: "modelterms",
                    label: LogisticFirth.t('modelterms'),
					required: true
                })
            },
			offset: {
				el: new dstVariable(config, {
					label: LogisticFirth.t('offsetlabel'),
					no: "offset",
					filter: "String|Numeric|Scale|Logical|Ordinal|Nominal",
					extraction: "NoPrefix|UseComma",
					wrapped: ", offset=%val%",
					required: false,
				})
			},
			weights: {
				el: new dstVariable(config, {
					label: LogisticFirth.t('weightslabel'),
					no: "weights",
					filter: "Numeric|Scale",
					extraction: "NoPrefix|UseComma",
					wrapped: ", weights=%val%",
					required: false,
				})
			},				

			statlabel: {
				el: new labelVar(config, {
					label: LogisticFirth.t('stattext'),
					h:5
				})
			},	
			profilelikelihood: {
				el: new radioButton(config, {
					label: LogisticFirth.t('profilelikelihoodlabel'),
					no: "statgrp",
					increment: "profilelikelihood",
					value: "TRUE",
					state: "checked",
					extraction: "ValueAsIs"
				})
			}, 
			wald: {
				el: new radioButton(config, {
					label: LogisticFirth.t('waldlabel'),
					no: "statgrp",
					increment: "wald",
					value: "FALSE",
					state: "",
					extraction: "ValueAsIs"
				})
			},

			flic: {
				el: new checkbox(config, {
					label: LogisticFirth.t('fliclabel'),
					no: "flic",
					style: "mt-4",
					extraction: "Boolean"
				})
			},			
			convergeopt: {
				el: new labelVar(config, {
					label: LogisticFirth.t('convergeoptlabel'),
					style: "mt-4",
					h:5
				})
			},
			maxiter: {
				el: new inputSpinner(config, {
					no: 'maxiter',
					label: LogisticFirth.t('maxiterlabel'),
					min: 10,
					max: 500,
					step: 1,
					value: 25,
					style: "ml-2",
					extraction: "NoPrefix|UseComma"
				})
			},			
			maxstep: {
                el: new input(config, {
                    no: 'maxstep',
                    label: LogisticFirth.t('maxsteplabel'),
                    placeholder: "5",
                    style: "ml-4",
                    extraction: "TextAsIs",
                    value: "5",
                    allow_spaces: true,
					width: "w-25",
                    Type: "numeric"
                })
            },	 
             

        }
        var options = {
            el: new optionsVar(config, {
                no: "options",
                name: LogisticFirth.t('options'),
                content: [
					objects.statlabel.el, objects.profilelikelihood.el, objects.wald.el,
					objects.flic.el,
					objects.convergeopt.el, objects.maxiter.el, objects.maxstep.el
                ]
            })
        };
       
        const content = {
			left: [objects.content_var.el.content],
            right: [
                objects.modelname.el.content,
                objects.outcomevar.el.content, 
                objects.modelterms.el.content, objects.offset.el.content, objects.weights.el.content
            ],
            bottom: [options.el.content],
            nav: {
                name: LogisticFirth.t('navigation'),
                icon: "icon-logistic_formula",
				positionInNav: 14,
                modal: config.id
            }
        }
        super(config, objects, content);
        
        this.help = {
            title: LogisticFirth.t('help.title'),
            r_help: LogisticFirth.t('help.r_help'), //Fix by Anil //r_help: "help(data,package='utils')",
            body: LogisticFirth.t('help.body')
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
		
		//for dependent variable
		let outcomevarapp=code_vars.selected.outcomevar
		let dollaroutcomevar="$"+outcomevarapp
	
		//create new variables under code_vars
		code_vars.selected.dollaroutcomevar = dollaroutcomevar
		
		//final piece of code
            const cmd = instance.dialog.renderR(code_vars);
            res.push({ cmd: cmd, cgid: newCommandGroup() })
            return res;		
	}			
		
	
}

module.exports = {
    render: () => new LogisticFirth().render()
}
