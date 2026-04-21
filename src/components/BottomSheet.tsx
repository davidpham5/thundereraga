import React from 'react';
import { Modal as RNModal, View, Pressable, ViewStyle } from 'react-native';
import { Text } from './Text';
import { useTheme } from '../ThemeProvider';

export interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  /** Max height as a fraction of screen (0..1). Default 0.85. */
  maxHeight?: number;
  style?: ViewStyle;
}

/**
 * BottomSheet — modal sheet anchored to the bottom with a drag handle.
 * Uses RN Modal for simplicity; swap for react-native-gesture-handler +
 * reanimated later if we want drag-to-dismiss.
 */
export const BottomSheet: React.FC<BottomSheetProps> = ({
  visible, onClose, title, children, maxHeight = 0.85, style,
}) => {
  const { theme, space, radius } = useTheme();
  const c = theme.color;

  return (
    <RNModal transparent animationType="slide" visible={visible} onRequestClose={onClose}>
      <Pressable
        onPress={onClose}
        style={{ flex: 1, backgroundColor: c.overlay, justifyContent: 'flex-end' }}
      >
        <Pressable
          onPress={() => { /* trap */ }}
          style={[{
            backgroundColor: c.surface,
            borderTopLeftRadius: radius.xl,
            borderTopRightRadius: radius.xl,
            paddingHorizontal: space[5],
            paddingTop: space[3],
            paddingBottom: space[7],
            maxHeight: `${Math.round(maxHeight * 100)}%`,
          }, style]}
        >
          <View style={{
            alignSelf: 'center', width: 40, height: 4,
            borderRadius: 2, backgroundColor: c.borderStrong,
            marginBottom: space[4],
          }}/>
          {title ? (
            <Text variant="subtitle" weight="700" style={{ marginBottom: space[4] }}>
              {title}
            </Text>
          ) : null}
          {children}
        </Pressable>
      </Pressable>
    </RNModal>
  );
};
