'use client';

import { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import useDashboardStore from '@/store/dashboardStore';
import WidgetCard from './widgets/WidgetCard';
import WidgetTable from './widgets/WidgetTable';
import WidgetChart from './widgets/WidgetChart';
import AddWidgetModal from './AddWidgetModal';
import ThemeToggle from './ThemeToggle';
import { BarChart3, Plus } from 'lucide-react';
import { Widget } from '@/types/widget';

interface SortableWidgetProps {
  widget: Widget;
}

function SortableWidget({ widget }: SortableWidgetProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: widget.id });
  const removeWidget = useDashboardStore((state) => state.removeWidget);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const renderWidget = () => {
    switch (widget.displayMode) {
      case 'card':
        return <WidgetCard widget={widget} />;
      case 'table':
        return <WidgetTable widget={widget} />;
      case 'chart':
        return <WidgetChart widget={widget} />;
      default:
        return <WidgetCard widget={widget} />;
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 z-10 cursor-move opacity-0 group-hover:opacity-100 transition-opacity bg-gray-700 hover:bg-gray-600 rounded p-1"
        title="Drag to reorder"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="6" cy="3" r="1.5" />
          <circle cx="10" cy="3" r="1.5" />
          <circle cx="6" cy="8" r="1.5" />
          <circle cx="10" cy="8" r="1.5" />
          <circle cx="6" cy="13" r="1.5" />
          <circle cx="10" cy="13" r="1.5" />
        </svg>
      </div>
      {renderWidget()}
    </div>
  );
}

export default function Dashboard() {
  const widgets = useDashboardStore((state) => state.widgets);
  const theme = useDashboardStore((state) => state.theme);
  const reorderWidgets = useDashboardStore((state) => state.reorderWidgets);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = widgets.findIndex((w) => w.id === active.id);
      const newIndex = widgets.findIndex((w) => w.id === over.id);
      reorderWidgets(arrayMove(widgets, oldIndex, newIndex));
    }
  };

  const gridCols = widgets.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'} transition-colors`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="text-green-500" size={24} />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Finance Dashboard</h1>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {widgets.length} active widget{widgets.length !== 1 ? 's' : ''} • Real-time data
            </p>
          </div>
          <div className="flex gap-3">
            <ThemeToggle />
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
            >
              <Plus size={20} />
              Add Widget
            </button>
          </div>
        </div>

        {/* Widgets Grid */}
        {widgets.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg mb-4">
              <Plus className="mx-auto text-gray-400 dark:text-gray-600 mb-4" size={48} />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Add Widget</h3>
              <p className="text-gray-500 dark:text-gray-500">Connect to a finance API and create a custom widget</p>
            </div>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={widgets.map((w) => w.id)} strategy={rectSortingStrategy}>
              <div className={`grid ${gridCols} gap-6`}>
                {widgets.map((widget) => (
                  <SortableWidget key={widget.id} widget={widget} />
                ))}
                {/* Add Widget Placeholder */}
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 hover:border-green-500 dark:hover:border-green-500 transition-colors flex flex-col items-center justify-center min-h-[300px]"
                >
                  <div className="bg-green-500 rounded-full p-4 mb-4">
                    <Plus className="text-white" size={32} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Add Widget</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-500 text-center">
                    Connect to a finance API and create a custom widget
                  </p>
                </button>
              </div>
            </SortableContext>
          </DndContext>
        )}

        {/* Add Widget Modal */}
        {isAddModalOpen && <AddWidgetModal onClose={() => setIsAddModalOpen(false)} />}
      </div>
    </div>
  );
}
