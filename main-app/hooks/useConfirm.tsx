import { useContext, useEffect, useState } from "react";
import { ConfirmContext } from "providers/ConfirmContextProvider";

export const useConfirm = () => {
  const [confirm, setConfirm] = useContext(ConfirmContext);
  const [needsCleanup] = useState(false);

  const isConfirmed = (prompt: string) => {
    const promise = new Promise((resolve, reject) => {
      setConfirm({
        prompt,
        isOpen: true,
        proceed: resolve,
        cancel: reject,
      });
    });
    return promise.then(
      () => {
        setConfirm({ ...confirm, isOpen: false });
        return true;
      },
      () => {
        setConfirm({ ...confirm, isOpen: false });
        return false;
      }
    );
  };

  useEffect(() => {
    return () => {
      if (confirm.cancel && needsCleanup) {
        confirm.cancel(undefined);
      }
    };
  }, [confirm, needsCleanup]);

  return {
    ...confirm,
    isConfirmed,
  };
};
