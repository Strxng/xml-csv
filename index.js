const fs = require("fs");
const { parseString } = require("xml2js");
const ObjectsToCsv = require("objects-to-csv");

function xmlToCsv(xmlFile, csvFile) {
  fs.readFile(xmlFile, "utf-8", (err, data) => {
    if (err) {
      console.error("Erro ao ler o arquivo XML:", err);
      return;
    }

    parseString(data, (err, result) => {
      if (err) {
        console.error("Erro ao analisar o XML:", err);
        return;
      }

      const conversations = result.conversations.conversation;
      const csvData = [];

      for (const conversation of conversations) {
        const conversationId = conversation.$.id;

        for (const message of conversation.message) {
          const line = message.$.line;
          const author = message.author[0].trim();
          const time = message.time[0].trim();
          const text = message.text[0].trim();

          csvData.push({
            conversation_id: conversationId,
            line,
            author,
            time,
            text,
          });
        }
      }

      const csv = new ObjectsToCsv(csvData);

      csv
        .toDisk(csvFile, { allColumns: true })
        .then(() => {
          console.log(
            "Conversão concluída. O arquivo CSV foi salvo em:",
            csvFile
          );
        })
        .catch((err) => {
          console.error("Erro ao salvar o arquivo CSV:", err);
        });
    });
  });
}

// Exemplo de uso
const xmlFile = "./teste.xml";
const csvFile = "./pan.csv";
xmlToCsv(xmlFile, csvFile);
