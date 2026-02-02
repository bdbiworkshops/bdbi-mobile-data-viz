import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useFonts } from 'expo-font';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { LineChart, PieChart, RadarChart } from 'react-native-gifted-charts';
import useStepHikes from '../hooks/useStepHikes';

const Index = () => {
    //#region (use for testing!) CONSTANTS
    const STEP_GOAL = 10000;
    const HIKE_INTERVAL = 2500;
    //#endregion

    //#region (DON'T EDIT) INITIALIZATION
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

    /**
     * STEP #1: DATA PREPARATION
     * Populate lineData and radarData with hike metrics
     * that fit the data format of gifted-charts.
     * 
     * 
     * 
    */
    const lineData = [];
    const radarData = [];

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
                         * 
                         * 
                         * 
                        */}
                    </View>}
                    <View style={[styles.horizontalFlex]}>
                        {!isCounting && <TouchableOpacity onPress={resetHikes}>
                            <Text style={styles.buttonReset}>
                                <FontAwesome name="refresh" size={24} color="white" />
                            </Text>
                        </TouchableOpacity>}
                        {!isCounting && <TouchableOpacity onPress={generateHundredRandomHikes}>
                            <Text style={[styles.buttonReset, { paddingHorizontal: 15 }]}>
                                <FontAwesome5 name="dice" size={24} color="white" />
                            </Text>
                        </TouchableOpacity>}
                        <TouchableOpacity onPress={isCounting ? stopCounting : startCounting}>
                            <Text style={isCounting ? styles.buttonStop : styles.buttonStart}>
                                {isCounting ? <FontAwesome name="stop" size={24} color="white" />
                                    : <FontAwesome name="play" size={24} color="white" />}
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
                                <Text style={[styles.title, { fontSize: 30, marginBottom: 0 }]}>
                                    {/* YOUR EXPRESSION HERE */}
                                </Text>
                                <Text style={styles.text}>Steps</Text>
                            </View>

                            <View style={{ alignItems: 'center' }}>
                                <Text style={[styles.title, { fontSize: 30, marginBottom: 0 }]}>
                                    {/* YOUR EXPRESSION HERE */}
                                </Text>
                                <Text style={styles.text}>Hikes</Text>
                            </View>

                            {/* TRY THE LAST ONE YOURSELF! */}

                        </>
                    )
                        : <Text style={styles.text}>No hikes yet.</Text>
                    }
                </View>

                <Text style={styles.heading}>Hike History</Text>
                <View style={styles.card}>
                    {hikes.length > 0 ? (
                        <>
                            {/**
                             * STEP #4: LINE CHART FOR STEP COUNT PROGRESSION
                             * Visualize how step count changes between hikes over time.
                             * 
                             * 
                             * 
                            */}
                            {radarData.length > 0 && (
                                {/**
                                * STEP #5: RADAR CHART FOR STEP COUNT DISTRIBUTION
                                * Display how hiking intensity varies across hikes, categorized by step count.
                                * 
                                * 
                                * 
                                */}
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