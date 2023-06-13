import { useEffect, useState } from "react";

interface Props {
  render: (onClick: any) => JSX.Element;
  callback: (status: any) => void;
}
const PWAInstallerPrompt = ({ render: InstallButton, callback }: Props) => {
  const createStatus = (object: any) => {
    return {
      isInstallAllowed: Object.prototype.hasOwnProperty.call(
        object,
        "isInstallAllowed"
      )
        ? object.isInstallAllowed
        : false,
      isInstallWatingConfirm: Object.prototype.hasOwnProperty.call(
        object,
        "isInstallWatingConfirm"
      )
        ? object.isInstallWatingConfirm
        : false,
      isInstalling: Object.prototype.hasOwnProperty.call(object, "isInstalling")
        ? object.isInstalling
        : false,
      isInstallCancelled: Object.prototype.hasOwnProperty.call(
        object,
        "isInstallCancelled"
      )
        ? object.isInstallCancelled
        : false,
      isInstallSuccess: Object.prototype.hasOwnProperty.call(
        object,
        "isInstallSuccess"
      )
        ? object.isInstallSuccess
        : false,
      isInstallFailed: Object.prototype.hasOwnProperty.call(
        object,
        "isInstallFailed"
      )
        ? object.isInstallFailed
        : false,
    };
  };

  const [installStatus, setInstallStatus] = useState<any>(createStatus({}));
  const [installEvent, setInstallEvent] = useState<any>(null);

  useEffect(() => {
    if (callback) {
      callback(installStatus);
    }
  }, [installStatus]);

  const beforeAppInstallpromptHandler = (e: any) => {
    e.preventDefault();
    if (!installStatus.isInstalling) {
      if (!installStatus.isInstallSuccess) {
        setInstallEvent(e);
        if (!installStatus.isInstallAllowed) {
          setInstallStatus(
            createStatus({
              isInstallAllowed: true,
              isInstallCancelled: installStatus.isInstallCancelled,
            })
          );
        }
      }
    }
  };

  const appInstalledHandler = (e: any) => {
    if (!installStatus.isInstallSuccess) {
      window.removeEventListener(
        "beforeinstallprompt",
        beforeAppInstallpromptHandler
      );
      e.preventDefault();
      setInstallStatus(createStatus({ isInstallSuccess: true }));
    }
  };

  useEffect(() => {
    window.addEventListener(
      "beforeinstallprompt",
      beforeAppInstallpromptHandler
    );
    window.addEventListener("appinstalled", appInstalledHandler);
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        beforeAppInstallpromptHandler
      );
      window.removeEventListener("appinstalled", appInstalledHandler);
    };
  }, []);

  const handleOnInstall = () => {
    setInstallStatus(createStatus({ isInstallWatingConfirm: true }));
    installEvent.prompt();
    installEvent.userChoice
      .then((choiceResult: any) => {
        if (choiceResult.outcome === "accepted") {
          setInstallStatus(
            createStatus({ isInstalling: true, isInstallAllowed: false })
          );
        } else {
          setInstallStatus(
            createStatus({ isInstallCancelled: true, isInstallAllowed: true })
          );
        }
      })
      .catch(() => {
        setInstallStatus(
          createStatus({ isInstallFailed: true, isInstallAllowed: true })
        );
      });
    setInstallEvent(null);
  };

  if (!installStatus.isInstallAllowed) {
    return null;
  }

  return <InstallButton onClick={handleOnInstall} />;
};

export default PWAInstallerPrompt;
