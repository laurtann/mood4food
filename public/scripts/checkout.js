// Node.js style require
// const axios = require("axios");

let foodNames = document.getElementsByClassName("food-name");
let qty = document.getElementsByClassName("qty");
let grandTotal = document.getElementsByClassName("grand-total").innerText;
// let orderNotes = document.getElementById("text-notes").innerText;

const updateCartTotal = () => {
  let itemTotals = document.getElementsByClassName("item-total");
  let total = 0;
  for (let itemTotal of itemTotals) {
    const price = parseFloat(itemTotal.innerText.replace('$', ''));
    total += price;
  }
  return total;
}


//This works
let checkout = document.getElementById("confirm");

checkout.onclick = function() {
  console.log("working");
}

// const nameAndQuantity = () => {
//   let orderArray = [];
//   for (let i = 0; i < qty.length; i++) {
//     if (Number(qty[i].innerText) !== 0) {
//       orderArray.push(`${foodNames[i].innerText}: ${qty[i].innerText}; `);
//     }
//   }
//   // console.log(orderArray.join(""));
//   // return(orderArray.join(""));
//   console.log(document.getElementById("order-grand-total").innerText);
// };

const generateRandomNumber = () => {
  const random = Math.floor(Math.random() * 1000) + 61;
  return random;
};

const addToOrder = () => {
  queryArray = [];
  const foodId = document.getElementsByClassName("food-id");
  const foodQty = document.getElementsByClassName("qty");

  for (let i = 0; i < foodQty.length; i++) {
    if (Number(foodQty[i].innerText) !== 0) {
      queryArray.push([1, generateRandomNumber(), Number(foodId[i].innerText), Number(foodQty[i].innerText), "ip"]);
    }
  }
  return queryArray;
}

// adapted from w3c
const toggleDescription = () => {
  let coll = document.getElementsByClassName("collapsible");
  let i;

  for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
      this.classList.toggle("active");
      let content = this.nextElementSibling;
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
    });
  }
}

//Will hold arr of arr of order inserts
let addFoodToOrder;

// allows us to access outside of the jq
const addFoodToDbVals = () => {
  console.log(addFoodToOrder);
}

$(document).ready(function() {

  toggleDescription();
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
    $("#order-grand-total").text("$" + grandTotal.toFixed(2));

    // test
    // console.log(nameAndQuantity());

    // const getData = () => {
    //   axios.get('/').then(response =>
    //     console.log(response));
    // };

    // getData();

  //   // test
  //   addFoodToOrder = addToOrder();
  //   addFoodToDbVals();
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
    $("#order-grand-total").text("$" + grandTotal.toFixed(2));
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
    $("#order-grand-total").text("$" + grandTotal.toFixed(2));
  });

  // $("#confirm").click(function() {
  //   addFoodToOrder = addToOrder();
  //   // addFoodToDbVals();
  });



