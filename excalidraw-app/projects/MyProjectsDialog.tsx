import { useEffect, useState } from "react";

import { useI18n } from "../../packages/excalidraw/i18n";
import { Dialog } from "../../packages/excalidraw/components/Dialog";
import { useUIAppState } from "../../packages/excalidraw/context/ui-appState";
import { atom, useAtom } from "jotai";

import "./ProjectDialog.scss";
import { getProjects } from "../api/project";
import { LinkIcon, LoadIcon, } from "../../packages/excalidraw/components/icons";
import Spinner from "../../packages/excalidraw/components/Spinner";


export const myProjectsDialogStateAtom = atom<
  { isOpen: false } | { isOpen: true; }
>({ isOpen: false });

export type MyProjectsDialogProps = {
  setLatestProjectId: (projectId: string|null) => void;
  setLatestSceneTitle: (title: string) => void;
  setErrorMessage: (error: string) => void;
};

export const MyProjectsDialog = ({
  setLatestProjectId,
  setLatestSceneTitle,
  setErrorMessage,
}: MyProjectsDialogProps) => {
  const { t } = useI18n();
  const [myProjectDialogState, setMyProjectsDialogState] = useAtom(myProjectsDialogStateAtom);

  const { openDialog } = useUIAppState();
  

  useEffect(() => {
    if (openDialog) {
      setMyProjectsDialogState({ isOpen: false });
    }
  }, [openDialog, setMyProjectsDialogState]);

  const [filteredProjectId, setFilteredProjectId] = useState<string>("");
  const [projects, setProjects] = useState<any>([]);
  const [projectOpts, setProjectsOpts] = useState<any>([]);

  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      try {
        const resp = await getProjects();
        setProjects(resp);
        setProjectsOpts(resp);
      } catch (error: any) {
        const msg = error.response?.data?.message[0] || "Load projects failed!";
        setErrorMessage(msg);
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  if (!myProjectDialogState.isOpen) {
    return null;
  }
  
  return (
    <Dialog onCloseRequest={() => setMyProjectsDialogState({ isOpen: false })} title={false} size="small">
      <div className="ProjectDialog">
        <h3 className="ProjectDialog__active__header">
          My projects
        </h3>
        <div className="ExcTextField--fullWidth" style={{marginTop: '1.5rem', marginBottom: '1.5rem'}}>
          <div className="ExcTextField__label">
            Filter by project 
          </div>
          <select
            className="dropdown-select dropdown-select__proj"
            onChange={({ target }) => {
              setLatestProjectId(target.value);
              setFilteredProjectId(target.value);
            }}
            value={filteredProjectId ? filteredProjectId : ""}
            aria-label={"Select project"}
            style={{width: "100%"}}
          >
            <option value={""}>{loading ? 'Loading projects...': 'My projects'}</option>
            {projectOpts.map((item: any) => (
              <option key={item.id} value={item.id}>
                {item.projectName}
              </option>
            ))}
          </select>
        </div>

        {!loading && projects.filter((f: any) => filteredProjectId ? f.id == filteredProjectId: true).map((item: any) => {
          return (
            <div key={item.id}>
              <div className={`welcome-screen-menu-item`} style={{maxWidth: 'unset', cursor: 'pointer'}} onClick={() => setFilteredProjectId(item.id)}>
                <div className="welcome-screen-menu-item__icon">{LoadIcon}</div>
                <div className="welcome-screen-menu-item__text">{item.projectName}</div>
                <div className="welcome-screen-menu-item__shortcut">{item.draws.length} files</div>
              </div>
              {item.draws.map((d: any) => (
                <a
                  key={d.id}
                  className={`welcome-screen-menu-item`}
                  href={d.value}
                  onClick={() => {
                    setLatestProjectId(item.id);
                    setLatestSceneTitle(d.title);
                    setMyProjectsDialogState({ isOpen: false });
                  }}
                  style={{maxWidth: 'unset', width: 'unset', marginLeft: 24}}
                >
                  <>
                    <div className="welcome-screen-menu-item__icon">{LinkIcon}</div>
                    <div className="welcome-screen-menu-item__text">{d.title}</div>
                    <div className="welcome-screen-menu-item__shortcut">{"Open"}</div>
                  </>
                </a>
              ))}
            </div>
          );
        })}

        {loading && <Spinner />}

        <div className="ProjectDialog__active__description" style={{marginTop: '1.5rem'}}>
          <p>{t("encrypted.tooltip")}</p>
        </div>
      </div>
    </Dialog>
  );
};
