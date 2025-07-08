import { Flex, HStack, IconButton, Tooltip } from '@chakra-ui/react';
import { useCallback } from 'react';
import { FaAngleLeft, FaAngleRight, FaBars } from 'react-icons/fa';
import { useRoot } from './hooks';

export function Header() {
	const { isOpen, isClickOpen, handleOpenClick, isToggleButtonHoveredRef } = useRoot();

	const handleIconButtonMouseEnter = useCallback(
		() => {
			isToggleButtonHoveredRef.current = true;
		},
		[isToggleButtonHoveredRef]
	);

	const handleIconButtonMouseLeave = useCallback(() => {
		isToggleButtonHoveredRef.current = false;
	}, [isToggleButtonHoveredRef]);

	const panelToggleButtonIcon = isOpen && isClickOpen ? <FaBars /> : isOpen ? <FaAngleLeft /> : <FaAngleRight />;
	const panelToggleButtonTooltip = isOpen && isClickOpen ? '固定解除して閉じる' : isOpen ? '固定する' : '開く';

	return (
		<HStack h={'42px'} justifyContent="flex-start" alignItems="center">
			<Tooltip label={panelToggleButtonTooltip} placement="right">
				<IconButton
					aria-label="Toggle Panel"
					icon={panelToggleButtonIcon}
					variant="ghost"
					onClick={handleOpenClick}
					onMouseEnter={handleIconButtonMouseEnter}
					onMouseLeave={handleIconButtonMouseLeave}
				/>
			</Tooltip>
			<Flex flex="1" justifyContent="flex-end" alignItems="center" overflow="hidden">
				{/* 検索バーなどのUIはここに配置可能 */}
			</Flex>
		</HStack>
	);
}
