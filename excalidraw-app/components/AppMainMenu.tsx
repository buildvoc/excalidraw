import React from "react";
import {
  LoadIcon,
  loginIcon,
  PlusIcon,
  save,
  // ExcalLogo,
  // eyeIcon,
} from "../../packages/excalidraw/components/icons";
import type { Theme } from "../../packages/excalidraw/element/types";
import { MainMenu } from "../../packages/excalidraw/index";
// import { isExcalidrawPlusSignedUser } from "../app_constants";
import { LanguageList } from "../app-language/LanguageList";
// import { saveDebugState } from "./DebugCanvas";
import { useAuth } from "../pages/AuthContext";

export const AppMainMenu: React.FC<{
  onCollabDialogOpen: () => any;
  onDashboardSaveDialogOpen: () => any;
  onProjectDialogOpen: () => any;
  onMyProjectsDialogOpen: () => any;
  isCollaborating: boolean;
  isCollabEnabled: boolean;
  theme: Theme | "system";
  setTheme: (theme: Theme | "system") => void;
  refresh: () => void;
}> = React.memo((props) => {
  const { isAuthenticated, logout } = useAuth();
  return (
    <MainMenu>
      {isAuthenticated && (
        <>
          <MainMenu.Item
            onSelect={() => props.onProjectDialogOpen()}
            icon={PlusIcon}
          >
            Create new project
          </MainMenu.Item>
          <MainMenu.Item
            onSelect={() => props.onMyProjectsDialogOpen()}
            icon={LoadIcon}
          >
            My projects
          </MainMenu.Item>
          <MainMenu.Item
            onSelect={() => props.onDashboardSaveDialogOpen()}
            icon={save}
          >
            Save to project
          </MainMenu.Item>
        </>
      )}
      <MainMenu.DefaultItems.LoadScene />
      <MainMenu.DefaultItems.SaveToActiveFile />
      <MainMenu.DefaultItems.Export />
      <MainMenu.DefaultItems.SaveAsImage />
      {props.isCollabEnabled && (
        <MainMenu.DefaultItems.LiveCollaborationTrigger
          isCollaborating={props.isCollaborating}
          onSelect={() => props.onCollabDialogOpen()}
        />
      )}
      <MainMenu.DefaultItems.CommandPalette className="highlighted" />
      <MainMenu.DefaultItems.SearchMenu />
      <MainMenu.DefaultItems.Help />
      <MainMenu.DefaultItems.ClearCanvas />
      <MainMenu.Separator />
      {/* <MainMenu.ItemLink
        icon={ExcalLogo}
        href={`${
          import.meta.env.VITE_APP_PLUS_LP
        }/plus?utm_source=excalidraw&utm_medium=app&utm_content=hamburger`}
        className=""
      >
        Excalidraw+
      </MainMenu.ItemLink>
      <MainMenu.DefaultItems.Socials /> */}
      {isAuthenticated && (
        <>
          <MainMenu.Item
            icon={loginIcon} // You can use a different icon if preferred
            onClick={logout} // Call logout function on click
          >
            Sign out
          </MainMenu.Item>
        </>
      )}
      {/* <MainMenu.ItemLink
        icon={loginIcon}
        href={`${import.meta.env.VITE_APP_PLUS_APP}${
          isExcalidrawPlusSignedUser ? "" : "/sign-up"
        }?utm_source=signin&utm_medium=app&utm_content=hamburger`}
        className="highlighted"
      >
        {isExcalidrawPlusSignedUser ? "Sign in" : "Sign up"}
      </MainMenu.ItemLink> */}
      {/* {import.meta.env.DEV && (
        <MainMenu.Item
          icon={eyeIcon}
          onClick={() => {
            if (window.visualDebug) {
              delete window.visualDebug;
              saveDebugState({ enabled: false });
            } else {
              window.visualDebug = { data: [] };
              saveDebugState({ enabled: true });
            }
            props?.refresh();
          }}
        >
          Visual Debug
        </MainMenu.Item>
      )} */}
      <MainMenu.Separator />
      <MainMenu.DefaultItems.ToggleTheme
        allowSystemTheme
        theme={props.theme}
        onSelect={props.setTheme}
      />
      <MainMenu.ItemCustom>
        <LanguageList style={{ width: "100%" }} />
      </MainMenu.ItemCustom>
      <MainMenu.DefaultItems.ChangeCanvasBackground />
    </MainMenu>
  );
});
