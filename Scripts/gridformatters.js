﻿window.$ = window.jQuery = require('../node_modules/jquery/dist/jquery.min.js')

var datasource = require('../data/productdatasource')
var subcategories = datasource.subcategories


window.$.extend(true, window, {
    "Slick": {
        "Formatters": {
            "ColorFormatter": ColorFormatter,
            "CurrencyFormatter": CurrencyFormatter,
            "SubcategoryNameFormatter": SubcategoryNameFormatter
        }
    }
});

function ColorFormatter(row, cell, value, columnDef, dataContext) {
    if (value == null || value == "")
        return null;
    else {
        var color;
        switch (value) {
            case "Black":
                color = "#000000";
                break;
            case "Red":
                color = "#ee0000";
                break;
            case "White":
                color = "#ffffff";
                break;
            case "Blue":
                color = "#0000ee";
                break;
            case "Gray":
                color = "#808080";
                break;
            case "Silver":
                color = "#c0c0c0c";
                break;
            case "Yellow":
                color = "#ffff00";
                break;
            case "Multi":
            case "Silver/Black":
            case null:
                return value;
                break;
            default:
                color = value;
        }
        return "<div style=\"width:80%; height:80%; background-color:" +
            color + "; border:solid 1px black\"></div>";
    }
}

function CurrencyFormatter(row, cell, value, columnDef, dataContext) {
    if (value == null)
        return "";
    else
        return value.toLocaleString() + " &euro;";
}

function SubcategoryNameFormatter(row, cell, value, columnDef, dataContext) {
    if (value == null) return "";

    var name;
    for (var subcat in subcategories) {
        if (value == subcategories[subcat].ProductSubcategoryID)
            return subcategories[subcat].Name;
    }
    return "";
}




