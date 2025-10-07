"use strict";

import React from "react";
import ReactDOM from "react-dom";

import { ToolHeader } from "./react/ToolHeader";
import { Interface } from "./react/Interface";

const $ = require("jquery");

ReactDOM.render(
    <ToolHeader/>,
    document.getElementById("titleHeader")
);

ReactDOM.render(
    <Interface/>,
    document.getElementById("interFace")
);

window.addEventListener("resize", handleResize);
handleResize(); // 起動時にもリサイズしておく
function handleResize() {
    let w = $(".wrapper").width();
    let h = $(".wrapper").height();
    $("#canvas").attr("width", w);
    $("#canvas").attr("height", h);
}

/*
let menu = document.createElement("div");
menu.setAttribute("id", "menu");
menu.setAttribute("style", "display: none");
menu.setAttribute("oncontextmenu", "return false;");
document.body.appendChild(menu);

let textArea = document.createElement("div");
textArea.setAttribute("id", "textArea");
document.body.appendChild(textArea);

let idTable = document.createElement("div");
idTable.setAttribute("id", "idtable");
idTable.setAttribute("oncontextmenu", "return false;");
document.body.appendChild(idTable);
 */