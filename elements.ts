
//TODO:gets a line returns if its a h1 h2 or h3
export const h1h2orh3 = (line: string): string => {
	return 'h1'
}

export const h1 = (content: string) => {
	return `<h1> ${content} </h1>`
}

export const h2 = (content: string) => {
	return `<h2> ${content} </h2>`
}

export const list = (items: Array<string>) => {
	let li = "\n"
	//\t = tab \n for end of line
	items.forEach((item) => li += `\t<li>${item}</li> \n`)
	return `<ul>${li}</ul>`
}

export const p = (content: string) => {
	console.log("p")
	const bold_regex = /(?<=\*{2}).+?(?=\*{2})/g
	const matchAll_result = content.matchAll(bold_regex)
	let boldo_instances: Array<string> = []
	matchAll_result.forEach(eachRegex_result => eachRegex_result.forEach(final_result => boldo_instances.push(final_result)))

	//let le_bold = content.split("**");
	if (boldo_instances.length > 2)
		for (let i = 0; i < boldo_instances.length; i++) {
			let current_bold_line = boldo_instances[i];
			if (typeof current_bold_line === "string") {
				content = content.replace(current_bold_line, bold(current_bold_line))
			}
		}

	console.log("regexp should get this between <strong> --->", boldo_instances)
	//let le_italics = content.split("*");
	//for (let i = 0; i < le_italics.length; i++) {
	//	let current_bold_line = le_italics[i];
	//	if (i !== 0 && typeof current_bold_line === "string") {
	//		content.replace(current_bold_line, bold(current_bold_line))
	//	}
	//}


	return `<p>${content}</p>`
}

export const bold = (content: string) => {
	return `<strong>${content}</strong>`
}

export const italics = (content: string) => {
	return `<em>${content}</em>`
}

export const code = (content: string) => {
	return `<span id="code">${content}</span>`
}

export const link = (content: string, link: string) => {
	return `<a href=${link}>${content}</a>`
}


export default {}
