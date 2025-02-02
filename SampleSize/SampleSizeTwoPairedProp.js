










class SampleSizeTwoPairedProp extends baseModal {
    static dialogId = 'SampleSizeTwoPairedProp'
    static t = baseModal.makeT(SampleSizeTwoPairedProp.dialogId)

    constructor() {
        var config = {
            id: SampleSizeTwoPairedProp.dialogId,
            label: SampleSizeTwoPairedProp.t('title'),
			splitProcessing: false,
            modalType: "one",
            RCode: `
pdisc <- {{selected.pdisc | safe}}\n
pdiff <- {{selected.pdiff | safe}}\n

{{if ((options.selected.n=="") & (options.selected.altgrp==2))}}
# computing n, two-sided test
n_result <- ceiling(((qnorm(1-{{selected.siglevel | safe}}/{{selected.altgrp | safe}})*sqrt(pdisc)+qnorm({{selected.power | safe}})*sqrt(pdisc-pdiff^2))/pdiff)^2)
power_table <- data.frame(n_pairs=n_result, power={{selected.power | safe}}, prop_discordant={{selected.pdisc | safe}}, prop_difference={{selected.pdiff | safe}}, siglevel={{selected.siglevel | safe}}, sides={{selected.altgrp | safe}})
{{/if}}
{{if ((options.selected.power=="") & (options.selected.altgrp==2))}}
# computing power, two-sided test
x1 <- (pdiff*sqrt({{selected.n | safe}})-qnorm(1-{{selected.siglevel | safe}}/2)*sqrt(pdisc))/sqrt(pdisc-pdiff^2)
x2 <- (-pdiff*sqrt({{selected.n | safe}})-qnorm(1-{{selected.siglevel}}/2)*sqrt(pdisc))/sqrt(pdisc-pdiff^2)
power_result <- pnorm(x1)+pnorm(x2)
power_table <- data.frame(n_pairs={{selected.n | safe}}, power=power_result, prop_discordant={{selected.pdisc | safe}}, prop_difference={{selected.pdiff | safe}}, siglevel={{selected.siglevel | safe}}, sides={{selected.altgrp | safe}})
{{/if}}
{{if ((options.selected.n=="") & (options.selected.altgrp==1))}}
# computing n, one-sided test
n_result <- ceiling(((qnorm(1-{{selected.siglevel | safe}})*sqrt(pdisc)+qnorm({{selected.power | safe}})*sqrt(pdisc-pdiff^2))/pdiff)^2)
power_table <- data.frame(n_pairs=n_result, power={{selected.power | safe}}, prop_discordant={{selected.pdisc | safe}}, prop_difference={{selected.pdiff | safe}}, siglevel={{selected.siglevel | safe}}, sides={{selected.altgrp | safe}})
{{/if}}
{{if ((options.selected.power=="") & (options.selected.altgrp==1))}}
# computing power, one-sided test
x <- (abs(pdiff)*sqrt({{selected.n | safe}})-qnorm(1-{{selected.siglevel | safe}})*sqrt(pdisc))/sqrt(pdisc-pdiff^2)
power_result <- pnorm(x)
power_table <- data.frame(n_pairs={{selected.n | safe}}, power=power_result, prop_discordant={{selected.pdisc | safe}}, prop_difference={{selected.pdiff | safe}}, siglevel={{selected.siglevel | safe}}, sides={{selected.altgrp | safe}})
{{/if}}

BSkyFormat(power_table, singleTableOutputHeader="Power Results")
`
        };
        var objects = {
			howtouse: {
				el: new preVar(config, {
					no: "howtouse",
					label: SampleSizeTwoPairedProp.t('howtouse'), 
					h:5
				})
			},
			n: {
				el: new input(config, {
					no: 'n',
					label: SampleSizeTwoPairedProp.t('n'),
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
					label: SampleSizeTwoPairedProp.t('power'),
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces:true,
					value: ".8",
					width:"w-25"
				})
			},			
			pdisc: {
				el: new input(config, {
					no: 'pdisc',
					label: SampleSizeTwoPairedProp.t('pdisc'),
					style: "mt-5",
					required: true,
					placeholder: "",
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					value: "",
					width:"w-25"
				})
			},
			pdiff: {
				el: new input(config, {
					no: 'pdiff',
					label: SampleSizeTwoPairedProp.t('pdiff'),
					required: true,
					placeholder: "",
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					value: "",
					width:"w-25"
				})
			},		
			siglevel: {
				el: new input(config, {
					no: 'siglevel',
					label: SampleSizeTwoPairedProp.t('siglevel'),
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
					label: SampleSizeTwoPairedProp.t('alternativeopt'), 
					style: "mt-5", 
					h:5
				})
			},
			twosided: {
				el: new radioButton(config, {
					label: SampleSizeTwoPairedProp.t('twosided'),
					no: "altgrp",
					increment: "twosided",
					value: "2",
					state: "checked",
					extraction: "ValueAsIs"
				})
			}, 
			onesided: {
				el: new radioButton(config, {
					label: SampleSizeTwoPairedProp.t('onesided'),
					no: "altgrp",
					increment: "onesided",
					value: "1",
					state: "",
					extraction: "ValueAsIs"
				})
			}		
        };
        const content = {
            items: [objects.howtouse.el.content, objects.n.el.content, objects.power.el.content, objects.pdisc.el.content, objects.pdiff.el.content, 
					objects.siglevel.el.content, objects.alternativeopt.el.content, objects.twosided.el.content, objects.onesided.el.content
					],
            nav: {
                name: SampleSizeTwoPairedProp.t('navigation'),
                icon: "icon-pairedprop",
				datasetRequired: false,
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: SampleSizeTwoPairedProp.t('help.title'),
            r_help: SampleSizeTwoPairedProp.t('help.r_help'), //r_help: "help(data,package='utils')",
            body: SampleSizeTwoPairedProp.t('help.body')
        }
;
    }
	
}

module.exports = {
    render: () => new SampleSizeTwoPairedProp().render()
}
