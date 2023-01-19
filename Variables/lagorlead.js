
var localization = {
    en: {
        title: "Lag or Lead Variable",
        navigation: "Lag or Lead Variable",
        varnamelabel: "New Variable Name (no spaces)",
        lagleadvarlabel: "Variable to Lag / Lead",
        groupbyvarslabel: "Variables to Group By",
        typelabel: "Lag or Lead",
		laglabel: "Lag",
		leadlabel: "Lead",
		positionlabel: "Number of Positions",
        help: {
            title: "Lag or Lead Variable",
            r_help: "help(lag, package ='dplyr')",
            body: `
This creates a new variable that finds the previous (lag) or next (lead) value in an existing variable based on the row position.
<br/><br/>
<b>New Variable Name:</b> Variable name to store the lagged or leading values
<br/><br/>
<b>Variable to Lag / Lead:</b> Specify the existing variable to extract the lagged or leading values from
<br/><br/>
<b>Variables to Group By (optional):</b> Specify the variables to group by.  If variables are specified here, the lagged and lead 
values will be obtained only within groups defined by these variables.  If no variables are specified here, the lagged and leading values 
will be obtained based on the entire column specified in Variable to Lag / Lead.  Typically, values should be sorted by the grouping variables 
prior to doing a lag or lead.
<br/><br/>
<b>Lag or Lead:</b> Choose whether you want to find the previous (lag) or next value (lead)
<br/><br/>
<b>Number of Positions:</b> Specify the number of positions to lag or lead by.  For example, a lagged value of 1 would extract the previous value and a lagged value of 2 would extract the value 2 positions previous.
<br/><br/>
<b>Required R Packages:</b> dplyr
			`}
    }
}









class lagorlead extends baseModal {
    constructor() {
        var config = {
            id: "lagorlead",
            label: localization.en.title,
			splitProcessing: false,
            modalType: "two",
            RCode: `
library(dplyr)

{{dataset.name}} <- {{dataset.name}} %>%
	group_by({{selected.groupbyvars | safe}}) %>% 
	mutate({{selected.varname | safe}}={{selected.lagleadgrp | safe}}({{selected.lagleadvar | safe}}, n={{selected.position | safe}}))

BSkyLoadRefreshDataframe("{{dataset.name}}")
`
        };
        var objects = {
            content_var: { el: new srcVariableList(config, {action: "move"}) },
            varname: {
                el: new input(config, {
                    no: 'varname',
                    label: localization.en.varnamelabel,
					style: "mb-3",					
                    placeholder: "lagleadvar",
                    required: true,
					allow_spaces: false,
                    type: "character",
                    extraction: "TextAsIs",
                    value: "lagleadvar"
                })
            },
            lagleadvar: {
                el: new dstVariable(config, {
                    label: localization.en.lagleadvarlabel,
                    no: "lagleadvar",
                    filter: "String|Numeric|Date|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma",
                    required: true,
                }), r: ['{{ var | safe}}']
            },
            groupbyvars: {
                el: new dstVariableList(config, {
                    label: localization.en.groupbyvarslabel,
                    no: "groupbyvars",
                    required: false,
                    filter: "String|Numeric|Date|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma",
                }), r: ['{{ var | safe}}']
            },
			typeradiolabel: {
				el: new labelVar(config, {
				label: localization.en.typelabel, 
				style: "mt-3", 
				h:5
				})
			},			
			lag: {
				el: new radioButton(config, {
				label: localization.en.laglabel,
				no: "lagleadgrp",
				increment: "lag",
				value: "lag",
				state: "checked",
				extraction: "ValueAsIs"
				})
			}, 
			lead: {
				el: new radioButton(config, {
				label: localization.en.leadlabel,
				no: "lagleadgrp",
				increment: "lead",
				value: "lead",
				state: "",
				extraction: "ValueAsIs"
				})
			},
            position: {
                el: new input(config, {
                    no: 'position',
                    label: localization.en.positionlabel,
					style: "mt-3",
					width: "w-25",					
                    required: true,
					allow_spaces: true,
                    type: "numeric",
                    extraction: "TextAsIs",
                    value: "1"
                })
            },
        };
        const content = {
            left: [objects.content_var.el.content],
            right: [objects.varname.el.content, objects.lagleadvar.el.content, objects.groupbyvars.el.content, objects.typeradiolabel.el.content, objects.lag.el.content,
					objects.lead.el.content, objects.position.el.content],
            nav: {
                name: localization.en.navigation,
                icon: "icon-lag",
				positionInNav: 8,
                modal: config.id
            }
        };
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new lagorlead().render()