
//const { Sequelize } = require("sequelize/types");

module.exports = class Cart{
    constructor(produducts,items,price){
        this.products=[];
        this.items=0;
        this.price=0.0;
    }
}

    

/*

const Sequelize = import("sequelize");
const sequelize = import("../utils/database");

const cart = sequelize.define('carts',{

    id : {
        type:Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    no_products:{
        type:Sequelize.INTEGER,
        allowNull:true
    },
    total_cost:{
        type: Sequelize.FLOAT,
        defaultValue : '0.0'
    }    
} )

module.exports = cart;
*/