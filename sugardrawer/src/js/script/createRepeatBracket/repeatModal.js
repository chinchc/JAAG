//@flow
"use strict";

export let repeatModal = (): string => {
    let repeatNumber: string = prompt("Please Enter the number of repeats. (n, 3, 3-5)", "n");
    if(repeatNumber) {
        switch(repeatNumber) {
            case "n": {
                break;
            }
            default: {
                let repeatNumberList: Array<string> = repeatNumber.split("");
                for(let i = 0; i < repeatNumberList.length; i++) {
                    if(repeatNumberList[i] === " "){
                        repeatNumberList.splice(i, 1);
                    }
                }
                for(let i = 0; i < repeatNumberList.length; i++) {
                    if(repeatNumberList[i] === "-") {
                        if(repeatNumberList[i - 1] === "n" || repeatNumberList[i + 1] === "n") {
                            continue;
                        }
                        else if(Number(repeatNumberList[i - 1]) > Number(repeatNumberList[i + 1])) {
                            alert("Please change the range(small number - big number)");
                            return "";
                        }
                        else if(Number(repeatNumberList[i - 1]) === Number(repeatNumberList[i + 1])){
                            alert("The range not difference");
                            return "";
                        }
                    }
                }
            }

        }
        return repeatNumber;

    }
    else {
        repeatNumber = "n";
        return repeatNumber;
    }
};