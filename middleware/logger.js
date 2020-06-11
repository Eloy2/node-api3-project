module.exports = () => {
    return (req, res, next) => {
        const time = new Date().toISOString()
        console.log(`[${time} IP:${req.ip} METHOD:${req.method} URL:${req.url}]`)
        next()
    }
}