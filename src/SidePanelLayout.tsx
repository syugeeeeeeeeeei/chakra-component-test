import { Box, Heading, HStack, Select, Text, VStack } from '@chakra-ui/react';
import { useCallback } from 'react';
import { SidePanel } from './components/SidePanel';
import { useSidePanel } from './components/SidePanel/hooks';
import type { SidePanelItem } from './components/SidePanel/types';

// --- Demo Data ---

type Category = 'tech' | 'project';

interface MyItem extends SidePanelItem {
	category: Category;
}

const defaultItems: MyItem[] = [
	{ id: 'tech-1', title: 'React', category: 'tech' },
	{ id: 'tech-2', title: 'TypeScript', category: 'tech' },
	{ id: 'tech-3', title: 'Chakra UI', category: 'tech' },
	{ id: 'project-1', title: 'SidePanel開発', category: 'project' },
	{ id: 'project-2', title: 'UI改善タスク', category: 'project' },
];

/**
 * SidePanelの内部コンテンツをレンダリングするコンポーネント
 * useSidePanelフックはこのコンポーネント内で呼び出す
 */
const PanelContent = () => {
	const { filteredItems, handleCreateItem } = useSidePanel();

	const allItems = filteredItems as MyItem[];
	const techItems = allItems.filter(item => item.category === 'tech');
	const projectItems = allItems.filter(item => item.category === 'project');

	const handleCreateProject = useCallback(() => {
		handleCreateItem<Category>({
			title: '新規プロジェクト',
			category: 'project',
		});
	}, [handleCreateItem]);

	const handleCreateTech = useCallback(() => {
		handleCreateItem<Category>({
			title: '新規技術スタック',
			category: 'tech'
		})
	}, [handleCreateItem])

	return (
		<SidePanel.List>
			{/* "技術スタック" セクション (複数選択、削除不可) */}
			<SidePanel.List.Section selectionMode="multiple" isDeletable={false}>
				<SidePanel.List.Header onCreate={handleCreateTech}>
					技術スタック (削除不可)
				</SidePanel.List.Header>
				<SidePanel.List.Content>
					{techItems.map((item) => (
						<SidePanel.List.Item key={item.id} item={item} />
					))}
				</SidePanel.List.Content>
			</SidePanel.List.Section>

			{/* "プロジェクト" セクション (単一選択、削除可能) */}
			<SidePanel.List.Section selectionMode="single">
				<SidePanel.List.Header onCreate={handleCreateProject}>
					プロジェクト (削除可能)
				</SidePanel.List.Header>
				<SidePanel.List.Content>
					{/* {projectItems.map((item) => (
						<SidePanel.List.Item key={item.id} item={item} />
					))} */}
					<Select placeholder='Select option'>
						<option value='option1'>Option 1</option>
						<option value='option2'>Option 2</option>
						<option value='option3'>Option 3</option>
					</Select>
				</SidePanel.List.Content>
			</SidePanel.List.Section>
		</SidePanel.List>
	);
}


/**
 * デモページ全体のレイアウトを定義するメインコンポーネント
 */
const SidePanelLayout = () => {
	return (
		<HStack spacing={0} w="100%" h="100vh" bg="gray.50">
			<SidePanel
				selectionMode="multiple"
				defaultItems={defaultItems}
				defaultActiveItemIds={['tech-1', 'project-1']}
			>
				<SidePanel.Header />
				<SidePanel.CreateButton
					createButtonText="プロジェクト作成"
					defaultItem={{
						title: '新規プロジェクト',
						category: 'project'
					}}
				/>
				{/* SidePanelの子要素としてPanelContentを配置 */}
				<PanelContent />
			</SidePanel>

			{/* 右側の説明パネル */}
			<VStack flex="1" p={8} align="flex-start" spacing={8}>
				<Heading as="h1" size="xl">SidePanel Demo</Heading>

				<Box>
					<Heading as="h2" size="md" mb={3}>セクションごとの選択モード</Heading>
					<Text>
						セクションごとに異なる選択モードが設定されています。
					</Text>
					<VStack align="stretch" mt={4} spacing={3}>
						<Box p={4} borderWidth="1px" borderRadius="md" bg="white">
							<Heading size="sm">技術スタック</Heading>
							<Text mt={1}>このセクションは <strong>複数選択 (multiple)</strong> モードです。</Text>
						</Box>
						<Box p={4} borderWidth="1px" borderRadius="md" bg="white">
							<Heading size="sm">プロジェクト</Heading>
							<Text mt={1}>このセクションは <strong>単一選択 (single)</strong> モードです。</Text>
						</Box>
					</VStack>
				</Box>

				<Box>
					<Heading as="h2" size="md" mb={3}>アイテムの削除制御</Heading>
					<Text>
						<code>isDeletable</code> prop を使うことで、セクションごとにアイテムの削除可否を制御できます。
					</Text>
					<VStack align="stretch" mt={4} spacing={3}>
						<Box p={4} borderWidth="1px" borderRadius="md" bg="white">
							<Heading size="sm">技術スタック</Heading>
							<Text mt={1}>このセクションは <strong>削除不可 (isDeletable=false)</strong> に設定されており、削除ボタンは表示されません。</Text>
						</Box>
						<Box p={4} borderWidth="1px" borderRadius="md" bg="white">
							<Heading size="sm">プロジェクト</Heading>
							<Text mt={1}>こちらは <strong>削除可能 (デフォルト)</strong> です。アイテムにマウスカーソルを合わせるとゴミ箱アイコンが表示されます。</Text>
						</Box>
					</VStack>
				</Box>

			</VStack>
		</HStack>
	);
};

export default SidePanelLayout;
