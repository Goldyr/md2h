const p_testo = "And **bold**, *italics*, and even *italics and later **bold_again***. Even ~~strikethrough~~. [A link](https://markdowntohtml.com) to somewhere." +
	"**asdasd**" +
	"**asdasdsadas*daasdasdas**";

const bold_regex = /(?<=\*{2}).+?(?=\*{2})/g
console.log(bold_regex)
const matchAll_result = p_testo.matchAll(bold_regex)
matchAll_result.forEach(eachRegex_result => eachRegex_result.forEach(final_result => console.log(final_result)))


//const bold_regex_split = /(?<=\\* {2}).+?(?=\\* {2})/g
//console.log(String(bold_regex_split).toString())
//const split_result = p_testo.split(bold_regex_split)
//console.log(split_result)
