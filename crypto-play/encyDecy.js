const crypto = require('crypto-js');

function encode(realText){
    return crypto.enc.Base64.stringify(crypto.enc.Utf8.parse(realText));
}

function decode(encodeText){
    return crypto.enc.Base64.parse(encodeText).toString(crypto.enc.Utf8);
}

module.exports = {encode, decode}
/** 
realText = "I LUV U";

try{
    var cipher = encode(realText);
    console.log(cipher);

    var decoded = decode(cipher);
    console.log(decoded);
} catch(error){
    console.error('Error :', error);
}
    **/