window.$ = window.jQuery = require('../node_modules/jquery/dist/jquery.min.js')


require("../node_modules/jquery-ui-dist/jquery-ui.min.js")
require('../Scripts/jquery.event.drag-2.2.js')
require('../Scripts/slick.core.js')
require('../Scripts/slick.grid.js')
var formatters = require('../Scripts/gridformatters.js')
var datasource = require('../data/productdatasource')
var products = datasource.products
var ColorFormatter = formatters.ColorFormatter
var CurrencyFormatter = formatters.CurrencyFormatter
var SubcategoryNameFormatter = formatters.SubcategoryNameFormatter





var columns = [
    { name: "ID", field: "ProductID", id: "ProductID", sortable: true,  width: 60, resizable: false 
    , headerCssClass: "prKeyHeadColumn", cssClass: "numericCell" },
    { name: "Nº Producto", field: "ProductNumber", id: "ProductNumber", width:120, resizable: false 
    , headerCssClass: "headColumn"},
    { name: "Denominación", field: "Name", id: "Name", width: 250, minWidth: 150, maxWidth: 400
    , headerCssClass: "headColumn"},
    { name: "Color", field: "Color", id: "Color",width: 80, minWidth: 60, maxWidth: 120
    , headerCssClass: "headColumn", formatter: ColorFormatter },
    { name: "Precio", field: "StandardCost", id: "StandardCost", width: 110, minWidth: 80, maxWidth: 170  
    , headerCssClass: "headColumn", cssClass: "numericCell", formatter: CurrencyFormatter},
    { name: "Sub", field: "ProductSubcategoryID", id: "ProductSubcategoryID", width: 60, resizable: false 
    , headerCssClass: "headColumn", cssClass: "numericCell"},
    { name: "Subcategoría", field: "ProductSubcategoryID", id: "SubcategoryName", width:200, minWidth: 150, maxWidth: 400
   , headerCssClass: "headColumn", formatter: SubcategoryNameFormatter}
];

$(function () {
    var basicgrid = new Slick.Grid("#FirstGrid", products, columns);

    
    basicgrid.onSort.subscribe(function (e, args) {
        var field = args.sortCol.field;

        products.sort(function (a, b) {
            var result =
                a[field] > b[field] ? 1 :
                a[field] < b[field] ? -1 :
                0;

            return args.sortAsc ? result : -result;
        });

        basicgrid.invalidate();
    });
});