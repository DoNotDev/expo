// packages/expo/src/atomic/Calendar/index.tsx
/**
 * @fileoverview Calendar component
 * @description Calendar date picker component
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  type ViewStyle,
} from 'react-native';

import { formatDate, getAppTimeZone, useTranslation } from '@donotdev/core';

import { mergeStyles } from '../../utils/helpers';
import Button from '../Button';
import Stack from '../Stack';
import Text from '../Text';

/**
 * Calendar component props interface
 */
export interface CalendarProps {
  /**
   * Selected date
   */
  value?: Date;
  /**
   * Change handler
   */
  onSelect?: (date: Date) => void;
  /**
   * Minimum date
   */
  minDate?: Date;
  /**
   * Maximum date
   */
  maxDate?: Date;
  /**
   * Mode
   * @default 'date'
   */
  mode?: 'date' | 'time' | 'datetime';
  /**
   * Additional style
   */
  style?: ViewStyle;
  /**
   * Test ID for testing
   */
  testID?: string;
}

/** Numeric date (the `toLocaleDateString()` layout), in the app's zone (`formatDate`). */
const NUMERIC_DATE = { year: 'numeric', month: 'numeric', day: 'numeric' } as const;

/**
 * Calendar date picker component. The trigger shows the value in the UI language and the
 * app's time zone (`formatDate`, `i18n.timeZone`), and the native picker reads and picks
 * in that zone (`timeZoneName`), as the web DatePicker / DateTimePicker: not the device's.
 *
 * @component
 * @example
 * ```tsx
 * <Calendar value={date} onSelect={setDate} />
 * ```
 */
const Calendar = ({
  value = new Date(),
  onSelect,
  minDate,
  maxDate,
  mode = 'date',
  style,
  testID,
}: CalendarProps) => {
  const [showPicker, setShowPicker] = useState(false);
  const { language } = useTranslation();

  const handleChange = (
    _event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    setShowPicker(false);
    if (selectedDate && onSelect) {
      onSelect(selectedDate);
    }
  };

  return (
    <View style={style} testID={testID}>
      <Button
        variant="outline"
        onPress={() => setShowPicker(true)}
        testID={testID ? `${testID}-trigger` : undefined}
      >
        {formatDate(value, language, NUMERIC_DATE)}
      </Button>
      {showPicker && (
        <DateTimePicker
          value={value}
          mode={mode}
          display="default"
          timeZoneName={getAppTimeZone()}
          minimumDate={minDate}
          maximumDate={maxDate}
          onChange={handleChange}
          testID={testID ? `${testID}-picker` : undefined}
        />
      )}
    </View>
  );
};

export default Calendar;
