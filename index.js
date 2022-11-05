const fs = require("fs");
const csv = require("csv-parser");
const sha256 = require("sha256");
const figlet = require("figlet");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

require("dotenv").config({ path: ".env" });


console.log(figlet.textSync("ZURI CSV PARSER"));
console.log("Welcome to Zuri CSV Parser");
readline.question(
  `Input the file relative file path of the .CSV file: `,
  (path) => {
    console.log(`Processing path ... ${path}`);
    readline.close();
    const result = [];
    console.log("...");
    //parse csv into JSON using the csvparser
    fs.createReadStream(path)
      .on("error", (err) =>
        console.log(
          `The path ${path} is invalid, try passing just the name of the file in the root of the directory e.g filename.csv`
        )
      )
      .pipe(csv({}))
      .on("data", (data) => result.push(data))
      .on("end", () => {
        fs.writeFileSync(
          `${path.split(".")[0]}.output.csv`,
          "Serial Number,Name,UUID,Hash\n",
          function (err) {
            if (err) {
              console.log(err);
            } else {
              return;
            }
          }
        );
        const formattedJson = [];
        // write the json output of the csv file into a json file in the root of the directory
        for (let i = 0; i < result.length; i++) {
          const jsonObj = result[i];
          const keys = Object.keys(jsonObj);
          let attributes = [];
          // For every key containing the words attrbute
          // the name and the value is extracted and added to the CHIP_0007 compatible json
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
            attributes: [Object.keys(...attributes)],
            collection: {
              name: jsonObj["Filename"],
              id: jsonObj["UUID"],
              attributes: [attributes],
            },
          };

          // final JSON object after hashing the previous json using SHA256
          finalObject = {
            ...formattedObj,
            data: {
              hash: jsonObj["Filename"]
                ? sha256(
                    JSON.stringify(formattedObj) + process.env.SHA256_SECRET
                  )
                : "",
            },
          };
          formattedJson.push(finalObject);

          // Continuosly append a new line to the output.csv file for every entry
          // Filter out the ones with empty names(Team Serials) so their hash doesn't get passed back
          fs.appendFileSync(
            `${path.split(".")[0]}.output.csv`,
            `${jsonObj["Series Number"]},${
              finalObject.collection.name ? finalObject.collection.name : ""
            },${jsonObj["UUID"] ? jsonObj["UUID"] : ""},${
              finalObject.data.hash
            }\n`,
            function (err) {
              if (err) {
                console.log(err);
              } else {
                return;
              }
            }
          );
        }

        console.log("💚 Successfully parsed CSV into filename.output.csv");
        console.log("Parsing JSON file...");
        fs.writeFileSync(
          `${path.split(".")[0]}.output.json`,
          JSON.stringify(formattedJson)
        );
        console.log(`❤ Successfully parsed filename.output.json`);
      });
  }
);
