










class lagorlead extends baseModal {
    static dialogId = 'lagorlead'
    static t = baseModal.makeT(lagorlead.dialogId)

    constructor() {
        var config = {
            id: lagorlead.dialogId,
            label: lagorlead.t('title'),
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
                    label: lagorlead.t('varnamelabel'),
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
                    label: lagorlead.t('lagleadvarlabel'),
                    no: "lagleadvar",
                    filter: "String|Numeric|Date|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma",
                    required: true,
                }), r: ['{{ var | safe}}']
            },
            groupbyvars: {
                el: new dstVariableList(config, {
                    label: lagorlead.t('groupbyvarslabel'),
                    no: "groupbyvars",
                    required: false,
                    filter: "String|Numeric|Date|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma",
                }), r: ['{{ var | safe}}']
            },
			typeradiolabel: {
				el: new labelVar(config, {
				label: lagorlead.t('typelabel'), 
				style: "mt-3", 
				h:5
				})
			},			
			lag: {
				el: new radioButton(config, {
				label: lagorlead.t('laglabel'),
				no: "lagleadgrp",
				increment: "lag",
				value: "lag",
				state: "checked",
				extraction: "ValueAsIs"
				})
			}, 
			lead: {
				el: new radioButton(config, {
				label: lagorlead.t('leadlabel'),
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
                    label: lagorlead.t('positionlabel'),
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
                name: lagorlead.t('navigation'),
                icon: "icon-lag",
				positionInNav: 8,
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: lagorlead.t('help.title'),
            r_help: lagorlead.t('help.r_help'), //r_help: "help(data,package='utils')",
            body: lagorlead.t('help.body')
        }
;
    }
}

module.exports = {
    render: () => new lagorlead().render()
}
