//@flow
"use strict";

export function getColor(color: string): string  {
    switch (color) {
        case "white": return "#FFFFFF";
        //case "blue": return "#0090BC";
        case "blue": return "#0071BC";
        case "green": return "#00A651";
        case "yellow": return "#FFD400";
        case "orange": return "#F47920";
        case "pink": return "#F69EA1";
        case "purple": return "#A54399";
        case "light_blue": return "#8FCCE9";
        case "brown": return "#A17A4D";
        case "red": return "#ED1C24";
        case "black": return "#000000";
        default: return "#000000";
    }
}