










class PrecisionOneMean extends baseModal {
    static dialogId = 'PrecisionOneMean'
    static t = baseModal.makeT(PrecisionOneMean.dialogId)

    constructor() {
        var config = {
            id: PrecisionOneMean.dialogId,
            label: PrecisionOneMean.t('title'),
			splitProcessing: false,
            modalType: "one",
            RCode: `
library(presize)

precision_result <- prec_mean(mean={{selected.mean | safe}}, {{selected.n | safe}}  {{selected.width | safe}} conf.level={{selected.conflevel | safe}}, sd={{selected.sd | safe}}) 

BSkyFormat(unlist(precision_result), singleTableOutputHeader="Precision Results")
`
        };
        var objects = {
			howtouse: {
				el: new labelVar(config, {
					label: PrecisionOneMean.t('howtouse'), 
					style: "mb-3", 
					h:8
				})
			},
			n: {
				el: new input(config, {
					no: 'n',
					label: PrecisionOneMean.t('n'),
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
					label: PrecisionOneMean.t('width'),
					placeholder: "",
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					value: "",
					width:"w-25",
					wrapped: "conf.width=%val%, "
				})
			},
			mean: {
				el: new input(config, {
					no: 'mean',
					label: PrecisionOneMean.t('mean'),
					style: "mt-5",
					required: true,
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces:true,
					value: "",
					width:"w-25"
				})
			},
			sd: {
				el: new input(config, {
					no: 'sd',
					label: PrecisionOneMean.t('sd'),
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
					label: PrecisionOneMean.t('conflevel'),
					placeholder: ".95",
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					required: true,
					value: ".95",
					width:"w-25"
				})
			}		
        };
        const content = {
            items: [objects.howtouse.el.content, objects.n.el.content, objects.width.el.content, 
					objects.mean.el.content, objects.sd.el.content, objects.conflevel.el.content
					],
            nav: {
                name: PrecisionOneMean.t('navigation'),
                icon: "icon-t1",
				datasetRequired: false,
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: PrecisionOneMean.t('help.title'),
            r_help: "help(data,package='utils')",
            body: PrecisionOneMean.t('help.body')
        }
;
    }
		
	
}

module.exports = {
    render: () => new PrecisionOneMean().render()
}
