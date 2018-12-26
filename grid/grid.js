

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
setMonthlyBook = require('../model/accountingBook.js').setMonthlyBook
//setMonthlyData = require('../model/accountingBook.js').setMonthlyData


//const gastos = require('./../data/gastos').gastos


//var getSubcatNameFromBBDD = datasource.getSubcatNameFromBBDD









var options = {
    editable: true,
    enableAsyncPostRender: true,
    asyncPostRenderDelay: 10,
    multiColumnSort: true,
    syncColumnCellResize: true,
    fullWidthRows :true
};


function DateFormatter(rowIndex, cell, value, columnDef, grid, dataView) {
    if (value == null || value === "") { return "-"; }
    return moment(value).format("YYYY-MM-DD")
}




$(function () {


    //col = getMonthlyColumns('2018', 8)

    //console.log(col)

    var groupItemMetadataProvider = new Slick.Data.GroupItemMetadataProvider();
    dataView = new Slick.Data.DataView({
        groupItemMetadataProvider: groupItemMetadataProvider,
        inlineFilters: true
    })


    //var dataView = new Slick.Data.DataView();
    //var desde = moment("2018-9-1").format("YYYY-MM-DD")
    //var hasta = moment("2018-10-1").format("YYYY-MM-DD")

    //var criterio = { $and: [{ "Fecha": { $gte: desde } }, { "Fecha": { $lt: hasta } }] }


    var defaultDate = moment("2018-1-1")
    var currentDate = defaultDate.clone()

    var col = setMonthlyBook(defaultDate, dataView)




    groupByConcepto(dataView)

    var grid = new Slick.Grid("#FirstGrid", dataView, col, options);
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



    

    $("#btnPrevious").click(function () {
       currentDate.subtract('month',1)
       if(currentDate.isBefore(defaultDate)) currentDate = defaultDate.clone()
       col = setMonthlyBook(currentDate, dataView)
       grid.setColumns(col)
    });

    $("#btnNext").click(function () {
        currentDate.add('month',1)
       
        col = setMonthlyBook(currentDate, dataView)
        grid.setColumns(col)
    })
    
});


function groupByConcepto(dataView) {
    dataView.setGrouping({
        getter: "Concepto",
        formatter: function (g) {
            return "Concepto:  " + g.value + "  <span style='color:green'>" + g.count + "</span>";
        },
        aggregators: [
            //new Slick.Data.Aggregators.Avg("percentComplete"),
            
            //new Slick.Data.Aggregators.Sum("Importe"),
            new mySumAggregator("Concepto")
        ],
        collapsed:true,
        aggregateCollapsed: true,
        lazyTotalsCalculation: true
    });
}

function mySumAggregator(field) {
    this.field_ = field;
    
    this.init = function () {
      this.sum_ = null;
    };

    this.accumulate = function (item) {
        //console.log('el val es '+ item.Importe)
      //var obj = item[this.field_];
      var val = item.Importe
      
      if (val != null && val !== "" && val !== NaN) {
        this.sum_ += parseFloat(val);
        
      }
    };

    this.storeResult = function (groupTotals) {
        
      if (!groupTotals.sum) {
        groupTotals.sum = {};
      }
      groupTotals.sum[this.field_] = this.sum_;
      console.log(this.field_)
    }
  }