# globallogic
task (test) for future work 


 how can i manage this task: 

     ОТ 0 до 2 147 483 647
     от нуля до два миллиарда сто сорок семь миллионов четыреста восемьдесят три тысячи шестьсот сорок семь



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


