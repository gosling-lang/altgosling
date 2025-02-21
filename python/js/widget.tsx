import React, { useState, useEffect, useRef } from "react";
import { createRender, useModel, useModelState } from "@anywidget/react";
import * as altgosling from "altgosling";
import { validateGoslingSpec } from "gosling.js";


const render = createRender(() => {
	const [spec, setSpec] = useModelState<string>("spec");
	const [error, setError] = useState<string | null>(null);

	const model = useModel();

	useEffect(() => {
		try {
			const parsedSpec = JSON.parse(spec);

			const { state, message, details } = validateGoslingSpec(parsedSpec);
			if (state !== "success") {
				console.error(message, details);
				setError("Invalid Gosling Spec");
			} else {
				setError(null);
			}
		} catch (e) {
			console.error(e);
			setError("Invalid JSON");
		}
	}, [spec]);

	const handleAltSpecUpdate = (newAltSpec: object) => {
		model.set("altSpec", JSON.stringify(newAltSpec));
		model.save_changes();
	};

	return (
		<div className="altgosling">
			{error ? <p>{error}</p> : <altgosling.AltGoslingComponent spec={JSON.parse(spec)} onAltGoslingSpecUpdate={(handleAltSpecUpdate)} />}
		</div>
	);
});

export default { render };
