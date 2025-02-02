


class FindDuplicates extends baseModal {
    static dialogId = 'FindDuplicates'
    static t = baseModal.makeT(FindDuplicates.dialogId)

    constructor() {
        var config = {
            id: FindDuplicates.dialogId,
            label: FindDuplicates.t('title'),
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
				label: FindDuplicates.t('keysnote'),
				style: "mt-3 mb-4",
				h:5
				})
			},			
			keyvars: {
				el: new dstVariableList(config,{
				label: FindDuplicates.t('keyvarslabel'),
				no: "keyvars",
				filter:"String|Numeric|Date|Logical|Ordinal|Nominal|Scale",
				extraction: "NoPrefix|UseComma",
				})
			},				
            allduprowscheck: {
                el: new checkbox(config, {
                    label: FindDuplicates.t('allduprowschecklabel'),
                    no: "allduprowscheck",
                    extraction: "Boolean",
                    newline: true,
                    style:"mt-3"
                })
            },		
            allduprowsname: {
                el: new input(config, {
                    no: 'allduprowsname',
                    label: FindDuplicates.t('allduprowsnamelabel'),
					style: "ml-5",
                    placeholder: "allduprows",
                    type: "character",
                    extraction: "TextAsIs",
                    value: "allduprows"
                })
            }, 
            alldatacheck: {
                el: new checkbox(config, {
                    label: FindDuplicates.t('alldatachecklabel'),
                    no: "alldatacheck",
                    extraction: "Boolean",
                    newline: true,
                    style:"mt-3"
                })
            },
            alldataname: {
                el: new input(config, {
                    no: 'alldataname',
                    label: FindDuplicates.t('alldatanamelabel'),
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
                    label: FindDuplicates.t('dupvarnamelabel'),
					style: "ml-5",
                    placeholder: "duplicate",
                    type: "character",
                    extraction: "TextAsIs",
                    value: "duplicate"
                })
            },
            nodupdatacheck: {
                el: new checkbox(config, {
                    label: FindDuplicates.t('nodupdatachecklabel'),
                    no: "nodupdatacheck",
                    extraction: "Boolean",
                    newline: true,
                    style:"mt-3"
                })
            },					
            nodupdataname: {
                el: new input(config, {
                    no: 'nodupdataname',
                    label: FindDuplicates.t('nodupdatanamelabel'),
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
                name: FindDuplicates.t('navigation'),
                icon: "icon-paired",
				positionInNav: 3,
                modal: config.id
            }
        }
        super(config, objects, content);
        
        this.help = {
            title: FindDuplicates.t('help.title'),
            r_help: FindDuplicates.t('help.r_help'), //r_help: "help(data,package='utils')",
            body: FindDuplicates.t('help.body')
        }
;
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
            res.push({ cmd: cmd, cgid: newCommandGroup(`${instance.config.id}`, `${instance.config.label}`), oriR: instance.config.RCode, code_vars: code_vars })
            return res;		
	}		
	
	
}

module.exports = {
    render: () => new FindDuplicates().render()
}
