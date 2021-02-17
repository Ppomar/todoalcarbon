var menu = 
    [
        { Nombre: "Sencilla", Descripcion: "Pan con carne, verduras y adereso", Precio: 45.00 },
        { Nombre: "Doble", Descripcion: "Pan con doble carne, verduras y adereso", Precio: 65.00 },
        { Nombre: "Hawaiana", Descripcion: "Pan con carne, piña, verduras y adereso cebolla", Precio: 45.00 },
        { Nombre: "Arrachera", Descripcion: "Pan con carne de arrachera, verduras y adereso", Precio: 65.00 },
        { Nombre: "Ranchera", Descripcion: "Pan con carne, verduras, pepino, aguacate y adereso", Precio: 45.00 }
    ];

var $tableData = null;
var $total = 0;

$(document).ready( function () {    
    $tableData = $("#tblSales").DataTable({ 
        bLengthChange: false,
        paging: false,
        searching: false,
         "language":
            {
                "lengthMenu": "Mostrar _MENU_ entradas",
                "info": "Registros del _START_ al _END_ de un total de _TOTAL_",
                "infoEmpty": "Mostrando 0 de 0 de un total de 0 entradas",
                "emptyTable": "No hay datos en la tabla",
                "infoFiltered": "(Filtradas de un total de _MAX_ registros)",
                "search": "Buscar:",
                "paginate": {
                    "next": "Siguiente",
                    "previous": "Anterior"
                }
            },
       data: menu,
       columns:[
           {
                sortable: false,
                "render": function ( data, type, full, meta ) 
                {                     
                    return "<div class='quantity'><input type='number' class='qnumber' min='0' max='10' step='1'  value='0' /></div> "
                }                                                    
           },
           { "data": "Precio" },
           { "data": "Nombre" },
           { "data": "Descripcion" }
       ]
    });

    $('#tblSales tbody').on('input', '.qnumber', function(){
        var regex = /^([1-9]|10|11 )$/;
        var val = $(this).val();

        $total = 0;
        if(regex.test(val))
        {                    
            $("#tblSales tbody > tr").each(function(index) {
               var cantidad = Number($(this).find('.qnumber').val());            
               var data = $tableData.row($(this)).data();
               $total += cantidad * data.Precio;           
           });                      
        }
        else{
            $(this).val(0);
            $("#tblSales tbody > tr").each(function(index) {
                var cantidad = Number($(this).find('.qnumber').val());            
                var data = $tableData.row($(this)).data();
                $total += cantidad * data.Precio;           
            });            
        }        
        
        $('#txtTotal').val($total);
    });

    $('<div class="quantity-nav"><div class="quantity-button quantity-up">+</div><div class="quantity-button quantity-down">-</div></div>').insertAfter('.quantity input');
    $('.quantity').each(function() {
      var spinner = $(this),
        input = spinner.find('input[type="number"]'),
        btnUp = spinner.find('.quantity-up'),
        btnDown = spinner.find('.quantity-down'),
        min = input.attr('min'),
        max = input.attr('max');

      btnUp.click(function() {
        var oldValue = parseFloat(input.val());
        if (oldValue >= max) {
          var newVal = oldValue;
        } else {
          var newVal = oldValue + 1;
        }
        spinner.find("input").val(newVal);
        spinner.find("input").trigger("input");
      });

      btnDown.click(function() {
        var oldValue = parseFloat(input.val());
        if (oldValue <= min) {
          var newVal = oldValue;
        } else {
          var newVal = oldValue - 1;
        }
        spinner.find("input").val(newVal);
        spinner.find("input").trigger("input");
      });

    });

    $('#btnBuy').click(function(){
        var total = $('#txtTotal').val();

        if(total != 0 )
        {
            var $pedido = "";
            $total = 0;

            $("#tblSales tbody > tr").each(function(index) {
                var cantidad = Number($(this).find('.qnumber').val());            
                var data = $tableData.row($(this)).data();                

                $total += cantidad * data.Precio;   
                
                if(cantidad > 0){
                    $pedido += "\nHamburguesa: " + data.Nombre + "| Cantidad: " + cantidad;
                }                
            });                    


            swal({
                title: "¡Total a pagar: $" + $total + "!",
                text: "¡Echa un vistazo a tu pedido, por favor!" + $pedido ,
                icon: "warning",
                buttons: true,
                dangerMode: false,
              })
              .then((willDelete) => {
                if (willDelete) {                    
                    FinishProcess();
                    swal("¡Tu pedido se generó correctamente!", {
                        icon: "success",
                    });                    
                }
              });
        }
        else
        {
            swal("Uuups!", "¡Elige por lo menos una hamburguesa!", "warning");
        }
    });           
});

function FinishProcess()
{
    $("#tblSales tbody > tr").each(function(index) {
        $(this).find('.qnumber').val(0);                                    
    });
    $('#txtTotal').val(0);
    
    $('#btnCloseSales').trigger('click');
}