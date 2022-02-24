const fs = require("fs");
const path = require("path");
const xml2js = require("xml2js");
const builder = require("xmlbuilder");

const xmlFolder = "./assets_20220221233655/origin/";
const outputFolder = "./assets_20220221233655/xml/";

fs.readdir(xmlFolder, (err, files) => {
  // On error, show it and return
  err ? console.log("forEach: ", err) : null;

  files.forEach((file) => {
    fs.readFile(xmlFolder + file, (err, data) => {
      xml2js
        .parseStringPromise(data)
        .then((result) => {
          create_xml(result);
          // console.log(result.annotation.object);
        })
        .catch((err) => console.error(err));
    });
  });
});

const create_xml = (obj) => {
  const filename = path.parse(obj.annotation.filename[0]).name;
  const array = obj.annotation.object;
  for (let index = 0; index < array.length; index++) {
    const element = array[index];

    switch (element.name[0]) {
      // Button Anatomy
      case "buttoncontainer":
      case "buttoncontents":
      case "leftcomponent":
      case "rightcomponent":
      // Profile Anatomy
      case "profilebase":
      case "profiletext":
      case "profilethumbnail":
      // Item Anatomy
      case "artist":
      case "borderitem":
      case "certified":
      case "coorditem":
      case "customerfeedback":
      case "departuretoday":
      case "dropdown":
      case "npaybenefit":
      case "perdaily":
      case "pergram":
      case "rank":
      case "soldout-aleart":
      case "tooltip":
      case "value":
      case "zzim":
      case "zzim-view":
      // Item Info anatomy
      case "main":
      case "pre":
      case "store":
      case "sub":
      case "tags":
      // Item Pre anatomy
      case "author":
      case "badge":
      case "brand":
      case "maker":
      case "option":
      case "leftbottom":
      case "lefttop":
      case "rightbottom_a":
      case "rightbottom_b":
      case "horizontal":
      case "vertical":
      case "bottom":
      case "hair":
      case "info":
      case "free":
      case "landscape16x9":
      case "landscape2x1":
      case "landscape3x2":
      case "landscape8x5":
      case "square":
      case "tapping":
      case "space":
        delete obj.annotation.object[index];
        break;

      default:
        break;
    }
  }

  let xml = builder.begin().ele(obj).end({ pretty: true });
  fs.writeFile(outputFolder + filename + ".xml", xml, (err) => {
    if (err) throw err;
  });
};
