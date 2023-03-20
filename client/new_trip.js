$(document).ready(init);
var hi = [];
function init() {
  $.ajax({// to get list of trip
    url: "/tour",
    success: function (result) {
      hi = result;
    },
    error: function (jqXhr, textStatus, errorThrown) {
      console.log(errorThrown);
    }
  }),


    $.validator.addMethod("space", function (value, element) {
      if (value.indexOf(' ') >= 0) {//to chek that no space ib field
        return false;
      }
      else {
        return true;
      }
    });


  $.validator.addMethod("exsistId", function (value, element) {
    if (checkId(value) > 0) {//check no id exist

      return false;
    }
    else {
      return true;
    }

  });


  // process the form
  $("form[name='user_form']").validate({

    rules: {
      "id_field": {
        exsistId: true,
        space: true,  // custom method
      },
      "start_date_field": {
        required: true,
      },
      "duration_field": {
        required: true,
        digits: true
      },
      "price_field": {
        required: true,
        number: true,

      }
    },
    // Specify validation error messages
    messages: {
      "id_field": {
        space: "enter id without space",
        exsistId: "id already exsist"
      },
      "price_field": {

      }
    }
  });
  $('#user_form').submit(function (event) {
    if (!$("#user_form").valid()) {
      return;
    }
    $.ajax({//creat new trip
      type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
      url: '/tour', // the url where we want to POST
      contentType: 'application/json',
      data: JSON.stringify({
        "_id": $("#id_field").val(),
        "start_date": $("#start_date_field").val(),
        "duration": $("#duration_field").val(),
        "price": $("#price_field").val(),
         
      }),
      processData: false,
      // dataType: 'json', // what type of data do we expect back from the server
      encode: true,
      success: function (data, textStatus, jQxhr) {
        location.href = "/list";
      },
      error: function (jqXhr, textStatus, errorThrown) {
        console.log(errorThrown);
      }
    })
    // stop the form from submitting the normal way and refreshing the page
    event.preventDefault();
  });
}
function checkId(val) {
  var flag = 0;
  for(i=0;i<hi.length;i++)
 // $.each(hi, function (index, value) {
    if (val ==hi[i]._id) {
      flag = 1;

    }
 // })
  return flag;
}


