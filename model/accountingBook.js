

var moment = require('moment')
const db = require('./../data/db')

var getMonthlyColumns =  function (y, mon) {
    year = moment(y).month(mon)
    columns = []
    firstWeek = year.week()-2
    year.add(1,'months')
    lastWeek = year.week()+1
    year = moment(y).month(mon)
    numberOfWeeks = lastWeek - firstWeek 

    console.log(firstWeek + ' '+ lastWeek)
    //numberOfDays = year.daysInMonth()
    year.subtract(14,'days')

    for (i = 0; i < numberOfWeeks; i++) {
        col = {}
        name = year.add(7,'days').format('WW')
        i == 0 ? col.name = 'Concepto: ':col.name = 'Del  ' + year.startOf('isoWeek').format('DD/MM') +' al '+ year.endOf('isoWeek').format('DD/MM')
        i == 0 ? col.cssClass = "conceptoClass" : ""
        i == 0 ? col.width = 250 : col.width = 150
        col.field = name
        col.id = name
        col.resizable = true
        col.headerCssClass = "prKeyHeadColumn"
        //col.cssClass = "numericCell"
        col.editor = Slick.Editors.Text
        col.sortable = false
        col.groupTotalsFormatter = sumTotalsFormatter
        col.formatter = accountMovementFormatter
        
        

        columns.push(col)
    }

    return columns

}


var setMonthlyData =  function (criterion, dataView) {
   

    db.gastos.find(criterion)

        .then((docs) => {
            docs.map((doc) => {

                doc.Fecha = moment(doc.Fecha);
                //console.log(doc.Fecha.format('WW'))
                doc[doc.Fecha.format('WW')] = doc
            })
            
            dataView.setItems(docs, "Id")
        })

        .catch((err) => console.log(err))
   
   

}
function getWeeklyColumns(week) {

}

function sumTotalsFormatter(totals, columnDef) {
    var val = totals.sum && totals.sum[columnDef.field];
    if (val != null) {
        return "total: " + ((Math.round(parseFloat(val) * 100) / 100));
    }
    return "";
}
function accountMovementFormatter(row, cell, value, columnDef, dataContext){
    if (value == null || value == "")
            return "";

    return   value.Notas+' '+value.Importe+'€' 
}

module.exports.getMonthlyColumns= getMonthlyColumns
module.exports.setMonthlyData = setMonthlyData