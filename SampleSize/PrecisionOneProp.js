/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */












class PrecisionOneProp extends baseModal {
    static dialogId = 'PrecisionOneProp'
    static t = baseModal.makeT(PrecisionOneProp.dialogId)

    constructor() {
        var config = {
            id: PrecisionOneProp.dialogId,
            label: PrecisionOneProp.t('title'),
			splitProcessing: false,
            modalType: "one",
            RCode: `
library(presize)

precision_result <- prec_prop({{selected.n | safe}}  {{selected.width | safe}} conf.level={{selected.conflevel | safe}}, p={{selected.prop | safe}}, method="{{selected.method | safe}}") 

BSkyFormat(unlist(precision_result), singleTableOutputHeader="Precision Results")
`
        };
        var objects = {
			howtouse: {
				el: new labelVar(config, {
					label: PrecisionOneProp.t('howtouse'), 
					style: "mb-3", 
					h:8
				})
			},
			n: {
				el: new input(config, {
					no: 'n',
					label: PrecisionOneProp.t('n'),
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
					label: PrecisionOneProp.t('width'),
					placeholder: "",
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					value: "",
					width:"w-25",
					wrapped: "conf.width=%val%, "
				})
			},			
			prop: {
				el: new input(config, {
					no: 'prop',
					label: PrecisionOneProp.t('prop'),
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
					label: PrecisionOneProp.t('conflevel'),
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
					label: PrecisionOneProp.t('method'),
					multiple: false,
					extraction: "NoPrefix|UseComma",
					options: ["wilson", "agresti-coull", "exact", "wald"],
					default: "wilson"
				})
			}			
        };
        const content = {
            items: [objects.howtouse.el.content, objects.n.el.content, objects.width.el.content, 
					objects.prop.el.content, objects.conflevel.el.content, objects.method.el.content
					],
            nav: {
                name: PrecisionOneProp.t('navigation'),
                icon: "icon-p1",
				datasetRequired: false,
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: PrecisionOneProp.t('help.title'),
            r_help: PrecisionOneProp.t('help.r_help'), //r_help: "help(data,package='utils')",
            body: PrecisionOneProp.t('help.body')
        }
;
    }
		
	
}

module.exports = {
    render: () => new PrecisionOneProp().render()
}
