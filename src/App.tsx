import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  ChakraProvider,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import {
  DeletableProvider,
  SelectionProvider,
  SidePanel,
  type SelectionMode,
  type SidePanelItem,
} from './components/SidePanel'; // パスは実際の環境に合わせてください

// --- 初期データ ---
const initialItems: SidePanelItem[] = [
  { id: 'proj-1', title: '次世代UIフレームワーク開発', category: 'project' },
  { id: 'proj-2', title: 'AI搭載型コードレビューツール', category: 'project' },
  { id: 'task-1', title: 'UIデザインシステムの構築', category: 'task' },
  { id: 'task-2', title: 'APIスキーマの定義と実装', category: 'task' },
  { id: 'task-3', title: 'E2Eテスト環境のセットアップ', category: 'task' },
  { id: 'report-1', title: '2025年上期技術レポート', category: 'report' },
];

// --- アイテムのUIコンポーネント ---

const ButtonItem = () => (
  <HStack w="100%">
    <SidePanel.List.Item.Trigger>
      <SidePanel.List.Item.Text />
    </SidePanel.List.Item.Trigger>
    <SidePanel.List.Item.DeleteButton />
  </HStack>
);

const AccordionItemComponent = () => (
  <Accordion allowToggle w="100%">
    <AccordionItem border="none">
      <AccordionButton as="div" w="100%" p={0} _hover={{ bg: 'transparent' }}>
        <SidePanel.List.Item.Trigger>
          <HStack w="100%" justifyContent="space-between">
            <SidePanel.List.Item.Text />
            <AccordionIcon />
          </HStack>
        </SidePanel.List.Item.Trigger>
      </AccordionButton>
      <AccordionPanel pb={4}>
        <Text fontSize="sm">ここにアイテムの詳細情報を表示できます。</Text>
        <SidePanel.List.Item.DeleteButton />
      </AccordionPanel>
    </AccordionItem>
  </Accordion>
);

// --- メインのデモページコンポーネント ---

function SidePanelDemoPage() {
  // --- State管理 ---
  const [items, setItems] = useState(initialItems);
  const [isSelectionEnabled, setSelectionEnabled] = useState(true);
  const [isDeletableEnabled, setDeletableEnabled] = useState(true);
  const [projectSectionMode, setProjectSectionMode] = useState<SelectionMode>('single');
  const [taskSectionMode, setTaskSectionMode] = useState<SelectionMode>('multiple');
  const [itemComponentType, setItemComponentType] = useState<'button' | 'accordion'>('button');

  // --- データとハンドラ ---
  const projectItems = useMemo(() => items.filter((item) => item.category === 'project'), [items]);
  const taskItems = useMemo(() => items.filter((item) => item.category === 'task'), [items]);
  const reportItems = useMemo(() => items.filter((item) => item.category === 'report'), [items]);

  const handleDelete = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  // --- UIコンポーネントの選択 ---
  const ItemComponent = itemComponentType === 'button' ? ButtonItem : AccordionItemComponent;

  // --- Providerを条件に応じてラップする ---
  const SidePanelWithProviders = (
    <SidePanel defaultItems={items} styles={{ panelBgColor: 'gray.50' }}>
      <SidePanel.Header />
      <SidePanel.List>
        {/* プロジェクトセクション */}
        <SidePanel.List.Section {...(isSelectionEnabled ? { selectionMode: projectSectionMode } : {})}>
          <SidePanel.List.Header>プロジェクト</SidePanel.List.Header>
          {projectItems.map((item) => (
            <SidePanel.List.Item key={item.id} item={item}>
              <ItemComponent />
            </SidePanel.List.Item>
          ))}
        </SidePanel.List.Section>

        {/* タスクセクション */}
        <SidePanel.List.Section {...(isSelectionEnabled ? { selectionMode: taskSectionMode } : {})}>
          <SidePanel.List.Header>タスク</SidePanel.List.Header>
          {taskItems.map((item) => (
            <SidePanel.List.Item key={item.id} item={item}>
              <ItemComponent />
            </SidePanel.List.Item>
          ))}
        </SidePanel.List.Section>

        {/* レポートセクション (選択無効) */}
        <SidePanel.List.Section {...(isSelectionEnabled ? { selectionEnabled: false } : {})}>
          <SidePanel.List.Header>レポート (選択不可)</SidePanel.List.Header>
          {reportItems.map((item) => (
            <SidePanel.List.Item key={item.id} item={item}>
              <ItemComponent />
            </SidePanel.List.Item>
          ))}
        </SidePanel.List.Section>
      </SidePanel.List>
    </SidePanel>
  );

  let finalComponent = SidePanelWithProviders;
  if (isDeletableEnabled) {
    finalComponent = <DeletableProvider onDeleteItem={handleDelete}>{finalComponent}</DeletableProvider>;
  }
  if (isSelectionEnabled) {
    // `defaultMode` は、セクションで指定されなかった場合のフォールバックとして機能します。
    finalComponent = <SelectionProvider items={items} defaultMode="multiple">{finalComponent}</SelectionProvider>;
  }

  return (
    <Box display="flex" h="100vh" w="100vw">
      {finalComponent}
      <Box as="main" flex="1" p={8} overflowY="auto">
        <VStack spacing={8} align="flex-start">
          <Heading size="lg">SidePanel カスタマイズデモ</Heading>
          <Text>右側のコントロールを操作して、左側のサイドパネルの挙動を切り替えることができます。</Text>

          <Divider />

          <VStack spacing={6} align="flex-start" w="100%">
            <Heading size="md">機能の有効化</Heading>
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="selection-switch" mb="0">
                選択機能 (`SelectionProvider`)
              </FormLabel>
              <Switch id="selection-switch" isChecked={isSelectionEnabled} onChange={(e) => setSelectionEnabled(e.target.checked)} />
            </FormControl>
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="deletable-switch" mb="0">
                削除機能 (`DeletableProvider`)
              </FormLabel>
              <Switch id="deletable-switch" isChecked={isDeletableEnabled} onChange={(e) => setDeletableEnabled(e.target.checked)} />
            </FormControl>
          </VStack>

          <Divider />

          <VStack spacing={6} align="flex-start" w="100%">
            <Heading size="md">セクションごとの設定</Heading>
            <FormControl isDisabled={!isSelectionEnabled}>
              <FormLabel>プロジェクトセクションの選択モード</FormLabel>
              <RadioGroup onChange={(v) => setProjectSectionMode(v as SelectionMode)} value={projectSectionMode}>
                <Stack direction="row">
                  <Radio value="single">単一選択 (single)</Radio>
                  <Radio value="multiple">複数選択 (multiple)</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
            <FormControl isDisabled={!isSelectionEnabled}>
              <FormLabel>タスクセクションの選択モード</FormLabel>
              <RadioGroup onChange={(v) => setTaskSectionMode(v as SelectionMode)} value={taskSectionMode}>
                <Stack direction="row">
                  <Radio value="single">単一選択 (single)</Radio>
                  <Radio value="multiple">複数選択 (multiple)</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
          </VStack>

          <Divider />

          <VStack spacing={6} align="flex-start" w="100%">
            <Heading size="md">アイテムUIの切り替え</Heading>
            <FormControl>
              <FormLabel>コンポーネントタイプ</FormLabel>
              <RadioGroup onChange={(v) => setItemComponentType(v as 'button' | 'accordion')} value={itemComponentType}>
                <Stack direction="row">
                  <Radio value="button">ボタン形式</Radio>
                  <Radio value="accordion">アコーディオン形式</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
          </VStack>
        </VStack>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <ChakraProvider>
      <SidePanelDemoPage />
    </ChakraProvider>
  );
}

export default App;
