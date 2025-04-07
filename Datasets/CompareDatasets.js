










class CompareDatasets extends baseModal {
    static dialogId = 'CompareDatasets'
    static t = baseModal.makeT(CompareDatasets.dialogId)

    constructor() {
        var config = {
            id: CompareDatasets.dialogId,
            label: CompareDatasets.t('title'),
			splitProcessing: false,
            modalType: "two",
            RCode: `
library(arsenal)

#### Create the comparison object
compare.out <- comparedf( {{selected.in1 | safe}}, {{selected.in2 | safe}}{{selected.by | safe}}{{selected.byx | safe}}{{selected.byy | safe}}, tol.num = {{selected.TestRadioGroup | safe}}, int.as.num = {{selected.intasnum | safe}}, tol.fact = {{selected.FactorGroup | safe}}, factor.as.char = {{selected.factaschar | safe}}, tol.char = {{selected.CharacterGroup | safe}}, tol.vars = {{selected.VarNameGroup | safe}})

#### Actually do the summary
temp.out.summary <- summary( compare.out )

#### My own function for printing the object with BSkyFormat wrappers included
print.summary.comparedf.bsky <<- function (x, ..., format = "pandoc") {
  orig <- x
  sumdiffs <- sum(x$diffs.byvar.table$n)
  ctrl <- x$control
  ctrl$max.print.vars.ns <- ctrl$max.print.vars
  ctrl$max.print.vars.nc <- ctrl$max.print.vars
  if (is.null(ctrl$max.print.diffs.per.var) || is.na(ctrl$max.print.diffs.per.var)) { ctrl$max.print.diffs.per.var <- sumdiffs }
  if (nrow(x$diffs.table) > 0) {
    x$diffs.table <- do.call(rbind, by(x$diffs.table, factor(x$diffs.table$var.x, levels = unique(x$diffs.table$var.x)), utils::head, ctrl$max.print.diffs.per.var))
    as_char <<- function(x) { 
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
				label: CompareDatasets.t('in1label'),
				no: "in1",
				filter: "Dataset",
				extraction: "NoPrefix|UseComma",
				required: true,
				})
			},
			in2: {
				el: new dstVariable(config, {
				label: CompareDatasets.t('in2label'),
				no: "in2",
				filter: "Dataset",
				extraction: "NoPrefix|UseComma",
				required: true,
				})
			},
			defcomplabel: {
				el: new labelVar(config, {
				label: CompareDatasets.t('defcomplabel'), 
				style: "mt-4", 
				h:5
				})
			},
			numtolcontrolslabel: {
				el: new labelVar(config, {
				label: CompareDatasets.t('numtolcontrolslabel'), 
				style: "mt-4", 
				h:5
				})
			},
			numabsolute: {
				el: new radioButton(config, {
				label: CompareDatasets.t('numabsolutelabel'),
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
				label: CompareDatasets.t('numpercentlabel'),
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
				label: CompareDatasets.t('numtolvallabel'),
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
				label: CompareDatasets.t('intasnumlabel'),
				no: "intasnum",
				style: "ml-5",
				extraction: "Boolean"
				})
			},
			facttolcontrolslabel: {
				el: new labelVar(config, {
				label: CompareDatasets.t('facttolcontrolslabel'), 
				style: "mt-3", 
				h:5
				})
			},
			factnone: {
				el: new radioButton(config, {
				label: CompareDatasets.t('factnonelabel'),
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
				label: CompareDatasets.t('factlevelslabel'),
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
				label: CompareDatasets.t('factlabelslabel'),
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
				label: CompareDatasets.t('factascharlabel'),
				no: "factaschar",
				style: "ml-5 mt-2",
				extraction: "Boolean"
				})
			},			
			chartolcontrolslabel: {
				el: new labelVar(config, {
				label: CompareDatasets.t('chartolcontrolslabel'), 
				style: "mt-3", 
				h:5
				})
			},
			charnone: {
				el: new radioButton(config, {
				label: CompareDatasets.t('charnonelabel'),
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
				label: CompareDatasets.t('charcaselabel'),
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
				label: CompareDatasets.t('chartrimlabel'),
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
				label: CompareDatasets.t('charbothlabel'),
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
				label: CompareDatasets.t('varnametolcontrolslabel'), 
				style: "mt-3", 
				h:5
				})
			},
			varnamenone: {
				el: new radioButton(config, {
				label: CompareDatasets.t('varnamenonelabel'),
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
				label: CompareDatasets.t('varnamedotslabel'),
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
				label: CompareDatasets.t('varnamecaselabel'),
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
				label: CompareDatasets.t('varnamebothlabel'),
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
				label: CompareDatasets.t('idoptionslabel'), 
				style: "mt-5", 
				h:5
				})
			},			
			by: {
				el: new input(config, {
				no: 'by',
				label: CompareDatasets.t('bylabel'),
				extraction: "TextAsIs",
				allow_spaces: true,
				type: "character",
				wrapped: ', by=c(%val%)'
				})
			},
			bydifflabel: {
				el: new labelVar(config, {
				label: CompareDatasets.t('bydifflabel'),
				style: "mt-3",				
				h:4
				})
			},
			byx: {
				el: new input(config, {
				no: 'byx',
				label: CompareDatasets.t('byxlabel'),
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
				label: CompareDatasets.t('byylabel'),
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
                name: CompareDatasets.t('navigation'),
                icon: "icon-compare",
				positionInNav: 1,
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: CompareDatasets.t('help.title'),
            r_help: CompareDatasets.t('help.r_help'), //r_help: "help(data,package='utils')",
            body: CompareDatasets.t('help.body')
        }
;
    }
	
	
}

module.exports = {
    render: () => new CompareDatasets().render()
}
