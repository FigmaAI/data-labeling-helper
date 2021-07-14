const fs = require("fs");
const path = require("path");
const xml2js = require("xml2js");

const imageFolder = "./images/origin/mobbin/";
const outputFolder = "./images/origin/img/";
const xmlFolder = "./images/origin/1092_final_xml/";

fs.readdir(xmlFolder, (err, files) => {
  // On error, show it and return
  err ? console.log("forEach: ", err) : null;

  files.forEach((file) => {
    fs.readFile(xmlFolder + file, (err, data) => {
      xml2js
        .parseStringPromise(data)
        .then((result) => {
          let imgName = result.annotation.filename[0];
          fs.copyFile(imageFolder + imgName, outputFolder + imgName, (err) => {
            if (err) {
              console.log("Error Found:", err);
            }
          });
        })
        .catch((err) => console.error(err));
    });
  });
});
