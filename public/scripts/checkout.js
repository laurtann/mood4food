

$(document).ready(function() {
  let quantityValue = parseInt($("#qty").text());

  $("#plus").click(function() {
    quantityValue += 1;
    $("#qty").text(String(quantityValue));
  });

  $("#minus").click(function() {
    if (quantityValue > 0) {
      quantityValue -= 1;
    }
    $("#qty").text(String(quantityValue));
  });

  $("#remove").click(function() {
    quantityValue = 0;
    $("#qty").text(String(quantityValue));
  });
});
