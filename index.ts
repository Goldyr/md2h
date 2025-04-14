import Bun from "bun"

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

const detect_marks = (text: string): void => {
	//TODO:
	//--- to --- = headers/tags 
	//# is a H1 until <CR>
	//## is a H2 until <CR>
	//normal text is just a p
	//[algo](url) = <a>algo</a> with href=url
	//``` til ``` is a block code maybe mark it with class = "code"?
	//### is a H3 until <CR>
	//Copy the spaces also?

	//https://stackoverflow.com/questions/15433188/what-is-the-difference-between-r-n-r-and-n
	let lines = text.split("\r\n")
	console.log("length: ", lines.length)

	for (let i = 0; i < lines.length; i++) {
		console.log('------------')
		console.log(lines[i])
	}

	//if (text.match("---") != null) {
	//	let split_tags = text.split("---");
	//	const tags = split_tags[1];
	//	console.log(tags);
	//}

	return
}

console.log("Hello via Bun!");
const my_args: any = Bun.argv.slice(2, Bun.argv.length);

//const files_text: Array<string> = []
for (let i = 0; i < my_args.length; i++) {
	let text: string | unknown = await readFile(my_args[i])
	if (typeof (text) == "string") {
		//files_text.push(text)
		detect_marks(text)
		//if (typeof (files_text[i]) == "string") {
		//}
	}

}
