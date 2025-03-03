/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */

const nav = [
    {
        "name": "Sample Size",
        "tab": "sample_size",
        "buttons": [
            {
                "name": "Precision",
                "icon": "icon-confidence_interval",
                "children": [
                    "./SampleSize/PrecisionAUC",
					"./SampleSize/PrecisionKappa",
                    "./SampleSize/PrecisionCorrelation",
					"./SampleSize/PrecisionMeanDiff",
                    "./SampleSize/PrecisionICC",
                    "./SampleSize/PrecisionOneMean",
                    "./SampleSize/PrecisionOneProp",
                    "./SampleSize/PrecisionOR",
                    "./SampleSize/PrecisionRiskDiff",
                    "./SampleSize/PrecisionRiskRatio"
                ]
            },
            {
                "name": "Tests",
                "icon": "icon-sigma",
                "children": [
                    "./SampleSize/SampleSizeANOVA",
                    "./SampleSize/SampleSizeCorrelation",
					"./SampleSize/SampleSizeSurvivalCox",
					"./SampleSize/SampleSizeOneMean",
					"./SampleSize/SampleSizeOneProp",
                    "./SampleSize/SampleSizeSurvivalTwoGroup",
					"./SampleSize/SampleSizeTwoMeans",					
					"./SampleSize/SampleSizeTwoPairedProp",                    
					"./SampleSize/SampleSizeTwoProp"                    
                ]
            }        
        ]
    },
    {
		"name": "Datasets",
		"tab": "Datasets",
		"buttons": [
			"./Datasets/CompareDatasets",
			"./Datasets/FindDuplicates",
			{
				"name": "Subset",
				"icon": "icon-funnel",
				"children": [
					"./Datasets/SubsetByPosition"
				   ]
			},        
		]
	},
	{
		"name": "Analysis",
		"tab": "analysis",    
		"buttons":[
			{
				"name": "Survival",
				"icon": "icon-survival",
				"children": [
					"./Analysis/Survival/competingRisksOneGroup",
					"./Analysis/Survival/KaplanMeierEstimationCompareGroups",
					"./Analysis/Survival/KaplanMeierEstimationOneGroup"

				]
			}, 	
			{
				"name": "Tables",
				"icon": "icon-table_basic",
				"children": [
					"./Analysis/TableAdvanced",
					"./Analysis/TableBasic"
				]
			},                   
		]
	},
	{
		"name": "Variables",
		"tab": "Variables",
		"buttons": [
			{
				"name": "Compute",
				"icon": "icon-calculator",
				"children": [
					"./Variables/CumulativeStatisticVariable"
					
				]
			},      

			{
				"name": "Factor Levels",
				"icon": "icon-shapes",
				"children": [
					"./Variables/FactorLevelManualReorder"

				]
			},      
			"./Variables/idvar",    
			"./Variables/lagorlead"
		
		]
	},
	{
		"name": "Model Fitting",
		"tab": "model_fitting",
		"buttons": [
		  {
				"name": "Regression",
				"icon": "icon-linear_regression_white_comp",
				"children": [
					"./ModelFitting/Survival/CoxWithFormula",
					"./ModelFitting/Survival/CoxSingleModel"
				]
			},       
		]
	},
	{
		"name": "Model Evaluation",
		"tab": "model_statistics",
		"buttons": [
					"./ModelEvaluation/CompareROCCurves"
		]
	}

]

module.exports.nav = nav
