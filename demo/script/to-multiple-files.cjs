const fs = require('fs');

const buffer = fs.readFileSync("./screenshots.txt");
const text = buffer.toString();

let name, alt, full, long;
text.split('\n').forEach((line, i) => {
	if (i % 14 == 0) {
		name = line;
	} else if (i % 14 == 4) {
		alt = line;
	} else if (i % 14 == 8) {
		full = line;
	} else if (i % 14 == 12) {
		long = line;
	} else if (i % 14 == 13) {
		fs.writeFileSync(`../screenshots/altgosling/alt/${name}.txt`, alt);
		fs.writeFileSync(`../screenshots/altgosling/full/${name}.txt`, full);
		fs.writeFileSync(`../screenshots/altgosling/long/${name}.txt`, long);
	}
});
