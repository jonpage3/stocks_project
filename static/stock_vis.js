class StockVis {

    constructor(container_id,vis_data,show_mode){
        this.container_id = container_id;
        this.data = vis_data;

        //set default show mode
        this.show_mode = show_mode;

        this.height = 500;
        this.width = 500;
        this.margin = 100;
        //unsure of this block of code
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
        d3.selectAll(".plot-container").remove()
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

    renderOHLC () {
        d3.selectAll(".stock_chart-" +this.data.name).remove()
        let data = this.data
        //my code starts here
        //clean the data first
        let dh_data_object = data.High
        //console.log(dh_data_object)
        let dates = []
        let dh_values = []
        for (const [timestamp,dh] of Object.entries(dh_data_object)) {
            if (dh != null) {
                let date = new Date(+timestamp);
                dates.push(date);
                dh_values.push(dh);
            }}
        //console.log(dh_dates)
        //console.log(dh_values)
        let close_object = data.Close
        let close_values = []
        for (const [timestamp,val] of Object.entries(close_object)) {
            close_values.push(val)}
        //console.log(open_values)
        let open_object = data.Open
        let open_values = []
        for (const [timestamp,val] of Object.entries(open_object)) {
            open_values.push(val)}

        let low_object = data.Low
        let low_values = []
        for (const [timestamp,val] of Object.entries(low_object)) {
            low_values.push(val)}

        let trace = {
            x: dates,
            close: close_values,
            high: dh_values,
            low: low_values,
            open: open_values,

            // line colors
            increasing: {line: {color: 'green'}},
            decreasing: {line: {color: 'red'}},

            type: 'ohlc',
            xaxis: 'x',
            yaxis: 'y'
        };

        let data_test = [trace];

        let layout = {
            dragmode: 'zoom',
            showlegend: false,
            xaxis: {
                rangeslider: {
                    visible: true
                }
            }
        };

        Plotly.newPlot('stock_vis', data_test, layout);
    }

}
