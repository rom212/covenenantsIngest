This is an example of data ingestion for HtmlRAG.
https://arxiv.org/abs/2411.02959


It takes the document at https://www.sec.gov/Archives/edgar/data/885725/000110465921065917/tm2116033d1_ex10-1.htm and proceeds to chunking it, pruning the noisy HTML while keeping the semantically meaningful one in place and then indexing it into Azure AI Search for downstream RAG.

First run the chunk function

node ./chunk.js

It will place files in he output folder. These files are text chunks that still contain meaningful HTML structure.

Then run

node ./ingest.js

This indexes the chunks and vectors in AI Search.
