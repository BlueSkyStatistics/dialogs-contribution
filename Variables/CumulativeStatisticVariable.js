/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */












class CumulativeStatisticVariable extends baseModal {
    static dialogId = 'CumulativeStatisticVariable'
    static t = baseModal.makeT(CumulativeStatisticVariable.dialogId)

    constructor() {
        var config = {
            id: CumulativeStatisticVariable.dialogId,
            label: CumulativeStatisticVariable.t('title'),
			splitProcessing: false,
            modalType: "two",
            RCode: `
library(cumstats)
library(dplyr)

{{dataset.name}} <- {{dataset.name}} %>% 
	group_by({{selected.groupbyvars | safe}}) %>% 
	mutate({{selected.varname | safe}}={{selected.func | safe}}({{selected.statvar | safe}}))

BSkyLoadRefreshDataframe("{{dataset.name}}")
`
        };
        var objects = {
            content_var: { el: new srcVariableList(config, {action: "move"}) },
            varname: {
                el: new input(config, {
                    no: 'varname',
                    label: CumulativeStatisticVariable.t('varname'),
					style: "mb-3",					
                    placeholder: "cumulative_var",
                    required: true,
					allow_spaces: false,
                    type: "character",
                    extraction: "TextAsIs",
                    value: "cumulative_var"
                })
            },
            statvar: {
                el: new dstVariable(config, {
                    label: CumulativeStatisticVariable.t('statvar'),
                    no: "statvar",
                    filter: "Numeric|Scale",
                    extraction: "NoPrefix|UseComma",
                    required: true,
                }), r: ['{{ var | safe}}']
            },
            groupbyvars: {
                el: new dstVariableList(config, {
                    label: CumulativeStatisticVariable.t('groupbyvars'),
                    no: "groupbyvars",
                    required: false,
                    filter: "String|Numeric|Date|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma",
                }), r: ['{{ var | safe}}']
            },
			func: {
				el: new comboBox(config, {
				  no: "func",
				  label: CumulativeStatisticVariable.t('func'),
				  multiple: false,
				  extraction: "NoPrefix|UseComma",
				  options: ["cumsum", "cummin", "cummax", "cummean","cummedian","cumgmean","cumhmean","cumvar"],
				  default: "cumsum"
				})
			},			

        };
        const content = {
            left: [objects.content_var.el.content],
            right: [objects.varname.el.content, objects.statvar.el.content, objects.groupbyvars.el.content, objects.func.el.content],
            nav: {
                name: CumulativeStatisticVariable.t('navigation'),
                icon: "icon-signal-1",
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: CumulativeStatisticVariable.t('help.title'),
            r_help: CumulativeStatisticVariable.t('help.r_help'), //r_help: "help(data,package='utils')",
            body: CumulativeStatisticVariable.t('help.body')
        }
;
    }
}

module.exports = {
    render: () => new CumulativeStatisticVariable().render()
}
