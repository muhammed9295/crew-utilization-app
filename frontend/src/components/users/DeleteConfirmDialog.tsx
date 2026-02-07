
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DeleteConfirmDialogProps {
    isOpen: boolean;
    onClose: (open: boolean) => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
}

export function DeleteConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Deletion",
    description = "Are you sure you want to delete this item? This action cannot be undone."
}: DeleteConfirmDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onClose(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={onConfirm}>Confirm Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
