"use strict"
//language array (you can write your own json file with language and add name to the array)
let langua = ["en", "ua", "ru"]; 
//json source files 
let lang_source = {
    en: require("./languages/en.json"),
    ua: require("./languages/ua.json"),
    ru: require("./languages/ru.json")
};
exports.lang_source=lang_source;

function Convert_to_word (n,options){
    options = options || {};
    options = util.defaults(options, Convert_to_word.defaults);
    var shortScale = [100];
    for (var i = 1; i <= 16; i++) {
    shortScale.push(Math.pow(10, i * 3));
    }

    //check what language we will use 
    var language_know = typeof options.lang === "string"
    ? i18n[options.lang]
    : options.lang;
    // default language - english 
    if (!language_know) {
        if (langua.indexOf(Convert_to_word.defaults.lang) < 0) {
        Convert_to_word.defaults.lang = "en";
        }
        language = langua[Convert_to_word.defaults.lang];
    }

    if (n < 0) {
        return "You should input number from 0 to 2 147 483 647";
      }

  //number_system  (units)
    let number_system = language_know.number_system;
    let system;

}

exportss = module.exports = Convert_to_word