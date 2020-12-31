const sharp = require("sharp");
const fs = require("fs");
const builder = require("xmlbuilder");
const path = require("path");
const imageFolder = "./images/train/train/";
const outputFolder = "./images/train/training/";
const xmlFolder = "./images/train/xml/";

const createxml = (file, right, bottom) => {
  let absolutePath = path.resolve(imageFolder, file);
  let obj = {
    annotation: {
      folder: {
        "#text": "images",
      },
      filename: {
        "#text": file,
      },
      path: {
        "#text": absolutePath,
      },
      source: {
        database: {
          "#text": "Unknown",
        },
      },
      size: {
        width: {
          "#text": 414,
        },
        height: {
          "#text": 896,
        },
        depth: {
          "#text": "3",
        },
      },
      segmented: {
        "#text": "0",
      },
      object: {
        name: {
          "#text": "buttons",
        },
        pose: {
          "#text": "Unspecified",
        },
        truncated: {
          "#text": "1",
        },
        difficult: {
          "#text": "0",
        },
        bndbox: {
          xmin: {
            "#text": "8",
          },
          ymin: {
            "#text": "8",
          },
          xmax: {
            "#text": 414 - right,
          },
          ymax: {
            "#text": 896 - bottom,
          },
        },
      },
    },
  };
  let xml = builder.begin().ele(obj).end({ pretty: true });
  let filename = path.parse(file).name;
  fs.writeFileSync(xmlFolder + filename + ".xml", xml, (err) => {
    err ? console.log("xml: ", err) : true;
  });
};

fs.readdir(imageFolder, (err, files) => {
  err ? console.log("forEach: ", err) : true;
  files.forEach((file) => {
    let image = sharp(imageFolder + file);

    image
      .metadata()
      .then((metadata) => {
        let right = 414 - 8 - metadata.width;
        let bottom = 896 - 8 - metadata.height;
        return image
          .extend({
            top: 8,
            left: 8,
            bottom: bottom,
            right: right,
            background: { r: 255, g: 255, b: 255, alpha: 0 },
          })
          .toFile(outputFolder + file, (err) => {
            err ? console.log("tofile: ", err) : true;
          })
          .toBuffer()
          .then(() => {
            createxml(file, right, bottom);
          })

      })
      .catch((err) => {
        err ? console.log("metadata: ", err) : true;
      });
  });
});
