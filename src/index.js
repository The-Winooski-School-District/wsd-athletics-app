import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { HashRouter } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-csv-importer/dist/index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <App />
    <footer id="main-footer-added">
      <div id="footer-bottom-added">
        <div class="container clearfix">
          <ul class="et-social-icons">
            <li class="et-social-icon et-social-facebook">
              <a href="https://www.facebook.com/WinooskiLearns/" class="icon">
                <span>Facebook</span>
              </a>
            </li>
            <li class="et-social-icon et-social-instagram">
              <a href="https://instagram.com/WinooskiLearns" class="icon">
                <span>Instagram</span>
              </a>
            </li>
          </ul>
          <div id="footer-info">
            © 2023 Winooski School District | Terms of Use | 60 Normand Street,
            Winooski, Vermont, 05404 | (802) 655-0485
          </div>
        </div>
      </div>
    </footer>
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
