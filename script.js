// script.js (modificado)

document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('productForm');
    const productTable = document.getElementById('productTable').getElementsByTagName('tbody')[0];

    let products = [];

    function saveToGitHub() {
        fetch('http://localhost:3000/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filePath: 'datos/productos.json',
                content: JSON.stringify(products, null, 2)
            })
        })
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    }

    function renderTable() {
        productTable.innerHTML = ''; // Limpiar la tabla antes de renderizar

        products.forEach((product, index) => {
            const row = productTable.insertRow();

            row.innerHTML = `
                <td>${product.name}</td>
                <td>${product.quantity}</td>
                <td>${product.price}</td>
                <td>
                    <button onclick="editProduct(${index})">Editar</button>
                    <button onclick="deleteProduct(${index})">Eliminar</button>
                </td>
            `;
        });
    }

    productForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const quantity = document.getElementById('quantity').value;
        const price = document.getElementById('price').value;

        products.push({ name, quantity, price });

        renderTable();
        saveToGitHub(); // Guardar en GitHub
        productForm.reset();
    });

    window.editProduct = (index) => {
        const product = products[index];
        document.getElementById('name').value = product.name;
        document.getElementById('quantity').value = product.quantity;
        document.getElementById('price').value = product.price;

        products.splice(index, 1); // Eliminar producto para actualizar
        renderTable();
        saveToGitHub(); // Guardar en GitHub
    };

    window.deleteProduct = (index) => {
        products.splice(index, 1);
        renderTable();
        saveToGitHub(); // Guardar en GitHub
    };

    renderTable();
});
