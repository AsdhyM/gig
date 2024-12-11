
require("dotenv").config();

const {app} = require("./server.js");
const { dbConnect } = require("./utils/database.js");




const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {

    await dbConnect();

    console.log("Server is running on port http://localhost:" + PORT);
});
