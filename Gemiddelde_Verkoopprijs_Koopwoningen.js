(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        // Schema for observation data and RegioSCodes	
		var observations_cols = [{
            id: "Id",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "Measure",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "ValueAttribute",
			alias: "Attribuut",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "Value",
			alias: "Gemiddelde verkoopprijs koopwoning",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "RegioS",
			alias: "Gemeente Id",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "Perioden",
			alias: "Jaar Code",
            dataType: tableau.dataTypeEnum.string
        }];

        var ObservationsTable = {
            id: "Observations",
			alias: "Gemiddelde verkoopprijs koopwoningen",
			columns: observations_cols
        };
		
		var RegioSCodes_cols = [{
            id: "Identifier",
			alias: "Gemeente Id",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "Index",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "Title",
			alias: "Gemeentes",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "Description",
			alias: "Omschrijving",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "DimensionGroupId",
			alias: "Provincie Id",
            dataType: tableau.dataTypeEnum.string
        }];

        var RegioSCodesTable = {
            id: "RegioCodes",
			alias: "Alle gemeentes",
			columns: RegioSCodes_cols
        };
		
		var RegioSGroups_cols = [{
            id: "Id",
			alias: "Provincie Id",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "Index",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "Title",
			alias: "Provincies",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "Description",
			alias: "Omschrijving",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "ParentId",
            dataType: tableau.dataTypeEnum.string
        }];

        var RegioSGroupsTable = {
            id: "RegioGroups",
			alias: "Alle provincies",
			columns: RegioSGroups_cols
        };
		
        schemaCallback([ObservationsTable, RegioSCodesTable, RegioSGroupsTable]);
		//schemaCallback([ObservationsTable]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
			
		if (table.tableInfo.id =="Observations") {
		
			$.getJSON("https://odata4.cbs.nl/CBS/83625NED/Observations?format=json", function(resp) {
				var feat = resp.value,
					tableData = [];

				// Iterate over the JSON object
				for (var i = 0, len = feat.length; i < len; i++) {
					tableData.push({
						"Id": feat[i].Id,
						"Measure": feat[i].Measure,
						"ValueAttribute": feat[i].ValueAttribute,
						"Value": feat[i].Value,
						"RegioS": feat[i].RegioS,
						"Perioden": feat[i].Perioden
					});
				}

				table.appendRows(tableData);
				doneCallback();
			});
		
		};
		
		if (table.tableInfo.id =="RegioCodes") {
		
			$.getJSON("https://odata4.cbs.nl/CBS/83625NED/RegioSCodes?format=json", function(resp) {
				var feat = resp.value,
					tableData = [];

				//Iterate over the JSON object
				for (var i = 0, len = feat.length; i < len; i++) {
					tableData.push({
						"Identifier": feat[i].Identifier,
						"Index": feat[i].Index,
						"Title": feat[i].Title,
						"Description": feat[i].Description,
						"DimensionGroupId": feat[i].DimensionGroupId
					});
				}

				table.appendRows(tableData);
				doneCallback();
			});
		
		};		
		
		if (table.tableInfo.id =="RegioGroups") {
		
			$.getJSON("https://odata4.cbs.nl/CBS/83625NED/RegioSGroups?format=json", function(resp) {
				var feat = resp.value,
					tableData = [];

				//Iterate over the JSON object
				for (var i = 0, len = feat.length; i < len; i++) {
					tableData.push({
						"Id": feat[i].Id,
						"Index": feat[i].Index,
						"Title": feat[i].Title,
						"ParentId": feat[i].ParentId
					});
				}

				table.appendRows(tableData);
				doneCallback();
			});
		
		};		


    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
	$(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "Gemiddelde verkoopprijs koopwoning"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
