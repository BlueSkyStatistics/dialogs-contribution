/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */

/*
 * ---------------------------------------------------------------------------
 * CHANGE NOTES (this revision) - ported from SampleSizeTwoMeansNew.js /
 * SampleSizeTwoPropNew.js, using the same conventions.
 * ---------------------------------------------------------------------------
 * 1. Every numeric input (n, difference between means, power, sd,
 *    significance level) now accepts a comma-separated LIST of values. The
 *    R code builds an expand.grid() across every supplied value and runs
 *    power.t.test() once per combination, returning one results table.
 *
 * 2. Unlike epi.sscompc()/epi.sscohortc(), stats::power.t.test() requires
 *    the UNKNOWN quantity to be entirely OMITTED from the call (not passed
 *    as NA) - so each row dynamically builds its argument list, including
 *    n/delta/power only when that value is not NA for that row.
 *
 * 3. A "Generate Power Curve Plot" checkbox + X-Axis dropdown + multi-select
 *    Group/Color By comboBox, with the same Inf-row filter, "points only
 *    when x doesn't uniquely determine y" fallback, auto-grouping when
 *    Group/Color By is left at None but other fields still vary, and
 *    combined multi-field grouping - all identical in spirit to the Two
 *    Means / Two Proportions dialogs.
 *
 * 4. Chart Title / X Label / Y Label text inputs and a Legend Position
 *    dropdown (right/left/top/bottom/Do not show), plus
 *    {{selected.BSkyThemes | safe}} for the shared app-wide ggplot theme.
 * ---------------------------------------------------------------------------
 */

var localization = {
    en: {
        title: "Sample Size, Test One Mean or Paired Means New",
        navigation: "One Mean or Paired Means New",
		howtouse: "Specify two of sample size, difference between means, and power, and the third will be computed\n\nTIP: Any field below accepts a comma-separated list of values (e.g. 0.5,1,1.5). When more than one field has multiple values, every combination is computed and returned as a table, so you do not need to re-run this dialog for each scenario.",
		n: "Sample Size (comma-separated for multiple values)",
		delta: "Difference Between Means (comma-separated for multiple values)",
		power: "Power (0-1; comma-separated for multiple values)",
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
		curvedelta: "Difference Between Means",
		curvepower: "Power",
		curvesd: "Standard Deviation",
		curvesiglevel: "Significance Level",
		mainTitle: "Enter a chart title",
		xlab: "X axis label",
		ylab: "Y axis label",
		legends: "Show Legends and if so, position of Legends (default is right)",
        help: {
            title: "Sample Size, Test One Mean",
            r_help: "help(power.t.test, package ='stats')",
            body: `
This is an assessment of sample size for a one-sample t-test of a mean or a test of paired means.  It computes the sample size, difference between means, or the power, when the user 
specifies two of them.
<br/><br/>
<b>Sample Size:</b> Specify the number of subjects in the study. Comma-separated lists are accepted.
<br/><br/>
<b>Difference Between Means:</b> If a one-sample t-test, specify the difference between the mean under the alternative hypothesis and the mean under the null hypothesis.  If a
paired t-test, specify the difference between the paired means under the alternative hypothesis. Comma-separated lists are accepted.
<br/><br/>
<b>Power:</b> Specify the desired power of the study, i.e. the probability that the test will reject the null hypothesis if the alternative hypothesis was true. Comma-separated lists are accepted.
<br/><br/>
<b>Standard Deviation:</b> Specify an estimate of the standard deviation of the outcome measure.  For paired tests, this is the standard deviation of the paired differences. Comma-separated lists are accepted.
<br/><br/>
<b>Significance Level:</b> Specify the desired significance level (i.e. type I error) of the test. Comma-separated lists are accepted.
<br/><br/>
<b>Alternative Hypothesis:</b> Specify whether the test is two-sided or one-sided
<br/><br/>
<b>Generate Power Curve Plot:</b> When multiple values are supplied for more than one field, check this box to plot the results. Choose which computed quantity goes on the X-axis, and optionally one or more fields to group/color separate curves by.
<br/><br/>
<b>Required R Packages:</b> stats, broom, ggplot2
			`}
    }
}


class SampleSizeOneMeanNew extends baseModal {
    constructor() {
        var config = {
            id: "SampleSizeOneMeanNew",
            label: localization.en.title,
			splitProcessing: false,
            modalType: "one",
            RCode: `
library(broom)
library(ggplot2)

## ---- build value vectors from (possibly comma-separated) inputs ----------
n_vals        <- {{selected.nvec | safe}}

delta_vals    <- {{selected.deltavec | safe}}

power_vals    <- {{selected.powervec | safe}}

sd_vals       <- {{selected.sdvec | safe}}

siglevel_vals <- {{selected.siglevelvec | safe}}

## ---- every combination of supplied values (SAS-style "what-if" grid) -----
paramGrid <- expand.grid(
    n        = n_vals,
    delta    = delta_vals,
    power    = power_vals,
    sd       = sd_vals,
    siglevel = siglevel_vals,
    stringsAsFactors = FALSE
)

results <- do.call(rbind, lapply(seq_len(nrow(paramGrid)), function(i) {
    row <- paramGrid[i, ]
    res <- tryCatch({
        # power.t.test() requires the UNKNOWN quantity to be entirely
        # omitted from the call (not passed as NA) - so build the argument
        # list dynamically, including n/delta/power only when known.
        args <- list(sd = row$sd, sig.level = row$siglevel,
                     type = "one.sample", alternative = "{{selected.altgrp | safe}}")

        if (!is.na(row$n))     args$n     <- row$n
        if (!is.na(row$delta)) args$delta <- row$delta
        if (!is.na(row$power)) args$power <- row$power

        power_result <- do.call(power.t.test, args)
        pt <- as.data.frame(tidy(power_result))
        pt$sides <- "{{selected.altgrp | safe}}"

        pt
    }, error = function(e) {
        cat(sprintf(
            "Row %d failed (n=%s, delta=%s, power=%s, sd=%s, siglevel=%s): %s\\n",
            i, row$n, row$delta, row$power, row$sd, row$siglevel,
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

    # Which quantity was actually left blank for power.t.test() to solve.
    # Needed both to mask that column's NA as "" below, and to know which
    # result_* column is NOT a pure duplicate of an input column.
    solvedFor <- if (all(is.na(n_vals))) {
        "n"
    } else if (all(is.na(delta_vals))) {
        "delta"
    } else {
        "power"
    }

    # Build a display copy for the table: show "" instead of NA for whichever
    # of n / delta / power was left blank for power.t.test() to solve.
    resultsDisplay <- results
    resultsDisplay$n     <- ifelse(is.na(resultsDisplay$n),     "", as.character(resultsDisplay$n))
    resultsDisplay$delta <- ifelse(is.na(resultsDisplay$delta), "", as.character(resultsDisplay$delta))
    resultsDisplay$power <- ifelse(is.na(resultsDisplay$power), "", as.character(resultsDisplay$power))

    # Drop result_* columns that are guaranteed duplicates of columns already
    # shown above: result_sd / result_sig.level / result_sides always echo
    # known inputs unchanged, and whichever of result_n / result_delta /
    # result_power does NOT match solvedFor is also a guaranteed duplicate
    # of its input column. Only the one result_* column matching solvedFor
    # carries genuinely new information (the computed answer).
    dropCols <- c("result_sd", "result_sig.level", "result_sides")
    if (solvedFor != "n")     dropCols <- c(dropCols, "result_n")
    if (solvedFor != "delta") dropCols <- c(dropCols, "result_delta")
    if (solvedFor != "power") dropCols <- c(dropCols, "result_power")
    resultsDisplay <- resultsDisplay[, !(names(resultsDisplay) %in% dropCols), drop = FALSE]

    sidesLabel <- if ("{{selected.altgrp | safe}}" == "two.sided") "Two-Sided" else "One-Sided"

    row.names(resultsDisplay) <- NULL

    BSkyFormat(resultsDisplay, singleTableOutputHeader="Sample Size / Power Results (all combinations)",
               perTableFooter = paste("Alternative Hypothesis:", sidesLabel))

    ## ---- optional power curve ---------------------------------------------
    if ({{selected.plotcurve | safe}}) {

        # The dropdowns show short, user-friendly names; translate to the
        # actual internal column names used below.
        toColumn <- function(v) {
            switch(v, n = "n_eff", delta = "delta_eff", power = "power_eff", v)
        }
        toLabel <- function(v) {
            switch(v,
                n        = "Sample Size",
                delta    = "Difference Between Means",
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
                delta    = "Diff",
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

        # "n_eff" / "delta_eff" / "power_eff" fall back to the computed
        # result whenever the raw input was left blank (NA), avoiding an
        # all-NA plotting column.
        plotDat$n_eff     <- ifelse(is.na(plotDat$n),     plotDat$result_n,     plotDat$n)
        plotDat$delta_eff <- ifelse(is.na(plotDat$delta), plotDat$result_delta, plotDat$delta)
        plotDat$power_eff <- ifelse(is.na(plotDat$power), plotDat$result_power, plotDat$power)

        yvar <- switch(solvedFor,
            n     = "n_eff",
            delta = "delta_eff",
            power = "power_eff"
        )
        ylab <- switch(solvedFor,
            n     = "Required Sample Size",
            delta = "Detectable Difference Between Means",
            power = "Power"
        )

        if (xvar == yvar) {
            altChoices <- setdiff(c("n_eff", "power_eff", "delta_eff"), xvar)
            yvar <- altChoices[1]
            ylab <- switch(yvar,
                n_eff     = "Required Sample Size",
                power_eff = "Power",
                delta_eff = "Detectable Difference Between Means"
            )
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
            candidateRaw <- c("n", "delta", "power", "sd", "siglevel")
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
					label: localization.en.howtouse, 
					style: "mb-3", 
					h:8
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
					value: "",
					width:"w-50"
				})
			},
			delta: {
				el: new input(config, {
					no: 'delta',
					label: localization.en.delta,
					placeholder: "e.g. 0.5,1,1.5",
					extraction: "TextAsIs",
					type: "text",
					allow_spaces: true,
					value: "",
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
			sd: {
				el: new input(config, {
					no: 'sd',
					label: localization.en.sd,
					style: "mt-5",
					placeholder: "",
					extraction: "TextAsIs",
					type: "text",
					allow_spaces: true,
					required: true,
					value: "",
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
					value: "two.sided",
					state: "checked",
					extraction: "ValueAsIs"
				})
			}, 
			onesided: {
				el: new radioButton(config, {
					label: localization.en.onesided,
					no: "altgrp",
					increment: "onesided",
					value: "one.sided",
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
			curvex: {
				  el: new selectVar(config, {
					no: 'curvex',
					label: localization.en.curvex,
					extraction: "NoPrefix|UseComma",
					options: ["n", "delta", "power", "sd", "siglevel"],
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
					options: ["none", "n", "delta", "power", "sd", "siglevel"],
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
            items: [objects.howtouse.el.content, objects.n.el.content, objects.delta.el.content, objects.power.el.content, objects.sd.el.content, objects.siglevel.el.content,
					objects.alternativeopt.el.content, objects.twosided.el.content, objects.onesided.el.content,
					objects.plotopt.el.content, objects.plotcurve.el.content, objects.curvex.el.content, objects.curvegroup.el.content,
					objects.mainTitle.el.content, objects.xlab.el.content, objects.ylab.el.content, objects.legends.el.content
					],
            nav: {
                name: localization.en.navigation,
                icon: "icon-t1",
				datasetRequired: false,
                modal: config.id
            }
        };
        super(config, objects, content);
        this.help = localization.en.help;
    }


	// Helper: turns a comma-separated text field ("20, 40 ,60") into an
	// R vector literal string "c(20,40,60)". Empty input -> "NA" so that
	// power.t.test still knows to solve for that quantity.
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

		//convert every field (which may now be a comma-separated list) into
		//an R vector literal. Empty fields become NA, signalling to
		//power.t.test that this is the quantity being solved for.
		code_vars.selected.nvec        = this.toRVector(code_vars.selected.n);
		code_vars.selected.deltavec    = this.toRVector(code_vars.selected.delta);
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
module.exports.item = new SampleSizeOneMeanNew().render()
