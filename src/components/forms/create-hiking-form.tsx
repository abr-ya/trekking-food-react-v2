import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const CreateHikingForm = () => {
  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <div className="space-y-2">
        <label htmlFor="hiking-name" className="text-sm font-medium">
          Name
        </label>
        <Input id="hiking-name" name="name" placeholder="e.g. Dolomites — 3 days" disabled />
      </div>
      <div className="space-y-2">
        <label htmlFor="hiking-notes" className="text-sm font-medium">
          Notes
        </label>
        <Textarea
          id="hiking-notes"
          name="notes"
          placeholder="Route, dates, group size…"
          disabled
          className="min-h-[100px] resize-y"
        />
      </div>
      <p className="text-muted-foreground text-xs">Fields will be enabled when the hiking API is connected.</p>
      <Button type="submit" disabled>
        Create hiking
      </Button>
    </form>
  );
};
