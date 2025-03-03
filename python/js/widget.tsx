import React, { useState, useEffect } from "react";
import { createRender, useModel, useModelState } from "@anywidget/react";
import * as altgosling from "altgosling";
import { validateGoslingSpec } from "gosling.js";


const render = createRender(() => {
	const [spec, setSpec] = useModelState<string>("spec");
	const [parsedSpec, setParsedSpec] = useState<object | null>(null);
	const [error, setError] = useState<string | null>(null);

	const model = useModel();

	useEffect(() => {
		try {
			const parsedSpec = JSON.parse(spec);
			setParsedSpec(parsedSpec); 

			const { state, message, details } = validateGoslingSpec(parsedSpec);
			if (state !== "success") {
				console.error(message, details);
				setError("Invalid Gosling Spec");
				setParsedSpec(null);
			} else {
				setError(null);
			}
		} catch (e) {
			console.error(e);
			setError("Invalid JSON");
			setParsedSpec(null);
		}
	}, [spec]);

	const handleAltSpecUpdate = (newAltSpec: object) => {
		model.set("altSpec", JSON.stringify(newAltSpec));
		model.save_changes();
	};

	return (
		<div className="altgosling">
			{!parsedSpec || error ? <p>{error}</p> : <altgosling.AltGoslingComponent spec={parsedSpec} onAltGoslingSpecUpdate={handleAltSpecUpdate} />}
		</div>
	);
});

export default { render };
