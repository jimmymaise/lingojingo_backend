const translate = require('@vitalets/google-translate-api');
const Config = require('../../../config');
console.log(`${Config.get('/projectName')}`);



async function translateText(text, from, to) {
  try {
    let proxyUrl = `http://localhost:${Config.get('/port')['web']}/rotate-proxy/`
    let translatedText = await translate(text, {from: from || 'en', to: to || 'vi'}, proxyUrl)
    console.log(translatedText);
    return translatedText
  } catch (e) {
    //503 Service Unavailable
    //  Can implement function to call Google API for translate if need
    throw Error('Cannot translate currently. Try again later' + e)


  }

}

module.exports.translateText = translateText;
