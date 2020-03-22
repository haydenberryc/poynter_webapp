var graph = require('@microsoft/microsoft-graph-client');

function getAuthenticatedClient(accessToken) {
    // Initialize Graph client
    const client = graph.Client.init({
        // Use the provided access token to authenticate
        // requests
        authProvider: (done) => {
            done(null, accessToken.accessToken);
        }
    });

    return client;
}

export async function getUserDetails(accessToken) {
    const client = getAuthenticatedClient(accessToken);

    const user = await client.api('/me').get();
    return user;
}

export async function getPoints(accessToken) {
    const client = getAuthenticatedClient(accessToken);

    const events = await client
        .api("/drives/4f38134c5b4a4df8/items/4F38134C5B4A4DF8!2287/workbook/worksheets('{00000000-0001-0000-0000-000000000000}')/Range(address='Sheet1!A7:C66')")
        .select('text')
        .get();

    return events.text;
}

//hayden's drive
///drives/163a5b1063203165/items/163A5B1063203165!1282/workbook/worksheets('{41290A05-F07B-4781-A983-8BBE34107212}')/Range(address='Sheet1!A7:C66')")
//drives/4f38134c5b4a4df8/items/4F38134C5B4A4DF8!2287