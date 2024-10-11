










class PrecisionAUC extends baseModal {
    static dialogId = 'PrecisionAUC'
    static t = baseModal.makeT(PrecisionAUC.dialogId)

    constructor() {
        var config = {
            id: PrecisionAUC.dialogId,
            label: PrecisionAUC.t('title'),
			splitProcessing: false,
            modalType: "one",
            RCode: `
library(presize)

precision_result <- prec_auc(auc={{selected.auc | safe}}, {{selected.n | safe}}  {{selected.width | safe}} conf.level={{selected.conflevel | safe}}, prev={{selected.prev | safe}}) 

BSkyFormat(unlist(precision_result), singleTableOutputHeader="Precision Results")
`
        };
        var objects = {
			howtouse: {
				el: new labelVar(config, {
					label: PrecisionAUC.t('howtouse'), 
					style: "mb-3", 
					h:8
				})
			},
			n: {
				el: new input(config, {
					no: 'n',
					label: PrecisionAUC.t('n'),
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
					label: PrecisionAUC.t('width'),
					placeholder: "",
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					value: "",
					width:"w-25",
					wrapped: "conf.width=%val%, "
				})
			},
			auc: {
				el: new input(config, {
					no: 'auc',
					label: PrecisionAUC.t('auc'),
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
					label: PrecisionAUC.t('conflevel'),
					placeholder: ".95",
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					required: true,
					value: ".95",
					width:"w-25"
				})
			},
			prev: {
				el: new input(config, {
					no: 'prev',
					label: PrecisionAUC.t('prev'),
					placeholder: "",
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					required: true,
					value: "",
					width:"w-25"
				})
			}		
        };
        const content = {
            items: [objects.howtouse.el.content, objects.n.el.content, objects.width.el.content, 
					objects.auc.el.content, objects.conflevel.el.content, objects.prev.el.content
					],
            nav: {
                name: PrecisionAUC.t('navigation'),
                icon: "icon-auc",
				datasetRequired: false,
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: PrecisionAUC.t('help.title'),
            r_help: "help(data,package='utils')",
            body: PrecisionAUC.t('help.body')
        }
;
    }
		
	
}

module.exports = {
    render: () => new PrecisionAUC().render()
}
