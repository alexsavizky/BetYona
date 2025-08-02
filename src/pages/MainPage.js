import React from "react";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import MalfunctionForm from "../components/MalfunctionForm";
import "../styles/MainPage.css";
function MainPage() {
  return (
    <div className="app-container">
      <Header></Header>
      <div className="no-header">
        <Navigation></Navigation>
        <div className="content">
          <MalfunctionForm></MalfunctionForm>
        </div>
      </div>
    </div>
  );
}
export default MainPage;
