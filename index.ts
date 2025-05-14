import Bun from "bun"
import { tags, helper, readFile, cleanFilename, md_to_html } from "./functions.ts"

//to edit the header
const wrapInsideBody = (body_text: string, tags: Array<{ title: string, content: string }>): string => {
	let meta_tags = "";

	//Typical meta tags
	meta_tags += `<meta charset="UTF-8">\n`;
	meta_tags += `<meta name="viewport" content="width=device-width, initial-scale=1.0">\n`;
	meta_tags += `<link rel="stylesheet" type="text/css" href="./styles.css">\n`;
	meta_tags += `<link rel="icon" href="./icon.jpg">\n`;

	if (tags !== undefined) {
		tags.forEach(tag => {
			if (tag.title === "title" && tag !== undefined) {
				meta_tags += ("<title>" + tag.content + "</title>\n");
			}
			else if (tag.title !== "" && tag !== undefined) {
				meta_tags += ("<meta " + `name = "${tag.title}" content = "${tag.content}"` + ">").replace("\r", "") + "\n";
			}
		});
	}

	if (!meta_tags.includes(`<title>`)) {
		const default_title = "DEFAULT TITLE";
		meta_tags += ("<title>" + default_title + "</title>\n");
	}

	return `<!DOCTYPE html>
<html lang="en">
<head>
${meta_tags}</head>
<body id="body">
${body_text}
</body>
</html>`;
};

const md2h = async (): Promise<number> => {
	type args = { help: boolean, output_html: boolean, arguments_help: boolean, no_html_no_head: boolean };
	let my_args: string[] = Bun.argv.slice(2, Bun.argv.length);
	const arg_flags: args = {
		help: my_args.includes("-h") ? true : false,
		output_html: my_args.includes("-o") ? true : false,
		arguments_help: my_args.includes("-a") ? true : false,
		no_html_no_head: my_args.includes("-nh") ? true : false,
	};

	my_args = my_args.filter(arg => ["-h", "-o", "-a", "-nh"].includes(arg) ? false : true);

	if (arg_flags.help === true) {
		helper(true);
		return 0;
	}
	if (arg_flags.arguments_help === true) {
		helper(false);
		return 0;
	}

	for (let i = 0; i < my_args.length; i++) {
		const curr_arg = my_args[i];
		if (curr_arg !== undefined) {
			let text: string | undefined = await readFile(curr_arg)
			if (text !== undefined) {
				const tags_text = tags(text);
				text = tags_text.text;
				if (typeof (text) === "string") {
					const body_text = md_to_html(text);
					if (arg_flags.output_html === true) {
						let file_name = cleanFilename(curr_arg);
						let full_html = "";
						if (arg_flags.no_html_no_head === false) {
							full_html = wrapInsideBody(body_text, tags_text.tags);
						}
						else {
							full_html = body_text;
						}
						await Bun.write(`./output/${file_name}.html`, full_html)
							.then(() => console.log(`./output/${file_name}.html created`))
							.catch(err => console.log(`error writing ./output/${file_name}.html`, err))

					}
					else if (arg_flags.no_html_no_head === true) {
						console.log(md_to_html(text));
					}
					else {
						console.log(wrapInsideBody(body_text, tags_text.tags));
					}
				}
			};
		}
	}
	return 0;
}

await md2h();
