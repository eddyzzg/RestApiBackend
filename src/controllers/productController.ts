import { Request, Response, NextFunction } from 'express';
import { Product } from '../models/productModel';
import { fetchProduct, fetchProducts } from '../services/productService';

export function getProductById(req: Request<{ id: string }>, res: Response<Product | { error: string }>, next: NextFunction): void {
    const prodId = parseInt(req.params.id, 10); // Konwertujemy string ID na number

    if (isNaN(prodId)) {
        res.status(400).json({ error: 'Invalid product ID format' });
        return;
    }

    fetchProduct(prodId)
        .then((result: Product | undefined) => {
            result ? res.json(result) : res.status(404).json({ error: 'Product not found' })
        })
        .catch((err: unknown) => next(err));
}

export function getProducts(req: Request, res: Response<Product[] | { error: string }>, next: NextFunction): void {
    fetchProducts()
        .then((result: Product[]) => res.json(result))
        .catch((err: unknown) => next(err));
}