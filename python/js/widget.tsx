import * as React from "react";
import { createRender, useModelState } from "@anywidget/react";
import * as altgosling from "altgosling";
import "./widget.css";


export const barChart = {
	"title": "Tonsil ChIP-seq in Th1 cells",
	"tracks": [
	  {
		"layout": "linear",
		"width": 800,
		"height": 180,
		"data": {
		  "url": "https://resgen.io/api/v1/tileset_info/?d=UvVPeLHuRDiYA3qwFlm7xQ",
		  "type": "multivec",
		  "row": "sample",
		  "column": "position",
		  "value": "peak",
		  "categories": ["sample 1"],
		  "binSize": 5
		},
		"mark": "bar",
		"x": {"field": "start", "type": "genomic", "axis": "bottom"},
		"xe": {"field": "end", "type": "genomic"},
		"y": {"field": "peak", "type": "quantitative", "axis": "right"},
		"size": {"value": 5}
	  }
	]
  }



const render = createRender(() => {

	console.log("component", altgosling.AltGoslingComponent);
	return (
		<div className="altgosling">
			{/* <h1>Hello</h1> */}
			{/* <altgosling.AltGoslingComponent /> */}
			<altgosling.AltGoslingComponent spec={barChart} />
		</div>
	);
});

export default { render };
