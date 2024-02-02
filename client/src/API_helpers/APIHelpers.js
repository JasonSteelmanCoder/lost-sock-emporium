const fetchAllProducts = async () => {
        try {
            const response = await fetch('http://localhost:3001/products');
            const data = await response.json();
            return data;
        } catch (err) {
            console.log(err);
        }
};

export { fetchAllProducts };