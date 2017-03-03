var app = angular.module('shoppingCart', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
	.when('/cart', {
  	templateUrl: 'html/product.html'
	})
  .when('/checkout', {
  	templateUrl: 'html/checkout.html'
	})
  .when('/contactus', {
  	templateUrl: 'html/contactus.html'
	})
	.otherwise({
  	redirectTo: '/'
	});
}]);

app.controller('ProductController', ['$scope', '$http', 'cart', function($scope, $http, cart) {
  $scope.shopItem = cart.getItems();
  if(!$scope.shopItem || $scope.shopItem.length == 0) {
    $http.get('list.json').then(function(response) {
      $scope.shopItem = response.data;
      cart.setItems($scope.shopItem);
    });
  };

  // selected items and total value for cart and check out
  $scope.selectedItems = cart.getSelectedItems();
  $scope.checkoutTotal = cart.getSum();


  $scope.addToCart = function(item) {
    item.isInYourCart = true;

    var existingSelectedItem = cart.getSelectedItemById(item.id);
    var found = existingSelectedItem != null;

    // If we didn't find an existing order, add a new one
    if (!found) {
      var newItem = angular.copy(item);
      newItem.quantity = 1;
      cart.addItem(newItem);
    } else {
      cart.updateQuantity(existingSelectedItem, existingSelectedItem.quantity + 1);
    }
    $scope.checkoutTotal = cart.getSum();
  };

  // Add quantity
  $scope.increaseItemAmount = function(item) {
    item.quantity++;
    var existingSelectedItem = cart.getSelectedItemById(item.id);
    cart.updateQuantity(existingSelectedItem, item.quantity);
    $scope.checkoutTotal = cart.getSum();
  };

  $scope.decreaseItemAmount = function(item) {
    item.quantity = item.quantity <= 1 ? 0 : item.quantity - 1;

    // if (item.quantity > 0) { item.addToCart = true; } else { item.addToCart = false; }
    item.addToCart = item.quantity > 0;

    var existingSelectedItem = cart.getSelectedItemById(item.id);
    if (item.quantity == 0) {
      cart.removeSelectedItem(existingSelectedItem);
      $scope.selectedItems.splice($scope.selectedItems.indexOf(item), 1);
    } else {
      cart.updateQuantity(existingSelectedItem, item.quantity);
    }
    $scope.checkoutTotal = cart.getSum();
  };

  // remove item in cart
  $scope.removeItem = function (index) {
    var removedFromCartItem = $scope.selectedItems[index];
    var itemFromList = cart.getItemById(removedFromCartItem.id);
    $scope.shopItem = cart.getItems();
    itemFromList.isInYourCart = false;
    cart.removeSelectedItem(index);
    $scope.checkoutTotal = cart.getSum();
  };

  // remove all item in cart
  $scope.removeAllItem = function() {
    var items = cart.getItems();
    angular.forEach(items, function(item) {
       item.isInYourCart = false;
    });
    $scope.shopItem = cart.getItems();
    $scope.selectedItems = [];
    $scope.checkoutTotal = 0;
    cart.clearAllSelectedItems();
  };
}]);

// Create service to store items
app.service('cart', function() {
  var items = [];
  var selectedItems = [];
  var sum = 0;

  function calculateTotal() {
    var i, item;
    sum = 0;
    for (i = 0; i < selectedItems.length; i++) {
      item = selectedItems[i];
      sum += item.prices * item.quantity;
    }
  }

  return {
    //devide products in 2 lists, list 1: avalable item
    getItems: function(){
      return items;
    },
    setItems: function(value) {
      items = value;
    },

    // list 2: selected item
    // add item into items list
    addItem: function(item) {
      selectedItems.push(item);
      calculateTotal();
    },
    getSelectedItems: function() {
      return selectedItems;
    },
    removeSelectedItem: function(index) {
      if (index > -1) {
        selectedItems[index].quantity = 0;
        selectedItems.splice(index, 1);
      }
      calculateTotal();
    },
    getSum: function() {
      return sum;
    },
    setSum: function(value) {
      sum = value;
    },
    updateQuantity: function(item, quantity) {
      item.quantity = quantity;
      calculateTotal();
    },
    getSelectedItemById: function(itemId) {
      var existingSelectedItem;
      // Search each ordered item for the shopItem to add
      angular.forEach(selectedItems, function(selectedItem) {
        if (selectedItem.id == itemId) { // Found it
          existingSelectedItem = selectedItem;
        }
      });
      return existingSelectedItem;
    },
    getItemById: function(itemId) {
      var existingSelectedItem;
      angular.forEach(items, function(item) {
        if (item.id == itemId) { 
          existingSelectedItem = item;
        }
      });
      return existingSelectedItem;
    },
    clearAllSelectedItems: function() {
      selectedItems = [];
      sum = 0;
    }
  };
})
