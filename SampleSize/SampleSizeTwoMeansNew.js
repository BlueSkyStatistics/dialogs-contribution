/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */

/*
 * ---------------------------------------------------------------------------
 * CHANGE NOTES (this revision)
 * ---------------------------------------------------------------------------
 * 1. Every numeric input (n, power, treatment mean, control mean, sd,
 *    significance level, ratio) now accepts a comma-separated LIST of values,
 *    e.g. "20,40,60,80". This mirrors how SAS PROC POWER lets you specify
 *    "ntotal = 20 to 100 by 20" or "power = .8 .9" and get every combination
 *    in one pass, instead of re-opening the dialog for each scenario.
 *
 * 2. The R code now builds an expand.grid() across all supplied values, runs
 *    epi.sscompc() once per combination, and returns one results table
 *    (rather than a single row). This is the "what-if grid" SAS users expect.
 *
 * 3. A new "Generate Power Curve Plot" checkbox + two dropdowns (X-axis
 *    variable, and an optional grouping/color variable) let the user get a
 *    ggplot2 power curve analogous to SAS PROC POWER's PLOT statement
 *    (plot x=n / plot x=effectsize, with curves= for overlays).
 *
 * NOTE FOR THE DEVELOPER APPLYING THIS PATCH:
 *  - The exact column names returned by epi.sscompc() (assumed here to be
 *    n, power, delta) should be checked against your installed epiR version
 *    and adjusted in the plotting block if they differ.
 *  - checkbox / dropdown widget class names below follow the same
 *    constructor pattern as the existing `input` / `radioButton` widgets in
 *    this file, but your framework's actual class names (e.g. `comboBox` vs
 *    `dropDownInput`) may differ slightly - please align with whatever your
 *    other dialogs use.
 * ---------------------------------------------------------------------------
 */

var localization = {
    en: {
        title: "Sample Size, Test Two Means New",
        navigation: "Two Means New",
		howtouse: "To compute sample size: specify both group means and power\nTo compute power: specify both group means and sample size\nTo compute detectable mean difference: specify sample size and power\n\nTIP: Any field below accepts a comma-separated list of values (e.g. 20,40,60,80). \nWhen more than one field has multiple values, \nevery combination is computed and returned as a table, \nso you do not need to re-run this dialog for each scenario.",
		n: "Sample Size (comma-separated for multiple values)",
		power: "Power (0-1; comma-separated for multiple values)",
		meangrp1: "Treatment Group Mean (comma-separated for multiple values)",
		meangrp2: "Control Group Mean (comma-separated for multiple values)",

		ratio: "Treatment vs Control Sample Size Ratio (comma-separated for multiple values)",
		sd: "Standard Deviation (comma-separated for multiple values)",
		siglevel: "Significance Level (0-1; comma-separated for multiple values)",
		alternativeopt: "Alternative Hypothesis",
		twosided: "Two-Sided",
		onesided: "One-Sided",
		plotopt: "Power Curve",
		plotcurve: "Generate Power Curve Plot",
		curvex: "X-Axis Variable",
		curvegroup: "Group / Color Lines By (optional)",
		curvenone: "None",
		curven: "Sample Size",
		curvepower: "Power",
		curvedelta: "Mean Difference",
		curvesd: "Standard Deviation",
		curveratio: "Sample Size Ratio",
		curvesiglevel: "Significance Level",
		mainTitle: "Enter a chart title",
		xlab: "X axis label",
		ylab: "Y axis label",
		legends: "Show Legends and if so, position of Legends (default is right)",
        help: {
            title: "Sample Size, Test Two Means",
            r_help: "help(epi.sscompc, package ='epiR')",
            body: `
This is an assessment of sample size for a two-sample t-test of means.  It computes the sample size, power, or mean difference (delta) when the user 
specifies the other two.
<br/><br/>
<b>Sample Size:</b> Specify the number of subjects in the study. You may enter a comma-separated list (e.g. 20,40,60) to evaluate several sample sizes at once.
<br/><br/>
<b>Power:</b> Specify the desired power of the study, i.e. the probability that the test will reject the null hypothesis if the alternative hypothesis was true. Comma-separated lists are accepted.
<br/><br/>
<b>Treatment Group Mean:</b> Specify the mean for the treatment group. Comma-separated lists are accepted.
<br/><br/>
<b>Control Group Mean:</b> Specify the mean for the control group. Comma-separated lists are accepted.
<br/><br/>
<b>Treatment vs Control Sample Size Ratio:</b> Specify the desired ratio of the sample sizes (treatment N divided by control N). A ratio of 1 means equal sample sizes. Comma-separated lists are accepted.
<br/><br/>
<b>Standard Deviation:</b> Estimate of the pooled standard deviation of the groups. Comma-separated lists are accepted.
<br/><br/>
<b>Significance Level:</b> Specify the desired significance level (i.e. type I error) of the test. Comma-separated lists are accepted.
<br/><br/>
<b>Alternative Hypothesis:</b> Specify whether the test is two-sided or one-sided
<br/><br/>
<b>Generate Power Curve Plot:</b> When multiple values are supplied for more than one field, check this box to plot the results (analogous to the PLOT statement in SAS PROC POWER). Choose which computed quantity goes on the X-axis, and optionally a second quantity to group/color separate curves by.
<br/><br/>
<b>Required R Packages:</b> epiR, ggplot2
			`}
    }
}


class SampleSizeTwoMeansNew extends baseModal {
    constructor() {
        var config = {
            id: "SampleSizeTwoMeansNew",
            label: localization.en.title,
			splitProcessing: false,
            modalType: "one",
            RCode: `
library(epiR)
library(ggplot2)

## ---- build value vectors from (possibly comma-separated) inputs ----------
n_vals        <- {{selected.nvec | safe}}


power_vals    <- {{selected.powervec | safe}}


treat_vals    <- {{selected.meangrp1vec | safe}}


control_vals  <- {{selected.meangrp2vec | safe}}


sd_vals       <- {{selected.sdvec | safe}}


siglevel_vals <- {{selected.siglevelvec | safe}}


ratio_vals    <- {{selected.ratiovec | safe}}


## ---- every combination of supplied values (SAS-style "what-if" grid) -----
paramGrid <- expand.grid(
    n        = n_vals,
    power    = power_vals,
    treat    = treat_vals,
    control  = control_vals,
    sd       = sd_vals,
    siglevel = siglevel_vals,
    ratio    = ratio_vals,
    stringsAsFactors = FALSE
)

results <- do.call(rbind, lapply(seq_len(nrow(paramGrid)), function(i) {
    row <- paramGrid[i, ]
    res <- tryCatch(
        epi.sscompc(
            treat        = row$treat,
            control      = row$control,
            n            = row$n,
            power        = row$power,
            sigma        = row$sd,
            r            = row$ratio,
            sided.test   = {{selected.altgrp | safe}},
            conf.level   = 1 - row$siglevel
        ),
        error = function(e) {
            # Surface the real reason this combination failed instead of
            # silently discarding it - this is what shows up in the console
            # so you can see WHY a row didn't compute.
            cat(sprintf(
                "Row %d failed (n=%s, power=%s, treat=%s, control=%s, sd=%s, ratio=%s, siglevel=%s): %s\n",
                i, row$n, row$power, row$treat, row$control, row$sd, row$ratio, row$siglevel,
                conditionMessage(e)
            ))
            NULL
        }
    )
    if (is.null(res)) return(NULL)
    resdf <- as.data.frame(res)
    names(resdf) <- paste0("result_", names(resdf))
    cbind(row, delta = row$treat - row$control, resdf)
}))

if (is.null(results) || nrow(results) == 0) {

    cat("No sample size / power results could be computed for the values supplied.\n",
        "See the row-level error messages above for details (e.g. an impossible\n",
        "combination of n, power, and effect size, or a value outside epi.sscompc()'s\n",
        "allowed range).\n")

} else {

    # Which quantity was actually left blank for epi.sscompc() to solve.
    # Needed both to mask that column's NA as "" below, and to know which
    # result_* column is NOT a pure duplicate of an input column.
    solvedFor <- if (all(is.na(n_vals))) {
        "n"
    } else if (all(is.na(power_vals))) {
        "power"
    } else {
        "delta"
    }

    # Build a display copy for the table: show "" instead of NA for whichever
    # of n / power was left blank for epi.sscompc() to solve (the numeric
    # "results" data frame itself is left untouched for the plotting logic
    # below, which still needs real NAs to detect what was solved for).
    resultsDisplay <- results
    resultsDisplay$n     <- ifelse(is.na(resultsDisplay$n),     "", as.character(resultsDisplay$n))
    resultsDisplay$power <- ifelse(is.na(resultsDisplay$power), "", as.character(resultsDisplay$power))

    # Drop result_* columns that are guaranteed duplicates of columns
    # already shown above: result_delta always echoes the already-shown
    # "delta" column (treat - control), and whichever of result_n.total /
    # result_power does NOT match solvedFor is a guaranteed duplicate of
    # its input column. result_n.treat / result_n.control are kept always,
    # since they carry the per-group breakdown that isn't shown anywhere
    # else.
    dropCols <- c("result_delta")
    if (solvedFor != "n")     dropCols <- c(dropCols, "result_n.total")
    if (solvedFor != "power") dropCols <- c(dropCols, "result_power")
    resultsDisplay <- resultsDisplay[, !(names(resultsDisplay) %in% dropCols), drop = FALSE]

    sidesLabel <- if ({{selected.altgrp | safe}} == 2) "Two-Sided" else "One-Sided"

    row.names(resultsDisplay) <- NULL

    BSkyFormat(resultsDisplay, singleTableOutputHeader="Sample Size / Power Results (all combinations)",
               perTableFooter = paste("Alternative Hypothesis:", sidesLabel))

    ## ---- optional power curve ---------------------------------------------
    if ({{selected.plotcurve | safe}}) {

        # The dropdowns show the short, user-friendly names "n" and "power",
        # but the actual plottable columns are "n_eff" / "power_eff" (which
        # fall back to the computed result whenever that field was left
        # blank to be solved for). Translate the user's selection here so
        # the rest of the code can keep working with the internal names.
        toColumn <- function(v) {
            switch(v, n = "n_eff", power = "power_eff", v)
        }
        toLabel <- function(v) {
            switch(v,
                n        = "Sample Size",
                power    = "Power",
                delta    = "Mean Difference",
                sd       = "Standard Deviation",
                ratio    = "Sample Size Ratio",
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
                delta    = "Diff",
                sd       = "SD",
                ratio    = "Ratio",
                siglevel = "SigLev",
                v
            )
        }

        xvarRaw   <- "{{selected.curvex | safe}}"
        groupsel  <- "{{selected.curvegroup | safe}}"
        xvar      <- toColumn(xvarRaw)

        plotDat <- results

        # "n" and "power" in plotDat are the RAW inputs - they are NA whenever
        # that quantity was left blank for epi.sscompc() to solve. Plotting or
        # grouping on an all-NA column breaks ggplot's scale computation.
        # Build "effective" versions that fall back to the computed result
        # whenever the input was blank.
        plotDat$n_eff     <- ifelse(is.na(plotDat$n),     plotDat$result_n.total, plotDat$n)
        plotDat$power_eff <- ifelse(is.na(plotDat$power), plotDat$result_power,  plotDat$power)

        yvar <- switch(solvedFor,
            n     = "n_eff",
            power = "power_eff",
            delta = "result_delta"
        )
        ylab <- switch(solvedFor,
            n     = "Required Total Sample Size",
            power = "Power",
            delta = "Detectable Mean Difference"
        )

        if (xvar == yvar) {
            yvar <- if (yvar == "n_eff") "power_eff" else "n_eff"
            ylab <- if (yvar == "power_eff") "Power" else "Required Total Sample Size"
        }

        # Drop rows where the y-axis quantity is non-finite (e.g. delta = 0,
        # i.e. treat = control, makes epi.sscompc() return Inf for n). A
        # single Inf blows up ggplot's automatic axis range and can make the
        # whole plot look blank, so these rows are excluded and reported.
        nBefore <- nrow(plotDat)
        plotDat <- plotDat[is.finite(plotDat[[yvar]]), ]
        nDropped <- nBefore - nrow(plotDat)
        if (nDropped > 0) {
            cat(sprintf(
                "%d row(s) excluded from the plot because %s was not finite ",
                nDropped, yvar
            ),
            "(most commonly: Treatment Mean = Control Mean gives an undefined,\n",
            "infinite required sample size).\n")
        }

        # The Group/Color By control allows MULTIPLE selections (e.g. sd AND
        # delta). Combine every selected field into one label per row
        # ("sd=2, delta=-4") so points that share ALL selected fields are
        # grouped/colored together, instead of only the first field.
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
        # each x value is uninformative - there is no way to tell what
        # distinguishes one dot in the stack from another. In that case,
        # auto-detect which candidate fields actually vary and color by
        # them automatically, the same way explicit grouping would.
        autoGrouped <- FALSE
        if (groupvar == "none" && nrow(plotDat) > 0) {
            candidateRaw <- c("n", "power", "delta", "sd", "ratio", "siglevel")
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
                    "to distinguish the points. Choose Group/Color By yourself for full control.\n")
            }
        }

        if (nrow(plotDat) == 0) {

            cat("No finite results remain to plot after filtering.\n")

        } else if (groupvar != "none") {
            # Some groups may contain only a single point (e.g. one row
            # happens to be the only one sharing that group's combination
            # of fields). geom_line() through a singleton group draws
            # nothing and warns "Each group consists of only one
            # observation" - so only draw lines for groups that actually
            # have more than one point, and always draw all points.
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
            # With no grouping and nothing else varying, a connecting line
            # only makes sense if each x value maps to exactly one y value.
            xHasMultipleY <- any(tapply(plotDat[[yvar]], plotDat[[xvar]],
                                          function(v) length(unique(v))) > 1)

            if (xHasMultipleY) {
                cat("Note: more than one result shares the same", toLabel(xvarRaw),
                    "value (other fields are still varying), so points are",
                    "shown without connecting lines. Select a Group/Color By",
                    "field to see them as separate curves.\n")
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
            # Use the user-supplied title/axis labels when provided;
            # otherwise fall back to the sensible computed defaults.
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
				//el: new preVar(config, {
				el: new labelVar(config, {
					no: "howtouse",
					label: localization.en.howtouse, 
					h: 6
				})
			},
			n: {
				el: new input(config, {
					no: 'n',
					label: localization.en.n,
					placeholder: "e.g. 20,40,60,80",
					extraction: "TextAsIs",
					type: "text",
					allow_spaces: true,
					width:"w-50"
				})
			},
			power: {
				el: new input(config, {
					no: 'power',
					label: localization.en.power,
					placeholder: "e.g. 0.8,0.9",
					extraction: "TextAsIs",
					type: "text",
					allow_spaces:true,
					value: "0.8",
					width:"w-50"
				})
			},			
			meangrp1: {
				el: new input(config, {
					no: 'meangrp1',
					label: localization.en.meangrp1,
					placeholder: "e.g. 10,12,14",
					extraction: "TextAsIs",
					type: "text",
					allow_spaces: true,
					value: "",
					width:"w-50"
				})
			},
			meangrp2: {
				el: new input(config, {
					no: 'meangrp2',
					label: localization.en.meangrp2,
					placeholder: "e.g. 9",
					extraction: "TextAsIs",
					type: "text",
					allow_spaces: true,
					value: "",
					width:"w-50"
				})
			},
			ratio: {
				el: new input(config, {
					no: 'ratio',
					label: localization.en.ratio,
					style: "mt-5",
					extraction: "TextAsIs",
					type: "text",
					allow_spaces: true,
					required: true,
					value: "1",
					width:"w-50"
				})
			},
			sd: {
				el: new input(config, {
					no: 'sd',
					label: localization.en.sd,
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
					label: localization.en.siglevel,
					placeholder: "0.05",
					extraction: "TextAsIs",
					type: "text",
					allow_spaces: true,
					required: true,
					value: "0.05",
					width:"w-50"
				})
			},
			alternativeopt: {
				el: new labelVar(config, {
					label: localization.en.alternativeopt, 
					style: "mt-5", 
					h:5
				})
			},
			twosided: {
				el: new radioButton(config, {
					label: localization.en.twosided,
					no: "altgrp",
					increment: "twosided",
					value: "2",
					state: "checked",
					extraction: "ValueAsIs"
				})
			}, 
			onesided: {
				el: new radioButton(config, {
					label: localization.en.onesided,
					no: "altgrp",
					increment: "onesided",
					value: "1",
					state: "",
					extraction: "ValueAsIs"
				})
			},
			plotopt: {
				el: new labelVar(config, {
					label: localization.en.plotopt,
					style: "mt-5",
					h:5
				})
			},
			plotcurve: {
				el: new checkbox(config, {
					no: 'plotcurve',
					label: localization.en.plotcurve,
					state: "",
					extraction: "TextAsIs"
				})
			},
			selectAPackage: {
                el: new selectVar(config, {
                    no: 'selectAPackage',
                    label: "Select A Package",
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["car", "ggplot2", "gplots", "psych"],
                    default: ""
                })
            },
			curvex: {
				  el: new selectVar(config, {
					no: 'curvex',
					label: localization.en.curvex,
					extraction: "NoPrefix|UseComma",
					options: ["n", "power", "delta", "sd", "ratio", "siglevel"],
					 default: "power",
					width:"w-50"
				})
			},
			curvegroup: {
				  el: new comboBox(config, {
					no: 'curvegroup',
					label: localization.en.curvegroup,
					multiple: true,
					extraction: "NoPrefix|UseComma",
					options: ["none", "n", "power", "delta", "sd", "ratio", "siglevel"],
					default: "none",
					width:"w-50"
				})
			},
			mainTitle: {
                el: new input(config, {
                    no: "mainTitle",
                    label: localization.en.mainTitle,
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
                    label: localization.en.xlab,
                    allow_spaces: true,
                    placeholder: "X Axis",
                    extraction: "NoPrefix|UseComma",
					value: ""
                })
            },
			ylab: {
                el: new input(config, {
                    no: 'ylab',
                    label: localization.en.ylab,
                    allow_spaces: true,
                    placeholder: "Y Axis",
                    extraction: "NoPrefix|UseComma",
					value: ""
                })
            },
			legends: {
                el: new selectVar(config, {
                    no: 'legends',
                    label: localization.en.legends,
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
            items: [objects.howtouse.el.content, objects.n.el.content, objects.power.el.content, objects.meangrp1.el.content, objects.meangrp2.el.content, 
					objects.ratio.el.content, objects.sd.el.content, objects.siglevel.el.content, objects.alternativeopt.el.content, objects.twosided.el.content, objects.onesided.el.content,
					objects.plotopt.el.content, objects.plotcurve.el.content, objects.curvex.el.content, objects.curvegroup.el.content,
					objects.mainTitle.el.content, objects.xlab.el.content, objects.ylab.el.content, objects.legends.el.content
					],
            nav: {
                name: localization.en.navigation,
                icon: "icon-t2",
				datasetRequired: false,
                modal: config.id
            }
        };
        super(config, objects, content);
        this.help = localization.en.help;
    }


	// Helper: turns a comma-separated text field ("20, 40 ,60") into an
	// R vector literal string "c(20,40,60)". Empty input -> "NA" so that
	// epi.sscompc still knows to solve for that quantity.
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
		
		//create several formats

		//convert every field (which may now be a comma-separated list) into
		//an R vector literal. Empty fields become NA, signalling to
		//epi.sscompc that this is the quantity being solved for.
		code_vars.selected.nvec        = this.toRVector(code_vars.selected.n);
		code_vars.selected.powervec    = this.toRVector(code_vars.selected.power);
		code_vars.selected.meangrp1vec = this.toRVector(code_vars.selected.meangrp1);
		code_vars.selected.meangrp2vec = this.toRVector(code_vars.selected.meangrp2);
		code_vars.selected.sdvec       = this.toRVector(code_vars.selected.sd);
		code_vars.selected.siglevelvec = this.toRVector(code_vars.selected.siglevel);
		code_vars.selected.ratiovec    = this.toRVector(code_vars.selected.ratio);

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
module.exports.item = new SampleSizeTwoMeansNew().render()