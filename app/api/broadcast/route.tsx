// This function acts as a proxy to forward the POST request to the external API
export async function POST(request: Request) {

    try {
        // Parse the request body
        const requestBody = await request.json();
        console.log(requestBody)

        // Forward the request to the external API
        const externalApiResponse = await fetch('https://mapi.gorillapool.io/mapi/tx', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody),
        });

        // Check if the external API request was successful
        if (!externalApiResponse.ok) {
            throw new Error(`API responded with status: ${externalApiResponse.status}`);
        }

        // Get the response from the external API
        const responseData = await externalApiResponse.text();
        console.log(responseData)

        // Return the response
        return new Response(JSON.stringify(responseData, null, 2), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        // Handle any errors
        console.error('Error:', error);
        return new Response(JSON.stringify({ message: 'Internal server error' }, null, 2), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
