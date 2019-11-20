Network = function(_parentElement, _data) {
    this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = [];
    // this.filteredData = this.data.filter(d => d.years=="All")[0];

    console.log(this.data)

    this.initVis();
};

// initialize visualization (static content, e.g. SVG area or axes)
Network.prototype.initVis = function() {
    var vis = this;

    vis.margin = {top: 0, right: 0, bottom: 0, left: 0};

    vis.width = Math.min($("#" + this.parentElement).width() - vis.margin.left - vis.margin.right,800);
    vis.height = vis.width;
    vis.rad = 22;


    vis.svg = d3.select("#"+this.parentElement).append("svg")
        .attr("id","networksvg")
        .attr("viewBox", "0 0 " + vis.width + " " + vis.height )
        .attr("preserveAspectRatio", "xMidYMid meet");


    // // define the div for the tooltip
    // vis.div = d3.select("body").append("div")
    //     .attr("class", "tooltip")
    //     .style("opacity", 0);

    vis.wrangleData();
};

Network.prototype.wrangleData = function() {
    var vis = this;



    vis.updateVis();
};

// update sequence (enter, update, exit). Parameters needed only for certain updates
Network.prototype.updateVis = function() {
    var vis = this;



    // 1) INITIALIZE FORCE-LAYOUT
    vis.force = d3.forceSimulation(vis.data.nodes)
        .force("charge", d3.forceManyBody().strength(-30))
        .force("link", d3.forceLink(vis.data.links).distance(50))
        .force("center", d3.forceCenter().x(vis.width/2).y(vis.height/2))
        .force("collision",d3.forceCollide().radius(function(d) {
            return vis.rad+8;
        }))
        .alphaDecay(0.01);

    // 2a) DEFINE 'NODES' AND 'EDGES'


    vis.edges = vis.svg.selectAll(".edge")
        .data(vis.data.links)
        .enter().append("line")
        .style("stroke","#ccc")
        .style("stroke-width",4);

    vis.node = vis.svg.selectAll(".node")
        .data(vis.data.nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", vis.rad)
        .attr("fill",function(d){
            if(d.y2020 ){
                return "#FF0080"
            }else{
                return "#343a40"
            }
        });

    vis.label = vis.svg.selectAll(".nodelabel")
        .data(vis.data.nodes)
        .enter().append("text")
        .attr("class", "nodelabel")
        .text(function(d) { return d.name; })
        .attr("fill","#ffffff");

    // 2b) START RUNNING THE SIMULATION
    vis.force.on("tick", function() {

        // Update labels
        vis.label
            .attr("x", function(d) { return d.x; })
            .attr("y", function(d) { return d.y; });

        vis.node.attr("cx", function(d) { return d.x = Math.max(vis.rad, Math.min(vis.width - vis.rad, d.x)); })
            .attr("cy", function(d) { return d.y = Math.max(vis.rad, Math.min(vis.height - vis.rad, d.y)); });

        // Update edge coordinates
        vis.edges
            .attr("x1",function(d){return d.source.x;})
            .attr("y1",function(d){ return d.source.y;})
            .attr("x2",function(d){return d.target.x;})
            .attr("y2", function(d){ return d.target.y;})
    });

    // Dragging

    function dragStarted(d){
        if(!d3.event.active) vis.force.alphaTarget(0.3).restart();
        d.fx=d.x;
        d.fy=d.y;
    };

    function dragging(d){
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    };

    function dragEnded(d){
        if(!d3.event.active) vis.force.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    };

    vis.node.call(d3.drag()
        .on("start", dragStarted)
        .on("drag", dragging)
        .on("end", dragEnded));

    vis.label.call(d3.drag()
        .on("start", dragStarted)
        .on("drag", dragging)
        .on("end", dragEnded));

};


// filter original unfiltered data depending on selection from drop down menu
Network.prototype.onDateChange = function(selection) {
    var vis = this;

    vis.filteredData = this.data.filter(d => d.years==selection)[0];

    vis.wrangleData();
};


