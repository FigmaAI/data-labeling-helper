const sizeOf = require("image-size");
const fs = require("fs");
const builder = require("xmlbuilder");
const path = require("path");
const sharp = require("sharp");
const imageFolder = "./images/sample/test/";
const outputFolder = "./images/sample/testing/";
const xmlFolder = "./images/sample/xml/";

const createxml = (to_file_name, dimensions, x, y, xi, yi) => {
  let absolutePath = outputFolder + to_file_name + ".png"
  let dir = path.basename(path.dirname(absolutePath));

  let obj = {
    annotation: {
      folder: {
        "#text": dir,
      },
      filename: {
        "#text": to_file_name + ".png",
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
          "#text": "3",
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
  fs.writeFile(
    xmlFolder + to_file_name + ".xml",
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
          createImage(file, dimensions, x, y, xi, yi);
        }
      }
    });
  });
});

const createImage = (file, dimensions, x, y, xi, yi) => {
  let filename = path.parse(file).name;
  let to_file_name = filename + "-" + xi + "-" + yi;
  console.log(filename);
  sharp("./images/iPhone 11.jpg")
    .composite([{ input: imageFolder + file, left: x, top: y }])
    .toFile(outputFolder + to_file_name + ".png");

  createxml(to_file_name, dimensions, x, y, xi, yi);
};
