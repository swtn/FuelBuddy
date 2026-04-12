import { useFuel } from '@/context/FuelContext';
import React, { useMemo } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get("window").width;

export default function StatsScreen() {
    const { state } = useFuel();

    const monthlyStats = useMemo(() => {
            const groups: { [key: string]: { count: number; totalCost: number; monthName: string } } = {};
            state.entries.forEach(entry => {
                const date = new Date(entry.date);
                const key = `${date.getFullYear()}-${date.getMonth()}`;
                const monthName = date.toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' });

                if (!groups[key]) {
                    groups[key] = { count: 0, totalCost: 0, monthName };
                }

                groups[key].count += 1;
                groups[key].totalCost += Number(entry.totalCost) || 0
            });
            return Object.values(groups).sort((a,b) => b.monthName.localeCompare(a.monthName));    
        }, [state.entries])

    const chartData = useMemo(() => {
        
        if (state.entries.length === 0) return null;

        const sorted = [...state.entries].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime());

        const priceLabels = sorted.map(e => 
            new Date(e.date).toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit'})
        ).slice(-6);

        const priceValues = sorted.map(e => e.pricePerLiter).slice(-6);

        return {
            prices: {
                labels: priceLabels,
                datasets: [{ data: priceValues }]
            }
        };
    }, [state.entries]);

    if (!chartData) {
        return (
            <View style={styles.center}>
                <Text style={styles.emptyText}>Dodaj tankowania, aby zobaczyć wykresy</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            
            <View style={styles.chartBox}>
                <Text style={styles.chartTitle}>Cena paliwa (PLN/l)</Text>
                <LineChart
                    data={chartData.prices}
                    width={screenWidth - 40}
                    height={190}
                    chartConfig={chartConfig}
                    bezier
                    style={styles.chart}
                />
            </View>

            <View style={styles.chartBox}>
                <Text style={styles.chartTitle}>Ostatnie tankowania (Litry)</Text>
                <BarChart
                    data={{
                        labels: chartData.prices.labels,
                        datasets: [{ data: [...state.entries].slice(-6).map(e => e.liters)}]
                    }}
                    width={screenWidth -40}
                    height={190}
                    yAxisLabel=""
                    yAxisSuffix=" l"
                    chartConfig={chartConfig}
                    style={styles.chart}
                    />
            </View>

            <View style={styles.detailsSection}>
                <Text style={styles.chartTitle}>Podsumowanie miesięczne</Text>
                {monthlyStats.map((stat, index) => (
                    <View key={index} style={styles.monthlyCard}>
                    <View>
                        <Text style={styles.monthName}>{stat.monthName}</Text>
                        <Text style={styles.visitCount}>{stat.count} {stat.count === 1 ? 'tankowanie' : 'tankowania'}</Text>
                    </View>
                    <View style={styles.costBadge}>
                        <Text style={styles.totalMonthCost}>{stat.totalCost.toFixed(2)} PLN</Text>
                    </View>
                    </View>
                ))}
                </View>
        </ScrollView>
    )
}

const chartConfig = {
  backgroundColor: "#fff",
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`, 
  labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
  style: { borderRadius: 16 },
  propsForDots: { r: "6", strokeWidth: "2", stroke: "#2563eb" }
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fe', padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1e293b', marginBottom: 20 },
  chartBox: { backgroundColor: '#fff', borderRadius: 16, padding: 15, marginBottom: 20, elevation: 2 },
  chartTitle: { fontSize: 16, fontWeight: '600', color: '#64748b', marginBottom: 15 },
  chart: { marginVertical: 8, borderRadius: 16 },
  emptyText: { color: '#94a3b8', fontSize: 16 },
  detailsSection: { marginTop: 10, marginBottom: 30 },
  monthlyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
  },
  monthName: { fontSize: 16, fontWeight: 'bold', color: '#1e293b', textTransform: 'capitalize' },
  visitCount: { fontSize: 13, color: '#64748b', marginTop: 2 },
  costBadge: { backgroundColor: '#eff6ff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  totalMonthCost: { fontWeight: 'bold', color: '#2563eb', fontSize: 16 },
});