import "../styles/App.css";
import React from "react";

const Forms = () => {
  return (
    <div className="Container forms">
      <div className="title-wrapper">
        <h2>Athletic Department Forms</h2>
      </div>
      <hr className="other-hr" />
      <div className="sub-menu">
        <div className="form-group">
          <a href="https://docs.google.com/document/d/e/2PACX-1vQs1aqB32CI_txWZRkTXt0T69SI4Hu6bvSo6ku_JFdd8FdFWZhx7rwo8sVcduOd7w/pub">
            Athletic Handbook
          </a>
          <div className="sub-menu">
            <div>
              <a href="https://wsdvt.org/wp-content/uploads/2020/11/HS-Handbook2020-2021-Sign-Return.pdf">
                -HS Sign &#038; Return
              </a>
            </div>
            
            <div>
              <a href="https://wsdvt.org/wp-content/uploads/2020/11/MS-Handbook2020-2021-Sign-Return.pdf">
                -MS Sign &#038; Return
              </a>
            </div>
          </div>
        </div>
        <div>


        </div>
        <div>
          <div className="lower-title-wrapper">
            <h3>Concussion Information</h3>
          </div>
          <div className="sub-menu">
            <div>
              <a href="https://www.wsdvt.org/wp-content/uploads/2019/08/Winooski-HS-Concussion-Protocol.pdf">
                Action Plan
              </a>
            </div>
            <div>
              <a href="https://www.wsdvt.org/wp-content/uploads/2014/01/Patient_RTP_Final_9_2010.pdf">
                After a Concussion
              </a>
            </div>
            <div>
              <a href="https://www.wsdvt.org/wp-content/uploads/2019/08/Concussion-fact-sheet-2019.pdf">
                Fact Sheet
              </a>
            </div>
            <div>
              <a href="https://www.wsdvt.org/wp-content/uploads/2014/01/Concussion_Presentation.pdf">
                Presentation
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forms;
