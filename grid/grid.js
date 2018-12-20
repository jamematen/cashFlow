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
const moment = require('moment')


const db = require('./../data/db')
//const gastos = require('./../data/gastos').gastos


//var getSubcatNameFromBBDD = datasource.getSubcatNameFromBBDD





var columns = [
    {
        name: "Id", field: "Id", id: "Id", width: 60, resizable: false
        , headerCssClass: "prKeyHeadColumn", cssClass: "numericCell", editor: Slick.Editors.Text
        , sortable: true
    },
    {
        name: "Fecha", field: "Fecha", id: "Fecha", width: 120, resizable: true, formatter: DateFormatter
        , headerCssClass: "headColumn", editor: Slick.Editors.Data
        , sortable: true
    },
    {
        name: "Importe", field: "Importe", id: "Importe", width: 100, minWidth: 50, maxWidth: 200
        , headerCssClass: "headColumn", editor: Slick.Editors.Integer, formatter: Slick.Formatters.CurrencyFormatter
        , sortable: true
    },
    {
        name: "Concepto", field: "Concepto", id: "Concepto", width: 80, minWidth: 60, maxWidth: 120
        , headerCssClass: "headColumn", editor: Slick.Editors.Text
    },
    {
        name: "Cuenta", field: "Cuenta", id: "Cuenta", width: 110, minWidth: 80, maxWidth: 170
        , headerCssClass: "headColumn", cssClass: "numericCell", editor: Slick.Editors.Text, sortable: true
    },
    {
        name: "Notas", field: "Notas", id: "Notas", width: 110, minWidth: 80, maxWidth: 170
        , headerCssClass: "headColumn", cssClass: "numericCell", editor: Slick.Editors.Text, sortable: true
    }
];



var options = {
    editable: true,
    enableAsyncPostRender: true,
    asyncPostRenderDelay: 10,
    multiColumnSort: true,
    syncColumnCellResize: true
};


function DateFormatter(rowIndex, cell, value, columnDef, grid, dataProvider) {
    if (value == null || value === "") { return "-"; }
    return moment(value).format("YYYY-MM-DD")
}




$(function () {



    var dataProvider = new Slick.Data.DataView();
    var desde = moment("06/01/2018").format("YYYY-MM-DD")
    var hasta = moment("07/01/2018").format("YYYY-MM-DD")

    //{$and : [{"Fecha": {$gte: desde}}, {"Fecha": {$lt: hasta}}]    }

    db.gastos.find(  {$and : [{"Fecha": {$gte: desde}}, {"Fecha": {$lt: hasta}}]} )

        .then((docs) => {
            docs.map((doc) => {

                doc.Fecha = moment(doc.Fecha);
            })

            //db.gastos2.insert(docs)
            dataProvider.setItems(docs, "Id")
        })

        .catch((err) => console.log(err))







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

