const updateCartTotal = () => {
  let itemTotals = document.getElementsByClassName("item-total");
  let total = 0;
  for (let itemTotal of itemTotals) {
    const price = parseFloat(itemTotal.innerText.replace('$', ''));
    total += price;
  }
  return total;
}

const addToOrder = () => {
  queryArray = [];
  const foodId = document.getElementsByClassName("food-id");
  const foodQty = document.getElementsByClassName("qty");

  for (let i = 0; i < foodQty.length; i++) {
    if (Number(foodQty[i].innerText) !== 0) {
      queryArray.push([1, 1, Number(foodId[i].innerText), Number(foodQty[i].innerText), "ip"]);
    }
  }
  return queryArray;
}

let queryObj = {};
const addToCart = () => {

  const foodId = document.getElementsByClassName("food-name");
  const foodQty = document.getElementsByClassName("qty");

  for (let i = 0; i < foodQty.length; i++) {
    if (foodQty[i].innerText !== "0") {
      queryArray.push([1, 1, Number(foodId[i].innerText), Number(foodQty[i].innerText), "ip"]);
    }
  }
  return queryArray;
}

const addToCart = () => {
  const foodItem =
  `
  <p>Name: ${}, Quanity: ${}, Price/Item: ${}<p/>
  `
  return foodItem;
}

let addFoodToOrder;
$(document).ready(function() {


  $(".plus").click(function() {
    let quantity = $(this).parent().siblings(".qty");
    let quantityValue = parseInt($(quantity).text());

    let costPerItem = $(this).parent().siblings(".item-cost").text();
    let totalItemCost = $(this).parent().siblings(".item-total");

    let itemCost = Number(costPerItem.replace(/[\.$]+/g, ""));

    quantityValue += 1;
    let totalCost = itemCost * quantityValue;

    $(quantity).text(String(quantityValue));
    $(totalItemCost).text("$" + String(totalCost));

    const tax = updateCartTotal() * .15;
    const grandTotal = updateCartTotal() + tax;
    $(".order-total").text("$" + updateCartTotal());
    $(".order-tax").text("$" + tax.toFixed(2));
    $(".order-grand-total").text("$" + grandTotal.toFixed(2));
  });

  $(".minus").click(function() {
    let quantity = $(this).parent().siblings(".qty");
    let quantityValue = parseInt($(quantity).text());

    let costPerItem = $(this).parent().siblings(".item-cost").text();
    let totalItemCost = $(this).parent().siblings(".item-total");

    let itemCost = Number(costPerItem.replace(/[\.$]+/g, ""));
    if (quantityValue > 0) {
      quantityValue -= 1;
    }
    let totalCost = itemCost * quantityValue;
    $(quantity).text(String(quantityValue));
    $(totalItemCost).text("$" + String(totalCost));

    const tax = updateCartTotal() * .15;
    const grandTotal = updateCartTotal() + tax;
    $(".order-total").text("$" + updateCartTotal());
    $(".order-tax").text("$" + tax.toFixed(2));
    $(".order-grand-total").text("$" + grandTotal.toFixed(2));
  });

  $(".remove").click(function() {
    let quantity = $(this).parent().siblings(".qty");
    let totalItemCost = $(this).parent().siblings(".item-total");

    $(quantity).text("0");
    $(totalItemCost).text("$0");

    const tax = updateCartTotal() * .15;
    const grandTotal = updateCartTotal() + tax;
    $(".order-total").text("$" + updateCartTotal());
    $(".order-tax").text("$" + tax.toFixed(2));
    $(".order-grand-total").text("$" + grandTotal.toFixed(2));
  });

  $("#confirm").click(function() {
    addFoodToOrder = addToOrder();
    console.log(addFoodToOrder);
  });
});

// module.exports = { addFoodToOrder };




