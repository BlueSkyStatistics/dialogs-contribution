/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */


var localization = {
    en: {
        title: "ID Variable",
        navigation: "ID Variable",
        varnamelabel: "Name of ID variable to Create",
        sortbyvarslabel: "Variables to Sort By First",
        groupbyvarslabel: "Variables to Group By",
        outputdatalabel: "Output Dataset",
		newdatalabel: "Create New Dataset",
		overwritelabel: "Overwrite Existing Dataset",
		newdatasetlabel: "Enter a Name for the New Dataset",
        help: {
            title: "ID Variable",
            r_help: "help(row_number, package ='dplyr')",
            body: `
Creates a numeric row identification (ID) variable in either the current dataset or in a separate copy of the current dataset.  
The ID variable created will consist of the numeric values 1, 2, 3, etc., in that order, from top to bottom in the dataset.  
Can optionally specify variables to sort by or group by before the identification variable is created.  The variables to sort by and group 
by can be the same or different variables.  If no grouping variables are specified, the overall row number of the dataset will be assigned 
to the ID variable.
<br/><br/>
<b>Name of ID variable to create:</b> Specify the desired name of the ID variable in the output dataset.
<br/><br/>
<b>Variables to sort by first (optional): </b> Specify variables to sort by before groups are defined or the ID variable is created
<br/><br/>
<b>Variables to Group By (optional):</b> Specify variables whose levels will define the separate assignment of ID values.  For example, grouping by 
gender will create values of 1, 2, 3, etc. separately for males and females, in order of appearance in the data set.
<br/><br/>
<b>Output Dataset:</b> Specify whether to create a new dataset or overwrite the current dataset
<br/><br/>
<b>Required R Packages:</b> tidyverse
			`}
    }
}









class idvar extends baseModal {
    constructor() {
        var config = {
            id: "idvar",
            label: localization.en.title,
			splitProcessing: false,
            modalType: "two",
            RCode: `
library(tidyverse)

# sorts, then groups, then creates row number within groups
{{selected.newdatasetname | safe}}{{selected.datagrp | safe}} <- {{dataset.name}} %>% 
	dplyr::arrange({{selected.sortbyvars | safe}}) %>% 
	dplyr::group_by({{selected.groupbyvars | safe}}) %>% 
	dplyr::mutate({{selected.varname | safe}}=row_number())

BSkyLoadRefreshDataframe("{{selected.newdatasetname | safe}}{{selected.datagrp | safe}}")
`
        };
        var objects = {
            content_var: { el: new srcVariableList(config, {action: "copy"}) },
            varname: {
                el: new input(config, {
                    no: 'varname',
                    label: localization.en.varnamelabel,
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
                    label: localization.en.sortbyvarslabel,
                    no: "sortbyvars",
                    required: false,
                    filter: "String|Numeric|Date|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma",
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
			outputlabel: {
				el: new labelVar(config, {
				label: localization.en.outputdatalabel, 
				style: "mt-3", 
				h:5
				})
			},			
			newdata: {
				el: new radioButton(config, {
				label: localization.en.newdatalabel,
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
				label: localization.en.overwritelabel,
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
                    label: localization.en.newdatasetlabel,
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
                name: localization.en.navigation,
                icon: "icon-idvar",
				positionInNav: 7,
                modal: config.id
            }
        };
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new idvar().render()