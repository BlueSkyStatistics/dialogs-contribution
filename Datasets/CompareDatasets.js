/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */


var localization = {
    en: {
        title: "Compare Datasets",
        navigation: "Compare Datasets",
		in1label: "Select First Dataset",
		in2label: "Select Second Dataset",
		defcomplabel: "By default, the comparison is done row-by-row. See ID Options for more options.",
		numtolcontrolslabel: "Numeric Variable Tolerances",
		numabsolutelabel: "Unsigned numerical difference",
		numpercentlabel: "Unsigned percent difference",
		numtolvallabel: "Max value of difference (for percent should be 0-1)",
		intasnumlabel: "Treat integer variables as numeric variables in comparisons",
		facttolcontrolslabel: "Factor Variable Tolerances",
		factnonelabel: "Compare both underlying levels and labels",
		factlevelslabel: "Compare underlying levels only",
		factlabelslabel: "Compare underlying labels only",
		factascharlabel: "Treat factor variables as character variables in comparisons",
		chartolcontrolslabel: "Character Variable Tolerances",
		charnonelabel: "Treat text as-is",
		charcaselabel: "Ignore differences in upper/lowercase",
		chartrimlabel: "Ignore differences in leading/trailing whitespace",
		charbothlabel: "Ignore differences in both case and whitespace",
		varnametolcontrolslabel: "Variable Name Tolerances",
		varnamenonelabel: "Treat variable names as-is",
		varnamedotslabel: "Treat dots, underscores, and spaces equivalent in variable names",
		varnamecaselabel: "Ignore upper/lowercase in variable names",
		varnamebothlabel: "Ignore case and treat dots, underscores, and spaces equivalent in variable names",
		idoptionslabel: "ID Options",
		bylabel: "If common column names to merge on, enter column names with quotes separated by commas (e.g. 'country', 'region')",
		bydifflabel: "If column names on which the merge is done are different in each dataset",
		byxlabel: "Enter column names in the first dataset for the merge with quotes separated by commas (e.g. 'nations', 'location')",
		byylabel: "Enter column names in the second dataset for the merge with quotes separated by commas (e.g. 'country', 'location')",		
        help: {
            title: "Compare Datasets",
            r_help: "help(comparedf, package ='arsenal')",
            body: `
Compare two datasets and report any differences between them, much like SAS's PROC COMPARE procedure.
<br/><br/><br/>
<b>Numeric Variable Tolerance Options</b>
<br/><br/>
<b>Unsigned numerical difference (default)</b>
<br/>
Assess whether 2 values are different by taking the absolute value of the difference and testing if it is larger than the max value of difference value
<br/>
<b>Example:</b> age = 18.5 vs. age = 18.8
<br/>
difference = | 18.5 - 18.8 | = | -0.3 | = 0.3
<br/><br/>
<b>Unsigned percent difference</b>
<br/>
Assess whether 2 values are different by taking the absolute value of the percent difference and testing if it is larger than the max value of difference value
<br/>
<b>Example:</b> age = 18.5 vs. age = 18.8
<br/>
difference = | 18.5 - 18.8 | / 18.8 = | -0.3 | / 18.8 = 0.3 / 18.8 = 0.0160
<br/><br/>
<b>Max value of difference (blank by default)</b>
<br/>
If blank, values should be identical (as best detected by your system). Otherwise, enter a value > 0 that will be used to determine if the difference is large enough to be called different.
<br/>
<b>Example 1 with numerical difference:</b> age = 18.5 vs. age = 18.8 and max value = 0.2
<br/>
difference = | 18.5 - 18.8 | = | -0.3 | = 0.3 since 0.3 > 0.2, this would be flagged as different
<br/><br/>
<b>Example 2 with numerical difference:</b> age = 18.5 vs. age = 18.6 and max value = 0.2
<br/>
difference = | 18.5 - 18.6 | = | -0.1 | = 0.1 since 0.1 < 0.2, this would not be flagged as different
<br/><br/>
<b>Example 1 with percent difference:</b> age = 18.5 vs. age = 18.8 and max value = 0.01
<br/>
difference = | 18.5 - 18.8 | / 18.8 = | -0.3 | / 18.8 = 0.3 / 18.8 = 0.0160 since 0.016 > 0.01, this would be flagged as different
<br/><br/>
<b>Example 2 with percent difference:</b> age = 18.5 vs. age = 18.8 and max value = 0.01
<br/>
difference = | 18.5 - 18.6 | / 18.8 = | -0.1 | / 18.8 = 0.1 / 18.8 = 0.0005 since 0.0005 < 0.01, this would not be flagged as different
<br/><br/>
<b>Treat integer variables as numeric variables in comparisons</b>
<br/>
Should variables with class integer be compared to variables with class numeric? You may end up with variables of different classes when you read in data from external sources (like Excel)
<br/>
<b>Example:</b> age (integer) = c(18, 33, 45) vs. age (numeric) = c(18.6, 33.4, 45.1)
<br/>
If you want the values of these 2 variables compared between the data sets, check this box. By default, the system only compares numeric variables of the same class.
<br/><br/><br/>
<b>Factor Variable Tolerance Options</b>
<br/><br/>
<b>Compare both underlying levels and labels (default)</b>
<br/>
Compare both the stored values (1,2,3) and labels (mild, moderate, severe) between the variables
<br/>
<b>Example 1:</b> disease (1 = mild, 2 = moderate, 3 = severe) vs. disease (1 = mild, 2 = severe)
<br/>
These  2 variables would be considered different because the 2 = moderate in 1st variable but 2 = severe in the 2nd variable
<br/><br/>
<b>Example 2:</b> disease (1 = mild, 2 = moderate, 3 = severe) vs. disease (1 = mild, 2 = moderate, 3 = sev)
<br/>
These  2 variables would be considered different because the 3 = severe in 1st variable but 3 = sev in the 2nd variable
<br/><br/>
<b>Compare underlying levels only</b>
<br/>
Compare only the underlying levels (1,2,3) across factor variables
<br/>
<b>Example 1:</b> disease (1 = mild, 2 = moderate, 3 = severe) vs. disease (1 = mild, 2 = severe)
<br/>
These  2 variables would not be considered different because the underlying values 1,2,3 in the 1st variable are the same as the values 1,2 are in the 2nd variable.
<br/><br/>
<b>Example 2:</b> disease (1 = mild, 2 = moderate, 3 = severe) vs. disease (1 = mild, 2 = moderate, 3 = sev)
<br/>
These  2 variables would be considered different because the 3 = severe in 1st variable but 3 = sev in the 2nd variable
<br/><br/>
<b>Compare underlying labels only</b>
<br/>
Compare only the underlying labels (mild, moderate, severe) across factor variables
<br/>
<b>Example 1:</b> disease (1 = mild, 2 = moderate, 3 = severe) vs. disease (1 = mild, 2 = severe)
<br/>
These  2 variables would not be considered different because the labels are the same
<br/><br/>
<b>Example 2:</b> disease (1 = mild, 2 = moderate, 3 = severe) vs. disease (1 = mild, 2 = moderate, 3 = sev)
<br/>
These  2 variables would be considered different because the 3 = severe in 1st variable but 3 = sev in the 2nd variable so the labels are different
<br/><br/>
<b>Treat factor variables as character variables in comparisons</b>
<br/>
Check if factors should be converted to character variables using their labels for the comparison. You may end up with discrepant classes if you read data from different sources.
<br/>
<b>Example:</b> disease (factor with 1 = mild, 2 = moderate, 3 = severe) vs. disease (character with mild, moderate, severe)
<br/>
To compare these variables, check the box to convert the 1st variable to a character variable.
<br/><br/><br/>
<b>Character Variable Tolerance Options</b>
<br/><br/>
<b>Treat text as-is (default)</b>
<br/>
Text is compared exactly as presented including any differing spaces or upper/lowercase differences.
<br/>
<b>Example (note that . means a space):</b> name = John vs. name = john
<br/>
These would be different since J is different from j
<br/><br/>
<b>Ignore differences in upper/lowercase</b>
<br/>
Ignore case differences when doing the comparison
<br/>
<b>Example (note that . means a space):</b> name = John vs. name = john
<br/>
These would not be different since J is now not different from j
<br/><br/>
<b>Ignore differences in leading/trailing whitespace</b>
<br/>
Remove any leading/trailing whitespace before doing the comparison
<br/>
<b>Example (note that . means a space):</b> name = john vs. name = john...
<br/>
By default, john is different from john... but selecting this option would make john = john... because the ... would get removed prior to the comparison
<br/><br/>
<b>Ignore differences in both case and whitespace</b>
<br/>
Ignore both case and whitespace as described above
<br/><br/><br/>
<b>Variable Name Tolerance Options</b>
<br/><br/>
<b>Treat variable names as-is (default)</b>
<br/>
Upper/lowercase, spaces, dots, and underscores mean variables are different
<br/>
<b>Example:</b> Variable = Age would not be compared to Variable = age using this option
<br/><br/>
<b>Treat dots, underscores, and spaces equivalent in variable names</b>
<br/>
Ignore dots, underscores, and spaces in variable names
<br/>
<b>Example:</b> Variable = Age.dx would be compared to Age_dx if you select this option. By default, they would not be treated as the same variable
<br/><br/>
<b>Ignore upper/lowercase in variable names</b>
<br/>
Ignore differences in upper/lowercase in variable names
<br/>
<b>Example:</b> Variable = Age would be compared to Variable = age using this option
<br/><br/>
<b>Ignore case and treat dots, underscores, and spaces equivalent in variable names</b>
<Br/>
Ignore differences in dots, underscores, spaces, and upper/lowercase as described above
<br/>
<b>Example:</b> Variable = Age.dx would be compared to Variable = age_dx using this option
<br/><br/>
<b>Required R Packages:</b> arsenal
			`}
    }
}









class CompareDatasets extends baseModal {
    constructor() {
        var config = {
            id: "CompareDatasets",
            label: localization.en.title,
			splitProcessing: false,
            modalType: "two",
            RCode: `
library(arsenal)

#### Create the comparison object
compare.out <- comparedf( {{selected.in1 | safe}}, {{selected.in2 | safe}}{{selected.by | safe}}{{selected.byx | safe}}{{selected.byy | safe}}, tol.num = {{selected.TestRadioGroup | safe}}, int.as.num = {{selected.intasnum | safe}}, tol.fact = {{selected.FactorGroup | safe}}, factor.as.char = {{selected.factaschar | safe}}, tol.char = {{selected.CharacterGroup | safe}}, tol.vars = {{selected.VarNameGroup | safe}})

#### Actually do the summary
temp.out.summary <- summary( compare.out )

#### My own function for printing the object with BSkyFormat wrappers included
print.summary.comparedf.bsky <- function (x, ..., format = "pandoc") {
  orig <- x
  sumdiffs <- sum(x$diffs.byvar.table$n)
  ctrl <- x$control
  ctrl$max.print.vars.ns <- ctrl$max.print.vars
  ctrl$max.print.vars.nc <- ctrl$max.print.vars
  if (is.null(ctrl$max.print.diffs.per.var) || is.na(ctrl$max.print.diffs.per.var)) { ctrl$max.print.diffs.per.var <- sumdiffs }
  if (nrow(x$diffs.table) > 0) {
    x$diffs.table <- do.call(rbind, by(x$diffs.table, factor(x$diffs.table$var.x, levels = unique(x$diffs.table$var.x)), utils::head, ctrl$max.print.diffs.per.var))
    as_char <- function(x) { 
  if (is.factor(x) || is.Date(x)) { x <- as.character(x) }
  else { x }
 }
 
 #### For BlueSky, coerce these values to vectors instead using unlist()
 #### Per Ethan, to ensure dates work, coerce to a character instead of using unlist()
    #x$diffs.table$values.x <- unlist(lapply(x$diffs.table$values.x, as_char))
    #x$diffs.table$values.y <- unlist(lapply(x$diffs.table$values.y, as_char))
 x$diffs.table$values.x <- vapply(x$diffs.table$values.x, as.character, "")
 x$diffs.table$values.y <- vapply(x$diffs.table$values.y, as.character, "")
  }
  for (v in c("frame.summary", "comparison.summary", "vars.ns", "vars.nc", "obs", "diffs.byvar", "diffs", "attrs")) {
    obj <- x[[paste0(v, ".table")]]
    nprint <- ctrl[[paste0("max.print.", v)]]
    if (is.null(nprint) || is.na(nprint)) { nprint <- nrow(obj) }
    caption <- switch(v, frame.summary = "Summary of data.frames", comparison.summary = "Summary of overall comparison", vars.ns = "Variables not shared", vars.nc = "Other variables not compared", obs = "Observations not shared", diffs.byvar = "Differences detected by variable", diffs = "Differences detected", attrs = "Non-identical attributes")
    if (nrow(obj) > 0) {
      if (v == "diffs" && sumdiffs > min(nprint, nrow(obj))) {
        caption <- paste0(caption, " (", sumdiffs - min(nprint, nrow(obj)), " not shown)")
      }
      else if (nrow(obj) > nprint) {
        caption <- paste0(caption, " (", nrow(obj) - nprint, " not shown)")
      }
   #### BSkyFormat can't handle a kable() object so I need to print the raw data frame
   BSkyFormat(utils::head(obj, nprint), singleTableOutputHeader = caption)
    }
    else {
      nocaption <- paste0("No ", tolower(caption))
   #### BSkyFormat can't handle a kable() object so I need to print the raw data frame
   #### Also change x variable name to Note for nicer printing
   BSkyFormat(data.frame(Note = nocaption), singleTableOutputHeader = caption, no_row_column_headers = TRUE)
    }
  }
}

# Invoke the print function
print.summary.comparedf.bsky(temp.out.summary)
`
        };
        var objects = {
			dataset_var: {
				el: new srcDataSetList(config, {
				action: "move"
				}) 
			},
			in1: {
				el: new dstVariable(config, {
				label: localization.en.in1label,
				no: "in1",
				filter: "Dataset",
				extraction: "NoPrefix|UseComma",
				required: true,
				})
			},
			in2: {
				el: new dstVariable(config, {
				label: localization.en.in2label,
				no: "in2",
				filter: "Dataset",
				extraction: "NoPrefix|UseComma",
				required: true,
				})
			},
			defcomplabel: {
				el: new labelVar(config, {
				label: localization.en.defcomplabel, 
				style: "mt-4", 
				h:5
				})
			},
			numtolcontrolslabel: {
				el: new labelVar(config, {
				label: localization.en.numtolcontrolslabel, 
				style: "mt-4", 
				h:5
				})
			},
			numabsolute: {
				el: new radioButton(config, {
				label: localization.en.numabsolutelabel,
				no: "TestRadioGroup",
				style: "ml-3",
				increment: "numabsolute",
				value: "'absolute'",
				state: "checked",
				extraction: "ValueAsIs",
				})
			},
			numpercent: {
				el: new radioButton(config, {
				label: localization.en.numpercentlabel,
				no: "TestRadioGroup",
				style: "ml-3",
				increment: "numpercent",
				value: "'percent'",
				state: "",
				extraction: "ValueAsIs",
				})
			},
			numtolval: {
				el: new input(config, {
				no: 'numtolval',
				label: localization.en.numtolvallabel,
				style: "ml-5 mt-1 mb-2",
				extraction: "TextAsIs",
				type: "numeric",
				allow_spaces: true,
				wrapped: ", tol.num.val = %val%", 
				width:"w-25",
				})
			},	
			intasnum: {
				el: new checkbox(config, {
				label: localization.en.intasnumlabel,
				no: "intasnum",
				style: "ml-5",
				extraction: "Boolean"
				})
			},
			facttolcontrolslabel: {
				el: new labelVar(config, {
				label: localization.en.facttolcontrolslabel, 
				style: "mt-3", 
				h:5
				})
			},
			factnone: {
				el: new radioButton(config, {
				label: localization.en.factnonelabel,
				no: "FactorGroup",
				style: "ml-3",
				increment: "factnone",
				value: "'none'",
				state: "checked",
				extraction: "ValueAsIs",
				})
			},			
			factlevels: {
				el: new radioButton(config, {
				label: localization.en.factlevelslabel,
				no: "FactorGroup",
				style: "ml-3",
				increment: "factlevels",
				value: "'levels'",
				state: "",
				extraction: "ValueAsIs",
				})
			},			
			factlabels: {
				el: new radioButton(config, {
				label: localization.en.factlabelslabel,
				no: "FactorGroup",
				style: "ml-3",
				increment: "factlabels",
				value: "'labels'",
				state: "",
				extraction: "ValueAsIs",
				})
			},			
			factaschar: {
				el: new checkbox(config, {
				label: localization.en.factascharlabel,
				no: "factaschar",
				style: "ml-5 mt-2",
				extraction: "Boolean"
				})
			},			
			chartolcontrolslabel: {
				el: new labelVar(config, {
				label: localization.en.chartolcontrolslabel, 
				style: "mt-3", 
				h:5
				})
			},
			charnone: {
				el: new radioButton(config, {
				label: localization.en.charnonelabel,
				no: "CharacterGroup",
				style: "ml-3",
				increment: "charnone",
				value: "'none'",
				state: "checked",
				extraction: "ValueAsIs",
				})
			},			
			charcase: {
				el: new radioButton(config, {
				label: localization.en.charcaselabel,
				no: "CharacterGroup",
				style: "ml-3",
				increment: "charcase",
				value: "'case'",
				state: "",
				extraction: "ValueAsIs",
				})
			},			
			chartrim: {
				el: new radioButton(config, {
				label: localization.en.chartrimlabel,
				no: "CharacterGroup",
				style: "ml-3",
				increment: "chartrim",
				value: "'trim'",
				state: "",
				extraction: "ValueAsIs",
				})
			},
			charboth: {
				el: new radioButton(config, {
				label: localization.en.charbothlabel,
				no: "CharacterGroup",
				style: "ml-3",
				increment: "charboth",
				value: "'both'",
				state: "",
				extraction: "ValueAsIs",
				})
			},			
			varnametolcontrolslabel: {
				el: new labelVar(config, {
				label: localization.en.varnametolcontrolslabel, 
				style: "mt-3", 
				h:5
				})
			},
			varnamenone: {
				el: new radioButton(config, {
				label: localization.en.varnamenonelabel,
				no: "VarNameGroup",
				style: "ml-3",
				increment: "varnamenone",
				value: "''",
				state: "checked",
				extraction: "ValueAsIs",
				})
			},			
			varnamedots: {
				el: new radioButton(config, {
				label: localization.en.varnamedotslabel,
				no: "VarNameGroup",
				style: "ml-3",
				increment: "varnamedots",
				value: "'._ '",
				state: "",
				extraction: "ValueAsIs",
				})
			},			
			varnamecase: {
				el: new radioButton(config, {
				label: localization.en.varnamecaselabel,
				no: "VarNameGroup",
				style: "ml-3",
				increment: "varnamecase",
				value: "'case'",
				state: "",
				extraction: "ValueAsIs",
				})
			},
			varnameboth: {
				el: new radioButton(config, {
				label: localization.en.varnamebothlabel,
				no: "VarNameGroup",
				style: "ml-3",
				increment: "varnameboth",
				value: 'c("._ ","case")',
				state: "",
				extraction: "ValueAsIs",
				})
			},
			idoptionslabel: {
				el: new labelVar(config, {
				label: localization.en.idoptionslabel, 
				style: "mt-5", 
				h:5
				})
			},			
			by: {
				el: new input(config, {
				no: 'by',
				label: localization.en.bylabel,
				extraction: "TextAsIs",
				allow_spaces: true,
				type: "character",
				wrapped: ', by=c(%val%)'
				})
			},
			bydifflabel: {
				el: new labelVar(config, {
				label: localization.en.bydifflabel,
				style: "mt-3",				
				h:4
				})
			},
			byx: {
				el: new input(config, {
				no: 'byx',
				label: localization.en.byxlabel,
				style: "ml-3",
				extraction: "TextAsIs",
				allow_spaces: true,
				type: "character",
				wrapped: ', by.x=c(%val%)'
				})
			},
			byy: {
				el: new input(config, {
				no: 'byy',
				label: localization.en.byylabel,
				style: "ml-3",
				extraction: "TextAsIs",
				allow_spaces: true,
				type: "character",
				wrapped: ', by.y=c(%val%)'
				})
			}			
        };

        const content = {
            left: [objects.dataset_var.el.content],
            right: [objects.in1.el.content, objects.in2.el.content,					 
					objects.defcomplabel.el.content, objects.numtolcontrolslabel.el.content, objects.numabsolute.el.content, objects.numpercent.el.content, 
					objects.numtolval.el.content, objects.intasnum.el.content,					
					objects.facttolcontrolslabel.el.content, objects.factnone.el.content, objects.factlevels.el.content, objects.factlabels.el.content, objects.factaschar.el.content,
					objects.chartolcontrolslabel.el.content, objects.charnone.el.content, objects.charcase.el.content, objects.chartrim.el.content, objects.charboth.el.content,
					objects.varnametolcontrolslabel.el.content, objects.varnamenone.el.content, objects.varnamedots.el.content, objects.varnamecase.el.content, objects.varnameboth.el.content,
					objects.idoptionslabel.el.content, objects.by.el.content, objects.bydifflabel.el.content, objects.byx.el.content, objects.byy.el.content],
            nav: {
                name: localization.en.navigation,
                icon: "icon-compare",
				positionInNav: 1,
                modal: config.id
            }
        };
        super(config, objects, content);
        this.help = localization.en.help;
    }
	
	
}
module.exports.item = new CompareDatasets().render()