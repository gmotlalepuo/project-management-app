import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/Components/ui/alert-dialog";
import {
  AlertDialogDescription,
  AlertDialogTitle,
} from "@radix-ui/react-alert-dialog";

type DialogConfig = {
  isOpen: boolean;
  title: string;
  description: string;
  action: () => void;
  actionText: string;
};

export function useConfirmationDialog() {
  const [dialogConfig, setDialogConfig] = useState<DialogConfig>({
    isOpen: false,
    title: "",
    description: "",
    action: () => {},
    actionText: "",
  });

  const closeDialog = () => {
    setDialogConfig((prev) => ({ ...prev, isOpen: false }));
  };

  const confirmDialog = () => {
    dialogConfig.action();
    closeDialog();
  };

  const showConfirmation = (config: Omit<DialogConfig, "isOpen">) => {
    setDialogConfig({
      ...config,
      isOpen: true,
    });
  };

  const ConfirmationDialog = () => (
    <AlertDialog
      open={dialogConfig.isOpen}
      onOpenChange={(open) => !open && closeDialog()}
    >
      <AlertDialogContent>
        <AlertDialogTitle>{dialogConfig.title}</AlertDialogTitle>
        <AlertDialogDescription>{dialogConfig.description}</AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={closeDialog}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={confirmDialog}>
            {dialogConfig.actionText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return {
    showConfirmation,
    ConfirmationDialog,
  };
}
