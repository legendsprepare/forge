import React, { useEffect, useRef } from "react";
import { performanceMonitor } from "../../utils/performance";

export function withPerformanceTracking<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
): React.FC<P> {
  return function PerformanceTrackedComponent(props: P) {
    const renderStartTime = useRef<number>(0);
    const interactionStartTime = useRef<number>(0);
    const isInteracting = useRef<boolean>(false);

    useEffect(() => {
      renderStartTime.current = performance.now();
      return () => {
        const renderTime = performance.now() - renderStartTime.current;
        performanceMonitor.trackRender(componentName, renderTime);
      };
    });

    const handleInteractionStart = () => {
      isInteracting.current = true;
      interactionStartTime.current = performance.now();
    };

    const handleInteractionEnd = (interactionName: string) => {
      if (isInteracting.current) {
        const duration = performance.now() - interactionStartTime.current;
        performanceMonitor.trackInteraction(
          componentName,
          interactionName,
          duration
        );
        isInteracting.current = false;
      }
    };

    const enhancedProps = {
      ...props,
      onPressIn: (...args: any[]) => {
        handleInteractionStart();
        if (props.onPressIn) {
          (props as any).onPressIn(...args);
        }
      },
      onPressOut: (...args: any[]) => {
        handleInteractionEnd("press");
        if (props.onPressOut) {
          (props as any).onPressOut(...args);
        }
      },
      onScroll: (...args: any[]) => {
        if (!isInteracting.current) {
          handleInteractionStart();
        }
        if (props.onScroll) {
          (props as any).onScroll(...args);
        }
        // Debounce scroll end tracking
        setTimeout(() => handleInteractionEnd("scroll"), 150);
      },
    };

    return <WrappedComponent {...enhancedProps} />;
  };
}
