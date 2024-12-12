import fs from "fs/promises";
import { prune } from "./prune.js";

const splitFile = async () => {
  try {
    // Read the large file
    const data = await fs.readFile("tm2116033d1_ex10-1.htm", "utf8");

    // Updated regex pattern to match both cases and any text after <BR>
    const pattern =
      /<P STYLE="font: 10pt Times New Roman, Times, Serif; margin: 0pt 0; text-align: center"><FONT STYLE="(?:font-family: Times New Roman, Times, Serif; font-size: 10pt; )?text-transform: uppercase"><B>(<A NAME="[^"]*"><\/A>)?SECTION&nbsp;\d{1,2}<\/B><\/FONT>(<B><FONT STYLE="text-transform: uppercase"><BR>[\s\S]*?<\/FONT><\/B>)?<\/P>/gi;
    const matches = data.match(pattern);

    if (!matches) {
      console.error("No matches found");
      return;
    }

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

    const prunedChunks = chunks.map((chunk, _) => prune(chunk));

    // Further split each chunk into smaller chunks of no more than 20,000 characters
    const smallChunks = [];
    prunedChunks.forEach((chunk, chunkIndex) => {
      for (let i = 0; i < chunk.length; i += 10000) {
        smallChunks.push({
          content: chunk.slice(i, i + 10000),
          fileIndex: chunkIndex + 1,
          partIndex: Math.floor(i / 10000) + 1,
        });
      }
    });

    // Write each small chunk to a new file
    await Promise.all(
      smallChunks.map(({ content, fileIndex, partIndex }) =>
        fs.writeFile(`output/section${fileIndex}_part${partIndex}.txt`, content)
      )
    );

    console.log("Files have been saved!");
  } catch (err) {
    console.error(err);
  }
};

splitFile();
