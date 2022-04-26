import React from "react";
import { render } from "react-dom";
import * as ReactDOMClient from "react-dom/client";
import App from "./components/App";

const container = document.getElementById("root");

import styles from "./styles.css"; // eslint-disable-line no-unused-vars

const root = ReactDOMClient.createRoot(container);
root.render(<App />);
