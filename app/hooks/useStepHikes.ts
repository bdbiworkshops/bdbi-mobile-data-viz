import AsyncStorage from "@react-native-async-storage/async-storage";
import { Accelerometer } from "expo-sensors";
import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "@trips";

const THRESHOLD = 1.2;
const STEP_INTERVAL = 300;

// YOU DON'T NEED TO EDIT THIS SCRIPT!

export interface Hike {
    id: string;
    startTime: number;
    endTime?: number;
    steps: number;
}

const useStepHikes = () => {
    const [steps, setSteps] = useState(0);
    const [isCounting, setIsCounting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hikes, setHikes] = useState<Hike[]>([]);

    const subscriptionRef = useRef<any>(null);
    const lastStepTimeRef = useRef<number>(0);
    const currentHikeRef = useRef<Hike | null>(null);

    useEffect(() => {
        const loadHikes = async () => {
            try {
                const saved = await AsyncStorage.getItem(STORAGE_KEY);
                if (saved) setHikes(JSON.parse(saved));
            } catch (err) {
                console.error("Failed to load hikes:", err);
            }
        };
        loadHikes();
    }, []);

    const saveHikes = async (updatedHikes: Hike[]) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHikes));
        } catch (err) {
            console.error("Failed to save hikes:", err);
        }
    };

    const startCounting = () => {
        if (isCounting) return;

        const newHike: Hike = {
            id: Date.now().toString(),
            startTime: Date.now(),
            steps: 0,
        };
        currentHikeRef.current = newHike;
        setSteps(0);

        subscriptionRef.current = Accelerometer.addListener((data) => {
            const { x, y, z } = data;
            const magnitude = Math.sqrt(x * x + y * y + z * z);
            const now = Date.now();
            if (magnitude > THRESHOLD && now - lastStepTimeRef.current > STEP_INTERVAL) {
                setSteps((prev) => {
                    const next = prev + 1;
                    if (currentHikeRef.current) currentHikeRef.current.steps = next;
                    return next;
                });
                lastStepTimeRef.current = now;
            }
        });

        Accelerometer.setUpdateInterval(100);
        setIsCounting(true);
    };

    const stopCounting = async () => {
        subscriptionRef.current?.remove();
        subscriptionRef.current = null;
        setIsCounting(false);

        if (currentHikeRef.current) {
            currentHikeRef.current.endTime = Date.now();
            const updatedHikes = [...hikes, currentHikeRef.current];
            setHikes(updatedHikes);
            saveHikes(updatedHikes);
            currentHikeRef.current = null;
        }
    };

    const resetHikes = async () => {
        setHikes([]);
        await AsyncStorage.removeItem(STORAGE_KEY);
    };

    return {
        steps,
        isCounting,
        startCounting,
        stopCounting,
        hikes,
        resetHikes,
        error,
        setHikes,
        saveHikes
    };
};

export default useStepHikes;
