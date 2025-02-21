import * as React from "react";
import { createRender, useModelState } from "@anywidget/react";
import * as altgosling from "altgosling";
import { validateGoslingSpec } from "gosling.js";


const render = createRender(() => {
	const [spec, setSpec] = useModelState<string>("spec");
	const [altSpec, setAltSpec] = useModelState<string>("altSpec");
	const [error, setError] = React.useState<string | null>(null);

	React.useEffect(() => {
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

	return (
		<div className="altgosling">
			{error ? <p>{error}</p> : <altgosling.AltGoslingComponent spec={JSON.parse(spec)} onAltGoslingSpecUpdate={(altSpec) => setAltSpec(JSON.stringify(altSpec))} />}
		</div>
	);
});

export default { render };
