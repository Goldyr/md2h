# mark_to_html

``` 
bun install
```

### Warning
This is a simple implementation for myself for future reference its probably better to use some of this alternatives
https://github.com/markdown-it/markdown-it


### \r \n \r\n
some OS use \r some \n some \r\n
https://stackoverflow.com/questions/15433188/what-is-the-difference-between-r-n-r-and-n


### regex
Using RegExp as object seems like a bad idea, preferably I would be using mystring.split(my_regex) but javascript seems to fuck around with the regex literal
mystring.matchAll(myregex).forEach(single_regex_result.forEach(actual_result => console.log(result))) is the result
https://regex101.com/
