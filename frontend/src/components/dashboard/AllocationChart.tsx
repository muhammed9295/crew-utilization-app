import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight } from "lucide-react"

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
);

const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: true,
            position: 'top' as const,
            align: 'end' as const,
            labels: {
                usePointStyle: true,
                boxWidth: 6
            }
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            cornerRadius: 8,
            callbacks: {
                label: function (context: any) {
                    return context.dataset.label + ': ' + context.parsed.y + '%';
                }
            }
        },
        datalabels: {
            color: 'white',
            font: {
                weight: 'bold' as const,
                size: 12
            },
            formatter: (value: any) => {
                return value > 0 ? value + '%' : ''; // Hide 0% or empty
            },
            anchor: 'center' as const,
            align: 'center' as const,
        }
    },
    scales: {
        x: {
            grid: {
                display: false,
            },
            ticks: {
                color: '#888888',
                font: {
                    size: 12
                }
            },
            border: {
                display: false
            }
        },
        y: {
            max: 100, // Percentage scale
            grid: {
                display: false,
            },
            ticks: {
                color: '#888888',
                font: {
                    size: 12
                },
                callback: function (value: any) {
                    return value + '%';
                }
            },
            border: {
                display: false
            }
        },
    },
    barPercentage: 0.6,
    categoryPercentage: 0.8,
};

interface AllocationChartProps {
    data?: any[]
}

export function AllocationChart({ data: propData }: AllocationChartProps) {
    const labels = propData?.map(d => d.zoneName) || ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Zone E', 'Zone F']
    // Fallback data is just for skeleton/loading appearance essentially
    const technicianData = propData?.map(d => d.technicianUtilization ?? 0) || [0, 0, 0, 0, 0, 0]
    const cleanerData = propData?.map(d => d.cleanerUtilization ?? 0) || [0, 0, 0, 0, 0, 0]

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Technician',
                data: technicianData,
                backgroundColor: '#f97316', // Orange-500
                borderRadius: 4,
            },
            {
                label: 'Cleaner',
                data: cleanerData,
                backgroundColor: '#3b82f6', // Blue-500
                borderRadius: 4,
            },
        ],
    };

    return (
        <Card className="col-span-4 lg:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Crew allocation by role</CardTitle>
                <div className="h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center cursor-pointer hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700">
                    <ArrowUpRight className="h-4 w-4 text-neutral-500" />
                </div>
            </CardHeader>
            <CardContent className="pl-2">
                <div className='h-[300px] w-full'>
                    <Bar options={options} data={chartData} />
                </div>
            </CardContent>
        </Card>
    )
}
