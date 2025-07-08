import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import * as Sentry from "sentry-expo";
import { Text } from "./ui/Text";
import { useTheme } from "../hooks/useTheme";
import { Canvas, Path, LinearGradient, vec } from "@shopify/react-native-skia";
import { router } from "expo-router";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    Sentry.Native.captureException(error, {
      extra: {
        componentStack: errorInfo.componentStack,
      },
    });
  }

  handleRestart = () => {
    this.setState({ hasError: false, error: null });
    router.replace("/");
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          onRestart={this.handleRestart}
        />
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  onRestart: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, onRestart }) => {
  const theme = useTheme();

  const LightningEffect = () => (
    <Canvas style={styles.lightning}>
      <Path
        path="M 20,0 l 5,10 l -3,5 l 4,8 l -3,5 l 5,10"
        style="stroke"
        strokeWidth={2}
      >
        <LinearGradient
          start={vec(0, 0)}
          end={vec(0, 40)}
          colors={["rgba(255, 255, 0, 0.8)", "rgba(255, 255, 0, 0)"]}
        />
      </Path>
    </Canvas>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <LightningEffect />
      <Text style={styles.title}>Oops! Something went wrong</Text>
      <Text style={styles.description}>
        We've been notified and are working on a fix. Here's what happened:
      </Text>
      <View style={[styles.errorBox, { backgroundColor: theme.colors.card }]}>
        <Text style={styles.errorText}>
          {error?.message || "Unknown error"}
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        onPress={onRestart}
      >
        <Text style={styles.buttonText}>Restart App</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.reportButton}
        onPress={() => {
          Sentry.Native.showReportDialog({
            eventId: Sentry.Native.captureException(error),
          });
        }}
      >
        <Text style={[styles.reportText, { color: theme.colors.primary }]}>
          Report this issue
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  lightning: {
    width: 40,
    height: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    opacity: 0.8,
  },
  errorBox: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
    width: "100%",
  },
  errorText: {
    fontSize: 14,
    opacity: 0.7,
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  reportButton: {
    padding: 10,
  },
  reportText: {
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
