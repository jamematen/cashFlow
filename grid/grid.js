

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
const book = require('./../model/book')

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


$(function () {

    var defaultDate = moment("2018-1-1")
    var currentDate = defaultDate.clone()
    var columns = []
    var groupItemMetadataProvider = new Slick.Data.GroupItemMetadataProvider();
    
    $('#Fecha').text(currentDate.format('MM-YYYY'))
    dataView = new Slick.Data.DataView({
        groupItemMetadataProvider: groupItemMetadataProvider,
        inlineFilters: true
    })



    //groupByConcepto(dataView)
   

    var grid = new Slick.Grid("#FirstGrid", dataView, columns, options);

    book.setMonthlyBook( grid, defaultDate)

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

        if(currentDate.isBefore(defaultDate)){
            currentDate = defaultDate.clone()
            return
        }

              
       book.setMonthlyBook(grid,currentDate)
       $('#Fecha').text(currentDate.format('MM-YYYY'))
    });

    $("#btnNext").click(function () {
        currentDate.add('month',1)
       
        book.setMonthlyBook(grid,currentDate)
        $('#Fecha').text(currentDate.format('MM-YYYY'))
    })
    
});







  

