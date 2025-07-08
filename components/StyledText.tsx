import React from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

type BaseProps = {
  style?: StyleProp<TextStyle>;
  children?: React.ReactNode;
};

export const MonoText: React.FC<BaseProps> = props => {
  return <Text {...props} style={[props.style, { fontFamily: 'space-mono' }]} />;
};

export const StyledText: React.FC<BaseProps> = props => {
  return <Text {...props} style={[props.style]} />;
};

export default MonoText;
