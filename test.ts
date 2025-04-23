import { bold, italics, list } from "./elements.ts"

const matchMachine = (text: string, regex: RegExp, replacing_fun: Function, replacing_param: string): string => {
	//Array of results from every text.matchAll(regex)
	const matches = [...text.matchAll(regex)].map(m => m[1]);
	matches.forEach((match) => {
		if (match != undefined) {
			text = text.replace(replacing_param + match + replacing_param, replacing_fun(match))
		}
	})
	return text
}

const matchMachineList = (text: string, regex: RegExp): string => {
	const matches = [...text2.matchAll(possible_regex_list)].map(m => m[0])
	matches.forEach(match => {
		let lines = match.split("\n");
		console.log(list(lines));
	})
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

text2 = text2.replaceAll("\r\n", "\n")
text2 = text2.replaceAll("\r", "\n")

//const bold_regex = /\*\*(.+?)\*\*/g
//text2 = matchMachine(text2, bold_regex, bold, "**")

//const italics_regex = /\*(.+?)\*/g
//text2 = matchMachine(text2, italics_regex, italics, "*")

// you can use \n or \r\n instead of \r for other tests 
const possible_regex_list = /\*((.+)(\n)){1,}.+/g
//const matches = [...text2.matchAll(possible_regex_list)].map(m => m[0])
//console.log(matches)

matchMachineList(text2, possible_regex_list); 
