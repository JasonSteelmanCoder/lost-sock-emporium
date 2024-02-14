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

const login = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const formProps = Object.fromEntries(formData);
    const response = await fetch('http://localhost:3001/login', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: formProps.username,
            password: formProps.password
        }),
    });
    return response;
}

const register = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const formProps = Object.fromEntries(formData);
    const response = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: formProps.username,
            password: formProps.password
        })
    });
    return response;
}

export { 
    fetchAllProducts, 
    fetchProductById, 
    login, 
    register, 
};