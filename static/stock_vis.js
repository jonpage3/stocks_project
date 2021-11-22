class StockVis {

    constructor(container_id,vis_data,show_mode){
        this.container_id = container_id;
        this.data = vis_data;

        //set default show mode
        this.show_mode = show_mode;

        this.height = 500;
        this.width = 500;
        this.margin = 40;


        this.stock_data_object = this.data[this.show_mode]

        this.stock_dates = []
        this.stock_values = []
        for (const [timestamp,val] of Object.entries(this.stock_data_object)) {
            if (val != null) {
                let date = new Date(+timestamp);
                this.stock_dates.push(date);
                this.stock_values.push(val);
            }}

        this.stock_data = d3.zip(this.stock_dates,this.stock_values)

        this.dataXrange = d3.extent(this.stock_dates,function(d) {return d;})
        this.dataYrange = d3.extent(this.stock_values,function(d) {return d;})
        /*
        this.svg = d3.select("#"+ container_id)
            .append("svg")
            //.attr("class","stock_chart-" + this.data.name)
            .attr("width", this.width)
            .attr("height", this.height);

        this.svg.x = d3.scaleTime()
            .domain(this.dataXrange)
            .range([this.margin,this.width-this.margin]);

        this.svg.y = d3.scaleLinear()
            .domain(this.dataYrange.reverse())
            .range([this.margin,this.height-this.margin]);
        */
    }

    setShowMode(new_mode) {
        this.show_mode = new_mode;
        //let chart = d3.selectAll("svg").attr("class","stock_chart-" +this.data.name)
        //chart.remove()
        this.render();
    }

    render () {

        //this is removing all svg--we need an improvement
        //d3.selectAll("svg > *").remove();
        d3.selectAll(".stock_chart-" +this.data.name).remove()
        /*let chart = this.svg.append("g")
            .attr("class","stock_chart-" +this.data.name)
        */
        this.svg = d3.select("#"+ this.container_id)
            .append("svg")
            .attr("class","stock_chart-" + this.data.name)
            .attr("width", this.width)
            .attr("height", this.height);

        this.svg.x = d3.scaleTime()
            .domain(this.dataXrange)
            .range([this.margin,this.width-this.margin]);

        this.svg.y = d3.scaleLinear()
            .domain(this.dataYrange.reverse())
            .range([this.margin,this.height-this.margin]);

        let thisvis = this
        let name = this.data.name



        let stock_data_object = thisvis.data[this.show_mode]


        if (this.show_mode === 'MACD'){
            stock_data_object = thisvis.data.ma5
        }


        let stock_dates = []
        let stock_values = []
        for (const [timestamp,val] of Object.entries(stock_data_object)) {
            if (val != null) {
                let date = new Date(+timestamp);
                stock_dates.push(date);
                stock_values.push(val);
            }}
        let stock_data = d3.zip(stock_dates,stock_values)



        let dataYrange = d3.extent(stock_values,function(d) {return d;})
        let xx = d3.scaleTime()
            .domain(this.dataXrange)
            .range([this.margin,this.width-this.margin]);

        let yy = d3.scaleLinear()
            .domain(dataYrange.reverse())
            .range([this.margin,this.height-this.margin]);



        this.svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0,"+(500-this.margin)+")")
            .call(d3.axisBottom(this.svg.x));

        this.svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate("+this.margin+",0)")
            .call(d3.axisLeft(yy))

        const valueline = d3
            .line()
            .x(function(d) {return xx(d[0]); })
            .y(function(d) { return yy(d[1]); })
            .curve(d3.curveCardinal);


        if (this.show_mode !== 'ma5'){
            this.svg.append("path")
                .data([stock_data])
                .attr("class", "line")
                .attr("d",valueline)
                .attr("stroke", "darkseagreen");
            this.svg.append("text")
                .attr("x", (this.width / 2))
                .attr("y", this.margin)
                .attr("text-anchor", "middle")
                .style("font-size", "16px")
                .text(name + ": " + this.show_mode);

        }else{

            this.svg.append("path")
                .data([stock_data])
                .attr("class", "line")
                .attr("d",valueline)
                .attr("stroke", "darkseagreen");


            let stock_data_object2 = thisvis.data.ma30


            let stock_dates2 = []
            let stock_values2 = []
            for (const [timestamp,val] of Object.entries(stock_data_object2)) {
                if (val != null) {
                    let date = new Date(+timestamp);
                    stock_dates2.push(date);
                    stock_values2.push(val);
                }}
            let stock_data2 = d3.zip(stock_dates2,stock_values2)


            const valueline2 = d3
                .line()
                .x(function(d) {return xx(d[0]); })
                .y(function(d) { return yy(d[1]); })
                .curve(d3.curveCardinal);

            this.svg.append("path")
                .data([stock_data2])
                .attr("class", "line")
                .attr("d",valueline2)
                .attr("stroke", "purple");

            this.svg.append("text")
                .attr("x", (this.width / 2))
                .attr("y", this.margin)
                .attr("text-anchor", "middle")
                .style("font-size", "16px")
                .text(name + ": " + 'MACD');


        }
    }
}
