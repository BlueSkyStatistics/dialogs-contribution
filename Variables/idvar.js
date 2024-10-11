










class idvar extends baseModal {
    static dialogId = 'idvar'
    static t = baseModal.makeT(idvar.dialogId)

    constructor() {
        var config = {
            id: idvar.dialogId,
            label: idvar.t('title'),
			splitProcessing: false,
            modalType: "two",
            RCode: `
library(tidyverse)

# sorts, then groups, then creates row number within groups
{{selected.newdatasetname | safe}}{{selected.datagrp | safe}} <- {{dataset.name}} %>% 
	arrange({{selected.sortbyvars | safe}}) %>% 
	group_by({{selected.groupbyvars | safe}}) %>% 
	mutate({{selected.varname | safe}}=row_number())

BSkyLoadRefreshDataframe("{{selected.newdatasetname | safe}}{{selected.datagrp | safe}}")
`
        };
        var objects = {
            content_var: { el: new srcVariableList(config, {action: "copy"}) },
            varname: {
                el: new input(config, {
                    no: 'varname',
                    label: idvar.t('varnamelabel'),
					style: "mb-3",					
                    placeholder: "idvar",
                    required: true,
					allow_spaces: false,
                    type: "character",
                    extraction: "TextAsIs",
                    value: "idvar"
                })
            },
            sortbyvars: {
                el: new dstVariableList(config, {
                    label: idvar.t('sortbyvarslabel'),
                    no: "sortbyvars",
                    required: false,
                    filter: "String|Numeric|Date|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma",
                }), r: ['{{ var | safe}}']
            },
            groupbyvars: {
                el: new dstVariableList(config, {
                    label: idvar.t('groupbyvarslabel'),
                    no: "groupbyvars",
                    required: false,
                    filter: "String|Numeric|Date|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma",
                }), r: ['{{ var | safe}}']
            },
			outputlabel: {
				el: new labelVar(config, {
				label: idvar.t('outputdatalabel'), 
				style: "mt-3", 
				h:5
				})
			},			
			newdata: {
				el: new radioButton(config, {
				label: idvar.t('newdatalabel'),
				no: "datagrp",
				increment: "newdata",
				required: true,
				value: "",
				state: "checked",
				extraction: "ValueAsIs",
				syntax: "",
				dependant_objects: ['newdatasetname']
				})
			}, 
			overwrite: {
				el: new radioButton(config, {
				label: idvar.t('overwritelabel'),
				no: "datagrp",
				increment: "overwrite",
				value: "X",
				state: "",
				syntax: "{{dataset.name}}",
				extraction: "ValueAsIs"
				})
			},
            newdatasetname: {
                el: new input(config, {
                    no: 'newdatasetname',
                    label: idvar.t('newdatasetlabel'),
					ml: 3,
                    required: false,
					allow_spaces: false,
                    type: "character",
                    extraction: "TextAsIs",
                    value: "",
					overwrite: "dataset"
                })
            },
        };
        const content = {
            left: [objects.content_var.el.content],
            right: [objects.varname.el.content, 					 
					objects.sortbyvars.el.content, objects.groupbyvars.el.content,
					objects.outputlabel.el.content, objects.newdata.el.content, objects.newdatasetname.el.content, objects.overwrite.el.content],
            nav: {
                name: idvar.t('navigation'),
                icon: "icon-idvar",
				positionInNav: 7,
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: idvar.t('help.title'),
            r_help: "help(data,package='utils')",
            body: idvar.t('help.body')
        }
;
    }
}

module.exports = {
    render: () => new idvar().render()
}
