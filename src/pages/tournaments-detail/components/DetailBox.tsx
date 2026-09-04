import type { ReactNode } from "react";
import { userShell } from "../../../theme/userShellTheme";

interface DetailBoxProps {
  title: string;
  icon?: ReactNode;
  headerRight?: ReactNode;
  children: ReactNode;
}

const DetailBox = ({ title, icon, headerRight, children }: DetailBoxProps) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className={userShell.h2Lg}>{title}</h2>
        </div>
        {headerRight}
      </div>
      <div className={userShell.detailPanelLg}>{children}</div>
    </section>
  );
};

export default DetailBox;
