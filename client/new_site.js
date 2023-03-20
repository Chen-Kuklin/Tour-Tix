$(document).ready(init);

var hiSite=[];//global sites
function init() {
    $.ajax({// to get list of site
      url: "/site",
      success: function (result) {
        hiSite = result;
        
      },
      error: function (jqXhr, textStatus, errorThrown) {
        console.log(errorThrown);
      }
    })

$.validator.addMethod("existSite", function (value, element) {//check if no trip name exist
    var len=hiSite.length
    var i = 0;
    for (; i < len; i++) {
      if (hiSite[i].name == value) {
        return false;
      }
    }
    return true;
  });

    $.validator.addMethod("space", function (value, element) {
        if (value.indexOf(' ') >= 0) {//to chek that no space ib field
        return false;
      }
      else {
        return true;
      }
    });
    jQuery.validator.addMethod("lettersonly", function (value, element) {// to check if letter only
        return this.optional(element) || /^[a-z]+$/i.test(value);
      }, "Letters only please");


  


  // process the form
  $("form[name='user_form']").validate({

    rules: {
      "name_field": {
        existSite: true,
        required: true,
        space: true,  
      },
      "country": {
        lettersonly: true,
        minlength: 2,
        required: true,
        space: true,  // custom method
      }
      
    },
    // Specify validation error messages
    messages: {
        "name_field": {
            existSite: "this site already exist",
            space: "enter name of site without space",
      },
      "country": {
        lettersonly: "enter correct country",
        space: "enter country without space",
        minlength: "enter correct country",
      }
    }
  });
  $('#user_form').submit(function (event) {
    if (!$("#user_form").valid()) {
      return;
    }
     $.ajax({//creat new trip
      type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
      url: '/site', // the url where we want to POST
      contentType: 'application/json',
      data: JSON.stringify({
        "name": $("#name_field").val(),
        "country": $("#country").val(),
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



