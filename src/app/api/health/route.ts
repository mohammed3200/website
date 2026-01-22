import { NextResponse } from 'next/server';

/**
 * Health Check Endpoint
 * Used by Docker health checks and monitoring systems
 */
export async function GET() {
    try {
        // Basic health check - application is running
        const health = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            service: 'EBIC Website',
        };

        return NextResponse.json(health, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            {
                status: 'unhealthy',
                timestamp: new Date().toISOString(),
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 503 }
        );
    }
}
