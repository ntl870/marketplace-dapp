// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;

// Create a marketplace to sell and buy items
contract MarketPlace {
    string public name;
    uint public productCount = 0;
    mapping(uint => Product) public products;

    struct Product {
        uint id;
        string name;
        uint price;
        address payable owner;
        bool purchased;
    }

    event ProductCreated(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

    event ProductPurchased(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

    function addProduct(string memory _name, uint price) public payable {
        // require(bytes(_name).length > 0, "Name is required");
        // require(price > 0, "Price must be greater than 0");
        productCount++;
        address payable sender = payable(msg.sender);
        products[productCount] = Product(
            productCount,
            _name,
            price,
            sender,
            false
        );
        emit ProductCreated(productCount, _name, price, sender, false);
    }

    function buyProduct(uint id) public payable {
        Product memory _product = products[id];
        address payable _seller = _product.owner;
        address payable _buyer = payable(msg.sender);

        // require(_product.id > 0 && _product.id <= productCount);
        // require(msg.value >= _product.price * (1 ether));
        // require(!_product.purchased);

        _product.owner = _buyer;
        _product.purchased = true;
        products[id] = _product;
        payable(_seller).transfer(msg.value);

        emit ProductPurchased(
            productCount,
            _product.name,
            _product.price,
            _buyer,
            true
        );
    }
}
