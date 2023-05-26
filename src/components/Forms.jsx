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
          <a href="https://docs.google.com/document/d/1PSzRjeEon_8VSMBi9ZhCauYqj7dWtLS1kNOZ0lJ4UTM/edit">
            HS Athletic Handbook
          </a>
          <div className="sub-menu">
            <div>
              <a href="/wp-content/uploads/2020/11/HS-Handbook2020-2021-Sign-Return.pdf">
                -HS Sign &#038; Return
              </a>
            </div>
          </div>
        </div>
        <div>
          <a href="https://docs.google.com/document/d/1rlhREOqexAmuNZ2Zw5C8J5o0PppAK5Bw8MqBiTA1rAA/edit">
            MS Athletic Handbook
          </a>
          <div className="sub-menu">
            <div>
              <a href="/wp-content/uploads/2020/11/MS-Handbook2020-2021-Sign-Return.pdf">
                -MS Sign &#038; Return
              </a>
            </div>
          </div>
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
