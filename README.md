---
topic: code
title: md2h
description: README for md2h
tags: ["code", "test"]
---
# MD2H
This is a simple implementation that spams regex filters to fit my markdown writing preferences
If you are trying to transform .md to .html I would recommend one of this alternatives instead:
https://github.com/markdown-it/markdown-it
https://markdowntohtml.com/

## Installation and usage
`bun run install`

outputs the markdown converted to html:

`bun run index.ts file.md`

outputs the markdown converted to html to a file ./output/file.html:

`bun run index.ts file.md -o`

outputs all files to ./output:

`bun run index.ts file_1.md file_2.md file_3.md -o`

outputs just the basic structure directly converted without header

`bun run index.ts file.md -nh`

outputs the html without header to a .html file in ./output

`bun run index.ts file.md -nh -o`

* flags == 
    -o (outputs HTML to a file) 
    -h (outputs help)
    -a (outputs arguments)
    -nh (outputs the conversions without html or head)
## Conversion rules

<!--WARNING: the tag implementation uses String.split right now, it can produce errors mid paragraph-->
### Tags
Tags are optional data of the file that gets transformed into meta tags in the header, you put them wrapping everything between triple - you can check the top of this file for a better example.

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

Links look like this [title](https://github.com/Goldyr/md2h)
you can also use relative links [like this](./README.md).

Images look like this ![alt text](https://moonbench.xyz/assets/images/projects/ssd1306_1bit_art/discover.png)


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
