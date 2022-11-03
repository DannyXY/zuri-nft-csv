const fs = require("fs");
const csv = require("csv-parser");
const sha256 = require("sha256");
const { PATH } = require("./csvpath");
require("dotenv").config({ path: ".env" });

fs.writeFileSync(
  "output.csv",
  "Serial Number,Name,UUID,Hash\n",
  function (err) {
    if (err) {
      console.log(err);
    } else {
      return;
    }
  }
);

const result = [];
fs.createReadStream(PATH)
  .pipe(csv({}))
  .on("data", (data) => result.push(data))
  .on("end", () => {
    fs.writeFileSync("output.json", JSON.stringify(result));
    for (let i = 0; i < result.length; i++) {
      const jsonObj = result[i];
      const keys = Object.keys(jsonObj);
      let attributes = [];
      for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let obj = {};
        if (key.includes("Attribute")) {
          obj[key] = jsonObj[key];
          attributes.push(obj);
        }
      }
      const formattedObj = {
        format: "CHIP-0007",
        name: "All team naming",
        description: jsonObj["description"],
        minting_tool: "",
        sensitive_content: false,
        series_number: jsonObj["Series Number"],
        series_total: result.length,
        attributes: [jsonObj.attributes],
        collection: {
          name: jsonObj["Filename"],
          id: jsonObj["UUID"],
          attributes: [attributes],
        },
      };

      finalObject = {
        ...formattedObj,
        data: {
          hash: jsonObj["Filename"]
            ? sha256(JSON.stringify(formattedObj) + "lolol")
            : "",
        },
      };

      fs.appendFileSync(
        "output.csv",
        `${jsonObj["Series Number"]},${
          finalObject.collection.name ? finalObject.collection.name : ""
        },${jsonObj["UUID"] ? jsonObj["UUID"] : ""},${finalObject.data.hash}\n`,
        function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log("next");
          }
        }
      );
    }
  });

// Without NPM package

// console.log(array.length);
// let result = [];

// The array[0] contains all the
// header columns so we store them
// in headers array
// let headers = array[0].split(",");
// console.log(headers);
// Since headers are separated, we
// need to traverse remaining n-1 rows.
// for (let i = 1; i < array.length - 1; i++) {
//   let obj = {};

//   // Create an empty object to later add
//   // values of the current row to it
//   // Declare string str as current array
//   // value to change the delimiter and
//   // store the generated string in a new
//   // string s
//   let str = array[i];

//   let props = str.match(/(\s*'[^']+'|\s*[^,]+)(?=,|$)/g);
//   const newProp = props.filter((item) => item !== ",");
//   console.log(newProp);

//   //   // For each header, if the value contains
//   //   // multiple comma separated data, then we
//   //   // store it in the form of array otherwise
//   //   // directly the value is stored
//   for (let j = 0; j < headers.length; j++) {
//     let header = headers[j];
//     obj[header] = newProp[j].trim();
//   }

// const formattedObj = {
//   format: "CHIP-0007",
//   name: "All team naming",
//   description: obj["description"],
//   minting_tool: "",
//   sensitive_content: false,
//   series_number: obj["Series Number"],
//   series_total: 1000,
//   attributes: [],
//   collection: {
//     name: obj["Filename"],
//     id: obj["UUID"],
//     attributes: [],
//   },
// };

// const finalObject = {
//   ...formattedObj,
//   data: {
//     hash: sha256(JSON.stringify(formattedObj) + "lolol"),
//   },
// };
//   fs.appendFileSync(
//     "output.csv",
//     `${obj["Series Number"]},${finalObject.collection.name},${obj["UUID"]},${finalObject.data.hash}\n`,
//     function (err) {
//       if (err) {
//         console.log(err);
//       } else {
//         console.log("next");
//       }
//     }
//   );
//   console.log(obj);
//   result.push(finalObject);
// }

// Convert the resultant array to json and
// generate the JSON output file.
// fs.writeFileSync("output.json", JSON.stringify(jsonObj));
// console.log(result);
