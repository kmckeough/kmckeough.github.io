

var format = d3.format(",d");

d3.select("#total")
    .transition()
    .duration(2500)
    .on("start", function repeat() {
        d3.active(this)
            .tween("text", function() {
                var that = d3.select(this),
                    i = d3.interpolateNumber(that.text().replace(/,/g, ""),32);
                return function(t) { that.text(format(i(t))); };
            })
            .transition()
            .delay(1500)
            .on("start", repeat);
    });