import { expect, test, describe } from "bun:test";
import { md_to_html } from "../functions.ts"; // replace with your parser import

describe("Markdown syntax parsing", () => {
	test("parses headings", () => {
		const md = `# Heading 1\n## Heading 2\n### Heading 3`;
		const html = md_to_html(md);
		expect(html).toContain("<h1>Heading 1</h1>");
		expect(html).toContain("<h2>Heading 2</h2>");
		expect(html).toContain("<h3>Heading 3</h3>");
	});

	test("parses bold and italic text", () => {
		const md = `**bold** *italic*`;
		const html = md_to_html(md);
		expect(html).toContain("<strong>bold</strong>");
		expect(html).toContain("<em>italic</em>");
	});

	test("parses code blocks", () => {
		const md = "```js\nconsole.log('Hello');\n```";
		const html = md_to_html(md);
		expect(html).toContain(`<span id="code" class="lang-js">`);
		expect(html).toContain("console.log('Hello');");
	});

	test("parses links", () => {
		const md = `[test](url)`;
		const html = md_to_html(md);
		expect(html).toContain(`<a href="url">test</a>`);
	});

	test("parses images", () => {
		const md = "![image_title](image_url)";
		const html = md_to_html(md);
		expect(html).toContain(`<img src="image_url" alt="image_title">`);
	});

	test("parses iframe", () => {
		const md = "[video_title][video_url]";
		const html = md_to_html(md);
		expect(html).toContain(`<iframe src="video_url" title="video_title" allowfullscreen></iframe>`);
	});
});
