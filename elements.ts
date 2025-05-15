export const h1 = (content: string): string => {
	return `<h1>${content.trimStart()}</h1>`
}

export const h2 = (content: string): string => {
	return `<h2>${content.trimStart()}</h2>`
}

export const h3 = (content: string): string => {
	return `<h3>${content.trimStart()}</h3>`
}


export const list = (items: Array<string>) => {
	let li = "\n"
	//\t = tab \n for end of line
	items.forEach((item) => li += `\t<li>${item.replace("*", "")}</li> \n`)
	return `<ul>${li}</ul>`
}

export const p = (content: string) => {
	return `<p> ${content} </p>`;
}

export const bold = (content: string) => {
	return `<strong>${content}</strong>`
}

export const italics = (content: string) => {
	return `<em>${content}</em>`
}

export const code = (content: string) => {
	//returns text before the first \n, detects lang?
	const lang = (content.substring(0, content.search("\n")))
	content = content.replaceAll("`", "");
	let known_langs = new Set(["c", "cplus", "java", "rust", "java", "lua", "js", "ts", "c#", "html", "css"])
	if (known_langs.has(lang)) {
		return `<span id="code" class="lang-${lang}">${content}</span>`
	}
	return `<span id="code">${content}</span>`
}

//[example](https://youtu.be/ofp-PxQCAok)
export const link = (title: string, link: string) => {
	return `<a href=${link.replace("(", `"`).replace(")", `"`)}>${title.replace("[", "").replace("]", "")}</a>`
}


//![example](https://pbs.twimg.com/media/Gfo7bqPbUAA675b?format=jpg&name=small)
export const img = (title: string, link: string) => {
	return `<img src=${link.replace("(", `"`).replace(")", `"`)} alt=${title.replace("[", `"`).replace("]", `"`)}>`
}

export const quote = (content: string) => {
	return `<blockquote><p>${content.trimStart()}</p></blockquote>`
}

export default {}
