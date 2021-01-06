const sizeOf = require("image-size");
const fs = require("fs");
const builder = require("xmlbuilder");
const path = require("path");
const sharp = require("sharp");
const imageFolder = "./images/sample/train/";
const outputFolder = "./images/sample/training/";
const xmlFolder = "./images/sample/xml/";

const createxml = (file, dimensions, x, y, xi, yi) => {
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
          "#text": "414",
        },
        height: {
          "#text": "896",
        },
        depth: {
          "#text": "1",
        },
      },
      segmented: {
        "#text": "0",
      },
      object: [
        {
          name: {
            "#text": "Buttons",
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
              "#text": x,
            },
            ymin: {
              "#text": y,
            },
            xmax: {
              "#text": x + dimensions.width,
            },
            ymax: {
              "#text": y + dimensions.height,
            },
          },
        },
        {
          name: {
            "#text": "Status Bar",
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
              "#text": "0",
            },
            ymin: {
              "#text": "0",
            },
            xmax: {
              "#text": "414",
            },
            ymax: {
              "#text": "44",
            },
          },
        },
        {
          name: {
            "#text": "Home Indicator",
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
              "#text": "0",
            },
            ymin: {
              "#text": "862",
            },
            xmax: {
              "#text": "414",
            },
            ymax: {
              "#text": "896",
            },
          },
        },
      ],
    },
  };
  let xml = builder.begin().ele(obj).end({ pretty: true });
  let filename = path.parse(file).name;
  fs.writeFile(
    xmlFolder + filename + "-" + xi + "-" + yi + ".xml",
    xml,
    (err) => {
      if (err) throw err;
    }
  );
};

fs.readdir(imageFolder, (err, files) => {
  // On error, show it and return
  err ? console.log("forEach: ", err) : true;

  files.forEach((file) => {
    sizeOf(imageFolder + file, (err, dimensions) => {
      let xlist = Math.floor((414 - 8 * 2) / dimensions.width);
      let ylist = Math.floor((896 - 44 - 34) / dimensions.height);
      for (let xi = 0; xi < xlist; xi++) {
        let x = 8 + dimensions.width * xi;

        for (let yi = 0; yi < ylist; yi++) {
          let y = 44 + dimensions.height * yi;
          // console.log(x, y);
          createImage(file, dimensions, x, y, xi, yi);
        }
      }
    });
  });
});

const createImage = (file, dimensions, x, y, xi, yi) => {
  let filename = path.parse(file).name;

  sharp("./images/iPhone 11.jpg")
    .composite([{ input: imageFolder + file, left: x, top: y }])
    .toFile(outputFolder + filename + "-" + xi + "-" + yi + ".png");

  createxml(file, dimensions, x, y, xi, yi);
};
