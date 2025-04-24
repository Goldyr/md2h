import { bold, italics, list, link, img } from "./elements.ts"

const replace_text_with_element = (text: string, regex: RegExp, replacing_fun: Function, replacing_param: string): string => {
	//Array of results from every text.matchAll(regex)
	const matches = [...text.matchAll(regex)].map(m => m[1]);
	matches.forEach((match) => {
		if (match != undefined) {
			text = text.replace(replacing_param + match + replacing_param, replacing_fun(match));
		}
	})
	return text;
};

const replace_text_with_list = (text: string, regex: RegExp): string => {
	const matches = [...text.matchAll(regex)].map(m => m[0]);
	matches.forEach((match) => {
		let lines = match.split("\n");
		text = text.replace(match, list(lines));
	})
	return text;
};

const replace_text_with_links = (text: string, regex: RegExp): string => {
	const matches = [...text2.matchAll(link_regex)].map(m => {
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

let stupid_string = "``` \n" + "\n" + "js\n" + "var foo = 'bar';\n" + "\n" + "function baz(s) {\n" + "        return foo + ':' + s;\n" + "}\n" + "```"
let text = `And **bold**, *italics*, and even *italics and later **bold_again***. Even ~~strikethrough~~. [A link](https://markdowntohtml.com) to somewhere.`;
let text2 = `
# Sample Markdown

This is some basic, sample markdown.

## Second Heading

 * Unordered lists, and:
  1. One
  1. Two
  1. Three
 * More
 1. One more

> Blockquote

And **bold**, *italics*, and even *italics and later **bold***. Even ~~strikethrough~~. [A link](https://markdowntohtml.com) to somewhere.

And code highlighting:

${stupid_string}

Or inline code like ${`var foo = 'bar'; `}.

Or an image of bears

![bears](http://placebear.com/200/200)

	The end ...
`

text2 = text2.replaceAll("\r\n", "\n");
text2 = text2.replaceAll("\r", "\n");

const bold_regex = /\*\*(.+?)\*\*/g
text2 = replace_text_with_element(text2, bold_regex, bold, "**")

const italics_regex = /\*(.+?)\*/g
text2 = replace_text_with_element(text2, italics_regex, italics, "*")

// you can use \r or \r\n instead of \n for other tests 
const list_regex = /\*((.+)(\n)){1,}.+/g;
text2 = replace_text_with_list(text2, list_regex);


const link_regex = /(!?)(\[.+\])(\(.+\))/g;
text2 = replace_text_with_links(text2, link_regex);
//const matches = [...text2.matchAll(link_regex)].map(m => { return { full: m[0], im: m[1] == "!" ? true : false, title: m[2], url: m[3] } });
//console.log(matches)
console.log(text2);
