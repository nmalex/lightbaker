const axios = require("axios");

const apiKey = "75f5-4d53-b0f4";
var workspaceGuid = "55a0bd33-9f15-4bc0-a482-17899eb67af3";
const baseUrl = "https://api2.renderfarmjs.com/v1";
const workgroup = "dev";
const maxSceneFilename = "empty.max";
const additonalParams = {};

async function main() {

    var response = await axios.post(baseUrl + '/session', {
        api_key: apiKey,
        workgroup: workgroup,
        workspace_guid: workspaceGuid,
        scene_filename: null,
        //
        debug: additonalParams && additonalParams.debug,
    });
    const session = response.data.data;
    console.log(` >> session: `, session);


    var response2 = await axios.post(baseUrl + '/job/convert', {
        session_guid: session.guid,
        job_type: "convert",
        input_url: "https://api2.renderfarmjs.com/v1/renderoutput/M-1713-1.5S.stp",
        settings: {}
    }, {
        timeout: 15 * 60 * 1000, // 15min timeout
    });

    const job = response2.data.data;
    console.log(" >> job: ", job);

    let i = 50;
    let timer;
    var p = new Promise(function(resolve, reject) {

        timer = setInterval(async function() {
            try {
                let url = baseUrl + '/job/' + job.guid;
                console.log(" >> GET job: ", url);
                var response = await axios.get(url, {});
                console.log(" >> job: ", response.data.data);
                if (response.data.data.closed) {
                    resolve();
                }
            } catch (err) {
                console.log(" >> job err: ", err.message);
                reject();
            }

            i = i - 1;
            if (i <= 0) resolve();

        }, 1000);

    });

    await p;

    var response3 = await axios.delete(baseUrl + '/session/' + session.guid, {});
    console.log(` >> session closed: `, response3.data.data);

    clearInterval(timer);

}

main().then(function(res) {
    console.log(` >> res: `, res);
}).catch(function(err) {
    console.log(` >> err: `, err);
});