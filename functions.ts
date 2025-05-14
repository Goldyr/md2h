import { list, link, img, p, bold, italics, code, h1, h2, h3, quote } from "./elements.ts"

export const replace_text_with_element = (text: string, regex: RegExp, replacing_fun: Function, replacing_param: string): string => {
	const matches = [...text.matchAll(regex)].map(m => m[1]);
	matches.forEach((match) => {
		if (match != undefined) {
			//One liners
			if (replacing_param[0] == "#" || replacing_param == ">") {
				text = text.replace(replacing_param + match, replacing_fun(match))
			}
			//Multiliners
			else {
				text = text.replace(replacing_param + match + replacing_param, replacing_fun(match));
			}
		}
	})
	return text;
};

export const replace_text_with_list = (text: string, regex: RegExp): string => {
	const matches = [...text.matchAll(regex)].map(m => m[0]);
	matches.forEach((match) => {
		let lines = match.split("\n");
		text = text.replace(match, list(lines));
	})
	return text;
};

export const replace_text_with_links = (text: string, regex: RegExp): string => {
	const matches = [...text.matchAll(regex)].map(m => {
		return {
			full: m[0],
			im: m[1] == "!" ? true : false,
			title: m[2],
			url: m[3]
		}
	});
	matches.forEach(match => {
		if (typeof match.title === 'string' && typeof match.url === 'string') {
			if (match.im === true) {
				text = text.replace(match.full, img(match.title, match.url))
			}
			else {
				text = text.replace(match.full, link(match.title, match.url))
			}
		}
	})
	return text;
}

export const span_contents = (text: string): Array<string | undefined> => {
	const spans_content = /(<span[^>]*>[\s\S]*?<\/span>)/gm
	const matches = [...text.matchAll(spans_content)].map(m => m[1]);
	return matches;
}

export const href_contents = (text: string): Array<string | undefined> => {
	const spans_content = /(<a[^>]*>[\s\S]*?<\/a>)/gm
	const matches = [...text.matchAll(spans_content)].map(m => m[1]);
	return matches;
}

//Couldnt negate the span_contents inside regex so I extract them and negate them in js
export const peas = (text: string): string => {
	const regex = /^\s*(\w.*\S)/gm;
	//Array of results from every text.matchAll(regex);
	let matches = [...text.matchAll(regex)].map(m => m[1]);
	const span_matches = span_contents(text);
	const href_matches = href_contents(text);

	//NOTE: I can probably put these two filters in the same lines, just fixing it rn
	let filtered_matches = matches.filter(match => {
		for (let i = 0; i < span_matches.length; i++) {
			const span = span_matches[i];
			if (span == undefined || match == undefined) {
				throw Error("functions.ts filtering span and hrefs out of text");
			}
			else if (span.includes(match)) {
				return false;
			}
		}
		return true
	})

	filtered_matches = matches.filter(match => {
		for (let i = 0; i < href_matches.length; i++) {
			const href = href_matches[i];
			if (match == undefined || href == undefined) {
				throw Error("functions.ts filtering span and hrefs out of text");
			}
			else if (href.includes(match)) {
				return false;
			}
		}
		return true
	})

	filtered_matches.forEach((match) => {
		if (match != undefined) {
			text = text.replace(match, p(match))
		}
	})
	return text;
}

export const tags = (text: unknown): { text: string, tags: Array<{ title: string, content: string }> } => {
	const info_tags: Array<{ title: string, content: string }> = []

	const raw_tags: Array<string> = []
	if (typeof (text) === 'string') {
		if (text.match("---") != null) {
			let split_bars = text.split("---");
			if (split_bars[1] != undefined && split_bars[2] != undefined) {
				let split_each_tag = split_bars[1].trimStart().split("\n");
				split_each_tag.forEach(tag => raw_tags.push(tag));
				text = split_bars[2].trimStart();
			}
		}

		raw_tags.forEach((tag: string) => {
			let splitted = tag.split(":");
			if (splitted[0] === "tags" && splitted[1] !== undefined) {
				let minitags = splitted[1].split(",");
				minitags.forEach((mt) => info_tags.push({
					title: "tags",
					content: mt.replace("[", "").replace("]", "").replaceAll(`"`, "").trim()
				}));
			}
			else if (splitted[1] !== undefined && splitted[0] !== undefined) {
				info_tags.push({
					title: splitted[0],
					content: splitted[1].trim()
				})
			}
		})
		return { text: text as string, tags: info_tags }
	}
	return { text: "", tags: [] }
}

export const readFile = async (filepath: string): Promise<string | undefined> => {
	try {
		const file: Bun.BunFile = Bun.file(filepath);
		if (file.type === "text/markdown") {
			const content = await file.text();
			return content;
		}
		else {
			console.log(`${filepath} is of type: ${file.type}. not markdown`);
			return undefined;
		}
	}
	catch (err: unknown) {
		console.log("Error reading file", err);
		return undefined;
	}
}


export const md_to_html = (text: string): string => {
	//Some os uses \r some \n some \r\n
	//https://stackoverflow.com/questions/15433188/what-is-the-difference-between-r-n-r-and-n

	text = text.replaceAll("\r\n", "\n");
	text = text.replaceAll("\r", "\n");

	const tags_text = tags(text);
	text = tags_text.text;

	const bold_regex = /\*\*(.+?)\*\*/g;
	text = replace_text_with_element(text, bold_regex, bold, "**");

	const italics_regex = /\*(.+?)\*/g;
	text = replace_text_with_element(text, italics_regex, italics, "*");

	const list_regex = /\*((.+)(\n)){1,}.+/g;
	text = replace_text_with_list(text, list_regex);

	const link_regex = /(!?)(\[.+\])(\(.+\))/g;
	text = replace_text_with_links(text, link_regex);

	const code_regex = /\`{3}([\s\S]*?)\`{3}/g;
	text = replace_text_with_element(text, code_regex, code, "```");

	const singleline_code_regex = /\`{1}(.+)\`{1}/g;
	text = replace_text_with_element(text, singleline_code_regex, code, "`");

	const h3_regex = /^###(.*)/gm;
	text = replace_text_with_element(text, h3_regex, h3, "###");

	const h2_regex = /^##(.*)/gm;
	text = replace_text_with_element(text, h2_regex, h2, "##");

	const h1_regex = /^#(.*)/gm;
	text = replace_text_with_element(text, h1_regex, h1, "#");

	const quote_regex = /^>(.*)/gm;
	text = replace_text_with_element(text, quote_regex, quote, ">");

	text = peas(text);
	return text;
};

export const cleanFilename = (full_path: string): string => {
	const splitted = full_path.split("/");
	let file_name = splitted[splitted.length - 1];
	if (file_name !== undefined) {
		file_name = file_name.slice(0, -3);
		return file_name;
	}
	return "default_name";
};


//true = help false = args
export const helper = (b: boolean) => {
	if (b === true) {
		console.log("md2h HELP\n" +
			"Check the README for conversion rules \n" +
			"ARGUMENTS: \n" +
			"-o(outputs HTML to /output)\n" +
			"-h(outputs help)\n" +
			"-a(outputs arguments)\n" +
			"-nh(outputs the conversions without html or head, this is what would go in the body)\n" +
			"EXAMPLES: \n" +
			"outputs the markdown converted to html: \n" +
			"bun run index.ts README.md \n" +
			"outputs the markdown converted to html to a file in ./output: \n" +
			"bun run index.ts README.md -o \n" +
			"outputs just the basic structure directly converted without header\n" +
			"bun run index.ts README.md -nh \n" +
			"outputs the html without header to a .html file in ./output\n" +
			"bun run index.ts README.md -nh -o \n");
	}
	else {
		console.log("ARGUMENTS:\n" +
			"-o(outputs HTML to /output)\n" +
			"-h(outputs help)\n" +
			"-a(outputs arguments)\n" +
			"-nh(outputs the conversions without html or head, this is what would go in the body)\n");
	}
}
export default {}
