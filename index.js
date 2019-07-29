"use strict"
var writtenNumber = require('written-number');
writtenNumber(1234); // => 'one thousand two hundred and thirty-four'

writtenNumber.defaults.lang = 'uk';
writtenNumber(4758); // => 'cuatro mil setecientos cincuenta y ocho'

writtenNumber(1234, {lang: 'fr'});   // => 'mille deux cent trente-quatre'
writtenNumber(1234, {lang: 'es'});   // => 'mil doscientos treinta y cuatro'
writtenNumber(1234, {lang: 'az'});   // => 'min iki yüz otuz dörd'
writtenNumber(1234, {lang: 'pt'});   // => 'mil duzentos e trinta e quatro'
writtenNumber(1234, {lang: 'ar'});   // => 'ألف ومائتان وأربعة وثلاثون'
writtenNumber(1234, {lang: 'eo'});   // => 'mil ducent tridek kvar'
writtenNumber(1234, {lang: 'vi'});   // => 'một ngàn hai trăm và ba mươi bốn'
writtenNumber(1234, {lang: 'uk'});   // => 'одна тисяча двісті тридцять чотири'
writtenNumber(1234, {lang: 'id'});   // => 'seribu dua ratus tiga puluh empat'
