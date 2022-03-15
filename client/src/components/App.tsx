import React, { useState } from "react";
import Editor from "./Editor";
import DataTable from "./DataTable";

export default function App() {
  /* SQL STATEMENT from user */
  const [input, setInput] = useState("");
  /* Recieved data from BE - for purpose of Datatable */
  const [data, setData] = useState([]);
  /* Handling button text */
  const [btnText, setBtnText] = useState(false);
  /* For purpose of knowing if user input is query SELECT */
  const [isQuery, setIsQuery] = useState(true);
  /* Display message in case if SQL statements is not query SELECT.*/
  const [displayMessage, setDisplayMessage] = useState("");

  /* Take data from user and send it to BE */
  function sendQuery() {
    /* Keeps actual input from user (It should be select query to db) */
    const userInput = { input };

    if (!input.includes("SELECT")) {
      setIsQuery(false);
    }

    /* If user once click on btn it sets permanently new text 
    after that text stays same until reload or reset*/
    setBtnText(true);
    /* Use fetch to POST JSON-encoded data */
    fetch("http://localhost:3001/api/send-query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userInput),
    })
      .then((response) => response.json())
      .then((data) => {
        setDisplayMessage(
          data.affectedRows
            ? `Provedli jste změny v databázi. Dotčené řádky: ${data.affectedRows}`
            : "Něco se nepovedlo."
        );
        setData(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  /* Clean up editor + output - click on reset btn */
  function cleanEditor() {
    setInput("");
    setData([]);
    setBtnText(false);
    setDisplayMessage("");
  }

  return (
    <div className="container">
      <Editor
        language="sql"
        value={input}
        onChange={setInput}
        sendQuery={sendQuery}
        cleanEditor={cleanEditor}
        btnText={
          btnText ? <span>Spustit znovu</span> : <span>Spustit kód</span>
        }
      />
      <div className="result-container">
        <strong>Výsledek:</strong>
        <div className="result">
          {/* First ternary is for purpose of showing table or message */}
          {/* Second ternary is for purpose of showing positive message - everything is okey*/}
          {/* negative message - some mistake in syntax or something */}
          {isQuery ? <DataTable data={data} /> : displayMessage}
        </div>
      </div>
    </div>
  );
}
