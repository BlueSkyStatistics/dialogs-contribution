const nav = [
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
					"./Analysis/TablesAdvanced",
					"./Analysis/TablesBasic"
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
