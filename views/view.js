const Handlebars = require("handlebars");
const path = require('path');
const fs = require('fs');
const { info } = require("console");
registerPartials("navbar");
registerPartials("footer");
function renderTemplate(name,data){
    let filePath = path.join("../CSM(MVC)","views",name+".hbs");
    let templatetext = fs.readFileSync(filePath,"utf-8");
    let template = Handlebars.compile(templatetext);
    return template(data);
}
function registerPartials(data){
    let filePath = path.resolve("../CSM(MVC)","views","partials",data+".hbs");
    let templatetext = fs.readFileSync(filePath,"utf-8");
    Handlebars.registerPartial(data,templatetext);
}
module.exports = renderTemplate;