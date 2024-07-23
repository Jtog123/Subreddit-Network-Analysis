function GraphPage( {graphs} ) {
    return (
        <div>
            <img src = {`http://localhost:5000/${graphs.bar_graph}`} alt="Bar Graph"/>
            <img src = {`http://localhost:5000/${graphs.heatmap}`} alt="heatmap"/>
            <img src = {`http://localhost:5000/${graphs.network_graph}`} alt="network graph"/>
        </div>
    )

}

export default GraphPage