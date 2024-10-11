










class PrecisionICC extends baseModal {
    static dialogId = 'PrecisionICC'
    static t = baseModal.makeT(PrecisionICC.dialogId)

    constructor() {
        var config = {
            id: PrecisionICC.dialogId,
            label: PrecisionICC.t('title'),
			splitProcessing: false,
            modalType: "one",
            RCode: `
library(presize)

precision_result <- prec_icc(rho={{selected.icc | safe}}, {{selected.n | safe}}  {{selected.width | safe}} conf.level={{selected.conflevel | safe}}, k={{selected.raters | safe}}) 
names(precision_result)[names(precision_result)=="rho"] <- "ICC"
names(precision_result)[names(precision_result)=="k"] <- "Raters"
precision_result[names(precision_result)=="note"] <- NULL

BSkyFormat(unlist(precision_result), singleTableOutputHeader="Precision Results")
`
        };
        var objects = {
			howtouse: {
				el: new labelVar(config, {
					label: PrecisionICC.t('howtouse'), 
					style: "mb-3", 
					h:8
				})
			},
			n: {
				el: new input(config, {
					no: 'n',
					label: PrecisionICC.t('n'),
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
					label: PrecisionICC.t('width'),
					placeholder: "",
					extraction: "TextAsIs",
					type: "numeric",
					allow_spaces: true,
					value: "",
					width:"w-25",
					wrapped: "conf.width=%val%, "
				})
			},
			icc: {
				el: new input(config, {
					no: 'icc',
					label: PrecisionICC.t('icc'),
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
					label: PrecisionICC.t('conflevel'),
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
					label: PrecisionICC.t('raters'),
					min: 2,
					max: 10000,
					step: 1,
					value: 2,
					extraction: "NoPrefix|UseComma"
				})
			},			
        };
        const content = {
            items: [objects.howtouse.el.content, objects.n.el.content, objects.width.el.content, 
					objects.icc.el.content, objects.conflevel.el.content, objects.raters.el.content
					],
            nav: {
                name: PrecisionICC.t('navigation'),
                icon: "icon-icc",
				datasetRequired: false,
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: PrecisionICC.t('help.title'),
            r_help: "help(data,package='utils')",
            body: PrecisionICC.t('help.body')
        }
;
    }
		
	
}

module.exports = {
    render: () => new PrecisionICC().render()
}
