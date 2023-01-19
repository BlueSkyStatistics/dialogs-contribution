
var localization = {
    en: {
        title: "Cumulative Statistic Variable",
        navigation: "Cumulative Statistic Variable",
        varname: "New Variable Name (no spaces)",
        statvar: "Variable for Cumulative Statistic",
        groupbyvars: "Variables to Group By",
        func: "Cumulative Statistic",
        help: {
            title: "Cumulative Statistic Variable",
            r_help: "help(cumsum, package ='base')",
            body: `
<b>Cumulative Statistics</b>
<br/><br/>
This dialog creates a new variable that stores the cumulative value of a chosen statistic as you go down the rows in the current order of the dataset.  You can optionally compute this cumulative value within one or more groups.
<br/><br/>

<b>New Variable Name:</b> Name of variable that will store the cumulative values
<br/><br/>

<b>Variable for Cumulative Statistic:</b> Variable for which the cumulative values will be computed.  Must be numeric.
<br/><br/>

<b>Variables to Group By:</b> Optional variables to compute the cumulative statistic within.
<br/><br/>

<b>Cumulative Statistic:</b> Which statistic will be used for the cumulative statistic.
<br/><br/>
<ul>
<li>cumsum: cumulative sum</li>
<li>cummin: cumulative minimum</li>
<li>cummax: cumulative maximum</li>
<li>cummean: cumulative mean</li>
<li>cummedian: cumulative median</li>
<li>cumgmean: cumulative geometric mean</li>
<li>cumhmean: cumulative harmonic mean</li>
<li>cumvar: cumulative variance</li>
</ul>
<br/><br/>
<b>Required R Packages:</b> cumstats, dplyr
			`}
    }
}









class CumulativeStatisticVariable extends baseModal {
    constructor() {
        var config = {
            id: "CumulativeStatisticVariable",
            label: localization.en.title,
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
                    label: localization.en.varname,
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
                    label: localization.en.statvar,
                    no: "statvar",
                    filter: "Numeric|Scale",
                    extraction: "NoPrefix|UseComma",
                    required: true,
                }), r: ['{{ var | safe}}']
            },
            groupbyvars: {
                el: new dstVariableList(config, {
                    label: localization.en.groupbyvars,
                    no: "groupbyvars",
                    required: false,
                    filter: "String|Numeric|Date|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma",
                }), r: ['{{ var | safe}}']
            },
			func: {
				el: new comboBox(config, {
				  no: "func",
				  label: localization.en.func,
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
                name: localization.en.navigation,
                icon: "icon-signal-1",
                modal: config.id
            }
        };
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new CumulativeStatisticVariable().render()