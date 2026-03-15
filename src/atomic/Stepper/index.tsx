// packages/expo/src/atomic/Stepper/index.tsx
/**
 * @fileoverview Stepper component
 * @description Reusable stepper component for step-by-step workflows
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { useState } from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';

import { THEME_VARIANT } from '../../utils/constants';
import { mergeStyles } from '../../utils/helpers';
import Button from '../Button';
import Card from '../Card';
import Stack from '../Stack';
import Text from '../Text';

import type { ReactNode } from 'react';

/**
 * Stepper step interface
 */
export interface StepperStep {
  /** Step number */
  number: number;
  /** Step title */
  title: string;
  /** Step icon (optional) */
  icon?: ReactNode;
  /** Step content */
  content: ReactNode;
}

/**
 * Stepper component props interface
 */
export interface StepperProps {
  /**
   * Array of steps to display
   */
  steps: StepperStep[];
  /**
   * Initial active step index (0-based)
   * @default 0
   */
  defaultStep?: number;
  /**
   * Whether to show step numbers in navigation
   * @default true
   */
  showStepNumbers?: boolean;
  /**
   * Show previous/next navigation buttons
   * @default false
   */
  showNavigation?: boolean;
  /**
   * Show step info text "Step X of Y"
   * @default false
   */
  showStepInfo?: boolean;
  /**
   * Label for previous button
   * @default 'Previous'
   */
  previousLabel?: string;
  /**
   * Label for next button
   * @default 'Next'
   */
  nextLabel?: string;
  /**
   * Template string for step info (e.g. "Step {current} of {total}")
   * Replaces default "Step X of Y" text when showStepInfo is true
   */
  stepInfoTemplate?: string;
  /**
   * Variant style
   * @default 'default'
   */
  variant?: (typeof THEME_VARIANT)[keyof typeof THEME_VARIANT];
  /**
   * Callback when step changes
   */
  onStepChange?: (stepIndex: number) => void;
  /**
   * Additional style
   */
  style?: ViewStyle;
  /**
   * Test ID for testing
   */
  testID?: string;
}

const stepIndicatorStyle: ViewStyle = {
  width: 32,
  height: 32,
  borderRadius: 16,
  backgroundColor: '#e5e7eb',
  alignItems: 'center',
  justifyContent: 'center',
};

const activeStepStyle: ViewStyle = {
  backgroundColor: '#3b82f6',
};

/**
 * Reusable stepper component for step-by-step workflows.
 *
 * @component
 * @example
 * ```tsx
 * <Stepper
 *   steps={[
 *     { number: 1, title: 'Step 1', content: <Text>Step 1 Content</Text> },
 *     { number: 2, title: 'Step 2', content: <Text>Step 2 Content</Text> }
 *   ]}
 * />
 * ```
 */
const Stepper = ({
  steps,
  defaultStep = 0,
  showStepNumbers = true,
  showNavigation = false,
  showStepInfo = false,
  stepInfoTemplate,
  previousLabel = 'Previous',
  nextLabel = 'Next',
  variant = THEME_VARIANT.DEFAULT,
  onStepChange,
  style,
  testID,
}: StepperProps) => {
  const [currentStep, setCurrentStep] = useState(defaultStep);

  const handlePrevious = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      onStepChange?.(newStep);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      onStepChange?.(newStep);
    }
  };

  const activeStep = steps[currentStep];

  if (!activeStep) return null;

  return (
    <View style={style} testID={testID}>
      <Stack gap={16}>
        {/* Step indicators */}
        <Stack
          direction="row"
          align="center"
          gap={8}
          testID={testID ? `${testID}-indicators` : undefined}
        >
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;

            return (
              <View key={step.number} style={{ flex: 1, alignItems: 'center' }}>
                <View
                  style={[
                    stepIndicatorStyle,
                    isActive && activeStepStyle,
                    isCompleted && { backgroundColor: '#10b981' },
                  ]}
                  testID={
                    testID ? `${testID}-indicator-${step.number}` : undefined
                  }
                >
                  {showStepNumbers && (
                    <Text
                      level="caption"
                      style={{
                        color: isActive || isCompleted ? '#ffffff' : '#6b7280',
                      }}
                    >
                      {step.number}
                    </Text>
                  )}
                </View>
                {step.title && (
                  <Text
                    level="caption"
                    variant={isActive ? 'primary' : 'muted'}
                    style={{ marginTop: 4 }}
                  >
                    {step.title}
                  </Text>
                )}
              </View>
            );
          })}
        </Stack>

        {/* Step info */}
        {showStepInfo && (
          <Text
            level="small"
            variant="muted"
            testID={testID ? `${testID}-info` : undefined}
          >
            {stepInfoTemplate
              ? stepInfoTemplate
                  .replace('{current}', String(currentStep + 1))
                  .replace('{total}', String(steps.length))
              : `Step ${currentStep + 1} of ${steps.length}`}
          </Text>
        )}

        {/* Step content */}
        <Card testID={testID ? `${testID}-content` : undefined}>
          <Stack gap={8}>
            <Text level="h3">{activeStep.title}</Text>
            {activeStep.content}
          </Stack>
        </Card>

        {/* Navigation */}
        {showNavigation && (
          <Stack
            direction="row"
            gap={8}
            justify="space-between"
            testID={testID ? `${testID}-navigation` : undefined}
          >
            <Button
              variant="outline"
              onPress={handlePrevious}
              disabled={currentStep === 0}
              testID={testID ? `${testID}-previous` : undefined}
            >
              {previousLabel}
            </Button>
            <Button
              variant="primary"
              onPress={handleNext}
              disabled={currentStep === steps.length - 1}
              testID={testID ? `${testID}-next` : undefined}
            >
              {nextLabel}
            </Button>
          </Stack>
        )}
      </Stack>
    </View>
  );
};

export default Stepper;
