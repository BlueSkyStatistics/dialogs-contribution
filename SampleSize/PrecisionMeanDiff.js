










class PrecisionMeanDiff extends baseModal {
    static dialogId = 'PrecisionMeanDiff'
    static t = baseModal.makeT(PrecisionMeanDiff.dialogId)

    constructor() {
        var config = {
            id: PrecisionMeanDiff.dialogId,
            label: PrecisionMeanDiff.t('title'),
			splitProcessing: false,
            modalType: "one",
            RCode: `
library(presize)

precision_result <- prec_meandiff(delta={{selected.meandiff | safe}}, {{selected.n1 | safe}}  {{selected.width | safe}} conf.level={{selected.conflevel | safe}}, r={{selected.ratio | safe}}, sd1={{selected.sd1 | safe}}, sd2={{selected.sd2 | safe}}, variance="{{selected.variance | safe}}") 

BSkyFormat(unlist(precision_result), singleTableOutputHeader="Precision Results")
`
        };
        var objects = {
			howtouse: {
				el: new labelVar(config, {
					label: PrecisionMeanDiff.t('howtouse'), 
					style: "mb-3", 
					h:8
				})
			},
			n1: {
				el: new input(config, {
					no: 'n1',
					label: PrecisionMeanDiff.t('n1'),
					placeholder: "",
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					value: "",
					width:"w-25",
					wrapped: "n1=%val%, "
				})
			},
			width: {
				el: new input(config, {
					no: 'width',
					label: PrecisionMeanDiff.t('width'),
					placeholder: "",
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					value: "",
					width:"w-25",
					wrapped: "conf.width=%val%, "
				})
			},
			ratio: {
				el: new input(config, {
					no: 'ratio',
					label: PrecisionMeanDiff.t('ratio'),
					style: "mt-5",
					required: true,
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces:true,
					value: "1",
					width:"w-25"
				})
			},			
			meandiff: {
				el: new input(config, {
					no: 'meandiff',
					label: PrecisionMeanDiff.t('meandiff'),
					required: true,
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces:true,
					value: "",
					width:"w-25"
				})
			},
			sd1: {
				el: new input(config, {
					no: 'sd1',
					label: PrecisionMeanDiff.t('sd1'),
					required: true,
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces:true,
					value: "",
					width:"w-25"
				})
			},
			sd2: {
				el: new input(config, {
					no: 'sd2',
					label: PrecisionMeanDiff.t('sd2'),
					required: true,
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces:true,
					value: "",
					width:"w-25"
				})
			},			
			conflevel: {
				el: new input(config, {
					no: 'conflevel',
					label: PrecisionMeanDiff.t('conflevel'),
					placeholder: ".95",
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					required: true,
					value: ".95",
					width:"w-25"
				})
			},
			variance: {
				el: new comboBox(config, {
					no: "variance",
					label: PrecisionMeanDiff.t('variance'),
					multiple: false,
					extraction: "NoPrefix|UseComma",
					options: ["equal", "unequal"],
					default: "equal"
				})
			}			
        };
        const content = {
            items: [objects.howtouse.el.content, objects.n1.el.content, objects.width.el.content, 
					objects.ratio.el.content, objects.meandiff.el.content, objects.sd1.el.content, objects.sd2.el.content, objects.conflevel.el.content, objects.variance.el.content
					],
            nav: {
                name: PrecisionMeanDiff.t('navigation'),
                icon: "icon-t2",
				datasetRequired: false,
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: PrecisionMeanDiff.t('help.title'),
            r_help: "help(data,package='utils')",
            body: PrecisionMeanDiff.t('help.body')
        }
;
    }
		
	
}

module.exports = {
    render: () => new PrecisionMeanDiff().render()
}
