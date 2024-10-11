










class SampleSizeTwoProp extends baseModal {
    static dialogId = 'SampleSizeTwoProp'
    static t = baseModal.makeT(SampleSizeTwoProp.dialogId)

    constructor() {
        var config = {
            id: SampleSizeTwoProp.dialogId,
            label: SampleSizeTwoProp.t('title'),
			splitProcessing: false,
            modalType: "one",
            RCode: `
library(epiR)

result <- epi.sscohortc({{selected.propgrp1final}}{{selected.propgrp2final}}{{selected.powerfinal}}r={{selected.ratio | safe}}, {{selected.nfinal}}sided.test={{selected.altgrp | safe}}, conf.level=1-{{selected.siglevel | safe}})
power_table <- unlist(result)
names(power_table)[c(2,3)] <- c("n.group1", "n.group2")

inputparms <- data.frame(n="{{selected.n | safe}}", power="{{selected.power | safe}}", group1_prop="{{selected.propgrp1 | safe}}", group2_prop="{{selected.propgrp2 | safe}}", n_ratio={{selected.ratio | safe}}, siglevel={{selected.siglevel | safe}}, sides={{selected.altgrp | safe}})

{{if (options.selected.propgrp1=="")}}
# adding detected group 1 proportion and 2 odds ratios 
props <- result$irr*{{selected.propgrp2 | safe}}\n
oneminusprops <- 1-props
oddsratios <- (props/oneminusprops)/({{selected.propgrp2 | safe}}/(1-{{selected.propgrp2 | safe}}))
names(oddsratios) <- c("or.group1.low", "or.group1.high")
names(props) <- c("group1_prop.low", "group2_prop.high")
power_table <- c(power_table, oddsratios, props)
names(power_table)[c(5,6)] <- c("irr.group1.low", "irr.group1.high")
{{/if}}

BSkyFormat(inputparms, singleTableOutputHeader="Input Parameters")
BSkyFormat(power_table, singleTableOutputHeader="Power Results{{if (options.selected.propgrp1=='')}}, with detectable IRRs, ORs, and group 1 proportions in both directions{{/if}}")
`
        };
        var objects = {
			howtouse: {
				el: new preVar(config, {
					no: "howtouse",
					label: SampleSizeTwoProp.t('howtouse'), 
					h:5
				})
			},
			n: {
				el: new input(config, {
					no: 'n',
					label: SampleSizeTwoProp.t('n'),
					placeholder: "",
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					width:"w-25"
				})
			},
			power: {
				el: new input(config, {
					no: 'power',
					label: SampleSizeTwoProp.t('power'),
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces:true,
					value: ".8",
					width:"w-25"
				})
			},			
			propgrp1: {
				el: new input(config, {
					no: 'propgrp1',
					label: SampleSizeTwoProp.t('propgrp1'),
					placeholder: "",
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					value: "",
					width:"w-25"
				})
			},
			propgrp2: {
				el: new input(config, {
					no: 'propgrp2',
					label: SampleSizeTwoProp.t('propgrp2'),
					placeholder: "",
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					value: "",
					width:"w-25"
				})
			},
			ratio: {
				el: new input(config, {
					no: 'ratio',
					label: SampleSizeTwoProp.t('ratio'),
					style: "mt-5",
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					required: true,
					value: "1",
					width:"w-25"
				})
			},		
			siglevel: {
				el: new input(config, {
					no: 'siglevel',
					label: SampleSizeTwoProp.t('siglevel'),
					placeholder: ".05",
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					required: true,
					value: ".05",
					width:"w-25"
				})
			},
			alternativeopt: {
				el: new labelVar(config, {
					label: SampleSizeTwoProp.t('alternativeopt'), 
					style: "mt-5", 
					h:5
				})
			},
			twosided: {
				el: new radioButton(config, {
					label: SampleSizeTwoProp.t('twosided'),
					no: "altgrp",
					increment: "twosided",
					value: "2",
					state: "checked",
					extraction: "ValueAsIs"
				})
			}, 
			onesided: {
				el: new radioButton(config, {
					label: SampleSizeTwoProp.t('onesided'),
					no: "altgrp",
					increment: "onesided",
					value: "1",
					state: "",
					extraction: "ValueAsIs"
				})
			}		
        };
        const content = {
            items: [objects.howtouse.el.content, objects.n.el.content, objects.power.el.content, objects.propgrp1.el.content, objects.propgrp2.el.content, 
					objects.ratio.el.content, objects.siglevel.el.content, objects.alternativeopt.el.content, objects.twosided.el.content, objects.onesided.el.content
					],
            nav: {
                name: SampleSizeTwoProp.t('navigation'),
                icon: "icon-p2",
				datasetRequired: false,
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: SampleSizeTwoProp.t('help.title'),
            r_help: "help(data,package='utils')",
            body: SampleSizeTwoProp.t('help.body')
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
		
		//user-specified inputs
		let nspec=code_vars.selected.n.toString();
		let powerspec=code_vars.selected.power.toString();
		let propgrp1spec=code_vars.selected.propgrp1.toString();
		let propgrp2spec=code_vars.selected.propgrp2.toString();
		
		//changing to what the R functions need
		
		let nfinal="";
		if (nspec=="") {
			nfinal="n=NA, ";
		} else {
			nfinal="n="+nspec+", ";
		}
		
		let powerfinal="";
		if (powerspec=="") {
			powerfinal="power=NA, ";
		} else {
			powerfinal="power="+powerspec+", ";
		}		

		let propgrp1final="";
		if (propgrp1spec=="") {
			propgrp1final="irexp1=NA, ";
		} else {
			propgrp1final="irexp1="+propgrp1spec+", ";
		}		

		let propgrp2final="";
		if (propgrp2spec=="") {
			propgrp2final="irexp0=NA, ";
		} else {
			propgrp2final="irexp0="+propgrp2spec+", ";
		}		
	
		//create new variables under code_vars
		code_vars.selected.nfinal = nfinal
		code_vars.selected.powerfinal = powerfinal
		code_vars.selected.propgrp1final = propgrp1final
		code_vars.selected.propgrp2final = propgrp2final
		
		
		//final piece of code
            const cmd = instance.dialog.renderR(code_vars);
            res.push({ cmd: cmd, cgid: newCommandGroup() })
            return res;		
	}	
		
	
}

module.exports = {
    render: () => new SampleSizeTwoProp().render()
}
