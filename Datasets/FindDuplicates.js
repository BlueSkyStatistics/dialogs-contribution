
var localization = {
    en: {
        title: "Find Duplicates",
        navigation: "Find Duplicates",
		keysnote: "NOTE: Specifying no key variables will result in a complete case duplicate search.  Specifying key variables will seach for duplicates by key variable values only.",
		keyvarslabel: "Key Variables (optional)",
		allduprowschecklabel: "Create dataset with all rows associated with the duplicates",
		allduprowsnamelabel: "Dataset name",
		alldatachecklabel: "Create dataset with original data and column indicating duplicates",
		alldatanamelabel: "Dataset name",
		dupvarnamelabel: "Duplicate variable name",
		nodupdatachecklabel: "Create dataset with all duplicates removed",
		nodupdatanamelabel: "Dataset name",
        help: {
            title: "Find Duplicates",
            r_help: "help(duplicated, package = 'base')",
            body: `
This dialog will find duplicates either by complete cases or by key variables.  Complete case duplicates are equal for every value for every variable.  Duplicates using key 
variables are duplicates defined only by equal values for specific variables, called "keys".  Duplicates are searched from the top to the bottom of the data set.  So, a 
duplicate row means the values are equal to a previous row.  Summaries of the duplicates are provided.
<br/><br/>
<b>Key Variables:</b>  Specify optional key variables that define the duplicates.  If no key variables are selected, complete case duplicates will be searched for.
<br/><br/>
<b>Create dataset with all rows associated with the duplicates:</b>  This will create a dataset of all duplicate rows and the first instance of each row corresponding to 
each duplicate.  The output dataset will be sorted by all the variables in the complete duplicate case and by the key variables in the key variable case.  The key variables 
will also be moved to the beginning of the output data set.  The <b>Dataset name</b> field can be used to name this output data set.
<br/><br/>
<b>Create dataset with original data and column indicating duplicates:</b>  This will create a dataset including all the original data plus an additional column indicating 
the duplicate rows (0=not duplicate, 1=duplicate).  The <b>Dataset name</b> field can be used to name this output data set.  The <b>Duplicate variable name</b> field can be used to name 
this additional column.
<br/><br/>
<b>Create dataset with all duplicates removed:</b>  This will create a dataset that removes all the duplicate rows (either complete case or by key variables) where the 
duplicates are searched from top to bottom in the data set.  This means all 2nd, 3rd, etc. instances of the rows will be removed.  The </b>Dataset name</b> field can be used to name 
this output data set.
<br/><br/>
<b>Required R Packages:</b> dplyr, arsenal
`}
    }
}

class FindDuplicates extends baseModal {
    constructor() {
        var config = {
            id: "FindDuplicates",
            label: localization.en.title,
			splitProcessing: false,
            modalType: "two",
            RCode: `
library(dplyr)
library(arsenal)

keyvars <- c({{selected.quotedkeyvars | safe}})

# T/F vector indicating duplicate rows
if (is.null(keyvars)) {
dupvec <- duplicated({{dataset.name}})
} else {
dupvec <- duplicated({{dataset.name}}[ , c({{selected.quotedkeyvars | safe}})])
}

# number of rows and duplicate rows
numrows <- nrow({{dataset.name}})
numdups <- length(which(dupvec))

# rows associated with the duplicates
duprows <- filter({{dataset.name}}, dupvec)
if (is.null(keyvars)) {
{{selected.allduprowsname | safe}} <- suppressMessages(semi_join({{dataset.name}}, duprows))
{{selected.allduprowsname | safe}} <- arrange_all({{selected.allduprowsname | safe}})
} else {
{{selected.allduprowsname | safe}} <- semi_join({{dataset.name}}, duprows, by=c({{selected.quotedkeyvars | safe}}))
{{selected.allduprowsname | safe}} <- arrange({{selected.allduprowsname | safe}}, {{selected.keyvars | safe}})
{{selected.allduprowsname | safe}} <- dplyr::select({{selected.allduprowsname | safe}}, {{selected.keyvars | safe}}, everything())
}
nrows_allduprows <- nrow({{selected.allduprowsname | safe}})

# table listing key variables
if (!is.null(keyvars)) {
keytable <- data.frame(Key.Variables=c({{selected.quotedkeyvars | safe}}))
BSkyFormat(keytable, singleTableOutputHeader="Key Variables Defining Duplicates for {{dataset.name}}")
}

counttable <- data.frame(N=numrows, Duplicates=numdups, Rows.Associated.Duplicates=nrows_allduprows)
BSkyFormat(counttable, singleTableOutputHeader="Number of Rows, Duplicates, and Rows Associated with Duplicates for {{dataset.name}}")

# frequencies of each key combination when there are duplicates
if ((!is.null(keyvars)) & (numdups>0)) {
mytab <- table({{dataset.name}}[,c({{selected.quotedkeyvars | safe}})],useNA="ifany")
multiway <- as.data.frame(freqlist(mytab,na.options="include",sparse=FALSE))
multiway_dups <- filter(multiway, Freq>=2)
multiway_dups <- dplyr::select(multiway_dups, -c(cumFreq, freqPercent, cumPercent))
names(multiway_dups)[1:length(keyvars)] <- keyvars  # fixes one key variable issue
BSkyFormat(multiway_dups, singleTableOutputHeader="Frequency of Rows Associated with the Duplicates by Keys for {{dataset.name}}")
}

# if want a data set with all rows associated with the duplicates
BSkyLoadRefresh("{{selected.allduprowsname | safe}}", load.dataframe={{selected.allduprowscheck | safe}})

# if want a data set with an indicator variable for duplicate rows
{{selected.alldataname | safe}} <- mutate({{dataset.name}}, {{selected.dupvarname | safe}}=as.numeric(dupvec))
BSkyLoadRefresh("{{selected.alldataname | safe}}", load.dataframe={{selected.alldatacheck | safe}})

# if want a data set with duplicates removed
{{selected.nodupdataname | safe}} <- filter({{dataset.name}}, !dupvec)
BSkyLoadRefresh("{{selected.nodupdataname | safe}}", load.dataframe={{selected.nodupdatacheck | safe}})
`
        }
        var objects = {
            content_var: {
                el: new srcVariableList(config, {
                    action: "move"
                })
            },
			keysnote: {
				el: new labelVar(config, {
				label: localization.en.keysnote,
				style: "mt-3 mb-4",
				h:5
				})
			},			
			keyvars: {
				el: new dstVariableList(config,{
				label: localization.en.keyvarslabel,
				no: "keyvars",
				filter:"String|Numeric|Date|Logical|Ordinal|Nominal|Scale",
				extraction: "NoPrefix|UseComma",
				})
			},				
            allduprowscheck: {
                el: new checkbox(config, {
                    label: localization.en.allduprowschecklabel,
                    no: "allduprowscheck",
                    extraction: "Boolean",
                    newline: true,
                    style:"mt-3"
                })
            },		
            allduprowsname: {
                el: new input(config, {
                    no: 'allduprowsname',
                    label: localization.en.allduprowsnamelabel,
					style: "ml-5",
                    placeholder: "allduprows",
                    type: "character",
                    extraction: "TextAsIs",
                    value: "allduprows"
                })
            }, 
            alldatacheck: {
                el: new checkbox(config, {
                    label: localization.en.alldatachecklabel,
                    no: "alldatacheck",
                    extraction: "Boolean",
                    newline: true,
                    style:"mt-3"
                })
            },
            alldataname: {
                el: new input(config, {
                    no: 'alldataname',
                    label: localization.en.alldatanamelabel,
					style: "ml-5",
                    placeholder: "datadupvar",
                    type: "character",
                    extraction: "TextAsIs",
                    value: "datadupvar"
                })
            }, 
            dupvarname: {
                el: new input(config, {
                    no: 'dupvarname',
                    label: localization.en.dupvarnamelabel,
					style: "ml-5",
                    placeholder: "duplicate",
                    type: "character",
                    extraction: "TextAsIs",
                    value: "duplicate"
                })
            },
            nodupdatacheck: {
                el: new checkbox(config, {
                    label: localization.en.nodupdatachecklabel,
                    no: "nodupdatacheck",
                    extraction: "Boolean",
                    newline: true,
                    style:"mt-3"
                })
            },					
            nodupdataname: {
                el: new input(config, {
                    no: 'nodupdataname',
                    label: localization.en.nodupdatanamelabel,
					style: "ml-5",
                    placeholder: "nodupdata",
                    type: "character",
                    extraction: "TextAsIs",
                    value: "nodupdata"
                })
            }
        };
		
       
        const content = {
			head: [objects.keysnote.el.content],
            left: [objects.content_var.el.content],
            right: [objects.keyvars.el.content, objects.allduprowscheck.el.content, objects.allduprowsname.el.content,
					objects.alldatacheck.el.content, objects.alldataname.el.content, objects.dupvarname.el.content,
					objects.nodupdatacheck.el.content, objects.nodupdataname.el.content
            ],
            nav: {
                name: localization.en.navigation,
                icon: "icon-paired",
				positionInNav: 3,
                modal: config.id
            }
        }
        super(config, objects, content);
        this.help = localization.en.help;
    }
	
	
	prepareExecution(instance) {
		//following lines will be there
		var res = [];
		var code_vars = {
            dataset: {
                name: $(`#${instance.config.id}`).attr('dataset') ? $(`#${instance.config.id}`).attr('dataset') : getActiveDataset()
            },
            selected: instance.dialog.extractData()
        }
		
		//create several formats

		//creating correct string for strata variables in model call and output dataset

		let quotedkeyvars=code_vars.selected.keyvars.toString().replaceAll(",", "','")
		if (quotedkeyvars != "") {
			quotedkeyvars="'"+quotedkeyvars+"'"
		}
			
	
		//create new variables under code_vars		
		code_vars.selected.quotedkeyvars = quotedkeyvars
		
		
		//final piece of code
            const cmd = instance.dialog.renderR(code_vars);
            res.push({ cmd: cmd, cgid: newCommandGroup() })
            return res;		
	}		
	
	
}
module.exports.item = new FindDuplicates().render()