function checkRegex(input) {
  console.log("Parsing " + input);
  let regex =  new RegExp('([a-zA-Z]+)\\s*=\\s*"?((?<=").*?(?=")|.*?(?=\\s*,?\\s*[a-zA-Z]+\\s*=)|.+[^\\s])', "g");
  let match = regex.exec(input);
  while (match != null) {
    console.log('"' + match[1] +'"' + ' ' + '"' + match[2] + '"');
    match = regex.exec(input);
  }
}

checkRegex('basic a=123,b=456');
checkRegex('basic a = 123, b=456');
checkRegex('basic a="123",b = 456');
checkRegex('basic a=123,b= "456"');
checkRegex('basic a= "123",b ="456"');
checkRegex('basic A = base64= ,B=base64=');
checkRegex('basic A = base64= ,B =base64= , a=123,b=456 ');
checkRegex('basic A = "aa,bb",a=123,b=456');

