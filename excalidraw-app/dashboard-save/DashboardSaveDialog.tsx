import { useEffect, useState } from "react";

import { useI18n } from "../../packages/excalidraw";
import { Dialog } from "../../packages/excalidraw/components/Dialog";
import { TextField } from "../../packages/excalidraw/components/TextField";
import { FilledButton } from "../../packages/excalidraw/components/FilledButton";
import { KEYS } from "../../packages/excalidraw/keys";
import { useUIAppState } from "../../packages/excalidraw/context/ui-appState";
import { atom, useAtom } from "jotai";

import "./DashboardSaveDialog.scss";
import { toast } from "react-toastify";
import { getProjects } from "../api/project";
import { projectDialogStateAtom } from "../projects/AddProjectDialog";


export const dashboardSaveDialogStateAtom = atom<
  { isOpen: false } | { isOpen: true; }
>({ isOpen: false });

export type DashboardSaveDialogProps = {
  setErrorMessage: (error: string) => void;
};

export const DashboardSaveDialog = ({
  setErrorMessage,
}: DashboardSaveDialogProps) => {
  const { t } = useI18n();
  const [dashboardSaveDialogState, setDashboardSaveDialogState] = useAtom(dashboardSaveDialogStateAtom);
  const [projectDialogState, setProjectDialogState] = useAtom(projectDialogStateAtom);

  const { openDialog } = useUIAppState();

  useEffect(() => {
    if (openDialog) {
      setDashboardSaveDialogState({ isOpen: false });
    }
  }, [openDialog, setDashboardSaveDialogState]);
  

  const [title, setTitle] = useState<string>("Untilted");
  const [selectedProject, setSelectedProject] = useState<string>();

  const [projects, setProjects] = useState<any>([]);
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const resp = await getProjects();
        setProjects(resp);
      } catch (error: any) {
        const msg = error.response?.data?.message[0] || "Load projects failed!";
        setErrorMessage(msg);
      }
    };
    loadProjects();
  }, [projectDialogState.isOpen]);

  const handleSubmit = async () => {
    try {

      console.log(selectedProject, title);
      
      
    } catch (error: any) {
      const msg = error.response?.data?.message[0] || "Save to dashboard failed!";
      setErrorMessage(msg);
    }
  };

  if (!dashboardSaveDialogState.isOpen) {
    return null;
  }
  
  return (
    <Dialog onCloseRequest={() => setDashboardSaveDialogState({ isOpen: false })} title={false} size="small">
      <div className="DashboardSaveDialog">
        <h3 className="DashboardSaveDialog__active__header">
          Save to project...
        </h3>
        <TextField
          placeholder="Title"
          label="Title"
          value={title}
          onChange={setTitle}
          onKeyDown={(event) => event.key === KEYS.ENTER && handleSubmit()}
        />
        <div className="ExcTextField--fullWidth">
          <div className="ExcTextField__label">
            Select project or {" "}
            <a className="ExcTextField__link"
              onClick={() => setProjectDialogState({isOpen: true})}
              >Add new</a>
          </div>
          <select
            className="dropdown-select dropdown-select__proj"
            onChange={({ target }) => setSelectedProject(target.value)}
            value={selectedProject}
            aria-label={"Select project"}
            style={{width: "100%"}}
          >
            {projects.map((item: any) => (
              <option key={item.id} value={item.id}>
                {item.projectName}
              </option>
            ))}
          </select>
        </div>
        <div className="DashboardSaveDialog__active__description">
          <p>{t("encrypted.tooltip")}</p>
        </div>

        <div className="DashboardSaveDialog__active__actions">
          <FilledButton
            size="large"
            variant="outlined"
            color="primary"
            label={t("buttons.cancel")}
            onClick={() => setDashboardSaveDialogState({isOpen: false})}
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
