// drop down menu
yearSelect = function(_parentElement, _data, _eventHandler ) {
    this.parentElement = _parentElement;
    this.data = _data;
    this.eventHandler =_eventHandler;
    this.label='All';

    // console.log(this.data);
    // Hacky way to stop it running twice
    if(this.data.length != 0 ){
        this.initVis();
    }

};

// initialize visualization (static content, e.g. SVG area or axes)
yearSelect.prototype.initVis = function() {
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
    vis.nest = d3.nest()
        .key(function(d) {
            return d.years;
        })
        .entries(vis.data);


    vis.nest.sort(function(a,b) {
        return d3.ascending(a.key, b.key)
    });

    // nest.unshift({key:'All'});




    vis.wrangleData(vis.label);

    // add listener for year selection
    var a = document.getElementById(this.parentElement).getElementsByClassName("year-select");
    for (var i = 0; i < a.length; i++) {
        a[i].addEventListener("pointerover", function(e) {
            // prevent default link behavior
            e.preventDefault();
            // update filter value
            $(vis.eventHandler).trigger("dateChange", d3.select(this).attr('key'));
        })
        a[i].addEventListener("pointerout", function(e) {
            // prevent default link behavior
            e.preventDefault();
            // update filter value
            $(vis.eventHandler).trigger("dateChange", "All");
        })
    }

};

yearSelect.prototype.wrangleData = function(select){

    var vis = this;
    vis.label = select;
    vis.updateVis()
};

yearSelect.prototype.updateVis = function() {
    var vis = this;
// Create a dropdown menu

    // Data Join
    vis.dropMenu = vis.svg.selectAll(".year-select")
        .data(vis.nest);
    // Data Update
    vis.dropMenu.enter().append("circle")
        .attr("class", "year-select")
        .attr("cy", function (d, i) {
            return vis.height / vis.nest.length * 0.5 + i * vis.height / vis.nest.length;
        })
        .attr("cx", vis.width * 0.3333)
        .attr("r", Math.min(vis.height * 0.4 / vis.nest.length, vis.width * 0.3333))
        .attr("key", function (d) {
            return d.key;
        })
        .merge(vis.dropMenu)
        .attr("fill", function(d){
            if(vis.label=='All'){
                return "#009fdf";
            }else{
                if(d.key == vis.label){
                    return "#009fdf";
                }else{
                    return "#343a40";
                }
            }
        });

    // Data Join
    vis.dropLabel = vis.svg.selectAll(".year-text")
        .data(vis.nest);
    //Dat Update
    vis.dropLabel
        .enter().append("text")
        .attr("class", "year-text")
        .text(function (d) {
            return d.key;
        })
        .attr("y", function (d, i) {
            return vis.height / vis.nest.length * 0.5 + i * vis.height / vis.nest.length;
        })
        .attr("x", vis.width*0.6)
        .attr("fill","#ffffff")
        .merge(vis.dropLabel)
        .attr("opacity",  function(d){
            if(vis.label=='All'){
                return 1;
            }else{
                if(d.key == vis.label){
                    return 1;
                }else{
                    return 0;
                }
            }
        });

    vis.dropMenu.exit().remove()
    vis.dropLabel.exit().remove()

};


yearSelect.prototype.updateColor = function(selection) {
    var vis = this;
    vis.wrangleData(selection);
};