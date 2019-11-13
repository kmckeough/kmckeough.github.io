// drop down menu
yearSelect = function(_parentElement, _data, _eventHandler ) {
    this.parentElement = _parentElement;
    this.data = _data;
    this.eventHandler =_eventHandler;

    console.log(this.data);
    // Hacky way to stop it running twice
    if(this.data.length != 0 ){
        this.createMenu();
    }

};

// initialize visualization (static content, e.g. SVG area or axes)
yearSelect.prototype.createMenu = function() {
    var vis = this;
    vis.margin = {top: 60, right: 0, bottom: 30, left: 0};

    vis.width = $("#" + "dateselect2").width()*0.75 - vis.margin.left - vis.margin.right;
    vis.height = 400


    // Initialize svg

    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    // nest data by category
    var nest = d3.nest()
        .key(function(d) {
            return d.years;
        })
        .entries(vis.data);

    nest.sort(function(a,b) {
        return d3.ascending(a.key, b.key)
    });

    // nest.unshift({key:'All'});

    // Create a dropdown menu
    vis.dropMenu = vis.svg.selectAll(".year-select")
        .data(nest)
        .enter().append("circle")
        .attr("class", "year-select")
        .attr("cy",function(d,i){
            return  vis.height/nest.length*0.5 + i*vis.height/nest.length;
        })
        .attr("cx",vis.width*0.5)
        .attr("r",vis.height*0.4/nest.length)
        .attr("fill","#009fdf")
        .attr("key",function(d){
            return d.key;
        });
        // .on("mouseover", yearMouseOver)
        // .on("mouseout", yearMouseOut);

    vis.dropLabel = vis.svg.selectAll(".year-text")
        .data(nest)
        .enter().append("text")
        .attr("class", "year-text")
        .text(function(d) { return d.key; })
        .attr("fill", "#ffffff")
        .attr("y",function(d,i){
            return  vis.height/nest.length*0.5 + i*vis.height/nest.length;
        })
        .attr("x",vis.width*0.5);


    // add listener for year selection
    var a = document.getElementById(this.parentElement).getElementsByClassName("year-select");
    for (var i = 0; i < a.length; i++) {
        a[i].addEventListener("pointerover", function(e) {
            // prevent default link behavior
            e.preventDefault();
            // update filter value
            $(vis.eventHandler).trigger("dateChange", d3.select(this).attr('key'));
        })
    }
};


//
// Create Event Handlers for mouse
// function yearMouseOver(d, i) {  // Add interactivity
//
//     // Use D3 to select element, change color and size
//     d3.select(this).attr({
//         fill: "#343a40"
//     });
//
//
// }
//
// function yearMouseOut(d, i) {
//     // Use D3 to select element, change color back to normal
//     d3.select(this).attr({
//         fill: "#009fdf"
//     });
//
// }

