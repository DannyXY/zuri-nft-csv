Good day
To Use the program, you have to have node installed in your local system

After installing node(If yoou didn't have it prior), Install all dependencies using this command

```bash
npm install
```

Once the dependencies are installed, copy the csv file you want to format into the current directory
Change the path to the relative path of the csv in the csvpath.js file

```js
export const PATH = "the Relative Path of your csv"
```

Copy the .env.example file to .env and edit it, with your own values.

```bash
cp .example.env .env
```

then run the script using the commmand below
```bash
node index.js
```