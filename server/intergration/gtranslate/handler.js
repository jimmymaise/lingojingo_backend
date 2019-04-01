const translate = require('@vitalets/google-translate-api');

async function translateEnToVi(text) {
  try {
    let translatedText = await translate(text, {from: 'en', to: 'vi'})
    console.log(translatedText);
    return translatedText
  } catch (e) {
    //503 Service Unavailable
    //  Can implement function to call Google API for translate if need
    throw Error('Cannot translate currently. Try again later' + e)


  }

}

module.exports.translateEnToVi = translateEnToVi;
