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
import { getProjects, saveSceneToProject } from "../api/project";
import { projectDialogStateAtom } from "../projects/AddProjectDialog";
import { ExcalidrawImperativeAPI } from "../../packages/excalidraw/types";
import { exportToBackend } from "../data";
import { getDefaultAppState } from "../../packages/excalidraw/appState";
import { useAuth } from "../pages/AuthContext";


export const dashboardSaveDialogStateAtom = atom<
  { isOpen: false } | { isOpen: true; }
>({ isOpen: false });

export type DashboardSaveDialogProps = {
  excalidrawAPI: ExcalidrawImperativeAPI | null;
  setErrorMessage: (error: string) => void;
  setLatestProjectId: (projectId: string|null) => void;
  setLatestSceneTitle: (title: string) => void;
  projectId: string|null;
  scaneTitle: string;
};

export const DashboardSaveDialog = ({
  excalidrawAPI,
  setErrorMessage,
  setLatestProjectId,
  setLatestSceneTitle,
  projectId,
  scaneTitle,
}: DashboardSaveDialogProps) => {
  const { t } = useI18n();
  const [dashboardSaveDialogState, setDashboardSaveDialogState] = useAtom(dashboardSaveDialogStateAtom);
  const [projectDialogState, setProjectDialogState] = useAtom(projectDialogStateAtom);

  const { openDialog } = useUIAppState();

  const { logout } = useAuth();

  useEffect(() => {
    if (openDialog) {
      setDashboardSaveDialogState({ isOpen: false });
    }
  }, [openDialog, setDashboardSaveDialogState]);

  const [loading, setLoading] = useState<boolean>(true);
  const [projects, setProjects] = useState<any>([]);
  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      try {
        const resp = await getProjects();
        setProjects(resp);
      } catch (error: any) {
        const msg = error.response?.data?.message[0] || "Load projects failed!";
        setErrorMessage(msg);
        if (error.response?.status == 401) logout();
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, [projectDialogState.isOpen]);

  const handleSubmit = async () => {
    if (!excalidrawAPI) {
      setErrorMessage(t("alerts.cannotExportEmptyCanvas"));
      return;
    }
    if (excalidrawAPI.getSceneElements().length === 0) {
      setErrorMessage(t("alerts.cannotExportEmptyCanvas"));
      return;
    }

    const appState = excalidrawAPI.getAppState();
    const elements = excalidrawAPI.getSceneElements();
    const files = excalidrawAPI.getFiles();

    try {
      
      const { url, errorMessage } = await exportToBackend(
        elements,
        {
          ...appState,
          viewBackgroundColor: appState.exportBackground
            ? appState.viewBackgroundColor
            : getDefaultAppState().viewBackgroundColor,
        },
        files,
      );

      if (errorMessage) {
        setErrorMessage(errorMessage);
      }

      if (url) {
        const dataInput = {
          title: scaneTitle,
          project: projectId,
          value: new URL(url).hash
        }
        
        await saveSceneToProject(dataInput);
        toast.success("Saved successfully.");
        setDashboardSaveDialogState({ isOpen: false });
      }
    } catch (error: any) {
      const msg = error.response?.data?.message[0] || "Save to project failed!";
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
          value={scaneTitle}
          onChange={setLatestSceneTitle}
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
            onChange={({ target }) => setLatestProjectId(target.value)}
            value={projectId ? projectId : ""}
            aria-label={"Select project"}
            style={{width: "100%"}}
          >
            <option value={""}>{loading ? 'Loading projects...': ''}</option>
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
