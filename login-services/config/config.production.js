module.exports = {
    server_port: process.env.PORT || 9090,
    session_secret: process.env.SESSION_SECRET || 'AF16A159AD7924E3BAE27BB6633FE',
    redis: {
        host: process.env.REDIS_HOST || 'docker.cdg.co.th',
        port: process.env.REDIS_PORT || 6379,
        expire: 60
    },
    db: {
        url: process.env.DATABASE_URL || 'mongodb://docker.cdg.co.th:27017/test'
    }
};
