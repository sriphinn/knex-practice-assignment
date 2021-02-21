require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL
})

// Get all items that contain text
function searchByProduceName(searchTerm) {
    knexInstance
        .select('key_id', 'name', 'price', 'category')
        .from('shopping_list')
        .where('name', 'ILIKE', `%${searchTerm}%`)
        .then(result => {
            console.log(result)
        })
    }
// searchByProduceName('fish')

// Get all items paginated
function paginateProducts(page) {
    const productsPerPage = 6
    const offset = productsPerPage * (page - 1)
    knexInstance
        .select('key_id', 'name', 'price', 'category')
        .from('shopping_list')
        .limit(productsPerPage)
        .offset(offset)
        .then(result => {
            console.log(result)
        })
}
// paginateProducts(2)

function productsAddedDaysAgo(daysAgo) {
    knexInstance
        .select('key_id', 'name', 'price', 'date_added', 'checked', 'category')
        .count('shopping_list')
        .where(
            'date_viewed',
            '>',
            knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
        )
        .then(result => {
            console.log(result)
        })
}

// productsAddedDaysAgo(10)

function costPerCategory() {
    knexInstance
        .select('category')
        .sum('price as total')
        .from('shopping_list')
        .groupBy('category')
        .then (result => {
            console.log('COST PER CATEGORY', result)
        })
}
costPerCategory()