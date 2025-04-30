import { bold, italics, list, link, img, code, h1, h2, h3, quote, p } from "./elements.ts"

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
	//console.log("matches", matches.length)
	//console.log("matches left", filtered_matches.length);

	filtered_matches.forEach((match) => {
		if (match != undefined) {
			text = text.replace(match, p(match))
		}
	})
	return text;
}

//let stupid_string = "```js\n" + "var foo = 'bar';\n" + "\n" + "function baz(s) {\n" + "        return foo + ':' + s;\n" + "}\n" + "```"
//let stupid_string2 = "```rust\n" + "var foo = 'bar';\n" + "\n" + "function baz(s) {\n" + "        return foo + ':' + s;\n" + "}\n" + "```"
//let stupid_string3 = "```" + "var foo = 'bar';\n" + "\n" + "function baz(s) {\n" + "        return foo + ':' + s;\n" + "}\n" + "```"
//let text = `And **bold**, *italics*, and even *italics and later **bold_again***. Even ~~strikethrough~~. [A link](https://markdowntohtml.com) to somewhere.`;
//let text2 = `
//# Sample Markdown
//
//This is some basic, sample markdown.
//
//## Second Heading
//
// * Unordered lists, and:
//  1. One
//  1. Two
//  1. Three
// * More
// 1. One more
//
//> Blockquote
//
//And **bold**, *italics*, and even *italics and later **bold***. Even ~~strikethrough~~. [A link](https://markdowntohtml.com) to somewhere.
//
//And code highlighting:
//
//${stupid_string}
//
//${stupid_string2}
//
//${stupid_string3}
//
//Or inline code like ${"`var foo = 'bar'; `"}.
//
//Or an image of bears
//
//![bears](http://placebear.com/200/200)
//
//	The end ...
//
//### Just kidding lol
//`
//
//text2 = text2.replaceAll("\r\n", "\n");
//text2 = text2.replaceAll("\r", "\n");
//
//const bold_regex = /\*\*(.+?)\*\*/g
//text2 = replace_text_with_element(text2, bold_regex, bold, "**")
//
//const italics_regex = /\*(.+?)\*/g
//text2 = replace_text_with_element(text2, italics_regex, italics, "*")
//
//// you can use \r or \r\n instead of \n for other tests 
//const list_regex = /\*((.+)(\n)){1,}.+/g;
//text2 = replace_text_with_list(text2, list_regex);
//
//const link_regex = /(!?)(\[.+\])(\(.+\))/g;
//text2 = replace_text_with_links(text2, link_regex);
////const matches = [...text2.matchAll(link_regex)].map(m => { return { full: m[0], im: m[1] == "!" ? true : false, title: m[2], url: m[3] } });
//
////const matches = [...text2.matchAll(code_regex)].map(m => { return m[0] });
////matches.forEach(match => console.log(match))
//const code_regex = /\`{3}([\s\S]*?)\`{3}/g;
//text2 = replace_text_with_element(text2, code_regex, code, "```");
//
////Doesnt get the lang detection like multiline
//const singleline_code_regex = /\`{1}(.+)\`{1}/g;
//text2 = replace_text_with_element(text2, singleline_code_regex, code, "`");
//
////const p_regex = /^\s*(\w.+)/g;
////const p_regex = /^(?!\W)\S*\w.+/g
////const p_regex = /^(?!\W)\S*\w.+|^>.*/g
////const p_regex = /^\w.*\S/g
////const p_regex = /<span.+>(.*\s){1,6}<\/span>/g
//// selects spans content(<span[^>]*>[\s\S]*?<\/span>)
//const h1_regex = /^#(.*)/gm;
//const h2_regex = /^##(.*)/gm;
//const h3_regex = /^###(.*)/gm;
//
//text2 = replace_text_with_element(text2, h3_regex, h3, "###");
//text2 = replace_text_with_element(text2, h2_regex, h2, "##");
//text2 = replace_text_with_element(text2, h1_regex, h1, "#");
//
//const quote_regex = /^>(.*)/gm;
//text2 = replace_text_with_element(text2, quote_regex, quote, ">")
//
//
//text2 = peas(text2);
//console.log(text2);

export default {}
