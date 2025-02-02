










class SampleSizeANOVA extends baseModal {
    static dialogId = 'SampleSizeANOVA'
    static t = baseModal.makeT(SampleSizeANOVA.dialogId)

    constructor() {
        var config = {
            id: SampleSizeANOVA.dialogId,
            label: SampleSizeANOVA.t('title'),
			splitProcessing: false,
            modalType: "one",
            RCode: `
power_result <- power.anova.test(groups={{selected.numgrps | safe}}, {{selected.n | safe}} {{selected.grpmeans | safe}} {{selected.power | safe}} within.var={{selected.sd | safe}}^2, sig.level={{selected.siglevel | safe}})

spec_meanssd <- data.frame(means="{{selected.meansonly | safe}}", sd={{selected.sd | safe}})

BSkyFormat(spec_meanssd, singleTableOutputHeader="Specified Group Means and Common Pooled Standard Deviation")
BSkyFormat(unlist(power_result), singleTableOutputHeader="Power Results")
`
        };
        var objects = {
			howtouse: {
				el: new preVar(config, {
					no: "howtouse",
					label: SampleSizeANOVA.t('howtouse'), 
					h:5
				})
			},
			numgrps: {
				el: new inputSpinner(config, {
					no: 'numgrps',
					label: SampleSizeANOVA.t('numgrps'),
					style: "mt-5",
					min: 2,
					max: 10000,
					step: 1,
					value: 3,
					extraction: "NoPrefix|UseComma"
				})
			},			
			n: {
				el: new input(config, {
					no: 'n',
					label: SampleSizeANOVA.t('n'),
					placeholder: "",
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					wrapped: "n=%val%, ",
					width:"w-25"
				})
			},
			grpmeans: {
				el: new input(config, {
					no: 'grpmeans',
					label: SampleSizeANOVA.t('grpmeans'),
					type: "character",
					allow_spaces: true,
					value: "20, 25, 40",
					extraction: "TextAsIs",
					wrapped: "between.var=var(c(%val%)), ",
					width:"w-50"
				})
			},			
			power: {
				el: new input(config, {
					no: 'power',
					label: SampleSizeANOVA.t('power'),
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces:true,
					value: ".8",
					wrapped: "power=%val%, ",
					width:"w-25"
				})
			},			
			sd: {
				el: new input(config, {
					no: 'sd',
					label: SampleSizeANOVA.t('sd'),
					style: "mt-5",
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
					label: SampleSizeANOVA.t('siglevel'),
					placeholder: ".05",
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					required: true,
					value: ".05",
					width:"w-25"
				})
			}			
        };
        const content = {
            items: [objects.howtouse.el.content, objects.numgrps.el.content, objects.n.el.content, objects.grpmeans.el.content, objects.power.el.content, 
					objects.sd.el.content, objects.siglevel.el.content
					],
            nav: {
                name: SampleSizeANOVA.t('navigation'),
                icon: "icon-variance",
				datasetRequired: false,
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: SampleSizeANOVA.t('help.title'),
            r_help: SampleSizeANOVA.t('help.r_help'), //r_help: "help(data,package='utils')",
            body: SampleSizeANOVA.t('help.body')
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
		let meansonly=code_vars.selected.grpmeans.slice(18, -4).trim();
	
		//create new variables under code_vars
		code_vars.selected.meansonly = meansonly		
		
		//final piece of code
            const cmd = instance.dialog.renderR(code_vars);
            res.push({ cmd: cmd, cgid: newCommandGroup(`${instance.config.id}`, `${instance.config.label}`), oriR: instance.config.RCode, code_vars: code_vars })
            return res;		
	}

	
}

module.exports = {
    render: () => new SampleSizeANOVA().render()
}
