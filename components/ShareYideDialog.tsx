import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import LabeledInput from "@/components/labeled-input";

interface ShareYideDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  organizerName: string;
  setOrganizerName: (value: string) => void;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  additionalPassengers: number;
  setAdditionalPassengers: (value: number) => void;
  description: string;
  setDescription: (value: string) => void;
  handleShareYide: (e: React.FormEvent) => void;
}

export default function ShareYideDialog({
  open,
  setOpen,
  organizerName,
  setOrganizerName,
  phoneNumber,
  setPhoneNumber,
  additionalPassengers,
  setAdditionalPassengers,
  description,
  setDescription,
  handleShareYide,
}: ShareYideDialogProps) {
const isFormValid = organizerName.trim() !== "" && phoneNumber.trim() !== "";
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Share a Yide</DialogTitle>
          <DialogDescription>
            Fill out the additional details below to create a new ride listing.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleShareYide}>
          <LabeledInput
            label="Organizer name"
            placeholder="Peter Salovey"
            value={organizerName}
            onChange={(e) => setOrganizerName(e.target.value)}
          />
          <LabeledInput
            label="Phone Number"
            placeholder="555-555-5555"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <LabeledInput
            label="Number of additional passengers"
            placeholder="e.g. 3"
            type="number"
            value={additionalPassengers}
            onChange={(e) => setAdditionalPassengers(+e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium">Description (optional)</label>
            <textarea
              className="w-full border p-2 rounded text-sm"
              rows={3}
              placeholder="I have two suitcases, planning to order an UberXL..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="submit"
            disabled={!isFormValid}
            >Post Yide</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
