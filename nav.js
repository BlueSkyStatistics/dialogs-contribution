/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */

//const {getT} = global.requireFromRoot("localization");
let t = getT('menutoolbar')
const nav = () => ([
    {
        "name": t('contribution_Sample_Size_Menu'),// {ns: 'menutoolbar'}),
        "tab": "sample_size",
        "buttons": [
            {
                "name": t('contribution_Precision'),// {ns: 'menutoolbar'}),
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
                "name": t('contribution_Tests'),// {ns: 'menutoolbar'}),
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
		"name": t('contribution_Datasets_Menu'),// {ns: 'menutoolbar'}),
		"tab": "Datasets",
		"buttons": [
			"./Datasets/CompareDatasets",
			"./Datasets/FindDuplicates",
			{
				"name": t('contribution_Subset'),// {ns: 'menutoolbar'}),
				"icon": "icon-funnel",
				"children": [
					"./Datasets/SubsetByPosition"
				   ]
			},        
		]
	},
	{
		"name": t('contribution_Analysis_Menu'),// {ns: 'menutoolbar'}),
		"tab": "analysis",    
		"buttons":[
			{
				"name": t('contribution_Survival'),// {ns: 'menutoolbar'}),
				"icon": "icon-survival",
				"children": [
					"./Analysis/Survival/competingRisksOneGroup",
					"./Analysis/Survival/KaplanMeierEstimationCompareGroups",
					"./Analysis/Survival/KaplanMeierEstimationOneGroup"

				]
			}, 	
			{
				"name": t('contribution_Tables'),// {ns: 'menutoolbar'}),
				"icon": "icon-table_basic",
				"children": [
					"./Analysis/TableAdvanced",
					"./Analysis/TableBasic"
				]
			},                   
		]
	},
	{
		"name": t('contribution_Variables_Menu'),// {ns: 'menutoolbar'}),
		"tab": "Variables",
		"buttons": [
			{
				"name": t('contribution_Compute'),// {ns: 'menutoolbar'}),
				"icon": "icon-calculator",
				"children": [
					"./Variables/CumulativeStatisticVariable"
					
				]
			},      

			{
				"name": t('contribution_Factor_Levels'),// {ns: 'menutoolbar'}),
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
		"name": t('contribution_Model_Fitting_Menu'),// {ns: 'menutoolbar'}),
		"tab": "model_fitting",
		"buttons": [
		  {
				"name": t('contribution_Regression'),// {ns: 'menutoolbar'}),
				"icon": "icon-linear_regression_white_comp",
				"children": [
					"./ModelFitting/Survival/CoxWithFormula",
					"./ModelFitting/Survival/CoxSingleModel"
				]
			},       
		]
	},
	{
		"name": t('contribution_Model_Evaluation_Menu'),// {ns: 'menutoolbar'}),
		"tab": "model_tuning",
		"buttons": [
					"./ModelEvaluation/CompareROCCurves"
		]
	}

])

module.exports = {
    nav: nav(),
    render: () => nav()
}
