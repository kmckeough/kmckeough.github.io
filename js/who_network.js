// Will be used to the save the loaded csv data
let networkData = [];
let timeInit = [];

d3.json("data/connections.json", function (error, importData) {



    networkData = importData;

        for(var column in importData.nodes[0]){
            if(column.slice(0,1)=="y"){
                timeInit.push({
                    years: column.slice(1,5)
                })
            } ;
        }


    create_network();


});

function create_network() {
    //  Create event handler
    var MyEventHandler2 = {};

    var network = new Network("network", networkData);

    var years2 = new yearSelect("dateselect1", timeInit, MyEventHandler2);


    // Bind event handler for dropdwon menu
    $(MyEventHandler2).bind("dateChange",function(event, selection){
        network.onDateChange(selection);
        years2.updateColor(selection);
    });

}
