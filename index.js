"use strict";

exports = module.exports = start;
var util = require("./util");

//add lang into array
var languages = ["en",  "uk"];
//connect json files with lang support
var i18n = {
  en: require("./lang/en.json"), //english
  uk: require("./lang/uk.json"), //ukrainian
};
exports.i18n = i18n;

var shortScale = [100];
for (var i = 1; i <= 16; i++) {
  shortScale.push(Math.pow(10, i * 3));
}

var longScale = [100, 1000];
for (i = 1; i <= 15; i++) {
  longScale.push(Math.pow(10, i * 6));
}

writtenNumber.defaults = {
  noAnd: false,
  alternativeBase: null,
  lang: "en"
};

/**
 * Converts numbers to their written form.
 *
 * @param {Number} n The number to convert
 * @param {Object} [options] An object representation of the options (language support)
 * @return {String} writtenN The written form of `n` 
 */

function writtenNumber(n, options) {
  options = options || {};
  options = util.defaults(options, writtenNumber.defaults);
  if (n < 0) {
    return "error, value smaller then 0";
  }
  if (n>2147483649){
    return "enter smaller value";
  }
  //copy value n & получаем остаток от деления 
  let decNum= (n*100)%100

  //округление
  n = Math.floor(n);
  
  //округление до 2х знаков после запятой 
  //n.toFixed(2);
  //let cent = n%1;

  var language = typeof options.lang === "string"
    ? i18n[options.lang]
    : options.lang;

    //default language - english
  if (!language) {
    if (languages.indexOf(writtenNumber.defaults.lang) < 0) {
      writtenNumber.defaults.lang = "en";
    }

    language = i18n[writtenNumber.defaults.lang];
  }
 
  var scale = language.useLongScale ? longScale : shortScale;
  //сотни, тысячи и тд
  var units = language.units;
  var unit;

  if (!(units instanceof Array)) {
    var rawUnits = units;
    units = [];
    scale = Object.keys(rawUnits);

    for (var i in scale) {
      units.push(rawUnits[scale[i]]);
      scale[i] = Math.pow(10, parseInt(scale[i]));
    }
  }
  //цифры 
  var baseCardinals = language.base;
  //в украинском - это феминитив (одна, дві)
  var alternativeBaseCardinals = options.alternativeBase 
    ? language.alternativeBase[options.alternativeBase]
    : {};

    //сотни, тисячі і тд (для укр)
  if (language.unitExceptions[n]) return language.unitExceptions[n];
  if (alternativeBaseCardinals[n]) return alternativeBaseCardinals[n];
  if (baseCardinals[n]) return baseCardinals[n];

  //начало условий (для меньше 100)
  if (n < 100)
    return handleSmallerThan100(n, language, unit, baseCardinals, alternativeBaseCardinals, options);
  

    //остаток от деленія  (два последних элемента)
  var m = n % 100;
  //массив в которий все засовиваем
  var ret = [];

  if (m) {
    if (
      options.noAnd &&
      !(language.andException && language.andException[10])
    ) {
      ret.push(writtenNumber(m, options));
    } else {
      ret.push(language.unitSeparator + writtenNumber(m, options));
    }
  }
  var firstSignificant;


  for (var i = 0, len = units.length; i < len; i++) {
    var r = Math.floor(n / scale[i]);
    var divideBy;

    if (i === len - 1) divideBy = 1000000;
    else divideBy = scale[i + 1] / scale[i];

    r %= divideBy;

    unit = units[i];

    if (!r) continue;
    firstSignificant = scale[i];

    if (unit.useBaseInstead) {
      var shouldUseBaseException =
        unit.useBaseException.indexOf(r) > -1 &&
        (unit.useBaseExceptionWhenNoTrailingNumbers
          ? i === 0 && ret.length
          : true);
      if (!shouldUseBaseException) {
        ret.push(alternativeBaseCardinals[r * scale[i]] || baseCardinals[r * scale[i]]);
      } else {
        ret.push(r > 1 && unit.plural ? unit.plural : unit.singular);
      }
      continue;
    }
    if(n>1) 

    // условие для использования окончаний 
    var str;
    if (typeof unit === "string") {
      str = unit;
    } else if (r === 1 || unit.useSingularEnding && r % 10 === 1
      && (!unit.avoidEndingRules || unit.avoidEndingRules.indexOf(r) < 0)) {
      str = unit.singular;
    } else if (unit.few && (r > 1 && r < 5 || unit.useFewEnding && r % 10 > 1 && r % 10 < 5
      && (!unit.avoidEndingRules || unit.avoidEndingRules.indexOf(r) < 0))) {
      str = unit.few;
    } else {
      str = unit.plural && (!unit.avoidInNumberPlural || !m)
        ? unit.plural
        : unit.singular;
      
      // Languages with dual
      str = (r === 2 && unit.dual) ? unit.dual : str;
      
      // "restrictedPlural" : use plural only for 3 to 10
      str = (r > 10 && unit.restrictedPlural) ? unit.singular : str;
    }

    

    if (
      unit.avoidPrefixException &&
      unit.avoidPrefixException.indexOf(r) > -1
    ) {
      ret.push(str);
      continue;
    }

    var exception = language.unitExceptions[r];
    var number =
      exception ||
      writtenNumber(
        r,
        util.defaults(
          {
            // Languages with and exceptions need to set `noAnd` to false
            noAnd: !((language.andException && language.andException[r]) ||
              unit.andException) && true,
            alternativeBase: unit.useAlternativeBase
          },
          options
        )
      );
    n -= r * scale[i];
    ret.push(number + " " + str );
  }

  //method for money (moneyBig && moneySmall)
  

  var firstSignificantN = firstSignificant * Math.floor(n / firstSignificant);
  var rest = n - firstSignificantN;

  if (
    language.andWhenTrailing &&
    firstSignificant &&
    0 < rest &&
    ret[0].indexOf(language.unitSeparator) !== 0
  ) {
    ret = [ret[0], language.unitSeparator.replace(/\s+$/, "")].concat(
      ret.slice(1)
    );
  }
  
  // Languages that have separators for all cardinals.
  if (language.allSeparator) {
    for (var j = 0; j < ret.length-1; j++) {
      ret[j] = language.allSeparator + ret[j];      
    }
  }
  
  //result input
  var result = ret.reverse().join(" ") 
  return result;
}
 
function money(k, base)
{
  if (k==1){
    return base[0]
  }
  k%=100;
  if (k>20){
    k=k%10
  }
  
  
  if (k==1){
    return base[1]
  }
  else {
    if(k>1 && k<5){
      return base[2]
    }
    else 
      return base[base.length-1]
  }
}
function start (n,options){
  options = options || {};
  let num = n;
  let decNum= (num*100)%100

  var language = typeof options.lang === "string"
    ? i18n[options.lang]
    : options.lang;

    //default language - english
  if (!language) {
    if (languages.indexOf(writtenNumber.defaults.lang) < 0) {
      writtenNumber.defaults.lang = "en";
    }

    language = i18n[writtenNumber.defaults.lang];
  }

  let result= writtenNumber (n,options)+" "+money(Math.trunc(n), language.moneyBig)+" "+writtenNumber(decNum,options)+ " " + money (decNum, language.moneySmall)
return result
}
function handleSmallerThan100(n, language, unit, baseCardinals, alternativeBaseCardinals, options) {
  var dec = Math.floor(n / 10) * 10;
  unit = n - dec;
  if (unit) {
    return (
      alternativeBaseCardinals[dec] || baseCardinals[dec] + language.baseSeparator + writtenNumber(unit, options)
    );
  }
  return alternativeBaseCardinals[dec] || baseCardinals[dec];
}



