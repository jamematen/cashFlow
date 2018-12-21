window.$ = window.jQuery = require('../node_modules/jquery/dist/jquery.min.js')


require("../node_modules/jquery-ui-dist/jquery-ui.min.js")
require('../Scripts/jquery.event.drag-2.2.js')
require('../node_modules/slickgrid/slick.core.js')
require('../node_modules/slickgrid/slick.grid.js')
require('../node_modules/slickgrid/slick.editors.js')
require('../node_modules/slickgrid/slick.formatters.js')
require('../node_modules/slickgrid/slick.dataview.js')
require('../node_modules/slickgrid/controls/slick.pager.js')
//require('../model/movement')
require('../node_modules/slickgrid/slick.groupitemmetadataprovider.js')
require('../node_modules/slickgrid/plugins/slick.cellselectionmodel.js')
require('../node_modules/slickgrid/plugins/slick.cellrangeselector.js')
require('../node_modules/slickgrid/plugins/slick.cellrangedecorator.js')
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
        , sortable: true, groupTotalsFormatter: sumTotalsFormatter
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


function DateFormatter(rowIndex, cell, value, columnDef, grid, dataView) {
    if (value == null || value === "") { return "-"; }
    return moment(value).format("YYYY-MM-DD")
}




$(function () {

    var groupItemMetadataProvider = new Slick.Data.GroupItemMetadataProvider();
    dataView = new Slick.Data.DataView({
        groupItemMetadataProvider: groupItemMetadataProvider,
        inlineFilters: true
    })


    //var dataView = new Slick.Data.DataView();
    var desde = moment("2018-01-01").format("YYYY-MM-DD")
    var hasta = moment("2018-12-31").format("YYYY-MM-DD")

    var criterio = { $and: [{ "Fecha": { $gte: desde } }, { "Fecha": { $lt: hasta } }] }

    db.gastos.find(criterio)

        .then((docs) => {
            docs.map((doc) => {

                doc.Fecha = moment(doc.Fecha);
            })

            //db.gastos2.insert(docs)
            dataView.setItems(docs, "Id")
        })

        .catch((err) => console.log(err))





    groupByConcepto(dataView)

    var grid = new Slick.Grid("#FirstGrid", dataView, columns, options);
    // register the group item metadata provider to add expand/collapse group handlers
    grid.registerPlugin(groupItemMetadataProvider);
    grid.setSelectionModel(new Slick.CellSelectionModel());


    dataView.onRowCountChanged.subscribe(function (e, args) {
        grid.updateRowCount();
        grid.render();
    });

    dataView.onRowsChanged.subscribe(function (e, args) {
        grid.invalidateRows(args.rows);
        grid.render();
    });

    grid.onCellChange.subscribe(function (e, args) {
        dataView.updateItem(args.item.ProductID, args.item);
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
        dataView.sort(comparer, ascending);
    });



    $("[name=pagesize]").click(function () {
        dataView.setPagingOptions(
            {
                pageSize: parseInt($("[name=pagesize]:checked").val())
                , pageNum: 0
            });
    });

    $("#btnPrevious").click(function () {
        var toPage = dataView.getPagingInfo().pageNum - 1;
        if (toPage < 0) toPage = 0;
        dataView.setPagingOptions({ pageNum: toPage });
    });

    $("#btnNext").click(function () {
        var toPage = dataView.getPagingInfo().pageNum + 1;
        var total = dataView.getPagingInfo().totalPages;
        if (toPage >= total) toPage = total - 1;
        dataView.setPagingOptions({ pageNum: toPage });
    })
    var pager = new Slick.Controls.Pager(dataView, grid, $("#SlickPager"));
});
/*
function agrupa(docs){
    var comunes= ["Sueldo Pepe", "Sueldo Ori","Autonomos", "Bancos","Mercaderias", "Gestoria", "Portes"]
    var tienda = [""]
    var grupos = []

    docs.map((doc) => {

        doc.Fecha = moment(doc.Fecha);
    })



}*/

function groupByConcepto(dataView) {
    dataView.setGrouping({
        getter: "Concepto",
        formatter: function (g) {
            return "Concepto:  " + g.value + "  <span style='color:green'>(" + g.count + " items)</span>";
        },
        aggregators: [
            //new Slick.Data.Aggregators.Avg("percentComplete"),
            new Slick.Data.Aggregators.Sum("Importe")
        ],
        aggregateCollapsed: true,
        lazyTotalsCalculation: false
    });
}

function sumTotalsFormatter(totals, columnDef) {
    var val = totals.sum && totals.sum[columnDef.field];
    if (val != null) {
        return "total: " + ((Math.round(parseFloat(val) * 100) / 100));
    }
    return "";
}