This is an example of data ingestion for HtmlRAG.

It takes the document at https://www.sec.gov/Archives/edgar/data/885725/000110465921065917/tm2116033d1_ex10-1.htm and proceeds to chunking it, pruning the noisy HTML while keeping the semantically meaningful one in place and then indexing it into Azure AI Search for downstream RAG.
