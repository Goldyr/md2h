import Bun from "bun"
import { tags, helper, read_file, clean_filename, md_to_html, json_writer } from "./functions.ts"
import { type BlogData } from "./functions.ts"

//to edit the header
const setup_headers = (body_text: string, tags: Array<{ title: string, content: string }>, file_name: string): string => {
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
		meta_tags += ("<title>" + file_name + "</title>\n");
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
	type ARGS = { help: boolean, output_html: boolean, arguments_help: boolean, no_html_no_head: boolean, output_json_data: boolean };
	let my_args: string[] = Bun.argv.slice(2, Bun.argv.length);
	const arg_flags: ARGS = {
		help: my_args.includes("-h") ? true : false,
		output_html: my_args.includes("-o") ? true : false,
		arguments_help: my_args.includes("-a") ? true : false,
		no_html_no_head: my_args.includes("-nh") ? true : false,
		output_json_data: my_args.includes("-j") ? true : false,
	};

	my_args = my_args.filter(arg => ["-h", "-o", "-a", "-nh", "-j"].includes(arg) ? false : true);

	if (arg_flags.help === true) {
		helper(true);
		return 0;
	}
	if (arg_flags.arguments_help === true) {
		helper(false);
		return 0;
	}

	const json_to_write: Array<BlogData> = [];
	for (let i = 0; i < my_args.length; i++) {
		const curr_arg = my_args[i];
		if (curr_arg !== undefined) {
			let text: string | undefined = await read_file(curr_arg)
			const file_name = clean_filename(curr_arg);
			if (text !== undefined) {
				const tags_text = tags(text);
				text = tags_text.text;
				const body_text = md_to_html(text);
				if (arg_flags.output_html === true) {
					let html_to_write = "";
					if (arg_flags.no_html_no_head === false) {
						html_to_write = setup_headers(body_text, tags_text.tags, file_name);
					}
					else {
						html_to_write = body_text;
					}
					await Bun.write(`./output/${file_name}.html`, html_to_write)
						.then(() => console.log(`./output/${file_name}.html created`))
						.catch(err => console.log(`error writing ./output/${file_name}.html`, err));

				}
				else if (arg_flags.no_html_no_head === true) {
					console.log(body_text);
				}
				else {
					console.log(setup_headers(body_text, tags_text.tags, file_name));
				}
				if (arg_flags.output_json_data === true) {
					if (tags_text.json !== undefined) {
						json_to_write.push(tags_text.json);
					}
					else {
						json_to_write.push({ title: file_name, tags: [] })
					}
				}
			}
		}
	};

	if (arg_flags.output_json_data === true && json_to_write.length > 0) {
		if (await json_writer(json_to_write)) {
			console.log("created/updated html_data.json");
		}
	};
	return 0;
}

await md2h();
