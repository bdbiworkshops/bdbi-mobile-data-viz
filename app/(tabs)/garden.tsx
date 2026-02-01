import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Text, View } from "react-native";

const Garden = () => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 50 }}>
            <Text style={{ textAlign: 'center', fontSize: 24 }}>There's not actually a garden here. The garden is in your mind!</Text>
            <FontAwesome name="leaf" size={50} color="#373D20" style={{ marginTop: 20 }} />
        </View>
    );
}

export default Garden;