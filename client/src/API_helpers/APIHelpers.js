import { API_ENDPOINT } from "./APIEndpoint";

const fetchAllProducts = async () => {
        try {
            const response = await fetch(`${API_ENDPOINT}/products`, {
                method: "GET",
                credentials: 'include'
            });
            const data = await response.json();
            return data;
        } catch (err) {
            console.log(err);
        }
};

const fetchProductById = async (product_id) => {
    try {
        const response = await fetch(`${API_ENDPOINT}/products/${product_id}`);
        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err);
    }
}

const login = async (event) => {
    const formData = new FormData(event.target);
    const formProps = Object.fromEntries(formData);
    const response = await fetch(`${API_ENDPOINT}/login`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: formProps.username,
            password: formProps.password
        }),
        credentials: 'include',
    });
    return response;
}

const checkLoggedIn = async () => {
    const response = await fetch(`${API_ENDPOINT}/login`, {
        method: 'GET',
        credentials: 'include'
    });
    const data = await response.json();
    return data;
}

const register = async (event) => {
    const formData = new FormData(event.target);
    const formProps = Object.fromEntries(formData);
    if (formProps.password === formProps.confirm) {
        const response = await fetch(`${API_ENDPOINT}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: formProps.username,
                password: formProps.password
            }),
            credentials: 'include',
        });
        const data = await response.json();
        return {
            status: response.status,
            data: data
        };
    } else {
        return {
            status: 400,
            data: "Passwords must match."
        }
    }
}

const logout = async (event) => {
    const response = await fetch(`${API_ENDPOINT}/logout`);
    const data = await response.json();
    return data;
}

export { 
    fetchAllProducts, 
    fetchProductById, 
    login, 
    checkLoggedIn,
    register, 
    logout,
};