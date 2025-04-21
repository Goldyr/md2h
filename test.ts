
const bold = (content: string) => {
	return `<strong>${content}</strong>`
}

const italics = (content: string) => {
	return `<em> ${content} </em>`
}

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

let text = `And **bold**, *italics*, and even *italics and later **bold_again***. Even ~~strikethrough~~. [A link](https://markdowntohtml.com) to somewhere.`;

const bold_regex = /\*\*(.+?)\*\*/g
text = matchMachine(text, bold_regex, bold, "**")

const italics_regex = /\*(.+?)\*/g
text = matchMachine(text, italics_regex, italics, "*")

console.log(text)

