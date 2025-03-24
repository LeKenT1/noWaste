export const fetchProductData = async (barcode: string) => {
    try {
        const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
        const data = await response.json();
        if (data.status === 1) {
            return data.product.product_name ?? data.product.brands;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching product data:", error);
        return null;
    }
};
