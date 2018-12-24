

var moment = require('moment')
const db = require('./../data/db')

var getMonthlyColumns =  function (y, mon) {
    temp = moment(y).month(mon)
    console.log(temp.format("DD/MM/YY"))
    columns = []
    firstWeek = temp.isoWeek()
    temp.add(1,'months').subtract(1,'day')
    lastWeek =  temp.isoWeek()
    temp = moment(y).month(mon)
    numberOfWeeks = lastWeek - firstWeek +1

    console.log(firstWeek + ' '+ lastWeek)
    //numberOfDays =    temp.daysInMonth()
    temp.subtract(7,'days')
    console.log(temp.format("DD/MM/YY"))
    for (i = 0; i < numberOfWeeks +1 ; i++) {
        col = {}
        var from,to
        // if is the first week then the column from the first day of month
        if(i==1)
            from = moment(y).month(mon).format('DD/MM')
        else
            from = temp.startOf('isoWeek').format('DD/MM')

        if(i == numberOfWeeks)
            to = moment(y).month(mon).endOf('month').format('DD/MM')
        else
            to = temp.endOf('isoWeek').format('DD/MM')

        name =  temp.add(7,'days').format('WW')
        i == 0 ? col.name = 'Concepto: ':col.name = 'Del  ' +  from  +' al '+   to
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

    return   value.Fecha.format('DD/MM') + ' ' +value.Notas+' '+value.Importe+'€' 
}

module.exports.getMonthlyColumns= getMonthlyColumns
module.exports.setMonthlyData = setMonthlyData