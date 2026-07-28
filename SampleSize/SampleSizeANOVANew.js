/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */

/*
 * ---------------------------------------------------------------------------
 * CHANGE NOTES (this revision) - ported from SampleSizeOneMeanNew.js /
 * SampleSizeSurvivalCoxNew.js, using the same conventions.
 * ---------------------------------------------------------------------------
 * 1. Sample Size per Group, Power, Standard Deviation, and Significance
 *    Level now accept a comma-separated LIST of values. The R code builds
 *    an expand.grid() across every supplied value and calls
 *    power.anova.test() once per combination.
 *
 * 2. Number of Groups and Group Means are NOT vectorized: Group Means is
 *    itself a comma-separated list that defines a SINGLE effect-size
 *    scenario (via var(c(...))) - supporting multiple full sets of group
 *    means would need a different input format (e.g. semicolon-separated
 *    groups of comma lists) and is out of scope for this revision. Number
 *    of Groups stays a single spinner value, matching the original dialog.
 *
 * 3. The original dialog's third solve-mode ("compute detectable variance
 *    of the group means", which requires leaving Group Means blank) is NOT
 *    supported here, since Group Means is a free-text list rather than a
 *    single numeric field this patch's blank-to-solve-for mechanism can
 *    work with. Only Sample Size and Power can be solved for.
 *
 * 4. This dialog no longer needs the framework's "wrapped" input trick or
 *    the string-slicing workaround in prepareExecution() that reverse-
 *    engineered wrapped's rendered output - the RCode is now built
 *    explicitly (like all the other "New" dialogs), so Group Means is
 *    referenced directly via {{selected.grpmeans | safe}}.
 *
 * 5. A "Generate Power Curve Plot" checkbox + X-Axis dropdown + multi-select
 *    Group/Color By comboBox, with the same Inf-row filter, "points only
 *    when x doesn't uniquely determine y" fallback, auto-grouping when
 *    Group/Color By is left at None but other fields still vary, combined
 *    multi-field grouping, and the singleton-group geom_line() guard.
 *
 * 6. Chart Title / X Label / Y Label text inputs, a Legend Position
 *    dropdown, {{selected.BSkyThemes | safe}} for the shared app-wide
 *    ggplot theme, and a table footer noting the group means and number of
 *    groups used (fixed for the whole run), with row numbers suppressed.
 * ---------------------------------------------------------------------------
 */



class SampleSizeANOVANew extends baseModal {
    static dialogId = 'SampleSizeANOVANew'
    static t = baseModal.makeT(SampleSizeANOVANew.dialogId)

    constructor() {
        var config = {
            id: SampleSizeANOVANew.dialogId,
            label: SampleSizeANOVANew.t('title'),
			splitProcessing: false,
            modalType: "one",
            RCode: `
library(ggplot2)

## ---- fixed (non-vectorized) inputs: number of groups & group means -------
numgrps      <- {{selected.numgrps | safe}}

grpmeans_var <- var(c({{selected.grpmeans | safe}}))

## ---- build value vectors from (possibly comma-separated) inputs ----------
n_vals        <- {{selected.nvec | safe}}

power_vals    <- {{selected.powervec | safe}}

sd_vals       <- {{selected.sdvec | safe}}

siglevel_vals <- {{selected.siglevelvec | safe}}

## ---- every combination of supplied values (SAS-style "what-if" grid) -----
paramGrid <- expand.grid(
    n        = n_vals,
    power    = power_vals,
    sd       = sd_vals,
    siglevel = siglevel_vals,
    stringsAsFactors = FALSE
)

results <- do.call(rbind, lapply(seq_len(nrow(paramGrid)), function(i) {
    row <- paramGrid[i, ]
    res <- tryCatch({
        if (is.na(row$n)) {
            # solving for sample size per group, given power
            pr <- power.anova.test(
                groups = numgrps, power = row$power, between.var = grpmeans_var,
                within.var = row$sd ^ 2, sig.level = row$siglevel
            )
            data.frame(n = pr$n, power = row$power)
        } else {
            # solving for power, given sample size per group
            pr <- power.anova.test(
                groups = numgrps, n = row$n, between.var = grpmeans_var,
                within.var = row$sd ^ 2, sig.level = row$siglevel
            )
            data.frame(n = row$n, power = pr$power)
        }
    }, error = function(e) {
        cat(sprintf(
            "Row %d failed (n=%s, power=%s, sd=%s, siglevel=%s): %s\\n",
            i, row$n, row$power, row$sd, row$siglevel,
            conditionMessage(e)
        ))
        NULL
    })
    if (is.null(res)) return(NULL)
    names(res) <- paste0("result_", names(res))
    cbind(row, res)
}))

if (is.null(results) || nrow(results) == 0) {

    cat("No sample size / power results could be computed for the values supplied.\\n",
        "See the row-level error messages above for details.\\n")

} else {

    # Which quantity was actually left blank to be solved for. Needed both
    # to mask that column's NA as "" below, and to know which result_*
    # column is NOT a pure duplicate of an input column.
    solvedFor <- if (all(is.na(n_vals))) "n" else "power"

    # Build a display copy for the table: show "" instead of NA for whichever
    # of n / power was left blank to be solved for.
    resultsDisplay <- results
    resultsDisplay$n     <- ifelse(is.na(resultsDisplay$n),     "", as.character(resultsDisplay$n))
    resultsDisplay$power <- ifelse(is.na(resultsDisplay$power), "", as.character(resultsDisplay$power))

    # Drop whichever result_* column is a guaranteed duplicate of its input
    # column (i.e. the one that was NOT solved for).
    dropCols <- c()
    if (solvedFor != "n")     dropCols <- c(dropCols, "result_n")
    if (solvedFor != "power") dropCols <- c(dropCols, "result_power")
    resultsDisplay <- resultsDisplay[, !(names(resultsDisplay) %in% dropCols), drop = FALSE]

    row.names(resultsDisplay) <- NULL

    BSkyFormat(resultsDisplay, singleTableOutputHeader="Sample Size / Power Results (all combinations)",
               perTableFooter = paste0("Number of Groups: ", numgrps,
                                        " | Group Means: ", "{{selected.grpmeans | safe}}","\n",
										  "result_n is number in each group", "\n",
										  "Balanced one-way analysis of variance power calculation"
										))

    ## ---- optional power curve ---------------------------------------------
    if ({{selected.plotcurve | safe}}) {

        # The dropdowns show short, user-friendly names; translate to the
        # actual internal column names used below.
        toColumn <- function(v) {
            switch(v, n = "n_eff", power = "power_eff", v)
        }
        toLabel <- function(v) {
            switch(v,
                n        = "Sample Size per Group",
                power    = "Power",
                sd       = "Standard Deviation",
                siglevel = "Significance Level",
                v
            )
        }
        # Shorter version used ONLY for the legend (title + per-point labels),
        # since legend space is tight - axis labels still use the full name
        # above via toLabel().
        toShortLabel <- function(v) {
            switch(v,
                n        = "N",
                power    = "Power",
                sd       = "SD",
                siglevel = "SigLev",
                v
            )
        }

        xvarRaw   <- "{{selected.curvex | safe}}"
        groupsel  <- "{{selected.curvegroup | safe}}"
        xvar      <- toColumn(xvarRaw)

        plotDat <- results

        # "n_eff" / "power_eff" fall back to the computed result whenever the
        # raw input was left blank (NA), avoiding an all-NA plotting column.
        plotDat$n_eff     <- ifelse(is.na(plotDat$n),     plotDat$result_n,     plotDat$n)
        plotDat$power_eff <- ifelse(is.na(plotDat$power), plotDat$result_power, plotDat$power)

        yvar <- switch(solvedFor, n = "n_eff", power = "power_eff")
        ylab <- switch(solvedFor, n = "Required Sample Size per Group", power = "Power")

        if (xvar == yvar) {
            if (yvar == "n_eff") {
                yvar <- "power_eff"; ylab <- "Power"
            } else {
                yvar <- "n_eff"; ylab <- "Required Sample Size per Group"
            }
        }

        # Drop rows where the y-axis quantity is non-finite.
        nBefore <- nrow(plotDat)
        plotDat <- plotDat[is.finite(plotDat[[yvar]]), ]
        nDropped <- nBefore - nrow(plotDat)
        if (nDropped > 0) {
            cat(sprintf(
                "%d row(s) excluded from the plot because %s was not finite.\\n",
                nDropped, yvar
            ))
        }

        # Group/Color By allows MULTIPLE selections - combine every selected
        # field into one label per row so points sharing ALL selected fields
        # are grouped together.
        groupvarsRaw <- trimws(strsplit(groupsel, ",")[[1]])
        groupvarsRaw <- groupvarsRaw[groupvarsRaw != "" & groupvarsRaw != "none"]
        groupvars    <- vapply(groupvarsRaw, toColumn, character(1))
        keep         <- groupvars != xvar & groupvars != yvar & groupvars %in% names(plotDat)
        groupvarsRaw <- groupvarsRaw[keep]
        groupvars    <- groupvars[keep]

        if (length(groupvars) > 0 && nrow(plotDat) > 0) {
            plotDat$group_combo <- do.call(
                paste,
                c(Map(function(rawName, col) paste0(toShortLabel(rawName), "=", plotDat[[col]]),
                      groupvarsRaw, groupvars),
                  sep = ", ")
            )
            groupvar <- "group_combo"
        } else {
            groupvar <- "none"
        }

        # If the user left Group/Color By as "None" but other fields besides
        # x/y are STILL varying in the grid, an unlabeled stack of dots at
        # each x value is uninformative. Auto-detect which candidate fields
        # actually vary and color by them automatically in that case.
        autoGrouped <- FALSE
        if (groupvar == "none" && nrow(plotDat) > 0) {
            candidateRaw <- c("n", "power", "sd", "siglevel")
            candidateCol <- vapply(candidateRaw, toColumn, character(1))
            isVarying    <- vapply(candidateCol, function(v) {
                v %in% names(plotDat) && v != xvar && v != yvar &&
                    length(unique(plotDat[[v]])) > 1
            }, logical(1))

            if (any(isVarying)) {
                autoRaw <- candidateRaw[isVarying]
                autoCol <- candidateCol[isVarying]
                plotDat$group_combo <- do.call(
                    paste,
                    c(Map(function(rawName, col) paste0(toShortLabel(rawName), "=", plotDat[[col]]),
                          autoRaw, autoCol),
                      sep = ", ")
                )
                groupvar     <- "group_combo"
                groupvarsRaw <- autoRaw
                autoGrouped  <- TRUE
                cat("Note: Group/Color By was left as None, but", paste(vapply(autoRaw, toLabel, character(1)), collapse = " and "),
                    "still vary across these results, so the plot was automatically",
                    "colored by", paste(vapply(autoRaw, toLabel, character(1)), collapse = " x "),
                    "to distinguish the points. Choose Group/Color By yourself for full control.\\n")
            }
        }

        if (nrow(plotDat) == 0) {

            cat("No finite results remain to plot after filtering.\\n")

        } else if (groupvar != "none") {
            # Some groups may contain only a single point. geom_line()
            # through a singleton group draws nothing and warns "Each group
            # consists of only one observation" - so only draw lines for
            # groups that actually have more than one point, and always
            # draw all points.
            groupCounts   <- table(plotDat[[groupvar]])
            singletonGrps <- names(groupCounts)[groupCounts == 1]

            p <- ggplot(plotDat, aes(x = .data[[xvar]], y = .data[[yvar]],
                                      color = .data[[groupvar]], group = .data[[groupvar]])) +
                 geom_point()

            if (any(groupCounts > 1)) {
                lineDat <- if (length(singletonGrps) > 0) {
                    plotDat[!(plotDat[[groupvar]] %in% singletonGrps), ]
                } else {
                    plotDat
                }
                p <- p + geom_line(data = lineDat)
            }

            p <- p + labs(color = paste(vapply(groupvarsRaw, toShortLabel, character(1)), collapse = " x "))
        } else {
            # With no grouping and nothing else varying, only draw a
            # connecting line if x uniquely determines y.
            xHasMultipleY <- any(tapply(plotDat[[yvar]], plotDat[[xvar]],
                                          function(v) length(unique(v))) > 1)

            if (xHasMultipleY) {
                cat("Note: more than one result shares the same", toLabel(xvarRaw),
                    "value (other fields are still varying), so points are",
                    "shown without connecting lines. Select a Group/Color By",
                    "field to see them as separate curves.\\n")
                p <- ggplot(plotDat, aes(x = .data[[xvar]], y = .data[[yvar]])) +
                     geom_point()
            } else if (nrow(plotDat) > 1) {
                p <- ggplot(plotDat, aes(x = .data[[xvar]], y = .data[[yvar]], group = 1)) +
                     geom_line() + geom_point()
            } else {
                p <- ggplot(plotDat, aes(x = .data[[xvar]], y = .data[[yvar]])) +
                     geom_point()
            }
        }

        if (nrow(plotDat) > 0) {
            userTitle <- "{{selected.mainTitle | safe}}"
            userXlab  <- "{{selected.xlab | safe}}"
            userYlab  <- "{{selected.ylab | safe}}"

            plotTitle <- if (nzchar(trimws(userTitle))) userTitle else "Power Curve"
            plotXlab  <- if (nzchar(trimws(userXlab)))  userXlab  else toLabel(xvarRaw)
            plotYlab  <- if (nzchar(trimws(userYlab)))  userYlab  else ylab

            p <- p + labs(title = plotTitle, x = plotXlab, y = plotYlab) + {{selected.BSkyThemes | safe}}

            {{if(options.selected.legends =="Do not show")}}

            p <- p + theme(legend.position = "none")

            {{#else}}

            if (groupvar != "none") {
                p <- p + theme(legend.position = '{{selected.legends | safe}}')
            }

            {{/if}}

            print(p)
        }
    }
}
`
        };
        var objects = {
			howtouse: {
				el: new labelVar(config, {
					label: SampleSizeANOVANew.t('howtouse'), 
					style: "mb-3", 
					h:8
				})
			},
			numgrps: {
				el: new inputSpinner(config, {
					no: 'numgrps',
					label: SampleSizeANOVANew.t('numgrps'),
					style: "mt-5",
					min: 2,
					max: 10000,
					step: 1,
					value: 3,
					extraction: "NoPrefix|UseComma"
				})
			},
			n: {
				el: new input(config, {
					no: 'n',
					label: SampleSizeANOVANew.t('n'),
					placeholder: "e.g. 10,20,30",
					extraction: "TextAsIs",
					type: "text",
					allow_spaces: true,
					width:"w-50"
				})
			},
			grpmeans: {
				el: new input(config, {
					no: 'grpmeans',
					label: SampleSizeANOVANew.t('grpmeans'),
					type: "character",
					allow_spaces: true,
					value: "20, 25, 40",
					extraction: "TextAsIs",
					width:"w-50"
				})
			},
			power: {
				el: new input(config, {
					no: 'power',
					label: SampleSizeANOVANew.t('power'),
					extraction: "TextAsIs",
					type: "text",
					allow_spaces:true,
					value: "0.8",
					width:"w-50"
				})
			},
			sd: {
				el: new input(config, {
					no: 'sd',
					label: SampleSizeANOVANew.t('sd'),
					style: "mt-5",
					extraction: "TextAsIs",
					type: "text",
					allow_spaces: true,
					required: true,
					width:"w-50"
				})
			},
			siglevel: {
				el: new input(config, {
					no: 'siglevel',
					label: SampleSizeANOVANew.t('siglevel'),
					placeholder: "0.05",
					extraction: "TextAsIs",
					type: "text",
					allow_spaces: true,
					required: true,
					value: "0.05",
					width:"w-50"
				})
			},
			plotopt: {
				el: new labelVar(config, {
					label: SampleSizeANOVANew.t('plotopt'),
					style: "mt-5",
					h:5
				})
			},
			plotcurve: {
				el: new checkbox(config, {
					no: 'plotcurve',
					label: SampleSizeANOVANew.t('plotcurve'),
					state: "",
					extraction: "TextAsIs"
				})
			},
			curvex: {
				  el: new selectVar(config, {
					no: 'curvex',
					label: SampleSizeANOVANew.t('curvex'),
					extraction: "NoPrefix|UseComma",
					options: ["n", "power", "sd", "siglevel"],
					 default: "power",
					width:"w-50"
				})
			},
			curvegroup: {
				  el: new comboBox(config, {
					no: 'curvegroup',
					label: SampleSizeANOVANew.t('curvegroup'),
					multiple: true,
					extraction: "NoPrefix|UseComma",
					options: ["none", "n", "power", "sd", "siglevel"],
					default: "none",
					width:"w-50"
				})
			},
			mainTitle: {
                el: new input(config, {
                    no: "mainTitle",
                    label: SampleSizeANOVANew.t('mainTitle'),
                    allow_spaces: true,
                    placeholder: "Chart title",
                    extraction: "NoPrefix|UseComma",
					style: "mt-3",
					value: ""
                })
            },
			xlab: {
                el: new input(config, {
                    no: 'xlab',
                    label: SampleSizeANOVANew.t('xlab'),
                    allow_spaces: true,
                    placeholder: "X Axis",
                    extraction: "NoPrefix|UseComma",
					value: ""
                })
            },
			ylab: {
                el: new input(config, {
                    no: 'ylab',
                    label: SampleSizeANOVANew.t('ylab'),
                    allow_spaces: true,
                    placeholder: "Y Axis",
                    extraction: "NoPrefix|UseComma",
					value: ""
                })
            },
			legends: {
                el: new selectVar(config, {
                    no: 'legends',
                    label: SampleSizeANOVANew.t('legends'),
                    multiple: false,
					extraction: "NoPrefix",
					required: false,
                    options: ["right", "left", "top", "bottom", "Do not show"],
                    default: "right",
					width: "w-25",
                })
            },
        };
        const content = {
            items: [objects.howtouse.el.content, objects.numgrps.el.content, objects.n.el.content, objects.grpmeans.el.content, objects.power.el.content, 
					objects.sd.el.content, objects.siglevel.el.content,
					objects.plotopt.el.content, objects.plotcurve.el.content, objects.curvex.el.content, objects.curvegroup.el.content,
					objects.mainTitle.el.content, objects.xlab.el.content, objects.ylab.el.content, objects.legends.el.content
					],
            nav: {
                name: SampleSizeANOVANew.t('navigation'),
                icon: "icon-variance",
				datasetRequired: false,
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: SampleSizeANOVANew.t('help.title'),
            r_help: SampleSizeANOVANew.t('help.r_help'), //Fix by Anil //r_help: "help(data,package='utils')",
            body: SampleSizeANOVANew.t('help.body')
        }
;
    }


	// Helper: turns a comma-separated text field ("20, 40 ,60") into an
	// R vector literal string "c(20,40,60)". Empty input -> "NA" so the
	// computation knows to solve for that quantity.
	toRVector(rawText) {
		if (rawText === undefined || rawText === null || rawText.toString().trim() === "") {
			return "NA";
		}
		var parts = rawText.toString().split(",")
			.map(function (s) { return s.trim(); })
			.filter(function (s) { return s !== ""; });
		if (parts.length === 0) {
			return "NA";
		}
		if (parts.length === 1) {
			return parts[0];
		}
		return "c(" + parts.join(",") + ")";
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

		//convert every vectorizable field (which may now be a comma-separated
		//list) into an R vector literal. Empty fields become NA, signalling
		//which quantity is being solved for. Number of Groups and Group
		//Means are NOT vectorized (see header comment) so they are referenced
		//directly in the RCode template without going through toRVector().
		code_vars.selected.nvec        = this.toRVector(code_vars.selected.n);
		code_vars.selected.powervec    = this.toRVector(code_vars.selected.power);
		code_vars.selected.sdvec       = this.toRVector(code_vars.selected.sd);
		code_vars.selected.siglevelvec = this.toRVector(code_vars.selected.siglevel);

		// plotcurve checkbox -> R logical literal
		code_vars.selected.plotcurve = (code_vars.selected.plotcurve === "1" ||
			code_vars.selected.plotcurve === true ||
			code_vars.selected.plotcurve === "TRUE") ? "TRUE" : "FALSE";

		//final piece of code
            const cmd = instance.dialog.renderR(code_vars);
            res.push({ cmd: cmd, cgid: newCommandGroup(`${instance.config.id}`, `${instance.config.label}`), oriR: instance.config.RCode, code_vars: code_vars })
            return res;		
	}	
		
	
}

module.exports = {
    render: () => new SampleSizeANOVANew().render()
}

