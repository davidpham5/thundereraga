import React from 'react';
import { SafeAreaView, View, ViewStyle, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '../ThemeProvider';

export interface ScreenProps {
  children: React.ReactNode;
  /** Padding on the horizontal edges. Defaults to space[5]. */
  padded?: boolean;
  /** Make the content area scroll. */
  scroll?: boolean;
  /** Render inside a KeyboardAvoidingView (ios offset = 0). */
  keyboardAware?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}

/**
 * Screen — the top-level container for every route. Applies safe-area
 * insets, the theme background, default horizontal padding, and optional
 * scroll / keyboard behavior.
 */
export const Screen: React.FC<ScreenProps> = ({
  children, padded = true, scroll = false, keyboardAware = false, style, contentStyle,
}) => {
  const { theme, space } = useTheme();

  const content = (
    <View style={[{
      flex: 1,
      paddingHorizontal: padded ? space[5] : 0,
    }, contentStyle]}>
      {children}
    </View>
  );

  const Wrapped = scroll ? (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: padded ? space[5] : 0,
        paddingBottom: space[8],
      }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : content;

  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: theme.color.bg }, style]}>
      {keyboardAware ? (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {Wrapped}
        </KeyboardAvoidingView>
      ) : Wrapped}
    </SafeAreaView>
  );
};

export interface StackProps {
  children: React.ReactNode;
  gap?: number;
  direction?: 'row' | 'column';
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between';
  style?: ViewStyle;
}

/**
 * Stack — tiny layout helper. Use instead of sprinkling ad-hoc `gap` styles.
 */
export const Stack: React.FC<StackProps> = ({
  children, gap, direction = 'column', align, justify, style,
}) => {
  const { space } = useTheme();
  return (
    <View style={[{
      flexDirection: direction,
      gap: gap ?? space[4],
      alignItems: align,
      justifyContent: justify,
    }, style]}>
      {children}
    </View>
  );
};
