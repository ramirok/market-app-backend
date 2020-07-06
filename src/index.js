const app = require("./App");
const config = require("./utils/config");

app.listen(config.PORT, () => console.log(`Server is up in ${config.PORT}`));
