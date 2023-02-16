
var localization = {
    en: {
        title: "Sample Size, Precision of a Risk Difference",
        navigation: "Risk Difference",
		howtouse: "Specify either the sample size or the confidence interval width and the other will be computed",
		n1: "Group 1 Sample Size",
		width: "Confidence Interval Width",
		ratio: "Ratio of Group 1 to Group 2 Sample Size",
		prop1: "Group 1 Outcome Proportion",
		prop2: "Group 2 Outcome Proportion",		
		conflevel: "Confidence Level (0-1)",
		method: "Confidence Interval Method",
        help: {
            title: "Sample Size, Precision of a Risk Difference",
            r_help: "help(prec_riskdiff, package ='presize')",
            body: `
This is an assessment of sample size for a difference in proportions based on confidence interval width.  It computes the sample size or the confidence interval width when the user 
specifies the other.
<br/><br/>
<b>Group 1 Sample Size:</b> Specify the number of subjects in group 1
<br/><br/>
<b>Confidence Interval Width:</b> Specify the confidence interval width desired.  The width of a confidence interval is a measure of precision of an estimate and is the upper bound minus the lower bound.
<br/><br/>
<b>Ratio of Group 1 to Group 2 Sample Size:</b> Specify the ratio of the group 2 sample size to the group 1 sample size.  A value of 1 means equal sample sizes.
<br/><br/>
<b>Group 1 Outcome Proportion:</b> Specify the proportion of subjects in group 1 with the 'positive' outcome
<br/><br/>
<b>Group 2 Outcome Proportion:</b> Specify the proportion of subjects in group 2 with the 'positive' outcome
<br/><br/>
Note that the risk difference will be computed as the proportion in group 1 minus the proportion in group 2.
<br/><br/>
<b>Confidence Level:</b> Specify the desired level of the confidence interval
<br/><br/>
<b>Confidence Interval Method:</b> Specify the type of confidence interval to use. Newcombe (newcombe) proposed a confidence interval based on the wilson score method for the
single proportion. The confidence interval without continuity correction is implemented from equation 10 in Newcombe (1998). Miettinen-Nurminen (mn) provide a closed form 
equation for the restricted maximum likelihood estimate . The implementation is based on code provided by Yongyi Min on https://users.stat.ufl.edu/~aa/cda/R/two-sample/R2/index.html.
Agresti-Caffo (ac) confidence interval is based on the Wald confidence interval, adding 1 success to each cell of the 2 x 2 table (see Agresti and Caffo 2000).
<br/><br/>
<b>Required R Packages:</b> presize
			`}
    }
}









class PrecisionRiskDiff extends baseModal {
    constructor() {
        var config = {
            id: "PrecisionRiskDiff",
            label: localization.en.title,
			splitProcessing: false,
            modalType: "one",
            RCode: `
library(presize)

precision_result <- prec_riskdiff({{selected.n1 | safe}} {{selected.width | safe}} conf.level={{selected.conflevel | safe}}, r={{selected.ratio | safe}}, p1={{selected.prop1 | safe}}, p2={{selected.prop2 | safe}}, method="{{selected.method | safe}}") 

BSkyFormat(unlist(precision_result), singleTableOutputHeader="Precision Results")
`
        };
        var objects = {
			howtouse: {
				el: new labelVar(config, {
					label: localization.en.howtouse, 
					style: "mb-3", 
					h:8
				})
			},
			n1: {
				el: new input(config, {
					no: 'n1',
					label: localization.en.n1,
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
					label: localization.en.width,
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
					label: localization.en.ratio,
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
					label: localization.en.prop1,
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
					label: localization.en.prop2,
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
					label: localization.en.conflevel,
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
					label: localization.en.method,
					multiple: false,
					extraction: "NoPrefix|UseComma",
					options: ["newcombe", "mn", "ac", "wald"],
					default: "newcombe"
				})
			}			
        };
        const content = {
            items: [objects.howtouse.el.content, objects.n1.el.content, objects.width.el.content, 
					objects.ratio.el.content, objects.prop1.el.content, objects.prop2.el.content, objects.conflevel.el.content, objects.method.el.content
					],
            nav: {
                name: localization.en.navigation,
                icon: "icon-p2",
				datasetRequired: false,
                modal: config.id
            }
        };
        super(config, objects, content);
        this.help = localization.en.help;
    }
		
	
}
module.exports.item = new PrecisionRiskDiff().render()