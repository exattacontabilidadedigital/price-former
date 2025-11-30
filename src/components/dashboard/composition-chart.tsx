"use client"

import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const priceCompositionData = [
    { name: 'Custo', value: 25, color: '#3b82f6' },
    { name: 'Lucro', value: 30, color: '#22c55e' },
    { name: 'Despesas', value: 20, color: '#f97316' },
    { name: 'Impostos', value: 25, color: '#eab308' },
];

export function CompositionChart() {
    return (
        <>
            <div className="h-[200px] w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={priceCompositionData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                        >
                            {priceCompositionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Preço Médio</span>
                    <span className="text-xl font-bold main-value-black">R$ 120,50</span>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
                {priceCompositionData.map((item, index) => (
                    <div key={index} className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                        {item.name} ({item.value}%)
                    </div>
                ))}
            </div>
        </>
    )
}
