
const valToString = (qty) => $("#qty").text(String(qty));

$(document).ready(function() {
  let quantityValue = parseInt($("#qty").text());

  $("#plus").click(function() {
    quantityValue += 1;
    valToString(quantityValue);
  });

  $("#minus").click(function() {
    if (quantityValue > 0) {
      quantityValue -= 1;
    }
    valToString(quantityValue);
  });

  $("#remove").click(function() {
    quantityValue = 0;
    valToString(quantityValue);
  });
});
