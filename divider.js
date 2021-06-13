const fs = require("fs");
const path = require("path");
const imageFolder = "./images/origin/mobbin/";
const outputFolder = "./images/origin/output/";
const xmlFolder = "./images/origin/xml/";

fs.readdir(xmlFolder, (err, files) => {
  // On error, show it and return
  err ? console.log("forEach: ", err) : console.log("forEach: Done");

  files.forEach((file) => {
    let filename = path.parse(file).name;
    let imgName = filename + ".png";
    // console.log(imgName);
    fs.copyFile(imageFolder + imgName, outputFolder + imgName, (err) => {
      if (err) {
        console.log("Error Found:", err);
      } else {
          console.log("done")
        
      }
    });
  });
});
