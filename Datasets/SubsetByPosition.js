
var localization = {
    en: {
        title: "Subset by Position",
        navigation: "Subset By Position",
		newdatasetlabel: "Specify New Dataset Name",
        sortbyvarslabel: "Variables to Sort By First (Ascending Order)",		
        groupbyvarslabel: "Groups to Subset Within",
        subsettypelabel: "Subset Type",
		firstnlabel: "First N Rows",
		lastnlabel: "Last N Rows",
		lowestnlabel: "Rows with Lowest N Values for a Variable",
		highestnlabel: "Rows with Highest N Values for a Variable",
		firstproplabel: "First Proportion of Rows",
		lastproplabel: "Last Proportion of Rows",
		lowestproplabel: "Rows within Lowest Percentile for a Variable",
		highestproplabel: "Rows within Highest Percentile for a Variable",
		nlabel: "N (positive keeps, negative removes)",
		proplabel: "Proportion (positive keeps, negative removes)",
		varlabel: "Variable",
		tieslabel: "Include Tied Values",
		rownumlabel: "Specify Row Numbers",
		rownumboxlabel: "Numbers or ranges separated by commas (e.g. 1,3,5 or 20:30 or seq(2,10,by=2), positive keeps, negative removes)",
        help: {
            title: "Subset by Position",
            r_help: "help(slice, package ='dplyr')",
            body: `
This subsets a dataset according to row position.
<br/><br/>
<b>Specify New Dataset Name:</b> Dataset name where the subsetted data will be stored
<br/><br/>
<b>Variables to Sort By First:</b> Variables used to sort the rows before any subsetting is undertaken.  This only will affect options that select the number of rows, e.g. 
First/Last N Rows, First/Last Proportion of Rows, and Specify Row Numbers. It will always be in ascending order.
<br/><br/>
<b>Groups to Subset Within:</b> Specifying no variables will subset according to the row position of the entire dataset.  Specifying variables will subset according to the row position
within groups defined by all combinations of values for the specified variables.
<br/><br/>
<b>Subset Type</b>
<br/><br/>
<b>First N Rows:</b> Keeps the first N rows of the dataset overall or within groups
<br/><br/>
<b>Last N Rows:</b> Keeps the last N rows of the dataset overall or within groups
<br/><br/>
<b>Rows with Lowest N Values for a Variable:</b> Keeps the rows that have the lowest ordered values for a specified variable overall or within groups. For example, specifying 10 would 
keep the rows with the lowest 10 values for a variable.
<br/><br/>
<b>Rows with Highest N Values for a Variable:</b> Keeps the rows that have the highest ordered values for a specified variable overall or within groups. For example, specifying 10 would 
keep the rows with the highest 10 values for a variable.
<br/><br/>
<b>First Proportion of Rows:</b> Keeps the rows in the top proportion of the dataset overall or within groups. For example, specifying .10 would keep the top 10% of the dataset 
according to the total number of rows.
<br/><br/> 
<b>Last Proportion of Rows:</b> Keeps the rows in the bottom proportion of the dataset overall or within groups. For example, specifying .10 would keep the bottom 10% of the dataset 
according to the total number of rows.
<br/><br/>
<b>Rows within Lowest Percentile for a Variable:</b> Keeps the rows in the lowest percentile for a specified variable, overall or within groups. For example, specifying .10 would 
keep the lowest 10th percentile for a variable (minimum to the 10th percentile).
<br/><br/>
<b>Rows within Highest Percentile for a Variable:</b> Keeps the rows in the highest percentile for a specified variable, overall or within groups. For example, specifying .10 would 
keep the highest 10th percentile for a variable (90th percentile to the maximum).
<br/><br/>
<b>Specify Row Numbers:</b> Keeps the exact numbered rows specified. For example, specifying 1,3,5 would keep the first, third, and fifth rows. Specifying 20:30 would keep rows 20 
to 30.  Specifying seq(2,10,by=2) would keep the even numbered rows up to the 10th row.
<br/><br/>
<b>Include Tied Values:</b> Specifies whether tied values should be included or not.  For example, if you want the rows for the lowest 10 values of a variable and the 10th lowest 
value appears more than once, including the tied values will keep all rows that equal the duplicated value. 
<br/><br/>
Note that specifying negative values for N or the proportion removes the corresponding rows from the dataset.  For example, specifying -10 for the First N Rows would remove 
the first 10 rows.  Specifying -.10 for the First Proportion of Rows, would remove the first 10% of the rows.
<br/><br/>
<b>R Packages Required:</b> dplyr
			`}
    }
}









class SubsetByPosition extends baseModal {
    constructor() {
        var config = {
            id: "SubsetByPosition",
            label: localization.en.title,
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
				label: localization.en.newdatasetlabel,
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
                    label: localization.en.sortbyvarslabel,
                    no: "sortbyvars",
                    filter: "String|Numeric|Date|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma",
                    required: false
                })
            },			
            groupbyvars: {
                el: new dstVariableList(config, {
                    label: localization.en.groupbyvarslabel,
                    no: "groupbyvars",
                    filter: "String|Numeric|Date|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma",
                    required: false
                })
            },
			subsettypelabel: { el: new labelVar(config, { label: localization.en.subsettypelabel, style: "mt-4",h: 5 }) },
			firstn: {
				el: new radioButton(config, {
				label: localization.en.firstnlabel,
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
				label: localization.en.nlabel,
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
				label: localization.en.lastnlabel,
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
				label: localization.en.nlabel,
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
				label: localization.en.lowestnlabel,
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
				label: localization.en.nlabel,
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
				label: localization.en.varlabel,
				no: "lowestnvar",
				filter: "Numeric|Scale",
				extraction: "NoPrefix|UseComma",
				ml: 5,
				required: false
				})
			},
			lowestnties: {
				el: new checkbox(config, {
				label: localization.en.tieslabel,
				no: "lowestnties",
				state: "checked",
				style: "ml-5",
				extraction: "Boolean"
				})
			},			
			highestn: {
				el: new radioButton(config, {
				label: localization.en.highestnlabel,
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
				label: localization.en.nlabel,
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
				label: localization.en.varlabel,
				no: "highestnvar",
				filter: "Numeric|Scale",
				extraction: "NoPrefix|UseComma",
				ml: 5,
				required: false
				})
			},
			highestnties: {
				el: new checkbox(config, {
				label: localization.en.tieslabel,
				no: "highestnties",
				state: "checked",
				style: "ml-5",
				extraction: "Boolean"
				})
			},				
			firstprop: {
				el: new radioButton(config, {
				label: localization.en.firstproplabel,
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
				label: localization.en.proplabel,
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
				label: localization.en.lastproplabel,
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
				label: localization.en.proplabel,
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
				label: localization.en.lowestproplabel,
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
				label: localization.en.proplabel,
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
				label: localization.en.varlabel,
				no: "lowestpropvar",
				filter: "Numeric|Scale",
				extraction: "NoPrefix|UseComma",
				ml: 5,
				required: false
				})
			},
			lowestpropties: {
				el: new checkbox(config, {
				label: localization.en.tieslabel,
				no: "lowestpropties",
				state: "checked",
				style: "ml-5",
				extraction: "Boolean"
				})
			},				
			highestprop: {
				el: new radioButton(config, {
				label: localization.en.highestproplabel,
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
				label: localization.en.proplabel,
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
				label: localization.en.varlabel,
				no: "highestpropvar",
				filter: "Numeric|Scale",
				extraction: "NoPrefix|UseComma",
				ml: 5,
				required: false
				})
			},
			highestpropties: {
				el: new checkbox(config, {
				label: localization.en.tieslabel,
				no: "highestpropties",
				state: "checked",
				style: "ml-5",
				extraction: "Boolean"
				})
			},			
			rownum: {
				el: new radioButton(config, {
				label: localization.en.rownumlabel,
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
				label: localization.en.rownumboxlabel,
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
                name: localization.en.navigation,
                icon: "icon-funnel-p",
                modal: config.id
            }
        };
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new SubsetByPosition().render()