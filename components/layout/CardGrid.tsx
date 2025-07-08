import React from "react";
import { View, StyleSheet, ViewStyle, ScrollView } from "react-native";
import { spacing } from "../../lib/theme";

interface CardGridProps {
  children: React.ReactNode;
  style?: ViewStyle;
  numColumns?: number;
  spacing?: keyof typeof spacing;
  scrollable?: boolean;
}

export function CardGrid({
  children,
  style,
  numColumns = 2,
  spacing: gridSpacing = "md",
  scrollable = true,
}: CardGridProps) {
  const Container = scrollable ? ScrollView : View;

  const childrenArray = React.Children.toArray(children);
  const rows = [];

  for (let i = 0; i < childrenArray.length; i += numColumns) {
    const row = childrenArray.slice(i, i + numColumns);
    rows.push(row);
  }

  return (
    <Container style={[styles.container, style]}>
      {rows.map((row, rowIndex) => (
        <View
          key={rowIndex}
          style={[
            styles.row,
            {
              marginBottom:
                rowIndex < rows.length - 1 ? spacing[gridSpacing] : 0,
            },
          ]}
        >
          {row.map((child, colIndex) => (
            <View
              key={colIndex}
              style={[
                styles.column,
                {
                  width: `${100 / numColumns}%`,
                  paddingHorizontal: spacing[gridSpacing] / 2,
                },
              ]}
            >
              {child}
            </View>
          ))}
          {row.length < numColumns &&
            Array(numColumns - row.length)
              .fill(null)
              .map((_, index) => (
                <View
                  key={`empty-${index}`}
                  style={[
                    styles.column,
                    {
                      width: `${100 / numColumns}%`,
                      paddingHorizontal: spacing[gridSpacing] / 2,
                    },
                  ]}
                />
              ))}
        </View>
      ))}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    marginHorizontal: -spacing.md / 2,
  },
  column: {
    flex: 1,
  },
});
