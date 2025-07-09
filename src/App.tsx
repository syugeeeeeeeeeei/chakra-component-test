import {
  Box,
  Center,
  ChakraProvider,
  Heading,
  HStack,
  Text
} from "@chakra-ui/react";
import { useState } from "react";
import {
  DeletableProvider,
  SearchProvider,
  SelectionProvider,
  SidePanel,
  type SidePanelItem,
} from "./components/SidePanel"; // パスは環境に合わせてください

const initialItems: SidePanelItem[] = [
  { id: "proj-1", title: "次世代UIフレームワーク開発", category: "project" },
  { id: "proj-2", title: "AI搭載型コードレビューツール", category: "project" },
  { id: "task-1", title: "UIデザインシステムの構築", category: "task" },
  { id: "task-2", title: "APIスキーマの定義と実装", category: "task" },
  { id: "task-3", title: "E2Eテスト環境のセットアップ", category: "task" },
  { id: "report-1", title: "2025年上期技術レポート", category: "report" },
];

function App() {
  const [items, setItems] = useState(initialItems);

  const handleDelete = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  return (
    <ChakraProvider>
      <Box display="flex" h="100vh" w="100vw">
        <SearchProvider>
          <SelectionProvider items={items}>
            <DeletableProvider onDeleteItem={handleDelete}>
              <SidePanel items={items} styles={{ panelBgColor: "gray.50" }}>
                <SidePanel.Header />
                <SidePanel.List>
                  <SidePanel.List.Empty>
                    <Center h="100%">
                      <Text color="gray.500">アイテムが見つかりません</Text>
                    </Center>
                  </SidePanel.List.Empty>

                  <SidePanel.List.Section category="project">
                    <SidePanel.List.Header>プロジェクト</SidePanel.List.Header>
                    <SidePanel.List.Section.Empty>
                      <Center h="50px">
                        <Text fontSize="sm" color="gray.400">
                          プロジェクトはありません
                        </Text>
                      </Center>
                    </SidePanel.List.Section.Empty>
                    {/* ★新しいAPI: Contentコンポーネントでアイテムの描画方法を定義 */}
                    <SidePanel.List.Section.Content>
                      {(item: SidePanelItem) => (
                        <SidePanel.List.Item key={item.id} item={item}>
                          <HStack w="100%">
                            <SidePanel.List.Item.Trigger>
                              <SidePanel.List.Item.Text />
                            </SidePanel.List.Item.Trigger>
                            <SidePanel.List.Item.DeleteButton />
                          </HStack>
                        </SidePanel.List.Item>
                      )}
                    </SidePanel.List.Section.Content>
                  </SidePanel.List.Section>

                  <SidePanel.List.Section category="task">
                    <SidePanel.List.Header>タスク</SidePanel.List.Header>
                    <SidePanel.List.Section.Empty>
                      <Center h="50px">
                        <Text fontSize="sm" color="gray.400">
                          タスクはありません
                        </Text>
                      </Center>
                    </SidePanel.List.Section.Empty>
                    <SidePanel.List.Section.Content>
                      {(item: SidePanelItem) => (
                        <SidePanel.List.Item key={item.id} item={item}>
                          <HStack w="100%">
                            <SidePanel.List.Item.Trigger>
                              <SidePanel.List.Item.Text />
                            </SidePanel.List.Item.Trigger>
                            <SidePanel.List.Item.DeleteButton />
                          </HStack>
                        </SidePanel.List.Item>
                      )}
                    </SidePanel.List.Section.Content>
                  </SidePanel.List.Section>

                  <SidePanel.List.Section category="report" selectionEnabled={false}>
                    <SidePanel.List.Header>レポート (選択不可)</SidePanel.List.Header>
                    <SidePanel.List.Section.Content>
                      {(item: SidePanelItem) => (
                        <SidePanel.List.Item key={item.id} item={item}>
                          <HStack w="100%">
                            <SidePanel.List.Item.Trigger>
                              <SidePanel.List.Item.Text />
                            </SidePanel.List.Item.Trigger>
                            <SidePanel.List.Item.DeleteButton />
                          </HStack>
                        </SidePanel.List.Item>
                      )}
                    </SidePanel.List.Section.Content>
                  </SidePanel.List.Section>

                </SidePanel.List>
              </SidePanel>
            </DeletableProvider>
          </SelectionProvider>
        </SearchProvider>
        <Box as="main" flex="1" p={8}>
          <Heading>Declarative SidePanel</Heading>
          <Text mt={4}>
            アイテムの削除が正しく反映され、より直感的なAPIでリストを構築できるようになりました。
          </Text>
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default App;
