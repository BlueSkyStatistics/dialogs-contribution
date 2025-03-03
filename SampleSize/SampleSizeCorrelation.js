/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */












class SampleSizeCorrelation extends baseModal {
    static dialogId = 'SampleSizeCorrelation'
    static t = baseModal.makeT(SampleSizeCorrelation.dialogId)

    constructor() {
        var config = {
            id: SampleSizeCorrelation.dialogId,
            label: SampleSizeCorrelation.t('title'),
			splitProcessing: false,
            modalType: "one",
            RCode: `
library(pwr)

power_result <- pwr.r.test({{selected.n | safe}} {{selected.corr | safe}} {{selected.power | safe}} sig.level = {{selected.siglevel | safe}}, alternative = "{{selected.altgrp | safe}}")
BSkyFormat(unlist(power_result), singleTableOutputHeader="Power Results")
`
        };
        var objects = {
			howtouse: {
				el: new preVar(config, {
					no: "howtouse",
					label: SampleSizeCorrelation.t('howtouse'), 
					h:5
				})
			},
			n: {
				el: new input(config, {
					no: 'n',
					label: SampleSizeCorrelation.t('n'),
					placeholder: "",
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					wrapped: "n=%val%, ",
					width:"w-25"
				})
			},
			corr: {
				el: new input(config, {
					no: 'corr',
					label: SampleSizeCorrelation.t('corr'),
					value: ".3",
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					wrapped: "r=%val%, ",
					width:"w-25"
				})
			},			
			power: {
				el: new input(config, {
					no: 'power',
					label: SampleSizeCorrelation.t('power'),
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces:true,
					value: ".8",
					wrapped: "power=%val%, ",
					width:"w-25"
				})
			},			
			siglevel: {
				el: new input(config, {
					no: 'siglevel',
					label: SampleSizeCorrelation.t('siglevel'),
					style: "mt-5",
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
					label: SampleSizeCorrelation.t('alternativeopt'), 
					style: "mt-5", 
					h:5
				})
			},
			twosided: {
				el: new radioButton(config, {
					label: SampleSizeCorrelation.t('twosided'),
					no: "altgrp",
					increment: "twosided",
					value: "two.sided",
					state: "checked",
					extraction: "ValueAsIs"
				})
			}, 
			greater: {
				el: new radioButton(config, {
					label: SampleSizeCorrelation.t('greater'),
					no: "altgrp",
					increment: "greater",
					value: "greater",
					state: "",
					extraction: "ValueAsIs"
				})
			},
			less: {
				el: new radioButton(config, {
					label: SampleSizeCorrelation.t('less'),
					no: "altgrp",
					increment: "less",
					value: "less",
					state: "",
					extraction: "ValueAsIs"
				})
			}			
        };
        const content = {
            items: [objects.howtouse.el.content, objects.n.el.content, objects.corr.el.content, objects.power.el.content, 
					objects.siglevel.el.content, objects.alternativeopt.el.content, objects.twosided.el.content, objects.greater.el.content, objects.less.el.content
					],
            nav: {
                name: SampleSizeCorrelation.t('navigation'),
                icon: "icon-link",
				datasetRequired: false,
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: SampleSizeCorrelation.t('help.title'),
            r_help: SampleSizeCorrelation.t('help.r_help'), //r_help: "help(data,package='utils')",
            body: SampleSizeCorrelation.t('help.body')
        }
;
    }
	
}

module.exports = {
    render: () => new SampleSizeCorrelation().render()
}
