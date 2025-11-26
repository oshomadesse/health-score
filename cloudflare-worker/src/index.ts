export interface Env {
    HEALTH_DATA: KVNamespace;
}

interface HealthData {
    date: string;
    sleep: {
        totalHours: number;
        wakeCount: number;
    };
    activity: {
        steps: number;
        calories: number;
    };
    heartRate: {
        resting: number;
    };
}

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const url = new URL(request.url);

        // CORS headers
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        // Handle OPTIONS request
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        // POST /api/health - Save health data
        if (url.pathname === '/api/health' && request.method === 'POST') {
            try {
                const data: HealthData = await request.json();

                // Validate data
                if (!data.date || !data.sleep || !data.activity || !data.heartRate) {
                    return new Response(JSON.stringify({ error: 'Invalid data format' }), {
                        status: 400,
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    });
                }

                // Store in KV with date as key
                await env.HEALTH_DATA.put(`health:${data.date}`, JSON.stringify(data));

                // Also store as 'latest' for quick access
                await env.HEALTH_DATA.put('health:latest', JSON.stringify(data));

                return new Response(JSON.stringify({ success: true }), {
                    status: 200,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            } catch (error: any) {
                return new Response(JSON.stringify({
                    error: 'Failed to save data',
                    details: error.message,
                    stack: error.stack
                }), {
                    status: 500,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            }
        }

        // GET /api/health/latest - Get latest health data
        if (url.pathname === '/api/health/latest' && request.method === 'GET') {
            try {
                const data = await env.HEALTH_DATA.get('health:latest');

                if (!data) {
                    return new Response(JSON.stringify({ error: 'No data available' }), {
                        status: 404,
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    });
                }

                return new Response(data, {
                    status: 200,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            } catch (error) {
                return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
                    status: 500,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            }
        }

        return new Response('Not Found', { status: 404, headers: corsHeaders });
    },
};
