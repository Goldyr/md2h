---
topic: code
title: m2h instructions
description: README for m2h
tags: ["code", "test"]
---
# mark_to_html
This is a simple implementation that spams regex filters to fit my markdown writing preferences, I would recommend this alternative for most cases:
https://github.com/markdown-it/markdown-it

## Installation and usage
`bun run install`

-h flag outputs to a file.html (creates it if it doesnt exist)
`bun run index.ts file.md -o file.html`

outputs the conversion to html to the console
`bun run index.ts file.md`

<!--TODO: Need to implement flags-->
* flags == 
    -o (outputs HTML to a file) 
    -h (outputs help)
    -a (outputs arguments)
    -nh (outputs the conversions without html or head)
## Conversion rules

<!--WARNING: the tag implementation uses String.split right now-->
### Tags
Tags are optional data of the file you can use them at the start of the file wrapping everything between triple '-' no commas  you can check the top of this file for a better example, this example doesnt use triple'-' to evade conflicts
topic: code
title: m2h instructions
description: README for m2h
tags: ["code", "test"]

### Basics
Blockquotes
> Basic Formatting

Bold
**Bold**

Emphasized 
*Emphasized*

### Headings

All headings are marked by # at the beginning of a line. h1 to h3 supported
# H1heading
## H2heading
### H3heading

### Links and images

Links look like this [title](https://markdowntohtml.com)
you can also use relative links [like this](./README.md).

Images look like this ![alt text](https://placebear.com/300/300)


### Lists 
List are made by using asterisks and spaces:

Eveything here is just <ul><li>item<li><li>item2<li>...<ul>

* One item
  1. SubItem
  2. Second SubItem
    * tabs tabs
    * tabs tabs tabs

* Second item
* One item
* Another item
  * A sub-item
    * A deeper item
  * Back in sub-item land
* Second item


### Code

Inline code uses `backticks`. 
Code blocks are surrounded by three backticks triple'`' and checks the first word for programming languages

Right know the implementation surrounds them in <span id="code" class="lang-LANGUAGE">CONTENT</span> or<span id="code">CONTENT</span> if it doesnt detect anything. Example:
```js
var foo = 'bar';

function baz(s) {
   return foo + ':' + s;
}
```

You might need to change it depending what you are doing with the html later.

## Extra sources
### \r \n \r\n
some OS use \r some \n some \r\n
https://stackoverflow.com/questions/15433188/what-is-the-difference-between-r-n-r-and-n


### regex
Using RegExp as object seems like a bad idea, preferably I would be using mystring.split(my_regex) but javascript seems to fuck around with the regex literal
mystring.matchAll(myregex).forEach(single_regex_result.forEach(actual_result => console.log(result))) is the result
https://regex101.com/
