// YOUR NAME HERE

//Amine ZENNAI

// === constants ===
const MAX_QTY = 9;
const productIdKey = "product";
const orderIdKey = "order";
const inputIdKey = "qte";

// === global variables  ===
// the total cost of selected products 
var total = 0;



// function called when page is loaded, it performs initializations 
var init = function () {
	createShop();
	
	// TODO : add other initializations to achieve if you think it is required
	document.getElementById("filter").addEventListener("keyup", filterProducts);
}
window.addEventListener("load", init);



// usefull functions

/*
* create and add all the div.produit elements to the div#boutique element
* according to the product objects that exist in 'catalog' variable
*/
var createShop = function () {
	var shop = document.getElementById("boutique");
	for(var i = 0; i < catalog.length; i++) {
		shop.appendChild(createProduct(catalog[i], i));
	}
}

/*
* create the div.produit elment corresponding to the given product
* The created element receives the id "index-product" where index is replaced by param's value
* @param product (product object) = the product for which the element is created
* @param index (int) = the index of the product in catalog, used to set the id of the created element
*/
var createProduct = function (product, index) {
	// build the div element for product
	var block = document.createElement("div");
	block.className = "produit";
	// set the id for this product
	block.id = index + "-" + productIdKey;
	// build the h4 part of 'block'
	block.appendChild(createBlock("h4", product.name));
	
	// /!\ should add the figure of the product... does not work yet... /!\ 
	block.appendChild(createFigureBlock(product));

	// build and add the div.description part of 'block' 
	block.appendChild(createBlock("div", product.description, "description"));
	// build and add the div.price part of 'block'
	block.appendChild(createBlock("div", product.price, "prix"));
	// build and add control div block to product element
	block.appendChild(createOrderControlBlock(index));
	return block;
}


/* return a new element of tag 'tag' with content 'content' and class 'cssClass'
 * @param tag (string) = the type of the created element (example : "p")
 * @param content (string) = the html wontent of the created element (example : "bla bla")
 * @param cssClass (string) (optional) = the value of the 'class' attribute for the created element
 */
var createBlock = function (tag, content, cssClass) {
	var element = document.createElement(tag);
	if (cssClass != undefined) {
		element.className =  cssClass;
	}
	element.innerHTML = content;
	return element;
}



/**
 * Updates and displays the total cost of the items in the shopping cart.
 */

var updateTotal = function() {
    total = 0;
    var cartItems = document.querySelectorAll(".achats .achat");
		// Iterate over each cart item to calculate the total
    cartItems.forEach(function(item) {
        var index = parseInt(item.id.split("-")[0]);// Get product index from the item's ID
        var quantityDiv = item.querySelector(".quantite");// Find the quantity div
        var quantity = parseInt(quantityDiv.textContent); // Get the quantity
        var price = parseFloat(catalog[index].price); // Get the product's price

        total += price * quantity;// Calculate total price
    });
	// Display the total cost
    document.getElementById("montant").innerHTML = total.toFixed(2) ;
}


/*
* builds the control element (div.controle) for a product
* @param index = the index of the considered product
*
* TODO : add the event handling, 
*   /!\  in this version button and input do nothing  /!\  
*/
var createOrderControlBlock = function (index) {
    var control = document.createElement("div");
    control.className = "controle";

    var input = document.createElement("input");
    input.id = index + '-' + inputIdKey;
    input.type = "number";
    input.step = "1";
    input.value = "0";
    input.min = "0";
    input.max = MAX_QTY.toString();
    input.addEventListener('change', function() {
        if (input.value=="0"){
            var button = document.getElementById(index + "-order");
            button.style.opacity = '0.5';

        }else{
            var button = document.getElementById(index + "-order");
            button.style.opacity = '1';

        }
        
    });

    var button = document.createElement("button");
    button.className = 'commander';
    button.id = index + "-" + orderIdKey;
    button.addEventListener('click', function() {
        addToCart(index, input.value);
    });

    control.appendChild(input);
    control.appendChild(button);

    return control;
}

/*
* create and return the figure block for this product
* see the static version of the project to know what the <figure> should be
* @param product (product object) = the product for which the figure block is created
*
* TODO : write the correct code
*/


var createFigureBlock = function (product) {
    var figure = document.createElement("figure");
    var img = document.createElement("img");
    img.src = product.image;
    img.alt = product.name;
    figure.appendChild(img);

    return figure;
};


/**
 * Updates the shopping cart display.
 * Clears the current cart contents and repopulates it based on selected quantities.
 */

var updateCart = function() {
    var cart = document.querySelector(".achats");
    cart.innerHTML = ''; // Clear current cart contents

    // Loop through each product in the catalog
    catalog.forEach(function(product, index) {
        var quantityInput = document.getElementById(index + '-' + inputIdKey);
        var quantity = parseInt(quantityInput.value);
		// Add product to the cart if quantity is more than 0
        if (quantity > 0) {
           
			var test=produitsContainer(index, product, quantity)
			 // Append the constructed cart item to the cart
            cart.appendChild(test);
        }
    });
}


/**
 * Removes an item from the shopping cart.
 *
 * This function is triggered when the user clicks the delete button for a cart item.
 * It resets the quantity of the product to zero and updates the cart and total cost.
 *
 **param product index = The index of the product in the catalog.
 */
var removeFromCart = function(index) {
    // Reset the quantity input for this product to zero
    var quantityInput = document.getElementById(index + '-' + inputIdKey);
    quantityInput.value = "0";

    // Update the cart to reflect the removal of the product
    updateCart();

    // Recalculate and update the total cost
    updateTotal();
}



/**
 * Filters products in the shop based on user input.
 *
 * When the user types into the filter input field, this function is called to update the display
 * of products, showing only those that match the entered text.
 */
var filterProducts = function() {
    var filterText = document.getElementById("filter").value.toLowerCase();
    var products = document.getElementsByClassName("produit");

    // Loop through all products and toggle their display based on the filter text
    for (var i = 0; i < products.length; i++) {
        var product = products[i];
        var productName = catalog[i].name.toLowerCase();

        // Show the product if its name includes the filter text, otherwise hide it
        product.style.display = productName.includes(filterText) ? "" : "none";
    }
}


/**
 * Adds a product to the shopping cart or updates its quantity if it's already in the cart.
 * 
 * param {number} index = Index of the product in the catalog.
 * param {number|string} quantity = The quantity to be added to the cart.
 */
var addToCart = function(index, quantity) {
    quantity = parseInt(quantity);
    // Validate the quantity. If invalid, exit the function.
    if (quantity <= 0 || quantity > MAX_QTY) return;

    var cartItem = document.getElementById(index + "-cart");
    // Check if the product is already in the cart
    if (cartItem) {
        // Update the quantity of the existing cart item
    //    cartItem.value = Math.min(parseInt(cartItem.value) + quantity, MAX_QTY);
    } else {
        // Create a new element for the product and add it to the cart
        var product = catalog[index];
        var cart = document.querySelector(".achats");
        cart.appendChild(produitsContainer(index, product, quantity));
    }

    // Update the cart display and the total amount
    updateCart();
    updateTotal();
}




/**
 * Creates a container for a product with all necessary details for display in the cart.
 *
 * param {number} index - The index of the product in the catalog array.
 * param {Object} product - The product object from the catalog.
 * param {number} quantity - The quantity of the product to be added to the cart.
 * return {HTMLElement} The fully constructed product container element.
 */
var produitsContainer = function(index, product, quantity){
    // Create the main container div for the product
    var cartItem = document.createElement("div");
    cartItem.className = "achat";
    cartItem.id = index + "-cart";

    // Create and append a figure element with product image
    var figure = document.createElement("figure");
    var img = document.createElement("img");
    img.src = product.image;
    img.alt = product.name;
    figure.appendChild(img);
    cartItem.appendChild(figure);
    
    // Append product name using createBlock function
    cartItem.appendChild(createBlock("h4", product.name));

    // Append quantity using createBlock function
    cartItem.appendChild(createBlock("div", quantity.toString(), "quantite"));

    // Append price using createBlock function
    cartItem.appendChild(createBlock("div", product.price, "prix"));

    // Create and append a control div with a delete button
    var controle = document.createElement("div");
    controle.className = "controle";
    var removeButton = document.createElement("button");
    removeButton.className = "retirer";
    removeButton.id = index + "-remove";
    removeButton.onclick = function() { removeFromCart(index); }; // Function to handle removal from cart
    controle.appendChild(removeButton);
    cartItem.appendChild(controle);

    return cartItem;
}
