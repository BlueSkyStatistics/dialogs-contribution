/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */


var localization = {
    en: {
        title: "Reorder Factor Levels Manually",
        navigation: "Reorder Manually",
        reordervarlabel: "Factor to Reorder",
        levelslabel: "Specify Factor Levels to Move (with quotes): e.g. 'level 1', 'level 2', etc.",
		placelabel: "Where to Place Levels",
		firstlabel: "First",
		lastlabel: "Last",
		newoverwritelabel: "Create New or Overwrite Existing Variable",
		newvarlabel: "New Variable",
		overwritevarlabel: "Overwrite Variable",
		newvarnamelabel: "New Variable Name (no spaces / special characters)",
        help: {
            title: "Reorder Factor Levels Manually",
            r_help: "help(fct_relevel, package ='forcats')",
            body: `
This is used to specify one or more factor levels that you want to place first or last in the sort order.  This can be useful for models, 
as the first factor level becomes the reference group for parameter estimates when using reference cell coding.  They can also be useful in 
plotting as the sort order is used to display the categories.
<br/><br/>
<b>Factor to Reorder:</b> factor you want re-ordered
<br/><br/>
<b>Specify Factor Levels to Move (with quotes): </b> These are the factor levels you want to reorder.  
Only existing levels will be reordered.  If you specify a non-existent level, a warning will be output, but any existing levels will be ordered in the 
way you specified.  View the levels in the Variables tab of the data grid to see the current levels and sort order or go to Variables > Factor Levels > Display.  
Note that specifying all existing factor levels will reorder all levels, regardless of whether you select "First" or "Last" for level placement.
<br/><br/>
<b>Where to place levels:</b> Selecting "First" will place the specified levels first in the sort order.  Selecting "Last" will place the specified 
levels last in the sort order.
<br/><br/>
<b>Create new or overwrite existing variable:</b> Controls whether you want to create a new variable with a new name or overwrite the existing variable. The 
new variable name cannot contain special characters like #, $, %, &, (, ), =, etc.  Underscores, "_", are allowed.
<br/><br/>
<b>Examples:</b>  Assume you have a four level factor with labels "a", "b", "c", "d" with a sort order of "a","b","c","d" (first to last). Specifying "d" as 
first in the sort order would create a factor with a sort order of "d", "a", "b", "c".   Specifying "b", "a" as last in the sort order would create a factor 
with a sort order of "c","d","b","a".  Specifying "b","c","d","a" (i.e. all levels) would create a factor with a sort order of "b","c","d","a".
<br/><br/>  
<b>Required R Packages:</b> dplyr, forcats
			`}
    }
}









class FactorLevelManualReorder extends baseModal {
    constructor() {
        var config = {
            id: "FactorLevelManualReorder",
            label: localization.en.title,
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
				label: localization.en.reordervarlabel,
				no: "reordervar",
				filter: "Numeric|Ordinal|Nominal",
				extraction: "NoPrefix|UseComma",
				required: true
				}),
			},
            levels: {
                el: new input(config, {
                    no: 'levels',
                    label: localization.en.levelslabel,
                    required: true,
					allow_spaces: true,
                    type: "character",
                    extraction: "TextAsIs",
                    value: ""
                })
            },
			placegrplabel: {
				el: new labelVar(config, {
				label: localization.en.placelabel, 
				style: "mt-4", 
				h:5
				})
			},			
			first: {
				el: new radioButton(config, {
				label: localization.en.firstlabel,
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
				label: localization.en.lastlabel,
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
				label: localization.en.newoverwritelabel, 
				style: "mt-4", 
				h:5
				})
			},	
			newvar: {
				el: new radioButton(config, {
				label: localization.en.newvarlabel,
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
				label: localization.en.overwritevarlabel,
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
                    label: localization.en.newvarnamelabel,
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
                name: localization.en.navigation,
                icon: "icon-reorder_manually",
                modal: config.id
            }
        };
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new FactorLevelManualReorder().render()