import type { DragEndEvent } from "@dnd-kit/core";
import {
	DndContext,
	PointerSensor,
	closestCenter,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	SortableContext,
	arrayMove,
	rectSortingStrategy,
	useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ReactNode } from "react";

interface Item {
	id: string;
	content: string;
}

type SortableItemProps = {
	id: string;
	children: ReactNode;
};

function SortableItem({ id, children }: SortableItemProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id });

	const itemStyle = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
		cursor: "grab",
		userSelect: "none",
		position: "relative",
		zIndex: isDragging ? 1 : 0,
	} satisfies React.CSSProperties;

	// Create a wrapper div for the sortable functionality
	return (
		<div style={itemStyle} ref={setNodeRef} {...listeners} {...attributes}>
			{children}
		</div>
	);
}

interface DragAndDropProps {
	items: Item[];
	onDrop: (newItems: Item[]) => void;
	children: ReactNode;
}

function DragAndDrop({ items, onDrop, children }: DragAndDropProps) {
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
	);

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			const oldIndex = items.findIndex((item) => item.id === active.id);
			const newIndex = items.findIndex((item) => item.id === over.id);

			const newItems = arrayMove(items, oldIndex, newIndex);
			onDrop(newItems);
		}
	}

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
		>
			<SortableContext
				items={items.map((i) => i.id)}
				strategy={rectSortingStrategy}
			>
				{children}
			</SortableContext>
		</DndContext>
	);
}

export { DragAndDrop, SortableItem };
export type { DragAndDropProps, Item, SortableItemProps };
