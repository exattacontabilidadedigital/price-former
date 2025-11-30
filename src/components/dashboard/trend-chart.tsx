"use client"

import { ResponsiveContainer, AreaChart, Area, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';

const trendData = [
    { name: '1', value: 1000 },
    { name: '2', value: 2500 },
    { name: '3', value: 1800 },
    { name: '4', value: 3200 },
    { name: '5', value: 2100 },
    { name: '6', value: 4500 },
    { name: '7', value: 4200 },
    { name: '8', value: 3800 },
    { name: '9', value: 2500 },
    { name: '10', value: 3000 },
    { name: '11', value: 5200 },
    { name: '12', value: 4800 },
    { name: '13', value: 3500 },
    { name: '14', value: 5500 },
    { name: '15', value: 4800 },
    { name: '16', value: 3200 },
    { name: '17', value: 4000 },
    { name: '18', value: 3500 },
];

export function TrendChart() {
    return (
        <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }} />
                    <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
