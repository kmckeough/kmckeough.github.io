

/*
 * StackedAreaChart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the
 */

StackedAreaChart = function(_parentElement, _data){

    this.parentElement = _parentElement;
    this.data = _data;

    // DEBUG RAW DATA
    console.log(this.data);

    this.initVis();
}



/*
 * Initialize visualization (static content, e.g. SVG area or axes)
 */

StackedAreaChart.prototype.initVis = function(){
    var vis = this;

    // vis.filter = "";

    vis.margin = { top: 40, right: 0, bottom: 60, left: 60 };

    vis.width = 800 - vis.margin.left - vis.margin.right,
        vis.height = 400 - vis.margin.top - vis.margin.bottom;


    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    // Overlay with path clipping
    vis.svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", vis.width)
        .attr("height", vis.height);


    // Scales and axes
    vis.x = d3.scaleTime()
        .range([0, vis.width])
        .domain(d3.extent(vis.data, function(d) { return d.years; }));

    vis.y = d3.scaleLinear()
        .range([vis.height, 0]);

    vis.xAxis = d3.axisBottom()
        .scale(vis.x);



    vis.svg.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(0," + vis.height + ")");

    vis.yAxis = d3.axisLeft()
        .tickSize(-vis.width)
        .scale(vis.y);

    vis.customYAxis=function(g) {
        g.call(vis.yAxis);
        g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "#777").attr("stroke-dasharray", "2,2");
        g.selectAll(".tick text").attr("x", -4).attr("dy", 0);
        g.select(".domain").remove();

    };

    vis.svg.append("g")
        .attr("class", "y-axis axis");

    // text label for the x axis
    vis.svg.append("text")
        .attr("class","axis-label")
        .attr("transform",
            "translate(" + (vis.width/2) + " ," +
            (vis.height + vis.margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .style("fill","#ccc")
        .text("Year");


    // text label for the y axis
    vis.svg.append("text")
        .attr("class","axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - vis.margin.left)
        .attr("x",0 - (vis.height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("fill","#ccc")
        .text("People");

    // Get data categories
    var dataCategories = colorScale.domain();

    // Initialize stack layout
    vis.stack = d3.stack()
        .keys(dataCategories);

    // Stack data
    vis.stackedData = vis.stack(vis.data);


    // Stacked area layout
    vis.area = d3.area()
        .curve(d3.curveNatural)
        .x(function(d)  { return vis.x(d.data.years); })
        .y0(function(d) { return vis.y(d[0]); })
        .y1(function(d) { return vis.y(d[1]); });

    // Basic area layout
    vis.basicArea = d3.area()
        .x(function(d) { return vis.x(d.data.years); })
        .y0(vis.height)
        .y1(function(d) { return vis.y(d[1]-d[0]); });


    // Tooltip placeholder
    // Define the div for the tooltip
    vis.div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);


    // (Filter, aggregate, modify data)
    vis.wrangleData();
}



/*
 * Data wrangling
 */

StackedAreaChart.prototype.wrangleData = function(){
    var vis = this;

    var dataCategories = colorScale.domain();

    // In the first step no data wrangling/filtering needed
    if(vis.filter) {

        var indexOfFilter = dataCategories.findIndex(function(d){return d == vis.filter});
        console.log("Applying filter " + vis.filter + " at " +indexOfFilter);
        vis.displayData = [vis.stackedData[indexOfFilter]];
    }
    else {
        vis.displayData = vis.stackedData;
    }


    // Update the visualization
    vis.updateVis();
}



/*
 * The drawing function - should use the D3 update sequence (enter, update, exit)
 * Function parameters only needed if different kinds of updates are needed
 */

StackedAreaChart.prototype.updateVis = function(){
    var vis = this;


    // Update domain
    vis.y.domain([0, d3.max(vis.displayData, function(d) {
        return d3.max(d, function(e) {
            if(vis.filter) {
                return e[1]-e[0];
            }
            else {
                return e[1];
            }
        });
    })
    ]);

    var dataCategories = colorScale.domain();

    // Draw the layers
    var categories = vis.svg.selectAll(".area")
        .data(vis.displayData);

    categories.enter().append("path")
        .attr("class", "area")
        .merge(categories)
        .style("fill", function(d,i) {
                return colorScale(dataCategories[i]);
        })
        .attr("d", function(d) {
            return vis.area(d);
        })

        //Tooltip
        .on("mouseover", function(d,i) {
            vis.div.transition()
                .duration(200)
                .style("opacity", .9);
            vis.div.html( dataCategories[i])
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            vis.div.transition()
                .duration(500)
                .style("opacity", 0);

        });

    // categories.enter().append("path")
    //     .attr("class", "area")
    //     .merge(categories)
    //     .style("fill", function(d,i) {
    //         if(vis.filter) {
    //             var indexOfFilter = dataCategories.findIndex(function(d){return d == vis.filter});
    //             return colorScale(dataCategories[indexOfFilter]);
    //         }
    //         else {
    //             return colorScale(dataCategories[i]);
    //         }
    //     })
    //     .attr("d", function(d) {
    //         if(vis.filter)
    //             return vis.basicArea(d);
    //         else
    //             return vis.area(d);
    //     })
    //
    //     // Update tooltip text
    //     .on("click", function(d,i) {
    //
    //         vis.filter = (vis.filter) ? "" : dataCategories[i];
    //         vis.wrangleData();
    //     })
    //     .on("mouseover", function(d,i) {
    //         if(vis.filter)
    //             vis.tooltip.text(excerpt(vis.filter, 100));
    //         else
    //             vis.tooltip.text(excerpt(dataCategories[i], 100));
    //     })
    //     .on("mouseout", function(d) {
    //         vis.tooltip.text("");
    //     });

    categories.exit().remove();


    // Call axis functions with the new domain
    vis.svg.select(".x-axis").call(vis.xAxis);
    vis.svg.select(".y-axis").call(vis.customYAxis);
}