/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */

/*
 * ---------------------------------------------------------------------------
 * CHANGE NOTES (this revision) - ported from SampleSizeTwoMeansNew.js
 * ---------------------------------------------------------------------------
 * 1. Every numeric input (n, power, group proportions, ratio, significance
 *    level) now accepts a comma-separated LIST of values. The R code builds
 *    an expand.grid() across every supplied value and runs epi.sscohortc()
 *    once per combination, returning one results table.
 *
 * 2. A "Generate Power Curve Plot" checkbox + X-Axis dropdown + multi-select
 *    Group/Color By comboBox let you plot the grid (ggplot2), same as the
 *    Two Means dialog - including the Inf-row filter, the "points only when
 *    x doesn't uniquely determine y" fallback, and combined multi-field
 *    grouping (e.g. group by BOTH ratio and Group 2 Proportion at once).
 *
 * 3. Chart Title / X Label / Y Label text inputs and a Legend Position
 *    dropdown (right/left/top/bottom/Do not show), matching the Pareto
 *    Chart dialog's convention, plus {{selected.BSkyThemes | safe}} for the
 *    shared app-wide ggplot theme.
 *
 * IMPORTANT - THIS NEEDS VERIFICATION AGAINST YOUR INSTALLED epiR VERSION:
 *  epi.sscohortc()'s return value is more irregular than epi.sscompc()'s.
 *  The ORIGINAL single-run dialog:
 *    - calls result <- epi.sscohortc(...), then unlist(result), then
 *      renames POSITIONS 2 and 3 (not names) to "n.group1"/"n.group2" -
 *      i.e. it assumes a fixed element order that this patch has no way to
 *      independently verify.
 *    - ONLY when Group 1 Proportion is left blank, it additionally derives
 *      odds ratios and bounded group-1 proportions from result$irr, which
 *      are TWO-VALUED (low/high), not a single number - unlike the Two
 *      Means dialog's "delta", this "solve for effect" case does not
 *      reduce to one clean y-axis quantity.
 *  This patch preserves that original per-call logic UNCHANGED (just looped
 *  over the grid), and for the plot, uses "result_irr" as the y-axis when
 *  solving for the group 1 proportion/effect - please confirm that column
 *  name actually exists in your unlist(result) output, and adjust if not.
 *  If you'd rather the plot show the derived group1 proportion bounds
 *  instead of the IRR, that needs custom handling since it's two numbers
 *  per row, not one.
 * ---------------------------------------------------------------------------
 */



class SampleSizeTwoPropNew extends baseModal {
    static dialogId = 'SampleSizeTwoPropNew'
    static t = baseModal.makeT(SampleSizeTwoPropNew.dialogId)

    constructor() {
        var config = {
            id: SampleSizeTwoPropNew.dialogId,
            label: SampleSizeTwoPropNew.t('title'),
			splitProcessing: false,
            modalType: "one",
            RCode: `
library(epiR)
library(ggplot2)

## ---- build value vectors from (possibly comma-separated) inputs ----------
n_vals        <- {{selected.nvec | safe}}

power_vals    <- {{selected.powervec | safe}}

prop1_vals    <- {{selected.propgrp1vec | safe}}

prop2_vals    <- {{selected.propgrp2vec | safe}}

siglevel_vals <- {{selected.siglevelvec | safe}}

ratio_vals    <- {{selected.ratiovec | safe}}


## ---- every combination of supplied values (SAS-style "what-if" grid) -----
paramGrid <- expand.grid(
    n        = n_vals,
    power    = power_vals,
    prop1    = prop1_vals,
    prop2    = prop2_vals,
    siglevel = siglevel_vals,
    ratio    = ratio_vals,
    stringsAsFactors = FALSE
)

results <- do.call(rbind, lapply(seq_len(nrow(paramGrid)), function(i) {
    row <- paramGrid[i, ]
    res <- tryCatch({
        r <- epi.sscohortc(
            irexp1     = row$prop1,
            irexp0     = row$prop2,
            n          = row$n,
            power      = row$power,
            r          = row$ratio,
            sided.test = {{selected.altgrp | safe}},
            conf.level = 1 - row$siglevel
        )
        pt <- unlist(r)
        # NOTE: this renames by POSITION, exactly as the original single-run
        # dialog did - verify positions 2 and 3 still correspond to the two
        # group sample sizes for your installed epiR version.
        if (length(pt) >= 3) names(pt)[c(2, 3)] <- c("n.group1", "n.group2")

        # Only when Group 1 Proportion was left blank: derive odds ratios
        # and bounded group-1 proportions, exactly as the original dialog
        # did (same formulas, just looped per grid row here).
        if (is.na(row$prop1)) {
            props <- r$irr * row$prop2
            oneminusprops <- 1 - props
            oddsratios <- (props / oneminusprops) / (row$prop2 / (1 - row$prop2))
            names(oddsratios) <- c("or.group1.low", "or.group1.high")
            names(props) <- c("group1_prop.low", "group1_prop.high")
            pt <- c(pt, oddsratios, props)
            if (length(pt) >= 6) names(pt)[c(5, 6)] <- c("irr.group1.low", "irr.group1.high")
        }
        pt
    }, error = function(e) {
        cat(sprintf(
            "Row %d failed (n=%s, power=%s, prop1=%s, prop2=%s, ratio=%s, siglevel=%s): %s\\n",
            i, row$n, row$power, row$prop1, row$prop2, row$ratio, row$siglevel,
            conditionMessage(e)
        ))
        NULL
    })
    if (is.null(res)) return(NULL)
    resdf <- as.data.frame(as.list(res))
    names(resdf) <- paste0("result_", names(resdf))
    cbind(row, resdf)
}))

if (is.null(results) || nrow(results) == 0) {

    cat("No sample size / power results could be computed for the values supplied.\\n",
        "See the row-level error messages above for details.\\n")

} else {

    # Which quantity was actually left blank for epi.sscohortc() to solve.
    # Needed both to mask that column's NA as "" below, and to know which
    # result_* column is NOT a pure duplicate of an input column.
    solvedFor <- if (all(is.na(n_vals))) {
        "n"
    } else if (all(is.na(power_vals))) {
        "power"
    } else {
        "prop1"
    }

    # Build a display copy for the table: show "" instead of NA for whichever
    # of n / power / prop1 was left blank for epi.sscohortc() to solve.
    resultsDisplay <- results
    resultsDisplay$n     <- ifelse(is.na(resultsDisplay$n),     "", as.character(resultsDisplay$n))
    resultsDisplay$power <- ifelse(is.na(resultsDisplay$power), "", as.character(resultsDisplay$power))
    resultsDisplay$prop1 <- ifelse(is.na(resultsDisplay$prop1), "", as.character(resultsDisplay$prop1))

    # Drop result_* columns that are guaranteed duplicates of columns
    # already shown above: whichever of result_n.total / result_power does
    # NOT match solvedFor is a guaranteed duplicate of its input column.
    # result_n.group1 / result_n.group2 (per-group breakdown), result_irr /
    # result_or (derived effect size), and the bonus bounds columns that
    # only appear when Group 1 Proportion was solved for, are always kept
    # since none of them duplicate anything already shown.
    dropCols <- c()
    if (solvedFor != "n")     dropCols <- c(dropCols, "result_n.total")
    if (solvedFor != "power") dropCols <- c(dropCols, "result_power")
    resultsDisplay <- resultsDisplay[, !(names(resultsDisplay) %in% dropCols), drop = FALSE]

    sidesLabel <- if ({{selected.altgrp | safe}} == 2) "Two-Sided" else "One-Sided"

    row.names(resultsDisplay) <- NULL

    BSkyFormat(resultsDisplay, singleTableOutputHeader="Sample Size / Power Results (all combinations)",
               perTableFooter = paste("Alternative Hypothesis:", sidesLabel))

    ## ---- optional power curve ---------------------------------------------
    if ({{selected.plotcurve | safe}}) {

        # The dropdowns show short, user-friendly names; translate to the
        # actual internal column names used below.
        toColumn <- function(v) {
            switch(v, n = "n_eff", power = "power_eff", prop1 = "prop1_eff", v)
        }
        toLabel <- function(v) {
            switch(v,
                n        = "Sample Size",
                power    = "Power",
                prop1    = "Group 1 Proportion",
                prop2    = "Group 2 Proportion",
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
                prop1    = "Prop1",
                prop2    = "Prop2",
                ratio    = "Ratio",
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
        if (all(c("result_n.group1", "result_n.group2") %in% names(plotDat))) {
            plotDat$result_ntotal <- plotDat$result_n.group1 + plotDat$result_n.group2
        } else {
            plotDat$result_ntotal <- NA
        }
        plotDat$n_eff     <- ifelse(is.na(plotDat$n),     plotDat$result_ntotal, plotDat$n)
        plotDat$power_eff <- ifelse(is.na(plotDat$power),
                                     if ("result_power" %in% names(plotDat)) plotDat$result_power else NA,
                                     plotDat$power)
        # "Group 1 Proportion" solved-for case: no single result column maps
        # cleanly to it (see the header note in this file) - result_irr is
        # used as a stand-in. VERIFY this column name against your epiR
        # output; adjust if the effect size is reported under another name.
        plotDat$prop1_eff <- ifelse(is.na(plotDat$prop1),
                                     if ("result_irr" %in% names(plotDat)) plotDat$result_irr else NA,
                                     plotDat$prop1)

        yvar <- switch(solvedFor,
            n     = "n_eff",
            power = "power_eff",
            prop1 = "prop1_eff"
        )
        ylab <- switch(solvedFor,
            n     = "Required Total Sample Size",
            power = "Power",
            prop1 = "Detectable Effect (IRR)"
        )

        if (xvar == yvar) {
            if (yvar == "n_eff") {
                yvar <- "power_eff"; ylab <- "Power"
            } else {
                yvar <- "n_eff"; ylab <- "Required Total Sample Size"
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
            candidateRaw <- c("n", "power", "prop1", "prop2", "ratio", "siglevel")
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
					no: "howtouse",
					label: SampleSizeTwoPropNew.t('howtouse'),
					h: 6
				})
			},
			n: {
				el: new input(config, {
					no: 'n',
					label: SampleSizeTwoPropNew.t('n'),
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
					label: SampleSizeTwoPropNew.t('power'),
					placeholder: "e.g. 0.8,0.9",
					extraction: "TextAsIs",
					type: "text",
					allow_spaces:true,
					value: "0.8",
					width:"w-50"
				})
			},
			propgrp1: {
				el: new input(config, {
					no: 'propgrp1',
					label: SampleSizeTwoPropNew.t('propgrp1'),
					placeholder: "e.g. 0.2,0.3,0.4",
					extraction: "TextAsIs",
					type: "text",
					allow_spaces: true,
					value: "",
					width:"w-50"
				})
			},
			propgrp2: {
				el: new input(config, {
					no: 'propgrp2',
					label: SampleSizeTwoPropNew.t('propgrp2'),
					placeholder: "e.g. 0.1",
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
					label: SampleSizeTwoPropNew.t('ratio'),
					style: "mt-5",
					extraction: "TextAsIs",
					type: "text",
					allow_spaces: true,
					required: true,
					value: "1",
					width:"w-50"
				})
			},
			siglevel: {
				el: new input(config, {
					no: 'siglevel',
					label: SampleSizeTwoPropNew.t('siglevel'),
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
					label: SampleSizeTwoPropNew.t('alternativeopt'), 
					style: "mt-5", 
					h:5
				})
			},
			twosided: {
				el: new radioButton(config, {
					label: SampleSizeTwoPropNew.t('twosided'),
					no: "altgrp",
					increment: "twosided",
					value: "2",
					state: "checked",
					extraction: "ValueAsIs"
				})
			}, 
			onesided: {
				el: new radioButton(config, {
					label: SampleSizeTwoPropNew.t('onesided'),
					no: "altgrp",
					increment: "onesided",
					value: "1",
					state: "",
					extraction: "ValueAsIs"
				})
			},
			plotopt: {
				el: new labelVar(config, {
					label: SampleSizeTwoPropNew.t('plotopt'),
					style: "mt-5",
					h:5
				})
			},
			plotcurve: {
				el: new checkbox(config, {
					no: 'plotcurve',
					label: SampleSizeTwoPropNew.t('plotcurve'),
					state: "",
					extraction: "TextAsIs"
				})
			},
			curvex: {
				  el: new selectVar(config, {
					no: 'curvex',
					label: SampleSizeTwoPropNew.t('curvex'),
					extraction: "NoPrefix|UseComma",
					options: ["n", "power", "prop1", "prop2", "ratio", "siglevel"],
					 default: "power",
					width:"w-50"
				})
			},
			curvegroup: {
				  el: new comboBox(config, {
					no: 'curvegroup',
					label: SampleSizeTwoPropNew.t('curvegroup'),
					multiple: true,
					extraction: "NoPrefix|UseComma",
					options: ["none", "n", "power", "prop1", "prop2", "ratio", "siglevel"],
					default: "none",
					width:"w-50"
				})
			},
			mainTitle: {
                el: new input(config, {
                    no: "mainTitle",
                    label: SampleSizeTwoPropNew.t('mainTitle'),
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
                    label: SampleSizeTwoPropNew.t('xlab'),
                    allow_spaces: true,
                    placeholder: "X Axis",
                    extraction: "NoPrefix|UseComma",
					value: ""
                })
            },
			ylab: {
                el: new input(config, {
                    no: 'ylab',
                    label: SampleSizeTwoPropNew.t('ylab'),
                    allow_spaces: true,
                    placeholder: "Y Axis",
                    extraction: "NoPrefix|UseComma",
					value: ""
                })
            },
			legends: {
                el: new selectVar(config, {
                    no: 'legends',
                    label: SampleSizeTwoPropNew.t('legends'),
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
            items: [objects.howtouse.el.content, objects.n.el.content, objects.power.el.content, objects.propgrp1.el.content, objects.propgrp2.el.content, 
					objects.ratio.el.content, objects.siglevel.el.content, objects.alternativeopt.el.content, objects.twosided.el.content, objects.onesided.el.content,
					objects.plotopt.el.content, objects.plotcurve.el.content, objects.curvex.el.content, objects.curvegroup.el.content,
					objects.mainTitle.el.content, objects.xlab.el.content, objects.ylab.el.content, objects.legends.el.content
					],
            nav: {
                name: SampleSizeTwoPropNew.t('navigation'),
                icon: "icon-p2",
				datasetRequired: false,
                modal: config.id
            }
        };
        super(config, objects, content);
        
        this.help = {
            title: SampleSizeTwoPropNew.t('help.title'),
            r_help: SampleSizeTwoPropNew.t('help.r_help'), //Fix by Anil //r_help: "help(data,package='utils')",
            body: SampleSizeTwoPropNew.t('help.body')
        }
;
    }


	// Helper: turns a comma-separated text field ("20, 40 ,60") into an
	// R vector literal string "c(20,40,60)". Empty input -> "NA" so that
	// epi.sscohortc still knows to solve for that quantity.
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
		//epi.sscohortc that this is the quantity being solved for.
		code_vars.selected.nvec        = this.toRVector(code_vars.selected.n);
		code_vars.selected.powervec    = this.toRVector(code_vars.selected.power);
		code_vars.selected.propgrp1vec = this.toRVector(code_vars.selected.propgrp1);
		code_vars.selected.propgrp2vec = this.toRVector(code_vars.selected.propgrp2);
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

module.exports = {
    render: () => new SampleSizeTwoPropNew().render()
}

