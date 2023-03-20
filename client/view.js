
$(document).ready(init);
var hi = [];
var globalID;
$.validator.addMethod("siteExist", function (value, element) {//check if no trip name exist

  selectElement = document.querySelector('#select1');

  output = selectElement.value;
  var place;
  for (i = 0; i < hi.length; i++) {
    if (hi[i]._id == globalID)
      place = i;
  }

  for (i = 0; i < hi[place].site.length; i++) {
    if (hi[place].site[i].siteID == output) {

      // alert("This site has already been set up on this trip - choose another site")
      return false;
    }

  }
  return true;
});
$.validator.addMethod("exist", function (value, element) {//check if no trip name exist
  var i = 0;
  var len = hi[globalID].sites.length
  for (; i < len; i++) {
    if (hi[globalID].sites[i].name == value) {
      return false;
    }
  }
  return true;
});
$.validator.addMethod("space", function (value, element) {//check if space not exist
  if (value.indexOf(' ') >= 0) {
    return false;
  }
  else {
    return true;
  }
});
$.validator.addMethod("mini", function (value, element) {//Checks if the expiration date is not less than the start date of the coupon
  if ($("#start_date").val() > value) {
    return false;
  }
  else {
    return true;
  }
});
$.validator.addMethod("check_date_cupon_before", function (value, element) {
  for (i = 0; i < hi.length; i++) {
    if (hi[i]._id == globalID) {
      if (value > hi[i].start_date) {//check cupon start before trip begin 
        return false;
      }
      else {
        return true;
      }

    }



  }



});

jQuery.validator.addMethod("lettersonly", function (value, element) {// to check if letter only
  return this.optional(element) || /^[a-z]+$/i.test(value);
}, "Letters only please");


//$('#details').hide();
function init() {

  //to get tours and set them in html
  $('#addSites').hide();
  $('#addCoponid').hide();
  $('#editForm').hide();
  $('#viewHtml').hide();
  $.ajax({
    url: "/tour",

    success: function (result) {
      hi = result;
      //var array = []


      //for (a in result) {
      //array.push([a, result[a]])
      //}
      document.getElementById("addTrip1").addEventListener("mousedown", listenerButtons);//for add trip
      document.getElementById("addTrip2").addEventListener("mousedown", listenerButtons);
      document.getElementById("addSite1").addEventListener("mousedown", listenerButtons);
      document.getElementById("addSite2").addEventListener("mousedown", listenerButtons);
      sortList = sortJSON(hi, "up", "id"); // to sort the list from small to big
      showTable(hi)

    },

    error: function (err) {
      console.log("err", err);
    }
  });
}

function showTable(hi) {//A function that inserts the table in ascending or descending order selected by the user
  var str = '<table id="tableOfCountry"';
  var up = String.fromCharCode(60);
  var down = String.fromCharCode(62);

  str += '<tr>'
  str += '<td><p>' + 'trip' + '</p> <button id="sort_id_up" class="sortButtons">' + up + '</button>';
  str += '<button id="sort_id_down" class="sortButtons">' + down + '</button></td>'
  str += '<td><p>' + 'start' + '</p> <button id="sort_start_up" class="sortButtons">' + up + '</button>';
  str += '<button id="sort_start_down" class="sortButtons">' + down + '</button></td>'
  str += '<td><p>' + 'duration' + '</p> <button id="sort_duration_up" class="sortButtons">' + up + '</button>';
  str += '<button id="sort_duration_down" class="sortButtons">' + down + '</button></td>'
  str += '<td><p>' + 'price' + '</p> <button id="sort_price_up" class="sortButtons">' + up + '</button>';
  str += '<button id="sort_price_down" class="sortButtons">' + down + '</button></td>'
  str += '</tr>'
  for (i = 0; i < hi.length; i++) {
    str += '<tr><td>' + hi[i]._id + '</td>';
    str += '<td>' + hi[i].start_date.substr(0, 10); + '</td>';

    str += '<td>' + hi[i].duration + '</td>';
    str += '<td>' + hi[i].price + '</td>';
    str += ' <td><button value="Deleting trip" class="editTripButtons" id=' + hi[i]._id + '>' + 'Deleting trip' + '</button></td>'
    str += ' <td><button value="Editing details" class="editTripButtons" id=' + hi[i]._id + ' >' + 'Change trip details' + '</button></td>'
    str += ' <td><button value="Adding location" class="editTripButtons" id=' + hi[i]._id + ' >' + 'Add a site' + '</button></td>'
    str += ' <td><button value="To view the route" class="editTripButtons" id=' + hi[i]._id + ' >' + 'To view the route' + '</button></td>'
    str += ' <td><button value="Add discount coupon" class="editTripButtons" id=' + hi[i]._id + '>' + 'Add coupon' + '</button></td>'
    str += ' <td><button value="View coupons" class="editTripButtons" id=' + hi[i]._id + ' >' + 'View existing coupons' + '</button></td></tr>'
  }
  $("#tripDetailes").html(str);//put listeners
  var button_hold_sort = document.getElementsByClassName("sortButtons");

  for (i = 0; i < button_hold_sort.length; i++)
    button_hold_sort[i].addEventListener("mousedown", listenerButtons);

  var button_holders = document.getElementsByClassName("editTripButtons");

  for (i = 0; i < button_holders.length; i++)
    button_holders[i].addEventListener("mousedown", listenerButtons);

}
function sortJSON(arr, upordown, val) {//A method that sorts in order ascends or descends according to the value to be sorted
  var x; var y

  return arr.sort(function (a, b) {
    if (val == "id") {

      x = a._id; y = b._id;
    }
    if (val == "start") {
      x = a.start_date; y = b.start_date;
    }
    if (val == "duration") {
      x = a.duration; y = b.duration;
    }
    if (val == "price") {
      x = a.price; y = b.price;
    }
    if (upordown == "up") {
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    }
    if (upordown == "down") {
      return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    }
  });
}


var listenerButtonsDelete = function (e) {//A method that deletes the coupons if press on delete cupon
  var code = $(this).attr("id");
  var id = globalID;
  $.ajax({
    type: 'DELETE', // define the type of HTTP verb we want to use 
    url: '/tour/' + id + '/' + code, // the url where we want to delete 
    contentType: 'application/json',
    success: function () {
      viewCopon(globalID)//show again the cupon

    },
    error: function (err) {
      console.log("err", err);
    }
  })
}

var listenerButtons = function (e) {
  var id = $(this).attr("id");
  globalID = id;
  $('#addSites').hide();
  $('#addCoponid').hide();
  $('#editForm').hide();
  $('#viewHtml').hide();
  if (id == "sort_id_up") {
    sortList = sortJSON(hi, "up", "id");
    showTable(hi)
  }
  //Handling with the push of a button that sorts the columns in the table
  if (id == "sort_id_down") {
    sortList = sortJSON(hi, "down", "id");
    showTable(hi);
  }
  if (id == "sort_start_up") {
    sortList = sortJSON(hi, "up", "start");
    showTable(hi)
  }
  if (id == "sort_start_down") {
    sortList = sortJSON(hi, "down", "start");
    showTable(hi);
  }
  if (id == "sort_duration_up") {
    sortList = sortJSON(hi, "up", "duration");
    showTable(hi)
  }
  if (id == "sort_duration_down") {
    sortList = sortJSON(hi, "down", "duration");
    showTable(hi);
  }
  if (id == "sort_price_up") {
    sortList = sortJSON(hi, "up", "price");
    showTable(hi)
  }
  if (id == "sort_price_down") {
    sortList = sortJSON(hi, "down", "price");
    showTable(hi);
  }
  //Handles adding a trip or website
  if (id == "addTrip1" || id == "addTrip2") {
    location.href = "/add_trip";
  }
  if (id == "addSite1" || id == "addSite2") {
    location.href = "/add_site";
  }
  //Handles the buttons in the table
  if (e.srcElement.value == "Deleting trip")
    deleteTrip(id);
  if (e.srcElement.value == "Editing details")
    editDetails(id);
  if (e.srcElement.value == "Adding location") {
    addSite(id);
  }
  if (e.srcElement.value == "To view the route") {
    getSites(id);
  }
  if (e.srcElement.value == "Add discount coupon") {

    addCopon(id);
  }
  if (e.srcElement.value == "View coupons") {

    viewCopon(id);
  }

}
function viewCopon(id) {//A method that displays the coupons if you click on this option
 
  $('#viewHtml').show();
  globalID = id;
  var place;
  for (i = 0; i < hi.length; i++) {
    if (hi[i]._id == globalID)
      place = i;
  }
  $.ajax({
    url: '/tour/' + id,
    success: function (result) {
      var txt = "cupons of " + id + ":";
      for (i = 0; i < result.cupon.length; i++) {
        txt += '<li> code: ' + result.cupon[i].code
       if(result.start_date<result.cupon[i].expire_date)
       txt += '-Coupon is no longer valid (the trip has already started)';//if the start date of trip changed
        txt += '<br>percent: ' + result.cupon[i].percent + '<br>start date: ' + result.cupon[i].start_date + '<br>expired date: ' + result.cupon[i].expire_date + '<br></li>';
        txt += '<button value="Deleting site" class="deleteButtons" id=' + result.cupon[i].code + '>delete cupon</button>'

      }
      $("#viewHtml").html(txt);

      var button_holders = document.getElementsByClassName("deleteButtons");

      for (i = 0; i < button_holders.length; i++)//Adds the delete buttons
        button_holders[i].addEventListener("mousedown", listenerButtonsDelete);

    },
    error: function (err) {
      console.log("err", err);
    }
  });


}
function getSites(id) {//A method that shows the sites
  var mySites;
  $.ajax({
    url: '/site',

    success: function (result) {
      mySites = result;
    }
  })
  $('#viewHtml').show();
  var i;
  var j;
  $.ajax({
    url: '/tour/' + id,

    success: function (result) {
      var mylength = result.site.length

      var txt = "";
      txt += "sites of " + id + ":";
      for (i = 0; i < mylength; i++) {
        for (j = 0; j < mySites.length; j++) {
          if (mySites[j]._id == result.site[i].siteID)
            txt += "<li>name: " + mySites[j].name + "<br>country: " + mySites[j].country + "</li>";
        }
      }
      $("#viewHtml").html(txt);

      var button_holders = document.getElementsByClassName("editTripButtons");

      for (i = 0; i < button_holders.length; i++)
        button_holders[i].addEventListener("mousedown", listenerButtons);

    },
    error: function (err) {
      console.log("err", err);
    }
  });


}

function deleteTrip(id) {
  $.ajax({
    type: 'DELETE',
    url: '/tour/' + id,
    contentType: 'application/json',
    success: function () {
      location.href = "/list";
    },
    error: function (err) {
      console.log("err", err);
    }
  })

}
function editDetails(id) {
  $('#editForm').show();
  var start_date_field;
  var duration;
  var price;
  var copon;


  for (i = 0; i < hi.length; i++) {
    if (hi[i]._id == id) {

      start_date_field = hi[i].start_date
      duration = hi[i].duration
      price = hi[i].price
      copon = hi[i].cupon
    }
  }

  document.getElementById("formId").innerHTML = id;
  document.getElementById("start_date_field").value = start_date_field.substr(0, 10)
  document.getElementById("duration_field").value = duration
  document.getElementById("price").value = price
  $("form[name='editTrip']").validate({

    rules: {
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

  });


  $('#editTrip').submit(function (event) {

    if (!$("#editTrip").valid()) {
      return;
    } $.ajax({
      type: 'PUT', // define the type of put verb we want to use (POST for our form)
      url: '/tour/' + id,
      contentType: 'application/json',
      data: JSON.stringify({
        "_id": id,
        "start_date": $("#start_date_field").val(),
        "duration": $("#duration_field").val(),
        "price": $("#price").val(),
        //"sites": sites,
        "cupon": copon
      }),
      processData: false,
      encode: true,
      success: function (data, textStatus, jQxhr) {
        listOfCountries = data;
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
function addSite(id) {

  var sites = []
  $.ajax({
    url: "/site",

    success: function (result) {
      sites = result;
      var str = "";

      for (i = 0; i < sites.length; i++) {
        str += '<option value=' + sites[i]._id + '>' + sites[i].name + '</option>'
      }
      $('#addSites').show();
      document.getElementById("SId").innerHTML = "enter site to " + id;
      document.getElementById("select1").innerHTML = str;
    }
  });
  $("form[name='addSite']").validate({

    rules: {
      "index": {
        required: true,
        digits: true
      },
      "select1": {
        siteExist: true
      }



    },

    messages: {
      "index": {
        digits: "enter an integer positive number "
      },
      "select1": {
        siteExist: "site already exist"
      }

    }
  });


  $('#addSite').submit(function (event) {
    if (!$("#addSite").valid()) {
      return;
    }
    selectElement = document.querySelector('#select1');
    output = selectElement.value;



    $.ajax({
      type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
      url: '/tour/' + id + '/' + $("#index").val(), // the url where we want to POST
      contentType: 'application/json',
      data: JSON.stringify({
        "siteID": output
         }),
      processData: false,
      encode: true,
      success: function (data, textStatus, jQxhr) {
        listOfCountries = data;
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
function addCopon(id) {

  globalID = id;
  document.getElementById("CId").innerHTML = "enter cupon to " + id;

  $('#addCoponid').show();
  $("form[name='addCopon']").validate({

    rules: {
      "cupon_field": {
        required: true,
        space: true,


      },
      "percent_field": {
        number: true,
        required: true
        // custom method
      },
      "start_date": {
        check_date_cupon_before: true,
        required: true,
        space: true,  // custom method
      },
      "expire_date": {
        check_date_cupon_before: true,
        required: true,
        space: true,  // custom method
        mini: true
      }

    },
    messages: {
      // Specify validation error messages
      "cupon_field": {
        space: "enter country without space",
      },
      "start_date": {
        check_date_cupon_before: "the date of cupon not in valid",
      },
      "expire_date": {
        check_date_cupon_before: "the date of cupon not in valid",
        space: "enter country without space",
        mini: "enter a date that big then start date"
      }
    }

  });
  $('#addCopon').submit(function (event) {
    if (!$("#addCopon").valid()) {
     return;
    }
   
    $.ajax({

      type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
      url: '/tour/' + id, // the url where we want to POST
      contentType: 'application/json',
      data: JSON.stringify({
        "code": $("#cupon_field").val(),
        "percent": $("#percent_field").val(),
        "start_date": $("#start_date").val(),
        "expire_date": $("#expire_date").val(),
      }),
      processData: false,
      encode: true,
      success: function (data, textStatus, jQxhr) {
        listOfCountries = data;

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
