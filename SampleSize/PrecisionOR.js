










class PrecisionOR extends baseModal {
    static dialogId = 'PrecisionOR'
    static t = baseModal.makeT(PrecisionOR.dialogId)

    constructor() {
        var config = {
            id: PrecisionOR.dialogId,
            label: PrecisionOR.t('title'),
			splitProcessing: false,
            modalType: "one",
            RCode: `
library(presize)

precision_result <- prec_or({{selected.n1 | safe}}  {{selected.width | safe}} conf.level={{selected.conflevel | safe}}, r={{selected.ratio | safe}}, p1={{selected.prop1 | safe}}, p2={{selected.prop2 | safe}}, method="{{selected.method | safe}}") 

BSkyFormat(unlist(precision_result), singleTableOutputHeader="Precision Results")
`
        };
        var objects = {
			howtouse: {
				el: new labelVar(config, {
					label: PrecisionOR.t('howtouse'), 
					style: "mb-3", 
					h:8
				})
			},
			n1: {
				el: new input(config, {
					no: 'n1',
					label: PrecisionOR.t('n1'),
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
					label: PrecisionOR.t('width'),
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
					label: PrecisionOR.t('ratio'),
					style: "mt-5",
					required: true,
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces:true,
					value: "1",
					width:"w-25"
				})
			},			
			prop1: {
				el: new input(config, {
					no: 'prop1',
					label: PrecisionOR.t('prop1'),
					required: true,
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces:true,
					value: "",
					width:"w-25"
				})
			},
			prop2: {
				el: new input(config, {
					no: 'prop2',
					label: PrecisionOR.t('prop2'),
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
					label: PrecisionOR.t('conflevel'),
					placeholder: ".95",
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					required: true,
					value: ".95",
					width:"w-25"
				})
			},
			method: {
				el: new comboBox(config, {
					no: "method",
					label: PrecisionOR.t('method'),
					multiple: false,
					extraction: "NoPrefix|UseComma",
					options: ["indip_smooth", "gart", "woolf"],
					default: "indip_smooth"
				})
			}			
        };
        const content = {
            items: [objects.howtouse.el.content, objects.n1.el.content, objects.width.el.content, 
					objects.ratio.el.content, objects.prop1.el.content, objects.prop2.el.content, objects.conflevel.el.content, objects.method.el.content
					],
            nav: {
                name: PrecisionOR.t('navigation'),
                icon: "icon-or",
				datasetRequired: false,
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: PrecisionOR.t('help.title'),
            r_help: "help(data,package='utils')",
            body: PrecisionOR.t('help.body')
        }
;
    }
		
	
}

module.exports = {
    render: () => new PrecisionOR().render()
}
