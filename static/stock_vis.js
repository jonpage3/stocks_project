class StockVis {

    constructor(container_id,vis_data){
        this.container_id = container_id;
        this.data = vis_data;

        this.height = 500;
        this.width = 500;
        this.margin = 40;


        this.svg = d3.select("#"+container_id)
            .append("svg")
            .attr("width", this.width)
            .attr("height", this.height);
    }

    render () {
        let thisvis = this
        let name = this.data.name;
        //clean the data first
        let dh_data_object = this.data.High
        console.log(dh_data_object)
        let dh_dates = []
        let dh_values = []
        for (const [timestamp,dh] of Object.entries(dh_data_object)) {
            if (dh != null) {
                let date = new Date(+timestamp);
                dh_dates.push(date);
                dh_values.push(dh);
            }
        }
        let dh_data = d3.zip(dh_dates,dh_values)
        //console.log(rsi_data)

        // Create scales for x and y axis.
        let dataXrange = d3.extent(dh_dates,function(d) {return d;})
        console.log(dataXrange)
        thisvis.x = d3.scaleTime()
            .domain(dataXrange)
            .range([this.margin,this.width-this.margin]);
        let dataYrange = d3.extent(dh_values,function(d) {return d;})
        console.log(dataYrange)
        thisvis.y = d3.scaleLinear()
            .domain(dataYrange.reverse())
            .range([this.margin,this.height-this.margin]);

        //this.x.ticks(d3.timeMonth);

        // Add x axis
        this.svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0,"+(500-this.margin)+")")
            .call(d3.axisBottom(this.x).ticks(d3.timeYear));


        // Now the Y axis and label.
        this.svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate("+this.margin+",0)")
            .call(d3.axisLeft(this.y));

        //now draw the line
        const valueline = d3
            .line()
            .x(function(d) {return thisvis.x(d[0]); })
            .y(function(d) { return thisvis.y(d[1]); })
            .curve(d3.curveCardinal);

        this.svg.append("path")
            .data([dh_data])
            .attr("class", "line")
            .attr("d",valueline);

        this.svg.append("text")
            .attr("x", (this.width / 2))
            .attr("y", this.margin)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text(name + ": Daily High");

    }
}
