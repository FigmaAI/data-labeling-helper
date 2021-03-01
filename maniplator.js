const { promisify } = require("util");
const sizeOf = promisify(require("image-size"));

const fs = require("fs");
const builder = require("xmlbuilder");
const path = require("path");
const sharp = require("sharp");
const imageFolder = "./images/sample/iconWhite/";
const outputFolder = "./images/sample/testing/";
const xmlFolder = "./images/sample/testing/";

const createxml = (to_file_name, dimensions, x, y) => {
  let absolutePath = outputFolder + to_file_name + "-dark.png";
  let dir = path.basename(path.dirname(absolutePath));

  let obj = {
    annotation: {
      folder: {
        "#text": dir,
      },
      filename: {
        "#text": to_file_name + "-dark.png",
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
            "#text": "Icons",
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
  fs.writeFile(xmlFolder + to_file_name + "-dark.xml", xml, (err) => {
    if (err) throw err;
  });
};

fs.readdir(imageFolder, (err, files) => {
  // On error, show it and return
  err ? console.log("forEach: ", err) : console.log("forEach: Done");

  files.forEach((file) => {
    (async () => {
      try {
        const dimensions = await sizeOf(imageFolder + file);
        let xlist = Math.floor((414 - 8 * 2) / dimensions.width);
        let ylist = Math.floor((896 - 44 - 34) / dimensions.height);
        let xRandomNum = Math.random() * xlist;
        let yRandomNum = Math.random() * ylist;

        let x = 8 + dimensions.width * Math.floor(xRandomNum);
        let y = 44 + dimensions.height * Math.floor(yRandomNum);

        console.log(x, y);
        createImage(file, dimensions, x, y);
      } catch (err) {
        console.error(err);
      }
    })().then((c) => console.log(c));
  });
});

const createImage = (file, dimensions, x, y) => {
  let filename = path.parse(file).name;
  
  console.log(filename);
  sharp("./images/iPhone 11-dark.jpg")
    .composite([{ input: imageFolder + file, left: x, top: y }])
    .toFile(outputFolder + filename + "-dark.png");

  createxml(filename, dimensions, x, y);
};
