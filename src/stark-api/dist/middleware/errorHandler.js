export const errorHandler = (err, _req, res, _next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Erro interno do servidor';
    console.error(`[ERROR] ${statusCode} - ${message}`);
    console.error(err.stack);
    res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};
export const notFoundHandler = (req, res, _next) => {
    res.status(404).json({
        success: false,
        error: `Rota não encontrada: ${req.method} ${req.originalUrl}`
    });
};
//# sourceMappingURL=errorHandler.js.map