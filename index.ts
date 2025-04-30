import Bun from "bun"
import { bold, italics, list, link, img, code, h1, h2, h3, quote, p } from "./elements.ts"
import { peas, replace_text_with_element, replace_text_with_list, replace_text_with_links } from "./test.ts"

const readFile = async (filepath: string): Promise<string | unknown> => {
	try {
		const file: Bun.BunFile = Bun.file(filepath);
		if (file.type === "text/markdown") {
			const content = await file.text();
			return content;
		}
		else throw Error(`${filepath}, not markdown`)
	}
	catch (err: unknown) {
		console.error("Error reading file", err)
		return err
	}
}


export const loop_text = (text: string): string => {
	//Some os uses \r some \n some \r\n
	//https://stackoverflow.com/questions/15433188/what-is-the-difference-between-r-n-r-and-n

	text = text.replaceAll("\r\n", "\n")
	text = text.replaceAll("\r", "\n")

	const raw_tags: Array<string> = []
	if (text.match("---") != null) {
		let split_tags = text.split("---");
		if (split_tags[1] != undefined && split_tags[2] != undefined) {
			raw_tags.push(split_tags[1]);
			text = split_tags[2]
		}
	}


	//let lines: Array<string> = text.split("\n")
	//console.log("length: ", lines.length)
	//If you need lines
	//lines.forEach((line, i) => {
	//If you need letters
	//for (let i = 0; i < line.length; i++) {
	//	let letter = line[i];
	//	console.log(letter);
	//}
	//	console.log(line)
	//})


	const bold_regex = /\*\*(.+?)\*\*/g
	text = replace_text_with_element(text, bold_regex, bold, "**")

	const italics_regex = /\*(.+?)\*/g
	text = replace_text_with_element(text, italics_regex, italics, "*")

	// you can use \r or \r\n instead of \n for other tests 
	const list_regex = /\*((.+)(\n)){1,}.+/g;
	text = replace_text_with_list(text, list_regex);

	const link_regex = /(!?)(\[.+\])(\(.+\))/g;
	text = replace_text_with_links(text, link_regex);
	//const matches = [...text.matchAll(link_regex)].map(m => { return { full: m[0], im: m[1] == "!" ? true : false, title: m[2], url: m[3] } });

	//const matches = [...text.matchAll(code_regex)].map(m => { return m[0] });
	//matches.forEach(match => console.log(match))
	const code_regex = /\`{3}([\s\S]*?)\`{3}/g;
	text = replace_text_with_element(text, code_regex, code, "```");

	//Doesnt get the lang detection like multiline
	const singleline_code_regex = /\`{1}(.+)\`{1}/g;
	text = replace_text_with_element(text, singleline_code_regex, code, "`");

	//const p_regex = /^\s*(\w.+)/g;
	//const p_regex = /^(?!\W)\S*\w.+/g
	//const p_regex = /^(?!\W)\S*\w.+|^>.*/g
	//const p_regex = /^\w.*\S/g
	//const p_regex = /<span.+>(.*\s){1,6}<\/span>/g
	// selects spans content(<span[^>]*>[\s\S]*?<\/span>)
	const h1_regex = /^#(.*)/gm;
	const h2_regex = /^##(.*)/gm;
	const h3_regex = /^###(.*)/gm;

	text = replace_text_with_element(text, h3_regex, h3, "###");
	text = replace_text_with_element(text, h2_regex, h2, "##");
	text = replace_text_with_element(text, h1_regex, h1, "#");

	const quote_regex = /^>(.*)/gm;
	text = replace_text_with_element(text, quote_regex, quote, ">")


	text = peas(text);
	console.log(text);
	return text
}

console.log("Hello via Bun!");
const my_args: any = Bun.argv.slice(2, Bun.argv.length);

//const files_text: Array<string> = []
for (let i = 0; i < my_args.length; i++) {
	let text: string | unknown = await readFile(my_args[i])
	if (typeof (text) == "string") {
		console.log(loop_text(text))
	}

}
