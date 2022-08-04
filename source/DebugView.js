import React from "react";
import { View, Text } from "react-native";

export default ({ data, visible }) => {
  if (!data || data.length == 0 || !visible) return null;
  return (
    <View>
      {data.map((item, index) => (
        <Text key={index} style={{ marginTop: 8 }}>
          {item}
        </Text>
      ))}
    </View>
  );
};
