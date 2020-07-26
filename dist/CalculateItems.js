"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Item = (function () {
    function Item() {
        this.count = 1;
    }
    Item.prototype.get = function () {
        return this.count;
    };
    Item.prototype.inc = function () {
        this.count++;
    };
    return Item;
}());
var CalculateItems = (function () {
    function CalculateItems() {
        this.items = new Map();
    }
    CalculateItems.prototype.Calculate = function (name) {
        var item = this.items.get(name);
        if (!item) {
            this.items.set(name, new Item());
        }
        else {
            item.inc();
        }
    };
    CalculateItems.prototype.getItemsJSON = function () {
        return JSON.stringify(Array.from(this.items.entries()));
    };
    return CalculateItems;
}());
exports.default = CalculateItems;
