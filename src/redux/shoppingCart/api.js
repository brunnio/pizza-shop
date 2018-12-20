import axios from 'axios';

const axiosWaldoPizzaGraphQL = axios.create({
    baseURL: 'http://core-graphql.dev.waldo.photos/pizza',
})

const GET_PIZZA_SIZES_QUERY = `
{
    pizzaSizes {
        name
        maxToppings
        basePrice
        toppings {
            defaultSelected
            topping {
                name
                price
            }
        }
    }
}
`;

export function getPizzaSizes(callback) {
    axiosWaldoPizzaGraphQL.post('', { query: GET_PIZZA_SIZES_QUERY })
    .then(data => callback(true, data))
    .catch((error) => callback(false, null, error));
}