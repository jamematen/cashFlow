

var moment = require('moment')
const db = require('./../data/db')

var getMonthlyColumns =  function (month) {
    temp = month.clone()
    console.log(temp.format("DD/MM/YY"))
    columns = []
    firstWeek = temp.isoWeek()
    temp.add(1,'months').subtract(1,'day')
    lastWeek =  temp.isoWeek()
    temp = month.clone()
    numberOfWeeks = lastWeek - firstWeek +1

    console.log(firstWeek + ' '+ lastWeek)
    
    console.log(temp.format("DD/MM/YY"))
    for (i = 0; i < numberOfWeeks +1 ; i++) {
        col = {}
        var from,to

        if(i==0){
            col.name = 'Concepto: '
            col.width = 250 
            col.cssClass = "conceptoClass"
            columns.push(col)
            //temp.add(7,'days')
            continue
        }
        // if is the first week then the column from the first day of month
        if(i==1)
            from = month.format('DD/MM')
        else
            from = temp.startOf('isoWeek').format('DD/MM')

        if(i == numberOfWeeks)
            to = month.endOf('month').format('DD/MM')
        else
            to = temp.endOf('isoWeek').format('DD/MM')

        name =  temp.format('W')
        console.log('name = '+ name)
        col.name = 'Del  ' +  from  +' al '+   to
        col.width = 150
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
        temp.add(7,'days')
    }

    return columns

}


var setMonthlyData =  function (criterion, dataView) {
   

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

function setMonthlyBook(data, dataView){
    var columns =  getMonthlyColumns(data.clone())
    var from = data.format("YYYY-MM-DD")
    var to = data.clone().add(1,'month').format("YYYY-MM-DD")
    console.log(from +'  ' + to)

    var criterion  = { $and: [{ "Fecha": { $gte: from } }, { "Fecha": { $lt: to } }] }

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
    
        return columns
}
module.exports.setMonthlyBook= setMonthlyBook
//module.exports.setMonthlyData = setMonthlyData