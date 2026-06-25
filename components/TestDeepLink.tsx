import { View, Button } from "react-native";
import * as Linking from "expo-linking";

export default function TestDeepLink() {
  return (
    <View>
      <Button
        title="Go to Create Screen"
        onPress={() => {
          Linking.openURL("expensetracker://create");
        }}
      />
    </View>
  );
}
