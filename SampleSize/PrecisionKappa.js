










class PrecisionKappa extends baseModal {
    static dialogId = 'PrecisionKappa'
    static t = baseModal.makeT(PrecisionKappa.dialogId)

    constructor() {
        var config = {
            id: PrecisionKappa.dialogId,
            label: PrecisionKappa.t('title'),
			splitProcessing: false,
            modalType: "one",
            RCode: `
library(presize)

precision_result <- prec_kappa(kappa={{selected.kappa | safe}}, {{selected.n | safe}}  {{selected.width | safe}} conf.level={{selected.conflevel | safe}}, raters={{selected.raters | safe}}, n_category={{selected.categories | safe}}, props=c({{selected.props | safe}})) 
spec_values <- data.frame(raters={{selected.raters | safe}}, n_categories={{selected.categories}}, proportions="{{selected.props | safe}}")

BSkyFormat(spec_values, singleTableOutputHeader="Specified number of raters, number of categories, and proportions in each category")
BSkyFormat(unlist(precision_result), singleTableOutputHeader="Precision Results")
`
        };
        var objects = {
			howtouse: {
				el: new labelVar(config, {
					label: PrecisionKappa.t('howtouse'), 
					style: "mb-3", 
					h:8
				})
			},
			n: {
				el: new input(config, {
					no: 'n',
					label: PrecisionKappa.t('n'),
					placeholder: "",
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					value: "",
					width:"w-25",
					wrapped: "n=%val%, "
				})
			},
			width: {
				el: new input(config, {
					no: 'width',
					label: PrecisionKappa.t('width'),
					placeholder: "",
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					value: "",
					width:"w-25",
					wrapped: "conf.width=%val%, "
				})
			},
			kappa: {
				el: new input(config, {
					no: 'kappa',
					label: PrecisionKappa.t('kappa'),
					style: "mt-5",
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
					label: PrecisionKappa.t('conflevel'),
					placeholder: ".95",
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					required: true,
					value: ".95",
					width:"w-25"
				})
			},
			raters: {
				el: new inputSpinner(config, {
					no: 'raters',
					label: PrecisionKappa.t('raters'),
					min: 2,
					max: 6,
					step: 1,
					value: 2,
					extraction: "NoPrefix|UseComma"
				})
			},
			categories: {
				el: new inputSpinner(config, {
					no: 'categories',
					label: PrecisionKappa.t('categories'),
					style: "mt-5",
					min: 2,
					max: 5,
					step: 1,
					value: 2,
					extraction: "NoPrefix|UseComma"
				})
			},
			props: {
				el: new input(config, {
					no: 'props',
					label: PrecisionKappa.t('props'),
					style: "ml-5",
					placeholder: "",
					extraction: "TextAsIs",
					type: "character",
					allow_spaces: true,
					required: true,
					value: "",
					width:"w-50"
				})
			}			
        };
        const content = {
            items: [objects.howtouse.el.content, objects.n.el.content, objects.width.el.content, 
					objects.kappa.el.content, objects.conflevel.el.content, objects.raters.el.content, objects.categories.el.content, objects.props.el.content
					],
            nav: {
                name: PrecisionKappa.t('navigation'),
                icon: "icon-kappa_cohen",
				datasetRequired: false,
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: PrecisionKappa.t('help.title'),
            r_help: PrecisionKappa.t('help.r_help'), //r_help: "help(data,package='utils')",
            body: PrecisionKappa.t('help.body')
        }
;
    }
		
	
}

module.exports = {
    render: () => new PrecisionKappa().render()
}
