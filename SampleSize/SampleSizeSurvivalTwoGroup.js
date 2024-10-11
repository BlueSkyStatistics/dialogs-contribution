










class SampleSizeSurvivalTwoGroup extends baseModal {
    static dialogId = 'SampleSizeSurvivalTwoGroup'
    static t = baseModal.makeT(SampleSizeSurvivalTwoGroup.dialogId)

    constructor() {
        var config = {
            id: SampleSizeSurvivalTwoGroup.dialogId,
            label: SampleSizeSurvivalTwoGroup.t('title'),
			splitProcessing: false,
            modalType: "one",
            RCode: `
library(powerSurvEpi)

{{if (options.selected.power!="")}}
# computing sample size
alpha_touse <- {{selected.siglevel}}*(2/{{selected.altgrp | safe}})
power_result <- ssizeEpiCont.default(power={{selected.power | safe}}, theta={{selected.hr | safe}}, sigma2={{selected.propgrp1 | safe}}*(1-{{selected.propgrp1 | safe}}), psi={{selected.propevent | safe}}, rho2={{selected.rsquared | safe}}, alpha=alpha_touse)
power_table <- data.frame(power={{selected.power | safe}}, prop.group1={{selected.propgrp1 | safe}}, prop.group2=1-{{selected.propgrp1 | safe}}, hr={{selected.hr | safe}}, prop.event={{selected.propevent | safe}}, r.squared={{selected.rsquared | safe}}, siglevel={{selected.siglevel | safe}}, sides={{selected.altgrp | safe}}, n.total=power_result)
{{/if}}
{{if (options.selected.power=="")}}
# computing power
alpha_touse <- {{selected.siglevel}}*(2/{{selected.altgrp | safe}})
power_result <- powerEpiCont.default(n={{selected.n | safe}}, theta={{selected.hr | safe}}, sigma2={{selected.propgrp1 | safe}}*(1-{{selected.propgrp1 | safe}}), psi={{selected.propevent | safe}}, rho2={{selected.rsquared | safe}}, alpha=alpha_touse)
power_table <- data.frame(n.total={{selected.n | safe}}, prop.group1={{selected.propgrp1 | safe}}, prop.group2=1-{{selected.propgrp1 | safe}}, hr={{selected.hr | safe}}, prop.event={{selected.propevent | safe}}, r.squared={{selected.rsquared | safe}}, siglevel={{selected.siglevel | safe}}, sides={{selected.altgrp | safe}}, power=power_result)
{{/if}}

BSkyFormat(power_table, singleTableOutputHeader="Power Results")
`
        };
        var objects = {
			howtouse: {
				el: new preVar(config, {
					no: "howtouse",
					label: SampleSizeSurvivalTwoGroup.t('howtouse'), 
					h:5
				})
			},
			n: {
				el: new input(config, {
					no: 'n',
					label: SampleSizeSurvivalTwoGroup.t('n'),
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
					label: SampleSizeSurvivalTwoGroup.t('power'),
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
					label: SampleSizeSurvivalTwoGroup.t('propgrp1'),
					style: "mt-5",
					required: true,
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					value: ".5",
					width:"w-25"
				})
			},
			hr: {
				el: new input(config, {
					no: 'hr',
					label: SampleSizeSurvivalTwoGroup.t('hr'),
					required: true,
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					value: "2",
					width:"w-25"
				})
			},
			propevent: {
				el: new input(config, {
					no: 'propevent',
					label: SampleSizeSurvivalTwoGroup.t('propevent'),
					required: true,
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					value: "1",
					width:"w-25"
				})
			},
			rsquared: {
				el: new input(config, {
					no: 'rsquared',
					label: SampleSizeSurvivalTwoGroup.t('rsquared'),
					required: true,
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					value: "0",
					width:"w-25"
				})
			},			
			siglevel: {
				el: new input(config, {
					no: 'siglevel',
					label: SampleSizeSurvivalTwoGroup.t('siglevel'),
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
					label: SampleSizeSurvivalTwoGroup.t('alternativeopt'), 
					style: "mt-5", 
					h:5
				})
			},
			twosided: {
				el: new radioButton(config, {
					label: SampleSizeSurvivalTwoGroup.t('twosided'),
					no: "altgrp",
					increment: "twosided",
					value: "2",
					state: "checked",
					extraction: "ValueAsIs"
				})
			}, 
			onesided: {
				el: new radioButton(config, {
					label: SampleSizeSurvivalTwoGroup.t('onesided'),
					no: "altgrp",
					increment: "onesided",
					value: "1",
					state: "",
					extraction: "ValueAsIs"
				})
			}			
        };
        const content = {
            items: [objects.howtouse.el.content, objects.n.el.content, objects.power.el.content, objects.propgrp1.el.content, 
					objects.hr.el.content, objects.propevent.el.content, objects.rsquared.el.content, objects.siglevel.el.content, 
					objects.alternativeopt.el.content, objects.twosided.el.content, objects.onesided.el.content
					],
            nav: {
                name: SampleSizeSurvivalTwoGroup.t('navigation'),
                icon: "icon-kaplanc",
				datasetRequired: false,
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: SampleSizeSurvivalTwoGroup.t('help.title'),
            r_help: "help(data,package='utils')",
            body: SampleSizeSurvivalTwoGroup.t('help.body')
        }
;
    }
		
	
}

module.exports = {
    render: () => new SampleSizeSurvivalTwoGroup().render()
}
