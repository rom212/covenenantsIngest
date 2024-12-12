import fs from "fs";
import path from "path";
import OpenAI from "openai";
import dotenv from "dotenv";
import { SearchClient, AzureKeyCredential } from "@azure/search-documents";
import { v4 as uuidv4 } from "uuid";
import { sleep } from "openai/core.mjs";

dotenv.config();

const extractSectionAndPart = (inputString) => {
  const regex = /section(\d+)_part(\d+)\.txt/;
  const match = inputString.match(regex);
  if (match) {
    return [match[1], match[2]];
  } else {
    return;
  }
};

const aoaiClient = new OpenAI({
  apiKey: process.env.API_KEY,
  baseURL: `https://${process.env.EMBED_RESOURCE}.openai.azure.com/openai/deployments/${process.env.EMBED_DEPLOYMENT}`,
  defaultQuery: { "api-version": process.env.AOAI_API_VERSION },
  defaultHeaders: { "api-key": process.env.API_KEY },
});

const searchClient = new SearchClient(
  process.env.SEARCH_ENDPOINT,
  process.env.INDEX_NAME,
  new AzureKeyCredential(process.env.SEARCH_API_KEY)
);

async function ingestFile(filePath) {
  const [section, part] = extractSectionAndPart(filePath);
  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const embeddingResponse = await aoaiClient.embeddings.create({
      model: process.env.EMBED_DEPLOYMENT,
      input: fileContent,
    });

    const embedding = embeddingResponse.data[0].embedding;
    const uploadResult = await searchClient.uploadDocuments([
      {
        id: uuidv4(),
        section: section,
        part: part,
        chunkText: fileContent,
        chunkVector: embedding,
      },
    ]);
    for (const result of uploadResult.results) {
      console.log(`Uploaded ${result.key}; succeeded? ${result.succeeded}`);
    }
  } catch (err) {
    console.error(err);
  }
}

const directoryPath = "./output";
fs.readdir(directoryPath, (err, files) => {
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }

  files.forEach((file) => {
    console.log("processing: ", file);
    const filePath = path.join(directoryPath, file);
    ingestFile(filePath);
  });
});
