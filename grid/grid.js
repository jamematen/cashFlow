window.$ = window.jQuery = require('../node_modules/jquery/dist/jquery.min.js')


require("../node_modules/jquery-ui-dist/jquery-ui.min.js")
require('../Scripts/jquery.event.drag-2.2.js')
require('../Scripts/slick.core.js')
require('../Scripts/slick.grid.js')
require('../Scripts/grideditors')
require('../Scripts/gridformatters')
var datasource = require('../data/productdatasource')
var dataprovider = require('../data/productsdataprovider')
var products = datasource.products

var getSubcatNameFromBBDD = datasource.getSubcatNameFromBBDD
var ProductsDataProvider = new dataprovider.ProductsDataProvider






var columns = [
    { name: "ID", field: "ProductID", id: "ProductID", width: 60, resizable: false
     , headerCssClass: "prKeyHeadColumn", cssClass: "numericCell" },
    { name: "Nº Producto", field: "ProductNumber", id: "ProductNumber", width: 120, resizable: false
     , headerCssClass: "headColumn" },
    { name: "Denominación", field: "Name", id: "Name", width: 250, minWidth: 150, maxWidth: 400
     , headerCssClass: "headColumn" },
    { name: "Color", field: "Color", id: "Color", width: 80, minWidth: 60, maxWidth: 120
     , headerCssClass: "headColumn" },
    { name: "Precio", field: "StandardCost", id: "StandardCost", width: 110, minWidth: 80, maxWidth: 170
     , headerCssClass: "headColumn", cssClass: "numericCell" },
    { name: "Sub", field: "ProductSubcategoryID", id: "ProductSubcategoryID", width: 60, resizable: false
     , headerCssClass: "headColumn", cssClass: "numericCell" },
    { name: "Subcategoría", field: "ProductSubcategoryID", id: "SubcategoryName"
     , width: 200, minWidth: 150, maxWidth: 400, headerCssClass: "headColumn"
     , asyncPostRender: getSubcategoryName, cache: {} }
   ];


var options = {
    editable: true,
    autoEdit: true,
    enableAsyncPostRender: true,
    asyncPostRenderDelay: 100
};



function getSubcategoryName(cellNode, row, dataContext, colDef) {
    var cell = $(cellNode);
    if (cell.text() !== "Cargando...") return;

    var value = dataContext[colDef.field];
    var name;
    // Comprobamos si el valor existe en la cache
    if (colDef.cache[value] === undefined) {
        name = getSubcatNameFromBBDD(value);
        // Introducimos el valor en la cache
        colDef.cache[value] = name;
    }
    else
        name = colDef.cache[value];

    $(cellNode).text(name);
}


$(function () {
    var basicgrid = new Slick.Grid("#FirstGrid",ProductsDataProvider, columns, options);
    basicgrid.onCellChange.subscribe(ProductsDataProvider.onCellChange);

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