(function () {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function (schemaCallback) {
        var cols = [{
            id: "date",
            alias: "date",
            dataType: tableau.dataTypeEnum.date
        }, {
            id: "country",
            alias: "country",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "state",
            alias: "state",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "district",
            alias: "district",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "confirmed",
            alias: "confirmed",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "recovered",
            alias: "recovered",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "deceased",
            alias: "deceased",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "tested",
            alias: "tested",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "vaccinated",
            alias: "vaccinated",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "population",
            alias: "population",
            dataType: tableau.dataTypeEnum.float
        }
        ];

        var tableSchema = {
            id: "COVID19_India_Data",
            alias: "Date wise and District wise Granularity of Data for COVID-19 Cases in India",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function (table, doneCallback) {
        $.getJSON("https://api.covid19india.org/v4/min/data-all.min.json", function (resp) {
            var feat = resp;
            tableData = [];

            // Iterate over the JSON object
            $.each(feat, function (dateKey, dateValue) {
                $.each(dateValue, function (stateKey, stateValue) {
                    if(stateValue.districts){
                        $.each(stateValue.districts, function (districtKey, districtValue) {
                      if (districtValue.delta){
                            tableData.push({
                            "date": dateKey,
                            "country": "India",
                            "state": stateKey,
                            "district" : districtKey,
                            "confirmed": districtValue.delta.confirmed || '',
                            "recovered": districtValue.delta.recovered || '',
                            "deceased": districtValue.delta.deceased || '',
                            "tested": districtValue.delta.tested || '',
                            "vaccinated": districtValue.delta.vaccinated || '',
                            "population":(districtValue.meta && districtValue.meta.population) || '',


                        });}
                    });
                } else if(stateValue.delta){
                        tableData.push({
                        "date": dateKey,
                        "country": "India",
                        "state": stateKey,
                        "district" : '',
                        "confirmed": stateValue.delta.confirmed || '',
                        "recovered": stateValue.delta.recovered || '',
                        "deceased": stateValue.delta.deceased || '',
                        "tested": stateValue.delta.tested || '',
                        "vaccinated": stateValue.delta.vaccinated || '',
                        "population":(stateValue.meta && stateValue.meta.population) || '',


                    });
                }
                })
                })

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function () {
        $("#submitButton").click(function () {
            tableau.connectionName = "COVID 19 India Dataset"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
