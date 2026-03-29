let crpyto;
try {
    crpyto = require('./encyDecy.js');
} catch (error){
    console.error('Error :', error);
}
text = "HALP"
console.log(crpyto.encode(text));
