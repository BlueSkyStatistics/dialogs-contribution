










class SampleSizeOneMean extends baseModal {
    static dialogId = 'SampleSizeOneMean'
    static t = baseModal.makeT(SampleSizeOneMean.dialogId)

    constructor() {
        var config = {
            id: SampleSizeOneMean.dialogId,
            label: SampleSizeOneMean.t('title'),
			splitProcessing: false,
            modalType: "one",
            RCode: `
library(broom)
power_result <- power.t.test({{selected.n | safe}} {{selected.delta | safe}} {{selected.power | safe}} sd={{selected.sd | safe}}, sig.level={{selected.siglevel | safe}}, type="one.sample", alternative="{{selected.altgrp | safe}}")
power_table <- as.data.frame(tidy(power_result))
power_table$sides <- "{{selected.altgrp}}"

BSkyFormat(power_table, singleTableOutputHeader="Sample Size Results")
`
        };
        var objects = {
			howtouse: {
				el: new labelVar(config, {
					label: SampleSizeOneMean.t('howtouse'), 
					style: "mb-3", 
					h:8
				})
			},
			n: {
				el: new input(config, {
					no: 'n',
					label: SampleSizeOneMean.t('n'),
					placeholder: "",
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					value: "",
					width:"w-25",
					wrapped: "n=%val%, "
				})
			},
			delta: {
				el: new input(config, {
					no: 'delta',
					label: SampleSizeOneMean.t('delta'),
					placeholder: "",
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					value: "",
					width:"w-25",
					wrapped: "delta=%val%, "
				})
			},
			power: {
				el: new input(config, {
					no: 'power',
					label: SampleSizeOneMean.t('power'),
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces:true,
					value: ".8",
					width:"w-25",
					wrapped: "power=%val%, "
				})
			},
			sd: {
				el: new input(config, {
					no: 'sd',
					label: SampleSizeOneMean.t('sd'),
					style: "mt-5",
					placeholder: "",
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					required: true,
					value: "",
					width:"w-25"
				})
			},
			siglevel: {
				el: new input(config, {
					no: 'siglevel',
					label: SampleSizeOneMean.t('siglevel'),
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
					label: SampleSizeOneMean.t('alternativeopt'), 
					style: "mt-5", 
					h:5
				})
			},
			twosided: {
				el: new radioButton(config, {
					label: SampleSizeOneMean.t('twosided'),
					no: "altgrp",
					increment: "twosided",
					value: "two.sided",
					state: "checked",
					extraction: "ValueAsIs"
				})
			}, 
			onesided: {
				el: new radioButton(config, {
					label: SampleSizeOneMean.t('onesided'),
					no: "altgrp",
					increment: "onesided",
					value: "one.sided",
					state: "",
					extraction: "ValueAsIs"
				})
			}		
        };
        const content = {
            items: [objects.howtouse.el.content, objects.n.el.content, objects.delta.el.content, objects.power.el.content, objects.sd.el.content, objects.siglevel.el.content,
					objects.alternativeopt.el.content, objects.twosided.el.content, objects.onesided.el.content
					],
            nav: {
                name: SampleSizeOneMean.t('navigation'),
                icon: "icon-t1",
				datasetRequired: false,
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: SampleSizeOneMean.t('help.title'),
            r_help: SampleSizeOneMean.t('help.r_help'), //r_help: "help(data,package='utils')",
            body: SampleSizeOneMean.t('help.body')
        }
;
    }
		
	
}

module.exports = {
    render: () => new SampleSizeOneMean().render()
}
