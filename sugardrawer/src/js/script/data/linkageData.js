//@flow
"uset strict";


export const linkageData: Object = {
    "a1-2": {
        anomeric: "α",
        childPosition: "1",
        parentPosition: "2"
    },
    "a1-3": {
        anomeric: "α",
        childPosition: "1",
        parentPosition: "3"
    },
    "a1-4": {
        anomeric: "α",
        childPosition: "1",
        parentPosition: "4"
    },
    "a1-5": {
        anomeric: "α",
        childPosition: "1",
        parentPosition: "5"
    },
    "a1-6": {
        anomeric: "α",
        childPosition: "1",
        parentPosition: "6"
    },
    "a1-7": {
        anomeric: "α",
        childPosition: "1",
        parentPosition: "7"
    },
    "a1-8": {
        anomeric: "α",
        childPosition: "1",
        parentPosition: "8"
    },
    "b1-2": {
        anomeric: "β",
        childPosition: "1",
        parentPosition: "2"
    },
    "b1-3": {
        anomeric: "β",
        childPosition: "1",
        parentPosition: "3"
    },
    "b1-4": {
        anomeric: "β",
        childPosition: "1",
        parentPosition: "4"
    },
    "b1-5": {
        anomeric: "β",
        childPosition: "1",
        parentPosition: "5"
    },
    "b1-6": {
        anomeric: "β",
        childPosition: "1",
        parentPosition: "6"
    },
    "b1-7": {
        anomeric: "β",
        childPosition: "1",
        parentPosition: "7"
    },
    "b1-8": {
        anomeric: "β",
        childPosition: "1",
        parentPosition: "8"
    },
    "a2-1": {
        anomeric: "α",
        childPosition: "2",
        parentPosition: "1"
    },
    "a2-3": {
        anomeric: "α",
        childPosition: "2",
        parentPosition: "3"
    },
    "a2-4": {
        anomeric: "α",
        childPosition: "2",
        parentPosition: "4"
    },
    "a2-5": {
        anomeric: "α",
        childPosition: "2",
        parentPosition: "5"
    },
    "a2-6": {
        anomeric: "α",
        childPosition: "2",
        parentPosition: "6"
    },
    "a2-7": {
        anomeric: "α",
        childPosition: "2",
        parentPosition: "7"
    },
    "a2-8": {
        anomeric: "α",
        childPosition: "2",
        parentPosition: "8"
    },

};

export let translateAnomeric = (anomeric: string): string => {
    if (anomeric === "a" || anomeric === "α") return "α";
    else if (anomeric === "b" || anomeric === "β") return "β";
    else { return "undefined"; }
};