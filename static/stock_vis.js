class StockVis {

    constructor(svg_id,data){
        this.svg_id = svg_id;
        this.data = data;
    }

    render() {

        let name = this.data.name
        //none of this works yet
        let svg = d3.select(this.svg_id);
        let stock_mark = svg.selectAll(".stock").data(this.data)
        stock_mark.enter().append("rect")
            .attr("height",100)
            .attr("width",100)
            .style("fill","#ADD8E6")
        stock_mark.append("text")
            .text(name)

        //this works which proves the files are all connected
        console.log(name+ ": the files are talking with each other")

    }
}