$(document).ready(function() {

  $(".plus").click(function() {
    let quantity = $(this).parent().siblings(".qty");
    let quantityValue = parseInt($(quantity).text());
    quantityValue += 1;
    $(quantity).text(String(quantityValue));
  });

  $(".minus").click(function() {
    let quantity = $(this).parent().siblings(".qty");
    let quantityValue = parseInt($(quantity).text());
    if (quantityValue > 0) {
      quantityValue -= 1;
    }
    $(quantity).text(String(quantityValue));
  });

  $(".remove").click(function() {
    let quantity = $(this).parent().siblings(".qty");
    let quantityValue = parseInt($(quantity).text());
    quantityValue = 0;
    $(quantity).text(String(quantityValue));
  });
});
