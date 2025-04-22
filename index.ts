import Bun from "bun"
import { h1h2orh3, p } from "./elements.ts"

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

type content_position = {
	content: string,
	position: number
}



export const loop_text = (text: string): void => {
	//TODO:
	//--- to --- = headers/tags 
	//# is a H1 until <CR>
	//## is a H2 until <CR>
	//### is a H3 until <CR>
	//normal text is just a p
	//[algo](url) = <a>algo</a> with href=url
	//``` til ``` is a block code maybe mark it with class = "code"?
	//Copy the spaces also?

	//Some os uses \r some \n some \r\n
	//https://stackoverflow.com/questions/15433188/what-is-the-difference-between-r-n-r-and-n

	text = text.replaceAll("\r\n", "\r")
	text = text.replaceAll("\n", "\r")

	const raw_tags: Array<string> = []
	if (text.match("---") != null) {
		let split_tags = text.split("---");
		if (split_tags[1] != undefined && split_tags[2] != undefined) {
			raw_tags.push(split_tags[1]);
			text = split_tags[2]
		}
	}

	let lines: Array<string> = text.split("\r")
	console.log("length: ", lines.length)

	const arr_h1: Array<content_position> = []
	const arr_h2: Array<content_position> = []
	const arr_h3: Array<content_position> = []

	//If you need lines
	lines.forEach((line, i) => {
		if (line[0] === '#') {
			switch (h1h2orh3(line)) {
				case "h1":
					arr_h1.push({ content: line, position: i });
					break;
				case "h2":
					arr_h2.push({ content: line, position: i });
					break;
				case "h3":
					arr_h3.push({ content: line, position: i });
					break;
			}
		}

		//If you need letters
		//for (let i = 0; i < line.length; i++) {
		//	let letter = line[i];
		//	console.log(letter);
		//}

		console.log(line)
	})
	return
}

console.log("Hello via Bun!");
const my_args: any = Bun.argv.slice(2, Bun.argv.length);

//const files_text: Array<string> = []
for (let i = 0; i < my_args.length; i++) {
	let text: string | unknown = await readFile(my_args[i])
	if (typeof (text) == "string") {
		//files_text.push(text)
		//loop_text(text)
		console.log(p(text))
		//if (typeof (files_text[i]) == "string") {
		//}
	}

}
