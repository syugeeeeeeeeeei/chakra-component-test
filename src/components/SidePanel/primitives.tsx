import { Button, IconButton, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { type ReactNode } from 'react';
import { FaTrash } from 'react-icons/fa';
import { useItem, useRoot } from './hooks';

const MotionButton = motion.create(Button);

// =================================================================
// Trigger
// =================================================================

interface TriggerProps {
	children: ReactNode;
}

export function Trigger({ children }: TriggerProps) {
	const { state, props } = useItem();
	const { styles } = useRoot();

	return (
		<MotionButton
			variant={state.isSelected ? 'solid' : 'ghost'}
			bg={state.isSelected ? styles.primaryButtonColor : 'transparent'}
			color={state.isSelected ? 'white' : styles.textColor}
			flex="1"
			justifyContent="flex-start"
			size="sm"
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
			_hover={{
				bg: state.isSelected ? styles.hoverAccentColor : styles.itemHoverBgColor,
			}}
			{...props.triggerProps}
		>
			{children}
		</MotionButton>
	);
}

// =================================================================
// Text
// =================================================================

export function ItemText() {
	const { item } = useItem();
	return (
		<Text noOfLines={1} fontSize="sm">
			{item.title}
		</Text>
	);
}

// =================================================================
// DeleteButton
// =================================================================

export function DeleteButton() {
	const { props } = useItem();
	const { styles } = useRoot();

	if (!props.deleteButtonProps) {
		return null;
	}

	return (
		<IconButton
			icon={<FaTrash />}
			variant="ghost"
			colorScheme={styles.deleteButtonColorScheme}
			size="sm"
			{...props.deleteButtonProps}
		/>
	);
}
