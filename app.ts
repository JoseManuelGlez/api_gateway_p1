import express, { Application, Request, Response, NextFunction } from "express";
import morgan from "morgan";
import dotenv from 'dotenv';
import { Signale } from "signale";
import proxy from "express-http-proxy";

const app: Application = express();
const signale = new Signale();

dotenv.config();

app.use(morgan('dev'));
const PORT = process.env.PORT || 3000;
const GATEWAY = "api-gateway";

// Configuración de las rutas proxy
app.use('/api/v1/orders/create', proxy('http://localhost:3001/order', { 
    proxyReqPathResolver: function (req: Request) {
        return '/order';
    }
}));

app.use('/api/v1/orders/list', proxy('http://localhost:3001', { 
    proxyReqPathResolver: function (req: Request) {
        return '/order';
    }
}));

app.use('/api/v1/orders-products/create', proxy('http://localhost:3001', {
    proxyReqPathResolver: function (req: Request) {
        return '/ordenes-productos';
    }
}));

app.use('/api/v1/order/update/:id', proxy('http://localhost:3001', {
    proxyReqPathResolver: function (req: Request) {
        return '/order/' + req.params.id;
    }
}));

app.use('/api/v1/products/create', proxy('http://localhost:3002', {
    proxyReqPathResolver: function (req: Request) {
        return '/products';
    }
}));
app.use('/api/v1/products/delete/:id', proxy('http://localhost:3002', {
    proxyReqPathResolver: function (req: Request) {
        return '/products/delete/' + req.params.id;
    }
}));
app.use('/api/v1/products/list', proxy('http://localhost:3002', {
    proxyReqPathResolver: function (req: Request) {
        return '/products';
    }
}));

// Rutas de autenticación

app.listen(PORT, () => {
    signale.success(`Servicio ${GATEWAY} corriendo en http://localhost:${PORT}`);
});
