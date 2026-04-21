// Tether — React Native Design System
// Public API

export { ThemeProvider, useTheme } from './ThemeProvider';
export { themes, lightTheme, darkTheme, palette, space, radius, typography, shadow, motion, hitSlop } from './tokens';
export type { Theme } from './tokens';

// Primitives
export { Text } from './components/Text';
export type { TextProps, TextVariant, TextTone } from './components/Text';

export { Button } from './components/Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './components/Button';

export { Card } from './components/Card';
export type { CardProps, CardVariant, CardAccent } from './components/Card';

export { Badge } from './components/Badge';
export type { BadgeProps, BadgeTone, BadgeSize } from './components/Badge';

export { Avatar } from './components/Avatar';
export type { AvatarProps, AvatarSize } from './components/Avatar';

export { Divider } from './components/Divider';
export type { DividerProps } from './components/Divider';

// Form
export { TextField } from './components/TextField';
export type { TextFieldProps } from './components/TextField';

export { Select } from './components/Select';
export type { SelectProps, SelectOption } from './components/Select';

export { RadioGroup } from './components/RadioGroup';
export type { RadioGroupProps, RadioOption } from './components/RadioGroup';

export { Checkbox } from './components/Checkbox';
export type { CheckboxProps } from './components/Checkbox';

export { Toggle } from './components/Toggle';
export type { ToggleProps } from './components/Toggle';

// Navigation
export { TopBar, BackButton, SectionHeader } from './components/TopBar';
export type { TopBarProps, BackButtonProps, SectionHeaderProps } from './components/TopBar';

export { BottomTabs } from './components/BottomTabs';
export type { BottomTabsProps, BottomTabItem } from './components/BottomTabs';

// Content
export { ListItem } from './components/ListItem';
export type { ListItemProps } from './components/ListItem';

export { MessageBubble } from './components/MessageBubble';
export type { MessageBubbleProps } from './components/MessageBubble';

export { CounselorCard } from './components/CounselorCard';
export type { CounselorCardProps } from './components/CounselorCard';

export { ResourceCard } from './components/ResourceCard';
export type { ResourceCardProps, ResourceKind } from './components/ResourceCard';

export { VideoCard } from './components/VideoCard';
export type { VideoCardProps } from './components/VideoCard';

// Feedback
export { Alert } from './components/Alert';
export type { AlertProps, AlertTone } from './components/Alert';

export { EmptyState } from './components/EmptyState';
export type { EmptyStateProps } from './components/EmptyState';

export { LoadingState } from './components/LoadingState';
export type { LoadingStateProps } from './components/LoadingState';

export { Toast } from './components/Toast';
export type { ToastProps, ToastTone } from './components/Toast';

// Layout
export { Screen, Stack } from './components/Screen';
export type { ScreenProps, StackProps } from './components/Screen';

export { BottomSheet } from './components/BottomSheet';
export type { BottomSheetProps } from './components/BottomSheet';

// Utils
export { generateHandle } from './utils/generateHandle';
