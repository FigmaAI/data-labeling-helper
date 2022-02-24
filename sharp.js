const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const imageFolder = "./fluentIcons/background/";
const iconFolder = "./fluentIcons/images/";
const outputFolder = "./fluentIcons/sample/";

fs.readdir(iconFolder, (err, files) => {
  // On error, show it and return
  err ? console.log("forEach: ", err) : console.log("forEach: Done");

  //get backgound
  const background = fs.readdirSync(imageFolder);
  

  files.forEach((file) => {
    const pick = Math.floor(Math.random() * background.length);
    try {
      sharp(imageFolder + background[pick])
        .composite([{ input: iconFolder + file, left: 0, top: 0 }])
        .toFile(outputFolder + file);
    } catch (err) {
      console.error(err);
    }
  });
});
