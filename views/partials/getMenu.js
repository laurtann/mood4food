$(() => {
  getAllItems().then(function (json) {
    menuItems.addFood(json.properties);
    views_manager.show("food items");
  });
});
