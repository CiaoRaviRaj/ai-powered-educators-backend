import fs from "fs";
import util from "util";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";

const readFile = util.promisify(fs.readFile);

/**
 * Process file content based on file type
 * @param {string} filePath - Path to the file
 * @param {string} mimeType - MIME type of the file
 * @returns {Promise<string>} - Extracted text content
 */
export const processFileContent = async (filePath, mimeType) => {
  try {
    // Process based on file type
    if (mimeType === "application/pdf") {
      // Process PDF
      const loader = new PDFLoader(filePath);
      const docs = await loader.load();
      return docs.map((doc) => doc.pageContent).join("\n\n");
    } else if (
      mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      // Process DOCX
      const loader = new DocxLoader(filePath);
      const docs = await loader.load();
      return docs.map((doc) => doc.pageContent).join("\n\n");
    } else if (mimeType === "text/csv" || mimeType === "application/csv") {
      // Process CSV
      const loader = new CSVLoader(filePath);
      const docs = await loader.load();
      return docs.map((doc) => doc.pageContent).join("\n\n");
    } else if (mimeType === "text/plain" || mimeType.startsWith("text/")) {
      // Process plain text
      const loader = new TextLoader(filePath);
      const docs = await loader.load();
      return docs.map((doc) => doc.pageContent).join("\n\n");
    } else {
      // For unsupported file types, return empty string
      return "File type not supported for text extraction.";
    }
  } catch (error) {
    console.error("Error processing file:", error);
    throw new Error(`Failed to process file: ${error.message}`);
  }
};
