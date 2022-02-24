const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const imageFolder = "./fluentIcons/combined/";
const outputFolder = "./fluentIcons/background/";

fs.readdir(imageFolder, (err, files) => {
  // On error, show it and return
  err ? console.log("forEach: ", err) : true;

  files.forEach((file) => {
    sharp(imageFolder + file)
      .resize({ height: 640 })
      .toFile(outputFolder + file)
      .then((info) => {
        console.log(info);
      })
      .catch((err) => {
        // output.jpg is a 640 height
        console.log(err);
      });
  });
});
