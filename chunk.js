import fs from "fs/promises";

// const splitFile = async () => {
//   try {
//     // Read the large file
//     const data = await fs.readFile("tm2116033d1_ex10-1.htm", "utf8");

//     // Your regex pattern to split the file
//     const pattern =
//       /<P STYLE="font: 10pt Times New Roman, Times, Serif; margin: 0pt 0; text-align: center"><FONT STYLE="text-transform: uppercase"><B>(<A NAME="[^"]*"><\/A>)?SECTION&nbsp;\d<\/B><\/FONT><\/P>/gi;
//     const parts = data.split(pattern);

//     // Write each part to a new file, ensuring the part is not undefined
//     await Promise.all(
//       parts.map((part, index) => {
//         if (part) {
//           return fs.writeFile(`output/file${index + 1}.txt`, part);
//         }
//       })
//     );

//     console.log("Files have been saved!");
//   } catch (err) {
//     console.error(err);
//   }
// };

const splitFile = async () => {
  try {
    // Read the large file
    const data = await fs.readFile("tm2116033d1_ex10-1.htm", "utf8");

    // Your regex pattern to find the delimiters
    // const pattern =
    //   /<P STYLE="font: 10pt Times New Roman, Times, Serif; margin: 0pt 0; text-align: center"><FONT STYLE="(?:font-family: Times New Roman, Times, Serif; font-size: 10pt; )?text-transform: uppercase"><B>(<A NAME="[^"]*"><\/A>)?SECTION&nbsp;\d<\/B><\/FONT>(<B><FONT STYLE="text-transform: uppercase"><BR>[\s\S]*?<\/FONT><\/B>)?<\/P>/gi;

    const pattern =
      /<P STYLE="font: 10pt Times New Roman, Times, Serif; margin: 0pt 0; text-align: center"><FONT STYLE="(?:font-family: Times New Roman, Times, Serif; font-size: 10pt; )?text-transform: uppercase"><B>(<A NAME="[^"]*"><\/A>)?SECTION&nbsp;\d{1,2}<\/B><\/FONT>(<B><FONT STYLE="text-transform: uppercase"><BR>[\s\S]*?<\/FONT><\/B>)?<\/P>/gi;

    const matches = data.match(pattern);

    if (!matches) {
      console.error("No matches found");
      return;
    }

    // Split the data into chunks
    let lastIndex = 0;
    const chunks = matches.map((match, index) => {
      const startIndex = data.indexOf(match, lastIndex);
      const endIndex =
        index < matches.length - 1
          ? data.indexOf(matches[index + 1], startIndex)
          : data.length;
      lastIndex = startIndex + match.length;
      return data.slice(startIndex, endIndex);
    });

    // Write each chunk to a new file
    await Promise.all(
      chunks.map((chunk, index) =>
        fs.writeFile(`output/file${index + 1}.txt`, chunk)
      )
    );

    console.log("Files have been saved!");
  } catch (err) {
    console.error(err);
  }
};

splitFile();
