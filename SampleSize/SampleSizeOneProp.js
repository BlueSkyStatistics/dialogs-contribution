










class SampleSizeOneProp extends baseModal {
    static dialogId = 'SampleSizeOneProp'
    static t = baseModal.makeT(SampleSizeOneProp.dialogId)

    constructor() {
        var config = {
            id: SampleSizeOneProp.dialogId,
            label: SampleSizeOneProp.t('title'),
			splitProcessing: false,
            modalType: "one",
            RCode: `
{{if ((options.selected.n=="") & (options.selected.altgrp=="two.sided"))}}
# computing sample size, two-sided
p <- {{selected.prop | safe}}\n
p0 <- {{selected.prop0 | safe}}\n
alpha <- {{selected.siglevel | safe}}\n
power <- {{selected.power | safe}}\n
n_result <- p*(1-p)*((qnorm(1-alpha/2)+qnorm(power))/(p-p0))^2

power_table <- data.frame(n=n_result, p=p, p0=p0, sig.level=alpha, power=power, sides="two-sided")

BSkyFormat(power_table, singleTableOutputHeader="Sample Size Results")
{{/if}}

{{if ((options.selected.n=="") & (options.selected.altgrp=="one.sided"))}}
# computing sample size, one-sided
p <- {{selected.prop | safe}}\n
p0 <- {{selected.prop0 | safe}}\n
alpha <- {{selected.siglevel | safe}}\n
power <- {{selected.power | safe}}\n
n_result <- p*(1-p)*((qnorm(1-alpha)+qnorm(power))/(p-p0))^2

power_table <- data.frame(n=n_result, p=p, p0=p0, sig.level=alpha, power=power, sides="one-sided")

BSkyFormat(power_table, singleTableOutputHeader="Sample Size Results")
{{/if}}

{{if ((options.selected.n!="") & (options.selected.altgrp=="two.sided"))}}
# computing power, two-sided
p <- {{selected.prop | safe}}\n
p0 <- {{selected.prop0 | safe}}\n
alpha <- {{selected.siglevel | safe}}\n
n <- {{selected.n | safe}}\n
z <- (p-p0)/sqrt(p*(1-p)/n)
power_result <- pnorm(z-qnorm(1-alpha/2))+pnorm(-z-qnorm(1-alpha/2))

power_table <- data.frame(n=n, p=p, p0=p0, sig.level=alpha, power=power_result, sides="two-sided")

BSkyFormat(power_table, singleTableOutputHeader="Sample Size Results")
{{/if}}

{{if ((options.selected.n!="") & (options.selected.altgrp=="one.sided"))}}
# computing power, one-sided
p <- {{selected.prop | safe}}\n
p0 <- {{selected.prop0 | safe}}\n
alpha <- {{selected.siglevel | safe}}\n
n <- {{selected.n | safe}}\n
z <- (p-p0)/sqrt(p*(1-p)/n)
power_result <- pnorm(z-qnorm(1-alpha))+pnorm(-z-qnorm(1-alpha))

power_table <- data.frame(n=n, p=p, p0=p0, sig.level=alpha, power=power_result, sides="one-sided")

BSkyFormat(power_table, singleTableOutputHeader="Sample Size Results")
{{/if}}
`
        };
        var objects = {
			howtouse: {
				el: new labelVar(config, {
					label: SampleSizeOneProp.t('howtouse'), 
					style: "mb-3", 
					h:8
				})
			},
			n: {
				el: new input(config, {
					no: 'n',
					label: SampleSizeOneProp.t('n'),
					placeholder: "",
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					value: "",
					width:"w-25"
				})
			},
			power: {
				el: new input(config, {
					no: 'power',
					label: SampleSizeOneProp.t('power'),
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces:true,
					value: ".8",
					width:"w-25"
				})
			},			
			prop: {
				el: new input(config, {
					no: 'prop',
					label: SampleSizeOneProp.t('prop'),
					required: true,
					style: "mt-5",
					placeholder: "",
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					value: "",
					width:"w-25"
				})
			},
			prop0: {
				el: new input(config, {
					no: 'prop0',
					label: SampleSizeOneProp.t('prop0'),
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
					label: SampleSizeOneProp.t('siglevel'),
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
					label: SampleSizeOneProp.t('alternativeopt'), 
					style: "mt-5", 
					h:5
				})
			},
			twosided: {
				el: new radioButton(config, {
					label: SampleSizeOneProp.t('twosided'),
					no: "altgrp",
					increment: "twosided",
					value: "two.sided",
					state: "checked",
					extraction: "ValueAsIs"
				})
			}, 
			onesided: {
				el: new radioButton(config, {
					label: SampleSizeOneProp.t('onesided'),
					no: "altgrp",
					increment: "onesided",
					value: "one.sided",
					state: "",
					extraction: "ValueAsIs"
				})
			}		
        };
        const content = {
            items: [objects.howtouse.el.content, objects.n.el.content, objects.power.el.content, objects.prop.el.content, objects.prop0.el.content, objects.siglevel.el.content,
					objects.alternativeopt.el.content, objects.twosided.el.content, objects.onesided.el.content
					],
            nav: {
                name: SampleSizeOneProp.t('navigation'),
                icon: "icon-p1",
				datasetRequired: false,
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: SampleSizeOneProp.t('help.title'),
            r_help: "help(data,package='utils')",
            body: SampleSizeOneProp.t('help.body')
        }
;
    }
		
	
}

module.exports = {
    render: () => new SampleSizeOneProp().render()
}
