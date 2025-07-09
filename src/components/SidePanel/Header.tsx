import { Flex, HStack, IconButton, Input, Tooltip } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useRef } from 'react';
import { FaAngleLeft, FaAngleRight, FaBars, FaSearch, FaTimes } from 'react-icons/fa';
import { useRoot, useSearch } from './hooks';

export function Header() {
	const { isOpen, isClickOpen, handleOpenClick, isToggleButtonHoveredRef, styles } = useRoot();
	const search = useSearch();

	const searchInputRef = useRef<HTMLInputElement>(null);

	const handleIconButtonMouseEnter = useCallback(() => {
		isToggleButtonHoveredRef.current = true;
	}, [isToggleButtonHoveredRef]);

	const handleIconButtonMouseLeave = useCallback(() => {
		isToggleButtonHoveredRef.current = false;
	}, [isToggleButtonHoveredRef]);

	const handleSearchClick = useCallback(() => {
		if (search) {
			search.setIsSearchOpen(true);
			setTimeout(() => searchInputRef.current?.focus(), 50);
		}
	}, [search]);

	const handleClearSearch = useCallback(() => {
		if (search) {
			search.onSearchQueryChange('');
		}
	}, [search]);

	const handleSearchBlur = useCallback(() => {
		setTimeout(() => {
			if (search && search.searchQuery === '') {
				search.setIsSearchOpen(false);
			}
		}, 150);
	}, [search]);

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
			{isOpen && search && (
				<Flex
					flex="1"
					justifyContent="flex-end"
					alignItems="center"
					overflow="hidden"
				>
					<motion.div
						layout
						initial={false}
						animate={{ width: search.isSearchOpen ? "100%" : "32px" }}
						transition={{ duration: 0.2, ease: "easeInOut" }}
						style={{ overflow: "hidden" }}
					>
						<HStack
							spacing={search.isSearchOpen ? 2 : 0}
							bg={styles.searchBarBgColor}
							borderRadius="full"
							pl={search.isSearchOpen ? 3 : 0}
							pr={search.isSearchOpen ? 1 : 0}
							py={search.isSearchOpen ? 1 : 0}
							border={search.isSearchOpen ? "1px solid" : "none"}
							borderColor={styles.accentColor}
							cursor={!search.isSearchOpen ? "pointer" : "default"}
							onClick={!search.isSearchOpen ? handleSearchClick : undefined}
							w="100%"
						>
							<IconButton
								aria-label="Search Items"
								icon={<FaSearch />}
								variant="ghost"
								size="sm"
								onClick={search.isSearchOpen ? undefined : handleSearchClick}
								pointerEvents={search.isSearchOpen ? "none" : "auto"}
								_hover={{ bg: "transparent" }}
								_active={{ bg: "transparent" }}
							/>
							<AnimatePresence>
								{search.isSearchOpen && (
									<motion.div
										initial={{ width: 0, opacity: 0 }}
										animate={{ width: "100%", opacity: 1 }}
										exit={{ width: 0, opacity: 0 }}
										transition={{ duration: 0.2 }}
										style={{ overflow: "hidden", flexGrow: 1 }}
									>
										<Input
											ref={searchInputRef}
											placeholder="検索..."
											size="sm"
											value={search.searchQuery}
											onChange={(e) => search.onSearchQueryChange(e.target.value)}
											variant="unstyled"
											flex="1"
											h="auto"
											onBlur={handleSearchBlur}
											color={styles.textColor}
										/>
									</motion.div>
								)}
							</AnimatePresence>
							<AnimatePresence>
								{search.isSearchOpen && search.searchQuery && (
									<motion.div
										initial={{ opacity: 0, scale: 0 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0 }}
									>
										<IconButton
											aria-label="Clear Search"
											icon={<FaTimes />}
											size="xs"
											isRound
											variant="ghost"
											onClick={handleClearSearch}
										/>
									</motion.div>
								)}
							</AnimatePresence>
						</HStack>
					</motion.div>
				</Flex>
			)}
		</HStack>
	);
}