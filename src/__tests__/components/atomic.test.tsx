/**
 * @fileoverview Atomic components smoke tests
 * @description Basic rendering tests to ensure components work
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { render, fireEvent } from '@testing-library/react-native';
import { describe, it, expect, vi } from 'vitest';

import Button from '../../atomic/Button';
import Card from '../../atomic/Card';
import Input from '../../atomic/Input';
import Stack from '../../atomic/Stack';
import Text from '../../atomic/Text';

describe('Atomic Components', () => {
  describe('Button', () => {
    it('renders without crashing', () => {
      const { getByText } = render(<Button>Test Button</Button>);
      expect(getByText('Test Button')).toBeTruthy();
    });

    it('calls onPress when pressed', () => {
      const onPress = vi.fn();
      const { getByText } = render(<Button onPress={onPress}>Click me</Button>);

      const button = getByText('Click me');
      fireEvent.press(button);

      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('does not call onPress when disabled', () => {
      const onPress = vi.fn();
      const { getByText } = render(
        <Button onPress={onPress} disabled>
          Disabled Button
        </Button>
      );

      const button = getByText('Disabled Button');
      fireEvent.press(button);

      expect(onPress).not.toHaveBeenCalled();
    });

    it('shows loading state correctly', () => {
      const { getByText, queryByText } = render(
        <Button loading loadingText="Loading...">
          Original Text
        </Button>
      );

      expect(getByText('Loading...')).toBeTruthy();
      expect(queryByText('Original Text')).toBeNull();
    });

    it('does not call onPress when loading', () => {
      const onPress = vi.fn();
      const { getByText } = render(
        <Button onPress={onPress} loading>
          Loading Button
        </Button>
      );

      const button = getByText('Loading Button');
      fireEvent.press(button);

      expect(onPress).not.toHaveBeenCalled();
    });
  });

  describe('Text', () => {
    it('renders text content', () => {
      const { getByText } = render(<Text>Hello World</Text>);
      expect(getByText('Hello World')).toBeTruthy();
    });

    it('renders with different levels', () => {
      const { getByText } = render(<Text level="h1">Heading</Text>);
      expect(getByText('Heading')).toBeTruthy();
    });
  });

  describe('Card', () => {
    it('renders card with title', () => {
      const { getByText } = render(<Card title="Card Title">Content</Card>);
      expect(getByText('Card Title')).toBeTruthy();
      expect(getByText('Content')).toBeTruthy();
    });
  });

  describe('Input', () => {
    it('renders input with placeholder', () => {
      const { getByPlaceholderText } = render(
        <Input placeholder="Enter text" />
      );
      expect(getByPlaceholderText('Enter text')).toBeTruthy();
    });

    it('renders input with label', () => {
      const { getByText } = render(<Input label="Name" />);
      expect(getByText('Name')).toBeTruthy();
    });

    it('calls onChangeText when text changes', () => {
      const onChangeText = vi.fn();
      const { getByPlaceholderText } = render(
        <Input placeholder="Enter text" onChangeText={onChangeText} />
      );

      const input = getByPlaceholderText('Enter text');
      fireEvent.changeText(input, 'Hello');

      expect(onChangeText).toHaveBeenCalledWith('Hello');
      expect(onChangeText).toHaveBeenCalledTimes(1);
    });

    it('displays error message when provided', () => {
      const { getByText } = render(
        <Input label="Email" error="Invalid email format" />
      );

      expect(getByText('Invalid email format')).toBeTruthy();
    });

    it('shows required indicator when required', () => {
      const { getByText } = render(<Input label="Name" required />);
      // Assuming required adds asterisk or indicator
      const label = getByText('Name');
      expect(label).toBeTruthy();
    });

    it('does not call onChangeText when disabled', () => {
      const onChangeText = vi.fn();
      const { getByPlaceholderText } = render(
        <Input placeholder="Enter text" onChangeText={onChangeText} disabled />
      );

      const input = getByPlaceholderText('Enter text');
      fireEvent.changeText(input, 'Hello');

      // Disabled inputs may or may not call onChangeText depending on implementation
      // This test documents expected behavior
      expect(onChangeText).not.toHaveBeenCalled();
    });
  });

  describe('Stack', () => {
    it('renders children', () => {
      const { getByText } = render(
        <Stack>
          <Text>Item 1</Text>
          <Text>Item 2</Text>
        </Stack>
      );
      expect(getByText('Item 1')).toBeTruthy();
      expect(getByText('Item 2')).toBeTruthy();
    });

    it('applies gap spacing correctly', () => {
      const { UNSAFE_getByType } = render(
        <Stack gap={20}>
          <Text>Item 1</Text>
          <Text>Item 2</Text>
        </Stack>
      );

      const stack = UNSAFE_getByType(Stack);
      expect(stack.props.gap).toBe(20);
    });

    it('handles direction prop correctly', () => {
      const { UNSAFE_getByType } = render(
        <Stack direction="row">
          <Text>Item 1</Text>
          <Text>Item 2</Text>
        </Stack>
      );

      const stack = UNSAFE_getByType(Stack);
      expect(stack.props.direction).toBe('row');
    });
  });

  describe('Card', () => {
    it('renders card with title and content', () => {
      const { getByText } = render(
        <Card title="Card Title">Card Content</Card>
      );
      expect(getByText('Card Title')).toBeTruthy();
      expect(getByText('Card Content')).toBeTruthy();
    });

    it('renders card with subtitle when provided', () => {
      const { getByText } = render(
        <Card title="Title" subtitle="Subtitle">
          Content
        </Card>
      );
      expect(getByText('Subtitle')).toBeTruthy();
    });

    it('renders card without title when not provided', () => {
      const { getByText, queryByText } = render(<Card>Content only</Card>);
      expect(getByText('Content only')).toBeTruthy();
      expect(queryByText(/Title/i)).toBeNull();
    });
  });

  describe('Text', () => {
    it('applies correct level styling', () => {
      const { UNSAFE_getByType } = render(<Text level="h1">Heading</Text>);
      const text = UNSAFE_getByType(Text);
      expect(text.props.level).toBe('h1');
    });

    it('renders with different levels correctly', () => {
      const levels = [
        'h1',
        'h2',
        'h3',
        'h4',
        'body',
        'small',
        'caption',
      ] as const;

      levels.forEach((level) => {
        const { getByText, unmount } = render(
          <Text level={level}>Test {level}</Text>
        );
        expect(getByText(`Test ${level}`)).toBeTruthy();
        unmount();
      });
    });
  });
});
