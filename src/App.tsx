import { Box } from "@chakra-ui/react"
import SidePanelLayout from "./SidePanelLayout"

function App() {
  return (
    <>
      <Box display="flex" w="100vh" h="100vh">
        <SidePanelLayout/>

        <Box as="main" flex="1" p={8}>
          <h1>メインコンテンツ</h1>
          <p>サイドパネルと連携するエリアです。</p>
        </Box>
      </Box>
    </>
  )
}

export default App
