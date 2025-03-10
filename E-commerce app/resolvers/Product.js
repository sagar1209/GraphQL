const { reviews } = require("../db")

exports. Product = {
    category : ({categoryId},args,{db})=>{
        return db.categories.find(category => category.id === categoryId)
    },
    review : ({id},args,{db})=>{
        return db.reviews.filter(review=> review.productId === id);
    }
}