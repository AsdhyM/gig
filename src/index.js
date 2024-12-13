
require("dotenv").config();

const {app} = require("./server.js");
const { connectCloudinary } = require("./utils/cloudinary.js");
const { dbConnect } = require("./utils/database.js");




const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    try{ 
        await dbConnect();
        await connectCloudinary();

        console.log("Server is running on port http://localhost:" + PORT);
    } catch (error) {
        console.error("Failed to initialize server:", error);
        process.exit(1);
    }
})
