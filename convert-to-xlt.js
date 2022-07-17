const parseString = require("xml2js").parseString;
const fs = require("fs");
const ExcelJS = require("exceljs");

const xml = fs.readFileSync(__dirname + "/strings.xml", "utf-8");

const handleExcel = async (data) => {
  const workbook = new ExcelJS.Workbook();

  // Set Workbook Properties
  workbook.creator = "NAVER NOW";
  workbook.lastModifiedBy = "NAVER NOW";
  workbook.created = new Date();
  workbook.modified = new Date();
  workbook.lastPrinted = new Date();
  workbook.properties.date1904 = true;
  workbook.calcProperties.fullCalcOnLoad = true;

  const worksheet = workbook.addWorksheet("properties");
  worksheet.columns = [
    { header: "key", key: "key" },
    { header: "en_US", key: "en_US" },
    { header: "ko_KR", key: "ko_KR" },
  ];

  parseString(data, function (err, result) {
    if (err) throw err;
    const array = result.resources.string;
    array.forEach((element) => {
      const ko_KR = element._;
      const key = element.$.name;
      worksheet.addRow({ key: key, en_US: "", ko_KR: ko_KR });
    });
  });

  await workbook.xlsx.writeFile("now_xlt_generated.xlsx");
};

handleExcel(xml);