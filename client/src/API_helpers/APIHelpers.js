const fetchAllProducts = async () => {
        try {
            const response = await fetch('http://localhost:3001/products');
            const data = await response.json();
            return data;
        } catch (err) {
            console.log(err);
        }
};

const fetchProductById = async (product_id) => {
    try {
        const response = await fetch(`http://localhost:3001/products/${product_id}`);
        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err);
    }
}

export { fetchAllProducts, fetchProductById };