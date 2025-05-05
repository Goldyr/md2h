import Bun from "bun"
import { bold, italics, code, h1, h2, h3, quote } from "./elements.ts"
import { peas, replace_text_with_element, replace_text_with_list, replace_text_with_links, tags } from "./test.ts"

const readFile = async (filepath: string): Promise<string | unknown> => {
	try {
		const file: Bun.BunFile = Bun.file(filepath);
		if (file.type === "text/markdown") {
			const content = await file.text();
			return content;
		}
		else throw Error(`${filepath}, not markdown`);
	}
	catch (err: unknown) {
		console.error("Error reading file", err);
		return err;
	}
}


export const md_to_html = (text: string): string => {
	//Some os uses \r some \n some \r\n
	//https://stackoverflow.com/questions/15433188/what-is-the-difference-between-r-n-r-and-n

	text = text.replaceAll("\r\n", "\n");
	text = text.replaceAll("\r", "\n");

	const tags_text = tags(text);
	text = tags_text.text;

	if (tags_text.tags.length > 0) {
		//TODO:TAGS	
	}

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

const cleanFilename = (full_path: string): string => {
	const splitted = full_path.split("/");
	console.log(splitted);
	let file_name = splitted[splitted.length - 1];
	console.log(file_name);
	if (file_name !== undefined) {
		file_name = file_name.slice(0, -3);
		return file_name;
	}
	return "default_name";
};

const wrapInsideBody = (body_text: string, tags: Array<string | undefined>): string => {
	let meta_tags = ""
	if (tags != undefined) {
		tags.forEach(tag => meta_tags += `<meta ${tag}/> \n`);
	}

	//DEFAULT
	//	return `<html lang="en">
	//  <head>
	//    <meta charset="UTF-8" />
	//    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
	//    <link rel="stylesheet" type="text/css" href="./styles/styles.css" />
	//    <link rel="icon" href="./literally_me.jpg" />
	//    <title>Blogs</title>
	//  </head>
	//  <body id="body">
	//${body_text}
	//  </body>
	//</html>
	//`;


	return `<html lang="en">
<head>
<meta charset="UTF-8" />
${meta_tags}
<meta name = "viewport" content = "width=device-width, initial-scale=1.0" />
<link rel="stylesheet" type = "text/css" href = "./styles/styles.css" />
<link rel="icon" href = "./literally_me.jpg" />
<title>Blogs </title>
</head>
< body id = "body" >
${body_text}
</body>
</html>`;

};

const main = async (): Promise<number> => {
	type args = { help: boolean, output_html: boolean, arguments_help: boolean, no_html_no_head: boolean };
	let my_args: string[] = Bun.argv.slice(2, Bun.argv.length);
	const arg_flags: args = {
		help: my_args.includes("-h") ? true : false,
		output_html: my_args.includes("-o") ? true : false,
		arguments_help: my_args.includes("-a") ? true : false,
		no_html_no_head: my_args.includes("-nh") ? true : false,
	};

	my_args = my_args.filter(arg => ["-h", "-o", "-a", "-nh"].includes(arg) ? false : true);

	console.log(my_args);

	const arguments_help =
		"ARGUMENTS:\n" +
		"-o(outputs HTML to /output)\n" +
		"-h(outputs help)\n" +
		"-a(outputs arguments)\n" +
		"-nh(outputs the conversions without html or head, this is what would go in the body)\n";
	const help = "md2h HELP\n" +
		"Check the README for conversion rules: \n" +
		arguments_help +
		"EXAMPLES: \n" +
		"outputs the markdown converted to html: \n" +
		"bun run index.ts README.md \n" +
		"outputs the markdown converted to html to a file in ./output: \n" +
		"bun run index.ts README.md -o \n" +
		"outputs just the basic structure directly converted without header\n" +
		"bun run index.ts README.md -nh \n" +
		"outputs just the basic structure directly converted without header to a .html file in ./output\n" +
		"bun run index.ts README.md -nh -o \n" +
		"examples: \n";
	if (arg_flags.help === true) {
		console.log(help);
		return 0;
	}
	if (arg_flags.arguments_help === true) {
		console.log(arguments_help);
		return 0;
	}
	if (arg_flags.output_html === true) {
		for (let i = 0; i < my_args.length; i++) {
			const curr_arg = my_args[i];
			if (curr_arg != undefined) {
				let text: string | unknown = await readFile(curr_arg)
				const tags_text = tags(text);
				text = tags_text.text;
				if (typeof (text) == "string") {
					//if (tags_text.tags.length > 0) {
					//	console.log("hay tags");
					//}
					//else {
					//	console.log("no hay tags");
					//}
					const body_text = md_to_html(text);
					let file_name = cleanFilename(curr_arg);
					let full_html = "";
					if (arg_flags.no_html_no_head === false) {
						full_html = wrapInsideBody(body_text, tags_text.tags);
					}
					else {
						full_html = body_text;
					}
					await Bun.write(`./ output / ${file_name}.html`, full_html);
				}
			}

		}
		return 0;
	}
	if (arg_flags.no_html_no_head === true) {
		for (let i = 0; i < my_args.length; i++) {
			const curr_arg = my_args[i];
			if (curr_arg != undefined) {
				let text: string | unknown = await readFile(curr_arg)
				if (typeof (text) == "string") {
					console.log(md_to_html(text))
				}
			}
		}
		return 0;
	}
	else {
		for (let i = 0; i < my_args.length; i++) {
			const curr_arg = my_args[i];
			if (curr_arg != undefined) {
				let text: string | unknown = await readFile(curr_arg)
				const tags_text = tags(text);
				text = tags_text.text;
				if (typeof (text) == "string") {
					const body_text = md_to_html(text);
					console.log(wrapInsideBody(body_text, tags_text.tags));
				}
			}

		}
		return 0;
	}
}

if (await main() !== 0) {
	console.log("something went wrong");
}
