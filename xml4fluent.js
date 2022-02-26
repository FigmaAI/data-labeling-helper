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

    if (element.name[0] !== "Microsoft Fluent System Icons (Community)") {
      element.name[0] = "Microsoft Fluent System Icons (Community)";
    }
  }

  let xml = builder.begin().ele(obj).end({ pretty: true });
  fs.writeFile(outputFolder + filename + ".xml", xml, (err) => {
    if (err) throw err;
  });
};
