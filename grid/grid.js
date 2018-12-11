window.$ = window.jQuery = require('../node_modules/jquery/dist/jquery.min.js')


require("../node_modules/jquery-ui-dist/jquery-ui.min.js")
require('../Scripts/jquery.event.drag-2.2.js')
require('../Scripts/slick.core.js')
require('../Scripts/slick.grid.js')
require('../Scripts/grideditors')
require('../Scripts/gridformatters')
require('../Scripts/slick.dataview.js')
require('../Scripts/slick.pager.js')
require('../model/movement')

var datasource = require('../data/productdatasource')

var products = datasource.products

var getSubcatNameFromBBDD = datasource.getSubcatNameFromBBDD






var columns = [
    {
        name: "ID", field: "ProductID", id: "ProductID", width: 60, resizable: false
        , headerCssClass: "prKeyHeadColumn", cssClass: "numericCell", editor: Slick.Editors.Text
        , sortable: true
    },
    {
        name: "Nº Producto", field: "ProductNumber", id: "ProductNumber", width: 120, resizable: false
        , headerCssClass: "headColumn", editor: Slick.Editors.Text
        , sortable: true
    },
    {
        name: "Denominación", field: "Name", id: "Name", width: 250, minWidth: 150, maxWidth: 400
        , headerCssClass: "headColumn", editor: Slick.Editors.Text
        , sortable: true
    },
    {
        name: "Color", field: "Color", id: "Color", width: 80, minWidth: 60, maxWidth: 120
        , headerCssClass: "headColumn", formatter: Slick.Formatters.ColorFormatter
        , editor: Slick.Editors.Color
    },
    {
        name: "Precio", field: "StandardCost", id: "StandardCost", width: 110, minWidth: 80, maxWidth: 170
        , headerCssClass: "headColumn", cssClass: "numericCell", formatter: Slick.Formatters.CurrencyFormatter
        , editor: Slick.Editors.Text, sortable: true
    },
    {
        name: "Sub", field: "ProductSubcategoryID", id: "ProductSubcategoryID", width: 60, resizable: false
        , headerCssClass: "headColumn", cssClass: "numericCell", editor: Slick.Editors.Subcategory
        , sortable: true
    },
    {
        name: "Subcategoría", field: "ProductSubcategoryID", id: "SubcategoryName"
        , width: 200, minWidth: 150, maxWidth: 400, headerCssClass: "headColumn"
        , formatter: Slick.Formatters.AsyncSubcategoryNameFormatter, asyncPostRender: getSubcategoryName, cache: {}
    }
];


var options = {
    editable: true,
    enableAsyncPostRender: true,
    asyncPostRenderDelay: 10,
    multiColumnSort: true,
    syncColumnCellResize: true
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

function costFilter(item, args) {
    if (args == null) return true;

    return (item["StandardCost"] >= args.minCost);
}



$(function () {
    var dataProvider = new Slick.Data.DataView();
    dataProvider.setFilter(costFilter);
    var grid = new Slick.Grid("#FirstGrid", dataProvider, columns, options);
    dataProvider.onRowCountChanged.subscribe(function (e, args) {
        grid.updateRowCount();
        grid.render();
    });

    dataProvider.onRowsChanged.subscribe(function (e, args) {
        grid.invalidateRows(args.rows);
        grid.render();
    });

    grid.onCellChange.subscribe(function (e, args) {
        dataProvider.updateItem(args.item.ProductID, args.item);
    });

    dataProvider.setItems(products, "ProductID");

    grid.onSort.subscribe(function (e, args) {
        var comparer, ascending;
        if (args.multiColumnSort) {
            comparer = function (a, b) {
                var cols = args.sortCols;
                for (var i = 0, l = cols.length; i < l; i++) {
                    var field = cols[i].sortCol.field;
                    var sign = cols[i].sortAsc ? 1 : -1;
                    var value1 = a[field], value2 = b[field];
                    var result = (value1 == value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;
                    if (result != 0) {
                        return result;
                    }
                }
                return 0;
            };
        }
        else {
            comparer = function (a, b) {
                return (a[args.sortCol.field] > b[args.sortCol.field]) ? 1 : -1;
            };
            ascending = args.sortAsc;
        }
        dataProvider.sort(comparer, ascending);
    });

    $("#costFilter").change(function (e) {
        var value = $(this).val();
        $("#minCost").text(value);
        dataProvider.setFilterArgs({ minCost: value });
        dataProvider.refresh();
    });

    $("[name=pagesize]").click(function () {
        dataProvider.setPagingOptions(
            {
                pageSize: parseInt($("[name=pagesize]:checked").val())
                , pageNum: 0
            });
    });

    $("#btnPrevious").click(function () {
        var toPage = dataProvider.getPagingInfo().pageNum - 1;
        if (toPage < 0) toPage = 0;
        dataProvider.setPagingOptions({ pageNum: toPage });
    });

    $("#btnNext").click(function () {
        var toPage = dataProvider.getPagingInfo().pageNum + 1;
        var total = dataProvider.getPagingInfo().totalPages;
        if (toPage >= total) toPage = total - 1;
        dataProvider.setPagingOptions({ pageNum: toPage });
    })
    var pager = new Slick.Controls.Pager(dataProvider, grid, $("#SlickPager"));
});

