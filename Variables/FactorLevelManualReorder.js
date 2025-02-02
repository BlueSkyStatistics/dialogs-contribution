










class FactorLevelManualReorder extends baseModal {
    static dialogId = 'FactorLevelManualReorder'
    static t = baseModal.makeT(FactorLevelManualReorder.dialogId)

    constructor() {
        var config = {
            id: FactorLevelManualReorder.dialogId,
            label: FactorLevelManualReorder.t('title'),
			splitProcessing: false,
            modalType: "two",
            RCode: `
library(dplyr)
library(forcats)

{{if (options.selected.vargrp=="new")}}
{{dataset.name}} <- {{dataset.name}} %>% 
	mutate({{selected.newvarname | safe}} = fct_relevel({{selected.reordervar | safe}},{{selected.levels | safe}}{{selected.placegrp | safe}}))
{{#else}}
{{dataset.name}} <- {{dataset.name}} %>% 
	mutate({{selected.reordervar | safe}} = fct_relevel({{selected.reordervar | safe}},{{selected.levels | safe}}{{selected.placegrp | safe}}))
{{/if}}

BSkyLoadRefreshDataframe("{{dataset.name}}")

`
        };
        var objects = {
            content_var: { el: new srcVariableList(config, {action: "move"}) },
			reordervar: {
				el: new dstVariable(config, {
				label: FactorLevelManualReorder.t('reordervarlabel'),
				no: "reordervar",
				filter: "Numeric|Ordinal|Nominal",
				extraction: "NoPrefix|UseComma",
				required: true
				}),
			},
            levels: {
                el: new input(config, {
                    no: 'levels',
                    label: FactorLevelManualReorder.t('levelslabel'),
                    required: true,
					allow_spaces: true,
                    type: "character",
                    extraction: "TextAsIs",
                    value: ""
                })
            },
			placegrplabel: {
				el: new labelVar(config, {
				label: FactorLevelManualReorder.t('placelabel'), 
				style: "mt-4", 
				h:5
				})
			},			
			first: {
				el: new radioButton(config, {
				label: FactorLevelManualReorder.t('firstlabel'),
				no: "placegrp",
				increment: "first",
				value: "",
				state: "checked",
				extraction: "ValueAsIs",
				syntax: ""
				})
			}, 
			last: {
				el: new radioButton(config, {
				label: FactorLevelManualReorder.t('lastlabel'),
				no: "placegrp",
				increment: "last",
				value: "",
				state: "",
				syntax: ", after=Inf",
				extraction: "ValueAsIs"
				})
			},
			vargrplabel: {
				el: new labelVar(config, {
				label: FactorLevelManualReorder.t('newoverwritelabel'), 
				style: "mt-4", 
				h:5
				})
			},	
			newvar: {
				el: new radioButton(config, {
				label: FactorLevelManualReorder.t('newvarlabel'),
				no: "vargrp",
				increment: "newvar",
				value: "new",
				state: "checked",
				extraction: "ValueAsIs",
				dependant_objects: ["newvarname"]
				})
			}, 
			overwritevar: {
				el: new radioButton(config, {
				label: FactorLevelManualReorder.t('overwritevarlabel'),
				no: "vargrp",
				increment: "overwrite",
				value: "overwrite",
				state: "",
				extraction: "ValueAsIs"
				})
			},			
            newvarname: {
                el: new input(config, {
                    no: 'newvarname',
                    label: FactorLevelManualReorder.t('newvarnamelabel'),
					ml: 3,
                    required: false,
					allow_spaces: false,
                    type: "character",
                    extraction: "TextAsIs",
                    value: ""
                })
            }
        };
        const content = {
            left: [objects.content_var.el.content],
            right: [objects.reordervar.el.content, objects.levels.el.content,				 
					objects.placegrplabel.el.content, objects.first.el.content, objects.last.el.content, 
					objects.vargrplabel.el.content, objects.newvar.el.content, objects.newvarname.el.content, objects.overwritevar.el.content],
            nav: {
                name: FactorLevelManualReorder.t('navigation'),
                icon: "icon-reorder_manually",
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: FactorLevelManualReorder.t('help.title'),
            r_help: FactorLevelManualReorder.t('help.r_help'), //r_help: "help(data,package='utils')",
            body: FactorLevelManualReorder.t('help.body')
        }
;
    }
}

module.exports = {
    render: () => new FactorLevelManualReorder().render()
}
