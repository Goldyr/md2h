const spans = ["<span id=\"code\" class=\"lang-js\">js\nvar foo = 'bar';\n\nfunction baz(s) {\n        return foo + ':' + s;\n}\n</span>",
	"<span id=\"code\" class=\"lang-rust\">rust\nvar foo = 'bar';\n\nfunction baz(s) {\n        return foo + ':' + s;\n}\n</span>",
	"<span id=\"code\">var foo = 'bar';\n\nfunction baz(s) {\n        return foo + ':' + s;\n}\n</span>",
	"<span id=\"code\">var foo = 'bar'; </span>"
]
const matches = ["This is some basic, sample markdown.", "And <strong>bold</strong>, <em>italics</em>, and even <em>italics and later <strong>bold</strong></em>. Even ~~strikethrough~~. < a href =\"https://markdowntohtml.com\">A link</a> to somewhere.",
	"And code highlighting:", "var foo = 'bar';", "function baz(s) {", "var foo = 'bar';", "function baz(s) {",
	"function baz(s) {", "Or inline code like <span id=\"code\">var foo = 'bar'; </span>.",
	"Or an image of bears"
]

console.log(spans);
console.log(matches);
console.log("-------------------------")

const filtered_matches = matches.filter(match => {
	for (let j = 0; j < spans.length; j++) {
		const span = spans[j];
		if (span.includes(match)) {
			console.log(`matched ${match} in ${span}`)
			return false;
		}
	}
	return true;
})

console.log(matches.length);
console.log(filtered_matches.length);
console.log(filtered_matches);
