import {runDb} from "./mongoDb";
import {app, port} from "./settings";

const startApp = async () => {
    await runDb()
    app.listen(port, () : void => {
        console.log(`Example app listening on port ${port}`)
    })
}

startApp()