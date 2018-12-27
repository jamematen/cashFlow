const db = require('./../data/db')
const moment = require('moment')

book = {}
book.aggregators = []
book.setMonthlyBook = function (grid, date) {
   
    date = date.startOf('month')
    columns = getMonthlyColumns(date.clone())
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

    grid.setColumns(columns)
    grid.setData(dataView)
    console.log(book.aggregators)
    groupByConcepto(dataView,book.aggregators)
}

var getMonthlyColumns = function (dat) {
    date = dat.startOf('month')
    temp = date.clone()
    console.log(temp.format('MM/DD'))
    columns = []
    firstWeek = temp.isoWeek()
    temp.add(1, 'months').subtract(1, 'day')
    lastWeek = temp.isoWeek()
    temp = date.clone()
    numberOfWeeks = lastWeek - firstWeek + 1
    book.aggregators =[]
    
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
            book.aggregators.push(new mySumAggregator("Concepto"))
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

        console.log('from = ' + from + 'to = '+ to)
        name = temp.format('W')
        console.log('name = ' + name)
        column.name = 'Del  ' + from + ' al ' + to
        column.width = 150
        column.field = name
        column.id = name
        column.resizable = true
        column.headerCssClass = "prKeyHeadColumn"
        //column.cssClass = "numericCell"
        column.editor = Slick.Editors.Text
        column.sortable = false
        column.formatter = accountMovementFormatter
        column.groupTotalsFormatter = sumTotalsFormatter


        book.aggregators.push(new mySumAggregator(name))
        columns.push(column)
        temp.add(7, 'days')
    }

    return columns

}

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

function conceptFormatter(row, cell, value, columnDef, dataContext) {

    return "";


}
function accountMovementFormatter(row, cell, value, columnDef, dataContext) {
    if (value == null || value == "")
        return "";

    return value.Fecha.format('DD/MM') + ' ' + value.Notas + ' ' + value.Importe + '€'
}

function groupByConcepto(dataView,aggr) {
    dataView.setGrouping({
        getter: "Concepto",
        formatter: function (g) {
            return "Concepto:  " + g.value + "  <span style='color:green'>" + g.count + "</span>";
        },
        aggregators: aggr/*: [
           
            new mySumAggregator("Concepto")
        ]*/,
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

module.exports = book
