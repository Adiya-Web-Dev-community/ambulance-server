const app = require('./app')

//mongo connection
const mongoose = require('mongoose')
mongoose.set("strictQuery", false)
const database_connection = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_URL)
        console.log(`db connection  established ${conn.connection.host}`)
    } catch (err) {
        console.log(`mongo connection failed ${err.message}`)
    }
}
database_connection();

app.listen(process.env.PORT, () => {
    console.log(`server initialised at ${process.env.PORT}`)
})