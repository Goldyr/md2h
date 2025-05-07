import { list, link, img, p } from "./elements.ts"

export const replace_text_with_element = (text: string, regex: RegExp, replacing_fun: Function, replacing_param: string): string => {
	//Array of results from every text.matchAll(regex)
	const matches = [...text.matchAll(regex)].map(m => m[1]);
	matches.forEach((match) => {
		//if (replacing_param[0] == "#") {
		//	matches.forEach(match => console.log("replacingparam=" + replacing_param, match))
		//}
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
		if (match.im === true) {
			text = text.replace(match.full, img(match.title as string, match.url as string))
		}
		else {
			text = text.replace(match.full, link(match.title as string, match.url as string))
		}
	})
	return text;
}

export const span_contents = (text: string): Array<string | undefined> => {
	const spans_content = /(<span[^>]*>[\s\S]*?<\/span>)/gm
	const matches = [...text.matchAll(spans_content)].map(m => m[1]);
	return matches;
}

//Couldnt negate the span_contents inside regex so I extract them and negate them in js
export const peas = (text: string): string => {
	//const regex = /(^\w.*\S)/gm;
	const regex = /^\s*(\w.*\S)/gm;
	//Array of results from every text.matchAll(regex);
	let matches = [...text.matchAll(regex)].map(m => m[1]);
	const span_matches = span_contents(text);
	const filtered_matches = matches.filter(match => {
		for (let i = 0; i < span_matches.length; i++) {
			const span = span_matches[i];
			if (span == undefined || match == undefined) {
				throw Error("err");
			}
			else if (span.includes(match)) {
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

export const tags = (text: unknown): { text: string, tags: Array<string | undefined> } => {
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
		return { text: text as string, tags: raw_tags }
	}
	return { text: "", tags: [] }
}

export default {}
