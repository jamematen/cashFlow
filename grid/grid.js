window.$ = window.jQuery = require('../node_modules/jquery/dist/jquery.min.js')


require("../node_modules/jquery-ui-dist/jquery-ui.min.js")
require('../Scripts/jquery.event.drag-2.2.js')
require('../Scripts/slick.core.js')
require('../Scripts/slick.grid.js')


var products = [
    { ProductID: 514, ProductNumber: "SA-M198", Name: "LL Mountain Seat Assembly", Color: null, StandardCost: 98.77 },
    { ProductID: 515, ProductNumber: "SA-M237", Name: "ML Mountain Seat Assembly", Color: null, StandardCost: 108.99 },
    { ProductID: 516, ProductNumber: "SA-M687", Name: "HL Mountain Seat Assembly", Color: null, StandardCost: 145.87 },
    { ProductID: 517, ProductNumber: "SA-R127", Name: "LL Road Seat Assembly", Color: null, StandardCost: 98.77 },
    { ProductID: 518, ProductNumber: "SA-R430", Name: "ML Road Seat Assembly", Color: null, StandardCost: 108.99 },
    { ProductID: 519, ProductNumber: "SA-R522", Name: "HL Road Seat Assembly", Color: null, StandardCost: 145.87 },
    { ProductID: 520, ProductNumber: "SA-T467", Name: "LL Touring Seat Assembly", Color: null, StandardCost: 98.77 },
    { ProductID: 521, ProductNumber: "SA-T612", Name: "ML Touring Seat Assembly", Color: null, StandardCost: 108.99 },
    { ProductID: 522, ProductNumber: "SA-T872", Name: "HL Touring Seat Assembly", Color: null, StandardCost: 145.87 },
    { ProductID: 680, ProductNumber: "FR-R92B-58", Name: "HL Road Frame - Black, 58", Color: "Black", StandardCost: 1059.31 },
    { ProductID: 706, ProductNumber: "FR-R92R-58", Name: "HL Road Frame - Red, 58", Color: "Red", StandardCost: 1059.31 },
    { ProductID: 707, ProductNumber: "HL-U509-R", Name: "Sport-100 Helmet, Red", Color: "Red", StandardCost: 13.09 },
    { ProductID: 708, ProductNumber: "HL-U509", Name: "Sport-100 Helmet, Black", Color: "Black", StandardCost: 13.09 },
    { ProductID: 709, ProductNumber: "SO-B909-M", Name: "Mountain Bike Socks, M", Color: "White", StandardCost: 3.40 },
    { ProductID: 710, ProductNumber: "SO-B909-L", Name: "Mountain Bike Socks, L", Color: "White", StandardCost: 3.40 },
    { ProductID: 711, ProductNumber: "HL-U509-B", Name: "Sport-100 Helmet, Blue", Color: "Blue", StandardCost: 13.09 },
    { ProductID: 712, ProductNumber: "CA-1098", Name: "AWC Logo Cap", Color: "Multi", StandardCost: 6.92 },
    { ProductID: 713, ProductNumber: "LJ-0192-S", Name: "Long-Sleeve Logo Jersey, S", Color: "Multi", StandardCost: 38.49 },
    { ProductID: 714, ProductNumber: "LJ-0192-M", Name: "Long-Sleeve Logo Jersey, M", Color: "Multi", StandardCost: 38.49 },
    { ProductID: 715, ProductNumber: "LJ-0192-L", Name: "Long-Sleeve Logo Jersey, L", Color: "Multi", StandardCost: 38.49 }
];

var products2 = [
    { ProductID: 716, ProductNumber: "LJ-0192-X", Name: "Long-Sleeve Logo Jersey, XL", Color: "Multi", StandardCost: 38.49 },
    { ProductID: 717, ProductNumber: "FR-R92R-62", Name: "HL Road Frame - Red, 62", Color: "Red", StandardCost: 868.63 },
    { ProductID: 718, ProductNumber: "FR-R92R-44", Name: "HL Road Frame - Red, 44", Color: "Red", StandardCost: 868.63 },
    { ProductID: 719, ProductNumber: "FR-R92R-48", Name: "HL Road Frame - Red, 48", Color: "Red", StandardCost: 868.63 },
    { ProductID: 720, ProductNumber: "FR-R92R-52", Name: "HL Road Frame - Red, 52", Color: "Red", StandardCost: 868.63 },
    { ProductID: 721, ProductNumber: "FR-R92R-56", Name: "HL Road Frame - Red, 56", Color: "Red", StandardCost: 868.63 },
    { ProductID: 722, ProductNumber: "FR-R38B-58", Name: "LL Road Frame - Black, 58", Color: "Black", StandardCost: 204.63 },
    { ProductID: 723, ProductNumber: "FR-R38B-60", Name: "LL Road Frame - Black, 60", Color: "Black", StandardCost: 204.63 },
    { ProductID: 724, ProductNumber: "FR-R38B-62", Name: "LL Road Frame - Black, 62", Color: "Black", StandardCost: 204.63 },
    { ProductID: 725, ProductNumber: "FR-R38R-44", Name: "LL Road Frame - Red, 44", Color: "Red", StandardCost: 187.16 },
    { ProductID: 726, ProductNumber: "FR-R38R-48", Name: "LL Road Frame - Red, 48", Color: "Red", StandardCost: 187.16 },
    { ProductID: 727, ProductNumber: "FR-R38R-52", Name: "LL Road Frame - Red, 52", Color: "Red", StandardCost: 187.16 },
    { ProductID: 728, ProductNumber: "FR-R38R-58", Name: "LL Road Frame - Red, 58", Color: "Red", StandardCost: 187.16 },
    { ProductID: 729, ProductNumber: "FR-R38R-60", Name: "LL Road Frame - Red, 60", Color: "Red", StandardCost: 187.16 },
    { ProductID: 730, ProductNumber: "FR-R38R-62", Name: "LL Road Frame - Red, 62", Color: "Red", StandardCost: 187.16 },
    { ProductID: 731, ProductNumber: "FR-R72R-44", Name: "ML Road Frame - Red, 44", Color: "Red", StandardCost: 352.14 },
    { ProductID: 732, ProductNumber: "FR-R72R-48", Name: "ML Road Frame - Red, 48", Color: "Red", StandardCost: 352.14 },
    { ProductID: 733, ProductNumber: "FR-R72R-52", Name: "ML Road Frame - Red, 52", Color: "Red", StandardCost: 352.14 },
    { ProductID: 734, ProductNumber: "FR-R72R-58", Name: "ML Road Frame - Red, 58", Color: "Red", StandardCost: 352.14 },
    { ProductID: 735, ProductNumber: "FR-R72R-60", Name: "ML Road Frame - Red, 60", Color: "Red", StandardCost: 352.14 }
];

var columns = [
    { name: "ID", field: "ProductID", id: "ProductID", sortable: true, width: 80 },
    { name: "Nº Producto", field: "ProductNumber", id: "ProductNumber", width: 150 },
    { name: "Denominación", field: "Name", id: "Name", sortable: true, width: 250 },
    { name: "Color", field: "Color", id: "Color", width: 150 },
    { name: "Precio", field: "StandardCost", id: "StandardCost", sortable: true, width: 150 }
];

$(function () {
    var basicgrid = new Slick.Grid("#FirstGrid", products, columns);

    $("#ChangeAll").click(function () {
        for (var i = 0; i < products.length; i++)
            products[i] = products2[i];

        basicgrid.invalidate();
    });

    $("#ChangeSome").click(function () {
        for (var i = 0; i < 4; i++)
            products[i] = products2[i];

        basicgrid.invalidateRows([0, 1, 2, 3]);
        basicgrid.render();
    });

    basicgrid.onSort.subscribe(function (e, args) {
        var field = args.sortCol.field;

        products.sort(function (a, b) {
            var result =
                a[field] > b[field] ? 1 :
                a[field] < b[field] ? -1 :
                0;

            return args.sortAsc ? result : -result;
        });

        basicgrid.invalidate();
    });
});