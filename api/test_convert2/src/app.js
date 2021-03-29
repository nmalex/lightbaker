import * as RFJS from "renderfarm";
import axios from "axios";
import http from "../node_modules/axios/lib/adapters/http"

console.log(` >> RFJS 2: `, RFJS);
console.log(` >> adapter: `, http);

var client = new RFJS.Client({
    apiKey: "75f5-4d53-b0f4",
    protocol: "https",
    host: "api2.renderfarmjs.com",
    port: 443,
}, axios.create({ adapter: http }));

var workspaceGuid = "55a0bd33-9f15-4bc0-a482-17899eb67af3";

var workgroup = "dev";
var additionalParams = {};

async function main() {

    var session = await client.openSession(workgroup, workspaceGuid, "empty.max");
    console.log(` >> session open: `, session);

    session = await session.refresh();
    console.log(` >> session refreshed: `, session);

    session = await session.close();
    console.log(` >> session closed: `, session);

    await client.close();
}

main()
.then(function() {
    process.exit(0);
})
.catch(function(err){
    console.error(err);
});
