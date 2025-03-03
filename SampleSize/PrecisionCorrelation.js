/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */












class PrecisionCorrelation extends baseModal {
    static dialogId = 'PrecisionCorrelation'
    static t = baseModal.makeT(PrecisionCorrelation.dialogId)

    constructor() {
        var config = {
            id: PrecisionCorrelation.dialogId,
            label: PrecisionCorrelation.t('title'),
			splitProcessing: false,
            modalType: "one",
            RCode: `
library(presize)

precision_result <- prec_cor(r={{selected.corr | safe}}, {{selected.n | safe}}  {{selected.width | safe}} conf.level={{selected.conflevel | safe}}, method="{{selected.corrtype | safe}}") 

BSkyFormat(unlist(precision_result), singleTableOutputHeader="Precision Results")
`
        };
        var objects = {
			howtouse: {
				el: new labelVar(config, {
					label: PrecisionCorrelation.t('howtouse'), 
					style: "mb-3", 
					h:8
				})
			},
			n: {
				el: new input(config, {
					no: 'n',
					label: PrecisionCorrelation.t('n'),
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
					label: PrecisionCorrelation.t('width'),
					placeholder: "",
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					value: "",
					width:"w-25",
					wrapped: "conf.width=%val%, "
				})
			},
			corr: {
				el: new input(config, {
					no: 'corr',
					label: PrecisionCorrelation.t('corr'),
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
					label: PrecisionCorrelation.t('conflevel'),
					placeholder: ".95",
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					required: true,
					value: ".95",
					width:"w-25"
				})
			},
			corrtype: {
				el: new comboBox(config, {
					no: "corrtype",
					label: PrecisionCorrelation.t('corrtype'),
					multiple: false,
					extraction: "NoPrefix|UseComma",
					options: ["pearson", "spearman", "kendall"],
					default: "pearson"
				})
			}		
        };
        const content = {
            items: [objects.howtouse.el.content, objects.n.el.content, objects.width.el.content, 
					objects.corr.el.content, objects.conflevel.el.content, objects.corrtype.el.content
					],
            nav: {
                name: PrecisionCorrelation.t('navigation'),
                icon: "icon-link",
				datasetRequired: false,
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: PrecisionCorrelation.t('help.title'),
            r_help: PrecisionCorrelation.t('help.r_help'), //r_help: "help(data,package='utils')",
            body: PrecisionCorrelation.t('help.body')
        }
;
    }
		
	
}

module.exports = {
    render: () => new PrecisionCorrelation().render()
}
