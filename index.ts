import Bun from "bun"
import { bold, italics, code, h1, h2, h3, quote } from "./elements.ts"
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

	//WARNING: Extract to other function?
	const raw_tags: Array<string> = []
	if (text.match("---") != null) {
		let split_tags = text.split("---");
		if (split_tags[1] != undefined && split_tags[2] != undefined) {
			raw_tags.push(split_tags[1]);
			text = split_tags[2]
		}
	}

	const bold_regex = /\*\*(.+?)\*\*/g
	text = replace_text_with_element(text, bold_regex, bold, "**")

	const italics_regex = /\*(.+?)\*/g
	text = replace_text_with_element(text, italics_regex, italics, "*")

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
	text = replace_text_with_element(text, quote_regex, quote, ">")


	text = peas(text);
	return text
}

console.log("Hello via Bun!");

type args = { help: boolean, output_html: boolean, arguments_help: boolean, no_html_no_head: boolean };
const my_args: string[] = Bun.argv.slice(2, Bun.argv.length);
const arg_flags: args = {
	help: my_args.includes("-h") ? true : false,
	output_html: my_args.includes("-o") ? true : false,
	arguments_help: my_args.includes("-a") ? true : false,
	no_html_no_head: my_args.includes("-nh") ? true : false,
}

console.log(arg_flags);
console.log(my_args);

if (arg_flags.help == true) {
	//TODO:halp
	const help = "";
	console.log(help);
}
if (arg_flags.arguments_help == true) {
	const arguments_help =
		"- o(outputs HTML to a file)" +
		"- h(outputs help)" +
		"- a(outputs arguments)" +
		"- nh(outputs the conversions without html or head)";
	console.log(arguments_help);
}
if (arg_flags.no_html_no_head == true) {
	for (let i = 0; i < my_args.length; i++) {
		const curr_arg = my_args[i];
		if (curr_arg != undefined) {
			let text: string | unknown = await readFile(curr_arg)
			if (typeof (text) == "string") {
				console.log(loop_text(text))
			}
		}

	}
}
if (arg_flags.output_html == true) {
	const body = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="./styles/styles.css" />
    <link rel="icon" href="./literally_me.jpg" />
    <title></title>
  </head>
  <body id="body">
  </body>
</html>
`
	for (let i = 0; i < my_args.length; i++) {
		const curr_arg = my_args[i];
		if (curr_arg != undefined) {
			let text: string | unknown = await readFile(curr_arg)
			if (typeof (text) == "string") {
				const body_text = loop_text(text);
				//TODO:Writefile creates one with the same name but .html if no output is provided
				//Overwrites if one exist already
			}
		}

	}
}

//Working main chunk
//for (let i = 0; i < my_args.length; i++) {
//	const curr_arg = my_args[i];
//	if (curr_arg != undefined) {
//		let text: string | unknown = await readFile(curr_arg)
//		if (typeof (text) == "string") {
//			console.log(loop_text(text))
//		}
//	}
//
//}



//TODO:
//<!DOCTYPE html>
//<html lang="en">
//  <head>
//    <meta charset="UTF-8" />
//    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//    <link rel="stylesheet" type="text/css" href="./styles/styles.css" />
//    <link rel="icon" href="./literally_me.jpg" />
//    <title>Blogs</title>
//  </head>
//  <body id="body">
//  ACA VA EL CONTENIDO
//  </body>
//</html>
