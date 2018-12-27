

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


//--------------------------------------------Options------------------------------------------------------------------


//-----Option for grid
var options = {
    editable: true,
    enableAsyncPostRender: true,
    asyncPostRenderDelay: 10,
    multiColumnSort: true,
    syncColumnCellResize: true,
    fullWidthRows :true
};

//----------------------------------------------Formatters---------------------------------------------------------------


//--------------------------Formatter for moment date
function DateFormatter(rowIndex, cell, value, columnDef, grid, dataView) {
    if (value == null || value === "") { return "-"; }
    return moment(value).format("YYYY-MM-DD")
}

function sumTotalsFormatter(totals, columnDef) {
    var val = totals.sum && totals.sum[columnDef.field];
    if (val != null) {
        return "total: " + ((Math.round(parseFloat(val) * 100) / 100));
    }
    return "";
}


function accountMovementFormatter(row, cell, value, columnDef, dataContext) {
    if (value == null || value == "")
        return "";

    return value.Fecha.format('DD/MM') + ' ' + value.Notas + ' ' + value.Importe + '€'
}


function conceptFormatter(row, cell, value, columnDef, dataContext) {

    return "";


}




$(function () {


    var groupItemMetadataProvider = new Slick.Data.GroupItemMetadataProvider();
    
    dataView = new Slick.Data.DataView({
        groupItemMetadataProvider: groupItemMetadataProvider,
        inlineFilters: true
    })


   

    var defaultDate = moment("2018-1-1")
    var currentDate = defaultDate.clone()

    var columns = getMonthlyColumns(defaultDate)

    setMonthlyBook(defaultDate, dataView)




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



    

    $("#btnPrevious").click(function () {
       currentDate.subtract('month',1)
       if(currentDate.isBefore(defaultDate)) currentDate = defaultDate.clone()
       columns = setMonthlyBook(currentDate, dataView)
       grid.setColumns(columns)
    });

    $("#btnNext").click(function () {
        currentDate.add('month',1)
       
        columns = setMonthlyBook(currentDate, dataView)
        grid.setColumns(columns)
    })
    
});


function setMonthlyBook(date, dataView) {
    date = date.startOf('month')
    //var columns = getMonthlyColumns(date.clone())
    var from = date.format("YYYY-MM-DD")
    var to = date.clone().add(1, 'month').format("YYYY-MM-DD")
    console.log(from + '  ' + to)

    var criterion = { $and: [{ "Fecha": { $gte: from } }, { "Fecha": { $lt: to } }] }

    db.gastos.find(criterion)

        .then((docs) => {
            docs.map((doc) => {

                doc.Fecha = moment(doc.Fecha);
                //console.log(doc.Fecha.format('WW'))
                doc[doc.Fecha.isoWeek()] = doc

            })
            console.log(docs)
            dataView.setItems(docs, "Id")
        })

        .catch((err) => console.log(err))

    //return columns
}

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


  var getMonthlyColumns = function (date) {
    date = date.startOf('month')
    temp = date.clone()
    
    columns = []
    firstWeek = temp.isoWeek()
    temp.add(1, 'months').subtract(1, 'day')
    lastWeek = temp.isoWeek()
    temp = date.clone()
    numberOfWeeks = lastWeek - firstWeek + 1

    
    for (i = 0; i < numberOfWeeks + 1; i++) {
        column = {}
        var from, to

        if (i == 0) {
            column.field = 'Concepto'
            column.name = 'Concepto: '
            column.width = 250
            column.cssClass = "conceptoClass"
            column.groupTotalsFormatter = sumTotalsFormatter
            column.formatter = conceptFormatter
            columns.push(column)
            
            continue
        }

        

        // if is the first week then the columns from the first day of month
        if (i == 1)
            from = date.format('DD/MM')
        else
            from = temp.startOf('isoWeek').format('DD/MM')

        if (i == numberOfWeeks)
            to = date.endOf('month').format('DD/MM')
        else
            to = temp.endOf('isoWeek').format('DD/MM')

        name = temp.format('W')
        console.log('name = ' + name)
        columns.name = 'Del  ' + from + ' al ' + to
        columns.width = 150
        columns.field = name
        columns.id = name
        columns.resizable = true
        columns.headerCssClass = "prKeyHeadColumn"
        //columns.cssClass = "numericCell"
        columns.editor = Slick.Editors.Text
        columns.sortable = false
        //columns.groupTotalsFormatter = sumTotalsFormatter
        columns.formatter = accountMovementFormatter



        columns.push(columns)
        temp.add(7, 'days')
    }

    return columns

}

