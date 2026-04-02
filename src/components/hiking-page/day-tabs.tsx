import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type DayTabsProps = {
  days: number[];
  defaultValue?: string;
  children: (day: number) => React.ReactNode;
  triggerLabel?: (day: number) => React.ReactNode;
  contentValue?: (day: number) => string;
  className?: string;
};

/**
 * Generic day-based tabs component.
 * Used to render content for each day of a hike.
 */
export const DayTabs = ({
  days,
  defaultValue,
  children,
  triggerLabel = (day) => `Day ${day}`,
  contentValue = (day) => `day-${day}`,
  className,
}: DayTabsProps) => {
  const defaultTab = defaultValue ?? (days.length > 0 ? contentValue(days[0]) : undefined);

  if (days.length === 0) {
    return null;
  }

  return (
    <Tabs defaultValue={defaultTab} orientation="vertical" className={`w-full gap-4 md:flex-row ${className ?? ""}`}>
      <TabsList className="h-auto w-full justify-start md:w-40 md:flex-col md:items-stretch">
        {days.map((day) => (
          <TabsTrigger key={day} value={contentValue(day)} className="justify-start">
            {triggerLabel(day)}
          </TabsTrigger>
        ))}
      </TabsList>
      <div className="flex-1">
        {days.map((day) => (
          <TabsContent key={day} value={contentValue(day)} className="pt-1">
            {children(day)}
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
};
