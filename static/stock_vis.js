class StockVis {

    constructor(container_id,vis_data,show_mode){
        this.container_id = container_id;
        this.data = vis_data;
        console.log(this.data)
        //set default show mode
        this.show_mode = show_mode;

        this.height = 350;
        this.width = 350;
        this.margin = 70;
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
            .attr("transform", "translate(0,"+(this.height-this.margin)+")")
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
            yaxis: 'y',
            name: 'TICKER_NAME_' + this.data.name
        };

        let data_test = [trace];

        let layout = {
            dragmode: 'zoom',
            showlegend: true,
            title: 'TICKER_NAME_' + this.data.name + ' Price Chart',
            height: 350,
            width: 500,
            xaxis: {
                title: {
                    text: "Years"
                },
                autorange: true,
                automargin: true,
                rangeselector: {
                    x: 10,
                    y: 100,
                    activecolor: 'lime',
                    xanchor: "auto",
                    buttons: [{
                        step: 'month',
                        stepmode: 'backward',
                        count: 1,
                        label: '1M',
                    }, {
                        step: 'month',
                        stepmode: 'backward',
                        count: 3,
                        label: '3M',
                    }, {
                        step: 'year',
                        stepmode: 'backward',
                        count: 1,
                        label: '1Y',
                    }, {
                        step: 'all',
                        label: 'All',
                    }, {
                        step: 'year',
                        stepmode: 'todate',
                        count: 1,
                        label: "YTD",
                    }]
                }
            },
            yaxis: {
                autorange: true,
                automargin: true,
                title: {
                    text: "Price Per Share ($)"
                },
            }
        };

        Plotly.newPlot('stock_vis', data_test, layout);
    }

    renderRating() {
        d3.selectAll(".stock_chart-" +this.data.name).remove()
        let ratings_data = this.data.ticker_rating

        let data = {
            "Rating": {
                "0": "Buy",
                "1": "Hold",
                "2": "Sell"
            },
            "Percentage": {
                "0": ratings_data['Buy'],
                "1": ratings_data['Hold'],
                "2": ratings_data['Sell']
            }
        };

        let buy_value = parseInt(Object.values(data.Percentage)[0]);
        let hold_value = parseInt(Object.values(data.Percentage)[1]);
        let sell_value = parseInt(Object.values(data.Percentage)[2]);
        let hold_value_scale = buy_value + hold_value;

        let final_rate = "";
        let final_value ="";
        let final_color= "";
        if (buy_value > hold_value && buy_value > sell_value) {
            final_value = buy_value
            final_rate = "Buy"
            final_color = "green"
        } else if (sell_value > hold_value && sell_value > buy_value) {
            final_value = sell_value
            final_rate = "Sell"
            final_color = "red"
        } else {
            final_value = hold_value
            final_rate = "Hold"
            final_color = "yellow"
        }

        let data_test = [
            {
                value: final_value,
                number: {suffix: "% "+final_rate},
                title: { text: this.data.name +": Analyst Ratings" },
                type: "indicator",
                mode: "gauge+number",
                gauge: {
                    axis: {visible: true, range: [0,100], tickwidth: 3,
                        tickcolor: "green"
                    },
                    bar: {color: "transparent"},
                    bgcolor: "yellow",
                    steps: [
                        {range: [0, buy_value], color: "green"},
                        {range: [buy_value, hold_value_scale], color: "yellow"},
                        {range: [hold_value_scale, 100], color: "red"}
                    ],
                },
            }
        ];

        var layout = {
            width: 350,
            height: 350,
            margin: { t: 0, b: 0 },
        };

        Plotly.newPlot('stock_vis', data_test, layout);

    }

}
