import { get, Product, getAll } from '../models/productModel';

/**
 * @returns {Promise<Product>} Promise z listą połączonych przedmiotów.
 */
export async function fetchProduct(id: number): Promise<Product> {
    try {
        return await get(id);
    } catch (err: unknown) {
        console.error('Error in productService.getProduct:', err);
        throw err;
    }
}

/**
 * @returns {Promise<Product[]>} Promise z listą połączonych przedmiotów.
 */
export async function fetchProducts(): Promise<Product[]> {
    try {
        return await getAll();
    } catch (err: unknown) {
        console.error('Error in productService.getProduct:', err);
        throw err;
    }
}