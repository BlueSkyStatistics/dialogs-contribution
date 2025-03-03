/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */












class SampleSizeTwoMeans extends baseModal {
    static dialogId = 'SampleSizeTwoMeans'
    static t = baseModal.makeT(SampleSizeTwoMeans.dialogId)

    constructor() {
        var config = {
            id: SampleSizeTwoMeans.dialogId,
            label: SampleSizeTwoMeans.t('title'),
			splitProcessing: false,
            modalType: "one",
            RCode: `
library(epiR)
result <- epi.sscompc({{selected.meangrp1final | safe}}{{selected.meangrp2final | safe}}{{selected.nfinal | safe}}{{selected.powerfinal | safe}}sigma={{selected.sd | safe}}, r={{selected.ratio | safe}},
   sided.test={{selected.altgrp | safe}}, conf.level=1-{{selected.siglevel | safe}})

inputparms <- data.frame(n="{{selected.n | safe}}", power="{{selected.power | safe}}", treatment_mean="{{selected.meangrp1 | safe}}", control_mean="{{selected.meangrp2 | safe}}", n_ratio={{selected.ratio | safe}}, sd={{selected.sd | safe}}, siglevel={{selected.siglevel | safe}}, sides={{selected.altgrp | safe}})

BSkyFormat(inputparms, singleTableOutputHeader="Input Parameters")   
BSkyFormat(as.data.frame(result), singleTableOutputHeader="Power Results")
`
        };
        var objects = {
			howtouse: {
				el: new preVar(config, {
					no: "howtouse",
					label: SampleSizeTwoMeans.t('howtouse'), 
					h:5
				})
			},
			n: {
				el: new input(config, {
					no: 'n',
					label: SampleSizeTwoMeans.t('n'),
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
					label: SampleSizeTwoMeans.t('power'),
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces:true,
					value: ".8",
					width:"w-25"
				})
			},			
			meangrp1: {
				el: new input(config, {
					no: 'meangrp1',
					label: SampleSizeTwoMeans.t('meangrp1'),
					placeholder: "",
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					value: "",
					width:"w-25"
				})
			},
			meangrp2: {
				el: new input(config, {
					no: 'meangrp2',
					label: SampleSizeTwoMeans.t('meangrp2'),
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
					label: SampleSizeTwoMeans.t('ratio'),
					style: "mt-5",
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					required: true,
					value: "1",
					width:"w-25"
				})
			},
			sd: {
				el: new input(config, {
					no: 'sd',
					label: SampleSizeTwoMeans.t('sd'),
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					required: true,
					width:"w-25"
				})
			},			
			siglevel: {
				el: new input(config, {
					no: 'siglevel',
					label: SampleSizeTwoMeans.t('siglevel'),
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
					label: SampleSizeTwoMeans.t('alternativeopt'), 
					style: "mt-5", 
					h:5
				})
			},
			twosided: {
				el: new radioButton(config, {
					label: SampleSizeTwoMeans.t('twosided'),
					no: "altgrp",
					increment: "twosided",
					value: "2",
					state: "checked",
					extraction: "ValueAsIs"
				})
			}, 
			onesided: {
				el: new radioButton(config, {
					label: SampleSizeTwoMeans.t('onesided'),
					no: "altgrp",
					increment: "onesided",
					value: "1",
					state: "",
					extraction: "ValueAsIs"
				})
			}		
        };
        const content = {
            items: [objects.howtouse.el.content, objects.n.el.content, objects.power.el.content, objects.meangrp1.el.content, objects.meangrp2.el.content, 
					objects.ratio.el.content, objects.sd.el.content, objects.siglevel.el.content, objects.alternativeopt.el.content, objects.twosided.el.content, objects.onesided.el.content
					],
            nav: {
                name: SampleSizeTwoMeans.t('navigation'),
                icon: "icon-t2",
				datasetRequired: false,
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: SampleSizeTwoMeans.t('help.title'),
            r_help: SampleSizeTwoMeans.t('help.r_help'), //r_help: "help(data,package='utils')",
            body: SampleSizeTwoMeans.t('help.body')
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
		let meangrp1spec=code_vars.selected.meangrp1.toString();
		let meangrp2spec=code_vars.selected.meangrp2.toString();
		
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

		let meangrp1final="";
		if (meangrp1spec=="") {
			meangrp1final="treat=NA, ";
		} else {
			meangrp1final="treat="+meangrp1spec+", ";
		}		

		let meangrp2final="";
		if (meangrp2spec=="") {
			meangrp2final="control=NA, ";
		} else {
			meangrp2final="control="+meangrp2spec+", ";
		}		
	
		//create new variables under code_vars
		code_vars.selected.nfinal = nfinal
		code_vars.selected.powerfinal = powerfinal
		code_vars.selected.meangrp1final = meangrp1final
		code_vars.selected.meangrp2final = meangrp2final
		
		
		//final piece of code
            const cmd = instance.dialog.renderR(code_vars);
            res.push({ cmd: cmd, cgid: newCommandGroup(`${instance.config.id}`, `${instance.config.label}`), oriR: instance.config.RCode, code_vars: code_vars })
            return res;		
	}	
		
	
}

module.exports = {
    render: () => new SampleSizeTwoMeans().render()
}
