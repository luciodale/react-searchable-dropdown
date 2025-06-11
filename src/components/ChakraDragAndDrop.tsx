import { Box, Text } from "@chakra-ui/react";
import { useState } from "react";
import { DragAndDrop, SortableItem, type Item } from "./D&D/BasicDragAndDrop";

export default function ChakraDragAndDrop() {
	const [items, setItems] = useState<Item[]>([
		{ id: "1", content: "Item 1" },
		{ id: "2", content: "Item 2" },
		{ id: "3", content: "Item 3" },
		{ id: "4", content: "Item 4" },
		{ id: "5", content: "Item 5" },
	]);

	return (
		<Box p={5}>
			<Text fontSize="2xl" fontWeight="bold" mb={4}>
				Chakra UI Drag and Drop Example
			</Text>
			<DragAndDrop items={items} onDrop={setItems}>
				<Box display="flex" flexDirection="row">
					{items.map((item) => (
						<SortableItem key={item.id} id={item.id}>
							<Box p={4} m={2} bg="gray.400" borderRadius="md">
								<Text fontWeight="bold">{item.content}</Text>
							</Box>
						</SortableItem>
					))}
				</Box>
			</DragAndDrop>
		</Box>
	);
}
