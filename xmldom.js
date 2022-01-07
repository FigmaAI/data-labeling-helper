const fs = require("fs");
const path = require("path");
const xml2js = require("xml2js");
const builder = require("xmlbuilder");

const xmlFolder = "./images/origin/selectstar/";
const outputFolder = "./images/resize/xml/";

fs.readdir(xmlFolder, (err, files) => {
  // On error, show it and return
  err ? console.log("forEach: ", err) : null;

  files.forEach((file) => {
    fs.readFile(xmlFolder + file, (err, data) => {
      xml2js
        .parseStringPromise(data)
        .then((result) => {
          create_xml(result);
        })
        .catch((err) => console.error(err));
    });
  });
});

const create_xml = (obj) => {
  // // 파일명 앞에 prefix 추가
  // obj.annotation.filename[0] = "mobbin_" + obj.annotation.filename[0];
  // obj.annotation.path[0] = "mobbin_" + obj.annotation.path[0];

  let filename = path.parse(obj.annotation.filename[0]).name;
  let height = obj.annotation.size[0].height;
  let width = obj.annotation.size[0].width;

  // 크기를 세로 640으로 조정
  obj.annotation.size[0].width = Math.round((640 * width) / height);
  obj.annotation.size[0].height = 640;

  // bounding box도 크기 조정
  obj.annotation.object.forEach((origin) => {
    origin.bndbox[0].xmin[0] = Math.round(
      (origin.bndbox[0].xmin[0] * 640) / height
    );
    origin.bndbox[0].xmax[0] = Math.round(
      (origin.bndbox[0].xmax[0] * 640) / height
    );
    origin.bndbox[0].ymin[0] = Math.round(
      (origin.bndbox[0].ymin[0] * 640) / height
    );
    origin.bndbox[0].ymax[0] = Math.round(
      (origin.bndbox[0].ymax[0] * 640) / height
    );

    if (origin.bndbox[0].ymax[0] > obj.annotation.size[0].height) {
      console.log(filename);
    }
  });

  let xml = builder.begin().ele(obj).end({ pretty: true });
  fs.writeFile(outputFolder + filename + ".xml", xml, (err) => {
    if (err) throw err;
  });
};
