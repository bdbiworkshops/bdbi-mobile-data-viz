import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useFonts } from 'expo-font';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { LineChart, PieChart, RadarChart } from 'react-native-gifted-charts';
import useStepHikes from '../hooks/useStepHikes';


const Index = () => {
    //#region (DON'T EDIT) INITIALIZATION <3
    const STEP_GOAL = 100;
    const HIKE_INTERVAL = 2500;

    const { width: screenWidth } = useWindowDimensions();
    const { steps, isCounting, startCounting, stopCounting, hikes, resetHikes, setHikes, saveHikes } = useStepHikes();

    const [fontsLoaded] = useFonts({
        'Host-Grotesk': require('../../assets/HostGrotesk_400Regular.ttf'),
        'Host-Grotesk-Bold': require('../../assets/HostGrotesk_700Bold.ttf'),
    });
    if (!fontsLoaded) {
        return null;
    }
    //#endregion

    //#region (DON'T EDIT) HELPER METHOD (singular, but we do it for the sake of organization!)
    const generateHundredRandomHikes = () => {
        const randomHikes = Array.from({ length: 100 }, () => ({
            id: Date.now().toString() + Math.random().toString(36).substring(7),
            startTime: Date.now(),
            endTime: Date.now() + Math.floor(Math.random() * 3600000),
            steps: Math.floor(Math.random() * 5 * HIKE_INTERVAL),
        }));
        const updatedHikes = [...randomHikes];

        resetHikes();
        setHikes(updatedHikes);
        saveHikes(updatedHikes);
    };
    //#endregion

    //#region DATA PREPARATION
    const lineData = (hikes ?? []).map((h) => ({ value: h?.steps ?? 0, tooltipText: `${h.steps ?? 0} steps` }));
    const radarData = [
        {
            label: `<${HIKE_INTERVAL}`,
            value: hikes.filter(h => h.steps < HIKE_INTERVAL).length,
            color: '#FF6384',
        },
        {
            label: `${HIKE_INTERVAL}-${2 * HIKE_INTERVAL - 1}`,
            value: hikes.filter(h => h.steps >= HIKE_INTERVAL && h.steps < 2 * HIKE_INTERVAL).length,
            color: '#36A2EB',
        },
        {
            label: `${2 * HIKE_INTERVAL}-${3 * HIKE_INTERVAL - 1}`,
            value: hikes.filter(h => h.steps >= 2 * HIKE_INTERVAL && h.steps < 3 * HIKE_INTERVAL).length,
            color: '#FFCE56',
        },
        {
            label: `${3 * HIKE_INTERVAL}-${4 * HIKE_INTERVAL - 1}`,
            value: hikes.filter(h => h.steps >= 3 * HIKE_INTERVAL && h.steps < 4 * HIKE_INTERVAL).length,
            color: '#4BC0C0',
        },
        {
            label: `>=${4 * HIKE_INTERVAL}`,
            value: hikes.filter(h => h.steps >= 4 * HIKE_INTERVAL).length,
            color: '#9966FF',
        }
    ];
    //#endregion

    return (
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <Text style={styles.title}>Welcome to Hikify!</Text>
                <Text style={styles.heading}>Record A Hike</Text>
                <View style={styles.card}>
                    {isCounting && <View style={{ alignItems: 'center', marginBottom: 20 }}>
                        {/**
                         * STEP #3: PIE (DONUT) CHART FOR STEP COUNTER
                         * Visualize progress made towards STEP_GOAL.
                        */}
                        <PieChart
                            data={[
                                { value: steps, color: '#373D20' },
                                { value: Math.max(0, STEP_GOAL - steps), color: '#E0E0E0' },
                            ]}
                            donut
                            showGradient
                            innerRadius={60}
                            radius={100}
                            centerLabelComponent={() => (
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={{ fontSize: 18, fontWeight: '600', color: '#373D20' }}>{steps} / {STEP_GOAL}</Text>
                                    <Text style={{ fontSize: 14, color: '#4A4A4A' }}>Steps</Text>
                                </View>
                            )}
                        />

                    </View>}
                    <View style={[styles.horizontalFlex]}>
                        {!isCounting && <TouchableOpacity onPress={resetHikes}>
                            <Text style={styles.buttonReset}><FontAwesome name="refresh" size={24} color="white" /></Text>
                        </TouchableOpacity>}
                        {!isCounting && <TouchableOpacity onPress={generateHundredRandomHikes}>
                            <Text style={[styles.buttonReset, { paddingHorizontal: 15 }]}><FontAwesome5 name="dice" size={24} color="white" /></Text>
                        </TouchableOpacity>}
                        <TouchableOpacity onPress={isCounting ? stopCounting : startCounting}>
                            <Text style={isCounting ? styles.buttonStop : styles.buttonStart}>
                                {isCounting ? <FontAwesome name="stop" size={24} color="white" /> : <FontAwesome name="play" size={24} color="white" />}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={styles.heading}>2026 Hikes Wrapped</Text>
                <View style={[styles.card, styles.horizontalFlex]}>
                    {hikes.length > 0 ? (
                        <>
                            {/**
                            * STEP #2: TOTAL STEPS, TOTAL HIKES, & AVERAGE STEPS/HIKE
                            * Calculate and display statistics from hike data.
                            */}
                            <View style={{ alignItems: 'center' }}>
                                <Text style={[styles.title, { fontSize: 30, marginBottom: 0 }]}>{lineData.reduce((acc, curr) => acc + curr.value, 0)}</Text>
                                <Text style={styles.text}>Steps</Text>
                            </View>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={[styles.title, { fontSize: 30, marginBottom: 0 }]}>{hikes.length}</Text>
                                <Text style={styles.text}>Hikes</Text>
                            </View>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={[styles.title, { fontSize: 30, marginBottom: 0 }]}>{Math.round(lineData.reduce((acc, curr) => acc + curr.value, 0) / (hikes.length || 1))}</Text>
                                <Text style={styles.text}>Steps/Hike</Text>
                            </View>
                        </>)
                        : <Text style={styles.text}>No hikes yet.</Text>}
                </View>

                <Text style={styles.heading}>Hike History</Text>
                <View style={styles.card}>
                    {hikes.length > 0 ? (
                        <>
                            {/**
                             * STEP #4: LINE CHART FOR STEP COUNT PROGRESSION
                             * Visualize how step count changes between hikes over time.
                            */}
                            <LineChart
                                data={lineData}
                                width={screenWidth - 140}
                                height={160}
                                spacing={(screenWidth - 140) / (lineData.length)}
                                areaChart
                                startFillColor='#717744'
                                curved
                                referenceLine1Position={HIKE_INTERVAL}
                                showReferenceLine1
                                referenceLine2Position={2 * HIKE_INTERVAL}
                                showReferenceLine2
                                referenceLine3Position={3 * HIKE_INTERVAL}
                                showReferenceLine3
                                colors={[
                                    {
                                        from: 0,
                                        to: 10000,
                                        color: '#373D20',
                                    }
                                ]}
                            />

                            {/**
                            * STEP #5: RADAR CHART FOR STEP COUNT DISTRIBUTION
                            * Display how hiking intensity varies across hikes, categorized by step count.
                            */}
                            {radarData.length > 0 && (
                                <RadarChart
                                    data={radarData.map(d => d.value)}
                                    labels={radarData.map(d => d.label)}
                                    labelConfig={{ stroke: '#717744', fontWeight: 'bold' }}
                                    hideAsterLines={true}
                                    dataLabels={radarData.map(d => `${d.value}`)}
                                    dataLabelsConfig={{ stroke: '#373D20' }}
                                    dataLabelsPositionOffset={HIKE_INTERVAL / 4}
                                    maxValue={Math.max(...radarData.map(d => d.value)) * 1.4}
                                    polygonConfig={
                                        {
                                            fill: '#717744',
                                            stroke: '#000',
                                            strokeWidth: 2,
                                            opacity: 0.8,
                                            gradientColor: '#373D20',
                                            gradientOpacity: 0.7,
                                            showGradient: true,
                                        }
                                    }
                                />
                            )}
                        </>
                    ) : (
                        <Text style={[styles.text, { textAlign: 'center' }]}>No hikes yet.</Text>
                    )}
                </View>
            </ScrollView >
        </View >
    );
}

const styles = StyleSheet.create({
    "*": {
        fontFamily: 'Host-Grotesk',
    },
    contentContainer: {
        padding: 20,
    },
    horizontalFlex: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'Host-Grotesk-Bold',
        marginBottom: 20,
        color: '#373D20',
    },
    heading: {
        fontSize: 20,
        fontWeight: '600',
        fontFamily: 'Host-Grotesk-Bold',
        marginBottom: 10,
        color: '#717744'
    },
    buttonStart: {
        padding: 15,
        paddingHorizontal: 18,
        backgroundColor: '#373D20',
        borderRadius: 8,
        alignItems: 'center',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600',
        fontFamily: 'Host-Grotesk-Bold',
        color: '#fff'
    },
    buttonStop: {
        padding: 15,
        paddingHorizontal: 18,
        backgroundColor: '#B33A3A',
        borderRadius: 8,
        alignItems: 'center',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600',
        fontFamily: 'Host-Grotesk-Bold',
        color: '#fff'
    },
    buttonReset: {
        padding: 15,
        paddingHorizontal: 18,
        backgroundColor: '#555555',
        borderRadius: 8,
        alignItems: 'center',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600',
        fontFamily: 'Host-Grotesk-Bold',
        color: '#fff',
    },
    text: {
        fontSize: 18,
        color: '#4A4A4A',
        fontFamily: 'Host-Grotesk',
    },
    card: {
        padding: 20,
        backgroundColor: '#fff',
        marginVertical: 5,
        borderRadius: 10,
        marginBottom: 20,
        fontFamily: 'Host-Grotesk',
        overflow: 'hidden',
    }
});
export default Index;