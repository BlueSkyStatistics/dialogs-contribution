/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */












class SubsetByPosition extends baseModal {
    static dialogId = 'SubsetByPosition'
    static t = baseModal.makeT(SubsetByPosition.dialogId)

    constructor() {
        var config = {
            id: SubsetByPosition.dialogId,
            label: SubsetByPosition.t('title'),
			splitProcessing: false,
            modalType: "two",
            RCode: `
library(dplyr)

{{if (options.selected.subsettypegrp=="A")}}
# first N rows
{{selected.newdataset | safe}} <- {{dataset.name}} %>%
	arrange({{selected.sortbyvars | safe }}) %>%
	group_by({{selected.groupbyvars | safe }}) %>%
	slice_head(n={{selected.firstnn | safe}})
{{/if}}
{{if (options.selected.subsettypegrp=="B")}}
# last N rows
{{selected.newdataset | safe}} <- {{dataset.name}} %>%
	arrange({{selected.sortbyvars | safe }}) %>%
	group_by({{selected.groupbyvars | safe }}) %>%
	slice_tail(n={{selected.lastnn | safe}})
{{/if}}
{{if (options.selected.subsettypegrp=="C")}}
# rows with lowest N values for a variable
{{selected.newdataset | safe}} <- {{dataset.name}} %>%
	arrange({{selected.sortbyvars | safe }}) %>%
	group_by({{selected.groupbyvars | safe }}) %>%
	slice_min({{selected.lowestnvar | safe}}, n={{selected.lowestnn | safe}}, with_ties={{selected.lowestnties | safe}})
{{/if}}
{{if (options.selected.subsettypegrp=="D")}}
# rows with highest N values for a variable
{{selected.newdataset | safe}} <- {{dataset.name}} %>%
	arrange({{selected.sortbyvars | safe }}) %>%
	group_by({{selected.groupbyvars | safe }}) %>%
	slice_max({{selected.highestnvar | safe}}, n={{selected.highestnn | safe}}, with_ties={{selected.highestnties | safe}})
{{/if}}
{{if (options.selected.subsettypegrp=="E")}}
# first proportion of rows
{{selected.newdataset | safe}} <- {{dataset.name}} %>%
	arrange({{selected.sortbyvars | safe }}) %>%
	group_by({{selected.groupbyvars | safe }}) %>%
	slice_head(prop={{selected.firstpropprop | safe}})
{{/if}}
{{if (options.selected.subsettypegrp=="F")}}
# last proportion of rows
{{selected.newdataset | safe}} <- {{dataset.name}} %>%
	arrange({{selected.sortbyvars | safe }}) %>%
	group_by({{selected.groupbyvars | safe }}) %>%
	slice_tail(prop={{selected.lastpropprop | safe}})
{{/if}}
{{if (options.selected.subsettypegrp=="G")}}
# rows within lowest percentile for a variable
{{selected.newdataset | safe}} <- {{dataset.name}} %>%
	arrange({{selected.sortbyvars | safe }}) %>%
	group_by({{selected.groupbyvars | safe }}) %>%
	slice_min({{selected.lowestpropvar | safe}}, prop={{selected.lowestpropprop | safe}}, with_ties={{selected.lowestpropties | safe}})
{{/if}}
{{if (options.selected.subsettypegrp=="H")}}
# rows within highest percentile for a variable
{{selected.newdataset | safe}} <- {{dataset.name}} %>%
	arrange({{selected.sortbyvars | safe }}) %>%
	group_by({{selected.groupbyvars | safe }}) %>%
	slice_max({{selected.highestpropvar | safe}}, prop={{selected.highestpropprop | safe}}, with_ties={{selected.highestpropties | safe}})
{{/if}}
{{if (options.selected.subsettypegrp=="I")}}
# specific row numbers
{{selected.newdataset | safe}} <- {{dataset.name}} %>%
	arrange({{selected.sortbyvars | safe }}) %>%
	group_by({{selected.groupbyvars | safe }}) %>%
	slice({{selected.rownumbox | safe}})
{{/if}}
	
BSkyLoadRefresh("{{selected.newdataset | safe}}")

`
        };
        var objects = {
			content_var: { el: new srcVariableList(config, {action: "copy", scroll: true}) },
			newdataset: {
				el: new input(config, {
				no: 'newdataset',
				label: SubsetByPosition.t('newdatasetlabel'),
				extraction: "TextAsIs",
				type: "character",
				allow_spaces: false,
				required: true,
				style: "mb-4",
				ml: 5
				})
			},
            sortbyvars: {
                el: new dstVariableList(config, {
                    label: SubsetByPosition.t('sortbyvarslabel'),
                    no: "sortbyvars",
                    filter: "String|Numeric|Date|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma",
                    required: false
                })
            },			
            groupbyvars: {
                el: new dstVariableList(config, {
                    label: SubsetByPosition.t('groupbyvarslabel'),
                    no: "groupbyvars",
                    filter: "String|Numeric|Date|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma",
                    required: false
                })
            },
			subsettypelabel: { el: new labelVar(config, { label: SubsetByPosition.t('subsettypelabel'), style: "mt-4",h: 5 }) },
			firstn: {
				el: new radioButton(config, {
				label: SubsetByPosition.t('firstnlabel'),
				no: "subsettypegrp",
				increment: "firstn",
				style: "mt-3",
				value: "A",
				state: "checked",
				extraction: "ValueAsIs"
				})
			},
			firstnn: {
				el: new input(config, {
				no: 'firstnn',
				label: SubsetByPosition.t('nlabel'),
				value: "1",
				extraction: "TextAsIs",
				type: "numeric",
				allow_spaces: true,
				ml: 5,
				width:"w-25"
				})
			},			
			lastn: {
				el: new radioButton(config, {
				label: SubsetByPosition.t('lastnlabel'),
				no: "subsettypegrp",
				increment: "lastn",
				style: "mt-5",
				value: "B",
				state: "",
				extraction: "ValueAsIs"
				})
			},
			lastnn: {
				el: new input(config, {
				no: 'lastnn',
				label: SubsetByPosition.t('nlabel'),
				value: "1",
				extraction: "TextAsIs",
				type: "numeric",
				allow_spaces: true,
				ml: 5,
				width:"w-25"
				})
			},				
			lowestn: {
				el: new radioButton(config, {
				label: SubsetByPosition.t('lowestnlabel'),
				no: "subsettypegrp",
				increment: "lowestn",
				style: "mt-5",
				value: "C",
				state: "",
				extraction: "ValueAsIs"
				})
			},
			lowestnn: {
				el: new input(config, {
				no: 'lowestnn',
				label: SubsetByPosition.t('nlabel'),
				value: "1",
				extraction: "TextAsIs",
				type: "numeric",
				allow_spaces: true,
				ml: 5,
				width:"w-25"
				})
			},
			lowestnvar: {
				el: new dstVariable(config, {
				label: SubsetByPosition.t('varlabel'),
				no: "lowestnvar",
				filter: "Numeric|Scale",
				extraction: "NoPrefix|UseComma",
				ml: 5,
				required: false
				})
			},
			lowestnties: {
				el: new checkbox(config, {
				label: SubsetByPosition.t('tieslabel'),
				no: "lowestnties",
				state: "checked",
				style: "ml-5",
				extraction: "Boolean"
				})
			},			
			highestn: {
				el: new radioButton(config, {
				label: SubsetByPosition.t('highestnlabel'),
				no: "subsettypegrp",
				increment: "highestn",
				style: "mt-5",
				value: "D",
				state: "",
				extraction: "ValueAsIs"
				})
			},
			highestnn: {
				el: new input(config, {
				no: 'highestnn',
				label: SubsetByPosition.t('nlabel'),
				value: "1",
				extraction: "TextAsIs",
				type: "numeric",
				allow_spaces: true,
				ml: 5,
				width:"w-25"
				})
			},
			highestnvar: {
				el: new dstVariable(config, {
				label: SubsetByPosition.t('varlabel'),
				no: "highestnvar",
				filter: "Numeric|Scale",
				extraction: "NoPrefix|UseComma",
				ml: 5,
				required: false
				})
			},
			highestnties: {
				el: new checkbox(config, {
				label: SubsetByPosition.t('tieslabel'),
				no: "highestnties",
				state: "checked",
				style: "ml-5",
				extraction: "Boolean"
				})
			},				
			firstprop: {
				el: new radioButton(config, {
				label: SubsetByPosition.t('firstproplabel'),
				no: "subsettypegrp",
				increment: "firstprop",
				style: "mt-5",
				value: "E",
				state: "",
				extraction: "ValueAsIs"
				})
			},
			firstpropprop: {
				el: new input(config, {
				no: 'firstpropprop',
				label: SubsetByPosition.t('proplabel'),
				value: ".10",
				extraction: "TextAsIs",
				type: "numeric",
				allow_spaces: true,
				ml: 5,
				width:"w-25"
				})
			},			
			lastprop: {
				el: new radioButton(config, {
				label: SubsetByPosition.t('lastproplabel'),
				no: "subsettypegrp",
				increment: "lastprop",
				style: "mt-5",
				value: "F",
				state: "",
				extraction: "ValueAsIs"
				})
			},
			lastpropprop: {
				el: new input(config, {
				no: 'lastpropprop',
				label: SubsetByPosition.t('proplabel'),
				value: ".10",
				extraction: "TextAsIs",
				type: "numeric",
				allow_spaces: true,
				ml: 5,
				width:"w-25"
				})
			},
			lowestprop: {
				el: new radioButton(config, {
				label: SubsetByPosition.t('lowestproplabel'),
				no: "subsettypegrp",
				increment: "lowestprop",
				style: "mt-5",
				value: "G",
				state: "",
				extraction: "ValueAsIs"
				})
			},
			lowestpropprop: {
				el: new input(config, {
				no: 'lowestpropprop',
				label: SubsetByPosition.t('proplabel'),
				value: ".10",
				extraction: "TextAsIs",
				type: "numeric",
				allow_spaces: true,
				ml: 5,
				width:"w-25"
				})
			},
			lowestpropvar: {
				el: new dstVariable(config, {
				label: SubsetByPosition.t('varlabel'),
				no: "lowestpropvar",
				filter: "Numeric|Scale",
				extraction: "NoPrefix|UseComma",
				ml: 5,
				required: false
				})
			},
			lowestpropties: {
				el: new checkbox(config, {
				label: SubsetByPosition.t('tieslabel'),
				no: "lowestpropties",
				state: "checked",
				style: "ml-5",
				extraction: "Boolean"
				})
			},				
			highestprop: {
				el: new radioButton(config, {
				label: SubsetByPosition.t('highestproplabel'),
				no: "subsettypegrp",
				increment: "highestprop",
				style: "mt-5",
				value: "H",
				state: "",
				extraction: "ValueAsIs"
				})
			},
			highestpropprop: {
				el: new input(config, {
				no: 'highestpropprop',
				label: SubsetByPosition.t('proplabel'),
				value: ".10",
				extraction: "TextAsIs",
				type: "numeric",
				allow_spaces: true,
				ml: 5,
				width:"w-25"
				})
			},
			highestpropvar: {
				el: new dstVariable(config, {
				label: SubsetByPosition.t('varlabel'),
				no: "highestpropvar",
				filter: "Numeric|Scale",
				extraction: "NoPrefix|UseComma",
				ml: 5,
				required: false
				})
			},
			highestpropties: {
				el: new checkbox(config, {
				label: SubsetByPosition.t('tieslabel'),
				no: "highestpropties",
				state: "checked",
				style: "ml-5",
				extraction: "Boolean"
				})
			},			
			rownum: {
				el: new radioButton(config, {
				label: SubsetByPosition.t('rownumlabel'),
				no: "subsettypegrp",
				increment: "rownum",
				style: "mt-5",
				value: "I",
				state: "",
				extraction: "ValueAsIs"
				})
			},			
			rownumbox: {
				el: new input(config, {
				no: 'rownumbox',
				label: SubsetByPosition.t('rownumboxlabel'),
				extraction: "TextAsIs",
				type: "character",
				allow_spaces: true,
				ml: 5,
				width: "w-100"
				})
			}		
        };
        const content = {
            left: [objects.content_var.el.content],
            right: [objects.newdataset.el.content, objects.sortbyvars.el.content, objects.groupbyvars.el.content, objects.subsettypelabel.el.content, 
					objects.firstn.el.content, objects.firstnn.el.content, 
					objects.lastn.el.content, objects.lastnn.el.content, 
					objects.lowestn.el.content, objects.lowestnn.el.content, objects.lowestnvar.el.content, objects.lowestnties.el.content,
					objects.highestn.el.content, objects.highestnn.el.content, objects.highestnvar.el.content, objects.highestnties.el.content,
					objects.firstprop.el.content, objects.firstpropprop.el.content,
					objects.lastprop.el.content, objects.lastpropprop.el.content, 					
					objects.lowestprop.el.content, objects.lowestpropprop.el.content, objects.lowestpropvar.el.content, objects.lowestpropties.el.content,
					objects.highestprop.el.content, objects.highestpropprop.el.content, objects.highestpropvar.el.content, objects.highestpropties.el.content,
					objects.rownum.el.content, objects.rownumbox.el.content],
            nav: {
                name: SubsetByPosition.t('navigation'),
                icon: "icon-funnel-p",
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: SubsetByPosition.t('help.title'),
            r_help: SubsetByPosition.t('help.r_help'), //r_help: "help(data,package='utils')",
            body: SubsetByPosition.t('help.body')
        }
;
    }
}

module.exports = {
    render: () => new SubsetByPosition().render()
}
