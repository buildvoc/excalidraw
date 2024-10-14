import { useEffect, useState } from "react";

import { useI18n } from "../../packages/excalidraw";
import { Dialog } from "../../packages/excalidraw/components/Dialog";
import { TextField } from "../../packages/excalidraw/components/TextField";
import { FilledButton } from "../../packages/excalidraw/components/FilledButton";
import { KEYS } from "../../packages/excalidraw/keys";
import { useUIAppState } from "../../packages/excalidraw/context/ui-appState";
import { atom, useAtom } from "jotai";

import "./ProjectDialog.scss";
import { toast } from "react-toastify";
import { addProject } from "../api/project";


export const projectDialogStateAtom = atom<
  { isOpen: false } | { isOpen: true; }
>({ isOpen: false });

export type AddProjectDialogProps = {
  setErrorMessage: (error: string) => void;
};

export const AddProjectDialog = ({
  setErrorMessage,
}: AddProjectDialogProps) => {
  const { t } = useI18n();
  const [projectDialogState, setProjectDialogState] = useAtom(projectDialogStateAtom);

  const { openDialog } = useUIAppState();

  useEffect(() => {
    if (openDialog) {
      setProjectDialogState({ isOpen: false });
    }
  }, [openDialog, setProjectDialogState]);
  

  const [projectName, setProjectName] = useState<string>("");

  const handleSubmit = async () => {
    try {
      await addProject({projectName});
      toast.success("New Project created.");
      setProjectDialogState({ isOpen: false });
    } catch (error: any) {
      const msg = error.response?.data?.message[0] || "Create project failed!";
      setErrorMessage(msg);
    }
  };

  if (!projectDialogState.isOpen) {
    return null;
  }
  
  return (
    <Dialog onCloseRequest={() => setProjectDialogState({ isOpen: false })} title={false} size="small">
      <div className="ProjectDialog" style={{gap: '1.5rem'}}>
        <h3 className="ProjectDialog__active__header">
          Create new project
        </h3>
        <TextField
          placeholder="Name"
          label="Enter project name"
          value={projectName}
          onChange={setProjectName}
          onKeyDown={(event) => event.key === KEYS.ENTER && handleSubmit()}
        />
        <div className="ProjectDialog__active__description">
          <p>{t("encrypted.tooltip")}</p>
        </div>

        <div className="ProjectDialog__active__actions">
          <FilledButton
            size="large"
            variant="outlined"
            color="primary"
            label={t("buttons.cancel")}
            onClick={() => setProjectDialogState({ isOpen: false })}
          />
          <FilledButton
            size="large"
            label={t("buttons.confirm")}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </Dialog>
  );
};
