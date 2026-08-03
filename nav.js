const nav = [
    {
        "id": "menu-samplesize",
        "buttons": [
            {
                "id": "menu-samplesize-precision",
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
                "id": "menu-samplesize-tests",
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
            },
            {
                "id": "menu-samplesize-tests-multi-values",// {ns: 'menutoolbar'}),
                "icon": "icon-sigma",
                "children": [
                    "./SampleSize/SampleSizeANOVANew",
                    "./SampleSize/SampleSizeCorrelationNew",
					"./SampleSize/SampleSizeSurvivalCoxNew",
					"./SampleSize/SampleSizeOneMeanNew",
					"./SampleSize/SampleSizeOnePropNew",
                    "./SampleSize/SampleSizeSurvivalTwoGroupNew",
					"./SampleSize/SampleSizeTwoMeansNew",					
					"./SampleSize/SampleSizeTwoPairedPropNew",                    
					"./SampleSize/SampleSizeTwoPropNew"                    
                ]
            }
			
        ]
    },
    {
         "id": "menu-datasets",
         "buttons": [
             "./Datasets/CompareDatasets",
             "./Datasets/FindDuplicates",
             {
                 "id": "menu-datasets-subset",
                 "icon": "icon-funnel",
                 "children": [
                     "./Datasets/SubsetByPosition"
                    ]
             },        
         ]
     },
     {
         "id": "menu-analysis",
         "buttons":[
             {
                 "id": "menu-analysis-survival",
                 "icon": "icon-survival",
                 "children": [
                     "./Analysis/Survival/competingRisksOneGroup",
                     "./Analysis/Survival/KaplanMeierEstimationCompareGroups",
                     "./Analysis/Survival/KaplanMeierEstimationOneGroup"

                 ]
             },      
             {
                 "id": "menu-analysis-tables",
                 "icon": "icon-table_basic",
                 "children": [
                     "./Analysis/TableAdvanced",
                     "./Analysis/TableBasic"
                 ]
             },                   
         ]
     },
     {
         "id": "menu-variables",
         "buttons": [
             {
                 "id": "menu-variables-compute",
                 "icon": "icon-calculator",
                 "children": [
                     "./Variables/CumulativeStatisticVariable"
                     
                 ]
             },      

             {
                 "id": "menu-variables-factorlevels",
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
         "id": "menu-modelfitting",
         "buttons": [
           {
                 "id": "menu-modelfitting-regression",
                 "icon": "icon-linear_regression_white_comp",
                 "children": [
                     "./ModelFitting/Survival/CoxWithFormula",
                     "./ModelFitting/Survival/CoxSingleModel",
					 "./ModelFitting/Regression/CoxFirth",
					 "./ModelFitting/Regression/LogisticFirth"
                 ]
             },       
         ]
     },
     {
         "id": "menu-modelevaluation",
         "buttons": [
			 {
				"id": "menu-modelevaluation-ROC-Curves",
				"icon": "icon-icc",
				 "children": [
					 "./ModelEvaluation/CompareROCCurves"
				 ]			 
			 }
         ]
     }

]

module.exports.nav = nav
