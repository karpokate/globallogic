# Task for globalLogic 


Text of task: 

    Написати програму, яка виводить на екран суму прописом для будь-якого введеного користувачем числа в межах від 0 до 2147483647 включно. 
    Програма має працювати для двох мов: англійської і української. 




Currently supported languages are:

| Language | `lang` |
|---------|--------|
| English | `en` |
| Ukrainian | `uk` |

### Configure your own language
Each language has its own unique grammar exceptions.  You can create your own 
language.json file in the folder "lang".

input it in console 
```
node 
```
after that 
```
var writtenNumber = require('written-number');
writtenNumber(1234); 

writtenNumber.defaults.lang = 'uk';
writtenNumber(4758);

writtenNumber(1234, {lang: 'uk'});

```



